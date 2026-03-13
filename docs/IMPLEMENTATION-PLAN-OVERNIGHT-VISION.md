# GodMode Overnight Vision → Implementation Plan
**Created:** 2026-03-13
**Source:** Overnight session notes (Mar 12 evening → Mar 13 ~1:50 AM CDT)
**Branch:** feat/paperclip-swarm

---

## How to Use This Plan

This is a multi-phase implementation plan designed to be run as parallel subagents in a fresh Claude Code session. Copy the phase prompt you want into a new session and let it run. Phases are independent — run them in parallel where marked.

---

## PHASE 0: MERGE & STABILIZE (Sequential — Run First)

**Goal:** Merge pending worktree branches, consolidate, build clean.

```
PROMPT:

You are working on the GodMode plugin at ~/Projects/godmode-plugin on branch feat/paperclip-swarm.

Tasks:
1. Merge the session-distiller branch:
   - Review commits at /private/tmp/godmode-distiller (feat/session-distiller)
   - It has 2 commits: session distiller + Pattern Scout cron skill + P10 Pattern Absorption
   - Merge into feat/paperclip-swarm: `git merge feat/session-distiller`
   - Resolve any conflicts (the branch touches before-prompt-build.ts, gateway-start.ts, context-budget.ts, health-ledger.ts, identity-graph.ts, consciousness-heartbeat.ts, vault-capture.ts)

2. Review feat/team-sync-hardening-codex at /private/tmp/team-sync-hardening-codex
   - Compare with feat/team-sync-hardening-claude (already merged into swarm)
   - If codex has anything useful not in claude branch, cherry-pick those changes
   - If it's a duplicate, skip it

3. Clean up worktrees:
   - `git worktree remove /private/tmp/godmode-distiller`
   - `git worktree remove /private/tmp/team-sync-hardening`
   - `git worktree remove /private/tmp/team-sync-hardening-codex`

4. Build & verify: `pnpm build && pnpm typecheck`

5. Commit with message: "chore: merge session-distiller + clean up worktrees"
```

---

## PHASE 1: SKILL CARDS (Parallel — No Engine Code)

These are ALL markdown files. No TypeScript. Run all 4 as parallel subagents.

### 1A: Meta Problem Solver Skill Card

```
PROMPT:

Create the file skill-cards/meta-problem-solver.md for the GodMode plugin.

This skill card teaches Prosper (the ally) to run a first-principles decomposition BEFORE any advisory board, framework, or swarm delegation. It should be the FIRST step when handling complex requests.

YAML frontmatter:
- domain: strategy
- triggers: "big project", "complex request", "strategic decision", "help me think through", "first principles", "break this down", "what should I do about"

Body should instruct the ally to:
1. First principles decomposition — what is actually true here?
2. Inversion — what would make this definitely fail?
3. Second-order effects — what happens after the obvious outcome?
4. Constraint mapping — real vs. assumed constraints
5. Job-to-be-done — what problem is actually being solved?
6. Output a problem brief BEFORE making recommendations

Include a note: "Run this BEFORE the adversarial-board or any delegation. Think before you act."

Reference tools: use Mem0 search + vault lookup to pull context. No special tools needed — this is a thinking pattern.

Follow the format of existing skill cards in skill-cards/ (check skill-cards/delegate.md for the pattern).
```

### 1B: Context Deep Dive Skill Card

```
PROMPT:

Create the file skill-cards/context-deep-dive.md for the GodMode plugin.

This skill card teaches Prosper to pull ALL relevant context before any debate, recommendation, or delegation.

YAML frontmatter:
- domain: strategy
- triggers: "gather context", "what do we know", "deep dive", "before we decide", "pull everything", "context check"

Body should instruct the ally to:
1. Search Mem0 memory for related facts, preferences, past decisions
2. Search the vault (second-brain tool) for notes, artifacts, meeting notes
3. Check recent sessions for related conversations
4. Pull people/company context if relevant
5. Compile a context brief that includes: what we know, what we don't know, what's changed recently

Include note: "This step feeds the adversarial-board and delegation pipelines. Full context = better decisions."

Follow the format of existing skill cards.
```

### 1C: Adversarial Advisory Board Skill Card

