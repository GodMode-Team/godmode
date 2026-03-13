import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { parseAgentSessionKey } from "../lib/session-key-utils.js";
import { sanitizeHtmlFragment } from "./markdown";
import { refreshChatAvatar, saveDraft, restoreDraft } from "./app-chat";
import { findSessionByKey } from "./app-lifecycle";
import { createNewSession, renderChatControls, renderTab, renderThemeToggle } from "./app-render.helpers";
import { setTab, syncUrlWithSessionKey } from "./app-settings";
import type { AppViewState } from "./app-view-state";
import { loadChannels } from "./controllers/channels";
import { loadChatHistory, loadLaneHistory } from "./controllers/chat";
import {
  applyConfig,
  loadConfig,
  runUpdate,
  runPluginUpdate,
  saveConfig,
  switchModel,
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
import {
  archiveSession,
  autoTitleCache,
  deleteSession,
  loadArchivedSessions,
  loadSessions,
  patchSession,
  triggerAutoArchive,
  unarchiveSession,
} from "./controllers/sessions";
import {
  searchClawHub,
  exploreClawHub,
  getClawHubDetail,
  importFromClawHub,
  getPersonalizePrompt,
  clearClawHubDetail,
} from "./controllers/clawhub";
import {
  installSkill,
  loadGodModeSkills,
  loadSkills,
  saveSkillApiKey,
  updateSkillEdit,
  updateSkillEnabled,
} from "./controllers/skills";
import { loadRoster } from "./controllers/agents";
import { checkForUpdates } from "./controllers/updates";
import { icons } from "./icons";
import { TAB_GROUPS, POWER_USER_GROUPS, subtitleForTab, titleForTab, type Tab } from "./navigation";
import { renderAllyChat } from "./views/ally-chat.js";
import { ALLY_SESSION_KEY } from "./controllers/ally.js";
import { renderChannels } from "./views/channels";
import { renderChat } from "./views/chat";
import { renderConfig } from "./views/config";
import { renderCron } from "./views/cron";
import { renderDebug } from "./views/debug";
import { renderExecApprovalPrompt } from "./views/exec-approval";
import { renderGatewayUrlConfirmation } from "./views/gateway-url-confirmation";
import { renderGatewayRestartConfirmation } from "./views/gateway-restart";
import { renderInstances } from "./views/instances";
import { renderLogs } from "./views/logs";
import { renderMarkdownSidebar } from "./views/markdown-sidebar";
import { renderProofViewer } from "./views/proof-viewer";
import { renderMyDay, renderMyDayToolbar } from "./views/my-day";
import { renderNodes } from "./views/nodes";
import { renderOverview } from "./views/overview";
import { renderSessions } from "./views/sessions";
import { renderSkills } from "./views/skills";
import { renderAgents } from "./views/agents";
import { renderLightbox } from "./chat/lightbox";
import { getResolvedImageUrl } from "./app-gateway";
import { renderToasts } from "./views/toast";
import { renderOptions } from "./views/options";
import { renderOnboardingWizard, type WizardStep } from "./views/onboarding-wizard";
import { renderTrustTracker } from "./views/trust-tracker";
import { renderGuardrails } from "./views/guardrails";
import { renderMissionControl } from "./views/mission-control";
import { renderParallelSessions } from "./views/parallel-sessions";
import { renderWork } from "./views/work";
import { renderWorkspaces } from "./views/workspaces";
import { renderSecondBrain } from "./views/second-brain";
import { renderDashboards } from "./views/dashboards";
import {
  renderOnboardingWelcome,
  renderOnboardingIdentity,
  renderOnboardingProgress,
  renderOnboardingSummary,
  type OnboardingPhase as OnbPhase,
} from "./views/onboarding";
import { renderSetup } from "./views/setup";
import { renderOnboardingSetup } from "./views/onboarding-setup";

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
      <div class="dynamic-slot__content">${unsafeHTML(sanitizeHtmlFragment(slotHtml))}</div>
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
  // If the session has a real sessionId, use it — this deduplicates multiple
  // tab entries that point to the exact same session.
  const sessionId = session?.sessionId?.trim();
  if (sessionId) {
    return `session:${sessionId}`;
  }
  // No sessionId — treat each tab key as unique. Without a sessionId we can't
  // know if two tabs refer to the same session, and collapsing by display name
  // causes distinct sessions to merge (the "first tab can't be closed" bug).
  return `key:${key.trim().toLowerCase()}`;
}

/**
 * Check if a session key is an alias for the pinned ally/main session.
 * The pinned ally tab handles the main session, so we hide duplicates
 * like "agent:main:main" or "agent:X:main" from the regular tab bar.
 */
function isMainSessionAlias(key: string): boolean {
  if (key === ALLY_SESSION_KEY) return true;
  const lower = key.toLowerCase();
  // "agent:main:main", "agent:X:main" — anything ending in ":main"
  if (lower === "agent:main:main" || lower.endsWith(":main")) return true;
  return false;
}

function getRenderableSessionTabState(state: AppViewState): {
  tabKeys: string[];
  activeIdentity: string;
} {
  const sessions = state.sessionsResult?.sessions;
  const rawTabKeys = [...new Set(state.settings.openTabs.map((key) => key.trim()).filter(Boolean))]
    .filter((key) => !isMainSessionAlias(key)); // ally-main handled by pinned tab
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
  // Empty is OK — the pinned ally tab always shows the main session.
  // Only add a fallback if the active session is NOT a main alias.
  if (tabKeys.length === 0) {
    const fallback = state.sessionKey.trim() || "main";
    if (!isMainSessionAlias(fallback)) {
      tabKeys.push(fallback);
    }
  }
  return { tabKeys, activeIdentity };
}

