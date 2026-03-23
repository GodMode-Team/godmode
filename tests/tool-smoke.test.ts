/**
 * Smoke tests for tool constructors and basic parameter validation.
 *
 * These tests verify that each tool:
 *  - Can be constructed without errors
 *  - Has correct name, label, description
 *  - Has required parameters defined
 *  - Rejects missing/invalid parameters gracefully
 *
 * They do NOT test external integrations (memory, queue, filesystem).
 */

import { describe, it, expect, vi } from "vitest";

// Mock external dependencies that tools import at construction time
vi.mock("../src/lib/memory.js", () => ({
  queryPeer: vi.fn().mockResolvedValue("mocked answer"),
  isMemoryReady: vi.fn().mockReturnValue(false),
}));

vi.mock("../src/lib/queue-state.js", () => ({
  updateQueueState: vi.fn().mockResolvedValue(undefined),
  readQueueState: vi.fn().mockResolvedValue({ items: [], updatedAt: "" }),
}));

vi.mock("../src/services/queue-processor.js", () => ({
  getQueueProcessor: vi.fn().mockReturnValue(null),
}));

vi.mock("../src/lib/agent-roster.js", () => ({
  resolvePersona: vi.fn().mockResolvedValue(null),
}));

// ── Honcho Query Tool ─────────────────────────────────────────────

describe("createHonchoQueryTool", () => {
  it("constructs with correct metadata", async () => {
    const { createHonchoQueryTool } = await import("../src/tools/honcho-query.js");
    const tool = createHonchoQueryTool({});
    expect(tool.name).toBe("honcho_query");
    expect(tool.label).toBe("Memory Query");
    expect(tool.parameters.required).toContain("question");
  });

  it("rejects empty question", async () => {
    const { createHonchoQueryTool } = await import("../src/tools/honcho-query.js");
    const tool = createHonchoQueryTool({});
    const result = await tool.execute("call-1", { question: "" });
    expect(JSON.stringify(result)).toContain("error");
  });

  it("returns error when memory not ready", async () => {
    const { createHonchoQueryTool } = await import("../src/tools/honcho-query.js");
    const tool = createHonchoQueryTool({});
    const result = await tool.execute("call-2", { question: "What are the user's priorities?" });
    expect(JSON.stringify(result)).toContain("not configured");
  });
});

// ── Memory Search Shim Tool ───────────────────────────────────────

describe("createMemorySearchShimTool", () => {
  it("constructs with correct metadata", async () => {
    const { createMemorySearchShimTool } = await import("../src/tools/memory-search-shim.js");
    const tool = createMemorySearchShimTool({});
    expect(tool.name).toBe("memory_search");
    expect(tool.parameters.required).toContain("query");
  });

  it("rejects empty query", async () => {
    const { createMemorySearchShimTool } = await import("../src/tools/memory-search-shim.js");
    const tool = createMemorySearchShimTool({});
    const result = await tool.execute("call-1", { query: "" });
    expect(JSON.stringify(result)).toContain("error");
  });
});

// ── X Read Tool ───────────────────────────────────────────────────

describe("createXReadTool", () => {
  it("constructs with correct metadata", async () => {
    // Mock x-client to avoid network
    vi.mock("../src/services/x-client.js", () => ({
      searchX: vi.fn(),
      getTweet: vi.fn(),
      getThread: vi.fn(),
      getUserTimeline: vi.fn(),
      readArticle: vi.fn(),
      getBookmarks: vi.fn(),
    }));

    const { createXReadTool } = await import("../src/tools/x-read.js");
    const tool = createXReadTool({});
    expect(tool.name).toBe("x_read");
    expect(tool.parameters.required).toContain("action");
  });
});

// ── Team Message Tool ─────────────────────────────────────────────

describe("createTeamMessageTool", () => {
  it("constructs with correct metadata", async () => {
    vi.mock("../src/lib/team-feed.js", () => ({
      createFeedMessage: vi.fn(),
      appendFeedMessage: vi.fn(),
    }));
    vi.mock("../src/lib/workspace-sync-service.js", () => ({
      triggerSync: vi.fn(),
    }));
    vi.mock("../src/lib/workspaces-config.js", () => ({
      getActiveWorkspaceConfig: vi.fn().mockReturnValue(null),
    }));

    const { createTeamMessageTool } = await import("../src/tools/team-message.js");
    const tool = createTeamMessageTool({});
    expect(tool.name).toBe("team_message");
    expect(tool.parameters.required).toContain("type");
    expect(tool.parameters.required).toContain("message");
  });
});

// ── Team Memory Tool ──────────────────────────────────────────────

describe("createTeamMemoryWriteTool", () => {
  it("constructs with correct metadata", async () => {
    const { createTeamMemoryWriteTool } = await import("../src/tools/team-memory.js");
    const tool = createTeamMemoryWriteTool({});
    expect(tool.name).toBe("team_memory_write");
    expect(tool.parameters.required).toContain("topic");
    expect(tool.parameters.required).toContain("content");
  });
});
