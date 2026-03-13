# Overnight Implementation Plan: Paperclip + Proof Integration

**Date:** 2026-03-12
**Branch assignments:**
- Claude Code → `feat/paperclip-proof-claude`
- Codex 5.4 → `feat/paperclip-proof-codex`

**Goal:** Give GodMode real-time co-working with agents. Users watch agents write, steer via Prosper or direct editing, share results with provenance tracking, and close the self-evolution loop through universal inbox scoring that writes corrections directly into agent/skill files.

**The GodMode Meta-Pattern:** Your ally (Prosper) is your strategic partner and chief of staff. He knows all your context across all businesses and projects, has access to your entire second brain and tools. You do all your work in GodMode's web UI — chatting with Prosper, juggling sessions, managing tasks through daily briefs. When serious work needs doing, Prosper interviews you for crystal-clear clarity, then delegates to a swarm of specialist agents via Paperclip, with all output written to Proof docs you can watch and steer in real-time. Everything that gets done surfaces in the inbox for scoring. Low scores write corrections directly into the agent/skill files. The whole system gets better every day in an upward spiral via the trust tracker. Cron jobs handle recurring business functions (SEO cleanup, inbox triage, ad management) using the same agents and tools. This pattern works for ALL founders and entrepreneurs.

---

## Context You MUST Read First

Before writing ANY code, read these files:
- `docs/GODMODE-META-ARCHITECTURE.md` — The product blueprint. Everything must align.
- `CLAUDE.md` — Coding guardrails, build process, scope boundaries.
- `HARNESS.md` — Branch/build/merge workflow.
- `src/services/queue-processor.ts` — How agents are spawned and managed today.
- `src/lib/queue-state.ts` — Queue item types, states, data structures.
- `src/lib/agent-roster.ts` — Persona resolution, trust scores, prompt building.
- `src/lib/context-budget.ts` — What Prosper knows per turn (P0-P3 tiers).
- `ui/src/ui/views/markdown-sidebar.ts` — Current sidebar/resource viewer.
- `ui/src/ui/app-render.ts` — Main UI rendering, sidebar integration.
- `skill-cards/project-pipeline.md` — Existing chief-of-staff skill card.

---

## Architecture Overview

### Three-Tier Work Model

```
Tier 1: INLINE          Tier 2: SINGLE AGENT + PROOF     Tier 3: SWARM (PAPERCLIP + PROOF)
─────────────────       ──────────────────────────────    ──────────────────────────────────
Prosper answers         One agent writes to Proof          Paperclip orchestrates N agents
in chat directly        User watches + co-edits            All write to shared Proof doc
                        Prosper can steer mid-task         User watches + steers via Prosper
                                                          or edits Proof directly

Examples:               Examples:                          Examples:
- Quick questions       - Email copy                       - Full website build
- Task creation         - Blog post draft                  - Sales campaign
- Schedule check        - Code review summary              - Product launch
                        - Research brief                   - Content campaign
```

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GodMode UI                           │
│  ┌──────────────┐  ┌────────────────────────────────┐   │
│  │  Chat Panel   │  │  Side Viewer                   │   │
│  │  (Prosper)    │  │  ┌──────────────────────────┐  │   │
│  │               │  │  │  Proof Editor (embedded)  │  │   │
│  │  User steers  │  │  │  - Provenance colors     │  │   │
│  │  via chat     │──│  │  - Live agent writing     │  │   │
│  │               │  │  │  - Human can edit inline  │  │   │
│  │               │  │  │  - Comments/suggestions   │  │   │
│  │               │  │  └──────────────────────────┘  │   │
│  │               │  │  OR: Regular resource viewer   │   │
│  └──────────────┘  └────────────────────────────────┘   │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
    ┌──────▼──────┐          ┌────────▼────────┐
    │   Prosper    │          │   Proof Server   │
    │   (Ally)     │          │   (localhost:4000)│
    │              │──steer──▶│   - HTTP API      │
    │  chief of    │          │   - WebSocket     │
    │  staff       │          │   - SQLite store   │
    └──────┬──────┘          └────────▲────────┘
           │                          │
    ┌──────▼──────────────────────────┤
    │        Paperclip Adapter        │
    │  (src/services/paperclip.ts)    │
    │                                 │
    │  Maps GodMode queue items to    │
    │  Paperclip heartbeat protocol   │
    │  Agents write to Proof via API  │
    └──────┬──────────────────────────┘
           │
    ┌──────▼──────┐
    │  Agent Roster│
    │  (existing)  │
    │  39 personas │
    └─────────────┘
