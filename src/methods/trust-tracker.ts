/**
 * trust-tracker.ts — Gateway methods for Trust Tracker.
 *
 * Lightweight, scoped feedback loop: user picks 3-5 workflow categories
 * to track, rates tasks 1-5 after completion, and the agent surfaces
 * what it learned in future similar tasks.
 *
 * Source of truth: ~/godmode/data/trust-tracker.json
 */

import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const STATE_FILE = join(DATA_DIR, "trust-tracker.json");
const MAX_WORKFLOWS = 5;
const MAX_RATINGS = 500;

// --- Types ---

export type TrustRating = {
  id: string;
  workflow: string;
  rating: 1 | 2 | 3 | 4 | 5;
  note?: string;
  sessionId?: string;
  timestamp: string;
};

export type TrustTrackerState = {
  workflows: string[];
  ratings: TrustRating[];
  createdAt: string;
  updatedAt: string;
};

export type WorkflowSummary = {
  workflow: string;
  avgRating: number;
  count: number;
  trend: "improving" | "declining" | "stable" | "new";
  recentNotes: string[];
};

// --- Helpers ---

function emptyState(): TrustTrackerState {
  const now = new Date().toISOString();
  return {
    workflows: [],
    ratings: [],
    createdAt: now,
    updatedAt: now,
  };
}

async function readState(): Promise<TrustTrackerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as TrustTrackerState;
  } catch {
    return emptyState();
  }
}

async function writeState(state: TrustTrackerState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

function computeSummary(state: TrustTrackerState, daysBack = 30): WorkflowSummary[] {
  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
  const summaries: WorkflowSummary[] = [];

  for (const workflow of state.workflows) {
    const all = state.ratings.filter((r) => r.workflow === workflow);
    const recent = all.filter((r) => Date.parse(r.timestamp) >= cutoff);
    const count = all.length;

    if (count === 0) {
      summaries.push({ workflow, avgRating: 0, count: 0, trend: "new", recentNotes: [] });
      continue;
    }

    const avg = all.reduce((sum, r) => sum + r.rating, 0) / count;

    // Trend: compare first half avg to second half avg
    let trend: WorkflowSummary["trend"] = "stable";
    if (recent.length >= 4) {
      const mid = Math.floor(recent.length / 2);
      const firstHalf = recent.slice(0, mid);
      const secondHalf = recent.slice(mid);
      const firstAvg = firstHalf.reduce((s, r) => s + r.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((s, r) => s + r.rating, 0) / secondHalf.length;
      if (secondAvg - firstAvg > 0.3) trend = "improving";
      else if (firstAvg - secondAvg > 0.3) trend = "declining";
    } else if (count < 3) {
      trend = "new";
    }

    // Recent notes (last 3 with content)
    const recentNotes = all
      .filter((r) => r.note)
      .slice(-3)
      .map((r) => r.note!);

    summaries.push({
      workflow,
      avgRating: Math.round(avg * 10) / 10,
      count,
      trend,
      recentNotes,
    });
  }

  return summaries;
}

// --- Handlers ---

export const trustTrackerHandlers: GatewayRequestHandlers = {
  "trust.workflows.get": async ({ respond }) => {
    const state = await readState();
    respond(true, { workflows: state.workflows });
  },

  "trust.workflows.set": async ({ params, respond, context }) => {
    const { workflows } = params as { workflows?: string[] };
    if (!Array.isArray(workflows)) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflows must be an array of strings" });
      return;
    }
    const cleaned = workflows
      .filter((w): w is string => typeof w === "string" && w.trim().length > 0)
      .map((w) => w.trim())
      .slice(0, MAX_WORKFLOWS);

    const state = await readState();
    state.workflows = cleaned;
    await writeState(state);
    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, { workflows: state.workflows });
  },

  "trust.rate": async ({ params, respond, context }) => {
    const { workflow, rating, note, sessionId } = params as {
      workflow?: string;
      rating?: number;
      note?: string;
      sessionId?: string;
    };

    if (!workflow || typeof workflow !== "string") {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow is required" });
      return;
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "rating must be an integer 1-5" });
      return;
    }

    const state = await readState();

    // Auto-add workflow if not tracked and under limit
    const normalizedWorkflow = workflow.trim();
    if (!state.workflows.includes(normalizedWorkflow) && state.workflows.length < MAX_WORKFLOWS) {
      state.workflows.push(normalizedWorkflow);
    }

    const entry: TrustRating = {
      id: randomUUID(),
      workflow: normalizedWorkflow,
      rating: rating as TrustRating["rating"],
      ...(note ? { note: note.trim() } : {}),
      ...(sessionId ? { sessionId } : {}),
      timestamp: new Date().toISOString(),
    };

    state.ratings.push(entry);

    // Cap at MAX_RATINGS (FIFO trim)
    if (state.ratings.length > MAX_RATINGS) {
      state.ratings = state.ratings.slice(-MAX_RATINGS);
    }

    await writeState(state);
    context?.broadcast?.("trust:update", { entry, workflows: state.workflows });
    respond(true, { entry });
  },

  "trust.history": async ({ params, respond }) => {
    const { workflow, limit, daysBack } = (params ?? {}) as {
      workflow?: string;
      limit?: number;
      daysBack?: number;
    };

    const state = await readState();
    let filtered = state.ratings;

    if (workflow) {
      filtered = filtered.filter((r) => r.workflow === workflow);
    }

    if (daysBack && daysBack > 0) {
      const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((r) => Date.parse(r.timestamp) >= cutoff);
    }

    // Most recent first
    filtered = filtered.slice().reverse();

    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    respond(true, { ratings: filtered, total: filtered.length });
  },

  "trust.summary": async ({ params, respond }) => {
    const { daysBack } = (params ?? {}) as { daysBack?: number };
    const state = await readState();
    const summaries = computeSummary(state, daysBack ?? 30);
    respond(true, { summaries, workflows: state.workflows });
  },
};

// --- Exported for prompt hook ---

export { readState as readTrustState, computeSummary as computeTrustSummary };
