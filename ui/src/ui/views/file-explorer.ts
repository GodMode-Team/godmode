import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { icons } from "../icons";
import type { FileTreeNode } from "../ui-types";

export type FileExplorerProps = {
  open: boolean;
  path: string;
  tree: FileTreeNode[];
  loading: boolean;
  error: string | null;
  selectedFile: string | null;
  expandedPaths: Set<string>;
  onToggle: () => void;
  onPathChange: (path: string) => void;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  onRefresh: () => void;
};

// Check if file was modified recently (within 10 minutes)
function isRecentlyModified(modifiedAt?: number): boolean {
  if (!modifiedAt) {
    return false;
  }
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  return modifiedAt > tenMinutesAgo;
}

function renderTreeNode(
  node: FileTreeNode,
  props: FileExplorerProps,
  depth = 0,
): ReturnType<typeof html> {
  const isExpanded = props.expandedPaths.has(node.path);
  const isSelected = props.selectedFile === node.path;
  const isRecent = isRecentlyModified(node.modifiedAt);
  const indent = depth * 12;

  if (node.type === "directory") {
    return html`
      <div class="explorer-item explorer-folder">
        <button
          class="explorer-item__row ${isExpanded ? "expanded" : ""}"
          style="padding-left: ${indent + 4}px"
          @click=${() => props.onToggleFolder(node.path)}
          title=${node.path}
        >
          <span class="explorer-item__chevron">
            ${isExpanded ? icons.chevronDown : icons.chevronRight}
          </span>
          <span class="explorer-item__icon">
            ${isExpanded ? icons.folderOpen : icons.folder}
          </span>
          <span class="explorer-item__name">${node.name}</span>
          ${
            isRecent
              ? html`
                  <span class="explorer-item__recent"></span>
                `
              : nothing
          }
        </button>
        ${
          isExpanded && node.children
            ? html`
              <div class="explorer-children">
                ${repeat(
                  node.children,
                  (child) => child.path,
                  (child) => renderTreeNode(child, props, depth + 1),
                )}
              </div>
            `
            : nothing
        }
      </div>
    `;
  }

  return html`
    <button
      class="explorer-item explorer-file ${isSelected ? "selected" : ""}"
      style="padding-left: ${indent + 20}px"
      @click=${() => props.onSelectFile(node.path)}
      title=${node.path}
    >
      <span class="explorer-item__icon">${icons.file}</span>
      <span class="explorer-item__name">${node.name}</span>
      ${
        isRecent
          ? html`
              <span class="explorer-item__recent"></span>
            `
          : nothing
      }
    </button>
  `;
}

export function renderFileExplorer(props: FileExplorerProps) {
  return html`
    <aside class="explorer ${props.open ? "explorer--open" : ""}">
      <div class="explorer-header">
        <span class="explorer-title">Explorer</span>
        <div class="explorer-actions">
          <button
            class="explorer-action"
            @click=${props.onRefresh}
            title="Refresh"
            ?disabled=${props.loading}
          >
            ${icons.loader}
          </button>
          <button
            class="explorer-action"
            @click=${props.onToggle}
            title="Close explorer"
          >
            ${icons.panelLeftClose}
          </button>
        </div>
      </div>
      <div class="explorer-path">
        <input
          type="text"
          class="explorer-path__input"
          .value=${props.path}
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            props.onPathChange(input.value);
          }}
          placeholder="~/godmode"
        />
      </div>
      <div class="explorer-tree">
        ${
          props.loading
            ? html`<div class="explorer-loading">${icons.loader} Loading...</div>`
            : props.error
              ? html`<div class="explorer-error">${props.error}</div>`
              : props.tree.length === 0
                ? html`
                    <div class="explorer-empty">No files found</div>
                  `
                : repeat(
                    props.tree,
                    (node) => node.path,
                    (node) => renderTreeNode(node, props),
                  )
        }
      </div>
    </aside>
  `;
}

export function renderExplorerToggle(open: boolean, onToggle: () => void): ReturnType<typeof html> {
  return html`
    <button
      class="explorer-toggle ${open ? "explorer-toggle--active" : ""}"
      @click=${onToggle}
      title="${open ? "Close explorer" : "Open explorer"}"
    >
      ${icons.panelLeft}
    </button>
  `;
}
