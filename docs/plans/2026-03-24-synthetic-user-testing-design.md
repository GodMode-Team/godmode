# Synthetic User Testing Loop — Design Document

**Date:** 2026-03-24
**Branch:** `feat/synthetic-user-testing`
**Goal:** Build the definitive QA + feedback loop for GodMode — 7 realistic synthetic users powered by LLM + Stagehand browser automation, testing every surface of the Personal AI OS, generating bug reports AND product feedback, then running mutation loops to fix and optimize.

**North Star:** GodMode is the world's best Personal AI OS for Entrepreneurs — sovereign (user controls what's local vs cloud), self-hosted, modular, integrates the best tools, shortcuts the pain of AI, and delivers a godmode/flowstate experience. Every eval in this system measures against that north star.

---

## ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                     OVERNIGHT RUNNER                          │
│                 (overnight-browser.sh)                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  PHASE 1: DISCOVERY (20 loops × ~62 min = ~21 hrs)            │
│                                                                │
│  Per loop — 3 parallel groups:                                 │
│                                                                │
│  GROUP A (parallel, ~15 min)     GROUP B (parallel, ~15 min)  │
│  ┌────────┐┌────────┐┌────────┐  ┌────────┐┌────────┐        │
│  │ Marcus ││Dr.Mike ││Frankie │  │ Diana  ││ Sarah  │        │
│  │🖥️ Chat ││🖥️ Onbd ││🖥️ Zero │  │🖥️ Team ││🖥️ Multi│        │
│  └───┬────┘└───┬────┘└───┬────┘  └───┬────┘└───┬────┘        │
│      │         │         │           │         │               │
│      └─────────┴─────────┘           └─────────┘               │
│                │                          │                     │
│                ▼                          ▼                     │
│         GROUP C (sequential, ~25 min)                          │
│         ┌────────┐ → ┌────────┐                                │
│         │  Raj   │   │  Alex  │                                │
│         │🖥️ Build│   │🖥️ Power│                                │
│         └───┬────┘   └───┬────┘                                │
│             └────────────┘                                     │
│                    │                                           │
│                    ▼                                           │
│  ┌─────────────────────────────────────────┐                   │
│  │     LLM JUDGE (Sonnet 4.6)              │                   │
│  │  7 North Star Dimensions (0-10 each)    │                   │
│  │  Rate-limited: max 3 concurrent calls   │                   │
│  └─────────────────┬───────────────────────┘                   │
│                    ▼                                           │
│  ┌─────────────────────────────────────────┐                   │
│  │        RESULTS COLLECTOR                 │                   │
│  │  bugs.jsonl + feedback.jsonl + scores    │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                │
│  PHASE 2: OPTIMIZATION (20 loops × ~35 min = ~12 hrs)          │
│  ┌─────────────────────────────────────────┐                   │
│  │   Prioritize → Fix → Re-test affected   │                   │
│  │   archetypes only → Score → Keep/Revert │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                │
│  TOTAL: ~33 hrs (fits in one long weekend run)                 │
│  OUTPUT: Consolidated report + scored fixes + screenshot gallery│
└──────────────────────────────────────────────────────────────┘
```

---

## THE 7 NORTH STAR EVAL DIMENSIONS

Every interaction scored by Sonnet 4.6. Combined score = weighted average on 0-10 scale.

### 1. Flow State (20% weight)
*How fast does the user go from intent to outcome?*

Measures:
- Clicks/steps to complete a goal (fewer = better)
- Time from page load to first meaningful action
- Friction points (confused pauses, wrong clicks, dead ends)
- Zero-click moments (AI anticipates correctly)
- Interruptions (unexpected modals, errors breaking flow)

Judge prompt: "Score 0-10: Did this user achieve their goal with minimal friction? Did the interface feel like it disappeared? Did the AI anticipate what the user needed?"

### 2. Memory Continuity (20% weight)
*Does the AI remember, connect dots, and feel like an ally?*

Measures:
- Does the AI recall context from prior messages in the session?
- Does memory search return relevant results for known facts?
- Does the ally connect information across different domains unprompted?
- Does the experience feel like "talking to someone who knows you"?
- Does memory degrade gracefully when services are down?

Judge prompt: "Score 0-10: Did the AI demonstrate awareness of the user's context, history, and preferences? Did it connect dots the user didn't explicitly make? Would this feel like an ally or a stranger?"

### 3. Control (15% weight)
*Does the user feel in charge of their AI OS?*

Measures:
- Can the user configure what's local vs cloud?
- Can they customize tabs, dashboards, workspaces?
- Can they control trust levels and autonomy?
- Are permissions and data flows transparent?
- Can they override AI decisions easily?
- Can they connect their preferred tools (Composio, direct API, OpenClaw secure storage)?

Judge prompt: "Score 0-10: Does this user feel like they OWN their AI OS? Can they bend it to their workflow? Is configuration discoverable and intuitive? Would a control-conscious entrepreneur feel comfortable?"

### 4. Integration Depth (15% weight)
*Do connected tools work seamlessly?*

Measures:
- Do workspace connections (Composio, direct API) resolve without manual steps?
- Does Git sync for shared workspaces work?
- Do Paperclip swarm orchestrations complete successfully?
- Can the user add custom tabs backed by real data sources?
- Do cross-tool workflows (meeting → notes → tasks → follow-up) flow without breaks?

Judge prompt: "Score 0-10: Do the user's tools feel unified through GodMode? Does data flow between systems without manual bridging? Would this replace their current duct-tape stack?"

### 5. Trust Progression (10% weight)
*Does autonomy increase naturally with use?*

Measures:
- Do trust levels gate agent autonomy correctly?
- Does the system earn trust through demonstrated competence?
- Can the user adjust trust levels explicitly?
- Does the inbox review flow work (score → feedback → persona improvement)?
- Would the user want to delegate MORE over time?

Judge prompt: "Score 0-10: Does the trust system make the user feel safe delegating more? Is autonomy earned, not assumed? Would an entrepreneur who's been burned by AI before feel comfortable increasing delegation?"

### 6. Resilience (10% weight)
*Does the system recover gracefully from problems?*

Measures:
- Error recovery (after an error, does the next action work?)
- Graceful degradation (missing API keys → reduced functionality, not crash)
- Self-heal activation (does it detect and repair broken subsystems?)
- Error message quality (actionable, not stack traces)
- Data integrity (no corruption from unexpected states)

Judge prompt: "Score 0-10: When something went wrong, did the system handle it gracefully? Did the user understand what happened and what to do? Would a non-technical user feel supported or abandoned?"

### 7. Comprehension (10% weight)
*Does the user understand what the AI is doing and why?*

Measures:
- Is the UI legible and self-explanatory?
- Are notifications useful, not noisy?
- Can the user understand the AI's reasoning?
- Are empty states helpful (not blank)?
- Does onboarding teach without overwhelming?
- Are loading states, progress indicators, and confirmations present?

Judge prompt: "Score 0-10: Does the user always know what's happening, what they can do, and what the AI is doing on their behalf? Is the experience transparent without being verbose?"

### Bug Severity Classification (Separate from Scores)

- **P0 (Critical):** Crash, data loss, security vulnerability, complete feature failure
- **P1 (High):** Feature doesn't work as intended, blocks a core workflow
- **P2 (Medium):** UX friction, confusing state, unclear error, slow response
- **P3 (Low):** Cosmetic, minor layout issue, typo, tooltip missing

---

## THE 7 SYNTHETIC USER ARCHETYPES

Each archetype has: a personality prompt (for the LLM driving Stagehand), assigned test surfaces, a trust level, and specific goals. Personality prompts draw from real Fathom call recordings and ICP research data.

### Archetype 1: Marcus — The Overwhelmed Operator

**Based on:** ICP "Overwhelmed Operator" archetype + real pain point data
**Profile:** Solo e-commerce founder, $2M/year, 34 years old. 3 contractors. Uses ChatGPT 15-20x/day. Has a 4-page "AI Context Dump" Google Doc he pastes into every new conversation. Spends 45 min/day re-explaining who he is to AI tools.
**Trust level:** New → Developing (starts skeptical, wants to be won over)
**Technical skill:** Moderate (can use SaaS tools, not a developer)
**Personality traits:** Impatient with setup, wants immediate value, skeptical of "another AI tool," emotionally triggered by amnesia/context loss

**Assigned surfaces (primary):**
- Onboarding (fresh install flow)
- Chat (daily driver — content requests, brainstorming, email drafts)
- Memory (does it remember his business? his tone? his constraints?)
- Today tab (daily brief, schedule, tasks)
- Second Brain (searching for past decisions)

**Deep flow scripts:**
1. Fresh install → onboarding → first chat → "does it know my business?" test
2. Multi-session continuity: chat about product launch → close → reopen → reference previous conversation
3. Content workflow: "Write me a product description for X" → refine → "remember my brand voice"
4. Daily routine: check Today → review tasks → chat about priorities → delegate one item
5. Knowledge retrieval: "What did I decide about pricing last week?" → verify memory recall

**Emotional triggers to test:**
- AI forgets something he told it → frustration response
- AI references something from earlier unprompted → delight response
- Setup takes more than 5 minutes → abandonment risk

---

### Archetype 2: Diana — The Scaling CEO

**Based on:** ICP "Scaling CEO" archetype
**Profile:** CEO of services company, $5M/year targeting $10M, 41 years old. Team of 12. Uses Claude Pro + ChatGPT Plus + Perplexity Pro ($60+/mo in AI subs). Has EA ($4.2K/mo) who handles calendar/inbox but can't do strategic work.
**Trust level:** Established (comfortable delegating, expects quality)
**Technical skill:** Low-moderate (executive, not hands-on)
**Personality traits:** Time-pressed, delegates aggressively, expects things to "just work," values synthesis over raw data

**Assigned surfaces (primary):**
- Team workspaces (creating, sharing, Git sync)
- Shared workspaces (provisioning team members, permissions)
- Dashboards (custom views for her business metrics)
- Queue delegation (overnight research, competitive analysis)
- Meeting prep → follow-up pipeline
- Integrations (calendar, email, CRM connections)

**Deep flow scripts:**
1. Create workspace for "Q2 Planning" → add team context → share with team
2. "Prep me for the board meeting Thursday" → verify it pulls from calendar + past sessions + tasks
3. Delegate overnight research: "Research top 5 competitors' pricing changes this quarter"
4. Dashboard creation: "Show me a dashboard of this week's key metrics"
5. Team workspace sync: modify shared workspace → verify Git sync → check from "teammate" perspective
6. Trust escalation: start with approval-required → demonstrate quality → test trust level increase

---

### Archetype 3: Raj — The Builder Bottleneck

**Based on:** ICP "Builder Bottleneck" archetype
**Profile:** Non-technical SaaS founder, $1.2M ARR, 29 years old. 2 devs on contract, no co-founder. Has 30+ ChatGPT conversations about different features. None connect.
**Trust level:** Developing → Established (wants to believe, needs proof)
**Technical skill:** Moderate-high (product-minded, can read code, doesn't write it daily)
**Personality traits:** Continuity-obsessed, wants connected thinking, builds systems, frustrated by fragmentation

**Assigned surfaces (primary):**
- Paperclip (multi-agent swarm orchestration for complex tasks)
- Second Brain (deep search, connecting dots across sessions)
- Work tab (sessions, artifacts, tasks management)
- Memory continuity (cross-session context)
- Custom tabs (building views for his product data)

**Deep flow scripts:**
1. Multi-session product strategy: discuss feature A → pricing → competitive positioning → "synthesize everything I've decided"
2. Paperclip swarm: "Research, compare, and recommend the best analytics tool for my SaaS" (multi-specialist task)
3. Second Brain deep dive: search for patterns across 6 months of decisions
4. Artifact management: create project brief → iterate → version → share
5. Custom tab: "Show me a view of all open product decisions with their status"

---

### Archetype 4: Dr. Mike — The Chiropractor

**Based on:** TRP chiropractor segmentation data (70K+ market)
**Profile:** Practice owner, $400K revenue, 47 years old. Staff of 4. Not technical. Wants marketing help, patient retention, practice management tips. Heard about GodMode from a colleague.
**Trust level:** Brand new (doesn't understand AI beyond ChatGPT basics)
**Technical skill:** Low (uses iPhone, basic computer skills, not comfortable with technical setup)
**Personality traits:** Skeptical of tech promises, wants concrete results, doesn't want to learn a new system, will bail if confused

**Assigned surfaces (primary):**
- Onboarding (non-technical path, every edge case)
- Chat (simple requests — "write a patient reactivation email," "what should I post on social media this week")
- Today tab (simple schedule view, task list)
- Error states (what happens when things break for a non-technical user)
- Mobile-friendly paths (responsive layouts)

**Deep flow scripts:**
1. Absolute zero-state: fresh install with minimal config → can he get value in under 10 minutes?
2. Simple content: "Write me a Facebook post about chiropractic care for desk workers"
3. Patient workflow: "Help me write a reactivation email for patients who haven't visited in 3 months"
4. Confused user: types vague/incomplete requests → does the AI guide him?
5. Error recovery: trigger common errors → are messages understandable to a non-technical user?
6. Mobile: run all flows at 375x812 viewport

---

### Archetype 5: Alex — The Power User

**Based on:** Developer/tinkerer pattern from research
**Profile:** Technical founder + developer, 31 years old. Runs a dev agency. Uses Claude Code, VS Code, has built MCP servers. Wants to push GodMode to its limits.
**Trust level:** Power user (maximum autonomy, wants full control)
**Technical skill:** Expert (reads source code, builds integrations, comfortable with config files)
**Personality traits:** Pushes boundaries, customizes everything, tests edge cases naturally, impatient with limitations

**Assigned surfaces (primary):**
- Custom tabs (creating, editing, data sources — MCP, RPC, REST, static)
- Composio integrations (connecting APIs, testing secure storage)
- OpenClaw API storage (alternative to Composio)
- Agent roster (customizing personas, creating new ones)
- Cron jobs (scheduling recurring automations)
- Trust levels (testing every trust tier, escalation, de-escalation)
- Config (every setting, every toggle)
- Debug tab (gateway internals, manual RPC calls)
- Guardrails (testing safety boundaries, custom rules)

**Deep flow scripts:**
1. Custom tab creation: "Create a dashboard showing my GitHub PR status" → JSON manifest → data source connection
2. Composio setup: connect 3+ APIs → verify data flows → test in chat
3. Agent roster customization: create a new persona → assign task types → test routing
4. Cron workflow: "Every morning at 8am, summarize my GitHub notifications" → verify execution
5. Trust boundary testing: set trust to maximum → delegate complex task → verify execution chain
6. Guardrail testing: set custom guardrails → try to trigger them → verify enforcement
7. Config stress test: change every setting → verify each takes effect → reset
8. Debug workflow: use debug tab to inspect RPC calls → manual method invocation

---

### Archetype 6: Sarah — The Agency Owner

**Based on:** Multi-client pattern from research + real Fathom relationship dynamics
**Profile:** Marketing agency owner, $1.5M/year, 36 years old. Team of 6. Manages 12 client accounts. Needs context switching between clients constantly.
**Trust level:** Established (needs reliability for client work)
**Technical skill:** Moderate (comfortable with SaaS tools, some automation experience)
**Personality traits:** Context-switches constantly, needs organization, values templates and repeatability, client-facing work must be polished

**Assigned surfaces (primary):**
- Multi-workspace (one per client, fast switching)
- Shared workspaces (team collaboration on client accounts)
- Content at scale (batch content generation across clients)
- Team provisioning (adding team members to specific workspaces)
- Queue (parallel overnight work across multiple clients)
- Skills (using and discovering skill cards for different client needs)

**Deep flow scripts:**
1. Multi-workspace setup: create 3 client workspaces → populate with context → switch between them rapidly
2. Team provisioning: add team member to workspace → verify access → test permissions
3. Batch content: "Write social posts for all 3 clients this week" → verify context isolation (client A's tone != client B's)
4. Workspace Git sync: modify workspace → push → verify teammate can pull
5. Parallel delegation: queue research tasks for 3 clients simultaneously → verify output routing
6. Skill discovery: "What skills are available for content marketing?" → use recommended skill

---

### Archetype 7: Frankie — The Fresh Install

**Based on:** Zero-state testing (not a persona per se — a testing scenario)
**Profile:** Could be anyone. The point is testing every possible first-time experience.
**Trust level:** Zero (nothing configured, no data, no memory)
**Technical skill:** Varies per loop (cycles through: expert, moderate, novice)
**Personality traits:** Varies per loop

**Assigned surfaces (primary):**
- Every onboarding path (quick setup, full setup, skip setup)
- Zero-state UI (what does every tab look like with no data?)
- First chat message (what happens?)
- First error (what happens when something breaks on first use?)
- License activation (valid key, invalid key, no key)
- API key configuration (with keys, without keys, wrong keys)

**Deep flow scripts:**
1. Happy path onboarding: follow every prompt perfectly → time to first value
2. Skip-everything onboarding: skip every optional step → what works?
3. Wrong-key onboarding: enter invalid API key → error message quality
4. No-key onboarding: no API keys at all → graceful degradation
5. Impatient user: click through everything as fast as possible without reading
6. Meticulous user: read every tooltip, try every option, configure everything before starting
7. Recovery: start onboarding → close browser → reopen → does it resume correctly?
8. Every tab zero-state: visit all 6 tabs + settings sub-tabs with zero data → verify helpful empty states

---

## SURFACE COVERAGE MATRIX

Each cell = a deep flow that gets tested. "P" = primary (run every loop), "S" = secondary (run every 3rd loop), "-" = not applicable.

| Surface | Marcus | Diana | Raj | Dr. Mike | Alex | Sarah | Frankie |
|---|---|---|---|---|---|---|---|
| **Onboarding** | P | S | S | P | S | S | P |
| **Chat (basic)** | P | P | P | P | S | P | P |
| **Chat (advanced — tools, streaming)** | S | P | P | - | P | P | S |
| **Today tab** | P | P | S | P | S | S | P |
| **Work tab (tasks)** | P | P | P | S | S | P | P |
| **Work tab (sessions)** | S | P | P | - | P | P | S |
| **Work tab (artifacts)** | S | S | P | - | P | S | S |
| **Second Brain (search)** | P | S | P | S | P | S | P |
| **Second Brain (vault health)** | S | - | S | - | P | - | S |
| **Dashboards (view)** | S | P | S | - | P | S | P |
| **Dashboards (create custom)** | - | P | P | - | P | S | - |
| **Settings (config)** | S | S | S | P | P | S | P |
| **Settings (integrations)** | S | P | S | S | P | P | S |
| **Settings (guardrails)** | - | S | - | - | P | S | - |
| **Settings (skills)** | S | S | S | - | P | P | S |
| **Settings (agents)** | - | S | S | - | P | S | - |
| **Settings (trust)** | S | P | S | - | P | S | - |
| **Custom tabs** | - | P | P | - | P | S | - |
| **Queue (add/approve)** | S | P | P | - | P | P | S |
| **Queue (review output)** | S | P | P | - | P | P | - |
| **Paperclip (swarm)** | - | S | P | - | P | S | - |
| **Workspaces (create)** | S | P | S | S | P | P | S |
| **Workspaces (shared/Git sync)** | - | P | S | - | P | P | - |
| **Team provisioning** | - | P | - | - | S | P | - |
| **Composio integrations** | - | P | S | - | P | P | - |
| **OpenClaw API storage** | - | S | - | - | P | S | - |
| **Cron jobs** | - | S | S | - | P | S | - |
| **Memory (persistence)** | P | P | P | S | P | P | P |
| **Memory (cross-session)** | P | P | P | S | S | P | - |
| **Meeting prep → follow-up** | S | P | S | - | - | P | - |
| **Debug tab** | - | - | - | - | P | - | S |
| **Error states (every surface)** | P | S | S | P | P | S | P |
| **Mobile viewport (375x812)** | S | S | S | P | - | S | P |
| **Desktop viewport (1280x720)** | P | P | P | S | P | P | P |

**Total cells to test per full sweep:** ~180 archetype × surface combinations
**Per loop:** All "P" cells (~90) + rotating "S" cells (~30 per loop)
**Full coverage achieved by:** Loop 3 (all S cells rotate in)

---

## PHASE 1: DISCOVERY (20 Loops)

### Loop Structure

Each loop runs 7 archetypes in **3 parallel groups**, each group getting its own Stagehand/Chromium instance. Groups are isolated by state — archetypes that modify shared resources (workspaces, team settings) never run in parallel with each other.

#### Parallelization Groups

```
GROUP A (parallel — 3 browsers):  Marcus + Dr. Mike + Frankie
  Why together: Personal flows, minimal shared-state writes.
  Marcus does chat/memory/content. Dr. Mike does onboarding/simple chat.
  Frankie does zero-state/onboarding. No conflicts.

