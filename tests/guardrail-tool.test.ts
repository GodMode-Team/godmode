/**
 * Smoke tests for guardrail.ts tool (create_guardrail).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/services/guardrails.js", () => ({
  addCustomGuardrail: vi.fn(async (rule: Record<string, unknown>) => ({
    id: `guard-${Date.now()}`,
    ...rule,
    trigger: rule.trigger ?? { tool: "", patterns: [] },
  })),
}));

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("create_guardrail tool", () => {
  let createGuardrailTool: typeof import("../src/tools/guardrail.js").createGuardrailTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/guardrail.js");
    createGuardrailTool = mod.createGuardrailTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createGuardrailTool({});
    expect(tool.name).toBe("create_guardrail");
    expect(tool.parameters.required).toContain("name");
    expect(tool.parameters.required).toContain("tool");
    expect(tool.parameters.required).toContain("patterns");
    expect(tool.parameters.required).toContain("message");
  });

  it("rejects missing name", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "",
      tool: "Bash",
      patterns: ["npm audit"],
      message: "Don't use npm audit",
    });
    const data = parseResult(result);
    expect(data.error).toContain("name is required");
  });

  it("rejects missing tool", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "Block audit",
      tool: "",
      patterns: ["npm audit"],
      message: "Don't use npm audit",
    });
    const data = parseResult(result);
    expect(data.error).toContain("tool is required");
  });

  it("rejects empty patterns", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "Block audit",
      tool: "Bash",
      patterns: [],
      message: "Don't use npm audit",
    });
    const data = parseResult(result);
    expect(data.error).toContain("at least one pattern");
  });

  it("rejects redirect without redirectTo", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "Redirect Twitter",
      tool: "web_fetch",
      patterns: ["twitter.com"],
      action: "redirect",
      message: "Use x_read instead",
    });
    const data = parseResult(result);
    expect(data.error).toContain("redirectTo is required");
  });

  it("creates a block guardrail", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "Block npm audit",
      tool: "Bash",
      patterns: ["npm audit", "npx audit"],
      message: "npm audit is blocked",
    });
    const data = parseResult(result);
    expect(data.created).toBe(true);
    expect(data.guardrail.name).toBe("Block npm audit");
    expect(data.message).toContain("block");
  });

  it("creates a redirect guardrail", async () => {
    const tool = createGuardrailTool({});
    const result = await tool.execute("call-1", {
      name: "Redirect Twitter",
      tool: "web_fetch",
      patterns: ["twitter.com"],
      action: "redirect",
      redirectTo: "x_read",
      message: "Use x_read tool for Twitter",
    });
    const data = parseResult(result);
    expect(data.created).toBe(true);
    expect(data.message).toContain("redirect");
  });
});
