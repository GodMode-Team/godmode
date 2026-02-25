#!/bin/bash
# godmode-sync-upstream.sh - Safely sync with upstream OpenClaw (moltbot)
#
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║  CRITICAL SAFETY RULES - READ BEFORE RUNNING                                 ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║  1. This script should ONLY be run by Claude Code agent                      ║
# ║  2. Atlas (main agent) must NEVER run this directly                          ║
# ║  3. Maximum frequency: ONCE PER DAY                                          ║
# ║                                                                              ║
# ║  ██████████████████████████████████████████████████████████████████████████  ║
# ║  ██  NEVER MERGE THE TEST BRANCH DIRECTLY TO MAIN                        ██  ║
# ║  ██  ALWAYS GO THROUGH THE PR REVIEW PROCESS                             ██  ║
# ║  ██  AFTER PR MERGE: Run ./scripts/godmode-post-sync.sh                  ██  ║
# ║  ██████████████████████████████████████████████████████████████████████████  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝
#
# This script:
# 1. Creates a checkpoint of current state
# 2. Validates GodMode-specific fixes are present (pre-merge invariant check)
# 3. Creates an isolated TEST branch
# 4. Merges upstream INTO the test branch
# 5. Validates GodMode-specific fixes weren't reverted (post-merge invariant check)
# 6. Runs full build + UI build + tests
# 7. Creates PR for review (REQUIRED - never merge directly!)
# 8. Writes sync metadata for post-merge verification

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TEST_BRANCH="godmode-upstream-test-${TIMESTAMP}"
LOG_FILE="${HOME}/godmode/memory/git-operations.md"
CURRENT_BRANCH=$(git branch --show-current)
SYNC_METADATA_FILE="${REPO_ROOT}/.sync-pending"
SYNC_LOCK_FILE="${REPO_ROOT}/.sync-lock"

# Check for existing sync lock
if [[ -f "$SYNC_LOCK_FILE" ]]; then
    LOCK_AGE=$(($(date +%s) - $(stat -f %m "$SYNC_LOCK_FILE" 2>/dev/null || echo 0)))
    if [[ $LOCK_AGE -lt 86400 ]]; then  # 24 hours
        echo ""
        echo "ERROR: A sync is already in progress or was run recently."
        echo "Lock file: $SYNC_LOCK_FILE"
        echo "Age: $((LOCK_AGE / 3600)) hours ago"
        echo ""
        echo "If the previous sync completed, delete the lock:"
        echo "  rm $SYNC_LOCK_FILE"
        echo ""
        exit 1
    fi
fi

# Create sync lock
echo "${TIMESTAMP}" > "$SYNC_LOCK_FILE"

# ==============================================================================
# Color output helpers
# ==============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ==============================================================================
# GodMode-Specific Fix Patterns
# These patterns MUST exist after any merge to prevent regressions
# ==============================================================================

# File: src/cron/isolated-agent/session.ts
# Fix: Session ID reuse to prevent orphaning
PATTERN_CRON_SESSION_REUSE='entry\?\.sessionId'

# File: src/agents/skills/refresh.ts
# Fix: chokidar ignore patterns to prevent FD exhaustion
PATTERN_CHOKIDAR_VENV='v\?env'  # matches .?v?env regex pattern
PATTERN_CHOKIDAR_PYCACHE='__pycache__'
PATTERN_CHOKIDAR_SITEPACKAGES='site-packages'

# File: src/gateway/server-methods/chat.ts
# Fix: Session entry created BEFORE transcript
PATTERN_CHAT_SESSION_FIX='FIX.*Ensure session entry exists BEFORE'

# File: src/gateway/http-common.ts
# Fix: CSP allows unsafe-inline for config injection
PATTERN_CSP_UNSAFE_INLINE="'unsafe-inline'"

# Files with UPSTREAM_REVIEW markers (must be preserved)
UPSTREAM_REVIEW_FILES=(
    "src/cron/isolated-agent/session.ts"
    "src/gateway/server-methods/chat.ts"
)

