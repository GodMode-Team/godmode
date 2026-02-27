import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { parseAgentSessionKey } from "../lib/session-key-utils.js";
import { refreshChatAvatar, saveDraft, restoreDraft } from "./app-chat";
import { findSessionByKey } from "./app-lifecycle";
import { renderChatControls, renderTab, renderThemeToggle } from "./app-render.helpers";
import { syncUrlWithSessionKey } from "./app-settings";
import type { AppViewState } from "./app-view-state";
import { loadChannels } from "./controllers/channels";
import { loadChatHistory, loadLaneHistory } from "./controllers/chat";
import {
  applyConfig,
  loadConfig,
  runUpdate,
  saveConfig,
  updateConfigFormValue,
  removeConfigFormValue,
} from "./controllers/config";
import {
  loadCronRuns,
  toggleCronJob,
  runCronJob,
  removeCronJob,
  addCronJob,
} from "./controllers/cron";
import { loadDebug, callDebugMethod } from "./controllers/debug";
import {
  approveDevicePairing,
  loadDevices,
  rejectDevicePairing,
  revokeDeviceToken,
  rotateDeviceToken,
} from "./controllers/devices";
import {
  loadExecApprovals,
  removeExecApprovalsFormValue,
  saveExecApprovals,
  updateExecApprovalsFormValue,
} from "./controllers/exec-approvals";
import { loadLogs } from "./controllers/logs";
import { loadNodes } from "./controllers/nodes";
import { loadPresence } from "./controllers/presence";
import { autoTitleCache, deleteSession, loadSessions, patchSession } from "./controllers/sessions";
import {
  installSkill,
  loadSkills,
  saveSkillApiKey,
  updateSkillEdit,
  updateSkillEnabled,
} from "./controllers/skills";
import { checkForUpdates } from "./controllers/updates";
import { icons } from "./icons";
import { TAB_GROUPS, subtitleForTab, titleForTab, type Tab } from "./navigation";
import { renderChannels } from "./views/channels";
import { renderChat } from "./views/chat";
import { renderConfig } from "./views/config";
import { renderCron } from "./views/cron";
import { renderDataTab } from "./views/data";
import { renderDebug } from "./views/debug";
import { renderExecApprovalPrompt } from "./views/exec-approval";
import { renderGatewayUrlConfirmation } from "./views/gateway-url-confirmation";
import { renderGoals } from "./views/goals";
import { renderInstances } from "./views/instances";
import { renderLifetracks } from "./views/lifetracks";
import { renderLogs } from "./views/logs";
import { renderMarkdownSidebar } from "./views/markdown-sidebar";
import { renderMissionControl } from "./views/mission-control";
// Task modal removed — native tasks managed inline in Mission Control
import { renderMyDay } from "./views/my-day";
import { renderNodes } from "./views/nodes";
import { renderOverview } from "./views/overview";
import { renderPeople } from "./views/people";
import { renderSessions } from "./views/sessions";
import { renderSkills } from "./views/skills";
import { renderToasts } from "./views/toast";
import { renderVisionBoard } from "./views/vision-board";
import { renderWheelOfLife } from "./views/wheel-of-life";
import { renderOptions } from "./views/options";
import { renderTrustTracker } from "./views/trust-tracker";
import { renderParallelSessions } from "./views/parallel-sessions";
import { renderWork } from "./views/work";
import { renderWorkspaces } from "./views/workspaces";
import {
  renderOnboardingWelcome,
  renderOnboardingIdentity,
  renderOnboardingProgress,
  renderOnboardingSummary,
  type OnboardingPhase as OnbPhase,
} from "./views/onboarding";

const AVATAR_DATA_RE = /^data:/i;
const AVATAR_HTTP_RE = /^https?:\/\//i;

function resolveAssistantAvatarUrl(state: AppViewState): string | undefined {
  const list = state.agentsList?.agents ?? [];
  const parsed = parseAgentSessionKey(state.sessionKey);
  const agentId = parsed?.agentId ?? state.agentsList?.defaultId ?? "main";
  const agent = list.find((entry) => entry.id === agentId);
  const identity = agent?.identity;
  const candidate = identity?.avatarUrl ?? identity?.avatar;
  if (!candidate) {
    return undefined;
  }
  if (AVATAR_DATA_RE.test(candidate) || AVATAR_HTTP_RE.test(candidate)) {
    return candidate;
  }
  return identity?.avatarUrl;
}

/**
 * Render a dynamic HTML slot for a tab.
 * When the AI pushes custom HTML via `ui.slot.update`, it replaces the default
 * tab content. A "Reset to default" button allows the user to clear the override.
 */
function renderDynamicSlot(state: AppViewState, tabId: string) {
  const slotHtml = state.dynamicSlots[tabId];
  if (!slotHtml) {
    return nothing;
  }
  return html`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${() => {
            const next = { ...state.dynamicSlots };
            delete next[tabId];
            (state as unknown as Record<string, unknown>).dynamicSlots = next;
          }}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${unsafeHTML(slotHtml)}</div>
    </div>
  `;
}

function normalizeTabIdentityText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .replace(/\s+/g, " ");
}

function collapseRepeatedLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const half = parts.length / 2;
    const left = parts.slice(0, half).join(" ");
    const right = parts.slice(half).join(" ");
    if (left.toLowerCase() === right.toLowerCase()) {
      return left;
    }
  }
  // Handles duplicated labels with punctuation/spacing differences.
  const normalized = trimmed.replace(/\s+/g, " ").toLowerCase();
  const mid = Math.floor(normalized.length / 2);
  const left = normalized.slice(0, mid).trim();
  const right = normalized.slice(mid).trim();
  if (left && left === right) {
    return trimmed.slice(0, Math.ceil(trimmed.length / 2)).trim();
  }
  return trimmed;
}

function getSessionTabIdentity(key: string, session: ReturnType<typeof findSessionByKey>): string {
  const sessionId = session?.sessionId?.trim();
  if (sessionId) {
    return `session:${sessionId}`;
  }
  const displayName =
    session?.displayName ??
    autoTitleCache.get(session?.key ?? key) ??
    autoTitleCache.get(key) ??
    session?.label ??
    "";
  const normalizedName = normalizeTabIdentityText(collapseRepeatedLabel(displayName));
  if (normalizedName) {
    const surface = String(session?.surface ?? "")
      .trim()
      .toLowerCase();
    const subject = normalizeTabIdentityText(String(session?.subject ?? "")).slice(0, 20);
    const tokenPrefix = normalizedName.split(" ").filter(Boolean).slice(0, 3).join(" ");
    return `name:${surface}|${subject}|${tokenPrefix || normalizedName.slice(0, 24)}`;
  }
  return `key:${key.trim().toLowerCase()}`;
}

function getRenderableSessionTabState(state: AppViewState): {
  tabKeys: string[];
  activeIdentity: string;
} {
  const sessions = state.sessionsResult?.sessions;
  const rawTabKeys = [...new Set(state.settings.openTabs.map((key) => key.trim()).filter(Boolean))];
  const activeSession = findSessionByKey(sessions, state.sessionKey);
  const activeIdentity = getSessionTabIdentity(state.sessionKey, activeSession);
  const tabsByIdentity = new Map<string, string>();

  for (const key of rawTabKeys) {
    const session = findSessionByKey(sessions, key);
    const identity = getSessionTabIdentity(key, session);
    if (!tabsByIdentity.has(identity)) {
      tabsByIdentity.set(identity, key);
      continue;
    }
    if (key === state.sessionKey) {
      tabsByIdentity.set(identity, key);
    }
  }

  const tabKeys = [...tabsByIdentity.values()];
  if (tabKeys.length === 0) {
    tabKeys.push(state.sessionKey.trim() || "main");
  }
  return { tabKeys, activeIdentity };
}

