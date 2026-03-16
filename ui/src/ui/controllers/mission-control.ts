import type { GodModeApp } from "../app.js";

// ── Swarm types (matching src/methods/swarm-rpc.ts response shapes) ──

export type SwarmAgentState = {
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
};

export type SwarmIssueNode = {
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
};

export type SwarmProject = {
  projectId: string;
  title: string;
  status: string;
  issueCount: number;
  completedCount: number;
  failedCount: number;
  createdAt: string;
  proofWorkspace: string;
};

export type SwarmProjectDetail = {
  projectId: string;
  title: string;
  status: string;
  proofWorkspace: string;
  agents: SwarmAgentState[];
  issues: SwarmIssueNode[];
  tokenSpend?: number;
};

export type SwarmFeedEvent = {
  id: string;
  timestamp: number;
  type: "agent_started" | "agent_completed" | "agent_failed" | "handoff" | "steering" | "project_completed" | "project_failed";
  summary: string;
  projectId: string;
  personaSlug?: string;
  personaName?: string;
  issueTitle?: string;
};

export type SwarmData = {
  projects: SwarmProject[];
  selectedProjectId: string | null;
  detail: SwarmProjectDetail | null;
  feed: SwarmFeedEvent[];
  running: boolean;
};

// ── Types (client-side view models matching backend RPC shapes) ──

type SerializedRun = {
  runId: string;
  childSessionKey: string;
  requesterSessionKey: string;
  task: string;
  label: string | null;
  model: string | null;
  spawnMode: string;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  endedReason: string | null;
  outcome: { status: "ok" | "error" | "timeout"; error: string | null } | null;
};

type CodingTaskRpc = {
  id: string;
  description: string;
  status: "queued" | "running" | "validating" | "review" | "done" | "failed";
  mode: string;
  branch: string;
  model?: string;
  childSessionKey?: string;
  pid?: number;
  prNumber?: number;
  prUrl?: string;
  reviews?: Array<{ engine: string; status: string; comment?: string }>;
  swarm?: {
    enabled: boolean;
    currentStage: string;
    stages: Record<string, { status: string; startedAt?: number; completedAt?: number }>;
  };
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
};

type QueueItemRpc = {
  id: string;
  type: string;
  title: string;
  status: string;
  priority: string;
  source: string;
  sourceTaskId?: string;
  retryCount?: number;
  pid?: number;
  result?: { summary: string; outputPath?: string; prUrl?: string };
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  personaHint?: string;
};

// ── Agent role name mapping ──

const AGENT_ROLE_NAMES: Record<string, string> = {
  coding: "Builder", research: "Researcher", analysis: "Analyst",
  creative: "Creative", review: "Reviewer", ops: "Ops",
  task: "Agent", url: "Reader", idea: "Explorer",
  subagent: "Sub-Agent", swarm: "Team",
};

