import { html, nothing } from "lit";

// ===== Resource Types =====

export type ResourceType =
  | "html_report"
  | "plan"
  | "analysis"
  | "code"
  | "doc"
  | "data"
  | "image"
  | "script";

export type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  path?: string;
  url?: string;
  sessionKey: string;
  createdAt: string;
  pinned: boolean;
  summary?: string;
  tags?: string[];
};

export type ResourceFilter = "all" | "pinned" | "html_report" | "plan" | "code" | "recent";

// ===== Types =====

export type ProjectTask = {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
};

export type ProjectOutput = {
  id: string;
  title: string;
  url?: string;
  type: string;
};

export type Project = {
  id: string;
  name: string;
  emoji: string;
  folder?: string | null;
  tasks: ProjectTask[];
  outputs: ProjectOutput[];
  people: string[];
  skills: string[];
  automations?: string[];
  status: "active" | "archived" | "paused";
};

export type WorkspaceFile = {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  modifiedAt?: number;
  children?: WorkspaceFile[];
};

export type WorkProps = {
  connected: boolean;
  projects: Project[];
  loading?: boolean;
  error?: string | null;
  expandedProjects?: Set<string>;
  projectFiles?: Record<string, unknown[]>;
  detailLoading?: Set<string>;
  onRefresh?: () => void;
  onToggleProject?: (projectId: string) => void;
  onPersonClick?: (personId: string) => void;
  onFileClick?: (path: string) => void;
  onSkillClick?: (skill: string, projectName: string) => void;
  // Resources
  resources?: Resource[];
  resourcesLoading?: boolean;
  resourceFilter?: ResourceFilter;
  onResourceFilterChange?: (filter: ResourceFilter) => void;
  onResourceClick?: (resource: Resource) => void;
  onResourcePin?: (id: string, pinned: boolean) => void;
  onResourceDelete?: (id: string) => void;
};

// ===== Workspace Files (flat, capped) =====

/** Max files to show per project card (client-side safety net) */
const MAX_DISPLAY_FILES = 20;

/** File extension icon mapping */
function fileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md":
      return "📝";
    case "html":
      return "🌐";
    case "json":
    case "yaml":
    case "yml":
    case "toml":
      return "⚙️";
    case "ts":
    case "js":
    case "py":
    case "sh":
    case "rs":
    case "go":
      return "💻";
    case "css":
      return "🎨";
    default:
      return "📄";
  }
}

/**
 * Flatten a potentially nested file tree into a flat list, capped at MAX_DISPLAY_FILES.
 */
function flattenFiles(items: unknown[], limit = MAX_DISPLAY_FILES): WorkspaceFile[] {
  const flat: WorkspaceFile[] = [];

  function walk(nodes: unknown[]) {
    for (const node of nodes) {
      if (flat.length >= limit) {
        return;
      }
      const item = node as WorkspaceFile;
      if (item.type === "file") {
        flat.push(item);
      } else if (item.type === "directory" && item.children) {
        walk(item.children);
      }
    }
  }

  walk(items);
  return flat;
}

/** Max recent files to show */
const MAX_RECENT_FILES = 8;

/**
 * Flatten ALL files from a nested tree (no cap) and return sorted by modifiedAt descending.
 */
function getRecentFiles(items: unknown[]): WorkspaceFile[] {
  const flat = flattenFiles(items, 500);
  return flat
    .filter((f) => f.modifiedAt != null)
    .sort((a, b) => (b.modifiedAt ?? 0) - (a.modifiedAt ?? 0))
    .slice(0, MAX_RECENT_FILES);
}

/** Format a relative time like "2h ago", "3d ago" */
function relativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function renderRecentFiles(files: unknown[], onFileClick?: (path: string) => void) {
  if (!files || files.length === 0) return nothing;

  const recent = getRecentFiles(files);
  if (recent.length === 0) return nothing;

  return html`
    <div class="work-section">
      <div class="work-section-label">Recent</div>
      <div class="work-file-list">
        ${recent.map(
          (item) => html`
          <button
            class="work-file-item"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (item.path && onFileClick) onFileClick(item.path);
            }}
          >
            <span class="work-file-icon">${fileIcon(item.name)}</span>
            <span class="work-file-name">${item.name}</span>
            <span class="work-file-meta">${item.modifiedAt ? relativeTime(item.modifiedAt) : ""}</span>
          </button>
        `,
        )}
      </div>
    </div>
  `;
}

function renderWorkspaceFiles(files: unknown[], onFileClick?: (path: string) => void) {
  if (!files || files.length === 0) {
    return nothing;
  }

  const flat = flattenFiles(files);
  if (flat.length === 0) {
    return nothing;
  }

  return html`
    <div class="work-file-list">
      ${flat.map(
        (item) => html`
        <button
          class="work-file-item"
          @click=${(e: Event) => {
            e.stopPropagation();
            if (item.path && onFileClick) {
              onFileClick(item.path);
            }
          }}
        >
          <span class="work-file-icon">${fileIcon(item.name)}</span>
          <span class="work-file-name">${item.name}</span>
          ${
            item.size != null
              ? html`<span class="work-file-meta">${(item.size / 1024).toFixed(1)}KB</span>`
              : nothing
          }
        </button>
      `,
      )}
      ${
        (files as WorkspaceFile[]).length > flat.length
          ? html`<div class="work-file-overflow">+${(files as WorkspaceFile[]).length - flat.length} more files</div>`
          : nothing
      }
    </div>
  `;
}

