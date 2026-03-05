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
      info "GodMode supports macOS and Linux with this script."
      info "Windows users: irm https://lifeongodmode.com/install.ps1 | iex"
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

# ── Symlink a binary into /usr/local/bin ────────────────────────────────────
# When Node is installed via fnm/nvm/direct-download, binaries live in
# non-standard directories. Symlinking to /usr/local/bin makes them
# available immediately in ANY shell — no sourcing .bashrc needed.

symlink_to_system_bin() {
  BIN_NAME="$1"
  BIN_PATH="$2"  # full path to the actual binary

  if [ -z "$BIN_PATH" ] || [ ! -x "$BIN_PATH" ]; then
    return 1
  fi

  # Already in a system bin directory — nothing to do
  case "$BIN_PATH" in
    /usr/local/bin/*|/usr/bin/*) return 0 ;;
  esac

  # Ensure /usr/local/bin exists
  if [ ! -d "/usr/local/bin" ]; then
    mkdir -p /usr/local/bin 2>/dev/null || sudo mkdir -p /usr/local/bin 2>/dev/null || true
  fi

  # Try to symlink (as current user, then sudo)
  if [ -d "/usr/local/bin" ]; then
    if [ -w "/usr/local/bin" ]; then
      ln -sf "$BIN_PATH" "/usr/local/bin/$BIN_NAME" 2>/dev/null && return 0
    elif has sudo; then
      sudo ln -sf "$BIN_PATH" "/usr/local/bin/$BIN_NAME" 2>/dev/null && return 0
    fi
  fi

  # Fallback: ~/.local/bin
  mkdir -p "$HOME/.local/bin" 2>/dev/null
  ln -sf "$BIN_PATH" "$HOME/.local/bin/$BIN_NAME" 2>/dev/null && {
    export PATH="$HOME/.local/bin:$PATH"
    return 0
  }

  return 1
}

# Symlink node, npm, npx, and openclaw so they survive the subshell exit
persist_all_binaries() {
  LINKED=""

  # Find the bin directory where node lives
  NODE_BIN_DIR=""
  if has node; then
    NODE_REAL="$(command -v node 2>/dev/null)"
    NODE_BIN_DIR="$(dirname "$NODE_REAL")"
  fi

  # Symlink node + npm + npx (they share the same bin dir)
  for bin in node npm npx; do
    BIN_REAL=""
    if has "$bin"; then
      BIN_REAL="$(command -v "$bin" 2>/dev/null)"
    elif [ -n "$NODE_BIN_DIR" ] && [ -x "$NODE_BIN_DIR/$bin" ]; then
      BIN_REAL="$NODE_BIN_DIR/$bin"
    fi

    if [ -n "$BIN_REAL" ]; then
      symlink_to_system_bin "$bin" "$BIN_REAL" && LINKED="$LINKED $bin"
    fi
  done

  # Symlink openclaw
  OC_REAL=""
  if has openclaw; then
    OC_REAL="$(command -v openclaw 2>/dev/null)"
  else
    # Search known npm global bin locations
    for candidate in \
      "$(npm config get prefix 2>/dev/null)/bin/openclaw" \
      "$HOME/.local/share/fnm/aliases/default/bin/openclaw" \
      "$HOME/.local/node/bin/openclaw"; do
      if [ -n "$candidate" ] && [ -x "$candidate" ]; then
        OC_REAL="$candidate"
        break
      fi
    done
  fi

  if [ -n "$OC_REAL" ]; then
    symlink_to_system_bin "openclaw" "$OC_REAL" && LINKED="$LINKED openclaw"
  fi

  if [ -n "$LINKED" ]; then
    ok "Binaries linked to /usr/local/bin:$LINKED"
  fi

  # Also ensure shell profile has the npm global bin for future npm installs
  NPM_BIN=""
  if has npm; then
    NPM_BIN="$(npm config get prefix 2>/dev/null)/bin"
  fi

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

# ── Install system dependencies (Linux) ─────────────────────────────────────

install_system_deps() {
  if [ "$PLATFORM" != "linux" ]; then
    ok "System dependencies present"
    return 0
  fi

  MISSING=""
  for dep in curl unzip tar git xz-utils; do
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

  # Map package names for non-apt package managers (xz-utils is Debian-specific)
  PKG_MISSING="$MISSING"
  NON_APT_MISSING="$(echo "$MISSING" | sed 's/xz-utils/xz/g')"

  if has apt-get; then
    apt-get update -qq >/dev/null 2>&1 || true
    # shellcheck disable=SC2086
    apt-get install -y -qq $PKG_MISSING >/dev/null 2>&1 && ok "Installed:$PKG_MISSING" || {
      warn "Could not install$PKG_MISSING via apt-get (try running as root)"
      info "Run: sudo apt-get install -y$PKG_MISSING"
    }
  elif has yum; then
    # shellcheck disable=SC2086
    yum install -y -q $NON_APT_MISSING >/dev/null 2>&1 && ok "Installed:$NON_APT_MISSING" || {
      warn "Could not install$NON_APT_MISSING via yum (try running as root)"
    }
  elif has dnf; then
    # shellcheck disable=SC2086
    dnf install -y -q $NON_APT_MISSING >/dev/null 2>&1 && ok "Installed:$NON_APT_MISSING" || {
      warn "Could not install$NON_APT_MISSING via dnf (try running as root)"
    }
  elif has apk; then
    # shellcheck disable=SC2086
    apk add --quiet $NON_APT_MISSING >/dev/null 2>&1 && ok "Installed:$NON_APT_MISSING" || {
      warn "Could not install$NON_APT_MISSING via apk"
    }
  elif has pacman; then
    # shellcheck disable=SC2086
    pacman -S --noconfirm $NON_APT_MISSING >/dev/null 2>&1 && ok "Installed:$NON_APT_MISSING" || {
      warn "Could not install$NON_APT_MISSING via pacman"
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
# Use existing version managers if present, otherwise direct binary download.
# We do NOT install fnm/nvm from scratch — direct download is simpler and
# puts binaries in a predictable location we can symlink.

install_node() {
  # Try existing fnm (already installed by user)
  if has fnm; then
    ok "fnm detected — installing Node.js 22"
    fnm install 22
    fnm use 22
    eval "$(fnm env)" 2>/dev/null || true
    return 0
  fi

  # Try existing nvm (shell function — source it first)
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
  fi
  if has nvm; then
    ok "nvm detected — installing Node.js 22"
    nvm install 22
    nvm use 22
    return 0
  fi

  # Try brew on macOS
  if [ "$PLATFORM" = "macos" ] && has brew; then
    info "Installing Node.js via Homebrew..."
    brew install node@22 2>/dev/null && {
      brew link --overwrite node@22 2>/dev/null || true
      return 0
    }
  fi

  # Direct binary download — predictable location, easy to symlink
  info "Downloading Node.js directly..."
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

  NODE_DIR="$HOME/.local/node"

  # Prefer .tar.xz (smaller) but fall back to .tar.gz if xz not available
  if has xz || has xzcat; then
    NODE_URL="https://nodejs.org/dist/${NODE_VER}/${NODE_DIST}.tar.xz"
    NODE_ARCHIVE="/tmp/node.tar.xz"
    TAR_FLAG="-xJf"
  else
    NODE_URL="https://nodejs.org/dist/${NODE_VER}/${NODE_DIST}.tar.gz"
    NODE_ARCHIVE="/tmp/node.tar.gz"
    TAR_FLAG="-xzf"
  fi

  info "Downloading Node.js $NODE_VER..."

  mkdir -p "$HOME/.local"

  if has curl; then
    curl -fsSL "$NODE_URL" -o "$NODE_ARCHIVE"
  elif has wget; then
    wget -q "$NODE_URL" -O "$NODE_ARCHIVE"
  else
    fail "Neither curl nor wget found — cannot download Node.js"
    exit 1
  fi

  # Extract
  mkdir -p "$NODE_DIR"
  tar $TAR_FLAG "$NODE_ARCHIVE" -C "$NODE_DIR" --strip-components=1
  rm -f "$NODE_ARCHIVE"

  export PATH="$NODE_DIR/bin:$PATH"

  if has node; then
    ok "Node.js $(node --version) installed to $NODE_DIR"

    # Add to shell profile so it persists
    PROFILE_FILE=""
    if [ -f "$HOME/.zshrc" ]; then
      PROFILE_FILE="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
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

# Symlink node, npm, and openclaw into /usr/local/bin so they work
# in the user's shell immediately (without sourcing .bashrc)
persist_all_binaries

# Step 5: GodMode plugin
step 5 "Installing GodMode plugin"
# Stop gateway FIRST if running (so we don't rm files it's using)
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"
if curl -sf "http://127.0.0.1:${GODMODE_PORT}/health" >/dev/null 2>&1; then
  info "Stopping running gateway for upgrade..."
  openclaw gateway stop >/dev/null 2>&1 || true
  sleep 1
  if has lsof; then
    GATEWAY_PID="$(lsof -ti :${GODMODE_PORT} 2>/dev/null || true)"
    if [ -n "$GATEWAY_PID" ]; then
      kill "$GATEWAY_PID" 2>/dev/null || true
      sleep 1
    fi
  fi
fi
# Remove old plugin if it exists (openclaw plugins install won't overwrite)
if [ -d "$STATE_DIR/extensions/godmode" ]; then
  rm -rf "$STATE_DIR/extensions/godmode"
  info "Removed old plugin version"
fi
info "Installing @godmode-team/godmode (latest)..."
openclaw plugins install @godmode-team/godmode || {
  fail "GodMode plugin install failed"
  info "Try: openclaw plugins install @godmode-team/godmode"
  exit 1
}
ok "GodMode plugin installed (latest)"

# Step 6: GodMode account
step 6 "GodMode account"
AUTH_FILE="$HOME/.openclaw/godmode-auth.json"
if [ -f "$AUTH_FILE" ]; then
  ok "Already logged in"
elif [ -n "$LICENSE_KEY" ] && echo "$LICENSE_KEY" | grep -q "^GM-DEV-"; then
  # Dev key — write to config for backward compat
  STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"
  CONFIG_FILE="$STATE_DIR/openclaw.json"
  LICENSE_KEY="$LICENSE_KEY" CONFIG_FILE="$CONFIG_FILE" node -e "
    const fs = require('fs');
    const p = process.env.CONFIG_FILE;
    let c = {};
    try { c = JSON.parse(fs.readFileSync(p, 'utf-8')); } catch {}
    if (!c.plugins) c.plugins = {};
    if (!c.plugins.entries) c.plugins.entries = {};
    if (!c.plugins.entries.godmode) c.plugins.entries.godmode = {};
    if (!c.plugins.entries.godmode.config) c.plugins.entries.godmode.config = {};
    c.plugins.entries.godmode.config.licenseKey = process.env.LICENSE_KEY;
    fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n');
  " 2>/dev/null && ok "Dev key saved: $LICENSE_KEY" || {
    warn "Could not write dev key to config"
  }
else
  info "Set up your GodMode account:"
  info "  Have a license key?  openclaw godmode activate YOUR-KEY"
  info "  Need an account?    https://lifeongodmode.com/pricing"
fi

# Step 7: AI Model — bring your own
step 7 "Checking AI model"
AI_FOUND=false
if openclaw auth status 2>/dev/null | grep -qi "authenticated\|connected\|active"; then
  ok "Already authenticated"
  AI_FOUND=true
fi
# Check for known provider API keys in environment
for _envcheck in \
  "ANTHROPIC_API_KEY:Anthropic (Claude)" \
  "OPENAI_API_KEY:OpenAI (GPT)" \
  "GEMINI_API_KEY:Google (Gemini)" \
  "OPENROUTER_API_KEY:OpenRouter" \
  "XAI_API_KEY:xAI (Grok)" \
  "MISTRAL_API_KEY:Mistral" \
  "TOGETHER_API_KEY:Together AI"; do
  _varname="${_envcheck%%:*}"
  _label="${_envcheck#*:}"
  eval "_val=\"\${${_varname}:-}\""
  if [ -n "$_val" ]; then
    ok "$_label key found ($_varname)"
    AI_FOUND=true
  fi
done

if [ "$AI_FOUND" = false ]; then
  warn "No AI provider configured"
  info "GodMode works with any major LLM. Pick how you want to connect:"
  printf '\n'

  # ── Tier 1: Anthropic API key ──
  printf '  %s  1  Anthropic API Key (best agent quality)%s\n' "$GRN$BLD" "$RST"
  printf '  %s     export ANTHROPIC_API_KEY="sk-ant-..."%s\n' "$WHT" "$RST"
  printf '  %s     Get key: console.anthropic.com/settings/keys%s\n' "$DIM" "$RST"
  printf '  %s     Official, stable, pay-per-use. Best quality, but costs add up with heavy use.%s\n\n' "$DIM" "$RST"

  # ── Tier 2: OpenAI subscription ──
  printf '  %s  2  OpenAI Subscription (official, cost-effective)%s\n' "$GRN$BLD" "$RST"
  printf '  %s     openclaw models auth login  %s-->  select OpenAI%s\n' "$WHT" "$DIM" "$RST"
  printf '  %s     Uses your ChatGPT Plus ($20/mo), Team ($30/mo), or Pro ($200/mo) subscription.%s\n' "$DIM" "$RST"
  printf '  %s     Official and stable. Great quality at a predictable monthly cost.%s\n\n' "$DIM" "$RST"

  # ── Tier 3: Claude subscription token ──
  printf '  %s  3  Claude Subscription Token (community-supported)%s\n' "$YLW$BLD" "$RST"
  printf '  %s     openclaw models auth setup-token%s\n' "$WHT" "$RST"
  printf '  %s     Then in a separate terminal:  claude setup-token%s\n' "$WHT" "$RST"
  printf '  %s     Uses your Claude Pro ($20/mo) or Max ($100-200/mo) subscription.%s\n' "$DIM" "$RST"
  printf '  %s     Not officially sanctioned by Anthropic — may need periodic re-auth.%s\n\n' "$DIM" "$RST"

  # ── Other providers ──
  printf '  %s  Other providers (API key — add to ~/.bashrc):%s\n' "$DIM" "$RST"
  printf '  %s  4  Google Gemini          GEMINI_API_KEY       aistudio.google.com/apikey%s\n' "$DIM" "$RST"
  printf '  %s  5  OpenRouter (100+ LLMs) OPENROUTER_API_KEY   openrouter.ai/keys%s\n' "$DIM" "$RST"
  printf '  %s  6  xAI Grok               XAI_API_KEY          console.x.ai%s\n' "$DIM" "$RST"
  printf '  %s  7  Mistral                MISTRAL_API_KEY      console.mistral.ai/api-keys%s\n' "$DIM" "$RST"
  printf '  %s  8  Ollama (free, local)   no key needed        ollama.com%s\n' "$DIM" "$RST"
  printf '\n'

  info "For option 1 and 4-8, add the key to your shell profile:"
  printf '  %s  echo '\''export ANTHROPIC_API_KEY="sk-ant-..."'\'' >> ~/.bashrc && source ~/.bashrc%s\n' "$WHT" "$RST"
  printf '\n'
fi

# Step 8: Configure gateway
step 8 "Configuring gateway"
openclaw config set gateway.mode local 2>/dev/null && ok "gateway.mode = local" || warn "Could not set gateway.mode"
openclaw config set gateway.controlUi.enabled true 2>/dev/null && ok "gateway.controlUi.enabled = true" || warn "Could not set controlUi"
openclaw config set plugins.enabled true 2>/dev/null && ok "plugins.enabled = true" || warn "Could not set plugins.enabled"

# VPS / headless: configure network binding so remote access works
TAILSCALE_CONFIGURED=false
if [ "$IS_HEADLESS" = true ]; then
  # Allow insecure auth — plain HTTP from non-localhost can't use crypto.subtle
  # for device identity, so the gateway must accept token-only auth
  openclaw config set gateway.controlUi.allowInsecureAuth true 2>/dev/null && ok "gateway.controlUi.allowInsecureAuth = true (plain HTTP)" || true

  # Detect Tailscale
  TAILSCALE_FQDN=""
  if has tailscale && tailscale status >/dev/null 2>&1; then
    TAILSCALE_IP="$(tailscale ip -4 2>/dev/null || true)"
    if [ -n "$TAILSCALE_IP" ]; then
      ok "Tailscale detected — IP: $TAILSCALE_IP"

      # Get the full tailnet FQDN (e.g., metatron-3.taild13d36.ts.net)
      TAILSCALE_FQDN="$(tailscale status --json 2>/dev/null | node -e '
        try {
          const d = JSON.parse(require("fs").readFileSync("/dev/stdin", "utf-8"));
          const name = (d.Self?.DNSName || "").replace(/\.$/, "");
          process.stdout.write(name);
        } catch {}
      ' 2>/dev/null || true)"

      # Provision HTTPS cert early — gives CT logs time to propagate during rest of install
      if [ -n "$TAILSCALE_FQDN" ]; then
        tailscale cert "$TAILSCALE_FQDN" 2>/dev/null && ok "TLS certificate provisioned for $TAILSCALE_FQDN" || true
      fi

      # Use tailscale serve mode — exposes gateway to tailnet securely via HTTPS
      openclaw config set gateway.tailscale.mode serve 2>/dev/null && ok "gateway.tailscale.mode = serve" || warn "Could not set tailscale mode"
      openclaw config set gateway.auth.allowTailscale true 2>/dev/null || true
      # Bind to LAN so Tailscale serve can reach the gateway
      openclaw config set gateway.bind lan 2>/dev/null && ok "gateway.bind = lan (Tailscale + SSH)" || true

      # Allow origins for WebSocket connections (both HTTP Tailscale IP and HTTPS tailnet domain)
      if [ -n "$TAILSCALE_FQDN" ]; then
        openclaw config set gateway.controlUi.allowedOrigins "[\"http://${TAILSCALE_IP}:${GODMODE_PORT}\", \"https://${TAILSCALE_FQDN}\"]" 2>/dev/null && ok "gateway.controlUi.allowedOrigins includes Tailscale HTTPS + IP" || true
      else
        openclaw config set gateway.controlUi.allowedOrigins "[\"http://${TAILSCALE_IP}:${GODMODE_PORT}\"]" 2>/dev/null && ok "gateway.controlUi.allowedOrigins includes Tailscale IP" || true
      fi

      # Set up tailscale serve — HTTPS reverse proxy on port 443 → gateway
      tailscale serve --bg "${GODMODE_PORT}" 2>/dev/null && ok "Tailscale HTTPS serve active (port 443 → ${GODMODE_PORT})" || warn "Could not start tailscale serve — you may need to enable HTTPS in admin.tailscale.com → DNS"

      TAILSCALE_CONFIGURED=true
    fi
  else
    # No Tailscale — still bind to LAN for SSH tunnel access
    openclaw config set gateway.bind lan 2>/dev/null && ok "gateway.bind = lan (for SSH tunnel access)" || true
    info "Install Tailscale for easy remote access: curl -fsSL https://tailscale.com/install.sh | sh"
  fi
fi

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

# Gateway was already stopped in step 5 if it was running.
# Start gateway — try "gateway start" first (uses systemd/launchd).
# Don't trust exit codes — check if the health endpoint actually responds.
# If not, fall back to "gateway run" which works everywhere.
openclaw gateway start >/dev/null 2>&1 || true

# Give gateway start a few seconds to spin up
sleep 5

if ! curl -sf "http://127.0.0.1:${GODMODE_PORT}/health" >/dev/null 2>&1; then
  # gateway start didn't work — use direct run mode (works on VPS, root, etc.)
  nohup openclaw gateway run >/dev/null 2>&1 &
fi

# Wait for gateway to be ready (up to 25 seconds)
READY=false
for _wait in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25; do
  if curl -sf "http://127.0.0.1:${GODMODE_PORT}/health" >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" = true ]; then
  ok "Gateway is running on port $GODMODE_PORT"
else
  warn "Gateway is still starting up — this can take a moment on first run"
fi

# ── Done ────────────────────────────────────────────────────────────────────

GODMODE_URL="http://127.0.0.1:${GODMODE_PORT}/godmode/onboarding"

# Extract gateway token for VPS access URLs
GATEWAY_TOKEN=""
if [ -f "$CONFIG_FILE" ]; then
  GATEWAY_TOKEN="$(node -e "
    try {
      const c = JSON.parse(require('fs').readFileSync('$CONFIG_FILE', 'utf-8'));
      const t = c.gateway?.auth?.token || c.gateway?.token || '';
      process.stdout.write(t);
    } catch {}
  " 2>/dev/null || true)"
fi

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

  if [ ! -f "$AUTH_FILE" ]; then
    printf '  %s%s.%s GodMode account:\n' "$CYN" "$STEP_NUM" "$RST"
    printf '     openclaw godmode activate YOUR-KEY   %s# if you have a license key%s\n' "$DIM" "$RST"
    printf '     %sSign up at: https://lifeongodmode.com/pricing%s\n\n' "$DIM" "$RST"
    STEP_NUM=$((STEP_NUM + 1))
  fi

  if [ "$AI_FOUND" = false ]; then
    printf '  %s%s.%s Connect an AI model:\n' "$CYN" "$STEP_NUM" "$RST"
    printf '     %sA) Anthropic API key (best quality, pay-per-use):%s\n' "$GRN" "$RST"
    printf '        export ANTHROPIC_API_KEY="sk-ant-..."  %s# add to ~/.bashrc%s\n\n' "$DIM" "$RST"
    printf '     %sB) OpenAI subscription (official, cost-effective):%s\n' "$GRN" "$RST"
    printf '        openclaw models auth login  %s# select OpenAI, uses ChatGPT sub%s\n\n' "$DIM" "$RST"
    printf '     %sC) Claude subscription token (community-supported):%s\n' "$YLW" "$RST"
    printf '        openclaw models auth setup-token  %s# then: claude setup-token%s\n\n' "$DIM" "$RST"
    STEP_NUM=$((STEP_NUM + 1))
  fi

  if [ "$TAILSCALE_CONFIGURED" = true ]; then
    # Tailscale configured — show HTTPS URL as primary, HTTP+token as fallback
    printf '  %s%s.%s Access GodMode via Tailscale:\n' "$CYN" "$STEP_NUM" "$RST"
    if [ -n "$TAILSCALE_FQDN" ]; then
      printf '     %s%shttps://%s/godmode/onboarding%s  %s(recommended)%s\n' "  " "$CYN" "$TAILSCALE_FQDN" "$RST" "$GRN" "$RST"
      printf '     %sUses HTTPS — secure, no token needed.%s\n' "     $DIM" "$RST"
      if [ -n "$GATEWAY_TOKEN" ]; then
        printf '     %sFallback (if HTTPS cert not ready): http://%s:%s/godmode/onboarding?token=%s%s\n' "     $DIM" "$TAILSCALE_IP" "$GODMODE_PORT" "$GATEWAY_TOKEN" "$RST"
      fi
    elif [ -n "$GATEWAY_TOKEN" ]; then
      printf '     %s%shttp://%s:%s/godmode/onboarding?token=%s%s\n' "  " "$CYN" "$TAILSCALE_IP" "$GODMODE_PORT" "$GATEWAY_TOKEN" "$RST"
    else
      printf '     %s%shttp://%s:%s/godmode/onboarding%s\n' "  " "$CYN" "$TAILSCALE_IP" "$GODMODE_PORT" "$RST"
    fi
    printf '\n'
    STEP_NUM=$((STEP_NUM + 1))
  else
    printf '  %s%s.%s Access GodMode remotely:\n' "$CYN" "$STEP_NUM" "$RST"
    printf '     %sOption A — Tailscale (recommended):%s\n' "$WHT$BLD" "$RST"
    printf '     curl -fsSL https://tailscale.com/install.sh | sh\n'
    printf '     tailscale up\n'
    printf '     %sThen re-run this installer to auto-configure Tailscale.%s\n\n' "$DIM" "$RST"
    printf '     %sOption B — SSH tunnel (quick):%s\n' "$DIM" "$RST"
    printf '     ssh -L %s:localhost:%s user@your-server\n' "$GODMODE_PORT" "$GODMODE_PORT"
    printf '     Then open: %s%s%s\n\n' "$CYN" "$GODMODE_URL" "$RST"
    STEP_NUM=$((STEP_NUM + 1))
  fi

  printf '  %s%s.%s Restart gateway (if you changed config above):\n' "$CYN" "$STEP_NUM" "$RST"
  printf '     pkill -f "openclaw gateway" 2>/dev/null; nohup openclaw gateway run >/dev/null 2>&1 &\n\n'
else
  # Desktop — open browser
  printf '  %sOpening GodMode...%s\n' "$WHT$BLD" "$RST"
  printf '    %s%s%s\n\n' "$CYN" "$GODMODE_URL" "$RST"
  sleep 1
  open_browser "$GODMODE_URL"
fi

printf '  %sRun this script again at any time — it is safe to re-run.%s\n' "$DIM" "$RST"
printf '  %sNeed help? https://lifeongodmode.com/support%s\n\n' "$DIM" "$RST"
