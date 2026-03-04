import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applySettings, setTabFromRoute } from "./app-settings";
import type { Tab } from "./navigation";

type SettingsHost = Parameters<typeof setTabFromRoute>[0] & {
  logsPollInterval: number | null;
  debugPollInterval: number | null;
};

const createHost = (tab: Tab): SettingsHost => ({
  settings: {
    gatewayUrl: "",
    token: "",
    sessionKey: "main",
    lastActiveSessionKey: "main",
    theme: "system",
    chatFocusMode: false,
    chatShowThinking: true,
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
  theme: "system",
  themeResolved: "dark",
  applySessionKey: "main",
  sessionKey: "main",
  tab,
  connected: false,
  chatHasAutoScrolled: false,
  logsAtBottom: false,
  eventLog: [],
  basePath: "",
  themeMedia: null,
  themeMediaHandler: null,
  logsPollInterval: null,
  debugPollInterval: null,
});

describe("setTabFromRoute", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts and stops log polling based on the tab", () => {
    const host = createHost("chat");

    setTabFromRoute(host, "logs");
    expect(host.logsPollInterval).not.toBeNull();
    expect(host.debugPollInterval).toBeNull();

    setTabFromRoute(host, "chat");
    expect(host.logsPollInterval).toBeNull();
  });

  it("starts and stops debug polling based on the tab", () => {
    const host = createHost("chat");

    setTabFromRoute(host, "debug");
    expect(host.debugPollInterval).not.toBeNull();
    expect(host.logsPollInterval).toBeNull();

    setTabFromRoute(host, "chat");
    expect(host.debugPollInterval).toBeNull();
  });
});

describe("applySettings", () => {
  it("deduplicates and trims openTabs and tabLastViewed keys", () => {
    const host = createHost("chat");

    applySettings(host, {
      ...host.settings,
      sessionKey: "agent:main:main",
      lastActiveSessionKey: " ",
      openTabs: [" agent:main:main ", "agent:main:main", "webchat:foo ", "webchat:foo"],
      tabLastViewed: {
        " webchat:foo ": 100,
        "webchat:foo": 200,
        "": 999,
      },
    });

    expect(host.settings.openTabs).toEqual(["agent:main:main", "webchat:foo"]);
    expect(host.settings.lastActiveSessionKey).toBe("agent:main:main");
    expect(host.settings.tabLastViewed).toEqual({ "webchat:foo": 200 });
  });

  it("uses sessionKey when openTabs is empty", () => {
    const host = createHost("chat");

    applySettings(host, {
      ...host.settings,
      sessionKey: "agent:main:new-session",
      openTabs: [],
    });

    expect(host.settings.openTabs).toEqual(["agent:main:new-session"]);
  });
});
