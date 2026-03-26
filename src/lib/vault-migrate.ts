/**
 * vault-migrate.ts — Non-destructive migration from ~/godmode/memory/ to Obsidian vault.
 *
 * Copies (never moves) knowledge artifacts into the vault's PARA structure.
 * Tracks migration state in 99-System/_godmode/vault-manifest.json.
 * Idempotent: skips files that already exist at the destination.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { copyFile, mkdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import {
  VAULT_FOLDERS,
  BRAIN_SUBFOLDERS,
  getVaultPath,
  ensureVaultStructure,
  readVaultManifest,
  writeVaultManifest,
  type VaultManifest,
} from "./vault-paths.js";

// ── Migration Map ───────────────────────────────────────────────────

type MigrationEntry = {
  sourceDir: string;
  destRelative: string;
  recursive: boolean;
  label: string;
};

function getMigrationMap(): MigrationEntry[] {
  return [
    // Memory bank → Brain
    {
      sourceDir: join(MEMORY_DIR, "bank", "people"),
      destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.people),
      recursive: false,
      label: "people",
    },
    {
      sourceDir: join(MEMORY_DIR, "bank", "companies"),
      destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.companies),
      recursive: false,
      label: "companies",
    },
    // Research → Resources/Research
    {
      sourceDir: join(MEMORY_DIR, "research"),
      destRelative: join(VAULT_FOLDERS.resources, "Research"),
      recursive: true,
      label: "research",
    },
  ];
}

/** Individual files to migrate (source path → vault-relative destination). */
function getFileMigrations(): Array<{
  source: string;
  destRelative: string;
  label: string;
}> {
  return [
    // Identity files from ~/godmode/ root → VAULT/08-Identity/
    { source: join(GODMODE_ROOT, "USER.md"), destRelative: join(VAULT_FOLDERS.identity, "USER.md"), label: "identity" },
    { source: join(GODMODE_ROOT, "SOUL.md"), destRelative: join(VAULT_FOLDERS.identity, "SOUL.md"), label: "identity" },
    { source: join(GODMODE_ROOT, "VISION.md"), destRelative: join(VAULT_FOLDERS.identity, "VISION.md"), label: "identity" },
    { source: join(GODMODE_ROOT, "IDENTITY.md"), destRelative: join(VAULT_FOLDERS.identity, "IDENTITY.md"), label: "identity" },
    { source: join(GODMODE_ROOT, "PRINCIPLES.md"), destRelative: join(VAULT_FOLDERS.identity, "PRINCIPLES.md"), label: "identity" },
    // Memory-based identity → VAULT/08-Identity/
    { source: join(MEMORY_DIR, "THESIS.md"), destRelative: join(VAULT_FOLDERS.identity, "THESIS.md"), label: "identity" },
    // Knowledge files → VAULT/06-Brain/Knowledge/
    { source: join(MEMORY_DIR, "bank", "opinions.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "opinions.md"), label: "knowledge" },
    { source: join(MEMORY_DIR, "curated.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "curated.md"), label: "knowledge" },
    { source: join(MEMORY_DIR, "tacit.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "tacit.md"), label: "knowledge" },
    { source: join(MEMORY_DIR, "topics.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "topics.md"), label: "knowledge" },
    { source: join(MEMORY_DIR, "golden-rules-definitions.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "golden-rules-definitions.md"), label: "knowledge" },
    { source: join(MEMORY_DIR, "known-issues.md"), destRelative: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge, "known-issues.md"), label: "knowledge" },
    // AI Packet → VAULT/99-System/
    { source: join(MEMORY_DIR, "CONSCIOUSNESS.md"), destRelative: join(VAULT_FOLDERS.system, "CONSCIOUSNESS.md"), label: "consciousness" },
    { source: join(MEMORY_DIR, "WORKING.md"), destRelative: join(VAULT_FOLDERS.system, "WORKING.md"), label: "consciousness" },
  ];
}

// ── Migration Engine ────────────────────────────────────────────────

type MigrationResult = {
  ok: boolean;
  copied: number;
  skipped: number;
  errors: string[];
  summary: Record<string, number>;
};

async function copyDirContents(
  sourceDir: string,
  destDir: string,
  recursive: boolean,
): Promise<{ copied: number; skipped: number; errors: string[] }> {
  let copied = 0;
  let skipped = 0;
  const errors: string[] = [];

  if (!existsSync(sourceDir)) return { copied, skipped, errors };

  try {
    const entries = readdirSync(sourceDir, { withFileTypes: true });
    await mkdir(destDir, { recursive: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
      const srcPath = join(sourceDir, entry.name);
      const destPath = join(destDir, entry.name);

      if (entry.isDirectory() && recursive) {
        const sub = await copyDirContents(srcPath, destPath, true);
        copied += sub.copied;
        skipped += sub.skipped;
        errors.push(...sub.errors);
        continue;
      }

      if (entry.isDirectory()) continue;

      const ext = extname(entry.name);
      if (ext !== ".md" && ext !== ".txt" && ext !== ".json") continue;

      if (existsSync(destPath)) {
        skipped++;
        continue;
      }

      try {
        await copyFile(srcPath, destPath);
        copied++;
      } catch (err) {
        errors.push(`${entry.name}: ${String(err)}`);
      }
    }
  } catch (err) {
    errors.push(`dir ${sourceDir}: ${String(err)}`);
  }

  return { copied, skipped, errors };
}

/**
 * Run the full migration: copy knowledge artifacts from ~/godmode/ into the Obsidian vault.
 * Non-destructive: copies only, never moves. Skips existing files.
 * Records completion in vault-manifest.json.
 */
export async function migrateToVault(): Promise<MigrationResult> {
  const vault = getVaultPath();
  if (!vault) {
    return { ok: false, copied: 0, skipped: 0, errors: ["Vault not available"], summary: {} };
  }

  // Ensure PARA folders exist
  ensureVaultStructure();

  const summary: Record<string, number> = {};
  let totalCopied = 0;
  let totalSkipped = 0;
  const allErrors: string[] = [];

  // 1. Directory migrations (people, companies, research)
  for (const entry of getMigrationMap()) {
    const destDir = join(vault, entry.destRelative);
    const result = await copyDirContents(entry.sourceDir, destDir, entry.recursive);
    totalCopied += result.copied;
    totalSkipped += result.skipped;
    allErrors.push(...result.errors);
    if (result.copied > 0) {
      summary[entry.label] = (summary[entry.label] ?? 0) + result.copied;
    }
  }

  // 2. Individual file migrations
  for (const file of getFileMigrations()) {
    if (!existsSync(file.source)) continue;
    const destPath = join(vault, file.destRelative);
    const destDir = join(destPath, "..");

    if (existsSync(destPath)) {
      totalSkipped++;
      continue;
    }

    try {
      await mkdir(destDir, { recursive: true });
      await copyFile(file.source, destPath);
      totalCopied++;
      summary[file.label] = (summary[file.label] ?? 0) + 1;
    } catch (err) {
      allErrors.push(`${basename(file.source)}: ${String(err)}`);
    }
  }

  // 3. Record migration in manifest
  const manifest: VaultManifest = {
    version: 1,
    migratedAt: new Date().toISOString(),
    migrationSummary: summary,
  };
  await writeVaultManifest(manifest);

  return {
    ok: allErrors.length === 0,
    copied: totalCopied,
    skipped: totalSkipped,
    errors: allErrors,
    summary,
  };
}

/**
 * Check if migration has been performed.
 */
export async function isMigrated(): Promise<boolean> {
  const manifest = await readVaultManifest();
  return manifest?.migratedAt !== null && manifest?.migratedAt !== undefined;
}

/**
 * Auto-migrate if vault exists but migration hasn't been done yet.
 * Call this lazily on first Second Brain RPC access.
 * Returns true if migration ran, false if skipped.
 */
export async function autoMigrateIfNeeded(): Promise<boolean> {
  const vault = getVaultPath();
  if (!vault) return false;

  const already = await isMigrated();
  if (already) return false;

  await migrateToVault();
  return true;
}
