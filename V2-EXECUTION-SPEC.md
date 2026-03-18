# GodMode v2 Execution Spec — "The Thin Workspace"

**Branch:** `feat/v2-slim`  
**Date:** March 18, 2026  
**Objective:** Strip GodMode to its essential core. Build as little as possible. Buy everything else. Ship stability.

---

## Why GodMode Exists (Value Proposition)

**One-line:** GodMode is the only AI that actually knows you — and uses that knowledge to help you become who you're trying to become.

**For builders:** Best-of-breed open source, curated into one workspace, with a soul layer that compounds.

**The moat is the relationship.** After months of use, GodMode knows your decision patterns, energy cycles, blind spots, relationships, and north star. That's not a feature — it's a switching cost. Nobody leaves their therapist of 3 years because a new one has a nicer office.

**What GodMode is NOT:** A task runner (Manus), a search engine (Perplexity), a coding tool (Replit), or infrastructure (OpenClaw). It's the human-facing experience layer that curates the best of all of those — Apple-style integration with a soul.

**Competitive positioning:**
- vs Manus/Perplexity: They're transactional. GodMode is relational.
- vs OpenClaw: OC is the runtime. GodMode is the experience.
- vs Hermes: Hermes learns skills. GodMode learns YOU.
- vs DIY: 6 months of integration work vs one install + one relationship.

---

## What GodMode v2 IS

A lightweight OpenClaw plugin that delivers:
1. **Workspace UI** — Chat, Today (brief + tasks + inbox), Workspaces, Second Brain, Dashboards
2. **Executive Agent** — Prosper with meta skills, trust scoring, safety gates
3. **Soul Framework** — SOUL.md, onboarding, progressive trust

Everything else is external: Paperclip (orchestration), Composio (auth), Honcho (memory), OpenClaw/Hermes (runtime).

## Architecture: Shared Core + Adapters

```
godmode-plugin/
├── src/core/           ← Platform-agnostic business logic (TypeScript)
│   ├── tasks.ts        ← Task CRUD, brain-dump parsing, delegation triage
│   ├── inbox.ts        ← Inbox items, Paperclip webhook receiver
│   ├── trust.ts        ← Trust scoring, progressive permissions
│   ├── brief.ts        ← Daily brief generation (simplified)
│   ├── dashboards.ts   ← Dashboard save/list/widget-data
│   └── workspaces.ts   ← Workspace CRUD, team sync
├── src/adapters/
│   └── openclaw.ts     ← OpenClaw plugin wiring (RPC registration, hooks)
├── src/hooks/          ← Safety gates (platform-adaptable)
├── src/tools/          ← Agent tools (3 total)
├── src/lib/            ← Shared helpers
├── ui/                 ← Lit web components (served at /godmode)
├── skills/             ← SKILL.md files (portable to Hermes)
└── openclaw.plugin.json
```

---

## SESSION 1: The Great Deletion

**Goal:** Remove all non-essential code. Plugin must still build and run.

### Files/Modules to DELETE from src/methods/:

| File | Lines | Reason |
|------|-------|--------|
| `swarm-rpc.ts` | 457 | Replaced by Paperclip API skill |
| `coding-tasks.ts` | ~400 | Replaced by Paperclip |
| `consciousness.ts` | ~200 | Replaced by Honcho (later), remove for now |
| `focus-pulse.ts` | ~300 | Over-engineered, remove |
| `life-dashboards.ts` | ~400 | Wheel of Life, Vision Board — remove |
| `lifetracks.ts` | ~600 | Audio generation — remove entirely |
| `proactive-intel.ts` | ~500 | Remove |
| `clawhub.ts` | ~300 | Replace with simple agentskills.io browser |

### Files/Modules to DELETE from src/services/:

| Service | Reason |
|---------|--------|
| `coding-orchestrator.js` | Replaced by Paperclip |
| `coding-notification.ts` | Replaced by Paperclip |
| `swarm-pipeline.ts` | Replaced by Paperclip |
| `consciousness-heartbeat.ts` | Replaced by Honcho |
| `focus-pulse-heartbeat.ts` | Removed |
| `proactive-intel.ts` | Removed |
| `observer.ts` | Removed |
| `scout.ts` | Removed |
| `claude-code-sync.ts` | Removed |
| `ide-activity-watcher.ts` | Removed |
| `curation-agent.ts` | Simplified or removed |

### Files/Modules to DELETE from src/tools/:

| Tool | Reason |
|------|--------|
| `coding-task.ts` | Replaced by Paperclip skill |
| `delegate-tool.ts` | Replaced by Paperclip skill |

