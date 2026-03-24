/**
 * fathom-calls.ts — Nightly cron: ingest Fathom call recordings.
 *
 * Fetches recent calls from Fathom's API, extracts attendees for people files,
 * and writes call summaries to the daily note.
 */

import { forwardMessage, isHonchoReady } from "../honcho-client.js";
import { health } from "../../lib/health-ledger.js";
import { updatePersonFile, appendToDaily, todayString } from "./helpers.js";

const FATHOM_API_BASE = "https://api.fathom.video/v1";

interface FathomAttendee {
  name?: string;
  email?: string;
}

interface FathomCall {
  id?: string;
  title?: string;
  created_at?: string;
  duration_seconds?: number;
  attendees?: FathomAttendee[];
  summary?: string;
}

interface FathomResponse {
  calls?: FathomCall[];
}

export async function runFathomDigest(): Promise<{
  callsProcessed: number;
  contactsUpdated: number;
}> {
  const result = { callsProcessed: 0, contactsUpdated: 0 };
  const apiKey = process.env.FATHOM_API_KEY;

  if (!apiKey) {
    health.signal("ingestion.fathom", true, { ...result, note: "FATHOM_API_KEY not set" });
    return result;
  }

  try {
    // Look back 24h
    const since = new Date(Date.now() - 86400_000).toISOString();
    const url = `${FATHOM_API_BASE}/calls?after=${encodeURIComponent(since)}`;

    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Fathom API returned ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as FathomResponse;
    const calls = data.calls || [];

    const today = todayString();
    const seenPeople = new Set<string>();

    for (const call of calls) {
      const title = call.title || "Untitled call";
      const durationMin = call.duration_seconds
        ? Math.round(call.duration_seconds / 60)
        : null;

      // Process attendees
      const attendees = call.attendees || [];
      for (const attendee of attendees) {
        const name = attendee.name || attendee.email?.split("@")[0] || "";
        const email = attendee.email || null;
        if (!name) continue;

        const key = (email || name).toLowerCase();
        if (!seenPeople.has(key)) {
          seenPeople.add(key);
          await updatePersonFile(name, email, `Call: ${title}`);
          result.contactsUpdated++;
        }
      }

      // Append to daily note
      const durationStr = durationMin ? ` (${durationMin} min)` : "";
      const attendeeNames = attendees
        .map((a) => a.name || a.email || "?")
        .join(", ");
      const summaryLine = call.summary ? `\n  > ${call.summary.slice(0, 200)}` : "";
      await appendToDaily(
        "Fathom Calls",
        `- **${title}**${durationStr}${attendeeNames ? ` — with ${attendeeNames}` : ""}${summaryLine}`,
      );

      result.callsProcessed++;
    }

    // Forward summary to Honcho
    if (isHonchoReady() && result.callsProcessed > 0) {
      const summaryText = `Fathom call digest for ${today}: processed ${result.callsProcessed} calls, updated ${result.contactsUpdated} contacts.`;
      await forwardMessage("user", summaryText, "system:fathom-digest");
    }

    health.signal("ingestion.fathom", true, result);
  } catch (err) {
    health.signal("ingestion.fathom", false, {
      error: String(err),
      ...result,
    });
  }

  return result;
}
