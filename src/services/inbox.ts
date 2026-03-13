/**
 * inbox.ts — Universal Inbox service for GodMode.
 *
 * High-signal inbox that collects completions from queue processor and skill runs.
 * Only surfaces work the user hasn't already reviewed in a live session.
 *
 * What lands in inbox:
 *   - Agent executions (queue results from background work)
 *   - Skill runs not already reviewed in live session
 *
 * What does NOT land in inbox:
 *   - Resources (live in workspaces + sessions)
 *   - Task completions (user already reviewed when they checked it off)
 *   - Chat messages, system events
 *   - Anything already scored in a live session (reviewedInSession dedup)
 *
 * Persistence: ~/godmode/data/inbox.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { DATA_DIR } from "../data-paths.js";

// ── Types ────────────────────────────────────────────────────────

export type InboxItemType = "agent-execution" | "skill-run";
export type InboxItemStatus = "pending" | "reviewed" | "dismissed";

export type InboxItem = {
  id: string;
  type: InboxItemType;
  title: string;
  summary: string;
  source: {
    persona?: string;
    skill?: string;
    taskId?: string;
    queueItemId?: string;
  };
  proofDocSlug?: string;
  outputPath?: string;
  sessionId?: string;
  createdAt: string;
  status: InboxItemStatus;
  score?: number;
  feedback?: string;
  /** Set true when the user reviews this item in the live chat session */
  reviewedInSession?: boolean;
};

export type InboxState = {
  version: 1;
  items: InboxItem[];
  updatedAt: string;
};

// ── File paths ───────────────────────────────────────────────────

const INBOX_FILE = join(DATA_DIR, "inbox.json");
const MAX_INBOX_ITEMS = 200;

// ── State I/O ────────────────────────────────────────────────────

function emptyState(): InboxState {
  return { version: 1, items: [], updatedAt: new Date().toISOString() };
}

