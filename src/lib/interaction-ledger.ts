/**
 * interaction-ledger.ts — Layer 6: Behavioral Memory System.
 *
 * Extracts structured behavioral signals (preferences, avoidances, corrections,
 * decisions, satisfaction, patterns) from session transcripts and compounds them
 * across sessions. Signals are deduped, merged, confidence-scored, and injected
 * into the L2 awareness snapshot.
 *
 * Storage: SQLite via better-sqlite3 at ~/godmode/data/interaction-ledger.db
 * Extraction: Claude Haiku (claude-haiku-4-5-20251001) via direct API call
 * All operations wrapped in try/catch — failures are invisible.
 */

import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";

// ── Types ────────────────────────────────────────────────────────────

export type SignalType =
  | "preference"
  | "avoidance"
  | "correction"
  | "decision"
  | "satisfaction"
  | "pattern";

export type SignalCategory =
  | "communication"
  | "formatting"
  | "workflow"
  | "tools"
  | "content"
  | "timing"
  | "delegation"
  | "technical";

export interface RawSignal {
  type: SignalType;
  content: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
  category: SignalCategory;
}

export interface StoredSignal {
  id: string;
  type: string;
  category: string;
  content: string;
  evidence: string | null;
  confidence: number;
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  last_session_key: string | null;
  active: number; // 1=active, 0=dormant, -1=dismissed
  superseded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConflictPair {
  signalA: StoredSignal;
  signalB: StoredSignal;
  reason: string;
}

export interface LedgerStats {
  total: number;
  active: number;
  dormant: number;
  dismissed: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}

// ── Constants ────────────────────────────────────────────────────────

const DB_PATH = join(DATA_DIR, "interaction-ledger.db");

const CONFIDENCE_WEIGHTS: Record<string, number> = {
  high: 0.9,
  medium: 0.6,
  low: 0.3,
};

const DECAY_HALF_LIFE_DAYS = 30;

const SIGNAL_TYPE_LABELS: Record<string, string> = {
  preference: "PREF",
  avoidance: "AVOID",
  correction: "CORR",
  decision: "DEC",
  satisfaction: "SAT",
  pattern: "PAT",
};

const CONFLICT_PAIRS: [string, string][] = [
  ["short", "detail"],
  ["concise", "thorough"],
  ["brief", "comprehensive"],
  ["simple", "complex"],
  ["fast", "careful"],
  ["autonomous", "ask first"],
  ["bullet", "paragraph"],
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "to", "of",
  "and", "in", "that", "it", "for", "not", "on", "with", "this",
  "but", "from", "they", "have", "has", "had", "been", "can",
]);

const EXTRACTION_PROMPT = `You are a behavioral signal extractor for a personal AI system. Given a conversation transcript between a user and their AI ally, extract structured behavioral signals.

Extract ONLY signals that are clearly present. Do not infer or guess. Each signal must have direct textual evidence.

Signal types:
- preference: Something the user explicitly or implicitly prefers ("I like bullet points", consistently chooses short replies)
- avoidance: Something the user explicitly dislikes or rejects ("Don't use emojis", "Stop asking permission")
- correction: The user corrects the AI's behavior or output ("No, I meant X not Y", "That's too long")
- decision: A choice the user made between alternatives ("Let's go with Fathom over Granola", "Use SQLite not Postgres")
- satisfaction: Positive signal — something worked well ("Perfect", "This is exactly what I needed", "Great format")
- pattern: Recurring behavior (works late, always starts with X, prefers async)

For each signal, provide:
- type: one of the above
- content: 1-sentence natural language description (e.g., "Prefers bullet points over paragraphs")
- evidence: the exact quote or behavior that triggered this signal
- confidence: high (explicit statement), medium (strong implication), low (weak signal)
- category: one of [communication, formatting, workflow, tools, content, timing, delegation, technical]

Return JSON array. If no signals found, return [].

<transcript>
{TRANSCRIPT}
</transcript>`;

// ── Singleton DB ─────────────────────────────────────────────────────

let db: InstanceType<typeof Database> | null = null;

