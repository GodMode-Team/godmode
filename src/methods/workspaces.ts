import fs from "node:fs/promises";
import path from "node:path";
import {
  deriveSessionTitle,
  loadCombinedSessionStoreForGateway,
  loadConfig,
  pruneLegacyStoreKeys,
  resolveGatewaySessionStoreTarget,
  updateSessionStore,
  isCronSessionKey,
  type SessionStoreEntry,
} from "../lib/workspace-session-store.js";
import {
  CANONICAL_WORKSPACES_CONFIG_PATH,
  createWorkspaceId,
  detectWorkspaceFromText,
  ensureWorkspaceFolders,
  expandPath,
  findWorkspaceById,
  normalizePinnedPath,
  readWorkspaceConfig,
  resolveGodModeRoot,
  resolvePathInWorkspace,
  toDisplayPath,
  type WorkspaceConfigEntry,
  type WorkspaceConfigFile,
  type WorkspaceType,
  writeWorkspaceConfig,
} from "../lib/workspaces-config.js";
import { readTasks, type NativeTask } from "./tasks.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ErrorCodes = {
  INVALID_REQUEST: "INVALID_REQUEST",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

function errorShape(code: string, message: string): { code: string; message: string } {
  return { code, message };
}

/** Max file size for workspaces.readFile (1MB). */
const MAX_READ_SIZE = 1_000_000;
/** Max image file size for workspaces.readFile (8MB). */
const MAX_IMAGE_READ_SIZE = 8_000_000;

/** Max concurrent fs.stat calls while scanning. */
const STAT_CONCURRENCY = 20;

/** Keep workspace sections compact; this is not a full file explorer. */
const MAX_WORKSPACE_SECTION_ITEMS = 500;
/** Bound text indexing for workspace search. */
const MAX_SEARCH_TEXT_FILES = 120;
const MAX_SEARCH_TEXT_BYTES = 16_000;

const SKIP_NAMES = new Set(["node_modules", "__pycache__", "venv", ".git", "dist", "build"]);

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".json",
  ".json5",
  ".yaml",
  ".yml",
  ".toml",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".sh",
  ".css",
  ".scss",
  ".html",
  ".xml",
  ".csv",
  ".env",
  ".ini",
  ".cfg",
  ".conf",
  ".log",
  ".rs",
  ".go",
  ".java",
  ".rb",
  ".lua",
]);

const ARTIFACT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".html",
  ".htm",
  ".json",
  ".json5",
  ".yaml",
  ".yml",
  ".toml",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".xml",
]);

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

type WorkspaceItem = {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
  modifiedAt?: number;
  size?: number;
  children?: WorkspaceItem[];
};

type WorkspaceFileEntry = {
  path: string;
  name: string;
  type: "markdown" | "html" | "image" | "json" | "text" | "folder";
  size: number;
  modified: string;
  isDirectory?: boolean;
  searchText?: string;
};

type FolderTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  fileType?: WorkspaceFileEntry["type"];
  size?: number;
  modified?: string;
  children?: FolderTreeNode[];
};

type WorkspaceSessionEntry = {
  id: string;
  key: string;
  title: string;
  created: string;
  status: "running" | "complete" | "blocked";
  workspaceSubfolder: string | null;
};

function pathToId(p: string): string {
  return p
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function workspaceTypeToLegacyType(
  type: WorkspaceType,
): "projects" | "clients" | "vault" | "custom" {
  if (type === "team") {
    return "clients";
  }
  if (type === "personal") {
    return "vault";
  }
  if (type === "project") {
    return "projects";
  }
  return "custom";
}

function inferFileType(fileName: string, isDirectory: boolean): WorkspaceFileEntry["type"] {
  if (isDirectory) {
    return "folder";
  }
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".md") {
    return "markdown";
  }
  if (ext === ".html" || ext === ".htm") {
    return "html";
  }
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) {
    return "image";
  }
  if ([".json", ".json5"].includes(ext)) {
    return "json";
  }
  return "text";
}

/**
 * Scan a directory for workspace items with recursive support and batched stat calls.
 */
export async function scanDirectory(
  dirPath: string,
  maxDepth: number = 1,
  currentDepth: number = 0,
): Promise<WorkspaceItem[]> {
  if (currentDepth >= maxDepth) {
    return [];
  }

  let rawEntries: import("node:fs").Dirent[];
  try {
    rawEntries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const visible = rawEntries.filter((entry) => {
    const name = String(entry.name);
    return !name.startsWith(".") && !SKIP_NAMES.has(name);
  });

  visible.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) {
      return -1;
    }
    if (!a.isDirectory() && b.isDirectory()) {
      return 1;
    }
    return String(a.name).localeCompare(String(b.name));
  });

  const items: WorkspaceItem[] = [];
  for (let i = 0; i < visible.length; i += STAT_CONCURRENCY) {
    const batch = visible.slice(i, i + STAT_CONCURRENCY);
    const stats = await Promise.allSettled(
      batch.map(async (entry) => {
        const name = String(entry.name);
        const fullPath = path.join(dirPath, name);
        const stat = await fs.stat(fullPath);
        return { entry, fullPath, stat, name };
      }),
    );

    for (const result of stats) {
      if (result.status !== "fulfilled") {
        continue;
      }
      const { entry, fullPath, stat, name } = result.value;
      const isDirectory = entry.isDirectory();
      const item: WorkspaceItem = {
        id: pathToId(fullPath),
        name,
        type: isDirectory ? "directory" : "file",
        path: toDisplayPath(fullPath),
        modifiedAt: stat.mtimeMs,
      };
      if (!isDirectory) {
        item.size = stat.size;
      }
      if (isDirectory && currentDepth + 1 < maxDepth) {
        item.children = await scanDirectory(fullPath, maxDepth, currentDepth + 1);
      }
      items.push(item);
    }
  }

  return items;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeSessionWorkspaceSubfolder(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  const normalized = (
    typeof value === "string" ? value : typeof value === "number" ? String(value) : ""
  )
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return normalized ? normalized.split(path.sep).join("/") : null;
}

