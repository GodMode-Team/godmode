---
domain: tasks
triggers: task, todo, to-do, remind, reminder, overdue, priority, priorities, what should i, what do i need
tools: tasks.list, tasks.add, tasks.update
---
## When to Use
- User asks about their tasks, to-dos, priorities, what to work on
- Overdue task surfacing — proactively mention when tasks are past due
- Adding, completing, or updating tasks

## How to Use
- `tasks.list` — all tasks with status, dueDate, workspace
- `tasks.add` — { title, dueDate?, workspace?, status? }
- `tasks.update` — { id, status?, title?, dueDate? }
- Priorities from today's daily brief are often already injected above — check there FIRST

## Gotchas
- Tasks are a flat list — no subtasks, no hierarchy, no boards. This is intentional.
- For complex projects, create a markdown artifact instead of 20 subtasks
- Status values: "pending" | "in-progress" | "done" | "archived"
- dueDate format: YYYY-MM-DD string, not a Date object
- Don't create duplicate tasks — call tasks.list first to check

## Tips
- When user says "I need to...", create the task immediately — don't ask for confirmation
- Surface overdue tasks naturally in conversation, don't nag
- Cross-reference with daily brief priorities when suggesting what to work on next
- For big projects, suggest: "Want me to draft a project plan as a markdown artifact?"
