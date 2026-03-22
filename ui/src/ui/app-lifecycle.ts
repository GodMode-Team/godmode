import { saveDraft, restoreDraft } from "./app-chat";
import { connectGateway } from "./app-gateway";
import {
  startLogsPolling,
  startNodesPolling,
  stopLogsPolling,
  stopNodesPolling,
  startDebugPolling,
  stopDebugPolling,
} from "./app-polling";
import { createNewSession } from "./app-render.helpers";
import { observeTopbar, resetChatScroll, scheduleChatScroll, scheduleLogsScroll } from "./app-scroll";
import {
  applySettingsFromUrl,
  attachThemeListener,
  detachThemeListener,
  inferBasePath,
  refreshActiveTab,
  syncTabWithLocation,
  syncThemeWithSettings,
  syncUrlWithSessionKey,
} from "./app-settings";
import { triggerImageResolve } from "./app-gateway";
import { laneMessageCache, loadChatHistory, loadLaneHistory } from "./controllers/chat";
import type { GatewayBrowserClient } from "./gateway";
import type { Tab } from "./navigation";
import type { UiSettings } from "./storage";
import type { SessionsListResult } from "./types";

type LifecycleHost = {
  basePath: string;
  tab: Tab;
  connected: boolean;
  client: GatewayBrowserClient | null;
  chatHasAutoScrolled: boolean;
  chatLoading: boolean;
  chatMessages: unknown[];
  chatToolMessages: unknown[];
  chatStream: string;
  logsAutoFollow: boolean;
  logsAtBottom: boolean;
  logsEntries: unknown[];
  popStateHandler: () => void;
  keydownHandler: (e: KeyboardEvent) => void;
  topbarObserver: ResizeObserver | null;
  // For keyboard shortcuts
  settings: UiSettings;
  sessionKey: string;
  chatMessage: string;
  chatDrafts: Record<string, string>;
  chatStreamStartedAt: number | null;
  chatRunId: string | null;
  applySettings: (settings: UiSettings) => void;
  resetToolStream: () => void;
  resetChatScroll: () => void;
  loadAssistantIdentity: () => Promise<void>;
  // Session picker click-outside handling
  sessionPickerOpen: boolean;
  sessionPickerClickOutsideHandler: ((e: MouseEvent) => void) | null;
  // Session search click-outside handling
  sessionSearchOpen: boolean;
  sessionSearchClickOutsideHandler: ((e: MouseEvent) => void) | null;
  // Sessions data for tab normalization
  sessionsResult: SessionsListResult | null;
  // Track whether URL settings have been applied (prevent infinite tabs on reconnect)
  _urlSettingsApplied?: boolean;
};

const laneHydrationInFlight = new Set<string>();

function hydrateParallelLaneHistories(host: LifecycleHost): void {
  if (!host.connected || !host.client || !host.settings.chatParallelView) {
    return;
  }
  for (const rawSessionKey of host.settings.parallelLanes) {
    const key = rawSessionKey?.trim();
    if (!key) {
      continue;
    }
    const session = findSessionByKey(host.sessionsResult?.sessions, key);
    const canonicalKey = session?.key ?? key;
    const cacheHit = laneMessageCache.has(key) || laneMessageCache.has(canonicalKey);
    if (cacheHit || laneHydrationInFlight.has(canonicalKey)) {
      continue;
    }
    laneHydrationInFlight.add(canonicalKey);
    const client = host.client;
    void loadLaneHistory(client, canonicalKey)
      .then((messages) => {
        // Preserve lookups by original assigned key as well.
        if (canonicalKey !== key && messages.length > 0) {
          laneMessageCache.set(key, messages);
        }
      })
      .finally(() => {
        laneHydrationInFlight.delete(canonicalKey);
        host.applySettings({ ...host.settings });
      });
  }
}

