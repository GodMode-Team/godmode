// lib/configure.mjs — env setup, API keys, directory scaffolding
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const home = homedir();

/**
 * Ensure the OpenClaw config directory exists (~/.openclaw).
 */
export function ensureConfigDir() {
  const dir = join(home, ".openclaw");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Ensure the GodMode data directories exist.
 * Creates ~/godmode/data and ~/godmode/memory.
 */
export function ensureGodModeDir() {
  const root = join(home, "godmode");
  const dirs = [
    root,
    join(root, "data"),
    join(root, "memory"),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
  return root;
}

/**
 * Write (or merge) API keys into ~/.openclaw/.env.
 * Preserves existing keys that are not being overwritten.
 *
 * @param {{ anthropicKey?: string, honchoKey?: string, composioKey?: string }} keys
 */
export function writeApiKeys(keys) {
  const configDir = ensureConfigDir();
  const envPath = join(configDir, ".env");

  // Read existing .env if present
  let existing = {};
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim();
        existing[k] = v;
      }
    }
  }

  // Map CLI flags to env var names
  const mapping = {
    anthropicKey: "ANTHROPIC_API_KEY",
    honchoKey: "HONCHO_API_KEY",
    composioKey: "COMPOSIO_API_KEY",
  };

  let changed = false;
  for (const [flag, envName] of Object.entries(mapping)) {
    if (keys[flag]) {
      existing[envName] = keys[flag];
      changed = true;
    }
  }

  if (!changed) return false;

  // Write back
  const lines = Object.entries(existing).map(([k, v]) => `${k}=${v}`);
  writeFileSync(envPath, lines.join("\n") + "\n", "utf8");
  return true;
}

/**
 * Check if any API keys are already configured.
 * @returns {{ hasAnthropic: boolean, hasHoncho: boolean, hasComposio: boolean }}
 */
export function checkExistingKeys() {
  const envPath = join(home, ".openclaw", ".env");
  const result = { hasAnthropic: false, hasHoncho: false, hasComposio: false };

  if (!existsSync(envPath)) return result;

  const content = readFileSync(envPath, "utf8");
  if (content.includes("ANTHROPIC_API_KEY=")) result.hasAnthropic = true;
  if (content.includes("HONCHO_API_KEY=")) result.hasHoncho = true;
  if (content.includes("COMPOSIO_API_KEY=")) result.hasComposio = true;

  return result;
}
