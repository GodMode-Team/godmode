/**
 * ingestion.ts — RPC methods for the ingestion pipeline.
 *
 * Exposes status, run, and screenpipe configuration endpoints.
 * Uses dynamic imports so the gateway boots even if ingestion services
 * are not yet implemented (runner.ts, screenpipe-funnel.ts).
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";

const ingestionStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { getIngestionStatus } = await import(
      "../services/ingestion/runner.js"
    );
    const status = getIngestionStatus();
    respond(true, { pipelines: status });
  } catch (err) {
    respond(false, undefined, {
      code: "INGESTION_ERROR",
      message: `Could not check ingestion status — ensure pipelines are configured. (${String(err).slice(0, 100)})`,
    });
  }
};

const ingestionRun: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { pipeline?: string };
  try {
    const { runAllIngestion } = await import(
      "../services/ingestion/runner.js"
    );
    const results = await runAllIngestion();
    if (p.pipeline) {
      const match = results.find(
        (r: { pipeline: string }) => r.pipeline === p.pipeline,
      );
      respond(
        true,
        match ?? {
          pipeline: p.pipeline,
          status: "skipped",
          details: { reason: "not found" },
          durationMs: 0,
        },
      );
    } else {
      respond(true, { results });
    }
  } catch (err) {
    respond(false, undefined, {
      code: "INGESTION_ERROR",
      message: `Ingestion pipeline failed to run — check pipeline configuration. (${String(err).slice(0, 100)})`,
    });
  }
};

const screenpipeStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { loadConfig } = await import(
      "../services/ingestion/screenpipe-config.js"
    );
    const { getDaemonStatus } = await import(
      "../services/ingestion/screenpipe-manager.js"
    );
    const config = await loadConfig();
    const daemon = await getDaemonStatus();
    respond(true, {
      enabled: config.enabled,
      available: daemon.running,
      installed: daemon.installed,
      version: daemon.version,
      pid: daemon.pid,
      managedByUs: daemon.managedByUs,
      apiUrl: config.apiUrl,
      blockedApps: config.blockedApps,
      retention: config.retention,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Could not check Screenpipe status — ensure Screenpipe is running. (${String(err).slice(0, 100)})`,
    });
  }
};

const screenpipeConfigure: GatewayRequestHandler = async ({
  params,
  respond,
}) => {
  try {
    const { loadConfig, saveConfig } = await import(
      "../services/ingestion/screenpipe-config.js"
    );
    const updates = params as Record<string, unknown>;

    const current = await loadConfig();
    const partial: Record<string, unknown> = {};
    if (typeof updates.enabled === "boolean") partial.enabled = updates.enabled;
    if (typeof updates.apiUrl === "string") partial.apiUrl = updates.apiUrl;
    if (Array.isArray(updates.blockedApps)) partial.blockedApps = updates.blockedApps;
    if (updates.retention && typeof updates.retention === "object")
      partial.retention = updates.retention;
    if (updates.privacy && typeof updates.privacy === "object")
      partial.privacy = updates.privacy;

    const merged = await saveConfig(partial);
    respond(true, { saved: true, config: merged });
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Screenpipe configuration failed — check file permissions in ~/godmode. (${String(err).slice(0, 100)})`,
    });
  }
};

const screenpipeToggle: GatewayRequestHandler = async ({ params, respond }) => {
  const { enabled } = params as { enabled?: boolean };
  if (typeof enabled !== "boolean") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "enabled must be boolean" });
    return;
  }
  try {
    const { loadConfig, saveConfig } = await import(
      "../services/ingestion/screenpipe-config.js"
    );
    await loadConfig(); // ensure config exists
    const merged = await saveConfig({ enabled });
    respond(true, { enabled: (merged as unknown as Record<string, unknown>).enabled ?? enabled });
  } catch (err) {
    respond(false, undefined, { code: "SCREENPIPE_ERROR", message: `Screenpipe toggle failed — the service may not be responding. (${String(err).slice(0, 100)})` });
  }
};

/**
 * One-click install: detects platform, installs CLI, starts daemon, enables config.
 * This is the "just make it work" button for onboarding and UI.
 */
const screenpipeInstall: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { installScreenpipe } = await import(
      "../services/ingestion/screenpipe-manager.js"
    );
    const result = await installScreenpipe();
    if (result.success) {
      respond(true, { installed: true });
    } else {
      respond(true, { installed: false, error: result.error });
    }
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Installation failed: ${String(err).slice(0, 200)}`,
    });
  }
};

/**
 * Full setup: install (if needed) + start daemon + enable config.
 * Used by onboarding — single call that makes everything work.
 */
const screenpipeSetup: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { ensureRunning } = await import(
      "../services/ingestion/screenpipe-manager.js"
    );
    const { saveConfig } = await import(
      "../services/ingestion/screenpipe-config.js"
    );
    const result = await ensureRunning();
    if (result.success) {
      // Save config separately — if this fails, daemon is still running (graceful)
      try {
        await saveConfig({ enabled: true, autoStart: true });
      } catch (cfgErr) {
        console.warn(`[Screenpipe] Config save failed (daemon is running): ${String(cfgErr)}`);
      }
      respond(true, { success: true, message: "Screenpipe installed, running, and enabled." });
    } else {
      respond(true, { success: false, error: result.error });
    }
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Setup failed: ${String(err).slice(0, 200)}`,
    });
  }
};

const screenpipeStart: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { startDaemon } = await import(
      "../services/ingestion/screenpipe-manager.js"
    );
    const result = await startDaemon();
    respond(true, result);
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Failed to start daemon: ${String(err).slice(0, 200)}`,
    });
  }
};

const screenpipeStop: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { stopDaemon } = await import(
      "../services/ingestion/screenpipe-manager.js"
    );
    const result = await stopDaemon();
    respond(true, result);
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: `Failed to stop daemon: ${String(err).slice(0, 200)}`,
    });
  }
};

const runPipeline: GatewayRequestHandler = async ({ params, respond }) => {
  const { pipeline } = params as { pipeline?: string };
  if (!pipeline) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "pipeline name required" });
    return;
  }
  try {
    const { runAllIngestion } = await import(
      "../services/ingestion/runner.js"
    );
    const results = await runAllIngestion();
    const match = results.find(
      (r: { pipeline: string }) => r.pipeline === pipeline,
    );
    respond(true, match ?? { pipeline, status: "not_found" });
  } catch (err) {
    respond(false, undefined, { code: "INGESTION_ERROR", message: `Pipeline "${pipeline}" failed to run — check pipeline configuration. (${String(err).slice(0, 100)})` });
  }
};

export const ingestionHandlers: Record<string, GatewayRequestHandler> = {
  "ingestion.status": ingestionStatus,
  "ingestion.run": ingestionRun,
  "ingestion.screenpipeStatus": screenpipeStatus,
  "ingestion.screenpipeConfigure": screenpipeConfigure,
  "ingestion.screenpipeToggle": screenpipeToggle,
  "ingestion.screenpipeInstall": screenpipeInstall,
  "ingestion.screenpipeSetup": screenpipeSetup,
  "ingestion.screenpipeStart": screenpipeStart,
  "ingestion.screenpipeStop": screenpipeStop,
  "ingestion.runPipeline": runPipeline,
};
