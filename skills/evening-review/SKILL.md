---
name: evening-review
description: "9 PM evening review: warm check-in via iMessage to close out the day"
---

# Evening Review

## Overview

Runs at 9 PM daily via cron. This is the **user-facing** evening check-in — a warm, conversational message via iMessage that helps the user close out their day, capture what happened, and go to bed with nothing on their mind.

> **Not to be confused with** `evening-processing` (8 PM), which silently tags sessions and saves snapshots in the background.

## When to Run

- Triggered by the `evening-review` cron at 9 PM
- Can also be run manually if the user asks for their evening review

## Process

### Step 0: Sync Brief Checkboxes → Tasks

Before gathering context, sync the daily brief's checkbox state to the task system. Throughout the day, the user may have checked off Win The Day items directly in the daily brief markdown. Call `dailyBrief.syncTasks` with today's date to propagate those completions to the task list. This ensures the task statuses are accurate before you report on what got done.

### Step 1: Gather Context

Before composing the message, pull together today's context from **all** sources — not just GodMode sessions:

1. **Today's daily brief** — read via `dailyBrief.get` for today's date
   - Extract the "Win The Day" tasks (Must Win, Should Do, Could Do)
   - Note any carryover tasks already listed
2. **Today's agent log** — read `~/godmode/memory/agent-log/{today}.md`
   - This captures ALL work done through GodMode (sessions, cron, iMessage, Slack)
   - Summarize the top 3-5 real deliverables — things the user actually shipped or moved forward
   - Focus on outcomes, not system housekeeping (skip auto-checkpoints, health pulses, routing)
3. **Today's sessions** — list via `sessions.list` to see what was worked on
   - Note: this only captures GodMode sessions. The user may have done significant work in Claude Code, ChatGPT, or other tools that won't appear here.
4. **Tomorrow's calendar** — fetch via `calendar.events.range` for tomorrow
   - List meetings with times and attendees
   - Or note "clear calendar" if nothing scheduled

### Step 2: Compose the Evening Message

Write a warm, personal iMessage. The tone is like a great personal assistant — casual, caring, efficient. Not a form. Not a survey.

**Structure (flexible, not rigid):**

```
Hey — how'd your day go?

Here's what I saw:
- [2-4 bullets of real accomplishments from agent log + sessions]

From this morning's plan:
- [ ] Task 1 (done?)
- [ ] Task 2 (done?)

Tomorrow you've got:
- [meetings or "clear calendar — deep work day"]

Score your day 1-10 and anything on your mind. Brain dump welcome.
```

**Guidelines:**

- Keep it under 800 characters if possible (fits one screen on iPhone)
- Use line breaks generously — texts should be scannable
- Don't include every task — just the top 3-5 that matter
- Wins should be **real deliverables** the user would be proud of, not system automation
- If the user did significant work outside GodMode (you can tell from context), ask about it: "Did anything else happen today outside of GodMode?"
- If it's a weekend/family day, be lighter: "Looked like a chill day. Anything to capture?"
- If there were no sessions today, skip that section entirely
- Always end with the brain dump invitation

### Step 3: Send via iMessage

Send the composed message using the `message` tool:

- Channel: `imessage`
- This should be a single message, not a series of messages

## What NOT to Do

- Do NOT send a wall of text — keep it brief and scannable
- Do NOT include technical details about what the system did
- Do NOT ask for data in a specific format — no "send rating | win | tomorrow", no pipe-delimited templates, no "fast reply format"
- Do NOT include reply format instructions or examples of how to reply
- Do NOT use headers like "Evening Check-In" or "Today's Wins" — just talk like a person
- Do NOT list numbered survey questions — weave them naturally into conversation
- Do NOT include anything about "carryover tasks" or "blockers" as a structured section — the brain dump invitation covers this
- Do NOT generate a lifetrack here — that happens automatically after the user replies
- Do NOT send multiple messages — one clean message is the goal
- Do NOT list system tasks (auto-checkpoints, health pulses, cron jobs) as wins — only real user-facing work

## Reply Handling

This skill runs in the **main {{ALLY_NAME}} session** — not an isolated cron session. When the user replies to the iMessage, their reply arrives naturally in the conversation. {{ALLY_NAME}} handles it like a conversation, not a form.

### What to do with the reply:

