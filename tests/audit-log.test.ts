/**
 * Tests for audit-log.ts — security audit trail.
 *
 * Tests that audit() writes valid JSONL entries, handles all event types,
 * and never throws (fire-and-forget design).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAppendFile = vi.fn().mockResolvedValue(undefined);
const mockMkdir = vi.fn().mockResolvedValue(undefined);

vi.mock("node:fs/promises", () => ({
  appendFile: (...args: any[]) => mockAppendFile(...args),
  mkdir: (...args: any[]) => mockMkdir(...args),
}));

vi.mock("../src/data-paths.js", () => ({
  DATA_DIR: "/tmp/godmode-test/data",
}));

import { audit, type AuditEvent } from "../src/lib/audit-log.js";

describe("audit", () => {
  beforeEach(() => {
    mockAppendFile.mockClear();
    mockMkdir.mockClear();
  });

  it("writes a valid JSON line to the log file", async () => {
    audit("agent.spawn", { persona: "researcher", taskId: "t-1" });

    // audit is fire-and-forget, give it a tick to complete
    await new Promise((r) => setTimeout(r, 50));

    expect(mockAppendFile).toHaveBeenCalled();
    const written = mockAppendFile.mock.calls[0][1] as string;
    expect(written.endsWith("\n")).toBe(true);

    const parsed = JSON.parse(written.trim());
    expect(parsed.event).toBe("agent.spawn");
    expect(parsed.detail.persona).toBe("researcher");
    expect(parsed.ts).toBeTruthy();
  });

  it("includes ISO timestamp in every entry", async () => {
    audit("webhook.received", { source: "github" });
    await new Promise((r) => setTimeout(r, 50));

    const written = mockAppendFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written.trim());
    // ISO format check
    expect(parsed.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("handles all event types without throwing", () => {
    const events: AuditEvent[] = [
      "agent.spawn",
      "agent.complete",
      "agent.fail",
      "webhook.received",
      "webhook.rejected",
      "queue.approved",
      "queue.added",
      "tool.sensitive",
      "auth.attempt",
      "ratelimit.hit",
      "prompt.sanitized",
    ];

    for (const event of events) {
      expect(() => audit(event, { test: true })).not.toThrow();
    }
  });

  it("never throws even when appendFile rejects", async () => {
    mockAppendFile.mockRejectedValueOnce(new Error("disk full"));

    // Should not throw
    expect(() => audit("agent.fail", { error: "timeout" })).not.toThrow();

    // Wait for the async chain to settle
    await new Promise((r) => setTimeout(r, 50));
  });

  it("never throws even when mkdir rejects", async () => {
    mockMkdir.mockRejectedValueOnce(new Error("permission denied"));

    expect(() => audit("auth.attempt", { user: "test" })).not.toThrow();
    await new Promise((r) => setTimeout(r, 50));
  });

  it("writes detail object faithfully", async () => {
    const detail = {
      taskId: "q-42",
      persona: "content-writer",
      rating: 8,
      nested: { key: "value" },
    };
    audit("queue.approved", detail);
    await new Promise((r) => setTimeout(r, 50));

    const written = mockAppendFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written.trim());
    expect(parsed.detail.taskId).toBe("q-42");
    expect(parsed.detail.rating).toBe(8);
    expect(parsed.detail.nested.key).toBe("value");
  });

  it("handles empty detail object", async () => {
    audit("ratelimit.hit", {});
    await new Promise((r) => setTimeout(r, 50));

    const written = mockAppendFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written.trim());
    expect(parsed.event).toBe("ratelimit.hit");
    expect(parsed.detail).toEqual({});
  });
});
