# GodMode Plugin - Agent Context

This repository is the standalone home for the GodMode OpenClaw plugin.

## Product Architecture — READ FIRST

**Read `docs/GODMODE-META-ARCHITECTURE.md` before making any architectural decisions.** It is the definitive blueprint for how GodMode gets built.

**Read `HARNESS.md` for agent workflow rules** — branching, building, merging, handing off. Follow it.

**Read `TEAM-WORKFLOW.md` for team collaboration rules** — slash commands (`/bug`, `/fix`, `/pr-review`, `/sync`), branch protection, and CI enforcement.

### What GodMode Is
GodMode is a deeply contextual personal AI ally that manages a swarm of agents. The ally is 80% of the value (deep context, coworking in chat). Agent delegation is 20%. GodMode is the conductor, not the orchestra — it connects to the user's existing tools, never rebuilds them.

### The Three Golden Rules
1. **Code as little as possible.** Can this be a file (persona, skill, recipe)? If yes, don't write TypeScript. Only write engine code for: ally identity, context stack, orchestration, queue processing, trust tracking.
2. **Conduct, don't rebuild.** NEVER build a CRM, file explorer, project management tool, email client, calendar app, note editor, code editor, social media manager, analytics platform, or chat platform. The ally connects to the user's existing tools via API/MCP.
3. **Meta-agent pattern.** The ally crafts precise prompts for sub-agents. Quality scales through prompt quality, not more code.

### Scope Boundaries — NEVER Build These
- CRM / contacts manager → plug into Apple Contacts, HubSpot, Google
- File explorer / storage → ally reads/writes files via tools
- Project management (boards, sprints, dependencies) → ally reads/writes ClickUp, Linear, Asana via API
- Email client → ally reads email via integration
- Calendar app → Today tab shows schedule, don't rebuild calendar
- Note-taking app → Obsidian IS the note-taking app
- Code editor → VS Code, Cursor exist
- Social media manager → content-writer persona creates content, user posts via their tool

### Task System Scope
GodMode tasks = flat operational notepad (title, due date, status, workspace). No hierarchy, no subtasks, no boards. Big projects = markdown artifacts the ally creates. Ally bridges to external PM tools, never mirrors them.

### The 6-Tab UI Baseline
Chat → Today → Work → Second Brain → Dashboards → Settings. Everything else hides behind Settings. Work tab shows GodMode artifacts ONLY: sessions, agent outputs, tasks, artifacts, skills, workspace memory.

### Anti-Bloat Rule
Nothing gets permanent context injection. New capabilities are files (personas, skills) or conditional context (state-checked, injected only when relevant). The only always-on injection: ally identity (~30 lines) + awareness snapshot (~50 lines).

## Default Development Workflow — MANDATORY

When the user gives a task, plan, or big prompt, follow this pipeline automatically. Do NOT skip steps. Invoke each skill via the Skill tool at the appropriate phase.

### Phase 0: Understand
- **Any creative/design work** → invoke `/brainstorming` FIRST. Explore intent before touching code.
- **Big task or spec** → invoke `/writing-plans` to produce a plan in `docs/plans/`.
- **Vague idea** → invoke `/gstack-office-hours` (builder mode) to shape it into a design doc.

### Phase 1: Review the Plan
- **Every plan gets reviewed.** Invoke `/gstack-plan-eng-review` for architecture, data flow, edge cases.
- **If plan touches UI** → also invoke `/gstack-plan-design-review` for interaction states, responsive, accessibility.
- **If plan is strategic/scope-heavy** → also invoke `/gstack-plan-ceo-review` for scope challenge.
- Fix the plan based on review feedback before writing any code.

### Phase 2: Safety Rails
- Invoke `/gstack-guard` at session start for destructive command warnings + edit boundary enforcement.
- If working in a specific directory, invoke `/gstack-freeze` to lock edits to that scope.

### Phase 3: Implement
- **Multiple independent tasks** → invoke `/dispatching-parallel-agents` to parallelize.
- **Sequential tasks from a plan** → invoke `/executing-plans` or `/subagent-driven-development`.
- **Writing new features** → follow `/test-driven-development` (failing test first, always).
- **Hit a bug** → invoke `/systematic-debugging`. NEVER guess at fixes.

### Phase 4: QA
- After implementation, invoke `/gstack-qa` to systematically test and fix issues.
- For report-only (no fixes), use `/gstack-qa-only`.
- If the project has a live UI, invoke `/gstack-browse` for headless browser QA.

### Phase 5: Review & Ship
- Invoke `/gstack-review` for pre-landing code review (SQL safety, trust boundaries, side effects).
- Invoke `/verification-before-completion` before claiming anything is done.
- Invoke `/gstack-ship` for the full ship workflow (merge base → test → version bump → changelog → PR).

### Phase 6: Post-Ship
- Invoke `/gstack-document-release` to sync all docs to match what shipped.
- Invoke `/gstack-retro` periodically (weekly or after big features) for retrospective.

### Quick Reference — When to Use What
| Situation | Skill |
|---|---|
| "Build X" / "Add Y" / new feature | brainstorming → writing-plans → plan-eng-review → implement → qa → ship |
| "Fix this bug" / test failure | systematic-debugging → fix → qa → ship |
| "Review this PR" / pre-merge | gstack-review → verification-before-completion |
| "Here's a plan from Prosper" | plan-eng-review → (plan-design-review if UI) → executing-plans → qa → ship |
| "What should we build?" / strategy | gstack-office-hours → brainstorming → writing-plans |
| "Ship it" | gstack-ship |
| "How'd we do this week?" | gstack-retro |
| "Get a second opinion" | gstack-codex |
| "Design the look and feel" | gstack-design-consultation → gstack-plan-design-review |

