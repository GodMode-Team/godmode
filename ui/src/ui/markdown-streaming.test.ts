import { describe, expect, it, beforeEach } from "vitest";
import { toSanitizedMarkdownHtml } from "./markdown";
import {
  toStreamingMarkdownHtml,
  resetStreamingCache,
  findSafeSplitPoint,
} from "./markdown-streaming";

beforeEach(() => {
  resetStreamingCache();
});

describe("findSafeSplitPoint", () => {
  it("returns -1 for text with fewer than 2 paragraph breaks", () => {
    expect(findSafeSplitPoint("hello world")).toBe(-1);
    expect(findSafeSplitPoint("hello\n\nworld")).toBe(-1);
  });

  it("returns second-to-last boundary for multiple paragraphs", () => {
    const text = "paragraph 1\n\nparagraph 2\n\nparagraph 3";
    const split = findSafeSplitPoint(text);
    // Should split after "paragraph 1\n\n", so split = 13 (start of "paragraph 2")
    expect(split).toBe(13);
    expect(text.slice(split)).toBe("paragraph 2\n\nparagraph 3");
  });

  it("skips boundaries inside code fences", () => {
    const text = [
      "before",
      "",
      "```",
      "inside fence",
      "",
      "still inside",
      "```",
      "",
      "after fence",
      "",
      "last paragraph",
    ].join("\n");
    const split = findSafeSplitPoint(text);
    // Only boundaries outside fences should be: before→code block, code block→after fence, after fence→last
    // The blank line inside the fence should be ignored
    expect(split).toBeGreaterThan(0);
    const tail = text.slice(split);
    // Tail should NOT start inside the code fence
    expect(tail).not.toContain("inside fence");
  });

  it("handles unclosed code fences by staying in fence mode", () => {
    const text = [
      "paragraph 1",
      "",
      "```python",
      "code line 1",
      "",
      "code line 2",
      "",
      "more code",
    ].join("\n");
    // Only one boundary outside fence (before the ```), not enough for split
    expect(findSafeSplitPoint(text)).toBe(-1);
  });

  it("handles multiple consecutive blank lines", () => {
    const text = "paragraph 1\n\n\n\nparagraph 2\n\nparagraph 3";
    const split = findSafeSplitPoint(text);
    expect(split).toBeGreaterThan(0);
    // The prefix should include paragraph 1
    expect(text.slice(0, split)).toContain("paragraph 1");
  });

  it("distinguishes backtick and tilde fences", () => {
    const text = [
      "before",
      "",
      "~~~",
      "inside tilde fence",
      "```",
      "not a close for tildes",
      "~~~",
      "",
      "after fence",
      "",
      "last",
    ].join("\n");
    const split = findSafeSplitPoint(text);
    expect(split).toBeGreaterThan(0);
    const tail = text.slice(split);
    expect(tail).not.toContain("inside tilde fence");
  });
});

describe("toStreamingMarkdownHtml", () => {
  it("falls through to standard render for short text", () => {
    const short = "Hello **world**";
    const streaming = toStreamingMarkdownHtml(short);
    const standard = toSanitizedMarkdownHtml(short);
    expect(streaming).toBe(standard);
  });

  it("falls through when no safe split point exists", () => {
    // One long paragraph with no \n\n — pad to >500 chars
    const long = "A".repeat(600);
    const streaming = toStreamingMarkdownHtml(long);
    const standard = toSanitizedMarkdownHtml(long);
    expect(streaming).toBe(standard);
  });

  it("produces equivalent output for multi-paragraph text", () => {
    const paragraphs = Array.from(
      { length: 10 },
      (_, i) =>
        `Paragraph ${i + 1} with enough content to push the total length past the minimum threshold for caching.`,
    );
    const text = paragraphs.join("\n\n");
    // Ensure text is long enough to trigger caching
    expect(text.length).toBeGreaterThan(500);

    const streaming = toStreamingMarkdownHtml(text);
    const standard = toSanitizedMarkdownHtml(text);
    expect(streaming).toBe(standard);
  });

  it("benefits from cache on growing text (streaming simulation)", () => {
    const lines = Array.from(
      { length: 20 },
      (_, i) => `Line ${i + 1} with enough text to be meaningful.`,
    );

    // Simulate streaming: text grows with each delta
    let result1 = "";
    let result2 = "";
    for (let i = 5; i <= lines.length; i++) {
      const text = lines.slice(0, i).join("\n\n");
      if (text.length >= 500) {
        result1 = toStreamingMarkdownHtml(text);
      }
    }

    // Compare final result with direct render
    const fullText = lines.join("\n\n");
    resetStreamingCache();
    result2 = toSanitizedMarkdownHtml(fullText);
    expect(result1).toBe(result2);
  });

  it("produces valid output with code fences", () => {
    const text = [
      "Introduction paragraph with enough text to pad things out a bit more for the minimum length.",
      "",
      "Second paragraph also with enough text to make this work properly for our test case here.",
      "",
      "```typescript",
      "const x = 1;",
      "console.log(x);",
      "```",
      "",
      "Paragraph after code with more text to push us over the minimum character threshold needed.",
      "",
      "Final paragraph that concludes the document with additional padding text for length requirements.",
    ].join("\n");
    // Pad if needed
    const padded = text.length >= 500 ? text : text + "\n\n" + "Extra padding. ".repeat(30);

    const streaming = toStreamingMarkdownHtml(padded);
    const standard = toSanitizedMarkdownHtml(padded);
    expect(streaming).toBe(standard);
  });

  it("resetStreamingCache clears cached state", () => {
    const paragraphs = Array.from({ length: 10 }, (_, i) => `Reset test paragraph ${i + 1} here.`);
    const text = paragraphs.join("\n\n");

    // Prime the cache
    toStreamingMarkdownHtml(text);

    // Reset
    resetStreamingCache();

    // After reset, rendering a completely different text should work
    const different = Array.from(
      { length: 10 },
      (_, i) => `Different content ${i + 1} entirely new.`,
    );
    const diffText = different.join("\n\n");
    const streaming = toStreamingMarkdownHtml(diffText);
    const standard = toSanitizedMarkdownHtml(diffText);
    expect(streaming).toBe(standard);
  });
});
