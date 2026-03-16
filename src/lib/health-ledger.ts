/**
 * health-ledger.ts — Central health signal registry for GodMode.
 *
 * Every subsystem operation emits a signal: success or failure, with timing.
 * The ledger is a fixed-size ring buffer per subsystem — no unbounded growth.
 * Self-heal reads the ledger to diagnose issues. The UI reads it for the
 * health dashboard. The ally reads it to know when to warn the user.
 *
 * This is the OBSERVE phase of the control loop:
 *   OBSERVE → DIAGNOSE → REPAIR → VERIFY
 *
 * Usage:
 *   import { health } from "../lib/health-ledger.js";
 *   health.signal("memory.search", true, { results: 4, elapsed: 280 });
 *   health.signal("memory.ingest", false, { error: "timeout" });
 */

// ── Types ────────────────────────────────────────────────────────────

export interface HealthSignal {
  /** Subsystem + operation, e.g. "memory.search", "queue.spawn", "context.build" */
  operation: string;
  ok: boolean;
  ts: number;
  /** Arbitrary metadata — elapsed time, result count, error message, etc. */
  meta?: Record<string, unknown>;
}

export interface OperationStats {
  operation: string;
  /** Total signals recorded (may exceed buffer size) */
  totalCalls: number;
  successCount: number;
  failureCount: number;
  /** Success rate as 0-1 float */
  successRate: number;
  /** Average elapsed time in ms (if meta.elapsed is provided) */
  avgElapsedMs: number | null;
  /** Last failure message (if meta.error is provided) */
  lastError: string | null;
  /** Timestamp of last signal */
  lastSignalAt: number;
  /** Timestamp of last failure */
  lastFailureAt: number | null;
  /** Current consecutive failure streak */
  consecutiveFailures: number;
}

export interface LedgerSnapshot {
  ts: number;
  operations: OperationStats[];
  /** Operations with >= 3 consecutive failures */
  alerts: string[];
}

// ── Ring Buffer Per Operation ────────────────────────────────────────

const BUFFER_SIZE = 50; // Keep last 50 signals per operation

interface OperationBuffer {
  signals: HealthSignal[];
  /** Write pointer into the circular buffer */
  cursor: number;
  totalCalls: number;
  successCount: number;
  failureCount: number;
  consecutiveFailures: number;
  lastFailureAt: number | null;
  lastError: string | null;
}

const buffers = new Map<string, OperationBuffer>();

function getBuffer(operation: string): OperationBuffer {
  let buf = buffers.get(operation);
  if (!buf) {
    buf = {
      signals: new Array(BUFFER_SIZE).fill(null),
      cursor: 0,
      totalCalls: 0,
      successCount: 0,
      failureCount: 0,
      consecutiveFailures: 0,
      lastFailureAt: null,
      lastError: null,
    };
    buffers.set(operation, buf);
  }
  return buf;
}

// ── Public API ───────────────────────────────────────────────────────

export const health = {
  /**
   * Record a health signal for an operation.
   * Call this after every meaningful subsystem operation.
   */
  signal(operation: string, ok: boolean, meta?: Record<string, unknown>): void {
    const buf = getBuffer(operation);
    const sig: HealthSignal = { operation, ok, ts: Date.now(), meta };

    // Write to ring buffer
    buf.signals[buf.cursor] = sig;
    buf.cursor = (buf.cursor + 1) % BUFFER_SIZE;
    buf.totalCalls++;

    if (ok) {
      buf.successCount++;
      buf.consecutiveFailures = 0;
    } else {
      buf.failureCount++;
      buf.consecutiveFailures++;
      buf.lastFailureAt = sig.ts;
      if (meta?.error) buf.lastError = String(meta.error).slice(0, 200);
    }
  },

  /**
   * Get stats for a single operation.
   */
  stats(operation: string): OperationStats | null {
    const buf = buffers.get(operation);
    if (!buf || buf.totalCalls === 0) return null;

    // Calculate avg elapsed from buffer entries
    let elapsedSum = 0;
    let elapsedCount = 0;
    for (const sig of buf.signals) {
      if (sig?.meta?.elapsed && typeof sig.meta.elapsed === "number") {
        elapsedSum += sig.meta.elapsed;
        elapsedCount++;
      }
    }

    const lastSignal = buf.signals[(buf.cursor - 1 + BUFFER_SIZE) % BUFFER_SIZE];

    return {
      operation,
      totalCalls: buf.totalCalls,
      successCount: buf.successCount,
      failureCount: buf.failureCount,
      successRate: buf.totalCalls > 0 ? buf.successCount / buf.totalCalls : 0,
      avgElapsedMs: elapsedCount > 0 ? Math.round(elapsedSum / elapsedCount) : null,
      lastError: buf.lastError,
      lastSignalAt: lastSignal?.ts ?? 0,
      lastFailureAt: buf.lastFailureAt,
      consecutiveFailures: buf.consecutiveFailures,
    };
  },

  /**
   * Get a full snapshot of all operations. Used by self-heal and RPC.
   */
  snapshot(): LedgerSnapshot {
    const operations: OperationStats[] = [];
    const alerts: string[] = [];

    for (const [op] of buffers) {
      const s = this.stats(op);
      if (s) {
        operations.push(s);
        if (s.consecutiveFailures >= 3) {
          alerts.push(`${op}: ${s.consecutiveFailures} consecutive failures${s.lastError ? ` (${s.lastError})` : ""}`);
        }
      }
    }

    // Sort by most failures first
    operations.sort((a, b) => b.consecutiveFailures - a.consecutiveFailures);

    return { ts: Date.now(), operations, alerts };
  },

  /**
   * Check if a specific operation is healthy (no consecutive failures).
   */
  isHealthy(operation: string): boolean {
    const buf = buffers.get(operation);
    if (!buf || buf.totalCalls === 0) return true; // No data = assume healthy
    return buf.consecutiveFailures === 0;
  },

  /**
   * Check if a specific operation is in alert state (>= 3 consecutive failures).
   */
  isAlert(operation: string): boolean {
    const buf = buffers.get(operation);
    if (!buf) return false;
    return buf.consecutiveFailures >= 3;
  },

  /**
   * Reset stats for an operation (e.g., after a repair).
   */
  reset(operation: string): void {
    buffers.delete(operation);
  },
};

