# GodMode 1,300-Line Rewrite Experiment

## Goal
Rewrite the essential core of GodMode as a single OpenClaw plugin in ~1,300 lines of TypeScript ESM. This is an experiment — NOT a replacement for the main codebase. The question: "What is the minimum viable engine for a deeply contextual personal AI ally with agent delegation?"

## Constraints
- Target: ~1,300 lines total across all files (hard cap: 2,000)
- Single entry point: `index.ts`
- Maximum 10 source files
- Zero UI (backend only — use the existing OC chat)
- Must be a valid OpenClaw plugin (register hooks + methods)
- TypeScript ESM, Node 22+
- Only these runtime deps: `better-sqlite3`, `mem0ai` (optional), `openclaw/plugin-sdk`

## What to Build (in priority order)

### 1. Context Injection (~200 lines) — `src/context.ts`
- P0-P3 priority tier system with progressive degradation
- SOUL_ESSENCE: 13 lines (copy from main codebase `src/lib/context-budget.ts` lines 274-288)
- CAPABILITY_MAP: 3-line lookup chain
- Identity anchor loader (read USER.md + SOUL.md from vault)
- Memory search results formatting
- Wrap everything in `<system-context>` tags
- `before_prompt_build` hook: gather context, assemble, return `{ prependContext }`

### 2. Memory (~200 lines) — `src/memory.ts`
- Mem0 init with JSON prefill patch (copy the monkey-patch from `src/lib/memory.ts` lines 555-586)
- `searchMemories(query, userId, limit)` with circuit breaker (3 failures → 1min backoff)
- `ingestMemory(content, userId)` called from `message_sending` hook
- `withTimeout` wrapper (10s default)
- Status tracking: ready/degraded/offline

### 3. Agent Queue (~300 lines) — `src/queue.ts`
- Queue state: JSON file with file locking (`~/godmode/data/queue.json`)
- `queue_add` tool: add item to queue
- `queue_check` tool: list queue status
- Agent spawning: `child_process.spawn` detached CLI process
- Prompt building: 3 sections only — (1) Role + persona, (2) Task specification, (3) Output path + format
- Completion handler: mark done, write output to `~/godmode/memory/inbox/`
- Failure handler: mark failed, log error (no retry — keep it simple)
- Max 3 parallel agents, 30-min timeout
- Poll every 10 minutes

### 4. Safety Gates (~150 lines) — `src/safety.ts`
- Loop breaker: track tool calls per session, detect identical repeated calls (8x = stuck)
- Tool-grounding gate: regex classifier on user message → inject "use X tool before answering"
  - Categories: person-lookup, status-check, factual-claim (3 categories, not 6)
  - Conversation escape hatch (greetings/brainstorming skip enforcement)
- Config shield: block reads of `.env`, `openclaw.json`, SSH keys
- That's it. 3 gates, not 22.

### 5. Tools (~200 lines) — `src/tools.ts`
- `queue_add`: { type, title, description, personaHint? }
- `queue_check`: returns queue status summary
- `tasks_create`: create a task (title, dueDate?, workspace?)
- `tasks_list`: list pending tasks
- `tasks_update`: update task status
- `memory_search`: explicit memory search tool
- `secondBrain_search`: file-walk search of vault

### 6. Plugin Wiring (~100 lines) — `index.ts`
- `register()`: register all methods + tools
- `gateway_start` hook: init memory, start queue processor
- `before_prompt_build` hook: → context.ts
- `message_sending` hook: → memory ingest + loop breaker check
- `before_tool_call` hook: → config shield + grounding gate

### 7. Helpers (~150 lines) — `src/helpers.ts`
- `withFileLock(path, fn)`: advisory file locking for JSON state
- `secureWrite(path, data)`: atomic write (tmp + rename)
- `readJsonSafe(path, fallback)`: JSON.parse with try/catch
- `localDateString()`: YYYY-MM-DD in local timezone
- Vault path resolution (OBSIDIAN_VAULT_PATH or ~/Documents/VAULT)
- Data dir resolution (GODMODE_ROOT or ~/godmode)

## What NOT to Build
- No UI (use OC's built-in chat)
- No identity graph (Mem0 handles entity extraction)
- No interaction ledger (Mem0 handles behavioral signals)
- No awareness snapshot (before_prompt_build gathers live data)
- No self-heal pipeline (if it breaks, restart — this is an experiment)
- No heartbeat/cron
- No onboarding
- No skill cards (the 3 safety gate categories handle routing)
- No diagnostics agent on retry
- No Proof integration
- No trust tracking
- No agent toolkit HTTP server (agents use CLI tools directly)
- No dashboard generation
- No daily brief

## Architecture Rules
- Every async function gets try/catch. On failure: log + return fallback. Never crash.
- Memory is optional. If Mem0 fails to init, the ally works without it.
- Queue is optional. If no items, the processor is idle.
- One memory system (Mem0), not five.
- Three safety gates, not twenty-two.
- Agent prompts are 3 sections, not seventeen.

## File Structure
```
index.ts          (~100 lines)  — plugin wiring
src/context.ts    (~200 lines)  — P0-P3 context assembly
src/memory.ts     (~200 lines)  — Mem0 wrapper + circuit breaker
src/queue.ts      (~300 lines)  — agent spawning + lifecycle
src/safety.ts     (~150 lines)  — 3 gates: loop, grounding, config
src/tools.ts      (~200 lines)  — 7 tool definitions
src/helpers.ts    (~150 lines)  — file lock, secure write, paths
```
Total: ~1,300 lines

## How to Run
```bash
mkdir godmode-minimal && cd godmode-minimal
npm init -y
# Copy this structure, implement each file
# Point OpenClaw plugin config at this directory
# Restart gateway
```

## Success Criteria
- Can chat with the ally and it knows your name, timezone, recent context
- Can say "add to queue: research X" and an agent spawns
- Agent completes and output appears in ~/godmode/memory/inbox/
- Ally doesn't hallucinate facts — grounding gate forces tool usage
- System doesn't crash when memory is down
- Total line count under 2,000
