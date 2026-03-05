# Session: Review & Merge All v1.6.0 Overnight Branches

## What This Session Is

Five overnight sessions ran in worktrees. You are reviewing each branch's changes, verifying quality, merging them into `feat/v1.6.0-content`, resolving conflicts, and producing a clean build.

## CRITICAL: Read These Files First

1. `CLAUDE.md` — build instructions, coding guardrails
2. `RECENT-CHANGES.md` — current state
3. `docs/GODMODE-META-ARCHITECTURE.md` — product blueprint (skim sections 0-3)

## Branch State

**Target branch:** `feat/v1.6.0-content` at commit `82614fd`

### The 5 Branches (merge in this order)

| # | Branch | Commits | Files | Merge Base | Notes |
|---|--------|---------|-------|------------|-------|
| 1 | `feat/v1.6.0-product-polish` | 2 | 31 | `82614fd` (HEAD) | Clean — branched from current HEAD |
| 2 | `worktree-security-hardening` | 1 | 69 | `e29f01d` (3 behind) | Will have conflicts |
| 3 | `worktree-v1.6.0-identity-audit` | 1 | 49 | `e29f01d` (3 behind) | Will have conflicts |
| 4 | `worktree-queue-pipeline-audit` | 1 | 51 | `e29f01d` (3 behind) | Will have conflicts |
| 5 | `worktree-team-workspaces` | **0 (uncommitted)** | ~8 | `e29f01d` (3 behind) | **Must commit first** |

### Why this merge order matters
- Product Polish is cleanest (branched from HEAD) — merge first
- Security, Identity, Queue all branched from same point — merge in size order (most files first = security, then identity, then queue)
- Team Workspaces has UNCOMMITTED changes — handle last, may need manual review

## Tasks (in order)

### Task 0: Understand the Base

```bash
git checkout feat/v1.6.0-content
git log --oneline -10
```

Read `RECENT-CHANGES.md` to understand what's already in the base branch.

### Task 1: Review & Merge Product Polish

**Branch:** `feat/v1.6.0-product-polish` (2 commits, 31 files, clean merge base)

**Review:**
```bash
git log feat/v1.6.0-content..feat/v1.6.0-product-polish --oneline
git diff feat/v1.6.0-content..feat/v1.6.0-product-polish --stat
```

