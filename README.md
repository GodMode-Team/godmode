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
3. `../godmode-ui/dist` (sibling source-of-truth repo)
4. `godmode-ui/dist` in this repo
5. `assets/godmode-ui` fallback snapshot
6. `../../dist/control-ui` (legacy monorepo output)

When a sibling `../godmode-ui` repo exists, fallback snapshots are blocked by default.
Build the UI first:

```bash
cd ~/Projects/godmode-ui && pnpm build
cd ~/Projects/godmode-plugin && pnpm build
```

If you intentionally want to use fallback assets, set:

```bash
GODMODE_UI_ALLOW_FALLBACK=1 pnpm build
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
