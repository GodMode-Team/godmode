/**
 * Delegation RPC methods — UI-facing endpoints for Paperclip team data.
 *
 * These provide the data contract the Mission Control UI consumes
 * to render org charts, agent cards, activity feeds, and steering.
 */

import { getPaperclipAdapter, isPaperclipRunning } from "../services/paperclip-adapter.js";
import { readQueueState } from "../lib/queue-state.js";

// ── Response types ────────────────────────────────────────────────

export interface SwarmAgentState {
  id: string;
  personaSlug: string;
  personaName: string;
  role: string;
  status: "idle" | "working" | "done" | "failed";
  currentTask?: string;
  progress?: number; // 0-100
  startedAt?: number;
  endedAt?: number;
  tokenSpend?: number;
  lastHeartbeat?: number;
  proofDocSlug?: string;
}

export interface SwarmIssueNode {
  issueId: string;
  title: string;
  status: string;
  assignee: string;
  personaName: string;
  proofDocSlug?: string;
  dependsOn?: string[];
  outputPreview?: string;
  cost?: { inputTokens: number; outputTokens: number };
  queueItemId?: string;
}

export interface SwarmProject {
  projectId: string;
  title: string;
  status: string;
  issueCount: number;
  completedCount: number;
  failedCount: number;
  createdAt: string;
  proofWorkspace: string;
}

export interface SwarmProjectDetail {
  projectId: string;
  title: string;
  status: string;
  proofWorkspace: string;
  agents: SwarmAgentState[];
  issues: SwarmIssueNode[];
  tokenSpend?: number;
}

export interface SwarmFeedEvent {
  id: string;
  timestamp: number;
  type: "agent_started" | "agent_completed" | "agent_failed" | "handoff" | "steering" | "project_completed" | "project_failed";
  summary: string;
  projectId: string;
  personaSlug?: string;
  personaName?: string;
  issueTitle?: string;
}

// ── RPC handlers ──────────────────────────────────────────────────

/**
 * godmode.delegation.projects — List active/recent delegated projects.
 */
async function handleSwarmProjects({ respond }: { respond: Function }) {
  if (!isPaperclipRunning()) {
    return respond(true, { projects: [], running: false });
  }

  const adapter = getPaperclipAdapter();
  if (!adapter) {
    return respond(true, { projects: [], running: false });
  }

  const raw = adapter.listProjects();
  const projects: SwarmProject[] = [];

  for (const p of raw) {
    const status = await adapter.getStatus(p.projectId);
    const completedCount = status?.issues.filter(i => i.status === "done").length ?? 0;
    const failedCount = status?.issues.filter(i => i.status === "failed" || i.status === "cancelled").length ?? 0;

    projects.push({
      projectId: p.projectId,
      title: p.title,
      status: status?.status ?? "unknown",
      issueCount: p.issueCount,
      completedCount,
      failedCount,
      createdAt: p.createdAt,
      proofWorkspace: status?.proofWorkspace ?? "",
    });
  }

  return respond(true, { projects, running: true });
}

/**
 * godmode.delegation.status — Detailed status for one project (org chart, agent states).
 */
