/**
 * health.ts — RPC handler for service health status.
 *
 * Exposes godmode.serviceHealth so the UI and ally can query
 * connectivity status of all tracked services.
 */

export const healthHandlers = {
  "godmode.serviceHealth": async () => {
    const { getHealthSummary, getSetupProgress } = await import("../lib/service-health.js");
    return { services: getHealthSummary(), progress: getSetupProgress() };
  },
};
