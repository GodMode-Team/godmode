/**
 * Agent Toolkit Server — HTTP server giving spawned agents runtime access
 * to GodMode's knowledge systems.
 *
 * Follows the proof-server.ts pattern: standalone http.createServer,
 * port scanning (5000-5009), JSON responses, CORS, health endpoint.
 *
 * Endpoints:
 *   /health              — no auth
 *   /search              — wraps secondBrain.search (QMD/file walk)
 *   /memory              — file-based search over ~/godmode/memory/
 *   /skills              — wraps loadSkillCards()
 *   /skills/match        — wraps matchSkillCard()
 *   /awareness           — reads awareness-snapshot.md
 *   /identity            — reads USER.md + SOUL.md
 *   /docs/:name          — allowlisted architecture docs
 *   /guardrails          — wraps formatGuardrailsForPrompt()
 *   /workspace           — workspace config for token's assigned workspace
 *   /workspace/guidelines — .godmode/guidelines.md from workspace dir
 *   /workspace/history   — recent completed tasks + agent outputs
 *   /workspace/artifacts — list existing artifacts
 *   /agents/active       — currently running queue items
 *   /agents/history      — recent completed agent work
 *   POST /checkpoint     — agent writes advisory checkpoint
 *
 * Security: Bearer token per agent (UUID), 60 req/min rate limit,
 * tokens auto-expire 4hr, workspace-scoped.
 */

import http from "node:http";
import { randomUUID } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { DATA_DIR } from "../data-paths.js";

import type { Logger } from "../types/plugin-api.js";

// ── Token Management ────────────────────────────────────────────────

export type AgentTokenMeta = {
  workspaceId?: string;
  agentId: string;
  permissions: string[];
  createdAt: number;
  expiresAt: number;
};

const TOKEN_TTL_MS = 45 * 60 * 1000; // 45 min (agent timeout is 30 min)
const tokens = new Map<string, AgentTokenMeta>();

export function registerAgentToken(
  token: string,
  meta: { workspaceId?: string; agentId: string; permissions?: string[] },
): void {
  tokens.set(token, {
    workspaceId: meta.workspaceId,
    agentId: meta.agentId,
    permissions: meta.permissions ?? ["read"],
    createdAt: Date.now(),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });
}

export function revokeAgentToken(token: string): void {
  tokens.delete(token);
}

function validateToken(token: string): AgentTokenMeta | null {
  const meta = tokens.get(token);
  if (!meta) return null;
  if (Date.now() > meta.expiresAt) {
    tokens.delete(token);
    return null;
  }
  return meta;
}

// ── Rate Limiting ───────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(token: string): boolean {
  const now = Date.now();
  let bucket = rateBuckets.get(token);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(token, bucket);
  }
  bucket.count++;
  return bucket.count <= RATE_LIMIT_MAX;
}

// ── Server lifecycle ────────────────────────────────────────────────

let _server: http.Server | null = null;
let _port = 0;
let _log: Logger | null = null;
let _cleanupTimer: ReturnType<typeof setInterval> | null = null;

/** Prune expired tokens and stale rate-limit buckets */
function pruneTokensAndBuckets(): void {
  const now = Date.now();
  for (const [k, v] of tokens) { if (now > v.expiresAt) tokens.delete(k); }
  for (const [k, v] of rateBuckets) { if (now > v.resetAt) rateBuckets.delete(k); }
}

export function isToolkitRunning(): boolean {
  return _server !== null && _server.listening;
}

export function getToolkitPort(): number {
  return _port;
}

export function getToolkitBaseUrl(): string {
  return `http://127.0.0.1:${_port}`;
}

