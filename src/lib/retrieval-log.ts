/**
 * retrieval-log.ts — Retrieval trajectory logging for GodMode.
 *
 * Logs every memory/vault search: what was queried, what matched,
 * confidence scores, and which source answered. This is the missing
 * observability layer — lets you see WHY something was or wasn't retrieved.
 *
 * Storage: ~/godmode/data/retrieval-log.jsonl (append-only, rotated daily)
 * In-memory: Ring buffer of last 200 entries for real-time stats.
 */

import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ────────────────────────────────────────────────────────────

export interface RetrievalEntry {
  /** ISO timestamp */
  ts: string;
  /** Search source: "mem0", "qmd", "file-walk" */
  source: "mem0" | "qmd" | "file-walk";
  /** The query that was searched */
  query: string;
  /** Number of results returned (after filtering) */
  resultCount: number;
  /** Top result score (0-1 for mem0, raw score for qmd) */
  topScore: number | null;
  /** Top 3 result summaries (truncated) */
  topResults: Array<{ snippet: string; score?: number }>;
  /** Total elapsed time in ms */
  elapsedMs: number;
  /** Whether this was injected into context */
  injected: boolean;
  /** Optional: collection/scope used */
  scope?: string;
  /** Optional: reason for empty results */
  emptyReason?: string;
}

// ── Ring Buffer ──────────────────────────────────────────────────────

const BUFFER_SIZE = 200;
const buffer: RetrievalEntry[] = [];

// ── Public API ───────────────────────────────────────────────────────

/**
 * Log a retrieval event. Appends to in-memory buffer and disk.
 * Fire-and-forget — never throws.
 */
export function logRetrieval(entry: RetrievalEntry): void {
  buffer.push(entry);
  if (buffer.length > BUFFER_SIZE) buffer.shift();

  // Async append to disk
  void appendToDisk(entry);
}

/**
 * Get stats from the in-memory buffer (last ~200 searches).
 * Used by the awareness snapshot for operational visibility.
 */
export function getRetrievalStats(): {
  totalSearches: number;
  totalResults: number;
  avgTopScore: number;
  emptySearches: number;
  bySource: Record<string, number>;
} {
  if (buffer.length === 0) {
    return { totalSearches: 0, totalResults: 0, avgTopScore: 0, emptySearches: 0, bySource: {} };
  }

  // Only count last 24 hours
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const recent = buffer.filter((e) => new Date(e.ts).getTime() > cutoff);

  if (recent.length === 0) {
    return { totalSearches: 0, totalResults: 0, avgTopScore: 0, emptySearches: 0, bySource: {} };
  }

  const totalResults = recent.reduce((sum, e) => sum + e.resultCount, 0);
  const withScores = recent.filter((e) => e.topScore != null && e.topScore > 0);
  const avgTopScore = withScores.length > 0
    ? withScores.reduce((sum, e) => sum + (e.topScore ?? 0), 0) / withScores.length
    : 0;
  const emptySearches = recent.filter((e) => e.resultCount === 0).length;

  const bySource: Record<string, number> = {};
  for (const e of recent) {
    bySource[e.source] = (bySource[e.source] ?? 0) + 1;
  }

  return {
    totalSearches: recent.length,
    totalResults,
    avgTopScore,
    emptySearches,
    bySource,
  };
}

/**
 * Get recent retrieval entries (for diagnostics / repair tool).
 */
export function getRecentRetrievals(limit = 20): RetrievalEntry[] {
  return buffer.slice(-limit);
}

// ── Disk Persistence ─────────────────────────────────────────────────

const LOG_PATH = join(DATA_DIR, "retrieval-log.jsonl");

async function appendToDisk(entry: RetrievalEntry): Promise<void> {
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");
  } catch {
    // Disk write non-fatal
  }
}
