---
description: "[gstack] Systematic debugging with root cause investigation -- no fixes without root cause"
---


# Systematic Debugging

## Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

Fixing symptoms creates whack-a-mole debugging. Every fix that doesn't address root cause makes the next bug harder to find. Find the root cause, then fix it.

---

## Phase 1: Root Cause Investigation

Gather context before forming any hypothesis.

1. **Collect symptoms:** Read the error messages, stack traces, and reproduction steps. If the user hasn't provided enough context, ask ONE question at a time by prompting the user.

2. **Read the code:** Trace the code path from the symptom back to potential causes. Use `exec` to search for all references and read the relevant source files to understand the logic.

3. **Check recent changes:**
   ```bash
   git log --oneline -20 -- <affected-files>
   ```
   Was this working before? What changed? A regression means the root cause is in the diff.

4. **Reproduce:** Can you trigger the bug deterministically? If not, gather more evidence before proceeding.

Output: **"Root cause hypothesis: ..."** -- a specific, testable claim about what is wrong and why.

---

## Scope Lock

After forming your root cause hypothesis, lock edits to the affected module to prevent scope creep.

Identify the narrowest directory containing the affected files. Tell the user: "Edits restricted to `<dir>/` for this debug session. This prevents changes to unrelated code."

If the bug spans the entire repo or the scope is genuinely unclear, skip the lock and note why.

---

## Phase 2: Pattern Analysis

Check if this bug matches a known pattern:

| Pattern | Signature | Where to look |
|---------|-----------|---------------|
| Race condition | Intermittent, timing-dependent | Concurrent access to shared state |
| Nil/null propagation | NoMethodError, TypeError | Missing guards on optional values |
| State corruption | Inconsistent data, partial updates | Transactions, callbacks, hooks |
| Integration failure | Timeout, unexpected response | External API calls, service boundaries |
| Configuration drift | Works locally, fails in staging/prod | Env vars, feature flags, DB state |
| Stale cache | Shows old data, fixes on cache clear | Redis, CDN, browser cache, Turbo |

Also check:
- `TODOS.md` for related known issues
- `git log` for prior fixes in the same area -- **recurring bugs in the same files are an architectural smell**, not a coincidence

---

## Phase 3: Hypothesis Testing

Before writing ANY fix, verify your hypothesis.

1. **Confirm the hypothesis:** Add a temporary log statement, assertion, or debug output at the suspected root cause. Run the reproduction. Does the evidence match?

2. **If the hypothesis is wrong:** Return to Phase 1. Gather more evidence. Do not guess.

3. **3-strike rule:** If 3 hypotheses fail, **STOP**. Prompt the user with:
   ```
   3 hypotheses tested, none match. This may be an architectural issue
   rather than a simple bug.

   A) Continue investigating -- I have a new hypothesis: [describe]
   B) Escalate for human review -- this needs someone who knows the system
   C) Add logging and wait -- instrument the area and catch it next time
   ```

**Red flags** -- if you see any of these, slow down:
- "Quick fix for now" -- there is no "for now." Fix it right or escalate.
- Proposing a fix before tracing data flow -- you're guessing.
- Each fix reveals a new problem elsewhere -- wrong layer, not wrong code.

---

## Phase 4: Implementation

Once root cause is confirmed:

1. **Fix the root cause, not the symptom.** The smallest change that eliminates the actual problem.

2. **Minimal diff:** Fewest files touched, fewest lines changed. Resist the urge to refactor adjacent code.

3. **Write a regression test** that:
   - **Fails** without the fix (proves the test is meaningful)
   - **Passes** with the fix (proves the fix works)

4. **Run the full test suite.** Paste the output. No regressions allowed.

5. **If the fix touches >5 files:** Prompt the user to flag the blast radius:
   ```
   This fix touches N files. That's a large blast radius for a bug fix.
   A) Proceed -- the root cause genuinely spans these files
   B) Split -- fix the critical path now, defer the rest
   C) Rethink -- maybe there's a more targeted approach
   ```

---

## Phase 5: Verification & Report

**Fresh verification:** Reproduce the original bug scenario and confirm it's fixed. This is not optional.

Run the test suite and paste the output.

Output a structured debug report:
```
DEBUG REPORT
========================================
Symptom:         [what the user observed]
Root cause:      [what was actually wrong]
Fix:             [what was changed, with file:line references]
Evidence:        [test output, reproduction attempt showing fix works]
Regression test: [file:line of the new test]
Related:         [TODOS.md items, prior bugs in same area, architectural notes]
Status:          DONE | DONE_WITH_CONCERNS | BLOCKED
========================================
```

---

## Important Rules

- **3+ failed fix attempts -> STOP and question the architecture.** Wrong architecture, not failed hypothesis.
- **Never apply a fix you cannot verify.** If you can't reproduce and confirm, don't ship it.
- **Never say "this should fix it."** Verify and prove it. Run the tests.
- **If fix touches >5 files -> prompt the user** about blast radius before proceeding.
- **Completion status:**
  - DONE -- root cause found, fix applied, regression test written, all tests pass
  - DONE_WITH_CONCERNS -- fixed but cannot fully verify (e.g., intermittent bug, requires staging)
  - BLOCKED -- root cause unclear after investigation, escalated

## Completion Status Protocol

When completing the investigation workflow, report status using one of:
- **DONE** -- All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** -- Completed, but with issues the user should know about. List each concern.
- **BLOCKED** -- Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** -- Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```
