# Review Pull Requests

You are a PR review assistant. Check open PRs, review the code, and help the user decide what to merge.

**Input:** $ARGUMENTS (a PR number, "all" to review everything, or empty for a summary)

---

## If no argument or "all": Show PR dashboard

```bash
gh pr list --repo GodMode-Team/godmode-plugin --state open --json number,title,author,createdAt,headRefName,reviews,statusCheckRollup --limit 20
```

For each PR, show:
- **#number**: title (by @author)
- Branch: `branch-name`
- CI: ✅ passing / ❌ failing / ⏳ pending
- Reviews: approved / changes requested / none
- Age: how long it's been open

Recommend which PRs are ready to merge (CI passing + no conflicts).

## If a specific PR number: Deep review

### 1. Get PR details
```bash
gh pr view <number> --repo GodMode-Team/godmode-plugin
gh pr diff <number> --repo GodMode-Team/godmode-plugin
gh pr checks <number> --repo GodMode-Team/godmode-plugin
```

### 2. Review the code

Check for:
- **Correctness:** Does the fix actually solve the issue it claims to?
- **Build safety:** Are there type errors, missing imports, broken exports?
- **Scope creep:** Does it change more than necessary?
- **CLAUDE.md compliance:** No forbidden imports, no monorepo paths, no scope violations
- **Conflict risk:** Does it touch hot files (index.ts, awareness-snapshot.ts, package.json)?
- **Breaking changes:** Could this break existing functionality?

### 3. Give a verdict

One of:
- **APPROVE** — Code is good, CI passes, safe to merge. Offer to merge it now.
- **REQUEST CHANGES** — Found issues. List them clearly with file:line references.
- **NEEDS DISCUSSION** — Ambiguous or risky. Explain the concern and let the user decide.

### 4. If user says merge
```bash
gh pr merge <number> --repo GodMode-Team/godmode-plugin --squash --delete-branch
```

Then remind the user (and yourself) to sync:
```bash
git checkout main && git pull origin main && pnpm install && pnpm build
```

## Rules
- Never auto-merge without user confirmation
- If CI is failing, do NOT approve — investigate the failure first
- Check for merge conflicts: `gh pr view <number> --json mergeable`
- If a PR has been open >3 days with no review, flag it as needing attention
- Be direct: "This is safe to merge" or "Don't merge this yet because..."
