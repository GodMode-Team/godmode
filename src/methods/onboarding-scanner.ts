/**
 * onboarding-scanner.ts — Reads and audits the user's current OC configuration.
 *
 * Produces an AssessmentResult with a health score (0-100) that tells both
 * the agent and the UI how well the user's setup is configured.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { homedir } from "node:os";
import type { AssessmentResult, FeatureCheck } from "./onboarding-types.js";

const OC_DIR = join(homedir(), ".openclaw");
const OC_CONFIG = join(OC_DIR, "openclaw.json");
const AUTH_PROFILES = join(OC_DIR, "auth-profiles.json");
const GODMODE_ROOT = process.env.GODMODE_ROOT || join(homedir(), "godmode");
const MEMORY_DIR = join(GODMODE_ROOT, "memory");

// ── Helpers ──────────────────────────────────────────────────────

async function safeReadJson<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function dirExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isFile();
  } catch {
    return false;
  }
}

async function countFilesAndSize(dir: string): Promise<{ count: number; totalBytes: number }> {
  let count = 0;
  let totalBytes = 0;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      count++;
      try {
        const s = await stat(join(dir, entry.name));
        totalBytes += s.size;
      } catch {
        // skip
      }
    }
  } catch {
    // dir doesn't exist
  }
  return { count, totalBytes };
}

// ── Detect auth method ───────────────────────────────────────────

type AuthProfile = {
  provider?: string;
  authType?: string;
  type?: string;
};

async function detectAuthMethod(): Promise<AssessmentResult["authMethod"]> {
  const profiles = await safeReadJson<AuthProfile[]>(AUTH_PROFILES);
  if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
    // Check for env var fallback
    if (process.env.ANTHROPIC_API_KEY) return "api-key";
    return "none";
  }

  const first = profiles[0];
  const authType = (first.authType ?? first.type ?? "").toLowerCase();

  if (authType.includes("oauth") || authType.includes("claude-max") || authType.includes("setup-token")) {
    return "claude-max";
  }
  if (authType.includes("api-key") || authType.includes("apikey")) {
    return "api-key";
  }
  if (authType.includes("oauth")) {
    return "oauth";
  }
  return "unknown";
}

// ── Detect channels ──────────────────────────────────────────────

async function detectChannels(config: Record<string, unknown>): Promise<string[]> {
  const channels: string[] = [];
  const channelKeys = [
    "telegram", "discord", "slack", "signal", "imessage", "whatsapp",
    "web", "matrix", "msteams", "nostr", "zalo",
  ];

  for (const key of channelKeys) {
    const section = config[key] as Record<string, unknown> | undefined;
    if (section && typeof section === "object") {
      // Check if there's a token/bot config
      const hasToken = Boolean(
        section.token || section.botToken || section.apiKey ||
        section.enabled || section.phoneNumber,
      );
      if (hasToken) {
        channels.push(key);
      }
    }
  }

  return channels;
}

// ── Detect skills ────────────────────────────────────────────────

async function detectSkills(): Promise<string[]> {
  const skills: string[] = [];
  const skillsDirs = [
    join(GODMODE_ROOT, "skills"),
    join(OC_DIR, "skills"),
  ];

  for (const dir of skillsDirs) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && (extname(entry.name) === ".md" || extname(entry.name) === ".yaml")) {
          skills.push(entry.name.replace(/\.(md|yaml|yml)$/, ""));
        }
      }
    } catch {
      // dir doesn't exist
    }
  }

  return [...new Set(skills)];
}

// ── Feature checks ───────────────────────────────────────────────

function checkFeatures(config: Record<string, unknown>): FeatureCheck[] {
  const defaults = config.agentDefaults as Record<string, unknown> | undefined;
  const checks: FeatureCheck[] = [];

  const features: Array<{ key: string; label: string; path: string[]; defaultVal?: boolean }> = [
    { key: "memorySearch", label: "Memory Search", path: ["agentDefaults", "memorySearch"], defaultVal: true },
    { key: "heartbeat", label: "Heartbeat", path: ["heartbeat", "enabled"] },
    { key: "subagents", label: "Sub-agents", path: ["agentDefaults", "subagents"] },
    { key: "thinkingDefault", label: "Extended Thinking", path: ["agentDefaults", "thinkingDefault"] },
    { key: "contextPruning", label: "Context Pruning", path: ["agentDefaults", "contextPruning"] },
    { key: "cron", label: "Cron Jobs", path: ["cron", "enabled"] },
  ];

  for (const f of features) {
    let val: unknown = config;
    for (const segment of f.path) {
      val = (val as Record<string, unknown>)?.[segment];
    }
    const enabled = val !== undefined ? Boolean(val) : Boolean(f.defaultVal);
    checks.push({ key: f.key, label: f.label, enabled });
  }

  return checks;
}

// ── Health Score ─────────────────────────────────────────────────

function calculateHealthScore(result: Omit<AssessmentResult, "healthScore" | "timestamp">): number {
  let score = 0;

  // Config exists + auth configured: 20 pts
  if (result.configExists) score += 10;
  if (result.authMethod !== "none") score += 10;

  // Memory dir + MEMORY.md + >3 files: 15 pts
  if (result.memoryStatus.dirExists) score += 5;
  if (result.memoryStatus.hasMemoryMd) score += 5;
  if (result.memoryStatus.fileCount > 3) score += 5;

  // At least 1 channel connected: 15 pts
  if (result.channelsConnected.length > 0) score += 15;

  // Key features enabled (6 features x 5 pts): 30 pts
  for (const f of result.features) {
    if (f.enabled) score += 5;
  }

  // Workspace configured: 10 pts
  if (result.workspaceConfigured) score += 10;

  // Skills installed: 10 pts
  if (result.skillsInstalled.length > 0) score += 5;
  if (result.skillsInstalled.length >= 3) score += 5;

  return Math.min(100, score);
}

// ── Config Recommendations ───────────────────────────────────────

export type ConfigRecommendation = {
  key: string;
  label: string;
  currentValue: unknown;
  recommendedValue: unknown;
  reason: string;
  priority: "critical" | "recommended" | "optional";
};

/**
 * Generate specific OC config recommendations for GodMode users.
 * Reads the current config and compares against the ideal GodMode setup.
 */
