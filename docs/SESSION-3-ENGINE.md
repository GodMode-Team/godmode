# Session 3: Core Engine — Cron Skills, Verification Gates, Dead Weight Removal

## What This Session Is

This is an implementation session. You are shipping backend engine changes to GodMode v1.5.0. Read the architecture doc first. Every change must follow the principles.

## CRITICAL: Read These Files First

1. `docs/GODMODE-META-ARCHITECTURE.md` — **THE LAW**. Read sections 0, 1, 4, and 6 carefully. Every decision must pass these principles.
2. `CLAUDE.md` — build instructions, coding guardrails, branch discipline
3. `src/services/queue-processor.ts` — the queue processing engine (read fully)
4. `src/services/consciousness-heartbeat.ts` — the 15-min heartbeat tick (read fully)
5. `src/lib/queue-state.ts` — queue item types and state (read fully)
6. `src/lib/agent-roster.ts` — persona loading, routing, trust scores (read fully)
7. `src/tools/queue-add.ts` — the queue_add tool (read fully)
8. `src/tools/trust-rate.ts` — the orphaned trust_rate tool (read fully)
9. `src/methods/proactive-intel.ts` — the stub handlers (read fully)
10. `src/methods/data-sources.ts` — candidate for removal (read fully)
11. `src/methods/people-data.ts` — candidate for removal (read fully)
12. `index.ts` — entry point, find where tools are registered and services started (search for `registerTool`, `proactiveIntel`, `curation`, `team`)

## Branch

Work on branch `feat/v1.6.0-engine`. Create it from `main`.

## Tasks (in order)

### Task 1: Dead Weight Removal

Remove or gate off dead code that adds startup overhead and attack surface.

**1a. Kill proactiveIntel service startup and handler registration.**
- In `index.ts`, find where the proactive intel service starts in `gateway_start` and comment it out or remove it.
- In `index.ts`, find where `proactiveIntel` handlers are registered in `allHandlers` and remove the registration.
- Do NOT delete the source files (`src/methods/proactive-intel.ts`, `src/services/proactive-intel.ts`). We'll rebuild them properly later. Just stop them from running.

**1b. Remove `data-sources.ts` handler registration.**
- In `index.ts`, remove `dataSources` from `allHandlers`.
- Do NOT delete the source file yet — just unregister.

**1c. Remove `people-data.ts` handler registration.**
- In `index.ts`, remove `people` from `allHandlers`.
- Do NOT delete the source file yet — just unregister.

