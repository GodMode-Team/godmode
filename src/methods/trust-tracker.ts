/**
 * trust-tracker.ts — Gateway methods for Trust Tracker.
 *
 * Lightweight, scoped feedback loop: user picks 3-5 workflow categories
 * to track, rates tasks 1-10 after completion. After 10 ratings the
 * running average becomes the workflow's "trust score." Below a 7 the
 * agent proactively asks for improvement feedback which gets routed
 * back into the workflow's context so it scores higher next time.
 *
 * Source of truth: ~/godmode/data/trust-tracker.json
 */

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { withFileLock } from "openclaw/plugin-sdk/infra-runtime";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const STATE_FILE = join(DATA_DIR, "trust-tracker.json");
export const MAX_WORKFLOWS = 15;
const MAX_RATINGS = 500;
const MAX_DAILY_RATINGS = 90; // ~3 months of daily ratings
/** Number of ratings needed before a trust score is assigned. */
export const SCORE_THRESHOLD = 10;
/** Trust score below this triggers feedback collection. */
export const FEEDBACK_THRESHOLD = 7;

// --- Types ---

export type TrustRating = {
  id: string;
  workflow: string;
  rating: number; // 1-10
  note?: string;
  feedback?: string; // improvement feedback when score < 7
  sessionId?: string;
  timestamp: string;
};

export type DailyRating = {
  id: string;
  date: string; // YYYY-MM-DD
  rating: number; // 1-10
  note?: string;
  /** Workflows that ran on this day — for correlating daily ratings with workflow performance. */
  activeWorkflows?: string[];
  timestamp: string;
};

export type TrustTrackerState = {
  workflows: string[];
  ratings: TrustRating[];
  dailyRatings?: DailyRating[];
  /** Per-workflow feedback that gets injected into skill context. */
  workflowFeedback: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowSummary = {
  workflow: string;
  avgRating: number;
  count: number;
  /** Assigned after SCORE_THRESHOLD (10) ratings — the running average. */
  trustScore: number | null;
  /** True when trust score is below FEEDBACK_THRESHOLD (7). */
  needsFeedback: boolean;
  trend: "improving" | "declining" | "stable" | "new";
  recentNotes: string[];
  recentFeedback: string[];
};

// --- Helpers ---

const LOCK_OPTIONS = {
  retries: { retries: 20, factor: 1.35, minTimeout: 20, maxTimeout: 250, randomize: true },
  stale: 15_000,
};

function emptyState(): TrustTrackerState {
  const now = new Date().toISOString();
  return {
    workflows: [],
    ratings: [],
    workflowFeedback: {},
    createdAt: now,
    updatedAt: now,
  };
}

async function readStateUnsafe(): Promise<TrustTrackerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as TrustTrackerState;
  } catch {
    return emptyState();
  }
}

async function writeStateUnsafe(state: TrustTrackerState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await secureMkdir(DATA_DIR);
  await secureWriteFile(STATE_FILE, JSON.stringify(state, null, 2));
}

/** Read state with file lock (for read-only access). */
async function readState(): Promise<TrustTrackerState> {
  return withFileLock(STATE_FILE, LOCK_OPTIONS, async () => readStateUnsafe());
}

/** Read-modify-write with file lock (for mutations). */
async function updateState<T>(
  updater: (state: TrustTrackerState) => T | Promise<T>,
): Promise<{ state: TrustTrackerState; result: T }> {
  return withFileLock(STATE_FILE, LOCK_OPTIONS, async () => {
    const state = await readStateUnsafe();
    const result = await updater(state);
    await writeStateUnsafe(state);
    return { state, result };
  });
}

