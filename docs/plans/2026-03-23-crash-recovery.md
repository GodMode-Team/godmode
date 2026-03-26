# Crash Recovery & Never-Stranded UX

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure GodMode users never stare at a dead screen without knowing what happened or how to recover.

**Architecture:** Three layers — (1) crash sentinel catches unhandled errors and writes diagnostics before process exits, (2) UI never gives up reconnecting and shows actionable help when gateway is down, (3) ally gets crash context on restart and proactively explains what happened.

**Tech Stack:** Node.js process handlers, existing restart-sentinel pattern, Lit web components, existing gather-context-inputs pipeline.

---

### Task 1: Crash Sentinel — Write Diagnostics Before Process Death

**Files:**
- Modify: `src/lib/restart-sentinel.ts` (add crash sentinel type + writer)
- Modify: `src/hooks/gateway-start.ts:24-100` (register global handlers on startup)

**Step 1: Extend restart-sentinel.ts with crash support**

Add a `writeCrashSentinel` function that writes error details alongside the existing restart sentinel pattern. The existing `RestartSentinel.reason` field already supports `"unknown"` — we extend the interface to carry crash details.

Open `src/lib/restart-sentinel.ts` and add after the existing `RestartInfo` interface (after line 28):

```typescript
export interface CrashSentinel {
  ts: number;
  pid: number;
  error: string;
  stack: string;
  type: "uncaughtException" | "unhandledRejection";
  activeSessions: string[];
}

export interface CrashInfo {
  downtimeMs: number;
  error: string;
  stack: string;
  type: string;
  previousSessions: string[];
}

let lastCrash: CrashInfo | null = null;
```

Add the crash sentinel path constant near the existing `SENTINEL_PATH`:

```typescript
const CRASH_SENTINEL_PATH = join(DATA_DIR, "crash-sentinel.json");
```

Add the writer function after `writeSentinel`:

```typescript
/**
 * Write crash sentinel before process death. Called from global error handlers.
 * Synchronous — must complete before process exits.
 */
export function writeCrashSentinel(
  error: string,
  stack: string,
  type: CrashSentinel["type"],
  activeSessions: string[] = [],
): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const sentinel: CrashSentinel = {
      ts: Date.now(),
      pid: process.pid,
      error,
      stack,
      type,
      activeSessions,
    };
    writeFileSync(CRASH_SENTINEL_PATH, JSON.stringify(sentinel, null, 2), "utf-8");
  } catch { /* last-resort — if we can't write, at least we tried */ }
}
```

Add the consumer function after `consumeSentinel`:

```typescript
/**
 * Read and consume crash sentinel on startup.
 */
export function consumeCrashSentinel(): CrashInfo | null {
  try {
    if (!existsSync(CRASH_SENTINEL_PATH)) return null;
    const raw = readFileSync(CRASH_SENTINEL_PATH, "utf-8");
    unlinkSync(CRASH_SENTINEL_PATH);
    const sentinel: CrashSentinel = JSON.parse(raw);
    const info: CrashInfo = {
      downtimeMs: Date.now() - sentinel.ts,
      error: sentinel.error,
      stack: sentinel.stack,
      type: sentinel.type,
      previousSessions: sentinel.activeSessions,
    };
    lastCrash = info;
    return info;
  } catch {
    return null;
  }
}

export function getLastCrash(): CrashInfo | null {
  return lastCrash;
}

export function clearLastCrash(): void {
  lastCrash = null;
}
```

**Step 2: Register global crash handlers in gateway-start.ts**

In `runGatewayStart()`, add after the duplicate plugin guard (after line 54, after `g.__godmodeInstanceId = pluginRoot;`):

```typescript
  // ── Global Crash Handlers — write diagnostics before process death ──
  // These are last-resort handlers. They write a crash sentinel so the next
  // startup can tell the user what happened. We do NOT prevent the crash —
  // swallowing errors causes worse problems than a clean restart.
  if (!g.__godmodeCrashHandlersRegistered) {
    const { writeCrashSentinel } = await import("../lib/restart-sentinel.js");

    process.on("uncaughtException", (err) => {
      logger.error(`[GodMode] CRASH: Uncaught exception: ${err.message}`);
      const activeKeys = sessions.activeKeys();
      writeCrashSentinel(
        err.message,
        err.stack ?? "no stack",
        "uncaughtException",
        activeKeys,
      );
      // Write normal restart sentinel too (with reason "crash")
      const serviceNames = serviceCleanup.map((s) => s.name);
      writeSentinel(activeKeys, serviceNames, "unknown");
      // Let Node's default handler terminate the process
    });

    process.on("unhandledRejection", (reason) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? (reason.stack ?? "no stack") : "no stack";
      logger.error(`[GodMode] CRASH: Unhandled rejection: ${msg}`);
      const activeKeys = sessions.activeKeys();
      writeCrashSentinel(msg, stack, "unhandledRejection", activeKeys);
      const serviceNames = serviceCleanup.map((s) => s.name);
      writeSentinel(activeKeys, serviceNames, "unknown");
    });

    g.__godmodeCrashHandlersRegistered = true;
  }
```