### Override Rules
- User can skip any phase by saying "skip review", "just code it", etc.
- If the task is trivially small (< 5 minutes, single file), skip Phases 0-1 and go straight to implement → verify.
- Always invoke `/verification-before-completion` before claiming done, regardless of task size.

## Mission

- Keep GodMode fully self-contained.
- Do not depend on OpenClaw monorepo source paths (no `../../../../src/*` imports).
- Preserve compatibility with host OpenClaw runtime via `openclaw/plugin-sdk`.

## Runtime Model

- Host: OpenClaw gateway loads this plugin through plugin entry config.
- Entry point: `index.ts`.
- RPC handlers: `src/methods/*.ts`.
- Shared helpers: `src/lib/*.ts`.
- Services: `src/services/*.ts`.
- Data root: `~/godmode` by default, overridable with `GODMODE_ROOT`.

## Key Data Paths

- `~/godmode/data/*` for plugin-owned JSON state.
- `~/godmode/memory/*` for markdown and memory artifacts.
- OpenClaw state for host session data: `~/.openclaw` (or `OPENCLAW_STATE_DIR`).

## Current Architecture Notes

- `agent-log` and `workspaces` handlers are plugin-local.
- `workspaces-config` and `workspace-sync-service` are plugin-local copies.
- `server-startup` in OpenClaw core should not initialize GodMode services directly.
- Plugin `gateway_start` initializes optional agent-log writer integration.

### Lean Architecture (post v1.2 audit)
- **Context injection:** ~150 lines/turn via `before_prompt_build` (down from ~1,500).
- **Memory:** 2 systems — Obsidian Vault (long-term) + Awareness Snapshot (ephemeral, 15-min refresh).
- **Safety gates:** 4 active — loopBreaker, promptShield, outputShield, contextPressure.
- **Vault-capture:** 2 pipelines — Sessions→Daily, Queue Outputs→Inbox.
- **Awareness snapshot:** `src/lib/awareness-snapshot.ts` — ~50-line ephemeral state injected every turn. Replaces CONSCIOUSNESS.md + WORKING.md dumps.
- **Killed modules:** coding orchestrator, swarm pipeline, session coordinator, focus pulse, lifetracks, life dashboards, clawhub, subagent-runs, security-audit, rescuetime, org-sweep, session-archiver, cron-guard. All preserved at `git tag v1.1.0-pre-lean-audit`.

## Build and Dev

- Install: `pnpm install`
- Build: `pnpm build`
- Sync fallback UI snapshot: `pnpm ui:sync`
- Typecheck: `pnpm typecheck`
- Clean: `pnpm clean`

## UI Source

- UI source lives in `ui/` (Lit web components, Vite build).
- `pnpm build:ui` builds to `ui/dist/`; `pnpm bundle:ui` copies into `dist/godmode-ui/`.
- `pnpm dev:ui` starts Vite dev server for UI development.
- Never hand-edit `assets/godmode-ui/*` or `dist/godmode-ui/*`.
- `assets/godmode-ui/` is a committed fallback snapshot for npm installs that skip the build.
- Refresh fallback: `pnpm ui:sync` and commit if changed.

## Coding Guardrails

- TypeScript ESM only.
- Keep handlers deterministic and filesystem-safe.
- Validate and normalize all user-controlled paths.
- Do not read/write outside allowed roots.
- Prefer explicit error objects: `{ code, message }`.
- Avoid prototype mutation and `any` unless unavoidable.

## Dependency Policy

- Runtime host dependency is `openclaw/plugin-sdk`.
- Keep plugin runtime dependencies minimal.
- Do not pin to OpenClaw monorepo-relative imports.

## Release Notes

- Package name: `@godmode-team/godmode`.
- Keep `openclaw.plugin.json` version metadata aligned with package release strategy.
- Validate standalone build before publishing.

## Branch Discipline

- **NEVER work directly on `main`** — always create or switch to a feature branch.
- **One branch per task** (e.g., `feat/my-feature`, `fix/bug-name`).
- **NEVER use `git stash`** — commit to your branch instead, even as WIP commits.
- If you detect you're on `main`, create a branch immediately: `git checkout -b feat/<task-slug>`.
- **Enforced by hook:** `scripts/hooks/branch-guard.sh` blocks Edit/Write on `main`.
- **Enforced by GitHub:** Branch protection requires CI + 1 PR review before merge.

## Team Slash Commands

These commands are available to all team members via Claude Code:
- `/bug <description>` — File a GitHub Issue from a bug report or screenshot.
- `/fix <issue# or "next">` — Pick up an issue, create branch, fix, push, open PR.
- `/pr-review [number]` — Review open PRs, approve, merge.
- `/sync` — Pull latest main, rebuild, see what changed.

## AI Session Checklist

Before shipping changes:

1. Search for forbidden imports:
   - `rg "\.\./\.\./\.\./\.\./src/" -n`
2. Build plugin:
   - `pnpm build`
3. If UI changed, refresh snapshot fallback:
   - `pnpm ui:sync`
4. Confirm handlers still export expected RPC methods.
5. Confirm no host-core-only assumptions were introduced.
6. If on `main`, move your changes to a feature branch before committing.
