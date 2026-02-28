# GodMode Plugin — Deployment Guide

Step-by-step setup for a brand-new machine.

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| macOS | 13+ (Ventura) | `sw_vers` |
| Node.js | 22+ | `node -v` |
| Homebrew | latest | `brew -v` |
| Git | 2.30+ | `git --version` |

### Install prerequisites (if missing)

```bash
# Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node 22 via Homebrew
brew install node@22

# Verify
node -v   # Should show v22.x.x
```

---

## Step 1: Install OpenClaw

```bash
npm install -g openclaw
```

Verify:
```bash
openclaw --version   # Should show 2026.2.x or later
```

---

## Step 2: Set up OpenClaw authentication

```bash
openclaw auth login
```

Follow the prompts. This authenticates the AI agent (Claude) so it can respond to your messages.

For Claude Pro/Max subscribers:
```bash
openclaw setup-token
```

Verify:
```bash
openclaw auth status
```

---

## Step 3: Install the GodMode plugin

```bash
openclaw plugins install @godmode-team/godmode
```

---

## Step 4: Configure your license key

You'll receive a license key starting with `GM-`. Set it:

```bash
openclaw config set plugins.entries.godmode.enabled true
openclaw config set plugins.entries.godmode.config.licenseKey "GM-YOUR-KEY-HERE"
```

---

## Step 5: Set up essential config

Open your config file:
```bash
openclaw config edit
```

Ensure these keys are set (the onboarding wizard will help configure most of these, but the gateway basics need to be right first):

```jsonc
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback",
    "controlUi": { "enabled": true }
  },
  "plugins": {
    "enabled": true,
    "entries": {
      "godmode": {
        "enabled": true,
        "config": {
          "licenseKey": "GM-YOUR-KEY-HERE"
        }
      }
    }
  }
}
```

---

## Step 6: Start the gateway

```bash
openclaw gateway start
```

Verify it's running:
```bash
curl -fsS http://127.0.0.1:18789/godmode/health | python3 -m json.tool
```

You should see:
```json
{
  "plugin": "godmode",
  "version": "1.0.0",
  "license": { "status": "valid", "tier": "..." },
  "ui": "available",
  "methods": 87
}
```

---

## Step 7: Open GodMode

Open your browser to:
```
http://127.0.0.1:18789/godmode/
```

The onboarding wizard will launch automatically on first visit.

---

## Step 8: Complete onboarding

The onboarding flow walks through everything. Here's what to expect:

### Phase 1: Identity
- Enter your name, mission, and pick an avatar emoji
- This becomes your profile across GodMode

### Phase 2: Second Brain (Memory Setup)
- The wizard generates your workspace files at `~/godmode/`
- Creates AGENTS.md, memory files, daily notes structure
- Patches your OpenClaw config with optimal settings

### Phase 3: Connect Tools
- This is where you connect **GitHub**, **Obsidian**, and other tools
- For each tool you want to use:

**GitHub** (needed for coding tasks + team workspaces):
```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login
# Choose: GitHub.com → Login with web browser → follow prompts

# Verify
gh auth status
```

**Obsidian** (needed for daily brief + second brain):
1. Download Obsidian from https://obsidian.md
2. Create a vault (or use an existing one)
3. Set the vault path:
```bash
# Add to your shell profile (~/.zshrc or ~/.bashrc)
export OBSIDIAN_VAULT_PATH="/path/to/your/Obsidian/vault"
```
4. Restart the gateway after setting this:
```bash
openclaw gateway restart
```

- If you skip a tool, it's marked as "pending" — you can set it up later
- Nothing crashes if a tool isn't connected yet

### Phase 4: GodMode Audit
- Answers 3 questions about your workflow
- Maps your pain points to automations

### Phase 5: First Win
- Demonstrates a live capability (morning brief, task breakdown, etc.)
- Sets up cron jobs for daily brief (5 AM) and evening review (8 PM)

### Phase 6: Summary
- Shows what was set up and your health score

---

## What happens if dependencies are skipped

| Missing Dependency | What Happens | How to Fix Later |
|-------------------|-------------|-----------------|
| **GitHub CLI** | Coding tasks show friendly setup instructions instead of running | `brew install gh && gh auth login` then retry |
| **Obsidian vault** | Today tab shows "No brief available" — still fully functional | Set `OBSIDIAN_VAULT_PATH` env var, restart gateway |
| **Channels (Slack, etc.)** | Chat works fine, just no cross-platform messaging | Connect via Settings → Channels tab |
| **Cron jobs** | No automated briefs or reviews — everything still works on-demand | Enable in Settings → Cron tab |

Nothing will crash. Every dependency degrades gracefully with a clear message about what's needed.

---

## Troubleshooting

### Gateway won't start
```bash
# Check for port conflicts
lsof -i :18789

# Check logs
openclaw gateway logs

# Full diagnostic
openclaw doctor
```

### License validation fails
```bash
# Verify the key is set
openclaw config get plugins.entries.godmode.config.licenseKey

# Check connectivity
curl -fsS https://lifeongodmode.com/api/v1/license/validate
```

### Plugin not loading
```bash
# List installed plugins
openclaw plugins list

# Reinstall if needed
openclaw plugins install @godmode-team/godmode --force
```

### Daily brief not appearing
```bash
# Check vault path
echo $OBSIDIAN_VAULT_PATH

# Make sure the daily folder exists
ls "$OBSIDIAN_VAULT_PATH/01-Daily/"

# Restart gateway after env changes
openclaw gateway restart
```

---

## Environment Variables (Optional)

Add to `~/.zshrc` (or `~/.bashrc`):

```bash
# Obsidian vault location (required for daily brief)
export OBSIDIAN_VAULT_PATH="/path/to/your/vault"

# Custom daily brief folder (default: 01-Daily)
# export DAILY_BRIEF_FOLDER="DailyNotes"

# Custom workspace root (default: ~/godmode)
# export GODMODE_ROOT="$HOME/godmode"
```

After adding, reload:
```bash
source ~/.zshrc
openclaw gateway restart
```

---

## Quick verification checklist

```bash
# 1. OpenClaw is installed and authenticated
openclaw --version && openclaw auth status

# 2. Gateway is running
curl -fsS http://127.0.0.1:18789/godmode/health

# 3. GitHub is ready (optional but recommended)
gh auth status

# 4. Obsidian vault exists (optional but recommended)
ls "$OBSIDIAN_VAULT_PATH" 2>/dev/null || echo "Not configured"

# 5. GodMode workspace exists
ls ~/godmode/data/ 2>/dev/null || echo "Will be created during onboarding"
```
