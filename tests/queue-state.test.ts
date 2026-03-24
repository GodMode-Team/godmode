/**
 * Integration tests for queue-state.ts — queue item CRUD and state management.
 *
 * Tests read/write of queue state via the updateQueueState functional updater,
 * item lifecycle transitions, and ID generation.
 */

import { describe, it, expect } from "vitest";
import {
  readQueueState,
  updateQueueState,
  newQueueItemId,
  type QueueItem,
  type QueueState,
} from "../src/lib/queue-state.js";

describe("Queue State", () => {
  it("reads queue state without error", async () => {
    const state = await readQueueState();
    expect(state).toBeDefined();
    expect(state.version).toBe(1);
    expect(Array.isArray(state.items)).toBe(true);
  });

  it("has correct shape for existing queue items", async () => {
    const state = await readQueueState();
    for (const item of state.items) {
      expect(item.id).toBeTruthy();
      expect(item.type).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.status).toBeTruthy();
      expect(item.priority).toBeTruthy();
      expect(typeof item.createdAt).toBe("number");
    }
  });

  it("adds and removes items via updateQueueState", async () => {
    const testId = `test-${Date.now()}`;

    // Add — use "done" status so the live queue processor never dispatches test items.
    // This prevents the TOCTOU race (CWE-367) where test items with "pending" status
    // leak into production and spawn phantom agents.
    await updateQueueState((state) => {
      state.items.push({
        id: testId,
        type: "research",
        title: "Integration test item",
        priority: "low",
        status: "done",
        source: "test",
        createdAt: Date.now(),
      });
    });

    // Verify added
    const afterAdd = await readQueueState();
    const found = afterAdd.items.find((i) => i.id === testId);
    expect(found).toBeDefined();
    expect(found!.title).toBe("Integration test item");
    expect(found!.status).toBe("done");

    // Update status
    await updateQueueState((state) => {
      const item = state.items.find((i) => i.id === testId);
      if (item) {
        item.status = "done";
        item.completedAt = Date.now();
      }
    });

    // Verify updated
    const afterUpdate = await readQueueState();
    const updated = afterUpdate.items.find((i) => i.id === testId);
    expect(updated?.status).toBe("done");
    expect(updated?.completedAt).toBeGreaterThan(0);

    // Remove
    await updateQueueState((state) => {
      state.items = state.items.filter((i) => i.id !== testId);
    });

    // Verify removed
    const afterRemove = await readQueueState();
    expect(afterRemove.items.find((i) => i.id === testId)).toBeUndefined();
  });

  it("preserves existing items during updates", async () => {
    const before = await readQueueState();
    const countBefore = before.items.length;
    const testId = `preserve-test-${Date.now()}`;

    await updateQueueState((state) => {
      state.items.push({
        id: testId,
        type: "analysis",
        title: "Preserve test",
        priority: "normal",
        status: "done",
        source: "test",
        createdAt: Date.now(),
      });
    });

    const after = await readQueueState();
    expect(after.items.length).toBe(countBefore + 1);

    // Clean up
    await updateQueueState((state) => {
      state.items = state.items.filter((i) => i.id !== testId);
    });
  });

  it("handles concurrent updates safely (file locking)", async () => {
    const ids = Array.from({ length: 5 }, (_, i) => `concurrent-${Date.now()}-${i}`);

    // Add 5 items concurrently — use "done" status to prevent queue processor
    // from dispatching these as real agent tasks (TOCTOU race fix)
    await Promise.all(
      ids.map((id) =>
        updateQueueState((state) => {
          state.items.push({
            id,
            type: "research",
            title: `Concurrent item ${id}`,
            priority: "low",
            status: "done",
            source: "test",
            createdAt: Date.now(),
          });
        }),
      ),
    );

    // All 5 should exist
    const state = await readQueueState();
    for (const id of ids) {
      expect(state.items.find((i) => i.id === id)).toBeDefined();
    }

    // Clean up
    await updateQueueState((s) => {
      s.items = s.items.filter((i) => !ids.includes(i.id));
    });
  });
});

describe("newQueueItemId", () => {
  it("generates a slug-based ID", () => {
    const id = newQueueItemId("Research Community Platforms");
    expect(id).toMatch(/^research-community-platforms-[a-f0-9]{6}$/);
  });

  it("handles special characters", () => {
    const id = newQueueItemId("What's the ROI on X/Twitter?");
    expect(id).toMatch(/^what-s-the-roi-on-x-twitter-[a-f0-9]{6}$/);
  });

  it("truncates long titles", () => {
    const id = newQueueItemId("A".repeat(100));
    // Slug should be max 40 chars + dash + 6 hex chars
    expect(id.length).toBeLessThanOrEqual(47);
  });

  it("generates unique IDs for same title", () => {
    const id1 = newQueueItemId("Same Title");
    const id2 = newQueueItemId("Same Title");
    expect(id1).not.toBe(id2);
  });

  it("handles empty title", () => {
    const id = newQueueItemId("");
    expect(id).toMatch(/^item-[a-f0-9]{6}$/);
  });
});