export async function startToolkitServer(log: Logger): Promise<boolean> {
  if (_server) return true;
  _log = log;

  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      log.error(`[Toolkit] Unhandled: ${String(err)}`);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  });

  // Port scan 5000-5009
  for (let port = 5000; port <= 5009; port++) {
    try {
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", () => {
          server.removeListener("error", reject);
          resolve();
        });
      });
      _server = server;
      _port = port;
      _cleanupTimer = setInterval(pruneTokensAndBuckets, 15 * 60_000); // prune every 15 min
      _cleanupTimer.unref();
      log.info(`[Toolkit] Agent Toolkit Server listening on 127.0.0.1:${port}`);

      // Register with health ledger
      try {
        const { health } = await import("../lib/health-ledger.js");
        health.signal("toolkit-server", true, { port });
      } catch { /* non-fatal */ }

      return true;
    } catch {
      // Port in use — try next
    }
  }

  log.warn("[Toolkit] Could not bind to any port 5000-5009");
  return false;
}

export function stopToolkitServer(): void {
  if (_cleanupTimer) { clearInterval(_cleanupTimer); _cleanupTimer = null; }
  tokens.clear();
  rateBuckets.clear();
  if (_server) {
    _server.close();
    _server = null;
    _port = 0;
    _log?.info("[Toolkit] Agent Toolkit Server stopped");
  }
}

// ── Allowlisted docs ────────────────────────────────────────────────

const ALLOWED_DOCS = new Set(["GODMODE-META-ARCHITECTURE", "ROADMAP"]);

// ── Checkpoints ─────────────────────────────────────────────────────

const CHECKPOINTS_FILE = join(DATA_DIR, "agent-checkpoints.json");

function appendCheckpoint(checkpoint: Record<string, unknown>): void {
  let existing: unknown[] = [];
  try {
    if (existsSync(CHECKPOINTS_FILE)) {
      existing = JSON.parse(readFileSync(CHECKPOINTS_FILE, "utf-8"));
      if (!Array.isArray(existing)) existing = [];
    }
  } catch { existing = []; }
  existing.push(checkpoint);
  // Keep last 200 checkpoints
  if (existing.length > 200) existing = existing.slice(-200);
  mkdirSync(dirname(CHECKPOINTS_FILE), { recursive: true });
  writeFileSync(CHECKPOINTS_FILE, JSON.stringify(existing, null, 2));
}

// ── Request handler ─────────────────────────────────────────────────

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  // CORS — restrict to localhost origins only
  const origin = req.headers.origin ?? "";
  const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  res.setHeader("Access-Control-Allow-Origin", isLocalOrigin ? origin : "http://localhost");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://127.0.0.1:${_port}`);
  const pathname = url.pathname;

  // Health — no auth
  if (pathname === "/health") {
    json(res, 200, { status: "ok", uptime: process.uptime() });
    return;
  }

  // Auth check for all other endpoints
  const authHeader = req.headers.authorization ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!bearerToken) {
    json(res, 401, { error: "Missing Bearer token" });
    return;
  }

  const tokenMeta = validateToken(bearerToken);
  if (!tokenMeta) {
    json(res, 401, { error: "Invalid or expired token" });
    return;
  }

  if (!checkRateLimit(bearerToken)) {
    json(res, 429, { error: "Rate limit exceeded (60 req/min)" });
    return;
  }

  // Route
  try {
    if (pathname === "/search" && req.method === "GET") {
      await handleSearch(url, tokenMeta, res);
    } else if (pathname === "/memory" && req.method === "GET") {
      await handleMemory(url, res);
    } else if (pathname === "/skills" && req.method === "GET") {
      await handleSkills(res);
    } else if (pathname === "/skills/match" && req.method === "GET") {
      await handleSkillMatch(url, res);
    } else if (pathname === "/awareness" && req.method === "GET") {
      await handleAwareness(res);
    } else if (pathname === "/identity" && req.method === "GET") {
      await handleIdentity(res);
    } else if (pathname.startsWith("/docs/") && req.method === "GET") {
      await handleDocs(pathname, res);
    } else if (pathname === "/guardrails" && req.method === "GET") {
      await handleGuardrails(res);
    } else if (pathname === "/workspace" && req.method === "GET") {
      await handleWorkspace(tokenMeta, res);
    } else if (pathname === "/workspace/guidelines" && req.method === "GET") {
      await handleWorkspaceGuidelines(tokenMeta, res);
    } else if (pathname === "/workspace/history" && req.method === "GET") {
      await handleWorkspaceHistory(url, tokenMeta, res);
    } else if (pathname === "/workspace/artifacts" && req.method === "GET") {
      await handleWorkspaceArtifacts(tokenMeta, res);
    } else if (pathname === "/agents/active" && req.method === "GET") {
      await handleAgentsActive(res);
    } else if (pathname === "/agents/history" && req.method === "GET") {
      await handleAgentsHistory(url, res);
    } else if (pathname === "/checkpoint" && req.method === "POST") {
      await handleCheckpoint(req, tokenMeta, res);
    } else {
      json(res, 404, { error: "Not found" });
    }
  } catch (err) {
    _log?.error(`[Toolkit] Handler error on ${pathname}: ${String(err)}`);
    json(res, 200, { results: [], status: "offline", error: String(err) });
  }
}

