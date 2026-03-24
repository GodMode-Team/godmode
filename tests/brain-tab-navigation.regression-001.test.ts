// Regression: ISSUE-001 -- Brain tab routing and legacy redirect
// Found by /qa on 2026-03-24
// Report: .godmode/qa-reports/qa-report-localhost-2026-03-24.md

import { describe, expect, it } from "vitest";
import {
  emojiForTab,
  iconForTab,
  pathForTab,
  subtitleForTab,
  tabFromPath,
  titleForTab,
} from "../ui/src/ui/navigation.js";

describe("brain tab navigation", () => {
  it("resolves /brain to the brain tab", () => {
    expect(tabFromPath("/brain")).toBe("brain");
  });

  it("redirects /second-brain to brain tab", () => {
    expect(tabFromPath("/second-brain")).toBe("brain");
  });

  it("returns correct path for brain tab", () => {
    expect(pathForTab("brain")).toBe("/brain");
  });

  it("returns correct path with base path", () => {
    expect(pathForTab("brain", "/ui")).toBe("/ui/brain");
  });

  it("returns 'Brain' as title", () => {
    expect(titleForTab("brain")).toBe("Brain");
  });

  it("returns brain icon", () => {
    expect(iconForTab("brain")).toBe("brain");
  });

  it("returns brain emoji", () => {
    expect(emojiForTab("brain")).toBe("\u{1F9E0}");
  });

  it("returns non-empty subtitle", () => {
    const subtitle = subtitleForTab("brain");
    expect(subtitle.length).toBeGreaterThan(0);
    expect(subtitle).toContain("Brain");
  });

  it("legacy second-brain tab still returns brain icon and emoji", () => {
    expect(iconForTab("second-brain")).toBe("brain");
    expect(emojiForTab("second-brain")).toBe("\u{1F9E0}");
  });
});
