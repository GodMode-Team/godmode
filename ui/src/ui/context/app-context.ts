/**
 * Shared AppContext — the subset of app-level state that multiple tabs need.
 *
 * Provided once by the root GodModeApp element via ContextProvider.
 * Consumed by tab components via `consume({ context: appContext })`.
 */

import { createContext } from "@lit/context";
import type { ThemeMode, ResolvedTheme } from "../theme.js";
import type { UiSettings } from "../storage.js";
import type { Tab } from "../navigation.js";
import type { GatewayBrowserClient } from "../gateway.js";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface AppContext {
  // Connection
  connected: boolean;
  reconnecting: boolean;

  // Session
  sessionKey: string;

  // Identity
  assistantName: string;
  assistantAvatar: string | null;
  userName: string;
  userAvatar: string | null;

  // Theme
  theme: ThemeMode;
  themeResolved: ResolvedTheme;

  // Settings (read-only snapshot — mutate via saveSettings + event)
  settings: UiSettings;
  basePath: string;

  // Communication
  gateway: GatewayBrowserClient | null;
  send: (method: string, params?: unknown) => Promise<unknown>;

  // Navigation
  setTab: (tab: Tab) => void;

  // Toast notifications
  addToast: (message: string, variant?: string) => void;

  // Sidebar
  openSidebar: (opts: {
    content: string;
    title?: string;
    mimeType?: string;
    filePath?: string;
  }) => void;
  closeSidebar: () => void;
}

// ---------------------------------------------------------------------------
// Lit context key
// ---------------------------------------------------------------------------

export const appContext = createContext<AppContext>(Symbol("app-context"));

// ---------------------------------------------------------------------------
// Default / initial value (disconnected state)
// ---------------------------------------------------------------------------

const noop = () => {};
const noopAsync = () => Promise.resolve(undefined as unknown);

export function createDefaultAppContext(): AppContext {
  return {
    connected: false,
    reconnecting: false,
    sessionKey: "main",
    assistantName: "Prosper",
    assistantAvatar: null,
    userName: "",
    userAvatar: null,
    theme: "system",
    themeResolved: "dark",
    settings: {
      gatewayUrl: "",
      token: "",
      sessionKey: "main",
      lastActiveSessionKey: "",
      theme: "system",
      chatFocusMode: false,
      chatShowThinking: false,
      splitRatio: 0.6,
      navCollapsed: false,
      navGroupsCollapsed: {},
      openTabs: [],
      tabLastViewed: {},
      userName: "",
      userAvatar: "",
      chatParallelView: false,
      parallelLanes: [null, null, null, null],
    },
    basePath: "",
    gateway: null,
    send: noopAsync,
    setTab: noop,
    addToast: noop,
    openSidebar: noop,
    closeSidebar: noop,
  };
}
