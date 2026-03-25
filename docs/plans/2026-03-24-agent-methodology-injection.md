# Agent Methodology Injection — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Inject gstack-quality structured workflows into every GodMode sub-agent via methodology files, so agents investigate before fixing, plan before coding, and verify before claiming done.

**Architecture:** Create methodology markdown files in `assets/methodologies/`. Add a loader function and a task-type→methodology mapping in `queue-processor.ts`. Inject the methodology as a `## Methodology` section in `buildPromptForItem()`, right after the persona section. Also upgrade the thin `PROMPT_TEMPLATES` to reference the methodology.

**Tech Stack:** Markdown files + ~20 lines TypeScript in queue-processor.ts. No new dependencies.

---

### Task 1: Create `assets/methodologies/base.md`

Universal principles ALL agents follow regardless of task type.

**Files:**
- Create: `assets/methodologies/base.md`

**Step 1: Write the file**

```markdown
# Base Methodology — All Agents

## Before Starting
- Read the full task description twice. Identify what success looks like.
- Search existing context (toolkit API, vault, memory) before generating anything new.
- If the task is ambiguous, state your interpretation and proceed — don't stall.

## During Execution
- Work in phases: understand → plan → execute → verify. Never skip phases.
- Show your reasoning. State what you're doing and why before doing it.
- If something fails, diagnose WHY before trying again. Never retry blindly.
- If blocked, document what you tried, what failed, and what you'd try next.

## Before Submitting
- Re-read the original task. Does your output actually answer what was asked?
- Verify every claim. If you stated a fact, confirm it. If you wrote code, confirm it runs.
- Check for completeness. Did you miss any part of the request?
- NEVER claim success without evidence. "It should work" is not evidence.
```

**Step 2: Commit**

```bash
git add assets/methodologies/base.md
git commit -m "feat: add base methodology for all GodMode agents"
```

---

### Task 2: Create `assets/methodologies/coding.md`

Structured workflow for coding tasks — distilled from systematic-debugging, TDD, and verification-before-completion.

**Files:**
- Create: `assets/methodologies/coding.md`

**Step 1: Write the file**

```markdown
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
```

**Step 2: Commit**

```bash
git add assets/methodologies/coding.md
git commit -m "feat: add coding methodology — investigate, plan, TDD, verify"
```

---

### Task 3: Create `assets/methodologies/research.md`

Structured investigation workflow — distilled from gstack-investigate.

**Files:**
- Create: `assets/methodologies/research.md`

**Step 1: Write the file**

```markdown
# Research Methodology

## Phase 1: Scope
- Restate the research question in your own words.
- Identify what KIND of answer is needed: facts, comparison, recommendation, or exploration.
- Define what "done" looks like — what would a complete answer include?

## Phase 2: Gather
- Search broadly first, then drill into specifics.
- Use at least 3 independent sources for any factual claim.
- Cross-reference claims — if only one source says it, flag it as unverified.
- Capture source URLs as you go. Never backfill sources after writing.

## Phase 3: Analyze
- Distinguish between: verified facts, expert opinions, and your own inferences.
- Look for contradictions between sources — address them, don't hide them.
- Identify gaps: what couldn't you find? What remains uncertain?

## Phase 4: Present
- Lead with executive summary (3-5 sentences, key finding first).
- Structure: Summary → Key Findings → Analysis → Recommendations → Sources.
- Every factual claim must have a source citation.
- End with "Sources" section listing all URLs referenced.

## Anti-Patterns
- Never present unsourced claims as facts.
- Never bury the key finding in the middle of the report.
- Never pad with filler — concise is better than comprehensive.
- If you can't find reliable information, say so. "No reliable data found" is a valid finding.
```

**Step 2: Commit**

```bash
git add assets/methodologies/research.md
git commit -m "feat: add research methodology — scope, gather, analyze, present"
```

---

### Task 4: Create `assets/methodologies/planning.md`

For idea exploration and analysis tasks — distilled from brainstorming and plan-review.

**Files:**
- Create: `assets/methodologies/planning.md`

**Step 1: Write the file**

