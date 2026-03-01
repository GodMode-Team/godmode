import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import JSON5 from "json5";

export type WorkspaceType = "personal" | "project" | "team";

export type WorkspaceGitSyncConfig = {
  type: "git";
  remote?: string;
  branch: string;
  autoPull: {
    enabled: boolean;
    interval?: string;
  };
  autoPush: {
    enabled: boolean;
    debounceMs: number;
  };
};

export type TeamWorkspaceConfig = {
  github?: string;
  role?: "admin" | "member";
  agentName?: string;
  memberId?: string;
};

export type WorkspaceCurationConfig = {
  enabled: boolean;
  schedule?: string;
  threshold?: number;
};

export type WorkspaceConfigEntry = {
  id: string;
  name: string;
  emoji: string;
  type: WorkspaceType;
  path: string;
  keywords: string[];
  pinned: string[];
  pinnedSessions: string[];
  /** Directories (relative to path) scanned for artifacts. Defaults to ["outputs"]. */
  artifactDirs: string[];
  sync?: WorkspaceGitSyncConfig;
  team?: TeamWorkspaceConfig;
  curation?: WorkspaceCurationConfig;
};

export type WorkspaceConfigFile = {
  version: string;
  workspaces: WorkspaceConfigEntry[];
};

const WORKSPACES_CONFIG_VERSION = "1.0";
const WORKSPACES_FILENAME = "workspaces.json5";

export function resolveGodModeRoot(): string {
  const configuredRoot = String(process.env.GODMODE_ROOT ?? "").trim();
  if (configuredRoot) {
    return path.resolve(expandPath(configuredRoot));
  }
  return path.join(os.homedir(), "godmode");
}

export const CANONICAL_WORKSPACES_CONFIG_PATH = path.join(
  resolveGodModeRoot(),
  "data",
  WORKSPACES_FILENAME,
);

const LEGACY_WORKSPACES_CONFIG_PATHS = [path.join(os.homedir(), ".godmode", WORKSPACES_FILENAME)];

export function expandPath(input: string): string {
  const value = String(input ?? "").trim();
  if (!value) {
    return value;
  }
  if (value === "~") {
    return os.homedir();
  }
  if (value.startsWith("~/")) {
    return path.join(os.homedir(), value.slice(2));
  }
  return value;
}

export function collapsePath(input: string): string {
  const absolute = path.resolve(input);
  const home = os.homedir();
  if (absolute === home) {
    return "~";
  }
  if (absolute.startsWith(home + path.sep)) {
    return `~${absolute.slice(home.length)}`;
  }
  return absolute;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeId(input: string): string {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function humanizeName(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeType(input: unknown): WorkspaceType {
  const value = (typeof input === "string" ? input : "").trim().toLowerCase();
  if (value === "personal") {
    return "personal";
  }
  if (value === "project") {
    return "project";
  }
  if (value === "team" || value === "team-workspace") {
    return "team";
  }
  return "project";
}

function dedupeNonEmpty(values: unknown[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of values) {
    const value = (
      typeof raw === "string" ? raw : typeof raw === "number" ? String(raw) : ""
    ).trim();
    if (!value) {
      continue;
    }
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    output.push(value);
  }
  return output;
}

function defaultEmoji(type: WorkspaceType): string {
  if (type === "personal") {
    return "🌱";
  }
  if (type === "team") {
    return "👥";
  }
  return "📁";
}

function normalizePositiveNumber(raw: unknown, fallback: number): number {
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function normalizeWorkspaceSyncConfig(raw: unknown): WorkspaceGitSyncConfig | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }

  const candidate = raw as Record<string, unknown>;
  const syncType = typeof candidate.type === "string" ? candidate.type.trim().toLowerCase() : "";
  if (syncType !== "git") {
    return undefined;
  }

  const autoPullRaw =
    candidate.autoPull && typeof candidate.autoPull === "object" && !Array.isArray(candidate.autoPull)
      ? (candidate.autoPull as Record<string, unknown>)
      : {};
  const autoPushRaw =
    candidate.autoPush && typeof candidate.autoPush === "object" && !Array.isArray(candidate.autoPush)
      ? (candidate.autoPush as Record<string, unknown>)
      : {};

  const remote =
    typeof candidate.remote === "string" && candidate.remote.trim()
      ? candidate.remote.trim()
      : undefined;
  const branch =
    typeof candidate.branch === "string" && candidate.branch.trim()
      ? candidate.branch.trim()
      : "main";
  const autoPullInterval =
    typeof autoPullRaw.interval === "string" && autoPullRaw.interval.trim()
      ? autoPullRaw.interval.trim()
      : undefined;

  return {
    type: "git",
    remote,
    branch,
    autoPull: {
      enabled: Boolean(autoPullRaw.enabled),
      interval: autoPullInterval,
    },
    autoPush: {
      enabled: Boolean(autoPushRaw.enabled),
      debounceMs: normalizePositiveNumber(autoPushRaw.debounceMs, 15_000),
    },
  };
}

function normalizeTeamConfig(raw: unknown): TeamWorkspaceConfig | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }
  const candidate = raw as Record<string, unknown>;
  const github =
    typeof candidate.github === "string" && candidate.github.trim()
      ? candidate.github.trim()
      : undefined;
  const roleRaw = typeof candidate.role === "string" ? candidate.role.trim().toLowerCase() : "";
  const role = roleRaw === "admin" ? "admin" : roleRaw === "member" ? "member" : undefined;
  const agentName =
    typeof candidate.agentName === "string" && candidate.agentName.trim()
      ? candidate.agentName.trim()
      : undefined;
  const memberId =
    typeof candidate.memberId === "string" && candidate.memberId.trim()
      ? candidate.memberId.trim()
      : undefined;

  if (!github && !role && !agentName && !memberId) {
    return undefined;
  }
  return { github, role, agentName, memberId };
}

