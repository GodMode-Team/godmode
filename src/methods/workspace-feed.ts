/**
 * workspace-feed.ts — RPC handlers for the workspace activity feed.
 */

import type { GatewayRequestHandler, GatewayRequestHandlers } from "../types/plugin-api.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";
import { appendFeedEntry, readFeed, searchFeed } from "../services/workspace-feed.js";

const feedRead: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, limit, before } = params as {
    workspaceId?: string; limit?: number; before?: string;
  };
  if (!workspaceId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId required" });
    return;
  }
  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entries = readFeed(ws.path, limit ?? 50, before);
  respond(true, { entries, workspaceId });
};

const feedPost: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, author, type, text, ref } = params as {
    workspaceId?: string; author?: string; type?: string; text?: string; ref?: string;
  };
  if (!workspaceId || !text) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and text required" });
    return;
  }
  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entry = appendFeedEntry(ws.path, {
    author: author ?? "user",
    type: type ?? "update",
    text,
    ref: ref ?? null,
    workspace: workspaceId,
  });
  respond(true, { entry });
};

const feedSearch: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, query, limit } = params as {
    workspaceId?: string; query?: string; limit?: number;
  };
  if (!workspaceId || !query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and query required" });
    return;
  }
  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  const entries = searchFeed(ws.path, query, limit ?? 20);
  respond(true, { entries, workspaceId });
};

export const workspaceFeedHandlers: GatewayRequestHandlers = {
  "workspace.feed.read": feedRead,
  "workspace.feed.post": feedPost,
  "workspace.feed.search": feedSearch,
};
