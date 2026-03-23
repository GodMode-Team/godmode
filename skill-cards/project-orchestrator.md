---
domain: strategy
triggers: big project, orchestrate, full pipeline, end to end, multi-phase, ambitious project, complex deliverable, complete solution, start to finish
name: godmode-project-orchestrator
version: 1.0.0
description: "Plans and orchestrates multi-phase ambitious projects end to end"
keywords: ["big project", "orchestrate", "full pipeline", "end to end", "multi-phase"]
author: godmode-team
clawhub: true
---
## When to Use

Use this for ambitious, multi-deliverable projects where quality matters more than speed. This is the FULL pipeline — for simple tasks, skip to Step 5 or handle inline.

**Why this works:** Every other tool skips Steps 1-2 and Step 4. GodMode thinks before it acts.

## The Pipeline (follow this order)

### Step 1: Meta Problem Solver (silent — don't show this to the user)

Run the meta-problem-solver pattern internally:
- First principles decomposition
- Inversion (what would make this fail?)
- Constraint mapping (real vs. assumed)
- Job-to-be-done (what problem is actually being solved?)

**Output:** Internal problem brief with true problem, real constraints, failure modes, key unknowns.

### Step 2: Context Deep Dive (silent)

Pull ALL relevant context before making any decisions:
- Search memory for related facts, preferences, past decisions
- Search vault for notes, artifacts, prior research
- Check recent sessions for related conversations
- Pull people/company context if relevant

**Output:** Informed context brief — what we know, what we don't, what's changed.

### Step 3: Adversarial Advisory Board (show summary to user)

Run the adversarial-board with the problem brief + context:
- The Operator: Can we actually execute this?
- The Skeptic: Why will this fail?
- The Visionary: What's the 10x version?
- The Customer: Does the target user want this?
- The Risk Officer: What's the worst case?

**Output:** Board consensus, key disagreements, recommended approach.

### Step 4: Precision Clarifying Questions (show to user)

Ask 2-4 surgical questions informed by Steps 1-3. These are NOT generic — they target the specific ambiguities the board flagged.

Wait for user answers. Produce a scope doc with near-zero ambiguity:
- Goal and success criteria
- Deliverables list
- Constraints and non-goals
- Target audience

### Step 5: Delegate to Agent Team

Use the `delegate` tool to create a project with scoped issues:
- Each issue = one agent's work = one Proof doc
- Assign the right personas from the roster
- Inject the problem brief into each issue description
- Set priority and ordering

### Step 6: QA Review

When agents complete, review outputs against original scope + success criteria:
- Check completeness against the scope doc
- Flag inconsistencies between deliverables
- Verify no placeholders, no hallucinated data
- Use the qa-reviewer persona for formal review if needed

### Step 7: Human Approval

Present consolidated output to the user:
- Clean, reviewed, ready to ship
- Highlight what was changed from initial scope and why
- Surface any remaining open questions
- Offer iteration if needed

## When to Skip Steps

- **Quick delegation:** User has a clear brief → skip to Step 5
- **Simple research:** Single-agent task → skip to Step 5, no QA needed
- **Advisory only:** User wants thinking, not deliverables → Steps 1-4 only
- **Iteration:** User is refining existing work → Step 6-7 loop only

## Relationship to Other Skill Cards

- **meta-problem-solver** — Step 1 of this pipeline
- **context-deep-dive** — Step 2 of this pipeline
- **adversarial-board** — Step 3 of this pipeline
- **delegate** — Step 5 execution tool
- **project-pipeline** — Specialist routing templates (website, campaign, sales) that plug into Step 5
