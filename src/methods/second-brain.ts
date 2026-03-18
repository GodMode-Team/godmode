/**
 * GodMode — Second Brain
 *
 * Vault-first window into the user's Obsidian-driven second brain.
 * Reads from Obsidian vault (PARA structure) with fallback to ~/godmode/memory/.
 *
 * RPC methods:
 *   secondBrain.identity        — USER.md, SOUL.md, VISION.md, opinions.md, THESIS.md
 *   secondBrain.memoryBank      — file/folder listings from Brain/, Projects/
 *   secondBrain.memoryBankEntry — single file content
 *   secondBrain.aiPacket        — CONSCIOUSNESS.md + WORKING.md
 *   secondBrain.sync            — trigger consciousness-sync.sh
 *   secondBrain.vaultHealth     — vault stats and recent activity
 *   secondBrain.inboxItems      — vault inbox listing
 *   secondBrain.migrateToVault  — trigger migration from ~/godmode/memory/ to vault
 */

import { execFile } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, extname, join, relative } from "node:path";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR, GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import {
  getVaultPath,
  isVaultAvailable,
  resolveIdentityDir,
  resolvePeoplePath,
  resolveCompaniesPath,
  resolveProjectsPath,
  resolveResearchDir,
  resolveCuratedPath,
  resolveKnowledgePath,
  resolveOpinionsPath,
  resolveInboxPath,
  resolveWritePath,
  getVaultHealth,
  isAllowedPath,
  VAULT_FOLDERS,
  BRAIN_SUBFOLDERS,
} from "../lib/vault-paths.js";
import { autoMigrateIfNeeded, migrateToVault } from "../lib/vault-migrate.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Helpers ──────────────────────────────────────────────────────────

/** Check if a path is a symlink pointing outside allowed roots. Returns true if safe. */
function isSymlinkSafe(filePath: string): boolean {
  try {
    const stat = lstatSync(filePath);
    if (stat.isSymbolicLink()) {
      const target = realpathSync(filePath);
      return isAllowedPath(target);
    }
    return true; // Not a symlink — safe
  } catch {
    return false;
  }
}

function safeReadFile(filePath: string): string | null {
  try {
    if (!isSymlinkSafe(filePath)) return null;
    return readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeFileMtime(filePath: string): string | null {
  try {
    if (!isSymlinkSafe(filePath)) return null;
    return statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

type FileEntry = {
  name: string;
  path: string;
  updatedAt: string | null;
  excerpt: string;
  size: number;
  isDirectory?: boolean;
  childCount?: number;
};

function extractExcerpt(content: string): string {
  return content
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#") && !line.startsWith("---") && !line.startsWith("*Last"))
    .slice(0, 3)
    .join(" ")
    .slice(0, 200);
}

function listEntries(dirPath: string): FileEntry[] {
  if (!existsSync(dirPath)) return [];
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    return entries
      .filter((e) => {
        if (e.name.startsWith(".") || e.name.startsWith("_")) return false;
        if (e.isDirectory()) return true;
        const ext = extname(e.name);
        return ext === ".md" || ext === ".txt";
      })
      .filter((e) => isSymlinkSafe(join(dirPath, e.name)))
      .map((e) => {
        const fullPath = join(dirPath, e.name);
        if (e.isDirectory()) {
          let childCount = 0;
          try {
            childCount = readdirSync(fullPath).filter(
              (f) => !f.startsWith(".") && !f.startsWith("_"),
            ).length;
          } catch { /* empty */ }
          return {
            name: e.name,
            path: fullPath,
            updatedAt: safeFileMtime(fullPath),
            excerpt: `${childCount} items`,
            size: 0,
            isDirectory: true,
            childCount,
          };
        }
        const content = safeReadFile(fullPath);
        let size = 0;
        try { size = statSync(fullPath).size; } catch { /* empty */ }
        return {
          name: basename(e.name, extname(e.name)),
          path: fullPath,
          updatedAt: safeFileMtime(fullPath),
          excerpt: content ? extractExcerpt(content) : "",
          size,
        };
      })
      .sort((a, b) => {
        // Directories first, then by updated time
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        if (!a.updatedAt || !b.updatedAt) return 0;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  } catch {
    return [];
  }
}

// ── Identity ─────────────────────────────────────────────────────────

type IdentityFile = {
  key: string;
  label: string;
  content: string | null;
  updatedAt: string | null;
};

/** Identity file specs — resolved vault-first at read time. */
const IDENTITY_FILE_SPECS: Array<{
  key: string;
  label: string;
  filename: string;
  vaultFilename: string;
  localDir: "root" | "memory";
}> = [
  { key: "user", label: "Profile", filename: "USER.md", vaultFilename: "USER.md", localDir: "root" },
  { key: "soul", label: "Soul", filename: "SOUL.md", vaultFilename: "SOUL.md", localDir: "root" },
  { key: "vision", label: "Vision", filename: "VISION.md", vaultFilename: "VISION.md", localDir: "root" },
  { key: "identity", label: "Identity", filename: "IDENTITY.md", vaultFilename: "IDENTITY.md", localDir: "root" },
  { key: "principles", label: "Principles", filename: "PRINCIPLES.md", vaultFilename: "PRINCIPLES.md", localDir: "root" },
  { key: "thesis", label: "Thesis", filename: "THESIS.md", vaultFilename: "THESIS.md", localDir: "memory" },
  { key: "opinions", label: "Opinions & Rules", filename: "bank/opinions.md", vaultFilename: "opinions.md", localDir: "memory" },
];

function resolveIdentityFilePath(spec: typeof IDENTITY_FILE_SPECS[number]): string {
  // Try vault first
  const vault = getVaultPath();
  if (vault) {
    // Opinions goes to Brain/Knowledge, everything else to Identity folder
    const vaultPath = spec.key === "opinions"
      ? resolveOpinionsPath().path
      : join(vault, VAULT_FOLDERS.identity, spec.vaultFilename);
    if (existsSync(vaultPath)) return vaultPath;
  }
  // Fallback to local
  return spec.localDir === "root"
    ? join(GODMODE_ROOT, spec.filename)
    : join(MEMORY_DIR, spec.filename);
}

const identity: GatewayRequestHandler = async ({ respond }) => {
  // Auto-migrate on first access
  await autoMigrateIfNeeded();

  const files: IdentityFile[] = [];
  for (const spec of IDENTITY_FILE_SPECS) {
    const filePath = resolveIdentityFilePath(spec);
    const content = safeReadFile(filePath);
    if (content) {
      files.push({
        key: spec.key,
        label: spec.label,
        content,
        updatedAt: safeFileMtime(filePath),
      });
    }
  }

  // Check for Identity OS dashboard — served via artifact file server
  const identityOsDashboardFile = join(MEMORY_DIR, "projects", "identity-os", "final", "dashboard", "index.html");
  const identityOsExists = existsSync(identityOsDashboardFile);
  // Return the served URL so the UI can open it directly (preserving relative links)
  const identityOsDashboard = "/godmode/artifacts/index.html";

  // Identity OS final artifacts
  const identityOsFinalPath = join(MEMORY_DIR, "projects", "identity-os", "final");
  const identityOsArtifacts = listEntries(identityOsFinalPath);

  respond(true, {
    files,
    identityOs: identityOsExists ? {
      dashboardPath: identityOsDashboard,
      artifacts: identityOsArtifacts,
    } : null,
  });
};

// ── Memory Bank ──────────────────────────────────────────────────────

const memoryBank: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { folder?: string };
  const folder = typeof p.folder === "string" ? p.folder.trim() : "";

  // If a subfolder is requested, list its contents
  if (folder) {
    // Security: must be under GODMODE_ROOT or vault
    if (!isAllowedPath(folder)) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory or vault" });
      return;
    }
    const entries = listEntries(folder);
    respond(true, {
      folder,
      folderName: basename(folder),
      entries,
      parentPath: join(folder, ".."),
    });
    return;
  }

  // Top-level: list all sections (vault-first with fallback)
  const { path: peoplePath } = resolvePeoplePath();
  const { path: companiesPath } = resolveCompaniesPath();
  const { path: projectsPath } = resolveProjectsPath();

  const people = listEntries(peoplePath);
  const companies = listEntries(companiesPath);
  const projects = listEntries(projectsPath);

  // Curated facts (vault-first)
  const { path: curatedPath } = resolveCuratedPath();
  const curated = safeReadFile(curatedPath);

  // Extra toplevel memory/knowledge files (vault-first)
  const extraFiles: FileEntry[] = [];
  const EXTRA_MEMORY_FILES = ["tacit.md", "topics.md", "golden-rules-definitions.md", "known-issues.md"];
  for (const f of EXTRA_MEMORY_FILES) {
    const { path: fp } = resolveKnowledgePath(f);
    const content = safeReadFile(fp);
    if (content) {
      extraFiles.push({
        name: basename(f, ".md"),
        path: fp,
        updatedAt: safeFileMtime(fp),
        excerpt: extractExcerpt(content),
        size: content.length,
      });
    }
  }

  respond(true, {
    sections: [
      { key: "people", label: "People", icon: "\u{1F464}", path: peoplePath, entries: people },
      { key: "companies", label: "Companies", icon: "\u{1F3E2}", path: companiesPath, entries: companies },
      { key: "projects", label: "Projects", icon: "\u{1F4C2}", path: projectsPath, entries: projects },
    ],
    curated: curated
      ? { content: curated.slice(0, 3000), updatedAt: safeFileMtime(curatedPath), totalLength: curated.length }
      : null,
    extraFiles,
    totalEntries: people.length + companies.length + projects.length,
  });
};

// ── Memory Bank Entry ────────────────────────────────────────────────

const memoryBankEntry: GatewayRequestHandler = async ({ params, respond }) => {
  const { path: filePath } = params as { path?: string };
  if (!filePath || typeof filePath !== "string") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Missing required parameter: path" });
    return;
  }
  const resolved = filePath.startsWith("/") ? filePath : join(GODMODE_ROOT, filePath);
  if (!isAllowedPath(resolved)) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory or vault" });
    return;
  }
  const content = safeReadFile(resolved);
  if (content === null) {
    respond(false, undefined, { code: "NOT_FOUND", message: `File not found: ${basename(filePath)}` });
    return;
  }
  // Show vault-relative path if in vault, otherwise godmode-relative
  const vault = getVaultPath();
  const relPath = vault && resolved.startsWith(vault)
    ? relative(vault, resolved)
    : relative(GODMODE_ROOT, resolved);
  respond(true, {
    name: basename(filePath, extname(filePath)),
    content,
    updatedAt: safeFileMtime(resolved),
    relativePath: relPath,
  });
};

// ── AI Packet ────────────────────────────────────────────────────────

const aiPacket: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { readSnapshot } = await import("../lib/awareness-snapshot.js");
    const snapshot = await readSnapshot();
    respond(true, {
      snapshot: snapshot
        ? { content: snapshot, lineCount: snapshot.split("\n").length }
        : null,
    });
  } catch {
    respond(true, { snapshot: null });
  }
};

