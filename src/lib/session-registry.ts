/**
 * Session Registry — Tracks active Claude Code sessions to prevent chaos.
 *
 * Maintains a JSON registry of all active Claude Code sessions, what branch
 * they're on, which files they're modifying, and their current status. This
 * enables the session coordinator to detect conflicts, enforce branch discipline,
 * and prevent competing changes.
 *
 * Registry is stored at ~/godmode/data/session-registry.json and uses file
 * locking to handle concurrent reads/writes from multiple Claude Code sessions.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export type SessionStatus = "active" | "idle" | "stale" | "terminated";

export interface SessionEntry {
  /** Unique session ID (pid + timestamp) */
  id: string;
  /** Process ID of the Claude Code session */
  pid: number;
  /** Git branch this session is working on */
  branch: string;
  /** Git worktree path (if using worktree isolation) */
  worktree?: string;
  /** Working directory */
  cwd: string;
  /** Files currently being modified (tracked via tool calls) */
  modifiedFiles: string[];
  /** Brief description of what the session is working on */
  taskDescription?: string;
  /** Current status */
  status: SessionStatus;
  /** When this session registered */
  startedAt: string;
  /** Last heartbeat */
  lastSeen: string;
  /** Number of tool calls made */
  toolCallCount: number;
  /** Whether this session holds a gateway restart lock */
  holdsGatewayLock: boolean;
}

export interface SessionRegistry {
  /** All tracked sessions */
  sessions: Record<string, SessionEntry>;
  /** Which session (if any) currently holds the gateway restart lock */
  gatewayLockHolder?: string;
  /** Last time the registry was cleaned of stale sessions */
  lastCleanup: string;
  /** Registry schema version */
  version: 1;
}

export interface ConflictReport {
  /** Sessions that conflict with the proposed operation */
  conflicts: Array<{
    sessionId: string;
    reason: string;
    severity: "block" | "warn";
  }>;
  /** Whether the operation should be blocked */
  blocked: boolean;
}

// ── Constants ──────────────────────────────────────────────────────

const REGISTRY_FILE = join(DATA_DIR, "session-registry.json");
const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes without heartbeat = stale
const LOCK_TIMEOUT_MS = 10 * 60 * 1000; // Gateway lock auto-expires after 10 min

// ── File Operations ────────────────────────────────────────────────

async function loadRegistry(): Promise<SessionRegistry> {
  try {
    const raw = await readFile(REGISTRY_FILE, "utf-8");
    return JSON.parse(raw) as SessionRegistry;
  } catch {
    return {
      sessions: {},
      lastCleanup: new Date().toISOString(),
      version: 1,
    };
  }
}

async function saveRegistry(registry: SessionRegistry): Promise<void> {
  await mkdir(dirname(REGISTRY_FILE), { recursive: true });
  // Atomic write via temp file
  const tmpFile = REGISTRY_FILE + ".tmp";
  await writeFile(tmpFile, JSON.stringify(registry, null, 2), "utf-8");
  const { rename } = await import("node:fs/promises");
  await rename(tmpFile, REGISTRY_FILE);
}

// ── Core Operations ────────────────────────────────────────────────

/**
 * Register a new session (or update an existing one).
 */
export async function registerSession(entry: Omit<SessionEntry, "id" | "startedAt" | "lastSeen" | "toolCallCount" | "holdsGatewayLock" | "status">): Promise<SessionEntry> {
  const registry = await loadRegistry();
  cleanupStale(registry);

  const id = `${entry.pid}-${Date.now()}`;
  const session: SessionEntry = {
    ...entry,
    id,
    status: "active",
    startedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    toolCallCount: 0,
    holdsGatewayLock: false,
    modifiedFiles: entry.modifiedFiles || [],
  };

  registry.sessions[id] = session;
  await saveRegistry(registry);
  return session;
}

/**
 * Heartbeat — update lastSeen and optionally update modified files / task description.
 */
export async function heartbeat(
  sessionId: string,
  update?: Partial<Pick<SessionEntry, "modifiedFiles" | "taskDescription" | "branch" | "toolCallCount">>,
): Promise<void> {
  const registry = await loadRegistry();
  const session = registry.sessions[sessionId];
  if (!session) return;

  session.lastSeen = new Date().toISOString();
  session.status = "active";

  if (update?.modifiedFiles) {
    // Merge — don't replace
    const existing = new Set(session.modifiedFiles);
    for (const f of update.modifiedFiles) existing.add(f);
    session.modifiedFiles = [...existing];
  }
  if (update?.taskDescription) session.taskDescription = update.taskDescription;
  if (update?.branch) session.branch = update.branch;
  if (update?.toolCallCount !== undefined) session.toolCallCount = update.toolCallCount;

  await saveRegistry(registry);
}

/**
 * Unregister a session (on clean exit).
 */
export async function unregisterSession(sessionId: string): Promise<void> {
  const registry = await loadRegistry();
  const session = registry.sessions[sessionId];
  if (session) {
    session.status = "terminated";
    // Release gateway lock if held
    if (registry.gatewayLockHolder === sessionId) {
      registry.gatewayLockHolder = undefined;
    }
  }
  delete registry.sessions[sessionId];
  await saveRegistry(registry);
}

/**
 * Track a file being modified by a session.
 */
