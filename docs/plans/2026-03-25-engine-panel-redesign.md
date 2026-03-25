# Engine Panel Redesign + Brain→Memory Rename + Screenpipe Auto-Start

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename the "Brain" tab to "Memory", add a "Connected Sources" section to the Engine panel showing integration status, add an MCP "How to use" chat link, and wire Screenpipe into onboarding with auto-start on gateway boot.

**Architecture:** Four independent workstreams that share the Engine panel surface in `brain-tab.ts`. The rename is a mechanical find-replace across nav/UI/backend. Connected Sources pulls from the existing `integrations.status` RPC. Screenpipe auto-start adds an `autoStart` config flag + `child_process.spawn` in gateway-start. MCP link is a one-line button addition.

**Tech Stack:** TypeScript ESM, Lit Web Components (ui/), Node child_process (spawn), existing RPC framework

---

## Task 1: Rename "Brain" → "Memory" in Navigation

**Files:**
- Modify: `ui/src/ui/navigation.ts` (lines 4, 39-40, 68-69, 84-85, 233-235, 283-286, 334-336, 382-385)

**Step 1: Update tab group array**

In `navigation.ts` line 4, change:
```typescript
{ label: "", tabs: ["chat", "today", "team", "workspaces", "brain", "dashboards"] }
```
to:
```typescript
{ label: "", tabs: ["chat", "today", "team", "workspaces", "memory", "dashboards"] }
```

**Step 2: Update Tab union type**

Lines 39-40, change `"brain"` to `"memory"` and `"second-brain"` to `"second-brain"` (keep legacy).

**Step 3: Update TAB_PATHS**

Lines 68-69, change:
```typescript
brain: "/brain",
"second-brain": "/second-brain",
```
to:
```typescript
memory: "/memory",
"second-brain": "/second-brain",
```

**Step 4: Update legacy redirect**

Line 85, change:
```typescript
PATH_TO_TAB.set("/second-brain", "brain");
```
to:
```typescript
PATH_TO_TAB.set("/second-brain", "memory");
PATH_TO_TAB.set("/brain", "memory");  // legacy redirect
```

**Step 5: Update iconForTab()**

Lines 233-235, change `case "brain":` to `case "memory":`.

**Step 6: Update titleForTab()**

Lines 283-286, change:
```typescript
case "brain":
  return "Brain";
```
to:
```typescript
case "memory":
  return "Memory";
```

**Step 7: Update subtitleForTab()**

Lines 382-385, change:
```typescript
case "brain":
  return "Your Brain — identity, people, knowledge, and live AI context.";
```
to:
```typescript
case "memory":
  return "Your Memory — identity, people, knowledge, and live AI context.";
```

**Step 8: Update emojiForTab()**

Lines 334-336, change `case "brain":` to `case "memory":`.

**Step 9: Verify no compile errors**

Run: `pnpm typecheck`
Expected: Clean (0 errors). Expect errors in files that reference `"brain"` tab — fix those in Task 2.

---

## Task 2: Rename "Brain" → "Memory" in Remaining UI Files

**Files:**
- Modify: `ui/src/ui/app-render.ts` (lines 110, 1788-1790)
- Modify: `ui/src/ui/app-lifecycle.ts` (line 122)
- Modify: `ui/src/ui/views/setup-bar.ts` (line 50)
- Modify: `ui/src/ui/tabs/settings-tab.ts` (line 211)
- Modify: `ui/src/ui/controllers/setup.ts` (line 169)
- Modify: `ui/src/ui/app.ts` (line 2867)
- Modify: `ui/src/ui/tabs/brain-tab.ts` (line 159 and any `"brain"` tab references)

**Step 1: Update app-render.ts tab conditional**

Line 1788-1790, change:
```typescript
state.tab === "brain" || state.tab === "second-brain"
```
to:
```typescript
state.tab === "memory" || state.tab === "second-brain"
```

**Step 2: Update app-lifecycle.ts keyboard shortcut array**

Line 122, change:
```typescript
const mainTabs = ["chat", "today", "team", "workspaces", "brain", "dashboards"] as const;
```
to:
```typescript
const mainTabs = ["chat", "today", "team", "workspaces", "memory", "dashboards"] as const;
```

**Step 3: Update setup-bar.ts step title**

Line 50, change:
```typescript
{ id: "second-brain", title: "Second Brain", icon: "\u{1F4DA}" },
```
to:
```typescript
{ id: "second-brain", title: "Memory", icon: "\u{1F9E0}" },
```

**Step 4: Update settings-tab.ts error message**

Line 211, change:
```typescript
"Check the Brain tab for details."
```
to:
```typescript
"Check the Memory tab for details."
```

