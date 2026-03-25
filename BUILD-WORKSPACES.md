# BUILD PLAN: Workspaces (Team Connected Toolbox + Activity Feed)

**Repo:** `~/Projects/godmode-plugin/`
**UI framework:** Lit (web components)
**Backend methods:** `src/methods/` (RPC via `GatewayRequestHandler`)
**Frontend tabs:** `ui/src/ui/tabs/`
**Existing backend:** `src/methods/workspaces.ts`, `src/methods/team-workspace.ts`
**Existing frontend:** `ui/src/ui/tabs/work-tab.ts` (current workspaces tab)
**Existing config:** `src/lib/workspaces-config.ts`, `src/lib/team-workspace-scaffold.ts`

---

## CONTEXT: What Already Exists

### Workspace Config (`src/lib/workspaces-config.ts`)
- `WorkspaceConfigEntry` type with: id, name, emoji, type (personal/project/team), path, keywords, pinned, pinnedSessions, artifactDirs, sync (git), team (github, role), curation
- `WorkspaceConfigFile` stores array of workspaces in `workspaces.json5`
- Functions: `readWorkspaceConfig`, `writeWorkspaceConfig`, `findWorkspaceById`, `createWorkspaceId`, `ensureWorkspaceFolders`, `detectWorkspaceFromText`

### Team Workspace Scaffold (`src/lib/team-workspace-scaffold.ts`)
- `scaffoldTeamWorkspace` — creates folder structure + metadata.json + members list
- `addMemberToWorkspace` — adds member entry to metadata
- `resolveGitMemberId` — derives member ID from git config
- Folder structure: `outputs/`, `sops/`, `playbooks/`, `decisions/`, `resources/`

### Team Workspace RPC (`src/methods/team-workspace.ts`)
- `team.create` — scaffolds workspace (local init or git clone from GitHub)
- `team.addMember` — adds member to workspace
- `team.sync` — git pull/push for workspace
- `team.list` — lists team workspaces
- `team.status` — workspace health/sync status
- Git operations: clone, init, add/commit/push

### Workspaces RPC (`src/methods/workspaces.ts`)
- `workspaces.list` — lists all workspaces with stats
- `workspaces.get` — gets single workspace detail
- `workspaces.create` / `workspaces.update` / `workspaces.delete`
- `workspaces.readFile` / `workspaces.writeFile`
- `workspaces.sections` — lists workspace sections (pinned files, sessions, artifacts, SOPs, etc.)
- `workspaces.search` — searches within a workspace
- File browsing, session management, artifact scanning

### Current UI (`ui/src/ui/tabs/work-tab.ts`)
This is the existing workspaces tab but it's mostly a file/session manager. It needs to be evolved into the new workspace vision: connected tools + activity feed.

### Team Tab (`ui/src/ui/tabs/team-tab.ts`)
Currently just an iframe to the Paperclip dashboard. This is for the AGENT team (Paperclip). Separate from human team workspaces.

### Navigation
Tab ID: `"workspaces"`. Path: `/workspaces`. Already in `TAB_GROUPS`.
Tab ID: `"team"`. Path: `/team`. Already in `TAB_GROUPS` (agent team / Paperclip).

---

## THE NEW ARCHITECTURE

### Core Principle
**Workspaces don't have memory. They have connections.**

A workspace is:
1. **API connections** to shared tools (Google Drive, ClickUp, CRM, etc.)
2. **An activity feed** where agents and humans post updates
3. **A docs folder** with SOPs, playbooks, and decisions (markdown)
4. **Git-backed** for sync and history

A workspace is NOT:
- A filtered copy of anyone's personal brain
- An ingestion pipeline target
- A Honcho instance
- A place where email/calendar/screen data routes to

### Privacy Model
**Nothing personal enters a workspace. Ever.** Workspaces read shared tools (Drive, ClickUp, CRM) that the team already has access to. Personal brain data (email, screen captures, personal Honcho observations) is structurally disconnected — the wires don't exist.

### Data Flow
```
Shared Google Drive ──┐
Shared ClickUp ───────┤──→ Workspace Agent reads live
Company CRM ──────────┘
                          
Human posts to feed ──┐
Agent posts to feed ──┤──→ Activity Feed (feed.jsonl, append-only)
                      │
SOPs / Playbooks ─────┘──→ Docs folder (markdown, QMD-indexed)
```

---

## WHAT TO BUILD

### New: Workspace Connections System

Allow workspaces to have API connections to shared team tools. The workspace agent queries these tools directly — no personal data involved.

### New: Activity Feed

An append-only log where humans and agents post updates. This is how agents communicate within a workspace. It replaces complex shared memory with a simple feed.

### New: Workspace Setup Wizard

Dead-simple setup: name your workspace → connect shared tools → invite members → done. Under 5 minutes.

