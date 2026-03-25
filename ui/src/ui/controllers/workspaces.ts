/**
 * Workspaces controller
 * Handles workspace listing/detail/pin/session-pin over gateway RPC.
 */

import type { GatewayBrowserClient } from "../gateway";
import type {
  FolderTreeNode,
  WorkspaceDetail,
  WorkspaceFileEntry,
  WorkspaceSessionEntry,
  WorkspaceSummary,
  WorkspaceTask,
  WorkspaceConnectionSummary,
  FeedEntry,
} from "../views/workspaces";

export type WorkspacesState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  workspaces?: WorkspaceSummary[];
  selectedWorkspace?: WorkspaceDetail | null;
  workspacesSearchQuery?: string;
  workspacesLoading?: boolean;
  workspacesError?: string | null;
};

export type WorkspaceCreateInput = {
  name: string;
  type?: "personal" | "project" | "team";
  path?: string;
};

type GatewayWorkspaceSummary = {
  id: string;
  name: string;
  emoji?: string;
  type: "personal" | "project" | "team";
  path: string;
  artifactCount?: number;
  sessionCount?: number;
  connectionCount?: number;
  feedCount?: number;
  lastUpdated?: string;
  lastScanned?: number;
};

type GatewayWorkspaceFile = {
  path: string;
  name: string;
  type: "markdown" | "html" | "image" | "json" | "text" | "folder";
  size: number;
  modified: string;
  isDirectory?: boolean;
  searchText?: string;
};

type GatewayWorkspaceSession = {
  id: string;
  key: string;
  title: string;
  created: string;
  status: "running" | "complete" | "blocked";
  workspaceSubfolder: string | null;
};

type GatewayFolderTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  fileType?: string;
  size?: number;
  modified?: string;
  children?: GatewayFolderTreeNode[];
};

type GatewayTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
};

type GatewayWorkspaceDetailResult = {
  workspace: GatewayWorkspaceSummary;
  pinned: GatewayWorkspaceFile[];
  pinnedSessions: GatewayWorkspaceSession[];
  outputs: GatewayWorkspaceFile[];
  folderTree?: GatewayFolderTreeNode[];
  sessions: GatewayWorkspaceSession[];
  tasks?: GatewayTask[];
  memory?: GatewayWorkspaceFile[];
};

function toDate(value: string | number | undefined, fallback = Date.now()): Date {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value);
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return new Date(parsed);
    }
  }
  return new Date(fallback);
}

function transformSummary(entry: GatewayWorkspaceSummary): WorkspaceSummary {
  return {
    id: entry.id,
    name: entry.name,
    emoji: entry.emoji || "📁",
    type: entry.type,
    path: entry.path,
    artifactCount: entry.artifactCount ?? 0,
    sessionCount: entry.sessionCount ?? 0,
    connectionCount: entry.connectionCount ?? 0,
    feedCount: entry.feedCount ?? 0,
    lastUpdated: toDate(entry.lastUpdated, entry.lastScanned),
  };
}

function transformFile(entry: GatewayWorkspaceFile): WorkspaceFileEntry {
  return {
    path: entry.path,
    name: entry.name,
    type: entry.type,
    size: entry.size,
    modified: toDate(entry.modified),
    isDirectory: entry.isDirectory,
    searchText: entry.searchText,
  };
}

function transformSession(entry: GatewayWorkspaceSession): WorkspaceSessionEntry {
  return {
    id: entry.id,
    key: entry.key,
    title: entry.title,
    created: toDate(entry.created),
    status: entry.status,
    workspaceSubfolder: entry.workspaceSubfolder,
  };
}

function transformTask(entry: GatewayTask): WorkspaceTask {
  return {
    id: entry.id,
    title: entry.title,
    status: entry.status,
    project: entry.project,
    dueDate: entry.dueDate,
    priority: entry.priority,
    createdAt: entry.createdAt,
    completedAt: entry.completedAt,
  };
}