// ── Sync ─────────────────────────────────────────────────────────────

const sync: GatewayRequestHandler = async ({ respond, context }) => {
  context?.broadcast?.("secondBrain:sync-status", { status: "syncing" }, { dropIfSlow: true });

  try {
    const { generateSnapshot } = await import("../lib/awareness-snapshot.js");
    const snapshot = await generateSnapshot();

    context?.broadcast?.(
      "secondBrain:sync-status",
      { status: "ok", updatedAt: new Date().toISOString() },
      { dropIfSlow: true },
    );

    respond(true, {
      ok: true,
      message: "Awareness snapshot regenerated",
      snapshot: {
        content: snapshot,
        updatedAt: new Date().toISOString(),
        lineCount: snapshot.split("\n").length,
      },
    });
  } catch (err) {
    context?.broadcast?.(
      "secondBrain:sync-status",
      { status: "error", message: String(err) },
      { dropIfSlow: true },
    );
    respond(false, undefined, { code: "UNAVAILABLE", message: String(err) });
  }
};

// ── Sources ──────────────────────────────────────────────────────────

type SourceEntry = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "available";
  icon: string;
  description: string;
  stats?: string;
  lastSync?: string | null;
};

/** All sources that Second Brain knows about. Vault-first detection. */
const KNOWN_SOURCES: Array<{
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  detect: () => { connected: boolean; stats?: string; lastSync?: string | null };
}> = [
  {
    id: "obsidian-vault",
    name: "Obsidian Vault",
    type: "vault",
    icon: "\u{1F4D3}",
    description: "Your second brain — the canonical data store for all knowledge",
    detect: () => {
      const vault = getVaultPath();
      if (!vault) return { connected: false };
      const health = getVaultHealth();
      if (!health) return { connected: false };
      return {
        connected: true,
        stats: `${health.totalNotes} notes · ${health.inboxCount} in inbox · ${health.brainCount} in brain`,
        lastSync: health.lastActivity,
      };
    },
  },
  {
    id: "memory-bank",
    name: "Brain (People & Companies)",
    type: "memory",
    icon: "\u{1F9E0}",
    description: "People, companies, projects, and curated knowledge",
    detect: () => {
      const { path: peoplePath } = resolvePeoplePath();
      const { path: companiesPath } = resolveCompaniesPath();
      const { path: projectsPath } = resolveProjectsPath();
      let people = 0, companies = 0, projects = 0;
      try { people = readdirSync(peoplePath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      try { companies = readdirSync(companiesPath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      try { projects = readdirSync(projectsPath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      const total = people + companies + projects;
      return {
        connected: total > 0,
        stats: total > 0 ? `${people} people, ${companies} companies, ${projects} projects` : undefined,
        lastSync: safeFileMtime(peoplePath),
      };
    },
  },
  {
    id: "identity-os",
    name: "Identity OS",
    type: "identity",
    icon: "\u{1F4D6}",
    description: "Your identity extraction — voice, values, story, thinking patterns",
    detect: () => {
      const finalPath = join(MEMORY_DIR, "projects", "identity-os", "final");
      try {
        const items = readdirSync(finalPath).filter(f => !f.startsWith("."));
        return { connected: items.length > 0, stats: `${items.length} artifacts`, lastSync: safeFileMtime(finalPath) };
      } catch { return { connected: false }; }
    },
  },
  {
    id: "consciousness",
    name: "Awareness",
    type: "ai-context",
    icon: "\u{26A1}",
    description: "Live awareness snapshot — cross-session context",
    detect: () => {
      const snapshotPath = join(DATA_DIR, "awareness-snapshot.md");
      const content = safeReadFile(snapshotPath);
      return {
        connected: content !== null,
        stats: content ? `${content.split("\n").length} lines` : undefined,
        lastSync: safeFileMtime(snapshotPath),
      };
    },
  },
];

/** Sources that come from data-sources.json (external integrations) */
const EXTERNAL_SOURCE_META: Record<string, { icon: string; description: string }> = {
  "google-calendar-primary": { icon: "\u{1F4C5}", description: "Primary calendar events and scheduling" },
  "google-calendar-secondary": { icon: "\u{1F4C5}", description: "Secondary calendar" },
  "google-contacts": { icon: "\u{1F465}", description: "Contact relationships and details" },
  "clickup": { icon: "\u{2705}", description: "Tasks, projects, and workflows" },
  "front-email": { icon: "\u{1F4E7}", description: "Email inbox and conversations" },
  "oura-ring": { icon: "\u{2764}\u{FE0F}", description: "Sleep, readiness, HRV, and biometrics" },
  "fathom": { icon: "\u{1F3A4}", description: "Meeting recordings and transcriptions" },
  "weather": { icon: "\u{26C5}", description: "Local weather and conditions" },
  "slack": { icon: "\u{1F4AC}", description: "Team messaging and channels" },
  "obsidian": { icon: "\u{1F4D3}", description: "Your second brain — daily notes, projects, references" },
};

const sources: GatewayRequestHandler = async ({ respond }) => {
  const result: SourceEntry[] = [];
  const seenIds = new Set<string>();

  // 1. Built-in GodMode sources (memory bank, identity os, consciousness)
  for (const src of KNOWN_SOURCES) {
    const detection = src.detect();
    seenIds.add(src.id);
    result.push({
      id: src.id,
      name: src.name,
      type: src.type,
      status: detection.connected ? "connected" : "available",
      icon: src.icon,
      description: src.description,
      stats: detection.stats,
      lastSync: detection.lastSync,
    });
  }

  // 2. External integrations from data-sources.json
  const dataSourcesPath = join(GODMODE_ROOT, "data", "data-sources.json");
  try {
    const raw = safeReadFile(dataSourcesPath);
    if (raw) {
      const parsed = JSON.parse(raw) as { sources?: Array<{ id: string; name: string; type: string; status: string; lastSync?: string }> };
      for (const ds of parsed.sources ?? []) {
        if (seenIds.has(ds.id)) continue;
        seenIds.add(ds.id);
        const meta = EXTERNAL_SOURCE_META[ds.id];
        result.push({
          id: ds.id,
          name: ds.name,
          type: ds.type,
          status: ds.status === "connected" ? "connected" : "available",
          icon: meta?.icon ?? "\u{1F517}",
          description: meta?.description ?? `${ds.type} integration`,
          lastSync: ds.lastSync ?? null,
        });
      }
    }
  } catch { /* empty */ }

  // 3. Community resources (agent-discoverable bookmarks)
  try {
    const communityData = await readCommunityResources();
    if (communityData.resources.length > 0) {
      const crId = "community-resources";
      if (!seenIds.has(crId)) {
        seenIds.add(crId);
        result.push({
          id: crId,
          name: "Community Resources",
          type: "community",
          status: "connected",
          icon: "\u{1F310}",
          description: `${communityData.resources.length} curated open-source repos and tools for agents to reference`,
          stats: communityData.resources.map(r => r.label).join(", "),
        });
      }
    }
  } catch { /* non-critical */ }

  // 4. Integration registry sources (calendar, health, intelligence, etc.)
  try {
    const { getIntegrationsForPlatform, detectAllIntegrations } = await import("../lib/integration-registry.js");
    const integrations = getIntegrationsForPlatform();
    const statuses = await detectAllIntegrations();

    const INTEGRATION_ICONS: Record<string, string> = {
      "x-intelligence": "\u{1F50D}",
      "tailscale": "\u{1F310}",
      "google-calendar": "\u{1F4C5}",
      "obsidian-vault": "\u{1F4D3}",
      "github-cli": "\u{1F4BB}",
      "messaging-channel": "\u{1F4F1}",
      "oura-ring": "\u{2764}\u{FE0F}",
      "weather": "\u{26C5}",
      "obsidian-sync": "\u{1F504}",
    };

    for (const integration of integrations) {
      // Skip obsidian-vault — already covered by KNOWN_SOURCES
      if (integration.id === "obsidian-vault" || seenIds.has(integration.id)) continue;
      seenIds.add(integration.id);

      const status = statuses[integration.id];
      const isConnected = status?.working || status?.configured;

      result.push({
        id: integration.id,
        name: integration.name,
        type: "integration",
        status: isConnected ? "connected" : "available",
        icon: INTEGRATION_ICONS[integration.id] ?? "\u{1F517}",
        description: integration.description,
        stats: status?.details ?? undefined,
      });
    }
  } catch { /* integration registry not available — non-critical */ }

  const connectedCount = result.filter(s => s.status === "connected").length;
  respond(true, { sources: result, connectedCount, totalCount: result.length });
};

// ── Research ─────────────────────────────────────────────────────────

/** Resolve the primary research directory (vault-first). */
function getResearchDir(): string {
  const { path } = resolveResearchDir();
  return path;
}
const RESEARCH_DIR_ALT = join(GODMODE_ROOT, "research");  // ~/godmode/research/ (legacy)

type ResearchFrontmatter = {
  title?: string;
  url?: string;
  category?: string;
  tags?: string[];
  date?: string;
  source?: string;
};

function parseFrontmatter(content: string): ResearchFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = match[1];
  const get = (key: string) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim();
  const getTags = (key: string): string[] => {
    const raw = fm.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m"))?.[1];
    return raw ? raw.split(",").map(t => t.trim().replace(/['"]/g, "")).filter(Boolean) : [];
  };
  return {
    title: get("title") || undefined,
    url: get("url") || undefined,
    category: get("category") || undefined,
    tags: getTags("tags"),
    date: get("date") || undefined,
    source: get("source") || undefined,
  };
}

type ResearchFileEntry = FileEntry & { frontmatter?: ResearchFrontmatter };

function listResearchEntries(dirPath: string): ResearchFileEntry[] {
  const entries = listEntries(dirPath);
  return entries.map((entry) => {
    if (entry.isDirectory) return entry;
    const content = safeReadFile(entry.path);
    const frontmatter = content ? parseFrontmatter(content) : null;
    return {
      ...entry,
      name: frontmatter?.title || entry.name,
      frontmatter: frontmatter ?? undefined,
    };
  });
}

/** Scan a single research directory, returning categories for root files + subdirectories. */
function scanResearchDir(
  dirPath: string,
  rootLabel: string,
  rootKey: string,
): { categories: ResearchCategory[]; count: number } {
  if (!existsSync(dirPath)) return { categories: [], count: 0 };
  const categories: ResearchCategory[] = [];
  let count = 0;

  try {
    const dirents = readdirSync(dirPath, { withFileTypes: true })
      .filter(e => !e.name.startsWith(".") && !e.name.startsWith("_"));

    // Root-level files
    const rootFiles = dirents.filter(e =>
      !e.isDirectory() && [".md", ".txt", ".json"].includes(extname(e.name)),
    );
    if (rootFiles.length > 0) {
      const entries = listResearchEntries(dirPath).filter(e => !e.isDirectory);
      categories.push({ key: rootKey, label: rootLabel, path: dirPath, entries });
      count += entries.length;
    }

    // Subdirectories become categories
    const subdirs = dirents.filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
    for (const dir of subdirs) {
      const subPath = join(dirPath, dir.name);
      const entries = listResearchEntries(subPath);
      const fileEntries = entries.filter(e => !e.isDirectory);
      if (entries.length > 0) {
        const label = dir.name.charAt(0).toUpperCase() + dir.name.slice(1).replace(/-/g, " ");
        categories.push({ key: `${rootKey}:${dir.name}`, label, path: subPath, entries });
        count += fileEntries.length;
      }
    }
  } catch { /* directory inaccessible — skip */ }

  return { categories, count };
}

/** Scan ~/godmode/*.html for standalone proposals and analysis docs. */
function scanHtmlDocs(): { entries: ResearchFileEntry[]; count: number } {
  const entries: ResearchFileEntry[] = [];
  try {
    const dirents = readdirSync(GODMODE_ROOT, { withFileTypes: true })
      .filter(e => !e.isDirectory() && extname(e.name) === ".html" && !e.name.startsWith("."));
    for (const d of dirents) {
      const filePath = join(GODMODE_ROOT, d.name);
      const st = statSync(filePath);
      const displayName = d.name
        .replace(/\.html$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
      entries.push({
        name: displayName,
        path: filePath,
        updatedAt: st.mtime.toISOString(),
        excerpt: `HTML document (${Math.round(st.size / 1024)} KB)`,
        size: st.size,
        isDirectory: false,
        frontmatter: { source: "html-doc" },
      });
    }
  } catch { /* skip */ }
  return { entries, count: entries.length };
}

type ResearchCategory = { key: string; label: string; path: string; entries: ResearchFileEntry[] };

const research: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { folder?: string };
  const folder = typeof p.folder === "string" ? p.folder.trim() : "";

  // Subfolder browsing
  if (folder) {
    if (!isAllowedPath(folder)) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory or vault" });
      return;
    }
    const entries = listResearchEntries(folder);
    respond(true, { folder, folderName: basename(folder), entries });
    return;
  }

  // Top-level: scan all research sources
  const categories: ResearchCategory[] = [];
  let totalEntries = 0;

  // 1. ~/godmode/memory/research/ — user-saved research (primary)
  const memRes = scanResearchDir(getResearchDir(), "Saved Research", "saved");
  categories.push(...memRes.categories);
  totalEntries += memRes.count;

  // 2. ~/godmode/research/ — analysis docs and reports
  const altRes = scanResearchDir(RESEARCH_DIR_ALT, "Analysis & Reports", "analysis");
  categories.push(...altRes.categories);
  totalEntries += altRes.count;

  // 3. ~/godmode/*.html — proposals and standalone docs
  const htmlDocs = scanHtmlDocs();
  if (htmlDocs.count > 0) {
    categories.push({
      key: "proposals",
      label: "Proposals & Docs",
      path: GODMODE_ROOT,
      entries: htmlDocs.entries,
    });
    totalEntries += htmlDocs.count;
  }

  respond(true, { categories, totalEntries });
};

function sanitizeSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const addResearch: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as {
    title?: string;
    url?: string;
    category?: string;
    tags?: string[];
    notes?: string;
    source?: string;
  };

  const title = typeof p.title === "string" ? p.title.trim() : "";
  if (!title) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Title is required" });
    return;
  }

  const category = typeof p.category === "string" ? sanitizeSlug(p.category) : "";
  const researchDir = getResearchDir();
  const targetDir = category ? join(researchDir, category) : researchDir;
  if (!isAllowedPath(targetDir)) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Target path is outside allowed directory" });
    return;
  }
  await mkdir(targetDir, { recursive: true });

  // Generate filename, handle collisions
  const baseSlug = sanitizeSlug(title);
  let filename = `${baseSlug}.md`;
  let filePath = join(targetDir, filename);
  let suffix = 2;
  while (existsSync(filePath)) {
    filename = `${baseSlug}-${suffix}.md`;
    filePath = join(targetDir, filename);
    suffix++;
  }

  // Build YAML frontmatter
  const today = new Date().toISOString().slice(0, 10);
  const tags = Array.isArray(p.tags) ? p.tags.filter(t => typeof t === "string" && t.trim()) : [];
  const source = typeof p.source === "string" ? p.source : "manual";
  const url = typeof p.url === "string" ? p.url.trim() : "";
  const notes = typeof p.notes === "string" ? p.notes : "";

  const lines = ["---", `title: ${title}`];
  if (url) lines.push(`url: ${url}`);
  if (category) lines.push(`category: ${category}`);
  if (tags.length > 0) lines.push(`tags: [${tags.join(", ")}]`);
  lines.push(`date: ${today}`);
  lines.push(`source: ${source}`);
  lines.push("---", "");
  if (notes) lines.push(notes);

  await writeFile(filePath, lines.join("\n"), "utf-8");
  respond(true, { ok: true, path: filePath, category: category || null });
};

const researchCategories: GatewayRequestHandler = async ({ respond }) => {
  const cats = new Set<string>();
  for (const dir of [getResearchDir(), RESEARCH_DIR_ALT]) {
    if (!existsSync(dir)) continue;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_")) {
          cats.add(e.name);
        }
      }
    } catch { /* skip */ }
  }
  respond(true, { categories: [...cats].sort() });
};

// ── Community Resources ──────────────────────────────────────────────

const COMMUNITY_RESOURCES_FILE = join(DATA_DIR, "community-resources.json");

type CommunityResource = {
  id: string;
  url: string;
  label: string;
  description: string;
  tags: string[];
  addedAt: number;
};

type CommunityResourcesData = {
  version: 1;
  resources: CommunityResource[];
};

const SEED_RESOURCES: CommunityResource[] = [
  {
    id: "hesamsheikh/awesome-openclaw-usecases",
    url: "https://github.com/hesamsheikh/awesome-openclaw-usecases",
    label: "Awesome OpenClaw Use Cases",
    description: "Community collection of 34+ OpenClaw use cases — productivity, creative, devops, research, finance, and more.",
    tags: ["use-cases", "prompts", "workflows", "community"],
    addedAt: Date.now(),
  },
];

async function readCommunityResources(): Promise<CommunityResourcesData> {
  try {
    const raw = await readFile(COMMUNITY_RESOURCES_FILE, "utf-8");
    return JSON.parse(raw) as CommunityResourcesData;
  } catch {
    // First access — seed with defaults
    const data: CommunityResourcesData = { version: 1, resources: SEED_RESOURCES };
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(COMMUNITY_RESOURCES_FILE, JSON.stringify(data, null, 2) + "\n");
    return data;
  }
}

async function writeCommunityResources(data: CommunityResourcesData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(COMMUNITY_RESOURCES_FILE, JSON.stringify(data, null, 2) + "\n");
}

const communityResourcesList: GatewayRequestHandler = async ({ respond }) => {
  try {
    const data = await readCommunityResources();
    respond(true, { resources: data.resources, count: data.resources.length });
  } catch (err) {
    respond(false, undefined, {
      code: "COMMUNITY_RESOURCES_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const communityResourcesAdd: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { url?: string; label?: string; description?: string; tags?: string[] };
  const url = typeof p.url === "string" ? p.url.trim() : "";
  if (!url) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "url is required" });
    return;
  }
  const label = typeof p.label === "string" ? p.label.trim() : url.split("/").slice(-2).join("/");
  const description = typeof p.description === "string" ? p.description.trim() : "";
  const tags = Array.isArray(p.tags) ? p.tags.filter(t => typeof t === "string" && t.trim()) : [];

  // Derive ID from URL (owner/repo for GitHub, or full URL)
  const ghMatch = url.match(/github\.com\/([^/]+\/[^/]+)/);
  const id = ghMatch ? ghMatch[1] : url;

  try {
    const data = await readCommunityResources();
    if (data.resources.some(r => r.id === id)) {
      respond(false, undefined, { code: "DUPLICATE", message: `Resource already exists: ${id}` });
      return;
    }
    data.resources.push({ id, url, label, description, tags, addedAt: Date.now() });
    await writeCommunityResources(data);
    respond(true, { ok: true, id, count: data.resources.length });
  } catch (err) {
    respond(false, undefined, {
      code: "COMMUNITY_RESOURCES_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const communityResourcesRemove: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id || typeof id !== "string") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  try {
    const data = await readCommunityResources();
    const before = data.resources.length;
    data.resources = data.resources.filter(r => r.id !== id);
    if (data.resources.length === before) {
      respond(false, undefined, { code: "NOT_FOUND", message: `Resource not found: ${id}` });
      return;
    }
    await writeCommunityResources(data);
    respond(true, { ok: true, removed: id, count: data.resources.length });
  } catch (err) {
    respond(false, undefined, {
      code: "COMMUNITY_RESOURCES_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── File Tree ────────────────────────────────────────────────────────

type BrainTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  size?: number;
  updatedAt?: string;
  childCount?: number;
  children?: BrainTreeNode[];
};

const TREE_SKIP = new Set(["node_modules", "__pycache__", "venv", ".git", "dist", "build"]);
const TREE_EXTENSIONS = new Set([".md", ".txt", ".json", ".json5", ".yaml", ".yml", ".html", ".htm", ".csv", ".pdf"]);

function buildFileTree(dirPath: string, currentDepth: number, maxDepth: number): BrainTreeNode[] {
  if (currentDepth >= maxDepth) return [];
  let entries: import("node:fs").Dirent[];
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: BrainTreeNode[] = [];
  const filtered = entries
    .filter(e => !e.name.startsWith(".") && !e.name.startsWith("_") && !TREE_SKIP.has(e.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  for (const entry of filtered) {
    const fullPath = join(dirPath, entry.name);
    if (!isSymlinkSafe(fullPath)) continue;
    if (entry.isDirectory()) {
      let childCount = 0;
      try {
        childCount = readdirSync(fullPath).filter(f => !f.startsWith(".") && !f.startsWith("_")).length;
      } catch { /* empty */ }
      const children = currentDepth + 1 < maxDepth ? buildFileTree(fullPath, currentDepth + 1, maxDepth) : undefined;
      nodes.push({
        name: entry.name,
        path: relative(GODMODE_ROOT, fullPath),
        type: "folder",
        childCount,
        children,
      });
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (!TREE_EXTENSIONS.has(ext)) continue;
      try {
        const st = statSync(fullPath);
        nodes.push({
          name: entry.name,
          path: relative(GODMODE_ROOT, fullPath),
          type: "file",
          size: st.size,
          updatedAt: st.mtime.toISOString(),
        });
      } catch { /* skip unreadable */ }
    }
  }

  return nodes;
}

const fileTree: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { root?: string; depth?: number };
  const maxDepth = typeof p.depth === "number" ? Math.min(Math.max(p.depth, 1), 5) : 3;

  // Validate root is within GODMODE_ROOT or vault
  let rootPath = MEMORY_DIR;
  if (typeof p.root === "string" && p.root.trim()) {
    const candidate = p.root.startsWith("/") ? p.root : join(GODMODE_ROOT, p.root);
    if (!isAllowedPath(candidate)) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "Root must be within godmode directory or vault" });
      return;
    }
    rootPath = candidate;
  }

  const tree = buildFileTree(rootPath, 0, maxDepth);
  respond(true, {
    root: relative(GODMODE_ROOT, rootPath) || ".",
    rootAbsolute: rootPath,
    tree,
    nodeCount: countNodes(tree),
  });
};

function countNodes(nodes: BrainTreeNode[]): number {
  let count = nodes.length;
  for (const n of nodes) {
    if (n.children) count += countNodes(n.children);
  }
  return count;
}

// ── QMD Query Helper ──────────────────────────────────────────────────

const execFileAsync = promisify(execFile);

type QmdJsonResult = {
  docid: string;
  score: number;
  file: string;
  title: string;
  snippet: string;
};

/** Parse ~/.config/qmd/index.yml → Map<collectionName, fsRoot>. */
function buildQmdCollectionMap(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const raw = readFileSync(join(homedir(), ".config", "qmd", "index.yml"), "utf-8");
    for (const m of raw.matchAll(/^  ([\w-]+):\n    path:\s*(.+)$/gm)) {
      map.set(m[1], m[2].trim());
    }
  } catch { /* config missing or unreadable — qmd unavailable */ }
  return map;
}

/** Convert qmd://collection/relative → absolute fs path. */
function qmdUriToFsPath(uri: string, collMap: Map<string, string>): string | null {
  const m = uri.match(/^qmd:\/\/([\w-]+)\/(.+)$/);
  if (!m) return null;
  const root = collMap.get(m[1]);
  return root ? join(root, m[2]) : null;
}

/** Strip the @@ diff header from qmd snippet output. */
function cleanQmdSnippet(snippet: string): string {
  return snippet.replace(/^@@[^\n]*\n/, "").trim();
}

/**
 * Run `qmd search` (BM25 full-text) as the primary path.
 * `qmd query` (hybrid + reranking) is disabled until the local embedding model
 * context-size crash is resolved (embeddinggemma-300M chokes on long docs,
 * causing native GPU OOM that eats the full 15s timeout before falling back).
 * Throws if qmd is not installed.
 */
async function runQmdSearch(
  query: string,
  collection: string | null,
  limit: number,
): Promise<QmdJsonResult[]> {
  const baseArgs = ["-n", String(Math.min(limit, 50)), "--json"];
  if (collection) baseArgs.push("-c", collection);

  const { stdout } = await execFileAsync("qmd", ["search", query, ...baseArgs], {
    timeout: 10_000,
  });
  return JSON.parse(stdout) as QmdJsonResult[];
}

// ── Brain Search ─────────────────────────────────────────────────────

const brainSearch: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { query?: string; scope?: string; limit?: number };
  const query = typeof p.query === "string" ? p.query.trim() : "";
  const scope = typeof p.scope === "string" ? p.scope.trim() : "all";
  const limit = typeof p.limit === "number" ? Math.min(p.limit, 100) : 50;

  if (!query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "query is required" });
    return;
  }

  type SearchResult = {
    path: string;
    name: string;
    section: string;
    excerpt: string;
    matchContext?: string;
    updatedAt?: string;
    score?: number;
  };

  // ── Try qmd hybrid search (query expansion + reranking) ─────────────
  const qmdStart = Date.now();
  try {
    // scope → collection: "sessions" → sessions-main, "all" → no filter, rest → clawvault-main
    const collection =
      scope === "sessions" ? "sessions-main" :
      scope === "all" ? null :
      "clawvault-main";

    const qmdResults = await runQmdSearch(query, collection, limit);
    const collMap = buildQmdCollectionMap();

    const results: SearchResult[] = qmdResults
      .map((r): SearchResult | null => {
        const fsPath = qmdUriToFsPath(r.file, collMap);
        if (!fsPath) return null;
        let updatedAt: string | undefined;
        try { updatedAt = statSync(fsPath).mtime.toISOString(); } catch { /* skip */ }
        const ext = extname(fsPath);
        const collMatch = r.file.match(/^qmd:\/\/([\w-]+)\//);
        return {
          path: relative(GODMODE_ROOT, fsPath),
          name: basename(fsPath, ext),
          section: collMatch?.[1] ?? "vault",
          excerpt: "",
          matchContext: cleanQmdSnippet(r.snippet),
          updatedAt,
          score: r.score,
        };
      })
      .filter((r): r is SearchResult => r !== null);

    // Retrieval trajectory logging
    try {
      const { logRetrieval } = await import("../lib/retrieval-log.js");
      logRetrieval({
        ts: new Date().toISOString(),
        source: "qmd",
        query,
        resultCount: results.length,
        topScore: qmdResults[0]?.score ?? null,
        topResults: results.slice(0, 3).map((r) => ({
          snippet: (r.matchContext ?? r.name).slice(0, 120),
          score: r.score,
        })),
        elapsedMs: Date.now() - qmdStart,
        injected: true,
        scope: collection ?? "all",
      });
    } catch { /* logging non-fatal */ }

    respond(true, { results, query, total: results.length, source: "qmd" });
    return;
  } catch {
    // qmd not installed, timed out, or both query+search failed — fall through to file walk
  }

  // ── Fallback: file walk ───────────────────────────────────────────────

  // Determine which directories to search (vault-first)
  const searchDirs: Array<{ dir: string; label: string }> = [];
  if (scope === "all" || scope === "research") {
    searchDirs.push({ dir: getResearchDir(), label: "research" });
    if (existsSync(join(GODMODE_ROOT, "research"))) {
      searchDirs.push({ dir: join(GODMODE_ROOT, "research"), label: "analysis" });
    }
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
    // Also search identity and knowledge
    const vault = getVaultPath();
    if (vault) {
      searchDirs.push({ dir: join(vault, VAULT_FOLDERS.identity), label: "identity" });
      searchDirs.push({ dir: join(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge), label: "knowledge" });
    } else {
      searchDirs.push({ dir: MEMORY_DIR, label: "memory" });
    }
  }

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  function searchDir(dirPath: string, section: string, depth: number) {
    if (depth > 4 || results.length >= limit) return;
    let entries: import("node:fs").Dirent[];
    try {
      entries = readdirSync(dirPath, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      if (results.length >= limit) break;
      if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
      const fullPath = join(dirPath, entry.name);
      if (!isSymlinkSafe(fullPath)) continue;

      if (entry.isDirectory()) {
        if (!TREE_SKIP.has(entry.name)) {
          searchDir(fullPath, section, depth + 1);
        }
        continue;
      }

      const ext = extname(entry.name).toLowerCase();
      if (![".md", ".txt", ".json", ".html"].includes(ext)) continue;

      const nameMatch = entry.name.toLowerCase().includes(q);
      let contentMatch = false;
      let matchContext: string | undefined;

      // Only read file content for text search if name doesn't match (perf optimization)
      if (!nameMatch) {
        try {
          if (!isSymlinkSafe(fullPath)) continue;
          const content = readFileSync(fullPath, "utf-8");
          if (content.length > 64_000) continue; // skip huge files
          const lc = content.toLowerCase();
          const idx = lc.indexOf(q);
          if (idx >= 0) {
            contentMatch = true;
            const start = Math.max(0, idx - 60);
            const end = Math.min(content.length, idx + query.length + 60);
            matchContext =
              (start > 0 ? "..." : "") +
              content.slice(start, end).replace(/\n/g, " ") +
              (end < content.length ? "..." : "");
          }
        } catch { continue; }
      }

      if (nameMatch || contentMatch) {
        const relativePath = relative(GODMODE_ROOT, fullPath);
        let updatedAt: string | undefined;
        try { updatedAt = statSync(fullPath).mtime.toISOString(); } catch { /* skip */ }

        const displayName = basename(entry.name, ext);
        const excerpt = nameMatch && !matchContext
          ? extractExcerpt(safeReadFile(fullPath) ?? "")
          : "";

        results.push({
          path: relativePath,
          name: displayName,
          section,
          excerpt,
          matchContext,
          updatedAt,
        });
      }
    }
  }

  for (const { dir, label } of searchDirs) {
    if (results.length >= limit) break;
    searchDir(dir, label, 0);
  }

  // Retrieval trajectory logging — file walk fallback
  try {
    const { logRetrieval } = await import("../lib/retrieval-log.js");
    logRetrieval({
      ts: new Date().toISOString(),
      source: "file-walk",
      query,
      resultCount: results.length,
      topScore: null,
      topResults: results.slice(0, 3).map((r) => ({
        snippet: (r.matchContext ?? r.name).slice(0, 120),
      })),
      elapsedMs: Date.now() - qmdStart,
      injected: true,
      scope: scope ?? "all",
      emptyReason: results.length === 0 ? "no matches in file walk" : undefined,
    });
  } catch { /* logging non-fatal */ }

  respond(true, { results, query, total: results.length });
};

// ── Consolidate Research ─────────────────────────────────────────────

const consolidateResearch: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { execute?: boolean };
  const dryRun = !p.execute;

  type MoveAction = { source: string; destination: string; reason: string };
  const actions: MoveAction[] = [];

  // 1. Scan ~/godmode/research/* -> ~/godmode/memory/research/*
  const altDir = join(GODMODE_ROOT, "research");
  if (existsSync(altDir)) {
    try {
      const walk = (dir: string, relativeBase: string) => {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.name.startsWith(".")) continue;
          const srcPath = join(dir, e.name);
          const relPath = relativeBase ? `${relativeBase}/${e.name}` : e.name;
          if (e.isDirectory()) {
            walk(srcPath, relPath);
          } else {
            const destPath = join(getResearchDir(), relPath);
            if (!existsSync(destPath)) {
              actions.push({
                source: relative(GODMODE_ROOT, srcPath),
                destination: relative(GODMODE_ROOT, destPath),
                reason: "Move from ~/godmode/research/ to canonical location",
              });
            }
          }
        }
      };
      walk(altDir, "");
    } catch { /* skip inaccessible */ }
  }

  // 2. Scan ~/godmode/*.html -> ~/godmode/memory/research/proposals/*
  try {
    const rootEntries = readdirSync(GODMODE_ROOT, { withFileTypes: true });
    for (const e of rootEntries) {
      if (e.isDirectory() || !e.name.endsWith(".html") || e.name.startsWith(".")) continue;
      const srcPath = join(GODMODE_ROOT, e.name);
      const destPath = join(getResearchDir(), "proposals", e.name);
      if (!existsSync(destPath)) {
        actions.push({
          source: relative(GODMODE_ROOT, srcPath),
          destination: relative(GODMODE_ROOT, destPath),
          reason: "Move HTML doc to research/proposals/",
        });
      }
    }
  } catch { /* skip */ }

  // Execute if not dry run
  if (!dryRun && actions.length > 0) {
    for (const action of actions) {
      const src = join(GODMODE_ROOT, action.source);
      const dest = join(GODMODE_ROOT, action.destination);
      try {
        if (!isAllowedPath(src) || !isAllowedPath(dest)) continue;
        if (!isSymlinkSafe(src)) continue;
        const destDir = dest.substring(0, dest.lastIndexOf("/"));
        await mkdir(destDir, { recursive: true });
        // Copy instead of move to be safe
        const content = await readFile(src);
        await writeFile(dest, content);
      } catch { /* skip individual failures */ }
    }
  }

  respond(true, {
    actions,
    executed: !dryRun,
    count: actions.length,
    message: dryRun
      ? `Found ${actions.length} files to consolidate. Call with execute: true to move them.`
      : `Consolidated ${actions.length} files to canonical research location.`,
  });
};

