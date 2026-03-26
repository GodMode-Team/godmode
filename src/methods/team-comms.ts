import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  appendFeedMessage,
  createFeedMessage,
  FEED_MESSAGE_TYPES,
  getUnreadMessages,
  markFeedRead,
  readFeed,
  resolveFeedPath,
  type FeedMessageType,
} from "../lib/team-feed.js";
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ErrorCodes = {
  INVALID_REQUEST: "INVALID_REQUEST",
  NOT_FOUND: "NOT_FOUND",
} as const;

function errorShape(code: string, message: string) {
  return { code, message };
}

const VALID_TYPES = new Set<string>(FEED_MESSAGE_TYPES);

/**
 * comms.send — append a message to the team feed.
 *
 * Params:
 * - workspaceId (string, required)
 * - from (string, required) — sender identifier
 * - type (string, required) — handoff | question | alert | blocked | fyi
 * - msg (string, required) — message body
 * - to (string, optional) — recipient identifier
 * - re (string, optional) — reference to another message id
 * - context (object, optional) — extra metadata
 */
const send: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const from = typeof params.from === "string" ? String(params.from).trim() : "";
  const type = typeof params.type === "string" ? String(params.type).trim().toLowerCase() : "";
  const msg = typeof params.msg === "string" ? String(params.msg).trim() : "";
  const to = typeof params.to === "string" ? String(params.to).trim() : undefined;
  const re = typeof params.re === "string" ? String(params.re).trim() : undefined;
  const context =
    params.context && typeof params.context === "object" && !Array.isArray(params.context)
      ? (params.context as Record<string, unknown>)
      : undefined;

  if (!workspaceId || !from || !type || !msg) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId, from, type, and msg are required"),
    );
    return;
  }

  if (!VALID_TYPES.has(type)) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `Invalid type: ${type}. Must be one of: ${[...VALID_TYPES].join(", ")}`),
    );
    return;
  }

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  const feedPath = resolveFeedPath(workspace.path);
  const message = createFeedMessage({
    from,
    type: type as FeedMessageType,
    msg,
    to,
    re,
    context,
  });

  await appendFeedMessage(feedPath, message);

  // Push to git immediately
  try {
    const syncService = getWorkspaceSyncService();
    await syncService.pushNow(workspace.id);
  } catch {
    // Non-fatal
  }

  respond(true, { message });
};

/**
 * comms.feed — read recent messages from the team feed.
 *
 * Params:
 * - workspaceId (string, required)
 * - since (string, optional) — ISO timestamp
 * - limit (number, optional, default 50)
 */
const feed: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const since = typeof params.since === "string" ? String(params.since).trim() : undefined;
  const limit = typeof params.limit === "number" ? params.limit : 50;

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  const feedPath = resolveFeedPath(workspace.path);
  const messages = await readFeed(feedPath, { since, limit });
  respond(true, { messages, count: messages.length });
};

/**
 * comms.unread — get unread messages for a member.
 *
 * Params:
 * - workspaceId (string, required)
 * - memberId (string, required)
 * - markRead (boolean, optional, default false)
 */
const unread: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const memberId = typeof params.memberId === "string" ? String(params.memberId).trim() : "";
  const shouldMarkRead = Boolean(params.markRead);

  if (!workspaceId || !memberId) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and memberId are required"),
    );
    return;
  }

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  const messages = await getUnreadMessages(workspace.path, memberId);

  if (shouldMarkRead && messages.length > 0) {
    await markFeedRead(workspace.path, memberId, messages);
  }

  respond(true, { messages, count: messages.length });
};

export const teamCommsHandlers: GatewayRequestHandlers = {
  "comms.send": send,
  "comms.feed": feed,
  "comms.unread": unread,
};
