/**
 * <gm-second-brain> — Second Brain tab component.
 *
 * Single-scroll dashboard replacing the old 3-subtab layout.
 * Sections: Memory Pulse → Search → Activity Feed → Identity → People → Knowledge Browser
 * Each section answers a user question about how their AI's memory works.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { formatAgo } from "../format.js";

// ── Types ────────────────────────────────────────────────────────────

export type MemorySystemStatus = {
  id: string;
  name: string;
  status: "ready" | "degraded" | "offline";
  detail: string;
  count?: number;
};

export type MemoryPulseData = {
  systems: MemorySystemStatus[];
  readyCount: number;
  totalCount: number;
};

export type ActivityEvent = {
  type: string;
  title: string;
  detail?: string;
  timestamp: string;
  source: string;
  scope?: "personal" | string;
};

export type ActivityFeedData = {
  events: ActivityEvent[];
  total: number;
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

export type BrainSearchResult = {
  path: string;
  name: string;
  type?: string;
  section?: string;
  excerpt?: string;
  matchContext?: string;
  source?: string;
  scope?: "personal" | string;
};

export type BrainTreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  size?: number;
  updatedAt?: string;
  childCount?: number;
  children?: BrainTreeNode[];
};

export type ScreenpipeStatusData = {
  enabled: boolean;
  available: boolean;
  installed: boolean;
  version: string | null;
  pid: number | null;
  managedByUs: boolean;
  apiUrl: string;
  blockedApps: string[];
  retention: Record<string, unknown>;
};

export type IngestionPipeline = {
  name: string;
  configured: boolean;
  envVar: string;
};

export type IngestionStatusData = {
  pipelines: IngestionPipeline[];
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

// Keep these exports for backward compat with controller imports
export type SecondBrainSubtab = "identity" | "knowledge" | "context";
export type SecondBrainFileData = { content: string | null; updatedAt: string | null };
export type SecondBrainEntryDetail = { name: string; content: string; updatedAt: string | null; relativePath?: string };
export type SecondBrainAiPacketData = { snapshot: { content: string; updatedAt?: string | null; lineCount: number } | null };
export type SecondBrainSourceEntry = { id: string; name: string; type: string; status: "connected" | "available"; icon: string; description: string; stats?: string; lastSync?: string | null };
export type SecondBrainSourcesData = { sources: SecondBrainSourceEntry[]; connectedCount: number; totalCount: number };
export type SecondBrainResearchData = { categories: Array<{ key: string; label: string; path: string; entries: SecondBrainMemoryEntry[] }>; totalEntries: number };
export type SecondBrainProps = Record<string, unknown>;
export type ResearchFrontmatter = Record<string, unknown>;
export type ResearchEntry = SecondBrainMemoryEntry;
export type ResearchCategory = { key: string; label: string; path: string; entries: SecondBrainMemoryEntry[] };

// ── Render Helpers ───────────────────────────────────────────────────

function fmtAgo(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try { return formatAgo(new Date(isoString).getTime()); } catch { return ""; }
}

function renderMd(content: string) {
  return html`<div class="sb-md-body">${unsafeHTML(toSanitizedMarkdownHtml(content))}</div>`;
}

const STATUS_DOT: Record<string, string> = {
  ready: "sb-dot--ready",
  degraded: "sb-dot--degraded",
  offline: "sb-dot--offline",
};

const ACTIVITY_ICONS: Record<string, string> = {
  "vault-capture": "\u{1F4DD}",
  "identity-update": "\u{1F464}",
  "calendar-enrichment": "\u{1F4C5}",
  "thought-captured": "\u{1F4AD}",
  "search": "\u{1F50D}",
  "file-modified": "\u{1F4C4}",
};

const SOURCE_LABELS: Record<string, string> = {
  honcho: "\u{1F7E3}",
  vault: "\u{1F4D3}",
  session: "\u{1F4AC}",
  screenpipe: "\u{1F4FA}",
};

function renderScopeBadge(scope?: string) {
  if (!scope || scope === "personal") {
    return html`<span class="sb-scope-badge sb-scope-badge--personal" title="Personal memory">\u{1F512} personal</span>`;
  }
  return html`<span class="sb-scope-badge sb-scope-badge--shared" title="Shared to ${scope}">\u{2197}\u{FE0F} ${scope}</span>`;
}

// ── Component ────────────────────────────────────────────────────────

@customElement("gm-second-brain")
export class GmSecondBrain extends LitElement {
  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // Dashboard state
  @state() loading = false;
  @state() error: string | null = null;
  @state() pulse: MemoryPulseData | null = null;
  @state() activity: ActivityFeedData | null = null;
  @state() identity: SecondBrainIdentityData | null = null;
  @state() memoryBank: SecondBrainMemoryBankData | null = null;
  @state() fileTree: BrainTreeNode[] | null = null;

  // Screenpipe & Ingestion
  @state() screenpipeStatus: ScreenpipeStatusData | null = null;
  @state() screenpipeSetupBusy = false;
  @state() ingestionStatus: IngestionStatusData | null = null;

  // Search
  @state() searchQuery = "";
  @state() searchResults: BrainSearchResult[] | null = null;
  @state() searching = false;

  // Folder browsing
  @state() browsingFolder: string | null = null;
  @state() folderEntries: SecondBrainMemoryEntry[] | null = null;
  @state() folderName: string | null = null;

  // Expanded pulse detail
  @state() expandedPulseSystem: string | null = null;

  private _unsubs: Array<() => void> = [];
  private _searchTimer: ReturnType<typeof setTimeout> | null = null;

  override createRenderRoot() { return this; }

  override connectedCallback() {
    super.connectedCallback();
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "second-brain") void this._loadAll();
      }),
    );
    void this._loadAll();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    if (this._searchTimer) clearTimeout(this._searchTimer);
    super.disconnectedCallback();
  }

  // ── Data Loading ──────────────────────────────────────────────────

  private async _loadAll(): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    this.loading = true;
    this.error = null;

    try {
      const gw = this.ctx.gateway;
      const [pulse, activity, identityData, bank, tree] = await Promise.all([
        gw.request<MemoryPulseData>("secondBrain.memoryPulse", {}),
        gw.request<ActivityFeedData>("secondBrain.activity", { limit: 20 }),
        gw.request<SecondBrainIdentityData>("secondBrain.identity", {}),
        gw.request<SecondBrainMemoryBankData>("secondBrain.memoryBank", {}),
        gw.request<{ tree: BrainTreeNode[] }>("secondBrain.fileTree", { depth: 3 }),
      ]);

      this.pulse = pulse;
      this.activity = activity;
      this.identity = identityData;
      this.memoryBank = bank;
      this.fileTree = tree.tree ?? [];

      // Load screenpipe + ingestion status (non-blocking — these methods may not exist yet)
      Promise.all([
        gw.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {}).catch(() => null),
        gw.request<IngestionStatusData>("ingestion.status", {}).catch(() => null),
      ]).then(([sp, ing]) => {
        this.screenpipeStatus = sp;
        this.ingestionStatus = ing;
      });
    } catch (err) {
      console.error("[SecondBrain] Load failed:", err);
      this.error = err instanceof Error ? err.message : "Failed to load";
    } finally {
      this.loading = false;
    }
  }

  private async _doSearch(query: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected || !query.trim()) {
      this.searchResults = null;
      this.searching = false;
      return;
    }
    this.searching = true;
    try {
      const result = await this.ctx.gateway.request<{ results: BrainSearchResult[] }>(
        "secondBrain.search", { query, limit: 30 },
      );
      if (this.searchQuery === query) {
        this.searchResults = result.results ?? [];
      }
    } catch (err) {
      console.error("[SecondBrain] Search failed:", err);
    } finally {
      this.searching = false;
    }
  }

  private _onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery = val;
    if (this._searchTimer) clearTimeout(this._searchTimer);
    if (!val.trim()) {
      this.searchResults = null;
      return;
    }
    this._searchTimer = setTimeout(() => void this._doSearch(val), 300);
  }

  private async _openFile(path: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      const result = await this.ctx.gateway.request<{
        name: string; content: string; updatedAt?: string;
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
      console.error("[SecondBrain] Open file failed:", err);
      this.ctx.addToast("Failed to open file", "error");
    }
  }

  private async _browseFolder(path: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      const result = await this.ctx.gateway.request<{
        folder: string; folderName: string; entries: SecondBrainMemoryEntry[];
      }>("secondBrain.memoryBank", { folder: path });
      this.browsingFolder = result.folder;
      this.folderName = result.folderName;
      this.folderEntries = result.entries;
    } catch (err) {
      console.error("[SecondBrain] Browse folder failed:", err);
    }
  }

  private _exitFolder(): void {
    this.browsingFolder = null;
    this.folderEntries = null;
    this.folderName = null;
  }

  private _chatNavigate(message: string): void {
    appEventBus.emit("chat-navigate", {
      sessionKey: "new",
      tab: "chat" as Parameters<AppContext["setTab"]>[0],
      message,
    });
  }

  // ── Render ────────────────────────────────────────────────────────

  override render() {
    if (this.loading && !this.pulse) {
      return html`<div class="sb-loading"><div class="sb-spinner"></div>Loading Second Brain...</div>`;
    }

    if (this.error && !this.pulse) {
      return html`<div class="sb-error">${this.error}</div>`;
    }

    // Folder browsing mode
    if (this.browsingFolder && this.folderEntries) {
      return html`
        <section class="sb-dashboard">
          <button class="sb-back-btn" @click=${() => this._exitFolder()}>
            \u{2190} Back
          </button>
          <div class="sb-section">
            <div class="sb-section-header">
              <span class="sb-section-title">${this.folderName ?? "Folder"}</span>
              <span class="sb-section-count">${this.folderEntries.length}</span>
            </div>
            <div class="sb-entry-list">
              ${this.folderEntries.length > 0
                ? this.folderEntries.map((e) => this._renderEntry(e))
                : html`<div class="sb-empty-inline">Empty folder</div>`}
            </div>
          </div>
        </section>
      `;
    }

    return html`
      <section class="sb-dashboard">
        ${this._renderMemoryPulse()}
        ${this._renderSearch()}
        ${this.searchQuery.trim() ? nothing : html`
          ${this._renderActivityFeed()}
          ${this._renderIdentityCard()}
          ${this._renderPeopleEntities()}
          ${this._renderKnowledgeBrowser()}
          ${this._renderScreenpipePanel()}
          ${this._renderIngestionStatus()}
        `}
      </section>
    `;
  }

  // ── Section 1: Memory Pulse ──────────────────────────────────────

  private _renderMemoryPulse() {
    if (!this.pulse) return nothing;

    return html`
      <div class="sb-pulse">
        <div class="sb-pulse-systems">
          ${this.pulse.systems.map((sys) => html`
            <button
              class="sb-pulse-pill"
              @click=${() => {
                this.expandedPulseSystem = this.expandedPulseSystem === sys.id ? null : sys.id;
              }}
            >
              <span class="sb-dot ${STATUS_DOT[sys.status] ?? "sb-dot--offline"}"></span>
              <span class="sb-pulse-name">${sys.name}</span>
            </button>
          `)}
          <span class="sb-pulse-summary">${this.pulse.readyCount}/${this.pulse.totalCount} systems</span>
        </div>
        ${this.expandedPulseSystem ? html`
          <div class="sb-pulse-detail">
            ${this.pulse.systems
              .filter(s => s.id === this.expandedPulseSystem)
              .map(s => html`
                <div class="sb-pulse-detail-row">
                  <span class="sb-dot ${STATUS_DOT[s.status]}"></span>
                  <strong>${s.name}</strong>
                  <span class="sb-muted">${s.detail}</span>
                  ${s.count != null ? html`<span class="sb-badge">${s.count}</span>` : nothing}
                </div>
              `)}
          </div>
        ` : nothing}
      </div>
    `;
  }

  // ── Section 2: Unified Search ────────────────────────────────────

  private _renderSearch() {
    return html`
      <div class="sb-search-container">
        <div class="sb-search-bar">
          <span class="sb-search-icon">\u{1F50D}</span>
          <input
            class="sb-search-input"
            type="text"
            placeholder="Search your memory \u2014 conversations, vault, sessions, screen recall..."
            .value=${this.searchQuery}
            @input=${(e: Event) => this._onSearchInput(e)}
          />
          ${this.searching ? html`<div class="sb-spinner sb-spinner--sm"></div>` : nothing}
        </div>
        ${this.searchResults ? html`
          <div class="sb-search-results">
            <div class="sb-section-header">
              <span class="sb-section-title">Results</span>
              <span class="sb-section-count">${this.searchResults.length}</span>
            </div>
            ${this.searchResults.length > 0
              ? html`<div class="sb-entry-list">
                  ${this.searchResults.map((r) => html`
                    <div class="sb-entry" @click=${() => this._openFile(r.path)}>
                      <div class="sb-entry-icon">\u{1F4C4}</div>
                      <div class="sb-entry-body">
                        <div class="sb-entry-name">
                          ${r.name}
                          ${r.source ? html`<span class="sb-source-tag">${SOURCE_LABELS[r.source] ?? ""} ${r.source}</span>` : nothing}
                          ${r.scope ? renderScopeBadge(r.scope) : nothing}
                        </div>
                        ${r.matchContext ?? r.excerpt
                          ? html`<div class="sb-entry-excerpt">${r.matchContext ?? r.excerpt}</div>`
                          : nothing}
                      </div>
                    </div>
                  `)}
                </div>`
              : html`<div class="sb-empty-inline">No results for "${this.searchQuery}"</div>`}
          </div>
        ` : nothing}
      </div>
    `;
  }

  // ── Section 3: Activity Feed ─────────────────────────────────────

  private _renderActivityFeed() {
    if (!this.activity || this.activity.events.length === 0) {
      return html`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">Recent Activity</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">No memory activity yet. As your ally learns, activity will appear here.</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Recent Activity</span>
          <span class="sb-section-count">${this.activity.total} events</span>
        </div>
        <div class="sb-activity-feed">
          ${this.activity.events.slice(0, 15).map((ev) => html`
            <div class="sb-activity-item">
              <span class="sb-activity-icon">${ACTIVITY_ICONS[ev.type] ?? "\u{2022}"}</span>
              <div class="sb-activity-body">
                <span class="sb-activity-title">${ev.title}</span>
                ${ev.detail ? html`<span class="sb-activity-detail">${ev.detail}</span>` : nothing}
              </div>
              ${ev.scope ? renderScopeBadge(ev.scope) : nothing}
              <span class="sb-activity-time">${fmtAgo(ev.timestamp)}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // ── Section 4: Identity Card ─────────────────────────────────────

  private _renderIdentityCard() {
    if (!this.identity || this.identity.files.length === 0) {
      return html`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">Identity</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Tell your ally about yourself to build your identity profile.</div>
            <button class="sb-action-btn" @click=${() => this._chatNavigate(
              "I want to build my identity profile. Ask me about my values, principles, vision, and communication style.",
            )}>Tell your ally about you</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Identity</span>
          <button class="sb-action-btn sb-action-btn--sm" @click=${() => this._chatNavigate(
            "I want to update my identity profile. Ask me what I'd like to change.",
          )}>Edit via Chat</button>
        </div>
        <div class="sb-identity-grid">
          ${this.identity.files.map((file) => html`
            <div class="sb-identity-card" @click=${() => this._openFile(file.key)}>
              <div class="sb-identity-label">${file.label}</div>
              <div class="sb-identity-excerpt">${file.content.slice(0, 100).replace(/[#\n]+/g, " ").trim()}\u{2026}</div>
              ${file.updatedAt ? html`<div class="sb-identity-time">${fmtAgo(file.updatedAt)}</div>` : nothing}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // ── Section 5: People & Entities ─────────────────────────────────

  private _renderPeopleEntities() {
    if (!this.memoryBank) return nothing;

    const peopleSection = this.memoryBank.sections.find(s => s.key === "people");
    const companiesSection = this.memoryBank.sections.find(s => s.key === "companies");
    const hasPeople = (peopleSection?.entries.length ?? 0) > 0;
    const hasCompanies = (companiesSection?.entries.length ?? 0) > 0;

    if (!hasPeople && !hasCompanies) {
      return html`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">People & Companies</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Your ally will build profiles for people and companies as you mention them.</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">People & Companies</span>
          <span class="sb-section-count">${(peopleSection?.entries.length ?? 0) + (companiesSection?.entries.length ?? 0)}</span>
        </div>
        <div class="sb-people-grid">
          ${(peopleSection?.entries ?? []).map((e) => html`
            <div class="sb-person-card" @click=${() => this._openFile(e.path)}>
              <div class="sb-person-icon">\u{1F464}</div>
              <div class="sb-person-body">
                <div class="sb-person-name">${e.name}</div>
                ${e.excerpt ? html`<div class="sb-person-excerpt">${e.excerpt}</div>` : nothing}
              </div>
              ${e.updatedAt ? html`<div class="sb-person-time">${fmtAgo(e.updatedAt)}</div>` : nothing}
            </div>
          `)}
          ${(companiesSection?.entries ?? []).map((e) => html`
            <div class="sb-person-card" @click=${() => this._openFile(e.path)}>
              <div class="sb-person-icon">\u{1F3E2}</div>
              <div class="sb-person-body">
                <div class="sb-person-name">${e.name}</div>
                ${e.excerpt ? html`<div class="sb-person-excerpt">${e.excerpt}</div>` : nothing}
              </div>
              ${e.updatedAt ? html`<div class="sb-person-time">${fmtAgo(e.updatedAt)}</div>` : nothing}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // ── Section 6: Knowledge Browser ─────────────────────────────────

  private _renderKnowledgeBrowser() {
    // Projects section
    const projectsSection = this.memoryBank?.sections.find(s => s.key === "projects");
    const hasProjects = (projectsSection?.entries.length ?? 0) > 0;
    const hasCurated = !!this.memoryBank?.curated;
    const hasExtras = (this.memoryBank?.extraFiles.length ?? 0) > 0;
    const hasTree = (this.fileTree?.length ?? 0) > 0;

    if (!hasProjects && !hasCurated && !hasExtras && !hasTree) return nothing;

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Knowledge</span>
        </div>

        ${hasProjects ? html`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F4C2} Projects</span>
              <span class="sb-section-count">${projectsSection!.entries.length}</span>
            </summary>
            <div class="sb-entry-list">
              ${projectsSection!.entries.map((e) => this._renderEntry(e))}
            </div>
          </details>
        ` : nothing}

        ${hasCurated ? html`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{2B50} Curated Facts</span>
            </summary>
            <div class="sb-card">${renderMd(this.memoryBank!.curated!.content)}</div>
          </details>
        ` : nothing}

        ${hasExtras ? html`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F4CB} Reference Files</span>
              <span class="sb-section-count">${this.memoryBank!.extraFiles.length}</span>
            </summary>
            <div class="sb-entry-list">
              ${this.memoryBank!.extraFiles.map((e) => this._renderEntry(e))}
            </div>
          </details>
        ` : nothing}

        ${hasTree ? html`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F5C2}\uFE0F Browse All Files</span>
            </summary>
            ${this._renderFileTree(this.fileTree!, 0)}
          </details>
        ` : nothing}
      </div>
    `;
  }

  // ── Section 7: Screenpipe Panel ──────────────────────────────────

  private _renderScreenpipePanel() {
    const sp = this.screenpipeStatus;
    const busy = this.screenpipeSetupBusy;

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">\u{1F4FA} Ambient Memory (Screenpipe)</span>
          ${sp ? html`
            <span class="sb-dot ${sp.available ? "sb-dot--ready" : sp.installed ? "sb-dot--degraded" : "sb-dot--offline"}"></span>
          ` : nothing}
        </div>
        ${!sp ? html`
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Loading Screenpipe status...</div>
          </div>
        ` : !sp.installed ? html`
          <div class="sb-screenpipe-setup">
            <div class="sb-setup-message">
              Ambient Memory captures what's on your screen and in your audio, locally.
              Your ally uses it to recall context you've seen. All data stays on your machine.
            </div>
            <button
              class="sb-action-btn"
              ?disabled=${busy}
              @click=${() => this._setupScreenpipe()}
            >${busy ? "Installing..." : "Enable Ambient Memory"}</button>
          </div>
        ` : !sp.available ? html`
          <div class="sb-screenpipe-setup">
            <div class="sb-setup-message">
              Screenpipe is installed${sp.version ? ` (${sp.version})` : ""} but not running.
            </div>
            <button
              class="sb-action-btn"
              ?disabled=${busy}
              @click=${() => this._startScreenpipe()}
            >${busy ? "Starting..." : "Start Screenpipe"}</button>
          </div>
        ` : html`
          <div class="sb-screenpipe-active">
            <div class="sb-screenpipe-row">
              <span class="sb-screenpipe-label">Status</span>
              <span class="sb-screenpipe-value">${sp.enabled ? "Active — capturing" : "Connected but not enabled"}</span>
            </div>
            ${sp.version ? html`
              <div class="sb-screenpipe-row">
                <span class="sb-screenpipe-label">Version</span>
                <span class="sb-screenpipe-value">${sp.version}</span>
              </div>
            ` : nothing}
            <div class="sb-screenpipe-row">
              <span class="sb-screenpipe-label">Blocked Apps</span>
              <span class="sb-screenpipe-value">${sp.blockedApps?.length ?? 0} apps filtered</span>
            </div>
            <div class="sb-screenpipe-actions">
              ${!sp.enabled ? html`
                <button class="sb-action-btn" @click=${() => this._toggleScreenpipe(true)}>Enable Ambient Memory</button>
              ` : html`
                <button class="sb-action-btn sb-action-btn--muted" @click=${() => this._toggleScreenpipe(false)}>Pause</button>
              `}
            </div>
          </div>
        `}
      </div>
    `;
  }

  /** One-click setup: install + start + enable. Brew install can take 5+ min. */
  private async _setupScreenpipe(): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    this.screenpipeSetupBusy = true;
    try {
      const result = await this.ctx.gateway.request<{ success: boolean; error?: string }>(
        "ingestion.screenpipeSetup", {}, 300_000 // 5 min — brew install is slow
      );
      if (result.success) {
        this.ctx.addToast("Ambient Memory enabled! Screenpipe is running.", "success");
        const status = await this.ctx.gateway.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {});
        this.screenpipeStatus = status;
      } else {
        this.ctx.addToast(result.error ?? "Setup failed", "error");
      }
    } catch {
      this.ctx.addToast("Screenpipe setup failed — check logs for details", "error");
    } finally {
      this.screenpipeSetupBusy = false;
    }
  }

  /** Start the daemon (already installed). */
  private async _startScreenpipe(): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    this.screenpipeSetupBusy = true;
    try {
      const result = await this.ctx.gateway.request<{ success: boolean; error?: string }>(
        "ingestion.screenpipeStart", {}, 30_000 // 30s — daemon startup + health check
      );
      if (result.success) {
        this.ctx.addToast("Screenpipe daemon started", "success");
        const status = await this.ctx.gateway.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {});
        this.screenpipeStatus = status;
      } else {
        this.ctx.addToast(result.error ?? "Failed to start", "error");
      }
    } catch {
      this.ctx.addToast("Failed to start Screenpipe daemon", "error");
    } finally {
      this.screenpipeSetupBusy = false;
    }
  }

  private async _toggleScreenpipe(enabled: boolean): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      await this.ctx.gateway.request("ingestion.screenpipeConfigure", { enabled });
      if (this.screenpipeStatus) {
        this.screenpipeStatus = { ...this.screenpipeStatus, enabled };
      }
      this.ctx.addToast(enabled ? "Ambient memory enabled" : "Ambient memory paused", "success");
    } catch {
      this.ctx.addToast("Failed to update Screenpipe config", "error");
    }
  }

  // ── Section 8: Ingestion Pipelines ─────────────────────────────

  private _renderIngestionStatus() {
    const ing = this.ingestionStatus;
    if (!ing) return nothing;

    const configured = ing.pipelines.filter(p => p.configured);
    const unconfigured = ing.pipelines.filter(p => !p.configured);

    return html`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">\u{1F504} Data Sources</span>
          <span class="sb-section-count">${configured.length}/${ing.pipelines.length} connected</span>
        </div>
        ${configured.length > 0 ? html`
          <div class="sb-ingestion-list">
            ${configured.map(p => html`
              <div class="sb-ingestion-item sb-ingestion-item--active">
                <span class="sb-dot sb-dot--ready"></span>
                <span class="sb-ingestion-name">${p.name}</span>
                <span class="sb-ingestion-badge">Connected</span>
              </div>
            `)}
          </div>
        ` : nothing}
        ${unconfigured.length > 0 ? html`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>Available Sources</span>
              <span class="sb-section-count">${unconfigured.length}</span>
            </summary>
            <div class="sb-ingestion-list">
              ${unconfigured.map(p => html`
                <div class="sb-ingestion-item">
                  <span class="sb-dot sb-dot--offline"></span>
                  <span class="sb-ingestion-name">${p.name}</span>
                  <span class="sb-muted">${p.envVar}</span>
                </div>
              `)}
            </div>
          </details>
        ` : nothing}
      </div>
    `;
  }

  // ── Shared Renderers ─────────────────────────────────────────────

  private _renderEntry(entry: SecondBrainMemoryEntry) {
    const isDir = entry.isDirectory;
    const icon = isDir ? "\u{1F4C1}" : "\u{1F4C4}";
    const handleClick = () => {
      if (isDir) this._browseFolder(entry.path);
      else this._openFile(entry.path);
    };

    return html`
      <div class="sb-entry" @click=${handleClick}>
        <div class="sb-entry-icon ${isDir ? "sb-entry-icon--folder" : ""}">${icon}</div>
        <div class="sb-entry-body">
          <div class="sb-entry-name">${entry.name}${isDir ? "/" : ""}</div>
          ${entry.excerpt ? html`<div class="sb-entry-excerpt">${entry.excerpt}</div>` : nothing}
        </div>
        ${entry.updatedAt ? html`<div class="sb-entry-meta">${fmtAgo(entry.updatedAt)}</div>` : nothing}
      </div>
    `;
  }

  private _renderFileTree(nodes: BrainTreeNode[], depth: number) {
    return html`
      <div class="sb-file-tree" style="padding-left: ${depth * 16}px">
        ${nodes.map((node) => {
          if (node.type === "folder") {
            return html`
              <details class="sb-tree-folder">
                <summary class="sb-tree-item sb-tree-folder-name">
                  <span class="sb-file-icon">\u{1F4C1}</span>
                  <span>${node.name}</span>
                  ${node.childCount != null ? html`<span class="sb-tree-count">${node.childCount}</span>` : nothing}
                </summary>
                ${node.children ? this._renderFileTree(node.children, depth + 1) : nothing}
              </details>
            `;
          }
          return html`
            <button class="sb-tree-item sb-tree-file" @click=${() => this._openFile(node.path)}>
              <span class="sb-file-icon">\u{1F4C4}</span>
              <span class="sb-file-name">${node.name}</span>
              ${node.size != null ? html`<span class="sb-tree-size">${node.size < 1024 ? `${node.size}B` : `${(node.size / 1024).toFixed(1)}K`}</span>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }
}

// Backward compat: export renderSecondBrain for anything that imports it
export function renderSecondBrain() { return nothing; }

declare global {
  interface HTMLElementTagNameMap {
    "gm-second-brain": GmSecondBrain;
  }
}
