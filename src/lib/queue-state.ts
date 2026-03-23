import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "openclaw/plugin-sdk/infra-runtime";
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
  | "idea"
  | "optimize";

export type QueueItemStatus = "pending" | "processing" | "review" | "needs-review" | "done" | "failed";

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
  optimize: "Skill Optimizer",
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
  /** Source chat session that created or is reviewing this item */
  sessionId?: string;
  result?: {
    summary: string;
    outputPath?: string;
    prUrl?: string;
    prDiff?: string;
  };
  /** Evidence artifacts: file paths, URLs, PR links, command output */
  artifacts?: string[];
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  /** Slug of target agent-roster persona (e.g. "frontend-developer") */
  personaHint?: string;
  /** Which CLI engine to use (claude/codex/gemini). Resolved from persona or explicit. */
  engine?: "claude" | "codex" | "gemini";
  /** Which model to use (e.g. "opus", "sonnet", "claude-opus-4-6"). Passed to --model flag. */
  model?: string;
  /** Whether this item needs human approval before processing */
  needsApproval?: boolean;
  /** Workspace this item belongs to (auto-detected or explicit) */
  workspaceId?: string;
  /** Project tracking metadata — links queue items to delegated projects */
  meta?: {
    issueId?: string;
    projectId?: string;
    /** @deprecated Use issueId. Kept for backward compat with in-flight items. */
    paperclipIssueId?: string;
    /** @deprecated Use projectId. Kept for backward compat with in-flight items. */
    paperclipProjectId?: string;
    /** True for auto-injected QA review stages — gated behind project work completion */
    isQAStage?: boolean;
  };
  /** Epoch ms — if set, queue processor skips this item until Date.now() >= scheduledAt */
  scheduledAt?: number;
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
  const items = Array.isArray(value.items) ? value.items : [];

  // Migrate old meta field names (paperclipIssueId → issueId, paperclipProjectId → projectId)
  for (const item of items) {
    if (item.meta) {
      if (item.meta.paperclipIssueId && !item.meta.issueId) {
        item.meta.issueId = item.meta.paperclipIssueId;
      }
      if (item.meta.paperclipProjectId && !item.meta.projectId) {
        item.meta.projectId = item.meta.paperclipProjectId;
      }
    }
  }

  return {
    version: 1,
    items,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
  };
}

async function readStateUnsafe(): Promise<QueueState> {
  // Try main file first, then .bak if main is missing or corrupt
  for (const filepath of [QUEUE_FILE, QUEUE_FILE + ".bak"]) {
    try {
      const raw = await fs.readFile(filepath, "utf-8");
      const parsed = JSON.parse(raw);
      const state = sanitizeState(parsed);
      if (filepath !== QUEUE_FILE && state.items.length > 0) {
        // Recovered from backup — restore it as the main file
        await fs.writeFile(QUEUE_FILE, raw, "utf-8");
      }
      return state;
    } catch {
      continue;
    }
  }
  return createDefaultState();
}

async function writeStateUnsafe(state: QueueState): Promise<void> {
  const next = { ...state, updatedAt: Date.now() };
  await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });

  // Keep a rotating backup so we can recover from corruption
  try {
    await fs.access(QUEUE_FILE);
    await fs.copyFile(QUEUE_FILE, QUEUE_FILE + ".bak");
  } catch {
    // No existing file to back up — that's fine
  }

  // Atomic write: write to .tmp then rename (rename is atomic on POSIX)
  const tmp = QUEUE_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(next, null, 2) + "\n", "utf-8");
  await fs.rename(tmp, QUEUE_FILE);
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
