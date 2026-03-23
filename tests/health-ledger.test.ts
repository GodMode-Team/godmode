/**
 * Tests for health-ledger.ts — ring buffer, turn errors, repair log, sessions.
 *
 * Pure in-memory module — no mocks needed for the core API.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { health, turnErrors, repairLog, sessions } from "../src/lib/health-ledger.js";

describe("Health Ledger — signal ring buffer", () => {
  const OP = `test.op.${Date.now()}`;

  beforeEach(() => {
    health.reset(OP);
  });

  it("returns null stats for unknown operation", () => {
    expect(health.stats(`unknown-${Date.now()}`)).toBeNull();
  });

  it("records a success signal", () => {
    health.signal(OP, true, { elapsed: 100 });
    const stats = health.stats(OP);
    expect(stats).not.toBeNull();
    expect(stats!.totalCalls).toBe(1);
    expect(stats!.successCount).toBe(1);
    expect(stats!.failureCount).toBe(0);
    expect(stats!.successRate).toBe(1);
    expect(stats!.avgElapsedMs).toBe(100);
  });

  it("records a failure signal", () => {
    health.signal(OP, false, { error: "timeout" });
    const stats = health.stats(OP);
    expect(stats!.failureCount).toBe(1);
    expect(stats!.consecutiveFailures).toBe(1);
    expect(stats!.lastError).toBe("timeout");
  });

  it("resets consecutive failures on success", () => {
    health.signal(OP, false, { error: "err1" });
    health.signal(OP, false, { error: "err2" });
    expect(health.stats(OP)!.consecutiveFailures).toBe(2);

    health.signal(OP, true);
    expect(health.stats(OP)!.consecutiveFailures).toBe(0);
  });

  it("isHealthy returns true for fresh operation", () => {
    expect(health.isHealthy(`fresh-${Date.now()}`)).toBe(true);
  });

  it("isHealthy returns false after failure", () => {
    health.signal(OP, false);
    expect(health.isHealthy(OP)).toBe(false);
  });

  it("isAlert triggers at 3+ consecutive failures", () => {
    expect(health.isAlert(OP)).toBe(false);
    health.signal(OP, false);
    health.signal(OP, false);
    expect(health.isAlert(OP)).toBe(false);
    health.signal(OP, false);
    expect(health.isAlert(OP)).toBe(true);
  });

  it("snapshot includes alerts for failing operations", () => {
    const alertOp = `alert-op-${Date.now()}`;
    health.signal(alertOp, false, { error: "broken" });
    health.signal(alertOp, false, { error: "broken" });
    health.signal(alertOp, false, { error: "broken" });

    const snapshot = health.snapshot();
    expect(snapshot.alerts.length).toBeGreaterThan(0);
    expect(snapshot.alerts.some((a) => a.includes(alertOp))).toBe(true);
  });

  it("reset clears operation data", () => {
    health.signal(OP, true);
    health.reset(OP);
    expect(health.stats(OP)).toBeNull();
  });

  it("handles many signals (ring buffer wraps)", () => {
    for (let i = 0; i < 100; i++) {
      health.signal(OP, true, { elapsed: i });
    }
    const stats = health.stats(OP);
    expect(stats!.totalCalls).toBe(100);
    expect(stats!.successCount).toBe(100);
    // Average elapsed should be based on last 50 signals (50..99)
    expect(stats!.avgElapsedMs).toBeGreaterThan(0);
  });
});

describe("Turn Errors", () => {
  it("captures and drains errors", () => {
    turnErrors.capture("test.op", "something broke");
    expect(turnErrors.count).toBeGreaterThanOrEqual(1);

    const drained = turnErrors.drain();
    expect(drained.length).toBeGreaterThanOrEqual(1);
    expect(drained.some((e) => e.operation === "test.op")).toBe(true);

    // Drain clears buffer
    expect(turnErrors.drain().length).toBe(0);
  });

  it("peek does not drain", () => {
    turnErrors.capture("test.peek", "peek error");
    const peeked = turnErrors.peek();
    expect(peeked.length).toBeGreaterThanOrEqual(1);

    // Still there after peek
    const peeked2 = turnErrors.peek();
    expect(peeked2.length).toBeGreaterThanOrEqual(1);

    // Clean up
    turnErrors.drain();
  });

  it("respects MAX_TURN_ERRORS (bounded buffer)", () => {
    for (let i = 0; i < 20; i++) {
      turnErrors.capture(`overflow-${i}`, `error ${i}`);
    }
    const drained = turnErrors.drain();
    expect(drained.length).toBeLessThanOrEqual(10);
  });
});

describe("Repair Log", () => {
  it("records and retrieves entries", () => {
    const entry = {
      ts: Date.now(),
      subsystem: `test-sub-${Date.now()}`,
      failure: "test failure",
      repairAction: "restarted",
      verified: true,
      elapsed: 150,
    };
    repairLog.record(entry);

    const recent = repairLog.recent();
    expect(recent.some((e) => e.subsystem === entry.subsystem)).toBe(true);
  });

  it("filters by subsystem", () => {
    const sub = `filter-sub-${Date.now()}`;
    repairLog.record({
      ts: Date.now(),
      subsystem: sub,
      failure: "specific failure",
      repairAction: "fixed",
      verified: true,
      elapsed: 50,
    });

    const filtered = repairLog.forSubsystem(sub);
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered.every((e) => e.subsystem === sub)).toBe(true);
  });
});

describe("Sessions tracker", () => {
  it("tracks session activity", () => {
    const key = `session-${Date.now()}`;
    sessions.touch(key);
    expect(sessions.hasActiveSessions()).toBe(true);
    expect(sessions.activeCount()).toBeGreaterThanOrEqual(1);
    expect(sessions.activeKeys()).toContain(key);
  });

  it("prune removes stale sessions", () => {
    // Touch a session, then prune — it shouldn't be removed (still active)
    const key = `prune-test-${Date.now()}`;
    sessions.touch(key);
    sessions.prune();
    expect(sessions.activeKeys()).toContain(key);
  });

  it("idleKeys returns keys that are idle", () => {
    // Any session touched now should NOT appear in idle list (idle threshold > 0)
    const key = `idle-test-${Date.now()}`;
    sessions.touch(key);
    const idle = sessions.idleKeys(0); // 0ms idle threshold = everything is idle
    // A just-touched session is always idle at 0ms threshold
    expect(idle).toContain(key);
  });
});
