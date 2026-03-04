const KEY = "godmode.ui.settings.v1";

import type { ThemeMode } from "./theme";

export type UiSettings = {
  gatewayUrl: string;
  token: string;
  sessionKey: string;
  lastActiveSessionKey: string;
  theme: ThemeMode;
  chatFocusMode: boolean;
  chatShowThinking: boolean;
  splitRatio: number; // Sidebar split ratio (0.4 to 0.7, default 0.6)
  navCollapsed: boolean; // Collapsible sidebar state
  navGroupsCollapsed: Record<string, boolean>; // Which nav groups are collapsed
  openTabs: string[]; // Session keys currently open as tabs
  tabLastViewed: Record<string, number>; // Timestamp when each tab was last viewed
  userName: string; // User's display name for chat
  userAvatar: string; // User's avatar (emoji, URL, or initial)
  chatParallelView: boolean; // Deck-style parallel sessions view
  parallelLanes: (string | null)[]; // 4 session keys assigned to parallel lanes
};

export function loadSettings(): UiSettings {
  const urlParams = new URLSearchParams(location.search);

  const defaultUrl = (() => {
    // Check for URL param first
    const urlParam = urlParams.get("gatewayUrl");
    if (urlParam) return urlParam;

    // In dev mode (Vite), use relative URL so it goes through Vite's proxy
    // This avoids CORS/origin issues when dev server is on a different port
    const isDevMode =
      typeof (window as { __GODMODE_DEV__?: boolean }).__GODMODE_DEV__ !== "undefined";
    if (isDevMode) {
      return "/ws";
    }

    // Default: Connect to gateway on same host (ws/wss based on page protocol)
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${location.host}`;
  })();

  const defaultToken = urlParams.get("token") || "";

  const defaults: UiSettings = {
    gatewayUrl: defaultUrl,
    token: defaultToken,
    sessionKey: "main",
    lastActiveSessionKey: "main",
    theme: "system",
    chatFocusMode: false,
    chatShowThinking: true,
    splitRatio: 0.6,
    navCollapsed: false,
    navGroupsCollapsed: { System: true },
    openTabs: [],
    tabLastViewed: {},
    userName: "",
    userAvatar: "",
    chatParallelView: false,
    parallelLanes: [null, null, null, null],
  };

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<UiSettings>;
    return {
      gatewayUrl:
        urlParams.get("gatewayUrl") ||
        // In dev mode, always use the proxy URL (ignore localStorage)
        (typeof (window as { __GODMODE_DEV__?: boolean }).__GODMODE_DEV__ !== "undefined"
          ? "/ws"
          : typeof parsed.gatewayUrl === "string" && parsed.gatewayUrl.trim()
            ? parsed.gatewayUrl.trim()
            : defaults.gatewayUrl),
      token: defaultToken || (typeof parsed.token === "string" ? parsed.token : ""),
      sessionKey:
        typeof parsed.sessionKey === "string" && parsed.sessionKey.trim()
          ? parsed.sessionKey.trim()
          : defaults.sessionKey,
      lastActiveSessionKey:
        typeof parsed.lastActiveSessionKey === "string" && parsed.lastActiveSessionKey.trim()
          ? parsed.lastActiveSessionKey.trim()
          : (typeof parsed.sessionKey === "string" && parsed.sessionKey.trim()) ||
            defaults.lastActiveSessionKey,
      theme:
        parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system" || parsed.theme === "lifetrack"
          ? parsed.theme
          : defaults.theme,
      chatFocusMode:
        typeof parsed.chatFocusMode === "boolean" ? parsed.chatFocusMode : defaults.chatFocusMode,
      chatShowThinking:
        typeof parsed.chatShowThinking === "boolean"
          ? parsed.chatShowThinking
          : defaults.chatShowThinking,
      splitRatio:
        typeof parsed.splitRatio === "number" &&
        parsed.splitRatio >= 0.4 &&
        parsed.splitRatio <= 0.7
          ? parsed.splitRatio
          : defaults.splitRatio,
      navCollapsed:
        typeof parsed.navCollapsed === "boolean" ? parsed.navCollapsed : defaults.navCollapsed,
      navGroupsCollapsed:
        typeof parsed.navGroupsCollapsed === "object" && parsed.navGroupsCollapsed !== null
          ? parsed.navGroupsCollapsed
          : defaults.navGroupsCollapsed,
      openTabs:
        Array.isArray(parsed.openTabs) && parsed.openTabs.every((t) => typeof t === "string")
          ? parsed.openTabs
          : defaults.openTabs,
      tabLastViewed:
        typeof parsed.tabLastViewed === "object" && parsed.tabLastViewed !== null
          ? parsed.tabLastViewed
          : defaults.tabLastViewed,
      userName:
        typeof parsed.userName === "string"
          ? parsed.userName.trim().slice(0, 50)
          : defaults.userName,
      userAvatar:
        typeof parsed.userAvatar === "string" ? parsed.userAvatar.trim() : defaults.userAvatar,
      chatParallelView:
        typeof parsed.chatParallelView === "boolean"
          ? parsed.chatParallelView
          : defaults.chatParallelView,
      parallelLanes:
        Array.isArray(parsed.parallelLanes) && parsed.parallelLanes.length === 4
          ? parsed.parallelLanes.map((v) => (typeof v === "string" ? v : null))
          : defaults.parallelLanes,
    };
  } catch {
    return defaults;
  }
}

export function saveSettings(next: UiSettings) {
  localStorage.setItem(KEY, JSON.stringify(next));
}
