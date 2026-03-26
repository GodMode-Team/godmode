# create-godmode

Set up [GodMode](https://lifeongodmode.com) — your personal AI operating system — in one command.

## Quick Start

```bash
npx create-godmode
```

That's it. You'll be chatting with your AI ally in under 3 minutes.

## What it does

1. Checks your Node.js version (requires 22+)
2. Installs the [OpenClaw](https://openclaw.dev) CLI if needed
3. Installs the GodMode plugin
4. Sets up configuration directories
5. Starts the gateway and opens the UI in your browser

## Options

```
--anthropic-key <key>   Pre-set your Anthropic API key
--honcho-key <key>      Pre-set your Honcho API key
--composio-key <key>    Pre-set your Composio API key
--no-launch             Install only, don't start the gateway
--standalone            Use standalone mode (no OpenClaw)
--help                  Show help
--version               Show version
```

## Examples

```bash
# Basic install + launch
npx create-godmode

# Pre-configure API key
npx create-godmode --anthropic-key sk-ant-...

# Install without launching
npx create-godmode --no-launch

# Standalone mode (no OpenClaw dependency)
npx create-godmode --standalone
```

## Requirements

- Node.js 22 or later
- macOS, Linux, or Windows

## License

FSL-1.1-MIT