**Step 5: Update app.ts onboarding help text**

Line 2867, change:
```typescript
"second-brain": "Help me link my Obsidian vault as my Second Brain.",
```
to:
```typescript
"second-brain": "Help me link my Obsidian vault to my Memory.",
```

**Step 6: Update brain-tab.ts tab ID references**

Search brain-tab.ts for any `"brain"` tab routing references and update to `"memory"`.

**Step 7: Typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 8: Commit**

```bash
git add -A && git commit -m "refactor: rename Brain tab to Memory across UI"
```

---

## Task 3: Rename "Brain" → "Memory" in Backend Files

**Files:**
- Modify: `src/methods/custom-tabs.ts` (lines 40, 43)
- Modify: `src/lib/custom-tabs.ts` (lines 51, 54)
- Modify: `src/methods/onboarding-types.ts` (line 232-233)
- Modify: `src/methods/onboarding.ts` (line 143)

**Step 1: Update BUILT_IN_SLUGS in src/methods/custom-tabs.ts**

Add `"memory"` to the Set, keep `"brain"` for backward compat:
```typescript
"chat", "today", "team", "workspaces", "memory", "brain", "dashboards",
```

**Step 2: Update BUILT_IN_SLUGS in src/lib/custom-tabs.ts**

Same change — add `"memory"`, keep `"brain"`.

**Step 3: Update SETUP_STEPS title in onboarding-types.ts**

Line 233, change:
```typescript
{ step: 'second-brain', title: 'Second Brain', description: 'Link your Obsidian vault', required: false },
```
to:
```typescript
{ step: 'second-brain', title: 'Memory Vault', description: 'Link your Obsidian vault', required: false },
```

**Step 4: Add screenpipe to stepOrder in onboarding.ts**

Line 143, change:
```typescript
const stepOrder: SetupStep[] = ["welcome", "api-key", "memory", "integrations", "second-brain"];
```
to:
```typescript
const stepOrder: SetupStep[] = ["welcome", "api-key", "memory", "integrations", "screenpipe", "second-brain"];
```

**Step 5: Add screenpipe to setup-bar.ts STEPS array**

In `ui/src/ui/views/setup-bar.ts` line 45-51, add screenpipe step:
```typescript
const STEPS = [
  { id: "welcome", title: "Welcome", icon: "\u{1F44B}" },
  { id: "api-key", title: "AI Connection", icon: "\u{1F511}" },
  { id: "memory", title: "Memory", icon: "\u{1F9E0}" },
  { id: "integrations", title: "Integrations", icon: "\u{1F50C}" },
  { id: "screenpipe", title: "Screen Recall", icon: "\u{1F4FA}" },
  { id: "second-brain", title: "Memory Vault", icon: "\u{1F4DA}" },
] as const;
```

**Step 6: Typecheck + commit**

Run: `pnpm typecheck`
```bash
git add -A && git commit -m "refactor: rename Brain to Memory in backend + add screenpipe to onboarding"
```

---

## Task 4: Add "Connected Sources" Section to Engine Panel

**Files:**
- Modify: `ui/src/ui/tabs/brain-tab.ts` (after line 700, add new render method + data fetching)

**Step 1: Add integrations data state property**

Near the other `@state()` declarations in brain-tab.ts, add:
```typescript
@state() private integrationsData: IntegrationsStatusData | null = null;
```

Add the type (near existing types at top of file):
```typescript
type IntegrationsStatusData = {
  integrations: Array<{
    id: string;
    name: string;
    description: string;
    tier: "core" | "deep";
    status: {
      configured: boolean;
      cliInstalled: boolean;
      authenticated: boolean;
      working: boolean;
      details?: string;
    };
  }>;
  coreProgress: { connected: number; total: number };
};
```

**Step 2: Fetch integrations data in Phase 3 loading**

In the Phase 3 `Promise.all` block (around line 212-220), add the integrations fetch:
```typescript
Promise.all([
  gw.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {}).catch(() => null),
  gw.request<IngestionStatusData>("ingestion.status", {}).catch(() => null),
  gw.request<McpStatusData>("secondBrain.mcpStatus", {}).catch(() => null),
  gw.request<IntegrationsStatusData>("integrations.status", {}).catch(() => null),
]).then(([sp, ing, mcp, integrations]) => {
  this.screenpipeStatus = sp;
  this.ingestionStatus = ing;
  this.mcpStatusData = mcp;
  this.integrationsData = integrations;
});
```

**Step 3: Add _renderConnectedSources() method**

