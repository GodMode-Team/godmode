#!/usr/bin/env bash
# Claude Code Stop hook — updates session registry and creates handoff.
#
# Runs when Claude finishes responding. Updates the heartbeat and
# tracks any new file modifications mentioned in the conversation.

set -euo pipefail

GODMODE_ROOT="${GODMODE_ROOT:-$HOME/godmode}"
REGISTRY_FILE="$GODMODE_ROOT/data/session-registry.json"
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Skip if no registry
[[ ! -f "$REGISTRY_FILE" ]] && exit 0

# Read the Stop event from stdin (contains conversation metadata)
INPUT=$(cat 2>/dev/null || echo "{}")

# Find our session and update heartbeat
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BRANCH=$(cd "$PROJECT_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Get modified files from git status
MODIFIED=$(cd "$PROJECT_ROOT" && git diff --name-only HEAD 2>/dev/null | head -20 || echo "")

python3 -c "
import json, os
f = '$REGISTRY_FILE'
with open(f) as fh:
    reg = json.load(fh)

pid = os.getpid()
# Find session by PID prefix (our parent process)
ppid = os.getppid()
found = None
for sid, s in reg.get('sessions', {}).items():
    # Match by PID (session-start sets this)
    if str(s.get('pid', '')) == str(ppid) or sid.startswith(str(ppid) + '-'):
        found = sid
        break

if not found:
    # Try matching any active session on same branch
    branch = '$BRANCH'
    for sid, s in reg.get('sessions', {}).items():
        if s.get('status') == 'active' and s.get('branch') == branch:
            found = sid
            break

if found:
    s = reg['sessions'][found]
    s['lastSeen'] = '$NOW'
    s['branch'] = '$BRANCH'
    # Update modified files
    modified = '''$MODIFIED'''.strip().split('\n')
    modified = [m.strip() for m in modified if m.strip()]
    existing = set(s.get('modifiedFiles', []))
    for m in modified:
        existing.add(m)
    s['modifiedFiles'] = sorted(existing)
    with open(f, 'w') as fh:
        json.dump(reg, fh, indent=2)
" 2>/dev/null

exit 0
