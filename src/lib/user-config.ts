/**
 * user-config.ts — Shared helpers for reading user configuration.
 *
 * Reads timezone, location, and other user settings from:
 * 1. godmode-options.json (plugin settings)
 * 2. openclaw.json (onboarding-stored defaults)
 * 3. System detection as fallback
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { resolveConfigPath } from "./openclaw-state.js";

const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

/** Cached config to avoid repeated disk reads within the same tick. */
let cachedOptions: Record<string, unknown> | null = null;
let cachedOcConfig: Record<string, unknown> | null = null;
let cacheTs = 0;
const CACHE_TTL_MS = 5_000;

function refreshCache(): void {
  const now = Date.now();
  if (cachedOptions && now - cacheTs < CACHE_TTL_MS) return;
  cacheTs = now;

  try {
    cachedOptions = JSON.parse(readFileSync(OPTIONS_FILE, "utf-8")) as Record<string, unknown>;
  } catch {
    cachedOptions = {};
  }

  try {
    const ocRaw = JSON.parse(readFileSync(resolveConfigPath(), "utf-8")) as Record<string, unknown>;
    cachedOcConfig = ocRaw;
  } catch {
    cachedOcConfig = {};
  }
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Get the user's configured timezone.
 * Priority: godmode-options → openclaw.json onboarding → system detection → UTC fallback
 */
export function getUserTimezone(): string {
  refreshCache();

  // 1. Check godmode-options.json
  const optTz = cachedOptions?.["user.timezone"];
  if (typeof optTz === "string" && optTz.trim()) return optTz.trim();

  // 2. Check openclaw.json (onboarding stores at agents.defaults.userTimezone)
  if (cachedOcConfig) {
    const ocTz = getNestedValue(cachedOcConfig, "agents.defaults.userTimezone");
    if (typeof ocTz === "string" && ocTz.trim()) return ocTz.trim();
  }

  // 3. System detection
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Get the user's configured location for weather, etc.
 * Priority: godmode-options → CONTEXT.md → null (skip weather)
 */
export function getUserLocation(): string | null {
  refreshCache();

  // 1. Check godmode-options.json
  const optLoc = cachedOptions?.["user.location"];
  if (typeof optLoc === "string" && optLoc.trim()) return optLoc.trim();

  // 2. Check CONTEXT.md for a location line
  try {
    const contextPath = join(DATA_DIR, "..", "memory", "CONTEXT.md");
    const raw = readFileSync(contextPath, "utf-8");
    const locMatch = raw.match(/(?:location|city|weather\s*location)[:\s]+([^\n]+)/i);
    if (locMatch) {
      const loc = locMatch[1].trim();
      if (loc) return loc;
    }
  } catch {
    // No CONTEXT.md
  }

  return null;
}

/**
 * Get the user's configured temperature unit.
 * Returns "F" or "C". Default: "F".
 */
export function getTempUnit(): "F" | "C" {
  refreshCache();
  const unit = cachedOptions?.["user.tempUnit"];
  if (unit === "C" || unit === "c") return "C";
  return "F";
}
