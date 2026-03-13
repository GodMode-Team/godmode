---
domain: life-admin
triggers: life admin, upcoming week, weekly prep, bills due, birthdays, errands, personal logistics, what's coming up, week ahead, sunday prep
tools: queue_add, calendar.events.today
---

# Life Admin — Weekly Personal Logistics Review

When the user asks about upcoming personal logistics, errands, or weekly prep — route to the weekly-life-admin skill.

## How to Use
1. Use `queue_add` with skill `weekly-life-admin`, taskType `task`, persona `life-admin`
2. The skill checks: next 7 days calendar, bills due, renewals, birthdays, pending errands
3. Output: day-by-day checklist, time-sensitive items first

## When to Trigger
- "What's coming up this week?"
- "Any bills due?"
- "Do my weekly life admin"
- Runs automatically weekly Sunday 7pm via cron
