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

## UI Source of Truth

- UI source lives in `~/Projects/godmode-ui` (not in this repo's `assets/` or `dist/`).
- Never hand-edit `assets/godmode-ui/*` or `dist/godmode-ui/*`.
- Local dev/build flow:
  1. `cd ~/Projects/godmode-ui && pnpm build`
  2. `cd ~/Projects/godmode-plugin && pnpm build`
- `scripts/bundle-ui.mjs` now fails if a sibling `../godmode-ui` repo exists but is not built.
- Use `GODMODE_UI_ALLOW_FALLBACK=1` only when you intentionally need fallback snapshot assets.
- Before release, refresh fallback snapshot with `pnpm ui:sync` and commit if it changed.

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
