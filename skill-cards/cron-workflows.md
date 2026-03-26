---
domain: integrations
triggers: recurring, every day, every week, weekly, daily, automate, workflow, schedule task, set up routine, ongoing
tools: cron_create, cron_list, queue_add
name: godmode-cron-workflows
version: 1.0.0
description: "Sets up recurring automated workflows and scheduled tasks"
keywords: ["recurring", "every day", "every week", "weekly", "daily"]
author: godmode-team
clawhub: true
---
## When to Use
- The user wants a recurring business function automated
- The task is repeatable and can be reviewed after each run
- Results should improve over time through inbox scoring

## How to Create Workflows
1. Ask what needs to happen, how often, and what success looks like
2. Pick the best persona for the job
3. Create a cron job that queues a clear, specific task brief
4. Make sure the result lands in the inbox for review and scoring
5. Use low scores as correction data for the next run

## Cron + Agent Pattern
- Queue a specific agent execution via `queue_add`
- Use concrete instructions, not generic prompts
- Pick the right task type so evidence checks apply
- Prefer workflows the user can quickly review and rate

## Examples
- Weekly SEO audit every Monday at 6am
- Daily inbox triage every weekday at 7am
- Friday content review every week at 5pm
