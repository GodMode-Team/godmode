# GodMode v3 Slim — Surgical Debloat Prompt

**Give this entire file to Claude Code as the task prompt.**

---

## Mission

GodMode is at ~102K LOC. It should be ~68K for what it does. This prompt is pure subtraction — delete dead code, collapse duplicates, decompose the God Component. **No new features. Only deletion, merging, and restructuring.**

**Read `AGENTS.md` and `docs/GODMODE-META-ARCHITECTURE.md` before touching anything.** Follow branch discipline — create `feat/v3-slim` from `main`.

**The Cardinal Rule: Build must pass after EVERY phase.** Run `pnpm build` between phases. If it breaks, fix immediately before continuing. Never accumulate breakage.

---

## Phase 1: Delete Dead Backend Files (~3,000 lines)

### 1A. Orphan Method Files (no importers anywhere in codebase)

These method files exist but nothing imports them. They aren't registered in `register-all.ts` and no other file references them:

```bash
# Verify they're truly orphaned before deleting:
for f in brief-notes people-data proactive-intel data-sources; do
  echo "=== $f ==="
  grep -rn "$f" src/ --include='*.ts' -l | grep -v "$f.ts" | grep -v node_modules
done
```

If the grep confirms no importers (except `data-sources` which is imported by `second-brain.ts`):

```
rm src/methods/brief-notes.ts      # 87 lines — no importers
rm src/methods/people-data.ts      # 99 lines — no importers  
rm src/methods/proactive-intel.ts  # 264 lines — no importers
```

**Note:** `data-sources.ts` (100 lines) is imported by `second-brain.ts` — check if the import is live or dead before deleting.

### 1B. Dead UI Files

```
rm ui/src/ui/views/file-explorer.ts     # 167 lines — zero importers anywhere
rm ui/src/ui/controllers/focus-pulse.ts  # 23 lines — zero importers, stub for killed feature
rm ui/src/ui/controllers/clawhub.ts      # 19 lines — zero importers, stub for killed feature
```

### 1C. Mission Control Stub Controller

`ui/src/ui/controllers/mission-control.ts` (35 lines) is a no-op stub. It's imported by:
- `ui/src/ui/tabs/settings-tab.ts`
- `ui/src/ui/navigation.ts`

**Action:** Delete the file. Find and remove the imports in those 2 files, plus remove any code that calls the exported functions (`loadMissionControl`, `cancelCodingTask`, `approveCodingTask`, `approveQueueItem`, `retryQueueItem`, `loadAgentDetail`, `selectSwarmProject`, `steerSwarmAgent`). All are no-ops so removing calls is safe.

### 1D. Clean references to deleted files

```bash
grep -rn 'brief-notes\|people-data\|proactive-intel\|file-explorer\|focus-pulse\|clawhub\|mission-control' src/ ui/src/ --include='*.ts' | grep -v node_modules | grep -v '\.test\.'
```

Remove any remaining imports, type references, or commented-out code referencing these deleted modules.

**Run `pnpm build` — must pass.**

---

## Phase 2: Collapse UI Duplicates (~4,000 lines)

The UI has 3 layers for many concepts: a `views/*.ts` render function, a `tabs/*-tab.ts` LitElement, and a `controllers/*.ts` data loader. The tabs use `@lit/context` (correct pattern). The views are older render functions called from `app-render.ts` (wrong pattern — tight coupling to God Component). 

### The rule: Each navigable tab should have ONE component (the tab) that manages its own data loading. Kill the view render functions and wire the tab components directly.

### 2A. Chat: Merge `views/chat.ts` (1,338 lines) into `tabs/chat-tab.ts` (446 lines)

`views/chat.ts` is a `renderChat()` function that takes the entire app as `host` parameter and reads 40+ properties off it. `tabs/chat-tab.ts` is a proper LitElement that consumes `AppContext`.

