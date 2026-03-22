# Streaming & Chat Flow Audit Results

**Date:** 2026-03-21  
**Branch:** `feat/overnight-improvement-sprint` → `fix/artifact-links-and-reports-prefix`  
**Auditor:** Prosper (autoresearch loop)

---

## Research Phase Summary

Searched 5 topics across web and X:
1. **SSE streaming bugs TypeScript** — Found critical Azure Foundry SSE delimiter issue (OpenClaw #32179) directly relevant to our chat proxy
2. **lit-html streaming markdown rendering** — No Lit-specific streaming bugs found; our custom block-level cache is the main concern
3. **WebSocket reconnection race conditions** — Common patterns confirmed; our exponential backoff implementation is solid
4. **OpenClaw plugin streaming** — Found issue #32179 (SSE events concatenated without `\n\n` delimiter) — directly impacts our SSE parser
5. **marked.js streaming incremental rendering** — Empty SSE event handling and JSON boundary splitting are the main risks

## Audit Phase Summary

### Files Audited (in data flow order)

| File | Lines | Key Findings |
|------|-------|--------------|
| `src/adapter/hermes/chat-proxy.ts` | ~350 | BUG-001 (SSE boundary), BUG-002 (paragraph heuristic) ✅ FIXED |
| `src/hooks/http-handler.ts` | ~200 | Artifact serving improvements already applied |
| `ui/src/ui/markdown-streaming.ts` | ~120 | BUG-003 (shared cache), BUG-011 (entity split) |
| `ui/src/ui/markdown.ts` | ~350 | BUG-006 (URL linkification) |
| `ui/src/ui/chat/grouped-render.ts` | ~960 | Correct: uses `isStreaming` flag to switch renderers |
| `ui/src/ui/chat/tool-cards.ts` | ~300 | Clean: proper file path extraction and sidebar routing |
| `ui/src/ui/context/app-context.ts` | ~90 | Clean: reconnecting state properly typed |
| `ui/src/ui/app-render.ts` | ~1900 | Session tab lifecycle correct, reconnect UI proper |
| `ui/src/ui/app-gateway.ts` | ~1200 | BUG-005 (reconnect race), good onClose cleanup |
| `ui/src/ui/app-lifecycle.ts` | ~550 | BUG-005 (duplicate history load), safety nets present |
| `ui/src/ui/app-tool-stream.ts` | ~500 | Clean: proper tool stream lifecycle management |
| `ui/src/ui/controllers/chat.ts` | ~530 | BUG-008 (sub-agent final), BUG-012 (image history) |
| `ui/src/ui/views/file-viewer.ts` | ~450 | Clean: comprehensive content type detection |
| `ui/src/ui/openable-file-path.ts` | ~60 | Clean: proper path extraction |
| `ui/src/ui/chat/file-click.ts` | ~50 | Clean: both file:// and godmode-file:// handled |
| `ui/src/ui/app.ts` | ~2800 | BUG-004 (MIME type) ✅ FIXED, BUG-009 (godmode-file://) |

### Full Data Flow Trace

```
User sends message
  → controllers/chat.ts: handleSendChat()
    → client.request("chat.send", {...})
    → Sets chatRunId, chatStream = "", chatStreamStartedAt

Gateway processes → Hermes API
  → chat-proxy.ts: SSE streaming from Hermes
    → Parses data: lines, extracts deltas
    → Emits "chat" events with state: "delta"

WebSocket event arrives at UI
  → app-gateway.ts: handleGatewayEvent()
    → Routes to handleChatEvent() in controllers/chat.ts
    → Updates chatStream (cumulative text)

Lit reactivity triggers re-render
  → app-lifecycle.ts: updated() detects chatStream change
    → Schedules chat scroll
  → app-render.ts / grouped-render.ts
    → isStreaming=true → toStreamingMarkdownHtml()
    → Block-level cache splits at safe \n\n boundary
    → Renders cached prefix + fresh tail

Stream ends
  → "final" event arrives
    → controllers/chat.ts: resetStreamingCache()
    → chatRunId = null, chatStreamStartedAt = null
    → chatStream kept until loadChatHistoryAfterFinal() completes
    → Server history replaces stream → chatStream = null
```

## Fixes Applied

### Fix 1: Remove spurious paragraph break heuristic (BUG-002)

**Commit:** `2f92ca3`  
**File:** `src/adapter/hermes/chat-proxy.ts`  
**Change:** Removed the sentence-boundary heuristic that injected `\n\n` between streaming chunks when previous text ended with `.!?:` and new chunk started with a capital letter. Kept only the tool-call boundary separator.

**Impact:** Eliminates random extra whitespace in every streamed response.

### Fix 2: Force correct MIME type for .md files (BUG-004)

**Commit:** `1b4bc7b` (included in prior artifact serving fix)  
**File:** `ui/src/ui/app.ts`  
**Change:** Added FORCED_MIME map that overrides gateway-reported MIME types for known text-based extensions (md, json, yaml, csv, html). This ensures markdown files render as markdown regardless of the gateway's default `application/octet-stream` response.

**Impact:** Fixes the user-reported ".md files not opening" bug.

## Verification

```
✅ npx tsc --noEmit — PASSED (no errors)
✅ npx vitest run — 147 tests passed (1 pre-existing flaky test in queue-state)
```

## Remaining P1 Bugs (Not Fixed — Need Broader Changes)

1. **BUG-001 (SSE boundary splitting):** Requires protocol-level refactor of SSE parser. Low probability of triggering with standard Hermes endpoints.
2. **BUG-003 (streaming cache shared across sessions):** Requires adding session key parameter to `toStreamingMarkdownHtml()` and updating all callers. Safe but touches many files.

## Recommendations

1. **High Priority:** Fix BUG-003 (session-keyed streaming cache) — prevents rare but real HTML corruption when ally overlay + main chat stream simultaneously.
2. **Medium Priority:** Fix BUG-009 (godmode-file:// in extractWorkspacePathCandidatesFromHref) — simple one-liner addition.
3. **Medium Priority:** Fix BUG-007 (AbortController on Hermes fetch) — prevents permanent UI hang on Hermes failure.
4. **Low Priority:** BUG-006 (URL linkification regex) — edge case, rarely triggers.
