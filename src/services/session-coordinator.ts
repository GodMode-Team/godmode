/**
 * Session Coordinator — Enforces discipline across parallel Claude Code sessions.
 *
 * Provides runtime coordination that prevents:
 * - Two sessions editing the same file on the same branch
 * - Competing gateway restarts
 * - Stash chaos (enforces branch-per-task)
 * - Lost work from uncoordinated changes
 *
 * Works by:
 * 1. Each session registers on start, heartbeats during work
 * 2. File modifications are checked against the registry for conflicts
 * 3. Gateway restarts require a lock (only one session at a time)
 * 4. Sessions get warnings about potential conflicts
 * 5. On clean exit, generates a structured handoff summary
 *
 * This is the server-side coordinator. It exposes RPCs that Claude Code
 * sessions call via GodMode gateway methods.
 */

import {
  registerSession,
  unregisterSession,
  heartbeat,
  trackFileModification,
  checkBranchConflicts,
  acquireGatewayLock,
  releaseGatewayLock,
  getActiveSessions,
  getRegistry,
  suggestBranch,
  type SessionEntry,
  type ConflictReport,
} from "../lib/session-registry.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export interface HandoffSummary {
  sessionId: string;
  branch: string;
  taskDescription: string;
  modifiedFiles: string[];
  status: "completed" | "in-progress" | "blocked";
  notes: string;
  createdAt: string;
}

// ── Handoff Storage ────────────────────────────────────────────────

const HANDOFF_DIR = join(DATA_DIR, "session-handoffs");

async function saveHandoff(handoff: HandoffSummary): Promise<string> {
  await mkdir(HANDOFF_DIR, { recursive: true });
  const filename = `${new Date().toISOString().replace(/[:.]/g, "-")}_${handoff.sessionId.slice(0, 12)}.json`;
  const filepath = join(HANDOFF_DIR, filename);
  await writeFile(filepath, JSON.stringify(handoff, null, 2), "utf-8");
  return filepath;
}

async function getRecentHandoffs(limit = 10): Promise<HandoffSummary[]> {
  try {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(HANDOFF_DIR);
    const sorted = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .slice(0, limit);

    const handoffs: HandoffSummary[] = [];
    for (const file of sorted) {
      try {
        const raw = await readFile(join(HANDOFF_DIR, file), "utf-8");
        handoffs.push(JSON.parse(raw) as HandoffSummary);
      } catch {
        // Skip corrupt files
      }
    }
    return handoffs;
  } catch {
    return [];
  }
}

// ── Session Lifecycle ──────────────────────────────────────────────

/**
 * Called when a Claude Code session starts.
 * Returns the session ID and any warnings about the current branch.
 */
export async function coordinatorSessionStart(params: {
  pid: number;
  branch: string;
  cwd: string;
  taskDescription?: string;
  worktree?: string;
}): Promise<{
  sessionId: string;
  warnings: string[];
  activeSessions: Array<{ id: string; branch: string; task?: string }>;
  recentHandoffs: HandoffSummary[];
}> {
  const warnings: string[] = [];

  // Check for branch conflicts before registering
  const branchCheck = await checkBranchConflicts("__new__", params.branch);
  if (branchCheck.blocked) {
    for (const c of branchCheck.conflicts) {
      warnings.push(`CONFLICT: ${c.reason}`);
    }
    // Suggest an alternative branch
    const suggested = await suggestBranch(params.taskDescription || "feature");
    warnings.push(`Suggested branch: ${suggested}`);
  }

  // Register the session
  const session = await registerSession({
    pid: params.pid,
    branch: params.branch,
    cwd: params.cwd,
    taskDescription: params.taskDescription,
    worktree: params.worktree,
    modifiedFiles: [],
  });

  // Get active sessions for awareness
  const activeSessions = (await getActiveSessions())
    .filter((s) => s.id !== session.id)
    .map((s) => ({
      id: s.id,
      branch: s.branch,
      task: s.taskDescription,
    }));

  if (activeSessions.length > 0) {
    warnings.push(
      `${activeSessions.length} other active session(s): ${activeSessions.map((s) => `"${s.task || "unnamed"}" on ${s.branch}`).join(", ")}`,
    );
  }

  // Get recent handoffs for context
  const recentHandoffs = await getRecentHandoffs(5);

  return {
    sessionId: session.id,
    warnings,
    activeSessions,
    recentHandoffs,
  };
}

/**
 * Called periodically during a session to update status.
 */
