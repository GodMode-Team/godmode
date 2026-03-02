# GodMode Plugin - Agent Context

This repository is the standalone home for the GodMode OpenClaw plugin.

## Mission

- Keep GodMode fully self-contained.
- Do not depend on OpenClaw monorepo source paths (no `../../../../src/*` imports).
- Preserve compatibility with host OpenClaw runtime via `openclaw/plugin-sdk`.

## Runtime Model

- Host: OpenClaw gateway loads this plugin through plugin entry config.
- Entry point: `index.ts`.
- RPC handlers: `src/methods/*.ts`.
- Shared helpers: `src/lib/*.ts`.
- Services: `src/services/*.ts`.
- Data root: `~/godmode` by default, overridable with `GODMODE_ROOT`.

## Key Data Paths

- `~/godmode/data/*` for plugin-owned JSON state.
- `~/godmode/memory/*` for markdown and memory artifacts.
- OpenClaw state for host session data: `~/.openclaw` (or `OPENCLAW_STATE_DIR`).

## Current Architecture Notes

- `agent-log`, `lifetracks`, `subagent-runs`, and `workspaces` handlers are plugin-local.
- `workspaces-config` and `workspace-sync-service` are plugin-local copies.
- `core-proxy` is removed.
- `server-startup` in OpenClaw core should not initialize GodMode services directly.
- Plugin `gateway_start` initializes optional agent-log writer integration.

## Build and Dev

- Install: `pnpm install`
- Build: `pnpm build`
- Sync fallback UI snapshot: `pnpm ui:sync`
- Typecheck: `pnpm typecheck`
- Clean: `pnpm clean`

## UI Source

- UI source lives in `ui/` (Lit web components, Vite build).
- `pnpm build:ui` builds to `ui/dist/`; `pnpm bundle:ui` copies into `dist/godmode-ui/`.
- `pnpm dev:ui` starts Vite dev server for UI development.
- Never hand-edit `assets/godmode-ui/*` or `dist/godmode-ui/*`.
- `assets/godmode-ui/` is a committed fallback snapshot for npm installs that skip the build.
- Refresh fallback: `pnpm ui:sync` and commit if changed.

## Coding Guardrails

- TypeScript ESM only.
- Keep handlers deterministic and filesystem-safe.
- Validate and normalize all user-controlled paths.
- Do not read/write outside allowed roots.
- Prefer explicit error objects: `{ code, message }`.
- Avoid prototype mutation and `any` unless unavoidable.

## Dependency Policy

- Runtime host dependency is `openclaw/plugin-sdk`.
- Keep plugin runtime dependencies minimal.
- Do not pin to OpenClaw monorepo-relative imports.

## Release Notes

- Package name: `@godmode-team/godmode`.
- Keep `openclaw.plugin.json` version metadata aligned with package release strategy.
- Validate standalone build before publishing.

## Session Coordination (Multi-Session Discipline)

When multiple Claude Code sessions work on this repo simultaneously, follow these rules:

### Branch Discipline
- **NEVER work directly on `main`** — always create or switch to a feature branch.
- **One branch per task** — each session should have its own branch (e.g., `feat/my-feature`, `fix/bug-name`).
- **NEVER use `git stash`** — stashes are invisible to other sessions and cause lost work. Commit to your branch instead, even as WIP commits.
- If you detect you're on `main`, create a branch immediately: `git checkout -b feat/<task-slug>`.

### Gateway Restart Safety
- Before running `openclaw gateway restart`, check if another session is active:
  - Run: `./scripts/session-guard.sh status`
  - Or call RPC: `session.checkConflict` with `operation: "gateway-restart"`
- Only one session should restart the gateway at a time. The session coordinator enforces a lock.

### File Conflict Awareness
- Before making significant edits to a file, check if another session is modifying it.
- If you find conflicts, prefer working on different files or coordinate via branch isolation.
- Key conflict-prone files: `index.ts`, `src/services/queue-processor.ts`, `ui/src/ui/app-gateway.ts`.

### Session Lifecycle
- On start: the session coordinator tracks your branch, PID, and working directory.
- During work: file modifications are tracked automatically via gateway RPCs.
- On end: generate a handoff summary so the next session knows what happened.

### Handoff Protocol
- When finishing work, create a structured commit (not a stash).
- Recent handoff summaries are stored in `~/godmode/data/session-handoffs/`.
- The next session can read these to understand context.

## AI Session Checklist

Before shipping changes:

1. Search for forbidden imports:
   - `rg "\.\./\.\./\.\./\.\./src/" -n`
2. Build plugin:
   - `pnpm build`
3. If UI changed, refresh snapshot fallback:
   - `pnpm ui:sync`
4. Confirm handlers still export expected RPC methods.
5. Confirm no host-core-only assumptions were introduced.
6. If on `main`, move your changes to a feature branch before committing.
