#!/usr/bin/env bash
# session-guard.sh — Claude Code session discipline enforcer.
#
# Reads/writes the session registry directly (same-machine file access)
# since the gateway uses WebSocket RPC which requires WS auth.
#
# Usage:
#   ./scripts/session-guard.sh register "task description"
#   ./scripts/session-guard.sh heartbeat
#   ./scripts/session-guard.sh end [completed|in-progress|blocked] "notes"
#   ./scripts/session-guard.sh status
#   ./scripts/session-guard.sh check-branch <branch-name>
#
# The session ID is stored in $GODMODE_SESSION_ID env var.

set -euo pipefail

GODMODE_ROOT="${GODMODE_ROOT:-$HOME/godmode}"
REGISTRY_FILE="$GODMODE_ROOT/data/session-registry.json"

# ── Helpers ──────────────────────────────────────────────────────────

get_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
}

get_worktree() {
  local toplevel common
  toplevel=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
  common=$(git rev-parse --git-common-dir 2>/dev/null || echo "")
  if [[ "$common" != ".git" && "$common" != "$toplevel/.git" ]]; then
    echo "$toplevel"
  fi
}

ensure_registry() {
  if [[ ! -f "$REGISTRY_FILE" ]]; then
    mkdir -p "$(dirname "$REGISTRY_FILE")"
    echo '{"sessions":{},"lastCleanup":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","version":1}' > "$REGISTRY_FILE"
  fi
}

# ── Commands ─────────────────────────────────────────────────────────

do_register() {
  ensure_registry
  local task="${1:-}"
  local branch pid cwd worktree now session_id

  branch=$(get_branch)
  pid=$$
  cwd=$(pwd)
  worktree=$(get_worktree)
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  session_id="${pid}-$(date +%s)"

  # Check for branch conflicts
  local conflicts
  conflicts=$(python3 -c "
import json, sys
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
branch = '$branch'
conflicts = []
for sid, s in reg.get('sessions', {}).items():
    if s.get('status') == 'active' and s.get('branch') == branch and not s.get('worktree'):
        conflicts.append(f'Session \"{s.get(\"taskDescription\", sid)}\" already active on {branch}')
for c in conflicts:
    print(c)
" 2>/dev/null || echo "")

  if [[ -n "$conflicts" ]]; then
    echo "[GodMode Session Guard] WARNING:"
    echo "$conflicts" | while read -r line; do echo "  ⚠ $line"; done
  fi

  # Register
  python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
reg['sessions']['$session_id'] = {
    'id': '$session_id',
    'pid': $pid,
    'branch': '$branch',
    'cwd': '$cwd',
    $([ -n "$worktree" ] && echo "'worktree': '$worktree'," || true)
    'taskDescription': '$task',
    'modifiedFiles': [],
    'status': 'active',
    'startedAt': '$now',
    'lastSeen': '$now',
    'toolCallCount': 0,
    'holdsGatewayLock': False
}
with open('$REGISTRY_FILE', 'w') as f:
    json.dump(reg, f, indent=2)
" 2>/dev/null

  export GODMODE_SESSION_ID="$session_id"

  # Count other active sessions
  local count
  count=$(python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
active = [s for s in reg.get('sessions', {}).values() if s.get('status') == 'active' and s.get('id') != '$session_id']
print(len(active))
" 2>/dev/null || echo "0")

  echo "[GodMode] Session registered: $session_id (branch: $branch, $count other active)"
}

do_heartbeat() {
  ensure_registry
  local session_id="${GODMODE_SESSION_ID:-}"
  [[ -z "$session_id" ]] && { echo "No session ID set"; return 1; }

  local now branch
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  branch=$(get_branch)

  python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
s = reg.get('sessions', {}).get('$session_id')
if s:
    s['lastSeen'] = '$now'
    s['branch'] = '$branch'
    s['status'] = 'active'
    with open('$REGISTRY_FILE', 'w') as f:
        json.dump(reg, f, indent=2)
    print('heartbeat ok')
else:
    print('session not found')
" 2>/dev/null
}

do_end() {
  ensure_registry
  local session_id="${GODMODE_SESSION_ID:-}"
  [[ -z "$session_id" ]] && { echo "No session ID set"; return 1; }

  local status="${1:-completed}"
  local notes="${2:-Session ended normally}"

  # Save handoff
  local handoff_dir="$GODMODE_ROOT/data/session-handoffs"
  mkdir -p "$handoff_dir"
  local handoff_file="$handoff_dir/$(date -u +%Y-%m-%dT%H-%M-%S)_${session_id:0:12}.json"

  python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
s = reg.get('sessions', {}).get('$session_id', {})
handoff = {
    'sessionId': '$session_id',
    'branch': s.get('branch', 'unknown'),
    'taskDescription': s.get('taskDescription', 'No description'),
    'modifiedFiles': s.get('modifiedFiles', []),
    'status': '$status',
    'notes': '$notes',
    'createdAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'
}
with open('$handoff_file', 'w') as f:
    json.dump(handoff, f, indent=2)
# Remove from registry
if '$session_id' in reg.get('sessions', {}):
    if reg.get('gatewayLockHolder') == '$session_id':
        reg['gatewayLockHolder'] = None
    del reg['sessions']['$session_id']
with open('$REGISTRY_FILE', 'w') as f:
    json.dump(reg, f, indent=2)
print(f'Handoff saved: $handoff_file')
" 2>/dev/null

  echo "[GodMode] Session ended. Handoff saved."
}

do_status() {
  ensure_registry

  python3 -c "
import json, sys
from datetime import datetime, timezone
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
sessions = reg.get('sessions', {})
active = {k: v for k, v in sessions.items() if v.get('status') in ('active', 'idle')}
print(f'Active sessions: {len(active)}')
for sid, s in active.items():
    status = '🟢' if s.get('status') == 'active' else '🟡'
    task = s.get('taskDescription', 'unnamed')
    branch = s.get('branch', '?')
    files = len(s.get('modifiedFiles', []))
    lock = ' 🔒 GATEWAY LOCK' if s.get('holdsGatewayLock') else ''
    wt = ' (worktree)' if s.get('worktree') else ''
    print(f'  {status} {task} on {branch} ({files} files){wt}{lock}')
if not active:
    print('  (none)')
lock_holder = reg.get('gatewayLockHolder')
if lock_holder:
    print(f'Gateway lock: held by {lock_holder}')
" 2>/dev/null || echo "Could not read session registry"
}

do_check_branch() {
  ensure_registry
  local branch="${1:-$(get_branch)}"

  python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
conflicts = []
for sid, s in reg.get('sessions', {}).items():
    if s.get('status') == 'active' and s.get('branch') == '$branch' and not s.get('worktree'):
        conflicts.append(f'Session \"{s.get(\"taskDescription\", sid)}\" active on $branch')
if conflicts:
    print('CONFLICTS:')
    for c in conflicts:
        print(f'  ✗ {c}')
    print()
    print('Suggestion: use a worktree or switch to a different branch')
else:
    print('No conflicts for branch: $branch')
" 2>/dev/null
}

# ── Main ─────────────────────────────────────────────────────────────

case "${1:-status}" in
  register)       do_register "${2:-}" ;;
  heartbeat)      do_heartbeat ;;
  end)            do_end "${2:-completed}" "${3:-}" ;;
  status)         do_status ;;
  check-branch)   do_check_branch "${2:-}" ;;
  *)              echo "Usage: session-guard.sh [register|heartbeat|end|status|check-branch]"; exit 1 ;;
esac
