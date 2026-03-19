import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { readTasks, type NativeTask } from "../methods/tasks.js";
import {
  loadCombinedSessionStoreForGateway,
  loadConfig,
  type SessionStoreEntry,
} from "../lib/workspace-session-store.js";

// ── Types ───────────────────────────────────────────────────────────

export type ArchiveReason = "idle-7d" | "task-complete" | "manual";

export type ArchivedSessionEntry = {
  sessionKey: string;
  archivedAt: string;
  reason: ArchiveReason;
  linkedTaskId: string | null;
};

export type ArchivedSessionsData = {
  archived: ArchivedSessionEntry[];
};

export type AutoArchiveResult = {
  archivedCount: number;
  archived: Array<{ sessionKey: string; reason: ArchiveReason }>;
  skippedActiveCount: number;
  skippedLinkedCount: number;
};

// ── Constants ───────────────────────────────────────────────────────

const ARCHIVE_FILE = join(DATA_DIR, "archived-sessions.json");

/** Sessions idle longer than this are candidates for auto-archive. */
const IDLE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Completed-task sessions are archived after this grace period. */
const TASK_COMPLETE_GRACE_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Persistence ─────────────────────────────────────────────────────

async function readArchivedSessions(): Promise<ArchivedSessionsData> {
  try {
    const raw = await readFile(ARCHIVE_FILE, "utf-8");
    return JSON.parse(raw) as ArchivedSessionsData;
  } catch {
    return { archived: [] };
  }
}

