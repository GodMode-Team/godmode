import { readFile } from "node:fs/promises";
import { execFile as execFileCb } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import { promisify } from "node:util";
import { DATA_DIR, localDateString } from "../data-paths.js";
import {
  findWorkspaceById,
  readWorkspaceConfig,
  detectWorkspaceFromText,
  type WorkspaceConfigEntry,
} from "../lib/workspaces-config.js";
import { withFileLock } from "../lib/sdk-helpers.js";
import type { GatewayRequestHandler } from "../types/plugin-api.js";

const execFile = promisify(execFileCb);

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const TASKS_FILE = join(DATA_DIR, "tasks.json");

const LOCK_OPTIONS = {
  retries: {
    retries: 30,
    factor: 1.35,
    minTimeout: 20,
    maxTimeout: 250,
    randomize: true,
  },
  stale: 20_000,
};
/** Team tasks are synced to this file inside the workspace directory. */
const TEAM_TASKS_FILENAME = ".godmode/tasks.json";

type NativeTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  /** Resolved workspace ID for this task's project */
  projectId?: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
  source: "chat" | "cron" | "import";
  /** Linked chat session key for task-session linking */
  sessionId: string | null;
  /** Section heading from the daily brief this task was imported from */
  briefSection?: string | null;
};

type TasksData = {
  tasks: NativeTask[];
  archived?: NativeTask[];
  updatedAt: string | null;
};

async function readTasksUnsafe(): Promise<TasksData> {
  try {
    const raw = await readFile(TASKS_FILE, "utf-8");
    const data = JSON.parse(raw) as TasksData;
    // Strip legacy fields for backward compat
    for (const task of data.tasks) {
      const legacy = task as Record<string, unknown>;
      delete legacy.carryOver;
      delete legacy.userEdited;
    }
    data.archived = data.archived ?? [];
    return data;
  } catch {
    return { tasks: [], archived: [], updatedAt: null };
  }
}

async function writeTasksUnsafe(data: TasksData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await secureMkdir(DATA_DIR);
  await secureWriteFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

export async function readTasks(): Promise<TasksData> {
  return withFileLock(TASKS_FILE, LOCK_OPTIONS, async () => readTasksUnsafe());
}

export async function updateTasks<T>(
  updater: (data: TasksData) => Promise<T> | T,
): Promise<{ data: TasksData; result: T }> {
  return withFileLock(TASKS_FILE, LOCK_OPTIONS, async () => {
    const data = await readTasksUnsafe();
    const result = await updater(data);
    await writeTasksUnsafe(data);
    return { data, result };
  });
}

export async function writeTasks(data: TasksData): Promise<void> {
  await withFileLock(TASKS_FILE, LOCK_OPTIONS, async () => writeTasksUnsafe(data));
}

function todayDateStr(): string {
  return localDateString();
}

// ── One-time workspace backfill ──────────────────────────────────────
// Fills in missing project/projectId on tasks that have workspace keywords
// in their title (e.g. "TRP: Build quiz funnel" → project: "TRP", projectId: "trp").
let workspaceBackfillDone = false;

async function backfillWorkspaceLinks(): Promise<void> {
  if (workspaceBackfillDone) return;
  workspaceBackfillDone = true;

  try {
    const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
    if (!wsConfig.workspaces.length) {
      console.log("[tasks] backfill: no workspaces configured, skipping");
      return;
    }

    const { result: patched } = await updateTasks((data) => {
      let count = 0;
      for (const task of data.tasks) {
        if (task.project || task.projectId) continue;
        const detection = detectWorkspaceFromText(wsConfig, task.title);
        if (detection.workspaceId && detection.score >= 2) {
          const ws = wsConfig.workspaces.find((w) => w.id === detection.workspaceId);
          task.project = ws?.name ?? null;
          task.projectId = detection.workspaceId;
          count++;
        }
      }
      return count;
    });
    console.log(`[tasks] backfill: linked ${patched} tasks to workspaces`);
  } catch (err) {
    console.error("[tasks] backfill failed:", err);
    // Non-fatal — backfill will retry next time
    workspaceBackfillDone = false;
  }
}

/**
 * Reconcile orphaned queue items — if a queue item has a sourceTaskId that
 * doesn't match any task, re-create the task so it shows up in task views.
 * This fixes the case where daily brief regeneration or cleanup deletes tasks
 * that still have active (processing/review) queue work.
 */
const listTasks: GatewayRequestHandler = async ({ params, respond }) => {
  // Lazy one-time backfill: link unlinked tasks to workspaces
  if (!workspaceBackfillDone) {
    await backfillWorkspaceLinks();
  }

  const { status, project, dueDate, dueBefore, dueAfter } = params as {
    status?: string;
    project?: string;
    dueDate?: string;
    dueBefore?: string;
    dueAfter?: string;
  };
  const data = await readTasks();

  let filtered = data.tasks;

  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }
  if (project) {
    filtered = filtered.filter((t) => t.project === project);
  }
  if (dueDate) {
    filtered = filtered.filter((t) => t.dueDate === dueDate);
  }
  if (dueBefore) {
    filtered = filtered.filter((t) => t.dueDate != null && t.dueDate < dueBefore);
  }
  if (dueAfter) {
    filtered = filtered.filter((t) => t.dueDate != null && t.dueDate > dueAfter);
  }

  respond(true, { tasks: filtered, updatedAt: data.updatedAt });
};