function normalizeWorkspaceRelativePath(input: string): string {
  const normalized = input
    .replaceAll("\\", "/")
    .replace(/^\.\/+/, "")
    .replace(/\/{2,}/g, "/");
  return normalized.replace(/^\/+/, "");
}

function dedupeWorkspaceEntries(entries: WorkspaceFileEntry[]): WorkspaceFileEntry[] {
  const byPath = new Map<string, WorkspaceFileEntry>();
  for (const entry of entries) {
    const normalizedPath = normalizeWorkspaceRelativePath(entry.path);
    if (!normalizedPath) {
      continue;
    }
    const existing = byPath.get(normalizedPath);
    if (!existing || entry.modified > existing.modified) {
      byPath.set(normalizedPath, {
        ...entry,
        path: normalizedPath,
      });
    }
  }
  return Array.from(byPath.values());
}

function sortAndCapWorkspaceEntries(entries: WorkspaceFileEntry[]): WorkspaceFileEntry[] {
  const sorted = dedupeWorkspaceEntries(entries).sort((a, b) =>
    b.modified.localeCompare(a.modified),
  );
  return sorted.slice(0, MAX_WORKSPACE_SECTION_ITEMS);
}

/**
 * Build a folder tree from flat workspace file entries.
 * Groups files by directory path, creating nested folder nodes.
 */
function buildFolderTree(entries: WorkspaceFileEntry[]): FolderTreeNode[] {
  const root: Map<string, FolderTreeNode> = new Map();

  function ensureFolder(segments: string[]): FolderTreeNode {
    const key = segments.join("/");
    const existing = root.get(key);
    if (existing) {
      return existing;
    }

    const node: FolderTreeNode = {
      name: segments[segments.length - 1],
      path: key,
      type: "folder",
      children: [],
    };

    if (segments.length === 1) {
      root.set(key, node);
    } else {
      const parent = ensureFolder(segments.slice(0, -1));
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      root.set(key, node);
    }

    return node;
  }

  for (const entry of entries) {
    const parts = entry.path.split("/");
    if (parts.length === 1) {
      // Top-level file
      const fileNode: FolderTreeNode = {
        name: entry.name,
        path: entry.path,
        type: "file",
        fileType: entry.type,
        size: entry.size,
        modified: entry.modified,
      };
      root.set(`__file__${entry.path}`, fileNode);
    } else {
      const folderSegments = parts.slice(0, -1);
      const folder = ensureFolder(folderSegments);
      if (!folder.children) {
        folder.children = [];
      }
      folder.children.push({
        name: entry.name,
        path: entry.path,
        type: "file",
        fileType: entry.type,
        size: entry.size,
        modified: entry.modified,
      });
    }
  }

  // Collect top-level nodes: folders at depth 1 + top-level files
  const topLevel: FolderTreeNode[] = [];
  for (const [key, node] of root.entries()) {
    if (key.startsWith("__file__")) {
      topLevel.push(node);
    } else if (!key.includes("/")) {
      topLevel.push(node);
    }
  }

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes: FolderTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    }
  };
  sortNodes(topLevel);

  return topLevel;
}

function canIndexTextForSearch(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (!ext) {
    return false;
  }
  return TEXT_EXTENSIONS.has(ext);
}

async function loadWorkspaceEntrySearchText(
  workspacePath: string,
  relativePath: string,
): Promise<string | undefined> {
  if (!canIndexTextForSearch(relativePath)) {
    return undefined;
  }
  const absolutePath = resolvePathInWorkspace(workspacePath, relativePath);
  if (!absolutePath) {
    return undefined;
  }
  let stat: import("node:fs").Stats;
  try {
    stat = await fs.stat(absolutePath);
  } catch {
    return undefined;
  }
  if (stat.isDirectory() || stat.size <= 0 || stat.size > MAX_SEARCH_TEXT_BYTES) {
    return undefined;
  }
  try {
    const raw = await fs.readFile(absolutePath, "utf-8");
    const normalized = raw.replace(/\s+/g, " ").trim();
    if (!normalized) {
      return undefined;
    }
    return normalized.slice(0, MAX_SEARCH_TEXT_BYTES);
  } catch {
    return undefined;
  }
}

async function enrichWorkspaceEntriesForSearch(
  workspace: WorkspaceConfigEntry,
  entries: WorkspaceFileEntry[],
): Promise<WorkspaceFileEntry[]> {
  if (entries.length === 0) {
    return entries;
  }
  const limited = entries.slice(0, MAX_SEARCH_TEXT_FILES);
  const textByPath = new Map<string, string>();

  await Promise.all(
    limited.map(async (entry) => {
      const searchText = await loadWorkspaceEntrySearchText(workspace.path, entry.path);
      if (!searchText) {
        return;
      }
      textByPath.set(normalizeWorkspaceRelativePath(entry.path), searchText);
    }),
  );

  if (textByPath.size === 0) {
    return entries;
  }

  return entries.map((entry) => {
    const key = normalizeWorkspaceRelativePath(entry.path);
    const searchText = textByPath.get(key);
    return searchText ? { ...entry, searchText } : entry;
  });
}

function flattenArtifactItems(workspacePath: string, items: WorkspaceItem[]): WorkspaceFileEntry[] {
  const flattened: WorkspaceFileEntry[] = [];
  const walk = (nodes: WorkspaceItem[]) => {
    for (const node of nodes) {
      if (node.type === "directory") {
        if (node.children) {
          walk(node.children);
        }
        continue;
      }
      const ext = path.extname(node.name).toLowerCase();
      if (!ARTIFACT_EXTENSIONS.has(ext)) {
        continue;
      }
      const absolutePath = expandPath(node.path);
      const relative = path.relative(workspacePath, absolutePath).split(path.sep).join("/");
      flattened.push({
        path: relative,
        name: node.name,
        type: inferFileType(node.name, false),
        size: node.size ?? 0,
        modified: new Date(node.modifiedAt ?? Date.now()).toISOString(),
      });
    }
  };
  walk(items);
  return flattened;
}