// ===== Project Card =====

function renderProjectCard(
  project: Project,
  isExpanded: boolean,
  projectFiles: unknown[],
  isDetailLoading: boolean,
  onToggle?: () => void,
  onPersonClick?: (personId: string) => void,
  onFileClick?: (path: string) => void,
  onSkillClick?: (skill: string, projectName: string) => void,
) {
  return html`
    <div class="my-day-card work-project ${isExpanded ? "expanded" : ""}">
      <button class="my-day-card-header" @click=${onToggle} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">${project.emoji}</span>
          <span>${project.name}</span>
          ${
            project.folder
              ? html`<span class="work-folder-badge">${project.folder}</span>`
              : nothing
          }
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--mc-text-muted);">${isExpanded ? "▼" : "▶"}</span>
        </div>
      </button>
      ${
        isExpanded
          ? html`
            <div class="my-day-card-content">
              ${
                isDetailLoading
                  ? html`
                      <div class="work-detail-loading">
                        <div class="spinner" style="width: 16px; height: 16px"></div>
                        Loading...
                      </div>
                    `
                  : nothing
              }
              ${projectFiles.length > 0 ? renderRecentFiles(projectFiles, onFileClick) : nothing}
              ${
                projectFiles.length > 0
                  ? html`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${renderWorkspaceFiles(projectFiles, onFileClick)}
                    </div>
                  `
                  : project.outputs.length > 0
                    ? html`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${renderLegacyFileTree(project.outputs)}
                      </div>
                    `
                    : nothing
              }
              ${
                project.people.length > 0
                  ? html`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${project.people.map(
                          (personId) => html`
                            <button
                              class="work-person-chip"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                onPersonClick?.(personId);
                              }}
                            >
                              ${personId}
                            </button>
                          `,
                        )}
                      </div>
                    </div>
                  `
                  : nothing
              }
              ${
                project.skills.length > 0
                  ? html`
                    <div class="work-section">
                      <div class="work-section-label">Skills</div>
                      <div class="work-skills">
                        ${project.skills.map(
                          (skill) => html`
                            <button
                              class="work-skill-chip"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                onSkillClick?.(skill, project.name);
                              }}
                            >
                              ${skill}
                            </button>`,
                        )}
                      </div>
                    </div>
                  `
                  : nothing
              }
              ${
                project.automations && project.automations.length > 0
                  ? html`
                    <div class="work-section">
                      <div class="work-section-label">Automations</div>
                      <div class="work-skills">
                        ${project.automations.map(
                          (auto) => html`<span class="work-skill-chip">${auto}</span>`,
                        )}
                      </div>
                    </div>
                  `
                  : nothing
              }
            </div>
          `
          : nothing
      }
    </div>
  `;
}

// Legacy file tree for projects without folder
function renderLegacyFileTree(outputs: ProjectOutput[]) {
  const groupedOutputs = outputs.reduce(
    (acc, output) => {
      const type = output.type || "other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(output);
      return acc;
    },
    {} as Record<string, ProjectOutput[]>,
  );

  const iconMap: Record<string, string> = {
    document: "📄",
    template: "📋",
    report: "📊",
    presentation: "📽️",
    spreadsheet: "📈",
    code: "💻",
    image: "🖼️",
    video: "🎬",
    audio: "🎵",
    archive: "📦",
    pdf: "📕",
    markdown: "📝",
  };

  return html`
    <div class="work-file-tree">
      ${Object.entries(groupedOutputs).map(
        ([type, items]) => html`
        <div class="work-folder">
          <span class="work-folder-icon">📁</span>
          <span class="work-folder-name">${type}</span>
          <span class="work-file-meta">${items.length} ${items.length === 1 ? "item" : "items"}</span>
        </div>
        ${items.map(
          (output) => html`
          <div class="work-file type-${type}">
            <span class="work-file-icon">${iconMap[type.toLowerCase()] || "📄"}</span>
            ${
              output.url
                ? html`<a href="${output.url}" target="_blank" rel="noopener noreferrer" class="work-file-name">${output.title}</a>`
                : html`<span class="work-file-name">${output.title}</span>`
            }
          </div>
        `,
        )}
      `,
      )}
    </div>
  `;
}

// ===== Resources Section =====

const RESOURCE_ICONS: Record<string, string> = {
  html_report: "📊",
  plan: "📋",
  analysis: "🔍",
  code: "💻",
  doc: "📝",
  data: "📦",
  image: "🖼️",
  script: "⚙️",
};

const RESOURCE_FILTERS: { key: ResourceFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pinned", label: "Pinned" },
  { key: "html_report", label: "Reports" },
  { key: "plan", label: "Plans" },
  { key: "code", label: "Code" },
  { key: "recent", label: "Recent" },
];

