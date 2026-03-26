# Changelog

All notable changes to the GodMode plugin are documented here.

---

## [1.8.1] — 2026-03-24

### Added
- **Brain tab** — new three-panel identity dashboard (identity card, engine section, memory stats).
- **Workspace rebuild** — workspace connections, feed, secrets manager, and query tool for multi-workspace collaboration.
- **Second Brain ingestion pipelines** — Screenpipe funnel (hourly/daily/retention), calendar enrichment, email digest, Fathom calls, ClickUp sync, Google Drive sync. All wired as interval services on gateway start.
- **Comms tier classifier** — tiered permission system (free/draft/approval) for outbound actions. Front API forced to draft mode; Slack and Twitter require explicit approval.
- **Unified onboarding** — 5-step Setup Bar replaces old 8-phase wizard. Setup progress tracked per-step with test-and-configure RPCs.
- **Deploy guard + project registry** — prevent duplicate deploy targets across workspaces.
- **Resource strip + artifact sidebar** — restored from archived branch. Renamed "Artifacts" to "Resources".
- **MCP entry tools** — memory-get, memory-search-shim, and capture-thought exposed via MCP.
- **Ingestion HTTP endpoints** — `/godmode/ingestion/status` (GET) and `/godmode/ingestion/run` (POST) with webhook signature verification.

### Changed
- **Approval gate v3** — disk-based state (survives restarts), fires via `before_prompt_build` (works for all channels including webchat), requires explicit "I approve" phrase. Fixes v1/v2 failures where `message_received` never fired for webchat.
- **Safety gates** — added `consumeApprovalNudge` to `before_prompt_build` pipeline.
- **Onboarding context** — new setup flow takes priority; falls back to legacy phase prompts for in-progress users.

### Fixed
- **Chat frozen indicator** — `chatStream` no longer cleared on WebSocket disconnect, preventing the typing indicator from vanishing during brief reconnects.
- **File open in sidebar** — `resolveFilePath` now checks CWD for relative paths; `readFile` properly expands `~` prefix; `resolveFile` RPC includes CWD in search dirs. Fixes "Open" button on tool-written files, resource strip clicks, and in-chat `~/` links.
- **Approval gate rapid-retry** — don't overwrite block timestamp on rapid retries, preventing the 2-second debounce from resetting.
- **Workspace list error handling** — preserve workspaces on reconnect failures.
- **Zombie process cleanup** — kill orphaned `openclaw-update` processes from polling.
- **WebSocket reconnect** — re-adopt `runId` so tool indicators survive reconnection.

---

## [1.7.0] — 2026-03-16

### Architecture: Native Agent Execution
- **Replaced Paperclip sidecar with native delegation.** Deleted `paperclip-adapter.ts` (587 lines) and `swarm-tool.ts` (194 lines). New `delegate-tool.ts` (426 lines) uses a decision tree for natural delegation — no trigger words needed.
- **Evidence gates** (`src/lib/evidence.ts`) — agent output quality enforcement before delivery.
- **Project state tracking** (`src/lib/projects-state.ts`) — native multi-item project tracking replaces Paperclip's project/issue system.
- **Tool grounding gate** (`src/hooks/tool-grounding-gate.ts`) — deterministic per-turn enforcement requiring tool-backed verification before the ally responds. Prevents hallucinated answers to factual questions.

### Customer-Ready Cleanup (13 items fixed)
- **Removed all hardcoded owner userId** from 5 Mem0 call sites → dynamic `getOwnerUserId()`.
- **Removed hardcoded owner name** from identity-graph.ts and session-distiller.ts LLM prompts → dynamic `getOwnerName()`.
- **Removed hardcoded KNOWN_NAMES** personal contacts array in tool-grounding-gate.ts → populated from identity graph at runtime.
- **Removed hardcoded owner reflection regex** in brief-generator.ts → generic `\w+ Reflection` pattern.
- **Removed hardcoded default ally name** from queue-steer.ts, proof-tool.ts, inbox.ts, queue-processor.ts → `getAllyName()`.
- **Rewrote content-writer.md** persona — was entirely owner-specific, now user-generic with voice reference lookups.
- **Removed personal workspace templates** (internal customer/project examples) from shipped assets.
- **Cleaned up godmode-dev.json** — removed hardcoded `~/Projects/godmode-plugin` path.
- **Made GitHub repo configurable** for auto-issue filing via `GODMODE_GITHUB_REPO` env var.
- **Cleaned up user-facing examples** — replaced internal customer/project references in tasks-tool and auto-title prompts.

### New Utilities
- `getOwnerName()` in `ally-identity.ts` — reads from onboarding.json, cached 30min, falls back to "friend".
- `getOwnerUserId()` — stable Mem0 userId derived from owner name, falls back to "user".

### Bug Fixes (13 fixes)
- **Chat messages disappearing** — fixed noise filter, empty message groups, streaming key stability, and message key deduplication.
- **Auto-title pipeline restored** — moved from `llm_output` to `before_prompt_build` (fire-and-forget). Fixed agent context key mismatch causing wrong messages to be titled.
- **Memory search querying system-context blob** instead of actual user message — now correctly extracts user content.
- **Memory query truncation** — truncate to 300 chars for brain dumps to avoid embedding API failures.
- **Capability map injection** made mandatory — was silently skipping, causing ally to not know about available tools.
- **Scheduled queue items** — queue items can now have `scheduledFor` timestamps, processed only when due.
- **Anti-empty-promise rule** — prevents ally from promising to "take care of" tasks without actually delegating.
- **Message compaction stall** — fixed QMD crash isolation so one bad message doesn't block the pipeline.

### Context Injection Overhaul
- P1 operational context switched from pre-injected facts to **tool hints** — forces the model to call tools (calendar, tasks, queue) instead of parroting stale data.
- Context is leaner and more accurate as a result.

### UI Changes
- New inbox card design with score widgets and dismiss actions.
- Mission Control polish — cleaner status display.
- Proof viewer improvements — better rendering and controls.
- "Review with the ally" → "Review in Chat" (generic).

---

## [1.6.1] — 2026-03-14

- Restart protection: duplicate plugin guard, config shield, restart sentinel.
- Delegation chain wiring: 6 critical fixes for end-to-end agent flow.

## [1.6.0] — 2026-03-12

- Lean architecture audit: 15 services (down from 27).
- Gemini embedding upgrade to `gemini-embedding-2-preview` 1536d.
- Self-heal control loop (OBSERVE → DIAGNOSE → REPAIR → VERIFY).
- Brain dump pipeline with action item extraction.
