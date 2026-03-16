/**
 * impact-ledger.ts — Hours & $$ Saved Impact Tracker.
 *
 * Tracks the estimated time and dollar value saved by GodMode workflows.
 * Each workflow execution (queue task, daily brief, meeting prep, etc.)
 * auto-logs an entry with configurable time estimates and hourly rate.
 *
 * Source of truth: ~/godmode/data/impact-ledger.json
 *
 * RPC methods:
 *   impact.log       — log a new impact entry
 *   impact.summary   — get rolling daily/weekly/monthly/all-time totals
 *   impact.history   — get recent entries with optional filters
 *   impact.config    — get/set hourly rate and per-workflow time estimates
 */

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { withFileLock } from "openclaw/plugin-sdk";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const STATE_FILE = join(DATA_DIR, "impact-ledger.json");
const MAX_ENTRIES = 2000;

// ── Types ────────────────────────────────────────────────────────────

export type ImpactEntry = {
  id: string;
  workflow: string;
  timestamp: string;
  minutesSaved: number;
  dollarValue: number;
  source: "trust-rate" | "queue-complete" | "session" | "manual" | "auto";
  sessionId?: string;
  note?: string;
};

export type ImpactConfig = {
  hourlyRate: number;
  /** Estimated minutes saved per workflow type */
  workflowMinutes: Record<string, number>;
};

export type ImpactLedgerState = {
  entries: ImpactEntry[];
  config: ImpactConfig;
  createdAt: string;
  updatedAt: string;
};

/** Default estimated minutes per workflow type */
const DEFAULT_WORKFLOW_MINUTES: Record<string, number> = {
  "daily brief": 30,
  "meeting prep": 15,
  "meeting debrief": 20,
  "inbox triage": 15,
  research: 60,
  coding: 120,
  creative: 45,
  analysis: 60,
  review: 30,
  ops: 20,
  task: 30,
  url: 10,
  idea: 15,
  "chat session": 10,
};

const DEFAULT_HOURLY_RATE = 150;

// ── Helpers ──────────────────────────────────────────────────────────

const LOCK_OPTIONS = {
  retries: { retries: 20, factor: 1.35, minTimeout: 20, maxTimeout: 250, randomize: true },
  stale: 15_000,
};

function emptyState(): ImpactLedgerState {
  const now = new Date().toISOString();
  return {
    entries: [],
    config: {
      hourlyRate: DEFAULT_HOURLY_RATE,
      workflowMinutes: { ...DEFAULT_WORKFLOW_MINUTES },
    },
    createdAt: now,
    updatedAt: now,
  };
}

async function readStateUnsafe(): Promise<ImpactLedgerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const state = JSON.parse(raw) as ImpactLedgerState;
    // Ensure config has defaults for any missing workflow types
    if (!state.config) {
      state.config = { hourlyRate: DEFAULT_HOURLY_RATE, workflowMinutes: { ...DEFAULT_WORKFLOW_MINUTES } };
    }
    if (!state.config.workflowMinutes) {
      state.config.workflowMinutes = { ...DEFAULT_WORKFLOW_MINUTES };
    }
    return state;
  } catch {
    return emptyState();
  }
}

