# GodMode — Personal AI Operating System

GodMode is a premium OpenClaw plugin that transforms your self-hosted AI into a personal operating system. It adds deep onboarding, daily operating rhythms, trust tracking, team workspaces, and coding orchestration on top of OpenClaw's powerful infrastructure.

## What You Get

- **Guided Onboarding** — Interactive setup wizard that interviews you, audits your existing configuration, and builds your personalized AI operating environment
- **Daily Operating Rhythm** — Morning briefs with calendar + intelligence, Focus Pulse for priority tracking, evening capture and processing
- **Consciousness Sync** — Your AI maintains a living context document that updates hourly, keeping it aware of your schedule, tasks, and current state
- **Trust Tracker** — Rate your AI's outputs, and it learns your preferences over time. The compounding feedback loop is what makes GodMode irreplaceable
- **Second Brain** — Markdown-based knowledge management with semantic search across all your files
- **Team Workspaces** — Git-backed collaboration with member roles, shared memory, and automatic sync
- **Coding Orchestration** — Dispatch code tasks to isolated worktrees with automated validation gates, PR creation, and completion notifications
- **Safety Gates** — Built-in guardrails that prevent prompt injection, credential leaks, and runaway agent loops
- **Support Chat** — Built-in AI support agent that knows the full system and can troubleshoot issues

## Requirements

- Node.js 22+
- OpenClaw `>=2026.2.0`
- A GodMode license key

## Quick Start

### 1. Install the plugin

```bash
openclaw plugins install @godmode-team/godmode
```

### 2. Activate your license

```bash
openclaw config set plugins.entries.godmode.config.licenseKey "GM-YOUR-KEY-HERE"
openclaw config set plugins.entries.godmode.enabled true
```

### 3. Restart the gateway

```bash
openclaw gateway restart
```

### 4. Open GodMode

Navigate to `http://localhost:18789/godmode` in your browser. The setup wizard will walk you through everything else.

## Verify Installation

```bash
openclaw plugins list
curl -fsS http://127.0.0.1:18789/godmode/health
```

## Configuration

### Workspace root (default: `~/godmode`)

```bash
openclaw config set plugins.entries.godmode.config.workspaceRoot "~/godmode"
```

### Coding orchestration

```bash
openclaw config set plugins.entries.godmode.config.coding.enabled true
openclaw config set plugins.entries.godmode.config.coding.maxParallelWriters 1
```

### Focus Pulse (daily priority tracking)

```bash
openclaw config set plugins.entries.godmode.config.focusPulse.enabled true
```

## Consciousness Sync

The gold heart-brain icon in chat triggers a manual consciousness sync. Press `Cmd/Ctrl+Shift+H` or click the icon to force an immediate refresh of your AI's awareness context.

By default, consciousness syncs automatically every hour via a background heartbeat.

## Support

Having trouble? Open the built-in support chat from the Setup tab, or reach out to your account admin.

## License

Commercial software. See [LICENSE](./LICENSE) for terms.
