# Auto-Context

## Description
Proactively surface everything relevant before a meeting, task, or project discussion — so the user walks in prepared.

## Trigger
Before meetings (calendar event approaching), when a task or project comes up in conversation, user says "prep me for", "what do I need to know about", or when a known contact/company is mentioned.

## Process
1. **Identify the context target** — Meeting? Person? Project? Company? Extract the key entity.
2. **Pull calendar context:**
   - `calendar_today` for upcoming schedule
   - Extract attendees, meeting title, any notes/links in the event
3. **Look up people:**
   - `memory_search` for each attendee or mentioned person
   - Surface: role, company, last interaction, open threads, relationship notes
4. **Pull project context:**
   - `memory_search` for the project/company
   - Check for related tasks via `tasks_create` (read mode) or task history
   - Surface: current status, blockers, recent decisions, open questions
5. **Check for unfinished threads:**
   - Any promises made to these people?
   - Any outstanding deliverables?
   - Any recent messages or follow-ups needed?
6. **Assemble briefing** — One page, scannable, with clear sections.

## Output
- Meeting/context summary (1-2 lines)
- People involved (name, role, last interaction, notes)
- Project status (if relevant)
- Open threads and promises
- Suggested talking points or agenda items
- Time-sensitive items flagged

## Examples
1. Meeting with "Jake from Linear" in 30 min — Calendar pull shows the event, memory surfaces past conversations about API integration, task history shows an open ticket about webhook setup. Briefing: "Jake is your Linear contact. Last spoke 2 weeks ago about webhook reliability. You promised to test the retry logic. Open task: 'Test Linear webhook retries' (due tomorrow)."
2. User says "I need to think about the Patient Autopilot funnel" — Memory pulls PA context, recent decisions, current metrics, team status. Surfaces: last funnel conversion rate, recent A/B test results, open tasks related to PA.

## Failure Modes
- **No memory hits** — If memory is empty for an attendee, say so: "No prior context on [person]. Want me to research them?" Then trigger auto-research.
- **Calendar not connected** — If `calendar_today` fails, ask the user what's coming up instead. Don't block on the API.
- **Stale context** — Memory may have outdated info. Always show when the info was last updated if available.
- **Over-briefing** — For a casual 15-min sync, don't produce a 2-page dossier. Match depth to meeting importance.
