/**
 * Tests for gather-context-inputs.ts — the shared context gathering pipeline.
 *
 * Tests that context inputs are properly gathered with caching,
 * provenance handling, and light mode.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("../src/lib/context-budget.js", () => ({
  getIdentityAnchor: vi.fn(async () => "TestUser — Austin TX, entrepreneur"),
}));

vi.mock("../src/lib/memory.js", () => ({
  isMemoryReady: vi.fn(() => false),
  getContext: vi.fn(async () => null),
  getMemoryStatus: vi.fn(() => "offline"),
}));

vi.mock("../src/lib/prompt-sanitizer.js", () => ({
  sanitizeForPrompt: vi.fn((text: string) => text),
}));

vi.mock("../src/lib/identity-graph.js", () => ({
  isGraphReady: vi.fn(() => false),
  queryGraph: vi.fn(() => []),
  formatGraphContext: vi.fn(() => null),
}));

vi.mock("../src/methods/brief-generator.js", () => ({
  fetchCalendarEvents: vi.fn(async () => ({ events: [] })),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test-data",
  GODMODE_ROOT: "/tmp/godmode-test",
  localDateString: vi.fn(() => "2026-03-23"),
}));

vi.mock("../src/methods/tasks.js", () => ({
  readTasks: vi.fn(async () => ({ tasks: [] })),
}));

vi.mock("../src/lib/queue-state.js", () => ({
  readQueueState: vi.fn(async () => ({ items: [] })),
}));

vi.mock("../src/lib/projects-state.js", () => ({
  readProjects: vi.fn(async () => ({ projects: [] })),
}));

vi.mock("../src/services/inbox.js", () => ({
  listInboxItems: vi.fn(async () => ({ items: [] })),
}));

vi.mock("../src/lib/action-items.js", () => ({
  actionItemBuffer: { drain: vi.fn(() => []) },
  formatActionItemsForContext: vi.fn(() => null),
}));

vi.mock("../src/lib/skill-cards.js", () => ({
  matchSkillCard: vi.fn(() => null),
  formatSkillCard: vi.fn(() => null),
}));

vi.mock("../src/lib/session-distiller.js", () => ({
  countPendingDrafts: vi.fn(() => 0),
}));

vi.mock("../src/lib/agent-lessons.js", () => ({
  getRoutingLessons: vi.fn(async () => []),
  formatRoutingLessons: vi.fn(() => null),
}));

vi.mock("../src/services/failure-notify.js", () => ({
  scanForFailures: vi.fn(async () => []),
  formatFailuresForSnapshot: vi.fn(() => null),
}));

vi.mock("../src/hooks/tool-grounding-gate.js", () => ({
  generateGroundingInstruction: vi.fn(() => null),
  logGroundingEvent: vi.fn(),
  TOOL_GROUNDING_DEFAULTS: {},
}));

vi.mock("../src/services/guardrails.js", () => ({
  readGuardrailsStateCached: vi.fn(async () => ({ gates: {} })),
}));

vi.mock("../src/hooks/team-bootstrap.js", () => ({
  handleTeamBootstrap: vi.fn(async () => null),
}));

vi.mock("../src/hooks/onboarding-context.js", () => ({
  loadOnboardingContext: vi.fn(async () => null),
}));

vi.mock("../src/lib/private-session.js", () => ({
  isPrivateSession: vi.fn(async () => false),
}));

vi.mock("../src/services/self-heal.js", () => ({
  getEscalationContext: vi.fn(() => null),
}));

vi.mock("../src/lib/restart-sentinel.js", () => ({
  getLastRestart: vi.fn(() => null),
  clearLastRestart: vi.fn(),
}));

vi.mock("../src/lib/health-ledger.js", () => ({
  turnErrors: { drain: vi.fn(() => []) },
  health: { signal: vi.fn() },
}));

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async () => { throw new Error("not found"); }),
  mkdir: vi.fn(async () => undefined),
}));

// ── Tests ────────────────────────────────────────────────────────────

describe("gatherContextInputs", () => {
  let gatherContextInputs: typeof import("../src/lib/gather-context-inputs.js").gatherContextInputs;
  const logger = { warn: vi.fn(), info: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/lib/gather-context-inputs.js");
    gatherContextInputs = mod.gatherContextInputs;
  });

  it("returns valid context inputs with minimal options", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: "test-session",
      userMessage: "What's on my calendar?",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
    });

    expect(inputs).toBeDefined();
    expect(inputs.identityAnchor).toContain("TestUser");
    expect(inputs.memoryStatus).toBe("offline");
    expect(inputs.contextPressure).toBe(0);
    expect(inputs.safetyNudges).toBeDefined();
    expect(Array.isArray(inputs.safetyNudges)).toBe(true);
  });

  it("skips memory for inter-session messages", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: "agent:cron:daily",
      userMessage: "Run daily brief",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
      provenance: { kind: "inter_session", sourceSessionKey: "agent:cron" },
    });

    expect(inputs.memoryBlock).toBeNull();
    expect(inputs.graphBlock).toBeNull();
  });

  it("uses suppressMemoryOfflineWarning", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: null,
      userMessage: "hello",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
      suppressMemoryOfflineWarning: true,
    });

    // When suppressed, default status is "ready" not "offline"
    expect(inputs.memoryStatus).toBe("ready");
  });

  it("light mode skips expensive gathering", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: "test-session",
      userMessage: "hello",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
      lightMode: true,
    });

    expect(inputs.memoryStatus).toBe("degraded");
    // Should still have identity anchor (P0)
    expect(inputs.identityAnchor).toBeTruthy();
  });

  it("passes through contextPressure and isFirstTurn", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: "test-session",
      userMessage: "hello",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
      contextPressure: 0.85,
      isFirstTurn: true,
    });

    expect(inputs.contextPressure).toBe(0.85);
    expect(inputs.isFirstTurn).toBe(true);
  });

  it("collects safety nudges from provider", async () => {
    const inputs = await gatherContextInputs({
      sessionKey: "test-session",
      userMessage: "hello",
      logger,
      pluginRoot: "/tmp/godmode-plugin",
      safetyNudgeProvider: () => ["[PromptShield] Injection detected"],
    });

    expect(inputs.safetyNudges.some((n) => n.includes("PromptShield"))).toBe(true);
  });
});
