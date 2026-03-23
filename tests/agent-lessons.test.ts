/**
 * Tests for agent-lessons.ts — lesson storage, retrieval, and formatting.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const { TEST_DATA_DIR } = vi.hoisted(() => {
  const { join } = require("node:path");
  const { tmpdir } = require("node:os");
  return { TEST_DATA_DIR: join(tmpdir(), `gm-test-lessons-${Date.now()}`) };
});

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: TEST_DATA_DIR,
  MEMORY_DIR: join(TEST_DATA_DIR, "memory"),
}));

import {
  readLessonsState,
  addLesson,
  removeLesson,
  getLessonsForPrompt,
  formatLessonsForPrompt,
  getRoutingLessons,
  addRoutingLesson,
  formatRoutingLessons,
} from "../src/lib/agent-lessons.js";
import type { Lesson, AgentLessonsState } from "../src/lib/agent-lessons.js";

beforeEach(() => {
  mkdirSync(TEST_DATA_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DATA_DIR, { recursive: true, force: true });
});

describe("readLessonsState", () => {
  it("returns empty state when file does not exist", async () => {
    const state = await readLessonsState();
    expect(state.global).toEqual([]);
    expect(state.perPersona).toEqual({});
    expect(state.updatedAt).toBeTruthy();
  });
});

describe("addLesson", () => {
  it("adds a global lesson", async () => {
    const lesson = await addLesson({
      rule: "Always use bullet points",
      category: "format",
      sourceTaskId: "task-1",
      sourceTaskTitle: "Content review",
    });
    expect(lesson.id).toBeTruthy();
    expect(lesson.rule).toBe("Always use bullet points");
    expect(lesson.category).toBe("format");
    expect(lesson.appliedCount).toBe(0);
    expect(lesson.createdAt).toBeTruthy();

    const state = await readLessonsState();
    expect(state.global).toHaveLength(1);
    expect(state.global[0].rule).toBe("Always use bullet points");
  });

  it("adds a persona-scoped lesson", async () => {
    await addLesson(
      {
        rule: "Research must include sources",
        category: "accuracy",
        sourceTaskId: "task-2",
        sourceTaskTitle: "Research task",
      },
      "researcher",
    );

    const state = await readLessonsState();
    expect(state.global).toHaveLength(0);
    expect(state.perPersona.researcher).toHaveLength(1);
    expect(state.perPersona.researcher[0].rule).toBe("Research must include sources");
  });

  it("caps at 20 lessons per key", async () => {
    for (let i = 0; i < 25; i++) {
      await addLesson({
        rule: `Rule ${i}`,
        category: "other",
        sourceTaskId: `task-${i}`,
        sourceTaskTitle: `Task ${i}`,
      });
    }
    const state = await readLessonsState();
    expect(state.global).toHaveLength(20);
    // Should keep the most recent 20 (last 20 added)
    expect(state.global[0].rule).toBe("Rule 5");
    expect(state.global[19].rule).toBe("Rule 24");
  });
});

describe("removeLesson", () => {
  it("removes a global lesson by ID", async () => {
    const lesson = await addLesson({
      rule: "Remove me",
      category: "other",
      sourceTaskId: "t",
      sourceTaskTitle: "t",
    });
    const removed = await removeLesson(lesson.id);
    expect(removed).toBe(true);

    const state = await readLessonsState();
    expect(state.global).toHaveLength(0);
  });

  it("removes a persona-scoped lesson", async () => {
    const lesson = await addLesson(
      { rule: "Remove me too", category: "tone", sourceTaskId: "t", sourceTaskTitle: "t" },
      "writer",
    );
    const removed = await removeLesson(lesson.id);
    expect(removed).toBe(true);

    const state = await readLessonsState();
    expect(state.perPersona.writer).toHaveLength(0);
  });

  it("returns false for nonexistent lesson", async () => {
    const removed = await removeLesson("nonexistent-id");
    expect(removed).toBe(false);
  });
});

describe("getLessonsForPrompt", () => {
  it("returns global + persona lessons", async () => {
    await addLesson({
      rule: "Global rule",
      category: "other",
      sourceTaskId: "t",
      sourceTaskTitle: "t",
    });
    await addLesson(
      { rule: "Persona rule", category: "style", sourceTaskId: "t", sourceTaskTitle: "t" },
      "writer",
    );

    const lessons = await getLessonsForPrompt("writer");
    expect(lessons).toHaveLength(2);
    expect(lessons.map((l) => l.rule)).toContain("Global rule");
    expect(lessons.map((l) => l.rule)).toContain("Persona rule");
  });

  it("returns only global lessons when no persona specified", async () => {
    await addLesson({
      rule: "Global only",
      category: "other",
      sourceTaskId: "t",
      sourceTaskTitle: "t",
    });
    await addLesson(
      { rule: "Hidden persona", category: "other", sourceTaskId: "t", sourceTaskTitle: "t" },
      "researcher",
    );

    const lessons = await getLessonsForPrompt();
    expect(lessons).toHaveLength(1);
    expect(lessons[0].rule).toBe("Global only");
  });

  it("increments appliedCount", async () => {
    await addLesson({
      rule: "Count me",
      category: "other",
      sourceTaskId: "t",
      sourceTaskTitle: "t",
    });

    await getLessonsForPrompt();
    await getLessonsForPrompt();

    const state = await readLessonsState();
    // appliedCount incremented twice
    expect(state.global[0].appliedCount).toBe(2);
  });
});

describe("formatLessonsForPrompt", () => {
  it("returns empty string for no lessons", () => {
    expect(formatLessonsForPrompt([])).toBe("");
  });

  it("formats lessons with category tags", () => {
    const lessons: Lesson[] = [
      {
        id: "1",
        rule: "Use bullet points",
        category: "format",
        sourceTaskId: "t",
        sourceTaskTitle: "t",
        createdAt: "2026-01-01",
        appliedCount: 0,
      },
      {
        id: "2",
        rule: "Keep it concise",
        category: "style",
        sourceTaskId: "t",
        sourceTaskTitle: "t",
        createdAt: "2026-01-01",
        appliedCount: 3,
      },
    ];
    const result = formatLessonsForPrompt(lessons);
    expect(result).toContain("## Past Lessons");
    expect(result).toContain("**[format]** Use bullet points");
    expect(result).toContain("**[style]** Keep it concise");
  });
});

describe("Routing Lessons", () => {
  it("adds and retrieves routing lessons", async () => {
    await addRoutingLesson("Check calendar before asking user", "User asked about schedule");
    const lessons = await getRoutingLessons();
    expect(lessons).toHaveLength(1);
    expect(lessons[0].category).toBe("routing");
    expect(lessons[0].rule).toContain("calendar");
  });

  it("includes global routing-category lessons", async () => {
    await addLesson({
      rule: "Global routing rule",
      category: "routing",
      sourceTaskId: "t",
      sourceTaskTitle: "t",
    });
    await addRoutingLesson("Persona routing rule", "context");

    const lessons = await getRoutingLessons();
    expect(lessons).toHaveLength(2);
  });
});

describe("formatRoutingLessons", () => {
  const sampleLessons: Lesson[] = [
    {
      id: "1",
      rule: "Check calendar tool before asking user about schedule",
      category: "routing",
      sourceTaskId: "t",
      sourceTaskTitle: "User asked about meetings",
      createdAt: "2026-01-01",
      appliedCount: 0,
    },
  ];

  it("returns empty for no lessons", () => {
    expect(formatRoutingLessons([], "test")).toBe("");
  });

  it("returns empty when no user message", () => {
    expect(formatRoutingLessons(sampleLessons)).toBe("");
  });

  it("returns empty for short user message", () => {
    expect(formatRoutingLessons(sampleLessons, "hi")).toBe("");
  });

  it("injects lessons matching user message keywords", () => {
    const result = formatRoutingLessons(sampleLessons, "what meetings do I have today?");
    expect(result).toContain("## Routing Corrections");
    expect(result).toContain("Check calendar tool");
  });

  it("skips lessons not matching user message", () => {
    const result = formatRoutingLessons(sampleLessons, "write me a blog post about AI");
    expect(result).toBe("");
  });
});
