import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const execAsync = promisify(exec);

const GOG_ACCOUNT = process.env.GOG_CALENDAR_ACCOUNT || "";
const GOG_CLIENT = process.env.GOG_CLIENT || "godmode";
const GOG_ACCOUNT_FLAG = GOG_ACCOUNT ? `--account ${GOG_ACCOUNT}` : "";

const CACHE_TTL_MS = 2 * 60 * 1000;
let cachedEvents: { events: CalendarEvent[]; fetchedAt: number } | null = null;

type CalendarEvent = {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  location?: string;
  description?: string;
  allDay?: boolean;
};

export function parseGogOutput(output: string): CalendarEvent[] {
  const lines = output
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  const events: CalendarEvent[] = [];

  for (const line of lines) {
    const parts = line.split(/\s{2,}|\t/).map((p) => p.trim());
    if (parts.length < 4) continue;

    const [id, startStr, endStr, ...titleParts] = parts;
    const title = titleParts.join(" ");

    try {
      const startTime = new Date(startStr).getTime();
      const endTime = new Date(endStr).getTime();
      const duration = Math.round((endTime - startTime) / (1000 * 60));

      events.push({ id, title, startTime, endTime, duration });
    } catch {
      console.error("[Calendar] Failed to parse line:", line);
    }
  }

  return events;
}

async function fetchGogEvents(): Promise<CalendarEvent[]> {
  if (cachedEvents && Date.now() - cachedEvents.fetchedAt < CACHE_TTL_MS) {
    return cachedEvents.events;
  }

  const { stdout } = await execAsync(
    `gog calendar events ${GOG_ACCOUNT_FLAG} --client ${GOG_CLIENT}`,
    {
      timeout: 12_000,
      env: { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH}` },
    },
  );

  const events = parseGogOutput(stdout);
  cachedEvents = { events, fetchedAt: Date.now() };
  return events;
}

const eventsToday: GatewayRequestHandler = async ({ respond }) => {
  const now = new Date();

  if (!GOG_ACCOUNT) {
    console.warn("[Calendar] GOG_CALENDAR_ACCOUNT not set — returning empty events");
    respond(true, {
      events: [],
      date: now.toISOString().split("T")[0],
      source: "google",
      warning: "GOG_CALENDAR_ACCOUNT not configured",
    });
    return;
  }

  try {
    const allEvents = await fetchGogEvents();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    const todayEvents = allEvents.filter(
      (e) => e.startTime >= todayStart && e.startTime < todayEnd,
    );
    todayEvents.sort((a, b) => a.startTime - b.startTime);

    respond(true, {
      events: todayEvents,
      date: now.toISOString().split("T")[0],
      source: "google",
    });
  } catch (err) {
    console.error("[Calendar] gog CLI error:", err);
    respond(true, {
      events: [],
      date: now.toISOString().split("T")[0],
      source: "google",
      error: err instanceof Error ? err.message : "Failed to fetch calendar",
    });
  }
};

const eventsRange: GatewayRequestHandler = async ({ params, respond }) => {
  const { startDate, endDate } = params as { startDate?: string; endDate?: string };

  if (!startDate || !endDate) {
    respond(true, {
      events: [],
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      source: "google",
      warning: "startDate and endDate are required for range queries",
    });
    return;
  }

  if (!GOG_ACCOUNT) {
    respond(true, {
      events: [],
      startDate,
      endDate,
      source: "google",
      warning: "GOG_CALENDAR_ACCOUNT not configured",
    });
    return;
  }

  try {
    const allEvents = await fetchGogEvents();
    const rangeStart = new Date(startDate).getTime();
    const rangeEnd = new Date(endDate).getTime() + 24 * 60 * 60 * 1000;
    const rangeEvents = allEvents.filter(
      (e) => e.startTime >= rangeStart && e.startTime < rangeEnd,
    );
    rangeEvents.sort((a, b) => a.startTime - b.startTime);

    respond(true, { events: rangeEvents, startDate, endDate, source: "google" });
  } catch (err) {
    console.error("[Calendar] gog CLI error:", err);
    respond(true, {
      events: [],
      startDate,
      endDate,
      source: "google",
      error: err instanceof Error ? err.message : "Failed to fetch calendar",
    });
  }
};

export const calendarHandlers: GatewayRequestHandlers = {
  "calendar.events.today": eventsToday,
  "calendar.events.range": eventsRange,
};