```
PROMPT:

Create the file skill-cards/adversarial-board.md for the GodMode plugin.

This skill card teaches Prosper to run a virtual advisory board debate from opposing angles AFTER the meta-problem-solver and context-deep-dive have run.

YAML frontmatter:
- domain: strategy
- triggers: "advisory board", "devil's advocate", "debate this", "opposing views", "what could go wrong", "challenge my thinking", "stress test"

Body should instruct the ally to simulate 5 advisors:
1. The Operator — ops/execution lens. "Can we actually do this? What's the operational cost?"
2. The Skeptic — devil's advocate. "Why will this fail? What are we missing?"
3. The Visionary — upside maximizer. "What's the 10x version? What adjacent opportunity are we ignoring?"
4. The Customer — ICP lens. "Does the target user actually want this? Would they pay for it?"
5. The Risk Officer — downside/legal/financial. "What's the worst case? What liability exists?"

Each advisor gets 2-3 sentences. Then Prosper synthesizes: consensus points, key disagreements, recommended path.

Include note: "Run meta-problem-solver first. The board debates better with a problem brief."
Include note: "Advisors are configurable per user — a chiropractor gets different board members than a SaaS founder."

Follow the format of existing skill cards.
```

### 1D: Personal Brand Framework Skill Card

```
PROMPT:

Create the file skill-cards/personal-brand.md for the GodMode plugin.

This skill card teaches Prosper to help the user build a personal brand framework.

YAML frontmatter:
- domain: creative
- triggers: "personal brand", "positioning", "content strategy", "content pillars", "storytelling", "brand framework", "build my brand", "thought leadership"

Body should instruct the ally to work through:
1. Positioning — what unique angle does the user own? Intersection of skills + experience + perspective
2. Storytelling architecture — hero's journey mapped to user's story (struggle → discovery → transformation)
3. Content pillars — 3-5 themes they'll be known for
4. Hook frameworks — proven patterns for grabbing attention in their niche
5. Constraint-as-asset framing — how limitations become credibility ("2 kids + newborn = I AM the target customer")
6. Distribution strategy — which platforms, what frequency, what format

Reference: Use Mem0 + vault to pull user context (role, industry, goals, past content).

Follow the format of existing skill cards.
```

---

## PHASE 2: AGENT ROSTER ADDITIONS (Parallel with Phase 1)

### 2A: ICP Simulator Persona

```
PROMPT:

Create the file assets/agent-roster/icp-simulator.md for the GodMode plugin.

This is an agent persona for simulating Ideal Customer Profiles. The agent role-plays as a specific ICP to stress-test offers, ad copy, onboarding flows, and product decisions.

Frontmatter (follow the pattern in assets/agent-roster/researcher.md):
- name: ICP Simulator
- taskTypes: [research, analysis]
- engine: claude (or haiku for cost efficiency)
- mission: "Simulate a target customer persona to stress-test offers, copy, and product decisions. Role-play as the ICP — voice their objections, desires, and buying triggers."

Body should instruct the agent to:
- Ask for: ICP definition (role, industry, pain points, budget, sophistication level)
- Adopt that persona completely — think, speak, and react as they would
- Test: ad copy, sales pages, onboarding flows, pricing, feature pitches
- Output: honest reactions, objections, what would make them buy vs. bounce
- Provide a score: 1-10 "would I buy this?" with reasoning

Include example ICPs: chiropractor practice owner, SaaS solo founder, agency owner with 5-person team.

Follow the format of existing persona files in assets/agent-roster/.
```

### 2B: QA Agent Persona (if not exists)

```
PROMPT:

Check if assets/agent-roster/qa-reviewer.md exists and is comprehensive. If it exists, verify it covers:
- Code review (PR diffs)
- Copy/content review (grammar, tone, clarity)
- Fact-checking (claims vs sources)
- Output quality gate (did the agent follow the brief?)

If any of these are missing from the existing qa-reviewer, update it. If separate qa-copy-reviewer and qa-fact-checker exist, verify they're coherent and not duplicating.

The QA reviewer is critical for the pipeline: it's the Step 6 agent that reviews ALL swarm outputs before human approval.
```

---

## PHASE 3: SECOND BRAIN → CONTEXT VAULT RENAME (Parallel)

