---
domain: integrations
triggers: integration, connect, setup, configure, hubspot, google, apple, api key, not working, broken, connected, working, isn't working
tools: integrations.status, integrations.test, integrations.configure, integrations.setupGuide
name: godmode-integrations
version: 1.0.0
description: "Configures and troubleshoots third-party service connections"
keywords: ["integration", "connect", "setup", "configure", "hubspot"]
author: godmode-team
clawhub: true
---
## When to Use
- User asks about connected services
- Troubleshooting when a tool fails (calendar, X, Drive, etc.)
- Setting up new integrations
- Checking what's connected and what's not

## How to Use
- `integrations.status` — overview of all integration health
- `integrations.test` — { integration } — test a specific integration
- `integrations.configure` — { integration, config } — update settings
- `integrations.setupGuide` — { integration } — step-by-step setup instructions

## Troubleshooting Chain
1. Run `integrations.status` to see what's connected
2. Run `integrations.test` for the failing integration
3. If keys are missing, provide `integrations.setupGuide`
4. After setup, re-test to confirm

## Gotchas
- API keys live in ~/.openclaw/.env — never echo them to the user
- Calendar uses `gog` CLI — needs GOG_CALENDAR_ACCOUNT configured
- X/Twitter uses XAI_API_KEY, not a Twitter API key
- Some integrations require restart after configuration changes

## Tips
- When any tool fails with an auth error, immediately check integrations.status
- Don't tell the user "I can't do that" — tell them what needs to be set up
- Frame setup as easy: "Let me walk you through connecting your calendar — takes 2 minutes"