function transformFolderTree(nodes: GatewayFolderTreeNode[]): FolderTreeNode[] {
  return nodes.map((node) => ({
    name: node.name,
    path: node.path,
    type: node.type,
    fileType: node.fileType as FolderTreeNode["fileType"],
    size: node.size,
    modified: node.modified ? toDate(node.modified) : undefined,
    children: node.children ? transformFolderTree(node.children) : undefined,
  }));
}

function mergeSummaryIntoDetail(
  summary: WorkspaceSummary,
  detail: WorkspaceDetail,
): WorkspaceDetail {
  return {
    ...detail,
    id: summary.id,
    name: summary.name,
    emoji: summary.emoji,
    type: summary.type,
    path: summary.path,
    artifactCount: summary.artifactCount,
    sessionCount: summary.sessionCount,
    lastUpdated: summary.lastUpdated,
  };
}

export async function loadWorkspaces(state: WorkspacesState) {
  if (!state.client || !state.connected) {
    // Don't overwrite existing workspaces if we had them before
    if (!state.workspaces?.length) {
      state.workspaces = [];
      state.workspacesError = "Connect to gateway to see workspaces";
    }
    state.workspacesLoading = false;
    return;
  }

  state.workspacesLoading = true;
  state.workspacesError = null;

  try {
    const result = await state.client.request<{
      workspaces: GatewayWorkspaceSummary[];
    }>("workspaces.list", {});

    state.workspaces = (result.workspaces ?? []).map(transformSummary);

    if (state.selectedWorkspace) {
      const latestSummary = state.workspaces.find(
        (entry) => entry.id === state.selectedWorkspace?.id,
      );
      if (latestSummary) {
        state.selectedWorkspace = mergeSummaryIntoDetail(latestSummary, state.selectedWorkspace);
      }
    }
  } catch (err) {
    console.error("[Workspaces] load failed:", err);
    state.workspacesError = err instanceof Error ? err.message : "Failed to load workspaces";
    state.workspaces = [];
  } finally {
    state.workspacesLoading = false;
  }
}

export async function getWorkspace(
  state: WorkspacesState,
  id: string,
): Promise<WorkspaceDetail | null> {
  if (!state.client || !state.connected) {
    return null;
  }

  try {
    const result = await state.client.request<GatewayWorkspaceDetailResult>("workspaces.get", {
      id,
    });

    if (!result.workspace) {
      return null;
    }

    const detail: WorkspaceDetail = {
      ...transformSummary(result.workspace),
      pinned: (result.pinned ?? []).map(transformFile),
      pinnedSessions: (result.pinnedSessions ?? []).map(transformSession),
      outputs: (result.outputs ?? []).map(transformFile),
      folderTree: result.folderTree ? transformFolderTree(result.folderTree) : undefined,
      sessions: (result.sessions ?? []).map(transformSession),
      tasks: (result.tasks ?? []).map(transformTask),
      memory: (result.memory ?? []).map(transformFile),
    };

    // Load feed and connections in parallel — fail independently
    try {
      const [feedEntries, connections] = await Promise.all([
        loadFeed(state, id).catch(() => []),
        loadConnections(state, id).catch(() => []),
      ]);
      detail.feedEntries = feedEntries;
      detail.connections = connections;
      detail.feedCount = feedEntries.length;
      detail.connectionCount = connections.length;
    } catch {
      // Non-fatal — workspace detail works without feed/connections
    }

    return detail;
  } catch (err) {
    console.error("[Workspaces] get failed:", err);
    return null;
  }
}

