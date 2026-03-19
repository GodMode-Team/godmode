# Plan: Trust Tracker Elevation + AutoResearch Self-Improvement Engine

> **Status:** Draft — ready for Claude Code execution
> **Priority:** P0 (Trust UI) → P1 (AutoResearch Engine) → P2 (Wiring Fixes)
> **Branch:** `feat/trust-autoresearch`
> **Scope:** Backend + UI + new queue task type + Hermes adapter wiring

---

## Executive Summary

The Trust Tracker backend is solid (685-line `trust-tracker.ts`, autonomy gating, feedback refinement, daily ratings, queue auto-rating). The problems:

1. **Buried in Settings** — Trust is tab 4 of 6 inside the Settings sidebar (`navigation.ts:5`). Users don't see it.
2. **No feedback→improvement loop** — Trust refinement writes feedback INTO persona files, but never verifies if the feedback actually improved performance.
3. **Hermes adapter has no auto-trigger** — The `trust-feedback.ts` hook fires via OpenClaw lifecycle hooks; Hermes users only get manual `trust_rate` calls.
4. **MAX_WORKFLOWS = 5 is too low** — Power users with 10+ personas hit the cap immediately.

The fix: Elevate trust to the Today view, build an AutoResearch optimizer that closes the feedback→improvement loop, and wire trust feedback into the Hermes adapter.

---

## Architecture Reference

### Existing Trust Files (READ ALL BEFORE CODING)

| File | Lines | Purpose |
|------|-------|---------|
| `src/methods/trust-tracker.ts` | 685 | Backend: state management, CRUD, ratings, dashboard endpoint, autonomy levels |
| `src/tools/trust-rate.ts` | 145 | MCP tool for agent to rate workflows 1-10 |
| `src/lib/trust-refinement.ts` | 240 | Writes feedback into persona/skill markdown files, Haiku consolidation |
| `src/hooks/trust-feedback.ts` | 155 | Post-tool-call hook that queues feedback prompt for next turn |
| `ui/src/ui/views/trust-tracker.ts` | 785 | Full trust dashboard UI (Lit web component) |
| `ui/src/ui/controllers/trust-tracker.ts` | ~200 | Controller: fetches trust data, handles UI events |
| `ui/src/ui/views/my-day.ts` | 616 | Today/My Day view (where trust card should go) |
| `ui/src/ui/controllers/my-day.ts` | ~300 | My Day controller |
| `ui/src/ui/navigation.ts` | ~550 | Tab routing — trust is under Settings group |
| `ui/src/ui/app-settings.ts` | ~540 | Settings tab switching logic |
| `src/lib/awareness-snapshot.ts` | ~350 | Ephemeral context injection, includes trust scores (L281-301) |
| `src/services/queue-processor.ts` | 1589 | Queue processor with autonomy gating (L201-211, L558-569, L692-696) |

### Key Constants
```typescript
MAX_WORKFLOWS = 5;          // src/methods/trust-tracker.ts:24 — CHANGE TO 15
MAX_RATINGS = 500;           // per workflow, FIFO trim
MAX_DAILY_RATINGS = 90;      // ~3 months
SCORE_THRESHOLD = 10;        // ratings needed before trust score assigned
FEEDBACK_THRESHOLD = 7;      // below this triggers feedback collection
```

### State File
```
~/godmode/data/trust-tracker.json
```

### Trust Data Shape
```typescript
type TrustTrackerState = {
  workflows: string[];
  ratings: TrustRating[];
  dailyRatings?: DailyRating[];
  workflowFeedback: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
};
```

### Autonomy Levels (used by queue processor)
- `full` (score ≥ 8): auto-approve results, skip manual review
- `approval` (score 5-7.9): queue for human review after completion
- `disabled` (score < 5): block from running entirely
- Untracked workflows default to `full` (opt-in system)

---

## Phase 1: Trust UI Elevation (P0)

### Goal
Surface trust score and daily rating in the Today/My Day view as a hero card. Trust should be visible every time the user opens GodMode — not buried in Settings.

### 1.1 — Trust Summary Card in My Day View

**File:** `ui/src/ui/views/my-day.ts`

Add a new `renderTrustSummaryCard()` function that renders:
- **Overall trust score** (big number, color-coded: green ≥8, yellow ≥5, red <5)
- **Daily rating prompt** — 1-10 button row (same as the one in `trust-tracker.ts` view, lines ~400-500)
- **Streak counter** — "🔥 12-day streak" for consecutive daily ratings
- **Quick stat:** "5 workflows tracked, 3 above 8.0"
- **Link to full dashboard** — "View details →" navigates to trust tab

