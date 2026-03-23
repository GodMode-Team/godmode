/**
 * onboarding-scanner.ts — Reads and audits the user's current OC configuration.
 *
 * Produces an AssessmentResult with a health score (0-100) that tells both
 * the agent and the UI how well the user's setup is configured.
 */

import { execFile } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { homedir } from "node:os";
import type { AssessmentResult, FeatureCheck } from "./onboarding-types.js";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
// resolveVaultPath not used directly — checkObsidianVault() checks for real Obsidian presence

const OC_DIR = join(homedir(), ".openclaw");
const OC_CONFIG = join(OC_DIR, "openclaw.json");
const AUTH_PROFILES = join(OC_DIR, "auth-profiles.json");
const HERMES_DIR = join(homedir(), ".hermes");
const SOUL_MD = join(MEMORY_DIR, "SOUL.md");

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
  const raw = await safeReadJson<
    | AuthProfile[]
    | { profiles?: Record<string, AuthProfile>; version?: number }
  >(AUTH_PROFILES);

  // Normalize: handle both array format and { profiles: { ... } } object format
  let profiles: AuthProfile[] = [];
  if (Array.isArray(raw)) {
    profiles = raw;
  } else if (raw && typeof raw === "object" && "profiles" in raw && raw.profiles) {
    profiles = Object.values(raw.profiles);
  }

  if (profiles.length === 0) {
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
      // Check if there's a token/bot config with actual values (not empty strings)
      const tokenVal = section.token || section.botToken || section.apiKey;
      const hasRealToken = typeof tokenVal === "string" && tokenVal.length > 5;
      const hasEnabled = section.enabled === true;
      const hasPhone = typeof section.phoneNumber === "string" && section.phoneNumber.length > 3;

      if (hasRealToken || hasEnabled || hasPhone) {
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

// ── GitHub CLI Check ─────────────────────────────────────────────

async function checkGitHubReady(): Promise<boolean> {
  try {
    const exitCode = await new Promise<number>((resolve) => {
      execFile("gh", ["auth", "status"], { timeout: 5_000 }, (err) => {
        resolve(err ? 1 : 0);
      });
    });
    return exitCode === 0;
  } catch {
    return false;
  }
}

// ── Obsidian Vault Check ────────────────────────────────────────

async function checkObsidianVault(): Promise<boolean> {
  // Check if a real Obsidian vault is configured (not just the ~/godmode/memory/ fallback).
  // resolveVaultPath() now always returns a string, so we check specifically for Obsidian.
  if (process.env.OBSIDIAN_VAULT_PATH) return true;
  const defaultVault = join(homedir(), "Documents", "VAULT");
  return dirExists(defaultVault);
}

// ── Existing install detection ───────────────────────────────────

async function countAgentRosterFiles(): Promise<number> {
  let count = 0;
  const rosterDirs = [
    join(MEMORY_DIR, "agent-roster"),
    join(GODMODE_ROOT, "memory", "agent-roster"),
  ];
  // Also check vault roster if OBSIDIAN_VAULT_PATH is set
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH || join(homedir(), "Documents", "VAULT");
  rosterDirs.push(join(vaultPath, "99-System", "agent-roster"));

  const seen = new Set<string>();
  for (const dir of rosterDirs) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && extname(entry.name) === ".md" && !seen.has(entry.name)) {
          seen.add(entry.name);
          count++;
        }
      }
    } catch {
      // dir doesn't exist
    }
  }
  return count;
}

async function countQueueCompleted(): Promise<number> {
  try {
    const queueFile = join(GODMODE_ROOT, "data", "queue.json");
    const raw = await safeReadJson<{ items?: Array<{ status?: string }> }>(queueFile);
    if (!raw?.items) return 0;
    return raw.items.filter((i) => i.status === "done" || i.status === "review" || i.status === "needs-review").length;
  } catch {
    return 0;
  }
}

// ── Health Score ─────────────────────────────────────────────────