const todayTasks: GatewayRequestHandler = async ({ params, respond }) => {
  const { date, includeCompleted } = params as { date?: string; includeCompleted?: boolean };
  const data = await readTasks();

  const today = date || todayDateStr();
  const pending = data.tasks.filter(
    (t) => t.status === "pending" && t.dueDate != null && t.dueDate <= today,
  );
  if (!includeCompleted) {
    respond(true, { tasks: pending });
    return;
  }
  const completedToday = data.tasks.filter((t) => {
    if (t.status !== "complete" || !t.completedAt) return false;
    return t.completedAt.slice(0, 10) === today;
  });
  respond(true, { tasks: [...pending, ...completedToday] });
};

const upcomingTasks: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  const data = await readTasks();
  const today = date || todayDateStr();
  const tasks = data.tasks.filter(
    (t) => t.status === "pending" && t.dueDate != null && t.dueDate > today,
  );
  respond(true, { tasks });
};

const getTask: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
  }
  const data = await readTasks();
  const task = data.tasks.find((t) => t.id === id);
  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }
  respond(true, task);
};

const createTask: GatewayRequestHandler = async ({ params, respond }) => {
  // Runtime type validation before cast
  if (params.title !== undefined && typeof params.title !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "title must be a string" });
    return;
  }
  if (params.project !== undefined && params.project !== null && typeof params.project !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "project must be a string" });
    return;
  }
  if (params.dueDate !== undefined && params.dueDate !== null && typeof params.dueDate !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "dueDate must be a string" });
    return;
  }
  if (params.priority !== undefined && typeof params.priority !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "priority must be a string" });
    return;
  }
  if (params.priority !== undefined && !["high", "medium", "low"].includes(params.priority as string)) {
    respond(false, null, { code: "INVALID_REQUEST", message: `Invalid priority "${params.priority}". Must be "high", "medium", or "low".` });
    return;
  }
  if (params.source !== undefined && typeof params.source !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "source must be a string" });
    return;
  }
  if (params.source !== undefined && !["chat", "cron", "import"].includes(params.source as string)) {
    respond(false, null, { code: "INVALID_REQUEST", message: `Invalid source "${params.source}". Must be "chat", "cron", or "import".` });
    return;
  }

  const { title, project, dueDate, priority, source } = params as {
    title?: string;
    project?: string | null;
    dueDate?: string | null;
    priority?: "high" | "medium" | "low";
    source?: "chat" | "cron" | "import";
  };
  if (!title) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task title" });
    return;
  }

  // Resolve project to a real workspace — never store invented names
  let resolvedProject: string | null = null;
  let projectId: string | null = null;
  if (project) {
    try {
      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const normalizedProject = project.trim().toLowerCase();
      const match = config.workspaces.find(
        (ws) =>
          ws.id === normalizedProject ||
          ws.name.toLowerCase() === normalizedProject ||
          ws.keywords.some((kw) => kw.toLowerCase() === normalizedProject),
      );
      if (match) {
        resolvedProject = match.name; // canonical workspace name
        projectId = match.id;
      }
      // If no match, fall back to keyword detection from title
      if (!match) {
        const detection = detectWorkspaceFromText(config, title);
        if (detection.workspaceId && detection.score >= 2) {
          const ws = config.workspaces.find((w) => w.id === detection.workspaceId);
          if (ws) {
            resolvedProject = ws.name;
            projectId = ws.id;
          }
        }
      }
    } catch {
      // Non-fatal — project stays null
    }
  } else {
    // No project provided — try to detect from title
    try {
      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const detection = detectWorkspaceFromText(config, title);
      if (detection.workspaceId && detection.score >= 2) {
        const ws = config.workspaces.find((w) => w.id === detection.workspaceId);
        if (ws) {
          resolvedProject = ws.name;
          projectId = ws.id;
        }
      }
    } catch {
      // Non-fatal
    }
  }

  const task: NativeTask = {
    id: randomUUID(),
    title,
    status: "pending",
    project: resolvedProject,
    projectId,
    dueDate: dueDate ?? null,
    priority: priority ?? "medium",
    createdAt: new Date().toISOString(),
    completedAt: null,
    source: source ?? "chat",
    sessionId: null,
  };

  await updateTasks((data) => {
    data.tasks.push(task);
    return task;
  });
  respond(true, task);

  // Async team sync if this task belongs to a team workspace
  triggerTeamSyncIfNeeded(task.project);
};

