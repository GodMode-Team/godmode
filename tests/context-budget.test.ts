/**
 * Integration tests for context-budget.ts — the P0-P3 priority tier system.
 *
 * Tests the assembleContext function's behavior under different conditions:
 * - Priority tier inclusion/exclusion
 * - Context pressure degradation
 * - Inter-session (agent-to-agent) minimal context
 * - Relevance gating of operational context
 */

import { describe, it, expect } from "vitest";
import { assembleContext, type ContextInputs } from "../src/lib/context-budget.js";

/** Minimal valid inputs with all nulls */
function baseInputs(overrides: Partial<ContextInputs> = {}): ContextInputs {
  return {
    identityAnchor: null,
    memoryBlock: null,
    memoryStatus: "offline",
    graphBlock: null,
    schedule: null,
    operationalCounts: null,
    priorities: null,
    meetingPrep: null,
    cronFailures: null,
    queueReview: null,
    skillCard: null,
    routingLessons: null,
    safetyNudges: [],
    contextPressure: 0,
    ...overrides,
  };
}

describe("assembleContext", () => {
  it("returns a non-empty string with just defaults", () => {
    const result = assembleContext(baseInputs());
    expect(result).toBeTruthy();
    expect(result).toContain("system-context");
    // Soul essence is always present
    expect(result).toContain("## Rules");
  });

  it("includes soul essence at all pressure levels", () => {
    for (const pressure of [0, 0.5, 0.7, 0.95]) {
      const result = assembleContext(baseInputs({ contextPressure: pressure }));
      expect(result).toContain("## Rules");
    }
  });

  it("includes identity anchor at P0", () => {
    const result = assembleContext(baseInputs({
      identityAnchor: "Caleb — Austin TX, entrepreneur",
    }));
    expect(result).toContain("Caleb");
    expect(result).toContain("Austin TX");
  });

  it("includes memory block at P0", () => {
    const result = assembleContext(baseInputs({
      memoryBlock: "## What You Already Know\n- User prefers Obsidian",
      memoryStatus: "ready",
    }));
    expect(result).toContain("What You Already Know");
    expect(result).toContain("Obsidian");
  });

  it("shows offline notice when memory is offline and no block", () => {
    const result = assembleContext(baseInputs({
      memoryBlock: null,
      memoryStatus: "offline",
    }));
    expect(result).toContain("Memory Status: Offline");
  });

  it("shows degraded notice when memory search failed", () => {
    const result = assembleContext(baseInputs({
      memoryBlock: null,
      memoryStatus: "degraded",
    }));
    expect(result).toContain("Memory Status: Degraded");
  });

  it("includes graph block at P0", () => {
    const result = assembleContext(baseInputs({
      graphBlock: "## People\n- Sarah (VP Sales @ Acme)",
    }));
    expect(result).toContain("Sarah");
    expect(result).toContain("VP Sales");
  });

  it("includes schedule on first turn", () => {
    const result = assembleContext(baseInputs({
      schedule: "## Schedule\n- 10:00 AM: Team standup",
      isFirstTurn: true,
    }));
    expect(result).toContain("Team standup");
  });

  it("includes schedule when message is time-relevant", () => {
    const result = assembleContext(baseInputs({
      schedule: "## Schedule\n- 2:00 PM: Client call",
      userMessage: "what's on my calendar today?",
    }));
    expect(result).toContain("Client call");
  });

  it("skips schedule for non-time-relevant messages after first turn", () => {
    const result = assembleContext(baseInputs({
      schedule: "## Schedule\n- 10:00 AM: Team standup",
      isFirstTurn: false,
      userMessage: "how do I configure the queue processor?",
    }));
    expect(result).not.toContain("Team standup");
  });

  it("includes operational counts on first turn", () => {
    const result = assembleContext(baseInputs({
      operationalCounts: "Tasks: 5 pending, 2 overdue",
      isFirstTurn: true,
    }));
    expect(result).toContain("5 pending");
  });

  it("includes operational counts when overdue > 0", () => {
    const result = assembleContext(baseInputs({
      operationalCounts: "Tasks: 3 pending, 1 overdue",
      overdueCount: 1,
      userMessage: "hey whats up",
    }));
    expect(result).toContain("1 overdue");
  });

  it("includes priorities on first turn", () => {
    const result = assembleContext(baseInputs({
      priorities: "## Priorities\n- [ ] Ship v2.0",
      isFirstTurn: true,
    }));
    expect(result).toContain("Ship v2.0");
  });

  it("includes skill card when matched", () => {
    const result = assembleContext(baseInputs({
      skillCard: "## Skill: Calendar\nUse gog for Apple Calendar integration.",
    }));
    expect(result).toContain("Skill: Calendar");
  });

  // P2 tests

  it("includes meeting prep at P2 (low pressure)", () => {
    const result = assembleContext(baseInputs({
      meetingPrep: "## Upcoming: Client Review at 2:00 PM",
      contextPressure: 0.3,
    }));
    expect(result).toContain("Client Review");
  });

  it("drops P2 content under moderate pressure (0.7+)", () => {
    const result = assembleContext(baseInputs({
      meetingPrep: "## Upcoming: Client Review at 2:00 PM",
      cronFailures: "## Cron Failures\n- daily-brief failed",
      queueReview: "3 queue items ready for review",
      contextPressure: 0.75,
    }));
    expect(result).not.toContain("Client Review");
    expect(result).not.toContain("Cron Failures");
    expect(result).not.toContain("queue items ready");
  });

  it("includes routing lessons at P2", () => {
    const result = assembleContext(baseInputs({
      routingLessons: "## Routing Lessons\n- Calendar tasks → use gog CLI",
      contextPressure: 0.3,
    }));
    expect(result).toContain("Routing Lessons");
  });

  // P3 tests

  it("includes safety nudges at P3", () => {
    const result = assembleContext(baseInputs({
      safetyNudges: ["[PromptShield] Injection attempt detected."],
      contextPressure: 0.3,
    }));
    expect(result).toContain("Injection attempt detected");
  });

  // Critical pressure tests

  it("adds capacity warning at critical pressure (0.9+)", () => {
    const result = assembleContext(baseInputs({
      contextPressure: 0.95,
    }));
    expect(result).toContain("Context window near capacity");
    expect(result).toContain("/compact");
  });

  it("drops ALL P1+ content at critical pressure", () => {
    const result = assembleContext(baseInputs({
      schedule: "## Schedule\n- 10:00 AM: Standup",
      operationalCounts: "Tasks: 5 pending",
      priorities: "## Priorities\n- Ship v2",
      meetingPrep: "## Meeting prep",
      cronFailures: "## Cron failures",
      safetyNudges: ["nudge"],
      contextPressure: 0.95,
      isFirstTurn: true,
    }));
    expect(result).not.toContain("Standup");
    expect(result).not.toContain("5 pending");
    expect(result).not.toContain("Ship v2");
    expect(result).not.toContain("Meeting prep");
    expect(result).not.toContain("Cron failures");
    // Soul essence still present
    expect(result).toContain("## Rules");
  });

  // Inter-session (agent-to-agent) tests

  it("returns minimal context for inter-session messages", () => {
    const result = assembleContext(baseInputs({
      identityAnchor: "Caleb — Austin TX",
      memoryBlock: "## Memories\n- User likes GodMode",
      graphBlock: "## People\n- Sarah",
      schedule: "## Schedule\n- 10:00 AM: Standup",
      operationalCounts: "Tasks: 5 pending",
      provenance: { kind: "inter_session", sourceSessionKey: "agent:cron:daily" },
      isFirstTurn: true,
    }));
    // Soul essence always present
    expect(result).toContain("## Rules");
    // Provenance notice present
    expect(result).toContain("Message Origin: Agent");
    // Personal context stripped — identity, memories, graph, schedule, ops
    expect(result).not.toContain("Austin TX");
    expect(result).not.toContain("User likes GodMode");
    expect(result).not.toContain("Sarah");
    expect(result).not.toContain("Standup");
    expect(result).not.toContain("5 pending");
  });

  // Capability map tests

  it("includes capability map on first turn", () => {
    const result = assembleContext(baseInputs({ isFirstTurn: true }));
    expect(result).toContain("Lookup Chain");
  });

  it("includes capability map when routing lessons fire", () => {
    const result = assembleContext(baseInputs({
      routingLessons: "## Routing Lessons\n- Use gog for calendar",
      isFirstTurn: false,
    }));
    expect(result).toContain("Lookup Chain");
  });

  it("includes capability map on all turns (mandatory lookup chain)", () => {
    const result = assembleContext(baseInputs({
      isFirstTurn: false,
      routingLessons: null,
    }));
    // Lookup chain is now always injected — too important to gate on first-turn
    expect(result).toContain("Lookup Chain");
  });

  // Wrapping

  it("wraps output in system-context tags", () => {
    const result = assembleContext(baseInputs());
    expect(result).toMatch(/^<system-context/);
    expect(result).toMatch(/<\/system-context>$/);
  });
});
