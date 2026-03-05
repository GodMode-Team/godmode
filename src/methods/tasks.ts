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
  type WorkspaceConfigEntry,
} from "../lib/workspaces-config.js";
import { withFileLock } from "openclaw/plugin-sdk";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

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
      delete (task as any).carryOver;
      delete (task as any).userEdited;
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
    const { readWorkspaceConfig, detectWorkspaceFromText } = await import("../lib/workspaces-config.js");
    const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
    if (!wsConfig.workspaces.length) return;

    await updateTasks((data) => {
      let patched = 0;
      for (const task of data.tasks) {
        if (task.project || task.projectId) continue;
        const detection = detectWorkspaceFromText(wsConfig, task.title);
        if (detection.workspaceId && detection.score >= 2) {
          const ws = wsConfig.workspaces.find((w) => w.id === detection.workspaceId);
          task.project = ws?.name ?? null;
          task.projectId = detection.workspaceId;
          patched++;
        }
      }
      return patched;
    });
  } catch {
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

  // Try to resolve projectId from workspace config
  let projectId: string | null = null;
  if (project) {
    try {
      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const normalizedProject = project.trim().toLowerCase();
      const match = config.workspaces.find(
        (ws) =>
          ws.id === normalizedProject ||
          ws.name.toLowerCase() === normalizedProject ||
          ws.keywords.some((kw) => kw === normalizedProject),
      );
      projectId = match?.id ?? null;
    } catch {
      // Non-fatal — projectId stays null
    }
  }

  const task: NativeTask = {
    id: randomUUID(),
    title,
    status: "pending",
    project: project ?? null,
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
  const { id, ...updates } = params as { id?: string } & Partial<NativeTask>;
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing task id" });
    return;
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
  // Guard: don't delete tasks with active queue work unless force=true
  if (!force) {
    try {
      const { readQueueState } = await import("../lib/queue-state.js");
      const queueState = await readQueueState();
      const activeQueueItem = queueState.items.find(
        (qi) => qi.sourceTaskId === id && qi.status !== "done",
      );
      if (activeQueueItem) {
        respond(false, null, {
          code: "HAS_ACTIVE_QUEUE_ITEM",
          message: `Cannot delete — task has active queue work (status: ${activeQueueItem.status}). Use force=true to override.`,
        });
        return;
      }
    } catch {
      // Queue state unavailable — allow deletion
    }
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

export async function runTaskMaintenance(): Promise<void> {
  await updateTasks((data) => {
    deduplicateTasks(data);
    archiveCompletedTasks(data);
  });
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
};

export { syncTeamTasks, type NativeTask, type TasksData };
