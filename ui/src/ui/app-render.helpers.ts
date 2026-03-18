import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { saveDraft, restoreDraft, refreshChat } from "./app-chat";
import { resetChatScroll, scheduleChatScroll } from "./app-scroll";
import { syncUrlWithSessionKey } from "./app-settings";
import type { AppViewState } from "./app-view-state";
import { loadChatHistory } from "./controllers/chat";
import { loadSessions } from "./controllers/sessions";
import { formatAgoShort } from "./format";
import { icons } from "./icons";
import { emojiForTab, pathForTab, titleForTab, type Tab } from "./navigation";
import type { ThemeMode } from "./theme";
import type { ThemeTransitionContext } from "./theme-transition";
import { generateUUID } from "./uuid.js";

/** Scroll the active session tab into view after render. */
export function scrollActiveTabIntoView(): void {
  requestAnimationFrame(() => {
    const active = document.querySelector(".session-tab--active");
    active?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  });
}

/** Focus the chat textarea after render. */
function focusChatInput(): void {
  requestAnimationFrame(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>(".chat-compose__textarea");
    textarea?.focus();
  });
}

/**
 * Creates a new chat session and switches to it.
 * Extracted for reuse by keyboard shortcuts.
 */
export function createNewSession(state: AppViewState): void {
  // Save current draft before switching
  saveDraft(state);
  // Generate a new unique session key
  const uuid = generateUUID();
  const newSessionKey = `agent:main:webchat-${uuid.slice(0, 8)}`;
  // Add to open tabs and switch to it
  state.applySettings({
    ...state.settings,
    openTabs: [...state.settings.openTabs, newSessionKey],
    sessionKey: newSessionKey,
    lastActiveSessionKey: newSessionKey,
    tabLastViewed: {
      ...state.settings.tabLastViewed,
      [newSessionKey]: Date.now(),
    },
  });
  state.sessionKey = newSessionKey;
  // New session starts with empty message (no draft to restore)
  state.chatMessage = "";
  state.chatMessages = [];
  state.chatStream = null;
  state.chatStreamStartedAt = null;
  state.chatRunId = null;
  state.resetToolStream();
  state.resetChatScroll();
  void state.loadAssistantIdentity();
  syncUrlWithSessionKey(state, newSessionKey, true);
  void loadChatHistory(state);
  // Scroll new tab into view and focus chat input
  scrollActiveTabIntoView();
  focusChatInput();
}

export function renderTab(state: AppViewState, tab: Tab) {
  const href = pathForTab(tab, state.basePath);
  return html`
    <a
      href=${href}
      class="nav-item ${state.tab === tab ? "active" : ""}"
      @click=${(event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        state.setTab(tab);
      }}
      title=${titleForTab(tab)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${emojiForTab(tab)}</span>
      <span class="nav-item__text">${titleForTab(tab)}</span>
    </a>
  `;
}

