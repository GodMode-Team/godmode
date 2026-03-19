# Paperclip → Hermes Integration Plan

## The Discovery

**Paperclip already has a first-party Hermes adapter built in.** The package `hermes-paperclip-adapter` is installed in the Paperclip server's dependency tree and registered in the adapter registry as `hermes_local`. It:

- Spawns `hermes chat -q` (single-query mode) with task instructions
- Captures stdout/stderr, parses token usage and session IDs
- Reports results back to Paperclip
- Supports session persistence via `--resume` (agent picks up where it left off)
- Has full config: model, toolsets, timeout, context files, prompt templates, env vars

**There is already one test agent registered with `adapterType: "hermes_local"` — "Hermes Researcher" — but it's in `status: "error"`.** The other 36 agents are set to `openclaw_gateway` (dead adapter pointing at a non-running OpenClaw WebSocket).

## What This Means

We don't need to build ANY adapter code. Paperclip's heartbeat service already knows how to:
1. Wake up an agent when it has work
2. Look up the adapter type (`hermes_local`)
3. Call the Hermes adapter's `execute()` function
4. The adapter spawns `hermes chat -q` with the task prompt
5. Capture results and update issue status

**The entire execution pipeline exists. It just needs agents configured correctly and tasks flowing through it.**

## Architecture

```
User → "Build me a landing page"
  → Prosper (Hermes ally) decomposes work
  → delegate-tool creates Paperclip project + issues
  → Paperclip assigns issues to agents (by role from org chart)
  → Heartbeat fires → hermes_local adapter → spawns `hermes chat -q`
  → Each agent has full Hermes toolset (terminal, file, web, memory, skills)
  → Results report back to Paperclip → issue status updates
  → Completion poller (already running) detects done issues → writes to inbox
  → Prosper synthesizes results for user
```

## Implementation Tasks

### Task 1: Update All 36 Agents from `openclaw_gateway` → `hermes_local`

**File:** Script (one-time API call)  
**Effort:** 30 minutes

The 36 agents currently have `adapterType: "openclaw_gateway"` pointing at `ws://127.0.0.1:18789/ws` (dead OpenClaw). Update them all to `hermes_local` with proper config.

```bash
# For each agent, PATCH the adapter config:
curl -X PATCH "http://localhost:3100/api/agents/{agentId}" \
  -H "Content-Type: application/json" \
  -d '{
    "adapterType": "hermes_local",
    "adapterConfig": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "maxIterations": 50,
      "timeoutSec": 600,
      "persistSession": true,
      "enabledToolsets": ["terminal", "file", "web", "code_execution"]
    }
  }'
```

Use the bridge config at `~/godmode/data/paperclip-bridge.json` for the agent ID list. Script should:
1. Read bridge config for all 37 agent IDs
2. For each agent, PATCH to `hermes_local` adapter type
3. Set model based on agent role (heavier model for complex roles, lighter for simple)
4. Set appropriate toolsets per role (engineers get terminal+file, researchers get web, etc.)
5. Verify each agent's status flips to `idle` (not `error`)

**Key config decisions per role type:**
- **Engineers** (frontend-dev, software-architect, etc.): `enabledToolsets: ["terminal", "file", "web", "code_execution"]`, `timeoutSec: 1800`
- **Researchers** (researcher, ux-researcher, analyst): `enabledToolsets: ["web", "file", "terminal"]`, `timeoutSec: 600`
- **Writers** (content-writer, technical-writer, writer): `enabledToolsets: ["file", "web"]`, `timeoutSec: 300`
- **Reviewers** (code-reviewer, qa-reviewer, copy-reviewer): `enabledToolsets: ["terminal", "file", "web"]`, `timeoutSec: 600`
- **Ops/Admin** (ops-runner, life-admin, finance-admin): `enabledToolsets: ["terminal", "file", "web"]`, `timeoutSec: 300`

**Verify the "Hermes Researcher" agent (already `hermes_local`) — why is it in `error` status?** Check heartbeat logs. Likely missing Hermes CLI or wrong config. Fix this first as proof-of-concept.

---

### Task 2: Fix the `delegate-tool.ts` — Paperclip as Primary, Remove Fallback Split

**File:** `src/tools/delegate-tool.ts`  
**Effort:** 1-2 hours

Current flow (lines 134-198): if Paperclip is ready, create issues there. If that fails or Paperclip isn't ready, fall through to local queue. This dual-path creates confusion and means Paperclip tasks never execute (they just sit as issues with no adapter running them).

**New flow:**
1. Paperclip is always the primary path (it IS running, it HAS the Hermes adapter)
2. Create project + issues in Paperclip
3. Paperclip's heartbeat service handles execution via `hermes_local` adapter
4. Remove the local-queue fallback path for delegated projects (keep local queue for single `queue_add` items)
5. After creating issues, optionally trigger an immediate wakeup via API instead of waiting for heartbeat timer

