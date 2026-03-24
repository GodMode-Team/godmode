/**
 * integrations.ts — RPC handlers for integration status, testing, and configuration.
 *
 * Exposes the integration registry to the UI and agent conversation.
 * All methods are license-ungated (needed during onboarding).
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  detectAllIntegrations,
  getIntegrationsForPlatform,
  getIntegration,
  configureIntegration,
  type IntegrationStatus,
} from "../lib/integration-registry.js";
import { detectPlatform, resetPlatformCache } from "../lib/platform-detect.js";
import { ensureVaultStructure, resetVaultCache } from "../lib/vault-paths.js";
import { resolveVaultPath } from "../data-paths.js";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { exec } from "node:child_process";
import { join } from "node:path";
import { homedir } from "node:os";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── integrations.status ────────────────────────────────────────────────

/**
 * Detect all integrations and return their status.
 * Filters by current platform automatically.
 */
const status: GatewayRequestHandler = async ({ respond }) => {
  try {
    const integrations = getIntegrationsForPlatform();
    const statuses = await detectAllIntegrations();

    const result = integrations.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      briefSection: i.briefSection ?? null,
      tier: i.tier,
      status: statuses[i.id] ?? {
        configured: false,
        cliInstalled: false,
        authenticated: false,
        working: false,
      },
      hasEnvVars: i.envVars.length > 0,
      cliDeps: i.cliDeps,
    }));

    const coreTotal = result.filter(i => i.tier === "core").length;
    const coreConnected = result.filter(
      i => i.tier === "core" && (i.status.working || i.status.configured),
    ).length;

    respond(true, {
      integrations: result,
      coreProgress: { connected: coreConnected, total: coreTotal },
      platform: detectPlatform(),
    });
  } catch (err) {
    respond(false, undefined, {
      code: "INTEGRATIONS_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── integrations.test ──────────────────────────────────────────────────

/**
 * Run a live connectivity test for a single integration.
 */
const test: GatewayRequestHandler = async ({ params, respond }) => {
  const { integrationId } = params as { integrationId: string };
  if (!integrationId) {
    respond(false, undefined, { code: "MISSING_PARAM", message: "integrationId is required" });
    return;
  }

  const integration = getIntegration(integrationId);
  if (!integration) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Unknown integration: ${integrationId}` });
    return;
  }

  try {
    const result = await integration.test();
    respond(true, result);
  } catch (err) {
    respond(true, {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── integrations.configure ─────────────────────────────────────────────

/**
 * Write configuration values for an integration.
 * Routes to the correct target file (.env, godmode-options.json, or openclaw.json).
 */
const configure: GatewayRequestHandler = async ({ params, respond }) => {
  // Runtime type validation before cast
  if (params.integrationId !== undefined && typeof params.integrationId !== "string") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "integrationId must be a string" });
    return;
  }
  if (params.values !== undefined && (typeof params.values !== "object" || params.values === null || Array.isArray(params.values))) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "values must be a plain object" });
    return;
  }
  if (params.values !== undefined && typeof params.values === "object" && params.values !== null) {
    const vals = params.values as Record<string, unknown>;
    for (const [k, v] of Object.entries(vals)) {
      if (typeof k !== "string" || typeof v !== "string") {
        respond(false, undefined, { code: "INVALID_REQUEST", message: "values must be an object with string keys and string values" });
        return;
      }
    }
  }

  const { integrationId, values } = params as {
    integrationId: string;
    values: Record<string, string>;
  };

  if (!integrationId || !values) {
    respond(false, undefined, { code: "MISSING_PARAM", message: "integrationId and values are required" });
    return;
  }

  try {
    const result = configureIntegration(integrationId, values);
    if (!result.success) {
      respond(false, undefined, { code: "CONFIGURE_ERROR", message: result.error ?? "Configuration failed" });
      return;
    }

    // Special handling: Google Calendar auto-install
    if (integrationId === "google-calendar" && values.GOG_CALENDAR_ACCOUNT) {
      try {
        // Auto-install gog if not present
        const { code: gogCheck } = await new Promise<{ code: number }>((resolve) => {
          exec("command -v gog", { timeout: 5_000 }, (err) => resolve({ code: err ? 1 : 0 }));
        });
        if (gogCheck !== 0) {
          await new Promise<void>((resolve) => {
            exec("npm install -g @nicepkg/gog", { timeout: 120_000 }, () => resolve());
          });
        }
        // macOS: ensure file-based keyring
        if (process.platform === "darwin") {
          const configDir = join(homedir(), "Library", "Application Support", "gogcli");
          const configFile = join(configDir, "config.json");
          if (!existsSync(configFile)) {
            mkdirSync(configDir, { recursive: true });
            writeFileSync(configFile, '{"keyring_backend": "file"}\n');
          }
        }
      } catch {
        // Non-fatal — user can still set up manually
      }
    }

    // Special handling: vault auto-setup
    if (integrationId === "obsidian-vault" && values.OBSIDIAN_VAULT_PATH) {
      const vaultPath = values.OBSIDIAN_VAULT_PATH.replace(/^~/, process.env.HOME ?? "");
      if (!existsSync(vaultPath)) {
        mkdirSync(vaultPath, { recursive: true });
      }
      // Create PARA folder structure
      ensureVaultStructure();
      resetVaultCache();
    }

    // Reset platform cache so CLI detection refreshes
    resetPlatformCache();

    // Re-detect the integration to return updated status
    const integration = getIntegration(integrationId);
    const updatedStatus = integration ? await integration.detect() : null;

    respond(true, { configured: true, status: updatedStatus });
  } catch (err) {
    respond(false, undefined, {
      code: "CONFIGURE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── integrations.setupGuide ────────────────────────────────────────────

/**
 * Return platform-specific setup instructions for an integration.
 */
const setupGuide: GatewayRequestHandler = async ({ params, respond }) => {
  const { integrationId } = params as { integrationId: string };
  if (!integrationId) {
    respond(false, undefined, { code: "MISSING_PARAM", message: "integrationId is required" });
    return;
  }

  const integration = getIntegration(integrationId);
  if (!integration) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Unknown integration: ${integrationId}` });
    return;
  }

  const platform = process.platform;
  const steps = integration.setupSteps[platform] ?? integration.setupSteps.linux ?? "No setup instructions available for this platform.";

  respond(true, {
    integrationId: integration.id,
    name: integration.name,
    description: integration.description,
    platform,
    steps,
    envVars: integration.envVars.map(v => ({
      key: v.key,
      label: v.label,
      description: v.description,
      secret: v.secret,
    })),
    cliDeps: integration.cliDeps,
  });
};

