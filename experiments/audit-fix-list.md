# GodMode Audit Fix List (2026-03-15)

## Critical — Fix Before Anyone Else Uses It

- [ ] **Inbox file locking** — `src/services/inbox.ts` does read-modify-write without `withFileLock`. Copy pattern from `src/lib/queue-state.ts`. Silent data loss when agents complete simultaneously.
- [ ] **activeCount drift** — `src/services/queue-processor.ts` lines 400/438/660. Decrement in a `finally` block so errors in completion handler can't permanently inflate the count. At 5 stuck, queue stops forever.
- [ ] **Hardcoded userId "caleb"** — `src/hooks/before-prompt-build.ts:147` and `src/hooks/lifecycle-hooks.ts:398`. Replace with dynamic lookup from identity anchor or config.

## High — Fix This Month

- [ ] **Parallelize before-prompt-build** — Memory search, identity graph, calendar, tasks are awaited sequentially. Use `Promise.all` for the 4 independent fetches. Cuts per-turn latency.
- [ ] **Static imports on hot path** — 30 dynamic `await import()` calls in before-prompt-build.ts. Convert to static imports at top of file.
- [ ] **Guardrails state write not atomic** — `src/services/guardrails.ts:402-407`. No tmp+rename, no file lock. Concurrent gate firings can corrupt guardrails.json.
- [ ] **Session Maps never pruned** — `src/hooks/safety-gates.ts:40-42`. callHistory, warnedTools, injectionFlags Maps grow unbounded. Add cleanup on session end or periodic prune.
- [ ] **Grounding gate hardcoded names** — `src/hooks/tool-grounding-gate.ts:79-82`. KNOWN_NAMES should come from identity graph, not a const array.

## Medium — Address When Refactoring

- [ ] **Split queue-processor.ts** (1,711 lines) into scheduler, executor, lifecycle manager
- [ ] **Split safety-gates.ts** (2,137 lines) into individual gate files under `src/hooks/safety/`
- [ ] **206 empty catch blocks** — Add at minimum debug-level logging to catch blocks. Silent swallowing makes debugging impossible.
- [ ] **Config shield path traversal** — `normalizeForPathCheck()` doesn't handle relative traversal (`../../../.openclaw/`), URL encoding, or symlinks.
- [ ] **Inbox write not atomic** — `src/services/inbox.ts:95`. Uses `writeFile` not tmp+rename. Crash during write = lost inbox.
- [ ] **repairLogBuffer unbounded** — `src/lib/health-ledger.ts:283`. Plain array with no cap. Add MAX_ENTRIES.
- [ ] **TIME_WORDS/OPS_WORDS substring matching** — `src/lib/context-budget.ts:345-364`. "call" matches "locally". Use word boundary regex.
- [ ] **Self-heal writes to Claude Code credentials** — `src/services/self-heal.ts:344-395`. Modifying `~/.claude/.credentials.json` is risky.
- [ ] **Duplicate user message extraction** — `src/hooks/before-prompt-build.ts` has 3 copies of the same "find last user message" logic. Extract to helper.
- [ ] **51 `any` types in hook params** — `index.ts:414-452`. Define shared types for OpenClaw hook parameters.

## Low — Nice to Have

- [ ] **Add test script to package.json** + basic tests for context-budget assembleContext
- [ ] **Move lit/dompurify to devDependencies** in package.json
- [ ] **Output shield JWT false positive** — `safety-gates.ts:454` blocks legitimate JWT explanations
- [ ] **pendingAutoTitles never actively pruned** — `src/lib/auto-title.ts:10-12`
- [ ] **Agent toolkit rate buckets never pruned** — `src/services/agent-toolkit-server.ts:84`
- [ ] **Diagnostic retry description grows unbounded** — `queue-processor.ts:812-823`

## Architectural Considerations (Not Bugs, Design Questions)

- 5 memory systems (Mem0, Vault, Awareness, Interaction Ledger, Identity Graph) — could be 2
- 22 guardrail gates — could be 5 principles
- Agent CLI spawning limits steering/streaming — API-based execution would enable live steering
- Agent prompt is 14+ sections — could be 3 (role, task, output)
- No agent OS-level sandboxing — prompt-level guardrails only
