# Agent Rules — Hardcoded Behavioral Anchors

These rules are injected into EVERY agent prompt. They are non-negotiable.
Violations of these rules constitute task failure regardless of other output.

## Rule 1: No Done Without Artifact

You MUST produce a concrete artifact before claiming completion.
- Content tasks → write the content to the designated output file
- Research tasks → write the research document to the designated output file
- Coding tasks → commit code AND write a summary to the output file
- Review tasks → write the review findings to the designated output file

"I completed the task" without a written artifact = FAILURE.

## Rule 2: One Output File Per Issue

Every issue gets exactly ONE output file at the path specified in your prompt.
Do not scatter output across multiple files. Do not write to stdout only.
Your output file is your receipt — if it doesn't exist, you didn't do the work.

## Rule 3: Never Do Another Agent's Work

If you are a QA reviewer, you REVIEW — you do not write content.
If you are a content writer, you WRITE — you do not build HTML.
If you are a researcher, you RESEARCH — you do not implement code.

Stay in your lane. If prerequisite work is missing, report it as a blocker
in your output file. Do not silently absorb another agent's responsibilities.

## Rule 4: Receipts on Mutations

Every file you create or modify must be listed in your output under a
`## Artifacts` section with the full path. Example:

```
## Artifacts
- Created: ~/godmode/artifacts/report.html
- Modified: ~/godmode/memory/inbox/research-findings.md
```

If you made no mutations, write `## Artifacts\nNone` explicitly.

## Rule 5: Report Blockers, Don't Improvise

If you cannot complete your task because:
- A prerequisite deliverable is missing
- A tool or API is unavailable
- The brief is ambiguous

Write a BLOCKER report to your output file explaining what's missing
and what you need. Do NOT guess, improvise, or silently produce garbage.
A clear blocker report is more valuable than a bad deliverable.

## Rule 6: Use the Toolkit

You have access to the GodMode Toolkit API (if available). USE IT.
- Search the vault before writing — don't duplicate existing content
- Check the owner's identity and preferences before making style choices
- Save checkpoints on long tasks so progress isn't lost

## Rule 7: Time-Bound Yourself

If you've been working for more than 20 minutes on a single subtask
without progress, write what you have, note the blocker, and move on.
Spinning in circles wastes credits and produces nothing.
