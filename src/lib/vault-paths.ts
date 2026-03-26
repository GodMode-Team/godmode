/**
 * vault-paths.ts — Vault-first path resolution for Second Brain.
 *
 * The Obsidian vault is the canonical Second Brain data store.
 * All knowledge artifacts (identity, memory bank, research, consciousness)
 * live in the vault with PARA-inspired folder structure.
 * Falls back to ~/godmode/memory/ when vault is unavailable.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { GODMODE_ROOT, MEMORY_DIR, resolveVaultPath } from "../data-paths.js";
import { WORKSPACE_CACHE_TTL_MS } from "./constants.js";

// ── Vault Folder Constants ──────────────────────────────────────────

export const VAULT_FOLDERS = {
  inbox: "00-Inbox",
  daily: "01-Daily",
  projects: "02-Projects",
  areas: "03-Areas",
  resources: "04-Resources",
  archive: "05-Archive",
  brain: "06-Brain",
  agentLog: "07-Agent-Log",
  identity: "08-Identity",
  discoveries: "10-Discoveries",
  system: "99-System",
} as const;

export const BRAIN_SUBFOLDERS = {
  people: "People",
  companies: "Companies",
  knowledge: "Knowledge",
} as const;

// ── Vault Availability ──────────────────────────────────────────────

let cachedVaultPath: string | null | undefined;

export function getVaultPath(): string | null {
  if (cachedVaultPath !== undefined) return cachedVaultPath;
  cachedVaultPath = resolveVaultPath();
  return cachedVaultPath;
}

export function isVaultAvailable(): boolean {
  return getVaultPath() !== null;
}

/** Clear cached vault path (useful after configuration changes). */
export function resetVaultCache(): void {
  cachedVaultPath = undefined;
}

// ── Path Resolution ─────────────────────────────────────────────────

/**
 * Resolve a vault subfolder path, falling back to ~/godmode/memory/.
 * If vault is available, returns vault-based path.
 * If not, returns the provided fallback (defaults to MEMORY_DIR-relative).
 */
export function resolveVaultFolder(
  folderKey: keyof typeof VAULT_FOLDERS,
): string | null {
  const vault = getVaultPath();
  if (!vault) return null;
  return join(vault, VAULT_FOLDERS[folderKey]);
}

/**
 * Get the path for a Second Brain resource, trying vault first then fallback.
 * Returns { path, source: "vault" | "local" }.
 */
export function resolveWithFallback(
  vaultRelative: string,
  localFallback: string,
): { path: string; source: "vault" | "local" } {
  const vault = getVaultPath();
  if (vault) {
    const vaultPath = join(vault, vaultRelative);
    if (existsSync(vaultPath)) {
      return { path: vaultPath, source: "vault" };
    }
  }
  return { path: localFallback, source: "local" };
}

/**
 * Get the best write path for a Second Brain resource.
 * Prefers vault if available (creates parent dir), otherwise local.
 */
export function resolveWritePath(
  vaultRelative: string,
  localFallback: string,
): { path: string; source: "vault" | "local" } {
  const vault = getVaultPath();
  if (vault) {
    const vaultPath = join(vault, vaultRelative);
    return { path: vaultPath, source: "vault" };
  }
  return { path: localFallback, source: "local" };
}

// ── Specific Path Resolvers ─────────────────────────────────────────

/** Identity files: VAULT/08-Identity/ or ~/godmode/ */
export function resolveIdentityDir(): { path: string; source: "vault" | "local" } {
  const vault = getVaultPath();
  if (vault) {
    const vaultPath = join(vault, VAULT_FOLDERS.identity);
    if (existsSync(vaultPath)) {
      return { path: vaultPath, source: "vault" };
    }
  }
  return { path: GODMODE_ROOT, source: "local" };
}

/** Memory bank people: VAULT/06-Brain/People/ or ~/godmode/memory/bank/people/ */
export function resolvePeoplePath(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.people),
    join(MEMORY_DIR, "bank", "people"),
  );
}

/** Memory bank companies: VAULT/06-Brain/Companies/ or ~/godmode/memory/bank/companies/ */
export function resolveCompaniesPath(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.companies),
    join(MEMORY_DIR, "bank", "companies"),
  );
}

