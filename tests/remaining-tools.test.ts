/**
 * Smoke tests for remaining tools:
 *   - memory-search-shim (memory_search)
 *   - honcho-query (honcho_query)
 *   - x-read (x_read)
 *   - composio-tool (composio_execute)
 *   - morning-set (morning_set)
 *   - onboard (godmode_onboard)
 *   - team-memory (team_memory_write)
 *   - team-message (team_message)
 *
 * Tests tool creation metadata and parameter validation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Shared Mocks ─────────────────────────────────────────────────────

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
  withFileLock: vi.fn(async (_p: string, _o: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test-data",
  GODMODE_ROOT: "/tmp/godmode-test",
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── memory_search ────────────────────────────────────────────────────

vi.mock("../src/lib/memory.js", () => ({
  queryPeer: vi.fn(async () => "The user likes GodMode"),
  isMemoryReady: vi.fn(() => false),
  getContext: vi.fn(async () => null),
  getMemoryStatus: vi.fn(() => "offline"),
}));

vi.mock("../src/methods/second-brain.js", () => ({
  runQmdSearch: vi.fn(async () => []),
}));

vi.mock("../src/lib/session-search.js", () => ({
  isSessionSearchReady: vi.fn(() => false),
  searchMessages: vi.fn(() => []),
}));

vi.mock("../src/lib/health-ledger.js", () => ({
  health: { signal: vi.fn() },
  turnErrors: { capture: vi.fn(), drain: vi.fn(() => []), peek: vi.fn(() => []), count: 0 },
  repairLog: { record: vi.fn(), recent: vi.fn(() => []), forSubsystem: vi.fn(() => []) },
}));

describe("memory_search tool", () => {
  let createMemorySearchShimTool: typeof import("../src/tools/memory-search-shim.js").createMemorySearchShimTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/memory-search-shim.js");
    createMemorySearchShimTool = mod.createMemorySearchShimTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createMemorySearchShimTool({});
    expect(tool.name).toBe("memory_search");
    expect(tool.parameters.required).toContain("query");
  });

  it("rejects empty query", async () => {
    const tool = createMemorySearchShimTool({});
    const result = await tool.execute("call-1", { query: "" });
    const data = parseResult(result);
    expect(data.error).toContain("query is required");
  });

  it("returns results (empty when backends offline)", async () => {
    const tool = createMemorySearchShimTool({});
    const result = await tool.execute("call-1", { query: "GodMode" });
    const data = parseResult(result);
    expect(data.total).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
  });
});

// ── honcho_query ─────────────────────────────────────────────────────

describe("honcho_query tool", () => {
  let createHonchoQueryTool: typeof import("../src/tools/honcho-query.js").createHonchoQueryTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/honcho-query.js");
    createHonchoQueryTool = mod.createHonchoQueryTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createHonchoQueryTool({});
    expect(tool.name).toBe("honcho_query");
    expect(tool.parameters.required).toContain("question");
  });

  it("rejects empty question", async () => {
    const tool = createHonchoQueryTool({});
    const result = await tool.execute("call-1", { question: "" });
    const data = parseResult(result);
    expect(data.error).toContain("question is required");
  });

  it("returns error when memory not ready", async () => {
    const tool = createHonchoQueryTool({});
    const result = await tool.execute("call-1", { question: "What are the user's priorities?" });
    const data = parseResult(result);
    expect(data.error).toContain("Memory is not configured");
  });
});

// ── x_read ───────────────────────────────────────────────────────────

vi.mock("../src/services/x-client.js", () => ({
  searchX: vi.fn(async () => ({ tweets: [] })),
  getTweet: vi.fn(async () => ({ content: "test tweet" })),
  getThread: vi.fn(async () => ({ messages: [] })),
  getUserTimeline: vi.fn(async () => ({ tweets: [] })),
  readArticle: vi.fn(async () => ({ content: "article" })),
  getBookmarks: vi.fn(async () => ({ bookmarks: [] })),
}));

describe("x_read tool", () => {
  let createXReadTool: typeof import("../src/tools/x-read.js").createXReadTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/x-read.js");
    createXReadTool = mod.createXReadTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createXReadTool({});
    expect(tool.name).toBe("x_read");
    expect(tool.parameters.required).toContain("action");
  });

  it("search requires query", async () => {
    const tool = createXReadTool({});
    const result = await tool.execute("call-1", { action: "search", query: "" });
    const data = parseResult(result);
    expect(data.error).toContain("query is required");
  });

  it("tweet requires query", async () => {
    const tool = createXReadTool({});
    const result = await tool.execute("call-1", { action: "tweet", query: "" });
    const data = parseResult(result);
    expect(data.error).toContain("tweet URL or ID is required");
  });

  it("rejects unknown action", async () => {
    const tool = createXReadTool({});
    const result = await tool.execute("call-1", { action: "explode" });
    const data = parseResult(result);
    expect(data.error).toContain("Unknown action");
  });

  it("search succeeds with query", async () => {
    const tool = createXReadTool({});
    const result = await tool.execute("call-1", { action: "search", query: "AI agents" });
    const data = parseResult(result);
    expect(data.tweets).toBeDefined();
  });
});

// ── composio_execute ─────────────────────────────────────────────────

vi.mock("../src/services/composio-client.js", () => ({
  isConfigured: vi.fn(() => false),
  executeAction: vi.fn(async () => ({ success: true })),
}));

describe("composio_execute tool", () => {
  let createComposioExecuteTool: typeof import("../src/tools/composio-tool.js").createComposioExecuteTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/composio-tool.js");
    createComposioExecuteTool = mod.createComposioExecuteTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createComposioExecuteTool();
    expect(tool.name).toBe("composio_execute");
    expect(tool.parameters.required).toContain("action");
  });

  it("returns error when not configured", async () => {
    const tool = createComposioExecuteTool();
    const result = await tool.execute("call-1", { action: "GITHUB_CREATE_ISSUE" });
    const data = parseResult(result);
    expect(data.error).toContain("not configured");
  });

  it("rejects empty action", async () => {
    const { isConfigured } = await import("../src/services/composio-client.js");
    (isConfigured as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const tool = createComposioExecuteTool();
    const result = await tool.execute("call-1", { action: "" });
    const data = parseResult(result);
    expect(data.error).toContain("action parameter is required");
  });
});

// ── morning_set ──────────────────────────────────────────────────────

vi.mock("../src/methods/daily-brief.js", () => ({
  rewriteWinTheDay: vi.fn(async () => ({ rewritten: true })),
  scopeTasksToWinTheDay: vi.fn(async () => ({ deferred: 2 })),
  getTodayDate: vi.fn(() => "2026-03-23"),
  syncTasksFromBrief: vi.fn(async () => ({ added: 1, updated: 0, total: 3 })),
}));

vi.mock("../src/methods/tasks.js", () => ({
  ensureTaskSessions: vi.fn(async () => []),
  readTasks: vi.fn(async () => ({ tasks: [] })),
  updateTasks: vi.fn(async () => undefined),
}));

describe("morning_set tool", () => {
  let createMorningSetTool: typeof import("../src/tools/morning-set.js").createMorningSetTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/morning-set.js");
    createMorningSetTool = mod.createMorningSetTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createMorningSetTool({});
    expect(tool.name).toBe("morning_set");
    expect(tool.parameters.required).toContain("items");
  });

  it("rejects empty items", async () => {
    const tool = createMorningSetTool({});
    const result = await tool.execute("call-1", { items: [] });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("at least one");
  });

  it("rejects too many items", async () => {
    const tool = createMorningSetTool({});
    const items = Array.from({ length: 8 }, (_, i) => ({ title: `Item ${i}` }));
    const result = await tool.execute("call-1", { items });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("7 or fewer");
  });

  it("finalizes morning set with valid items", async () => {
    const tool = createMorningSetTool({});
    const result = await tool.execute("call-1", {
      items: [
        { title: "Ship v2.0", context: "Deadline Friday" },
        { title: "Review PRs" },
      ],
    });
    const data = parseResult(result);
    expect(data.finalized).toBe(true);
    expect(data.focusTitle).toBe("Ship v2.0");
    expect(data.itemCount).toBe(2);
  });
});

// ── godmode_onboard ──────────────────────────────────────────────────

vi.mock("../src/services/onboarding.js", () => ({
  generateWorkspaceFiles: vi.fn(async () => [
    { path: "~/godmode/memory/USER.md", created: true, skipped: false },
    { path: "~/godmode/memory/SOUL.md", created: true, skipped: false },
  ]),
  patchOCConfig: vi.fn(async () => ({ patched: true })),
  checkOnboardingStatus: vi.fn(async () => ({
    initialized: true,
    filesPresent: 5,
    filesMissing: 0,
  })),
  sanitizeAnswers: vi.fn((answers: Record<string, unknown>) => ({
    name: answers.name ?? "User",
    timezone: answers.timezone ?? "America/Chicago",
    focus: answers.focus ?? "",
    projects: answers.projects ?? [],
    commStyle: answers.commStyle ?? "Direct",
    hardRules: answers.hardRules ?? [],
    keyPeople: answers.keyPeople ?? [],
    defaultModel: answers.defaultModel ?? "sonnet",
  })),
}));

describe("godmode_onboard tool", () => {
  let createOnboardTool: typeof import("../src/tools/onboard.js").createOnboardTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/onboard.js");
    createOnboardTool = mod.createOnboardTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createOnboardTool({});
    expect(tool.name).toBe("godmode_onboard");
    expect(tool.parameters.required).toContain("name");
  });

  it("status check mode works", async () => {
    const tool = createOnboardTool({});
    const result = await tool.execute("call-1", { name: "TestUser", statusOnly: true });
    const data = parseResult(result);
    expect(data.mode).toBe("status");
    expect(data.initialized).toBe(true);
  });

  it("generate mode creates workspace files", async () => {
    const tool = createOnboardTool({});
    const result = await tool.execute("call-1", { name: "TestUser", timezone: "America/Chicago" });
    const data = parseResult(result);
    expect(data.mode).toBe("generate");
    expect(data.success).toBe(true);
    expect(data.filesCreated).toBe(2);
  });
});

// ── team_memory_write ────────────────────────────────────────────────

vi.mock("../src/lib/workspace-sync-service.js", () => ({
  getWorkspaceSyncService: vi.fn(() => ({
    pushNow: vi.fn(async () => undefined),
  })),
}));

vi.mock("../src/lib/workspace-session-store.js", () => ({
  loadConfig: vi.fn(async () => ({})),
  loadCombinedSessionStoreForGateway: vi.fn(async () => ({
    store: {},
  })),
  isCronSessionKey: vi.fn(() => false),
  updateSessionStore: vi.fn(async () => undefined),
  resolveAgentStorePath: vi.fn(() => "/tmp/agent-store.json"),
}));

vi.mock("../src/lib/workspaces-config.js", () => ({
  readWorkspaceConfig: vi.fn(async () => ({ workspaces: [] })),
  findWorkspaceById: vi.fn(() => null),
}));

describe("team_memory_write tool", () => {
  let createTeamMemoryWriteTool: typeof import("../src/tools/team-memory.js").createTeamMemoryWriteTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/team-memory.js");
    createTeamMemoryWriteTool = mod.createTeamMemoryWriteTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTeamMemoryWriteTool({});
    expect(tool.name).toBe("team_memory_write");
    expect(tool.parameters.required).toContain("topic");
    expect(tool.parameters.required).toContain("content");
  });

  it("rejects empty topic or content", async () => {
    const tool = createTeamMemoryWriteTool({});
    const result = await tool.execute("call-1", { topic: "", content: "test" });
    const data = parseResult(result);
    expect(data.error).toContain("topic and content are required");
  });

  it("returns error without session", async () => {
    const tool = createTeamMemoryWriteTool({});
    const result = await tool.execute("call-1", { topic: "test", content: "hello" });
    const data = parseResult(result);
    expect(data.error).toContain("No active session");
  });
});

// ── team_message ─────────────────────────────────────────────────────

vi.mock("../src/lib/team-feed.js", () => ({
  FEED_MESSAGE_TYPES: ["handoff", "question", "alert", "blocked", "fyi"],
  appendFeedMessage: vi.fn(async () => undefined),
  createFeedMessage: vi.fn((opts: Record<string, unknown>) => ({
    id: `msg-${Date.now()}`,
    ...opts,
  })),
  resolveFeedPath: vi.fn(() => "/tmp/team-feed.jsonl"),
}));

describe("team_message tool", () => {
  let createTeamMessageTool: typeof import("../src/tools/team-message.js").createTeamMessageTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/tools/team-message.js");
    createTeamMessageTool = mod.createTeamMessageTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTeamMessageTool({});
    expect(tool.name).toBe("team_message");
    expect(tool.parameters.required).toContain("type");
    expect(tool.parameters.required).toContain("message");
  });

  it("rejects empty message", async () => {
    const tool = createTeamMessageTool({});
    const result = await tool.execute("call-1", { type: "fyi", message: "" });
    const data = parseResult(result);
    expect(data.error).toContain("message is required");
  });

  it("rejects invalid type", async () => {
    const tool = createTeamMessageTool({});
    const result = await tool.execute("call-1", { type: "invalid", message: "hello" });
    const data = parseResult(result);
    expect(data.error).toContain("Invalid type");
  });

  it("returns error without session", async () => {
    const tool = createTeamMessageTool({});
    const result = await tool.execute("call-1", { type: "fyi", message: "hello" });
    const data = parseResult(result);
    expect(data.error).toContain("No active session");
  });
});