```

---

## Phase 0: Universal Inbox & Self-Evolution Loop (BUILD ALONGSIDE PHASE 1)

This is the feedback engine that makes everything else compound. Without this, Proof and Paperclip are just tools. With this, the whole system gets better every day.

### 0A. Universal inbox redesign

**What lands in inbox (high signal only):**
- Agent executions (queue results that happened in the background)
- Skill runs (that weren't already reviewed/scored in the live chat session)

**What does NOT land in inbox:**
- Resources (live in workspaces + session chats — easy to find there)
- Task completions (if you checked it off yourself, you were already there)
- Anything already reviewed/scored in a live session (dedup flag: `reviewedInSession`)
- Chat messages
- System events

**Deduplication rule:** If a skill or agent output was already reviewed and scored during the live chat session where it ran, do NOT add it to the inbox. The inbox is strictly for "here's what your agents did while you weren't watching."

**Inbox item card design:**

Each card shows: title, source (which agent/skill), timestamp, brief summary.

Four actions per card:

| Action | Behavior |
|--------|----------|
| **View Output** | Opens Proof doc or sidebar preview in-place. User stays on inbox, just peeking. |
| **Open Chat** | Jumps to the session where the work happened. Full context. |
| **Complete** | Marks done. Optional 1-10 score (matches trust tracker). Tap stars or skip (defaults to 7). |
| **Dismiss** | Removes from inbox without scoring. For stuff you don't care about. |

**Implementation:**

30. **Create universal inbox service** → `src/services/inbox.ts`
    - Unified inbox that collects completions from: queue processor, skill runner, task system
    - Each inbox item:
      ```typescript
      type InboxItem = {
        id: string;
        type: "agent-execution" | "skill-run";
        title: string;
        summary: string;
        source: { persona?: string; skill?: string; taskId?: string };
        proofDocSlug?: string;       // If output is in Proof
        outputPath?: string;         // If output is a file
        sessionId?: string;          // Chat session where work happened
        createdAt: string;
        status: "pending" | "reviewed" | "dismissed";
        score?: number;              // 1-10
        feedback?: string;           // User feedback on low/high scores
      };
      ```
    - Persist to `~/godmode/data/inbox.json`
    - RPC methods: `inbox.list`, `inbox.score`, `inbox.dismiss`, `inbox.count`

31. **Wire inbox into existing completion flows**
    - `queue-processor.ts` `handleItemCompleted()` → push to inbox (always — these are background agent work)
    - Skill execution completion → push to inbox ONLY IF not already reviewed in the live session (check `reviewedInSession` flag)
    - Do NOT push task completions (user already reviewed when they checked it off)
    - Each push broadcasts `inbox:update` to UI for live refresh

### 0B. Self-evolution feedback loop

This is the killer feature. Low scores make agents and skills better automatically.

32. **Feedback-to-source writer** → `src/lib/feedback-writer.ts`
    ```typescript
    async function writeFeedbackToSource(
      item: InboxItem,
      score: number,
      feedback: string
    ): Promise<void> {
      // 1. Write to agent-lessons.ts JSONL (for routing intelligence)
      appendLesson(item.source.persona, feedback, score);

      // 2. Write to persona markdown file (for execution intelligence)
      if (item.source.persona) {
        const personaPath = resolvePersonaPath(item.source.persona);
        const existing = await readFile(personaPath, "utf-8");

        if (score <= 4) {
          // Append correction under ## Corrections section
          const correction = `\n- [${new Date().toISOString().slice(0,10)}] Score ${score}/10: ${feedback}`;
          if (existing.includes("## Corrections")) {
            // Append to existing section
            appendToSection(personaPath, "## Corrections", correction);
          } else {
            // Create section at end of file
            appendFile(personaPath, `\n\n## Corrections${correction}`);
          }
        }

        if (score >= 9) {
          // Append reinforcement under ## What Works Well section
          const reinforcement = `\n- [${new Date().toISOString().slice(0,10)}] Score ${score}/10: ${feedback}`;
          if (existing.includes("## What Works Well")) {
            appendToSection(personaPath, "## What Works Well", reinforcement);
          } else {
            appendFile(personaPath, `\n\n## What Works Well${reinforcement}`);
          }
        }
      }

      // 3. Same pattern for skill cards
      if (item.source.skill) {
        const skillPath = resolveSkillPath(item.source.skill);
        // Append feedback to skill file under ## Corrections or ## What Works Well
        // Same logic as persona files
      }
    }
    ```

33. **Score-triggered feedback UI flow**
    - Scores 1-4: Text field appears — "What went wrong?" Required before completing.
    - Scores 5-8: Just the number. No prompt. Fast path.
    - Scores 9-10: Optional text field — "What was great?" (can skip)
    - The feedback text gets passed to `writeFeedbackToSource()`

34. **Inbox UI component** → `ui/src/ui/views/inbox.ts`
    - Render inbox cards with the 4 actions
    - Score widget: 10 stars (or numbered buttons 1-10), clickable
    - Feedback text field appears conditionally based on score
    - Badge count on Today tab showing unreviewed inbox items
    - "Mark all as complete" bulk action (scores default to 7)

35. **Surface inbox in Today tab**
    - Today tab already shows schedule, tasks, brief
    - Add "Inbox" section showing pending items count + list
    - Or: inbox gets its own sub-section in Today, always visible
    - Badge: unreviewed count appears on Today tab label

---

## Phase 1: Proof Integration (DO THIS FIRST)

Proof is the foundation — agents need somewhere to write before we orchestrate them.

### 1A. Install and embed Proof SDK

**Package:** `proof-sdk` (MIT, npm)
**Key packages within:** `doc-core`, `doc-editor`, `doc-server`, `agent-bridge`, `doc-store-sqlite`
**Stack:** Milkdown (ProseMirror-based), Yjs CRDT, Hocuspocus WebSocket, Express, SQLite

**Tasks:**

1. **Add proof-sdk dependency**
   ```bash
   pnpm add proof-sdk
   ```
   If the SDK isn't published as a single package, clone `EveryInc/proof-sdk` and reference the sub-packages. Check npm first.

2. **Create Proof server service** → `src/services/proof-server.ts`
   - Start Proof's Express API server on `localhost:4000` during `gateway_start`
   - Start Hocuspocus WebSocket server for real-time sync
   - Configure SQLite storage at `~/godmode/data/proof-docs.db`
   - Health check endpoint at `/health`
   - Register with health ledger (`health.signal("proof-server", ...)`)
   - Graceful shutdown on gateway stop

3. **Create Proof bridge client** → `src/lib/proof-bridge.ts`
   - Wrapper around Proof's HTTP Agent Bridge API
   - Methods:
     ```typescript
     createDocument(title: string, initialContent?: string): Promise<{ slug: string, url: string }>
     readDocument(slug: string): Promise<{ content: string, state: any }>
     editDocument(slug: string, content: string, author: "agent" | "ally" | "human"): Promise<void>
     addComment(slug: string, position: number, text: string, author: string): Promise<void>
     addSuggestion(slug: string, range: Range, replacement: string, author: string): Promise<void>
     getPresence(slug: string): Promise<{ users: string[] }>
     ```
   - Author tracking maps to provenance colors (agent=purple/red, human=green)
   - All operations go through `localhost:4000`

4. **Create Proof tool for Prosper** → `src/tools/proof-tool.ts`
   - Tool name: `proof_editor`
   - Actions:
     - `create` — Create new Proof doc, returns slug + opens in sidebar
     - `write` — Write/append content to a doc
     - `read` — Read current doc state
     - `comment` — Add inline comment
     - `suggest` — Add suggested edit
     - `open` — Open existing doc in sidebar
     - `share` — Generate share link
     - `export_gdrive` — Export to Google Drive (use existing gog integration)
   - Register in `index.ts` tools array

### 1B. Embed Proof editor in UI sidebar

**Current sidebar:** `ui/src/ui/views/markdown-sidebar.ts` renders markdown, HTML, images, PDF, JSON in the side panel. It detects MIME type and renders accordingly.

**Tasks:**

5. **Create Proof editor component** → `ui/src/ui/views/proof-viewer.ts`
   - Embed Proof's editor (Milkdown/ProseMirror) in an iframe pointed at `localhost:3000/doc/{slug}`
   - OR if Proof SDK exports embeddable components, import and render directly
   - Iframe approach is simpler and more reliable (Proof manages its own state):
     ```typescript
     export function renderProofViewer(slug: string, onClose: () => void) {
       return html`
         <div class="proof-viewer" style="height: 100%; display: flex; flex-direction: column;">
           <div class="proof-toolbar" style="...">
             <span class="proof-title">${slug}</span>
             <button @click=${onClose}>Close</button>
             <button @click=${() => shareDoc(slug)}>Share</button>
             <button @click=${() => exportDrive(slug)}>Drive</button>
           </div>
           <iframe
             src="http://localhost:3000/doc/${slug}"
             style="flex: 1; border: none; width: 100%;"
           ></iframe>
         </div>
       `;
     }
     ```
   - Provenance colors (green/purple) come from Proof's native UI — no extra work needed

6. **Wire sidebar to support Proof docs**
   - Add `sidebarMode: "resource" | "proof"` to app view state
   - Add `sidebarProofSlug: string | null` to app view state
   - When `sidebarMode === "proof"`, render `renderProofViewer()` instead of `renderMarkdownSidebar()`
   - Add RPC handler to open Proof docs: `proof.open` → sets sidebar state

7. **Add Proof doc links to chat tool cards**
   - When Prosper uses `proof_editor` tool with `create` or `open`, render a clickable card in chat
   - Card shows doc title + "Open in Proof" button
   - Clicking opens the Proof viewer in sidebar

### 1C. Proof document lifecycle

8. **Link Proof docs to queue items**
   - Add `proofDocSlug?: string` field to `QueueItem` in `queue-state.ts`
   - When a queue item is created with Proof output, create the Proof doc and store the slug
   - When item completes, the output is already in the Proof doc (not just `~/godmode/memory/inbox/`)

9. **Link Proof docs to task sessions**
   - Add `proofDocSlug?: string` to session/task metadata
   - When Prosper opens a Proof doc for a task, associate it with the session
   - Proof doc persists beyond the session for future reference

10. **Sharing and export**
    - Share: Generate a localhost URL like `http://localhost:3000/doc/{slug}` for local sharing
    - For remote sharing: Use Proof's public hosting or generate a static HTML export
    - Google Drive export: Read Proof doc content → convert to Google Docs format → upload via existing `gog` CLI integration
    - Add "Share" and "Export to Drive" buttons to Proof viewer toolbar