Add to `MyDayProps`:
```typescript
trustSummary?: {
  overallScore: number | null;
  dailyStreak: number;
  todayRated: boolean;
  workflowCount: number;
  highPerformers: number; // workflows with score ≥ 8
  needsAttention: number; // workflows with score < 7
};
onTrustDailyRate?: (rating: number, note?: string) => void;
onNavigateToTrust?: () => void;
```

**Placement:** After the Daily Brief section, before the Tasks section. This makes it part of the daily flow: Brief → Rate → Tasks.

### 1.2 — My Day Controller Trust Data Fetch

**File:** `ui/src/ui/controllers/my-day.ts`

Add to the My Day controller's data fetch:
```typescript
// Fetch trust dashboard data alongside daily brief
const trustDashboard = await this.gateway.request("trust.dashboard", {});
```

Map the response into `trustSummary` props. The `trust.dashboard` endpoint already returns everything we need: `overallScore`, `dailyStreak`, `todayRating`, `summaries`.

### 1.3 — Keep Trust in Settings Too

Don't remove the full trust dashboard from Settings. The My Day card is a summary + daily rating entry point. The Settings → Trust tab remains the full management view (add/remove workflows, history, detailed per-workflow scores, guardrails view).

---

## Phase 2: AutoResearch Self-Improvement Engine (P1)

### Goal
Build a system that uses trust feedback as eval criteria to automatically improve personas and skills. This is the Karpathy autoresearch loop adapted for GodMode.

### Reference: Ole Lehmann's Method
Source: `https://olelehmann.com/autoresearch` / `@Hesamation` tweet thread

**The Loop:**
1. Define 3-6 yes/no eval checklist questions per workflow
2. Run the skill/persona, score against checklist → baseline %
3. Mutate: make one small change to the persona/skill markdown
4. Test: run 10x with mutation, score each
5. Keep/Revert: if average improved → keep, else revert
6. Repeat 4-50 rounds

**Key insight:** 3-6 checklist items is the sweet spot. More than that and the skill "games the checklist."

### 2.1 — New Queue Task Type: `optimize`

**File:** `src/lib/queue-state.ts`

Add `"optimize"` to the `QueueItemType` union:
```typescript
export type QueueItemType = 
  "coding" | "research" | "analysis" | "creative" | "review" | "ops" | "task" | "url" | "idea" | "optimize";
```

Add to `AGENT_ROLE_NAMES`:
```typescript
optimize: "Skill Optimizer",
```

**File:** `src/services/queue-processor.ts`

Add prompt template for `optimize`:
```typescript
optimize: "Optimize this skill/persona: {title}\n{description}\n\nFollow the AutoResearch protocol:\n1. Read the current skill/persona markdown\n2. Generate 3-6 yes/no eval criteria from stored trust feedback\n3. Run baseline evaluation\n4. Make ONE targeted mutation to the markdown\n5. Test the mutation against eval criteria\n6. If improved, keep. If worse, revert.\n7. Repeat up to {maxRounds} rounds.\n\nWrite results to: Baseline score, Final score, Changes made, Evaluation log.",
```

### 2.2 — Optimization State File

**File:** `src/lib/optimization-state.ts` (NEW)

Create a new state file for tracking optimization runs:
```
~/godmode/data/optimization-runs.json
```

```typescript
type OptimizationRun = {
  id: string;
  workflow: string;              // matches trust tracker workflow name
  targetFile: string;            // resolved persona/skill markdown path
  evalCriteria: EvalCriterion[]; // 3-6 yes/no questions
  baselineScore: number;         // starting pass rate (0-100%)
  currentScore: number;          // latest pass rate
  rounds: OptimizationRound[];   // mutation history
  status: "running" | "completed" | "reverted" | "failed";
  startedAt: string;
  completedAt?: string;
  trustScoreBefore?: number;     // trust tracker score at start
  trustScoreAfter?: number;      // trust tracker score after (measured over time)
};

type EvalCriterion = {
  question: string;    // yes/no question like "Does the output match the user's tone?"
  weight: number;      // 1-3, higher = more important
  source: "feedback" | "auto" | "manual"; // where this criterion came from
};

type OptimizationRound = {
  round: number;
  mutation: string;     // description of what was changed
  diff: string;         // actual diff of the markdown change
  scores: boolean[];    // per-criterion pass/fail for this round
  passRate: number;     // percentage of criteria passed
  kept: boolean;        // was this mutation kept?
  timestamp: string;
};
```