// ── integrations.platformInfo ──────────────────────────────────────────

/**
 * Return platform detection info (OS, arch, CLIs, package managers).
 */
const platformInfo: GatewayRequestHandler = async ({ respond }) => {
  resetPlatformCache(); // Always get fresh data for this call
  respond(true, detectPlatform());
};

// ── integrations.autoInstall ───────────────────────────────────────────

/** Run a shell command and return the output. */
function runShell(
  cmd: string,
  timeoutMs = 60_000,
  extraEnv?: Record<string, string>,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    exec(cmd, {
      timeout: timeoutMs,
      env: { ...process.env, HOME: homedir(), ...extraEnv },
      maxBuffer: 1024 * 1024,
    }, (err, stdout, stderr) => {
      const code = err && "code" in err ? (err.code as number) ?? 1 : err ? 1 : 0;
      resolve({ code, stdout: String(stdout), stderr: String(stderr) });
    });
  });
}

/**
 * Auto-install CLI dependencies for an integration.
 * Handles gog (Google Calendar), gh (GitHub CLI), tailscale, etc.
 * Returns step-by-step progress so the UI can show a progress indicator.
 */
const autoInstall: GatewayRequestHandler = async ({ params, respond }) => {
  const { integrationId, email } = params as { integrationId: string; email?: string };
  if (!integrationId) {
    respond(false, undefined, { code: "MISSING_PARAM", message: "integrationId is required" });
    return;
  }

  const steps: Array<{ step: string; status: "ok" | "error" | "skipped"; detail?: string }> = [];

  try {
    if (integrationId === "google-calendar") {
      // Step 1: Install gog CLI
      const { code: gogCheck } = await runShell("command -v gog", 5_000);
      if (gogCheck !== 0) {
        steps.push({ step: "Installing gog CLI", status: "ok" });
        const { code, stderr } = await runShell("npm install -g @nicepkg/gog 2>&1", 120_000);
        if (code !== 0) {
          steps.push({ step: "Install gog", status: "error", detail: stderr.slice(-200) });
          respond(true, { success: false, steps });
          return;
        }
        steps[steps.length - 1] = { step: "gog CLI installed", status: "ok" };
      } else {
        steps.push({ step: "gog CLI already installed", status: "skipped" });
      }

      // Step 2: Set up file-based keyring (macOS)
      if (process.platform === "darwin") {
        const configDir = join(homedir(), "Library", "Application Support", "gogcli");
        const configFile = join(configDir, "config.json");
        if (!existsSync(configFile)) {
          mkdirSync(configDir, { recursive: true });
          writeFileSync(configFile, '{"keyring_backend": "file"}\n');
          steps.push({ step: "File-based keyring configured", status: "ok" });
        } else {
          steps.push({ step: "Keyring already configured", status: "skipped" });
        }
      }

      // Step 3: Authenticate with Google (needs email)
      if (email) {
        const gogPass = process.env.GOG_KEYRING_PASSWORD;
        if (!gogPass) {
          steps.push({
            step: "Set GOG_KEYRING_PASSWORD env var",
            status: "error",
            detail: "Required for gog keyring. Add to ~/godmode/.env",
          });
          respond(true, { success: false, steps });
          return;
        }
        // Validate email format to prevent shell injection
        if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) {
          steps.push({ step: "Invalid email format", status: "error" });
          respond(true, { success: false, steps });
          return;
        }
        const client = "godmode";
        const extraEnv = process.platform === "darwin" && gogPass
          ? { GOG_KEYRING_PASSWORD: gogPass }
          : undefined;
        const { code, stdout, stderr } = await runShell(
          `gog auth add ${email} --services calendar --client ${client} 2>&1`,
          30_000,
          extraEnv,
        );
        if (code === 0) {
          // gog auth outputs an OAuth URL — extract it
          const urlMatch = (stdout + stderr).match(/(https:\/\/accounts\.google\.com\S+)/);
          if (urlMatch) {
            steps.push({
              step: "Open this URL to authorize Google Calendar",
              status: "ok",
              detail: urlMatch[1],
            });
          } else {
            steps.push({ step: "Google auth started", status: "ok", detail: stdout.slice(-200) });
          }
        } else {
          steps.push({ step: "Google auth", status: "error", detail: (stderr || stdout).slice(-200) });
        }
      } else {
        steps.push({ step: "Enter your Google email to connect Calendar", status: "skipped" });
      }

      respond(true, { success: true, steps });
      return;
    }

    if (integrationId === "github-cli") {
      const { code: ghCheck } = await runShell("command -v gh", 5_000);
      if (ghCheck !== 0) {
        // Try to install via package manager
        if (process.platform === "darwin") {
          const { code } = await runShell("brew install gh 2>&1", 120_000);
          steps.push(code === 0
            ? { step: "GitHub CLI installed via Homebrew", status: "ok" }
            : { step: "Could not install gh — install Homebrew first", status: "error" });
        } else {
          // Linux: try apt, then dnf
          const { code } = await runShell(
            "(apt-get install -y gh 2>/dev/null || dnf install -y gh 2>/dev/null || snap install gh 2>/dev/null) 2>&1",
            120_000,
          );
          steps.push(code === 0
            ? { step: "GitHub CLI installed", status: "ok" }
            : { step: "Could not auto-install gh — see cli.github.com", status: "error" });
        }
      } else {
        steps.push({ step: "GitHub CLI already installed", status: "skipped" });
      }

      // Check if already authenticated
      const { code: authCheck } = await runShell("gh auth status 2>/dev/null", 5_000);
      if (authCheck === 0) {
        steps.push({ step: "Already authenticated with GitHub", status: "skipped" });
      } else {
        steps.push({ step: "Run `gh auth login` to authenticate (opens browser)", status: "ok" });
      }

      respond(true, { success: true, steps });
      return;
    }

    respond(false, undefined, { code: "UNSUPPORTED", message: `Auto-install not supported for ${integrationId}` });
  } catch (err) {
    respond(false, undefined, {
      code: "INSTALL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Paperclip dashboard URL ──────────────────────────────────────────

const paperclipDashboardUrl: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { isPaperclipReady, getPaperclipStatus, getAgents } = await import(
      "../services/paperclip-client.js"
    );
    const ready = isPaperclipReady();
    if (!ready) {
      respond(true, { ready: false, url: null });
      return;
    }
    const [status, agents] = await Promise.all([
      getPaperclipStatus(),
      getAgents().catch(() => []),
    ]);
    respond(true, {
      ready: true,
      url: status.url,
      taskCount: status.taskCount,
      agents,
    });
  } catch {
    respond(true, { ready: false, url: null });
  }
};

// ── paperclip.setup — One-click Paperclip install + agent seeding ─────

type SetupStepResult = { step: string; status: "ok" | "error" | "skipped"; detail?: string };

const paperclipSetup: GatewayRequestHandler = async ({ params, respond }) => {
  const { action } = params as { action?: "check" | "install" | "connect" | "seed" };
  const steps: SetupStepResult[] = [];

  try {
    // ── CHECK: Is Paperclip server already running somewhere? ──────
    if (action === "check" || !action) {
      const url = process.env.PAPERCLIP_URL || "";
      const companyId = process.env.PAPERCLIP_COMPANY_ID || "";

      // Check if npx @paperclipai/server is available
      const { code: npxCheck } = await runShell("npx --yes @paperclipai/server --version 2>/dev/null", 15_000);
      steps.push(npxCheck === 0
        ? { step: "Paperclip package available", status: "ok" }
        : { step: "Paperclip package not installed", status: "skipped" });

      // Check if server is running
      let serverUp = false;
      const checkUrl = url || "http://localhost:3100";
      try {
        const resp = await fetch(`${checkUrl}/api/companies`, {
          signal: AbortSignal.timeout(3_000),
        });
        serverUp = resp.ok || resp.status === 401; // 401 = running but needs auth
      } catch { /* not running */ }

      steps.push(serverUp
        ? { step: "Paperclip server running", status: "ok", detail: checkUrl }
        : { step: "Paperclip server not running", status: "skipped" });

      // Check env vars
      steps.push(url
        ? { step: "PAPERCLIP_URL configured", status: "ok", detail: url }
        : { step: "PAPERCLIP_URL not set", status: "skipped" });
      steps.push(companyId
        ? { step: "PAPERCLIP_COMPANY_ID configured", status: "ok", detail: companyId }
        : { step: "PAPERCLIP_COMPANY_ID not set", status: "skipped" });

      respond(true, { action: "check", serverUp, configured: !!url && !!companyId, steps });
      return;
    }

    // ── INSTALL: Install @paperclipai/server and start it ─────────
    if (action === "install") {
      // Step 1: Start the server via npx (it manages its own embedded Postgres)
      const { code, stdout, stderr } = await runShell(
        "npx --yes @paperclipai/server start --daemon --port 3100 2>&1",
        120_000,
      );
      if (code !== 0) {
        // Fallback: try starting in background
        const bgResult = await runShell(
          "nohup npx --yes @paperclipai/server start --port 3100 > /tmp/paperclip.log 2>&1 &",
          30_000,
        );
        // Wait briefly for server to start
        await new Promise((r) => setTimeout(r, 3_000));
        // Verify it's running
        let running = false;
        try {
          const resp = await fetch("http://localhost:3100/api/companies", {
            signal: AbortSignal.timeout(5_000),
          });
          running = resp.ok || resp.status === 401;
        } catch { /* not running */ }
        if (!running) {
          steps.push({
            step: "Start Paperclip server",
            status: "error",
            detail: (stderr || stdout || bgResult.stderr).slice(-300),
          });
          respond(true, { action: "install", success: false, steps });
          return;
        }
      }
      steps.push({ step: "Paperclip server started on port 3100", status: "ok" });

      // Step 2: Write PAPERCLIP_URL to .env
      const { writeEnvVar: writeEnv } = await import("../lib/env-writer.js");
      writeEnv("PAPERCLIP_URL", "http://localhost:3100");
      process.env.PAPERCLIP_URL = "http://localhost:3100";
      steps.push({ step: "PAPERCLIP_URL saved to .env", status: "ok" });

      respond(true, { action: "install", success: true, url: "http://localhost:3100", steps });
      return;
    }

    // ── CONNECT: Connect to an existing server URL ────────────────
    if (action === "connect") {
      const { url } = params as { url?: string };
      if (!url) {
        respond(false, undefined, { code: "MISSING_PARAM", message: "url is required for connect action" });
        return;
      }

      const cleanUrl = url.replace(/\/+$/, "");
      // Verify connectivity
      try {
        const resp = await fetch(`${cleanUrl}/api/companies`, {
          signal: AbortSignal.timeout(5_000),
        });
        if (!resp.ok && resp.status !== 401) {
          steps.push({ step: "Connect to server", status: "error", detail: `Server returned ${resp.status}` });
          respond(true, { action: "connect", success: false, steps });
          return;
        }
      } catch (err) {
        steps.push({
          step: "Connect to server",
          status: "error",
          detail: `Could not reach ${cleanUrl}: ${err instanceof Error ? err.message : String(err)}`,
        });
        respond(true, { action: "connect", success: false, steps });
        return;
      }

      const { writeEnvVar: writeEnv } = await import("../lib/env-writer.js");
      writeEnv("PAPERCLIP_URL", cleanUrl);
      process.env.PAPERCLIP_URL = cleanUrl;
      steps.push({ step: `Connected to ${cleanUrl}`, status: "ok" });

      respond(true, { action: "connect", success: true, url: cleanUrl, steps });
      return;
    }

    // ── SEED: Create company + agents from GodMode roster ─────────
    if (action === "seed") {
      const paperclipUrl = (process.env.PAPERCLIP_URL || "http://localhost:3100").replace(/\/+$/, "");
      const apiKeyVal = process.env.PAPERCLIP_API_KEY || "";
      const hdrs: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKeyVal) hdrs.Authorization = `Bearer ${apiKeyVal}`;

      const pcFetch = async <T = unknown>(path: string, opts?: { method?: string; body?: unknown }): Promise<T> => {
        const init: RequestInit = { method: opts?.method ?? "GET", headers: hdrs };
        if (opts?.body !== undefined) init.body = JSON.stringify(opts.body);
        const res = await fetch(`${paperclipUrl}${path}`, init);
        if (!res.ok) throw new Error(`${res.status}: ${await res.text().catch(() => "")}`);
        return res.json() as Promise<T>;
      };

      // Step 1: Check if company already exists
      let companyId = process.env.PAPERCLIP_COMPANY_ID || "";
      if (companyId) {
        try {
          await pcFetch(`/api/companies/${companyId}`);
          steps.push({ step: "Company already exists", status: "skipped", detail: companyId });
        } catch {
          companyId = ""; // Company doesn't exist, create new
        }
      }

      if (!companyId) {
        const company = await pcFetch<{ id: string; name: string }>("/api/companies", {
          method: "POST",
          body: { name: "GodMode Team", description: "AI agent team managed by GodMode" },
        });
        companyId = company.id;
        steps.push({ step: `Company created: ${company.name}`, status: "ok", detail: companyId });

        // Save company ID
        const { writeEnvVar: writeEnv } = await import("../lib/env-writer.js");
        writeEnv("PAPERCLIP_COMPANY_ID", companyId);
        process.env.PAPERCLIP_COMPANY_ID = companyId;
        steps.push({ step: "PAPERCLIP_COMPANY_ID saved", status: "ok" });
      }

      // Step 2: Load GodMode agent roster and seed into Paperclip
      const { listRoster } = await import("../lib/agent-roster.js");
      const personas = listRoster();

      // Get existing agents to avoid duplicates
      const existingRes = await pcFetch<Record<string, unknown>>(`/api/companies/${companyId}/agents`);
      const existingAgents = Array.isArray(existingRes)
        ? existingRes as Array<{ name: string }>
        : ((existingRes as { agents?: Array<{ name: string }> }).agents ?? []);
      const existingNames = new Set(existingAgents.map((a: { name: string }) => a.name.toLowerCase()));

      let seeded = 0;
      let skipped = 0;
      for (const persona of personas) {
        if (existingNames.has(persona.name.toLowerCase())) {
          skipped++;
          continue;
        }
        try {
          await pcFetch(`/api/companies/${companyId}/agents`, {
            method: "POST",
            body: {
              name: persona.name,
              role: persona.taskTypes.join(", "),
              adapterType: "claude_local",
              adapterConfig: {
                command: "claude",
                model: "claude-sonnet-4-20250514",
                cwd: homedir(),
                maxTurnsPerRun: 50,
                timeoutSec: 1800,
                dangerouslySkipPermissions: true,
                promptTemplate:
                  `You are ${persona.name}. ${persona.mission || ""}\n\n` +
                  `Your task:\n\n{{context.issueDescription}}\n\n{{context.issueTitle}}`,
              },
              capabilities: persona.mission || persona.taskTypes.join(", "),
            },
          });
          seeded++;
        } catch (err) {
          steps.push({
            step: `Seed agent: ${persona.name}`,
            status: "error",
            detail: err instanceof Error ? err.message : String(err),
          });
        }
      }

      steps.push({
        step: `Agents seeded: ${seeded} new, ${skipped} already existed`,
        status: "ok",
        detail: `${seeded + skipped + existingAgents.length} total agents`,
      });

      // Step 3: Re-initialize the Paperclip client
      try {
        const { initPaperclip } = await import("../services/paperclip-client.js");
        const ok = await initPaperclip(paperclipUrl, apiKeyVal, companyId);
        steps.push(ok
          ? { step: "Paperclip client connected", status: "ok" }
          : { step: "Paperclip client failed to connect", status: "error" });
      } catch (err) {
        steps.push({
          step: "Re-init client",
          status: "error",
          detail: err instanceof Error ? err.message : String(err),
        });
      }

      respond(true, {
        action: "seed",
        success: true,
        companyId,
        agentsSeeded: seeded,
        agentsSkipped: skipped,
        totalAgents: seeded + skipped + existingAgents.length,
        steps,
      });
      return;
    }

    respond(false, undefined, { code: "UNKNOWN_ACTION", message: `Unknown action: ${action}` });
  } catch (err) {
    respond(false, undefined, {
      code: "SETUP_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Export ──────────────────────────────────────────────────────────────

export const integrationsHandlers: GatewayRequestHandlers = {
  "integrations.status": status,
  "integrations.test": test,
  "integrations.configure": configure,
  "integrations.setupGuide": setupGuide,
  "integrations.platformInfo": platformInfo,
  "integrations.autoInstall": autoInstall,
  "paperclip.dashboardUrl": paperclipDashboardUrl,
  "paperclip.setup": paperclipSetup,
};