---

## Phase 2: Single-Agent + Proof (Tier 2)

Make individual agents write to Proof instead of flat files.

### 2A. Agent-to-Proof output pipeline

11. **Modify queue processor to use Proof** → `src/services/queue-processor.ts`
    - In `processItem()`, before spawning agent:
      - Create a Proof doc: `proofBridge.createDocument(item.title)`
      - Store slug on the queue item: `item.proofDocSlug = slug`
      - Include Proof API instructions in the agent's system prompt:
        ```
        ## Output Document
        Write your work to the Proof document at: http://localhost:4000/documents/{slug}/edit
        Use POST requests to update the document as you work.
        The human can see your progress in real-time.
        ```
    - In `handleItemCompleted()`:
      - Read final content from Proof doc instead of (or in addition to) inbox file
      - Store Proof slug in result artifacts

12. **Auto-open Proof viewer when agent starts**
    - When queue item enters `processing` state, broadcast event to UI
    - UI auto-opens Proof viewer in sidebar if the task has a `proofDocSlug`
    - User sees live updates as agent writes

13. **Agent prompt modifications** → `src/lib/agent-roster.ts`
    - In `buildPromptForItem()`, add Proof writing instructions when item has a Proof doc
    - Include the HTTP API endpoint and expected format
    - Agent writes sections progressively (not all at once at the end)

