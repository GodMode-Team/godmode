import { html, nothing } from "lit";
import { formatAgo } from "../format";

export type WorkspaceTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  emoji: string;
  type: "personal" | "project" | "team";
  path: string;
  artifactCount: number;
  sessionCount: number;
  lastUpdated: Date;
};

export type WorkspaceFileEntry = {
  path: string;
  name: string;
  type: "markdown" | "html" | "image" | "json" | "text" | "folder";
  size: number;
  modified: Date;
  isDirectory?: boolean;
  searchText?: string;
};

export type WorkspaceSessionEntry = {
  id: string;
  key: string;
  title: string;
  created: Date;
  status: "running" | "complete" | "blocked";
  workspaceSubfolder: string | null;
};

export type FolderTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  fileType?: WorkspaceFileEntry["type"];
  size?: number;
  modified?: Date;
  children?: FolderTreeNode[];
};

export type WorkspaceDetail = WorkspaceSummary & {
  pinned: WorkspaceFileEntry[];
  pinnedSessions: WorkspaceSessionEntry[];
  outputs: WorkspaceFileEntry[];
  folderTree?: FolderTreeNode[];
  sessions: WorkspaceSessionEntry[];
  tasks: WorkspaceTask[];
};

export type WorkspaceCreateRequest = {
  name: string;
  type: "personal" | "project" | "team";
  path?: string;
};

export type TaskFilter = "all" | "outstanding" | "complete";

export type WorkspacesProps = {
  connected: boolean;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceDetail | null;
  searchQuery: string;
  itemSearchQuery?: string;
  expandedFolders?: Set<string>;
  loading?: boolean;
  createLoading?: boolean;
  error?: string | null;
  allTasks?: WorkspaceTask[];
  taskFilter?: TaskFilter;
  showCompletedTasks?: boolean;
  onSearch?: (query: string) => void;
  onItemSearch?: (query: string) => void;
  onSelectWorkspace?: (workspace: WorkspaceSummary) => void;
  onBack?: () => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
  onSessionClick?: (session: WorkspaceSessionEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
  onPinSessionToggle?: (workspaceId: string, sessionKey: string, pinned: boolean) => void;
  onCreateWorkspace?: (input: WorkspaceCreateRequest) => Promise<boolean | void> | boolean | void;
  onToggleFolder?: (folderPath: string) => void;
  onTeamSetup?: () => void;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onCreateTask?: (title: string, project: string) => void;
  onSetTaskFilter?: (filter: TaskFilter) => void;
  onToggleCompletedTasks?: () => void;
};

function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(type: WorkspaceFileEntry["type"]): string {
  switch (type) {
    case "markdown":
      return "📄";
    case "html":
      return "🌐";
    case "image":
      return "🖼️";
    case "json":
      return "🧩";
    case "folder":
      return "📁";
    default:
      return "📄";
  }
}

function statusDotClass(status: WorkspaceSessionEntry["status"]): string {
  if (status === "running") {
    return "ws-session-dot ws-session-dot--running";
  }
  if (status === "blocked") {
    return "ws-session-dot ws-session-dot--blocked";
  }
  return "ws-session-dot ws-session-dot--complete";
}

function priorityBadgeClass(priority: WorkspaceTask["priority"]): string {
  return `ws-task-priority ws-task-priority--${priority}`;
}

function priorityLabel(priority: WorkspaceTask["priority"]): string {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Med";
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "";
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate === today) return "Today";
  if (dueDate < today) return `Overdue (${dueDate})`;
  return dueDate;
}

function dueDateClass(dueDate: string | null): string {
  if (!dueDate) return "ws-task-due";
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate < today) return "ws-task-due ws-task-due--overdue";
  if (dueDate === today) return "ws-task-due ws-task-due--today";
  return "ws-task-due";
}

