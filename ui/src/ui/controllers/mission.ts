/**
 * Mission Control Controller
 *
 * Loads real orchestration data from the gateway:
 * - Agent fleet from agents.list
 * - Active runs from agentLog.get (activeRuns) + subagents.list
 * - Native tasks from tasks.list
 * - Real-time feed from gateway events
 */

import type { GatewayBrowserClient } from "../gateway";
import type { AgentsListResult, GatewayAgentRow, SessionsListResult } from "../types";
import type {
  ActiveRun,
  FeedItem,
  MissionAgent,
  NativeTask,
  SubagentRun,
} from "../views/mission-types";

export type MissionState = {
  missionLoading: boolean;
  missionError: string | null;
  missionAgents: MissionAgent[];
  missionActiveRuns: ActiveRun[];
  missionSubagentRuns: SubagentRun[];
  missionTasks: NativeTask[];
  missionFeedItems: FeedItem[];
};

export type MissionHost = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  missionLoading: boolean;
  missionError: string | null;
  missionAgents: MissionAgent[];
  missionActiveRuns: ActiveRun[];
  missionSubagentRuns: SubagentRun[];
  missionTasks: NativeTask[];
  missionFeedItems: FeedItem[];
  agentsList?: AgentsListResult | null;
  workingSessions?: Set<string>;
  sessionsResult?: SessionsListResult | null;
};

// ─── Default State ───────────────────────────────────────────────

export function getDefaultMissionState(): MissionState {
  return {
    missionLoading: false,
    missionError: null,
    missionAgents: [],
    missionActiveRuns: [],
    missionSubagentRuns: [],
    missionTasks: [],
    missionFeedItems: [],
  };
}

// ─── Load Mission Data ───────────────────────────────────────────

export async function loadMission(host: MissionHost): Promise<void> {
  if (!host.client || !host.connected) {
    return;
  }
  host.missionLoading = true;
  host.missionError = null;

  try {
    // Fire all requests in parallel
    const [agentsRes, logRes, subagentsRes, tasksRes] = await Promise.all([
      host.client.request("agents.list", {}).catch(() => null),
      host.client.request("agentLog.get", {}).catch(() => null),
      host.client.request("subagents.list", { limit: 50 }).catch(() => null),
      host.client.request("tasks.list", { status: "pending" }).catch(() => null),
    ]);

    // Map agents
    const agentsPayload = agentsRes as { agents?: GatewayAgentRow[] } | null;
    if (agentsPayload?.agents) {
      host.missionAgents = mapGatewayAgents(
        agentsPayload.agents,
        host.workingSessions ?? new Set(),
      );
    }

    // Map active runs from agent log
    const logPayload = logRes as {
      activeRuns?: Array<{
        runId: string;
        sessionKey: string;
        startedAt: number;
        durationMs: number;
      }>;
    } | null;
    if (logPayload?.activeRuns) {
      host.missionActiveRuns = logPayload.activeRuns.map((run) => ({
        runId: run.runId,
        sessionKey: run.sessionKey,
        agentName: extractAgentName(run.sessionKey),
        agentEmoji: resolveAgentEmoji(run.sessionKey, host.missionAgents),
        startedAt: run.startedAt,
        durationMs: run.durationMs,
      }));
    }

    // Map subagent runs
    const subagentsPayload = subagentsRes as {
      runs?: SubagentRun[];
      activeCount?: number;
    } | null;
    if (subagentsPayload?.runs) {
      host.missionSubagentRuns = subagentsPayload.runs;
    }

    // Map native tasks
    const tasksPayload = tasksRes as { tasks?: NativeTask[] } | null;
    if (tasksPayload?.tasks) {
      host.missionTasks = tasksPayload.tasks;
    }
  } catch (err) {
    console.error("[Mission] Failed to load mission data:", err);
    host.missionError = String(err);
  } finally {
    host.missionLoading = false;
  }
}

// ─── Handlers ────────────────────────────────────────────────────

