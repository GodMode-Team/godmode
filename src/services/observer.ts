/**
 * observer.ts — User pattern learning for Proactive Intelligence.
 *
 * Reads local state files every 15 minutes to build a behavioral model.
 * No external API calls — purely local file analysis.
 *
 * Detects:
 *   - Task completion patterns (stuck tasks, rolling completion rate)
 *   - Goal progress (stalled goals)
 *   - Coding session patterns (duration, repos, tools)
 *   - Agent log activity (skill usage, errors, active hours)
 *   - Feature adoption (enabled but unused features)
 */

import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR, MEMORY_DIR, localDateString } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

export type Challenge = {
  type: "stuck-task" | "low-completion" | "underused-feature" | "missing-integration" | "recurring-error" | "stalled-goal";
  description: string;
  severity: "low" | "medium" | "high";
  detectedAt: number;
  context: Record<string, unknown>;
};

export type UserPatterns = {
  updatedAt: number;

  taskPatterns: {
    completionRate7d: number;       // 0–1
    avgTasksPerDay: number;
    stuckTasks: Array<{ title: string; daysPending: number }>;
    commonProjects: string[];
  };

  codingPatterns: {
    avgSessionDuration: number;     // minutes
    topRepos: string[];
    avgToolUsesPerSession: number;
    totalSessionsLast7d: number;
  };

  activityPatterns: {
    activeDaysLast7d: number;
    totalEntriesLast7d: number;
    frequentSkills: Array<{ skill: string; count: number }>;
    errorCount7d: number;
  };

  goalStatus: {
    totalGoals: number;
    stalledGoals: Array<{ title: string; daysSinceProgress: number }>;
  };

  challenges: Challenge[];
};

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

// ── Constants ──────────────────────────────────────────────────────────

const PATTERNS_FILE = join(DATA_DIR, "user-patterns.json");
const TASKS_FILE = join(DATA_DIR, "tasks.json");
const GOALS_FILE = join(DATA_DIR, "goals.json");
const CC_SYNC_FILE = join(DATA_DIR, "claude-code-sync.json");
const AGENT_LOG_DIR = join(MEMORY_DIR, "agent-log");

// ── State persistence ──────────────────────────────────────────────────

export async function readUserPatterns(): Promise<UserPatterns | null> {
  try {
    const raw = await readFile(PATTERNS_FILE, "utf-8");
    return JSON.parse(raw) as UserPatterns;
  } catch {
    return null;
  }
}

async function writeUserPatterns(patterns: UserPatterns): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PATTERNS_FILE, JSON.stringify(patterns, null, 2), "utf-8");
}

// ── Helpers ────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateString(d);
}

async function safeReadJson<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ── Task Analysis ──────────────────────────────────────────────────────

type TaskEntry = {
  title: string;
  status: string;
  createdAt?: string | number;
  completedAt?: string | number;
  briefSection?: string;
  project?: string;
};

