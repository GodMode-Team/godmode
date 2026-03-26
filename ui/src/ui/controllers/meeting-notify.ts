/**
 * Meeting Notification Controller
 * Polls calendar events and fires a persistent toast 15 minutes before meetings.
 */

import type { GatewayBrowserClient } from "../gateway";

type MeetingNotifyHost = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
  ) => void;
};

const POLL_INTERVAL_MS = 60_000; // 1 minute
const WARN_MINUTES = 15; // Notify 15 minutes before
const notifiedEventIds = new Set<string>();

let pollTimer: ReturnType<typeof setInterval> | null = null;

async function checkUpcomingMeetings(host: MeetingNotifyHost) {
  if (!host.client || !host.connected) {
    return;
  }

  try {
    const now = new Date();
    const lookAhead = new Date(now.getTime() + WARN_MINUTES * 60_000 + 60_000); // 16 min window

    const result = await host.client.request<{
      events: Array<{
        id: string;
        title: string;
        startTime: number;
        duration: number;
        location?: string;
      }>;
    }>("calendar.events.range", {
      startDate: now.toISOString(),
      endDate: lookAhead.toISOString(),
    });

    for (const event of result.events ?? []) {
      if (notifiedEventIds.has(event.id)) {
        continue;
      }

      const startTime = new Date(event.startTime);
      const minutesUntil = Math.round((startTime.getTime() - now.getTime()) / 60_000);

      if (minutesUntil > 0 && minutesUntil <= WARN_MINUTES) {
        notifiedEventIds.add(event.id);

        const timeStr = startTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        const locationStr = event.location ? ` @ ${event.location}` : "";
        const message = `${event.title} starts in ${minutesUntil} min (${timeStr})${locationStr}`;

        // duration: 0 = persistent toast
        host.showToast(message, "warning", 0);
      }
    }
  } catch (err) {
    // Silent fail — calendar might not be configured
    console.warn("[MeetingNotify] Poll error:", err);
  }
}

export function startMeetingNotifications(host: MeetingNotifyHost) {
  stopMeetingNotifications();
  // Initial check
  void checkUpcomingMeetings(host);
  // Poll every minute
  pollTimer = setInterval(() => void checkUpcomingMeetings(host), POLL_INTERVAL_MS);
}

export function stopMeetingNotifications() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
