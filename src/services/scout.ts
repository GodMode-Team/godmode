/**
 * scout.ts — External source monitoring for Proactive Intelligence.
 *
 * Monitors four external sources on staggered cadences:
 *   - OpenClaw releases (GitHub API)           — every 6h
 *   - GodMode releases (npm registry)          — every 4h
 *   - X Intelligence (XAI Responses API)       — every 2h
 *   - ClawHub marketplace (new/updated skills) — every 4h
 *
 * Each scanner is an independent async function that fails silently
 * so one broken source never blocks others.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

export type ScoutSourceId = "openclaw-docs" | "godmode-docs" | "x-intel" | "clawhub";

export type ScoutFinding = {
  id: string;
  source: ScoutSourceId;
  title: string;
  summary: string;
  url?: string;
  keywords: string[];
  discoveredAt: number;
  acknowledged: boolean;
};

export type ScoutState = {
  lastCheckAt: Record<string, number>;
  lastContentHash: Record<string, string>;
  findings: ScoutFinding[];
};

import type { Logger } from "../types/plugin-api.js";

// ── Constants ──────────────────────────────────────────────────────────

const STATE_FILE = join(DATA_DIR, "scout-state.json");
const MAX_FINDINGS = 100;
const REQUEST_TIMEOUT_MS = 15_000;

// ── Cadences (ms) ──────────────────────────────────────────────────────

export const SCOUT_CADENCES: Record<ScoutSourceId, number> = {
  "openclaw-docs": 6 * 60 * 60_000,   // 6 hours
  "godmode-docs":  4 * 60 * 60_000,   // 4 hours
  "x-intel":       2 * 60 * 60_000,   // 2 hours
  "clawhub":       4 * 60 * 60_000,   // 4 hours
};

// ── State persistence ──────────────────────────────────────────────────

function emptyState(): ScoutState {
  return {
    lastCheckAt: {},
    lastContentHash: {},
    findings: [],
  };
}

export async function readScoutState(): Promise<ScoutState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as ScoutState;
  } catch {
    return emptyState();
  }
}

async function writeScoutState(state: ScoutState): Promise<void> {
  await mkdir(join(DATA_DIR), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── Helpers ────────────────────────────────────────────────────────────

function hash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

function findingId(source: ScoutSourceId, content: string): string {
  return `${source}:${hash(content)}`;
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const words = lower.match(/\b[a-z]{3,}\b/g) ?? [];
  // Deduplicate and return top keywords
  return [...new Set(words)].slice(0, 20);
}

function isDue(state: ScoutState, source: ScoutSourceId, cadenceMultiplier: number): boolean {
  const lastCheck = state.lastCheckAt[source] ?? 0;
  const cadence = SCOUT_CADENCES[source] * cadenceMultiplier;
  return Date.now() - lastCheck >= cadence;
}

function pruneFindings(findings: ScoutFinding[]): ScoutFinding[] {
  if (findings.length <= MAX_FINDINGS) return findings;
  // Keep acknowledged ones longer, prune oldest unacknowledged first
  const sorted = [...findings].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? -1 : 1;
    return b.discoveredAt - a.discoveredAt;
  });
  return sorted.slice(0, MAX_FINDINGS);
}

// ── Scanner: OpenClaw Releases ─────────────────────────────────────────

type GitHubRelease = {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
};

async function scanOpenClawDocs(state: ScoutState, logger: Logger): Promise<ScoutFinding[]> {
  const findings: ScoutFinding[] = [];
  try {
    const resp = await fetch(
      "https://api.github.com/repos/openclaw-ai/openclaw/releases?per_page=5",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "GodMode-ProactiveIntel/1.0",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (resp.status === 403 || resp.status === 429) {
      logger.warn("[Scout] GitHub rate-limited — skipping OpenClaw docs scan");
      return [];
    }
    if (!resp.ok) {
      logger.warn(`[Scout] GitHub API returned ${resp.status}`);
      return [];
    }

    const releases = (await resp.json()) as GitHubRelease[];
    const contentHash = hash(releases.map((r) => r.tag_name).join(","));

    if (contentHash === state.lastContentHash["openclaw-docs"]) {
      return []; // No changes
    }
    state.lastContentHash["openclaw-docs"] = contentHash;

    // Check which releases are new (not already in findings)
    const existingIds = new Set(state.findings.map((f) => f.id));

    for (const release of releases.slice(0, 3)) {
      const id = findingId("openclaw-docs", release.tag_name);
      if (existingIds.has(id)) continue;

      const body = release.body?.slice(0, 300) ?? "";
      findings.push({
        id,
        source: "openclaw-docs",
        title: `OpenClaw ${release.tag_name}: ${release.name || "New Release"}`,
        summary: body || `OpenClaw ${release.tag_name} released.`,
        url: release.html_url,
        keywords: extractKeywords(`${release.name} ${body}`),
        discoveredAt: Date.now(),
        acknowledged: false,
      });
    }
  } catch (err) {
    logger.warn(`[Scout] OpenClaw docs scan failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return findings;
}

// ── Scanner: GodMode Releases (npm registry) ──────────────────────────

type NpmPackageInfo = {
  "dist-tags"?: { latest?: string };
  versions?: Record<string, { description?: string }>;
  time?: Record<string, string>;
};

async function scanGodModeDocs(state: ScoutState, logger: Logger): Promise<ScoutFinding[]> {
  const findings: ScoutFinding[] = [];
  try {
    const resp = await fetch(
      "https://registry.npmjs.org/@godmode-team/godmode",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!resp.ok) {
      logger.warn(`[Scout] npm registry returned ${resp.status}`);
      return [];
    }

    const data = (await resp.json()) as NpmPackageInfo;
    const latest = data["dist-tags"]?.latest;
    if (!latest) return [];

    const contentHash = hash(latest);
    if (contentHash === state.lastContentHash["godmode-docs"]) {
      return [];
    }
    state.lastContentHash["godmode-docs"] = contentHash;

    const id = findingId("godmode-docs", latest);
    const existingIds = new Set(state.findings.map((f) => f.id));
    if (existingIds.has(id)) return [];

    const publishedAt = data.time?.[latest];
    findings.push({
      id,
      source: "godmode-docs",
      title: `GodMode ${latest} published`,
      summary: `New GodMode version ${latest} available on npm.${publishedAt ? ` Published ${publishedAt.split("T")[0]}.` : ""}`,
      url: `https://www.npmjs.com/package/@godmode-team/godmode`,
      keywords: ["godmode", "update", "release", "plugin"],
      discoveredAt: Date.now(),
      acknowledged: false,
    });
  } catch (err) {
    logger.warn(`[Scout] GodMode docs scan failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return findings;
}

// ── Scanner: X Intelligence (XAI API) ─────────────────────────────────

async function scanXIntelligence(state: ScoutState, logger: Logger): Promise<ScoutFinding[]> {
  const findings: ScoutFinding[] = [];
  try {
    // Reuse the existing fetchXIntelligence from brief-generator
    const { fetchXIntelligence } = await import("../methods/brief-generator.js");
    const result = await fetchXIntelligence();

    if (result.error || result.items.length === 0) {
      if (result.error && !result.error.includes("not set")) {
        logger.warn(`[Scout] X Intelligence scan: ${result.error}`);
      }
      return [];
    }

    const existingIds = new Set(state.findings.map((f) => f.id));

    for (const item of result.items.slice(0, 6)) {
      const id = findingId("x-intel", item.text.slice(0, 100));
      if (existingIds.has(id)) continue;

      findings.push({
        id,
        source: "x-intel",
        title: `X: ${item.text.slice(0, 80)}${item.text.length > 80 ? "…" : ""}`,
        summary: item.text,
        url: item.url,
        keywords: extractKeywords(item.text),
        discoveredAt: Date.now(),
        acknowledged: false,
      });
    }

    // Update content hash based on the items we got
    const contentHash = hash(result.items.map((i) => i.text.slice(0, 50)).join("|"));
    state.lastContentHash["x-intel"] = contentHash;
  } catch (err) {
    logger.warn(`[Scout] X Intelligence scan failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return findings;
}

// ── Scanner: ClawHub Marketplace ──────────────────────────────────────

type ClawHubSkillItem = {
  slug: string;
  displayName: string;
  summary?: string | null;
  updatedAt: number;
  tags?: unknown;
  stats?: unknown;
  latestVersion?: { version: string; changelog: string };
};

type ClawHubListResponse = {
  items: ClawHubSkillItem[];
  nextCursor: string | null;
};

async function scanClawHub(state: ScoutState, logger: Logger): Promise<ScoutFinding[]> {
  const findings: ScoutFinding[] = [];
  try {
    const url = new URL("/api/v1/skills", "https://clawhub.ai");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("limit", "10");

    const resp = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!resp.ok) {
      logger.warn(`[Scout] ClawHub API returned ${resp.status}`);
      return [];
    }

    const data = (await resp.json()) as ClawHubListResponse;
    if (!data.items || data.items.length === 0) return [];

    const contentHash = hash(data.items.map((s) => `${s.slug}:${s.updatedAt}`).join(","));
    if (contentHash === state.lastContentHash["clawhub"]) {
      return [];
    }
    state.lastContentHash["clawhub"] = contentHash;

    const existingIds = new Set(state.findings.map((f) => f.id));

    for (const skill of data.items.slice(0, 5)) {
      const id = findingId("clawhub", `${skill.slug}:${skill.updatedAt}`);
      if (existingIds.has(id)) continue;

      const changelog = skill.latestVersion?.changelog;
      findings.push({
        id,
        source: "clawhub",
        title: `ClawHub: ${skill.displayName || skill.slug}`,
        summary: changelog
          ? `${skill.summary ?? skill.displayName} — ${changelog.slice(0, 150)}`
          : skill.summary ?? `New/updated skill: ${skill.displayName}`,
        url: `https://clawhub.ai/skills/${skill.slug}`,
        keywords: extractKeywords(
          `${skill.displayName} ${skill.summary ?? ""} ${changelog ?? ""}`,
        ),
        discoveredAt: Date.now(),
        acknowledged: false,
      });
    }
  } catch (err) {
    logger.warn(`[Scout] ClawHub scan failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return findings;
}

// ── Public API ─────────────────────────────────────────────────────────

const SCANNERS: Record<ScoutSourceId, (state: ScoutState, logger: Logger) => Promise<ScoutFinding[]>> = {
  "openclaw-docs": scanOpenClawDocs,
  "godmode-docs": scanGodModeDocs,
  "x-intel": scanXIntelligence,
  "clawhub": scanClawHub,
};

/**
 * Run all due scout scans and persist new findings.
 * Returns the number of new findings discovered this cycle.
 */