**Step 3: Read crash sentinel on startup**

In `runGatewayStart()`, right after the existing restart sentinel block (after line 98), add:

```typescript
  // ── Crash Sentinel — detect if previous shutdown was a crash ─────
  try {
    const { consumeCrashSentinel } = await import("../lib/restart-sentinel.js");
    const crashInfo = consumeCrashSentinel();
    if (crashInfo) {
      const downtimeSec = Math.round(crashInfo.downtimeMs / 1000);
      logger.warn(
        `[GodMode] Recovered from CRASH (downtime: ${downtimeSec}s, ` +
        `type: ${crashInfo.type}, error: ${crashInfo.error})`,
      );
      health.signal("gateway.crash-recovery", true, {
        downtimeMs: crashInfo.downtimeMs,
        type: crashInfo.type,
        error: crashInfo.error,
        previousSessionCount: crashInfo.previousSessions.length,
      });
      turnErrors.capture(
        "gateway-crash",
        `GodMode crashed ${downtimeSec}s ago (${crashInfo.type}: ${crashInfo.error}). Now recovered.`,
      );
    }
  } catch { /* non-fatal */ }
```

**Step 4: Build and verify**

Run: `pnpm build`
Expected: Clean build, no type errors.

**Step 5: Commit**

```bash
git add src/lib/restart-sentinel.ts src/hooks/gateway-start.ts
git commit -m "feat: crash sentinel — write diagnostics before process death

Registers global uncaughtException/unhandledRejection handlers that
write crash details to ~/godmode/data/crash-sentinel.json before the
process exits. On next startup, the crash info is consumed and surfaced
to the ally via turnErrors so users know what happened."
```

---

### Task 2: UI Never Gives Up — Persistent Reconnection + Offline Help

**Files:**
- Modify: `ui/src/ui/app-gateway.ts:271-373` (reconnect logic)
- Modify: `ui/src/ui/app-render.ts:1068-1078` (status pill rendering)

**Step 1: Change reconnect to never give up**

In `ui/src/ui/app-gateway.ts`, replace the reconnect constants and logic.

Change line 271:
```typescript
const MAX_RECONNECT_ATTEMPTS = 10;
```
to:
```typescript
const FAST_RECONNECT_ATTEMPTS = 10;
```

In `scheduleReconnect` function (lines 344-374), replace the give-up logic:

Replace this block:
```typescript
  const attempt = (host.reconnectAttempt ?? 0) + 1;
  if (attempt > MAX_RECONNECT_ATTEMPTS) {
    host.lastError = "Connection lost. Please refresh the page.";
    host.reconnecting = false;
    return;
  }

  host.reconnectAttempt = attempt;
  host.reconnecting = true;

  / Exponential backoff: 1s, 2s, 4s, 8s, ... capped at 30s
  const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempt - 1), 30000);
```

With:
```typescript
  const attempt = (host.reconnectAttempt ?? 0) + 1;
  host.reconnectAttempt = attempt;
  host.reconnecting = true;

  // Fast backoff for first 10 attempts (1s→30s), then slow poll every 60s
  const delay = attempt <= FAST_RECONNECT_ATTEMPTS
    ? Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempt - 1), 30000)
    : 60_000;
```

Also update the debug comment at line 366:
```typescript
  // console.log(`[gateway] Reconnecting in ${delay}ms (attempt ${attempt})`);
```

**Step 2: Improve the offline UI in app-render.ts**

In `ui/src/ui/app-render.ts`, replace the status pill block (lines ~1069-1078).

Replace:
```typescript
            ${
              state.reconnecting
                ? html`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${state.reconnectAttempt > 1 ? ` (attempt ${state.reconnectAttempt})` : ""}...
                </div>`
                : state.lastError
                  ? html`<div class="pill ${state.lastError.startsWith("✓") ? "success" : "danger"}">${state.lastError}</div>`
                  : nothing
            }
```