function filterResources(resources: Resource[], filter: ResourceFilter): Resource[] {
  switch (filter) {
    case "pinned":
      return resources.filter((r) => r.pinned);
    case "html_report":
    case "plan":
    case "code":
      return resources.filter((r) => r.type === filter);
    case "recent": {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return resources.filter((r) => new Date(r.createdAt).getTime() > cutoff);
    }
    default:
      return resources;
  }
}

function renderResourceCard(
  resource: Resource,
  onClick?: (resource: Resource) => void,
  onPin?: (id: string, pinned: boolean) => void,
  onDelete?: (id: string) => void,
) {
  const icon = RESOURCE_ICONS[resource.type] || "📄";
  const date = new Date(resource.createdAt);
  const dateStr = relativeTime(date.getTime());

  return html`
    <div class="resource-card">
      <button
        class="resource-card-main"
        @click=${() => onClick?.(resource)}
        title=${resource.summary || resource.title}
      >
        <span class="resource-card-icon">${icon}</span>
        <div class="resource-card-info">
          <span class="resource-card-title">${resource.title}</span>
          <span class="resource-card-meta">
            <span class="resource-type-badge">${resource.type.replace("_", " ")}</span>
            <span>${dateStr}</span>
          </span>
        </div>
      </button>
      <div class="resource-card-actions">
        <button
          class="resource-action-btn${resource.pinned ? " pinned" : ""}"
          title=${resource.pinned ? "Unpin" : "Pin"}
          @click=${(e: Event) => {
            e.stopPropagation();
            onPin?.(resource.id, !resource.pinned);
          }}
        >${resource.pinned ? "★" : "☆"}</button>
        <button
          class="resource-action-btn delete"
          title="Delete"
          @click=${(e: Event) => {
            e.stopPropagation();
            onDelete?.(resource.id);
          }}
        >×</button>
      </div>
    </div>
  `;
}

function renderResourcesSection(props: WorkProps) {
  const {
    resources = [],
    resourcesLoading,
    resourceFilter = "all",
    onResourceFilterChange,
    onResourceClick,
    onResourcePin,
    onResourceDelete,
  } = props;

  const filtered = filterResources(resources, resourceFilter);

  // Sort: pinned first, then newest
  filtered.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return html`
    <div class="work-workspaces-section">
      <h2 class="work-section-title">Resources</h2>

      <div class="resource-filter-strip">
        ${RESOURCE_FILTERS.map(
          (f) => html`
            <button
              class="resource-filter-btn${resourceFilter === f.key ? " active" : ""}"
              @click=${() => onResourceFilterChange?.(f.key)}
            >${f.label}</button>
          `,
        )}
      </div>

      ${resourcesLoading
        ? html`<div class="work-detail-loading">
            <div class="spinner" style="width: 16px; height: 16px"></div>
            Loading resources...
          </div>`
        : filtered.length === 0
          ? html`<div class="my-day-card">
              <div class="my-day-card-content">
                <div class="my-day-empty">
                  No resources yet. Resources are created automatically when the ally generates reports, plans, or docs.
                </div>
              </div>
            </div>`
          : html`<div class="resource-grid">
              ${filtered.map((r) => renderResourceCard(r, onResourceClick, onResourcePin, onResourceDelete))}
            </div>`
      }
    </div>
  `;
}

// ===== Main Render Function =====

export function renderWork(props: WorkProps) {
  const {
    projects,
    loading,
    error,
    expandedProjects = new Set(),
    projectFiles = {},
    detailLoading = new Set(),
    onRefresh,
    onToggleProject,
    onPersonClick,
    onFileClick,
    onSkillClick,
  } = props;

  if (loading) {
    return html`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading workspace...</span>
        </div>
      </div>
    `;
  }

  if (error) {
    return html`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${error}</span>
          ${
            onRefresh
              ? html`<button class="retry-button" @click=${onRefresh}>Retry</button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  const activeProjects = projects.filter((p) => p.status === "active");
  const archivedProjects = projects.filter((p) => p.status === "archived");

  return html`
    <div class="my-day-container">
      <div class="my-day-toolbar">
        <div class="my-day-summary-stat">
          <span class="summary-value">${activeProjects.length}</span>
          <span class="summary-label">Projects</span>
        </div>
        ${
          onRefresh
            ? html`<button class="my-day-refresh-btn" @click=${onRefresh} title="Refresh">↻</button>`
            : nothing
        }
      </div>

      <!-- Resources Section -->
      ${renderResourcesSection(props)}

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${
            activeProjects.length === 0 && archivedProjects.length === 0
              ? html`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `
              : nothing
          }
          ${activeProjects.map((project) =>
            renderProjectCard(
              project,
              expandedProjects.has(project.id),
              projectFiles[project.id] ?? [],
              detailLoading.has(project.id),
              () => onToggleProject?.(project.id),
              onPersonClick,
              onFileClick,
              onSkillClick,
            ),
          )}
          ${
            archivedProjects.length > 0
              ? html`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${archivedProjects.length} archived project${archivedProjects.length !== 1 ? "s" : ""}
                </div>
              `
              : nothing
          }
        </div>
      </div>
    </div>
  `;
}
