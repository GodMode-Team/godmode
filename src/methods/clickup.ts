import { ErrorCodes, errorShape } from "../protocol.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const CLICKUP_BASE_URL = "https://api.clickup.com/api/v2";
const CLICKUP_TIMEOUT_MS = 15_000;

function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLICKUP_TIMEOUT_MS);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function getClickUpApiKey(): string | null {
  return process.env.CLICKUP_API_KEY || null;
}

function getMainQueueId(): string | null {
  return process.env.CLICKUP_LIST_ID || null;
}

function getPersonalTasksId(): string | null {
  return process.env.CLICKUP_PERSONAL_LIST_ID || null;
}

type ClickUpTask = {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: number;
  tags: string[];
  assignees: string[];
  dateCreated: number;
  dueDate: number | null;
  url: string;
  listId: string;
};

function mapTaskFromApi(task: Record<string, unknown>, listId: string): ClickUpTask {
  const status = task.status as Record<string, unknown> | undefined;
  const priority = task.priority as Record<string, unknown> | undefined;
  const tags = (task.tags || []) as Array<Record<string, unknown>>;
  const assignees = (task.assignees || []) as Array<Record<string, unknown>>;
  return {
    id: task.id as string,
    name: task.name as string,
    description: (task.description as string) || "",
    status: (status?.status as string)?.toLowerCase() || "to do",
    priority: (priority?.orderindex as number) ?? 4,
    tags: tags.map((tag) => tag.name as string),
    assignees: assignees.map((a) => (a.username as string) || (a.email as string)),
    dateCreated: parseInt(task.date_created as string, 10),
    dueDate: task.due_date ? parseInt(task.due_date as string, 10) : null,
    url: `https://app.clickup.com/t/${String(task.id)}`,
    listId,
  };
}

