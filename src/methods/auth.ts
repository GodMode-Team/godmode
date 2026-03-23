/**
 * Auth RPC handlers — device-flow login, token status, logout.
 *
 * All auth methods are ungated (must work before a valid license/token exists).
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  loadAuthTokens,
  validateTokenOffline,
  validateAuth,
  startDeviceFlow,
  pollForToken,
  clearAuthTokens,
  getAccountInfo,
} from "../lib/auth-client.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

export const authHandlers: GatewayRequestHandlers = {
  /**
   * Get current auth status — offline check only (no network).
   * Returns { authenticated, user, plan, expiresAt } or { authenticated: false, reason }.
   */
  "auth.status": async ({ respond }) => {
    try {
      const tokens = loadAuthTokens();
      if (!tokens) {
        respond(true, { authenticated: false, reason: "no-tokens" });
        return;
      }

      const payload = validateTokenOffline(tokens.accessToken);
      if (payload) {
        respond(true, {
          authenticated: true,
          user: {
            id: payload.sub,
            email: payload.email,
            plan: payload.plan,
          },
          expiresAt: tokens.expiresAt,
        });
        return;
      }

      // Token exists but is expired or invalid — needs refresh
      respond(true, { authenticated: false, reason: "expired" });
    } catch (err) {
      respond(false, null, {
        code: "AUTH_STATUS_FAILED",
        message: String(err),
      });
    }
  },

  /**
   * Start device-flow login. Returns { user_code, verification_uri, device_code, interval }.
   * The UI should display user_code and open verification_uri in the browser,
   * then poll auth.loginPoll with the device_code.
   */
  "auth.login": async ({ respond }) => {
    try {
      const deviceFlow = await startDeviceFlow();
      respond(true, deviceFlow);
    } catch (err) {
      respond(false, null, {
        code: "DEVICE_FLOW_FAILED",
        message: String(err),
      });
    }
  },

  /**
   * Poll for device-flow completion.
   * Params: { device_code: string }
   * Returns { status: "pending" } | { status: "complete", user } | { status: "error", error }.
   */
  "auth.loginPoll": async ({ params, respond }) => {
    const deviceCode = (params as { device_code?: string }).device_code;
    if (!deviceCode) {
      respond(false, null, {
        code: "INVALID_PARAMS",
        message: "device_code is required",
      });
      return;
    }

    try {
      const result = await pollForToken(deviceCode);

      if ("pending" in result) {
        respond(true, { status: "pending" });
        return;
      }
      if ("error" in result) {
        respond(true, { status: "error", error: result.error });
        return;
      }

      // Success
      respond(true, {
        status: "complete",
        user: result.tokens.user,
        expiresAt: result.tokens.expiresAt,
      });
    } catch (err) {
      respond(false, null, {
        code: "POLL_FAILED",
        message: String(err),
      });
    }
  },

  /**
   * Log out — clears stored tokens from disk.
   */
  "auth.logout": async ({ respond }) => {
    try {
      clearAuthTokens();
      respond(true, { loggedOut: true });
    } catch (err) {
      respond(false, null, {
        code: "LOGOUT_FAILED",
        message: String(err),
      });
    }
  },

  /**
   * Get account info from the auth API (requires valid token).
   * Tries to validate/refresh first, then fetches /me endpoint.
   */
  "auth.account": async ({ respond }) => {
    try {
      const authResult = await validateAuth();
      if (!authResult.valid) {
        respond(true, { authenticated: false, reason: authResult.reason });
        return;
      }

      const tokens = loadAuthTokens();
      if (!tokens) {
        respond(true, { authenticated: false, reason: "no-tokens" });
        return;
      }

      const account = await getAccountInfo(tokens.accessToken);
      if (!account) {
        respond(true, {
          authenticated: true,
          account: null,
          message: "Could not fetch account info from server",
        });
        return;
      }

      respond(true, { authenticated: true, account });
    } catch (err) {
      respond(false, null, {
        code: "ACCOUNT_FETCH_FAILED",
        message: String(err),
      });
    }
  },
};