export async function readWorkspaceFile(
  state: WorkspacesState,
  filePath: string,
  workspaceId?: string,
): Promise<{ content: string; mime: string } | null> {
  if (!state.client || !state.connected) {
    return null;
  }

  try {
    const result = await state.client.request<{
      content: string | null;
      mime?: string;
      contentType?: string;
      error?: string;
    }>("workspaces.readFile", workspaceId ? { workspaceId, filePath } : { path: filePath });

    if (!result.content) {
      if (result.error) {
        console.warn("[Workspaces] readFile failed:", result.error);
      }
      return null;
    }

    return {
      content: result.content,
      mime: result.contentType ?? result.mime ?? "text/plain",
    };
  } catch (err) {
    console.error("[Workspaces] readFile error:", err);
    return null;
  }
}

export async function scanWorkspaces(state: WorkspacesState) {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    state.workspacesLoading = true;
    state.workspacesError = null;
    await state.client.request("workspaces.scan", {});
    await loadWorkspaces(state);
  } catch (err) {
    state.workspacesError = err instanceof Error ? err.message : "Failed to scan workspaces";
  } finally {
    state.workspacesLoading = false;
  }
}

export async function selectWorkspace(state: WorkspacesState, workspace: WorkspaceSummary | null) {
  if (!workspace) {
    state.selectedWorkspace = null;
    return;
  }

  const detail = await getWorkspace(state, workspace.id);
  state.selectedWorkspace = detail
    ? detail
    : {
        ...workspace,
        pinned: [],
        pinnedSessions: [],
        outputs: [],
        sessions: [],
        tasks: [],
      };
}

export async function toggleWorkspacePin(
  state: WorkspacesState,
  workspaceId: string,
  filePath: string,
  pinned: boolean,
): Promise<boolean> {
  if (!state.client || !state.connected) {
    return false;
  }

  try {
    await state.client.request(pinned ? "workspaces.unpin" : "workspaces.pin", {
      workspaceId,
      filePath,
    });

    if (state.selectedWorkspace?.id === workspaceId) {
      const refreshed = await getWorkspace(state, workspaceId);
      if (refreshed) {
        state.selectedWorkspace = refreshed;
      }
    }

    return true;
  } catch (err) {
    console.error("[Workspaces] pin toggle failed:", err);
    return false;
  }
}

export async function toggleWorkspaceSessionPin(
  state: WorkspacesState,
  workspaceId: string,
  sessionKey: string,
  pinned: boolean,
): Promise<boolean> {
  if (!state.client || !state.connected) {
    return false;
  }

  try {
    await state.client.request(pinned ? "workspaces.unpinSession" : "workspaces.pinSession", {
      workspaceId,
      sessionKey,
    });

    if (state.selectedWorkspace?.id === workspaceId) {
      const refreshed = await getWorkspace(state, workspaceId);
      if (refreshed) {
        state.selectedWorkspace = refreshed;
      }
    }

    return true;
  } catch (err) {
    console.error("[Workspaces] session pin toggle failed:", err);
    return false;
  }
}

export async function createWorkspace(
  state: WorkspacesState,
  input: WorkspaceCreateInput,
): Promise<WorkspaceSummary | null> {
  if (!state.client || !state.connected) {
    return null;
  }

  const name = String(input.name ?? "").trim();
  if (!name) {
    state.workspacesError = "Workspace name is required";
    return null;
  }

  const type = input.type ?? "project";
  const customPath = String(input.path ?? "").trim();

  try {
    const result = await state.client.request<{
      workspace?: GatewayWorkspaceSummary;
    }>("workspaces.create", {
      name,
      type,
      ...(customPath ? { path: customPath } : {}),
    });

    if (!result.workspace) {
      state.workspacesError = "Workspace creation returned no workspace";
      return null;
    }

    const created = transformSummary(result.workspace);
    const current = state.workspaces ?? [];
    const deduped = new Map(current.map((workspace) => [workspace.id, workspace]));
    deduped.set(created.id, created);
    state.workspaces = Array.from(deduped.values()).toSorted(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime(),
    );
    state.workspacesError = null;
    return created;
  } catch (err) {
    console.error("[Workspaces] create failed:", err);
    state.workspacesError = err instanceof Error ? err.message : "Failed to create workspace";
    return null;
  }
}

