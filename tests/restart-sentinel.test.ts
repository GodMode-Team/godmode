/**
 * Tests for restart-sentinel.ts — sentinel write/consume, crash tracking, downtime.
 *
 * Mocks DATA_DIR to a temp directory so no real state is touched.
 */

import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TEST_DATA_DIR = vi.hoisted(() => {
  const { join } = require("node:path");
  const { tmpdir } = require("node:os");
  return join(tmpdir(), `gm-test-sentinel-${Date.now()}`);
});

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: TEST_DATA_DIR,
}));

import {
  writeSentinel,
  writeCrashSentinel,
  consumeSentinel,
  consumeCrashSentinel,
  getLastRestart,
  clearLastRestart,
  getLastCrash,
  clearLastCrash,
} from "../src/lib/restart-sentinel.js";

beforeEach(() => {
  // Clean and recreate the temp dir so each test starts fresh.
  if (existsSync(TEST_DATA_DIR)) {
    rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }
  mkdirSync(TEST_DATA_DIR, { recursive: true });

  // Clear in-memory state between tests.
  clearLastRestart();
  clearLastCrash();
});

afterAll(() => {
  if (existsSync(TEST_DATA_DIR)) {
    rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }
});

describe("restart sentinel — write + consume", () => {
  it("round-trips writeSentinel and consumeSentinel", () => {
    writeSentinel(["sess-1", "sess-2"], ["queue", "heartbeat"], "graceful");
    const info = consumeSentinel();

    expect(info).not.toBeNull();
    expect(info!.previousSessions).toEqual(["sess-1", "sess-2"]);
    expect(info!.previousServices).toEqual(["queue", "heartbeat"]);
    expect(info!.reason).toBe("graceful");
    expect(info!.downtimeMs).toBeGreaterThanOrEqual(0);
  });

  it("returns null when no sentinel file exists", () => {
    expect(consumeSentinel()).toBeNull();
  });

  it("deletes sentinel file after read (one-shot)", () => {
    writeSentinel(["s1"], ["svc1"]);
    const first = consumeSentinel();
    expect(first).not.toBeNull();

    const second = consumeSentinel();
    expect(second).toBeNull();
  });

  it("calculates downtimeMs as a small positive number", () => {
    writeSentinel([], []);
    const info = consumeSentinel();
    expect(info).not.toBeNull();
    // Written and consumed within the same test — downtime should be tiny.
    expect(info!.downtimeMs).toBeGreaterThanOrEqual(0);
    expect(info!.downtimeMs).toBeLessThan(5000);
  });
});

describe("crash sentinel — write + consume", () => {
  it("round-trips writeCrashSentinel and consumeCrashSentinel", () => {
    writeCrashSentinel(
      "ReferenceError: x is not defined",
      "at main (index.ts:10)",
      "uncaughtException",
      ["sess-a"],
    );
    const info = consumeCrashSentinel();

    expect(info).not.toBeNull();
    expect(info!.error).toBe("ReferenceError: x is not defined");
    expect(info!.stack).toBe("at main (index.ts:10)");
    expect(info!.type).toBe("uncaughtException");
    expect(info!.previousSessions).toEqual(["sess-a"]);
    expect(info!.downtimeMs).toBeGreaterThanOrEqual(0);
  });

  it("returns null when no crash sentinel file exists", () => {
    expect(consumeCrashSentinel()).toBeNull();
  });
});

describe("getLastRestart / clearLastRestart", () => {
  it("returns last consumed restart info", () => {
    writeSentinel(["s1"], ["heartbeat"], "signal");
    consumeSentinel();

    const last = getLastRestart();
    expect(last).not.toBeNull();
    expect(last!.previousSessions).toEqual(["s1"]);
    expect(last!.reason).toBe("signal");
  });

  it("clearLastRestart clears it", () => {
    writeSentinel(["s1"], []);
    consumeSentinel();
    expect(getLastRestart()).not.toBeNull();

    clearLastRestart();
    expect(getLastRestart()).toBeNull();
  });
});

describe("getLastCrash / clearLastCrash", () => {
  it("returns last consumed crash info", () => {
    writeCrashSentinel("boom", "stack trace", "unhandledRejection", ["s2"]);
    consumeCrashSentinel();

    const last = getLastCrash();
    expect(last).not.toBeNull();
    expect(last!.error).toBe("boom");
    expect(last!.type).toBe("unhandledRejection");
    expect(last!.previousSessions).toEqual(["s2"]);
  });

  it("clearLastCrash clears it", () => {
    writeCrashSentinel("err", "stack", "uncaughtException");
    consumeCrashSentinel();
    expect(getLastCrash()).not.toBeNull();

    clearLastCrash();
    expect(getLastCrash()).toBeNull();
  });
});
