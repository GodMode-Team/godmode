/**
 * <gm-chat> — Extracted Chat tab component.
 *
 * This is the MOST COMPLEX tab in the app with ~80 @state properties touching
 * messages, streaming, sessions, sidebar, attachments, ally panel, scroll state,
 * and more.
 *
 * BRIDGE PATTERN: For this first pass, the component uses a `host` property
 * pointing back to the parent GodModeApp. Chat is deeply coupled to app.ts
 * (shared sidebar state, session state, gateway state) so the bridge lets us
 * extract the rendering without moving all state immediately. Over time, state
 * and handlers will be pulled into this component or dedicated controllers.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";

// -- Render functions (pure view layers) ------------------------------------
import { renderChat, type ChatProps } from "../views/chat.js";

// -- Controller / helper imports --------------------------------------------
import { loadChatHistory } from "../controllers/chat.js";
import { refreshChatAvatar, saveDraft, restoreDraft } from "../app-chat.js";
import { scheduleChatScroll } from "../app-scroll.js";
import { syncUrlWithSessionKey } from "../app-settings.js";
import { getResolvedImageUrl, triggerImageResolve } from "../app-gateway.js";
import type { LightboxImage } from "../chat/lightbox.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-chat")
export class GmChat extends LitElement {
  // -- Shared context (provided by root app) --------------------------------

  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // -- Bridge: reference to the parent GodModeApp for handler delegation -----
  // This allows us to call handlers that haven't been migrated yet.
  // Over time, these will be pulled into this component or controllers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ attribute: false }) host!: any;

  // -- Owned state ----------------------------------------------------------
  // Currently none — all chat state still lives on the host via bridge.
  // Future passes will migrate state here piece by piece.

  @state() private _initialized = false;

  // -- Event-bus subscriptions ----------------------------------------------

  private _unsubs: Array<() => void> = [];

  // -- Light DOM (no shadow root) so existing CSS classes work ---------------

  override createRenderRoot() {
    return this;
  }

  // -- Lifecycle ------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();

    // Listen for cross-tab navigation requests (e.g. "open this session in chat")
    this._unsubs.push(
      appEventBus.on("chat-navigate", (payload) => {
        this._handleChatNavigate(payload);
      }),
    );

    // Listen for refresh requests targeting chat
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "chat") {
          void this._refresh();
        }
      }),
    );

    // Listen for sidebar events
    this._unsubs.push(
      appEventBus.on("sidebar-open", (payload) => {
        const s = this.host;
        if (!s) return;
        s.handleOpenSidebar(payload.content, {
          mimeType: payload.mimeType ?? null,
          filePath: payload.filePath ?? null,
          title: payload.title ?? null,
        });
      }),
    );

    this._unsubs.push(
      appEventBus.on("sidebar-close", () => {
        const s = this.host;
        if (!s) return;
        s.handleCloseSidebar();
      }),
    );

    this._initialized = true;
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // -- Render ---------------------------------------------------------------

  override render() {
    const s = this.host;
    if (!s) return html`<div class="chat-loading">Loading...</div>`;

    // Derived values (mirroring app-render.ts logic)
    const chatDisabledReason = s.connected ? null : "Disconnected from gateway.";
    const chatFocus = s.settings?.chatFocusMode || s.onboarding;
    const showThinking = s.onboarding ? false : s.settings?.chatShowThinking;
    const chatAvatarUrl = s.chatAvatarUrl ?? this._resolveAssistantAvatarUrl() ?? null;

    // Workspace welcome banner (shown before first message)
    const welcomeBanner =
      s.workspaceNeedsSetup && !s.chatMessages?.length
        ? html`
            <div class="workspace-welcome-banner">
              <div class="welcome-content">
                <div class="welcome-title">Welcome to GodMode</div>
                <div class="welcome-subtitle">
                  Set up your workspace through a quick conversation — projects, people, goals,
                  and integrations.
                </div>
                <button
                  class="welcome-cta"
                  @click=${() => {
                    s.workspaceNeedsSetup = false;
                    s.chatMessage = "Set up my GodMode workspace";
                    void s.handleSendChat("Set up my GodMode workspace");
                  }}
                >
                  Start Setup
                </button>
                <button
                  class="welcome-skip"
                  @click=${() => {
                    s.workspaceNeedsSetup = false;
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          `
        : nothing;

    const chatProps: ChatProps = {
      basePath: s.basePath,
      sessionKey: s.sessionKey,
      onSessionKeyChange: (next: string) => this._handleSessionKeyChange(next),
      thinkingLevel: s.chatThinkingLevel,
      showThinking,
      loading: s.chatLoading,
      sending: s.chatSending,
      sendingSessionKey: s.chatSendingSessionKey,
      compactionStatus: s.compactionStatus,
      assistantAvatarUrl: chatAvatarUrl,
      messages: s.chatMessages,
      toolMessages: s.chatToolMessages,
      stream: s.chatStream,
      streamStartedAt: s.chatStreamStartedAt,
      draft: s.chatMessage,
      queue: s.chatQueue,
      connected: s.connected,
      canSend: s.connected,
      disabledReason: chatDisabledReason,
      error: s.lastError,
      sessions: s.sessionsResult,
      focusMode: chatFocus,

      // Event handlers
      onRefresh: () => {
        s.resetToolStream();
        void s.loadSessionResources();
        triggerImageResolve(s);
        return Promise.all([loadChatHistory(s), refreshChatAvatar(s)]);
      },
      onToggleFocusMode: () => {
        if (s.onboarding) return;
        s.applySettings({
          ...s.settings,
          chatFocusMode: !s.settings.chatFocusMode,
        });
      },
      onChatScroll: (event: Event) => s.handleChatScroll(event),
      onDraftChange: (next: string) => (s.chatMessage = next),
      attachments: s.chatAttachments,
      onAttachmentsChange: (next) => (s.chatAttachments = next),
      showToast: (message, type) => s.showToast(message, type),
      onSend: (queue) => s.handleSendChat(undefined, { queue }),
      canAbort: Boolean(s.chatRunId),
      onAbort: () => void s.handleAbortChat(),
      onCompact: () => void s.handleCompactChat(),
      onQueueRemove: (id: string) => s.removeQueuedMessage(id),
      onNewSession: () => s.handleSendChat("/new", { restoreDraft: true }),

      // Sidebar props
      sidebarOpen: s.sidebarOpen,
      sidebarContent: s.sidebarContent,
      sidebarError: s.sidebarError,
      sidebarMimeType: s.sidebarMimeType,
      sidebarFilePath: s.sidebarFilePath,
      sidebarTitle: s.sidebarTitle,
      sidebarMode: s.sidebarMode,
      sidebarProofSlug: s.sidebarProofSlug,
      sidebarProofUrl: s.sidebarProofUrl,
      sidebarProofHtml: s.sidebarProofHtml,
      splitRatio: s.splitRatio,
      onOpenSidebar: (
        content: string,
        opts?: { mimeType?: string | null; filePath?: string | null; title?: string | null },
      ) => s.handleOpenSidebar(content, opts),
      onMessageLinkClick: (href: string) => s.handleOpenMessageFileLink(href),
      onCloseSidebar: () => s.handleCloseSidebar(),
      onOpenProof: (slug: string) => void s.handleOpenProofDoc(slug),
      onOpenFile: (path: string) => s.handleOpenFile(path),
      onSplitRatioChange: (ratio: number) => s.handleSplitRatioChange(ratio),

      // Google Drive
      onPushToDrive: (path: string, account?: string) => s.handlePushToDrive(path, account),
      driveAccounts: s.driveAccounts,
      showDrivePicker: s.showDrivePicker,
      driveUploading: s.driveUploading,
      onToggleDrivePicker: () => s.handleToggleDrivePicker(),

      // Image handling
      onImageClick: (url: string, allImages: LightboxImage[], index: number) =>
        s.handleImageClick(url, allImages, index),
      resolveImageUrl: (msgIdx: number, imgIdx: number) =>
        getResolvedImageUrl(s.sessionKey, msgIdx, imgIdx),

      // Identity
      assistantName: s.assistantName,
      assistantAvatar: s.assistantAvatar,
      userName: s.userName,
      userAvatar: s.userAvatar,
      currentModel: s.currentModel,

      // Tool / working state
      currentToolName: s.currentToolName,
      currentToolInfo: s.currentToolInfo,
      privateMode: s.chatPrivateMode,
      onTogglePrivateMode: () => s.handlePrivateModeToggle(),
      isWorking: s.workingSessions?.has(s.sessionKey) ?? false,

      // Scroll state
      showScrollButton: !s.chatUserNearBottom,
      showNewMessages: s.chatNewMessagesBelow,
      onScrollToBottom: () => {
        const container = document.querySelector(".chat-thread");
        if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
          s.chatUserNearBottom = true;
          s.chatNewMessagesBelow = false;
        }
      },

      // Consciousness
      onConsciousnessFlush: typeof s.handleConsciousnessFlush === "function"
        ? () => s.handleConsciousnessFlush()
        : undefined,
      consciousnessStatus: s.consciousnessStatus,

      // Ally inline panel (split sidebar)
      allyPanelOpen: s.allyPanelOpen ?? false,
      allyProps: s.allyPanelOpen
        ? {
            allyName: s.assistantName,
            allyAvatar: s.assistantAvatar ?? null,
            open: true,
            messages: s.allyMessages ?? [],
            stream: s.allyStream ?? null,
            draft: s.allyDraft ?? "",
            sending: s.allySending ?? false,
            isWorking: s.allyWorking ?? false,
            unreadCount: 0,
            connected: s.connected,
            compact: true,
            attachments: s.allyAttachments ?? [],
            onToggle: () => s.handleAllyToggle(),
            onDraftChange: (text: string) => s.handleAllyDraftChange(text),
            onSend: () => s.handleAllySend(),
            onOpenFullChat: () => s.handleAllyOpenFull(),
            onAttachmentsChange: (attachments: unknown[]) =>
              s.handleAllyAttachmentsChange(attachments),
            onAction: (
              action: string,
              target: string,
              method: string,
              params: unknown,
            ) => s.handleAllyAction(action, target, method, params),
          }
        : null,

      // Session resources strip (Manus-style)
      sessionResources: s.sessionResources,
      sessionResourcesCollapsed: s.sessionResourcesCollapsed,
      sessionResourcesShowAll: s.sessionResourcesShowAll,
      onToggleSessionResources: () => s.handleToggleSessionResources(),
      onSessionResourceClick: (r: { path?: string; url?: string }) =>
        s.handleSessionResourceClick(r),
      onViewAllResources: () => s.handleViewAllResources(),
    };

    return html`${welcomeBanner}${renderChat(chatProps)}`;
  }

  // -- Private helpers ------------------------------------------------------

  /**
   * Handle session key changes — save draft, load new session history, etc.
   * Mirrors the onSessionKeyChange logic from app-render.ts.
   */
  private _handleSessionKeyChange(next: string): void {
    const s = this.host;
    if (!s) return;

    // Save current draft before switching
    saveDraft(s);
    s.sessionKey = next;
    // Restore draft for new session
    restoreDraft(s, next);
    s.chatLoading = true;
    s.chatMessages = [];
    s.chatAttachments = [];
    s.chatStream = null;
    s.chatStreamStartedAt = null;
    s.chatRunId = null;
    s.chatQueue = [];
    s.resetToolStream();
    s.resetChatScroll();
    s.applySettings({
      ...s.settings,
      sessionKey: next,
      lastActiveSessionKey: next,
    });
    void s.loadAssistantIdentity();
    void loadChatHistory(s).then(() => {
      s.resetChatScroll();
      scheduleChatScroll(s, true);
    });
    void refreshChatAvatar(s);
    void s.loadSessionResources();
    triggerImageResolve(s);

    // Notify other tabs about the session change
    appEventBus.emit("session-changed", { sessionKey: next });
  }

  /**
   * Handle cross-tab chat navigation (e.g. from Second Brain "discuss" action).
   */
  private _handleChatNavigate(payload: {
    sessionKey: string;
    tab?: string;
    message?: string;
  }): void {
    const s = this.host;
    if (!s) return;

    // Switch to the requested session
    if (payload.sessionKey && payload.sessionKey !== s.sessionKey) {
      this._handleSessionKeyChange(payload.sessionKey);
    }

    // Navigate to chat tab if requested
    if (payload.tab === "chat") {
      this.ctx.setTab("chat");
    }

    // Pre-fill a message if provided
    if (payload.message) {
      s.chatMessage = payload.message;
    }
  }

  /**
   * Refresh chat data (history + avatar).
   */
  private async _refresh(): Promise<void> {
    const s = this.host;
    if (!s || !this.ctx.connected) return;

    s.resetToolStream();
    void s.loadSessionResources();
    triggerImageResolve(s);
    await Promise.all([loadChatHistory(s), refreshChatAvatar(s)]);
  }

  /**
   * Resolve assistant avatar URL from the agent list.
   * Mirrors resolveAssistantAvatarUrl() from app-render.ts.
   */
  private _resolveAssistantAvatarUrl(): string | undefined {
    const s = this.host;
    if (!s) return undefined;

    const list = s.agentsList?.agents ?? [];
    // parseAgentSessionKey would need to be imported; for now delegate to host
    // if it has the resolved value available
    if (typeof s.resolvedAssistantAvatarUrl === "string") {
      return s.resolvedAssistantAvatarUrl;
    }

    // Fallback: check the agents list for a matching avatar
    const agentId = s.agentsList?.defaultId ?? "main";
    const agent = list.find((entry: { id: string }) => entry.id === agentId);
    const identity = agent?.identity;
    if (!identity?.avatar) return undefined;

    const avatar = identity.avatar as string;
    const AVATAR_DATA_RE = /^data:/i;
    const AVATAR_HTTP_RE = /^https?:\/\//i;
    if (AVATAR_DATA_RE.test(avatar) || AVATAR_HTTP_RE.test(avatar)) {
      return avatar;
    }
    const base = (s.basePath ?? "").replace(/\/$/, "");
    return `${base}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
  }
}

// ---------------------------------------------------------------------------
// Global tag declaration
// ---------------------------------------------------------------------------

declare global {
  interface HTMLElementTagNameMap {
    "gm-chat": GmChat;
  }
}