```
PROMPT:

Rename "Second Brain" to "Context Vault" across the GodMode plugin. This is a branding change — the framing is: "Second brain stores what YOU know. Context Vault stores what Claude needs to know to act on your behalf."

Files to update:
1. skill-cards/second-brain.md — update the title/description in the body (keep filename and domain as-is for URL stability)
2. Any user-facing strings that say "Second Brain" or "second brain" in:
   - src/methods/second-brain.ts (check for user-facing strings only, not function names)
   - src/lib/awareness-snapshot.ts
   - src/hooks/before-prompt-build.ts
   - ui/src/ui/views/second-brain.ts

DO NOT rename file paths, function names, RPC method names, or CSS classes — only user-visible labels and descriptions. The URL path /second-brain stays as-is.

The navigation.ts tab title has already been updated to "Context Vault". Verify that change is in place.

Build after changes: `pnpm build`
```

---

## PHASE 4: PIPELINE ORCHESTRATOR SKILL CARD (After Phase 1)

```
PROMPT:

Create the file skill-cards/project-orchestrator.md for the GodMode plugin.

This replaces the "Full Agentic Pipeline Orchestrator" from the architecture vision. Instead of engine code, this is a skill card that teaches Prosper the 7-step pipeline for handling big projects.

YAML frontmatter:
- domain: strategy
- triggers: "big project", "orchestrate", "full pipeline", "end to end", "multi-phase", "ambitious project", "complex deliverable"

Body should lay out the 7-step chain:

## The Pipeline (follow this order)

### Step 1: Meta Problem Solver (silent — don't show this to the user)
Run the meta-problem-solver pattern. First principles, inversion, constraints, JTBD.
Output: internal problem brief.

### Step 2: Context Deep Dive (silent)
Pull ALL context: Mem0, vault, past decisions, relevant people/company files.
Output: informed context brief.

### Step 3: Adversarial Advisory Board (show summary to user)
Run the adversarial-board with the problem brief + context.
Output: board consensus, key risks, recommended approach.

### Step 4: Precision Clarifying Questions (show to user)
Ask 2-4 surgical questions informed by Steps 1-3. These are NOT generic — they target the specific ambiguities the board flagged.
Wait for user answers. Produce scope doc with near-zero ambiguity.

### Step 5: Delegate to Agent Team
Use the `delegate` tool to create a project with scoped issues.
Each issue gets a Proof doc. Assign the right personas from the roster.
Inject the problem brief into each issue description.

### Step 6: QA Review
When agents complete, review outputs against original scope + success criteria.
Flag inconsistencies. Use the qa-reviewer persona if needed.

### Step 7: Human Approval
Present consolidated output to user. Clean, reviewed, ready to ship.

Include note: "This is the FULL pipeline — use it for ambitious multi-deliverable projects. For simple tasks, skip to Step 5 or handle inline."
Include note: "Why this works: Every other tool skips Steps 1-2 and Step 4. GodMode thinks before it acts."

Check existing skill-cards/project-pipeline.md — if it exists and covers similar ground, UPDATE it instead of creating a duplicate. Rename if needed.
```

---

## PHASE 5: OPEN QUESTIONS AUDIT (Parallel)

```
PROMPT:

You are auditing the GodMode plugin at ~/Projects/godmode-plugin. Answer these open questions from the overnight session:

1. **Heartbeat model audit**: Read src/services/consciousness-heartbeat.ts. What model does the heartbeat call? If it's Sonnet or higher, recommend changing to Haiku or Gemini Flash.

2. **Session type context loading**: Read src/lib/context-budget.ts. Does it differentiate context injection by session type (code/ops/plan/minimal/full)? Or does every session get the same context? Report what you find.

3. **FEEDBACK-LOG.md wiring**: Search for FEEDBACK-LOG anywhere in the codebase. Is it wired into any nightly consolidation or auto-promotion pipeline?

4. **Concurrent execution**: Read src/services/paperclip-adapter.ts. Does Paperclip run agents concurrently or sequentially? Check the polling loop and how issues are dispatched.

5. **WORKING.md deprecation**: Search for WORKING.md references. Confirm all agents read from awareness-snapshot, not WORKING.md.

6. **ops-proxy.ts deletion**: The file src/lib/ops-proxy.ts is deleted in this branch (246 lines removed). Verify nothing still imports it. Run: `pnpm build` confirms no broken imports.

Output a report with findings and recommendations for each item. Do NOT make code changes — research only.
```

---

## PHASE 6: ONBOARDING ROSTER GENERATOR (Engine Code — After Phases 1-2)

