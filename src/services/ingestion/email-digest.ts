/**
 * email-digest.ts — Nightly cron: digest email activity from Front.
 *
 * Fetches recently updated conversations from Front's API,
 * extracts contacts for people files, and writes thread summaries to the daily note.
 */

import { forwardMessage, isHonchoReady } from "../honcho-client.js";
import { health } from "../../lib/health-ledger.js";
import { updatePersonFile, appendToDaily, todayString } from "./helpers.js";

const FRONT_API_BASE = "https://api2.frontapp.com";

interface FrontContact {
  handle?: string;
  name?: string;
}

interface FrontConversation {
  id?: string;
  subject?: string;
  status?: string;
  recipients?: FrontContact[];
  last_message?: {
    created_at?: number;
    body?: string;
    author?: FrontContact;
  };
}

interface FrontResponse {
  _results?: FrontConversation[];
}

export async function runEmailDigest(): Promise<{
  threadsProcessed: number;
  contactsUpdated: number;
}> {
  const result = { threadsProcessed: 0, contactsUpdated: 0 };
  const token = process.env.FRONT_API_TOKEN;

  if (!token) {
    health.signal("ingestion.email", true, { ...result, note: "FRONT_API_TOKEN not set" });
    return result;
  }

  try {
    // Look back 24h
    const since = Math.floor(Date.now() / 1000) - 86400;
    const url = `${FRONT_API_BASE}/conversations?q[updated_after]=${since}&limit=50`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Front API returned ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as FrontResponse;
    const conversations = data._results || [];

    const today = todayString();
    const seenContacts = new Set<string>();

    for (const convo of conversations) {
      const subject = convo.subject || "No subject";

      // Extract contacts from recipients
      const recipients = convo.recipients || [];
      for (const recipient of recipients) {
        const name = recipient.name || recipient.handle?.split("@")[0] || "";
        const email = recipient.handle || null;
        if (!name) continue;

        const key = (email || name).toLowerCase();
        if (!seenContacts.has(key)) {
          seenContacts.add(key);
          await updatePersonFile(name, email, `Email thread: ${subject}`);
          result.contactsUpdated++;
        }
      }

      // Author from last message
      const author = convo.last_message?.author;
      if (author) {
        const authorName = author.name || author.handle?.split("@")[0] || "";
        const authorEmail = author.handle || null;
        const key = (authorEmail || authorName).toLowerCase();
        if (authorName && !seenContacts.has(key)) {
          seenContacts.add(key);
          await updatePersonFile(authorName, authorEmail, `Email thread: ${subject}`);
          result.contactsUpdated++;
        }
      }

      // Append to daily note
      const status = convo.status || "unknown";
      await appendToDaily("Email (Front)", `- **${subject}** — status: ${status}`);

      result.threadsProcessed++;
    }

    // Forward summary to Honcho
    if (isHonchoReady() && result.threadsProcessed > 0) {
      const summaryText = `Email digest for ${today}: processed ${result.threadsProcessed} threads, updated ${result.contactsUpdated} contacts.`;
      await forwardMessage("user", summaryText, "system:email-digest");
    }

    health.signal("ingestion.email", true, result);
  } catch (err) {
    health.signal("ingestion.email", false, {
      error: String(err),
      ...result,
    });
  }

  return result;
}
