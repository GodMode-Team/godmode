# Harness — Agent Workflow Contract

How agents work in this repo. CLAUDE.md covers the codebase. SESSION docs cover specific tasks. This file covers the workflow — branching, building, merging, handing off.

---

## 1. Before You Start

- **Branch from latest HEAD.** Run `git fetch && git checkout <target-branch> && git pull` before creating your branch. Never fork from a stale commit — it creates merge conflicts downstream.
- **Check for active sessions.** The session-start hook shows other active sessions and their files. Don't edit files another session is modifying.
- **Read RECENT-CHANGES.md** (top section) to know what's current.
- **One branch per task.** Name it `feat/<slug>`, `fix/<slug>`, or `chore/<slug>`. Never work directly on `main`.

## 2. While You Work

### Commits
- **Commit after each logical unit**, not at the end. Small commits are cheaper to cherry-pick if a merge goes sideways.
- **Message format:** `type: concise description` where type is `feat`, `fix`, `chore`, or `docs`.
- For non-trivial changes, include a body with evidence: what was broken, what was tested, what files are affected.

### Build Checks
- Run `pnpm typecheck` after any `.ts` file change. Catches type errors before they compound.
- Run `pnpm build` before any merge, PR, or handoff. This is the gate.
- If UI changed: `pnpm build:ui && pnpm ui:sync` to rebuild and refresh the fallback snapshot.

### Hot Files (Conflict Magnets)
These files change in almost every session. When touching them, minimize your diff and keep changes additive:

| File | Why it's hot | How to stay safe |
|------|-------------|-----------------|
| `index.ts` | Hook registration, handler wiring, service startup | Add at the end of existing blocks, don't reorganize |
| `src/lib/awareness-snapshot.ts` | Every feature wants context injection | Add new sections at the bottom, before the final `lines.join` |
| `RECENT-CHANGES.md` | Every session appends | Always prepend your entry at the top (after the `---`) |
| `package.json` | Version bumps, file globs | Keep changes additive to arrays |
| `assets/godmode-ui/*` | Build artifacts with hashed filenames | Never hand-edit. Always rebuild with `pnpm build:ui && pnpm ui:sync` |

## 3. Verification Gates — What "Done" Means

Before committing your final change, every gate must pass:

```
[ ] pnpm typecheck                          # No type errors
[ ] pnpm build                              # Clean build
[ ] rg "\.\./\.\./\.\./\.\./src/" -n        # No forbidden monorepo imports
[ ] RECENT-CHANGES.md updated               # Document what you changed
```

**Conditional gates** (only if you touched these areas):

```
[ ] UI changed → pnpm build:ui && pnpm ui:sync
[ ] Context injection changed → snapshot stays under ~60 lines worst-case
[ ] Handlers changed → RPC methods still export from index.ts
[ ] Version bump needed → both package.json AND openclaw.plugin.json
```

## 4. Merge & Conflict Resolution

### Strategy
- **Cherry-pick > merge** when a branch is behind HEAD. A merge inherits the stale base and creates noise in the diff. A cherry-pick applies only the new work.
- **Merge order matters**: clean merges first (same base as HEAD), then conflicting branches in size order (most files first).
- **Build between every merge.** Don't batch — a broken merge buried under two more merges is 3x harder to debug.

### Common Conflict Patterns

**UI build artifacts** (`assets/godmode-ui/assets/index-*.js`, `index.html`):
Keep HEAD's version. Delete the incoming branch's hashed file. Rebuild at the end with `pnpm build:ui && pnpm ui:sync`.

**RECENT-CHANGES.md**:
Keep both entries. HEAD's entry stays on top, incoming entry goes below it. Both get a `---` separator.

**awareness-snapshot.ts** (multiple branches add sections):
Keep all sections from both sides. New sections go at the bottom of the section list, before the final `lines.join("\n")` and disk write.

**package.json** (`files` array, version):
Combine additive changes — if both sides add entries to the `files` array, keep all of them. For version conflicts, take the higher version.

**index.ts** (handler registration, hook wiring):
Both sides usually ADD handlers/hooks. Keep both additions. Check for duplicate registrations.

## 5. Handoff Protocol

When your session ends (or you need to pass work to another agent):

- **Commit everything** to your branch — even WIP. Never stash. Uncommitted worktree changes are invisible to other sessions.
- **Write a handoff note** as either:
  - A RECENT-CHANGES.md entry, or
  - A commit message body describing: what's done, what's remaining, any blockers
- **If in a worktree**: Always commit before leaving. The merge session learned this the hard way — `worktree-team-workspaces` had 0 commits and required manual intervention.

### Handoff Note Template
```
## Handoff: [branch-name]
Done: [what's complete and passing]
Remaining: [what's left]
Blockers: [anything that needs human input]
Hot files touched: [list any conflict magnets you modified]
Build status: [passing/failing + what's broken]
```

---

## Why This Exists

OpenAI's harness engineering principle: *"Early progress was slower than expected — not because agents were incapable, but because the environment was underspecified."*

This file specifies the environment. Agents that follow it produce clean, mergeable work. Agents that don't create the kind of 19-conflict merge session that inspired this document.