**1d. Gate team services behind team workspace check.**
- In `index.ts` `gateway_start`, find where `curation-agent` service starts. Wrap it in a check: only start if team workspaces are configured. Check by looking for workspace config files or a `teamWorkspaces.enabled` option in `godmode-options.json`.
- The `team-comms`, `team-workspace`, `team-curation` handler registrations should stay (they're needed when team IS configured), but their handlers should early-return with a helpful message if team workspaces aren't configured.

**1e. Wire the `trust_rate` tool.**
- In `index.ts`, find where tools are registered (search for `registerTool` or the array of tools).
- Add `trust_rate` to the registered tools, importing `createTrustRateTool` from `src/tools/trust-rate.ts`.
- Use the same context pattern as the other tools.

### Task 2: Human-in-the-Loop Queue Scoping

Modify the `queue_add` tool so the ally must present a scoped brief to the user before queuing.

**In `src/tools/queue-add.ts`:**
- Add a new required parameter `confirmed` (boolean). Description: "Set to true only after you have presented the user with a scoped brief (title, persona, expected deliverable, success criteria) and they have explicitly approved it."
- Add a validation check: if `confirmed` is not `true`, return an error result: `{ error: true, message: "You must present the user with a scoped brief and get their approval before queuing. Show them: title, type, persona, expected deliverable, and success criteria. Then call queue_add again with confirmed: true." }`
- Update the tool description to include: "IMPORTANT: Before calling this tool, present the user with a scoped brief: the title, type, persona that will handle it, expected deliverable, and success criteria. Get explicit user approval. Then call with confirmed: true."

### Task 3: Verification Gates for Non-Coding Tasks

Add evidence-backed verification to the queue processor's completion handler.

**In `src/services/queue-processor.ts`:**
- Find the completion handler (the function that runs when an agent process exits with code 0).
- After reading the output file and extracting the summary, add a verification function.
- Create a new function `checkEvidence(type: QueueItemType, output: string): { passed: boolean; missing?: string }` that checks:
  - `coding`: PR link (`/pull/` URL), diff, or absolute file path — already exists, keep it
  - `research`: at least 1 URL (http:// or https://) in output
  - `ops`: command output indicators (exit code mention, process ID, or stdout/stderr markers)
  - `review`: file path references + verdict keywords (approved, rejected, needs changes, LGTM)
  - `analysis`: data source reference + conclusion/summary section
  - `creative`, `task`, `url`, `idea`: any non-empty structured output (> 50 characters)
- If evidence check fails: don't fail the item. Instead, retry ONCE with an appended instruction: "IMPORTANT: Your previous output was missing required evidence. For a [type] task, you must include: [missing evidence description]. Please redo your work and include the evidence."
- If evidence check fails on retry: mark as "review" with a flag in the summary: "⚠️ Missing evidence: [what's missing]"
- Keep the existing coding task verification as-is but integrate it into the new unified `checkEvidence` function.

### Task 4: File-Based Skills Directory

Create the skills loading system (mirrors agent-roster pattern).

**Create `src/lib/skills-registry.ts`:**
- Follow the exact same pattern as `src/lib/agent-roster.ts` — it's the template.
- Skills directory: `VAULT/99-System/skills/` (vault-first) or `~/godmode/skills/` (fallback).
- Skill file: markdown with YAML frontmatter.
- Frontmatter fields:
  - `name` (string) — display name
  - `trigger` (string) — `manual` (default), `cron`, `event`
  - `schedule` (string, optional) — for cron triggers: `daily 9am`, `weekly tuesday 9am`, `every 6h`, `weekdays 8am`
  - `persona` (string, optional) — slug of persona to run this skill
  - `taskType` (QueueItemType, optional) — defaults to `task`
  - `priority` (string, optional) — high/normal/low, defaults to `normal`
- Body: the skill instructions (injected as the task description when queued)
- Types:
```typescript
export type SkillTrigger = "manual" | "cron" | "event";
export type SkillDefinition = {
  slug: string;
  name: string;
  trigger: SkillTrigger;
  schedule?: string;
  persona?: string;
  taskType: QueueItemType;
  priority: "high" | "normal" | "low";
  body: string;
  filePath: string;
};
```
- Export functions:
  - `resolveSkillsDir(): string | null` — same pattern as `resolveRosterDir()`
  - `loadSkills(): SkillDefinition[]` — cached with 30s TTL, same as loadRoster()
  - `getSkill(slug: string): SkillDefinition | null`
  - `getCronSkills(): SkillDefinition[]` — returns only skills with trigger=cron
  - `parseSchedule(schedule: string): { shouldRunNow: (lastRun: number) => boolean }` — parses schedule strings
- The `parseSchedule` function should handle:
  - `daily <time>` — run once per day at approximately that time (check if within 15-min window)
  - `weekly <day> <time>` — run once per week on that day
  - `weekdays <time>` — Mon-Fri
  - `every <N>h` — every N hours
- Keep it simple. No cron expression parser. Just string matching on the formats above.

### Task 5: Cron Engine in Heartbeat

Wire the skills registry into the consciousness heartbeat.

**In `src/services/consciousness-heartbeat.ts`:**
- Import `getCronSkills` from `skills-registry.ts`
- Add a new function `processCronSkills()` called during the heartbeat tick
- It should:
  1. Load cron skills via `getCronSkills()`
  2. For each cron skill, check if it should run now using `parseSchedule(skill.schedule).shouldRunNow(lastRunTimestamp)`
  3. Track last run timestamps in a JSON file: `~/godmode/data/skill-runs.json` (simple `{ [slug]: lastRunTimestamp }`)
  4. If a skill should run: create a queue item via `updateQueueState()` with:
     - `source: "cron"`
     - `type: skill.taskType`
     - `title: skill.name`
     - `description: skill.body`
     - `personaHint: skill.persona`
     - `priority: skill.priority`
  5. Update the last run timestamp after queuing
- Call `processCronSkills()` in the heartbeat tick function, alongside the existing `autoQueueOverdueTasks()` call.

### Task 6: Skills Index in Awareness Snapshot

Add active skills to the awareness snapshot so the ally knows what's configured.

**In `src/lib/awareness-snapshot.ts`:**
- Import `loadSkills` from `skills-registry.ts`
- In `generateSnapshot()`, add a `## Active Skills` section (2-5 lines) listing configured skills:
  ```
  ## Active Skills
  - weekly-content (Tue 9am, content-writer)
  - inbox-sweep (daily 7am, ops-runner)
  - 3 manual skills available
  ```
- Keep it to ~5 lines max. Only list cron skills by name + schedule. Summarize manual skills as a count.

## Build Verification

After all tasks, run:
```bash
pnpm build && pnpm typecheck
```

Fix any type errors or build failures. The build MUST pass.

## What NOT to Do

- Do NOT touch UI code (that's Session 4)
- Do NOT touch onboarding (that's Session 4)
- Do NOT create persona files (that's Session 5)
- Do NOT delete source files — only unregister handlers/services from index.ts
- Do NOT add permanent context injection beyond the ~5 lines in awareness snapshot
- Do NOT over-engineer the schedule parser — simple string matching, no cron libraries
- Do NOT create new UI tabs or RPC handler groups

## Commit

After everything builds, commit with a clear message describing the engine changes. Use branch `feat/v1.6.0-engine`.

Update `RECENT-CHANGES.md` at the top with a summary of what changed.
