import { GodModeApp } from "./app";
import { flushChatQueueForEvent } from "./app-chat";
import type { EventLogEntry } from "./app-events";
import { applySettings, loadCron, refreshActiveTab, setLastActiveSessionKey } from "./app-settings";
import {
  handleAgentEvent,
  resetToolStream,
  type AgentEventPayload,
  type CompactionStatus,
} from "./app-tool-stream";
import { extractImages, type ImageBlock } from "./chat/grouped-render";
import { extractText as extractTextFromMessage } from "./chat/message-extract";
import { ALLY_SESSION_KEY } from "./controllers/ally";
import { loadAgents } from "./controllers/agents";
import { loadAssistantIdentity } from "./controllers/assistant-identity";
import { loadChatHistory, loadChatHistoryAfterFinal, getPendingImageCache } from "./controllers/chat";
import { handleChatEvent, type ChatEventPayload } from "./controllers/chat";
import { loadDevices } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import {
  addExecApproval,
  parseExecApprovalRequested,
  parseExecApprovalResolved,
  removeExecApproval,
} from "./controllers/exec-approval";
import { loadNodes } from "./controllers/nodes";
import { autoTitleCache, loadSessions } from "./controllers/sessions";
import { startUpdatePolling, stopUpdatePolling, checkPostUpdateStatus } from "./controllers/updates";
import type { GatewayEventFrame, GatewayHelloOk } from "./gateway";
import { GatewayBrowserClient } from "./gateway";
import { initHostCompat } from "../lib/host-compat.js";
import type { Tab } from "./navigation";
import type { UiSettings } from "./storage";
import type {
  AgentsListResult,
  PresenceEntry,
  HealthSnapshot,
  StatusSummary,
  SessionsListResult,
} from "./types";

// ── Image cache helpers ──────────────────────────────────────────────

/** In-memory cache of resolved image URLs: "sessionKey:msgIdx:imgIdx" → dataUrl */
const resolvedImageUrls = new Map<string, string>();
let lastResolvedSessionKey: string | null = null;
let resolving = false;

export function getResolvedImageUrl(
  sessionKey: string,
  msgIdx: number,
  imgIdx: number,
): string | null {
  return resolvedImageUrls.get(`${sessionKey}:${msgIdx}:${imgIdx}`) ?? null;
}

/**
 * Cache images that have data (from current session) and resolve omitted images
 * from the server-side cache. Triggers a re-render when omitted images are resolved.
 */
async function cacheAndResolveImages(app: GodModeApp): Promise<void> {
  if (!app.client || !app.chatMessages?.length) return;
  const sessionKey = app.sessionKey;

  // Phase 1: Cache any images that currently have data URLs (before they get stripped)
  const imagesToCache: Array<{
    data: string;
    mimeType: string;
    messageIndex: number;
    imageIndex: number;
    role: string;
    timestamp?: number;
  }> = [];

  for (let i = 0; i < app.chatMessages.length; i++) {
    const msg = app.chatMessages[i] as Record<string, unknown>;
    const images = extractImages(msg);
    for (let j = 0; j < images.length; j++) {
      if (images[j].url && !images[j].omitted) {
        const match = /^data:([^;]+);base64,(.+)$/.exec(images[j].url!);
        if (match) {
          imagesToCache.push({
            data: match[2],
            mimeType: match[1],
            messageIndex: i,
            imageIndex: j,
            role: (msg.role as string) || "unknown",
            timestamp: typeof msg.timestamp === "number" ? msg.timestamp : undefined,
          });
        }
      }
    }
  }

  if (imagesToCache.length > 0) {
    try {
      const result = await app.client.request<{
        cached?: Array<{ hash: string; mimeType: string; bytes: number }>;
      }>("images.cache", {
        images: imagesToCache.map((i) => ({ data: i.data, mimeType: i.mimeType })),
        sessionKey,
      });
      if (result?.cached) {
        const indexEntries = imagesToCache
          .map((img, idx) => ({
            messageIndex: img.messageIndex,
            imageIndex: img.imageIndex,
            hash: result.cached![idx]?.hash,
            mimeType: img.mimeType,
            bytes: result.cached![idx]?.bytes ?? 0,
            role: img.role,
            timestamp: img.timestamp,
          }))
          .filter((e): e is typeof e & { hash: string } => Boolean(e.hash));

        if (indexEntries.length > 0) {
          await app.client.request("images.updateIndex", {
            sessionKey,
            images: indexEntries,
          });
        }
      }
    } catch {
      // Best effort
    }
  }

  // Phase 2: Resolve omitted images from the server-side cache.
  // Wait for any in-flight cache+index writes from sendChatMessage so the
  // session index is up-to-date before we try to resolve.
  if (resolving) return;
  resolving = true;
  try {
    const pending = getPendingImageCache();
    if (pending) {
      await pending.catch(() => {});
    }

    const doResolve = async () => {
      const result = await app.client!.request<{
        images?: Record<string, string>;
      }>("images.resolve", { sessionKey });
      if (result?.images && Object.keys(result.images).length > 0) {
        // Clear old session's resolved URLs
        if (lastResolvedSessionKey !== sessionKey) {
          resolvedImageUrls.clear();
        }
        for (const [key, dataUrl] of Object.entries(result.images)) {
          resolvedImageUrls.set(`${sessionKey}:${key}`, dataUrl);
        }
        lastResolvedSessionKey = sessionKey;
        // Trigger re-render — reassigning chatMessages causes LitElement to update
        app.chatMessages = [...app.chatMessages];
        return true;
      }
      return false;
    };

    const resolved = await doResolve();

    // If nothing was resolved but there are omitted images, retry with
    // increasing delays — the session index write may still be in flight.
    if (!resolved && app.chatMessages?.some((m) => {
      const imgs = extractImages(m);
      return imgs.some((img) => img.omitted || !img.url);
    })) {
      for (const delay of [500, 1500, 3000]) {
        await new Promise((r) => setTimeout(r, delay));
        if (await doResolve()) break;
        // Bail if session changed during retries
        if (app.sessionKey !== sessionKey) break;
      }
    }
  } catch {
    // Cache miss is fine
  } finally {
    resolving = false;
  }
}

// ── Proof auto-open helper ────────────────────────────────────────────

/** Track last auto-opened slug to avoid reopening on every history reload */
let _lastAutoOpenedProofSlug: string | null = null;

/**
 * Scan the most recent messages for a _sidebarAction with type "proof"
 * and auto-open the Proof doc in the sidebar.
 */
