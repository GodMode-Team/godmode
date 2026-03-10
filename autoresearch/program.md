# GodMode Autoresearch

*Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). Same pattern: modify → measure → keep or revert → loop forever.*

## What This Is

An autonomous self-improvement loop for GodMode's brain — the skill routing, memory recall, and context injection that determine how well the ally serves the user.

**You are an autonomous researcher.** Your job is to make GodMode measurably smarter by iterating on its routing and context systems. You run experiments, measure results, and keep improvements.

## The Three Metrics

1. **Skill Trigger Precision** — Does the right skill card fire for a given user message? Measured by `eval.sh` against a test suite of 80+ messages with expected domains.
2. **Memory Recall Quality** — Does the right context surface for a given query? Measured by LLM-as-judge scoring relevance of search results against known-good answers.
3. **Goal Alignment** — Does the ally's assembled context actually help advance the user's goals? Measured by LLM-as-judge scoring context quality against real session logs.

Combined score = `(skill_precision * 0.4) + (memory_recall * 0.3) + (goal_alignment * 0.3)`

## Setup

To set up a new autoresearch run:

1. **Agree on a run tag** with the user (e.g. `mar9`). Branch `autoresearch/<tag>` must not exist yet.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current branch.
3. **Read the in-scope files** (the repo is small, these are what you modify):
   - `skill-cards/*.md` — trigger keywords, domain routing, tool tips
   - `src/lib/context-budget.ts` — priority tiers, relevance detection, soul essence, capability map
   - `src/lib/skill-cards.ts` — trigger matching algorithm
   - `src/lib/awareness-snapshot.ts` — ephemeral state format
4. **Run baseline**: `./autoresearch/eval.sh` to establish starting scores.
5. **Initialize results.tsv** with baseline scores.
6. **Confirm and go.**

## What You CAN Modify

- `skill-cards/*.md` — add/remove/reword triggers, rewrite tips, restructure gotchas
- `src/lib/context-budget.ts` — relevance detection words, priority tier logic, soul essence, capability map, section ordering
- `src/lib/skill-cards.ts` — matching algorithm (e.g. scoring weights, tie-breaking, multi-match handling)
- `src/lib/awareness-snapshot.ts` — what goes into the ephemeral state snapshot
- `autoresearch/test-suite.json` — add test cases you discover are missing (but never delete existing ones or game the tests)

## What You CANNOT Modify

- `autoresearch/eval.sh` — the evaluation harness is read-only (same as Karpathy's `prepare.py`)
- `autoresearch/program.md` — this file (human edits this, not you)
- `src/services/*.ts` — services are out of scope
- `src/methods/*.ts` — RPC handlers are out of scope
- `index.ts` — entry point is out of scope

## The Experiment Loop

LOOP FOREVER:

1. **Read current state**: Check `results.tsv` for recent trends. What's been tried? What worked?
2. **Form a hypothesis**: Based on test failures, propose a specific change. Example: "Adding 'standup' as a calendar trigger should fix test case 37."
3. **Make the change**: Edit the file(s). Keep changes small and focused — one idea per experiment.
4. **Git commit**: Commit with a descriptive message.
5. **Run eval**: `./autoresearch/eval.sh > eval.log 2>&1`
6. **Read results**: `grep "^SCORE:" eval.log`
7. **Log to results.tsv**: Record commit, scores, status, description.
8. **Keep or revert**:
   - If combined score improved → keep (advance the branch)
   - If combined score stayed the same but code got simpler → keep
   - If combined score dropped → `git reset --hard HEAD~1` (revert)
9. **Repeat from step 1.**

## Logging Results

Tab-separated `results.tsv`:

```
commit	skill_precision	memory_recall	goal_alignment	combined	status	description
a1b2c3d	0.85	0.72	0.78	0.79	keep	baseline
b2c3d4e	0.88	0.72	0.78	0.80	keep	add standup trigger to calendar
c3d4e5f	0.85	0.72	0.78	0.79	discard	reorder priority tiers
```

## Simplicity Criterion

All else being equal, simpler is better. A tiny score improvement that adds ugly complexity is not worth it. Removing something and getting equal or better results is a great outcome — that's a simplification win.

## Rules

- **NEVER STOP.** Once the loop begins, do not pause to ask the user anything. They may be asleep. You are autonomous. If you run out of ideas, re-read the test failures, re-read the skill cards, try combining near-misses, try more radical changes. The loop runs until the human interrupts you.
- **Small changes.** One idea per experiment. If a change touches 3 files, it's probably too big.
- **Don't game the tests.** Never modify eval.sh or delete test cases. If a test case seems wrong, add a note but keep it.
- **Build the plugin after code changes.** Run `pnpm build` after modifying `.ts` files. If build fails, fix it before running eval.
- **Log everything.** Every experiment gets a row in results.tsv, even crashes.
