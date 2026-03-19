/**
 * Cron Guard Service — Prevents cron jobs from intercepting user messages.
 *
 * Problem: Cron jobs with `sessionTarget: "isolated"` that send messages via
 * iMessage/Slack create separate agent sessions. When the user replies, their
 * reply goes to the isolated session instead of the main Prosper session,
 * effectively "swallowing" the message. The main session never sees it.
 *
 * Fix: On gateway startup, scan cron jobs and auto-patch any messaging cron
 * that uses `sessionTarget: "isolated"`. These should either:
 *   1. Use `sessionTarget: "main"` with `payload.kind: "systemEvent"` (preferred)
 *   2. Be disabled entirely if they have no non-messaging purpose
 *
 * Additionally, provides a runtime guard that can be called from message hooks
 * to detect and warn when an isolated cron session is about to capture replies.
 */

import { readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { localDateString } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

interface CronJobPayload {
  kind: "agentTurn" | "systemEvent";
  message?: string;
  model?: string;
  text?: string;
  timeoutSeconds?: number;
}

interface CronJobDelivery {
  mode: "none" | "announce" | "deliver";
  channel?: string;
  to?: string;
  bestEffort?: boolean;
}

interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  lastDurationMs?: number;
  consecutiveErrors?: number;
  lastDelivered?: boolean;
  lastRunStatus?: string;
  lastDeliveryStatus?: string;
  lastError?: string;
}

interface CronJob {
  id: string;
  agentId?: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: Record<string, unknown>;
  sessionTarget: "isolated" | "main";
  wakeMode?: string;
  payload: CronJobPayload;
  delivery?: CronJobDelivery;
  state?: CronJobState;
  sessionKey?: string;
}

interface CronJobsFile {
  version: number;
  jobs: CronJob[];
}

interface PatchResult {
  jobId: string;
  jobName: string;
  action: "disabled" | "patched-to-main" | "skipped";
  reason: string;
}

// ── Constants ──────────────────────────────────────────────────────

const OPENCLAW_CRON_DIR = join(homedir(), ".openclaw", "cron");
const JOBS_FILE = join(OPENCLAW_CRON_DIR, "jobs.json");

/**
 * Patterns in cron job names/descriptions/payloads that indicate the job
 * sends user-facing messages (iMessage, Slack DM, etc.) and thus can
 * intercept replies when run in an isolated session.
 */
const MESSAGING_PATTERNS = [
  /evening.?review/i,
  /check.?in/i,
  /evening.?checkin/i,
  /auto.?checkpoint.*(?:morning|evening)/i,
  /send.*(?:imessage|sms|slack|message)/i,
  /via\s+imessage/i,
];

/**
 * Keywords in the payload message that indicate the cron job sends messages
 * to the user via a messaging channel.
 */
const PAYLOAD_MESSAGING_KEYWORDS = [
  "send via",
  "iMessage",
  "message tool",
  "via the message tool",
  "Send via iMessage",
  "brain dump",
  "check-in iMessage",
];

// ── Core logic ─────────────────────────────────────────────────────

function isMessagingJob(job: CronJob): boolean {
  // Direct delivery to iMessage is the strongest signal
  if (
    job.delivery?.mode === "announce" &&
    job.delivery.channel === "imessage"
  ) {
    return true;
  }

  // Payload keywords are strong signal regardless of delivery config
  const payloadText = job.payload.message ?? job.payload.text ?? "";
  if (PAYLOAD_MESSAGING_KEYWORDS.some((kw) => payloadText.includes(kw))) return true;

  // Name patterns are a weaker signal — if delivery is explicitly "none"
  // and no payload keywords matched, the job is data processing, not messaging.
  // This prevents false positives on jobs like "Daily Impact Snapshot".
  const nameAndDesc = `${job.name} ${job.description ?? ""}`;
  if (MESSAGING_PATTERNS.some((re) => re.test(nameAndDesc))) {
    if (job.delivery?.mode === "none") return false;
    return true;
  }

  return false;
}

function isDangerousIsolatedJob(job: CronJob): boolean {
  return (
    job.enabled &&
    job.sessionTarget === "isolated" &&
    job.payload.kind === "agentTurn" &&
    isMessagingJob(job)
  );
}

/**
 * Scan cron jobs.json and patch any dangerous isolated messaging jobs.
 *
 * Strategy:
 * - Jobs that send messages to the user AND use `sessionTarget: "isolated"`
 *   are disabled. They should be re-created with `sessionTarget: "main"` and
 *   `payload.kind: "systemEvent"` to inject into the main session safely.
 * - A backup of the original file is created before patching.
 *
 * Returns a list of actions taken.
 */
