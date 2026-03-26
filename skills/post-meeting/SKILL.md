# Post-Meeting Processor

## Description
Turn meeting transcripts into decisions, action items, follow-ups, and memory updates — automatically.

## Trigger
Meeting webhook fires (Fathom, Otter, etc.) via `POST /godmode/webhooks/meeting`, user says "process this meeting", "what happened in my last meeting", or pastes a transcript/recording link.

- **Webhook event:** `meeting:received` (broadcast by `src/methods/meeting-webhook.ts`)
- **File location:** `~/godmode/memory/meetings/{date}-{slug}.md`
- **Manual:** The ally can also run this skill on demand when a user pastes a transcript
- Any tool that can POST `{ title, transcript, attendees?, source }` to `/godmode/webhooks/meeting` will trigger this skill.

## Process
1. **Get the transcript** — From webhook payload, pasted text, or linked recording. If no transcript available, ask the user for a summary instead.
2. **Parse into structured sections:**
   - **Decisions made** — What was agreed on? Who agreed?
   - **Action items** — Who owes what, by when? Be specific: "[Person] will [verb] [thing] by [date]."
   - **Follow-ups needed** — Items that need further discussion or information
   - **Key context** — Important facts, numbers, or positions stated
   - **People present** — Names, roles, notable contributions
3. **Update memory:**
   - Key decisions and action items are captured automatically in memory (Honcho)
   - Link to relevant projects or prior meetings
4. **Create tasks:**
   - `tasks_create` for each action item assigned to the user
   - Include source: "From [meeting name] on [date]"
   - Set due dates from the transcript if mentioned
5. **Write daily note entry:**
   - Append meeting summary to today's daily note in vault
   - Format: meeting title, attendees, decisions, action items
6. **Flag delegatable items:**
   - Scan action items for work that could be queued (research, drafting, analysis)
   - Suggest: "These 2 items could be delegated overnight: [list]"

## Output
- Meeting summary (3-5 sentences)
- Decisions list (bulleted)
- Action items table (who / what / by when)
- Follow-ups needed (bulleted)
- Tasks created (confirmation)
- Delegatable items flagged (if any)

## Examples
1. Fathom webhook fires after a client call — Transcript parsed: 2 decisions (approved budget, chose vendor), 3 action items (user: send SOW by Friday, client: review timeline, user: schedule follow-up). Tasks created, daily note updated, SOW drafting flagged as delegatable.
2. User pastes a 30-min team standup transcript — 1 decision (ship feature by Thursday), 4 action items across 3 people, 1 blocker flagged. Only user's items become tasks. Blocker noted in memory for next standup context.

## Failure Modes
- **No transcript** — If the webhook fires but transcript is empty or garbled, ask the user for key points manually. Don't guess.
- **Ambiguous action items** — "We should probably look into that" is not an action item. Only extract items with a clear owner and verb. Flag ambiguous ones for the user to clarify.
- **Wrong person's items** — Only create tasks for the user's action items. Other people's items go into memory as context, not the user's task list.
- **Duplicate processing** — Check if this meeting was already processed (via memory or daily note). Don't create duplicate tasks.
- **Long meetings** — For 60+ min transcripts, summarize by topic/segment rather than trying to capture everything linearly.

## Notes
- Fathom is the default meeting note-taker. Its webhook payload is normalized by the generic meeting webhook handler before the transcript is written.
- Processing happens via the ally (skill context injection), not custom TypeScript. The webhook handler just writes the file and broadcasts the event.
