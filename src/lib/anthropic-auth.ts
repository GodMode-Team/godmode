/**
 * anthropic-auth.ts — Shared Anthropic API authentication + fetch helpers.
 *
 * Resolves an Anthropic API key from multiple sources:
 *   1. ANTHROPIC_API_KEY env var
 *   2. Claude Code OAuth credentials (~/.claude/.credentials.json)
 *   3. OpenClaw .env file
 *   4. OpenClaw OAuth auth-profiles.json
 *
 * Used by identity-graph.ts, session-distiller.ts, and any future module
 * that needs direct Anthropic API access.
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { ANTHROPIC_API_URL, MODEL_HAIKU } from "./constants.js";
import { join } from "node:path";

/**
 * Resolve an Anthropic API key from available sources.
 * Returns null if no key is found (caller should degrade gracefully).
 */
export function resolveAnthropicKey(): string | null {
  const envKey = process.env.ANTHROPIC_API_KEY;
  if (envKey) return envKey;

  // GodMode .env (~/godmode/.env)
  const gmRoot = process.env.GODMODE_ROOT || join(homedir(), "godmode");
  try {
    const raw = readFileSync(join(gmRoot, ".env"), "utf-8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("ANTHROPIC_API_KEY=")) {
        const val = line.slice("ANTHROPIC_API_KEY=".length).trim();
        if (val && !val.startsWith("#")) return val;
      }
    }
  } catch { /* not found */ }

  // Piggyback on Claude Code's Max subscription OAuth token.
  // This is intentional: GodMode reuses the existing Claude Code credential
  // so users don't need a separate API key. OSS users without Claude Code
  // should set ANTHROPIC_API_KEY directly.
  try {
    const credsPath = join(homedir(), ".claude", ".credentials.json");
    const creds = JSON.parse(readFileSync(credsPath, "utf-8"));
    const oauth = creds?.claudeAiOauth;
    if (oauth?.accessToken) return oauth.accessToken;
  } catch { /* not found */ }

  // Check OpenClaw .env
  try {
    const oclawEnv = join(homedir(), ".openclaw", ".env");
    const raw = readFileSync(oclawEnv, "utf-8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("ANTHROPIC_API_KEY=")) {
        const val = line.slice("ANTHROPIC_API_KEY=".length).trim();
        if (val && !val.startsWith("#")) return val;
      }
    }
  } catch { /* not found */ }

  // Check OpenClaw OAuth profile (may be stale)
  try {
    const profilesPath = join(homedir(), ".openclaw", "auth-profiles.json");
    const raw = JSON.parse(readFileSync(profilesPath, "utf-8")) as {
      profiles?: Record<string, { token?: string }>;
    };
    const profile = raw.profiles?.["anthropic:oauth"];
    if (profile?.token) return profile.token;
  } catch { /* not found */ }

  return null;
}

/**
 * Call the Anthropic Messages API and return the first text content block.
 * Handles auth resolution, prefill, and timeout. Returns null on failure.
 */
export async function callHaiku(opts: {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  maxTokens?: number;
  system?: string;
  timeoutMs?: number;
}): Promise<string | null> {
  const apiKey = resolveAnthropicKey();
  if (!apiKey) return null;

  const body: Record<string, unknown> = {
    model: opts.model ?? MODEL_HAIKU,
    max_tokens: opts.maxTokens ?? 1024,
    messages: opts.messages,
  };
  if (opts.system) body.system = opts.system;

  const response = await fetchWithTimeout(
    ANTHROPIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    },
    opts.timeoutMs ?? 15_000,
  );

  if (!response.ok) return null;
  const json = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
  return json?.content?.[0]?.type === "text" ? (json.content[0].text ?? null) : null;
}

/**
 * Fetch with a timeout. Aborts the request if it takes longer than timeoutMs.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
