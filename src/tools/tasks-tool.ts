/**
 * tasks-tool.ts — Agent tools for task management.
 *
 * Gives the ally direct access to tasks.json during conversation.
 * Follows the same pattern as queue-add.ts / morning-set.ts.
 *
 * Three tools:
 *   tasks_create  — Create a task immediately when user mentions something to do
 *   tasks_list    — Read pending/overdue tasks (check before creating to avoid dupes)
 *   tasks_update  — Mark done, reschedule, or change priority
 */

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult, withFileLock } from "../lib/sdk-helpers.js";
import { DATA_DIR } from "../data-paths.js";
import { secureMkdir, secureWriteFile } from "../lib/secure-fs.js";

const TASKS_FILE = join(DATA_DIR, "tasks.json");
const LOCK_OPTIONS = {
  retries: { retries: 30, factor: 1.35, minTimeout: 20, maxTimeout: 250, randomize: true },
  stale: 20_000,
};

type NativeTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
  source: "chat" | "cron" | "import";
  sessionId: string | null;
};

type TasksData = { tasks: NativeTask[]; archived?: NativeTask[]; updatedAt: string | null };

async function readTasks(): Promise<TasksData> {
  try {
    const raw = await readFile(TASKS_FILE, "utf-8");
    return JSON.parse(raw) as TasksData;
  } catch {
    return { tasks: [], archived: [], updatedAt: null };
  }
}

async function writeTasks(data: TasksData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await secureMkdir(DATA_DIR);
  await secureWriteFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

export function createTasksCreateTool(): AnyAgentTool {
  return {
    label: "Tasks",
    name: "tasks_create",
    description:
      "Create a task immediately. Use when the user says 'I need to', 'remind me to', " +
      "or mentions anything that should be tracked. " +
      "Call tasks_list first to avoid creating duplicates. " +
      "No confirmation needed — just create it.",
    parameters: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "Clear, action-oriented task title (e.g. 'Email Rich re: Anthropic setup')",
        },
        dueDate: {
          type: "string",
          description: "ISO date string YYYY-MM-DD. Only set if user specifies a date or deadline.",
        },
        priority: {
          type: "string",
          enum: ["high", "medium", "low"],
          description: "Priority. Default: medium. High if user says urgent/important/today.",
        },
        project: {
          type: "string",
          description:
            "Workspace name (e.g. 'My Project', 'GodMode', 'Agency Client'). " +
            "Auto-detected from title if not provided. Leave null if unclear.",
        },
      },
      required: ["title"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const title = String(params.title || "").trim();
      if (!title) return jsonResult({ error: true, message: "title is required" });

      const task: NativeTask = {
        id: randomUUID(),
        title,
        status: "pending",
        project: params.project ? String(params.project) : null,
        dueDate: params.dueDate ? String(params.dueDate) : null,
        priority: (params.priority as NativeTask["priority"]) ?? "medium",
        createdAt: new Date().toISOString(),
        completedAt: null,
        source: "chat",
        sessionId: null,
      };

      await withFileLock(TASKS_FILE, LOCK_OPTIONS, async () => {
        const data = await readTasks();
        data.tasks.push(task);
        await writeTasks(data);
      });

      const due = task.dueDate ? ` · due ${task.dueDate}` : "";
      const proj = task.project ? ` · ${task.project}` : "";
      return jsonResult({
        created: true,
        id: task.id,
        title: task.title,
        message: `Task created: "${task.title}"${due}${proj}`,
      });
    },
  };
}

export function createTasksListTool(): AnyAgentTool {
  return {
    label: "Tasks",
    name: "tasks_list",
    description:
      "List pending tasks. Call before creating a task to avoid duplicates. " +
      "Also use when user asks 'what do I need to do', 'what's on my plate', " +
      "or you need to find a task to update/complete.",
    parameters: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          enum: ["all", "today", "overdue", "high"],
          description:
            "Filter: 'all' = all pending, 'today' = due today or overdue, " +
            "'overdue' = past due only, 'high' = high priority. Default: all.",
        },
        project: {
          type: "string",
          description: "Filter by workspace/project name. Optional.",
        },
      },
      required: [],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const data = await readTasks();
      const filter = (params.filter as string) ?? "all";
      const today = new Date().toLocaleDateString("en-CA");

      let tasks = data.tasks.filter((t) => t.status === "pending");

      if (filter === "today") {
        tasks = tasks.filter((t) => t.dueDate && t.dueDate <= today);
      } else if (filter === "overdue") {
        tasks = tasks.filter((t) => t.dueDate && t.dueDate < today);
      } else if (filter === "high") {
        tasks = tasks.filter((t) => t.priority === "high");
      }

      if (params.project) {
        const proj = String(params.project).toLowerCase();
        tasks = tasks.filter((t) => t.project?.toLowerCase().includes(proj));
      }

      const overdue = tasks.filter((t) => t.dueDate && t.dueDate < today).length;
      const noDate = tasks.filter((t) => !t.dueDate).length;

      return jsonResult({
        count: tasks.length,
        overdue,
        noDate,
        tasks: tasks.slice(0, 30).map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate ?? null,
          priority: t.priority ?? "medium",
          project: t.project ?? null,
        })),
      });
    },
  };
}

export function createTasksUpdateTool(): AnyAgentTool {
  return {
    label: "Tasks",
    name: "tasks_update",
    description:
      "Update a task — mark complete, change due date, update priority, or reschedule. " +
      "Use tasks_list first to get the task id. " +
      "When user says 'done', 'finished', 'completed X' — mark it complete immediately.",
    parameters: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "Task ID from tasks_list",
        },
        status: {
          type: "string",
          enum: ["pending", "complete"],
          description: "New status. Use 'complete' when user marks it done.",
        },
        dueDate: {
          type: "string",
          description: "New due date YYYY-MM-DD. Use null to remove the due date.",
        },
        priority: {
          type: "string",
          enum: ["high", "medium", "low"],
          description: "New priority level.",
        },
        title: {
          type: "string",
          description: "Renamed title. Only if user explicitly renames it.",
        },
      },
      required: ["id"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      let updated: NativeTask | null = null;

      await withFileLock(TASKS_FILE, LOCK_OPTIONS, async () => {
        const data = await readTasks();
        const task = data.tasks.find((t) => t.id === params.id);
        if (!task) return;

        if (params.status !== undefined) {
          task.status = params.status as NativeTask["status"];
          if (task.status === "complete") task.completedAt = new Date().toISOString();
        }
        if (params.dueDate !== undefined) task.dueDate = params.dueDate ? String(params.dueDate) : null;
        if (params.priority !== undefined) task.priority = params.priority as NativeTask["priority"];
        if (params.title !== undefined) task.title = String(params.title);

        await writeTasks(data);
        updated = { ...task };
      });

      if (!updated) {
        return jsonResult({ error: true, message: `Task ${params.id} not found` });
      }

      const t = updated as NativeTask;
      const action = t.status === "complete" ? "Completed" : "Updated";
      const due = t.dueDate ? ` · due ${t.dueDate}` : "";
      return jsonResult({
        updated: true,
        message: `${action}: "${t.title}"${due}`,
        task: updated,
      });
    },
  };
}
