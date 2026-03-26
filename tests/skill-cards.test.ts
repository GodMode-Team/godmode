/**
 * Tests for skill-cards.ts — loading, matching, formatting, and seeding.
 *
 * NOTE: loadSkillCards() has a 1-minute internal cache. To avoid cache
 * conflicts between tests, we set up all cards once and test against
 * the cached state. Format/match functions are tested independently.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const { TEST_MEMORY_DIR, TEST_DATA_DIR } = vi.hoisted(() => {
  const { join } = require("node:path");
  const { tmpdir } = require("node:os");
  const ts = Date.now();
  return {
    TEST_MEMORY_DIR: join(tmpdir(), `gm-test-skills-${ts}`),
    TEST_DATA_DIR: join(tmpdir(), `gm-test-skills-data-${ts}`),
  };
});

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: TEST_DATA_DIR,
  MEMORY_DIR: TEST_MEMORY_DIR,
}));

vi.mock("../src/lib/vault-paths.js", () => ({
  getVaultPath: () => null,
  VAULT_FOLDERS: { system: "99-System" },
}));

import {
  loadSkillCards,
  matchSkillCard,
  formatSkillCard,
  resolveSkillCardsDir,
} from "../src/lib/skill-cards.js";

const CARDS_DIR = join(TEST_MEMORY_DIR, "skill-cards");

// Set up test cards once — all tests share the cached state
beforeAll(() => {
  mkdirSync(CARDS_DIR, { recursive: true });
  mkdirSync(TEST_DATA_DIR, { recursive: true });

  writeFileSync(join(CARDS_DIR, "calendar.md"), `---
domain: calendar
triggers: meeting, schedule, calendar, event, availability
tools: calendar.events.today, calendar.events.range
---

Use calendar.events.today to check today's schedule.
Always show times in the user's timezone.
`, "utf-8");

  writeFileSync(join(CARDS_DIR, "tasks.md"), `---
domain: tasks
triggers: task, todo, reminder, checklist
tools: tasks.list, tasks.create
---
Task management guide.
`, "utf-8");

  writeFileSync(join(CARDS_DIR, "plain.md"), "Just some text without frontmatter", "utf-8");

  // Prime the cache
  loadSkillCards();
});

afterAll(() => {
  rmSync(TEST_MEMORY_DIR, { recursive: true, force: true });
  rmSync(TEST_DATA_DIR, { recursive: true, force: true });
});

describe("resolveSkillCardsDir", () => {
  it("returns local cards dir when it exists", () => {
    expect(resolveSkillCardsDir()).toBe(CARDS_DIR);
  });

  it("returns null when dir does not exist", () => {
    // Temporarily rename the dir
    const backup = CARDS_DIR + ".bak";
    try {
      require("node:fs").renameSync(CARDS_DIR, backup);
      expect(resolveSkillCardsDir()).toBeNull();
    } finally {
      require("node:fs").renameSync(backup, CARDS_DIR);
    }
  });
});

describe("loadSkillCards", () => {
  it("loads all cards from directory", () => {
    const cards = loadSkillCards();
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("parses frontmatter correctly", () => {
    const cards = loadSkillCards();
    const cal = cards.find((c) => c.slug === "calendar");
    expect(cal).toBeTruthy();
    expect(cal!.domain).toBe("calendar");
    expect(cal!.triggers).toEqual(["meeting", "schedule", "calendar", "event", "availability"]);
    expect(cal!.tools).toEqual(["calendar.events.today", "calendar.events.range"]);
    expect(cal!.body).toContain("calendar.events.today");
  });

  it("handles card without frontmatter", () => {
    const cards = loadSkillCards();
    const plain = cards.find((c) => c.slug === "plain");
    expect(plain).toBeTruthy();
    expect(plain!.domain).toBe("plain");
    expect(plain!.triggers).toEqual([]);
    expect(plain!.body).toBe("Just some text without frontmatter");
  });

  it("loads task card", () => {
    const cards = loadSkillCards();
    const tasks = cards.find((c) => c.slug === "tasks");
    expect(tasks).toBeTruthy();
    expect(tasks!.triggers).toContain("task");
    expect(tasks!.tools).toContain("tasks.list");
  });
});

describe("matchSkillCard", () => {
  it("matches calendar keywords", () => {
    const card = matchSkillCard("Check my calendar for today");
    expect(card).toBeTruthy();
    expect(card!.domain).toBe("calendar");
  });

  it("matches task keywords", () => {
    const card = matchSkillCard("Create a task to review the proposal");
    expect(card).toBeTruthy();
    expect(card!.domain).toBe("tasks");
  });

  it("returns null for unmatched messages", () => {
    expect(matchSkillCard("Tell me a joke about cats")).toBeNull();
  });

  it("prefers card with more trigger matches", () => {
    const card = matchSkillCard("Check my calendar for meeting schedule");
    expect(card).toBeTruthy();
    expect(card!.domain).toBe("calendar"); // 3 triggers vs 0
  });

  it("matches schedule keyword", () => {
    const card = matchSkillCard("What's on my schedule for this afternoon?");
    expect(card).toBeTruthy();
    expect(card!.domain).toBe("calendar");
  });
});

describe("formatSkillCard", () => {
  it("formats card with domain header", () => {
    const result = formatSkillCard({
      slug: "test",
      domain: "testing",
      triggers: [],
      tools: [],
      body: "Line 1\nLine 2\nLine 3",
    });
    expect(result).toContain("## Skill Card: testing");
    expect(result).toContain("Line 1");
    expect(result).toContain("Line 3");
  });

  it("truncates long cards to 40 lines", () => {
    const longBody = Array.from({ length: 60 }, (_, i) => `Line ${i + 1}`).join("\n");
    const result = formatSkillCard({
      slug: "long",
      domain: "long-domain",
      triggers: [],
      tools: [],
      body: longBody,
    });
    expect(result).toContain("Line 1");
    expect(result).toContain("Line 40");
    expect(result).not.toContain("Line 41");
    expect(result).toContain("+20 more lines");
  });

  it("does not truncate short cards", () => {
    const result = formatSkillCard({
      slug: "short",
      domain: "short-domain",
      triggers: [],
      tools: [],
      body: "One line",
    });
    expect(result).not.toContain("more lines");
  });
});
