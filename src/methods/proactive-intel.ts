/**
 * proactive-intel.ts — RPC handlers for Proactive Intelligence.
 *
 * Exposes the Scout/Observer/Advisor system to the UI and agents.
 *
 * RPC methods:
 *   proactiveIntel.getInsights     — Get active insights
 *   proactiveIntel.dismissInsight  — Dismiss an insight
 *   proactiveIntel.actOnInsight    — Mark insight as acted on
 *   proactiveIntel.getDiscoveries  — Get Scout findings feed
 *   proactiveIntel.getUserPatterns — Get Observer's user model
 *   proactiveIntel.getStatus       — Service health / last run times
 *   proactiveIntel.forceRefresh    — Trigger all scans + advisor
 *   proactiveIntel.configure       — Update cadence/source settings
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { readScoutState } from "../services/scout.js";
import { readUserPatterns } from "../services/observer.js";
import {
  getActiveInsights,
  dismissInsight,
  markInsightActedOn,
  readInsightState,
  type InsightCategory,
} from "../services/advisor.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Broadcast wiring (lazily set from first RPC call context) ──────────

function refreshBroadcast(context: Parameters<GatewayRequestHandler>[0]["context"]): void {
  if (!context?.broadcast) return;
  import("../services/proactive-intel.js")
    .then(({ getProactiveIntelService }) => getProactiveIntelService().setBroadcast(context.broadcast!))
    .catch(() => {});
}

// ── Handlers ───────────────────────────────────────────────────────────

const getInsights: GatewayRequestHandler = async ({ params, respond, context }) => {
  refreshBroadcast(context);
  const { category, limit } = params as { category?: InsightCategory; limit?: number };
  try {
    let insights = await getActiveInsights(category);
    if (typeof limit === "number" && limit > 0) {
      insights = insights.slice(0, limit);
    }
    respond(true, { insights, count: insights.length });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const handleDismissInsight: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id || typeof id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  try {
    const success = await dismissInsight(id);
    if (!success) {
      respond(false, null, { code: "NOT_FOUND", message: `Insight ${id} not found` });
      return;
    }
    respond(true, { dismissed: true, id });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const handleActOnInsight: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id || typeof id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  try {
    const success = await markInsightActedOn(id);
    if (!success) {
      respond(false, null, { code: "NOT_FOUND", message: `Insight ${id} not found` });
      return;
    }
    respond(true, { actedOn: true, id });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const getDiscoveries: GatewayRequestHandler = async ({ params, respond }) => {
  const { source, limit } = params as { source?: string; limit?: number };
  try {
    const state = await readScoutState();
    let findings = state.findings;

    if (source && typeof source === "string") {
      findings = findings.filter((f) => f.source === source);
    }

    // Sort by most recent first
    findings = findings.sort((a, b) => b.discoveredAt - a.discoveredAt);

    if (typeof limit === "number" && limit > 0) {
      findings = findings.slice(0, limit);
    }

    respond(true, {
      findings,
      count: findings.length,
      lastCheckAt: state.lastCheckAt,
    });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const getUserPatterns: GatewayRequestHandler = async ({ respond }) => {
  try {
    const patterns = await readUserPatterns();
    if (!patterns) {
      respond(true, {
        patterns: null,
        message: "No patterns collected yet. The observer runs every 15 minutes.",
      });
      return;
    }
    respond(true, { patterns });
  } catch (err) {
    respond(false, null, {
      code: "INTEL_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const getStatus: GatewayRequestHandler = async ({ respond, context }) => {
  refreshBroadcast(context);
  try {
    const { getProactiveIntelService } = await import("../services/proactive-intel.js");
    const service = getProactiveIntelService();
    const status = service.getStatus();

    // Also read insight/finding counts from disk
    const scoutState = await readScoutState();
    const insightState = await readInsightState();
    const activeInsights = insightState.insights.filter(
      (i) => !i.dismissed && (!i.expiresAt || Date.now() < i.expiresAt),
    );

    respond(true, {
      ...status,
      totalFindings: scoutState.findings.length,
      totalInsights: activeInsights.length,
      lastAdvisorRun: insightState.lastAdvisorRun,
    });
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
    // Validate keys
    const allowedKeys = [
      "proactiveIntel.enabled",
      "proactiveIntel.scout.enabled",
      "proactiveIntel.observer.enabled",
      "proactiveIntel.advisor.enabled",
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

    // If proactiveIntel.enabled was toggled, start/stop the service
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