### Services that STAY:

| Service | Why |
|---------|-----|
| `agent-log-writer.ts` | Core telemetry |
| `workspace-sync-service.ts` | Team sync |
| `session-archiver.ts` | Cleanup |
| `image-cache.ts` | Performance |
| `guardrails.ts` | Security |
| `onboarding.ts` | Setup flow |
| `queue-processor.ts` | Can be simplified to Paperclip bridge |
| `self-heal.ts` | Keep if simple |

### UI Views to DELETE:

| View | Reason |
|------|--------|
| `mission-control.ts` | Replaced by Paperclip |
| `parallel-sessions.ts` | Removed |
| `clawhub.ts` | Simplify into skills.ts |
| Multiple onboarding variants | Keep ONE: `setup.ts` |

### Dependencies to REMOVE from package.json:

| Package | Why |
|---------|-----|
| `mem0ai` | Replaced by Honcho (later). Remove now, memory falls back to file-based. |
| `clawhub` | Replace with simple fetch to agentskills.io API |
| `better-sqlite3` | Check if still needed after removals. Remove if not. |

### Environment Variables — Target State:

**REQUIRED (just 1):**
- Model API key (ANTHROPIC_API_KEY or OPENAI_API_KEY or OPENROUTER_API_KEY)

**OPTIONAL (setup wizard guides these):**
- `GODMODE_ROOT` (defaults to ~/godmode)
- `GOG_CALENDAR_ACCOUNT` (calendar integration)
- `COMPOSIO_API_KEY` (Composio for secure auth — future)
- `HONCHO_API_KEY` (Honcho for memory — future)
- `PAPERCLIP_URL` (Paperclip instance — future)

### index.ts Changes:

1. Remove service starts for deleted services
2. Remove RPC handler registrations for deleted methods
3. Remove tool registrations for deleted tools
4. Remove feature flags for deleted features (`deck.enabled`, `missionControl.enabled`)

### Validation:

After deletion:
```bash
pnpm typecheck    # Must pass
pnpm build        # Must succeed
pnpm build:ui     # Must succeed
```

Plugin must load in OpenClaw and serve the UI at /godmode with:
- Chat working
- Today tab showing brief + tasks + inbox
- Workspaces tab working
- Second Brain tab working (simplified)
- Dashboards tab working
- Trust tracker working
- Guardrails working
- Settings working

---

## SESSION 2: Sidebar Editor (Simple, Zero New Dependencies)

**Goal:** Make the existing markdown sidebar editable with approve/reject actions. No new dependencies.

### Why simple (not Proof SDK):

- Proof SDK adds ~30 dependencies (Milkdown, Yjs, ProseMirror, Hocuspocus, Express, AWS SDK...)
- We're trying to get THINNER, not fatter
- Right now Caleb is the only editor — no need for real-time collab yet
- We already have `marked` + `dompurify` in package.json for rendering
- Proof SDK is Phase 2 when multi-user collaboration matters

### Changes:

