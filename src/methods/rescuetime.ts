/**
 * rescuetime.ts — RPC handlers for RescueTime integration.
 *
 * Provides manual trigger and data access for RescueTime productivity data.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { getRescueTimeFetcher } from "../services/rescuetime-fetcher.js";
import { localDateString } from "../data-paths.js";
import { getEnvVar } from "../lib/env-writer.js";

/** Trigger an immediate fetch for a specific date (or today). */
const pull: GatewayRequestHandler = async ({ params, respond }) => {
  const fetcher = getRescueTimeFetcher();
  if (!fetcher) {
    respond(false, null, { code: "SERVICE_UNAVAILABLE", message: "RescueTime fetcher not initialized" });
    return;
  }

  const apiKey = getEnvVar("RESCUETIME_API_KEY");
  if (!apiKey) {
    respond(false, null, {
      code: "NOT_CONFIGURED",
      message: "RESCUETIME_API_KEY not set. Add it to ~/.openclaw/.env or ~/godmode/.env",
    });
    return;
  }

  const { date } = params as { date?: string };
  const targetDate = date ?? localDateString();

  const result = await fetcher.fetchDate(targetDate);
  respond(true, {
    date: targetDate,
    fetched: result.ok,
    files: result.files,
  });
};

/** Return the most recent day's data. */
const latest: GatewayRequestHandler = async ({ respond }) => {
  const fetcher = getRescueTimeFetcher();
  if (!fetcher) {
    respond(false, null, { code: "SERVICE_UNAVAILABLE", message: "RescueTime fetcher not initialized" });
    return;
  }

  const data = await fetcher.latestData();
  if (!data) {
    respond(true, { available: false, message: "No RescueTime data found for today or yesterday" });
    return;
  }

  respond(true, { available: true, ...data });
};

export const rescuetimeHandlers: Record<string, GatewayRequestHandler> = {
  "rescueTime.pull": pull,
  "rescueTime.latest": latest,
};