export async function scanAndPatchCronJobs(
  logger?: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<PatchResult[]> {
  const log = logger ?? { info: console.log, warn: console.warn };
  const results: PatchResult[] = [];

  if (!existsSync(JOBS_FILE)) {
    log.info("[CronGuard] No cron jobs.json found — skipping.");
    return results;
  }

  let raw: string;
  try {
    raw = await readFile(JOBS_FILE, "utf-8");
  } catch (err) {
    log.warn(`[CronGuard] Failed to read jobs.json: ${err instanceof Error ? err.message : String(err)}`);
    return results;
  }

  let jobsFile: CronJobsFile;
  try {
    jobsFile = JSON.parse(raw) as CronJobsFile;
  } catch (err) {
    log.warn(`[CronGuard] Failed to parse jobs.json: ${err instanceof Error ? err.message : String(err)}`);
    return results;
  }

  const dangerousJobs = jobsFile.jobs.filter(isDangerousIsolatedJob);
  if (dangerousJobs.length === 0) {
    log.info("[CronGuard] No dangerous isolated messaging crons found. All clear.");
    return results;
  }

  // Create backup before patching
  const backupPath = join(
    OPENCLAW_CRON_DIR,
    `jobs.json.bak-cronguard-${localDateString()}`,
  );
  try {
    await copyFile(JOBS_FILE, backupPath);
    log.info(`[CronGuard] Backup created at ${backupPath}`);
  } catch (err) {
    log.warn(`[CronGuard] Failed to create backup: ${err instanceof Error ? err.message : String(err)}`);
    // Continue anyway — patching is more important than backup
  }

  // Patch each dangerous job
  let modified = false;
  for (const job of dangerousJobs) {
    // Disable the job — it should be recreated properly
    job.enabled = false;
    job.updatedAtMs = Date.now();
    modified = true;

    results.push({
      jobId: job.id,
      jobName: job.name,
      action: "disabled",
      reason:
        `Isolated session + messaging payload would intercept user replies. ` +
        `Disabled to prevent message swallowing. Recreate with sessionTarget: "main" ` +
        `and payload.kind: "systemEvent" for safe non-intercepting delivery.`,
    });

    log.warn(
      `[CronGuard] DISABLED cron "${job.name}" (${job.id}) — ` +
        `isolated session with messaging payload would swallow user replies.`,
    );
  }

  if (modified) {
    try {
      await writeFile(JOBS_FILE, JSON.stringify(jobsFile, null, 2), "utf-8");
      log.info(`[CronGuard] Patched ${results.length} dangerous cron job(s) in jobs.json`);
    } catch (err) {
      log.warn(
        `[CronGuard] Failed to write patched jobs.json: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return results;
}

/**
 * Check if a session key belongs to a cron-spawned isolated session.
 * Isolated cron sessions typically have session keys like:
 *   "agent:cron:<job-id>" or similar patterns.
 *
 * This is used by message hooks to detect when a cron job is about to
 * capture a reply that should go to the main session.
 */
export function isCronIsolatedSession(sessionKey: string | undefined): boolean {
  if (!sessionKey) return false;
  // Cron sessions spawned by OpenClaw use "agent:cron:" prefix
  if (sessionKey.startsWith("agent:cron:")) return true;
  // Some isolated sessions use a UUID-based key without the main prefix
  // Main sessions always start with "agent:main:"
  // If it doesn't start with "agent:main:" but starts with "agent:", it's likely isolated
  return false;
}

/**
 * Validate a cron job configuration before it's created/updated.
 * Returns an error message if the config is dangerous, or null if safe.
 */
export function validateCronJobConfig(job: {
  sessionTarget: string;
  payload: { kind: string; message?: string; text?: string };
  delivery?: { mode?: string; channel?: string };
}): string | null {
  if (job.sessionTarget !== "isolated") return null;
  if (job.payload.kind !== "agentTurn") return null;

  const payloadText = job.payload.message ?? job.payload.text ?? "";
  const hasMessagingKeyword = PAYLOAD_MESSAGING_KEYWORDS.some((kw) =>
    payloadText.includes(kw),
  );
  const hasMessagingDelivery =
    job.delivery?.mode === "announce" && job.delivery.channel === "imessage";

  if (hasMessagingKeyword || hasMessagingDelivery) {
    return (
      `Cron job uses sessionTarget: "isolated" with a messaging payload. ` +
      `This will create a separate session that intercepts user replies, ` +
      `causing message loss. Use sessionTarget: "main" with ` +
      `payload.kind: "systemEvent" instead.`
    );
  }

  return null;
}
