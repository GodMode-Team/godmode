/**
 * workspace-feed.ts — RPC handlers for the workspace activity feed.
 */

import { existsSync } from "node:fs";
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
  try {
    const config = await readWorkspaceConfig();
    const ws = findWorkspaceById(config, workspaceId);
    if (!ws) {
      respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
      return;
    }
    if (!existsSync(ws.path)) {
      console.warn(`[workspace.feed.read] workspace directory missing, returning empty feed: ${ws.path}`);
      respond(true, { entries: [], workspaceId });
      return;
    }
    const entries = readFeed(ws.path, limit ?? 50, before);
    respond(true, { entries, workspaceId });
  } catch (err) {
    respond(false, null, {
      code: "FEED_READ_FAILED",
      message: `Failed to read workspace feed — workspace config or feed file may be corrupted. (${String(err).slice(0, 100)})`,
    });
  }
};

const feedPost: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, author, type, text, ref } = params as {
    workspaceId?: string; author?: string; type?: string; text?: string; ref?: string;
  };
  if (!workspaceId || !text) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and text required" });
    return;
  }
  try {
    const config = await readWorkspaceConfig();
    const ws = findWorkspaceById(config, workspaceId);
    if (!ws) {
      respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
      return;
    }
    if (!existsSync(ws.path)) {
      console.warn(`[workspace.feed.post] workspace directory missing, will be created: ${ws.path}`);
    }
    const entry = appendFeedEntry(ws.path, {
      author: author ?? "user",
      type: type ?? "update",
      text,
      ref: ref ?? null,
      workspace: workspaceId,
    });
    respond(true, { entry });
  } catch (err) {
    respond(false, null, {
      code: "FEED_POST_FAILED",
      message: `Failed to post to workspace feed — check disk space and workspace directory permissions. (${String(err).slice(0, 100)})`,
    });
  }
};

const feedSearch: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, query, limit } = params as {
    workspaceId?: string; query?: string; limit?: number;
  };
  if (!workspaceId || !query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and query required" });
    return;
  }
  try {
    const config = await readWorkspaceConfig();
    const ws = findWorkspaceById(config, workspaceId);
    if (!ws) {
      respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
      return;
    }
    if (!existsSync(ws.path)) {
      console.warn(`[workspace.feed.search] workspace directory missing, returning empty results: ${ws.path}`);
      respond(true, { entries: [], workspaceId });
      return;
    }
    const entries = searchFeed(ws.path, query, limit ?? 20);
    respond(true, { entries, workspaceId });
  } catch (err) {
    respond(false, null, {
      code: "FEED_SEARCH_FAILED",
      message: `Failed to search workspace feed — workspace config or feed file may be unreadable. (${String(err).slice(0, 100)})`,
    });
  }
};

export const workspaceFeedHandlers: GatewayRequestHandlers = {
  "workspace.feed.read": feedRead,
  "workspace.feed.post": feedPost,
  "workspace.feed.search": feedSearch,
};