**Changes:**

```typescript
// In the delegate action handler (currently line 134+):

// REMOVE the try/catch fallback pattern. Paperclip is the path.
// REMOVE the local queue execution path for delegate projects entirely.

// After creating issues in Paperclip:
// 1. Save to local projects-state for tracking (keep this)
// 2. DO NOT create queue items — Paperclip handles execution
// 3. Optionally trigger wakeup: POST /api/agents/{agentId}/wakeup
```

**Important:** The `queue_add` tool (for single tasks from chat) should STILL use the local queue. Only the multi-issue `delegate` tool goes through Paperclip. This keeps the fast single-task path and uses Paperclip for what it's good at — multi-agent coordination.

---

### Task 3: Wire Paperclip Completion → Inbox (Verify Existing Path)

**File:** `src/hooks/gateway-start.ts` (lines 401-440), `src/methods/paperclip-webhook.ts`  
**Effort:** 30 minutes

This path already exists! On gateway start:
1. `initPaperclip()` connects to Paperclip (✅ working)
2. `startCompletionPoller()` polls every 30s for done issues (✅ working)
3. Completed issues → `handlePaperclipWebhookHttp()` → writes to `~/godmode/memory/inbox/` (✅ working)
4. `addInboxItem()` adds to `inbox.json` for UI (✅ working)
5. `broadcastFn("inbox:new", ...)` pushes to UI (✅ working)

**Verify this actually works end-to-end.** Create a test issue, manually mark it done, confirm it appears in inbox. The poller uses `listCompletedIssues()` which queries `?status=done,completed,in_review`.

**One gap:** The completion poller currently doesn't update the local `projects-state.json`. When a Paperclip issue completes, the project status in the delegate tool's `status` action won't reflect it unless we update local state. Add a step in the completion handler:

```typescript
// In the completion poller callback (gateway-start.ts ~line 417):
// After calling handlePaperclipWebhookHttp(payload):
// Also update projects-state if this issue belongs to a tracked project
```

---

### Task 4: Update `paperclip-client.ts` — Add Wakeup Trigger

**File:** `src/services/paperclip-client.ts`  
**Effort:** 30 minutes

Add a method to trigger immediate agent wakeup after issue creation, instead of waiting for the heartbeat timer interval:

```typescript
/**
 * Trigger an immediate wakeup for an agent.
 * This tells Paperclip's heartbeat service to execute now rather than waiting for the timer.
 */
export async function triggerWakeup(agentId: string): Promise<void> {
  await paperclipFetch(`/api/agents/${agentId}/wakeup`, {
    method: "POST",
    mutating: true,
  });
}
```

**First verify the API endpoint exists** — check Paperclip's route definitions at:
`/Users/calebhodges/.npm/_npx/43414d9b790239bb/node_modules/@paperclipai/server/dist/routes/agents.js`

If no explicit wakeup endpoint exists, check if the heartbeat service exposes a manual trigger. Alternative: the `agentWakeupRequests` table in the DB suggests you can insert a wakeup request that the heartbeat timer picks up on next tick.

---

### Task 5: Verify Hermes CLI Is Available to Paperclip's Adapter

**Effort:** 30 minutes

The `hermes-paperclip-adapter` spawns `hermes chat -q` as a child process. Verify:

1. `hermes` CLI is on the system PATH that Paperclip's server process sees
2. The adapter's `hermesCommand` config defaults to `"hermes"` — confirm this resolves
3. Required env vars are available (API keys for Anthropic/OpenRouter)
4. Test manually: `hermes chat -q "What is 2+2?" --model anthropic/claude-sonnet-4-20250514`

If Hermes isn't on Paperclip's PATH, set `hermesCommand` in each agent's `adapterConfig` to the full path (e.g., `/Users/calebhodges/.local/bin/hermes` or wherever it's installed).

---

### Task 6: Test End-to-End with a Single Agent

**Effort:** 1-2 hours

1. Pick one agent (e.g., "Researcher" — simple, low risk)
2. Confirm its adapter config is `hermes_local` with correct settings
3. Create a test issue via API:
   ```bash
   curl -X POST "http://localhost:3100/api/companies/6bf45a79-e51a-452a-aa99-61dafc5d544c/issues" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Research: What is the current market size for AI agent platforms?",
       "description": "Write a 500-word summary of the AI agent platform market. Include key players, market size estimates, and growth projections. Cite sources.",
       "assigneeAgentId": "32bcf89a-a07d-415f-8705-adf1cc52bf14",
       "status": "todo",
       "priority": "medium"
     }'
   ```
4. Watch Paperclip logs for heartbeat trigger
5. Watch for `hermes chat -q` process spawning
6. Confirm results appear in Paperclip issue status
7. Confirm completion poller picks it up and writes to inbox

