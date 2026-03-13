/**
 * ally-identity.ts — Resolve the main agent's ally name at runtime.
 *
 * Reads from the OpenClaw host config (~/.openclaw/config.json)
 * under agents.list → first entry with default:true → identity.name.
 * Falls back to "Ally" so no code ever hardcodes a specific persona name.
 *
 * Result is cached for 30 minutes (matches identity anchor TTL).
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULT_ALLY_NAME = "Ally";
const CACHE_TTL_MS = 30 * 60 * 1000;

let cachedName: string | null = null;
let cachedAt = 0;

/**
 * Get the configured ally name for the main agent.
 * Synchronous + cached for hot-path use (context budget, memory tagging).
 */
export function getAllyName(): string {
  if (cachedName && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedName;
  }

  try {
    const configPath = join(
      process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw"),
      "config.json",
    );
    const raw = readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    const agents: any[] = config?.agents?.list;
    if (Array.isArray(agents)) {
      // Prefer the default agent, fall back to first entry
      const main = agents.find((a: any) => a.default === true) ?? agents[0];
      const name = main?.identity?.name;
      if (typeof name === "string" && name.trim()) {
        cachedName = name.trim();
        cachedAt = Date.now();
        return cachedName;
      }
    }
  } catch {
    // Config not readable — use default
  }

  cachedName = DEFAULT_ALLY_NAME;
  cachedAt = Date.now();
  return cachedName;
}

/**
 * Get the ally name lowercased — for use as agentId, trigger words, etc.
 */
export function getAllyNameLower(): string {
  return getAllyName().toLowerCase();
}

/** Invalidate the cache (e.g. after config change). */
export function clearAllyNameCache(): void {
  cachedName = null;
  cachedAt = 0;
}