function agentRoleName(type: string, subType?: string, personaHint?: string): string {
  if (personaHint) {
    // Convert slug "frontend-developer" → "Frontend Developer"
    return personaHint.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return AGENT_ROLE_NAMES[subType ?? type] ?? type;
}

// ── Exported view types ──

export type AgentRunView = {
  id: string;
  type: "coding" | "subagent" | "swarm" | "queue";
  task: string;
  status: "active" | "queued" | "done" | "failed";
  model: string | null;
  startedAt: number | null;
  endedAt: number | null;
  branch?: string;
  prUrl?: string;
  swarmStage?: string;
  swarmStages?: Record<string, { status: string; startedAt?: number; completedAt?: number }>;
  label?: string | null;
  error?: string;
  canCancel?: boolean;
  roleName: string;
  queueItemType?: string;
  outputPath?: string;
  sourceTaskId?: string;
  retryCount?: number;
  childSessionKey?: string;
  isReview?: boolean;
};

export type MissionControlStats = {
  activeNow: number;
  completedToday: number;
  failed: number;
  swarmPipelines: number;
  queueDepth: number;
  queueReview: number;
};

export type ActivityFeedItem = {
  id: string;
  timestamp: number;
  type: "started" | "completed" | "failed" | "queued" | "stage";
  summary: string;
  prUrl?: string;
  agentRef?: AgentRunView;
};

export type MissionControlData = {
  agents: AgentRunView[];
  stats: MissionControlStats;
  activityFeed: ActivityFeedItem[];
  lastRefreshedAt: number;
  queueItems: QueueItemRpc[];
  swarm: SwarmData;
};

// ── Helpers ──

export function formatDuration(startMs: number, endMs?: number): string {
  const elapsed = (endMs ?? Date.now()) - startMs;
  if (elapsed < 0) return "0s";
  const seconds = Math.floor(elapsed / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${secs}s`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function todayStartMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function mapCodingTaskStatus(status: string): "active" | "queued" | "done" | "failed" {
  switch (status) {
    case "running":
    case "validating":
      return "active";
    case "queued":
      return "queued";
    case "failed":
      return "failed";
    case "review":
    case "done":
    default:
      return "done";
  }
}

function mergeAgents(
  subagentRuns: SerializedRun[],
  codingTasks: CodingTaskRpc[],
): AgentRunView[] {
  const agents: AgentRunView[] = [];
  const codingSessionKeys = new Set<string>();

  // Convert coding tasks first
  for (const ct of codingTasks) {
    if (ct.childSessionKey) codingSessionKeys.add(ct.childSessionKey);

    const isSwarm = ct.swarm?.enabled === true;
    const isReview = ct.status === "review";
    agents.push({
      id: ct.id,
      type: isSwarm ? "swarm" : "coding",
      task: ct.description,
      status: mapCodingTaskStatus(ct.status),
      model: ct.model ?? null,
      startedAt: ct.startedAt ?? ct.createdAt,
      endedAt: ct.completedAt ?? null,
      branch: ct.branch,
      prUrl: ct.prUrl,
      swarmStage: isSwarm ? ct.swarm!.currentStage : undefined,
      swarmStages: isSwarm ? ct.swarm!.stages : undefined,
      error: ct.error,
      canCancel: ct.status === "running" || ct.status === "validating" || ct.status === "queued",
      roleName: isSwarm ? "Swarm" : "Builder",
      childSessionKey: ct.childSessionKey,
      isReview,
    });
  }

  // Convert subagent runs, dedup by childSessionKey
  for (const run of subagentRuns) {
    if (codingSessionKeys.has(run.childSessionKey)) continue;

    agents.push({
      id: run.runId,
      type: "subagent",
      task: run.task,
      status: run.endedAt
        ? run.outcome?.status === "error"
          ? "failed"
          : "done"
        : "active",
      model: run.model,
      startedAt: run.startedAt ?? run.createdAt,
      endedAt: run.endedAt,
      label: run.label,
      error: run.outcome?.error ?? undefined,
      roleName: run.label ?? "Sub-Agent",
      childSessionKey: run.childSessionKey,
    });
  }

  // Sort: active first (newest first), then queued, then recent ended
  agents.sort((a, b) => {
    const order = { active: 0, queued: 1, failed: 2, done: 3 };
    const diff = order[a.status] - order[b.status];
    if (diff !== 0) return diff;
    return (b.startedAt ?? 0) - (a.startedAt ?? 0);
  });

  return agents;
}

function buildActivityFeed(agents: AgentRunView[]): ActivityFeedItem[] {
  const items: ActivityFeedItem[] = [];

  for (const agent of agents) {
    if (agent.status === "done" && agent.endedAt) {
      items.push({
        id: `${agent.id}-done`,
        timestamp: agent.endedAt,
        type: "completed",
        summary: agent.task,
        prUrl: agent.prUrl,
        agentRef: agent,
      });
    }
    if (agent.status === "failed" && agent.endedAt) {
      items.push({
        id: `${agent.id}-fail`,
        timestamp: agent.endedAt,
        type: "failed",
        summary: `${agent.task}${agent.error ? ` — ${agent.error}` : ""}`,
        agentRef: agent,
      });
    }
    if (agent.status === "active" && agent.startedAt) {
      items.push({
        id: `${agent.id}-start`,
        timestamp: agent.startedAt,
        type: "started",
        summary: agent.task,
        agentRef: agent,
      });
    }
    if (agent.status === "queued" && agent.startedAt) {
      items.push({
        id: `${agent.id}-queue`,
        timestamp: agent.startedAt,
        type: "queued",
        summary: agent.task,
        agentRef: agent,
      });
    }
  }

  items.sort((a, b) => b.timestamp - a.timestamp);
  return items.slice(0, 50);
}

function computeStats(agents: AgentRunView[], queueDepth = 0, queueReview = 0): MissionControlStats {
  const dayStart = todayStartMs();
  let activeNow = 0;
  let completedToday = 0;
  let failed = 0;
  let swarmPipelines = 0;

  for (const a of agents) {
    if (a.status === "active") activeNow++;
    if (a.status === "done" && a.endedAt && a.endedAt >= dayStart) completedToday++;
    if (a.status === "failed" && a.endedAt && a.endedAt >= dayStart) failed++;
    if (a.type === "swarm" && (a.status === "active" || a.status === "queued")) swarmPipelines++;
  }

  // Count coding tasks in review toward the review badge
  const codingReview = agents.filter(a => a.isReview && (a.type === "coding" || a.type === "swarm")).length;

  return { activeNow, completedToday, failed, swarmPipelines, queueDepth, queueReview: queueReview + codingReview };
}

// ── Main load function ──

export async function loadMissionControl(
  host: GodModeApp,
  opts?: { quiet?: boolean },
): Promise<void> {
  if (!host.client || !host.connected) return;

  const h = host as unknown as {
    missionControlLoading: boolean;
    missionControlError: string | null;
    missionControlData: MissionControlData | null;
  };

  if (!opts?.quiet) h.missionControlLoading = true;
  h.missionControlError = null;

  try {
    // Queue RPC is optional — may not exist yet
    let queueResult: { items: QueueItemRpc[]; counts: Record<string, number> } | null = null;
    try {
      queueResult = await host.client.request<{ items: QueueItemRpc[]; counts: Record<string, number> }>(
        "queue.list",
        { limit: 100 },
      );
    } catch {
      // queue not available yet — ignore
    }

    // subagents.list and coding.list were removed in the lean audit — gracefully degrade
    let subagentRuns: SerializedRun[] = [];
    let codingTasks: CodingTaskRpc[] = [];
    try {
      const subagentsResult = await host.client.request<{ runs: SerializedRun[]; activeCount: number; totalCount: number }>(
        "subagents.list",
        { limit: 200 },
      );
      subagentRuns = subagentsResult.runs ?? [];
    } catch {
      // method not registered — expected post-lean-audit
    }
    try {
      const codingListResult = await host.client.request<{ tasks: CodingTaskRpc[] }>("coding.list", {});
      codingTasks = codingListResult.tasks ?? [];
    } catch {
      // method not registered — expected post-lean-audit
    }

    const agents = mergeAgents(subagentRuns, codingTasks);

    // Merge queue items into agents list
    const queueItems = queueResult?.items ?? [];
    const pendingQueueItems: QueueItemRpc[] = [];
    let queueReviewCount = 0;

    for (const qi of queueItems) {
      if (qi.status === "processing") {
        agents.push({
          id: qi.id,
          type: "queue",
          task: qi.title,
          status: "active",
          model: null,
          startedAt: qi.startedAt ?? qi.createdAt,
          endedAt: null,
          error: qi.error,
          roleName: agentRoleName(qi.type, undefined, qi.personaHint),
          queueItemType: qi.type,
          outputPath: qi.result?.outputPath,
          sourceTaskId: qi.sourceTaskId,
          retryCount: qi.retryCount,
          prUrl: qi.result?.prUrl,
        });
      } else if (qi.status === "review") {
        queueReviewCount++;
        agents.push({
          id: qi.id,
          type: "queue",
          task: qi.title,
          status: "done",
          model: null,
          startedAt: qi.startedAt ?? qi.createdAt,
          endedAt: qi.completedAt ?? null,
          roleName: agentRoleName(qi.type, undefined, qi.personaHint),
          queueItemType: qi.type,
          outputPath: qi.result?.outputPath,
          sourceTaskId: qi.sourceTaskId,
          retryCount: qi.retryCount,
          prUrl: qi.result?.prUrl,
          isReview: true,
        });
      } else if (qi.status === "failed") {
        agents.push({
          id: qi.id,
          type: "queue",
          task: qi.title,
          status: "failed",
          model: null,
          startedAt: qi.startedAt ?? qi.createdAt,
          endedAt: qi.completedAt ?? null,
          error: qi.error,
          roleName: agentRoleName(qi.type, undefined, qi.personaHint),
          queueItemType: qi.type,
          outputPath: qi.result?.outputPath,
          sourceTaskId: qi.sourceTaskId,
          retryCount: qi.retryCount,
        });
      } else if (qi.status === "pending") {
        pendingQueueItems.push(qi);
      }
    }

    // Re-sort after adding queue items
    agents.sort((a, b) => {
      const order = { active: 0, queued: 1, failed: 2, done: 3 };
      const diff = order[a.status] - order[b.status];
      if (diff !== 0) return diff;
      return (b.startedAt ?? 0) - (a.startedAt ?? 0);
    });

    const queueDepthCount = pendingQueueItems.length;
    const stats = computeStats(agents, queueDepthCount, queueReviewCount);
    const activityFeed = buildActivityFeed(agents);

    // ── Delegation data — optional, gracefully degrades ──
    let swarmData: SwarmData = { projects: [], selectedProjectId: null, detail: null, feed: [], running: false };
    try {
      const swarmProjectsResult = await host.client.request<{ projects: SwarmProject[]; running: boolean }>(
        "godmode.delegation.projects",
        {},
      );
      if (swarmProjectsResult?.running && swarmProjectsResult.projects.length > 0) {
        const projects = swarmProjectsResult.projects;
        // Use previously selected project or pick the first active one
        const prevSelected = h.missionControlData?.swarm?.selectedProjectId;
        const selectedProjectId = prevSelected && projects.some(p => p.projectId === prevSelected)
          ? prevSelected
          : projects.find(p => p.status === "in_progress")?.projectId ?? projects[0].projectId;

        let detail: SwarmProjectDetail | null = null;
        let feed: SwarmFeedEvent[] = [];

        if (selectedProjectId) {
          try {
            detail = await host.client.request<SwarmProjectDetail>(
              "godmode.delegation.status",
              { projectId: selectedProjectId },
            );
          } catch { /* non-fatal */ }
          try {
            const feedResult = await host.client.request<{ events: SwarmFeedEvent[] }>(
              "godmode.delegation.feed",
              { projectId: selectedProjectId },
            );
            feed = feedResult?.events ?? [];
          } catch { /* non-fatal */ }
        }

        swarmData = { projects, selectedProjectId, detail, feed, running: true };
      }
    } catch {
      // delegation RPC not available — non-fatal
    }

    h.missionControlData = {
      agents,
      stats,
      activityFeed,
      lastRefreshedAt: Date.now(),
      queueItems: pendingQueueItems,
      swarm: swarmData,
    };
  } catch (err) {
    console.error("[MissionControl] load error:", err);
    h.missionControlError = err instanceof Error ? err.message : "Failed to load agent data";
  } finally {
    h.missionControlLoading = false;
  }
}

export async function cancelCodingTask(
  host: GodModeApp,
  taskId: string,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("coding.cancel", { taskId });
    host.showToast("Task cancelled", "success", 2000);
    await loadMissionControl(host);
  } catch (err) {
    host.showToast("Failed to cancel task", "error");
    console.error("[MissionControl] cancel error:", err);
  }
}

export async function approveQueueItem(
  host: GodModeApp,
  itemId: string,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request("queue.approve", { id: itemId }) as {
      item?: { personaHint?: string; title?: string };
    };
    const persona = result?.item?.personaHint;
    const title = result?.item?.title ?? "task";
    if (persona) {
      const personaName = persona.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      host.showToast(
        `Approved! How did ${personaName} do on "${title}"? Rate in Trust Tracker.`,
        "success",
        4000,
      );
    } else {
      host.showToast("Item approved", "success", 2000);
    }
    await loadMissionControl(host);
  } catch (err) {
    host.showToast("Failed to approve item", "error");
    console.error("[MissionControl] approve error:", err);
  }
}

export async function approveCodingTask(
  host: GodModeApp,
  taskId: string,
): Promise<boolean> {
  if (!host.client || !host.connected) return false;
  try {
    const result = await host.client.request("coding.approve", { taskId }) as { approved?: boolean };
    if (result?.approved) {
      host.showToast("Task approved", "success", 2000);
      await loadMissionControl(host);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function retryQueueItem(
  host: GodModeApp,
  itemId: string,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("queue.retry", { id: itemId });
    host.showToast("Retrying...", "success", 2000);
    await loadMissionControl(host);
  } catch (err) {
    host.showToast("Failed to retry", "error");
    console.error("[MissionControl] retry error:", err);
  }
}

export async function loadAgentDetail(
  host: GodModeApp,
  agent: AgentRunView,
): Promise<{ content: string; title: string; mimeType: string }> {
  if (agent.status === "failed") {
    const lines = [
      `# Failed: ${agent.task}`,
      "",
      `**Agent:** ${agent.roleName}`,
      `**Retries:** ${agent.retryCount ?? 0}/2`,
      "",
      "## Error",
      "```",
      agent.error ?? "Unknown error",
      "```",
      "",
      "## What to do",
      agent.retryCount && agent.retryCount >= 2
        ? "- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces."
        : "- Click **Retry** to attempt again with an improved prompt.",
      "- Or remove this item and create a new one with more context.",
    ];
    return { content: lines.join("\n"), title: `Failed: ${agent.task}`, mimeType: "text/markdown" };
  }

  if (agent.prUrl && host.client) {
    try {
      const result = await host.client.request<{ content: string }>("queue.prDiff", { prUrl: agent.prUrl });
      return { content: result.content, title: `PR: ${agent.task}`, mimeType: "text/markdown" };
    } catch {
      return { content: `# ${agent.task}\n\n[Open in GitHub](${agent.prUrl})`, title: agent.task, mimeType: "text/markdown" };
    }
  }

  if (agent.outputPath && host.client) {
    try {
      const result = await host.client.request<{ content: string }>("queue.readOutput", { path: agent.outputPath });
      return { content: result.content, title: agent.task, mimeType: "text/markdown" };
    } catch {
      return { content: `Output file not found: ${agent.outputPath}`, title: agent.task, mimeType: "text/plain" };
    }
  }

  return { content: `# ${agent.task}\n\nNo details available.`, title: agent.task, mimeType: "text/markdown" };
}

