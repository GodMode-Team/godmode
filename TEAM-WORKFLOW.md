# GodMode Team Workflow

How our team develops GodMode together. This is the plain-English version — no engineering degree required.

---

## The 30-Second Version

1. **See a bug?** Open Claude Code, type `/bug` and describe it. Claude files the GitHub Issue for you.
2. **Want to fix something?** Type `/fix 42` (or `/fix next`). Claude creates a branch, fixes it, runs the checks, pushes, and opens a PR.
3. **Review PRs?** Type `/pr-review` to see what's waiting. Review it, approve it, merge it.
4. **Stay current?** Type `/sync` to pull the latest code and rebuild.

That's the whole workflow. Claude does the git stuff. You just describe problems and review solutions.

---

## Setup (One-Time, Per Person)

### Prerequisites
- **Claude Code** installed and working (`claude` command in terminal)
- **GitHub CLI** installed (`gh` — run `gh auth status` to check)
- **Node.js 22+** and **pnpm** installed
- Access to the `GodMode-Team/godmode-plugin` repo (ask Caleb if you get a 404)

### Clone and build
```bash
git clone https://github.com/GodMode-Team/godmode-plugin.git
cd godmode-plugin
pnpm install
pnpm build
```

### Verify your setup
```bash
gh auth status          # should show your GitHub username
gh repo view GodMode-Team/godmode-plugin --json name   # should return the repo name
pnpm typecheck          # should pass with no errors
```

If any of those fail, fix them before proceeding.

---

## The 4 Commands You Need

Open Claude Code in the `godmode-plugin` directory and use these slash commands:

### `/bug` — Report a bug
Just describe the problem. Paste a screenshot, an error message, or even just "the dashboard is broken." Claude will:
- Check if someone already filed this bug
- Investigate the code to find the likely cause
- Create a GitHub Issue with all the details

**Examples:**
```
/bug the trust tracker shows NaN when there are no interactions
/bug memory search returns empty results even though I just added facts
/bug [paste screenshot of broken UI]
```

### `/fix` — Fix a bug
Point Claude at an issue and let it work. Claude will:
- Read the issue
- Create a branch from latest `main`
- Find and fix the bug
- Run typecheck + build to make sure nothing's broken
- Push the branch and open a PR

**Examples:**
```
/fix 42                    # fix issue #42
/fix next                  # pick the highest priority open bug
/fix memory search broken  # search for a matching issue and fix it
```

### `/pr-review` — Review pull requests
See what PRs are open and review them. Claude will:
- Show you all open PRs with their CI status
- Deep-review any specific PR you pick
- Check for correctness, scope creep, and build safety
- Help you approve and merge when ready

**Examples:**
```
/pr-review                 # show all open PRs
/pr-review 15              # deep review PR #15
/pr-review all             # review everything that's open
```

### `/sync` — Get the latest code
Pull the latest `main`, rebuild, and see what changed. Claude will:
- Check if you have uncommitted work (and help you save it)
- Show you what's new before pulling
- Pull, install dependencies, rebuild
- Show you any new issues or PRs that need attention

**Examples:**
```
/sync                      # pull latest and rebuild
/sync status               # just check what's new without pulling
```

---

## What's Enforced Automatically

You don't need to remember these rules — they're programmatically enforced:

| Rule | How it's enforced | What happens if you try |
|---|---|---|
| No editing code on `main` | Claude Code hook (`branch-guard.sh`) | Edit is blocked, Claude creates a branch |
| No `git stash` | Claude Code hook (`pre-tool-check.sh`) | Stash is blocked, told to commit instead |
| No force push | Claude Code hook (`pre-tool-check.sh`) | Warning is shown |
| Code must typecheck | GitHub Actions CI | PR can't be merged until it passes |
| Code must build | GitHub Actions CI | PR can't be merged until it passes |
| No forbidden imports | GitHub Actions CI | PR can't be merged until it passes |
| PRs require 1 review | GitHub branch protection | Can't merge without approval |
| All CI must pass before merge | GitHub branch protection | Merge button is disabled |

---

## Daily Routine

### Morning (2 minutes)
```
/sync                      # get latest code
/pr-review                 # anything waiting for review?
```

### When you spot a bug (30 seconds)
```
/bug <describe what's wrong>
```

### When you want to fix something (let Claude cook)
```
/fix <issue number or "next">
```

### End of day (1 minute)
```
/pr-review                 # review and merge what's ready
```

---

## Rules for Humans

There are only 3 things the automation can't do for you:

1. **Notice bugs.** If something looks wrong, file it with `/bug`. Don't assume someone else saw it.
2. **Review PRs.** At least one person must approve before merging. Use `/pr-review` to help — Claude explains what changed and whether it's safe.
3. **Don't sit on PRs.** If a PR is open for more than a day, review it. Stale PRs cause merge conflicts.

---

## Troubleshooting

### "I'm on main and Claude won't let me edit"
Good — that's the branch guard working. Tell Claude what you want to do and it'll create a branch.

### "My PR CI is failing"
Run `/fix` on your own PR's branch, or just ask Claude Code to "fix the typecheck errors on this branch."

### "I have merge conflicts"
Run `/sync` and Claude will help you rebase your branch onto the latest `main`.

### "I don't know what issues exist"
Ask Claude: "Show me all open issues" — or run `gh issue list` directly.

### "Someone else is already fixing the same thing"
That's what GitHub Issues prevents. Before fixing, `/fix` checks if the issue is already assigned. If it is, pick a different one.

### "I need to update my GodMode install after a merge"
After a PR merges, everyone should run `/sync` to get the new code. This rebuilds the plugin so you're running the latest version.