function computeSummary(state: TrustTrackerState, daysBack = 30): WorkflowSummary[] {
  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
  const summaries: WorkflowSummary[] = [];

  for (const workflow of state.workflows) {
    const all = state.ratings.filter((r) => r.workflow === workflow);
    const recent = all.filter((r) => Date.parse(r.timestamp) >= cutoff);
    const count = all.length;

    if (count === 0) {
      summaries.push({
        workflow, avgRating: 0, count: 0, trustScore: null,
        needsFeedback: false, trend: "new", recentNotes: [], recentFeedback: [],
      });
      continue;
    }

    const avg = all.reduce((sum, r) => sum + r.rating, 0) / count;
    const roundedAvg = Math.round(avg * 10) / 10;

    // Trust score is the running average, assigned after SCORE_THRESHOLD ratings
    const trustScore = count >= SCORE_THRESHOLD ? roundedAvg : null;
    const needsFeedback = trustScore !== null && trustScore < FEEDBACK_THRESHOLD;

    // Trend: compare first half avg to second half avg
    let trend: WorkflowSummary["trend"] = "stable";
    if (recent.length >= 4) {
      const mid = Math.floor(recent.length / 2);
      const firstHalf = recent.slice(0, mid);
      const secondHalf = recent.slice(mid);
      const firstAvg = firstHalf.reduce((s, r) => s + r.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((s, r) => s + r.rating, 0) / secondHalf.length;
      if (secondAvg - firstAvg > 0.5) trend = "improving";
      else if (firstAvg - secondAvg > 0.5) trend = "declining";
    } else if (count < 3) {
      trend = "new";
    }

    // Recent notes (last 3 with content)
    const recentNotes = all
      .filter((r) => r.note)
      .slice(-3)
      .map((r) => r.note!);

    // Recent feedback (last 3 improvement suggestions)
    const recentFeedback = (state.workflowFeedback[workflow] ?? []).slice(-3);

    summaries.push({
      workflow,
      avgRating: roundedAvg,
      count,
      trustScore,
      needsFeedback,
      trend,
      recentNotes,
      recentFeedback,
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

    const { state } = await updateState((s) => {
      s.workflows = cleaned;
    });
    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, { workflows: state.workflows });
  },

  "trust.workflows.add": async ({ params, respond, context }) => {
    const { workflow } = params as { workflow?: string };
    if (!workflow || typeof workflow !== "string" || !workflow.trim()) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow name is required" });
      return;
    }
    const normalized = workflow.trim();

    const { state, result } = await updateState((s) => {
      if (s.workflows.some((w) => w.toLowerCase() === normalized.toLowerCase())) {
        return { added: false, reason: "already_tracked" as const };
      }
      if (s.workflows.length >= MAX_WORKFLOWS) {
        return { added: false, reason: "limit_reached" as const };
      }
      s.workflows.push(normalized);
      return { added: true, reason: null };
    });

    if (!result.added) {
      respond(true, {
        added: false,
        reason: result.reason,
        message: result.reason === "already_tracked"
          ? `"${normalized}" is already being tracked.`
          : `You're tracking ${MAX_WORKFLOWS} workflows already. Remove one first to add "${normalized}".`,
        workflows: state.workflows,
      });
      return;
    }

    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, {
      added: true,
      message: `Now tracking "${normalized}". I'll ask for a 1-10 rating after each ${normalized} task. After 10 ratings you'll get a trust score.`,
      workflows: state.workflows,
    });
  },

  "trust.workflows.remove": async ({ params, respond, context }) => {
    const { workflow } = params as { workflow?: string };
    if (!workflow || typeof workflow !== "string") {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow name is required" });
      return;
    }
    const { state, result } = await updateState((s) => {
      const idx = s.workflows.findIndex((w) => w.toLowerCase() === workflow.trim().toLowerCase());
      if (idx === -1) return { removed: false, name: "" };
      const name = s.workflows.splice(idx, 1)[0];
      return { removed: true, name };
    });

    if (!result.removed) {
      respond(true, {
        removed: false,
        message: `"${workflow}" is not being tracked.`,
        workflows: state.workflows,
      });
      return;
    }
    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, {
      removed: true,
      message: `Stopped tracking "${result.name}".`,
      workflows: state.workflows,
    });
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
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "rating must be an integer 1-10" });
      return;
    }

    const normalizedWorkflow = workflow.trim();
    const entry: TrustRating = {
      id: randomUUID(),
      workflow: normalizedWorkflow,
      rating,
      ...(note ? { note: note.trim() } : {}),
      ...(sessionId ? { sessionId } : {}),
      timestamp: new Date().toISOString(),
    };

    const { state } = await updateState((s) => {
      // Auto-add workflow if not tracked and under limit
      if (!s.workflows.includes(normalizedWorkflow) && s.workflows.length < MAX_WORKFLOWS) {
        s.workflows.push(normalizedWorkflow);
      }
      s.ratings.push(entry);
      // Cap at MAX_RATINGS (FIFO trim)
      if (s.ratings.length > MAX_RATINGS) {
        s.ratings = s.ratings.slice(-MAX_RATINGS);
      }
    });

    // Compute trust score for this workflow
    const workflowRatings = state.ratings.filter((r) => r.workflow === normalizedWorkflow);
    const count = workflowRatings.length;
    const avg = workflowRatings.reduce((s, r) => s + r.rating, 0) / count;
    const trustScore = count >= SCORE_THRESHOLD ? Math.round(avg * 10) / 10 : null;
    const needsFeedback = trustScore !== null && trustScore < FEEDBACK_THRESHOLD;

    // REMOVED (v2 slim): impact-ledger logging

    context?.broadcast?.("trust:update", { entry, workflows: state.workflows, trustScore });
    respond(true, {
      entry,
      count,
      trustScore,
      needsFeedback,
      ratingsUntilScore: count < SCORE_THRESHOLD ? SCORE_THRESHOLD - count : 0,
      message: needsFeedback
        ? `Trust score for "${normalizedWorkflow}" is ${trustScore}/10. What could make this better?`
        : trustScore !== null
          ? `Trust score for "${normalizedWorkflow}": ${trustScore}/10`
          : `Rating logged (${count}/${SCORE_THRESHOLD} until trust score is assigned)`,
    });
  },

  "trust.feedback": async ({ params, respond, context }) => {
    const { workflow, feedback } = params as { workflow?: string; feedback?: string };
    if (!workflow || typeof workflow !== "string" || !workflow.trim()) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow is required" });
      return;
    }
    if (!feedback || typeof feedback !== "string" || !feedback.trim()) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "feedback text is required" });
      return;
    }

    const normalized = workflow.trim();

    const { state } = await updateState((s) => {
      if (!s.workflowFeedback) s.workflowFeedback = {};
      if (!s.workflowFeedback[normalized]) s.workflowFeedback[normalized] = [];
      s.workflowFeedback[normalized].push(feedback.trim());
      if (s.workflowFeedback[normalized].length > 20) {
        s.workflowFeedback[normalized] = s.workflowFeedback[normalized].slice(-20);
      }
    });

    // Write feedback directly into the persona/skill markdown file
    let fileResult: { applied: boolean; filePath?: string; consolidated?: boolean } = { applied: false };
    try {
      const { applyFeedbackToFile } = await import("../lib/trust-refinement.js");
      fileResult = await applyFeedbackToFile(normalized, feedback.trim());
    } catch (err) {
      console.error("[TrustTracker] Failed to apply feedback to file:", err);
    }

    context?.broadcast?.("trust:feedback", { workflow: normalized, feedback: feedback.trim() });
    respond(true, {
      stored: true,
      appliedToFile: fileResult.applied,
      message: fileResult.applied
        ? `Feedback written to ${fileResult.consolidated ? "consolidated " : ""}persona/skill file. It'll take effect on the next run.`
        : `Feedback noted for "${normalized}". I'll apply this next time.`,
      feedbackCount: (state.workflowFeedback[normalized] ?? []).length,
    });
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

  /**
   * Dashboard-optimized endpoint: returns per-workflow summaries with
   * trust scores, trends, and an overall weighted trust score.
   */
  "trust.dashboard": async ({ params, respond }) => {
    const { daysBack } = (params ?? {}) as { daysBack?: number };
    const state = await readState();
    const summaries = computeSummary(state, daysBack ?? 30);

    // Compute overall trust score (weighted by count)
    const scored = summaries.filter((s) => s.trustScore !== null && s.count > 0);
    let overallScore: number | null = null;
    if (scored.length > 0) {
      const totalWeight = scored.reduce((s, w) => s + w.count, 0);
      const weightedSum = scored.reduce((s, w) => s + (w.trustScore ?? 0) * w.count, 0);
      overallScore = Math.round((weightedSum / totalWeight) * 10) / 10;
    }

    const totalRatings = state.ratings.length;
    const totalUses = summaries.reduce((s, w) => s + w.count, 0);

    // Daily rating data
    const daily = (state.dailyRatings ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
    const today = new Date().toISOString().slice(0, 10);
    const todayRating = daily.find((r) => r.date === today) ?? null;
    const recentDaily = daily.slice(-7);

    // 7-day rolling average
    let dailyAverage: number | null = null;
    if (recentDaily.length > 0) {
      const sum = recentDaily.reduce((s, r) => s + r.rating, 0);
      dailyAverage = Math.round((sum / recentDaily.length) * 10) / 10;
    }

    // Consecutive days streak (counting back from today)
    let dailyStreak = 0;
    const dayMs = 86_400_000;
    const dailyDates = new Set(daily.map((r) => r.date));
    for (let d = new Date(today); ; d = new Date(d.getTime() - dayMs)) {
      const key = d.toISOString().slice(0, 10);
      if (dailyDates.has(key)) {
        dailyStreak++;
      } else {
        break;
      }
    }

    respond(true, {
      workflows: state.workflows,
      summaries,
      overallScore,
      totalRatings,
      totalUses,
      todayRating,
      dailyAverage,
      dailyStreak,
      recentDaily,
    });
  },

  "trust.dailyRate": async ({ params, respond, context }) => {
    const { rating, note } = (params ?? {}) as { rating?: number; note?: string };

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "rating must be an integer 1-10" });
      return;
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    let entry!: DailyRating;
    await updateState((s) => {
      if (!s.dailyRatings) s.dailyRatings = [];

      // Record which workflows ran today for correlation
      const todayWorkflows = s.ratings
        .filter((r) => r.timestamp.startsWith(today))
        .map((r) => r.workflow);
      const activeWorkflows = [...new Set(todayWorkflows)];

      // Overwrite if already rated today
      const existingIdx = s.dailyRatings.findIndex((r) => r.date === today);
      entry = {
        id: existingIdx >= 0 ? s.dailyRatings[existingIdx].id : randomUUID(),
        date: today,
        rating,
        ...(note ? { note: note.trim() } : {}),
        ...(activeWorkflows.length > 0 ? { activeWorkflows } : {}),
        timestamp: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        s.dailyRatings[existingIdx] = entry;
      } else {
        s.dailyRatings.push(entry);
      }

      // Cap at MAX_DAILY_RATINGS (keep most recent)
      if (s.dailyRatings.length > MAX_DAILY_RATINGS) {
        s.dailyRatings = s.dailyRatings.slice(-MAX_DAILY_RATINGS);
      }
    });

    const needsFeedback = rating < FEEDBACK_THRESHOLD;
    context?.broadcast?.("trust:dailyUpdate", { entry });
    respond(true, {
      entry,
      needsFeedback,
      message: needsFeedback
        ? `Rated ${rating}/10 today. What could make GodMode better?`
        : `Rated ${rating}/10 today. Thanks for the feedback!`,
    });
  },

  /**
   * Returns a feedback prompt for a given skill/workflow.
   * Called by the UI or session system after a skill completes to inject
   * the trust feedback ask at the right moment (not in every system prompt).
   */
  "trust.postSkillPrompt": async ({ params, respond }) => {
    const { skillName } = (params ?? {}) as { skillName?: string };
    if (!skillName || typeof skillName !== "string" || !skillName.trim()) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "skillName is required" });
      return;
    }

    const normalized = skillName.trim();
    const state = await readState();

    // Check if this skill matches a tracked workflow
    const isTracked = state.workflows.some(
      (w) => w.toLowerCase() === normalized.toLowerCase(),
    );

    // Include any stored feedback so the agent can apply lessons learned
    const storedFeedback = isTracked
      ? (state.workflowFeedback[normalized] ?? []).slice(-3)
      : [];

    const prompt = generatePostSkillFeedbackPrompt(normalized);

    respond(true, {
      prompt,
      skillName: normalized,
      isTracked,
      storedFeedback,
      message: isTracked
        ? `Feedback prompt ready for tracked workflow "${normalized}".`
        : `"${normalized}" is not yet tracked. The agent can auto-add it when rating.`,
    });
  },
};