function normalizeCurationConfig(raw: unknown): WorkspaceCurationConfig | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }
  const candidate = raw as Record<string, unknown>;
  const enabled = Boolean(candidate.enabled);
  const schedule =
    typeof candidate.schedule === "string" && candidate.schedule.trim()
      ? candidate.schedule.trim()
      : undefined;
  const threshold =
    typeof candidate.threshold === "number" && Number.isFinite(candidate.threshold) && candidate.threshold > 0
      ? candidate.threshold
      : undefined;

  return { enabled, schedule, threshold };
}

function normalizeWorkspaceEntry(
  raw: Record<string, unknown>,
  index: number,
  seenIds: Set<string>,
): WorkspaceConfigEntry {
  const normalizedType = normalizeType(raw.type);
  const providedName = (typeof raw.name === "string" ? raw.name : "").trim();
  const fallbackName =
    providedName ||
    humanizeName(typeof raw.id === "string" ? raw.id : "") ||
    `Workspace ${index + 1}`;
  let id = normalizeId(typeof raw.id === "string" ? raw.id : fallbackName);
  if (!id) {
    id = `workspace-${index + 1}`;
  }
  if (seenIds.has(id)) {
    let suffix = 2;
    while (seenIds.has(`${id}-${suffix}`)) {
      suffix += 1;
    }
    id = `${id}-${suffix}`;
  }
  seenIds.add(id);

  const resolvedPath = path.resolve(
    expandPath(
      (typeof raw.path === "string" ? raw.path : "").trim() ||
        path.join(os.homedir(), "godmode", "memory", "projects", id),
    ),
  );
  const keywords = dedupeNonEmpty(
    Array.isArray(raw.keywords) ? (raw.keywords as unknown[]) : [id, fallbackName.toLowerCase()],
  ).map((entry) => entry.toLowerCase());

  return {
    id,
    name: fallbackName,
    emoji: (typeof raw.emoji === "string" ? raw.emoji : "").trim() || defaultEmoji(normalizedType),
    type: normalizedType,
    path: resolvedPath,
    keywords,
    pinned: dedupeNonEmpty(Array.isArray(raw.pinned) ? (raw.pinned as unknown[]) : []),
    pinnedSessions: dedupeNonEmpty(
      Array.isArray(raw.pinnedSessions) ? (raw.pinnedSessions as unknown[]) : [],
    ),
    artifactDirs: dedupeNonEmpty(
      Array.isArray(raw.artifactDirs) ? (raw.artifactDirs as unknown[]) : ["."],
    ),
    sync: normalizeWorkspaceSyncConfig(raw.sync),
    team: normalizeTeamConfig(raw.team),
    curation: normalizeCurationConfig(raw.curation),
  };
}

