/**
 * Tests for session-search.ts — SQLite FTS5 session search.
 *
 * Uses an in-memory SQLite database via better-sqlite3.
 * Tests init, store, search, session search, prune, stats, and close.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Override DATA_DIR to use temp path for test DB
process.env.GODMODE_ROOT = `/tmp/godmode-test-session-search-${Date.now()}`;

import {
  initSessionSearch,
  isSessionSearchReady,
  storeMessage,
  searchMessages,
  searchSession,
  pruneOldMessages,
  getStats,
  closeSessionSearch,
} from "../src/lib/session-search.js";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.env.GODMODE_ROOT, "data");

beforeAll(() => {
  mkdirSync(DATA_DIR, { recursive: true });
  initSessionSearch();
});

afterAll(() => {
  closeSessionSearch();
});

describe("Session Search", () => {
  it("initializes successfully", () => {
    expect(isSessionSearchReady()).toBe(true);
  });

  it("stores and retrieves messages", () => {
    storeMessage("session-1", "user", "How do I configure the queue processor?");
    storeMessage("session-1", "assistant", "The queue processor is configured via...");
    storeMessage("session-2", "user", "Tell me about identity graph setup");

    const stats = getStats();
    // DB may have messages from other tests in the same process
    expect(stats.messageCount).toBeGreaterThanOrEqual(3);
    expect(stats.sessionCount).toBeGreaterThanOrEqual(2);
  });

  it("searches across all messages", () => {
    const results = searchMessages("queue processor");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.content.includes("queue processor"))).toBe(true);
  });

  it("searches within a specific session", () => {
    const results = searchSession("session-1", "queue");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((r) => r.sessionKey === "session-1")).toBe(true);
  });

  it("returns empty for no matches", () => {
    const results = searchMessages("zzzyyyxxx-nonexistent-term");
    expect(results.length).toBe(0);
  });

  it("returns empty for empty query", () => {
    expect(searchMessages("").length).toBe(0);
    expect(searchMessages("   ").length).toBe(0);
  });

  it("respects limit parameter", () => {
    // Add several messages
    for (let i = 0; i < 10; i++) {
      storeMessage("session-3", "user", `Message about testing number ${i}`);
    }
    const results = searchMessages("testing", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("prune returns 0 when nothing is old", () => {
    const pruned = pruneOldMessages();
    expect(pruned).toBe(0);
  });

  it("handles special characters in queries gracefully", () => {
    storeMessage("session-4", "user", "What about <system-context> tags?");
    const results = searchMessages("system context");
    // Should not throw
    expect(Array.isArray(results)).toBe(true);
  });

  it("returns ready=false after close", () => {
    closeSessionSearch();
    expect(isSessionSearchReady()).toBe(false);
    // Re-init for other tests
    initSessionSearch();
    expect(isSessionSearchReady()).toBe(true);
  });
});
