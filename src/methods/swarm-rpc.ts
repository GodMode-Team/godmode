/**
 * Delegation RPC methods — UI-facing endpoints for Paperclip team data.
 *
 * These provide the data contract the Mission Control UI consumes
 * to render org charts, agent cards, activity feeds, and steering.
 */

import { getPaperclipAdapter, isPaperclipRunning } from "../services/paperclip-adapter.js";

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

  // Map issues to agent states and issue nodes
  const agents: SwarmAgentState[] = [];
  const issues: SwarmIssueNode[] = [];
  const seenAgents = new Set<string>();

  for (const issue of status.issues) {
    const slug = issue.assignee;
    const personaName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    issues.push({
      issueId: issue.title, // use title as fallback ID for UI
      title: issue.title,
      status: issue.status,
      assignee: slug,
      personaName,
      proofDocSlug: issue.proofDocSlug,
    });

    if (!seenAgents.has(slug)) {
      seenAgents.add(slug);
      const agentStatus = mapIssueStatusToAgentStatus(issue.status);
      agents.push({
        id: slug,
        personaSlug: slug,
        personaName,
        role: "general",
        status: agentStatus,
        currentTask: agentStatus === "working" ? issue.title : undefined,
        proofDocSlug: issue.proofDocSlug,
      });
    }
  }

  const detail: SwarmProjectDetail = {
    projectId: status.projectId,
    title: status.title,
    status: status.status,
    proofWorkspace: status.proofWorkspace,
    agents,
    issues,
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

      if (issue.status === "done") {
        events.push({
          id: `${p.projectId}-${issue.title}-done`,
          timestamp: Date.now(), // TODO: use actual timestamps when available from adapter
          type: "agent_completed",
          summary: `${personaName} completed "${issue.title}"`,
          projectId: p.projectId,
          personaSlug: issue.assignee,
          personaName,
          issueTitle: issue.title,
        });
      } else if (issue.status === "in_progress" || issue.status === "todo") {
        events.push({
          id: `${p.projectId}-${issue.title}-active`,
          timestamp: Date.now(),
          type: issue.status === "in_progress" ? "agent_started" : "agent_started",
          summary: `${personaName} ${issue.status === "in_progress" ? "working on" : "assigned to"} "${issue.title}"`,
          projectId: p.projectId,
          personaSlug: issue.assignee,
          personaName,
          issueTitle: issue.title,
        });
      } else if (issue.status === "failed" || issue.status === "cancelled") {
        events.push({
          id: `${p.projectId}-${issue.title}-failed`,
          timestamp: Date.now(),
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
    case "in_progress": return "working";
    case "done": case "in_review": return "done";
    case "failed": case "cancelled": return "failed";
    default: return "idle";
  }
}

// ── Export handler map ────────────────────────────────────────────

export const delegationHandlers: Record<string, unknown> = {
  "godmode.delegation.projects": handleSwarmProjects,
  "godmode.delegation.status": handleSwarmStatus,
  "godmode.delegation.steer": handleSwarmSteer,
  "godmode.delegation.feed": handleSwarmFeed,
};
