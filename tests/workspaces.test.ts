/**
 * Tests for workspace config utilities — path resolution, workspace ID creation,
 * and workspace detection from text.
 */

import { describe, it, expect } from "vitest";
import {
  expandPath,
  collapsePath,
  createWorkspaceId,
  normalizePinnedPath,
  resolvePathInWorkspace,
  detectWorkspaceFromText,
  toDisplayPath,
  type WorkspaceConfigEntry,
  type WorkspaceConfigFile,
} from "../src/lib/workspaces-config.js";
import { homedir } from "node:os";
import { join } from "node:path";

// ── Path Expansion / Collapse ────────────────────────────────────

describe("expandPath / collapsePath", () => {
  const home = homedir();

  it("expandPath resolves ~ to home directory", () => {
    expect(expandPath("~/Projects/test")).toBe(join(home, "Projects", "test"));
  });

  it("expandPath returns absolute paths as-is", () => {
    expect(expandPath("/usr/local/bin")).toBe("/usr/local/bin");
  });

  it("collapsePath replaces home dir with ~", () => {
    expect(collapsePath(join(home, "Projects", "test"))).toBe("~/Projects/test");
  });

  it("collapsePath leaves non-home paths unchanged", () => {
    expect(collapsePath("/tmp/test")).toBe("/tmp/test");
  });

  it("round-trips through expand → collapse", () => {
    const path = "~/godmode/memory";
    expect(collapsePath(expandPath(path))).toBe(path);
  });
});

// ── Workspace ID Creation ────────────────────────────────────────

describe("createWorkspaceId", () => {
  it("creates a slugified ID from name", () => {
    const id = createWorkspaceId("My Cool Project", new Set());
    expect(id).toMatch(/^my-cool-project/);
  });

  it("appends suffix when ID already exists", () => {
    const existing = new Set(["my-project"]);
    const id = createWorkspaceId("My Project", existing);
    expect(id).not.toBe("my-project");
    expect(id).toMatch(/^my-project/);
  });

  it("handles empty name gracefully", () => {
    const id = createWorkspaceId("", new Set());
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("handles special characters in name", () => {
    const id = createWorkspaceId("Project @#$ 123!", new Set());
    expect(id).toMatch(/^[a-z0-9-]+$/);
  });
});

// ── Path in Workspace ────────────────────────────────────────────

describe("resolvePathInWorkspace", () => {
  it("resolves relative path within workspace", () => {
    const result = resolvePathInWorkspace("/Users/test/project", "src/index.ts");
    expect(result).toBe("/Users/test/project/src/index.ts");
  });

  it("returns null for path outside workspace", () => {
    const result = resolvePathInWorkspace("/Users/test/project", "/absolute/path.ts");
    expect(result).toBeNull();
  });
});

// ── Workspace Detection ──────────────────────────────────────────

describe("detectWorkspaceFromText", () => {
  function makeWorkspaceConfig(workspaces: Partial<WorkspaceConfigEntry>[] = []): WorkspaceConfigFile {
    return {
      version: "1.0",
      workspaces: workspaces.map((ws) => ({
        id: ws.id ?? "test-ws",
        name: ws.name ?? "Test Workspace",
        emoji: ws.emoji ?? "📁",
        type: ws.type ?? "project",
        path: ws.path ?? "/tmp/test",
        keywords: ws.keywords ?? [],
        pinned: ws.pinned ?? [],
        pinnedSessions: ws.pinnedSessions ?? [],
        artifactDirs: ws.artifactDirs ?? ["outputs"],
      })),
    };
  }

  it("returns null for empty text", () => {
    const result = detectWorkspaceFromText(makeWorkspaceConfig(), "");
    expect(result.workspaceId).toBeNull();
  });

  it("returns null when no workspaces configured", () => {
    const result = detectWorkspaceFromText(makeWorkspaceConfig(), "work on the project");
    expect(result.workspaceId).toBeNull();
  });

  it("detects workspace from keyword in text", () => {
    const config = makeWorkspaceConfig([
      {
        id: "my-project",
        name: "My Project",
        path: "/Users/test/projects/my-project",
      },
    ]);
    const result = detectWorkspaceFromText(
      config,
      "Look at my-project for the source code",
    );
    expect(result.workspaceId).toBe("my-project");
  });
});

// ── Display Path ─────────────────────────────────────────────────

describe("toDisplayPath", () => {
  const home = homedir();

  it("collapses home directory to ~", () => {
    expect(toDisplayPath(join(home, "Projects", "test"))).toBe("~/Projects/test");
  });
});
