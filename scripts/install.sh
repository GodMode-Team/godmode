#!/bin/sh
# GodMode Universal Installer
#
# Usage:
#   curl -fsSL https://lifeongodmode.com/install.sh | sh
#   curl -fsSL https://lifeongodmode.com/install.sh | sh -s -- GM-YOUR-KEY
#
# What it does:
#   1. Detects your platform (macOS / Linux / headless VPS)
#   2. Installs system dependencies if needed
#   3. Checks Node.js 22+ (installs if missing)
#   4. Installs OpenClaw CLI globally
#   5. Installs GodMode plugin
#   6. Activates your license key (prompts if not provided)
#   7. Checks AI authentication
#   8. Configures gateway
#   9. Starts gateway
#
# POSIX-compliant. No bashisms. Works on bare VPS.

set -e

# ── EXIT trap for failure summary ────────────────────────────────────────
cleanup() {
  EXIT_CODE=$?
  if [ "$EXIT_CODE" -ne 0 ]; then
    printf '\n  Installation did not complete (exit code %s).\n' "$EXIT_CODE"
    printf '  Check the error above and re-run this script.\n'
    printf '  For help: https://lifeongodmode.com/support\n\n'
  fi
}
trap cleanup EXIT

# ── ANSI colors ──────────────────────────────────────────────────────────
# When piped (curl | sh), stdout is not a TTY. Force plain text.

USE_COLOR=false
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ] && [ "${TERM:-dumb}" != "dumb" ]; then
  USE_COLOR=true
fi

if [ "$USE_COLOR" = true ]; then
  RST=$(printf '\033[0m')
  BLD=$(printf '\033[1m')
  DIM=$(printf '\033[2m')
  GRN=$(printf '\033[32m')
  RED=$(printf '\033[31m')
  YLW=$(printf '\033[33m')
  CYN=$(printf '\033[36m')
  MAG=$(printf '\033[35m')
  WHT=$(printf '\033[37m')
else
  RST='' BLD='' DIM='' GRN='' RED='' YLW='' CYN='' MAG='' WHT=''
fi

# ── Output helpers ──────────────────────────────────────────────────────────

step() {
  printf '\n%s[%s/%s]%s %s%s%s\n' "$CYN$BLD" "$1" "$TOTAL_STEPS" "$RST" "$WHT$BLD" "$2" "$RST"
}

ok() {
  printf '  %s✔%s  %s\n' "$GRN" "$RST" "$1"
}

warn() {
  printf '  %s⚠  %s%s\n' "$YLW" "$1" "$RST"
}

fail() {
  printf '  %s✖  %s%s\n' "$RED" "$1" "$RST"
}

info() {
  printf '  %s%s%s\n' "$DIM" "$1" "$RST"
}

# ── Platform detection ──────────────────────────────────────────────────────

IS_HEADLESS=false

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

  # Detect headless/VPS environment
  if [ "$PLATFORM" = "linux" ]; then
    if [ -z "${DISPLAY:-}" ] && [ -z "${WAYLAND_DISPLAY:-}" ] && ! command -v xdg-open >/dev/null 2>&1; then
      IS_HEADLESS=true
    fi
  fi
}

# ── Command existence check ─────────────────────────────────────────────────

has() {
  command -v "$1" >/dev/null 2>&1
}

# ── Ensure npm global bin is on PATH ─────────────────────────────────────────
# After npm install -g, the binary may not be on PATH depending on how
# Node.js was installed (fnm, nvm, direct download, distro package).

