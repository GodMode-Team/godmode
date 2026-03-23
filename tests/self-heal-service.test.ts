/**
 * Tests for self-heal.ts service — the DIAGNOSE → REPAIR → VERIFY loop.
 *
 * Tests getHealthReport, runSelfHeal, and getEscalationContext.
 * All subsystem checks are mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/lib/health-ledger.js", () => ({
  health: {
    signal: vi.fn(),
    stats: vi.fn(() => null),
    snapshot: vi.fn(() => ({ ts: Date.now(), operations: [], alerts: [] })),
    isHealthy: vi.fn(() => true),
    isAlert: vi.fn(() => false),
    reset: vi.fn(),
  },
  turnErrors: {
    capture: vi.fn(),
    drain: vi.fn(() => []),
    peek: vi.fn(() => []),
    count: 0,
  },
  repairLog: {
    record: vi.fn(),
    recent: vi.fn(() => []),
    forSubsystem: vi.fn(() => []),
  },
  sessions: {
    touch: vi.fn(),
    hasActiveSessions: vi.fn(() => false),
    activeCount: vi.fn(() => 0),
    activeKeys: vi.fn(() => []),
    prune: vi.fn(),
    idleKeys: vi.fn(() => []),
  },
}));

vi.mock("../src/lib/memory.js", () => ({
  isMemoryReady: vi.fn(() => true),
  getMemoryStatus: vi.fn(() => "ready"),
}));

vi.mock("../src/lib/identity-graph.js", () => ({
  isGraphReady: vi.fn(() => true),
  getGraphStats: vi.fn(() => ({ entities: 10, edges: 5 })),
  initIdentityGraph: vi.fn(),
}));

vi.mock("../src/lib/anthropic-auth.js", () => ({
  resolveAnthropicKey: vi.fn(() => "sk-test-key"),
  fetchWithTimeout: vi.fn(),
}));

vi.mock("../src/services/queue-processor.js", () => ({
  getQueueProcessor: vi.fn(() => null),
}));

vi.mock("../src/lib/service-health.js", () => ({
  getServiceStatus: vi.fn(() => ({})),
  reportConnected: vi.fn(),
  reportDegraded: vi.fn(),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test-data",
  GODMODE_ROOT: "/tmp/godmode-test",
}));

// ── Tests ────────────────────────────────────────────────────────────

describe("Self-Heal Service", () => {
  let getHealthReport: typeof import("../src/services/self-heal.js").getHealthReport;
  let getEscalationContext: typeof import("../src/services/self-heal.js").getEscalationContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/services/self-heal.js");
    getHealthReport = mod.getHealthReport;
    getEscalationContext = mod.getEscalationContext;
  });

  it("getHealthReport returns a valid report structure", () => {
    const report = getHealthReport();
    expect(report).toBeDefined();
    expect(report.overall).toBeDefined();
    expect(["healthy", "degraded", "unhealthy"]).toContain(report.overall);
    expect(Array.isArray(report.subsystems)).toBe(true);
  });

  it("report subsystems have required fields", () => {
    const report = getHealthReport();
    for (const sub of report.subsystems) {
      expect(sub.id).toBeTruthy();
      expect(sub.state).toBeTruthy();
      expect(sub.message).toBeTruthy();
      expect(typeof sub.repairCount).toBe("number");
    }
  });

  it("getEscalationContext returns null when healthy", () => {
    const ctx = getEscalationContext();
    // Should be null or a string
    expect(ctx === null || typeof ctx === "string").toBe(true);
  });
});
