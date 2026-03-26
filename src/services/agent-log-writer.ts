import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type AgentLogWriterModule = {
  initAgentLogWriter?: () => void;
  stopAgentLogWriter?: () => Promise<void>;
};

let loaded: AgentLogWriterModule | null = null;
let attempted = false;

function resolveCandidates(): string[] {
  const thisFile = fileURLToPath(import.meta.url);
  const servicesDir = path.dirname(thisFile);
  const pluginRoot = path.resolve(servicesDir, "..", "..");
  const monorepoRoot = path.resolve(pluginRoot, "..", "..");

  const explicit = (process.env.GODMODE_AGENT_LOG_WRITER_MODULE || "").trim();

  return [
    explicit,
    path.join(monorepoRoot, "src", "infra", "agent-log-writer.js"),
    path.join(monorepoRoot, "dist", "infra", "agent-log-writer.js"),
    path.join(process.cwd(), "src", "infra", "agent-log-writer.js"),
    path.join(process.cwd(), "dist", "infra", "agent-log-writer.js"),
  ].filter(Boolean);
}

async function loadModule(): Promise<AgentLogWriterModule | null> {
  if (loaded) {
    return loaded;
  }
  if (attempted) {
    return null;
  }
  attempted = true;

  for (const candidate of resolveCandidates()) {
    try {
      const url =
        candidate.startsWith("file://") || candidate.startsWith("node:")
          ? candidate
          : pathToFileURL(candidate).href;
      const mod = (await import(url)) as AgentLogWriterModule;
      if (typeof mod.initAgentLogWriter === "function") {
        loaded = mod;
        return loaded;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function initAgentLogWriter(): Promise<boolean> {
  const mod = await loadModule();
  if (!mod?.initAgentLogWriter) {
    return false;
  }
  mod.initAgentLogWriter();
  return true;
}

export async function stopAgentLogWriter(): Promise<boolean> {
  const mod = await loadModule();
  if (!mod?.stopAgentLogWriter) {
    return false;
  }
  await mod.stopAgentLogWriter();
  return true;
}
