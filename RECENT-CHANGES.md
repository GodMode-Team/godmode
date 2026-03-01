# Recent Changes

This file tracks recent development changes so Atlas and other agents can quickly understand what's been modified and why.

---

## 2026-02-28 — Agent Coding Pipeline Safety Overhaul

### Problem
Prosper dispatched a coding agent (swarm pipeline) to build custom guardrails. The agent worked in a worktree, completed successfully, created PR #3. But:
1. Prosper never followed up — the tool description said "no follow-up action needed"
2. Prosper manually did `git merge` on main while there were ~38 uncommitted files (sidebar, coretex, navigation rework)
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

3. **Fix detached spawn** (`ff58528`) — Detached processes with `stdio: "ignore"` can't answer permission prompts, killing the agent after ~51s. Added `--dangerously-skip-permissions` flag. Resolved full binary path (`/opt/homebrew/bin/claude`) and PATH inheritance for homebrew.

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
- `~/godmode/scripts/consciousness-heartbeat.sh` — enriched CONSCIOUSNESS.md generation: reads task status from tasks.json (pending/completed/overdue counts + top 4 items), points daily brief at Obsidian vault instead of missing digest file, adds session harvest status section, dynamic carry-forward (Edison's age calculated, sobriety days computed), reads business context from new `~/godmode/memory/CONTEXT.md` instead of hardcoding
- `src/methods/consciousness.ts` — unsets CLAUDECODE in child process env; parses step statuses (harvest/clawvault/heartbeat) from script output and includes in response; raised line cap from 50 to 60
- `~/godmode/memory/CONTEXT.md` — **new file**: editable carry-forward context (business model, architecture, pipeline) that feeds into CONSCIOUSNESS.md

### Daily Brief Generator — Deep Repair
Built a complete `dailyBrief.generate` RPC method that assembles the daily brief from multiple live data sources, replacing the deleted legacy orchestrator. Also restored X Intelligence and added action-item extraction from yesterday's notes.
- `src/methods/brief-generator.ts` — **new file**: full brief generation engine with 6 parallel data sources: Calendar (gog CLI), Oura biometrics (REST API), Weather (wttr.in — no API key needed), X Intelligence (XAI Responses API with `grok-4-1-fast-non-reasoning` + `x_search` tool), Yesterday's carry-forward (unfinished tasks, Tomorrow Handoff, action items from Notes/brain dumps), and strategic context (CONTEXT.md, THESIS.md). Two RPC handlers: `dailyBrief.generate` (full brief assembly + vault write) and `dailyBrief.extractActions` (on-demand action-item extraction from any daily note). Supports `dryRun` mode to check data source health without writing.
- `index.ts` — registered `briefGeneratorHandlers`
- `~/godmode/.env` — added `GOG_CALENDAR_ACCOUNT` and `GOG_CLIENT=godmode` for calendar integration
- **Action-item extraction**: Parses Notes, Meeting Notes, Brain Dump, and Captured sections from yesterday's daily note. Detects: unchecked checkboxes, labeled task blocks (FIXES:, EXTRA:, TODO:, ACTION ITEMS:), and prose with task-like patterns (need to, should, follow up with, send, fix, build, etc.)
- **X Intelligence**: Uses XAI Responses API (`https://api.x.ai/v1/responses`) with `grok-4-1-fast-non-reasoning` model and `x_search` tool. Key from `~/.openclaw/.env` (XAI_API_KEY). Parses inline citation URLs from response text. bird CLI is deprecated.
- **Weather**: Uses `wttr.in/Austin,TX?format=j1` (free, no API key). Returns temp, condition, weather code → emoji.
- **Calendar integration**: Reads events via gog CLI, formats schedule with times + durations, calculates deep work windows, generates meeting prep section with attendee lookup hints. gog auth requires `--services calendar` flag (not just default user scope). macOS keychain ACLs must be set with `security set-generic-password-partition-list` to allow gateway process access.
- **Carry-forward**: Reads yesterday's brief, extracts unchecked Win The Day items and Tomorrow Handoff items, merges (dedup) into today's Win The Day section as numbered checkboxes

### NBSP Checkbox Fix
Non-breaking space characters (U+00A0) from paste events or contenteditable were silently breaking `marked`'s task list checkbox detection, causing checkboxes to render as literal `[ ]` text. Fixed at three layers.
- `ui/src/ui/html-to-markdown.ts` — `cleanUpMarkdown()` now strips NBSP → space before saving, preventing contenteditable from injecting them
- `src/methods/daily-brief.ts` — `parseAllBriefCheckboxes()` normalizes NBSP before regex parsing; `syncBriefFromTasks()` normalizes on read and writes clean content back even if no checkbox state changed
- `src/methods/brief-generator.ts` — calendar error handler now detects "No auth for calendar" and shows exact fix command with `--services calendar` flag

### Calendar Auth Root Cause
gog CLI stores OAuth tokens in macOS keychain (`gogcli` service). Two failure modes discovered:
1. `gog auth add` without `--services calendar` defaults to user-info scope — token saves but lacks calendar permission
2. macOS keychain ACLs block non-terminal processes (node, gateway) from reading the token — must run `security set-generic-password-partition-list` after auth to grant all local processes access
- `~/godmode/memory/MISTAKES.md` — updated with both failure modes and fix commands

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