ensure_npm_bin_on_path() {
  NPM_BIN=""

  # Method 1: ask npm where its global bin is
  if has npm; then
    NPM_BIN="$(npm config get prefix 2>/dev/null)/bin"
  fi

  # Method 2: common locations to check
  for dir in \
    "$NPM_BIN" \
    "$HOME/.local/share/fnm/aliases/default/bin" \
    "$HOME/.local/node/bin" \
    "$HOME/.nvm/versions/node/$(node --version 2>/dev/null)/bin" \
    "$HOME/.npm-global/bin" \
    "/usr/local/bin" \
    "/usr/bin"; do
    if [ -n "$dir" ] && [ -d "$dir" ]; then
      case ":$PATH:" in
        *":$dir:"*) ;; # already on PATH
        *) export PATH="$dir:$PATH" ;;
      esac
    fi
  done

  # Persist to shell profile if we had to add paths
  PROFILE_FILE=""
  if [ -f "$HOME/.bashrc" ]; then
    PROFILE_FILE="$HOME/.bashrc"
  elif [ -f "$HOME/.zshrc" ]; then
    PROFILE_FILE="$HOME/.zshrc"
  elif [ -f "$HOME/.profile" ]; then
    PROFILE_FILE="$HOME/.profile"
  fi

  if [ -n "$PROFILE_FILE" ] && [ -n "$NPM_BIN" ] && [ -d "$NPM_BIN" ]; then
    if ! grep -q "$NPM_BIN" "$PROFILE_FILE" 2>/dev/null; then
      printf '\n# npm global bin (added by GodMode installer)\nexport PATH="%s:$PATH"\n' "$NPM_BIN" >> "$PROFILE_FILE"
    fi
  fi
}

# ── Create persistent symlink for openclaw ──────────────────────────────────
# When Node is installed via fnm/nvm, the global bin lives deep inside the
# version manager's directory tree. This function creates a symlink in a
# directory that's ALREADY on PATH in every shell (no sourcing needed).

