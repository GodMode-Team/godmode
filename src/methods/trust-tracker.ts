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
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const STATE_FILE = join(DATA_DIR, "trust-tracker.json");
export const MAX_WORKFLOWS = 5;
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

    const state = await readState();
    state.workflows = cleaned;
    await writeState(state);
    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, { workflows: state.workflows });
  },

  "trust.workflows.add": async ({ params, respond, context }) => {
    const { workflow } = params as { workflow?: string };
    if (!workflow || typeof workflow !== "string" || !workflow.trim()) {
      respond(false, undefined, { code: "INVALID_PARAMS", message: "workflow name is required" });
      return;
    }
    const state = await readState();
    const normalized = workflow.trim();

    // Check if already tracked (case-insensitive)
    if (state.workflows.some((w) => w.toLowerCase() === normalized.toLowerCase())) {
      respond(true, {
        added: false,
        reason: "already_tracked",
        message: `"${normalized}" is already being tracked.`,
        workflows: state.workflows,
      });
      return;
    }

    if (state.workflows.length >= MAX_WORKFLOWS) {
      respond(true, {
        added: false,
        reason: "limit_reached",
        message: `You're tracking ${MAX_WORKFLOWS} workflows already. Remove one first to add "${normalized}".`,
        workflows: state.workflows,
      });
      return;
    }

    state.workflows.push(normalized);
    await writeState(state);
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
    const state = await readState();
    const idx = state.workflows.findIndex((w) => w.toLowerCase() === workflow.trim().toLowerCase());
    if (idx === -1) {
      respond(true, {
        removed: false,
        message: `"${workflow}" is not being tracked.`,
        workflows: state.workflows,
      });
      return;
    }
    const removed = state.workflows.splice(idx, 1)[0];
    await writeState(state);
    context?.broadcast?.("trust:update", { workflows: state.workflows });
    respond(true, {
      removed: true,
      message: `Stopped tracking "${removed}".`,
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

    const state = await readState();

    // Auto-add workflow if not tracked and under limit
    const normalizedWorkflow = workflow.trim();
    if (!state.workflows.includes(normalizedWorkflow) && state.workflows.length < MAX_WORKFLOWS) {
      state.workflows.push(normalizedWorkflow);
    }

    const entry: TrustRating = {
      id: randomUUID(),
      workflow: normalizedWorkflow,
      rating,
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

    // Compute trust score for this workflow
    const workflowRatings = state.ratings.filter((r) => r.workflow === normalizedWorkflow);
    const count = workflowRatings.length;
    const avg = workflowRatings.reduce((s, r) => s + r.rating, 0) / count;
    const trustScore = count >= SCORE_THRESHOLD ? Math.round(avg * 10) / 10 : null;
    const needsFeedback = trustScore !== null && trustScore < FEEDBACK_THRESHOLD;

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

    const state = await readState();
    const normalized = workflow.trim();
    if (!state.workflowFeedback) state.workflowFeedback = {};
    if (!state.workflowFeedback[normalized]) state.workflowFeedback[normalized] = [];
    state.workflowFeedback[normalized].push(feedback.trim());

    // Keep at most 20 feedback entries per workflow
    if (state.workflowFeedback[normalized].length > 20) {
      state.workflowFeedback[normalized] = state.workflowFeedback[normalized].slice(-20);
    }

    await writeState(state);
    context?.broadcast?.("trust:feedback", { workflow: normalized, feedback: feedback.trim() });
    respond(true, {
      stored: true,
      message: `Feedback noted for "${normalized}". I'll apply this next time.`,
      feedbackCount: state.workflowFeedback[normalized].length,
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

    const state = await readState();
    if (!state.dailyRatings) state.dailyRatings = [];

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Overwrite if already rated today
    const existingIdx = state.dailyRatings.findIndex((r) => r.date === today);
    const entry: DailyRating = {
      id: existingIdx >= 0 ? state.dailyRatings[existingIdx].id : randomUUID(),
      date: today,
      rating,
      ...(note ? { note: note.trim() } : {}),
      timestamp: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      state.dailyRatings[existingIdx] = entry;
    } else {
      state.dailyRatings.push(entry);
    }

    // Cap at MAX_DAILY_RATINGS (keep most recent)
    if (state.dailyRatings.length > MAX_DAILY_RATINGS) {
      state.dailyRatings = state.dailyRatings.slice(-MAX_DAILY_RATINGS);
    }

    await writeState(state);

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

// --- Exported for prompt hook (legacy, kept for compatibility) ---

export { readState as readTrustState, computeSummary as computeTrustSummary };
