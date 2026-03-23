# Streaming & Chat Flow Bug Audit

**Date:** 2026-03-21  
**Branch:** `feat/overnight-improvement-sprint`  
**Auditor:** Prosper (autoresearch loop)

---

## P1 — Broken Features

### BUG-001: SSE Parser Silently Drops Data When Chunk Boundary Splits a `data:` Line

**File:line:** `src/adapter/hermes/chat-proxy.ts:230-240`  
**What's wrong:** The SSE parser splits incoming bytes on `\n` and processes each line. But `buffer += decoder.decode(value, { stream: true })` followed by `buffer.split("\n")` can split a `data:` line across two TCP chunks. The incomplete tail is kept in `buffer`, BUT there's a subtle bug: if a chunk ends exactly at `\r` (before `\n`), the `\r` gets included in the next line's data because only `\r` at the END of a line is stripped (`trimmedLine = line.replace(/\r$/, "")`), not `\r` at the START of a line carried over from the previous chunk boundary.

More critically: the `{ stream: true }` option on TextDecoder means multi-byte UTF-8 characters split across chunks are handled — but the SSE line parser itself has no protection against a chunk boundary splitting `"data: [DONE]"` into `"data: [DO"` + `"NE]"`. The first part would be parsed as JSON and fail silently (caught by the empty `catch {}`), and `[DONE]` would be missed entirely.

