---
name: Silent Failure Audit — Error Handling Review
trigger: manual
persona: godmode-builder
taskType: review
priority: normal
---

# Silent Failure Audit

Hunt for silent failures, inadequate error handling, and dangerous fallback behavior in the specified code.

## Target

Audit the specified files, PR, or directory. If none given, audit `src/` in the GodMode plugin.

## What to Find

### Silent Failures (CRITICAL)
- Empty catch blocks
- Catch blocks that log but continue without surfacing the error
- Returning null/undefined/default on error without logging
- Optional chaining (`?.`) that silently skips operations that SHOULD fail loudly
- Retry logic that exhausts attempts without informing anyone

### Inadequate Error Handling (HIGH)
- Generic error messages ("Something went wrong") with no actionable detail
- Catch blocks that catch ALL exceptions when they should catch specific types
- Missing context in error logs (no operation name, no relevant IDs, no state)
- Errors logged at wrong severity (using debug for production issues)

### Dangerous Fallbacks (HIGH)
- Fallback behavior that masks the real problem
- Returning mock/stub data outside of test code
- Fallback chains that try multiple approaches without explaining why
- Default values on failure that could cause downstream confusion

### Error Propagation Issues (MEDIUM)
- Errors caught too early (should bubble up to a higher handler)
- Swallowed errors that prevent proper cleanup
- Error type information lost during re-throwing

## For Each Issue Found

1. **Location**: File path and line number(s)
2. **Severity**: CRITICAL / HIGH / MEDIUM
3. **Issue**: What's wrong and why it's dangerous
4. **Hidden errors**: What unexpected errors could be caught and suppressed here
5. **User impact**: How this affects debugging or user experience
6. **Fix**: Specific code change needed (show before → after)

## Deliverable

1. Numbered list of all issues with fixes
2. Summary: X issues (Y critical, Z high, W medium)
3. **MUST FIX** list: silent failures and dangerous fallbacks
4. **IMPROVE** list: inadequate but non-critical error handling
