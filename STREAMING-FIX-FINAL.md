# STREAMING-FIX-FINAL.md

**Date:** 2026-03-21  
**Branch:** feat/overnight-improvement-sprint  
**Final verification:** tsc + vitest both pass (147/147 tests)

---

## Bugs Fixed (13 new commits this session)

| Commit | Bug ID | Description |
|--------|--------|-------------|
| c06d21f | CRITICAL-2 | Bare filename regex matches any filename (not just hyphenated) |
| afa7878 | CRITICAL-1a | handleOpenFile falls back to cached content when gateway offline |
| ad98f22 | BUG-001 | Flush SSE buffer after stream ends to handle chunk-split [DONE] |
| a9a5a6a | BUG-003 | Key streaming markdown cache per session (prevents cross-session corruption) |
| ea6f186 | BUG-004 | handleOpenFile falls back to HTTP artifact endpoint on gateway failure |
| 52c0c3d | BUG-005 | Debounce reconnect chat history load (prevents duplicate RPC) |
| ed8e65f | BUG-006 | Prevent linkifyFilePaths from matching paths inside URLs |
| d6cce49 | BUG-007 | Add AbortController with 2min timeout to Hermes fetch |
| 9808352 | BUG-008 | Queue sub-agent final events during active stream (not drop) |
| 74b13f2 | BUG-009 | Handle godmode-file:// protocol in path candidate extraction |
| 44e6018 | BUG-010 | Reset streaming cache on new session creation |
| c66da9b | BUG-012 | Include image filenames in history serialization |
| 0dcde28 | — | Monday merge script |

### Cherry-picked from fix/artifact-links-and-reports-prefix:
| Commit | Description |
|--------|-------------|
| e05c779 | Remove spurious paragraph break heuristic in SSE streaming (BUG-002) |
| 7eb6abc | Artifact serving, reports prefix rewriter, click-to-open file links |
| 2fb06ad | Streaming audit results and bug report |

## Bugs Skipped

| Bug ID | Severity | Reason |
|--------|----------|--------|
| BUG-011 | P3 | findSafeSplitPoint inside HTML entities — extremely rare edge case, documented as known limitation per audit recommendation |

## Test Results

- **TypeScript:** npx tsc --noEmit — PASS (0 errors)
- **Tests:** 147 passed, 0 failed (11 test files)
- **Total commits on branch vs main:** 38

## Architecture Decisions

1. **Streaming cache (BUG-003):** Used a Map keyed by sessionKey instead of single globals. Parameter is optional for backward compat.
2. **File viewer fallback (CRITICAL-1):** Three-tier fallback: gateway RPC → HTTP artifact endpoint → cached tool result content. Never silently fails.
3. **AbortController (BUG-007):** 120s timeout. AbortError handled distinctly from other errors to show "Hermes may be unreachable" message.
4. **Sub-agent events (BUG-008):** Added refreshSessionsAfterChat to ChatState type. Queued events trigger reload when current stream ends.
5. **Bare filename regex (CRITICAL-2):** Removed the [-_] requirement. Now matches report.md, notes.md, etc.

## Merge Instructions

Run from ~/Projects/godmode-plugin:
```bash
./scripts/monday-merge.sh
```

Or manually:
```bash
git checkout feat/overnight-improvement-sprint
npx tsc --noEmit && npx vitest run
git checkout main
git merge feat/overnight-improvement-sprint --no-ff
```
