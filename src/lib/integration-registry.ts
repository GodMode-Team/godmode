/**
 * integration-registry.ts — Declarative integration definitions.
 *
 * Each integration has detect/test/configure functions.
 * Organized into "core" (6 essentials for 80/20 setup) and
 * "deep" (optional extras for power users).
 */

import { execFile } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { detectPlatform } from "./platform-detect.js";
import { getEnvVar, writeEnvVar } from "./env-writer.js";
import { resolveVaultPath, GODMODE_ROOT } from "../data-paths.js";
import { getUserLocation } from "./user-config.js";
import { resolveConfigPath } from "./openclaw-state.js";
import { readFileSync, writeFileSync } from "node:fs";

// ── Types ──────────────────────────────────────────────────────────────

export type IntegrationStatus = {
  configured: boolean;
  cliInstalled: boolean;
  authenticated: boolean;
  working: boolean;
  error?: string;
  details?: string;
};

export type TestResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

export type EnvVarSpec = {
  key: string;
  label: string;
  description: string;
  secret: boolean;
  target: "env" | "options" | "oc-config";
  /** Dot-separated path within the target file (for options/oc-config targets) */
  configPath?: string;
};

export type IntegrationProvider = {
  id: string;
  name: string;
  description: string;
  briefSection?: string;
  tier: "core" | "deep";
  platforms: NodeJS.Platform[];
  envVars: EnvVarSpec[];
  cliDeps: string[];
  detect: () => Promise<IntegrationStatus>;
  test: () => Promise<TestResult>;
  setupSteps: Record<string, string>;
};

// ── Helpers ────────────────────────────────────────────────────────────

function execCheck(cmd: string, args: string[], timeout = 5_000): Promise<{ ok: boolean; stdout: string }> {
  return new Promise((resolve) => {
    execFile(cmd, args, { timeout }, (err, stdout) => {
      resolve({ ok: !err, stdout: stdout?.toString() ?? "" });
    });
  });
}

function readOptionsJson(): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(join(GODMODE_ROOT, "data", "godmode-options.json"), "utf-8"));
  } catch {
    return {};
  }
}

function writeOptionsJson(key: string, value: unknown): void {
  const optPath = join(GODMODE_ROOT, "data", "godmode-options.json");
  const current = readOptionsJson();
  current[key] = value;
  writeFileSync(optPath, JSON.stringify(current, null, 2), "utf-8");
}

function readOcConfig(): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(resolveConfigPath(), "utf-8"));
  } catch {
    return {};
  }
}

function writeOcConfigValue(dotPath: string, value: unknown): void {
  const configPath = resolveConfigPath();
  const config = readOcConfig();
  const parts = dotPath.split(".");
  let obj: Record<string, unknown> = config;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]] || typeof obj[parts[i]] !== "object") {
      obj[parts[i]] = {};
    }
    obj = obj[parts[i]] as Record<string, unknown>;
  }
  obj[parts[parts.length - 1]] = value;
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

// ── Core Integrations (6) ──────────────────────────────────────────────

