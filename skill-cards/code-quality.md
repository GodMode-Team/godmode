---
domain: code-quality
triggers: bug hunt, find bugs, code review, review my code, check for bugs, audit code, error handling, silent failures, simplify code, clean up code, refactor, code quality
tools: queue_add
---

# Code Quality — Bug Hunting, Review & Simplification

When the user wants code audited, reviewed, or cleaned up — route to the right queue skill.

## Which Skill to Use

| User Intent | Queue Skill | taskType |
|---|---|---|
| "Find bugs", "audit this code" | bug-hunt | review |
| "Review this PR", "code review" | code-review | review |
| "Check error handling", "silent failures" | silent-failure-audit | review |
| "Simplify", "clean up", "refactor" | code-simplify | coding |

## How to Use
1. Ask which codebase/files/PR to target (if not obvious)
2. Use `queue_add` with the matching skill as the description template
3. Include: target files/PR, what to focus on, any known pain points
4. For bug-hunt: results come back as a scored report with MUST FIX / DEFERRED lists
5. For code-review: results come as scored issues filtered for confidence
