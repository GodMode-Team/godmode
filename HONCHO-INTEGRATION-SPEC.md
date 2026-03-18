# Honcho Integration Spec — Memory + Cross-Workspace Sync

**Status:** Phase 2 (after v2 slim ships and is stable)
**Date:** March 18, 2026
**Honcho Version:** v3.0.3
**Account:** caleb@patientautopilot.com (GODMODE workspace exists)

---

## How Honcho Maps to GodMode

### Data Model Mapping

| Honcho Primitive | GodMode Concept | Example |
|---|---|---|
| **Workspace** | GodMode workspace (team/project scope) | `godmode`, `patient-autopilot`, `trp` |
| **Peer** | Any persistent entity (user, agent, client) | `caleb`, `prosper`, `austen`, `melody` |
| **Session** | Chat session or agent execution | `main-webchat-53c73a42`, `queue-task-abc` |
| **Message** | Conversation turn, agent output, system event | Every message in every session |

### The Magic: Cross-Workspace Memory via Peers

Honcho peers are **many-to-many with sessions** and **cross-session context carries automatically**.

This means:
1. Caleb is ONE peer that exists in all workspaces
2. Prosper is ONE peer that exists in all workspaces
3. When Honcho reasons about Caleb from a TRP session, those conclusions are available in GodMode sessions
4. Caleb's communication preferences, decision patterns, and personality model compound across ALL workspaces
5. BUT workspace-specific data stays isolated (TRP client data doesn't leak to GodMode workspace)

### Three Types of Memory

| Type | Scope | How Honcho Handles It |
|---|---|---|
| **Identity memory** | Cross-workspace (Caleb is Caleb everywhere) | Peer representation — conclusions about the person |
| **Workspace memory** | Isolated to workspace | Workspace-scoped sessions and messages |
| **Session memory** | Single conversation | Session messages + session-scoped reasoning |

---

## Integration Architecture

```
OpenClaw Session
  ↓ (every message)
GodMode Plugin (before-prompt-build hook)
  ↓
Honcho API
  ├── Write message to session (async, non-blocking)
  ├── Query peer representation (inject into prompt)
  └── Query relevant conclusions (inject as context)
  ↓
Agent gets: identity context + workspace context + session context
```

### What Replaces What

| Current (v2 slim) | Honcho Replaces | How |
|---|---|---|
| Mem0 searchMemories() | honcho.sessions.chat() | Reasoning-based retrieval vs fact retrieval |
| consciousness-heartbeat.ts | Honcho background reasoning | Honcho reasons automatically on every message |
| awareness-snapshot.ts | Peer representation query | One API call returns current state of user model |
| Manual memory promotion | Automatic — Honcho reasons and promotes | No "nightly consolidation" needed for identity |
| File-based tacit.md | Peer conclusions | Honcho extracts patterns automatically |

### What Stays (Honcho does NOT replace these)

| Component | Why It Stays |
|---|---|
| Obsidian Vault + QMD | Curated second brain — user's knowledge, not Honcho's job |
| Daily notes | Human-readable journal — the record of what happened |
| WORKING.md | Active task state — too operational for Honcho |
| SOUL.md | Hand-crafted identity — Honcho supplements, doesn't replace |
| Skills system | Agent instructions — not memory |
| Task/queue state | Operational data — not memory |

---

## Implementation Sessions

### Session A: Honcho Client Setup

```
Install honcho-ai Python SDK (or use REST API directly from TypeScript).
Create src/lib/honcho-client.ts:
- Initialize Honcho client with API key from env (HONCHO_API_KEY)
- Helper: getOrCreateWorkspace(name) — creates workspace if missing
- Helper: getOrCreatePeer(workspaceId, name) — creates peer if missing  
- Helper: createSession(workspaceId, peerIds[]) — new session
- Helper: addMessage(sessionId, peerId, content) — write message
- Helper: getPeerRepresentation(peerId) — get peer's current model
- Helper: chat(sessionId, query) — query Honcho for relevant context
- Graceful degradation: if HONCHO_API_KEY missing, all methods return null/empty
```

### Session B: Message Pipeline

```
In the before-prompt-build hook or equivalent:
1. On every user message → write to Honcho session
2. On every agent response → write to Honcho session  
3. Before building prompt → query peer representation
4. Inject peer representation as context (replaces awareness snapshot)

In queue-processor.ts:
1. When spawning agent → create Honcho session for the task
2. Write task context + agent output as messages
3. This means Honcho reasons about how agents perform too
```

### Session C: Workspace Sync via Honcho

```
Each GodMode workspace maps to a Honcho workspace:
- /workspace create godmode → honcho.workspaces.create("godmode")
- /workspace create trp → honcho.workspaces.create("trp")

User (Caleb) is a peer in ALL workspaces:
- honcho.peers.create(godmodeWs, "caleb") 
- honcho.peers.create(trpWs, "caleb")

Cross-workspace intelligence:
- Query caleb's peer representation from the godmode workspace
- It includes conclusions from ALL sessions caleb has participated in
- BUT session data stays in its workspace (TRP client details don't leak)

Team sync:
- When Austen joins the godmode workspace, create peer "austen" in honcho
- Austen gets workspace-scoped context (shared skills, shared memory)
- But Caleb's private peer model stays private unless explicitly shared
```

### Session D: Honcho → Vault Sync (Cron)

```
Nightly cron (or hourly heartbeat):
1. Query Honcho for each peer's latest conclusions
2. Write to vault:
   - memory/bank/people/{name}.md ← peer representation
   - memory/identity/honcho-model.md ← Caleb's self-model
   - memory/daily/{date}.md ← append notable conclusions
3. This makes Honcho's reasoning visible in the Obsidian vault
4. User can browse, edit, correct in Obsidian
5. Corrections feed back via next session messages
```

---

## Workspace Tab UI Updates Needed

The current Workspaces tab needs to reflect Honcho integration:

1. **Create workspace** → also creates Honcho workspace
2. **Workspace settings** → show Honcho workspace ID, peer count, session count
3. **Team members** → show as Honcho peers in the workspace
4. **Memory settings** → per-workspace Honcho config (reasoning depth, what to track)
5. **Shared skills** → skills installed in workspace available to all peers
6. **Sync status** → show last Honcho sync, message count, representation freshness

---

## Dependencies

```json
"honcho-ai": "^3.0.0"  // TypeScript SDK (check if exists, otherwise use REST)
```

Or: Use fetch() to call Honcho REST API directly (zero new dependencies).

## Env Vars

```
HONCHO_API_KEY=xxx        # From app.honcho.dev → API Keys
HONCHO_BASE_URL=https://api.honcho.dev  # Default, configurable for self-hosted
```

## Cost Estimate

At current pricing ($0.001-$0.50 per .chat() query):
- ~100 sessions/day × $0.05 avg = ~$5/day = ~$150/month
- This replaces: OPENAI_API_KEY for embeddings, Mem0 compute, manual memory curation time
- Net cost likely lower than current Mem0 + embedding setup

---

## What This Unlocks

1. **Memory that improves by reasoning, not retrieval** — Honcho doesn't just find what was said, it figures out what it means
2. **Cross-workspace identity** — Caleb's preferences/patterns carry everywhere
3. **Team memory isolation** — TRP team sees TRP context, not Caleb's personal GodMode data  
4. **Automatic pattern detection** — "Caleb tends to defer TRP tasks when under GodMode pressure" emerges naturally
5. **The moat** — After 6 months of Honcho reasoning, switching to a competitor means losing the entire relationship model
