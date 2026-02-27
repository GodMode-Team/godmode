import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";
import { MAX_WORKFLOWS, SCORE_THRESHOLD, FEEDBACK_THRESHOLD } from "../methods/trust-tracker.js";
import type { TrustRating, TrustTrackerState } from "../methods/trust-tracker.js";

const STATE_FILE = join(DATA_DIR, "trust-tracker.json");
const MAX_RATINGS = 500;

async function readState(): Promise<TrustTrackerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as TrustTrackerState;
  } catch {
    const now = new Date().toISOString();
    return { workflows: [], ratings: [], workflowFeedback: {}, createdAt: now, updatedAt: now };
  }
}

async function saveState(state: TrustTrackerState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Creates the `trust_rate` agent tool.
 * Lets the agent rate how well a task was completed (1-10) for a tracked
 * workflow. After 10 ratings the running average becomes the trust score.
 * Below a 7, the agent should ask the user "what would make this better?"
 * and store that feedback via trust.feedback.
 */
export function createTrustRateTool(_ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "trust_rate",
    label: "Trust Rate",
    description:
      "Rate how well a task was completed (1-10) for a tracked workflow category. " +
      "Use this AFTER you finish a task that matches one of the user's tracked workflows " +
      "(e.g. daily brief, email triage, code reviews). After 10 ratings the running " +
      "average becomes the trust score. If the score is below 7, ask the user " +
      "'What would make this better?' and store the answer via trust.feedback. " +
      "New workflows are auto-added if under the limit.",
    parameters: {
      type: "object",
      properties: {
        workflow: {
          type: "string",
          description: "The workflow category (e.g. 'email drafts', 'code reviews', 'meeting prep')",
        },
        rating: {
          type: "number",
          description: "Rating from 1 (poor) to 10 (excellent)",
        },
        note: {
          type: "string",
          description: "Optional brief note on what was good or bad about the result",
        },
      },
      required: ["workflow", "rating"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const workflow = typeof params.workflow === "string" ? params.workflow.trim() : "";
      const rating = typeof params.rating === "number" ? params.rating : 0;
      const note = typeof params.note === "string" ? params.note.trim() : undefined;

      if (!workflow) {
        return jsonResult({ error: "workflow is required" });
      }
      if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        return jsonResult({ error: "rating must be an integer from 1 to 10" });
      }

      const state = await readState();

      // Auto-add workflow if not tracked and under limit
      if (!state.workflows.includes(workflow) && state.workflows.length < MAX_WORKFLOWS) {
        state.workflows.push(workflow);
      }

      const entry: TrustRating = {
        id: randomUUID(),
        workflow,
        rating,
        ...(note ? { note } : {}),
        timestamp: new Date().toISOString(),
      };

      state.ratings.push(entry);

      // Cap at MAX_RATINGS (FIFO trim)
      if (state.ratings.length > MAX_RATINGS) {
        state.ratings = state.ratings.slice(-MAX_RATINGS);
      }

      await saveState(state);

      // Compute trust score
      const workflowRatings = state.ratings.filter((r) => r.workflow === workflow);
      const count = workflowRatings.length;
      const avg = workflowRatings.reduce((s, r) => s + r.rating, 0) / count;
      const trustScore = count >= SCORE_THRESHOLD ? Math.round(avg * 10) / 10 : null;
      const needsFeedback = trustScore !== null && trustScore < FEEDBACK_THRESHOLD;

      // Include any stored feedback for this workflow so the agent learns
      const storedFeedback = state.workflowFeedback?.[workflow]?.slice(-3) ?? [];

      return jsonResult({
        rated: true,
        workflow: entry.workflow,
        rating: entry.rating,
        count,
        trustScore,
        needsFeedback,
        ratingsUntilScore: count < SCORE_THRESHOLD ? SCORE_THRESHOLD - count : 0,
        storedFeedback,
        message: needsFeedback
          ? `Trust score: ${trustScore}/10. Ask the user: "What would make ${workflow} better?" Then store their answer via trust.feedback.`
          : trustScore !== null
            ? `Trust score: ${trustScore}/10`
            : `Rated ${rating}/10 (${count}/${SCORE_THRESHOLD} until trust score)`,
      });
    },
  } as AnyAgentTool;
}