// ── Turn-Level Error Buffer ──────────────────────────────────────────

/**
 * Immediate error buffer — captures errors from the current/recent turn
 * so the ally sees them on the NEXT message, not 15 minutes later.
 *
 * Flow:
 *   1. Operation fails → health.signal() fires → turnErrors.capture()
 *   2. before_prompt_build runs → turnErrors.drain() returns recent errors
 *   3. Errors injected into ally context: "Something broke, here's what"
 *   4. Ally acknowledges and calls godmode_repair tool
 *   5. turnErrors.drain() clears the buffer
 */

const MAX_TURN_ERRORS = 10;
const TURN_ERROR_TTL_MS = 5 * 60 * 1000; // Surface errors within 5 minutes

interface TurnError {
  operation: string;
  error: string;
  ts: number;
  meta?: Record<string, unknown>;
}

const turnErrorBuffer: TurnError[] = [];

export const turnErrors = {
  /**
   * Capture an error for immediate surfacing to the ally.
   * Called alongside health.signal() for errors that the user should know about.
   */
  capture(operation: string, error: string, meta?: Record<string, unknown>): void {
    turnErrorBuffer.push({ operation, error, ts: Date.now(), meta });
    // Keep buffer bounded
    while (turnErrorBuffer.length > MAX_TURN_ERRORS) turnErrorBuffer.shift();
  },

  /**
   * Drain recent errors for injection into the ally's context.
   * Returns errors from the last 5 minutes, then clears them.
   * Called by before_prompt_build.
   */
  drain(): TurnError[] {
    const cutoff = Date.now() - TURN_ERROR_TTL_MS;
    const recent = turnErrorBuffer.filter((e) => e.ts > cutoff);
    // Clear the buffer
    turnErrorBuffer.length = 0;
    return recent;
  },

  /**
   * Peek at current errors without draining (for diagnostics).
   */
  peek(): TurnError[] {
    const cutoff = Date.now() - TURN_ERROR_TTL_MS;
    return turnErrorBuffer.filter((e) => e.ts > cutoff);
  },

  /** Current error count */
  get count(): number {
    const cutoff = Date.now() - TURN_ERROR_TTL_MS;
    return turnErrorBuffer.filter((e) => e.ts > cutoff).length;
  },
};

// ── Repair Log ───────────────────────────────────────────────────────

/**
 * Persistent repair log — records what broke, what fixed it, and when.
 * Over time this becomes the system's knowledge of its own failure patterns.
 * Stored in ~/godmode/data/repair-log.jsonl (append-only, one JSON per line).
 */

export interface RepairEntry {
  ts: number;
  subsystem: string;
  failure: string;
  repairAction: string;
  verified: boolean;
  elapsed: number;
}

const repairLogBuffer: RepairEntry[] = [];

/** Track which failures have already been filed as issues */
const filedIssues = new Set<string>();