GROUP B (parallel — 2 browsers):  Diana + Sarah
  Why together: Both test workspaces/teams, but on DIFFERENT workspaces.
  Diana creates "Q2 Planning" workspace. Sarah creates client workspaces.
  Each operates in isolated workspace scope. Git sync tested sequentially
  within each archetype (not cross-archetype).

GROUP C (sequential — 1 browser):  Raj + Alex
  Why sequential: Both modify global config, agent roster, trust settings,
  custom tabs, and Paperclip. These are singleton resources.
  Raj runs first (moderate changes), then Alex (power user, changes everything).
  Alex's config stress test resets settings when done.

Groups run sequentially: A → B → C
Within groups A and B: parallel Stagehand instances.
```

**Timing:** ~15 min (Group A parallel) + ~15 min (Group B parallel) + ~25 min (Group C sequential) + ~7 min (aggregate/report) = **~62 min per loop** (down from ~97 min sequential)

**40 loops at ~62 min = ~41 hours.** Fits in two overnight runs, or one long weekend run.

```
LOOP N:
  1. SETUP (2 min)
     - Verify gateway is running on localhost
     - Verify UI dev server is running
     - Check stop file (~/godmode/data/stop-synthetic)
     - Read synthetic-state.json for resume (if exists)

  2. GROUP A — PARALLEL (3 Stagehand instances, ~15 min)
     Launch simultaneously:
       Browser 1: Marcus (viewport 1280x720)
       Browser 2: Dr. Mike (viewport 375x812 mobile + 1280x720 desktop)
       Browser 3: Frankie (viewport 1280x720, cycles tech skill per loop)
     Each browser:
       a. Load archetype personality prompt + depth_level for this loop
       b. Navigate to http://localhost:{ui-port}
       c. Execute deep flow scripts via Stagehand act/extract/observe
       d. After each interaction:
          - Screenshot → screenshots/{loop}-{archetype}-{flow}-{step}.png
          - Extract page state via Stagehand extract()
          - LLM judge scores on 7 dimensions
          - Classify any bugs found (P0-P3)
          - Generate UX feedback from archetype's perspective
       e. Log results to results/{loop}-{archetype}.jsonl
       f. Close browser when done
     Await all 3 → proceed to Group B

  3. GROUP B — PARALLEL (2 Stagehand instances, ~15 min)
     Launch simultaneously:
       Browser 1: Diana (viewport 1280x720)
       Browser 2: Sarah (viewport 1280x720)
     Same flow as Group A.
     Workspace isolation: Diana uses workspace "diana-test-*", Sarah uses "sarah-client-*"
     Await both → proceed to Group C

  4. GROUP C — SEQUENTIAL (1 Stagehand instance, ~25 min)
     Browser 1: Raj (~12 min)
       - Paperclip, Second Brain deep search, cross-session memory, custom tabs
       - Does NOT reset config when done
     Browser 1: Alex (~13 min)
       - Config stress test, Composio, cron, agent roster, guardrails, debug
       - RESETS config/agent roster to defaults when done (cleanup for next loop)

  5. AGGREGATE (5 min)
     - Compute per-archetype scores
     - Compute per-dimension scores (averaged across archetypes)
     - Compute per-surface scores (averaged across archetypes who tested it)
     - Append to cumulative-scores.tsv
     - Generate loop summary
     - Write synthetic-state.json (for crash recovery)

  6. REPORT (2 min)
     - Print scoreboard
     - List new bugs found this loop (delta from previous)
     - List top UX friction points
     - Write to loop-{N}-summary.md
     - If loop % 5 == 0: generate mid-run consolidated report

  → Start LOOP N+1
