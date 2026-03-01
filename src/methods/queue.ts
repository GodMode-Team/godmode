import { readFile } from "node:fs/promises";
import { execFile as execFileCb } from "node:child_process";
import { join, resolve, normalize } from "node:path";
import { promisify } from "node:util";
import { DATA_DIR, GODMODE_ROOT } from "../data-paths.js";
import {
  readQueueState,
  updateQueueState,
  newQueueItemId,
  type QueueItem,
  type QueueItemType,
  type QueueItemStatus,
} from "../lib/queue-state.js";
import { readTasks, writeTasks } from "./tasks.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

const execFile = promisify(execFileCb);

const INBOX_DIR = join(GODMODE_ROOT, "memory", "inbox");

// ── Helpers ──────────────────────────────────────────────────────

function countsByStatus(items: QueueItem[]): Record<QueueItemStatus, number> {
  const counts: Record<QueueItemStatus, number> = {
    pending: 0,
    processing: 0,
    review: 0,
    done: 0,
    failed: 0,
  };
  for (const item of items) {
    if (item.status in counts) {
      counts[item.status]++;
    }
  }
  return counts;
}

// ── RPC Handlers ─────────────────────────────────────────────────

const addItem: GatewayRequestHandler = async ({ params, respond }) => {
  const { type, title, description, url, repoRoot, priority, sourceTaskId, personaHint, engine } = params as {
    type?: QueueItemType;
    title?: string;
    description?: string;
    url?: string;
    repoRoot?: string;
    priority?: "high" | "normal" | "low";
    sourceTaskId?: string;
    personaHint?: string;
    engine?: "claude" | "codex" | "gemini";
  };
  if (!title) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing title" });
    return;
  }
  if (!type) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing type" });
    return;
  }

  const { result: item } = await updateQueueState((state) => {
    const newItem: QueueItem = {
      id: newQueueItemId(title),
      type,
      title,
      description: description || undefined,
      url: url || undefined,
      repoRoot: repoRoot || undefined,
      priority: priority || "normal",
      status: "pending",
      source: "manual",
      sourceTaskId: sourceTaskId || undefined,
      personaHint: personaHint || undefined,
      engine: engine || undefined,
      createdAt: Date.now(),
    };
    state.items.push(newItem);
    return newItem;
  });

  respond(true, { item });
};

const listItems: GatewayRequestHandler = async ({ params, respond }) => {
  const { status, type, limit } = params as {
    status?: QueueItemStatus;
    type?: QueueItemType;
    limit?: number;
  };
  const state = await readQueueState();
  let items = state.items;

  if (status) {
    items = items.filter((i) => i.status === status);
  }
  if (type) {
    items = items.filter((i) => i.type === type);
  }

  const counts = countsByStatus(state.items);

  if (limit && limit > 0) {
    items = items.slice(0, limit);
  }

  respond(true, { items, counts });
};

const updateItem: GatewayRequestHandler = async ({ params, respond }) => {
  const { id, status, result, error } = params as {
    id?: string;
    status?: QueueItemStatus;
    result?: QueueItem["result"];
    error?: string;
  };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing id" });
    return;
  }

  // Agents can only set status to "review" or "failed" — never "done"
  if (status && status !== "review" && status !== "failed") {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: 'Agents can only set status to "review" or "failed". Use queue.approve for "done".',
    });
    return;
  }

  const { result: item } = await updateQueueState((state) => {
    const idx = state.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const existing = state.items[idx];
    if (status) existing.status = status;
    if (result) existing.result = result;
    if (error) existing.error = error;
    if (status === "review" || status === "failed") {
      existing.completedAt = Date.now();
    }
    state.items[idx] = existing;
    return existing;
  });

  if (!item) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Queue item not found" });
    return;
  }
  respond(true, { item });
};