export function renderApp(state: AppViewState) {
  // ── Onboarding full-screen takeovers (phases 0, 1, 6) ─────
  // Only show full-screen takeover for legacy ?onboarding=1 flow.
  // New users see the persistent Setup tab in the sidebar instead.
  const obActive = state.onboardingActive && state.onboarding;
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

  // ── Memory Onboarding Wizard (full-screen takeover) ────────
  if (state.wizardActive && state.wizardState) {
    return renderOnboardingWizard(state.wizardState, {
      onStepChange: (step: WizardStep) => {
        state.handleWizardStepChange?.(step);
      },
      onAnswerChange: (key: string, value: unknown) => {
        state.handleWizardAnswerChange?.(key, value);
      },
      onPreview: () => {
        void state.handleWizardPreview?.();
      },
      onGenerate: () => {
        void state.handleWizardGenerate?.();
      },
      onClose: () => {
        state.handleWizardClose?.();
      },
      onFileToggle: (path: string, checked: boolean) => {
        state.handleWizardFileToggle?.(path, checked);
      },
      onConfigToggle: (path: string, checked: boolean) => {
        state.handleWizardConfigToggle?.(path, checked);
      },
    });
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
  // Focus pulse retired in lean audit — variables kept as false for downstream prop compatibility
  const focusPulseActive = false;
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
          ${nothing}
        </div>
        <div class="topbar-status">
          ${
            state.updateStatus?.openclawUpdateAvailable || state.updateStatus?.pluginUpdateAvailable
              ? html`<a
                  class="pill pill--update"
                  href="#"
                  title="${state.updateStatus?.openclawUpdateAvailable ? "OpenClaw update available" : "GodMode plugin update available"} — click to view"
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
          ${
            state.updateStatus?.pendingDeploy
              ? html`<button
                  class="pill pill--restart"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    state.handleGatewayRestartClick();
                  }}
                  title="Restart to apply: ${state.updateStatus.pendingDeploy.summary ?? "pending fix"}"
                >
                  <span class="pill__icon">${icons.rotateCcw}</span>
                  <span>Restart</span>
                </button>`
              : nothing
          }
          <button
            class="pill pill--support"
            @click=${(e: Event) => {
              e.preventDefault();
              state.handleOpenSupportChat();
            }}
            title="Open support chat"
          >
            <span class="pill__icon">${icons.headphones}</span>
            <span>Support</span>
          </button>
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
                ${
                  !group.label && state.godmodeOptions != null && !state.godmodeOptions?.["onboarding.hidden"]
                    ? html`
                        <a
                          class="nav-item ${state.tab === "setup" ? "active" : ""}"
                          href="#"
                          @click=${(e: Event) => {
                            e.preventDefault();
                            state.setTab("setup" as Tab);
                          }}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                          ${state.setupCapabilities && (state.setupCapabilities as { percentComplete?: number }).percentComplete != null
                            ? html`<span class="nav-item__badge">${(state.setupCapabilities as { percentComplete: number }).percentComplete}%</span>`
                            : nothing}
                        </a>
                      `
                    : nothing
                }
                ${group.tabs.map((tab) => renderTab(state, tab))}
              </div>
            </div>
          `;
        })}
        ${POWER_USER_GROUPS.map((group) => {
          const isGroupCollapsed = state.settings.navGroupsCollapsed[group.label] ?? true;
          const hasActiveTab = group.tabs.some((tab) => tab === state.tab);
          return html`
            <div class="nav-group ${isGroupCollapsed && !hasActiveTab ? "nav-group--collapsed" : ""}">
              <button
                class="nav-label"
                @click=${() => {
                  const next = { ...state.settings.navGroupsCollapsed };
                  next[group.label] = !isGroupCollapsed;
                  state.applySettings({ ...state.settings, navGroupsCollapsed: next });
                }}
                aria-expanded=${!isGroupCollapsed}
              >
                <span class="nav-label__text">${group.label}</span>
                <span class="nav-label__chevron">${isGroupCollapsed ? "+" : "\u2212"}</span>
              </button>
              <div class="nav-group__items">
                ${group.tabs.map((tab) => renderTab(state, tab as Tab))}
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
              state.tab !== "setup"
                ? html`
              <div class="page-title">${titleForTab(state.tab)}</div>
              <div class="page-sub">${subtitleForTab(state.tab)}</div>
            `
                : state.tab === "chat"
                  ? html`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${state.sessionKey === ALLY_SESSION_KEY ? 'session-tab--active' : ''}"
                     @click=${() => {
                       if (state.sessionKey === ALLY_SESSION_KEY) return;
                       saveDraft(state);
                       state.sessionKey = ALLY_SESSION_KEY;
                       state.allyUnread = 0;
                       restoreDraft(state, ALLY_SESSION_KEY);
                       state.chatLoading = true;
                       state.chatStream = null;
                       state.chatStreamStartedAt = null;
                       state.chatRunId = null;
                       state.resetToolStream();
                       state.resetChatScroll();
                       state.applySettings({
                         ...state.settings,
                         sessionKey: ALLY_SESSION_KEY,
                         lastActiveSessionKey: ALLY_SESSION_KEY,
                         tabLastViewed: {
                           ...state.settings.tabLastViewed,
                           [ALLY_SESSION_KEY]: Date.now(),
                         },
                       });
                       void state.loadAssistantIdentity();
                       void loadChatHistory(state);
                       void loadSessions(state);
                     }}
                     title="${state.assistantName || 'Ally'}">
                  ${state.assistantAvatar
                    ? html`<img src="${state.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`
                    : html`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${state.assistantName || 'Ally'}
                  ${(state.allyUnread ?? 0) > 0 ? html`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${state.allyUnread}</span>` : nothing}
                </div>
                ${repeat(
                  renderSessionTabKeys,
                  (key) => key,
                  (key, index) => {
                    const session = findSessionByKey(state.sessionsResult?.sessions, key);
                    const isActive =
                      getSessionTabIdentity(key, session) === activeSessionTabIdentity;
                    // Generate a clean display name instead of showing raw session keys
                    const getDisplayName = () => {
                      if (session?.label || session?.displayName) {
                        return collapseRepeatedLabel((session.label ?? session.displayName)!);
                      }
                      // Check auto-title cache (survives sessionsResult overwrites)
                      const cachedTitle = autoTitleCache.get(key);
                      if (cachedTitle) {
                        return collapseRepeatedLabel(cachedTitle);
                      }
                      // Generate clean fallback name from key
                      if (key === "agent:main:support") {
                        return "Support";
                      }
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
                    // Always allow closing — the Ally session is a valid fallback
                    const canClose = true;
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
                            .value=${session?.label ?? session?.displayName ?? ""}
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
                              const currentName = session?.label ?? session?.displayName ?? "";
                              if (newName !== currentName) {
                                // Store manual name in cache so it survives loadSessions race conditions
                                if (newName) {
                                  autoTitleCache.set(key, newName);
                                } else {
                                  autoTitleCache.delete(key);
                                }
                                // Optimistically update local session state for immediate UI feedback
                                if (state.sessionsResult?.sessions) {
                                  state.sessionsResult = {
                                    ...state.sessionsResult,
                                    sessions: state.sessionsResult.sessions.map((s) =>
                                      s.key === key ? { ...s, label: newName || undefined, displayName: newName || undefined } : s,
                                    ),
                                  };
                                }
                                const result = await patchSession(state, key, {
                                  label: newName || null,
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
                                const currentName = session?.label ?? session?.displayName ?? "";
                                if (newName !== currentName) {
                                  // Store manual name in cache so it survives loadSessions race conditions
                                  if (newName) {
                                    autoTitleCache.set(key, newName);
                                  } else {
                                    autoTitleCache.delete(key);
                                  }
                                  // Optimistically update local session state for immediate UI feedback
                                  if (state.sessionsResult?.sessions) {
                                    state.sessionsResult = {
                                      ...state.sessionsResult,
                                      sessions: state.sessionsResult.sessions.map((s) =>
                                        s.key === key ? { ...s, label: newName || undefined, displayName: newName || undefined } : s,
                                      ),
                                    };
                                  }
                                  const result = await patchSession(state, key, {
                                    label: newName || null,
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
                                  // Sync private mode flag with session
                                  state.chatPrivateMode = !!state.privateSessions?.has(key);
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
                          state.privateSessions?.has(key)
                            ? (() => {
                                const expiresAt = state.privateSessions!.get(key)!;
                                const remaining = Math.max(0, expiresAt - Date.now());
                                const hours = Math.floor(remaining / 3_600_000);
                                const mins = Math.floor((remaining % 3_600_000) / 60_000);
                                const countdown = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                                return html`
                                  <span class="session-tab__private" title="Private session — expires in ${countdown}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${countdown}</span
                                  >
                                `;
                              })()
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
                              // Private sessions get fully destroyed on close
                              if (state.privateSessions?.has(key)) {
                                void (state as import("./app").GodModeApp)._destroyPrivateSession(key);
                                return;
                              }
                              const newTabs = state.settings.openTabs.filter((t) => t !== key);
                              const wasActive = key === state.sessionKey;
                              // Fall back to pinned ally tab when no other tabs remain
                              const fallbackKey = newTabs[0] || ALLY_SESSION_KEY;
                              state.applySettings({
                                ...state.settings,
                                openTabs: newTabs,
                                ...(wasActive
                                  ? { sessionKey: fallbackKey, lastActiveSessionKey: fallbackKey }
                                  : {}),
                              });
                              if (wasActive) {
                                state.sessionKey = fallbackKey;
                                syncUrlWithSessionKey(state, fallbackKey, true);
                                void loadChatHistory(state);
                              }
                            }}
                            title=${state.privateSessions?.has(key) ? "Destroy private session" : "Close tab"}
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
            ${(state.tab === "today" || state.tab === "my-day") && !state.dynamicSlots["today"]
              ? renderMyDayToolbar({
                  connected: state.connected,
                  onRefresh: () => state.handleMyDayRefresh(),
                  selectedDate: state.todaySelectedDate,
                  onDatePrev: () => state.handleDatePrev(),
                  onDateNext: () => state.handleDateNext(),
                  onDateToday: () => state.handleDateToday(),
                  viewMode: state.todayViewMode ?? "brief",
                  onViewModeChange: (mode) => state.handleTodayViewModeChange(mode),
                  focusPulseActive: false,
                  inboxItems: state.inboxItems ?? [],
                  inboxCount: state.inboxCount ?? 0,
                  onEveningCapture: () => {
                    state.setTab("chat" as import("./navigation").Tab);
                    void state.handleSendChat("Let's do my evening capture. Walk me through these:\n1. What went well today?\n2. What didn't get done?\n3. What should tomorrow's brief prioritize?\n4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.");
                  },
                })
              : nothing}
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
          state.tab === "setup"
            ? html`
                ${renderSetup({
                  connected: state.connected,
                  quickSetupDone: state.setupQuickDone ?? false,
                  capabilities: (state.setupCapabilities as import("./views/setup").SetupViewProps["capabilities"]) ?? null,
                  capabilitiesLoading: state.setupCapabilitiesLoading ?? false,
                  onQuickSetup: (name) =>
                    state.handleQuickSetup?.(name),
                  onHideSetup: () => state.handleHideSetup?.(),
                  onOpenWizard: () => state.handleWizardOpen?.(),
                  onNavigate: (tab) => state.setTab(tab),
                  onRunAssessment: () => state.handleRunAssessment?.(),
                  onOpenSupportChat: () => state.handleOpenSupportChat(),
                  onCapabilityAction: (id) => state.handleCapabilityAction?.(id),
                })}
                ${state.setupQuickDone
                  ? renderOnboardingSetup({
                      connected: state.connected,
                      integrations: state.onboardingIntegrations ?? null,
                      coreProgress: state.onboardingCoreProgress ?? null,
                      expandedCard: state.onboardingExpandedCard ?? null,
                      loadingGuide: state.onboardingLoadingGuide ?? null,
                      activeGuide: state.onboardingActiveGuide ?? null,
                      testingId: state.onboardingTestingId ?? null,
                      testResult: state.onboardingTestResult ?? null,
                      configValues: state.onboardingConfigValues ?? {},
                      onLoadIntegrations: () => state.handleLoadIntegrations(),
                      onExpandCard: (id: string | null) => state.handleExpandCard(id),
                      onLoadGuide: (id: string) => state.handleLoadGuide(id),
                      onTestIntegration: (id: string) => state.handleTestIntegration(id),
                      onConfigureIntegration: (id: string, values: Record<string, string>) =>
                        state.handleConfigureIntegration(id, values),
                      onUpdateConfigValue: (key: string, value: string) =>
                        state.handleUpdateConfigValue(key, value),
                      onSkipIntegration: (id: string) => state.handleSkipIntegration(id),
                      onNavigate: (tab) => state.setTab(tab),
                      onMarkComplete: () => state.handleMarkOnboardingComplete?.(),
                      onOpenSupportChat: () => state.handleOpenSupportChat(),
                    })
                  : nothing}
              `
            : nothing
        }

        ${
          state.tab === "onboarding"
            ? renderOnboardingSetup({
                connected: state.connected,
                integrations: state.onboardingIntegrations ?? null,
                coreProgress: state.onboardingCoreProgress ?? null,
                expandedCard: state.onboardingExpandedCard ?? null,
                loadingGuide: state.onboardingLoadingGuide ?? null,
                activeGuide: state.onboardingActiveGuide ?? null,
                testingId: state.onboardingTestingId ?? null,
                testResult: state.onboardingTestResult ?? null,
                configValues: state.onboardingConfigValues ?? {},
                onLoadIntegrations: () => state.handleLoadIntegrations(),
                onExpandCard: (id: string | null) => state.handleExpandCard(id),
                onLoadGuide: (id: string) => state.handleLoadGuide(id),
                onTestIntegration: (id: string) => state.handleTestIntegration(id),
                onConfigureIntegration: (id: string, values: Record<string, string>) =>
                  state.handleConfigureIntegration(id, values),
                onUpdateConfigValue: (key: string, value: string) =>
                  state.handleUpdateConfigValue(key, value),
                onSkipIntegration: (id: string) => state.handleSkipIntegration(id),
                onNavigate: (tab) => state.setTab(tab),
                onMarkComplete: () => state.handleMarkOnboardingComplete?.(),
                onOpenSupportChat: () => state.handleOpenSupportChat(),
              })
            : nothing
        }

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
                pluginUpdateRunning: state.pluginUpdateRunning,
                onUpdatePlugin: () => {
                  void runPluginUpdate(state);
                },
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
                onDeleteWorkspace: async (workspace) => {
                  const { deleteWorkspace, loadAllTasksWithQueueStatus } =
                    await import("./controllers/workspaces");
                  const ok = await deleteWorkspace(state, workspace.id);
                  if (!ok) {
                    state.showToast(`Failed to delete ${workspace.name}`, "error");
                    return;
                  }
                  state.showToast(`Deleted workspace: ${workspace.name}`, "success");
                  state.allTasks = await loadAllTasksWithQueueStatus(state);
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
                    state.requestUpdate();
                  });
                },
                onTeamSetup: async () => {
                  let prompt = "I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";
                  try {
                    const res = await state.client?.request<{ prompt?: string }>(
                      "workspaces.teamSetupPrompt",
                      {},
                    );
                    if (res?.prompt) prompt = res.prompt;
                  } catch { /* use default prompt */ }
                  state.handleStartChatWithPrompt(prompt);
                },
                allTasks: state.allTasks ?? [],
                taskFilter: state.taskFilter ?? "outstanding",
                taskSort: state.taskSort ?? "due",
                taskSearch: state.taskSearch ?? "",
                showCompletedTasks: state.showCompletedTasks ?? false,
                onToggleTaskComplete: async (taskId, currentStatus) => {
                  const { toggleTaskComplete, loadAllTasksWithQueueStatus, getWorkspace } =
                    await import("./controllers/workspaces");
                  const result = await toggleTaskComplete(state, taskId, currentStatus);
                  if (!result) {
                    state.showToast("Failed to update task", "error");
                    return;
                  }
                  // Refresh tasks
                  state.allTasks = await loadAllTasksWithQueueStatus(state);
                  if (state.selectedWorkspace) {
                    const refreshed = await getWorkspace(state, state.selectedWorkspace.id);
                    if (refreshed) {
                      state.selectedWorkspace = refreshed;
                    }
                  }
                },
                onCreateTask: async (title, project) => {
                  const { createTask, loadAllTasksWithQueueStatus, getWorkspace } =
                    await import("./controllers/workspaces");
                  const result = await createTask(state, title, project);
                  if (!result) {
                    state.showToast("Failed to create task", "error");
                    return;
                  }
                  state.showToast(`Task created: ${result.title}`, "success");
                  // Refresh tasks
                  state.allTasks = await loadAllTasksWithQueueStatus(state);
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
                onSetTaskSort: (sort) => {
                  state.taskSort = sort;
                },
                onSetTaskSearch: (query) => {
                  state.taskSearch = query;
                },
                onToggleCompletedTasks: () => {
                  state.showCompletedTasks = !(state.showCompletedTasks ?? false);
                },
                editingTaskId: state.editingTaskId ?? null,
                workspaceNames: (state.workspaces ?? []).map((w) => w.name),
                onStartTask: async (taskId) => {
                  const { startTask, loadAllTasksWithQueueStatus } =
                    await import("./controllers/workspaces");
                  const result = await startTask(state, taskId);
                  if (!result?.sessionId) {
                    state.showToast("Failed to open session for task", "error");
                    return;
                  }
                  // Navigate to the session
                  saveDraft(state);
                  const nextKey = result.sessionId;
                  // Set the tab title to the task name
                  if (result.task?.title) {
                    autoTitleCache.set(nextKey, result.task.title);
                  }
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
                  state.sessionKey = nextKey;
                  state.setTab("chat" as Tab);
                  // Find the task for context prompt on new sessions
                  if (result.created && !result.queueOutput) {
                    const allTasks = state.allTasks ?? [];
                    const wsTasks = state.selectedWorkspace?.tasks ?? [];
                    const task = [...allTasks, ...wsTasks].find((t) => t.id === taskId);
                    const projectCtx = task?.project ? ` (project: ${task.project})` : "";
                    state.chatMessage = `Let's work on: ${task?.title ?? "this task"}${projectCtx}`;
                  } else {
                    state.chatMessage = "";
                  }
                  state.chatMessages = [];
                  state.chatStream = null;
                  state.chatStreamStartedAt = null;
                  state.chatRunId = null;
                  state.resetToolStream();
                  state.resetChatScroll();
                  void state.loadAssistantIdentity();
                  syncUrlWithSessionKey(state, nextKey, true);
                  await loadChatHistory(state);
                  // Seed empty sessions with agent output (handles new + pre-existing empty sessions)
                  if (result.queueOutput && state.chatMessages.length === 0) {
                    void state.seedSessionWithAgentOutput(
                      result.task?.title ?? "this task",
                      result.queueOutput,
                      result.agentPrompt ?? undefined,
                    );
                  }
                  // Refresh tasks
                  state.allTasks = await loadAllTasksWithQueueStatus(state);
                  state.requestUpdate();
                },
                onEditTask: (taskId) => {
                  state.editingTaskId = taskId;
                },
                onUpdateTask: async (taskId, updates) => {
                  const { updateTask, loadAllTasksWithQueueStatus, getWorkspace } =
                    await import("./controllers/workspaces");
                  const result = await updateTask(state, taskId, updates);
                  if (!result) {
                    state.showToast("Failed to update task", "error");
                    return;
                  }
                  state.editingTaskId = null;
                  // Refresh tasks
                  state.allTasks = await loadAllTasksWithQueueStatus(state);
                  if (state.selectedWorkspace) {
                    const refreshed = await getWorkspace(state, state.selectedWorkspace.id);
                    if (refreshed) {
                      state.selectedWorkspace = refreshed;
                    }
                  }
                },
                browsePath: state.workspaceBrowsePath ?? null,
                browseEntries: state.workspaceBrowseEntries ?? null,
                breadcrumbs: state.workspaceBreadcrumbs ?? null,
                browseSearchQuery: state.workspaceBrowseSearchQuery ?? "",
                browseSearchResults: state.workspaceBrowseSearchResults ?? null,
                onBrowseFolder: (path: string) => state.handleWorkspaceBrowse(path),
                onBrowseSearch: (query: string) => state.handleWorkspaceBrowseSearch(query),
                onBrowseBack: () => state.handleWorkspaceBrowseBack(),
                onCreateFolder: (path: string) => state.handleWorkspaceCreateFolder(path),
                onBatchPushToDrive: (paths: string[]) => state.handleBatchPushToDrive(paths),
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
                  onBriefGenerate: () => state.handleDailyBriefGenerate(),
                  onBriefOpenInObsidian: () => state.handleDailyBriefOpenInObsidian(),
                  onBriefSave: (content: string) => state.handleBriefSave(content),
                  onBriefToggleCheckbox: (index: number, checked: boolean) => state.handleBriefToggleCheckbox(index, checked),
                  onOpenFile: (path: string) => void state.handleOpenFile(path),
                  // Date navigation props
                  selectedDate: state.todaySelectedDate,
                  onDatePrev: () => state.handleDatePrev(),
                  onDateNext: () => state.handleDateNext(),
                  onDateToday: () => state.handleDateToday(),
                  // View mode toggle
                  viewMode: state.todayViewMode ?? "brief",
                  onViewModeChange: (mode) => state.handleTodayViewModeChange(mode),
                  // Agent log props
                  agentLog: state.agentLog ?? null,
                  agentLogLoading: state.agentLogLoading ?? false,
                  agentLogError: state.agentLogError ?? null,
                  onAgentLogRefresh: () => state.handleMyDayRefresh(),
                  // Focus Pulse / Morning Set
                  focusPulseActive: false,
                  onStartMorningSet: () => state.handleFocusPulseStartMorning(),
                  // Today's tasks
                  todayTasks: state.todayTasks ?? [],
                  todayTasksLoading: state.todayTasksLoading ?? false,
                  onToggleTaskComplete: (taskId: string, currentStatus: string) =>
                    state.handleMyDayTaskStatusChange(
                      taskId,
                      currentStatus === "complete" ? "pending" : "complete",
                    ),
                  onStartTask: (taskId: string) => state.handleTodayStartTask(taskId),
                  onViewTaskOutput: (taskId: string) => state.handleTodayViewTaskOutput(taskId),
                  // Task panel additions
                  onCreateTask: (title: string) => state.handleTodayCreateTask(title),
                  onEditTask: (taskId: string | null) => state.handleTodayEditTask(taskId),
                  onUpdateTask: (taskId: string, updates: { title?: string; dueDate?: string | null }) =>
                    state.handleTodayUpdateTask(taskId, updates),
                  editingTaskId: state.todayEditingTaskId,
                  showCompletedTasks: state.todayShowCompleted,
                  onToggleCompletedTasks: () => state.handleTodayToggleCompleted(),
                  // Decision cards (overnight agent results)
                  decisionCards: (state.todayQueueResults ?? []).length > 0 ? {
                    items: state.todayQueueResults!,
                    onApprove: (id: string) => state.handleDecisionApprove(id),
                    onReject: (id: string) => state.handleDecisionReject(id),
                    onDismiss: (id: string) => state.handleDecisionDismiss(id),
                    onViewOutput: (id: string, path: string) => state.handleDecisionViewOutput(id, path),
                    onOpenChat: (id: string) => state.handleDecisionOpenChat(id),
                    onMarkComplete: (id: string) => state.handleDecisionMarkComplete(id),
                    onRate: (id: string, workflow: string, rating: number) => state.handleDecisionRate(id, workflow, rating),
                    onFeedback: (id: string, workflow: string, feedback: string) => state.handleDecisionFeedback(id, workflow, feedback),
                  } : undefined,
                  // Inbox
                  inboxItems: state.inboxItems ?? [],
                  inboxLoading: state.inboxLoading ?? false,
                  inboxCount: state.inboxCount ?? 0,
                  inboxScoringId: state.inboxScoringId ?? null,
                  inboxScoringValue: state.inboxScoringValue,
                  inboxFeedbackText: state.inboxFeedbackText,
                  onInboxViewOutput: (itemId: string) => void state.handleInboxViewOutput(itemId),
                  onInboxOpenChat: (itemId: string) => state.handleInboxOpenChat(itemId),
                  onInboxDismiss: (itemId: string) => void state.handleInboxDismiss(itemId),
                  onInboxScore: (itemId: string, score: number, feedback?: string) =>
                    void state.handleInboxScore(itemId, score, feedback),
                  onInboxSetScoring: (itemId: string | null, score?: number) =>
                    state.handleInboxSetScoring(itemId, score),
                  onInboxFeedbackChange: (text: string) => state.handleInboxFeedbackChange(text),
                  onInboxMarkAll: () => void state.handleInboxMarkAll(),
                  // Evening capture
                  onEveningCapture: () => {
                    state.setTab("chat" as import("./navigation").Tab);
                    void state.handleSendChat("Let's do my evening capture. Walk me through these:\n1. What went well today?\n2. What didn't get done?\n3. What should tomorrow's brief prioritize?\n4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.");
                  },
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
                  resources: state.workResources ?? [],
                  resourcesLoading: state.workResourcesLoading ?? false,
                  resourceFilter: state.workResourceFilter ?? "all",
                  onResourceFilterChange: (filter) => state.handleResourceFilterChange(filter),
                  onResourceClick: (resource) => state.handleResourceClick(resource),
                  onResourcePin: (id, pinned) => state.handleResourcePin(id, pinned),
                  onResourceDelete: (id) => state.handleResourceDelete(id),
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
                archivedSessions: state.archivedSessions,
                archivedSessionsLoading: state.archivedSessionsLoading,
                archivedSessionsExpanded: state.archivedSessionsExpanded,
                onFiltersChange: (next) => {
                  state.sessionsFilterActive = next.activeMinutes;
                  state.sessionsFilterLimit = next.limit;
                  state.sessionsIncludeGlobal = next.includeGlobal;
                  state.sessionsIncludeUnknown = next.includeUnknown;
                },
                onRefresh: () => {
                  loadSessions(state);
                  loadArchivedSessions(state);
                },
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
                onArchive: (key) => archiveSession(state, key),
                onUnarchive: (key) => unarchiveSession(state, key),
                onToggleArchived: () => {
                  state.archivedSessionsExpanded = !state.archivedSessionsExpanded;
                  if (state.archivedSessionsExpanded && state.archivedSessions.length === 0) {
                    loadArchivedSessions(state);
                  }
                },
                onAutoArchive: () => triggerAutoArchive(state),
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
                subTab: state.skillsSubTab,
                godmodeSkills: state.godmodeSkills ?? null,
                godmodeSkillsLoading: state.godmodeSkillsLoading ?? false,
                expandedSkills: state.expandedSkills ?? new Set(),
                onFilterChange: (next) => (state.skillsFilter = next),
                onRefresh: () => {
                  loadSkills(state, { clearMessages: true });
                  loadGodModeSkills(state);
                },
                onToggle: (key, enabled) => updateSkillEnabled(state, key, enabled),
                onEdit: (key, value) => updateSkillEdit(state, key, value),
                onSaveKey: (key) => saveSkillApiKey(state, key),
                onInstall: (skillKey, name, installId) =>
                  installSkill(state, skillKey, name, installId),
                onSubTabChange: (tab) => {
                  state.skillsSubTab = tab;
                  if (tab === "godmode" && !state.godmodeSkills) {
                    loadGodModeSkills(state);
                  }
                  if (tab === "clawhub" && !state.clawhubExploreItems) {
                    exploreClawHub(state);
                  }
                },
                onToggleExpand: (slug) => {
                  const next = new Set(state.expandedSkills);
                  if (next.has(slug)) {
                    next.delete(slug);
                  } else {
                    next.add(slug);
                  }
                  state.expandedSkills = next;
                },
                clawhub: {
                  loading: state.clawhubLoading,
                  error: state.clawhubError,
                  query: state.clawhubQuery,
                  results: state.clawhubResults,
                  exploreItems: state.clawhubExploreItems,
                  exploreSort: state.clawhubExploreSort,
                  detailSlug: state.clawhubDetailSlug,
                  detail: state.clawhubDetail,
                  importing: state.clawhubImporting,
                  message: state.clawhubMessage,
                  onSearch: (query) => {
                    state.clawhubQuery = query;
                    searchClawHub(state, query);
                  },
                  onExplore: (sort) => exploreClawHub(state, sort),
                  onDetail: (slug) => getClawHubDetail(state, slug),
                  onCloseDetail: () => clearClawHubDetail(state),
                  onImport: (slug) => importFromClawHub(state, slug),
                  onImportAndPersonalize: async (slug) => {
                    const ok = await importFromClawHub(state, slug);
                    if (!ok) return;
                    const prompt = await getPersonalizePrompt(state, slug);
                    if (prompt) {
                      setTab(state, "chat");
                      createNewSession(state);
                      state.chatMessage = prompt;
                    }
                  },
                },
              })
            : nothing
        }

        ${
          state.tab === "agents"
            ? renderAgents({
                loading: state.rosterLoading,
                error: state.rosterError,
                roster: state.rosterData ?? [],
                filter: state.rosterFilter ?? "",
                expandedAgents: state.expandedAgents ?? new Set(),
                onFilterChange: (next) => (state.rosterFilter = next),
                onRefresh: () => loadRoster(state),
                onToggleExpand: (slug) => {
                  const next = new Set(state.expandedAgents);
                  if (next.has(slug)) {
                    next.delete(slug);
                  } else {
                    next.add(slug);
                  }
                  state.expandedAgents = next;
                },
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
                sidebarMode: state.sidebarMode,
                sidebarProofSlug: state.sidebarProofSlug,
                sidebarProofUrl: state.sidebarProofUrl,
                sidebarProofHtml: state.sidebarProofHtml,
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
                onOpenProof: (slug: string) => void state.handleOpenProofDoc(slug),
                onOpenFile: (path: string) => state.handleOpenFile(path),
                onSplitRatioChange: (ratio: number) => state.handleSplitRatioChange(ratio),
                onPushToDrive: (path: string, account?: string) => state.handlePushToDrive(path, account),
                driveAccounts: state.driveAccounts,
                showDrivePicker: state.showDrivePicker,
                driveUploading: state.driveUploading,
                onToggleDrivePicker: () => state.handleToggleDrivePicker(),
                onImageClick: (url: string, allImages: import("./chat/lightbox").LightboxImage[], index: number) =>
                  state.handleImageClick(url, allImages, index),
                resolveImageUrl: (msgIdx: number, imgIdx: number) =>
                  getResolvedImageUrl(state.sessionKey, msgIdx, imgIdx),
                assistantName: state.assistantName,
                assistantAvatar: state.assistantAvatar,
                userName: state.userName,
                userAvatar: state.userAvatar,
                currentToolName: state.currentToolName,
                currentToolInfo: state.currentToolInfo,
                privateMode: state.chatPrivateMode,
                onTogglePrivateMode: () => state.handlePrivateModeToggle(),
                isWorking: state.workingSessions.has(state.sessionKey),
                // Scroll state
                showScrollButton: !state.chatUserNearBottom,
                showNewMessages: state.chatNewMessagesBelow,
                onScrollToBottom: () => {
                  const container = document.querySelector(".chat-thread");
                  if (container) {
                    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
                    state.chatUserNearBottom = true;
                    state.chatNewMessagesBelow = false;
                  }
                },
                // Ally inline panel (split sidebar)
                allyPanelOpen: state.allyPanelOpen ?? false,
                allyProps: state.allyPanelOpen ? {
                  allyName: state.assistantName,
                  allyAvatar: state.assistantAvatar ?? null,
                  open: true,
                  messages: state.allyMessages ?? [],
                  stream: state.allyStream ?? null,
                  draft: state.allyDraft ?? "",
                  sending: state.allySending ?? false,
                  isWorking: state.allyWorking ?? false,
                  unreadCount: 0,
                  connected: state.connected,
                  compact: true,
                  attachments: state.allyAttachments ?? [],
                  onToggle: () => state.handleAllyToggle(),
                  onDraftChange: (text: string) => state.handleAllyDraftChange(text),
                  onSend: () => state.handleAllySend(),
                  onOpenFullChat: () => state.handleAllyOpenFull(),
                  onAttachmentsChange: (attachments) => state.handleAllyAttachmentsChange(attachments),
                  onAction: (action, target, method, params) => state.handleAllyAction(action, target, method, params),
                } : null,
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
                onOpenWizard: state.handleWizardOpen ? () => state.handleWizardOpen?.() : undefined,
              })
            : nothing
        }

        ${
          state.tab === "guardrails"
            ? renderGuardrails({
                connected: state.connected,
                loading: state.guardrailsLoading,
                data: state.guardrailsData,
                showAddForm: state.guardrailsShowAddForm,
                onToggle: (gateId, enabled) => state.handleGuardrailToggle(gateId, enabled),
                onThresholdChange: (gateId, key, value) =>
                  state.handleGuardrailThresholdChange(gateId, key, value),
                onRefresh: () => state.handleGuardrailsLoad(),
                onCustomToggle: (id, enabled) => state.handleCustomGuardrailToggle(id, enabled),
                onCustomDelete: (id) => state.handleCustomGuardrailDelete(id),
                onCustomAdd: (input) => state.handleCustomGuardrailAdd(input),
                onToggleAddForm: () => state.handleToggleGuardrailAddForm(),
                onOpenAllyChat: (prefill?: string) => {
                  state.handleAllyToggle();
                  if (prefill) state.handleAllyDraftChange(prefill);
                },
              })
            : nothing
        }

        ${
          state.tab === "mission-control"
            ? renderMissionControl({
                connected: state.connected,
                loading: state.missionControlLoading,
                error: state.missionControlError,
                data: state.missionControlData ?? null,
                fullControl: state.missionControlFullControl,
                onToggleFullControl: () => state.handleMissionControlToggleFullControl(),
                onRefresh: () => state.handleMissionControlRefresh(),
                onCancelTask: (id) => state.handleMissionControlCancelTask(id),
                onApproveItem: (id) => state.handleMissionControlApproveItem(id),
                onRetryItem: (id) => state.handleMissionControlRetryItem(id),
                onViewDetail: (agent) => state.handleMissionControlViewDetail(agent),
                onAddToQueue: (type, title) => state.handleMissionControlAddToQueue(type, title),
                onOpenSession: (key) => state.handleMissionControlOpenSession(key),
                onOpenTaskSession: (taskId) => state.handleMissionControlOpenTaskSession(taskId),
                onStartQueueItem: (id) => state.handleMissionControlStartQueueItem(id),
                onViewTaskFiles: (id) => state.handleMissionControlViewTaskFiles(id),
                onAskAlly: () => { state.handleAllyToggle(); state.handleAllyDraftChange("What should I focus on next?"); },
                allyName: state.assistantName,
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
                guardrailsData: state.guardrailsData,
                consciousnessStatus: state.consciousnessStatus,
                sessionsCount,
                gatewayUptimeMs: (state.hello?.snapshot as { uptimeMs?: number } | undefined)?.uptimeMs ?? null,
                onDailyRate: (rating: number, note?: string) => state.handleDailyRate(rating, note),
                updateStatus: state.updateStatus ? {
                  openclawUpdateAvailable: state.updateStatus.openclawUpdateAvailable,
                  pluginUpdateAvailable: state.updateStatus.pluginUpdateAvailable,
                  openclawVersion: state.updateStatus.openclawVersion,
                  pluginVersion: state.updateStatus.pluginVersion,
                  openclawLatest: state.updateStatus.openclawLatest,
                  pluginLatest: state.updateStatus.pluginLatest,
                } : null,
              })
            : nothing
        }

        ${
          state.tab === "second-brain"
            ? renderSecondBrain({
                connected: state.connected,
                loading: state.secondBrainLoading ?? false,
                error: state.secondBrainError ?? null,
                subtab: state.secondBrainSubtab ?? "identity",
                identity: state.secondBrainIdentity ?? null,
                memoryBank: state.secondBrainMemoryBank ?? null,
                aiPacket: state.secondBrainAiPacket ?? null,
                sourcesData: state.secondBrainSourcesData ?? null,
                selectedEntry: state.secondBrainSelectedEntry ?? null,
                searchQuery: state.secondBrainSearchQuery ?? "",
                syncing: state.secondBrainSyncing ?? false,
                browsingFolder: state.secondBrainBrowsingFolder ?? null,
                folderEntries: state.secondBrainFolderEntries ?? null,
                folderName: state.secondBrainFolderName ?? null,
                onSubtabChange: (subtab) => state.handleSecondBrainSubtabChange(subtab),
                onSelectEntry: (path) => state.handleSecondBrainSelectEntry(path),
                onOpenInBrowser: (path) => state.handleSecondBrainOpenInBrowser(path),
                onBrowseFolder: (path) => state.handleSecondBrainBrowseFolder(path),
                onBack: () => state.handleSecondBrainBack(),
                onSearch: (query) => state.handleSecondBrainSearch(query),
                onSync: () => state.handleSecondBrainSync(),
                onRefresh: () => state.handleSecondBrainRefresh(),
                onOpenSidebar: (content, opts) => state.handleOpenSidebar(content, opts),
                researchData: state.secondBrainResearchData ?? null,
                researchAddFormOpen: state.secondBrainResearchAddFormOpen ?? false,
                researchAddForm: state.secondBrainResearchAddForm,
                researchCategories: state.secondBrainResearchCategories ?? [],
                onResearchAddFormToggle: () => state.handleResearchAddFormToggle(),
                onResearchAddFormChange: (field: any, value: string) => state.handleResearchAddFormChange(field, value),
                onResearchAddSubmit: () => state.handleResearchAddSubmit(),
                onSaveViaChat: () => state.handleResearchSaveViaChat(),
                communityResources: state.secondBrainCommunityResources ?? null,
                communityResourceAddFormOpen: state.secondBrainCommunityResourceAddFormOpen ?? false,
                communityResourceAddForm: state.secondBrainCommunityResourceAddForm,
                onCommunityResourceAdd: () => state.handleCommunityResourceAdd(),
                onCommunityResourceRemove: (id: string) => state.handleCommunityResourceRemove(id),
                onCommunityResourceAddFormToggle: () => state.handleCommunityResourceAddFormToggle(),
                onCommunityResourceAddFormChange: (field: any, value: string) => state.handleCommunityResourceAddFormChange(field, value),
                onAddSource: () => state.handleAddSource(),
                fileTree: state.secondBrainFileTree ?? null,
                fileTreeLoading: state.secondBrainFileTreeLoading ?? false,
                fileSearchQuery: state.secondBrainFileSearchQuery ?? "",
                fileSearchResults: state.secondBrainFileSearchResults ?? null,
                onFileTreeRefresh: () => state.handleSecondBrainFileTreeRefresh(),
                onFileSearch: (query: string) => state.handleSecondBrainFileSearch(query),
                onFileSelect: (path: string) => state.handleSecondBrainFileSelect(path),
                intelProps: (state.secondBrainSubtab ?? "identity") === "intel" ? {
                  insights: state.intelInsights ?? [],
                  discoveries: state.intelDiscoveries ?? [],
                  patterns: state.intelPatterns ?? null,
                  status: state.intelStatus ?? null,
                  loading: state.intelLoading ?? false,
                  error: state.intelError ?? null,
                  onDismiss: (id: string) => state.handleIntelDismiss(id),
                  onAct: (id: string) => state.handleIntelAct(id),
                  onRefresh: () => state.handleIntelRefresh(),
                } : undefined,
                vaultHealth: state.secondBrainVaultHealth ?? null,
              })
            : nothing
        }

        ${
          state.tab === "dashboards"
            ? state.dynamicSlots["dashboards"]
              ? html`<div class="dynamic-slot">${unsafeHTML(sanitizeHtmlFragment(state.dynamicSlots["dashboards"]))}</div>`
              : renderDashboards({
                  connected: state.connected,
                  loading: state.dashboardsLoading ?? false,
                  error: state.dashboardsError ?? null,
                  dashboards: state.dashboardsList,
                  activeDashboardId: state.activeDashboardId ?? null,
                  activeDashboardHtml: state.activeDashboardHtml ?? null,
                  activeDashboardManifest: state.activeDashboardManifest ?? null,
                  isWorking: state.activeDashboardManifest?.sessionId
                    ? state.workingSessions.has(state.activeDashboardManifest.sessionId)
                    : false,
                  onSelectDashboard: (id) => state.handleDashboardSelect(id),
                  onDeleteDashboard: (id) => state.handleDashboardDelete(id),
                  onCreateViaChat: (prompt?: string) => state.handleDashboardCreateViaChat(prompt),
                  onTogglePin: (id) => state.handleDashboardTogglePin(id),
                  categoryFilter: state.dashboardCategoryFilter ?? null,
                  onCategoryFilter: (cat) => state.handleDashboardCategoryFilter(cat),
                  onBack: () => state.handleDashboardBack(),
                  onRefresh: () => state.handleDashboardsRefresh(),
                  onOpenSession: (id) => state.handleDashboardOpenSession(id),
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
                onModelSwitch: (primary, fallbacks) => switchModel(state, primary, fallbacks),
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
      ${state.tab !== "chat" ? renderAllyChat({
        allyName: state.assistantName,
        allyAvatar: state.assistantAvatar ?? null,
        open: state.allyPanelOpen ?? false,
        messages: state.allyMessages ?? [],
        stream: state.allyStream ?? null,
        draft: state.allyDraft ?? "",
        sending: state.allySending ?? false,
        isWorking: state.allyWorking ?? false,
        unreadCount: state.allyUnread ?? 0,
        connected: state.connected,
        compact: false,
        attachments: state.allyAttachments ?? [],
        onToggle: () => state.handleAllyToggle(),
        onDraftChange: (text: string) => state.handleAllyDraftChange(text),
        onSend: () => state.handleAllySend(),
        onOpenFullChat: () => state.handleAllyOpenFull(),
        onAttachmentsChange: (attachments) => state.handleAllyAttachmentsChange(attachments),
        onAction: (action, target, method, params) => state.handleAllyAction(action, target, method, params),
      }) : nothing}
      ${renderExecApprovalPrompt(state)}
      ${renderGatewayUrlConfirmation(state)}
      ${renderGatewayRestartConfirmation(state)}
      ${
        state.sidebarOpen && state.tab !== "chat"
          ? html`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${() => state.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${state.sidebarMode === "proof" && state.sidebarProofSlug
                  ? renderProofViewer({
                      slug: state.sidebarProofSlug,
                      title: state.sidebarTitle,
                      viewUrl: state.sidebarProofUrl,
                      htmlContent: state.sidebarProofHtml,
                      filePath: state.sidebarFilePath,
                      onClose: () => state.handleCloseProofDoc(),
                      onPushToDrive: (path: string, account?: string) => state.handlePushToDrive(path, account),
                    })
                  : renderMarkdownSidebar({
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
                      onOpenFile: (path: string) => state.handleOpenFile(path),
                      onPushToDrive: (path: string, account?: string) => state.handlePushToDrive(path, account),
                      driveAccounts: state.driveAccounts,
                      showDrivePicker: state.showDrivePicker,
                      driveUploading: state.driveUploading,
                      onToggleDrivePicker: () => state.handleToggleDrivePicker(),
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
      ${renderLightbox(state.lightbox, {
        onClose: () => state.handleLightboxClose(),
        onNav: (delta: number) => state.handleLightboxNav(delta),
      })}
    </div>
  `;
}