// ── Vault Health ──────────────────────────────────────────────────────

const vaultHealth: GatewayRequestHandler = async ({ respond }) => {
  const vault = getVaultPath();
  const health = getVaultHealth();
  const manifest = await (await import("../lib/vault-paths.js")).readVaultManifest();

  if (!vault || !health) {
    respond(true, {
      available: false,
      vaultPath: null,
      migrated: false,
      stats: null,
      recentActivity: [],
    });
    return;
  }

  // Gather recent activity (last 10 modified .md files across vault)
  const recentActivity: Array<{ name: string; path: string; updatedAt: string; folder: string }> = [];
  const foldersToScan = [
    VAULT_FOLDERS.inbox,
    VAULT_FOLDERS.daily,
    VAULT_FOLDERS.brain,
    VAULT_FOLDERS.discoveries,
    VAULT_FOLDERS.resources,
    VAULT_FOLDERS.projects,
    VAULT_FOLDERS.identity,
  ];

  for (const folder of foldersToScan) {
    const dirPath = join(vault, folder);
    if (!existsSync(dirPath)) continue;
    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });
      for (const e of entries) {
        if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
        const full = join(dirPath, e.name);
        if (e.isDirectory()) {
          // One level deep for subdirs (People/, Companies/, etc.)
          try {
            const subs = readdirSync(full, { withFileTypes: true });
            for (const s of subs) {
              if (s.name.startsWith(".") || !s.name.endsWith(".md")) continue;
              const subFull = join(full, s.name);
              try {
                const st = statSync(subFull);
                recentActivity.push({
                  name: basename(s.name, ".md"),
                  path: subFull,
                  updatedAt: st.mtime.toISOString(),
                  folder: `${folder}/${e.name}`,
                });
              } catch { /* skip */ }
            }
          } catch { /* skip */ }
        } else if (e.name.endsWith(".md")) {
          try {
            const st = statSync(full);
            recentActivity.push({
              name: basename(e.name, ".md"),
              path: full,
              updatedAt: st.mtime.toISOString(),
              folder,
            });
          } catch { /* skip */ }
        }
      }
    } catch { /* skip */ }
  }

  // Sort by most recent, take top 10
  recentActivity.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const topRecent = recentActivity.slice(0, 10);

  respond(true, {
    available: true,
    vaultPath: vault,
    migrated: manifest?.migratedAt !== null && manifest?.migratedAt !== undefined,
    stats: health,
    recentActivity: topRecent,
  });
};

