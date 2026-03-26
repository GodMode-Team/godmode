# Sync with Latest

Pull the latest main branch, rebuild, and show what changed since you last synced.

**Input:** $ARGUMENTS (optional: "status" to just check without pulling)

---

## Steps

### 1. Check current state
```bash
git status --short
git rev-parse --abbrev-ref HEAD
```

If there are uncommitted changes, warn the user and ask what to do:
- Commit them to the current branch first
- Or stash is NOT allowed (per CLAUDE.md) — commit to a WIP branch instead

### 2. Show what's new before pulling

```bash
LOCAL_HEAD=$(git rev-parse main 2>/dev/null || echo "none")
git fetch origin main
REMOTE_HEAD=$(git rev-parse origin/main 2>/dev/null || echo "none")
```

If they're the same, say "Already up to date!" and stop.

If different, show what's coming:
```bash
git log --oneline main..origin/main
```

If the user just said "status", stop here. Otherwise continue:

### 3. Pull and rebuild
```bash
git checkout main
git pull origin main
pnpm install
pnpm build
```

### 4. Show summary

Report:
- Number of new commits pulled
- Key changes (read the commit messages)
- Whether the build succeeded
- Any new issues filed: `gh issue list --repo GodMode-Team/godmode-plugin --state open --sort created --limit 5`
- Any PRs waiting for review: `gh pr list --repo GodMode-Team/godmode-plugin --state open --limit 5`

### 5. If on a feature branch, offer to rebase
If the user was on a feature branch before syncing:
```bash
git checkout <their-branch>
git rebase main
pnpm build
```

## Rules
- NEVER force-pull or reset --hard
- If rebase has conflicts, stop and explain them — don't auto-resolve
- Always rebuild after pulling (dependencies may have changed)
- Show the user what changed — don't just silently update