**Action:**
1. Move the rendering logic from `views/chat.ts` into `chat-tab.ts` as the tab's `render()` method
2. Any state that `renderChat` reads from `host` — check if it's in `AppContext`. If not, the tab should fetch it directly via `this.ctx.send()`
3. Delete `views/chat.ts`
4. Remove the `renderChat` import from `app-render.ts`
5. In `app-render.ts`, replace the `renderChat(this)` call with `<gm-chat></gm-chat>` (the tab's custom element tag)

**Also merge:** `views/ally-chat.ts` (424 lines) — this is imported by `views/chat.ts` and `app-render.ts`. It's an "ally sidebar" chat panel. Absorb it into `chat-tab.ts` or make it a sub-component of chat-tab. Don't leave it as a standalone view.

### 2B. Today: Delete `views/my-day.ts` (696 lines), keep `tabs/today-tab.ts` (942 lines)

`today-tab.ts` already imports and uses `renderMyDay` from `views/my-day.ts`. The view is just a render helper.

**Action:**
1. Inline the render functions from `views/my-day.ts` directly into `today-tab.ts`
2. Delete `views/my-day.ts`
3. Remove any `my-day` imports from `app-render.ts`

### 2C. Work: Delete `views/work.ts` (70 lines), keep `tabs/work-tab.ts` (572 lines)

`views/work.ts` is only 70 lines and is already consumed by `work-tab.ts`.

**Action:**
1. Inline the 70 lines into `work-tab.ts`
2. Delete `views/work.ts`
3. Remove any `work` view imports from `app-render.ts`

### 2D. Second Brain: Merge `views/second-brain.ts` (827 lines) into `tabs/second-brain-tab.ts` (310 lines)

**Action:** Same pattern as Chat. Move rendering into the tab, delete the view, update app-render.ts.

### 2E. Dashboards: Merge `views/dashboards.ts` (359 lines) into `tabs/dashboards-tab.ts` (224 lines)

**Action:** Same pattern. Move rendering into the tab, delete the view, update app-render.ts.

### 2F. Settings: The `tabs/settings-tab.ts` (759 lines) should be the single settings view

Check what `app-render.ts` renders for settings-related tabs (config, skills, agents, trust, guardrails, options). If it's calling view render functions, replace with the settings-tab component.

### After all merges:

**The render switch in `app-render.ts` should shrink dramatically.** It should be roughly:

```typescript
switch (this.tab) {
  case "chat": return html`<gm-chat></gm-chat>`;
  case "today": return html`<gm-today></gm-today>`;
  case "workspaces": return html`<gm-work></gm-work>`;
  case "second-brain": return html`<gm-second-brain></gm-second-brain>`;
  case "dashboards": return html`<gm-dashboards></gm-dashboards>`;
  case "config": case "skills": case "agents": case "trust": case "guardrails": case "options":
    return html`<gm-settings></gm-settings>`;
  // Power user views can stay as render functions for now
  case "channels": return renderChannels(this);
  case "sessions": return renderSessions(this);
  case "cron": return renderCron(this);
  case "debug": return renderDebug(this);
}
```

**Run `pnpm build` — must pass.**

---

## Phase 3: Decompose the God Component (~3,500 lines from app.ts)

### The Problem

`ui/src/ui/app.ts` has **306 `@state()` decorators** and **4,055 lines**. The app-* family totals **11,680 lines** across 14 files. Every piece of state lives on one class, so every state change triggers Lit's full update lifecycle.

### The Foundation Already Exists

`ui/src/ui/context/app-context.ts` already provides shared state via `@lit/context`. All 6 tab components already consume it. The event bus (`context/event-bus.ts`) handles cross-tab communication. **This is the right architecture — extend it, don't replace it.**

### 3A. Categorize state and create domain contexts

Looking at the 306 `@state()` properties, they fall into clear domains:

**Chat domain (~50 properties):** `chatLoading`, `chatSending`, `chatMessage`, `chatMessages`, `chatToolMessages`, `chatStream`, `chatStreamStartedAt`, `chatRunId`, `currentToolName`, `chatQueue`, `chatAttachments`, `chatDrafts`, `pendingRetry`, `chatAvatarUrl`, `chatThinkingLevel`, `chatPrivateMode`, `privateSessions`, `chatUserNearBottom`, `chatNewMessagesBelow`, `compactionStatus`, `workingSessions`, `allyPanelOpen`, `allyMessages`, `allyStream`, `allyDraft`, `allyUnread`, `allySending`, `allyWorking`, `allyAttachments`, `chatSendingSessionKey`, `autoRetryAfterCompact`

**Session domain (~20 properties):** `sessionKey`, `sessionPickerOpen`, `sessionPickerPosition`, `sessionPickerSearch`, `sessionSearchOpen`, `sessionSearchPosition`, `sessionSearchQuery`, `sessionSearchResults`, `sessionSearchLoading`, `sessionsLoading`, `sessionsResult`, `sessionsError`, `sessionsFilterActive`, `sessionsFilterLimit`, `sessionsIncludeGlobal`, `sessionsIncludeUnknown`, `archivedSessions`, `archivedSessionsLoading`, `archivedSessionsExpanded`

**Workspace domain (~25 properties):** `workspaces`, `selectedWorkspace`, `workspacesSearchQuery`, `workspaceItemSearchQuery`, `workspacesLoading`, `workspacesCreateLoading`, `workspacesError`, `workspaceExpandedFolders`, `allTasks`, `taskFilter`, `taskSort`, `taskSearch`, `showCompletedTasks`, `editingTaskId`, `workspaceBrowsePath`, `workspaceBrowseEntries`, `workspaceBreadcrumbs`, `workspaceBrowseSearchQuery`, `workspaceBrowseSearchResults`, `workspaceNeedsSetup`

**Work/Projects domain (~12 properties):** `workProjects`, `workLoading`, `workError`, `workExpandedProjects`, `workProjectFiles`, `workDetailLoading`, `workResources`, `workResourcesLoading`, `workResourceFilter`, `sessionResources`, `sessionResourcesCollapsed`

**Today/MyDay domain (~20 properties):** `myDayLoading`, `myDayError`, `todaySelectedDate`, `todayViewMode`, `dailyBrief`, `dailyBriefLoading`, `dailyBriefError`, `agentLog`, `agentLogLoading`, `agentLogError`, `briefNotes`, `todayTasks`, `todayTasksLoading`, `todayEditingTaskId`, `todayShowCompleted`, `todayQueueResults`, `inboxItems`, `inboxLoading`, `inboxCount`, `inboxScoringId`, `inboxScoringValue`, `inboxFeedbackText`, `inboxSortOrder`, `trustSummary`

**Config domain (~20 properties):** `configLoading`, `configRaw`, `configRawOriginal`, `configValid`, `configIssues`, `configSaving`, `configApplying`, `configSnapshot`, `configSchema`, `configSchemaVersion`, `configSchemaLoading`, `configUiHints`, `configForm`, `configFormOriginal`, `configFormDirty`, `configFormMode`, `configSearchQuery`, `configActiveSection`, `configActiveSubsection`

**SecondBrain domain (~15 properties):** `secondBrainSubtab`, `secondBrainLoading`, `secondBrainError`, `secondBrainIdentity`, `secondBrainMemoryBank`, `secondBrainAiPacket`, `secondBrainSourcesData`, `secondBrainResearchData`, `secondBrainSelectedEntry`, `secondBrainSearchQuery`, `secondBrainSyncing`, `secondBrainBrowsingFolder`, `secondBrainFolderEntries`, `secondBrainFolderName`, `secondBrainVaultHealth`, `secondBrainFileTree`, `secondBrainFileTreeLoading`, `secondBrainFileSearchQuery`, `secondBrainFileSearchResults`

**View-local state (should live on individual tab components, not app.ts):** ALL of the above domain-specific state. App.ts should only own truly global state.

### 3B. Move domain state into tab components

**The key insight:** After Phase 2, each tab is a LitElement that consumes `AppContext`. Domain state should live ON THE TAB, not on app.ts.

For each domain above:
1. Move the `@state()` declarations from `app.ts` into the corresponding tab component
2. Move the data-loading methods from `app.ts` (and `app-gateway.ts`, `app-view-state.ts`, etc.) into the tab
3. The tab calls `this.ctx.send()` to talk to the backend — it doesn't need app.ts as intermediary
4. Remove the property from app.ts

**Example — Today tab absorbs myDay state:**
```typescript
// BEFORE: app.ts has 20+ myDay @state() properties
// AFTER: today-tab.ts owns them directly

@customElement("gm-today")
export class TodayTab extends LitElement {
  @consume({ context: appContext }) ctx!: AppContext;
  
  @state() myDayLoading = false;
  @state() dailyBrief?: DailyBriefData;
  @state() todayTasks: Task[] = [];
  // ... all the today-specific state
  
  async loadMyDay() {
    this.myDayLoading = true;
    const result = await this.ctx.send("daily-brief.get");
    this.dailyBrief = result;
    this.myDayLoading = false;
  }
}
```

### 3C. What stays on app.ts (~30 properties max)

After extraction, app.ts should only own:

```
// Connection
connected, reconnecting, reconnectAttempt

// Identity  
assistantName, assistantAvatar, userName, userAvatar

// Navigation
tab, onboarding, basePath

// Theme
theme, themeResolved, settings

// Gateway
hello, lastError, pendingGatewayUrl, gatewayRestartPending, gatewayRestartBusy

// Notifications
toasts

// Global UI chrome
sidebarOpen, sidebarContent, sidebarTitle, sidebarMimeType, sidebarFilePath
lightbox
profilePopoverOpen, profileEditName, profileEditAvatar
updateStatus, updateLoading
```

That's ~30 properties. Everything else belongs on a tab component.

### 3D. Shrink app-render.ts and kill helper files

After Phase 2 (tab components render themselves) and Phase 3 (state moved to tabs):

- `app-render.ts` (1,870 lines) → ~200 lines (nav bar + view switch + sidebar + toasts)
- `app-render.helpers.ts` (826 lines) → DELETE (helpers move into tab components)
- `app-view-state.ts` (654 lines) → DELETE (state initialization moves to tabs)
- `app-settings.ts` (575 lines) → move to settings-tab.ts, delete
- `app-chat.ts` (357 lines) → move to chat-tab.ts, delete
- `app-channels.ts` (256 lines) → move to channels view, delete
- `app-scroll.ts` (161 lines) → move to chat-tab.ts (it's chat scroll logic), delete
- `app-polling.ts` (71 lines) → inline into app.ts or relevant tabs

**Keep:**
- `app-gateway.ts` (1,510 lines) — but strip domain-specific handlers out of it. This file should only handle websocket connection, reconnection, and message routing. Domain handlers move to tabs.
- `app-lifecycle.ts` (547 lines) — boot sequence stays centralized
- `app-tool-stream.ts` (478 lines) — tool streaming is cross-cutting, keep it but it should emit events that chat-tab listens to, not set state on app.ts
- `app-defaults.ts` (33 lines) — fine
- `app-events.ts` (5 lines) — fine

### 3E. Extend event bus for domain communication

The event bus already exists. Add events for cross-tab communication:

```typescript
// In event-bus.ts, add to AppEvents:
"chat-message-received": { sessionKey: string; message: ChatMessage };
"tool-stream-update": { runId: string; toolName: string; status: string };
"workspace-changed": { workspaceId: string };
"my-day-refresh": void;
```

Tab components subscribe to relevant events. App-gateway routes incoming websocket messages to the event bus. Tabs listen and update their own state.

**Run `pnpm build` — must pass.**

---

## Phase 4: Fix Silent Catches (0 new lines, just rewrites)

There are **28 empty catch blocks in backend** and **18 in UI** (46 total).

### Rules

1. **Optional enrichment** (calendar, weather, health data) → `catch { /* ${feature} unavailable — non-critical */ }`
2. **Critical path** (before-prompt-build, queue-processor, gateway) → `catch (e) { logger?.warn?.(\`[module] ${description}: ${(e as Error).message}\`); }`
3. **Expected errors** (file not found, optional config) → `catch { /* expected: file created on first use */ }`

### Priority order:
1. `src/hooks/before-prompt-build.ts` — most important function
2. `src/lib/awareness-snapshot.ts` — runs every 15 min  
3. `src/services/queue-processor.ts` — agent delegation path
4. `src/methods/brief-generator.ts` — daily brief generation
5. Everything else

**One-liner per catch is enough. Don't over-engineer logging.**

**Run `pnpm build` — must pass.**

---

## Phase 5: Verify and Ship

### Build
```bash
pnpm clean && pnpm build
```

### LOC check
```bash
echo "Backend:" && find src -name '*.ts' -not -name '*.test.ts' -not -path '*/node_modules/*' | xargs wc -l | tail -1
echo "UI:" && find ui/src -name '*.ts' -not -name '*.test.ts' -not -path '*/node_modules/*' -not -path '*__screenshots__*' | xargs wc -l | tail -1
```

**Targets:**
- Backend: < 52,000 (down from ~53,000 — orphans deleted)
- UI: < 32,000 (down from ~44,000 — duplicates merged, God Component decomposed)
- Total: < 84,000 (down from ~97,000)
- `app.ts`: < 500 lines
- `@state()` in app.ts: < 30

### Zombie check
```bash
# Should return ZERO results for deleted modules
grep -rn 'brief-notes\|people-data\|file-explorer\|mission-control\|focus-pulse\|clawhub' src/ ui/src/ --include='*.ts' | grep -v node_modules | grep -v '\.test\.'
```

### State check
```bash
grep -c '@state()' ui/src/ui/app.ts
# Target: < 30
```

### Commit message
```
feat(v3-slim): decompose God Component, collapse view/tab duplication, delete orphans

- Delete orphan backend methods: brief-notes, people-data, proactive-intel (~450 lines)
- Delete dead UI: file-explorer, focus-pulse/clawhub/mission-control controllers (~244 lines)  
- Merge 5 view/tab duplicate pairs: chat, today, work, second-brain, dashboards (~3,500 lines)
- Move 275+ @state() properties from app.ts into tab components
- Delete app-render.helpers.ts, app-view-state.ts, app-settings.ts, app-chat.ts, app-channels.ts, app-scroll.ts
- Shrink app-render.ts from 1,870 to ~200 lines (tab components self-render)
- app.ts: 4,055 → <500 lines, 306 @state → <30
- Fix 46 empty catch blocks
- Backend: ~53K → ~52K LOC
- UI: ~44K → ~32K LOC
```

---

## What NOT To Do

- ❌ Do NOT add any new features
- ❌ Do NOT touch the context stack (before-prompt-build, awareness-snapshot, context-budget) — it works
- ❌ Do NOT touch the trust system — it's correctly wired
- ❌ Do NOT restructure the queue processor — it's working
- ❌ Do NOT create a design system or design tokens (separate task)
- ❌ Do NOT build SOUL.md generation (separate task)
- ❌ Do NOT change any RPC method signatures — API compatibility matters
- ❌ Do NOT delete `views/workspaces.ts` (1,541 lines — it's the complex workspace browser, actively used by work-tab)
- ❌ Do NOT delete `views/nodes.ts` (1,166 lines — active feature)
- ❌ Do NOT delete `views/onboarding-wizard.ts` (867 lines — active feature)
- ❌ Do NOT delete anything registered in `src/adapter/register-all.ts`
- ❌ Do NOT replace the `@lit/context` + event-bus architecture — extend it
- ❌ Do NOT try to do all phases at once. **Complete one phase, build, verify, then move to next.**

## Phasing Strategy

**If time-constrained, phases are prioritized by impact:**

1. **Phase 1** (dead code deletion) — lowest risk, immediate LOC reduction, 30 min
2. **Phase 3** (God Component decomposition) — highest impact, most complex, 4-6 hours
3. **Phase 2** (view/tab merging) — medium impact, required foundation for Phase 3, 2-3 hours
4. **Phase 4** (silent catches) — quality improvement, 1 hour

**Recommended order: 1 → 2 → 3 → 4.** Phase 2 (merging views into tabs) creates the foundation that Phase 3 (moving state into tabs) builds on.

**This is a subtraction task. The only new code you write is moving existing logic into tab components and adding one-line catch messages. Everything else is deletion and merging.**