### 2B. Real-time steering for single agents

14. **Prosper steering via chat**
    - When a queue item is `processing` and has a Proof doc:
      - Prosper can use `proof_editor` tool to write instructions/feedback into the doc
      - OR Prosper can use a new `queue_steer` tool to send a message to the running agent
    - Create `queue_steer` tool → `src/tools/queue-steer.ts`:
      ```typescript
      // Tool: queue_steer
      // Sends a steering instruction to a running agent
      // The instruction is appended to the agent's context on next heartbeat
      {
        action: "steer",
        itemId: string,
        instruction: string  // "Focus more on mobile responsiveness" etc.
      }
      ```

15. **Human steering via Proof**
    - Human edits the Proof doc directly (types, deletes, restructures)
    - Agent sees changes on next read of the document
    - Provenance tracks which parts are human (green) vs agent (purple)
    - No special code needed — this is native to Proof's CRDT model

---

## Phase 3: Paperclip Swarm Orchestration (Tier 3)

For complex multi-agent work. This builds on Phase 1 and 2.

### 3A. Paperclip adapter

16. **Install Paperclip**
    ```bash
    pnpm add paperclip
    ```
    If not available as npm package, evaluate running Paperclip server as a subprocess or embedding its core orchestration logic.

    **Important:** Paperclip requires PostgreSQL. Options:
    - Use Paperclip's embedded PG for local dev
    - OR adapt Paperclip's orchestration logic to work with GodMode's existing SQLite/JSON storage
    - Preference: Adapt to SQLite if feasible, to avoid adding PG dependency