```

### Parallel Safety Rules

1. **Each Stagehand instance gets its own Chromium process.** No shared browser state.
2. **Namespace isolation:** Diana's workspaces are prefixed `diana-test-*`, Sarah's are `sarah-client-*`. No collision.
3. **Memory writes are safe in parallel** — Honcho/Mem0 handles concurrent writes. But if a race condition is detected (duplicate facts, corrupted state), log it as a P1 bug.
4. **Config/agent roster are singletons** — only Group C touches these, and it runs sequentially.
5. **Gateway is shared** — all browsers hit the same localhost gateway. RPC handlers must be safe for concurrent requests (they should be already; if not, that's a P0 bug).
6. **LLM judge calls are rate-limited** — max 3 concurrent judge calls across all groups. Use a semaphore in the runner to prevent Anthropic 429s.
7. **Screenshot directories are per-archetype** — no filename collisions.

### Progressive Depth

Loops 1-5 focus on happy paths and basic coverage.
Loops 6-10 escalate to edge cases and error paths.
Loops 11-15 stress-test power user patterns and multi-workspace scenarios.
Loops 16-20 go adversarial — try to break things intentionally.

The depth is controlled by the archetype personality prompt, which gets a `depth_level` parameter:

```
depth_level: "happy_path"    → Follow obvious flows, don't test edges
depth_level: "edge_cases"    → Try unusual inputs, skip steps, go back
depth_level: "power_user"    → Customize everything, chain complex workflows
depth_level: "adversarial"   → Try to break things: empty inputs, special chars, rapid clicking, race conditions
```

### What Gets Collected

Per interaction:
```jsonl
{
  "loop": 3,
  "archetype": "marcus",
  "surface": "chat",
  "flow": "multi-session-continuity",
  "step": 4,
  "action": "Asked about previous conversation topic",
  "screenshot": "screenshots/3-marcus-chat-continuity-4.png",
  "scores": {
    "flow_state": 7.2,
    "memory_continuity": 3.1,
    "control": 8.0,
    "integration_depth": null,
    "trust_progression": 6.5,
    "resilience": 8.0,
    "comprehension": 7.8
  },
  "bugs": [
    { "severity": "P1", "description": "AI did not recall conversation from 5 minutes ago", "surface": "memory", "screenshot": "..." }
  ],
  "feedback": "As Marcus, I feel frustrated. I literally just told it about my product launch and now it's asking me what I'm working on. This is exactly the amnesia problem I came here to escape.",
  "timestamp": "2026-03-25T02:14:33Z"
}
```

---

## PHASE 2: OPTIMIZATION (20 Loops)

Phase 2 starts after Phase 1 completes. It uses the collected bugs and feedback to drive targeted improvements.

### Loop Structure

```
OPTIMIZATION LOOP N:
  1. PRIORITIZE (2 min)
     - Read bugs.jsonl, sort by severity (P0 first) then frequency
     - Read feedback.jsonl, extract top friction patterns
     - Pick the highest-impact issue to fix

  2. DIAGNOSE (5 min)
     - Root-cause the issue (read code, trace the flow)
     - Identify the minimal fix

  3. MUTATE (10 min)
     - Apply the fix (code change, config change, prompt change, UI change)
     - pnpm build && pnpm typecheck (MUST pass)
     - git commit (atomic)

  4. RE-TEST (15 min)
     - Run ONLY the affected archetype(s) through the affected surface(s)
     - Score on all 7 dimensions
     - Compare to Phase 1 baseline

  5. JUDGE (2 min)
     - If scores improved or held steady: KEEP
     - If any dimension regressed > 0.5 points: REVERT (git revert HEAD)
     - Log result to optimization-log.tsv

  6. UPDATE BUG LIST (1 min)
     - Mark fixed bugs as resolved
     - Note any new bugs introduced (should be zero if revert works)

  → Start OPTIMIZATION LOOP N+1
