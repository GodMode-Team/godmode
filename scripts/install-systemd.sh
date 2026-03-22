#!/bin/sh

set -eu

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

info() {
  printf '%s\n' "$1"
}

escape_sed_replacement() {
  printf '%s' "$1" | sed 's/[\\/&|]/\\&/g'
}

run_systemctl_user() {
  if ! systemctl --user "$@"; then
    fail "systemctl --user $* failed. Make sure your Linux user has an active systemd user session, then retry."
  fi
}

if [ "$(uname -s)" != "Linux" ]; then
  fail "This installer only supports Linux systemd user services."
fi

if [ -z "${HOME:-}" ]; then
  fail "HOME is not set."
fi

if ! command -v systemctl >/dev/null 2>&1; then
  fail "systemctl is required but was not found."
fi

if ! command -v openclaw >/dev/null 2>&1; then
  fail "openclaw is not on PATH. Install the OpenClaw CLI first."
fi

if ! command -v node >/dev/null 2>&1; then
  fail "node is not on PATH. Install Node.js 22+ first."
fi

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TEMPLATE_PATH="$SCRIPT_DIR/godmode-gateway.service"
SERVICE_NAME="godmode-gateway.service"
TARGET_DIR="$HOME/.config/systemd/user"
TARGET_PATH="$TARGET_DIR/$SERVICE_NAME"

if [ ! -f "$TEMPLATE_PATH" ]; then
  fail "Service template not found at $TEMPLATE_PATH"
fi

OPENCLAW_BIN=$(command -v openclaw)
NODE_BIN=$(command -v node)
OPENCLAW_BIN_DIR=$(dirname "$OPENCLAW_BIN")
NODE_BIN_DIR=$(dirname "$NODE_BIN")
PATH_VALUE="$OPENCLAW_BIN_DIR:$NODE_BIN_DIR:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin${PATH:+:$PATH}"

export GODMODE_HOME_DIR="$HOME"
export GODMODE_PATH="$PATH_VALUE"
export GODMODE_WORKING_DIRECTORY="$HOME"
export GODMODE_OPENCLAW_BIN="$OPENCLAW_BIN"

mkdir -p "$TARGET_DIR"

if command -v envsubst >/dev/null 2>&1; then
  envsubst '${GODMODE_HOME_DIR} ${GODMODE_PATH} ${GODMODE_WORKING_DIRECTORY} ${GODMODE_OPENCLAW_BIN}' < "$TEMPLATE_PATH" > "$TARGET_PATH"
else
  HOME_ESCAPED=$(escape_sed_replacement "$GODMODE_HOME_DIR")
  PATH_ESCAPED=$(escape_sed_replacement "$GODMODE_PATH")
  WORKDIR_ESCAPED=$(escape_sed_replacement "$GODMODE_WORKING_DIRECTORY")
  OPENCLAW_ESCAPED=$(escape_sed_replacement "$GODMODE_OPENCLAW_BIN")

  sed \
    -e "s|\${GODMODE_HOME_DIR}|$HOME_ESCAPED|g" \
    -e "s|\${GODMODE_PATH}|$PATH_ESCAPED|g" \
    -e "s|\${GODMODE_WORKING_DIRECTORY}|$WORKDIR_ESCAPED|g" \
    -e "s|\${GODMODE_OPENCLAW_BIN}|$OPENCLAW_ESCAPED|g" \
    "$TEMPLATE_PATH" > "$TARGET_PATH"
fi

chmod 0644 "$TARGET_PATH"

info "Installed $SERVICE_NAME to $TARGET_PATH"

run_systemctl_user daemon-reload
run_systemctl_user enable --now "$SERVICE_NAME"

printf '\n'
systemctl --user status --no-pager --full "$SERVICE_NAME" || true

if command -v loginctl >/dev/null 2>&1; then
  LINGER=$(loginctl show-user "${USER:-$(id -un)}" -p Linger --value 2>/dev/null || true)
  if [ "$LINGER" = "no" ]; then
    printf '\nNote: enable lingering to keep %s alive after logout and on reboot:\n' "$SERVICE_NAME"
    printf '  sudo loginctl enable-linger %s\n' "${USER:-$(id -un)}"
  fi
fi
