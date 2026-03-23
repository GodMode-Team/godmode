/**
 * team-message.ts — Agent tool for posting to the team feed.
 *
 * Lets the ally send messages (handoff, question, alert, blocked, fyi)
 * to the shared team feed for inter-agent and human communication.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import {
  appendFeedMessage,
  createFeedMessage,
  FEED_MESSAGE_TYPES,
  resolveFeedPath,
  type FeedMessageType,
} from "../lib/team-feed.js";
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import {
  loadCombinedSessionStoreForGateway,
  loadConfig,
} from "../lib/workspace-session-store.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

/**
 * Creates the `team_message` agent tool.
 * Checks team workspace at call time; returns an error result if not in a team session.
 */
export function createTeamMessageTool(ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "team_message",
    label: "Team Message",
    description:
      "Send a message to the team feed in the current workspace. " +
      "Use this to communicate with other agents or notify team members. " +
      "Types: handoff (task handover), question (needs input), alert (urgent), " +
      "blocked (stuck on something), fyi (informational).",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Message type: handoff, question, alert, blocked, or fyi",
        },
        message: {
          type: "string",
          description: "The message content",
        },
        to: {
          type: "string",
          description: "Optional: recipient agent or member id",
        },
      },
      required: ["type", "message"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const msgTypeRaw = typeof params.type === "string" ? params.type.trim().toLowerCase() : "";
      const msgBody = typeof params.message === "string" ? params.message.trim() : "";
      const toRaw = typeof params.to === "string" ? params.to.trim() : undefined;

      if (!msgBody) {
        return jsonResult({ error: "message is required" });
      }

      if (!FEED_MESSAGE_TYPES.includes(msgTypeRaw as FeedMessageType)) {
        return jsonResult({ error: `Invalid type: ${msgTypeRaw}. Use one of: ${FEED_MESSAGE_TYPES.join(", ")}` });
      }

      const sessionKey = ctx.sessionKey;
      if (!sessionKey) {
        return jsonResult({ error: "No active session" });
      }

      const cfg = await loadConfig();
      const { store } = await loadCombinedSessionStoreForGateway(cfg);
      const sessionEntry = store[sessionKey];
      const workspaceId = sessionEntry?.workspaceId;
      if (!workspaceId) {
        return jsonResult({ error: "Current session is not associated with a team workspace" });
      }

      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const workspace = findWorkspaceById(config, workspaceId);
      if (!workspace || workspace.type !== "team") {
        return jsonResult({ error: "Current workspace is not a team workspace" });
      }

      const from = workspace.team?.memberId || workspace.team?.agentName || ctx.agentId || "unknown";
      const feedPath = resolveFeedPath(workspace.path);
      const message = createFeedMessage({
        from,
        type: msgTypeRaw as FeedMessageType,
        msg: msgBody,
        to: toRaw,
      });

      await appendFeedMessage(feedPath, message);

      try {
        const syncService = getWorkspaceSyncService();
        await syncService.pushNow(workspace.id);
      } catch {
        // Non-fatal
      }

      return jsonResult({
        sent: true,
        id: message.id,
        type: message.type,
        to: message.to || "all",
      });
    },
  } as AnyAgentTool;
}
