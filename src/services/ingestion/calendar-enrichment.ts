/**
 * calendar-enrichment.ts — Hourly cron that enriches memory from calendar.
 *
 * For each upcoming meeting (next 24h):
 * 1. Check if attendee people files exist
 * 2. Create stubs for new contacts
 * 3. Append meeting context to existing people files
 * 4. Write meeting summary to daily note
 *
 * Uses: gog CLI (GOG_CALENDAR_ACCOUNT env var)
 * Schedule: hourly via OC cron or HTTP trigger
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  existsSync,
  mkdirSync,
  appendFileSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../../data-paths.js";

const exec = promisify(execFile);

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export async function runCalendarEnrichment(): Promise<{
  eventsProcessed: number;
  peopleUpdated: number;
}> {
  const account = process.env.GOG_CALENDAR_ACCOUNT;
  if (!account) throw new Error("GOG_CALENDAR_ACCOUNT not set");
  const client = process.env.GOG_CLIENT || "godmode";

  // Fetch events via gog CLI (JSON output)
  const { stdout } = await exec("gog", [
    "calendar",
    "events",
    "--account",
    account,
    "--client",
    client,
    "--json",
    "--days",
    "2",
  ]);

  const events: CalendarEvent[] = JSON.parse(stdout);
  let peopleUpdated = 0;

  const today = localDateString();
  const dailyDir = join(MEMORY_DIR, "daily");
  const peopleDir = join(MEMORY_DIR, "people");
  if (!existsSync(dailyDir)) mkdirSync(dailyDir, { recursive: true });
  if (!existsSync(peopleDir)) mkdirSync(peopleDir, { recursive: true });

  // Append calendar summary to daily note
  const dailyPath = join(dailyDir, `${today}.md`);
  if (!existsSync(dailyPath)) {
    writeFileSync(dailyPath, `# Memory — ${today}\n\n`);
  }

  // Write calendar summary to daily note
  if (events.length > 0) {
    appendFileSync(
      dailyPath,
      `\n## Calendar\n${events.map((e) => `- ${e.start}: ${e.summary || "(no title)"}`).join("\n")}\n`,
    );
  }

  for (const event of events) {
    if (!event.attendees?.length) continue;
    const summary = event.summary || "(no title)";

    for (const attendee of event.attendees) {
      if (!attendee.email) continue;
      // Skip the owner's own email
      if (attendee.email === account) continue;

      const name =
        attendee.displayName || attendee.email.split("@")[0];
      const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const peoplePath = join(peopleDir, `${safeName}.md`);

      if (!existsSync(peoplePath)) {
        // Create new people stub
        writeFileSync(
          peoplePath,
          [
            `# ${name}`,
            ``,
            `- **Email:** ${attendee.email}`,
            `- **First seen:** ${today} (calendar)`,
            ``,
            `## Interactions`,
            ``,
            `- [${today}] Meeting: ${summary}`,
            ``,
          ].join("\n"),
        );
        peopleUpdated++;
      } else {
        // Check for duplicate entries today
        const existing = readFileSync(peoplePath, "utf8");
        const todayEntry = `[${today}] Meeting: ${summary}`;
        if (!existing.includes(todayEntry)) {
          appendFileSync(peoplePath, `- ${todayEntry}\n`);
          peopleUpdated++;
        }
      }
    }
  }

  // Forward summary to Honcho
  try {
    const { forwardToHoncho } = await import("../honcho-client.js");
    await forwardToHoncho(
      `[Calendar enrichment] Processed ${events.length} events, updated ${peopleUpdated} people files`,
      "system:calendar-enrichment",
    );
  } catch {
    /* non-fatal */
  }

  return { eventsProcessed: events.length, peopleUpdated };
}