export const repairLog = {
  /**
   * Record a repair attempt and its outcome.
   * If the same subsystem+failure pattern recurs 3+ times, auto-file a GitHub issue.
   */
  record(entry: RepairEntry): void {
    repairLogBuffer.push(entry);

    // Async append to disk — fire and forget
    void (async () => {
      try {
        const { appendFile, mkdir } = await import("node:fs/promises");
        const { join } = await import("node:path");
        const { DATA_DIR } = await import("../data-paths.js");
        await mkdir(DATA_DIR, { recursive: true });
        const logPath = join(DATA_DIR, "repair-log.jsonl");
        await appendFile(logPath, JSON.stringify(entry) + "\n", "utf-8");
      } catch { /* disk write non-fatal */ }
    })();

    // Check for recurring pattern — auto-file issue after 3 occurrences
    const patternKey = `${entry.subsystem}:${entry.failure.slice(0, 50)}`;
    const occurrences = repairLogBuffer.filter(
      (e) => e.subsystem === entry.subsystem && e.failure.slice(0, 50) === entry.failure.slice(0, 50),
    ).length;

    if (occurrences >= 3 && !filedIssues.has(patternKey)) {
      filedIssues.add(patternKey);
      void autoFileGitHubIssue(entry, occurrences);
    }
  },

  /**
   * Get recent repairs (in-memory, last 50).
   */
  recent(limit = 20): RepairEntry[] {
    return repairLogBuffer.slice(-limit);
  },

  /**
   * Get repair history for a specific subsystem.
   */
  forSubsystem(subsystem: string, limit = 10): RepairEntry[] {
    return repairLogBuffer.filter((e) => e.subsystem === subsystem).slice(-limit);
  },
};

// ── Session Activity Tracker ──────────────────────────────────────

/**
 * Lightweight session activity tracker.
 * Updated on every message_received. Exposed via godmode.health RPC
 * for diagnostics and operational awareness.
 */
const sessionActivity = new Map<string, number>();
const SESSION_IDLE_MS = 5 * 60 * 1000; // 5 minutes = idle

export const sessions = {
  /** Record activity for a session (call from message_received). */
  touch(sessionKey: string): void {
    sessionActivity.set(sessionKey, Date.now());
  },

  /** Check if any session has been active in the last 5 minutes. */
  hasActiveSessions(): boolean {
    const cutoff = Date.now() - SESSION_IDLE_MS;
    for (const ts of sessionActivity.values()) {
      if (ts > cutoff) return true;
    }
    return false;
  },

  /** Get count of active sessions (active within 5 min). */
  activeCount(): number {
    const cutoff = Date.now() - SESSION_IDLE_MS;
    let count = 0;
    for (const ts of sessionActivity.values()) {
      if (ts > cutoff) count++;
    }
    return count;
  },

  /** Get all active session keys (for logging). */
  activeKeys(): string[] {
    const cutoff = Date.now() - SESSION_IDLE_MS;
    const keys: string[] = [];
    for (const [key, ts] of sessionActivity) {
      if (ts > cutoff) keys.push(key);
    }
    return keys;
  },

  /** Get session keys that have been idle for at least idleMs milliseconds. */
  idleKeys(idleMs: number): string[] {
    const cutoff = Date.now() - idleMs;
    const keys: string[] = [];
    for (const [key, ts] of sessionActivity) {
      if (ts <= cutoff) keys.push(key);
    }
    return keys;
  },

  /** Prune stale entries (call periodically). */
  prune(): void {
    const cutoff = Date.now() - 30 * 60 * 1000; // 30 min stale
    for (const [key, ts] of sessionActivity) {
      if (ts < cutoff) sessionActivity.delete(key);
    }
  },
};

// ── Auto-File GitHub Issues ──────────────────────────────────────

const GITHUB_REPO = process.env.GODMODE_GITHUB_REPO || "godmode-team/godmode";

async function autoFileGitHubIssue(entry: RepairEntry, occurrences: number): Promise<void> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const exec = promisify(execFile);

    const title = `[auto-heal] Recurring repair: ${entry.subsystem} — ${entry.failure.slice(0, 60)}`;
    const body = [
      `## Auto-Filed by GodMode Self-Heal`,
      "",
      `**Subsystem:** ${entry.subsystem}`,
      `**Failure:** ${entry.failure}`,
      `**Repair action:** ${entry.repairAction}`,
      `**Verified:** ${entry.verified ? "yes" : "no"}`,
      `**Occurrences:** ${occurrences}+ times`,
      `**Last occurrence:** ${new Date(entry.ts).toISOString()}`,
      "",
      `## Context`,
      `This failure pattern has been auto-repaired ${occurrences}+ times.`,
      `The self-heal system handles it at runtime, but a permanent fix in the codebase`,
      `would eliminate the need for runtime repair.`,
      "",
      `## Repair Log (recent)`,
      "```json",
      JSON.stringify(repairLogBuffer.filter((e) => e.subsystem === entry.subsystem).slice(-5), null, 2),
      "```",
      "",
      `---`,
      `*Auto-filed by GodMode self-heal pipeline*`,
    ].join("\n");

    await exec("gh", [
      "issue", "create",
      "--repo", GITHUB_REPO,
      "--title", title,
      "--body", body,
      "--label", "auto-heal,bug",
    ], { timeout: 15_000 });

    console.log(`[SelfHeal] Auto-filed GitHub issue for recurring repair: ${entry.subsystem}`);
  } catch (err) {
    // gh CLI not available or not authenticated — silently skip
    console.warn(`[SelfHeal] Could not auto-file GitHub issue: ${String(err).slice(0, 100)}`);
  }
}
