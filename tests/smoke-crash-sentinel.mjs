/**
 * smoke-crash-sentinel.mjs — Verify crash sentinel write/read round-trip.
 *
 * Usage: node tests/smoke-crash-sentinel.mjs
 */

import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const DATA_DIR = process.env.GODMODE_ROOT
  ? join(process.env.GODMODE_ROOT, "data")
  : join(homedir(), "godmode", "data");

const CRASH_SENTINEL_PATH = join(DATA_DIR, "crash-sentinel.json");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

// Clean up any existing sentinel
if (existsSync(CRASH_SENTINEL_PATH)) {
  unlinkSync(CRASH_SENTINEL_PATH);
}

console.log("Crash Sentinel Smoke Test\n");

// Test 1: Write a crash sentinel
console.log("1. Write crash sentinel");
mkdirSync(DATA_DIR, { recursive: true });
const sentinel = {
  ts: Date.now(),
  pid: process.pid,
  error: "Test error: something broke",
  stack: "Error: something broke\n    at test.mjs:1:1",
  type: "uncaughtException",
  activeSessions: ["ally", "test-session"],
};
writeFileSync(CRASH_SENTINEL_PATH, JSON.stringify(sentinel, null, 2), "utf-8");
assert(existsSync(CRASH_SENTINEL_PATH), "Crash sentinel file written");

// Test 2: Read it back
console.log("2. Read crash sentinel");
const raw = readFileSync(CRASH_SENTINEL_PATH, "utf-8");
const parsed = JSON.parse(raw);
assert(parsed.error === "Test error: something broke", "Error message preserved");
assert(parsed.type === "uncaughtException", "Crash type preserved");
assert(parsed.activeSessions.length === 2, "Active sessions preserved");
assert(parsed.pid === process.pid, "PID preserved");

// Test 3: Consume (delete) it
console.log("3. Consume sentinel (one-shot)");
unlinkSync(CRASH_SENTINEL_PATH);
assert(!existsSync(CRASH_SENTINEL_PATH), "Sentinel consumed (deleted)");

// Test 4: Verify downtime calculation works
console.log("4. Downtime calculation");
const downtimeMs = Date.now() - sentinel.ts;
assert(downtimeMs >= 0 && downtimeMs < 5000, `Downtime reasonable: ${downtimeMs}ms`);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
