# GodMode Codebase Audit — Companion Context

> Give this file alongside the codebase to any external auditor.
> It prevents wasted cycles on intentional decisions and known workarounds.

## What GodMode Is

A personal AI operating system built as an OpenClaw plugin. ~30k lines TypeScript ESM. Backend plugin (src/) + Lit web component frontend (ui/src/).

- **The ally is 80% of the value** — deep context, proactive surfacing, in-chat coworking. Agent delegation is 20%.
- **Conductor, not orchestra** — plugs into user's existing tools (Obsidian, Calendar, iMessage, GitHub, etc.), never rebuilds them.
- **File-based extensibility** — personas, skills, recipes are markdown/YAML files. Only write TypeScript for engine code (identity, context, orchestration, queue, trust).

Read `docs/GODMODE-META-ARCHITECTURE.md` for the full 9-principle blueprint. These decisions are locked.

## Architecture at a Glance

| Layer | Key Files | What It Does |
|-------|-----------|-------------|
| Entry | `index.ts` | Hook registration, handler map, `gateway_start` service init |
| Context | `src/lib/context-budget.ts` | P0-P3 priority tiers, ~150 lines/turn injected (down from ~1,500) |
| Memory | `src/lib/memory.ts` | Mem0 OSS (SQLite + Anthropic Haiku + Gemini embeddings) |
| Identity | `src/lib/identity-graph.ts` | Entity/relationship graph, SQLite, Claude Haiku extraction |
| Health | `src/lib/health-ledger.ts` | Ring buffer per operation, turn-level error surfacing |
| Self-Heal | `src/services/self-heal.ts` | 7 subsystem checks, auto-repair + canary verification |
| Queue | `src/services/queue-processor.ts` | Background agent jobs, evidence verification gates |
| Vault | `src/services/vault-capture.ts` | Sessions→Daily, Queue→Inbox capture pipelines |
| Heartbeat | `src/services/consciousness-heartbeat.ts` | 15-min tick driving memory retry, self-heal, awareness refresh |
| Brief | `src/methods/daily-brief.ts` | Daily note CRUD, checkbox sync, Win The Day |
| Tasks | `src/methods/tasks.ts` | Flat task system (title, due, status, workspace) |
| UI | `ui/src/ui/app.ts` | Lit web component, 6-tab layout |
| UI Render | `ui/src/ui/app-render.ts` | Template assembly, prop wiring |
| Markdown | `ui/src/ui/markdown.ts` | marked + DOMPurify pipeline |

## DO NOT Flag These — They Are Intentional

### 1. Mem0 JSON Prefill Monkey-Patch
**Location:** `src/lib/memory.ts` → `patchMem0AnthropicLlm()`

Mem0's Anthropic provider ignores `responseFormat`. Without the patch, Haiku returns conversational text instead of JSON, silently breaking ALL memory ingestion. The fix injects `{ role: "assistant", content: "{" }` as a prefill to force JSON output.

**Verified by:** `node tests/smoke-memory.mjs` (ingests 5 facts, searches, confirms round-trip).

### 2. ANTHROPIC_API_KEY Not Forwarded to Queue Agents
**Location:** `src/services/queue-processor.ts`

