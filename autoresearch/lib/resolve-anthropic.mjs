/**
 * resolve-anthropic.mjs — Shared Anthropic API key resolver for autoresearch campaigns.
 *
 * Resolution order (first valid key wins):
 *   1. ANTHROPIC_API_KEY env var (direct API key, never expires)
 *   2. Claude Code OAuth token (~/.claude/.credentials.json — has refresh token)
 *   3. OpenClaw auth-profiles.json (anthropic:oauth profile — may be stale)
 *   4. ANTHROPIC_OAUTH_TOKEN env var
 *
 * If the token fails with 401, attempts to refresh via Claude Code's refresh token.
 *
 * IMPORTANT: This module resolves cost-efficient OAuth tokens from Claude Max
 * subscription first. Direct API keys are fallback only.
 *
 * Usage:
 *   import { resolveAnthropicKey, createAnthropicCaller } from "../lib/resolve-anthropic.mjs";
 *   const key = await resolveAnthropicKey();
 *   // or
 *   const call = await createAnthropicCaller("claude-sonnet-4-6");
 *   const result = await call(systemMsg, userMsg);
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const HOME = homedir();
const CLAUDE_CREDS_PATH = join(HOME, ".claude", ".credentials.json");
const AUTH_PROFILES_PATH = join(HOME, ".openclaw", "auth-profiles.json");

// ── Token Resolution ────────────────────────────────────────────────

/**
 * Resolve the best available Anthropic API key.
 * Returns { key, source, isOAuth } or null if nothing found.
 */
export function resolveAnthropicKey() {
  // 1. Direct API key (never expires, highest priority if set)
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    return {
      key: process.env.ANTHROPIC_API_KEY.trim(),
      source: "ANTHROPIC_API_KEY env var",
      isOAuth: false,
    };
  }

  // 2. Claude Code OAuth token (most reliable — has refresh token)
  try {
    if (existsSync(CLAUDE_CREDS_PATH)) {
      const creds = JSON.parse(readFileSync(CLAUDE_CREDS_PATH, "utf-8"));
      const oauth = creds?.claudeAiOauth;
      if (oauth?.accessToken) {
        const expired = oauth.expiresAt && Date.now() > oauth.expiresAt;
        if (expired && oauth.refreshToken) {
          console.log("[resolve-anthropic] Claude Code token expired, will refresh on first use");
        }
        return {
          key: oauth.accessToken,
          source: "Claude Code OAuth (~/.claude/.credentials.json)",
          isOAuth: true,
          refreshToken: oauth.refreshToken ?? null,
          expiresAt: oauth.expiresAt ?? null,
          _credsPath: CLAUDE_CREDS_PATH,
        };
      }
    }
  } catch {}

  // 3. OpenClaw auth-profiles.json
  try {
    if (existsSync(AUTH_PROFILES_PATH)) {
      const profiles = JSON.parse(readFileSync(AUTH_PROFILES_PATH, "utf-8"));
      const entry = profiles?.profiles?.["anthropic:oauth"]
        ?? Object.values(profiles?.profiles ?? {}).find(p => p?.provider === "anthropic" && p?.token);
      if (entry?.token) {
        return {
          key: entry.token,
          source: "OpenClaw auth-profiles.json",
          isOAuth: true,
          refreshToken: null,
          expiresAt: null,
        };
      }
    }
  } catch {}

  // 4. ANTHROPIC_OAUTH_TOKEN env var
  if (process.env.ANTHROPIC_OAUTH_TOKEN?.trim()) {
    return {
      key: process.env.ANTHROPIC_OAUTH_TOKEN.trim(),
      source: "ANTHROPIC_OAUTH_TOKEN env var",
      isOAuth: true,
    };
  }

  return null;
}

// ── Token Refresh ───────────────────────────────────────────────────

/**
 * Attempt to refresh an expired Claude Code OAuth token.
 * Uses the Anthropic OAuth token refresh endpoint.
 * Returns the new access token or null on failure.
 */
