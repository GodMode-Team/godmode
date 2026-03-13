# Recent Changes

This file tracks recent development changes so Atlas and other agents can quickly understand what's been modified and why.

---

## Proof + Universal Inbox Prototype (2026-03-13)

### What Landed
- Wired a real universal inbox flow into the Today tab with scoring, dismissal, mark-all-complete, and feedback writes back into persona/skill files.
- Finished the lightweight local Proof stack: queue items now get Proof docs, the sidebar has a Proof viewer mode, proof docs mirror to markdown artifacts, and Proof metadata is exposed via RPC.
- Added Proof-aware queue behavior and UI plumbing so background items can open live docs, tool cards can open Proof docs, and the chief-of-staff/project workflow cards know about Proof + cron workflows.

### Verification
- `pnpm typecheck`
- `pnpm build`
- `pnpm ui:sync`
- `rg "\.\./\.\./\.\./\.\./src/" -n`

## Artifact Persistence Guardrails (2026-03-09)

### Problem
Ally built a website in /tmp, served it locally, macOS cleaned /tmp, work vanished. Tokens wasted.

### Three-Layer Protection
1. **P0 Context Injection** (`src/lib/context-budget.ts`) — `ARTIFACT_PERSISTENCE` block injected into EVERY conversation. Rules: never use /tmp, websites → GitHub, code → GitHub or ~/godmode/artifacts/, documents → vault.
2. **Queue Agent Prompt** (`src/services/queue-processor.ts`) — Artifact Persistence section in safety rules for background agents. Same rules as ally.
3. **Ephemeral Path Shield** (`src/hooks/safety-gates.ts`) — Deterministic `before_tool_call` gate that detects exec commands writing to /tmp or /var/tmp. Fires a warning (doesn't block) that injects persistence instructions into the LLM's context.

### New Infrastructure
- `ARTIFACTS_DIR` export in `src/data-paths.ts` → `~/godmode/artifacts/`
- `ephemeralPathShield` gate registered in `src/services/guardrails.ts` (enabled by default, visible in Settings > Guardrails)
- `checkEphemeralWrite()` function in safety-gates.ts
- Wired into `before_tool_call` hook in index.ts (Gate 1d)

---

## Soul + Router + Enforcer Architecture (2026-03-05)

### Soul Digest (`src/lib/awareness-snapshot.ts`)
- `loadSoulDigest()` — extracts behavioral essence from SOUL.md (~20 lines, 30-min cache)
- Sections: How You See, Truth, Listen, Serve, Modes, Boundaries
- `loadRouterDigest()` — extracts Prime Directive, File Index, search rules from AGENTS.md (~25 lines, 30-min cache)
- Expanded `loadIdentityDigest()` — now includes Family, Key Entities, Critical Constraints (~15 lines, up from ~4)
- Total always-on context: ~130 lines/turn (within 150-line budget)

### Enforcer Gates (`src/hooks/safety-gates.ts`)
- 4 new gates on `message_sending` — zero context cost, nudge only when fired:
  - `exhaustiveSearch` — blocks "I don't know" when 0 search tools used
  - `selfServiceGate` — blocks asking user for searchable info when 0 tools used
  - `persistenceGate` — blocks "I can't" when < 3 investigation tools tried
  - `searchRetryGate` — blocks "not found" when < 3 search attempts
- Per-turn tool usage tracking (reset on `message_received`, record on `before_tool_call`)
- Nudge system: gate fires → flag stored → `before_prompt_build` injects nudge → ally retries
- All gates configurable via Guardrails settings panel

### Persistence Protocol (`src/hooks/agent-persona.ts`)
- Replaced generic 30-line persona with focused Persistence Protocol + Core Behaviors
- Proactive behavioral complement to reactive enforcer gates
- "Try AT LEAST 5 meaningfully different approaches before telling user something can't be done"

### Universal SOUL.md Template (`src/services/onboarding.ts`)
- Universal sections for ALL users: The Ground (Logos principle), How You Listen, Reading the Room, Boundaries
- `mergeMode: "merge"` — appends missing sections to existing files without overwriting
- `checkOnboardingStatus()` now returns `outdated` field for files missing key sections

### Hook Wiring (`index.ts`)
- `message_received` → `resetTurnToolUsage()`
- `before_tool_call` → `recordToolUsage()` (after existing gates)
- `message_sending` → `checkEnforcerGates()` (before output shield)
- `before_prompt_build` → `consumeEnforcerNudge()`
- `before_reset` → cleanup

### Other Changes in This Merge
- Setup banner fix: only shows for users who haven't completed quickSetup
- Auto-install integrations: `integrations.autoInstall` RPC for CLI deps (gog, gh)
- Name persistence: quickSetup writes USER.md for awareness snapshot
- Chat tab merge fix: no longer deduplicates tabs by display name
- Auto-title retry: failed auto-title attempts now retry on next response
- Auth subscription plan: `docs/PLAN-auth-subscription.md`

---

## v1.6.0 Post-Merge Audit + Intelligence (2026-03-05)

### UI Cleanup (meta-architecture alignment)
- Removed Goals section from Today tab — goals surface through daily brief text (Chief Aim), not a separate card
- Renamed "Command Center" tab to "Tasks" — clearer, less jargon
- Removed dead `renderGoalsSection`, goals props/state/loading from app, controller, and view-state
- Deleted `views/goals.ts` (dead types file)
- Deleted orphaned CSS: `lifetracks.css` (583 lines), `vision-board.css` (405 lines)
- Removed dead CSS imports from `styles.css`
- Cleaned goals CSS from `my-day.css`

### Harness Update
- Added Section 6 "Building Skills" to HARNESS.md — references Anthropic's skill-creator methodology
- Added `create-skill.md` to godmode-dev workspace template
- Agents now have a systematic process for creating new skills with quality guardrails

### Intelligence
- `docs/INTEL-2026-03-05.md` — Anthropic skill-creator (meta-tool for building skills) + Google Workspace CLI (future integration path)
- Both reinforce anti-fragile thesis: new tools = new files, not new code

---

## v1.6.0 Product Polish — 6-Tab UX Overhaul (2026-03-05)

### Phase 1: Daily Rhythm Bulletproofing
- Fixed goals schema mismatch in brief-generator (`goal.text` → `goal.title`)
- Added active goals to awareness snapshot (top 3 + overflow count)
- Added agent activity summary to awareness snapshot
- Fixed AI Packet display (backend returns `snapshot`, UI expected `consciousness/working`)
- Expanded starter tips from 5 to 15 (was cycling every 5 days)
- Added goals section to starter brief
- Added readiness score display in daily brief header
- Improved empty state with "Generate Brief Now" CTA

### Phase 2: Dashboards 10x (175 → 370 lines)
- Added 6 dashboard template cards with starter prompts
- Added category filter bar (6 categories: overview, personal, productivity, finance, system, content)
- Added pin/unpin support with pinned-first sorting
- Added staleness indicators (>24h since last refresh)
- Added dashboard count display
- Auto-categorization from title/description keywords
- Created `assets/dashboard-templates/` with 6 template files

### Phase 3: Goals in Today Tab
- Added goals section to Today tab with progress bars
- Added evening capture button to toolbar
- Wired goals loading into my-day refresh cycle

### Phase 4: Second Brain Polish
- Replaced dead Insights placeholder with readiness checklist
- Added context health score (0-100% across 5 criteria)
- Added "Update via Chat" button to Identity panel
- Fixed Research Quick Add button (was unreachable)

### Phase 5: UX Polish
- Improved Work tab empty states (workspaces, artifacts, sessions) with helpful hints and CTAs

### Files Changed
- `src/lib/awareness-snapshot.ts` — goals section, agent activity summary
- `src/methods/brief-generator.ts` — goals schema fix, 15 starter tips, goals in prompt
- `ui/src/ui/views/dashboards.ts` — complete rewrite with templates, categories, pinning
- `ui/src/ui/views/my-day.ts` — goals section, evening capture, empty state
- `ui/src/ui/views/daily-brief.ts` — readiness score, generate button, task progress
- `ui/src/ui/views/second-brain.ts` — insights panel, health score, identity chat button
- `ui/src/ui/views/workspaces.ts` — improved empty states
- `ui/src/ui/controllers/second-brain.ts` — sync data shape fix
- `ui/src/ui/app.ts` — dashboard prompt passthrough, goals refresh
- `ui/src/ui/app-render.ts` — evening capture, goals props, dashboard prompt
- `ui/src/ui/app-view-state.ts` — dashboard create type update
- `ui/src/styles/dashboards.css` — categories, templates, pinning, staleness
- `ui/src/styles/my-day.css` — readiness, goals, generate button, evening capture
- `ui/src/styles/second-brain.css` — health score, chat button
- `ui/src/styles/workspaces.css` — empty state hints
- `assets/dashboard-templates/*.md` — 6 new template files

---

## 2026-03-05 — Security Hardening Mega-Session

### Phase 1: Comprehensive Security Audit + Fixes (12+ critical/high vulns fixed)
- **files.ts**: Removed hardcoded GOG_KEYRING_PASSWORD; added path validation + symlink resolution to readFile, pushToDrive, batchPushToDrive, taskFiles; sanitized error messages
- **dashboards.ts**: Sanitized dashboard ID via sanitizeSlug() in get/remove handlers; added path prefix check before rm
- **vault-capture.ts**: Added path traversal check on destination paths in captureQueueOutputsToVault
- **safety-gates.ts**: Expanded output shield (JWT, AWS, OpenAI, Oura, Fathom, Front, Bearer, private keys); expanded config shield (15+ sensitive paths, 20+ file-read commands); lowered min length to 20
- **fathom-webhook.ts**: Webhook now REQUIRES signing secret; removed secret from RPC response; added restrictive file permissions
- **markdown.ts (UI)**: Added DOMPurify hook to restrict `<input>` to checkbox only; CSS sanitization strips expression(), behavior:, -moz-binding:, @import

### Phase 2: Private Session Mode
- **Backend**: New `src/lib/private-session.ts` (server-side state, 24h auto-expiry, in-memory cache); new `src/methods/session-privacy.ts` (RPC handlers)
- **Frontend**: Wired privateMode props to chat view; added backend RPC calls in toggle handler; lock/unlock button + banner in chat compose area
- **Integration**: before_prompt_build blocks vault capture for private sessions; heartbeat cleans expired sessions

### Phase 3: Least Privilege Hardening
- **New `src/lib/secure-fs.ts`**: secureWriteFile (0o600), secureMkdir (0o700), sanitizeError utility
- **12 files migrated**: trust-tracker, options, tasks, projects, data-sources, onboarding, system-update, dashboards, support, correction-log, fathom-processor, trust-rate tool
- **Error sanitization**: User-facing error responses in support.ts now strip home directory paths

### Phase 4: Security Documentation
- **New `docs/SECURITY.md`**: Threat model, 5 security layers (safety gates, file I/O, HTML/CSS sanitization, private sessions, auth/webhooks), data storage map, user security guide

### Files Changed
- `src/methods/files.ts`, `src/methods/dashboards.ts`, `src/methods/trust-tracker.ts`, `src/methods/options.ts`, `src/methods/tasks.ts`, `src/methods/projects.ts`, `src/methods/data-sources.ts`, `src/methods/onboarding.ts`, `src/methods/system-update.ts`, `src/methods/support.ts`, `src/methods/fathom-webhook.ts`, `src/methods/session-privacy.ts` (new)
- `src/hooks/safety-gates.ts`
- `src/lib/private-session.ts` (new), `src/lib/secure-fs.ts` (new), `src/lib/env-writer.ts`, `src/lib/correction-log.ts`
- `src/services/vault-capture.ts`, `src/services/consciousness-heartbeat.ts`, `src/services/fathom-processor.ts`
- `src/tools/trust-rate.ts`
- `ui/src/ui/views/chat.ts`, `ui/src/ui/icons.ts`, `ui/src/ui/markdown.ts`, `ui/src/ui/app.ts`, `ui/src/ui/app-render.ts`
- `index.ts`, `docs/SECURITY.md` (new)

---

## v1.6.0 Stabilization — Bug Hunt + Content Expansion (2026-03-05)

### Bug Fixes (12 bugs found and fixed via 6-agent adversarial review)
- **MEDIUM**: Skills registry frontmatter parser fails on CRLF (Windows) line endings — fixed regex
- **MEDIUM**: Quoted YAML values in skill frontmatter (e.g., `schedule: "daily 9:30am"`) silently break schedule parsing — now strips quotes
- **MEDIUM**: `every Nh` schedule uses `Date.now()` instead of `now` parameter — fixed for consistency and testability
- **MEDIUM**: Heartbeat `lastRuns` timestamp updated even when dedup prevents queue insertion — now checks return value
- **MEDIUM**: Queue processor doesn't block `"disabled"` autonomy level — now blocks both `"disabled"` and `"approval"`
- **MEDIUM**: Double decrement of `activeCount` on non-zero exit codes — added `alreadyDecremented` parameter
- **MEDIUM**: Deep work window PM/PM typo — end time always showed "PM" regardless of actual time
- **MEDIUM**: quickSetup skips phase 4 but doesn't mark it complete — phase 4 now marked complete
- **MEDIUM**: Mission Control toggle broken (can never collapse) — fixed boolean logic
- **MEDIUM**: Ally unread badge not cleared when clicking pinned ally tab — now clears on switch
- **LOW**: `every 0h` schedule not rejected — now returns null for invalid intervals
- **LOW**: `checkEvidence` used `lower` and `content` inconsistently — standardized on `content`
- **LOW**: Curation agent gate checks non-existent `data/team-workspaces/` instead of `clients/` — fixed path
- **LOW**: proactiveIntel defaults still ship in options.ts despite feature removal — cleaned up
- **LOW**: Redundant dynamic `node:fs` imports in starter persona seeding — converted to static imports

### Content Layer Expansion
- 4 new personas: finance-admin, travel-planner, executive-briefer, life-admin
- 4 new skills: monthly-bill-review, daily-standup-prep, weekly-life-admin, quarterly-review
- Total: 11 personas, 7 skills available out of the box

### Files Changed
- `src/lib/skills-registry.ts` — CRLF support, quote stripping, `every 0h` rejection, `now` param fix
- `src/services/consciousness-heartbeat.ts` — dedup-aware lastRuns update
- `src/services/queue-processor.ts` — disabled autonomy blocking, double decrement fix, evidence check consistency
- `src/methods/brief-generator.ts` — PM/AM typo fix
- `src/methods/onboarding.ts` — phase 4 completion in quickSetup
- `src/methods/options.ts` — removed dead proactiveIntel defaults
- `ui/src/ui/app-render.ts` — Mission Control toggle fix, ally unread badge fix
- `index.ts` — curation agent path fix, static imports cleanup, MEMORY_DIR import
- `assets/agent-roster/` — 4 new persona files
- `assets/skills/` — 4 new skill files

---

## v1.6.0 — Product Foundation (2026-03-05)

### Philosophy Lock-In
- `docs/GODMODE-META-ARCHITECTURE.md` v2 — the definitive product blueprint
- 8 principles: context is king, files are the API, inbox-first, autonomy is earned, ally is the interface, compound don't accumulate, survive the model switch, code as little as possible
- GodMode = Engine + Slots + Community. The ally is 80% of the value.

### Engine
- File-based skills directory (`~/godmode/skills/`) with cron scheduling
- Heartbeat processes cron skills on each tick
- Verification gates for all task types (not just coding)
- Human-in-the-loop queue scoping (ally presents brief, user approves)
- `trust_rate` tool wired into registered tools
- Dead weight removed: proactiveIntel stubs, data-sources, people-data unregistered
- Team services gated behind team workspace flag

### UX
- 6-tab baseline: Chat, Today, Work, Second Brain, Dashboards, Settings
- Power-user tabs (Mission Control, Skills, Trust, etc.) behind expandable section
- Ally panel sync fix — bubble, Chat tab, and iMessage stay in sync
- Trust summary in awareness snapshot

### Onboarding
- Quick setup → immediate first win (starter brief, zero integrations)
- Soul interview moved to post-first-win (optional deepening, not gatekeeping)
- Demo brief works with name + timezone only

### Content
- 7 starter personas: content-writer, researcher, ops-runner, meeting-prep, evidence-collector, weekly-reviewer, personal-assistant
- 3 sample cron skills: weekly-content, inbox-sweep, competitor-scan
- Auto-deploy on first run (copies from assets/ if roster is empty)

---

## 2026-03-04 — v1.6.0-ux: Nav Simplification, Starter Brief, Ally Sync Fix

### Nav Simplification (6-Tab Baseline)
- Sidebar now shows 6 core tabs: Chat, Today, Work, Second Brain, Dashboards, Config
- Power-user tabs (Skills, Trust, Guardrails, etc.) moved behind collapsible "Mission Control" section
- Mission Control expanded state persisted in localStorage
- All tabs still accessible via URL/programmatic navigation — only hidden from default nav

### Demo Brief (Zero-Integration First Win)
- New starter brief generated when Obsidian vault isn't configured
- Shows: greeting with user name, today's tasks, queue status, rotating GodMode tips
- Nudges user to connect calendar and X intelligence for richer briefs
- `quickSetup` now jumps directly to Phase 5 (First Win) instead of Phase 2
- Phase 5 onboarding prompt updated to reference starter brief and `dailyBrief.generate`

### Ally Chat Sync Fix
- Fixed ally panel diverging from Chat tab: `chat.final` now always updates `allyMessages` even when Chat tab is active full-screen
- Error/abort messages now sync to `allyMessages` regardless of view state
- Panel already reloads full history on open, scroll-to-bottom on new messages

### Trust + Dashboard Prompts
- Added dashboard-building instruction to ally persona ("How You Work" section)
- Awareness snapshot now includes Trust section when `trust-tracker.json` exists (2 lines max)

### Files Changed
- `ui/src/ui/navigation.ts` — TAB_GROUPS + POWER_USER_GROUPS
- `ui/src/ui/app-render.ts` — Mission Control collapsible section
- `ui/src/ui/storage.ts` — default navGroupsCollapsed includes Mission Control
- `src/methods/brief-generator.ts` — starter brief generator + fallback in RPC handler
- `src/methods/onboarding.ts` — quickSetup jumps to phase 5
- `src/hooks/onboarding-context.ts` — Phase 5 prompt references starter brief
- `ui/src/ui/app-gateway.ts` — ally sync fix for chat.final events
- `src/hooks/agent-persona.ts` — dashboard-building instruction
- `src/lib/awareness-snapshot.ts` — trust tracker summary

---

## 2026-03-05 — v1.6.0: Core Identity & Memory Audit

### What
9-phase audit of every file that defines WHO the ally is, HOW it remembers, and WHAT it proactively does. Quality improvements only — zero new services, zero new dependencies.

### Changes

**Ally Identity (`src/hooks/agent-persona.ts`):**
- Rewrote 27-line identity from scratch (23 lines, within budget)
- Changed "executive assistant, chief of staff" → "deeply contextual coworker, proactive partner"
- Added 8 specific behavior directives: investigate before asking, solve don't list, parse brain-dumps, scope before delegating, be proactive, remember everything, be honest and direct, treat time as sacred
- Added capabilities summary: tasks, goals, queue, trust tracking, skills, dashboards, vault

**Awareness Snapshot (`src/lib/awareness-snapshot.ts`):**
- Added day of week to header (enables weekly rhythm awareness — Monday planning, Friday review)
- Added active goals with progress percentages
- Added trust scores summary (workflow scores from trust-tracker.json)
- Added proactive nudge lines: "Surface overdue tasks early" when overdue > 0, "Prompt user to review queue items" when review > 0

**Onboarding Prompts (`src/hooks/onboarding-context.ts`):**
- Phase 2 (Second Brain): Rewrote from dry "help set up memory system" to warm copy that communicates the value — "nothing gets lost", "never repeat yourself", "wow moment"
- Phase 3 (Workflow Audit): Removed killed "ClawHub" reference, updated to "GodMode capabilities"

**Skills:**
- `weekly-coaching`: Removed killed wheel-of-life.json and snapshots/ references, replaced with goals + trust scores + daily briefs as data sources
- `evening-processing`: Removed killed snapshots/ reference, aligned with actual vault-capture pipeline, changed delivery to "none" (silent background)

### Files Changed
- `src/hooks/agent-persona.ts` — identity rewrite
- `src/lib/awareness-snapshot.ts` — goals, trust, day-of-week, proactive nudges
- `src/hooks/onboarding-context.ts` — Phase 2 + Phase 3 prompt improvements
- `skills/weekly-coaching/SKILL.md` — removed dead references
- `skills/evening-processing/SKILL.md` — removed dead references

---

## 2026-03-05 — Queue Pipeline & Integration Health Audit

### What
End-to-end audit of the entire agent delegation pipeline and integration data pipelines. Traced every path from task creation to output delivery. Found and fixed 10 bugs across 7 files.

### Critical Bugs Fixed

1. **Autonomy gating blocked ALL queue items** — `getAutonomyLevel()` returned `"approval"` for any persona/type not explicitly tracked as a trust workflow. Since trust workflows are user-defined and rarely match queue item types, this effectively prevented all queue processing. **Fix:** Untracked workflows now default to `"full"` autonomy (opt-in tracking, not opt-out blocking).

2. **No agent process timeout** — Spawned agent CLIs could run forever with no kill timer. **Fix:** Added 30-minute timeout that kills the process group (SIGTERM → SIGKILL fallback).

3. **Double activeCount decrement** — `handleItemCompleted` decremented activeCount, then called `handleItemFailed` which decremented again, allowing extra concurrent agents beyond the limit. **Fix:** Added `skipDecrement` parameter to prevent double-counting.

4. **"disabled" autonomy level not checked** — Trust scores below 5 should block agents but the queue processor only checked for "approval". **Fix:** Now checks "disabled" and blocks with a clear log message.

5. **Retry button broken in Mission Control** — UI called `queue.update` with `status: "pending"` but that handler rejects anything other than "review"/"failed". **Fix:** Added dedicated `queue.retry` RPC handler that properly resets items.

### High-Priority Fixes

6. **No evidence verification gates** — Added `checkEvidence()` function that validates output per task type: coding (PR links/code blocks), research (URLs), ops (command output), review (file paths + verdicts), analysis (data + conclusions). Failed evidence triggers one retry with guidance, then marks for review with warning.

7. **Done items never expired** — Queue grew unbounded. **Fix:** Done items now expire after 30 days. Stale processing items (no live PID, >2hrs old) auto-reset to pending.

8. **Trust tracker had no file locking** — Concurrent trust operations (queue auto-rating + user rating) could corrupt `trust-tracker.json`. **Fix:** All mutating operations now use `withFileLock` via a new `updateState()` helper.

9. **Brief generator missing response.ok checks** — Three Oura API calls and the weather API call parsed `.json()` without checking HTTP status. 401/429/500 responses caused cryptic parse errors instead of clear diagnostics. **Fix:** Added `.ok` checks with descriptive error messages on all four endpoints.

10. **Fathom webhook race condition** — Concurrent webhook deliveries could lose data (last-write-wins on `meeting-queue.json`). **Fix:** Added `updateMeetingQueue()` with `withFileLock` for all mutating operations (webhook ingest, manual add, status update, secret storage).

### Files Changed
- `src/services/queue-processor.ts` — autonomy gating fix, agent timeout, double decrement fix, evidence gates, done item expiry, stale processing recovery
- `src/methods/trust-tracker.ts` — autonomy level fix (untracked=full), file locking on all mutations
- `src/methods/queue.ts` — new `queue.retry` RPC handler
- `src/methods/fathom-webhook.ts` — file locking on all meeting queue mutations
- `src/methods/brief-generator.ts` — response.ok checks on Oura (3 endpoints) and weather
- `ui/src/ui/controllers/mission-control.ts` — use `queue.retry` instead of broken `queue.update`

---

## 2026-03-05 — v1.6.0: Team Workspaces & Templates

### What
Team workspace infrastructure audit and hardening. Added workspace templates for instant project setup, fixed feed safety, and integrated workspace awareness into the ally's context.

### Workspace Templates
- Created `assets/workspace-templates/` with 3 templates: `godmode-dev`, `trp`, `patient-autopilot`
- **godmode-dev**: Code review + build verification skills, architecture conventions memory
- **trp**: General project collaboration template
- **patient-autopilot**: General project collaboration template
- Templates include memory/README.md starter files and optional skills

### New RPC Methods
- `workspace.setupFromTemplate` — create a team workspace from a bundled template (copies template memory, skills, and config into a new workspace with git init)
- `workspace.listTemplates` — list all available workspace templates with metadata

### Bug Fixes
- **team-feed.ts**: Added 5MB file size protection to `readFeed()` — large feeds now read only the tail instead of OOM'ing. Uses file handle seek for efficient tail reading.
- **awareness-snapshot.ts**: Team workspaces now appear in the awareness snapshot — ally sees which team workspaces are active and their sync status.

### Documentation
- Created `docs/TEAM-SETUP.md` — full team setup guide for admins and members, covering workspace creation, joining, syncing, agent communication, and curation.

### Files Changed
- `src/methods/team-workspace.ts` — added `setupFromTemplate` and `listTemplates` handlers
- `src/lib/team-feed.ts` — readFeed size protection (MAX_FEED_READ_BYTES)
- `src/lib/awareness-snapshot.ts` — team workspace summary in snapshot
- `assets/workspace-templates/` — 3 template configs + content directories
- `docs/TEAM-SETUP.md` — team setup documentation

---

## 2026-03-04 — v1.4.0: Lean Audit + Adversarial Bug Sweep + Install Hardening

### What
Massive lean audit across the entire codebase, followed by two rounds of 3-phase adversarial bug-finding (codebase-wide + install-specific).

### Lean Audit (Phase 1-6)
- **32 files deleted**, 22 rewritten — killed developer tooling, over-engineered features, competing memory systems
- Context injection: ~1,500 lines/turn → ~150 lines/turn (90% reduction)
- Memory systems: 6 → 2 (Obsidian vault + awareness snapshot)
- Safety gates: 10 → 4 (loopBreaker, promptShield, outputShield, contextPressure)
- New `awareness-snapshot.ts` replaces CONSCIOUSNESS.md + WORKING.md dumps
- New lean ally identity in `agent-persona.ts` (30 lines vs 66-line Persistence Protocol)
- Identity digest + meeting prep injected into every session

### Adversarial Bug Sweep (codebase)
13 real bugs found and fixed via 3-agent adversarial process:
- **CRITICAL**: Fathom stuck meeting recovery (infinite loop), webhook signature bypass, output shield stale comment
- **MEDIUM**: .env parsers don't strip quotes (4 locations), captureStatus ghost fields from killed pipelines
- **LOW**: require() in ESM, killed dashboard widget data reads

### Onboarding Lean Cleanup
- Removed focus-pulse and coding-orchestrator references from onboarding recommendations
- Removed focusPulse/coding config from openclaw.plugin.json
- Cleaned up dashboard widgets for killed modules (focus-pulse, coding-status, intel-highlights, streak-stats)
- All onboarding wizard RPCs ungated (were incorrectly behind license gate — blocked new user setup)

### Install Hardening (adversarial process)
- **CRITICAL FIX**: auth-public-key.pem now included in npm package (`dist/**/*.pem` in files array)
- **CRITICAL FIX**: auth-client.ts uses `homedir()` instead of `process.env.HOME` (Windows compat)
- **CRITICAL FIX**: All onboarding RPCs ungated for pre-license users
- **CRITICAL FIX**: Windows installer now removes + reinstalls (was skipping updates)
- macOS install: .zshrc prioritized in install_node_direct() (macOS default shell)
- Linux install: xz package name mapped per package manager (xz-utils → xz for non-Debian)
- Install scripts synced: scripts/ ↔ site/

### Files Changed (key)
- `index.ts` — ungated onboarding RPCs, lean hooks
- `src/lib/auth-client.ts` — homedir() fix
- `src/lib/vault-paths.ts` — ESM import fix
- `src/lib/awareness-snapshot.ts` — identity digest, meeting prep
- `src/services/fathom-processor.ts` — stuck meeting recovery fix
- `src/methods/fathom-webhook.ts` — signature enforcement + quote stripping
- `src/methods/brief-generator.ts` — quote stripping
- `src/services/x-client.ts` — quote stripping
- `src/hooks/safety-gates.ts` — stale comment fix
- `src/methods/second-brain.ts` — ghost fields cleanup
- `src/methods/dashboards.ts` — killed widget cleanup
- `src/methods/onboarding*.ts` — killed feature references removed
- `src/hooks/onboarding-context.ts` — focus-pulse demo removed
- `src/methods/options.ts` — focusPulse default removed
- `openclaw.plugin.json` — killed config sections removed
- `package.json` — v1.4.0, PEM included
- `scripts/install.sh` — .zshrc + xz package fix
- `scripts/install.ps1` — update logic fix
- `ui/src/ui/controllers/focus-pulse.ts` — stubbed
- `ui/src/ui/app-render.ts` — focus pulse widget removed
- `ui/src/ui/app-gateway.ts` — focusPulse:update handler removed

---

## 2026-03-04 — Lean Audit (v1.2 architecture overhaul)

### Why
GodMode had grown to 27 services, 47 method files, 10 safety gates, and ~1,500 lines of context injection per turn — most serving developer use cases, not the target customer (non-technical entrepreneurs). The system prompt drowned the AI in stale context. Six competing memory systems caused confusion. Result: whack-a-mole bugs, confused AI responses, and a product that couldn't ship to clients.

### What Changed

**32 files deleted, 22 files rewritten.** Full archive preserved at `git tag v1.1.0-pre-lean-audit`.

#### Phase 1: Dead Code Removal
- **12 services deleted:** focus-pulse-heartbeat, rescuetime-fetcher, ide-activity-watcher, coding-orchestrator, swarm-pipeline, coding-notification, session-coordinator, claude-code-sync, session-archiver, org-sweep, cron-guard, scout + observer + advisor (consolidated into proactive-intel)
- **13 methods deleted:** coding-tasks, session-coordination, session-archive, session-search, rescuetime, life-dashboards, lifetracks, clawhub, security-audit, subagent-runs, focus-pulse, focus-pulse-scorer, brief-notes (merged into daily-brief), corrections
- **3 libs deleted:** session-registry, coding-task-state, injection-fingerprints
- **1 tool deleted:** coding-task
- **index.ts:** Removed 478 lines — all killed imports, handler registrations, service startups, and hook wiring

#### Phase 2: Consolidation
- **Safety gates 10→4:** Kept loopBreaker, promptShield, outputShield, contextPressure. Killed grepBlocker, sessionHygiene, exhaustiveSearch, selfServiceGate, persistenceGate, searchRetryGate.
- **Proactive intel 4→1:** Killed scout, observer, advisor services. Simplified proactive-intel service as single lean module.

#### Phase 3: Context Injection Redesign (~1,500→~150 lines/turn)
- **New `src/lib/awareness-snapshot.ts`:** ~50-line ephemeral snapshot (schedule, priorities, task counts, recent decisions). Replaces raw CONSCIOUSNESS.md + WORKING.md dumps.
- **Rewrote `src/hooks/agent-persona.ts`:** 66-line Persistence Protocol → 30-line lean ally identity.
- **Rewrote `before_prompt_build` in index.ts:** Conditional injection — only loads what's needed per turn.

#### Phase 4: Memory Consolidation (6→2 systems)
- **Consciousness heartbeat (685→234 lines):** Replaced regenerateConsciousness + regenerateWorking + appendRosterContext with single `generateSnapshot()` call. Removed external script dependency.
- **Vault-capture (915→282 lines):** 5→2 pipelines. Kept Sessions→Daily and Queue Outputs→Inbox. Killed Scout→Vault, Inbox→PARA, Progressive Summarization.
- **consciousness.ts (194→88 lines):** Both flush and read use awareness snapshot.
- **second-brain.ts:** sync handler, aiPacket handler, and vault capture status all updated to use awareness snapshot.
- **queue-processor.ts:** Reads awareness snapshot instead of CONSCIOUSNESS.md.

#### Phase 5: UI Cleanup
- **12 UI files deleted:** Views + controllers for wheel-of-life, vision-board, lifetracks, proactive-intel, people, clawhub (originals).
- **navigation.ts:** Removed killed tabs from type, paths, and all switch statements.
- **app.ts:** Removed ~30 @state() properties and ~150 lines of handler methods.
- **app-render.ts, app-settings.ts, app-view-state.ts:** Cleaned all killed feature references.
- **clawhub stubbed:** Skills view depends on clawhub — created minimal stubs to keep skills working.

#### Phase 6: Documentation
- **MEMORY.md:** Rewrote from 160-line accumulated history to ~100-line lean routing map.
- **CLAUDE.md:** Removed Session Coordination section (services killed), updated architecture notes with lean summary.

### Results
| Metric | Before | After | Change |
|---|---|---|---|
| Services | 27 | ~15 | -44% |
| Method files | 47 | ~35 | -26% |
| Safety gates | 10 | 4 | -60% |
| Context per turn | ~1,500 lines | ~150 lines | -90% |
| Memory systems | 6 | 2 | -67% |
| Vault-capture pipelines | 5 | 2 | -60% |

### Memory Architecture (after)
- **Obsidian Vault (ClawVault)** = long-term brain. All permanent memory.
- **Awareness Snapshot** = ephemeral ~50-line state. Cross-session awareness. Updated every 15 min.

---

## 2026-03-04 — Deep Audit + Architecture Fix (post mega push)

### Why
First round of testing revealed the output shield wasn't catching system context leaks — the persistence protocol and consciousness dumps were echoing verbatim into chat. Root cause: hardcoded fingerprint markers were checking for meta-terms ("loop breaker", "gate fired") instead of the actual persona prose the LLM echoes. Additionally, the audit found 5 bugs missed in the original push.

### Architecture Change: Dynamic Leak Detection
- **New module:** `src/lib/injection-fingerprints.ts` — captures the actual injected system context at injection time, pre-computes 40-char n-grams with 20-char stride for efficient substring matching
- **`index.ts`**: Calls `captureInjectedContext(sessionKey, joined)` in `before_prompt_build` for both main and support paths
- **`safety-gates.ts`**: Replaced 4 hardcoded fingerprint checks (`godmode_context_echo`, `system_context_leak`, `persistence_protocol_leak`, `godmode_internals_leak`) with single `dynamic_context_leak` that uses `countContextOverlap()` — self-maintaining, no marker updates needed when persona changes
- **UI stripping:** `app-gateway.ts` and `app.ts` still have fallback fingerprints for client-side defense, plus multi-signal detection (2+ matches = nuke entire message)

### Bugs Fixed (found by audit)
- **C5 BROKEN:** `auth-client.ts` — `writeFileSync` now uses `{ mode: 0o600 }`, `mkdirSync` uses `{ mode: 0o700 }` (was writing world-readable tokens)
- **C1 PARTIAL:** `onboarding-setup.ts` — `renderInlineMarkdown()` now blocks `javascript:`, `data:`, `vbscript:` URL schemes
- **C4 PARTIAL:** `obsidian-sync.ts` and `x-browser.ts` — added `.on("error", ...)` handlers to uncovered spawn calls
- **CSS:** `tool-cards.css` — added `.chat-tool-card:has(.chat-tool-card__expandable[open])` to remove max-height when details expanded
- **Fathom race:** `fathom-processor.ts` — added in-process mutex (`withQueueLock`) to prevent concurrent queue reads/writes, plus stuck "processing" recovery on startup
- **Fathom decisions:** Added "send", "review", "prepare", "schedule", "update", "follow" to decision-detecting verb pattern

### Test Suite Added
- `tests/injection-fingerprints.test.ts` — 13 tests for dynamic leak detection (captures, false positive resistance, session isolation)
- `tests/security-hardening.test.ts` — 31 tests verifying all security fixes, service cleanup, agent persona, brief notes protection
- **44 tests total, all passing**

### Integration Tests Passed
- Fathom webhook: queued and processed (status: "processed")
- Task creation: 2 tasks with correct due dates ("by Friday" → 2026-03-06, "tomorrow" → 2026-03-05)
- Vault filing: daily note + standalone meeting note with YAML frontmatter
- Email draft: created for external attendee
- Deduplication: duplicate webhook correctly rejected
- CONSCIOUSNESS.md: freshly regenerated on gateway start
- TypeCheck: clean, Build: clean, No forbidden imports

### Files Modified
`src/lib/injection-fingerprints.ts` (new), `src/lib/auth-client.ts`, `src/hooks/safety-gates.ts`, `src/services/fathom-processor.ts`, `src/services/obsidian-sync.ts`, `src/services/x-browser.ts`, `ui/src/ui/app.ts`, `ui/src/ui/app-gateway.ts`, `ui/src/ui/views/onboarding-setup.ts`, `ui/src/styles/chat/tool-cards.css`, `index.ts`, `vitest.config.ts` (new), `tests/` (new)

---

## 2026-03-04 — Fathom Post-Meeting Processor

### Why
The Fathom webhook receiver was already queuing meetings, but nothing processed them. Meetings sat in `meeting-queue.json` unprocessed. Now the full post-meeting pipeline runs automatically.

### What Changed
- **New service:** `src/services/fathom-processor.ts` — 6-step pipeline per meeting:
  1. Create tasks from action items (smart date parsing: ISO, "tomorrow", "next week", weekday names)
  2. File to vault (daily note + standalone meeting note with YAML frontmatter + collapsed transcript)
  3. Draft follow-up email to external attendees
  4. Update WORKING.md with decisions
  5. Broadcast notification event
  6. Mark as processed
- **`src/methods/fathom-webhook.ts`**: Auto-triggers processing after webhook receipt + manual ingest. Added `fathom.processNext` RPC for manual trigger.
- **`index.ts`**: Service registered in `gateway_start` with 5-minute polling interval + `serviceCleanup` pattern.
- Failed meetings get `status: "failed"` to prevent retry loops.

### How to Test
1. **Webhook test:** `curl -X POST http://localhost:3131/fathom-webhook -H "Content-Type: application/json" -d '{"title":"Test Meeting","attendees":["alice@example.com"],"action_items":["Follow up on proposal"],"transcript":"..."}'`
2. **Manual RPC:** Call `fathom.processNext` via gateway
3. **Single meeting:** Call `fathom.processById` with a meeting ID from `~/godmode/data/meeting-queue.json`
4. **Verify:** Check `~/godmode/data/tasks.json` for new tasks, `~/Documents/VAULT/01-Daily/` for meeting notes

### Files Modified
`src/services/fathom-processor.ts` (new), `src/methods/fathom-webhook.ts`, `index.ts`

---

## 2026-03-04 — Mega Stability Push (23 fixes across 5 parallel streams)

### Why
GodMode had accumulated ~23 bugs across daily brief, side chat, auto-titling, memory system, security, and UI. Core product experience was degraded — daily rhythm loop broken, Prosper side chat unresponsive, memory stale, document tiles non-functional. This push stabilizes everything for team rollout.

### What Changed

**Stream A — Daily Brief + Memory + Prosper Soul (7 fixes):**
- `brief-generator.ts`: Notes section extraction hardened — never silently loses user content
- `brief-generator.ts`: Pending tasks now wired into LLM prompt as first-class data source
- `brief-generator.ts`: Evening check-in / Tomorrow Handoff elevated to PRIMARY source for Win The Day
- `consciousness-heartbeat.ts`: Once-per-day brief regeneration guard (flag file prevents overwrites)
- `consciousness-heartbeat.ts`: Built `regenerateConsciousness()` and `regenerateWorking()` natively — no external script dependency
- `agent-persona.ts`: Persistence protocol rewritten (philosophy-based, not "try 5 things")
- `agent-persona.ts`: Prosper EA elite behavior embedded (architecture awareness, daily rhythm, context retrieval, task intelligence)

**Stream B — UI Chat Fixes (7 fixes):**
- `app.ts`: Side chat auto-scroll now waits for Lit `updateComplete` before scrolling
- `ally-chat.ts`: Singleton state bug fixed — `_lastMsgCount` moved to WeakMap per container
- `app-gateway.ts`: Real-time event sync triggers scroll on new ally messages
- `app.ts`: Message filtering narrowed + debug logging added
- `app-gateway.ts`: Auto-titling fingerprint stripping ported from message-extract.ts (catches tagless echoes)
- `grouped.css`: Tool execution details no longer truncated at 350px
- `chat.ts`: Filename truncation limit increased from 20 → 40 chars

**Stream C — Security Hardening (5 fixes):**
- `onboarding-setup.ts`: XSS via `.innerHTML` fixed — HTML-escape before markdown transforms
- `second-brain.ts`: `isSymlinkSafe()` added — symlink checks on all file operations
- `swarm-pipeline.ts`: `sanitizeForPrompt()` strips XML tags and injection patterns before agent prompts
- `auth-client.ts`: Token file written with `0o600`, directory with `0o700`

**Stream D — Gateway Lifecycle (2 fixes):**
- `index.ts`: 11 services registered with named cleanup functions on `gateway_stop` — prevents duplicate heartbeats
- `index.ts` + `safety-gates.ts`: System-context wrapper upgraded to "CRITICAL INSTRUCTION", 3 new output leak fingerprints that BLOCK leaked content

**Stream F — Document Tiles (2 fixes):**
- `files.ts`: Implemented missing `files.read` RPC (with `isAllowedPath()` security) — "Open" button now works
- `app.ts`: Drive button shows helpful setup message instead of generic error

### Files Modified (14 source + 5 UI)
`index.ts`, `src/hooks/agent-persona.ts`, `src/hooks/safety-gates.ts`, `src/methods/brief-generator.ts`, `src/methods/files.ts`, `src/methods/second-brain.ts`, `src/services/consciousness-heartbeat.ts`, `src/services/swarm-pipeline.ts`, `src/lib/auth-client.ts`, `ui/src/ui/app.ts`, `ui/src/ui/app-gateway.ts`, `ui/src/ui/views/ally-chat.ts`, `ui/src/ui/views/chat.ts`, `ui/src/ui/views/onboarding-setup.ts`, `ui/src/styles/chat/grouped.css`

---

## 2026-03-04 — Website Separated + Vercel Consolidated

### Why
Multiple Claude Code sessions created 5+ duplicate Vercel projects named `lifeongodmode` across different scopes, causing repeated domain/deployment confusion. Fixed permanently.

### What Changed
- **Website repo created:** `MrCalebH/godmode-website` on GitHub — canonical source for lifeongodmode.com
- **All site content pushed** to the website repo (landing page, auth pages, API endpoints, audit reports, proposals, etc.)
- **GitHub connected** to Vercel project for auto-deploy on push to `main`
- **Domain verified:** `lifeongodmode.com` and `www.lifeongodmode.com` both verified on `patient-autopilot/lifeongodmode`
- **Original site restored** — was accidentally replaced with a Claude-generated landing page
- **5 stale Vercel projects deleted:** `godmode-website-v2`, `lifeonogodmode-vercel`, `site`, `godmode-ui`, `godmode`
- **API helpers renamed** `api/lib/` → `api/_lib/` (underscore = not counted as serverless functions)
- **All stale reference files updated** in `~/godmode/memory/`, `~/godmode/research/`, and VAULT

### The Rule Going Forward
| Repo | Purpose | Deploys to |
|---|---|---|
| `MrCalebH/godmode-website` | lifeongodmode.com website + API | Vercel → `lifeongodmode.com` |
| `godmode-plugin` | GodMode OpenClaw plugin | npm `@godmode-team/godmode` |

**One Vercel project:** `patient-autopilot/lifeongodmode` (Pro plan, ID `prj_DoSyx6km5nSCAo3wOIQyQkXFvbiu`). No others.

---

## 2026-03-04 — Today Page Tabbed Layout Redesign

### Why
Today page was too chaotic — agent results pushed the daily brief below the fold, multiple independent scrolling areas competed for attention, and it was hard to find the brief.

### What Changed
- **Tabbed layout**: Replaced the two-column grid with 3 tabs: **Brief** (default), **Command Center**, and **Agent Log**
  - Brief tab: Full-width daily brief editor, clean and distraction-free
  - Command Center tab: Agent results (with review badge count) + full task list
  - Agent Log tab: Full-width agent log (preserved from before)
- **Tab bar in toolbar**: Replaced the old "My Day / Agent Log" segmented toggle with underline-style tabs. Command Center tab shows a red badge when there are items needing review.
- **Date auto-advance**: Fixed issue where the Today page would show yesterday's date if the app was left open overnight. Now auto-advances on component mount and WS reconnect.
- **Files modified**: `ui/src/ui/views/my-day.ts`, `ui/src/styles/my-day.css`, `ui/src/ui/app.ts`, `ui/src/ui/app-render.ts`, `ui/src/ui/app-view-state.ts`, `ui/src/ui/app-gateway.ts`, `ui/src/ui/controllers/my-day.ts`

---

## 2026-03-03 — Account Auth + Stripe Payments System

### Why
Replace license key system with real account-based auth. Users sign up, pay via Stripe, and authenticate via OAuth device flow (works on headless VPS too).

### What Was Built (branch: `feat/account-auth-payments`)

**9 Vercel API endpoints** (`site/api/`):
- Auth: device flow, token polling, login, register, refresh, /me
- Payments: Stripe checkout ($297/mo), webhook handler, customer portal
- Shared helpers: Redis client, JWT (RS256), CORS, scrypt password hashing

**3 web pages** (`site/login/`, `site/pricing/`, `site/account/`):
- GodMode light theme (Space Grotesk, red accent, white cards)
- Login: device code + email/password, registration flow
- Pricing: single $297/mo plan with Stripe checkout
- Account: subscription management, Stripe portal access

**Plugin integration**:
- `src/lib/auth-client.ts` — offline JWT validation, device flow, token refresh
- `src/methods/auth.ts` — 5 RPCs (auth.status, login, loginPoll, logout, account)
- `index.ts` — license gate updated: JWT primary, GM-DEV-* backward compat
- Install scripts: account login replaces license key step

### Infrastructure
- **Upstash Redis** connected to Vercel project (REDIS_URL set)
- **Stripe** product/price created (test mode): `prod_U5GQlJ6WBHCAcO` / `price_1T75u8EtK2soZQjqiZ11zEU7`
- **RSA keypair** generated, env vars set on Vercel (all environments)
- **Deployed** to `patient-autopilot/lifeongodmode` (Pro plan) at `lifeongodmode-iota.vercel.app`
- API helpers moved to `site/api/_lib/` (underscore prefix = not counted as serverless functions)
- Removed `api/v1/license/validate-worker.js` (Cloudflare Workers variant, not needed on Vercel)

### Vercel Project Consolidation (2026-03-03)
- **RESOLVED**: There were multiple `lifeongodmode` projects across Vercel scopes causing repeated confusion.
- Consolidated to **`patient-autopilot/lifeongodmode`** (Pro plan, project ID `prj_DoSyx6km5nSCAo3wOIQyQkXFvbiu`).
- Deleted duplicate `lifeongodmode` project from `mrcalebhs-projects` (hobby plan, had 12 function limit).
- Removed `lifeongodmode.com` domain from stale `godmode-website-v2` project. Added to correct project.
- Removed `www.lifeongodmode.com` from stale `lifeonogodmode-vercel` project. Added to correct project with 308 redirect.
- Domain pending TXT verification — update `_vercel.lifeongodmode.com` TXT at GoDaddy.

### Still Needed
- Update `_vercel.lifeongodmode.com` TXT record at GoDaddy for domain verification
- `STRIPE_WEBHOOK_SECRET` not set (needs webhook URL in Stripe dashboard)
- Landing page CTAs still point to /setup instead of /pricing
- Switch Stripe test → live keys when ready for real payments

### Full reference
See `VAULT/02-Projects/GodMode/auth-payments-system.md` for complete details.

---

## 2026-03-02 — Self-Healing Resilience + Session Coordination + Auto-Compat CI

### Why
OpenClaw 2026.3.1 broke GodMode in 4 ways with zero deprecation warnings. Parallel Claude Code sessions created 12 stashes and 27 branches of scattered work. These systems prevent both problems permanently.

### Self-Healing Host Resilience (3 new files)
- **`src/lib/host-context.ts`** — Server-side host detection. On every `gateway_start`, probes the host API, caches results to `~/godmode/data/host-compat.json`, and compares against previous scan to log diffs. Provides `extractSessionKey()`, `safeBroadcast()`, `getHostVersion()`.
- **`ui/src/lib/safe-request.ts`** — Self-healing RPC wrapper. Wraps every UI gateway call with timeout, field alias resolution (`displayName→label`), METHOD_NOT_FOUND fallbacks (`sessions.autoTitle→sessions.patch`), and sessionStorage healing cache.
- **`ui/src/lib/host-compat.ts`** — UI-side capability detection. On WebSocket connect, probes critical RPCs, caches results, provides `hostPatchSession()`, `hostAutoTitle()`, `readSessionName()`.

### Session Coordination Layer (multi-session discipline)
- **`src/lib/session-registry.ts`** — Tracks active Claude Code sessions: branch, worktree, modified files, status. File-based with atomic writes.
- **`src/services/session-coordinator.ts`** — Enforces discipline: branch conflict detection, gateway restart locking (only one session at a time), file modification tracking, structured handoff summaries.
- **`src/methods/session-coordination.ts`** — 9 RPC handlers: `session.register`, `session.heartbeat`, `session.end`, `session.checkConflict`, `session.acquireGatewayLock`, `session.releaseGatewayLock`, `session.awareness`, `session.list`, `session.registry`.
- **`scripts/session-guard.sh`** — CLI tool for session management: register, heartbeat, end, status, check-branch. Reads registry directly.
- **`CLAUDE.md`** updated with Session Coordination rules: branch discipline, gateway restart safety, handoff protocol.

### OpenClaw Auto-Compat CI Pipeline
- **`.github/workflows/openclaw-compat.yml`** — Scheduled workflow (every 6 hours) checks npm for new OpenClaw versions. On detection: installs new version, runs typecheck + build, runs compat scan. If clean: auto-creates PR with version bump. If breaking: creates GitHub issue with detailed error report.
- **`scripts/openclaw-compat-scan.mjs`** — Analyzes build/typecheck logs for known breakage patterns (field renames, removed methods, type changes, import path changes, hook signature changes). Produces structured report.

### Other Changes
- CronGuard wired into `index.ts` (startup scan + runtime check in `message_received`)
- Corrections handlers wired into `index.ts`
- 2 unsafe broadcast casts replaced with `safeBroadcast()`
- 2 explicit sessionKey casts replaced with `extractSessionKey()`
- Gateway now registers 213 methods (up from 204)

---

## 2026-03-01 — v1.1.0 Published to npm + CI/CD

### What
- **v1.1.0 published to npm** — `@godmode-team/godmode@1.1.0` is live. Team can install now.
- Version bumped in both `package.json` and `openclaw.plugin.json`.
- **GitHub Actions workflow** added at `.github/workflows/publish.yml` — auto-publishes on version tags (`v*`).
- Future releases: `git tag v1.2.0 && git push --tags` → automatic build + npm publish.
- Requires `NPM_TOKEN` repo secret (pending setup).

### Team Install
```bash
openclaw plugin install @godmode-team/godmode
openclaw gateway restart
```
License key: `GM-DEV-TEAM-2026`

---

## 2026-03-01 — Production Hardening & Beta Pre-Flight

### Why
Major overnight audit, security hardening, and beta readiness pass. Every file in the codebase was audited. All features are wired, all security issues fixed, and onboarding is customer-ready.

### Security Fixes
- **isAllowedPath hardened (CRITICAL):** Now uses `path.resolve()` before checking, with directory-boundary separator check to prevent prefix collisions and path traversal attacks. Previously used naive `startsWith`.
- **Dashboard ID path traversal fixed (CRITICAL):** All dashboard IDs are now sanitized through `sanitizeSlug()` — explicit `id` params can no longer contain `../` to escape the dashboards directory.
- **Queue file mismatch fixed:** Dashboard widget was reading `queue-state.json` but actual queue data lives in `queue.json`. Widget now reads the correct file.

### Code Quality
- Removed unused imports: `basename`/`extname`/`createHash` from vault-capture.ts, `homedir` from support.ts.
- Removed dead `shortHash()` function from vault-capture.ts.
- Replaced duplicate `GODMODE_ROOT` definition in swarm-pipeline.ts with canonical import from data-paths.js.
- Replaced `require("node:os")` CommonJS calls in dashboards.ts with ESM `homedir` import.
- Fixed hardcoded "CT" timezone label in agent-log.ts — now uses `Intl.DateTimeFormat` with user's configured timezone.
- Added JSDoc comments to `processItem`/`processAllItems` stubs in queue.ts explaining they're intentional pass-throughs.

### Onboarding & Support
- **Support chat on setup page:** Added "Need help?" banner with support chat button to both the Quick Start form and the setup checklist. Users stuck during onboarding can immediately chat with the AI support agent.
- **Setup view** now accepts `onOpenSupportChat` prop, wired through to the existing support session system.
- CSS for setup help banner added to setup.css.

### Documentation
- Team onboarding guide written: `VAULT/99-System/team-onboarding-guide.md` — full migration instructions for Titus, Ashley, and future team members.
- Beta pre-flight checklist created: `VAULT/02-Projects/godmode-beta-preflight.md` — complete gap analysis including website, Stripe, license API, npm publishing.
- Support agent knowledge base updated with all new features.
- RECENT-CHANGES.md updated with comprehensive session summary.

### Wiring Audit Results (all clean)
- 34 method handler modules registered in index.ts
- 8 tools registered
- 6 hooks wired into lifecycle events
- 21 services started or consumed indirectly
- 0 orphaned modules, 0 dangling imports
- Only intentional exclusion: `lifetracks.ts` (deferred, documented)

---

## 2026-03-01 — Per-Dashboard Persistent Sessions

### Why
Dashboards needed persistent, dedicated chat sessions — same pattern as tasks. Each dashboard gets a real session that persists history, keeps context, and lives as a proper chat tab. Click "Open Session" on any dashboard to enter its dedicated session.

### What Changed

**Backend: `dashboards.openSession` RPC (`src/methods/dashboards.ts`):**
- New `sessionId` field on `DashboardManifest` — persisted in index.json and per-dashboard manifest.json
- `dashboards.openSession` handler: returns existing sessionId or generates new `agent:main:webchat-{uuid}` format
- Same pattern as `tasks.openSession` — session created on first click, reused thereafter

**Frontend: "Open Session" button (`ui/src/ui/views/dashboards.ts`):**
- Active dashboard header has "Open Session" button next to Refresh
- Shows "Working..." when the session is actively processing
- Click navigates to Chat tab with the dashboard's dedicated session (adds to open tabs, sets auto-title)

**Session Navigation (`ui/src/ui/app.ts`):**
- `handleDashboardOpenSession` — calls `dashboards.openSession` RPC, navigates to chat tab
- Seeds new sessions with dashboard context prompt (title, id, widgets) so agent knows what to edit
- Follows exact same pattern as `handleMissionControlOpenTaskSession` / `onStartTask`

### Files Modified
- `src/methods/dashboards.ts` — `sessionId` on manifest, `dashboards.openSession` RPC
- `ui/src/ui/controllers/dashboards.ts` — `sessionId` on frontend type
- `ui/src/ui/app.ts` — `handleDashboardOpenSession` handler
- `ui/src/ui/app-view-state.ts` — handler type
- `ui/src/ui/app-render.ts` — wire `onOpenSession` + `isWorking` props
- `ui/src/ui/views/dashboards.ts` — "Open Session" button
- `ui/src/styles/dashboards.css` — session button styles

---

## 2026-03-01 — Dashboard Visual Quality Fix

### Why
Agent-generated dashboards had gorgeous HTML with `<style>` blocks, SVG charts, gradients, and animations — but `sanitizeHtmlFragment()` stripped `<style>` tags entirely. Dashboards rendered as unstyled plain HTML.

### What Changed

**Dashboard-Specific Sanitizer (`ui/src/ui/markdown.ts`):**
- New `sanitizeDashboardHtml()` with extract-before-sanitize architecture
- `extractDashboardParts()` pulls CSS from `<style>` blocks and body from full HTML documents
- DOMPurify sanitizes only HTML (style tag in FORBID_TAGS to prevent mangling)
- `scopeCss()` prefixes all selectors with `.dashboard-render` — prevents leaks
- Handles `@keyframes` (unscoped), `@media`/`@supports` (header pass-through), `@import` (stripped)
- SVG tags and attributes fully supported

**Two-Div Container Pattern (`ui/src/ui/views/dashboards.ts`, `dashboards.css`):**
- `.dashboards-content` — outer container with default background/color
- `.dashboard-render` — inner wrapper (no competing styles) where scoped CSS targets

**Widget CSS Upgrades (`ui/src/styles/dashboards.css`):**
- Gradient backgrounds, box-shadows, backdrop-blur on `.widget`
- Glow effects on `.stat`, gradient progress bars, pulsing status dots
- New utility classes: `.glow`, `.gradient-text`, `.card-accent`, `.bar-chart`, `.chart-container`

**Dashboard Builder Skill Rewrite (`skills/dashboard-builder/SKILL.md`):**
- SVG chart patterns (donut, gauge, sparkline, bar chart) with copy-paste templates
- Visual design principles (hierarchy, chart-everything, depth, motion)
- Full example "Command Center" dashboard with live data integration

---

## 2026-03-01 — Multi-Engine Routing + Parallel Processing + Adversarial Code Review

### Why
Inspired by a production agent swarm system that routes tasks to different AI engines (Codex for backend, Claude for frontend, Gemini for design) and runs adversarial multi-model code reviews on every PR. GodMode had the orchestration but was Claude-only with serial processing.

### What Changed

**Multi-Engine Support (`src/lib/resolve-claude-bin.ts` → multi-engine resolver):**
- New `AgentEngine` type: `"claude" | "codex" | "gemini"`
- `resolveAgentBin(engine)` — resolves any engine's CLI binary path
- `buildSpawnArgs(engine, prompt)` — builds engine-specific spawn arguments (Claude uses `-p`, Codex uses `exec`, Gemini uses `-p`)
- `isEngineAvailable(engine)` — checks if an engine's CLI is installed
- Per-engine env var support: `CLAUDE_BIN`, `CODEX_BIN`, `GEMINI_BIN`
- Backward-compatible: `resolveClaudeBin()` still works

**Agent Roster Engine Field (`src/lib/agent-roster.ts`):**
- New `engine` frontmatter field on persona files (e.g., `engine: codex`)
- Parsed from frontmatter, included in `PersonaProfile` and `listRoster()` output
- Consciousness heartbeat shows engine labels in roster section (e.g., `[codex]`)

**Queue Processor Multi-Engine Routing (`src/services/queue-processor.ts`):**
- Spawn resolution chain: explicit `item.engine` > persona `engine` > default `claude`
- Falls back to claude if requested engine isn't installed
- Passes `OPENAI_API_KEY` for Codex, `GEMINI_API_KEY` for Gemini to child processes
- Log messages include engine name: `Spawned Ops Runner agent [codex] for "task"`

**Parallel Processing (5x throughput):**
- `maxParallel` increased from 2 → 5
- New 10-minute fast polling loop (`startPolling()`) — recovers orphans + processes pending items
- Independent of hourly consciousness heartbeat (which still runs for other duties)
- Wired into gateway startup via `queueProcessor.startPolling()`

**Adversarial Multi-Model Code Review (`src/services/coding-orchestrator.ts`):**
- `runAdversarialReviews()` — runs all available engines (Codex, Claude, Gemini) in parallel on every PR
- Each reviewer gets the PR diff and a focused review prompt (bugs, security, edge cases — not style)
- Codex uses native `codex exec review` when available, falls back to prompt-based
- Reviews post as PR comments via `gh pr comment` so human sees them before merge
- Fire-and-forget: runs after PR creation, doesn't block the pipeline
- Responses flagging "CRITICAL:" are tracked as failed reviews (informational, not blocking)

**Queue State + Tools:**
- `QueueItem` has new optional `engine` field
- `queue_add` tool accepts `engine` param
- `queue.add` RPC passes through `engine`

### Starter Persona Updates
- `engineering/frontend-developer.md` — `engine: claude` (fast, good at UI)
- `operations/ops-runner.md` — `engine: codex` (thorough, good at multi-file ops)

---

## 2026-03-01 — Dashboard Visual Quality Fix

### Why
Agent-generated dashboards looked terrible — agents create HTML with `<style>` blocks, SVG charts, gradients, and animations, but `sanitizeHtmlFragment()` stripped `<style>` tags and all SVG elements. The result was unstyled plain text with no graphics.

### What Changed

**Dashboard-specific sanitizer (`ui/src/ui/markdown.ts`):**
- New `sanitizeDashboardHtml()` function with expanded allowlists
- Allows `<style>` tags — CSS is auto-scoped to `.dashboards-content` to prevent leaks
- Allows SVG elements: `svg`, `path`, `circle`, `rect`, `line`, `text`, `g`, `defs`, gradients, `animate`, etc.
- Allows SVG attributes: `viewBox`, `d`, `fill`, `stroke`, `stroke-dasharray`, transforms, etc.
- CSS scoping: walks CSS rules, prefixes selectors with `.dashboards-content`, preserves `@keyframes` unscoped, strips `@import`
- `<script>`, `<iframe>`, event handlers still stripped (security preserved)

**Dashboard view (`ui/src/ui/views/dashboards.ts`):**
- Switched from `sanitizeHtmlFragment()` to `sanitizeDashboardHtml()` for rendering dashboard content

**Widget CSS (`ui/src/styles/dashboards.css`):**
- `.widget` — gradient background, box-shadow, backdrop-blur, hover lift
- `.stat` — text-shadow glow effect using accent color
- `.progress-bar`/`.progress-fill` — gradient fill, glow shadow, smooth animation
- `.badge` variants — subtle glow shadows
- New utility classes: `.glow`, `.gradient-text`, `.card-accent` (with status variants), `.status-dot` (pulsing), `.chart-container`, `.bar-chart`/`.bar-row`/`.bar-fill` (horizontal bar charts), SVG chart defaults

**Dashboard builder skill (`skills/dashboard-builder/SKILL.md`):**
- Complete rewrite teaching agents visual design
- Removed "NO `<style>` tags" rule — replaced with full `<style>` support documentation
- Added SVG chart patterns: donut charts, gauge meters, sparklines, horizontal bar charts
- Added visual design principles: hierarchy, chart-everything, depth, color-with-purpose, motion
- Rich example dashboard: "Command Center" with SVG donut, bar charts, sparklines, animations
- Documented which tags/attrs are allowed vs stripped

---

## 2026-03-01 — Agent Roster System + Prosper as General

### Why
Inspired by the "agents as team roles" pattern (markdown persona files organized by department). GodMode already had the hard part (queue processor, swarm pipeline, mission control). This adds the persona layer so Prosper can manage a team of specialized agents.

### What Changed

**Agent Roster (`src/lib/agent-roster.ts` — new):**
- Loads persona markdown files from vault (`VAULT/99-System/agent-roster/`) or fallback (`~/godmode/memory/agent-roster/`)
- Frontmatter-driven: `name`, `taskTypes`, `swarmStages` fields route tasks to the right persona
- `resolvePersona(taskType, hint?)` — finds best persona for a queue item type
- `resolveSwarmPersona(stage)` — finds persona for swarm design/build/qc stages
- `formatHandoff(ctx)` — serializes agent-to-agent handoff context as markdown
- `listRoster()` — returns all personas for UI/RPC listing
- 30-second cache TTL, vault-first path resolution following existing patterns

**Queue State (`src/lib/queue-state.ts`):**
- Added `personaHint?: string` — slug targeting a specific roster persona
- Added `handoff?: { fromAgent, fromTaskId, summary, deliverable }` — structured context from predecessor agent

**Queue Processor (`src/services/queue-processor.ts`):**
- `buildPromptForItem()` resolves persona and injects `## Your Role` section with persona body
- Handoff context injected after task section when present
- `autoQueueOverdueTasks()` now auto-assigns `personaHint` from roster when queuing overdue tasks
- Log messages use resolved persona name instead of generic role name

**Swarm Pipeline (`src/services/swarm-pipeline.ts`):**
- `buildStagePrompt()` calls `resolveSwarmPersona(stage)` for each stage
- Persona body augments identity line for design, build, and qc stages
- Stage-specific instructions (safety rules, copy pipeline) remain unchanged

**Queue Add Tool (`src/tools/queue-add.ts`):**
- New params: `persona` (slug), `handoff_summary`, `handoff_deliverable`
- Enables agent-to-agent handoff: Agent A queues work for a specific persona with context

**Queue RPC (`src/methods/queue.ts`):**
- `queue.add` accepts `personaHint` passthrough
- New `queue.roster` RPC returns all loaded personas

**Mission Control (`ui/src/ui/controllers/mission-control.ts`):**
- `agentRoleName()` uses `personaHint` slug for display name when available
- Queue items show persona names (e.g., "Frontend Developer") instead of generic "Builder"

**Consciousness Heartbeat (`src/services/consciousness-heartbeat.ts`):**
- `appendRosterContext()` appends a "## Your Team (Agent Roster)" section to CONSCIOUSNESS.md on every hourly sync
- Groups personas by category with slugs and task type mappings
- Replaces any existing roster section to avoid duplication
- Runs before vault mirror so Prosper and all agents see the current team

**Starter Persona Templates:**
- `~/godmode/memory/agent-roster/_defaults/researcher.md` — research + url tasks
- `~/godmode/memory/agent-roster/engineering/frontend-developer.md` — coding + build stage
- `~/godmode/memory/agent-roster/operations/ops-runner.md` — ops + task

**Trust Tracker Integration:**
- `resolvePersona()` now prefers higher-trust personas when multiple match the same task type
- In-memory `_trustScores` cache in `agent-roster.ts` populated by consciousness heartbeat via `setTrustScores()`
- Consciousness heartbeat shows trust scores next to each persona in the roster section (e.g., "trust: 8/10 ^")
- Queue item approval → auto-rates persona at 8/10 via `submitTrustRating()` in `queue.ts`
- Queue item permanent failure → auto-rates persona at 3/10 in `queue-processor.ts`
- Mission control shows toast prompting user to rate in Trust Tracker after approving a queue item
- `submitTrustRating()` and `getTrustScore()` exported from `trust-tracker.ts` for programmatic use

### How It Works (End-to-End)
1. User defines team roles as `.md` files in vault or `~/godmode/memory/agent-roster/`
2. Consciousness heartbeat syncs roster to CONSCIOUSNESS.md → Prosper sees the team (with trust scores)
3. When Prosper sets the day and creates tasks, it knows which personas to assign
4. Tasks auto-queue with persona routing (type-based + roster match, trust-weighted)
5. Queue processor spawns agents with persona identity + task instructions + handoff context
6. Agents can hand off to other personas via `queue_add` with structured context
7. On completion: auto-rated (8 on approval, 3 on failure) + user prompted to rate
8. Trust scores feed back into persona resolution — best performers get routed more work
9. Mission control shows who's working with persona names
10. No roster files = graceful fallback to existing behavior (zero breakage)

---

## 2026-02-28 — Zero-Discipline Auto-Capture Pipelines + Obsidian Headless Sync

### Why
The vault-first data layer was complete but the vault didn't grow automatically. A zero-discipline second brain means the user never has to manually file, categorize, or organize anything. GodMode is the brain's autonomic nervous system — it captures, routes, distills, and syncs automatically.

### What Changed

**Vault Capture Service (`src/services/vault-capture.ts` — new):**
Five auto-capture pipelines that run on every consciousness heartbeat tick:
1. **Scout → Vault (Smart Routing)**: Findings route directly to the RIGHT folder — no inbox dumping. X Intelligence batched into daily digests (`VAULT/10-Discoveries/{date}-x-intelligence.md`), releases → individual `Discoveries/` notes, ClawHub skills → `Resources/Skills/`. Inbox reserved for user captures and agent outputs.
2. **Sessions → Daily Notes**: Claude Code session summaries appended to `VAULT/01-Daily/{date}.md` under `## Agent Sessions`. Agent-log markdown also mirrored to `VAULT/07-Agent-Log/`.
3. **Queue Outputs → Inbox**: Agent queue task outputs from `~/godmode/memory/inbox/` copied to vault inbox with `source: queue-agent` frontmatter for later PARA triage.
4. **Inbox → PARA Auto-Processing**: Mature inbox items (24h+ old) auto-categorized into PARA folders using frontmatter tags and content heuristics. Classification rules for research, people, companies, projects, knowledge, agent outputs. Gives user 24 hours to review before auto-filing.
5. **Progressive Summarization**: Conservative enhancement for substantial human-authored notes only:
   - Layer 1 (7+ days): TL;DR callout extracted from first substantial paragraph
   - Layer 2 (30+ days): Key Insights section from bold text
   - Layer 3 (60+ days): Connections section linking to related notes via keyword overlap
   - Skips auto-generated content (scout digests, agent outputs, releases, skills)
   - Only processes notes > 500 chars, max 5 per run

State tracked in `~/godmode/data/vault-capture-state.json` — idempotent, never re-processes.

**Obsidian Headless Sync (`src/services/obsidian-sync.ts` — new):**
Integration with `obsidian-headless` CLI (`ob`) for vault sync without desktop app:
- Auto-detects `ob` CLI availability on gateway start
- Supports three modes: `continuous` (watches for changes), `manual` (sync on demand), `disabled`
- Continuous mode auto-restarts on crash after 60s delay
- Config persisted in `~/godmode/data/obsidian-sync-config.json`
- Wired into gateway lifecycle (init on start, shutdown on stop)

**New RPC Handlers (added to `src/methods/second-brain.ts`):**
- `secondBrain.obsidianSyncStatus` — returns sync availability, running state, linked status
- `secondBrain.obsidianSyncTrigger` — manual one-time sync
- `secondBrain.obsidianSyncSetMode` — set continuous/manual/disabled
- `secondBrain.captureStatus` — pipeline status (counts, last run, active pipelines)
- `secondBrain.captureRunNow` — trigger all capture pipelines immediately

**Consciousness Heartbeat Wiring (`src/services/consciousness-heartbeat.ts`):**
- Added `runAllCapturePipelines()` call as fire-and-forget during hourly tick
- Broadcasts `secondBrain:capture` events with capture/processing counts

**Gateway Lifecycle (`index.ts`):**
- Obsidian Sync service initialized during `gateway_start` (after queue processor)
- Clean shutdown during `gateway_stop`

### Effect
The vault now grows automatically from five sources: scout intelligence, Claude Code sessions, agent queue outputs, consciousness sync, and research additions. Inbox items auto-route into the right PARA folder. Older notes get progressively enhanced with summaries and cross-links. With Obsidian headless sync enabled, all of this pushes to every device instantly — phone, tablet, any computer with Obsidian — even when the desktop app isn't open.

---

## 2026-02-28 — Second Brain → Obsidian Vault-First Architecture

### Why
The "Second Brain" label was cosmetic — data lived in flat `~/godmode/memory/` files with minimal Obsidian integration (only daily briefs touched the vault). A real second brain IS the Obsidian vault. GodMode should be the brain's autonomic nervous system — automatically capturing, organizing, and surfacing knowledge so the user never has to manually maintain it.

### What Changed

**Vault Path Foundation (`src/lib/vault-paths.ts` — new):**
- PARA-inspired folder constants: `00-Inbox` through `99-System`, plus `06-Brain`, `08-Identity`, `10-Discoveries`
- Vault-first path resolution with graceful fallback to `~/godmode/memory/`
- `resolveWithFallback()`, `resolveWritePath()` — try vault, fall back to local
- Specific resolvers for all data types: identity, people, companies, research, consciousness, knowledge
- `ensureVaultStructure()` — idempotent creation of PARA folders
- `getVaultHealth()` — note counts per folder, inbox count, last activity timestamp
- Vault manifest system for migration state tracking

**Migration System (`src/lib/vault-migrate.ts` — new):**
- Non-destructive copy (never moves) from `~/godmode/memory/` → vault PARA folders
- Identity files → `VAULT/08-Identity/`
- Memory bank (people, companies) → `VAULT/06-Brain/People/`, `VAULT/06-Brain/Companies/`
- Knowledge (curated, opinions, tacit) → `VAULT/06-Brain/Knowledge/`
- Research → `VAULT/04-Resources/Research/`
- Consciousness files → `VAULT/99-System/`
- Auto-triggers on first Second Brain RPC call if vault exists but migration hasn't run
- `secondBrain.migrateToVault` RPC for manual trigger

**RPC Handler Rewiring (`src/methods/second-brain.ts`):**
- All 7 existing handlers (identity, memoryBank, aiPacket, sources, research, etc.) now resolve vault-first
- Security checks updated: `isAllowedPath()` accepts both vault and `~/godmode/` paths
- Brain search scans vault folders when available
- Sources handler: Obsidian vault is now the PRIMARY source (was just one option among many)
- 3 new RPCs: `secondBrain.vaultHealth`, `secondBrain.inboxItems`, `secondBrain.migrateToVault`

**Consciousness Sync → Vault Mirror (`src/services/consciousness-heartbeat.ts`):**
- After each hourly sync tick, CONSCIOUSNESS.md and WORKING.md are mirrored to `VAULT/99-System/`
- Manual sync (`secondBrain.sync`) also mirrors to vault

**UI Dashboard (`ui/src/ui/views/second-brain.ts`):**
- Vault health bar at top of Second Brain tab showing connection status, note counts, inbox badge
- New `VaultHealthData` type for vault stats
- Controller loads vault health alongside every subtab
- Updated subtitle: "Your Obsidian-powered second brain"
- CSS: `.vault-health-bar`, `.vault-health-connected`, `.vault-health-inbox-badge`

### New Vault Structure (extends existing PARA)
```
VAULT/
├── 06-Brain/          ← NEW: permanent knowledge (people, companies, knowledge)
├── 08-Identity/       ← NEW: identity files editable in Obsidian
├── 10-Discoveries/    ← NEW: promoted scout findings
└── 99-System/         ← EXTENDED: CONSCIOUSNESS.md + WORKING.md mirror
```

---

## 2026-02-28 — Organizational Intelligence + Dashboards

### Why
Two critical gaps: (1) Files were routed by type, not context. Research scattered across 3+ directories with no search, no relationship detection, and no proactive organization. (2) No dashboards — users couldn't visualize their data in custom views despite GodMode having 33 data source groups (~150+ RPCs).

### What Changed

**Organizational Intelligence:**
- Default workspace `artifactDirs` changed from `["outputs"]` to `["."]` — scans entire workspace root
- Scan depth increased 4→6, item cap 200→500
- 5 new workspace RPCs: `browseFolder`, `search`, `createFolder`, `moveFile`, `renameFile`
- 3 new Second Brain RPCs: `fileTree` (recursive tree of memory/), `search` (cross-scope search), `consolidateResearch` (detect+move scattered research)
- New `org-sweep.ts` service — hourly read-only health check: stale inbox files, scattered research, near-duplicate titles (Jaccard similarity)
- Org sweep wired into consciousness heartbeat tick (fire-and-forget pattern)
- UI: Workspace folder browser with breadcrumbs, search, new folder creation
- UI: Second Brain "Files" subtab with expandable tree browser and global search

**Dashboards:**
- New `dashboards.ts` backend with 6 RPCs: `list`, `get`, `save`, `remove`, `setActive`, `widgetData`
- 16 widget data types: tasks-summary, tasks-today, focus-pulse, goals-progress, agent-activity, queue-status, coding-status, trust-scores, wheel-of-life, intel-highlights, recent-files, brief-summary, weather, streak-stats, workspace-stats, calendar-today
- Storage: `~/godmode/data/dashboards/{id}/index.html` + manifest.json
- New "Dashboards" tab in sidebar navigation
- Gallery view (card grid with create/delete) + active dashboard view (sanitized HTML render)
- Widget CSS utility classes: `.widget`, `.stat`, `.grid-2/3/4`, `.progress-bar`, `.badge`, `.metric-row`
- `"style"` attribute added to HTML sanitizer allowedAttrs for dashboard inline styles
- Dashboard builder skill (`skills/dashboard-builder/SKILL.md`) — teaches agents the full data catalog, CSS conventions, and example layouts
- "Create via Chat" flow seeds conversation with dashboard creation prompt

### Files Created
- `src/methods/dashboards.ts` — Dashboard CRUD + 16 widget data fetchers
- `src/services/org-sweep.ts` — Organizational health sweep service
- `ui/src/ui/controllers/dashboards.ts` — Dashboard state management
- `ui/src/ui/views/dashboards.ts` — Gallery + active dashboard views
- `ui/src/styles/dashboards.css` — Dashboard + widget utility styles
- `skills/dashboard-builder/SKILL.md` — Agent instructions + full data catalog

### Files Modified
- `src/lib/workspaces-config.ts` — Default artifactDirs `["."]`
- `src/methods/workspaces.ts` — browseFolder/search/createFolder/moveFile/renameFile RPCs, scan depth+cap increase
- `src/methods/second-brain.ts` — fileTree/search/consolidateResearch RPCs
- `src/services/consciousness-heartbeat.ts` — Wire org-sweep into tick
- `index.ts` — Register dashboardsHandlers
- `ui/src/ui/navigation.ts` — Add "dashboards" tab
- `ui/src/ui/app-view-state.ts` — Dashboard + file browsing state fields + handlers
- `ui/src/ui/app.ts` — Dashboard + file browsing handler implementations
- `ui/src/ui/app-render.ts` — Dashboard render block, workspace browse props, Second Brain file props
- `ui/src/ui/app-settings.ts` — Auto-load dashboards + file tree on tab navigate
- `ui/src/ui/views/workspaces.ts` — Workspace browser with breadcrumbs/search/folder nav
- `ui/src/ui/views/second-brain.ts` — "Files" subtab with tree browser + global search
- `ui/src/ui/controllers/workspaces.ts` — browseFolder/search/createFolder/move/rename controller functions
- `ui/src/ui/markdown.ts` — Add "style" to allowedAttrs
- `ui/src/styles.css` — Import dashboards.css
- `ui/src/styles/workspaces.css` — Workspace browser styles
- `ui/src/styles/second-brain.css` — Files tab styles

---

## 2026-02-28 — Today Tab Split Layout: Tasks Left + Brief Right

### Why
The Today tab was a single-column daily brief with tasks embedded as markdown checkboxes. This was a constant source of friction (NBSP bugs, bidirectional sync, surgical toggles) and the brief couldn't show queue status, agent indicators, or session links. Tasks needed a proper task UI, and the brief needed to be just a briefing document.

### What Changed

**Two-column layout:** Tasks on the left (wider, 3fr), daily brief on the right (2fr). Toolbar spans full width above both columns. Agent Log toggle replaces the right column content only — tasks stay visible.

**Task panel features:**
- Inline "Add task" form creates tasks with today's date
- Reuses `renderAllTaskRow()` from workspaces.ts — full queue-aware rendering (pulsing dot for processing, Review button for review, Start button for new)
- "Show N completed" toggle for tasks completed today
- Inline editing (click title to edit)
- Sorted by due date, then priority

**Backend:** `tasks.today` RPC now accepts `includeCompleted` param — returns tasks completed today alongside pending/overdue tasks.

**Controller:** New `loadTodayTasksWithQueueStatus()` fetches `tasks.today` and `queue.list` in parallel, merges by `sourceTaskId`. Same pattern as the Work tab's loader.

**Bug fix:** `handleMyDayTaskStatusChange` was wrapping params in `{ updates: {...} }` but the backend expects flat params `{ id, status, completedAt }`. Fixed.

### Files Modified
- `ui/src/ui/views/my-day.ts` — Rewritten to two-column layout with task panel, agent log helper, add task form
- `ui/src/ui/views/workspaces.ts` — Exported `renderAllTaskRow`, `sortTasks`, and helper functions
- `ui/src/ui/controllers/my-day.ts` — New `loadTodayTasksWithQueueStatus()`, updated `loadMyDay()`
- `src/methods/tasks.ts` — Added `includeCompleted` param to `tasks.today` RPC
- `ui/src/styles/my-day.css` — Two-column grid, removed orphaned task CSS (old `.today-task-*` classes)
- `ui/src/ui/app.ts` — New state fields + handlers for create/edit/update/toggle-completed
- `ui/src/ui/app-view-state.ts` — Type declarations for new fields and handlers
- `ui/src/ui/app-render.ts` — Wired new task panel props

---

## 2026-02-28 — Unified Workflow: Session Continuity + Queue-Aware Surfaces

### Why
The 5 surfaces (Chat, Today, Work, Mission Control, Second Brain) were disconnected. Clicking a task in Work opened a blank session even when agents had already done work on it. Mission Control had no way to open an agent's working session. The Work tab had no visibility into what agents were doing. "Approve" button semantics were unclear. Right column buttons were cut off.

### What Changed

**1. Session-Scoped Queue Context Injection (the linchpin)**
- When a user opens a task session, Atlas now immediately knows about any autonomous queue work done on that task
- Reverse lookup chain: `sessionKey` → `tasks.json` → `queue.json` → read output file
- For "processing" items: injects "an agent is currently working on this"
- For "review" items: injects full output content so Atlas can present findings naturally
- Global queue injection still works but skips items already covered by session-scoped injection

**2. Work Tab Queue-Aware Status Indicators**
- Each task row now shows live agent status:
  - Pulsing green dot + "Builder working..." for processing items
  - Teal "Review" button for items ready for review
  - "Start" button (unchanged) for tasks with no queue work
- New `loadAllTasksWithQueueStatus()` fetches tasks + queue in parallel and merges by `sourceTaskId`

**3. Mission Control "Open Session" Button**
- Active agent cards now show "Open" button (navigates to agent's working session) or "Open Task" button (navigates to linked task session)
- Uses same navigation pattern as Today tab task opening

**4. "Approve" → "Done" Rename**
- Clearer semantics: "Done" means mark the review item as completed

**5. Right Column Width Fix**
- `.mc-col-side` width increased from 320px to 380px
- Agent card headers now flex-wrap so buttons don't overflow

**6. Orphaned Queue Item Recovery**
- `recoverOrphaned()` now checks if output file exists before resetting
- If output exists → recovers to "review" status (not "pending")
- Prevents loss of completed autonomous work when agent PIDs die

### Files Modified
- `index.ts` — Session-scoped queue context injection in `before_prompt_build`
- `src/services/queue-processor.ts` — Improved `recoverOrphaned()` with output file detection
- `ui/src/ui/views/workspaces.ts` — Queue status rendering in task rows
- `ui/src/ui/controllers/workspaces.ts` — `loadAllTasksWithQueueStatus()` function
- `ui/src/ui/views/mission-control.ts` — "Done" rename, Open/Open Task buttons
- `ui/src/ui/controllers/mission-control.ts` — `childSessionKey` on AgentRunView
- `ui/src/ui/app.ts` — `handleMissionControlOpenSession` + `handleMissionControlOpenTaskSession`
- `ui/src/ui/app-view-state.ts` — Type declarations for new handlers
- `ui/src/ui/app-render.ts` — Wired new props, replaced loadAllTasks calls
- `ui/src/ui/app-settings.ts` — Updated workspace loader import
- `ui/src/styles/mission-control.css` — Width fix, flex-wrap, Open Session button styles
- `ui/src/styles/workspaces.css` — Queue status indicator styles

---

## 2026-02-28 — Daily Brief Structure Optimization

### Why
The daily brief had 15 sections with redundant data (Day N appeared 3x, streak counter was optional) and the most actionable content (Win The Day tasks) was buried below the fold behind Chief Aim and LifeTrack sections. Body Check scores were informational but positioned too prominently.

### What Changed
- **Header collapsed**: Date + weather + day type in one compact line (removed standalone Day N counter)
- **Chief Aim**: Demoted from H2 section to a single blockquote — always visible, not a landmark
- **Win The Day moved to #1 position**: Tasks are now the first real content after the context line
- **LifeTrack collapsed**: From a 3-line H2 section to a single clickable line after tasks
- **Calendar + Communications merged**: Single "Calendar & Comms" H2 section
- **Body Check moved below Notes**: Informational, not guilt-tripping at 7AM
- **Added scaffolding**: Today's Impact (Evening), Evening Review, Bedtime LifeTrack, and Retain sections are now pre-scaffolded as placeholders
- **Notes section**: Now has "never touched by AI" label
- **Optional streak counter** moved to conditional display (only shown if configured in CONTEXT.md)

### Files Modified
- `src/methods/brief-generator.ts` — Restructured `generateDailyBrief()` assembly (lines ~1218-1390)

### Compatibility
- Section keyword searches (lifetracks.ts `extractSection`) still work — "Calendar & Comms" matches "Calendar" partial keyword
- Evening capture `upsertH2Section` is independent of section ordering
- All existing H2 names preserved except Calendar→"Calendar & Comms" and LifeTrack/Chief Aim removed as H2s

---

## 2026-02-28 — Phase 2: Autonomous Queue + Proactive Task Processing

### Why
Phase 1 built Mission Control (visibility layer). Phase 2 adds the proactive execution engine — a queue system where users/ally can drop tasks, URLs, ideas, and research topics that get processed by background sub-agents. Output goes to `~/godmode/memory/inbox/` for human review. The system is anti-fragile: failures auto-diagnose, write learnings, and retry with improved prompts.

### What Was Built

**Queue Backend (4 new files):**
- `src/lib/queue-state.ts` — File-locked queue state (`~/godmode/data/queue.json`) with curated agent type taxonomy: Builder, Researcher, Analyst, Creative, Reviewer, Ops, Agent, Reader, Explorer
- `src/methods/queue.ts` — 9 RPC handlers (add, list, update, approve, remove, process, processAll, prDiff, readOutput). Human-in-the-loop: queue.approve is the ONLY path to "done" status
- `src/tools/queue-add.ts` — Agent-callable `queue_add` tool so the ally can drop items into queue during conversations
- `src/services/queue-processor.ts` — Singleton agent spawner with self-evolving failure handling. Failed tasks spawn a diagnostic agent → writes learning to `~/godmode/memory/learnings/INDEX.md` → generates improved retry prompt → retries (max 2). Includes `autoQueueOverdueTasks()` for proactive task capture

**Mission Control UX Overhaul:**
- Agent badges now show human-readable role names ("Builder", "Researcher", "Analyst") instead of raw types ("CODING", "SWARM")
- New "Ready for Review" section with Approve + View Output buttons
- New "Pending Queue" section with priority badges
- Clickable failed items → sidebar error report with retry button
- "View PR" opens sidebar with diff instead of navigating to GitHub
- Stats banner shows queue depth + review count
- Updated empty state: "Drop tasks into the queue or ask your ally to spawn agents"

**Proactive Systems:**
- Consciousness heartbeat auto-queues overdue tasks and processes pending items every 60 minutes
- `before_prompt_build` hook injects queue review summaries so ally proactively surfaces completed work
- Morning brief includes "Your Agents Overnight" section with completed work summary
- Meeting prep enrichment: attendee names matched against `~/godmode/memory/bank/people/*.md` for context

**Task → Session Linking:**
- Win The Day tasks in daily brief get `[→ Review]` or `[→ Open]` session links
- `?openTask=` URL parameter in web UI for deep linking from Obsidian
- Sessions created lazily on click via `tasks.openSession`

### Key Design Decisions
- **Human-in-the-loop**: Queue items finish at "review", never "done". Only `queue.approve` can transition to "done"
- **Self-evolving failures**: Diagnostic agent writes learnings to INDEX.md, future prompts inject relevant learnings
- **Queue vs Tasks**: Queue items = work orders for agents. Tasks = user's commitment list. `sourceTaskId` links them

### Files Changed
- **New:** `src/lib/queue-state.ts`, `src/methods/queue.ts`, `src/tools/queue-add.ts`, `src/services/queue-processor.ts`
- **Modified:** `index.ts`, `src/services/consciousness-heartbeat.ts`, `src/methods/brief-generator.ts`, `ui/src/ui/controllers/mission-control.ts`, `ui/src/ui/views/mission-control.ts`, `ui/src/styles/mission-control.css`, `ui/src/ui/app-view-state.ts`, `ui/src/ui/app.ts`, `ui/src/ui/app-render.ts`, `ui/src/ui/app-gateway.ts`

---

## 2026-02-28 — Prompt Injection Defense System (Three Security Shields)

### Why
Red-team audit scored 1/10 on prompt injection tests. GodMode had strong tool-level gates (loop breaker, grep blocker, spawn gate) but zero message-level defenses. Any user message reached the agent unfiltered, and outbound messages could leak system prompts, config files, API keys, and tool listings.

### What Was Built
Three new deterministic security gates plus an automated red-team audit system:

**Prompt Shield** (input detection + counter-injection)
- Hook: `message_received` (detect) + `before_prompt_build` (inject counter-instructions)
- Scans inbound messages for 5 categories of injection: instruction overrides, prompt extraction, fake authority claims, encoded payloads (including base64 decode), social engineering
- When detected, flags session and injects strong system-level counter-instructions that override the injection attempt
- Zero overhead on normal messages — counter-instructions only added when threat detected

**Output Shield** (leak prevention)
- Hook: `message_sending` (cancel) + `before_prompt_build` (nudge)
- Blocks outbound messages that contain: API keys (sk-*, xai-*, ghp_*), system prompt recitation (3+ structural markers), config file JSON (license keys, tokens), tool listing dumps (5+ tools), SOUL.md/AGENTS.md content
- Canceled messages get a nudge on next prompt cycle to rephrase without sensitive data

**Config Shield** (file access protection)
- Hook: `before_tool_call` (block)
- Blocks bash commands (cat/head/tail/etc.) and read tool calls targeting sensitive paths: `.openclaw/openclaw.json`, `.openclaw/.env`, `AGENTS.md`, `SOUL.md`, `.ssh/`, `.aws/credentials`, `.npmrc`, `.netrc`, `guardrails.json`
- Internal Node.js reads (team-bootstrap, onboarding) are unaffected — only tool-based access is blocked

**Red Team Audit System**
- `security.audit` RPC with 26 test cases (12 prompt shield, 6 output shield, 8 config shield)
- Includes false positive checks to ensure normal operations aren't blocked
- Generates graded reports (A+ through F) saved to `~/godmode/data/security-audits/`
- `skills/red-team-audit/SKILL.md` — agent-invokable audit skill

### Modified Files
- `src/services/guardrails.ts` — Added `promptShield`, `outputShield`, `configShield` gate IDs, defaults, and descriptors
- `src/hooks/safety-gates.ts` — Three new gate implementations (~300 lines): Prompt Shield (pattern matching + base64 decode), Output Shield (6 leak checks), Config Shield (sensitive path blocking)
- `index.ts` — Wired all hooks: new `message_received` handler, extended `before_prompt_build` with shield nudges, extended `before_tool_call` with config shield, extended `message_sending` with output shield, extended `before_reset` with tracking cleanup
- `src/methods/security-audit.ts` — NEW: Red-team audit RPC handler with 26 test battery
- `skills/red-team-audit/SKILL.md` — NEW: Agent-invokable security audit skill

### Design Principles
- All detection is pure in-memory regex — microseconds, no API calls
- Zero tokens added to context during normal conversation
- All three gates toggleable via guardrails dashboard (enabled by default)
- Defense-in-depth: Prompt Shield catches input, Output Shield catches output, Config Shield catches file access
- False positive mitigation: markers require 3+ hits for system prompt/SOUL/AGENTS detection; short messages skip checks

---

## 2026-02-28 — Gateway Token Auto-Generation + X Scanner Sandbox

### Gateway Token Security (GodMode Plugin)
Added automatic gateway auth token generation to both onboarding paths (in-app and CLI script). This was the #1 recommendation from the security audit — high-value, zero-friction for clients.

**What it does:**
When a new user activates their license (via `onboarding.activateLicense` RPC or `scripts/team-setup.mjs`), the system now auto-generates a 256-bit gateway auth token if one doesn't already exist. This prevents unauthorized local processes from sending commands to the agent via the WebSocket port.

**Modified files:**
- `src/methods/onboarding.ts` — Added `randomBytes` import, gateway token auto-generation during `activateLicense`. Checks both `gateway.token` (legacy) and `gateway.auth.token` (standard path).
- `scripts/team-setup.mjs` — Added Step 7 "Securing gateway" with token generation (reads/writes `~/.openclaw/openclaw.json`).
- `src/methods/onboarding-scanner.ts` — Added gateway token check to health assessment. Missing token is flagged as `priority: "critical"` in config recommendations.
- `src/methods/onboarding-types.ts` — Added `gatewayTokenSet: boolean` to `AssessmentResult`.

**Audit finding fixed:**
Atlas originally reported the gateway token as missing because the audit checked `gateway.token` (flat key) while the actual config uses `gateway.auth.token` (nested). All code now checks both paths.

### X Scanner Sandbox (Separate Local Project)
Built a fully sandboxed X/Twitter agent architecture for community engagement scanning. This is local infrastructure, NOT part of the GodMode plugin. Follows Meta's Rule of Two — the scanner processes untrusted inputs (A) and accesses sensitive data (B), so external actions (C) require human approval.

**Architecture:**
- Input sanitizer with 4 defense layers: Unicode normalization, injection pattern detection (8 categories), length enforcement, structural wrapping.
- File-based draft queue with UUID lifecycle: drafts → approved/rejected → posted. Approval writes SHA-256 signature proving human review.
- X API v2 reader with cursor-based pagination. All content sanitized before processing.
- Poster with human approval requirement, rate limiting (48/day, 5min cooldown), full audit trail.
- Local review web UI at `127.0.0.1:18800` for reviewing drafts. Binds to localhost only.

**Security invariants:**
1. No auto-posting — every post requires human approval signature (SHA-256)
2. All ingested content sanitized and structurally wrapped before agent sees it
3. Rate limiting: 48/day max, 5-minute cooldown between posts
4. Draft output validation detects credential leaks (API keys, tokens)
5. Review server binds to 127.0.0.1 only — never exposed to network

---

## 2026-02-28 — Agent Coding Pipeline Safety Overhaul

### Problem
An agent dispatched a coding agent (swarm pipeline) to build custom guardrails. The agent worked in a worktree, completed successfully, created PR #3. But:
1. The agent never followed up — the tool description said "no follow-up action needed"
2. The agent did `git merge` on main while there were ~38 uncommitted files (sidebar, navigation rework)
3. Git auto-stashed the uncommitted work, merge succeeded, stash was never popped
4. All sidebar/coretex/navigation work was trapped in stash@{0}
5. Spawned coding agents had zero awareness of custom guardrails

### Fixes Applied

**Immediate recovery:**
- Restored stash (38 files, 2076 additions) — sidebar/coretex/navigation work recovered
- Cleaned up 6 stale worktrees and their branches

**Structural fixes (5 files):**

1. **coding-task.ts** — Tool description changed from "no follow-up needed" to explicit "MUST follow up". Return messages now include ACTION REQUIRED block: poll status, review PR, report results, never merge yourself.

2. **coding-orchestrator.ts** — Three changes:
   - Agent prompts now include Safety Rules (never merge, never checkout main, stay in scope)
   - Agent prompts now include all active guardrails (built-in + custom) via `formatGuardrailsForPrompt()`
   - `handleTaskCompleted` checks `isWorkingTreeClean()` before auto-merge — skips merge if main has uncommitted changes
   - Added `onTaskCompleted` callback system for notification wiring

3. **guardrails.ts** — New `formatGuardrailsForPrompt()` exports all enabled guardrails as markdown for agent prompts

4. **swarm-pipeline.ts** — Build and QC stage prompts now include Safety Rules + guardrails block

5. **index.ts** — Wired `codingNotification.sendCompletionNotification` as `onTaskCompleted` callback so detached CLI agents trigger notifications (previously only `subagent_ended` path sent them)

### Key Principle
Chat agents must NEVER merge branches locally. All merges go through GitHub PRs via the orchestrator. Agents must follow up on coding tasks and report results.

---

## 2026-02-28 — ClawHub Marketplace Integration (Skills Page)

### What
Added a full ClawHub marketplace tab to the Skills page — search, browse, preview, import, and personalize skills from ClawHub (3,200+ skills) directly in GodMode.

### Search & Browse
- Vector search across all ClawHub skills
- Sort by Trending / Newest / Top Rated / Popular
- Skill cards show name, summary, version, and relative timestamps
- Detail panel with owner info, moderation badges, version changelog

### Import + Personalize Flow
Two paths: "Import" (download as-is) and "Import + Personalize" (conversational):
1. Backend downloads zip, extracts to `~/godmode/skills/`, updates lockfile
2. Backend assembles personalization prompt from: SKILL.md content, onboarding.json, data-sources.json, installed skills list, USER.md
3. UI prefills chat message and navigates to chat tab
4. User has a back-and-forth conversation with their GodMode agent to tailor the skill to their specific tools, workflow, and needs
5. Agent writes the personalized SKILL.md when the user is satisfied

### Moderation
- Malware-blocked skills cannot be imported (hard block)
- Suspicious skills show a yellow warning badge but can still be imported

### New Files
- `src/methods/clawhub.ts` — 5 RPC handlers: `clawhub.search`, `clawhub.explore`, `clawhub.detail`, `clawhub.import`, `clawhub.personalizeContext`
- `ui/src/ui/controllers/clawhub.ts` — Frontend state management + RPC calls
- `ui/src/ui/views/clawhub.ts` — Marketplace UI (search bar, sort tabs, results list, detail panel)

### Modified Files
- `index.ts` — Registered `clawhubHandlers`
- `package.json` — Added `clawhub` dependency
- `ui/src/ui/types.ts` — Added `ClawHubSearchResult`, `ClawHubSkillItem`, `ClawHubSkillDetail` types
- `ui/src/ui/views/skills.ts` — Added "My Skills" / "ClawHub" sub-tab layout
- `ui/src/ui/controllers/skills.ts` — Extended state with ClawHub fields
- `ui/src/ui/app-view-state.ts` — Added 11 ClawHub state fields
- `ui/src/ui/app.ts` — Added `@state()` declarations for ClawHub state
- `ui/src/ui/app-render.ts` — Wired ClawHub state, callbacks, and personalization flow

---

## 2026-02-28 — 80/20 Onboarding Overhaul + Cross-Platform Setup

### New Setup Tab (persistent sidebar item)
Replaces the full-screen onboarding takeover with a fast, non-blocking setup flow.

**New files:**
- `ui/src/ui/views/setup.ts` — Setup view with Quick Start form (name + license key + daily intel topics) and progressive checklist
- `ui/src/ui/controllers/setup.ts` — RPC client for setup operations
- `ui/src/styles/setup.css` — Setup tab styles
- `docs/setup.html` — Hosted setup wizard page for lifeongodmode.com/setup (auto-detects OS, step-by-step with copy-paste commands)
- `scripts/team-setup.mjs` — Cross-platform Node.js setup script (works on Windows, Mac, Linux)

**Modified files:**
- `ui/src/ui/navigation.ts` — Added "setup" tab type
- `ui/src/ui/app.ts` — Added setup state + handlers (handleQuickSetup, handleLoadSetupChecklist, handleHideSetup, handleRunAssessment)
- `ui/src/ui/app-view-state.ts` — Added setup state fields and handler types
- `ui/src/ui/app-render.ts` — Sidebar injection (setup tab appears at top when onboarding incomplete), view routing, gated full-screen takeover (only shows for legacy ?onboarding=1 flow)
- `ui/src/ui/app-gateway.ts` — checkOnboardingStatus now sets showSetupTab for new users
- `ui/src/ui/app-settings.ts` — Loads checklist when setup tab is active
- `ui/src/styles.css` — Added setup.css import

### Backend: Ungated Quick Setup RPCs
- `src/methods/onboarding.ts` — Added `onboarding.quickSetup` (saves identity + intel prefs, marks phases complete) and `onboarding.activateLicense` (writes license key to openclaw.json)
- `index.ts` — These methods + onboarding.status + onboarding.checklist skip license gate so they work before license is configured

### Configurable Daily Intelligence
- `src/methods/brief-generator.ts` — XAI x_search query now reads `dailyIntel.topics` from godmode-options.json instead of hardcoded query. Users set their topics during quick setup.

### Model + Caching Recommendations
- `src/methods/onboarding-scanner.ts` — Config audit now recommends `cacheRetention: "long"` for Anthropic models
- `src/services/onboarding.ts` — Config patch includes Anthropic model configs with caching enabled + `thinkingDefault: "low"`

### Cross-Platform Deployment Guide
- `docs/DEPLOYMENT-GUIDE.md` — Rewritten for Windows, Mac, Linux, and VPS. Only real prerequisite is Node.js 22+. References team setup script and hosted wizard page.

---

## 2026-02-28 — Client Readiness Audit + Deployment Prep

### Code Review & Hardening
Full audit pass to prepare for first client deployment.

**Mission Control Removal:**
- Deleted 7 files (views, controllers, styles — ~2,000+ lines)
- Removed all integration points across ~10 files (app.ts, app-render.ts, app-view-state.ts, app-gateway.ts, app-settings.ts, navigation.ts, styles.css, index.ts, options.ts)
- Removed ~230 lines of ops proxy infrastructure from index.ts (was only used for mission control sidecar)

**Security Fixes:**
- XSS in dynamic slots: `unsafeHTML(slotHtml)` → `unsafeHTML(sanitizeHtmlFragment(slotHtml))` in app-render.ts
- Env var leakage: child process spawns in swarm-pipeline.ts and coding-orchestrator.ts now use explicit whitelist (PATH, HOME, USER, SHELL, LANG, TERM, ANTHROPIC_API_KEY) instead of `...process.env`
- Numeric bounds validation in daily-brief.ts toggleCheckbox (integer check + non-negative)

**TypeScript Fixes:**
- coding-orchestrator.ts: `statusSummary()` return type now includes `swarmTasks` and `swarmStages` fields
- coding-orchestrator.ts: `pollSwarmStageUntilExit` stage param typed as `SwarmStage` (was `string`)

### Onboarding Dependency Checks
Added GitHub CLI and Obsidian vault detection to Phase 0 assessment so users see upfront what's missing.
- `src/methods/onboarding-scanner.ts` — New `checkGitHubReady()` (runs `gh auth status`) and `checkObsidianVault()` (calls `resolveVaultPath()`)
- `src/methods/onboarding-types.ts` — Added `githubReady` and `obsidianVaultConfigured` to `AssessmentResult`
- `ui/src/ui/views/onboarding.ts` — Assessment dashboard now shows GitHub CLI and Obsidian vault status with helpful hints when missing
- Health score unchanged (these are informational, not scored — user shouldn't feel penalized for skipping optional deps)

### Graceful Degradation (verified existing paths)
- Coding tasks: return `setup_required` with friendly setup instructions when `gh auth status` fails
- Daily brief: returns null when no Obsidian vault; UI shows "No brief available"
- Channels: fully functional without any connected; Settings → Channels tab for later setup
- Cron: everything works on-demand without scheduled jobs

### Deployment Guide
- **New:** `docs/DEPLOYMENT-GUIDE.md` — Step-by-step setup for brand-new machine (prerequisites, OpenClaw install, auth, plugin install, license config, gateway config, onboarding walkthrough, troubleshooting)

---

## 2026-02-28 — Swarm Pipeline + Workspace-Aware Resources

### What
Complex coding tasks now run through a 3-stage sequential pipeline: **Design → Build → QC**. Each stage is a specialized Claude Code agent that writes to `.swarm/` coordination files in the worktree.

### Swarm Activation
Swarm activates when ALL of:
1. `classifyComplexity(task)` returns `"complex"`
2. A plan doc exists and is approved
3. Simple tasks still use single-agent flow unchanged

### Pipeline Stages
- **Design Agent** — reads codebase + brand guide + voice bible, writes `.swarm/design-brief.md` (no code)
- **Build Agent** — follows design brief, runs the copy skill's 3-stage pipeline for all user-facing text, commits and pushes
- **QC Agent** — fresh-eyes review, kills AI-sounding copy (12 anti-patterns), fixes small issues, writes `.swarm/qc-report.md`

### Workspace-Aware Resources
Each stage detects the target workspace (e.g., "client funnel" → client workspace) and resolves project-specific resources in priority order:
1. Workspace repo directory
2. `~/godmode/projects/{id}/`
3. `~/godmode/clients/{id}/`
4. Falls back to global GodMode voice bible + brand guide

This means "build a funnel for [client]" automatically gets the client's brand strategy guide, copy direction, and project context — not generic GodMode defaults.

### Orphan Recovery
Gateway restarts no longer lose in-flight tasks. `recoverOrphanedTasks()` runs on startup:
- Dead PID → runs `handleTaskCompleted` immediately (validation gates → PR)
- Live PID → polls every 5s until exit
- Swarm-aware: checks current stage PID and advances pipeline appropriately

### Files
- `src/services/swarm-pipeline.ts` — **New** pipeline orchestration, stage prompts, workspace resource resolution
- `src/lib/coding-task-state.ts` — Added `SwarmStage`, `SwarmStageState`, `SwarmState` types
- `src/tools/coding-task.ts` — Swarm/single-agent branching
- `src/services/coding-orchestrator.ts` — Orphan recovery, dep install before gates, `runCommand` exposure
- `index.ts` — Logger passing, orphan recovery on startup

---

## 2026-02-28 — Coding Task Orchestration Fix (End-to-End)

### Problem
`coding_task` tool created a worktree and returned `spawnInstructions` telling the agent to call `sessions_spawn`. But `sessions_spawn` wasn't always available, so agents fell back to running `claude -p` via `exec`, bypassing worktree isolation, validation gates, PR creation, and notifications.

### Fixes Applied (4 commits)

1. **Auto-spawn from coding_task** (`079b870`) — `coding_task` now spawns the coding agent directly via `child_process.spawn()` instead of returning instructions. No second tool call needed.

2. **Close escape hatches** (`2fc8ac1`) — Added exec bypass gate blocking `claude -p` / `--dangerously-skip-permissions` patterns in `before_tool_call`. Added stale task auto-reaping (>2h with dead PID). Removed dead `SWARM_ORCHESTRATION_HANDOFF` doc that referenced never-committed swarm files. Cleaned README.

3. **Fix detached spawn** (`ff58528`) — Detached processes with `stdio: "ignore"` can't answer permission prompts, killing the agent after ~51s. Added `--dangerously-skip-permissions` flag. Resolved full binary path via `resolveClaudeBin()` helper and PATH inheritance for homebrew.

4. **Smart validation gates** (`bff06e0`) — Gates now read `package.json` scripts from the target worktree before running. If the repo has no `package.json` or is missing the relevant script (lint/typecheck/test), the gate is skipped instead of failing. Fixes coding_task marking external projects as failed.

### Architecture After Fix
- `coding_task` tool → creates worktree → spawns Claude Code as detached child process → on exit, runs validation gates → creates PR → sends notification
- No dependency on `sessions_spawn` or any external tool
- Validation gates auto-detect: only run lint/typecheck/test if the target repo has those scripts in package.json
- Exec bypass gate prevents agents from manually running `claude -p` outside the orchestrator

### Files Changed
- `src/services/coding-orchestrator.ts` — `spawnCodingAgent()`, stale reaping, binary path fix, smart validation gates
- `src/tools/coding-task.ts` — Auto-spawn integration, updated description
- `src/lib/coding-task-state.ts` — Added `pid` field to `CodingTask`
- `index.ts` — Exec bypass gate in `before_tool_call`
- `README.md` — Replaced swarm docs with coding_task docs

---

## 2026-02-28 — Daily Brief Checkbox Persistence Fix

### Problem
Checking off tasks in the Today tab or Obsidian didn't persist — checkboxes reverted on refresh.

### Root Causes Found & Fixed
1. **`e.currentTarget` null in setTimeout** — The checkbox click handler read `e.currentTarget` inside a `setTimeout` callback, but DOM events clear `currentTarget` after the handler returns. Every checkbox save silently crashed with a TypeError. Fix: capture `currentTarget` synchronously before the setTimeout.

2. **Full-file overwrites clobbered Obsidian** — GodMode saved the entire brief from in-memory HTML on every checkbox click, overwriting any changes Obsidian made. Fix: new `dailyBrief.toggleCheckbox` RPC that reads the current VAULT file from disk, toggles just the one checkbox (`[ ]` ↔ `[x]`), and writes back. 3-character diff instead of full-file overwrite.

3. **Double-space in markdown round-trip** — `htmlToMarkdown` produced `[x]  text` (double space) because the checkbox handler added a trailing space AND the HTML text node had a leading space. Fixed to omit the trailing space.

4. **Previous session fixes (also committed):** Removed `syncBriefFromTasks` from bidirectional sync (was overwriting brief checkboxes on page load), removed `userEdited` guard blocking brief→task completion sync, restricted `syncBriefFromTasks` to require explicit `taskTitle` parameter.

### Architecture After Fix
- **GodMode checkbox click** → surgical read-modify-write via `dailyBrief.toggleCheckbox` RPC
- **GodMode text edit** → full content save via `dailyBrief.update` (unchanged)
- **Obsidian → GodMode** → refresh reads VAULT file directly (works; Obsidian desktop checkbox toggles don't persist to disk — known Obsidian limitation)
- **Brief is source of truth** for checkbox state; `tasks.json` is derived

### Files Changed
- `src/methods/daily-brief.ts` — New `toggleCheckbox` handler, sync fixes
- `ui/src/ui/views/daily-brief.ts` — `e.currentTarget` fix, surgical checkbox wiring
- `ui/src/ui/app.ts` — `handleBriefToggleCheckbox` method
- `ui/src/ui/app-render.ts` — Pass `onBriefToggleCheckbox` prop
- `ui/src/ui/app-view-state.ts` — Type addition
- `ui/src/ui/views/my-day.ts` — Prop threading
- `ui/src/ui/html-to-markdown.ts` — Double-space fix

---

## 2026-02-28 — Lifetrack Theme (White & Gold + Quantum Particles)

### New Theme: Lifetrack
Added a 4th theme option to the UI toggle — a white and gold "Lifetrack" theme with floating quantum particles in the background.

**Color palette (Honey Gold family):**
- Primary accent: `#EB9E0F` (Honey Gold)
- Hover: `#F0AD15`
- Secondary: `#DA9100` (Harvest Gold)
- Glow: `rgba(235, 158, 15, 0.30)`
- Backgrounds: `#fefefe` / `#fafaf8` / `#ffffff` (near-pure white)
- Text: `#3f3f46` / `#18181b` (neutral dark, matches light theme)

**Particle system:**
- 56 floating gold specks with randomized size (2–5px), drift paths, and timing
- CSS `@keyframes quantum-float` with per-particle custom properties for unique motion
- Particles live inside `.shell` via `prepend` so content renders above them
- `requestAnimationFrame` retry handles initialization timing
- Respects `prefers-reduced-motion`

**Files changed:**
- `ui/src/ui/theme.ts` — Added `"lifetrack"` to `ThemeMode` and `ResolvedTheme` unions
- `ui/src/ui/storage.ts` — Added `"lifetrack"` to theme validation guard
- `ui/src/ui/app-settings.ts` — Particle init/destroy on theme change, colorScheme mapping
- `ui/src/ui/app-render.helpers.ts` — 4th toggle pill with sparkle icon
- `ui/src/ui/particles.ts` — **new file**: particle system (create/destroy lifecycle)
- `ui/src/styles/base.css` — Full `:root[data-theme="lifetrack"]` palette + keyframes + translucent content areas
- `ui/src/styles/components.css` — Toggle grid expanded to 4 columns
- `ui/src/styles/layout.css` — Gold brand logo/title treatment
- `ui/src/styles/mission-control.css` — Lifetrack `--mc-*` variable overrides

---

## 2026-02-28 — Image Previews, Lightbox & Clickable File References

### Image Lightbox
- **New:** `ui/src/ui/chat/lightbox.ts` + `ui/src/styles/chat/lightbox.css` — Full-viewport overlay lightbox for viewing images larger. Dark backdrop with blur, close via Escape/click-outside/X button, left/right arrow navigation for multi-image messages, image counter.
- Clicking any inline image in chat now opens the lightbox instead of `window.open()`.
- Lightbox state managed on GodModeApp (`app.ts`, `app-view-state.ts`), rendered at top level in `app-render.ts`.

### Server-side Image Cache
- **New:** `src/services/image-cache.ts` — Content-addressable filesystem cache at `~/godmode/data/image-cache/`. SHA-256 hash keys, session index files, 30-day TTL + 500MB cap with auto-cleanup on gateway start.
- **New:** `src/methods/image-cache.ts` — RPC handlers: `images.cache`, `images.get`, `images.resolve`, `images.updateIndex`, `images.cleanup`.
- Images are cached fire-and-forget when user sends them (`controllers/chat.ts`) and when AI responses include them (`app-gateway.ts`).
- On history load, omitted images are resolved from cache and rendered as inline previews instead of "preview omitted" placeholders.

### Clickable Bare Filenames
- `extractPathCandidateFromCode()` in `views/chat.ts` now recognizes bare filenames like `godmode-v5.png` (not just paths with slashes). These open in the sidebar file viewer when clicked.
- Inline `<code>` elements in chat now show `cursor: pointer` and a subtle hover background change to indicate clickability.

### Files Changed
- `ui/src/ui/chat/grouped-render.ts` — Exported `extractImages`/`ImageBlock`, added `onImageClick` + `resolveUrl` threading
- `ui/src/ui/views/chat.ts` — Added `onImageClick`, `resolveImageUrl` props; bare filename detection
- `ui/src/ui/app-view-state.ts` — Added `lightbox` state + image handlers
- `ui/src/ui/app.ts` — Lightbox state management + imports
- `ui/src/ui/app-render.ts` — Wired lightbox overlay + image props
- `ui/src/ui/app-gateway.ts` — Image cache/resolve logic + `getResolvedImageUrl` export
- `ui/src/ui/app-lifecycle.ts` — Triggers image resolution after history loads
- `ui/src/ui/controllers/chat.ts` — Cache images on send
- `ui/src/styles/chat/text.css` — Clickable code element styles
- `ui/src/styles/chat.css` — Lightbox CSS import
- `index.ts` — Registered `imageCacheHandlers`, cache cleanup on gateway start

---

## 2026-02-28 (Late) — Full Audit, Harden & Document Pass

### Exhaustive 6-Phase Audit
Ran a comprehensive multi-phase audit across the entire codebase using 20+ parallel exploration agents. Covered: backend handlers, services/libs, UI views, UI controllers, CSS, config/registration, security review, and integration verification of all 7 major feature systems.

### Type Error Fixes (9 errors → 0)
- `src/methods/coding-tasks.ts` — Fixed 7 type errors: `respond()` calls were passing objects where the first arg must be a boolean. Changed from `respond({ error: "..." })` to `respond(false, undefined, { code, message })` and from `respond(result)` to `respond(true, result)`.
- `src/methods/consciousness.ts` — Fixed 1 type error: `CLAUDECODE` property access on env object. Cast `childEnv` to `Record<string, string | undefined>` before `delete`.
- `src/services/coding-orchestrator.ts` — Fixed 1 type error: `result.exitCode` should be `result.code` (matching `SpawnResult` type from OpenClaw SDK).

### Dead Code Removal (3 files)
- **Deleted** `src/ephemeral.ts` (249 lines) — Ephemeral session storage module, never imported by any file.
- **Deleted** `src/hooks/trust-bootstrap.ts` (21 lines) — Retired no-op stub, not imported anywhere (trust feedback now handled by `trust-feedback.ts`).
- **Deleted** `src/protocol.ts` (35 lines) — Error codes/shapes helper, never imported (handlers use inline error objects).
- Kept `src/methods/lifetracks.ts` (intentionally deferred, per index.ts comment).

### Security Review — Clean
Full security scan found no critical vulnerabilities:
- No path traversal (proper validation in static-server.ts, workspaces-config.ts)
- No command injection (array-based exec, hardcoded scripts)
- No eval/Function/dynamic code execution
- No hardcoded secrets
- License gate has no bypass vectors
- All empty catches are in non-critical best-effort paths

### Integration Verification — All 7 Systems Confirmed
1. **Onboarding:** Full 7-phase + wizard chain verified, all 11 RPC handlers properly wired
2. **Daily Brief:** NBSP stripping at all 3 layers, no feedback loops, checkbox sync working
3. **Consciousness Sync:** 4-state UI feedback, CLAUDECODE unset, Claude Code sync fires
4. **Update System:** Checkpoint + health check lifecycle working, polling with proper cleanup
5. **Feature Toggles:** Defaults aligned across index.ts, options.ts, and UI (all 3 toggles)
6. **Task System:** Bidirectional sync verified, dedup by normalized title + date
7. **Chat:** Streaming, attachments (image + non-image), session tabs, auto-compact, private mode all working

### Documentation Site
- **New file:** `docs/index.html` — Comprehensive single-page documentation site (~57KB, self-contained)
- Dark theme, sticky sidebar navigation, search (Cmd+K), mobile responsive, print-friendly
- Sections: Architecture, Data Flow, Directory Structure, RPC Reference (127 methods), UI Architecture, Feature Guides (12 features), Data Model, Configuration, Development Guide, Changelog

---

## 2026-02-28

### Claude Code → Agent Log Integration
New service that syncs Claude Code sessions into the GodMode agent-log, so all coding activity (manual and agent-assisted) is visible in the Today view.
- `src/services/claude-code-sync.ts` — **new file**: scans `~/.claude/projects/` for session JSONL files, parses them via streaming readline (handles large files), extracts summary stats (duration, tool uses, files read/written, model, git branch), appends as "completed" entries to agent-log with channel context. Tracks synced sessions via `~/godmode/data/claude-code-sync.json` to avoid duplicates. Filters out trivial sessions (<1 min or <3 tool uses).
- `src/methods/agent-log.ts` — added `agentLog.syncClaudeCode` RPC handler that triggers a manual sync and broadcasts `agent-log:update` when new sessions are found.
- `src/methods/consciousness.ts` — added fire-and-forget `syncClaudeCodeSessions()` call after consciousness sync completes, so Claude Code sessions are automatically picked up whenever the user hits the golden sync button.

### Ship Readiness Verification Sprint
Verified all major systems are fully wired and production-ready. No code changes needed — everything was already built and connected.

**Systems verified as complete:**
1. **Onboarding wizard** — 7-phase deep onboarding + 8-step memory wizard, full-screen takeover rendering, identity form, config audit, file generation, re-launchable from Lab tab
2. **License gate** — `withLicenseGate()` wraps all RPC handlers, license API at `lifeongodmode.com/api/v1/license/validate`, dev keys `GM-DEV-*`/`GM-INTERNAL`, CLI activation via `openclaw godmode activate <key>`
3. **Consciousness sync UI** — 4-state feedback (idle/loading/ok/error) with animated icon, green glow on success, red glow on error, disabled during loading
4. **Feature toggles (Lab tab)** — 3 toggles: Focus Pulse (default on), Deck (default off), Mission Control (default off); persisted to `~/godmode/data/godmode-options.json`; broadcast on change
5. **Update system** — `godmode.update.check/run/pluginCheck` RPC handlers, overview card with version display and "Update Now" button, topbar pill for available updates, post-update health check in `gateway_start`
6. **Coding harness** — Full worktree-based coding orchestrator with GitHub integration, validation gates, PR creation, task state persistence

### Task Dedup Fix + Morning Set Workflow
Fixed 5 bugs causing duplicate tasks from daily brief sync, and implemented the morning set workflow.
- `src/methods/daily-brief.ts` — replaced 3-pass `parseAllBriefCheckboxes()` with single-pass regex + `normalizeTitle()` (strips bold markers, em-dash context, numbered prefixes, trailing punctuation); global dedup across all sections; `syncTasksFromBrief()` now ignores section differences (same normalized title + same date = same task); `exactTitleMatch()` normalizes both sides
- `src/methods/focus-pulse.ts` — `startMorningSet()` now delegates task sync to `syncTasksFromBrief()` instead of inline copy; adds overdue auto-kick: pending tasks with dueDate < today get bumped to tomorrow (unless they're in Win The Day set)
- `~/godmode/data/tasks.json` — manually cleaned from 30 to 17 tasks, removing all duplicates caused by section-aware dedup and em-dash context capture

### Consciousness Sync Fix
Fixed the consciousness sync pipeline (gold icon + hourly heartbeat). Session harvest was silently failing because the `claude` CLI refuses to run inside Claude Code sessions (CLAUDECODE env var blocks nested invocations).
- `~/godmode/scripts/consciousness-sync.sh` — added `unset CLAUDECODE` before running Python scripts
- `~/godmode/scripts/session-harvest.py` — swapped call priority: tries API key first (faster, no env issues), falls back to CLI; respects `OPENCLAW_STATE_DIR` for session path; better error messages
- `~/godmode/scripts/consciousness-heartbeat.sh` — enriched CONSCIOUSNESS.md generation: reads task status from tasks.json (pending/completed/overdue counts + top 4 items), points daily brief at Obsidian vault instead of missing digest file, adds session harvest status section, dynamic carry-forward (streak counter, user context), reads business context from new `~/godmode/memory/CONTEXT.md` instead of hardcoding
- `src/methods/consciousness.ts` — unsets CLAUDECODE in child process env; parses step statuses (harvest/clawvault/heartbeat) from script output and includes in response; raised line cap from 50 to 60
- `~/godmode/memory/CONTEXT.md` — **new file**: editable carry-forward context (business model, architecture, pipeline) that feeds into CONSCIOUSNESS.md

### Daily Brief Generator — Deep Repair
Built a complete `dailyBrief.generate` RPC method that assembles the daily brief from multiple live data sources, replacing the deleted legacy orchestrator. Also restored X Intelligence and added action-item extraction from yesterday's notes.
- `src/methods/brief-generator.ts` — **new file**: full brief generation engine with 6 parallel data sources: Calendar (gog CLI), Oura biometrics (REST API), Weather (wttr.in — no API key needed), X Intelligence (XAI Responses API with `grok-4-1-fast-non-reasoning` + `x_search` tool), Yesterday's carry-forward (unfinished tasks, Tomorrow Handoff, action items from Notes/brain dumps), and strategic context (CONTEXT.md, THESIS.md). Two RPC handlers: `dailyBrief.generate` (full brief assembly + vault write) and `dailyBrief.extractActions` (on-demand action-item extraction from any daily note). Supports `dryRun` mode to check data source health without writing.
- `index.ts` — registered `briefGeneratorHandlers`
- `~/godmode/.env` — added `GOG_CALENDAR_ACCOUNT` and `GOG_CLIENT=godmode` for calendar integration
- **Action-item extraction**: Parses Notes, Meeting Notes, Brain Dump, and Captured sections from yesterday's daily note. Detects: unchecked checkboxes, labeled task blocks (FIXES:, EXTRA:, TODO:, ACTION ITEMS:), and prose with task-like patterns (need to, should, follow up with, send, fix, build, etc.)
- **X Intelligence**: Uses XAI Responses API (`https://api.x.ai/v1/responses`) with `grok-4-1-fast-non-reasoning` model and `x_search` tool. Key from `~/.openclaw/.env` (XAI_API_KEY). Parses inline citation URLs from response text. bird CLI is deprecated.
- **Weather**: Uses `wttr.in` with user-configured location (free, no API key). Returns temp, condition, weather code → emoji. Location read from `godmode-options.json` or `CONTEXT.md`.
- **Calendar integration**: Reads events via gog CLI, formats schedule with times + durations, calculates deep work windows, generates meeting prep section with attendee lookup hints. gog auth requires `--services calendar` flag (not just default user scope).
- **Carry-forward**: Reads yesterday's brief, extracts unchecked Win The Day items and Tomorrow Handoff items, merges (dedup) into today's Win The Day section as numbered checkboxes

### NBSP Checkbox Fix
Non-breaking space characters (U+00A0) from paste events or contenteditable were silently breaking `marked`'s task list checkbox detection, causing checkboxes to render as literal `[ ]` text. Fixed at three layers.
- `ui/src/ui/html-to-markdown.ts` — `cleanUpMarkdown()` now strips NBSP → space before saving, preventing contenteditable from injecting them
- `src/methods/daily-brief.ts` — `parseAllBriefCheckboxes()` normalizes NBSP before regex parsing; `syncBriefFromTasks()` normalizes on read and writes clean content back even if no checkbox state changed
- `src/methods/brief-generator.ts` — calendar error handler now detects "No auth for calendar" and shows exact fix command with `--services calendar` flag

### Calendar Auth Root Cause
gog CLI stores OAuth tokens in system keychain. Two failure modes discovered:
1. `gog auth add` without `--services calendar` defaults to user-info scope — token saves but lacks calendar permission
2. Keychain ACLs may block non-terminal processes (node, gateway) from reading the token — platform-specific fix required

### Memory Consolidation & Hierarchy
Defined and enforced a memory hierarchy so conflicting facts resolve deterministically. Added two new maintenance scripts and wired them into the weekly cron.
- `~/godmode/AGENTS.md` — added Memory Hierarchy table (Tiers 1-9 with canonical source per fact type), revised Session Startup Protocol to exact 6-file read order, added critical rule: "THESIS wins" when project files contradict, moved `curated.md` to on-demand only
- `~/godmode/HEARTBEAT.md` — rewrote On Wake section with numbered startup sequence matching AGENTS.md, removed stale fork-based Upstream Sync section (replaced with npm update check), updated Weekly section with new steps 2-3, updated self-evolving system Loop 2 description
- `~/godmode/scripts/memory-staleness-check.sh` — **new script**: scans `memory/projects/` for stale files; >7 days gets a stale warning header prepended; >30 days gets archived to `memory/archives/projects/YYYY-MM/`; supports `--apply` flag (dry run by default)
- `~/godmode/scripts/memory-sync-thesis.sh` — **new script**: cross-layer conflict detection using Claude haiku; compares project summary/strategy/plan files against THESIS.md; flags contradictions by severity (high/medium/low) to `memory/reports/memory-conflicts-YYYY-MM-DD.md`; appends "Superseded — See THESIS.md" block to conflicting files; supports `--apply` flag
- `~/godmode/scripts/weekly-maintenance.sh` — expanded from 5 to 7 steps: added Step 2 (staleness check) and Step 3 (thesis sync) between pruning and auto-checks; uses `; true` pattern for grep -c to avoid exit-code doubling

---

## 2026-02-27

### Update System Overhaul — OpenClaw Updater
The entire update system was converted from a git-fork-sync workflow to an npm-based OpenClaw updater. GodMode is now a standalone plugin, so updates mean updating the user's OpenClaw installation, not syncing a git upstream.
- `src/methods/system-update.ts` — **new file**: 3 RPC handlers (`godmode.update.check`, `godmode.update.run`, `godmode.update.pluginCheck`) that check npm versions and run `openclaw update --yes`
- `index.ts` — registered new handlers, added post-update health check in `gateway_start` hook (writes checkpoint before update, verifies plugin survived on next boot)
- `ui/src/ui/controllers/updates.ts` — polls `godmode.update.check` instead of `system.checkUpdates`, with legacy fallback
- `ui/src/ui/controllers/config.ts` — `runUpdate()` calls `godmode.update.run` instead of `update.run`
- `ui/src/ui/views/overview.ts` — new `UpdateStatus` type with `openclawVersion`, `pluginVersion`, `openclawUpdateAvailable`, `pluginUpdateAvailable`; rewrote Updates card to show both versions with clear upgrade paths
- `ui/src/ui/app-render.ts` — topbar pill checks `openclawUpdateAvailable || pluginUpdateAvailable` instead of `behind > 0`
- `ui/src/ui/app.ts`, `ui/src/ui/app-view-state.ts` — updated `updateStatus` type to match
- `scripts/godmode-update-check.sh` — simplified from 225 to ~110 lines, checks npm for both OpenClaw and GodMode plugin versions, references `openclaw update` instead of `./scripts/self-update.sh`
- `package.json` — tightened peer dependency from `>=2026.0.0` to `>=2026.2.0 <2027.0.0`
- **Deleted 6 legacy scripts** (~1,400 lines): `godmode-sync-upstream.sh`, `godmode-post-sync.sh`, `godmode-checkpoint.sh`, `godmode-rollback.sh`, `godmode-invariants.sh`, `godmode-health-check.sh`

### File Upload Fix
Non-image file uploads (PDFs, text files, etc.) were silently dropped by the OpenClaw gateway's `parseMessageWithAttachments()`, which only supports image attachments. Fixed at the plugin level: images still go through the gateway attachment pipeline, but non-image files are now inlined as base64 XML document blocks directly in the message text.
- `ui/src/ui/controllers/chat.ts` — rewrote attachment handling to separate image vs non-image paths

### Brief-Wide Checkbox → Task Sync
Previously only checkboxes in the "Win The Day" section became tasks. Now **every checkbox in the entire daily brief** automatically syncs as a task with smart deduplication. Tasks are tagged with their source section name (e.g., "Bonus", "Win The Day") for context.
- `src/methods/daily-brief.ts` — replaced `parseWinTheDayItems()` with `parseAllBriefCheckboxes()` using `listH2Sections()` for document-wide parsing; section-aware dedup with `exactTitleMatch()`; un-completion sync (unchecked brief → task reverts to pending); priority heuristic based on section name
- `src/methods/tasks.ts` — added `briefSection` field to `NativeTask` type and `allowedKeys`; extended sync trigger to fire on un-completion (`status === "pending"`)
- `ui/src/ui/views/workspaces.ts` — added `briefSection` to `WorkspaceTask` type; renders section badge in task rows
- `ui/src/styles/workspaces.css` — added `.ws-task-section` badge styling

### Checkbox Creation UX
Made creating checkboxes in the daily brief intuitive:
- **Cmd+L** (or Ctrl+L) toggles a checkbox on/off for the current line (Obsidian-style)
- **Enter** in a checkbox list auto-continues with a new checkbox item
- `ui/src/ui/views/daily-brief.ts` — added keydown handlers for both shortcuts

### Daily Brief Live Editing Mode
Eliminated the read/edit mode split. The daily brief is now always editable (contenteditable), like Obsidian. Checkboxes are always clickable, auto-save fires on input with 1500ms debounce, Cmd+S flushes immediately.
- `ui/src/ui/views/daily-brief.ts` — removed `editing`, `onEditStart`, `onEditEnd` props; removed toolbar code, `toggleCheckboxInMarkdown`, legacy textarea
- `ui/src/ui/app.ts` — removed `briefEditing` state; `handleBriefSave` now only updates `updatedAt` (not content) to prevent cursor loss on re-render
- `ui/src/ui/app-view-state.ts` — removed `briefEditing` from `ViewState`
- `ui/src/ui/app-render.ts` — removed edit mode prop passing
- `ui/src/ui/views/my-day.ts` — removed edit mode props
- `ui/src/ui/markdown.ts` — removed unused `toInteractiveReadHtml()`
- `ui/src/styles/my-day.css` — fixed checkbox `pointer-events` for live mode; removed ~170 lines of dead CSS (edit toolbar, save/cancel buttons, editing badge, legacy textarea)

### Chat Scrollbar Fix
The chat scrollbar was clipped on the right edge. `.chat-thread` had `margin: 0 -4px` pushing it outside `.chat-main`'s `overflow: hidden` boundary.
- `ui/src/styles/chat/layout.css` — removed negative margin, adjusted padding to `6px 2px 4px`

---

## 2026-02-26

### Task UI Refinements
Added "Add Task" button in All Tasks view, inline task title editing, Start button for pending tasks, and Today tab showing today's tasks.
- Commit: `2348115`

### Task Display Fixes
Tasks render above artifacts, folder sections expand/collapse, All Tasks view scrolls properly.
- Commit: `427cc67`

### Task UI in Workspaces
All-tasks view, folder-based display, session linking for tasks.
- Commit: `f58262c`

### Tasks Wired to Workspaces
Tasks linked to workspaces, session linking, daily rhythm sync integration.
- Commit: `7db2726`

### Trust Tracker Refactor
Removed trust tracker global prompt injection, added skill-level feedback system.
- Commit: `5f3444c`