const updateTask: GatewayRequestHandler = async ({ params, respond }) => {
  // Runtime type validation before cast
  if (params.id !== undefined && typeof params.id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id must be a string" });
    return;
  }
  if (params.title !== undefined && typeof params.title !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "title must be a string" });
    return;
  }
  if (params.status !== undefined && typeof params.status !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "status must be a string" });
    return;
  }
  if (params.priority !== undefined && typeof params.priority !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "priority must be a string" });
    return;
  }
  if (params.project !== undefined && params.project !== null && typeof params.project !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "project must be a string" });
    return;
  }
  if (params.dueDate !== undefined && params.dueDate !== null && typeof params.dueDate !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "dueDate must be a string" });
    return;
  }
  if (params.source !== undefined && typeof params.source !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "source must be a string" });
    return;
  }

  const { id, ...updates } = params as { id?: string } & Partial<NativeTask>;
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
  }

  // If project is being updated, resolve to a real workspace name
  if ("project" in updates && updates.project) {
    try {
      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const normalizedProject = updates.project.trim().toLowerCase();
      const match = config.workspaces.find(
        (ws) =>
          ws.id === normalizedProject ||
          ws.name.toLowerCase() === normalizedProject ||
          ws.keywords.some((kw) => kw.toLowerCase() === normalizedProject),
      );
      if (match) {
        updates.project = match.name;
        (updates as Record<string, unknown>).projectId = match.id;
      } else {
        // Unknown project name — don't store it
        updates.project = null;
        (updates as Record<string, unknown>).projectId = null;
      }
    } catch {
      // Non-fatal — leave as-is
    }
  }

  // Runtime validation for enum fields
  if ("status" in updates && updates.status !== undefined) {
    if (updates.status !== "pending" && updates.status !== "complete") {
      respond(false, null, { code: "INVALID_REQUEST", message: `Invalid status "${updates.status}". Must be "pending" or "complete".` });
      return;
    }
  }
  if ("priority" in updates && updates.priority !== undefined) {
    if (!["high", "medium", "low"].includes(updates.priority)) {
      respond(false, null, { code: "INVALID_REQUEST", message: `Invalid priority "${updates.priority}". Must be "high", "medium", or "low".` });
      return;
    }
  }
  if ("source" in updates && updates.source !== undefined) {
    if (!["chat", "cron", "import"].includes(updates.source)) {
      respond(false, null, { code: "INVALID_REQUEST", message: `Invalid source "${updates.source}".` });
      return;
    }
  }

  const { result: task } = await updateTasks((data) => {
    const idx = data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const task = data.tasks[idx];
    const allowedKeys: (keyof NativeTask)[] = [
      "title",
      "status",
      "project",
      "projectId",
      "dueDate",
      "priority",
      "completedAt",
      "source",
      "sessionId",
      "briefSection",
    ];
    for (const key of allowedKeys) {
      if (key in updates) {
        (task as Record<string, unknown>)[key] = (updates as Record<string, unknown>)[key];
      }
    }
    if (updates.status === "complete" && !task.completedAt) {
      task.completedAt = new Date().toISOString();
    }
    data.tasks[idx] = task;
    return task;
  });

  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }

  // Sync brief checkbox when task status changes (complete or un-complete).
  // Only updates the specific task that was changed — brief is authoritative
  // for all other checkboxes.
  if (updates.status === "complete" || updates.status === "pending") {
    try {
      const { syncBriefFromTasks } = await import("./daily-brief.js");
      const syncDate = task.dueDate || todayDateStr();
      await syncBriefFromTasks(syncDate, { taskTitle: task.title });
    } catch {
      // Brief sync is best-effort; don't fail the task update
    }
  }

  respond(true, task);

  // Async team sync if this task belongs to a team workspace
  triggerTeamSyncIfNeeded(task.project);
};

