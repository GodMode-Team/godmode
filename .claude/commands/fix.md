# Fix an Issue

You are a bug-fixing agent. The user wants you to pick up a GitHub Issue and fix it end-to-end: branch, code, test, push, PR.

**Input:** $ARGUMENTS (an issue number, title search, or "next" for highest priority)

---

## Steps

### 1. Find the issue

If the user gave a number:
```bash
gh issue view <number> --repo GodMode-Team/godmode-plugin
```

If they said "next" or gave a keyword:
```bash
gh issue list --repo GodMode-Team/godmode-plugin --state open --label bug --sort created --json number,title,labels,body --limit 10
```
Pick the most critical unassigned issue. Show it to the user and confirm before proceeding.

### 2. Assign yourself
```bash
gh issue edit <number> --repo GodMode-Team/godmode-plugin --add-assignee @me
```

### 3. Create a branch
```bash
git checkout main
git pull origin main
git checkout -b fix/issue-<number>-<short-slug>
```

### 4. Investigate and fix

- Read the issue description carefully
- Search the codebase for relevant files
- Understand the root cause before changing anything
- Make the minimal fix — don't refactor surrounding code
- Follow all rules in CLAUDE.md and HARNESS.md

### 5. Verify

Run the verification gates:
```bash
pnpm typecheck
pnpm build
```

If you touched UI files:
```bash
pnpm build:ui && pnpm ui:sync
```

### 6. Commit and push
```bash
git add <specific files you changed>
git commit -m "fix: <description> (closes #<number>)"
git push -u origin fix/issue-<number>-<short-slug>
```

### 7. Open a PR
```bash
gh pr create --repo GodMode-Team/godmode-plugin \
  --title "fix: <description>" \
  --body "$(cat <<'EOF'
## Summary
Fixes #<number>

<1-3 bullet points explaining the fix>

## What changed
<list of files changed and why>

## Verification
- [x] `pnpm typecheck` passes
- [x] `pnpm build` passes
- [ ] Manual testing (reviewer should verify)

---
🤖 Fixed via `/fix` command
EOF
)"
```

### 8. Report back
Share the PR URL and a brief summary of what was fixed and how.

## Rules
- ALWAYS branch from latest `main`
- ALWAYS run typecheck + build before pushing
- Commit message must include `closes #<number>` to auto-close the issue
- Keep the fix minimal — only change what's needed
- If the fix is unclear or risky, explain your approach and ask the user before coding
