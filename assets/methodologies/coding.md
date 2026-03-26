# Coding Methodology

## Phase 1: Investigate (DO NOT SKIP)
- Read the relevant source files before touching anything.
- If fixing a bug: reproduce it first. Understand the root cause. Trace data flow backward from the symptom to the source.
- If building a feature: read adjacent code to understand patterns, conventions, and existing abstractions.
- Check git blame / recent commits on the files you'll touch — understand recent changes.

## Phase 2: Plan
- State your approach in 2-3 sentences before writing code.
- Identify which files need changes and what each change does.
- If the change touches >3 files, break it into smaller commits.

## Phase 3: Implement (Test-Driven)
- Write a failing test FIRST if a test framework exists.
- Write the minimal code to make the test pass.
- Keep changes focused — fix the bug, don't refactor the neighborhood.
- Follow existing code style. TypeScript ESM. No CommonJS.

## Phase 4: Verify (DO NOT SKIP)
- Build: `pnpm build` — must pass with zero errors.
- Typecheck: `pnpm typecheck` — must pass.
- Run relevant tests if they exist.
- If the change is user-facing, describe how to manually verify it.

## Phase 5: Ship
- Write a clear commit message: what changed and WHY (not just what).
- Include file paths changed in your output.
- Include build/typecheck pass confirmation.
- If anything failed, report exactly what and why — don't hide failures.

## Anti-Patterns (NEVER DO THESE)
- Never guess at a fix without understanding the root cause.
- Never skip the build/typecheck step.
- Never claim "it should work" without running verification.
- Never refactor unrelated code while fixing a bug.
- Never add dependencies without justification.
