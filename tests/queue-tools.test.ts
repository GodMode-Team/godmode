/**
 * Smoke tests for queue tools: queue-add, queue-check, queue-action, queue-steer.
 *
 * All tools are tested for:
 *   1. Tool creation (name, label, parameters)
 *   2. Parameter validation (missing required fields)
 *   3. Happy path (mocked dependencies)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/lib/queue-state.js", () => {
  const items: Array<Record<string, unknown>> = [];
  return {
    updateQueueState: vi.fn(async (fn: (state: { items: typeof items }) => unknown) => {
      const state = { items };
      const result = fn(state);
      return { result };
    }),
    readQueueState: vi.fn(async () => ({ items })),
    newQueueItemId: vi.fn((title: string) => `q-${title.slice(0, 8)}-${Date.now()}`),
  };
});

vi.mock("../src/lib/agent-roster.js", () => ({
  resolvePersona: vi.fn(() => ({ name: "Test Agent", slug: "test-agent", engine: "claude" })),
  isPersonaDormant: vi.fn(() => false),
  loadRoster: vi.fn(() => []),
}));

vi.mock("../src/services/queue-processor.js", () => ({
  getQueueProcessor: vi.fn(() => ({ processAllPending: vi.fn() })),
}));

vi.mock("../src/lib/sdk-helpers.js", async () => {
  return {
    jsonResult: (payload: unknown) => ({
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      details: payload,
    }),
    withFileLock: vi.fn(async (_path: string, _opts: unknown, fn: () => Promise<unknown>) => fn()),
  };
});

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── queue-add ────────────────────────────────────────────────────────

describe("queue-add tool", () => {
  let createQueueAddTool: typeof import("../src/tools/queue-add.js").createQueueAddTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/queue-add.js");
    createQueueAddTool = mod.createQueueAddTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createQueueAddTool({});
    expect(tool.name).toBe("queue_add");
    expect(tool.label).toBe("Queue");
    expect(tool.parameters.required).toContain("type");
    expect(tool.parameters.required).toContain("title");
  });

  it("rejects missing title", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", { type: "research", title: "" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("title is required");
  });

  it("rejects invalid type", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", { type: "invalid-type", title: "Test" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("Invalid type");
  });

  it("rejects auto-generated ID titles", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", {
      type: "research",
      title: "batch-1234567890-1",
    });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("auto-generated ID");
  });

  it("returns preview when confirmed is not set", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", {
      type: "research",
      title: "Investigate AI trends",
    });
    const data = parseResult(result);
    expect(data.queued).toBe(false);
    expect(data.preview).toBe(true);
    expect(data.scopedBrief.title).toBe("Investigate AI trends");
  });

  it("enqueues item when confirmed=true", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", {
      type: "research",
      title: "Investigate AI trends",
      confirmed: true,
    });
    const data = parseResult(result);
    expect(data.queued).toBe(true);
    expect(data.item.title).toBe("Investigate AI trends");
    expect(data.item.status).toBe("pending");
  });

  it("requires url for type 'url'", async () => {
    const tool = createQueueAddTool({});
    const result = await tool.execute("call-1", {
      type: "url",
      title: "Read article",
    });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("url is required");
  });
});

// ── queue-check ──────────────────────────────────────────────────────

describe("queue-check tool", () => {
  let createQueueCheckTool: typeof import("../src/tools/queue-check.js").createQueueCheckTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { readQueueState } = await import("../src/lib/queue-state.js");
    (readQueueState as ReturnType<typeof vi.fn>).mockResolvedValue({
      items: [
        { id: "q-1", title: "Research AI", type: "research", status: "pending", priority: "normal", createdAt: Date.now() },
        { id: "q-2", title: "Write report", type: "creative", status: "done", priority: "normal", createdAt: Date.now() - 1000 },
      ],
    });
    const mod = await import("../src/tools/queue-check.js");
    createQueueCheckTool = mod.createQueueCheckTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createQueueCheckTool();
    expect(tool.name).toBe("queue_check");
    expect(tool.label).toBe("Queue");
  });

  it("returns all items when no filters", async () => {
    const tool = createQueueCheckTool();
    const result = await tool.execute("call-1", {});
    const data = parseResult(result);
    expect(data.total).toBe(2);
    expect(data.items.length).toBe(2);
  });

  it("filters by status", async () => {
    const tool = createQueueCheckTool();
    const result = await tool.execute("call-1", { status: "pending" });
    const data = parseResult(result);
    expect(data.total).toBe(1);
    expect(data.items[0].status).toBe("pending");
  });

  it("filters by query", async () => {
    const tool = createQueueCheckTool();
    const result = await tool.execute("call-1", { query: "report" });
    const data = parseResult(result);
    expect(data.total).toBe(1);
    expect(data.items[0].title).toBe("Write report");
  });
});

// ── queue-action ─────────────────────────────────────────────────────

describe("queue-action tool", () => {
  let createQueueActionTool: typeof import("../src/tools/queue-action.js").createQueueActionTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/queue-action.js");
    createQueueActionTool = mod.createQueueActionTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createQueueActionTool();
    expect(tool.name).toBe("queue_action");
    expect(tool.parameters.required).toContain("id");
    expect(tool.parameters.required).toContain("action");
  });

  it("rejects missing id", async () => {
    const tool = createQueueActionTool();
    const result = await tool.execute("call-1", { id: "", action: "approve" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("id is required");
  });

  it("rejects missing action", async () => {
    const tool = createQueueActionTool();
    const result = await tool.execute("call-1", { id: "q-1", action: "" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("action is required");
  });

  it("rejects unknown action", async () => {
    const tool = createQueueActionTool();
    const result = await tool.execute("call-1", { id: "q-1", action: "explode" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("Unknown action");
  });
});

// ── queue-steer ──────────────────────────────────────────────────────

describe("queue-steer tool", () => {
  let createQueueSteerTool: typeof import("../src/tools/queue-steer.js").createQueueSteerTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/queue-steer.js");
    createQueueSteerTool = mod.createQueueSteerTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createQueueSteerTool();
    expect(tool.name).toBe("queue_steer");
    expect(tool.parameters.required).toContain("itemId");
    expect(tool.parameters.required).toContain("instruction");
  });

  it("rejects missing itemId or instruction", async () => {
    const tool = createQueueSteerTool();
    const result = await tool.execute("call-1", { itemId: "", instruction: "focus" });
    const data = parseResult(result);
    expect(data.error).toBeDefined();
  });

  it("returns error for non-existent item", async () => {
    const tool = createQueueSteerTool();
    const result = await tool.execute("call-1", {
      itemId: "nonexistent",
      instruction: "focus on mobile",
    });
    const data = parseResult(result);
    expect(data.error).toContain("not found");
  });
});
