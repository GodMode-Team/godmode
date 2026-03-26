# GodMode — Personal AI Operating System

[![npm version](https://img.shields.io/npm/v/@godmode-team/godmode)](https://www.npmjs.com/package/@godmode-team/godmode)
[![License: FSL-1.1-MIT](https://img.shields.io/badge/License-FSL--1.1--MIT-blue.svg)](./LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/GodMode-Team/godmode)](https://github.com/GodMode-Team/godmode/releases)
[![Node.js 22+](https://img.shields.io/badge/node-22%2B-brightgreen)](https://nodejs.org)

GodMode turns your self-hosted AI into a personal operating system. It runs on top of [OpenClaw](https://github.com/nichochar/openclaw) and gives your AI deep context about you — your schedule, tasks, memory, skills, and preferences — so it actually works *for* you instead of starting from scratch every conversation.

**Open source. Self-hosted. Yours.**

## What You Get

- **Persistent Memory** — Your AI remembers conversations, facts, and preferences across sessions (powered by [Honcho](https://honcho.dev))
- **Daily Operating Rhythm** — Morning briefs with calendar + intelligence, task tracking, evening capture
- **Agent Queue** — Delegate tasks to background agents that run overnight and deliver results to your inbox
- **Second Brain** — Markdown-based knowledge management with semantic search across your Obsidian vault
- **Skill Cards** — Teach your AI new capabilities by dropping markdown files into a folder
- **Persona System** — Customizable agent personas for different task types (research, writing, code, etc.)
- **Safety Gates** — Built-in guardrails that prevent prompt injection, credential leaks, and runaway loops
- **Self-Healing** — Automatic health monitoring and recovery for all subsystems

## Quick Start

### Prerequisites

- **Node.js 22+** (check with `node -v`, use [nvm](https://github.com/nvm-sh/nvm) to install)
- **pnpm** (`npm install -g pnpm`)
- **OpenClaw** `>=2026.2.0` ([install guide](https://github.com/nichochar/openclaw))
- **Anthropic API key** ([get one here](https://console.anthropic.com))

### Option A: One-Line Install (recommended)

```bash
curl -fsSL https://lifeongodmode.com/install.sh | sh
```

This handles everything — Node.js, OpenClaw, GodMode plugin, gateway config, and Tailscale (if present). Safe to re-run.

Windows: `irm https://lifeongodmode.com/install.ps1 | iex`

### Option B: Install as OpenClaw Plugin

```bash
# Install the plugin
openclaw plugins install @godmode-team/godmode

# Enable it
openclaw config set plugins.entries.godmode.enabled true

# Restart the gateway
openclaw gateway restart

# Open GodMode
open http://localhost:18789/godmode
```

### Option C: Clone and Build from Source

```bash
# Clone and build
git clone https://github.com/GodMode-Team/godmode.git
cd godmode
pnpm install
pnpm build

# Configure
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Register as a local plugin in your OpenClaw config
# Add to ~/.openclaw/openclaw.json under plugins.entries:
#   "godmode": { "enabled": true, "path": "/path/to/godmode-plugin" }

# Restart your OpenClaw gateway
openclaw gateway restart

# Open GodMode
open http://localhost:18789/godmode
```

### Option D: Clone and Develop

```bash
git clone https://github.com/GodMode-Team/godmode.git
cd godmode
pnpm install

# Copy and configure environment
cp .env.example .env
# Edit .env — at minimum set ANTHROPIC_API_KEY

# Build and run
pnpm dev

# UI dev server (hot reload)
pnpm dev:ui
```

## Configuration

The only **required** environment variable is `ANTHROPIC_API_KEY`. Everything else degrades gracefully:

| Variable | Required | What it enables |
|----------|----------|-----------------|
| `ANTHROPIC_API_KEY` | **Yes** | Agent spawning, auto-titling, identity extraction |
| `HONCHO_API_KEY` | Recommended | Persistent conversational memory |
| `OBSIDIAN_VAULT_PATH` | No | Second Brain vault sync (fallback: `~/godmode/memory/`) |
| `GOG_CALENDAR_ACCOUNT` | No | Google Calendar in daily brief |
| `XAI_API_KEY` | No | X/Twitter intelligence |
| `COMPOSIO_API_KEY` | No | Third-party tool auth (Gmail, Slack, Notion) |
| `PAPERCLIP_URL` | No | Multi-agent orchestration |

See [.env.example](.env.example) for the full list.

## Verify Installation

```bash
# Check plugin is registered
openclaw plugins list

# Health check
curl -fsS http://127.0.0.1:18789/godmode/health
```

## Customization

GodMode is designed to be personal. Most customization is **files, not code**:

- **Personas** — Markdown files in `~/godmode/memory/agent-roster/`. Define agent personalities, specialties, and trust levels.
- **Skill Cards** — Markdown files in `skill-cards/`. Teach your AI when and how to use specific capabilities.
- **Skills** — Executable markdown in `assets/skills/`. Multi-step workflows your AI can run.
- **Soul** — Your `SOUL.md` file defines your AI's core personality and values.

Drop a file in, restart, and your AI knows something new. No TypeScript required.

## Architecture

```
godmode/
├── index.ts              # OpenClaw plugin entry point
├── standalone.ts         # Standalone Hermes server (alternative to OpenClaw gateway)
├── src/
│   ├── methods/          # RPC handlers (tasks, calendar, brief, queue, etc.)
│   ├── services/         # Background services (queue, self-heal, heartbeat)
│   ├── lib/              # Core libraries (memory, context budget, vault, identity)
│   ├── tools/            # Agent tools (delegate, repair, queue_add, etc.)
│   ├── hooks/            # Lifecycle hooks (startup, prompt injection, message handling)
│   └── adapter/          # Standalone/Hermes adapter layer
├── ui/                   # Frontend (Lit web components, Vite build)
├── skill-cards/          # Domain skill definitions (markdown)
├── assets/
│   ├── agent-roster/     # Default persona files
│   └── skills/           # Executable skill files
└── docs/                 # Architecture docs
```

## Development

```bash
pnpm build          # Full build (UI + TypeScript + bundle)
pnpm build:code     # TypeScript only
pnpm build:ui       # UI only (Vite)
pnpm dev:ui         # UI dev server with hot reload
pnpm typecheck      # Type checking
pnpm test:ui        # UI tests
pnpm clean          # Remove build artifacts
pnpm ui:sync        # Refresh committed UI fallback snapshot
```

After UI changes, always run `pnpm build:ui && pnpm ui:sync` and commit the updated snapshot.

## Contributing

Contributions welcome! GodMode gets better when the community builds for their own needs.

**Good first contributions:**
- New skill cards (just a markdown file!)
- New persona templates
- UI improvements
- Bug fixes
- Documentation

**Before submitting a PR:**
1. Create a feature branch (`git checkout -b feat/my-feature`)
2. Run `pnpm typecheck` (must pass)
3. Run `pnpm build` (must succeed)
4. If UI changed: `pnpm ui:sync` and commit the snapshot

## Community

- [GitHub Issues](https://github.com/GodMode-Team/godmode/issues) — Bug reports and feature requests
- [Community Circle](https://lifeongodmode.com/community) — Weekly office hours, power user tips, creative workflows ($99/mo)
- [Website](https://lifeongodmode.com) — Learn more about the GodMode vision

## Troubleshooting

### Build fails: "Node.js version unsupported" or missing pnpm

```bash
node -v          # Need v22+. Install/upgrade: nvm install 22 && nvm use 22
pnpm -v          # Not found? npm install -g pnpm
```

### "ANTHROPIC_API_KEY is not set"

Get a key at [console.anthropic.com](https://console.anthropic.com), then add it to your `.env`:

```bash
cp .env.example .env
echo 'ANTHROPIC_API_KEY=sk-ant-...' >> .env
```

### Port already in use

Change the port with the `--port` flag or `GODMODE_PORT` env variable:

```bash
GODMODE_PORT=4000 pnpm start
# or
pnpm start -- --port 4000
```

### UI doesn't load (blank page or 404)

The UI must be built before the server can serve it:

```bash
pnpm build:ui    # Build the frontend assets
pnpm start       # Then restart the server
```

### Memory features not working

Persistent memory requires a Honcho API key. Get one at [honcho.dev](https://honcho.dev) and add to `.env`:

```
HONCHO_API_KEY=your-key-here
```

Without it, GodMode still works but conversations won't persist across sessions.

## License

[FSL-1.1-MIT](./LICENSE) — Free to use, modify, and self-host. Cannot be used to build a competing commercial product. Each version converts to MIT after 2 years.

Made with conviction by the [GodMode Team](https://lifeongodmode.com).
