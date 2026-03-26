/**
 * <gm-work> — Extracted Work/Workspaces tab component.
 *
 * Owns all workspace + work @state properties (moved out of the God Component).
 * Consumes AppContext for shared state (connected, gateway, sidebar, toast, nav).
 * Delegates rendering to ../views/workspaces.js and data loading to
 * ../controllers/workspaces.js + ../controllers/work.js.
 * Cross-tab actions (session navigation, chat prompts) go through the event bus.
 */

import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import {
  renderWorkspaces,
  type WorkspaceSummary,
  type WorkspaceDetail,
  type WorkspaceFileEntry,
  type WorkspaceSessionEntry,
  type WorkspaceTask,
  type TaskFilter,
  type TaskSort,
} from "../views/workspaces.js";
import {
  loadWorkspaces,
  selectWorkspace,
  createWorkspace,
  deleteWorkspace,
  toggleWorkspacePin,
  toggleWorkspaceSessionPin,
  toggleWorkspaceFolder,
  loadAllTasksWithQueueStatus,
  toggleTaskComplete,
  createTask,
  updateTask,
  startTask,
  getWorkspace,
  readWorkspaceFile,
  browseWorkspaceFolder,
  searchWorkspaceFiles,
  createWorkspaceFolder,
  postToFeed,
  testConnection,
  removeConnection,
  loadConnections,
  backfillWorkspaceExtras,
  type WorkspacesState,
  type BrowseEntry,
} from "../controllers/workspaces.js";
import type { Tab } from "../navigation.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-work")
export class GmWork extends LitElement {
  // -- Shared context (provided by root app) --------------------------------

  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // -- Owned state: workspaces ----------------------------------------------

  @state() workspaces?: WorkspaceSummary[];
  @state() selectedWorkspace: WorkspaceDetail | null = null;
  @state() workspacesSearchQuery = "";
  @state() workspaceItemSearchQuery = "";
  @state() workspacesLoading = false;
  @state() workspacesCreateLoading = false;
  @state() workspacesError: string | null = null;
  @state() workspaceExpandedFolders: Set<string> = new Set();

  // -- Owned state: tasks ---------------------------------------------------

  @state() allTasks?: WorkspaceTask[];
  @state() taskFilter: TaskFilter = "outstanding";
  @state() taskSort: TaskSort = "due";
  @state() taskSearch = "";
  @state() showCompletedTasks = false;
  @state() editingTaskId: string | null = null;

  // -- Owned state: workspace file browser ----------------------------------

  @state() workspaceBrowsePath: string | null = null;
  @state() workspaceBrowseEntries: BrowseEntry[] | null = null;
  @state() workspaceBreadcrumbs: Array<{ name: string; path: string }> | null =
    null;
  @state() workspaceBrowseSearchQuery = "";
  @state() workspaceBrowseSearchResults: Array<{
    path: string;
    name: string;
    type: string;
    excerpt?: string;
  }> | null = null;

  // -- Event-bus subscription cleanup ---------------------------------------

  private _unsubs: Array<() => void> = [];
  private _lastConnected = false;
  private _refreshInFlight = false;

  // -- Light DOM (no shadow root) so existing CSS classes work ---------------

  override createRenderRoot() {
    return this;
  }

  // -- WorkspacesState interface for controller functions --------------------

  get client() {
    return this.ctx.gateway;
  }

  get connected() {
    return this.ctx.connected;
  }

  // -- Lifecycle ------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();

