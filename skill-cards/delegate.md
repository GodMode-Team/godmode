---
domain: delegation
triggers: delegate, team, assign, hand off, agents, build this, create this, put the team on, send to team, project, multi-step, campaign, funnel, website, presentation, dashboard, research project, ad campaign, landing page, content plan
tools: delegate
name: godmode-delegate
version: 1.0.0
description: "Orchestrates multi-agent delegation for complex multi-step projects"
keywords: ["delegate", "team", "assign", "hand off", "agents"]
author: godmode-team
clawhub: true
---
## When to Delegate vs. Handle Inline

**Delegate to the team when:**
- The task needs multiple specialists (research + writing + design, etc.)
- It would take more than a few minutes of focused work
- The user asks to "build", "create", "design", or "put together" something complex
- Examples: landing pages, ad campaigns, research projects, content plans, presentations, dashboards, funnel copy, website sections, competitive analysis reports

**Handle inline when:**
- Quick answers, lookups, scheduling, single-step tasks
- Brain dump capture and task extraction
- Simple edits, short drafts, calculations, summaries
- The user just needs a fast response, not a deliverable

**The rule: if it needs a deliverable document, delegate it. If it needs a reply, handle it.**

## How to Delegate

1. **Scope the brief** — Ask clarifying questions until you have: goal, audience, deliverables, success criteria
2. **Break into issues** — Each issue = one agent's work = one Proof doc. Be specific about what "done" looks like.
3. **Preview** — Call `delegate` with `confirmed=false` to show the user the plan
4. **Execute** — After approval, call with `confirmed=true`. Paperclip handles the rest.
5. **Monitor** — Use `status` to check progress. Use `steer` to send feedback on specific issues.

## Tool Reference

- `delegate` action: `{ action: "delegate", title, description, issues: [{title, description, personaHint, priority}], confirmed }`
- `status` action: `{ action: "status", projectId }`
- `steer` action: `{ action: "steer", projectId, issueTitle, instructions }`
- `cancel` action: `{ action: "cancel", projectId }`
- `projects` action: `{ action: "projects" }` — list all active projects
- `team` action: `{ action: "team" }` — show the agent roster

## Issue Scoping Tips

- Each issue should have clear success criteria in its description
- Assign the right persona: content-writer for copy, brand-guardian for design, software-architect for technical work
- Set priority: critical for blockers, high for today's work, medium for this week
- Keep issues atomic — one deliverable per issue, not "do everything"

## Proof Integration

- Every issue gets a Proof doc automatically
- Agents write their deliverable into the Proof doc
- The user reviews in the Proof sidebar
- You can read Proof docs to check quality before presenting to the user
