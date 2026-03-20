/**
 * <gm-second-brain> — Second Brain tab component.
 *
 * Owns all 20 Second Brain @state properties (moved out of the God Component).
 * Consumes AppContext for shared state (connected, gateway, sidebar, toast, nav).
 * Render functions and types are inlined (merged from views/second-brain.ts).
 * Data loading delegated to ../controllers/second-brain.js.
 * Cross-tab actions (save via chat, add source) go through the event bus.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { formatAgo } from "../format.js";
import {
  loadSecondBrain,
  loadSecondBrainEntry,
  browseFolder,
  syncSecondBrain,
  type SecondBrainState,
} from "../controllers/second-brain.js";

// ── Types ────────────────────────────────────────────────────────────

export type SecondBrainFileData = {
  content: string | null;
  updatedAt: string | null;
};

export type SecondBrainIdentityFile = {
  key: string;
  label: string;
  content: string;
  updatedAt: string | null;
};

export type SecondBrainIdentityData = {
  files: SecondBrainIdentityFile[];
};

export type SecondBrainMemoryEntry = {
  name: string;
  path: string;
  updatedAt: string | null;
  excerpt: string;
  size: number;
  isDirectory?: boolean;
  childCount?: number;
};

export type SecondBrainMemorySection = {
  key: string;
  label: string;
  icon: string;
  path: string;
  entries: SecondBrainMemoryEntry[];
};

export type SecondBrainMemoryBankData = {
  sections: SecondBrainMemorySection[];
  curated: {
    content: string;
    updatedAt: string | null;
    totalLength: number;
  } | null;
  extraFiles: SecondBrainMemoryEntry[];
  totalEntries: number;
};

export type SecondBrainAiPacketData = {
  snapshot: {
    content: string;
    updatedAt?: string | null;
    lineCount: number;
  } | null;
};

export type SecondBrainEntryDetail = {
  name: string;
  content: string;
  updatedAt: string | null;
  relativePath?: string;
};

export type SecondBrainSourceEntry = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "available";
  icon: string;
  description: string;
  stats?: string;
  lastSync?: string | null;
};

export type SecondBrainSourcesData = {
  sources: SecondBrainSourceEntry[];
  connectedCount: number;
  totalCount: number;
};

export type SecondBrainSubtab = "identity" | "knowledge" | "context";

export type BrainTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  size?: number;
  updatedAt?: string;
  childCount?: number;
  children?: BrainTreeNode[];
};

export type BrainSearchResult = {
  path: string;
  name: string;
  type: string;
  excerpt?: string;
  matchContext?: string;
};

export type ResearchFrontmatter = {
  title?: string;
  url?: string;
  category?: string;
  tags?: string[];
  date?: string;
  source?: string;
};

export type ResearchEntry = SecondBrainMemoryEntry & {
  frontmatter?: ResearchFrontmatter;
};

export type ResearchCategory = {
  key: string;
  label: string;
  path: string;
  entries: ResearchEntry[];
};

export type SecondBrainResearchData = {
  categories: ResearchCategory[];
  totalEntries: number;
};

export type VaultHealthData = {
  available: boolean;
  vaultPath: string | null;
  migrated: boolean;
  stats: {
    totalNotes: number;
    inboxCount: number;
    brainCount: number;
    discoveryCount: number;
    projectCount: number;
    resourceCount: number;
    dailyCount: number;
    lastActivity: string | null;
  } | null;
  recentActivity: Array<{ name: string; path: string; updatedAt: string; folder: string }>;
};

export type SecondBrainProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  subtab: SecondBrainSubtab;
  // Identity
  identity?: SecondBrainIdentityData | null;
  // Knowledge (merged memory bank + research + files)
  memoryBank?: SecondBrainMemoryBankData | null;
  researchData?: SecondBrainResearchData | null;
  fileTree?: BrainTreeNode[] | null;
  fileTreeLoading?: boolean;
  fileSearchQuery?: string;
  fileSearchResults?: BrainSearchResult[] | null;
  selectedEntry?: SecondBrainEntryDetail | null;
  searchQuery?: string;
  browsingFolder?: string | null;
  folderEntries?: SecondBrainMemoryEntry[] | null;
  folderName?: string | null;
  // Context (merged ai packet + sources + vault health)
  aiPacket?: SecondBrainAiPacketData | null;
  sourcesData?: SecondBrainSourcesData | null;
  vaultHealth?: VaultHealthData | null;
  syncing?: boolean;
  // Callbacks
  onSubtabChange: (subtab: SecondBrainSubtab) => void;
  onSelectEntry: (path: string) => void;
  onBrowseFolder: (path: string) => void;
  onBack: () => void;
  onSearch: (query: string) => void;
  onFileSearch?: (query: string) => void;
  onFileSelect?: (path: string) => void;
  onSync: () => void;
  onRefresh: () => void;
  onSaveViaChat: () => void;
  onAddSource: () => void;
};

// ── Render Helpers ───────────────────────────────────────────────────

function fmtUpdated(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try {
    return formatAgo(new Date(isoString).getTime());
  } catch {
    return "";
  }
}

function renderMd(content: string) {
  return html`<div class="second-brain-md-body">${unsafeHTML(toSanitizedMarkdownHtml(content))}</div>`;
}

// ── Identity Panel ───────────────────────────────────────────────────

function renderIdentityPanel(props: SecondBrainProps) {
  const { identity } = props;
  if (!identity || identity.files.length === 0) {
    return html`
      <div class="second-brain-panel">
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F464}</div>
          <div class="second-brain-empty-title">No identity files found</div>
          <div class="second-brain-empty-hint">Tell your ally about yourself to start building your profile. Your identity helps the ally personalize everything.</div>
          <button class="sb-chat-btn" @click=${() => props.onSaveViaChat()} style="margin-top: 12px;">
            Tell your ally about you
          </button>
        </div>
      </div>
    `;
  }

  return html`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 4px;">
        <button class="sb-chat-btn" @click=${() => props.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>

      <div class="second-brain-entry-list">
        ${identity.files.map((file) => html`
          <div class="second-brain-entry" @click=${() => props.onSelectEntry(file.key)}>
            <div class="second-brain-entry-icon">\u{1F4C4}</div>
            <div class="second-brain-entry-body">
              <div class="second-brain-entry-name">${file.label}</div>
              <div class="second-brain-entry-excerpt">${file.content.slice(0, 120).replace(/[#\n]+/g, " ").trim()}\u{2026}</div>
            </div>
            ${file.updatedAt ? html`<div class="second-brain-entry-meta">${fmtUpdated(file.updatedAt)}</div>` : nothing}
          </div>
        `)}
      </div>
    </div>
  `;
}

// ── Entry Row ────────────────────────────────────────────────────────

function renderEntryRow(entry: SecondBrainMemoryEntry, props: SecondBrainProps) {
  const isDir = entry.isDirectory;
  const icon = isDir ? "\u{1F4C1}" : "\u{1F4C4}";
  const handleClick = () => {
    if (isDir) {
      props.onBrowseFolder(entry.path);
    } else {
      props.onSelectEntry(entry.path);
    }
  };

  return html`
    <div class="second-brain-entry" @click=${handleClick}>
      <div class="second-brain-entry-icon ${isDir ? "second-brain-entry-icon--folder" : ""}">${icon}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${entry.name}${isDir ? "/" : ""}</div>
        ${entry.excerpt ? html`<div class="second-brain-entry-excerpt">${entry.excerpt}</div>` : nothing}
      </div>
      ${entry.updatedAt ? html`<div class="second-brain-entry-meta">${fmtUpdated(entry.updatedAt)}</div>` : nothing}
    </div>
  `;
}

// ── Research Entry Row ───────────────────────────────────────────────

function renderResearchEntryRow(entry: ResearchEntry, props: SecondBrainProps) {
  const isDir = entry.isDirectory;
  const icon = isDir ? "\u{1F4C1}" : "\u{1F4D1}";
  const handleClick = () => {
    if (isDir) {
      props.onBrowseFolder(entry.path);
    } else {
      props.onSelectEntry(entry.path);
    }
  };
  const displayName = entry.frontmatter?.title || entry.name;

  return html`
    <div class="second-brain-entry" @click=${handleClick}>
      <div class="second-brain-entry-icon ${isDir ? "second-brain-entry-icon--folder" : ""}">${icon}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${displayName}${isDir ? "/" : ""}</div>
        ${entry.frontmatter?.url ? html`<div class="second-brain-research-url">${entry.frontmatter.url}</div>` : nothing}
        ${entry.excerpt && !isDir ? html`<div class="second-brain-entry-excerpt">${entry.excerpt}</div>` : nothing}
        ${entry.frontmatter?.tags?.length ? html`
          <div class="second-brain-research-tags">
            ${entry.frontmatter.tags.map(t => html`<span class="second-brain-research-tag">${t}</span>`)}
          </div>
        ` : nothing}
      </div>
      ${entry.updatedAt ? html`<div class="second-brain-entry-meta">${fmtUpdated(entry.updatedAt)}</div>` : nothing}
    </div>
  `;
}

// ── File Tree ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

function renderFileTree(
  nodes: BrainTreeNode[],
  props: SecondBrainProps,
  depth = 0,
) {
  return html`
    <div class="sb-file-tree" style="padding-left: ${depth * 16}px">
      ${nodes.map((node) => {
        if (node.type === "folder") {
          return html`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${node.name}</span>
                ${node.childCount != null
                  ? html`<span class="sb-tree-count">${node.childCount}</span>`
                  : nothing}
              </summary>
              ${node.children
                ? renderFileTree(node.children, props, depth + 1)
                : nothing}
            </details>
          `;
        }
        return html`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${() => props.onFileSelect?.(node.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${node.name}</span>
            ${node.size != null
              ? html`<span class="sb-tree-size">${formatFileSize(node.size)}</span>`
              : nothing}
          </button>
        `;
      })}
    </div>
  `;
}

// ── Memory Bank Panel ────────────────────────────────────────────────

function renderMemoryBankPanel(props: SecondBrainProps) {
  const { memoryBank, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Browsing a subfolder
  if (browsingFolder && folderEntries) {
    return html`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${folderName ?? "Folder"}</span>
            <span class="second-brain-section-count">${folderEntries.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${folderEntries.length > 0
              ? folderEntries.map((e) => renderEntryRow(e, props))
              : html`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;
  }

  if (!memoryBank) {
    return renderEmpty(
      "No memory bank files found",
      "Start building your memory bank by telling your ally about the people, companies, and projects in your life.",
    );
  }

  const query = (searchQuery ?? "").toLowerCase().trim();
  const filterEntries = (entries: SecondBrainMemoryEntry[]) =>
    query
      ? entries.filter(
          (e) => e.name.toLowerCase().includes(query) || e.excerpt.toLowerCase().includes(query),
        )
      : entries;

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search people, companies, projects..."
          .value=${searchQuery ?? ""}
          @input=${(e: Event) => props.onSearch((e.target as HTMLInputElement).value)}
        />
        <span class="second-brain-search-count">${memoryBank.totalEntries} entries</span>
      </div>

      ${memoryBank.sections.map((section) => {
        const filtered = filterEntries(section.entries);
        if (section.entries.length === 0) return nothing;
        return html`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">${section.icon} ${section.label}</span>
              <span class="second-brain-section-count">${section.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${filtered.length > 0
                ? filtered.map((e) => renderEntryRow(e, props))
                : query
                  ? html`<div class="second-brain-empty-inline">No matches</div>`
                  : nothing}
            </div>
          </div>
        `;
      })}

      ${memoryBank.extraFiles.length > 0 ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
            <span class="second-brain-section-count">${memoryBank.extraFiles.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${memoryBank.extraFiles.map((e) => renderEntryRow(e, props))}
          </div>
        </div>
      ` : nothing}

      ${memoryBank.curated ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
            <span class="second-brain-section-count">${fmtUpdated(memoryBank.curated.updatedAt)}</span>
          </div>
          <div class="second-brain-card">
            <div class="second-brain-card-content">${renderMd(memoryBank.curated.content)}</div>
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Knowledge Panel (unified: Memory Bank + Research + Files) ────────

function renderKnowledgePanel(props: SecondBrainProps) {
  const { memoryBank, researchData, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Browsing a subfolder
  if (browsingFolder && folderEntries) {
    return html`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${folderName ?? "Folder"}</span>
            <span class="second-brain-section-count">${folderEntries.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${folderEntries.length > 0
              ? folderEntries.map((e) => renderEntryRow(e, props))
              : html`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;
  }

  const hasContent = (memoryBank && memoryBank.totalEntries > 0) ||
    (researchData && researchData.totalEntries > 0) ||
    (props.fileTree && props.fileTree.length > 0);

  if (!hasContent) {
    return renderEmpty(
      "No knowledge found",
      "Start building your second brain by telling your ally about the people, companies, and projects in your life.",
    );
  }

  // Search bar + file search results
  const query = (searchQuery ?? "").toLowerCase().trim();
  const filterMemoryEntries = (entries: SecondBrainMemoryEntry[]) =>
    query
      ? entries.filter(
          (e) => e.name.toLowerCase().includes(query) || e.excerpt.toLowerCase().includes(query),
        )
      : entries;

  // File search results (from secondBrain.search)
  const fileSearchResults = props.fileSearchResults;

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-search knowledge-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search your second brain..."
          .value=${searchQuery ?? ""}
          @input=${(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            props.onSearch(val);
            props.onFileSearch?.(val);
          }}
        />
      </div>

      ${fileSearchResults && query ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F50D} Search Results</span>
            <span class="second-brain-section-count">${fileSearchResults.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${fileSearchResults.length > 0
              ? fileSearchResults.map((r) => html`
                  <div class="second-brain-entry" @click=${() => props.onFileSelect?.(r.path)}>
                    <div class="second-brain-entry-icon">${r.type === "folder" ? "\u{1F4C1}" : "\u{1F4C4}"}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${r.name}</div>
                      ${r.matchContext || r.excerpt
                        ? html`<div class="second-brain-entry-excerpt">${r.matchContext ?? r.excerpt}</div>`
                        : nothing}
                    </div>
                  </div>
                `)
              : html`<div class="second-brain-empty-inline">No results</div>`}
          </div>
        </div>
      ` : nothing}

      ${!query && memoryBank ? html`
        ${memoryBank.sections.map((section) => {
          const filtered = filterMemoryEntries(section.entries);
          if (section.entries.length === 0) return nothing;
          return html`
            <details class="second-brain-section-details">
              <summary class="second-brain-section-header second-brain-section-header--toggle">
                <span class="second-brain-section-title">${section.icon} ${section.label}</span>
                <span class="second-brain-section-count">${section.entries.length}</span>
              </summary>
              <div class="second-brain-entry-list">
                ${filtered.length > 0
                  ? filtered.map((e) => renderEntryRow(e, props))
                  : query
                    ? html`<div class="second-brain-empty-inline">No matches</div>`
                    : nothing}
              </div>
            </details>
          `;
        })}

        ${memoryBank.extraFiles.length > 0 ? html`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
              <span class="second-brain-section-count">${memoryBank.extraFiles.length}</span>
            </summary>
            <div class="second-brain-entry-list">
              ${memoryBank.extraFiles.map((e) => renderEntryRow(e, props))}
            </div>
          </details>
        ` : nothing}

        ${memoryBank.curated ? html`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
              <span class="second-brain-section-count">${fmtUpdated(memoryBank.curated.updatedAt)}</span>
            </summary>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${renderMd(memoryBank.curated.content)}</div>
            </div>
          </details>
        ` : nothing}
      ` : nothing}

      ${!query && researchData && researchData.totalEntries > 0 ? html`
        ${researchData.categories.map((cat) => {
          if (cat.entries.length === 0) return nothing;
          return html`
            <details class="second-brain-section-details">
              <summary class="second-brain-section-header second-brain-section-header--toggle">
                <span class="second-brain-section-title">\u{1F50D} ${cat.label}</span>
                <span class="second-brain-section-count">${cat.entries.length}</span>
              </summary>
              <div class="second-brain-entry-list">
                ${cat.entries.map((e) => renderResearchEntryRow(e, props))}
              </div>
            </details>
          `;
        })}
      ` : nothing}

      ${!query && props.fileTree && props.fileTree.length > 0 ? html`
        <details class="second-brain-section-details">
          <summary class="second-brain-section-header second-brain-section-header--toggle">
            <span class="second-brain-section-title">\u{1F5C2}\uFE0F Browse All</span>
          </summary>
          ${renderFileTree(props.fileTree, props)}
        </details>
      ` : nothing}
    </div>
  `;
}

// ── Context Panel (unified: Awareness + Sources + Vault Health) ─────

const STATUS_STYLE: Record<string, { dot: string; label: string; cls: string }> = {
  connected: { dot: "\u{25CF}", label: "Connected", cls: "second-brain-source--connected" },
  available: { dot: "\u{25CB}", label: "Available", cls: "second-brain-source--available" },
};

function renderSourceCard(source: SecondBrainSourceEntry) {
  const status = STATUS_STYLE[source.status] ?? STATUS_STYLE["available"];

  return html`
    <div class="second-brain-source-card ${status.cls}">
      <div class="second-brain-source-icon">${source.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${source.name}</div>
        <div class="second-brain-source-desc">${source.description}</div>
        ${source.stats ? html`<div class="second-brain-source-stats">${source.stats}</div>` : nothing}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${source.status === "connected" ? "var(--success, #10b981)" : source.status === "available" ? "var(--warning, #f59e0b)" : "var(--muted)"}">${status.dot}</span>
        <span class="second-brain-source-status-label">${status.label}</span>
        ${source.status === "connected" && source.lastSync
          ? html`<span class="second-brain-source-sync">${fmtUpdated(source.lastSync)}</span>`
          : nothing}
      </div>
    </div>
  `;
}

function renderContextPanel(props: SecondBrainProps) {
  const { aiPacket, sourcesData, vaultHealth, syncing } = props;
  const snapshotData = aiPacket?.snapshot ?? null;

  return html`
    <div class="second-brain-panel">
      <!-- Awareness Snapshot (hero) -->
      <div class="second-brain-section">
        <div class="second-brain-sync-bar">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Awareness Snapshot</span>
            <span class="second-brain-sync-time">
              ${snapshotData?.updatedAt
                ? `Last synced ${fmtUpdated(snapshotData.updatedAt)}`
                : "Not yet synced"}
              ${snapshotData ? ` \u{2022} ${snapshotData.lineCount} lines` : ""}
            </span>
          </div>
          <button
            class="second-brain-sync-btn ${syncing ? "syncing" : ""}"
            ?disabled=${syncing}
            @click=${() => props.onSync()}
          >
            ${syncing ? "Syncing..." : "\u{26A1} Sync Now"}
          </button>
        </div>

        ${snapshotData ? html`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{1F9E0} Snapshot Content</span>
              <span class="second-brain-section-count">${snapshotData.lineCount} lines</span>
            </summary>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${renderMd(snapshotData.content)}</div>
            </div>
          </details>
        ` : html`
          <div class="second-brain-empty-block">
            <div class="second-brain-empty-icon">\u{1F9E0}</div>
            <div class="second-brain-empty-title">No awareness snapshot yet</div>
            <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
          </div>
        `}
      </div>

      <!-- Connected Sources -->
      ${sourcesData && sourcesData.sources.length > 0 ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F310} Connected Sources</span>
            <span class="second-brain-section-count">${sourcesData.connectedCount} of ${sourcesData.totalCount}</span>
            <button class="second-brain-add-source-btn" @click=${() => props.onAddSource()}>+ Add</button>
          </div>
          <div class="second-brain-sources-grid">
            ${sourcesData.sources
              .filter(s => s.status === "connected")
              .map(s => renderSourceCard(s))}
          </div>
          ${sourcesData.sources.some(s => s.status === "available") ? html`
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 12px; color: var(--muted);">
                ${sourcesData.sources.filter(s => s.status === "available").length} available sources
              </summary>
              <div class="second-brain-sources-grid" style="margin-top: 8px;">
                ${sourcesData.sources
                  .filter(s => s.status === "available")
                  .map(s => renderSourceCard(s))}
              </div>
            </details>
          ` : nothing}
        </div>
      ` : nothing}

      <!-- Vault Health -->
      ${vaultHealth ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4D3} Vault Health</span>
          </div>
          ${vaultHealth.available && vaultHealth.stats ? html`
            <div class="context-health-row">
              <span>${vaultHealth.stats.totalNotes} notes</span>
              <span>\u00B7</span>
              <span>${vaultHealth.stats.brainCount} brain</span>
              <span>\u00B7</span>
              <span>${vaultHealth.stats.inboxCount} inbox</span>
              <span>\u00B7</span>
              <span>${vaultHealth.stats.dailyCount} daily</span>
              <span>\u00B7</span>
              <span>Last: ${vaultHealth.stats.lastActivity ? fmtUpdated(vaultHealth.stats.lastActivity) : "never"}</span>
            </div>
          ` : html`
            <div class="context-health-row" style="color: var(--muted);">
              Vault not connected. Set OBSIDIAN_VAULT_PATH to enable.
            </div>
          `}
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Empty state ──────────────────────────────────────────────────────

function renderEmpty(title: string, hint: string) {
  return html`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${title}</div>
      <div class="second-brain-empty-hint">${hint}</div>
    </div>
  `;
}

// ── Main render ──────────────────────────────────────────────────────

export function renderSecondBrain(props: SecondBrainProps) {
  const { subtab, loading } = props;

  return html`
    <section class="second-brain-container">
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${subtab === "identity" ? "active" : ""}"
          @click=${() => props.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${subtab === "knowledge" ? "active" : ""}"
          @click=${() => props.onSubtabChange("knowledge")}
        >
          \u{1F4DA} Knowledge
        </button>
        <button
          class="second-brain-tab ${subtab === "context" ? "active" : ""}"
          @click=${() => props.onSubtabChange("context")}
        >
          \u{26A1} Context
        </button>
      </div>

      ${loading
        ? html`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`
        : subtab === "identity"
          ? renderIdentityPanel(props)
          : subtab === "knowledge"
            ? renderKnowledgePanel(props)
            : renderContextPanel(props)}
    </section>
  `;
}

// ── Component ────────────────────────────────────────────────────────

@customElement("gm-second-brain")
export class GmSecondBrain extends LitElement {
  // -- Shared context (provided by root app) --------------------------------

  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // -- Owned state (all 20 Second Brain properties) -------------------------

  @state() secondBrainSubtab: SecondBrainSubtab = "identity";
  @state() secondBrainLoading = false;
  @state() secondBrainError: string | null = null;
  @state() secondBrainIdentity: SecondBrainIdentityData | null = null;
  @state() secondBrainMemoryBank: SecondBrainMemoryBankData | null = null;
  @state() secondBrainAiPacket: SecondBrainAiPacketData | null = null;
  @state() secondBrainSourcesData: SecondBrainSourcesData | null = null;
  @state() secondBrainResearchData: SecondBrainResearchData | null = null;
  @state() secondBrainSelectedEntry: SecondBrainEntryDetail | null = null;
  @state() secondBrainSearchQuery = "";
  @state() secondBrainSyncing = false;
  @state() secondBrainBrowsingFolder: string | null = null;
  @state() secondBrainFolderEntries: SecondBrainMemoryEntry[] | null = null;
  @state() secondBrainFolderName: string | null = null;
  @state() secondBrainVaultHealth: VaultHealthData | null = null;
  @state() secondBrainFileTree: BrainTreeNode[] | null = null;
  @state() secondBrainFileTreeLoading = false;
  @state() secondBrainFileSearchQuery = "";
  @state() secondBrainFileSearchResults: BrainSearchResult[] | null = null;

  // -- Event-bus subscription cleanup ---------------------------------------

  private _unsubs: Array<() => void> = [];

  // -- Light DOM (no shadow root) so existing CSS classes work ---------------

  override createRenderRoot() {
    return this;
  }

  // -- SecondBrainState interface for controller functions -------------------

  get client() {
    return this.ctx.gateway;
  }

  get connected() {
    return this.ctx.connected;
  }

  // -- Lifecycle ------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();

    // Listen for external refresh requests (e.g. after a chat saves research)
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "second-brain") {
          void this._refresh();
        }
      }),
    );

    // Auto-load initial data
    void this._refresh();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // -- Render ---------------------------------------------------------------

  override render() {
    return renderSecondBrain({
      connected: this.ctx.connected,
      loading: this.secondBrainLoading,
      error: this.secondBrainError,
      subtab: this.secondBrainSubtab,
      // Identity
      identity: this.secondBrainIdentity,
      // Knowledge
      memoryBank: this.secondBrainMemoryBank,
      researchData: this.secondBrainResearchData,
      fileTree: this.secondBrainFileTree,
      fileTreeLoading: this.secondBrainFileTreeLoading,
      fileSearchQuery: this.secondBrainFileSearchQuery,
      fileSearchResults: this.secondBrainFileSearchResults,
      selectedEntry: this.secondBrainSelectedEntry,
      searchQuery: this.secondBrainSearchQuery,
      browsingFolder: this.secondBrainBrowsingFolder,
      folderEntries: this.secondBrainFolderEntries,
      folderName: this.secondBrainFolderName,
      // Context
      aiPacket: this.secondBrainAiPacket,
      sourcesData: this.secondBrainSourcesData,
      vaultHealth: this.secondBrainVaultHealth,
      syncing: this.secondBrainSyncing,
      // Callbacks
      onSubtabChange: (subtab) => this._onSubtabChange(subtab),
      onSelectEntry: (path) => this._onSelectEntry(path),
      onBrowseFolder: (path) => this._onBrowseFolder(path),
      onBack: () => this._onBack(),
      onSearch: (query) => this._onSearch(query),
      onFileSearch: (query) => this._onFileSearch(query),
      onFileSelect: (path) => this._onFileSelect(path),
      onSync: () => this._onSync(),
      onRefresh: () => this._refresh(),
      onSaveViaChat: () => this._onSaveViaChat(),
      onAddSource: () => this._onAddSource(),
    });
  }

  // -- Handlers (logic moved from app.ts) -----------------------------------

  private async _refresh(): Promise<void> {
    await loadSecondBrain(this as unknown as SecondBrainState);
    this.requestUpdate();
  }

  private _onSubtabChange(subtab: SecondBrainSubtab): void {
    this.secondBrainSubtab = subtab;
    this.secondBrainLoading = false;
    this.secondBrainSelectedEntry = null;
    this.secondBrainSearchQuery = "";
    this.secondBrainFileSearchQuery = "";
    this.secondBrainFileSearchResults = null;
    this.secondBrainError = null;
    this.secondBrainBrowsingFolder = null;
    this.secondBrainFolderEntries = null;
    this.secondBrainFolderName = null;
    this._refresh().catch((err) => {
      console.error("[SecondBrain] Refresh after subtab change failed:", err);
      this.secondBrainError =
        err instanceof Error ? err.message : "Failed to load data";
      this.secondBrainLoading = false;
    });
  }

  private async _onSelectEntry(path: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    const isHtml = path.endsWith(".html") || path.endsWith(".htm");
    try {
      const result = await this.ctx.gateway.request<{
        name: string;
        content: string;
        updatedAt?: string;
      }>("secondBrain.memoryBankEntry", { path });
      if (result?.content) {
        this.ctx.openSidebar({
          content: result.content,
          mimeType: isHtml ? "text/html" : "text/markdown",
          filePath: path,
          title: result.name || path.split("/").pop() || "File",
        });
      }
    } catch (err) {
      console.error("[SecondBrain] Failed to open file:", err);
      this.ctx.addToast("Failed to open file", "error");
    }
  }

  private async _onBrowseFolder(path: string): Promise<void> {
    await browseFolder(this as unknown as SecondBrainState, path);
    this.requestUpdate();
  }

  private _onBack(): void {
    if (this.secondBrainSelectedEntry) {
      this.secondBrainSelectedEntry = null;
    } else if (this.secondBrainBrowsingFolder) {
      this.secondBrainBrowsingFolder = null;
      this.secondBrainFolderEntries = null;
      this.secondBrainFolderName = null;
    }
  }

  private _onSearch(query: string): void {
    this.secondBrainSearchQuery = query;
  }

  private _onFileSearch(query: string): void {
    this.secondBrainFileSearchQuery = query;
    if (!query.trim()) {
      this.secondBrainFileSearchResults = null;
      return;
    }
    void this._doFileSearch(query);
  }

  private async _doFileSearch(query: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      const result = await this.ctx.gateway.request<{
        results: BrainSearchResult[];
      }>("secondBrain.search", { query, limit: 50 });
      // Only apply results if the query hasn't changed while we were waiting
      if (this.secondBrainFileSearchQuery === query) {
        this.secondBrainFileSearchResults = result.results ?? [];
      }
    } catch (err) {
      console.error("[SecondBrain] search failed:", err);
    }
  }

  private async _onFileSelect(path: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      const result = await this.ctx.gateway.request<{
        name: string;
        content: string;
        updatedAt?: string;
      }>("secondBrain.memoryBankEntry", { path });
      if (result?.content) {
        const isHtml = path.endsWith(".html") || path.endsWith(".htm");
        this.ctx.openSidebar({
          content: result.content,
          mimeType: isHtml ? "text/html" : "text/markdown",
          filePath: path,
          title: result.name || path.split("/").pop() || "File",
        });
      }
    } catch (err) {
      console.error("[SecondBrain] Failed to open file:", err);
      this.ctx.addToast("Failed to open file", "error");
    }
  }

  private async _onSync(): Promise<void> {
    await syncSecondBrain(this as unknown as SecondBrainState);
    this.requestUpdate();
  }

  private _onSaveViaChat(): void {
    appEventBus.emit("chat-navigate", {
      sessionKey: "new",
      tab: "chat" as Parameters<AppContext["setTab"]>[0],
      message:
        "I want to save some research. I'll paste links, bookmarks, or notes \u2014 " +
        "please organize them into ~/godmode/memory/research/ with proper frontmatter " +
        "(title, url, category, tags, date). Ask me what I'd like to save.",
    });
  }

  private _onAddSource(): void {
    appEventBus.emit("chat-navigate", {
      sessionKey: "new",
      tab: "chat" as Parameters<AppContext["setTab"]>[0],
      message:
        "I want to add a new data source to my Second Brain. Help me figure out " +
        "what I need \u2014 whether it's an API integration, a local file sync, or a " +
        "new skill. Ask me what source I'd like to connect.",
    });
  }
}

// Ensure the module is importable as a side-effect registration
declare global {
  interface HTMLElementTagNameMap {
    "gm-second-brain": GmSecondBrain;
  }
}