export async function deleteWorkspace(
  state: WorkspacesState,
  workspaceId: string,
): Promise<boolean> {
  if (!state.client || !state.connected) {
    return false;
  }

  try {
    await state.client.request("workspaces.delete", { id: workspaceId });
    state.workspaces = (state.workspaces ?? []).filter((w) => w.id !== workspaceId);
    if (state.selectedWorkspace?.id === workspaceId) {
      state.selectedWorkspace = null;
    }
    state.workspacesError = null;
    return true;
  } catch (err) {
    console.error("[Workspaces] delete failed:", err);
    state.workspacesError = err instanceof Error ? err.message : "Failed to delete workspace";
    return false;
  }
}

export function setWorkspacesSearchQuery(state: WorkspacesState, query: string) {
  state.workspacesSearchQuery = query;
}

export function clearWorkspaceSelection(state: WorkspacesState) {
  state.selectedWorkspace = null;
}

export async function startTeamSetup(state: WorkspacesState & {
  chatMessage?: string;
  setTab?: (tab: string) => void;
}): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    const res = await state.client.request<{ prompt?: string }>(
      "workspaces.teamSetupPrompt",
      {},
    );
    if (res?.prompt) {
      state.chatMessage = res.prompt;
      state.setTab?.("chat");
    }
  } catch {
    state.chatMessage =
      "I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";
    state.setTab?.("chat");
  }
}

export function toggleWorkspaceFolder(
  expandedFolders: Set<string>,
  folderPath: string,
): Set<string> {
  const next = new Set(expandedFolders);
  if (next.has(folderPath)) {
    next.delete(folderPath);
  } else {
    next.add(folderPath);
  }
  return next;
}

// ── Task integration ─────────────────────────────────────────────────

export async function loadWorkspaceTasks(
  state: WorkspacesState,
  workspaceName: string,
): Promise<WorkspaceTask[]> {
  if (!state.client || !state.connected) {
    return [];
  }
  try {
    const result = await state.client.request<{ tasks: GatewayTask[] }>(
      "tasks.byProject",
      { project: workspaceName },
    );
    return (result.tasks ?? []).map(transformTask);
  } catch (err) {
    console.error("[Workspaces] loadWorkspaceTasks failed:", err);
    return [];
  }
}

export async function loadAllTasks(
  state: WorkspacesState,
): Promise<WorkspaceTask[]> {
  if (!state.client || !state.connected) {
    return [];
  }
  try {
    const result = await state.client.request<{ tasks: GatewayTask[] }>(
      "tasks.list",
      {},
    );
    return (result.tasks ?? []).map(transformTask);
  } catch (err) {
    console.error("[Workspaces] loadAllTasks failed:", err);
    return [];
  }
}

const AGENT_ROLE_NAMES: Record<string, string> = {
  coding: "Builder", research: "Researcher", analysis: "Analyst",
  creative: "Creative", review: "Reviewer", ops: "Ops",
  task: "Agent", url: "Reader", idea: "Explorer",
};