const xIntelligence: IntegrationProvider = {
  id: "x-intelligence",
  name: "X Intelligence",
  description: "AI-powered news and trend analysis via Grok — powers your daily Intel Scan",
  briefSection: "Intel Scan",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [{
    key: "XAI_API_KEY",
    label: "XAI API Key",
    description: "Get your API key from x.ai/api",
    secret: true,
    target: "env",
  }],
  cliDeps: [],
  detect: async () => {
    const key = getEnvVar("XAI_API_KEY");
    return {
      configured: !!key,
      cliInstalled: true,
      authenticated: !!key,
      working: false, // requires live test
      details: key ? "API key configured" : "XAI_API_KEY not set",
    };
  },
  test: async () => {
    const key = getEnvVar("XAI_API_KEY");
    if (!key) return { success: false, message: "XAI_API_KEY not set" };
    try {
      const resp = await fetch("https://api.x.ai/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(5_000),
      });
      if (resp.ok) return { success: true, message: "Connected to XAI API" };
      return { success: false, message: `XAI API returned ${resp.status}` };
    } catch (err) {
      return { success: false, message: `Connection failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  },
  setupSteps: {
    darwin: "1. Go to [x.ai/api](https://x.ai/api) and create an account\n2. Generate an API key\n3. Paste your key below",
    linux: "1. Go to [x.ai/api](https://x.ai/api) and create an account\n2. Generate an API key\n3. Paste your key below",
    win32: "1. Go to [x.ai/api](https://x.ai/api) and create an account\n2. Generate an API key\n3. Paste your key below",
  },
};

const tailscale: IntegrationProvider = {
  id: "tailscale",
  name: "Tailscale",
  description: "Access GodMode from your phone or any device — critical for remote setups",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [{
    key: "TAILSCALE_HOSTNAME",
    label: "Tailscale Hostname",
    description: "Your machine's Tailscale hostname (e.g. my-server)",
    secret: false,
    target: "env",
  }],
  cliDeps: ["tailscale"],
  detect: async () => {
    const platform = detectPlatform();
    const cliInstalled = platform.clis.tailscale ?? false;
    const hostname = getEnvVar("TAILSCALE_HOSTNAME");
    let authenticated = false;

    if (cliInstalled) {
      const result = await execCheck("tailscale", ["status", "--json"]);
      authenticated = result.ok;
    }

    return {
      configured: !!hostname,
      cliInstalled,
      authenticated,
      working: authenticated && !!hostname,
      details: !cliInstalled ? "Tailscale not installed" : !authenticated ? "Not connected" : hostname ? `Hostname: ${hostname}` : "Hostname not set",
    };
  },
  test: async () => {
    const result = await execCheck("tailscale", ["status", "--json"]);
    if (!result.ok) return { success: false, message: "Tailscale is not running or not installed" };
    try {
      const status = JSON.parse(result.stdout);
      const selfName = status.Self?.HostName ?? "unknown";
      return { success: true, message: `Connected as ${selfName}`, data: { hostname: selfName } };
    } catch {
      return { success: true, message: "Tailscale is connected" };
    }
  },
  setupSteps: {
    darwin: "1. Download [Tailscale](https://tailscale.com/download) and sign in\n2. Once connected, enter your device hostname below\n3. GodMode will configure secure remote access automatically",
    linux: "1. Tailscale is typically installed during GodMode setup\n2. If not installed, visit [tailscale.com](https://tailscale.com/download)\n3. Enter your device hostname below",
    win32: "1. Download [Tailscale](https://tailscale.com/download) and sign in\n2. Once connected, enter your device hostname below",
  },
};

const googleCalendar: IntegrationProvider = {
  id: "google-calendar",
  name: "Google Calendar",
  description: "Your schedule and meeting prep — powers the Calendar section of your daily brief",
  briefSection: "Calendar / Meeting Prep",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [
    {
      key: "GOG_CALENDAR_ACCOUNT",
      label: "Google Account Email",
      description: "The Google account email to pull calendar events from",
      secret: false,
      target: "env",
    },
    {
      key: "GOG_CLIENT",
      label: "gog OAuth Client",
      description: "OAuth client name (default: godmode)",
      secret: false,
      target: "env",
    },
  ],
  cliDeps: ["gog"],
  detect: async () => {
    const platform = detectPlatform();
    const cliInstalled = platform.clis.gog ?? false;
    const account = getEnvVar("GOG_CALENDAR_ACCOUNT");

    return {
      configured: !!account,
      cliInstalled,
      authenticated: false, // can't detect without a test
      working: false,
      details: !cliInstalled ? "gog CLI not installed" : !account ? "Calendar account not set" : `Account: ${account}`,
    };
  },
  test: async () => {
    const account = getEnvVar("GOG_CALENDAR_ACCOUNT");
    if (!account) return { success: false, message: "GOG_CALENDAR_ACCOUNT not set" };
    const client = getEnvVar("GOG_CLIENT") || "godmode";
    const result = await execCheck("gog", [
      "calendar", "events", "--account", account, "--client", client, "--json", "--limit", "1",
    ], 10_000);
    if (result.ok) return { success: true, message: "Calendar events fetched successfully" };
    return { success: false, message: "Could not fetch calendar events — check gog auth" };
  },
  setupSteps: {
    darwin: "1. Enter your Google account email below\n2. Click **Save & Test** — GodMode will install and configure everything automatically\n3. You'll get a link to authorize Google Calendar access in your browser",
    linux: "1. Enter your Google account email below\n2. Click **Save & Test** — GodMode will install and configure everything automatically\n3. You'll get a link to authorize Google Calendar access in your browser",
    win32: "1. Enter your Google account email below\n2. Click **Save & Test** — GodMode will install and configure everything automatically\n3. You'll get a link to authorize Google Calendar access in your browser",
  },
};

const obsidianVault: IntegrationProvider = {
  id: "obsidian-vault",
  name: "Obsidian Vault",
  description: "Your Second Brain — daily briefs, research, and knowledge all live here",
  briefSection: "Daily Brief storage",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [{
    key: "OBSIDIAN_VAULT_PATH",
    label: "Vault Path",
    description: "Path to your Obsidian vault folder (e.g. ~/Documents/VAULT)",
    secret: false,
    target: "env",
  }],
  cliDeps: [],
  detect: async () => {
    const vaultPath = resolveVaultPath();
    const hasDaily = vaultPath ? existsSync(join(vaultPath, "01-Daily")) : false;

    return {
      configured: !!vaultPath,
      cliInstalled: true,
      authenticated: true,
      working: !!vaultPath && hasDaily,
      details: vaultPath ? `Vault at ${vaultPath}` : "No vault found",
    };
  },
  test: async () => {
    const vaultPath = resolveVaultPath();
    if (!vaultPath) return { success: false, message: "No vault path configured" };
    if (!existsSync(vaultPath)) return { success: false, message: `Path does not exist: ${vaultPath}` };

    // Check for PARA folders
    const paraFolders = ["00-Inbox", "01-Daily", "02-Projects", "03-Areas"];
    const existing = paraFolders.filter(f => existsSync(join(vaultPath, f)));
    if (existing.length === 0) {
      return { success: true, message: `Vault exists at ${vaultPath} but no PARA folders yet — they'll be created automatically` };
    }
    return { success: true, message: `Vault ready with ${existing.length} PARA folders` };
  },
  setupSteps: {
    darwin: "1. Download [Obsidian](https://obsidian.md) and create a vault\n2. Enter the vault path below (e.g. `~/Documents/VAULT`)\n3. GodMode will create the folder structure automatically",
    linux: "1. Download [Obsidian](https://obsidian.md) and create a vault\n2. Enter the vault path below\n3. GodMode will create the folder structure automatically",
    win32: "1. Download [Obsidian](https://obsidian.md) and create a vault\n2. Enter the vault path below (e.g. `C:\\Users\\You\\Documents\\VAULT`)\n3. GodMode will create the folder structure automatically",
  },
};

