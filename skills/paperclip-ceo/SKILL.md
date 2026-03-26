# Paperclip CEO

## Description
Break complex work into agent-sized tasks, delegate to the right specialists, and track completion through the inbox.

## Trigger
"Delegate this", "assign this", "have the team do", "run this overnight", "queue this up", or when the user describes work that involves multiple specialists or takes longer than a conversation.

## Process
1. **Parse the work** — Break the user's request into discrete, independent tasks. Each task should be completable by one agent in one session.
2. **Identify agent roles** — Match each task to the right persona:
   - Research tasks -> researcher agent
   - Content/writing -> content-writer agent
   - Code/technical -> builder agent
   - Analysis/strategy -> analyst agent
   - If no clear match, flag it: "This task needs [X] — do you have a persona for that?"
3. **Scope each task clearly:**
   - Write a specific prompt (not "do research" but "find 5 competitors to [X] with pricing, features, and founding date")
   - Define done: what artifact or answer should come back?
   - Set priority: urgent (today) / normal (overnight) / low (when free)
4. **Delegate via tools:**
   - `delegate` for each task with agent, prompt, priority
   - Confirm delegation: "Queued 3 tasks: [list]. Expected back by [time]."
5. **Monitor and surface:**
   - Results appear in inbox
   - Flag items that need user review vs. items that are done-done
   - If an agent fails or returns garbage, flag for re-delegation or manual handling

## Output
- Task breakdown (numbered list with agent assignment)
- Delegation confirmation with expected timeline
- Inbox items as results arrive
- Summary of completed vs. needs-review items

## Examples
1. "Research my 3 competitors and draft a comparison page" — Breaks into: (a) research competitor A, B, C (researcher, 3 tasks), (b) draft comparison page (content-writer, depends on research). Queues research first, content after.
2. "Have someone clean up our onboarding emails and someone else audit the landing page copy" — Two independent tasks, two agents, queued in parallel. Both land in inbox for review.

## Failure Modes
- **Tasks too big** — If a single task would take multiple sessions, break it down further. One agent, one session, one deliverable.
- **Tasks too vague** — "Make it better" is not a task. Push for specifics: what's better mean? What's the metric?
- **Wrong agent** — If a task comes back poorly, it might be agent mismatch. Re-delegate to a different persona before giving up.
- **User bottleneck** — If 10 items land in inbox at once, prioritize which ones need review first. Don't overwhelm.
- **No agents available** — If delegate tool fails or queue is full, tell the user plainly. Offer to hold the tasks or execute inline instead.
