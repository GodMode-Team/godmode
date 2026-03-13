/**
 * proof-server.ts — Lightweight collaborative document server for GodMode.
 *
 * Provides a REST API for creating, reading, and editing Proof documents.
 * Documents are stored in SQLite (~/godmode/data/proof-docs.db).
 * Agents and Prosper write via HTTP API; the UI embeds a viewer via iframe.
 *
 * This is a lightweight built-in implementation since proof-sdk is not
 * available on npm. Uses Node's built-in HTTP server to avoid new deps.
 *
 * Endpoints:
 *   GET  /health              — Health check
 *   POST /documents           — Create document
 *   GET  /documents           — List documents
 *   GET  /documents/:slug     — Read document
 *   PUT  /documents/:slug     — Update document content
 *   GET  /documents/:slug/view — Rendered HTML view (for iframe)
 *   POST /documents/:slug/comments — Add comment
 */

import { createServer, type Server, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import Database from "better-sqlite3";
import { ARTIFACTS_DIR, DATA_DIR } from "../data-paths.js";
import { secureMkdir, secureMkdirSync, secureWriteFileSync } from "../lib/secure-fs.js";
import { randomUUID } from "node:crypto";

type Logger = { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };

// ── Types ────────────────────────────────────────────────────────

export type ProofDocument = {
  slug: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filePath: string;
  /** Provenance: tracks who wrote which sections */
  edits: ProofEdit[];
};

export type ProofEdit = {
  id: string;
  author: "agent" | "ally" | "human";
  authorName?: string;
  content: string;
  timestamp: string;
  /** Character offset range where this edit applies */
  range?: { start: number; end: number };
};

export type ProofComment = {
  id: string;
  author: string;
  text: string;
  position?: number;
  timestamp: string;
};

// ── Database ─────────────────────────────────────────────────────

const DB_PATH = join(DATA_DIR, "proof-docs.db");
const PROOF_ARTIFACTS_DIR = join(ARTIFACTS_DIR, "proof");
let db: InstanceType<typeof Database> | null = null;

export function getProofDocumentFilePath(slug: string): string {
  return join(PROOF_ARTIFACTS_DIR, `${slug}.md`);
}

function getDb() {
  if (db) return db;
  try {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        author TEXT NOT NULL DEFAULT 'ally',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS edits (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        author TEXT NOT NULL,
        author_name TEXT,
        content TEXT NOT NULL,
        range_start INTEGER,
        range_end INTEGER,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (slug) REFERENCES documents(slug)
      );
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        position INTEGER,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (slug) REFERENCES documents(slug)
      );
    `);
    return db;
  } catch (err) {
    throw new Error(`Failed to initialize Proof DB: ${String(err)}`);
  }
}

function syncDocumentArtifact(slug: string, title: string, content: string): string {
  const filePath = getProofDocumentFilePath(slug);
  secureMkdirSync(PROOF_ARTIFACTS_DIR);
  const normalized = content.trim().startsWith("#")
    ? content
    : `# ${title}\n\n${content}`.trim() + "\n";
  secureWriteFileSync(filePath, normalized.endsWith("\n") ? normalized : normalized + "\n");
  return filePath;
}

// ── Document CRUD ────────────────────────────────────────────────

export function createDocument(title: string, initialContent?: string, author?: string): ProofDocument {
  const d = getDb();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) + "-" + randomUUID().slice(0, 6);
  const now = new Date().toISOString();
  const content = initialContent ?? "";

  d.prepare(
    "INSERT INTO documents (slug, title, content, author, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(slug, title, content, author ?? "ally", now, now);
  const filePath = syncDocumentArtifact(slug, title, content);

  return {
    slug,
    title,
    content,
    author: author ?? "ally",
    createdAt: now,
    updatedAt: now,
    filePath,
    edits: [],
  };
}

export function readDocument(slug: string): ProofDocument | null {
  const d = getDb();
  const row = d.prepare("SELECT * FROM documents WHERE slug = ?").get(slug) as
    | { slug: string; title: string; content: string; author: string; created_at: string; updated_at: string }
    | undefined;
  if (!row) return null;

  const edits = d
    .prepare("SELECT * FROM edits WHERE slug = ? ORDER BY timestamp ASC")
    .all(slug)
    .map((e: any) => ({
      id: e.id,
      author: e.author,
      authorName: e.author_name,
      content: e.content,
      timestamp: e.timestamp,
      range: e.range_start != null ? { start: e.range_start, end: e.range_end } : undefined,
    }));

  return {
    slug: row.slug,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    filePath: getProofDocumentFilePath(row.slug),
    edits,
  };
}

export function editDocument(
  slug: string,
  content: string,
  author: "agent" | "ally" | "human",
  authorName?: string,
  mode: "replace" | "append" = "replace",
): boolean {
  const d = getDb();
  const now = new Date().toISOString();
  const existing = d.prepare("SELECT title, content FROM documents WHERE slug = ?").get(slug) as
    | { title: string; content: string }
    | undefined;
  if (!existing) return false;
  const nextContent = mode === "append"
    ? [existing.content, content].filter(Boolean).join(existing.content.trim() ? "\n\n" : "")
    : content;

  const result = d
    .prepare("UPDATE documents SET content = ?, updated_at = ? WHERE slug = ?")
    .run(nextContent, now, slug);

  if (result.changes === 0) return false;

  // Record the edit for provenance
  d.prepare(
    "INSERT INTO edits (id, slug, author, author_name, content, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), slug, author, authorName ?? null, content.slice(0, 500), now);
  syncDocumentArtifact(slug, existing.title, nextContent);

  return true;
}

export function addComment(slug: string, author: string, text: string, position?: number): ProofComment {
  const d = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  d.prepare(
    "INSERT INTO comments (id, slug, author, text, position, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, slug, author, text, position ?? null, now);

  return { id, author, text, position, timestamp: now };
}

export function listDocuments(limit = 50): ProofDocument[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM documents ORDER BY updated_at DESC LIMIT ?")
    .all(limit)
    .map((row: any) => ({
      slug: row.slug,
      title: row.title,
      content: row.content,
      author: row.author,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      filePath: getProofDocumentFilePath(row.slug),
      edits: [],
    }));
}

export function getComments(slug: string): ProofComment[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM comments WHERE slug = ? ORDER BY timestamp ASC")
    .all(slug)
    .map((c: any) => ({
      id: c.id,
      author: c.author,
      text: c.text,
      position: c.position,
      timestamp: c.timestamp,
    }));
}

// ── HTTP Server ──────────────────────────────────────────────────

let server: Server | null = null;
let serverPort = 4000;

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function json(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function htmlResponse(res: ServerResponse, html: string): void {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(html);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderDocumentHtml(doc: ProofDocument, comments: ProofComment[]): string {
  const escapedContent = escapeHtml(doc.content);
  const escapedTitle = escapeHtml(doc.title);

  const commentsHtml = comments.length > 0
    ? `<div class="comments"><h3>Comments</h3>${comments.map(c =>
        `<div class="comment"><strong>${escapeHtml(c.author)}</strong>: ${escapeHtml(c.text)}<span class="time">${escapeHtml(c.timestamp)}</span></div>`
      ).join("")}</div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapedTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px; margin: 0 auto; padding: 24px;
      color: #e0e0e0; background: #1a1a2e;
      line-height: 1.6;
    }
    .header { border-bottom: 1px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 1.5em; color: #fff; }
    .meta { color: #888; font-size: 0.85em; margin-top: 4px; }
    .provenance { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; font-weight: 600; }
    .provenance.agent { background: #7c3aed33; color: #a78bfa; }
    .provenance.ally { background: #7c3aed33; color: #c4b5fd; }
    .provenance.human { background: #10b98133; color: #6ee7b7; }
    .content { white-space: pre-wrap; font-size: 1em; }
    .content h1, .content h2, .content h3 { color: #fff; margin: 1em 0 0.5em; }
    .comments { margin-top: 24px; border-top: 1px solid #333; padding-top: 12px; }
    .comment { margin: 8px 0; padding: 8px; background: #252545; border-radius: 6px; }
    .comment .time { color: #666; font-size: 0.8em; margin-left: 8px; }
    #editor {
      width: 100%; min-height: 300px; padding: 16px;
      background: #16162a; border: 1px solid #333; border-radius: 8px;
      color: #e0e0e0; font-family: inherit; font-size: 1em;
      line-height: 1.6; resize: vertical; outline: none;
    }
    #editor:focus { border-color: #7c3aed; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
    .save-btn {
      padding: 6px 16px; background: #7c3aed; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-size: 0.9em;
    }
    .save-btn:hover { background: #6d28d9; }
    .save-status { color: #6ee7b7; font-size: 0.85em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapedTitle}</h1>
    <div class="meta">
      <span class="provenance ${escapeHtml(doc.author)}">${escapeHtml(doc.author)}</span>
      Last updated: ${escapeHtml(doc.updatedAt)}
    </div>
  </div>
  <div class="toolbar">
    <button class="save-btn" onclick="saveContent()">Save</button>
    <span id="saveStatus" class="save-status"></span>
  </div>
  <textarea id="editor">${escapedContent}</textarea>
  ${commentsHtml}
  <script>
    const slug = "${escapeHtml(doc.slug)}";
    const editor = document.getElementById("editor");
    const status = document.getElementById("saveStatus");
    async function saveContent() {
      status.textContent = "Saving...";
      try {
        const res = await fetch("/documents/" + slug, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editor.value, author: "human" }),
        });
        if (res.ok) { status.textContent = "Saved"; setTimeout(() => status.textContent = "", 2000); }
        else { status.textContent = "Error saving"; }
      } catch { status.textContent = "Error saving"; }
    }
    // Auto-save on Ctrl/Cmd+S
    editor.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); saveContent(); }
    });
    // Auto-refresh every 3s to see agent edits
    setInterval(async () => {
      try {
        const res = await fetch("/documents/" + slug);
        const doc = await res.json();
        if (doc.content !== editor.value && document.activeElement !== editor) {
          editor.value = doc.content;
        }
      } catch {}
    }, 3000);
  </script>
</body>
</html>`;
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", `http://localhost:${serverPort}`);
  const path = url.pathname;
  const method = req.method ?? "GET";

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // Health check
  if (path === "/health") {
    json(res, 200, { status: "ok", service: "proof-server" });
    return;
  }

  // List documents
  if (path === "/documents" && method === "GET") {
    const docs = listDocuments();
    json(res, 200, { documents: docs.map((d) => ({ slug: d.slug, title: d.title, updatedAt: d.updatedAt, author: d.author })) });
    return;
  }

  // Create document
  if (path === "/documents" && method === "POST") {
    const body = await parseBody(req);
    if (!body.title) {
      json(res, 400, { error: "title is required" });
      return;
    }
    const doc = createDocument(body.title, body.content, body.author);
    json(res, 201, doc);
    return;
  }

  // Document routes: /documents/:slug or /documents/:slug/view or /documents/:slug/comments
  const docMatch = path.match(/^\/documents\/([^/]+)(\/view|\/comments)?$/);
  if (docMatch) {
    const slug = docMatch[1];
    const sub = docMatch[2];

    // View rendered HTML
    if (sub === "/view" && method === "GET") {
      const doc = readDocument(slug);
      if (!doc) { json(res, 404, { error: "not found" }); return; }
      const comments = getComments(slug);
      htmlResponse(res, renderDocumentHtml(doc, comments));
      return;
    }

    // Comments
    if (sub === "/comments" && method === "POST") {
      const body = await parseBody(req);
      const comment = addComment(slug, body.author ?? "unknown", body.text ?? "", body.position);
      json(res, 201, comment);
      return;
    }

    // Read document
    if (!sub && method === "GET") {
      const doc = readDocument(slug);
      if (!doc) { json(res, 404, { error: "not found" }); return; }
      json(res, 200, doc);
      return;
    }

    // Update document
    if (!sub && method === "PUT") {
      const body = await parseBody(req);
      const ok = editDocument(
        slug,
        body.content ?? "",
        body.author ?? "human",
        body.authorName,
        body.mode === "append" ? "append" : "replace",
      );
      if (!ok) { json(res, 404, { error: "not found" }); return; }
      json(res, 200, { updated: true });
      return;
    }
  }

  json(res, 404, { error: "not found" });
}

// ── Lifecycle ────────────────────────────────────────────────────

let logger: Logger | null = null;

export async function startProofServer(log: Logger): Promise<boolean> {
  logger = log;

  // Init DB
  try {
    await secureMkdir(dirname(DB_PATH));
    await secureMkdir(PROOF_ARTIFACTS_DIR);
    getDb();
  } catch (err) {
    try {
      const { health } = await import("../lib/health-ledger.js");
      health.signal("proof-server", false, { error: String(err) });
    } catch { /* non-fatal */ }
    log.warn(`[Proof] Database init failed: ${String(err)}`);
    return false;
  }

  // Try ports 4000-4009
  for (let port = 4000; port < 4010; port++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const srv = createServer((req, res) => {
          handleRequest(req, res).catch((err) => {
            json(res, 500, { error: String(err) });
          });
        });
        srv.on("error", reject);
        srv.listen(port, "127.0.0.1", () => {
          server = srv;
          serverPort = port;
          resolve();
        });
      });
      log.info(`[Proof] Document server listening on http://127.0.0.1:${serverPort}`);

      // Register with health ledger
      try {
        const { health } = await import("../lib/health-ledger.js");
        health.signal("proof-server", true, { port: serverPort });
      } catch { /* health ledger not available */ }

      return true;
    } catch {
      continue;
    }
  }

  try {
    const { health } = await import("../lib/health-ledger.js");
    health.signal("proof-server", false, { error: "no-port-available" });
  } catch { /* non-fatal */ }
  log.warn("[Proof] Could not bind to any port 4000-4009");
  return false;
}

export function stopProofServer(): void {
  if (server) {
    server.close();
    server = null;
  }
  if (db) {
    try { db.close(); } catch { /* ignore */ }
    db = null;
  }
}

export function isProofRunning(): boolean {
  return server !== null;
}

export function getProofPort(): number {
  return serverPort;
}

export function getProofViewUrl(slug: string): string {
  // Return gateway-relative path so the iframe works over HTTPS (e.g. Tailscale)
  return `/godmode/proof/documents/${slug}/view`;
}

export const proofHandlers: Record<string, Function> = {
  "proof.status": async ({ respond }: { respond: Function }) => {
    respond(true, {
      running: isProofRunning(),
      port: getProofPort(),
    });
  },
  "proof.get": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    const slug = typeof params.slug === "string" ? params.slug.trim() : "";
    if (!slug) {
      respond(false, null, { code: "INVALID_REQUEST", message: "slug is required" });
      return;
    }
    const doc = readDocument(slug);
    if (!doc) {
      respond(false, null, { code: "NOT_FOUND", message: "Proof document not found" });
      return;
    }
    respond(true, {
      slug: doc.slug,
      title: doc.title,
      updatedAt: doc.updatedAt,
      viewUrl: getProofViewUrl(doc.slug),
      filePath: doc.filePath,
    });
  },
  "proof.list": async ({ respond }: { respond: Function }) => {
    const documents = listDocuments(100).map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      updatedAt: doc.updatedAt,
      viewUrl: getProofViewUrl(doc.slug),
      filePath: doc.filePath,
    }));
    respond(true, { documents });
  },
};