async function listWorkspaceOutputs(
  workspace: WorkspaceConfigEntry,
): Promise<WorkspaceFileEntry[]> {
  const allArtifacts: WorkspaceFileEntry[] = [];

  for (const dir of workspace.artifactDirs) {
    const dirPath = path.join(workspace.path, dir);
    const items = await scanDirectory(dirPath, 6);
    allArtifacts.push(...flattenArtifactItems(workspace.path, items));
  }

  return sortAndCapWorkspaceEntries(allArtifacts);
}

async function getPinnedEntries(
  workspace: WorkspaceConfigEntry,
  outputs: WorkspaceFileEntry[],
): Promise<WorkspaceFileEntry[]> {
  const outputByPath = new Map(outputs.map((entry) => [entry.path, entry]));

  const pinned: WorkspaceFileEntry[] = [];
  for (const pinnedPath of workspace.pinned) {
    const normalized = pinnedPath.split(path.sep).join("/");
    const existing = outputByPath.get(normalized);
    if (existing) {
      pinned.push(existing);
      continue;
    }

    const absolutePath = resolvePathInWorkspace(workspace.path, normalized);
    if (!absolutePath) {
      continue;
    }
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isDirectory()) {
        continue;
      }
      pinned.push({
        path: normalized,
        name: path.basename(normalized),
        type: inferFileType(normalized, false),
        size: stat.size,
        modified: new Date(stat.mtimeMs).toISOString(),
      });
    } catch {
      // ignore stale pinned file
    }
  }

  return pinned.sort((a, b) => b.modified.localeCompare(a.modified));
}

function deriveSessionStatus(updatedAtMs: number): "running" | "complete" | "blocked" {
  const ageMs = Date.now() - updatedAtMs;
  if (ageMs < 2 * 60 * 1000) {
    return "running";
  }
  return "complete";
}

function resolveWorkspaceSessionTitle(key: string, entry: Record<string, unknown>): string {
  const displayName = typeof entry.displayName === "string" ? entry.displayName.trim() : "";
  if (displayName) {
    return displayName;
  }
  const label = typeof entry.label === "string" ? entry.label.trim() : "";
  if (label) {
    return label;
  }
  const subject = typeof entry.subject === "string" ? entry.subject.trim() : "";
  if (subject) {
    return subject;
  }
  const derived = deriveSessionTitle(entry as SessionStoreEntry);
  if (derived) {
    return derived;
  }
  return key;
}

async function listWorkspaceSessions(
  workspaceId: string,
  workspaceConfig?: WorkspaceConfigFile,
): Promise<WorkspaceSessionEntry[]> {
  const cfg = await loadConfig();
  const combined = (await loadCombinedSessionStoreForGateway(cfg)).store;

  const rows: WorkspaceSessionEntry[] = [];
  for (const [key, entry] of Object.entries(combined)) {
    if (isCronSessionKey(key)) {
      continue;
    }
    const rawWorkspaceId = (entry as Record<string, unknown>).workspaceId;
    const entryWorkspaceId = (typeof rawWorkspaceId === "string" ? rawWorkspaceId : "").trim();
    let resolvedWorkspaceId = entryWorkspaceId;
    if (!resolvedWorkspaceId && workspaceConfig) {
      const titleSource = [
        key,
        String(entry.displayName ?? ""),
        String(entry.label ?? ""),
        String(entry.subject ?? ""),
        String(entry.groupChannel ?? ""),
      ]
        .join(" ")
        .trim();
      if (titleSource) {
        const detection = detectWorkspaceFromText(workspaceConfig, titleSource);
        if (detection.workspaceId && detection.score >= 3) {
          resolvedWorkspaceId = detection.workspaceId;
        }
      }
    }
    if (!resolvedWorkspaceId || resolvedWorkspaceId !== workspaceId) {
      continue;
    }
    const workspaceSubfolder = normalizeSessionWorkspaceSubfolder(
      (entry as Record<string, unknown>).workspaceSubfolder,
    );
    const updatedAt = Number(entry.updatedAt ?? Date.now());
    const sessionId =
      typeof entry.sessionId === "string" && entry.sessionId.trim() ? entry.sessionId : key;
    rows.push({
      id: sessionId,
      key,
      title: resolveWorkspaceSessionTitle(key, entry as Record<string, unknown>),
      created: new Date(updatedAt).toISOString(),
      status: deriveSessionStatus(updatedAt),
      workspaceSubfolder,
    });
  }

  rows.sort((a, b) => b.created.localeCompare(a.created));
  return rows;
}

function resolveWorkspaceSummary(
  workspace: WorkspaceConfigEntry,
  outputs: WorkspaceFileEntry[],
  sessions: WorkspaceSessionEntry[],
): {
  id: string;
  name: string;
  emoji: string;
  type: WorkspaceType;
  path: string;
  artifactCount: number;
  sessionCount: number;
  lastUpdated: string;
  lastScanned: number;
  legacyType: "projects" | "clients" | "vault" | "custom";
} {
  const artifactCount = outputs.length;
  const sessionCount = sessions.length;
  const sessionUpdated = sessions
    .map((entry) => Date.parse(entry.created))
    .filter((value) => Number.isFinite(value))
    .reduce((acc, value) => Math.max(acc, value), 0);
  const outputUpdated = outputs
    .map((entry) => Date.parse(entry.modified))
    .filter((value) => Number.isFinite(value) && value > 0)
    .reduce((acc, value) => Math.max(acc, value), 0);
  const lastUpdatedMs = sessionUpdated || outputUpdated || Date.now();

  return {
    id: workspace.id,
    name: workspace.name,
    emoji: workspace.emoji,
    type: workspace.type,
    path: toDisplayPath(workspace.path),
    artifactCount,
    sessionCount,
    lastUpdated: new Date(lastUpdatedMs).toISOString(),
    lastScanned: Date.now(),
    legacyType: workspaceTypeToLegacyType(workspace.type),
  };
}

