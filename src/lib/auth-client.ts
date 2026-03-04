/**
 * Auth Client — JWT-based authentication for GodMode.
 *
 * Handles device-flow login, offline JWT validation via embedded public key,
 * token refresh, and local token storage at ~/.openclaw/godmode-auth.json.
 */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createVerify } from "node:crypto";

const AUTH_API = "https://lifeongodmode.com/api/auth";
const AUTH_FILE = join(process.env.HOME || "~", ".openclaw", "godmode-auth.json");

// Load the public key from the embedded PEM file
const PUBLIC_KEY = readFileSync(new URL("./auth-public-key.pem", import.meta.url), "utf-8");

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user?: { id: string; email: string; plan: string; name?: string };
}

export interface DeviceFlowResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface TokenPayload {
  sub: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}

/** Load stored auth tokens from disk */
export function loadAuthTokens(): AuthTokens | null {
  try {
    if (!existsSync(AUTH_FILE)) return null;
    const data = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
    return data as AuthTokens;
  } catch {
    return null;
  }
}

/** Save auth tokens to disk */
export function saveAuthTokens(tokens: AuthTokens): void {
  const dir = join(process.env.HOME || "~", ".openclaw");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  writeFileSync(AUTH_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 });
}

/** Clear stored auth tokens */
export function clearAuthTokens(): void {
  try {
    if (existsSync(AUTH_FILE)) {
      unlinkSync(AUTH_FILE);
    }
  } catch {
    // Ignore errors during cleanup
  }
}

/** Validate JWT offline using embedded public key (no network needed) */
export function validateTokenOffline(token: string): TokenPayload | null {
  try {
    // Split JWT
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode payload
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    // Verify signature
    const verifier = createVerify("RSA-SHA256");
    verifier.update(parts[0] + "." + parts[1]);
    const signatureValid = verifier.verify(PUBLIC_KEY, parts[2], "base64url");

    if (!signatureValid) return null;
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/** Start the device flow — returns codes for user to enter in browser */
export async function startDeviceFlow(): Promise<DeviceFlowResponse> {
  const res = await fetch(`${AUTH_API}/device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: "godmode-cli" }),
  });
  if (!res.ok) throw new Error(`Device flow failed: ${res.status}`);
  return res.json() as Promise<DeviceFlowResponse>;
}

/** Poll for token completion (called repeatedly until success or timeout) */
export async function pollForToken(
  deviceCode: string,
): Promise<{ tokens: AuthTokens } | { pending: true } | { error: string }> {
  const res = await fetch(`${AUTH_API}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }),
  });
  const data = (await res.json()) as Record<string, unknown>;

  if (data.error === "authorization_pending") return { pending: true };
  if (data.error) return { error: String(data.error) };

  // Success — we got tokens
  const payload = validateTokenOffline(String(data.access_token));
  const tokens: AuthTokens = {
    accessToken: String(data.access_token),
    refreshToken: String(data.refresh_token),
    expiresAt: Date.now() + (Number(data.expires_in) * 1000),
    user: payload
      ? { id: payload.sub, email: payload.email, plan: payload.plan }
      : undefined,
  };
  saveAuthTokens(tokens);
  return { tokens };
}

/** Refresh an expired access token */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const res = await fetch(`${AUTH_API}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;

    const payload = validateTokenOffline(String(data.access_token));
    const tokens: AuthTokens = {
      accessToken: String(data.access_token),
      refreshToken: String(data.refresh_token),
      expiresAt: Date.now() + (Number(data.expires_in) * 1000),
      user: payload
        ? { id: payload.sub, email: payload.email, plan: payload.plan }
        : undefined,
    };
    saveAuthTokens(tokens);
    return tokens;
  } catch {
    return null;
  }
}

/** Full validation: try offline first, then refresh if needed */
export async function validateAuth(): Promise<
  { valid: true; payload: TokenPayload } | { valid: false; reason: string }
> {
  const tokens = loadAuthTokens();
  if (!tokens) return { valid: false, reason: "no-tokens" };

  // Try offline validation
  const payload = validateTokenOffline(tokens.accessToken);
  if (payload) return { valid: true, payload };

  // Token expired, try refresh
  const refreshed = await refreshAccessToken(tokens.refreshToken);
  if (refreshed) {
    const newPayload = validateTokenOffline(refreshed.accessToken);
    if (newPayload) return { valid: true, payload: newPayload };
  }

  return { valid: false, reason: "expired" };
}

/** Get account info from API */
export async function getAccountInfo(
  accessToken: string,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${AUTH_API}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
