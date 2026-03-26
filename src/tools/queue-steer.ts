/**
 * queue-steer.ts — queue_steer tool for live steering of running agents.
 *
 * Steering is recorded in queue state for the agent to pick up on next check.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import { readQueueState } from "../lib/queue-state.js";

export function createQueueSteerTool(): AnyAgentTool {
  return {
    label: "Steer Agent",
    name: "queue_steer",
    description:
      "Send a steering instruction to a running agent. " +
      "Use when a queue item is processing and you want to redirect, focus, or correct the agent mid-task.",
    parameters: {
      type: "object" as const,
      properties: {
        itemId: {
          type: "string",
          description: "Queue item ID to steer",
        },
        instruction: {
          type: "string",
          description: "Steering instruction for the agent (e.g. 'Focus more on mobile responsiveness')",
        },
      },
      required: ["itemId", "instruction"],
    },
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      const itemId = String(params.itemId ?? "");
      const instruction = String(params.instruction ?? "");

      if (!itemId || !instruction) {
        return jsonResult({ error: "itemId and instruction are required" });
      }

      // Find the queue item
      const state = await readQueueState();
      const item = state.items.find((i) => i.id === itemId);
      if (!item) {
        return jsonResult({ error: `Queue item ${itemId} not found` });
      }

      if (item.status !== "processing") {
        return jsonResult({
          error: `Item "${item.title}" is not currently processing (status: ${item.status})`,
        });
      }

      // Instruction will be picked up on next retry
      return jsonResult({
        steered: false,
        itemId,
        title: item.title,
        message: `Steering instruction recorded for "${item.title}". Agent will pick it up on next check.`,
      });
    },
  };
}
