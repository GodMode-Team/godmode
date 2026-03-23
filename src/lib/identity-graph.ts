/**
 * identity-graph.ts — Lightweight entity/relationship graph for GodMode.
 *
 * Fills the gap between Mem0's isolated facts and the ally's need to understand
 * WHO people are and HOW they connect to each other, projects, and companies.
 *
 * Storage: SQLite via better-sqlite3 (already a dependency) at ~/godmode/data/identity-graph.db
 * Extraction: Claude Haiku extracts entities + relationships during conversation ingestion.
 * Retrieval: 1-2 hop graph traversal, formatted for context injection.
 *
 * All operations wrapped in try/catch. Failures are invisible — the conversation never breaks.
 */

import Database from "better-sqlite3";
import { join } from "node:path";
import { reportConnected, reportDegraded } from "./service-health.js";
import { DATA_DIR } from "../data-paths.js";
import { resolveAnthropicKey, fetchWithTimeout } from "./anthropic-auth.js";
import { getOwnerName } from "./ally-identity.js";

// ── Singleton ────────────────────────────────────────────────────────

let db: InstanceType<typeof Database> | null = null;

const DB_PATH = join(DATA_DIR, "identity-graph.db");

// ── Init ─────────────────────────────────────────────────────────────

export function initIdentityGraph(): void {
  if (db) return;
  try {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS entities (
        id   TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        kind TEXT NOT NULL DEFAULT 'person',
        meta TEXT DEFAULT '{}',
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE TABLE IF NOT EXISTS edges (
        src TEXT NOT NULL,
        rel TEXT NOT NULL,
        dst TEXT NOT NULL,
        meta TEXT DEFAULT '{}',
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        PRIMARY KEY (src, rel, dst)
      );
      CREATE INDEX IF NOT EXISTS idx_edges_src ON edges(src);
      CREATE INDEX IF NOT EXISTS idx_edges_dst ON edges(dst);
    `);
    reportConnected("identity-graph");
  } catch (err) {
    console.warn(`[Identity Graph] Init failed: ${String(err)}`);
    reportDegraded("identity-graph", "SQLite init failed", "Check ~/godmode/data/ permissions");
    db = null;
  }
}

export function isGraphReady(): boolean {
  return db !== null;
}

// ── Slugify ──────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Upsert ───────────────────────────────────────────────────────────

export function upsertEntity(
  name: string,
  kind: string,
  meta?: Record<string, unknown>,
): void {
  if (!db) return;
  const id = slugify(name);
  if (!id) return;
  try {
    db.prepare(`
      INSERT INTO entities (id, name, kind, meta, updated_at)
      VALUES (@id, @name, @kind, @meta, unixepoch())
      ON CONFLICT(id) DO UPDATE SET
        name = @name,
        kind = @kind,
        meta = CASE WHEN @meta != '{}' THEN @meta ELSE entities.meta END,
        updated_at = unixepoch()
    `).run({ id, name, kind, meta: JSON.stringify(meta ?? {}) });
  } catch {
    // Upsert failure is non-fatal
  }
}

export function upsertEdge(
  srcName: string,
  rel: string,
  dstName: string,
  meta?: Record<string, unknown>,
): void {
  if (!db) return;
  const src = slugify(srcName);
  const dst = slugify(dstName);
  if (!src || !dst || !rel) return;
  try {
    db.prepare(`
      INSERT INTO edges (src, rel, dst, meta, updated_at)
      VALUES (@src, @rel, @dst, @meta, unixepoch())
      ON CONFLICT(src, rel, dst) DO UPDATE SET
        meta = @meta,
        updated_at = unixepoch()
    `).run({ src, rel, dst, meta: JSON.stringify(meta ?? {}) });
  } catch {
    // Edge upsert failure is non-fatal
  }
}

// ── Extract (LLM) ───────────────────────────────────────────────────

interface ExtractedData {
  entities: Array<{ name: string; kind: string }>;
  relationships: Array<{ src: string; rel: string; dst: string }>;
}

/**
 * Extract entities and relationships from conversation text using Claude Haiku.
 * Fire-and-forget — called alongside Mem0 ingestion, never blocks.
 */
export async function extractAndStore(text: string): Promise<void> {
  if (!db || !text || text.length < 30) return;

  const apiKey = resolveAnthropicKey();
  if (!apiKey) return;

  const truncated = text.slice(0, 2000);

  try {
    const body = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Extract entities and relationships from this conversation. Return ONLY valid JSON, no explanation.

Schema:
{
  "entities": [{ "name": "Full Name", "kind": "person|company|project|place|concept" }],
  "relationships": [{ "src": "Entity Name", "rel": "relationship_type", "dst": "Entity Name" }]
}

Rules:
- Only extract clearly stated entities with proper names, not generic references
- Relationship types: works_at, knows, manages, client_of, cofounded, partner_of, reports_to, married_to, sibling_of, friend_of, invested_in, uses, member_of, involved_in, interested_in, lives_in, competitor_of
- The user is "${getOwnerName()}" — include relationships to ${getOwnerName()} when mentioned or implied
- Max 10 entities, 15 relationships
- If no clear entities exist, return {"entities":[],"relationships":[]}

Text:
${truncated}`,
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
      8_000,
    );

    if (!response.ok) return;
    const json = (await response.json()) as { content?: Array<{ text?: string }> };
    const content = json?.content?.[0]?.text;
    if (!content) return;

    // Parse JSON — handle markdown code fences
    const cleaned = content.replace(/```json?\s*|\s*```/g, "").trim();
    const data: ExtractedData = JSON.parse(cleaned);

    // Store extracted entities and relationships
    if (data.entities && Array.isArray(data.entities)) {
      for (const e of data.entities.slice(0, 10)) {
        if (e.name && e.kind) {
          upsertEntity(e.name, e.kind);
        }
      }
    }

    if (data.relationships && Array.isArray(data.relationships)) {
      for (const r of data.relationships.slice(0, 15)) {
        if (r.src && r.rel && r.dst) {
          upsertEdge(r.src, r.rel, r.dst);
        }
      }
    }
  } catch {
    reportDegraded("identity-graph", "Entity extraction failed", "Check ANTHROPIC_API_KEY");
  }
}

