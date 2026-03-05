# Session 5: Content, Personas, Onboarding Polish, and Ship

## What This Session Is

This is the final session. You are creating starter content (persona files, sample skills), updating onboarding to reflect the simplified experience, updating install/setup docs, and preparing the release. Read the architecture doc first.

## CRITICAL: Read These Files First

1. `docs/GODMODE-META-ARCHITECTURE.md` — **THE LAW**. Read section 0 (What GodMode Is), section 4 (Agent Model → 4e Starter Personas), and section 6 (Extension Pattern).
2. `CLAUDE.md` — build instructions, release process
3. `src/lib/agent-roster.ts` — persona file format, frontmatter parsing (read fully)
4. `src/lib/skills-registry.ts` — skill file format IF it exists (Session 3 may have created this). If it doesn't exist, skip skill file creation.
5. `src/methods/onboarding.ts` — onboarding phases, quickSetup (read fully)
6. `src/hooks/onboarding-context.ts` — phase prompts (read fully)
7. `src/hooks/agent-persona.ts` — ally identity (read fully)
8. `RECENT-CHANGES.md` — current state (read fully)
9. `docs/setup.html` — the install/setup page (read fully)
10. `package.json` and `openclaw.plugin.json` — version numbers

## Branch

Work on branch `feat/v1.6.0-content`. Create it from `main`.

## Tasks (in order)

### Task 1: Create Starter Persona Files

Create 7 persona markdown files in the repo at `assets/agent-roster/`. These will be copied to `~/godmode/memory/agent-roster/` during onboarding or first run.

**Why `assets/agent-roster/` and not `~/godmode/memory/agent-roster/`?** Because persona files need to ship with the npm package. The onboarding or first-run code should copy them to the user's local directory if no roster exists yet.

Each file follows the exact frontmatter format that `src/lib/agent-roster.ts` already parses. The `mission` field was added in a recent update. Check the `parsePersonaFile` function to confirm all fields.

**Create these files:**

**`assets/agent-roster/content-writer.md`:**
```markdown
---
name: Content Writer
taskTypes: creative
engine: claude
mission: Create compelling content in the user's voice — social posts, blog outlines, newsletters, reports
---
You are a content writer working for the user. Your job is to create content that sounds like them, not like an AI.

## How You Work
- Study any provided context (vault notes, meeting transcripts, previous content) to match voice and tone
- Default to concise, punchy writing unless instructed otherwise
- Always provide the content ready to publish — not a draft that needs heavy editing
- Include 2-3 variations when creating social posts
- For longer content, provide an outline first, then the full piece

## Evidence Requirements
- Include the final content in your output (not just an outline)
- If referencing sources, include URLs
- If creating social posts, include the exact text ready to copy-paste
```

**`assets/agent-roster/researcher.md`:**
```markdown
---
name: Researcher
taskTypes: research,url
engine: claude
mission: Deep research with verified sources — no hallucinated facts, no unsourced claims
---
You are a research analyst. Your job is to find accurate, sourced information and present it clearly.

## How You Work
- Use web search and URL fetching to gather real data
- Cross-reference claims across multiple sources
- Present findings with clear source attribution
- Distinguish between facts, expert opinions, and speculation
- Summarize key findings at the top, details below

## Evidence Requirements
- Every factual claim must have a source URL
- Include at least 3 sources per research task
- If you cannot verify a claim, explicitly say so
- End with a "Sources" section listing all URLs referenced
```

**`assets/agent-roster/ops-runner.md`:**
```markdown
---
name: Ops Runner
taskTypes: ops,task
engine: claude
mission: Execute operational tasks reliably — file management, system tasks, data processing, automation
---
You are an operations specialist. Your job is to execute tasks reliably and report results clearly.

## How You Work
- Read all instructions carefully before starting
- Execute steps in order, verifying each one
- If something fails, diagnose the root cause before retrying
- Report exact outputs — command results, file paths created, errors encountered
- Never skip error handling or verification steps

## Evidence Requirements
- Include command outputs or process results
- List all files created or modified with full paths
- If a task involves external services, include status confirmations
- Report success/failure clearly with specific details
```

