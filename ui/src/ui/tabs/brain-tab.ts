/**
 * <gm-brain> — Brain tab component.
 *
 * The flagship Brain tab: Identity Card → three-panel dashboard (Pulse, People, Knowledge)
 * → collapsible Engine section (Memory Layers, Ingestion, MCP).
 * Evolved from second-brain-tab.ts.
 */

import { LitElement, html, nothing, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { formatAgo } from "../format.js";

// Re-export types for backward compat
export type {
  MemoryPulseData,
  MemorySystemStatus,
  ActivityEvent,
  ActivityFeedData,
  BrainSearchResult,
  BrainTreeNode,
  SecondBrainMemoryEntry,
  SecondBrainMemorySection,
  SecondBrainMemoryBankData,
  ScreenpipeStatusData,
  IngestionPipeline,
  IngestionStatusData,
  VaultHealthData,
} from "./second-brain-tab.js";

import type {
  MemoryPulseData,
  MemorySystemStatus,
  ActivityFeedData,
  ActivityEvent,
  BrainSearchResult,
  BrainTreeNode,
  SecondBrainMemoryEntry,
  SecondBrainMemoryBankData,
  ScreenpipeStatusData,
  IngestionStatusData,
  VaultHealthData,
} from "./second-brain-tab.js";

// ── Types ────────────────────────────────────────────────────────────

type IdentityCardData = {
  peerRepresentation: string | null;
  currentFocus: string | null;
  name: string;
  tagline: string;
  stats: { peopleTracked: number; dailyNotes: number; totalNotes: number };
  lastUpdated: string | null;
};

type RecentPerson = SecondBrainMemoryEntry & { role?: string };

type McpStatusData = {
  enabled: boolean;
  transport: string | null;
  connectedClients: number;
  url: string | null;
};

// ── Render Helpers ───────────────────────────────────────────────────

function fmtAgo(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try { return formatAgo(new Date(isoString).getTime()); } catch { return ""; }
}

function renderMd(content: string) {
  return html`<div class="brain-md-body">${unsafeHTML(toSanitizedMarkdownHtml(content))}</div>`;
}

const STATUS_DOT: Record<string, string> = {
  ready: "brain-dot--ready",
  degraded: "brain-dot--degraded",
  offline: "brain-dot--offline",
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
  if (!scope || scope === "personal") return nothing;
  return html`<span class="brain-scope-badge brain-scope-badge--shared" title="Shared to ${scope}">\u{2197}\u{FE0F} ${scope}</span>`;
}

// ── Component ────────────────────────────────────────────────────────

@customElement("gm-brain")
export class GmBrain extends LitElement {
  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // Identity Card
  @state() identityCard: IdentityCardData | null = null;

  // Dashboard data
  @state() loading = false;
  @state() error: string | null = null;
  @state() pulse: MemoryPulseData | null = null;
  @state() activity: ActivityFeedData | null = null;
  @state() memoryBank: SecondBrainMemoryBankData | null = null;
  @state() fileTree: BrainTreeNode[] | null = null;
  @state() vaultHealth: VaultHealthData | null = null;

  // People panel
  @state() recentPeople: RecentPerson[] | null = null;
  @state() peopleTotalCount = 0;
  @state() peopleSearch = "";

  // Screenpipe & Ingestion
  @state() screenpipeStatus: ScreenpipeStatusData | null = null;
  @state() ingestionStatus: IngestionStatusData | null = null;
  @state() mcpStatusData: McpStatusData | null = null;

  // Search
  @state() searchQuery = "";
  @state() searchResults: BrainSearchResult[] | null = null;
  @state() searching = false;

  // Engine
  @state() expandedPulseSystem: string | null = null;

  // Folder browsing
  @state() browsingFolder: string | null = null;
  @state() folderEntries: SecondBrainMemoryEntry[] | null = null;
  @state() folderName: string | null = null;

  private _unsubs: Array<() => void> = [];
  private _searchTimer: ReturnType<typeof setTimeout> | null = null;
  private _activityTimer: ReturnType<typeof setInterval> | null = null;

  override createRenderRoot() { return this; }

  override connectedCallback() {
    super.connectedCallback();
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "brain" || payload.target === "second-brain") void this._loadAll();
      }),
    );
    void this._loadAll();
    // Auto-refresh activity every 60s
    this._activityTimer = setInterval(() => void this._refreshActivity(), 60_000);
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    if (this._searchTimer) clearTimeout(this._searchTimer);
    if (this._activityTimer) clearInterval(this._activityTimer);
    super.disconnectedCallback();
  }

  // ── Data Loading ──────────────────────────────────────────────────

  private async _loadAll(): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    this.loading = true;
    this.error = null;

    try {
      const gw = this.ctx.gateway;

      // Phase 1: Fast — render identity + pulse immediately
      const [pulse, card, people] = await Promise.all([
        gw.request<MemoryPulseData>("secondBrain.memoryPulse", {}),
        gw.request<IdentityCardData>("secondBrain.identityCard", {}).catch(() => null),
        gw.request<{ people: RecentPerson[]; total: number }>("secondBrain.recentPeople", { limit: 8 }).catch(() => null),
      ]);

      this.pulse = pulse;
      this.identityCard = card;
      this.recentPeople = people?.people ?? null;
      this.peopleTotalCount = people?.total ?? 0;
      this.loading = false; // Render what we have NOW

      // Phase 2: Lazy — heavier data loads in background
      Promise.all([
        gw.request<ActivityFeedData>("secondBrain.activity", { limit: 20 }).catch(() => null),
        gw.request<SecondBrainMemoryBankData>("secondBrain.memoryBank", {}).catch(() => null),
        gw.request<{ tree: BrainTreeNode[] }>("secondBrain.fileTree", { depth: 3 }).catch(() => ({ tree: [] })),
        gw.request<VaultHealthData>("secondBrain.vaultHealth", {}).catch(() => null),
      ]).then(([activity, bank, tree, health]) => {
        this.activity = activity;
        this.memoryBank = bank;
        this.fileTree = tree?.tree ?? [];
        this.vaultHealth = health;
      });

      // Phase 3: Non-blocking services
      Promise.all([
        gw.request<ScreenpipeStatusData>("ingestion.screenpipeStatus", {}).catch(() => null),
        gw.request<IngestionStatusData>("ingestion.status", {}).catch(() => null),
        gw.request<McpStatusData>("secondBrain.mcpStatus", {}).catch(() => null),
      ]).then(([sp, ing, mcp]) => {
        this.screenpipeStatus = sp;
        this.ingestionStatus = ing;
        this.mcpStatusData = mcp;
      });
    } catch (err) {
      console.error("[Brain] Load failed:", err);
      this.error = err instanceof Error ? err.message : "Failed to load";
      this.loading = false;
    }
  }

  private async _refreshActivity(): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      const activity = await this.ctx.gateway.request<ActivityFeedData>("secondBrain.activity", { limit: 20 });
      this.activity = activity;
    } catch { /* silent */ }
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
      console.error("[Brain] Search failed:", err);
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
      console.error("[Brain] Open file failed:", err);
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
      console.error("[Brain] Browse folder failed:", err);
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

  private async _toggleScreenpipe(enabled: boolean): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      await this.ctx.gateway.request("ingestion.screenpipeToggle", { enabled });
      if (this.screenpipeStatus) {
        this.screenpipeStatus = { ...this.screenpipeStatus, enabled };
      }
      this.ctx.addToast(enabled ? "Ambient memory enabled" : "Ambient memory paused", "success");
    } catch {
      this.ctx.addToast("Failed to update Screenpipe config", "error");
    }
  }

  private async _runPipeline(pipeline: string): Promise<void> {
    if (!this.ctx.gateway || !this.ctx.connected) return;
    try {
      await this.ctx.gateway.request("ingestion.runPipeline", { pipeline });
      this.ctx.addToast(`Pipeline "${pipeline}" triggered`, "success");
    } catch {
      this.ctx.addToast(`Failed to run pipeline "${pipeline}"`, "error");
    }
  }

  // ── Render ────────────────────────────────────────────────────────

  override render() {
    if (this.loading && !this.pulse && !this.identityCard) {
      return html`
        <div class="brain-loading" role="status" aria-label="Loading your Second Brain">
          <div class="brain-skeleton brain-skeleton--card"></div>
          <div class="brain-skeleton-row">
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
          </div>
        </div>
      `;
    }

    if (this.error && !this.pulse) {
      return html`<div class="brain-error" role="alert">${this.error}</div>`;
    }

    // Folder browsing mode
    if (this.browsingFolder && this.folderEntries) {
      return html`
        <section class="brain-dashboard">
          <button class="brain-back-btn" aria-label="Go back to dashboard" @click=${() => this._exitFolder()}>
            \u{2190} Back
          </button>
          <div class="brain-section">
            <div class="brain-section-header">
              <span class="brain-section-title">${this.folderName ?? "Folder"}</span>
              <span class="brain-section-count" aria-label="${this.folderEntries.length} items">${this.folderEntries.length}</span>
            </div>
            <div class="brain-entry-list" role="list" aria-label="Folder contents">
              ${this.folderEntries.length > 0
                ? this.folderEntries.map((e) => this._renderEntry(e))
                : html`<div class="brain-empty-inline">Empty folder</div>`}
            </div>
          </div>
        </section>
      `;
    }

    return html`
      <section class="brain-dashboard" aria-label="Your Second Brain dashboard">
        <div class="brain-header">
          <button
            class="brain-engine-toggle"
            @click=${() => { this.renderRoot.querySelector(".brain-engine")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            title="Scroll to Engine panel"
            aria-label="Scroll to Engine panel"
          >\u{2699}\u{FE0F} Engine ${this.pulse?.systems ? html`<span class="brain-engine-badge">${this.pulse.systems.filter(s => s.status === "ready").length}/${this.pulse.systems.length}</span>` : nothing}</button>
        </div>

        ${this._renderIdentityCard()}
        ${this._renderSearch()}
        ${this.searchQuery.trim() ? nothing : html`
          <div class="brain-panels">
            <div class="brain-panel brain-panel--pulse" role="region" aria-label="Memory pulse and activity">
              ${this._renderPulsePanel()}
            </div>
            <div class="brain-panel brain-panel--people" role="region" aria-label="People tracked">
              ${this._renderPeoplePanel()}
            </div>
            <div class="brain-panel brain-panel--knowledge" role="region" aria-label="Knowledge base">
              ${this._renderKnowledgePanel()}
            </div>
          </div>
          ${this._renderEngine()}
        `}
      </section>
    `;
  }

  // ── Identity Card ─────────────────────────────────────────────────

  private _renderIdentityCard() {
    const card = this.identityCard;

    if (!card) {
      return html`
        <div class="brain-identity-card brain-identity-card--empty" role="region" aria-label="Identity card">
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
            <button class="brain-action-btn" aria-label="Start building your identity profile" @click=${() => this._chatNavigate(
              "I want to build my identity profile. Ask me about my values, principles, vision, and communication style.",
            )}>Start chatting \u{2192}</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="brain-identity-card" role="region" aria-label="Identity card for ${card.name}">
        <div class="brain-id-header">
          <h2 class="brain-id-name">${card.name}</h2>
          ${card.tagline ? html`<p class="brain-id-tagline">${card.tagline}</p>` : nothing}
        </div>

        ${card.peerRepresentation ? html`
          <div class="brain-id-representation">
            ${renderMd(card.peerRepresentation)}
          </div>
        ` : html`
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
          </div>
        `}

        ${card.currentFocus ? html`
          <div class="brain-id-focus">
            <span class="brain-id-focus-label">Currently focused on:</span>
            <span class="brain-id-focus-text">${card.currentFocus}</span>
          </div>
        ` : nothing}

        <div class="brain-id-stats" role="group" aria-label="Brain statistics">
          <div class="brain-id-stat" aria-label="${card.stats.peopleTracked} people tracked">
            <span class="brain-id-stat-value">${card.stats.peopleTracked}</span>
            <span class="brain-id-stat-label">People</span>
          </div>
          <div class="brain-id-stat" aria-label="${card.stats.dailyNotes} daily notes">
            <span class="brain-id-stat-value">${card.stats.dailyNotes}</span>
            <span class="brain-id-stat-label">Daily Notes</span>
          </div>
          <div class="brain-id-stat" aria-label="${card.stats.totalNotes} total files">
            <span class="brain-id-stat-value">${card.stats.totalNotes}</span>
            <span class="brain-id-stat-label">Total Files</span>
          </div>
          ${this.pulse ? html`
            <div class="brain-id-stat">
              <span class="brain-id-stat-value">${this.pulse.readyCount}/${this.pulse.totalCount}</span>
              <span class="brain-id-stat-label">Systems</span>
            </div>
          ` : nothing}
        </div>

        <div class="brain-id-footer">
          <button class="brain-id-correct-btn" aria-label="Edit your identity card via chat" @click=${() => this._chatNavigate(
            "I want to correct something in my identity card. Here's what needs updating:",
          )}>Edit via Chat</button>
          ${card.lastUpdated ? html`
            <span class="brain-id-updated">Updated ${fmtAgo(card.lastUpdated)}</span>
          ` : nothing}
        </div>
      </div>
    `;
  }

  // ── Search ────────────────────────────────────────────────────────

  private _renderSearch() {
    return html`
      <div class="brain-search-container" role="search" aria-label="Search your Second Brain">
        <div class="brain-search-bar">
          <span class="brain-search-icon" aria-hidden="true">\u{1F50D}</span>
          <input
            class="brain-search-input"
            type="text"
            placeholder="Search your memory \u2014 Honcho, Vault, Sessions, Screenpipe..."
            .value=${this.searchQuery}
            @input=${(e: Event) => this._onSearchInput(e)}
            aria-label="Search your Second Brain"
            aria-controls="brain-search-results"
            aria-expanded=${this.searchResults ? "true" : "false"}
          />
          ${this.searching ? html`<div class="brain-spinner brain-spinner--sm" role="status" aria-label="Searching"></div>` : nothing}
        </div>
        <div id="brain-search-results" aria-live="polite" aria-atomic="false">
        ${this.searchResults ? html`
          <div class="brain-search-results" role="region" aria-label="Search results">
            <div class="brain-section-header">
              <span class="brain-section-title">Results</span>
              <span class="brain-section-count" aria-label="${this.searchResults.length} results found">${this.searchResults.length}</span>
            </div>
            ${this.searchResults.length > 0
              ? html`<div class="brain-entry-list" role="list">
                  ${this.searchResults.map((r) => html`
                    <div class="brain-entry" role="listitem" tabindex="0" aria-label="Open ${r.name}" @click=${() => this._openFile(r.path)} @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._openFile(r.path); } }}>
                      <div class="brain-entry-icon" aria-hidden="true">\u{1F4C4}</div>
                      <div class="brain-entry-body">
                        <div class="brain-entry-name">
                          ${r.name}
                          ${r.source ? html`<span class="brain-source-tag">${SOURCE_LABELS[r.source] ?? ""} ${r.source}</span>` : nothing}
                          ${r.scope ? renderScopeBadge(r.scope) : nothing}
                        </div>
                        ${r.matchContext ?? r.excerpt
                          ? html`<div class="brain-entry-excerpt">${r.matchContext ?? r.excerpt}</div>`
                          : nothing}
                      </div>
                    </div>
                  `)}
                </div>`
              : html`<div class="brain-empty-inline" role="status">No results for "${this.searchQuery}"</div>`}
          </div>
        ` : nothing}
        </div>
      </div>
    `;
  }

  // ── Pulse Panel (left) ────────────────────────────────────────────

  private _renderPulsePanel() {
    if (!this.activity || this.activity.events.length === 0) {
      return html`
        <h2 class="brain-panel-title">Pulse</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">No memory activity yet. As your ally learns, activity will appear here.</div>
        </div>
      `;
    }

    return html`
      <h2 class="brain-panel-title">Pulse
        <span class="brain-section-count">${this.activity.total} events</span>
      </h2>
      ${this.pulse ? html`
        <div class="brain-pulse-dots" role="status" aria-label="Memory system status: ${this.pulse.readyCount} of ${this.pulse.totalCount} systems ready">
          ${this.pulse.systems.map((sys) => html`
            <span class="brain-pulse-dot" title="${sys.name}: ${sys.status}${sys.detail ? ` \u2014 ${sys.detail}` : ""}" role="img" aria-label="${sys.name}: ${sys.status}${sys.detail ? ` \u2014 ${sys.detail}` : ""}">
              <span class="brain-dot ${STATUS_DOT[sys.status] ?? "brain-dot--offline"}" aria-hidden="true"></span>
              <span class="brain-pulse-label">${sys.name}</span>
            </span>
          `)}
        </div>
      ` : nothing}
      <div class="brain-activity-feed" role="log" aria-label="Memory activity feed">
        ${this.activity.events.slice(0, 12).map((ev) => html`
          <div class="brain-activity-item">
            <span class="brain-activity-icon">${ACTIVITY_ICONS[ev.type] ?? "\u{2022}"}</span>
            <div class="brain-activity-body">
              <span class="brain-activity-title">${ev.title}</span>
              ${ev.detail ? html`<span class="brain-activity-detail">${ev.detail}</span>` : nothing}
            </div>
            ${ev.scope ? renderScopeBadge(ev.scope) : nothing}
            <span class="brain-activity-time">${fmtAgo(ev.timestamp)}</span>
          </div>
        `)}
      </div>
    `;
  }

  // ── People Panel (center) ─────────────────────────────────────────

  private _renderPeoplePanel() {
    const people = this.recentPeople;
    const fallbackPeople = this.memoryBank?.sections.find(s => s.key === "people")?.entries ?? [];
    const displayPeople = people ?? fallbackPeople;
    const total = this.peopleTotalCount || fallbackPeople.length;

    if (displayPeople.length === 0) {
      return html`
        <h2 class="brain-panel-title">People</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">People you interact with will appear here. Connect your calendar to start.</div>
          <button class="brain-action-btn brain-action-btn--sm" aria-label="Connect your calendar to track people" @click=${() => this._chatNavigate(
            "Help me connect my calendar so my Brain can track the people I interact with.",
          )}>Connect Calendar \u{2192}</button>
        </div>
      `;
    }

    const filtered = this.peopleSearch
      ? displayPeople.filter(p => p.name.toLowerCase().includes(this.peopleSearch.toLowerCase()))
      : displayPeople;

    return html`
      <h2 class="brain-panel-title">People
        <span class="brain-section-count">${total} tracked</span>
      </h2>
      <input
        class="brain-people-search"
        type="text"
        placeholder="Filter people..."
        .value=${this.peopleSearch}
        @input=${(e: Event) => { this.peopleSearch = (e.target as HTMLInputElement).value; }}
        aria-label="Filter people"
      />
      <div class="brain-people-list" role="list" aria-label="People in your brain">
        ${filtered.slice(0, 8).map((p) => html`
          <div class="brain-person-card" role="listitem" tabindex="0" aria-label="Open profile for ${p.name}" @click=${() => this._openFile(p.path)} @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._openFile(p.path); } }}>
            <div class="brain-person-icon" aria-hidden="true">\u{1F464}</div>
            <div class="brain-person-body">
              <div class="brain-person-name">${p.name}</div>
              ${(p as RecentPerson).role ? html`<div class="brain-person-role">${(p as RecentPerson).role}</div>` : nothing}
              ${!((p as RecentPerson).role) && p.excerpt ? html`<div class="brain-person-excerpt">${p.excerpt}</div>` : nothing}
            </div>
            ${p.updatedAt ? html`<div class="brain-person-time">${fmtAgo(p.updatedAt)}</div>` : nothing}
          </div>
        `)}
      </div>
      ${total > 8 ? html`
        <button class="brain-see-all-btn" aria-label="See all people" @click=${() => {
          const section = this.memoryBank?.sections.find(s => s.key === "people");
          if (section) this._browseFolder(section.path);
        }}>See all \u{2192}</button>
      ` : nothing}
    `;
  }

  // ── Knowledge Panel (right) ───────────────────────────────────────

  private _renderKnowledgePanel() {
    const health = this.vaultHealth;
    const stats = health?.stats;
    const hasTree = (this.fileTree?.length ?? 0) > 0;
    const recentFiles = health?.recentActivity ?? [];

    return html`
      <h2 class="brain-panel-title">Knowledge</h2>
      ${stats ? html`
        <div class="brain-knowledge-stats">
          <div class="brain-kstat"><span class="brain-kstat-val">${stats.totalNotes}</span> notes</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${stats.projectCount}</span> projects</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${stats.brainCount}</span> brain files</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${stats.dailyCount}</span> dailies</div>
        </div>
      ` : html`
        <div class="brain-empty-block">
          <div class="brain-empty-hint">Your knowledge base grows automatically. Start working and your ally will capture the important stuff.</div>
        </div>
      `}

      ${recentFiles.length > 0 ? html`
        <div class="brain-knowledge-recent" role="list" aria-label="Recently modified files">
          <h3 class="brain-subsection-title">Recent</h3>
          ${recentFiles.slice(0, 5).map((f) => html`
            <div class="brain-entry brain-entry--compact" role="listitem" tabindex="0" aria-label="Open ${f.name}" @click=${() => this._openFile(f.path)} @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._openFile(f.path); } }}>
              <span class="brain-entry-icon" aria-hidden="true">\u{1F4C4}</span>
              <span class="brain-entry-name">${f.name}</span>
              <span class="brain-entry-meta">${fmtAgo(f.updatedAt)}</span>
            </div>
          `)}
        </div>
      ` : nothing}

      ${hasTree ? html`
        <details class="brain-collapsible">
          <summary class="brain-collapsible-header">
            <span>\u{1F5C2}\u{FE0F} Browse vault</span>
          </summary>
          ${this._renderFileTree(this.fileTree!, 0)}
        </details>
      ` : nothing}
    `;
  }

  // ── Engine Section (collapsible) ──────────────────────────────────

  private _renderEngine() {
    return html`
      <div class="brain-engine">
        <h2 class="brain-engine-title">Engine</h2>

        ${this._renderMemoryLayersTable()}
        ${this._renderIngestionTable()}
        ${this._renderMcpRow()}
        ${this._renderScreenpipeRow()}
      </div>
    `;
  }

  private _renderMemoryLayersTable() {
    if (!this.pulse) return nothing;

    return html`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Memory Layers</h3>
        <div class="brain-table brain-table--4col">
          <div class="brain-table-header brain-table-header--4col">
            <span>Layer</span><span>Status</span><span>Detail</span><span>Action</span>
          </div>
          ${this.pulse.systems.map((sys) => html`
            <div class="brain-table-row brain-table-row--4col brain-table-row--clickable"
                 @click=${() => this._chatNavigate(`Tell me about the ${sys.name} memory system. What's in it? How's it performing?`)}>
              <span class="brain-table-cell">
                <span class="brain-dot ${STATUS_DOT[sys.status] ?? "brain-dot--offline"}"></span>
                ${sys.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${sys.status}</span>
              <span class="brain-table-cell brain-table-cell--detail">${sys.detail}${sys.count != null ? ` (${sys.count})` : ""}</span>
              <span class="brain-table-cell brain-table-cell--action">
                ${sys.status === "offline" || sys.status === "degraded"
                  ? html`<button class="brain-action-btn brain-action-btn--small"
                      @click=${(e: Event) => { e.stopPropagation(); this._chatNavigate(`The ${sys.name} system is ${sys.status}. Can you diagnose and repair it?`); }}>
                      Repair</button>`
                  : html`<button class="brain-action-btn brain-action-btn--small"
                      @click=${(e: Event) => { e.stopPropagation(); this._chatNavigate(`Search my ${sys.name} for recent entries. Show me what you know.`); }}>
                      Explore</button>`
                }
              </span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private _renderIngestionTable() {
    const ing = this.ingestionStatus;
    if (!ing) return nothing;

    return html`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Ingestion Pipelines</h3>
        <div class="brain-table">
          <div class="brain-table-header">
            <span>Source</span><span>Status</span><span>Action</span>
          </div>
          ${ing.pipelines.map((p) => html`
            <div class="brain-table-row">
              <span class="brain-table-cell">
                <span class="brain-dot ${p.configured ? "brain-dot--ready" : "brain-dot--offline"}"></span>
                ${p.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${p.configured ? "Connected" : "Not configured"}</span>
              <span class="brain-table-cell">
                ${p.configured
                  ? html`<button class="brain-action-btn brain-action-btn--xs" aria-label="Run ${p.name} pipeline now" @click=${() => this._runPipeline(p.name)}>Run now</button>`
                  : html`<button class="brain-action-btn brain-action-btn--xs" @click=${() => this._chatNavigate(`Help me configure the ${p.name} ingestion pipeline. I need to set up ${p.envVar}.`)}>Set up</button>`}
              </span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private _renderMcpRow() {
    const enabled = this.mcpStatusData?.enabled;
    return html`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">MCP Server</h3>
        <div class="brain-mcp-row">
          <span class="brain-dot ${enabled ? "brain-dot--ready" : "brain-dot--offline"}"></span>
          <span>${enabled ? "Active" : "Inactive"}</span>
          <span class="brain-muted">${this.mcpStatusData?.transport ?? "stdio"} transport</span>
          ${!enabled ? html`
            <button class="brain-action-btn brain-action-btn--xs" @click=${() => this._chatNavigate("Help me set up the GodMode MCP server so I can use it with Claude Code or other MCP clients.")}>Set up</button>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderScreenpipeRow() {
    const sp = this.screenpipeStatus;
    return html`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Screenpipe (Ambient Memory)</h3>
        <div class="brain-screenpipe-row">
          <span class="brain-dot ${sp?.available ? (sp.enabled ? "brain-dot--ready" : "brain-dot--degraded") : "brain-dot--offline"}"></span>
          <span>${!sp ? "Loading..." : !sp.available ? "Not installed" : sp.enabled ? "Active" : "Paused"}</span>
          ${sp?.available ? html`
            <button class="brain-action-btn brain-action-btn--xs" aria-label="${sp.enabled ? "Pause ambient memory" : "Enable ambient memory"}" @click=${() => this._toggleScreenpipe(!sp.enabled)}>
              ${sp.enabled ? "Pause" : "Enable"}
            </button>
          ` : !sp?.available && sp !== null ? html`
            <button class="brain-action-btn brain-action-btn--xs" @click=${() => this._chatNavigate("Help me set up Screenpipe for ambient memory capture. Walk me through installation and configuration step by step.")}>Set up</button>
          ` : nothing}
        </div>
      </div>
    `;
  }

  // ── Shared Renderers ──────────────────────────────────────────────

  private _renderEntry(entry: SecondBrainMemoryEntry) {
    const isDir = entry.isDirectory;
    const icon = isDir ? "\u{1F4C1}" : "\u{1F4C4}";
    const handleClick = () => {
      if (isDir) this._browseFolder(entry.path);
      else this._openFile(entry.path);
    };

    return html`
      <div class="brain-entry" role="listitem" tabindex="0" aria-label="${isDir ? "Open folder" : "Open file"}: ${entry.name}" @click=${handleClick} @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}>
        <div class="brain-entry-icon ${isDir ? "brain-entry-icon--folder" : ""}" aria-hidden="true">${icon}</div>
        <div class="brain-entry-body">
          <div class="brain-entry-name">${entry.name}${isDir ? "/" : ""}</div>
          ${entry.excerpt ? html`<div class="brain-entry-excerpt">${entry.excerpt}</div>` : nothing}
        </div>
        ${entry.updatedAt ? html`<div class="brain-entry-meta">${fmtAgo(entry.updatedAt)}</div>` : nothing}
      </div>
    `;
  }

  private _renderFileTree(nodes: BrainTreeNode[], depth: number) {
    return html`
      <div class="brain-file-tree" role="tree" aria-label="${depth === 0 ? "Vault file browser" : ""}" style="padding-left: ${depth * 16}px">
        ${nodes.map((node) => {
          if (node.type === "folder") {
            return html`
              <details class="brain-tree-folder" role="treeitem" aria-label="Folder: ${node.name}${node.childCount != null ? `, ${node.childCount} items` : ""}">
                <summary class="brain-tree-item brain-tree-folder-name">
                  <span class="brain-file-icon" aria-hidden="true">\u{1F4C1}</span>
                  <span>${node.name}</span>
                  ${node.childCount != null ? html`<span class="brain-tree-count">${node.childCount}</span>` : nothing}
                </summary>
                ${node.children ? this._renderFileTree(node.children, depth + 1) : nothing}
              </details>
            `;
          }
          return html`
            <button class="brain-tree-item brain-tree-file" role="treeitem" aria-label="Open file: ${node.name}" @click=${() => this._openFile(node.path)}>
              <span class="brain-file-icon" aria-hidden="true">\u{1F4C4}</span>
              <span class="brain-file-name">${node.name}</span>
              ${node.size != null ? html`<span class="brain-tree-size">${node.size < 1024 ? `${node.size}B` : `${(node.size / 1024).toFixed(1)}K`}</span>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gm-brain": GmBrain;
  }
}
