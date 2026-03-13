---
domain: inbox-sweep
triggers: inbox, sweep inbox, process inbox, new items, unread, inbox review, check inbox, what's new, organize inbox
tools: queue_add
---

# Inbox Sweep — Daily Inbox Processing

When the user asks about their inbox or wants new items organized — route to the inbox-sweep skill.

## How to Use
1. Use `queue_add` with skill `inbox-sweep`, taskType `ops`, persona `ops-runner`
2. The skill processes `~/godmode/memory/inbox/`: categorizes, summarizes, moves to vault
3. Output: summary of processed items + anything needing user attention

## When to Trigger
- "What's in my inbox?"
- "Sweep my inbox"
- "Any new agent outputs?"
- Runs automatically daily 7am via cron
