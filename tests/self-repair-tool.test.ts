/**
 * Smoke tests for self-repair.ts tool (godmode_repair).
 *
 * Tests tool creation and parameter validation.
 * Heavy mocking since the tool imports self-heal service dynamically.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
}));

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
}));

vi.mock("../src/services/self-heal.js", () => ({
  getHealthReport: vi.fn(() => ({
    overall: "healthy",
    subsystems: [
      { id: "memory", state: "healthy", message: "OK", repairCount: 0, lastRepair: null },
      { id: "queue", state: "healthy", message: "OK", repairCount: 0, lastRepair: null },
    ],
    ledger: { operations: [], alerts: [] },
  })),
  runSelfHeal: vi.fn(async () => ({
    checked: 7,
    repaired: 0,
    failures: [],
  })),
  getEscalationContext: vi.fn(() => null),
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("godmode_repair tool", () => {
  let createSelfRepairTool: typeof import("../src/tools/self-repair.js").createSelfRepairTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/self-repair.js");
    createSelfRepairTool = mod.createSelfRepairTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createSelfRepairTool();
    expect(tool.name).toBe("godmode_repair");
    expect(tool.label).toBe("System");
    expect(tool.parameters.required).toContain("action");
  });

  it("status action returns health report", async () => {
    const tool = createSelfRepairTool();
    const result = await tool.execute("call-1", { action: "status" });
    const data = parseResult(result);
    expect(data.status).toBe("healthy");
    expect(data.detail).toContain("System Health");
    expect(data.subsystems).toBeDefined();
  });

  it("diagnose action returns issues count", async () => {
    const tool = createSelfRepairTool();
    const result = await tool.execute("call-1", { action: "diagnose" });
    const data = parseResult(result);
    expect(data.issues).toBeDefined();
    expect(data.detail).toBeTruthy();
    expect(data.recommendation).toBeTruthy();
  });

  it("repair action runs self-heal", async () => {
    const tool = createSelfRepairTool();
    const result = await tool.execute("call-1", { action: "repair" });
    const data = parseResult(result);
    expect(data.repaired).toBeDefined();
    expect(data.detail).toContain("Repair Results");
  });

  it("history action returns empty log", async () => {
    const tool = createSelfRepairTool();
    const result = await tool.execute("call-1", { action: "history" });
    const data = parseResult(result);
    expect(data.detail).toContain("No repairs recorded");
  });

  it("rejects unknown action", async () => {
    const tool = createSelfRepairTool();
    const result = await tool.execute("call-1", { action: "explode" });
    const data = parseResult(result);
    expect(data.error).toContain("Unknown action");
  });
});
