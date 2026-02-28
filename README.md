# GodMode Plugin for OpenClaw

GodMode is a commercial OpenClaw plugin that adds:

- Personal operating dashboard at `/godmode`
- Goal/project/task/people data handlers
- My Day (`agentLog.*`) and workspace tooling
- Optional Lifetracks generation endpoints

## Requirements

- Node 22+
- OpenClaw `>=2026.0.0`

## Install

From npm:

```bash
openclaw plugins install @godmode-team/godmode
```

From a local clone:

```bash
pnpm install
pnpm build
openclaw plugins install --link /absolute/path/to/godmode-plugin
```

## Configure

Set required license key:

```bash
openclaw config set plugins.entries.godmode.config.licenseKey "GM-..."
openclaw config set plugins.entries.godmode.enabled true
```

Optional workspace root:

```bash
openclaw config set plugins.entries.godmode.config.workspaceRoot "~/godmode"
```

Enable coding orchestration:

```bash
openclaw config set plugins.entries.godmode.config.coding.enabled true
openclaw config set plugins.entries.godmode.config.coding.maxParallelWriters 1
```

Restart gateway after config changes:

```bash
openclaw gateway restart
```

## Verify

```bash
openclaw plugins list
curl -fsS http://127.0.0.1:18789/godmode/health
```

Then open `http://127.0.0.1:18789/godmode`.

## Build

```bash
pnpm build
```

Build outputs:

- `dist/index.js` (plugin runtime entry)
- `dist/godmode-ui/*` (UI assets)

`pnpm build` bundles UI from the first available source:

1. `--ui-dir <path>` passed to `scripts/bundle-ui.mjs`
2. `GODMODE_UI_DIR=<path>`
3. `ui/dist` (in-repo Vite build output)
4. `assets/godmode-ui` (committed fallback snapshot)

Build the UI:

```bash
pnpm build:ui
pnpm build
```

To refresh fallback assets (recommended before release):

```bash
pnpm ui:sync
```

## Optional Features

Lifetracks endpoints require a generation module. Set:

```bash
export GODMODE_LIFETRACK_MODULE=/absolute/path/to/lifetrack/index.js
```

Agent log writer startup integration is optional and auto-detected when the
host runtime exposes the expected module.

## Consciousness Sync (Gold Icon)

The gold heart-brain icon in chat is a manual consciousness sync trigger.
Legacy pre-plugin consciousness flows are retired; this heartbeat + manual flush path is the canonical system.

- UI action: click icon (or press `Cmd/Ctrl+Shift+H`)
- RPC method: `godmode.consciousness.flush`
- Backend action: runs `~/godmode/scripts/consciousness-sync.sh`
- Result: regenerates `~/godmode/memory/CONSCIOUSNESS.md` and returns status to UI

The plugin also exposes read-only fetch:

- RPC method: `godmode.consciousness.read`
- Result: returns current `CONSCIOUSNESS.md` content and timestamp

By default in the GodMode runtime, `CONSCIOUSNESS.md` is refreshed by a
separate heartbeat cron (typically hourly), while the gold icon forces an
immediate sync on demand.

## Coding Orchestration

The `coding_task` agent tool is the single entry point for all code work. It:

1. Creates an isolated git worktree and branch per task
2. Spawns a Claude Code agent directly in the worktree
3. Runs validation gates (lint, typecheck, test) on completion
4. Creates a PR and optionally auto-merges
5. Sends iMessage completion notifications

Agents must use `coding_task` — running `claude -p` via `exec` is blocked by the spawn gate.

Check coding task status:

```bash
openclaw rpc coding.status '{}'
openclaw rpc coding.list '{}'
```