export async function loadAllTasksWithQueueStatus(
  state: WorkspacesState,
): Promise<WorkspaceTask[]> {
  if (!state.client || !state.connected) {
    return [];
  }
  try {
    const [tasksResult, queueResult] = await Promise.all([
      state.client.request<{ tasks: GatewayTask[] }>("tasks.list", {}),
      state.client
        .request<{
          items: Array<{
            id: string;
            type: string;
            status: string;
            sourceTaskId?: string;
          }>;
        }>("queue.list", { limit: 100 })
        .catch(() => ({ items: [] as Array<{ id: string; type: string; status: string; sourceTaskId?: string }> })),
    ]);

    // Build sourceTaskId → queue status map
    const queueByTask = new Map<
      string,
      { status: "processing" | "review" | "needs-review" | "failed"; type: string; roleName: string; queueItemId: string }
    >();
    for (const qi of queueResult.items) {
      if (!qi.sourceTaskId) continue;
      if (
        qi.status === "processing" ||
        qi.status === "review" ||
        qi.status === "needs-review" ||
        qi.status === "failed"
      ) {
        queueByTask.set(qi.sourceTaskId, {
          status: (qi.status === "needs-review" ? "review" : qi.status) as "processing" | "review" | "failed",
          type: qi.type,
          roleName: AGENT_ROLE_NAMES[qi.type] ?? qi.type,
          queueItemId: qi.id,
        });
      }
    }

    return (tasksResult.tasks ?? []).map((t) => ({
      ...transformTask(t),
      queueStatus: queueByTask.get(t.id) ?? null,
    }));
  } catch (err) {
    console.error("[Workspaces] loadAllTasksWithQueueStatus failed:", err);
    return [];
  }
}

export async function toggleTaskComplete(
  state: WorkspacesState,
  taskId: string,
  currentStatus: string,
): Promise<WorkspaceTask | null> {
  if (!state.client || !state.connected) {
    return null;
  }
  const newStatus = currentStatus === "complete" ? "pending" : "complete";
  try {
    const result = await state.client.request<GatewayTask>(
      "tasks.update",
      { id: taskId, status: newStatus },
    );
    return transformTask(result);
  } catch (err) {
    console.error("[Workspaces] toggleTaskComplete failed:", err);
    return null;
  }
}

export async function updateTask(
  state: WorkspacesState,
  taskId: string,
  updates: { title?: string; dueDate?: string | null; status?: string },
): Promise<WorkspaceTask | null> {
  if (!state.client || !state.connected) {
    return null;
  }
  try {
    const result = await state.client.request<GatewayTask>(
      "tasks.update",
      { id: taskId, ...updates },
    );
    return transformTask(result);
  } catch (err) {
    console.error("[Workspaces] updateTask failed:", err);
    return null;
  }
}

export async function startTask(
  state: WorkspacesState,
  taskId: string,
): Promise<{
  sessionId: string;
  created: boolean;
  task?: { title?: string };
  queueOutput?: string | null;
  agentPrompt?: string | null;
} | null> {
  if (!state.client || !state.connected) {
    return null;
  }
  try {
    const result = await state.client.request<{
      sessionId: string;
      created: boolean;
      task?: { title?: string };
      queueOutput?: string | null;
      agentPrompt?: string | null;
    }>("tasks.openSession", { taskId });
    return result;
  } catch (err) {
    console.error("[Workspaces] startTask failed:", err);
    return null;
  }
}

export async function createTask(
  state: WorkspacesState,
  title: string,
  project: string,
): Promise<WorkspaceTask | null> {
  if (!state.client || !state.connected) {
    return null;
  }
  try {
    const result = await state.client.request<GatewayTask>(
      "tasks.create",
      { title, project, source: "chat" },
    );
    return transformTask(result);
  } catch (err) {
    console.error("[Workspaces] createTask failed:", err);
    return null;
  }
}

// ── Folder browsing ──────────────────────────────────────────────────

export type BrowseEntry = {
  name: string;
  path: string;
  type: "folder" | "file";
  fileType?: string;
  size?: number;
  modified?: string;
};

export type BrowseResult = {
  entries: BrowseEntry[];
  breadcrumbs: Array<{ name: string; path: string }>;
  parentPath: string | null;
};

export async function browseWorkspaceFolder(
  state: WorkspacesState,
  workspaceId: string,
  folderPath: string,
): Promise<BrowseResult | null> {
  if (!state.client || !state.connected) return null;
  try {
    return await state.client.request<BrowseResult>(
      "workspaces.browseFolder",
      { workspaceId, folderPath },
    );
  } catch (err) {
    console.error("[Workspaces] browseFolder failed:", err);
    return null;
  }
}