```markdown
# Planning Methodology

## Phase 1: Understand
- Restate the problem or idea in your own words.
- Identify constraints: time, technical, resource, scope.
- Search existing context — has this been explored before? Are there prior decisions?

## Phase 2: Explore Approaches
- Generate 2-3 distinct approaches with different tradeoffs.
- For each approach: describe it in 2-3 sentences, list pros, list cons.
- Lead with your recommended approach and explain why.
- Consider: what's the simplest version that delivers value?

## Phase 3: Design
- Detail the recommended approach.
- Identify: components, data flow, dependencies, risks.
- Call out what you're NOT including and why (YAGNI).
- Estimate scope: small (hours), medium (day), large (multi-day).

## Phase 4: Review
- Stress-test your own design: what breaks under load? What's the failure mode?
- Identify the riskiest assumption and how to validate it.
- List open questions that need human input.

## Anti-Patterns
- Never jump to a solution without exploring alternatives.
- Never design for hypothetical future requirements.
- Never hide complexity — if it's hard, say so.
- Never present one option as if it's the only way.
```

**Step 2: Commit**

```bash
git add assets/methodologies/planning.md
git commit -m "feat: add planning methodology — understand, explore, design, review"
```

---

### Task 5: Create `assets/methodologies/review.md`

For review tasks — distilled from gstack-review.

**Files:**
- Create: `assets/methodologies/review.md`

**Step 1: Write the file**

```markdown
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
```

**Step 2: Commit**

```bash
git add assets/methodologies/review.md
git commit -m "feat: add review methodology — context, critical, quality, deliver"
```

---

### Task 6: Create `assets/methodologies/creative.md`

For creative/content tasks — audience-first, self-review, polish.

**Files:**
- Create: `assets/methodologies/creative.md`

**Step 1: Write the file**

```markdown
# Creative Methodology

## Phase 1: Understand the Audience
- Who will read/use this output? What do they care about?
- What's the desired tone? Match the owner's voice (check SOUL.md).
- What format is expected? Blog post, email, script, social post, etc.

## Phase 2: Draft
- Start with the hook — the first sentence should earn the second.
- Write the full draft without self-editing. Get ideas down first.
- If variations were requested, produce 2-3 distinct options, not minor rewrites.

## Phase 3: Self-Review
- Read it aloud mentally. Does it flow? Is it clear?
- Cut ruthlessly: remove filler words, redundant phrases, weak openings.
- Check: does this actually accomplish what was asked?
- Verify any factual claims (dates, stats, names).

## Phase 4: Polish
- Ensure consistent tone throughout.
- Check formatting: headers, line breaks, emphasis.
- End with a clear call-to-action or next step if appropriate.

## Anti-Patterns
- Never use generic filler ("In today's fast-paced world...").
- Never produce one option when variations were requested.
- Never ignore the owner's voice/tone preferences.
- Never submit a first draft — always self-review.
```

**Step 2: Commit**

```bash
git add assets/methodologies/creative.md
git commit -m "feat: add creative methodology — audience, draft, self-review, polish"
```

---

### Task 7: Add methodology mapping and loader to `queue-processor.ts`

Wire the methodology files into the prompt builder.

**Files:**
- Modify: `src/services/queue-processor.ts:39-65` (after PROMPT_TEMPLATES)
- Modify: `src/services/queue-processor.ts:1460-1463` (after persona injection in buildPromptForItem)

**Step 1: Add the methodology mapping constant after PROMPT_TEMPLATES (after line 65)**

Add this code right after the closing `};` of `PROMPT_TEMPLATES`:

```typescript
// ── Methodology Mapping ──────────────────────────────────────────
// Maps queue item types to methodology files in assets/methodologies/
const METHODOLOGY_MAP: Record<QueueItemType, string> = {
  coding: "coding.md",
  research: "research.md",
  analysis: "research.md",    // analysis uses research methodology
  creative: "creative.md",
  review: "review.md",
  ops: "base.md",             // ops gets base methodology only
  task: "base.md",            // generic tasks get base methodology
  url: "research.md",         // URL analysis uses research methodology
  idea: "planning.md",        // idea exploration uses planning methodology
  optimize: "review.md",      // optimization uses review methodology
};
```

**Step 2: Add the loader function right after the mapping**

