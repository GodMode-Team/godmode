---
name: Daily Inbox Sweep
trigger: cron
schedule: daily 7am
persona: ops-runner
taskType: ops
priority: normal
---
Process the GodMode inbox and organize new items.

1. Check ~/godmode/memory/inbox/ for new files
2. For each file:
   - Read the content and categorize (agent output, note, task, reference)
   - If it's an agent output: check if it has a corresponding queue item, summarize the result
   - If it's a note: move to appropriate vault folder based on content
3. Create a brief summary of what was processed
4. Flag any items that need user attention