export function handleConnected(host: LifecycleHost) {
  host.basePath = inferBasePath();
  // Only apply URL settings on first connect — not on reconnects.
  // Reconnects re-trigger handleConnected and applySettingsFromUrl adds a new
  // tab entry for the ?session= param each time, causing infinite tab spawning.
  if (!host._urlSettingsApplied) {
    applySettingsFromUrl(host as unknown as Parameters<typeof applySettingsFromUrl>[0]);
    host._urlSettingsApplied = true;
  }
  syncTabWithLocation(host as unknown as Parameters<typeof syncTabWithLocation>[0], true);
  syncThemeWithSettings(host as unknown as Parameters<typeof syncThemeWithSettings>[0]);
  attachThemeListener(host as unknown as Parameters<typeof attachThemeListener>[0]);
  window.addEventListener("popstate", host.popStateHandler);

  // Keyboard shortcuts for chat tab
  host.keydownHandler = (e: KeyboardEvent) => {
    if (host.tab !== "chat") {
      return;
    }

    // Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux): New session
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      createNewSession(host as unknown as Parameters<typeof createNewSession>[0]);
      return;
    }

    // Ctrl+1-9: Tab switching (no other modifiers)
    if (!e.ctrlKey) {
      return;
    }
    if (e.metaKey || e.altKey || e.shiftKey) {
      return;
    }
    if (e.key < "1" || e.key > "9") {
      return;
    }

    const index = parseInt(e.key, 10) - 1;
    const openTabs = host.settings.openTabs;
    if (index >= openTabs.length) {
      return;
    }

    const key = openTabs[index];
    if (key === host.sessionKey) {
      return;
    }

    e.preventDefault();
    // Save current draft before switching
    saveDraft(host);
    host.sessionKey = key;
    // Restore draft for new session
    restoreDraft(host, key);
    (host as unknown as { chatLoading: boolean }).chatLoading = true;
    host.chatStreamStartedAt = null;
    host.chatRunId = null;
    host.resetToolStream();
    host.resetChatScroll();
    host.applySettings({
      ...host.settings,
      sessionKey: key,
      lastActiveSessionKey: key,
      tabLastViewed: {
        ...host.settings.tabLastViewed,
        [key]: Date.now(),
      },
    });
    void host.loadAssistantIdentity();
    syncUrlWithSessionKey(
      host as unknown as Parameters<typeof syncUrlWithSessionKey>[0],
      key,
      true,
    );
    void loadChatHistory(host as unknown as Parameters<typeof loadChatHistory>[0]).then(() => {
      triggerImageResolve(host as unknown as import("./app").GodModeApp);
    });
  };
  window.addEventListener("keydown", host.keydownHandler);

  connectGateway(host as unknown as Parameters<typeof connectGateway>[0]);
  if (host.tab === "nodes") {
    startNodesPolling(host as unknown as Parameters<typeof startNodesPolling>[0]);
  }
  if (host.tab === "logs") {
    startLogsPolling(host as unknown as Parameters<typeof startLogsPolling>[0]);
  }
  if (host.tab === "debug") {
    startDebugPolling(host as unknown as Parameters<typeof startDebugPolling>[0]);
  }
}

export function handleFirstUpdated(host: LifecycleHost) {
  observeTopbar(host as unknown as Parameters<typeof observeTopbar>[0]);
}

export function handleDisconnected(host: LifecycleHost) {
  window.removeEventListener("popstate", host.popStateHandler);
  window.removeEventListener("keydown", host.keydownHandler);
  // Clean up session picker click-outside handler
  if (host.sessionPickerClickOutsideHandler) {
    document.removeEventListener("click", host.sessionPickerClickOutsideHandler, true);
    host.sessionPickerClickOutsideHandler = null;
  }
  // Clean up session search click-outside handler
  if (host.sessionSearchClickOutsideHandler) {
    document.removeEventListener("click", host.sessionSearchClickOutsideHandler, true);
    host.sessionSearchClickOutsideHandler = null;
  }
  stopNodesPolling(host as unknown as Parameters<typeof stopNodesPolling>[0]);
  stopLogsPolling(host as unknown as Parameters<typeof stopLogsPolling>[0]);
  stopDebugPolling(host as unknown as Parameters<typeof stopDebugPolling>[0]);
  detachThemeListener(host as unknown as Parameters<typeof detachThemeListener>[0]);
  host.topbarObserver?.disconnect();
  host.topbarObserver = null;
}