After `_renderIngestionTable()` method, add:
```typescript
private _renderConnectedSources() {
  const data = this.integrationsData;
  if (!data) return nothing;

  // Show core integrations that users would care about as "sources"
  // Filter to source-like integrations (not infrastructure like composio)
  const sources = data.integrations.filter(
    (i) => !["composio", "obsidian-vault", "obsidian-sync"].includes(i.id)
  );

  if (sources.length === 0) return nothing;

  return html`
    <div class="brain-engine-section">
      <h3 class="brain-subsection-title">Connected Sources</h3>
      <div class="brain-table">
        <div class="brain-table-header">
          <span>Source</span><span>Status</span><span>Action</span>
        </div>
        ${sources.map((s) => {
          const working = s.status.working || s.status.configured;
          return html`
            <div class="brain-table-row">
              <span class="brain-table-cell">
                <span class="brain-dot ${working ? "brain-dot--ready" : "brain-dot--offline"}"></span>
                ${s.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">
                ${s.status.working ? "Connected" : s.status.configured ? "Configured" : "Not connected"}
              </span>
              <span class="brain-table-cell">
                ${working
                  ? html`<button class="brain-action-btn brain-action-btn--xs"
                      @click=${() => this._chatNavigate(\`Show me what's coming in from \${s.name}. Any recent activity?\`)}>
                      Explore</button>`
                  : html`<button class="brain-action-btn brain-action-btn--xs"
                      @click=${() => this._chatNavigate(\`Help me connect \${s.name} to GodMode. Walk me through setup.\`)}>
                      Connect</button>`
                }
              </span>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}
```

**Step 4: Wire into _renderEngine()**

Change `_renderEngine()` (line 689-700):
```typescript
private _renderEngine() {
  return html`
    <div class="brain-engine">
      <h2 class="brain-engine-title">Engine</h2>

      ${this._renderMemoryLayersTable()}
      ${this._renderConnectedSources()}
      ${this._renderIngestionTable()}
      ${this._renderMcpRow()}
      ${this._renderScreenpipeRow()}
    </div>
  `;
}
```

**Step 5: Typecheck + commit**

Run: `pnpm typecheck`
```bash
git add -A && git commit -m "feat: add Connected Sources section to Engine panel"
```

---

## Task 5: Add MCP "How to Use" Chat Link

**Files:**
- Modify: `ui/src/ui/tabs/brain-tab.ts` (`_renderMcpRow()` method, lines 768-783)

**Step 1: Add "How to use" button to MCP row**

Replace `_renderMcpRow()`:
```typescript
private _renderMcpRow() {
  const enabled = this.mcpStatusData?.enabled;
  return html`
    <div class="brain-engine-section">
      <h3 class="brain-subsection-title">MCP Server</h3>
      <div class="brain-mcp-row">
        <span class="brain-dot ${enabled ? "brain-dot--ready" : "brain-dot--offline"}"></span>
        <span>${enabled ? "Active" : "Inactive"}</span>
        <span class="brain-muted">${this.mcpStatusData?.transport ?? "stdio"} transport</span>
        ${enabled ? html`
          <button class="brain-action-btn brain-action-btn--xs"
            @click=${() => this._chatNavigate("Explain the GodMode MCP server — what tools does it expose, how do I connect it to Claude Code or other MCP clients, and what can I do with it?")}>
            How to use</button>
        ` : html`
          <button class="brain-action-btn brain-action-btn--xs"
            @click=${() => this._chatNavigate("Help me set up the GodMode MCP server so I can use it with Claude Code or other MCP clients.")}>
            Set up</button>
        `}
      </div>
    </div>
  `;
}
```

**Step 2: Typecheck + commit**

Run: `pnpm typecheck`
```bash
git add -A && git commit -m "feat: add MCP 'How to use' chat link in Engine panel"
```

---

## Task 6: Screenpipe Auto-Start Config

**Files:**
- Modify: `src/services/ingestion/screenpipe-config.ts` (lines 37-48 interface, lines 52-82 defaults)

**Step 1: Add autoStart to ScreenpipeConfig interface**

Line 37-48, add field:
```typescript
export interface ScreenpipeConfig {
  /** Master toggle — must be explicitly enabled */
  enabled: boolean;
  /** Auto-start Screenpipe daemon on GodMode gateway boot */
  autoStart: boolean;
  /** Screenpipe API base URL */
  apiUrl: string;
  /** Apps whose frames are always discarded */
  blockedApps: string[];
  /** Retention policy per summary tier */
  retention: RetentionConfig;
  /** Privacy controls */
  privacy: PrivacyConfig;
}
```

**Step 2: Add autoStart to DEFAULT_CONFIG**

Line 52-53:
```typescript
export const DEFAULT_CONFIG: ScreenpipeConfig = {
  enabled: false,
  autoStart: false,
  // ... rest stays the same
```

**Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: Clean (saveConfig/loadConfig use spread so new field is handled automatically)

---

## Task 7: Screenpipe Auto-Start on Gateway Boot

**Files:**
- Modify: `src/hooks/gateway-start.ts` (before line 703, in the ingestion section)

**Step 1: Add auto-start spawn before the timers**

Insert before line 703 (`// ── Ingestion pipelines`):
```typescript
  // ── Screenpipe auto-start ──────────────────────────────────────
  try {
    const { loadConfig } = await import("../services/ingestion/screenpipe-config.js");
    const { isScreenpipeAvailable } = await import("../services/ingestion/screenpipe-funnel.js");
    const cfg = await loadConfig();

    if (cfg.autoStart && !(await isScreenpipeAvailable())) {
      logger.info("[GodMode] Screenpipe autoStart enabled — spawning daemon...");
      try {
        const { spawn } = await import("node:child_process");
        const child = spawn("screenpipe", [], {
          detached: true,
          stdio: "ignore",
        });
        child.unref(); // Don't block gateway shutdown
        // Give it a moment to start, then verify
        await new Promise((r) => setTimeout(r, 3_000));
        const running = await isScreenpipeAvailable();
        if (running) {
          logger.info("[GodMode] Screenpipe daemon started successfully");
        } else {
          logger.warn("[GodMode] Screenpipe daemon spawned but health check failed — may still be starting");
        }
      } catch (spawnErr) {
        logger.warn(`[GodMode] Failed to auto-start Screenpipe: ${String(spawnErr)}`);
      }
    }
  } catch (err) {
    logger.warn(`[GodMode] Screenpipe auto-start check failed: ${String(err)}`);
  }
```

**Step 2: Typecheck + commit**

Run: `pnpm typecheck`
```bash
git add -A && git commit -m "feat: screenpipe auto-start config + gateway boot spawn"
```

---

## Task 8: Wire Screenpipe Onboarding Configure Handler

**Files:**
- Modify: `src/methods/onboarding.ts` (lines 1300-1304, the empty screenpipe case)

**Step 1: Replace the no-op handler**

Change lines 1300-1304:
```typescript
case "screenpipe": {
  // Enable Screenpipe + auto-start when user completes this onboarding step
  const { saveConfig } = await import("../services/ingestion/screenpipe-config.js");
  await saveConfig({ enabled: true, autoStart: true });

  // Try to start it now if not already running
  const { isScreenpipeAvailable } = await import("../services/ingestion/screenpipe-funnel.js");
  if (!(await isScreenpipeAvailable())) {
    try {
      const { spawn } = await import("node:child_process");
      const child = spawn("screenpipe", [], { detached: true, stdio: "ignore" });
      child.unref();
    } catch { /* best effort — will start on next gateway boot */ }
  }
  break;
}
```

**Step 2: Typecheck + commit**

Run: `pnpm typecheck`
```bash
git add -A && git commit -m "feat: screenpipe onboarding enables auto-start and spawns daemon"
```

---

## Task 9: Update Skill Cards for Rename

**Files:**
- Modify: `skill-cards/second-brain.md` (domain reference)
- Modify: `skill-cards/screenpipe.md` (any "Brain tab" references)

**Step 1: Update second-brain.md description**

Change line 7:
```yaml
description: "Searches and manages the Obsidian vault knowledge base"
```
to:
```yaml
description: "Searches and manages the Memory vault knowledge base"
```

**Step 2: Update any "Brain tab" references in screenpipe.md**

Change "Brain tab" → "Memory tab" if present.

**Step 3: Commit**

```bash
git add -A && git commit -m "docs: update skill cards for Brain→Memory rename"
```

---

## Task 10: Build + Verify

**Step 1: Full build**

Run: `pnpm build`
Expected: Clean build, no errors

**Step 2: Build UI**

Run: `pnpm build:ui`
Expected: Clean

**Step 3: Sync UI snapshot**

Run: `pnpm ui:sync`

**Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 5: Final commit if ui:sync changed files**

```bash
git add -A && git commit -m "chore: rebuild UI snapshot after Engine panel redesign"
```

---

## Parallelization Guide

These tasks are independent and can run in parallel:
- **Group A** (rename): Tasks 1, 2, 3, 9 (all mechanical find-replace)
- **Group B** (Engine panel): Tasks 4, 5 (UI additions)
- **Group C** (Screenpipe): Tasks 6, 7, 8 (backend config + onboarding)

Task 10 (build + verify) depends on all others completing first.
