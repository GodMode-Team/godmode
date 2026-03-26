/**
 * session-privacy.ts — RPC handlers for private session mode.
 *
 * Private sessions prevent memory capture while preserving full
 * ally functionality. Tools, queue, and safety gates still work.
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  setSessionPrivate,
  getPrivateStatus,
} from "../lib/private-session.js";

/**
 * Toggle private mode for a session.
 * Params: { sessionKey: string, enabled: boolean }
 */
const setPrivate: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey : "";
  const enabled = params.enabled === true;

  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "sessionKey is required" });
    return;
  }

  try {
    const result = await setSessionPrivate(sessionKey, enabled);
    respond(true, result);
  } catch (err) {
    respond(false, null, {
      code: "PRIVACY_SET_FAILED",
      message: `Failed to update session privacy — session state may be corrupted or unwritable. (${String(err).slice(0, 100)})`,
    });
  }
};

/**
 * Get private session status.
 * Params: { sessionKey: string }
 */
const getStatus: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey : "";

  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "sessionKey is required" });
    return;
  }

  try {
    const result = await getPrivateStatus(sessionKey);
    respond(true, result);
  } catch (err) {
    respond(false, null, {
      code: "PRIVACY_STATUS_FAILED",
      message: `Failed to read session privacy status — session state may be unreadable. (${String(err).slice(0, 100)})`,
    });
  }
};

export const sessionPrivacyHandlers: Record<string, GatewayRequestHandler> = {
  "session.setPrivate": setPrivate,
  "session.privateStatus": getStatus,
};
