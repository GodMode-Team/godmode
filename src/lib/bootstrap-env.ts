import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveStateDir } from "./openclaw-state.js";
import {
  mergePersistedCredentialsIntoEnv,
  resolveGodModeRoot,
} from "./credentials-store.js";

export type EnvHydrationResult = {
  envFileKeysLoaded: number;
  persistedKeysLoaded: number;
};

function mergeEnvFileIntoProcess(
  filePath: string,
  env: NodeJS.ProcessEnv,
): number {
  try {
    if (!existsSync(filePath)) return 0;
    const raw = readFileSync(filePath, "utf-8");
    let loaded = 0;
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const cleaned = trimmed.replace(/^export\s+/, "");
      const eqIdx = cleaned.indexOf("=");
      if (eqIdx < 1) continue;
      const key = cleaned.slice(0, eqIdx).trim();
      if (!key || env[key]) continue;
      let value = cleaned.slice(eqIdx + 1).trim();
      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
      loaded += 1;
    }
    return loaded;
  } catch {
    return 0;
  }
}

export function hydrateProcessEnvFromDisk(
  env: NodeJS.ProcessEnv = process.env,
): EnvHydrationResult {
  const openClawEnvPath = join(resolveStateDir(env), ".env");
  const openClawLoaded = mergeEnvFileIntoProcess(openClawEnvPath, env);

  const godModeEnvPath = join(resolveGodModeRoot(env), ".env");
  const godModeLoaded = mergeEnvFileIntoProcess(godModeEnvPath, env);

  // Also load from CWD .env (covers standalone mode running from source)
  const cwdEnvPath = join(process.cwd(), ".env");
  const cwdLoaded = mergeEnvFileIntoProcess(cwdEnvPath, env);

  const persistedKeysLoaded = mergePersistedCredentialsIntoEnv(env).length;
  return {
    envFileKeysLoaded: openClawLoaded + godModeLoaded + cwdLoaded,
    persistedKeysLoaded,
  };
}

hydrateProcessEnvFromDisk();
