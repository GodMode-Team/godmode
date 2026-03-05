---
name: weekly-coaching
description: "Sunday evening coaching: review week's progress against goals, identify patterns, surface trust scores, generate Monday coaching brief"
---

# Weekly Coaching

## Overview

Runs Sunday at 8 PM via cron. Analyzes the week's activity against the user's goals, trust scores, and daily briefs.

## Process

1. **Load Context**
   - Read `goals.json` for current goals and targets (via `goals.get`)
   - Read this week's daily briefs from the vault `01-Daily/` folder (Mon-Sun)
   - Read `trust-tracker.json` for workflow trust scores (via `trust.summary`)
   - Read this week's agent log entries for activity data

2. **Analyze Progress**
   - For each active goal: what moved forward this week? What evidence is in the daily briefs?
   - Compare task completion rates across the week (which days were most productive?)
   - Review trust scores: which workflows are improving, declining, or stale?

3. **Identify Patterns**
   - Most productive days/times (based on task completion patterns in briefs)
   - Projects that got attention vs. neglected
   - Recurring blockers or themes across the week
   - Workflows with trust scores below 7 that need attention

4. **Generate Coaching Brief**
   - Week in review: 3-5 sentence summary of what happened
   - Goal progress: status per goal with specific evidence from daily briefs
   - Trust check: which workflows are building trust, which need improvement
   - Recommendations: 2-3 specific actions for next week
   - Monday morning priorities: top 3 things to start with

## Output Format

Deliver a structured coaching message:

- Week summary
- Goal-by-goal progress
- Trust score trends
- Pattern insights
- Monday priorities

## Cron Setup

```
Schedule: 0 20 * * 0 (8 PM Sunday, user's timezone)
Session: isolated
Model: anthropic/claude-opus-4-6 (high-quality analysis)
Thinking: high
Delivery: announce to last active channel
```