async function writeStateUnsafe(state: ImpactLedgerState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await secureMkdir(DATA_DIR);
  await secureWriteFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function readState(): Promise<ImpactLedgerState> {
  return withFileLock(STATE_FILE, LOCK_OPTIONS, async () => readStateUnsafe());
}

async function updateState<T>(
  updater: (state: ImpactLedgerState) => T | Promise<T>,
): Promise<{ state: ImpactLedgerState; result: T }> {
  return withFileLock(STATE_FILE, LOCK_OPTIONS, async () => {
    const state = await readStateUnsafe();
    const result = await updater(state);
    await writeStateUnsafe(state);
    return { state, result };
  });
}

// ── Programmatic API (used by trust-tracker + queue-processor) ───────

/**
 * Resolve how many minutes a workflow saves.
 * Checks the user's custom config first, then defaults.
 */
function resolveMinutes(workflow: string, config: ImpactConfig): number {
  const normalized = workflow.trim().toLowerCase();
  // Check user config first
  for (const [key, val] of Object.entries(config.workflowMinutes)) {
    if (key.toLowerCase() === normalized) return val;
  }
  // Check defaults
  for (const [key, val] of Object.entries(DEFAULT_WORKFLOW_MINUTES)) {
    if (key.toLowerCase() === normalized) return val;
  }
  // Fallback: generic task
  return DEFAULT_WORKFLOW_MINUTES.task ?? 30;
}

/**
 * Log an impact entry programmatically (no RPC context needed).
 * Called by trust-tracker on rating and queue-processor on completion.
 */
export async function logImpact(opts: {
  workflow: string;
  source: ImpactEntry["source"];
  sessionId?: string;
  note?: string;
  minutesOverride?: number;
}): Promise<ImpactEntry> {
  let entry!: ImpactEntry;

  await updateState((state) => {
    const minutes = opts.minutesOverride ?? resolveMinutes(opts.workflow, state.config);
    const dollarValue = Math.round((minutes / 60) * state.config.hourlyRate * 100) / 100;

    entry = {
      id: randomUUID(),
      workflow: opts.workflow.trim(),
      timestamp: new Date().toISOString(),
      minutesSaved: minutes,
      dollarValue,
      source: opts.source,
      ...(opts.sessionId ? { sessionId: opts.sessionId } : {}),
      ...(opts.note ? { note: opts.note } : {}),
    };

    state.entries.push(entry);
    if (state.entries.length > MAX_ENTRIES) {
      state.entries = state.entries.slice(-MAX_ENTRIES);
    }
  });

  return entry;
}

/**
 * Get impact rollup for a given time window.
 */
export async function getImpactSummary(daysBack?: number): Promise<{
  totalMinutes: number;
  totalDollars: number;
  count: number;
  byWorkflow: Record<string, { minutes: number; dollars: number; count: number }>;
}> {
  const state = await readState();
  const cutoff = daysBack
    ? Date.now() - daysBack * 24 * 60 * 60 * 1000
    : 0;

  const filtered = cutoff > 0
    ? state.entries.filter((e) => Date.parse(e.timestamp) >= cutoff)
    : state.entries;

  const byWorkflow: Record<string, { minutes: number; dollars: number; count: number }> = {};
  let totalMinutes = 0;
  let totalDollars = 0;

  for (const entry of filtered) {
    totalMinutes += entry.minutesSaved;
    totalDollars += entry.dollarValue;

    const key = entry.workflow;
    if (!byWorkflow[key]) {
      byWorkflow[key] = { minutes: 0, dollars: 0, count: 0 };
    }
    byWorkflow[key].minutes += entry.minutesSaved;
    byWorkflow[key].dollars += entry.dollarValue;
    byWorkflow[key].count++;
  }

  return {
    totalMinutes,
    totalDollars: Math.round(totalDollars * 100) / 100,
    count: filtered.length,
    byWorkflow,
  };
}

/**
 * Check if a session already has an impact entry (avoids double-counting
 * sessions that were also logged via queue-complete or trust-rate).
 */
export async function hasSessionImpact(sessionId: string): Promise<boolean> {
  const state = await readState();
  return state.entries.some((e) => e.sessionId === sessionId);
}

// ── RPC Handlers ─────────────────────────────────────────────────────

export const impactLedgerHandlers: GatewayRequestHandlers = {
  "impact.log": async ({ params, respond }) => {
    const { workflow, source, sessionId, note, minutesOverride } = params as {
      workflow?: string;
      source?: string;
      sessionId?: string;
      note?: string;
      minutesOverride?: number;
    };

    if (!workflow || typeof workflow !== "string") {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow is required" });
      return;
    }

    const validSources: ImpactEntry["source"][] = ["trust-rate", "queue-complete", "session", "manual", "auto"];
    const resolvedSource = validSources.includes(source as ImpactEntry["source"])
      ? (source as ImpactEntry["source"])
      : "manual";

    const entry = await logImpact({
      workflow,
      source: resolvedSource,
      sessionId,
      note,
      minutesOverride: typeof minutesOverride === "number" ? minutesOverride : undefined,
    });

    respond(true, {
      entry,
      message: `Logged ${entry.minutesSaved}m saved ($${entry.dollarValue}) for "${entry.workflow}".`,
    });
  },

  "impact.summary": async ({ params, respond }) => {
    const { daysBack } = (params ?? {}) as { daysBack?: number };

    const today = await getImpactSummary(1);
    const week = await getImpactSummary(7);
    const month = await getImpactSummary(30);
    const allTime = await getImpactSummary();
    const custom = typeof daysBack === "number" ? await getImpactSummary(daysBack) : null;

    respond(true, {
      today,
      week,
      month,
      allTime,
      ...(custom ? { custom } : {}),
    });
  },

  "impact.history": async ({ params, respond }) => {
    const { workflow, limit, daysBack } = (params ?? {}) as {
      workflow?: string;
      limit?: number;
      daysBack?: number;
    };

    const state = await readState();
    let filtered = state.entries;

    if (workflow) {
      const normalized = workflow.trim().toLowerCase();
      filtered = filtered.filter((e) => e.workflow.toLowerCase() === normalized);
    }

    if (daysBack && daysBack > 0) {
      const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((e) => Date.parse(e.timestamp) >= cutoff);
    }

    // Most recent first
    filtered = filtered.slice().reverse();

    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    respond(true, { entries: filtered, total: filtered.length });
  },

  "impact.config": async ({ params, respond }) => {
    const { hourlyRate, workflowMinutes } = (params ?? {}) as {
      hourlyRate?: number;
      workflowMinutes?: Record<string, number>;
    };

    // If no params provided, return current config
    if (hourlyRate === undefined && !workflowMinutes) {
      const state = await readState();
      respond(true, { config: state.config });
      return;
    }

    const { state } = await updateState((s) => {
      if (typeof hourlyRate === "number" && hourlyRate > 0) {
        s.config.hourlyRate = hourlyRate;
      }
      if (workflowMinutes && typeof workflowMinutes === "object") {
        for (const [key, val] of Object.entries(workflowMinutes)) {
          if (typeof val === "number" && val >= 0) {
            s.config.workflowMinutes[key] = val;
          }
        }
      }
    });

    respond(true, { config: state.config, message: "Impact config updated." });
  },
};
