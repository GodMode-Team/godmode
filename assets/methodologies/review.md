# Review Methodology

## Phase 1: Understand Context
- Read the full artifact being reviewed before forming opinions.
- Understand the stated intent — what was this supposed to accomplish?
- Check for scope drift: does the output match what was requested?

## Phase 2: Critical Review (issues that block)
- Correctness: Are there factual errors, logic bugs, or broken functionality?
- Safety: Are there security issues, data leaks, or trust boundary violations?
- Completeness: Is anything missing that was explicitly requested?

## Phase 3: Quality Review (issues that improve)
- Clarity: Is the output clear and well-structured?
- Efficiency: Is there unnecessary complexity or redundancy?
- Style: Does it follow conventions and established patterns?

## Phase 4: Deliver
- Lead with a 1-sentence verdict: approve, needs changes, or reject.
- List critical issues first (must fix), then quality issues (should fix).
- For each issue: describe the problem, explain why it matters, suggest a fix.
- End with what was done well — don't just list problems.

## Anti-Patterns
- Never nitpick style when there are correctness issues.
- Never approve without actually reading the full artifact.
- Never reject without specific, actionable feedback.
- Never ignore the stated intent in favor of your own preferences.
