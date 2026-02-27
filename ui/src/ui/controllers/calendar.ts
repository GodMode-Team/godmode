/**
 * Calendar Controller
 * Handles calendar event loading and date range queries via Gateway RPC
 */

import type { GatewayBrowserClient } from "../gateway";
import type { CalendarEvent } from "../views/calendar";

export type CalendarState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  myDayLoading?: boolean;
  myDayError?: string | null;
  myDayEvents?: CalendarEvent[];
};

/**
 * Load today's calendar events from the gateway
 */
export async function loadCalendarEvents(state: CalendarState) {
  if (!state.client || !state.connected) {
    return;
  }

  try {
    state.myDayLoading = true;
    state.myDayError = null;

    const result = await state.client.request<{
      events: Array<{
        id: string;
        title: string;
        startTime: number;
        duration: number;
        location?: string;
      }>;
    }>("calendar.events.today", {});

    state.myDayEvents = result.events.map((e) => ({
      ...e,
      startTime: new Date(e.startTime),
    }));
  } catch (err) {
    state.myDayError = err instanceof Error ? err.message : "Failed to load calendar";
    console.error("[Calendar] Load error:", err);
  } finally {
    state.myDayLoading = false;
  }
}

/**
 * Load calendar events for a specific date range
 */
export async function loadCalendarRange(
  state: CalendarState,
  startDate: Date,
  endDate: Date,
): Promise<CalendarEvent[] | undefined> {
  if (!state.client || !state.connected) {
    return undefined;
  }

  const result = await state.client.request<{
    events: Array<{
      id: string;
      title: string;
      startTime: number;
      duration: number;
      location?: string;
    }>;
  }>("calendar.events.range", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  return result.events.map((e) => ({
    ...e,
    startTime: new Date(e.startTime),
  }));
}
