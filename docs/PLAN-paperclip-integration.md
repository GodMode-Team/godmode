# Plan: Paperclip Full Integration — Agent Team Execution via `claude_local`

**Goal:** When Prosper delegates work, it flows through Paperclip for coordination and decomposition, and Paperclip's built-in `claude_local` adapter handles execution by spawning Claude Code agents directly. No custom adapter needed. No bridge code. Just configuration + a thin wiring layer.

**Estimated effort:** 1–1.5 days
**Branch:** `feat/paperclip-execution`

---

## The Key Insight

After reading the Paperclip server source code, here's what I found:

**Paperclip already has a `claude_local` adapter built in** that does exactly what your queue-processor does — it spawns `claude` CLI processes with persona-specific prompts, streams output, handles timeouts, and reports results. It's registered in `@paperclipai/server/dist/adapters/registry.js` and fully functional.

**Your 36 agents are currently set to `openclaw_gateway`** — pointing at `ws://127.0.0.1:18789/ws` (an OpenClaw WebSocket endpoint that doesn't exist in your Hermes setup). That's why nothing executes.

**The fix is mostly configuration:** Switch agents from `openclaw_gateway` → `claude_local`, set the right `adapterConfig`, and wire the delegate tool to trigger execution via Paperclip's wakeup API instead of the local queue.

The `claude_local` adapter (line-by-line in `@paperclipai/adapter-claude-local/dist/server/execute.js`):
1. Reads agent config: `command` (defaults to "claude"), `promptTemplate`, `model`, `cwd`, `instructionsFilePath`
2. Builds environment with `PAPERCLIP_*` vars (task ID, run ID, workspace info)
3. Spawns `claude --print - --output-format stream-json --verbose` with the rendered prompt
4. Parses streaming JSON output for transcript, tool calls, results
5. Returns `AdapterExecutionResult` with summary, usage, session state, exit code

This is production-grade code that already handles session resumption, git worktrees, workspace strategies, model selection, max turns, and timeout management. **It's better than what the local queue does** because it parses Claude's structured JSON output instead of just reading a file.

---

## Why This Approach (Not Hybrid, Not Custom Adapter)

### Why not "Paperclip coordinates, local queue executes" (Option C)?

That was my initial recommendation, but after reading the source:

1. **Paperclip already executes.** The `claude_local` adapter IS an execution engine. Building a bridge from Paperclip → local queue → Claude CLI adds unnecessary indirection when Paperclip → Claude CLI already works.

2. **The local queue's unique features (trust gates, evidence verification, auto-retry) can be rebuilt as Paperclip-side hooks** in Phase 2. They're valuable but not launch-blocking — Paperclip has its own approval system and the queue's evidence checking is ~30 lines of regex.

3. **Two execution paths = two things to maintain.** Every queue feature you add would need to work in both paths.

### Why not `hermes_local` adapter?

The Hermes Researcher agent uses `hermes_local`, but there's no such adapter registered in Paperclip's adapter registry. That `hermes_local` type falls back to the `process` adapter (a generic command runner). The `claude_local` adapter is purpose-built for Claude Code — it understands streaming JSON output, session resumption, Claude-specific error modes, login detection. Use the right tool.

### Why not the `openclaw_gateway` adapter?

You're not running OpenClaw. The WebSocket endpoint doesn't exist. Dead path.

---

## Architecture After Integration

```
User → "Build me a landing page"
  │
  ▼
Prosper (in Hermes chat) decomposes → calls delegate tool
  │
  ▼
delegate-tool.ts creates Paperclip project + issues via API
  │  (assigns each issue to the right agent by persona → agent ID)
  │
  ▼
For each issue: POST /api/agents/{id}/wakeup
  │  (triggers Paperclip's heartbeat service)
  │
  ▼
Paperclip heartbeat service:
  1. Looks up agent's adapterType → "claude_local"
  2. Loads adapterConfig (cwd, promptTemplate, model, etc.)
  3. Builds execution context (issue description, workspace, secrets)
  4. Calls claude_local adapter.execute()
  │
  ▼
claude_local adapter:
  1. Renders prompt template with agent/issue context
  2. Spawns: claude --print - --output-format stream-json --verbose
  3. Streams output back to Paperclip (stored in heartbeat_runs)
  4. Returns AdapterExecutionResult with summary + usage
  │
  ▼
Paperclip stores result, updates issue status
  │
  ▼
GodMode completion poller (already exists in paperclip-client.ts):
  - Polls /api/companies/{id}/issues?status=done,completed
  - Routes new completions to inbox
  - Notifies Prosper in chat
```

---

## Implementation Steps

### Phase 1: Make It Work (Day 1)

#### Step 1: Reconfigure agents from `openclaw_gateway` → `claude_local`

**Why:** The 36 agents currently point at a dead OpenClaw WebSocket. Switching to `claude_local` lets Paperclip spawn Claude Code directly.

**What:** Script that PATCHes each agent via Paperclip API:

```bash
# For each agent:
curl -X PATCH http://localhost:3100/api/agents/{agentId} \
  -H "Content-Type: application/json" \
  -d '{
    "adapterType": "claude_local",
    "adapterConfig": {
      "command": "claude",
      "cwd": "~",
      "model": "claude-sonnet-4-20250514",
      "promptTemplate": "You are {{agent.name}}. Your task:\n\n{{context.issueDescription}}\n\n{{context.issueTitle}}",
      "dangerouslySkipPermissions": true,
      "maxTurnsPerRun": 50,
      "timeoutSec": 1800,
      "env": {}
    }
  }'
```

**Key config decisions:**
- `promptTemplate`: Needs to incorporate the issue title/description plus persona identity. The template supports `{{agent.id}}`, `{{agent.name}}`, `{{context.*}}` variables. We'll need to test what context vars Paperclip populates when waking for an issue.
- `cwd`: Start with home dir. Paperclip's workspace system can be configured per-project later.
- `dangerouslySkipPermissions`: true for now (agents need to work autonomously). Can gate this behind trust levels later.
- `maxTurnsPerRun`: 50 is reasonable for most tasks. Research/coding may want more.
- `model`: Start with Sonnet. Can be per-agent later (use Opus for code review, Haiku for simple tasks).

**Also:** Need to set up proper `instructionsFilePath` per-agent pointing to the GodMode persona markdown files. The adapter injects these via `--append-system-prompt-file`. This is how each agent gets its identity.

**Effort:** ~1 hour (script + testing one agent manually first)

#### Step 2: Test a single wakeup end-to-end

**Why:** Verify the full pipeline before wiring up the delegate tool.

**What:**
1. Create an issue via API assigned to one reconfigured agent
2. Trigger wakeup: `POST /api/agents/{agentId}/wakeup`
3. Watch Paperclip logs for adapter execution
4. Verify Claude Code process spawned
5. Check issue status updated on completion

```bash
# Create a test issue
curl -X POST http://localhost:3100/api/companies/6bf45a79-e51a-452a-aa99-61dafc5d544c/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test: Write a haiku about AI agents",
    "description": "Write a single haiku about AI agents working together. Output the haiku and nothing else.",
    "assigneeAgentId": "<researcher-agent-id>",
    "status": "todo"
  }'

# Trigger wakeup
curl -X POST http://localhost:3100/api/agents/<researcher-agent-id>/wakeup \
  -H "Content-Type: application/json" \
  -d '{"source": "manual", "triggerDetail": "test"}'

# Check run status
curl http://localhost:3100/api/agents/<researcher-agent-id>/runs?limit=1
```

**Effort:** ~2 hours (debugging prompt template, auth, env issues)

#### Step 3: Wire delegate tool to use Paperclip execution

**Why:** The delegate tool currently creates Paperclip issues but doesn't trigger execution (wakeup). Issues sit in backlog.

**What:** Modify `delegate-tool.ts` Paperclip path (lines 134-198) to:
1. After creating each issue → call `POST /api/agents/{agentId}/wakeup` with issue context
2. Remove the fallback-to-local-queue behavior (Paperclip IS the execution path now)
3. Keep local queue as explicit fallback only when `isPaperclipReady()` returns false

Add to `paperclip-client.ts`:
```typescript
export async function wakeupAgent(agentId: string, context?: {
  issueId?: string;
  reason?: string;
}): Promise<void> {
  await paperclipFetch(`/api/agents/${agentId}/wakeup`, {
    method: "POST",
    mutating: true,
    body: {
      source: "api",
      triggerDetail: context?.reason ?? "delegate",
      payload: context ? { issueId: context.issueId } : undefined,
    },
  });
}
```

**Effort:** ~1 hour

#### Step 4: Wire completion poller to inbox + chat notification

**Why:** The completion poller exists in `paperclip-client.ts` (lines 286-336) but the `onCompletion` handler isn't connected to anything useful.

**What:** In `gateway_start` (or wherever Paperclip is initialized), start the poller with a handler that:
1. Fetches the completed issue's run result from Paperclip API
2. Writes output to `~/godmode/memory/inbox/{issueId}.md`
3. Pushes to universal inbox via `addInboxItem()`
4. Broadcasts `ally:notification` so Prosper sees it in chat

The completion poller already seeds seen IDs on startup (line 333) so it won't re-fire old completions.

**Effort:** ~1 hour

#### Step 5: Configure persona instructions per agent

**Why:** Each agent needs its persona identity injected. The `claude_local` adapter supports `instructionsFilePath` which gets passed as `--append-system-prompt-file`.

**What:** The persona files already exist in the agent roster. For each Paperclip agent, set `adapterConfig.instructionsFilePath` to the persona markdown file path. If personas are defined as JS objects in agent-roster, generate standalone markdown files at a known path (e.g., `~/godmode/data/personas/{slug}.md`).

Also inject the GodMode toolkit context into the instructions file or prompt template:
- Toolkit API base URL
- Available endpoints (/search, /memory, /skills, /awareness)
- Workspace context

**Effort:** ~2 hours

---

### Phase 2: Make It Good (Day 2+, lower priority)

#### Step 6: Trust gates and evidence verification (port from queue-processor)

**Why:** The local queue has trust-level gating (disabled → approval → full autonomy) and evidence verification (checks for PRs, URLs, file paths). These are valuable quality gates.

**Where:** Two options:
- **Pre-execution gate:** In the delegate tool, before calling wakeup, check trust level. If "disabled", skip. If "approval", mark the issue as needing review.
- **Post-execution gate:** When the completion poller fires, run the evidence check on the run output. If it fails, add a comment to the issue requesting correction and re-wake the agent.

The evidence checking code is in `src/lib/evidence.ts` — it's standalone and can be called from the completion handler.

**Effort:** ~2 hours

#### Step 7: GodMode context injection

**Why:** Agents spawned by Paperclip's `claude_local` adapter get Paperclip env vars but NOT GodMode knowledge (memory, skills, awareness). In the local queue, this was handled by the toolkit token + API server.

**Options:**
- **A) Toolkit API token in env:** Add `GODMODE_TOOLKIT_URL` and `GODMODE_TOOLKIT_TOKEN` to each agent's `adapterConfig.env`. The agent toolkit server already exists.
- **B) Instructions file includes context:** Generate per-run instructions that include relevant memory/awareness snapshot.
- **C) MCP server:** Agents could connect to a GodMode MCP server for context access (longer-term).

