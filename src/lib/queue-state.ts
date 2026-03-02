import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

// ── Curated agent type taxonomy ──────────────────────────────────

export type QueueItemType =
  | "coding"
  | "research"
  | "analysis"
  | "creative"
  | "review"
  | "ops"
  | "task"
  | "url"
  | "idea";

export type QueueItemStatus = "pending" | "processing" | "review" | "done" | "failed";

/** Human-readable agent role names shown on MC badges */
export const AGENT_ROLE_NAMES: Record<QueueItemType, string> = {
  coding: "Builder",
  research: "Researcher",
  analysis: "Analyst",
  creative: "Creative",
  review: "Reviewer",
  ops: "Ops",
  task: "Agent",
  url: "Reader",
  idea: "Explorer",
};

// ── Queue item type ──────────────────────────────────────────────

export type QueueItem = {
  id: string;
  type: QueueItemType;
  title: string;
  description?: string;
  url?: string;
  repoRoot?: string;
  priority: "high" | "normal" | "low";
  status: QueueItemStatus;
  source: "chat" | "brief" | "cron" | "proactive" | "manual";
  sourceTaskId?: string;
  pid?: number;
  retryCount?: number;
  lastError?: string;
  /** The full prompt sent to the agent (stored for session context) */
  agentPrompt?: string;
  result?: {
    summary: string;
    outputPath?: string;
    prUrl?: string;
    prDiff?: string;
  };
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  /** Slug of target agent-roster persona (e.g. "frontend-developer") */
  personaHint?: string;
  /** Which CLI engine to use (claude/codex/gemini). Resolved from persona or explicit. */
  engine?: "claude" | "codex" | "gemini";
  /** Whether the item requires human approval before execution (set by trust gating). */
  needsApproval?: boolean;
  /** Structured handoff context from a predecessor agent */
  handoff?: {
    fromAgent: string;
    fromTaskId: string;
    summary: string;
    deliverable: string;
  };
};

export type QueueState = {
  version: 1;
  items: QueueItem[];
  updatedAt: number;
};

// ── File paths + lock config ─────────────────────────────────────

export const QUEUE_FILE = path.join(DATA_DIR, "queue.json");

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

// ── State helpers ────────────────────────────────────────────────

function createDefaultState(): QueueState {
  return { version: 1, items: [], updatedAt: Date.now() };
}

function sanitizeState(input: unknown): QueueState {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createDefaultState();
  }
  const value = input as Partial<QueueState>;
  return {
    version: 1,
    items: Array.isArray(value.items) ? value.items : [],
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
  };
}

async function readStateUnsafe(): Promise<QueueState> {
  try {
    const raw = await fs.readFile(QUEUE_FILE, "utf-8");
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

async function writeStateUnsafe(state: QueueState): Promise<void> {
  const next = { ...state, updatedAt: Date.now() };
  await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });
  await fs.writeFile(QUEUE_FILE, JSON.stringify(next, null, 2) + "\n", "utf-8");
}

// ── Public API ───────────────────────────────────────────────────

export async function readQueueState(): Promise<QueueState> {
  return withFileLock(QUEUE_FILE, LOCK_OPTIONS, async () => readStateUnsafe());
}

export async function updateQueueState<T>(
  updater: (state: QueueState) => Promise<T> | T,
): Promise<{ state: QueueState; result: T }> {
  return withFileLock(QUEUE_FILE, LOCK_OPTIONS, async () => {
    const state = await readStateUnsafe();
    const result = await updater(state);
    await writeStateUnsafe(state);
    return { state, result };
  });
}

export function newQueueItemId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  return `${slug || "item"}-${suffix}`;
}