export async function coordinatorHeartbeat(params: {
  sessionId: string;
  modifiedFiles?: string[];
  taskDescription?: string;
  branch?: string;
  toolCallCount?: number;
}): Promise<{ warnings: string[] }> {
  const warnings: string[] = [];

  await heartbeat(params.sessionId, {
    modifiedFiles: params.modifiedFiles,
    taskDescription: params.taskDescription,
    branch: params.branch,
    toolCallCount: params.toolCallCount,
  });

  // Check for new conflicts that may have appeared
  if (params.modifiedFiles) {
    for (const file of params.modifiedFiles) {
      const report = await trackFileModification(params.sessionId, file);
      for (const c of report.conflicts) {
        warnings.push(`${c.severity === "block" ? "CONFLICT" : "WARNING"}: ${c.reason}`);
      }
    }
  }

  return { warnings };
}

/**
 * Called when a session completes — generates handoff summary.
 */
export async function coordinatorSessionEnd(params: {
  sessionId: string;
  status: "completed" | "in-progress" | "blocked";
  notes: string;
}): Promise<{ handoffPath: string }> {
  const registry = await getRegistry();
  const session = registry.sessions[params.sessionId];

  const handoff: HandoffSummary = {
    sessionId: params.sessionId,
    branch: session?.branch || "unknown",
    taskDescription: session?.taskDescription || "No description",
    modifiedFiles: session?.modifiedFiles || [],
    status: params.status,
    notes: params.notes,
    createdAt: new Date().toISOString(),
  };

  const path = await saveHandoff(handoff);
  await unregisterSession(params.sessionId);

  return { handoffPath: path };
}

/**
 * Attempt to acquire the gateway restart lock.
 */
export async function coordinatorAcquireGatewayLock(sessionId: string): Promise<{
  acquired: boolean;
  message: string;
}> {
  const result = await acquireGatewayLock(sessionId);

  if (result.acquired) {
    return {
      acquired: true,
      message: "Gateway restart lock acquired. Other sessions will be blocked from restarting until you release it.",
    };
  }

  return {
    acquired: false,
    message: `Gateway restart lock held by: ${result.holder}. Wait for it to complete or expire (10 min timeout).`,
  };
}

/**
 * Release the gateway restart lock.
 */
export async function coordinatorReleaseGatewayLock(sessionId: string): Promise<void> {
  await releaseGatewayLock(sessionId);
}

/**
 * Check if an operation would conflict with other sessions.
 */
export async function coordinatorCheckConflict(params: {
  sessionId: string;
  operation: "edit-file" | "gateway-restart" | "git-stash" | "branch-switch";
  target?: string; // file path or branch name
}): Promise<ConflictReport & { suggestion?: string }> {
  switch (params.operation) {
    case "edit-file": {
      if (!params.target) return { conflicts: [], blocked: false };
      return trackFileModification(params.sessionId, params.target);
    }

    case "gateway-restart": {
      const lock = await acquireGatewayLock(params.sessionId);
      if (!lock.acquired) {
        return {
          conflicts: [
            {
              sessionId: "unknown",
              reason: `Gateway restart blocked: ${lock.holder}`,
              severity: "block",
            },
          ],
          blocked: true,
          suggestion: "Wait for the other session to finish its restart, or try again in a few minutes.",
        };
      }
      // Release immediately — this was just a check
      await releaseGatewayLock(params.sessionId);
      return { conflicts: [], blocked: false };
    }

    case "git-stash": {
      return {
        conflicts: [
          {
            sessionId: params.sessionId,
            reason: "Stashing is discouraged. Use a dedicated branch instead to prevent lost work.",
            severity: "warn",
          },
        ],
        blocked: false,
        suggestion: await suggestBranch("work-in-progress"),
      };
    }

    case "branch-switch": {
      if (!params.target) return { conflicts: [], blocked: false };
      return checkBranchConflicts(params.sessionId, params.target);
    }

    default:
      return { conflicts: [], blocked: false };
  }
}

/**
 * Get session awareness context — what other sessions are doing.
 * Useful for injecting into Claude Code system prompts.
 */
export async function getSessionAwareness(sessionId?: string): Promise<string> {
  const sessions = await getActiveSessions();
  const others = sessions.filter((s) => s.id !== sessionId);

  if (others.length === 0) {
    return "No other active Claude Code sessions.";
  }

  const lines = [`${others.length} other active Claude Code session(s):`];
  for (const s of others) {
    const age = Math.round((Date.now() - new Date(s.startedAt).getTime()) / 60000);
    lines.push(
      `  - "${s.taskDescription || "unnamed"}" on branch ${s.branch} (${age}min, ${s.modifiedFiles.length} files modified${s.holdsGatewayLock ? ", HOLDS GATEWAY LOCK" : ""})`,
    );
  }

  return lines.join("\n");
}