/** Projects: VAULT/02-Projects/ or ~/godmode/memory/projects/ */
export function resolveProjectsPath(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    VAULT_FOLDERS.projects,
    join(MEMORY_DIR, "projects"),
  );
}

/** Research: VAULT/04-Resources/Research/ or ~/godmode/memory/research/ */
export function resolveResearchDir(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.resources, "Research"),
    join(MEMORY_DIR, "research"),
  );
}

/** Curated facts: VAULT/06-Brain/Knowledge/curated.md or ~/godmode/memory/curated.md */
export function resolveCuratedPath(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "curated.md"),
    join(MEMORY_DIR, "curated.md"),
  );
}

/** Knowledge extra files (tacit, topics, etc): VAULT/06-Brain/Knowledge/ or ~/godmode/memory/ */
export function resolveKnowledgePath(filename: string): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, filename),
    join(MEMORY_DIR, filename),
  );
}

/** Opinions: VAULT/06-Brain/Knowledge/opinions.md or ~/godmode/memory/bank/opinions.md */
export function resolveOpinionsPath(): { path: string; source: "vault" | "local" } {
  return resolveWithFallback(
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "opinions.md"),
    join(MEMORY_DIR, "bank", "opinions.md"),
  );
}

/** Inbox: VAULT/00-Inbox/ (null if vault unavailable) */
export function resolveInboxPath(): string | null {
  return resolveVaultFolder("inbox");
}

/** Discoveries: VAULT/10-Discoveries/ (null if vault unavailable) */
export function resolveDiscoveriesPath(): string | null {
  return resolveVaultFolder("discoveries");
}

// ── Vault Structure Management ──────────────────────────────────────

/** Ensure all PARA folders exist in the vault. Idempotent. */
export function ensureVaultStructure(): boolean {
  const vault = getVaultPath();
  if (!vault) return false;

  const folders = [
    VAULT_FOLDERS.inbox,
    VAULT_FOLDERS.daily,
    VAULT_FOLDERS.projects,
    VAULT_FOLDERS.areas,
    VAULT_FOLDERS.resources,
    join(VAULT_FOLDERS.resources, "Research"),
    VAULT_FOLDERS.archive,
    VAULT_FOLDERS.brain,
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.people),
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.companies),
    join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge),
    VAULT_FOLDERS.agentLog,
    VAULT_FOLDERS.identity,
    VAULT_FOLDERS.discoveries,
    VAULT_FOLDERS.system,
    join(VAULT_FOLDERS.system, "_godmode"),
  ];

  for (const folder of folders) {
    const fullPath = join(vault, folder);
    if (!existsSync(fullPath)) {
      try {
        mkdirSync(fullPath, { recursive: true });
      } catch {
        // Non-fatal — folder might be read-only
      }
    }
  }

  return true;
}

// ── Vault Health / Stats ────────────────────────────────────────────

export type VaultHealthStats = {
  totalNotes: number;
  inboxCount: number;
  brainCount: number;
  discoveryCount: number;
  projectCount: number;
  resourceCount: number;
  dailyCount: number;
  lastActivity: string | null;
};

