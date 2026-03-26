#!/bin/bash
# Monday Morning Merge — one command to apply all overnight improvements
# Run this from ~/Projects/godmode-plugin
set -euo pipefail

echo "Pre-merge checks..."
git checkout feat/overnight-improvement-sprint
npx tsc --noEmit
npx vitest run

echo ""
echo "All checks pass. Merging to main..."
git checkout main
git merge feat/overnight-improvement-sprint --no-ff -m "merge: overnight improvement sprint"

echo ""
echo "Merge complete. Summary:"
git log --oneline -1
echo ""
echo "Next steps:"
echo "1. Restart the gateway: openclaw gateway restart"
echo "2. Verify in browser: open GodMode UI, send a test message, click a .md file"
echo "3. Update Paperclip agents: run the migration script (TBD)"