```typescript
/** Load methodology markdown from assets/methodologies/ */
async function loadMethodology(itemType: QueueItemType): Promise<string> {
  const fileName = METHODOLOGY_MAP[itemType] ?? "base.md";
  try {
    const { fileURLToPath } = await import("node:url");
    const thisFile = fileURLToPath(import.meta.url);
    const assetsDir = path.resolve(path.dirname(thisFile), "..", "..", "assets", "methodologies");
    const base = await fs.readFile(path.join(assetsDir, "base.md"), "utf-8");
    if (fileName === "base.md") return base;
    const specific = await fs.readFile(path.join(assetsDir, fileName), "utf-8");
    return base + "\n\n" + specific;
  } catch {
    return ""; // methodology files missing — non-fatal
  }
}
```

**Step 3: Inject methodology into buildPromptForItem() — after the persona section (after line 1463)**

Find the block that says:

```typescript
    // Inject roster persona instructions if available
    if (persona) {
      sections.push("", "## Your Role", "", persona.body);
    }
```

Add immediately after it:

```typescript
    // Inject methodology for this task type
    const methodology = await loadMethodology(item.type);
    if (methodology) {
      sections.push("", "## Methodology — FOLLOW THIS PROCESS", "", methodology);
    }
```

**Step 4: Build and typecheck**

```bash
pnpm build && pnpm typecheck
```

Expected: Both pass with zero errors.

**Step 5: Commit**

```bash
git add src/services/queue-processor.ts
git commit -m "feat: inject methodology into sub-agent prompts based on task type"
```

---

### Task 8: Upgrade PROMPT_TEMPLATES to reference methodology

The current templates are thin one-liners. Upgrade them to work WITH the methodology instead of duplicating/contradicting it.

**Files:**
- Modify: `src/services/queue-processor.ts:44-65` (PROMPT_TEMPLATES)

**Step 1: Replace the PROMPT_TEMPLATES object**

Replace lines 44-65 with:

```typescript
const PROMPT_TEMPLATES: Record<QueueItemType, string> = {
  coding:
    "## Task\nImplement this: {title}\n\n{description}\n\nFollow the Coding Methodology above. End with: ## Results — what changed, what was verified, what the user should know.",
  research:
    "## Task\nResearch this: {title}\n\n{description}\n\nFollow the Research Methodology above. End with: ## Sources — all URLs referenced.",
  analysis:
    "## Task\nAnalyze this: {title}\n\n{description}\n\nFollow the Research Methodology above. Focus on: Data Summary, Key Insights, Comparisons, Actionable Conclusions.",
  creative:
    "## Task\nCreate this content: {title}\n\n{description}\n\nFollow the Creative Methodology above. Include variations if appropriate.",
  review:
    "## Task\nReview this: {title}\n\n{description}\n\nFollow the Review Methodology above. Lead with verdict, then issues by severity.",
  ops:
    "## Task\nHandle this operational task: {title}\n\n{description}\n\nFollow the base methodology. Document what was done and any follow-ups needed.",
  task:
    "## Task\nComplete this: {title}\n\n{description}\n\nFollow the base methodology. Show your work. Include confidence levels for each finding.",
  url:
    "## Task\nAnalyze this URL: {url}\n\n{title}\n\n{description}\n\nFollow the Research Methodology above. Write: Source, Key Points, Relevance, Action Items.",
  idea:
    "## Task\nExplore this idea: {title}\n\n{description}\n\nFollow the Planning Methodology above. Explore 2-3 approaches before recommending one.",
  optimize:
    "## Task\nOptimize this skill/persona: {title}\n\n{description}\n\nFollow the AutoResearch protocol:\n1. Read the current skill/persona markdown file\n2. Generate 3-6 yes/no eval criteria from the stored trust feedback\n3. Run baseline evaluation against the criteria\n4. Make ONE targeted mutation to the markdown (clarity, examples, constraints)\n5. Test the mutation against eval criteria\n6. If improved, keep. If worse or equal, revert.\n7. Repeat up to 4 rounds.\n\nNEVER modify: name, role, core traits, communication style.\nONLY modify: instructions, examples, constraints, workflow steps.\n\nWrite results as: ## Optimization Results\n- Baseline score: X%\n- Final score: Y%\n- Rounds: N\n- Changes made: (list each kept mutation)\n- Evaluation log: (per-round scores)",
};
```

**Step 2: Build and typecheck**

```bash
pnpm build && pnpm typecheck
```

**Step 3: Commit**

```bash
git add src/services/queue-processor.ts
git commit -m "feat: upgrade PROMPT_TEMPLATES to reference methodology phases"
```

---

Plan complete and saved to `docs/plans/2026-03-24-agent-methodology-injection.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?