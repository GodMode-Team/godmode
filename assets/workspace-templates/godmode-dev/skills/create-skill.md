---
name: Create GodMode Skill
trigger: manual
persona: ops-runner
taskType: ops
priority: normal
---

Create a new GodMode skill file. Follow the Anthropic skill-creator methodology.

## Process

1. **Capture intent** — What should this skill do? When should it trigger? What's the output?
2. **Research** — Check existing skills in `assets/skills/` for patterns. Check agent roster in `assets/agent-roster/` for the right persona.
3. **Write the skill** — Create a markdown file with YAML frontmatter:
   - `name`: Human-readable name
   - `trigger`: `manual`, `cron`, or `event`
   - `schedule`: Cron expression if trigger is `cron` (e.g., "daily 9am", "weekly monday 9am", "every 4h")
   - `persona`: Which agent-roster persona runs this (e.g., `researcher`, `content-writer`, `ops-runner`)
   - `taskType`: Queue item type (e.g., `research`, `creative`, `ops`, `analysis`, `task`)
   - `priority`: `high`, `normal`, or `low`
4. **Test** — Queue the skill manually and verify the output meets expectations.
5. **Iterate** — Refine the instructions based on agent output quality.

## Quality Checklist

- [ ] Instructions are specific enough that any agent can follow them without clarification
- [ ] Evidence requirements are defined (how do you know the output is good?)
- [ ] The right persona is assigned (check `assets/agent-roster/` for capabilities)
- [ ] Schedule makes sense for the task cadence
- [ ] No scope creep — if this needs TypeScript, it's not a skill, it's engine code

## Reference

Anthropic's official skill-creator methodology: `github.com/anthropics/skills/tree/main/skills/skill-creator`
