---
domain: standup-prep
triggers: standup, stand up, standup prep, what did I do yesterday, morning prep, daily prep, what's on my plate, morning summary, daily summary
tools: queue_add, calendar.events.today, tasks.list
---

# Standup Prep — Daily Morning Summary

When the user wants a standup summary or morning briefing — route to the daily-standup-prep skill.

## How to Use
1. Use `queue_add` with skill `daily-standup-prep`, taskType `analysis`, persona `meeting-prep`
2. The skill reviews yesterday's activity, today's calendar, and due tasks
3. Output: Yesterday / Today / Blockers format — readable in 30 seconds

## When to Trigger
- "What did I do yesterday?"
- "Prep my standup"
- "What's on my plate today?"
- Runs automatically weekdays 8am via cron