persist_openclaw_on_path() {
  # Find the real openclaw binary
  OC_REAL=""
  if has openclaw; then
    OC_REAL="$(command -v openclaw 2>/dev/null)"
  fi

  # If not on PATH yet, search known locations
  if [ -z "$OC_REAL" ]; then
    for candidate in \
      "$(npm bin -g 2>/dev/null)/openclaw" \
      "$(npm config get prefix 2>/dev/null)/bin/openclaw" \
      "$HOME/.local/share/fnm/aliases/default/bin/openclaw" \
      "$HOME/.local/node/bin/openclaw"; do
      if [ -n "$candidate" ] && [ -x "$candidate" ]; then
        OC_REAL="$candidate"
        break
      fi
    done
  fi

  if [ -z "$OC_REAL" ]; then
    return 1
  fi

  # Resolve symlinks to get the actual file
  OC_RESOLVED="$OC_REAL"
  if has readlink; then
    OC_RESOLVED="$(readlink -f "$OC_REAL" 2>/dev/null || echo "$OC_REAL")"
  fi

  # If openclaw is already in /usr/local/bin or /usr/bin, nothing to do
  case "$OC_REAL" in
    /usr/local/bin/*|/usr/bin/*) return 0 ;;
  esac

  # Try to symlink into /usr/local/bin (on PATH for virtually every system)
  if [ -d "/usr/local/bin" ] && [ -w "/usr/local/bin" ]; then
    ln -sf "$OC_RESOLVED" /usr/local/bin/openclaw 2>/dev/null && {
      info "Symlinked openclaw → /usr/local/bin/openclaw"
      return 0
    }
  fi

  # Try with sudo if available and we're not root
  if [ "$(id -u)" != "0" ] && has sudo; then
    sudo ln -sf "$OC_RESOLVED" /usr/local/bin/openclaw 2>/dev/null && {
      info "Symlinked openclaw → /usr/local/bin/openclaw (sudo)"
      return 0
    }
  fi

  # Fallback: $HOME/.local/bin (many systems add this to PATH via .profile)
  mkdir -p "$HOME/.local/bin" 2>/dev/null
  if [ -d "$HOME/.local/bin" ]; then
    ln -sf "$OC_RESOLVED" "$HOME/.local/bin/openclaw" 2>/dev/null && {
      export PATH="$HOME/.local/bin:$PATH"
      info "Symlinked openclaw → ~/.local/bin/openclaw"

      # Ensure ~/.local/bin is in shell profile
      PROFILE_FILE=""
      if [ -f "$HOME/.bashrc" ]; then
        PROFILE_FILE="$HOME/.bashrc"
      elif [ -f "$HOME/.zshrc" ]; then
        PROFILE_FILE="$HOME/.zshrc"
      elif [ -f "$HOME/.profile" ]; then
        PROFILE_FILE="$HOME/.profile"
      fi

      if [ -n "$PROFILE_FILE" ]; then
        if ! grep -q 'HOME/.local/bin' "$PROFILE_FILE" 2>/dev/null; then
          printf '\n# Local bin (added by GodMode installer)\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "$PROFILE_FILE"
        fi
      fi

      return 0
    }
  fi

  return 1
}

# ── Install system dependencies (Linux) ─────────────────────────────────────

install_system_deps() {
  if [ "$PLATFORM" != "linux" ]; then
    ok "System dependencies present"
    return 0
  fi

  MISSING=""
  for dep in curl unzip tar xz-utils; do
    # xz-utils provides xz for .tar.xz extraction; binary name varies
    if [ "$dep" = "xz-utils" ]; then
      if has xz || has xzcat || has unxz; then
        continue
      fi
    elif has "$dep"; then
      continue
    fi
    MISSING="$MISSING $dep"
  done

  if [ -z "$MISSING" ]; then
    ok "System dependencies present"
    return 0
  fi

  info "Installing missing system packages:$MISSING"

  if has apt-get; then
    apt-get update -qq >/dev/null 2>&1 || true
    # shellcheck disable=SC2086
    apt-get install -y -qq $MISSING >/dev/null 2>&1 && ok "Installed:$MISSING" || {
      warn "Could not install$MISSING via apt-get (try running as root)"
      info "Run: sudo apt-get install -y$MISSING"
    }
  elif has yum; then
    # shellcheck disable=SC2086
    yum install -y -q $MISSING >/dev/null 2>&1 && ok "Installed:$MISSING" || {
      warn "Could not install$MISSING via yum (try running as root)"
    }
  elif has dnf; then
    # shellcheck disable=SC2086
    dnf install -y -q $MISSING >/dev/null 2>&1 && ok "Installed:$MISSING" || {
      warn "Could not install$MISSING via dnf (try running as root)"
    }
  elif has apk; then
    # shellcheck disable=SC2086
    apk add --quiet $MISSING >/dev/null 2>&1 && ok "Installed:$MISSING" || {
      warn "Could not install$MISSING via apk"
    }
  elif has pacman; then
    # shellcheck disable=SC2086
    pacman -S --noconfirm $MISSING >/dev/null 2>&1 && ok "Installed:$MISSING" || {
      warn "Could not install$MISSING via pacman"
    }
  else
    warn "Unknown package manager — please install manually:$MISSING"
  fi
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

# ── Install Node.js ─────────────────────────────────────────────────────────
# Try in order: fnm, nvm, direct binary download

install_node() {
  # Try existing fnm
  if has fnm; then
    ok "fnm detected — installing Node.js 22"
    fnm install 22
    fnm use 22
    eval "$(fnm env)" 2>/dev/null || true
    return 0
  fi

  # Try nvm (shell function — source it first)
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
  fi
  if has nvm; then
    ok "nvm detected — installing Node.js 22"
    nvm install 22
    nvm use 22
    return 0
  fi

  # Try installing fnm
  info "No version manager found — trying fnm"
  if [ "$PLATFORM" = "macos" ] && has brew; then
    brew install fnm 2>/dev/null && {
      eval "$(fnm env)" 2>/dev/null || true
      fnm install 22 && fnm use 22
      eval "$(fnm env)" 2>/dev/null || true
      return 0
    }
  fi

  # fnm installer needs unzip + curl
  if has curl && has unzip; then
    curl -fsSL https://fnm.vercel.app/install 2>/dev/null | sh 2>/dev/null && {
      export PATH="$HOME/.local/share/fnm:$PATH"
      if has fnm; then
        eval "$(fnm env)" 2>/dev/null || true
        fnm install 22 && fnm use 22
        eval "$(fnm env)" 2>/dev/null || true
        if ! has node; then
          export PATH="$HOME/.local/share/fnm/aliases/default/bin:$PATH"
        fi
        return 0
      fi
    }
  fi

  # Fallback: direct Node.js binary download
  info "fnm unavailable — downloading Node.js directly"
  install_node_direct
}

install_node_direct() {
  NODE_VER="v22.14.0"

  case "$PLATFORM" in
    macos)
      case "$ARCH_LABEL" in
        arm64) NODE_DIST="node-${NODE_VER}-darwin-arm64" ;;
        *)     NODE_DIST="node-${NODE_VER}-darwin-x64" ;;
      esac
      ;;
    linux)
      case "$ARCH_LABEL" in
        arm64) NODE_DIST="node-${NODE_VER}-linux-arm64" ;;
        *)     NODE_DIST="node-${NODE_VER}-linux-x64" ;;
      esac
      ;;
  esac

  NODE_URL="https://nodejs.org/dist/${NODE_VER}/${NODE_DIST}.tar.xz"
  NODE_DIR="$HOME/.local/node"

  info "Downloading Node.js $NODE_VER..."

  mkdir -p "$HOME/.local"

  if has curl; then
    curl -fsSL "$NODE_URL" -o /tmp/node.tar.xz
  elif has wget; then
    wget -q "$NODE_URL" -O /tmp/node.tar.xz
  else
    fail "Neither curl nor wget found — cannot download Node.js"
    exit 1
  fi

  # Extract
  mkdir -p "$NODE_DIR"
  tar -xJf /tmp/node.tar.xz -C "$NODE_DIR" --strip-components=1
  rm -f /tmp/node.tar.xz

  export PATH="$NODE_DIR/bin:$PATH"

  if has node; then
    ok "Node.js $(node --version) installed to $NODE_DIR"

    # Add to shell profile so it persists
    PROFILE_FILE=""
    if [ -f "$HOME/.bashrc" ]; then
      PROFILE_FILE="$HOME/.bashrc"
    elif [ -f "$HOME/.profile" ]; then
      PROFILE_FILE="$HOME/.profile"
    fi

    if [ -n "$PROFILE_FILE" ]; then
      if ! grep -q "$NODE_DIR/bin" "$PROFILE_FILE" 2>/dev/null; then
        printf '\n# Node.js (installed by GodMode)\nexport PATH="%s/bin:$PATH"\n' "$NODE_DIR" >> "$PROFILE_FILE"
        info "Added Node.js to $PROFILE_FILE"
      fi
    fi

    return 0
  fi

  fail "Node.js download succeeded but binary not working"
  info "Install Node.js 22+ manually: https://nodejs.org/en/download"
  exit 1
}

# ── Open browser (cross-platform) ──────────────────────────────────────────

open_browser() {
  URL="$1"
  if [ "$PLATFORM" = "macos" ]; then
    open "$URL" 2>/dev/null || true
  elif has xdg-open; then
    xdg-open "$URL" 2>/dev/null || true
  fi
  # On headless, don't try to open — handled separately
}

# ── Main ────────────────────────────────────────────────────────────────────

LICENSE_KEY="${1:-}"
TOTAL_STEPS=9
GODMODE_PORT=18789

printf '\n%s=== GodMode Installer ===%s\n' "$MAG$BLD" "$RST"

# Step 1: Platform
step 1 "Detecting platform"
detect_platform
if [ "$IS_HEADLESS" = true ]; then
  ok "Platform: $PLATFORM ($ARCH_LABEL) — headless/VPS"
else
  ok "Platform: $PLATFORM ($ARCH_LABEL)"
fi

# Step 2: System dependencies
step 2 "Checking system dependencies"
install_system_deps

# Step 3: Node.js
step 3 "Checking Node.js"
if check_node; then
  ok "Node.js $NODE_VERSION"
else
  warn "Node.js 22+ required"
  install_node
  if check_node; then
    ok "Node.js $NODE_VERSION installed"
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

# Step 4: OpenClaw CLI
step 4 "Installing OpenClaw CLI"
if has openclaw; then
  OC_VERSION="$(openclaw --version 2>/dev/null || echo "(version unknown)")"
  ok "OpenClaw CLI already installed — $OC_VERSION"
else
  info "Installing openclaw globally via npm..."
  npm install -g openclaw || {
    fail "OpenClaw CLI install failed"
    info "Try: npm install -g openclaw"
    info "If permission denied, try: npm install -g openclaw --prefix ~/.local"
    exit 1
  }

  # Ensure npm global bin directory is on PATH (for this script's subshell)
  ensure_npm_bin_on_path

  if has openclaw; then
    ok "OpenClaw CLI installed"
  else
    # Last resort: find the binary
    OC_PATH="$(npm root -g 2>/dev/null)/../../bin"
    if [ -x "$OC_PATH/openclaw" ]; then
      export PATH="$OC_PATH:$PATH"
      ok "OpenClaw CLI installed (added $OC_PATH to PATH)"
    else
      fail "OpenClaw CLI installed but not found on PATH"
      info "npm global bin: $(npm bin -g 2>/dev/null || echo 'unknown')"
      info "Try: export PATH=\"\$(npm bin -g):\$PATH\" && openclaw --version"
      info "Then re-run this script."
      exit 1
    fi
  fi
fi

# Create a persistent symlink so openclaw is available in new shells immediately
# (without needing to source .bashrc)
persist_openclaw_on_path

# Step 5: GodMode plugin
step 5 "Installing GodMode plugin"
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

# Step 6: License activation
step 6 "Activating license"
if [ -z "$LICENSE_KEY" ]; then
  # Try to prompt interactively if terminal is available
  if [ -t 0 ] 2>/dev/null; then
    printf '\n  Enter your GodMode license key (or press Enter to skip): '
    read -r LICENSE_KEY
  fi
fi

if [ -n "$LICENSE_KEY" ]; then
  openclaw godmode activate "$LICENSE_KEY" && ok "License activated: $LICENSE_KEY" || {
    warn "License activation failed — you can activate later"
    info "openclaw godmode activate YOUR-LICENSE-KEY"
  }
else
  info "No license key provided — skipping activation"
  info "Activate later with: openclaw godmode activate YOUR-KEY"
  info "Or enter it during onboarding in the GodMode UI"
fi

# Step 7: AI Authentication
step 7 "Checking AI authentication"
if openclaw auth status 2>/dev/null | grep -qi "authenticated\|connected\|active"; then
  ok "Already authenticated with Claude"
else
  warn "AI authentication not configured"
  info "GodMode needs Claude authentication to work. Two options:"
  printf '\n'
  info "  Claude Pro/Max subscriber:  openclaw setup-token"
  info "  API key holder:             openclaw auth login"
  printf '\n'
  info "Run one of these commands after this installer finishes."
fi

# Step 8: Configure gateway
step 8 "Configuring gateway"
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

# Step 9: Start gateway
step 9 "Starting gateway"
if openclaw gateway status 2>/dev/null | grep -qi running; then
  info "Gateway already running — restarting with new config..."
  openclaw gateway restart 2>/dev/null && ok "Gateway restarted" || warn "Restart failed — try: openclaw gateway restart"
else
  # Start in background with nohup so it survives shell exit on VPS
  if [ "$IS_HEADLESS" = true ]; then
    nohup openclaw gateway start >/dev/null 2>&1 &
    sleep 2
    if openclaw gateway status 2>/dev/null | grep -qi running; then
      ok "Gateway started (background)"
    else
      # Try direct start
      openclaw gateway start 2>/dev/null && ok "Gateway started" || {
        warn "Could not start gateway automatically"
        info "Start manually: openclaw gateway start"
      }
    fi
  else
    openclaw gateway start 2>/dev/null && ok "Gateway started" || {
      warn "Could not start gateway automatically"
      info "Start manually: openclaw gateway start"
    }
  fi
fi

# Wait for gateway to be ready (up to 15 seconds)
READY=false
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if curl -sf "http://127.0.0.1:${GODMODE_PORT}/health" >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" = true ]; then
  ok "Gateway is ready on port $GODMODE_PORT"
else
  warn "Gateway did not respond on port $GODMODE_PORT within 15s"
  info "This is normal on first run — it may take a moment to initialize."
  info "Check status: openclaw gateway status"
  info "Start manually: openclaw gateway start"
fi

# ── Done ────────────────────────────────────────────────────────────────────

GODMODE_URL="http://127.0.0.1:${GODMODE_PORT}/godmode/onboarding"

printf '\n%s================================================%s\n' "$GRN$BLD" "$RST"
printf '%s  GodMode installed successfully!%s\n' "$GRN$BLD" "$RST"
printf '%s================================================%s\n' "$GRN$BLD" "$RST"
printf '\n'

if [ "$IS_HEADLESS" = true ]; then
  # VPS/headless-specific instructions
  printf '  %sNext steps for your server:%s\n\n' "$WHT$BLD" "$RST"

  # Check if openclaw will be found in a new shell
  NEEDS_SOURCE=false
  if [ ! -x "/usr/local/bin/openclaw" ] && [ ! -x "$HOME/.local/bin/openclaw" ]; then
    NEEDS_SOURCE=true
  fi

  if [ "$NEEDS_SOURCE" = true ]; then
    printf '  %s%s!! IMPORTANT — Run this first in your current shell: !!%s\n' "$YLW" "$BLD" "$RST"
    printf '  %ssource ~/.bashrc%s  %s(or: source ~/.profile)%s\n\n' "$WHT$BLD" "$RST" "$DIM" "$RST"
  fi

  STEP_NUM=1

  if [ -z "$LICENSE_KEY" ]; then
    printf '  %s%s.%s Activate your license:\n' "$CYN" "$STEP_NUM" "$RST"
    printf '     openclaw godmode activate GM-YOUR-KEY\n\n'
    STEP_NUM=$((STEP_NUM + 1))
  fi

  printf '  %s%s.%s Set up AI authentication:\n' "$CYN" "$STEP_NUM" "$RST"
  printf '     openclaw auth login    %s(API key)%s\n' "$DIM" "$RST"
  printf '     openclaw setup-token   %s(Claude Pro/Max)%s\n\n' "$DIM" "$RST"
  STEP_NUM=$((STEP_NUM + 1))

  printf '  %s%s.%s Access GodMode remotely:\n' "$CYN" "$STEP_NUM" "$RST"
  printf '     %sOption A — SSH tunnel (quick):%s\n' "$DIM" "$RST"
  printf '     ssh -L %s:localhost:%s user@your-server\n' "$GODMODE_PORT" "$GODMODE_PORT"
  printf '     Then open: %s%s%s\n\n' "$CYN" "$GODMODE_URL" "$RST"
  printf '     %sOption B — Tailscale (recommended for persistent access):%s\n' "$DIM" "$RST"
  printf '     curl -fsSL https://tailscale.com/install.sh | sh\n'
  printf '     tailscale up\n'
  printf '     Then open: http://<tailscale-ip>:%s/godmode/onboarding\n\n' "$GODMODE_PORT"
  STEP_NUM=$((STEP_NUM + 1))

  printf '  %s%s.%s Start the gateway (if not running):\n' "$CYN" "$STEP_NUM" "$RST"
  printf '     openclaw gateway start\n\n'
else
  # Desktop — open browser
  printf '  %sOpening GodMode...%s\n' "$WHT$BLD" "$RST"
  printf '    %s%s%s\n\n' "$CYN" "$GODMODE_URL" "$RST"
  sleep 1
  open_browser "$GODMODE_URL"
fi

printf '  %sRun this script again at any time — it is safe to re-run.%s\n' "$DIM" "$RST"
printf '  %sNeed help? https://lifeongodmode.com/support%s\n\n' "$DIM" "$RST"