async function refreshClaudeCodeToken(refreshToken, credsPath) {
  // Claude Code uses the Anthropic console OAuth endpoint
  const REFRESH_ENDPOINT = "https://console.anthropic.com/v1/oauth/token";

  try {
    console.log("[resolve-anthropic] Attempting OAuth token refresh...");
    const res = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      console.error(`[resolve-anthropic] Refresh failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const newToken = data.access_token;
    const newRefresh = data.refresh_token ?? refreshToken;
    const expiresIn = data.expires_in ?? 3600;

    if (!newToken) {
      console.error("[resolve-anthropic] Refresh response missing access_token");
      return null;
    }

    // Update Claude Code's credentials file
    if (credsPath && existsSync(credsPath)) {
      try {
        const creds = JSON.parse(readFileSync(credsPath, "utf-8"));
        if (creds.claudeAiOauth) {
          creds.claudeAiOauth.accessToken = newToken;
          creds.claudeAiOauth.refreshToken = newRefresh;
          creds.claudeAiOauth.expiresAt = Date.now() + (expiresIn * 1000);
          writeFileSync(credsPath, JSON.stringify(creds, null, 2), "utf-8");
          console.log("[resolve-anthropic] Updated Claude Code credentials with fresh token");
        }
      } catch (err) {
        console.warn(`[resolve-anthropic] Could not update credentials file: ${err.message}`);
      }
    }

    // Also update auth-profiles.json so OpenClaw gateway picks it up
    try {
      if (existsSync(AUTH_PROFILES_PATH)) {
        const profiles = JSON.parse(readFileSync(AUTH_PROFILES_PATH, "utf-8"));
        if (profiles?.profiles?.["anthropic:oauth"]) {
          profiles.profiles["anthropic:oauth"].token = newToken;
          writeFileSync(AUTH_PROFILES_PATH, JSON.stringify(profiles, null, 2), "utf-8");
          console.log("[resolve-anthropic] Updated auth-profiles.json with fresh token");
        }
      }
    } catch {}

    console.log(`[resolve-anthropic] Token refreshed successfully (expires in ${expiresIn}s)`);
    return newToken;
  } catch (err) {
    console.error(`[resolve-anthropic] Refresh error: ${err.message}`);
    return null;
  }
}

// ── High-Level Caller ───────────────────────────────────────────────

/**
 * Create a reusable Anthropic API caller with auto-refresh on 401.
 *
 * Returns an async function: (systemMsg, userMsg, maxTokens?) => string | null
 *
 * @param model - Model ID (default: "claude-sonnet-4-6")
 * @param opts  - { temperature?, maxRetries? }
 */
export async function createAnthropicCaller(model = "claude-sonnet-4-6", opts = {}) {
  const temperature = opts.temperature ?? 0.3;
  const maxRetries = opts.maxRetries ?? 3;

  let resolved = resolveAnthropicKey();
  if (!resolved) {
    console.error("[resolve-anthropic] No Anthropic API key found anywhere.");
    return null;
  }

  console.log(`[resolve-anthropic] Using: ${resolved.source}`);
  let currentKey = resolved.key;

  /**
   * Call the Anthropic Messages API.
   * Auto-refreshes on 401 if a refresh token is available.
   */
  async function call(systemMsg, userMsg, maxTokens = 500) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": currentKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            system: systemMsg,
            messages: [{ role: "user", content: userMsg }],
            temperature,
            max_tokens: maxTokens,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();

          // 401 = token expired → try refresh
          if (res.status === 401 && resolved.refreshToken) {
            console.warn(`[resolve-anthropic] 401 on attempt ${attempt + 1} — refreshing token...`);
            const newToken = await refreshClaudeCodeToken(resolved.refreshToken, resolved._credsPath);
            if (newToken) {
              currentKey = newToken;
              resolved.key = newToken;
              continue; // retry with fresh token
            }
            console.error("[resolve-anthropic] Token refresh failed. Cannot continue.");
            return null;
          }

          if (res.status === 401) {
            console.error(`[resolve-anthropic] 401 with no refresh token available. Source: ${resolved.source}`);
            return null;
          }

          // Rate limiting
          if (res.status === 429 || res.status === 529) {
            const wait = 3000 * (attempt + 1);
            console.warn(`[resolve-anthropic] Rate limited (${res.status}), waiting ${wait}ms...`);
            await new Promise(r => setTimeout(r, wait));
            continue;
          }

          console.error(`[resolve-anthropic] API error ${res.status}: ${errText.slice(0, 200)}`);
          throw new Error(`Anthropic ${res.status}`);
        }

        const data = await res.json();
        return data.content?.[0]?.text?.trim() ?? "";
      } catch (err) {
        if (attempt === maxRetries - 1) {
          console.error(`[resolve-anthropic] Failed after ${maxRetries} attempts: ${err.message}`);
          return null;
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return null;
  }

  // Expose the caller and metadata
  call.model = model;
  call.source = resolved.source;
  call.isOAuth = resolved.isOAuth;
  return call;
}

// ── Load .env Helper ────────────────────────────────────────────────

/**
 * Load env vars from a .env file (won't overwrite existing vars).
 */
export function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

/**
 * Load standard GodMode env files.
 */
export function loadGodModeEnv() {
  loadEnvFile(join(HOME, ".openclaw", ".env"));
  loadEnvFile(join(HOME, "godmode", ".env"));
}
