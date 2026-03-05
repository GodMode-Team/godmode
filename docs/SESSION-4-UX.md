# Session 4: UX — Nav Simplification, Demo Brief, Ally Sync Fix

## What This Session Is

This is a UI/UX implementation session. You are simplifying the GodMode UI to the 6-tab baseline and fixing the onboarding first-win experience. Read the architecture doc first.

## CRITICAL: Read These Files First

1. `docs/GODMODE-META-ARCHITECTURE.md` — **THE LAW**. Read section 2 (Product Surface) carefully.
2. `CLAUDE.md` — build instructions, UI build process (`pnpm build:ui && pnpm ui:sync`)
3. `ui/src/ui/navigation.ts` — tab definitions, groups, icons, titles (read fully)
4. `ui/src/ui/app-render.ts` — main render function, sidebar nav rendering (read fully)
5. `ui/src/ui/app.ts` — app state, tab switching logic (read fully)
6. `ui/src/ui/app-gateway.ts` — gateway event routing, ally message sync (read fully)
7. `ui/src/ui/views/ally-chat.ts` — the right-hand ally panel (read fully)
8. `ui/src/ui/controllers/ally.ts` — ally session key and context (read fully)
9. `src/methods/brief-generator.ts` — how the daily brief is generated (read fully)
10. `src/lib/awareness-snapshot.ts` — awareness snapshot generation (read fully)
11. `src/methods/onboarding.ts` — the quickSetup path and phase definitions (search for `quickSetup`)
12. `src/hooks/onboarding-context.ts` — phase-specific prompts (read fully)

## Branch

Work on branch `feat/v1.6.0-ux`. Create it from `main`.

## Tasks (in order)

### Task 1: Nav Simplification — 6 Tabs

Change the sidebar navigation to show only 6 core tabs by default, with power-user tabs behind an expandable section.

**In `ui/src/ui/navigation.ts`:**

Change `TAB_GROUPS` to:

```typescript
export const TAB_GROUPS = [
  { label: "", tabs: ["chat", "today", "workspaces", "second-brain", "dashboards"] },
  { label: "Settings", tabs: ["config"] },
] as const;

export const POWER_USER_GROUPS = [
  { label: "Toolkit", tabs: ["skills", "trust", "guardrails", "options"] },
  { label: "System", tabs: ["mission-control", "overview", "channels", "instances", "sessions", "cron", "nodes", "debug", "logs"] },
] as const;
```

Note: "workspaces" is the tab key but it displays as "Work" (the `titleForTab` already returns "Work" for "workspaces"). Keep this as-is.

**In `ui/src/ui/app-render.ts`:**

Find where the sidebar nav is rendered (it iterates `TAB_GROUPS`). After the main groups, add a collapsible "Advanced" or "Mission Control" section that renders `POWER_USER_GROUPS` only when expanded. Use a simple toggle:

- Add `missionControlExpanded: boolean` to the app state (default: `false`)
- Render a clickable "Mission Control >" toggle at the bottom of the sidebar
- When expanded, show the Toolkit and System tab groups
- When collapsed, hide them
- Persist the expanded state in localStorage so power users don't have to re-expand every time

**Important:** Do NOT delete any tab definitions, paths, icons, or view rendering code. All tabs must still work if navigated to directly (via URL or programmatically). We're only hiding them from the default sidebar nav.

### Task 2: Demo Brief — Zero-Integration First Win

Create a lightweight brief that works with just name + timezone (no Calendar, no X Intel, no Obsidian required).

**In `src/methods/brief-generator.ts`:**

Find the main brief generation function. Add a fallback path that triggers when integrations aren't configured:

- Check if Calendar is configured (gog CLI available)
- Check if X Intelligence is configured (XAI_API_KEY present)
- If NEITHER is configured, generate a "starter brief" instead of the full brief

The starter brief should include:
- **Date + greeting** using the user's name (from USER.md or onboarding state)
- **Today's Focus** — pull from tasks (always available, stored in `~/godmode/data/tasks.json`)
- **Active Queue** — show queue status (always available)
- **Priorities** — pull from daily brief "Win The Day" section if it exists, or prompt the user to set them
- **Tip of the Day** — one actionable suggestion for getting more out of GodMode (rotate through a small list)
  - "Try saying 'queue a research task on [topic]' to delegate work to an agent"
  - "You can connect your Google Calendar for a richer morning brief — ask me how"
  - "Want me to set up a recurring skill? Just tell me what you want done and when"
  - "Your Second Brain in Obsidian is where all your agent outputs land — check it out"
  - "Rate your agent outputs to build trust scores — the system learns from your feedback"

