/**
 * Session Coordination RPC handlers.
 *
 * Exposes the session coordinator to Claude Code sessions via gateway methods.
 * Sessions call these to register, heartbeat, check conflicts, and hand off.
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import {
  coordinatorSessionStart,
  coordinatorSessionEnd,
  coordinatorHeartbeat,
  coordinatorAcquireGatewayLock,
  coordinatorReleaseGatewayLock,
  coordinatorCheckConflict,
  getSessionAwareness,
} from "../services/session-coordinator.js";
import { getActiveSessions, getRegistry } from "../lib/session-registry.js";

type HandlerMap = Record<
  string,
  (params: Record<string, unknown>, api: OpenClawPluginApi) => Promise<unknown>
>;

export const sessionCoordinationHandlers: HandlerMap = {
  /**
   * Register a new Claude Code session.
   * Returns session ID, warnings, and context about other active sessions.
   */
  "session.register": async (params) => {
    const pid = typeof params.pid === "number" ? params.pid : process.pid;
    const branch = String(params.branch || "unknown");
    const cwd = String(params.cwd || process.cwd());
    const taskDescription = params.taskDescription
      ? String(params.taskDescription)
      : undefined;
    const worktree = params.worktree ? String(params.worktree) : undefined;

    return coordinatorSessionStart({
      pid,
      branch,
      cwd,
      taskDescription,
      worktree,
    });
  },

  /**
   * Heartbeat — update session status and check for new conflicts.
   */
  "session.heartbeat": async (params) => {
    const sessionId = String(params.sessionId || "");
    if (!sessionId) return { error: "sessionId required" };

    return coordinatorHeartbeat({
      sessionId,
      modifiedFiles: Array.isArray(params.modifiedFiles)
        ? params.modifiedFiles.map(String)
        : undefined,
      taskDescription: params.taskDescription
        ? String(params.taskDescription)
        : undefined,
      branch: params.branch ? String(params.branch) : undefined,
      toolCallCount:
        typeof params.toolCallCount === "number"
          ? params.toolCallCount
          : undefined,
    });
  },

  /**
   * End a session — generates structured handoff summary.
   */
  "session.end": async (params) => {
    const sessionId = String(params.sessionId || "");
    if (!sessionId) return { error: "sessionId required" };

    return coordinatorSessionEnd({
      sessionId,
      status: (params.status as "completed" | "in-progress" | "blocked") || "completed",
      notes: String(params.notes || "No notes provided"),
    });
  },

  /**
   * Check if an operation would conflict with other sessions.
   */
  "session.checkConflict": async (params) => {
    const sessionId = String(params.sessionId || "");
    const operation = String(params.operation || "edit-file") as
      | "edit-file"
      | "gateway-restart"
      | "git-stash"
      | "branch-switch";
    const target = params.target ? String(params.target) : undefined;

    return coordinatorCheckConflict({ sessionId, operation, target });
  },

  /**
   * Acquire the gateway restart lock.
   */
  "session.acquireGatewayLock": async (params) => {
    const sessionId = String(params.sessionId || "");
    if (!sessionId) return { error: "sessionId required" };
    return coordinatorAcquireGatewayLock(sessionId);
  },

  /**
   * Release the gateway restart lock.
   */
  "session.releaseGatewayLock": async (params) => {
    const sessionId = String(params.sessionId || "");
    if (!sessionId) return { error: "sessionId required" };
    await coordinatorReleaseGatewayLock(sessionId);
    return { ok: true };
  },

  /**
   * Get awareness context about other active sessions.
   * Designed to be injected into Claude Code system prompts.
   */
  "session.awareness": async (params) => {
    const sessionId = params.sessionId ? String(params.sessionId) : undefined;
    const context = await getSessionAwareness(sessionId);
    return { context };
  },

  /**
   * List all active sessions (for diagnostics and UI).
   */
  "session.list": async () => {
    const sessions = await getActiveSessions();
    return { sessions, count: sessions.length };
  },

  /**
   * Get the full session registry (diagnostics).
   */
  "session.registry": async () => {
    return getRegistry();
  },
};
