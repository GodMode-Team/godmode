import { html, nothing } from "lit";

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
function flattenFiles(items: unknown[]): WorkspaceFile[] {
  const flat: WorkspaceFile[] = [];

  function walk(nodes: unknown[]) {
    for (const node of nodes) {
      if (flat.length >= MAX_DISPLAY_FILES) {
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
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Work</h1>
          <p class="my-day-subtitle">Your projects and workspaces.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${activeProjects.length}</span>
            <span class="summary-label">Projects</span>
          </div>
          ${
            onRefresh
              ? html`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${onRefresh} title="Refresh">↻</button>
              `
              : nothing
          }
        </div>
      </div>

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
