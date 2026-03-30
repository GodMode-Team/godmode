/**
 * resolve-claude-bin.ts — Resolves AI CLI binary paths (Claude, Codex, Gemini).
 *
 * Checks engine-specific env vars, then searches common installation locations.
 * Works cross-platform (macOS Homebrew, Linux, npm global installs).
 */

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import type { AgentEngine } from "./agent-roster.js";

// ── Per-engine search paths ──────────────────────────────────────

const ENGINE_CONFIG: Record<
  AgentEngine,
  { envVar: string; searchPaths: string[]; fallback: string }
> = {
  claude: {
    envVar: "CLAUDE_BIN",
    searchPaths: [
      "/opt/homebrew/bin/claude",
      "/usr/local/bin/claude",
      "/usr/bin/claude",
    ],
    fallback: "claude",
  },
  codex: {
    envVar: "CODEX_BIN",
    searchPaths: [
      "/opt/homebrew/bin/codex",
      "/usr/local/bin/codex",
      "/usr/bin/codex",
    ],
    fallback: "codex",
  },
  gemini: {
    envVar: "GEMINI_BIN",
    searchPaths: [
      "/opt/homebrew/bin/gemini",
      "/usr/local/bin/gemini",
      "/usr/bin/gemini",
    ],
    fallback: "gemini",
  },
  hermes: {
    envVar: "HERMES_BIN",
    searchPaths: [
      "/opt/homebrew/bin/hermes",
      "/usr/local/bin/hermes",
      "/usr/bin/hermes",
    ],
    fallback: "hermes",
  },
};

// ── Cache ────────────────────────────────────────────────────────

const _binCache: Partial<Record<AgentEngine, string>> = {};

// ── Resolver ─────────────────────────────────────────────────────

function resolveEngineBin(engine: AgentEngine): string {
  if (_binCache[engine]) return _binCache[engine];

  const cfg = ENGINE_CONFIG[engine];

  // 1. Explicit env var
  const envBin = process.env[cfg.envVar]?.trim();
  if (envBin) {
    _binCache[engine] = envBin;
    return envBin;
  }

  // 2. Check common paths
  for (const p of cfg.searchPaths) {
    if (existsSync(p)) {
      _binCache[engine] = p;
      return p;
    }
  }

  // 3. Try `which <engine>` as last resort
  try {
    const result = execSync(`which ${engine}`, {
      encoding: "utf-8",
      timeout: 3000,
    }).trim();
    if (result) {
      _binCache[engine] = result;
      return result;
    }
  } catch {
    // Not found
  }

  // 4. Fallback to bare name
  _binCache[engine] = cfg.fallback;
  return cfg.fallback;
}

/** Check if an engine's CLI binary is actually installed. */
export function isEngineAvailable(engine: AgentEngine): boolean {
  const cfg = ENGINE_CONFIG[engine];

  // Check env var
  const envBin = process.env[cfg.envVar]?.trim();
  if (envBin && existsSync(envBin)) return true;

  // Check search paths
  for (const p of cfg.searchPaths) {
    if (existsSync(p)) return true;
  }

  // Try `which`
  try {
    const result = execSync(`which ${engine}`, {
      encoding: "utf-8",
      timeout: 3000,
    }).trim();
    if (result) return true;
  } catch {
    // Not found
  }

  return false;
}

// ── Public API ───────────────────────────────────────────────────

/** Resolve the Claude CLI binary path (backward-compatible). */
export function resolveClaudeBin(): string {
  return resolveEngineBin("claude");
}

/** Resolve any engine's CLI binary path. */
export function resolveAgentBin(engine: AgentEngine): string {
  return resolveEngineBin(engine);
}

/**
 * Build the spawn arguments for a given engine.
 * Each engine has a different CLI interface.
 */
export function buildSpawnArgs(
  engine: AgentEngine,
  prompt: string,
  options?: { model?: string; maxBudgetUsd?: number },
): { bin: string; args: string[] } {
  const bin = resolveEngineBin(engine);

  switch (engine) {
    case "claude": {
      const model = options?.model ?? "opus";
      const budget = options?.maxBudgetUsd ?? 5;
      return {
        bin,
        args: [
          "-p", prompt,
          "--model", model,
          "--output-format", "text",
          "--max-budget-usd", String(budget),
          "--verbose",
          "--dangerously-skip-permissions",
        ],
      };
    }
    case "codex":
      return {
        bin,
        args: [
          "exec",
          prompt,
          "--dangerously-bypass-approvals-and-sandbox",
        ],
      };
    case "gemini":
      // Gemini CLI uses similar pattern to Claude
      return {
        bin,
        args: ["-p", prompt],
      };
    case "hermes":
      return {
        bin,
        args: [
          "chat", "--quiet",
          "-q", prompt,
          "--model", options?.model ?? "deepseek-v3.2",
          "--yolo",
        ],
      };
  }
}