export async function trackFileModification(sessionId: string, filePath: string): Promise<ConflictReport> {
  const registry = await loadRegistry();
  cleanupStale(registry);

  const conflicts: ConflictReport["conflicts"] = [];

  // Check if any other active session is modifying the same file
  for (const [otherId, other] of Object.entries(registry.sessions)) {
    if (otherId === sessionId) continue;
    if (other.status !== "active") continue;

    if (other.modifiedFiles.includes(filePath)) {
      conflicts.push({
        sessionId: otherId,
        reason: `Session "${other.taskDescription || otherId}" is also modifying ${filePath} (on branch ${other.branch})`,
        severity: other.branch === registry.sessions[sessionId]?.branch ? "block" : "warn",
      });
    }
  }

  // Track the file
  const session = registry.sessions[sessionId];
  if (session) {
    if (!session.modifiedFiles.includes(filePath)) {
      session.modifiedFiles.push(filePath);
    }
    session.lastSeen = new Date().toISOString();
  }

  await saveRegistry(registry);

  return {
    conflicts,
    blocked: conflicts.some((c) => c.severity === "block"),
  };
}

/**
 * Check for branch conflicts before a session starts work on a branch.
 */
export async function checkBranchConflicts(sessionId: string, branch: string): Promise<ConflictReport> {
  const registry = await loadRegistry();
  cleanupStale(registry);

  const conflicts: ConflictReport["conflicts"] = [];

  for (const [otherId, other] of Object.entries(registry.sessions)) {
    if (otherId === sessionId) continue;
    if (other.status !== "active") continue;

    if (other.branch === branch && !other.worktree) {
      // Two sessions on the same branch without worktree isolation
      conflicts.push({
        sessionId: otherId,
        reason: `Session "${other.taskDescription || otherId}" is already active on branch "${branch}" without worktree isolation. Use a worktree or different branch to avoid conflicts.`,
        severity: "block",
      });
    }
  }

  return {
    conflicts,
    blocked: conflicts.some((c) => c.severity === "block"),
  };
}

/**
 * Acquire the gateway restart lock. Only one session can restart at a time.
 */
export async function acquireGatewayLock(sessionId: string): Promise<{ acquired: boolean; holder?: string }> {
  const registry = await loadRegistry();

  // Check if lock is held and not expired
  if (registry.gatewayLockHolder) {
    const holder = registry.sessions[registry.gatewayLockHolder];
    if (holder && holder.status === "active") {
      const lockAge = Date.now() - new Date(holder.lastSeen).getTime();
      if (lockAge < LOCK_TIMEOUT_MS) {
        return {
          acquired: false,
          holder: `${holder.taskDescription || holder.id} (locked ${Math.round(lockAge / 1000)}s ago)`,
        };
      }
      // Lock expired — release it
    }
  }

  registry.gatewayLockHolder = sessionId;
  const session = registry.sessions[sessionId];
  if (session) session.holdsGatewayLock = true;

  await saveRegistry(registry);
  return { acquired: true };
}

/**
 * Release the gateway restart lock.
 */
export async function releaseGatewayLock(sessionId: string): Promise<void> {
  const registry = await loadRegistry();

  if (registry.gatewayLockHolder === sessionId) {
    registry.gatewayLockHolder = undefined;
  }

  const session = registry.sessions[sessionId];
  if (session) session.holdsGatewayLock = false;

  await saveRegistry(registry);
}

/**
 * Get all active sessions (for display/diagnostics).
 */
export async function getActiveSessions(): Promise<SessionEntry[]> {
  const registry = await loadRegistry();
  cleanupStale(registry);
  await saveRegistry(registry);

  return Object.values(registry.sessions).filter(
    (s) => s.status === "active" || s.status === "idle",
  );
}

/**
 * Get the full registry (for diagnostics).
 */
export async function getRegistry(): Promise<SessionRegistry> {
  const registry = await loadRegistry();
  cleanupStale(registry);
  return registry;
}

/**
 * Generate a conflict-free branch name suggestion.
 */
export async function suggestBranch(taskDescription: string): Promise<string> {
  const registry = await loadRegistry();
  const activeBranches = new Set(
    Object.values(registry.sessions)
      .filter((s) => s.status === "active")
      .map((s) => s.branch),
  );

  // Slugify the task description
  const slug = taskDescription
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  let branch = `feat/${slug}`;
  let counter = 2;
  while (activeBranches.has(branch)) {
    branch = `feat/${slug}-${counter}`;
    counter++;
  }

  return branch;
}

// ── Cleanup ────────────────────────────────────────────────────────

function cleanupStale(registry: SessionRegistry): void {
  const now = Date.now();

  for (const [id, session] of Object.entries(registry.sessions)) {
    if (session.status === "terminated") {
      delete registry.sessions[id];
      continue;
    }

    const age = now - new Date(session.lastSeen).getTime();
    if (age > STALE_THRESHOLD_MS) {
      session.status = "stale";

      // If stale session held gateway lock, release it
      if (registry.gatewayLockHolder === id) {
        registry.gatewayLockHolder = undefined;
        session.holdsGatewayLock = false;
      }
    }
  }

  // Remove sessions that have been stale for more than 1 hour
  for (const [id, session] of Object.entries(registry.sessions)) {
    if (session.status === "stale") {
      const age = now - new Date(session.lastSeen).getTime();
      if (age > 60 * 60 * 1000) {
        delete registry.sessions[id];
      }
    }
  }

  registry.lastCleanup = new Date().toISOString();
}
