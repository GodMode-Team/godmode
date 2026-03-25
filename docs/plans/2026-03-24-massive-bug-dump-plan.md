# Massive Bug Dump — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 7 bugs across Paperclip delivery, Workspaces loading, Brain page, Overview tab, and Trust tracker UX — then design the Custom Tabs extensibility system.

**Architecture:** Four phases of increasing scope. Phase 1 fixes daily-driver blockers (Paperclip results + Workspaces). Phase 2 polishes Brain page and restores Overview tab. Phase 3 improves Trust tracker data provenance UX. Phase 4 designs the Custom Tabs extensibility architecture.

**Tech Stack:** TypeScript ESM, Lit web components, OpenClaw plugin SDK, Vite.

**Review decisions (2026-03-24 eng review):**
- 1A: RPC timeout clears timer on success (no timer leak)
- 2C: Fallback injection goes to active session regardless of context
- 4A: Extract `injectCompletionNotification()` helper to DRY the injection template
- 5A: Remove `engineExpanded` state entirely — engine always visible
- 6B: Write slim new Overview tab (~80 lines) instead of restoring 397-line original
- 7A: Unit tests for RPC timeout + browser test for completion injection only
- 8A: Default RPC timeout 10s, callers can override for slow operations

---

## Phase 1 — Critical Bugs (B1 + B2)

### Task 1: Add RPC timeout to gateway client (B2 foundation)

The gateway RPC client (`ui/src/ui/gateway.ts:295-306`) has zero timeout on requests. If the backend hangs, promises never resolve. This blocks Workspaces and potentially any slow page.

**Files:**
- Modify: `ui/src/ui/gateway.ts:295-306`
- Test: `ui/src/ui/__tests__/gateway-timeout.test.ts` (new)

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";

