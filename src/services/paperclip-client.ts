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

export interface PaperclipTask {
  title: string;
  description: string;
  priority?: string;
  assigneeAgentId?: string;
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

function headers(mutating = false): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (mutating) {
    h["X-Paperclip-Run-Id"] = `godmode-${Date.now()}`;
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
        goalId: task.goalId,
        parentId: task.parentId,
      },
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
