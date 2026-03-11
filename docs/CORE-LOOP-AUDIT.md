# GodMode Core Loop Audit — 2026-03-10

## Vision (User's Words)
> GodMode should be anti-fragile, adaptive to the user, helping their goals. Extremely resourceful and intelligent. Proactively builds and adapts itself. Best memory system ever. Never forgets. True second brain, real thought partner. Your ally is your strategic partner. GodMode is where you get all your work done.

> The core loop: brain dump anywhere, anytime, any channel, any way → information gets processed → tasks created → ally asks clarifying questions proactively → project manages and organizes. Goes into memory, tasks, wherever it needs to go.

> Ally prepping tasks like chef prep — doing research, getting context, executing — but gated. "Hey, I can work on these things overnight. Do you want me to?" Proactively volunteering, but you're steering it.

---

## Audit Results Summary

### 1. Brain Dump → Tasks Pipeline: CRITICAL GAP ❌

**What works:**
- Task CRUD is solid (file-locked, deduped, workspace-aware)
- Memory ingestion works (Mem0 extracts facts from every assistant message)
- Vault capture auto-runs (sessions → daily, queue → inbox)
- Queue system spawns agents reliably

**What's missing:**
- NO extraction of action items from user messages
- NO proactive clarification ("when is this due?")
- NO auto-creation of tasks from brain dumps
- NO classification of intent (task vs fact vs concern)

**Fix:** New `src/lib/action-items.ts` — regex + heuristic extraction of action items, wired into `message_received` → ephemeral buffer → `before_prompt_build` injects "Action Items Detected" nudge → ally asks clarifying questions → creates tasks with metadata.

### 2. Task System Reliability: MEDIUM GAPS ⚠️

**What works:**
- File locking prevents corruption
- Brief is source of truth (asymmetric sync is intentional)
- Dedup by title + dueDate
- Workspace detection with score-based matching

**Edge cases to fix:**
- Task deletion while queue active → orphaned queue items
- Brief regeneration → orphaned tasks (in tasks.json, not in brief)
- Workspace rename → stale projectIds
- Ambiguous fuzzy matching in markDoneByTitle

**Fix:** Task maintenance function that runs on heartbeat — cleans orphans, warns about stale links, reconciles brief ↔ tasks.

### 3. Proactive Ally Suggestions: MISSING ⚠️

**What works:**
- Queue can spawn agents autonomously
- Trust system gates autonomy (full/approval/disabled)
- Cron skills run on schedule
- Auto-queue overdue tasks on heartbeat

**What's missing:**
- No "I can work on these things overnight. Approve?" surface
- No suggestion detection from conversation context
- No overnight window concept
- No chef prep (pre-staging research for meetings)

**Fix:** Add suggestion context to awareness snapshot — ally sees available work opportunities and can volunteer. Gated by trust + user approval via queue_add's existing preview flow.

### 4. Security: GOOD ✅

All 4 gates are non-intrusive. Owner sessions bypass rate-limiting. Enforcer gates nudge quality without blocking. Config shield is surgical. No changes needed.

### 5. Dashboard & Artifact Visibility: EXISTING BUT LIMITED ⚠️

**What works:**
- Dashboard tab renders AI-generated HTML dashboards
- Markdown sidebar opens files with proper MIME handling
- HTTP artifact server serves inbox files
- Work tab shows project files

**What's missing:**
- No unified artifact browser across all outputs
- No preview thumbnails or quick-view
- No artifact search/indexing
- No inter-artifact linking

**Defer to next sprint** — this is mostly UI work that needs design thought.

### 6. Team Workspace: FEATURE-COMPLETE BUT UNTESTED ⚠️

**What works:**
- Full workspace CRUD, git sync, member tracking
- Curation agent, team feed, team bootstrap context
- All RPC handlers registered

**What's missing:**
- No conflict resolution RPC
- No workspace health check
- No stress testing (10+ members, 100+ files)
- Atomic writes missing on config files

**Defer to next sprint** — needs dedicated stress testing session.

---

## Execution Plan (This Branch)

### Phase 1: Brain Dump → Action Items
1. Create `src/lib/action-items.ts`
   - Parse user messages for action item patterns ("I need to", "must", "should", "have to", "don't forget", "remind me")
   - Extract metadata: title, urgency, deadline hints ("by Friday", "ASAP", "this week")
   - Classify intent: task | exploration | concern
   - Return structured ActionItem[] for ally consumption
2. Wire into `message_received` hook → ephemeral per-session buffer
3. Wire into `before_prompt_build` → inject "Action Items Detected" at P1.5 tier
4. Add ally instruction: "Ask for deadline and success criteria before creating tasks"

### Phase 2: Task System Hardening
1. Add `taskMaintenance()` function to tasks.ts
   - Clean orphaned tasks (source=import, no matching brief checkbox)
   - Detect tasks with stale projectIds
   - Warn about tasks with active queue items
2. Strengthen deleteTask guard — reject if queue item is in review status
3. Wire maintenance into consciousness heartbeat (daily cadence)

### Phase 3: Proactive Ally Suggestions
1. Add suggestion detection to awareness snapshot
   - Scan tasks for items that could be delegated (research, analysis, review)
   - Check queue capacity (< 5 active agents = room for more)
   - Surface upcoming meetings needing prep
2. Add "Overnight Opportunities" section to awareness context
   - Only inject if trust level allows proactive suggestions
   - Format as approval-ready: "I can work on X, Y, Z. Approve?"
3. Ally instruction: "Offer to work on delegatable tasks, but always ask first"

### Phase 4: Verify
1. `pnpm build` — zero errors
2. `pnpm typecheck` — clean
3. Commit on `feat/core-loop-audit` branch

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/lib/action-items.ts` | Brain dump → action item extraction |
| MODIFY | `src/hooks/lifecycle-hooks.ts` | Wire extraction into message_received |
| MODIFY | `src/hooks/before-prompt-build.ts` | Inject detected action items into context |
| MODIFY | `src/lib/context-budget.ts` | Add P1.5 tier for action items |
| MODIFY | `src/methods/tasks.ts` | Add taskMaintenance() function |
| MODIFY | `src/services/consciousness-heartbeat.ts` | Wire maintenance + suggestions |
| MODIFY | `src/lib/awareness-snapshot.ts` | Add overnight opportunity detection |

## Not In Scope (Next Sprint)
- Dashboard unified artifact browser
- Team workspace hardening + stress testing
- LLM-powered action item extraction (Phase 2 upgrade)
- Task suggestion UI badge + approval modal
- Artifact search/indexing