const deleteTask: GatewayRequestHandler = async ({ params, respond }) => {
  const { id, force } = params as { id?: string; force?: boolean };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
  }
  // Guard: don't delete tasks with active or reviewable queue work
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const queueState = await readQueueState();
    const activeQueueItem = queueState.items.find(
      (qi) => qi.sourceTaskId === id && qi.status !== "done" && qi.status !== "failed",
    );
    if (activeQueueItem) {
      // Review items always block — user needs to approve/reject first
      if (activeQueueItem.status === "review") {
        respond(false, null, {
          code: "HAS_REVIEW_QUEUE_ITEM",
          message: `Cannot delete — task has a queue result waiting for your review. Approve or reject it first, then delete the task.`,
        });
        return;
      }
      // Other active items (pending, processing) block unless force=true
      if (!force) {
        respond(false, null, {
          code: "HAS_ACTIVE_QUEUE_ITEM",
          message: `Cannot delete — task has active queue work (status: ${activeQueueItem.status}). Use force=true to override.`,
        });
        return;
      }
    }
  } catch {
    // Queue state unavailable — allow deletion
  }

  const { result: removed } = await updateTasks((data) => {
    const idx = data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    return data.tasks.splice(idx, 1)[0];
  });

  if (!removed) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }
  respond(true, removed);
};

const byProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { project, projectId } = params as { project?: string; projectId?: string };
  if (!project && !projectId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing project name or projectId" });
    return;
  }
  const data = await readTasks();
  const tasks = data.tasks.filter((t) => {
    if (projectId && t.projectId) return t.projectId === projectId;
    return t.project === project;
  });
  respond(true, { tasks, updatedAt: data.updatedAt });
};

/**
 * tasks.openSession — Opens (or creates) a linked chat session for a task.
 *
 * If the task already has a sessionId, returns it.
 * Otherwise, generates a new session key (webchat format), stores it on
 * the task, and returns it. The UI navigates to the returned session key.
 *
 * When creating a new session for a task that has agent output from a queue
 * item, includes the output content so the frontend can seed the session.
 */
const openSession: GatewayRequestHandler = async ({ params, respond }) => {
  const { taskId } = params as { taskId?: string };
  if (!taskId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing taskId" });
    return;
  }

  let task: NativeTask | null = null;
  let created = false;
  let sessionId: string | null = null;

  const { result } = await updateTasks((data) => {
    const found = data.tasks.find((t) => t.id === taskId);
    if (!found) return { task: null, created: false, sessionId: null as string | null };

    let wasCreated = false;
    let sid = found.sessionId;

    if (!sid) {
      const uuid = randomUUID();
      sid = `agent:main:webchat-${uuid.slice(0, 8)}`;
      found.sessionId = sid;
      wasCreated = true;
    }

    return { task: found, created: wasCreated, sessionId: sid };
  });

  task = result.task;
  created = result.created;
  sessionId = result.sessionId;

  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }

  // Always check for queue output — the frontend will seed the session
  // if the chat history is empty (handles both new and pre-existing empty sessions)
  let queueOutput: string | null = null;
  let agentPrompt: string | null = null;
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const queueState = await readQueueState();
    const queueItem = queueState.items.find(
      (qi) => qi.sourceTaskId === taskId &&
        (qi.result?.outputPath || qi.status === "review" || qi.status === "done"),
    );
    if (queueItem) {
      agentPrompt = queueItem.agentPrompt ?? null;
      if (queueItem.result?.outputPath) {
        queueOutput = await readFile(queueItem.result.outputPath, "utf-8");
      }
    }
  } catch {
    // Non-fatal — session will just be empty
  }

  respond(true, { sessionId, created, task, queueOutput, agentPrompt });
};

/**
 * tasks.linkSession — Manually links an existing session to a task.
 */