function sortTasks(tasks: WorkspaceTask[]): WorkspaceTask[] {
  return [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    // Due date first (soonest first, null last)
    if (a.dueDate && b.dueDate) {
      const cmp = a.dueDate.localeCompare(b.dueDate);
      if (cmp !== 0) return cmp;
    } else if (a.dueDate && !b.dueDate) {
      return -1;
    } else if (!a.dueDate && b.dueDate) {
      return 1;
    }
    // Then priority
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function renderTaskRow(
  task: WorkspaceTask,
  onToggle?: (taskId: string, currentStatus: string) => void,
): ReturnType<typeof html> {
  const isComplete = task.status === "complete";
  return html`
    <div class="ws-list-row ws-task-row ${isComplete ? "ws-task-row--complete" : ""}">
      <button
        class="ws-task-check ${isComplete ? "ws-task-check--done" : ""}"
        @click=${() => onToggle?.(task.id, task.status)}
        title=${isComplete ? "Mark incomplete" : "Mark complete"}
      >
        ${isComplete ? "&#10003;" : ""}
      </button>
      <span class="ws-list-title ${isComplete ? "ws-task-title--done" : ""}">${task.title}</span>
      <span class=${priorityBadgeClass(task.priority)}>${priorityLabel(task.priority)}</span>
      ${task.dueDate ? html`<span class=${dueDateClass(task.dueDate)}>${formatDueDate(task.dueDate)}</span>` : nothing}
    </div>
  `;
}

function renderAllTaskRow(
  task: WorkspaceTask,
  onToggle?: (taskId: string, currentStatus: string) => void,
): ReturnType<typeof html> {
  const isComplete = task.status === "complete";
  return html`
    <div class="ws-list-row ws-task-row ${isComplete ? "ws-task-row--complete" : ""}">
      <button
        class="ws-task-check ${isComplete ? "ws-task-check--done" : ""}"
        @click=${() => onToggle?.(task.id, task.status)}
        title=${isComplete ? "Mark incomplete" : "Mark complete"}
      >
        ${isComplete ? "&#10003;" : ""}
      </button>
      <span class="ws-list-title ${isComplete ? "ws-task-title--done" : ""}">${task.title}</span>
      ${task.project ? html`<span class="ws-task-project">${task.project}</span>` : nothing}
      <span class=${priorityBadgeClass(task.priority)}>${priorityLabel(task.priority)}</span>
      ${task.dueDate ? html`<span class=${dueDateClass(task.dueDate)}>${formatDueDate(task.dueDate)}</span>` : nothing}
    </div>
  `;
}

function matchesQuery(query: string, value: string): boolean {
  if (!query.trim()) {
    return true;
  }
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

function filterFiles(query: string, list: WorkspaceFileEntry[]): WorkspaceFileEntry[] {
  if (!query.trim()) {
    return list;
  }
  const normalized = query.trim().toLowerCase();
  return list.filter((entry) => {
    return (
      entry.name.toLowerCase().includes(normalized) ||
      entry.path.toLowerCase().includes(normalized) ||
      entry.type.toLowerCase().includes(normalized) ||
      (entry.searchText ?? "").toLowerCase().includes(normalized)
    );
  });
}

function filterSessions(query: string, list: WorkspaceSessionEntry[]): WorkspaceSessionEntry[] {
  if (!query.trim()) {
    return list;
  }
  const normalized = query.trim().toLowerCase();
  return list.filter((entry) => {
    return (
      entry.title.toLowerCase().includes(normalized) || entry.key.toLowerCase().includes(normalized)
    );
  });
}

function filterFolderTree(query: string, nodes: FolderTreeNode[]): FolderTreeNode[] {
  if (!query.trim()) {
    return nodes;
  }
  const q = query.trim().toLowerCase();
  return nodes.reduce<FolderTreeNode[]>((acc, node) => {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(q) || node.path.toLowerCase().includes(q)) {
        acc.push(node);
      }
    } else {
      const filteredChildren = filterFolderTree(query, node.children ?? []);
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    }
    return acc;
  }, []);
}

/** Count all file nodes (non-folder) in a tree, recursively. */
function countFilesInTree(nodes: FolderTreeNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === "file") {
      count++;
    } else if (node.children) {
      count += countFilesInTree(node.children);
    }
  }
  return count;
}

type FolderNodeContext = {
  expandedFolders: Set<string>;
  pinnedPaths: Set<string>;
  workspaceId: string;
  onToggleFolder?: (path: string) => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
};