The starter brief should end with a nudge: "Want a richer brief? Connect your calendar and X intelligence in Settings > Config."

**In `src/hooks/onboarding-context.ts`:**

Find the Phase 5 (First Win) prompt. Update it to reference the starter brief:
- "Generate a morning brief for the user. Even without integrations, the starter brief shows tasks, queue status, and GodMode tips. Run `briefGenerator.generate` now."

**In `src/methods/onboarding.ts`:**

Find the `quickSetup` handler. After it marks phases 0 and 1 as complete, also mark phase 2 as complete (MEMORY.md can be auto-seeded later). Jump the user to phase 5 (First Win) instead of phase 2, so they see the brief immediately.

### Task 3: Ally Chat Sync Fix

Fix the ally panel not staying in sync with the main Chat tab and iMessage.

**Diagnosis approach:** The ally panel uses `state.allyMessages` which is populated via gateway events in `app-gateway.ts`. The main Chat tab uses `state.messages` for the current session. Both should reflect session key `"main"` but may diverge due to:

1. **Message arrival timing** — new messages from iMessage/gateway may not trigger an ally panel re-render
2. **Noise filtering divergence** — `cleanForAlly()` may strip messages that should be visible
3. **History loading** — ally panel may not reload history when opened, showing stale state
4. **Streaming state** — `allyStream` vs main chat streaming may conflict

**In `ui/src/ui/app-gateway.ts`:**

Search for where `chat.delta`, `chat.final`, and `chat.history` events are handled. Verify:

1. When a `chat.final` event arrives for session `"main"`, it updates BOTH `state.messages` (if Chat tab is showing session "main") AND `state.allyMessages`. If there's a code path where one updates but not the other, fix it.

2. When the ally panel opens (toggle from closed to open), it should reload recent history: call `chat.history` for session `"main"` and populate `allyMessages`. Find where `allyPanelOpen` is set to `true` and add a history reload if `allyMessages` is empty or stale.

3. Check `cleanForAlly()` in `ui/src/ui/views/ally-chat.ts` — if it's stripping user messages or important assistant responses, relax the filter. It should only strip system prompts, heartbeat injections, and persona dumps — never user messages or substantive assistant responses.

**In `ui/src/ui/views/ally-chat.ts`:**

4. When the ally panel receives a new message, it should auto-scroll to the bottom. Check if there's a scroll-to-bottom on new message. If not, add it.

5. The unread badge on the ally bubble should clear when the panel is opened. Verify this works.

**Test the fix by:**
- Open the UI to the Today tab
- Send a message via the ally bubble
- Switch to the Chat tab — the message should be there
- Switch back to Today — the ally bubble should show the response
- If you can test iMessage (the user's ally is named "Prosper"), verify messages from iMessage appear in the ally panel

### Task 4: Trust + Impact as Dashboard Prompts

Instead of building new dashboard views (that's engine work), update the ally's awareness of what dashboards to offer.

**In `src/hooks/agent-persona.ts`:**

Add to the ALLY_IDENTITY "How You Work" section:
```
- Proactively build dashboards for the user — business metrics, fitness, yesterday's impact, trust progression, weekly content performance. Use the dashboards.create RPC.
```

**In `src/lib/awareness-snapshot.ts`:**

In `generateSnapshot()`, add a conditional section at the end — if trust-tracker data exists (`~/godmode/data/trust-tracker.json`), add 1-2 lines:
```
## Trust
- 3 workflows tracked. Highest: email drafts (8.2/10). Lowest: code reviews (5.1/10).
```

Keep it to 2 lines max. Only add if the file exists and has data.

## Build Verification

After all tasks, run:
```bash
cd ui && pnpm build && cd .. && pnpm build && pnpm ui:sync && pnpm typecheck
```

Or if the project has a combined build:
```bash
pnpm build:ui && pnpm ui:sync && pnpm build && pnpm typecheck
```

Fix any type errors or build failures. The build MUST pass.

## What NOT to Do

- Do NOT delete any tab definitions, views, or rendering code — only hide from default nav
- Do NOT touch the queue processor or agent roster (that's Session 3)
- Do NOT create new RPC handlers
- Do NOT add more than 5 lines to the awareness snapshot
- Do NOT restructure the ally panel architecture — just fix the sync bugs
- Do NOT touch `agent-persona.ts` ALLY_IDENTITY beyond the one line addition about dashboards

## Commit

After everything builds, commit with a clear message. Use branch `feat/v1.6.0-ux`.

Update `RECENT-CHANGES.md` at the top with a summary of what changed.
