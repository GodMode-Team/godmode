import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFile as execFileCb } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join, dirname } from "node:path";
import { promisify } from "node:util";
import { DATA_DIR } from "../data-paths.js";
import {
  findWorkspaceById,
  readWorkspaceConfig,
  type WorkspaceConfigEntry,
} from "../lib/workspaces-config.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

const execFile = promisify(execFileCb);

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const TASKS_FILE = join(DATA_DIR, "tasks.json");
/** Team tasks are synced to this file inside the workspace directory. */
const TEAM_TASKS_FILENAME = ".godmode/tasks.json";

type NativeTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
  carryOver: boolean;
  source: "chat" | "cron" | "import";
  /** Linked chat session key for task-session linking */
  sessionId: string | null;
};

type TasksData = {
  tasks: NativeTask[];
  updatedAt: string | null;
};

async function readTasks(): Promise<TasksData> {
  try {
    const raw = await readFile(TASKS_FILE, "utf-8");
    return JSON.parse(raw) as TasksData;
  } catch {
    return { tasks: [], updatedAt: null };
  }
}

async function writeTasks(data: TasksData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await mkdir(dirname(TASKS_FILE), { recursive: true });
  await writeFile(TASKS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const listTasks: GatewayRequestHandler = async ({ params, respond }) => {
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

const todayTasks: GatewayRequestHandler = async ({ respond }) => {
  const data = await readTasks();
  const today = todayDateStr();
  const tasks = data.tasks.filter(
    (t) => t.status === "pending" && t.dueDate != null && t.dueDate <= today,
  );
  respond(true, { tasks });
};

const upcomingTasks: GatewayRequestHandler = async ({ respond }) => {
  const data = await readTasks();
  const today = todayDateStr();
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
  const task: NativeTask = {
    id: randomUUID(),
    title,
    status: "pending",
    project: project ?? null,
    dueDate: dueDate ?? null,
    priority: priority ?? "medium",
    createdAt: new Date().toISOString(),
    completedAt: null,
    carryOver: false,
    source: source ?? "chat",
    sessionId: null,
  };
  const data = await readTasks();
  data.tasks.push(task);
  await writeTasks(data);
  respond(true, task);

  // Async team sync if this task belongs to a team workspace
  triggerTeamSyncIfNeeded(task.project);
};

const updateTask: GatewayRequestHandler = async ({ params, respond }) => {
  const { id, ...updates } = params as { id?: string } & Partial<NativeTask>;
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
  }
  const data = await readTasks();
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }
  const task = data.tasks[idx];
  const allowedKeys: (keyof NativeTask)[] = [
    "title",
    "status",
    "project",
    "dueDate",
    "priority",
    "completedAt",
    "carryOver",
    "source",
    "sessionId",
  ];
  for (const key of allowedKeys) {
    if (key in updates) {
      (task as Record<string, unknown>)[key] = (updates as Record<string, unknown>)[key];
    }
  }
  if (updates.status === "complete" && !task.completedAt) {
    task.completedAt = new Date().toISOString();
  }
  // Mark as user-edited so daily brief sync won't overwrite
  (task as Record<string, unknown>).userEdited = true;
  data.tasks[idx] = task;
  await writeTasks(data);

  // If a task was just completed, trigger a brief sync for today
  if (updates.status === "complete") {
    try {
      const { syncBriefFromTasks } = await import("./daily-brief.js");
      await syncBriefFromTasks(todayDateStr());
    } catch {
      // Brief sync is best-effort; don't fail the task update
    }
  }

  respond(true, task);

  // Async team sync if this task belongs to a team workspace
  triggerTeamSyncIfNeeded(task.project);
};

const deleteTask: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
  }
  const data = await readTasks();
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }
  const removed = data.tasks.splice(idx, 1)[0];
  await writeTasks(data);
  respond(true, removed);
};

const byProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { project } = params as { project?: string };
  if (!project) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing project name" });
    return;
  }
  const data = await readTasks();
  const tasks = data.tasks.filter((t) => t.project === project);
  respond(true, { tasks, updatedAt: data.updatedAt });
};

const carryOverTasks: GatewayRequestHandler = async ({ respond }) => {
  const data = await readTasks();
  const today = todayDateStr();
  let count = 0;
  for (const task of data.tasks) {
    if (task.status === "pending" && task.dueDate != null && task.dueDate < today) {
      task.carryOver = true;
      count++;
    }
  }
  if (count > 0) {
    await writeTasks(data);
  }
  respond(true, { carried: count });
};

/**
 * tasks.openSession — Opens (or creates) a linked chat session for a task.
 *
 * If the task already has a sessionId, returns it.
 * Otherwise, generates a new session key (webchat format), stores it on
 * the task, and returns it. The UI navigates to the returned session key.
 */
const openSession: GatewayRequestHandler = async ({ params, respond }) => {
  const { taskId } = params as { taskId?: string };
  if (!taskId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing taskId" });
    return;
  }
  const data = await readTasks();
  const task = data.tasks.find((t) => t.id === taskId);
  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }

  // Return existing linked session
  if (task.sessionId) {
    respond(true, { sessionId: task.sessionId, created: false, task });
    return;
  }

  // Generate a new session key and link it to the task
  const uuid = randomUUID();
  const sessionId = `agent:main:webchat-${uuid.slice(0, 8)}`;
  task.sessionId = sessionId;
  await writeTasks(data);

  respond(true, { sessionId, created: true, task });
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
  const data = await readTasks();
  const task = data.tasks.find((t) => t.id === taskId);
  if (!task) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Task not found" });
    return;
  }

  task.sessionId = sessionId;
  await writeTasks(data);
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
  await mkdir(dirname(teamTasksPath), { recursive: true });
  await writeFile(teamTasksPath, JSON.stringify(output, null, 2) + "\n", "utf-8");

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

export const tasksHandlers: GatewayRequestHandlers = {
  "tasks.list": listTasks,
  "tasks.today": todayTasks,
  "tasks.upcoming": upcomingTasks,
  "tasks.get": getTask,
  "tasks.create": createTask,
  "tasks.update": updateTask,
  "tasks.delete": deleteTask,
  "tasks.carryOver": carryOverTasks,
  "tasks.byProject": byProject,
  "tasks.openSession": openSession,
  "tasks.linkSession": linkSession,
  "tasks.syncTeam": syncTeamHandler,
};

export { readTasks, writeTasks, syncTeamTasks, type NativeTask, type TasksData };
