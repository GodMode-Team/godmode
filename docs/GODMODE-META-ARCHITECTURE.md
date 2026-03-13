# GodMode Meta Architecture — The Definitive Product Blueprint

*Locked in 2026-03-04. Every future feature, session, and contribution must pass through these principles. This is not a suggestion — it is the law of how GodMode gets built.*

*Grounded in GodMode v1.5.0 codebase and [12 research sources](~/godmode/memory/projects/godmode/research-2026-03-04.md).*

---

## 0. What GodMode Is

**GodMode is a deeply contextual personal AI ally that manages a swarm of agents on your behalf.**

You talk to your ally. Your ally knows your life — goals, blind spots, patterns, schedule, voice. Your ally executes directly in conversation (80% of the value) and delegates to background agents when needed (20%). You review agent work, trust builds, the system gets more autonomous over time.

**GodMode is NOT:**
- A chatbot wrapper
- An agent orchestration framework (that's OpenClaw)
- A feature factory where every cool AI tool becomes a new service
- A CRM, file storage, project management tool, or replacement for ANY tool the user already has

**GodMode is the conductor, not the orchestra.** It connects to your existing tools (Apple Contacts, HubSpot, Google Calendar, Obsidian, GitHub, etc.) and orchestrates them through the ally. It never rebuilds what already exists. The Work section shows GodMode-native artifacts only: sessions, agent outputs, tasks, skills, and workspace memory. Not files, not contacts, not project boards.

**The meta-agent pattern:** The ally's deepest superpower is crafting precise prompts for sub-agents. The ally knows your voice, context, and goals — it writes better agent instructions than any human could. This is how quality scales: the ally is the senior engineer writing perfect tickets, agents are the junior devs executing them.

**The business model:** Engine + Slots + Community
- **Engine** = the ally relationship, deep context, orchestration logic (the only code we write)
- **Slots** = models, tools, skills, personas, engines (files, not code — interchangeable)
- **Community** = shared personas, skills, recipes (files people trade)

**The analogy:** OpenClaw is Linux/WordPress (infrastructure). GodMode is macOS/Shopify (opinionated product layer). The value is in the assembly, the opinions, the defaults. Not in the raw capabilities.

**The imperative:** Code as little as possible into the engine. Every new capability should be a file (persona, skill, recipe) before it's code. If it must be code, it belongs in the engine only if it serves the ally relationship, deep context, or orchestration logic. Everything else is a slot.

---

## 1. Principles

Ten non-negotiable architecture principles. Every PR, every session, every feature must pass them all.

### P1: Context is king, less is more

Every line injected costs tokens and degrades output. ~1,500 → ~150 lines/turn produced dramatically better AI behavior. **No new feature gets permanent context injection without proving it improves output quality.**

The only permanent injection: ally identity (~30 lines) + awareness snapshot (~50 lines). Period.

### P2: Files are the API

Markdown files with YAML frontmatter are the universal interface. Agent personas, skills, recipes — all are files the user can read, edit, share, and version. No database. No proprietary format. `src/lib/agent-roster.ts` already implements this pattern. Everything extensible follows it.

### P3: Inbox-first, not integration-first

New capabilities write to the inbox (vault or queue). The user or ally triages. This prevents the "27 services" pattern. Two pipelines exist (Sessions→Daily, Queue→Inbox). Both are idempotent, zero-discipline, and survive failure.

### P4: Autonomy is earned, not granted

New tools, agents, and capabilities start at "supervised" and earn "full" through demonstrated competence. The trust tracker is the mechanism. Things that don't earn trust get naturally pruned. **Trust is the product's emotional arc** — the user's journey from skepticism to delegation.

### P5: The ally is the interface

Users never configure agents, routing, or orchestration directly. They talk to their ally. The ally is 80% of the value — deep context in every conversation, proactive surfacing, in-chat work. Agent delegation is the other 20%. Mission Control is for power users, not the default experience.

### P6: Compound, don't accumulate

Every interaction makes the system better by deepening context (vault captures), improving routing (trust scores), and refining personas (feedback loops). More data, not more code. After 6 months of daily use, switching costs are astronomical — not from lock-in (all data is markdown), but because the AI genuinely knows you.

### P7: Survive the model switch

Deep context lives in markdown files and frontmatter, not in model-specific formats. The `engine` field on personas supports `claude | codex | gemini`. The architecture is model-agnostic by design. When new models drop, update the engine field. No rewrites.

### P8: Code as little as possible

Before writing TypeScript, ask: "Can this be a file?" Persona → markdown file. Skill → markdown file. Workflow → markdown file with frontmatter triggers. Recipe → JSON config bundle. Only write engine code for: ally identity, context stack, orchestration logic, queue processing, trust tracking. Everything else is content, not code.

### P9: Conduct, don't rebuild

GodMode connects to your existing tools — it never replaces them. The user's CRM is HubSpot. Their contacts are Apple Contacts. Their files are in Google Drive. Their notes are in Obsidian. Their code is in GitHub. GodMode plugs into all of them through the ally and agents. The moment you build a contacts manager, file explorer, project board, or any feature that already exists in a tool the user already uses, you've lost. You're competing against products with hundreds of engineers. GodMode wins by orchestrating, not rebuilding.

### P10: Absorb patterns, not tools

When a new tool, framework, or research technique appears in the ecosystem, GodMode does NOT integrate the tool directly. Instead, it **absorbs the pattern** — the reusable principle — and encodes it as a file (skill card, persona, recipe) or a thin engine hook. The tool itself stays external. The pattern becomes native.

**How absorption works:**
1. New tool demonstrates a valuable pattern (e.g., MetaClaw's "session → skill distillation")
2. GodMode identifies the core insight (conversations produce reusable knowledge)
3. The pattern is implemented using existing primitives (heartbeat pipeline, markdown files, LLM extraction)
4. The tool is never imported, forked, or depended upon

**The Session Distiller is the canonical example:** MetaClaw showed that conversations can auto-generate reusable skill files. GodMode absorbed this as Pipeline 3 in vault-capture — when a session goes idle, Haiku extracts skill drafts, preferences, and entities. No Python proxy server, no new dependencies, no external runtime. Just a ~200-line TypeScript module that slots into the existing heartbeat.

**This is how GodMode stays at the leading edge without accumulating mass.** Every new AI tool, framework, or paper is a potential pattern to absorb. MetaClaw → session distillation. Devin → agent delegation. Manus → browser orchestration. The pattern becomes a file or a hook. The tool stays external. GodMode compounds intelligence without compounding dependencies.

---

## ANTI-PATTERNS — The Scope Creep Kill List

These are the traps that will destroy GodMode. Every contributor must internalize this list. When you feel the urge to build any of these, STOP and ask: "Can the ally just connect to an existing tool for this?"

### Things We Will NEVER Build

| Anti-Pattern | Why It's Tempting | Why It's Wrong | What To Do Instead |
|---|---|---|---|
| **CRM / Contacts manager** | "We need people data for meeting prep" | HubSpot, Apple Contacts, Google Contacts exist | Plug into user's existing contacts via API/MCP |
| **File explorer / storage** | "Users need to see their files" | Finder, Google Drive, Dropbox exist | Ally reads/writes files via tools; don't surface a file browser |
| **Project management tool** | "We need boards, sprints, dependencies" | Linear, Asana, ClickUp, Notion exist | GodMode tasks = ally's flat notepad (title, due, status, workspace). Ally reads/writes external PM via API. Big projects = markdown artifacts, not task hierarchies. |
| **Email client** | "We should show their inbox" | Gmail, Outlook, Superhuman exist | Ally reads email via integration; don't rebuild inbox UI |
| **Calendar app** | "We need a calendar view" | Apple Calendar, Google Calendar exist | Today tab shows today's schedule; don't rebuild a calendar |
| **Note-taking app** | "We should have an editor" | Obsidian IS the note-taking app | Second Brain reads the vault; we never replace Obsidian |
| **Code editor / IDE** | "We need code viewing" | VS Code, Cursor exist | Agents write code via CLI tools; don't surface an editor |
| **Social media manager** | "We need to post to X/LinkedIn" | Buffer, Typefully exist | Content-writer persona creates content; user posts it themselves or via their tool |
| **Analytics dashboard platform** | "We need charts and metrics" | Grafana, Amplitude exist | Dashboards tab is for GodMode-native views only (trust, impact, brief summaries) |
| **Chat platform** | "We need Slack/Discord features" | Slack, Discord exist | Team workspaces sync via git, not a rebuilt chat platform |

### The Scope Test (ask before EVERY feature)

1. **Does a good tool already exist for this?** → If yes, connect to it. Don't rebuild.
2. **Is this a GodMode-native concept?** → Sessions, agent outputs, tasks, trust, skills, personas, briefs, awareness = YES. Files, contacts, email, calendar events, code, social posts = NO.
3. **Would the user already have this in another tool?** → If yes, the ally should READ from that tool, not duplicate the data.
4. **Does this require its own UI surface?** → Almost never. The ally handles it conversationally, or it's a dashboard.
5. **Am I building this because it's cool or because it's necessary?** → If cool: stop. If necessary: check questions 1-4 again.

### What the Work Tab Actually Shows

The Work tab is NOT a file explorer or project management tool. It shows GodMode-native artifacts only:

- **Sessions** — past conversations with the ally, searchable
- **Agent Outputs** — results from queue-processed tasks, organized by project
- **Tasks** — GodMode tasks (created by ally, extracted from briefs), not imported from external PM
- **Artifacts** — markdown documents the ally creates and maintains (project plans, roadmaps, reference docs)
- **Skills** — skills configured for this workspace
- **Workspace Memory** — shared context files for team workspaces

If the user wants to see their GitHub PRs, they open GitHub. If they want to see their Linear tickets, they open Linear. The ally can PULL from those tools and surface relevant info in conversation, but GodMode never rebuilds their UI.

### Task System Scope

GodMode tasks are the **ally's daily operational notepad**, not a project management tool.

**A GodMode task has:** title, due date, status, workspace. That's it. Flat, simple, no hierarchy, no subtasks, no dependencies, no custom fields, no boards, no sprints.

**Where tasks come from:**
- Ally extracts them from brain dumps and conversations
- Morning brief pulls them as today's priorities
- Meeting follow-ups get captured as tasks
- Agent work creates queue items (related but separate system)

**Where tasks DON'T come from (directly):**
- GodMode never imports/mirrors tickets from ClickUp, Linear, Asana into its task store
- Instead, the **ally reads from external PM tools** and surfaces them in the morning brief: "You have 3 ClickUp tasks due this week"
- The ally can also **write to external PM tools**: "I created a ClickUp task for the landing page redesign"
- The ally is the bridge — not a sync engine

**Big projects = artifacts, not task hierarchies.**
A quarterly plan, a product roadmap, a project breakdown — these are markdown artifacts in the vault or workspace. The ally creates them, references them, updates them over time. They're living documents, not task management features. The ally extracts personal action items from artifacts as flat GodMode tasks with due dates. The artifact is the plan; the tasks are your daily operational items.

**External PM integration pattern:**
1. User: "Pull our quarterly plan from ClickUp and weave it into my workflow"
2. Ally reads ClickUp via API/MCP, creates a summary artifact (markdown)
3. Ally extracts user's personal action items as GodMode tasks (title, due date, workspace)
4. Morning brief shows: "Q2 Planning: 3 items due this week" alongside other tasks
5. When user completes something, ally can update ClickUp if desired
6. GodMode never shows a ClickUp board or rebuilds ticket views

---

## 2. The Product Surface

### The 6-Tab Baseline

| Tab | Purpose | Core? |
|-----|---------|-------|
| **Chat** | Pinned ally conversation. Where you do 80% of your work. Full agent coworking. | Yes — the product |
| **Today** | Morning brief, calendar, tasks, daily rhythm | Yes — the habit hook |
| **Work** | Projects, sessions, tasks, artifacts organized by project/company | Yes — operational hub |
| **Second Brain** | Obsidian vault reader/search. Your long-term memory. | Yes — the knowledge base |
| **Dashboards** | AI-generated dynamic views. Business metrics, fitness, impact, trust. | Yes — how you see your life |
| **Settings** | Config + all power-user surfaces collapsed behind toggles | Yes — but minimal |

**Everything else hides behind Settings:**
- Skills, Trust detail view, Guardrails → Settings toggles or dashboards
- Mission Control, Cron, Nodes, Instances, Sessions, Debug, Logs, Channels → behind a "Mission Control" toggle for power users
- Trust progression and Yesterday's Impact → dashboards, not dedicated tabs

**The ally chat bubble appears on every tab except Chat** (where the ally IS the main view). Same conversation, same session key (`"main"`), same as iMessage. The ally is always right there.

### The Two Loops

**Loop 1: Ally Coworking (80% of value)**
You and your ally work together in chat all day. Drafting, creating, solving, analyzing, generating. The ally has deep context — knows your goals, your voice, your blind spots. It pulls from vault, checks your calendar, remembers last week's meeting. This is the primary product experience.

**Loop 2: Agent Delegation (20% of value)**
When work needs to happen in the background, the ally scopes it:
1. Ally proposes: "Here's what I'd send to the queue: [title, persona, deliverable, success criteria]"
2. **Human approves** (always — no silent queue_add)
3. Agent runs in background
4. Results come back for review
5. User approves/rejects → trust score updates
6. Over time, ally earns more autonomy for certain task types

**The ally should be proactively intelligent:**
- "I noticed you never follow up on meeting action items — want me to auto-queue those?"
- "Your Tuesday content takes 3x longer when you skip Monday research — want me to add a prep skill?"
- "I built you a business dashboard based on your weekly patterns"
- "New integration available that could help with X — want me to set it up?"

This is the growth engine. The ally feels a few steps ahead, constantly helping.

---

## 3. The Context Stack

Five layers exist today. One proposed.

### Layer 1: Ally Identity (~30 lines, always-on)
- **File:** `src/hooks/agent-persona.ts`
- Static behavioral DNA. Bias toward action, use tools, be concise, be proactive.
- Survives everything. Never changes.

### Layer 2: Ephemeral Awareness (~50 lines, regenerated every 15 min)
- **File:** `src/lib/awareness-snapshot.ts`
- Today's date, identity digest, schedule, priorities, task counts, queue status, active skills index.
- Generated by consciousness heartbeat. All sessions see the same snapshot.

### Layer 3: Deep Identity (loaded on demand)
- **Files:** `USER.md`, `SOUL.md` in vault or `~/godmode/memory/`
- Name, timezone, style, priorities (USER.md). Shadow state, blind spots, non-negotiables (SOUL.md).
- SOUL.md has 20 rich fields from onboarding but sits mostly dormant. Should surface 2-3 most relevant fields per context.

### Layer 4: Contextual Memory (vault search, on demand)
- **Files:** VAULT PARA structure
- Daily notes, agent outputs, project notes — searchable via second-brain handlers.
- Gap: search is reactive. Ally should proactively pull relevant past context.

### Layer 5: Conditional Context (state-checked injection)
- **Files:** onboarding-context.ts, team-bootstrap.ts, safety nudges
- Right pattern for everything new. Check state → inject or skip.

### Proposed Layer 6: Interaction Ledger
Structured signals extracted from vault capture: preferences, avoidances, corrections, satisfaction, decisions. Awareness snapshot surfaces top 3-5 active patterns (~5 lines). Feeds on-device fine-tuning when Apple ANE ships. Uses existing pipelines — not a new system.

---

## 4. The Agent Model

### Current State
- 3 personas (thin), trust-based routing, 5 parallel agents, 10-min polling, diagnostic retry, multi-engine

### What Ships Next

#### 4a. Human-in-the-Loop Queue Scoping
The ally ALWAYS presents a scoped brief before queuing: title, persona, expected deliverable, success criteria. User approves before it enters the queue. `queue_add` tool gets a confirmation flow. This teaches users what good queue items look like.

#### 4b. Evidence-Backed Verification
Before moving to "review", check output for required evidence by task type:
| Type | Evidence Required |
|------|-------------------|
| `coding` | PR link, diff, or file path |
| `research` | Source URLs (≥1) |
| `ops` | Command output or process ID |
| `review` | File paths + verdict |
| `analysis` | Data source + conclusion |
| `creative`, `task`, `url`, `idea` | Any structured output (not empty) |

Missing evidence → retry once with explicit instruction. Still missing → "review" with ⚠️ flag.

#### 4c. Cron/Recurring Engine
A `~/godmode/skills/` directory with markdown files. Frontmatter includes `trigger` (cron/manual/event) and `schedule` (every Tuesday, daily 9am, etc.). Heartbeat checks schedules on each tick. The ally can register new skills conversationally. This replaces the need for a separate cron service.

#### 4d. Mission Ownership
`mission` field on persona frontmatter (already added). Makes routing smarter — ally matches by mission relevance, not just taskType.

#### 4e. Starter Personas (5-7)
Content writer, inbox manager, meeting prep, competitor watch, weekly review, evidence collector, personal assistant. Zero code — markdown files shipped with the plugin as defaults.

---

## 5. The Growth Engine

### How the Ally Gets Proactively Intelligent

#### 5a. Pattern Detection (passive)
Interaction ledger captures avoidance signals. 3+ occurrences → surfaces in awareness snapshot. Ally decides if/when to mention. Never push notifications.

#### 5b. Blind Spot Coverage (proactive)
Heartbeat checks persona missions against calendar events and task history. Mission-relevant event approaching with no related task → suggestion in awareness snapshot. Ally surfaces it.

#### 5c. Dashboard Generation (proactive)
As the ally observes patterns, it builds dashboards: business metrics, fitness, yesterday's impact, trust progression, weekly content performance. These surface in the Dashboards tab. The ally suggests them: "I built you a business dashboard based on your weekly patterns."

#### 5d. Evening Reflection (opt-in)
After 6 PM, if no reflection captured → awareness snapshot hints to ally. Ally offers once. Output appended to daily note via vault capture.

#### 5e. Trust Feedback Loop
Queue review includes optional rating. Rating feeds trust-tracker. High trust → more autonomy. Low trust → supervised or pruned. The trust progression is visible in a dashboard — the user sees their own journey from skeptical to delegating.

### The Compounding Effect
After 6 months: the ally knows which tasks you avoid, agents that perform well run autonomously, you've developed self-awareness through reflection, and the system serves you better every week without adding features. This is the moat. Cloud AI starts fresh. GodMode compounds.

---

## 6. The Extension Pattern

### Why 27 Services Happened
Every new capability became: new service → new RPCs → new UI tab → new context injection → bloat.

### The Anti-Bloat Pattern

**Step 1: Classify** — Is it a skill, a tool, or a persona?
| Type | Definition | Lives As |
|------|-----------|----------|
| Skill | Repeatable recipe the ally invokes | Markdown in `~/godmode/skills/` |
| Tool | Persistent capability the system uses | OpenClaw tool registration |
| Persona | Specialized agent with a mission | Markdown in `agent-roster/` |

**Step 2: Package as a file, not code.** No new TypeScript. No new services.

**Step 3: Ally discovers and adopts.** User tells ally about new tool → ally creates persona/skill file → starts using it. Or: community packages recipe → user imports → ally discovers.

**Step 4: The bloat gate.** Nothing gets permanent context injection. Skills = invoked on demand. Personas = resolved when task arrives. Vault = searched when relevant.

### Things That Were Services But Should Have Been Files
RescueTime → cron skill. Org-sweep → cron skill. Session-archiver → vault-capture pipeline (already exists). Focus pulse → proactive intel pattern. Coding orchestrator → persona with specific prompt.

The lean audit wasn't about killing features. It was about discovering that most features aren't engine code — they're content. The engine just needed the right slots.

---

## 7. The Moat Analysis

### What Competitors Will Build (Don't Compete Here)
Better models, basic personal context, agent orchestration, standard integrations, code generation.

### GodMode's Five Moats

1. **Sovereignty** — Your data, your machine. On-device fine-tuning when ANE ships. Cloud can't replicate.
2. **Deep Persistent Identity** — Vault compounds. Trust evolves. Soul profile captures shadow state. Switching costs from depth, not lock-in.
3. **Multi-Model Routing** — OpenAI won't route to Claude. Anthropic won't route to Codex. GodMode uses the best tool for each job.
4. **The Growth Layer** — Pattern detection, blind spot coverage, reflection, trust feedback. Requires persistent private context cloud providers won't maintain.
5. **Anti-Fragility** — Every new AI tool = new persona/skill file. No code changes. Cloud competitors stay locked to their stack.

### The Pitch
> "The difference between renting intelligence and owning it."
> "GodMode is sovereign AI. Your data, your rules, your machine."

---

## 8. The Gap List (v1.5.0 → v1.6.0)

What must ship to close the gap between "works for Caleb's team" and "works for founders who find it online."

### Fixes
1. Ally sync bug — bubble ↔ Chat tab ↔ iMessage not seamlessly synced
2. Wire `trust-rate.ts` tool — exists in `src/tools/` but never registered
3. Human-in-the-loop queue scoping — ally scopes before queuing, user approves

### Dead Weight Removal
4. Kill `proactiveIntel` service + handlers (all stubs returning `[]`)
5. Delete orphan `trust-rate.ts` if wiring doesn't make sense, or wire it
6. Gate `curation-agent` startup behind team workspace flag
7. Gate `team-comms`, `team-workspace`, `team-curation` handlers behind team flag
8. Remove `data-sources.ts` (if second-brain sources covers this)
9. Remove `people-data.ts` (no vault sync, unfinished)

### New Features
10. Cron/recurring engine via file-based skills directory
11. Verification gates for non-coding task types
12. Proactive intel — real implementation (the growth engine, not stubs)

### UX
13. Nav simplification — 6 tabs baseline, everything else behind Settings
14. Demo brief — works with zero integrations (name + timezone only)
15. Trust + Yesterday's Impact as dashboards, not dedicated tabs

### Content
16. 5-7 starter persona files shipped with plugin
17. Update onboarding flow — first win before soul interview
18. Update install/setup docs to reflect simplified experience

---

## 9. The Anti-Fragile Loop (see also: P10 — Absorb patterns, not tools)

```
New AI tool appears in ecosystem
        │
        ▼
  Is it useful? ──No──► Ignore
        │
       Yes
        │
        ▼
  ABSORB THE PATTERN (P10)
  What is the core insight?
        │
        ▼
  Can it be a file? ──Yes──► Persona / Skill / Recipe file
        │                        │
       No (rare)                 ▼
        │                 Drop into directory
        ▼                        │
  Engine hook                    ▼
  (thin, uses existing      Ally discovers and
   primitives — heartbeat,   starts using
   vault-capture, etc.)          │
        │                        │
        ▼                        ▼
  Trust feedback loop rates performance
        │
        ▼
  High trust → more autonomy
  Low trust  → supervised or pruned
        │
        ▼
  GodMode got stronger. Tool stayed external.
```

---

*This document is the law. Every session prompt, every PR, every architectural decision must reference these principles. When in doubt: is it a file or is it code? Can the ally handle it or does the engine need to? Does it compound or does it accumulate?*

*Last updated: 2026-03-04. Version: v2 (refined through strategic discussion).*
