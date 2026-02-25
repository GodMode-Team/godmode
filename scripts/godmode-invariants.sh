#!/bin/bash
# godmode-invariants.sh - Verify GodMode-specific code survived a merge
#
# This checks that upstream merges haven't silently reverted GodMode features.
# Called by godmode-sync-upstream.sh during post-merge validation.
# Can also be run standalone: ./scripts/godmode-invariants.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILURES=0
CHECKS=0

check() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    CHECKS=$((CHECKS + 1))

    if [ ! -f "$file" ]; then
        echo -e "  ${RED}MISSING${NC} $file — $description"
        FAILURES=$((FAILURES + 1))
        return
    fi

    if grep -qE "$pattern" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}OK${NC} $description"
    else
        echo -e "  ${RED}FAIL${NC} $description"
        echo -e "       File: $file"
        echo -e "       Expected pattern: $pattern"
        FAILURES=$((FAILURES + 1))
    fi
}

check_file_exists() {
    local file="$1"
    local description="$2"
    CHECKS=$((CHECKS + 1))

    if [ -f "$file" ]; then
        echo -e "  ${GREEN}OK${NC} $description"
    else
        echo -e "  ${RED}MISSING${NC} $description — $file"
        FAILURES=$((FAILURES + 1))
    fi
}

check_min_lines() {
    local file="$1"
    local min_lines="$2"
    local description="$3"
    CHECKS=$((CHECKS + 1))

    if [ ! -f "$file" ]; then
        echo -e "  ${RED}MISSING${NC} $file — $description"
        FAILURES=$((FAILURES + 1))
        return
    fi

    local actual_lines
    actual_lines=$(wc -l < "$file" | tr -d ' ')

    if [ "$actual_lines" -ge "$min_lines" ]; then
        echo -e "  ${GREEN}OK${NC} $description (${actual_lines} lines)"
    else
        echo -e "  ${RED}REGRESSED${NC} $description"
        echo -e "       Expected ≥${min_lines} lines, got ${actual_lines}"
        echo -e "       This file was likely replaced by an upstream stub."
        FAILURES=$((FAILURES + 1))
    fi
}

echo ""
echo "GodMode Invariant Checks"
echo "========================"

# ── Backend invariants (existing) ──────────────────────────────
echo ""
echo "Backend:"
check "src/cron/isolated-agent/session.ts" \
    'entry\?\.sessionId' \
    "Cron session ID reuse (prevents orphaning)"
check "src/agents/skills/refresh.ts" \
    '__pycache__' \
    "Chokidar ignores Python dirs (prevents FD exhaustion)"
check "src/gateway/server-methods/chat.ts" \
    'FIX.*Ensure session entry exists BEFORE' \
    "Session entry before transcript"
check "src/gateway/http-common.ts" \
    "Content-Security-Policy|nonce|unsafe-inline" \
    "CSP config present (nonce or unsafe-inline)"

# ── GodMode UI: Agent Log ──────────────────────────────────────
echo ""
echo "Agent Log:"
check "godmode-ui/src/ui/views/my-day.ts" \
    "AgentLogData" \
    "AgentLogData type exists (not just placeholder)"
check "godmode-ui/src/ui/views/my-day.ts" \
    "formatUpdatedAt" \
    "Agent log time formatting"
check "godmode-ui/src/ui/views/my-day.ts" \
    "agentLog\?\.content" \
    "Agent log renders content (not 'coming soon')"
check "godmode-ui/src/ui/controllers/my-day.ts" \
    "loadAgentLog" \
    "Agent log data loader"
check "godmode-ui/src/ui/controllers/my-day.ts" \
    "AGENT_LOG_PATH_CANDIDATES" \
    "Agent log file path resolution"

# ── GodMode UI: Workspaces ─────────────────────────────────────
echo ""
echo "Workspaces:"
check_min_lines "src/gateway/server-methods/workspaces.ts" 500 \
    "Workspaces server methods (not upstream stub)"
check_file_exists "src/gateway/workspace-sync-service.ts" \
    "Workspace sync service"
check_file_exists "src/gateway/workspaces-config.ts" \
    "Workspace config utilities"