---

## Phase 1: Connections Config + Backend (5 hours)

### 1.1 Workspace Connections Schema

**File: `src/lib/workspaces-config.ts`** — extend `WorkspaceConfigEntry`:

```typescript
export type WorkspaceConnection = {
  id: string;                          // "google-drive", "clickup", "hubspot", etc.
  type: "google-drive" | "clickup" | "hubspot" | "ghl" | "slack" | "notion" | "custom-api";
  name: string;                        // Display name: "TRP Shared Drive"
  status: "connected" | "error" | "unconfigured";
  config: Record<string, string>;      // Type-specific config (folderId, teamId, apiKey, etc.)
  lastSync?: string;                   // ISO timestamp of last successful query
  error?: string;                      // Last error message if status is "error"
};

// Add to WorkspaceConfigEntry:
export type WorkspaceConfigEntry = {
  // ... existing fields ...
  connections: WorkspaceConnection[];   // NEW — shared tool connections
};
```

**IMPORTANT:** Connection secrets (API keys, tokens) should NOT be stored in `workspaces.json5` (which may be git-synced). Store them in a separate file:

**New file: `src/lib/workspace-secrets.ts`**

```typescript
/**
 * workspace-secrets.ts — Encrypted storage for workspace connection secrets.
 * 
 * Secrets are stored in ~/.openclaw/workspace-secrets.json (never in the workspace repo).
 * Each workspace has its own secret namespace.
 * Uses OpenClaw's /secrets infrastructure if available, falls back to plain JSON.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SECRETS_PATH = join(homedir(), ".openclaw", "workspace-secrets.json");

type SecretStore = Record<string, Record<string, string>>;
// Structure: { [workspaceId]: { [connectionId]: secretValue } }

export function getWorkspaceSecret(workspaceId: string, connectionId: string): string | null {
  const store = loadStore();
  return store[workspaceId]?.[connectionId] ?? null;
}

export function setWorkspaceSecret(workspaceId: string, connectionId: string, value: string): void {
  const store = loadStore();
  if (!store[workspaceId]) store[workspaceId] = {};
  store[workspaceId][connectionId] = value;
  saveStore(store);
}

export function deleteWorkspaceSecret(workspaceId: string, connectionId: string): void {
  const store = loadStore();
  if (store[workspaceId]) {
    delete store[workspaceId][connectionId];
    if (Object.keys(store[workspaceId]).length === 0) delete store[workspaceId];
  }
  saveStore(store);
}

function loadStore(): SecretStore {
  try {
    if (existsSync(SECRETS_PATH)) {
      return JSON.parse(readFileSync(SECRETS_PATH, "utf8"));
    }
  } catch { /* corrupt file, start fresh */ }
  return {};
}

function saveStore(store: SecretStore): void {
  const dir = join(homedir(), ".openclaw");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(SECRETS_PATH, JSON.stringify(store, null, 2), { mode: 0o600 });
}
```

### 1.2 Connection Connectors

**New directory: `src/services/workspace-connectors/`**

Each connector queries a shared tool on behalf of the workspace. Connectors do NOT ingest data — they query live.

**File: `src/services/workspace-connectors/types.ts`**

```typescript
export interface WorkspaceConnector {
  type: string;
  
  /** Test if the connection is working (API key valid, service reachable). */
  testConnection(config: Record<string, string>, secret: string): Promise<{
    ok: boolean;
    error?: string;
    meta?: Record<string, unknown>; // e.g., { folderName: "TRP Shared", fileCount: 42 }
  }>;
  
  /** Search within the connected tool. */
  search(query: string, config: Record<string, string>, secret: string): Promise<{
    results: Array<{
      title: string;
      excerpt: string;
      url?: string;
      type: string; // "file", "task", "contact", "deal", etc.
      updatedAt?: string;
    }>;
  }>;
  
  /** Get a summary of recent activity from the tool. */
  recentActivity(config: Record<string, string>, secret: string, limit?: number): Promise<{
    items: Array<{
      title: string;
      detail: string;
      timestamp: string;
      type: string;
      url?: string;
    }>;
  }>;
}
```

**File: `src/services/workspace-connectors/google-drive.ts`**