async function analyzeTaskPatterns(): Promise<UserPatterns["taskPatterns"] & { challenges: Challenge[] }> {
  const challenges: Challenge[] = [];
  const result = {
    completionRate7d: 0,
    avgTasksPerDay: 0,
    stuckTasks: [] as Array<{ title: string; daysPending: number }>,
    commonProjects: [] as string[],
    challenges,
  };

  const data = await safeReadJson<{ tasks?: TaskEntry[] }>(TASKS_FILE);
  if (!data?.tasks || !Array.isArray(data.tasks)) return result;

  const now = Date.now();
  const sevenDaysMs = 7 * 86_400_000;
  const threeDaysMs = 3 * 86_400_000;

  // Recent tasks (last 7 days)
  const recentTasks = data.tasks.filter((t) => {
    const created = typeof t.createdAt === "string" ? new Date(t.createdAt).getTime() : (t.createdAt ?? 0);
    return now - created < sevenDaysMs;
  });

  const completed = recentTasks.filter((t) => t.status === "completed" || t.status === "done");
  const total = recentTasks.length;

  result.completionRate7d = total > 0 ? completed.length / total : 0;
  result.avgTasksPerDay = total / 7;

  // Stuck tasks: pending > 3 days
  const pending = data.tasks.filter((t) => t.status === "pending" || t.status === "active");
  for (const task of pending) {
    const created = typeof task.createdAt === "string" ? new Date(task.createdAt).getTime() : (task.createdAt ?? now);
    const age = now - created;
    if (age > threeDaysMs) {
      const daysPending = Math.floor(age / 86_400_000);
      result.stuckTasks.push({ title: task.title, daysPending });

      if (daysPending > 7) {
        challenges.push({
          type: "stuck-task",
          description: `"${task.title}" has been pending for ${daysPending} days`,
          severity: daysPending > 14 ? "high" : "medium",
          detectedAt: now,
          context: { taskTitle: task.title, daysPending },
        });
      }
    }
  }

  // Low completion rate challenge
  if (total >= 3 && result.completionRate7d < 0.4) {
    challenges.push({
      type: "low-completion",
      description: `Task completion rate is ${Math.round(result.completionRate7d * 100)}% over the last 7 days (${completed.length}/${total})`,
      severity: result.completionRate7d < 0.2 ? "high" : "medium",
      detectedAt: now,
      context: { rate: result.completionRate7d, completed: completed.length, total },
    });
  }

  // Common projects
  const projectCounts = new Map<string, number>();
  for (const task of data.tasks) {
    const project = task.project || task.briefSection || "uncategorized";
    projectCounts.set(project, (projectCounts.get(project) ?? 0) + 1);
  }
  result.commonProjects = [...projectCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  return result;
}

// ── Goal Analysis ──────────────────────────────────────────────────────

type GoalEntry = {
  title: string;
  status?: string;
  updatedAt?: string | number;
  createdAt?: string | number;
  completedAt?: string | number;
};

async function analyzeGoals(): Promise<UserPatterns["goalStatus"] & { challenges: Challenge[] }> {
  const challenges: Challenge[] = [];
  const result = {
    totalGoals: 0,
    stalledGoals: [] as Array<{ title: string; daysSinceProgress: number }>,
    challenges,
  };

  const data = await safeReadJson<{ goals?: GoalEntry[] }>(GOALS_FILE);
  if (!data?.goals || !Array.isArray(data.goals)) return result;

  const active = data.goals.filter((g) => g.status !== "completed" && g.status !== "done");
  result.totalGoals = active.length;
  const now = Date.now();

  for (const goal of active) {
    const lastUpdate = typeof goal.updatedAt === "string"
      ? new Date(goal.updatedAt).getTime()
      : (goal.updatedAt ?? (typeof goal.createdAt === "string" ? new Date(goal.createdAt).getTime() : (goal.createdAt ?? now)));
    const daysSince = Math.floor((now - lastUpdate) / 86_400_000);

    if (daysSince > 7) {
      result.stalledGoals.push({ title: goal.title, daysSinceProgress: daysSince });
      challenges.push({
        type: "stalled-goal",
        description: `Goal "${goal.title}" hasn't had progress in ${daysSince} days`,
        severity: daysSince > 14 ? "high" : "medium",
        detectedAt: now,
        context: { goalTitle: goal.title, daysSinceProgress: daysSince },
      });
    }
  }

  return result;
}

// ── Coding Pattern Analysis ────────────────────────────────────────────

type CCSyncEntry = {
  sessionId: string;
  project?: string;
  duration?: number;
  toolUses?: number;
  filesRead?: string[];
  filesWritten?: string[];
  startedAt?: number;
};

type CCSyncState = {
  syncedSessions?: Record<string, boolean>;
  entries?: CCSyncEntry[];
};

async function analyzeCodingPatterns(): Promise<UserPatterns["codingPatterns"]> {
  const result = {
    avgSessionDuration: 0,
    topRepos: [] as string[],
    avgToolUsesPerSession: 0,
    totalSessionsLast7d: 0,
  };

  const data = await safeReadJson<CCSyncState>(CC_SYNC_FILE);
  if (!data?.entries || !Array.isArray(data.entries)) return result;

  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const recent = data.entries.filter((e) => (e.startedAt ?? 0) > sevenDaysAgo);

  result.totalSessionsLast7d = recent.length;
  if (recent.length === 0) return result;

  // Average duration
  const durations = recent.map((e) => e.duration ?? 0).filter((d) => d > 0);
  result.avgSessionDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 60_000)
    : 0;

  // Average tool uses
  const toolUses = recent.map((e) => e.toolUses ?? 0);
  result.avgToolUsesPerSession = Math.round(
    toolUses.reduce((a, b) => a + b, 0) / recent.length,
  );

  // Top repos
  const repoCounts = new Map<string, number>();
  for (const entry of recent) {
    const repo = entry.project ?? "unknown";
    repoCounts.set(repo, (repoCounts.get(repo) ?? 0) + 1);
  }
  result.topRepos = [...repoCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  return result;
}

// ── Agent Log Analysis ─────────────────────────────────────────────────

type AgentLogEntry = {
  type?: string;
  action?: string;
  skill?: string;
  error?: string;
  timestamp?: string | number;
};

type AgentLogDay = {
  date: string;
  activity?: AgentLogEntry[];
  completed?: AgentLogEntry[];
  errors?: AgentLogEntry[];
};

async function analyzeAgentLog(): Promise<UserPatterns["activityPatterns"] & { challenges: Challenge[] }> {
  const challenges: Challenge[] = [];
  const result = {
    activeDaysLast7d: 0,
    totalEntriesLast7d: 0,
    frequentSkills: [] as Array<{ skill: string; count: number }>,
    errorCount7d: 0,
    challenges,
  };

  const skillCounts = new Map<string, number>();
  const errorMessages = new Map<string, number>();

  for (let i = 0; i < 7; i++) {
    const dateStr = daysAgo(i);
    const logPath = join(AGENT_LOG_DIR, `${dateStr}.json`);
    const dayLog = await safeReadJson<AgentLogDay>(logPath);
    if (!dayLog) continue;

    result.activeDaysLast7d++;

    const allEntries = [
      ...(dayLog.activity ?? []),
      ...(dayLog.completed ?? []),
    ];
    result.totalEntriesLast7d += allEntries.length;

    // Count skills
    for (const entry of allEntries) {
      if (entry.skill) {
        skillCounts.set(entry.skill, (skillCounts.get(entry.skill) ?? 0) + 1);
      }
    }

    // Count errors
    const errors = dayLog.errors ?? [];
    result.errorCount7d += errors.length;
    for (const err of errors) {
      const msg = err.error ?? "unknown";
      const key = msg.slice(0, 100);
      errorMessages.set(key, (errorMessages.get(key) ?? 0) + 1);
    }
  }

  // Frequent skills
  result.frequentSkills = [...skillCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  // Recurring error challenge
  for (const [msg, count] of errorMessages) {
    if (count >= 3) {
      challenges.push({
        type: "recurring-error",
        description: `Error appeared ${count} times in 7 days: "${msg.slice(0, 80)}"`,
        severity: count >= 5 ? "high" : "medium",
        detectedAt: Date.now(),
        context: { errorMessage: msg, count },
      });
    }
  }

  return result;
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Run a full observer cycle: analyze all local data sources
 * and write updated user patterns to disk.
 * Returns the pattern model and number of new challenges.
 */
export async function runObserverCycle(logger: Logger): Promise<{
  patterns: UserPatterns;
  newChallenges: number;
}> {
  const allChallenges: Challenge[] = [];

  // Run all analyses in parallel
  const [taskResult, goalResult, codingResult, activityResult] = await Promise.all([
    analyzeTaskPatterns().catch((err) => {
      logger.warn(`[Observer] Task analysis failed: ${String(err)}`);
      return {
        completionRate7d: 0, avgTasksPerDay: 0, stuckTasks: [],
        commonProjects: [], challenges: [] as Challenge[],
      };
    }),
    analyzeGoals().catch((err) => {
      logger.warn(`[Observer] Goal analysis failed: ${String(err)}`);
      return { totalGoals: 0, stalledGoals: [], challenges: [] as Challenge[] };
    }),
    analyzeCodingPatterns().catch((err) => {
      logger.warn(`[Observer] Coding analysis failed: ${String(err)}`);
      return { avgSessionDuration: 0, topRepos: [], avgToolUsesPerSession: 0, totalSessionsLast7d: 0 };
    }),
    analyzeAgentLog().catch((err) => {
      logger.warn(`[Observer] Agent log analysis failed: ${String(err)}`);
      return {
        activeDaysLast7d: 0, totalEntriesLast7d: 0, frequentSkills: [],
        errorCount7d: 0, challenges: [] as Challenge[],
      };
    }),
  ]);

  allChallenges.push(
    ...taskResult.challenges,
    ...goalResult.challenges,
    ...activityResult.challenges,
  );

  const patterns: UserPatterns = {
    updatedAt: Date.now(),
    taskPatterns: {
      completionRate7d: taskResult.completionRate7d,
      avgTasksPerDay: taskResult.avgTasksPerDay,
      stuckTasks: taskResult.stuckTasks,
      commonProjects: taskResult.commonProjects,
    },
    codingPatterns: codingResult,
    activityPatterns: {
      activeDaysLast7d: activityResult.activeDaysLast7d,
      totalEntriesLast7d: activityResult.totalEntriesLast7d,
      frequentSkills: activityResult.frequentSkills,
      errorCount7d: activityResult.errorCount7d,
    },
    goalStatus: {
      totalGoals: goalResult.totalGoals,
      stalledGoals: goalResult.stalledGoals,
    },
    challenges: allChallenges,
  };

  await writeUserPatterns(patterns);
  logger.info(
    `[Observer] Cycle complete: ${allChallenges.length} challenges, ` +
    `${patterns.taskPatterns.stuckTasks.length} stuck tasks, ` +
    `${patterns.goalStatus.stalledGoals.length} stalled goals`,
  );

  return { patterns, newChallenges: allChallenges.length };
}