function normalizeWorkspaceConfig(raw: unknown): WorkspaceConfigFile {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const workspacesRaw = Array.isArray(data.workspaces) ? (data.workspaces as unknown[]) : [];
  const seenIds = new Set<string>();
  const workspaces = workspacesRaw
    .filter((entry) => entry && typeof entry === "object")
    .map((entry, index) =>
      normalizeWorkspaceEntry(entry as Record<string, unknown>, index, seenIds),
    );

  return {
    version: WORKSPACES_CONFIG_VERSION,
    workspaces,
  };
}

async function listSubdirectories(root: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort((a: string, b: string) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function inferKeywords(name: string, id: string): string[] {
  const words = `${name} ${id}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return dedupeNonEmpty(words);
}

async function buildDefaultWorkspaceConfig(): Promise<WorkspaceConfigFile> {
  const root = resolveGodModeRoot();
  const clientsRoot = path.join(root, "clients");
  const projectsRoot = path.join(root, "memory", "projects");
  const personalRoot = path.join(root, "memory", "personal");

  await fs.mkdir(personalRoot, { recursive: true });

  const entries: WorkspaceConfigEntry[] = [];

  const lifeId = "life";
  entries.push({
    id: lifeId,
    name: "Life",
    emoji: "🌱",
    type: "personal",
    path: personalRoot,
    keywords: ["life", "personal", "health", "family"],
    pinned: [],
    pinnedSessions: [],
    artifactDirs: ["outputs"],
  });

  const projectFolders = await listSubdirectories(projectsRoot);
  for (const folder of projectFolders) {
    const id = normalizeId(folder);
    if (!id || entries.some((entry) => entry.id === id)) {
      continue;
    }
    const workspacePath = path.join(projectsRoot, folder);
    entries.push({
      id,
      name: humanizeName(id),
      emoji: id === "godmode" ? "⚡" : "📁",
      type: "project",
      path: workspacePath,
      keywords: inferKeywords(folder, id),
      pinned: [],
      pinnedSessions: [],
      artifactDirs: ["outputs"],
    });
  }

  const clientFolders = await listSubdirectories(clientsRoot);
  for (const folder of clientFolders) {
    const id = normalizeId(folder);
    if (!id || entries.some((entry) => entry.id === id)) {
      continue;
    }
    const workspacePath = path.join(clientsRoot, folder);
    entries.push({
      id,
      name: humanizeName(id),
      emoji: "👥",
      type: "team",
      path: workspacePath,
      keywords: inferKeywords(folder, id),
      pinned: [],
      pinnedSessions: [],
      artifactDirs: ["outputs"],
    });
  }

  return {
    version: WORKSPACES_CONFIG_VERSION,
    workspaces: entries,
  };
}

async function findExistingConfigPath(): Promise<string | null> {
  const candidates = [CANONICAL_WORKSPACES_CONFIG_PATH, ...LEGACY_WORKSPACES_CONFIG_PATHS];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function readConfigFile(configPath: string): Promise<WorkspaceConfigFile> {
  const raw = await fs.readFile(configPath, "utf-8");
  const parsed = JSON5.parse(raw);
  return normalizeWorkspaceConfig(parsed);
}

export async function writeWorkspaceConfig(config: WorkspaceConfigFile): Promise<void> {
  const normalized = normalizeWorkspaceConfig(config);
  await fs.mkdir(path.dirname(CANONICAL_WORKSPACES_CONFIG_PATH), { recursive: true });
  await fs.writeFile(
    CANONICAL_WORKSPACES_CONFIG_PATH,
    `${JSON.stringify(normalized, null, 2)}\n`,
    "utf-8",
  );
}

export async function readWorkspaceConfig(opts?: {
  initializeIfMissing?: boolean;
  migrateLegacyToCanonical?: boolean;
}): Promise<WorkspaceConfigFile> {
  const initializeIfMissing = opts?.initializeIfMissing !== false;
  const migrateLegacyToCanonical = opts?.migrateLegacyToCanonical !== false;
  const existingPath = await findExistingConfigPath();

  if (existingPath) {
    const config = await readConfigFile(existingPath);
    if (migrateLegacyToCanonical && existingPath !== CANONICAL_WORKSPACES_CONFIG_PATH) {
      try {
        await writeWorkspaceConfig(config);
      } catch {
        // Migration is best-effort — don't break reads if the write fails
        // (e.g. disk full, permissions). The legacy path still works fine.
      }
    }
    return config;
  }

  if (!initializeIfMissing) {
    return { version: WORKSPACES_CONFIG_VERSION, workspaces: [] };
  }

  const generated = await buildDefaultWorkspaceConfig();
  await writeWorkspaceConfig(generated);
  return generated;
}

export function findWorkspaceById(
  config: WorkspaceConfigFile,
  workspaceId: string,
): WorkspaceConfigEntry | null {
  const id = normalizeId(workspaceId);
  return config.workspaces.find((entry) => entry.id === id) ?? null;
}

function normalizeRelativePathInsideWorkspace(workspacePath: string, value: string): string | null {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return null;
  }
  const absoluteWorkspace = path.resolve(workspacePath);
  const absoluteCandidate = path.isAbsolute(trimmed)
    ? path.resolve(trimmed)
    : path.resolve(absoluteWorkspace, trimmed);
  if (
    absoluteCandidate !== absoluteWorkspace &&
    !absoluteCandidate.startsWith(absoluteWorkspace + path.sep)
  ) {
    return null;
  }
  const relative = path.relative(absoluteWorkspace, absoluteCandidate);
  if (!relative || relative === ".") {
    return null;
  }
  return relative.split(path.sep).join("/");
}

export function normalizePinnedPath(workspacePath: string, filePath: string): string | null {
  return normalizeRelativePathInsideWorkspace(workspacePath, filePath);
}

export function resolvePathInWorkspace(
  workspacePath: string,
  maybeRelativePath: string,
): string | null {
  const relative = normalizeRelativePathInsideWorkspace(workspacePath, maybeRelativePath);
  if (!relative) {
    return null;
  }
  return path.resolve(workspacePath, relative);
}

export function detectWorkspaceFromText(
  config: WorkspaceConfigFile,
  text: string,
): { workspaceId: string | null; score: number; matchedKeyword?: string } {
  const normalizedText = String(text ?? "").toLowerCase();
  if (!normalizedText.trim()) {
    return { workspaceId: null, score: 0 };
  }

  let best: { workspaceId: string | null; score: number; matchedKeyword?: string } = {
    workspaceId: null,
    score: 0,
  };

  for (const workspace of config.workspaces) {
    const keywords = dedupeNonEmpty([workspace.id, workspace.name, ...workspace.keywords]).map(
      (entry) => entry.toLowerCase(),
    );

    for (const keyword of keywords) {
      if (!keyword) {
        continue;
      }
      if (!normalizedText.includes(keyword)) {
        continue;
      }
      const score = keyword.length;
      if (score > best.score) {
        best = {
          workspaceId: workspace.id,
          score,
          matchedKeyword: keyword,
        };
      }
    }
  }

  return best;
}

export async function ensureWorkspaceFolders(
  workspacePath: string,
  type?: WorkspaceType,
): Promise<void> {
  await fs.mkdir(workspacePath, { recursive: true });
  await fs.mkdir(path.join(workspacePath, "sessions"), { recursive: true });
  await fs.mkdir(path.join(workspacePath, "outputs"), { recursive: true });

  if (type === "team") {
    const teamDirs = [
      ".godmode",
      ".godmode/local",
      "memory",
      "skills",
      "tools",
      "comms",
      "artifacts",
      "artifacts/docs",
      "artifacts/templates",
      "artifacts/generated",
      "artifacts/exports",
      "clients",
      "integrations",
    ];
    for (const dir of teamDirs) {
      await fs.mkdir(path.join(workspacePath, dir), { recursive: true });
    }
  }
}

export function getWorkspaceConfigPathCandidates(): string[] {
  return [CANONICAL_WORKSPACES_CONFIG_PATH, ...LEGACY_WORKSPACES_CONFIG_PATHS];
}

export function createWorkspaceId(name: string, existingIds: Set<string>): string {
  const base = normalizeId(name) || "workspace";
  if (!existingIds.has(base)) {
    return base;
  }
  let suffix = 2;
  while (existingIds.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

export function toDisplayPath(value: string): string {
  return collapsePath(value);
}