const linkSession: GatewayRequestHandler = async ({ params, respond }) => {
  const { taskId, sessionId } = params as { taskId?: string; sessionId?: string };
  if (!taskId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing taskId" });
    return;
  }
  if (!sessionId || typeof sessionId !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or invalid sessionId" });
    return;
  }

  const { result: task } = await updateTasks((data) => {
    const found = data.tasks.find((t) => t.id === taskId);
    if (!found) return null;
    found.sessionId = sessionId;
    return found;
  });

  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }
  respond(true, { taskId, sessionId, task });
};

// ---------------------------------------------------------------------------
// Team task sync
// ---------------------------------------------------------------------------

type TeamTaskEntry = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
};

type TeamTasksFile = {
  tasks: TeamTaskEntry[];
  syncedAt: string;
};

function toTeamTask(task: NativeTask): TeamTaskEntry {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    project: task.project,
    dueDate: task.dueDate,
    priority: task.priority,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    updatedAt: task.completedAt ?? task.createdAt,
  };
}

async function readTeamTasksFile(teamTasksPath: string): Promise<TeamTasksFile> {
  try {
    const raw = await readFile(teamTasksPath, "utf-8");
    return JSON.parse(raw) as TeamTasksFile;
  } catch {
    return { tasks: [], syncedAt: new Date().toISOString() };
  }
}

/**
 * Merge local tasks with remote team tasks using last-updated-wins strategy.
 * Deduplication is by task id.
 */
function mergeTeamTasks(local: TeamTaskEntry[], remote: TeamTaskEntry[]): TeamTaskEntry[] {
  const merged = new Map<string, TeamTaskEntry>();

  for (const task of remote) {
    merged.set(task.id, task);
  }

  for (const task of local) {
    const existing = merged.get(task.id);
    if (!existing) {
      merged.set(task.id, task);
      continue;
    }
    const localTime = Date.parse(task.updatedAt) || 0;
    const remoteTime = Date.parse(existing.updatedAt) || 0;
    if (localTime >= remoteTime) {
      merged.set(task.id, task);
    }
  }

  return Array.from(merged.values());
}

