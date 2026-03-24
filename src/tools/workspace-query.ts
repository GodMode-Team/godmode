/**
 * workspace-query tool — lets the agent search across workspace connections and feed.
 *
 * Used when the user asks about team/workspace information.
 * The agent calls this tool, which queries the workspace's connected tools live.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { readWorkspaceConfig, findWorkspaceById, detectWorkspaceFromText } from "../lib/workspaces-config.js";
import { getConnector } from "../services/workspace-connectors/registry.js";
import { getWorkspaceSecret } from "../lib/workspace-secrets.js";
import { readFeed, searchFeed } from "../services/workspace-feed.js";
import { jsonResult } from "../lib/sdk-helpers.js";

export function createWorkspaceQueryTool(): AnyAgentTool {
  return {
    label: "Workspace Query",
    name: "workspace_query",
    description:
      "Search across a team workspace's connected tools (Drive, ClickUp, CRM) and activity feed. " +
      "Use when the user asks about team projects, shared documents, or workspace activity.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "What to search for" },
        workspace: {
          type: "string",
          description: "Workspace ID or name. If omitted, auto-detected from query.",
        },
      },
      required: ["query"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const query = String(params.query ?? "");
      let wsId = String(params.workspace ?? "");

      // Auto-detect workspace from query if not specified
      if (!wsId) {
        const config = await readWorkspaceConfig();
        const detected = detectWorkspaceFromText(config, query);
        wsId = detected.workspaceId ?? "";
      }

      if (!wsId) {
        return jsonResult({ error: "Could not determine workspace. Specify workspace name." });
      }

      const config = await readWorkspaceConfig();
      const ws = findWorkspaceById(config, wsId);
      if (!ws) {
        return jsonResult({ error: `Workspace "${wsId}" not found.` });
      }

      // Search connections in parallel
      const connections = (ws.connections ?? []).filter(c => c.status === "connected");
      const connectionResults = await Promise.all(
        connections.map(async (conn) => {
          const connector = getConnector(conn.type);
          if (!connector) return null;
          const secret = getWorkspaceSecret(ws.id, conn.id) ?? "";
          try {
            const result = await connector.search(query, conn.config, secret);
            return { source: conn.name, type: conn.type, results: result.results };
          } catch {
            return null;
          }
        }),
      );

      // Search feed
      const feedResults = searchFeed(ws.path, query, 5);

      // Recent feed entries (latest activity)
      const recentFeed = readFeed(ws.path, 5);

      return jsonResult({
        workspace: ws.name,
        connections: connectionResults.filter(Boolean),
        feedMatches: feedResults,
        recentActivity: recentFeed,
      });
    },
  };
}
