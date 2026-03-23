---
domain: calendar
triggers: meeting, schedule, calendar, event, availability, free, busy, when am i, what's next, upcoming, standup, reschedule, block off, coming up, tomorrow
tools: calendar.events.today, calendar.events.range
name: godmode-calendar
version: 1.0.0
description: "Manages schedule, meetings, availability, and calendar events"
keywords: ["meeting", "schedule", "calendar", "event", "availability"]
author: godmode-team
clawhub: true
---
## When to Use
- User asks about schedule, meetings, availability, "what's next"
- Meeting prep — proactively offer when a meeting is within 2 hours
- Scheduling conflicts or free time analysis

## How to Use
- `calendar.events.today` — today's events (cached 2 min)
- `calendar.events.range` — events in a date range { startDate, endDate }
- Schedule is often already injected above — check there FIRST

## Gotchas
- All-day events have no startTime — check the `allDay` flag before formatting times
- Events cache for 2 minutes — if user just added one, tell them it may take a moment to appear
- Attendee emails may be truncated — match by first name when possible
- Uses `gog` CLI under the hood — if calendar fails, check `integrations.status` for GOG_CALENDAR_ACCOUNT
- Time zones: always format in the user's timezone (shown in identity above)

## Tips
- Cross-reference attendees with vault people files via secondBrain.search
- When user mentions a person + time, proactively check for conflicts
- For "am I free Tuesday?", use calendar.events.range, don't guess
