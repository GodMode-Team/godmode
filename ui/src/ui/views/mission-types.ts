/**
 * Shared types for Mission Control views.
 *
 * Mission Control is the orchestration hub — it shows agent fleet status,
 * active/recent runs, native tasks, and a real-time activity feed.
 */

export type AgentStatus = "WORKING" | "IDLE" | "OFFLINE";

export type MissionAgent = {
  id: string;
  emoji: string;
  name: string;
  role: string;
  model?: string;
  workspace?: string;
  status: AgentStatus;
  activeSessions: number;
};

export type SubagentRun = {
  runId: string;
  childSessionKey: string;
  requesterSessionKey: string;
  task: string;
  label: string | null;
  model: string | null;
  spawnMode: "run" | "session";
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  endedReason: string | null;
  outcome: { status: "ok" | "error" | "timeout"; error: string | null } | null;
};

export type ActiveRun = {
  runId: string;
  sessionKey: string;
  agentName: string;
  agentEmoji: string;
  startedAt: number;
  durationMs: number;
  task?: string;
};

export type NativeTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project?: string;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt?: string;
  source: "chat" | "cron" | "import";
  /** Linked chat session key — set when user opens a session for a task */
  sessionId?: string | null;
};

export type FeedItem = {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details?: string;
};