check_min_lines "godmode-ui/src/ui/views/workspaces.ts" 400 \
    "Workspaces UI view (not upstream stub)"
check_min_lines "godmode-ui/src/ui/controllers/workspaces.ts" 200 \
    "Workspaces UI controller"

# ── GodMode UI: Daily Brief ────────────────────────────────────
echo ""
echo "Daily Brief:"
check "godmode-ui/src/ui/views/daily-brief.ts" \
    "onOpenFile" \
    "Daily brief file-open support"
check_file_exists "godmode-ui/src/ui/openable-file-path.ts" \
    "Openable file path utility"

# ── GodMode UI: Core wiring ───────────────────────────────────
echo ""
echo "Core UI wiring:"
check "godmode-ui/src/ui/app.ts" \
    "agentLogPollInterval" \
    "Agent log polling interval in app"
check "godmode-ui/src/ui/app-render.ts" \
    "agentLog.*state\.agentLog" \
    "Agent log props passed in render"
check "godmode-ui/src/ui/app-view-state.ts" \
    "AgentLogData" \
    "Agent log types in view state"

# ── GodMode: ~/clawd path hygiene ────────────────────────────
echo ""
echo "Path Hygiene (clawd→godmode):"
CHECKS=$((CHECKS + 1))
# Scan GodMode-owned source + skills for ~/clawd path references.
# Excludes: product names (clawdbot, clawdstrike, clawdhub, clawdock, clawdinator),
# sentinel.ts (intentional legacy-dir check), archive/, node_modules/, dist/, .git/
CLAWD_LEAKS=$(grep -rn '~/clawd\b' \
    --include='*.ts' --include='*.js' --include='*.json' --include='*.sh' --include='*.md' \
    godmode-ui/ skills/ src/ docs/ \
    2>/dev/null \
    | grep -v 'clawdbot' | grep -v 'clawdstrike' | grep -v 'clawdhub' | grep -v 'clawdock' \
    | grep -v 'clawdinator' | grep -v 'sentinel\.ts' | grep -v 'godmode-invariants\.sh' \
    | grep -v 'legacy\.migrations' | grep -v 'archive/' \
    | grep -v node_modules | grep -v '/dist/' | grep -v 'pnpm-lock' \
    || true)
if [ -z "$CLAWD_LEAKS" ]; then
    echo -e "  ${GREEN}OK${NC} No ~/clawd path leaks in source/skills/docs"
else
    echo -e "  ${RED}FAIL${NC} Found ~/clawd path references (should be ~/godmode):"
    echo "$CLAWD_LEAKS" | head -10 | while read -r line; do
        echo -e "       $line"
    done
    LEAK_COUNT=$(echo "$CLAWD_LEAKS" | wc -l | tr -d ' ')
    if [ "$LEAK_COUNT" -gt 10 ]; then
        echo -e "       ... and $((LEAK_COUNT - 10)) more"
    fi
    FAILURES=$((FAILURES + 1))
fi

# ── GodMode: PA-Memory — ARCHIVED (2026-02-21) ───────────────
# PA-Memory archived to archive/pa-memory/. Workspace git sync is sufficient.

# ── GodMode: Recursive Symlink Detection ─────────────────────
echo ""
echo "Symlink Hygiene:"
CHECKS=$((CHECKS + 1))
SYMLINK_COUNT=0
for ext_dir in extensions/*/node_modules/openclaw; do
    if [ -L "$ext_dir" ]; then
        target=$(readlink "$ext_dir")
        if echo "$target" | grep -q '\.\.'; then
            SYMLINK_COUNT=$((SYMLINK_COUNT + 1))
        fi
    fi
done
if [ "$SYMLINK_COUNT" -eq 0 ]; then
    echo -e "  ${GREEN}OK${NC} No recursive symlinks in extensions/*/node_modules/openclaw"
else
    # pnpm workspace recreates these on install — warn but don't fail
    echo -e "  ${YELLOW}INFO${NC} ${SYMLINK_COUNT} pnpm workspace symlink(s) (openclaw -> ../../..)"
    echo -e "       These cause ENAMETOOLONG in tools that walk node_modules."
    echo -e "       pnpm recreates them; sentinel boot scan also checks."