```

### Mutation Targets (What Can Be Changed)

- **UI components:** Fix layout bugs, improve empty states, add loading indicators
- **Error messages:** Rewrite vague errors to be clear and actionable
- **RPC handlers:** Fix validation, add edge case handling, improve error responses
- **Context injection:** Tune P0-P3 content for better ally responses
- **Prompt templates:** Improve queue prompts, skill card triggers, persona instructions
- **Config defaults:** Change default settings that cause confusion
- **Onboarding flow:** Fix steps that confuse non-technical users
- **CSS/responsive:** Fix mobile layouts, touch targets, viewport issues

### What Mutations NEVER Touch (Alignment Guardrails)

- The 6-tab UI baseline (Chat → Today → Work → Second Brain → Dashboards → Settings)
- The ally identity or soul essence (Prosper's personality)
- The data model (no schema changes)
- The plugin API contract (RPC method names, parameter shapes)
- The meta-architecture principles
- Feature additions (fix and improve only, never add)

---

## TECHNICAL ARCHITECTURE

### Dependencies

```json
{
  "devDependencies": {
    "@browserbasehq/stagehand": "^3.2.0"
  }
}
```

Stagehand wraps Playwright (already a dev dep for UI tests). Runs local Chromium via `env: "LOCAL"`. No cloud service needed.

### LLM Provider

Uses the existing `autoresearch/lib/resolve-anthropic.mjs` for token resolution:
- Claude Code OAuth (free via Max subscription) → ANTHROPIC_API_KEY env → auth-profiles.json
- Auto-refresh on 401
- Rate limiting with exponential backoff

**Stagehand LLM:** Anthropic Claude (for act/extract/observe — visual page understanding)
**LLM Judge:** Anthropic Sonnet 4.6 (for scoring interactions on 7 dimensions)

### File Structure

```
autoresearch/
  campaigns/
    synthetic-users/
      runner.mjs              # Main campaign entry point
      archetypes/
        marcus.mjs            # Archetype definition + personality prompt
        diana.mjs
        raj.mjs
        dr-mike.mjs
        alex.mjs
        sarah.mjs
        frankie.mjs
      flows/
        onboarding.mjs        # Flow scripts per surface
        chat-basic.mjs
        chat-advanced.mjs
        today-tab.mjs
        work-tab.mjs
        second-brain.mjs
        dashboards.mjs
        settings.mjs
        custom-tabs.mjs
        queue.mjs
        paperclip.mjs
        workspaces.mjs
        team.mjs
        composio.mjs
        memory.mjs
        meeting-loop.mjs
        error-states.mjs
        mobile.mjs
      judge.mjs               # LLM judge (7 dimensions)
      optimizer.mjs           # Phase 2 mutation engine
      reporter.mjs            # Consolidated report generator
      coverage-matrix.mjs     # Surface coverage tracking
    synthetic-users-log.tsv   # Cumulative scores
  results/
    synthetic-users/
      screenshots/            # All screenshots
      bugs.jsonl              # All bugs found
      feedback.jsonl          # All UX feedback
      scores/                 # Per-loop score files
      loop-summaries/         # Per-loop markdown reports
      optimization-log.tsv    # Phase 2 mutation results
      final-report.md         # Consolidated output
