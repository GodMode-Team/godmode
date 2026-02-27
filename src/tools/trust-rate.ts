import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";
import type { TrustRating, TrustTrackerState } from "../methods/trust-tracker.js";

const STATE_FILE = join(DATA_DIR, "trust-tracker.json");
const MAX_WORKFLOWS = 5;
const MAX_RATINGS = 500;

async function readState(): Promise<TrustTrackerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as TrustTrackerState;
  } catch {
    const now = new Date().toISOString();
    return { workflows: [], ratings: [], createdAt: now, updatedAt: now };
  }
}

async function saveState(state: TrustTrackerState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Creates the `trust_rate` agent tool.
 * Lets the agent rate how well a task was completed for a tracked workflow.
 */
export function createTrustRateTool(_ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "trust_rate",
    label: "Trust Rate",
    description:
      "Rate how well a task was completed (1-5) for a specific workflow category. " +
      "Use this after completing a task that falls under one of the user's tracked " +
      "workflow categories to help the system learn their preferences over time. " +
      "If the user hasn't set up workflows yet, suggest they pick 3-5 categories.",
    parameters: {
      type: "object",
      properties: {
        workflow: {
          type: "string",
          description: "The workflow category (e.g. 'email drafts', 'code reviews', 'meeting prep')",
        },
        rating: {
          type: "number",
          description: "Rating from 1 (poor) to 5 (excellent)",
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
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return jsonResult({ error: "rating must be an integer from 1 to 5" });
      }

      const state = await readState();

      // Auto-add workflow if not tracked and under limit
      if (!state.workflows.includes(workflow) && state.workflows.length < MAX_WORKFLOWS) {
        state.workflows.push(workflow);
      }

      const entry: TrustRating = {
        id: randomUUID(),
        workflow,
        rating: rating as TrustRating["rating"],
        ...(note ? { note } : {}),
        timestamp: new Date().toISOString(),
      };

      state.ratings.push(entry);

      // Cap at MAX_RATINGS (FIFO trim)
      if (state.ratings.length > MAX_RATINGS) {
        state.ratings = state.ratings.slice(-MAX_RATINGS);
      }

      await saveState(state);

      return jsonResult({
        rated: true,
        workflow: entry.workflow,
        rating: entry.rating,
        totalRatings: state.ratings.filter((r) => r.workflow === workflow).length,
      });
    },
  } as AnyAgentTool;
}
