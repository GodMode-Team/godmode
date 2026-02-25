#!/usr/bin/env bash
# godmode-update-check.sh — Check for OpenClaw updates, upsert daily brief, optionally auto-prepare
#
# Usage:
#   ./scripts/godmode-update-check.sh              # Check + brief upsert only
#   ./scripts/godmode-update-check.sh --prepare    # Also pull + build if safe (no dirty tree, no active sessions)
#   ./scripts/godmode-update-check.sh --quiet      # Machine-readable: prints "update|<current>|<latest>" or "ok"
#
# Called by the "GodMode Upstream Check" cron at 9 AM daily.
# Also safe to run manually or from other scripts.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VAULT_PATH="${OBSIDIAN_VAULT_PATH:-/Users/calebhodges/Documents/VAULT}"
BRIEF_FOLDER="${DAILY_BRIEF_FOLDER:-01-Daily}"
TODAY=$(date +%Y-%m-%d)
BRIEF_FILE="$VAULT_PATH/$BRIEF_FOLDER/$TODAY.md"

PREPARE=false
QUIET=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --prepare) PREPARE=true; shift ;;
        --quiet)   QUIET=true; shift ;;
        *)         shift ;;
    esac
done

# ── Helpers ──────────────────────────────────────────────────────────────

info()  { [[ "$QUIET" == true ]] || echo "[update-check] $1"; }
warn()  { [[ "$QUIET" == true ]] || echo "[update-check] ⚠ $1"; }

# Get local version from package.json
local_version() {
    node -e "console.log(require('$PROJECT_ROOT/package.json').version)" 2>/dev/null || echo "unknown"
}

# Get latest npm version
npm_latest_version() {
    npm view openclaw version --userconfig "$(mktemp)" 2>/dev/null || echo ""
}

# Get git upstream status — checks both origin and upstream remotes
git_upstream_status() {
    cd "$PROJECT_ROOT"
    local behind=0

    # Try upstream remote first (canonical openclaw repo)
    if [[ "$(git remote 2>/dev/null)" == *upstream* ]]; then
        git fetch upstream main --quiet 2>/dev/null || true
        behind=$(git rev-list HEAD..upstream/main --count 2>/dev/null || echo "0")
    fi

    # Also check origin if upstream didn't show anything
    if [[ "$behind" -eq 0 ]]; then
        git fetch origin main --quiet 2>/dev/null || return 1
        behind=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")
    fi

    echo "$behind"
}

# Upsert a ## section in the daily brief
# Usage: upsert_brief_section "Section Name" "content"
upsert_brief_section() {
    local heading="$1"
    local content="$2"

    if [[ ! -f "$BRIEF_FILE" ]]; then
        info "No daily brief file at $BRIEF_FILE — skipping brief upsert"
        return 0
    fi

    # Check if section already exists
    if grep -q "^## $heading" "$BRIEF_FILE" 2>/dev/null; then
        # Replace existing section (up to the next ## or end of file)
        python3 -c "
import re, sys
heading = sys.argv[1]
content = sys.argv[2]
with open(sys.argv[3], 'r') as f:
    text = f.read()
pattern = r'(## ' + re.escape(heading) + r').*?(?=\n## |\Z)'
replacement = '## ' + heading + '\n\n' + content + '\n'
new_text = re.sub(pattern, replacement, text, count=1, flags=re.DOTALL)
with open(sys.argv[3], 'w') as f:
    f.write(new_text)
" "$heading" "$content" "$BRIEF_FILE"
        info "Updated ## $heading in daily brief"
    else
        # Append before the last --- or at the end
        python3 -c "
import sys
heading = sys.argv[1]
content = sys.argv[2]
with open(sys.argv[3], 'r') as f:
    text = f.read()
section = '\n---\n\n## ' + heading + '\n\n' + content + '\n'
# Insert before Evening Reflection if it exists, otherwise append
if '## Evening Reflection' in text:
    text = text.replace('## Evening Reflection', section + '\n## Evening Reflection')
else:
    text = text.rstrip() + section
with open(sys.argv[3], 'w') as f:
    f.write(text)
" "$heading" "$content" "$BRIEF_FILE"
        info "Added ## $heading to daily brief"
    fi
}