**How to reproduce:** This is a race condition dependent on TCP chunk boundaries. It's most likely to trigger with:
1. Very fast streaming (many small chunks)
2. Proxy servers that rebuffer/rechunk SSE data
3. Azure-hosted Hermes endpoints (known to produce non-standard SSE delimiters — see OpenClaw issue #32179)

**Severity:** P1 — Can cause incomplete responses (stream ends without `[DONE]`, falls through to the "Stream ended without [DONE]" path which does save, but the user gets no `onDone` callback with the final text if the response happened to be empty at that point).

**Fix:** The SSE line protocol requires `\n\n` to delimit events, not just `\n`. The current parser is more lenient (processes line-by-line), which is actually better for most cases. The real fix is to handle the `[DONE]` sentinel more robustly:

```typescript
// After the while(true) loop, flush any remaining buffer
if (buffer.trim()) {
  const trimmedLine = buffer.replace(/\r$/, "");
  if (trimmedLine.startsWith("data:")) {
    const data = trimmedLine.startsWith("data: ")
      ? trimmedLine.slice(6).trim()
      : trimmedLine.slice(5).trim();
    if (data === "[DONE]") {
      session.messages.push({ role: "assistant", content: fullResponse });
      // ... save usage and session
      await saveSession(session);
      callbacks.onDone(fullResponse);
      return;
    }
    // Try to parse as JSON chunk
    try {
      const chunk = JSON.parse(data);
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        callbacks.onToken(delta);
      }
    } catch { /* skip */ }
  }
}
```

---

### BUG-002: Spurious Paragraph Breaks Injected Between Sentences (False Positive Heuristic)

**File:line:** `src/adapter/hermes/chat-proxy.ts:275-285`  
**What's wrong:** The paragraph break heuristic that detects tool call boundaries ALSO fires on normal sentence-to-sentence transitions. The condition:

```typescript
if (
  fullResponse.length > 0 &&
  /[.!?:]\s*$/.test(fullResponse) &&
  /^[A-Z]/.test(delta)
) {
  separator = "\n\n";
}
```

This means ANY time a streaming chunk happens to start with a capital letter and the previous accumulated text ends with punctuation + optional whitespace, a `\n\n` is injected. Since streaming chunks can break at arbitrary points, this produces random paragraph breaks in the middle of normal text. For example, if the model streams `"...end of sentence. S"` and then `"tart of next"`, the `S` triggers a paragraph break. But even within a single paragraph: `"Check the docs. For example..."` could get a break before `"For"`.

**How to reproduce:**
1. Send any message that produces a multi-sentence response
2. Observe extra blank lines between sentences in the response
3. Compare with the actual model output (no extra breaks)

**Severity:** P1 — Every streamed response is visually corrupted with extra whitespace. The corruption is non-deterministic (depends on chunk boundaries), so the same response looks different each time.

**Fix:** Remove the sentence-boundary heuristic entirely. Keep only the tool-call boundary separator:

```typescript
let separator = "";
if (sawToolCall && fullResponse.length > 0) {
  separator = "\n\n";
  sawToolCall = false;
}
fullResponse += separator + delta;
callbacks.onToken(separator + delta);
```

The model already produces `\n\n` between paragraphs when it intends them. This heuristic is fighting the model's own formatting.

---

### BUG-003: Streaming Markdown Cache Corruption on Rapid Session Switches

**File:line:** `ui/src/ui/markdown-streaming.ts:5-8` (module-level globals)  
**What's wrong:** The streaming cache uses module-level globals (`cachedPrefixText`, `cachedPrefixHtml`) that are shared across ALL sessions. The comment says "only one message streams at a time" but this is false — the ally overlay can stream simultaneously with the main chat, and switching sessions doesn't call `resetStreamingCache()` before the new session's stream starts.

When user switches from Session A (streaming) to Session B (also streaming):
1. Session A's prefix is cached
2. Session B starts streaming — its text does NOT start with Session A's prefix
3. Falls through to "Full cache miss" — this works correctly
4. BUT if user switches back to Session A, the cache now has Session B's prefix
5. Session A's stream tries the "Incremental hit" path, fails the `startsWith` check
6. Falls through to full re-render — performance regression, not data corruption

The actual data corruption scenario: if two ally messages stream in parallel (one in overlay, one in main chat panel), they share the cache. The incremental hit path (`prefixText.startsWith(cachedPrefixText)`) could match if both messages share a common opening (e.g., "I" or "Here"). Then `newBlocksText = prefixText.slice(cachedPrefixText.length)` would extract WRONG text and render it as HTML.

**How to reproduce:**
1. Open the ally overlay on a non-chat tab
2. Send a message to ally AND have a message streaming in a session tab
3. Both streams share the same markdown cache

**Severity:** P1 — Can render garbled HTML from one session inside another session's chat bubble.

**Fix:** Key the cache by session:

```typescript
let cachedSessionKey = "";
let cachedPrefixText = "";
let cachedPrefixHtml = "";

export function toStreamingMarkdownHtml(markdown: string, sessionKey?: string): string {
  const key = sessionKey ?? "";
  if (key !== cachedSessionKey) {
    // Session changed — invalidate cache
    cachedSessionKey = key;
    cachedPrefixText = "";
    cachedPrefixHtml = "";
  }
  // ... rest of function
}
```

Or simpler: use a `Map<string, { prefixText: string; prefixHtml: string }>` keyed by session.

---

### BUG-004: `handleOpenFile` Fails for `.md` Files Without `files.read` Gateway Method

**File:line:** `ui/src/ui/app.ts:1557-1606`  
**What's wrong:** The `handleOpenFile` method calls `files.read` for ALL files, but the gateway's `files.read` method may not be registered for all deployments. The http-handler.ts serves files from `/godmode/artifacts/` (inbox directory only), but `handleOpenFile` doesn't use that HTTP endpoint — it uses the JSON-RPC `files.read` method over WebSocket.

When `files.read` throws (method not found, file not accessible, path outside allowed dirs), the catch block shows a toast "Failed to open file: /path/to/file.md" and the sidebar never opens. There's no fallback to the HTTP artifact endpoint.

Additionally, for `.md` files specifically: the MIME type inference `ext === "md" ? "text/markdown" : null` only triggers when `result.contentType` and `result.mime` are BOTH falsy. If the gateway returns `contentType: "application/octet-stream"` (a common default), the markdown file renders as raw text instead of rendered markdown.

**How to reproduce:**
1. Agent writes a file to `~/godmode/memory/inbox/report.md`
2. Agent's tool card shows "report.md" with an "Open" button
3. Click "Open" → calls `handleOpenFile("~/godmode/memory/inbox/report.md")`
4. If `files.read` RPC doesn't resolve `~/` or the file is outside allowed paths → error toast
5. Even if it works, if gateway returns wrong MIME type → raw text instead of markdown

**Severity:** P1 — The `.md` file viewer bug reported by the user. Files written by agents aren't viewable.

**Fix:** Two changes needed:

1. In `handleOpenFile`, add fallback to HTTP artifact endpoint for inbox files:
```typescript
// After files.read fails, try HTTP artifact endpoint for inbox files
const inboxMatch = resolvedPath.match(/\/inbox\/([^/]+)$/);
if (inboxMatch) {
  try {
    const resp = await fetch(`${this.basePath}/godmode/artifacts/${encodeURIComponent(inboxMatch[1])}`);
    if (resp.ok) {
      const content = await resp.text();
      const mime = resp.headers.get("content-type") || this.inferMimeTypeFromPath(resolvedPath);
      this.handleOpenSidebar(content, { mimeType: mime, filePath: resolvedPath, title });
      return;
    }
  } catch { /* fall through to error */ }
}
```

2. Force MIME type override for `.md` files regardless of gateway response:
```typescript
const ext = resolvedPath.split(".").pop()?.toLowerCase() ?? "";
let mime = result.contentType ?? result.mime ?? null;
// Force markdown MIME for .md files regardless of what gateway reports
if (ext === "md" || ext === "markdown" || ext === "mdx") {
  mime = "text/markdown";
}
```

---

## P2 — Degraded Experience

### BUG-005: Reconnection Can Trigger Duplicate Chat History Load

**File:line:** `ui/src/ui/app-lifecycle.ts:472-488`  
**What's wrong:** When the gateway reconnects (`connected` transitions from `false` to `true`), the lifecycle handler calls `loadChatHistory(host)`. But `connectGateway()` in `app-gateway.ts` also triggers `onReady` which loads sessions and may also load chat history. If both paths execute concurrently, two `chat.history` RPCs fire simultaneously. This is mostly harmless (second one wins), but can cause a visual flash as messages are replaced twice.

More importantly: the reconnect path in `app-lifecycle.ts:472` has NO guard against `chatLoading` being set by the gateway's `onReady` handler. The check `!host.chatLoading` is there, but `onReady` runs asynchronously — `chatLoading` might not be set yet when the lifecycle `updated()` fires.

**How to reproduce:**
1. Disconnect gateway (kill gateway process)
2. Restart gateway
3. UI reconnects → brief flash as chat messages load twice

**Severity:** P2 — Visual flicker on reconnect, no data loss.

**Fix:** Add a reconnect-specific debounce:
```typescript
// In app-lifecycle.ts, use a reconnect guard
if (changed.has("connected") && changed.get("connected") === false && host.connected) {
  // Delay slightly to let onReady fire first
  setTimeout(() => {
    if (host.tab === "chat" && !host.chatLoading) {
      void loadChatHistory(host);
    }
  }, 500);
}
```

---

### BUG-006: `linkifyFilePaths` Regex Can Match Inside URLs

**File:line:** `ui/src/ui/markdown.ts:38-59`  
**What's wrong:** `FILE_PATH_RE` matches paths like `/Users/...` or `~/...`, but it has a negative lookbehind only for `([` characters. It does NOT guard against matching paths that appear inside URLs. Example: a URL like `https://example.com/Users/guide.html` would match `/Users/guide.html` and wrap it in a `file://` link, corrupting the original URL.

The regex also doesn't guard against matching inside `href="..."` attributes of already-rendered HTML. Since `linkifyFilePaths` runs BEFORE `marked.parse()` (on raw markdown), this can corrupt markdown link syntax like `[text](/Users/path)` by double-wrapping it.

**How to reproduce:**
1. Model outputs text containing `https://docs.example.com/Users/setup.md`
2. The regex matches `/Users/setup.md` and wraps it in `file://` link
3. The original URL is corrupted in the rendered output

**Severity:** P2 — Corrupts URLs that happen to contain `/Users/` or similar path prefixes.

**Fix:** Add a negative lookbehind for `://` and for `](`:
```typescript
const FILE_PATH_RE = /(?<![(\[`]|:\/\/)(?:~\/|\/(?:Users|home|tmp|var|opt|etc|godmode)\/)[\w/.+@-]+(?:\.\w+|\/)(?=\s|[),;:!?]|$)/g;
```

Also add a pre-check to skip lines that contain the path inside an existing markdown link or URL:
```typescript
// In the replace callback:
parts[i] = parts[i].replace(FILE_PATH_RE, (match, offset, str) => {
  // Don't linkify if this match is inside a URL (preceded by ://)
  const before = str.slice(Math.max(0, offset - 3), offset);
  if (before.includes("://")) return match;
  // ...rest of linkification
});
```

---

### BUG-007: No AbortController on Hermes API Fetch — Zombie Streams

**File:line:** `src/adapter/hermes/chat-proxy.ts:184-196`  
**What's wrong:** The `fetch()` call to Hermes has no `AbortController` / `signal`. If the user navigates away, closes the session, or the Hermes server hangs, the stream reader loop runs indefinitely. The `reader.read()` call will hang forever waiting for the next chunk.

This means:
1. Memory leak — the closure over `session`, `callbacks`, `fullResponse` etc. stays alive
2. If Hermes is unreachable, the Promise from `sendMessage()` never resolves or rejects
3. Multiple concurrent `sendMessage()` calls can pile up if the user sends messages while a previous one is hung

**How to reproduce:**
1. Send a message
2. Kill the Hermes process mid-stream
3. The UI shows "thinking" spinner forever — no timeout, no error

**Severity:** P2 — UI hangs permanently on Hermes failure. Requires page refresh.

**Fix:** Add an AbortController with a timeout:
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

try {
  const res = await fetch(`${this.hermesUrl}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: "hermes-agent", messages, stream: true }),
    signal: controller.signal,
  });
  // ... existing stream processing
} catch (err) {
  if (err instanceof DOMException && err.name === 'AbortError') {
    callbacks.onError(new Error('Request timed out'));
  } else {
    // ... existing error handling
  }
} finally {
  clearTimeout(timeout);
}
```

---

### BUG-008: Chat Event Race Condition — `final` from Sub-Agent Blocked During Active Stream

**File:line:** `ui/src/ui/controllers/chat.ts:477-488`  
**What's wrong:** When a `final` event arrives from a different `runId` (e.g., a sub-agent announcing its result), the code checks `if (state.chatStream !== null)` and returns `null` (skips the event). The comment says "Don't trigger history reload while the user's current run is actively streaming."

But this means if a sub-agent finishes WHILE the user's stream is active, the sub-agent's result is never shown. The user's own "final" event triggers `loadChatHistoryAfterFinal()` which DOES pick up the sub-agent message — but only if the server has finished processing and the message is persisted. If there's a delay in persistence, the sub-agent message may be missed entirely.

**How to reproduce:**
1. Send a message that triggers a sub-agent (e.g., "run research on X")
2. While the main agent is still streaming its response, the sub-agent finishes
3. The sub-agent's final event is silently dropped
4. After the main stream finishes, `loadChatHistoryAfterFinal` MAY pick it up, or may not

**Severity:** P2 — Sub-agent results can be delayed or missed in the UI.

**Fix:** Instead of dropping the event, queue it:
```typescript
if (payload.runId && state.chatRunId && payload.runId !== state.chatRunId) {
  if (payload.state === "final") {
    if (state.chatStream !== null) {
      // Queue the reload — it will fire when the current stream ends
      state.refreshSessionsAfterChat = true;
      return null;
    }
    return "final";
  }
  return null;
}
```
(The flag `refreshSessionsAfterChat` already exists in the codebase — wire it to trigger a history reload on stream end.)

---

### BUG-009: `extractWorkspacePathCandidatesFromHref` Doesn't Handle `godmode-file://` Protocol