/**
 * Find a session by key, handling canonicalization differences.
 * The server canonicalizes keys like "webchat:xxx" to "agent:main:xxx",
 * but openTabs may store the raw key.
 */
export function findSessionByKey(
  sessions: SessionsListResult["sessions"] | undefined,
  key: string,
) {
  if (!sessions || !key) {
    return undefined;
  }
  const exact = sessions.find((s) => s.key === key);
  if (exact) {
    return exact;
  }
  const keyParts = key.split(":");
  const keySuffix = keyParts[keyParts.length - 1];
  if (keySuffix && keySuffix.length >= 4) {
    // Use endsWith with delimiter to avoid false matches from substring collisions
    const byEndsWith = sessions.find((s) => s.key === keySuffix || s.key.endsWith(`:${keySuffix}`));
    if (byEndsWith) {
      return byEndsWith;
    }
  }
  const withoutPrefix = key.replace(/^webchat:/, "");
  if (withoutPrefix !== key) {
    const bySuffix = sessions.find(
      (s) => s.key.endsWith(withoutPrefix) || s.key.endsWith(`:${withoutPrefix}`),
    );
    if (bySuffix) {
      return bySuffix;
    }
  }
  return undefined;
}

/**
 * Normalize openTabs to use canonical session keys from the server.
 * Dedupes aliases and keeps tabLastViewed/sessionKey aligned.
 */
function normalizeOpenTabs(host: LifecycleHost, sessions: SessionsListResult["sessions"]) {
  if (!sessions || sessions.length === 0) {
    return;
  }

  // Main session aliases are handled by the pinned ally tab — strip them
  const isMainAlias = (k: string): boolean => {
    const lower = k.toLowerCase();
    return lower === "main" || lower === "agent:main:main" || lower.endsWith(":main");
  };

  const toSessionIdentity = (
    session: SessionsListResult["sessions"][number] | undefined,
    canonicalKey: string,
  ): string => {
    const sessionId = session?.sessionId?.trim();
    if (sessionId) {
      return `session:${sessionId}`;
    }
    if (session) {
      const metaParts = [
        session.kind,
        session.surface,
        session.subject,
        session.room,
        session.space,
        session.label,
        session.displayName,
      ];
      const metaIdentity = metaParts
        .map((part) =>
          String(part ?? "")
            .trim()
            .toLowerCase(),
        )
        .join("|");
      if (metaIdentity.replace(/\|/g, "").length > 0) {
        return `meta:${metaIdentity}`;
      }
    }
    return `key:${canonicalKey}`;
  };

  let changed = false;
  const identityToTabKey = new Map<string, string>();
  const dedupedTabs: string[] = [];

  for (const rawKey of host.settings.openTabs) {
    const key = rawKey.trim();
    if (!key) {
      changed = true;
      continue;
    }
    // Strip main session aliases — pinned tab handles these
    if (isMainAlias(key)) {
      changed = true;
      continue;
    }
    const session = findSessionByKey(sessions, key);
    const canonicalKey = session?.key ?? key;
    if (canonicalKey !== rawKey) {
      changed = true;
    }
    const identity = toSessionIdentity(session, canonicalKey);
    if (identityToTabKey.has(identity)) {
      changed = true;
      continue;
    }
    identityToTabKey.set(identity, canonicalKey);
    dedupedTabs.push(canonicalKey);
  }

  const didDedup = dedupedTabs.length !== host.settings.openTabs.length;

  if (changed || didDedup) {
    // Empty openTabs is OK — the pinned ally tab handles the main session.
    // Only add a fallback if the current session is NOT a main alias.

    const normalizedTabLastViewed: Record<string, number> = {};
    for (const [oldKey, timestamp] of Object.entries(host.settings.tabLastViewed)) {
      const key = oldKey.trim();
      if (!key || typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
        continue;
      }
      const session = findSessionByKey(sessions, key);
      const identity = toSessionIdentity(session, session?.key ?? key);
      const canonicalKey = identityToTabKey.get(identity) ?? session?.key ?? key;
      normalizedTabLastViewed[canonicalKey] = Math.max(
        normalizedTabLastViewed[canonicalKey] ?? 0,
        timestamp,
      );
    }

    const currentSession = findSessionByKey(sessions, host.sessionKey);
    const currentSessionIdentity = toSessionIdentity(
      currentSession,
      currentSession?.key ?? host.sessionKey.trim(),
    );
    const canonicalSessionKey =
      identityToTabKey.get(currentSessionIdentity) ??
      currentSession?.key ??
      (host.sessionKey.trim() || dedupedTabs[0] || "main");
    // The pinned ally tab (ALLY_SESSION_KEY = "main") is never in openTabs,
    // so don't fall back to the first open tab when the user is on the ally tab.
    const isMainAlias =
      canonicalSessionKey === "main" ||
      canonicalSessionKey.endsWith(":main");
    const resolvedSessionKey =
      isMainAlias
        ? canonicalSessionKey
        : dedupedTabs.includes(canonicalSessionKey)
          ? canonicalSessionKey
          : (dedupedTabs[0] || "main");

    host.applySettings({
      ...host.settings,
      openTabs: dedupedTabs,
      sessionKey: resolvedSessionKey,
      lastActiveSessionKey: resolvedSessionKey,
      tabLastViewed: normalizedTabLastViewed,
    });

    if (host.sessionKey !== resolvedSessionKey) {
      host.sessionKey = resolvedSessionKey;
    }
  }
}

