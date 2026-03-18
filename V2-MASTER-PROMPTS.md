# GodMode v2 — Master Execution Prompts

**Branch:** `feat/v2-slim`  
**Date:** March 18, 2026  
**Approach:** Hybrid deletion + cleanup. 7 sequential prompts. Each builds on the previous.  
**Total estimated Claude Code time:** ~75-90 min

## Architecture Summary

**What GodMode v2 IS:**
- OpenClaw workspace plugin (TypeScript ESM)
- Tabs: Chat, Today, Dashboards, Second Brain, Workspaces, Settings (includes Trust, Guardrails, Channels)
- Agent team delegation via queue-processor + delegate tool (Paperclip replaces in Phase 2)
- Agent toolkit server = HTTP API giving spawned agents access to memory/skills/identity
- Meta skills = SKILL.md files that encode reusable thinking patterns
- File-based memory with graceful degradation (no embeddings required)

**What gets deleted:**
- All consciousness/awareness code (Honcho replaces later)
- All Mem0 code (Honcho replaces later)  
- Fathom-specific processing (replaced by generic meeting webhook + skill)
- X/Twitter services (OC's x_read + browser handles this)
- Proof server + proof bridge (not using hosted Proof)
- Code repair service (OC's godmode_repair handles this)
- Mission Control, Parallel Sessions, ClawHub views
- Overlapping onboarding views (keep one)
- Overlapping Today views (keep one)

**What STAYS and is important:**
- Queue processor + delegate tool + agent roster (core delegation)
- Agent toolkit server (gives agents access to context — refactor, don't delete)
- Trust tracker + guardrails (core feature, not optional)
- All channel config views (GodMode is OpenClaw's dashboard)
- x-read tool (critical for skills)
- Second Brain (simplified)
- Dashboards
- Workspaces + team sync

---

## PROMPT 1: The Great Deletion

```
Read V2-EXECUTION-SPEC.md for full context.

## TASK: Delete all non-essential code from the GodMode plugin.

You are on branch feat/v2-slim. The goal is to strip the plugin to its essential core while keeping everything that works.

### TABS THAT MUST WORK AFTER THIS:
- Chat
- Today (daily brief + tasks + inbox)
- Dashboards
- Second Brain
- Workspaces
- Settings (includes Trust Tracker, Guardrails, Channel Config)

### DELETE these src/methods/ files:
- swarm-rpc.ts — replaced by delegate tool + queue processor
- consciousness.ts — Honcho replaces later
- impact-ledger.ts — not core
- x-intel.ts — OC has x_read tool
- team-curation.ts — not core
- resources.ts — not core (check if UI references it first; if so, stub it to return empty)

### DELETE these src/services/ files:
- consciousness-heartbeat.ts — Honcho replaces later
- curation-agent.ts — not core
- fathom-processor.ts — replacing with generic meeting webhook
- x-browser.ts — OC has browser tool
- x-client.ts — OC has x_read
- proof-server.ts — not using hosted Proof
- code-repair.ts — OC has godmode_repair
- vault-capture.ts — obsidian-sync stays, this is redundant

### DELETE these src/tools/ files:
- proof-tool.ts — not using Proof

### DELETE these src/lib/ files:
- proof-bridge.ts — not using Proof

### DELETE these ui/src/ui/views/ files:
- mission-control.ts
- parallel-sessions.ts
- clawhub.ts (skills browser in Second Brain replaces this)
- proof-viewer.ts (markdown-sidebar.ts stays)

### KEEP (do NOT delete):
- delegate-tool.ts — this is the main delegation interface
- queue-processor.ts — this powers agent execution
- agent-toolkit-server.ts — agents need this for context (refactored in Prompt 5)
- trust-tracker.ts (method AND view)
- guardrails.ts (method AND view AND service)
- All channel views (channels.*.ts)
- x-read tool (src/tools/x-read.ts)
- onboard tool
- morning-set tool
- All queue tools (queue-add, queue-check, queue-action, queue-steer)
- tasks-tool.ts, team-memory.ts, team-message.ts, trust-rate.ts, self-repair.ts, guardrail.ts

### REMOVE from package.json:
- mem0ai
- clawhub
- better-sqlite3 (ONLY if grep confirms nothing remaining imports it)

### UPDATE index.ts:
- Remove imports for deleted files
- Remove service starts for deleted services
- Remove RPC registrations for deleted methods
- Remove tool registrations for deleted tools
- Comment out (don't delete) feature flags — they may be referenced by UI

### CRITICAL RULES:
1. After EVERY batch of deletions (3-5 files), run: pnpm typecheck
2. Fix TypeScript errors from broken imports immediately
3. If unsure whether a file is used: grep for its exports first
4. Do NOT delete files imported by files you're keeping
5. Build must pass: pnpm build && pnpm build:ui
6. If a kept file imports a deleted file, either remove that import or stub the dependency

### VALIDATION:
pnpm typecheck && pnpm build && pnpm build:ui

### COMMIT:
git commit -m "feat: v2 great deletion — strip to essential core"

### REPORT:
find src/ -name "*.ts" | wc -l
find ui/src/ui/views -name "*.ts" | wc -l
pnpm typecheck 2>&1 | tail -5
pnpm build 2>&1 | tail -5
```

---

## PROMPT 2: Graceful Degradation

```
Read V2-EXECUTION-SPEC.md for context.

## TASK: Make GodMode work with ONLY a model API key. Zero other dependencies required.

The plugin currently crashes or blocks onboarding if various env vars are missing.

### RULE: Every optional integration must gracefully degrade.

1. **Calendar (GOG_CALENDAR_ACCOUNT etc):**
   - If not configured, calendar methods return empty arrays, not errors
   - UI shows "Connect your calendar" prompt instead of empty/error state
   - No crash, no error log spam

2. **Obsidian Vault (OBSIDIAN_VAULT_PATH):**
   - If not configured, Second Brain falls back to ~/godmode/memory/
   - UI works with file-based memory
   - No crash

3. **Embeddings (OPENAI_API_KEY for QMD):**
   - If unavailable, memory search falls back to simple keyword/grep matching
   - No crash, no "embedding provider timeout" errors

4. **Fathom (FATHOM_API_KEY):**
   - If not configured, meeting webhook simply doesn't register
   - No crash

5. **Any other env var:**
   - grep -r "process.env" across all remaining src/ files
   - For each: missing = graceful degradation, NEVER a crash
   - Add a comment block at top of index.ts documenting required vs optional env vars

### ONBOARDING:
- Required: name, what you're working on, communication style
- Everything else is progressive: "Want to connect your calendar?"
- After onboarding, user should be in a working chat immediately

### VALIDATION:
1. grep all process.env references
2. Mentally trace what happens if each is undefined
3. Fix any that would crash
4. pnpm typecheck && pnpm build

### COMMIT:
git commit -m "feat: graceful degradation — only model key required"

### REPORT:
grep -r "process\.env\." src/ --include="*.ts" -h | grep -o 'process\.env\.[A-Z_a-z0-9]*' | sort -u
```

---

## PROMPT 3: Lib Audit

```
Read V2-EXECUTION-SPEC.md for context. Run AFTER Prompt 1.

## TASK: Audit src/lib/ — find and remove orphaned files after the Great Deletion.

src/lib/ is 13,571 lines across 40+ files. Many are now orphaned.

### STEP 1: Find orphans

For EVERY file in src/lib/:
- Check if it's imported by any remaining (non-deleted) file
- Self-references don't count
- If 0 remaining imports → DELETE

### STEP 2: Likely orphans after Prompt 1 deletions:
- awareness-snapshot.ts (654 lines) — was imported by consciousness.ts, consciousness-heartbeat.ts
- interaction-ledger.ts (953 lines) — was imported by consciousness-heartbeat.ts, vault-capture.ts
- correction-log.ts (645 lines) — was imported only by interaction-ledger.ts
- config-snapshots.ts (285 lines) — was imported only by consciousness-heartbeat.ts

Verify each. Delete if truly orphaned.

### STEP 3: Review survivors over 300 lines
- Read header, check purpose
- If it serves a deleted feature → delete
- If genuinely needed → keep

### VALIDATION:
pnpm typecheck && pnpm build

### COMMIT:
git commit -m "feat: v2 lib audit — remove orphaned files"

### REPORT:
wc -l src/lib/*.ts | tail -1
```

---

## PROMPT 4: Fathom → Generic Meeting Webhook + Skill

```
## TASK: Replace 1,470 lines of Fathom processing with a generic meeting webhook + skill.

Fathom stays as the meeting note-taker tool. But we don't need 1,470 lines of custom processing.

### DELETE:
- src/methods/fathom-webhook.ts (671 lines)
- src/services/fathom-processor.ts (799 lines)
- All fathom imports/registrations in index.ts

### CREATE: src/methods/meeting-webhook.ts (~30-50 lines)

Simple webhook handler:
- POST /godmode/webhooks/meeting
- Accepts JSON with: { title, transcript, attendees?, source }
- Map Fathom's webhook payload format to this shape (add comment showing expected Fathom format)
- Fire post-meeting skill by injecting system event into active session
- Return 200 immediately (processing is async via skill)

### CREATE: skills/post-meeting/SKILL.md

Source-agnostic post-meeting processing skill:

# Post-Meeting Processing

## Description
Process a meeting transcript from any source.

## Trigger
- Meeting webhook fires (Fathom, Granola, Otter, any service)
- User says "process this meeting" with transcript
- User asks "what happened in my last meeting"

## Process
1. Parse transcript for: key decisions, action items, follow-ups, people mentioned
2. For each person: search memory, update memory/bank/people/{name}.md
3. For each action item: create task via tasks_create with priority/due date
4. Write meeting summary to daily note under ## Meetings
5. Flag delegatable items for agent team

## Output
Append to daily note:
### Meeting: {title} ({time})
**Attendees:** {list}
**Key Decisions:** {bullets}
**Action Items:** {numbered, with owners}
**Follow-ups:** {with dates}

## Failure Modes
- No transcript → ask user to paste or check their note-taker
- Can't identify attendees → ask user
- Simple 1:1, no decisions → brief summary only

### UPDATE: index.ts
- Remove fathom imports/registrations
- Register meeting-webhook in HTTP hook

### VALIDATION:
pnpm typecheck && pnpm build

### COMMIT:
git commit -m "feat: generic meeting webhook + post-meeting skill"
```

---

## PROMPT 5: Agent Toolkit Server Refactor

```
Read V2-EXECUTION-SPEC.md for context. Run AFTER Prompts 1 and 3.

## TASK: Fix agent-toolkit-server.ts — rewire endpoints that pointed at deleted code.

This server (740 lines) gives spawned agents HTTP access to GodMode's knowledge. It's essential. But after the deletion, some endpoints wrap deleted systems.

### FOR EACH ENDPOINT, check and fix:

1. /search — wraps secondBrain.search
   → Check if this still works. If secondBrain methods survived, keep as-is.

2. /memory — wraps Mem0 searchMemories()
   → Mem0 is deleted. Rewire to file-based search: grep/keyword over ~/godmode/memory/
   → Simple implementation: read files, search for query string, return matching snippets

3. /awareness — reads awareness-snapshot.md
   → If awareness-snapshot.ts was deleted, rewire to read WORKING.md + today's daily note instead
   → That gives agents enough context about current state

4. /skills, /skills/match — wraps loadSkillCards()
   → Should still work. Verify.

5. /identity — reads USER.md + SOUL.md
   → Definitely works. No change.

6. /docs/:name — allowlisted docs
   → Definitely works. No change.

7. /guardrails — wraps formatGuardrailsForPrompt()
   → Should work. Verify guardrails service survived.

8. /workspace, /workspace/guidelines, /workspace/history, /workspace/artifacts
   → Should work. Verify.

9. /agents/active, /agents/history
   → Wraps queue state. Should work.

10. POST /checkpoint
    → Should work. No change.

### RULES:
- Don't add dependencies. Use Node built-ins (fs, path, readline) for file search.
- The server must start without errors even if Mem0/Honcho/embeddings aren't configured
- Keep the security model (bearer tokens, rate limiting) as-is

### VALIDATION:
pnpm typecheck && pnpm build

### COMMIT:
git commit -m "feat: refactor agent-toolkit-server — rewire deleted deps"
```

---

## PROMPT 6: UI View Cleanup

```
## TASK: Remove dead/overlapping UI views, fix navigation.

### DELETE dead views (features no longer exist):
- mission-control.ts (if not already deleted in Prompt 1)
- parallel-sessions.ts (if not already deleted)
- clawhub.ts (if not already deleted)
- proof-viewer.ts (if not already deleted)

### RESOLVE overlapping "Today" views:
Look at these files:
- overview.ts (397 lines)
- my-day.ts (612 lines)
- daily-brief.ts (421 lines)

We need ONE "Today" view that shows: daily brief + tasks + inbox items.
- Check which one does this best
- Keep the best, merge any missing features from the others into it
- Delete the rest
- The inbox section should show a card per item with: title, status, options to view output in sidebar / open chat session / dismiss / score

### RESOLVE overlapping onboarding views:
- onboarding.ts
- onboarding-wizard.ts
- onboarding-setup.ts
- setup.ts

Keep ONE that captures: name, timezone, what they're working on, communication style.
Delete the rest.

### CHECK for redundancy:
- ally-chat.ts (424 lines) vs chat.ts — if ally-chat is a variant/skin of chat, delete it
- work.ts (681 lines) — is this redundant with the Today view? If so, delete

### FIX NAVIGATION:
1. Find the main navigation/router (likely in the app shell component or a nav component)
2. Remove menu items / routes for deleted views
3. Ensure these tabs exist and work:
   - Chat (primary)
   - Today (the single surviving Today view)
   - Dashboards
   - Second Brain
   - Workspaces
   - Settings (contains: Trust Tracker, Guardrails, Channel Config, general settings)

### VALIDATION:
pnpm build:ui
Manually verify no broken imports or missing routes.

### COMMIT:
git commit -m "feat: v2 UI cleanup — resolve overlaps, fix navigation"

### REPORT:
find ui/src/ui/views -name "*.ts" | wc -l
wc -l ui/src/ui/views/*.ts | tail -1
```

---

## PROMPT 7: Meta Skills

```
## TASK: Write 7 SKILL.md files in the skills/ directory.

These are reusable thinking frameworks that make Prosper smarter than a vanilla LLM.

### FORMAT for each:

# {Skill Name}

## Description
One line.

## Trigger
When this activates (specific phrases/conditions).

## Process
Numbered steps with specific tool calls.

## Output
What the user sees.

## Examples
1-2 examples.

### SKILLS TO CREATE:

1. skills/first-principles/SKILL.md
   Trigger: user asks for decision, strategy, complex problem
   Process: constraints → root cause → 3 solutions from different angles → attack each → recommend

2. skills/adversarial-board/SKILL.md
   Trigger: "debate this", "what am I missing", "challenge this", major decisions
   Process: 5 personas (Skeptic, Optimist, Operator, Customer, Competitor) → each critiques → synthesize → recommend

3. skills/auto-research/SKILL.md
   Trigger: questions about topics, companies, people, markets, trends
   Process: web_search → x_read → memory_search → synthesize with citations → gaps → follow-ups

4. skills/auto-context/SKILL.md
   Trigger: before meetings, tasks, project discussions
   Process: calendar → attendee lookup → project context → task history → surface proactively

5. skills/skill-builder/SKILL.md
   Trigger: after complex multi-step tasks (5+ tool calls)
   Process: analyze → extract pattern → write SKILL.md → save → log

6. skills/paperclip-ceo/SKILL.md
   Trigger: "delegate", "assign", "have the team do"
   Process: parse tasks → identify agent roles → create via delegate tool → set priority → monitor → inbox items

7. skills/post-meeting/SKILL.md
   (Already specified in Prompt 4 — if it wasn't created there, create it here)

### RULES:
- 30-80 lines each, not longer
- Specific tool names (web_search, x_read, memory_search, tasks_create, delegate)
- Include failure modes
- Direct, practical voice — not academic
- Each should be useful standalone

### COMMIT:
git commit -m "feat: v2 meta skills — 7 core SKILL.md files"

### REPORT:
ls -la skills/*/SKILL.md
wc -l skills/*/SKILL.md
```

---

## FINAL VALIDATION (Run after all 7 prompts)

```bash
pnpm typecheck && pnpm build && pnpm build:ui
find src/ -name "*.ts" | wc -l
find ui/src/ui/views -name "*.ts" | wc -l
ls skills/*/SKILL.md
```

Target: <60 src files, <35 UI view files, 7 skills, everything builds clean.
