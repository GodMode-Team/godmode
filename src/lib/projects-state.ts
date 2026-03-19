/**
 * Projects State — Native project grouping for agent delegation.
 *
 * A "project" is a group of queue items that belong to one delegation brief.
 * Stored as a simple JSON file + file lock (same pattern as queue-state).
 * Queue-processor is the sole execution engine; this is just the grouping layer.
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";
import type { QueueItemType } from "./queue-state.js";

// ── Types ────────────────────────────────────────────────────────

export interface ProjectIssue {
  issueId: string;
  title: string;
  personaSlug: string;
  queueItemId: string;
}

export interface DelegatedProject {
  projectId: string;
  title: string;
  description: string;
  issues: ProjectIssue[];
  createdAt: number;
  completedAt?: number;
  status: "active" | "completed" | "failed";
  /** Session that initiated the delegation — results route back here */
  sessionKey?: string;
}

export interface ProjectBrief {
  title: string;
  description: string;
  issues: Array<{
    title: string;
    description: string;
    personaHint?: string;
    priority?: "critical" | "high" | "medium" | "low";
  }>;
}

export interface ProjectsState {
  version: 1;
  projects: DelegatedProject[];
  updatedAt: number;
}

// ── File paths + lock config ─────────────────────────────────────

export const PROJECTS_FILE = path.join(DATA_DIR, "delegated-projects.json");

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

function createDefaultState(): ProjectsState {
  return { version: 1, projects: [], updatedAt: Date.now() };
}

function sanitizeState(input: unknown): ProjectsState {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createDefaultState();
  }
  const value = input as Partial<ProjectsState>;
  return {
    version: 1,
    projects: Array.isArray(value.projects) ? value.projects : [],
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
  };
}

async function readStateUnsafe(): Promise<ProjectsState> {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

async function writeStateUnsafe(state: ProjectsState): Promise<void> {
  const next = { ...state, updatedAt: Date.now() };
  await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
  const tmp = PROJECTS_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(next, null, 2) + "\n", "utf-8");
  await fs.rename(tmp, PROJECTS_FILE);
}

// ── Public API ───────────────────────────────────────────────────

export async function readProjects(): Promise<ProjectsState> {
  return withFileLock(PROJECTS_FILE, LOCK_OPTIONS, async () => readStateUnsafe());
}

export async function updateProjects<T>(
  updater: (state: ProjectsState) => Promise<T> | T,
): Promise<{ state: ProjectsState; result: T }> {
  return withFileLock(PROJECTS_FILE, LOCK_OPTIONS, async () => {
    const state = await readStateUnsafe();
    const result = await updater(state);
    await writeStateUnsafe(state);
    return { state, result };
  });
}

export async function getProject(projectId: string): Promise<DelegatedProject | null> {
  const state = await readProjects();
  return state.projects.find(p => p.projectId === projectId) ?? null;
}

export async function listProjects(): Promise<DelegatedProject[]> {
  const state = await readProjects();
  return state.projects;
}

export async function clearProjects(): Promise<void> {
  await updateProjects((state) => {
    state.projects = [];
  });
}

export function newProjectId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export function newIssueId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

// ── Helpers ──────────────────────────────────────────────────────

/** Map persona hints / titles to queue item types for execution */
export function inferTaskType(hint: string): QueueItemType {
  const h = hint.toLowerCase();
  if (h.includes("engineer") || h.includes("developer") || h.includes("frontend") || h.includes("build") || h.includes("code")) return "coding";
  if (h.includes("research") || h.includes("analyst") || h.includes("seo")) return "research";
  if (h.includes("design") || h.includes("creative") || h.includes("brand") || h.includes("copy") || h.includes("content") || h.includes("writer")) return "creative";
  if (h.includes("review") || h.includes("qa") || h.includes("check")) return "review";
  if (h.includes("ops") || h.includes("deploy") || h.includes("runner")) return "ops";
  return "task";
}

/** Pick the right QA persona based on what the project contains */
export function pickQAPersona(issues: ProjectBrief["issues"]): string {
  const hints = issues.map((i) => (i.personaHint || i.title).toLowerCase()).join(" ");
  if (hints.includes("content") || hints.includes("copy") || hints.includes("writer") || hints.includes("creative") || hints.includes("vsl") || hints.includes("script")) {
    return "qa-copy-reviewer";
  }
  if (hints.includes("research") || hints.includes("fact") || hints.includes("analysis") || hints.includes("data")) {
    return "qa-fact-checker";
  }
  return "qa-reviewer";
}