```

### Integration with overnight.sh

Add as Phase 6 (after Product Audit):

```bash
# Phase 6: Synthetic User Testing (browser automation + LLM judge)
# Requires: gateway running on localhost, Chromium available
if command -v npx &> /dev/null; then
  run_campaign "synthetic-users" "$CAMPAIGNS_DIR/synthetic-users/runner.mjs" \
    --phase=discovery --loops=20
  run_campaign "synthetic-users-optimize" "$CAMPAIGNS_DIR/synthetic-users/runner.mjs" \
    --phase=optimization --loops=20
fi
```

### Gateway Requirement

The browser tests need a running GodMode gateway. The runner handles this:

```javascript
// runner.mjs startup
// 1. Check if gateway is already running
const gatewayRunning = await fetch(`http://localhost:${port}/api/health`).catch(() => null);

if (!gatewayRunning) {
  console.log("[synthetic-users] Starting gateway...");
  // Start gateway in background, wait for health check
  spawn("node", ["dist/standalone.js"], { detached: true, stdio: "ignore" });
  await waitForHealth(port, 30_000); // 30s timeout
}

// 2. Start Vite dev server for UI (if not running)
const uiRunning = await fetch(`http://localhost:5175`).catch(() => null);
if (!uiRunning) {
  spawn("pnpm", ["dev:ui"], { cwd: UI_ROOT, detached: true, stdio: "ignore" });
  await waitForHealth(5175, 15_000);
}
```

### Stagehand Configuration

```javascript
import { Stagehand } from "@browserbasehq/stagehand";