function countMdFiles(dirPath: string): number {
  if (!existsSync(dirPath)) return 0;
  try {
    let count = 0;
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
      const full = join(dirPath, e.name);
      if (e.isDirectory()) {
        count += countMdFiles(full);
      } else if (e.name.endsWith(".md") || e.name.endsWith(".txt")) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

function latestMtime(dirPath: string, depth = 0): Date | null {
  if (!existsSync(dirPath) || depth > 3) return null;
  try {
    let latest: Date | null = null;
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
      const full = join(dirPath, e.name);
      if (e.isDirectory()) {
        const sub = latestMtime(full, depth + 1);
        if (sub && (!latest || sub > latest)) latest = sub;
      } else if (e.name.endsWith(".md")) {
        try {
          const mtime = statSync(full).mtime;
          if (!latest || mtime > latest) latest = mtime;
        } catch { /* skip */ }
      }
    }
    return latest;
  } catch {
    return null;
  }
}

export function getVaultHealth(): VaultHealthStats | null {
  const vault = getVaultPath();
  if (!vault) return null;

  const inboxCount = countMdFiles(join(vault, VAULT_FOLDERS.inbox));
  const brainCount = countMdFiles(join(vault, VAULT_FOLDERS.brain));
  const discoveryCount = countMdFiles(join(vault, VAULT_FOLDERS.discoveries));
  const projectCount = countMdFiles(join(vault, VAULT_FOLDERS.projects));
  const resourceCount = countMdFiles(join(vault, VAULT_FOLDERS.resources));
  const dailyCount = countMdFiles(join(vault, VAULT_FOLDERS.daily));

  const totalNotes = inboxCount + brainCount + discoveryCount + projectCount + resourceCount + dailyCount;

  const lastMod = latestMtime(vault);

  return {
    totalNotes,
    inboxCount,
    brainCount,
    discoveryCount,
    projectCount,
    resourceCount,
    dailyCount,
    lastActivity: lastMod?.toISOString() ?? null,
  };
}

// ── Vault Manifest ──────────────────────────────────────────────────

export type VaultManifest = {
  version: 1;
  migratedAt: string | null;
  migrationSummary: Record<string, number> | null;
};

const MANIFEST_RELATIVE = join(VAULT_FOLDERS.system, "_godmode", "vault-manifest.json");

export async function readVaultManifest(): Promise<VaultManifest | null> {
  const vault = getVaultPath();
  if (!vault) return null;
  const manifestPath = join(vault, MANIFEST_RELATIVE);
  try {
    const raw = await readFile(manifestPath, "utf-8");
    return JSON.parse(raw) as VaultManifest;
  } catch {
    return null;
  }
}

export async function writeVaultManifest(manifest: VaultManifest): Promise<void> {
  const vault = getVaultPath();
  if (!vault) return;
  const manifestPath = join(vault, MANIFEST_RELATIVE);
  const dir = join(vault, VAULT_FOLDERS.system, "_godmode");
  await mkdir(dir, { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

// ── Security ────────────────────────────────────────────────────────

/**
 * Check if a resolved path is within an allowed root: GODMODE_ROOT, Obsidian vault,
 * or any registered workspace directory.
 * Resolves the path first to collapse `..` traversals, then verifies
 * the result falls within an allowed root using a directory-boundary check
 * (trailing separator) to prevent prefix collisions like `/home/god` matching `/home/godmode`.
 */

// Cache workspace paths — refreshed lazily when isAllowedPath is called
let _workspacePaths: string[] = [];
let _workspacePathsTs = 0;
const WORKSPACE_CACHE_TTL = WORKSPACE_CACHE_TTL_MS;

function isWithinRoot(resolved: string, root: string): boolean {
  const prefix = root.endsWith(sep) ? root : root + sep;
  return resolved === root || resolved.startsWith(prefix);
}

export function isAllowedPath(filePath: string): boolean {
  const resolved = resolve(filePath);

  // GODMODE_ROOT
  if (isWithinRoot(resolved, GODMODE_ROOT)) return true;

  // Obsidian vault
  const vault = getVaultPath();
  if (vault && isWithinRoot(resolved, vault)) return true;

  // Registered workspace directories (cached, async refresh)
  for (const wsPath of _workspacePaths) {
    if (isWithinRoot(resolved, wsPath)) return true;
  }

  // Trigger async refresh if cache is stale (result applies on next call)
  if (Date.now() - _workspacePathsTs > WORKSPACE_CACHE_TTL) {
    void refreshWorkspacePaths();
  }

  return false;
}

/** Refresh workspace paths cache from config. */
async function refreshWorkspacePaths(): Promise<void> {
  try {
    const { readWorkspaceConfig } = await import("./workspaces-config.js");
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    _workspacePaths = config.workspaces.map((ws) => resolve(ws.path));
    _workspacePathsTs = Date.now();
  } catch {
    // Non-fatal — keep existing cache
  }
}

/** Eagerly load workspace paths (call at startup). */
export function initAllowedPaths(): void {
  void refreshWorkspacePaths();
}
