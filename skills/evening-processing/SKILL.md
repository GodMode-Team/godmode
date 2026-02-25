---
name: evening-processing
description: "End-of-day review: tag sessions by project, process highlights, save daily snapshot, generate impact summary"
---

# Evening Processing (Background)

## Overview

Runs at 8 PM daily via cron. This is **silent background data prep** — no user interaction. Reviews the day's activity and organizes it behind the scenes.

> **The user-facing evening review happens at 9 PM** via the `evening-review` skill, which sends a warm iMessage check-in and collects the user's reflection.

## Process

1. **Tag Sessions by Project**
   - List today's sessions via `sessions.list`
   - Read each session's transcript summary
   - Match sessions to projects in `~/godmode/data/projects.json` by content
   - Update project task lists with any new items discovered

2. **Process Email Highlights**
   - If Front skill is available, fetch today's starred/important emails
   - Extract action items and add to relevant projects

3. **Save Daily Snapshot**
   - Read current state of `~/godmode/data/projects.json`, `~/godmode/data/people/`, `~/godmode/data/goals.json`
   - Write snapshot to `~/godmode/data/snapshots/YYYY-MM-DD.json`
   - Include: project status counts, people contacted, goals progress

4. **Generate Impact Summary**
   - Count: sessions run, tasks completed, messages sent
   - Highlight top 3 accomplishments
   - Flag any unresolved items that need attention tomorrow
   - Deliver summary to the user

## Output Format

Deliver a concise end-of-day summary:

- What got done (by project)
- What needs attention tomorrow
- Daily snapshot saved confirmation

## Cron Setup

```
Schedule: 0 20 * * * (8 PM daily, user's timezone)
Session: isolated
Delivery: announce to last active channel
```