async function normalizePathForRead(
  params: Record<string, unknown>,
  config: WorkspaceConfigFile,
): Promise<{ absolutePath: string | null; error?: string }> {
  const explicitWorkspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const filePath = typeof params.filePath === "string" ? String(params.filePath).trim() : "";

  if (explicitWorkspaceId && filePath) {
    if (filePath.includes("\0")) {
      return { absolutePath: null, error: "invalid path" };
    }
    const workspace = findWorkspaceById(config, explicitWorkspaceId);
    if (!workspace) {
      return { absolutePath: null, error: `workspace not found: ${explicitWorkspaceId}` };
    }
    const absolute = resolvePathInWorkspace(workspace.path, filePath);
    if (!absolute) {
      return { absolutePath: null, error: "filePath is outside workspace" };
    }
    // Resolve symlinks to prevent escape via symlink pointing outside workspace
    let realPath: string;
    try {
      realPath = await fs.realpath(absolute);
    } catch {
      return { absolutePath: null, error: "path does not exist" };
    }
    let realRoot: string;
    try {
      realRoot = await fs.realpath(workspace.path);
    } catch {
      return { absolutePath: null, error: "workspace root does not exist" };
    }
    if (realPath !== realRoot && !realPath.startsWith(realRoot + path.sep)) {
      return { absolutePath: null, error: "filePath is outside workspace" };
    }
    return { absolutePath: realPath };
  }

  const legacyPath = typeof params.path === "string" ? String(params.path).trim() : "";
  if (!legacyPath) {
    return { absolutePath: null, error: "path is required" };
  }

  if (legacyPath.includes("\0")) {
    return { absolutePath: null, error: "invalid path" };
  }

  const absolutePath = path.resolve(expandPath(legacyPath));
  // Resolve symlinks to prevent escape via symlink pointing outside workspace
  let resolvedPath: string;
  try {
    resolvedPath = await fs.realpath(absolutePath);
  } catch {
    return { absolutePath: null, error: "path does not exist" };
  }
  const allowedRoots: string[] = [];
  for (const workspace of config.workspaces) {
    try {
      allowedRoots.push(await fs.realpath(path.resolve(workspace.path)));
    } catch {
      // skip workspaces whose root doesn't exist
    }
  }
  const isAllowed = allowedRoots.some(
    (root) => resolvedPath === root || resolvedPath.startsWith(root + path.sep),
  );
  if (!isAllowed) {
    return {
      absolutePath: null,
      error: "path is outside allowed workspace directories",
    };
  }

  return { absolutePath: resolvedPath };
}

function getImageMimeTypeForExtension(extension: string): string | null {
  if (!extension) {
    return null;
  }
  return IMAGE_MIME_BY_EXT[extension] ?? null;
}