async function handleSwarmStatus({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const projectId = params.projectId as string | undefined;
  if (!projectId) {
    return respond(false, null, { code: "INVALID_REQUEST", message: "Missing projectId" });
  }

  if (!isPaperclipRunning()) {
    return respond(false, null, { code: "UNAVAILABLE", message: "Agent team not running" });
  }

  const adapter = getPaperclipAdapter();
  if (!adapter) {
    return respond(false, null, { code: "UNAVAILABLE", message: "Agent team not available" });
  }

  const status = await adapter.getStatus(projectId);
  if (!status) {
    return respond(false, null, { code: "NOT_FOUND", message: `Project not found: ${projectId}` });
  }

  // Cross-reference queue state for real execution statuses
  // Paperclip is a tracking layer; the queue-processor has the real status
  let queueItems: import("../lib/queue-state.js").QueueItem[] = [];
  try {
    const qs = await readQueueState();
    queueItems = qs.items;
  } catch { /* queue not available */ }

  // Build a lookup: issue title → queue item (titles match because delegate() uses issue titles)
  const queueByTitle = new Map<string, import("../lib/queue-state.js").QueueItem>();
  for (const qi of queueItems) {
    queueByTitle.set(qi.title, qi);
  }

  // Map issues to agent states and issue nodes
  const agents: SwarmAgentState[] = [];
  const issues: SwarmIssueNode[] = [];
  const seenAgents = new Set<string>();
  let totalTokenSpend = 0;

  for (const issue of status.issues) {
    const slug = issue.assignee;
    const personaName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    // Merge real status from queue if available
    const qi = queueByTitle.get(issue.title);
    const realStatus = qi ? mapQueueStatusToIssueStatus(qi.status) : issue.status;

    // Extract output preview from queue result
    let outputPreview: string | undefined;
    if (qi?.result?.summary) {
      outputPreview = qi.result.summary.length > 200
        ? qi.result.summary.slice(0, 200) + "..."
        : qi.result.summary;
    }

    issues.push({
      issueId: issue.title,
      title: issue.title,
      status: realStatus,
      assignee: slug,
      personaName,
      proofDocSlug: issue.proofDocSlug,
      outputPreview,
      queueItemId: qi?.id,
    });

    if (!seenAgents.has(slug)) {
      seenAgents.add(slug);
      const agentStatus = mapIssueStatusToAgentStatus(realStatus);
      agents.push({
        id: slug,
        personaSlug: slug,
        personaName,
        role: "general",
        status: agentStatus,
        currentTask: agentStatus === "working" ? issue.title : undefined,
        startedAt: qi?.startedAt,
        endedAt: qi?.completedAt,
        proofDocSlug: issue.proofDocSlug,
      });
    }
  }

  // Determine overall project status from issue statuses
  const allDone = issues.length > 0 && issues.every(i => i.status === "done" || i.status === "in_review");
  const anyFailed = issues.some(i => i.status === "failed" || i.status === "cancelled");
  const anyInProgress = issues.some(i => i.status === "in_progress");
  const projectStatus = allDone ? "completed" : anyFailed ? "at_risk" : anyInProgress ? "in_progress" : status.status;

  const detail: SwarmProjectDetail = {
    projectId: status.projectId,
    title: status.title,
    status: projectStatus,
    proofWorkspace: status.proofWorkspace,
    agents,
    issues,
    tokenSpend: totalTokenSpend > 0 ? totalTokenSpend : undefined,
  };

  return respond(true, detail);
}

/**
 * godmode.delegation.steer — Send steering instruction to an agent on a project issue.
 */
async function handleSwarmSteer({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const projectId = params.projectId as string | undefined;
  const issueTitle = params.issueTitle as string | undefined;
  const instructions = params.instructions as string | undefined;

  if (!projectId || !issueTitle || !instructions) {
    return respond(false, null, { code: "INVALID_REQUEST", message: "Missing projectId, issueTitle, or instructions" });
  }

  if (!isPaperclipRunning()) {
    return respond(false, null, { code: "UNAVAILABLE", message: "Agent team not running" });
  }

  const adapter = getPaperclipAdapter();
  if (!adapter) {
    return respond(false, null, { code: "UNAVAILABLE", message: "Agent team not available" });
  }

  const ok = await adapter.steer(projectId, issueTitle, instructions);
  if (ok) {
    return respond(true, { success: true, message: `Steering sent for "${issueTitle}"` });
  }
  return respond(false, null, { code: "STEER_FAILED", message: "Failed to steer. Check projectId and issueTitle." });
}

/**
 * godmode.delegation.feed — Activity feed for a project (or all projects).
 */
async function handleSwarmFeed({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const projectId = params.projectId as string | undefined;

  if (!isPaperclipRunning()) {
    return respond(true, { events: [], running: false });
  }

  const adapter = getPaperclipAdapter();
  if (!adapter) {
    return respond(true, { events: [], running: false });
  }

  // Cross-reference queue state for real statuses + timestamps
  let queueItems: import("../lib/queue-state.js").QueueItem[] = [];
  try {
    const qs = await readQueueState();
    queueItems = qs.items;
  } catch { /* queue not available */ }
  const queueByTitle = new Map<string, import("../lib/queue-state.js").QueueItem>();
  for (const qi of queueItems) {
    queueByTitle.set(qi.title, qi);
  }

  // Build feed from project status snapshots
  const events: SwarmFeedEvent[] = [];
  const projectList = projectId
    ? [{ projectId, title: "", issueCount: 0, createdAt: "" }]
    : adapter.listProjects();

  for (const p of projectList) {
    const status = await adapter.getStatus(p.projectId);
    if (!status) continue;

    for (const issue of status.issues) {
      const personaName = issue.assignee.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const qi = queueByTitle.get(issue.title);
      const realStatus = qi ? mapQueueStatusToIssueStatus(qi.status) : issue.status;

      if (realStatus === "done" || realStatus === "in_review") {
        events.push({
          id: `${p.projectId}-${issue.title}-done`,
          timestamp: qi?.completedAt ?? Date.now(),
          type: "agent_completed",
          summary: `${personaName} completed "${issue.title}"`,
          projectId: p.projectId,
          personaSlug: issue.assignee,
          personaName,
          issueTitle: issue.title,
        });
      } else if (realStatus === "in_progress" || realStatus === "todo") {
        events.push({
          id: `${p.projectId}-${issue.title}-active`,
          timestamp: qi?.startedAt ?? qi?.createdAt ?? Date.now(),
          type: "agent_started",
          summary: `${personaName} ${realStatus === "in_progress" ? "working on" : "assigned to"} "${issue.title}"`,
          projectId: p.projectId,
          personaSlug: issue.assignee,
          personaName,
          issueTitle: issue.title,
        });
      } else if (realStatus === "failed" || realStatus === "cancelled") {
        events.push({
          id: `${p.projectId}-${issue.title}-failed`,
          timestamp: qi?.completedAt ?? Date.now(),
          type: "agent_failed",
          summary: `${personaName} failed on "${issue.title}"`,
          projectId: p.projectId,
          personaSlug: issue.assignee,
          personaName,
          issueTitle: issue.title,
        });
      }
    }
  }

  events.sort((a, b) => b.timestamp - a.timestamp);
  return respond(true, { events: events.slice(0, 100), running: true });
}

// ── Helpers ───────────────────────────────────────────────────────

function mapIssueStatusToAgentStatus(status: string): SwarmAgentState["status"] {
  switch (status) {
    case "in_progress": case "processing": return "working";
    case "done": case "in_review": case "review": case "needs-review": return "done";
    case "failed": case "cancelled": return "failed";
    default: return "idle";
  }
}

/** Map queue-processor status → Paperclip-style issue status for UI */
function mapQueueStatusToIssueStatus(queueStatus: string): string {
  switch (queueStatus) {
    case "processing": return "in_progress";
    case "review": case "needs-review": return "in_review";
    case "done": return "done";
    case "failed": return "failed";
    case "pending": return "todo";
    default: return queueStatus;
  }
}

/**
 * godmode.delegation.runLog — Fetch log/output for a specific agent run (by queue item ID).
 */
async function handleSwarmRunLog({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const queueItemId = params.queueItemId as string | undefined;
  if (!queueItemId) {
    return respond(false, null, { code: "INVALID_REQUEST", message: "Missing queueItemId" });
  }

  try {
    const qs = await readQueueState();
    const item = qs.items.find(i => i.id === queueItemId);
    if (!item) {
      return respond(false, null, { code: "NOT_FOUND", message: `Queue item not found: ${queueItemId}` });
    }

    const lines: string[] = [];
    lines.push(`# ${item.title}`);
    lines.push("");
    lines.push(`**Status:** ${item.status}`);
    lines.push(`**Persona:** ${item.personaHint ?? "unassigned"}`);
    lines.push(`**Type:** ${item.type}`);
    if (item.startedAt) lines.push(`**Started:** ${new Date(item.startedAt).toLocaleString()}`);
    if (item.completedAt) lines.push(`**Completed:** ${new Date(item.completedAt).toLocaleString()}`);
    lines.push("");

    if (item.error) {
      lines.push("## Error");
      lines.push("```");
      lines.push(item.error);
      lines.push("```");
      lines.push("");
    }

    if (item.result?.summary) {
      lines.push("## Output Summary");
      lines.push(item.result.summary);
      lines.push("");
    }

    if (item.result?.outputPath) {
      lines.push(`**Output file:** ${item.result.outputPath}`);
      // Try to read first 100 lines of the output file
      try {
        const fs = await import("node:fs/promises");
        const content = await fs.readFile(item.result.outputPath, "utf-8");
        const preview = content.split("\n").slice(0, 100).join("\n");
        lines.push("");
        lines.push("## Output Content");
        lines.push("```");
        lines.push(preview);
        if (content.split("\n").length > 100) lines.push("... (truncated)");
        lines.push("```");
      } catch { /* file not readable */ }
    }

    if (item.artifacts && item.artifacts.length > 0) {
      lines.push("");
      lines.push("## Artifacts");
      for (const a of item.artifacts) {
        lines.push(`- ${a}`);
      }
    }

    return respond(true, { content: lines.join("\n"), title: item.title, mimeType: "text/markdown" });
  } catch (err) {
    return respond(false, null, { code: "INTERNAL_ERROR", message: String(err) });
  }
}

// ── Export handler map ────────────────────────────────────────────

export const delegationHandlers: Record<string, unknown> = {
  "godmode.delegation.projects": handleSwarmProjects,
  "godmode.delegation.status": handleSwarmStatus,
  "godmode.delegation.steer": handleSwarmSteer,
  "godmode.delegation.feed": handleSwarmFeed,
  "godmode.delegation.runLog": handleSwarmRunLog,
};