    // Listen for external refresh requests
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "workspaces" || payload.target === "work") {
          void this._refresh();
        }
      }),
    );

    // Auto-load initial data (may fail if context hasn't synced yet — updated() retries)
    void this._refresh();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  /** Re-fetch when gateway connection arrives after initial mount. */
  protected override updated(changed: Map<PropertyKey, unknown>) {
    super.updated?.(changed);
    const nowConnected = this.ctx?.connected ?? false;
    if (nowConnected && !this._lastConnected) {
      // Context just became connected — retry load if we have no data or an error
      if (!this.workspaces?.length || this.workspacesError) {
        void this._refresh();
      }
    }
    this._lastConnected = nowConnected;
  }

  // -- Render ---------------------------------------------------------------

  override render() {
    return renderWorkspaces({
      connected: this.ctx.connected,
      workspaces: this.workspaces ?? [],
      selectedWorkspace: this.selectedWorkspace ?? null,
      searchQuery: this.workspacesSearchQuery,
      itemSearchQuery: this.workspaceItemSearchQuery,
      expandedFolders: this.workspaceExpandedFolders,
      loading: this.workspacesLoading,
      createLoading: this.workspacesCreateLoading,
      error: this.workspacesError,
      // Tasks
      allTasks: this.allTasks ?? [],
      taskFilter: this.taskFilter,
      taskSort: this.taskSort,
      taskSearch: this.taskSearch,
      showCompletedTasks: this.showCompletedTasks,
      editingTaskId: this.editingTaskId,
      workspaceNames: (this.workspaces ?? []).map((w) => w.name),
      // File browser
      browsePath: this.workspaceBrowsePath,
      browseEntries: this.workspaceBrowseEntries,
      breadcrumbs: this.workspaceBreadcrumbs,
      browseSearchQuery: this.workspaceBrowseSearchQuery,
      browseSearchResults: this.workspaceBrowseSearchResults,
      // Callbacks
      onSearch: (query) => {
        this.workspacesSearchQuery = query;
      },
      onItemSearch: (query) => {
        this.workspaceItemSearchQuery = query;
      },
      onSelectWorkspace: (workspace) => this._onSelectWorkspace(workspace),
      onBack: () => this._onBack(),
      onItemClick: (item) => this._onItemClick(item),
      onSessionClick: (session) => this._onSessionClick(session),
      onPinToggle: (workspaceId, filePath, pinned) =>
        this._onPinToggle(workspaceId, filePath, pinned),
      onPinSessionToggle: (workspaceId, sessionKey, pinned) =>
        this._onPinSessionToggle(workspaceId, sessionKey, pinned),
      onCreateWorkspace: (input) => this._onCreateWorkspace(input),
      onDeleteWorkspace: (workspace) => this._onDeleteWorkspace(workspace),
      onToggleFolder: (folderPath) => this._onToggleFolder(folderPath),
      onTeamSetup: () => this._onTeamSetup(),
      onToggleTaskComplete: (taskId, currentStatus) =>
        this._onToggleTaskComplete(taskId, currentStatus),
      onCreateTask: (title, project) => this._onCreateTask(title, project),
      onSetTaskFilter: (filter) => {
        this.taskFilter = filter;
      },
      onSetTaskSort: (sort) => {
        this.taskSort = sort;
      },
      onSetTaskSearch: (query) => {
        this.taskSearch = query;
      },
      onToggleCompletedTasks: () => {
        this.showCompletedTasks = !this.showCompletedTasks;
      },
      onStartTask: (taskId) => this._onStartTask(taskId),
      onViewTaskOutput: (taskId) => this._onViewTaskOutput(taskId),
      onEditTask: (taskId) => {
        this.editingTaskId = taskId;
      },
      onUpdateTask: (taskId, updates) => this._onUpdateTask(taskId, updates),
      onBrowseFolder: (path) => this._onBrowseFolder(path),
      onBrowseSearch: (query) => this._onBrowseSearch(query),
      onBrowseBack: () => this._onBrowseBack(),
      onCreateFolder: (path) => this._onCreateFolder(path),
      onBatchPushToDrive: (paths) => this._onBatchPushToDrive(paths),
      // Feed
      onPostToFeed: (text, type) => this._onPostToFeed(text, type),
      // Connections
      onTestConnection: (connectionId) => this._onTestConnection(connectionId),
      onRemoveConnection: (connectionId) => this._onRemoveConnection(connectionId),
    });
  }

  // -- Handlers -------------------------------------------------------------

  private async _refresh(): Promise<void> {
    if (this._refreshInFlight) return; // deduplicate concurrent calls
    this._refreshInFlight = true;

    // Safety net: force loading off after 12s no matter what
    const safety = setTimeout(() => {
      if (this.workspacesLoading) {
        console.warn("[GmWork] safety timeout — forcing loading off");
        this.workspacesLoading = false;
        this.workspacesError ??= "Loading timed out — tap to retry";
        this.requestUpdate();
      }
    }, 12_000);

    try {
      await loadWorkspaces(this as unknown as WorkspacesState);
      this.allTasks = await loadAllTasksWithQueueStatus(
        this as unknown as WorkspacesState,
      );
    } catch (err) {
      console.error("[GmWork] refresh failed:", err);
    } finally {
      clearTimeout(safety);
      this._refreshInFlight = false;
    }
    this.requestUpdate();
  }

  private async _onSelectWorkspace(workspace: WorkspaceSummary): Promise<void> {
    this.workspaceItemSearchQuery = "";
    this.workspacesLoading = true;
    this.requestUpdate();
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Workspace load timed out")), 5_000),
      );
      await Promise.race([
        selectWorkspace(this as unknown as WorkspacesState, workspace),
        timeout,
      ]);
    } catch (err) {
      console.error("[GmWork] workspace select failed:", err);
      // On timeout/error, use fallback so user still sees the workspace
      if (!this.selectedWorkspace) {
        this.selectedWorkspace = {
          ...workspace,
          pinned: [],
          pinnedSessions: [],
          outputs: [],
          sessions: [],
          tasks: [],
        };
      }
      this.ctx.addToast(
        err instanceof Error ? err.message : "Failed to open " + workspace.name,
        "error",
      );
    } finally {
      this.workspacesLoading = false;
      this.requestUpdate();
    }

    // Backfill feed + connections in background after workspace is displayed
    void backfillWorkspaceExtras(this as unknown as WorkspacesState, workspace.id)
      .then(() => this.requestUpdate())
      .catch(() => {});
  }

  private _onBack(): void {
    this.selectedWorkspace = null;
    this.workspaceItemSearchQuery = "";
    this._onBrowseBack();
  }

  private async _onItemClick(item: WorkspaceFileEntry): Promise<void> {
    const workspaceId = this.selectedWorkspace?.id;
    const result = await readWorkspaceFile(
      this as unknown as WorkspacesState,
      item.path,
      workspaceId,
    );
    if (!result) {
      this.ctx.addToast("Failed to open " + item.name, "error");
      return;
    }
    this.ctx.openSidebar({
      content: result.content,
      mimeType: result.mime,
      filePath: item.path,
      title: item.name,
    });
  }

  private _onSessionClick(session: WorkspaceSessionEntry): void {
    if (!session.key) return;
    appEventBus.emit("chat-navigate", {
      sessionKey: session.key,
      tab: "chat" as Tab,
    });
  }

  private async _onPinToggle(
    workspaceId: string,
    filePath: string,
    pinned: boolean,
  ): Promise<void> {
    const ok = await toggleWorkspacePin(
      this as unknown as WorkspacesState,
      workspaceId,
      filePath,
      pinned,
    );
    if (!ok) {
      this.ctx.addToast("Failed to update pin", "error");
    }
    this.requestUpdate();
  }

  private async _onPinSessionToggle(
    workspaceId: string,
    sessionKey: string,
    pinned: boolean,
  ): Promise<void> {
    const ok = await toggleWorkspaceSessionPin(
      this as unknown as WorkspacesState,
      workspaceId,
      sessionKey,
      pinned,
    );
    if (!ok) {
      this.ctx.addToast("Failed to update session pin", "error");
    }
    this.requestUpdate();
  }

  private async _onCreateWorkspace(input: {
    name: string;
    type: "personal" | "project" | "team";
    path?: string;
  }): Promise<boolean> {
    this.workspacesCreateLoading = true;
    try {
      const created = await createWorkspace(
        this as unknown as WorkspacesState,
        input,
      );
      if (!created) {
        this.ctx.addToast("Failed to create workspace", "error");
        return false;
      }
      this.workspaceItemSearchQuery = "";
      await selectWorkspace(this as unknown as WorkspacesState, created);
      this.ctx.addToast("Created workspace: " + created.name, "success");
      this.requestUpdate();
      return true;
    } finally {
      this.workspacesCreateLoading = false;
    }
  }

  private async _onDeleteWorkspace(workspace: WorkspaceSummary): Promise<void> {
    const ok = await deleteWorkspace(
      this as unknown as WorkspacesState,
      workspace.id,
    );
    if (!ok) {
      this.ctx.addToast("Failed to delete " + workspace.name, "error");
      return;
    }
    this.ctx.addToast("Deleted workspace: " + workspace.name, "success");
    this.allTasks = await loadAllTasksWithQueueStatus(
      this as unknown as WorkspacesState,
    );
    this.requestUpdate();
  }

  private _onToggleFolder(folderPath: string): void {
    this.workspaceExpandedFolders = toggleWorkspaceFolder(
      this.workspaceExpandedFolders,
      folderPath,
    );
    this.requestUpdate();
  }

  private _onTeamSetup(): void {
    appEventBus.emit("chat-navigate", {
      sessionKey: "new",
      tab: "chat" as Tab,
      message:
        "I want to set up a Team Workspace so my team can collaborate. " +
        "Please walk me through it step by step, keeping it simple.",
    });
  }

  private async _onToggleTaskComplete(
    taskId: string,
    currentStatus: string,
  ): Promise<void> {
    const result = await toggleTaskComplete(
      this as unknown as WorkspacesState,
      taskId,
      currentStatus,
    );
    if (!result) {
      this.ctx.addToast("Failed to update task", "error");
      return;
    }
    this.allTasks = await loadAllTasksWithQueueStatus(
      this as unknown as WorkspacesState,
    );
    if (this.selectedWorkspace) {
      const refreshed = await getWorkspace(
        this as unknown as WorkspacesState,
        this.selectedWorkspace.id,
      );
      if (refreshed) {
        this.selectedWorkspace = refreshed;
      }
    }
    this.requestUpdate();
  }

  private async _onCreateTask(title: string, project: string): Promise<void> {
    const result = await createTask(
      this as unknown as WorkspacesState,
      title,
      project,
    );
    if (!result) {
      this.ctx.addToast("Failed to create task", "error");
      return;
    }
    this.ctx.addToast("Task created: " + result.title, "success");
    this.allTasks = await loadAllTasksWithQueueStatus(
      this as unknown as WorkspacesState,
    );
    if (this.selectedWorkspace) {
      const refreshed = await getWorkspace(
        this as unknown as WorkspacesState,
        this.selectedWorkspace.id,
      );
      if (refreshed) {
        this.selectedWorkspace = refreshed;
      }
    }
    this.requestUpdate();
  }

  private async _onUpdateTask(
    taskId: string,
    updates: { title?: string; dueDate?: string | null },
  ): Promise<void> {
    const result = await updateTask(
      this as unknown as WorkspacesState,
      taskId,
      updates,
    );
    if (!result) {
      this.ctx.addToast("Failed to update task", "error");
      return;
    }
    this.editingTaskId = null;
    this.allTasks = await loadAllTasksWithQueueStatus(
      this as unknown as WorkspacesState,
    );
    if (this.selectedWorkspace) {
      const refreshed = await getWorkspace(
        this as unknown as WorkspacesState,
        this.selectedWorkspace.id,
      );
      if (refreshed) {
        this.selectedWorkspace = refreshed;
      }
    }
    this.requestUpdate();
  }

  private async _onStartTask(taskId: string): Promise<void> {
    const result = await startTask(
      this as unknown as WorkspacesState,
      taskId,
    );
    if (!result?.sessionId) {
      this.ctx.addToast("Failed to open session for task", "error");
      return;
    }

    // Build the chat message for new sessions
    let message = "";
    if (result.created && !result.queueOutput) {
      const task = [...(this.allTasks ?? []), ...(this.selectedWorkspace?.tasks ?? [])].find(
        (t) => t.id === taskId,
      );
      const projectCtx = task?.project ? ` (project: ${task.project})` : "";
      message = "Let's work on: " + (task?.title ?? "this task") + projectCtx;
    }

    // Refresh tasks
    this.allTasks = await loadAllTasksWithQueueStatus(
      this as unknown as WorkspacesState,
    );
    this.requestUpdate();

    // Navigate to the session via event bus
    appEventBus.emit("chat-navigate", {
      sessionKey: result.sessionId,
      tab: "chat" as Tab,
      message,
    });
  }

  private async _onViewTaskOutput(taskId: string): Promise<void> {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const queueResult = await gateway.request<{
        items: Array<{ id: string; sourceTaskId?: string; result?: { outputPath?: string; summary?: string } }>;
      }>("queue.list", { limit: 100 });
      const qi = queueResult?.items?.find((i) => i.sourceTaskId === taskId);
      if (!qi?.result?.outputPath) {
        this.ctx?.addToast?.("No output available for this task", "info");
        return;
      }
      const result = await gateway.request<{ content: string }>(
        "queue.readOutput",
        { path: qi.result.outputPath },
      );
      const title = qi.result.outputPath.split("/").pop() ?? "Agent Output";
      this.ctx?.openSidebar?.({
        content: result.content,
        mimeType: "text/markdown",
        filePath: qi.result.outputPath,
        title,
      });
    } catch (err) {
      console.error("[GmWork] View task output failed:", err);
      this.ctx?.addToast?.("Failed to load agent output", "error");
    }
  }

  private async _onBrowseFolder(folderPath: string): Promise<void> {
    if (!this.selectedWorkspace) return;
    const result = await browseWorkspaceFolder(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      folderPath,
    );
    if (result) {
      this.workspaceBrowsePath = folderPath;
      this.workspaceBrowseEntries = result.entries;
      this.workspaceBreadcrumbs = result.breadcrumbs;
    }
  }

  private async _onBrowseSearch(query: string): Promise<void> {
    this.workspaceBrowseSearchQuery = query;
    if (!query.trim() || !this.selectedWorkspace) {
      this.workspaceBrowseSearchResults = null;
      return;
    }
    this.workspaceBrowseSearchResults = await searchWorkspaceFiles(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      query,
    );
  }

  private _onBrowseBack(): void {
    this.workspaceBrowsePath = null;
    this.workspaceBrowseEntries = null;
    this.workspaceBreadcrumbs = null;
    this.workspaceBrowseSearchQuery = "";
    this.workspaceBrowseSearchResults = null;
  }

  private async _onCreateFolder(folderPath: string): Promise<void> {
    if (!this.selectedWorkspace) return;
    const ok = await createWorkspaceFolder(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      folderPath,
    );
    if (ok && this.workspaceBrowsePath) {
      await this._onBrowseFolder(this.workspaceBrowsePath);
    }
    if (ok) {
      this.ctx.addToast("Folder created", "success");
    }
  }

  private async _onPostToFeed(text: string, type: string): Promise<void> {
    if (!this.selectedWorkspace) return;
    const entry = await postToFeed(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      text,
      type,
    );
    if (!entry) {
      this.ctx.addToast("Failed to post to feed", "error");
      return;
    }
    // Prepend to local feed entries
    if (this.selectedWorkspace.feedEntries) {
      this.selectedWorkspace = {
        ...this.selectedWorkspace,
        feedEntries: [entry, ...this.selectedWorkspace.feedEntries],
      };
    }
    this.requestUpdate();
  }

  private async _onTestConnection(connectionId: string): Promise<void> {
    if (!this.selectedWorkspace) return;
    this.ctx.addToast("Testing connection...", "info");
    const result = await testConnection(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      connectionId,
    );
    if (result.ok) {
      this.ctx.addToast("Connection OK", "success");
      // Refresh connections
      const connections = await loadConnections(
        this as unknown as WorkspacesState,
        this.selectedWorkspace.id,
      );
      this.selectedWorkspace = { ...this.selectedWorkspace, connections };
    } else {
      this.ctx.addToast("Connection failed: " + (result.error ?? "unknown"), "error");
    }
    this.requestUpdate();
  }

  private async _onRemoveConnection(connectionId: string): Promise<void> {
    if (!this.selectedWorkspace) return;
    const ok = await removeConnection(
      this as unknown as WorkspacesState,
      this.selectedWorkspace.id,
      connectionId,
    );
    if (!ok) {
      this.ctx.addToast("Failed to remove connection", "error");
      return;
    }
    this.ctx.addToast("Connection removed", "success");
    // Update local state
    this.selectedWorkspace = {
      ...this.selectedWorkspace,
      connections: (this.selectedWorkspace.connections ?? []).filter(c => c.id !== connectionId),
    };
    this.requestUpdate();
  }

  private async _onBatchPushToDrive(filePaths: string[]): Promise<void> {
    if (filePaths.length === 0 || !this.ctx.gateway || !this.ctx.connected)
      return;

    this.ctx.addToast(
      "Uploading " + filePaths.length + " files to Drive...",
      "info",
    );
    try {
      const result = await this.ctx.gateway.request<{
        results?: Array<{
          path: string;
          success: boolean;
          driveUrl?: string;
          error?: string;
        }>;
      }>("files.batchPushToDrive", { filePaths });

      const successCount =
        result?.results?.filter((r) => r.success).length ?? 0;
      const total = result?.results?.length ?? filePaths.length;
      if (successCount === total) {
        this.ctx.addToast(
          "Uploaded " + successCount + " files to Google Drive",
          "success",
        );
      } else {
        this.ctx.addToast(
          "Uploaded " +
            successCount +
            "/" +
            total +
            " files (" +
            (total - successCount) +
            " failed)",
          "warning",
        );
      }
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : "Unknown error";
      this.ctx.addToast("Batch Drive upload failed: " + detail, "error");
    }
  }
}

// Ensure the module is importable as a side-effect registration
declare global {
  interface HTMLElementTagNameMap {
    "gm-work": GmWork;
  }
}
