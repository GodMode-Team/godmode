Read V2-EXECUTION-SPEC.md for context.

## YOUR TASK: Replace Fathom integration (1,470 lines) with a generic post-meeting skill (~30 lines).

### DELETE:
- `src/methods/fathom-webhook.ts` (671 lines)
- `src/services/fathom-processor.ts` (799 lines)
- Any fathom imports/registrations in index.ts
- Any fathom-related env vars or config references

### CREATE: `skills/post-meeting/SKILL.md`

Write a source-agnostic post-meeting processing skill:

```markdown
# Post-Meeting Processing

## Trigger
After any calendar meeting ends, or when user provides a meeting transcript.

## Sources (any of these)
- Fathom transcript (API or webhook)
- Granola transcript
- Otter.ai transcript  
- Manual paste of transcript or notes
- Any other transcription tool

## Process
1. Get the transcript from whatever source provided it
2. Extract: key decisions, action items, follow-ups, people mentioned
3. For each person mentioned: update their file in memory/bank/people/{name}.md
4. For each action item: create a task via tasks_create
5. Write meeting summary to today's daily note
6. If any action items are delegatable: flag for Paperclip triage

## Output Format
Append to daily note:

### Meeting: {title} ({time})
**Attendees:** {list}
**Key Decisions:** {bullet list}
**Action Items:** {numbered list with owners}
**Follow-ups:** {list with dates if mentioned}

## Integration Hook
This skill should be triggerable by:
- A calendar event ending (hook: post-meeting)
- A webhook from any transcription service
- The user saying "process this meeting" with a paste
```

### UPDATE index.ts:
Remove fathom service start, webhook handler registration, and any fathom-specific config.

### TYPE CHECK AND BUILD:
```bash
pnpm typecheck && pnpm build
git commit -m "feat: replace fathom integration with generic post-meeting skill"
```
