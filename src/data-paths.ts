import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * GodMode workspace root and shared directory paths.
 * All GodMode data, memory, skills, and docs live under ~/godmode/.
 */

/** GodMode workspace root: ~/godmode (overridable via GODMODE_ROOT env var) */
export const GODMODE_ROOT = process.env.GODMODE_ROOT || join(homedir(), "godmode");

/** Root data directory: ~/godmode/data */
export const DATA_DIR = join(GODMODE_ROOT, "data");

/** Root memory directory: ~/godmode/memory */
export const MEMORY_DIR = join(GODMODE_ROOT, "memory");

/** Artifacts directory: ~/godmode/artifacts — permanent storage for generated files */
export const ARTIFACTS_DIR = join(GODMODE_ROOT, "artifacts");

/** Obsidian vault path: OBSIDIAN_VAULT_PATH env var or ~/Documents/VAULT */
export const VAULT_PATH: string | null =
  process.env.OBSIDIAN_VAULT_PATH || null;

/** Daily brief folder inside the vault (default: 01-Daily) */
export const DAILY_FOLDER: string =
  process.env.DAILY_BRIEF_FOLDER || "01-Daily";

/**
 * Resolve the Obsidian vault path.
 * Checks OBSIDIAN_VAULT_PATH env, then falls back to ~/Documents/VAULT.
 * Returns null if neither exists.
 */
/**
 * Return today's date as YYYY-MM-DD in the user's local timezone.
 * Replaces the broken `new Date().toISOString().split("T")[0]` pattern
 * which returns UTC and rolls over too early for western timezones.
 */
export function localDateString(date?: Date): string {
  const d = date ?? new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function resolveVaultPath(): string | null {
  if (process.env.OBSIDIAN_VAULT_PATH) {
    return process.env.OBSIDIAN_VAULT_PATH;
  }
  // Default vault location
  const defaultVault = join(homedir(), "Documents", "VAULT");
  try {
    if (existsSync(defaultVault) && statSync(defaultVault).isDirectory()) {
      return defaultVault;
    }
  } catch {
    // doesn't exist
  }
  return null;
}
