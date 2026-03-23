/**
 * Smoke tests for trust-rate.ts tool.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

let trustState: Record<string, unknown> = {};

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async () => JSON.stringify(trustState)),
  writeFile: vi.fn(async (_p: string, content: string) => {
    trustState = JSON.parse(content);
  }),
  mkdir: vi.fn(async () => undefined),
}));

vi.mock("../src/lib/secure-fs.js", () => ({
  secureMkdir: vi.fn(async () => undefined),
  secureWriteFile: vi.fn(async (_p: string, content: string) => {
    trustState = JSON.parse(content);
  }),
}));

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test-trust",
}));

vi.mock("../src/methods/trust-tracker.js", () => ({
  MAX_WORKFLOWS: 20,
  SCORE_THRESHOLD: 10,
  FEEDBACK_THRESHOLD: 7,
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("trust_rate tool", () => {
  let createTrustRateTool: typeof import("../src/tools/trust-rate.js").createTrustRateTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    trustState = {
      workflows: [],
      ratings: [],
      workflowFeedback: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mod = await import("../src/tools/trust-rate.js");
    createTrustRateTool = mod.createTrustRateTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTrustRateTool({});
    expect(tool.name).toBe("trust_rate");
    expect(tool.parameters.required).toContain("workflow");
    expect(tool.parameters.required).toContain("rating");
  });

  it("rejects empty workflow", async () => {
    const tool = createTrustRateTool({});
    const result = await tool.execute("call-1", { workflow: "", rating: 8 });
    const data = parseResult(result);
    expect(data.error).toContain("workflow is required");
  });

  it("rejects out-of-range rating", async () => {
    const tool = createTrustRateTool({});
    const result = await tool.execute("call-1", { workflow: "daily brief", rating: 11 });
    const data = parseResult(result);
    expect(data.error).toContain("rating must be an integer");
  });

  it("rejects non-integer rating", async () => {
    const tool = createTrustRateTool({});
    const result = await tool.execute("call-1", { workflow: "daily brief", rating: 7.5 });
    const data = parseResult(result);
    expect(data.error).toContain("rating must be an integer");
  });

  it("records a valid rating", async () => {
    const tool = createTrustRateTool({});
    const result = await tool.execute("call-1", {
      workflow: "daily brief",
      rating: 8,
      note: "Good summary",
    });
    const data = parseResult(result);
    expect(data.rated).toBe(true);
    expect(data.workflow).toBe("daily brief");
    expect(data.rating).toBe(8);
    expect(data.count).toBe(1);
  });

  it("auto-adds new workflow", async () => {
    const tool = createTrustRateTool({});
    await tool.execute("call-1", { workflow: "email triage", rating: 9 });
    // Check that the workflow was persisted
    expect(trustState).toBeDefined();
    const state = trustState as { workflows: string[] };
    expect(state.workflows).toContain("email triage");
  });
});
