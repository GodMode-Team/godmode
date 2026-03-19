/**
 * audit-log.ts — Security audit trail for GodMode.
 *
 * Logs sensitive operations (agent spawns, webhook calls, file access,
 * tool invocations) to ~/godmode/data/audit-log.jsonl.
 * Append-only, one JSON object per line. Designed for post-incident review.
 */

import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

const AUDIT_LOG_PATH = join(DATA_DIR, "audit-log.jsonl");

export type AuditEvent =
  | "agent.spawn"
  | "agent.complete"
  | "agent.fail"
  | "webhook.received"
  | "webhook.rejected"
  | "queue.approved"
  | "queue.added"
  | "tool.sensitive"
  | "auth.attempt"
  | "ratelimit.hit";

export interface AuditEntry {
  ts: string;
  event: AuditEvent;
  detail: Record<string, unknown>;
}

let initialized = false;

async function ensureDir(): Promise<void> {
  if (initialized) return;
  await mkdir(DATA_DIR, { recursive: true }).catch(() => {});
  initialized = true;
}

/**
 * Append an audit entry. Fire-and-forget — never throws, never blocks.
 */
export function audit(event: AuditEvent, detail: Record<string, unknown>): void {
  const entry: AuditEntry = {
    ts: new Date().toISOString(),
    event,
    detail,
  };
  const line = JSON.stringify(entry) + "\n";
  // Fire-and-forget — audit logging must never crash the host
  ensureDir()
    .then(() => appendFile(AUDIT_LOG_PATH, line))
    .catch(() => {});
}
