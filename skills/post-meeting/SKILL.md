---
name: post-meeting
description: "Post-meeting processing: extract action items, summarize decisions, update projects"
trigger: "meeting:received"
---

# Post-Meeting Processing

## Overview

Fires after a meeting transcript lands in `~/godmode/memory/meetings/`. The meeting
webhook (POST /godmode/webhooks/meeting) writes transcripts there and broadcasts a
`meeting:received` event that triggers this skill.

## Trigger

- **Webhook event:** `meeting:received` (broadcast by `src/methods/meeting-webhook.ts`)
- **File location:** `~/godmode/memory/meetings/{date}-{slug}.md`
- **Manual:** The ally can also run this skill on demand when a user pastes a transcript

## Process

1. **Read the transcript** from `~/godmode/memory/meetings/`
2. **Extract action items** — who owes what, deadlines mentioned
3. **Summarize key decisions** — what was agreed, what changed
4. **Identify follow-ups** — external attendees who need an email, open questions
5. **Update tasks** — create GodMode tasks for action items assigned to the user
6. **Notify the ally** — surface a brief summary in chat so the user sees it

## Output

- Action items created as GodMode tasks
- Brief meeting summary delivered to chat
- Follow-up suggestions (email drafts, calendar holds) offered to the user

## Notes

- Fathom is the default meeting note-taker. Its webhook payload is normalized by the
  generic meeting webhook handler before the transcript is written.
- Any tool that can POST `{ title, transcript, attendees?, source }` to
  `/godmode/webhooks/meeting` will trigger this skill.
- Processing happens via the ally (skill context injection), not custom TypeScript.
  The webhook handler just writes the file and broadcasts the event.
