/**
 * qmd-status.ts — Shared qmd binary detection and status helpers.
 *
 * GodMode's default memory backend expects the qmd CLI to be available.
 * This module centralizes detection so startup, health checks, onboarding,
 * and search fallback all agree on the same state.
 */

import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
import { resolveConfigPath } from "./openclaw-state.js";

const execFileAsync = promisify(execFile);
const CACHE_TTL_MS = 60_000;
const QMD_INSTALL_COMMAND = "npm install -g @tobilu/qmd";
const QMD_MISSING_MESSAGE = `qmd binary not found. Install with: ${QMD_INSTALL_COMMAND}`;

export type QmdStatus = {
  checkedAt: string;
  available: boolean;
  path: string | null;
  version: string | null;
  backend: string;
  backendConfigured: boolean;
  status: "ready" | "degraded" | "disabled";
  warning: string | null;
  installCommand: string;
  fallbackMode: "file-walk";
};

let cachedStatus: QmdStatus | null = null;
let cachedAt = 0;
let inflight: Promise<QmdStatus> | null = null;

export function getQmdInstallCommand(): string {
  return QMD_INSTALL_COMMAND;
}

export function getQmdMissingMessage(): string {
  return QMD_MISSING_MESSAGE;
}

export function getConfiguredMemoryBackend(): string {
  try {
    const configPath = resolveConfigPath();
    if (!existsSync(configPath)) return "qmd";

    const raw = JSON.parse(readFileSync(configPath, "utf-8")) as Record<string, unknown>;
    const memory = raw.memory as Record<string, unknown> | undefined;
    const backend = typeof memory?.backend === "string" ? memory.backend.trim() : "";
    return backend || "qmd";
  } catch {
    return "qmd";
  }
}

async function resolveQmdBinaryPath(): Promise<string | null> {
  try {
    if (process.platform === "win32") {
      const { stdout } = await execFileAsync("where", ["qmd"], { timeout: 3_000 });
      return stdout.trim().split(/\r?\n/).find(Boolean) ?? null;
    }

    const { stdout } = await execFileAsync("sh", ["-lc", "command -v qmd || which qmd"], {
      timeout: 3_000,
    });
    return stdout.trim().split(/\r?\n/).find(Boolean) ?? null;
  } catch {
    return null;
  }
}

async function readQmdVersion(binaryPath: string): Promise<string | null> {
  try {
    const { stdout, stderr } = await execFileAsync(binaryPath, ["--version"], { timeout: 3_000 });
    const output = `${stdout ?? ""}${stderr ?? ""}`.trim();
    return output || null;
  } catch {
    return null;
  }
}

async function detectQmdStatus(): Promise<QmdStatus> {
  const backend = getConfiguredMemoryBackend();
  const backendConfigured = backend === "qmd";
  const path = await resolveQmdBinaryPath();
  const available = Boolean(path);
  const version = path ? await readQmdVersion(path) : null;

  return {
    checkedAt: new Date().toISOString(),
    available,
    path,
    version,
    backend,
    backendConfigured,
    status: backendConfigured ? (available ? "ready" : "degraded") : "disabled",
    warning: available ? null : (backendConfigured ? QMD_MISSING_MESSAGE : null),
    installCommand: QMD_INSTALL_COMMAND,
    fallbackMode: "file-walk",
  };
}

export async function getQmdStatus(
  opts: { refresh?: boolean } = {},
): Promise<QmdStatus> {
  const { refresh = false } = opts;
  const now = Date.now();

  if (!refresh && cachedStatus && now - cachedAt < CACHE_TTL_MS) {
    return cachedStatus;
  }

  if (!inflight) {
    inflight = detectQmdStatus()
      .then((status) => {
        cachedStatus = status;
        cachedAt = Date.now();
        return status;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export function getCachedQmdStatus(): QmdStatus | null {
  return cachedStatus;
}