export async function searchWorkspaceFiles(
  state: WorkspacesState,
  workspaceId: string,
  query: string,
  limit = 50,
): Promise<Array<{ path: string; name: string; type: string; excerpt?: string }>> {
  if (!state.client || !state.connected) return [];
  try {
    const result = await state.client.request<{
      results: Array<{ path: string; name: string; type: string; excerpt?: string }>;
    }>("workspaces.search", { workspaceId, query, limit });
    return result.results ?? [];
  } catch (err) {
    console.error("[Workspaces] search failed:", err);
    return [];
  }
}

export async function createWorkspaceFolder(
  state: WorkspacesState,
  workspaceId: string,
  folderPath: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;
  try {
    await state.client.request("workspaces.createFolder", { workspaceId, folderPath });
    return true;
  } catch (err) {
    console.error("[Workspaces] createFolder failed:", err);
    return false;
  }
}

export async function moveWorkspaceFile(
  state: WorkspacesState,
  workspaceId: string,
  sourcePath: string,
  destPath: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;
  try {
    await state.client.request("workspaces.moveFile", { workspaceId, sourcePath, destPath });
    return true;
  } catch (err) {
    console.error("[Workspaces] moveFile failed:", err);
    return false;
  }
}

export async function renameWorkspaceFile(
  state: WorkspacesState,
  workspaceId: string,
  filePath: string,
  newName: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;
  try {
    await state.client.request("workspaces.renameFile", { workspaceId, filePath, newName });
    return true;
  } catch (err) {
    console.error("[Workspaces] renameFile failed:", err);
    return false;
  }
}

// ── Feed Controller ─────────────────────────────────────────────────

export async function loadFeed(
  state: WorkspacesState,
  workspaceId: string,
  limit = 50,
  before?: string,
): Promise<FeedEntry[]> {
  if (!state.client || !state.connected) return [];
  try {
    const result = await state.client.request<{
      entries: FeedEntry[];
    }>("workspace.feed.read", { workspaceId, limit, before });
    return result.entries ?? [];
  } catch (err) {
    console.error("[Workspaces] loadFeed failed:", err);
    return [];
  }
}

export async function postToFeed(
  state: WorkspacesState,
  workspaceId: string,
  text: string,
  type = "update",
): Promise<FeedEntry | null> {
  if (!state.client || !state.connected) return null;
  try {
    const result = await state.client.request<{
      entry: FeedEntry;
    }>("workspace.feed.post", { workspaceId, text, type, author: "user" });
    return result.entry ?? null;
  } catch (err) {
    console.error("[Workspaces] postToFeed failed:", err);
    return null;
  }
}

// ── Connections Controller ──────────────────────────────────────────

export async function loadConnections(
  state: WorkspacesState,
  workspaceId: string,
): Promise<WorkspaceConnectionSummary[]> {
  if (!state.client || !state.connected) return [];
  try {
    const result = await state.client.request<{
      connections: WorkspaceConnectionSummary[];
    }>("workspace.connections.list", { workspaceId });
    return result.connections ?? [];
  } catch (err) {
    console.error("[Workspaces] loadConnections failed:", err);
    return [];
  }
}

export async function testConnection(
  state: WorkspacesState,
  workspaceId: string,
  connectionId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!state.client || !state.connected) return { ok: false, error: "Not connected" };
  try {
    const result = await state.client.request<{ ok: boolean; error?: string }>(
      "workspace.connections.test",
      { workspaceId, connectionId },
    );
    return result;
  } catch (err) {
    console.error("[Workspaces] testConnection failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed" };
  }
}

export async function removeConnection(
  state: WorkspacesState,
  workspaceId: string,
  connectionId: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;
  try {
    await state.client.request("workspace.connections.remove", { workspaceId, connectionId });
    return true;
  } catch (err) {
    console.error("[Workspaces] removeConnection failed:", err);
    return false;
  }
}