fi

# ── GodMode: Exec Config Consistency ────────────────────────
echo ""
echo "Exec Approvals Config:"
OPENCLAW_CFG="$HOME/.openclaw/openclaw.json"
EXEC_APPROVALS="$HOME/.openclaw/exec-approvals.json"

# Check 1: exec-approvals.json has no dead bare-name patterns
CHECKS=$((CHECKS + 1))
if [ -f "$EXEC_APPROVALS" ]; then
    # Extract patterns, find those without path separators
    DEAD_PATTERNS=$(python3 -c "
import json, sys
try:
    data = json.load(open('$EXEC_APPROVALS'))
    dead = []
    for agent_id, agent in data.get('agents', {}).items():
        for entry in agent.get('allowlist', []):
            p = entry.get('pattern', '').strip()
            if p and '/' not in p and '\\\\' not in p and '~' not in p and p != '*':
                dead.append(p)
    if dead:
        print(', '.join(dead[:5]))
        sys.exit(1)
except Exception as e:
    print(f'Parse error: {e}')
    sys.exit(2)
" 2>/dev/null) || true
    DEAD_EXIT=${PIPESTATUS[0]:-$?}
    if [ -z "$DEAD_PATTERNS" ]; then
        echo -e "  ${GREEN}OK${NC} No dead bare-name allowlist patterns"
    elif [ -n "$DEAD_PATTERNS" ] && echo "$DEAD_PATTERNS" | grep -q "Parse error"; then
        echo -e "  ${YELLOW}WARN${NC} Could not parse exec-approvals.json"
    else
        echo -e "  ${YELLOW}WARN${NC} Dead allowlist patterns (matchAllowlist ignores these): $DEAD_PATTERNS"
    fi
else
    echo -e "  ${GREEN}OK${NC} No exec-approvals.json (not applicable)"
fi

# Check 2: openclaw.json tools.exec.security matches exec-approvals intent
CHECKS=$((CHECKS + 1))
if [ -f "$OPENCLAW_CFG" ] && [ -f "$EXEC_APPROVALS" ]; then
    MISMATCH=$(python3 -c "
import json, sys
try:
    oc = json.load(open('$OPENCLAW_CFG'))
    ea = json.load(open('$EXEC_APPROVALS'))
    oc_sec = (oc.get('tools') or {}).get('exec', {}).get('security')
    ea_sec = ea.get('defaults', {}).get('security')
    ea_main_sec = ea.get('agents', {}).get('main', {}).get('security')
    if (ea_sec == 'full' or ea_main_sec == 'full') and oc_sec != 'full':
        print('exec-approvals wants full but openclaw.json missing tools.exec.security=full')
        sys.exit(1)
except Exception as e:
    print(f'Parse error: {e}')
    sys.exit(2)
" 2>/dev/null) || true
    if [ -z "$MISMATCH" ]; then
        echo -e "  ${GREEN}OK${NC} openclaw.json exec security matches exec-approvals.json"
    elif echo "$MISMATCH" | grep -q "Parse error"; then
        echo -e "  ${YELLOW}WARN${NC} Could not validate exec config consistency"
    else
        echo -e "  ${YELLOW}WARN${NC} $MISMATCH"
    fi
else
    echo -e "  ${GREEN}OK${NC} Config consistency check not applicable"
fi

# ── GodMode: Lifetrack enhancements ──────────────────────────
echo ""
echo "Lifetrack:"
check_file_exists "src/lifetrack/themes.ts" \
    "Lifetrack themes module"
check_file_exists "src/lifetrack/chunked-tts.ts" \
    "Lifetrack chunked TTS"

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "────────────────────────────"
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}All ${CHECKS} checks passed.${NC}"
else
    echo -e "${RED}${FAILURES} of ${CHECKS} checks FAILED.${NC}"
    echo ""
    echo "These GodMode features were likely reverted by an upstream merge."
    echo "Restore from the most recent checkpoint:"
    echo "  git log --oneline --all | grep CHECKPOINT"
    echo "  git checkout <checkpoint-hash> -- <file>"
fi

exit $FAILURES