1. **Capture reflection** — Save the user's thoughts to today's daily brief under "Evening Reflection" via `dailyBrief.eveningCapture`. Include their day rating if they gave one.

2. **Extract tasks** — If the user mentions things they need to do ("finish the proposal tomorrow", "follow up with Jon"), create tasks via `tasks.create` with appropriate priority and due dates. Don't ask permission for obvious tasks — just create them.

3. **Queue overnight work** — If the user requests something be worked on ("can you research X tonight?", "queue up the Y feature", "look into Z"), use `queue_add` to add it to the background processing queue. Pick the right type (coding, research, analysis, creative, ops).

4. **Scope tomorrow** — If the user shares tomorrow priorities, acknowledge them. Don't force structure — the morning set conversation is where priorities get locked in. Just capture the intent.

5. **Ask if unclear** — If the user's reply is ambiguous about what they want done, ask a natural follow-up. "Want me to queue that up for overnight, or just add it to tomorrow's list?"

6. **Close warmly** — Once you've captured everything, acknowledge and let the user go to bed. Don't overdo it. A simple "Got it. I'll have tomorrow's brief ready. Sleep well." is plenty.

### Key principle

The user can reply in any format — one word, a paragraph, voice dictation, or a structured brain dump. {{ALLY_NAME}} interprets it naturally. No pipe-delimited templates. No numbered survey responses. If the reply is complete, close the loop. If there's work to do overnight, queue it and let the user know you're on it.

## Example Output

Good example (Saturday, light day):

```
Hey — time for your evening review.

Looked like a recovery day. I saw a couple GodMode sessions and some ClawVault work.

From this morning's plan:
- Client proposal (overdue)
- Marketing funnel approval
- GodMode UI build

Which of those moved? What carries over?

Tomorrow's clear — no meetings.

Score your day 1-10 and anything on your mind. I'll prep tomorrow's brief.
```

Good example (busy weekday):

```
Hey — how'd today go?

Today I saw:
- Product launch approval (2 sessions)
- GodMode sidebar build
- Meeting prep for client call

Your plan this morning:
- Ship marketing copy
- Close client proposal
- Soul review

What got done? What carries over?

Tomorrow:
- 9:00 AM Daily Huddle
- 2:00 PM Client call
- 4:00 PM Team standup

Anything else on your mind? Brain dump welcome.
```

Good example (big day with external work):

```
Hey — big day. How'd it go?

From GodMode I saw you shipped the webhook fix and handled a team member's reminder setup.

Anything else happen outside GodMode today? I know not everything runs through here yet.

Tomorrow's clear — deep work day.

Score your day 1-10 and brain dump anything on your mind.
```

## Cron Setup

> **IMPORTANT**: This skill MUST use `sessionTarget: "main"` — NEVER `"isolated"`.
> Isolated sessions create a separate agent context. When the user replies to the
> check-in message, their reply gets captured by the isolated session instead of
> the main {{ALLY_NAME}} session, effectively swallowing the message. The main session
> never sees it — and {{ALLY_NAME}} can't act on the user's brain dump.

```
Schedule: 0 21 * * * (9 PM daily, user's timezone)
Session: main (NEVER isolated — replies get swallowed)
Payload kind: systemEvent (not agentTurn)
Delivery: none ({{ALLY_NAME}} sends via message tool directly)
```

### Safe cron job config example

```json
{
  "name": "Evening Review - 9PM",
  "enabled": true,
  "sessionTarget": "main",
  "wakeMode": "now",
  "payload": {
    "kind": "systemEvent",
    "text": "EVENING REVIEW (9 PM): Time for the evening check-in. Run the evening-review skill — first call dailyBrief.syncTasks to sync any checked-off Win The Day items to the task list, then gather today's context (daily brief, agent log, sessions, tomorrow's calendar), compose a warm personal iMessage check-in (under 800 chars), and send it via the message tool. After sending, stay present for the user's reply. When they respond, handle it naturally: capture their reflection to the daily brief, extract any tasks they mention and create them, queue any work they want done overnight, and if you're not sure what to prioritize, ask. This is a conversation, not a form."
  },
  "delivery": { "mode": "none" },
  "schedule": { "kind": "cron", "expr": "0 21 * * *", "tz": "America/Chicago" }
}
```
