import { html, nothing } from "lit";
import { formatAgo, localDateString } from "../format";

export type WorkspaceTask = {
  id: string;
  title: string;
  status: "pending" | "complete";
  project: string | null;
  dueDate: string | null;
  priority: "high" | "medium" | "low";
  createdAt: string;
  completedAt: string | null;
  briefSection?: string | null;
  queueStatus?: {
    status: "processing" | "review" | "failed";
    type: string;
    roleName: string;
    queueItemId: string;
  } | null;
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
  memory?: WorkspaceFileEntry[];
};

export type WorkspaceCreateRequest = {
  name: string;
  type: "personal" | "project" | "team";
  path?: string;
};

export type TaskFilter = "all" | "outstanding" | "today" | "complete";
export type TaskSort = "due" | "priority" | "newest";

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
  taskSort?: TaskSort;
  showCompletedTasks?: boolean;
  editingTaskId?: string | null;
  workspaceNames?: string[];
  onSearch?: (query: string) => void;
  onItemSearch?: (query: string) => void;
  onSelectWorkspace?: (workspace: WorkspaceSummary) => void;
  onBack?: () => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
  onSessionClick?: (session: WorkspaceSessionEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
  onPinSessionToggle?: (workspaceId: string, sessionKey: string, pinned: boolean) => void;
  onCreateWorkspace?: (input: WorkspaceCreateRequest) => Promise<boolean | void> | boolean | void;
  onDeleteWorkspace?: (workspace: WorkspaceSummary) => void;
  onToggleFolder?: (folderPath: string) => void;
  onTeamSetup?: () => void;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onCreateTask?: (title: string, project: string) => void;
  onSetTaskFilter?: (filter: TaskFilter) => void;
  onSetTaskSort?: (sort: TaskSort) => void;
  onToggleCompletedTasks?: () => void;
  onStartTask?: (taskId: string) => void;
  onEditTask?: (taskId: string | null) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void;
  browsePath?: string | null;
  browseEntries?: import("../controllers/workspaces").BrowseEntry[] | null;
  breadcrumbs?: Array<{ name: string; path: string }> | null;
  browseSearchQuery?: string;
  browseSearchResults?: Array<{ path: string; name: string; type: string; excerpt?: string }> | null;
  onBrowseFolder?: (path: string) => void;
  onBrowseSearch?: (query: string) => void;
  onBrowseBack?: () => void;
  onCreateFolder?: (path: string) => void;
  onBatchPushToDrive?: (filePaths: string[]) => void;
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

export function priorityBadgeClass(priority: WorkspaceTask["priority"]): string {
  return `ws-task-priority ws-task-priority--${priority}`;
}

export function priorityLabel(priority: WorkspaceTask["priority"]): string {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Med";
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "";
  const today = localDateString();
  if (dueDate === today) return "Today";
  if (dueDate < today) return `Overdue (${dueDate})`;
  return dueDate;
}

export function dueDateClass(dueDate: string | null): string {
  if (!dueDate) return "ws-task-due";
  const today = localDateString();
  if (dueDate < today) return "ws-task-due ws-task-due--overdue";
  if (dueDate === today) return "ws-task-due ws-task-due--today";
  return "ws-task-due";
}

export function sortTasks(tasks: WorkspaceTask[], mode: TaskSort = "due"): WorkspaceTask[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    if (mode === "priority") {
      const pCmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pCmp !== 0) return pCmp;
      // Then by due date
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return 0;
    }
    if (mode === "newest") {
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    }
    // Default: "due" — soonest due first, null last, then priority
    if (a.dueDate && b.dueDate) {
      const cmp = a.dueDate.localeCompare(b.dueDate);
      if (cmp !== 0) return cmp;
    } else if (a.dueDate && !b.dueDate) {
      return -1;
    } else if (!a.dueDate && b.dueDate) {
      return 1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function renderTaskRow(
  task: WorkspaceTask,
  onToggle?: (taskId: string, currentStatus: string) => void,
  onStartTask?: (taskId: string) => void,
  editingTaskId?: string | null,
  onEditTask?: (taskId: string | null) => void,
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void,
): ReturnType<typeof html> {
  const isComplete = task.status === "complete";
  const isEditing = editingTaskId === task.id;

  if (isEditing) {
    return html`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${(e: Event) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const titleInput = form.querySelector(".ws-task-edit-input") as HTMLInputElement;
          const dateInput = form.querySelector(".ws-task-date-input") as HTMLInputElement;
          const newTitle = titleInput.value.trim();
          if (!newTitle) return;
          onUpdateTask?.(task.id, {
            title: newTitle,
            dueDate: dateInput.value || null,
          });
          onEditTask?.(null);
        }}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${task.title}
          @click=${(e: Event) => e.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${task.dueDate ?? ""}
        />
        <button type="submit" class="ws-task-save-btn">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          @click=${() => onEditTask?.(null)}
        >Cancel</button>
      </form>
    `;
  }

  return html`
    <div class="ws-list-row ws-task-row ${isComplete ? "ws-task-row--complete" : ""}">
      <button
        class="ws-task-check ${isComplete ? "ws-task-check--done" : ""}"
        @click=${() => onToggle?.(task.id, task.status)}
        title=${isComplete ? "Mark incomplete" : "Mark complete"}
      >
        ${isComplete ? "\u2713" : ""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${isComplete ? "ws-task-title--done" : ""}"
        @click=${() => onEditTask?.(task.id)}
        title="Click to edit"
      >${task.title}</span>
      ${task.briefSection ? html`<span class="ws-task-section">${task.briefSection}</span>` : nothing}
      <span class=${priorityBadgeClass(task.priority)}>${priorityLabel(task.priority)}</span>
      ${task.dueDate ? html`<span class=${dueDateClass(task.dueDate)}>${formatDueDate(task.dueDate)}</span>` : nothing}
      ${!isComplete && task.queueStatus?.status === "processing"
        ? html`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${task.queueStatus.roleName} working...
          </span>`
        : !isComplete && task.queueStatus?.status === "review" && onStartTask
          ? html`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${() => onStartTask(task.id)}
              title="Review agent output"
            >Review</button>`
          : !isComplete && onStartTask
            ? html`<button
                class="ws-task-start-btn"
                @click=${() => onStartTask(task.id)}
                title="Start working on this task"
              >Start</button>`
            : nothing}
    </div>
  `;
}

export function renderAllTaskRow(
  task: WorkspaceTask,
  onToggle?: (taskId: string, currentStatus: string) => void,
  onStartTask?: (taskId: string) => void,
  editingTaskId?: string | null,
  onEditTask?: (taskId: string | null) => void,
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void,
): ReturnType<typeof html> {
  const isComplete = task.status === "complete";
  const isEditing = editingTaskId === task.id;

  if (isEditing) {
    return html`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${(e: Event) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const titleInput = form.querySelector(".ws-task-edit-input") as HTMLInputElement;
          const dateInput = form.querySelector(".ws-task-date-input") as HTMLInputElement;
          const newTitle = titleInput.value.trim();
          if (!newTitle) return;
          onUpdateTask?.(task.id, {
            title: newTitle,
            dueDate: dateInput.value || null,
          });
          onEditTask?.(null);
        }}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${task.title}
          @click=${(e: Event) => e.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${task.dueDate ?? ""}
        />
        <button type="submit" class="ws-task-save-btn">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          @click=${() => onEditTask?.(null)}
        >Cancel</button>
      </form>
    `;
  }

  return html`
    <div class="ws-list-row ws-task-row ${isComplete ? "ws-task-row--complete" : ""}">
      <button
        class="ws-task-check ${isComplete ? "ws-task-check--done" : ""}"
        @click=${() => onToggle?.(task.id, task.status)}
        title=${isComplete ? "Mark incomplete" : "Mark complete"}
      >
        ${isComplete ? "\u2713" : ""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${isComplete ? "ws-task-title--done" : ""}"
        @click=${() => onEditTask?.(task.id)}
        title="Click to edit"
      >${task.title}</span>
      ${task.project ? html`<span class="ws-task-project">${task.project}</span>` : nothing}
      ${task.briefSection ? html`<span class="ws-task-section">${task.briefSection}</span>` : nothing}
      <span class=${priorityBadgeClass(task.priority)}>${priorityLabel(task.priority)}</span>
      ${task.dueDate ? html`<span class=${dueDateClass(task.dueDate)}>${formatDueDate(task.dueDate)}</span>` : nothing}
      ${!isComplete && task.queueStatus?.status === "processing"
        ? html`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${task.queueStatus.roleName} working...
          </span>`
        : !isComplete && task.queueStatus?.status === "review" && onStartTask
          ? html`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${() => onStartTask(task.id)}
              title="Review agent output"
            >Review</button>`
          : !isComplete && onStartTask
            ? html`<button
                class="ws-task-start-btn"
                @click=${() => onStartTask(task.id)}
                title="Start working on this task"
              >Start</button>`
            : nothing}
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

// ── Recent files helpers ─────────────────────────────────────────────

const MAX_RECENT_FILES = 10;

function getRecentFilesFromTree(
  nodes: FolderTreeNode[],
  limit = MAX_RECENT_FILES,
): WorkspaceFileEntry[] {
  const files: WorkspaceFileEntry[] = [];
  function walk(list: FolderTreeNode[]) {
    for (const node of list) {
      if (node.type === "file" && node.modified) {
        files.push({
          path: node.path,
          name: node.name,
          type: node.fileType ?? "text",
          size: node.size ?? 0,
          modified: node.modified,
        });
      }
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return files.sort((a, b) => b.modified.getTime() - a.modified.getTime()).slice(0, limit);
}

/** Extract a short description from file content (searchText). */
function extractFileDescription(entry: WorkspaceFileEntry): string | null {
  if (!entry.searchText) return null;
  const text = entry.searchText.trim();
  if (!text) return null;
  // For markdown: try first heading
  const headingMatch = text.match(/#+ (.+?)(?:\s#|$)/);
  if (headingMatch) return headingMatch[1].trim().slice(0, 120);
  // Skip YAML frontmatter marker
  const content = text.startsWith("---") ? text.replace(/^---.*?---\s*/s, "") : text;
  // First 120 chars of content
  return content.slice(0, 120) || null;
}

function getRecentFilesFromOutputs(
  outputs: WorkspaceFileEntry[],
  limit = MAX_RECENT_FILES,
): WorkspaceFileEntry[] {
  return [...outputs]
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .slice(0, limit);
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
  onDelete?: (workspace: WorkspaceSummary) => void,
) {
  return html`
    <div class="workspace-card-wrapper">
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
      ${onDelete
        ? html`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (confirm(`Delete workspace "${workspace.name}"? This removes it from your list but does not delete any files.`)) {
                onDelete(workspace);
              }
            }}
          >&times;</button>`
        : nothing}
    </div>
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

/** Recent file row with description subtitle. */
function renderRecentFileRow(props: {
  workspaceId: string;
  entry: WorkspaceFileEntry;
  pinned: boolean;
  onOpen?: (item: WorkspaceFileEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
}) {
  const { workspaceId, entry, pinned, onOpen, onPinToggle } = props;
  const desc = extractFileDescription(entry);
  return html`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${() => onOpen?.(entry)}>
        <span class="ws-list-icon">${fileIcon(entry.type)}</span>
        <span class="ws-list-title">${entry.name}</span>
        <span class="ws-list-meta">${formatAgo(entry.modified.getTime())}</span>
        ${desc ? html`<span class="ws-list-desc">${desc}</span>` : nothing}
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

function renderBreadcrumbs(
  crumbs: Array<{ name: string; path: string }>,
  onBrowse: (path: string) => void,
) {
  return html`
    <div class="workspace-breadcrumbs">
      ${crumbs.map(
        (c, i) => html`
          ${i > 0 ? html`<span class="breadcrumb-sep">/</span>` : nothing}
          <button
            class="breadcrumb-item ${i === crumbs.length - 1 ? "breadcrumb-current" : ""}"
            @click=${() => onBrowse(c.path)}
          >${c.name}</button>
        `,
      )}
    </div>
  `;
}

function renderWorkspaceBrowser(props: {
  browseEntries?: import("../controllers/workspaces").BrowseEntry[] | null;
  breadcrumbs?: Array<{ name: string; path: string }> | null;
  browseSearchQuery?: string;
  browseSearchResults?: Array<{ path: string; name: string; type: string; excerpt?: string }> | null;
  onBrowseFolder?: (path: string) => void;
  onBrowseSearch?: (query: string) => void;
  onBrowseBack?: () => void;
  onCreateFolder?: (path: string) => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
}) {
  const {
    browseEntries,
    breadcrumbs,
    browseSearchQuery,
    browseSearchResults,
    onBrowseFolder,
    onBrowseSearch,
    onBrowseBack,
    onCreateFolder,
    onItemClick,
  } = props;

  const entries = browseSearchResults ?? browseEntries ?? [];

  return html`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${() => onBrowseBack?.()}>
          &larr; Back
        </button>
        ${breadcrumbs
          ? renderBreadcrumbs(breadcrumbs, (p) => onBrowseFolder?.(p))
          : nothing}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${browseSearchQuery ?? ""}
          @input=${(e: InputEvent) => {
            const target = e.target as HTMLInputElement;
            onBrowseSearch?.(target.value);
          }}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${() => {
            const name = prompt("New folder name:");
            if (name?.trim()) {
              const currentPath = breadcrumbs?.[breadcrumbs.length - 1]?.path ?? ".";
              onCreateFolder?.(`${currentPath}/${name.trim()}`);
            }
          }}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${entries.length === 0
          ? html`<div class="workspace-browse-empty">No files found</div>`
          : entries.map((entry) => html`
              <button
                class="workspace-browse-entry"
                @click=${() => {
                  if (entry.type === "folder") {
                    onBrowseFolder?.(entry.path);
                  } else if (onItemClick) {
                    onItemClick({
                      path: entry.path,
                      name: entry.name,
                      type: (entry as any).fileType ?? "text",
                      size: (entry as any).size ?? 0,
                      modified: new Date(),
                    });
                  }
                }}
              >
                <span class="browse-entry-icon">${entry.type === "folder" ? "\u{1F4C1}" : "\u{1F4C4}"}</span>
                <span class="browse-entry-name">${entry.name}</span>
                ${(entry as any).excerpt
                  ? html`<span class="browse-entry-excerpt">${(entry as any).excerpt}</span>`
                  : nothing}
              </button>
            `)}
      </div>
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
  onStartTask?: (taskId: string) => void;
  editingTaskId?: string | null;
  onEditTask?: (taskId: string | null) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void;
  browsePath?: string | null;
  browseEntries?: import("../controllers/workspaces").BrowseEntry[] | null;
  breadcrumbs?: Array<{ name: string; path: string }> | null;
  browseSearchQuery?: string;
  browseSearchResults?: Array<{ path: string; name: string; type: string; excerpt?: string }> | null;
  onBrowseFolder?: (path: string) => void;
  onBrowseSearch?: (query: string) => void;
  onBrowseBack?: () => void;
  onCreateFolder?: (path: string) => void;
  onBatchPushToDrive?: (filePaths: string[]) => void;
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
    onStartTask,
    editingTaskId,
    onEditTask,
    onUpdateTask,
    onBatchPushToDrive,
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

  // Recent files — always use outputs (which have searchText for descriptions)
  const recentFiles = getRecentFilesFromOutputs(workspace.outputs);
  const showRecentSection = recentFiles.length > 0 && !hasItemSearch;

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
          <button
            class="workspace-browse-btn"
            @click=${() => props.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${props.browsePath != null ? renderWorkspaceBrowser(props) : nothing}

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

        ${renderWorkspaceTasksSection({
          tasks: workspace.tasks ?? [],
          workspaceName: workspace.name,
          showCompleted: showCompletedTasks,
          onToggleTaskComplete,
          onCreateTask,
          onToggleCompletedTasks,
          onStartTask,
          editingTaskId,
          onEditTask,
          onUpdateTask,
        })}

        ${showRecentSection
          ? html`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${recentFiles.length}</span>
                </div>
                <div class="ws-list">
                  ${recentFiles.map((entry) =>
                    renderRecentFileRow({
                      workspaceId: workspace.id,
                      entry,
                      pinned: pinnedFilePaths.has(entry.path),
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
            ${onBatchPushToDrive && filteredArtifacts.length > 0
              ? html`<button class="ws-export-drive-btn" @click=${() => {
                  const paths = filteredArtifacts.map((e) => e.path);
                  onBatchPushToDrive(paths);
                }}>Export to Drive</button>`
              : nothing}
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

        ${(workspace.memory?.length ?? 0) > 0
          ? html`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${workspace.memory!.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${workspace.memory!.map((entry) =>
                    renderSectionFileRow({
                      workspaceId: workspace.id,
                      entry,
                      pinned: pinnedFilePaths.has(entry.path),
                      onOpen: onItemClick,
                      onPinToggle,
                    }),
                  )}
                </div>
              </section>
            `
          : nothing
        }
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
  onStartTask?: (taskId: string) => void;
  editingTaskId?: string | null;
  onEditTask?: (taskId: string | null) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void;
}): ReturnType<typeof html> {
  const {
    tasks, workspaceName, showCompleted, onToggleTaskComplete, onCreateTask,
    onToggleCompletedTasks, onStartTask, editingTaskId, onEditTask, onUpdateTask,
  } = props;
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
        ${pending.map((task) => renderTaskRow(task, onToggleTaskComplete, onStartTask, editingTaskId, onEditTask, onUpdateTask))}
        ${completed.length > 0
          ? html`
              <button class="ws-task-completed-toggle" @click=${() => onToggleCompletedTasks?.()}>
                ${showCompleted ? "Hide" : "Show"} ${completed.length} completed
              </button>
              ${showCompleted ? completed.map((task) => renderTaskRow(task, onToggleTaskComplete, onStartTask, editingTaskId, onEditTask, onUpdateTask)) : nothing}
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
    taskFilter = "outstanding",
    taskSort = "due" as TaskSort,
    showCompletedTasks = false,
    editingTaskId,
    workspaceNames = [],
    onSearch,
    onItemSearch,
    onSelectWorkspace,
    onBack,
    onItemClick,
    onSessionClick,
    onPinToggle,
    onPinSessionToggle,
    onCreateWorkspace,
    onDeleteWorkspace,
    onToggleFolder,
    onTeamSetup,
    onToggleTaskComplete,
    onCreateTask,
    onSetTaskFilter,
    onSetTaskSort,
    onToggleCompletedTasks,
    onStartTask,
    onEditTask,
    onUpdateTask,
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
      onStartTask,
      editingTaskId,
      onEditTask,
      onUpdateTask,
      browsePath: props.browsePath,
      browseEntries: props.browseEntries,
      breadcrumbs: props.breadcrumbs,
      browseSearchQuery: props.browseSearchQuery,
      browseSearchResults: props.browseSearchResults,
      onBrowseFolder: props.onBrowseFolder,
      onBrowseSearch: props.onBrowseSearch,
      onBrowseBack: props.onBrowseBack,
      onCreateFolder: props.onCreateFolder,
      onBatchPushToDrive: props.onBatchPushToDrive,
    });
  }

  return html`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
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
              placeholder="New workspace name (e.g. Acme Corp)"
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
          ${
            onTeamSetup
              ? html`<button class="ws-team-setup-btn" @click=${() => onTeamSetup()}>Team Setup</button>`
              : nothing
          }
      </div>

      ${error ? html`<div class="callout danger" style="margin: 16px;">${error}</div>` : nothing}

      ${
        loading
          ? html`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `
          : html`
              <div class="workspaces-body">
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
                          renderWorkspaceCard(workspace, onSelectWorkspace, onDeleteWorkspace),
                        )
                  }
                </div>

                ${renderAllTasksSection({
                  tasks: allTasks,
                  taskFilter,
                  taskSort,
                  onToggleTaskComplete,
                  onSetTaskFilter,
                  onSetTaskSort,
                  onCreateTask,
                  workspaceNames,
                  onStartTask,
                  editingTaskId,
                  onEditTask,
                  onUpdateTask,
                })}
              </div>
            `
      }
    </div>
  `;
}

function renderAllTasksSection(props: {
  tasks: WorkspaceTask[];
  taskFilter: TaskFilter;
  taskSort?: TaskSort;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onSetTaskFilter?: (filter: TaskFilter) => void;
  onSetTaskSort?: (sort: TaskSort) => void;
  onCreateTask?: (title: string, project: string) => void;
  workspaceNames?: string[];
  onStartTask?: (taskId: string) => void;
  editingTaskId?: string | null;
  onEditTask?: (taskId: string | null) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void;
}): ReturnType<typeof html> {
  const {
    tasks, taskFilter, taskSort = "due", onToggleTaskComplete, onSetTaskFilter, onSetTaskSort,
    onCreateTask, workspaceNames = [], onStartTask, editingTaskId, onEditTask, onUpdateTask,
  } = props;

  if (tasks.length === 0 && !onCreateTask) {
    return html``;
  }

  let filtered: WorkspaceTask[];
  if (taskFilter === "outstanding") {
    filtered = tasks.filter((t) => t.status === "pending");
  } else if (taskFilter === "today") {
    const today = localDateString();
    filtered = tasks.filter((t) => t.status === "pending" && t.dueDate != null && t.dueDate <= today);
  } else if (taskFilter === "complete") {
    filtered = tasks.filter((t) => t.status === "complete");
  } else {
    filtered = tasks;
  }
  const sorted = sortTasks(filtered, taskSort);

  return html`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <h3>All Tasks</h3>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${taskFilter === "all" ? "active" : ""}"
                @click=${() => onSetTaskFilter?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${taskFilter === "outstanding" ? "active" : ""}"
                @click=${() => onSetTaskFilter?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${taskFilter === "today" ? "active" : ""}"
                @click=${() => onSetTaskFilter?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${taskFilter === "complete" ? "active" : ""}"
                @click=${() => onSetTaskFilter?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${taskSort}
              @change=${(e: Event) => onSetTaskSort?.((e.target as HTMLSelectElement).value as TaskSort)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${onCreateTask
          ? html`
              <form
                class="ws-task-create-form"
                @submit=${(e: Event) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const input = form.querySelector(".ws-task-create-input") as HTMLInputElement;
                  const select = form.querySelector(".ws-task-create-project") as HTMLSelectElement | null;
                  const title = input.value.trim();
                  if (!title) return;
                  const project = select?.value || workspaceNames[0] || "";
                  onCreateTask(title, project);
                  input.value = "";
                }}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${workspaceNames.length > 0
                  ? html`
                      <select class="ws-task-create-project">
                        ${workspaceNames.map((name) => html`<option value=${name}>${name}</option>`)}
                      </select>
                    `
                  : nothing}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `
          : nothing}
        <div class="ws-list ws-list--scroll">
          ${sorted.length === 0
            ? html`<div class="ws-empty">No tasks</div>`
            : sorted.map((task) => renderAllTaskRow(task, onToggleTaskComplete, onStartTask, editingTaskId, onEditTask, onUpdateTask))}
        </div>
      </section>
    </div>
  `;
}
