# GodMode Plugin — Deployment Guide

Step-by-step setup for any machine: macOS, Windows, Linux, or VPS.

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Node.js     | 22+            | `node -v`     |

That's it. Node.js is the **only** prerequisite. Everything else is installed via npm.

### Install Node.js (if missing)

**macOS:**
```bash
# Option A: Homebrew
brew install node@22

# Option B: Direct download
# https://nodejs.org/en/download
```

**Windows:**
```powershell
# Option A: winget (built into Windows 11)
winget install OpenJS.NodeJS.LTS

# Option B: Direct download
# https://nodejs.org/en/download
```

**Linux / VPS:**
```bash
# Option A: NodeSource (Debian/Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Option B: Direct download
# https://nodejs.org/en/download
```

Verify:
```bash
node -v   # Should show v22.x.x or later
```

---

## Quick Setup (Team Script)

For the fastest setup, use the team setup script. Just one command:

```bash
node scripts/team-setup.mjs GM-DEV-YOUR-KEY
```

This automatically installs OpenClaw, the GodMode plugin, activates your license, and configures the gateway. Works on macOS, Windows, and Linux.

If you prefer step-by-step, continue below.

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

For **Claude Pro/Max subscribers** (recommended):
```bash
openclaw setup-token
```

For **API key users**:
```bash
openclaw auth login
```

Follow the prompts. This authenticates the AI agent (Claude) so it can respond to your messages.

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

## Step 4: Activate your license key

You'll receive a license key starting with `GM-`.

```bash
openclaw godmode activate GM-YOUR-KEY-HERE
```

Or set it manually:
```bash
openclaw config set plugins.entries.godmode.enabled true
openclaw config set plugins.entries.godmode.config.licenseKey "GM-YOUR-KEY-HERE"
```

---

## Step 5: Start the gateway

```bash
openclaw gateway start
```

Verify it's running:
```bash
curl -fsS http://127.0.0.1:18789/godmode/health
```

**Windows (PowerShell):**
```powershell
Invoke-RestMethod http://127.0.0.1:18789/godmode/health
```

You should see:
```json
{
  "plugin": "godmode",
  "version": "1.0.0",
  "license": { "status": "valid", "tier": "..." },
  "ui": "available"
}
```

---

## Step 6: Open GodMode

Open your browser to:
```
http://127.0.0.1:18789/godmode/
```

The **Setup tab** will appear in the sidebar for new users. It walks you through:

1. **Quick Start** — enter your name, license key, and daily intelligence topics (under 2 minutes)
2. **Progressive Checklist** — deeper setup tasks you work through at your own pace:
   - Second Brain (memory setup) via the Memory Wizard
   - Connect tools (GitHub, Obsidian)
   - Health audit and config optimization
   - First win demo

---

## Hosted Setup Guide

For non-technical team members, send them to:

```
lifeongodmode.com/setup
```

Or with a pre-filled license key:
```
lifeongodmode.com/setup?key=GM-DEV-teamname&name=Alice
```

This page auto-detects their OS and walks them through every step with copy-paste commands.

---

## Connecting Optional Tools

### GitHub (for coding tasks + team workspaces)

**macOS:**
```bash
brew install gh && gh auth login
```

**Windows:**
```powershell
winget install GitHub.cli
gh auth login
```

**Linux:**
```bash
# See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
gh auth login
```

### Obsidian (for daily brief + second brain)

1. Download from https://obsidian.md
2. Create a vault (or use existing)
3. Set the vault path:

**macOS/Linux** (add to `~/.zshrc` or `~/.bashrc`):
```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/vault"
```

**Windows** (System Environment Variables, or add to PowerShell profile):
```powershell
[Environment]::SetEnvironmentVariable("OBSIDIAN_VAULT_PATH", "C:\Users\You\Obsidian\vault", "User")
```

4. Restart the gateway: `openclaw gateway restart`

---

## What happens if dependencies are skipped

| Missing Dependency | What Happens | How to Fix Later |
|-------------------|-------------|-----------------|
| **GitHub CLI** | Coding tasks show friendly setup instructions | Install `gh` and run `gh auth login` |
| **Obsidian vault** | Today tab shows "No brief available" — still functional | Set `OBSIDIAN_VAULT_PATH`, restart gateway |
| **Channels** | Chat works fine, no cross-platform messaging | Connect via Settings → Channels |
| **Cron jobs** | No automated briefs/reviews — everything works on-demand | Enable in Settings → Cron |

Nothing will crash. Every dependency degrades gracefully with a clear message.

---

## Platform-Specific Notes

### Windows
- Use **PowerShell** (not CMD) for all commands
- Paths use backslashes: `C:\Users\You\godmode\`
- The `~/godmode` shorthand maps to `%USERPROFILE%\godmode`
- Gateway runs the same way: `openclaw gateway start`

### Linux VPS (headless)
- From a repo checkout, install the user-level systemd service: `./scripts/install-systemd.sh`
- Check service health with `systemctl --user status godmode-gateway.service`
- Follow logs with `journalctl --user -u godmode-gateway.service -f`
- Access GodMode remotely via SSH tunnel: `ssh -L 18789:localhost:18789 your-vps`
- Or configure Tailscale for direct access to `http://your-vps:18789/godmode/`

### Mac Mini (headless)
- Use `openclaw gateway install` or `openclaw gateway start --daemon`
- Access GodMode remotely via SSH tunnel or Tailscale

### macOS
- If using Homebrew: `brew install node@22` is the fastest path
- Spotlight-searchable: gateway runs as a background process

---

## Troubleshooting

### Gateway won't start
```bash
# Check for port conflicts
# macOS/Linux:
lsof -i :18789
# Windows:
netstat -ano | findstr :18789

# Check logs
openclaw gateway logs

# Full diagnostic
openclaw doctor
```

### License validation fails
```bash
# Verify the key is set
openclaw config get plugins.entries.godmode.config.licenseKey

# Dev keys (GM-DEV-*) work offline — no validation needed
# Prod keys require internet for first validation
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

# Restart gateway after env changes
openclaw gateway restart
```

---

## Environment Variables (Optional)

**macOS/Linux** — add to `~/.zshrc` or `~/.bashrc`:
```bash
# Obsidian vault location (required for daily brief)
export OBSIDIAN_VAULT_PATH="/path/to/your/vault"

# Custom workspace root (default: ~/godmode)
# export GODMODE_ROOT="$HOME/godmode"
```

**Windows** — set via System Properties → Environment Variables, or:
```powershell
[Environment]::SetEnvironmentVariable("OBSIDIAN_VAULT_PATH", "C:\path\to\vault", "User")
```

After adding, reload your shell and restart the gateway.

---

## Quick verification checklist

```bash
# 1. Node.js installed
node -v

# 2. OpenClaw installed and authenticated
openclaw --version && openclaw auth status

# 3. Gateway is running
curl -fsS http://127.0.0.1:18789/godmode/health

# 4. GodMode workspace exists
ls ~/godmode/data/ 2>/dev/null || echo "Will be created during onboarding"
```