// ── Endpoint handlers ───────────────────────────────────────────────

async function handleSearch(
  url: URL,
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  const query = url.searchParams.get("query") ?? "";
  const scope = url.searchParams.get("scope") ?? "all";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10) || 20, 100);

  if (!query) {
    json(res, 400, { error: "query parameter required" });
    return;
  }

  try {
    // Use the same QMD/file-walk search that secondBrain.search uses
    const { existsSync: eSync, readdirSync, readFileSync: rfSync, statSync } = await import("node:fs");
    const { join: pJoin, basename: pBase, extname: pExt, relative } = await import("node:path");
    const { GODMODE_ROOT, MEMORY_DIR } = await import("../data-paths.js");
    const {
      getVaultPath,
      resolveIdentityDir,
      resolvePeoplePath,
      resolveCompaniesPath,
      resolveProjectsPath,
      resolveResearchDir,
      VAULT_FOLDERS,
      BRAIN_SUBFOLDERS,
    } = await import("../lib/vault-paths.js");

    // Simple file-walk search (agents don't need QMD complexity)
    const searchDirs: Array<{ dir: string; label: string }> = [];
    const vault = getVaultPath();

    // If workspace-scoped, prefer workspace dir
    if (tokenMeta.workspaceId) {
      try {
        const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
        const config = await readWorkspaceConfig({ initializeIfMissing: false });
        const ws = findWorkspaceById(config, tokenMeta.workspaceId);
        if (ws) {
          searchDirs.push({ dir: ws.path, label: "workspace" });
        }
      } catch { /* fall through to general search */ }
    }

    if (scope === "all" || scope === "research") {
      const { path: researchDir } = resolveResearchDir();
      searchDirs.push({ dir: researchDir, label: "research" });
    }
    if (scope === "all" || scope === "bank") {
      const { path: peoplePath } = resolvePeoplePath();
      const { path: companiesPath } = resolveCompaniesPath();
      searchDirs.push({ dir: peoplePath, label: "people" });
      searchDirs.push({ dir: companiesPath, label: "companies" });
    }
    if (scope === "all" || scope === "projects") {
      const { path: projectsPath } = resolveProjectsPath();
      searchDirs.push({ dir: projectsPath, label: "projects" });
    }
    if (scope === "all") {
      if (vault) {
        searchDirs.push({ dir: pJoin(vault, VAULT_FOLDERS.identity), label: "identity" });
        searchDirs.push({ dir: pJoin(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge), label: "knowledge" });
      } else {
        searchDirs.push({ dir: MEMORY_DIR, label: "memory" });
      }
    }

    const q = query.toLowerCase();
    type SearchResult = { path: string; name: string; section: string; excerpt: string };
    const results: SearchResult[] = [];

    function walkDir(dirPath: string, section: string, depth: number) {
      if (depth > 4 || results.length >= limit) return;
      let entries: import("node:fs").Dirent[];
      try { entries = readdirSync(dirPath, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        if (results.length >= limit) break;
        const fullPath = pJoin(dirPath, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".")) {
          walkDir(fullPath, section, depth + 1);
        } else if (entry.isFile() && /\.(md|txt|json)$/i.test(entry.name)) {
          try {
            const content = rfSync(fullPath, "utf-8");
            if (content.toLowerCase().includes(q) || entry.name.toLowerCase().includes(q)) {
              const lines = content.split("\n");
              const matchLine = lines.findIndex((l) => l.toLowerCase().includes(q));
              const excerpt = matchLine >= 0
                ? lines.slice(Math.max(0, matchLine - 1), matchLine + 3).join("\n").slice(0, 300)
                : lines.slice(0, 5).join("\n").slice(0, 300);
              results.push({
                path: relative(GODMODE_ROOT, fullPath),
                name: pBase(fullPath, pExt(fullPath)),
                section,
                excerpt,
              });
            }
          } catch { /* skip unreadable files */ }
        }
      }
    }

    for (const { dir, label } of searchDirs) {
      if (results.length >= limit) break;
      walkDir(dir, label, 0);
    }

    json(res, 200, { results, query, total: results.length });
  } catch (err) {
    json(res, 200, { results: [], status: "offline", error: String(err) });
  }
}

