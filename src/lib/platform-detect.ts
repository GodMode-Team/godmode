/**
 * platform-detect.ts — OS, architecture, and CLI detection helpers.
 *
 * Used by the integration registry to filter by platform,
 * generate platform-specific setup instructions, and detect available tools.
 */

import { execFileSync } from "node:child_process";
import { PLATFORM_CACHE_TTL_MS } from "./constants.js";

export type PlatformInfo = {
  os: "darwin" | "linux" | "win32" | string;
  arch: string;
  isHeadless: boolean;
  shell: string;
  packageManagers: string[];
  clis: Record<string, boolean>;
};

const CLI_NAMES = ["gog", "gh", "ob", "tailscale", "claude", "node", "npm"] as const;

/** Check if a CLI binary is reachable on PATH. */
function cliExists(name: string): boolean {
  const cmd = process.platform === "win32" ? "where" : "which";
  try {
    execFileSync(cmd, [name], { timeout: 3_000, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/** Detect if we're in a headless / server environment (no display). */
function detectHeadless(): boolean {
  if (process.platform === "win32") return false;
  if (process.platform === "darwin") return false; // macOS always has a display context
  // Linux: check for DISPLAY or WAYLAND_DISPLAY
  return !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY;
}

/** Detect available package managers. */
function detectPackageManagers(): string[] {
  const managers: string[] = [];
  const candidates = ["brew", "apt", "winget", "npm", "pnpm"];
  for (const m of candidates) {
    if (cliExists(m)) managers.push(m);
  }
  return managers;
}

let cached: PlatformInfo | null = null;
let cacheTs = 0;
const CACHE_TTL = PLATFORM_CACHE_TTL_MS;

/** Detect full platform info (cached for 1 minute). */
export function detectPlatform(): PlatformInfo {
  const now = Date.now();
  if (cached && now - cacheTs < CACHE_TTL) return cached;

  const clis: Record<string, boolean> = {};
  for (const name of CLI_NAMES) {
    clis[name] = cliExists(name);
  }

  cached = {
    os: process.platform,
    arch: process.arch,
    isHeadless: detectHeadless(),
    shell: process.env.SHELL ?? (process.platform === "win32" ? "powershell" : "/bin/sh"),
    packageManagers: detectPackageManagers(),
    clis,
  };
  cacheTs = now;
  return cached;
}

/** Reset cache (e.g. after installing a new CLI). */
export function resetPlatformCache(): void {
  cached = null;
  cacheTs = 0;
}