function calculateHealthScore(result: Omit<AssessmentResult, "healthScore" | "timestamp">): number {
  let score = 0;

  // Config exists + auth configured: 15 pts
  if (result.configExists) score += 8;
  if (result.authMethod !== "none") score += 7;

  // Memory dir + MEMORY.md + >3 files: 10 pts
  if (result.memoryStatus.dirExists) score += 3;
  if (result.memoryStatus.hasMemoryMd) score += 4;
  if (result.memoryStatus.fileCount > 3) score += 3;

  // At least 1 channel connected: 5 pts
  if (result.channelsConnected.length > 0) score += 5;

  // Key features enabled (6 features x 4 pts): 24 pts
  for (const f of result.features) {
    if (f.enabled) score += 4;
  }

  // Workspace configured: 6 pts
  if (result.workspaceConfigured) score += 6;

  // Skills installed: 5 pts
  if (result.skillsInstalled.length > 0) score += 3;
  if (result.skillsInstalled.length >= 3) score += 2;

  // Integrations configured: 35 pts (5 pts each for 6 core + 1 for deep presence)
  if (result.integrationsStatus) {
    const coreIds = ["x-intelligence", "tailscale", "google-calendar", "obsidian-vault", "github-cli", "messaging-channel", "honcho-memory"];
    for (const id of coreIds) {
      const s = result.integrationsStatus[id];
      if (s?.configured || s?.working) score += 5;
    }
    // Bonus for any deep integrations
    const deepIds = ["oura-ring", "weather", "obsidian-sync", "composio"];
    const anyDeep = deepIds.some(id => result.integrationsStatus![id]?.configured);
    if (anyDeep) score += 5;
  }

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
  const sessions = config.sessions as Record<string, unknown> | undefined;

  // Critical: gateway security token (check both gateway.token and gateway.auth.token)
  const gatewayAuth = gateway?.auth as Record<string, unknown> | undefined;
  const hasGatewayToken = Boolean(gateway?.token) || Boolean(gatewayAuth?.token);
  if (!hasGatewayToken) {
    recommendations.push({
      key: "gateway.auth.token",
      label: "Gateway security token",
      currentValue: "not set",
      recommendedValue: "(auto-generated 256-bit token)",
      reason: "Without a token, any process on your machine can send commands to the agent via the WebSocket port.",
      priority: "critical",
    });
  }

  // Critical: DM session isolation
  if (sessions?.dmScope !== "per-channel-peer") {
    recommendations.push({
      key: "sessions.dmScope",
      label: "DM session isolation",
      currentValue: sessions?.dmScope ?? "not set",
      recommendedValue: "per-channel-peer",
      reason: "Set dmScope to per-channel-peer to prevent DM data leaking between users.",
      priority: "critical",
    });
  }

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
  // OC enables the control UI when the controlUi section exists with real
  // configuration (allowedOrigins, etc.), not necessarily an `enabled` boolean.
  const controlUi = gateway?.controlUi as Record<string, unknown> | undefined;
  const controlUiActive = controlUi && (
    controlUi.enabled === true ||
    Array.isArray(controlUi.allowedOrigins) ||
    typeof controlUi.path === "string"
  );
  if (!controlUiActive) {
    recommendations.push({
      key: "gateway.controlUi.enabled",
      label: "Control UI",
      currentValue: controlUi ? "configured (no enabled flag)" : false,
      recommendedValue: true,
      reason: "Enables the GodMode web interface.",
      priority: "critical",
    });
  }

  // Recommended: memory search
  // OC considers memory search active when the section exists with a provider
  // or sources configured, not just via `enabled: true`.
  const memSearch = defaults?.memorySearch as Record<string, unknown> | undefined;
  const memSearchActive = memSearch && (
    memSearch.enabled === true ||
    typeof memSearch.provider === "string" ||
    Array.isArray(memSearch.sources)
  );
  if (!memSearchActive) {
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
  if (memSearchActive && !experimental?.sessionMemory) {
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

  // Recommended: context pruning
  const pruning = defaults?.contextPruning as Record<string, unknown> | undefined;
  if (!pruning || pruning.mode === "off") {
    recommendations.push({
      key: "agents.defaults.contextPruning.mode",
      label: "Context pruning",
      currentValue: pruning?.mode ?? "off",
      recommendedValue: "cache-ttl",
      reason: "Auto-trims stale tool results from context to prevent overflow in long sessions.",
      priority: "recommended",
    });
  }

  // Recommended: heartbeat
  // OC activates the heartbeat when the section exists with a schedule,
  // not just via `enabled: true`.
  const heartbeat = defaults?.heartbeat as Record<string, unknown> | undefined;
  const heartbeatActive = heartbeat && (
    heartbeat.enabled === true ||
    typeof heartbeat.every === "string" ||
    heartbeat.activeHours
  );
  if (!heartbeatActive) {
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
  // Only recommend if tools section exists but loopDetection is completely absent.
  // Many OC setups handle this at the engine level without explicit config.
  const loopDetection = tools?.loopDetection as Record<string, unknown> | undefined;
  const loopDetectionActive = loopDetection && (
    loopDetection.enabled === true ||
    typeof loopDetection.maxIterations === "number" ||
    typeof loopDetection.strategy === "string"
  );
  if (tools && !loopDetectionActive) {
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
  // OC activates plugins when entries/allow/load are configured, not just
  // via a top-level `enabled` boolean. If GodMode is in the entries list and
  // marked enabled, the plugin system is clearly working.
  const pluginsActive = plugins && (
    plugins.enabled === true ||
    (plugins.entries && typeof plugins.entries === "object" && Object.keys(plugins.entries as object).length > 0) ||
    (Array.isArray(plugins.allow) && (plugins.allow as unknown[]).length > 0)
  );
  if (!pluginsActive) {
    recommendations.push({
      key: "plugins.enabled",
      label: "Plugin system",
      currentValue: false,
      recommendedValue: true,
      reason: "Required for GodMode plugin to load.",
      priority: "critical",
    });
  }

  // Recommended: prompt caching for Anthropic models
  const models = defaults?.models as Record<string, unknown> | undefined;
  if (models) {
    for (const [modelId, modelConfig] of Object.entries(models)) {
      if (modelId.startsWith("anthropic/")) {
        const params = (modelConfig as Record<string, unknown>)?.params as Record<string, unknown> | undefined;
        if (params?.cacheRetention !== "long") {
          recommendations.push({
            key: `agents.defaults.models.${modelId}.params.cacheRetention`,
            label: `Prompt caching for ${modelId.replace("anthropic/", "")}`,
            currentValue: (params?.cacheRetention as string) ?? "not set",
            recommendedValue: "long",
            reason: "Reduces costs up to 90% on repeated context. Should always be on for Anthropic models.",
            priority: "recommended",
          });
        }
      }
    }
  } else {
    // No models configured at all — recommend adding caching for common models
    recommendations.push({
      key: "agents.defaults.models",
      label: "Prompt caching (Anthropic models)",
      currentValue: "not configured",
      recommendedValue: '{ "anthropic/claude-sonnet-4-6": { params: { cacheRetention: "long" } } }',
      reason: "Reduces costs up to 90% on repeated context. Should always be on for Anthropic models.",
      priority: "recommended",
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
  const hasMemoryMd = await fileExists(join(GODMODE_ROOT, "data", ".mem0-seeded"))
    || await fileExists(join(MEMORY_DIR, "MEMORY.md"));
  const { count: fileCount, totalBytes } = await countFilesAndSize(MEMORY_DIR);

  const channelsConnected = await detectChannels(config);
  const skillsInstalled = await detectSkills();
  const features = checkFeatures(config);

  // Check workspace — look for godmode/data existing with content
  const dataDir = join(GODMODE_ROOT, "data");
  const workspaceConfigured = await dirExists(dataDir);

  // Check key dependencies
  const githubReady = await checkGitHubReady();
  const obsidianVaultConfigured = await checkObsidianVault();

  // Check gateway token (supports both gateway.token and gateway.auth.token)
  const gateway = config.gateway as Record<string, unknown> | undefined;
  const gwAuth = gateway?.auth as Record<string, unknown> | undefined;
  const gatewayTokenSet = Boolean(gateway?.token) || Boolean(gwAuth?.token);

  // Check integrations from registry
  let integrationsStatus: Record<string, { configured: boolean; working: boolean }> | undefined;
  try {
    const { detectAllIntegrations } = await import("../lib/integration-registry.js");
    const statuses = await detectAllIntegrations();
    integrationsStatus = {};
    for (const [id, s] of Object.entries(statuses)) {
      integrationsStatus[id] = { configured: s.configured, working: s.working };
    }
  } catch { /* integration registry not available */ }

  // Detect existing install state (Hermes, SOUL.md, agent roster, queue history)
  const [soulMdExists, agentRosterCount, hermesDetected, queueCompletedCount] = await Promise.all([
    fileExists(SOUL_MD),
    countAgentRosterFiles(),
    dirExists(HERMES_DIR),
    countQueueCompleted(),
  ]);

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
    githubReady,
    obsidianVaultConfigured,
    gatewayTokenSet,
    integrationsStatus,
    soulMdExists,
    agentRosterCount,
    hermesDetected,
    queueCompletedCount,
  };

  return {
    ...partial,
    healthScore: calculateHealthScore(partial),
    timestamp: new Date().toISOString(),
  };
}