### 2.3 — Eval Criteria Generator

**File:** `src/lib/optimization-eval.ts` (NEW)

Auto-generate eval criteria from trust feedback:

```typescript
/**
 * Generate eval criteria for a workflow from trust feedback + persona/skill content.
 * Uses stored feedback from trust-tracker.json as the primary signal.
 * Falls back to auto-generated criteria based on the persona's stated goals.
 */
export async function generateEvalCriteria(
  workflow: string,
  feedbackItems: string[],
  personaContent: string,
): Promise<EvalCriterion[]> {
  // If we have trust feedback, convert each into a yes/no criterion
  // "be more concise" → "Is the output concise (under 500 words for summaries)?"
  // "match my tone" → "Does the output match the user's direct, no-hedging communication style?"
  
  // Use Haiku to convert feedback → eval criteria (cheap, fast)
  // Then supplement with 1-2 auto-generated criteria from persona goals
  
  // Cap at 6 criteria (Ole Lehmann's recommended max)
}
```

### 2.4 — Optimization Orchestrator

**File:** `src/services/optimization-orchestrator.ts` (NEW)

This is the core autoresearch loop. It:
1. Resolves the target file using `trust-refinement.ts`'s `resolveWorkflowFile()`
2. Reads the current markdown content
3. Generates eval criteria (from trust feedback + persona goals)
4. Runs baseline: spawns a test task using the current persona/skill, scores output against criteria
5. Mutation loop (configurable rounds, default 4):
   a. Spawns Haiku to suggest ONE targeted mutation to the markdown
   b. Applies the mutation
   c. Runs 3-5 test tasks with the mutated version
   d. Scores each output against criteria
   e. If average improved → keep mutation, else revert
6. Writes results to optimization state file
7. If the final score > baseline by ≥ 10%, commits the improved version
8. Broadcasts `optimization:complete` event for UI update

**Important constraints:**
- Each mutation must be small and reversible (single paragraph change, instruction reword, example addition)
- Never delete core identity/role sections — only modify instructions, examples, and constraints
- Keep a full diff log so the user can review/revert any change
- Run at low priority — optimization tasks should never block user-initiated queue items

### 2.5 — Trust Feedback → Eval Pipeline

**The key integration that closes the loop:**

```
User rates workflow < 7 → 
  trust.feedback stores improvement text →
    trust-refinement.ts writes feedback to persona file (existing) →
      optimization-orchestrator uses feedback as eval criteria (NEW) →
        improved persona tested against criteria (NEW) →
          trust score improves over time (measured naturally)
```

This means the user's casual "it should be more concise" feedback becomes a formal eval criterion that the system optimizes for.

### 2.6 — Queue Add Tool Update

**Files:** `src/tools/queue-add.ts`, `src/methods/queue.ts`

Add `optimize` to the allowed types. When the ally says "I notice your content-writer persona has been scoring 6.2/10 — want me to optimize it?", the user can approve and it queues:

```typescript
{
  type: "optimize",
  title: "Optimize content-writer persona",
  description: "Trust score: 6.2/10. Feedback: 'too verbose', 'doesn't match my tone'. Run autoresearch loop with 4 rounds.",
  persona: "skill-optimizer", // dedicated optimizer persona
  priority: "low",
}
```

### 2.7 — Proactive Optimization Triggers

**File:** `src/lib/awareness-snapshot.ts`

In the awareness snapshot (injected every turn), add a section that suggests optimization when:
- A workflow has trust score < 7 with ≥ 3 feedback items
- A workflow has been declining for ≥ 5 recent ratings
- A workflow hasn't been optimized in > 30 days and has feedback

This is a prompt-level nudge, not automatic execution. The ally suggests it, the user approves.

Example awareness line:
```
## Optimization Opportunities
- "content-writer" scored 6.2/10 with 4 feedback items. Consider running optimization.
```

### 2.8 — Optimizer Persona

**File:** `assets/agent-roster/skill-optimizer.md` (NEW)

Create a dedicated optimizer persona that:
- Understands the eval criteria format
- Makes conservative, targeted mutations (one change at a time)
- Provides clear reasoning for each mutation
- Respects persona identity sections (never changes name, role, core traits)
- Focuses on: instruction clarity, example quality, constraint specificity, tone matching

