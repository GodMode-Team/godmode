/**
 * runner.ts — Unified ingestion runner for all data source pipelines.
 *
 * Runs each configured pipeline in sequence, catches errors per-pipeline,
 * and returns structured results. Also provides a status check for the UI.
 */

import { runCalendarEnrichment } from "./calendar-enrichment.js";
import { runEmailDigest } from "./email-digest.js";
import { runFathomDigest } from "./fathom-calls.js";
import { runDriveSync } from "./drive-sync.js";
import { runClickUpSync } from "./clickup-sync.js";

// ── Types ────────────────────────────────────────────────────────────

export type IngestionResult = {
  pipeline: string;
  status: "ok" | "skipped" | "error";
  details: Record<string, unknown>;
  durationMs: number;
};

// ── Pipeline Registry ────────────────────────────────────────────────

interface PipelineEntry {
  name: string;
  run: () => Promise<Record<string, unknown>>;
  /** If this env var is missing, the pipeline is skipped. null = always runs. */
  requiredEnv: string | null;
}

const pipelines: PipelineEntry[] = [
  {
    name: "calendar",
    run: async () => ({ ...(await runCalendarEnrichment()) }),
    requiredEnv: null, // gog CLI is always available if installed
  },
  {
    name: "email-front",
    run: async () => ({ ...(await runEmailDigest()) }),
    requiredEnv: "FRONT_API_TOKEN",
  },
  {
    name: "fathom",
    run: async () => ({ ...(await runFathomDigest()) }),
    requiredEnv: "FATHOM_API_KEY",
  },
  {
    name: "drive",
    run: async () => ({ ...(await runDriveSync()) }),
    requiredEnv: null, // gog CLI is always available if installed
  },
  {
    name: "clickup",
    run: async () => ({ ...(await runClickUpSync()) }),
    requiredEnv: "CLICKUP_API_TOKEN",
  },
];

// ── Runner ───────────────────────────────────────────────────────────

/**
 * Run all configured ingestion pipelines in sequence.
 * Each pipeline is independently error-handled — one failure doesn't stop the rest.
 */
export async function runAllIngestion(): Promise<IngestionResult[]> {
  const results: IngestionResult[] = [];

  for (const pipeline of pipelines) {
    // Skip if required env var is missing
    if (pipeline.requiredEnv && !process.env[pipeline.requiredEnv]) {
      results.push({
        pipeline: pipeline.name,
        status: "skipped",
        details: { reason: `${pipeline.requiredEnv} not set` },
        durationMs: 0,
      });
      continue;
    }

    const start = Date.now();
    try {
      const details = await pipeline.run();
      results.push({
        pipeline: pipeline.name,
        status: "ok",
        details,
        durationMs: Date.now() - start,
      });
    } catch (err) {
      results.push({
        pipeline: pipeline.name,
        status: "error",
        details: { error: String(err) },
        durationMs: Date.now() - start,
      });
    }
  }

  return results;
}

// ── Status Check ─────────────────────────────────────────────────────

/**
 * Returns configuration status for each pipeline.
 * Used by the UI and health checks to show what's connected.
 */
export function getIngestionStatus(): Array<{
  name: string;
  configured: boolean;
  envVar: string;
}> {
  return [
    {
      name: "Calendar (Google)",
      configured: true, // gog CLI — always available
      envVar: "GOG_CALENDAR_ACCOUNT",
    },
    {
      name: "Email (Front)",
      configured: !!process.env.FRONT_API_TOKEN,
      envVar: "FRONT_API_TOKEN",
    },
    {
      name: "Fathom Calls",
      configured: !!process.env.FATHOM_API_KEY,
      envVar: "FATHOM_API_KEY",
    },
    {
      name: "Google Drive",
      configured: true, // gog CLI — always available
      envVar: "GOG_CALENDAR_ACCOUNT",
    },
    {
      name: "ClickUp",
      configured: !!process.env.CLICKUP_API_TOKEN,
      envVar: "CLICKUP_API_TOKEN",
    },
    {
      name: "Screenpipe",
      configured: true, // auto-detected at runtime via localhost:3030
      envVar: "(auto-detected)",
    },
  ];
}
