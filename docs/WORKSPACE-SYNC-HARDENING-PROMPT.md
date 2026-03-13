# Workspace Sync & Team Hardening — Build Prompt

**Date:** 2026-03-13
**Branches:** `feat/team-sync-hardening-claude` and `feat/team-sync-hardening-codex`
**Base branch:** `feat/interaction-ledger-l6`
**Goal:** Harden the existing team workspace system for real-world use tomorrow. Small team (<10), high trust.

---

## Context

GodMode's team workspace system is ~95% built. The plumbing is done. This task is about **hardening, testing, and filling the last gaps** — not building from scratch.

**Read `CLAUDE.md` before writing any code.** TypeScript ESM only. `pnpm build && pnpm typecheck` must pass.

---

## What Already Works (DO NOT REBUILD)

Before you write any code, read these files to understand what exists:

### Tools (ally can already use these)
- `src/tools/team-message.ts` — `team_message` tool. Sends messages to team feed (JSONL). Types: handoff, question, alert, blocked, fyi. **Registered in index.ts.**
- `src/tools/team-memory.ts` — `team_memory_write` tool. Writes knowledge entries to team workspace `memory/` dir, triggers curation, pushes via git. **Registered in index.ts.**

### Context Injection (ally already sees team context)
- `src/hooks/team-bootstrap.ts` — On every `before_prompt_build`, if session is in a team workspace, injects:
  - **P0:** AGENTS.md (team SOPs)
  - **P1:** memory/MEMORY.md (shared knowledge)
  - **P2:** skills/*.md (team skills)
  - **P3:** tools/*.yaml (tool configs)
  - Budget-capped at ~15KB with priority-based truncation.

### Comms Feed
- `src/lib/team-feed.ts` — Append-only JSONL at `{workspace}/comms/feed.jsonl`. Per-member cursor tracking. Unread detection via `getUnreadMessages()`. 5MB tail-read safety.

### Sync
- `src/lib/workspace-sync-service.ts` — Git-based bi-directional sync. Pull on interval (default 5 min), push on file change (chokidar). Conflict detection pauses sync.

### Scaffold
- `src/lib/team-workspace-scaffold.ts` — Creates: `memory/`, `skills/`, `tools/`, `comms/`, `artifacts/`, `clients/`, `integrations/`, `AGENTS.md`, `.godmode/workspace.json`, `.godmode/comms.yaml`, `.godmode/sync.yaml`, `README.md`.

### RPC Handlers
- `src/methods/team-workspace.ts` — `team.createTeam`, `team.joinTeam`, `team.leaveTeam`, `team.provisionTeam`, `team.syncNow`, `team.syncStatus`
- `src/methods/team-comms.ts` — `comms.send`, `comms.feed`, `comms.unread`
- `src/methods/team-curation.ts` — `curation.run`, `curation.status`, `curation.candidates`

### UI
- `ui/src/ui/views/workspaces.ts` + `ui/src/ui/controllers/workspaces.ts` — Full workspace management UI.

---

## What Needs Hardening (YOUR JOB)

### Gap 1: Unread Team Messages Not Surfaced to Ally (CRITICAL)

The `team-bootstrap.ts` hook injects SOPs, memory, skills, and tools — but it does NOT inject unread comms messages. The ally has the `team_message` tool to SEND messages, but never SEES incoming messages unless it explicitly uses the tool to read.

**Fix:** In `src/hooks/team-bootstrap.ts`, add a section that:
1. Calls `getUnreadMessages()` from `src/lib/team-feed.ts` for the active team workspace
2. If there are unread messages, format them and add as a priority 0.5 section (between SOPs and memory)
3. Cap at 10 most recent unread messages
4. After injecting, call `markFeedRead()` so they don't repeat next turn

The member ID for cursor tracking comes from `resolveGitMemberId()` in `src/lib/team-workspace-scaffold.ts`.

### Gap 2: Conflict Recovery (HIGH)

When git sync hits a merge conflict, it pauses forever with no recovery path. The user is stuck.

**Fix:** Add a `team.resolveConflict` RPC handler in `src/methods/team-workspace.ts`:
- Params: `workspaceId`, `strategy` ("ours" | "theirs")
- "ours": `git checkout --ours . && git add -A && git commit -m "resolve: keep local"`
- "theirs": `git checkout --theirs . && git add -A && git commit -m "resolve: accept remote"`
- After resolution, resume sync by calling `syncService.resumeSync(workspaceId)` or equivalent
- Check if workspace-sync-service.ts has a resume mechanism. If not, add a simple `resume(workspaceId)` method that clears the `"conflict"` state and restarts the interval.

### Gap 3: End-to-End Smoke Test (HIGH)

Create a simple test script at `tests/smoke-team-workspace.mjs` that verifies the full loop:

1. Create a team workspace via RPC (or directly via scaffold function)
2. Write a memory entry via `team_memory_write` tool logic
3. Send a comms message via `team_message` tool logic
4. Read unread messages and verify the message appears
5. Verify team-bootstrap would inject the workspace context
6. Clean up

This doesn't need a running gateway — just import the functions directly and test the file I/O pipeline.

### Gap 4: Sync Interval Tuning (NICE TO HAVE)

Default pull interval is 5 minutes (`normalizeIntervalMs` returns `5 * 60 * 1000` when no config). For real-time team collaboration, 30 seconds is better.

**Fix:** In workspace config or sync service, default to 30s for team workspaces. Or just make sure the workspace config's `syncIntervalMs` field is documented so users can set it.

### Gap 5: Multi-Workspace Team Context (NICE TO HAVE)

`team-bootstrap.ts` currently only injects context for ONE workspace (the session's workspace). But a user might be in multiple team workspaces (TRP, Patient Autopilot, GodMode).

**Consider:** Should unread messages from ALL team workspaces be surfaced, even if the current session is in a different workspace? At minimum, inject a line like "You have unread messages in 2 other team workspaces: TRP (3), Patient Autopilot (1)" at P2 priority. Don't inject the full messages from other workspaces — just the count.

---

## What NOT To Build

- **No permissions/roles** — Git handles access. Small trusted team.
- **No membership management UI** — Add people to GitHub repo. Done.
- **No audit log** — `git log` is the audit log.
- **No invitation flow** — Share the repo URL.
- **No selective sync** — `git add -A` is fine.
- **No curation LLM** — Merge-based fallback works for now.
- **No real-time WebSockets** — Git sync on interval is the mechanism.

---

## File Changes Summary

**Modified files (2-3):**
| File | Changes |
|------|---------|
| `src/hooks/team-bootstrap.ts` | Add unread comms injection (Gap 1), optional multi-workspace counts (Gap 5) |
| `src/methods/team-workspace.ts` | Add `team.resolveConflict` RPC (Gap 2) |
| `src/lib/workspace-sync-service.ts` | Add `resume()` method if missing (Gap 2) |

**New files (1):**
| File | Purpose |
|------|---------|
| `tests/smoke-team-workspace.mjs` | End-to-end smoke test (Gap 3) |

**Target: 2-3 modified files, 1 new file. Minimal changes.**

---

## The Real Test Tomorrow

1. Create team workspaces for TRP, Patient Autopilot, GodMode — each backed by a private GitHub repo
2. Team members `team.joinTeam` with the repo URL
3. Someone says "Tell the team I'm starting on VSL scripts" → ally uses `team_message` → git syncs → other members' allies see the message on their next turn
4. Someone drops a skill into `TRP/skills/vsl-framework.md` → git syncs → all team allies have access
5. Research notes in `TRP/memory/` → visible in all team allies' context via team-bootstrap

**If those 5 things work, we ship it.**

---

## Build Checklist

```bash
pnpm build && pnpm typecheck

# Run the smoke test
node tests/smoke-team-workspace.mjs
```

---

## Guardrails

- **DO NOT rebuild what exists.** Read the existing files first. Most of this system is done.
- **DO NOT build a chat platform.** JSONL feed surfaced through ally context.
- **DO NOT add authentication or permissions.** Git handles it.
- **DO NOT add dependencies.** Use what's there.
- **Keep changes minimal.** The system works — you're filling gaps and hardening.
