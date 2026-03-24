/**
 * ingestion.ts — RPC handlers for ingestion pipeline management.
 *
 * Exposes pipeline status, run triggers, and history to the UI and ally.
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  runAllIngestion,
  getIngestionStatus,
} from "../services/ingestion/runner.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── ingestion.status ──────────────────────────────────────────────────

const status: GatewayRequestHandler = async ({ respond }) => {
  try {
    const pipelines = getIngestionStatus();
    const configured = pipelines.filter((p) => p.configured).length;
    respond(true, { pipelines, configured, total: pipelines.length });
  } catch (err) {
    respond(false, undefined, {
      code: "INGESTION_STATUS_ERROR",
      message: String(err),
    });
  }
};

// ── ingestion.run ─────────────────────────────────────────────────────

const run: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const pipeline = params.pipeline
      ? String(params.pipeline)
      : undefined;
    const results = await runAllIngestion(pipeline);
    respond(true, { results });
  } catch (err) {
    respond(false, undefined, {
      code: "INGESTION_RUN_ERROR",
      message: String(err),
    });
  }
};

// ── Export ─────────────────────────────────────────────────────────────

export const ingestionHandlers: GatewayRequestHandlers = {
  "ingestion.status": status,
  "ingestion.run": run,
};
