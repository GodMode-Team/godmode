# GodMode Second Brain — Complete Build Plan

**Purpose:** Make GodMode's memory human-readable, editable, portable via MCP, and self-enriching through automatic ingestion. This is the plan for Claude Code to execute.

**Repo:** `~/Projects/godmode-plugin/`
**UI framework:** Lit (web components), all views in `ui/src/ui/views/`
**Backend:** TypeScript, methods in `src/methods/`, tools in `src/tools/`, services in `src/services/`
**HTTP routes:** `src/hooks/http-handler.ts`
**Tab system:** `ui/src/ui/app-settings.ts` (setTab function)
**Existing patterns:** Copy from `views/sessions.ts`, `views/config.ts`, `views/work.ts` for tab/view patterns

---

## PHASE 1: MCP Memory Server (Portable Memory)

**Goal:** Expose GodMode's unified memory (Honcho + QMD + FTS5) via MCP so external AI clients (Claude Desktop, Cursor, etc.) can search and write to the same brain.

### Task 1.1: Add memory_search to MCP server

**File:** `mcp-entry.ts`

Add to the `toolImports` array:
```typescript
() => import("./src/tools/memory-search-shim.js").then(m => m.createMemorySearchShimTool),
```

The tool factory already exists at `src/tools/memory-search-shim.ts`. It fans out to:
1. Honcho (queryPeer) — conversational memory
2. QMD (runQmdSearch) — vault full-text search
3. FTS5 (searchMessages) — session history

No changes needed to the shim itself.

### Task 1.2: Add memory_get to MCP server

**File:** `mcp-entry.ts`

Create a new tool factory at `src/tools/memory-get-mcp.ts`:
```typescript
/**
 * memory-get-mcp.ts — MCP-compatible memory_get tool.
 *
 * Reads specific memory files by path. Scoped to GODMODE_ROOT/memory/ 
 * and vault paths only (never arbitrary filesystem).
 */
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import { jsonResult } from "../lib/sdk-helpers.js";
import { isAllowedPath } from "../lib/vault-paths.js";

export function createMemoryGetMcpTool(): AnyAgentTool {
  return {
    label: "Memory Get",
    name: "memory_get",
    description: "Read a specific memory file by path. Supports memory/*.md and vault files.",
    parameters: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path within memory/ or vault (e.g. 'daily/2026-03-23.md', 'people/thomas.md')" },
        from: { type: "number", description: "Start line (1-indexed)" },
        lines: { type: "number", description: "Max lines to return" },
      },
      required: ["path"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const relPath = String(params.path ?? "");
      const fullPath = resolve(MEMORY_DIR, relPath);
      
      // Security: must be within allowed paths
      if (!isAllowedPath(fullPath)) {
        return jsonResult({ error: "Path outside allowed roots" });
      }
      if (!existsSync(fullPath)) {
        return jsonResult({ text: "", path: relPath });
      }
      
      let text = readFileSync(fullPath, "utf8");
      const fromLine = Number(params.from) || 1;
      const maxLines = Number(params.lines) || 0;
      
      if (fromLine > 1 || maxLines > 0) {
        const lines = text.split("\n");
        const start = Math.max(0, fromLine - 1);
        const end = maxLines > 0 ? start + maxLines : lines.length;
        text = lines.slice(start, end).join("\n");
      }
      
      return jsonResult({ text, path: relPath });
    },
  };
}
```

Add to `mcp-entry.ts`:
```typescript
() => import("./src/tools/memory-get-mcp.js").then(m => m.createMemoryGetMcpTool),
```

### Task 1.3: Create capture_thought tool

**New file:** `src/tools/capture-thought.ts`

