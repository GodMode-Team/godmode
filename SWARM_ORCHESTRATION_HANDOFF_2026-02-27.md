# GodMode Swarm Orchestration Handoff (2026-02-27)

This document captures the exact current state of swarm orchestration in the `godmode-plugin` repo so a new Claude Code session can continue without re-discovery.

## TL;DR

- Swarm orchestration is partially implemented in the plugin and compiles.
- Core pieces are in place: queue/claim/status methods, swarm tool, prompt policy injection, writer-slot guardrails, iMessage completion notifications, and GitHub repo provisioning (`workspace.provisionTeam`).
- It is **not** yet the full Elvis-style "self-healing PR factory" (no built-in worktree creation, no CI/reviewer auto-loop, no deterministic checkpoint/rollback engine, no automatic decomposition planner).
- External VS Code Claude/Codex wrapper routing was intentionally abandoned/removed; current swarm behavior is plugin-side orchestration inside OpenClaw/GodMode only.

## Source of Truth Repo

- Active implementation repo: `/Users/calebhodges/Projects/godmode-plugin`
- OpenClaw fork (`/Users/calebhodges/Projects/GodMode`) contains older/parallel experiments and should not be treated as GodMode plugin source.

## Branch + Working Tree Snapshot

From `/Users/calebhodges/Projects/godmode-plugin`:

- Branch: `main` (ahead of `origin/main` by 1)
- Dirty tree with swarm and related uncommitted changes:
  - `index.ts`
  - `openclaw.plugin.json`
  - `README.md`
  - `src/lib/swarm-state.ts`
  - `src/services/swarm-service.ts`
  - `src/methods/swarm.ts`
  - `src/tools/swarm-harness.ts`
  - `src/hooks/swarm-prompt.ts`
  - `src/methods/team-workspace.ts`
  - additional non-swarm UI/team files also modified

## What Is Implemented (Code-Level)

### 1) Swarm service and persistent state

- File: `src/services/swarm-service.ts`
  - Queue and claim workflow:
    - `submitIdea(...)`
    - `claimNextIdea(...)`
    - `updateIdeaStatus(...)`
    - `listIdeas(...)`
    - `statusSummary(...)`
  - Guardrail hooks:
    - `handleBeforeToolCall(...)`
    - `handleSubagentSpawning(...)`
    - `handleSubagentEnded(...)`
  - Writer lease lifecycle:
    - lease registration/release + TTL pruning
  - iMessage completion notifications:
    - idle-aware on macOS using `ioreg` HID idle time
    - supports explicit `notifications.to` or inferred target from recent workspace request sender
  - Prompt policy generator:
    - `buildPromptPolicy()`

- File: `src/lib/swarm-state.ts`
  - File-backed state:
    - `~/godmode/data/swarm-state.json`
  - Schema:
    - `ideas[]`
    - `writerLeases[]`
    - `runs[]`
  - Uses `withFileLock(...)` for safe concurrent updates.
  - Includes intent classifier (`read` vs `write`) used by guardrails.

### 2) Gateway methods

- File: `src/methods/swarm.ts`
  - Exposes:
    - `swarm.submitIdea`
    - `swarm.claimNext`
    - `swarm.list`
    - `swarm.setStatus`
    - `swarm.status`

### 3) Agent tool for natural-language orchestration

- File: `src/tools/swarm-harness.ts`
  - Tool name: `swarm_harness`
  - Actions:
    - `queue_idea`
    - `claim_next`
    - `complete_idea`
    - `cancel_idea`
    - `set_status`
    - `list_queue`
    - `status`

### 4) Prompt + lifecycle hook wiring

- File: `index.ts`
  - Registers swarm handlers into gateway method map.
  - Hooks:
    - `before_prompt_build` -> inject swarm prompt policy
    - `before_tool_call` -> pre-spawn guardrail gate
    - `subagent_spawning` -> spawn-time writer slot enforcement
    - `subagent_ended` -> release writer lease + notify
  - Registers `swarm_harness` tool.

- File: `src/hooks/swarm-prompt.ts`
  - Injects `buildPromptPolicy()` output into prompt context.

### 5) GitHub repo provisioning for non-technical flow

- File: `src/methods/team-workspace.ts`
  - `workspace.provisionTeam`:
    - creates GitHub repo via `gh repo create` (private by default)
    - bootstraps team workspace in one call
  - Clone hardening:
    - if branch is missing on empty repo, retries clone without `--branch`.

### 6) Config schema for swarm

- File: `openclaw.plugin.json`
  - `swarm.enabled`
  - `swarm.hardEnforcement`
  - `swarm.maxParallelWriters`
  - `swarm.maxParallelReaders`
  - `swarm.leaseTtlMinutes`
  - `swarm.notifications.*`

## Runtime/Environment Verification (Today)

### Plugin load

