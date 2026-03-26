#!/usr/bin/env bash
# Claude Code SessionStart hook — auto-registers session and injects awareness context.
#
# Stdout is injected into Claude's context at session start.
# This ensures every session knows about other active sessions,
# recent handoffs, and the current branch state.

set -euo pipefail

GODMODE_ROOT="${GODMODE_ROOT:-$HOME/godmode}"
REGISTRY_FILE="$GODMODE_ROOT/data/session-registry.json"
HANDOFF_DIR="$GODMODE_ROOT/data/session-handoffs"
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# ── Ensure registry exists ───────────────────────────────────────────
mkdir -p "$(dirname "$REGISTRY_FILE")"
if [[ ! -f "$REGISTRY_FILE" ]]; then
  echo '{"sessions":{},"lastCleanup":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","version":1}' > "$REGISTRY_FILE"
fi

# ── Gather session info ─────────────────────────────────────────────
BRANCH=$(cd "$PROJECT_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
PID=$$
CWD=$(pwd)
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
SESSION_ID="${PID}-$(date +%s)"

# Check if we're in a worktree
WORKTREE=""
GIT_COMMON=$(cd "$PROJECT_ROOT" && git rev-parse --git-common-dir 2>/dev/null || echo "")
GIT_TOPLEVEL=$(cd "$PROJECT_ROOT" && git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ "$GIT_COMMON" != ".git" && "$GIT_COMMON" != "$GIT_TOPLEVEL/.git" ]]; then
  WORKTREE="$GIT_TOPLEVEL"
fi

# ── Register in registry ────────────────────────────────────────────
python3 -c "
import json, os
f = '$REGISTRY_FILE'
now = '$NOW'
with open(f) as fh:
    reg = json.load(fh)

# Clean stale sessions (>5min without heartbeat)
from datetime import datetime, timezone, timedelta
cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
stale = []
for sid, s in reg.get('sessions', {}).items():
    try:
        seen = datetime.fromisoformat(s['lastSeen'].replace('Z', '+00:00'))
        if seen < cutoff:
            stale.append(sid)
    except:
        stale.append(sid)
for sid in stale:
    reg['sessions'][sid]['status'] = 'stale'

# Register this session
reg['sessions']['$SESSION_ID'] = {
    'id': '$SESSION_ID',
    'pid': $PID,
    'branch': '$BRANCH',
    'cwd': '$CWD',
    $([ -n "$WORKTREE" ] && echo "'worktree': '$WORKTREE'," || true)
    'taskDescription': '',
    'modifiedFiles': [],
    'status': 'active',
    'startedAt': now,
    'lastSeen': now,
    'toolCallCount': 0,
    'holdsGatewayLock': False
}
with open(f, 'w') as fh:
    json.dump(reg, fh, indent=2)
" 2>/dev/null

# ── Output awareness context (injected into Claude's context) ───────
echo "[SESSION COORDINATION]"
echo "Session ID: $SESSION_ID"
echo "Branch: $BRANCH"
if [[ -n "$WORKTREE" ]]; then
  echo "Worktree: $WORKTREE"
fi

# Other active sessions
python3 -c "
import json
with open('$REGISTRY_FILE') as f:
    reg = json.load(f)
active = [(sid, s) for sid, s in reg.get('sessions', {}).items()
          if s.get('status') == 'active' and s.get('id') != '$SESSION_ID']
if active:
    print(f'OTHER ACTIVE SESSIONS ({len(active)}):')
    for sid, s in active:
        task = s.get('taskDescription', 'unnamed')
        branch = s.get('branch', '?')
        files = len(s.get('modifiedFiles', []))
        lock = ' [HOLDS GATEWAY LOCK]' if s.get('holdsGatewayLock') else ''
        wt = ' (worktree)' if s.get('worktree') else ''
        print(f'  - \"{task}\" on {branch} ({files} files modified){wt}{lock}')
    print()
    print('COORDINATION RULES:')
    print('  - Do NOT edit files another session is modifying')
    print('  - Do NOT restart gateway without checking session.checkConflict')
    print('  - Use a DIFFERENT branch if working on a different task')
else:
    print('No other active sessions.')
" 2>/dev/null

# Recent handoffs
if [[ -d "$HANDOFF_DIR" ]]; then
  RECENT=$(ls -t "$HANDOFF_DIR"/*.json 2>/dev/null | head -3)
  if [[ -n "$RECENT" ]]; then
    echo ""
    echo "RECENT HANDOFFS:"
    for hf in $RECENT; do
      python3 -c "
import json
with open('$hf') as f:
    h = json.load(f)
task = h.get('taskDescription', 'No description')
branch = h.get('branch', '?')
status = h.get('status', '?')
notes = h.get('notes', '')[:100]
files = len(h.get('modifiedFiles', []))
print(f'  - [{status}] \"{task}\" on {branch} ({files} files) — {notes}')
" 2>/dev/null
    done
  fi
fi

# Branch safety warning
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo ""
  echo "WARNING: You are on '$BRANCH'. Create a feature branch before making changes:"
  echo "  git checkout -b feat/<task-slug>"
fi

echo "[/SESSION COORDINATION]"
