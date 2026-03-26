/**
 * Tests for evidence.ts — artifact extraction and evidence checking.
 *
 * Tests extractArtifacts for URL, code block, file path, and PR link detection.
 * Tests checkEvidence for per-task-type thresholds and pass/fail logic.
 */

import { describe, it, expect } from "vitest";
import { checkEvidence, extractArtifacts, type TaskType } from "../src/lib/evidence.js";

describe("extractArtifacts", () => {
  it("extracts URLs from content", () => {
    const artifacts = extractArtifacts("Check out https://example.com/docs for more info.");
    expect(artifacts.some((a) => a.type === "url" && a.value.includes("example.com"))).toBe(true);
  });

  it("extracts PR links with specific type", () => {
    const artifacts = extractArtifacts("Opened https://github.com/org/repo/pull/42 for review.");
    expect(artifacts.some((a) => a.type === "pr_link")).toBe(true);
  });

  it("extracts commit links as pr_link type", () => {
    const artifacts = extractArtifacts("See https://github.com/org/repo/commit/abc1234def for the change.");
    expect(artifacts.some((a) => a.type === "pr_link")).toBe(true);
  });

  it("extracts substantial code blocks", () => {
    const content = "Here's the fix:\n```typescript\nfunction solve() {\n  return computeResult(data, options);\n}\n```";
    const artifacts = extractArtifacts(content);
    expect(artifacts.some((a) => a.type === "code_block")).toBe(true);
  });

  it("ignores tiny code blocks (< 30 chars)", () => {
    const content = "Use `foo` or:\n```\nbar\n```";
    const artifacts = extractArtifacts(content);
    expect(artifacts.some((a) => a.type === "code_block")).toBe(false);
  });

  it("extracts file paths", () => {
    const artifacts = extractArtifacts("Modified /src/lib/evidence.ts to add checks.");
    expect(artifacts.some((a) => a.type === "file_path")).toBe(true);
  });

  it("extracts command output lines starting with $", () => {
    const artifacts = extractArtifacts("Run this:\n  $ npm install --save express");
    expect(artifacts.some((a) => a.type === "command_output")).toBe(true);
  });

  it("deduplicates artifacts", () => {
    const artifacts = extractArtifacts("Visit https://example.com and https://example.com again.");
    const urls = artifacts.filter((a) => a.value.includes("example.com"));
    expect(urls.length).toBe(1);
  });

  it("caps at 30 artifacts max", () => {
    const lines = Array.from({ length: 40 }, (_, i) => `https://example.com/page-${i}`).join("\n");
    const artifacts = extractArtifacts(lines);
    expect(artifacts.length).toBeLessThanOrEqual(30);
  });
});

describe("checkEvidence", () => {
  it("fails on empty output", () => {
    const result = checkEvidence("research", "");
    expect(result.passed).toBe(false);
    expect(result.missing).toContain("substantive output (>50 characters)");
  });

  it("fails on very short output", () => {
    const result = checkEvidence("coding", "Done.");
    expect(result.passed).toBe(false);
  });

  // Coding
  it("passes coding with PR link", () => {
    const output = "Opened PR: https://github.com/org/repo/pull/99\n" + "A".repeat(60);
    expect(checkEvidence("coding", output).passed).toBe(true);
  });

  it("passes coding with code block", () => {
    const output = "```ts\nexport function compute(data: number[]) {\n  return data.reduce((a, b) => a + b, 0);\n}\n```\n" + "A".repeat(60);
    expect(checkEvidence("coding", output).passed).toBe(true);
  });

  it("passes coding with file path references", () => {
    const output = "Updated /src/lib/queue-state.ts with the new handler logic and error handling. " + "A".repeat(60);
    expect(checkEvidence("coding", output).passed).toBe(true);
  });

  it("fails coding without code artifacts", () => {
    const output = "I refactored the module and it works better now. The improvements are significant and meaningful. " + "A".repeat(60);
    const result = checkEvidence("coding", output);
    expect(result.passed).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  // Research
  it("passes research with source URLs", () => {
    const output = "Found relevant info at https://docs.example.com/api. " + "A".repeat(60);
    expect(checkEvidence("research", output).passed).toBe(true);
  });

  it("fails research without URLs", () => {
    const output = "The market is growing rapidly based on various industry trends and analyst opinions. " + "A".repeat(60);
    expect(checkEvidence("research", output).passed).toBe(false);
  });

  // Creative
  it("passes creative with substantial content", () => {
    const output = "A".repeat(300);
    expect(checkEvidence("creative", output).passed).toBe(true);
  });

  it("fails creative with thin content", () => {
    const output = "Here's a short draft. " + "A".repeat(40);
    expect(checkEvidence("creative", output).passed).toBe(false);
  });

  // Review
  it("passes review with feedback terms", () => {
    const output = "Found an issue with error handling. I recommend adding try-catch blocks. " + "A".repeat(60);
    expect(checkEvidence("review", output).passed).toBe(true);
  });

  // Ops
  it("passes ops with status confirmation", () => {
    const output = "The deployment completed successfully and services are running. " + "A".repeat(60);
    expect(checkEvidence("ops", output).passed).toBe(true);
  });

  // Generic types always pass
  it("passes task type with any substantive output", () => {
    const output = "A".repeat(60);
    expect(checkEvidence("task", output).passed).toBe(true);
  });

  it("passes idea type with any substantive output", () => {
    const output = "A".repeat(60);
    expect(checkEvidence("idea", output).passed).toBe(true);
  });

  // Different task types have different thresholds
  it("applies different rules for different task types", () => {
    const genericOutput = "This is a substantive piece of work that describes various things in detail. " + "A".repeat(60);
    const codingResult = checkEvidence("coding", genericOutput);
    const taskResult = checkEvidence("task", genericOutput);
    // Coding should fail (no code artifacts), task should pass (generic always passes)
    expect(codingResult.passed).toBe(false);
    expect(taskResult.passed).toBe(true);
  });
});
