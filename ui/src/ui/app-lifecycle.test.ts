import { describe, expect, it, vi } from "vitest";
import { handleUpdated } from "./app-lifecycle";
import type { UiSettings } from "./storage";
import type { SessionsListResult } from "./types";

function createSettings(): UiSettings {
  return {
    gatewayUrl: "",
    token: "",
    sessionKey: "webchat:foo",
    lastActiveSessionKey: "webchat:foo",
    theme: "system",
    chatFocusMode: false,
    chatShowThinking: true,
    splitRatio: 0.6,
    navCollapsed: false,
    navGroupsCollapsed: {},
    openTabs: ["webchat:foo", "agent:main:foo"],
    tabLastViewed: {
      "webchat:foo": 100,
      "agent:main:foo": 200,
    },
    userName: "",
    userAvatar: "",
    chatParallelView: false,
    parallelLanes: [null, null, null, null],
  };
}

function createSessionsResult(): SessionsListResult {
  return {
    ts: Date.now(),
    path: "sessions.json",
    count: 1,
    defaults: {
      model: null,
      contextTokens: null,
    },
    sessions: [
      {
        key: "agent:main:foo",
        kind: "direct",
        updatedAt: Date.now(),
      },
    ],
  };
}

function createDuplicateSessionIdSessionsResult(): SessionsListResult {
  return {
    ts: Date.now(),
    path: "sessions.json",
    count: 2,
    defaults: {
      model: null,
      contextTokens: null,
    },
    sessions: [
      {
        key: "agent:main:foo",
        kind: "direct",
        updatedAt: Date.now(),
        sessionId: "sess-foo",
      },
      {
        key: "agent:main:foo-alias",
        kind: "direct",
        updatedAt: Date.now() - 1,
        sessionId: "sess-foo",
      },
    ],
  };
}

describe("handleUpdated", () => {
  it("normalizes duplicate openTabs when settings change", () => {
    const settings = createSettings();
    const host = {
      basePath: "",
      tab: "chat" as const,
      connected: false,
      chatHasAutoScrolled: false,
      chatLoading: false,
      chatMessages: [],
      chatToolMessages: [],
      chatStream: "",
      logsAutoFollow: false,
      logsAtBottom: false,
      logsEntries: [],
      popStateHandler: () => {},
      keydownHandler: () => {},
      topbarObserver: null,
      settings,
      sessionKey: "webchat:foo",
      chatMessage: "",
      chatDrafts: {},
      chatStreamStartedAt: null,
      chatRunId: null,
      applySettings: vi.fn((next: UiSettings) => {
        host.settings = next;
      }),
      resetToolStream: () => {},
      resetChatScroll: () => {},
      loadAssistantIdentity: async () => {},
      sessionPickerOpen: false,
      sessionPickerClickOutsideHandler: null,
      sessionSearchOpen: false,
      sessionSearchClickOutsideHandler: null,
      sessionsResult: createSessionsResult(),
    };

    handleUpdated(
      host as unknown as Parameters<typeof handleUpdated>[0],
      new Map([["settings", {}]]),
    );

    expect(host.settings.openTabs).toEqual(["agent:main:foo"]);
    expect(host.settings.sessionKey).toBe("agent:main:foo");
    expect(host.settings.lastActiveSessionKey).toBe("agent:main:foo");
    expect(host.sessionKey).toBe("agent:main:foo");
  });

  it("deduplicates openTabs when multiple keys point to the same sessionId", () => {
    const host = {
      basePath: "",
      tab: "chat" as const,
      connected: false,
      chatHasAutoScrolled: false,
      chatLoading: false,
      chatMessages: [],
      chatToolMessages: [],
      chatStream: "",
      logsAutoFollow: false,
      logsAtBottom: false,
      logsEntries: [],
      popStateHandler: () => {},
      keydownHandler: () => {},
      topbarObserver: null,
      settings: {
        ...createSettings(),
        sessionKey: "agent:main:foo-alias",
        lastActiveSessionKey: "agent:main:foo-alias",
        openTabs: ["agent:main:foo", "agent:main:foo-alias"],
      },
      sessionKey: "agent:main:foo-alias",
      chatMessage: "",
      chatDrafts: {},
      chatStreamStartedAt: null,
      chatRunId: null,
      applySettings: vi.fn((next: UiSettings) => {
        host.settings = next;
      }),
      resetToolStream: () => {},
      resetChatScroll: () => {},
      loadAssistantIdentity: async () => {},
      sessionPickerOpen: false,
      sessionPickerClickOutsideHandler: null,
      sessionSearchOpen: false,
      sessionSearchClickOutsideHandler: null,
      sessionsResult: createDuplicateSessionIdSessionsResult(),
    };

    handleUpdated(
      host as unknown as Parameters<typeof handleUpdated>[0],
      new Map([["sessionsResult", null]]),
    );

    expect(host.settings.openTabs).toEqual(["agent:main:foo"]);
    expect(host.settings.sessionKey).toBe("agent:main:foo");
    expect(host.settings.lastActiveSessionKey).toBe("agent:main:foo");
    expect(host.sessionKey).toBe("agent:main:foo");
  });
});