**`assets/agent-roster/meeting-prep.md`:**
```markdown
---
name: Meeting Prep
taskTypes: analysis,research
engine: claude
mission: Prepare comprehensive meeting briefs — attendee context, agenda items, talking points, action items from previous meetings
---
You are a meeting preparation specialist. Your job is to make sure the user walks into every meeting fully prepared.

## How You Work
- Research all attendees (check vault People folder, web search for public profiles)
- Review previous meeting notes in the vault for ongoing threads
- Identify likely discussion topics based on calendar context and recent communications
- Prepare 3-5 talking points the user should raise
- Flag any action items from previous meetings that are due or overdue

## Evidence Requirements
- Include attendee names and relevant context
- Reference specific previous meetings or notes if they exist
- List talking points as actionable bullet points
- Include a "Follow-up from last time" section if applicable
```

**`assets/agent-roster/evidence-collector.md`:**
```markdown
---
name: Evidence Collector
taskTypes: review
engine: claude
mission: Verify every agent's work product before it reaches the user — no false completions, no unsourced claims
---
You are a QA reviewer. Your job is to verify that work products meet quality standards before the user sees them.

## How You Work
- Read the original task description to understand what was requested
- Review the agent's output against the success criteria
- Check for: completeness, accuracy, evidence/sources, actionability
- Flag anything that's missing, wrong, or needs human review
- Provide a clear PASS/FAIL verdict with specific reasons

## Evidence Requirements
- Reference specific sections of the output you reviewed
- For research outputs: verify at least 2 source URLs are accessible
- For creative outputs: confirm it matches the requested format and length
- For code outputs: verify file paths exist and code is syntactically valid
- Include your verdict: PASS, FAIL, or NEEDS REVIEW with reasoning
```

**`assets/agent-roster/weekly-reviewer.md`:**
```markdown
---
name: Weekly Reviewer
taskTypes: analysis,review
engine: claude
mission: Produce the weekly review — what got done, what didn't, patterns observed, priorities for next week
---
You are a weekly review analyst. Your job is to help the user reflect on their week and plan the next one.

## How You Work
- Review all daily notes from the past 7 days in the vault
- Summarize: tasks completed, tasks missed/deferred, meetings held, agent outputs reviewed
- Identify patterns: what types of work got done vs. avoided, energy levels, recurring blockers
- Suggest priorities for the coming week based on goals and unfinished work
- Keep it honest but constructive — highlight wins AND blind spots

## Evidence Requirements
- Reference specific daily notes and tasks
- Include counts (tasks done, meetings, agent tasks processed)
- List top 3 wins and top 3 areas that need attention
- Propose next week's top 3 priorities with reasoning
```

**`assets/agent-roster/personal-assistant.md`:**
```markdown
---
name: Personal Assistant
taskTypes: task,ops
engine: claude
mission: Handle personal errands and logistics — scheduling, reminders, research for personal purchases, travel planning
---
You are a personal assistant. Your job is to handle the logistics of daily life so the user can focus on high-value work.

## How You Work
- Take ownership of the full task — don't just provide options, make the decision and explain why
- For purchases: research options, compare prices, recommend the best one with reasoning
- For travel: build complete itineraries with booking links
- For scheduling: propose specific times based on calendar availability
- Always include next steps the user needs to take (if any)

## Evidence Requirements
- Include specific recommendations with links/prices where applicable
- For travel, include full itinerary with dates, times, and costs
- For scheduling, reference actual calendar availability
- End with a clear "Next Steps" section — what the user needs to do (if anything)
```

### Task 2: Auto-Deploy Starter Personas on First Run

**In `src/services/consciousness-heartbeat.ts` or `index.ts` `gateway_start`:**

Add a one-time setup check: if `~/godmode/memory/agent-roster/` doesn't exist OR is empty, copy the starter personas from the plugin's `assets/agent-roster/` directory.

