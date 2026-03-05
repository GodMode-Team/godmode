# Session Prompt: Agent Roster + Onboarding + Security Hardening

## Context
You're working on `godmode-plugin` — a personal AI OS built as an OpenClaw plugin. v1.4.1 was just published after a massive lean audit that cut 32 files, reduced context injection from ~1,500 to ~150 lines/turn, and consolidated 6 memory systems to 2.

**Read these files first** (in parallel):
- `CLAUDE.md` — coding conventions and architecture
- `RECENT-CHANGES.md` — what just shipped in v1.4.0/v1.4.1
- `~/godmode/memory/projects/godmode/research-2026-03-04.md` — research findings driving this work
- `src/lib/agent-roster.ts` — current roster system
- `src/methods/onboarding.ts` + `src/methods/onboarding-types.ts` — current onboarding
- `src/hooks/onboarding-context.ts` — onboarding context injection
- `scripts/install.sh` + `scripts/install.ps1` — install scripts

**Current agent roster** (thin — only 3 personas):
- `~/godmode/memory/agent-roster/_defaults/researcher.md`
- `~/godmode/memory/agent-roster/engineering/frontend-developer.md`
- `~/godmode/memory/agent-roster/operations/ops-runner.md`

---

## Tasks (run in parallel where possible)

### 1. URGENT: Fix dmScope (10 min)
The OpenClaw default `dmScope` is `main`, which collapses all DMs from different users into one session — data leak risk.

- Add `openclaw config set sessions.dmScope per-channel-peer` to `scripts/install.sh` (Step 8, after the other config sets)
- Add the same to `scripts/install.ps1` (Step 7)
- Add dmScope check to onboarding `configAudit` in `src/methods/onboarding.ts`
- Sync install scripts to `site/` copies

### 2. Create Founder-Facing Starter Personas (1 hour)
The current roster is developer-biased. GodMode's target customer is non-technical entrepreneurs. Create 6 starter personas:

**Before writing:** Read `https://github.com/msitarzewski/agency-agents` — specifically the Evidence Collector, Reality Checker, and Growth Hacker agents. Extract their best patterns:
- Personality/voice (not robotic)
- Evidence-backed completion ("no done without proof")
- Structured deliverables
- Success metrics

**Personas to create** (write as `.md` files with YAML frontmatter matching the format in `agent-roster.ts`):

| Slug | Name | Category | taskTypes | Purpose |
|------|------|----------|-----------|---------|
| `researcher` | Researcher | _defaults | research,url | Keep existing, enhance with evidence pattern |
| `writer` | Writer | creative | creative,review | Drafts, emails, proposals, social posts, copy |
| `analyst` | Analyst | operations | analysis,research | Spreadsheets, financial models, market analysis, data |
| `task-runner` | Task Runner | operations | ops,task | Infrastructure, automation, maintenance, errands |
| `creative-director` | Creative Director | creative | creative | Brand, design briefs, visual direction, campaigns |
| `growth` | Growth Strategist | operations | research,analysis | Funnels, competitive intel, campaign ideas, GTM |

Each persona file should have:
- YAML frontmatter: `name`, `taskTypes`, `engine` (default: claude), `mission` (NEW field — one sentence of outcome ownership)
- Body: identity, approach, output standards, evidence requirements, handoff protocol
- Keep each under 40 lines — lean, not bloated

**Also:** Add `mission:` field support to `src/lib/agent-roster.ts` PersonaProfile type and frontmatter parser.

Move `frontend-developer.md` out of the default roster — it's a developer persona, not a founder persona. Keep it at `~/godmode/memory/agent-roster/engineering/frontend-developer.md` for Caleb's personal use but don't ship it as a default.

Write the new files to `~/godmode/memory/agent-roster/` with the proper category subdirectories.

### 3. "Meet Your Team" Onboarding Screen (2-3 hours)
Add a new phase to onboarding that shows users their agent roster after the wizard generates their workspace.

**Where it fits:** After Phase 3 (wizard generation) and before Phase 5 (first win demo). The flow:
1. User completes soul profile interview → wizard generates workspace
2. **NEW: "Meet Your Team" screen** — shows the 5-6 agents that were seeded
3. User proceeds to first win demo

**Backend (`src/methods/onboarding.ts`):**
- Add `onboarding.seedRoster` RPC: reads the user's profile (role, mission from wizard), selects appropriate starter personas, copies them to the user's roster directory
- Add `onboarding.roster` RPC: returns the list of seeded personas for the UI to display

**Frontend (`ui/src/ui/views/onboarding-setup.ts` or new file):**
- "Meet Your Team" card grid: each agent shows name, mission one-liner, specialty icon
- Header copy: *"Your AI team is ready. Your ally manages them — you just say what you need."*
- Sub-copy: *"Each specialist handles a different kind of work. As you use GodMode, they learn your preferences and get better."*
- Brief animation or reveal (cards appear one by one, subtle)
- "Let's Go" button proceeds to next phase

**Don't overengineer:** This is a read-only reveal screen. No agent configuration, no drag-and-drop, no settings. Just show them and move on.

### 4. Verification Gate for Queue Completion (1 hour)
When a background agent marks a task as done in the queue, require an artifact.

**In `src/services/queue-processor.ts`:**
- After agent completes, check if the result contains evidence (file path, URL, PR link, command output, test result)
- If coding task type and no PR link/file path → mark as `needs-review` instead of `completed`, add note: "No artifact provided — verify manually"
- Don't block non-coding tasks (research, creative) — those have natural text deliverables

**In `src/lib/queue-state.ts`:**
- Add `needs-review` to QueueItemStatus if not already there
- Add optional `artifacts: string[]` field to QueueItem

### 5. Build, Test, Publish
After all tasks are done:
- `pnpm build && pnpm typecheck` — zero errors
- `pnpm build:ui && pnpm ui:sync` — UI clean
- Bump version to 1.5.0 in both `package.json` and `openclaw.plugin.json`
- Sync install scripts: `cp scripts/install.sh site/install.sh && cp scripts/install.ps1 site/install.ps1`
- Push updated install scripts to `MrCalebH/godmode-website` repo (clone to /tmp, copy files, commit, push)
- Update RECENT-CHANGES.md
- Commit, tag v1.5.0, push, `npm publish --access public`

---

## Constraints
- **Lean.** We just cut 32 files. Don't add bloat back. Every new file must earn its place.
- **Founder-facing.** The target user is a non-technical entrepreneur. Every word, every UI element should resonate with them, not developers.
- **Don't rebuild killed features.** Coding orchestrator, focus pulse, session coordinator — these are dead. Don't resurrect them.
- **Run `/bug-hunt` on your changes** before publishing. The `.claude/commands/bug-hunt.md` file has the 3-phase adversarial process.
