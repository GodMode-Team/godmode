---
name: meeting-prep
description: "Pre-meeting briefing: pull person context, review shared history, generate talking points"
---

# Meeting Prep

## Overview

Runs 30 minutes before calendar events that have attendees. Prepares a context-rich briefing.

## Trigger

This skill is triggered by a recurring calendar check cron job that:

1. Fetches upcoming calendar events via `calendar.events.range`
2. Finds events starting in the next 30-45 minutes
3. Filters for events with external attendees (not just the user)
4. Invokes this skill with the event details

## Process

1. **Identify Attendees**
   - Extract attendee names/emails from the calendar event
   - Match to people files in `~/godmode/data/people/`
   - Note any unknown attendees (flag for post-meeting follow-up)

2. **Pull Person Context**
   - For each known attendee: role, company, relationship notes, last contact
   - Recent conversation history or shared session notes
   - Any outstanding action items involving this person

3. **Review Meeting Context**
   - Meeting title, description, agenda (from calendar event)
   - Related project context from `~/godmode/data/projects.json`
   - Previous meeting notes if available (search Obsidian/sessions)

4. **Generate Briefing**
   - Who you're meeting with (key context per person)
   - What this meeting is about (inferred from title/description)
   - Suggested talking points
   - Open items to address
   - Questions to ask

## Output Format

Concise briefing delivered via message:

- Attendee profiles (1-2 lines each)
- Meeting context
- 3-5 talking points
- Open items

## Cron Setup

```
Schedule: */15 * * * * (every 15 minutes, checks calendar)
Session: isolated
Delivery: announce to last active channel (only fires when meeting is upcoming)
```

Note: The cron job runs the calendar check frequently but only triggers the full
meeting prep when a qualifying meeting is found within the next 30-45 minutes.
This avoids creating one-shot jobs for each meeting.
