/**
 * GodMode — CoreTex
 *
 * Read-only window into the user's accumulated AI context.
 * Reads from ~/godmode/memory/ and ~/godmode/ files.
 *
 * RPC methods:
 *   coretex.identity        — USER.md, SOUL.md, VISION.md, opinions.md, THESIS.md
 *   coretex.memoryBank      — file/folder listings from bank/, projects/
 *   coretex.memoryBankEntry — single file content
 *   coretex.aiPacket        — CONSCIOUSNESS.md + WORKING.md
 *   coretex.sync            — trigger consciousness-sync.sh
 */

import { exec as nodeExec } from "node:child_process";
import {
  accessSync,
  constants as fsConstants,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Helpers ──────────────────────────────────────────────────────────

function safeReadFile(filePath: string): string | null {
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeFileMtime(filePath: string): string | null {
  try {
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

const IDENTITY_FILES: Array<{ key: string; label: string; filename: string; dir: "root" | "memory" }> = [
  { key: "user", label: "Profile", filename: "USER.md", dir: "root" },
  { key: "soul", label: "Soul", filename: "SOUL.md", dir: "root" },
  { key: "vision", label: "Vision", filename: "VISION.md", dir: "root" },
  { key: "identity", label: "Identity", filename: "IDENTITY.md", dir: "root" },
  { key: "principles", label: "Principles", filename: "PRINCIPLES.md", dir: "root" },
  { key: "thesis", label: "Thesis", filename: "THESIS.md", dir: "memory" },
  { key: "opinions", label: "Opinions & Rules", filename: "bank/opinions.md", dir: "memory" },
];

const identity: GatewayRequestHandler = async ({ respond }) => {
  const files: IdentityFile[] = [];
  for (const spec of IDENTITY_FILES) {
    const filePath = spec.dir === "root"
      ? join(GODMODE_ROOT, spec.filename)
      : join(MEMORY_DIR, spec.filename);
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

  // Check for Identity OS dashboard
  const identityOsDashboard = join(MEMORY_DIR, "projects", "identity-os", "final", "dashboard", "index.html");
  const identityOsExists = existsSync(identityOsDashboard);

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
    // Security: must be under GODMODE_ROOT
    if (!folder.startsWith(GODMODE_ROOT)) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory" });
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

  // Top-level: list all sections
  const peoplePath = join(MEMORY_DIR, "bank", "people");
  const companiesPath = join(MEMORY_DIR, "bank", "companies");
  const projectsPath = join(MEMORY_DIR, "projects");

  const people = listEntries(peoplePath);
  const companies = listEntries(companiesPath);
  const projects = listEntries(projectsPath);

  // Curated facts
  const curatedPath = join(MEMORY_DIR, "curated.md");
  const curated = safeReadFile(curatedPath);

  // Extra toplevel memory files
  const extraFiles: FileEntry[] = [];
  const EXTRA_MEMORY_FILES = ["tacit.md", "topics.md", "golden-rules-definitions.md", "known-issues.md"];
  for (const f of EXTRA_MEMORY_FILES) {
    const fp = join(MEMORY_DIR, f);
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
  const resolved = join(filePath);
  if (!resolved.startsWith(GODMODE_ROOT)) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory" });
    return;
  }
  const content = safeReadFile(resolved);
  if (content === null) {
    respond(false, undefined, { code: "NOT_FOUND", message: `File not found: ${basename(filePath)}` });
    return;
  }
  respond(true, {
    name: basename(filePath, extname(filePath)),
    content,
    updatedAt: safeFileMtime(resolved),
    relativePath: relative(GODMODE_ROOT, resolved),
  });
};

// ── AI Packet ────────────────────────────────────────────────────────

const aiPacket: GatewayRequestHandler = async ({ respond }) => {
  const consciousnessPath = join(MEMORY_DIR, "CONSCIOUSNESS.md");
  const workingPath = join(MEMORY_DIR, "WORKING.md");

  const consciousness = safeReadFile(consciousnessPath);
  const working = safeReadFile(workingPath);

  respond(true, {
    consciousness: consciousness
      ? { content: consciousness, updatedAt: safeFileMtime(consciousnessPath), lineCount: consciousness.split("\n").length }
      : null,
    working: working
      ? { content: working, updatedAt: safeFileMtime(workingPath), lineCount: working.split("\n").length }
      : null,
  });
};

// ── Sync ─────────────────────────────────────────────────────────────

const CONSCIOUSNESS_SCRIPT = join(GODMODE_ROOT, "scripts", "consciousness-sync.sh");
const EXEC_TIMEOUT_MS = 90_000;

const sync: GatewayRequestHandler = async ({ respond, context }) => {
  if (!existsSync(CONSCIOUSNESS_SCRIPT)) {
    respond(false, undefined, { code: "NOT_FOUND", message: "consciousness-sync.sh not found" });
    return;
  }
  try {
    accessSync(CONSCIOUSNESS_SCRIPT, fsConstants.R_OK | fsConstants.X_OK);
  } catch {
    respond(false, undefined, { code: "UNAVAILABLE", message: "consciousness-sync.sh is not readable/executable" });
    return;
  }

  context?.broadcast?.("coretex:sync-status", { status: "syncing" }, { dropIfSlow: true });

  try {
    const childEnv = { ...process.env, HOME: process.env.HOME } as Record<string, string | undefined>;
    delete childEnv.CLAUDECODE;

    const { stdout } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      nodeExec(
        `bash "${CONSCIOUSNESS_SCRIPT}"`,
        { timeout: EXEC_TIMEOUT_MS, env: childEnv },
        (err, stdout, stderr) => {
          if (err) { reject(new Error(`Script failed: ${stderr || err.message}`)); return; }
          resolve({ stdout, stderr });
        },
      );
    });

    const consciousnessPath = join(MEMORY_DIR, "CONSCIOUSNESS.md");
    const workingPath = join(MEMORY_DIR, "WORKING.md");
    const consciousness = safeReadFile(consciousnessPath);
    const working = safeReadFile(workingPath);

    context?.broadcast?.(
      "coretex:sync-status",
      { status: "ok", updatedAt: new Date().toISOString() },
      { dropIfSlow: true },
    );

    respond(true, {
      ok: true,
      message: stdout.trim() || "Consciousness synced",
      consciousness: consciousness
        ? { content: consciousness, updatedAt: safeFileMtime(consciousnessPath), lineCount: consciousness.split("\n").length }
        : null,
      working: working
        ? { content: working, updatedAt: safeFileMtime(workingPath), lineCount: working.split("\n").length }
        : null,
    });
  } catch (err) {
    context?.broadcast?.(
      "coretex:sync-status",
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
  status: "connected" | "available" | "coming-soon";
  icon: string;
  description: string;
  stats?: string;
  lastSync?: string | null;
};

/** All sources that CoreTex knows about. Connected ones are populated from data-sources.json + filesystem probes. */
const KNOWN_SOURCES: Array<{
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  detect: () => { connected: boolean; stats?: string; lastSync?: string | null };
}> = [
  {
    id: "memory-bank",
    name: "Memory Bank",
    type: "memory",
    icon: "\u{1F9E0}",
    description: "People, companies, projects, and curated facts",
    detect: () => {
      const peoplePath = join(MEMORY_DIR, "bank", "people");
      const companiesPath = join(MEMORY_DIR, "bank", "companies");
      const projectsPath = join(MEMORY_DIR, "projects");
      let people = 0, companies = 0, projects = 0;
      try { people = readdirSync(peoplePath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      try { companies = readdirSync(companiesPath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      try { projects = readdirSync(projectsPath).filter(f => !f.startsWith(".")).length; } catch { /* empty */ }
      const total = people + companies + projects;
      return {
        connected: total > 0,
        stats: total > 0 ? `${people} people, ${companies} companies, ${projects} projects` : undefined,
        lastSync: safeFileMtime(join(MEMORY_DIR, "bank")),
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
    name: "Consciousness",
    type: "ai-context",
    icon: "\u{26A1}",
    description: "Live AI context injection — CONSCIOUSNESS.md + WORKING.md",
    detect: () => {
      const cp = join(MEMORY_DIR, "CONSCIOUSNESS.md");
      const content = safeReadFile(cp);
      return {
        connected: content !== null,
        stats: content ? `${content.split("\n").length} lines` : undefined,
        lastSync: safeFileMtime(cp),
      };
    },
  },
  {
    id: "obsidian",
    name: "Obsidian Vault",
    type: "notes",
    icon: "\u{1F4D3}",
    description: "Your second brain — daily notes, projects, references",
    detect: () => {
      const vaultPath = process.env.OBSIDIAN_VAULT_PATH || join(require("node:os").homedir(), "Documents", "VAULT");
      try {
        if (existsSync(vaultPath) && statSync(vaultPath).isDirectory()) {
          return { connected: true, stats: "Local vault linked", lastSync: safeFileMtime(vaultPath) };
        }
      } catch { /* empty */ }
      return { connected: false };
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

/** Future sources that aren't available yet */
const FUTURE_SOURCES: SourceEntry[] = [
  { id: "apple-notes", name: "Apple Notes", type: "notes", status: "coming-soon", icon: "\u{1F34E}", description: "Notes and quick captures from iOS/macOS" },
  { id: "google-drive", name: "Google Drive", type: "documents", status: "coming-soon", icon: "\u{1F4C1}", description: "Documents, spreadsheets, and shared files" },
  { id: "photos", name: "Photos", type: "media", status: "coming-soon", icon: "\u{1F4F8}", description: "Photo metadata, locations, and memories" },
  { id: "apple-health", name: "Apple Health", type: "health", status: "coming-soon", icon: "\u{1F3CB}\u{FE0F}", description: "Activity, workouts, and health trends" },
  { id: "gmail", name: "Gmail", type: "email", status: "coming-soon", icon: "\u{2709}\u{FE0F}", description: "Personal email archive and threads" },
];

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

  // 3. Future sources
  for (const fs of FUTURE_SOURCES) {
    if (!seenIds.has(fs.id)) {
      result.push(fs);
    }
  }

  const connectedCount = result.filter(s => s.status === "connected").length;
  respond(true, { sources: result, connectedCount, totalCount: result.length });
};

// ── Research ─────────────────────────────────────────────────────────

const RESEARCH_DIR = join(MEMORY_DIR, "research");
const RESEARCH_DIR_ALT = join(GODMODE_ROOT, "research");  // ~/godmode/research/

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
    if (!folder.startsWith(GODMODE_ROOT)) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "Path must be within godmode directory" });
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
  const memRes = scanResearchDir(RESEARCH_DIR, "Saved Research", "saved");
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
  const targetDir = category ? join(RESEARCH_DIR, category) : RESEARCH_DIR;
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
  for (const dir of [RESEARCH_DIR, RESEARCH_DIR_ALT]) {
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

// ── Export ────────────────────────────────────────────────────────────

export const coretexHandlers: GatewayRequestHandlers = {
  "coretex.identity": identity,
  "coretex.memoryBank": memoryBank,
  "coretex.memoryBankEntry": memoryBankEntry,
  "coretex.aiPacket": aiPacket,
  "coretex.sync": sync,
  "coretex.sources": sources,
  "coretex.research": research,
  "coretex.addResearch": addResearch,
  "coretex.researchCategories": researchCategories,
};