With:
```typescript
            ${
              state.reconnecting
                ? state.reconnectAttempt > FAST_RECONNECT_ATTEMPTS
                  ? html`<div class="pill danger gateway-offline">
                      Gateway offline — retrying every 60s (attempt ${state.reconnectAttempt}).
                      Try: <code>oc gateway restart</code>
                    </div>`
                  : html`<div class="pill warning reconnecting">
                      <span class="reconnect-spinner"></span>
                      Reconnecting${state.reconnectAttempt > 1 ? ` (attempt ${state.reconnectAttempt})` : ""}...
                    </div>`
                : state.lastError
                  ? html`<div class="pill ${state.lastError.startsWith("✓") ? "success" : "danger"}">${state.lastError}</div>`
                  : nothing
            }
```

You'll need to import the constant. At the top of `app-render.ts`, add alongside existing app-gateway imports (or just inline the constant `10` if import is circular — check if app-render already imports from app-gateway):

If app-render doesn't import from app-gateway, just use the literal `10`:
```typescript
                ? state.reconnectAttempt > 10
```

**Step 3: Build UI and verify**

Run: `pnpm build:ui && pnpm build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add ui/src/ui/app-gateway.ts ui/src/ui/app-render.ts
git commit -m "feat: UI never gives up reconnecting, shows offline help

After 10 fast reconnect attempts, switches to 60s polling and shows
'Gateway offline' with restart instructions. Never leaves the user
staring at a dead screen with no way back."
```

---

### Task 3: Ally Crash Transparency — Context Injection After Crash

**Files:**
- Modify: `src/lib/gather-context-inputs.ts:435-449` (add crash info after restart awareness block)

**Step 1: Add crash context injection**

In `src/lib/gather-context-inputs.ts`, after the existing restart awareness block (after line 449, after the `clearLastRestart()` call), add:

```typescript
  // Crash recovery awareness
  try {
    const { getLastCrash, clearLastCrash } = await import("./restart-sentinel.js");
    const crash = getLastCrash();
    if (crash && crash.downtimeMs < 30 * 60 * 1000) {
      const downtimeSec = Math.round(crash.downtimeMs / 1000);
      safetyNudges.push(
        `## Crash Recovery\n` +
        `GodMode crashed ${downtimeSec}s ago and has recovered.\n` +
        `- Type: ${crash.type}\n` +
        `- Error: ${crash.error}\n` +
        `- Sessions affected: ${crash.previousSessions.length}\n\n` +
        `Tell the user proactively: "I crashed a moment ago — [brief explanation of the error]. ` +
        `Everything is back online now. Let me know if anything seems off."\n` +
        `Do NOT hide the crash. Users trust transparency.`,
      );
      clearLastCrash();
    }
  } catch (e) { logger.warn(`[GodMode][gather] Crash sentinel error: ${(e as Error).message}`); }
```

**Step 2: Build and verify**

Run: `pnpm build`
Expected: Clean build.

**Step 3: Commit**

```bash
git add src/lib/gather-context-inputs.ts
git commit -m "feat: ally explains crashes proactively after recovery