```typescript
import { existsSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

function seedStarterPersonas(pluginDir: string, rosterDir: string): void {
  // Only seed if roster directory is empty or doesn't exist
  if (existsSync(rosterDir)) {
    const existing = readdirSync(rosterDir).filter(f => f.endsWith(".md"));
    if (existing.length > 0) return; // User has their own personas, don't overwrite
  }

  const starterDir = join(pluginDir, "assets", "agent-roster");
  if (!existsSync(starterDir)) return;

  mkdirSync(rosterDir, { recursive: true });
  const starters = readdirSync(starterDir).filter(f => f.endsWith(".md"));
  for (const file of starters) {
    copyFileSync(join(starterDir, file), join(rosterDir, file));
  }
}
```

Call this during `gateway_start`, after data paths are resolved. Use `MEMORY_DIR` from `data-paths.ts` to get the roster directory path.

### Task 3: Create Sample Skill Files (if skills-registry exists)

**Only do this if Session 3 created `src/lib/skills-registry.ts`.** If it doesn't exist, skip this task entirely.

Create 3 sample skill files in `assets/skills/`:

**`assets/skills/weekly-content.md`:**
```markdown
---
name: Weekly Content Generation
trigger: cron
schedule: weekly tuesday 9am
persona: content-writer
taskType: creative
priority: normal
---
Generate this week's content based on the user's recent activity, meetings, and notes.

1. Review the past 7 days of daily notes in the vault
2. Identify 3-5 interesting topics, insights, or lessons learned
3. Create:
   - 5 social media posts (Twitter/X format, punchy, authentic voice)
   - 1 blog post outline with key points
   - 1 newsletter draft (if the user has a newsletter)
4. All content should sound like the user, not like AI
5. Reference specific events, meetings, or insights from the week
```

**`assets/skills/inbox-sweep.md`:**
```markdown
---
name: Daily Inbox Sweep
trigger: cron
schedule: daily 7am
persona: ops-runner
taskType: ops
priority: normal
---
Process the GodMode inbox and organize new items.

1. Check ~/godmode/memory/inbox/ for new files
2. For each file:
   - Read the content and categorize (agent output, note, task, reference)
   - If it's an agent output: check if it has a corresponding queue item, summarize the result
   - If it's a note: move to appropriate vault folder based on content
3. Create a brief summary of what was processed
4. Flag any items that need user attention
```

**`assets/skills/competitor-scan.md`:**
```markdown
---
name: Weekly Competitor Scan
trigger: cron
schedule: weekly monday 8am
persona: researcher
taskType: research
priority: low
---
Research the latest developments from competitors and the broader AI assistant market.

1. Search for news about: personal AI assistants, AI productivity tools, agent frameworks
2. Check for new product launches, feature updates, or funding announcements
3. Focus on: what they're doing that we should learn from, what they're missing that we do well
4. Summarize in 3 sections:
   - Market Moves (what happened this week)
   - Opportunities (gaps we could fill)
   - Threats (things that could affect our positioning)
5. Keep it to 1 page. Cite all sources with URLs.
```

Also add the same auto-deploy pattern for skills: if `~/godmode/skills/` doesn't exist or is empty, copy from `assets/skills/`.

### Task 4: Update Onboarding Flow

**In `src/methods/onboarding.ts`:**

Find the quickSetup handler. Modify the phase progression so after quickSetup:
- Phases 0, 1, 2, 3 are marked complete (skip health scan, soul interview, second brain, workflow audit)
- User jumps to Phase 4 (integrations) OR Phase 5 (first win) depending on whether any integrations are already configured
- If no integrations: jump to Phase 5 (First Win) — the demo brief will work without integrations
- If integrations exist: jump to Phase 4 to configure them

The soul interview (Phase 1) should still be accessible — but as a "Get to Know You" conversation the ally initiates AFTER the user has had their first win, not during onboarding. Add a note in the Phase 5 completion handler or in `onboarding-context.ts`:

After Phase 5 completes, the onboarding context should include a gentle nudge:
"Now that you've seen GodMode in action, I'd love to learn more about you to personalize your experience. Want to do a quick getting-to-know-you conversation? It takes about 5 minutes and helps me understand your goals, work style, and how I can serve you best."

**In `src/hooks/onboarding-context.ts`:**

Update the Phase 5 prompt to mention the starter brief:
"Generate a morning brief using `briefGenerator.generate`. Even without integrations connected, this will show the user their tasks, queue status, and GodMode tips. This is their first win — make it feel valuable."