```typescript
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { WorkspaceConnector } from "./types.js";

const exec = promisify(execFile);

/**
 * Google Drive connector using the `gog` CLI (already installed and configured).
 * 
 * Config: { folderId: string, account: string }
 * Secret: not needed — gog uses OAuth stored in its own config
 */
export const googleDriveConnector: WorkspaceConnector = {
  type: "google-drive",
  
  async testConnection(config) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "ls",
        "--folder-id", config.folderId,
        "--account", config.account || "user@example.com",
        "--client", "godmode",
        "--limit", "1",
      ], { maxBuffer: 1024 * 1024 });
      return { ok: true, meta: { response: stdout.trim().slice(0, 100) } };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
  
  async search(query, config) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "search",
        "--query", query,
        "--folder-id", config.folderId,
        "--account", config.account || "user@example.com",
        "--client", "godmode",
        "--limit", "10",
      ], { maxBuffer: 5 * 1024 * 1024 });
      // Parse gog output into results
      const files = JSON.parse(stdout);
      return {
        results: files.map((f: any) => ({
          title: f.name,
          excerpt: f.mimeType || "",
          url: f.webViewLink,
          type: "file",
          updatedAt: f.modifiedTime,
        })),
      };
    } catch {
      return { results: [] };
    }
  },
  
  async recentActivity(config, _secret, limit = 10) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "ls",
        "--folder-id", config.folderId,
        "--account", config.account || "user@example.com",
        "--client", "godmode",
        "--limit", String(limit),
        "--order-by", "modifiedTime desc",
      ], { maxBuffer: 5 * 1024 * 1024 });
      const files = JSON.parse(stdout);
      return {
        items: files.map((f: any) => ({
          title: f.name,
          detail: `Modified by ${f.lastModifyingUser?.displayName ?? "unknown"}`,
          timestamp: f.modifiedTime,
          type: "file",
          url: f.webViewLink,
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
```

**File: `src/services/workspace-connectors/clickup.ts`**

