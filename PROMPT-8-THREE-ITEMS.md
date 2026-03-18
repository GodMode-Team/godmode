Read V2-EXECUTION-SPEC.md and the existing skills/ directory for context.

## YOUR TASK: Build 3 components — workspace context injection, skill ontology, and autoresearch loop skill.

These are the three highest-value additions to the v2 slim workspace.

---

## ITEM 1: Workspace Context Injection (~110 lines)

### What It Does
When Prosper delegates a task via queue_add/delegate, the spawned agent gets workspace-specific context injected automatically — brand guide, voice, team, key people, current priorities. This means agents working on TRP tasks get TRP context, agents working on GodMode tasks get GodMode context, without the user manually specifying it every time.

### Architecture
Each workspace has a `context.md` file at `~/godmode/data/workspaces/{workspace-name}/context.md` containing:

```markdown
# {Workspace Name} — Agent Context

## Brand Voice
{tone, style, terminology to use/avoid}

## Team
{key people, roles, contact preferences}

## Current Priorities
{what matters this quarter, active projects}

## Key Context
{domain knowledge, constraints, important facts}

## Tools & Accounts
{which integrations matter for this workspace}
```

### Implementation

1. **Create `src/lib/workspace-context.ts`** (~60 lines):
   - `getWorkspaceContext(workspaceName: string): string | null` — reads the context.md for a workspace
   - `detectWorkspace(taskTitle: string, taskDescription: string): string | null` — simple keyword matching to detect which workspace a task belongs to (e.g., "TRP" → trp, "Patient Autopilot" → patient-autopilot, "GodMode" → godmode)
   - Falls back gracefully: if no workspace detected or no context.md exists, returns null (no context injected)

2. **Modify `src/services/queue-processor.ts`** (~20 lines):
   - After building the task prompt, call `detectWorkspace()` then `getWorkspaceContext()`
   - If context exists, prepend it to the agent's system context: `## Workspace Context\n{context}`
   - This goes BEFORE the task instructions but AFTER the base persona

3. **Modify `src/services/agent-toolkit-server.ts`** (~20 lines):
   - Add endpoint: `GET /workspace/:name/context` — returns workspace context for the given name
   - This lets Paperclip agents (in Phase 2) also access workspace context via API

4. **Create seed workspace context files** (~10 lines each):
   - `~/godmode/data/workspaces/godmode/context.md`
   - `~/godmode/data/workspaces/patient-autopilot/context.md`
   - `~/godmode/data/workspaces/trp/context.md`
   - Populate with basic brand voice + team info from what exists in memory

### RULES:
- Zero new dependencies
- Graceful fallback: missing workspace = no injection, not an error
- Context.md files are user-editable markdown — no special format required beyond headers

---

## ITEM 2: Skill Ontology (~50 lines)

### What It Does
Maps relationships between the 18 existing skills so agents can discover skill chains, not just individual skills. When an agent needs to "write and publish a tweet about competitor research," it can discover that auto-research → first-principles → paperclip-ceo → (content agent) is a valid chain.

### Implementation

Create `skills/ONTOLOGY.md`:

```markdown
# Skill Ontology — How Skills Relate

## Categories

### Research & Analysis
- auto-research: Deep multi-source research
- auto-context: Pre-meeting/pre-task context surfacing
- first-principles: Structured problem decomposition
- adversarial-board: Multi-persona decision challenge
- red-team-audit: Security and risk analysis

### Planning & Delegation
- paperclip-ceo: Agent team delegation
- meeting-prep: Pre-meeting preparation (chains with auto-context)
- post-meeting: Post-meeting processing

### Self-Improvement
- skill-builder: Creates new skills from repeated patterns
- autoresearch-loop: Overnight self-optimization (see below)

### Operations
- dashboard-builder: Create visual dashboards
- evening-processing: End-of-day consolidation
- evening-review: Reflection and learning extraction
- weekly-coaching: Weekly planning and alignment check

### Onboarding
- godmode-onboarding: New user setup
- dynamic-onboarding: Progressive user discovery

## Common Chains

| Goal | Chain |
|------|-------|
| Research and publish finding | auto-research → first-principles → paperclip-ceo (content agent) |
| Prepare for meeting | auto-context → meeting-prep |
| Process completed meeting | post-meeting → auto-context (update people files) |
| Challenge a major decision | first-principles → adversarial-board → auto-research (validate concerns) |
| Create a new workflow | skill-builder → red-team-audit (validate) |
| Delegate complex project | auto-research (scope) → paperclip-ceo (delegate) → evening-review (check) |
| End-of-day flow | evening-processing → evening-review |
| Optimize a skill overnight | autoresearch-loop (target the skill) |

## Dependencies

| Skill | Depends On |
|-------|-----------|
| meeting-prep | auto-context |
| post-meeting | auto-context (for people lookup) |
| paperclip-ceo | auto-research (for task scoping) |
| adversarial-board | first-principles (for structured analysis) |
| autoresearch-loop | skill-builder (to save improvements) |
```

### Also modify `skills/paperclip-ceo/SKILL.md` and `skills/first-principles/SKILL.md`:
Add a line to each: `Before planning, consult skills/ONTOLOGY.md to identify relevant skill chains for this task.`

