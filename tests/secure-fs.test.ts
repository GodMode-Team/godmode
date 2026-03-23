import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { tmpdir } from "node:os";
import {
  statSync,
  readFileSync,
  existsSync,
  rmSync,
  mkdirSync,
} from "node:fs";
import {
  secureWriteFile,
  secureWriteFileSync,
  secureMkdir,
  secureMkdirSync,
  sanitizeError,
} from "../src/lib/secure-fs.js";

// ── helpers ──────────────────────────────────────────────────────────

function tempDir(): string {
  const suffix = randomBytes(8).toString("hex");
  return join(tmpdir(), `secure-fs-test-${suffix}`);
}

// ── sanitizeError ────────────────────────────────────────────────────

describe("sanitizeError", () => {
  const home = homedir();

  it("strips home directory path and replaces with ~", () => {
    const msg = `Failed to read ${home}/godmode/data/state.json`;
    expect(sanitizeError(msg)).toBe("Failed to read ~/godmode/data/state.json");
  });

  it("works with Error objects", () => {
    const err = new Error(`ENOENT: no such file ${home}/missing.txt`);
    expect(sanitizeError(err)).toBe("ENOENT: no such file ~/missing.txt");
  });

  it("works with plain strings", () => {
    const msg = `cannot open ${home}/secret`;
    expect(sanitizeError(msg)).toBe("cannot open ~/secret");
  });

  it("handles multiple occurrences of the home dir", () => {
    const msg = `cp ${home}/a ${home}/b`;
    expect(sanitizeError(msg)).toBe("cp ~/a ~/b");
  });

  it("returns the string unchanged when no home dir is present", () => {
    expect(sanitizeError("plain error")).toBe("plain error");
  });
});

// ── secureWriteFile (async) ──────────────────────────────────────────

describe("secureWriteFile", () => {
  let dir: string;

  beforeEach(() => {
    dir = tempDir();
    mkdirSync(dir, { recursive: true });
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes the correct content to disk", async () => {
    const target = join(dir, "test.txt");
    await secureWriteFile(target, "hello world");
    expect(readFileSync(target, "utf-8")).toBe("hello world");
  });

  it("does not leave a .tmp file behind after success", async () => {
    const target = join(dir, "clean.txt");
    await secureWriteFile(target, "data");
    expect(existsSync(target + ".tmp")).toBe(false);
  });

  it("overwrites an existing file atomically", async () => {
    const target = join(dir, "overwrite.txt");
    await secureWriteFile(target, "first");
    await secureWriteFile(target, "second");
    expect(readFileSync(target, "utf-8")).toBe("second");
  });
});

// ── secureWriteFileSync ──────────────────────────────────────────────

describe("secureWriteFileSync", () => {
  let dir: string;

  beforeEach(() => {
    dir = tempDir();
    mkdirSync(dir, { recursive: true });
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes the correct content to disk", () => {
    const target = join(dir, "sync.txt");
    secureWriteFileSync(target, "sync content");
    expect(readFileSync(target, "utf-8")).toBe("sync content");
  });

  it("does not leave a .tmp file behind after success", () => {
    const target = join(dir, "sync-clean.txt");
    secureWriteFileSync(target, "data");
    expect(existsSync(target + ".tmp")).toBe(false);
  });
});

// ── secureMkdir (async) ──────────────────────────────────────────────

describe("secureMkdir", () => {
  let dir: string;

  beforeEach(() => {
    dir = tempDir();
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("creates the directory", async () => {
    const target = join(dir, "sub");
    await secureMkdir(target);
    expect(existsSync(target)).toBe(true);
    expect(statSync(target).isDirectory()).toBe(true);
  });

  it("creates nested directories recursively", async () => {
    const target = join(dir, "a", "b", "c");
    await secureMkdir(target);
    expect(existsSync(target)).toBe(true);
  });
});

// ── secureMkdirSync ──────────────────────────────────────────────────

describe("secureMkdirSync", () => {
  let dir: string;

  beforeEach(() => {
    dir = tempDir();
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("creates the directory", () => {
    const target = join(dir, "sub");
    secureMkdirSync(target);
    expect(existsSync(target)).toBe(true);
    expect(statSync(target).isDirectory()).toBe(true);
  });

  it("creates nested directories recursively", () => {
    const target = join(dir, "x", "y", "z");
    secureMkdirSync(target);
    expect(existsSync(target)).toBe(true);
  });
});
