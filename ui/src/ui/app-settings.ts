import type { GodModeApp } from "./app";
import { refreshChat } from "./app-chat";
import { getEventLogSnapshot } from "./app-gateway";
import {
  startLogsPolling,
  stopLogsPolling,
  startNodesPolling,
  stopNodesPolling,
  startDebugPolling,
  stopDebugPolling,
  startMissionControlPolling,
  stopMissionControlPolling,
} from "./app-polling";
import { scheduleChatScroll, scheduleLogsScroll } from "./app-scroll";
import { loadChannels } from "./controllers/channels";
import { loadConfig, loadConfigSchema } from "./controllers/config";
import { loadCronJobs, loadCronStatus } from "./controllers/cron";
import { loadDebug } from "./controllers/debug";
import { loadGuardrails } from "./controllers/guardrails";
import { loadDevices } from "./controllers/devices";
import { loadExecApprovals } from "./controllers/exec-approvals";
import { loadLifetracks } from "./controllers/lifetracks";
import { loadLogs } from "./controllers/logs";
import { loadMyDay } from "./controllers/my-day";
import { loadNodes } from "./controllers/nodes";
import { loadPeople } from "./controllers/people";
import { loadPresence } from "./controllers/presence";
import { loadArchivedSessions, loadSessions } from "./controllers/sessions";
import { loadSkills } from "./controllers/skills";
import { loadVisionBoard } from "./controllers/vision-board";
import { loadWheelOfLife } from "./controllers/wheel-of-life";
import { loadWork } from "./controllers/work";
import { loadWorkspaces } from "./controllers/workspaces";
import {
  inferBasePathFromPathname,
  normalizeBasePath,
  normalizePath,
  pathForTab,
  tabFromPath,
  type Tab,
} from "./navigation";
import { saveSettings, type UiSettings } from "./storage";
import { initParticles, destroyParticles } from "./particles";
import { resolveTheme, type ResolvedTheme, type ThemeMode } from "./theme";
import { startThemeTransition, type ThemeTransitionContext } from "./theme-transition";

type SettingsHost = {
  settings: UiSettings;
  theme: ThemeMode;
  themeResolved: ResolvedTheme;
  applySessionKey: string;
  sessionKey: string;
  tab: Tab;
  connected: boolean;
  chatHasAutoScrolled: boolean;
  logsAtBottom: boolean;
  eventLog: unknown[];
  basePath: string;
  themeMedia: MediaQueryList | null;
  themeMediaHandler: ((event: MediaQueryListEvent) => void) | null;
  pendingGatewayUrl?: string | null;
};

function normalizeOpenTabs(openTabs: string[] | undefined, sessionKey: string): string[] {
  const deduped = Array.isArray(openTabs)
    ? [...new Set(openTabs.map((key) => key.trim()).filter((key) => key.length > 0))]
    : [];
  if (deduped.length === 0) {
    deduped.push(sessionKey || "main");
  }
  return deduped;
}

function normalizeTabLastViewed(
  tabLastViewed: Record<string, number> | undefined,
): Record<string, number> {
  const normalized: Record<string, number> = {};
  if (!tabLastViewed || typeof tabLastViewed !== "object") {
    return normalized;
  }
  for (const [rawKey, rawTimestamp] of Object.entries(tabLastViewed)) {
    const key = rawKey.trim();
    if (!key || typeof rawTimestamp !== "number" || !Number.isFinite(rawTimestamp)) {
      continue;
    }
    normalized[key] = Math.max(normalized[key] ?? 0, rawTimestamp);
  }
  return normalized;
}

export function applySettings(host: SettingsHost, next: UiSettings) {
  const sessionKey = next.sessionKey.trim() || "main";
  const openTabs = normalizeOpenTabs(next.openTabs, sessionKey);
  const tabLastViewed = normalizeTabLastViewed(next.tabLastViewed);
  const normalized = {
    ...next,
    sessionKey,
    openTabs,
    tabLastViewed,
    lastActiveSessionKey: next.lastActiveSessionKey?.trim() || sessionKey,
  };
  host.settings = normalized;
  saveSettings(normalized);
  if (normalized.theme !== host.theme) {
    host.theme = normalized.theme;
    applyResolvedTheme(host, resolveTheme(normalized.theme));
  }
  host.applySessionKey = host.settings.lastActiveSessionKey;
}

