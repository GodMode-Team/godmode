/**
 * adapter/file-lock.ts — Standalone file locking without openclaw/plugin-sdk.
 *
 * Uses fs.mkdir as an atomic lock primitive (mkdir is atomic on POSIX).
 * Matches the withFileLock(path, opts, fn) signature from the SDK.
 */

import { mkdir, rmdir, stat } from "node:fs/promises";
import { join } from "node:path";

interface FileLockOptions {
  retries?: { retries?: number; minTimeout?: number; maxTimeout?: number };
  stale?: number;
}

const DEFAULT_STALE_MS = 10_000; // 10 seconds
const DEFAULT_RETRIES = 30;
const DEFAULT_MIN_TIMEOUT = 100;
const DEFAULT_MAX_TIMEOUT = 1_000;

/**
 * Acquire a directory-based lock, run fn, then release.
 * Drop-in replacement for openclaw/plugin-sdk withFileLock.
 */
export async function withFileLock<T>(
  filePath: string,
  opts: FileLockOptions | undefined,
  fn: () => T | Promise<T>,
): Promise<T> {
  const lockDir = filePath + ".lock";
  const staleMs = opts?.stale ?? DEFAULT_STALE_MS;
  const maxRetries = opts?.retries?.retries ?? DEFAULT_RETRIES;
  const minTimeout = opts?.retries?.minTimeout ?? DEFAULT_MIN_TIMEOUT;
  const maxTimeout = opts?.retries?.maxTimeout ?? DEFAULT_MAX_TIMEOUT;

  // Try to acquire lock with retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await mkdir(lockDir);
      // Lock acquired
      break;
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EEXIST") throw err;

      // Lock exists — check if stale
      try {
        const st = await stat(lockDir);
        if (Date.now() - st.mtimeMs > staleMs) {
          // Stale lock — force remove and retry immediately
          try {
            await rmdir(lockDir);
          } catch {
            // Another process may have removed it
          }
          continue;
        }
      } catch {
        // Lock was removed between our check — retry
        continue;
      }

      if (attempt >= maxRetries) {
        throw new Error(`Could not acquire lock on ${filePath} after ${maxRetries} retries`);
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        minTimeout * Math.pow(1.5, attempt) + Math.random() * 50,
        maxTimeout,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  // Execute fn under lock, always release
  try {
    return await fn();
  } finally {
    try {
      await rmdir(lockDir);
    } catch {
      // Best-effort unlock
    }
  }
}