```typescript
import type { WorkspaceConnector } from "./types.js";

/**
 * ClickUp connector using REST API.
 * 
 * Config: { teamId: string, spaces: string[] (space IDs) }
 * Secret: Personal API token (pk_xxx)
 */
export const clickupConnector: WorkspaceConnector = {
  type: "clickup",
  
  async testConnection(config, secret) {
    try {
      const res = await fetch(`https://api.clickup.com/api/v2/team/${config.teamId}`, {
        headers: { "Authorization": secret },
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      return { ok: true, meta: { teamName: data.team?.name } };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
  
  async search(query, config, secret) {
    try {
      const res = await fetch(
        `https://api.clickup.com/api/v2/team/${config.teamId}/task?` +
        new URLSearchParams({
          custom_task_ids: "false",
          include_closed: "false",
          // ClickUp search is via separate endpoint
        }),
        { headers: { "Authorization": secret } },
      );
      if (!res.ok) return { results: [] };
      const data = await res.json();
      return {
        results: (data.tasks ?? [])
          .filter((t: any) => t.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10)
          .map((t: any) => ({
            title: t.name,
            excerpt: `${t.status?.status ?? ""} — ${t.list?.name ?? ""}`,
            url: t.url,
            type: "task",
            updatedAt: t.date_updated ? new Date(Number(t.date_updated)).toISOString() : undefined,
          })),
      };
    } catch {
      return { results: [] };
    }
  },
  
  async recentActivity(config, secret, limit = 10) {
    try {
      const res = await fetch(
        `https://api.clickup.com/api/v2/team/${config.teamId}/task?` +
        new URLSearchParams({
          order_by: "updated",
          reverse: "true",
          subtasks: "true",
          include_closed: "false",
          page: "0",
        }),
        { headers: { "Authorization": secret } },
      );
      if (!res.ok) return { items: [] };
      const data = await res.json();
      return {
        items: (data.tasks ?? []).slice(0, limit).map((t: any) => ({
          title: t.name,
          detail: `${t.status?.status ?? "unknown"} in ${t.list?.name ?? "unknown list"}`,
          timestamp: t.date_updated ? new Date(Number(t.date_updated)).toISOString() : new Date().toISOString(),
          type: "task",
          url: t.url,
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
```

**File: `src/services/workspace-connectors/hubspot.ts`**

```typescript
import type { WorkspaceConnector } from "./types.js";

/**
 * HubSpot connector using REST API v3.
 * 
 * Config: { portalId: string }
 * Secret: Private app access token (pat-xxx)
 */
export const hubspotConnector: WorkspaceConnector = {
  type: "hubspot",
  
  async testConnection(_config, secret) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
        headers: { "Authorization": `Bearer ${secret}` },
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
  
  async search(query, _config, secret) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 10,
          properties: ["firstname", "lastname", "email", "company", "jobtitle"],
        }),
      });
      if (!res.ok) return { results: [] };
      const data = await res.json();
      return {
        results: (data.results ?? []).map((c: any) => ({
          title: `${c.properties.firstname ?? ""} ${c.properties.lastname ?? ""}`.trim() || c.properties.email,
          excerpt: [c.properties.jobtitle, c.properties.company].filter(Boolean).join(" at "),
          type: "contact",
          updatedAt: c.updatedAt,
        })),
      };
    } catch {
      return { results: [] };
    }
  },
  
  async recentActivity(_config, secret, limit = 10) {
    try {
      const res = await fetch(
        `https://api.hubapi.com/crm/v3/objects/deals?limit=${limit}&sorts=-hs_lastmodifieddate&properties=dealname,dealstage,amount,closedate`,
        { headers: { "Authorization": `Bearer ${secret}` } },
      );
      if (!res.ok) return { items: [] };
      const data = await res.json();
      return {
        items: (data.results ?? []).map((d: any) => ({
          title: d.properties.dealname ?? "Untitled Deal",
          detail: `${d.properties.dealstage ?? ""} — $${d.properties.amount ?? "0"}`,
          timestamp: d.updatedAt ?? new Date().toISOString(),
          type: "deal",
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
```

**File: `src/services/workspace-connectors/registry.ts`**

```typescript
import type { WorkspaceConnector } from "./types.js";
import { googleDriveConnector } from "./google-drive.js";
import { clickupConnector } from "./clickup.js";
import { hubspotConnector } from "./hubspot.js";

const CONNECTORS: Record<string, WorkspaceConnector> = {
  "google-drive": googleDriveConnector,
  "clickup": clickupConnector,
  "hubspot": hubspotConnector,
};

export function getConnector(type: string): WorkspaceConnector | null {
  return CONNECTORS[type] ?? null;
}

export function listConnectorTypes(): string[] {
  return Object.keys(CONNECTORS);
}

/** Available connections that can be configured (for the setup wizard). */
export const AVAILABLE_CONNECTIONS = [
  {
    type: "google-drive",
    name: "Google Drive",
    icon: "📁",
    description: "Search and browse shared team folders",
    configFields: [
      { key: "folderId", label: "Shared Folder ID", placeholder: "1abc...", required: true },
      { key: "account", label: "Google Account", placeholder: "team@company.com", required: true },
    ],
    secretField: null, // gog CLI handles OAuth
  },
  {
    type: "clickup",
    name: "ClickUp",
    icon: "✅",
    description: "View tasks, projects, and team activity",
    configFields: [
      { key: "teamId", label: "Team ID", placeholder: "12345678", required: true },
    ],
    secretField: { key: "apiToken", label: "Personal API Token", placeholder: "pk_..." },
  },
  {
    type: "hubspot",
    name: "HubSpot",
    icon: "🔶",
    description: "Search contacts, deals, and pipeline",
    configFields: [
      { key: "portalId", label: "Portal ID", placeholder: "12345", required: false },
    ],
    secretField: { key: "accessToken", label: "Private App Token", placeholder: "pat-..." },
  },
  {
    type: "ghl",
    name: "GoHighLevel",
    icon: "⚡",
    description: "CRM contacts and pipeline (via API key)",
    configFields: [
      { key: "locationId", label: "Location ID", required: true },
    ],
    secretField: { key: "apiKey", label: "API Key" },
  },
  {
    type: "slack",
    name: "Slack",
    icon: "💬",
    description: "Read team channels and search messages",
    configFields: [
      { key: "teamId", label: "Team/Workspace ID", required: false },
    ],
    secretField: { key: "botToken", label: "Bot Token", placeholder: "xoxb-..." },
  },
  {
    type: "notion",
    name: "Notion",
    icon: "📓",
    description: "Search team wiki and databases",
    configFields: [],
    secretField: { key: "integrationToken", label: "Integration Token", placeholder: "secret_..." },
  },
];
```

### 1.3 Workspace Connection RPCs

**File: `src/methods/workspace-connections.ts`** (NEW)

```typescript
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import { findWorkspaceById, readWorkspaceConfig, writeWorkspaceConfig } from "../lib/workspaces-config.js";
import { getWorkspaceSecret, setWorkspaceSecret, deleteWorkspaceSecret } from "../lib/workspace-secrets.js";
import { getConnector, AVAILABLE_CONNECTIONS } from "../services/workspace-connectors/registry.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

/** List available connection types for the setup wizard. */
const listAvailable: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { connections: AVAILABLE_CONNECTIONS });
};

/** List connections configured for a workspace. */
const list: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId } = params as { workspaceId?: string };
  if (!workspaceId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId required" });
    return;
  }
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  respond(true, { connections: ws.connections ?? [] });
};

/** Add or update a connection for a workspace. */
const upsert: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, connection, secret } = params as {
    workspaceId?: string;
    connection?: { id: string; type: string; name: string; config: Record<string, string> };
    secret?: string;
  };
  if (!workspaceId || !connection?.type || !connection?.id) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connection required" });
    return;
  }
  
  // Test connection first
  const connector = getConnector(connection.type);
  if (!connector) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: `Unknown connection type: ${connection.type}` });
    return;
  }
  
  const testResult = await connector.testConnection(connection.config, secret ?? "");
  if (!testResult.ok) {
    respond(false, undefined, { code: "CONNECTION_FAILED", message: testResult.error ?? "Connection test failed" });
    return;
  }
  
  // Store secret separately (not in git-synced config)
  if (secret) {
    setWorkspaceSecret(workspaceId, connection.id, secret);
  }
  
  // Update workspace config
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  
  if (!ws.connections) ws.connections = [];
  const existing = ws.connections.findIndex(c => c.id === connection.id);
  const entry = {
    id: connection.id,
    type: connection.type as any,
    name: connection.name,
    status: "connected" as const,
    config: connection.config,
    lastSync: new Date().toISOString(),
  };
  
  if (existing >= 0) {
    ws.connections[existing] = entry;
  } else {
    ws.connections.push(entry);
  }
  
  writeWorkspaceConfig(config);
  respond(true, { connection: entry, testResult });
};