const githubCli: IntegrationProvider = {
  id: "github-cli",
  name: "GitHub CLI",
  description: "Code task orchestration — dispatch coding tasks, create PRs, manage repos",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [],
  cliDeps: ["gh"],
  detect: async () => {
    const platform = detectPlatform();
    const cliInstalled = platform.clis.gh ?? false;
    let authenticated = false;

    if (cliInstalled) {
      const result = await execCheck("gh", ["auth", "status"]);
      authenticated = result.ok;
    }

    return {
      configured: cliInstalled,
      cliInstalled,
      authenticated,
      working: authenticated,
      details: !cliInstalled ? "GitHub CLI not installed" : !authenticated ? "Not authenticated" : "Authenticated",
    };
  },
  test: async () => {
    const result = await execCheck("gh", ["auth", "status"]);
    if (result.ok) return { success: true, message: "GitHub CLI authenticated" };
    return { success: false, message: "GitHub CLI not authenticated — run `gh auth login`" };
  },
  setupSteps: {
    darwin: "1. Click **Save & Test** — GodMode will install GitHub CLI automatically\n2. You'll be prompted to authenticate via your browser\n3. Once connected, GodMode can create PRs and manage repos for you",
    linux: "1. Click **Save & Test** — GodMode will install GitHub CLI automatically\n2. You'll be prompted to authenticate via your browser\n3. Once connected, GodMode can create PRs and manage repos for you",
    win32: "1. Click **Save & Test** — GodMode will install GitHub CLI automatically\n2. You'll be prompted to authenticate via your browser\n3. Once connected, GodMode can create PRs and manage repos for you",
  },
};