1. **Add edit mode to existing sidebar** — toggle between rendered markdown and textarea
   - Button: ✏️ Edit → opens textarea with raw markdown
   - Button: 👁️ Preview → renders back to formatted view
   - Save writes back to the inbox file (~/godmode/memory/inbox/*.md)
2. **Add action buttons** at bottom of sidebar:
   - ✅ Approve (marks inbox item done, archives file)
   - ↩️ Send Back (with comment textarea, routes back to agent/Paperclip)
3. **Auto-open sidebar** when user opens an inbox-linked session
4. **Auto-close** when session is not linked to a deliverable
5. **Prosper writes to the same file** — when Prosper updates a deliverable, the sidebar refreshes automatically (file watcher or RPC push)

### Zero new dependencies. Uses:
- `marked` (already in package.json) — markdown → HTML
- `dompurify` (already in package.json) — sanitize HTML
- Native `<textarea>` — edit mode
- Existing RPC system — save/approve/reject actions

### Phase 2 (later, when multi-user matters):
- Evaluate Proof SDK for real-time collaboration
- Or evaluate simpler alternatives (CodeMirror, Monaco)

### Files to modify:

- `ui/src/ui/views/proof-viewer.ts` → rename to `sidebar-editor.ts`, add edit/save/approve/reject
- `ui/src/ui/views/chat.ts` — Auto-open sidebar when session has deliverable
- `ui/src/ui/views/inbox.ts` — Link inbox items to sessions + sidebar
- `src/methods/inbox.ts` or equivalent — Handle approve/reject/save RPC calls

---

## SESSION 3: Meta Skills

**Goal:** Write 6 SKILL.md files that are the core IP.

### Skills to create in `skills/`:

#### 1. `first-principles/SKILL.md`
**Trigger:** User asks for a decision, strategy, or solution to a complex problem.
**Process:**
1. Identify all constraints explicitly
2. Find the root cause / core question
3. Generate 3 solutions, each from different first principles
4. Adversarially attack each solution
5. Recommend the strongest with clear reasoning
6. State what would change the recommendation

#### 2. `adversarial-board/SKILL.md`
**Trigger:** User says "debate this", "what am I missing", "challenge this", or any major decision.
**Process:**
1. Create 5 personas: Skeptic, Optimist, Operator, Customer, Competitor
2. Each persona critiques the idea from their angle
3. Synthesize into: Strongest arguments for, strongest against, blind spots, recommended action
4. End with: "What would the person who disagrees with you most say?"

#### 3. `auto-research/SKILL.md`
**Trigger:** User asks about any topic, company, person, market, or trend.
**Process:**
1. Search web (web_search) for current information
2. Search X (x_read) for real-time discourse
3. Search memory (memory_search) for prior context
4. Synthesize findings with citations
5. Identify gaps — what couldn't be found
6. Suggest follow-up research if needed

#### 4. `auto-context/SKILL.md`
**Trigger:** Before any meeting, task, or project discussion.
**Process:**
1. Check calendar for upcoming meetings
2. Look up ALL attendees (memory_search, web_search)
3. Pull relevant project context from workspaces
4. Check task history for related items
5. Surface everything proactively — don't wait to be asked
6. Never say "I don't have context" without searching first

#### 5. `skill-builder/SKILL.md`
**Trigger:** After completing a complex multi-step task (5+ tool calls).
**Process:**
1. Analyze what was done and what worked
2. Extract the reusable pattern
3. Write a new SKILL.md with clear trigger, process, and validation
4. Save to skills/ directory
5. Log the skill creation in the daily note
6. Over time: review and improve skills based on trust ratings

#### 6. `paperclip-ceo/SKILL.md`
**Trigger:** User says "delegate", "assign", "have the team do", or any work that should go to agents.
**Process:**
1. Parse the request into discrete tasks
2. For each task: identify the right agent role
3. Create Paperclip tasks via API with full context
4. Set budget limits and priority
5. Monitor status and surface updates in Today/Inbox
6. When complete, create Inbox item for review

---

## SESSION 4a: Honcho → Vault Sync Service

**Goal:** Honcho outputs readable markdown into the Obsidian vault. One unified knowledge base.

### Architecture:

```
Conversations → Honcho (cloud, reasons in background)
                  ↓
            Sync service (runs after each session, or on cron)
                  ↓
            Queries Honcho .chat() API for latest representations
                  ↓
            Writes markdown to vault:
              vault/Brain/Identity/honcho-identity.md
              vault/Brain/Identity/honcho-patterns.md
              vault/Brain/Identity/honcho-conclusions.md
```

### Data Flow — Single Vault as Source of Truth:

```
OBSIDIAN VAULT (one database of all knowledge)
├── Brain/
│   ├── Identity/           ← Honcho syncs here (auto-maintained by AI)
│   ├── People/             ← Agent-maintained from conversations
│   ├── Companies/          ← Agent-maintained
│   └── Research/           ← Agent research output
├── Projects/
│   ├── GodMode/
│   ├── Patient Autopilot/
│   └── TRP/
├── Daily/
│   ├── 2026-03-18.md       ← Agent breadcrumbs + user journal
│   └── ...
├── Working/
│   ├── WORKING.md          ← Session state
│   ├── MISTAKES.md         ← Error-turned-rules
│   └── INBOX.md            ← Agent-surfaced action items
└── Resources/
    └── ...
```

**The agent IS the vault curator.** Nobody manually maintains anything. The vault grows organically from life, maintained by Prosper + Honcho.

### Implementation:

- New file: `src/services/honcho-sync.ts` (~50 lines)
- Runs after each session ends (hook: `session_end`)
- Also on hourly cron (replaces consciousness-heartbeat)
- Queries Honcho peer representations
- Writes clean markdown to vault paths
- If no vault configured, writes to ~/godmode/memory/ as fallback

---

## SESSION 4b: Paperclip → Proof (Live Output)

**Goal:** Agent team output appears live in the Proof sidebar.

### Flow:

1. User tells Prosper to delegate work
2. Prosper dispatches to Paperclip via paperclip-ceo skill
3. Paperclip agents start working
4. As output is produced → webhook pushes to Proof doc in real time
5. User sees content appearing live in Proof sidebar
6. User edits inline or chats with Prosper about it
7. Approve → done. Send back → returns to Paperclip agents.

### Implementation:

- Paperclip webhook endpoint in HTTP handler (receives task output)
- Creates/updates Proof doc for each task
- Proof sidebar auto-opens when deliverable is active
- No Mission Control view needed — link to Paperclip's own dashboard instead

### Mission Control → Link Only:

Replace the entire mission-control.ts view with a single card:
"View your agent team in Paperclip → [Open Dashboard]"
Links to PAPERCLIP_URL. Done.

---

## SESSION 4c: Dependency Reduction

**Goal:** New install works with just a model API key.

### Changes:

1. **Remove embedding dependency** — No OPENAI_API_KEY required for embeddings
   - Memory search falls back to simple keyword/fuzzy matching
   - Honcho replaces semantic search later
   - QMD dependency made optional (graceful degradation)

2. **Make calendar optional** — Calendar methods return empty array if not configured, not errors

3. **Make vault optional** — Second Brain falls back to ~/godmode/memory/ if no vault path

4. **Guided setup wizard** — After first chat, Prosper says:
   ```
   "You're up and running! Want to supercharge things? I can help you connect:
   📅 Calendar (Google) — /setup calendar
   🔐 Secure tools (Composio) — /setup composio  
   🧠 Better memory (Honcho) — /setup memory
   👥 Agent team (Paperclip) — /setup team"
   ```
   Each is optional. Each is a simple guided flow.

5. **Remove hard failures** — Any missing env var = graceful degradation, NEVER a crash or blocked onboarding

### Files to modify:

- `index.ts` — Remove hard dependency checks
- `src/methods/calendar.ts` — Return empty if not configured
- `src/methods/second-brain.ts` — Fallback to file-based
- `src/lib/memory.ts` — Make QMD optional
- `src/services/onboarding.ts` — Simplified, fewer required steps

---

## SESSION 5: Workspaces Hardening

**Goal:** Team workspaces work reliably for installs.

### Changes:

1. **Simplify workspace creation** — One command: `/workspace create <name>`
2. **Git sync must work** — Fix known issues with team sync
3. **Shared skills** — Skills in workspace are available to all team members
4. **Shared memory** — Memory in workspace is shared (via team-memory-write)
5. **Session sharing** — Multiple users can see the same workspace sessions

### Validation:

- Create workspace → works
- Add team member → works
- Sync files → works
- Shared skills visible → works
- Shared tasks → works

---

## UI Tab Structure (Final)

```
SIDEBAR:
├── 💬 Chat (primary — always here)
├── 📋 Today (brief + tasks + inbox items)
├── 📊 Dashboards
├── 🧠 Second Brain (memory viewer + skills browser)
├── 👥 Workspaces
├── ─── (divider) ───
├── 🛡️ Trust & Guardrails
├── ⚙️ Settings
└── 🔧 Setup (conditional — shows during onboarding)

RIGHT SIDEBAR (Proof — contextual):
└── Opens when reviewing deliverables
    ├── Deliverable content (editable)
    ├── Agent commentary
    └── [Approve] [Send Back] [Edit]
```

## Deleted Tabs:

- ClawHub (merged into Second Brain → Skills)
- Mission Control (replaced by Paperclip)
- Parallel Sessions (removed)
- Multiple onboarding views (keep one)
- Focus Pulse section in Today (removed)
- Proactive Intel (removed)
- Wheel of Life (removed)
- Vision Board (removed)
- Lifetracks (removed)

---

## Validation Checklist (All Sessions)

After all sessions merge to `feat/v2-slim`:

- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm build:ui` succeeds
- [ ] Plugin loads in OpenClaw
- [ ] Chat works
- [ ] Today tab shows brief + tasks + inbox
- [ ] Tasks CRUD works
- [ ] Dashboards work
- [ ] Second Brain shows memory + skills
- [ ] Workspaces CRUD works
- [ ] Trust tracker works
- [ ] Guardrails work
- [ ] Proof sidebar opens and is editable
- [ ] Onboarding works with ONLY a model API key
- [ ] No crashes from missing env vars
- [ ] Meta skills load and are usable

---

## What This Enables

1. **Austen install this week** — works with just a model key
2. **Hermes adapter later** — shared core means ~300 lines to port
3. **Open source workspace** — extract UI as standalone repo
4. **Community launch** — workspace is the lead magnet
5. **Stability** — 65% less code = 65% fewer bugs

---

*This spec is the canonical reference for the v2 rebuild. Every Claude Code session should read this file before starting work.*
