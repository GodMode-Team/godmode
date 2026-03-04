#!/bin/sh
# GodMode Universal Installer
#
# Usage:
#   curl -fsSL https://lifeongodmode.com/install.sh | sh
#   curl -fsSL https://lifeongodmode.com/install.sh | sh -s -- GM-YOUR-KEY
#
# What it does:
#   1. Detects your platform (macOS / Linux)
#   2. Checks Node.js 22+ (installs via fnm if missing)
#   3. Installs OpenClaw CLI globally
#   4. Installs GodMode plugin
#   5. Activates your license key (if provided)
#   6. Checks AI authentication
#   7. Configures gateway
#   8. Starts gateway and opens GodMode
#
# POSIX-compliant. No bashisms.

set -e

# ── EXIT trap for failure summary ────────────────────────────────────────
cleanup() {
  EXIT_CODE=$?
  if [ "$EXIT_CODE" -ne 0 ]; then
    printf "\n  ${RED}${BOLD}Installation did not complete (exit code %s).${RESET}\n" "$EXIT_CODE"
    printf "  ${DIM}Check the error above and re-run this script.${RESET}\n"
    printf "  ${DIM}For help: https://lifeongodmode.com/support${RESET}\n\n"
  fi
}
trap cleanup EXIT

# ── ANSI colors (auto-detect) ──────────────────────────────────────────────

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ] && [ "${TERM:-dumb}" != "dumb" ]; then
  RESET='\033[0m'
  BOLD='\033[1m'
  DIM='\033[2m'
  GREEN='\033[32m'
  RED='\033[31m'
  YELLOW='\033[33m'
  CYAN='\033[36m'
  MAGENTA='\033[35m'
  WHITE='\033[37m'
else
  RESET='' BOLD='' DIM='' GREEN='' RED='' YELLOW='' CYAN='' MAGENTA='' WHITE=''
fi

# ── Output helpers ──────────────────────────────────────────────────────────

step() {
  printf "\n${CYAN}${BOLD}[%s/%s]${RESET} ${WHITE}${BOLD}%s${RESET}\n" "$1" "$TOTAL_STEPS" "$2"
}

ok() {
  printf "  ${GREEN}✔${RESET}  %s\n" "$1"
}

warn() {
  printf "  ${YELLOW}⚠${RESET}  ${YELLOW}%s${RESET}\n" "$1"
}

fail() {
  printf "  ${RED}✖${RESET}  ${RED}%s${RESET}\n" "$1"
}

info() {
  printf "  ${DIM}%s${RESET}\n" "$1"
}

# ── Platform detection ──────────────────────────────────────────────────────

detect_platform() {
  OS="$(uname -s)"
  ARCH="$(uname -m)"

  case "$OS" in
    Darwin) PLATFORM="macos" ;;
    Linux)  PLATFORM="linux" ;;
    *)
      fail "Unsupported operating system: $OS"
      info "GodMode supports macOS and Linux. Windows users: use WSL2."
      exit 1
      ;;
  esac

  case "$ARCH" in
    x86_64|amd64)   ARCH_LABEL="x64" ;;
    arm64|aarch64)   ARCH_LABEL="arm64" ;;
    *)               ARCH_LABEL="$ARCH" ;;
  esac
}

# ── Command existence check ─────────────────────────────────────────────────

has() {
  command -v "$1" >/dev/null 2>&1
}

# ── Node.js version check ──────────────────────────────────────────────────