---

## Phase 3: Wiring Fixes (P2)

### 3.1 — Increase MAX_WORKFLOWS

**File:** `src/methods/trust-tracker.ts`, line 24

```typescript
// BEFORE
export const MAX_WORKFLOWS = 5;

// AFTER
export const MAX_WORKFLOWS = 15;
```

Also update `src/tools/trust-rate.ts` which imports this constant — it already uses the import, so just the source change is needed.

### 3.2 — Hermes Adapter Trust Feedback Hook

**Problem:** The `trust-feedback.ts` hook fires via OpenClaw's `after_tool_call` lifecycle. Hermes doesn't go through that lifecycle, so Hermes users never get the automatic "how'd I do?" prompt.

**Solution:** The Hermes adapter already exposes `trust_rate` as an MCP tool. The missing piece is a **Hermes-side skill or system prompt instruction** that tells the agent to self-rate after completing tracked workflows.

**File:** Add to the Hermes adapter's context injection (or as a Hermes skill):

```markdown
## Trust Rating Protocol
After completing a task that matches a tracked workflow, call `trust_rate` with:
- workflow: the workflow name
- rating: your honest 1-10 assessment
- note: brief note on what went well or poorly

Tracked workflows are listed in the awareness snapshot under "## Trust".
If the trust score drops below 7, ask the user what could be improved.
```

This is the lightest-weight approach — no new code in the adapter, just prompt engineering.

### 3.3 — Daily Rating Correlation

**File:** `src/methods/trust-tracker.ts`

Enhance the `trust.dailyRate` handler to also record which workflows were active that day:

```typescript
// In trust.dailyRate handler, after recording the daily rating:
const todayStr = new Date().toISOString().slice(0, 10);
const todayWorkflows = state.ratings
  .filter(r => r.timestamp.startsWith(todayStr))
  .map(r => r.workflow);
entry.activeWorkflows = [...new Set(todayWorkflows)];
```

Update `DailyRating` type:
```typescript
type DailyRating = {
  id: string;
  date: string;
  rating: number;
  note?: string;
  activeWorkflows?: string[]; // workflows that ran today
  timestamp: string;
};
```

This lets the system correlate "user rated 5/10 today" with "content-writer and email-drafter ran today" → surface which workflow likely caused the low rating.

### 3.4 — Awareness Snapshot Trust Bug Fix

**File:** `src/lib/awareness-snapshot.ts`, lines 285-289

The current trust section in awareness-snapshot reads `trustData.workflows` as if it's an array of `{name, score}` objects, but the actual state shape is just `workflows: string[]` with scores computed from ratings. This is likely a bug that produces empty/wrong output.

Fix: Use `computeTrustSummary` or replicate the score computation:
```typescript
import { readTrustState, computeTrustSummary } from "../methods/trust-tracker.js";

// Replace the manual trust parsing with:
const trustState = await readTrustState();
const summaries = computeTrustSummary(trustState, 30);
const scored = summaries.filter(s => s.trustScore !== null);
if (scored.length > 0) {
  lines.push("## Trust");
  const sorted = scored.sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0));
  if (sorted.length === 1) {
    lines.push(`- 1 workflow tracked: ${sorted[0].workflow} (${sorted[0].trustScore}/10).`);
  } else {
    lines.push(`- ${sorted.length} workflows tracked. Highest: ${sorted[0].workflow} (${sorted[0].trustScore}/10). Lowest: ${sorted[sorted.length-1].workflow} (${sorted[sorted.length-1].trustScore}/10).`);
  }
  // Add optimization opportunities
  const needsWork = scored.filter(s => (s.trustScore ?? 10) < 7 && (trustState.workflowFeedback[s.workflow]?.length ?? 0) >= 2);
  if (needsWork.length > 0) {
    lines.push("## Optimization Opportunities");
    for (const w of needsWork) {
      lines.push(`- "${w.workflow}" at ${w.trustScore}/10 with ${trustState.workflowFeedback[w.workflow]?.length ?? 0} feedback items.`);
    }
  }
}
```

---

## Phase 4: Future — Life AutoResearcher (P3, post-v1)

> Not for this sprint. Documenting the vision for future reference.