/** Remove a connection from a workspace. */
const remove: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, connectionId } = params as { workspaceId?: string; connectionId?: string };
  if (!workspaceId || !connectionId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connectionId required" });
    return;
  }
  
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  
  ws.connections = (ws.connections ?? []).filter(c => c.id !== connectionId);
  writeWorkspaceConfig(config);
  deleteWorkspaceSecret(workspaceId, connectionId);
  respond(true, { removed: connectionId });
};

/** Test a connection. */
const test: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, connectionId } = params as { workspaceId?: string; connectionId?: string };
  if (!workspaceId || !connectionId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connectionId required" });
    return;
  }
  
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  const conn = ws?.connections?.find(c => c.id === connectionId);
  if (!conn) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Connection not found" });
    return;
  }
  
  const connector = getConnector(conn.type);
  if (!connector) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: `Unknown connector: ${conn.type}` });
    return;
  }
  
  const secret = getWorkspaceSecret(workspaceId, connectionId) ?? "";
  const result = await connector.testConnection(conn.config, secret);
  
  // Update status in config
  conn.status = result.ok ? "connected" : "error";
  conn.error = result.ok ? undefined : result.error;
  conn.lastSync = result.ok ? new Date().toISOString() : conn.lastSync;
  writeWorkspaceConfig(config);
  
  respond(true, result);
};

/** Search across all connections in a workspace. */
const search: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, query } = params as { workspaceId?: string; query?: string };
  if (!workspaceId || !query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and query required" });
    return;
  }
  
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  
  const connections = (ws.connections ?? []).filter(c => c.status === "connected");
  const allResults: Array<{ source: string; results: any[] }> = [];
  
  await Promise.all(connections.map(async (conn) => {
    const connector = getConnector(conn.type);
    if (!connector) return;
    const secret = getWorkspaceSecret(workspaceId, conn.id) ?? "";
    try {
      const result = await connector.search(query, conn.config, secret);
      allResults.push({ source: conn.name, results: result.results });
    } catch { /* skip failed connectors */ }
  }));
  
  respond(true, { sources: allResults });
};

export const workspaceConnectionMethods: GatewayRequestHandlers = {
  "workspace.connections.available": listAvailable,
  "workspace.connections.list": list,
  "workspace.connections.upsert": upsert,
  "workspace.connections.remove": remove,
  "workspace.connections.test": test,
  "workspace.connections.search": search,
};
```

Register all methods in the plugin's method registry (same pattern as other method files).

---

## Phase 2: Activity Feed (4 hours)

### 2.1 Feed Backend

**File: `src/services/workspace-feed.ts`** (NEW)

```typescript
import { existsSync, readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export type FeedEntry = {
  ts: string;           // ISO timestamp
  author: string;       // "caleb:agent", "titus", "caleb", "system"
  type: string;         // "decision", "request", "response", "artifact", "update", "sop"
  text: string;         // The message/update
  ref?: string | null;  // Optional reference: "gdrive:file-xyz", "clickup:task-abc"
  workspace: string;    // Workspace ID this entry belongs to
};

const FEED_FILENAME = "feed.jsonl";

function feedPath(workspacePath: string): string {
  return join(workspacePath, FEED_FILENAME);
}

export function appendFeedEntry(workspacePath: string, entry: Omit<FeedEntry, "ts">): FeedEntry {
  const full: FeedEntry = { ts: new Date().toISOString(), ...entry };
  const fp = feedPath(workspacePath);
  if (!existsSync(workspacePath)) mkdirSync(workspacePath, { recursive: true });
  appendFileSync(fp, JSON.stringify(full) + "\n");
  return full;
}

export function readFeed(workspacePath: string, limit = 50, before?: string): FeedEntry[] {
  const fp = feedPath(workspacePath);
  if (!existsSync(fp)) return [];
  
  const lines = readFileSync(fp, "utf8").split("\n").filter(Boolean);
  let entries: FeedEntry[] = [];
  
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch { /* skip malformed */ }
  }
  
  // Sort newest first
  entries.sort((a, b) => b.ts.localeCompare(a.ts));
  
  // Filter by before timestamp if provided
  if (before) {
    entries = entries.filter(e => e.ts < before);
  }
  
  return entries.slice(0, limit);
}