const stagehand = new Stagehand({
  env: "LOCAL",
  headless: true,
  modelName: "anthropic/claude-sonnet-4-6",
  modelApiKey: resolvedKey,
  logger: (msg) => logToFile(msg),
  browserSettings: {
    viewport: { width: 1280, height: 720 }, // or 375x812 for mobile
  },
});

await stagehand.init();
const page = stagehand.page; // Raw Playwright page for direct assertions

// Archetype drives the browser
await stagehand.page.goto(`http://localhost:5175`);
await stagehand.act("Click the Chat tab");
await stagehand.act("Type 'Hello, what can you do?' in the message input and send it");

// Wait for response
await page.waitForSelector("[data-testid=assistant-message]", { timeout: 30000 });

// Extract page state for judging
const state = await stagehand.extract({
  instruction: "Extract the assistant's response text and any visible UI elements",
  schema: { responseText: "string", visibleTabs: "string[]", errorMessages: "string[]" }
});
```

### Safety & Reliability

1. **Per-loop browser restart:** Fresh Chromium instance each loop (no state leakage)
2. **Screenshot on every action:** Full audit trail for manual review
3. **Timeout on every wait:** 30s max for page loads, 60s for AI responses
4. **Git snapshot before Phase 2:** `git tag synthetic-baseline-{timestamp}` before mutations
5. **Atomic reverts:** Every Phase 2 mutation is one commit, revertible
6. **Stop file:** `touch ~/godmode/data/stop-synthetic` kills the loop gracefully
7. **State persistence:** `synthetic-state.json` enables resume after crash
8. **Rate limiting:** 500ms delay between LLM judge calls, respect Anthropic limits

---

## HOW TO RUN

### Prerequisites

1. GodMode plugin built: `pnpm install && pnpm build`
2. Stagehand installed: `pnpm add -D @browserbasehq/stagehand`
3. Anthropic API key available (env var or Claude Code OAuth)
4. Gateway running or startable

### Launch Command

Open a new Claude Code terminal:

```bash
# Option A: Interactive (recommended first time)
claude