**Debug checklist if it fails:**
- Check Paperclip server logs: is the heartbeat firing?
- Check agent status: did it flip to `busy`/`running`?
- Check `hermes` CLI availability from Paperclip's process context
- Check adapter config: is the model valid?
- Check for missing API keys in Paperclip's environment

---

### Task 7: Persona Context Injection

**File:** New concern — adapter config or prompt template  
**Effort:** 1-2 hours

The current local queue builds rich persona-specific prompts (queue-processor.ts lines 35-60). When Paperclip's Hermes adapter spawns `hermes chat -q`, it uses a generic prompt template with `{{taskTitle}}` and `{{taskBody}}` variables.

**The agent needs persona context.** Two approaches:

**Option A: Use `promptTemplate` in adapterConfig (preferred)**
Each agent's `adapterConfig.promptTemplate` can include persona instructions:

```json
{
  "adapterConfig": {
    "promptTemplate": "You are the Content Writer for GodMode Team. Your mission: craft compelling, publication-ready content.\n\nYour task:\n{{#taskId}}## {{taskTitle}}\n\n{{taskBody}}{{/taskId}}\n{{#noTask}}No task assigned. Report idle.{{/noTask}}"
  }
}
```

This means persona context is stored in Paperclip's agent config, not in GodMode's codebase. This is actually better — Paperclip owns the agents.

**Option B: Use `contextFiles` in adapterConfig**
Point each agent to its persona file:

```json
{
  "adapterConfig": {
    "contextFiles": ["~/godmode/skills/personas/content-writer.md"]
  }
}
```

This leverages existing persona definitions.

**Recommendation:** Use Option B (contextFiles) + a minimal `promptTemplate` that adds task context. This keeps persona definitions in one place and reusable.

---

### Task 8: Project Status Sync

**File:** `src/tools/delegate-tool.ts` (status action), `src/services/paperclip-client.ts`  
**Effort:** 1 hour

The delegate tool's `status` action (lines 353-426) checks both local queue and Paperclip for issue statuses. Since we're removing the local queue path for delegated projects, simplify this:

1. For Paperclip-delegated projects: always check Paperclip API for live status
2. Add `listProjectIssues(projectId)` to paperclip-client.ts
3. Map Paperclip statuses (`todo`, `in_progress`, `done`, `cancelled`) to display statuses
4. When all issues in a project are `done`, mark the local project as `completed`

---

## What We're NOT Doing (Yet)

- **Trust gates in Paperclip path:** The local queue has trust scoring and evidence verification. Paperclip doesn't. This is fine for now — trust gates are a GodMode feature, not a Paperclip concern. They can be added later as a Paperclip plugin or post-execution hook.
- **Auto-retry with guidance:** Paperclip has its own retry mechanisms. Don't duplicate.
- **QA auto-injection:** Currently the delegate tool injects a QA review stage for multi-issue projects. Keep this — create the QA issue in Paperclip and assign it to the QA Reviewer agent. It should depend on other issues completing first. Check if Paperclip supports issue dependencies (parentId field exists in the API).
- **Inter-agent handoff context:** The `handoff` field on QueueItem is not available in Paperclip. When we need agent B to see agent A's output, we'd need to inject it into agent B's issue description or use Paperclip's project workspace feature.

## File Summary

| File | Change |
|------|--------|
| `src/tools/delegate-tool.ts` | Remove local queue fallback for delegate action. Paperclip is the only path. |
| `src/services/paperclip-client.ts` | Add `triggerWakeup()`, `listProjectIssues()` methods |
| `src/hooks/gateway-start.ts` | Update completion poller to sync project status to local state |
| `src/methods/paperclip-webhook.ts` | No changes needed (already works) |
| Script (one-time) | Update 36 agents from `openclaw_gateway` → `hermes_local` with role-specific configs |

## Estimated Total Effort

| Phase | Time |
|-------|------|
| Debug "Hermes Researcher" error agent (Task 5 + partial Task 1) | 1 hour |
| Script agent config updates (Task 1) | 30 min |
| Delegate tool rewrite (Task 2) | 1-2 hours |
| Completion poller verification + project sync (Tasks 3, 8) | 1 hour |
| Wakeup trigger (Task 4) | 30 min |
| Persona context injection (Task 7) | 1-2 hours |
| End-to-end test (Task 6) | 1-2 hours |
| **Total** | **5-8 hours** |

## Success Criteria

1. User says "research competitor pricing" → Prosper creates a Paperclip issue → Hermes agent executes → result appears in inbox
2. User says "build me a landing page" → Prosper creates a Paperclip project with 3-4 issues → multiple Hermes agents execute → results appear in inbox → Prosper synthesizes
3. `delegate status` shows live Paperclip issue statuses
4. No code touches the local queue for delegated multi-agent work (queue is reserved for single `queue_add` items)
5. Paperclip UI at localhost:3100 shows real-time agent activity
