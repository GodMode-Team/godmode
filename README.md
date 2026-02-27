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

Enable swarm orchestration guardrails (safe defaults):

```bash
openclaw config set plugins.entries.godmode.config.swarm.enabled true
openclaw config set plugins.entries.godmode.config.swarm.hardEnforcement true
openclaw config set plugins.entries.godmode.config.swarm.maxParallelWriters 1
openclaw config set plugins.entries.godmode.config.swarm.maxParallelReaders 4
```

Enable iMessage completion notifications:

```bash
openclaw config set plugins.entries.godmode.config.swarm.notifications.enabled true
openclaw config set plugins.entries.godmode.config.swarm.notifications.channel "imessage"
openclaw config set plugins.entries.godmode.config.swarm.notifications.service "imessage"
openclaw config set plugins.entries.godmode.config.swarm.notifications.onlyWhenDesktopIdle true
openclaw config set plugins.entries.godmode.config.swarm.notifications.desktopIdleSeconds 120
```

Optional fixed recipient (otherwise GodMode infers recipient from the latest iMessage request in that workspace):

```bash
openclaw config set plugins.entries.godmode.config.swarm.notifications.to "+15551234567"
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

## Swarm Orchestration (Natural Language)

GodMode now includes a coding swarm harness that layers on top of existing OpenClaw
session/subagent tooling (no duplicate orchestration runtime).

What it does:

- Queues natural-language coding ideas (`swarm.submitIdea`)
- Claims and advances queued work (`swarm.claimNext`)
- Enforces write guardrails through OpenClaw hooks:
  - `before_tool_call`
  - `subagent_spawning`
  - `subagent_ended`
- Keeps writer concurrency safe per workspace (default: one writer)
- Sends completion notifications to iMessage when configured
- Exposes an agent tool (`swarm_harness`) so Atlas can orchestrate without slash commands

Swarm gateway methods:

- `swarm.submitIdea`
- `swarm.claimNext`
- `swarm.list`
- `swarm.setStatus`
- `swarm.status`

GitHub repo bootstrapping in one step:

- `workspace.provisionTeam` creates a GitHub repo (private by default) and bootstraps the team workspace.

Example:

```bash
openclaw rpc workspace.provisionTeam '{"name":"Client Demo Build","org":"godmode-team","privateRepo":true}'
```

## Quick Test Flow

1. Open GodMode Web UI and ask Atlas a natural-language coding request.
2. Atlas should use `swarm_harness` to queue/claim work before spawning coding runs.
3. Trigger multiple coding requests quickly; guardrails should cap write runs safely.
4. Confirm swarm state:

```bash
openclaw rpc swarm.status '{}'
openclaw rpc swarm.list '{"limit":20}'
```

5. Confirm iMessage notification is delivered when a subagent run ends.