export function setLastActiveSessionKey(host: SettingsHost, next: string) {
  const trimmed = next.trim();
  if (!trimmed) {
    return;
  }
  if (host.settings.lastActiveSessionKey === trimmed) {
    return;
  }
  applySettings(host, { ...host.settings, lastActiveSessionKey: trimmed });
}

export function applySettingsFromUrl(host: SettingsHost) {
  if (!window.location.search) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const tokenRaw = params.get("token");
  const passwordRaw = params.get("password");
  const sessionRaw = params.get("session");
  const gatewayUrlRaw = params.get("gatewayUrl");
  let shouldCleanUrl = false;

  if (tokenRaw != null) {
    const token = tokenRaw.trim();
    if (token && token !== host.settings.token) {
      applySettings(host, { ...host.settings, token });
    }
    params.delete("token");
    shouldCleanUrl = true;
  }

  if (passwordRaw != null) {
    const password = passwordRaw.trim();
    if (password) {
      (host as { password: string }).password = password;
    }
    params.delete("password");
    shouldCleanUrl = true;
  }

  if (sessionRaw != null) {
    const session = sessionRaw.trim();
    if (session) {
      host.sessionKey = session;
      // Ensure session is in openTabs
      const openTabs = host.settings.openTabs.includes(session)
        ? host.settings.openTabs
        : [...host.settings.openTabs, session];
      applySettings(host, {
        ...host.settings,
        sessionKey: session,
        lastActiveSessionKey: session,
        openTabs,
      });
    }
  }

  if (gatewayUrlRaw != null) {
    const gatewayUrl = gatewayUrlRaw.trim();
    if (gatewayUrl && gatewayUrl !== host.settings.gatewayUrl) {
      host.pendingGatewayUrl = gatewayUrl;
    }
    params.delete("gatewayUrl");
    shouldCleanUrl = true;
  }

  if (!shouldCleanUrl) {
    return;
  }
  const url = new URL(window.location.href);
  url.search = params.toString();
  window.history.replaceState({}, "", url.toString());
}

export function setTab(host: SettingsHost, next: Tab) {
  const prev = host.tab;
  if (prev !== next) {
    host.tab = next;
  }

  // Restore stashed session when leaving dashboards tab with an active dashboard
  if (prev === "dashboards" && next !== "dashboards") {
    const app = host as unknown as {
      dashboardPreviousSessionKey?: string | null;
      activeDashboardId?: string | null;
      activeDashboardManifest?: unknown | null;
      activeDashboardHtml?: string | null;
      dashboardChatOpen?: boolean;
    };
    if (app.dashboardPreviousSessionKey && app.activeDashboardId) {
      const prevKey = app.dashboardPreviousSessionKey;
      app.dashboardPreviousSessionKey = null;
      app.activeDashboardId = null;
      app.activeDashboardManifest = null;
      app.activeDashboardHtml = null;
      app.dashboardChatOpen = false;
      host.sessionKey = prevKey;
    }
  }

  if (next === "chat") {
    host.chatHasAutoScrolled = false;
  }
  if (next === "nodes") {
    startNodesPolling(host as unknown as Parameters<typeof startNodesPolling>[0]);
  } else {
    stopNodesPolling(host as unknown as Parameters<typeof stopNodesPolling>[0]);
  }
  if (next === "logs") {
    startLogsPolling(host as unknown as Parameters<typeof startLogsPolling>[0]);
  } else {
    stopLogsPolling(host as unknown as Parameters<typeof stopLogsPolling>[0]);
  }
  if (next === "debug") {
    startDebugPolling(host as unknown as Parameters<typeof startDebugPolling>[0]);
  } else {
    stopDebugPolling(host as unknown as Parameters<typeof stopDebugPolling>[0]);
  }
  if (next === "mission-control") {
    startMissionControlPolling(host as unknown as Parameters<typeof startMissionControlPolling>[0]);
  } else {
    stopMissionControlPolling(host as unknown as Parameters<typeof stopMissionControlPolling>[0]);
  }
  void refreshActiveTab(host);
  syncUrlWithTab(host, next, false);
}