function autoOpenProofFromMessages(app: GodModeApp): void {
  if (!app.chatMessages?.length) return;
  // Only scan the last 5 messages (tool results from the most recent turn)
  const recent = app.chatMessages.slice(-5);
  for (const msg of recent) {
    const m = msg as Record<string, unknown>;
    const content = Array.isArray(m.content) ? m.content : [];
    for (const block of content) {
      const b = block as Record<string, unknown>;
      const text = typeof b.text === "string" ? b.text : typeof b.content === "string" ? b.content : null;
      if (!text) continue;
      try {
        const parsed = JSON.parse(text) as { _sidebarAction?: { type?: string; slug?: string } };
        if (parsed._sidebarAction?.type === "proof" && parsed._sidebarAction.slug) {
          const slug = parsed._sidebarAction.slug;
          if (slug === _lastAutoOpenedProofSlug) return; // Already opened this one
          _lastAutoOpenedProofSlug = slug;
          void app.handleOpenProofDoc(slug);
          return;
        }
      } catch {
        // Not JSON — skip
      }
    }
  }
}

/**
 * Trigger image resolution for the current session.
 * Called after history loads to resolve omitted images from cache.
 */
export function triggerImageResolve(app: GodModeApp): void {
  void cacheAndResolveImages(app);
}

// Non-reactive ring buffer for event log — only flushed to reactive state when debug tab is open
const eventLogRing: EventLogEntry[] = [];

/** Snapshot the current event log ring buffer (for use when switching to debug tab). */
export function getEventLogSnapshot(): EventLogEntry[] {
  return [...eventLogRing];
}

type GatewayHost = {
  settings: UiSettings;
  password: string;
  client: GatewayBrowserClient | null;
  connected: boolean;
  hello: GatewayHelloOk | null;
  lastError: string | null;
  reconnecting?: boolean;
  reconnectAttempt?: number;
  onboarding?: boolean;
  eventLog: EventLogEntry[];
  tab: Tab;
  presenceEntries: PresenceEntry[];
  presenceError: string | null;
  presenceStatus: StatusSummary | null;
  agentsLoading: boolean;
  agentsList: AgentsListResult | null;
  agentsError: string | null;
  debugHealth: HealthSnapshot | null;
  sessionsResult: SessionsListResult | null;
  assistantName: string;
  assistantAvatar: string | null;
  assistantAgentId: string | null;
  sessionKey: string;
  chatRunId: string | null;
  workingSessions: Set<string>;
  refreshSessionsAfterChat: boolean;
  execApprovalQueue: ExecApprovalRequest[];
  execApprovalError: string | null;
  compactionStatus?: CompactionStatus | null;
  dynamicSlots: Record<string, string>;
};

// Reconnection state (module-level to persist across calls)
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY = 1000; // 1 second

// Debounced working session clearing - prevents indicator flicker during multi-tool turns
const workingSessionClearTimers = new Map<string, ReturnType<typeof setTimeout>>();
const _WORKING_INDICATOR_DEBOUNCE_MS = 800; // Keep indicator on for 800ms after "final"

type SessionDefaultsSnapshot = {
  defaultAgentId?: string;
  mainKey?: string;
  mainSessionKey?: string;
  scope?: string;
};

function normalizeSessionKeyForDefaults(
  value: string | undefined,
  defaults: SessionDefaultsSnapshot,
): string {
  const raw = (value ?? "").trim();
  const mainSessionKey = defaults.mainSessionKey?.trim();
  if (!mainSessionKey) {
    return raw;
  }
  if (!raw) {
    return mainSessionKey;
  }
  const mainKey = defaults.mainKey?.trim() || "main";
  const defaultAgentId = defaults.defaultAgentId?.trim();
  const isAlias =
    raw === "main" ||
    raw === mainKey ||
    (defaultAgentId &&
      (raw === `agent:${defaultAgentId}:main` || raw === `agent:${defaultAgentId}:${mainKey}`));
  return isAlias ? mainSessionKey : raw;
}

function applySessionDefaults(host: GatewayHost, defaults?: SessionDefaultsSnapshot) {
  if (!defaults?.mainSessionKey) {
    return;
  }
  // IMPORTANT: Don't normalize "main" to a per-connection webchat session.
  // The pinned ally tab uses "main" which the gateway resolves server-side
  // to the shared main session (same as iMessage, same as all channels).
  // Normalizing it to "agent:main:webchat-XXX" breaks cross-channel continuity.
  const ALLY_KEY = "main";
  const skipNormalize = (v: string | undefined) =>
    (v ?? "").trim() === ALLY_KEY || (v ?? "").trim() === "";
  const resolvedSessionKey = skipNormalize(host.sessionKey)
    ? host.sessionKey
    : normalizeSessionKeyForDefaults(host.sessionKey, defaults);
  const resolvedSettingsSessionKey = skipNormalize(host.settings.sessionKey)
    ? host.settings.sessionKey
    : normalizeSessionKeyForDefaults(host.settings.sessionKey, defaults);
  const resolvedLastActiveSessionKey = skipNormalize(host.settings.lastActiveSessionKey)
    ? host.settings.lastActiveSessionKey
    : normalizeSessionKeyForDefaults(host.settings.lastActiveSessionKey, defaults);
  const nextSessionKey = resolvedSessionKey || resolvedSettingsSessionKey || host.sessionKey;
  const nextSettings = {
    ...host.settings,
    sessionKey: resolvedSettingsSessionKey || nextSessionKey,
    lastActiveSessionKey: resolvedLastActiveSessionKey || nextSessionKey,
  };
  const shouldUpdateSettings =
    nextSettings.sessionKey !== host.settings.sessionKey ||
    nextSettings.lastActiveSessionKey !== host.settings.lastActiveSessionKey;
  if (nextSessionKey !== host.sessionKey) {
    host.sessionKey = nextSessionKey;
  }
  if (shouldUpdateSettings) {
    applySettings(host as unknown as Parameters<typeof applySettings>[0], nextSettings);
  }
}

function scheduleReconnect(host: GatewayHost) {
  // Clear any existing reconnect timer
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  // Initialize or increment attempt counter
  const attempt = (host.reconnectAttempt ?? 0) + 1;
  if (attempt > MAX_RECONNECT_ATTEMPTS) {
    host.lastError = "Connection lost. Please refresh the page.";
    host.reconnecting = false;
    return;
  }

  host.reconnectAttempt = attempt;
  host.reconnecting = true;

  // Exponential backoff: 1s, 2s, 4s, 8s, ... capped at 30s
  const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempt - 1), 30000);

  // Debug logging disabled in production
  // console.log(`[gateway] Reconnecting in ${delay}ms (attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS})`);

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!host.connected) {
      connectGateway(host);
    }
  }, delay);
}

/**
 * Check if the workspace needs dynamic onboarding (no projects configured yet).
 * Sets workspaceNeedsSetup flag so the UI can show a welcome prompt.
 */
