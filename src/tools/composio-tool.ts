/**
 * composio-tool.ts — Agent-callable tool for executing Composio actions.
 *
 * Allows the ally to execute actions on connected third-party services
 * (e.g. GITHUB_CREATE_ISSUE, SLACK_SEND_MESSAGE) via Composio.
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import * as composio from "../services/composio-client.js";

const DEFAULT_USER = "godmode-user";

export function createComposioExecuteTool(): AnyAgentTool {
  return {
    label: "Integrations",
    name: "composio_execute",
    description:
      "Execute an action on a connected third-party service via Composio. " +
      "Use this to interact with external tools the user has connected " +
      "(e.g. GitHub, Slack, Google, HubSpot). " +
      "Call composio.status RPC first to see what's connected.",
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