**File:line:** `ui/src/ui/app.ts:1920-1970` (approximately)  
**What's wrong:** `handleOpenMessageFileLink` calls `extractWorkspacePathCandidatesFromHref` which handles `file://` URLs but not `godmode-file://` URLs. However, `file-click.ts` handles `godmode-file://` separately and routes to `onOpenFile` directly. So this isn't a direct bug — BUT there's a gap: if `handleOpenMessageFileLink` is called with a `godmode-file://` URL (from a code path other than `file-click.ts`), it will fall through to URL parsing which will fail.

The `file-click.ts` handler correctly routes both protocols, so the primary click path works. But `onMessageLinkClick` in `app-render.ts` passes the href to `handleOpenMessageFileLink`, which is a DIFFERENT code path.

**How to reproduce:**
1. Agent writes a file with a bare filename (no path) like `analysis-report.md`
2. `linkifyFilePaths` wraps it in `godmode-file://analysis-report.md`
3. User clicks the link
4. If click goes through `onMessageLinkClick` → `handleOpenMessageFileLink` → candidates extraction fails
5. Returns false → link appears non-functional

**Severity:** P2 — Bare filename links in chat may not open in the sidebar viewer.

**Fix:** Add `godmode-file://` handling in `extractWorkspacePathCandidatesFromHref`:
```typescript
if (href.startsWith("godmode-file://")) {
  let filename = href.slice("godmode-file://".length);
  try { filename = decodeURIComponent(filename); } catch {}
  candidates.push(filename);
  return candidates;
}
```

