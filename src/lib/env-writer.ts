/**
 * env-writer.ts — Atomic read/write helpers for .env files.
 *
 * Primary target: ~/.openclaw/.env (where API keys live).
 * Fallback read: ~/godmode/.env
 */

import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { resolveStateDir } from "./openclaw-state.js";
import { GODMODE_ROOT } from "../data-paths.js";
import { readPersistedCredential } from "./credentials-store.js";

/** Default env file path: ~/.openclaw/.env */
function primaryEnvPath(): string {
  return join(resolveStateDir(), ".env");
}

/** Fallback env file path: ~/godmode/.env */
function fallbackEnvPath(): string {
  return join(GODMODE_ROOT, ".env");
}

/** Parse a .env file into a key-value map. */
export function readEnvFile(filePath?: string): Record<string, string> {
  const paths = filePath ? [filePath] : [primaryEnvPath(), fallbackEnvPath()];
  const vars: Record<string, string> = {};

  for (const p of paths) {
    try {
      const raw = readFileSync(p, "utf-8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const eqIdx = trimmed.indexOf("=");
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (key) vars[key] = value;
      }
    } catch {
      // file not found — try next
    }
  }

  return vars;
}

/**
 * Write or update a single key in a .env file.
 * Uses atomic write (temp file + rename) to avoid corruption.
 */
export function writeEnvVar(key: string, value: string, filePath?: string): void {
  const target = filePath ?? primaryEnvPath();

  // SECURITY: Ensure directory exists with restrictive permissions (owner-only)
  mkdirSync(dirname(target), { recursive: true, mode: 0o700 });

  // Read existing content
  let lines: string[] = [];
  try {
    lines = readFileSync(target, "utf-8").split("\n");
  } catch {
    // File doesn't exist yet — start fresh
  }

  // Find and replace existing key, or append
  let found = false;
  const updated = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) return line;
    const eqIdx = trimmed.indexOf("=");
    const lineKey = trimmed.slice(0, eqIdx).trim();
    if (lineKey === key) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!found) {
    // Ensure there's a newline before appending
    if (updated.length > 0 && updated[updated.length - 1] !== "") {
      updated.push("");
    }
    updated.push(`${key}=${value}`);
  }

  // SECURITY: Atomic write with restrictive permissions (owner read/write only)
  const tmpPath = `${target}.${randomBytes(4).toString("hex")}.tmp`;
  writeFileSync(tmpPath, updated.join("\n"), { encoding: "utf-8", mode: 0o600 });
  renameSync(tmpPath, target);
}

/** Remove a key from a .env file. */
export function removeEnvVar(key: string, filePath?: string): void {
  const target = filePath ?? primaryEnvPath();
  let lines: string[];
  try {
    lines = readFileSync(target, "utf-8").split("\n");
  } catch {
    return; // nothing to remove
  }

  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) return true;
    const eqIdx = trimmed.indexOf("=");
    return trimmed.slice(0, eqIdx).trim() !== key;
  });

  const tmpPath = `${target}.${randomBytes(4).toString("hex")}.tmp`;
  writeFileSync(tmpPath, filtered.join("\n"), { encoding: "utf-8", mode: 0o600 });
  renameSync(tmpPath, target);
}

/** Read a single env var: checks process.env, credentials store, then .env files. */
export function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!;
  const persisted = readPersistedCredential(key);
  if (persisted) return persisted;
  const vars = readEnvFile();
  return vars[key] ?? "";
}
