/**
 * service-health.ts — Lightweight service health tracking.
 *
 * Tracks the connectivity status of GodMode's core services so the UI
 * can show setup progress and the ally can surface degraded subsystems.
 *
 * Usage:
 *   import { reportConnected, reportDegraded, reportUnavailable } from "./service-health.js";
 *   reportConnected("calendar");
 *   reportDegraded("memory", "Mem0 init failed", "Check ANTHROPIC_API_KEY in Settings");
 */

export interface ServiceStatus {
  service: string;
  status: "connected" | "degraded" | "unavailable";
  message?: string;
  setupAction?: string;
  lastChecked: number;
}

/** Known services tracked by GodMode. */
const KNOWN_SERVICES = [
  "calendar",
  "vault",
  "memory",
  "identity-graph",
  "honcho",
  "queue",
  "heartbeat",
] as const;

export type KnownService = (typeof KNOWN_SERVICES)[number];

const health: Map<string, ServiceStatus> = new Map();

// Initialize all known services as unavailable until proven otherwise
for (const svc of KNOWN_SERVICES) {
  health.set(svc, {
    service: svc,
    status: "unavailable",
    message: "Not yet checked",
    lastChecked: 0,
  });
}

export function reportConnected(service: string): void {
  health.set(service, {
    service,
    status: "connected",
    lastChecked: Date.now(),
  });
}

export function reportDegraded(service: string, message: string, setupAction?: string): void {
  health.set(service, {
    service,
    status: "degraded",
    message,
    setupAction,
    lastChecked: Date.now(),
  });
}

export function reportUnavailable(service: string, message: string, setupAction?: string): void {
  health.set(service, {
    service,
    status: "unavailable",
    message,
    setupAction,
    lastChecked: Date.now(),
  });
}

/** Return the current status of all tracked services. */
export function getHealthSummary(): ServiceStatus[] {
  return Array.from(health.values());
}

/** Return a progress summary: how many services are connected vs total. */
export function getSetupProgress(): { connected: number; total: number; percentage: number } {
  const all = Array.from(health.values());
  const connected = all.filter((s) => s.status === "connected").length;
  const total = all.length;
  const percentage = total > 0 ? Math.round((connected / total) * 100) : 0;
  return { connected, total, percentage };
}