async function checkWorkspaceSetup(host: GatewayHost) {
  if (!host.client) {
    return;
  }
  const app = host as unknown as { workspaceNeedsSetup?: boolean; setupQuickDone?: boolean };
  try {
    // If the user already completed quick setup, never show the banner
    if (app.setupQuickDone) {
      app.workspaceNeedsSetup = false;
      return;
    }
    // Also check onboarding state directly — setupQuickDone may not be set yet
    try {
      const ob = await host.client.request<{ identity?: { name?: string } }>("onboarding.status", {});
      if (ob?.identity?.name) {
        app.workspaceNeedsSetup = false;
        return;
      }
    } catch { /* onboarding methods may not exist */ }

    const res = await host.client.request("projects.list", {});
    app.workspaceNeedsSetup = !res?.projects || res.projects.length === 0;
  } catch {
    // Not critical — don't block on this
  }
}

/**
 * Load onboarding status and activate the onboarding experience if incomplete.
 * Existing users (who already have projects set up) skip onboarding entirely.
 */
async function checkOnboardingStatus(host: GatewayHost) {
  if (!host.client) {
    return;
  }

  // If workspace already has projects, this is an existing user — skip onboarding
  const appHost = host as unknown as { workspaceNeedsSetup?: boolean };
  if (appHost.workspaceNeedsSetup === false) {
    // Existing user with projects — auto-complete onboarding silently
    try {
      const res = await host.client.request("onboarding.status", {});
      if (res && !res.completedAt) {
        await host.client.request("onboarding.complete", { summary: null });
      }
    } catch {}
    return;
  }

  try {
    const res = await host.client.request("onboarding.status", {});
    const app = host as unknown as {
      onboardingActive?: boolean;
      onboardingPhase?: number;
      onboardingData?: unknown;
    };
    // If onboarding is not yet completed, activate the onboarding experience
    if (res && !res.completedAt) {
      app.onboardingActive = true;
      app.onboardingPhase = res.phase ?? 0;
      app.onboardingData = res;
      // Show setup tab in sidebar for the new 80/20 flow
      const setupApp = host as unknown as {
        showSetupTab?: boolean;
        setupQuickDone?: boolean;
      };
      setupApp.showSetupTab = true;
      // If identity already exists, quick setup is already done
      if (res.identity?.name) {
        setupApp.setupQuickDone = true;
        // Restore display name from server if not already set in UI
        // Check settings.userName (persisted) — userName state may hold the default "You"
        const nameHost = host as unknown as { userName: string; settings: UiSettings; applySettings: (s: UiSettings) => void };
        if (!nameHost.settings.userName) {
          nameHost.userName = res.identity.name;
          nameHost.applySettings({ ...nameHost.settings, userName: res.identity.name });
        }
      }
    } else {
      app.onboardingActive = false;
      app.onboardingData = res ?? null;
      // Onboarding already completed — still restore display name if not set
      if (res?.identity?.name) {
        const nameHost = host as unknown as { userName: string; settings: UiSettings; applySettings: (s: UiSettings) => void };
        if (!nameHost.settings.userName) {
          nameHost.userName = res.identity.name;
          nameHost.applySettings({ ...nameHost.settings, userName: res.identity.name });
        }
      }
    }
  } catch {
    // Onboarding status not available — skip (probably standalone without the method)
  }
}

/**
 * Update a session's updatedAt timestamp locally without re-fetching all sessions.
 * This prevents the displayName revert issue while keeping tab indicators accurate.
 */
function updateSessionTimestamp(host: GatewayHost, sessionKey: string) {
  if (!host.sessionsResult?.sessions) {
    return;
  }

  const sessions = host.sessionsResult.sessions.map((s) =>
    s.key === sessionKey ? { ...s, updatedAt: Date.now() } : s,
  );

  host.sessionsResult = {
    ...host.sessionsResult,
    sessions,
  };
}

// Track sessions that already had auto-title SUCCESSFULLY applied to avoid repeated calls.
// Failed attempts are NOT tracked — they can retry on the next response.
const autoTitleApplied = new Set<string>();

/** Clear auto-title state on reconnect so untitled sessions get another chance. */
export function resetAutoTitleState() {
  autoTitleApplied.clear();
}

// Client-side title derivation removed — server-side Haiku LLM handles all titling.
// See maybeAutoTitleSession() below for explanation.

// Dead code removed: extractTitleFromAssistant, extractTopicTitle, stripSystemContent,
// scoreTitleFromText, SYSTEM_FINGERPRINTS — all were part of client-side title derivation
// that raced with server-side LLM titling.

/**
 * Auto-title an unnamed session after the first response.
 *
 * IMPORTANT: The client does NOT derive titles locally — all title generation
 * is handled server-side via Haiku LLM in message_sending hook. The server
 * broadcasts "sessions:updated" when the title is ready, and the UI handler
 * (below) picks it up. Client-side string derivation was removed because it
 * raced with the server, writing garbage truncated titles to the session store
 * before the LLM title could arrive.
 */
async function maybeAutoTitleSession(host: GatewayHost, sessionKey: string) {
  // No-op — server-side auto-title handles everything via sessions:updated broadcast.
  // Kept as a function to avoid breaking the call site at response "final" state.
  void host;
  void sessionKey;
}

