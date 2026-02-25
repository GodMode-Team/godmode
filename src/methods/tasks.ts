import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const TASKS_FILE = join(DATA_DIR, "tasks.json");

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
    id: crypto.randomUUID(),
    title,
    status: "pending",
    project: project ?? null,
    dueDate: dueDate ?? null,
    priority: priority ?? "medium",
    createdAt: new Date().toISOString(),
    completedAt: null,
    carryOver: false,
    source: source ?? "chat",
  };
  const data = await readTasks();
  data.tasks.push(task);
  await writeTasks(data);
  respond(true, task);
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
  await writeTasks(data);
  respond(true, task);
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

export const tasksHandlers: GatewayRequestHandlers = {
  "tasks.list": listTasks,
  "tasks.today": todayTasks,
  "tasks.upcoming": upcomingTasks,
  "tasks.get": getTask,
  "tasks.create": createTask,
  "tasks.update": updateTask,
  "tasks.delete": deleteTask,
  "tasks.carryOver": carryOverTasks,
};
