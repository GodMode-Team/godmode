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

- `agent-log` and `workspaces` handlers are plugin-local.
- `workspaces-config` and `workspace-sync-service` are plugin-local copies.
- `server-startup` in OpenClaw core should not initialize GodMode services directly.
- Plugin `gateway_start` initializes optional agent-log writer integration.

### Lean Architecture (post v1.2 audit)
- **Context injection:** ~150 lines/turn via `before_prompt_build` (down from ~1,500).
- **Memory:** 2 systems — Obsidian Vault (long-term) + Awareness Snapshot (ephemeral, 15-min refresh).
- **Safety gates:** 4 active — loopBreaker, promptShield, outputShield, contextPressure.
- **Vault-capture:** 2 pipelines — Sessions→Daily, Queue Outputs→Inbox.
- **Awareness snapshot:** `src/lib/awareness-snapshot.ts` — ~50-line ephemeral state injected every turn. Replaces CONSCIOUSNESS.md + WORKING.md dumps.
- **Killed modules:** coding orchestrator, swarm pipeline, session coordinator, focus pulse, lifetracks, life dashboards, clawhub, subagent-runs, security-audit, rescuetime, org-sweep, session-archiver, cron-guard. All preserved at `git tag v1.1.0-pre-lean-audit`.

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

## Branch Discipline

- **NEVER work directly on `main`** — always create or switch to a feature branch.
- **One branch per task** (e.g., `feat/my-feature`, `fix/bug-name`).
- **NEVER use `git stash`** — commit to your branch instead, even as WIP commits.
- If you detect you're on `main`, create a branch immediately: `git checkout -b feat/<task-slug>`.

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