const messagingChannel: IntegrationProvider = {
  id: "messaging-channel",
  name: "Messaging Channel",
  description: "Get notifications on your phone — iMessage, Telegram, WhatsApp, Discord, and more",
  tier: "core",
  platforms: ["darwin", "linux", "win32"],
  envVars: [],
  cliDeps: [],
  detect: async () => {
    // Read OC config to check for any configured channels
    const config = readOcConfig();
    const channelKeys = ["telegram", "discord", "slack", "signal", "imessage", "whatsapp", "nostr"];
    const configured: string[] = [];

    for (const key of channelKeys) {
      const section = config[key] as Record<string, unknown> | undefined;
      if (section && typeof section === "object") {
        if (section.token || section.botToken || section.apiKey || section.enabled || section.phoneNumber) {
          configured.push(key);
        }
      }
    }

    return {
      configured: configured.length > 0,
      cliInstalled: true,
      authenticated: configured.length > 0,
      working: configured.length > 0,
      details: configured.length > 0
        ? `Connected: ${configured.join(", ")}`
        : "No messaging channels configured",
    };
  },
  test: async () => {
    const status = await messagingChannel.detect();
    if (status.working) return { success: true, message: status.details ?? "Channel connected" };
    return { success: false, message: "No messaging channels configured — go to the Channels tab to set one up" };
  },
  setupSteps: {
    darwin: "GodMode uses OpenClaw's built-in messaging channels.\nGo to the **Channels** tab in the sidebar to set up Telegram, iMessage, Discord, WhatsApp, or Slack.",
    linux: "GodMode uses OpenClaw's built-in messaging channels.\nGo to the **Channels** tab in the sidebar to set up Telegram, Discord, WhatsApp, or Slack.",
    win32: "GodMode uses OpenClaw's built-in messaging channels.\nGo to the **Channels** tab in the sidebar to set up Telegram, Discord, WhatsApp, or Slack.",
  },
};

// ── Deep Integrations (optional) ───────────────────────────────────────

