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
import { existsSync, mkdirSync } from "node:fs";

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

// ── Export ──────────────────────────────────────────────────────────────

export const integrationsHandlers: GatewayRequestHandlers = {
  "integrations.status": status,
  "integrations.test": test,
  "integrations.configure": configure,
  "integrations.setupGuide": setupGuide,
  "integrations.platformInfo": platformInfo,
};