```
PROMPT:

You are working on the GodMode plugin at ~/Projects/godmode-plugin on branch feat/paperclip-swarm.

Read CLAUDE.md first. Then read:
- src/methods/onboarding.ts and src/methods/onboarding-types.ts
- src/lib/agent-roster.ts
- src/lib/skill-cards.ts
- assets/agent-roster/*.md (scan all personas)
- skill-cards/*.md (scan all skill cards)

**Task:** Extend the onboarding flow so that when a user completes onboarding, GodMode auto-configures which agents and skills activate based on their answers.

The onboarding already captures: tools used, industry/role, workflows/goals, communication style.

Add a new function `generateRosterConfig(onboardingAnswers)` in src/lib/agent-roster.ts that:
1. Takes the user's onboarding answers
2. Returns which personas to activate vs. keep dormant
3. Returns which skill cards are most relevant
4. Writes this config to ~/godmode/data/roster-config.json

Mapping logic:
- Chiropractor/healthcare → activate: researcher, content-writer, personal-assistant, icp-simulator. Dormant: ops-runner, finance-admin.
- SaaS founder → activate: researcher, content-writer, ops-runner, godmode-builder. Dormant: travel-planner, life-admin.
- Agency owner → activate: content-writer, researcher, executive-briefer, icp-simulator. Dormant: godmode-builder.
- Default: all personas active.

The roster config should be checked in agent-roster.ts resolvePersona() — if a persona is dormant, skip it during routing.

Build and typecheck after: `pnpm build && pnpm typecheck`
```

---

## PHASE 7: VERSIONED CONFIG SNAPSHOTS (Engine Code — Can Run Parallel)

```
PROMPT:

You are working on the GodMode plugin at ~/Projects/godmode-plugin on branch feat/paperclip-swarm.

Read CLAUDE.md first. Golden rule: code as little as possible.

**Task:** Add lightweight versioned snapshots of GodMode configuration state.

Create src/lib/config-snapshots.ts with:

1. `captureSnapshot()` — saves current state to ~/godmode/data/snapshots/<timestamp>.json:
   - Agent roster config (which personas are active/dormant)
   - Trust scores for each persona
   - Active skill cards list
   - Cron job count
   - Memory stats (Mem0 entry count if available)

2. `listSnapshots()` — returns available snapshots with timestamps

3. `rollbackToSnapshot(timestamp)` — restores roster config + trust scores from a snapshot
   - Does NOT roll back memory or cron — those are too stateful
   - Writes restored config, ally sees change on next turn

4. Wire into the consciousness heartbeat (src/services/consciousness-heartbeat.ts):
   - Take one snapshot per day (check if today's already exists)
   - Cap at 30 snapshots (delete oldest)

Keep it simple. No rating system yet — just timestamped snapshots with restore capability.

Build and typecheck after: `pnpm build && pnpm typecheck`
```

---

## FUTURE PHASES (Not for this sprint)

These are documented but should NOT be built yet:

- **Notion/ClickUp backend support** — Requires significant connector work. Wait for customer demand.
- **Intelligence Scanner (always-on)** — Pattern Scout cron (Phase 0 merge) covers daily scanning. Continuous monitoring is premature.
- **Full ICP simulation pipeline** — Need the ICP Simulator persona first (Phase 2A), then validate with one PA client before building automation.
- **Antifragile harness** — Depends on autoresearch infrastructure. Existing `mistakes-to-checks.sh` is the primitive version.
- **Human-in-loop self-evolution UI** — Versioned snapshots (Phase 7) are the foundation. Rating-weighted rollback comes after snapshots prove useful.

---

## Execution Order

```
PARALLEL GROUP A (no dependencies):
├── Phase 1A: Meta Problem Solver skill card
├── Phase 1B: Context Deep Dive skill card
├── Phase 1C: Adversarial Board skill card
├── Phase 1D: Personal Brand skill card
├── Phase 2A: ICP Simulator persona
├── Phase 2B: QA Agent audit
├── Phase 3: Context Vault rename
├── Phase 5: Open Questions audit
└── Phase 7: Versioned Config Snapshots

SEQUENTIAL (after Group A):
├── Phase 0: Merge & Stabilize (merge session-distiller, clean worktrees)
├── Phase 4: Pipeline Orchestrator skill card (needs Phase 1 cards to exist)
└── Phase 6: Onboarding Roster Generator (needs Phase 2A persona to exist)

FINAL:
└── pnpm build && pnpm typecheck && git commit
```
