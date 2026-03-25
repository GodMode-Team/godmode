/**
 * calendar-enrichment.ts — Hourly cron: enrich memory from Google Calendar via `gog` CLI.
 *
 * Shells out to `gog calendar events` to fetch the next 2 days of events,
 * then creates/updates people files for attendees and forwards summaries to Honcho.
 */

import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import { forwardMessage, isHonchoReady } from "../honcho-client.js";
import { health } from "../../lib/health-ledger.js";
import { updatePersonFile, appendToDaily, todayString } from "./helpers.js";

const execFile = promisify(execFileCb);

const GOG_ACCOUNT = process.env.GOG_CALENDAR_ACCOUNT ?? "";
if (!GOG_ACCOUNT) {
  console.warn("[GodMode][CalendarEnrichment] GOG_CALENDAR_ACCOUNT not set — calendar enrichment disabled");
}

interface CalendarEvent {
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: Array<{ email?: string; displayName?: string; self?: boolean }>;
  organizer?: { email?: string; displayName?: string; self?: boolean };
}

export async function runCalendarEnrichment(): Promise<{
  eventsProcessed: number;
  peopleUpdated: number;
}> {
  const result = { eventsProcessed: 0, peopleUpdated: 0 };
  if (!GOG_ACCOUNT) return result;

  try {
    const { stdout } = await execFile("gog", [
      "calendar",
      "events",
      "--account",
      GOG_ACCOUNT,
      "--client",
      "godmode",
      "--json",
      "--days",
      "2",
    ], { timeout: 30_000 });

    let events: CalendarEvent[];
    try {
      events = JSON.parse(stdout);
    } catch {
      // gog may return empty or non-JSON — treat as zero events
      health.signal("ingestion.calendar", true, { ...result, note: "no parseable output" });
      return result;
    }

    if (!Array.isArray(events)) {
      health.signal("ingestion.calendar", true, { ...result, note: "unexpected format" });
      return result;
    }

    const today = todayString();
    const seenPeople = new Set<string>();

    for (const event of events) {
      const summary = event.summary || "Untitled event";
      const startStr = event.start?.dateTime || event.start?.date || "";

      // Process attendees
      const attendees = event.attendees || [];
      for (const attendee of attendees) {
        if (attendee.self) continue; // Skip the owner
        const name = attendee.displayName || attendee.email?.split("@")[0] || "";
        const email = attendee.email || null;
        if (!name) continue;

        const key = (email || name).toLowerCase();
        if (!seenPeople.has(key)) {
          seenPeople.add(key);
          await updatePersonFile(name, email, `Meeting: ${summary}`);
          result.peopleUpdated++;
        }
      }

      // Append to daily note
      const timeStr = startStr ? ` (${startStr})` : "";
      const attendeeNames = attendees
        .filter((a) => !a.self)
        .map((a) => a.displayName || a.email || "?")
        .join(", ");
      const dailyLine = `- **${summary}**${timeStr}${attendeeNames ? ` — with ${attendeeNames}` : ""}`;
      await appendToDaily("Calendar", dailyLine);

      result.eventsProcessed++;
    }

    // Forward summary to Honcho for memory processing
    if (isHonchoReady() && result.eventsProcessed > 0) {
      const summaryText = `Calendar enrichment for ${today}: processed ${result.eventsProcessed} events, updated ${result.peopleUpdated} people files.`;
      await forwardMessage("user", summaryText, "system:calendar-enrichment");
    }

    health.signal("ingestion.calendar", true, result);
  } catch (err) {
    health.signal("ingestion.calendar", false, {
      error: String(err),
      ...result,
    });
  }

  return result;
}
