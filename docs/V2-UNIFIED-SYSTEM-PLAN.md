# GodMode v2 Unified System Tuneup — Claude Code Execution Plan

> **Context:** GodMode runs on two host runtimes: OpenClaw and Hermes. The codebase lives at `~/Projects/godmode-plugin/` with a Hermes adapter worktree at `~/Projects/godmode-hermes-adapter/` (branch `feat/hermes-adapter`). The goal is ONE product, ONE codebase, TWO runtime targets — like a cross-platform app.

## Read These Docs First (in order)

1. `docs/GODMODE-META-ARCHITECTURE.md` — the architectural bible
2. `HARNESS.md` — agent workflow + hot files
3. `TEAM-WORKFLOW.md` — branch discipline
4. `src/adapter/types.ts` — the HostAdapter interface
5. `src/standalone.ts` — current Hermes adapter entry

---

## The UI Sync Problem (Solved)

### Root Cause

The Hermes adapter worktree was on `feat/hermes-adapter`, which diverged from `feat/v2-slim` at commit `9158bff`. Three commits landed on `feat/v2-slim` after the fork:

- `374cb85` fix: restore x_read tool, clean up toolbar UI
- `a5427d1` feat: open-source readiness
- `2eca46c` fix: remove overzealous deploy gate

The Hermes adapter had 7 unique commits (SDK shim, standalone entry, UI rendering fixes, chat streaming, history persistence).

### UI Build Pipeline

```
ui/ (source) → pnpm build:ui → ui/dist/ → pnpm bundle:ui → dist/godmode-ui/
                                                              ↑
                                                    assets/godmode-ui/ (fallback)
```

Both worktrees have their own copy of this pipeline baked into their branch. When UI changes land on `feat/v2-slim`, the Hermes branch doesn't get them until rebased.

### Fix Applied

Rebased `feat/hermes-adapter` onto `feat/v2-slim`. Both worktrees now share the same UI source.

### Future-Proof

The UI should be a single source of truth. Options:
1. **Npm package** — publish `@godmode-team/godmode-ui`, both adapters install it *(cleanest)*
2. **Rebase discipline** — automate `feat/v2-slim` → adapter syncing *(simplest for now)*

---

## Phase 1: Complete the Adapter (Priority)

**Goal:** The Hermes standalone adapter registers ALL methods, hooks, and tools — not just a subset.

1. In `src/standalone.ts`, register ALL method modules from `src/methods/`:
   - Currently registered: tasks, queue, options, goals, resources, second-brain, guardrails, support
   - **Missing:** daily-brief, brief-generator, onboarding, projects, calendar, agent-log, team-comms, team-workspace, dashboards, trust-tracker, awareness, sessions, config, agents, integrations
   - Use the same `registerWorkspaceMethods` pattern but add every module from `src/methods/`
2. Register hooks from `src/hooks/`:
   - `before_prompt_build` — context injection (~150 lines/turn)
   - `message_received` — session capture
   - `before_tool_call` — safety gates
   - The HostAdapter interface has `registerHook()` — use it
3. Register tools from `src/tools/`:
   - `delegate.ts`, `task-tool.ts`, `memory-tool.ts`, etc.
   - The HostAdapter has `registerTool()` — use it
4. Fix the chat proxy port — verify Hermes gateway runs on correct port and update `chat-proxy.ts`
5. Verify: `pnpm build` → `node dist/standalone.js` → UI loads → all methods respond

## Phase 2: v2 Slim Deletions

**Goal:** Strip dead code per the v2 slim audit.

Delete:
- `src/services/consciousness.ts`, `consciousness-heartbeat.ts` — Honcho replaces
- `src/services/x-browser.ts`, `src/lib/x-client.ts` — not needed
- `src/services/proof-server.ts`, `src/lib/proof-bridge.ts`, `src/tools/proof-tool.ts` — not using Proof
- `src/services/code-repair.ts` — host runtime handles this
- Any ClawHub, mission-control, or parallel-session code
- Any Mem0 integration code — Honcho replaces

**Do NOT delete:**
- Safety gates (loopBreaker, promptShield, outputShield, contextPressure)
- Trust tracker
- Queue processor
- Agent roster system
- Skills system
- Awareness snapshot (keep until Honcho fully replaces)

After each deletion: `pnpm build` must succeed.

## Phase 3: Honcho Integration

**Goal:** Wire Honcho as the primary memory/context system for both runtimes.

1. Read `~/.honcho/config.json` for API key and base URL
2. In `before_prompt_build` hook: call Honcho for user context, inject into system prompt
3. In `message_received` hook: send conversation turns to Honcho for learning
4. Replace any remaining Mem0 calls with Honcho equivalents
5. Use `@honcho-ai/sdk` npm package or HTTP calls to the Honcho API
6. Test: after 5+ turns, Honcho should return meaningful context about the user

## Phase 4: Adapter Abstraction Cleanup

**Goal:** Make HostAdapter the clean contract between GodMode and any runtime.

1. Audit `src/adapter/types.ts` — ensure the interface covers:
   - `registerMethod(name, handler)` ✅
   - `registerTool(name, schema, handler)` — verify
   - `registerHook(event, handler)` — verify
   - `broadcast(event, data)` ✅
   - `getCapabilities()` ✅
   - `start() / stop()` ✅
2. Every method module should use the adapter interface, never import from `openclaw/plugin-sdk` directly
3. `sdk-shim.ts` should be the ONLY file that touches SDK differences
4. Test both build targets:
   - `pnpm build` → OpenClaw plugin (dist/index.js)
   - `pnpm build` on adapter branch → Hermes standalone (dist/standalone.js)

## Phase 5: Config Unification

**Goal:** One config system for both runtimes.

1. `~/godmode/data/options.json` is the user's config — both runtimes read it
2. Add runtime detection: `options.runtime = "openclaw" | "hermes"` — set on first boot
3. Runtime-specific settings (ports, auth, API endpoints) live under `options.runtime_config`
4. UI reads from the same options endpoint regardless of runtime

---

## Success Criteria

- [ ] `pnpm build` succeeds on both branches
- [ ] UI is identical on both runtimes
- [ ] All method modules registered on Hermes adapter
- [ ] Hooks fire on Hermes (context injection, safety gates)
- [ ] Honcho provides context after 5+ conversation turns
- [ ] A user installing GodMode can choose OpenClaw or Hermes and get the same experience
- [ ] Zero references to deleted v1 modules remain