export function setTheme(host: SettingsHost, next: ThemeMode, context?: ThemeTransitionContext) {
  const applyTheme = () => {
    host.theme = next;
    applySettings(host, { ...host.settings, theme: next });
    applyResolvedTheme(host, resolveTheme(next));
  };
  startThemeTransition({
    nextTheme: next,
    applyTheme,
    context,
    currentTheme: host.theme,
  });
}

export async function refreshActiveTab(host: SettingsHost) {
  if (host.tab === "overview") {
    await loadOverview(host);
  }
  if (host.tab === "today" || host.tab === "my-day") {
    await loadMyDay(host as unknown as GodModeApp);
  }
  if (host.tab === "work") {
    await loadWork(host as unknown as GodModeApp);
  }
  if (host.tab === "people") {
    await loadPeople(host as unknown as GodModeApp);
  }
  if (host.tab === "workspaces") {
    await loadWorkspaces(host as unknown as GodModeApp);
    // Load all tasks for the workspaces landing page
    import("./controllers/workspaces").then(async ({ loadAllTasksWithQueueStatus }) => {
      (host as unknown as GodModeApp).allTasks = await loadAllTasksWithQueueStatus(
        host as unknown as GodModeApp,
      );
    });
  }
  if (host.tab === "wheel-of-life") {
    await loadWheelOfLife(host as unknown as GodModeApp);
  }
  if (host.tab === "vision-board") {
    await loadVisionBoard(host as unknown as GodModeApp);
  }
  if (host.tab === "lifetracks") {
    await loadLifetracks(host as unknown as GodModeApp);
  }
  if (host.tab === "life") {
    await Promise.all([
      loadWheelOfLife(host as unknown as GodModeApp),
      loadVisionBoard(host as unknown as GodModeApp),
      loadLifetracks(host as unknown as GodModeApp),
    ]);
    // Goals are loaded on-demand when the subtab is selected (see handleLifeSubtabChange)
  }
  if (host.tab === "data") {
    const app = host as unknown as GodModeApp;
    void app.handleDataRefresh();
  }
  if (host.tab === "channels") {
    await loadChannelsTab(host);
  }
  if (host.tab === "instances") {
    await loadPresence(host as unknown as GodModeApp);
  }
  if (host.tab === "sessions") {
    await loadSessions(host as unknown as GodModeApp);
    await loadArchivedSessions(host as unknown as GodModeApp);
  }
  if (host.tab === "cron") {
    await loadCron(host);
  }
  if (host.tab === "skills") {
    await loadSkills(host as unknown as GodModeApp);
  }
  if (host.tab === "nodes") {
    await loadNodes(host as unknown as GodModeApp);
    await loadDevices(host as unknown as GodModeApp);
    await loadConfig(host as unknown as GodModeApp);
    await loadExecApprovals(host as unknown as GodModeApp);
  }
  if (host.tab === "chat") {
    await refreshChat(host as unknown as Parameters<typeof refreshChat>[0]);
    scheduleChatScroll(
      host as unknown as Parameters<typeof scheduleChatScroll>[0],
      !host.chatHasAutoScrolled,
    );
  }
  if (host.tab === "options") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleOptionsLoad === "function") {
      await app.handleOptionsLoad();
    }
  }
  if (host.tab === "trust") {
    const app = host as unknown as GodModeApp;
    const loads: Promise<void>[] = [];
    if (typeof app.handleTrustLoad === "function") {
      loads.push(app.handleTrustLoad());
    }
    loads.push(loadGuardrails(app));
    loads.push(loadSessions(app));
    await Promise.all(loads);
  }
  if (host.tab === "guardrails") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleGuardrailsLoad === "function") {
      await app.handleGuardrailsLoad();
    }
  }
  if (host.tab === "mission-control") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleMissionControlRefresh === "function") {
      await app.handleMissionControlRefresh();
    }
  }
  if (host.tab === "setup") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleLoadSetupChecklist === "function") {
      app.handleLoadSetupChecklist();
    }
  }
  if (host.tab === "dashboards") {
    const app = host as unknown as GodModeApp;
    if (typeof app.handleDashboardsRefresh === "function") {
      await app.handleDashboardsRefresh();
    }
  }
  if (host.tab === "second-brain") {
    const app = host as unknown as GodModeApp;
    const subtab = (app as unknown as { secondBrainSubtab?: string }).secondBrainSubtab;
    if (subtab === "intel") {
      if (typeof app.handleIntelLoad === "function") {
        await app.handleIntelLoad();
      }
    } else if (subtab === "files") {
      if (typeof app.handleSecondBrainFileTreeRefresh === "function") {
        await app.handleSecondBrainFileTreeRefresh();
      }
    } else if (typeof app.handleSecondBrainRefresh === "function") {
      await app.handleSecondBrainRefresh();
    }
  }
  if (host.tab === "config") {
    await loadConfigSchema(host as unknown as GodModeApp);
    await loadConfig(host as unknown as GodModeApp);
  }
  if (host.tab === "debug") {
    await loadDebug(host as unknown as GodModeApp);
    host.eventLog = getEventLogSnapshot();
  }
  if (host.tab === "logs") {
    host.logsAtBottom = true;
    await loadLogs(host as unknown as GodModeApp, { reset: true });
    scheduleLogsScroll(host as unknown as Parameters<typeof scheduleLogsScroll>[0], true);
  }
}