```typescript
/**
 * capture-thought.ts — Write a thought/fact to memory.
 *
 * Writes to today's daily note AND forwards to Honcho for reasoning.
 * Used by external MCP clients to capture information into the brain.
 */
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { jsonResult } from "../lib/sdk-helpers.js";

function todayString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: process.env.TZ || "America/Chicago" });
}

export function createCaptureThoughtTool(): AnyAgentTool {
  return {
    label: "Capture Thought",
    name: "capture_thought",
    description: "Write a thought, fact, or note to memory. Saved to today's daily note and processed by the reasoning engine.",
    parameters: {
      type: "object" as const,
      properties: {
        thought: { type: "string", description: "The thought, fact, or note to capture" },
        category: { type: "string", description: "Optional: 'person', 'company', 'decision', 'idea', 'meeting'. Defaults to general." },
        entity: { type: "string", description: "Optional: person or company name if category is 'person' or 'company'" },
      },
      required: ["thought"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const thought = String(params.thought ?? "").trim();
      if (!thought) return jsonResult({ error: "thought is required" });
      
      const category = String(params.category ?? "general");
      const entity = String(params.entity ?? "").trim();
      const today = todayString();
      const timestamp = new Date().toLocaleTimeString("en-US", { 
        timeZone: process.env.TZ || "America/Chicago",
        hour: "2-digit", minute: "2-digit" 
      });
      
      // 1. Append to daily note
      const dailyDir = join(MEMORY_DIR, "daily");
      if (!existsSync(dailyDir)) mkdirSync(dailyDir, { recursive: true });
      const dailyPath = join(dailyDir, `${today}.md`);
      
      if (!existsSync(dailyPath)) {
        appendFileSync(dailyPath, `# Memory — ${today}\n\n`);
      }
      
      const entry = `\n- [${timestamp}] [${category}] ${thought}\n`;
      appendFileSync(dailyPath, entry);
      
      // 2. If person/company, also update their file
      if (entity && (category === "person" || category === "company")) {
        const subdir = category === "person" ? "people" : "bank/companies";
        const entityDir = join(MEMORY_DIR, subdir);
        if (!existsSync(entityDir)) mkdirSync(entityDir, { recursive: true });
        const safeName = entity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const entityPath = join(entityDir, `${safeName}.md`);
        
        if (!existsSync(entityPath)) {
          appendFileSync(entityPath, `# ${entity}\n\n## Notes\n`);
        }
        appendFileSync(entityPath, `\n- [${today}] ${thought}\n`);
      }
      
      // 3. Forward to Honcho for reasoning (best-effort)
      try {
        const { forwardToHoncho } = await import("../services/honcho-client.js");
        await forwardToHoncho(`[Captured thought - ${category}] ${thought}`, `mcp:capture`);
      } catch { /* non-fatal */ }
      
      return jsonResult({ 
        status: "captured",
        dailyNote: `daily/${today}.md`,
        ...(entity ? { entityFile: `${category === "person" ? "people" : "bank/companies"}/${entity.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md` } : {}),
      });
    },
  };
}
```

Add to `mcp-entry.ts`:
```typescript
() => import("./src/tools/capture-thought.js").then(m => m.createCaptureThoughtTool),
```

### Task 1.4: Add forwardToHoncho to honcho-client.ts

**File:** `src/services/honcho-client.ts`

Add this exported function (after existing exports):
```typescript
/**
 * Forward an arbitrary message to Honcho for processing by the Deriver.
 * Used by ingestion pipelines and MCP capture to feed data into the reasoning engine.
 */
export async function forwardToHoncho(content: string, sessionKey: string): Promise<void> {
  if (!honcho || !peer) return;
  const session = await getOrCreateSession(sessionKey);
  if (!session) return;
  
  await session.messages.create({
    role: "user",
    content,
  });
}
```

**Note:** Check if `getOrCreateSession` and the message creation API match the current @honcho-ai/sdk@2.0.1 interface. The existing code in honcho-client.ts should show the pattern.

### Task 1.5: SSE/HTTP transport for MCP (network-accessible)

The current `mcp-entry.ts` uses stdio transport (for Hermes local pipe). For network access, add an HTTP/SSE transport option.

**File:** `src/adapter/hermes/mcp-server.ts`

Check if `GodModeMcpServer` already supports SSE transport. If not, add a `startHttp(port: number)` method using the MCP SDK's SSE transport. The MCP spec supports both stdio and SSE.

**New file:** `mcp-http-entry.ts` (root level, alongside mcp-entry.ts):
```typescript
#!/usr/bin/env node
/**
 * mcp-http-entry.ts — HTTP/SSE MCP server for network-accessible memory.
 *
 * Run: node dist/mcp-http-entry.js --port 9091
 * Then configure Claude Desktop / Cursor to connect via SSE.
 */
