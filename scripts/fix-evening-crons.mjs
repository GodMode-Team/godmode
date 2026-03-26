#!/usr/bin/env node
/**
 * fix-evening-crons.mjs — One-time repair script for the evening/overnight cron pipeline.
 *
 * Fixes:
 * 1. Evening Review (9 PM): converts from isolated+agentTurn to main+systemEvent, re-enables
 * 2. Daily Impact Snapshot (8:50 PM): re-enables (safe isolated data processing)
 * 3. Daily Brief End of Day Review (2 AM): re-enables (safe isolated data processing)
 * 4. Daily Impact Report (1:30 AM): re-enables (safe isolated data processing)
 *
 * Safe to re-run — checks current state before patching.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const JOBS_FILE = join(homedir(), ".openclaw", "cron", "jobs.json");

if (!existsSync(JOBS_FILE)) {
  console.error("Error: ~/.openclaw/cron/jobs.json not found");
  process.exit(1);
}

// Create timestamped backup
const now = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupPath = `${JOBS_FILE}.bak-evening-fix-${now}`;
copyFileSync(JOBS_FILE, backupPath);
console.log(`Backup: ${backupPath}`);

const data = JSON.parse(readFileSync(JOBS_FILE, "utf-8"));
const changes = [];

// ── 1. Fix Evening Review - 9PM ──────────────────────────────────

const eveningReview = data.jobs.find(
  (j) => j.name === "Evening Review - 9PM" || j.id === "3556bc91-2fe6-4fdf-8085-7d96537fcb29",
);

if (eveningReview) {
  const wasEnabled = eveningReview.enabled;
  const wasSessionTarget = eveningReview.sessionTarget;
  const wasPayloadKind = eveningReview.payload?.kind;

  eveningReview.enabled = true;
  eveningReview.sessionTarget = "main";
  eveningReview.wakeMode = "now";
  eveningReview.payload = {
    kind: "systemEvent",
    text: [
      "EVENING REVIEW (9 PM): Time for the evening check-in.",
      "Run the evening-review skill — gather today's context",
      "(daily brief, agent log, sessions, tomorrow's calendar),",
      "compose a warm personal iMessage check-in (under 800 chars),",
      "and send it via the message tool.",
      "",
      "After sending, stay present for the user's reply.",
      "When they respond, handle it naturally:",
      "capture their reflection to the daily brief via dailyBrief.eveningCapture,",
      "extract any tasks they mention and create them,",
      "queue any work they want done overnight via queue_add,",
      "and if you're not sure what to prioritize, ask.",
      "This is a conversation, not a form.",
    ].join(" "),
  };
  eveningReview.delivery = { mode: "none" };
  eveningReview.updatedAtMs = Date.now();

  const whatChanged = [];
  if (!wasEnabled) whatChanged.push("re-enabled");
  if (wasSessionTarget !== "main") whatChanged.push(`sessionTarget: ${wasSessionTarget} → main`);
  if (wasPayloadKind !== "systemEvent") whatChanged.push(`payload.kind: ${wasPayloadKind} → systemEvent`);

  if (whatChanged.length > 0) {
    changes.push(`Evening Review - 9PM: ${whatChanged.join(", ")}`);
  } else {
    changes.push("Evening Review - 9PM: already correct");
  }
} else {
  console.warn("Warning: 'Evening Review - 9PM' job not found in jobs.json");
}

// ── 2. Re-enable data processing jobs ────────────────────────────

const dataJobs = [
  { id: "acfd50b6-0c9c-48ad-81fe-d8df6c3a3ff2", name: "Daily Impact Snapshot - 8:50PM" },
  { id: "3d14fcde-f104-468f-9d50-bce9307991fc", name: "Daily Brief - 2AM End of Day Review" },
  { id: "97c1bd18-cd5c-4d37-aaa4-53d755f01d37", name: "Daily Impact Report - 1:30AM" },
];

for (const { id, name } of dataJobs) {
  const job = data.jobs.find((j) => j.id === id || j.name === name);
  if (job) {
    if (!job.enabled) {
      job.enabled = true;
      job.updatedAtMs = Date.now();
      changes.push(`${name}: re-enabled`);
    } else {
      changes.push(`${name}: already enabled`);
    }
  } else {
    console.warn(`Warning: '${name}' job not found in jobs.json`);
  }
}

// ── Write back ───────────────────────────────────────────────────

writeFileSync(JOBS_FILE, JSON.stringify(data, null, 2), "utf-8");

console.log("\nChanges applied:");
for (const change of changes) {
  console.log(`  - ${change}`);
}
console.log(`\nDone. Restart gateway to apply: openclaw gateway restart`);
