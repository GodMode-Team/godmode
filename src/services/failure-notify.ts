/**
 * failure-notify.ts — Detect and surface cron/exec failures.
 *
 * Reads OpenClaw's cron jobs.json to find jobs with errors, and
 * broadcasts alerts through the gateway so the ally can notify the user
 * instead of failing silently.
 *
 * Called by the consciousness heartbeat on each tick.
 */

import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { DATA_DIR } from "../data-paths.js";

// ── Types ─────────────────────────────────────────────────────────────

type CronJobState = {
  lastRunAtMs?: number;
  lastStatus?: string;
  consecutiveErrors?: number;
  lastError?: string;
  lastDurationMs?: number;
};

type CronJob = {
  id: string;
  name: string;
  enabled: boolean;
  state: CronJobState;
  delivery?: { mode?: string };
};

export type FailureSummary = {
  cronErrors: Array<{
    name: string;
    consecutiveErrors: number;
    lastStatus: string;
    lastRunAt: string | null;
  }>;
  hasNewFailures: boolean;
};

// ── State: track which failures we've already notified about ──────────

const NOTIFIED_STATE_FILE = join(DATA_DIR, "failure-notify-state.json");
let notifiedErrors: Record<string, number> = {}; // jobId → consecutiveErrors we last notified about

function loadNotifiedState(): void {
  try {
    if (existsSync(NOTIFIED_STATE_FILE)) {
      notifiedErrors = JSON.parse(readFileSync(NOTIFIED_STATE_FILE, "utf-8"));
    }
  } catch {
    notifiedErrors = {};
  }
}

function saveNotifiedState(): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(NOTIFIED_STATE_FILE, JSON.stringify(notifiedErrors), "utf-8");
  } catch {
    // Non-fatal
  }
}

// ── Core: scan for failures ───────────────────────────────────────────

function resolveCronJobsPath(): string {
  const stateDir = process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw");
  return join(stateDir, "cron", "jobs.json");
}

async function readCronJobs(): Promise<CronJob[]> {
  const cronPath = resolveCronJobsPath();
  if (!existsSync(cronPath)) return [];

  const raw = await readFile(cronPath, "utf-8");
  const parsed = JSON.parse(raw);

  // jobs.json can be an array or object with various shapes
  if (Array.isArray(parsed)) return parsed;
  if (parsed.jobs && Array.isArray(parsed.jobs)) return parsed.jobs;
  if (parsed.entries && Array.isArray(parsed.entries)) return parsed.entries;

  // Might be keyed by ID
  const values = Object.values(parsed).filter(
    (v): v is CronJob => typeof v === "object" && v !== null && "state" in (v as object),
  );
  return values;
}

/**
 * Scan cron jobs for failures. Returns a summary of all erroring jobs
 * and whether there are NEW failures since the last check.
 */
export async function scanForFailures(): Promise<FailureSummary> {
  loadNotifiedState();

  const jobs = await readCronJobs();
  const cronErrors: FailureSummary["cronErrors"] = [];
  let hasNewFailures = false;

  for (const job of jobs) {
    if (!job.enabled) continue;
    const errors = job.state?.consecutiveErrors ?? 0;
    if (errors === 0 && job.state?.lastStatus !== "error") continue;

    const lastRunAt = job.state?.lastRunAtMs
      ? new Date(job.state.lastRunAtMs).toISOString()
      : null;

    cronErrors.push({
      name: job.name || job.id,
      consecutiveErrors: errors,
      lastStatus: job.state?.lastStatus || "unknown",
      lastRunAt,
    });

    // Check if this is a NEW failure (higher error count than last notified)
    const prevNotified = notifiedErrors[job.id] ?? 0;
    if (errors > prevNotified) {
      hasNewFailures = true;
      notifiedErrors[job.id] = errors;
    }
  }

  // Clean up jobs that recovered (errors back to 0)
  for (const job of jobs) {
    if ((job.state?.consecutiveErrors ?? 0) === 0 && notifiedErrors[job.id]) {
      delete notifiedErrors[job.id];
    }
  }

  if (hasNewFailures) {
    saveNotifiedState();
  }

  return { cronErrors, hasNewFailures };
}

/**
 * Format failure summary for injection into awareness snapshot.
 * Returns null if no failures.
 */
export function formatFailuresForSnapshot(summary: FailureSummary): string | null {
  if (summary.cronErrors.length === 0) return null;

  const lines = ["## Cron Failures (ACTION REQUIRED)"];
  lines.push("These cron jobs are failing. Tell the user proactively.");
  for (const err of summary.cronErrors) {
    lines.push(`- ${err.name}: ${err.consecutiveErrors} consecutive errors (last: ${err.lastRunAt ?? "unknown"})`);
  }
  return lines.join("\n");
}

/**
 * Format a notification message for broadcasting to the user.
 * Only includes NEW failures to avoid spam.
 */
export function formatFailureNotification(summary: FailureSummary): string | null {
  if (!summary.hasNewFailures) return null;

  const newErrors = summary.cronErrors.filter((e) => e.consecutiveErrors > 0);
  if (newErrors.length === 0) return null;

  const parts = newErrors.map(
    (e) => `${e.name} (${e.consecutiveErrors} failures)`,
  );
  return `Cron job failures detected: ${parts.join(", ")}. Check and fix these before they pile up.`;
}