// ── Inbox Items ──────────────────────────────────────────────────────

const inboxItems: GatewayRequestHandler = async ({ respond }) => {
  const inboxPath = resolveInboxPath();
  if (!inboxPath || !existsSync(inboxPath)) {
    respond(true, { items: [], count: 0, available: isVaultAvailable() });
    return;
  }

  const items: Array<{
    name: string;
    path: string;
    updatedAt: string | null;
    excerpt: string;
    source?: string;
  }> = [];

  try {
    const entries = readdirSync(inboxPath, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name.startsWith("_") || e.isDirectory()) continue;
      if (!e.name.endsWith(".md") && !e.name.endsWith(".txt")) continue;
      const fullPath = join(inboxPath, e.name);
      const content = safeReadFile(fullPath);
      const frontmatter = content ? parseFrontmatter(content) : null;
      items.push({
        name: frontmatter?.title || basename(e.name, extname(e.name)),
        path: fullPath,
        updatedAt: safeFileMtime(fullPath),
        excerpt: content ? extractExcerpt(content) : "",
        source: frontmatter?.source,
      });
    }
  } catch { /* skip */ }

  items.sort((a, b) => {
    if (!a.updatedAt || !b.updatedAt) return 0;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  respond(true, { items, count: items.length, available: true });
};

// ── Migrate to Vault ─────────────────────────────────────────────────

const migrateToVaultRpc: GatewayRequestHandler = async ({ respond }) => {
  if (!isVaultAvailable()) {
    respond(false, undefined, {
      code: "VAULT_UNAVAILABLE",
      message: "Obsidian vault not found. Set OBSIDIAN_VAULT_PATH or ensure ~/Documents/VAULT exists.",
    });
    return;
  }

  try {
    const result = await migrateToVault();
    respond(true, {
      ok: result.ok,
      copied: result.copied,
      skipped: result.skipped,
      errors: result.errors,
      summary: result.summary,
      message: result.copied > 0
        ? `Migrated ${result.copied} files to vault (${result.skipped} already existed)`
        : `All files already in vault (${result.skipped} skipped)`,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "MIGRATION_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Obsidian Sync Status ─────────────────────────────────────────────

const obsidianSyncStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { getObsidianSync } = await import("../services/obsidian-sync.js");
    const sync = getObsidianSync();
    if (!sync) {
      respond(true, {
        available: false,
        running: false,
        linked: false,
        lastSync: null,
        lastError: null,
        vaultPath: getVaultPath(),
        mode: "disabled",
      });
      return;
    }
    const status = await sync.getStatus();
    respond(true, status);
  } catch (err) {
    respond(false, undefined, {
      code: "SYNC_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const obsidianSyncTrigger: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { getObsidianSync } = await import("../services/obsidian-sync.js");
    const sync = getObsidianSync();
    if (!sync) {
      respond(false, undefined, {
        code: "SYNC_NOT_AVAILABLE",
        message: "Obsidian Sync service not initialized. Install: npm install -g obsidian-headless",
      });
      return;
    }
    const result = await sync.syncOnce();
    respond(true, result);
  } catch (err) {
    respond(false, undefined, {
      code: "SYNC_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const obsidianSyncSetMode: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { mode?: string };
  const mode = p.mode;
  if (mode !== "continuous" && mode !== "manual" && mode !== "disabled") {
    respond(false, undefined, {
      code: "INVALID_MODE",
      message: "Mode must be 'continuous', 'manual', or 'disabled'",
    });
    return;
  }

  try {
    const { getObsidianSync } = await import("../services/obsidian-sync.js");
    const sync = getObsidianSync();
    if (!sync) {
      respond(false, undefined, {
        code: "SYNC_NOT_AVAILABLE",
        message: "Obsidian Sync service not initialized",
      });
      return;
    }
    await sync.setMode(mode);
    const status = await sync.getStatus();
    respond(true, status);
  } catch (err) {
    respond(false, undefined, {
      code: "SYNC_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Vault Capture Status ─────────────────────────────────────────────

const vaultCaptureStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    const statePath = join(DATA_DIR, "vault-capture-state.json");
    let state: { capturedSessionPaths?: string[]; lastRun?: string } = {};
    try {
      const raw = readFileSync(statePath, "utf-8");
      state = JSON.parse(raw);
    } catch { /* first run */ }

    respond(true, {
      lastRun: state.lastRun || null,
      sessionsCaptured: (state.capturedSessionPaths ?? []).length,
      pipelines: {
        sessionsToDailyNotes: true,
        queueOutputsToVault: true,
      },
    });
  } catch (err) {
    respond(false, undefined, {
      code: "CAPTURE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const vaultCaptureRunNow: GatewayRequestHandler = async ({ respond }) => {
  // REMOVED (v2 slim): vault-capture — obsidian-sync stays
  respond(true, {
    totalCaptured: 0,
    sessions: 0,
    queueOutputs: 0,
    note: "Vault capture removed in v2 slim. Obsidian sync remains active.",
  });
};

// ── Export ────────────────────────────────────────────────────────────

export const secondBrainHandlers: GatewayRequestHandlers = {
  "secondBrain.identity": identity,
  "secondBrain.memoryBank": memoryBank,
  "secondBrain.memoryBankEntry": memoryBankEntry,
  "secondBrain.aiPacket": aiPacket,
  "secondBrain.sync": sync,
  "secondBrain.sources": sources,
  "secondBrain.research": research,
  "secondBrain.addResearch": addResearch,
  "secondBrain.researchCategories": researchCategories,
  "secondBrain.communityResources": communityResourcesList,
  "secondBrain.communityResourcesAdd": communityResourcesAdd,
  "secondBrain.communityResourcesRemove": communityResourcesRemove,
  "secondBrain.fileTree": fileTree,
  "secondBrain.search": brainSearch,
  "secondBrain.consolidateResearch": consolidateResearch,
  "secondBrain.vaultHealth": vaultHealth,
  "secondBrain.inboxItems": inboxItems,
  "secondBrain.migrateToVault": migrateToVaultRpc,
  "secondBrain.obsidianSyncStatus": obsidianSyncStatus,
  "secondBrain.obsidianSyncTrigger": obsidianSyncTrigger,
  "secondBrain.obsidianSyncSetMode": obsidianSyncSetMode,
  "secondBrain.captureStatus": vaultCaptureStatus,
  "secondBrain.captureRunNow": vaultCaptureRunNow,
};
