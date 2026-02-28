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

The user's reply is automatically captured by the evening check-in system:

- Their reflection is saved to the daily brief under "Evening Reflection"
- If they don't include tomorrow priorities, a warm follow-up asks for a brain dump
- After full capture, an evening lifetrack is generated and the link is texted

The user can reply in any format — freeform text, voice message, short or long. The capture system handles all of it. Never constrain how the user should respond.

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

```
Schedule: 0 21 * * * (9 PM daily, user's timezone)
Session: isolated
Delivery: announce to iMessage
```
