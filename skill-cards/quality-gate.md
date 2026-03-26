---
domain: quality-gate
triggers: review, check, validate, qa, quality, verify, fact check, before sending, before publishing, is this good, proofread, double check
tools: queue_add
name: godmode-quality-gate
version: 1.0.0
description: "Reviews and validates work before publishing or sending"
keywords: ["review", "check", "validate", "qa", "quality"]
author: godmode-team
clawhub: true
---
## When to Use
- After any agent completes work that will be published, sent, or acted on
- When the user asks you to validate or review something
- Automatically for high-stakes outputs (ads, client deliverables, public content)
- When an agent's trust score is below 6/10 — route through QA before delivering

## Quality Gate Routing
Match the right reviewer to the content type:

| Content Type | Reviewer | When |
|---|---|---|
| Marketing copy, ads, VSLs, emails, landing pages | `qa-copy-reviewer` | Always for client-facing content |
| Research, analysis, reports with factual claims | `qa-fact-checker` | Always for research outputs |
| General agent output, mixed content | `qa-reviewer` | When unsure or for general QA |

## How to Use
1. When an agent finishes, check: is this output going to be published, sent to a client, or acted on?
2. If yes → queue a review with the appropriate QA agent before delivering to the user
3. Include the original task description AND the agent's output in the QA queue item description
4. If the QA agent returns FAIL → send corrections back to the original agent, re-run, re-review
5. If PASS → deliver to user's inbox with the confidence tag from the review

## Queue Item Format for QA
```
Title: QA Review: [original task title]
Description:
## Original Task
[paste the original task description]

## Agent Output to Review
[paste the agent's output]

## Review Instructions
Review this output against your checklist. Be thorough.
```

## When to Skip QA
- Internal notes and research the user asked for casually
- Quick answers the user will obviously verify themselves
- Draft iterations the user is actively co-editing in Proof
- When the user explicitly says "just give me a rough draft" or "skip the review"

## Tips
- The QA loop should be invisible to the user — they just see better output
- If an agent keeps failing QA, that's a signal to update its persona with corrections
- QA agents also get scored in the inbox — the feedback loop applies to reviewers too
