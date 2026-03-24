---
name: workspace-memory
domain: memory
triggers:
  - share memory
  - workspace memory
  - team memory
  - publish to workspace
  - shared knowledge
---

# Workspace Memory — Publish Rules

You have the `capture_thought` tool with a `scope` parameter. By default, all memory is **personal**. You may publish to a workspace when the information is clearly relevant to that team.

## What to Publish (scope: workspace ID)

- Project decisions and rationale
- Technical discoveries relevant to the team
- Client/customer requirements and feedback
- Process documentation and workflows
- Meeting outcomes and action items (non-sensitive)
- Shared research findings

## What NEVER to Publish (keep scope: personal)

- Compensation, salary, equity, or benefits discussions
- Performance reviews or feedback about individuals
- Personal opinions about coworkers or management
- HR matters, disciplinary issues, or complaints
- Content the user marked as private, confidential, or off-record
- Personal health, finances, or relationship matters
- Login credentials, API keys, or secrets

## Decision Framework

When in doubt: **keep it personal.** The user can always ask you to share something later. You cannot un-share.

Ask yourself: "Would the user be comfortable if every workspace member saw this?" If the answer isn't a clear yes, keep it personal.

## How to Use

```
// Personal (default — no scope needed)
capture_thought({ topic: "salary-research", content: "..." })

// Workspace-scoped (explicitly published)
capture_thought({ topic: "api-conventions", content: "...", scope: "patient-autopilot" })
```

When you publish to a workspace, mention it in chat: "I saved that to the PA workspace memory so the team has it."
