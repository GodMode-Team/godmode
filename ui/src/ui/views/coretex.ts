/**
 * CoreTex — Your context profile, made visible.
 *
 * Four sub-tabs: Identity | Memory Bank | AI Packet | Sources
 * Read-only in MVP. Reads from ~/godmode/memory/ filesystem.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { toSanitizedMarkdownHtml } from "../markdown";
import { renderProactiveIntel, type ProactiveIntelProps } from "./proactive-intel.js";
import { formatAgo } from "../format";

// ── Types ────────────────────────────────────────────────────────────

export type CoreTexFileData = {
  content: string | null;
  updatedAt: string | null;
};

export type CoreTexIdentityFile = {
  key: string;
  label: string;
  content: string;
  updatedAt: string | null;
};

export type CoreTexIdentityData = {
  files: CoreTexIdentityFile[];
  identityOs: {
    dashboardPath: string;
    artifacts: CoreTexMemoryEntry[];
  } | null;
};

export type CoreTexMemoryEntry = {
  name: string;
  path: string;
  updatedAt: string | null;
  excerpt: string;
  size: number;
  isDirectory?: boolean;
  childCount?: number;
};

export type CoreTexMemorySection = {
  key: string;
  label: string;
  icon: string;
  path: string;
  entries: CoreTexMemoryEntry[];
};

export type CoreTexMemoryBankData = {
  sections: CoreTexMemorySection[];
  curated: {
    content: string;
    updatedAt: string | null;
    totalLength: number;
  } | null;
  extraFiles: CoreTexMemoryEntry[];
  totalEntries: number;
};

export type CoreTexAiPacketData = {
  consciousness: {
    content: string;
    updatedAt: string | null;
    lineCount: number;
  } | null;
  working: {
    content: string;
    updatedAt: string | null;
    lineCount: number;
  } | null;
};

export type CoreTexEntryDetail = {
  name: string;
  content: string;
  updatedAt: string | null;
  relativePath?: string;
};

export type CoreTexSourceEntry = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "available" | "coming-soon";
  icon: string;
  description: string;
  stats?: string;
  lastSync?: string | null;
};

export type CoreTexSourcesData = {
  sources: CoreTexSourceEntry[];
  connectedCount: number;
  totalCount: number;
};

export type CoreTexSubtab = "identity" | "memory-bank" | "ai-packet" | "sources" | "research" | "intel";

export type ResearchFrontmatter = {
  title?: string;
  url?: string;
  category?: string;
  tags?: string[];
  date?: string;
  source?: string;
};

export type ResearchEntry = CoreTexMemoryEntry & {
  frontmatter?: ResearchFrontmatter;
};

export type ResearchCategory = {
  key: string;
  label: string;
  path: string;
  entries: ResearchEntry[];
};

export type CoreTexResearchData = {
  categories: ResearchCategory[];
  totalEntries: number;
};

export type ResearchAddForm = {
  title: string;
  url: string;
  category: string;
  tags: string;
  notes: string;
};

export type CoreTexProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  subtab: CoreTexSubtab;
  identity?: CoreTexIdentityData | null;
  memoryBank?: CoreTexMemoryBankData | null;
  aiPacket?: CoreTexAiPacketData | null;
  sourcesData?: CoreTexSourcesData | null;
  researchData?: CoreTexResearchData | null;
  researchAddFormOpen?: boolean;
  researchAddForm?: ResearchAddForm;
  researchCategories?: string[];
  selectedEntry?: CoreTexEntryDetail | null;
  searchQuery?: string;
  syncing?: boolean;
  browsingFolder?: string | null;
  folderEntries?: CoreTexMemoryEntry[] | null;
  folderName?: string | null;
  onSubtabChange: (subtab: CoreTexSubtab) => void;
  onSelectEntry: (path: string) => void;
  onOpenInBrowser: (path: string) => void;
  onBrowseFolder: (path: string) => void;
  onBack: () => void;
  onSearch: (query: string) => void;
  onSync: () => void;
  onRefresh: () => void;
  onOpenSidebar: (content: string, opts?: { mimeType?: string | null; filePath?: string | null; title?: string | null }) => void;
  onResearchAddFormToggle: () => void;
  onResearchAddFormChange: (field: keyof ResearchAddForm, value: string) => void;
  onResearchAddSubmit: () => void;
  onSaveViaChat: () => void;
  // Proactive Intel props (for intel subtab)
  intelProps?: ProactiveIntelProps;
};

// ── Helpers ──────────────────────────────────────────────────────────

function fmtUpdated(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try {
    return formatAgo(new Date(isoString).getTime());
  } catch {
    return "";
  }
}

function renderMd(content: string) {
  return html`<div class="coretex-md-body">${unsafeHTML(toSanitizedMarkdownHtml(content))}</div>`;
}

// ── Identity Panel ───────────────────────────────────────────────────

function renderIdentityPanel(props: CoreTexProps) {
  const { identity } = props;
  if (!identity || identity.files.length === 0) {
    return renderEmpty(
      "No identity files found",
      "Start building your CoreTex by creating USER.md in ~/godmode/.",
    );
  }

  return html`
    <div class="coretex-panel">
      ${identity.identityOs ? html`
        <div
          class="coretex-hero"
          @click=${() => {
            const dashPath = identity.identityOs?.dashboardPath;
            if (dashPath) {
              props.onOpenInBrowser(dashPath);
            }
          }}
        >
          <div class="coretex-hero-content">
            <div class="coretex-hero-badge">IDENTITY OS</div>
            <div class="coretex-hero-title">Your Identity Profile</div>
            <div class="coretex-hero-desc">
              Your complete identity extraction — voice, values, story, thinking patterns, and life arc.
              ${identity.identityOs.artifacts.length} artifacts compiled.
            </div>
          </div>
          <div class="coretex-hero-arrow">\u{2192}</div>
        </div>
      ` : nothing}

      ${identity.files.map((file) => html`
        <div class="coretex-card">
          <div class="coretex-card-header">
            <span class="coretex-card-label">${file.label}</span>
            ${file.updatedAt ? html`<span class="coretex-card-updated">${fmtUpdated(file.updatedAt)}</span>` : nothing}
          </div>
          <div class="coretex-card-content">${renderMd(file.content)}</div>
        </div>
      `)}

      ${identity.identityOs && identity.identityOs.artifacts.length > 0 ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">Identity OS Artifacts</span>
            <span class="coretex-section-count">${identity.identityOs.artifacts.length}</span>
          </div>
          <div class="coretex-entry-list">
            ${identity.identityOs.artifacts.map((a) => renderEntryRow(a, props))}
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Memory Bank Panel ────────────────────────────────────────────────

function renderMemoryBankPanel(props: CoreTexProps) {
  const { memoryBank, selectedEntry, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Detail view — reading a file
  if (selectedEntry) {
    return html`
      <div class="coretex-panel">
        <button class="coretex-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="coretex-card">
          <div class="coretex-card-header">
            <span class="coretex-card-label">${selectedEntry.name}</span>
            ${selectedEntry.updatedAt ? html`<span class="coretex-card-updated">${fmtUpdated(selectedEntry.updatedAt)}</span>` : nothing}
          </div>
          ${selectedEntry.relativePath ? html`<div class="coretex-card-path">${selectedEntry.relativePath}</div>` : nothing}
          <div class="coretex-card-content">${renderMd(selectedEntry.content)}</div>
        </div>
      </div>
    `;
  }

  // Browsing a subfolder
  if (browsingFolder && folderEntries) {
    return html`
      <div class="coretex-panel">
        <button class="coretex-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">${folderName ?? "Folder"}</span>
            <span class="coretex-section-count">${folderEntries.length} items</span>
          </div>
          <div class="coretex-entry-list">
            ${folderEntries.length > 0
              ? folderEntries.map((e) => renderEntryRow(e, props))
              : html`<div class="coretex-empty-inline">Empty folder</div>`}
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
  const filterEntries = (entries: CoreTexMemoryEntry[]) =>
    query
      ? entries.filter(
          (e) => e.name.toLowerCase().includes(query) || e.excerpt.toLowerCase().includes(query),
        )
      : entries;

  return html`
    <div class="coretex-panel">
      <div class="coretex-search">
        <input
          class="coretex-search-input"
          type="text"
          placeholder="Search people, companies, projects..."
          .value=${searchQuery ?? ""}
          @input=${(e: Event) => props.onSearch((e.target as HTMLInputElement).value)}
        />
        <span class="coretex-search-count">${memoryBank.totalEntries} entries</span>
      </div>

      ${memoryBank.sections.map((section) => {
        const filtered = filterEntries(section.entries);
        if (section.entries.length === 0) return nothing;
        return html`
          <div class="coretex-section">
            <div class="coretex-section-header">
              <span class="coretex-section-title">${section.icon} ${section.label}</span>
              <span class="coretex-section-count">${section.entries.length}</span>
            </div>
            <div class="coretex-entry-list">
              ${filtered.length > 0
                ? filtered.map((e) => renderEntryRow(e, props))
                : query
                  ? html`<div class="coretex-empty-inline">No matches</div>`
                  : nothing}
            </div>
          </div>
        `;
      })}

      ${memoryBank.extraFiles.length > 0 ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">\u{1F4CB} Reference Files</span>
            <span class="coretex-section-count">${memoryBank.extraFiles.length}</span>
          </div>
          <div class="coretex-entry-list">
            ${memoryBank.extraFiles.map((e) => renderEntryRow(e, props))}
          </div>
        </div>
      ` : nothing}

      ${memoryBank.curated ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">\u{2B50} Curated Facts</span>
            <span class="coretex-section-count">${fmtUpdated(memoryBank.curated.updatedAt)}</span>
          </div>
          <div class="coretex-card">
            <div class="coretex-card-content">${renderMd(memoryBank.curated.content)}</div>
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

function renderEntryRow(entry: CoreTexMemoryEntry, props: CoreTexProps) {
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
    <div class="coretex-entry" @click=${handleClick}>
      <div class="coretex-entry-icon ${isDir ? "coretex-entry-icon--folder" : ""}">${icon}</div>
      <div class="coretex-entry-body">
        <div class="coretex-entry-name">${entry.name}${isDir ? "/" : ""}</div>
        ${entry.excerpt ? html`<div class="coretex-entry-excerpt">${entry.excerpt}</div>` : nothing}
      </div>
      ${entry.updatedAt ? html`<div class="coretex-entry-meta">${fmtUpdated(entry.updatedAt)}</div>` : nothing}
    </div>
  `;
}

// ── AI Packet Panel ──────────────────────────────────────────────────

function renderAiPacketPanel(props: CoreTexProps) {
  const { aiPacket, syncing } = props;

  return html`
    <div class="coretex-panel">
      <div class="coretex-sync-bar">
        <div class="coretex-sync-info">
          <span class="coretex-sync-label">Live Context Injection</span>
          <span class="coretex-sync-time">
            ${aiPacket?.consciousness?.updatedAt
              ? `Last synced ${fmtUpdated(aiPacket.consciousness.updatedAt)}`
              : "Not yet synced"}
            ${aiPacket?.consciousness ? ` \u{2022} ${aiPacket.consciousness.lineCount} lines` : ""}
          </span>
        </div>
        <button
          class="coretex-sync-btn ${syncing ? "syncing" : ""}"
          ?disabled=${syncing}
          @click=${() => props.onSync()}
        >
          ${syncing ? "Syncing..." : "\u{26A1} Sync Now"}
        </button>
      </div>

      ${aiPacket?.consciousness ? html`
        <div class="coretex-card">
          <div class="coretex-card-header">
            <span class="coretex-card-label">CONSCIOUSNESS.md</span>
            <span class="coretex-card-updated">${aiPacket.consciousness.lineCount} lines</span>
          </div>
          <div class="coretex-card-content">${renderMd(aiPacket.consciousness.content)}</div>
        </div>
      ` : html`
        <div class="coretex-empty-block">
          <div class="coretex-empty-icon">\u{1F9E0}</div>
          <div class="coretex-empty-title">No consciousness file yet</div>
          <div class="coretex-empty-hint">Hit "Sync Now" to generate your first consciousness snapshot.</div>
        </div>
      `}

      ${aiPacket?.working ? html`
        <div class="coretex-card">
          <div class="coretex-card-header">
            <span class="coretex-card-label">WORKING.md</span>
            <span class="coretex-card-updated">${aiPacket.working.lineCount} lines</span>
          </div>
          <div class="coretex-card-content">${renderMd(aiPacket.working.content)}</div>
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Sources Panel ────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; label: string; cls: string }> = {
  connected: { dot: "\u{25CF}", label: "Connected", cls: "coretex-source--connected" },
  available: { dot: "\u{25CB}", label: "Available", cls: "coretex-source--available" },
  "coming-soon": { dot: "\u{25CB}", label: "Coming Soon", cls: "coretex-source--coming-soon" },
};

function renderSourcesPanel(props: CoreTexProps) {
  const { sourcesData } = props;

  if (!sourcesData || sourcesData.sources.length === 0) {
    return renderEmpty(
      "No sources detected",
      "Connect data sources to build your context universe.",
    );
  }

  const connected = sourcesData.sources.filter(s => s.status === "connected");
  const available = sourcesData.sources.filter(s => s.status === "available");
  const future = sourcesData.sources.filter(s => s.status === "coming-soon");

  return html`
    <div class="coretex-panel">
      <div class="coretex-sources-summary">
        <span class="coretex-sources-count">${sourcesData.connectedCount}</span>
        <span class="coretex-sources-label">sources connected</span>
        <span class="coretex-sources-total">${sourcesData.totalCount} total</span>
      </div>

      ${connected.length > 0 ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">\u{1F7E2} Connected</span>
            <span class="coretex-section-count">${connected.length}</span>
          </div>
          <div class="coretex-sources-grid">
            ${connected.map(s => renderSourceCard(s))}
          </div>
        </div>
      ` : nothing}

      ${available.length > 0 ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">\u{1F7E1} Available</span>
            <span class="coretex-section-count">${available.length}</span>
          </div>
          <div class="coretex-sources-grid">
            ${available.map(s => renderSourceCard(s))}
          </div>
        </div>
      ` : nothing}

      ${future.length > 0 ? html`
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">\u{1F535} Coming Soon</span>
            <span class="coretex-section-count">${future.length}</span>
          </div>
          <div class="coretex-sources-grid">
            ${future.map(s => renderSourceCard(s))}
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

function renderSourceCard(source: CoreTexSourceEntry) {
  const status = STATUS_STYLE[source.status] ?? STATUS_STYLE["coming-soon"];

  return html`
    <div class="coretex-source-card ${status.cls}">
      <div class="coretex-source-icon">${source.icon}</div>
      <div class="coretex-source-body">
        <div class="coretex-source-name">${source.name}</div>
        <div class="coretex-source-desc">${source.description}</div>
        ${source.stats ? html`<div class="coretex-source-stats">${source.stats}</div>` : nothing}
      </div>
      <div class="coretex-source-status">
        <span class="coretex-source-dot" style="color: ${source.status === "connected" ? "var(--success, #10b981)" : source.status === "available" ? "var(--warning, #f59e0b)" : "var(--muted)"}">${status.dot}</span>
        <span class="coretex-source-status-label">${status.label}</span>
        ${source.status === "connected" && source.lastSync
          ? html`<span class="coretex-source-sync">${fmtUpdated(source.lastSync)}</span>`
          : nothing}
      </div>
    </div>
  `;
}

// ── Research Panel ───────────────────────────────────────────────────

function renderResearchEntryRow(entry: ResearchEntry, props: CoreTexProps) {
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
    <div class="coretex-entry" @click=${handleClick}>
      <div class="coretex-entry-icon ${isDir ? "coretex-entry-icon--folder" : ""}">${icon}</div>
      <div class="coretex-entry-body">
        <div class="coretex-entry-name">${displayName}${isDir ? "/" : ""}</div>
        ${entry.frontmatter?.url ? html`<div class="coretex-research-url">${entry.frontmatter.url}</div>` : nothing}
        ${entry.excerpt && !isDir ? html`<div class="coretex-entry-excerpt">${entry.excerpt}</div>` : nothing}
        ${entry.frontmatter?.tags?.length ? html`
          <div class="coretex-research-tags">
            ${entry.frontmatter.tags.map(t => html`<span class="coretex-research-tag">${t}</span>`)}
          </div>
        ` : nothing}
      </div>
      ${entry.updatedAt ? html`<div class="coretex-entry-meta">${fmtUpdated(entry.updatedAt)}</div>` : nothing}
    </div>
  `;
}

function renderResearchAddForm(props: CoreTexProps) {
  const form = props.researchAddForm ?? { title: "", url: "", category: "", tags: "", notes: "" };
  const categories = props.researchCategories ?? [];

  return html`
    <div class="coretex-research-form">
      <div class="coretex-research-form-row">
        <label class="coretex-research-form-label">Title *</label>
        <input
          class="coretex-search-input"
          type="text"
          placeholder="Article or resource title"
          .value=${form.title}
          @input=${(e: Event) => props.onResearchAddFormChange("title", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="coretex-research-form-row">
        <label class="coretex-research-form-label">URL</label>
        <input
          class="coretex-search-input"
          type="text"
          placeholder="https://example.com/article"
          .value=${form.url}
          @input=${(e: Event) => props.onResearchAddFormChange("url", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="coretex-research-form-row">
        <label class="coretex-research-form-label">Category</label>
        <input
          class="coretex-search-input"
          type="text"
          placeholder="e.g. ai, business, health"
          list="research-categories"
          .value=${form.category}
          @input=${(e: Event) => props.onResearchAddFormChange("category", (e.target as HTMLInputElement).value)}
        />
        ${categories.length > 0 ? html`
          <datalist id="research-categories">
            ${categories.map(c => html`<option value=${c}></option>`)}
          </datalist>
        ` : nothing}
      </div>
      <div class="coretex-research-form-row">
        <label class="coretex-research-form-label">Tags</label>
        <input
          class="coretex-search-input"
          type="text"
          placeholder="Comma-separated: agents, tools, rag"
          .value=${form.tags}
          @input=${(e: Event) => props.onResearchAddFormChange("tags", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="coretex-research-form-row">
        <label class="coretex-research-form-label">Notes</label>
        <textarea
          class="coretex-research-form-textarea"
          rows="4"
          placeholder="Key takeaways, quotes, or context..."
          .value=${form.notes}
          @input=${(e: Event) => props.onResearchAddFormChange("notes", (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </div>
      <button
        class="coretex-sync-btn"
        ?disabled=${!form.title.trim()}
        @click=${() => props.onResearchAddSubmit()}
      >Save Research</button>
    </div>
  `;
}

function renderResearchPanel(props: CoreTexProps) {
  const { researchData, selectedEntry, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Detail view — reading a file
  if (selectedEntry) {
    return html`
      <div class="coretex-panel">
        <button class="coretex-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="coretex-card">
          <div class="coretex-card-header">
            <span class="coretex-card-label">${selectedEntry.name}</span>
            ${selectedEntry.updatedAt ? html`<span class="coretex-card-updated">${fmtUpdated(selectedEntry.updatedAt)}</span>` : nothing}
          </div>
          ${selectedEntry.relativePath ? html`<div class="coretex-card-path">${selectedEntry.relativePath}</div>` : nothing}
          <div class="coretex-card-content">${renderMd(selectedEntry.content)}</div>
        </div>
      </div>
    `;
  }

  // Browsing a category subfolder
  if (browsingFolder && folderEntries) {
    return html`
      <div class="coretex-panel">
        <button class="coretex-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="coretex-section">
          <div class="coretex-section-header">
            <span class="coretex-section-title">${folderName ?? "Category"}</span>
            <span class="coretex-section-count">${folderEntries.length} items</span>
          </div>
          <div class="coretex-entry-list">
            ${folderEntries.length > 0
              ? (folderEntries as ResearchEntry[]).map((e) => renderResearchEntryRow(e, props))
              : html`<div class="coretex-empty-inline">No research in this category</div>`}
          </div>
        </div>
      </div>
    `;
  }

  // Empty state
  if (!researchData || researchData.totalEntries === 0) {
    return html`
      <div class="coretex-panel">
        <div class="coretex-research-toolbar">
          <div style="flex:1"></div>
          <button class="coretex-sync-btn" @click=${() => props.onSaveViaChat()}>
            + Save via Chat
          </button>
        </div>
        ${renderEmpty(
          "No research collected yet",
          "Click 'Save via Chat' to paste links, bookmarks, or notes \u2014 your AI will organize them for you.",
        )}
      </div>
    `;
  }

  // Main list view
  const query = (searchQuery ?? "").toLowerCase().trim();
  const filterEntries = (entries: ResearchEntry[]) =>
    query
      ? entries.filter((e) =>
          e.name.toLowerCase().includes(query) ||
          e.excerpt.toLowerCase().includes(query) ||
          (e.frontmatter?.tags ?? []).some(t => t.toLowerCase().includes(query)) ||
          (e.frontmatter?.url ?? "").toLowerCase().includes(query),
        )
      : entries;

  return html`
    <div class="coretex-panel">
      <div class="coretex-research-toolbar">
        <div class="coretex-search" style="flex:1">
          <input
            class="coretex-search-input"
            type="text"
            placeholder="Search research by title, tag, URL..."
            .value=${searchQuery ?? ""}
            @input=${(e: Event) => props.onSearch((e.target as HTMLInputElement).value)}
          />
          <span class="coretex-search-count">${researchData.totalEntries} entries</span>
        </div>
        <button class="coretex-sync-btn" @click=${() => props.onSaveViaChat()}>
          + Save via Chat
        </button>
      </div>

      ${researchData.categories.map((cat) => {
        const filtered = filterEntries(cat.entries);
        if (cat.entries.length === 0) return nothing;
        return html`
          <div class="coretex-section">
            <div class="coretex-section-header">
              <span class="coretex-section-title">\u{1F4C1} ${cat.label}</span>
              <span class="coretex-section-count">${cat.entries.length}</span>
            </div>
            <div class="coretex-entry-list">
              ${filtered.length > 0
                ? filtered.map((e) => renderResearchEntryRow(e, props))
                : query
                  ? html`<div class="coretex-empty-inline">No matches</div>`
                  : nothing}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

// ── Empty state ──────────────────────────────────────────────────────

function renderEmpty(title: string, hint: string) {
  return html`
    <div class="coretex-empty-block">
      <div class="coretex-empty-icon">\u{1F9E0}</div>
      <div class="coretex-empty-title">${title}</div>
      <div class="coretex-empty-hint">${hint}</div>
    </div>
  `;
}

// ── Main render ──────────────────────────────────────────────────────

export function renderCoretex(props: CoreTexProps) {
  const { subtab, loading } = props;

  return html`
    <section class="coretex-container">
      <div class="coretex-tabs">
        <button
          class="coretex-tab ${subtab === "identity" ? "active" : ""}"
          @click=${() => props.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="coretex-tab ${subtab === "memory-bank" ? "active" : ""}"
          @click=${() => props.onSubtabChange("memory-bank")}
        >
          \u{1F4DA} Memory Bank
        </button>
        <button
          class="coretex-tab ${subtab === "ai-packet" ? "active" : ""}"
          @click=${() => props.onSubtabChange("ai-packet")}
        >
          \u{26A1} AI Packet
        </button>
        <button
          class="coretex-tab ${subtab === "sources" ? "active" : ""}"
          @click=${() => props.onSubtabChange("sources")}
        >
          \u{1F310} Sources
        </button>
        <button
          class="coretex-tab ${subtab === "research" ? "active" : ""}"
          @click=${() => props.onSubtabChange("research")}
        >
          \u{1F50D} Research
        </button>
        <button
          class="coretex-tab ${subtab === "intel" ? "active" : ""}"
          @click=${() => props.onSubtabChange("intel")}
        >
          \u{1F441}\uFE0F Insights
        </button>
      </div>

      ${subtab === "intel"
        ? props.intelProps
          ? renderProactiveIntel(props.intelProps)
          : html`<div class="coretex-loading"><div class="coretex-loading-spinner"></div>Loading...</div>`
        : loading
          ? html`<div class="coretex-loading"><div class="coretex-loading-spinner"></div>Loading...</div>`
          : subtab === "identity"
            ? renderIdentityPanel(props)
            : subtab === "memory-bank"
              ? renderMemoryBankPanel(props)
              : subtab === "ai-packet"
                ? renderAiPacketPanel(props)
                : subtab === "sources"
                  ? renderSourcesPanel(props)
                  : renderResearchPanel(props)}
    </section>
  `;
}
