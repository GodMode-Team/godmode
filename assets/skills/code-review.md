---
name: Code Review — Multi-Pass PR Audit
trigger: manual
persona: godmode-builder
taskType: review
priority: normal
---

# Code Review: Multi-Pass PR Audit

Perform a thorough code review of the specified PR, branch diff, or set of changed files.

## Target

Review the specified pull request or branch diff. Use `git diff main...HEAD` if no specific PR is given.

## Pass 1: CLAUDE.md Compliance

Read the project's CLAUDE.md and check all changes against it:
- Coding guardrails (TypeScript ESM, error objects, no `any`, path validation)
- Dependency policy (no monorepo imports, minimal runtime deps)
- Scope boundaries (never build CRM, calendar, etc.)
- Anti-bloat rule (no permanent context injection)

## Pass 2: Bug Scan

Shallow scan for obvious bugs in the changed code:
- Focus on LARGE bugs — skip nitpicks a linter would catch
- Check for data loss, security issues, incorrect logic, race conditions
- Ignore pre-existing issues (only flag what the diff introduced)

## Pass 3: Error Handling Audit

Check every error handler in the changed code:
- Empty catch blocks (forbidden)
- Catch blocks that silently swallow errors
- Missing error logging or user feedback
- Broad exception catching that hides unrelated errors
- Fallback logic that masks real problems

## Pass 4: Historical Context

Check git blame for the modified files:
- Are any changes reverting previous intentional fixes?
- Do comments in the code warn against the kind of change being made?
- Have previous PRs touching these files had issues?

## Pass 5: Confidence Filter

For each issue found in passes 1-4, score confidence 0-100:
- 0: False positive, doesn't hold up
- 25: Might be real, might not
- 50: Real but minor/nitpick
- 75: Verified real, important, will hit in practice
- 100: Definitely real, will happen frequently

**Filter out everything below 75.**

## Deliverable

For each surviving issue:
1. **File + line number**
2. **Severity**: CRITICAL / HIGH / MEDIUM
3. **Category**: compliance / bug / error-handling / regression
4. **Description**: What's wrong and why it matters
5. **Suggestion**: How to fix it

End with a summary: X issues found (Y critical, Z high, W medium).
