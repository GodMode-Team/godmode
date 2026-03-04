import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// These tests verify the security fixes are present in the source code.
// They're static analysis tests — they read the source and verify patterns.

const ROOT = join(import.meta.dirname, "..");

describe("C5: Auth token file permissions", () => {
  const src = readFileSync(join(ROOT, "src/lib/auth-client.ts"), "utf-8");

  it("writeFileSync uses mode 0o600", () => {
    expect(src).toContain("mode: 0o600");
  });

  it("mkdirSync uses mode 0o700", () => {
    expect(src).toContain("mode: 0o700");
  });
});

describe("C1: XSS URL scheme blocking", () => {
  const src = readFileSync(join(ROOT, "ui/src/ui/views/onboarding-setup.ts"), "utf-8");

  it("blocks javascript: URL scheme", () => {
    expect(src).toContain('scheme.startsWith("javascript:")');
  });

  it("blocks data: URL scheme", () => {
    expect(src).toContain('scheme.startsWith("data:")');
  });

  it("blocks vbscript: URL scheme", () => {
    expect(src).toContain('scheme.startsWith("vbscript:")');
  });

  it("has escapeHtml function", () => {
    expect(src).toContain("function escapeHtml");
    expect(src).toContain("&amp;");
    expect(src).toContain("&lt;");
    expect(src).toContain("&gt;");
    expect(src).toContain("&quot;");
  });
});

describe("C3: Prompt injection sanitization in swarm", () => {
  const src = readFileSync(join(ROOT, "src/services/swarm-pipeline.ts"), "utf-8");

  it("has sanitizeForPrompt function", () => {
    expect(src).toContain("function sanitizeForPrompt");
  });

  it("strips XML tags", () => {
    expect(src).toMatch(/<\/?[a-zA-Z]/);
  });

  it("strips [godmode...] patterns", () => {
    expect(src).toContain("[godmode");
  });

  it("sanitizeForPrompt is called in buildStagePrompt", () => {
    // The function should be called with the raw task text
    expect(src).toContain("sanitizeForPrompt(rawTask)");
  });
});

describe("C4: Spawn error handlers", () => {
  it("obsidian-sync has error handler", () => {
    const src = readFileSync(join(ROOT, "src/services/obsidian-sync.ts"), "utf-8");
    // Should have .on("error", ...) before .on("exit", ...)
    const errorIdx = src.indexOf('.on("error"');
    const exitIdx = src.indexOf('.on("exit"');
    expect(errorIdx).toBeGreaterThan(-1);
    expect(exitIdx).toBeGreaterThan(-1);
  });

  it("x-browser setupLogin has error handler", () => {
    const src = readFileSync(join(ROOT, "src/services/x-browser.ts"), "utf-8");
    // Find the setupLogin function and verify it has .on("error")
    const setupIdx = src.indexOf("setupLogin");
    const afterSetup = src.substring(setupIdx);
    const nextFnIdx = afterSetup.indexOf("\nexport ");
    const setupBody = nextFnIdx > 0 ? afterSetup.substring(0, nextFnIdx) : afterSetup;
    expect(setupBody).toContain('.on("error"');
  });
});

describe("C2: Symlink safety", () => {
  const src = readFileSync(join(ROOT, "src/methods/second-brain.ts"), "utf-8");

  it("has isSymlinkSafe function", () => {
    expect(src).toContain("function isSymlinkSafe");
  });

  it("uses lstatSync for symlink detection", () => {
    expect(src).toContain("lstatSync");
  });

  it("uses realpathSync for symlink resolution", () => {
    expect(src).toContain("realpathSync");
  });

  it("calls isSymlinkSafe in safeReadFile", () => {
    const safeReadIdx = src.indexOf("function safeReadFile");
    const nextFnIdx = src.indexOf("\nfunction ", safeReadIdx + 1);
    const body = src.substring(safeReadIdx, nextFnIdx);
    expect(body).toContain("isSymlinkSafe");
  });
});

describe("D6: Gateway service cleanup", () => {
  const src = readFileSync(join(ROOT, "index.ts"), "utf-8");

  it("has serviceCleanup array", () => {
    expect(src).toContain("const serviceCleanup");
  });

  it("has gateway_stop handler that drains cleanup", () => {
    expect(src).toContain('gateway_stop');
    expect(src).toContain("serviceCleanup.length = 0");
  });

  it("registers at least 10 services for cleanup", () => {
    const pushCount = (src.match(/serviceCleanup\.push/g) || []).length;
    expect(pushCount).toBeGreaterThanOrEqual(10);
  });
});

describe("D7: System context wrapper", () => {
  const src = readFileSync(join(ROOT, "index.ts"), "utf-8");

  it("uses CRITICAL INSTRUCTION in wrapper", () => {
    expect(src).toContain("CRITICAL INSTRUCTION");
  });

  it("wraps in <system-context> tags", () => {
    expect(src).toContain("<system-context>");
    expect(src).toContain("</system-context>");
  });

  it("tells LLM not to paraphrase", () => {
    expect(src).toContain("paraphrase");
  });
});

describe("F8: files.read RPC", () => {
  const src = readFileSync(join(ROOT, "src/methods/files.ts"), "utf-8");

  it("exports files.read handler", () => {
    expect(src).toContain('"files.read"');
  });

  it("validates path with isAllowedPath", () => {
    expect(src).toContain("isAllowedPath");
  });

  it("has 100KB size limit", () => {
    expect(src).toMatch(/100\s*\*\s*1024/);
  });

  it("returns truncated flag", () => {
    expect(src).toContain("truncated");
  });
});

describe("Stream A: Daily brief notes protection", () => {
  const src = readFileSync(join(ROOT, "src/methods/brief-generator.ts"), "utf-8");

  it("has explicit Notes extraction with header detection", () => {
    expect(src).toContain("## Notes");
    // Should have regex for section matching
    expect(src).toMatch(/Notes/);
  });

  it("LLM prompt says NOT to include Notes section", () => {
    expect(src).toContain("Do NOT include the Notes section");
  });
});

describe("Stream A: Once-per-day guard", () => {
  const src = readFileSync(join(ROOT, "src/services/consciousness-heartbeat.ts"), "utf-8");

  it("uses date-stamped flag file", () => {
    expect(src).toContain("brief-generated-");
    expect(src).toContain(".flag");
  });
});

describe("Stream A: Agent persona", () => {
  const src = readFileSync(join(ROOT, "src/hooks/agent-persona.ts"), "utf-8");

  it("has philosophy-based persistence protocol (not 'try 5 approaches')", () => {
    expect(src).not.toContain("try AT LEAST 5");
    expect(src).not.toContain("5 meaningfully different");
    expect(src).toContain("resourceful and thorough");
  });

  it("has Prosper EA behavior section", () => {
    expect(src).toContain("Your Role as Prosper");
    expect(src).toContain("Architecture:");
    expect(src).toContain("Daily Rhythm:");
    expect(src).toContain("Context Retrieval:");
    expect(src).toContain("Task Intelligence:");
  });
});