check_node() {
  if has node; then
    NODE_VERSION="$(node --version 2>/dev/null || echo "v0")"
    NODE_MAJOR="$(echo "$NODE_VERSION" | sed 's/^v//' | cut -d. -f1)"
    if [ "$NODE_MAJOR" -ge 22 ] 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

# ── Install Node.js via fnm ────────────────────────────────────────────────

install_node() {
  if has fnm; then
    ok "fnm detected — installing Node.js 22"
    fnm install 22
    fnm use 22
    eval "$(fnm env)" 2>/dev/null || true
    return 0
  fi

  # nvm is a shell function — try sourcing it if not available as command
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
  fi
  if has nvm; then
    ok "nvm detected — installing Node.js 22"
    nvm install 22
    nvm use 22
    return 0
  fi

  warn "No version manager found — installing fnm"

  if [ "$PLATFORM" = "macos" ] && has brew; then
    brew install fnm
  else
    curl -fsSL https://fnm.vercel.app/install | sh
  fi

  # Source fnm into current shell
  export PATH="$HOME/.local/share/fnm:$PATH"
  if has fnm; then
    eval "$(fnm env)" 2>/dev/null || true
    fnm install 22
    fnm use 22
    eval "$(fnm env)" 2>/dev/null || true
    # Verify node is now available
    if ! has node; then
      export PATH="$HOME/.local/share/fnm/aliases/default/bin:$PATH"
    fi
    return 0
  fi

  fail "Could not install Node.js automatically"
  info "Please install Node.js 22+ manually: https://nodejs.org/en/download"
  exit 1
}

# ── Open browser (cross-platform) ──────────────────────────────────────────

open_browser() {
  URL="$1"
  if [ "$PLATFORM" = "macos" ]; then
    open "$URL" 2>/dev/null || true
  elif has xdg-open; then
    xdg-open "$URL" 2>/dev/null || true
  else
    info "Open in your browser: $URL"
  fi
}

# ── Main ────────────────────────────────────────────────────────────────────

LICENSE_KEY="${1:-}"
TOTAL_STEPS=8
GODMODE_URL="http://127.0.0.1:18789/godmode/onboarding"

printf "\n${MAGENTA}${BOLD}=== GodMode Installer ===${RESET}\n"

# Step 1: Platform
step 1 "Detecting platform"
detect_platform
ok "Platform: ${BOLD}${PLATFORM}${RESET} (${ARCH_LABEL})"

# Step 2: Node.js
step 2 "Checking Node.js"
if check_node; then
  ok "Node.js ${BOLD}${NODE_VERSION}${RESET}"
else
  warn "Node.js 22+ required"
  install_node
  if check_node; then
    ok "Node.js ${BOLD}${NODE_VERSION}${RESET} installed"
  else
    fail "Node.js installation failed"
    info "Install Node.js 22+ manually: https://nodejs.org/en/download"
    exit 1
  fi
fi

# Verify npm is available before proceeding
if ! has npm; then
  fail "npm not found — Node.js was installed but npm is not on PATH"
  info "Try opening a new terminal, or run: source ~/.bashrc"
  info "Then re-run this script."
  exit 1
fi

# Step 3: OpenClaw CLI
step 3 "Installing OpenClaw CLI"
if has openclaw; then
  OC_VERSION="$(openclaw --version 2>/dev/null || echo "(version unknown)")"
  ok "OpenClaw CLI already installed — ${OC_VERSION}"
else
  info "Installing openclaw globally via npm..."
  npm install -g openclaw || {
    fail "OpenClaw CLI install failed"
    info "Try: npm install -g openclaw"
    info "If permission denied: npm install -g openclaw --prefix ~/.local"
    exit 1
  }
  if has openclaw; then
    ok "OpenClaw CLI installed"
  else
    fail "OpenClaw CLI not found after install"
    info "Try: npm install -g openclaw"
    info "If permission denied: npm install -g openclaw --prefix ~/.local"
    exit 1
  fi
fi

# Step 4: GodMode plugin
step 4 "Installing GodMode plugin"
PLUGIN_INSTALLED=false
if openclaw plugins list 2>/dev/null | grep -qi godmode; then
  PLUGIN_INSTALLED=true
fi

if [ "$PLUGIN_INSTALLED" = true ]; then
  ok "GodMode plugin already installed"
else
  info "Installing @godmode-team/godmode..."
  openclaw plugins install @godmode-team/godmode || {
    fail "GodMode plugin install failed"
    info "Try: openclaw plugins install @godmode-team/godmode"
    exit 1
  }
  ok "GodMode plugin installed"
fi

# Step 5: License activation
step 5 "Activating license"
if [ -n "$LICENSE_KEY" ]; then
  openclaw godmode activate "$LICENSE_KEY" && ok "License activated: ${BOLD}${LICENSE_KEY}${RESET}" || {
    warn "License activation failed — you can activate later in the UI"
    info "openclaw godmode activate YOUR-LICENSE-KEY"
  }
else
  info "No license key provided — skipping activation"
  info "You can activate later: openclaw godmode activate YOUR-KEY"
  info "Or enter it during onboarding in the GodMode UI"
fi

# Step 6: AI Authentication
step 6 "Checking AI authentication"
if openclaw auth status 2>/dev/null | grep -qi "authenticated\|connected\|active"; then
  ok "Already authenticated with Claude"
else
  warn "AI authentication not configured"
  info "GodMode needs Claude authentication to work. Two options:"
  printf "\n"
  info "  Claude Pro/Max subscriber:  openclaw setup-token"
  info "  API key holder:             openclaw auth login"
  printf "\n"
  info "Run one of these commands after this installer finishes,"
  info "or set it up in the GodMode UI."
fi

# Step 7: Configure gateway
step 7 "Configuring gateway"
openclaw config set gateway.mode local 2>/dev/null && ok "gateway.mode = local" || warn "Could not set gateway.mode"
openclaw config set gateway.controlUi.enabled true 2>/dev/null && ok "gateway.controlUi.enabled = true" || warn "Could not set controlUi"
openclaw config set plugins.enabled true 2>/dev/null && ok "plugins.enabled = true" || warn "Could not set plugins.enabled"

# Generate security token if missing
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"
CONFIG_FILE="$STATE_DIR/openclaw.json"
if [ -f "$CONFIG_FILE" ]; then
  if grep -q '"token"' "$CONFIG_FILE" 2>/dev/null; then
    ok "Gateway security token already set"
  else
    TOKEN="$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | od -An -tx1 | tr -d ' \n' | head -c 64)"
    # Use node with env vars to avoid shell injection
    CONFIG_FILE="$CONFIG_FILE" GATEWAY_TOKEN="$TOKEN" node -e "
      const fs = require('fs');
      const p = process.env.CONFIG_FILE;
      let c = {};
      try { c = JSON.parse(fs.readFileSync(p, 'utf-8')); } catch {}
      if (!c.gateway) c.gateway = {};
      if (!c.gateway.auth) c.gateway.auth = {};
      c.gateway.auth.mode = 'token';
      c.gateway.auth.token = process.env.GATEWAY_TOKEN;
      fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n');
    " 2>/dev/null && ok "Gateway security token generated" || warn "Could not set security token"
  fi
fi

# Step 8: Start gateway
step 8 "Starting gateway"
if openclaw gateway status 2>/dev/null | grep -qi running; then
  info "Gateway already running — restarting with new config..."
  openclaw gateway restart 2>/dev/null && ok "Gateway restarted" || warn "Restart failed — try: openclaw gateway restart"
else
  openclaw gateway start 2>/dev/null && ok "Gateway started" || {
    warn "Could not start gateway automatically"
    info "Start manually: openclaw gateway start"
  }
fi

# Wait for gateway to be ready (up to 10 seconds)
READY=false
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf "http://127.0.0.1:18789/health" >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" = true ]; then
  ok "Gateway is ready"
else
  warn "Gateway may still be starting — opening browser anyway"
fi

# ── Done ────────────────────────────────────────────────────────────────────

printf "\n${GREEN}${BOLD}================================================${RESET}\n"
printf "${GREEN}${BOLD}  GodMode installed successfully!${RESET}\n"
printf "${GREEN}${BOLD}================================================${RESET}\n"
printf "\n"
printf "  ${WHITE}${BOLD}Opening GodMode...${RESET}\n"
printf "    ${CYAN}%s${RESET}\n" "$GODMODE_URL"
printf "\n"

# Brief pause so user sees the message
sleep 1
open_browser "$GODMODE_URL"

printf "  ${DIM}Run this script again at any time — it is safe to re-run.${RESET}\n"
printf "  ${DIM}Need help? https://lifeongodmode.com/support${RESET}\n\n"