export function inferBasePath() {
  if (typeof window === "undefined") {
    return "";
  }
  const configured = window.__OPENCLAW_CONTROL_UI_BASE_PATH__;
  if (typeof configured === "string" && configured.trim()) {
    return normalizeBasePath(configured);
  }
  return inferBasePathFromPathname(window.location.pathname);
}

export function syncThemeWithSettings(host: SettingsHost) {
  host.theme = host.settings.theme ?? "system";
  applyResolvedTheme(host, resolveTheme(host.theme));
}

export function applyResolvedTheme(host: SettingsHost, resolved: ResolvedTheme) {
  host.themeResolved = resolved;
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved === "dark" ? "dark" : "light";

  // Quantum particles — only active in lifetrack theme
  if (resolved === "lifetrack") {
    initParticles();
  } else {
    destroyParticles();
  }
}

export function attachThemeListener(host: SettingsHost) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return;
  }
  host.themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  host.themeMediaHandler = (event) => {
    if (host.theme !== "system") {
      return;
    }
    applyResolvedTheme(host, event.matches ? "dark" : "lifetrack");
  };
  if (typeof host.themeMedia.addEventListener === "function") {
    host.themeMedia.addEventListener("change", host.themeMediaHandler);
    return;
  }
  const legacy = host.themeMedia as MediaQueryList & {
    addListener: (cb: (event: MediaQueryListEvent) => void) => void;
  };
  legacy.addListener(host.themeMediaHandler);
}

export function detachThemeListener(host: SettingsHost) {
  if (!host.themeMedia || !host.themeMediaHandler) {
    return;
  }
  if (typeof host.themeMedia.removeEventListener === "function") {
    host.themeMedia.removeEventListener("change", host.themeMediaHandler);
    return;
  }
  const legacy = host.themeMedia as MediaQueryList & {
    removeListener: (cb: (event: MediaQueryListEvent) => void) => void;
  };
  legacy.removeListener(host.themeMediaHandler);
  host.themeMedia = null;
  host.themeMediaHandler = null;
}

