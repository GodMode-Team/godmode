/**
 * integrations.ts — RPC handlers for integration status, testing, and configuration.
 *
 * Exposes the integration registry to the UI and agent conversation.
 * All methods are license-ungated (needed during onboarding).
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
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
function runShell(cmd: string, timeoutMs = 60_000): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    exec(cmd, { timeout: timeoutMs, env: { ...process.env, HOME: homedir() }, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
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
        const client = "godmode";
        const envPrefix = process.platform === "darwin" ? "GOG_KEYRING_PASSWORD=godmode2026 " : "";
        const { code, stdout, stderr } = await runShell(
          `${envPrefix}gog auth add ${email} --services calendar --client ${client} 2>&1`,
          30_000,
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

// ── Export ──────────────────────────────────────────────────────────────

export const integrationsHandlers: GatewayRequestHandlers = {
  "integrations.status": status,
  "integrations.test": test,
  "integrations.configure": configure,
  "integrations.setupGuide": setupGuide,
  "integrations.platformInfo": platformInfo,
  "integrations.autoInstall": autoInstall,
};