// --- Post-skill feedback prompt ---

/**
 * Generates a brief feedback prompt to append after a skill/workflow completes.
 * This replaces the old global system-prompt injection with a targeted ask
 * that only fires at skill boundaries.
 *
 * @param skillName - the workflow/skill that just completed
 * @returns a short prompt string the agent can use to ask for a trust rating
 */
export function generatePostSkillFeedbackPrompt(skillName: string): string {
  return (
    `How'd I do on that ${skillName} task? ` +
    `Rate 1-10 and any feedback helps me improve. ` +
    `(Use the trust_rate tool to record your rating.)`
  );
}

// --- Programmatic rating submission (for queue auto-rating) ---

/**
 * Submit a trust rating programmatically (no RPC context needed).
 * Used by the queue processor to auto-rate agent personas on task completion.
 */
export async function submitTrustRating(
  workflow: string,
  rating: number,
  note?: string,
): Promise<{ trustScore: number | null; count: number }> {
  const normalized = workflow.trim();

  const { state } = await updateState((s) => {
    // Auto-add workflow if not tracked and under limit
    if (!s.workflows.includes(normalized) && s.workflows.length < MAX_WORKFLOWS) {
      s.workflows.push(normalized);
    }

    s.ratings.push({
      id: randomUUID(),
      workflow: normalized,
      rating: Math.max(1, Math.min(10, Math.round(rating))),
      ...(note ? { note } : {}),
      timestamp: new Date().toISOString(),
    });

    if (s.ratings.length > MAX_RATINGS) {
      s.ratings = s.ratings.slice(-MAX_RATINGS);
    }
  });

  const workflowRatings = state.ratings.filter((r) => r.workflow === normalized);
  const count = workflowRatings.length;
  const avg = workflowRatings.reduce((s, r) => s + r.rating, 0) / count;
  const trustScore = count >= SCORE_THRESHOLD ? Math.round(avg * 10) / 10 : null;

  return { trustScore, count };
}

