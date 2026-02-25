---
name: weekly-coaching
description: "Sunday evening coaching: review week's progress against goals, identify patterns, generate Monday coaching brief"
---

# Weekly Coaching

## Overview

Runs Sunday at 8 PM via cron. Analyzes the week's activity against the user's goals and life priorities.

## Process

1. **Load Context**
   - Read `~/godmode/data/goals.json` for current goals and targets
   - Read `~/godmode/data/wheel-of-life.json` for focus areas
   - Read this week's daily snapshots from `~/godmode/data/snapshots/`

2. **Analyze Progress**
   - For each active goal: what moved forward this week?
   - For each focus area in Wheel of Life: any relevant activity?
   - Compare project task completion rates across the week

3. **Identify Patterns**
   - Most productive days/times
   - Projects that got attention vs. neglected
   - Recurring blockers or themes in conversations

4. **Generate Coaching Brief**
   - Week in review: 3-5 sentence summary
   - Goal progress: status per goal with specific evidence
   - Focus area check: are the chosen Wheel of Life areas getting attention?
   - Recommendations: 2-3 specific actions for next week
   - Monday morning priorities: top 3 things to start with

## Output Format

Deliver a structured coaching message:

- Week summary
- Goal-by-goal progress
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