17. **Create Paperclip adapter service** → `src/services/paperclip-adapter.ts`

    This is the bridge between Paperclip's heartbeat protocol and GodMode's queue system.

    ```typescript
    export class PaperclipAdapter {
      // Map GodMode personas to Paperclip agents
      async registerAgents(): Promise<void> {
        const roster = listRoster();
        for (const persona of roster) {
          // Register each persona as a Paperclip agent
          // Map taskTypes to Paperclip task categories
          // Set heartbeat frequency (default: 30s for active tasks)
        }
      }

      // Create a Paperclip "company" for a project
      async createProject(brief: ProjectBrief): Promise<PaperclipProject> {
        // Brief includes: goal, tasks, agent assignments, dependencies
        // Returns project with org chart + task graph
      }

      // Handle heartbeat from Paperclip → spawn/steer GodMode agents
      async onHeartbeat(agentId: string, taskId: string): Promise<void> {
        // 1. Find matching persona
        // 2. Check if agent is already processing
        // 3. If new task: create queue item + Proof doc
        // 4. If existing task: check for steering instructions
        // 5. Report status back to Paperclip
      }

      // Report completion back to Paperclip
      async onAgentComplete(itemId: string): Promise<void> {
        // 1. Read Proof doc content
        // 2. Report to Paperclip as task completion
        // 3. Paperclip routes to next agent in pipeline
      }
    }
    ```

18. **Org chart mapping**
    - Paperclip org charts map to GodMode's persona categories:
      ```
      Paperclip Org Chart     →    GodMode Roster
      ─────────────────            ─────────────────
      CEO (Prosper)           →    ally (always Prosper)
      Design Lead             →    design/brand-guardian
      Design IC               →    design/ux-researcher
      Engineering Lead        →    engineering/software-architect
      Engineering IC          →    engineering/code-reviewer
      Marketing Lead          →    marketing/growth-hacker
      Content IC              →    creative/content-writer
      SEO IC                  →    marketing/seo-specialist
      ```
    - Auto-generate org chart from roster categories
    - Prosper is always the "CEO" / chief of staff

19. **Pipeline execution with Paperclip**
    - When Prosper triggers a multi-agent project (via `project-pipeline` skill card):
      1. Prosper scopes the project via discovery (existing skill card handles this)
      2. Prosper creates a Paperclip project with the brief
      3. Paperclip creates the org chart + task graph
      4. Each task gets a Proof doc for output
      5. Paperclip heartbeats wake agents sequentially (respecting dependencies)
      6. Each agent writes to its Proof doc
      7. Handoff context passes between agents via Paperclip + queue `handoff` field
      8. Prosper monitors progress, steers as needed
      9. User reviews deliverables in Proof viewer

### 3B. Multi-document Proof workspace

20. **Project-level Proof workspace**
    - For swarm projects, create a "workspace" of related Proof docs:
      ```
      Project: GodMode Website
      ├── Brand Guide (brand-guardian output)
      ├── Page Copy (content-writer output)
      ├── UX Recommendations (ux-researcher output)
      ├── Implementation Notes (frontend-developer output)
      └── SEO Audit (seo-specialist output)
      ```
    - Add `proofWorkspace?: string` to queue items and tasks
    - Sidebar shows doc list for the workspace with tabs/accordion

21. **Cross-document references**
    - Agents can reference other docs in the workspace
    - "See Brand Guide for color palette" links to another Proof doc
    - Prosper can pull context from any doc in the workspace when steering

### 3C. Budget and trust integration

22. **Token budget tracking**
    - If using Paperclip's budget engine: map to GodMode's existing token tracking
    - If not using Paperclip's budget engine: extend GodMode's trust tracker with per-project cost tracking
    - Surface budget status in context injection (P2 tier)

23. **Trust score updates**
    - When agents complete swarm tasks, update trust scores as usual
    - Paperclip completion events trigger the same `ratePersona()` flow
    - Rejection routing: if user rejects a deliverable, Prosper re-queues to the same agent with feedback (existing pattern)

---

## Phase 4: Prosper Chief-of-Staff Awareness

Make Prosper naturally aware of all these capabilities.

24. **Update context injection** → `src/lib/context-budget.ts`
    - Current nudge (4 lines, ~50 tokens) is good. Extend slightly:
      ```typescript
      function buildAgentRosterNudge(): string | null {
        const count = listRoster().length;
        if (count === 0) return null;
        const hasProof = isProofRunning(); // check if Proof server is healthy
        return [
          "## Agent Team",
          `You have ${count} specialist agents available for delegation.`,
          "For async work (research, content, analysis, code review, outreach): offer to queue it.",
          hasProof
            ? "You can open a Proof doc for any collaborative writing — the human sees your work live and can co-edit."
            : "",
          "For complex multi-specialist projects: use the project pipeline skill to scope and orchestrate.",
        ].filter(Boolean).join("\n");
      }
      ```
    - Keep it under 80 tokens. This is P1 (normal priority).