# ==============================================================================
# GodMode-Specific Files (may have conflicts during merge)
# ==============================================================================
GODMODE_SPECIFIC_FILES=(
    "CLAUDE.md"
    "docs/reference/bug-learnings.md"
    "scripts/godmode-sync-upstream.sh"
    "scripts/godmode-checkpoint.sh"
    "scripts/godmode-rollback.sh"
)

# ==============================================================================
# Invariant Check Functions
# ==============================================================================

check_invariant() {
    local file="$1"
    local pattern="$2"
    local description="$3"

    if grep -qE "$pattern" "$file" 2>/dev/null; then
        ok "$description"
        return 0
    else
        error "$description - PATTERN NOT FOUND"
        return 1
    fi
}

check_upstream_review_markers() {
    local failures=0

    for file in "${UPSTREAM_REVIEW_FILES[@]}"; do
        if grep -q "UPSTREAM_REVIEW" "$file" 2>/dev/null; then
            ok "UPSTREAM_REVIEW marker present: $file"
        else
            error "UPSTREAM_REVIEW marker MISSING: $file"
            failures=$((failures + 1))
        fi
    done

    return $failures
}

run_invariant_checks() {
    local phase="$1"  # "pre-merge" or "post-merge"
    local failures=0

    echo ""
    echo "======================================"
    echo "GodMode Invariant Checks ($phase)"
    echo "======================================"
    echo ""

    # Check UPSTREAM_REVIEW markers
    info "Checking UPSTREAM_REVIEW markers..."
    if ! check_upstream_review_markers; then
        failures=$((failures + 1))
    fi
    echo ""

    # Check session ID reuse fix (prevents orphaning)
    info "Checking session ID reuse fix (cron sessions)..."
    if ! check_invariant \
        "src/cron/isolated-agent/session.ts" \
        "$PATTERN_CRON_SESSION_REUSE" \
        "Session ID reuse pattern: entry?.sessionId"; then
        failures=$((failures + 1))
        echo "   This fix prevents orphaned transcripts."
        echo "   See: docs/reference/bug-learnings.md 'Session Orphaning Bug'"
    fi
    echo ""

    # Check chokidar ignore patterns (prevents FD exhaustion)
    info "Checking FD exhaustion prevention (chokidar ignores)..."
    if ! check_invariant \
        "src/agents/skills/refresh.ts" \
        "$PATTERN_CHOKIDAR_VENV" \
        "Chokidar ignore: venv"; then
        failures=$((failures + 1))
    fi
    if ! check_invariant \
        "src/agents/skills/refresh.ts" \
        "$PATTERN_CHOKIDAR_PYCACHE" \
        "Chokidar ignore: __pycache__"; then
        failures=$((failures + 1))
    fi
    if ! check_invariant \
        "src/agents/skills/refresh.ts" \
        "$PATTERN_CHOKIDAR_SITEPACKAGES" \
        "Chokidar ignore: site-packages"; then
        failures=$((failures + 1))
        echo "   This fix prevents file descriptor exhaustion when skills contain Python venvs."
        echo "   See: docs/reference/bug-learnings.md 'FD Exhaustion / spawn EBADF Errors'"
    fi
    echo ""

    # Check session entry creation before transcript
    info "Checking session-transcript invariant (chat.ts)..."
    if ! check_invariant \
        "src/gateway/server-methods/chat.ts" \
        "$PATTERN_CHAT_SESSION_FIX" \
        "Session entry before transcript pattern"; then
        failures=$((failures + 1))
        echo "   This fix ensures session entries exist before creating transcripts."
        echo "   See: docs/reference/bug-learnings.md 'Session Orphaning Bug'"
    fi
    echo ""

    # Check CSP allows unsafe-inline
    info "Checking CSP configuration (http-common.ts)..."
    if ! check_invariant \
        "src/gateway/http-common.ts" \
        "$PATTERN_CSP_UNSAFE_INLINE" \
        "CSP unsafe-inline for config injection"; then
        failures=$((failures + 1))
        echo "   This fix allows inline script config injection (user avatar, etc)."
        echo "   See: docs/reference/bug-learnings.md 'CSP Blocking Window Globals'"
    fi
    echo ""

    return $failures
}