On startup after a crash, injects crash details into ally context so
it can tell the user what happened, that everything is back online,
and ask if anything seems off. Transparency builds trust."
```

---

### Task 4: Reconnect Toast Shows Crash Reason

**Files:**
- Modify: `ui/src/ui/app-gateway.ts:598-618` (enhance reconnect toast)

**Step 1: Query crash info on reconnect and show enhanced toast**

In the `onHello` handler, after the reconnect toast block (lines 606-618), enhance it to fetch crash context from the gateway.

Replace:
```typescript
      if (wasReconnecting) {
        const app = host as unknown as GodModeApp;
        if (typeof app.showToast === "function") {
          app.showToast("Gateway reconnected", "success", 4000);
        }
        // Also show brief inline message for backward compatibility
        host.lastError = "✓ Reconnected";
        setTimeout(() => {
          if (host.lastError === "✓ Reconnected") {
            host.lastError = null;
          }
        }, 3000);
```

With:
```typescript
      if (wasReconnecting) {
        const app = host as unknown as GodModeApp;
        // Check if recovery was from a crash (gateway exposes this via health RPC)
        let toastMsg = "Gateway reconnected";
        try {
          const healthResult = await host.client!.request<{
            crashRecovery?: { error?: string; downtimeMs?: number };
          }>("godmode.health", {});
          if (healthResult?.crashRecovery) {
            const secs = Math.round((healthResult.crashRecovery.downtimeMs ?? 0) / 1000);
            toastMsg = `Recovered from crash (${secs}s downtime). Everything is back online.`;
          }
        } catch { /* health RPC may not exist — that's fine */ }
        if (typeof app.showToast === "function") {
          app.showToast(toastMsg, "success", 6000);
        }
        host.lastError = "✓ Reconnected";
        setTimeout(() => {
          if (host.lastError === "✓ Reconnected") {
            host.lastError = null;
          }
        }, 3000);
```

**Step 2: Expose crash info in the health RPC**

In `index.ts`, find the `godmode.health` RPC handler (around line 464). Modify it to include crash info.

Near the top of the handler, add:
```typescript
        const { getLastCrash } = await import("./lib/restart-sentinel.js");
        const crash = getLastCrash();
```

And include in the return object:
```typescript
        crashRecovery: crash ? {
          error: crash.error,
          downtimeMs: crash.downtimeMs,
          type: crash.type,
          previousSessions: crash.previousSessions,
        } : undefined,
```

Note: Don't clear the crash here — let `gather-context-inputs` clear it after the ally has seen it.

**Step 3: Build everything**

Run: `pnpm build:ui && pnpm build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add ui/src/ui/app-gateway.ts index.ts
git commit -m "feat: reconnect toast shows crash reason when recovering

On reconnect after a crash, UI queries godmode.health for crash info
and shows an enhanced toast: 'Recovered from crash (Xs downtime)'.
Normal reconnects still show the simple 'Gateway reconnected' toast."
```

---

### Task 5: Smoke Test — Verify Crash Sentinel Round-Trip

**Files:**
- Create: `tests/smoke-crash-sentinel.mjs`

**Step 1: Write smoke test**

```javascript
/**
 * smoke-crash-sentinel.mjs — Verify crash sentinel write/read round-trip.
 *
 * Usage: node tests/smoke-crash-sentinel.mjs
 */

import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const DATA_DIR = process.env.GODMODE_ROOT
  ? join(process.env.GODMODE_ROOT, "data")
  : join(homedir(), "godmode", "data");

const CRASH_SENTINEL_PATH = join(DATA_DIR, "crash-sentinel.json");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

// Clean up any existing sentinel
if (existsSync(CRASH_SENTINEL_PATH)) {
  unlinkSync(CRASH_SENTINEL_PATH);
}

console.log("Crash Sentinel Smoke Test\n");

// Test 1: Write a crash sentinel
console.log("1. Write crash sentinel");
mkdirSync(DATA_DIR, { recursive: true });
const sentinel = {
  ts: Date.now(),
  pid: process.pid,
  error: "Test error: something broke",
  stack: "Error: something broke\n    at test.mjs:1:1",
  type: "uncaughtException",
  activeSessions: ["ally", "test-session"],
};
writeFileSync(CRASH_SENTINEL_PATH, JSON.stringify(sentinel, null, 2), "utf-8");
assert(existsSync(CRASH_SENTINEL_PATH), "Crash sentinel file written");

// Test 2: Read it back
console.log("2. Read crash sentinel");
const raw = readFileSync(CRASH_SENTINEL_PATH, "utf-8");
const parsed = JSON.parse(raw);
assert(parsed.error === "Test error: something broke", "Error message preserved");
assert(parsed.type === "uncaughtException", "Crash type preserved");
assert(parsed.activeSessions.length === 2, "Active sessions preserved");
assert(parsed.pid === process.pid, "PID preserved");

// Test 3: Consume (delete) it
console.log("3. Consume sentinel (one-shot)");
unlinkSync(CRASH_SENTINEL_PATH);
assert(!existsSync(CRASH_SENTINEL_PATH), "Sentinel consumed (deleted)");

// Test 4: Verify downtime calculation works
console.log("4. Downtime calculation");
const downtimeMs = Date.now() - sentinel.ts;
assert(downtimeMs >= 0 && downtimeMs < 5000, `Downtime reasonable: ${downtimeMs}ms`);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

**Step 2: Run smoke test**

Run: `node tests/smoke-crash-sentinel.mjs`
Expected: All assertions pass.

**Step 3: Commit**

```bash
git add tests/smoke-crash-sentinel.mjs
git commit -m "test: smoke test for crash sentinel round-trip"
```

---

### Task 6: Final Build + UI Sync

**Step 1: Full build**

Run: `pnpm build:ui && pnpm ui:sync && pnpm build`
Expected: Clean build. If `ui:sync` shows changes, include them.

**Step 2: Verify no forbidden imports**

Run: `rg "\.\./\.\./\.\./\.\./src/" -n`
Expected: No matches.

**Step 3: Final commit (if ui:sync produced changes)**

```bash
git add assets/godmode-ui/
git commit -m "chore: sync UI snapshot after crash recovery changes"
```
