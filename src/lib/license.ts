/**
 * license.ts — License validation and RPC gate for GodMode.
 *
 * Handles JWT-based auth, legacy license keys, and dev keys.
 * Wraps RPC handlers with a license gate that validates lazily
 * on first call and caches the result.
 */

import {
  loadAuthTokens,
  validateTokenOffline,
  refreshAccessToken,
} from "./auth-client.js";

const LICENSE_API_URL = "https://lifeongodmode.com/api/v1/license/validate";
const LICENSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type LicenseState = {
  status: "pending" | "validating" | "valid" | "invalid" | "no-key" | "expired";
  tier?: string;
  email?: string;
  checkedAt?: number;
  error?: string;
};

let licenseState: LicenseState = { status: "pending" };
let validationPromise: Promise<boolean> | null = null;

export function getLicenseState(): LicenseState {
  return licenseState;
}

export function setLicenseState(state: LicenseState): void {
  licenseState = state;
}

export function isDevKey(key: string): boolean {
  return key.startsWith("GM-DEV-") || key === "GM-INTERNAL";
}

export async function validateLicense(
  key: string,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
): Promise<boolean> {
  // Dev/internal keys bypass remote validation
  if (isDevKey(key)) {
    licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
    return true;
  }

  // Check cache
  if (
    licenseState.status === "valid" &&
    licenseState.checkedAt &&
    Date.now() - licenseState.checkedAt < LICENSE_CACHE_TTL_MS
  ) {
    return true;
  }

  licenseState = { ...licenseState, status: "validating" };

  try {
    const res = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const body = (await res.json()) as { valid: boolean; tier?: string };
      if (body.valid) {
        licenseState = { status: "valid", checkedAt: Date.now(), tier: body.tier };
        logger.info(`[GodMode] License validated (tier: ${body.tier ?? "standard"})`);
        return true;
      }
      licenseState = {
        status: "invalid",
        checkedAt: Date.now(),
        error: "License key rejected by server",
      };
      return false;
    }
    licenseState = {
      status: "invalid",
      checkedAt: Date.now(),
      error: `License server returned ${res.status}`,
    };
    return false;
  } catch (err) {
    // Network error — allow grace period if previously validated
    if (licenseState.checkedAt && licenseState.tier) {
      logger.warn("[GodMode] License server unreachable — using cached validation");
      licenseState = {
        status: "valid",
        checkedAt: licenseState.checkedAt,
        tier: licenseState.tier,
      };
      return true;
    }
    licenseState = {
      status: "invalid",
      checkedAt: Date.now(),
      error: `Network error: ${err instanceof Error ? err.message : "unknown"}`,
    };
    return false;
  }
}

/**
 * Wraps an RPC handler with a license gate. On first call, triggers async
 * license validation. Subsequent calls use cached result. If license is
 * invalid, responds with LICENSE_REQUIRED error.
 */
export function withLicenseGate(
  key: string | undefined,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
  handler: Function,
): Function {
  return async (ctx: { respond: Function; [k: string]: unknown }) => {
    // Already validated (JWT or dev key) — pass through
    if (licenseState.status === "valid") {
      // Re-validate legacy license keys if cache expired
      if (
        key &&
        !isDevKey(key) &&
        licenseState.checkedAt &&
        Date.now() - licenseState.checkedAt >= LICENSE_CACHE_TTL_MS
      ) {
        if (!validationPromise) {
          validationPromise = validateLicense(key, logger).finally(() => {
            validationPromise = null;
          });
        }
        await validationPromise;
        if (licenseState.status !== "valid") {
          ctx.respond(false, undefined, {
            code: "LICENSE_INVALID",
            message: licenseState.error ?? "GodMode license is invalid or expired.",
          });
          return;
        }
      }
      return handler(ctx);
    }

    // Dev keys pass through immediately
    if (key && isDevKey(key)) {
      licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
      return handler(ctx);
    }

    // Legacy license key — first caller triggers validation
    if (key && (licenseState.status === "pending" || licenseState.status === "validating")) {
      if (!validationPromise) {
        validationPromise = validateLicense(key, logger).finally(() => {
          validationPromise = null;
        });
      }
      await validationPromise;
    }

    // JWT auth — try refresh if status is pending/expired
    if (!key && (licenseState.status === "pending" || licenseState.status === "expired" || licenseState.status === "no-key")) {
      const authTokens = loadAuthTokens();
      if (authTokens) {
        // Try offline validation first
        const payload = validateTokenOffline(authTokens.accessToken);
        if (payload) {
          licenseState = { status: "valid", checkedAt: Date.now(), tier: payload.plan, email: payload.email };
        } else {
          // Try refresh
          try {
            const refreshed = await refreshAccessToken(authTokens.refreshToken);
            if (refreshed) {
              const newPayload = validateTokenOffline(refreshed.accessToken);
              if (newPayload) {
                licenseState = { status: "valid", checkedAt: Date.now(), tier: newPayload.plan, email: newPayload.email };
              }
            }
          } catch {
            // Refresh failed — continue to error below
          }
        }
      }
    }

    if (licenseState.status !== "valid") {
      ctx.respond(false, undefined, {
        code: "LICENSE_REQUIRED",
        message: licenseState.error ?? "GodMode authentication required. Log in via auth.login or set a GM-DEV-* license key.",
      });
      return;
    }

    return handler(ctx);
  };
}

/**
 * Initialize license state from config during synchronous register().
 * Returns the resolved license state.
 */
export function initLicenseFromConfig(
  licenseKey: string | undefined,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
): LicenseState {
  if (licenseKey && typeof licenseKey === "string" && (licenseKey.startsWith("GM-DEV-") || licenseKey === "GM-INTERNAL")) {
    licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
    logger.info(`[GodMode] License validated (tier: developer)`);
  } else {
    const authTokens = loadAuthTokens();
    if (!authTokens) {
      licenseState = { status: "no-key" };
      logger.warn("[GodMode] No auth tokens found. Log in via auth.login or set a GM-DEV-* license key.");
    } else {
      const payload = validateTokenOffline(authTokens.accessToken);
      if (payload) {
        licenseState = { status: "valid", checkedAt: Date.now(), tier: payload.plan, email: payload.email };
        logger.info(`[GodMode] Auth validated offline (plan: ${payload.plan}, email: ${payload.email})`);
      } else {
        licenseState = { status: "pending" };
        logger.info("[GodMode] Auth token expired — will attempt refresh on gateway start");
      }
    }
  }
  return licenseState;
}

/**
 * Attempt JWT token refresh during gateway_start.
 */
export async function refreshLicenseOnStart(
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
): Promise<void> {
  if (licenseState.status !== "pending") return;

  try {
    const authTokens = loadAuthTokens();
    if (authTokens) {
      const refreshed = await refreshAccessToken(authTokens.refreshToken);
      if (refreshed) {
        const newPayload = validateTokenOffline(refreshed.accessToken);
        if (newPayload) {
          licenseState = { status: "valid", checkedAt: Date.now(), tier: newPayload.plan, email: newPayload.email };
          logger.info(`[GodMode] Auth token refreshed (plan: ${newPayload.plan})`);
        } else {
          licenseState = { status: "expired" };
          logger.warn("[GodMode] Auth token refresh succeeded but validation failed");
        }
      } else {
        licenseState = { status: "expired" };
        logger.warn("[GodMode] Auth token refresh failed — user needs to re-authenticate via auth.login");
      }
    }
  } catch (err) {
    licenseState = { status: "expired" };
    logger.warn(`[GodMode] Auth token refresh error: ${String(err)}`);
  }
}