# ==============================================================================
# Conflict Guidance
# ==============================================================================

print_conflict_guidance() {
    echo ""
    echo "======================================"
    echo "Merge Conflict Resolution Guidance"
    echo "======================================"
    echo ""

    echo "Conflicting files:"
    git diff --name-only --diff-filter=U 2>/dev/null | while read file; do
        # Check if it's a GodMode-specific file
        is_godmode=""
        for gm_file in "${GODMODE_SPECIFIC_FILES[@]}"; do
            if [[ "$file" == "$gm_file" ]]; then
                is_godmode=" (GodMode-specific)"
                break
            fi
        done
        echo "  - $file$is_godmode"
    done

    echo ""
    echo "Resolution hints by file type:"
    echo ""

    echo "1. GodMode-specific files (keep ours):"
    for file in "${GODMODE_SPECIFIC_FILES[@]}"; do
        echo "     git checkout --ours $file"
    done
    echo ""

    echo "2. Files with UPSTREAM_REVIEW markers (merge carefully):"
    for file in "${UPSTREAM_REVIEW_FILES[@]}"; do
        echo "     # $file - PRESERVE our fixes, adopt upstream improvements"
        echo "     # Look for UPSTREAM_REVIEW comments to identify critical code"
    done
    echo ""

    echo "3. Critical patterns that MUST be preserved:"
    echo "   - src/cron/isolated-agent/session.ts:"
    echo "       entry?.sessionId  (NOT crypto.randomUUID() alone)"
    echo "   - src/agents/skills/refresh.ts:"
    echo "       Python venv/pycache ignore patterns in DEFAULT_SKILLS_WATCH_IGNORED"
    echo "   - src/gateway/server-methods/chat.ts:"
    echo "       Session entry creation BEFORE transcript creation"
    echo "   - src/gateway/http-common.ts:"
    echo "       'unsafe-inline' in script-src CSP directive"
    echo ""

    echo "After resolving conflicts:"
    echo "  git add <resolved-files>"
    echo "  git commit"
    echo "  ./scripts/godmode-sync-upstream.sh  # Re-run to validate"
}

# ==============================================================================
# Main Script
# ==============================================================================

echo ""
echo "========================================"
echo "GodMode Upstream Sync (Enhanced)"
echo "========================================"
echo ""
echo "WARNING: This is a PROTECTED operation"
echo "  - Must be run by Claude Code agent"
echo "  - Maximum once per day"
echo "  - Tests in isolation before any merge"
echo ""

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Step 0: Auto-commit WIP to prevent work loss
echo "Step 0/7: Auto-commit WIP (safety checkpoint)"
echo "----------------------------------------------"
"${REPO_ROOT}/scripts/godmode-wip-commit.sh" || true
echo ""

