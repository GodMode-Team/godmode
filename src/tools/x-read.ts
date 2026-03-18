/**
 * x-read.ts — Agent tool for reading X/Twitter content.
 *
 * v2 slim: x-client removed. This tool now returns a graceful degradation
 * message directing users to the platform x_read tool.
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

export function createXReadTool(_ctx: ToolContext): AnyAgentTool {
  return {
    label: "X Reader",
    name: "x_read",
    description:
      "Read tweets, threads, articles, bookmarks, and search X/Twitter. " +
      "Use this instead of web_fetch or browser for any X/Twitter content.",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["search", "tweet", "thread", "timeline", "article", "bookmarks"],
          description: "What to do on X/Twitter.",
        },
        query: {
          type: "string",
          description: "Search query, tweet URL/ID, or @handle.",
        },
        count: {
          type: "number",
          description: "Max results to return (default: 10).",
        },
      },
      required: ["action"],
    },
    execute: async (_toolCallId: string, _params: Record<string, unknown>) => {
      return jsonResult({
        error: "X/Twitter client removed in v2 slim. Use the platform x_read tool instead.",
      });
    },
  };
}
