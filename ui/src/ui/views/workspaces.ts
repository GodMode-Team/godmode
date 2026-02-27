import { html, nothing } from "lit";
import { formatAgo } from "../format";

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
};

export type WorkspaceCreateRequest = {
  name: string;
  type: "personal" | "project" | "team";
  path?: string;
};

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

function renderFolderNode(
  node: FolderTreeNode,
  depth: number,
  expandedFolders: Set<string>,
  onToggleFolder?: (path: string) => void,
  onItemClick?: (item: WorkspaceFileEntry) => void,
): ReturnType<typeof html> {
  if (node.type === "file") {
    return html`
      <button
        class="ws-folder-file"
        style="padding-left: ${12 + depth * 16}px"
        @click=${() =>
          onItemClick?.({
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
      </button>
    `;
  }

  const isExpanded = expandedFolders.has(node.path);
  const children = node.children ?? [];

  return html`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12 + depth * 16}px"
        @click=${() => onToggleFolder?.(node.path)}
      >
        <span class="ws-folder-chevron ${isExpanded ? "expanded" : ""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${node.name}</span>
        <span class="ws-list-meta">${children.length}</span>
      </button>
      ${isExpanded
        ? html`
            <div class="ws-folder-children">
              ${children.map((child) =>
                renderFolderNode(child, depth + 1, expandedFolders, onToggleFolder, onItemClick),
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
  onItemSearch?: (query: string) => void;
  onBack?: () => void;
  onItemClick?: (item: WorkspaceFileEntry) => void;
  onSessionClick?: (session: WorkspaceSessionEntry) => void;
  onPinToggle?: (workspaceId: string, filePath: string, pinned: boolean) => void;
  onPinSessionToggle?: (workspaceId: string, sessionKey: string, pinned: boolean) => void;
  onToggleFolder?: (folderPath: string) => void;
}) {
  const {
    workspace,
    itemSearchQuery,
    expandedFolders = new Set<string>(),
    onItemSearch,
    onBack,
    onItemClick,
    onSessionClick,
    onPinToggle,
    onPinSessionToggle,
    onToggleFolder,
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
  const hasItemSearch = itemSearchQuery.trim().length > 0;
  const showPinnedSection = filteredPinned.length > 0 || filteredPinnedSessions.length > 0;
  const showSessionsSection =
    filteredSessions.length > 0 || workspace.sessions.length === 0 || hasItemSearch;

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
                      renderFolderNode(node, 0, expandedFolders, onToggleFolder, onItemClick),
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
      </div>
    </div>
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
  } = props;

  const filteredWorkspaces = workspaces.filter((workspace) =>
    matchesQuery(searchQuery, `${workspace.name} ${workspace.path} ${workspace.type}`),
  );

  if (selectedWorkspace) {
    return renderWorkspaceDetail({
      workspace: selectedWorkspace,
      itemSearchQuery: itemSearchQuery ?? "",
      expandedFolders,
      onItemSearch,
      onBack,
      onItemClick,
      onSessionClick,
      onPinToggle,
      onPinSessionToggle,
      onToggleFolder,
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
            `
      }
    </div>
  `;
}
