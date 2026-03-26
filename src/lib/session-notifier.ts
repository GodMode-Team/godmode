/**
 * Session Notifier — Pushes proactive system events into originating chat sessions.
 *
 * Uses OpenClaw's enqueueSystemEvent API so the agent sees the notification on its
 * next turn, combined with safeBroadcast to update the Control UI immediately.
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { safeBroadcast } from "./host-context.js";

/**
 * Enqueue a system event into a specific session so the agent sees it on the next turn.
 * Also broadcasts an SSE event to connected UI clients.
 *
 * Notification failure is NEVER fatal — always swallowed.
 */
export function notifySession(
  api: OpenClawPluginApi,
  sessionKey: string | undefined | null,
  message: string,
  broadcastEvent?: string,
  broadcastData?: unknown,
): void {
  // 1. Enqueue system event into the originating session
  if (sessionKey) {
    try {
      const enqueue = api.runtime?.system?.enqueueSystemEvent;
      if (typeof enqueue === "function") {
        enqueue(message, { sessionKey });
      } else {
        console.warn(`[session-notifier] enqueueSystemEvent not available — sessionKey=${sessionKey} notification dropped`);
      }
    } catch (err) {
      console.warn(`[session-notifier] Failed to enqueue event for session=${sessionKey}:`, err);
    }
  } else {
    console.warn(`[session-notifier] No sessionKey — broadcast-only notification`);
  }

  // 2. Broadcast SSE event to Control UI
  if (broadcastEvent) {
    safeBroadcast(api, broadcastEvent, broadcastData);
  }
}
