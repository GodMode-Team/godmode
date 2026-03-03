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
import { startUpdatePolling, stopUpdatePolling } from "./controllers/updates";
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

    // If nothing was resolved but there are omitted images, retry once after
    // a short delay — the session index write may still be in flight.
    if (!resolved && app.chatMessages?.some((m) => {
      const imgs = extractImages(m);
      return imgs.some((img) => img.omitted || !img.url);
    })) {
      await new Promise((r) => setTimeout(r, 500));
      await doResolve();
    }
  } catch {
    // Cache miss is fine
  } finally {
    resolving = false;
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
  const resolvedSessionKey = normalizeSessionKeyForDefaults(host.sessionKey, defaults);
  const resolvedSettingsSessionKey = normalizeSessionKeyForDefaults(
    host.settings.sessionKey,
    defaults,
  );
  const resolvedLastActiveSessionKey = normalizeSessionKeyForDefaults(
    host.settings.lastActiveSessionKey,
    defaults,
  );
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
  try {
    const res = await host.client.request("projects.list", {});
    const app = host as unknown as { workspaceNeedsSetup?: boolean };
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
      }
    } else {
      app.onboardingActive = false;
      app.onboardingData = res ?? null;
      // Hide setup tab for completed users
      const setupApp = host as unknown as { showSetupTab?: boolean };
      setupApp.showSetupTab = false;
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

// Track sessions that already had auto-title attempted to avoid repeated calls
const autoTitleAttempted = new Set<string>();

/**
 * Derive a short, meaningful title from the first user message in a session.
 * Scans all sentences for the most "topical" one instead of blindly using the first line.
 */
function deriveSessionTitle(chatMessages: Array<{ role: string; content: unknown }>): string | null {
  const firstUser = chatMessages.find((m) => m.role === "user");
  if (!firstUser) return null;

  let text = "";
  if (typeof firstUser.content === "string") {
    text = firstUser.content;
  } else if (Array.isArray(firstUser.content)) {
    const textBlock = firstUser.content.find(
      (b: unknown) => (b as { type?: string }).type === "text",
    );
    text = (textBlock as { text?: string })?.text ?? "";
  }

  if (!text.trim()) return null;

  // Strip code blocks, inline code, URLs, and image links
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "");

  // Split into sentences (period/question/exclamation boundaries or newlines)
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^#+\s*/, "").replace(/[*_`~[\]]/g, "").trim())
    .filter((s) => s.length > 5);

  if (sentences.length === 0) return null;

  // Score each sentence for "topic quality" — higher = better title candidate
  const GREETING_RE = /^(hi|hey|hello|thanks|thank\s+you|thx|ok|okay|sure|alright|great)\b/i;
  const IMPERATIVE_RE = /^(fix|add|create|update|change|build|implement|remove|delete|refactor|make|set\s+up|configure|enable|disable|show|hide|move|rename|convert|replace|write|edit|debug|test|deploy|install|run|check|review|optimize|improve|clean|reset|open|close|connect|disconnect|sync|upload|download|merge|split|sort|filter|search|format|generate|export|import|migrate|monitor|schedule|cancel|approve|reject|assign|unassign)\b/i;
  const TECH_RE = /\b(function|component|file|page|button|API|error|bug|feature|config|style|layout|route|test|database|server|client|UI|CSS|HTML|TypeScript|view|sidebar|modal|tab|form|input|output|session|message|chat|title|drive|upload|deploy|build)\b/i;

  function scoreSentence(s: string): number {
    let score = 0;
    if (s.includes("?")) score += 3;
    if (IMPERATIVE_RE.test(s)) score += 5;
    if (TECH_RE.test(s)) score += 2;
    if (/^(I |you |we |my |it'?s |this is |that |there )/i.test(s)) score -= 1;
    if (GREETING_RE.test(s)) score -= 5;
    if (s.length < 15) score -= 1;
    if (s.length >= 15 && s.length <= 60) score += 1;
    return score;
  }

  const scored = sentences.map((s) => ({ text: s, score: scoreSentence(s) }));
  scored.sort((a, b) => b.score - a.score);

  let title = scored[0].text;

  // Strip common filler prefixes to get to the actual request
  title = title
    .replace(/^(can you|could you|would you|will you|I need you to|I want you to|I'd like you to|help me to?|go ahead and)\s+/i, "")
    .replace(/^(please|pls)\s+/i, "")
    .trim();

  // Capitalize first letter
  if (title.length > 0) {
    title = title[0].toUpperCase() + title.slice(1);
  }

  // Strip trailing punctuation for cleaner title
  title = title.replace(/[.!]+$/, "").trim();

  // Truncate to 50 chars at word boundary
  if (title.length > 50) {
    title = title.slice(0, 47).replace(/\s+\S*$/, "").trim() + "...";
  }

  return title || null;
}

/**
 * Auto-title an unnamed session after the first response.
 * Fire-and-forget: failures are silent (user can still rename manually).
 */
async function maybeAutoTitleSession(host: GatewayHost, sessionKey: string) {
  // Skip well-known named sessions and external channel sessions (Telegram, Slack)
  const SKIP_TITLE_PATTERNS = ["telegram", "slack", "discord", "whatsapp"];
  const lowerKey = sessionKey.toLowerCase();
  if (SKIP_TITLE_PATTERNS.some((p) => lowerKey.includes(p))) {
    return;
  }

  // Never auto-title private sessions — no server-side traces
  if ((host as unknown as { privateSessions?: Map<string, number> }).privateSessions?.has(sessionKey)) {
    return;
  }

  // Don't retry if we already attempted for this session
  if (autoTitleAttempted.has(sessionKey)) {
    return;
  }

  // Check if session already has a label or displayName
  const session = host.sessionsResult?.sessions?.find((s) => s.key === sessionKey);
  if (session?.label?.trim() || session?.displayName?.trim()) {
    return;
  }

  autoTitleAttempted.add(sessionKey);

  if (!host.client || !host.connected) {
    console.warn("[auto-title] skipped: not connected");
    return;
  }

  try {
    // Derive title client-side from the first user message
    const app = host as unknown as GodModeApp;
    const title = deriveSessionTitle(app.chatMessages ?? []);

    if (!title) {
      console.warn("[auto-title] no user message found to derive title");
      return;
    }

    // Persist the title via self-healing session patch (handles field name changes)
    const { hostPatchSession } = await import("../lib/host-compat.js");
    const result = await hostPatchSession(host.client, sessionKey, title);

    if (!result.ok) {
      console.error("[auto-title] patch failed:", result.error);
      return;
    }

    // Store in persistent cache so it survives sessionsResult overwrites
    autoTitleCache.set(sessionKey, title);

    // Update local session data immediately so the tab re-renders
    if (host.sessionsResult?.sessions) {
      host.sessionsResult = {
        ...host.sessionsResult,
        sessions: host.sessionsResult.sessions.map((s) =>
          s.key === sessionKey ? { ...s, label: title, displayName: title } : s,
        ),
      };
    }
    (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();
  } catch (e) {
    console.error("[auto-title] RPC call failed:", e);
  }
}

export function connectGateway(host: GatewayHost) {
  host.lastError = null;
  host.hello = null;
  host.connected = false;
  host.execApprovalQueue = [];
  host.execApprovalError = null;

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

        // Clear working session indicators
        host.workingSessions.clear();
        (host as unknown as { requestUpdate?: () => void }).requestUpdate?.();

        // Clear any pending debounce timers
        for (const timer of workingSessionClearTimers.values()) {
          clearTimeout(timer);
        }
        workingSessionClearTimers.clear();
      }

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
    if (payload && payload.sessionKey === ALLY_SESSION_KEY) {
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
        // Streaming delta: update ally stream
        const deltaText = extractTextFromMessage(payload.message);
        if (!isAllyFullScreen && typeof deltaText === "string") {
          allyHost.allyStream = deltaText;
          allyHost.allyWorking = true;
          allyHost.requestUpdate?.();
        }
      } else if (payload.state === "final") {
        // Final message: append to ally messages, clear stream
        if (!isAllyFullScreen) {
          const finalContent = allyHost.allyStream ?? extractTextFromMessage(payload.message) ?? "";
          if (finalContent) {
            allyHost.allyMessages = [
              ...(allyHost.allyMessages ?? []),
              { role: "assistant", content: finalContent, timestamp: Date.now() },
            ];
          }
          allyHost.allyStream = null;
          allyHost.allyWorking = false;
          if (!allyHost.allyPanelOpen && host.tab !== "chat") {
            allyHost.allyUnread = (allyHost.allyUnread ?? 0) + 1;
          }
          allyHost.requestUpdate?.();
        }
      } else if (payload.state === "error" || payload.state === "aborted") {
        if (!isAllyFullScreen) {
          // Show error to user instead of silently swallowing it
          const errText = extractTextFromMessage(payload.message);
          const errorMsg = payload.state === "aborted"
            ? "Response was stopped."
            : (errText || "Something went wrong — try again.");
          allyHost.allyMessages = [
            ...(allyHost.allyMessages ?? []),
            { role: "assistant", content: `*${errorMsg}*`, timestamp: Date.now() },
          ];
        }
        allyHost.allyStream = null;
        allyHost.allyWorking = false;
        allyHost.requestUpdate?.();
      }
    }

    // Auto-title and session refresh run for ANY session (not just the active one).
    // handleChatEvent returns null for non-active sessions, so we check payload.state
    // directly to avoid missing auto-title when the user switches tabs mid-response.
    if (payload.state === "final") {
      // Load sessions first (for token counts), then auto-title.
      // Sequential to prevent race: loadSessions could overwrite auto-title's
      // local displayName update if they run concurrently.
      void (async () => {
        try {
          await loadSessions(host as unknown as GodModeApp, { activeMinutes: 0 });
        } catch (e) {
          console.error("[auto-title] loadSessions failed, proceeding anyway:", e);
        }
        void maybeAutoTitleSession(host, payload.sessionKey);
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

  // Focus Pulse live updates
  if (evt.event === "focusPulse:update") {
    const payload = evt.payload as Record<string, unknown> | undefined;
    if (payload) {
      const app = host as unknown as { focusPulseData?: unknown; requestUpdate?: () => void };
      app.focusPulseData = payload;
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

  // Proactive Intel live updates
  if (evt.event === "proactiveIntel:insight") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleIntelLoad === "function") {
      void app.handleIntelLoad();
    }
    // Show toast for new insights
    const payload = evt.payload as { newInsights?: number; totalActive?: number } | undefined;
    if (payload?.newInsights && typeof app.showToast === "function") {
      app.showToast(
        `${payload.newInsights} new intelligence insight${payload.newInsights > 1 ? "s" : ""} available`,
        "info",
        6000,
      );
    }
    return;
  }
  if (evt.event === "proactiveIntel:update") {
    const app = host as unknown as GodModeApp;
    const subtab = (app as unknown as { secondBrainSubtab?: string }).secondBrainSubtab;
    if (typeof app.handleIntelLoad === "function" && host.tab === "second-brain" && subtab === "intel") {
      void app.handleIntelLoad();
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
      app.requestUpdate?.();
    }
    return;
  }

  // Ally notification events (proactive messages from the ally)
  if (evt.event === "ally:notification") {
    const payload = evt.payload as
      | {
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
      };
      const msg = {
        role: "assistant" as const,
        content: payload.summary || "Notification received.",
        timestamp: Date.now(),
        isNotification: true,
        actions: payload.actions ?? [],
      };
      allyHost.allyMessages = [...(allyHost.allyMessages ?? []), msg];
      if (!allyHost.allyPanelOpen && host.tab !== "chat") {
        allyHost.allyUnread = (allyHost.allyUnread ?? 0) + 1;
      }
      allyHost.requestUpdate?.();
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