const ouraRing: IntegrationProvider = {
  id: "oura-ring",
  name: "Oura Ring",
  description: "Sleep, readiness, and HRV data — powers the Body Check section",
  briefSection: "Body Check",
  tier: "deep",
  platforms: ["darwin", "linux", "win32"],
  envVars: [{
    key: "OURA_API_TOKEN",
    label: "Oura API Token",
    description: "Get your personal access token from cloud.ouraring.com/personal-access-tokens",
    secret: true,
    target: "env",
  }],
  cliDeps: [],
  detect: async () => {
    const token = getEnvVar("OURA_API_TOKEN");
    return {
      configured: !!token,
      cliInstalled: true,
      authenticated: !!token,
      working: false,
      details: token ? "API token configured" : "OURA_API_TOKEN not set",
    };
  },
  test: async () => {
    const token = getEnvVar("OURA_API_TOKEN");
    if (!token) return { success: false, message: "OURA_API_TOKEN not set" };
    try {
      const resp = await fetch("https://api.ouraring.com/v2/usercollection/personal_info", {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5_000),
      });
      if (resp.ok) return { success: true, message: "Connected to Oura API" };
      if (resp.status === 401) return { success: false, message: "Invalid Oura token" };
      return { success: false, message: `Oura API returned ${resp.status}` };
    } catch (err) {
      return { success: false, message: `Connection failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  },
  setupSteps: {
    darwin: "1. Go to [cloud.ouraring.com/personal-access-tokens](https://cloud.ouraring.com/personal-access-tokens)\n2. Create a personal access token\n3. Paste your token below",
    linux: "1. Go to [cloud.ouraring.com/personal-access-tokens](https://cloud.ouraring.com/personal-access-tokens)\n2. Create a personal access token\n3. Paste your token below",
    win32: "1. Go to [cloud.ouraring.com/personal-access-tokens](https://cloud.ouraring.com/personal-access-tokens)\n2. Create a personal access token\n3. Paste your token below",
  },
};

const weather: IntegrationProvider = {
  id: "weather",
  name: "Weather",
  description: "Local weather in your daily brief header — free, no API key needed",
  briefSection: "Brief header",
  tier: "deep",
  platforms: ["darwin", "linux", "win32"],
  envVars: [{
    key: "user.location",
    label: "Your City",
    description: "City name for weather (e.g. Austin, TX)",
    secret: false,
    target: "options",
    configPath: "user.location",
  }],
  cliDeps: [],
  detect: async () => {
    const location = getUserLocation();
    return {
      configured: !!location,
      cliInstalled: true,
      authenticated: true,
      working: !!location,
      details: location ? `Location: ${location}` : "Location not set",
    };
  },
  test: async () => {
    const location = getUserLocation();
    if (!location) return { success: false, message: "Location not set" };
    try {
      const resp = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (resp.ok) return { success: true, message: `Weather data available for ${location}` };
      return { success: false, message: `wttr.in returned ${resp.status}` };
    } catch (err) {
      return { success: false, message: `Connection failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  },
  setupSteps: {
    darwin: "Enter your city name below (e.g. \"Austin, TX\").\nWeather uses wttr.in — free, no API key needed.",
    linux: "Enter your city name below (e.g. \"Austin, TX\").\nWeather uses wttr.in — free, no API key needed.",
    win32: "Enter your city name below (e.g. \"Austin, TX\").\nWeather uses wttr.in — free, no API key needed.",
  },
};

const obsidianSync: IntegrationProvider = {
  id: "obsidian-sync",
  name: "Obsidian Sync",
  description: "Continuous cloud sync for your vault via Obsidian headless CLI",
  tier: "deep",
  platforms: ["darwin", "linux", "win32"],
  envVars: [],
  cliDeps: ["ob"],
  detect: async () => {
    const platform = detectPlatform();
    const cliInstalled = platform.clis.ob ?? false;
    return {
      configured: cliInstalled,
      cliInstalled,
      authenticated: false,
      working: false,
      details: cliInstalled ? "ob CLI installed" : "ob CLI not installed",
    };
  },
  test: async () => {
    const result = await execCheck("ob", ["--version"]);
    if (result.ok) return { success: true, message: `ob CLI ${result.stdout.trim()}` };
    return { success: false, message: "ob CLI not available" };
  },
  setupSteps: {
    darwin: "1. Install: `npm install -g obsidian-headless`\n2. Login: `ob login`\n3. Setup sync: `ob sync-setup`",
    linux: "1. Install: `npm install -g obsidian-headless`\n2. Login: `ob login`\n3. Setup sync: `ob sync-setup`",
    win32: "1. Install: `npm install -g obsidian-headless`\n2. Login: `ob login`\n3. Setup sync: `ob sync-setup`",
  },
};

const rescueTime: IntegrationProvider = {
  id: "rescuetime",
  name: "RescueTime",
  description: "Automatic productivity tracking — powers Focus Pulse alignment scoring",
  briefSection: "Focus Pulse",
  tier: "deep",
  platforms: ["darwin", "linux", "win32"],
  envVars: [
    {
      key: "RESCUETIME_API_KEY",
      label: "RescueTime API Key",
      description: "Get your API key from rescuetime.com/anapi/manage",
      secret: true,
      target: "env",
    },
  ],
  cliDeps: [],
  detect: async () => {
    const key = getEnvVar("RESCUETIME_API_KEY");
    return {
      configured: !!key,
      cliInstalled: true, // no CLI needed
      authenticated: !!key,
      working: false,
      details: key ? "API key configured" : "RESCUETIME_API_KEY not set",
    };
  },
  test: async () => {
    const key = getEnvVar("RESCUETIME_API_KEY");
    if (!key) return { success: false, message: "RESCUETIME_API_KEY not set" };
    try {
      const resp = await fetch(
        `https://www.rescuetime.com/anapi/data?key=${key}&format=json&perspective=rank&restrict_kind=overview&restrict_begin=${new Date().toISOString().split("T")[0]}&restrict_end=${new Date().toISOString().split("T")[0]}`,
        { signal: AbortSignal.timeout(10_000) },
      );
      if (!resp.ok) return { success: false, message: `API returned ${resp.status}` };
      return { success: true, message: "RescueTime API connected" };
    } catch (err) {
      return { success: false, message: `Connection failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  },
  setupSteps: {
    darwin: "1. Go to [rescuetime.com/anapi/manage](https://www.rescuetime.com/anapi/manage)\n2. Create an API key\n3. Paste your key below",
    linux: "1. Go to [rescuetime.com/anapi/manage](https://www.rescuetime.com/anapi/manage)\n2. Create an API key\n3. Paste your key below",
    win32: "1. Go to [rescuetime.com/anapi/manage](https://www.rescuetime.com/anapi/manage)\n2. Create an API key\n3. Paste your key below",
  },
};

// ── Registry ───────────────────────────────────────────────────────────

/** All available integrations. Core first, then deep. */
export const INTEGRATIONS: IntegrationProvider[] = [
  // Core (6)
  xIntelligence,
  tailscale,
  googleCalendar,
  obsidianVault,
  githubCli,
  messagingChannel,
  // Deep (4)
  ouraRing,
  weather,
  obsidianSync,
  rescueTime,
];

/** Get integrations filtered by tier. */
export function getIntegrationsByTier(tier: "core" | "deep"): IntegrationProvider[] {
  return INTEGRATIONS.filter(i => i.tier === tier);
}

/** Get integrations filtered by current platform. */
export function getIntegrationsForPlatform(): IntegrationProvider[] {
  const os = process.platform;
  return INTEGRATIONS.filter(i => i.platforms.includes(os));
}

/** Find a single integration by ID. */
export function getIntegration(id: string): IntegrationProvider | undefined {
  return INTEGRATIONS.find(i => i.id === id);
}

/** Detect all integrations and return status map. */
export async function detectAllIntegrations(): Promise<Record<string, IntegrationStatus>> {
  const results: Record<string, IntegrationStatus> = {};
  const integrations = getIntegrationsForPlatform();

  await Promise.all(
    integrations.map(async (i) => {
      try {
        results[i.id] = await i.detect();
      } catch (err) {
        results[i.id] = {
          configured: false,
          cliInstalled: false,
          authenticated: false,
          working: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }),
  );

  return results;
}

/**
 * Configure an integration by writing its env vars / config values.
 * Routes values to the correct target file based on the EnvVarSpec.
 */
export function configureIntegration(
  integrationId: string,
  values: Record<string, string>,
): { success: boolean; error?: string } {
  const integration = getIntegration(integrationId);
  if (!integration) return { success: false, error: `Unknown integration: ${integrationId}` };

  for (const spec of integration.envVars) {
    const value = values[spec.key];
    if (value === undefined) continue;

    switch (spec.target) {
      case "env":
        writeEnvVar(spec.key, value);
        // Also set in current process for immediate detection
        process.env[spec.key] = value;
        break;
      case "options":
        writeOptionsJson(spec.key, value);
        break;
      case "oc-config":
        if (spec.configPath) writeOcConfigValue(spec.configPath, value);
        break;
    }
  }

  return { success: true };
}
