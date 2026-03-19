/**
 * paperclip-client.ts — API client for Paperclip agent orchestration server.
 *
 * Paperclip is an open-source Node.js server that orchestrates AI agents
 * with an org-chart model, heartbeat protocol, and task management.
 *
 * Graceful degradation: When PAPERCLIP_URL is not set, the client stays
 * dormant and the delegate tool falls back to local queue-processor.
 */

// ── Types ────────────────────────────────────────────────────────

export interface PaperclipProject {
  id: string;
  name: string;
  description?: string;
  status?: string;
  urlKey?: string;
  [key: string]: unknown;
}

export interface PaperclipTask {
  title: string;
  description: string;
  priority?: string;
  assigneeAgentId?: string;
  status?: string;
  projectId?: string;
  goalId?: string;
  parentId?: string;
}

export interface PaperclipIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  assigneeAgentId?: string;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface PaperclipAgent {
  id: string;
  name: string;
  role?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PaperclipStatus {
  ready: boolean;
  url: string;
  taskCount: number;
}

// ── Client state ─────────────────────────────────────────────────

let baseUrl = "";
let apiKey = "";
let companyId = "";
let ready = false;
let initLogged = false;

// ── Helpers ──────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";

function headers(mutating = false): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (mutating) {
    h["X-Paperclip-Run-Id"] = randomUUID();
  }
  return h;
}