export async function handleMissionRefresh(host: MissionHost): Promise<void> {
  await loadMission(host);
}

export async function handleMissionTaskComplete(host: MissionHost, taskId: string): Promise<void> {
  if (!host.client || !host.connected) {
    return;
  }
  try {
    await host.client.request("tasks.update", {
      id: taskId,
      status: "complete",
      completedAt: new Date().toISOString(),
    });
    // Remove from local state
    host.missionTasks = host.missionTasks.filter((t) => t.id !== taskId);
    addMissionFeedItem(host, {
      agent: "You",
      action: "completed task",
      details: host.missionTasks.find((t) => t.id === taskId)?.title ?? taskId,
    });
  } catch (err) {
    console.error("[Mission] Failed to complete task:", err);
  }
}

export async function handleMissionCreateTask(
  host: MissionHost,
  title: string,
  priority: "high" | "medium" | "low" = "medium",
): Promise<void> {
  if (!host.client || !host.connected) {
    return;
  }
  try {
    const result = await host.client.request("tasks.create", {
      title,
      priority,
      source: "chat",
    });
    host.missionTasks = [result, ...host.missionTasks];
    addMissionFeedItem(host, {
      agent: "You",
      action: "created task",
      details: title,
    });
  } catch (err) {
    console.error("[Mission] Failed to create task:", err);
  }
}

// ─── Feed Management ─────────────────────────────────────────────

const MAX_FEED_ITEMS = 50;
let feedItemCounter = 0;