async function handleMemory(url: URL, res: http.ServerResponse): Promise<void> {
  const query = url.searchParams.get("query") ?? "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10", 10) || 10, 50);

  if (!query) {
    json(res, 400, { error: "query parameter required" });
    return;
  }

  // File-based memory search over ~/godmode/memory/
  // File-walk fallback when Honcho is unavailable.
  try {
    const { readdirSync, readFileSync: rfSync } = await import("node:fs");
    const { join: pJoin, basename: pBase, extname: pExt } = await import("node:path");
    const { MEMORY_DIR } = await import("../data-paths.js");

    const q = query.toLowerCase();
    type MemoryResult = { path: string; name: string; excerpt: string };
    const results: MemoryResult[] = [];

    function walkMemory(dirPath: string, depth: number) {
      if (depth > 4 || results.length >= limit) return;
      let entries: import("node:fs").Dirent[];
      try { entries = readdirSync(dirPath, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        if (results.length >= limit) break;
        const fullPath = pJoin(dirPath, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".")) {
          walkMemory(fullPath, depth + 1);
        } else if (entry.isFile() && /\.(md|txt|json)$/i.test(entry.name)) {
          try {
            const content = rfSync(fullPath, "utf-8");
            if (content.toLowerCase().includes(q) || entry.name.toLowerCase().includes(q)) {
              const lines = content.split("\n");
              const matchLine = lines.findIndex((l) => l.toLowerCase().includes(q));
              const excerpt = matchLine >= 0
                ? lines.slice(Math.max(0, matchLine - 1), matchLine + 3).join("\n").slice(0, 300)
                : lines.slice(0, 5).join("\n").slice(0, 300);
              results.push({
                path: fullPath,
                name: pBase(fullPath, pExt(fullPath)),
                excerpt,
              });
            }
          } catch { /* skip unreadable files */ }
        }
      }
    }

    walkMemory(MEMORY_DIR, 0);
    json(res, 200, { results, query, total: results.length });
  } catch (err) {
    json(res, 200, { results: [], status: "offline", error: String(err) });
  }
}

async function handleSkills(res: http.ServerResponse): Promise<void> {
  try {
    const { loadSkillCards } = await import("../lib/skill-cards.js");
    const cards = loadSkillCards();
    const skills = cards.map((c) => ({
      slug: c.slug,
      domain: c.domain,
      triggers: c.triggers,
      tools: c.tools,
    }));
    json(res, 200, { skills });
  } catch {
    json(res, 200, { skills: [], status: "offline" });
  }
}

async function handleSkillMatch(url: URL, res: http.ServerResponse): Promise<void> {
  const message = url.searchParams.get("message") ?? "";
  if (!message) {
    json(res, 400, { error: "message parameter required" });
    return;
  }
  try {
    const { matchSkillCard } = await import("../lib/skill-cards.js");
    const card = matchSkillCard(message);
    json(res, 200, { match: card ? { slug: card.slug, domain: card.domain, body: card.body } : null });
  } catch {
    json(res, 200, { match: null, status: "offline" });
  }
}

