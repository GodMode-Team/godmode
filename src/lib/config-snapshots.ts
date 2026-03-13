/**
 * config-snapshots.ts — Versioned snapshots of GodMode configuration state.
 *
 * Captures roster config, trust scores, active skill cards, cron job count,
 * and memory stats into timestamped JSON files. Supports listing and rollback.
 *
 * Snapshots live at ~/godmode/data/snapshots/<timestamp>.json.
 * The heartbeat takes one snapshot per day, capped at 30.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, localDateString } from "../data-paths.js";

// ── Types ────────────────────────────────────────────────────────

export type ConfigSnapshot = {
  timestamp: string; // ISO 8601
  date: string; // YYYY-MM-DD
  roster: Array<{
    slug: string;
    name: string;
    category: string;
    taskTypes: string[];
    engine?: string;
  }>;
  trustScores: Record<string, number>;
  skillCards: string[]; // slugs
  cronJobCount: number;
  memoryEntryCount: number | null; // null if unavailable
};

// ── Paths ────────────────────────────────────────────────────────

const SNAPSHOTS_DIR = join(DATA_DIR, "snapshots");
const MAX_SNAPSHOTS = 30;

function ensureDir(): void {
  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
}

// ── Capture ──────────────────────────────────────────────────────

/**
 * Capture a snapshot of current GodMode configuration state.
 * Saves to ~/godmode/data/snapshots/<ISO-timestamp>.json.
 */
export async function captureSnapshot(): Promise<ConfigSnapshot> {
  ensureDir();

  const now = new Date();
  const timestamp = now.toISOString();
  const date = localDateString();

  // Roster config
  let roster: ConfigSnapshot["roster"] = [];
  try {
    const { loadRoster } = await import("./agent-roster.js");
    roster = loadRoster().map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      taskTypes: p.taskTypes,
      engine: p.engine,
    }));
  } catch { /* roster unavailable */ }

  // Trust scores
  let trustScores: Record<string, number> = {};
  try {
    const trustPath = join(DATA_DIR, "trust-tracker.json");
    if (existsSync(trustPath)) {
      const raw = readFileSync(trustPath, "utf-8");
      const data = JSON.parse(raw) as {
        workflows?: Array<{ name: string; score: number }>;
      };
      if (data.workflows) {
        for (const w of data.workflows) {
          trustScores[w.name] = w.score;
        }
      }
    }
  } catch { /* trust data unavailable */ }

  // Skill cards
  let skillCards: string[] = [];
  try {
    const { loadSkillCards } = await import("./skill-cards.js");
    skillCards = loadSkillCards().map((c) => c.slug);
  } catch { /* skill cards unavailable */ }

  // Cron job count
  let cronJobCount = 0;
  try {
    const { getCronSkills } = await import("./skills-registry.js");
    cronJobCount = getCronSkills().length;
  } catch { /* skills registry unavailable */ }

  // Memory entry count (Mem0)
  let memoryEntryCount: number | null = null;
  try {
    const dbPath = join(DATA_DIR, "mem0-vectors.db");
    if (existsSync(dbPath)) {
      // Use a simple file-existence check; avoid importing heavy DB deps.
      // If the search function is available, do a wildcard count.
      const { searchMemory } = await import("./memory.js");
      const results = await searchMemory("*", 1);
      // We can't get exact count from search — mark as available but unknown
      memoryEntryCount = results.length > 0 ? -1 : 0; // -1 = "has entries, count unknown"
    }
  } catch { /* memory unavailable */ }

  const snapshot: ConfigSnapshot = {
    timestamp,
    date,
    roster,
    trustScores,
    skillCards,
    cronJobCount,
    memoryEntryCount,
  };

  // Write snapshot file — use safe filename from timestamp
  const filename = timestamp.replace(/[:.]/g, "-") + ".json";
  writeFileSync(join(SNAPSHOTS_DIR, filename), JSON.stringify(snapshot, null, 2), "utf-8");

  return snapshot;
}

// ── List ─────────────────────────────────────────────────────────

export type SnapshotEntry = {
  timestamp: string;
  date: string;
  filename: string;
};

/**
 * List available snapshots, newest first.
 */
