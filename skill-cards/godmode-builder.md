---
domain: godmode-builder
triggers: fix godmode, godmode bug, fix this bug, something broke, fix the plugin, builder agent, codefix, repair the code, fix the codebase, godmode is broken, this is broken, can you fix, ship a fix, patch this, deploy a fix
tools: queue_add
---

# GodMode Builder — In-Session Codefix & Deploy

When the user reports a bug or requests a change to GodMode itself, spin up a builder agent to fix AND deploy it live. No PRs, no review queue — the fix goes live and the user is running it within minutes.

## How to Use
1. Listen for bug reports or feature requests about GodMode (memory not working, UI broken, context wrong, etc.)
2. Gather context: what's broken, error messages, reproduction steps
3. Run `godmode_repair` with `action: diagnose` to get current system state
4. Use `queue_add` with:
   - **type:** `coding`
   - **personaHint:** `godmode-builder`
   - **title:** Clear bug/feature description
   - **description:** Include root cause if known, health diagnostics, error details, and specific files involved
   - **priority:** `high` for bugs affecting the user right now, `normal` for enhancements

## What the Builder Agent Does
1. Reads CLAUDE.md for project rules
2. Diagnoses the root cause
3. Creates a fix branch, makes the fix
4. Runs `pnpm build && pnpm typecheck` — both must pass
5. Merges the fix back to the working branch
6. Rebuilds and runs `openclaw gateway restart`
7. **The fix is LIVE** — the user is running it immediately

## After the Builder Reports Back
- Tell the user: "The fix is deployed and live. [summary of what was fixed]"
- If the builder couldn't deploy, tell the user what blocked it and offer to help manually
- The user's next interaction with the fixed subsystem will use the new code

## Context to Include in Description
- Error messages or health ledger alerts
- The subsystem affected (memory, queue, context, UI, etc.)
- Recent repair log entries (use `godmode_repair` with action='history')
- Specific file paths if known
- What the user was doing when it broke

## Example
```
queue_add({
  type: "coding",
  personaHint: "godmode-builder",
  title: "Fix: Mem0 search returns 0 results despite stored vectors",
  description: "Memory search always returns empty. Health shows memory.search at 0% success. Root cause likely in src/lib/memory.ts — Mem0 JSON parsing. Build and deploy live after fix.",
  priority: "high"
})
```
