/**
 * trust-rate.ts — Agent tool for recording trust ratings.
 *
 * After completing a tracked workflow (daily brief, email triage, etc.),
 * the ally records a 1-10 rating. After 10 ratings, the running average
 * becomes the trust score. Scores below 7 trigger feedback collection.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import { randomUUID } from "node:crypto";
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";
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
  await secureMkdir(DATA_DIR);
  await secureWriteFile(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Creates the `trust_rate` agent tool.
 * Lets the agent rate how well a task was completed (1-10) for a tracked
 * workflow. After 10 ratings the running average becomes the trust score.
 * Below a 7, the result includes a note prompting the agent to ask
 * what could be improved and store feedback via trust.feedback.
 */
export function createTrustRateTool(_ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "trust_rate",
    label: "Trust Rate",
    description:
      "Record a 1-10 rating for a completed skill or workflow task. " +
      "Call this after finishing a task that matches a tracked workflow " +
      "(e.g. daily brief, email triage, code reviews). " +
      "After 10 ratings the running average becomes the trust score. " +
      "If the score drops below 7, ask the user what could be better " +
      "and store their answer via trust.feedback. " +
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

      // Build the result message. If the individual rating is below 7,
      // add a note prompting the agent to ask what could be improved.
      let message: string;
      if (needsFeedback) {
        message = `Trust score: ${trustScore}/10. Ask the user: "What would make ${workflow} better?" Then store their answer via trust.feedback.`;
      } else if (trustScore !== null) {
        message = `Trust score: ${trustScore}/10`;
      } else {
        message = `Rated ${rating}/10 (${count}/${SCORE_THRESHOLD} until trust score)`;
      }

      const improvementNote =
        entry.rating < FEEDBACK_THRESHOLD
          ? `This rating was below ${FEEDBACK_THRESHOLD}. Consider asking the user what could be improved and store their feedback via trust.feedback.`
          : undefined;

      return jsonResult({
        rated: true,
        workflow: entry.workflow,
        rating: entry.rating,
        count,
        trustScore,
        needsFeedback,
        ratingsUntilScore: count < SCORE_THRESHOLD ? SCORE_THRESHOLD - count : 0,
        storedFeedback,
        message,
        ...(improvementNote ? { improvementNote } : {}),
      });
    },
  } as AnyAgentTool;
}