export function renderChatControls(state: AppViewState) {
  const disableThinkingToggle = state.onboarding;
  const disableFocusToggle = state.onboarding;
  const showThinking = state.onboarding ? false : state.settings.chatShowThinking;
  const focusActive = state.onboarding ? true : state.settings.chatFocusMode;
  // Icons
  const refreshIcon = html`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
    </svg>
  `;
  const focusIcon = html`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 7V4h3"></path>
      <path d="M20 7V4h-3"></path>
      <path d="M4 17v3h3"></path>
      <path d="M20 17v3h-3"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;
  const plusIcon = html`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  `;

  const searchIcon = html`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  `;

  return html`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${() => createNewSession(state)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${plusIcon}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${state.sessionPickerOpen ? "active" : ""}"
          @click=${(e: Event) => {
            const btn = e.currentTarget as HTMLElement;
            const rect = btn.getBoundingClientRect();
            state.sessionPickerPosition = {
              top: rect.bottom + 8,
              right: window.innerWidth - rect.right,
            };
            // If opening the picker, load sessions first (this sets sessionsLoading=true synchronously)
            if (!state.sessionPickerOpen) {
              void loadSessions(state);
            }
            // Then toggle the picker open/closed
            state.handleToggleSessionPicker();
          }}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${state.sessionPickerOpen}
        >
          ${icons.folderOpen}
        </button>
        ${state.sessionPickerOpen ? renderSessionPickerDropdown(state) : nothing}
      </div>
      <!-- Session search -->
      <div class="session-search-container">
        <button
          class="chat-toolbar__btn ${state.sessionSearchOpen ? "active" : ""}"
          @click=${(e: Event) => state.handleToggleSessionSearch(e)}
          title="Search sessions"
          aria-label="Search session contents"
          aria-expanded=${state.sessionSearchOpen}
        >
          ${searchIcon}
        </button>
        ${state.sessionSearchOpen ? renderSessionSearchDropdown(state) : nothing}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${state.chatLoading || !state.connected}
        @click=${() => {
          state.resetToolStream();
          void refreshChat(state as unknown as Parameters<typeof refreshChat>[0]);
        }}
        title="Refresh chat data"
      >
        ${refreshIcon}
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Thinking toggle -->
      <button
        class="chat-toolbar__btn ${showThinking ? "active" : ""}"
        ?disabled=${disableThinkingToggle}
        @click=${() => {
          if (disableThinkingToggle) {
            return;
          }
          state.applySettings({
            ...state.settings,
            chatShowThinking: !state.settings.chatShowThinking,
          });
        }}
        aria-pressed=${showThinking}
        title=${
          disableThinkingToggle
            ? "Disabled during onboarding"
            : "Toggle assistant thinking/working output"
        }
      >
        ${icons.brain}
      </button>
      <!-- Focus mode toggle -->
      <button
        class="chat-toolbar__btn ${focusActive ? "active" : ""}"
        ?disabled=${disableFocusToggle}
        @click=${() => {
          if (disableFocusToggle) {
            return;
          }
          state.applySettings({
            ...state.settings,
            chatFocusMode: !state.settings.chatFocusMode,
          });
        }}
        aria-pressed=${focusActive}
        title=${
          disableFocusToggle
            ? "Disabled during onboarding"
            : "Toggle focus mode (hide sidebar + page header)"
        }
      >
        ${focusIcon}
      </button>
      <!-- Private mode toggle -->
      <button
        class="chat-toolbar__btn ${state.chatPrivateMode ? "active private-mode" : ""}"
        @click=${() => state.handlePrivateModeToggle()}
        aria-pressed=${state.chatPrivateMode ?? false}
        title=${state.chatPrivateMode
          ? "Private mode ON — click to destroy session"
          : "Start a private session (ephemeral, 24h auto-delete)"}
      >
        ${icons.lock}
      </button>
      <!-- Parallel sessions toggle -->
      <button
        class="chat-toolbar__btn ${state.settings.chatParallelView ? "active" : ""}"
        @click=${() =>
          state.applySettings({
            ...state.settings,
            chatParallelView: !state.settings.chatParallelView,
          })}
        aria-pressed=${state.settings.chatParallelView}
        title=${state.settings.chatParallelView
            ? "Exit parallel sessions view"
            : "Parallel sessions view"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="18" rx="1"></rect>
          <rect x="14" y="3" width="7" height="18" rx="1"></rect>
        </svg>
      </button>
      <!-- Sidebar toggle -->
      <button
        class="chat-toolbar__btn ${state.sidebarOpen ? "active" : ""}"
        @click=${() => {
          if (state.sidebarOpen) {
            state.handleCloseSidebar();
          } else if (state.sidebarContent || state.sidebarProofSlug) {
            // Re-open with existing content
            state.sidebarOpen = true;
          } else {
            // Scan recent messages for a proof doc to open
            const msgs = (state as any).chatMessages as Array<Record<string, unknown>> | undefined;
            if (msgs?.length) {
              for (const msg of msgs.slice(-10).reverse()) {
                const content = Array.isArray(msg.content) ? msg.content : [];
                for (const block of content as Array<Record<string, unknown>>) {
                  const text = typeof block.text === "string" ? block.text : typeof block.content === "string" ? block.content : null;
                  if (!text) continue;
                  try {
                    const parsed = JSON.parse(text) as { _sidebarAction?: { type?: string; slug?: string } };
                    if (parsed._sidebarAction?.type === "proof" && parsed._sidebarAction.slug) {
                      void (state as any).handleOpenProofDoc(parsed._sidebarAction.slug);
                      return;
                    }
                  } catch { /* not JSON */ }
                }
              }
            }
          }
        }}
        title=${state.sidebarOpen ? "Close sidebar panel" : "Open sidebar panel"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M15 3v18"></path>
        </svg>
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Compact chat button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${!state.connected}
        @click=${() => {
          // Trigger manual compaction
          void state.handleCompactChat();
        }}
        title="Compact chat context"
      >
        ${icons.minimize}
      </button>
    </div>
  `;
}

// Session Picker Types and Helpers
type SessionInfo = {
  key: string;
  displayName?: string | null;
  label?: string | null;
  updatedAt?: number | null;
  isActive?: boolean;
};

type GroupedSessions = {
  today: SessionInfo[];
  yesterday: SessionInfo[];
  older: SessionInfo[];
};

function groupSessionsByDate(sessions: SessionInfo[]): GroupedSessions {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  return {
    today: sessions.filter((s) => s.updatedAt && new Date(s.updatedAt) >= today),
    yesterday: sessions.filter(
      (s) => s.updatedAt && new Date(s.updatedAt) >= yesterday && new Date(s.updatedAt) < today,
    ),
    older: sessions.filter((s) => !s.updatedAt || new Date(s.updatedAt) < yesterday),
  };
}

// Debounce timer for search
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

function renderSessionSearchDropdown(state: AppViewState) {
  // Show not connected state
  if (!state.client || !state.connected) {
    return html`
      <div
        class="session-search-dropdown"
        style="top: ${state.sessionSearchPosition?.top ?? 0}px; right: ${state.sessionSearchPosition?.right ?? 0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;
  }

  const handleSearchInput = (e: Event) => {
    const query = (e.target as HTMLInputElement).value;
    state.sessionSearchQuery = query;

    // Debounce the API call
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      state.handleSessionSearchQuery(query);
    }, 300);
  };

  const handleResultClick = (key: string) => {
    state.sessionSearchOpen = false;
    state.sessionSearchQuery = "";
    state.sessionSearchResults = [];

    // Save current draft before switching
    saveDraft(state);

    if (state.settings.openTabs.includes(key)) {
      // Already open, just switch to it
      state.sessionKey = key;
      state.applySettings({
        ...state.settings,
        sessionKey: key,
        lastActiveSessionKey: key,
        tabLastViewed: {
          ...state.settings.tabLastViewed,
          [key]: Date.now(),
        },
      });
    } else {
      // Add to open tabs and mark as viewed
      state.applySettings({
        ...state.settings,
        openTabs: [...state.settings.openTabs, key],
        sessionKey: key,
        lastActiveSessionKey: key,
        tabLastViewed: {
          ...state.settings.tabLastViewed,
          [key]: Date.now(),
        },
      });
      state.sessionKey = key;
    }

    // Restore draft for new session
    restoreDraft(state, key);
    state.chatLoading = true;
    state.chatStream = null;
    state.chatStreamStartedAt = null;
    state.chatRunId = null;
    state.resetToolStream();
    state.resetChatScroll();
    void state.loadAssistantIdentity();
    syncUrlWithSessionKey(state, key, true);
    void loadChatHistory(state).then(() => {
      resetChatScroll(state as unknown as Parameters<typeof resetChatScroll>[0]);
      scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
    });
  };

  const renderSearchResult = (result: (typeof state.sessionSearchResults)[0]) => {
    const name = result.label ?? result.displayName ?? result.key;
    const hasMatches = result.matches.length > 0;

    return html`
      <div class="session-search-result" @click=${() => handleResultClick(result.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${name}</span>
        </div>
        ${
          hasMatches
            ? html`
              <div class="session-search-result__matches">
                ${result.matches.slice(0, 2).map(
                  (match) => html`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${match.role}:</span>
                      <span class="session-search-result__text">${match.text}</span>
                    </div>
                  `,
                )}
              </div>
            `
            : nothing
        }
      </div>
    `;
  };

  return html`
    <div
      class="session-search-dropdown"
      style="top: ${state.sessionSearchPosition?.top ?? 0}px; right: ${state.sessionSearchPosition?.right ?? 0}px;"
    >
      <div class="session-search-input-container">
        <input
          type="text"
          class="session-search-input"
          placeholder="Search session contents..."
          .value=${state.sessionSearchQuery}
          @input=${handleSearchInput}
          @click=${(e: Event) => e.stopPropagation()}
          autofocus
        />
      </div>
      <div class="session-search-list">
        ${
          state.sessionSearchLoading
            ? html`
                <div class="session-search-empty">Searching...</div>
              `
            : state.sessionSearchQuery.trim() === ""
              ? html`
                  <div class="session-search-empty">Type to search session contents</div>
                `
              : state.sessionSearchResults.length === 0
                ? html`
                    <div class="session-search-empty">No results found</div>
                  `
                : state.sessionSearchResults.map(renderSearchResult)
        }
      </div>
    </div>
  `;
}

