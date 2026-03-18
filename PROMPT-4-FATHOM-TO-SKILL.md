Read V2-EXECUTION-SPEC.md for context.

## YOUR TASK: Replace 1,470 lines of Fathom-specific processing with a generic meeting webhook + skill.

Fathom stays as the meeting note-taker. But `fathom-webhook.ts` (671 lines) and `fathom-processor.ts` (799 lines) are way too much custom code for what should be: "receive transcript → fire skill."

### DELETE:
- `src/methods/fathom-webhook.ts` (671 lines)
- `src/services/fathom-processor.ts` (799 lines)

### CREATE: `src/methods/meeting-webhook.ts` (~30-50 lines)

A simple, source-agnostic webhook handler:
- POST /godmode/webhooks/meeting — receives a JSON payload with transcript text
- Accepts payloads from Fathom, Granola, Otter, or any service that can POST JSON
- Normalizes the payload into: { title, transcript, attendees?, source }
- Fires the post-meeting skill by injecting a system event into the active session:
  "A meeting just ended: {title}. Transcript and attendees are attached. Run the post-meeting skill."
- Returns 200 OK immediately (processing is async via the skill)

For Fathom specifically: map Fathom's webhook payload format to the generic { title, transcript, attendees, source } shape. Add a comment showing the expected Fathom payload structure so this is easy to maintain.

### CREATE: `skills/post-meeting/SKILL.md`

```markdown
# Post-Meeting Processing

## Description
Process a meeting transcript — extract decisions, action items, update people files, write summary.

## Trigger
- Meeting webhook fires (any transcription service)
- User says "process this meeting" and pastes transcript
- User says "what happened in my last meeting"

## Process
1. Parse the transcript for: key decisions, action items, follow-ups, people mentioned
2. For each person mentioned: search memory for existing context, update their file in memory/bank/people/{name}.md with new info
3. For each action item: create a task via tasks_create with appropriate priority and due date if mentioned
4. Write meeting summary to today's daily note under ## Meetings
5. If any action items are delegatable to agents: flag for delegation

## Output
Append to today's daily note:

### Meeting: {title} ({time})
**Attendees:** {list}  
**Key Decisions:** {bullet list}  
**Action Items:** {numbered list with owners}  
**Follow-ups:** {list with dates if mentioned}

## Failure Modes
- No transcript provided → ask user to paste it or check if Fathom/Granola has it
- Can't identify attendees → ask user to clarify
- Meeting seems to be a 1:1 with no decisions → just log a brief summary, don't force action items
```

### UPDATE index.ts:
- Remove fathom-webhook and fathom-processor imports/registrations
- Register the new meeting-webhook handler in the HTTP hook

### TYPE CHECK AND BUILD:
```bash
pnpm typecheck && pnpm build
git commit -m "feat: replace fathom processor with generic meeting webhook + skill"
```
