# Dashboards Tab MVP — Implementation Plan

> **Goal:** Make the Dashboards tab deliver real value on first visit using data GodMode already has. No new integrations, no aspirational features, no fabricated data. Every template works or it doesn't exist.

## Context for the Agent

**Read these files first:**
- `docs/GODMODE-META-ARCHITECTURE.md` — the vision source of truth
- `AGENTS.md` — coding guardrails, branch discipline
- `src/methods/dashboards.ts` — backend (730 lines). Has `widgetData` API that serves: `tasks-summary`, `tasks-today`, `queue-status`, `trust-scores`, `agent-activity`, `brief-summary`, `streak-stats`, `workspace-stats`. These ALL read from real JSON files in `~/godmode/data/`.
- `ui/src/ui/views/dashboards.ts` — frontend view (380 lines)
- `ui/src/ui/controllers/dashboards.ts` — frontend controller (148 lines)
- `src/methods/trust-tracker.ts` — trust system backend (687 lines)
- `ui/src/ui/views/trust-tracker.ts` — trust UI currently lives in Settings

**Existing dashboard data on disk:**
- `~/godmode/data/dashboards/index.json` — manifest index (has 2 legacy dashboards)
- Legacy dashboards use a flat format (`{ id, title, file, icon, generatedAt, tags }`) that differs from the TypeScript type (`DashboardManifest` with `scope`, `createdAt`, `updatedAt`, `createdBy`). The `get` handler already handles both flat HTML files and subdirectory layouts.
- Real data exists: trust-tracker.json (145 lines, multiple workflows), tasks.json, queue.json

**Key architecture quote:** *"Dashboards tab is for GodMode-native views only (trust, impact, brief summaries). As the ally observes patterns, it builds dashboards."*

---

## The 5 Changes (in order)

### 1. Replace Fake Templates with Working Ones

**File:** `ui/src/ui/views/dashboards.ts`

**What:** Replace the 6 `DEFAULT_TEMPLATE_IDEAS` with 3 that use ONLY data sources that actually exist via `widgetData`:

```typescript
const DEFAULT_TEMPLATE_IDEAS: DashboardTemplate[] = [
  {
    id: "operations-overview",
    name: "Operations Overview",
    category: "system",
    description: "Queue status, agent activity, and task summary",
    prompt: `Create an operations dashboard for GodMode. Use the dashboards.widgetData RPC to fetch these widgets: ["queue-status", "agent-activity", "tasks-summary", "workspace-stats"]. Display the data as a clean HTML dashboard with CSS grid. Show: queue pipeline (pending → processing → review → done → failed), agent activity (completed/errors today), task breakdown (pending/completed/overdue/high-priority), workspace count. Use the GodMode dark theme (background: #1a1a2e, cards: #16213e, accent: #0f3460, text: #e0e0e0). No external dependencies. Title: "Operations Overview".`,
  },
  {
    id: "trust-progression",
    name: "Trust Progression",
    category: "system",
    description: "Trust scores by workflow, trends, and daily rating streak",
    prompt: `Create a trust progression dashboard for GodMode. Use the dashboards.widgetData RPC to fetch these widgets: ["trust-scores", "streak-stats"]. Display: each workflow with its average score (color-coded: green ≥8, yellow ≥5, red <5) and rating count, a simple CSS bar chart of recent daily ratings, the current daily rating streak. Use the GodMode dark theme (background: #1a1a2e, cards: #16213e, accent: #0f3460, text: #e0e0e0). No external dependencies. Title: "Trust Progression".`,
  },
  {
    id: "daily-snapshot",
    name: "Daily Snapshot",
    category: "productivity",
    description: "Today's tasks, brief status, and queue at a glance",
    prompt: `Create a daily snapshot dashboard for GodMode. Use the dashboards.widgetData RPC to fetch these widgets: ["tasks-today", "brief-summary", "queue-status", "streak-stats"]. Display: today's pending tasks as a checklist, daily brief status (exists/checkboxes completed), queue pipeline counts, daily rating streak. Use the GodMode dark theme (background: #1a1a2e, cards: #16213e, accent: #0f3460, text: #e0e0e0). No external dependencies. Title: "Daily Snapshot".`,
  },
];
```

**Kill:** Remove `Morning Overview` (references non-existent readiness score), `Health & Energy` (references non-existent Oura), `Goals Tracker` (goals.json is empty), `Content Performance` (no X analytics). These are trust-destroyers.

**Acceptance:** Every template prompt references only `widgetData` widget types that return real data. No fabrication possible.

---

### 2. Remove `recent-files` and `wheel-of-life` Widget Types

**File:** `src/methods/dashboards.ts`

**What:** Delete the `case "recent-files"` block (lines ~508-553) and the `case "wheel-of-life"` block (lines ~489-505).

- `recent-files` is a scope violation — it's a mini file explorer, which the meta-architecture explicitly forbids.
- `wheel-of-life` reads from `~/.openclaw/dashboards/data/wheel-of-life.json` — a dead path from the old OpenClaw layout that doesn't exist.

**Replace both with:** `data[widgetId] = null;` (same as other removed widgets).

**Acceptance:** `rg "recent-files" src/methods/dashboards.ts` returns only the null case. `rg "wheel-of-life" src/methods/dashboards.ts` returns only the null case.

---

### 3. Fix Category System — Store Category on Manifest

**Files:** `src/methods/dashboards.ts`, `ui/src/ui/views/dashboards.ts`, `ui/src/ui/controllers/dashboards.ts`

**What:**

**Backend** — Add `category?: string` to the `DashboardManifest` type. In the `save` handler, accept `category` from params and store it on the manifest:

```typescript
// In the save handler, after line ~181
category: typeof p.category === "string" ? p.category : undefined,
```

Add `category` to the params type as well.

**Frontend view** — Update `inferCategory()` to check `dashboard.category` first, falling back to keyword inference only if category is missing:

```typescript
function inferCategory(dashboard: DashboardManifest): string {
  if (dashboard.category && CATEGORIES[dashboard.category]) return dashboard.category;
  // ... existing keyword fallback for legacy dashboards
}
```

**Frontend controller** — Add `category?: string` to the `DashboardManifest` type.

**Acceptance:** New dashboards saved with a `category` param use it directly. Old dashboards without `category` still get keyword-inferred categories. No breaking changes.

---

### 4. Wire `setActive` to Auto-Open Default Dashboard on Tab Load

**Files:** `ui/src/ui/controllers/dashboards.ts`, `ui/src/ui/views/dashboards.ts`

**What:** When the Dashboards tab loads and `activeDashboardId` is set in the response from `dashboards.list`, automatically load and display that dashboard instead of showing the gallery.

**Controller change** — In `loadDashboards()`, after setting `state.activeDashboardId` from the list response, if it's non-null, immediately call `loadDashboard(state, state.activeDashboardId)`:

```typescript
// After line ~55 in loadDashboards()
state.activeDashboardId = result.activeDashboard;

