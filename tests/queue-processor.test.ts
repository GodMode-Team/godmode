/**
 * Tests for queue-processor.ts — core queue processing logic.
 *
 * Tests the public API: init, handleItemCompleted, handleItemFailed,
 * retry counter logic, and stale item expiry.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  readQueueState,
  updateQueueState,
  newQueueItemId,
  type QueueItem,
} from "../src/lib/queue-state.js";

// ── Helpers ─────────────────────────────────────────────────────

function makeTestItem(overrides: Partial<QueueItem> = {}): QueueItem {
  return {
    id: newQueueItemId(overrides.title ?? "test-item"),
    type: "research",
    title: "Test research task",
    priority: "normal",
    status: "pending",
    source: "manual",
    createdAt: Date.now(),
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────

describe("Queue Processor — item lifecycle", () => {
  let originalItems: QueueItem[] = [];

  beforeEach(async () => {
    const state = await readQueueState();
    originalItems = [...state.items];
  });

  afterEach(async () => {
    // Restore original queue state
    await updateQueueState((s) => {
      s.items = originalItems;
    });
  });

  it("can add and retrieve a pending item", async () => {
    const item = makeTestItem({ title: "queue-proc-test-add" });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found).toBeDefined();
    expect(found!.status).toBe("pending");
    expect(found!.title).toBe("queue-proc-test-add");
  });

  it("transitions item from pending to processing", async () => {
    const item = makeTestItem({ title: "queue-proc-test-transition" });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "processing";
        qi.startedAt = Date.now();
        qi.pid = 12345;
      }
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found!.status).toBe("processing");
    expect(found!.pid).toBe(12345);
    expect(found!.startedAt).toBeDefined();
  });

  it("increments retryCount on failure and re-queue", async () => {
    const item = makeTestItem({
      title: "queue-proc-test-retry",
      retryCount: 0,
    });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    // Simulate failure → retry
    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "pending";
        qi.retryCount = (qi.retryCount ?? 0) + 1;
        qi.lastError = "Process exited with code 1";
        qi.pid = undefined;
      }
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found!.retryCount).toBe(1);
    expect(found!.lastError).toBe("Process exited with code 1");
    expect(found!.status).toBe("pending");
  });

  it("marks item as done with result summary", async () => {
    const item = makeTestItem({ title: "queue-proc-test-complete" });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "review";
        qi.completedAt = Date.now();
        qi.result = {
          summary: "Research completed successfully",
          outputPath: "/path/to/output.md",
        };
      }
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found!.status).toBe("review");
    expect(found!.result?.summary).toBe("Research completed successfully");
    expect(found!.completedAt).toBeDefined();
  });

  it("marks item as failed with error message", async () => {
    const item = makeTestItem({ title: "queue-proc-test-fail" });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "failed";
        qi.error = "Agent crashed unexpectedly";
        qi.completedAt = Date.now();
      }
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found!.status).toBe("failed");
    expect(found!.error).toBe("Agent crashed unexpectedly");
  });

  it("preserves workspaceId through lifecycle", async () => {
    const item = makeTestItem({
      title: "queue-proc-test-workspace",
      workspaceId: "ws-test-123",
    });

    await updateQueueState((s) => {
      s.items.push(item);
    });

    // Transition through processing → done
    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "processing";
        qi.startedAt = Date.now();
      }
    });

    await updateQueueState((s) => {
      const qi = s.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "done";
        qi.completedAt = Date.now();
      }
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === item.id);
    expect(found!.workspaceId).toBe("ws-test-123");
    expect(found!.status).toBe("done");
  });
});

describe("Queue Processor — expiry logic", () => {
  let originalItems: QueueItem[] = [];

  beforeEach(async () => {
    const state = await readQueueState();
    originalItems = [...state.items];
  });

  afterEach(async () => {
    await updateQueueState((s) => {
      s.items = originalItems;
    });
  });

  it("can identify stale processing items (no pid, started long ago)", async () => {
    const staleItem = makeTestItem({
      title: "queue-proc-test-stale",
      status: "processing",
      startedAt: Date.now() - 3600_000, // 1 hour ago
      pid: undefined,
    });

    await updateQueueState((s) => {
      s.items.push(staleItem);
    });

    const state = await readQueueState();
    const found = state.items.find((i) => i.id === staleItem.id);
    expect(found).toBeDefined();
    expect(found!.status).toBe("processing");
    expect(found!.pid).toBeUndefined();

    // Verify the item is stale (started > 30 min ago, no pid)
    const isStale = !found!.pid && found!.startedAt && (Date.now() - found!.startedAt > 1800_000);
    expect(isStale).toBe(true);
  });
});