async function readInboxState(): Promise<InboxState> {
  try {
    const raw = await readFile(INBOX_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return emptyState();
    return parsed as InboxState;
  } catch {
    return emptyState();
  }
}

async function writeInboxState(state: InboxState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await mkdir(dirname(INBOX_FILE), { recursive: true });
  await writeFile(INBOX_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── Broadcast hook (set by gateway-start) ────────────────────────

let broadcastFn: ((event: string, data: unknown) => void) | null = null;

export function setInboxBroadcast(fn: (event: string, data: unknown) => void): void {
  broadcastFn = fn;
}

function broadcast(event: string, data: unknown): void {
  if (broadcastFn) {
    try { broadcastFn(event, data); } catch { /* non-fatal */ }
  }
}

// ── Core API ─────────────────────────────────────────────────────

/**
 * Add an item to the inbox. Deduplicates by queueItemId.
 */
export async function addInboxItem(
  item: Omit<InboxItem, "id" | "createdAt" | "status">,
): Promise<InboxItem> {
  const state = await readInboxState();

  // Dedup: don't add if same queueItemId already exists
  if (item.source.queueItemId) {
    const existing = state.items.find(
      (i) => i.source.queueItemId === item.source.queueItemId,
    );
    if (existing) return existing;
  }

  const entry: InboxItem = {
    ...item,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  state.items.unshift(entry);

  // Cap inbox size
  if (state.items.length > MAX_INBOX_ITEMS) {
    state.items = state.items.slice(0, MAX_INBOX_ITEMS);
  }

  await writeInboxState(state);
  broadcast("inbox:update", { action: "add", item: entry, count: pendingCount(state) });
  return entry;
}

/**
 * Score an inbox item. Returns the updated item.
 */
export async function scoreInboxItem(
  itemId: string,
  score: number,
  feedback?: string,
): Promise<InboxItem | null> {
  const state = await readInboxState();
  const item = state.items.find((i) => i.id === itemId);
  if (!item) return null;

  item.status = "reviewed";
  item.score = Math.max(1, Math.min(10, Math.round(score)));
  if (feedback) item.feedback = feedback;

  await writeInboxState(state);
  broadcast("inbox:update", { action: "score", itemId, score: item.score, count: pendingCount(state) });
  return item;
}

/**
 * Dismiss an inbox item without scoring.
 */
export async function dismissInboxItem(itemId: string): Promise<boolean> {
  const state = await readInboxState();
  const item = state.items.find((i) => i.id === itemId);
  if (!item) return false;

  item.status = "dismissed";
  await writeInboxState(state);
  broadcast("inbox:update", { action: "dismiss", itemId, count: pendingCount(state) });
  return true;
}

/**
 * List inbox items. Defaults to pending only.
 */
export async function listInboxItems(opts?: {
  status?: InboxItemStatus | "all";
  limit?: number;
}): Promise<{ items: InboxItem[]; total: number; pendingCount: number }> {
  const state = await readInboxState();
  const statusFilter = opts?.status ?? "pending";
  const limit = opts?.limit ?? 50;

  let filtered = state.items;
  if (statusFilter !== "all") {
    filtered = filtered.filter((i) => i.status === statusFilter);
  }

  return {
    items: filtered.slice(0, limit),
    total: filtered.length,
    pendingCount: pendingCount(state),
  };
}

/**
 * Get pending inbox count (for badge).
 */
export async function getInboxCount(): Promise<number> {
  const state = await readInboxState();
  return pendingCount(state);
}

/**
 * Mark all pending items as reviewed with default score 7.
 */
export async function markAllComplete(): Promise<number> {
  const state = await readInboxState();
  let count = 0;
  for (const item of state.items) {
    if (item.status === "pending") {
      item.status = "reviewed";
      item.score = 7;
      count++;
    }
  }
  if (count > 0) {
    await writeInboxState(state);
    broadcast("inbox:update", { action: "mark-all", count: 0 });
  }
  return count;
}

/**
 * Mark an item as reviewed in session (prevents it from appearing in inbox).
 */
export async function markReviewedInSession(queueItemId: string): Promise<void> {
  const state = await readInboxState();
  const item = state.items.find((i) => i.source.queueItemId === queueItemId);
  if (item) {
    item.reviewedInSession = true;
    item.status = "reviewed";
    await writeInboxState(state);
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function pendingCount(state: InboxState): number {
  return state.items.filter((i) => i.status === "pending").length;
}

// ── RPC Handlers ─────────────────────────────────────────────────

export const inboxHandlers: Record<string, Function> = {
  "inbox.list": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      const status = typeof params.status === "string" ? params.status as InboxItemStatus | "all" : "pending";
      const limit = typeof params.limit === "number" ? params.limit : 50;
      const result = await listInboxItems({ status, limit });
      respond(true, result);
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },

  "inbox.score": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      const itemId = String(params.itemId ?? "");
      const score = Number(params.score ?? 7);
      const feedback = typeof params.feedback === "string" ? params.feedback : undefined;
      if (!itemId) {
        respond(false, null, { code: "MISSING_PARAM", message: "itemId is required" });
        return;
      }
      const item = await scoreInboxItem(itemId, score, feedback);
      if (!item) {
        respond(false, null, { code: "NOT_FOUND", message: "Inbox item not found" });
        return;
      }

      // Self-evolution: write feedback back to source files
      if (feedback && (score <= 4 || score >= 9)) {
        try {
          const { writeFeedbackToSource } = await import("../lib/feedback-writer.js");
          await writeFeedbackToSource(item, score, feedback);
        } catch { /* non-fatal — don't break scoring */ }
      }

      respond(true, { item });
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },

  "inbox.dismiss": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      const itemId = String(params.itemId ?? "");
      if (!itemId) {
        respond(false, null, { code: "MISSING_PARAM", message: "itemId is required" });
        return;
      }
      const ok = await dismissInboxItem(itemId);
      respond(true, { dismissed: ok });
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },

  "inbox.count": async ({ respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      const count = await getInboxCount();
      respond(true, { count });
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },

  "inbox.markAllComplete": async ({ respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      const count = await markAllComplete();
      respond(true, { marked: count });
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },
};
