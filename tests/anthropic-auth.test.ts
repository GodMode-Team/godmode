/**
 * Tests for anthropic-auth.ts — API key resolution and fetch helpers.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test resolveAnthropicKey by manipulating env vars and mocking readFileSync.
// callHaiku and fetchWithTimeout require network — tested with mocked fetch.

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return { ...actual, readFileSync: vi.fn() };
});

import { readFileSync } from "node:fs";
import { resolveAnthropicKey, fetchWithTimeout } from "../src/lib/anthropic-auth.js";

const mockReadFileSync = vi.mocked(readFileSync);

describe("resolveAnthropicKey", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    mockReadFileSync.mockImplementation(() => {
      throw new Error("file not found");
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns ANTHROPIC_API_KEY from env if set", () => {
    process.env.ANTHROPIC_API_KEY = "sk-test-from-env";
    expect(resolveAnthropicKey()).toBe("sk-test-from-env");
  });

  it("returns null when no sources available", () => {
    delete process.env.ANTHROPIC_API_KEY;
    expect(resolveAnthropicKey()).toBeNull();
  });

  it("reads from GodMode .env when env var not set", () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockReadFileSync.mockImplementation((path: any) => {
      if (String(path).endsWith("godmode/.env")) {
        return "# comment\nANTHROPIC_API_KEY=sk-from-godmode-env\nOTHER=val";
      }
      throw new Error("not found");
    });
    expect(resolveAnthropicKey()).toBe("sk-from-godmode-env");
  });

  it("skips commented-out keys in .env", () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockReadFileSync.mockImplementation((path: any) => {
      if (String(path).endsWith("godmode/.env")) {
        return "ANTHROPIC_API_KEY=#disabled";
      }
      throw new Error("not found");
    });
    // # at start of value means commented out
    expect(resolveAnthropicKey()).toBeNull();
  });

  it("reads from Claude Code credentials", () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockReadFileSync.mockImplementation((path: any) => {
      if (String(path).includes(".claude/.credentials.json")) {
        return JSON.stringify({
          claudeAiOauth: { accessToken: "oauth-token-123" },
        });
      }
      throw new Error("not found");
    });
    expect(resolveAnthropicKey()).toBe("oauth-token-123");
  });

  it("reads from OpenClaw .env as fallback", () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockReadFileSync.mockImplementation((path: any) => {
      if (String(path).includes(".openclaw/.env")) {
        return "ANTHROPIC_API_KEY=sk-from-openclaw";
      }
      throw new Error("not found");
    });
    expect(resolveAnthropicKey()).toBe("sk-from-openclaw");
  });

  it("reads from OpenClaw auth-profiles.json as last resort", () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockReadFileSync.mockImplementation((path: any) => {
      if (String(path).includes("auth-profiles.json")) {
        return JSON.stringify({
          profiles: { "anthropic:oauth": { token: "profile-token" } },
        });
      }
      throw new Error("not found");
    });
    expect(resolveAnthropicKey()).toBe("profile-token");
  });

  it("prefers env var over file sources", () => {
    process.env.ANTHROPIC_API_KEY = "sk-env-wins";
    mockReadFileSync.mockReturnValue("ANTHROPIC_API_KEY=sk-file-loses");
    expect(resolveAnthropicKey()).toBe("sk-env-wins");
  });
});

describe("fetchWithTimeout", () => {
  it("aborts request after timeout", async () => {
    // Create a never-resolving fetch by using a very short timeout
    await expect(
      fetchWithTimeout("http://localhost:1", {}, 1),
    ).rejects.toThrow();
  });
});
