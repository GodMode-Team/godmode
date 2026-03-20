# GodMode — Personal AI Operating System

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

### Option A: Install as OpenClaw Plugin

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

### Option B: Run Standalone (no OpenClaw required)

```bash
# Clone and build
git clone https://github.com/GodMode-Team/godmode-plugin.git
cd godmode-plugin
pnpm install
pnpm build

# Configure
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run
pnpm start

# Open GodMode
open http://localhost:3333/godmode
```

### Option C: Clone and Develop

```bash
git clone https://github.com/GodMode-Team/godmode-plugin.git
cd godmode-plugin
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
# Plugin mode
openclaw plugins list
curl -fsS http://127.0.0.1:18789/godmode/health

# Standalone mode
curl -fsS http://127.0.0.1:3333/godmode/health
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
godmode-plugin/
├── index.ts              # OpenClaw plugin entry point
├── standalone.ts         # Standalone server (no OpenClaw needed)
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

- [GitHub Issues](https://github.com/GodMode-Team/godmode-plugin/issues) — Bug reports and feature requests
- [Community Circle](https://lifeongodmode.com/community) — Weekly office hours, power user tips, creative workflows ($99/mo)
- [Website](https://lifeongodmode.com) — Learn more about the GodMode vision

## License

[AGPL-3.0](./LICENSE) — Free to use, modify, and distribute. If you run a modified version as a service, you must open source your changes.

Made with conviction by the [GodMode Team](https://lifeongodmode.com).
