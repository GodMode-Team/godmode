/**
 * Tests for action-items.ts — extraction, session buffer, context formatting.
 *
 * Pure functions and in-memory buffer — no mocks needed.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  extractActionItems,
  actionItemBuffer,
  formatActionItemsForContext,
  type ActionItem,
} from "../src/lib/action-items.js";

// ── extractActionItems ──────────────────────────────────────────────

describe("extractActionItems", () => {
  it("returns empty for short messages (<15 chars)", () => {
    expect(extractActionItems("hi there")).toEqual([]);
    expect(extractActionItems("ok")).toEqual([]);
    expect(extractActionItems("")).toEqual([]);
  });

  it("returns empty for simple questions", () => {
    expect(extractActionItems("How do I configure my workspace?")).toEqual([]);
    expect(extractActionItems("What is GodMode?")).toEqual([]);
    expect(extractActionItems("Can you explain that?")).toEqual([]);
  });

  it('extracts "I need to" patterns as high confidence task', () => {
    const items = extractActionItems(
      "I need to finish the quarterly report for the board meeting."
    );
    expect(items.length).toBe(1);
    expect(items[0].confidence).toBe("high");
    expect(items[0].intent).toBe("task");
    expect(items[0].title).toContain("finish the quarterly report");
  });

  it('extracts "remind me to" patterns', () => {
    const items = extractActionItems(
      "Remind me to call the dentist about my appointment."
    );
    expect(items.length).toBe(1);
    expect(items[0].confidence).toBe("high");
    expect(items[0].intent).toBe("task");
    expect(items[0].title).toContain("call the dentist");
  });

  it('extracts "I should" patterns as medium confidence', () => {
    const items = extractActionItems(
      "I should probably update the documentation for the new API endpoints."
    );
    expect(items.length).toBe(1);
    expect(items[0].confidence).toBe("medium");
    expect(items[0].intent).toBe("task");
  });

  it('extracts "I\'m thinking about" as medium confidence exploration', () => {
    const items = extractActionItems(
      "I'm thinking about switching to a different hosting provider for the app."
    );
    expect(items.length).toBe(1);
    expect(items[0].confidence).toBe("medium");
    expect(items[0].intent).toBe("exploration");
  });

  it('extracts "I\'m worried about" as medium confidence concern', () => {
    const items = extractActionItems(
      "I'm worried about the deployment timeline slipping again."
    );
    expect(items.length).toBe(1);
    expect(items[0].confidence).toBe("medium");
    expect(items[0].intent).toBe("concern");
  });

  it("detects urgent markers", () => {
    const items = extractActionItems(
      "I need to fix the production bug asap before customers notice."
    );
    expect(items.length).toBe(1);
    expect(items[0].urgency).toBe("urgent");
  });

  it("detects urgency from 'today' and 'critical'", () => {
    const items = extractActionItems(
      "I must deploy the critical hotfix to production servers today."
    );
    expect(items.length).toBe(1);
    expect(items[0].urgency).toBe("urgent");
  });

  it("defaults to normal urgency when no markers present", () => {
    const items = extractActionItems(
      "I need to refactor the authentication module sometime."
    );
    expect(items.length).toBe(1);
    expect(items[0].urgency).toBe("normal");
  });

  it("extracts deadline hints", () => {
    const items = extractActionItems(
      "I need to submit the proposal by Friday before the deadline."
    );
    expect(items.length).toBe(1);
    expect(items[0].deadlineHint).toMatch(/by friday/i);
  });

  it("extracts 'this week' deadline hint", () => {
    const items = extractActionItems(
      "I have to finish the sprint review slides this week for sure."
    );
    expect(items.length).toBe(1);
    expect(items[0].deadlineHint).toMatch(/this week/i);
  });

  it("returns null deadlineHint when none detected", () => {
    const items = extractActionItems(
      "I need to clean up the codebase at some point eventually."
    );
    expect(items.length).toBe(1);
    expect(items[0].deadlineHint).toBeNull();
  });

  it("deduplicates similar items with same key prefix", () => {
    // Dedup key is first 40 chars of lowercased cleaned title
    // Both "I need to" and "I have to" capture the same text after the trigger
    const items = extractActionItems(
      "I need to update the project documentation. I have to update the project documentation."
    );
    expect(items.length).toBe(1);
  });

  it("caps at 8 items max", () => {
    const msg = [
      "I need to fix the login page styling issue.",
      "I have to update the API documentation soon.",
      "I must review the pull requests today.",
      "I need to deploy the staging environment.",
      "I have to write the integration tests.",
      "I must refactor the database queries.",
      "I need to update the CI/CD pipeline.",
      "I have to migrate the old user data.",
      "I must configure the monitoring alerts.",
      "I need to schedule the team retrospective.",
    ].join(" ");
    const items = extractActionItems(msg);
    expect(items.length).toBeLessThanOrEqual(8);
  });

  it("handles multiple patterns in one message", () => {
    const items = extractActionItems(
      "I need to review the contracts. I'm worried about the pricing changes. I'm thinking about switching vendors."
    );
    expect(items.length).toBe(3);
    const intents = items.map((i) => i.intent);
    expect(intents).toContain("task");
    expect(intents).toContain("concern");
    expect(intents).toContain("exploration");
  });

  it("includes source field with original matched text", () => {
    const items = extractActionItems(
      "I need to send the invoice to the client before end of day."
    );
    expect(items.length).toBe(1);
    expect(items[0].source).toBeTruthy();
    expect(items[0].source.length).toBeGreaterThan(0);
  });
});

// ── actionItemBuffer ────────────────────────────────────────────────

describe("actionItemBuffer", () => {
  const SESSION = `test-session-${Date.now()}`;

  beforeEach(() => {
    // Drain to ensure clean state
    actionItemBuffer.drain(SESSION);
  });

  const makeItem = (title: string, intent: ActionItem["intent"] = "task"): ActionItem => ({
    title,
    confidence: "high",
    intent,
    urgency: "normal",
    deadlineHint: null,
    source: `I need to ${title}`,
  });

  it("add + drain returns items", () => {
    const items = [makeItem("write tests"), makeItem("deploy app")];
    actionItemBuffer.add(SESSION, items);
    const drained = actionItemBuffer.drain(SESSION);
    expect(drained).toHaveLength(2);
    expect(drained[0].title).toBe("write tests");
    expect(drained[1].title).toBe("deploy app");
  });

  it("drain clears buffer", () => {
    actionItemBuffer.add(SESSION, [makeItem("first task")]);
    actionItemBuffer.drain(SESSION);
    const second = actionItemBuffer.drain(SESSION);
    expect(second).toEqual([]);
  });

  it("peek returns items without clearing", () => {
    actionItemBuffer.add(SESSION, [makeItem("peek task")]);
    const peeked = actionItemBuffer.peek(SESSION);
    expect(peeked).toHaveLength(1);
    expect(peeked[0].title).toBe("peek task");

    // Should still be there
    const peekAgain = actionItemBuffer.peek(SESSION);
    expect(peekAgain).toHaveLength(1);
  });

  it("peek returns empty for unknown session", () => {
    const result = actionItemBuffer.peek(`nonexistent-${Date.now()}`);
    expect(result).toEqual([]);
  });

  it("drain returns empty for unknown session", () => {
    const result = actionItemBuffer.drain(`nonexistent-${Date.now()}`);
    expect(result).toEqual([]);
  });

  it("add does nothing for empty array", () => {
    actionItemBuffer.add(SESSION, []);
    const result = actionItemBuffer.peek(SESSION);
    expect(result).toEqual([]);
  });

  it("accumulates items across multiple adds", () => {
    actionItemBuffer.add(SESSION, [makeItem("first")]);
    actionItemBuffer.add(SESSION, [makeItem("second")]);
    const items = actionItemBuffer.drain(SESSION);
    expect(items).toHaveLength(2);
  });

  it("caps at 15 items per session", () => {
    for (let i = 0; i < 20; i++) {
      actionItemBuffer.add(SESSION, [makeItem(`task ${i}`)]);
    }
    const items = actionItemBuffer.drain(SESSION);
    expect(items).toHaveLength(15);
  });

  it("prune removes stale entries (no-op for fresh items)", () => {
    actionItemBuffer.add(SESSION, [makeItem("fresh task")]);
    actionItemBuffer.prune();
    // Fresh item should survive prune
    const items = actionItemBuffer.peek(SESSION);
    expect(items).toHaveLength(1);
  });
});

// ── formatActionItemsForContext ──────────────────────────────────────

describe("formatActionItemsForContext", () => {
  const task = (
    title: string,
    overrides: Partial<ActionItem> = {}
  ): ActionItem => ({
    title,
    confidence: "high",
    intent: "task",
    urgency: "normal",
    deadlineHint: null,
    source: `I need to ${title}`,
    ...overrides,
  });

  it("returns null for empty array", () => {
    expect(formatActionItemsForContext([])).toBeNull();
  });

  it("formats tasks with confidence markers", () => {
    const result = formatActionItemsForContext([
      task("write the report"),
      task("review the PR", { confidence: "medium" }),
    ]);
    expect(result).not.toBeNull();
    expect(result).toContain("**Tasks:**");
    // High confidence gets checkmark, medium gets question mark
    expect(result).toContain("[✓] write the report");
    expect(result).toContain("[?] review the PR");
  });

  it("formats explorations separately", () => {
    const result = formatActionItemsForContext([
      task("switch hosting", { intent: "exploration", confidence: "medium" }),
    ]);
    expect(result).not.toBeNull();
    expect(result).toContain("**Explorations**");
    expect(result).toContain("switch hosting");
    // Should NOT have a Tasks section
    expect(result).not.toContain("**Tasks:**");
  });

  it("formats concerns separately", () => {
    const result = formatActionItemsForContext([
      task("timeline slipping", { intent: "concern", confidence: "medium" }),
    ]);
    expect(result).not.toBeNull();
    expect(result).toContain("**Concerns**");
    expect(result).toContain("timeline slipping");
  });

  it("includes urgency marker for urgent items", () => {
    const result = formatActionItemsForContext([
      task("fix the production bug", { urgency: "urgent" }),
    ]);
    expect(result).not.toBeNull();
    // The module uses a red circle emoji for urgent
    expect(result).toContain("fix the production bug");
    // Urgent tag present somewhere on the line
    expect(result).toMatch(/fix the production bug.*🔴/);
  });

  it("includes deadline hints", () => {
    const result = formatActionItemsForContext([
      task("submit proposal", { deadlineHint: "by Friday" }),
    ]);
    expect(result).not.toBeNull();
    expect(result).toContain("(by Friday)");
  });

  it("includes header and clarifying instructions", () => {
    const result = formatActionItemsForContext([task("something important")]);
    expect(result).toContain("## Action Items Detected");
    expect(result).toContain("ask clarifying questions");
  });

  it("groups mixed intents correctly", () => {
    const result = formatActionItemsForContext([
      task("deploy the app"),
      task("evaluate new framework", { intent: "exploration", confidence: "medium" }),
      task("budget overrun", { intent: "concern", confidence: "medium" }),
    ]);
    expect(result).not.toBeNull();
    expect(result).toContain("**Tasks:**");
    expect(result).toContain("**Explorations**");
    expect(result).toContain("**Concerns**");
  });
});