export async function runScoutCycle(
  logger: Logger,
  cadenceMultiplier = 1.0,
): Promise<{ newFindings: number; sources: ScoutSourceId[] }> {
  const state = await readScoutState();
  const scannedSources: ScoutSourceId[] = [];
  let totalNew = 0;

  for (const [source, scanner] of Object.entries(SCANNERS) as [ScoutSourceId, typeof SCANNERS[ScoutSourceId]][]) {
    if (!isDue(state, source, cadenceMultiplier)) continue;

    try {
      const newFindings = await scanner(state, logger);
      state.lastCheckAt[source] = Date.now();
      scannedSources.push(source);

      if (newFindings.length > 0) {
        state.findings.push(...newFindings);
        totalNew += newFindings.length;
        logger.info(`[Scout] ${source}: ${newFindings.length} new finding(s)`);
      }
    } catch (err) {
      logger.warn(`[Scout] ${source} scanner error: ${err instanceof Error ? err.message : String(err)}`);
      state.lastCheckAt[source] = Date.now(); // Don't retry immediately on crash
    }
  }

  // Prune old findings
  state.findings = pruneFindings(state.findings);

  await writeScoutState(state);
  return { newFindings: totalNew, sources: scannedSources };
}

/**
 * Force-run all scanners regardless of cadence.
 */
export async function runScoutForceRefresh(logger: Logger): Promise<{ newFindings: number }> {
  const state = await readScoutState();
  let totalNew = 0;

  for (const [source, scanner] of Object.entries(SCANNERS) as [ScoutSourceId, typeof SCANNERS[ScoutSourceId]][]) {
    try {
      const newFindings = await scanner(state, logger);
      state.lastCheckAt[source] = Date.now();

      if (newFindings.length > 0) {
        state.findings.push(...newFindings);
        totalNew += newFindings.length;
      }
    } catch (err) {
      logger.warn(`[Scout] Force refresh ${source} failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  state.findings = pruneFindings(state.findings);
  await writeScoutState(state);
  return { newFindings: totalNew };
}
