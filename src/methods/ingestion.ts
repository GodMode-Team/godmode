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
      message: String(err),
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
      message: String(err),
    });
  }
};

const screenpipeStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    const { loadConfig } = await import(
      "../services/ingestion/screenpipe-config.js"
    );
    const { isScreenpipeAvailable } = await import(
      "../services/ingestion/screenpipe-funnel.js"
    );
    const config = await loadConfig();
    const available = await isScreenpipeAvailable();
    respond(true, {
      enabled: config.enabled,
      available,
      apiUrl: config.apiUrl,
      blockedApps: config.blockedApps,
      retention: config.retention,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "SCREENPIPE_ERROR",
      message: String(err),
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
      message: String(err),
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
    respond(false, undefined, { code: "SCREENPIPE_ERROR", message: String(err) });
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
    respond(false, undefined, { code: "INGESTION_ERROR", message: String(err) });
  }
};

export const ingestionHandlers: Record<string, GatewayRequestHandler> = {
  "ingestion.status": ingestionStatus,
  "ingestion.run": ingestionRun,
  "ingestion.screenpipeStatus": screenpipeStatus,
  "ingestion.screenpipeConfigure": screenpipeConfigure,
  "ingestion.screenpipeToggle": screenpipeToggle,
  "ingestion.runPipeline": runPipeline,
};
