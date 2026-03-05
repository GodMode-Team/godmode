/**
 * secure-fs.ts — Secure file I/O helpers with restrictive permissions.
 *
 * All GodMode data files should use these helpers to ensure:
 *  - Files: 0o600 (owner read/write only)
 *  - Directories: 0o700 (owner rwx only)
 *
 * Also provides error message sanitization for user-facing responses.
 */

import { writeFile as _writeFile, mkdir as _mkdir } from "node:fs/promises";
import { writeFileSync as _writeFileSync, mkdirSync as _mkdirSync } from "node:fs";
import { homedir } from "node:os";

const FILE_MODE = 0o600;
const DIR_MODE = 0o700;

// ── Secure file write ────────────────────────────────────────────────

/** Write a file with owner-only permissions (0o600). */
export async function secureWriteFile(
  filePath: string,
  data: string,
  encoding: BufferEncoding = "utf-8",
): Promise<void> {
  await _writeFile(filePath, data, { encoding, mode: FILE_MODE });
}

/** Synchronous write with owner-only permissions (0o600). */
export function secureWriteFileSync(
  filePath: string,
  data: string,
  encoding: BufferEncoding = "utf-8",
): void {
  _writeFileSync(filePath, data, { encoding, mode: FILE_MODE });
}

// ── Secure directory creation ────────────────────────────────────────

/** Create directory with owner-only permissions (0o700). */
export async function secureMkdir(dirPath: string): Promise<void> {
  await _mkdir(dirPath, { recursive: true, mode: DIR_MODE });
}

/** Synchronous mkdir with owner-only permissions (0o700). */
export function secureMkdirSync(dirPath: string): void {
  _mkdirSync(dirPath, { recursive: true, mode: DIR_MODE });
}

// ── Error sanitization ──────────────────────────────────────────────

const HOME = homedir();
const HOME_RE = new RegExp(HOME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");

/**
 * Sanitize an error message for user-facing responses.
 * Strips home directory paths and internal details.
 */
export function sanitizeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw.replace(HOME_RE, "~");
}