function renderSessionPickerDropdown(state: AppViewState) {
  const searchTerm = (state.sessionPickerSearch ?? "").toLowerCase().trim();

  // Show appropriate state messages
  if (!state.client || !state.connected) {
    return html`
      <div
        class="session-picker-dropdown"
        style="top: ${state.sessionPickerPosition?.top ?? 0}px; right: ${state.sessionPickerPosition?.right ?? 0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;
  }

  if (state.sessionsLoading) {
    return html`
      <div
        class="session-picker-dropdown"
        style="top: ${state.sessionPickerPosition?.top ?? 0}px; right: ${state.sessionPickerPosition?.right ?? 0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;
  }

  // Filter sessions not already in open tabs
  let availableSessions = (state.sessionsResult?.sessions ?? []).filter(
    (s) => !state.settings.openTabs.includes(s.key),
  ) as SessionInfo[];

  // Apply search filter - search across label, displayName, AND key
  if (searchTerm) {
    availableSessions = availableSessions.filter((s) => {
      const fields = [s.label, s.displayName, s.key].filter(Boolean);
      return fields.some((f) => f!.toLowerCase().includes(searchTerm));
    });
  }

  // Cap visible sessions at 50 for rendering performance
  const maxVisible = 50;
  const totalAvailable = availableSessions.length;
  const cappedSessions = availableSessions.slice(0, maxVisible);

  // Group by date
  const grouped = groupSessionsByDate(cappedSessions);

  const handleSessionClick = (key: string) => {
    state.sessionPickerOpen = false;
    state.sessionPickerSearch = "";
    // Save current draft before switching
    saveDraft(state);
    if (state.settings.openTabs.includes(key)) {
      // Already open, just switch to it
      state.sessionKey = key;
      state.applySettings({
        ...state.settings,
        sessionKey: key,
        lastActiveSessionKey: key,
        tabLastViewed: {
          ...state.settings.tabLastViewed,
          [key]: Date.now(),
        },
      });
    } else {
      // Add to open tabs and mark as viewed
      state.applySettings({
        ...state.settings,
        openTabs: [...state.settings.openTabs, key],
        sessionKey: key,
        lastActiveSessionKey: key,
        tabLastViewed: {
          ...state.settings.tabLastViewed,
          [key]: Date.now(),
        },
      });
      state.sessionKey = key;
    }
    // Restore draft for new session
    restoreDraft(state, key);
    state.chatLoading = true;
    state.chatStream = null;
    state.chatStreamStartedAt = null;
    state.chatRunId = null;
    state.resetToolStream();
    state.resetChatScroll();
    void state.loadAssistantIdentity();
    syncUrlWithSessionKey(state, key, true);
    void loadChatHistory(state).then(() => {
      resetChatScroll(state as unknown as Parameters<typeof resetChatScroll>[0]);
      scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
    });
  };

  const handleDeleteSession = async (e: Event, key: string) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete session "${key}"?\n\nDeletes the session entry and archives its transcript.`,
    );
    if (!confirmed) {
      return;
    }

    // Optimistic update - remove from the list immediately
    if (state.sessionsResult?.sessions) {
      state.sessionsResult = {
        ...state.sessionsResult,
        sessions: state.sessionsResult.sessions.filter((s) => s.key !== key),
      };
    }

    // Actually delete on the server
    if (state.client && state.connected) {
      try {
        await state.client.request("sessions.delete", { key, deleteTranscript: true });
        void loadSessions(state);
      } catch (err) {
        console.error("Failed to delete session:", err);
        // Reload to restore the correct state
        void loadSessions(state);
      }
    }
  };

  const renderSessionItem = (s: SessionInfo) => html`
    <div class="session-picker-item" @click=${() => handleSessionClick(s.key)}>
      <span class="session-picker-item__status ${s.isActive ? "active" : ""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${s.label ?? s.displayName ?? s.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${
          s.updatedAt
            ? html`<span class="session-picker-item__time">${formatAgoShort(s.updatedAt)}</span>`
            : nothing
        }
        <button
          class="session-picker-item__close"
          @click=${(e: Event) => handleDeleteSession(e, s.key)}
          title="Delete session"
          aria-label="Delete session"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  const renderGroup = (title: string, sessions: SessionInfo[]) => {
    if (sessions.length === 0) {
      return nothing;
    }
    return html`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${title}</div>
        ${repeat(sessions, (s) => s.key, renderSessionItem)}
      </div>
    `;
  };

  const totalCount = grouped.today.length + grouped.yesterday.length + grouped.older.length;

  return html`
    <div
      class="session-picker-dropdown"
      style="top: ${state.sessionPickerPosition?.top ?? 0}px; right: ${state.sessionPickerPosition?.right ?? 0}px;"
    >
      <div class="session-picker-search">
        <input
          type="text"
          class="session-picker-search__input"
          placeholder="Search sessions..."
          .value=${state.sessionPickerSearch ?? ""}
          @input=${(e: Event) => {
            state.sessionPickerSearch = (e.target as HTMLInputElement).value;
          }}
          @click=${(e: Event) => e.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${
          totalCount === 0
            ? html`
                <div class="session-picker-empty">No other sessions</div>
              `
            : html`
              ${renderGroup("Today", grouped.today)}
              ${renderGroup("Yesterday", grouped.yesterday)}
              ${renderGroup("Older", grouped.older)}
              ${
                totalAvailable > maxVisible
                  ? html`<div class="session-picker-overflow">
                    Showing ${maxVisible} of ${totalAvailable} sessions. Use search to find more.
                  </div>`
                  : nothing
              }
            `
        }
      </div>
    </div>
  `;
}