async function handleAwareness(res: http.ServerResponse): Promise<void> {
  try {
    const snapshotPath = join(DATA_DIR, "awareness-snapshot.md");
    const content = await readFile(snapshotPath, "utf-8");
    json(res, 200, { content });
  } catch {
    json(res, 200, { content: "", status: "offline" });
  }
}

async function handleIdentity(res: http.ServerResponse): Promise<void> {
  try {
    const { resolveIdentityDir } = await import("../lib/vault-paths.js");
    const { path: identityDir } = resolveIdentityDir();
    let user = "";
    let soul = "";
    try { user = await readFile(join(identityDir, "USER.md"), "utf-8"); } catch { /* ok */ }
    try { soul = await readFile(join(identityDir, "SOUL.md"), "utf-8"); } catch { /* ok */ }
    json(res, 200, { user, soul });
  } catch {
    json(res, 200, { user: "", soul: "", status: "offline" });
  }
}

async function handleDocs(pathname: string, res: http.ServerResponse): Promise<void> {
  const docName = pathname.replace("/docs/", "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (!ALLOWED_DOCS.has(docName)) {
    json(res, 404, { error: `Doc "${docName}" not in allowlist` });
    return;
  }
  try {
    const thisFile = fileURLToPath(import.meta.url);
    const pluginRoot = resolve(dirname(thisFile), "..", "..");
    const docPath = join(pluginRoot, "docs", `${docName}.md`);
    const content = await readFile(docPath, "utf-8");
    json(res, 200, { name: docName, content });
  } catch {
    json(res, 200, { name: docName, content: "", status: "offline" });
  }
}

async function handleGuardrails(res: http.ServerResponse): Promise<void> {
  try {
    const { formatGuardrailsForPrompt } = await import("./guardrails.js");
    const content = await formatGuardrailsForPrompt();
    json(res, 200, { content });
  } catch {
    json(res, 200, { content: "", status: "offline" });
  }
}

async function handleWorkspace(
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  if (!tokenMeta.workspaceId) {
    json(res, 200, { workspace: null, message: "No workspace assigned to this token" });
    return;
  }
  try {
    const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    const ws = findWorkspaceById(config, tokenMeta.workspaceId);
    if (!ws) {
      json(res, 200, { workspace: null, message: "Workspace not found" });
      return;
    }
    json(res, 200, {
      workspace: {
        id: ws.id,
        name: ws.name,
        type: ws.type,
        path: ws.path,
        keywords: ws.keywords,
      },
    });
  } catch {
    json(res, 200, { workspace: null, status: "offline" });
  }
}

async function handleWorkspaceGuidelines(
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  if (!tokenMeta.workspaceId) {
    json(res, 200, { guidelines: "", message: "No workspace assigned" });
    return;
  }
  try {
    const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    const ws = findWorkspaceById(config, tokenMeta.workspaceId);
    if (!ws) {
      json(res, 200, { guidelines: "" });
      return;
    }
    const guidelinesPath = join(ws.path, ".godmode", "guidelines.md");
    try {
      const content = await readFile(guidelinesPath, "utf-8");
      json(res, 200, { guidelines: content });
    } catch {
      json(res, 200, { guidelines: "" });
    }
  } catch {
    json(res, 200, { guidelines: "", status: "offline" });
  }
}

async function handleWorkspaceHistory(
  url: URL,
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10", 10) || 10, 50);

  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const state = await readQueueState();
    let items = state.items.filter(
      (i) => i.status === "done" || i.status === "review" || i.status === "needs-review",
    );
    // Filter by workspace if scoped
    if (tokenMeta.workspaceId) {
      items = items.filter((i) => i.workspaceId === tokenMeta.workspaceId);
    }
    items.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    const history = items.slice(0, limit).map((i) => ({
      id: i.id,
      title: i.title,
      type: i.type,
      status: i.status,
      completedAt: i.completedAt,
      summary: i.result?.summary ?? "",
    }));
    json(res, 200, { history, total: history.length });
  } catch {
    json(res, 200, { history: [], status: "offline" });
  }
}

