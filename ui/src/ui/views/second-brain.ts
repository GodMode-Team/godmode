/**
 * Second Brain — Your context profile, made visible.
 *
 * Six sub-tabs: Identity | Memory Bank | AI Packet | Sources | Research | Insights
 * Read-only in MVP. Reads from ~/godmode/memory/ filesystem.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { toSanitizedMarkdownHtml } from "../markdown";
import { formatAgo } from "../format";

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
  identityOs: {
    dashboardPath: string;
    artifacts: SecondBrainMemoryEntry[];
  } | null;
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
  // Legacy fields kept for backward compat
  consciousness?: {
    content: string;
    updatedAt: string | null;
    lineCount: number;
  } | null;
  working?: {
    content: string;
    updatedAt: string | null;
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

export type SecondBrainSubtab = "identity" | "memory-bank" | "ai-packet" | "sources" | "research" | "intel" | "resources" | "files";

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

export type ResearchAddForm = {
  title: string;
  url: string;
  category: string;
  tags: string;
  notes: string;
};

export type CommunityResourceEntry = {
  id: string;
  url: string;
  label: string;
  description: string;
  tags: string[];
  addedAt: number;
};

export type CommunityResourcesData = {
  resources: CommunityResourceEntry[];
  count: number;
};

export type CommunityResourceAddForm = {
  url: string;
  label: string;
  description: string;
  tags: string;
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
  identity?: SecondBrainIdentityData | null;
  memoryBank?: SecondBrainMemoryBankData | null;
  aiPacket?: SecondBrainAiPacketData | null;
  sourcesData?: SecondBrainSourcesData | null;
  researchData?: SecondBrainResearchData | null;
  researchAddFormOpen?: boolean;
  researchAddForm?: ResearchAddForm;
  researchCategories?: string[];
  selectedEntry?: SecondBrainEntryDetail | null;
  searchQuery?: string;
  syncing?: boolean;
  browsingFolder?: string | null;
  folderEntries?: SecondBrainMemoryEntry[] | null;
  folderName?: string | null;
  onSubtabChange: (subtab: SecondBrainSubtab) => void;
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
  // Files tab props
  fileTree?: BrainTreeNode[] | null;
  fileTreeLoading?: boolean;
  fileSearchQuery?: string;
  fileSearchResults?: BrainSearchResult[] | null;
  onFileTreeRefresh?: () => Promise<void>;
  onFileSearch?: (query: string) => void;
  onFileSelect?: (path: string) => void;
  // Community Resources props (for resources subtab)
  communityResources?: CommunityResourcesData | null;
  communityResourceAddFormOpen?: boolean;
  communityResourceAddForm?: CommunityResourceAddForm;
  onCommunityResourceAdd: () => void;
  onCommunityResourceRemove: (id: string) => void;
  onCommunityResourceAddFormToggle: () => void;
  onCommunityResourceAddFormChange: (field: keyof CommunityResourceAddForm, value: string) => void;
  onAddSource: () => void;
  // Vault health
  vaultHealth?: VaultHealthData | null;
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
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="sb-chat-btn" @click=${() => props.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>
      ${identity.identityOs ? html`
        <div
          class="second-brain-hero"
          @click=${() => {
            const dashPath = identity.identityOs?.dashboardPath;
            if (dashPath) {
              props.onOpenInBrowser(dashPath);
            }
          }}
        >
          <div class="second-brain-hero-content">
            <div class="second-brain-hero-badge">IDENTITY OS</div>
            <div class="second-brain-hero-title">Your Identity Profile</div>
            <div class="second-brain-hero-desc">
              Your complete identity extraction — voice, values, story, thinking patterns, and life arc.
              ${identity.identityOs.artifacts.length} artifacts compiled.
            </div>
          </div>
          <div class="second-brain-hero-arrow">\u{2192}</div>
        </div>
      ` : nothing}

      ${identity.files.map((file) => html`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${file.label}</span>
            ${file.updatedAt ? html`<span class="second-brain-card-updated">${fmtUpdated(file.updatedAt)}</span>` : nothing}
          </div>
          <div class="second-brain-card-content">${renderMd(file.content)}</div>
        </div>
      `)}

      ${identity.identityOs && identity.identityOs.artifacts.length > 0 ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">Identity OS Artifacts</span>
            <span class="second-brain-section-count">${identity.identityOs.artifacts.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${identity.identityOs.artifacts.map((a) => renderEntryRow(a, props))}
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Memory Bank Panel ────────────────────────────────────────────────

function renderMemoryBankPanel(props: SecondBrainProps) {
  const { memoryBank, selectedEntry, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Detail view — reading a file
  if (selectedEntry) {
    return html`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${selectedEntry.name}</span>
            ${selectedEntry.updatedAt ? html`<span class="second-brain-card-updated">${fmtUpdated(selectedEntry.updatedAt)}</span>` : nothing}
          </div>
          ${selectedEntry.relativePath ? html`<div class="second-brain-card-path">${selectedEntry.relativePath}</div>` : nothing}
          <div class="second-brain-card-content">${renderMd(selectedEntry.content)}</div>
        </div>
      </div>
    `;
  }

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

// ── AI Packet Panel ──────────────────────────────────────────────────

function renderAiPacketPanel(props: SecondBrainProps) {
  const { aiPacket, syncing } = props;
  // Support both new shape (snapshot) and legacy shape (consciousness/working)
  const snapshotData = aiPacket?.snapshot ?? aiPacket?.consciousness ?? null;
  const snapshotLabel = aiPacket?.snapshot ? "Awareness Snapshot" : "CONSCIOUSNESS.md";

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-sync-bar">
        <div class="second-brain-sync-info">
          <span class="second-brain-sync-label">Live Context Injection</span>
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

      <div class="second-brain-ai-packet-explainer" style="padding: 12px 16px; margin-bottom: 12px; font-size: 13px; color: var(--text-secondary); background: var(--bg-secondary); border-radius: 8px;">
        This is what your ally knows right now. It refreshes every 15 minutes automatically.
      </div>

      ${snapshotData ? html`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${snapshotLabel}</span>
            <span class="second-brain-card-updated">${snapshotData.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${renderMd(snapshotData.content)}</div>
        </div>
      ` : html`
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F9E0}</div>
          <div class="second-brain-empty-title">No awareness snapshot yet</div>
          <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
        </div>
      `}

      ${aiPacket?.working ? html`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">WORKING.md</span>
            <span class="second-brain-card-updated">${aiPacket.working.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${renderMd(aiPacket.working.content)}</div>
        </div>
      ` : nothing}
    </div>
  `;
}

// ── Sources Panel ────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; label: string; cls: string }> = {
  connected: { dot: "\u{25CF}", label: "Connected", cls: "second-brain-source--connected" },
  available: { dot: "\u{25CB}", label: "Available", cls: "second-brain-source--available" },
};

function renderSourcesPanel(props: SecondBrainProps) {
  const { sourcesData } = props;

  if (!sourcesData || sourcesData.sources.length === 0) {
    return renderEmpty(
      "No sources detected",
      "Connect data sources to build your context universe.",
    );
  }

  const connected = sourcesData.sources.filter(s => s.status === "connected");
  const available = sourcesData.sources.filter(s => s.status === "available");

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-sources-summary">
        <span class="second-brain-sources-count">${sourcesData.connectedCount}</span>
        <span class="second-brain-sources-label">sources connected</span>
        <button class="second-brain-add-source-btn" @click=${() => props.onAddSource()}>+ Add a Source</button>
      </div>

      ${connected.length > 0 ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E2} Connected</span>
            <span class="second-brain-section-count">${connected.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${connected.map(s => renderSourceCard(s))}
          </div>
        </div>
      ` : nothing}

      ${available.length > 0 ? html`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E1} Available</span>
            <span class="second-brain-section-count">${available.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${available.map(s => renderSourceCard(s))}
          </div>
        </div>
      ` : nothing}
    </div>
  `;
}

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

// ── Research Panel ───────────────────────────────────────────────────

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

function renderResearchAddForm(props: SecondBrainProps) {
  const form = props.researchAddForm ?? { title: "", url: "", category: "", tags: "", notes: "" };
  const categories = props.researchCategories ?? [];

  return html`
    <div class="second-brain-research-form">
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Title *</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Article or resource title"
          .value=${form.title}
          @input=${(e: Event) => props.onResearchAddFormChange("title", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">URL</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="https://example.com/article"
          .value=${form.url}
          @input=${(e: Event) => props.onResearchAddFormChange("url", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Category</label>
        <input
          class="second-brain-search-input"
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
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Tags</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Comma-separated: agents, tools, rag"
          .value=${form.tags}
          @input=${(e: Event) => props.onResearchAddFormChange("tags", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Notes</label>
        <textarea
          class="second-brain-research-form-textarea"
          rows="4"
          placeholder="Key takeaways, quotes, or context..."
          .value=${form.notes}
          @input=${(e: Event) => props.onResearchAddFormChange("notes", (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </div>
      <button
        class="second-brain-sync-btn"
        ?disabled=${!form.title.trim()}
        @click=${() => props.onResearchAddSubmit()}
      >Save Research</button>
    </div>
  `;
}

function renderResearchPanel(props: SecondBrainProps) {
  const { researchData, selectedEntry, searchQuery, browsingFolder, folderEntries, folderName } = props;

  // Detail view — reading a file
  if (selectedEntry) {
    return html`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${selectedEntry.name}</span>
            ${selectedEntry.updatedAt ? html`<span class="second-brain-card-updated">${fmtUpdated(selectedEntry.updatedAt)}</span>` : nothing}
          </div>
          ${selectedEntry.relativePath ? html`<div class="second-brain-card-path">${selectedEntry.relativePath}</div>` : nothing}
          <div class="second-brain-card-content">${renderMd(selectedEntry.content)}</div>
        </div>
      </div>
    `;
  }

  // Browsing a category subfolder
  if (browsingFolder && folderEntries) {
    return html`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${() => props.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${folderName ?? "Category"}</span>
            <span class="second-brain-section-count">${folderEntries.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${folderEntries.length > 0
              ? (folderEntries as ResearchEntry[]).map((e) => renderResearchEntryRow(e, props))
              : html`<div class="second-brain-empty-inline">No research in this category</div>`}
          </div>
        </div>
      </div>
    `;
  }

  // Empty state
  if (!researchData || researchData.totalEntries === 0) {
    return html`
      <div class="second-brain-panel">
        <div class="second-brain-research-toolbar">
          <div style="flex:1"></div>
          <button class="second-brain-sync-btn" @click=${() => props.onSaveViaChat()}>
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
    <div class="second-brain-panel">
      <div class="second-brain-research-toolbar">
        <div class="second-brain-search" style="flex:1">
          <input
            class="second-brain-search-input"
            type="text"
            placeholder="Search research by title, tag, URL..."
            .value=${searchQuery ?? ""}
            @input=${(e: Event) => props.onSearch((e.target as HTMLInputElement).value)}
          />
          <span class="second-brain-search-count">${researchData.totalEntries} entries</span>
        </div>
        <button class="second-brain-sync-btn" @click=${() => props.onResearchAddFormToggle()}>
          + Quick Add
        </button>
        <button class="second-brain-sync-btn" @click=${() => props.onSaveViaChat()}>
          + Save via Chat
        </button>
      </div>

      ${researchData.categories.map((cat) => {
        const filtered = filterEntries(cat.entries);
        if (cat.entries.length === 0) return nothing;
        return html`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4C1} ${cat.label}</span>
              <span class="second-brain-section-count">${cat.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${filtered.length > 0
                ? filtered.map((e) => renderResearchEntryRow(e, props))
                : query
                  ? html`<div class="second-brain-empty-inline">No matches</div>`
                  : nothing}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

// ── Files Tab ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

function renderFilesTab(props: SecondBrainProps) {
  return html`
    <div class="sb-files-container">
      <div class="sb-files-search-bar">
        <input
          type="text"
          class="sb-files-search-input"
          placeholder="Search across your Second Brain..."
          .value=${props.fileSearchQuery ?? ""}
          @input=${(e: InputEvent) => {
            const target = e.target as HTMLInputElement;
            props.onFileSearch?.(target.value);
          }}
        />
      </div>

      ${props.fileSearchResults
        ? renderFileSearchResults(props)
        : props.fileTreeLoading
          ? html`<div class="sb-files-loading">Loading file tree...</div>`
          : props.fileTree
            ? renderFileTree(props.fileTree, props)
            : html`<div class="sb-files-empty">No files found</div>`}
    </div>
  `;
}

function renderFileSearchResults(props: SecondBrainProps) {
  const results = props.fileSearchResults ?? [];
  if (results.length === 0) {
    return html`<div class="sb-files-empty">No results found</div>`;
  }
  return html`
    <div class="sb-files-results">
      ${results.map(
        (r) => html`
          <button
            class="sb-files-result-item"
            @click=${() => props.onFileSelect?.(r.path)}
          >
            <span class="sb-file-icon">${r.type === "folder" ? "\u{1F4C1}" : "\u{1F4C4}"}</span>
            <div class="sb-file-info">
              <span class="sb-file-name">${r.name}</span>
              <span class="sb-file-path">${r.path}</span>
              ${r.matchContext || r.excerpt
                ? html`<span class="sb-file-excerpt">${r.matchContext ?? r.excerpt}</span>`
                : nothing}
            </div>
          </button>
        `,
      )}
    </div>
  `;
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

// ── Vault Health Bar ────────────────────────────────────────────────

function renderVaultHealthBar(vaultHealth?: VaultHealthData | null) {
  if (!vaultHealth) return nothing;

  if (!vaultHealth.available) {
    return html`
      <div class="vault-health-bar vault-health-disconnected">
        <span class="vault-health-status">\u26A0\uFE0F Vault not connected</span>
        <span class="vault-health-detail">Using local storage. Set OBSIDIAN_VAULT_PATH to connect your Obsidian vault.</span>
      </div>
    `;
  }

  const stats = vaultHealth.stats;
  if (!stats) return nothing;

  const lastActivityStr = stats.lastActivity ? fmtUpdated(stats.lastActivity) : "never";
  const inboxBadge = stats.inboxCount > 0
    ? html`<span class="vault-health-inbox-badge">${stats.inboxCount} in inbox</span>`
    : nothing;

  return html`
    <div class="vault-health-bar vault-health-connected">
      <span class="vault-health-status">\u{1F7E2} Vault Connected</span>
      <span class="vault-health-detail">
        ${stats.totalNotes} notes \u00B7
        ${stats.brainCount} brain \u00B7
        ${stats.dailyCount} daily \u00B7
        ${stats.projectCount} projects \u00B7
        Last activity: ${lastActivityStr}
      </span>
      ${inboxBadge}
    </div>
  `;
}

function computeContextHealth(props: SecondBrainProps): { score: number; tips: string[] } {
  let score = 0;
  const tips: string[] = [];

  // USER.md exists? (20%)
  if (props.identity && props.identity.files.length > 0) {
    score += 20;
  } else {
    tips.push("Create USER.md to help your ally know you");
  }

  // Goals set? (20%)
  // We can't directly check goals here, but vault health tells us enough
  const hasVault = props.vaultHealth?.available ?? false;
  if (hasVault) score += 20;
  else tips.push("Connect your Obsidian vault for long-term memory");

  // Memory bank has entries? (20%)
  if (props.memoryBank && props.memoryBank.totalEntries > 0) {
    score += 20;
  } else {
    tips.push("Teach your ally — chat naturally and it remembers");
  }

  // At least 1 source connected? (20%)
  if (props.sourcesData && props.sourcesData.connectedCount > 0) {
    score += 20;
  } else {
    tips.push("Connect a data source (calendar, Oura, etc.)");
  }

  // 7+ daily briefs? (20%)
  if (props.vaultHealth?.stats && props.vaultHealth.stats.dailyCount >= 7) {
    score += 20;
  } else {
    tips.push("Keep using the morning brief — it compounds");
  }

  return { score, tips };
}

export function renderSecondBrain(props: SecondBrainProps) {
  const { subtab, loading, vaultHealth } = props;
  const health = computeContextHealth(props);

  return html`
    <section class="second-brain-container">
      ${renderVaultHealthBar(vaultHealth)}
      ${health.score < 100 ? html`
        <div class="sb-health-score">
          <div class="sb-health-score-bar">
            <div class="sb-health-score-fill" style="width: ${health.score}%"></div>
          </div>
          <div class="sb-health-score-info">
            <span class="sb-health-score-label">Context Health: ${health.score}%</span>
            ${health.tips.length > 0 ? html`<span class="sb-health-score-tip">${health.tips[0]}</span>` : nothing}
          </div>
        </div>
      ` : nothing}
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${subtab === "identity" ? "active" : ""}"
          @click=${() => props.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${subtab === "memory-bank" ? "active" : ""}"
          @click=${() => props.onSubtabChange("memory-bank")}
        >
          \u{1F4DA} Memory Bank
        </button>
        <button
          class="second-brain-tab ${subtab === "ai-packet" ? "active" : ""}"
          @click=${() => props.onSubtabChange("ai-packet")}
        >
          \u{26A1} AI Packet
        </button>
        <button
          class="second-brain-tab ${subtab === "sources" ? "active" : ""}"
          @click=${() => props.onSubtabChange("sources")}
        >
          \u{1F310} Sources
        </button>
        <button
          class="second-brain-tab ${subtab === "research" ? "active" : ""}"
          @click=${() => props.onSubtabChange("research")}
        >
          \u{1F50D} Research
        </button>
        <button
          class="second-brain-tab ${subtab === "resources" ? "active" : ""}"
          @click=${() => props.onSubtabChange("resources")}
        >
          \u{1F4E6} Resources
        </button>
        <button
          class="second-brain-tab ${subtab === "files" ? "active" : ""}"
          @click=${() => props.onSubtabChange("files")}
        >
          \u{1F5C2}\uFE0F Files
        </button>
        <button
          class="second-brain-tab ${subtab === "intel" ? "active" : ""}"
          @click=${() => props.onSubtabChange("intel")}
        >
          \u{1F441}\uFE0F Insights
        </button>
      </div>

      ${subtab === "intel"
        ? renderInsightsPanel(props)
        : loading
          ? html`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`
          : subtab === "identity"
            ? renderIdentityPanel(props)
            : subtab === "memory-bank"
              ? renderMemoryBankPanel(props)
              : subtab === "ai-packet"
                ? renderAiPacketPanel(props)
                : subtab === "sources"
                  ? renderSourcesPanel(props)
                  : subtab === "resources"
                    ? renderResourcesPanel(props)
                    : subtab === "files"
                      ? renderFilesTab(props)
                      : renderResearchPanel(props)}
    </section>
  `;
}

// ── Insights Panel ────────────────────────────────────────────────────

function renderInsightsPanel(props: SecondBrainProps) {
  const hasVault = props.vaultHealth?.available ?? false;
  const hasBriefs = (props.vaultHealth?.stats?.dailyCount ?? 0) >= 3;
  const hasSources = (props.sourcesData?.connectedCount ?? 0) > 0;

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-card">
        <div class="second-brain-card-header">
          <span class="second-brain-card-label">How Insights Work</span>
        </div>
        <div class="second-brain-card-content" style="padding: 16px;">
          <p style="margin: 0 0 12px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
            Your ally builds insights over time as you work together. The more daily briefs, agent tasks, and interactions you accumulate, the smarter your ally gets at spotting patterns, blind spots, and opportunities.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${hasVault ? "\u2705" : "\u{1F7E1}"}</span>
              <span style="font-size: 13px; color: var(--text);">Obsidian Vault ${hasVault ? "connected" : "not connected — connect for richer insights"}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${hasBriefs ? "\u2705" : "\u{1F7E1}"}</span>
              <span style="font-size: 13px; color: var(--text);">${hasBriefs ? `${props.vaultHealth?.stats?.dailyCount} daily briefs accumulated` : "Less than 3 daily briefs — keep using the morning brief"}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${hasSources ? "\u2705" : "\u{1F7E1}"}</span>
              <span style="font-size: 13px; color: var(--text);">${hasSources ? "Data sources connected" : "No data sources yet — connect integrations for cross-domain insights"}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 0 16px;">
        <p style="font-size: 12px; color: var(--text-muted); margin: 8px 0;">
          Proactive insights surface in your daily brief and awareness snapshot. Check your Dashboards tab for deeper analysis views.
        </p>
      </div>
    </div>
  `;
}

// ── Community Resources Panel ─────────────────────────────────────────

function renderResourcesPanel(props: SecondBrainProps) {
  const { communityResources, communityResourceAddFormOpen } = props;

  return html`
    <div class="second-brain-panel">
      <div class="second-brain-research-toolbar">
        <div style="flex:1">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Community Resources</span>
            <span class="second-brain-sync-time">
              Curated repos and tools your AI agents can reference
            </span>
          </div>
        </div>
        <button
          class="second-brain-sync-btn"
          @click=${() => props.onCommunityResourceAddFormToggle()}
        >
          ${communityResourceAddFormOpen ? "Cancel" : "+ Add Resource"}
        </button>
      </div>

      ${communityResourceAddFormOpen ? renderResourceAddForm(props) : nothing}

      ${!communityResources || communityResources.resources.length === 0
        ? renderEmpty(
            "No community resources yet",
            "Add GitHub repos, awesome-lists, and tools for your AI agents to discover and reference.",
          )
        : html`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4E6} Bookmarked Resources</span>
              <span class="second-brain-section-count">${communityResources.count}</span>
            </div>
            <div class="second-brain-entry-list">
              ${communityResources.resources.map(r => renderResourceRow(r, props))}
            </div>
          </div>
        `}
    </div>
  `;
}

function renderResourceRow(resource: CommunityResourceEntry, props: SecondBrainProps) {
  return html`
    <div class="second-brain-entry">
      <div class="second-brain-entry-icon">\u{1F517}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">
          <a href=${resource.url} target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
            ${resource.label}
          </a>
        </div>
        ${resource.description
          ? html`<div class="second-brain-entry-excerpt">${resource.description}</div>`
          : nothing}
        ${resource.tags.length > 0
          ? html`<div class="second-brain-research-tags">
              ${resource.tags.map(t => html`<span class="second-brain-research-tag">${t}</span>`)}
            </div>`
          : nothing}
      </div>
      <button
        class="second-brain-back-btn"
        style="font-size: 11px; padding: 2px 8px; color: var(--danger, #ef4444);"
        @click=${(e: Event) => { e.stopPropagation(); props.onCommunityResourceRemove(resource.id); }}
      >Remove</button>
    </div>
  `;
}

function renderResourceAddForm(props: SecondBrainProps) {
  const form = props.communityResourceAddForm ?? { url: "", label: "", description: "", tags: "" };

  return html`
    <div class="second-brain-research-form">
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">URL *</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="https://github.com/owner/repo"
          .value=${form.url}
          @input=${(e: Event) => props.onCommunityResourceAddFormChange("url", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Label</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Display name (auto-derived from URL if blank)"
          .value=${form.label}
          @input=${(e: Event) => props.onCommunityResourceAddFormChange("label", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Description</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="What is this resource about?"
          .value=${form.description}
          @input=${(e: Event) => props.onCommunityResourceAddFormChange("description", (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Tags</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Comma-separated: tools, prompts, agents"
          .value=${form.tags}
          @input=${(e: Event) => props.onCommunityResourceAddFormChange("tags", (e.target as HTMLInputElement).value)}
        />
      </div>
      <button
        class="second-brain-sync-btn"
        ?disabled=${!form.url.trim()}
        @click=${() => props.onCommunityResourceAdd()}
      >Add Resource</button>
    </div>
  `;
}
