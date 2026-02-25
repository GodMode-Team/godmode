import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const LEGACY_STATE_DIRS = [".clawdbot", ".moldbot", ".moltbot"] as const;

function expandHome(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed === "~") {
    return os.homedir();
  }
  if (trimmed.startsWith("~/")) {
    return path.join(os.homedir(), trimmed.slice(2));
  }
  return trimmed;
}

export function resolveStateDir(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.OPENCLAW_STATE_DIR?.trim() || env.CLAWDBOT_STATE_DIR?.trim();
  if (explicit) {
    return path.resolve(expandHome(explicit));
  }

  const home = os.homedir();
  const canonical = path.join(home, ".openclaw");
  if (existsSync(canonical)) {
    return canonical;
  }

  for (const legacy of LEGACY_STATE_DIRS) {
    const legacyPath = path.join(home, legacy);
    if (existsSync(legacyPath)) {
      return legacyPath;
    }
  }

  return canonical;
}

export const STATE_DIR = resolveStateDir();

export function resolveConfigPath(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.OPENCLAW_CONFIG_PATH?.trim() || env.CLAWDBOT_CONFIG_PATH?.trim();
  if (explicit) {
    return path.resolve(expandHome(explicit));
  }
  return path.join(resolveStateDir(env), "openclaw.json");
}
