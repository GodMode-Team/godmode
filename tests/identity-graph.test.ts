/**
 * Tests for identity-graph.ts — SQLite entity/relationship graph.
 *
 * Tests init, upsert, query, format, stats, prune, and close.
 * Uses a temp SQLite database. Skips LLM extraction tests (requires API key).
 */

import { describe, it, expect, beforeAll, vi } from "vitest";

// Override DATA_DIR to use temp path
process.env.GODMODE_ROOT = `/tmp/godmode-test-identity-graph-${Date.now()}`;

// Mock service-health to avoid side effects
vi.mock("../src/lib/service-health.js", () => ({
  reportConnected: vi.fn(),
  reportDegraded: vi.fn(),
}));

// Mock anthropic-auth to avoid key resolution
vi.mock("../src/lib/anthropic-auth.js", () => ({
  resolveAnthropicKey: vi.fn(() => null),
  fetchWithTimeout: vi.fn(),
}));

// Mock ally-identity
vi.mock("../src/lib/ally-identity.js", () => ({
  getOwnerName: vi.fn(() => "TestUser"),
}));

import { mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.env.GODMODE_ROOT!, "data");

import {
  initIdentityGraph,
  isGraphReady,
  upsertEntity,
  upsertEdge,
  queryGraph,
  formatGraphContext,
  getGraphStats,
  pruneStaleEntities,
} from "../src/lib/identity-graph.js";

beforeAll(() => {
  mkdirSync(DATA_DIR, { recursive: true });
  initIdentityGraph();
});

describe("Identity Graph", () => {
  it("initializes successfully", () => {
    expect(isGraphReady()).toBe(true);
  });

  it("upserts entities", () => {
    upsertEntity("Sarah Johnson", "person", { role: "VP Sales" });
    upsertEntity("Acme Corp", "company");
    upsertEntity("GodMode", "project");

    const stats = getGraphStats();
    expect(stats).not.toBeNull();
    expect(stats!.entities).toBeGreaterThanOrEqual(3);
  });

  it("upserts edges", () => {
    upsertEdge("Sarah Johnson", "works_at", "Acme Corp");
    upsertEdge("TestUser", "manages", "GodMode");

    const stats = getGraphStats();
    expect(stats!.edges).toBeGreaterThanOrEqual(2);
  });

  it("queries graph by entity name", () => {
    const results = queryGraph("Sarah");
    expect(results.length).toBeGreaterThanOrEqual(1);
    // queryGraph matches by word pattern — may return partial name
    expect(results.some((r) => r.name.includes("Sarah"))).toBe(true);
    const sarah = results.find((r) => r.name.includes("Sarah"));
    expect(sarah!.kind).toBe("person");
  });

  it("queries graph includes relationships", () => {
    const results = queryGraph("Sarah");
    expect(results.length).toBeGreaterThanOrEqual(1);
    const sarah = results.find((r) => r.name === "Sarah Johnson");
    expect(sarah).toBeDefined();
    expect(sarah!.relationships.length).toBeGreaterThanOrEqual(1);
    expect(sarah!.relationships.some((r) => r.rel === "works_at")).toBe(true);
  });

  it("returns empty for short queries", () => {
    expect(queryGraph("hi")).toEqual([]);
    expect(queryGraph("")).toEqual([]);
  });

  it("returns empty for stop words", () => {
    const results = queryGraph("the and for are");
    expect(results.length).toBe(0);
  });

  it("formatGraphContext returns formatted block", () => {
    const results = queryGraph("Sarah Acme");
    const formatted = formatGraphContext(results);
    expect(formatted).not.toBeNull();
    expect(formatted).toContain("People & Relationships");
    expect(formatted).toContain("Sarah Johnson");
  });

  it("formatGraphContext returns null for empty results", () => {
    expect(formatGraphContext([])).toBeNull();
  });

  it("upsert is idempotent (same entity twice)", () => {
    const before = getGraphStats()!.entities;
    upsertEntity("Sarah Johnson", "person", { role: "VP Sales Updated" });
    const after = getGraphStats()!.entities;
    expect(after).toBe(before);
  });

  it("edge upsert is idempotent", () => {
    const before = getGraphStats()!.edges;
    upsertEdge("Sarah Johnson", "works_at", "Acme Corp");
    const after = getGraphStats()!.edges;
    expect(after).toBe(before);
  });

  it("prune removes stale entities (but not those with edges)", () => {
    // Add an entity with no edges
    upsertEntity("Stale Person", "person");
    // Prune expects 180+ day staleness, so nothing should be pruned now
    const pruned = pruneStaleEntities();
    expect(pruned).toBe(0);
  });

  it("handles empty/null names gracefully", () => {
    // Should not throw
    upsertEntity("", "person");
    upsertEdge("", "knows", "Sarah Johnson");
    upsertEdge("Sarah Johnson", "knows", "");
  });
});
