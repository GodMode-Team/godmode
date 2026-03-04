# QC Report: Task Completion Sync Gap Fix

**Reviewer:** QC Agent
**Date:** 2026-03-04
**Branch:** `task/fix-the-task-completion-sync-gap-godmode-ca6a46`
**Build:** PASS
**Typecheck:** PASS

---

## Summary

Solid implementation. 3 files changed for this feature (tasks.ts +144 lines, consciousness-heartbeat.ts +86 lines, daily-brief.ts +2 lines). Matches the design brief with one pragmatic adaptation. One minor fix applied (misleading comment).

## Fixes Applied

### 1. Misleading comment on inlined normalizeTitle (src/methods/tasks.ts:818)

**Issue:** Comment said "Same logic as normalizeTitle from daily-brief.ts" but the inline version adds `.toLowerCase()` which the original does not. Misleading for future maintainers.

**Fix:** Updated comment to "Inlined from normalizeTitle (daily-brief.ts) + toLowerCase for comparison".

## Design Brief Deviations (Accepted)

### 1. `details` field instead of `candidates` in AMBIGUOUS_MATCH response

The design brief specifies a `candidates` field, but the SDK error type only allows `details?: unknown`. The builder correctly used `details` to satisfy the type system. The data shape (array of `{id, title, score}`) matches the spec — only the field name differs. Consumers should read `error.details` instead of `error.candidates`.

### 2. Inlined normalizeTitle instead of importing from daily-brief.ts

The brief said to use a dynamic import of `normalizeTitle` from daily-brief.ts. The builder inlined the logic because `titleSimilarity` is a synchronous function and async dynamic imports would be awkward. The inlined version is functionally identical (same regex pipeline) plus `.toLowerCase()` for case-insensitive comparison. Trade-off: slight maintenance risk if normalizeTitle changes in daily-brief.ts, but the function has been stable since initial implementation.

Note: `normalizeTitle` and `titlesMatch` were still correctly exported from daily-brief.ts as the brief specified — the exports are available for other consumers even though this handler doesn't use them.

## Verification

- `pnpm build` — PASS (no errors, no new warnings)
- `pnpm typecheck` — PASS
- Forbidden import check (`rg "../../../../src/"`) — clean
- No console.log/debug artifacts
- No AI copy patterns in CONSCIOUSNESS.md section text

## Design Brief Compliance

| Requirement | Status |
|---|---|
| `tasks.markDoneByTitle` RPC handler | PASS |
| Input validation (missing title) | PASS |
| `titleSimilarity()` scoring (3 tiers) | PASS |
| Exact match = 100 | PASS |
| Substring match = 85 | PASS |
| Jaccard word overlap = 0-80 (fuzzy only) | PASS |
| Threshold = 80 for auto-match | PASS |
| AMBIGUOUS_MATCH with candidates | PASS (field name adapted to SDK type) |
| NO_MATCH with best candidate info | PASS |
| Only matches pending tasks | PASS |
| Sets `status: "complete"` + `completedAt` | PASS |
| Does NOT overwrite `source` field | PASS |
| Brief sync via `syncBriefFromTasks()` | PASS |
| Team sync via `triggerTeamSyncIfNeeded()` | PASS |
| Handler registered in `tasksHandlers` export | PASS |
| `readTasks` exported from tasks.ts | PASS (was already exported) |
| `normalizeTitle` exported from daily-brief.ts | PASS |
| `titlesMatch` exported from daily-brief.ts | PASS |
| `appendTaskDashboard()` on ConsciousnessHeartbeat | PASS |
| Task Pulse section format (counts + checkboxes) | PASS |
| Top 3 pending by priority then dueDate | PASS |
| Recently completed (top 3, desc by completedAt) | PASS |
| Includes archived completed tasks | PASS |
| Section replacement regex (same pattern as roster) | PASS |
| Called after `appendRosterContext()` in tick | PASS |
| Fire-and-forget with `.catch(() => {})` | PASS |
| No shell script changes | PASS |
| No WORKING.md auto-update | PASS (correctly deferred) |

## Edge Cases Reviewed

- **Empty pending list:** Returns NO_MATCH with clear message. Dashboard shows "0 pending". OK.
- **Race condition (task completed between read and update):** Handled — `updateTasks` re-reads under lock, returns null if task gone, handler responds with "Task disappeared". OK.
- **Tasks without dueDate in dashboard sort:** Handled — tasks with dueDate sort before those without, then fallback to createdAt. OK.
- **CONSCIOUSNESS.md doesn't exist:** Early return via `existsSync` check. OK.
- **`fuzzy: false` (default):** Only tiers 1-2 (exact + substring). Word overlap skipped. Matches spec.

## No Architectural Issues Found