25. **Update project-pipeline skill card** → `skill-cards/project-pipeline.md`
    - Add Proof integration instructions:
      ```markdown
      ## Output to Proof
      For every deliverable, create a Proof document using the `proof_editor` tool.
      The user can watch progress in real-time and co-edit.
      When the pipeline completes, all deliverables are in Proof docs with full provenance.
      ```
    - Add Paperclip integration instructions (when available):
      ```markdown
      ## Swarm Execution (when Paperclip is active)
      For multi-agent projects, use Paperclip to orchestrate the pipeline.
      Each agent in the pipeline gets its own Proof doc.
      You monitor progress and steer agents as needed.
      ```

26. **Create Proof skill card** → `skill-cards/proof-editor.md`
    ```yaml
    ---
    domain: files
    triggers: write a doc, collaborative doc, proof, co-edit, watch me write, live document, share document
    tools: proof_editor
    ---
    ```
    - Teach Prosper when and how to use Proof
    - Include examples: email copy, blog post, research brief, proposal

---

## Phase 5: Cron Workflow Automation

Prosper creates recurring business workflows as cron jobs using agents and tools.

36. **Create cron-workflow skill card** → `skill-cards/cron-workflows.md`
    ```yaml
    ---
    domain: integrations
    triggers: recurring, every day, every week, weekly, daily, automate, workflow, schedule task, set up routine, ongoing
    tools: cron_create, cron_list, queue_add
    ---
    ## When to Use
    User wants a recurring business function automated:
    - Daily inbox triage
    - Weekly SEO audit
    - Daily ad performance check
    - Weekly content calendar review
    - Daily social media posting
    - Weekly pipeline review

    ## How to Create Workflows
    1. Ask the user what needs to happen, how often, and what success looks like
    2. Identify which agent(s) should handle it (check the roster)
    3. Create a cron job that queues the right agent with the right prompt
    4. The agent's output lands in the inbox for scoring
    5. Over time, low scores improve the agent via the feedback loop

    ## Cron + Agent Pattern
    Each cron job should:
    - Queue an agent execution via `queue_add` with the right persona
    - Include specific instructions in the description (not generic)
    - Set the right task type so the evidence gates apply
    - Results go through inbox → scoring → feedback → agent improvement

    ## Examples
    - "Set up weekly SEO audit" → cron every Monday 6am → queues `seo-specialist` with "Audit lifeongodmode.com for this week's SEO issues"
    - "Daily inbox triage" → cron every day 7am → queues `researcher` with "Review today's emails and surface action items"
    - "Weekly content review" → cron every Friday 5pm → queues `content-writer` with "Review this week's content performance and suggest next week's topics"
    ```

37. **Ensure cron → queue → inbox pipeline works end-to-end**
    - Cron fires → creates queue item → agent processes → output in Proof/inbox file → lands in inbox → user scores → feedback writes to agent file
    - This is the recurring self-evolution loop. Every week the SEO agent gets a little better at auditing because the user's corrections accumulate in its persona file.

---

## Phase 6: UI Polish

