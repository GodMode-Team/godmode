/**
 * Smoke tests for tasks-tool.ts (tasks_create, tasks_list, tasks_update).
 *
 * Uses an in-memory tasks store via mocked filesystem.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

let tasksStore: { tasks: Array<Record<string, unknown>>; archived: never[]; updatedAt: string | null } = {
  tasks: [],
  archived: [],
  updatedAt: null,
};

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async () => JSON.stringify(tasksStore)),
  writeFile: vi.fn(async (_p: string, content: string) => {
    tasksStore = JSON.parse(content);
  }),
  mkdir: vi.fn(async () => undefined),
}));

vi.mock("../src/lib/secure-fs.js", () => ({
  secureMkdir: vi.fn(async () => undefined),
  secureWriteFile: vi.fn(async (_p: string, content: string) => {
    tasksStore = JSON.parse(content);
  }),
}));

vi.mock("../src/lib/sdk-helpers.js", () => ({
  jsonResult: (payload: unknown) => ({
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  }),
  withFileLock: vi.fn(async (_path: string, _opts: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test-data",
}));

// ── Helpers ──────────────────────────────────────────────────────────

function parseResult(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("tasks_create tool", () => {
  let createTasksCreateTool: typeof import("../src/tools/tasks-tool.js").createTasksCreateTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    tasksStore = { tasks: [], archived: [], updatedAt: null };
    const mod = await import("../src/tools/tasks-tool.js");
    createTasksCreateTool = mod.createTasksCreateTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTasksCreateTool();
    expect(tool.name).toBe("tasks_create");
    expect(tool.label).toBe("Tasks");
    expect(tool.parameters.required).toContain("title");
  });

  it("rejects empty title", async () => {
    const tool = createTasksCreateTool();
    const result = await tool.execute("call-1", { title: "" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("title is required");
  });

  it("creates a task with defaults", async () => {
    const tool = createTasksCreateTool();
    const result = await tool.execute("call-1", { title: "Ship feature" });
    const data = parseResult(result);
    expect(data.created).toBe(true);
    expect(data.title).toBe("Ship feature");
    expect(data.id).toBeTruthy();
  });

  it("creates a task with all fields", async () => {
    const tool = createTasksCreateTool();
    const result = await tool.execute("call-1", {
      title: "Deploy v2",
      dueDate: "2026-03-25",
      priority: "high",
      project: "GodMode",
    });
    const data = parseResult(result);
    expect(data.created).toBe(true);
    expect(data.message).toContain("Deploy v2");
    expect(data.message).toContain("2026-03-25");
    expect(data.message).toContain("GodMode");
  });
});

describe("tasks_list tool", () => {
  let createTasksListTool: typeof import("../src/tools/tasks-tool.js").createTasksListTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    tasksStore = {
      tasks: [
        {
          id: "t-1",
          title: "Ship feature",
          status: "pending",
          project: "GodMode",
          dueDate: "2026-03-20",
          priority: "high",
          createdAt: "2026-03-19T00:00:00Z",
          completedAt: null,
          source: "chat",
          sessionId: null,
        },
        {
          id: "t-2",
          title: "Write docs",
          status: "pending",
          project: null,
          dueDate: null,
          priority: "medium",
          createdAt: "2026-03-19T00:00:00Z",
          completedAt: null,
          source: "chat",
          sessionId: null,
        },
        {
          id: "t-3",
          title: "Done task",
          status: "complete",
          project: null,
          dueDate: null,
          priority: "low",
          createdAt: "2026-03-19T00:00:00Z",
          completedAt: "2026-03-19T12:00:00Z",
          source: "chat",
          sessionId: null,
        },
      ],
      archived: [],
      updatedAt: null,
    };
    const mod = await import("../src/tools/tasks-tool.js");
    createTasksListTool = mod.createTasksListTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTasksListTool();
    expect(tool.name).toBe("tasks_list");
  });

  it("lists only pending tasks by default", async () => {
    const tool = createTasksListTool();
    const result = await tool.execute("call-1", {});
    const data = parseResult(result);
    expect(data.count).toBe(2); // excludes completed
  });

  it("filters by high priority", async () => {
    const tool = createTasksListTool();
    const result = await tool.execute("call-1", { filter: "high" });
    const data = parseResult(result);
    expect(data.count).toBe(1);
    expect(data.tasks[0].title).toBe("Ship feature");
  });

  it("filters by project", async () => {
    const tool = createTasksListTool();
    const result = await tool.execute("call-1", { project: "godmode" });
    const data = parseResult(result);
    expect(data.count).toBe(1);
    expect(data.tasks[0].project).toBe("GodMode");
  });
});

describe("tasks_update tool", () => {
  let createTasksUpdateTool: typeof import("../src/tools/tasks-tool.js").createTasksUpdateTool;

  beforeEach(async () => {
    vi.clearAllMocks();
    tasksStore = {
      tasks: [
        {
          id: "t-1",
          title: "Ship feature",
          status: "pending",
          project: null,
          dueDate: null,
          priority: "medium",
          createdAt: "2026-03-19T00:00:00Z",
          completedAt: null,
          source: "chat",
          sessionId: null,
        },
      ],
      archived: [],
      updatedAt: null,
    };
    const mod = await import("../src/tools/tasks-tool.js");
    createTasksUpdateTool = mod.createTasksUpdateTool;
  });

  it("creates a tool with correct metadata", () => {
    const tool = createTasksUpdateTool();
    expect(tool.name).toBe("tasks_update");
    expect(tool.parameters.required).toContain("id");
  });

  it("returns error for non-existent task", async () => {
    const tool = createTasksUpdateTool();
    const result = await tool.execute("call-1", { id: "nonexistent" });
    const data = parseResult(result);
    expect(data.error).toBe(true);
    expect(data.message).toContain("not found");
  });

  it("marks a task complete", async () => {
    const tool = createTasksUpdateTool();
    const result = await tool.execute("call-1", { id: "t-1", status: "complete" });
    const data = parseResult(result);
    expect(data.updated).toBe(true);
    expect(data.message).toContain("Completed");
  });

  it("updates due date and priority", async () => {
    const tool = createTasksUpdateTool();
    const result = await tool.execute("call-1", {
      id: "t-1",
      dueDate: "2026-03-30",
      priority: "high",
    });
    const data = parseResult(result);
    expect(data.updated).toBe(true);
    expect(data.task.dueDate).toBe("2026-03-30");
    expect(data.task.priority).toBe("high");
  });
});
