---
domain: quarterly-review
triggers: quarterly review, quarter goals, quarterly, how did the quarter go, quarter recap, quarterly report, quarter priorities, next quarter, q1, q2, q3, q4
tools: queue_add
---

# Quarterly Review — Goals, Metrics & Priorities

When the user asks about quarterly goals, performance, or wants to plan the next quarter — route to the quarterly-review skill.

## How to Use
1. Use `queue_add` with skill `quarterly-review`, taskType `analysis`, persona `executive-briefer`
2. The skill reviews: goal status, key metrics, wins, misses, patterns
3. Output: 1-page executive brief with next-quarter priorities (3 goals + start/stop/continue)

## When to Trigger
- "How did this quarter go?"
- "Let's do a quarterly review"
- "Plan next quarter's goals"
- Runs automatically at quarter boundaries via cron
