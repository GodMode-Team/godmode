/**
 * composio-setup.ts — RPC handlers for managing Composio third-party connections.
 *
 * Exposes connect, status, and disconnect methods to the UI and agent.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import * as composio from "../services/composio-client.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const DEFAULT_USER = "godmode-user";

// ── composio.connect ────────────────────────────────────────────────────
const connect: GatewayRequestHandler = async ({ params, respond }) => {
  if (!composio.isConfigured()) {
    respond(true, { error: "Composio not configured" });
    return;
  }
  const appName = typeof params.appName === "string" ? params.appName.trim() : "";
  if (!appName) {
    respond(false, null, { code: "MISSING_PARAM", message: "appName is required" });
    return;
  }
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : undefined;
  const result = await composio.initiateConnection(DEFAULT_USER, appName, callbackUrl);
  respond(true, result);
};

// ── composio.status ─────────────────────────────────────────────────────
const status: GatewayRequestHandler = async ({ respond }) => {
  if (!composio.isConfigured()) {
    respond(true, { configured: false, error: "Composio not configured" });
    return;
  }
  const connections = await composio.getConnections(DEFAULT_USER);
  const statusInfo = await composio.getStatus(DEFAULT_USER);
  respond(true, { configured: true, connections, ...statusInfo });
};

// ── composio.disconnect ─────────────────────────────────────────────────
const disconnect: GatewayRequestHandler = async ({ params, respond }) => {
  if (!composio.isConfigured()) {
    respond(true, { error: "Composio not configured" });
    return;
  }
  const appName = typeof params.appName === "string" ? params.appName.trim() : "";
  if (!appName) {
    respond(false, null, { code: "MISSING_PARAM", message: "appName is required" });
    return;
  }
  // TODO: Wire actual SDK revocation when Composio supports it
  respond(true, { appName, disconnected: false, note: "Disconnect not yet implemented — revoke access directly in the app's settings" });
};

export const composioSetupHandlers: GatewayRequestHandlers = {
  "composio.connect": connect,
  "composio.status": status,
  "composio.disconnect": disconnect,
};
