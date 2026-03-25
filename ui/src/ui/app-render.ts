import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { parseAgentSessionKey } from "../lib/session-key-utils.js";
import { sanitizeHtmlFragment } from "./markdown";
import { refreshChatAvatar, saveDraft, restoreDraft } from "./app-chat";
import { findSessionByKey } from "./app-lifecycle";
import { resetChatScroll, scheduleChatScroll } from "./app-scroll";
import { createNewSession, renderChatControls, renderTab, renderThemeToggle, scrollActiveTabIntoView } from "./app-render.helpers";
import { setTab, syncUrlWithSessionKey } from "./app-settings";
import type { AppViewState } from "./app-view-state";
import { appEventBus } from "./context/event-bus.js";
import { loadChannels } from "./controllers/channels";
import { loadChatHistory } from "./controllers/chat";
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
// ClawHub controller removed (v3 slim)
import {
  installSkill,
  loadGodModeSkills,
  loadSkills,
  saveSkillApiKey,
  updateSkillEdit,
  updateSkillEnabled,
} from "./controllers/skills";
import { loadRoster } from "./controllers/agents";
import { icons } from "./icons";
import { TAB_GROUPS, POWER_USER_GROUPS, subtitleForTab, titleForTab, isCustomTab, pathForTab, type Tab } from "./navigation";
import { renderCustomTab } from "./views/custom-tab-renderer.js";
import { fetchCustomTabData } from "./app-gateway.js";
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
import { renderNodes } from "./views/nodes";
import { renderSessions } from "./views/sessions";
import { renderSkills } from "./views/skills";
import { renderAgents } from "./views/agents";
import { renderLightbox } from "./chat/lightbox";
import {
  getResolvedImageUrl,
  triggerImageResolve,
  loadSecrets,
  loadWebFetchConfig,
  setWebFetchProvider,
  loadSearchConfig,
  setSearchProvider,
} from "./app-gateway";
import { renderToasts } from "./views/toast";
import { renderOnboardingWizard, type WizardStep } from "./views/onboarding-wizard";
import { renderTrustTracker } from "./views/trust-tracker";
import { renderOverview } from "./views/overview";
import { renderGuardrails } from "./views/guardrails";
// Tab components are lazy-loaded on first visit (code splitting)
const _tabLoaders: Record<string, () => Promise<unknown>> = {
  "gm-work": () => import("./tabs/work-tab.js"),
  "gm-today": () => import("./tabs/today-tab.js"),
  "gm-team": () => import("./tabs/team-tab.js"),
  "gm-brain": () => import("./tabs/brain-tab.js"),
  "gm-second-brain": () => import("./tabs/second-brain-tab.js"),
  "gm-dashboards": () => import("./tabs/dashboards-tab.js"),
  "gm-connections": () => import("./tabs/connections-tab.js"),
};
const _tabLoaded = new Set<string>();
function ensureTab(tag: string) {
  if (_tabLoaded.has(tag)) return;
  _tabLoaded.add(tag);
  _tabLoaders[tag]?.();
}

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
  const chatFocus = isChat && (state.settings.chatFocusMode || state.onboarding);
  const showThinking = state.onboarding ? false : state.settings.chatShowThinking;
  const assistantAvatarUrl = resolveAssistantAvatarUrl(state);
  const chatAvatarUrl = state.chatAvatarUrl ?? assistantAvatarUrl ?? null;
  const { tabKeys: renderSessionTabKeys, activeIdentity: activeSessionTabIdentity } =
    getRenderableSessionTabState(state);

  return html`
    <div class="shell ${isChat ? "shell--chat" : ""} ${chatFocus ? "shell--chat-focus" : ""} ${state.settings.navCollapsed ? "shell--nav-collapsed" : ""} ${state.onboarding ? "shell--onboarding" : ""} ${window.innerWidth <= 600 ? "shell--nav-drawer" : ""} ${state.navDrawerOpen ? "shell--nav-drawer-open" : ""}">
      <div
        class="nav-drawer-backdrop ${state.navDrawerOpen ? "nav-drawer-backdrop--visible" : ""}"
        @click=${() => state.closeNavDrawer()}
      ></div>
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${() => {
              if (window.innerWidth <= 600) {
                // Mobile: toggle drawer overlay
                state.navDrawerOpen = !state.navDrawerOpen;
              } else {
                // Desktop: toggle sidebar collapse
                state.applySettings({
                  ...state.settings,
                  navCollapsed: !state.settings.navCollapsed,
                });
              }
            }}
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
                    state.setTab("config" as Tab);
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
                  class="pill pill--deploy"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    state.handleDeployPanelToggle();
                  }}
                  title="${state.updateStatus.pendingDeploy.summary ?? "pending fix"}"
                >
                  <span class="pill__icon">${icons.rotateCcw}</span>
                  <span>Deploy Ready</span>
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
      ${state.deployPanelOpen && state.updateStatus?.pendingDeploy
        ? (() => {
            const deploy = state.updateStatus.pendingDeploy;
            const agoMs = Date.now() - deploy.ts;
            const agoMin = Math.floor(agoMs / 60_000);
            const agoText = agoMin < 1 ? "just now" : agoMin < 60 ? `${agoMin}m ago` : `${Math.floor(agoMin / 60)}h ago`;
            return html`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${deploy.summary ?? "Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${agoText}</span>
                    ${deploy.files?.length
                      ? html`<details class="deploy-review-panel__files">
                          <summary>${deploy.files.length} file${deploy.files.length > 1 ? "s" : ""} changed</summary>
                          <ul>${deploy.files.map((f: string) => html`<li>${f}</li>`)}</ul>
                        </details>`
                      : nothing}
                  </div>
                  <div class="deploy-review-panel__actions">
                    <button
                      class="btn btn--sm primary"
                      @click=${() => { state.handleDeployPanelToggle(); state.handleGatewayRestartClick(); }}
                    >Apply (Restart)</button>
                    <button
                      class="btn btn--sm"
                      @click=${() => state.handleDeployDismiss()}
                    >Dismiss</button>
                  </div>
                </div>
              </div>`;
          })()
        : nothing}
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
                ${/* Setup compass link removed — Setup Bar is now the default onboarding entry point */ nothing}
                ${group.tabs.map((tab) => renderTab(state, tab))}
              </div>
            </div>
          `;
        })}
        ${(state.customTabs?.length ?? 0) > 0 ? (() => {
          const customTabs = state.customTabs ?? [];
          const isGroupCollapsed = state.settings.navGroupsCollapsed["Custom"] ?? false;
          const hasActiveTab = customTabs.some((ct) => ct.slug === state.tab);
          return html`
            <div class="nav-group ${isGroupCollapsed && !hasActiveTab ? "nav-group--collapsed" : ""}">
              <button
                class="nav-label"
                @click=${() => {
                  const next = { ...state.settings.navGroupsCollapsed };
                  next["Custom"] = !isGroupCollapsed;
                  state.applySettings({ ...state.settings, navGroupsCollapsed: next });
                }}
                aria-expanded=${!isGroupCollapsed}
              >
                <span class="nav-label__text">Custom</span>
                <span class="nav-label__chevron">${isGroupCollapsed ? "+" : "\u2212"}</span>
              </button>
              <div class="nav-group__items">
                ${customTabs.map((ct) => {
                  const isActive = state.tab === ct.slug;
                  const href = pathForTab(ct.slug as Tab, state.basePath);
                  return html`
                    <a
                      href=${href}
                      class="nav-item ${isActive ? "nav-item--active" : ""}"
                      @click=${(e: Event) => {
                        e.preventDefault();
                        state.setTab(ct.slug as Tab);
                        // Fetch data for this custom tab
                        void fetchCustomTabData(state as any, ct);
                      }}
                    >
                      <span class="nav-item__icon">${icons[ct.icon as keyof typeof icons] ?? icons.folder}</span>
                      <span class="nav-item__label">${ct.title}</span>
                    </a>
                  `;
                })}
              </div>
            </div>
          `;
        })() : nothing}
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
              href="https://docs.lifeongodmode.com"
              target="_blank"
              rel="noreferrer"
              title="GodMode Documentation"
            >
              <span class="nav-item__icon" aria-hidden="true">${icons.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
            <a
              class="nav-item nav-item--external"
              href="https://community.lifeongodmode.com"
              target="_blank"
              rel="noreferrer"
              title="Join the GodMode Community"
            >
              <span class="nav-item__icon" aria-hidden="true">${icons.globe}</span>
              <span class="nav-item__text">Community</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${isChat ? "content--chat" : ""}">
        <section class="content-header">
          <div>
            ${
              state.tab !== "chat" &&
              state.tab !== "onboarding" &&
              state.tab !== "team"
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
                       void loadChatHistory(state).then(() => {
                         state.resetChatScroll();
                         scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
                       });
                       void state.loadSessionResources();
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
                          void loadChatHistory(state).then(() => {
                            // Force scroll to bottom after messages are loaded
                            state.resetChatScroll();
                            scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
                          });
                          void state.loadSessionResources();
                          // Refresh sessions to get accurate context token counts
                          void loadSessions(state);
                          scrollActiveTabIntoView();
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
                                  void loadChatHistory(state).then(() => {
                                    state.resetChatScroll();
                                    scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
                                  });
                                  void state.loadSessionResources();
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
                                state.sessionResources = [];
                                syncUrlWithSessionKey(state, fallbackKey, true);
                                void loadChatHistory(state).then(() => {
                                  state.resetChatScroll();
                                  scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
                                });
                                void state.loadSessionResources();
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
                ? (state.reconnectAttempt ?? 0) > 10
                  ? html`<div class="pill danger gateway-offline">
                      Gateway offline — retrying every 60s (attempt ${state.reconnectAttempt}).
                      Try: <code>oc gateway restart</code>
                    </div>`
                  : html`<div class="pill warning reconnecting">
                      <span class="reconnect-spinner"></span>
                      Reconnecting${state.reconnectAttempt > 1 ? ` (attempt ${state.reconnectAttempt})` : ""}...
                    </div>`
                : state.lastError
                  ? html`<div class="pill ${state.lastError.startsWith("✓") ? "success" : "danger"}">${state.lastError}</div>`
                  : nothing
            }
            ${isChat ? renderChatControls(state) : nothing}
            ${nothing /* Today toolbar is self-contained inside <gm-today> */}
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
          state.tab === "setup" || state.tab === "onboarding"
            ? html`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the Setup Bar in the left navigation to continue setup, or go to Settings to run the full wizard.</p>
                  </div>
                </div>
              </div>`
            : nothing
        }

        ${
          state.tab === "workspaces"
            ? (ensureTab("gm-work"), html`<gm-work></gm-work>`)
            : nothing
        }

        ${
          state.tab === "team"
            ? (ensureTab("gm-team"), html`<gm-team .host=${state}></gm-team>`)
            : nothing
        }

        ${
          state.tab === "today" || state.tab === "my-day"
            ? (ensureTab("gm-today"), html`<gm-today
                @today-open-file=${(e: CustomEvent<{ path: string }>) => {
                  void state.handleOpenFile(e.detail.path);
                }}
                @today-decision-open-chat=${(e: CustomEvent<{ id: string; item?: unknown }>) => {
                  const item = e.detail.item as { title?: string; id?: string } | undefined;
                  state.setTab("chat");
                  const title = item?.title ?? e.detail.id;
                  state.setChatMessage(`Let's discuss the agent result for: "${title}". What are your thoughts on the output?`);
                }}
                @today-inbox-open-chat=${(e: CustomEvent<{ itemId: string; item?: unknown }>) => {
                  const item = e.detail.item as { title?: string; sessionId?: string; coworkSessionId?: string } | undefined;
                  // If the item has a cowork session, navigate to it
                  if (item?.coworkSessionId) {
                    appEventBus.emit("chat-navigate", { sessionKey: `agent:prosper:${item.coworkSessionId}`, tab: "chat" });
                  } else if (item?.sessionId) {
                    appEventBus.emit("chat-navigate", { sessionKey: item.sessionId, tab: "chat" });
                  } else {
                    // Fall back to main chat with a message about the inbox item
                    state.setTab("chat");
                    const title = item?.title ?? e.detail.itemId;
                    state.setChatMessage(`Let's review the inbox item: "${title}". Can you summarize the key points and what actions I should take?`);
                  }
                }}
                @today-open-proof=${(e: CustomEvent<{ slug: string }>) => {
                  void state.handleOpenProofDoc(e.detail.slug);
                }}
              ></gm-today>`)
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
          state.tab === "chat" && state.workspaceNeedsSetup && !state.chatMessages?.length
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
          state.tab === "chat"
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
                  void loadChatHistory(state).then(() => {
                    state.resetChatScroll();
                    scheduleChatScroll(state as unknown as Parameters<typeof scheduleChatScroll>[0], true);
                  });
                  void refreshChatAvatar(state);
                  void state.loadSessionResources();
                  triggerImageResolve(state as unknown as import("./app").GodModeApp);
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
                  void state.loadSessionResources();
                  triggerImageResolve(state as unknown as import("./app").GodModeApp);
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
                onQueueRemove: (id) => state.removeQueuedMessage(id),
                onNewSession: () => state.handleSendChat("/new", { restoreDraft: true }),
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
                currentModel: state.currentModel,
                availableModels: state.availableModels,
                modelPickerOpen: state.modelPickerOpen,
                onToggleModelPicker: () => {
                  const opening = !state.modelPickerOpen;
                  state.modelPickerOpen = opening;
                  if (opening) {
                    setTimeout(() => {
                      const close = () => { state.modelPickerOpen = false; document.removeEventListener("click", close, true); };
                      document.addEventListener("click", close, true);
                    }, 0);
                  }
                },
                onSwitchModel: (modelId: string) => {
                  void (async () => {
                    const { switchModelFromChat } = await import("./app-gateway.js");
                    await switchModelFromChat(state as unknown as Parameters<typeof switchModelFromChat>[0], modelId);
                  })();
                },
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
                onClearNewMessages: () => {
                  state.chatNewMessagesBelow = false;
                  state.chatUserNearBottom = true;
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
                  onHitlAction: (checkpointId, action, modifiedInstructions) => state.handleHitlAction(checkpointId, action, modifiedInstructions),
                } : null,
                // Session resources strip (Manus-style)
                sessionResources: state.sessionResources,
                sessionResourcesCollapsed: state.sessionResourcesCollapsed,
                onToggleSessionResources: () => state.handleToggleSessionResources(),
                onSessionResourceClick: (r: { path?: string; url?: string }) => state.handleSessionResourceClick(r),
                onViewAllResources: () => state.handleViewAllResources(),
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
          state.tab === "overview"
            ? renderOverview({
                connected: state.connected,
                updateStatus: state.updateStatus,
                updateLoading: state.updateLoading,
                onCheckUpdates: () => void import("./controllers/updates.js").then((m) => m.checkForUpdates(state as any)),
                onUpdateOpenclaw: () => runUpdate(state as any),
                onUpdatePlugin: () => runPluginUpdate(state as any),
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
          state.tab === "brain" || state.tab === "second-brain"
            ? (ensureTab("gm-brain"), html`<gm-brain></gm-brain>`)
            : nothing
        }

        ${
          state.tab === "dashboards"
            ? (ensureTab("gm-dashboards"), html`<gm-dashboards></gm-dashboards>`)
            : nothing
        }

        ${
          isCustomTab(state.tab)
            ? (() => {
                const ct = (state.customTabs ?? []).find((t) => t.slug === state.tab);
                if (!ct) return html`<div class="tab-view"><p>Custom tab not found.</p></div>`;
                return renderCustomTab({
                  manifest: ct,
                  data: state.customTabData ?? {},
                  loading: state.customTabLoading ?? false,
                  errors: state.customTabErrors ?? {},
                });
              })()
            : nothing
        }

        ${
          state.tab === "connections"
            ? (ensureTab("gm-connections"), html`<gm-connections></gm-connections>`)
            : nothing
        }

        ${
          state.tab === "config"
            ? html`${renderConfig({
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
                secrets: state.secrets ?? [],
                secretsLoading: state.secretsLoading ?? false,
                onSecretsRefresh: () => loadSecrets(state),
                webFetchProvider: state.webFetchProvider ?? "default",
                webFetchLoading: state.webFetchLoading ?? false,
                onWebFetchChange: (provider) => setWebFetchProvider(state, provider),
                searchProvider: state.searchProvider ?? "tavily",
                searchExaConfigured: state.searchExaConfigured ?? false,
                searchTavilyConfigured: state.searchTavilyConfigured ?? false,
                searchLoading: state.searchLoading ?? false,
                onSearchProviderChange: (provider) => setSearchProvider(state, provider),
              })}
              <div style="margin-top: 24px; padding: 16px; border-top: 1px solid var(--border, #333);">
                <button
                  class="btn btn--secondary"
                  style="font-size: 13px; opacity: 0.8;"
                  @click=${() => state.handleWizardOpen?.()}
                >
                  Run Setup Wizard
                </button>
                <span style="margin-left: 8px; font-size: 12px; opacity: 0.5;">Full 8-step onboarding form</span>
              </div>
            `
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
        onHitlAction: (checkpointId, action, modifiedInstructions) => state.handleHitlAction(checkpointId, action, modifiedInstructions),
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