export function searchFeed(workspacePath: string, query: string, limit = 20): FeedEntry[] {
  const fp = feedPath(workspacePath);
  if (!existsSync(fp)) return [];
  
  const lines = readFileSync(fp, "utf8").split("\n").filter(Boolean);
  const q = query.toLowerCase();
  const results: FeedEntry[] = [];
  
  for (const line of lines) {
    try {
      const entry: FeedEntry = JSON.parse(line);
      if (entry.text.toLowerCase().includes(q) || entry.author.toLowerCase().includes(q)) {
        results.push(entry);
      }
    } catch { /* skip */ }
  }
  
  return results.sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, limit);
}
```

### 2.2 Feed RPCs

**File: `src/methods/workspace-feed.ts`** (NEW)

```typescript
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";
import { appendFeedEntry, readFeed, searchFeed } from "../services/workspace-feed.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const feedRead: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, limit, before } = params as {
    workspaceId?: string; limit?: number; before?: string;
  };
  if (!workspaceId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId required" });
    return;
  }
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entries = readFeed(ws.path, limit ?? 50, before);
  respond(true, { entries, workspaceId });
};

const feedPost: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, author, type, text, ref } = params as {
    workspaceId?: string; author?: string; type?: string; text?: string; ref?: string;
  };
  if (!workspaceId || !text) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and text required" });
    return;
  }
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entry = appendFeedEntry(ws.path, {
    author: author ?? "user",
    type: type ?? "update",
    text,
    ref: ref ?? null,
    workspace: workspaceId,
  });
  respond(true, { entry });
};

const feedSearch: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, query, limit } = params as {
    workspaceId?: string; query?: string; limit?: number;
  };
  if (!workspaceId || !query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and query required" });
    return;
  }
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entries = searchFeed(ws.path, query, limit ?? 20);
  respond(true, { entries, workspaceId });
};

export const workspaceFeedMethods: GatewayRequestHandlers = {
  "workspace.feed.read": feedRead,
  "workspace.feed.post": feedPost,
  "workspace.feed.search": feedSearch,
};
```

### 2.3 Agent Feed Integration

**File: `src/tools/team-message.ts`** — EDIT

The existing `team_message` tool posts to the team feed. Extend it to also append to the workspace `feed.jsonl` if the message is workspace-scoped:

```typescript
// After the existing team_message write logic, add:
import { appendFeedEntry } from "../services/workspace-feed.js";
import { detectWorkspaceFromText, readWorkspaceConfig, findWorkspaceById } from "../lib/workspaces-config.js";

// In the execute function, after posting to team feed:
const detectedWs = detectWorkspaceFromText(message);
if (detectedWs) {
  const config = readWorkspaceConfig();
  const ws = findWorkspaceById(config, detectedWs);
  if (ws) {
    appendFeedEntry(ws.path, {
      author: `${agentName ?? "agent"}`,
      type: messageType ?? "fyi",
      text: message,
      ref: null,
      workspace: detectedWs,
    });
  }
}
```

---

## Phase 3: Workspace UI Redesign (6 hours)

### 3.1 Workspace Detail View

When a user clicks into a workspace, they see:

```
┌─────────────────────────────────────────────────────────────┐
│  ← Workspaces    🏢 TRP                          ⚙️ Settings│
├─────────────────────────────────────────────────────────────┤
│  [Search across all connected tools + feed + docs]          │
├──────────────────────────┬──────────────────────────────────┤
│  FEED                    │  CONNECTIONS                      │
│  Activity feed           │  📁 Google Drive — ✅ Connected   │
│  (scrollable)            │  ✅ ClickUp — ✅ Connected        │
│                          │  🔶 HubSpot — ✅ Connected        │
│  🤖 Agent — 2 min ago   │  💬 Slack — ⚪ Not configured     │
│  ChiroHD: 4/7 done      │                                   │
│                          │  + Add Connection                 │
│  👤 User — 1 hr ago    │                                   │
│  Decision: Switch to     ├──────────────────────────────────┤
│  HubSpot forms           │  DOCS                            │
│                          │  📋 SOPs (3)                      │
│  🤖 Agent — 3 hrs ago   │  📖 Playbooks (2)                │
│  Weekly metrics posted   │  📝 Decisions (8)                │
│                          │  📦 Resources (12)               │
│  [Post to feed...]       │                                   │
│                          │  MEMBERS                          │
│                          │  👤 User (admin)                │
│                          │  👤 Titus (admin)                │
│                          │  👤 Ashley (member)              │
│                          │  + Invite Member                 │
└──────────────────────────┴──────────────────────────────────┘
```

### 3.2 Workspace List View (default)

Shows all workspaces as cards:

```
┌─────────────────────────────────────────────────────────────┐
│  Workspaces                              + Create Workspace  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ 🏢 Project Alpha     │  │ 💊 Project Beta      │          │
│  │ 3 connections       │  │ 1 connection         │          │
│  │ 3 members           │  │ 2 members            │          │
│  │ Last: 5 min ago     │  │ Last: 2 days ago     │          │
│  │ 12 feed entries     │  │ 3 feed entries       │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  ┌─────────────────────┐                                    │
│  │ ⚛️ GodMode           │                                    │
│  │ 0 connections       │                                    │
│  │ 1 member            │                                    │
│  │ Last: 1 hr ago      │                                    │
│  │ 45 feed entries     │                                    │
│  └─────────────────────┘                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Create Workspace Wizard

