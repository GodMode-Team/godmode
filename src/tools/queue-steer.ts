/**
 * queue-steer.ts — queue_steer tool for live steering of running agents.
 *
 * When a queue item is processing and has a Proof doc, Prosper can
 * send steering instructions to the running agent. The instruction
 * is written to the Proof doc as a comment so the agent picks it up
 * on next read.
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { readQueueState } from "../lib/queue-state.js";
import { isProofRunning } from "../services/proof-server.js";
import { addProofComment, appendProofDocument } from "../lib/proof-bridge.js";
import { getAllyName } from "../lib/ally-identity.js";

export function createQueueSteerTool(): AnyAgentTool {
  return {
    label: "Steer Agent",
    name: "queue_steer",
    description:
      "Send a steering instruction to a running agent. " +
      "Use when a queue item is processing and you want to redirect, focus, or correct the agent mid-task. " +
      "The instruction is appended to the agent's Proof document.",
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

      // If the item has a Proof doc, write the steering instruction there
      if (item.proofDocSlug && isProofRunning()) {
        try {
          // Add as a comment for provenance tracking
          await addProofComment(item.proofDocSlug, "ally", `[STEERING] ${instruction}`);

          // Append a visible steering block without rewriting the whole document.
          const allyName = getAllyName();
          const steeringBlock = `\n\n---\n**[Steering from ${allyName}]:** ${instruction}\n---\n`;
          await appendProofDocument(
            item.proofDocSlug,
            steeringBlock,
            "ally",
            allyName,
          );

          return jsonResult({
            steered: true,
            itemId,
            title: item.title,
            method: "proof-doc",
            message: `Steering instruction sent to "${item.title}" via Proof doc.`,
          });
        } catch (err) {
          return jsonResult({
            error: `Failed to write steering to Proof: ${String(err)}`,
          });
        }
      }

      // Fallback: no Proof doc — instruction will be picked up on next retry
      return jsonResult({
        steered: false,
        itemId,
        title: item.title,
        message: `Item "${item.title}" has no Proof doc. Steering is only available for items with Proof output.`,
      });
    },
  };
}
