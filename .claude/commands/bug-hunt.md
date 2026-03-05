# 3-Phase Adversarial Bug Hunt

Run a rigorous, adversarial bug-finding process on the specified target. This process uses three competing agents to find real bugs while filtering out false positives.

**Target:** $ARGUMENTS (if not specified, ask the user what code/system to audit)

---

## Phase 1: Bug Finder Agent

Launch an agent (subagent_type: "general-purpose", model: "opus") with this prompt:

> You are a ruthless bug hunter. Your job is to find REAL, SHIPPED bugs in the target code — not style nits, not theoretical concerns, not "could be improved" suggestions.
>
> **Target:** [the specified target files/system]
>
> **Scoring — you earn points per confirmed bug:**
> - LOW (cosmetic, docs, minor): +1 point
> - MEDIUM (incorrect behavior, data loss risk, security weakness): +5 points
> - CRITICAL (crash, data corruption, security bypass, blocks core flow): +10 points
>
> **Rules:**
> - Only count bugs that exist in the CURRENT code (not hypothetical future issues)
> - Read every relevant file thoroughly before claiming a bug
> - Cite exact file paths and line numbers
> - Explain what's wrong and what the impact is
> - Duplicates of the same root cause count as ONE bug
>
> **Output format — numbered list:**
> ```
> BUG #N (SEVERITY Xpts): One-line title
> File: path/to/file.ts:LINE
> What: Detailed explanation of the bug
> Impact: What breaks or goes wrong
> Fix: Suggested fix (1-2 lines)
> ```
>
> End with: `TOTAL: X bugs found, Y points`
>
> Go. Read the code. Find real bugs.

Wait for Phase 1 results before proceeding.

---

## Phase 2: Adversarial Agent

Launch a second agent (subagent_type: "general-purpose", model: "opus") with the Phase 1 bug list and this prompt:

> You are a defense attorney for this codebase. Your job is to DISPROVE false bugs from the bug finder's report.
>
> **Scoring:**
> - You EARN the bug's point value for every bug you successfully disprove with evidence
> - You LOSE 2x the bug's point value for every bug you wrongly claim is false (the referee will check)
>
> This incentive structure means you should only disprove bugs you're CERTAIN are wrong. If a bug is real, leave it alone.
>
> **For each bug, respond with one of:**
> - **REAL** — You verified the bug exists. Don't fight it.
> - **DISPROVED** — You have concrete evidence the bug doesn't exist. Cite the exact code that proves it.
> - **PARTIALLY TRUE** — The bug exists but severity is wrong. Explain why and suggest correct severity.
>
> **Rules:**
> - Read the actual source files. Don't guess.
> - "It's unlikely to happen" is NOT a disproof. The code must make it impossible.
> - Check for guards, fallbacks, and error handling the bug finder may have missed.
>
> End with: `DISPROVED: X bugs (Y points earned)`

Wait for Phase 2 results before proceeding.

---

## Phase 3: Referee Agent

Launch a third agent (subagent_type: "general-purpose", model: "opus") with both Phase 1 and Phase 2 results and this prompt:

> You are the final referee. You have the bug finder's report and the adversarial agent's challenges. Your job is to make the CORRECT call on every bug.
>
> **Important:** There IS a ground truth for every bug. Either the code has the bug or it doesn't. You are graded on accuracy — getting it wrong in either direction is a failure.
>
> **For each bug, rule:**
> - **CONFIRMED REAL** — The bug exists in the current code. State severity (may differ from original claim).
> - **NOT A BUG** — The adversarial agent's disproof is correct, or you found your own evidence it's not a bug.
> - **DOWNGRADE** — Real but less severe than claimed. State new severity.
>
> **Rules:**
> - Read the actual source code yourself. Don't trust either agent blindly.
> - Cite file paths and line numbers for every ruling.
> - If both agents are wrong, say so.
>
> **Output:**
> 1. Individual rulings for each bug
> 2. Summary table: Bug # | Claimed Severity | Ruling | Final Points
> 3. **MUST FIX** list: bugs that should be fixed before shipping
> 4. **DEFERRED** list: real but cosmetic/low-priority bugs

Wait for Phase 3, then present the results to the user and fix all MUST FIX bugs.

---

## After All Phases

1. Present the referee's final scorecard to the user
2. Fix all MUST FIX bugs immediately
3. Run `pnpm build` to verify fixes compile
4. Summarize what was found and fixed