Start with A — it's what the local queue already does.

**Effort:** ~1 hour

#### Step 8: Auto-wakeup on issue assignment (eliminate manual wakeup call)

**Why:** Currently we'd need to call wakeup after creating each issue. Paperclip's issue route (line 408 of issues.js) already calls `heartbeat.wakeup(issue.assigneeAgentId, ...)` when an issue is assigned — but only when the assignee changes. If agents have heartbeat enabled, they may auto-wake.

**What:** Configure agents' `runtimeConfig.heartbeat.enabled = true` and set a reasonable `intervalSec`. Then assigning an issue automatically triggers execution without an explicit wakeup call.

Alternatively, ensure the issue creation + assignment triggers the auto-wakeup. Read the issue route more carefully — line 529-587 shows that on issue update (including assignment), wakeups are merged and enqueued.

**Effort:** ~30 min investigation + config

#### Step 9: Project-level orchestration

**Why:** For multi-issue projects, you want sequential dependencies (copy before design before code) and a synthesis step.

**What:** Paperclip supports issue dependencies via `parentId`. Create parent issues that block on child issues. The synthesis step can be a final issue assigned to Prosper's agent that auto-wakes when all sibling issues complete.

**Effort:** ~2 hours

---

## What Gets Deleted / Deprecated

- **Nothing immediately.** The local queue stays as-is for the fallback path and for ad-hoc `queue_add` usage.
- In Phase 2, consider deprecating the `queue-processor.ts` spawn logic for delegated project tasks (but keep for single ad-hoc tasks from chat).
- The `openclaw_gateway` adapter config on all 36 agents gets replaced (non-destructive, just a PATCH).

