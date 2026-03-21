# Overnight Improvement Sprint Plan
## Branch: feat/overnight-improvement-sprint
## Created: 2026-03-21

### Baseline Status
- **Backend tests:** 8/8 files pass, 121/121 tests pass ✅
- **UI browser tests:** 9/25 files failing, 30/198 tests failing ❌
- **Build:** Clean ✅
- **Unhandled errors:** 2 (TypeError in file-click.ts)

### Objective
Recursively improve the codebase overnight using autonomous agents with real testing.
All work on `feat/overnight-improvement-sprint` branch.

---

## Workstream 1: Fix All Failing UI Browser Tests (30 failures → 0)

The 30 failing tests are stale assertions against old UI state. The tests need updating
to match current implementation, NOT the implementation changing to match old tests.

### Categories of failures:
1. **Navigation/tabs tests** (navigation.test.ts, tabs.browser.test.ts) — tests reference
   "overview" tab which is now "dashboards", "Control" group which was renamed, etc.
2. **Workspaces tests** (workspaces.browser.test.ts) — 9 failures, tests expect old
   class names and text like "No workspaces found" vs actual "No workspaces yet"
3. **Today tab tests** (today.browser.test.ts) — expects `.brief-section` and `.today-view-toggle`
   which have been renamed/restructured
4. **Chat view tests** (views/chat.test.ts) — expects "New session" button and consciousness icon
5. **Config controller tests** (controllers/config.test.ts) — expects `update.run` but actual is `godmode.update.run`
6. **Chat markdown tests** (chat-markdown.browser.test.ts) — document viewer link handling
7. **Grouped render tests** (grouped-render.test.ts) — image placeholder text changed
8. **Navigation browser tests** (navigation.browser.test.ts) — URL param hydration tests

### Approach:
For each failing test: read the test, read the current implementation, update the test
assertions to match current behavior. Run vitest after each fix to verify.

---

## Workstream 2: Fix Unhandled Errors

2 unhandled TypeError: `target.closest is not a function` in `file-click.ts:11`.
This is a real bug in production code — `handleChatFileClick` doesn't guard against
non-Element targets.

### Fix:
Add type guard: `if (!(target instanceof Element)) return;` before `target.closest()`.

---

## Workstream 3: Add Missing Backend Test Coverage

Current backend tests cover: evidence, trust-refinement, agent-roster, context-budget,
safety-gates, audit-log, queue-state, awareness-snapshot.

### Missing test areas (high-value):
- `src/methods/tasks.ts` — task CRUD
- `src/methods/queue.ts` — queue operations
- `src/methods/calendar.ts` — calendar integration
- `src/methods/daily-brief.ts` — brief generation
- `src/services/queue-processor.ts` — queue processing
- `src/lib/ally-identity.ts` — ally identity
- `src/methods/auth.ts` — auth handling
- `src/hooks/tool-grounding-gate.ts` — tool grounding

---

## Workstream 4: TypeScript Strict Mode Hardening

Run `tsc --noEmit --strict` and fix any type errors. Focus on:
- Eliminating `any` types
- Adding proper return types
- Fixing null safety issues

---

## Workstream 5: Code Quality & Dead Code Removal

- Find and remove dead/unreachable code
- Consolidate duplicate logic
- Improve error handling patterns
- Verify no imports reference old deleted modules

---

## Success Criteria
1. All 198+ UI tests pass (0 failures)
2. All 121+ backend tests pass (0 failures)
3. 0 unhandled errors
4. Build still passes
5. New backend tests added for untested modules
6. All changes on feat/overnight-improvement-sprint branch
7. Each workstream commits independently with clear messages