export function connectGateway(host: GatewayHost) {
  host.lastError = null;
  host.hello = null;
  host.connected = false;
  host.execApprovalQueue = [];
  host.execApprovalError = null;

  // Reset auto-title state so untitled sessions get another chance after reconnect
  resetAutoTitleState();

  // Reset all loading states to ensure fresh start on new connection
  // This prevents stuck loading spinners after reconnects
  const loadingHost = host as unknown as {
    sessionsLoading?: boolean;
    agentsLoading?: boolean;
    nodesLoading?: boolean;
    devicesLoading?: boolean;
    channelsLoading?: boolean;
    configLoading?: boolean;
    presenceLoading?: boolean;
    cronLoading?: boolean;
    skillsLoading?: boolean;
    debugLoading?: boolean;
    logsLoading?: boolean;
  };
  if ("sessionsLoading" in loadingHost) {
    loadingHost.sessionsLoading = false;
  }
  if ("agentsLoading" in loadingHost) {
    loadingHost.agentsLoading = false;
  }
  if ("nodesLoading" in loadingHost) {
    loadingHost.nodesLoading = false;
  }
  if ("devicesLoading" in loadingHost) {
    loadingHost.devicesLoading = false;
  }
  if ("channelsLoading" in loadingHost) {
    loadingHost.channelsLoading = false;
  }
  if ("configLoading" in loadingHost) {
    loadingHost.configLoading = false;
  }
  if ("presenceLoading" in loadingHost) {
    loadingHost.presenceLoading = false;
  }
  if ("cronLoading" in loadingHost) {
    loadingHost.cronLoading = false;
  }
  if ("skillsLoading" in loadingHost) {
    loadingHost.skillsLoading = false;
  }
  if ("debugLoading" in loadingHost) {
    loadingHost.debugLoading = false;
  }
  if ("logsLoading" in loadingHost) {
    loadingHost.logsLoading = false;
  }
  // Clear reconnect timer if connecting manually
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  host.client?.stop();
  host.client = new GatewayBrowserClient({
    url: host.settings.gatewayUrl,
    token: host.settings.token.trim() ? host.settings.token : undefined,
    password: host.password.trim() ? host.password : undefined,
    clientName: "openclaw-control-ui",
    mode: "webchat",
    onHello: (hello) => {
      const wasReconnecting = host.reconnecting;
      host.connected = true;
      host.lastError = null;
      host.hello = hello;
      host.reconnecting = false;
      host.reconnectAttempt = 0;

      // Show toast notification if we were reconnecting
      if (wasReconnecting) {
        const app = host as unknown as GodModeApp;
        if (typeof app.showToast === "function") {
          app.showToast("Gateway reconnected", "success", 4000);
        }
        // Also show brief inline message for backward compatibility
        host.lastError = "✓ Reconnected";
        setTimeout(() => {
          if (host.lastError === "✓ Reconnected") {
            host.lastError = null;
          }
        }, 3000);

        // Clear potentially stale chat streaming state from before disconnect
        // This prevents the "..." indicator from hanging indefinitely if the
        // final event was lost during the disconnect
        host.chatRunId = null;
        const fullApp = host as unknown as {
          chatStream?: string | null;
          chatStreamStartedAt?: number | null;
        };
        if ("chatStream" in fullApp) {
          fullApp.chatStream = null;
        }
        if ("chatStreamStartedAt" in fullApp) {
          fullApp.chatStreamStartedAt = null;
        }

        // Auto-advance Today date if stale (e.g. app left open overnight)
        const dateHost = host as unknown as { todaySelectedDate?: string };
        if (dateHost.todaySelectedDate) {
          const d = new Date();
          const now = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          if (dateHost.todaySelectedDate !== now) {
            dateHost.todaySelectedDate = now;
          }
        }

        // Clear working session indicators
        host.workingSessions.clear();
        (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();

        // Clear any pending debounce timers
        for (const timer of workingSessionClearTimers.values()) {
          clearTimeout(timer);
        }
        workingSessionClearTimers.clear();
      }

      // Set browser tab title to distinguish OC vs Hermes instances
      const feat = hello.features as Record<string, unknown> | undefined;
      document.title = feat?.hermes ? "Hermes - GodMode" : "OC - GodMode";

      // Initialize host compatibility layer — probes capabilities in background
      initHostCompat(hello as unknown as Record<string, unknown>, host.client);

      applySnapshot(host, hello);
      void loadAssistantIdentity(host as unknown as GodModeApp);
      void loadAgents(host as unknown as GodModeApp);
      void loadNodes(host as unknown as GodModeApp, { quiet: true });
      void loadDevices(host as unknown as GodModeApp, { quiet: true });
      // Preload sessions so session picker is ready immediately
      void loadSessions(host as unknown as GodModeApp);
      void refreshActiveTab(host as unknown as Parameters<typeof refreshActiveTab>[0]);
      // Check workspace setup first, then onboarding (onboarding depends on workspace state)
      void checkWorkspaceSetup(host).then(() => checkOnboardingStatus(host));
      // Load Focus Pulse state and GodMode options
      void loadFocusPulseOnConnect(host);
      void loadOptionsOnConnect(host);
      // Start background update check heartbeat (every 30 min)
      startUpdatePolling(host as unknown as GodModeApp);
      // Check for post-update audit results (shows toast if update just completed)
      void checkPostUpdateStatus(host as unknown as GodModeApp);
      // Handle ?openTask= URL parameter for task → session deep linking
      handleOpenTaskParam(host as unknown as GodModeApp);
    },
    onClose: ({ code, reason }) => {
      host.connected = false;
      stopUpdatePolling(host as unknown as GodModeApp);

      // Clear chat sending state to prevent hanging "Sending files..." animation
      const chatHost = host as unknown as {
        chatSending?: boolean;
        chatSendingSessionKey?: string | null;
        chatRunId?: string | null;
        chatStream?: string | null;
        chatStreamStartedAt?: number | null;
      };
      if ("chatSending" in chatHost) {
        chatHost.chatSending = false;
      }
      if ("chatSendingSessionKey" in chatHost) {
        chatHost.chatSendingSessionKey = null;
      }
      if ("chatRunId" in chatHost) {
        chatHost.chatRunId = null;
      }
      if ("chatStream" in chatHost) {
        chatHost.chatStream = null;
      }
      if ("chatStreamStartedAt" in chatHost) {
        chatHost.chatStreamStartedAt = null;
      }

      // Reset loading states to prevent stuck loaders on reconnect
      // This is a defensive reset - the finally blocks in loaders should handle this,
      // but edge cases (race conditions, network drops) can leave flags stuck
      const loadingHost = host as unknown as {
        sessionsLoading?: boolean;
        agentsLoading?: boolean;
        nodesLoading?: boolean;
        devicesLoading?: boolean;
        channelsLoading?: boolean;
        presenceLoading?: boolean;
      };
      if ("sessionsLoading" in loadingHost) {
        loadingHost.sessionsLoading = false;
      }
      if ("agentsLoading" in loadingHost) {
        loadingHost.agentsLoading = false;
      }
      if ("nodesLoading" in loadingHost) {
        loadingHost.nodesLoading = false;
      }
      if ("devicesLoading" in loadingHost) {
        loadingHost.devicesLoading = false;
      }
      if ("channelsLoading" in loadingHost) {
        loadingHost.channelsLoading = false;
      }
      if ("presenceLoading" in loadingHost) {
        loadingHost.presenceLoading = false;
      }

      // Code 1012 = Service Restart (expected during config saves, don't show as error)
      if (code !== 1012) {
        host.lastError = `disconnected (${code}): ${reason || "no reason"}`;
      }
      // Auto-reconnect with exponential backoff
      scheduleReconnect(host);
    },
    onEvent: (evt) => handleGatewayEvent(host, evt),
    onGap: ({ expected, received }) => {
      host.lastError = `event gap detected (expected seq ${expected}, got ${received}); refresh recommended`;
    },
  });
  host.client.start();
}

export function handleGatewayEvent(host: GatewayHost, evt: GatewayEventFrame) {
  try {
    handleGatewayEventUnsafe(host, evt);
  } catch (err) {
    console.error("[gateway] handleGatewayEvent error:", evt.event, err);
  }
}

function handleGatewayEventUnsafe(host: GatewayHost, evt: GatewayEventFrame) {
  eventLogRing.unshift({ ts: Date.now(), event: evt.event, payload: evt.payload });
  if (eventLogRing.length > 250) {
    eventLogRing.length = 250;
  }
  if (host.tab === "debug") {
    host.eventLog = [...eventLogRing];
  }

  if (evt.event === "agent") {
    if (host.onboarding) {
      return;
    }

    // Track working sessions for tool execution indicators
    const agentPayload = evt.payload as AgentEventPayload | undefined;
    const toolSessionKey = agentPayload?.sessionKey;
    if (toolSessionKey && agentPayload?.stream === "tool") {
      const data = agentPayload.data as Record<string, unknown> | undefined;
      const phase = data?.phase;
      if (phase === "start") {
        // Tool starting - ensure session is marked as working
        if (!host.workingSessions.has(toolSessionKey)) {
          host.workingSessions.add(toolSessionKey);
          (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
        }
      }
      // Note: Don't remove on "result" - wait for chat final event to clear
    }

    handleAgentEvent(host as unknown as Parameters<typeof handleAgentEvent>[0], agentPayload);
    return;
  }

  if (evt.event === "chat") {
    const payload = evt.payload as ChatEventPayload | undefined;
    if (payload?.sessionKey) {
      setLastActiveSessionKey(
        host as unknown as Parameters<typeof setLastActiveSessionKey>[0],
        payload.sessionKey,
      );
      // Track working sessions for indicators
      if (payload.state === "delta") {
        // Cancel any pending clear for this session
        const pendingClear = workingSessionClearTimers.get(payload.sessionKey);
        if (pendingClear) {
          clearTimeout(pendingClear);
          workingSessionClearTimers.delete(payload.sessionKey);
        }
        if (!host.workingSessions.has(payload.sessionKey)) {
          host.workingSessions.add(payload.sessionKey);
          (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
        }
        // Safety timeout: clear working indicator if no final event arrives
        // within 90 seconds (e.g., response delivered via iMessage only).
        const safetyKey = `safety:${payload.sessionKey}`;
        const existingSafety = workingSessionClearTimers.get(safetyKey);
        if (existingSafety) clearTimeout(existingSafety);
        workingSessionClearTimers.set(
          safetyKey,
          setTimeout(() => {
            workingSessionClearTimers.delete(safetyKey);
            if (host.workingSessions.has(payload.sessionKey)) {
              host.workingSessions.delete(payload.sessionKey);
              (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
            }
          }, 90_000),
        );
      } else if (
        payload.state === "final" ||
        payload.state === "error" ||
        payload.state === "aborted"
      ) {
        // Clear working indicator immediately — chat final/error/aborted is the
        // definitive end of the turn. The debounce is only needed for agent tool
        // events (rapid start/finish during multi-tool turns), not chat events.
        if (host.workingSessions.has(payload.sessionKey)) {
          // Cancel any pending debounced clear from agent tool events
          const existing = workingSessionClearTimers.get(payload.sessionKey);
          if (existing) {
            clearTimeout(existing);
            workingSessionClearTimers.delete(payload.sessionKey);
          }
          // Cancel the safety timeout too
          const safetyKey = `safety:${payload.sessionKey}`;
          const existingSafety = workingSessionClearTimers.get(safetyKey);
          if (existingSafety) {
            clearTimeout(existingSafety);
            workingSessionClearTimers.delete(safetyKey);
          }
          host.workingSessions.delete(payload.sessionKey);
          (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
        }
      }
    }
    // Update session timestamp locally for tab "ready" indicators
    // (instead of re-fetching all sessions which caused displayName revert)
    if (payload.state === "final") {
      updateSessionTimestamp(host, payload.sessionKey);
    }
    // Only process events for the current session
    const state = handleChatEvent(host as unknown as GodModeApp, payload);

    // ── Ally side-chat routing ──────────────────────────────────────
    // When the ally-main session receives chat events and is NOT the
    // active full-screen session, route messages to the ally overlay state.
    // Match both "main" and canonicalized forms like "agent:main:main"
    const isAllySession = payload?.sessionKey === ALLY_SESSION_KEY
      || (payload?.sessionKey?.endsWith(`:${ALLY_SESSION_KEY}`) ?? false);
    if (payload && isAllySession) {
      const allyHost = host as unknown as {
        allyMessages?: Array<{ role: string; content: string; timestamp?: number }>;
        allyStream?: string | null;
        allyWorking?: boolean;
        allyPanelOpen?: boolean;
        allyUnread?: number;
        tab?: string;
        requestUpdate?: () => void;
      };
      const isAllyFullScreen = host.tab === "chat" && host.sessionKey === ALLY_SESSION_KEY;

      if (payload.state === "delta") {
        // Streaming delta: update ally stream (cumulative — each delta has full text so far)
        const deltaText = extractTextFromMessage(payload.message);
        if (!isAllyFullScreen) {
          if (typeof deltaText === "string") {
            const current = allyHost.allyStream ?? "";
            // Only accept if longer (cumulative) — prevents null/short overwrites
            if (!current || deltaText.length >= current.length) {
              allyHost.allyStream = deltaText;
            }
          }
          allyHost.allyWorking = true;
          allyHost.requestUpdate?.();
        }
      } else if (payload.state === "final") {
        // Reload full history from the server so the overlay stays in sync.
        // This captures user messages from external channels (iMessage, Telegram)
        // that don't arrive as individual gateway events.
        allyHost.allyStream = null;
        allyHost.allyWorking = false;
        if (!allyHost.allyPanelOpen && host.tab !== "chat") {
          allyHost.allyUnread = (allyHost.allyUnread ?? 0) + 1;
        }
        const app = host as unknown as {
          _loadAllyHistory: () => Promise<void>;
          _scrollAllyToBottom: () => void;
        };
        void app._loadAllyHistory().then(() => {
          if (allyHost.allyPanelOpen) {
            app._scrollAllyToBottom();
          }
          allyHost.requestUpdate?.();
        });
      } else if (payload.state === "error" || payload.state === "aborted") {
        // Show error to user instead of silently swallowing it
        const errText = extractTextFromMessage(payload.message);
        const errorMsg = payload.state === "aborted"
          ? "Response was stopped."
          : (errText || "Something went wrong \u2014 try again.");
        allyHost.allyMessages = [
          ...(allyHost.allyMessages ?? []),
          { role: "assistant", content: `*${errorMsg}*`, timestamp: Date.now() },
        ];
        allyHost.allyStream = null;
        allyHost.allyWorking = false;
        allyHost.requestUpdate?.();
      }
    }

    // Auto-title and session refresh run for ANY session (not just the active one).
    // handleChatEvent returns null for non-active sessions, so we check payload.state
    // directly to avoid missing auto-title when the user switches tabs mid-response.
    if (payload.state === "final") {
      // Run auto-title FIRST (before loadSessions can overwrite local state).
      // Then refresh sessions. Auto-title is self-contained — it fetches its
      // own messages if needed and caches the result defensively.
      void (async () => {
        await maybeAutoTitleSession(host, payload.sessionKey);
        try {
          await loadSessions(host as unknown as GodModeApp, { activeMinutes: 0 });
        } catch {
          // Non-critical
        }
      })();
    }

    // These only apply to the active session's chat events
    if (state === "final" || state === "error" || state === "aborted") {
      resetToolStream(host as unknown as Parameters<typeof resetToolStream>[0]);
      void flushChatQueueForEvent(host as unknown as Parameters<typeof flushChatQueueForEvent>[0]);
      if (state === "final") {
        // Mark compaction as complete if it was in progress
        // (triggered by Compact button sending /compact command)
        if (host.compactionStatus?.active) {
          host.compactionStatus = {
            active: false,
            startedAt: host.compactionStatus.startedAt ?? null,
            completedAt: Date.now(),
          };

          // Auto-retry the pending message after compaction completes.
          // handleSendChat saves the user's message to pendingRetry and sets
          // autoRetryAfterCompact before triggering /compact. Now that
          // compaction is done, resend the message automatically.
          const retryHost = host as unknown as {
            autoRetryAfterCompact?: boolean;
            handleRetryMessage?: () => Promise<void>;
            pendingRetry?: { message: string } | null;
            showToast?: (msg: string, type: string, duration?: number) => void;
            handleSendChat?: (msg: string) => Promise<void>;
          };
          if (retryHost.autoRetryAfterCompact && retryHost.pendingRetry) {
            retryHost.autoRetryAfterCompact = false;
            // Small delay to let loadChatHistoryAfterFinal finish first
            setTimeout(() => {
              void retryHost.handleRetryMessage?.();
            }, 500);
          } else {
            // Server-triggered compaction (no pending user message).
            // Auto-send a continuation so the conversation doesn't stall.
            retryHost.showToast?.("Compaction complete — resuming...", "info", 2000);
            setTimeout(() => {
              void retryHost.handleSendChat?.("Continue where you left off.");
            }, 800);
          }
        }
      }
      // Clear compaction status on error/abort
      if ((state === "error" || state === "aborted") && host.compactionStatus?.active) {
        host.compactionStatus = null;
      }
      // Clear the manual refresh flag if it was set
      host.refreshSessionsAfterChat = false;
    }
    if (state === "final") {
      const allowShrink = Boolean(host.compactionStatus?.completedAt);
      void loadChatHistoryAfterFinal(host as unknown as GodModeApp, { allowShrink }).then(() => {
        void cacheAndResolveImages(host as unknown as GodModeApp);
        // Refresh session resources strip after each assistant turn
        void (host as any).loadSessionResources?.();
        // Auto-open Proof docs when a tool result contains a _sidebarAction
        autoOpenProofFromMessages(host as unknown as GodModeApp);

        // Detect server-side compaction and auto-continue.
        // The gateway injects a "Pre-compaction memory flush" user message
        // that bypasses the UI's compaction flow. After the model processes
        // it and the run ends, the conversation stalls. Detect this and
        // auto-send a continuation so the user doesn't have to manually nudge.
        const app = host as unknown as {
          chatMessages?: unknown[];
          handleSendChat?: (msg: string) => Promise<void>;
          showToast?: (msg: string, type: string, duration?: number) => void;
          compactionStatus?: { active?: boolean } | null;
        };
        if (!app.compactionStatus?.active) {
          const msgs = Array.isArray(app.chatMessages) ? app.chatMessages : [];
          // Find the last user message
          const lastUserMsg = [...msgs].reverse().find(
            (m: any) => typeof m === "object" && m !== null && (m as any).role === "user",
          ) as Record<string, unknown> | undefined;
          if (lastUserMsg) {
            const content = lastUserMsg.content;
            let text = "";
            if (typeof content === "string") text = content;
            else if (Array.isArray(content)) {
              text = (content as any[])
                .filter((b: any) => typeof b?.text === "string")
                .map((b: any) => b.text)
                .join(" ");
            }
            if (text.includes("Pre-compaction memory flush") || text.includes("pre-compaction memory flush")) {
              app.showToast?.("Context compacted — resuming conversation...", "info", 2000);
              setTimeout(() => {
                void app.handleSendChat?.("Continue where you left off.");
              }, 800);
            }
          }
        }
      });

      // Auto-refresh dashboard when its session completes (agent may have updated it)
      const app = host as unknown as {
        activeDashboardManifest?: { sessionId?: string | null; id?: string } | null;
        tab?: string;
      };
      if (
        app.tab === "dashboards" &&
        app.activeDashboardManifest?.sessionId &&
        app.activeDashboardManifest.sessionId === payload.sessionKey
      ) {
        void import("./controllers/dashboards.js").then(({ loadDashboard }) => {
          void loadDashboard(host as unknown as GodModeApp, app.activeDashboardManifest!.id!);
        });
      }
    }
    return;
  }

  if (evt.event === "presence") {
    const payload = evt.payload as { presence?: PresenceEntry[] } | undefined;
    if (payload?.presence && Array.isArray(payload.presence)) {
      host.presenceEntries = payload.presence;
      host.presenceError = null;
      host.presenceStatus = null;
    }
    return;
  }

  if (evt.event === "cron" && host.tab === "cron") {
    void loadCron(host as unknown as Parameters<typeof loadCron>[0]);
  }

  if (evt.event === "device.pair.requested" || evt.event === "device.pair.resolved") {
    void loadDevices(host as unknown as GodModeApp, { quiet: true });
  }

  if (evt.event === "exec.approval.requested") {
    const entry = parseExecApprovalRequested(evt.payload);
    if (entry) {
      host.execApprovalQueue = addExecApproval(host.execApprovalQueue, entry);
      host.execApprovalError = null;
      const delay = Math.max(0, entry.expiresAtMs - Date.now() + 500);
      window.setTimeout(() => {
        host.execApprovalQueue = removeExecApproval(host.execApprovalQueue, entry.id);
      }, delay);
    }
    return;
  }

  if (evt.event === "exec.process.completed") {
    const payload = evt.payload as
      | {
          sessionId?: string;
          status?: string;
          exitCode?: number | null;
          exitSignal?: string | number | null;
          commandSnippet?: string;
        }
      | undefined;

    if (payload?.sessionId) {
      const exitInfo = payload.exitSignal
        ? `signal ${payload.exitSignal}`
        : `exit ${payload.exitCode ?? 0}`;
      const icon = payload.status === "completed" ? "\u2713" : "\u2717";
      const toastType = payload.status === "completed" ? "success" : "warning";
      const shortId = payload.sessionId.slice(0, 8);

      const app = host as unknown as {
        showToast?: (msg: string, type: string, dur: number) => void;
      };
      if (typeof app.showToast === "function") {
        app.showToast(
          `${icon} Process ${shortId} ${payload.status} (${exitInfo})`,
          toastType,
          5000,
        );
      }
    }
    return;
  }

  if (evt.event === "exec.approval.resolved") {
    const resolved = parseExecApprovalResolved(evt.payload);
    if (resolved) {
      host.execApprovalQueue = removeExecApproval(host.execApprovalQueue, resolved.id);
    }
  }

  // Daily Brief live updates
  if (evt.event === "daily-brief:update") {
    const payload = evt.payload as
      | {
          date: string;
          content: string;
          summary: {
            readiness: number | null;
            readinessMode: string | null;
            weather: { temp: number; condition: string; icon: string } | null;
            tasks: { total: number; completed: number };
          };
          sections: string[];
          updatedAt: string;
        }
      | undefined;

    if (payload) {
      // Type assertion to access dailyBrief property
      const appHost = host as unknown as { dailyBrief?: typeof payload };
      appHost.dailyBrief = payload;
    }
    return;
  }

  // Dynamic HTML slot updates (AI-generated tab content)
  if (evt.event === "ui.slot.update") {
    const payload = evt.payload as
      | { tabId: string; html: string | null; mode?: "replace" | "append" }
      | undefined;
    if (payload?.tabId) {
      const mode = payload.mode ?? "replace";
      if (!payload.html) {
        // Clear the slot
        const next = { ...host.dynamicSlots };
        delete next[payload.tabId];
        host.dynamicSlots = next;
      } else if (mode === "append") {
        host.dynamicSlots = {
          ...host.dynamicSlots,
          [payload.tabId]: (host.dynamicSlots[payload.tabId] ?? "") + payload.html,
        };
      } else {
        host.dynamicSlots = {
          ...host.dynamicSlots,
          [payload.tabId]: payload.html,
        };
      }
      const app = host as unknown as { requestUpdate?: () => void };
      app.requestUpdate?.();
    }
    return;
  }

  // Guardrails live updates
  if (evt.event === "guardrails:update") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleGuardrailsLoad === "function") {
      void app.handleGuardrailsLoad();
    }
    return;
  }

  // GodMode Options live updates
  if (evt.event === "godmode.options:update") {
    const payload = evt.payload as Record<string, unknown> | undefined;
    if (payload) {
      const app = host as unknown as { godmodeOptions?: Record<string, unknown> | null; requestUpdate?: () => void };
      app.godmodeOptions = payload;
      app.requestUpdate?.();
    }
    return;
  }

  // Fathom meeting processed — notify via toast + ally chat + main chat
  if (evt.event === "fathom:meeting-processed") {
    const payload = evt.payload as
      | { meetingId?: number; title?: string; tasksCreated?: number; message?: string }
      | undefined;
    if (payload?.title) {
      const app = host as unknown as {
        showToast?: (msg: string, type: string, dur: number) => void;
        allyMessages?: Array<{ role: string; content: string; timestamp?: number }>;
        allyUnread?: number;
        allyPanelOpen?: boolean;
        tab?: string;
        sessionKey?: string;
        chatMessages?: Array<{ role: string; content: unknown; timestamp?: number }>;
        requestUpdate?: () => void;
      };
      if (typeof app.showToast === "function") {
        app.showToast(`Meeting processed: ${payload.title}`, "success", 6000);
      }
      const summary = payload.message ?? `Meeting "${payload.title}" has been processed.`;
      // Inject into ally overlay
      app.allyMessages = [
        ...(app.allyMessages ?? []),
        { role: "assistant", content: summary, timestamp: Date.now() },
      ];
      if (!app.allyPanelOpen && app.tab !== "chat") {
        app.allyUnread = (app.allyUnread ?? 0) + 1;
      }
      // Also inject into main chat session if user is viewing it
      if (app.sessionKey === ALLY_SESSION_KEY && app.chatMessages) {
        app.chatMessages = [
          ...app.chatMessages,
          { role: "assistant", content: summary, timestamp: Date.now() },
        ];
      }
      app.requestUpdate?.();
    }
    return;
  }

  // Onboarding state updates (real-time phase transitions from agent)
  if (evt.event === "onboarding:update") {
    const payload = evt.payload as
      | {
          phase?: number;
          identity?: { name: string; mission: string; emoji: string } | null;
          completedPhases?: number[];
          tools?: unknown[];
          audit?: { findings: unknown[] };
          summary?: unknown;
          completedAt?: string | null;
        }
      | undefined;
    if (payload) {
      const app = host as unknown as {
        onboardingPhase?: number;
        onboardingData?: unknown;
        onboardingActive?: boolean;
        requestUpdate?: () => void;
      };
      if (typeof payload.phase === "number") {
        app.onboardingPhase = payload.phase;
      }
      app.onboardingData = payload;
      // If completed, deactivate onboarding overlay
      if (payload.completedAt) {
        app.onboardingActive = false;
      }
      // Sync display name from onboarding identity if not yet set
      if (payload.identity?.name) {
        const nameHost = host as unknown as { userName: string; settings: UiSettings; applySettings: (s: UiSettings) => void };
        if (!nameHost.userName || !nameHost.settings.userName) {
          nameHost.userName = payload.identity.name;
          nameHost.applySettings({ ...nameHost.settings, userName: payload.identity.name });
        }
      }
      app.requestUpdate?.();
    }
    return;
  }

  if (evt.event === "inbox:update") {
    const inboxHost = host as unknown as {
      handleInboxRefresh?: () => Promise<unknown>;
      requestUpdate?: () => void;
    };
    inboxHost.handleInboxRefresh?.().catch(() => {});
    inboxHost.requestUpdate?.();
    return;
  }

  if (evt.event === "queue:update") {
    const payload = evt.payload as
      | {
          status?: string;
          proofDocSlug?: string | null;
        }
      | undefined;
    const queueHost = host as unknown as {
      handleOpenProofDoc?: (slug: string) => Promise<unknown>;
      handleInboxRefresh?: () => Promise<unknown>;
      loadTodayQueueResults?: () => Promise<unknown>;
      requestUpdate?: () => void;
    };
    if (payload?.status === "processing" && payload.proofDocSlug) {
      queueHost.handleOpenProofDoc?.(payload.proofDocSlug).catch(() => {});
    }
    queueHost.handleInboxRefresh?.().catch(() => {});
    queueHost.loadTodayQueueResults?.().catch(() => {});
    queueHost.requestUpdate?.();
    return;
  }

  // Ally notification events (proactive messages from the ally)
  if (evt.event === "ally:notification") {
    const payload = evt.payload as
      | {
          type?: string;
          summary?: string;
          actions?: Array<{
            label: string;
            action: string;
            target?: string;
            method?: string;
            params?: Record<string, unknown>;
          }>;
        }
      | undefined;
    if (payload) {
      const allyHost = host as unknown as {
        allyMessages?: Array<{
          role: string;
          content: string;
          timestamp?: number;
          isNotification?: boolean;
          actions?: unknown[];
        }>;
        allyPanelOpen?: boolean;
        allyUnread?: number;
        tab?: string;
        requestUpdate?: () => void;
        loadTodayQueueResults?: () => Promise<unknown>;
        handleInboxRefresh?: () => Promise<unknown>;
      };
      const msg = {
        role: "assistant" as const,
        content: payload.summary || (payload as Record<string, unknown>).message as string || "Notification received.",
        timestamp: Date.now(),
        isNotification: true,
        actions: payload.actions ?? [],
      };
      allyHost.allyMessages = [...(allyHost.allyMessages ?? []), msg];
      if (!allyHost.allyPanelOpen && host.tab !== "chat") {
        allyHost.allyUnread = (allyHost.allyUnread ?? 0) + 1;
      }
      // Reload decision cards when queue/cron/paperclip results arrive so Inbox badge updates
      const queueTypes = ["queue-complete", "queue-needs-review", "queue-failed", "cron-result", "paperclip-completion"];
      if (payload.type && queueTypes.includes(payload.type) && allyHost.loadTodayQueueResults) {
        allyHost.loadTodayQueueResults().catch(() => {});
      }
      if (payload.type && queueTypes.includes(payload.type) && allyHost.handleInboxRefresh) {
        allyHost.handleInboxRefresh().catch(() => {});
      }

      // Paperclip completions: inject into the originating chat session
      // so the ally can present the deliverable for review
      if (payload.type === "paperclip-completion") {
        const pcPayload = payload as {
          message?: string;
          sessionKey?: string;
          outputPath?: string;
          outputPreview?: string;
          title?: string;
        };
        const chatHost = host as unknown as {
          sessionKey?: string;
          chatMessages?: Array<Record<string, unknown>>;
          requestUpdate?: () => void;
          loadChatHistory?: () => Promise<unknown>;
        };
        // If this is the session that initiated the delegation, reload history
        // so the ally's response about the completed work appears naturally
        if (pcPayload.sessionKey && chatHost.sessionKey === pcPayload.sessionKey) {
          chatHost.loadChatHistory?.().catch(() => {});
        }
        // Use the message field for the notification content
        msg.content = pcPayload.message || msg.content;
      }
      allyHost.requestUpdate?.();
    }
    return;
  }

  // Server-side auto-title: session was titled by the server after first LLM response.
  // Update the local session list with the new title without a full re-fetch.
  if (evt.event === "sessions:updated") {
    const payload = evt.payload as { sessionKey?: string; title?: string } | undefined;
    if (payload?.sessionKey && payload?.title) {
      // Update local session data immediately
      if (host.sessionsResult?.sessions) {
        host.sessionsResult = {
          ...host.sessionsResult,
          sessions: host.sessionsResult.sessions.map((s) => {
            const keyMatch =
              s.key === payload.sessionKey ||
              s.key?.endsWith(`:${payload.sessionKey?.split(":").pop()}`) ||
              payload.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`);
            if (keyMatch) {
              return { ...s, displayName: payload.title, label: payload.title };
            }
            return s;
          }),
        };
      }
      // Also update the autoTitleCache so loadSessions doesn't overwrite
      autoTitleCache.set(payload.sessionKey, payload.title);
      autoTitleApplied.add(payload.sessionKey);
      (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
    }
    return;
  }

  // Auto-compact: server detected critical context pressure on a session
  if (evt.event === "session:auto-compact") {
    const payload = evt.payload as { sessionKey?: string } | undefined;
    if (payload?.sessionKey) {
      const app = host as unknown as {
        sessionKey?: string;
        compactionStatus?: { active: boolean } | null;
        connected?: boolean;
        handleCompactChat?: () => Promise<void>;
        showToast?: (msg: string, type: string, duration?: number) => void;
        client?: { request: (method: string, params: Record<string, unknown>) => Promise<unknown> };
      };
      // Only auto-compact if the session matches the current active session
      // and compaction isn't already in progress
      if (
        payload.sessionKey === app.sessionKey &&
        !app.compactionStatus?.active &&
        app.connected
      ) {
        app.showToast?.("Context near limit — auto-compacting...", "info", 3000);
        void app.handleCompactChat?.();
      }
    }
    return;
  }
}

async function loadFocusPulseOnConnect(host: GatewayHost) {
  const app = host as unknown as GodModeApp;
  if (typeof app.loadFocusPulse === "function") {
    await app.loadFocusPulse();
  }
}

async function loadOptionsOnConnect(host: GatewayHost) {
  const app = host as unknown as GodModeApp;
  if (typeof app.handleOptionsLoad === "function") {
    await app.handleOptionsLoad();
  }
}

/**
 * Handle ?openTask= URL parameter for task → session deep linking.
 * When clicked from Obsidian daily brief, opens or creates the task's session.
 */
async function handleOpenTaskParam(host: GodModeApp) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("openTask");
  if (!taskId || !host.client) return;

  // Clear the URL parameter to prevent re-triggering
  params.delete("openTask");
  const nextUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState({}, "", nextUrl);

  try {
    const result = await host.client.request<{ sessionKey: string }>(
      "tasks.openSession",
      { taskId },
    );
    if (result?.sessionKey) {
      host.sessionKey = result.sessionKey;
      host.tab = "chat" as Tab;
      const { loadChatHistory } = await import("./controllers/chat.js");
      await loadChatHistory(host, result.sessionKey);
    }
  } catch (err) {
    console.error("[GodMode] Failed to open task session:", err);
  }
}

export function applySnapshot(host: GatewayHost, hello: GatewayHelloOk) {
  const snapshot = hello.snapshot as
    | {
        presence?: PresenceEntry[];
        health?: HealthSnapshot;
        sessionDefaults?: SessionDefaultsSnapshot;
      }
    | undefined;
  if (snapshot?.presence && Array.isArray(snapshot.presence)) {
    host.presenceEntries = snapshot.presence;
  }
  if (snapshot?.health) {
    host.debugHealth = snapshot.health;
  }
  if (snapshot?.sessionDefaults) {
    applySessionDefaults(host, snapshot.sessionDefaults);
  }
}