/**
 * Get trust score for a specific workflow/persona.
 * Returns null if not enough ratings yet.
 */
export async function getTrustScore(workflow: string): Promise<number | null> {
  const state = await readState();
  const ratings = state.ratings.filter((r) => r.workflow === workflow.trim());
  if (ratings.length < SCORE_THRESHOLD) return null;
  const avg = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
  return Math.round(avg * 10) / 10;
}

// ── Autonomy helpers (used by queue-processor) ───────────────────

export type AutonomyLevel = "full" | "approval" | "disabled";

/**
 * Determine the autonomy level for a persona based on trust score.
 * - full (score >= 8): auto-approve results, skip manual review
 * - approval (score 5-7.9): queue for human review after completion
 * - disabled (score < 5): block from running entirely
 *
 * Returns "full" if the persona/workflow isn't tracked in the trust system
 * (untracked workflows default to allowed so new users aren't blocked).
 * Returns "approval" if tracked but not enough ratings yet (safe default
 * once user has opted into tracking).
 */
export async function getAutonomyLevel(persona: string): Promise<AutonomyLevel> {
  const state = await readState();
  const normalized = persona.trim();

  // If this persona/workflow isn't being tracked, allow full autonomy.
  // The trust system is opt-in: users must explicitly add workflows to track.
  const isTracked = state.workflows.some(
    (w) => w.toLowerCase() === normalized.toLowerCase(),
  );
  if (!isTracked) return "full";

  const score = await getTrustScore(persona);
  if (score === null) return "approval"; // tracked but not enough data yet
  if (score >= 8) return "full";
  if (score >= 5) return "approval";
  return "disabled";
}

/**
 * Convenience wrapper around submitTrustRating for automated rating.
 */
export async function autoRate(
  persona: string,
  rating: number,
  note: string,
  _source: "auto-approve" | "auto-reject" | "auto-failure",
): Promise<{ trustScore: number | null; count: number }> {
  return submitTrustRating(persona, rating, `[${_source}] ${note}`);
}

// --- Exported for prompt hook (legacy, kept for compatibility) ---

export { readState as readTrustState, computeSummary as computeTrustSummary };
