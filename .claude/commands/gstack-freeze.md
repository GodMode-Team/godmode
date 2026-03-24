---
description: "[gstack] Restrict file edits to a specific directory for the session"
---


# /freeze — Restrict Edits to a Directory

Lock file edits to a specific directory. Any file write operation targeting
a file outside the allowed path will be **blocked** (not just warned).

## GodMode Guardrail

This skill operates as a **guardrail** in GodMode/OpenClaw. Before every `exec` call
that writes or edits a file, the guardrail logic must inspect the target file path
and verify it falls within the freeze boundary. If the file is outside the allowed
directory, the guardrail should **deny** the operation entirely (not just warn).

The guardrail applies to all file write/edit operations via `exec`.

## Setup

Prompt the user: "Which directory should I restrict edits to? Files outside this path will be blocked from editing."

The user types a path as free text.

Once the user provides a directory path:

1. Resolve it to an absolute path:
```bash
FREEZE_DIR=$(cd "<user-provided-path>" 2>/dev/null && pwd)
echo "$FREEZE_DIR"
```

2. Ensure trailing slash and save to the freeze state file:
```bash
FREEZE_DIR="${FREEZE_DIR%/}/"
STATE_DIR="${GODMODE_PLUGIN_DATA:-$HOME/.godmode}"
mkdir -p "$STATE_DIR"
echo "$FREEZE_DIR" > "$STATE_DIR/freeze-dir.txt"
echo "Freeze boundary set: $FREEZE_DIR"
```

Tell the user: "Edits are now restricted to `<path>/`. Any file write
outside this directory will be blocked. To change the boundary, run `/freeze`
again. To remove it, run `/unfreeze` or end the session."

## How it works

The guardrail reads the target file path from file write/edit operations, then checks
whether the path starts with the freeze directory. If not, it blocks the operation.

The freeze boundary persists for the session via the state file. The guardrail
reads it on every file write invocation.

## Notes

- The trailing `/` on the freeze directory prevents `/src` from matching `/src-old`
- Freeze applies to file write/edit operations only -- read operations and search are unaffected
- This prevents accidental edits, not a security boundary -- shell commands like `sed` can still modify files outside the boundary
- To deactivate, run `/unfreeze` or end the conversation