The same autoresearch pattern applied to the user's life:
- **Morning routine optimization:** Test small changes, track daily rating impact
- **Meeting prep optimization:** Mutate the prep approach, measure user satisfaction  
- **Communication style coaching:** Analyze sent messages vs received responses
- **Goal progress acceleration:** Identify which daily habits correlate with goal advancement

This requires:
- Longer feedback loops (days/weeks vs. minutes)
- Outcome tracking beyond trust ratings (goal progress, habit completion)
- User consent and transparency for each optimization experiment
- A/B testing framework for life changes (not just prompt changes)

The trust tracker daily rating + goal system already provides the data foundation. The optimization engine from Phase 2 provides the loop mechanism. Phase 4 is connecting those to life outcomes.

---

## Implementation Order

```
1. [P0] Phase 3.1 — Bump MAX_WORKFLOWS to 15 (5 min)
2. [P0] Phase 3.4 — Fix awareness snapshot trust bug (30 min)
3. [P0] Phase 1.1-1.2 — Trust summary card in My Day (2-3 hours)
4. [P1] Phase 2.2 — Optimization state file (1 hour)
5. [P1] Phase 2.3 — Eval criteria generator (2 hours)  
6. [P1] Phase 2.1 — Queue type: optimize (30 min)
7. [P1] Phase 2.4 — Optimization orchestrator (4-6 hours, biggest piece)
8. [P1] Phase 2.8 — Optimizer persona markdown (1 hour)
9. [P1] Phase 2.5-2.7 — Integration wiring (2 hours)
10. [P2] Phase 3.2 — Hermes trust feedback prompt (30 min)
11. [P2] Phase 3.3 — Daily rating correlation (1 hour)
```

**Total estimate:** ~15-20 hours of agent work, splittable across multiple sessions.

---

## Success Criteria

- [ ] Trust score visible on Today/My Day without navigating to Settings
- [ ] Daily rating can be submitted from the My Day card
- [ ] `optimize` queue type works end-to-end (queue → spawn → eval → mutate → measure → commit)
- [ ] Trust feedback items become eval criteria automatically
- [ ] At least one persona/skill shows measurable improvement after optimization
- [ ] Awareness snapshot correctly shows trust scores and optimization opportunities
- [ ] MAX_WORKFLOWS increased to 15
- [ ] Hermes users get prompted to rate workflows (via skill/prompt, not lifecycle hook)
- [ ] `pnpm build` passes clean after all changes

---

## Anti-Patterns to Avoid

1. **Don't build a full A/B testing framework.** This is a simple mutation loop with keep/revert logic. No statistical significance testing, no multi-arm bandits. That's Phase 4 territory.
2. **Don't auto-run optimizations without user approval.** The ally suggests optimization, the user says yes. Never auto-mutate persona files silently.
3. **Don't optimize core identity sections.** Name, role, core traits, communication style — these are the user's choices. Only optimize instructions, examples, constraints, and workflow steps.
4. **Don't exceed 6 eval criteria per workflow.** More than that and the optimizer games the checklist (Ole Lehmann's finding).
5. **Don't block the queue for optimization runs.** Always priority: "low". User-initiated tasks take precedence.
6. **Don't store optimization diffs in the trust-tracker.json file.** Separate state file (`optimization-runs.json`) to keep concerns clean.

---

## Files to Create (New)

| File | Purpose |
|------|---------|
| `src/lib/optimization-state.ts` | State management for optimization runs |
| `src/lib/optimization-eval.ts` | Eval criteria generation from trust feedback |
| `src/services/optimization-orchestrator.ts` | Core autoresearch loop |
| `assets/agent-roster/skill-optimizer.md` | Dedicated optimizer persona |

## Files to Modify (Existing)

| File | Change |
|------|--------|
| `src/methods/trust-tracker.ts` | MAX_WORKFLOWS → 15, DailyRating type update |
| `src/lib/queue-state.ts` | Add "optimize" to QueueItemType |
| `src/services/queue-processor.ts` | Add optimize prompt template |
| `src/tools/queue-add.ts` | Allow "optimize" type |
| `src/methods/queue.ts` | Allow "optimize" type |
| `src/lib/awareness-snapshot.ts` | Fix trust data parsing, add optimization opportunities |
| `ui/src/ui/views/my-day.ts` | Add trust summary card |
| `ui/src/ui/controllers/my-day.ts` | Fetch trust dashboard data |
| `ui/src/ui/views/trust-tracker.ts` | Minor: link back from full dashboard |