const approveItem: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing id" });
    return;
  }

  const { result } = await updateQueueState((state) => {
    const idx = state.items.findIndex((i) => i.id === id);
    if (idx === -1) return { item: null, error: "Queue item not found" };
    const existing = state.items[idx];
    if (existing.status !== "review") {
      return { item: null, error: `Cannot approve item with status "${existing.status}". Only "review" items can be approved.` };
    }
    existing.status = "done";
    existing.completedAt = Date.now();
    state.items[idx] = existing;
    return { item: existing, error: null };
  });

  if (result.error || !result.item) {
    respond(false, null, { code: "INVALID_REQUEST", message: result.error ?? "Queue item not found" });
    return;
  }

  // If item has a sourceTaskId, mark the linked NativeTask as complete
  if (result.item.sourceTaskId) {
    try {
      const tasksData = await readTasks();
      const taskIdx = tasksData.tasks.findIndex((t) => t.id === result.item!.sourceTaskId);
      if (taskIdx !== -1) {
        tasksData.tasks[taskIdx].status = "complete";
        tasksData.tasks[taskIdx].completedAt = new Date().toISOString();
        await writeTasks(tasksData);
      }
    } catch {
      // Task sync is best-effort; don't fail the approval
    }
  }

  // Auto-rate the persona in the trust tracker (approval = good performance)
  if (result.item.personaHint) {
    try {
      const { submitTrustRating } = await import("./trust-tracker.js");
      await submitTrustRating(
        result.item.personaHint,
        8,
        `Approved: "${result.item.title}"`,
      );
    } catch {
      // Trust rating is best-effort
    }
  }

  respond(true, { item: result.item });
};

const removeItem: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing id" });
    return;
  }

  const { result: removed } = await updateQueueState((state) => {
    const idx = state.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    return state.items.splice(idx, 1)[0];
  });

  if (!removed) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Queue item not found" });
    return;
  }
  respond(true, { item: removed });
};

/**
 * Intentional pass-through stub. Returns the next pending item without spawning
 * an agent. Actual agent spawning is handled by queue-processor.ts, which runs
 * as an autonomous service on its own heartbeat tick.
 */
const processItem: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };

  const { result: item } = await updateQueueState((state) => {
    let target: QueueItem | undefined;
    if (id) {
      target = state.items.find((i) => i.id === id);
    } else {
      // Find next pending item (highest priority first)
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const pending = state.items
        .filter((i) => i.status === "pending")
        .sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));
      target = pending[0];
    }
    if (!target) return null;
    // For now, just keep status as pending — processor will be wired later
    return target;
  });

  if (!item) {
    respond(true, { item: null, spawned: false, message: "No pending items in queue" });
    return;
  }
  respond(true, { item, spawned: false });
};

/**
 * Intentional pass-through stub. Lists pending items without spawning agents.
 * Actual processing is handled by queue-processor.ts, which picks up pending
 * items autonomously during its heartbeat cycle.
 */
const processAllItems: GatewayRequestHandler = async ({ params: _params, respond }) => {
  const state = await readQueueState();
  const pending = state.items.filter((i) => i.status === "pending");

  respond(true, {
    items: pending,
    count: pending.length,
    spawned: false,
    message: pending.length > 0
      ? `${pending.length} pending item(s) ready for processing`
      : "No pending items in queue",
  });
};

const prDiff: GatewayRequestHandler = async ({ params, respond }) => {
  const { prUrl } = params as { prUrl?: string };
  if (!prUrl) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing prUrl" });
    return;
  }

  try {
    const { stdout } = await execFile("gh", ["pr", "diff", prUrl], {
      maxBuffer: 10 * 1024 * 1024,
    });
    respond(true, { content: stdout });
  } catch {
    respond(true, { content: "Failed to fetch PR diff" });
  }
};

const readOutput: GatewayRequestHandler = async ({ params, respond }) => {
  const { path: filePath } = params as { path?: string };
  if (!filePath) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing path" });
    return;
  }

  // Validate the path is within ~/godmode/memory/inbox/ to prevent traversal
  const resolved = resolve(normalize(filePath));
  const inboxResolved = resolve(INBOX_DIR);
  if (!resolved.startsWith(inboxResolved + "/") && resolved !== inboxResolved) {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "Path must be within ~/godmode/memory/inbox/",
    });
    return;
  }

  try {
    const content = await readFile(resolved, "utf-8");
    respond(true, { content });
  } catch {
    respond(false, null, { code: "NOT_FOUND", message: "File not found or unreadable" });
  }
};

const listRosterItems: GatewayRequestHandler = async ({ params: _params, respond }) => {
  const { listRoster } = await import("../lib/agent-roster.js");
  respond(true, { roster: listRoster() });
};

// ── Export ────────────────────────────────────────────────────────

export const queueHandlers: Record<string, GatewayRequestHandler> = {
  "queue.add": addItem,
  "queue.list": listItems,
  "queue.update": updateItem,
  "queue.approve": approveItem,
  "queue.remove": removeItem,
  "queue.process": processItem,
  "queue.processAll": processAllItems,
  "queue.prDiff": prDiff,
  "queue.readOutput": readOutput,
  "queue.roster": listRosterItems,
};