const THEME_ORDER: ThemeMode[] = ["system", "light", "dark", "lifetrack"];

export function renderThemeToggle(state: AppViewState) {
  const index = Math.max(0, THEME_ORDER.indexOf(state.theme));
  const applyTheme = (next: ThemeMode) => (event: MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    const context: ThemeTransitionContext = { element };
    if (event.clientX || event.clientY) {
      context.pointerClientX = event.clientX;
      context.pointerClientY = event.clientY;
    }
    state.setTheme(next, context);
  };

  return html`
    <div class="theme-toggle" style="--theme-index: ${index};">
      <div class="theme-toggle__track" role="group" aria-label="Theme">
        <span class="theme-toggle__indicator"></span>
        <button
          class="theme-toggle__button ${state.theme === "system" ? "active" : ""}"
          @click=${applyTheme("system")}
          aria-pressed=${state.theme === "system"}
          aria-label="System theme"
          title="System"
        >
          ${renderMonitorIcon()}
        </button>
        <button
          class="theme-toggle__button ${state.theme === "light" ? "active" : ""}"
          @click=${applyTheme("light")}
          aria-pressed=${state.theme === "light"}
          aria-label="Light theme"
          title="Light"
        >
          ${renderSunIcon()}
        </button>
        <button
          class="theme-toggle__button ${state.theme === "dark" ? "active" : ""}"
          @click=${applyTheme("dark")}
          aria-pressed=${state.theme === "dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${renderMoonIcon()}
        </button>
        <button
          class="theme-toggle__button ${state.theme === "lifetrack" ? "active" : ""}"
          @click=${applyTheme("lifetrack")}
          aria-pressed=${state.theme === "lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${renderSparkleIcon()}
        </button>
      </div>
    </div>
  `;
}

function renderSunIcon() {
  return html`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `;
}

function renderMoonIcon() {
  return html`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `;
}

function renderMonitorIcon() {
  return html`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `;
}

function renderSparkleIcon() {
  return html`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `;
}
