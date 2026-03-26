/**
 * Smoke tests for delegate-tool.ts.
 *
 * Tests tool creation, validation, preview flow, and action routing.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/services/paperclip-client.js", () => ({
  isPaperclipReady: vi.fn(() => false),
  createTask: vi.fn(),
  findOrCreateProject: vi.fn(),
  resolveAgentId: vi.fn(),
  wakeupAgent: vi.fn(),
}));

vi.mock("../src/lib/projects-state.js", () => ({
  updateProjects: vi.fn(async (fn: (state: { projects: unknown[] }) => void) => {
    const state = { projects: [] };
    fn(state);
  }),
  listProjects: vi.fn(async () => []),
  getProject: vi.fn(async () => null),
  clearProjects: vi.fn(),
  newProjectId: vi.fn(() => `proj-${Date.now()}`),
  newIssueId: vi.fn(() => `iss-${Date.now()}-${Math.random()}`),
  inferTaskType: vi.fn(() => "research"),
  pickQAPersona: vi.fn(() => "qa-reviewer"),
}));

vi.mock("../src/lib/queue-state.js", () => ({
  updateQueueState: vi.fn(async (fn: (state: { items: unknown[] }) => unknown) => {
    const state = { items: [] };
    const result = fn(state);
    return { result };
  }),
  readQueueState: vi.fn(async () => ({ items: [] })),
  newQueueItemId: vi.fn((title: string) => `q-${title.slice(0, 8)}-${Date.now()}`),
}));

vi.mock("../src/lib/agent-roster.js", () => ({
  resolvePersona: vi.fn(() => ({ name: "Researcher", slug: "researcher", engine: "claude" })),
  isPersonaDormant: vi.fn(() => false),
  loadRoster: vi.fn(() => [
    { name: "Researcher", slug: "researcher", mission: "Research tasks", taskTypes: ["research"] },
  ]),
}));

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
}));

vi.mock("../src/services/queue-processor.js", () => ({
  getQueueProcessor: vi.fn(() => ({ processAllPending: vi.fn() })),
}));

vi.mock("../src/services/agent-toolkit-server.js", () => ({
  isToolkitRunning: vi.fn(() => false),
  getToolkitBaseUrl: vi.fn(() => "http://localhost:3001"),
}));

vi.mock("../src/methods/trust-tracker.js", () => ({
  getAutonomyLevel: vi.fn(async () => "supervised"),
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("delegate tool", () => {
  let createDelegateTool: typeof import("../src/tools/delegate-tool.js").createDelegateTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/delegate-tool.js");
    createDelegateTool = mod.createDelegateTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createDelegateTool();
    expect(tool.name).toBe("delegate");
    expect(tool.label).toBe("Delegate");
    expect(tool.parameters.required).toContain("action");
  });

  it("rejects unknown action", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "unknown" });
    const data = parseResult(result);
    expect(data.error).toContain("Unknown action");
  });

  it("delegate: requires title, description, issues", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", {
      action: "delegate",
      title: "Test Project",
      // missing description and issues
    });
    const data = parseResult(result);
    expect(data.error).toContain("Missing required fields");
  });

  it("delegate: returns preview when confirmed=false", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", {
      action: "delegate",
      title: "AI Research Sprint",
      description: "Research current AI landscape",
      issues: [
        { title: "Survey papers", description: "Find top 10 papers" },
        { title: "Summarize findings", description: "Write executive summary" },
      ],
      confirmed: false,
    });
    const data = parseResult(result);
    expect(data._preview).toBe(true);
    expect(data.issueCount).toBe(2);
    expect(data.qaNote).toBeTruthy(); // 2+ issues → QA note
  });

  it("delegate: creates project when confirmed=true", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", {
      action: "delegate",
      title: "AI Research Sprint",
      description: "Research current AI landscape",
      issues: [{ title: "Survey papers", description: "Find top 10 papers" }],
      confirmed: true,
    });
    const data = parseResult(result);
    expect(data.success).toBe(true);
    expect(data.projectId).toBeTruthy();
  });

  it("status: returns error when no active projects", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "status" });
    const data = parseResult(result);
    expect(data.error).toContain("No active projects");
  });

  it("cancel: returns error for missing projectId", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "cancel" });
    const data = parseResult(result);
    expect(data.error).toContain("Missing projectId");
  });

  it("cancel: returns error for non-existent project", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "cancel", projectId: "nonexistent" });
    const data = parseResult(result);
    expect(data.error).toContain("not found");
  });

  it("projects: returns empty list", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "projects" });
    const data = parseResult(result);
    expect(data.count).toBe(0);
    expect(data.projects).toEqual([]);
  });

  it("team: returns roster", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "team" });
    const data = parseResult(result);
    expect(data.team).toBeTruthy();
  });

  it("steer: returns unsupported message", async () => {
    const tool = createDelegateTool();
    const result = await tool.execute("call-1", { action: "steer" });
    const data = parseResult(result);
    expect(data.error).toContain("not supported");
  });
});