export async function generateConfigRecommendations(): Promise<ConfigRecommendation[]> {
  const config = await safeReadJson<Record<string, unknown>>(OC_CONFIG) ?? {};
  const recommendations: ConfigRecommendation[] = [];

  const gateway = config.gateway as Record<string, unknown> | undefined;
  const agents = config.agents as Record<string, unknown> | undefined;
  const defaults = (agents?.defaults ?? config.agentDefaults) as Record<string, unknown> | undefined;
  const tools = config.tools as Record<string, unknown> | undefined;
  const plugins = config.plugins as Record<string, unknown> | undefined;
  const cron = config.cron as Record<string, unknown> | undefined;
  const session = config.session as Record<string, unknown> | undefined;

  // Critical: gateway.mode must be "local"
  if (gateway?.mode !== "local") {
    recommendations.push({
      key: "gateway.mode",
      label: "Gateway mode",
      currentValue: gateway?.mode ?? "not set",
      recommendedValue: "local",
      reason: "Required for GodMode to run. The gateway refuses to start without this.",
      priority: "critical",
    });
  }

  // Critical: gateway.controlUi
  const controlUi = gateway?.controlUi as Record<string, unknown> | undefined;
  if (!controlUi?.enabled) {
    recommendations.push({
      key: "gateway.controlUi.enabled",
      label: "Control UI",
      currentValue: controlUi?.enabled ?? false,
      recommendedValue: true,
      reason: "Enables the GodMode web interface.",
      priority: "critical",
    });
  }

  // Recommended: memory search
  const memSearch = defaults?.memorySearch as Record<string, unknown> | undefined;
  if (!memSearch?.enabled) {
    recommendations.push({
      key: "agents.defaults.memorySearch.enabled",
      label: "Memory search",
      currentValue: false,
      recommendedValue: true,
      reason: "Core learning mechanism. Your agent gets smarter with every conversation.",
      priority: "recommended",
    });
  }

  // Recommended: session memory indexing
  const experimental = memSearch?.experimental as Record<string, unknown> | undefined;
  if (memSearch?.enabled && !experimental?.sessionMemory) {
    recommendations.push({
      key: "agents.defaults.memorySearch.experimental.sessionMemory",
      label: "Session memory indexing",
      currentValue: false,
      recommendedValue: true,
      reason: "Indexes past conversations so the agent learns from your entire history.",
      priority: "recommended",
    });
  }

  // Recommended: compaction mode
  const compaction = defaults?.compaction as Record<string, unknown> | undefined;
  if (compaction?.mode !== "safeguard") {
    recommendations.push({
      key: "agents.defaults.compaction.mode",
      label: "Compaction mode",
      currentValue: compaction?.mode ?? "default",
      recommendedValue: "safeguard",
      reason: "Safer for complex reasoning. Prevents context loss during compression.",
      priority: "recommended",
    });
  }

  // Recommended: memory flush
  const memFlush = compaction?.memoryFlush as Record<string, unknown> | undefined;
  if (!memFlush?.enabled) {
    recommendations.push({
      key: "agents.defaults.compaction.memoryFlush.enabled",
      label: "Pre-compaction memory flush",
      currentValue: false,
      recommendedValue: true,
      reason: "Writes learned insights to permanent storage before context is compressed.",
      priority: "recommended",
    });
  }

  // Recommended: heartbeat
  const heartbeat = defaults?.heartbeat as Record<string, unknown> | undefined;
  if (!heartbeat?.enabled) {
    recommendations.push({
      key: "agents.defaults.heartbeat.enabled",
      label: "Heartbeat",
      currentValue: false,
      recommendedValue: true,
      reason: "Powers the daily brief and morning set routine.",
      priority: "recommended",
    });
  }

  // Recommended: user timezone
  if (!defaults?.userTimezone) {
    recommendations.push({
      key: "agents.defaults.userTimezone",
      label: "Timezone",
      currentValue: "not set",
      recommendedValue: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reason: "Correct timezone ensures morning brief, session resets, and daily notes work correctly.",
      priority: "recommended",
    });
  }

  // Recommended: thinking
  if (!defaults?.thinkingDefault) {
    recommendations.push({
      key: "agents.defaults.thinkingDefault",
      label: "Extended thinking",
      currentValue: "off",
      recommendedValue: "low",
      reason: "Enables extended thinking for better reasoning quality.",
      priority: "recommended",
    });
  }

  // Recommended: tools profile
  if (!tools?.profile || tools.profile === "minimal") {
    recommendations.push({
      key: "tools.profile",
      label: "Tool profile",
      currentValue: tools?.profile ?? "not set",
      recommendedValue: "full",
      reason: "Full profile unlocks web search, media understanding, and shell execution.",
      priority: "recommended",
    });
  }

  // Recommended: web search
  const webTools = tools?.web as Record<string, unknown> | undefined;
  const search = webTools?.search as Record<string, unknown> | undefined;
  if (!search?.provider) {
    recommendations.push({
      key: "tools.web.search.provider",
      label: "Web search provider",
      currentValue: "not set",
      recommendedValue: "brave",
      reason: "Enables real-time web search for research and fact-checking.",
      priority: "recommended",
    });
  }

  // Recommended: loop detection
  const loopDetection = tools?.loopDetection as Record<string, unknown> | undefined;
  if (!loopDetection?.enabled) {
    recommendations.push({
      key: "tools.loopDetection.enabled",
      label: "Loop detection",
      currentValue: false,
      recommendedValue: true,
      reason: "Prevents the agent from getting stuck in tool-call loops.",
      priority: "recommended",
    });
  }

  // Critical: plugins enabled
  if (!plugins?.enabled) {
    recommendations.push({
      key: "plugins.enabled",
      label: "Plugin system",
      currentValue: false,
      recommendedValue: true,
      reason: "Required for GodMode plugin to load.",
      priority: "critical",
    });
  }

  // Optional: cron
  if (!cron?.enabled) {
    recommendations.push({
      key: "cron.enabled",
      label: "Cron jobs",
      currentValue: false,
      recommendedValue: true,
      reason: "Enables scheduled tasks like evening journal capture and weekly reviews.",
      priority: "optional",
    });
  }

  // Optional: session idle reset
  const reset = session?.reset as Record<string, unknown> | undefined;
  if (!reset?.mode) {
    recommendations.push({
      key: "session.reset.mode",
      label: "Session reset",
      currentValue: "not set",
      recommendedValue: "idle",
      reason: "Clears context after inactivity for a fresh start.",
      priority: "optional",
    });
  }

  return recommendations;
}

