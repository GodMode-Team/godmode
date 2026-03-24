/**
 * runner.ts — Unified ingestion pipeline runner.
 *
 * Pipelines are GENERIC TYPES (calendar, meetings, etc.) — not vendor-specific.
 * The only engine-level pipeline is Calendar (gog CLI, structured data).
 * Everything else flows through existing hooks:
 *   - Meetings: /godmode/webhooks/meeting (already generic — Fathom, Otter, etc.)
 *   - Email/Projects/Documents: ally delegates via Composio, MCP, or queue
 *
 * Meta-architecture rule: Code as little as possible. The ally does the enrichment.
 * Engine code only for: structured CLI output (calendar) + orchestration (this runner).
 */

import { runCalendarEnrichment } from "./calendar-enrichment.js";

export type IngestionResult = {
  pipeline: string;
  status: "ok" | "skipped" | "error";
  details: Record<string, unknown>;
  durationMs: number;
};

/**
 * Pipeline types — generic categories, not vendor names.
 *
 * "calendar" — engine-level (gog CLI, structured JSON, auto-enrichment)
 * "meetings" — webhook-driven (already handled by /godmode/webhooks/meeting)
 * "email" / "projects" / "documents" — ally-driven (via Composio, queue, or MCP tools)
 */
const enginePipelines = [
  {
    name: "calendar",
    fn: runCalendarEnrichment,
    env: "GOG_CALENDAR_ACCOUNT",
  },
] as const;

/**
 * Run engine-level ingestion pipelines (or a specific one).
 * Ally-driven pipelines (email, projects, documents) are NOT run here —
 * they're queue items the ally dispatches to sub-agents.
 */
export async function runAllIngestion(
  only?: string,
): Promise<IngestionResult[]> {
  const results: IngestionResult[] = [];
  const toRun = only
    ? enginePipelines.filter((p) => p.name === only)
    : [...enginePipelines];

  for (const p of toRun) {
    if (!process.env[p.env]) {
      results.push({
        pipeline: p.name,
        status: "skipped",
        details: { reason: `${p.env} not set` },
        durationMs: 0,
      });
      continue;
    }

    const start = Date.now();
    try {
      const details = await p.fn();
      results.push({
        pipeline: p.name,
        status: "ok",
        details: details as Record<string, unknown>,
        durationMs: Date.now() - start,
      });
    } catch (err) {
      results.push({
        pipeline: p.name,
        status: "error",
        details: { error: String(err) },
        durationMs: Date.now() - start,
      });
    }
  }

  // Signal health
  try {
    const { health } = await import("../../lib/health-ledger.js");
    const okCount = results.filter((r) => r.status === "ok").length;
    health.signal("ingestion.run", okCount > 0, {
      results: results.map((r) => ({
        pipeline: r.pipeline,
        status: r.status,
      })),
    });
  } catch {
    /* non-fatal */
  }

  return results;
}

/**
 * Get ingestion status for the UI dashboard.
 * Shows both engine-level and webhook/ally-driven pipelines.
 */
export function getIngestionStatus(): Array<{
  name: string;
  type: "engine" | "webhook" | "ally";
  configured: boolean;
  hint: string;
}> {
  return [
    {
      name: "Calendar",
      type: "engine",
      configured: !!process.env.GOG_CALENDAR_ACCOUNT,
      hint: "gog CLI — auto-enriches people files from meetings",
    },
    {
      name: "Meetings",
      type: "webhook",
      configured: !!process.env.GODMODE_WEBHOOK_SECRET,
      hint: "Webhook — works with Fathom, Otter, Fireflies, etc.",
    },
    {
      name: "Email",
      type: "ally",
      configured: false, // ally-driven, no single env var
      hint: "Ask your ally to digest recent email via Composio or connected tools",
    },
    {
      name: "Projects",
      type: "ally",
      configured: false,
      hint: "Ask your ally to sync tasks from ClickUp, Linear, Asana, etc.",
    },
    {
      name: "Documents",
      type: "ally",
      configured: false,
      hint: "Ask your ally to index files from Drive, Notion, etc.",
    },
  ];
}