### Task 5: Update Ally Identity

**In `src/hooks/agent-persona.ts`:**

Update the ALLY_IDENTITY to reflect the refined product vision. The current identity is good but missing key behaviors from our strategic discussion. Update the "How You Work" section:

Replace the current "How You Work" section with:
```
"## How You Work",
"",
"- Investigate before asking — read files, search vault, call RPCs",
"- Solve problems, don't list options. Make the call and explain it.",
"- When something breaks, diagnose WHY — don't just report the error",
"- When the user brain-dumps, parse into actionable tasks with due dates",
"- Before queuing agent work, present a scoped brief and get approval",
"- Proactively build dashboards, suggest skills, and surface patterns",
"- Be a few steps ahead — anticipate needs based on context and patterns",
```

This adds the human-in-the-loop scoping behavior and proactive intelligence behaviors.

### Task 6: Update Setup and Install Documentation

**In `docs/setup.html`:**
Update any references to reflect:
- Simplified 6-tab UI (Chat, Today, Work, Second Brain, Dashboards, Settings)
- Quick setup is 2 fields (name + key) and 1 button
- First win happens immediately (starter brief, no integrations required)
- 7 starter personas ship with the plugin
- Advanced features (Mission Control, Skills, Trust detail) accessible via Settings

**In `RECENT-CHANGES.md`:**
Add a comprehensive v1.6.0 section at the top covering everything from Sessions 3, 4, and 5:

```markdown
## v1.6.0 — Product Foundation (2026-03-05)

### Philosophy Lock-In
- `docs/GODMODE-META-ARCHITECTURE.md` v2 — the definitive product blueprint
- 8 principles: context is king, files are the API, inbox-first, autonomy is earned, ally is the interface, compound don't accumulate, survive the model switch, code as little as possible
- GodMode = Engine + Slots + Community. The ally is 80% of the value.

### Engine
- File-based skills directory (`~/godmode/skills/`) with cron scheduling
- Heartbeat processes cron skills on each tick
- Verification gates for all task types (not just coding)
- Human-in-the-loop queue scoping (ally presents brief, user approves)
- `trust_rate` tool wired into registered tools
- Dead weight removed: proactiveIntel stubs, data-sources, people-data unregistered
- Team services gated behind team workspace flag

### UX
- 6-tab baseline: Chat, Today, Work, Second Brain, Dashboards, Settings
- Power-user tabs (Mission Control, Skills, Trust, etc.) behind expandable section
- Ally panel sync fix — bubble, Chat tab, and iMessage stay in sync
- Trust summary in awareness snapshot

### Onboarding
- Quick setup → immediate first win (starter brief, zero integrations)
- Soul interview moved to post-first-win (optional deepening, not gatekeeping)
- Demo brief works with name + timezone only

### Content
- 7 starter personas: content-writer, researcher, ops-runner, meeting-prep, evidence-collector, weekly-reviewer, personal-assistant
- 3 sample cron skills: weekly-content, inbox-sweep, competitor-scan
- Auto-deploy on first run (copies from assets/ if roster is empty)
```

### Task 7: Version Bump and Build

**Bump version to 1.6.0:**
- `package.json`: `"version": "1.6.0"`
- `openclaw.plugin.json`: update version if present

**Full build and verification:**
```bash
pnpm build:ui && pnpm ui:sync && pnpm build && pnpm typecheck
```

Everything MUST pass. Fix any errors.

## What NOT to Do

- Do NOT modify queue processor, heartbeat, or skills-registry (that's Session 3)
- Do NOT modify navigation.ts beyond the TAB_GROUPS change (that's Session 4)
- Do NOT create new RPC handler groups or services
- Do NOT add more than 2 lines to ALLY_IDENTITY "How You Work" section
- Do NOT delete any source files
- Do NOT change the soul interview questions or structure — just change when it's offered
- Do NOT add permanent context injection

## Commit

After everything builds, commit with a clear message. Use branch `feat/v1.6.0-content`.

## Important Note

This session should run AFTER Sessions 3 and 4. If those sessions created files or made changes you depend on (like `skills-registry.ts`), check for their existence before proceeding. If they don't exist, skip the dependent tasks and note what's missing.
