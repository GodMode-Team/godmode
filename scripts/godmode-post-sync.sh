#!/bin/bash
# godmode-post-sync.sh - Complete the upstream sync after PR merge
#
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║  RUN THIS AFTER MERGING AN UPSTREAM SYNC PR                                  ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║  This script:                                                                ║
# ║  1. Verifies the PR was merged (not direct merge)                            ║
# ║  2. Pulls the latest changes                                                 ║
# ║  3. Rebuilds dist/ from source                                               ║
# ║  4. Restarts the gateway service                                             ║
# ║  5. Verifies the gateway is healthy                                          ║
# ║  6. Cleans up sync metadata                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SYNC_METADATA_FILE="${REPO_ROOT}/.sync-pending"
SYNC_LOCK_FILE="${REPO_ROOT}/.sync-lock"
LOG_FILE="${HOME}/godmode/memory/git-operations.md"

# Color output helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo ""
echo "========================================"
echo "GodMode Post-Sync Completion"
echo "========================================"
echo ""

# Step 1: Check for pending sync
if [[ ! -f "$SYNC_METADATA_FILE" ]]; then
    echo "No pending sync found."
    echo ""
    echo "This script should only be run after:"
    echo "  1. Running ./scripts/godmode-sync-upstream.sh"
    echo "  2. Merging the resulting PR"
    echo ""
    exit 1
fi

# Read sync metadata
source "$SYNC_METADATA_FILE"
info "Found pending sync: ${TEST_BRANCH}"
info "Checkpoint: ${CHECKPOINT}"

# Step 2: Verify we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    error "Must be on 'main' branch. Currently on: $CURRENT_BRANCH"
    echo ""
    echo "Please run: git checkout main"
    exit 1
fi

# Step 3: Pull latest changes
echo ""
echo "Step 1/5: Pulling latest changes"
echo "--------------------------------"
git pull origin main
ok "Pulled latest changes"

# Step 4: Verify the test branch was merged via PR (not direct merge)
echo ""
echo "Step 2/5: Verifying merge method"
echo "--------------------------------"

# Check if the test branch commit is in main's history
if git log --oneline -1 --grep="Merge pull request" HEAD 2>/dev/null | grep -q "sync upstream"; then
    ok "Verified: Sync was merged via PR"
elif git log --oneline -1 --grep="Merge upstream sync from test branch" HEAD 2>/dev/null | grep -q "test branch"; then
    warn "WARNING: This appears to be a DIRECT MERGE, not a PR merge!"
    echo ""
    echo "Direct merges bypass PR review and can cause issues."
    echo "In the future, always merge via the GitHub PR interface."
    echo ""
    echo "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    info "Could not verify merge method, continuing..."
fi

# Step 2.5: Auto-fix gateway config (common post-update breakage)
echo ""
echo "Checking gateway config..."
echo "--------------------------"
if [ -x "$REPO_ROOT/scripts/post-pull-gateway-fix.sh" ]; then
    "$REPO_ROOT/scripts/post-pull-gateway-fix.sh"
else
    warn "post-pull-gateway-fix.sh not found, skipping config check"
fi

# Step 5: Rebuild dist/
echo ""
echo "Step 3/5: Rebuilding dist/"
echo "--------------------------"

info "Running pnpm install..."
if ! pnpm install --frozen-lockfile 2>/dev/null; then
    pnpm install
fi

info "Building gateway..."
if ! pnpm build; then
    error "Build FAILED"
    echo ""
    echo "The build failed. This may indicate issues with the merge."
    echo "Please investigate and fix before restarting the gateway."
    exit 1
fi
ok "Build succeeded"

# NOTE: UI is already built by `pnpm build` (includes godmode-ui:build + control-ui:verify).
# `pnpm ui:build` is intentionally disabled in this repo to prevent wrong-bundle overwrites.

# Step 6: Restart gateway
echo ""
echo "Step 4/5: Restarting gateway"
echo "----------------------------"

# Check if launchd service exists
if launchctl list 2>/dev/null | grep -q "com.openclaw.gateway"; then
    info "Restarting gateway via launchctl..."
    launchctl kickstart -k "gui/$(id -u)/com.openclaw.gateway"
    sleep 3

    # Check status
    GATEWAY_STATUS=$(launchctl list 2>/dev/null | grep "com.openclaw.gateway" | awk '{print $2}')
    if [[ "$GATEWAY_STATUS" == "0" ]] || [[ "$GATEWAY_STATUS" == "-" ]]; then
        ok "Gateway restarted successfully"
    else
        error "Gateway may have failed to start (status: $GATEWAY_STATUS)"
        echo ""
        echo "Check logs: tail -50 /tmp/openclaw/openclaw.err.log"
        exit 1
    fi
else
    warn "Gateway launchd service not found"
    echo "You may need to start the gateway manually:"
    echo "  pnpm start gateway --port 18789"
fi

# Step 7: Verify gateway health
echo ""
echo "Step 5/5: Verifying gateway health"
echo "----------------------------------"

sleep 2

# Check if gateway responds
if curl -s -o /dev/null -w "%{http_code}" http://localhost:18789 2>/dev/null | grep -q "200"; then
    ok "Gateway is responding (HTTP 200)"
else
    warn "Gateway HTTP check inconclusive"
    info "Checking WebSocket endpoint..."
fi

# Check launchd status again
if launchctl list 2>/dev/null | grep -q "com.openclaw.gateway"; then
    FINAL_STATUS=$(launchctl list 2>/dev/null | grep "com.openclaw.gateway" | awk '{print $2}')
    if [[ "$FINAL_STATUS" == "0" ]] || [[ "$FINAL_STATUS" == "-" ]]; then
        ok "Gateway process is healthy (launchd status: $FINAL_STATUS)"
    else
        error "Gateway may be unhealthy (launchd status: $FINAL_STATUS)"
        echo ""
        echo "Check error log: tail -50 /tmp/openclaw/openclaw.err.log"
    fi
fi

# Step 8: Cleanup
echo ""
echo "Cleaning up..."
echo "--------------"

# Remove sync metadata
rm -f "$SYNC_METADATA_FILE"
ok "Removed sync pending marker"

# Remove sync lock
rm -f "$SYNC_LOCK_FILE"
ok "Removed sync lock"

# Log completion
{
    echo ""
    echo "### Post-Sync Completed: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "- Sync: ${TEST_BRANCH}"
    echo "- Checkpoint: ${CHECKPOINT}"
    echo "- Build: SUCCESS"
    echo "- Gateway: RESTARTED"
} >> "$LOG_FILE"

echo ""
echo "========================================"
echo -e "${GREEN}POST-SYNC COMPLETE${NC}"
echo "========================================"
echo ""
echo "The upstream sync is now fully applied:"
echo "  - dist/ has been rebuilt"
echo "  - Gateway has been restarted"
echo "  - Sync metadata cleaned up"
echo ""
echo "You can verify by visiting:"
echo "  https://your-gateway.example.com"
echo ""
