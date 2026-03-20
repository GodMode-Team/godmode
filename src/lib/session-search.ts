/**
 * session-search.ts — Local SQLite FTS5 session search for GodMode.
 *
 * Stores messages locally in SQLite, full-text indexed via FTS5.
 * Provides fallback episodic recall when the memory provider is offline.
 * 90-day auto-prune. Follows the same pattern as identity-graph.ts.
 *
 * All operations wrapped in try/catch. Failures are invisible — the conversation never breaks.
 */

import Database from "better-sqlite3";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Singleton ────────────────────────────────────────────────────────

let db: InstanceType<typeof Database> | null = null;

const DB_PATH = join(DATA_DIR, "session-search.db");
const PRUNE_DAYS = 90;

// ── Init ─────────────────────────────────────────────────────────────

export function initSessionSearch(): void {
  if (db) return;
  try {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        session_key TEXT NOT NULL,
        role       TEXT NOT NULL,
        content    TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_key);
      CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
    `);

    // FTS5 virtual table for full-text search
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
        content,
        content=messages,
        content_rowid=id,
        tokenize='porter unicode61'
      );
    `);

    // Triggers to keep FTS in sync with the messages table
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS messages_ai AFTER INSERT ON messages BEGIN
        INSERT INTO messages_fts(rowid, content) VALUES (new.id, new.content);
      END;
      CREATE TRIGGER IF NOT EXISTS messages_ad AFTER DELETE ON messages BEGIN
        INSERT INTO messages_fts(messages_fts, rowid, content) VALUES ('delete', old.id, old.content);
      END;
    `);
  } catch (err) {
    console.warn(`[Session Search] Init failed: ${String(err)}`);
    db = null;
  }
}

// ── Ready Check ──────────────────────────────────────────────────────

export function isSessionSearchReady(): boolean {
  return db !== null;
}

// ── Store Message ────────────────────────────────────────────────────

export function storeMessage(
  sessionKey: string,
  role: "user" | "assistant",
  content: string,
): void {
  if (!db) return;
  try {
    db.prepare(
      "INSERT INTO messages (session_key, role, content) VALUES (?, ?, ?)",
    ).run(sessionKey, role, content);
  } catch (err) {
    console.warn(`[Session Search] Store failed: ${String(err)}`);
  }
}

// ── Search ───────────────────────────────────────────────────────────

export type SearchResult = {
  sessionKey: string;
  role: string;
  content: string;
  createdAt: number;
  rank: number;
};

/**
 * Full-text search across all stored messages.
 * Returns up to `limit` results ranked by relevance.
 */
export function searchMessages(
  query: string,
  limit = 10,
): SearchResult[] {
  if (!db || !query.trim()) return [];
  try {
    // Sanitize query for FTS5 — escape special chars and wrap terms in quotes
    const sanitized = query
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .map((t) => `"${t}"`)
      .join(" ");
    if (!sanitized) return [];

    const rows = db
      .prepare(
        `SELECT m.session_key, m.role, m.content, m.created_at, rank
         FROM messages_fts f
         JOIN messages m ON m.id = f.rowid
         WHERE messages_fts MATCH ?
         ORDER BY rank
         LIMIT ?`,
      )
      .all(sanitized, limit) as Array<{
        session_key: string;
        role: string;
        content: string;
        created_at: number;
        rank: number;
      }>;

    return rows.map((r) => ({
      sessionKey: r.session_key,
      role: r.role,
      content: r.content,
      createdAt: r.created_at,
      rank: r.rank,
    }));
  } catch (err) {
    console.warn(`[Session Search] Search failed: ${String(err)}`);
    return [];
  }
}

/**
 * Search within a specific session's messages.
 */
export function searchSession(
  sessionKey: string,
  query: string,
  limit = 20,
): SearchResult[] {
  if (!db || !query.trim()) return [];
  try {
    const sanitized = query
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .map((t) => `"${t}"`)
      .join(" ");
    if (!sanitized) return [];

    const rows = db
      .prepare(
        `SELECT m.session_key, m.role, m.content, m.created_at, rank
         FROM messages_fts f
         JOIN messages m ON m.id = f.rowid
         WHERE messages_fts MATCH ?
         AND m.session_key = ?
         ORDER BY rank
         LIMIT ?`,
      )
      .all(sanitized, sessionKey, limit) as Array<{
        session_key: string;
        role: string;
        content: string;
        created_at: number;
        rank: number;
      }>;

    return rows.map((r) => ({
      sessionKey: r.session_key,
      role: r.role,
      content: r.content,
      createdAt: r.created_at,
      rank: r.rank,
    }));
  } catch (err) {
    console.warn(`[Session Search] Session search failed: ${String(err)}`);
    return [];
  }
}

// ── Prune ────────────────────────────────────────────────────────────

/**
 * Delete messages older than PRUNE_DAYS. Run periodically (e.g., on heartbeat).
 * Returns the number of rows deleted.
 */
export function pruneOldMessages(): number {
  if (!db) return 0;
  try {
    const cutoff = Math.floor(Date.now() / 1000) - PRUNE_DAYS * 86400;
    const result = db
      .prepare("DELETE FROM messages WHERE created_at < ?")
      .run(cutoff);
    return result.changes;
  } catch (err) {
    console.warn(`[Session Search] Prune failed: ${String(err)}`);
    return 0;
  }
}

// ── Stats ────────────────────────────────────────────────────────────

export function getStats(): { messageCount: number; sessionCount: number } {
  if (!db) return { messageCount: 0, sessionCount: 0 };
  try {
    const msgRow = db.prepare("SELECT COUNT(*) as cnt FROM messages").get() as { cnt: number };
    const sessRow = db
      .prepare("SELECT COUNT(DISTINCT session_key) as cnt FROM messages")
      .get() as { cnt: number };
    return { messageCount: msgRow.cnt, sessionCount: sessRow.cnt };
  } catch {
    return { messageCount: 0, sessionCount: 0 };
  }
}

// ── Shutdown ─────────────────────────────────────────────────────────

export function closeSessionSearch(): void {
  if (db) {
    try { db.close(); } catch { /* ignore */ }
    db = null;
  }
}