export function addMissionFeedItem(
  host: MissionHost,
  item: Omit<FeedItem, "id" | "timestamp">,
): void {
  const newItem: FeedItem = {
    id: `feed-${++feedItemCounter}-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...item,
  };
  host.missionFeedItems = [newItem, ...host.missionFeedItems].slice(0, MAX_FEED_ITEMS);
}

// ─── Gateway Event Handlers ──────────────────────────────────────

export function handleMissionAgentEvent(
  host: MissionHost,
  payload:
    | {
        stream?: string;
        sessionKey?: string;
        data?: Record<string, unknown>;
      }
    | undefined,
): void {
  if (!payload) {
    return;
  }

  const data = payload.data ?? {};
  const sessionKey = payload.sessionKey ?? "unknown";
  const agentName = extractAgentName(sessionKey);

  if (payload.stream === "tool") {
    const phase = typeof data.phase === "string" ? data.phase : "";
    const toolName = typeof data.name === "string" ? data.name : "tool";
    if (phase === "start") {
      addMissionFeedItem(host, {
        agent: agentName,
        action: "using",
        details: toolName,
      });
    }
    return;
  }

  if (payload.stream === "message") {
    const phase = typeof data.phase === "string" ? data.phase : "";
    if (phase === "start") {
      addMissionFeedItem(host, {
        agent: agentName,
        action: "thinking",
        details: resolveSessionDisplayName(sessionKey, host.sessionsResult),
      });
    }
    return;
  }

  if (payload.stream === "final") {
    addMissionFeedItem(host, {
      agent: agentName,
      action: "finished",
      details: resolveSessionDisplayName(sessionKey, host.sessionsResult),
    });
    return;
  }
}

export function handleMissionChatEvent(
  host: MissionHost,
  payload:
    | {
        state?: string;
        sessionKey?: string;
        runId?: string;
      }
    | undefined,
): void {
  if (!payload) {
    return;
  }

  const sessionKey = payload.sessionKey ?? "unknown";
  const agentName = extractAgentName(sessionKey);
  const displayName = resolveSessionDisplayName(sessionKey, host.sessionsResult);

  if (payload.state === "started") {
    addMissionFeedItem(host, { agent: agentName, action: "started", details: displayName });
  } else if (payload.state === "final") {
    addMissionFeedItem(host, { agent: agentName, action: "completed", details: displayName });
  } else if (payload.state === "error") {
    addMissionFeedItem(host, { agent: agentName, action: "error", details: displayName });
  }
}

export function updateMissionAgentStatus(host: MissionHost, workingSessions: Set<string>): void {
  const workingAgentIds = new Set<string>();
  for (const sessionKey of workingSessions) {
    const parts = sessionKey.split(":");
    const agentId = parts[0]?.toLowerCase();
    if (agentId) {
      workingAgentIds.add(agentId);
    }
  }

  host.missionAgents = host.missionAgents.map((agent) => ({
    ...agent,
    status:
      workingAgentIds.has(agent.id) || workingAgentIds.has(agent.name.toLowerCase())
        ? "WORKING"
        : "IDLE",
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────

const AGENT_EMOJI_MAP: Record<string, string> = {
  atlas: "\u269B\uFE0F",
  oracle: "\u{1F52E}",
  builder: "\u{1F528}",
  herald: "\u{1F4E2}",
  sentinel: "\u{1F6E1}\uFE0F",
  muse: "\u{1F3A8}",
  treasurer: "\u{1F4B0}",
  main: "\u269B\uFE0F",
};

const AGENT_ROLE_MAP: Record<string, string> = {
  atlas: "Primary",
  oracle: "Research",
  builder: "Technical",
  herald: "Communications",
  sentinel: "Security",
  muse: "Creative",
  treasurer: "Finance",
  main: "Primary",
};

function extractAgentName(sessionKey: string): string {
  const parts = sessionKey.split(":");
  const possibleAgent = parts[0]?.toLowerCase() ?? "";
  const nameMap: Record<string, string> = {
    atlas: "Atlas",
    oracle: "Oracle",
    builder: "Builder",
    herald: "Herald",
    sentinel: "Sentinel",
    muse: "Muse",
    treasurer: "Treasurer",
    main: "Atlas",
    agent: parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : "Agent",
  };
  return nameMap[possibleAgent] ?? possibleAgent.charAt(0).toUpperCase() + possibleAgent.slice(1);
}

function resolveAgentEmoji(sessionKey: string, agents: MissionAgent[]): string {
  const parts = sessionKey.split(":");
  const agentId = parts[0]?.toLowerCase() ?? "";
  const match = agents.find((a) => a.id === agentId);
  if (match) {
    return match.emoji;
  }
  return AGENT_EMOJI_MAP[agentId] ?? "\u{1F916}";
}

function resolveSessionDisplayName(
  sessionKey: string,
  sessionsResult: SessionsListResult | null | undefined,
): string {
  if (sessionsResult?.sessions) {
    const session = sessionsResult.sessions.find((s) => s.key === sessionKey);
    if (session?.displayName) {
      return session.displayName;
    }
  }
  const parts = sessionKey.split(":");
  const lastPart = parts[parts.length - 1] ?? sessionKey;
  const cleaned = lastPart.replace(/-[a-f0-9]{6,}$/i, "");
  return cleaned || sessionKey;
}

function mapGatewayAgents(
  gatewayAgents: GatewayAgentRow[],
  workingSessions: Set<string>,
): MissionAgent[] {
  const workingAgentIds = new Set<string>();
  for (const sessionKey of workingSessions) {
    const parts = sessionKey.split(":");
    const agentId = parts[0]?.toLowerCase();
    if (agentId) {
      workingAgentIds.add(agentId);
    }
  }

  return gatewayAgents.map((agent) => {
    const id = agent.id.toLowerCase();
    const name = agent.identity?.name ?? agent.name ?? agent.id;
    const emoji = agent.identity?.emoji ?? AGENT_EMOJI_MAP[id] ?? "\u{1F916}";
    const role = AGENT_ROLE_MAP[id] ?? "Agent";
    const isWorking = workingAgentIds.has(id);

    return {
      id,
      emoji,
      name,
      role,
      model: agent.model ?? undefined,
      workspace: agent.workspace ?? undefined,
      status: isWorking ? "WORKING" : "IDLE",
      activeSessions: 0,
    };
  });
}