// Auto-open the active/default dashboard
if (result.activeDashboard) {
  await loadDashboard(state, result.activeDashboard);
}
```

**View change** — The gallery view already has pin buttons. Make sure clicking "Pin" calls `dashboards.setActive` (not just toggle a local `pinned` flag). The pinned dashboard becomes the auto-open default.

Check how the app.ts handles `onTogglePin` — it should call `dashboards.setActive` with the dashboard ID (or null to unpin). If it's only toggling a local `pinned` boolean, wire it to the RPC. Only one dashboard can be active/default at a time.

**Acceptance:** Pin a dashboard → leave tab → return to tab → that dashboard is shown immediately. Unpin → gallery is shown.

---

### 5. Remove `impact-summary` Ghost Widget

**File:** `src/methods/dashboards.ts`

**What:** The `impact-summary` case already returns `null` with a comment `// REMOVED (v2 slim): impact-ledger`. This is fine — leave the null return so old dashboards referencing it don't crash, but remove the comment that implies it might come back. It won't. Impact tracking, if it returns, would be a different system.

Also remove `goals-progress` case — it reads `goals.json` which has no data and no system populating it. Replace with `data[widgetId] = null;`.

**Acceptance:** Dead widget types return null cleanly. No misleading comments.

---

## What This Does NOT Do (And Why)

| Not doing | Why |
|-----------|-----|
| Proactive dashboard generation | Requires heartbeat/cron integration — Phase 2. Get the tab working first. |
| Moving trust-tracker into dashboards | The trust view is 785 lines of custom Lit HTML. It's not a "dashboard" in the HTML-file sense. Phase 2: render it as a native panel within the dashboards tab. |
| Auto-refresh / live data | Requires either SSE or a timer loop in the UI. Phase 2. Static snapshots are fine for MVP if the data is real. |
| Scope/workspace filtering | No users are using multiple workspaces yet. Phase 2. |
| Default shipped dashboards on first run | Would require generating HTML at install time without the ally. The 3 honest templates are the right first-run experience — user clicks one, ally builds it from real data. |

---

## Branch & Build

1. `git checkout -b feat/dashboards-mvp` from latest `main`
2. Make all changes
3. `pnpm build` — must pass clean
4. `pnpm build:ui` — must pass clean (view changes are UI code)
5. `pnpm ui:sync` — refresh fallback snapshot
6. Test: verify `dashboards.widgetData` returns real data for `["queue-status", "agent-activity", "tasks-summary", "trust-scores", "streak-stats", "workspace-stats", "tasks-today", "brief-summary"]`
7. Commit and push

## Files Modified (Complete List)

| File | What changes |
|------|-------------|
| `src/methods/dashboards.ts` | Add `category` to manifest type + save handler. Remove `recent-files` and `wheel-of-life` widget cases. Clean up `impact-summary` and `goals-progress` comments. |
| `ui/src/ui/views/dashboards.ts` | Replace 6 fake templates with 3 real ones. Update `inferCategory()` to check manifest `category` first. |
| `ui/src/ui/controllers/dashboards.ts` | Add `category` to type. Auto-load active dashboard in `loadDashboards()`. |

**Total scope: ~3 files, ~80 lines changed.** This is a cleanup + realignment, not a feature build.
