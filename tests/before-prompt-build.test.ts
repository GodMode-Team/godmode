/**
 * Tests for before-prompt-build.ts — context injection hook.
 *
 * Tests the OC-specific wrapper that calls gatherContextInputs + assembleContext.
 * Heavy mocking — we test the orchestration, not the subsystems.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/lib/host-context.js", () => ({
  extractSessionKey: vi.fn(() => "test-session-key"),
  safeBroadcast: vi.fn(),
}));

vi.mock("../src/hooks/safety-gates.js", () => ({
  consumePromptShieldNudge: vi.fn(() => undefined),
  consumeOutputShieldNudge: vi.fn(() => undefined),
  consumeContextPressureNudge: vi.fn(() => undefined),
  getContextPressureLevel: vi.fn(() => 0),
}));

vi.mock("../src/hooks/lifecycle-hooks.js", () => ({
  isRecentlyOverloaded: vi.fn(() => false),
  lastReceivedMessage: null,
}));

vi.mock("../src/lib/auto-title.js", () => ({
  pendingAutoTitles: new Map(),
  titledSessions: new Set(),
  generateSessionTitle: vi.fn(async () => null),
  evictTitledSessions: vi.fn(),
}));

vi.mock("../src/lib/workspace-session-store.js", () => ({
  isCronSessionKey: vi.fn(() => false),
  loadConfig: vi.fn(async () => ({})),
  loadCombinedSessionStoreForGateway: vi.fn(async () => ({ store: {} })),
  updateSessionStore: vi.fn(async () => undefined),
  resolveAgentStorePath: vi.fn(() => "/tmp/agent-store.json"),
}));

vi.mock("../src/hooks/agent-persona.js", () => ({
  loadAgentPersona: vi.fn(async () => null),
}));

vi.mock("../src/lib/gather-context-inputs.js", () => ({
  gatherContextInputs: vi.fn(async () => ({
    identityAnchor: "TestUser — Austin TX",
    memoryBlock: null,
    memoryStatus: "offline",
    graphBlock: null,
    schedule: null,
    operationalCounts: null,
    priorities: null,
    meetingPrep: null,
    cronFailures: null,
    queueReview: null,
    teamStatus: null,
    actionItemsBlock: null,
    skillCard: null,
    skillDraftCount: 0,
    routingLessons: null,
    safetyNudges: [],
    contextPressure: 0,
    provenance: null,
    userMessage: "hello",
    isFirstTurn: true,
    overdueCount: 0,
  })),
}));

vi.mock("../src/lib/context-budget.js", () => ({
  assembleContext: vi.fn(() => "<system-context>Test context</system-context>"),
  getIdentityAnchor: vi.fn(async () => "TestUser — Austin TX"),
}));

// ── Tests ────────────────────────────────────────────────────────────

describe("handleBeforePromptBuild", () => {
  let handleBeforePromptBuild: typeof import("../src/hooks/before-prompt-build.js").handleBeforePromptBuild;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/hooks/before-prompt-build.js");
    handleBeforePromptBuild = mod.handleBeforePromptBuild;
  });

  const mockApi = {
    logger: { warn: vi.fn(), info: vi.fn() },
    broadcast: vi.fn(),
  } as any;

  const mockEvent = {
    prompt: "",
    messages: [{ role: "user", content: "hello" }],
  };

  const mockCtx = {
    sessionKey: "test-session-key",
  };

  it("returns prependContext with assembled context", async () => {
    const result = await handleBeforePromptBuild(
      mockEvent as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    expect(result).toBeDefined();
    expect(result?.prependContext).toContain("system-context");
  });

  it("calls gatherContextInputs with correct parameters", async () => {
    const { gatherContextInputs } = await import("../src/lib/gather-context-inputs.js");

    await handleBeforePromptBuild(
      mockEvent as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    expect(gatherContextInputs).toHaveBeenCalled();
    const callArgs = (gatherContextInputs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.pluginRoot).toBe("/tmp/godmode-plugin");
    expect(callArgs.sessionKey).toBe("test-session-key");
  });

  it("calls assembleContext with gathered inputs", async () => {
    const { assembleContext } = await import("../src/lib/context-budget.js");

    await handleBeforePromptBuild(
      mockEvent as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    expect(assembleContext).toHaveBeenCalled();
  });

  it("returns undefined when assembleContext returns falsy", async () => {
    const { assembleContext } = await import("../src/lib/context-budget.js");
    (assembleContext as ReturnType<typeof vi.fn>).mockReturnValue("");

    const result = await handleBeforePromptBuild(
      mockEvent as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    expect(result).toBeUndefined();
  });

  it("detects first turn from message count", async () => {
    const { gatherContextInputs } = await import("../src/lib/gather-context-inputs.js");

    // Single user message = first turn
    await handleBeforePromptBuild(
      { prompt: "", messages: [{ role: "user", content: "first message" }] } as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    const callArgs = (gatherContextInputs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.isFirstTurn).toBe(true);
  });

  it("detects non-first turn from message count", async () => {
    const { gatherContextInputs } = await import("../src/lib/gather-context-inputs.js");

    await handleBeforePromptBuild(
      {
        prompt: "",
        messages: [
          { role: "user", content: "first" },
          { role: "assistant", content: "response" },
          { role: "user", content: "second" },
        ],
      } as any,
      mockCtx as any,
      mockApi,
      "/tmp/godmode-plugin",
    );

    const callArgs = (gatherContextInputs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.isFirstTurn).toBe(false);
  });
});
