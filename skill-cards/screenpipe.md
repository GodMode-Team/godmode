---
domain: screenpipe
triggers: screenpipe, screen capture, ambient memory, screen recording, screen history, what was on my screen, what was I looking at, screen recall
tools: ingestion.screenpipeStatus, ingestion.screenpipeConfigure, ingestion.screenpipeToggle, ingestion.runPipeline, secondBrain.search
name: godmode-screenpipe
version: 1.0.0
description: "Manages Screenpipe ambient memory — screen & audio capture, setup, and recall"
keywords: ["screenpipe", "screen", "capture", "ambient", "recall"]
author: godmode-team
clawhub: true
---
## When to Use
- User mentions Screenpipe (setup, status, configuration, troubleshooting)
- User asks "what was on my screen" or wants to recall something they saw
- User wants to configure blocked apps, retention, or privacy settings
- Screenpipe shows as offline in the Engine panel

## How to Use
- `ingestion.screenpipeStatus` — check if Screenpipe is running, get current config
- `ingestion.screenpipeConfigure` — { enabled?, blockedApps?, retention?, privacy? } — update settings
- `ingestion.screenpipeToggle` — quick enable/disable toggle
- `ingestion.runPipeline` — { pipeline: "screenpipe-hourly" } — manually trigger ingestion
- `secondBrain.search` — search for Screenpipe-captured content in the vault

## Setup Flow
1. Check status: `ingestion.screenpipeStatus`
2. If not installed: "Install with `brew install screenpipe` (macOS) or download from screenpi.pe"
3. If installed but not running: "Start with `screenpipe` in terminal"
4. If running but not enabled: `ingestion.screenpipeToggle` to enable
5. Configure blocked apps (e.g., banking, health apps) via `ingestion.screenpipeConfigure`

## Architecture
- Screenpipe runs locally on the user's machine (localhost:3030)
- GodMode ingests screen/audio data via hourly → daily → weekly → monthly compression
- Summaries are stored in memory/screenpipe/ and forwarded to Honcho
- Entity extraction pulls out people, decisions, URLs from screen activity
- All data stays local — no cloud upload

## Gotchas
- Screenpipe must be running as a separate process — GodMode doesn't start it
- Default API URL is localhost:3030, override with SCREENPIPE_API_URL env var
- Privacy: configure blockedApps to exclude sensitive apps (banking, medical)
- The ingestion pipeline runs hourly — recent screen data may not be indexed yet

## Tips
- When user asks about Screenpipe, ALWAYS check status first with ingestion.screenpipeStatus
- Never evaluate whether Screenpipe is "worth using" — it's already integrated. Help configure it.
- If offline, guide the user to start it, don't suggest alternatives
- Frame privacy controls positively: "Let's make sure sensitive apps are excluded"
