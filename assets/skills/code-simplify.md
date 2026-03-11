---
name: Code Simplify — Quality & Clarity Pass
trigger: manual
persona: godmode-builder
taskType: coding
priority: normal
---

# Code Simplify: Quality & Clarity Pass

Review recently changed code for reuse opportunities, quality issues, and unnecessary complexity — then fix what you find.

## Target

Simplify the specified files or the most recently changed files (use `git diff --name-only main...HEAD`).

## What to Look For

### Reduce Complexity
- Unnecessary nesting (flatten early returns)
- Redundant conditions or duplicate logic
- Over-engineered abstractions for one-time operations
- Dead code paths or unused variables/imports

### Improve Clarity
- Unclear variable or function names
- Dense one-liners that sacrifice readability
- Nested ternaries (prefer if/else or switch)
- Missing or misleading comments on non-obvious logic

### Consolidate
- Duplicated code blocks that should be a shared helper
- Copy-paste patterns across files
- Inconsistent approaches to the same problem

### Preserve
- NEVER change what the code does — only how it does it
- Don't remove helpful abstractions that aid organization
- Don't create premature abstractions (3 similar lines > 1 clever function)
- Don't add features, types, or docstrings beyond what's needed

## Process

1. Read the changed files and understand what they do
2. Identify simplification opportunities (list them)
3. Apply fixes — one logical change at a time
4. Run `pnpm build && pnpm typecheck` to verify nothing broke

## Deliverable

For each change made:
1. **File + line range**
2. **What changed**: before → after summary
3. **Why**: clarity / dedup / dead code / complexity reduction

End with: build status (pass/fail) and total changes made.