---

## P3 — Cosmetic / Minor

### BUG-010: Streaming Cache Not Reset on New Session Creation

**File:line:** `ui/src/ui/app-render.helpers.ts:58`  
**What's wrong:** `createNewSession()` sets `state.chatStream = null` but doesn't call `resetStreamingCache()`. The stale HTML cache from the previous session's stream is still present. On the next stream in the new session, if the new message happens to share a prefix with the old session's last streamed message, the cache hit path will render stale HTML.

**How to reproduce:** Extremely unlikely to hit in practice since the cache uses exact text matching.

**Severity:** P3 — Theoretical stale render, self-heals on next chunk.

**Fix:** Add `resetStreamingCache()` call alongside `chatStream = null`:
```typescript
import { resetStreamingCache } from "../markdown-streaming";
// In createNewSession:
state.chatStream = null;
resetStreamingCache();
```

---

### BUG-011: `findSafeSplitPoint` Can Split Inside HTML Entities

**File:line:** `ui/src/ui/markdown-streaming.ts:73-115`  
**What's wrong:** The split point finder looks for `\n\n` outside code fences but doesn't check if the split lands inside an HTML entity or a markdown link. For example, if the text is:

```
Some text &amp;\n\nmore text
```

The split is fine here. But if the markdown has an inline link that spans a blank line (rare but valid):

