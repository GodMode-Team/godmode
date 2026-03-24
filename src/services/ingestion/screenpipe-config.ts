/**
 * screenpipe-config.ts — Configuration schema and persistence for the Screenpipe funnel.
 *
 * Screenpipe captures screen OCR data locally. This config controls what gets
 * ingested, what gets blocked, and how long summaries are retained.
 *
 * Config file: ~/godmode/data/screenpipe-config.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { DATA_DIR } from "../../data-paths.js";

// ── Types ────────────────────────────────────────────────────────────

export interface RetentionConfig {
  /** Hours to keep raw OCR frames (default 24) */
  rawHours: number;
  /** Hours to keep hourly summaries (default 48) */
  hourlyHours: number;
  /** Days to keep daily digests (default 30) */
  dailyDays: number;
  /** Days to keep weekly compressions (default 90) */
  weeklyDays: number;
  /** Monthly summaries are kept forever by default (0 = forever) */
  monthlyDays: number;
}

export interface PrivacyConfig {
  /** Domains whose content is never captured (e.g. bank sites) */
  neverCaptureDomains: string[];
  /** Strip email addresses from captured text */
  stripEmails: boolean;
}

export interface ScreenpipeConfig {
  /** Master toggle — must be explicitly enabled */
  enabled: boolean;
  /** Screenpipe API base URL */
  apiUrl: string;
  /** Apps whose frames are always discarded */
  blockedApps: string[];
  /** Retention policy per summary tier */
  retention: RetentionConfig;
  /** Privacy controls */
  privacy: PrivacyConfig;
}

// ── Defaults ─────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: ScreenpipeConfig = {
  enabled: false,
  apiUrl: "http://localhost:3030",
  blockedApps: [
    "1Password",
    "Keychain Access",
    "LastPass",
    "Bitwarden",
    "System Preferences",
    "System Settings",
    "FaceTime",
    "Photos",
    "Music",
    "Spotify",
    "Apple Music",
    "TV",
    "Netflix",
    "Preview",
  ],
  retention: {
    rawHours: 24,
    hourlyHours: 48,
    dailyDays: 30,
    weeklyDays: 90,
    monthlyDays: 0, // forever
  },
  privacy: {
    neverCaptureDomains: [],
    stripEmails: true,
  },
};

// ── Persistence ──────────────────────────────────────────────────────

const CONFIG_PATH = join(DATA_DIR, "screenpipe-config.json");

/**
 * Load config from disk, merged with defaults so new fields always exist.
 * Never throws — returns defaults on any error.
 */
export async function loadConfig(): Promise<ScreenpipeConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const stored = JSON.parse(raw) as Partial<ScreenpipeConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...stored,
      retention: { ...DEFAULT_CONFIG.retention, ...(stored.retention ?? {}) },
      privacy: { ...DEFAULT_CONFIG.privacy, ...(stored.privacy ?? {}) },
      blockedApps: stored.blockedApps ?? DEFAULT_CONFIG.blockedApps,
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Merge partial updates into the config and write to disk.
 * Creates the data directory if it doesn't exist.
 */
export async function saveConfig(
  partial: Partial<ScreenpipeConfig>,
): Promise<ScreenpipeConfig> {
  const current = await loadConfig();
  const merged: ScreenpipeConfig = {
    ...current,
    ...partial,
    retention: { ...current.retention, ...(partial.retention ?? {}) },
    privacy: { ...current.privacy, ...(partial.privacy ?? {}) },
    blockedApps: partial.blockedApps ?? current.blockedApps,
  };
  try {
    await mkdir(dirname(CONFIG_PATH), { recursive: true });
    await writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[Screenpipe] Failed to save config: ${String(err)}`);
  }
  return merged;
}
