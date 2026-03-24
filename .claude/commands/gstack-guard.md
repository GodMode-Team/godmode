---
description: "[gstack] Full safety mode — destructive command warnings + directory-scoped edits"
---


# /guard — Full Safety Mode

Activates both destructive command warnings and directory-scoped edit restrictions.
This is the combination of `/careful` + `/freeze` in a single command.

**Dependency note:** This skill combines the guardrail logic from both the `/careful`
and `/freeze` skills. Both must be available.

## GodMode Guardrails

This skill activates **two guardrails** simultaneously in GodMode/OpenClaw:

### Guardrail 1: Destructive Command Check (from /careful)

Before every `exec` call that runs a shell command, inspect the command string for
destructive patterns. If a match is found:
1. Warn the user with a clear message about what destructive pattern was detected
2. Ask the user whether to proceed or cancel
3. Only execute the command if the user explicitly confirms

See `/careful` for the full list of destructive command patterns and safe exceptions.

### Guardrail 2: Freeze Boundary Check (from /freeze)

Before every `exec` call that writes or edits a file, inspect the target file path
and verify it falls within the freeze boundary. If the file is outside the allowed
directory, **deny** the operation entirely.

See `/freeze` for how edit boundary enforcement works.

## Setup

Prompt the user: "Guard mode: which directory should edits be restricted to? Destructive command warnings are always on. Files outside the chosen path will be blocked from editing."

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

Tell the user:
- "**Guard mode active.** Two protections are now running:"
- "1. **Destructive command warnings** -- rm -rf, DROP TABLE, force-push, etc. will warn before executing (you can override)"
- "2. **Edit boundary** -- file edits restricted to `<path>/`. Edits outside this directory are blocked."
- "To remove the edit boundary, run `/unfreeze`. To deactivate everything, end the session."

## What's protected

See `/careful` for the full list of destructive command patterns and safe exceptions.
See `/freeze` for how edit boundary enforcement works.
