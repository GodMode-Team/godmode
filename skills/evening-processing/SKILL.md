---
name: evening-processing
description: "End-of-day background prep: tag sessions by project, capture agent log to vault, update task status"
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

2. **Sync Agent Log to Vault**
   - Ensure today's agent log has been captured to the daily brief
   - The vault-capture pipeline handles this automatically, but verify it ran
   - If the daily note exists but has no Agent Sessions section, the next heartbeat tick will handle it

3. **Update Task Status**
   - Read today's daily brief and sync checkbox state to tasks (via `dailyBrief.syncTasks`)
   - Flag any overdue tasks that weren't addressed today
   - These carry forward automatically into tomorrow's brief

4. **Generate Impact Summary**
   - Count: sessions run, tasks completed, queue items processed
   - Highlight top 3 accomplishments from the agent log
   - Flag any unresolved items that need attention tomorrow
   - Write summary to the agent log for the evening-review skill to reference

## Output Format

This is a silent background process. Output goes to the agent log, not to the user.
The evening-review skill (9 PM) handles user-facing communication.

## Cron Setup

```
Schedule: 0 20 * * * (8 PM daily, user's timezone)
Session: isolated
Delivery: none (silent background processing)
```
