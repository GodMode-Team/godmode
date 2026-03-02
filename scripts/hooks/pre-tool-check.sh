#!/usr/bin/env bash
# Claude Code PreToolUse hook — blocks dangerous operations.
#
# Receives tool call JSON on stdin. Checks for:
# 1. git stash (blocks with exit 2)
# 2. gateway restart without lock check (warns)
# 3. force push / destructive git ops (warns)
# 4. File conflicts with other sessions (warns)
#
# Exit 0 = allow, Exit 2 = block (stderr fed back to Claude)

set -euo pipefail

GODMODE_ROOT="${GODMODE_ROOT:-$HOME/godmode}"
REGISTRY_FILE="$GODMODE_ROOT/data/session-registry.json"

# Read tool input from stdin
INPUT=$(cat)

# Extract tool name and command/file_path
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || echo "")

if [[ "$TOOL_NAME" == "Bash" ]]; then
  COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

  # ── Block: git stash ──────────────────────────────────────────────
  if echo "$COMMAND" | grep -qE '^\s*git\s+stash(\s|$)'; then
    echo "BLOCKED: git stash is prohibited by session coordination rules." >&2
    echo "" >&2
    echo "Stashes are invisible to other sessions and cause lost work." >&2
    echo "Instead: commit to your current branch (even as a WIP commit):" >&2
    echo "  git add -A && git commit -m 'WIP: <description>'" >&2
    echo "" >&2
    echo "Or create a new branch:" >&2
    echo "  git checkout -b feat/<task-slug>" >&2
    exit 2
  fi

  # ── Warn: gateway restart ─────────────────────────────────────────
  if echo "$COMMAND" | grep -qE 'openclaw\s+gateway\s+restart'; then
    if [[ -f "$REGISTRY_FILE" ]]; then
      ACTIVE_COUNT=$(python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
active = [s for s in reg.get('sessions', {}).values() if s.get('status') == 'active']
print(len(active))
" 2>/dev/null || echo "0")

      LOCK_HOLDER=$(python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
holder = reg.get('gatewayLockHolder', '')
if holder:
    s = reg.get('sessions', {}).get(holder, {})
    print(s.get('taskDescription', holder))
else:
    print('')
" 2>/dev/null || echo "")

      if [[ -n "$LOCK_HOLDER" ]]; then
        echo "WARNING: Gateway restart lock held by: $LOCK_HOLDER" >&2
        echo "Another session is currently restarting. Wait for it to finish." >&2
        exit 2
      fi

      if [[ "$ACTIVE_COUNT" -gt 1 ]]; then
        echo "NOTE: $ACTIVE_COUNT active sessions detected. Gateway restart will affect all of them." >&2
        # Allow but warn — don't block
      fi
    fi
  fi

  # ── Warn: force push ──────────────────────────────────────────────
  if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force'; then
    echo "WARNING: Force push detected. This can overwrite other sessions' work." >&2
    # Allow but warn
  fi

  # ── Warn: destructive git ops ─────────────────────────────────────
  if echo "$COMMAND" | grep -qE 'git\s+(reset\s+--hard|clean\s+-f|checkout\s+\.)'; then
    echo "WARNING: Destructive git operation detected. Check for uncommitted work from other sessions first." >&2
  fi
fi

# ── Check file conflicts for Edit/Write ──────────────────────────────
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

  if [[ -n "$FILE_PATH" && -f "$REGISTRY_FILE" ]]; then
    # Get current session ID from env (set by session-start hook)
    MY_SESSION="${GODMODE_SESSION_ID:-}"

    CONFLICT=$(python3 -c "
import json, os
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
my_id = '$MY_SESSION'
file_path = '$FILE_PATH'
# Normalize to relative path
project_root = os.environ.get('PROJECT_ROOT', '')
if project_root and file_path.startswith(project_root):
    file_path = file_path[len(project_root):].lstrip('/')
for sid, s in reg.get('sessions', {}).items():
    if sid == my_id or s.get('status') != 'active':
        continue
    for mf in s.get('modifiedFiles', []):
        if mf == file_path or file_path.endswith(mf) or mf.endswith(file_path):
            task = s.get('taskDescription', sid)
            branch = s.get('branch', '?')
            print(f'Session \"{task}\" on {branch} is also editing {mf}')
            break
" 2>/dev/null || echo "")

    if [[ -n "$CONFLICT" ]]; then
      echo "FILE CONFLICT WARNING: $CONFLICT" >&2
      echo "Consider coordinating with the other session or using a different branch." >&2
      # Warn but don't block — file conflicts are common and often resolvable
    fi
  fi
fi

# Allow the operation
exit 0