export function handleUpdated(host: LifecycleHost, changed: Map<PropertyKey, unknown>) {
  // Normalize openTabs on session refresh and on settings rewrites.
  if ((changed.has("sessionsResult") || changed.has("settings")) && host.sessionsResult?.sessions) {
    normalizeOpenTabs(host, host.sessionsResult.sessions);
  }

  if (
    changed.has("connected") &&
    changed.get("connected") === false &&
    host.connected &&
    host.settings.chatParallelView
  ) {
    hydrateParallelLaneHistories(host);
  }

  if (changed.has("settings") && host.connected && host.settings.chatParallelView) {
    const previous = changed.get("settings") as UiSettings | undefined;
    const enteredParallel = previous ? !previous.chatParallelView : true;
    const lanesChanged =
      !previous ||
      previous.parallelLanes.some((lane, index) => lane !== host.settings.parallelLanes[index]);
    if (enteredParallel || lanesChanged) {
      hydrateParallelLaneHistories(host);
    }
  }

  // Session picker click-outside handling
  if (changed.has("sessionPickerOpen")) {
    if (host.sessionPickerOpen) {
      // Dropdown just opened - add click-outside listener
      // Use setTimeout to avoid the current click that opened it
      setTimeout(() => {
        if (!host.sessionPickerOpen) {
          return;
        } // Already closed
        host.sessionPickerClickOutsideHandler = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          // Check if click is inside the session picker container OR the dropdown itself
          const picker = target.closest(".session-picker-container");
          const dropdown = target.closest(".session-picker-dropdown");
          if (!picker && !dropdown) {
            host.sessionPickerOpen = false;
          }
        };
        // Use capture phase to ensure we catch the event even if something stops propagation
        document.addEventListener("click", host.sessionPickerClickOutsideHandler, true);
      }, 0);
    } else {
      // Dropdown just closed - remove listener
      if (host.sessionPickerClickOutsideHandler) {
        document.removeEventListener("click", host.sessionPickerClickOutsideHandler, true);
        host.sessionPickerClickOutsideHandler = null;
      }
    }
  }

  // Session search click-outside handling
  if (changed.has("sessionSearchOpen")) {
    if (host.sessionSearchOpen) {
      // Dropdown just opened - add click-outside listener
      setTimeout(() => {
        if (!host.sessionSearchOpen) {
          return;
        } // Already closed
        host.sessionSearchClickOutsideHandler = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const container = target.closest(".session-search-container");
          const dropdown = target.closest(".session-search-dropdown");
          if (!container && !dropdown) {
            host.sessionSearchOpen = false;
          }
        };
        document.addEventListener("click", host.sessionSearchClickOutsideHandler, true);
      }, 0);
    } else {
      // Dropdown just closed - remove listener
      if (host.sessionSearchClickOutsideHandler) {
        document.removeEventListener("click", host.sessionSearchClickOutsideHandler, true);
        host.sessionSearchClickOutsideHandler = null;
      }
    }
  }

  // Safety net: when gateway reconnects while on chat tab, always reload
  // chat history. This catches race conditions where the initial load was
  // skipped AND stale-message scenarios where the previous connection's
  // data is still in state (which previously bypassed the length===0 check).
  // Delay slightly so the gateway's onReady handler has time to fire first,
  // which prevents double-loading chat history (BUG-005).
  if (
    changed.has("connected") &&
    changed.get("connected") === false &&
    host.connected &&
    host.tab === "chat" &&
    !host.chatLoading
  ) {
    setTimeout(() => {
      const h = host as unknown as Parameters<typeof loadChatHistory>[0];
      if (h.tab === "chat" && !h.chatLoading) {
        void loadChatHistory(h).then(() => {
          triggerImageResolve(host as unknown as import("./app").GodModeApp);
        });
      }
    }, 500);
  }

  // Safety net: when gateway connects while on a non-chat tab, load its data.
  // Without this, direct URL navigation to /my-day (or other tabs) never loads
  // because setTabFromRoute skips refreshActiveTab when not yet connected.
  if (
    changed.has("connected") &&
    changed.get("connected") === false &&
    host.connected &&
    host.tab !== "chat"
  ) {
    void refreshActiveTab(host as unknown as Parameters<typeof refreshActiveTab>[0]);
  }

  if (
    host.tab === "chat" &&
    (changed.has("chatMessages") ||
      changed.has("chatToolMessages") ||
      changed.has("chatStream") ||
      changed.has("chatLoading") ||
      changed.has("sessionKey") ||
      changed.has("tab"))
  ) {
    const forcedByTab = changed.has("tab");
    const forcedBySession = changed.has("sessionKey");
    const forcedByLoad =
      changed.has("chatLoading") && changed.get("chatLoading") === true && !host.chatLoading;
    // Force scroll when new user message is added (user sent something)
    // or when new assistant message arrives (streaming or complete)
    let forceScroll = false;
    if (changed.has("chatMessages")) {
      const messages = host.chatMessages as Array<{ role?: string }>;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "user") {
        forceScroll = true;
      }
    }
    // Also trigger scroll on stream updates (assistant is responding)
    if (changed.has("chatStream")) {
      // Don't force, but ensure scheduleChatScroll runs so it can decide based on userNearBottom
      forceScroll = false;
    }
    if (forcedByTab || forcedBySession || forcedByLoad) {
      resetChatScroll(host as unknown as Parameters<typeof resetChatScroll>[0]);
    }
    scheduleChatScroll(
      host as unknown as Parameters<typeof scheduleChatScroll>[0],
      forcedByTab || forcedBySession || forcedByLoad || forceScroll || !host.chatHasAutoScrolled,
    );
  }
  if (
    host.tab === "logs" &&
    (changed.has("logsEntries") || changed.has("logsAutoFollow") || changed.has("tab"))
  ) {
    if (host.logsAutoFollow && host.logsAtBottom) {
      scheduleLogsScroll(
        host as unknown as Parameters<typeof scheduleLogsScroll>[0],
        changed.has("tab") || changed.has("logsAutoFollow"),
      );
    }
  }
}
