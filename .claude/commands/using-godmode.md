---
description: "[godmode] Master skill loader — check this before ANY task to find the right skill for the job"
---

# Using GodMode Skills

You have access to three skill libraries. Before responding to ANY task — even clarifying questions — scan this list and invoke the matching skill.

**If there's even a 1% chance a skill applies, invoke it.**

## Skill Libraries

### Superpowers (Process Discipline)
These control HOW you work. Use process skills BEFORE implementation skills.

| Command | When to Use |
|---------|-------------|
| `/brainstorming` | Before ANY creative work — features, components, modifications |
| `/writing-plans` | Multi-step task with specs? Write the plan before touching code |
| `/executing-plans` | You have a written plan to execute |
| `/systematic-debugging` | Any bug, test failure, unexpected behavior |
| `/test-driven-development` | Implementing any feature or bugfix |
| `/subagent-driven-development` | Multiple independent implementation tasks |
| `/dispatching-parallel-agents` | 2+ independent tasks, no shared state |
| `/verification-before-completion` | About to claim "done"? Verify first |
| `/finishing-a-development-branch` | Implementation complete, tests pass, time to integrate |
| `/receiving-code-review` | Got review feedback to process |
| `/requesting-code-review` | Completed work, need review |
| `/using-git-worktrees` | Need isolation for feature work |
| `/writing-skills` | Creating or editing skills |

### GStack (Development Workflow)
Battle-tested workflows from Garry Tan. These are concrete action skills.

| Command | When to Use |
|---------|-------------|
| `/gstack-office-hours` | New idea? YC-style forcing questions first |
| `/gstack-plan-ceo-review` | Review a plan through founder lens (Bezos/Grove/Jobs/Munger) |
| `/gstack-plan-eng-review` | Review a plan through engineering manager lens |
| `/gstack-plan-design-review` | Review a plan through designer's eye |
| `/gstack-design-consultation` | Create a full design system |
| `/gstack-design-review` | Visual design audit (80+ checklist items) |
| `/gstack-review` | Pre-landing code review |
| `/gstack-qa` | Full QA cycle (test → find → fix → verify) |
| `/gstack-qa-only` | QA report only, no fixing |
| `/gstack-investigate` | Root cause debugging (4-phase) |
| `/gstack-ship` | Ship it: merge, test, version, changelog, push, PR |
| `/gstack-document-release` | Post-ship: sync README, ARCHITECTURE, CHANGELOG |
| `/gstack-retro` | Weekly retrospective from commit history |
| `/gstack-browse` | Headless browser testing |
| `/gstack-codex` | OpenAI Codex adversarial review |
| `/gstack-careful` | Warn before destructive commands |
| `/gstack-freeze` | Lock edits to one directory |
| `/gstack-guard` | Full safety mode (careful + freeze) |
| `/gstack-unfreeze` | Clear edit restrictions |

### GodMode Project Skills
These are specific to the GodMode plugin codebase.

| Command | When to Use |
|---------|-------------|
| `/bug` | File a GitHub issue |
| `/fix` | Pick up an issue, branch, fix, PR |
| `/pr-review` | Review and merge PRs |
| `/sync` | Pull latest, rebuild, see changes |
| `/simplify` | Review changed code for quality |
| `/bug-hunt` | 3-phase adversarial bug hunt |

## Workflow Sequences

For complex work, chain skills in order:

**New Feature:**
`/brainstorming` → `/writing-plans` → `/gstack-plan-eng-review` → `/executing-plans` → `/gstack-review` → `/gstack-qa` → `/verification-before-completion` → `/gstack-ship`

**Bug Fix:**
`/systematic-debugging` → `/gstack-investigate` → `/test-driven-development` → `/verification-before-completion` → `/gstack-ship`

**Design Work:**
`/gstack-office-hours` → `/gstack-design-consultation` → `/gstack-plan-design-review` → `/gstack-design-review`

**Shipping:**
`/gstack-review` → `/gstack-qa` → `/verification-before-completion` → `/gstack-ship` → `/gstack-document-release`

**Weekly Review:**
`/gstack-retro`

## Red Flags

If you think any of these, STOP — you're skipping a skill:

- "This is just a quick fix" → `/systematic-debugging` first
- "I know what to build" → `/brainstorming` first
- "Let me just code it" → `/writing-plans` first
- "It works, ship it" → `/verification-before-completion` first
- "I'll test later" → `/test-driven-development` — tests come FIRST
