/**
 * composio-tool.ts — Agent-callable tool for executing Composio actions.
 *
 * Allows the ally to execute actions on connected third-party services
 * (e.g. GITHUB_CREATE_ISSUE, SLACK_SEND_MESSAGE) via Composio.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import * as composio from "../services/composio-client.js";

const DEFAULT_USER = "godmode-user";

export function createComposioExecuteTool(): AnyAgentTool {
  return {
    label: "Composio",
    name: "composio_execute",
    description:
      "Execute an action on a third-party service connected ONLY through Composio. " +
      "IMPORTANT: Do NOT use this for services that already have direct API integrations — " +
      "Front (use FRONT_API_TOKEN), Fathom (use FATHOM_API_KEY), GitHub (use gh CLI), " +
      "Google Calendar (use gog CLI), X/Twitter (use x_read tool), or any service with " +
      "its own env var or tool. Only use composio_execute for services the user has " +
      "explicitly connected through Composio that have no other integration path. " +
      "Call composio.status RPC first to see what's connected via Composio.",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          description:
            "The Composio action name to execute (e.g. GITHUB_CREATE_ISSUE, SLACK_SEND_MESSAGE).",
        },
        args: {
          type: "object",
          description: "Arguments for the action. Shape depends on the specific action.",
        },
      },
      required: ["action"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      if (!composio.isConfigured()) {
        return jsonResult({
          error: "Composio not configured. Set COMPOSIO_API_KEY to enable third-party tool access.",
        });
      }

      const action = typeof params.action === "string" ? params.action.trim() : "";
      if (!action) {
        return jsonResult({ error: "action parameter is required." });
      }

      const args = (params.args && typeof params.args === "object" ? params.args : {}) as Record<string, unknown>;
      const result = await composio.executeAction(DEFAULT_USER, action, args);
      return jsonResult(result);
    },
  };
}