// Same tool registration as mcp-entry.ts but use SSE transport
// Port configurable via --port flag or MCP_PORT env var
// Auth via Bearer token (MCP_AUTH_TOKEN env var)
```

Register this as a npm bin entry in package.json or document manual startup.

---

## PHASE 2: Ingestion Pipelines (Auto-Enriching Memory)

**Goal:** Automatically ingest emails, calendar events, Fathom calls, Google Drive docs, and ClickUp tasks into the memory system. All pipelines write markdown → QMD auto-indexes → Honcho processes.

### Task 2.1: Calendar Enrichment Pipeline

**New file:** `src/services/ingestion/calendar-enrichment.ts`

```typescript
/**
 * calendar-enrichment.ts — Hourly cron that enriches memory from calendar.
 *
 * For each upcoming meeting (next 24h):
 * 1. Check if attendee people files exist
 * 2. Create stubs for new contacts
 * 3. Append meeting context to existing people files
 * 4. Write meeting summary to daily note
 *
 * For each past meeting (last 24h):
 * 1. Log "met with X, Y on DATE" to daily note
 * 2. Update people files with last-interaction date
 *
 * Uses: gog CLI (already configured at user@example.com)
 * Schedule: hourly via OC cron
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR } from "../../data-paths.js";

const exec = promisify(execFile);

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export async function runCalendarEnrichment(): Promise<{ eventsProcessed: number; peopleUpdated: number }> {
  // 1. Fetch events via gog CLI (JSON output)
  const account = process.env.GOG_CALENDAR_ACCOUNT || "user@example.com";
  const client = process.env.GOG_CLIENT || "godmode";
  
  const { stdout } = await exec("gog", [
    "calendar", "events",
    "--account", account,
    "--client", client,
    "--json",
    "--days", "2", // today + tomorrow
  ]);
  
  const events: CalendarEvent[] = JSON.parse(stdout);
  let peopleUpdated = 0;
  
  const today = new Date().toLocaleDateString("en-CA", { timeZone: process.env.TZ || "America/Chicago" });
  const dailyDir = join(MEMORY_DIR, "daily");
  const peopleDir = join(MEMORY_DIR, "people");
  if (!existsSync(dailyDir)) mkdirSync(dailyDir, { recursive: true });
  if (!existsSync(peopleDir)) mkdirSync(peopleDir, { recursive: true });
  
  for (const event of events) {
    if (!event.attendees?.length) continue;
    
    for (const attendee of event.attendees) {
      if (!attendee.email) continue;
      // Skip the owner's own email
      if (attendee.email === account) continue;
      
      const name = attendee.displayName || attendee.email.split("@")[0];
      const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const peoplePath = join(peopleDir, `${safeName}.md`);
      
      if (!existsSync(peoplePath)) {
        // Create new people stub
        writeFileSync(peoplePath, [
          `# ${name}`,
          ``,
          `- **Email:** ${attendee.email}`,
          `- **First seen:** ${today} (calendar)`,
          ``,
          `## Interactions`,
          `- [${today}] Meeting: ${event.summary}`,
          ``,
        ].join("\n"));
        peopleUpdated++;
      } else {
        // Append interaction
        appendFileSync(peoplePath, `\n- [${today}] Meeting: ${event.summary}\n`);
        peopleUpdated++;
      }
    }
  }
  
  // Forward summary to Honcho
  try {
    const { forwardToHoncho } = await import("../honcho-client.js");
    await forwardToHoncho(
      `[Calendar enrichment] Processed ${events.length} events, updated ${peopleUpdated} people files`,
      "system:calendar-enrichment"
    );
  } catch { /* non-fatal */ }
  
  return { eventsProcessed: events.length, peopleUpdated };
}
```

**Register as an OC cron job** — add to `src/hooks/gateway-start.ts` or document the cron setup:
```
Schedule: every 60 minutes
Payload: agentTurn with message "Run calendar enrichment pipeline"
```

Or better: expose as an HTTP endpoint in `http-handler.ts` and call from OC cron:
```
POST /godmode/ingestion/calendar
```

### Task 2.2: Email Digest Pipeline (Front)

**New file:** `src/services/ingestion/email-digest.ts`

```typescript
/**
 * email-digest.ts — Nightly digest of email activity from Front.
 *
 * Pulls today's conversations from Front API:
 * 1. Extracts contacts → creates/updates people files
 * 2. Summarizes key threads → appends to daily note
 * 3. Flags action items → creates tasks (optional)
 *
 * Uses: FRONT_API_TOKEN env var, Front REST API
 * Schedule: nightly 10pm via OC cron
 */

import { MEMORY_DIR } from "../../data-paths.js";
// ... (follows same pattern as calendar-enrichment)

const FRONT_API = "https://api2.frontapp.com";

interface FrontConversation {
  id: string;
  subject: string;
  status: string;
  recipient: { handle: string; name?: string };
  last_message: { created_at: number; body: string };
}

