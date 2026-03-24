/**
 * Tests for workspace-secrets.ts — secure storage for workspace connection secrets.
 * Uses temp directory to avoid touching real secrets.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("workspace-secrets", () => {
  let tmpDir: string;
  let origEnv: string | undefined;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "ws-secrets-test-"));
    origEnv = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = tmpDir;
    // Force re-import to pick up new env
    vi.resetModules();
  });

  afterEach(() => {
    if (origEnv !== undefined) {
      process.env.OPENCLAW_STATE_DIR = origEnv;
    } else {
      delete process.env.OPENCLAW_STATE_DIR;
    }
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("stores and retrieves a secret", async () => {
    const { getWorkspaceSecret, setWorkspaceSecret } = await import(
      "../src/lib/workspace-secrets.js"
    );
    setWorkspaceSecret("ws1", "hubspot-key", "abc123");
    expect(getWorkspaceSecret("ws1", "hubspot-key")).toBe("abc123");
  });

  it("returns null for missing secret", async () => {
    const { getWorkspaceSecret } = await import("../src/lib/workspace-secrets.js");
    expect(getWorkspaceSecret("ws1", "nonexistent")).toBeNull();
  });

  it("deletes a specific secret", async () => {
    const { getWorkspaceSecret, setWorkspaceSecret, deleteWorkspaceSecret } = await import(
      "../src/lib/workspace-secrets.js"
    );
    setWorkspaceSecret("ws1", "key1", "val1");
    setWorkspaceSecret("ws1", "key2", "val2");
    deleteWorkspaceSecret("ws1", "key1");
    expect(getWorkspaceSecret("ws1", "key1")).toBeNull();
    expect(getWorkspaceSecret("ws1", "key2")).toBe("val2");
  });

  it("deletes all secrets for a workspace", async () => {
    const { getWorkspaceSecret, setWorkspaceSecret, deleteWorkspaceSecrets } = await import(
      "../src/lib/workspace-secrets.js"
    );
    setWorkspaceSecret("ws1", "key1", "val1");
    setWorkspaceSecret("ws1", "key2", "val2");
    deleteWorkspaceSecrets("ws1");
    expect(getWorkspaceSecret("ws1", "key1")).toBeNull();
    expect(getWorkspaceSecret("ws1", "key2")).toBeNull();
  });

  it("sets file permissions to 0o600", async () => {
    const { setWorkspaceSecret } = await import("../src/lib/workspace-secrets.js");
    setWorkspaceSecret("ws1", "key", "val");
    const secretsPath = join(tmpDir, "workspace-secrets.json");
    const mode = statSync(secretsPath).mode & 0o777;
    expect(mode).toBe(0o600);
  });
});