export function syncTabWithLocation(host: SettingsHost, replace: boolean) {
  if (typeof window === "undefined") {
    return;
  }
  const resolved = tabFromPath(window.location.pathname, host.basePath) ?? "chat";
  setTabFromRoute(host, resolved);
  syncUrlWithTab(host, resolved, replace);
}

export function onPopState(host: SettingsHost) {
  if (typeof window === "undefined") {
    return;
  }
  const resolved = tabFromPath(window.location.pathname, host.basePath);
  if (!resolved) {
    return;
  }

  const url = new URL(window.location.href);
  const session = url.searchParams.get("session")?.trim();
  if (session) {
    host.sessionKey = session;
    // Ensure session is in openTabs
    const openTabs = host.settings.openTabs.includes(session)
      ? host.settings.openTabs
      : [...host.settings.openTabs, session];
    applySettings(host, {
      ...host.settings,
      sessionKey: session,
      lastActiveSessionKey: session,
      openTabs,
    });
  }

  setTabFromRoute(host, resolved);
}

export function setTabFromRoute(host: SettingsHost, next: Tab) {
  if (host.tab !== next) {
    host.tab = next;
  }
  if (next === "chat") {
    host.chatHasAutoScrolled = false;
  }
  if (next === "nodes") {
    startNodesPolling(host as unknown as Parameters<typeof startNodesPolling>[0]);
  } else {
    stopNodesPolling(host as unknown as Parameters<typeof stopNodesPolling>[0]);
  }
  if (next === "logs") {
    startLogsPolling(host as unknown as Parameters<typeof startLogsPolling>[0]);
  } else {
    stopLogsPolling(host as unknown as Parameters<typeof stopLogsPolling>[0]);
  }
  if (next === "debug") {
    startDebugPolling(host as unknown as Parameters<typeof startDebugPolling>[0]);
  } else {
    stopDebugPolling(host as unknown as Parameters<typeof stopDebugPolling>[0]);
  }
  if (next === "mission-control") {
    startMissionControlPolling(host as unknown as Parameters<typeof startMissionControlPolling>[0]);
  } else {
    stopMissionControlPolling(host as unknown as Parameters<typeof stopMissionControlPolling>[0]);
  }
  if (host.connected) {
    void refreshActiveTab(host);
  }
}

export function syncUrlWithTab(host: SettingsHost, tab: Tab, replace: boolean) {
  if (typeof window === "undefined") {
    return;
  }
  const targetPath = normalizePath(pathForTab(tab, host.basePath));
  const currentPath = normalizePath(window.location.pathname);
  const url = new URL(window.location.href);

  if (tab === "chat" && host.sessionKey) {
    url.searchParams.set("session", host.sessionKey);
  } else {
    url.searchParams.delete("session");
  }

  if (currentPath !== targetPath) {
    url.pathname = targetPath;
  }

  if (replace) {
    window.history.replaceState({}, "", url.toString());
  } else {
    window.history.pushState({}, "", url.toString());
  }
}

export function syncUrlWithSessionKey(host: SettingsHost, sessionKey: string, replace: boolean) {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.set("session", sessionKey);
  if (replace) {
    window.history.replaceState({}, "", url.toString());
  } else {
    window.history.pushState({}, "", url.toString());
  }
}

export async function loadOverview(host: SettingsHost) {
  await Promise.all([
    loadChannels(host as unknown as GodModeApp, false),
    loadPresence(host as unknown as GodModeApp),
    loadSessions(host as unknown as GodModeApp),
    loadCronStatus(host as unknown as GodModeApp),
    loadDebug(host as unknown as GodModeApp),
  ]);
}

export async function loadChannelsTab(host: SettingsHost) {
  await Promise.all([
    loadChannels(host as unknown as GodModeApp, true),
    loadConfigSchema(host as unknown as GodModeApp),
    loadConfig(host as unknown as GodModeApp),
  ]);
}

export async function loadCron(host: SettingsHost) {
  await Promise.all([
    loadChannels(host as unknown as GodModeApp, false),
    loadCronStatus(host as unknown as GodModeApp),
    loadCronJobs(host as unknown as GodModeApp),
  ]);
}