export async function runEmailDigest(): Promise<{ threadsProcessed: number; contactsUpdated: number }> {
  const token = process.env.FRONT_API_TOKEN;
  if (!token) return { threadsProcessed: 0, contactsUpdated: 0 };
  
  // Fetch today's conversations
  const since = Math.floor(Date.now() / 1000) - 86400; // last 24h
  const res = await fetch(`${FRONT_API}/conversations?q[updated_after]=${since}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) return { threadsProcessed: 0, contactsUpdated: 0 };
  const data = await res.json();
  const conversations: FrontConversation[] = data._results || [];
  
  // Process each conversation — extract contacts, summarize threads
  // Write to daily note + people files (same pattern as calendar)
  // ... implementation follows calendar-enrichment pattern
  
  return { threadsProcessed: conversations.length, contactsUpdated: 0 };
}
```

### Task 2.3: Fathom Call Pipeline

**New file:** `src/services/ingestion/fathom-calls.ts`

```typescript
/**
 * fathom-calls.ts — Webhook handler for Fathom call recordings.
 *
 * When a call ends, Fathom POSTs transcript + action items.
 * Pipeline:
 * 1. Extract attendees → create/update people files
 * 2. Extract action items → create tasks
 * 3. Write call summary to daily note
 * 4. Forward full transcript to Honcho for reasoning
 *
 * Uses: FATHOM_API_KEY env var, Fathom REST API
 * Trigger: webhook POST to /godmode/webhook/fathom OR nightly poll
 */

// Can also run as a cron that polls Fathom API for recent calls:
// GET https://api.fathom.video/v1/calls?after={timestamp}
// Headers: X-Api-Key: $FATHOM_API_KEY (NOT Bearer!)
```

### Task 2.4: Google Drive Sync Pipeline

**New file:** `src/services/ingestion/drive-sync.ts`

```typescript
/**
 * drive-sync.ts — Periodic sync of Google Drive documents into memory.
 *
 * Monitors configured Drive folders for new/updated files.
 * Downloads and indexes them into the vault.
 *
 * Uses: gog CLI (gog drive ls, gog drive download, gog drive search)
 * Account: user@example.com, client: godmode
 * Schedule: every 6 hours via OC cron
 *
 * gog drive commands available:
 *   gog drive ls --account X --client godmode --json --limit N
 *   gog drive search "query" --account X --client godmode --json
 *   gog drive download <fileId> --account X --client godmode
 *
 * Google Docs/Sheets are exported as markdown/CSV on download.
 * Store downloaded files in memory/ingested/drive/ with metadata.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR } from "../../data-paths.js";

const exec = promisify(execFile);

interface DriveFile {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
}

export async function runDriveSync(folderIds?: string[]): Promise<{ filesProcessed: number }> {
  const account = process.env.GOG_CALENDAR_ACCOUNT || "user@example.com";
  const client = process.env.GOG_CLIENT || "godmode";
  const ingestDir = join(MEMORY_DIR, "ingested", "drive");
  if (!existsSync(ingestDir)) mkdirSync(ingestDir, { recursive: true });
  
  // List recent files (modified in last 24h)
  const { stdout } = await exec("gog", [
    "drive", "ls",
    "--account", account,
    "--client", client,
    "--json",
    "--limit", "20",
  ]);
  
  const files: DriveFile[] = JSON.parse(stdout);
  let processed = 0;
  
  for (const file of files) {
    // Download each file — gog exports Google Docs as markdown
    try {
      const { stdout: content } = await exec("gog", [
        "drive", "download", file.id,
        "--account", account,
        "--client", client,
      ]);
      
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      writeFileSync(join(ingestDir, `${safeName}.md`), content);
      processed++;
    } catch { /* skip files that fail */ }
  }
  
  return { filesProcessed: processed };
}
```

### Task 2.5: ClickUp Sync Pipeline

**New file:** `src/services/ingestion/clickup-sync.ts`

```typescript
/**
 * clickup-sync.ts — Sync ClickUp tasks and updates into memory.
 *
 * Pulls tasks assigned to the user, recently updated tasks, and 
 * completed tasks. Writes summaries to daily notes.
 *
 * Uses: CLICKUP_API_TOKEN env var (personal token, starts with pk_)
 * API: https://api.clickup.com/api/v2/
 * Schedule: every 2 hours via OC cron
 *
 * Setup: User needs to provide their ClickUp personal API token
 * and the workspace/space IDs they want to sync.
 * Set in .env: CLICKUP_API_TOKEN=pk_xxx
 *              CLICKUP_TEAM_ID=xxx (workspace ID)
 */

const CLICKUP_API = "https://api.clickup.com/api/v2";

export async function runClickUpSync(): Promise<{ tasksProcessed: number }> {
  const token = process.env.CLICKUP_API_TOKEN;
  const teamId = process.env.CLICKUP_TEAM_ID;
  if (!token || !teamId) return { tasksProcessed: 0 };
  
  // Fetch tasks assigned to me, updated in last 24h
  const since = Date.now() - 86400_000;
  const res = await fetch(
    `${CLICKUP_API}/team/${teamId}/task?` + new URLSearchParams({
      order_by: "updated",
      date_updated_gt: String(since),
      include_closed: "true",
      subtasks: "true",
    }),
    { headers: { Authorization: token } }
  );
  
  if (!res.ok) return { tasksProcessed: 0 };
  const data = await res.json();
  
  // Write task updates to daily note
  // ... follows same markdown-writing pattern
  
  return { tasksProcessed: data.tasks?.length ?? 0 };
}
```

### Task 2.6: Unified Ingestion Runner

**New file:** `src/services/ingestion/runner.ts`

```typescript
/**
 * runner.ts — Unified ingestion pipeline runner.
 *
 * Called by cron or HTTP endpoint. Runs all configured pipelines.
 * Reports results to health ledger.
 */

import { runCalendarEnrichment } from "./calendar-enrichment.js";
import { runEmailDigest } from "./email-digest.js";
import { runDriveSync } from "./drive-sync.js";
import { runClickUpSync } from "./clickup-sync.js";

export type IngestionResult = {
  pipeline: string;
  status: "ok" | "skipped" | "error";
  details: Record<string, unknown>;
  durationMs: number;
};

export async function runAllIngestion(): Promise<IngestionResult[]> {
  const results: IngestionResult[] = [];
  
  const pipelines = [
    { name: "calendar", fn: runCalendarEnrichment, env: "GOG_CALENDAR_ACCOUNT" },
    { name: "email", fn: runEmailDigest, env: "FRONT_API_TOKEN" },
    { name: "drive", fn: runDriveSync, env: "GOG_CALENDAR_ACCOUNT" },
    { name: "clickup", fn: runClickUpSync, env: "CLICKUP_API_TOKEN" },
  ];
  
  for (const p of pipelines) {
    if (!process.env[p.env]) {
      results.push({ pipeline: p.name, status: "skipped", details: { reason: `${p.env} not set` }, durationMs: 0 });
      continue;
    }
    
    const start = Date.now();
    try {
      const details = await p.fn();
      results.push({ pipeline: p.name, status: "ok", details, durationMs: Date.now() - start });
    } catch (err) {
      results.push({ pipeline: p.name, status: "error", details: { error: String(err) }, durationMs: Date.now() - start });
    }
  }
  
  return results;
}

/**
 * Get ingestion status for the UI dashboard.
 */
export function getIngestionStatus(): Array<{ name: string; configured: boolean; envVar: string }> {
  return [
    { name: "Calendar", configured: !!process.env.GOG_CALENDAR_ACCOUNT, envVar: "GOG_CALENDAR_ACCOUNT" },
    { name: "Email (Front)", configured: !!process.env.FRONT_API_TOKEN, envVar: "FRONT_API_TOKEN" },
    { name: "Fathom", configured: !!process.env.FATHOM_API_KEY, envVar: "FATHOM_API_KEY" },
    { name: "Google Drive", configured: !!process.env.GOG_CALENDAR_ACCOUNT, envVar: "GOG_CALENDAR_ACCOUNT" },
    { name: "ClickUp", configured: !!process.env.CLICKUP_API_TOKEN, envVar: "CLICKUP_API_TOKEN" },
    { name: "Slack", configured: !!process.env.SLACK_BOT_TOKEN, envVar: "SLACK_BOT_TOKEN" },
    { name: "iMessage", configured: false, envVar: "IMESSAGE_MONITOR" },
  ];
}
```

### Task 2.7: HTTP Endpoints for Ingestion

**File:** `src/hooks/http-handler.ts`

Add these routes (following existing pattern for /godmode/ prefix):

```typescript
// GET /godmode/ingestion/status — returns pipeline health for UI
// POST /godmode/ingestion/run — triggers all pipelines (or specific: ?pipeline=calendar)
// POST /godmode/ingestion/run/calendar — trigger specific pipeline
```

### Task 2.8: Register Ingestion Method

**New file:** `src/methods/ingestion.ts`

Export handlers following the pattern in `src/methods/integrations.ts`:
- `ingestion.status` → returns `getIngestionStatus()`
- `ingestion.run` → runs `runAllIngestion()` or specific pipeline
- `ingestion.history` → returns last N run results from health ledger

Register in `src/adapter/register-all.ts` by adding to the methodModules array:
```typescript
() => import("../methods/ingestion.js"),
```

---

## PHASE 3: Second Brain UI Tab

**Goal:** Add a "Brain" tab to the Control UI that shows People, Timeline, Knowledge, Memory Map, and Settings.

**UI framework:** Lit web components. Follow patterns from existing views.
**Data source:** All data comes from backend methods via the existing `safe-request.ts` fetch wrapper.

### Task 3.1: Backend API Endpoints

**New file:** `src/methods/brain-dashboard.ts`

Expose these methods (following pattern from `src/methods/second-brain.ts`):

```typescript
/**
 * brain-dashboard.ts — Backend for the Second Brain UI tab.
 */

// brain.overview — Memory Map data
// Returns: { identity, health, ingestion, sharing, qualityScore }
// identity: Honcho's peer representation (user identity card)
// health: { peopleCount, companyCount, dailyNoteCount, honchoStatus, qmdStatus, fts5Status }
// ingestion: getIngestionStatus() from ingestion runner
// sharing: { personalMcpUrl, teamMcpUrl, connectedClients }
// qualityScore: latest from memory-quality reports

// brain.people — List all people files
// Returns: Array<{ name, path, lastModified, lastInteraction, company, tags, snippet }>
// Source: scan memory/people/*.md + vault 06-Brain/People/*.md

// brain.person — Get single person detail
// Params: { name: string }
// Returns: { name, content (raw markdown), honchoSays (queryPeer result), interactions, sourceFiles }

// brain.timeline — Daily notes timeline
// Params: { days?: number } (default 7)
// Returns: Array<{ date, summary, ingestionLog, eventCount }>

// brain.knowledge — Vault tree browser
// Params: { path?: string }
// Returns: { entries: Array<{ name, type, path, size, modified, privacy }> }
// Privacy = "private" | "team" | "public" based on path prefix

// brain.file — Read/write a vault file
// Params: { path: string, content?: string }
// GET: returns file content. POST: writes content (with path validation).

// brain.search — Unified search (delegates to memory_search shim)
// Params: { query: string }
// Returns: same format as memory_search tool
```

Register in `register-all.ts` methodModules.

### Task 3.2: Brain Tab — Main View

**New file:** `ui/src/ui/views/brain.ts`

```typescript
/**
 * brain.ts — Second Brain tab for the Control UI.
 *
 * Sub-views: Memory Map | People | Timeline | Knowledge | Settings
 * Uses Lit html templates following patterns from views/sessions.ts
 */
import { html, nothing } from "lit";
import type { AppContext } from "../context/app-context.js";

type BrainSubView = "map" | "people" | "timeline" | "knowledge" | "settings";

export function renderBrainTab(ctx: AppContext, state: BrainTabState) {
  return html`
    <div class="brain-tab">
      <div class="brain-nav">
        <button class="${state.subView === 'map' ? 'active' : ''}" 
                @click=${() => state.setSubView('map')}>🧠 Memory Map</button>
        <button class="${state.subView === 'people' ? 'active' : ''}"
                @click=${() => state.setSubView('people')}>👤 People</button>
        <button class="${state.subView === 'timeline' ? 'active' : ''}"
                @click=${() => state.setSubView('timeline')}>📅 Timeline</button>
        <button class="${state.subView === 'knowledge' ? 'active' : ''}"
                @click=${() => state.setSubView('knowledge')}>📚 Knowledge</button>
        <button class="${state.subView === 'settings' ? 'active' : ''}"
                @click=${() => state.setSubView('settings')}>⚙️ Settings</button>
      </div>
      <div class="brain-search">
        <input type="text" placeholder="Search your brain..." 
               @keyup=${(e: KeyboardEvent) => { if (e.key === 'Enter') state.search((e.target as HTMLInputElement).value); }} />
      </div>
      <div class="brain-content">
        ${state.subView === 'map' ? renderMemoryMap(state.overview) : nothing}
        ${state.subView === 'people' ? renderPeople(state.people, state.selectedPerson) : nothing}
        ${state.subView === 'timeline' ? renderTimeline(state.timeline) : nothing}
        ${state.subView === 'knowledge' ? renderKnowledge(state.knowledge, state.currentPath) : nothing}
        ${state.subView === 'settings' ? renderSettings(state.overview) : nothing}
      </div>
    </div>
  `;
}
```

### Task 3.3: Memory Map Sub-View

Shows: Identity card (from Honcho), Memory health, Ingestion status, MCP URLs, Quality score.

```typescript
function renderMemoryMap(overview: BrainOverview | null) {
  if (!overview) return html`<div class="loading">Loading brain overview...</div>`;
  
  return html`
    <div class="memory-map">
      <!-- Identity Card -->
      <div class="card identity-card">
        <h3>Your Identity</h3>
        <p class="identity-text">${overview.identity || 'Honcho is building your identity model...'}</p>
        <button class="btn-sm" @click=${() => /* navigate to edit */}>✏️ Correct</button>
      </div>
      
      <!-- Health Grid -->
      <div class="health-grid">
        <div class="health-card">
          <span class="metric">${overview.health.peopleCount}</span>
          <span class="label">People</span>
        </div>
        <div class="health-card">
          <span class="metric">${overview.health.dailyNoteCount}</span>
          <span class="label">Days Logged</span>
        </div>
        <div class="health-card">
          <span class="status ${overview.health.honchoStatus === 'ready' ? 'ok' : 'warn'}">
            ${overview.health.honchoStatus === 'ready' ? '✅' : '⚠️'} Honcho
          </span>
          <span class="status ${overview.health.qmdStatus ? 'ok' : 'warn'}">
            ${overview.health.qmdStatus ? '✅' : '⚠️'} QMD
          </span>
        </div>
      </div>
      
      <!-- Ingestion Status -->
      <div class="card ingestion-status">
        <h3>Ingestion Pipelines</h3>
        ${overview.ingestion.map(p => html`
          <div class="pipeline-row">
            <span class="pipeline-name">${p.name}</span>
            <span class="pipeline-status ${p.configured ? 'active' : 'inactive'}">
              ${p.configured ? '✅ Active' : '❌ Not configured'}
            </span>
            ${!p.configured ? html`<button class="btn-xs">Set up →</button>` : nothing}
          </div>
        `)}
      </div>
      
      <!-- MCP Sharing -->
      <div class="card mcp-sharing">
        <h3>Memory Access (MCP)</h3>
        <div class="mcp-url">
          <label>🔒 Personal</label>
          <code>${overview.sharing.personalMcpUrl || 'Not configured'}</code>
          <button class="btn-xs" @click=${() => navigator.clipboard.writeText(overview.sharing.personalMcpUrl)}>Copy</button>
        </div>
        <div class="mcp-url">
          <label>👥 Team</label>
          <code>${overview.sharing.teamMcpUrl || 'Not configured'}</code>
        </div>
      </div>
    </div>
  `;
}
```

### Task 3.4: People Sub-View

List view + detail panel. Inline markdown editor for people files.

### Task 3.5: Timeline Sub-View

Chronological daily notes with ingestion activity badges.

### Task 3.6: Knowledge Sub-View

PARA folder tree browser with file viewer/editor. Privacy badges on each item.

### Task 3.7: Settings Sub-View

MCP management, privacy scopes, ingestion pipeline configuration, team management.

### Task 3.8: Register the Brain Tab

**File:** `ui/src/ui/app-settings.ts`

Add `"brain"` to the Tab type and handle it in `setTab()`:
```typescript
if (host.tab === "brain") {
  // Fetch brain overview data
  // Similar to how "overview" or "sessions" tabs load their data
}
```

**File:** `ui/src/ui/app-render.ts`

Add the brain tab to the tab bar and render the brain view when active:
```typescript
case "brain":
  return renderBrainTab(ctx, brainState);
```

### Task 3.9: Styles

Add CSS for the brain tab. Follow existing patterns in the UI. Use CSS custom properties for theming (dark/light mode).

Key classes needed:
- `.brain-tab`, `.brain-nav`, `.brain-search`, `.brain-content`
- `.card`, `.identity-card`, `.health-grid`, `.health-card`
- `.pipeline-row`, `.mcp-url`
- `.people-list`, `.person-card`, `.person-detail`
- `.timeline-entry`, `.ingestion-badge`
- `.knowledge-tree`, `.file-viewer`, `.privacy-badge`

---

## PHASE 4: Integration Configs (Settings)

### Task 4.1: ClickUp Integration Setup

Add to `src/lib/integration-registry.ts` (check existing pattern):
```typescript
{
  id: "clickup",
  name: "ClickUp",
  envVars: ["CLICKUP_API_TOKEN", "CLICKUP_TEAM_ID"],
  testFn: async () => {
    // GET https://api.clickup.com/api/v2/team with Authorization header
    // Returns 200 if token is valid
  },
  setupGuide: "Get your personal API token from ClickUp Settings → Apps → Generate API Token (starts with pk_). Find your Team ID in ClickUp URL.",
}
```

### Task 4.2: Google Drive Integration (Already Working)

Already configured via `gog` CLI. Just needs the ingestion pipeline (Task 2.4).

Document in Settings UI: "Google Drive connected via gog CLI (user@example.com)"

---

## Build Order (Priority)

1. **Phase 1** (MCP Memory Server) — ~4 hours. Unblocks portable memory. Do first.
2. **Phase 2, Tasks 2.1-2.2** (Calendar + Email ingestion) — ~4 hours. Highest-value data sources.
3. **Phase 3, Task 3.1 + 3.2 + 3.3** (Backend API + Memory Map view) — ~6 hours. Answers "what does my AI know?"
4. **Phase 2, Tasks 2.3-2.5** (Fathom + Drive + ClickUp) — ~4 hours. Additional data sources.
5. **Phase 3, Tasks 3.4-3.9** (Full Brain UI) — ~8 hours. Complete Second Brain experience.

**Total estimate: ~26 hours of focused coding.**

---

## Key Files Reference

| What | Path |
|------|------|
| MCP entry point | `mcp-entry.ts` |
| MCP server class | `src/adapter/hermes/mcp-server.ts` |
| Memory search shim | `src/tools/memory-search-shim.ts` |
| Honcho client | `src/services/honcho-client.ts` |
| Honcho sync | `src/services/honcho-sync.ts` |
| Memory facade | `src/lib/memory.ts` |
| Identity graph | `src/lib/identity-graph.ts` |
| Second brain methods | `src/methods/second-brain.ts` |
| Vault paths | `src/lib/vault-paths.ts` |
| Data paths | `src/data-paths.ts` |
| HTTP routes | `src/hooks/http-handler.ts` |
| Tool registration | `src/adapter/register-all.ts` |
| UI app | `ui/src/ui/app.ts` |
| UI tab system | `ui/src/ui/app-settings.ts` |
| UI renderer | `ui/src/ui/app-render.ts` |
| UI views dir | `ui/src/ui/views/` |
| Existing view examples | `views/sessions.ts`, `views/config.ts`, `views/work.ts` |
| SDK helpers | `src/lib/sdk-helpers.ts` |
| Health ledger | `src/lib/health-ledger.ts` |
| Integration registry | `src/lib/integration-registry.ts` |

## Dependencies (Already Installed)

- `@honcho-ai/sdk` ^2.0.1 — Honcho client
- `better-sqlite3` ^11.8.1 — identity graph DB
- `lit` — UI framework
- `openclaw/plugin-sdk` — tool/plugin API

## Dependencies to Add

- None required. All ingestion uses `fetch()` (native) and `gog` CLI (already installed).
- ClickUp API uses native `fetch()` with personal token auth.
- Google Drive uses `gog drive` CLI commands.

---

## Environment Variables Needed

| Variable | Purpose | Status |
|----------|---------|--------|
| `HONCHO_API_KEY` | Honcho memory | ✅ Configured |
| `FRONT_API_TOKEN` | Email ingestion | ✅ Configured |
| `FATHOM_API_KEY` | Call ingestion | ✅ Configured |
| `GOG_CALENDAR_ACCOUNT` | Calendar + Drive | ✅ Configured |
| `CLICKUP_API_TOKEN` | ClickUp ingestion | ❌ Need from user |
| `CLICKUP_TEAM_ID` | ClickUp workspace | ❌ Need from user |
| `MCP_AUTH_TOKEN` | MCP server auth | ❌ Generate on setup |
| `MCP_PORT` | MCP HTTP port | Default: 9091 |

---

## Testing

Each phase should be testable independently:
- **Phase 1:** `node dist/mcp-entry.js` → connect Claude Desktop → test `memory_search`, `memory_get`, `capture_thought`
- **Phase 2:** `curl POST /godmode/ingestion/run` → check daily notes for new content
- **Phase 3:** Open Control UI → Brain tab → verify all sub-views render data
