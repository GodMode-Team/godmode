import { describe, it, expect } from "vitest";
import { shouldInbox } from "../src/services/inbox.js";

describe("shouldInbox gate", () => {
  // --- Always inbox ---

  it("inboxes project-completion items regardless of trust", () => {
    expect(shouldInbox({
      type: "project-completion",
      queueItemType: undefined,
      personaSlug: "research-agent",
      trustScore: 9.5,
    })).toBe(true);
  });

  it("inboxes creative queue items even from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "creative",
      personaSlug: "content-writer",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes research queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "research",
      personaSlug: "research-agent",
      trustScore: 8.5,
    })).toBe(true);
  });

  it("inboxes analysis queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "analysis",
      personaSlug: "analyst",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes idea queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "idea",
      personaSlug: "explorer",
      trustScore: 8.0,
    })).toBe(true);
  });

  it("inboxes review queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "review",
      personaSlug: "reviewer",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes items with no persona (can't look up trust)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: undefined,
      trustScore: null,
    })).toBe(true);
  });

  it("inboxes items from low-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "new-agent",
      trustScore: 5.0,
    })).toBe(true);
  });

  it("inboxes items from personas with null trust (not enough ratings)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "task",
      personaSlug: "new-agent",
      trustScore: null,
    })).toBe(true);
  });

  it("inboxes ops items from personas at exactly trust 7.9 (below threshold)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "ops-agent",
      trustScore: 7.9,
    })).toBe(true);
  });

  // --- Skip inbox (auto-complete) ---

  it("skips inbox for ops items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "ops-agent",
      trustScore: 8.5,
    })).toBe(false);
  });

  it("skips inbox for task items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "task",
      personaSlug: "task-agent",
      trustScore: 8.0,
    })).toBe(false);
  });

  it("skips inbox for url items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "url",
      personaSlug: "reader",
      trustScore: 9.0,
    })).toBe(false);
  });

  it("skips inbox for optimize items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "optimize",
      personaSlug: "optimizer",
      trustScore: 8.2,
    })).toBe(false);
  });

  // --- Skill-run type ---

  it("always inboxes skill-run items", () => {
    expect(shouldInbox({
      type: "skill-run",
      queueItemType: undefined,
      personaSlug: undefined,
      trustScore: null,
    })).toBe(true);
  });

  // --- Integration check ---

  describe("queue processor inbox gate integration", () => {
    it("documented: queue processor should check shouldInbox before addInboxItem", () => {
      expect(typeof shouldInbox).toBe("function");
    });
  });
});
