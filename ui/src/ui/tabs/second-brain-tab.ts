/**
 * <gm-second-brain> — Extracted Second Brain tab component.
 *
 * Owns all 20 Second Brain @state properties (moved out of the God Component).
 * Consumes AppContext for shared state (connected, gateway, sidebar, toast, nav).
 * Delegates rendering to ../views/second-brain.js and data loading to
 * ../controllers/second-brain.js.  Cross-tab actions (save via chat, add source)
 * go through the event bus.
 */

import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import {
  renderSecondBrain,
  type SecondBrainSubtab,
  type SecondBrainIdentityData,
  type SecondBrainMemoryBankData,
  type SecondBrainAiPacketData,
  type SecondBrainSourcesData,
  type SecondBrainResearchData,
  type SecondBrainEntryDetail,
  type SecondBrainMemoryEntry,
  type VaultHealthData,
  type BrainTreeNode,
  type BrainSearchResult,
} from "../views/second-brain.js";
import {
  loadSecondBrain,
  loadSecondBrainEntry,
  browseFolder,
  syncSecondBrain,
  type SecondBrainState,
} from "../controllers/second-brain.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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
    const isHtml = path.endsWith(".html") || path.endsWith(".htm");

    // HTML files open directly in sidebar — bypass panel loading state
    if (isHtml) {
      try {
        const result = await this.ctx.gateway!.request<{
          name: string;
          content: string;
        }>("secondBrain.memoryBankEntry", { path });
        if (result?.content) {
          this.ctx.openSidebar({
            content: result.content,
            mimeType: "text/html",
            filePath: path,
            title: result.name || path.split("/").pop() || "File",
          });
        }
      } catch (err) {
        console.error("[SecondBrain] Failed to open HTML file:", err);
      }
      return;
    }

    await loadSecondBrainEntry(this as unknown as SecondBrainState, path);
    this.requestUpdate();
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