async function runGit(cwd: string, args: string[]): Promise<string> {
  const result = await execFile("git", args, {
    cwd,
    maxBuffer: 5 * 1024 * 1024,
  });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

/**
 * Find the team workspace that a project name maps to.
 * Returns null if no matching team workspace or if it has no git sync.
 */
async function findTeamWorkspaceForProject(
  project: string,
): Promise<WorkspaceConfigEntry | null> {
  if (!project) {
    return null;
  }

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const normalizedProject = project.trim().toLowerCase();

  for (const workspace of config.workspaces) {
    if (workspace.type !== "team") {
      continue;
    }
    if (!workspace.sync || workspace.sync.type !== "git") {
      continue;
    }
    if (
      workspace.id === normalizedProject ||
      workspace.name.toLowerCase() === normalizedProject ||
      workspace.keywords.some((kw) => kw === normalizedProject)
    ) {
      return workspace;
    }
  }

  return null;
}

/**
 * Sync tasks for a team workspace via git.
 *
 * 1. Pull latest from remote (if autoPull enabled)
 * 2. Read local tasks that match this workspace
 * 3. Read remote team task file
 * 4. Merge (dedup by id, last-updated wins)
 * 5. Write merged tasks to {workspace}/.godmode/tasks.json
 * 6. Push to remote (if autoPush enabled)
 */
async function syncTeamTasks(workspaceId: string): Promise<{
  synced: boolean;
  taskCount: number;
  error?: string;
}> {
  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    return { synced: false, taskCount: 0, error: `Workspace not found: ${workspaceId}` };
  }
  if (workspace.type !== "team") {
    return { synced: false, taskCount: 0, error: "Workspace is not a team workspace" };
  }
  if (!workspace.sync || workspace.sync.type !== "git") {
    return { synced: false, taskCount: 0, error: "Workspace has no git sync configured" };
  }

  const teamTasksPath = join(workspace.path, TEAM_TASKS_FILENAME);

  // Pull latest from remote if autoPull is enabled
  if (workspace.sync.autoPull.enabled) {
    try {
      const pullArgs = workspace.sync.remote
        ? ["pull", "--rebase", workspace.sync.remote, workspace.sync.branch]
        : ["pull", "--rebase"];
      await runGit(workspace.path, pullArgs);
    } catch {
      // Pull failure is non-fatal; proceed with local merge
    }
  }

  // Read local tasks that belong to this workspace's project
  const localData = await readTasks();
  const projectTasks = localData.tasks.filter((t) => {
    if (!t.project) return false;
    const p = t.project.trim().toLowerCase();
    return (
      p === workspace.id ||
      p === workspace.name.toLowerCase() ||
      workspace.keywords.some((kw) => kw === p)
    );
  });
  const localTeamTasks = projectTasks.map(toTeamTask);

  // Read existing remote team task file
  const remoteData = await readTeamTasksFile(teamTasksPath);

  // Merge: dedup by id, last-updated wins
  const merged = mergeTeamTasks(localTeamTasks, remoteData.tasks);

  // Write merged result with pretty printing for human readability
  const output: TeamTasksFile = {
    tasks: merged,
    syncedAt: new Date().toISOString(),
  };
  await secureMkdir(join(teamTasksPath, ".."));
  await secureWriteFile(teamTasksPath, JSON.stringify(output, null, 2) + "\n");

  // Push to remote if autoPush is enabled
  if (workspace.sync.autoPush.enabled) {
    try {
      await runGit(workspace.path, ["add", TEAM_TASKS_FILENAME]);
      try {
        await runGit(workspace.path, [
          "commit",
          "-m",
          `Sync team tasks: ${new Date().toISOString()}`,
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.toLowerCase().includes("nothing to commit")) {
          throw err;
        }
      }
      const pushArgs = workspace.sync.remote
        ? ["push", workspace.sync.remote, workspace.sync.branch]
        : ["push"];
      await runGit(workspace.path, pushArgs);
    } catch {
      // Push failure is non-fatal; the file is written locally
    }
  }

  return { synced: true, taskCount: merged.length };
}

/**
 * Fire-and-forget team sync when a task's project matches a team workspace.
 * Errors are silently ignored to keep task CRUD fast.
 */
function triggerTeamSyncIfNeeded(project: string | null): void {
  if (!project) {
    return;
  }
  void (async () => {
    try {
      const workspace = await findTeamWorkspaceForProject(project);
      if (!workspace) {
        return;
      }
      await syncTeamTasks(workspace.id);
    } catch {
      // Silently ignore — team sync should never block task operations
    }
  })();
}

const syncTeamHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  if (!workspaceId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing workspaceId" });
    return;
  }
  const result = await syncTeamTasks(workspaceId);
  if (!result.synced) {
    respond(false, null, { code: "SYNC_FAILED", message: result.error ?? "Sync failed" });
    return;
  }
  respond(true, result);
};

// tasksHandlers is defined at the bottom of this file (after archiveHandler/archivedHandler).

/**
 * Ensures a task has a linked session. Called by the queue processor when
 * starting work so the task always has a consistent session from the start.
 * Returns the session key (existing or newly created).
 */
export async function ensureTaskSession(taskId: string): Promise<string | null> {
  const { result: sessionId } = await updateTasks((data) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return null;
    if (task.sessionId) return task.sessionId;

    const uuid = randomUUID();
    const sid = `agent:main:webchat-${uuid.slice(0, 8)}`;
    task.sessionId = sid;
    return sid;
  });
  return sessionId;
}

// ── Task Archival + Dedup (F5) ────────────────────────────────────

function archiveCompletedTasks(data: TasksData, daysOld = 7): void {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const cutoffIso = cutoff.toISOString();

  const toArchive: NativeTask[] = [];
  const remaining: NativeTask[] = [];

  for (const task of data.tasks) {
    if (
      task.status === "complete" &&
      task.completedAt &&
      task.completedAt < cutoffIso
    ) {
      toArchive.push(task);
    } else {
      remaining.push(task);
    }
  }

  if (toArchive.length === 0) return;

  data.tasks = remaining;
  data.archived = data.archived ?? [];
  data.archived.push(...toArchive);

  // Cap archived at 500 entries (remove oldest)
  if (data.archived.length > 500) {
    data.archived = data.archived.slice(data.archived.length - 500);
  }
}

