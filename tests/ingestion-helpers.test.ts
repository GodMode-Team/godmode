/**
 * Tests for ingestion helpers — safeName, appendToDaily, updatePersonFile.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { safeName } from "../src/services/ingestion/helpers.js";

describe("safeName", () => {
  it("lowercases and slugifies names", () => {
    expect(safeName("John Doe")).toBe("john-doe");
    expect(safeName("Dr. Jane Smith, MD")).toBe("dr-jane-smith-md");
  });

  it("strips leading/trailing hyphens", () => {
    expect(safeName("---test---")).toBe("test");
    expect(safeName("  hello  ")).toBe("hello");
  });

  it("truncates to 60 chars", () => {
    const long = "a".repeat(100);
    expect(safeName(long).length).toBe(60);
  });

  it("handles empty/whitespace input", () => {
    expect(safeName("")).toBe("");
    expect(safeName("   ")).toBe("");
    expect(safeName("!!!")).toBe("");
  });

  it("collapses multiple non-alpha runs", () => {
    expect(safeName("hello...world!!!now")).toBe("hello-world-now");
  });
});