## What Stays

- `paperclip-client.ts` — enhanced with `wakeupAgent()` and better completion handling
- `delegate-tool.ts` — simplified Paperclip path (issue create + wakeup, no fallback dance)
- `queue-processor.ts` — still handles ad-hoc queue items from `queue_add` tool
- Trust tracker, evidence verification — ported to completion handler
- Agent toolkit server — still provides context API for agents

## Risk Mitigation

1. **Claude Code auth:** The `claude_local` adapter expects Claude to be logged in / have API key. Verify `claude` CLI is authenticated on the machine. The adapter handles login detection and returns a clear error if needed.

2. **Concurrent agent limit:** Paperclip's heartbeat service has `HEARTBEAT_MAX_CONCURRENT_RUNS_DEFAULT = 1` per agent. For delegation with 3+ agents, this is fine (each agent gets its own run). But if the same agent gets multiple issues, they'll serialize.

3. **Prompt template context:** Need to verify exactly which `{{context.*}}` variables are populated when Paperclip wakes an agent for an issue. Test with a simple template first, then iterate.

4. **Cost:** Each agent run = one Claude Code session = potentially many API calls. Start with conservative `maxTurnsPerRun` limits.

---

## Files to Create / Modify

### New files:
- `scripts/reconfigure-paperclip-agents.ts` — one-time script to PATCH all agents
- `scripts/test-paperclip-wakeup.sh` — manual test script

### Modified files:
- `src/services/paperclip-client.ts` — add `wakeupAgent()`, enhance completion handler
- `src/tools/delegate-tool.ts` — add wakeup call after issue creation
- `src/services/gateway-start.ts` (or wherever init happens) — wire completion poller to inbox

### Untouched files:
- `src/services/queue-processor.ts` — stays for ad-hoc tasks
- `src/lib/evidence.ts` — stays, used by completion handler
- `src/lib/trust-refinement.ts` — stays, used by trust gates
