import {
  archiveSession,
  unarchiveSession,
  getArchivedSessions,
  runAutoArchive,
} from "../services/session-archiver.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

/**
 * sessions.archive — Manually archive a session.
 *
 * Params: { sessionKey: string, reason?: "idle-7d" | "task-complete" | "manual" }
 * Returns the archive entry, or an error if already archived.
 */
const archive: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey =
    typeof params.sessionKey === "string" ? String(params.sessionKey).trim() : "";
  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing sessionKey" });
    return;
  }

  const reason =
    typeof params.reason === "string" &&
    ["idle-7d", "task-complete", "manual"].includes(params.reason)
      ? (params.reason as "idle-7d" | "task-complete" | "manual")
      : "manual";

  const entry = await archiveSession(sessionKey, reason);
  if (!entry) {
    respond(false, null, {
      code: "ALREADY_ARCHIVED",
      message: `Session "${sessionKey}" is already archived`,
    });
    return;
  }

  respond(true, { entry });
};

/**
 * sessions.unarchive — Restore an archived session.
 *
 * Params: { sessionKey: string }
 * Returns the removed archive entry, or an error if not found.
 */
const unarchive: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey =
    typeof params.sessionKey === "string" ? String(params.sessionKey).trim() : "";
  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing sessionKey" });
    return;
  }

  const removed = await unarchiveSession(sessionKey);
  if (!removed) {
    respond(false, null, {
      code: "NOT_FOUND",
      message: `Session "${sessionKey}" is not in the archive`,
    });
    return;
  }

  respond(true, { entry: removed });
};

/**
 * sessions.archived — List all archived sessions.
 *
 * Returns { archived: ArchivedSessionEntry[], count: number }
 */
const archived: GatewayRequestHandler = async ({ respond }) => {
  const entries = await getArchivedSessions();
  respond(true, { archived: entries, count: entries.length });
};

/**
 * sessions.autoArchive — Trigger an auto-archive run manually.
 *
 * Returns the auto-archive result with counts and details.
 */
const autoArchive: GatewayRequestHandler = async ({ respond }) => {
  const result = await runAutoArchive();
  respond(true, result);
};

export const sessionArchiveHandlers: GatewayRequestHandlers = {
  "sessions.archive": archive,
  "sessions.unarchive": unarchive,
  "sessions.archived": archived,
  "sessions.autoArchive": autoArchive,
};
