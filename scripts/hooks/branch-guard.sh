#!/usr/bin/env bash
# Branch Guard — blocks file edits when on main/master.
#
# Claude Code PreToolUse hook. Fires before Edit/Write tools.
# Exit 0 = allow, Exit 2 = block (stderr fed back to Claude).

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BRANCH=$(cd "$PROJECT_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  # Read stdin to get tool info (required by protocol)
  INPUT=$(cat)
  TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || echo "")

  # Only block file-editing tools, not Bash
  if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
    cat >&2 <<EOF
BLOCKED: You are on '$BRANCH'. Direct edits to main are not allowed.

Create a feature branch first:
  git checkout -b feat/<descriptive-slug>
  git checkout -b fix/<descriptive-slug>

Then retry your edit. This rule is enforced for all team members.
EOF
    exit 2
  fi
else
  # Drain stdin even if not blocking (protocol compliance)
  cat > /dev/null
fi

exit 0
