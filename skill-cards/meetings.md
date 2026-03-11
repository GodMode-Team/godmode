---
domain: meetings
triggers: last call, analyze call, meeting recording, transcript, fathom, recording, what did we discuss, call summary, call notes, meeting notes, debrief call, review call, action items from call, follow up from call, what happened on the call
tools: fathom.listMeetings, fathom.getMeeting, fathom.ingest
---
## When to Use
- User mentions "last call", "my call", "the call", "that meeting" — always check Fathom first
- Analyzing, summarizing, or debriefing a meeting/call
- Extracting action items, decisions, or follow-ups from a call
- Looking up what was discussed with a specific person

## How to Use
- `fathom.listMeetings` — list recent recordings (use `{ limit: 5 }` or `{ limit: 1 }` for "last call")
- `fathom.getMeeting` — get full details including transcript, summary, action items `{ id: <recordingId> }`
- `fathom.ingest` — pull a specific recording from the Fathom API by ID `{ recordingId: <id> }`
- Fathom is ALWAYS the source for call recordings. NEVER ask the user where the recording is — just check Fathom.

## Workflow
1. Call `fathom.listMeetings` to find the relevant recording
2. If user said "last call" — grab the most recent one
3. If user mentioned a person — match against attendee names/emails
4. Call `fathom.getMeeting` with the recording ID for full transcript + summary
5. Analyze, summarize, extract action items, or answer the user's question

## Gotchas
- Recordings arrive via webhook after the call ends — there may be a few minutes delay
- The meeting queue file is at `~/godmode/data/meeting-queue.json` — don't read it directly, use the RPC
- Transcripts can be long — summarize before presenting unless the user asks for the full thing
- Action items from Fathom are auto-extracted — cross-reference with what the user actually wants to do
- If `fathom.listMeetings` returns empty, the webhook may not be configured — suggest `fathom.setupWebhook`

## Tips
- After analyzing a call, offer to create GodMode tasks from action items
- Cross-reference attendees with vault people files via secondBrain.search
- Suggest updating person memory files with new context from the call
- If external attendees were present, offer to draft a follow-up email
