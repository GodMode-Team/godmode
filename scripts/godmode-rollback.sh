#!/bin/bash
# godmode-rollback.sh - Restore to a GodMode checkpoint or stable tag
# Usage: ./scripts/godmode-rollback.sh [tag-name]
# If no tag specified, finds the most recent checkpoint/stable tag

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

TARGET_TAG="${1:-}"
LOG_FILE="${HOME}/godmode/memory/git-operations.md"

echo "🔄 GodMode Rollback System"
echo "=========================="
echo ""

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# If no tag specified, find the most recent checkpoint or stable tag
if [[ -z "$TARGET_TAG" ]]; then
    echo "🔍 Finding most recent checkpoint or stable tag..."
    
    # Get most recent godmode tag (checkpoint or stable)
    TARGET_TAG=$(git tag -l 'godmode-*' --sort=-creatordate | head -n1)
    
    if [[ -z "$TARGET_TAG" ]]; then
        echo "❌ ERROR: No godmode tags found!"
        echo "   Create a checkpoint first with: ./scripts/godmode-checkpoint.sh"
        exit 1
    fi
    
    echo "📌 Found: ${TARGET_TAG}"
fi

# Verify tag exists
if ! git rev-parse "$TARGET_TAG" &>/dev/null; then
    echo "❌ ERROR: Tag '${TARGET_TAG}' not found!"
    echo ""
    echo "Available godmode tags:"
    git tag -l 'godmode-*' --sort=-creatordate | head -10
    exit 1
fi

# Show what we're rolling back to
TARGET_COMMIT=$(git rev-parse "$TARGET_TAG")
echo ""
echo "📋 Rollback details:"
echo "   Tag:    ${TARGET_TAG}"
echo "   Commit: ${TARGET_COMMIT:0:8}"
echo "   Date:   $(git log -1 --format=%ci "$TARGET_TAG")"
echo ""

# Confirm current state
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "📍 Current state:"
echo "   Branch: $(git branch --show-current)"
echo "   Commit: ${CURRENT_COMMIT:0:8}"
echo ""

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  WARNING: You have uncommitted changes!"
    echo "   These will be saved in a stash before rollback."
    echo ""
    STASH_NAME="godmode-rollback-backup-$(date +%Y%m%d-%H%M%S)"
    git stash push -m "$STASH_NAME"
    echo "📦 Stashed as: ${STASH_NAME}"
fi

# Perform the rollback
echo ""
echo "🔄 Rolling back..."
git checkout "$TARGET_TAG"

# Log the rollback
{
    echo ""
    echo "## Rollback: $(date +%Y%m%d-%H%M%S)"
    echo "- **To tag:** \`${TARGET_TAG}\`"
    echo "- **To commit:** \`${TARGET_COMMIT:0:8}\`"
    echo "- **From commit:** \`${CURRENT_COMMIT:0:8}\`"
    echo "- **Time:** $(date '+%Y-%m-%d %H:%M:%S')"
} >> "$LOG_FILE"

echo ""
echo "✅ ROLLBACK COMPLETE"
echo ""
echo "⚠️  You are now in DETACHED HEAD state at tag: ${TARGET_TAG}"
echo ""
echo "To create a new branch from here:"
echo "  git checkout -b recovery-branch"
echo ""
echo "To return to your previous branch:"
echo "  git checkout <branch-name>"