Intentional security boundary. Queue agents use Claude CLI OAuth / Max subscription (user's own account), not the plugin's API key.

### 3. Context Pressure Progressive Degradation
**Location:** `src/lib/context-budget.ts`

P3 drops first → P2 → P1. P0 (soul, identity, Mem0, capability map) is always injected. This is designed behavior, not a bug.

### 4. ACP Provenance Skips Personal Context for Agent-to-Agent
**Location:** `src/lib/context-budget.ts` → `assembleContext()`

Inter-session messages (agent handoffs) skip identity, memories, schedule. Only operational context is injected. This prevents data leakage and saves tokens.

### 5. Circuit Breaker on Memory Search
**Location:** `src/lib/memory.ts`

3 consecutive failures → 1-min backoff. Retry queue bounded to 50 items, processes 2-5 per heartbeat. Failed ingestions dropped after 3 attempts (conversation preserved, individual fact lost gracefully).

### 6. Artifact Persistence — Three-Layer Enforcement
Context injection warns ally, queue agent prompts enforce it, `ephemeralPathShield` hook blocks `/tmp` writes. Looks redundant but each layer catches different failure modes.

### 7. Task System Is Intentionally Flat
No hierarchy, no subtasks, no boards, no dependencies. Title + due date + status + workspace. Big projects = markdown artifacts. This is a product decision, not a missing feature.

### 8. Empty `catch {}` Blocks in Tool Execution
**Location:** `src/tools/morning-set.ts` and similar

Steps like task sync and session pre-creation are best-effort. Swallowed errors are intentional — the primary operation (rewriting the daily note) should succeed even if secondary steps fail.

## Known Workarounds Worth Understanding (But Not Fixing)

| Pattern | Where | Why It Exists |
|---------|-------|--------------|
| `hostPatchSession` tries `label` then `displayName` | `ui/src/lib/host-compat.ts` | OpenClaw field name changed between versions, need backward compat |
| Skills CRLF normalization | `src/lib/skill-cards.ts` | Windows users edit skill files with CRLF, parser must handle both |
| Quoted YAML value stripping | `src/lib/skill-cards.ts` | Frontmatter values like `name: "foo"` need quotes stripped |
| `resolve-claude-bin.ts` searches multiple paths | `src/lib/resolve-claude-bin.ts` | Claude CLI install location varies (Homebrew, npm global, local) |

## What HAS Bitten Us Before (Look Here)

These are the areas where real bugs have been found historically:

1. **Non-atomic file writes** — `tasks.json`, `queue.json` can corrupt on crash mid-write. Look for read-modify-write without temp file + rename.
2. **Queue processor double-decrement** — `activeCount` can go negative if child process handling isn't careful. Was fixed once, could regress.
3. **Evidence gate false negatives** — regex-based output verification can reject valid agent work. Check that patterns are permissive enough.
4. **Context injection bloat** — new features tend to add "just one more section" to context. Check total injected size hasn't crept past ~200 lines.
5. **Heartbeat interval drift** — services that depend on 15-min heartbeat can starve if heartbeat hangs or takes too long.
6. **DOMPurify config drift** — `toSanitizedMarkdownHtml` and `toEditableMarkdownHtml` have separate configs. One can get a fix the other doesn't (just happened with `ALLOWED_URI_REGEXP`).
7. **UI state ↔ backend sync** — the UI caches data aggressively. After backend mutations, stale UI state is the #1 source of "it doesn't work" reports.

## Build & Verify

```bash
pnpm install        # Install deps
pnpm build          # TypeScript → ESM + bundle UI
pnpm typecheck      # Type verification
pnpm ui:sync        # Sync UI fallback snapshot (commit if changed)
node tests/smoke-memory.mjs  # Verify Mem0 round-trip (needs API keys)
```

## File Tree Orientation

```
index.ts                          # Plugin entry, hooks, handlers
src/
  hooks/                          # Lifecycle hook implementations
  lib/                            # Shared utilities (memory, health, context, etc.)
  methods/                        # RPC handlers (daily-brief, tasks, onboarding, etc.)
  services/                       # Long-running services (queue, heartbeat, vault-capture)
  tools/                          # Agent-callable tools (morning-set, self-repair, etc.)
ui/
  src/ui/                         # Lit web components
    app.ts                        # Main component + handlers
    app-render.ts                 # Template assembly
    app-gateway.ts                # RPC bridge
    views/                        # Tab panels (my-day, workspaces, etc.)
    chat/                         # Chat rendering, context stripping
    controllers/                  # Data loading, caching
    markdown.ts                   # Markdown → sanitized HTML pipeline
skill-cards/                      # YAML frontmatter skill definitions
skills/                           # Executable skill definitions (cron, prompts)
personas/                         # Agent persona markdown files
docs/                             # Architecture docs
autoresearch/                     # Eval runner, campaigns, LLM judge
```

## Active TODO/FIXME Count

**Zero.** No active TODO, FIXME, or HACK comments in `src/` or `ui/src/`. Known issues are tracked in `RECENT-CHANGES.md` and GitHub Issues.