async function readFileForWorkspace(absolutePath: string): Promise<{
  content: string | null;
  size?: number;
  modifiedAt?: number;
  mime?: string;
  contentType?: string;
  error?: string;
}> {
  let stat: import("node:fs").Stats;
  try {
    stat = await fs.stat(absolutePath);
  } catch (err) {
    return { content: null, error: err instanceof Error ? err.message : String(err) };
  }

  if (stat.isDirectory()) {
    return { content: null, error: "path is a directory, not a file" };
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const imageMime = getImageMimeTypeForExtension(extension);
  if (imageMime) {
    if (stat.size > MAX_IMAGE_READ_SIZE) {
      return {
        content: null,
        size: stat.size,
        error: `image too large (${Math.round(stat.size / 1024)}KB, max ${Math.round(MAX_IMAGE_READ_SIZE / 1024)}KB)`,
      };
    }
    try {
      const raw = await fs.readFile(absolutePath);
      const content = `data:${imageMime};base64,${raw.toString("base64")}`;
      return {
        content,
        size: stat.size,
        modifiedAt: stat.mtimeMs,
        mime: imageMime,
        contentType: imageMime,
      };
    } catch (err) {
      return { content: null, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // PDF: encode as base64 data URL for iframe rendering
  if (extension === ".pdf") {
    if (stat.size > MAX_IMAGE_READ_SIZE) {
      return {
        content: null,
        size: stat.size,
        error: `PDF too large (${Math.round(stat.size / 1024)}KB, max ${Math.round(MAX_IMAGE_READ_SIZE / 1024)}KB)`,
      };
    }
    try {
      const raw = await fs.readFile(absolutePath);
      const content = `data:application/pdf;base64,${raw.toString("base64")}`;
      return {
        content,
        size: stat.size,
        modifiedAt: stat.mtimeMs,
        mime: "application/pdf",
        contentType: "application/pdf",
      };
    } catch (err) {
      return { content: null, error: err instanceof Error ? err.message : String(err) };
    }
  }

  if (stat.size > MAX_READ_SIZE) {
    return {
      content: null,
      size: stat.size,
      error: `file too large (${Math.round(stat.size / 1024)}KB, max ${Math.round(MAX_READ_SIZE / 1024)}KB)`,
    };
  }

  if (extension && !TEXT_EXTENSIONS.has(extension)) {
    return {
      content: null,
      error: `unsupported file type: ${extension}`,
      mime: "application/octet-stream",
    };
  }

  let content: string;
  try {
    content = await fs.readFile(absolutePath, "utf-8");
  } catch (err) {
    return { content: null, error: err instanceof Error ? err.message : String(err) };
  }
  const mime =
    extension === ".md"
      ? "text/markdown"
      : extension === ".html" || extension === ".htm"
        ? "text/html"
        : extension === ".json" || extension === ".json5"
          ? "application/json"
          : "text/plain";

  return {
    content,
    size: stat.size,
    modifiedAt: stat.mtimeMs,
    mime,
    contentType: mime,
  };
}

function resolveWorkspacePathByType(type: WorkspaceType, id: string): string {
  const root = resolveGodModeRoot();
  if (type === "team") {
    return path.join(root, "clients", id);
  }
  if (type === "personal") {
    return path.join(root, "memory", "personal", id);
  }
  return path.join(root, "memory", "projects", id);
}

function normalizeCreateType(value: unknown): WorkspaceType {
  const normalized = (typeof value === "string" ? value : "project").trim().toLowerCase();
  if (normalized === "team" || normalized === "team-workspace") {
    return "team";
  }
  if (normalized === "personal") {
    return "personal";
  }
  return "project";
}

async function findSessionKeyFromSessionId(sessionId: string): Promise<string | null> {
  const cfg = await loadConfig();
  const combined = (await loadCombinedSessionStoreForGateway(cfg)).store;
  for (const [key, entry] of Object.entries(combined)) {
    if (entry.sessionId === sessionId) {
      return key;
    }
  }
  return null;
}

const list: GatewayRequestHandler = async ({ respond }) => {
  const config = await readWorkspaceConfig();

  const summaries = await Promise.all(
    config.workspaces.map(async (workspace) => {
      const outputs = await listWorkspaceOutputs(workspace);
      const sessions = await listWorkspaceSessions(workspace.id, config);
      const summary = resolveWorkspaceSummary(workspace, outputs, sessions);
      return {
        id: summary.id,
        name: summary.name,
        emoji: summary.emoji,
        type: summary.type,
        path: summary.path,
        artifactCount: summary.artifactCount,
        sessionCount: summary.sessionCount,
        lastUpdated: summary.lastUpdated,
        lastScanned: summary.lastScanned,
        legacyType: summary.legacyType,
      };
    }),
  );

  respond(true, {
    configPath: CANONICAL_WORKSPACES_CONFIG_PATH,
    workspaces: summaries,
    sources: summaries.map((workspace) => workspace.path),
  });
};

/**
 * List memory files from workspace/memory/ directory (team shared knowledge).
 */
async function listWorkspaceMemoryFiles(
  workspace: { path: string; type?: string },
): Promise<WorkspaceFileEntry[]> {
  const memoryDir = path.join(workspace.path, "memory");
  try {
    const dirEntries = await fs.readdir(memoryDir, { withFileTypes: true });
    const files: WorkspaceFileEntry[] = [];
    for (const dirent of dirEntries) {
      if (!dirent.isFile()) continue;
      try {
        const filePath = path.join(memoryDir, dirent.name);
        const stat = await fs.stat(filePath);
        files.push({
          path: `memory/${dirent.name}`,
          name: dirent.name,
          type: inferFileType(dirent.name, false),
          size: stat.size,
          modified: new Date(stat.mtimeMs).toISOString(),
        });
      } catch {
        // Skip unreadable files
      }
    }
    return files.sort((a, b) => b.modified.localeCompare(a.modified));
  } catch {
    return [];
  }
}

const get: GatewayRequestHandler = async ({ params, respond }) => {
  const id = typeof params.id === "string" ? String(params.id).trim() : "";
  if (!id) {
    respond(true, { workspace: null, error: "id is required" });
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, id);
  if (!workspace) {
    respond(true, { workspace: null, error: `workspace not found: ${id}` });
    return;
  }

  const rawOutputs = await listWorkspaceOutputs(workspace);
  const outputs = await enrichWorkspaceEntriesForSearch(workspace, rawOutputs);
  const sessions = await listWorkspaceSessions(workspace.id, config);
  const pinned = await getPinnedEntries(workspace, outputs);
  const summary = resolveWorkspaceSummary(workspace, outputs, sessions);

  // Resolve pinned sessions
  const cfg = await loadConfig();
  const combinedStore = (await loadCombinedSessionStoreForGateway(cfg)).store;
  const pinnedSessions: WorkspaceSessionEntry[] = [];
  for (const sessionKey of workspace.pinnedSessions) {
    const canonicalSessionKey = sessionKey.trim().toLowerCase();
    const entry = combinedStore[canonicalSessionKey] as Record<string, unknown> | undefined;
    if (!entry) {
      continue;
    }
    const updatedAt = Number(entry.updatedAt ?? Date.now());
    pinnedSessions.push({
      id: typeof entry.sessionId === "string" ? entry.sessionId : "",
      key: sessionKey,
      title: resolveWorkspaceSessionTitle(sessionKey, entry),
      created: new Date(updatedAt).toISOString(),
      status: deriveSessionStatus(updatedAt),
      workspaceSubfolder: null,
    });
  }

  // Load tasks scoped to this workspace (match on name or resolved ID)
  const tasksData = await readTasks();
  const wsId = workspace.id.toLowerCase();
  const wsName = workspace.name.toLowerCase();
  const workspaceTasks: NativeTask[] = tasksData.tasks.filter((t) => {
    const pid = (t as Record<string, unknown>).projectId;
    if (pid === workspace.id) return true;
    if (!t.project) return false;
    const proj = t.project.toLowerCase();
    return proj === wsName || proj === wsId || proj.includes(`— ${wsId}`) || proj.includes(`— ${wsName}`);
  });

  // Load shared memory files (team workspaces store knowledge in memory/)
  const memoryFiles = await listWorkspaceMemoryFiles(workspace);

  respond(true, {
    workspace: {
      ...workspace,
      path: summary.path,
      artifactCount: summary.artifactCount,
      sessionCount: summary.sessionCount,
      lastUpdated: summary.lastUpdated,
      type: workspace.type,
      legacyType: summary.legacyType,
      lastScanned: Date.now(),
    },
    pinned,
    pinnedSessions,
    outputs,
    folderTree: buildFolderTree(outputs),
    sessions,
    tasks: workspaceTasks,
    memory: memoryFiles,
  });
};

const readFile: GatewayRequestHandler = async ({ params, respond }) => {
  const config = await readWorkspaceConfig();
  const resolved = await normalizePathForRead(params, config);
  if (!resolved.absolutePath) {
    respond(true, { content: null, error: resolved.error ?? "path is required" });
    return;
  }

  const result = await readFileForWorkspace(resolved.absolutePath);
  respond(true, {
    ...result,
    path: toDisplayPath(resolved.absolutePath),
  });
};

const pin: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const filePath = typeof params.filePath === "string" ? String(params.filePath).trim() : "";

  if (!workspaceId || !filePath) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and filePath are required"),
    );
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${workspaceId}`),
    );
    return;
  }

  const normalized = normalizePinnedPath(workspace.path, filePath);
  if (!normalized) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "filePath is outside workspace"),
    );
    return;
  }

  if (!workspace.pinned.includes(normalized)) {
    workspace.pinned = [...workspace.pinned, normalized];
    await writeWorkspaceConfig(config);
  }

  respond(true, {
    ok: true,
    workspaceId,
    pinned: workspace.pinned,
  });
};

const unpin: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const filePath = typeof params.filePath === "string" ? String(params.filePath).trim() : "";

  if (!workspaceId || !filePath) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and filePath are required"),
    );
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${workspaceId}`),
    );
    return;
  }

  const normalized = normalizePinnedPath(workspace.path, filePath);
  if (!normalized) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "filePath is outside workspace"),
    );
    return;
  }

  workspace.pinned = workspace.pinned.filter((entry) => entry !== normalized);
  await writeWorkspaceConfig(config);

  respond(true, {
    ok: true,
    workspaceId,
    pinned: workspace.pinned,
  });
};