# Clear git rerere cache to prevent stale conflict resolutions from silently
# applying outdated merge choices. Stale rerere entries caused the Feb 8 sync
# to replay an old resolution that reverted GodMode fixes.
# See: upstream-sync-lessons.md
if [ -d "${REPO_ROOT}/.git/rr-cache" ]; then
    RR_COUNT=$(ls "${REPO_ROOT}/.git/rr-cache" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$RR_COUNT" -gt 0 ]; then
        info "Clearing $RR_COUNT stale rerere cache entries"
        rm -rf "${REPO_ROOT}/.git/rr-cache/"*
    fi
fi

# Step 1: Pre-merge invariant check (comprehensive GodMode check)
echo "Step 1/7: Pre-merge invariant check"
echo "-----------------------------------"
PRE_FAILURES=0
if ! "${REPO_ROOT}/scripts/godmode-invariants.sh"; then
    PRE_FAILURES=$?
fi

if [[ $PRE_FAILURES -gt 0 ]]; then
    error "Pre-merge invariant check failed with $PRE_FAILURES issues"
    echo ""
    echo "Your local GodMode fixes may be missing or corrupted."
    echo "Please restore them before syncing with upstream."
    echo ""
    echo "Abort? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Checkpoint current state
echo ""
echo "Step 2/7: Creating checkpoint"
echo "-----------------------------"
./scripts/godmode-checkpoint.sh "pre-upstream-sync-${TIMESTAMP}"

# Step 3: Fetch upstream
echo ""
echo "Step 3/7: Fetching upstream"
echo "---------------------------"
if ! git remote | grep -q '^upstream$'; then
    info "Adding upstream remote..."
    git remote add upstream https://github.com/openclaw/openclaw.git
fi
git fetch upstream
ok "Upstream fetched"

# Show what's coming
echo ""
info "Commits to merge:"
git log --oneline HEAD..upstream/main | head -20
COMMIT_COUNT=$(git log --oneline HEAD..upstream/main | wc -l | tr -d ' ')
if [[ "$COMMIT_COUNT" == "0" ]]; then
    ok "Already up to date with upstream"
    echo ""
    echo "No sync needed."
    exit 0
fi
echo ""
info "Total: $COMMIT_COUNT commit(s)"

# Step 4: Create isolated test branch
echo ""
echo "Step 4/7: Creating isolated test branch"
echo "---------------------------------------"
git checkout -b "$TEST_BRANCH"
ok "Created branch: ${TEST_BRANCH}"

# Step 5: Attempt merge
echo ""
echo "Step 5/7: Merging upstream/main"
echo "-------------------------------"
MERGE_SUCCESS=true
if git merge upstream/main --no-edit; then
    ok "Merge completed without conflicts"
else
    MERGE_SUCCESS=false
    error "MERGE CONFLICTS DETECTED"
    print_conflict_guidance
    echo ""
    warn "Aborting merge..."
    git merge --abort
fi

# Step 6: Post-merge invariant check (only if merge succeeded)
POST_FAILURES=0
if [[ "$MERGE_SUCCESS" == "true" ]]; then
    echo ""
    echo "Step 6/7: Post-merge invariant check"
    echo "------------------------------------"
    if ! "${REPO_ROOT}/scripts/godmode-invariants.sh"; then
        POST_FAILURES=$?
    fi

    if [[ $POST_FAILURES -gt 0 ]]; then
        error "Post-merge invariant check failed with $POST_FAILURES issues"
        echo ""
        echo "CRITICAL: Upstream has reverted or broken GodMode-specific fixes!"
        echo ""
        echo "You must manually restore these fixes before the merge can proceed."
        echo "Reference: docs/reference/bug-learnings.md"
        echo ""
        MERGE_SUCCESS=false
    fi
else
    echo ""
    echo "Step 6/7: Skipped (merge failed)"
fi

# Step 7: Run builds (only if merge and invariants succeeded)
BUILD_SUCCESS=true
if [[ "$MERGE_SUCCESS" == "true" && $POST_FAILURES -eq 0 ]]; then
    echo ""
    echo "Step 7/7: Running builds and tests"
    echo "----------------------------------"

    info "Running pnpm install..."
    if ! pnpm install --frozen-lockfile 2>/dev/null; then
        pnpm install
    fi

    info "Running lint..."
    if ! pnpm lint; then
        BUILD_SUCCESS=false
        error "Lint FAILED"
    fi

    if [[ "$BUILD_SUCCESS" == "true" ]]; then
        info "Running main build..."
        if ! pnpm build; then
            BUILD_SUCCESS=false
            error "Main build FAILED"
        fi
    fi

    if [[ "$BUILD_SUCCESS" == "true" ]]; then
      info "Running UI build..."
      if ! pnpm godmode-ui:build; then
        BUILD_SUCCESS=false
        error "UI build FAILED"
      fi
    fi

    if [[ "$BUILD_SUCCESS" == "true" ]]; then
        info "Running tests..."
        if ! pnpm test; then
            BUILD_SUCCESS=false
            error "Tests FAILED"
        fi
    fi

    if [[ "$BUILD_SUCCESS" == "true" ]]; then
        ok "All builds and tests passed!"
    fi
else
    echo ""
    echo "Step 7/7: Skipped (merge or invariants failed)"
    BUILD_SUCCESS=false
fi

# Return to original branch
echo ""
info "Returning to original branch: ${CURRENT_BRANCH}"
git checkout "$CURRENT_BRANCH"

# Log the sync attempt
{
    echo ""
    echo "## Upstream Sync Attempt: ${TIMESTAMP}"
    echo "- **Test branch:** \`${TEST_BRANCH}\`"
    echo "- **Pre-merge invariants:** $(if [[ $PRE_FAILURES -eq 0 ]]; then echo "PASSED"; else echo "FAILED ($PRE_FAILURES issues)"; fi)"
    echo "- **Merge result:** $(if [[ "$MERGE_SUCCESS" == "true" ]]; then echo "Success"; else echo "Failed"; fi)"
    echo "- **Post-merge invariants:** $(if [[ $POST_FAILURES -eq 0 ]]; then echo "PASSED"; else echo "FAILED ($POST_FAILURES issues)"; fi)"
    echo "- **Build/Test result:** $(if [[ "$BUILD_SUCCESS" == "true" ]]; then echo "PASSED"; else echo "FAILED"; fi)"
    echo "- **Time:** $(date '+%Y-%m-%d %H:%M:%S')"
} >> "$LOG_FILE"

# Final report
echo ""
echo "========================================"
if [[ "$MERGE_SUCCESS" == "true" && "$BUILD_SUCCESS" == "true" && $POST_FAILURES -eq 0 ]]; then
    echo -e "${GREEN}UPSTREAM SYNC TEST PASSED${NC}"
    echo "========================================"
    echo ""
    echo "The test branch '${TEST_BRANCH}' contains the merged code."
    echo "All invariant checks passed. All builds passed."
    echo ""

    info "Creating PR for review..."
    git push -u origin "${TEST_BRANCH}"

    # Write sync metadata for post-merge verification
    cat > "$SYNC_METADATA_FILE" << EOF
# GodMode Upstream Sync Pending
# Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)
# Test Branch: ${TEST_BRANCH}
# Checkpoint: godmode-checkpoint-${TIMESTAMP}
#
# AFTER THE PR IS MERGED, YOU MUST RUN:
#   ./scripts/godmode-post-sync.sh
#
# This will:
#   1. Rebuild dist/ from the merged source
#   2. Restart the gateway service
#   3. Verify the gateway is healthy
#   4. Remove this pending marker
#
# DO NOT DELETE THIS FILE MANUALLY
SYNC_TIMESTAMP=${TIMESTAMP}
TEST_BRANCH=${TEST_BRANCH}
CHECKPOINT=godmode-checkpoint-${TIMESTAMP}
STATUS=pending_pr_merge
EOF

    # Create PR via gh CLI
    if command -v gh &> /dev/null; then
        PR_BODY="## Upstream Sync

Merges latest changes from upstream OpenClaw (moltbot).

### Pre-merge Checks
- [x] UPSTREAM_REVIEW markers present
- [x] Session ID reuse fix intact
- [x] FD exhaustion prevention intact
- [x] Session-transcript invariant intact
- [x] CSP configuration intact

### Build Results
- [x] Lint passed
- [x] TypeScript build passed
- [x] UI build passed
- [x] Tests passed

### Checkpoint
Tag: \`godmode-checkpoint-${TIMESTAMP}\`

---

## ⚠️ POST-MERGE REQUIRED ACTION

After merging this PR, you **MUST** run:
\`\`\`bash
./scripts/godmode-post-sync.sh
\`\`\`

This rebuilds dist/ and restarts the gateway. **Skipping this will cause the gateway to crash.**

---
*Automated upstream sync - requires review before merge*

See \`docs/reference/bug-learnings.md\` for critical fixes that must be preserved."

        PR_URL=$(gh pr create \
            --title "chore: sync upstream $(date +%Y.%m.%d)" \
            --body "$PR_BODY" \
            --base main \
            --head "${TEST_BRANCH}" 2>/dev/null || echo "")

        if [[ -n "$PR_URL" ]]; then
            echo ""
            ok "PR created: ${PR_URL}"
        else
            echo ""
            warn "Could not create PR automatically."
            echo "Create manually: gh pr create --base main --head ${TEST_BRANCH}"
        fi
    else
        echo ""
        warn "gh CLI not found. Create PR manually:"
        echo "  gh pr create --base main --head ${TEST_BRANCH}"
    fi

    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║  ⚠️  CRITICAL: DO NOT MERGE DIRECTLY                                         ║"
    echo "╠══════════════════════════════════════════════════════════════════════════════╣"
    echo "║                                                                              ║"
    echo "║  ❌ WRONG: git merge ${TEST_BRANCH}                               ║"
    echo "║  ❌ WRONG: git checkout main && git merge ...                                ║"
    echo "║                                                                              ║"
    echo "║  ✅ RIGHT: Merge the PR through GitHub UI or 'gh pr merge'                   ║"
    echo "║  ✅ THEN:  Run ./scripts/godmode-post-sync.sh                                ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "To discard the test branch:"
    echo "  git branch -D ${TEST_BRANCH}"
    echo "  git push origin --delete ${TEST_BRANCH}"
    echo "  rm ${SYNC_METADATA_FILE}  # Also remove pending marker"
else
    echo -e "${RED}UPSTREAM SYNC TEST FAILED${NC}"
    echo "========================================"
    echo ""

    if [[ "$MERGE_SUCCESS" != "true" ]]; then
        error "Merge conflicts need manual resolution"
        echo ""
        echo "To resolve:"
        echo "  1. git checkout ${TEST_BRANCH}"
        echo "  2. git merge upstream/main"
        echo "  3. Resolve conflicts (see guidance above)"
        echo "  4. git add <resolved-files>"
        echo "  5. git commit"
        echo "  6. Re-run this script to validate"
    elif [[ $POST_FAILURES -gt 0 ]]; then
        error "GodMode invariants were broken by upstream"
        echo ""
        echo "Upstream has changes that conflict with critical GodMode fixes."
        echo "You must manually restore the following before merging:"
        echo ""
        echo "  See: docs/reference/bug-learnings.md"
        echo ""
        echo "To fix:"
        echo "  1. git checkout ${TEST_BRANCH}"
        echo "  2. Restore GodMode-specific fixes (check bug-learnings.md)"
        echo "  3. git add <fixed-files>"
        echo "  4. git commit -m 'fix: restore GodMode-specific fixes after upstream merge'"
        echo "  5. Re-run this script to validate"
    else
        error "Build or tests failed after merge"
        echo ""
        echo "The merge succeeded but the code doesn't build/test cleanly."
        echo ""
        echo "To investigate:"
        echo "  1. git checkout ${TEST_BRANCH}"
        echo "  2. Fix build/test issues"
        echo "  3. git add <fixed-files>"
        echo "  4. git commit -m 'fix: resolve build issues after upstream merge'"
        echo "  5. Re-run this script to validate"
    fi

    echo ""
    echo "The test branch '${TEST_BRANCH}' can be examined or deleted:"
    echo "  git checkout ${TEST_BRANCH}  # to investigate"
    echo "  git branch -D ${TEST_BRANCH}  # to discard"
    echo ""
    echo "Your working branch '${CURRENT_BRANCH}' is UNCHANGED."
fi
echo "========================================"