export function renderApp(state: AppViewState) {
  // ── Onboarding full-screen takeovers (phases 0, 1, 6) ─────
  const obActive = state.onboardingActive;
  const obPhase = (state.onboardingPhase ?? 0);
  const obData = state.onboardingData;

  if (obActive && obPhase === 0) {
    return renderOnboardingWelcome(() => {
      state.handleOnboardingStart?.();
    }, obData?.assessment);
  }
  if (obActive && obPhase === 1) {
    return renderOnboardingIdentity((identity) => {
      void state.handleOnboardingIdentitySubmit?.(identity);
    });
  }
  if (obActive && obPhase === 6) {
    return renderOnboardingSummary(
      obData?.summary ?? null,
      obData?.identity ?? null,
      () => {
        state.handleOnboardingComplete?.();
      },
    );
  }

  const presenceCount = state.presenceEntries.length;
  const sessionsCount = state.sessionsResult?.count ?? null;
  const cronNext = state.cronStatus?.nextWakeAtMs ?? null;
  const chatDisabledReason = state.connected ? null : "Disconnected from gateway.";
  const isChat = state.tab === "chat";
  const chatFocus = isChat && (state.settings.chatFocusMode || state.onboarding || (obActive && obPhase >= 2));
  const showThinking = state.onboarding ? false : state.settings.chatShowThinking;
  const assistantAvatarUrl = resolveAssistantAvatarUrl(state);
  const chatAvatarUrl = state.chatAvatarUrl ?? assistantAvatarUrl ?? null;
  const focusPulseEnabled = Boolean(state.godmodeOptions?.["focusPulse.enabled"] ?? true);
  const focusPulseActive = Boolean(state.focusPulseData?.active);
  const showFocusPulseWidget = focusPulseEnabled && focusPulseActive && Boolean(state.focusPulseData?.currentFocus);
  const { tabKeys: renderSessionTabKeys, activeIdentity: activeSessionTabIdentity } =
    getRenderableSessionTabState(state);

  return html`
    <div class="shell ${isChat ? "shell--chat" : ""} ${chatFocus ? "shell--chat-focus" : ""} ${state.settings.navCollapsed ? "shell--nav-collapsed" : ""} ${state.onboarding ? "shell--onboarding" : ""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${() =>
              state.applySettings({
                ...state.settings,
                navCollapsed: !state.settings.navCollapsed,
              })}
            title="${state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar"}"
            aria-label="${state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${icons.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <span style="font-size: 24px;">⚡</span>
            </div>
            <div class="brand-text">
              <div class="brand-title">GodMode</div>
              <div class="brand-sub">Personal AI Operating System</div>
            </div>
          </div>
        </div>
        <div class="topbar-center">
          ${showFocusPulseWidget
            ? html`
              <div class="focus-pulse-widget ${!state.focusPulseData.aligned ? 'focus-pulse-widget--misaligned' : ''}">
                <span>\u{1F3AF}</span>
                <span class="focus-pulse-widget__focus">${state.focusPulseData.currentFocus.title}</span>
                <span class="focus-pulse-widget__score">${state.focusPulseData.score}/100</span>
                ${state.focusPulseData.streak > 0 ? html`<span class="focus-pulse-widget__streak">\u{1F525} ${state.focusPulseData.streak}d</span>` : nothing}
                <button class="focus-pulse-widget__complete-btn" @click=${() => state.handleFocusPulseComplete()} title="Mark current focus complete">\u2713 Done</button>
              </div>
            `
            : nothing}
        </div>
        <div class="topbar-status">
          ${
            state.updateStatus?.behind
              ? html`<a
                  class="pill pill--update"
                  href="#"
                  title="${state.updateStatus.behind} update${state.updateStatus.behind > 1 ? "s" : ""} available — click to view"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    state.setTab("overview" as Tab);
                  }}
                >
                  <span class="pill__icon">${icons.zap}</span>
                  <span>Update Ready</span>
                </a>`
              : nothing
          }
          <a
            class="pill pill--guide"
            href="/how-to-godmode.html"
            target="_blank"
            title="Learn how to get the most out of GodMode"
          >
            <span class="pill__icon">${icons.book}</span>
            <span>How to GodMode</span>
          </a>
          <a
            class="pill pill--help"
            href="https://t.me/GodModeSupportBot"
            target="_blank"
            rel="noreferrer"
            title="Get help from Atlas via Telegram"
          >
            <span class="pill__icon">${icons.messageCircle}</span>
            <span>Get Help</span>
          </a>
          <div class="pill ${state.reconnecting ? "reconnecting" : ""}">
            <span class="statusDot ${state.connected ? "ok" : ""}"></span>
            <span>Gateway</span>
            <span class="mono">${
              state.reconnecting
                ? `Reconnecting${state.reconnectAttempt > 1 ? ` (${state.reconnectAttempt})` : ""}...`
                : state.connected
                  ? "Connected"
                  : "Offline"
            }</span>
          </div>
          ${renderThemeToggle(state)}
        </div>
      </header>
      <aside class="nav ${state.settings.navCollapsed ? "nav--collapsed" : ""}">
        ${TAB_GROUPS.map((group) => {
          const isGroupCollapsed = state.settings.navGroupsCollapsed[group.label] ?? false;
          const hasActiveTab = group.tabs.some((tab) => tab === state.tab);
          // Hide group header for single-item groups where label matches tab title
          const isSingleItemGroup =
            !group.label ||
            (group.tabs.length === 1 && titleForTab(group.tabs[0] as Tab) === group.label);
          return html`
            <div class="nav-group ${isGroupCollapsed && !hasActiveTab ? "nav-group--collapsed" : ""} ${isSingleItemGroup ? "nav-group--no-header" : ""}">
              ${
                isSingleItemGroup
                  ? nothing
                  : html`
                <button
                  class="nav-label"
                  @click=${() => {
                    const next = { ...state.settings.navGroupsCollapsed };
                    next[group.label] = !isGroupCollapsed;
                    state.applySettings({
                      ...state.settings,
                      navGroupsCollapsed: next,
                    });
                  }}
                  aria-expanded=${!isGroupCollapsed}
                >
                  <span class="nav-label__text">${group.label}</span>
                  <span class="nav-label__chevron">${isGroupCollapsed ? "+" : "−"}</span>
                </button>
              `
              }
              <div class="nav-group__items">
                ${group.tabs.map((tab) => renderTab(state, tab))}
                ${
                  !group.label && state.godmodeOptions?.["deck.enabled"]
                    ? html`
                        <a
                          class="nav-item nav-item--external"
                          href="/deck/"
                          target="_blank"
                          rel="noreferrer"
                          title="Open Deck — parallel agent sessions"
                        >
                          <span class="nav-item__emoji" aria-hidden="true">🏛️</span>
                          <span class="nav-item__text">Deck</span>
                        </a>
                      `
                    : nothing
                }
              </div>
            </div>
          `;
        })}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">Resources</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.clawd.bot"
              target="_blank"
              rel="noreferrer"
              title="Docs (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${icons.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${isChat ? "content--chat" : ""}">
        <section class="content-header">
          <div>
            ${
              state.tab !== "chat" &&
              state.tab !== "mission" &&
              state.tab !== "workspaces" &&
              state.tab !== "today" &&
              state.tab !== "my-day" &&
              state.tab !== "work" &&
              state.tab !== "people" &&
              state.tab !== "life" &&
              state.tab !== "data" &&
              state.tab !== "wheel-of-life" &&
              state.tab !== "vision-board" &&
              state.tab !== "lifetracks"
                ? html`
              <div class="page-title">${titleForTab(state.tab)}</div>
              <div class="page-sub">${subtitleForTab(state.tab)}</div>
            `
                : state.tab === "chat"
                  ? html`
              <div class="session-tabs">
                ${repeat(
                  renderSessionTabKeys,
                  (key) => key,
                  (key, index) => {
                    const session = findSessionByKey(state.sessionsResult?.sessions, key);
                    const isActive =
                      getSessionTabIdentity(key, session) === activeSessionTabIdentity;
                    // Generate a clean display name instead of showing raw session keys
                    const getDisplayName = () => {
                      if (session?.displayName) {
                        return collapseRepeatedLabel(session.displayName);
                      }
                      // Check auto-title cache (survives sessionsResult overwrites)
                      const cachedTitle = autoTitleCache.get(key);
                      if (cachedTitle) {
                        return collapseRepeatedLabel(cachedTitle);
                      }
                      if (session?.label) {
                        return collapseRepeatedLabel(session.label);
                      }
                      // Generate clean fallback name from key
                      if (key.includes("webchat")) {
                        const match = key.match(/webchat[:-](\d+)/);
                        return match ? `Chat ${match[1]}` : "Chat";
                      }
                      if (key.includes("main")) {
                        return "MAIN";
                      }
                      // Last resort: show first word of key
                      const parts = key.split(/[:-]/);
                      return parts[parts.length - 1] || key;
                    };
                    const displayName = getDisplayName();
                    const canClose = renderSessionTabKeys.length > 1;
                    // Check session status for indicators
                    const isWorking = state.workingSessions.has(key);
                    const lastViewed = state.settings.tabLastViewed[key] ?? 0;
                    const updatedAt = session?.updatedAt ?? 0;
                    const isReady = !isActive && !isWorking && updatedAt > lastViewed;
                    const isEditing = state.editingTabKey === key;
                    return html`
                      <div
                        class="session-tab ${isActive ? "session-tab--active" : ""} ${isWorking ? "session-tab--working" : ""} ${isReady ? "session-tab--ready" : ""} ${isEditing ? "session-tab--editing" : ""}"
                        draggable="true"
                        @dragstart=${(e: DragEvent) => {
                          // Don't drag while editing a tab name
                          if (state.editingTabKey === key) {
                            e.preventDefault();
                            return;
                          }
                          e.dataTransfer!.effectAllowed = "move";
                          // Set session key for parallel lane drops
                          e.dataTransfer!.setData("text/session-key", key);
                          // Set index for tab reorder drops
                          e.dataTransfer!.setData("text/plain", index.toString());
                          (e.target as HTMLElement).classList.add("dragging");
                        }}
                        @click=${() => {
                          if (isEditing) {
                            return;
                          }
                          // Always update tabLastViewed to clear "ready" indicator, even if already active
                          if (isActive) {
                            state.applySettings({
                              ...state.settings,
                              tabLastViewed: {
                                ...state.settings.tabLastViewed,
                                [key]: Date.now(),
                              },
                            });
                            return;
                          }
                          // Save current draft before switching
                          saveDraft(state);
                          state.sessionKey = key;
                          // Restore draft for new session
                          restoreDraft(state, key);
                          state.chatLoading = true;
                          state.chatStream = null;
                          state.chatStreamStartedAt = null;
                          state.chatRunId = null;
                          state.resetToolStream();
                          state.resetChatScroll();
                          // Mark tab as viewed now
                          state.applySettings({
                            ...state.settings,
                            sessionKey: key,
                            lastActiveSessionKey: key,
                            tabLastViewed: {
                              ...state.settings.tabLastViewed,
                              [key]: Date.now(),
                            },
                          });
                          void state.loadAssistantIdentity();
                          syncUrlWithSessionKey(state, key, true);
                          void loadChatHistory(state);
                          // Refresh sessions to get accurate context token counts
                          void loadSessions(state);
                        }}
                        @dragend=${(e: DragEvent) => {
                          (e.target as HTMLElement).classList.remove("dragging");
                        }}
                        @dragover=${(e: DragEvent) => {
                          e.preventDefault();
                          e.dataTransfer!.dropEffect = "move";
                          const target = e.currentTarget as HTMLElement;
                          const rect = target.getBoundingClientRect();
                          const midpoint = rect.left + rect.width / 2;
                          if (e.clientX < midpoint) {
                            target.classList.add("drop-left");
                            target.classList.remove("drop-right");
                          } else {
                            target.classList.add("drop-right");
                            target.classList.remove("drop-left");
                          }
                        }}
                        @dragleave=${(e: DragEvent) => {
                          const target = e.currentTarget as HTMLElement;
                          target.classList.remove("drop-left", "drop-right");
                        }}
                        @drop=${(e: DragEvent) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer!.getData("text/plain"));
                          const toIndex = index;

                          if (fromIndex === toIndex) {
                            return;
                          }

                          // Reorder the tabs array
                          const newTabs = state.settings.openTabs.slice();
                          const [movedTab] = newTabs.splice(fromIndex, 1);
                          newTabs.splice(toIndex, 0, movedTab);

                          // Persist the new order
                          state.applySettings({
                            ...state.settings,
                            openTabs: newTabs,
                          });

                          // Clean up visual feedback
                          (e.currentTarget as HTMLElement).classList.remove(
                            "drop-left",
                            "drop-right",
                          );
                        }}
                        title=${displayName}
                      >
                        ${
                          isEditing
                            ? html`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${session?.displayName ?? session?.label ?? ""}
                            @click=${(e: Event) => e.stopPropagation()}
                            @dblclick=${(e: Event) => e.stopPropagation()}
                            @blur=${async (e: Event) => {
                              const input = e.target as HTMLInputElement;
                              // Skip if Enter already handled this rename (prevents duplicate patch)
                              if ((input as unknown as Record<string, boolean>)._committedByEnter) {
                                return;
                              }
                              const newName = input.value.trim();
                              state.editingTabKey = null;
                              const currentName = session?.displayName ?? session?.label ?? "";
                              if (newName !== currentName) {
                                // Clear auto-title cache so manual rename takes precedence
                                autoTitleCache.delete(key);
                                const result = await patchSession(state, key, {
                                  displayName: newName || null,
                                });
                                // Reload sessions to show updated name
                                void loadSessions(state);
                                // Update openTabs with canonical key if it differs
                                const canonicalKey =
                                  result.ok && result.canonicalKey !== key
                                    ? result.canonicalKey
                                    : key;
                                const wasActive = key === state.sessionKey;
                                // Always update tabLastViewed to prevent false "unread" indicator after rename
                                state.applySettings({
                                  ...state.settings,
                                  ...(result.ok &&
                                  result.canonicalKey !== key &&
                                  state.settings.openTabs.includes(key)
                                    ? {
                                        openTabs: state.settings.openTabs.map((t) =>
                                          t === key ? result.canonicalKey : t,
                                        ),
                                      }
                                    : {}),
                                  tabLastViewed: {
                                    ...state.settings.tabLastViewed,
                                    [canonicalKey]: Date.now(),
                                  },
                                  ...(wasActive && result.ok && result.canonicalKey !== key
                                    ? {
                                        sessionKey: result.canonicalKey,
                                        lastActiveSessionKey: result.canonicalKey,
                                      }
                                    : {}),
                                });
                                if (wasActive && result.ok && result.canonicalKey !== key) {
                                  state.sessionKey = result.canonicalKey;
                                  syncUrlWithSessionKey(state, result.canonicalKey, true);
                                }
                              } else {
                                // Even if name didn't change, update tabLastViewed to clear any stale indicator
                                state.applySettings({
                                  ...state.settings,
                                  tabLastViewed: {
                                    ...state.settings.tabLastViewed,
                                    [key]: Date.now(),
                                  },
                                });
                              }
                            }}
                            @keydown=${async (e: KeyboardEvent) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                // Mark so blur handler (fired by DOM removal) skips duplicate patch
                                (input as unknown as Record<string, boolean>)._committedByEnter =
                                  true;
                                const newName = input.value.trim();
                                state.editingTabKey = null;
                                const currentName = session?.displayName ?? session?.label ?? "";
                                if (newName !== currentName) {
                                  // Clear auto-title cache so manual rename takes precedence
                                  autoTitleCache.delete(key);
                                  const result = await patchSession(state, key, {
                                    displayName: newName || null,
                                  });
                                  // Reload sessions to show updated name
                                  void loadSessions(state);
                                  // Update openTabs with canonical key if it differs
                                  const canonicalKey =
                                    result.ok && result.canonicalKey !== key
                                      ? result.canonicalKey
                                      : key;
                                  const wasActive = key === state.sessionKey;
                                  // Always update tabLastViewed to prevent false "unread" indicator after rename
                                  state.applySettings({
                                    ...state.settings,
                                    ...(result.ok &&
                                    result.canonicalKey !== key &&
                                    state.settings.openTabs.includes(key)
                                      ? {
                                          openTabs: state.settings.openTabs.map((t) =>
                                            t === key ? result.canonicalKey : t,
                                          ),
                                        }
                                      : {}),
                                    tabLastViewed: {
                                      ...state.settings.tabLastViewed,
                                      [canonicalKey]: Date.now(),
                                    },
                                    ...(wasActive && result.ok && result.canonicalKey !== key
                                      ? {
                                          sessionKey: result.canonicalKey,
                                          lastActiveSessionKey: result.canonicalKey,
                                        }
                                      : {}),
                                  });
                                  if (wasActive && result.ok && result.canonicalKey !== key) {
                                    state.sessionKey = result.canonicalKey;
                                    syncUrlWithSessionKey(state, result.canonicalKey, true);
                                  }
                                } else {
                                  // Even if name didn't change, update tabLastViewed to clear any stale indicator
                                  state.applySettings({
                                    ...state.settings,
                                    tabLastViewed: {
                                      ...state.settings.tabLastViewed,
                                      [key]: Date.now(),
                                    },
                                  });
                                }
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                state.editingTabKey = null;
                              }
                            }}
                          />
                        `
                            : (() => {
                                // Track pending click for double-click detection
                                let clickTimeout: ReturnType<typeof setTimeout> | null = null;
                                return html`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${(e: Event) => {
                              // Stop immediate propagation to prevent parent click handler
                              e.stopPropagation();
                              // Set a short timeout to allow double-click to be detected
                              // If no dblclick within 250ms, trigger tab switch
                              if (clickTimeout) {
                                clearTimeout(clickTimeout);
                              }
                              clickTimeout = setTimeout(() => {
                                clickTimeout = null;
                                // Manually trigger the tab switch logic that would have happened
                                if (state.editingTabKey === key) {
                                  return;
                                } // Already editing
                                if (key === state.sessionKey) {
                                  // Already active, just update tabLastViewed
                                  state.applySettings({
                                    ...state.settings,
                                    tabLastViewed: {
                                      ...state.settings.tabLastViewed,
                                      [key]: Date.now(),
                                    },
                                  });
                                } else {
                                  // Switch to this tab
                                  saveDraft(state);
                                  state.sessionKey = key;
                                  restoreDraft(state, key);
                                  state.chatLoading = true;
                                  state.chatStream = null;
                                  state.chatStreamStartedAt = null;
                                  state.chatRunId = null;
                                  state.resetToolStream();
                                  state.resetChatScroll();
                                  state.applySettings({
                                    ...state.settings,
                                    sessionKey: key,
                                    lastActiveSessionKey: key,
                                    tabLastViewed: {
                                      ...state.settings.tabLastViewed,
                                      [key]: Date.now(),
                                    },
                                  });
                                  void state.loadAssistantIdentity();
                                  syncUrlWithSessionKey(state, key, true);
                                  void loadChatHistory(state);
                                  void loadSessions(state);
                                }
                              }, 250);
                            }}
                            @dblclick=${(e: Event) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Cancel any pending single-click action
                              if (clickTimeout) {
                                clearTimeout(clickTimeout);
                                clickTimeout = null;
                              }
                              state.editingTabKey = key;
                              const tabEl = (e.target as HTMLElement).closest(".session-tab");
                              // Click-away dismissal: clear editing when clicking outside the tab
                              const dismiss = (ev: MouseEvent) => {
                                const target = ev.target as Node;
                                if (tabEl && !tabEl.contains(target)) {
                                  state.editingTabKey = null;
                                  document.removeEventListener("mousedown", dismiss, true);
                                }
                              };
                              document.addEventListener("mousedown", dismiss, true);
                              // Focus the input after Lit re-renders
                              requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                  const input = tabEl?.querySelector(
                                    ".session-tab__name-input",
                                  ) as HTMLInputElement;
                                  if (input) {
                                    input.focus();
                                    input.select();
                                  }
                                });
                              });
                            }}
                          >${displayName}</span>
                        `;
                              })()
                        }
                        ${
                          state.chatPrivateMode && key === state.sessionKey
                            ? html`
                                <span class="session-tab__lock" title="Private chat" style="font-size: 10px; margin-left: 2px"
                                  >🔒</span
                                >
                              `
                            : nothing
                        }
                        ${
                          isWorking
                            ? html`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `
                            : nothing
                        }
                        ${
                          isReady
                            ? html`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `
                            : nothing
                        }
                        ${
                          canClose
                            ? html`
                          <button
                            class="session-tab__close"
                            @click=${(e: Event) => {
                              e.stopPropagation();
                              const newTabs = state.settings.openTabs.filter((t) => t !== key);
                              const wasActive = key === state.sessionKey;
                              state.applySettings({
                                ...state.settings,
                                openTabs: newTabs,
                                ...(wasActive
                                  ? { sessionKey: newTabs[0], lastActiveSessionKey: newTabs[0] }
                                  : {}),
                              });
                              if (wasActive) {
                                state.sessionKey = newTabs[0];
                                syncUrlWithSessionKey(state, newTabs[0], true);
                                void loadChatHistory(state);
                              }
                            }}
                            title="Close tab"
                          >×</button>
                        `
                            : nothing
                        }
                      </div>
                    `;
                  },
                )}
              `
                  : nothing
            }
          </div>
          <div class="page-meta">
            ${
              state.reconnecting
                ? html`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${state.reconnectAttempt > 1 ? ` (attempt ${state.reconnectAttempt})` : ""}...
                </div>`
                : state.lastError
                  ? html`<div class="pill ${state.lastError.startsWith("✓") ? "success" : "danger"}">${state.lastError}</div>`
                  : nothing
            }
            ${isChat ? renderChatControls(state) : nothing}
          </div>
        </section>

        ${chatFocus
          ? html`<button
              class="focus-exit-fab"
              @click=${() => state.applySettings({ ...state.settings, chatFocusMode: false })}
              title="Exit focus mode (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>`
          : nothing}

        ${
          state.tab === "overview"
            ? renderOverview({
                connected: state.connected,
                hello: state.hello,
                settings: state.settings,
                password: state.password,
                lastError: state.lastError,
                presenceCount,
                sessionsCount,
                cronEnabled: state.cronStatus?.enabled ?? null,
                cronNext,
                lastChannelsRefresh: state.channelsLastSuccess,
                updateStatus: state.updateStatus,
                updateLoading: state.updateLoading,
                updateError: state.updateError,
                updateLastChecked: state.updateLastChecked,
                updateRunning: state.updateRunning,
                onSettingsChange: (next) => state.applySettings(next),
                onPasswordChange: (next) => (state.password = next),
                onSessionKeyChange: (next) => {
                  // Save current draft before switching
                  saveDraft(state);
                  state.sessionKey = next;
                  // Restore draft for new session
                  restoreDraft(state, next);
                  state.resetToolStream();
                  state.applySettings({
                    ...state.settings,
                    sessionKey: next,
                    lastActiveSessionKey: next,
                  });
                  void state.loadAssistantIdentity();
                },
                onConnect: () => state.connect(),
                onRefresh: () => state.loadOverview(),
                onCheckUpdates: () => checkForUpdates(state),
                onUpdateNow: () => {
                  void runUpdate(state);
                },
              })
            : nothing
        }

        ${
          state.tab === "mission"
            ? renderMissionControl({
                connected: state.connected,
                loading: state.missionLoading,
                error: state.missionError,
                agents: state.missionAgents,
                activeRuns: state.missionActiveRuns,
                subagentRuns: state.missionSubagentRuns,
                tasks: state.missionTasks,
                feedItems: state.missionFeedItems,
                onRefresh: () => state.handleMissionRefresh(),
                onTaskComplete: (taskId) => void state.handleMissionTaskComplete(taskId),
                onOpenDeck: () => state.handleMissionOpenDeck(),
              })
            : nothing
        }

        ${
          state.tab === "workspaces"
            ? renderWorkspaces({
                connected: state.connected,
                workspaces: state.workspaces ?? [],
                selectedWorkspace: state.selectedWorkspace ?? null,
                searchQuery: state.workspacesSearchQuery ?? "",
                itemSearchQuery: state.workspaceItemSearchQuery ?? "",
                expandedFolders: state.workspaceExpandedFolders ?? new Set<string>(),
                loading: state.workspacesLoading ?? false,
                createLoading: state.workspacesCreateLoading ?? false,
                error: state.workspacesError ?? null,
                onSearch: (query) => (state.workspacesSearchQuery = query),
                onItemSearch: (query) => (state.workspaceItemSearchQuery = query),
                onCreateWorkspace: async (input) => {
                  state.workspacesCreateLoading = true;
                  try {
                    const { createWorkspace, selectWorkspace } =
                      await import("./controllers/workspaces");
                    const created = await createWorkspace(state, input);
                    if (!created) {
                      state.showToast("Failed to create workspace", "error");
                      return false;
                    }
                    state.workspaceItemSearchQuery = "";
                    await selectWorkspace(state, created);
                    state.showToast(`Created workspace: ${created.name}`, "success");
                    return true;
                  } finally {
                    state.workspacesCreateLoading = false;
                  }
                },
                onSelectWorkspace: async (workspace) => {
                  state.workspaceItemSearchQuery = ""; // Clear item search when selecting workspace
                  const { selectWorkspace } = await import("./controllers/workspaces");
                  await selectWorkspace(state, workspace);
                },
                onBack: () => {
                  state.selectedWorkspace = null;
                  state.workspaceItemSearchQuery = ""; // Clear item search when going back
                },
                onItemClick: async (item) => {
                  const { readWorkspaceFile } = await import("./controllers/workspaces");
                  const workspaceId = state.selectedWorkspace?.id;
                  const result = await readWorkspaceFile(state, item.path, workspaceId);
                  if (!result) {
                    state.showToast(`Failed to open ${item.name}`, "error");
                    return;
                  }
                  state.handleOpenSidebar(result.content, {
                    mimeType: result.mime,
                    filePath: item.path,
                    title: item.name,
                  });
                },
                onSessionClick: async (session) => {
                  if (!session.key) {
                    return;
                  }
                  const nextKey = session.key;
                  saveDraft(state);
                  state.sessionKey = nextKey;
                  restoreDraft(state, nextKey);
                  state.chatLoading = true;
                  state.chatStream = null;
                  state.chatStreamStartedAt = null;
                  state.chatRunId = null;
                  state.resetToolStream();
                  state.resetChatScroll();
                  const openTabs = state.settings.openTabs.includes(nextKey)
                    ? state.settings.openTabs
                    : [...state.settings.openTabs, nextKey];
                  state.applySettings({
                    ...state.settings,
                    openTabs,
                    sessionKey: nextKey,
                    lastActiveSessionKey: nextKey,
                    tabLastViewed: {
                      ...state.settings.tabLastViewed,
                      [nextKey]: Date.now(),
                    },
                  });
                  state.setTab("chat" as Tab);
                  void state.loadAssistantIdentity();
                  syncUrlWithSessionKey(state, nextKey, true);
                  void loadChatHistory(state);
                },
                onPinToggle: async (workspaceId, filePath, pinned) => {
                  const { toggleWorkspacePin } = await import("./controllers/workspaces");
                  const ok = await toggleWorkspacePin(state, workspaceId, filePath, pinned);
                  if (!ok) {
                    state.showToast("Failed to update pin", "error");
                  }
                },
                onPinSessionToggle: async (workspaceId, sessionKey, pinned) => {
                  const { toggleWorkspaceSessionPin } = await import("./controllers/workspaces");
                  const ok = await toggleWorkspaceSessionPin(
                    state,
                    workspaceId,
                    sessionKey,
                    pinned,
                  );
                  if (!ok) {
                    state.showToast("Failed to update session pin", "error");
                  }
                },
                onToggleFolder: (folderPath) => {
                  import("./controllers/workspaces").then(({ toggleWorkspaceFolder }) => {
                    state.workspaceExpandedFolders = toggleWorkspaceFolder(
                      state.workspaceExpandedFolders ?? new Set(),
                      folderPath,
                    );
                  });
                },
                onTeamSetup: () => {
                  import("./controllers/workspaces").then(({ startTeamSetup }) => {
                    void startTeamSetup(state);
                  });
                },
                allTasks: state.allTasks ?? [],
                taskFilter: state.taskFilter ?? "all",
                showCompletedTasks: state.showCompletedTasks ?? false,
                onToggleTaskComplete: async (taskId, currentStatus) => {
                  const { toggleTaskComplete, loadAllTasks, getWorkspace } =
                    await import("./controllers/workspaces");
                  const result = await toggleTaskComplete(state, taskId, currentStatus);
                  if (!result) {
                    state.showToast("Failed to update task", "error");
                    return;
                  }
                  // Refresh tasks
                  state.allTasks = await loadAllTasks(state);
                  if (state.selectedWorkspace) {
                    const refreshed = await getWorkspace(state, state.selectedWorkspace.id);
                    if (refreshed) {
                      state.selectedWorkspace = refreshed;
                    }
                  }
                },
                onCreateTask: async (title, project) => {
                  const { createTask, loadAllTasks, getWorkspace } =
                    await import("./controllers/workspaces");
                  const result = await createTask(state, title, project);
                  if (!result) {
                    state.showToast("Failed to create task", "error");
                    return;
                  }
                  state.showToast(`Task created: ${result.title}`, "success");
                  // Refresh tasks
                  state.allTasks = await loadAllTasks(state);
                  if (state.selectedWorkspace) {
                    const refreshed = await getWorkspace(state, state.selectedWorkspace.id);
                    if (refreshed) {
                      state.selectedWorkspace = refreshed;
                    }
                  }
                },
                onSetTaskFilter: (filter) => {
                  state.taskFilter = filter;
                },
                onToggleCompletedTasks: () => {
                  state.showCompletedTasks = !(state.showCompletedTasks ?? false);
                },
              })
            : nothing
        }

        ${
          state.tab === "today" || state.tab === "my-day"
            ? state.dynamicSlots["today"]
              ? renderDynamicSlot(state, "today")
              : renderMyDay({
                  connected: state.connected,
                  loading: state.myDayLoading ?? false,
                  error: state.myDayError ?? null,
                  onRefresh: () => state.handleMyDayRefresh(),
                  // Daily Brief props
                  dailyBrief: state.dailyBrief ?? null,
                  dailyBriefLoading: state.dailyBriefLoading ?? false,
                  dailyBriefError: state.dailyBriefError ?? null,
                  onBriefRefresh: () => state.handleDailyBriefRefresh(),
                  onBriefOpenInObsidian: () => state.handleDailyBriefOpenInObsidian(),
                  onBriefSave: (content: string) => state.handleBriefSave(content),
                  onOpenFile: (path: string) => void state.handleOpenFile(path),
                  briefEditing: state.briefEditing ?? false,
                  onBriefEditStart: () => state.handleBriefEditStart(),
                  onBriefEditEnd: () => state.handleBriefEditEnd(),
                  // Date navigation props
                  selectedDate: state.todaySelectedDate,
                  onDatePrev: () => state.handleDatePrev(),
                  onDateNext: () => state.handleDateNext(),
                  onDateToday: () => state.handleDateToday(),
                  // View mode toggle
                  viewMode: state.todayViewMode ?? "my-day",
                  onViewModeChange: (mode) => state.handleTodayViewModeChange(mode),
                  // Agent log props
                  agentLog: state.agentLog ?? null,
                  agentLogLoading: state.agentLogLoading ?? false,
                  agentLogError: state.agentLogError ?? null,
                  onAgentLogRefresh: () => state.handleMyDayRefresh(),
                  // Focus Pulse
                  focusPulseActive: focusPulseActive,
                  onStartMorningSet: focusPulseEnabled ? () => state.handleFocusPulseStartMorning() : undefined,
                })
            : nothing
        }

        ${
          state.tab === "work"
            ? state.dynamicSlots["work"]
              ? renderDynamicSlot(state, "work")
              : renderWork({
                  connected: state.connected,
                  projects: state.workProjects ?? [],
                  loading: state.workLoading ?? false,
                  error: state.workError ?? null,
                  expandedProjects: state.workExpandedProjects,
                  projectFiles: state.workProjectFiles ?? {},
                  detailLoading: state.workDetailLoading ?? new Set(),
                  onRefresh: () => state.handleWorkRefresh(),
                  onToggleProject: (id) => state.handleWorkToggleProject(id),
                  onPersonClick: (personId) => state.handleWorkPersonClick(personId),
                  onFileClick: (path) => state.handleWorkFileClick(path),
                  onSkillClick: (skill, projectName) =>
                    state.handleWorkSkillClick(skill, projectName),
                })
            : nothing
        }

        ${
          state.tab === "people"
            ? state.dynamicSlots["people"]
              ? renderDynamicSlot(state, "people")
              : renderPeople({
                  connected: state.connected,
                  people: state.peopleList ?? [],
                  loading: state.peopleLoading ?? false,
                  error: state.peopleError ?? null,
                  selectedId: state.peopleSelected ?? null,
                  searchQuery: state.peopleSearchQuery ?? "",
                  onRefresh: () => state.handlePeopleRefresh(),
                  onSelectPerson: (id) => state.handlePeopleSelect(id),
                  onBack: () => state.handlePeopleBack(),
                  onSearchChange: (query) => state.handlePeopleSearch(query),
                  onImportContacts: (source) => state.handlePeopleImport(source),
                })
            : nothing
        }

        ${
          state.tab === "life"
            ? state.dynamicSlots["life"]
              ? renderDynamicSlot(state, "life")
              : html`
                <div class="my-day-container" style="overflow-y: auto;">
                  <div class="my-day-header">
                    <div class="my-day-header-left">
                      <h1 class="my-day-title">Life</h1>
                      <p class="my-day-subtitle">Vision board, goals, life scores, and LifeTracks.</p>
                    </div>
                    <div class="my-day-header-right">
                      <button class="my-day-refresh-btn" @click=${() =>
                        state.handleStartChatWithPrompt(
                          state.lifeSubtab === "vision-board"
                            ? "Let's update my Vision Board"
                            : state.lifeSubtab === "goals"
                              ? "Let's review and update my goals"
                              : "Time for a Wheel of Life check-in",
                        )} title="Update via Chat">
                        💬 Update
                      </button>
                    </div>
                  </div>
                  <div class="life-subnav">
                    ${(["vision-board", "goals", "wheel-of-life"] as const).map(
                      (sub) => {
                        const labels: Record<string, string> = {
                          "vision-board": "Vision Board",
                          goals: "Goals",
                          "wheel-of-life": "Wheel of Life",
                        };
                        const active = (state.lifeSubtab ?? "vision-board") === sub;
                        return html`
                        <button
                          class="life-subnav__item ${active ? "active" : ""}"
                          @click=${() => state.handleLifeSubtabChange(sub)}
                        >${labels[sub]}</button>
                      `;
                      },
                    )}
                  </div>
                  <div class="life-subtab-content">
                    ${
                      (state.lifeSubtab ?? "vision-board") === "vision-board"
                        ? renderVisionBoard({
                            connected: state.connected,
                            data: state.visionBoardData ?? null,
                            identityToday: state.visionBoardIdentityToday ?? null,
                            loading: state.visionBoardLoading ?? false,
                            error: state.visionBoardError ?? null,
                            onRefresh: () => state.handleVisionBoardRefresh(),
                            onUpdateViaChat: () =>
                              state.handleStartChatWithPrompt(
                                "Let's update my Vision Board — review my Chief Definite Aim, annual themes, values, and identity statements.",
                              ),
                          })
                        : nothing
                    }
                    ${
                      (state.lifeSubtab ?? "vision-board") === "lifetracks"
                        ? renderLifetracks({
                            connected: state.connected,
                            data: state.lifetracksData ?? null,
                            currentTrack: state.lifetracksCurrentTrack ?? null,
                            loading: state.lifetracksLoading ?? false,
                            error: state.lifetracksError ?? null,
                            config: state.lifetracksConfig ?? null,
                            generating: state.lifetracksGenerating ?? false,
                            generationError: state.lifetracksGenerationError ?? null,
                            onRefresh: () => state.handleLifetracksRefresh(),
                            onSelectTrack: (track) => state.handleLifetracksSelectTrack(track),
                            onEnable: () => state.handleLifetracksEnable(),
                            onGenerate: () => state.handleLifetracksGenerate(),
                            onUpdateViaChat: () =>
                              state.handleStartChatWithPrompt(
                                "Time to update my LifeTracks — let's review my meditation and affirmation audio settings.",
                              ),
                          })
                        : nothing
                    }
                    ${
                      state.lifeSubtab === "goals"
                        ? renderGoals({
                            connected: state.connected,
                            goals: state.goals ?? [],
                            loading: state.goalsLoading ?? false,
                            error: state.goalsError ?? null,
                            onRefresh: () => state.handleGoalsRefresh(),
                            onUpdateViaChat: () =>
                              state.handleStartChatWithPrompt("Let's review and update my goals"),
                          })
                        : nothing
                    }
                    ${
                      state.lifeSubtab === "wheel-of-life"
                        ? renderWheelOfLife({
                            connected: state.connected,
                            data: state.wheelOfLifeData ?? null,
                            loading: state.wheelOfLifeLoading ?? false,
                            error: state.wheelOfLifeError ?? null,
                            editMode: state.wheelOfLifeEditMode ?? false,
                            onRefresh: () => state.handleWheelOfLifeRefresh(),
                            onEdit: () => state.handleWheelOfLifeEdit(),
                            onSave: (updates) => state.handleWheelOfLifeSave(updates),
                            onCancel: () => state.handleWheelOfLifeCancel(),
                            onUpdateViaChat: () =>
                              state.handleStartChatWithPrompt(
                                "Let's do a Wheel of Life check-in — rate my current satisfaction across all 8 life areas.",
                              ),
                          })
                        : nothing
                    }
                  </div>
                </div>
              `
            : nothing
        }

        ${
          state.tab === "data"
            ? state.dynamicSlots["data"]
              ? renderDynamicSlot(state, "data")
              : renderDataTab({
                  connected: state.connected,
                  sources: state.dataSources ?? [],
                  loading: state.dataLoading ?? false,
                  error: state.dataError ?? null,
                  subtab: state.dataSubtab ?? "dashboard",
                  onRefresh: () => state.handleDataRefresh(),
                  onSubtabChange: (sub) => state.handleDataSubtabChange(sub),
                  onConnectSource: (sourceId) => state.handleDataConnectSource(sourceId),
                  onQuerySubmit: (query) => state.handleDataQuerySubmit(query),
                })
            : nothing
        }

        ${
          state.tab === "wheel-of-life"
            ? state.dynamicSlots["wheel-of-life"]
              ? renderDynamicSlot(state, "wheel-of-life")
              : renderWheelOfLife({
                  connected: state.connected,
                  data: state.wheelOfLifeData ?? null,
                  loading: state.wheelOfLifeLoading ?? false,
                  error: state.wheelOfLifeError ?? null,
                  editMode: state.wheelOfLifeEditMode ?? false,
                  onRefresh: () => state.handleWheelOfLifeRefresh(),
                  onEdit: () => state.handleWheelOfLifeEdit(),
                  onSave: (updates) => state.handleWheelOfLifeSave(updates),
                  onCancel: () => state.handleWheelOfLifeCancel(),
                })
            : nothing
        }

        ${
          state.tab === "vision-board"
            ? state.dynamicSlots["vision-board"]
              ? renderDynamicSlot(state, "vision-board")
              : renderVisionBoard({
                  connected: state.connected,
                  data: state.visionBoardData ?? null,
                  identityToday: state.visionBoardIdentityToday ?? null,
                  loading: state.visionBoardLoading ?? false,
                  error: state.visionBoardError ?? null,
                  onRefresh: () => state.handleVisionBoardRefresh(),
                })
            : nothing
        }

        ${
          state.tab === "lifetracks"
            ? state.dynamicSlots["lifetracks"]
              ? renderDynamicSlot(state, "lifetracks")
              : renderLifetracks({
                  connected: state.connected,
                  data: state.lifetracksData ?? null,
                  currentTrack: state.lifetracksCurrentTrack ?? null,
                  loading: state.lifetracksLoading ?? false,
                  error: state.lifetracksError ?? null,
                  config: state.lifetracksConfig ?? null,
                  generating: state.lifetracksGenerating ?? false,
                  generationError: state.lifetracksGenerationError ?? null,
                  onRefresh: () => state.handleLifetracksRefresh(),
                  onSelectTrack: (track) => state.handleLifetracksSelectTrack(track),
                  onEnable: () => state.handleLifetracksEnable(),
                  onGenerate: () => state.handleLifetracksGenerate(),
                })
            : nothing
        }

        ${
          state.tab === "channels"
            ? renderChannels({
                connected: state.connected,
                loading: state.channelsLoading,
                snapshot: state.channelsSnapshot,
                lastError: state.channelsError,
                lastSuccessAt: state.channelsLastSuccess,
                whatsappMessage: state.whatsappLoginMessage,
                whatsappQrDataUrl: state.whatsappLoginQrDataUrl,
                whatsappConnected: state.whatsappLoginConnected,
                whatsappBusy: state.whatsappBusy,
                configSchema: state.configSchema,
                configSchemaLoading: state.configSchemaLoading,
                configForm: state.configForm,
                configUiHints: state.configUiHints,
                configSaving: state.configSaving,
                configFormDirty: state.configFormDirty,
                nostrProfileFormState: state.nostrProfileFormState,
                nostrProfileAccountId: state.nostrProfileAccountId,
                onRefresh: (probe) => loadChannels(state, probe),
                onWhatsAppStart: (force) => state.handleWhatsAppStart(force),
                onWhatsAppWait: () => state.handleWhatsAppWait(),
                onWhatsAppLogout: () => state.handleWhatsAppLogout(),
                onConfigPatch: (path, value) => updateConfigFormValue(state, path, value),
                onConfigSave: () => state.handleChannelConfigSave(),
                onConfigReload: () => state.handleChannelConfigReload(),
                onNostrProfileEdit: (accountId, profile) =>
                  state.handleNostrProfileEdit(accountId, profile),
                onNostrProfileCancel: () => state.handleNostrProfileCancel(),
                onNostrProfileFieldChange: (field, value) =>
                  state.handleNostrProfileFieldChange(field, value),
                onNostrProfileSave: () => state.handleNostrProfileSave(),
                onNostrProfileImport: () => state.handleNostrProfileImport(),
                onNostrProfileToggleAdvanced: () => state.handleNostrProfileToggleAdvanced(),
              })
            : nothing
        }

        ${
          state.tab === "instances"
            ? renderInstances({
                loading: state.presenceLoading,
                entries: state.presenceEntries,
                lastError: state.presenceError,
                statusMessage: state.presenceStatus,
                onRefresh: () => loadPresence(state),
              })
            : nothing
        }

        ${
          state.tab === "sessions"
            ? renderSessions({
                loading: state.sessionsLoading,
                result: state.sessionsResult,
                error: state.sessionsError,
                activeMinutes: state.sessionsFilterActive,
                limit: state.sessionsFilterLimit,
                includeGlobal: state.sessionsIncludeGlobal,
                includeUnknown: state.sessionsIncludeUnknown,
                basePath: state.basePath,
                onFiltersChange: (next) => {
                  state.sessionsFilterActive = next.activeMinutes;
                  state.sessionsFilterLimit = next.limit;
                  state.sessionsIncludeGlobal = next.includeGlobal;
                  state.sessionsIncludeUnknown = next.includeUnknown;
                },
                onRefresh: () => loadSessions(state),
                onPatch: async (key, patch) => {
                  const result = await patchSession(state, key, patch);
                  // Update openTabs with canonical key if it differs
                  if (
                    result.ok &&
                    result.canonicalKey !== key &&
                    state.settings.openTabs.includes(key)
                  ) {
                    const newTabs = state.settings.openTabs.map((t) =>
                      t === key ? result.canonicalKey : t,
                    );
                    const wasActive = key === state.sessionKey;
                    state.applySettings({
                      ...state.settings,
                      openTabs: newTabs,
                      tabLastViewed: {
                        ...state.settings.tabLastViewed,
                        [result.canonicalKey]: state.settings.tabLastViewed[key] ?? Date.now(),
                      },
                      ...(wasActive
                        ? {
                            sessionKey: result.canonicalKey,
                            lastActiveSessionKey: result.canonicalKey,
                          }
                        : {}),
                    });
                    if (wasActive) {
                      state.sessionKey = result.canonicalKey;
                      syncUrlWithSessionKey(state, result.canonicalKey, true);
                    }
                  }
                },
                onDelete: (key) => deleteSession(state, key),
              })
            : nothing
        }

        ${
          state.tab === "cron"
            ? renderCron({
                loading: state.cronLoading,
                status: state.cronStatus,
                jobs: state.cronJobs,
                error: state.cronError,
                busy: state.cronBusy,
                form: state.cronForm,
                channels: state.channelsSnapshot?.channelMeta?.length
                  ? state.channelsSnapshot.channelMeta.map((entry) => entry.id)
                  : (state.channelsSnapshot?.channelOrder ?? []),
                channelLabels: state.channelsSnapshot?.channelLabels ?? {},
                channelMeta: state.channelsSnapshot?.channelMeta ?? [],
                runsJobId: state.cronRunsJobId,
                runs: state.cronRuns,
                onFormChange: (patch) => (state.cronForm = { ...state.cronForm, ...patch }),
                onRefresh: () => state.loadCron(),
                onAdd: () => addCronJob(state),
                onToggle: (job, enabled) => toggleCronJob(state, job, enabled),
                onRun: (job) => runCronJob(state, job),
                onRemove: (job) => removeCronJob(state, job),
                onLoadRuns: (jobId) => loadCronRuns(state, jobId),
              })
            : nothing
        }

        ${
          state.tab === "skills"
            ? renderSkills({
                loading: state.skillsLoading,
                report: state.skillsReport,
                error: state.skillsError,
                filter: state.skillsFilter,
                edits: state.skillEdits,
                messages: state.skillMessages,
                busyKey: state.skillsBusyKey,
                onFilterChange: (next) => (state.skillsFilter = next),
                onRefresh: () => loadSkills(state, { clearMessages: true }),
                onToggle: (key, enabled) => updateSkillEnabled(state, key, enabled),
                onEdit: (key, value) => updateSkillEdit(state, key, value),
                onSaveKey: (key) => saveSkillApiKey(state, key),
                onInstall: (skillKey, name, installId) =>
                  installSkill(state, skillKey, name, installId),
              })
            : nothing
        }

        ${
          state.tab === "nodes"
            ? renderNodes({
                loading: state.nodesLoading,
                nodes: state.nodes,
                devicesLoading: state.devicesLoading,
                devicesError: state.devicesError,
                devicesList: state.devicesList,
                configForm:
                  state.configForm ??
                  (state.configSnapshot?.config as Record<string, unknown> | null),
                configLoading: state.configLoading,
                configSaving: state.configSaving,
                configDirty: state.configFormDirty,
                configFormMode: state.configFormMode,
                execApprovalsLoading: state.execApprovalsLoading,
                execApprovalsSaving: state.execApprovalsSaving,
                execApprovalsDirty: state.execApprovalsDirty,
                execApprovalsSnapshot: state.execApprovalsSnapshot,
                execApprovalsForm: state.execApprovalsForm,
                execApprovalsSelectedAgent: state.execApprovalsSelectedAgent,
                execApprovalsTarget: state.execApprovalsTarget,
                execApprovalsTargetNodeId: state.execApprovalsTargetNodeId,
                onRefresh: () => loadNodes(state),
                onDevicesRefresh: () => loadDevices(state),
                onDeviceApprove: (requestId) => approveDevicePairing(state, requestId),
                onDeviceReject: (requestId) => rejectDevicePairing(state, requestId),
                onDeviceRotate: (deviceId, role, scopes) =>
                  rotateDeviceToken(state, { deviceId, role, scopes }),
                onDeviceRevoke: (deviceId, role) => revokeDeviceToken(state, { deviceId, role }),
                onLoadConfig: () => loadConfig(state),
                onLoadExecApprovals: () => {
                  const target =
                    state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                      ? { kind: "node" as const, nodeId: state.execApprovalsTargetNodeId }
                      : { kind: "gateway" as const };
                  return loadExecApprovals(state, target);
                },
                onBindDefault: (nodeId) => {
                  if (nodeId) {
                    updateConfigFormValue(state, ["tools", "exec", "node"], nodeId);
                  } else {
                    removeConfigFormValue(state, ["tools", "exec", "node"]);
                  }
                },
                onBindAgent: (agentIndex, nodeId) => {
                  const basePath = ["agents", "list", agentIndex, "tools", "exec", "node"];
                  if (nodeId) {
                    updateConfigFormValue(state, basePath, nodeId);
                  } else {
                    removeConfigFormValue(state, basePath);
                  }
                },
                onSaveBindings: () => saveConfig(state),
                onExecApprovalsTargetChange: (kind, nodeId) => {
                  state.execApprovalsTarget = kind;
                  state.execApprovalsTargetNodeId = nodeId;
                  state.execApprovalsSnapshot = null;
                  state.execApprovalsForm = null;
                  state.execApprovalsDirty = false;
                  state.execApprovalsSelectedAgent = null;
                },
                onExecApprovalsSelectAgent: (agentId) => {
                  state.execApprovalsSelectedAgent = agentId;
                },
                onExecApprovalsPatch: (path, value) =>
                  updateExecApprovalsFormValue(state, path, value),
                onExecApprovalsRemove: (path) => removeExecApprovalsFormValue(state, path),
                onSaveExecApprovals: () => {
                  const target =
                    state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                      ? { kind: "node" as const, nodeId: state.execApprovalsTargetNodeId }
                      : { kind: "gateway" as const };
                  return saveExecApprovals(state, target);
                },
              })
            : nothing
        }

        ${
          obActive && obPhase >= 2 && obPhase <= 5 && state.tab === "chat"
            ? renderOnboardingProgress({
                phase: obPhase,
                identity: obData?.identity ?? null,
                tools: (obData?.tools ?? []),
                auditFindings: (obData?.audit?.findings ?? []),
                summary: obData?.summary ?? null,
                onStart: () => {},
                onIdentitySubmit: () => {},
                onComplete: () => state.handleOnboardingComplete?.(),
                onSkipPhase: () => state.handleOnboardingSkipPhase?.(),
              })
            : state.tab === "chat" && state.workspaceNeedsSetup && !state.chatMessages?.length && !obActive
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
                          state.workspaceNeedsSetup = false;
                          state.chatMessage = "Set up my GodMode workspace";
                          void state.handleSendChat("Set up my GodMode workspace");
                        }}
                      >
                        Start Setup
                      </button>
                      <button
                        class="welcome-skip"
                        @click=${() => {
                          state.workspaceNeedsSetup = false;
                        }}
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                `
              : nothing
        }

        ${
          state.tab === "chat" && state.settings.chatParallelView
            ? renderParallelSessions({
                state,
                onAssignLane: (laneIndex, sessionKey) => {
                  const canonicalSessionKey = sessionKey
                    ? findSessionByKey(state.sessionsResult?.sessions, sessionKey)?.key ?? sessionKey
                    : null;
                  const lanes = [...state.settings.parallelLanes];
                  lanes[laneIndex] = canonicalSessionKey;
                  state.applySettings({
                    ...state.settings,
                    parallelLanes: lanes,
                  });
                  // Load history for newly assigned session, then trigger re-render
                  if (canonicalSessionKey && state.client) {
                    void loadLaneHistory(state.client, canonicalSessionKey).then(() => {
                      // Touch settings to force Lit re-render with populated cache
                      state.applySettings({ ...state.settings });
                    });
                  }
                },
                onReorderLanes: (fromIndex, toIndex) => {
                  if (
                    fromIndex === toIndex ||
                    fromIndex < 0 ||
                    toIndex < 0 ||
                    fromIndex >= state.settings.parallelLanes.length ||
                    toIndex >= state.settings.parallelLanes.length
                  ) {
                    return;
                  }
                  const lanes = [...state.settings.parallelLanes];
                  const [moved] = lanes.splice(fromIndex, 1);
                  lanes.splice(toIndex, 0, moved);
                  state.applySettings({
                    ...state.settings,
                    parallelLanes: lanes,
                  });
                },
                onLaneViewed: (sessionKey) => {
                  const canonicalKey =
                    findSessionByKey(state.sessionsResult?.sessions, sessionKey)?.key ?? sessionKey;
                  const now = Date.now();
                  const session = findSessionByKey(state.sessionsResult?.sessions, canonicalKey);
                  const updatedAt = session?.updatedAt ?? 0;
                  const lastViewed = Math.max(
                    state.settings.tabLastViewed[sessionKey] ?? 0,
                    state.settings.tabLastViewed[canonicalKey] ?? 0,
                  );
                  if (updatedAt > 0 && lastViewed >= updatedAt) {
                    return;
                  }
                  state.applySettings({
                    ...state.settings,
                    tabLastViewed: {
                      ...state.settings.tabLastViewed,
                      [sessionKey]: now,
                      [canonicalKey]: now,
                    },
                  });
                },
                onSendInLane: (sessionKey, message) => {
                  if (sessionKey !== state.sessionKey) {
                    // Switch to this session first, then send
                    saveDraft(state);
                    state.sessionKey = sessionKey;
                    restoreDraft(state, sessionKey);
                    state.chatLoading = true;
                    state.chatMessages = [];
                    state.chatStream = null;
                    state.chatStreamStartedAt = null;
                    state.chatRunId = null;
                    state.resetToolStream();
                    state.applySettings({
                      ...state.settings,
                      sessionKey,
                      lastActiveSessionKey: sessionKey,
                    });
                    void state.loadAssistantIdentity();
                    syncUrlWithSessionKey(state, sessionKey, true);
                    void loadChatHistory(state).then(() => {
                      state.chatMessage = message;
                      void state.handleSendChat(message);
                    });
                  } else {
                    state.chatMessage = message;
                    void state.handleSendChat(message);
                  }
                },
              })
            : nothing
        }

        ${
          state.tab === "chat" && !state.settings.chatParallelView
            ? renderChat({
                basePath: state.basePath,
                sessionKey: state.sessionKey,
                onSessionKeyChange: (next) => {
                  // Save current draft before switching
                  saveDraft(state);
                  state.sessionKey = next;
                  // Restore draft for new session
                  restoreDraft(state, next);
                  state.chatLoading = true;
                  state.chatMessages = [];
                  state.chatAttachments = [];
                  state.chatStream = null;
                  state.chatStreamStartedAt = null;
                  state.chatRunId = null;
                  state.chatQueue = [];
                  state.resetToolStream();
                  state.resetChatScroll();
                  state.applySettings({
                    ...state.settings,
                    sessionKey: next,
                    lastActiveSessionKey: next,
                  });
                  void state.loadAssistantIdentity();
                  void loadChatHistory(state);
                  void refreshChatAvatar(state);
                },
                thinkingLevel: state.chatThinkingLevel,
                showThinking,
                loading: state.chatLoading,
                sending: state.chatSending,
                sendingSessionKey: state.chatSendingSessionKey,
                compactionStatus: state.compactionStatus,
                assistantAvatarUrl: chatAvatarUrl,
                messages: state.chatMessages,
                toolMessages: state.chatToolMessages,
                stream: state.chatStream,
                streamStartedAt: state.chatStreamStartedAt,
                draft: state.chatMessage,
                queue: state.chatQueue,
                connected: state.connected,
                canSend: state.connected,
                disabledReason: chatDisabledReason,
                error: state.lastError,
                sessions: state.sessionsResult,
                focusMode: chatFocus,
                onRefresh: () => {
                  state.resetToolStream();
                  return Promise.all([loadChatHistory(state), refreshChatAvatar(state)]);
                },
                onToggleFocusMode: () => {
                  if (state.onboarding) {
                    return;
                  }
                  state.applySettings({
                    ...state.settings,
                    chatFocusMode: !state.settings.chatFocusMode,
                  });
                },
                onChatScroll: (event) => state.handleChatScroll(event),
                onDraftChange: (next) => (state.chatMessage = next),
                attachments: state.chatAttachments,
                onAttachmentsChange: (next) => (state.chatAttachments = next),
                showToast: (message, type) => state.showToast(message, type),
                onSend: (queue) => state.handleSendChat(undefined, { queue }),
                canAbort: Boolean(state.chatRunId),
                onAbort: () => void state.handleAbortChat(),
                onCompact: () => void state.handleCompactChat(),
                pendingRetry: state.pendingRetry,
                onRetry: () => void state.handleRetryMessage(),
                onClearRetry: () => state.handleClearRetry(),
                onQueueRemove: (id) => state.removeQueuedMessage(id),
                onNewSession: () => state.handleSendChat("/new", { restoreDraft: true }),
                onConsciousnessFlush: () => void state.handleConsciousnessFlush(),
                consciousnessStatus: state.consciousnessStatus,
                // Sidebar props for tool output viewing
                sidebarOpen: state.sidebarOpen,
                sidebarContent: state.sidebarContent,
                sidebarError: state.sidebarError,
                sidebarMimeType: state.sidebarMimeType,
                sidebarFilePath: state.sidebarFilePath,
                sidebarTitle: state.sidebarTitle,
                splitRatio: state.splitRatio,
                onOpenSidebar: (
                  content: string,
                  opts?: {
                    mimeType?: string | null;
                    filePath?: string | null;
                    title?: string | null;
                  },
                ) => state.handleOpenSidebar(content, opts),
                onMessageLinkClick: (href: string) => state.handleOpenMessageFileLink(href),
                onCloseSidebar: () => state.handleCloseSidebar(),
                onSplitRatioChange: (ratio: number) => state.handleSplitRatioChange(ratio),
                assistantName: state.assistantName,
                assistantAvatar: state.assistantAvatar,
                userName: state.userName,
                userAvatar: state.userAvatar,
                currentToolName: state.currentToolName,
                currentToolInfo: state.currentToolInfo,
                isWorking: state.workingSessions.has(state.sessionKey),
                // Scroll state
                showNewMessages: state.chatNewMessagesBelow,
                onScrollToBottom: () => {
                  const container = document.querySelector(".chat-thread");
                  if (container) {
                    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
                    state.chatUserNearBottom = true;
                    state.chatNewMessagesBelow = false;
                  }
                },
              })
            : nothing
        }

        ${
          state.tab === "options"
            ? renderOptions({
                connected: state.connected,
                loading: state.godmodeOptionsLoading,
                options: state.godmodeOptions,
                onToggle: (key, value) => state.handleOptionToggle(key, value),
                onRefresh: () => state.handleOptionsLoad(),
              })
            : nothing
        }

        ${
          state.tab === "trust"
            ? renderTrustTracker({
                connected: state.connected,
                loading: state.trustTrackerLoading,
                data: state.trustTrackerData,
                onAddWorkflow: (w) => state.handleTrustAddWorkflow(w),
                onRemoveWorkflow: (w) => state.handleTrustRemoveWorkflow(w),
                onRefresh: () => state.handleTrustLoad(),
              })
            : nothing
        }

        ${
          state.tab === "config"
            ? renderConfig({
                raw: state.configRaw,
                originalRaw: state.configRawOriginal,
                valid: state.configValid,
                issues: state.configIssues,
                loading: state.configLoading,
                saving: state.configSaving,
                applying: state.configApplying,
                updating: state.updateRunning,
                connected: state.connected,
                schema: state.configSchema,
                schemaLoading: state.configSchemaLoading,
                uiHints: state.configUiHints,
                formMode: state.configFormMode,
                formValue: state.configForm,
                originalValue: state.configFormOriginal,
                searchQuery: state.configSearchQuery,
                activeSection: state.configActiveSection,
                activeSubsection: state.configActiveSubsection,
                onRawChange: (next) => {
                  state.configRaw = next;
                },
                onFormModeChange: (mode) => (state.configFormMode = mode),
                onFormPatch: (path, value) => updateConfigFormValue(state, path, value),
                onSearchChange: (query) => (state.configSearchQuery = query),
                onSectionChange: (section) => {
                  state.configActiveSection = section;
                  state.configActiveSubsection = null;
                },
                onSubsectionChange: (section) => (state.configActiveSubsection = section),
                onReload: () => loadConfig(state),
                onSave: () => saveConfig(state),
                onApply: () => applyConfig(state),
                onUpdate: () => runUpdate(state),
                userName: state.userName || "",
                userAvatar: state.userAvatar,
                onUserProfileUpdate: (name, avatar) => state.handleUpdateUserProfile(name, avatar),
              })
            : nothing
        }

        ${
          state.tab === "debug"
            ? renderDebug({
                loading: state.debugLoading,
                status: state.debugStatus,
                health: state.debugHealth,
                models: state.debugModels,
                heartbeat: state.debugHeartbeat,
                eventLog: state.eventLog,
                callMethod: state.debugCallMethod,
                callParams: state.debugCallParams,
                callResult: state.debugCallResult,
                callError: state.debugCallError,
                onCallMethodChange: (next) => (state.debugCallMethod = next),
                onCallParamsChange: (next) => (state.debugCallParams = next),
                onRefresh: () => loadDebug(state),
                onCall: () => callDebugMethod(state),
              })
            : nothing
        }

        ${
          state.tab === "logs"
            ? renderLogs({
                loading: state.logsLoading,
                error: state.logsError,
                file: state.logsFile,
                entries: state.logsEntries,
                filterText: state.logsFilterText,
                levelFilters: state.logsLevelFilters,
                autoFollow: state.logsAutoFollow,
                truncated: state.logsTruncated,
                onFilterTextChange: (next) => (state.logsFilterText = next),
                onLevelToggle: (level, enabled) => {
                  state.logsLevelFilters = { ...state.logsLevelFilters, [level]: enabled };
                },
                onToggleAutoFollow: (next) => (state.logsAutoFollow = next),
                onRefresh: () => loadLogs(state, { reset: true }),
                onExport: (lines, label) => state.exportLogs(lines, label),
                onScroll: (event) => state.handleLogsScroll(event),
              })
            : nothing
        }
      </main>
      ${renderExecApprovalPrompt(state)}
      ${renderGatewayUrlConfirmation(state)}
      ${nothing /* Task modal removed — native tasks managed in Mission Control */}
      ${
        state.sidebarOpen && state.tab !== "chat"
          ? html`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${() => state.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${renderMarkdownSidebar({
                  content: state.sidebarContent ?? null,
                  error: state.sidebarError ?? null,
                  mimeType: state.sidebarMimeType ?? null,
                  filePath: state.sidebarFilePath ?? null,
                  title: state.sidebarTitle ?? null,
                  onClose: () => state.handleCloseSidebar(),
                  onViewRawText: () => {
                    if (!state.sidebarContent) {
                      return;
                    }
                    state.handleOpenSidebar(state.sidebarContent, {
                      mimeType: "text/plain",
                      filePath: state.sidebarFilePath,
                      title: state.sidebarTitle,
                    });
                  },
                })}
              </div>
            </div>
          `
          : nothing
      }
      ${renderToasts({
        toasts: state.toasts,
        onDismiss: (id) => state.dismissToast(id),
      })}
    </div>
  `;
}
