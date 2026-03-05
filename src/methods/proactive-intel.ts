/**
 * proactive-intel.ts — RPC handlers for Proactive Intelligence.
 *
 * Scout/Observer/Advisor subsystems removed in lean audit.
 * Handlers return empty data until Phase 2 rewrite.
 *
 * RPC methods:
 *   proactiveIntel.getInsights     — Get active insights (stub: empty)
 *   proactiveIntel.dismissInsight  — Dismiss an insight (stub: not found)
 *   proactiveIntel.actOnInsight    — Mark insight as acted on (stub: not found)
 *   proactiveIntel.getDiscoveries  — Get Scout findings feed (stub: empty)
 *   proactiveIntel.getUserPatterns — Get Observer's user model (stub: null)
 *   proactiveIntel.getStatus       — Service health / last run times
 *   proactiveIntel.forceRefresh    — Trigger refresh
 *   proactiveIntel.configure       — Update settings
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Broadcast wiring (lazily set from first RPC call context) ──────────

function refreshBroadcast(context: Parameters<GatewayRequestHandler>[0]["context"]): void {
  if (!context?.broadcast) return;
  import("../services/proactive-intel.js")
    .then(({ getProactiveIntelService }) => getProactiveIntelService().setBroadcast(context.broadcast!))
    .catch(() => {});
}

// ── Handlers ───────────────────────────────────────────────────────────

const getInsights: GatewayRequestHandler = async ({ respond, context }) => {
  refreshBroadcast(context);
  respond(true, { insights: [], count: 0 });
};

const handleDismissInsight: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id || typeof id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  respond(false, null, { code: "NOT_FOUND", message: `Insight ${id} not found` });
};

const handleActOnInsight: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id || typeof id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  respond(false, null, { code: "NOT_FOUND", message: `Insight ${id} not found` });
};

const getDiscoveries: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { findings: [], count: 0, lastCheckAt: 0 });
};

const getUserPatterns: GatewayRequestHandler = async ({ respond }) => {
  respond(true, {
    patterns: null,
    message: "Proactive Intel subsystems pending Phase 2 rewrite.",
  });
};

const getStatus: GatewayRequestHandler = async ({ respond, context }) => {
  refreshBroadcast(context);
  try {
    const { getProactiveIntelService } = await import("../services/proactive-intel.js");
    const service = getProactiveIntelService();
    respond(true, service.getStatus());
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const forceRefresh: GatewayRequestHandler = async ({ respond, context }) => {
  refreshBroadcast(context);
  try {
    const { getProactiveIntelService } = await import("../services/proactive-intel.js");
    const service = getProactiveIntelService();
    const result = await service.forceRefresh();
    respond(true, {
      ...result,
      message: `Refresh complete: ${result.newFindings} new findings, ${result.newInsights} new insights`,
    });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const configure: GatewayRequestHandler = async ({ params, respond }) => {
  const updates = params as Record<string, unknown>;
  try {
    const allowedKeys = [
      "proactiveIntel.enabled",
      "proactiveIntel.cadenceMultiplier",
      "proactiveIntel.notifications.enabled",
      "proactiveIntel.briefIntegration.enabled",
    ];

    const { readFile, writeFile, mkdir } = await import("node:fs/promises");
    const { join, dirname } = await import("node:path");
    const { DATA_DIR } = await import("../data-paths.js");
    const optionsPath = join(DATA_DIR, "godmode-options.json");

    let opts: Record<string, unknown> = {};
    try {
      const raw = await readFile(optionsPath, "utf-8");
      opts = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // File doesn't exist yet
    }

    let changed = 0;
    for (const [key, value] of Object.entries(updates)) {
      if (allowedKeys.includes(key)) {
        opts[key] = value;
        changed++;
      }
    }

    await mkdir(dirname(optionsPath), { recursive: true });
    await writeFile(optionsPath, JSON.stringify(opts, null, 2), "utf-8");

    if ("proactiveIntel.enabled" in updates) {
      const { getProactiveIntelService } = await import("../services/proactive-intel.js");
      const service = getProactiveIntelService();
      if (updates["proactiveIntel.enabled"]) {
        await service.resume();
      } else {
        service.stop();
      }
    }

    respond(true, { updated: changed, options: opts });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Export ──────────────────────────────────────────────────────────────

export const proactiveIntelHandlers: GatewayRequestHandlers = {
  "proactiveIntel.getInsights": getInsights,
  "proactiveIntel.dismissInsight": handleDismissInsight,
  "proactiveIntel.actOnInsight": handleActOnInsight,
  "proactiveIntel.getDiscoveries": getDiscoveries,
  "proactiveIntel.getUserPatterns": getUserPatterns,
  "proactiveIntel.getStatus": getStatus,
  "proactiveIntel.forceRefresh": forceRefresh,
  "proactiveIntel.configure": configure,
};
