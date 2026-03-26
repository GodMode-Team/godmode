---
domain: screenpipe
triggers: screenpipe, screen capture, ambient memory, screen recording, screen history, what was on my screen, what was I looking at, screen recall
tools: ingestion.screenpipeStatus, ingestion.screenpipeSetup, ingestion.screenpipeInstall, ingestion.screenpipeStart, ingestion.screenpipeStop, ingestion.screenpipeConfigure, ingestion.runPipeline, secondBrain.search
name: godmode-screenpipe
version: 2.0.0
description: "Manages Screenpipe ambient memory — fully managed install, daemon lifecycle, screen & audio capture, and recall"
keywords: ["screenpipe", "screen", "capture", "ambient", "recall"]
author: godmode-team
clawhub: true
---
## When to Use
- User mentions Screenpipe (setup, status, configuration, troubleshooting)
- User asks "what was on my screen" or wants to recall something they saw
- User wants to configure blocked apps, retention, or privacy settings
- Screenpipe shows as offline in the Engine panel or Brain tab

## How to Use
- `ingestion.screenpipeStatus` — check if installed, running, version, PID, managedByUs
- `ingestion.screenpipeSetup` — **one-click**: auto-installs (if needed) + starts daemon + enables. Use this for first-time setup.
- `ingestion.screenpipeInstall` — install only (brew on macOS, script on Linux)
- `ingestion.screenpipeStart` — start the daemon (must be installed first)
- `ingestion.screenpipeStop` — stop the daemon
- `ingestion.screenpipeConfigure` — { enabled?, blockedApps?, retention?, privacy? } — update settings
- `ingestion.runPipeline` — { pipeline: "screenpipe-hourly" } — manually trigger ingestion
- `secondBrain.search` — search for Screenpipe-captured content in the vault

## Setup Flow
1. Check status: `ingestion.screenpipeStatus`
2. If not installed OR not running: call `ingestion.screenpipeSetup` — it handles everything automatically (install via Homebrew, start daemon, enable config). This may take a few minutes on first install.
3. If installed but stopped: call `ingestion.screenpipeStart`
4. Configure blocked apps (e.g., banking, health apps) via `ingestion.screenpipeConfigure`

**IMPORTANT:** NEVER tell users to run CLI commands, use Homebrew directly, or visit screenpipe.com. GodMode handles the entire install and lifecycle. The user clicks one button or asks you — that's it.

## Architecture
- GodMode fully manages Screenpipe: detection, installation, daemon start/stop, health monitoring
- Screenpipe runs locally on the user's machine (default localhost:3030, configurable)
- GodMode ingests screen/audio data via hourly → daily → weekly → monthly compression
- Summaries are stored in memory/screenpipe/ and forwarded to Honcho
- Entity extraction pulls out people, decisions, URLs from screen activity
- All data stays local — no cloud upload
- PID tracking: GodMode tracks the daemon PID to know if it started the process

## Gotchas
- First install via Homebrew can take 1-5 minutes (compilation) — this is normal
- Default API URL is localhost:3030, user can override in screenpipe config
- Privacy: configure blockedApps to exclude sensitive apps (banking, medical)
- The ingestion pipeline runs hourly — recent screen data may not be indexed yet
- If daemon was started outside GodMode, `managedByUs` will be false but it still works

## Tips
- When user asks about Screenpipe, ALWAYS check status first with `ingestion.screenpipeStatus`
- If not set up, offer to run `ingestion.screenpipeSetup` — don't explain CLI steps
- Never evaluate whether Screenpipe is "worth using" — it's already integrated. Help configure it.
- If offline, use `ingestion.screenpipeStart` to restart, don't tell user to open a terminal
- Frame privacy controls positively: "Let's make sure sensitive apps are excluded"