function renderFolderNode(
  node: FolderTreeNode,
  depth: number,
  ctx: FolderNodeContext,
): ReturnType<typeof html> {
  if (node.type === "file") {
    const isPinned = ctx.pinnedPaths.has(node.path);
    return html`
      <div class="ws-folder-file-row" style="padding-left: ${12 + depth * 16}px">
        <button
          class="ws-folder-file"
          @click=${() =>
            ctx.onItemClick?.({
              path: node.path,
              name: node.name,
              type: node.fileType ?? "text",
              size: node.size ?? 0,
              modified: node.modified ?? new Date(),
            })}
        >
          <span class="ws-list-icon">${fileIcon(node.fileType ?? "text")}</span>
          <span class="ws-list-title">${node.name}</span>
          ${node.size != null ? html`<span class="ws-list-meta">${formatFileSize(node.size)}</span>` : nothing}
          ${node.modified ? html`<span class="ws-list-meta">${formatAgo(node.modified.getTime())}</span>` : nothing}
        </button>
        <button
          class="ws-pin-btn ${isPinned ? "active" : ""}"
          @click=${() => ctx.onPinToggle?.(ctx.workspaceId, node.path, isPinned)}
          title=${isPinned ? "Unpin" : "Pin"}
        >
          ${isPinned ? "Unpin" : "Pin"}
        </button>
      </div>
    `;
  }

  const isExpanded = ctx.expandedFolders.has(node.path);
  const children = node.children ?? [];
  const fileCount = countFilesInTree(children);

  return html`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12 + depth * 16}px"
        @click=${() => ctx.onToggleFolder?.(node.path)}
      >
        <span class="ws-folder-chevron ${isExpanded ? "expanded" : ""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${node.name}</span>
        <span class="ws-folder-count">${fileCount} ${fileCount === 1 ? "file" : "files"}</span>
      </button>
      ${isExpanded
        ? html`
            <div class="ws-folder-children">
              ${children.map((child) =>
                renderFolderNode(child, depth + 1, ctx),
              )}
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderWorkspaceCard(
  workspace: WorkspaceSummary,
  onSelect?: (workspace: WorkspaceSummary) => void,
) {
  return html`
    <button
      class="workspace-card"
      @click=${() => onSelect?.(workspace)}
      title="Open workspace"
    >
      <div class="workspace-card-emoji">${workspace.emoji}</div>
      <div class="workspace-card-content">
        <div class="workspace-card-name">${workspace.name}</div>
        <div class="workspace-card-meta">
          <span>${workspace.artifactCount} artifacts</span>
          <span class="workspace-card-separator">•</span>
          <span>${workspace.sessionCount} sessions</span>
          <span class="workspace-card-separator">•</span>
          <span>${formatAgo(workspace.lastUpdated.getTime())}</span>
        </div>
      </div>
    </button>
  `;
}

function renderSectionFileRow(props: {
  workspaceId: string;
  entry: WorkspaceFileEntry;
  pinned: boolean;
  onOpen?: (item: WorkspaceFileEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
}) {
  const { workspaceId, entry, pinned, onOpen, onPinToggle } = props;
  return html`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${() => onOpen?.(entry)}>
        <span class="ws-list-icon">${fileIcon(entry.type)}</span>
        <span class="ws-list-title">${entry.name}</span>
        <span class="ws-list-meta">${formatFileSize(entry.size)}</span>
        <span class="ws-list-meta">${formatAgo(entry.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${pinned ? "active" : ""}"
        @click=${() => onPinToggle?.(workspaceId, entry.path, pinned)}
        title=${pinned ? "Unpin" : "Pin"}
      >
        ${pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  `;
}

function renderWorkspaceDetail(props: {
  workspace: WorkspaceDetail;
  itemSearchQuery: string;
  expandedFolders?: Set<string>;
  showCompletedTasks?: boolean;
  onItemSearch?: (query: string) => void;
  onBack?: () => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
  onSessionClick?: (session: WorkspaceSessionEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
  onPinSessionToggle?: (workspaceId: string, sessionKey: string, pinned: boolean) => void;
  onToggleFolder?: (folderPath: string) => void;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onCreateTask?: (title: string, project: string) => void;
  onToggleCompletedTasks?: () => void;
}) {
  const {
    workspace,
    itemSearchQuery,
    expandedFolders = new Set<string>(),
    showCompletedTasks = false,
    onItemSearch,
    onBack,
    onItemClick,
    onSessionClick,
    onPinToggle,
    onPinSessionToggle,
    onToggleFolder,
    onToggleTaskComplete,
    onCreateTask,
    onToggleCompletedTasks,
  } = props;

  const filteredPinned = filterFiles(itemSearchQuery, workspace.pinned).toSorted(
    (a, b) => b.modified.getTime() - a.modified.getTime(),
  );
  const filteredPinnedSessions = filterSessions(itemSearchQuery, workspace.pinnedSessions);
  const filteredArtifacts = filterFiles(itemSearchQuery, workspace.outputs).filter(
    (entry) => !workspace.pinned.some((pinned) => pinned.path === entry.path),
  );
  const hasFolderTree = (workspace.folderTree?.length ?? 0) > 0;
  const filteredFolderTree = hasFolderTree
    ? filterFolderTree(itemSearchQuery, workspace.folderTree!)
    : [];
  const filteredSessions = filterSessions(itemSearchQuery, workspace.sessions);
  const pinnedSessionKeys = new Set(workspace.pinnedSessions.map((s) => s.key));
  const pinnedFilePaths = new Set(workspace.pinned.map((f) => f.path));
  const hasItemSearch = itemSearchQuery.trim().length > 0;
  const showPinnedSection = filteredPinned.length > 0 || filteredPinnedSessions.length > 0;
  const showSessionsSection =
    filteredSessions.length > 0 || workspace.sessions.length === 0 || hasItemSearch;

  // Context for folder tree nodes: shared pin state and callbacks
  const folderCtx: FolderNodeContext = {
    expandedFolders,
    pinnedPaths: pinnedFilePaths,
    workspaceId: workspace.id,
    onToggleFolder,
    onItemClick,
    onPinToggle,
  };

  return html`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${onBack}>←</button>
          <span class="workspaces-icon">${workspace.emoji}</span>
          <div class="workspace-header-text">
            <span class="workspace-header-name">${workspace.name}</span>
            <span class="workspace-header-desc">${workspace.path}</span>
          </div>
        </div>
        <div class="workspace-detail-search">
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspace..."
            .value=${itemSearchQuery}
            @input=${(e: Event) => onItemSearch?.((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div class="workspace-content">
        ${
          showPinnedSection
            ? html`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${filteredPinned.length + filteredPinnedSessions.length}</span>
                  </div>
                  <div class="ws-list">
                    ${filteredPinnedSessions.map(
                      (session) => html`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${() => onSessionClick?.(session)}>
                            <span class=${statusDotClass(session.status)}></span>
                            <span class="ws-list-title">${session.title}</span>
                            <span class="ws-list-meta">${formatAgo(session.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${() => onPinSessionToggle?.(workspace.id, session.key, true)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `,
                    )}
                    ${filteredPinned.map((entry) =>
                      renderSectionFileRow({
                        workspaceId: workspace.id,
                        entry,
                        pinned: true,
                        onOpen: onItemClick,
                        onPinToggle,
                      }),
                    )}
                  </div>
                </section>
              `
            : nothing
        }

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${hasFolderTree ? filteredFolderTree.length : filteredArtifacts.length}</span>
          </div>
          <div class="ws-list ws-list--scroll">
            ${
              hasFolderTree
                ? filteredFolderTree.length === 0
                  ? html`<div class="ws-empty">No artifacts</div>`
                  : filteredFolderTree.map((node) =>
                      renderFolderNode(node, 0, folderCtx),
                    )
                : filteredArtifacts.length === 0
                  ? html`<div class="ws-empty">No artifacts</div>`
                  : filteredArtifacts.map((entry) =>
                      renderSectionFileRow({
                        workspaceId: workspace.id,
                        entry,
                        pinned: false,
                        onOpen: onItemClick,
                        onPinToggle,
                      }),
                    )
            }
          </div>
        </section>

        ${
          showSessionsSection
            ? html`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${filteredSessions.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${
                      filteredSessions.length === 0
                        ? html`
                            <div class="ws-empty">No sessions</div>
                          `
                        : filteredSessions.map(
                            (session) => html`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${() => onSessionClick?.(session)}>
                                  <span class=${statusDotClass(session.status)}></span>
                                  <span class="ws-list-title">${session.title}</span>
                                  <span class="ws-list-meta">${formatAgo(session.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${pinnedSessionKeys.has(session.key) ? "active" : ""}"
                                  @click=${() => onPinSessionToggle?.(workspace.id, session.key, pinnedSessionKeys.has(session.key))}
                                  title=${pinnedSessionKeys.has(session.key) ? "Unpin" : "Pin"}
                                >
                                  ${pinnedSessionKeys.has(session.key) ? "Unpin" : "Pin"}
                                </button>
                              </div>
                            `,
                          )
                    }
                  </div>
                </section>
              `
            : nothing
        }

        ${renderWorkspaceTasksSection({
          tasks: workspace.tasks ?? [],
          workspaceName: workspace.name,
          showCompleted: showCompletedTasks,
          onToggleTaskComplete,
          onCreateTask,
          onToggleCompletedTasks,
        })}
      </div>
    </div>
  `;
}

function renderWorkspaceTasksSection(props: {
  tasks: WorkspaceTask[];
  workspaceName: string;
  showCompleted: boolean;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onCreateTask?: (title: string, project: string) => void;
  onToggleCompletedTasks?: () => void;
}): ReturnType<typeof html> {
  const { tasks, workspaceName, showCompleted, onToggleTaskComplete, onCreateTask, onToggleCompletedTasks } = props;
  const pending = sortTasks(tasks.filter((t) => t.status === "pending"));
  const completed = sortTasks(tasks.filter((t) => t.status === "complete"));

  return html`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${pending.length} open${completed.length > 0 ? `, ${completed.length} done` : ""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${pending.length === 0 && completed.length === 0
          ? html`<div class="ws-empty">No tasks</div>`
          : nothing}
        ${pending.map((task) => renderTaskRow(task, onToggleTaskComplete))}
        ${completed.length > 0
          ? html`
              <button class="ws-task-completed-toggle" @click=${() => onToggleCompletedTasks?.()}>
                ${showCompleted ? "Hide" : "Show"} ${completed.length} completed
              </button>
              ${showCompleted ? completed.map((task) => renderTaskRow(task, onToggleTaskComplete)) : nothing}
            `
          : nothing}
      </div>
      ${onCreateTask
        ? html`
            <form
              class="ws-task-create-form"
              @submit=${(e: Event) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const input = form.querySelector("input") as HTMLInputElement;
                const title = input.value.trim();
                if (!title) return;
                onCreateTask(title, workspaceName);
                input.value = "";
              }}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `
        : nothing}
    </section>
  `;
}

export function renderWorkspaces(props: WorkspacesProps) {
  const {
    connected,
    workspaces,
    selectedWorkspace,
    searchQuery,
    itemSearchQuery,
    expandedFolders,
    loading,
    createLoading,
    error,
    allTasks = [],
    taskFilter = "all",
    showCompletedTasks = false,
    onSearch,
    onItemSearch,
    onSelectWorkspace,
    onBack,
    onItemClick,
    onSessionClick,
    onPinToggle,
    onPinSessionToggle,
    onCreateWorkspace,
    onToggleFolder,
    onTeamSetup,
    onToggleTaskComplete,
    onCreateTask,
    onSetTaskFilter,
    onToggleCompletedTasks,
  } = props;

  const filteredWorkspaces = workspaces.filter((workspace) =>
    matchesQuery(searchQuery, `${workspace.name} ${workspace.path} ${workspace.type}`),
  );

  if (selectedWorkspace) {
    return renderWorkspaceDetail({
      workspace: selectedWorkspace,
      itemSearchQuery: itemSearchQuery ?? "",
      expandedFolders,
      showCompletedTasks,
      onItemSearch,
      onBack,
      onItemClick,
      onSessionClick,
      onPinToggle,
      onPinSessionToggle,
      onToggleFolder,
      onToggleTaskComplete,
      onCreateTask,
      onToggleCompletedTasks,
    });
  }

  return html`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-header-left">
          <h1 class="workspaces-title-text">Workspaces</h1>
          <p class="workspaces-subtitle">Projects, clients, and personal operating context.</p>
        </div>
        <div class="workspaces-header-right">
          <form
            class="workspaces-create-form"
            @submit=${async (event: Event) => {
              event.preventDefault();
              if (createLoading) {
                return;
              }
              if (!onCreateWorkspace) {
                return;
              }
              const form = event.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const nameVal = data.get("name");
              const name = (typeof nameVal === "string" ? nameVal : "").trim();
              if (!name) {
                return;
              }
              const typeVal = data.get("type");
              const rawType = (typeof typeVal === "string" ? typeVal : "project")
                .trim()
                .toLowerCase();
              const type = rawType === "team" || rawType === "personal" ? rawType : "project";
              const pathVal = data.get("path");
              const customPath = (typeof pathVal === "string" ? pathVal : "").trim();
              const created = await onCreateWorkspace({
                name,
                type,
                ...(customPath ? { path: customPath } : {}),
              });
              if (created === false) {
                return;
              }
              form.reset();
            }}
          >
            <input
              type="text"
              name="name"
              class="workspaces-create-input"
              placeholder="New workspace name (e.g. Patient Autopilot)"
              required
            />
            <select name="type" class="workspaces-create-select">
              <option value="project">Project</option>
              <option value="team">Team</option>
              <option value="personal">Personal</option>
            </select>
            <input
              type="text"
              name="path"
              class="workspaces-create-input workspaces-create-input--path"
              placeholder="Optional path (auto-created if blank)"
            />
            <button
              type="submit"
              class="workspaces-add-btn"
              ?disabled=${Boolean(createLoading)}
            >
              ${createLoading ? "Adding..." : "Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${searchQuery}
            @input=${(e: Event) => onSearch?.((e.target as HTMLInputElement).value)}
          />
          <span class="workspaces-count">${filteredWorkspaces.length} workspaces</span>
          <span class="workspaces-status ${connected ? "online" : "offline"}">
            ${connected ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      ${error ? html`<div class="callout danger" style="margin: 16px;">${error}</div>` : nothing}

      ${
        onTeamSetup
          ? html`
              <div class="ws-team-setup-bar">
                <span class="ws-team-setup-text">Want your team's AIs to collaborate?</span>
                <button class="btn ws-team-setup-btn" @click=${() => onTeamSetup()}>
                  Set Up Team Workspace
                </button>
              </div>
            `
          : nothing
      }

      ${
        loading
          ? html`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `
          : html`
              <div class="workspace-grid">
                ${
                  filteredWorkspaces.length === 0
                    ? html`
                        <div class="workspaces-empty">
                          <span class="workspaces-empty-icon">${connected ? "📭" : "🔌"}</span>
                          <span>${connected ? "No workspaces found" : "Connect to gateway to see workspaces"}</span>
                        </div>
                      `
                    : filteredWorkspaces.map((workspace) =>
                        renderWorkspaceCard(workspace, onSelectWorkspace),
                      )
                }
              </div>

              ${renderAllTasksSection({
                tasks: allTasks,
                taskFilter,
                onToggleTaskComplete,
                onSetTaskFilter,
              })}
            `
      }
    </div>
  `;
}

function renderAllTasksSection(props: {
  tasks: WorkspaceTask[];
  taskFilter: TaskFilter;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onSetTaskFilter?: (filter: TaskFilter) => void;
}): ReturnType<typeof html> {
  const { tasks, taskFilter, onToggleTaskComplete, onSetTaskFilter } = props;

  if (tasks.length === 0) {
    return html``;
  }

  let filtered: WorkspaceTask[];
  if (taskFilter === "outstanding") {
    filtered = tasks.filter((t) => t.status === "pending");
  } else if (taskFilter === "complete") {
    filtered = tasks.filter((t) => t.status === "complete");
  } else {
    filtered = tasks;
  }
  const sorted = sortTasks(filtered);

  return html`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <h3>All Tasks</h3>
          <div class="ws-task-filters">
            <button
              class="ws-task-filter-btn ${taskFilter === "all" ? "active" : ""}"
              @click=${() => onSetTaskFilter?.("all")}
            >All</button>
            <button
              class="ws-task-filter-btn ${taskFilter === "outstanding" ? "active" : ""}"
              @click=${() => onSetTaskFilter?.("outstanding")}
            >Outstanding</button>
            <button
              class="ws-task-filter-btn ${taskFilter === "complete" ? "active" : ""}"
              @click=${() => onSetTaskFilter?.("complete")}
            >Complete</button>
          </div>
        </div>
        <div class="ws-list ws-list--scroll">
          ${sorted.length === 0
            ? html`<div class="ws-empty">No tasks</div>`
            : sorted.map((task) => renderAllTaskRow(task, onToggleTaskComplete))}
        </div>
      </section>
    </div>
  `;
}