// Test the timeout race logic in isolation
describe("gateway RPC timeout", () => {
  it("rejects with timeout error if response takes too long", async () => {
    // Simulate a request that never resolves
    const neverResolve = new Promise<never>(() => {});
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("RPC timeout: test.method (50ms)")), 50);
    });
    await expect(Promise.race([neverResolve, timeout])).rejects.toThrow("RPC timeout");
  });

  it("resolves normally if response arrives before timeout", async () => {
    const fast = Promise.resolve("ok");
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("RPC timeout")), 1000);
    });
    const result = await Promise.race([fast, timeout]);
    expect(result).toBe("ok");
  });
});
```

**Step 2: Run test to verify it passes (these test the pattern, not the integration)**

Run: `cd /Users/calebhodges/Projects/godmode-plugin && npx vitest run ui/src/ui/__tests__/gateway-timeout.test.ts`

**Step 3: Add timeout with timer cleanup to `request()` method**

Replace the current `request` method with one that races against a timeout and cleans up the timer on success:

```typescript
request<T = unknown>(method: string, params?: unknown, timeoutMs = 10_000): Promise<T> {
  if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error("gateway not connected"));
  }
  const id = generateUUID();
  const frame = { type: "req", id, method, params };

  let timer: ReturnType<typeof setTimeout> | null = null;

  const p = new Promise<T>((resolve, reject) => {
    this.pending.set(id, {
      resolve: (v) => {
        if (timer) clearTimeout(timer);
        resolve(v as T);
      },
      reject: (e) => {
        if (timer) clearTimeout(timer);
        reject(e);
      },
    });
  });
  this.ws.send(JSON.stringify(frame));

  // Race against timeout so hanging RPCs don't block the UI forever
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      this.pending.delete(id);
      reject(new Error(`RPC timeout: ${method} (${timeoutMs}ms)`));
    }, timeoutMs);
  });
  return Promise.race([p, timeout]);
}
```

**Step 4: Build UI to verify no type errors**

Run: `pnpm build:ui`
Expected: Clean build, no errors.

**Step 5: Commit**

```bash
git add ui/src/ui/gateway.ts ui/src/ui/__tests__/gateway-timeout.test.ts
git commit -m "fix(ui): add RPC timeout to gateway client — 10s default, timer cleanup on success"
```

---

### Task 2: Add per-call fallbacks to workspace feed/connections (B2 fix)

Even with the global timeout, workspace feed and connections should fail independently so one hanging call doesn't block the other.

**Files:**
- Modify: `ui/src/ui/controllers/workspaces.ts:258-270`

**Step 1: Add independent `.catch()` per call**

Replace lines 258-270:

```typescript
// Load feed and connections in parallel — fail independently
try {
  const [feedEntries, connections] = await Promise.all([
    loadFeed(state, id).catch(() => []),
    loadConnections(state, id).catch(() => []),
  ]);
  detail.feedEntries = feedEntries;
  detail.connections = connections;
  detail.feedCount = feedEntries.length;
  detail.connectionCount = connections.length;
} catch {
  // Non-fatal — workspace detail works without feed/connections
}
```

Note: The global RPC timeout (Task 1) now handles hanging calls. The `.catch(() => [])` per-call ensures one failing doesn't block the other.

**Step 2: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 3: Commit**

```bash
git add ui/src/ui/controllers/workspaces.ts
git commit -m "fix(workspaces): graceful fallback for feed/connections loading"
```

---

### Task 3: Add diagnostic logging to Paperclip session notification chain (B1)

The Paperclip → session notification pipeline exists but breaks silently. Every `catch {}` swallows errors. Add logging so we can see WHERE the chain breaks.

**Files:**
- Modify: `src/methods/paperclip-webhook.ts:136-159`
- Modify: `src/lib/session-notifier.ts:24-34`

**Step 1: Add logging to paperclip-webhook session lookup**

In `src/methods/paperclip-webhook.ts`, replace lines 136-159:

```typescript
if (pluginApiRef) {
  try {
    const { listProjects } = await import("../lib/projects-state.js");
    const projects = await listProjects();
    const project = projects.find((p: any) =>
      p.issues?.some((iss: any) => iss.queueItemId === issueId),
    );
    const sessionKey = project?.sessionKey;
    if (!sessionKey) {
      logger?.warn?.(`[paperclip-webhook] No sessionKey found for issueId=${issueId}. Projects searched: ${projects.length}. Result will appear in inbox only.`);
    } else {
      logger?.info?.(`[paperclip-webhook] Routing completion to session=${sessionKey} for issueId=${issueId}`);
    }
    notifySession(
      pluginApiRef,
      sessionKey,
      `[Agent completed] "${title}" is ready for review. Output: ${filePath}`,
      "ally:notification",
      {
        type: "queue-complete",
        title,
        summary: `Agent finished "${title}" — ready for review.`,
        outputPath: filePath,
        sessionKey,
      },
    );
  } catch (err) {
    logger?.error?.(`[paperclip-webhook] Session notification failed for issueId=${issueId}:`, err);
  }
}
```

**Step 2: Add logging to session-notifier**

In `src/lib/session-notifier.ts`, replace lines 24-34:

```typescript
if (sessionKey) {
  try {
    const enqueue = api.runtime?.system?.enqueueSystemEvent;
    if (typeof enqueue === "function") {
      enqueue(message, { sessionKey });
    } else {
      console.warn(`[session-notifier] enqueueSystemEvent not available — sessionKey=${sessionKey} notification dropped`);
    }
  } catch (err) {
    console.warn(`[session-notifier] Failed to enqueue event for session=${sessionKey}:`, err);
  }
} else {
  console.warn(`[session-notifier] No sessionKey — broadcast-only notification`);
}
```

**Step 3: Build backend**

Run: `pnpm build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add src/methods/paperclip-webhook.ts src/lib/session-notifier.ts
git commit -m "fix(paperclip): add diagnostic logging to session notification chain"
```

---

### Task 4: Ensure Paperclip broadcast reaches UI even without sessionKey (B1 fallback)

If sessionKey lookup fails, the broadcast still fires but the UI handler at `app-gateway.ts:1348` requires sessionKey match. Add a fallback: if no sessionKey in payload, inject into the CURRENT active session. Extract the injection logic into a helper to DRY the two call sites.

**Files:**
- Modify: `ui/src/ui/app-gateway.ts:1328-1365`

**Step 1: Extract `injectCompletionNotification` helper**

Add above the event handler:

```typescript
/** Inject a queue/Paperclip completion notification into the chat message stream. */
function injectCompletionNotification(
  chatHost: { chatMessages?: Array<Record<string, unknown>>; requestUpdate?: () => void },
  payload: { title?: string; outputPreview?: string; outputPath?: string },
): void {
  if (!chatHost.chatMessages) return;
  const preview = payload.outputPreview
    ? `\n\n${payload.outputPreview.slice(0, 800)}${payload.outputPreview.length > 800 ? "\u2026" : ""}`
    : "";
  const outputNote = payload.outputPath
    ? `\n\nFull output: \`${payload.outputPath}\``
    : "";
  chatHost.chatMessages = [...chatHost.chatMessages, {
    role: "assistant",
    content: `**Agent completed: "${payload.title || "Queue item"}"**${preview}${outputNote}\n\n_Reply to review, approve, or ask follow-up questions._`,
    timestamp: Date.now(),
    isNotification: true,
  }];
  chatHost.requestUpdate?.();
}
```

**Step 2: Replace both injection sites with the helper**

Replace the existing sessionKey-match block (lines 1348-1361) AND add the fallback:

```typescript
if (compPayload.sessionKey && chatHost.sessionKey === compPayload.sessionKey) {
  injectCompletionNotification(chatHost, compPayload);
} else if (!compPayload.sessionKey) {
  // Fallback: inject into active session when session tracking fails
  injectCompletionNotification(chatHost, compPayload);
}
```

**Step 3: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 4: Commit**

```bash
git add ui/src/ui/app-gateway.ts
git commit -m "fix(paperclip): extract injection helper + fallback to active session when sessionKey missing"
```

---

## Phase 2 — UI Polish (B3, B4, B5, B6)

### Task 5: Fix Brain page heading redundancy (B3)

Remove the `<h1>Your Brain</h1>` since the Identity Card already shows the user's name. The page title in the sidebar + subtitle is sufficient.

**Files:**
- Modify: `ui/src/ui/tabs/brain-tab.ts:378-386`

**Step 1: Remove redundant h1, simplify header to scroll-to-engine anchor**

Replace lines 378-386 — remove the h1 and convert button to a scroll anchor (no toggle state):

```typescript
<div class="brain-header">
  <button
    class="brain-engine-toggle"
    @click=${() => { this.renderRoot.querySelector(".brain-engine")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
    title="Scroll to Engine panel"
    aria-label="Scroll to Engine panel"
  >${"\u2699\uFE0F"} Engine ${this.pulse?.systems ? html`<span class="brain-engine-badge">${this.pulse.systems.filter(s => s.status === "ready").length}/${this.pulse.systems.length}</span>` : nothing}</button>
</div>
```

**Step 2: Remove `engineExpanded` reactive property**

Find and remove the `engineExpanded` property declaration and any references to the `brain-engine-toggle--active` CSS class.

**Step 3: Build UI and verify**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 4: Commit**

```bash
git add ui/src/ui/tabs/brain-tab.ts
git commit -m "fix(brain): remove redundant heading + engineExpanded dead state"
```

---

### Task 6: Progressive loading for Brain page (B4)

The Brain page blocks on 7 RPCs via `Promise.all`. Split into: fast RPCs (identity card, pulse) that render immediately, and slow RPCs (file tree, memory bank) that load lazily.

**Files:**
- Modify: `ui/src/ui/tabs/brain-tab.ts:178-219`

**Step 1: Split _loadAll into fast + lazy phases**

Replace the `_loadAll` method (lines 178-219):

```typescript
private async _loadAll(): Promise<void> {
  if (!this.ctx.gateway || !this.ctx.connected) return;
  this.loading = true;
  this.error = null;

  try {
    const gw = this.ctx.gateway;

    // Phase 1: Fast — render identity + pulse immediately
    const [pulse, card, people] = await Promise.all([
      gw.request<MemoryPulseData>("secondBrain.memoryPulse", {}),
      gw.request<IdentityCardData>("secondBrain.identityCard", {}).catch(() => null),
      gw.request<{ people: RecentPerson[]; total: number }>("secondBrain.recentPeople", { limit: 8 }).catch(() => null),
    ]);

    this.pulse = pulse;
    this.identityCard = card;
    this.recentPeople = people?.people ?? null;
    this.peopleTotalCount = people?.total ?? 0;
    this.loading = false; // Render what we have NOW

    // Phase 2: Lazy — heavier data loads in background
    Promise.all([
      gw.request<ActivityFeedData>("secondBrain.activity", { limit: 20 }).catch(() => null),
      gw.request<SecondBrainMemoryBankData>("secondBrain.memoryBank", {}).catch(() => null),
      gw.request<{ tree: BrainTreeNode[] }>("secondBrain.fileTree", { depth: 3 }).catch(() => ({ tree: [] })),
      gw.request<VaultHealthData>("secondBrain.vaultHealth", {}).catch(() => null),
    ]).then(([activity, bank, tree, health]) => {
      this.activity = activity;
      this.memoryBank = bank;
      this.fileTree = tree?.tree ?? [];
      this.vaultHealth = health;
    });

    // Phase 3: Non-blocking services
    Promise.all([
      gw.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {}).catch(() => null),
      gw.request<IngestionStatusData>("ingestion.status", {}).catch(() => null),
      gw.request<McpStatusData>("secondBrain.mcpStatus", {}).catch(() => null),
    ]).then(([sp, ing, mcp]) => {
      this.screenpipeStatus = sp;
      this.ingestionStatus = ing;
      this.mcpStatusData = mcp;
    });
  } catch (err) {
    console.error("[Brain] Load failed:", err);
    this.error = err instanceof Error ? err.message : "Failed to load";
    this.loading = false;
  }
}
```

**Step 2: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 3: Commit**

```bash
git add ui/src/ui/tabs/brain-tab.ts
git commit -m "fix(brain): progressive loading — identity+pulse first, heavy data lazy"
```

---

### Task 7: Make Engine panel always visible and memory layers interactive (B5)

The Engine section should always render below the panels (no toggle). Memory layer rows should be clickable with action buttons (Explore for ready systems, Repair for degraded/offline).

**Files:**
- Modify: `ui/src/ui/tabs/brain-tab.ts:390-403` (always show engine)
- Modify: `ui/src/ui/tabs/brain-tab.ts:697-720` (interactive memory rows)
- Modify: `ui/src/styles/brain.css` (clickable row styles)

**Step 1: Always render engine section**

Replace line 402:
```typescript
${this.engineExpanded ? this._renderEngine() : nothing}
```
with:
```typescript
${this._renderEngine()}
```

**Step 2: Replace memory layers table with interactive version**

Replace `_renderMemoryLayersTable` (lines 697-720):

```typescript
private _renderMemoryLayersTable() {
  if (!this.pulse) return nothing;

  return html`
    <div class="brain-engine-section">
      <h3 class="brain-subsection-title">Memory Layers</h3>
      <div class="brain-table">
        <div class="brain-table-header">
          <span>Layer</span><span>Status</span><span>Detail</span><span>Action</span>
        </div>
        ${this.pulse.systems.map((sys) => html`
          <div class="brain-table-row brain-table-row--clickable"
               @click=${() => this._chatNavigate(`Tell me about the ${sys.name} memory system. What's in it? How's it performing?`)}>
            <span class="brain-table-cell">
              <span class="brain-dot ${STATUS_DOT[sys.status] ?? "brain-dot--offline"}"></span>
              ${sys.name}
            </span>
            <span class="brain-table-cell brain-table-cell--status">${sys.status}</span>
            <span class="brain-table-cell brain-table-cell--detail">${sys.detail}${sys.count != null ? ` (${sys.count})` : ""}</span>
            <span class="brain-table-cell brain-table-cell--action">
              ${sys.status === "offline" || sys.status === "degraded"
                ? html`<button class="brain-action-btn brain-action-btn--small"
                    @click=${(e: Event) => { e.stopPropagation(); this._chatNavigate(`The ${sys.name} system is ${sys.status}. Can you diagnose and repair it?`); }}>
                    Repair</button>`
                : html`<button class="brain-action-btn brain-action-btn--small"
                    @click=${(e: Event) => { e.stopPropagation(); this._chatNavigate(`Search my ${sys.name} for recent entries. Show me what you know.`); }}>
                    Explore</button>`
              }
            </span>
          </div>
        `)}
      </div>
    </div>
  `;
}
```

**Step 3: Add clickable row styles to brain.css**

Append to `ui/src/styles/brain.css`:

```css
.brain-table-row--clickable {
  cursor: pointer;
  transition: background 0.15s;
}
.brain-table-row--clickable:hover {
  background: var(--bg-hover, rgba(0,0,0,0.04));
}
.brain-action-btn--small {
  padding: 2px 8px;
  font-size: 0.75rem;
}
```

**Step 4: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 5: Commit**

```bash
git add ui/src/ui/tabs/brain-tab.ts ui/src/styles/brain.css
git commit -m "fix(brain): engine always visible, memory layers clickable with explore/repair actions"
```

---

### Task 8: Restore Overview tab (B6)

Write a slim new Overview tab (~80 lines) showing OC + GodMode version, gateway status, and update controls. Register it in the Settings tab group. Remove the legacy `/overview` → `/dashboards` redirect. Fix stale "Visit Overview to update" string in trust-tracker.ts.

**Files:**
- Create: `ui/src/ui/views/overview.ts` (~80 lines)
- Modify: `ui/src/ui/navigation.ts:5` (add "overview" to Settings group)
- Modify: `ui/src/ui/navigation.ts:80-81` (remove legacy redirect)
- Modify: `ui/src/ui/navigation.ts:175-221` (add icon/title for overview)
- Modify: `ui/src/ui/app-render.ts` (import + render overview view)
- Modify: `ui/src/ui/views/trust-tracker.ts:327` (fix stale "Visit Overview" reference)

**Step 1: Create slim overview.ts**

New view that reads from `updateStatus` (already available on app host):

```typescript
import { html, nothing } from "lit";
import type { UpdateStatusSummary } from "../types.js";

export type OverviewProps = {
  connected: boolean;
  updateStatus: UpdateStatusSummary | null;
  updateLoading: boolean;
  onCheckUpdates: () => void;
  onUpdateOpenclaw: () => void;
  onUpdatePlugin: () => void;
};

export function renderOverview(props: OverviewProps) {
  const { connected, updateStatus: u, updateLoading } = props;

  return html`
    <section class="tab-body overview-section">
      <div class="overview-status">
        <span class="overview-dot ${connected ? "overview-dot--ok" : "overview-dot--off"}"></span>
        Gateway ${connected ? "Connected" : "Disconnected"}
      </div>

      <div class="overview-versions">
        <div class="overview-version-row">
          <span class="overview-label">OpenClaw</span>
          <span class="overview-value">${u?.openclawVersion ?? "unknown"}</span>
          ${u?.openclawUpdateAvailable ? html`
            <span class="overview-update">${u.openclawLatest} available</span>
            <button class="overview-btn" @click=${props.onUpdateOpenclaw}>Update</button>
          ` : nothing}
        </div>
        <div class="overview-version-row">
          <span class="overview-label">GodMode</span>
          <span class="overview-value">${u?.pluginVersion ?? "unknown"}</span>
          ${u?.pluginUpdateAvailable ? html`
            <span class="overview-update">${u.pluginLatest} available</span>
            <button class="overview-btn" @click=${props.onUpdatePlugin}>Update</button>
          ` : nothing}
        </div>
      </div>

      <button class="overview-btn overview-btn--check"
              ?disabled=${updateLoading}
              @click=${props.onCheckUpdates}>
        ${updateLoading ? "Checking..." : "Check for Updates"}
      </button>
    </section>
  `;
}
```

**Step 2: Register in navigation.ts**

Add `"overview"` to Settings tab group (line 5):
```typescript
{ label: "Settings", tabs: ["overview", "config", "connections", "skills", "agents", "trust", "guardrails"] },
```

Remove legacy redirect (lines 80-81):
```typescript
// DELETE: PATH_TO_TAB.set("/overview", "dashboards");
```

Add icon/title/subtitle entries in the switch statements:
- `iconForTab`: `case "overview": return "info";`
- `titleForTab`: `case "overview": return "Overview";`
- `subtitleForTab`: `case "overview": return "Version info, gateway status, and updates.";`

**Step 3: Wire into app-render.ts**

Import `renderOverview` and add a case for the overview tab in the render switch.

**Step 4: Fix stale trust-tracker reference**

In `trust-tracker.ts:327`, change `"Visit Overview to update."` — now it's accurate since Overview tab is restored.

**Step 5: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 6: Commit**

```bash
git add ui/src/ui/views/overview.ts ui/src/ui/navigation.ts ui/src/ui/app-render.ts ui/src/ui/views/trust-tracker.ts
git commit -m "fix(ui): restore Overview tab — slim version with version info + update controls"
```

---

## Phase 3 — Trust Tracker UX (B7)

### Task 9: Make trust data provenance visible (B7)

Trust tracker shows real data but it looks like placeholder data. Add clear provenance indicators showing WHERE scores come from.

**Files:**
- Modify: `ui/src/ui/views/trust-tracker.ts` (renderWorkflowCard function)

**Step 1: Add data provenance to workflow cards**

In the `renderWorkflowCard` function, add a subtitle showing the rating source:

```typescript
// After the trust score display, add:
html`<span class="trust-card-provenance">
  ${s.count} rating${s.count !== 1 ? "s" : ""}
  ${s.trustScore != null ? "" : ` \u2014 ${10 - s.count} more for trust score`}
</span>`
```

This shows "14 ratings" for established workflows and "3 ratings — 7 more for trust score" for new ones, making it clear these are real computed numbers.

**Step 2: Add "last rated" timestamp to cards if available**

If the rating data includes timestamps, show relative time: "Last rated 2 days ago".

**Step 3: Build UI**

Run: `pnpm build:ui`
Expected: Clean build.

**Step 4: Commit**

```bash
git add ui/src/ui/views/trust-tracker.ts
git commit -m "fix(trust): add data provenance — show rating counts and progress to trust score"
```

---

## Phase 4 — Custom Tabs Architecture (F1)

### Task 10: Design Custom Tabs extensibility system

This is a DESIGN task, not implementation. Write the architecture doc for ally-created, sandboxed, upgrade-safe custom tabs.

**Files:**
- Create: `docs/plans/2026-03-24-custom-tabs-design.md`

**Design Requirements:**
1. Non-technical users tell their ally "make me a tab that shows X"
2. Ally generates a declarative config (JSON manifest) defining layout, data sources, refresh intervals
3. GodMode has a built-in renderer that interprets configs (cards, tables, charts, lists)
4. Custom tabs stored in `~/godmode/custom-tabs/` — survives GodMode updates
5. Tabs registered in `DYNAMIC_TABS` array (already exists in navigation.ts:15)
6. Sandboxed: custom tabs cannot import core modules or modify core state
7. For advanced cases: iframe sandbox with postMessage API for MCP data access
8. Community can share tab configs as `.json` files

**Architecture Sketch:**
- `~/godmode/custom-tabs/{slug}.json` — manifest per tab
- `src/lib/custom-tabs.ts` — loader, validator, registry
- `ui/src/ui/views/custom-tab-renderer.ts` — declarative renderer
- `ui/src/ui/navigation.ts` — dynamic registration from loaded manifests

**Step 1: Write the full design doc**

Cover: manifest format, renderer capabilities, data source abstraction, security model, upgrade safety, community sharing format.

**Step 2: Review with user before implementation**

This is Phase 4 — implementation comes after Phases 1-3 ship.

**Step 3: Commit**

```bash
git add docs/plans/2026-03-24-custom-tabs-design.md
git commit -m "docs: custom tabs extensibility architecture design"
```

---

## Execution Order

| Order | Task | Phase | Complexity |
|-------|------|-------|------------|
| 1 | RPC timeout + timer cleanup (gateway.ts) | P1 | Small |
| 2 | Workspace feed/connections fallback | P1 | Small |
| 3 | Paperclip diagnostic logging | P1 | Small |
| 4 | Paperclip injection helper + fallback | P1 | Small |
| 5 | Brain heading + remove engineExpanded | P2 | Trivial |
| 6 | Brain progressive loading | P2 | Medium |
| 7 | Engine always-visible + interactive | P2 | Medium |
| 8 | Overview tab (slim, new) | P2 | Medium |
| 9 | Trust data provenance UX | P3 | Small |
| 10 | Custom tabs design doc | P4 | Design only |

## Build & Verify Checklist (after all tasks)

```bash
pnpm build          # Backend compiles
pnpm build:ui       # UI compiles
pnpm ui:sync        # Refresh fallback snapshot
pnpm typecheck      # No type errors
```
