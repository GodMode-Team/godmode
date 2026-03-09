/**
 * child-env.ts — Cross-platform child process environment builder.
 *
 * Provides a whitelisted env for spawning agent CLI processes (claude, codex, gemini).
 * Avoids leaking the full parent environment while ensuring binaries are discoverable
 * on macOS (Homebrew), Linux, and Windows.
 */

import { existsSync } from "node:fs";
import { homedir } from "node:os";

/** Directories commonly containing agent CLI binaries. */
const EXTRA_BIN_DIRS = [
  "/opt/homebrew/bin",  // macOS Apple Silicon (Homebrew)
  "/usr/local/bin",     // macOS Intel (Homebrew) + Linux standard
];

/**
 * Build a whitelisted environment for spawning agent child processes.
 *
 * Fixes:
 * - PATH: dynamically prepends common bin dirs only if they exist
 * - HOME: uses os.homedir() (cross-platform)
 * - USER: falls back to USERNAME (Windows)
 * - SHELL: falls back to /bin/sh (POSIX) instead of /bin/zsh
 * - API keys: always forwarded when present
 */
export function buildChildEnv(
  extraKeys?: Record<string, string>,
): Record<string, string> {
  let enrichedPath = process.env.PATH ?? "";

  // Prepend common bin dirs that exist but aren't already on PATH
  for (const dir of EXTRA_BIN_DIRS) {
    if (!enrichedPath.includes(dir) && existsSync(dir)) {
      enrichedPath = `${dir}:${enrichedPath}`;
    }
  }

  const env: Record<string, string> = {
    PATH: enrichedPath,
    HOME: homedir(),
    USER: process.env.USER ?? process.env.USERNAME ?? "",
    SHELL:
      process.env.SHELL ??
      (process.platform === "win32" ? "cmd.exe" : "/bin/sh"),
    LANG: process.env.LANG ?? "en_US.UTF-8",
    TERM: process.env.TERM ?? "xterm-256color",
  };

  // Forward non-Anthropic API keys when present.
  // ANTHROPIC_API_KEY is intentionally NOT forwarded — child processes
  // should use OAuth/Max subscription via the CLI, not the direct API.
  for (const key of [
    "OPENAI_API_KEY",
    "GEMINI_API_KEY",
  ]) {
    if (process.env[key]) {
      env[key] = process.env[key]!;
    }
  }

  if (extraKeys) {
    Object.assign(env, extraKeys);
  }

  return env;
}

/**
 * Return the current PATH with common bin dirs prepended (if they exist).
 * Useful for exec() calls that inherit process.env but need Homebrew/standard paths.
 */
export function enrichedPath(): string {
  let p = process.env.PATH ?? "";
  for (const dir of EXTRA_BIN_DIRS) {
    if (!p.includes(dir) && existsSync(dir)) {
      p = `${dir}:${p}`;
    }
  }
  return p;
}

/**
 * Resolve a path to bash, or null if unavailable.
 * On Windows, checks for Git Bash and WSL bash.
 */
export function resolveBashBin(): string | null {
  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Git\\bin\\bash.exe",
      "C:\\Windows\\System32\\bash.exe", // WSL
    ];
    for (const c of candidates) {
      if (existsSync(c)) return c;
    }
    return null;
  }
  if (existsSync("/bin/bash")) return "/bin/bash";
  if (existsSync("/usr/bin/bash")) return "/usr/bin/bash";
  return "bash"; // assume it's on PATH
}