const fileSession: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const sessionId = typeof params.sessionId === "string" ? String(params.sessionId).trim() : "";
  const sessionKeyInput =
    typeof params.sessionKey === "string" ? String(params.sessionKey).trim() : "";
  const workspaceSubfolderInput =
    typeof params.workspaceSubfolder === "string" ? String(params.workspaceSubfolder).trim() : "";

  if (!workspaceId || (!sessionId && !sessionKeyInput)) {
    respond(false, undefined, {
      ...errorShape(
        ErrorCodes.INVALID_REQUEST,
        "workspaceId and one of sessionId/sessionKey are required",
      ),
    });
    return;
  }

  const workspacesConfig = await readWorkspaceConfig();
  const workspace = findWorkspaceById(workspacesConfig, workspaceId);
  if (!workspace) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${workspaceId}`),
    );
    return;
  }

  const resolvedSessionKey = sessionKeyInput || (await findSessionKeyFromSessionId(sessionId));
  if (!resolvedSessionKey) {
    respond(false, undefined, {
      ...errorShape(
        ErrorCodes.INVALID_REQUEST,
        "session not found for provided sessionId/sessionKey",
      ),
    });
    return;
  }

  const workspaceSubfolder = workspaceSubfolderInput
    ? normalizePinnedPath(workspace.path, workspaceSubfolderInput)
    : null;

  const cfg = await loadConfig();
  const target = await resolveGatewaySessionStoreTarget({ cfg, key: resolvedSessionKey });

  try {
    await updateSessionStore(target.storePath, (store) => {
      const existing = target.storeKeys.map((key) => store[key]).find(Boolean);
      if (!existing) {
        return;
      }

      store[target.canonicalKey] = {
        ...existing,
        updatedAt: Date.now(),
        workspaceId: workspace.id,
        workspaceSubfolder: workspaceSubfolder ?? null,
      } as typeof existing & { workspaceId: string; workspaceSubfolder: string | null };

      pruneLegacyStoreKeys({
        store,
        canonicalKey: target.canonicalKey,
        candidates: target.storeKeys,
      });
    });
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.UNAVAILABLE,
        `failed to update session workspace metadata: ${String(err)}`,
      ),
    );
    return;
  }

  respond(true, {
    ok: true,
    sessionKey: target.canonicalKey,
    workspaceId: workspace.id,
    workspaceSubfolder: workspaceSubfolder ?? null,
  });
};

const detectFromMessage: GatewayRequestHandler = async ({ params, respond }) => {
  const text = typeof params.text === "string" ? String(params.text) : "";
  const config = await readWorkspaceConfig();
  const result = detectWorkspaceFromText(config, text);
  respond(true, result);
};

const createWorkspace: GatewayRequestHandler = async ({ params, respond }) => {
  const name = typeof params.name === "string" ? String(params.name).trim() : "";
  const type = normalizeCreateType(params.type);
  const explicitPath = typeof params.path === "string" ? String(params.path).trim() : "";
  const emoji = typeof params.emoji === "string" ? String(params.emoji).trim() : "";
  const keywordsRaw = Array.isArray(params.keywords) ? (params.keywords as unknown[]) : [];

  if (!name) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "name is required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const existingIds = new Set(config.workspaces.map((workspace) => workspace.id));
  const id = createWorkspaceId(name, existingIds);

  const workspacePath = path.resolve(
    explicitPath ? expandPath(explicitPath) : resolveWorkspacePathByType(type, id),
  );

  const keywords = Array.from(
    new Set(
      [
        ...keywordsRaw.map((entry) =>
          (typeof entry === "string" ? entry : "").trim().toLowerCase(),
        ),
        ...name
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean),
        id,
      ].filter(Boolean),
    ),
  );

  const workspace: WorkspaceConfigEntry = {
    id,
    name,
    emoji: emoji || (type === "team" ? "👥" : type === "personal" ? "🌱" : "📁"),
    type,
    path: workspacePath,
    keywords,
    pinned: [],
    pinnedSessions: [],
    artifactDirs: ["outputs"],
  };

  await ensureWorkspaceFolders(workspace.path);
  config.workspaces.push(workspace);
  await writeWorkspaceConfig(config);

  respond(true, {
    workspace: {
      ...workspace,
      path: toDisplayPath(workspace.path),
    },
  });
};

const deleteWorkspace: GatewayRequestHandler = async ({ params, respond }) => {
  const id = typeof params.id === "string" ? String(params.id).trim() : "";
  if (!id) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "id is required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const index = config.workspaces.findIndex((w) => w.id === id);
  if (index === -1) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${id}`));
    return;
  }

  const removed = config.workspaces.splice(index, 1)[0];
  await writeWorkspaceConfig(config);

  respond(true, {
    deleted: { id: removed.id, name: removed.name },
  });
};

