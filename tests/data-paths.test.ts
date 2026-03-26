/**
 * Tests for data-paths.ts — path resolution and date helpers.
 */

import { describe, it, expect } from "vitest";
import { localDateString, DATA_DIR, MEMORY_DIR, GODMODE_ROOT } from "../src/data-paths.js";
import { homedir } from "node:os";
import { join } from "node:path";

describe("localDateString", () => {
  it("returns YYYY-MM-DD format", () => {
    const result = localDateString(new Date(2026, 2, 23)); // March 23, 2026
    expect(result).toBe("2026-03-23");
  });

  it("pads single-digit months and days", () => {
    const result = localDateString(new Date(2026, 0, 5)); // Jan 5, 2026
    expect(result).toBe("2026-01-05");
  });

  it("uses current date when no argument", () => {
    const result = localDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("uses local timezone, not UTC", () => {
    // Create a date at 11 PM local time — UTC might already be next day
    const d = new Date();
    d.setHours(23, 0, 0, 0);
    const result = localDateString(d);
    expect(result).toBe(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  });
});

describe("Path constants", () => {
  it("DATA_DIR is under GODMODE_ROOT", () => {
    expect(DATA_DIR).toBe(join(GODMODE_ROOT, "data"));
  });

  it("MEMORY_DIR is under GODMODE_ROOT", () => {
    expect(MEMORY_DIR).toBe(join(GODMODE_ROOT, "memory"));
  });

  it("GODMODE_ROOT defaults to ~/godmode", () => {
    if (!process.env.GODMODE_ROOT) {
      expect(GODMODE_ROOT).toBe(join(homedir(), "godmode"));
    }
  });
});