function deduplicateTasks(data: TasksData): void {
  const groups = new Map<string, NativeTask[]>();

  for (const task of data.tasks) {
    const key = `${task.title.toLowerCase().trim()}|${task.dueDate ?? ""}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(task);
  }

  const deduped: NativeTask[] = [];
  for (const group of groups.values()) {
    if (group.length <= 1) {
      deduped.push(...group);
      continue;
    }
    // Keep the entry with more non-null fields
    let best = group[0];
    let bestCount = countNonNull(best);
    for (let i = 1; i < group.length; i++) {
      const count = countNonNull(group[i]);
      if (count > bestCount) {
        best = group[i];
        bestCount = count;
      }
    }
    deduped.push(best);
  }

  data.tasks = deduped;
}

function countNonNull(task: NativeTask): number {
  let count = 0;
  for (const value of Object.values(task)) {
    if (value != null && value !== "") count++;
  }
  return count;
}

export async function runTaskMaintenance(): Promise<{ cleaned: number; warnings: string[] }> {
  const warnings: string[] = [];
  let cleaned = 0;

  await updateTasks((data) => {
    deduplicateTasks(data);
    archiveCompletedTasks(data);

    // ── Orphan cleanup: pending tasks with stale projectIds ──
    const today = localDateString();
    const staleThreshold = 30; // 30 days old with no update = stale
    const now = Date.now();

    for (const task of data.tasks) {
      // Warn about very old pending tasks (likely forgotten)
      const createdMs = task.createdAt ? new Date(task.createdAt).getTime() : 0;
      if (
        task.status === "pending" &&
        createdMs > 0 &&
        now - createdMs > staleThreshold * 24 * 60 * 60 * 1000 &&
        !task.dueDate // No due date = probably forgotten
      ) {
        warnings.push(`Stale task (${Math.round((now - createdMs) / 86400000)}d old, no due date): "${task.title}"`);
      }

      // Warn about overdue tasks older than 14 days
      if (
        task.status === "pending" &&
        task.dueDate &&
        task.dueDate < today
      ) {
        const daysOverdue = Math.round(
          (new Date(today).getTime() - new Date(task.dueDate).getTime()) / 86400000,
        );
        if (daysOverdue > 14) {
          warnings.push(`Task overdue ${daysOverdue}d: "${task.title}" (due ${task.dueDate})`);
        }
      }
    }
  });

  // ── Check for orphaned queue items (tasks deleted but queue items linger) ──
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const taskData = await readTasks();
    const queueState = await readQueueState();
    const taskIds = new Set(taskData.tasks.map((t) => t.id));

    for (const qi of queueState.items) {
      if (qi.sourceTaskId && !taskIds.has(qi.sourceTaskId) && qi.status !== "done" && qi.status !== "failed") {
        warnings.push(`Orphaned queue item "${qi.title}" (source task deleted, status: ${qi.status})`);
      }
    }
  } catch { /* queue state unavailable */ }

  return { cleaned, warnings };
}

const archiveHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { daysOld } = params as { daysOld?: number };
  await updateTasks((data) => {
    archiveCompletedTasks(data, daysOld ?? 7);
  });
  respond(true, { message: "Archival complete" });
};

const archivedHandler: GatewayRequestHandler = async ({ params: _params, respond }) => {
  const data = await readTasks();
  respond(true, { archived: data.archived ?? [] });
};

// ── Fuzzy title matching for markDoneByTitle ───────────────────────

/**
 * Score how similar two task titles are (0-100).
 *
 * Tier 1 (100): Normalized titles are identical (case-insensitive, bold/em-dash stripped).
 * Tier 2 (85): One normalized title contains the other (substring match).
 * Tier 3 (0-80): Word overlap via Jaccard similarity (only when fuzzy=true).
 */
function titleSimilarity(a: string, b: string, fuzzy: boolean): number {
  // Inlined from normalizeTitle (daily-brief.ts) + toLowerCase for comparison:
  const normalize = (raw: string): string => {
    let t = raw
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\s*[—–]\s+.+$/, "")
      .trim();
    t = t.replace(/[,.]$/, "").trim();
    t = t.replace(/\s{2,}/g, " ");
    return t.toLowerCase();
  };

  const na = normalize(a);
  const nb = normalize(b);

  // Tier 1: exact match
  if (na === nb) return 100;

  // Tier 2: substring match
  if (na.includes(nb) || nb.includes(na)) return 85;

  if (!fuzzy) return 0;

  // Tier 3: word overlap (Jaccard similarity)
  const wordsA = new Set(na.split(/\s+/).filter(Boolean));
  const wordsB = new Set(nb.split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return Math.round((intersection / union) * 80);
}

/**
 * tasks.markDoneByTitle — Mark a pending task as complete by title match.
 *
 * Params: { title: string, fuzzy?: boolean }
 * Returns the matched task with score, or an error with candidates.
 */
const markDoneByTitle: GatewayRequestHandler = async ({ params, respond }) => {
  const { title, fuzzy } = params as { title?: string; fuzzy?: boolean };
  if (!title || typeof title !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing title parameter" });
    return;
  }

  const useFuzzy = fuzzy === true;
  const THRESHOLD = 80;

  const data = await readTasks();
  const pendingTasks = data.tasks.filter((t) => t.status === "pending");

  if (pendingTasks.length === 0) {
    respond(false, null, {
      code: "NO_MATCH",
      message: `No pending tasks to match against '${title}'.`,
    });
    return;
  }

  // Score all pending tasks
  const scored = pendingTasks
    .map((t) => ({ task: t, score: titleSimilarity(title, t.title, useFuzzy) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const aboveThreshold = scored.filter((s) => s.score >= THRESHOLD);

  // No match
  if (aboveThreshold.length === 0) {
    const hint = useFuzzy
      ? "Try the exact title."
      : "Try with fuzzy: true or use the exact title.";
    respond(false, null, {
      code: "NO_MATCH",
      message: `No pending task matching '${title}'. Best candidate: '${best.task.title}' at ${best.score}%. ${hint}`,
    });
    return;
  }

  // Ambiguous match
  if (aboveThreshold.length > 1) {
    respond(false, null, {
      code: "AMBIGUOUS_MATCH",
      message: `Multiple pending tasks match '${title}': ${aboveThreshold.map((s) => `'${s.task.title}' (${s.score}%)`).join(", ")}. Specify the full title.`,
      details: aboveThreshold.map((s) => ({
        id: s.task.id,
        title: s.task.title,
        score: s.score,
      })),
    });
    return;
  }

  // Single match — mark complete
  const matched = aboveThreshold[0];
  const { result: updatedTask } = await updateTasks((taskData) => {
    const task = taskData.tasks.find((t) => t.id === matched.task.id);
    if (!task) return null;
    task.status = "complete";
    task.completedAt = new Date().toISOString();
    return task;
  });

  if (!updatedTask) {
    respond(false, null, { code: "NO_MATCH", message: "Task disappeared during update." });
    return;
  }

  respond(true, {
    task: updatedTask,
    matchScore: matched.score,
    matchedTitle: matched.task.title,
  });

  // Fire-and-forget: sync brief checkbox
  void (async () => {
    try {
      const { syncBriefFromTasks } = await import("./daily-brief.js");
      const syncDate = updatedTask.dueDate || todayDateStr();
      await syncBriefFromTasks(syncDate, { taskTitle: updatedTask.title });
    } catch {
      // Brief sync is best-effort
    }
  })();

  // Fire-and-forget: team sync
  triggerTeamSyncIfNeeded(updatedTask.project);
};

export const tasksHandlers: GatewayRequestHandlers = {
  "tasks.list": listTasks,
  "tasks.today": todayTasks,
  "tasks.upcoming": upcomingTasks,
  "tasks.get": getTask,
  "tasks.create": createTask,
  "tasks.update": updateTask,
  "tasks.delete": deleteTask,
  "tasks.byProject": byProject,
  "tasks.openSession": openSession,
  "tasks.linkSession": linkSession,
  "tasks.syncTeam": syncTeamHandler,
  "tasks.archive": archiveHandler,
  "tasks.archived": archivedHandler,
  "tasks.markDoneByTitle": markDoneByTitle,
};

/**
 * Ensure all today's pending tasks have session keys pre-created.
 * Returns task id → sessionId map.
 */
export async function ensureTaskSessions(
  date?: string,
): Promise<Array<{ id: string; title: string; sessionId: string }>> {
  const today = date ?? localDateString();

  const { result } = await updateTasks((data) => {
    const results: Array<{ id: string; title: string; sessionId: string }> = [];
    for (const task of data.tasks) {
      if (task.status !== "pending") continue;
      if (task.dueDate !== today) continue;

      if (!task.sessionId) {
        const uuid = randomUUID();
        task.sessionId = `agent:main:webchat-${uuid.slice(0, 8)}`;
      }
      results.push({ id: task.id, title: task.title, sessionId: task.sessionId });
    }
    return results;
  });

  return result;
}

export { syncTeamTasks, type NativeTask, type TasksData };
