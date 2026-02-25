#!/bin/bash
# godmode-checkpoint.sh - Create a safety checkpoint before any destructive git operation
# Usage: ./scripts/godmode-checkpoint.sh "description-of-what-im-about-to-do"

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

DESCRIPTION="${1:-manual-checkpoint}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TAG_NAME="godmode-checkpoint-${TIMESTAMP}"
LOG_FILE="${HOME}/godmode/memory/git-operations.md"

echo "🛡️  GodMode Checkpoint System"
echo "=============================="
echo ""

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add -A
    git commit -m "CHECKPOINT: ${DESCRIPTION} [${TIMESTAMP}]" --no-verify
    COMMIT_SHA=$(git rev-parse HEAD)
    echo "✅ Changes committed: ${COMMIT_SHA:0:8}"
else
    COMMIT_SHA=$(git rev-parse HEAD)
    echo "📌 Working directory clean. Using current HEAD: ${COMMIT_SHA:0:8}"
fi

# Create checkpoint tag
git tag -a "$TAG_NAME" -m "GodMode checkpoint: ${DESCRIPTION}"
echo "🏷️  Tag created: ${TAG_NAME}"

# Log the checkpoint
{
    echo ""
    echo "## Checkpoint: ${TIMESTAMP}"
    echo "- **Description:** ${DESCRIPTION}"
    echo "- **Tag:** \`${TAG_NAME}\`"
    echo "- **Commit:** \`${COMMIT_SHA:0:8}\`"
    echo "- **Branch:** \`$(git branch --show-current)\`"
    echo "- **Time:** $(date '+%Y-%m-%d %H:%M:%S')"
} >> "$LOG_FILE"

echo "📋 Logged to: ${LOG_FILE}"
echo ""
echo "✅ CHECKPOINT COMPLETE"
echo ""
echo "To rollback to this checkpoint:"
echo "  ./scripts/godmode-rollback.sh ${TAG_NAME}"
echo ""
echo "You may now proceed with your destructive operation."
