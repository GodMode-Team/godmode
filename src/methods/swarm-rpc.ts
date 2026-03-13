/**
 * Delegation RPC methods — UI-facing endpoints for Mission Control.
 *
 * These provide the data contract the Mission Control UI consumes
 * to render org charts, agent cards, activity feeds, and project status.
 * Data comes from projects-state (grouping) + queue-state (execution).
 */

import { readProjects, clearProjects } from "../lib/projects-state.js";
import { readQueueState, type QueueItem } from "../lib/queue-state.js";

// ── Response types ────────────────────────────────────────────────

export interface SwarmAgentState {
  id: string;
  personaSlug: string;
  personaName: string;
  role: string;
  status: "idle" | "working" | "done" | "failed";
  currentTask?: string;
  progress?: number;
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

// ── Helpers ───────────────────────────────────────────────────────

function slugToName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function mapQueueStatusToDisplay(queueStatus: string): string {
  switch (queueStatus) {
    case "processing": return "in_progress";
    case "review": case "needs-review": return "in_review";
    case "done": return "done";
    case "failed": return "failed";
    case "pending": return "todo";
    default: return queueStatus;
  }
}

function mapDisplayToAgentStatus(status: string): SwarmAgentState["status"] {
  switch (status) {
    case "in_progress": case "processing": return "working";
    case "done": case "in_review": case "review": case "needs-review": return "done";
    case "failed": case "cancelled": return "failed";
    default: return "idle";
  }
}

/** Find the queue item matching an issue (by issueId, with title fallback for compat) */
function findQueueItem(
  issueId: string,
  issueTitle: string,
  byIssueId: Map<string, QueueItem>,
  byTitle: Map<string, QueueItem>,
): QueueItem | undefined {
  return byIssueId.get(issueId) ?? byTitle.get(issueTitle);
}

/** Build issueId→QueueItem and title→QueueItem lookup maps */
function buildQueueLookups(items: QueueItem[]): {
  byIssueId: Map<string, QueueItem>;
  byTitle: Map<string, QueueItem>;
} {
  const byIssueId = new Map<string, QueueItem>();
  const byTitle = new Map<string, QueueItem>();
  for (const qi of items) {
    const id = qi.meta?.issueId ?? qi.meta?.paperclipIssueId;
    if (id) byIssueId.set(id, qi);
    byTitle.set(qi.title, qi);
  }
  return { byIssueId, byTitle };
}

// ── RPC handlers ──────────────────────────────────────────────────

async function handleSwarmProjects({ respond }: { respond: Function }) {
  const [projectsState, qs] = await Promise.all([readProjects(), readQueueState()]);
  const { byIssueId, byTitle } = buildQueueLookups(qs.items);

  const projects: SwarmProject[] = projectsState.projects.map(p => {
    let completedCount = 0;
    let failedCount = 0;

    for (const issue of p.issues) {
      const qi = findQueueItem(issue.issueId, issue.title, byIssueId, byTitle);
      const status = qi ? mapQueueStatusToDisplay(qi.status) : "todo";
      if (status === "done" || status === "in_review") completedCount++;
      if (status === "failed") failedCount++;
    }

    return {
      projectId: p.projectId,
      title: p.title,
      status: p.status,
      issueCount: p.issues.length,
      completedCount,
      failedCount,
      createdAt: new Date(p.createdAt).toISOString(),
      proofWorkspace: p.proofWorkspace,
    };
  });

  return respond(true, { projects, running: true });
}

async function handleSwarmStatus({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const projectId = params.projectId as string | undefined;
  if (!projectId) {
    return respond(false, null, { code: "INVALID_REQUEST", message: "Missing projectId" });
  }

  const [projectsState, qs] = await Promise.all([readProjects(), readQueueState()]);
  const project = projectsState.projects.find(p => p.projectId === projectId);
  if (!project) {
    return respond(false, null, { code: "NOT_FOUND", message: `Project not found: ${projectId}` });
  }

  const { byIssueId, byTitle } = buildQueueLookups(qs.items);

  const agents: SwarmAgentState[] = [];
  const issues: SwarmIssueNode[] = [];
  const seenAgents = new Set<string>();

  for (const issue of project.issues) {
    const slug = issue.personaSlug;
    const personaName = slugToName(slug);
    const qi = findQueueItem(issue.issueId, issue.title, byIssueId, byTitle);
    const displayStatus = qi ? mapQueueStatusToDisplay(qi.status) : "todo";

    let outputPreview: string | undefined;
    if (qi?.result?.summary) {
      outputPreview = qi.result.summary.length > 200
        ? qi.result.summary.slice(0, 200) + "..."
        : qi.result.summary;
    }

    issues.push({
      issueId: issue.issueId,
      title: issue.title,
      status: displayStatus,
      assignee: slug,
      personaName,
      proofDocSlug: issue.proofDocSlug,
      outputPreview,
      queueItemId: qi?.id,
    });

    if (!seenAgents.has(slug)) {
      seenAgents.add(slug);
      const agentStatus = mapDisplayToAgentStatus(displayStatus);
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

  const allDone = issues.length > 0 && issues.every(i => i.status === "done" || i.status === "in_review");
  const anyFailed = issues.some(i => i.status === "failed");
  const anyInProgress = issues.some(i => i.status === "in_progress");
  const projectStatus = allDone ? "completed" : anyFailed ? "at_risk" : anyInProgress ? "in_progress" : project.status;

  const detail: SwarmProjectDetail = {
    projectId: project.projectId,
    title: project.title,
    status: projectStatus,
    proofWorkspace: project.proofWorkspace,
    agents,
    issues,
  };

  return respond(true, detail);
}

async function handleSwarmSteer({ respond }: { params: Record<string, unknown>; respond: Function }) {
  return respond(false, null, {
    code: "UNSUPPORTED",
    message: "Steering is not supported for running CLI processes. Wait for completion and provide feedback in the review.",
  });
}

async function handleSwarmFeed({ params, respond }: { params: Record<string, unknown>; respond: Function }) {
  const filterProjectId = params.projectId as string | undefined;

  const [projectsState, qs] = await Promise.all([readProjects(), readQueueState()]);
  const { byIssueId, byTitle } = buildQueueLookups(qs.items);

  const events: SwarmFeedEvent[] = [];
  const projects = filterProjectId
    ? projectsState.projects.filter(p => p.projectId === filterProjectId)
    : projectsState.projects;

  for (const project of projects) {
    for (const issue of project.issues) {
      const personaName = slugToName(issue.personaSlug);
      const qi = findQueueItem(issue.issueId, issue.title, byIssueId, byTitle);
      const displayStatus = qi ? mapQueueStatusToDisplay(qi.status) : "todo";

      if (displayStatus === "done" || displayStatus === "in_review") {
        events.push({
          id: `${project.projectId}-${issue.issueId}-done`,
          timestamp: qi?.completedAt ?? Date.now(),
          type: "agent_completed",
          summary: `${personaName} completed "${issue.title}"`,
          projectId: project.projectId,
          personaSlug: issue.personaSlug,
          personaName,
          issueTitle: issue.title,
        });
      } else if (displayStatus === "in_progress" || displayStatus === "todo") {
        events.push({
          id: `${project.projectId}-${issue.issueId}-active`,
          timestamp: qi?.startedAt ?? qi?.createdAt ?? Date.now(),
          type: "agent_started",
          summary: `${personaName} ${displayStatus === "in_progress" ? "working on" : "assigned to"} "${issue.title}"`,
          projectId: project.projectId,
          personaSlug: issue.personaSlug,
          personaName,
          issueTitle: issue.title,
        });
      } else if (displayStatus === "failed") {
        events.push({
          id: `${project.projectId}-${issue.issueId}-failed`,
          timestamp: qi?.completedAt ?? Date.now(),
          type: "agent_failed",
          summary: `${personaName} failed on "${issue.title}"`,
          projectId: project.projectId,
          personaSlug: issue.personaSlug,
          personaName,
          issueTitle: issue.title,
        });
      }
    }
  }

  events.sort((a, b) => b.timestamp - a.timestamp);
  return respond(true, { events: events.slice(0, 100), running: true });
}

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

async function handleSwarmClear({ respond }: { params: Record<string, unknown>; respond: Function }) {
  await clearProjects();
  return respond(true, { cleared: true, message: "All projects cleared from Mission Control" });
}

// ── Export handler map ────────────────────────────────────────────

export const delegationHandlers: Record<string, unknown> = {
  "godmode.delegation.projects": handleSwarmProjects,
  "godmode.delegation.status": handleSwarmStatus,
  "godmode.delegation.steer": handleSwarmSteer,
  "godmode.delegation.feed": handleSwarmFeed,
  "godmode.delegation.runLog": handleSwarmRunLog,
  "godmode.delegation.clear": handleSwarmClear,
};