// ── Main Scanner ─────────────────────────────────────────────────

export async function runAssessment(): Promise<AssessmentResult> {
  const config = await safeReadJson<Record<string, unknown>>(OC_CONFIG) ?? {};
  const configExists = Object.keys(config).length > 0;

  const authMethod = await detectAuthMethod();

  const memDirExists = await dirExists(MEMORY_DIR);
  const hasMemoryMd = await fileExists(join(MEMORY_DIR, "MEMORY.md"));
  const { count: fileCount, totalBytes } = await countFilesAndSize(MEMORY_DIR);

  const channelsConnected = await detectChannels(config);
  const skillsInstalled = await detectSkills();
  const features = checkFeatures(config);

  // Check workspace — look for godmode/data existing with content
  const dataDir = join(GODMODE_ROOT, "data");
  const workspaceConfigured = await dirExists(dataDir);

  const partial = {
    configExists,
    authMethod,
    memoryStatus: {
      dirExists: memDirExists,
      hasMemoryMd,
      fileCount,
      totalSizeKb: Math.round(totalBytes / 1024),
    },
    channelsConnected,
    skillsInstalled,
    features,
    workspaceConfigured,
  };

  return {
    ...partial,
    healthScore: calculateHealthScore(partial),
    timestamp: new Date().toISOString(),
  };
}