Step-by-step, dead simple:

```
Step 1: Name & Type
┌──────────────────────────────────────────┐
│  Name your workspace                      │
│  [TRP                              ]      │
│  Emoji: [🏢]                              │
│                                           │
│  ○ GitHub-backed (sync with a repo)       │
│  ○ Local only                             │
│                                           │
│  If GitHub: [repo URL                ]    │
│                           [Next →]        │
└──────────────────────────────────────────┘

Step 2: Connect Tools
┌──────────────────────────────────────────┐
│  Connect your team's tools (optional)     │
│                                           │
│  📁 Google Drive   [Connect]              │
│  ✅ ClickUp        [Connect]              │
│  🔶 HubSpot       [Connect]              │
│  💬 Slack          [Connect]              │
│  📓 Notion         [Connect]              │
│                                           │
│  Skip — you can add these later           │
│                           [Next →]        │
└──────────────────────────────────────────┘

Step 3: Invite Members
┌──────────────────────────────────────────┐
│  Invite your team (optional)              │
│                                           │
│  Name: [            ] Role: [member ▼]   │
│  [+ Add another]                          │
│                                           │
│  Members get their own GodMode agent      │
│  with access to this workspace's          │
│  connected tools and feed.                │
│                                           │
│  Skip — you can invite later              │
│                        [Create →]         │
└──────────────────────────────────────────┘
```

### 3.4 Feed Composer

At the bottom of the Feed panel, a simple input:

```
┌──────────────────────────────────────────┐
│  [Post to feed...                    ] 📎│
│  Type: [update ▼]  [Post]               │
└──────────────────────────────────────────┘
```

Types: update, decision, sop, request, artifact

### 3.5 Connection Setup Modal

When clicking "Connect" on a tool in the wizard or settings:

```
┌──────────────────────────────────────────┐
│  Connect Google Drive                     │
│                                           │
│  Shared Folder ID:                        │
│  [1abc...                            ]    │
│                                           │
│  Google Account:                          │
│  [team@company.com                   ]    │
│                                           │
│  [Test Connection]  [Save]               │
│                                           │
│  Status: ✅ Connected — "TRP Shared"     │
│  42 files accessible                      │
└──────────────────────────────────────────┘
```

---

## Phase 4: Workspace Agent Tool (3 hours)

### 4.1 Agent Tool for Workspace Queries

The user's personal agent needs a way to query workspace connections. This is how "go ask the workspace about X" works.

**File: `src/tools/workspace-query.ts`** (NEW)

```typescript
/**
 * workspace-query tool — lets the agent search across workspace connections and feed.
 * 
 * Used when the user asks about team/workspace information.
 * The agent calls this tool, which queries the workspace's connected tools live.
 */
import type { AnyAgentTool } from "openclaw/plugin-sdk";
import { readWorkspaceConfig, findWorkspaceById, detectWorkspaceFromText } from "../lib/workspaces-config.js";
import { getConnector } from "../services/workspace-connectors/registry.js";
import { getWorkspaceSecret } from "../lib/workspace-secrets.js";
import { readFeed, searchFeed } from "../services/workspace-feed.js";
import { jsonResult } from "../lib/sdk-helpers.js";

export function createWorkspaceQueryTool(): AnyAgentTool {
  return {
    label: "Workspace Query",
    name: "workspace_query",
    description: "Search across a team workspace's connected tools (Drive, ClickUp, CRM) and activity feed. Use when the user asks about team projects, shared documents, or workspace activity.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "What to search for" },
        workspace: { type: "string", description: "Workspace ID or name. If omitted, auto-detected from query." },
      },
      required: ["query"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const query = String(params.query ?? "");
      let wsId = String(params.workspace ?? "");
      
      // Auto-detect workspace from query if not specified
      if (!wsId) {
        wsId = detectWorkspaceFromText(query) ?? "";
      }
      
      if (!wsId) {
        return jsonResult({ error: "Could not determine workspace. Specify workspace name." });
      }
      
      const config = readWorkspaceConfig();
      const ws = findWorkspaceById(config, wsId);
      if (!ws) {
        return jsonResult({ error: `Workspace "${wsId}" not found.` });
      }
      
      // Search connections in parallel
      const connections = (ws.connections ?? []).filter(c => c.status === "connected");
      const connectionResults = await Promise.all(
        connections.map(async (conn) => {
          const connector = getConnector(conn.type);
          if (!connector) return null;
          const secret = getWorkspaceSecret(ws.id, conn.id) ?? "";
          try {
            const result = await connector.search(query, conn.config, secret);
            return { source: conn.name, type: conn.type, results: result.results };
          } catch { return null; }
        }),
      );
      
      // Search feed
      const feedResults = searchFeed(ws.path, query, 5);
      
      return jsonResult({
        workspace: ws.name,
        connections: connectionResults.filter(Boolean),
        feed: feedResults,
      });
    },
  };
}
```