async function writeArchivedSessions(data: ArchivedSessionsData): Promise<void> {
  await mkdir(dirname(ARCHIVE_FILE), { recursive: true });
  await writeFile(ARCHIVE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Manually archive a session.
 * Returns the created archive entry, or null if already archived.
 */
export async function archiveSession(
  sessionKey: string,
  reason: ArchiveReason = "manual",
): Promise<ArchivedSessionEntry | null> {
  const data = await readArchivedSessions();
  const existing = data.archived.find((e) => e.sessionKey === sessionKey);
  if (existing) {
    return null; // already archived
  }

  // Check if session is linked to a task
  const tasks = await readTasks();
  const linkedTask = tasks.tasks.find((t) => t.sessionId === sessionKey);

  const entry: ArchivedSessionEntry = {
    sessionKey,
    archivedAt: new Date().toISOString(),
    reason,
    linkedTaskId: linkedTask?.id ?? null,
  };
  data.archived.push(entry);
  await writeArchivedSessions(data);
  return entry;
}

/**
 * Restore an archived session.
 * Returns the removed entry, or null if not found.
 */
export async function unarchiveSession(
  sessionKey: string,
): Promise<ArchivedSessionEntry | null> {
  const data = await readArchivedSessions();
  const idx = data.archived.findIndex((e) => e.sessionKey === sessionKey);
  if (idx === -1) {
    return null;
  }
  const removed = data.archived.splice(idx, 1)[0];
  await writeArchivedSessions(data);
  return removed;
}

/**
 * List all archived sessions.
 */
export async function getArchivedSessions(): Promise<ArchivedSessionEntry[]> {
  const data = await readArchivedSessions();
  return data.archived;
}

/**
 * Build a lookup of session keys to their linked tasks.
 */
function buildTaskLookup(
  tasks: NativeTask[],
): Map<string, NativeTask> {
  const lookup = new Map<string, NativeTask>();
  for (const task of tasks) {
    if (task.sessionId) {
      lookup.set(task.sessionId, task);
    }
  }
  return lookup;
}

/**
 * Run automatic session archiving based on idle time and task status.
 *
 * Rules:
 *  - Sessions linked to pending/in-progress tasks: NEVER auto-archive
 *  - Recently active sessions (< 7 days): NEVER auto-archive
 *  - Sessions idle > 7 days with no linked pending task: archive (reason: idle-7d)
 *  - Sessions linked to completed tasks, completed > 24h ago: archive (reason: task-complete)
 */
export async function runAutoArchive(): Promise<AutoArchiveResult> {
  const now = Date.now();
  const cfg = await loadConfig();
  const combined = (await loadCombinedSessionStoreForGateway(cfg)).store;
  const tasksData = await readTasks();
  const taskLookup = buildTaskLookup(tasksData.tasks);
  const archiveData = await readArchivedSessions();
  const alreadyArchived = new Set(archiveData.archived.map((e) => e.sessionKey));

  const result: AutoArchiveResult = {
    archivedCount: 0,
    archived: [],
    skippedActiveCount: 0,
    skippedLinkedCount: 0,
  };

  for (const [key, entry] of Object.entries(combined)) {
    // Skip already-archived sessions
    if (alreadyArchived.has(key)) {
      continue;
    }

    const updatedAt = Number(entry.updatedAt ?? 0);
    const idleMs = now - updatedAt;
    const linkedTask = taskLookup.get(key);

    // Rule: sessions linked to pending tasks are NEVER auto-archived
    if (linkedTask && linkedTask.status === "pending") {
      result.skippedLinkedCount++;
      continue;
    }

    // Rule: recently active sessions are NEVER auto-archived
    if (updatedAt > 0 && idleMs < IDLE_THRESHOLD_MS) {
      // But check task-complete grace period for completed-task sessions
      if (linkedTask && linkedTask.status === "complete" && linkedTask.completedAt) {
        const completedAgeMs = now - Date.parse(linkedTask.completedAt);
        if (completedAgeMs > TASK_COMPLETE_GRACE_MS) {
          // Completed task + grace period elapsed = archive even if < 7d idle
          const archiveEntry: ArchivedSessionEntry = {
            sessionKey: key,
            archivedAt: new Date().toISOString(),
            reason: "task-complete",
            linkedTaskId: linkedTask.id,
          };
          archiveData.archived.push(archiveEntry);
          result.archived.push({ sessionKey: key, reason: "task-complete" });
          result.archivedCount++;
          continue;
        }
      }
      result.skippedActiveCount++;
      continue;
    }

    // Rule: idle > 7 days with a completed task
    if (linkedTask && linkedTask.status === "complete" && linkedTask.completedAt) {
      const completedAgeMs = now - Date.parse(linkedTask.completedAt);
      if (completedAgeMs > TASK_COMPLETE_GRACE_MS) {
        const archiveEntry: ArchivedSessionEntry = {
          sessionKey: key,
          archivedAt: new Date().toISOString(),
          reason: "task-complete",
          linkedTaskId: linkedTask.id,
        };
        archiveData.archived.push(archiveEntry);
        result.archived.push({ sessionKey: key, reason: "task-complete" });
        result.archivedCount++;
        continue;
      }
    }

    // Rule: idle > 7 days with no linked pending task
    if (updatedAt > 0 && idleMs >= IDLE_THRESHOLD_MS) {
      const archiveEntry: ArchivedSessionEntry = {
        sessionKey: key,
        archivedAt: new Date().toISOString(),
        reason: "idle-7d",
        linkedTaskId: linkedTask?.id ?? null,
      };
      archiveData.archived.push(archiveEntry);
      result.archived.push({ sessionKey: key, reason: "idle-7d" });
      result.archivedCount++;
      continue;
    }
  }

  if (result.archivedCount > 0) {
    await writeArchivedSessions(archiveData);
  }

  return result;
}

// ── Auto-archive timer service ──────────────────────────────────────

type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
};

const AUTO_ARCHIVE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

let autoArchiveTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Start the auto-archive background timer.
 * Runs once immediately on startup, then every 24 hours.
 */
export async function startAutoArchiveService(logger: Logger): Promise<void> {
  if (autoArchiveTimer) {
    return; // already running
  }

  // Run immediately on startup
  try {
    const result = await runAutoArchive();
    if (result.archivedCount > 0) {
      logger.info(
        `[GodMode] Auto-archived ${result.archivedCount} session(s): ${result.archived.map((a) => `${a.sessionKey} (${a.reason})`).join(", ")}`,
      );
    } else {
      logger.info("[GodMode] Auto-archive check: no sessions to archive");
    }
  } catch (err) {
    logger.warn(`[GodMode] Auto-archive startup run failed: ${String(err)}`);
  }

  // Schedule periodic runs
  autoArchiveTimer = setInterval(() => {
    void (async () => {
      try {
        const result = await runAutoArchive();
        if (result.archivedCount > 0) {
          logger.info(
            `[GodMode] Auto-archived ${result.archivedCount} session(s): ${result.archived.map((a) => `${a.sessionKey} (${a.reason})`).join(", ")}`,
          );
        }
      } catch (err) {
        logger.warn(`[GodMode] Auto-archive scheduled run failed: ${String(err)}`);
      }
    })();
  }, AUTO_ARCHIVE_INTERVAL_MS);
}

/**
 * Stop the auto-archive background timer.
 */
export function stopAutoArchiveService(): void {
  if (autoArchiveTimer) {
    clearInterval(autoArchiveTimer);
    autoArchiveTimer = null;
  }
}
