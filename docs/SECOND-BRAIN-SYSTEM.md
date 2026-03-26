# GodMode Second Brain System

How GodMode's memory and intelligence layer works, and how to set it up for new users who bring their own data.

## Architecture: Three-Layer Memory

```
┌─────────────────────────────────────────────────────┐
│                  CONVERSATION                        │
│                      ↓                               │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Mem0    │  │   Identity   │  │   Obsidian    │ │
│  │  (facts)  │  │    Graph     │  │    Vault      │ │
│  │           │  │ (who + how)  │  │  (library)    │ │
│  └──────────┘  └──────────────┘  └───────────────┘ │
│  SQLite+embed   SQLite 2-table   PARA markdown      │
│  semantic srch   1-2 hop query   browsable + CLI    │
│  auto-extract    auto-extract    auto-capture       │
└─────────────────────────────────────────────────────┘
```

### Layer 1: Mem0 (Working Memory)
- **What:** Automatic fact extraction + semantic search
- **Storage:** `~/godmode/data/mem0-vectors.db` (SQLite + embeddings)
- **Trigger:** Every message (fire-and-forget ingestion)
- **Recall:** Every turn (semantic search on user's message)
- **Requires:** `OPENAI_API_KEY` (embeddings) + `ANTHROPIC_API_KEY` (fact extraction via Sonnet 4.6)

### Layer 2: Identity Graph (Relationship Memory)
- **What:** Entity/relationship graph — WHO people are and HOW they connect
- **Storage:** `~/godmode/data/identity-graph.db` (SQLite, 2 tables: entities + edges)
- **Trigger:** Every message (entity extraction via Sonnet 4.6)
- **Recall:** Every turn (keyword + 1-2 hop graph traversal)
- **Decay:** Orphan entities pruned after 180 days
- **Requires:** `ANTHROPIC_API_KEY` (entity extraction)

### Layer 3: Obsidian Vault (Long-Term Library)
- **What:** PARA-structured knowledge base, user-curated + auto-captured
- **Storage:** `~/Documents/VAULT/` (or `OBSIDIAN_VAULT_PATH`)
- **Trigger:** Heartbeat every 15 min (session capture, queue capture)
- **Recall:** On-demand via vault search tool (not injected every turn)
- **Requires:** Obsidian (optional — falls back to `~/godmode/memory/`)

### How They Feed Each Other
```
Conversations → Mem0 (facts) + Graph (entities)
Vault seed    → Mem0 (USER.md, SOUL.md, skills) + Graph (People/, Companies/)
Queue outputs → Vault inbox → Auto-routed to PARA folders
Sessions      → Vault daily notes → Browsable history
Apple Notes   → Graph (keyword-extracted people + companies)
```

## Data Flow: Capture → Process → Recall → Decay

### Capture (Automatic)
| Source | Pipeline | Frequency | Destination |
|--------|----------|-----------|-------------|
| Conversations | `message_sending` hook | Every message | Mem0 + Graph |
| Queue outputs | Heartbeat vault capture | Every 15 min | Vault inbox |
| Claude sessions | Heartbeat session capture | Every 15 min | Vault daily notes |
| Apple Notes | `seed-apple-notes.mjs` | One-time | Graph + index |
| Identity files | Gateway start vault seed | One-time | Mem0 + Graph |

### Process (Automatic)
| Action | Trigger | What It Does |
|--------|---------|-------------|
| Fact extraction | Mem0 `add()` | LLM extracts discrete facts from conversations |
| Entity extraction | `extractAndStore()` | LLM identifies people, companies, relationships |
| Inbox triage | Campaign `--fix` | Routes inbox items to PARA folders by type |
| Cross-linking | Campaign `--fix` | Adds `[[wikilinks]]` between Brain entries |
| Deduplication | Mem0 built-in | Resolves contradictions, merges duplicate facts |

### Recall (Every Turn)
| System | Method | Injected At |
|--------|--------|-------------|
| Mem0 | Semantic vector search | P0 tier (`## What You Already Know`) |
| Graph | Keyword + 1-2 hop SQL | P0 tier (`## People & Relationships`) |
| Awareness | File aggregation | Snapshot (schedule, priorities, goals) |
| Vault | On-demand search | Only when ally uses vault tool |

### Decay (Automatic)
| What | TTL | Mechanism |
|------|-----|-----------|
| Orphan graph entities | 180 days | Heartbeat prune |
| Done queue items | 30 days | Queue expiry |
| Failed queue items | 3 days | Queue expiry |
| Mem0 facts | Never | Persist but rank lower over time |
| Private sessions | 24 hours | Heartbeat cleanup |
| Agent logs in vault | 30 days | Campaign archive |
| Stale inbox items | 30 days | Campaign archive |

## New User Onboarding: Data Import

When a new user brings their data to GodMode:

### Step 1: Identity Setup
Create these files in the vault:
- `08-Identity/USER.md` — Who you are, roles, preferences
- `08-Identity/SOUL.md` — How the ally should behave
- `08-Identity/VISION.md` — What you're building toward

These seed into Mem0 on first gateway start.

### Step 2: Data Import
GodMode handles these data dumps automatically:

| Data Source | Where to Put It | What Happens |
|-------------|-----------------|-------------|
| Apple Notes export | `99-System/Apple Notes Archive/` | `seed-apple-notes.mjs` indexes via keyword extraction → graph |
| Contacts CSV | `06-Brain/People/` (one .md per person) | Graph seeds on gateway start |
| Obsidian vault (existing) | Set `OBSIDIAN_VAULT_PATH` | Used as-is, captures flow in |
| X/Twitter bookmarks | `04-Resources/X-Bookmarks/` | Browsable, keyword-searchable |

### Step 3: Classification Happens Automatically
The `seed-apple-notes.mjs` script classifies notes without any LLM calls:
- **Call logs** (Dr. X, Call w Y) → Entities extracted, relationships mapped
- **Business notes** (revenue, funnel keywords) → Indexed for recall
- **Ideas/strategies** → Indexed, surfaced when relevant
- **Todos/day notes** → Low value, indexed but not promoted
- **Tiny files (<50 bytes)** → Skipped entirely

### Step 4: System Starts Compounding
Once the gateway is running:
1. Every conversation auto-ingests facts (Mem0) and entities (graph)
2. Every 15 minutes: sessions captured to daily notes, queue outputs to vault
3. The more the user talks, the richer the context becomes
4. No discipline needed — everything is automatic

## Autoresearch Campaign: `second-brain.mjs`

Runs in overnight.sh to continuously audit system health:

### 7 Scoring Dimensions
1. **Capture Pipeline** — Are all data sources flowing?
2. **Processing & Routing** — Is data classified and structured?
3. **Recall Quality** — Can the system find what it knows?
4. **Decay & Hygiene** — Is stale data pruned?
5. **Archive Intelligence** — Is imported data (Apple Notes) indexed?
6. **Cross-System Coherence** — Do Mem0, graph, and vault agree?
7. **Knowledge Velocity** — Is the brain getting smarter over time?

### Fix Actions (runs with `--fix`)
- Archive stale inbox items (>30 days)
- Triage inbox by content type to PARA folders
- Deduplicate Brain entry facts
- Add cross-links between Brain entries
- Rotate old daily notes and agent logs

## Required API Keys
| Key | Used For | Required? |
|-----|----------|-----------|
| `ANTHROPIC_API_KEY` (or OAuth) | Mem0 fact extraction, graph entity extraction, LLM judge | Yes — core memory |
| `OPENAI_API_KEY` | Mem0 embeddings (text-embedding-3-small) | Yes — semantic search |
| `GEMINI_API_KEY` | Alternative embeddings (gemini-embedding-001) | Alternative to OpenAI |

Without Anthropic key: Mem0 + graph extraction disabled (system works but doesn't learn).
Without embedding key: Mem0 fully disabled (no semantic search).

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/memory.ts` | Mem0 init, search, ingest, vault seed |
| `src/lib/identity-graph.ts` | Graph init, extract, query, prune, vault seed |
| `src/lib/context-budget.ts` | P0-P3 context assembly |
| `src/services/vault-capture.ts` | Sessions→Daily, Queue→Inbox pipelines |
| `src/services/consciousness-heartbeat.ts` | 15-min orchestrator for all capture |
| `src/lib/awareness-snapshot.ts` | Ephemeral state snapshot |
| `autoresearch/campaigns/second-brain.mjs` | System audit campaign |
| `autoresearch/campaigns/seed-apple-notes.mjs` | Apple Notes keyword indexer |