Register this tool in the plugin's tool registry so the agent can use it.

---

## File Summary

| Action | File | What |
|--------|------|------|
| NEW | `src/lib/workspace-secrets.ts` | Encrypted secret storage (outside git) |
| NEW | `src/services/workspace-connectors/types.ts` | Connector interface |
| NEW | `src/services/workspace-connectors/google-drive.ts` | Google Drive via gog CLI |
| NEW | `src/services/workspace-connectors/clickup.ts` | ClickUp via REST API |
| NEW | `src/services/workspace-connectors/hubspot.ts` | HubSpot via REST API |
| NEW | `src/services/workspace-connectors/registry.ts` | Connector registry + available list |
| NEW | `src/methods/workspace-connections.ts` | Connection RPCs (list, upsert, remove, test, search) |
| NEW | `src/services/workspace-feed.ts` | Feed read/write (JSONL append-only) |
| NEW | `src/methods/workspace-feed.ts` | Feed RPCs (read, post, search) |
| NEW | `src/tools/workspace-query.ts` | Agent tool for workspace queries |
| EDIT | `src/lib/workspaces-config.ts` | Add `WorkspaceConnection` type to config |
| EDIT | `src/tools/team-message.ts` | Also write to workspace feed |
| EDIT | `ui/src/ui/tabs/work-tab.ts` | Complete redesign (list + detail + wizard) |

---

## Build Order (Recommended)

1. **Workspace secrets** (1 hr) — foundation for secure connection storage
2. **Connector types + registry** (1 hr) — interface + available connections list
3. **Google Drive connector** (1.5 hrs) — first connector, test with gog CLI
4. **ClickUp connector** (1 hr) — REST API, straightforward
5. **HubSpot connector** (1 hr) — REST API, straightforward
6. **Connection RPCs** (1.5 hrs) — upsert, test, list, remove, search
7. **Feed service + RPCs** (2 hrs) — JSONL append-only, read, post, search
8. **Workspace query tool** (1.5 hrs) — agent tool that fans out to connections
9. **UI: Workspace list + cards** (2 hrs) — card grid with stats
10. **UI: Workspace detail** (2 hrs) — feed + connections + docs + members
11. **UI: Create workspace wizard** (2 hrs) — 3-step flow
12. **UI: Connection setup modal** (1.5 hrs) — per-connection config form
13. **UI: Feed composer** (1 hr) — post-to-feed input

**Total: ~20 hours**

---

## Success Criteria

1. User creates a workspace in under 5 minutes (name → connect tools → invite members)
2. Workspace feed shows activity from agents and humans
3. User can search across all connected tools from one search bar
4. Agent can answer "what's the status of [project]?" by querying workspace connections
5. No personal data (email, screen, Honcho observations) is accessible from workspace
6. Connection secrets are stored outside the git-synced workspace folder
7. Git sync works for workspace docs + feed (not secrets)
8. Members list shows who has access
9. "Post to feed" works for both humans (UI) and agents (tool)
10. Dad-proof: wizard prevents misconfiguration. Every field has clear labels. Test button confirms connection works before saving.

---

## DO NOT

- Do NOT build a shared memory engine (no workspace Honcho, no workspace QMD)
- Do NOT route personal data to workspaces (no email, no screen, no personal Honcho)
- Do NOT build a permissions/ACL system beyond member list
- Do NOT store secrets in workspaces.json5 or any git-tracked file
- Do NOT create a CRM, project manager, or file explorer — workspaces connect to existing tools
- Do NOT add new npm dependencies — use fetch for APIs, existing gog CLI for Drive
- Do NOT modify `SOUL.md`, `USER.md`, `AGENTS.md`, `MEMORY.md`, or any identity files