27. **Proof viewer toolbar**
    - Share button → copy link
    - Export to Drive button → existing gog integration
    - Open in browser button → `localhost:3000/doc/{slug}`
    - Provenance legend (green=human, purple=agent)
    - Connected agents indicator (who's currently writing)

28. **Mission Control integration**
    - Show Proof doc links on active queue items
    - Click to open Proof viewer for any in-progress item
    - Show provenance breakdown (% human vs % agent) on completed items

29. **Work tab artifacts**
    - Proof docs appear as artifacts on the Work tab
    - Grouped by project/workspace if part of a swarm
    - Searchable, filterable, sortable by date

---

## Implementation Order (Critical Path)

```
Phase 0A (Inbox service + RPC)       ← Can start immediately (no dependencies)
Phase 0B (Feedback writer)           ← Needs 0A
    ↓
Phase 1A (Proof server + bridge)     ← Can start in parallel with Phase 0
    ↓
Phase 1B (UI sidebar embed)          ← Can start immediately after 1A
    ↓
Phase 0C-D (Inbox UI + Today tab)    ← Needs 0A + 0B
    ↓
Phase 1C (Doc lifecycle)             ← Needs 1A + 1B
    ↓
Phase 2A (Agent → Proof output)      ← Needs 1A + 1C
    ↓
Phase 2B (Steering)                  ← Needs 2A
    ↓
Phase 4 (Prosper awareness)          ← Can happen anytime after Phase 1
    ↓
Phase 5 (Cron workflows)            ← Needs Phase 0 (inbox) + Phase 2 (agents → Proof)
    ↓
Phase 3A (Paperclip adapter)         ← Needs Phase 2 working
    ↓
Phase 3B (Multi-doc workspace)       ← Needs 3A
    ↓
Phase 3C (Budget + trust)            ← Needs 3A
    ↓
Phase 6 (UI polish)                  ← Last
```

**Minimum viable overnight delivery:** Phases 0 + 1 + 2 + 4 + 5 (skill cards). This gives us:
- Universal inbox with self-evolution feedback loop
- Proof integration with live co-editing
- Single-agent → Proof pipeline
- Real-time steering
- Cron workflow skill card
- Prosper chief-of-staff awareness

Paperclip swarm orchestration (Phase 3) is a follow-up sprint.

---

## Branch Strategy for Adversarial Comparison

### Claude Code Branch: `feat/paperclip-proof-claude`

```bash
git checkout feat/interaction-ledger-l6
git checkout -b feat/paperclip-proof-claude
```

Focus: **Phases 1 + 2 + 4** (Proof integration, single-agent pipeline, Prosper awareness)

Why: Claude Code excels at deep integration work — wiring services, modifying existing TypeScript, understanding the full codebase context. Give it the core Proof integration.

### Codex 5.4 Branch: `feat/paperclip-proof-codex`

```bash
git checkout feat/interaction-ledger-l6
git checkout -b feat/paperclip-proof-codex
```

Focus: **Phases 1 + 2 + 4** (same scope — adversarial comparison on identical requirements)

Why: Both agents get the same brief so you can compare approaches, code quality, and integration depth. Tomorrow you pick the better one or merge the best parts of both.

### Comparison Criteria

When reviewing both branches tomorrow:

| Criterion | What to Look For |
|-----------|-----------------|
| **Architecture** | Clean separation of concerns? Over/under-engineered? |
| **Integration depth** | Does it actually work with existing queue/roster/sidebar? |
| **Code quality** | TypeScript types, error handling, health ledger signals |
| **Proof embedding** | Iframe vs native component? Provenance visible? |
| **Agent output** | Do agents actually write to Proof progressively? |
| **Steering** | Can Prosper steer a running agent via chat? |
| **UI polish** | Does the sidebar viewer feel native to GodMode? |
| **Build health** | Does `pnpm build && pnpm typecheck` pass? |
| **Bloat** | Lines of code added. Less is more (Golden Rule 1). |

---

## Files That Will Be Created

```
src/services/inbox.ts                # Universal inbox service + RPC
src/lib/feedback-writer.ts           # Writes scores/feedback into persona + skill files
ui/src/ui/views/inbox.ts             # Inbox UI component (cards, scoring, feedback)
src/services/proof-server.ts         # Proof Express + Hocuspocus server
src/lib/proof-bridge.ts              # Proof HTTP API client wrapper
src/tools/proof-tool.ts              # proof_editor tool for Prosper
src/tools/queue-steer.ts             # queue_steer tool for live steering
src/services/paperclip-adapter.ts    # Paperclip ↔ GodMode bridge (Phase 3)
ui/src/ui/views/proof-viewer.ts      # Proof editor embedded in sidebar
skill-cards/proof-editor.md          # Proof skill card for Prosper
skill-cards/cron-workflows.md        # Cron workflow automation skill card
```

## Files That Will Be Modified

```
src/services/queue-processor.ts      # Create Proof docs, agent prompt injection, push to inbox
src/lib/queue-state.ts               # Add proofDocSlug field to QueueItem
src/lib/agent-roster.ts              # Add Proof instructions to agent prompts
src/lib/context-budget.ts            # Update roster nudge with Proof awareness
src/methods/queue.ts                 # Add Proof doc creation in queue.add
ui/src/ui/app-view-state.ts          # Add sidebarMode, sidebarProofSlug, inbox state
ui/src/ui/app-render.ts              # Wire Proof viewer + inbox rendering
ui/src/ui/views/markdown-sidebar.ts  # Add Proof mode toggle
ui/src/ui/views/my-day.ts            # Add inbox section to Today tab
ui/src/ui/app.ts                     # Add Proof + inbox state properties
index.ts                             # Register tools, start Proof server, register inbox RPC
skill-cards/project-pipeline.md      # Add Proof output instructions
package.json                         # Add proof-sdk dependency
```

---

## Guardrails

- **Golden Rule 1:** This is engine code (orchestration, output surface). It belongs in TypeScript. Proof docs are files, not code.
- **Golden Rule 2:** Proof IS the document editor. We're conducting, not rebuilding. We embed Proof, not build our own editor.
- **Golden Rule 3:** Prosper crafts the prompts. Paperclip coordinates the agents. Quality scales through prompt quality.
- **Self-surgery:** Agents MUST NOT use Proof/Paperclip to modify GodMode's own codebase. The builder agent stays separate.
- **Context budget:** Keep injection under 200 tokens total for Proof + roster nudge combined.
- **Health ledger:** Register Proof server with `health.signal()`. Self-heal can restart it.
- **Evidence gates:** Proof docs count as evidence artifacts. Update `checkEvidence()` to recognize Proof doc slugs.

---

## Smoke Test Checklist

After implementation, verify:

**Inbox + Self-Evolution:**
1. [ ] `pnpm build && pnpm typecheck` passes
2. [ ] Agent execution completion creates inbox item
3. [ ] Inbox UI renders cards with View Output / Open Chat / Complete / Dismiss
4. [ ] Score 1-4 triggers "What went wrong?" feedback field
5. [ ] Low-score feedback writes into persona markdown file under `## Corrections`
6. [ ] Low-score feedback also writes to agent-lessons JSONL
7. [ ] Score 9-10 with feedback writes to persona under `## What Works Well`
8. [ ] Inbox count badge appears on Today tab
9. [ ] Resources do NOT appear in inbox (only in workspaces + sessions)
9a. [ ] Task completions do NOT appear in inbox
9b. [ ] Skills already scored in live session do NOT appear in inbox (dedup)

**Proof Integration:**
10. [ ] Proof server starts on gateway_start
11. [ ] Prosper can create a Proof doc via `proof_editor` tool
12. [ ] Proof doc opens in sidebar viewer
13. [ ] Human can edit in Proof viewer (iframe interaction works)
14. [ ] Queue item creates a Proof doc when processing starts
15. [ ] Agent writes to Proof doc progressively (not just at end)
16. [ ] Human edits are visible to agent on next read
17. [ ] Prosper can steer a running agent via chat
18. [ ] Proof doc has provenance colors (human=green, agent=purple)
19. [ ] Share link works (opens in browser)
20. [ ] Export to Drive works (via existing gog integration)

**System Health:**
21. [ ] Context injection mentions Proof without bloating budget
22. [ ] Health ledger tracks Proof server status
23. [ ] `pnpm ui:sync` updates fallback snapshot
24. [ ] Cron workflow skill card triggers on relevant keywords

---

## Prompt for Overnight Agent

Copy everything above this line and paste it into a new Claude Code or Codex session with this preamble:

> You are implementing the Paperclip + Proof integration for the GodMode plugin. The plan above is your specification. Work through it in the order specified (Phase 0 → 1 → 2 → 4 → 5 minimum). Create your branch, implement, build, typecheck, and commit as you go. If anything is ambiguous, make the simpler choice. If a dependency (proof-sdk, paperclip) isn't available as expected, adapt — embed the core logic or use HTTP APIs directly. The goal is a working prototype by morning, not perfection. Ship it.

---

## Roadmap: Future Sprints (NOT for tonight)

These are the next horizons after the overnight build. Saved here for reference.

### Sprint 2: Paperclip Swarm Orchestration
- Phase 3A-3C from above (Paperclip adapter, multi-doc workspace, budget + trust)
- True multi-agent coordination with dependency chains
- Org chart auto-generation from roster categories

### Sprint 3: Team Workspace Sharing
- Workspaces can be synced and shared across team members
- Shared skills, shared agents, shared tasks between team allies
- Each team member gets their own ally instance with shared context
- Agents can cross-talk between workspaces via back-channel sync

### Sprint 4: Ally-in-Slack
- Prosper lives in Slack for human co-working at communication level
- Slack messages can trigger agent delegation
- Agent results surface in Slack channels
- Bots have their back channel for coordination

### Sprint 5: Multi-Ally Coordination
- CEO's chief of staff manages other teams' allies
- Deduplication engine: prevent duplicate skills, agents, cron jobs, and work across teams
- Cross-team alignment: CEO ally ensures all team allies are working toward same goals
- Shared memory graph across the organization

### Sprint 6: Marketplace
- Community-contributed agents, skills, and workflow templates
- Install with one click, customize via persona files
- Trust scores aggregate across the community
- The engine + slots + community model fully realized