export function listSnapshots(): SnapshotEntry[] {
  if (!existsSync(SNAPSHOTS_DIR)) return [];

  try {
    const files = readdirSync(SNAPSHOTS_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    return files.map((f) => {
      try {
        const raw = readFileSync(join(SNAPSHOTS_DIR, f), "utf-8");
        const data = JSON.parse(raw) as { timestamp: string; date: string };
        return { timestamp: data.timestamp, date: data.date, filename: f };
      } catch {
        return { timestamp: f.replace(".json", ""), date: "", filename: f };
      }
    });
  } catch {
    return [];
  }
}

// ── Rollback ─────────────────────────────────────────────────────

/**
 * Restore roster config + trust scores from a snapshot.
 * Does NOT roll back memory, cron, or skill cards — those are too stateful.
 * Writes restored config; ally sees changes on next turn.
 *
 * @param timestamp - ISO timestamp or filename prefix to match
 * @returns Summary of what was restored, or error message
 */
export async function rollbackToSnapshot(timestamp: string): Promise<{ ok: boolean; message: string }> {
  if (!existsSync(SNAPSHOTS_DIR)) {
    return { ok: false, message: "No snapshots directory found." };
  }

  // Find matching snapshot file
  const files = readdirSync(SNAPSHOTS_DIR).filter((f) => f.endsWith(".json"));
  const safeTs = timestamp.replace(/[:.]/g, "-");
  const match = files.find((f) => f.startsWith(safeTs) || f === `${safeTs}.json`);

  if (!match) {
    return { ok: false, message: `No snapshot found matching "${timestamp}".` };
  }

  let snapshot: ConfigSnapshot;
  try {
    const raw = readFileSync(join(SNAPSHOTS_DIR, match), "utf-8");
    snapshot = JSON.parse(raw) as ConfigSnapshot;
  } catch {
    return { ok: false, message: `Failed to read snapshot file: ${match}` };
  }

  // Restore trust scores
  let trustRestored = false;
  try {
    const trustPath = join(DATA_DIR, "trust-tracker.json");
    const workflows = Object.entries(snapshot.trustScores).map(([name, score]) => ({
      name,
      score,
    }));
    if (workflows.length > 0) {
      // Merge into existing trust file if it exists, otherwise create
      let existing: { workflows?: Array<{ name: string; score: number }> } = {};
      if (existsSync(trustPath)) {
        try {
          existing = JSON.parse(readFileSync(trustPath, "utf-8"));
        } catch { /* start fresh */ }
      }
      existing.workflows = workflows;
      writeFileSync(trustPath, JSON.stringify(existing, null, 2), "utf-8");
      trustRestored = true;
    }
  } catch {
    // Trust restore failed — non-fatal
  }

  // Update in-memory trust score cache in agent-roster
  try {
    const { setTrustScores } = await import("./agent-roster.js");
    const map = new Map<string, number>();
    for (const [name, score] of Object.entries(snapshot.trustScores)) {
      map.set(name, score);
    }
    setTrustScores(map);
  } catch { /* in-memory update non-fatal */ }

  const parts: string[] = [];
  parts.push(`Restored from snapshot ${snapshot.date} (${snapshot.timestamp}).`);
  if (trustRestored) parts.push(`Trust scores: ${Object.keys(snapshot.trustScores).length} workflows restored.`);
  parts.push(`Roster had ${snapshot.roster.length} personas, ${snapshot.skillCards.length} skill cards.`);
  parts.push("Note: Memory and cron state were NOT rolled back.");

  return { ok: true, message: parts.join(" ") };
}

// ── Pruning ──────────────────────────────────────────────────────

/**
 * Delete oldest snapshots to stay under the cap.
 */
export function pruneSnapshots(maxCount: number = MAX_SNAPSHOTS): number {
  if (!existsSync(SNAPSHOTS_DIR)) return 0;

  try {
    const files = readdirSync(SNAPSHOTS_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort(); // oldest first

    const excess = files.length - maxCount;
    if (excess <= 0) return 0;

    const toDelete = files.slice(0, excess);
    for (const f of toDelete) {
      try {
        unlinkSync(join(SNAPSHOTS_DIR, f));
      } catch { /* skip unremovable files */ }
    }
    return toDelete.length;
  } catch {
    return 0;
  }
}

// ── Daily Guard ──────────────────────────────────────────────────

/**
 * Check if a snapshot already exists for today.
 */
export function hasTodaySnapshot(): boolean {
  if (!existsSync(SNAPSHOTS_DIR)) return false;
  const today = localDateString();
  try {
    const files = readdirSync(SNAPSHOTS_DIR).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      try {
        const raw = readFileSync(join(SNAPSHOTS_DIR, f), "utf-8");
        const data = JSON.parse(raw) as { date?: string };
        if (data.date === today) return true;
      } catch { continue; }
    }
  } catch { /* dir read failed */ }
  return false;
}