// ── Query ────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  name: string;
  kind: string;
  relationships: Array<{ rel: string; target: string; targetKind: string }>;
}

/**
 * Query the identity graph for entities matching words in the user's message.
 * Returns 1-2 hop connected entities with their relationships.
 */
export function queryGraph(userMessage: string): GraphNode[] {
  if (!db || !userMessage || userMessage.length < 3) return [];

  try {
    // Extract candidate words (3+ chars, skip common words)
    const STOP_WORDS = new Set([
      "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
      "her", "was", "one", "our", "out", "has", "his", "how", "its", "let",
      "may", "new", "now", "old", "see", "way", "who", "did", "get", "got",
      "him", "hit", "say", "she", "too", "use", "what", "with", "this",
      "that", "have", "from", "they", "been", "said", "each", "which",
      "their", "will", "about", "would", "there", "could", "other",
      "into", "than", "some", "very", "when", "come", "make", "like",
      "just", "know", "take", "want", "does", "good", "much", "then",
      "them", "also", "back", "here", "help", "need", "tell", "think",
      "going", "want", "yeah", "sure", "okay", "right", "well", "really",
    ]);

    const words = userMessage
      .split(/[\s,;:!?.()[\]{}'"]+/)
      .map(w => w.toLowerCase().replace(/[^a-z0-9-]/g, ""))
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

    if (words.length === 0) return [];

    // Find matching entities — check both id and name
    const matchedEntities: Array<{ id: string; name: string; kind: string }> = [];
    const findStmt = db.prepare(
      "SELECT id, name, kind FROM entities WHERE id LIKE @pattern OR LOWER(name) LIKE @pattern",
    );

    const seen = new Set<string>();
    for (const word of words) {
      const rows = findStmt.all({ pattern: `%${word}%` }) as Array<{ id: string; name: string; kind: string }>;
      for (const row of rows) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          matchedEntities.push(row);
        }
      }
      if (matchedEntities.length >= 5) break;
    }

    if (matchedEntities.length === 0) return [];

    // Get 1-hop relationships for matched entities
    const edgeStmt = db.prepare(`
      SELECT e.src, e.rel, e.dst, t.name AS target_name, t.kind AS target_kind
      FROM edges e
      JOIN entities t ON t.id = CASE WHEN e.src = @id THEN e.dst ELSE e.src END
      WHERE e.src = @id OR e.dst = @id
      ORDER BY e.updated_at DESC
      LIMIT 10
    `);

    const results: GraphNode[] = [];
    for (const entity of matchedEntities.slice(0, 5)) {
      const edges = edgeStmt.all({ id: entity.id }) as Array<{
        src: string; rel: string; dst: string; target_name: string; target_kind: string;
      }>;

      results.push({
        id: entity.id,
        name: entity.name,
        kind: entity.kind,
        relationships: edges.map(e => ({
          rel: e.rel,
          target: e.target_name,
          targetKind: e.target_kind,
        })),
      });
    }

    return results;
  } catch {
    return [];
  }
}

