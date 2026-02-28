#!/usr/bin/env bash
# godmode-update-check.sh — Check for OpenClaw + GodMode plugin updates, upsert daily brief
#
# Usage:
#   ./scripts/godmode-update-check.sh              # Check + brief upsert
#   ./scripts/godmode-update-check.sh --quiet      # Machine-readable output
#
# Called by the "GodMode Upstream Check" cron at 9 AM daily.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VAULT_PATH="${OBSIDIAN_VAULT_PATH:-$HOME/Documents/VAULT}"
BRIEF_FOLDER="${DAILY_BRIEF_FOLDER:-01-Daily}"
TODAY=$(date +%Y-%m-%d)
BRIEF_FILE="$VAULT_PATH/$BRIEF_FOLDER/$TODAY.md"

QUIET=false
[[ "${1:-}" == "--quiet" ]] && QUIET=true

info()  { [[ "$QUIET" == true ]] || echo "[update-check] $1"; }

# ── Version checks ───────────────────────────────────────────────────

openclaw_version() {
    openclaw --version 2>/dev/null || echo "unknown"
}

npm_latest() {
    npm view "$1" version --userconfig "$(mktemp)" 2>/dev/null || echo ""
}

plugin_version() {
    node -e "try{console.log(require('$PROJECT_ROOT/package.json').version)}catch{console.log('unknown')}" 2>/dev/null || echo "unknown"
}

# ── Brief section upsert/remove ──────────────────────────────────────

upsert_brief_section() {
    local heading="$1" content="$2"
    [[ ! -f "$BRIEF_FILE" ]] && return 0

    if grep -q "^## $heading" "$BRIEF_FILE" 2>/dev/null; then
        python3 -c "
import re, sys
h, c = sys.argv[1], sys.argv[2]
with open(sys.argv[3], 'r') as f: text = f.read()
p = r'(## ' + re.escape(h) + r').*?(?=\n## |\Z)'
new = re.sub(p, '## ' + h + '\n\n' + c + '\n', text, count=1, flags=re.DOTALL)
with open(sys.argv[3], 'w') as f: f.write(new)
" "$heading" "$content" "$BRIEF_FILE"
    else
        python3 -c "
import sys
h, c = sys.argv[1], sys.argv[2]
with open(sys.argv[3], 'r') as f: text = f.read()
s = '\n---\n\n## ' + h + '\n\n' + c + '\n'
if '## Evening Reflection' in text:
    text = text.replace('## Evening Reflection', s + '\n## Evening Reflection')
else:
    text = text.rstrip() + s
with open(sys.argv[3], 'w') as f: f.write(text)
" "$heading" "$content" "$BRIEF_FILE"
    fi
}

remove_brief_section() {
    local heading="$1"
    [[ ! -f "$BRIEF_FILE" ]] && return 0
    grep -q "^## $heading" "$BRIEF_FILE" 2>/dev/null || return 0
    python3 -c "
import re, sys
h = sys.argv[1]
with open(sys.argv[2], 'r') as f: text = f.read()
new = re.sub(r'\n---\n\n## ' + re.escape(h) + r'.*?(?=\n---\n|\n## |\Z)', '', text, count=1, flags=re.DOTALL)
with open(sys.argv[2], 'w') as f: f.write(new)
" "$heading" "$BRIEF_FILE"
}

# ── Main ─────────────────────────────────────────────────────────────

main() {
    local current oc_latest plugin_current plugin_latest update_available=false

    current=$(openclaw_version)
    oc_latest=$(npm_latest openclaw)
    plugin_current=$(plugin_version)
    plugin_latest=$(npm_latest @godmode-team/godmode)

    info "OpenClaw: v$current (latest: v${oc_latest:-unknown})"
    info "GodMode:  v$plugin_current (latest: v${plugin_latest:-unknown})"

    local oc_update=false plugin_update=false

    if [[ -n "$oc_latest" && "$oc_latest" != "$current" ]]; then
        oc_update=true
        update_available=true
    fi

    if [[ -n "$plugin_latest" && "$plugin_latest" != "$plugin_current" ]]; then
        plugin_update=true
        update_available=true
    fi

    if [[ "$QUIET" == true ]]; then
        if [[ "$update_available" == true ]]; then
            echo "update|oc:$current->$oc_latest|gm:$plugin_current->$plugin_latest"
        else
            echo "ok"
        fi
        return 0
    fi

    if [[ "$update_available" == true ]]; then
        local brief_tmp
        brief_tmp=$(mktemp)
        [[ "$oc_update" == true ]] && echo "**OpenClaw update:** v$current -> v$oc_latest" >> "$brief_tmp"
        [[ "$plugin_update" == true ]] && echo "**GodMode update:** v$plugin_current -> v$plugin_latest" >> "$brief_tmp"
        echo '' >> "$brief_tmp"
        echo '> Run `openclaw update` or tell Atlas: "update yourself"' >> "$brief_tmp"

        local brief_content
        brief_content=$(cat "$brief_tmp")
        rm -f "$brief_tmp"

        upsert_brief_section "System Updates" "$brief_content"
        echo ""
        echo "UPDATE AVAILABLE — daily brief updated with reminder."
    else
        info "Up to date"
        remove_brief_section "System Updates"
        echo "OK: OpenClaw v$current, GodMode v$plugin_current"
    fi
}

main