async function fetchTasksFromList(
  listId: string,
  apiKey: string,
  includeClosed = false,
): Promise<ClickUpTask[]> {
  const url = `${CLICKUP_BASE_URL}/list/${listId}/task?include_closed=${includeClosed}&subtasks=false`;
  const response = await fetchWithTimeout(url, {
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as { tasks?: unknown[] };
  return (data.tasks || []).map((t) => mapTaskFromApi(t as Record<string, unknown>, listId));
}

async function fetchTasksWithFilters(
  listId: string,
  apiKey: string,
  filters: {
    tags?: string[];
    dueDateGt?: number;
    dueDateLt?: number;
    includeClosed?: boolean;
  },
): Promise<ClickUpTask[]> {
  const params = new URLSearchParams({
    archived: "false",
    include_closed: String(filters.includeClosed ?? false),
    subtasks: "false",
  });
  if (filters.tags && filters.tags.length > 0) {
    for (const tag of filters.tags) {
      params.append("tags[]", tag);
    }
  }
  if (filters.dueDateGt !== undefined) {
    params.set("due_date_gt", String(filters.dueDateGt));
  }
  if (filters.dueDateLt !== undefined) {
    params.set("due_date_lt", String(filters.dueDateLt));
  }
  const url = `${CLICKUP_BASE_URL}/list/${listId}/task?${params}`;
  const response = await fetchWithTimeout(url, {
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as { tasks?: unknown[] };
  return (data.tasks || []).map((t) => mapTaskFromApi(t as Record<string, unknown>, listId));
}

async function createTask(
  listId: string,
  name: string,
  description: string,
  status: string,
  apiKey: string,
): Promise<ClickUpTask> {
  const response = await fetchWithTimeout(`${CLICKUP_BASE_URL}/list/${listId}/task`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, status }),
  });
  if (!response.ok) {
    throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
  }
  const task = (await response.json()) as Record<string, unknown>;
  const taskList = task.list as Record<string, unknown> | undefined;
  return mapTaskFromApi(task, (taskList?.id as string) || listId);
}

export const clickupHandlers: GatewayRequestHandlers = {
  "clickup.tasks.list": async ({ params, respond }) => {
    const apiKey = getClickUpApiKey();
    if (!apiKey) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_API_KEY not configured"));
      return;
    }
    const p = params as { listId?: string; queue?: "main" | "personal" | "all"; includeClosed?: boolean };
    try {
      let tasks: ClickUpTask[] = [];
      if (p.listId) {
        tasks = await fetchTasksFromList(p.listId, apiKey, p.includeClosed);
      } else {
        const queue = p.queue || "main";
        const mainQueueId = getMainQueueId();
        const personalTasksId = getPersonalTasksId();
        if (queue === "main" || queue === "all") {
          if (!mainQueueId) {
            respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_LIST_ID not configured. Set it in your .env file."));
            return;
          }
          tasks = tasks.concat(await fetchTasksFromList(mainQueueId, apiKey, p.includeClosed));
        }
        if (queue === "personal" || queue === "all") {
          if (!personalTasksId) {
            respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_PERSONAL_LIST_ID not configured. Set it in your .env file."));
            return;
          }
          tasks = tasks.concat(await fetchTasksFromList(personalTasksId, apiKey, p.includeClosed));
        }
      }
      respond(true, { tasks, count: tasks.length }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `ClickUp API error: ${String(err)}`));
    }
  },

  "clickup.tasks.myDay": async ({ params, respond }) => {
    const apiKey = getClickUpApiKey();
    if (!apiKey) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_API_KEY not configured"));
      return;
    }
    const p = params as { queue?: "main" | "personal" | "all" };
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStart = today.getTime();
      const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;
      const queue = p.queue || "all";
      const listIds: string[] = [];
      const mainQueueId = getMainQueueId();
      const personalTasksId = getPersonalTasksId();
      if (queue === "main" || queue === "all") {
        if (!mainQueueId) {
          respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_LIST_ID not configured. Set it in your .env file."));
          return;
        }
        listIds.push(mainQueueId);
      }
      if (queue === "personal" || queue === "all") {
        if (!personalTasksId) {
          respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_PERSONAL_LIST_ID not configured. Set it in your .env file."));
          return;
        }
        listIds.push(personalTasksId);
      }
      const taskMap = new Map<string, ClickUpTask>();
      for (const listId of listIds) {
        const dueTodayTasks = await fetchTasksWithFilters(listId, apiKey, {
          dueDateGt: todayStart - 1,
          dueDateLt: todayEnd + 1,
          includeClosed: false,
        });
        for (const task of dueTodayTasks) {
          taskMap.set(task.id, task);
        }
        const taggedTasks = await fetchTasksWithFilters(listId, apiKey, {
          tags: ["my-day"],
          includeClosed: false,
        });
        for (const task of taggedTasks) {
          taskMap.set(task.id, task);
        }
      }
      const tasks = Array.from(taskMap.values());
      respond(true, { tasks, count: tasks.length }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `ClickUp API error: ${String(err)}`));
    }
  },

  "clickup.tasks.get": async ({ params, respond }) => {
    const apiKey = getClickUpApiKey();
    if (!apiKey) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_API_KEY not configured"));
      return;
    }
    const p = params as { taskId: string };
    if (!p.taskId) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "taskId required"));
      return;
    }
    try {
      const response = await fetchWithTimeout(`${CLICKUP_BASE_URL}/task/${p.taskId}`, {
        headers: { Authorization: apiKey, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
      }
      const task = (await response.json()) as Record<string, unknown>;
      const taskList = task.list as Record<string, unknown> | undefined;
      const formatted = mapTaskFromApi(task, (taskList?.id as string) || "");
      respond(true, { task: formatted }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `ClickUp API error: ${String(err)}`));
    }
  },

  "clickup.tasks.update": async ({ params, respond }) => {
    const apiKey = getClickUpApiKey();
    if (!apiKey) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_API_KEY not configured"));
      return;
    }
    const p = params as { taskId: string; status?: string; name?: string; description?: string };
    if (!p.taskId) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "taskId required"));
      return;
    }
    try {
      const updatePayload: Record<string, unknown> = {};
      if (p.status) updatePayload.status = p.status;
      if (p.name) updatePayload.name = p.name;
      if (p.description !== undefined) updatePayload.description = p.description;
      const response = await fetchWithTimeout(`${CLICKUP_BASE_URL}/task/${p.taskId}`, {
        method: "PUT",
        headers: { Authorization: apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ClickUp API ${response.status}: ${errorBody}`);
      }
      const task = (await response.json()) as Record<string, unknown>;
      respond(true, { updated: true, taskId: task.id }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, String(err)));
    }
  },

  "clickup.tasks.create": async ({ params, respond }) => {
    const apiKey = getClickUpApiKey();
    if (!apiKey) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "CLICKUP_API_KEY not configured"));
      return;
    }
    const p = params as { name: string; description?: string; status?: string; listId?: string; queue?: "main" | "personal" };
    if (!p.name) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "name required"));
      return;
    }
    try {
      let listId = p.listId;
      if (!listId) {
        const targetId = p.queue === "personal" ? getPersonalTasksId() : getMainQueueId();
        if (!targetId) {
          const missingVar = p.queue === "personal" ? "CLICKUP_PERSONAL_LIST_ID" : "CLICKUP_LIST_ID";
          respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `${missingVar} not configured. Set it in your .env file.`));
          return;
        }
        listId = targetId;
      }
      const task = await createTask(listId, p.name, p.description || "", p.status || "to do", apiKey);
      respond(true, { task }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `ClickUp API error: ${String(err)}`));
    }
  },

  "clickup.config": async ({ respond }) => {
    const apiKey = getClickUpApiKey();
    const mainQueueId = getMainQueueId();
    const personalTasksId = getPersonalTasksId();
    respond(
      true,
      {
        configured: !!apiKey && !!mainQueueId,
        apiKeySet: !!apiKey,
        mainQueueId,
        personalTasksId,
        missingConfig: [
          !apiKey && "CLICKUP_API_KEY",
          !mainQueueId && "CLICKUP_LIST_ID",
          !personalTasksId && "CLICKUP_PERSONAL_LIST_ID",
        ].filter(Boolean),
      },
      undefined,
    );
  },
};
