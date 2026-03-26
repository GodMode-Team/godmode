// Regression: ISSUE-001 -- Brain tab routing and legacy redirect
// Found by /qa on 2026-03-24
// Report: .godmode/qa-reports/qa-report-localhost-2026-03-24.md
// Updated: Brain → Memory rename (2026-03-25)

import { describe, expect, it } from "vitest";
import {
  emojiForTab,
  iconForTab,
  pathForTab,
  subtitleForTab,
  tabFromPath,
  titleForTab,
} from "../ui/src/ui/navigation.js";

describe("memory tab navigation (formerly brain)", () => {
  it("resolves /memory to the memory tab", () => {
    expect(tabFromPath("/memory")).toBe("memory");
  });

  it("redirects /brain to memory tab (legacy)", () => {
    expect(tabFromPath("/brain")).toBe("memory");
  });

  it("redirects /second-brain to memory tab (legacy)", () => {
    expect(tabFromPath("/second-brain")).toBe("memory");
  });

  it("returns correct path for memory tab", () => {
    expect(pathForTab("memory")).toBe("/memory");
  });

  it("returns correct path with base path", () => {
    expect(pathForTab("memory", "/ui")).toBe("/ui/memory");
  });

  it("returns 'Memory' as title", () => {
    expect(titleForTab("memory")).toBe("Memory");
  });

  it("returns brain icon for memory tab", () => {
    expect(iconForTab("memory")).toBe("brain");
  });

  it("returns brain emoji for memory tab", () => {
    expect(emojiForTab("memory")).toBe("\u{1F9E0}");
  });

  it("returns non-empty subtitle containing Memory", () => {
    const subtitle = subtitleForTab("memory");
    expect(subtitle.length).toBeGreaterThan(0);
    expect(subtitle).toContain("Memory");
  });

  it("legacy brain tab still returns brain icon and emoji", () => {
    expect(iconForTab("brain")).toBe("brain");
    expect(emojiForTab("brain")).toBe("\u{1F9E0}");
  });

  it("legacy second-brain tab still returns brain icon and emoji", () => {
    expect(iconForTab("second-brain")).toBe("brain");
    expect(emojiForTab("second-brain")).toBe("\u{1F9E0}");
  });
});