# Remove a ## section from the daily brief
remove_brief_section() {
    local heading="$1"

    if [[ ! -f "$BRIEF_FILE" ]]; then
        return 0
    fi

    if grep -q "^## $heading" "$BRIEF_FILE" 2>/dev/null; then
        python3 -c "
import re, sys
heading = sys.argv[1]
with open(sys.argv[2], 'r') as f:
    text = f.read()
pattern = r'\n---\n\n## ' + re.escape(heading) + r'.*?(?=\n---\n|\n## |\Z)'
new_text = re.sub(pattern, '', text, count=1, flags=re.DOTALL)
with open(sys.argv[2], 'w') as f:
    f.write(new_text)
" "$heading" "$BRIEF_FILE"
        info "Removed ## $heading from daily brief"
    fi
}

# ── Main ─────────────────────────────────────────────────────────────────

main() {
    local current latest behind update_available=false npm_update=false git_update=false

    current=$(local_version)
    latest=$(npm_latest_version)
    behind=$(git_upstream_status || echo "0")

    info "Local: v$current | npm latest: v${latest:-unknown} | git commits behind: $behind"

    # Check npm version
    if [[ -n "$latest" && "$latest" != "$current" ]]; then
        # Simple string comparison — works for YYYY.M.D format
        npm_update=true
        update_available=true
    fi

    # Check git upstream
    if [[ "$behind" -gt 0 ]]; then
        git_update=true
        update_available=true
    fi

    if [[ "$QUIET" == true ]]; then
        if [[ "$update_available" == true ]]; then
            echo "update|$current|${latest:-$current}|$behind"
        else
            echo "ok"
        fi
        return 0
    fi

    if [[ "$update_available" == true ]]; then
        info "Update available!"

        # Build brief content via temp file (avoids shell escaping issues with backticks)
        local brief_tmp
        brief_tmp=$(mktemp)
        if [[ "$npm_update" == true ]]; then
            echo "**OpenClaw update:** v$current -> v$latest" >> "$brief_tmp"
        fi
        if [[ "$git_update" == true ]]; then
            local remote_ref="origin/main"
            if [[ "$(git remote 2>/dev/null)" == *upstream* ]]; then
                remote_ref="upstream/main"
            fi
            local commits
            commits=$(cd "$PROJECT_ROOT" && git log --oneline -5 HEAD.."$remote_ref" 2>/dev/null)
            echo "**$behind commit(s) behind upstream**" >> "$brief_tmp"
            echo "" >> "$brief_tmp"
        fi
        echo '> Run `./scripts/self-update.sh` or tell Atlas: "update yourself"' >> "$brief_tmp"

        local brief_content
        brief_content=$(cat "$brief_tmp")
        rm -f "$brief_tmp"

        # Upsert into daily brief
        upsert_brief_section "System Updates" "$brief_content"

        # Auto-prepare if requested and safe
        if [[ "$PREPARE" == true ]]; then
            cd "$PROJECT_ROOT"
            if git diff --quiet HEAD 2>/dev/null && git diff --cached --quiet HEAD 2>/dev/null; then
                info "Working tree clean — auto-preparing update..."
                bash "$PROJECT_ROOT/scripts/self-update.sh" --no-restart 2>&1 | tail -20
                upsert_brief_section "System Updates" "**OpenClaw update prepared** (v$current -> v${latest:-upstream})
Pulled + built. Restart needed to apply.

> Tell Atlas: \"restart yourself\" or run \`./scripts/self-update.sh --restart-only --delay 10\`"
            else
                warn "Working tree dirty — skipping auto-prepare. Commit first."
            fi
        fi

        echo ""
        echo "UPDATE AVAILABLE: v$current -> v${latest:-upstream} ($behind commits behind)"
        echo "Daily brief updated with reminder."
    else
        info "Up to date (v$current)"
        # Remove stale update section if it exists
        remove_brief_section "System Updates"
        echo "OK: v$current is current"
    fi
}

main