`openclaw plugins list --enabled` shows:

- GodMode plugin loaded from:
  - `~/Projects/godmode-plugin/dist/index.js`
- iMessage plugin loaded
- GodMode logs indicate methods registered and UI/deck served.

### Swarm config (active profile)

`openclaw config get plugins.entries.godmode.config.swarm`:

```json
{
  "enabled": true,
  "hardEnforcement": true,
  "maxParallelWriters": 1,
  "maxParallelReaders": 4,
  "leaseTtlMinutes": 90,
  "notifications": {
    "enabled": true,
    "channel": "imessage",
    "service": "imessage",
    "onlyWhenDesktopIdle": true,
    "desktopIdleSeconds": 120
  }
}
```

### Swarm state file currently exists

- Path: `~/godmode/data/swarm-state.json`
- Contains demo entries from prior smoke tests (workspace `demo-smoke`).

### Build status

From `/Users/calebhodges/Projects/godmode-plugin`:

- `pnpm build` succeeds (code + UI bundle).

## Known Blockers / Mismatches

1) Gateway RPC CLI mismatch in docs

- README still shows `openclaw rpc ...`, but this CLI build uses:
  - `openclaw gateway call <method> --params '{...}' --json`

2) Local gateway auth/signature issue for direct RPC testing

- `openclaw gateway call ...` currently fails with:
  - `device signature invalid`
- This blocks direct method-level CLI verification until gateway auth/session is repaired.

3) No dedicated swarm tests yet

- No plugin `*.test.ts` files were found in current repo snapshot.
- Swarm currently depends on manual/smoke validation.

## What Is NOT Implemented Yet (Critical Gap List)

To match the full "bulletproof non-technical swarm flywheel" target, these are still missing:

- Deterministic per-task worktree creation and lifecycle management.
- Hard file-scope leases (path-level write locks) across concurrent runs.
- Automatic conflict prediction (import graph/overlap risk scoring).
- Orchestrator-driven checkpoint tags/patch bundles + one-command rollback.
- Built-in CI/reviewer flywheel loop (Codex/Claude/Gemini PR review automation and retry policy).
- Automatic task decomposition from one large natural-language request into small independently validated subtasks.
- Unified ingestion of external VS Code Claude/Codex sessions (currently not routed through plugin harness).
- Robust operator-facing queue UI lane model (`Now/Next/Later`) tied to hard execution policy.

## Recommended Continuation Plan (for next Claude Code session)

1) Stabilize runtime connectivity first.
- Fix `device signature invalid` so `openclaw gateway call` works.
- Update README command examples from `openclaw rpc` to `openclaw gateway call`.

2) Add deterministic automated tests before expanding features.
- Unit tests for:
  - intent classification
  - writer slot gating
  - lease TTL pruning
  - notification target inference
  - idle suppression behavior

3) Implement worktree orchestration as first major hard-enforcement feature.
- Add service module that:
  - allocates unique worktree + branch per write run
  - records mapping in swarm state
  - blocks spawn if no safe allocation possible

4) Add validation gate contract.
- Require each write run to produce machine-readable gate results:
  - lint
  - types
  - targeted tests
  - change summary
- Only mark idea done when gates pass.

5) Add orchestrator merge/integration role.
- Single integration lane for merge/rebase.
- Worker lanes cannot directly merge to shared target.

6) Add migration-safe docs.
- Document what is OpenClaw-native vs plugin-owned so upgrades don’t duplicate core behavior.

## Ready-to-Paste Prompt for a New Claude Code Session

```text
Continue work in /Users/calebhodges/Projects/godmode-plugin.

Read SWARM_ORCHESTRATION_HANDOFF_2026-02-27.md first, then verify all claims in code.

Mission:
1) Keep existing plugin-side swarm architecture.
2) Do not reintroduce shell wrappers for VS Code Claude/Codex.
3) Fix runtime/testability gaps first:
   - resolve gateway call verification path (device signature invalid blocker),
   - update README from `openclaw rpc` to `openclaw gateway call`,
   - add initial swarm unit tests.
4) Then implement next hard-enforcement milestone:
   deterministic per-write-run worktree/branch allocation managed by swarm service state, with safe release on run end.

Constraints:
- Build only in godmode-plugin repo.
- Reuse OpenClaw primitives; don’t reinvent orchestration that already exists in core.
- Preserve non-technical UX intent: natural language in, safe queued orchestration out.
- Keep private-by-default GitHub provisioning.

Deliverables:
- code changes
- tests
- updated docs
- short validation transcript with exact commands run
```

## Practical Answer: "Where is swarm orchestration at right now?"

It is in a **working MVP state inside the plugin**: queue/claim/guardrail/notify hooks exist and build, and GitHub provisioning is wired. It is **not yet** the full autonomous flywheel with worktree-level hard isolation + self-healing CI/reviewer loops.
