/**
 * honcho-query.ts — Agent tool for on-demand memory queries via Honcho.
 *
 * Gives the ally active recall: "what did the user say about X?"
 * Wraps queryPeer() from honcho-client.ts.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";

type ToolContext = {
  sessionKey?: string;
};

export function createHonchoQueryTool(ctx: ToolContext): AnyAgentTool {
  return {
    label: "Memory Query",
    name: "honcho_query",
    description:
      "Query the user's memory model. Ask questions like 'What are the user's current priorities?' " +
      "or 'What did the user say about project X?' Returns Honcho's understanding based on all past conversations.",
    parameters: {
      type: "object" as const,
      properties: {
        question: {
          type: "string",
          description:
            "A natural language question about the user. Examples: " +
            "'What are the user\\'s top priorities right now?', " +
            "'What has the user said about Patient Autopilot?', " +
            "'Who does the user work with most closely?'",
        },
      },
      required: ["question"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const question = String(params.question ?? "").trim();
      if (!question) {
        return jsonResult({ error: "question is required" });
      }

      try {
        const { queryPeer, isMemoryReady } = await import("../lib/memory.js");

        if (!isMemoryReady()) {
          return jsonResult({
            error: "Memory is not configured. Set HONCHO_API_KEY to enable memory queries.",
          });
        }

        const sessionKey = ctx.sessionKey ?? "system:honcho-query";
        const answer = await queryPeer(question, sessionKey);

        if (!answer || answer.trim().length < 5) {
          return jsonResult({
            answer: null,
            note: "Honcho doesn't have enough context to answer this question yet. The user model is still building.",
          });
        }

        return jsonResult({ answer });
      } catch (err) {
        return jsonResult({
          error: `Memory query failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    },
  };
}