// ── Format ───────────────────────────────────────────────────────────

/**
 * Format graph query results for context injection.
 * Returns a compact block (~8 lines max) or null if nothing relevant.
 */
export function formatGraphContext(results: GraphNode[]): string | null {
  if (results.length === 0) return null;

  const lines = [
    "## People & Relationships",
    "Cross-reference these with your memories above to give rich, connected context.",
  ];

  for (const node of results.slice(0, 6)) {
    const rels = node.relationships
      .slice(0, 5)
      .map(r => `${r.rel.replace(/_/g, " ")} ${r.target}`)
      .join(", ");

    if (rels) {
      lines.push(`- **${node.name}** (${node.kind}): ${rels}`);
    } else {
      lines.push(`- **${node.name}** (${node.kind})`);
    }
  }

  return lines.length > 2 ? lines.join("\n") : null;
}

// ── Stats ────────────────────────────────────────────────────────────

export function getGraphStats(): { entities: number; edges: number } | null {
  if (!db) return null;
  try {
    const entities = (db.prepare("SELECT COUNT(*) as c FROM entities").get() as { c: number } | undefined)?.c ?? 0;
    const edges = (db.prepare("SELECT COUNT(*) as c FROM edges").get() as { c: number } | undefined)?.c ?? 0;
    return { entities, edges };
  } catch {
    return null;
  }
}

// ── Maintenance ──────────────────────────────────────────────────────

/** Remove entities not updated in 180 days with no edges. Keeps the graph lean. */
export function pruneStaleEntities(): number {
  if (!db) return 0;
  try {
    const cutoff = Math.floor(Date.now() / 1000) - 180 * 86400;
    const result = db.prepare(`
      DELETE FROM entities WHERE updated_at < @cutoff
      AND id NOT IN (SELECT src FROM edges UNION SELECT dst FROM edges)
    `).run({ cutoff });
    return result.changes;
  } catch {
    return 0;
  }
}

// ── Vault Seeding ────────────────────────────────────────────────────

const SEED_SENTINEL = join(DATA_DIR, ".identity-graph-seeded");

/**
 * Seed the identity graph from existing vault files on first boot.
 * Reads People/, Companies/, Projects/ folders and extracts entities.
 * Idempotent — sentinel file prevents re-running.
 */
export async function seedFromVault(): Promise<void> {
  if (!db) return;
  const { existsSync } = await import("node:fs");
  if (existsSync(SEED_SENTINEL)) return;

  const { readdir, readFile, writeFile } = await import("node:fs/promises");

  // Find vault brain folders
  const vaultFolders: string[] = [];
  try {
    const { resolveVaultPath } = await import("../data-paths.js");
    const vault = resolveVaultPath();
    if (vault) {
      for (const sub of ["06-Brain/People", "06-Brain/Companies", "06-Brain/Projects"]) {
        const dir = join(vault, sub);
        if (existsSync(dir)) vaultFolders.push(dir);
      }
    }
  } catch { /* vault not available */ }

  // Also check godmode memory dir
  const memoryDir = join(DATA_DIR, "..", "memory");
  if (existsSync(memoryDir)) {
    for (const sub of ["people", "companies", "projects"]) {
      const dir = join(memoryDir, sub);
      if (existsSync(dir)) vaultFolders.push(dir);
    }
  }

  if (vaultFolders.length === 0) {
    // No vault content to seed — mark as seeded anyway
    await writeFile(SEED_SENTINEL, new Date().toISOString()).catch(() => {});
    return;
  }

  // Feed each markdown file through entity extraction
  let seeded = 0;
  for (const dir of vaultFolders) {
    try {
      const files = await readdir(dir);
      for (const file of files.filter(f => f.endsWith(".md")).slice(0, 30)) {
        try {
          const content = await readFile(join(dir, file), "utf-8");
          if (content.length > 50) {
            await extractAndStore(content);
            seeded++;
          }
        } catch { /* skip individual files */ }
      }
    } catch { /* skip dirs */ }
  }

  if (seeded > 0) {
    console.log(`[Identity Graph] Seeded from ${seeded} vault files`);
    await writeFile(SEED_SENTINEL, new Date().toISOString()).catch(() => {});
  } else {
    console.warn("[Identity Graph] Vault seeding failed — 0 files processed. Will retry next restart.");
  }
}

// ── Helpers ──────────────────────────────────────────────────────────
// resolveAnthropicKey and fetchWithTimeout imported from ./anthropic-auth.js