---

## ITEM 3: Autoresearch Loop Skill

### What It Does
The Karpathy pattern applied to GodMode: define an objective with a measurable metric → agent iterates variations → measures improvement → keeps what works → repeats. But GodMode's version is unique: it doesn't just optimize code metrics — it optimizes the **user's life alignment**.

### The Vision (not all Day 1 — document the full vision, implement the simple version)
GodMode's autoresearch loop can optimize:
- **Skills** — Run a skill 10 ways, measure quality (trust ratings + user feedback), keep the best version
- **Prompts** — Iterate on agent persona prompts, measure response quality
- **User alignment** — "Is Caleb actually working on his stated priorities or getting pulled into research rabbit holes?" → surface the pattern, suggest corrections
- **Life systems** — "Your morning brief gets dismissed 40% of the time. Let me try a shorter format for a week and measure engagement."

### Day 1 Implementation

Create `skills/autoresearch-loop/SKILL.md`:

```markdown
# Autoresearch Loop — Self-Improving Optimization

## Description
The Karpathy pattern for GodMode: define an objective, iterate experiments, measure, keep improvements, repeat. Makes skills, prompts, and workflows self-improving overnight.

## Trigger
- "optimize [skill/prompt/workflow]"
- "run autoresearch on [target]"
- "make [X] better overnight"
- Cron: nightly optimization cycle (when configured)
- After trust rating drops below 7 on any skill

## Process

### Phase 1: Define
1. Identify the optimization target (skill card, prompt, workflow)
2. Define the metric: trust rating average, completion rate, user edit frequency, or custom eval
3. Read the current version as baseline
4. Create a git branch: `autoresearch/{target}-{date}`

### Phase 2: Iterate (runs N times, default 5)
For each iteration:
1. Generate a variation of the target (adjust triggers, reorder steps, add/remove detail, change tone)
2. Run the variation against 2-3 test scenarios:
   - For skills: simulate the trigger and evaluate output quality
   - For prompts: generate responses and compare to baseline
   - For workflows: trace the workflow and measure efficiency
3. Score the variation (0-10) using the defined metric
4. If score > baseline: keep as new baseline, commit to branch
5. If score <= baseline: discard, try a different approach
6. Log: `{ iteration, variation_desc, score, kept: bool }` to `autoresearch/logs/{target}-{date}.jsonl`

### Phase 3: Report
1. Summarize: how many iterations, how many improvements, net score change
2. If improvements found: create PR or write updated file
3. Add to daily note: "Autoresearch: [target] improved from X to Y over N iterations"
4. If no improvements after all iterations: log "baseline is already optimized" and stop

## Metrics Guide
| Target | Default Metric | How Measured |
|--------|---------------|--------------|
| Skill card | Trust rating average | trust_rate scores from last 10 uses |
| Agent prompt | Output quality (LLM judge) | Sonnet evaluates: clarity, accuracy, actionability |
| Workflow | Completion rate | % of times workflow runs to completion without error |
| Morning brief | Engagement | Does user read it? Respond to it? Dismiss it? |

## Configuration
```yaml
# In ~/godmode/data/autoresearch-config.yaml
targets:
  - name: daily-brief
    metric: engagement
    iterations: 5
    schedule: nightly
  - name: auto-research
    metric: trust-rating
    iterations: 10
    schedule: weekly
```

## The Life Alignment Layer (Phase 2)
The unique GodMode version: optimize not just technical outputs but life outcomes.
- Track: Are stated priorities reflected in actual time allocation?
- Track: Which types of tasks get completed vs deferred vs abandoned?
- Track: When does the user override agent suggestions? (signals misalignment)
- Surface patterns: "You say GodMode is priority #1 but 60% of your tasks this week were TRP."
- This is NOT about judging. It's about making the invisible visible.

## Examples
1. "Optimize the daily brief skill" → reads current skill card, runs 5 variations with different summary lengths/formats, scores each via LLM judge on clarity + actionability, keeps best version, logs results.
2. Trust rating for "email drafts" drops to 5.2 → auto-triggers optimization. Runs 10 variations of email prompt. Finds that adding "match the tone of recent sent emails" improves quality. Saves improvement.

## Failure Modes
- **No baseline metric** → Can't optimize what you can't measure. If no trust ratings exist for the target, run 3 baseline evaluations first.
- **All variations worse** → Baseline is already good. Log it and move on. Don't force-change what works.
- **Expensive** → Each iteration costs tokens. Default to 5 iterations max. Use Sonnet, not Opus, for evals.
- **Overfitting** → Optimizing for a narrow metric can make the skill worse overall. Always include a "general quality" check alongside the specific metric.
```

### Also create `autoresearch/README.md`:
Brief docs on how the autoresearch system works, linking to the existing campaign infrastructure in autoresearch/.

---

## VALIDATION

```bash
ls skills/ONTOLOGY.md
ls skills/autoresearch-loop/SKILL.md
ls src/lib/workspace-context.ts
pnpm typecheck && pnpm build
```

## COMMIT

```bash
git add -A
git commit -m "feat: workspace context injection + skill ontology + autoresearch loop"
```
