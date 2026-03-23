/**
 * Tests for child-env.ts — child process environment builder.
 */

import { describe, it, expect, afterEach } from "vitest";
import { buildChildEnv, enrichedPath, resolveBashBin } from "../src/lib/child-env.js";
import { homedir } from "node:os";

describe("buildChildEnv", () => {
  const savedEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it("includes PATH, HOME, USER, SHELL, LANG, TERM", () => {
    const env = buildChildEnv();
    expect(env.PATH).toBeTruthy();
    expect(env.HOME).toBe(homedir());
    expect(env.SHELL).toBeTruthy();
    expect(env.LANG).toBeTruthy();
    expect(env.TERM).toBeTruthy();
  });

  it("forwards ANTHROPIC_API_KEY when present", () => {
    process.env.ANTHROPIC_API_KEY = "sk-test-key";
    const env = buildChildEnv();
    expect(env.ANTHROPIC_API_KEY).toBe("sk-test-key");
  });

  it("does not include ANTHROPIC_API_KEY when absent", () => {
    delete process.env.ANTHROPIC_API_KEY;
    const env = buildChildEnv();
    expect(env.ANTHROPIC_API_KEY).toBeUndefined();
  });

  it("forwards OPENAI_API_KEY when present", () => {
    process.env.OPENAI_API_KEY = "sk-openai-test";
    const env = buildChildEnv();
    expect(env.OPENAI_API_KEY).toBe("sk-openai-test");
  });

  it("merges extraKeys", () => {
    const env = buildChildEnv({ CUSTOM_VAR: "custom-value" });
    expect(env.CUSTOM_VAR).toBe("custom-value");
  });

  it("extraKeys override built-in values", () => {
    const env = buildChildEnv({ HOME: "/override/path" });
    expect(env.HOME).toBe("/override/path");
  });
});

describe("enrichedPath", () => {
  it("returns a non-empty string", () => {
    const p = enrichedPath();
    expect(p.length).toBeGreaterThan(0);
  });

  it("includes /usr/local/bin if it exists on this system", () => {
    const p = enrichedPath();
    // /usr/local/bin exists on macOS
    if (process.platform === "darwin") {
      expect(p).toContain("/usr/local/bin");
    }
  });
});

describe("resolveBashBin", () => {
  it("returns a path to bash on unix-like systems", () => {
    if (process.platform !== "win32") {
      const bin = resolveBashBin();
      expect(bin).toBeTruthy();
      expect(bin).toContain("bash");
    }
  });
});
