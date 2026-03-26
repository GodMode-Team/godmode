# ⚡ GodMode

### Personal AI OS for Entrepreneurs — The Ultimate OpenClaw Setup

[![npm version](https://img.shields.io/npm/v/@godmode-team/godmode)](https://www.npmjs.com/package/@godmode-team/godmode)
[![License: FSL-1.1-MIT](https://img.shields.io/badge/License-FSL--1.1--MIT-blue.svg)](./LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/GodMode-Team/godmode)](https://github.com/GodMode-Team/godmode/releases)
[![Node.js 22+](https://img.shields.io/badge/node-22%2B-brightgreen)](https://nodejs.org)

Experience frictionless flow states in your daily workspace — your AI Ally wielding 5-layer memory, commanding your agent army across every tool in your stack. Self-evolving. Sovereign. Modular.

**We distilled the best open source has to offer.**

---

We obsessively studied every memory framework, every agent architecture, every open source AI tool worth knowing. We read the papers. We tested the repos. We broke things in production so you don't have to.

Then we wired the best of it all into one setup — and made it run in minutes.

---

## What You Get

**🧠 5-Layer Persistent Memory**
Your AI Ally never forgets a name, a decision, a preference. Conversational memory, working memory, long-term vault, episodic daily notes, and self-healing rules — all working together. Context that compounds, not decays.

**🤖 Agent Army at Your Command**
35 specialist agents — researchers, writers, engineers, analysts — orchestrated by your AI Ally. You give the order. They ship the work. You review the output.

**🔌 Every Tool in Your Stack, Connected**
Email, calendar, Slack, GitHub, CRM, task managers — all wired into one workspace. No more tab-switching. No more copy-pasting between apps. One conversation runs your entire operation.

**🔄 Self-Evolving**
Every mistake becomes a rule. Every rule becomes an automated check. The system literally rewrites itself to get smarter — without you lifting a finger.

**🧩 Completely Modular**
Don't like a piece? Swap it. Want to add a skill? Drop it in. GodMode is a framework, not a prison. Every component is replaceable.

**🔐 Sovereign**
Your machine. Your data. Your rules. Nothing leaves your stack unless you say so. No vendor lock-in. No mysterious cloud calls. You own every byte.

## Skip Months. Start in Minutes.

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

*Built by entrepreneurs, for entrepreneurs. We use GodMode to build GodMode.*

Made with conviction by the [GodMode Team](https://lifeongodmode.com).