function ensureDb(): InstanceType<typeof Database> | null {
  if (db) return db;
  try {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS signals (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        evidence TEXT,
        confidence REAL NOT NULL DEFAULT 0.5,
        occurrence_count INTEGER DEFAULT 1,
        first_seen TEXT NOT NULL,
        last_seen TEXT NOT NULL,
        last_session_key TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        superseded_by TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_signals_active_ranked
        ON signals(active, confidence DESC, last_seen DESC);

      CREATE TABLE IF NOT EXISTS extraction_state (
        source_type TEXT NOT NULL,
        source_id TEXT NOT NULL,
        extracted_at TEXT NOT NULL,
        signal_count INTEGER DEFAULT 0,
        PRIMARY KEY (source_type, source_id)
      );

      CREATE TABLE IF NOT EXISTS conflicts (
        id TEXT PRIMARY KEY,
        signal_a_id TEXT NOT NULL,
        signal_b_id TEXT NOT NULL,
        resolution TEXT,
        resolved_at TEXT,
        context TEXT
      );
    `);
    return db;
  } catch (err) {
    console.warn(`[Interaction Ledger] Init failed: ${String(err)}`);
    db = null;
    return null;
  }
}

// ── Public DB access ─────────────────────────────────────────────────

export function initLedgerDb(): void {
  ensureDb();
}

export function getLedgerDb(): InstanceType<typeof Database> | null {
  return ensureDb();
}

export function isLedgerReady(): boolean {
  return ensureDb() !== null;
}

// ── Confidence computation ───────────────────────────────────────────

export function computeConfidence(signal: StoredSignal, newRaw?: RawSignal): number {
  const occurrenceBoost = Math.min(1.0, Math.log2(signal.occurrence_count + 1) / 4);

  const daysSinceLastSeen =
    (Date.now() - new Date(signal.last_seen).getTime()) / 86_400_000;
  const recencyFactor = Math.pow(0.5, daysSinceLastSeen / DECAY_HALF_LIFE_DAYS);

  const rawConfidence = newRaw
    ? (CONFIDENCE_WEIGHTS[newRaw.confidence] ?? 0.6)
    : CONFIDENCE_WEIGHTS.medium;

  const score = rawConfidence * 0.4 + occurrenceBoost * 0.3 + recencyFactor * 0.3;
  return Math.round(score * 1000) / 1000;
}

// ── Keyword extraction + similarity ──────────────────────────────────

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  let intersectionSize = 0;
  for (const x of a) {
    if (b.has(x)) intersectionSize++;
  }
  const unionSize = new Set([...a, ...b]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

// ── Dedup / find similar ─────────────────────────────────────────────

export function findSimilarSignal(raw: RawSignal): StoredSignal | null {
  const d = ensureDb();
  if (!d) return null;

  try {
    // Fast path: exact content match
    const exact = d
      .prepare(
        `SELECT * FROM signals WHERE type = ? AND category = ? AND content = ? AND active >= 0`,
      )
      .get(raw.type, raw.category, raw.content) as StoredSignal | undefined;
    if (exact) return exact;

    // Keyword overlap (Jaccard >= 0.4)
    const candidates = d
      .prepare(
        `SELECT * FROM signals WHERE type = ? AND category = ? AND active >= 0`,
      )
      .all(raw.type, raw.category) as StoredSignal[];

    const rawKeywords = extractKeywords(raw.content);
    for (const candidate of candidates) {
      const existing = extractKeywords(candidate.content);
      if (jaccardSimilarity(rawKeywords, existing) >= 0.4) return candidate;
    }
  } catch {
    // non-fatal
  }
  return null;
}

// ── Merge ────────────────────────────────────────────────────────────

export function mergeSignal(
  existing: StoredSignal,
  raw: RawSignal,
  sessionKey?: string,
): void {
  const d = ensureDb();
  if (!d) return;

  try {
    const now = new Date().toISOString();
    const newCount = existing.occurrence_count + 1;
    const newConfidence = computeConfidence(
      { ...existing, occurrence_count: newCount, last_seen: now },
      raw,
    );

    // Use the more specific content (longer = more context)
    const content =
      raw.content.length > existing.content.length ? raw.content : existing.content;

    d.prepare(
      `UPDATE signals SET
        content = ?, confidence = ?, occurrence_count = ?,
        last_seen = ?, last_session_key = ?, updated_at = ?
      WHERE id = ?`,
    ).run(content, newConfidence, newCount, now, sessionKey ?? null, now, existing.id);
  } catch {
    // non-fatal
  }
}

// ── Upsert (insert or merge) ────────────────────────────────────────

export function upsertSignal(raw: RawSignal, sessionKey?: string): string | null {
  const d = ensureDb();
  if (!d) return null;

  try {
    const similar = findSimilarSignal(raw);
    if (similar) {
      mergeSignal(similar, raw, sessionKey);
      return similar.id;
    }

    // Insert new signal
    const id = randomUUID();
    const now = new Date().toISOString();
    const confidence = CONFIDENCE_WEIGHTS[raw.confidence] ?? 0.6;

    d.prepare(
      `INSERT INTO signals (id, type, category, content, evidence, confidence,
        occurrence_count, first_seen, last_seen, last_session_key, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, 1, ?, ?)`,
    ).run(
      id, raw.type, raw.category, raw.content, raw.evidence ?? null,
      confidence, now, now, sessionKey ?? null, now, now,
    );
    return id;
  } catch {
    return null;
  }
}

// ── Extraction via Haiku ─────────────────────────────────────────────

export async function extractSignals(transcript: string): Promise<RawSignal[]> {
  if (!transcript || transcript.length < 50) return [];

  const apiKey = resolveAnthropicKey();
  if (!apiKey) return [];

  const truncated = transcript.slice(0, 6000);

  try {
    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: EXTRACTION_PROMPT.replace("{TRANSCRIPT}", truncated),
        },
        {
          role: "assistant",
          content: "[",
        },
      ],
    });

    const response = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body,
      },
      10_000,
    );

    if (!response.ok) return [];
    const json = (await response.json()) as {
      content?: Array<{ text?: string }>;
    };
    const text = json?.content?.[0]?.text;
    if (!text) return [];

    const parsed = JSON.parse("[" + text) as unknown[];
    if (!Array.isArray(parsed)) return [];

    // Validate each signal
    const validTypes = new Set<string>([
      "preference", "avoidance", "correction", "decision", "satisfaction", "pattern",
    ]);
    const validCategories = new Set<string>([
      "communication", "formatting", "workflow", "tools", "content", "timing", "delegation", "technical",
    ]);

    return parsed.filter((s): s is RawSignal => {
      if (!s || typeof s !== "object") return false;
      const sig = s as Record<string, unknown>;
      return (
        typeof sig.type === "string" &&
        validTypes.has(sig.type) &&
        typeof sig.content === "string" &&
        sig.content.length > 0 &&
        typeof sig.category === "string" &&
        validCategories.has(sig.category)
      );
    });
  } catch {
    return [];
  }
}

// ── Process extraction for a session ─────────────────────────────────

export async function processExtraction(
  sourceType: string,
  sourceId: string,
  transcript: string,
  sessionKey?: string,
): Promise<number> {
  const d = ensureDb();
  if (!d) return 0;

  try {
    // Check if already extracted
    const existing = d
      .prepare(
        `SELECT 1 FROM extraction_state WHERE source_type = ? AND source_id = ?`,
      )
      .get(sourceType, sourceId);
    if (existing) return 0;

    const signals = await extractSignals(transcript);

    for (const raw of signals) {
      upsertSignal(raw, sessionKey);
    }

    // Record extraction state
    d.prepare(
      `INSERT INTO extraction_state (source_type, source_id, extracted_at, signal_count)
      VALUES (?, ?, ?, ?)`,
    ).run(sourceType, sourceId, new Date().toISOString(), signals.length);

    return signals.length;
  } catch {
    return 0;
  }
}

// ── Process new sessions from agent-log ──────────────────────────────

export async function processNewSessions(): Promise<number> {
  const d = ensureDb();
  if (!d) return 0;

  let totalExtracted = 0;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const agentLogPath = join(MEMORY_DIR, "agent-log", `${today}.json`);
    if (!existsSync(agentLogPath)) return 0;

    const raw = readFileSync(agentLogPath, "utf-8");
    const log = JSON.parse(raw) as {
      completed?: Array<{
        item: string;
        output?: string;
        completedAt: number;
      }>;
    };

    if (!log.completed) return 0;

    for (const entry of log.completed) {
      if (!entry.output || entry.output.length < 50) continue;
      const sourceId = `${today}:${entry.completedAt}`;
      const extracted = await processExtraction(
        "agent-log",
        sourceId,
        entry.output,
        `agent-${today}`,
      );
      totalExtracted += extracted;
    }
  } catch {
    // non-fatal
  }

  return totalExtracted;
}

// ── Querying ─────────────────────────────────────────────────────────

export function getTopSignals(limit = 5): StoredSignal[] {
  const d = ensureDb();
  if (!d) return [];

  try {
    return d
      .prepare(
        `SELECT *,
          (confidence * 0.5
           + (1.0 / (1.0 + julianday('now') - julianday(last_seen))) * 0.3
           + (MIN(occurrence_count, 20) / 20.0) * 0.2
          ) AS rank_score
        FROM signals
        WHERE active = 1
        ORDER BY rank_score DESC
        LIMIT ?`,
      )
      .all(limit) as StoredSignal[];
  } catch {
    return [];
  }
}

export function getSignalStats(): LedgerStats {
  const d = ensureDb();
  const empty: LedgerStats = {
    total: 0,
    active: 0,
    dormant: 0,
    dismissed: 0,
    byType: {},
    byCategory: {},
  };
  if (!d) return empty;

  try {
    const total = (d.prepare("SELECT COUNT(*) as c FROM signals").get() as { c: number })?.c ?? 0;
    const active = (d.prepare("SELECT COUNT(*) as c FROM signals WHERE active = 1").get() as { c: number })?.c ?? 0;
    const dormant = (d.prepare("SELECT COUNT(*) as c FROM signals WHERE active = 0").get() as { c: number })?.c ?? 0;
    const dismissed = (d.prepare("SELECT COUNT(*) as c FROM signals WHERE active = -1").get() as { c: number })?.c ?? 0;

    const byType: Record<string, number> = {};
    const typeRows = d.prepare("SELECT type, COUNT(*) as c FROM signals WHERE active = 1 GROUP BY type").all() as Array<{ type: string; c: number }>;
    for (const row of typeRows) byType[row.type] = row.c;

    const byCategory: Record<string, number> = {};
    const catRows = d.prepare("SELECT category, COUNT(*) as c FROM signals WHERE active = 1 GROUP BY category").all() as Array<{ category: string; c: number }>;
    for (const row of catRows) byCategory[row.category] = row.c;

    return { total, active, dormant, dismissed, byType, byCategory };
  } catch {
    return empty;
  }
}

// ── Decay + dormancy ─────────────────────────────────────────────────

export function decayStaleSignals(): number {
  const d = ensureDb();
  if (!d) return 0;

  try {
    const now = new Date().toISOString();

    // Signals unseen 60+ days → dormant
    const dormantCount = d
      .prepare(
        `UPDATE signals SET active = 0, updated_at = ?
        WHERE active = 1 AND julianday(?) - julianday(last_seen) > 60`,
      )
      .run(now, now).changes;

    // Recompute confidence for active signals
    const active = d
      .prepare(`SELECT * FROM signals WHERE active = 1`)
      .all() as StoredSignal[];

    for (const signal of active) {
      const newConf = computeConfidence(signal);
      if (Math.abs(newConf - signal.confidence) > 0.001) {
        d.prepare(`UPDATE signals SET confidence = ?, updated_at = ? WHERE id = ?`).run(
          newConf,
          now,
          signal.id,
        );
      }
    }

    return dormantCount;
  } catch {
    return 0;
  }
}

// ── Conflict detection ───────────────────────────────────────────────

export function detectConflicts(): ConflictPair[] {
  const d = ensureDb();
  if (!d) return [];

  try {
    const active = d
      .prepare(`SELECT * FROM signals WHERE active = 1 ORDER BY category, type`)
      .all() as StoredSignal[];

    const conflicts: ConflictPair[] = [];

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i];
        const b = active[j];
        if (a.category !== b.category) continue;

        const aLower = a.content.toLowerCase();
        const bLower = b.content.toLowerCase();

        for (const [word1, word2] of CONFLICT_PAIRS) {
          if (
            (aLower.includes(word1) && bLower.includes(word2)) ||
            (aLower.includes(word2) && bLower.includes(word1))
          ) {
            // Check if this conflict was already resolved
            const alreadyResolved = d
              .prepare(
                `SELECT 1 FROM conflicts
                WHERE ((signal_a_id = ? AND signal_b_id = ?) OR (signal_a_id = ? AND signal_b_id = ?))
                AND resolution IS NOT NULL`,
              )
              .get(a.id, b.id, b.id, a.id);
            if (!alreadyResolved) {
              conflicts.push({ signalA: a, signalB: b, reason: `${word1} vs ${word2}` });
            }
            break;
          }
        }
      }
    }

    return conflicts;
  } catch {
    return [];
  }
}

// ── Conflict resolution ──────────────────────────────────────────────

export function autoResolveConflict(conflict: ConflictPair): void {
  const d = ensureDb();
  if (!d) return;

  try {
    const { signalA, signalB } = conflict;

    const aScore =
      signalA.confidence * 0.6 +
      (Math.min(signalA.occurrence_count, 20) / 20) * 0.4;
    const bScore =
      signalB.confidence * 0.6 +
      (Math.min(signalB.occurrence_count, 20) / 20) * 0.4;

    // If scores are close and both have 3+ occurrences, leave unresolved
    if (
      Math.abs(aScore - bScore) < 0.1 &&
      signalA.occurrence_count >= 3 &&
      signalB.occurrence_count >= 3
    ) {
      // Record as unresolved conflict
      d.prepare(
        `INSERT OR IGNORE INTO conflicts (id, signal_a_id, signal_b_id, resolution, context)
        VALUES (?, ?, ?, 'unresolved', ?)`,
      ).run(
        randomUUID(),
        signalA.id,
        signalB.id,
        `Genuine conflict: ${conflict.reason}. Score A=${aScore.toFixed(2)} B=${bScore.toFixed(2)}`,
      );
      return;
    }

    const winner = aScore >= bScore ? signalA : signalB;
    const loser = aScore >= bScore ? signalB : signalA;

    // Loser becomes dormant
    d.prepare(
      `UPDATE signals SET active = 0, superseded_by = ?, updated_at = datetime('now') WHERE id = ?`,
    ).run(winner.id, loser.id);

    // Log the conflict resolution
    d.prepare(
      `INSERT INTO conflicts (id, signal_a_id, signal_b_id, resolution, resolved_at, context)
      VALUES (?, ?, ?, ?, datetime('now'), ?)`,
    ).run(
      randomUUID(),
      signalA.id,
      signalB.id,
      aScore >= bScore ? "a_wins" : "b_wins",
      `Auto: ${conflict.reason}. Score A=${aScore.toFixed(2)} B=${bScore.toFixed(2)}`,
    );
  } catch {
    // non-fatal
  }
}

// ── Snapshot formatting ──────────────────────────────────────────────

export function formatForSnapshot(signals: StoredSignal[]): string {
  if (signals.length === 0) return "";

  const lines = ["## Active Patterns"];
  for (const s of signals) {
    const label = SIGNAL_TYPE_LABELS[s.type] ?? "SIG";
    lines.push(
      `- [${label}] ${s.content} (${s.occurrence_count}x, ${s.confidence.toFixed(2)} conf)`,
    );
  }
  return lines.join("\n");
}

export function getUnresolvedConflicts(): Array<{
  signalA: StoredSignal;
  signalB: StoredSignal;
  reason: string;
}> {
  const d = ensureDb();
  if (!d) return [];

  try {
    const rows = d
      .prepare(
        `SELECT c.context, c.signal_a_id, c.signal_b_id
        FROM conflicts c
        WHERE c.resolution = 'unresolved' AND c.resolved_at IS NULL`,
      )
      .all() as Array<{
        context: string;
        signal_a_id: string;
        signal_b_id: string;
      }>;

    const results: Array<{ signalA: StoredSignal; signalB: StoredSignal; reason: string }> = [];
    for (const row of rows.slice(0, 3)) {
      const a = d.prepare(`SELECT * FROM signals WHERE id = ? AND active = 1`).get(row.signal_a_id) as StoredSignal | undefined;
      const b = d.prepare(`SELECT * FROM signals WHERE id = ? AND active = 1`).get(row.signal_b_id) as StoredSignal | undefined;
      if (a && b) {
        results.push({ signalA: a, signalB: b, reason: row.context });
      }
    }
    return results;
  } catch {
    return [];
  }
}

export function formatConflictsForSnapshot(): string {
  const conflicts = getUnresolvedConflicts();
  if (conflicts.length === 0) return "";

  const c = conflicts[0]; // Only show top 1 conflict
  return `- ⚡ CONFLICT: "${c.signalA.content}" (${c.signalA.confidence.toFixed(2)}) vs "${c.signalB.content}" (${c.signalB.confidence.toFixed(2)})`;
}

// ── Bootstrap from correction-log + trust-tracker ────────────────────

const BOOTSTRAP_SENTINEL = join(DATA_DIR, ".interaction-ledger-bootstrapped");

export async function bootstrapFromExistingData(): Promise<void> {
  const d = ensureDb();
  if (!d) return;
  if (existsSync(BOOTSTRAP_SENTINEL)) return;

  try {
    // Seed from correction-log.json
    const correctionLogPath = join(DATA_DIR, "correction-log.json");
    if (existsSync(correctionLogPath)) {
      try {
        const raw = readFileSync(correctionLogPath, "utf-8");
        const log = JSON.parse(raw) as {
          entries?: Array<{
            correctionSignal: string;
            category: string;
            keywords?: string[];
          }>;
          patterns?: Array<{
            category: string;
            keywords?: string[];
            count: number;
          }>;
        };

        // Seed patterns as high-confidence signals
        if (log.patterns) {
          for (const pattern of log.patterns) {
            const content = pattern.keywords?.join(", ") ?? "Correction pattern";
            const category = mapCorrectionCategory(pattern.category);
            upsertSignal(
              {
                type: "correction",
                content: `Correction pattern: ${content}`,
                evidence: `Detected ${pattern.count} times in correction log`,
                confidence: "high",
                category,
              },
              "bootstrap",
            );
          }
        }

        // Seed individual corrections as medium-confidence signals
        if (log.entries) {
          for (const entry of log.entries.slice(-20)) {
            const category = mapCorrectionCategory(entry.category);
            upsertSignal(
              {
                type: "correction",
                content: entry.correctionSignal,
                evidence: "From correction log",
                confidence: "medium",
                category,
              },
              "bootstrap",
            );
          }
        }
      } catch {
        // correction-log parse failure — non-fatal
      }
    }

    // Seed from trust-tracker.json
    const trustPath = join(DATA_DIR, "trust-tracker.json");
    if (existsSync(trustPath)) {
      try {
        const raw = readFileSync(trustPath, "utf-8");
        const trust = JSON.parse(raw) as {
          workflows?: Array<{ name: string; score: number }>;
        };

        if (trust.workflows) {
          for (const wf of trust.workflows) {
            if (wf.score < 5) {
              upsertSignal(
                {
                  type: "avoidance",
                  content: `Low trust in "${wf.name}" workflow (score: ${wf.score.toFixed(1)})`,
                  evidence: "Trust tracker data",
                  confidence: "medium",
                  category: "delegation",
                },
                "bootstrap",
              );
            } else if (wf.score > 8) {
              upsertSignal(
                {
                  type: "satisfaction",
                  content: `High satisfaction with "${wf.name}" workflow (score: ${wf.score.toFixed(1)})`,
                  evidence: "Trust tracker data",
                  confidence: "high",
                  category: "delegation",
                },
                "bootstrap",
              );
            }
          }
        }
      } catch {
        // trust-tracker parse failure — non-fatal
      }
    }

    // Write sentinel to prevent re-bootstrapping
    try {
      const { writeFileSync: wfs, mkdirSync: mkSync } = await import("node:fs");
      mkSync(DATA_DIR, { recursive: true });
      wfs(BOOTSTRAP_SENTINEL, new Date().toISOString(), "utf-8");
    } catch {
      // sentinel write non-fatal
    }
  } catch {
    // Bootstrap failure is non-fatal
  }
}

function mapCorrectionCategory(cat: string): SignalCategory {
  const map: Record<string, SignalCategory> = {
    tone: "communication",
    format: "formatting",
    accuracy: "content",
    scope: "workflow",
    style: "formatting",
    "tool-use": "tools",
    behavior: "workflow",
    content: "content",
  };
  return map[cat] ?? "communication";
}

// ── Helpers (matching identity-graph.ts pattern) ─────────────────────

function resolveAnthropicKey(): string | null {
  const envKey = process.env.ANTHROPIC_API_KEY;
  if (envKey) return envKey;

  try {
    const credsPath = join(homedir(), ".claude", ".credentials.json");
    const creds = JSON.parse(readFileSync(credsPath, "utf-8"));
    const oauth = creds?.claudeAiOauth;
    if (oauth?.accessToken) return oauth.accessToken;
  } catch {
    // not found
  }

  try {
    const oclawEnv = join(homedir(), ".openclaw", ".env");
    const raw = readFileSync(oclawEnv, "utf-8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("ANTHROPIC_API_KEY=")) {
        const val = line.slice("ANTHROPIC_API_KEY=".length).trim();
        if (val && !val.startsWith("#")) return val;
      }
    }
  } catch {
    // not found
  }

  try {
    const profilesPath = join(homedir(), ".openclaw", "auth-profiles.json");
    const raw = JSON.parse(readFileSync(profilesPath, "utf-8")) as {
      profiles?: Record<string, { token?: string }>;
    };
    const profile = raw.profiles?.["anthropic:oauth"];
    if (profile?.token) return profile.token;
  } catch {
    // not found
  }

  return null;
}

async function fetchWithTimeout(
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
