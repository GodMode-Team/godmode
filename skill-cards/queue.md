---
domain: queue
triggers: queue, delegate, background, agent, run this, can you do, draft, research for me, write this up, code review, research, deep dive
tools: queue_add, queue_check, queue_action
name: godmode-queue
version: 1.0.0
description: "Manages the background agent queue for delegated tasks"
keywords: ["queue", "delegate", "background", "agent", "run this"]
author: godmode-team
clawhub: true
---
## When to Use
- User wants work done in the background (research, drafting, code review, analysis)
- Complex tasks that benefit from a dedicated agent with a full context window
- Anything that takes more than a quick chat response

## How to Use
- `queue_add` tool — { title, description, taskType, persona?, priority? }
- `queue_check` tool — check status of queued items
- `queue_action` tool — { id, action } — approve, reject, retry, or remove a queue item

## Workflow
1. Scope the work clearly in the description — be specific about deliverables
2. Pick the right taskType: research | coding | creative | analysis | review | ops | task
3. The system matches a persona from the agent-roster based on taskType
4. User gets notified when output is ready for review
5. User approves, rejects (with feedback → lesson), or edits

## Gotchas
- ALWAYS confirm with the user before queuing — "Want me to queue that up?"
- The description IS the agent's prompt — make it detailed and specific
- Don't queue trivial things — if you can answer in chat, just answer
- Queue items need approval before they're "done" — remind user to review
- If rejected, the feedback becomes a lesson for future runs

## Tips
- Frame queue items like a senior engineer writing a perfect ticket
- Include context: who is this for, what's the goal, what format is expected
- For research: specify what sources to check, what to ignore, depth expected
- For creative: include tone, audience, length, examples of good output