async function handleWorkspaceArtifacts(
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  if (!tokenMeta.workspaceId) {
    json(res, 200, { artifacts: [], message: "No workspace assigned" });
    return;
  }
  try {
    const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    const ws = findWorkspaceById(config, tokenMeta.workspaceId);
    if (!ws) {
      json(res, 200, { artifacts: [] });
      return;
    }
    const artifacts: Array<{ name: string; path: string; type: string }> = [];
    for (const dir of ws.artifactDirs) {
      const dirPath = join(ws.path, dir);
      try {
        const entries = await readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            artifacts.push({
              name: entry.name,
              path: join(dir, entry.name),
              type: extname(entry.name).slice(1) || "unknown",
            });
          }
        }
      } catch { /* dir doesn't exist — skip */ }
    }
    json(res, 200, { artifacts, total: artifacts.length });
  } catch {
    json(res, 200, { artifacts: [], status: "offline" });
  }
}

async function handleAgentsActive(res: http.ServerResponse): Promise<void> {
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const state = await readQueueState();
    const active = state.items
      .filter((i) => i.status === "processing")
      .map((i) => ({
        id: i.id,
        title: i.title,
        type: i.type,
        startedAt: i.startedAt,
        personaHint: i.personaHint,
      }));
    json(res, 200, { agents: active, count: active.length });
  } catch {
    json(res, 200, { agents: [], count: 0, status: "offline" });
  }
}

async function handleAgentsHistory(url: URL, res: http.ServerResponse): Promise<void> {
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10", 10) || 10, 50);
  const workspaceFilter = url.searchParams.get("workspace") ?? "";

  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const state = await readQueueState();
    let items = state.items.filter(
      (i) => i.status === "done" || i.status === "failed",
    );
    if (workspaceFilter) {
      items = items.filter((i) => i.workspaceId === workspaceFilter);
    }
    items.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    const history = items.slice(0, limit).map((i) => ({
      id: i.id,
      title: i.title,
      type: i.type,
      status: i.status,
      completedAt: i.completedAt,
      summary: i.result?.summary ?? "",
    }));
    json(res, 200, { history, total: history.length });
  } catch {
    json(res, 200, { history: [], status: "offline" });
  }
}

async function handleCheckpoint(
  req: http.IncomingMessage,
  tokenMeta: AgentTokenMeta,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody(req);
  try {
    const data = JSON.parse(body);
    const checkpoint = {
      agentId: tokenMeta.agentId,
      workspaceId: tokenMeta.workspaceId,
      action: data.action ?? "unknown",
      description: data.description ?? "",
      affects: data.affects ?? "",
      rollbackPlan: data.rollbackPlan ?? "",
      timestamp: new Date().toISOString(),
    };
    appendCheckpoint(checkpoint);
    json(res, 200, { saved: true, checkpoint });
  } catch {
    json(res, 400, { error: "Invalid JSON body" });
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

function json(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let rejected = false;
    req.on("data", (chunk: Buffer) => {
      if (rejected) return;
      size += chunk.length;
      if (size > 1_000_000) { rejected = true; req.destroy(); reject(new Error("Body too large")); return; }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

/** Generate a scoped token for an agent and return { token, baseUrl } */
export function createAgentToken(opts: {
  agentId: string;
  workspaceId?: string;
  permissions?: string[];
}): { token: string; baseUrl: string } | null {
  if (!isToolkitRunning()) return null;
  const token = randomUUID();
  registerAgentToken(token, {
    agentId: opts.agentId,
    workspaceId: opts.workspaceId,
    permissions: opts.permissions ?? ["read"],
  });
  return { token, baseUrl: getToolkitBaseUrl() };
}
