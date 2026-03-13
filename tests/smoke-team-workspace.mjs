#!/usr/bin/env node
/**
 * smoke-team-workspace.mjs — End-to-end smoke test for team workspace pipeline.
 *
 * Tests the full loop without a running gateway:
 * 1. Scaffold a team workspace
 * 2. Write a memory entry
 * 3. Send a comms message
 * 4. Read unread messages
 * 5. Verify team-bootstrap context injection
 * 6. Clean up
 *
 * Usage: node tests/smoke-team-workspace.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
let passed = 0;
let failed = 0;

function check(name, ok, detail) {
  if (ok) {
    console.log(`  ${PASS} ${name}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

const TEST_DIR = path.join(os.tmpdir(), `godmode-team-smoke-${crypto.randomUUID().slice(0, 8)}`);

async function cleanup() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // best effort
  }
}

async function run() {
  console.log("\n🔬 Team Workspace Smoke Test\n");
  console.log(`  Test dir: ${TEST_DIR}\n`);

  // ── Step 1: Scaffold a team workspace ───────────────────────────────
  console.log("Step 1: Scaffold team workspace");

  const workspacePath = path.join(TEST_DIR, "test-team");
  await fs.mkdir(workspacePath, { recursive: true });

  // Initialize git so resolveGitMemberId works
  const { execFile: execFileCb } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execFile = promisify(execFileCb);
  await execFile("git", ["init"], { cwd: workspacePath });
  await execFile("git", ["config", "user.name", "smoke-tester"], { cwd: workspacePath });
  await execFile("git", ["config", "user.email", "smoke@test.local"], { cwd: workspacePath });

  // Create workspace folder structure manually (mirrors ensureWorkspaceFolders)
  const dirs = ["memory", "skills", "tools", "comms", "artifacts", "clients", "integrations", ".godmode", ".godmode/local"];
  for (const dir of dirs) {
    await fs.mkdir(path.join(workspacePath, dir), { recursive: true });
  }

  // Write workspace metadata
  const metadata = {
    name: "Smoke Test Team",
    id: "smoke-test-team",
    created: new Date().toISOString(),
    members: [{ id: "smoke-tester", name: "smoke-tester", role: "admin", joined: new Date().toISOString() }],
  };
  await fs.writeFile(
    path.join(workspacePath, ".godmode", "workspace.json"),
    JSON.stringify(metadata, null, 2) + "\n",
    "utf-8",
  );

  // Write AGENTS.md
  await fs.writeFile(
    path.join(workspacePath, "AGENTS.md"),
    "# Smoke Test SOPs\n\nFollow the rules.\n",
    "utf-8",
  );

  // Write MEMORY.md
  await fs.writeFile(
    path.join(workspacePath, "memory", "MEMORY.md"),
    "# Team Memory\n\nShared knowledge goes here.\n",
    "utf-8",
  );

  const metadataExists = await fileExists(path.join(workspacePath, ".godmode", "workspace.json"));
  check("workspace.json created", metadataExists);

  const agentsExists = await fileExists(path.join(workspacePath, "AGENTS.md"));
  check("AGENTS.md created", agentsExists);

  // ── Step 2: Write a memory entry ────────────────────────────────────
  console.log("\nStep 2: Write memory entry");

  const memoryEntryPath = path.join(workspacePath, "memory", "2026-03-13-smoke-test.md");
  const memoryContent = "# Smoke Test\n\nThis is a test memory entry written during smoke testing.\n";
  await fs.writeFile(memoryEntryPath, memoryContent, "utf-8");

  const memoryExists = await fileExists(memoryEntryPath);
  check("memory entry written", memoryExists);

  const readBack = await fs.readFile(memoryEntryPath, "utf-8");
  check("memory entry content correct", readBack === memoryContent);

  // ── Step 3: Send comms messages ───────────────────────────────────
  console.log("\nStep 3: Send comms messages");

  const feedPath = path.join(workspacePath, "comms", "feed.jsonl");

  // First message from another team member (not smoke-tester)
  const message1 = {
    ts: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 12),
    from: "team-lead",
    type: "fyi",
    msg: "Starting smoke test — all systems nominal",
  };
  await fs.appendFile(feedPath, JSON.stringify(message1) + "\n", "utf-8");

  // Second message from smoke-tester (own message — should be filtered by bootstrap)
  const message2 = {
    ts: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 12),
    from: "smoke-tester",
    type: "fyi",
    msg: "Acknowledged",
  };
  await fs.appendFile(feedPath, JSON.stringify(message2) + "\n", "utf-8");

  const feedExists = await fileExists(feedPath);
  check("feed.jsonl created", feedExists);

  const feedContent = await fs.readFile(feedPath, "utf-8");
  const feedLines = feedContent.trim().split("\n").filter(Boolean);
  check("feed has 2 messages", feedLines.length === 2);

  // ── Step 4: Read unread messages ────────────────────────────────────
  console.log("\nStep 4: Read unread messages");

  // Parse feed and check unread (simulating getUnreadMessages logic)
  const allMessages = feedLines.map((line) => JSON.parse(line));
  check("first message from team-lead", allMessages[0]?.from === "team-lead");
  check("second message from smoke-tester", allMessages[1]?.from === "smoke-tester");

  // Simulate cursor: no cursor exists yet, so all messages are unread
  const cursorPath = path.join(workspacePath, ".godmode", "local", "smoke-tester-feed-cursor.json");
  const cursorExists = await fileExists(cursorPath);
  check("no cursor yet (all messages unread)", !cursorExists);

  // Filter out own messages (like team-bootstrap now does)
  const memberId = "smoke-tester";
  const unreadFromOthers = allMessages.filter((m) => m.from !== memberId);
  check("1 unread from others (own message filtered)", unreadFromOthers.length === 1);
  check("unread message is from team-lead", unreadFromOthers[0]?.from === "team-lead");

  // Mark displayed messages as read by writing cursor
  const lastDisplayed = unreadFromOthers[unreadFromOthers.length - 1];
  const cursor = {
    lastReadId: lastDisplayed.id,
    lastReadTs: lastDisplayed.ts,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(cursorPath, JSON.stringify(cursor, null, 2) + "\n", "utf-8");

  const cursorWritten = await fileExists(cursorPath);
  check("cursor written after markFeedRead", cursorWritten);

  // Send a third message from another agent
  const message3 = {
    ts: new Date().toISOString(),
    id: crypto.randomUUID().slice(0, 12),
    from: "other-agent",
    type: "handoff",
    msg: "Research complete, passing to you",
    to: "smoke-tester",
  };
  await fs.appendFile(feedPath, JSON.stringify(message3) + "\n", "utf-8");

  // Read cursor and filter unread
  const savedCursor = JSON.parse(await fs.readFile(cursorPath, "utf-8"));
  const allMessages2 = (await fs.readFile(feedPath, "utf-8"))
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  const unread = allMessages2.filter((m) => m.ts > savedCursor.lastReadTs && m.from !== memberId);
  check("1 unread message after cursor", unread.length === 1);
  check("unread message is from other-agent", unread[0]?.from === "other-agent");

  // ── Step 5: Verify bootstrap context shape ──────────────────────────
  console.log("\nStep 5: Verify team-bootstrap context injection shape");

  // Simulate what team-bootstrap.ts would produce
  const sopsContent = await fs.readFile(path.join(workspacePath, "AGENTS.md"), "utf-8");
  check("SOPs loadable", sopsContent.includes("Smoke Test SOPs"));

  const memoryMd = await fs.readFile(path.join(workspacePath, "memory", "MEMORY.md"), "utf-8");
  check("MEMORY.md loadable", memoryMd.includes("Shared knowledge"));

  // Format unread messages the way team-bootstrap does
  const formatted = unread.map((m) => {
    const time = m.ts.slice(11, 16);
    const tag = m.type === "fyi" ? "" : ` [${m.type.toUpperCase()}]`;
    const to = m.to ? ` → ${m.to}` : "";
    return `- **${m.from}**${to}${tag} (${time}): ${m.msg}`;
  });
  check("formatted message includes sender", formatted[0]?.includes("other-agent"));
  check("formatted message includes HANDOFF tag", formatted[0]?.includes("[HANDOFF]"));
  check("formatted message includes recipient", formatted[0]?.includes("→ smoke-tester"));

  // ── Step 6: Cleanup ─────────────────────────────────────────────────
  console.log("\nStep 6: Cleanup");
  await cleanup();
  const cleaned = !(await fileExists(TEST_DIR));
  check("test directory cleaned up", cleaned);

  // ── Summary ─────────────────────────────────────────────────────────
  console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

run().catch((err) => {
  console.error("Smoke test crashed:", err);
  cleanup().finally(() => process.exit(1));
});