```
[link text
\n\n
](url) more text
```

Splitting here would break the markdown link syntax, causing the prefix and tail to each render incorrectly.

**How to reproduce:** Model outputs a markdown link with a blank line inside the link text (extremely rare).

**Severity:** P3 — Edge case in markdown rendering during streaming.

**Fix:** Not worth fixing given the rarity. Document as a known limitation.

---

### BUG-012: History Serialization Strips Image Content Blocks

**File:line:** `src/adapter/hermes/chat-proxy.ts:157-160`  
**What's wrong:** When saving user messages with images to session history, the code serializes them as:
```typescript
const historyLabel = hasImages
  ? `${userMessage}\n\n[${attachments.length} image(s) attached]`
  : userMessage;
session.messages.push({ role: "user", content: historyLabel });
```

But the ACTUAL message sent to Hermes has `ContentBlock[]` with `image_url` blocks. If the session is resumed later (e.g., page refresh), the history replay sends `"text\n\n[1 image(s) attached]"` as a plain string instead of the original multimodal content blocks. Hermes processes this text literally — it can't see the images anymore.

**How to reproduce:**
1. Send a message with an image attachment
2. Refresh the page (session reloads from JSON file)
3. Continue the conversation — Hermes no longer has the image context
4. Ask "what was in that image?" — Hermes can't answer

**Severity:** P2 (upgraded from P3 because it affects cross-session image context)

**Fix:** Store the original content blocks in session history:
```typescript
// Save the full multimodal message, not just the label
session.messages.push({
  role: "user",
  content: hasImages ? contentBlocks : userMessage,
} as ChatMessage);
```

But this has storage implications (base64 images are large). Better approach: store image references (hashes) and let Hermes resolve them:
```typescript
session.messages.push({
  role: "user",
  content: hasImages
    ? `${userMessage}\n\n[${attachments.length} image(s) attached — refs: ${attachments.map(a => a.fileName || 'image').join(', ')}]`
    : userMessage,
});
```

---

## Research Context

### SSE Streaming Known Issues (from web research)
1. **Azure Foundry SSE delimiter issue (OpenClaw #32179):** Azure-hosted endpoints can concatenate SSE events without proper `\n\n` delimiters. The GodMode chat proxy parser is line-based, which partially mitigates this, but doesn't fully handle the case.
2. **Empty SSE events:** Some providers send empty `data:` events or `retry:` directives. The current parser handles this by skipping non-`data:` lines and catching JSON parse errors, which is correct.
3. **TextDecoder boundary handling:** The `{ stream: true }` option handles multi-byte UTF-8 correctly but doesn't help with SSE protocol-level boundaries.

### Reconnection Race Conditions (from web research + code audit)
1. The exponential backoff reconnection is well-implemented (1s → 2s → 4s → ... → 30s cap, max 10 attempts).
2. The main risk is double-loading on reconnect (BUG-005 above).
3. The `onClose` handler correctly clears `chatStream`, `chatRunId`, and loading states, which prevents most state corruption.

---

## Summary

| ID | Severity | Category | Status |
|----|----------|----------|--------|
| BUG-001 | P1 | SSE Parsing | Documented |
| BUG-002 | P1 | SSE Formatting | **SAFE TO FIX** |
| BUG-003 | P1 | Markdown Cache | Documented |
| BUG-004 | P1 | File Viewer | Documented |
| BUG-005 | P2 | Reconnection | Documented |
| BUG-006 | P2 | URL Linkification | Documented |
| BUG-007 | P2 | Timeout/Abort | Documented |
| BUG-008 | P2 | Event Routing | Documented |
| BUG-009 | P2 | File Link Protocol | Documented |
| BUG-010 | P3 | Cache Reset | Documented |
| BUG-011 | P3 | Markdown Split | Documented |
| BUG-012 | P2 | Image History | Documented |

**P0 bugs found: 0** (no crashes or data loss scenarios)  
**P1 bugs found: 4** (broken features)  
**P2 bugs found: 5** (degraded experience)  
**P3 bugs found: 2** (cosmetic)
