import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceDetail, WorkspaceSummary } from "../views/workspaces";
import {
  clearWorkspaceSelection,
  createWorkspace,
  getWorkspace,
  loadWorkspaces,
  readWorkspaceFile,
  selectWorkspace,
  setWorkspacesSearchQuery,
  toggleWorkspacePin,
  toggleWorkspaceSessionPin,
  type WorkspacesState,
} from "./workspaces";

function mockClient(handlers: Record<string, (params?: unknown) => Promise<unknown>>) {
  return {
    request: vi.fn(async (method: string, params?: unknown) => {
      const handler = handlers[method];
      if (!handler) {
        throw new Error(`Unexpected RPC call: ${method}`);
      }
      return handler(params);
    }),
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as import("../gateway").GatewayBrowserClient;
}

function makeState(
  client: ReturnType<typeof mockClient> | null = null,
  connected = true,
): WorkspacesState {
  return {
    client,
    connected,
    workspaces: [],
    selectedWorkspace: null,
    workspacesSearchQuery: "",
    workspacesLoading: false,
    workspacesError: null,
  };
}

function makeSummary(id = "godmode"): WorkspaceSummary {
  return {
    id,
    name: "GodMode",
    emoji: "⚡",
    type: "project",
    path: "~/godmode/memory/projects/godmode",
    artifactCount: 12,
    sessionCount: 3,
    lastUpdated: new Date("2026-02-19T10:00:00.000Z"),
  };
}

function makeDetail(id = "godmode"): WorkspaceDetail {
  return {
    ...makeSummary(id),
    pinned: [],
    pinnedSessions: [],
    outputs: [],
    sessions: [],
    tasks: [],
  };
}

describe("workspaces controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loadWorkspaces shows connection error when disconnected", async () => {
    const state = makeState(null, false);
    await loadWorkspaces(state);
    expect(state.workspaces).toEqual([]);
    expect(state.workspacesError).toBe("Connect to gateway to see workspaces");
  });

  it("loadWorkspaces transforms summary response", async () => {
    const client = mockClient({
      "workspaces.list": async () => ({
        workspaces: [
          {
            id: "godmode",
            name: "GodMode",
            emoji: "⚡",
            type: "project",
            path: "~/godmode/memory/projects/godmode",
            artifactCount: 47,
            sessionCount: 8,
            lastUpdated: "2026-02-19T14:00:00.000Z",
          },
        ],
      }),
    });
    const state = makeState(client, true);

    await loadWorkspaces(state);

    expect(state.workspacesError).toBeNull();
    expect(state.workspacesLoading).toBe(false);
    expect(state.workspaces).toHaveLength(1);
    expect(state.workspaces?.[0]).toMatchObject({
      id: "godmode",
      name: "GodMode",
      artifactCount: 47,
      sessionCount: 8,
    });
  });

  it("getWorkspace transforms detail response", async () => {
    const client = mockClient({
      "workspaces.get": async () => ({
        workspace: {
          id: "godmode",
          name: "GodMode",
          emoji: "⚡",
          type: "project",
          path: "~/godmode/memory/projects/godmode",
          artifactCount: 9,
          sessionCount: 2,
          lastUpdated: "2026-02-19T12:00:00.000Z",
        },
        pinned: [
          {
            path: "outputs/proposal.md",
            name: "proposal.md",
            type: "markdown",
            size: 100,
            modified: "2026-02-19T12:00:00.000Z",
          },
        ],
        pinnedSessions: [],
        outputs: [],
        sessions: [
          {
            id: "sess-1",
            key: "agent:main:main",
            title: "Build workspace UI",
            created: "2026-02-19T11:00:00.000Z",
            status: "complete",
            workspaceSubfolder: null,
          },
        ],
      }),
    });

    const state = makeState(client, true);
    const detail = await getWorkspace(state, "godmode");

    expect(detail).not.toBeNull();
    expect(detail?.pinned).toHaveLength(1);
    expect(detail?.sessions).toHaveLength(1);
    expect(detail?.pinnedSessions).toHaveLength(0);
  });

  it("readWorkspaceFile supports workspaceId + filePath", async () => {
    const client = mockClient({
      "workspaces.readFile": async () => ({
        content: "# Hello",
        contentType: "text/markdown",
      }),
    });
    const state = makeState(client, true);

    const file = await readWorkspaceFile(state, "outputs/proposal.md", "godmode");

    expect(file).toEqual({
      content: "# Hello",
      mime: "text/markdown",
    });
    expect(client.request).toHaveBeenCalledWith("workspaces.readFile", {
      workspaceId: "godmode",
      filePath: "outputs/proposal.md",
    });
  });

  it("selectWorkspace loads detail", async () => {
    const summary = makeSummary("godmode");
    const client = mockClient({
      "workspaces.get": async () => ({
        workspace: {
          id: "godmode",
          name: "GodMode",
          emoji: "⚡",
          type: "project",
          path: "~/godmode/memory/projects/godmode",
          artifactCount: 9,
          sessionCount: 2,
          lastUpdated: "2026-02-19T12:00:00.000Z",
        },
        pinned: [],
        pinnedSessions: [],
        outputs: [],
        sessions: [],
      }),
    });
    const state = makeState(client, true);

    await selectWorkspace(state, summary);

    expect(state.selectedWorkspace?.id).toBe("godmode");
    expect(client.request).toHaveBeenCalledWith("workspaces.get", { id: "godmode" });
  });

  it("toggleWorkspacePin invokes pin/unpin and refresh", async () => {
    const client = mockClient({
      "workspaces.pin": async () => ({ ok: true }),
      "workspaces.get": async () => ({
        workspace: {
          id: "godmode",
          name: "GodMode",
          emoji: "⚡",
          type: "project",
          path: "~/godmode/memory/projects/godmode",
          artifactCount: 1,
          sessionCount: 1,
          lastUpdated: "2026-02-19T12:00:00.000Z",
        },
        pinned: [
          {
            path: "outputs/proposal.md",
            name: "proposal.md",
            type: "markdown",
            size: 100,
            modified: "2026-02-19T12:00:00.000Z",
          },
        ],
        pinnedSessions: [],
        outputs: [],
        sessions: [],
      }),
    });

    const state = makeState(client, true);
    state.selectedWorkspace = makeDetail("godmode");

    const ok = await toggleWorkspacePin(state, "godmode", "outputs/proposal.md", false);

    expect(ok).toBe(true);
    expect(client.request).toHaveBeenCalledWith("workspaces.pin", {
      workspaceId: "godmode",
      filePath: "outputs/proposal.md",
    });
    expect(state.selectedWorkspace?.pinned).toHaveLength(1);
  });

  it("toggleWorkspaceSessionPin invokes pinSession/unpinSession and refresh", async () => {
    const client = mockClient({
      "workspaces.pinSession": async () => ({ ok: true }),
      "workspaces.get": async () => ({
        workspace: {
          id: "godmode",
          name: "GodMode",
          emoji: "⚡",
          type: "project",
          path: "~/godmode/memory/projects/godmode",
          artifactCount: 0,
          sessionCount: 1,
          lastUpdated: "2026-02-19T12:00:00.000Z",
        },
        pinned: [],
        pinnedSessions: [
          {
            id: "sess-1",
            key: "agent:main:main",
            title: "Build workspace UI",
            created: "2026-02-19T11:00:00.000Z",
            status: "complete",
            workspaceSubfolder: null,
          },
        ],
        outputs: [],
        sessions: [
          {
            id: "sess-1",
            key: "agent:main:main",
            title: "Build workspace UI",
            created: "2026-02-19T11:00:00.000Z",
            status: "complete",
            workspaceSubfolder: null,
          },
        ],
      }),
    });

    const state = makeState(client, true);
    state.selectedWorkspace = makeDetail("godmode");

    const ok = await toggleWorkspaceSessionPin(state, "godmode", "agent:main:main", false);

    expect(ok).toBe(true);
    expect(client.request).toHaveBeenCalledWith("workspaces.pinSession", {
      workspaceId: "godmode",
      sessionKey: "agent:main:main",
    });
    expect(state.selectedWorkspace?.pinnedSessions).toHaveLength(1);
  });

  it("createWorkspace calls RPC and stores the created workspace", async () => {
    const client = mockClient({
      "workspaces.create": async () => ({
        workspace: {
          id: "patient-autopilot",
          name: "Patient Autopilot",
          emoji: "🏥",
          type: "team",
          path: "~/godmode/clients/patient-autopilot",
          artifactCount: 0,
          sessionCount: 0,
          lastUpdated: "2026-02-20T01:00:00.000Z",
        },
      }),
    });
    const state = makeState(client, true);

    const created = await createWorkspace(state, {
      name: "Patient Autopilot",
      type: "team",
      path: "~/godmode/clients/patient-autopilot",
    });

    expect(created?.id).toBe("patient-autopilot");
    expect(client.request).toHaveBeenCalledWith("workspaces.create", {
      name: "Patient Autopilot",
      type: "team",
      path: "~/godmode/clients/patient-autopilot",
    });
    expect(state.workspaces?.some((workspace) => workspace.id === "patient-autopilot")).toBe(true);
  });

  it("createWorkspace returns null when name is blank", async () => {
    const client = mockClient({});
    const state = makeState(client, true);

    const created = await createWorkspace(state, { name: "   " });

    expect(created).toBeNull();
    expect(state.workspacesError).toBe("Workspace name is required");
  });

  it("setWorkspacesSearchQuery + clearWorkspaceSelection update state", () => {
    const state = makeState(null, true);
    setWorkspacesSearchQuery(state, "patient");
    expect(state.workspacesSearchQuery).toBe("patient");

    state.selectedWorkspace = makeDetail("godmode");
    clearWorkspaceSelection(state);
    expect(state.selectedWorkspace).toBeNull();
  });
});
