---
name: Code Review
trigger: manual
persona: evidence-collector
taskType: review
priority: normal
---

Review the specified pull request or branch diff.

1. Read all changed files completely
2. Check against GodMode architecture rules (CLAUDE.md, META-ARCHITECTURE.md)
3. Check for: scope creep, missing error handling, type safety, path validation
4. Check the Three Golden Rules are not violated
5. Provide verdict: APPROVE, REQUEST CHANGES, or NEEDS DISCUSSION
6. List specific issues with file paths and line numbers
7. Note anything that could break the build or existing functionality
