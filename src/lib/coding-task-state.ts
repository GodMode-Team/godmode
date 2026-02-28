import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

export type CodingTaskStatus = "queued" | "running" | "validating" | "done" | "failed";
export type CodingTaskMode = "write" | "read";

export type SwarmStage = "design" | "build" | "qc";

export type SwarmStageState = {
  status: "pending" | "running" | "done" | "failed";
  pid?: number;
  startedAt?: number;
  completedAt?: number;
};

export type SwarmState = {
  enabled: boolean;
  currentStage: SwarmStage;
  stages: Record<SwarmStage, SwarmStageState>;
};

export type CodingTask = {
  id: string;
  description: string;
  status: CodingTaskStatus;
  mode: CodingTaskMode;
  repoRoot: string;
  branch: string;
  worktreePath: string;
  scopeGlobs: string[];
  parallelSafe: boolean;
  model?: string;
  thinking?: string;
  runId?: string;
  childSessionKey?: string;
  pid?: number;
  prNumber?: number;
  prUrl?: string;
  swarm?: SwarmState;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
};

export type CodingTaskState = {
  version: 1;
  tasks: CodingTask[];
  updatedAt: number;
};

export const CODING_TASKS_FILE = path.join(DATA_DIR, "coding-tasks.json");

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

function createDefaultState(): CodingTaskState {
  return { version: 1, tasks: [], updatedAt: Date.now() };
}

function sanitizeState(input: unknown): CodingTaskState {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createDefaultState();
  }
  const value = input as Partial<CodingTaskState>;
  return {
    version: 1,
    tasks: Array.isArray(value.tasks) ? value.tasks : [],
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
  };
}

async function readStateUnsafe(): Promise<CodingTaskState> {
  try {
    const raw = await fs.readFile(CODING_TASKS_FILE, "utf-8");
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

async function writeStateUnsafe(state: CodingTaskState): Promise<void> {
  const next = { ...state, updatedAt: Date.now() };
  await fs.mkdir(path.dirname(CODING_TASKS_FILE), { recursive: true });
  await fs.writeFile(CODING_TASKS_FILE, JSON.stringify(next, null, 2) + "\n", "utf-8");
}

export async function readCodingTaskState(): Promise<CodingTaskState> {
  return withFileLock(CODING_TASKS_FILE, LOCK_OPTIONS, async () => readStateUnsafe());
}

export async function updateCodingTaskState<T>(
  updater: (state: CodingTaskState) => Promise<T> | T,
): Promise<{ state: CodingTaskState; result: T }> {
  return withFileLock(CODING_TASKS_FILE, LOCK_OPTIONS, async () => {
    const state = await readStateUnsafe();
    const result = await updater(state);
    await writeStateUnsafe(state);
    return { state, result };
  });
}

export function newTaskId(description: string): string {
  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  return `${slug || "task"}-${suffix}`;
}

export function classifyTaskMode(taskText: string): CodingTaskMode {
  const text = taskText.trim().toLowerCase();
  if (!text) return "write";

  const readRegex =
    /\b(review|analy[sz]e|investigate|diagnose|summari[sz]e|plan|scope|research|brainstorm|document|explain)\b/;
  if (readRegex.test(text)) return "read";

  return "write";
}