const scan: GatewayRequestHandler = async ({ respond }) => {
  const config = await readWorkspaceConfig();

  const results = await Promise.all(
    config.workspaces.map(async (workspace) => {
      const exists = await pathExists(workspace.path);
      const outputs = await listWorkspaceOutputs(workspace);
      return {
        path: toDisplayPath(workspace.path),
        found: exists,
        artifactCount: outputs.length,
        workspaceId: workspace.id,
      };
    }),
  );

  respond(true, {
    scanned: true,
    timestamp: Date.now(),
    configPath: CANONICAL_WORKSPACES_CONFIG_PATH,
    results,
  });
};

const pinSession: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const sessionKey = typeof params.sessionKey === "string" ? String(params.sessionKey).trim() : "";

  if (!workspaceId || !sessionKey) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and sessionKey are required"),
    );
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${workspaceId}`),
    );
    return;
  }

  if (!workspace.pinnedSessions.includes(sessionKey)) {
    workspace.pinnedSessions = [...workspace.pinnedSessions, sessionKey];
    await writeWorkspaceConfig(config);
  }

  respond(true, { ok: true, workspaceId, pinnedSessions: workspace.pinnedSessions });
};

const unpinSession: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId =
    typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const sessionKey = typeof params.sessionKey === "string" ? String(params.sessionKey).trim() : "";

  if (!workspaceId || !sessionKey) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and sessionKey are required"),
    );
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `workspace not found: ${workspaceId}`),
    );
    return;
  }

  workspace.pinnedSessions = workspace.pinnedSessions.filter((key) => key !== sessionKey);
  await writeWorkspaceConfig(config);

  respond(true, { ok: true, workspaceId, pinnedSessions: workspace.pinnedSessions });
};

/**
 * workspaces.teamSetupPrompt — returns a beginner-friendly guided prompt
 * that the UI can inject into a new chat to walk the user through team
 * workspace setup step by step.
 */
const teamSetupPrompt: GatewayRequestHandler = async ({ respond }) => {
  const prompt = [
    "I'd like to set up a Team Workspace so my team's AI assistants can collaborate, share knowledge, and work together.",
    "",
    "Please walk me through this step by step. I'm not very technical, so please keep it simple and tell me exactly what to do at each step.",
    "",
    "Here's what I need help with:",
    "1. Create a shared space on GitHub where our team's work will be stored (a private repository)",
    "2. Set up my Team Workspace in GodMode and connect it to that shared space",
    "3. Get a simple invite link or instructions I can send to my team members so they can join",
    "4. Make sure everything syncs automatically so we don't have to think about it",
    "",
    "A few things to keep in mind:",
    "- I want the workspace to be PRIVATE (only my team can see it)",
    "- Each team member will need their own OpenClaw setup — please tell me what they need to install",
    "- I want our AIs to be able to share memory, skills, and documents with each other",
    "",
    "Start with step 1 and walk me through it. Wait for me to confirm each step is done before moving to the next one.",
    "",
    "Use the workspace.provisionTeam tool when I'm ready to create the workspace. Ask me for:",
    "- A name for our team workspace (e.g. 'Acme Marketing Team')",
    "- Our GitHub organization name (or help me create one if I don't have one)",
  ].join("\n");

  respond(true, { prompt });
};

// ── Browse Folder ────────────────────────────────────────────────────

const browseFolder: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId.trim() : "";
  const folderPath = typeof params.folderPath === "string" ? params.folderPath.trim() : "";

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Workspace not found"));
    return;
  }

  // Default to workspace root when no folderPath (or "." from UI browse button)
  const targetDir = (folderPath && folderPath !== "." && folderPath !== "")
    ? resolvePathInWorkspace(workspace.path, folderPath)
    : workspace.path;
  if (!targetDir) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Path outside workspace"));
    return;
  }

  // Scan immediate children only (depth=1)
  const items = await scanDirectory(targetDir, 1);
  const entries: Array<{
    path: string;
    name: string;
    type: string;
    size: number;
    modified: string;
    isDirectory: boolean;
  }> = [];

  for (const item of items) {
    const absolutePath = expandPath(item.path);
    const relative = path.relative(workspace.path, absolutePath).split(path.sep).join("/");
    entries.push({
      path: relative,
      name: item.name,
      type: item.type === "directory" ? "folder" : inferFileType(item.name, false),
      size: item.size ?? 0,
      modified: new Date(item.modifiedAt ?? Date.now()).toISOString(),
      isDirectory: item.type === "directory",
    });
  }

  // Build breadcrumbs
  const segments = folderPath ? folderPath.split("/").filter(Boolean) : [];
  const breadcrumbs = [
    { name: workspace.name, path: "" },
    ...segments.map((seg, i) => ({
      name: seg,
      path: segments.slice(0, i + 1).join("/"),
    })),
  ];

  respond(true, {
    folderPath: folderPath || "",
    folderName: segments.length > 0 ? segments[segments.length - 1] : workspace.name,
    entries,
    breadcrumbs,
    parentPath: segments.length > 0 ? segments.slice(0, -1).join("/") || null : null,
  });
};

// ── Search Workspace ─────────────────────────────────────────────────

const searchWorkspace: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId.trim() : "";
  const query = typeof params.query === "string" ? params.query.trim() : "";
  const limit = typeof params.limit === "number" ? Math.min(params.limit, 100) : 50;

  if (!workspaceId || !query) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and query are required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Workspace not found"));
    return;
  }

  const outputs = await listWorkspaceOutputs(workspace);
  const enriched = await enrichWorkspaceEntriesForSearch(workspace, outputs);
  const q = query.toLowerCase();

  type SearchResult = WorkspaceFileEntry & { matchContext?: string };
  const results: SearchResult[] = [];

  for (const entry of enriched) {
    if (results.length >= limit) break;
    const nameMatch = entry.name.toLowerCase().includes(q);
    const pathMatch = entry.path.toLowerCase().includes(q);
    const contentMatch = entry.searchText?.toLowerCase().includes(q);

    if (nameMatch || pathMatch || contentMatch) {
      let matchContext: string | undefined;
      if (contentMatch && entry.searchText) {
        const idx = entry.searchText.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 60);
        const end = Math.min(entry.searchText.length, idx + query.length + 60);
        matchContext =
          (start > 0 ? "..." : "") +
          entry.searchText.slice(start, end) +
          (end < entry.searchText.length ? "..." : "");
      }
      const { searchText: _unused, ...rest } = entry;
      results.push({ ...rest, matchContext });
    }
  }

  respond(true, { results, query, total: results.length });
};

// ── Create Folder ────────────────────────────────────────────────────

const createFolder: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId.trim() : "";
  const folderPath = typeof params.folderPath === "string" ? params.folderPath.trim() : "";

  if (!workspaceId || !folderPath) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId and folderPath are required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Workspace not found"));
    return;
  }

  const absolutePath = resolvePathInWorkspace(workspace.path, folderPath);
  if (!absolutePath) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Path outside workspace"));
    return;
  }

  await fs.mkdir(absolutePath, { recursive: true });
  respond(true, { ok: true, path: folderPath });
};

// ── Move File ────────────────────────────────────────────────────────

const moveFile: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId.trim() : "";
  const sourcePath = typeof params.sourcePath === "string" ? params.sourcePath.trim() : "";
  const destPath = typeof params.destPath === "string" ? params.destPath.trim() : "";

  if (!workspaceId || !sourcePath || !destPath) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId, sourcePath, and destPath are required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Workspace not found"));
    return;
  }

  const absoluteSource = resolvePathInWorkspace(workspace.path, sourcePath);
  const absoluteDest = resolvePathInWorkspace(workspace.path, destPath);
  if (!absoluteSource || !absoluteDest) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Path outside workspace"));
    return;
  }

  // Ensure destination parent exists
  await fs.mkdir(path.dirname(absoluteDest), { recursive: true });
  await fs.rename(absoluteSource, absoluteDest);

  // Update pinned paths if the moved file was pinned
  const sourceNormalized = sourcePath.split(path.sep).join("/");
  if (workspace.pinned.includes(sourceNormalized)) {
    const destNormalized = destPath.split(path.sep).join("/");
    workspace.pinned = workspace.pinned.map(p => p === sourceNormalized ? destNormalized : p);
    await writeWorkspaceConfig(config);
  }

  respond(true, { ok: true, from: sourcePath, to: destPath });
};

// ── Rename File ──────────────────────────────────────────────────────

const renameFile: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId.trim() : "";
  const filePath = typeof params.filePath === "string" ? params.filePath.trim() : "";
  const newName = typeof params.newName === "string" ? params.newName.trim() : "";

  if (!workspaceId || !filePath || !newName) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId, filePath, and newName are required"));
    return;
  }

  // Security: prevent path traversal in newName
  if (newName.includes("/") || newName.includes("\\") || newName.includes("..")) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "newName must not contain path separators"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Workspace not found"));
    return;
  }

  const absoluteOld = resolvePathInWorkspace(workspace.path, filePath);
  if (!absoluteOld) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Path outside workspace"));
    return;
  }

  const newPath = path.join(path.dirname(filePath), newName);
  const absoluteNew = resolvePathInWorkspace(workspace.path, newPath);
  if (!absoluteNew) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "New path outside workspace"));
    return;
  }

  await fs.rename(absoluteOld, absoluteNew);

  // Update pinned paths
  const oldNormalized = filePath.split(path.sep).join("/");
  if (workspace.pinned.includes(oldNormalized)) {
    const newNormalized = newPath.split(path.sep).join("/");
    workspace.pinned = workspace.pinned.map(p => p === oldNormalized ? newNormalized : p);
    await writeWorkspaceConfig(config);
  }

  respond(true, { ok: true, oldPath: filePath, newPath });
};

export const workspacesHandlers: GatewayRequestHandlers = {
  "workspaces.list": list,
  "workspaces.get": get,
  "workspaces.scan": scan,
  "workspaces.readFile": readFile,
  "workspaces.pin": pin,
  "workspaces.unpin": unpin,
  "workspaces.pinSession": pinSession,
  "workspaces.unpinSession": unpinSession,
  "workspaces.fileSession": fileSession,
  "workspaces.detectFromMessage": detectFromMessage,
  "workspaces.create": createWorkspace,
  "workspaces.delete": deleteWorkspace,
  "workspaces.teamSetupPrompt": teamSetupPrompt,
  "workspaces.browseFolder": browseFolder,
  "workspaces.search": searchWorkspace,
  "workspaces.createFolder": createFolder,
  "workspaces.moveFile": moveFile,
  "workspaces.renameFile": renameFile,
};

export { expandPath };
