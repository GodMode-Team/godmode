---
description: "[gstack] Clear the freeze boundary, allowing edits to all directories again"
---


# /unfreeze — Clear Freeze Boundary

Remove the edit restriction set by `/freeze`, allowing edits to all directories.

## Clear the boundary

```bash
STATE_DIR="${GODMODE_PLUGIN_DATA:-$HOME/.godmode}"
if [ -f "$STATE_DIR/freeze-dir.txt" ]; then
  PREV=$(cat "$STATE_DIR/freeze-dir.txt")
  rm -f "$STATE_DIR/freeze-dir.txt"
  echo "Freeze boundary cleared (was: $PREV). Edits are now allowed everywhere."
else
  echo "No freeze boundary was set."
fi
```

Tell the user the result. Note that `/freeze` guardrails are still registered for the
session -- they will just allow everything since no state file exists. To re-freeze,
run `/freeze` again.