// ── Swarm actions ──

export async function selectSwarmProject(
  host: GodModeApp,
  projectId: string,
): Promise<void> {
  const h = host as unknown as {
    missionControlData: MissionControlData | null;
  };
  if (h.missionControlData?.swarm) {
    h.missionControlData = {
      ...h.missionControlData,
      swarm: { ...h.missionControlData.swarm, selectedProjectId: projectId },
    };
  }
  // Reload to fetch detail for the newly selected project
  await loadMissionControl(host, { quiet: true });
}

export async function steerSwarmAgent(
  host: GodModeApp,
  projectId: string,
  issueTitle: string,
  instructions: string,
): Promise<boolean> {
  if (!host.client || !host.connected) return false;
  try {
    const result = await host.client.request<{ success?: boolean; error?: string }>(
      "godmode.delegation.steer",
      { projectId, issueTitle, instructions },
    );
    if (result?.success) {
      host.showToast("Steering sent", "success", 2000);
      await loadMissionControl(host, { quiet: true });
      return true;
    }
    host.showToast(result?.error ?? "Failed to steer", "error");
    return false;
  } catch (err) {
    host.showToast("Failed to send steering", "error");
    console.error("[MissionControl] steer error:", err);
    return false;
  }
}

export { type QueueItemRpc, AGENT_ROLE_NAMES };