async function paperclipFetch<T = unknown>(
  path: string,
  opts?: { method?: string; body?: unknown; mutating?: boolean },
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const init: RequestInit = {
    method: opts?.method ?? "GET",
    headers: headers(opts?.mutating ?? false),
  };
  if (opts?.body !== undefined) {
    init.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Paperclip ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Initialize the Paperclip client. Returns true if connectivity check passes.
 */
export async function initPaperclip(
  url?: string,
  key?: string,
  company?: string,
): Promise<boolean> {
  baseUrl = (url || process.env.PAPERCLIP_URL || "").replace(/\/+$/, "");
  apiKey = key || process.env.PAPERCLIP_API_KEY || "";
  companyId = company || process.env.PAPERCLIP_COMPANY_ID || "";

  if (!baseUrl) {
    if (!initLogged) {
      console.log("[GodMode] Paperclip not configured — using local queue");
      initLogged = true;
    }
    ready = false;
    return false;
  }

  try {
    // Verify connectivity by listing agents
    await paperclipFetch(`/api/companies/${companyId}/agents`);
    ready = true;
    return true;
  } catch (err) {
    console.warn(`[GodMode] Paperclip connectivity check failed: ${String(err)}`);
    ready = false;
    return false;
  }
}

/**
 * Check if the Paperclip client is initialized and connected.
 */
export function isPaperclipReady(): boolean {
  return ready;
}

/**
 * Create a task (issue) in Paperclip.
 */
export async function createTask(task: PaperclipTask): Promise<PaperclipIssue> {
  return paperclipFetch<PaperclipIssue>(
    `/api/companies/${companyId}/issues`,
    {
      method: "POST",
      mutating: true,
      body: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        assigneeAgentId: task.assigneeAgentId,
        status: task.status ?? "todo",
        projectId: task.projectId,
        goalId: task.goalId,
        parentId: task.parentId,
      },
    },
  );
}

/**
 * List projects in Paperclip.
 */
export async function listProjects(): Promise<PaperclipProject[]> {
  const result = await paperclipFetch<PaperclipProject[] | { projects: PaperclipProject[] }>(
    `/api/companies/${companyId}/projects`,
  );
  return Array.isArray(result) ? result : (result as { projects: PaperclipProject[] }).projects ?? [];
}

/**
 * Find or create a project in Paperclip.
 * Reuses an existing active project if the name matches (case-insensitive prefix).
 * This prevents duplicate projects from repeated delegations.
 */
export async function findOrCreateProject(name: string, description?: string): Promise<PaperclipProject> {
  // Check for an existing project with a similar name
  try {
    const existing = await listProjects();
    const normalize = (s: string) => s.toLowerCase().replace(/[—–\-]/g, " ").replace(/\s+/g, " ").trim();
    const target = normalize(name);

    // Match if existing project name starts with same prefix (first 3 words)
    const targetWords = target.split(" ").slice(0, 3).join(" ");
    const match = existing.find((p) => {
      if (p.status === "archived" || p.status === "completed") return false;
      const pName = normalize(p.name);
      return pName === target || pName.startsWith(targetWords) || target.startsWith(normalize(p.name).split(" ").slice(0, 3).join(" "));
    });

    if (match) return match;
  } catch {
    // If listing fails, fall through to create
  }

  return paperclipFetch<PaperclipProject>(
    `/api/companies/${companyId}/projects`,
    {
      method: "POST",
      mutating: true,
      body: { name, description },
    },
  );
}

/**
 * Get the status of a specific issue.
 */
export async function getTaskStatus(issueId: string): Promise<PaperclipIssue> {
  return paperclipFetch<PaperclipIssue>(`/api/issues/${issueId}`);
}

/**
 * List active tasks (todo + in_progress).
 */
export async function listActiveTasks(): Promise<PaperclipIssue[]> {
  const result = await paperclipFetch<PaperclipIssue[] | { issues: PaperclipIssue[] }>(
    `/api/companies/${companyId}/issues?status=todo,in_progress`,
  );
  return Array.isArray(result) ? result : result.issues ?? [];
}

/**
 * List available agents.
 */
export async function getAgents(): Promise<PaperclipAgent[]> {
  const result = await paperclipFetch<PaperclipAgent[] | { agents: PaperclipAgent[] }>(
    `/api/companies/${companyId}/agents`,
  );
  return Array.isArray(result) ? result : result.agents ?? [];
}

// ── Agent name → ID resolution (cached) ─────────────────────────

let _agentCache: PaperclipAgent[] = [];
let _agentCacheTs = 0;
const AGENT_CACHE_TTL_MS = 60_000; // 1 min

/**
 * Resolve a GodMode persona slug (e.g. "content-writer") to a Paperclip agent ID.
 * Matches by normalizing both sides: lowercased, hyphens ↔ spaces.
 * Returns undefined if no match found.
 */
export async function resolveAgentId(personaSlug: string): Promise<string | undefined> {
  // Refresh cache if stale
  if (Date.now() - _agentCacheTs > AGENT_CACHE_TTL_MS || _agentCache.length === 0) {
    try {
      _agentCache = await getAgents();
      _agentCacheTs = Date.now();
    } catch {
      return undefined;
    }
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[-_]/g, " ").trim();
  const slug = normalize(personaSlug);

  // Exact match first
  const exact = _agentCache.find((a) => normalize(a.name) === slug);
  if (exact) return exact.id;

  // Partial match (slug is contained in agent name or vice versa)
  const partial = _agentCache.find(
    (a) => normalize(a.name).includes(slug) || slug.includes(normalize(a.name)),
  );
  return partial?.id;
}

/**
 * Trigger an agent wakeup — Paperclip's heartbeat service will pick up
 * assigned issues and execute via the agent's configured adapter.
 */
export async function wakeupAgent(
  agentId: string,
  context?: { issueId?: string; reason?: string },
): Promise<void> {
  await paperclipFetch(`/api/agents/${agentId}/wakeup`, {
    method: "POST",
    mutating: true,
    body: {
      source: "on_demand",
      triggerDetail: "manual",
      payload: context?.issueId ? { issueId: context.issueId } : undefined,
    },
  });
}

/**
 * Update an agent's adapter configuration (e.g. switch from openclaw_gateway to hermes_local).
 */
export async function updateAgent(
  agentId: string,
  patch: Record<string, unknown>,
): Promise<PaperclipAgent> {
  return paperclipFetch<PaperclipAgent>(`/api/agents/${agentId}`, {
    method: "PATCH",
    mutating: true,
    body: patch,
  });
}

/**
 * Cancel a task by setting its status to "cancelled".
 */
export async function cancelTask(issueId: string): Promise<PaperclipIssue> {
  return paperclipFetch<PaperclipIssue>(`/api/issues/${issueId}`, {
    method: "PATCH",
    mutating: true,
    body: { status: "cancelled" },
  });
}

// ── Completion Poller ────────────────────────────────────────────

const _seenCompleted = new Set<string>();
let _pollHandle: ReturnType<typeof setInterval> | null = null;
let _onCompletionHandler: ((issue: PaperclipIssue) => void) | null = null;

/**
 * List completed/done issues (for polling).
 */
async function listCompletedIssues(): Promise<PaperclipIssue[]> {
  const result = await paperclipFetch<PaperclipIssue[] | { issues: PaperclipIssue[] }>(
    `/api/companies/${companyId}/issues?status=done,completed,in_review`,
  );
  return Array.isArray(result) ? result : result.issues ?? [];
}

/**
 * Start polling Paperclip for completed tasks.
 * Calls onCompletion for each newly completed issue (deduped by ID).
 */
export function startCompletionPoller(
  onCompletion: (issue: PaperclipIssue) => void,
  intervalMs = 30_000,
): void {
  if (_pollHandle) return; // already running
  _onCompletionHandler = onCompletion;

  _pollHandle = setInterval(async () => {
    if (!ready) return;
    try {
      const completed = await listCompletedIssues();
      for (const issue of completed) {
        if (!_seenCompleted.has(issue.id)) {
          _seenCompleted.add(issue.id);
          try {
            _onCompletionHandler?.(issue);
          } catch (err) {
            console.error(`[GodMode] Paperclip completion handler error: ${String(err)}`);
          }
        }
      }
    } catch {
      // Poll failure is non-fatal — will retry next interval
    }
  }, intervalMs);

  // Seed the seen set with already-completed issues to avoid re-firing on startup
  void listCompletedIssues()
    .then((issues) => issues.forEach((i) => _seenCompleted.add(i.id)))
    .catch(() => {});
}

/** Stop the completion poller. */
export function stopCompletionPoller(): void {
  if (_pollHandle) {
    clearInterval(_pollHandle);
    _pollHandle = null;
  }
}

/**
 * Get overall Paperclip status.
 */
export async function getPaperclipStatus(): Promise<PaperclipStatus> {
  if (!ready) {
    return { ready: false, url: baseUrl || "(not configured)", taskCount: 0 };
  }
  try {
    const tasks = await listActiveTasks();
    return { ready: true, url: baseUrl, taskCount: tasks.length };
  } catch {
    return { ready: false, url: baseUrl, taskCount: 0 };
  }
}
