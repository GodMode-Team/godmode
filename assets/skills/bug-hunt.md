---
name: Bug Hunt — 3-Phase Adversarial Audit
trigger: manual
persona: godmode-builder
taskType: review
priority: high
---

# 3-Phase Adversarial Bug Hunt

Run a rigorous, adversarial bug-finding process on the specified target. Three competing passes find real bugs while filtering out false positives.

## Target

Audit the specified codebase, files, or system. If no target is specified, audit the GodMode plugin codebase (`~/Projects/godmode-plugin/src/`).

## Phase 1: Bug Finder

You are a ruthless bug hunter. Find REAL, SHIPPED bugs — not style nits, not theoretical concerns, not "could be improved" suggestions.

**Scoring — per confirmed bug:**
- LOW (cosmetic, docs, minor): +1 point
- MEDIUM (incorrect behavior, data loss risk, security weakness): +5 points
- CRITICAL (crash, data corruption, security bypass, blocks core flow): +10 points

**Rules:**
- Only count bugs in the CURRENT code (not hypothetical future issues)
- Read every relevant file thoroughly before claiming a bug
- Cite exact file paths and line numbers
- Explain what's wrong and the impact
- Duplicates of the same root cause count as ONE bug

**Output format — numbered list:**
```
BUG #N (SEVERITY Xpts): One-line title
File: path/to/file.ts:LINE
What: Detailed explanation
Impact: What breaks or goes wrong
Fix: Suggested fix (1-2 lines)
```

End with: `TOTAL: X bugs found, Y points`

## Phase 2: Adversarial Defense

Now switch roles. You are a defense attorney for this codebase. DISPROVE false bugs from Phase 1.

**Scoring:**
- You EARN the bug's point value for every bug you successfully disprove with evidence
- You LOSE 2x the bug's point value for every bug you wrongly claim is false

Only disprove bugs you're CERTAIN are wrong. If a bug is real, leave it alone.

**For each bug, respond with one of:**
- **REAL** — You verified the bug exists. Don't fight it.
- **DISPROVED** — You have concrete evidence the bug doesn't exist. Cite the exact code that proves it.
- **PARTIALLY TRUE** — The bug exists but severity is wrong. Explain why and suggest correct severity.

**Rules:**
- Read the actual source files. Don't guess.
- "It's unlikely to happen" is NOT a disproof. The code must make it impossible.
- Check for guards, fallbacks, and error handling the finder may have missed.

End with: `DISPROVED: X bugs (Y points earned)`

## Phase 3: Final Ruling

Now make the CORRECT call on every bug, considering both Phase 1 and Phase 2.

**For each bug, rule:**
- **CONFIRMED REAL** — The bug exists. State severity (may differ from original claim).
- **NOT A BUG** — The defense is correct, or you found your own evidence it's not a bug.
- **DOWNGRADE** — Real but less severe than claimed. State new severity.

**Rules:**
- Re-read the actual source code for every ruling. Don't trust either phase blindly.
- Cite file paths and line numbers for every ruling.
- If both phases are wrong, say so.

**Output:**
1. Individual rulings for each bug
2. Summary table: Bug # | Claimed Severity | Ruling | Final Points
3. **MUST FIX** list: bugs that should be fixed before shipping
4. **DEFERRED** list: real but cosmetic/low-priority bugs

## Deliverable

Return the full scorecard with MUST FIX and DEFERRED lists. Include suggested fixes for every MUST FIX item with exact file paths and code snippets.