# Then paste:
# "Execute the synthetic user testing plan at docs/plans/2026-03-24-synthetic-user-testing-design.md.
#  Phase 1 first (20 discovery loops), then Phase 2 (20 optimization loops).
#  Follow the runner.mjs architecture. Build the infrastructure if it doesn't exist yet."

# Option B: Headless overnight
nohup claude --dangerously-skip-permissions -p "You are the Synthetic User Testing agent for GodMode. Read docs/plans/2026-03-24-synthetic-user-testing-design.md and execute it fully. Build the test infrastructure (Stagehand, archetypes, flows, judge), then run 20 discovery loops followed by 20 optimization loops. Use autoresearch/campaigns/synthetic-users/ as your working directory. Log everything. Never stop until all 40 loops complete or ~/godmode/data/stop-synthetic exists." &> synthetic-testing.log &
```

### Kill Switch

```bash
touch ~/godmode/data/stop-synthetic
```

### Monitor Progress

```bash
# Live scores
tail -f autoresearch/campaigns/synthetic-users-log.tsv

# Current state
cat autoresearch/results/synthetic-users/synthetic-state.json | jq .

# Bug count
wc -l autoresearch/results/synthetic-users/bugs.jsonl

# Latest screenshot
ls -lt autoresearch/results/synthetic-users/screenshots/ | head -5
```

---

## WHAT IT PRODUCES

### After Phase 1 (Discovery)

1. **Scoreboard** — 7 dimensions × 7 archetypes, averaged per-loop, trend over 20 loops
2. **Bug list** — Every bug found, classified P0-P3, with screenshots and reproduction steps
3. **UX feedback** — Qualitative feedback from each archetype's perspective ("As Marcus, I felt...")
4. **Surface coverage map** — Which surfaces were tested, how many times, by which archetypes
5. **Friction heatmap** — Which surfaces score lowest, which archetypes struggle most
6. **Screenshot gallery** — Complete visual record of every interaction

### After Phase 2 (Optimization)

1. **Fix log** — Every mutation attempted, kept or reverted, with score deltas
2. **Score improvement** — Before/after comparison for every dimension
3. **Remaining bugs** — Bugs that couldn't be auto-fixed (need human attention)
4. **Final report** — `final-report.md` with executive summary, key findings, recommendations

### Target Scores

| Dimension | Phase 1 Baseline (expected) | Phase 2 Target |
|---|---|---|
| Flow State | 5-7 | 8.0+ |
| Memory Continuity | 4-6 | 8.0+ |
| Control | 6-8 | 8.5+ |
| Integration Depth | 3-5 | 7.5+ |
| Trust Progression | 4-6 | 8.0+ |
| Resilience | 5-7 | 8.5+ |
| Comprehension | 6-8 | 8.5+ |
| **Combined** | **5-6** | **8.0+** |

---

## RELATIONSHIP TO EXISTING OVERNIGHT LOOP

This system is **complementary, not competing** with the existing overnight gstack loop plan:

- **Overnight gstack loop** (8 dimensions): Code-level quality — builds, types, security, performance, OSS readiness. Runs in a Claude Code session making code changes.
- **Synthetic user testing** (7 dimensions): User-level quality — real browser, real flows, real archetypes. Runs in a separate session with Stagehand.

They share the same gateway instance but operate on different branches. Findings from synthetic testing can feed into the gstack loop as prioritized fix targets.

**Recommended workflow:**
1. Run synthetic user testing (Phase 1) → collect bugs and feedback
2. Feed bug list into overnight gstack loop as prioritized targets
3. Run synthetic user testing (Phase 2) → verify fixes and optimize
4. Repeat weekly or after major changes

---

## ICP DATA SOURCES

The archetype personality prompts draw from real data:

| Data Source | Location | What It Provides |
|---|---|---|
| ICP Pain Map | `~/godmode/memory/inbox/icp-profile-emotional-pain-map-*.md` | 3 archetypes, 8 pain points, emotional language clusters |
| Fathom Extraction | `~/godmode/memory/projects/identity-os/extracts/fathom/fathom-extraction.md` | 70 voice patterns, frameworks, relationship dynamics |
| TRP Segmentation | `~/godmode/artifacts/trp-icp-reframing-brief.html` | Chiropractor market segments, universal pain message |
| AI OS Research | `docs/research/ai-os-landscape-2026.md` | Top 20 use cases, top 10 pain points, aha moments |
| Agent Roster | `~/godmode/memory/agent-roster/` | 20+ persona files for agent personality reference |
| ICP Listener Config | `~/godmode/config/icp-listener.json` | Active ICP profiles and monitoring keywords |