Read the actual changes in each modified file. Check for:
- [ ] No scope violations (doesn't rebuild CRM, file explorer, calendar, etc.)
- [ ] No permanent context injection added
- [ ] Dashboard improvements are HTML-template-based, not new engine code
- [ ] Goals integration uses existing `goals.ts` RPC handlers
- [ ] UI changes follow 6-tab baseline (Chat, Today, Work, Second Brain, Dashboards, Settings)
- [ ] No regressions to existing working features

**Merge:**
```bash
git checkout feat/v1.6.0-content
git merge feat/v1.6.0-product-polish --no-edit
```

This should be clean (same merge base). If it isn't, investigate why.

**Verify build:**
```bash
pnpm build && pnpm typecheck
```

Fix any errors before proceeding.

### Task 2: Review & Merge Security Hardening

**Branch:** `worktree-security-hardening` (1 commit, 69 files, 3 commits behind)

**Review:**
```bash
git diff feat/v1.6.0-content..worktree-security-hardening --stat
git diff feat/v1.6.0-content..worktree-security-hardening -- src/ # focus on source changes
```

Check for:
- [ ] Private session mode implementation is minimal (flag + skip vault capture + skip snapshot)
- [ ] No over-engineering (no crypto frameworks, no auth rewrites)
- [ ] Path traversal fixes are real (validate paths against allowed roots)
- [ ] HTML sanitization for dashboards uses existing `sanitizeDashboardHtml` or improves it
- [ ] No files deleted that are actually in use
- [ ] Security doc (`SECURITY.md` or similar) is concise and accurate
- [ ] The large deletion count (2945 lines) needs explanation — is it removing dead code or breaking things?

**CRITICAL: The 69 files and 2945 deletions is a red flag.** Read the diff carefully. If this branch deleted working code or made sweeping changes beyond security, cherry-pick only the security-relevant changes instead of merging the whole branch.

**Merge (if review passes):**
```bash
git merge worktree-security-hardening --no-edit
```

Expect conflicts on files changed in both branches. For each conflict:
1. Read both versions
2. Keep the better implementation
3. If both sides added different improvements, combine them

**Verify build:**
```bash
pnpm build && pnpm typecheck
```

Fix any errors before proceeding.

### Task 3: Review & Merge Identity Audit

**Branch:** `worktree-v1.6.0-identity-audit` (1 commit, 49 files, 3 commits behind)

**Review:**
```bash
git diff feat/v1.6.0-content..worktree-v1.6.0-identity-audit --stat
git diff feat/v1.6.0-content..worktree-v1.6.0-identity-audit -- src/hooks/ src/lib/awareness-snapshot.ts
```

Check for:
- [ ] Ally identity changes are refinements, not rewrites (should be ~30 lines)
- [ ] Awareness snapshot enrichments are useful but don't bloat context (stay under ~50 lines)
- [ ] Persona file improvements match frontmatter format from `agent-roster.ts`
- [ ] Skills file improvements match registry format from `skills-registry.ts`
- [ ] Onboarding changes are timing adjustments, not structural rewrites
- [ ] No permanent context injection added (anti-bloat rule)
- [ ] The 2871 deletions need explanation — same red flag as security branch

**CRITICAL: Same warning as security.** If 2871 deletions are removing things that weren't supposed to be removed, cherry-pick only the identity-relevant changes.

**Merge (if review passes):**
```bash
git merge worktree-v1.6.0-identity-audit --no-edit
```

Handle conflicts same as Task 2.

**Verify build:**
```bash
pnpm build && pnpm typecheck
```

### Task 4: Review & Merge Queue Pipeline

**Branch:** `worktree-queue-pipeline-audit` (1 commit, 51 files, 3 commits behind)

**Review:**
```bash
git diff feat/v1.6.0-content..worktree-queue-pipeline-audit --stat
git diff feat/v1.6.0-content..worktree-queue-pipeline-audit -- src/services/queue-processor.ts src/tools/queue-add.ts src/lib/queue-state.ts
```

Check for:
- [ ] Queue processor changes fix real bugs (not just reformatting)
- [ ] Human-in-the-loop flow preserved (confirmed flag in queue_add)
- [ ] Verification gates per task type are meaningful (not just console.logs)
- [ ] Trust score integration doesn't add permanent context
- [ ] Integration health checks are lightweight
- [ ] No regressions to queue add/process/complete flow
- [ ] The 2938 deletions — same red flag

**Merge (if review passes):**
```bash
git merge worktree-queue-pipeline-audit --no-edit
```

**Verify build:**
```bash
pnpm build && pnpm typecheck
```

### Task 5: Handle Team Workspaces

**Branch:** `worktree-team-workspaces` (UNCOMMITTED changes, 3 commits behind)

**This branch is special** — it has uncommitted changes but no commits. First check if the work is substantial enough to merge:

```bash
cd .claude/worktrees/team-workspaces
git status
git diff --stat
git diff  # read actual changes
```

**If the changes are minimal or incomplete:**
- Skip this branch entirely
- Note what was started for a future session
- The team workspaces feature is not blocking v1.6.0

**If the changes are substantial and quality:**
```bash
cd .claude/worktrees/team-workspaces
git add -A
git commit -m "feat: team workspaces — shared memory, GitSync, workspace templates"
```

Then merge from the main worktree:
```bash
cd /Users/calebhodges/Projects/godmode-plugin
git merge worktree-team-workspaces --no-edit
pnpm build && pnpm typecheck
```

### Task 6: Final Verification

After all merges:

```bash
# Full build chain
pnpm build:ui && pnpm ui:sync && pnpm build && pnpm typecheck
```

Everything MUST pass.

Then verify key functionality hasn't regressed by reading critical files:
- `index.ts` — hooks still registered, handlers still exported
- `src/hooks/agent-persona.ts` — ally identity intact (~30 lines)
- `src/lib/awareness-snapshot.ts` — snapshot still ~50 lines
- `src/tools/queue-add.ts` — human-in-the-loop confirmed flag still works
- `src/services/queue-processor.ts` — process loop intact
- `src/services/consciousness-heartbeat.ts` — heartbeat still ticks, cron skills processed
- `ui/src/ui/navigation.ts` — 6-tab baseline intact

### Task 7: Update RECENT-CHANGES.md

Add a comprehensive v1.6.0 section at the top of `RECENT-CHANGES.md`. Cover:

```markdown
## v1.6.0 — Product Foundation (2026-03-05)

### Overnight Audit Results
- Product polish: [summary of what changed — dashboards, goals, daily rhythm, etc.]
- Security hardening: [summary — private sessions, path validation, sanitization, etc.]
- Core identity: [summary — ally rewrite, snapshot enrichment, persona/skill fixes]
- Queue pipeline: [summary — bugs fixed, verification gates, resilience improvements]
- Team workspaces: [summary — or "deferred to v1.7.0" if skipped]

### Engine (Session 3)
- File-based skills directory with cron scheduling
- Verification gates for all task types
- Human-in-the-loop queue scoping
- trust_rate tool wired into registered tools
- Dead weight removed

### UX (Session 4)
- 6-tab baseline: Chat, Today, Work, Second Brain, Dashboards, Settings
- Power-user tabs behind expandable Settings section
- Ally panel sync fix

### Content (Session 5)
- 7 starter personas auto-deployed on first run
- 3 sample cron skills
- Ally identity refined with proactive behaviors
- Quick setup → immediate first win
```

### Task 8: Version Check

Verify version is `1.6.0` in both:
- `package.json`
- `openclaw.plugin.json`

If not, update them.

### Task 9: Clean Up Worktrees

After all merges are complete and verified:

```bash
# Remove merged worktrees
git worktree remove .claude/worktrees/v1.6.0-polish --force 2>/dev/null
git worktree remove .claude/worktrees/security-hardening --force 2>/dev/null
git worktree remove .claude/worktrees/v1.6.0-identity-audit --force 2>/dev/null
git worktree remove .claude/worktrees/queue-pipeline-audit --force 2>/dev/null
git worktree remove .claude/worktrees/team-workspaces --force 2>/dev/null

# Also clean up old worktrees from previous sessions if they exist
git worktree remove .claude/worktrees/agent-a020c9d6 --force 2>/dev/null
git worktree remove .claude/worktrees/agent-acdc69ce --force 2>/dev/null
git worktree remove .claude/worktrees/agent-ad608f5b --force 2>/dev/null

# Prune stale worktree references
git worktree prune
```

### Task 10: Final Commit

If the merge process required any conflict resolutions, fixups, or adjustments beyond the automated merges, create a final commit:

```bash
git add -A
git commit -m "chore: merge all v1.6.0 overnight branches — product polish, security, identity, queue pipeline"
```

## What NOT to Do

- Do NOT merge blindly — read the diffs, especially the large deletion counts
- Do NOT force-push or rewrite history
- Do NOT skip build verification between merges
- Do NOT merge branches that break the build — fix or skip them
- Do NOT add new features — this is a merge/review session only
- Do NOT delete files you don't understand — investigate first
- Do NOT modify code beyond what's needed for conflict resolution
- Do NOT clean up or refactor during merge — separate concern

## Red Flags to Watch For

1. **Large deletion counts** (2800-2900 lines) on 3 branches — these branches forked from 3 commits behind HEAD. The "deletions" may just be the diff including the reverse of those 3 commits. Verify by checking if the merge conflicts are resolvable.

2. **Overlapping changes** — all 4 committed branches likely modified `index.ts`, `awareness-snapshot.ts`, `agent-persona.ts`, and other core files. Merge conflicts are expected. Take the best version of each.

3. **Team workspaces uncommitted** — this branch may have been abandoned mid-work. Don't force incomplete code into the release.

4. **69 files in security branch** — that's a LOT of files for a security audit. Make sure it didn't also do major refactoring that wasn't asked for.

## Success Criteria

- [ ] All quality branches merged into `feat/v1.6.0-content`
- [ ] `pnpm build:ui && pnpm ui:sync && pnpm build && pnpm typecheck` passes
- [ ] No regressions to core functionality (queue, ally, heartbeat, navigation)
- [ ] RECENT-CHANGES.md updated
- [ ] Version is 1.6.0
- [ ] Worktrees cleaned up
- [ ] Ready for final review before merging to main
