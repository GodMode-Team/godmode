/**
 * meeting-webhook.ts — Generic meeting webhook handler.
 *
 * Receives POST /godmode/webhooks/meeting with meeting data from any source
 * (Fathom, Otter, Fireflies, etc.), writes transcript to disk, and broadcasts
 * a system event so the post-meeting skill can pick it up.
 *
 * Expected Fathom webhook payload shape:
 * {
 *   title: string,
 *   recording_start_time: string,       // ISO 8601
 *   recording_end_time: string,         // ISO 8601
 *   transcript: [{ speaker_name, timestamp, text }],
 *   default_summary: { markdown_formatted: string },
 *   calendar_invitees: [{ name, email, is_external }],
 *   action_items: [{ description, assignee_name, completed }],
 *   fathom_url: string,
 *   share_url: string,
 * }
 *
 * Normalized shape accepted by this handler:
 * {
 *   title: string,
 *   transcript: string,
 *   attendees?: string[],
 *   source: string,           // e.g. "fathom", "otter", "manual"
 * }
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../data-paths.js";

// ── Types ────────────────────────────────────────────────────────────

interface MeetingPayload {
  title: string;
  transcript: string;
  attendees?: string[];
  source: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

const MEETINGS_DIR = join(MEMORY_DIR, "meetings");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/**
 * Normalize incoming payload to MeetingPayload.
 * Handles both the generic shape and Fathom's raw webhook format.
 */
function normalizePayload(raw: Record<string, unknown>): MeetingPayload {
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : "Untitled Meeting";

  // Transcript: accept string or Fathom's array format
  let transcript = "";
  if (typeof raw.transcript === "string") {
    transcript = raw.transcript;
  } else if (Array.isArray(raw.transcript)) {
    transcript = (raw.transcript as Array<Record<string, unknown>>)
      .map((item) => {
        const speaker = typeof item.speaker_name === "string" ? item.speaker_name : "Unknown";
        const ts = typeof item.timestamp === "string" ? item.timestamp : "";
        const text = typeof item.text === "string" ? item.text : "";
        return `${speaker}${ts ? ` (${ts})` : ""}: ${text}`;
      })
      .join("\n");
  }

  // Attendees: accept string[] or Fathom's calendar_invitees
  let attendees: string[] | undefined;
  if (Array.isArray(raw.attendees)) {
    attendees = raw.attendees.filter((a): a is string => typeof a === "string");
  } else if (Array.isArray(raw.calendar_invitees)) {
    attendees = (raw.calendar_invitees as Array<Record<string, unknown>>)
      .map((inv) => (typeof inv.name === "string" ? inv.name : typeof inv.email === "string" ? inv.email : null))
      .filter((n): n is string => n !== null);
  }

  const source =
    typeof raw.source === "string" && raw.source.trim()
      ? raw.source.trim()
      : "unknown";

  return { title, transcript, attendees, source };
}

// ── HTTP handler (called from http-handler.ts) ───────────────────────

let broadcastFn: ((event: string, data: unknown) => void) | null = null;

export function setMeetingWebhookBroadcast(fn: (event: string, data: unknown) => void): void {
  broadcastFn = fn;
}

export async function handleMeetingWebhookHttp(
  body: string,
  _headers: Record<string, string>,
): Promise<void> {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(body);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      console.error("[GodMode] Meeting webhook: body is not a JSON object");
      return;
    }
  } catch {
    console.error("[GodMode] Meeting webhook: body is not valid JSON");
    return;
  }

  const meeting = normalizePayload(raw);
  const date = localDateString();
  const slug = slugify(meeting.title);
  const filename = `${date}-${slug}.md`;

  // Write transcript markdown
  await mkdir(MEETINGS_DIR, { recursive: true });

  const md = [
    "---",
    `title: "${meeting.title.replace(/"/g, '\\"')}"`,
    `date: ${date}`,
    `source: ${meeting.source}`,
    meeting.attendees?.length ? `attendees: [${meeting.attendees.map((a) => `"${a}"`).join(", ")}]` : null,
    "---",
    "",
    `# ${meeting.title}`,
    "",
    meeting.attendees?.length ? `**Attendees:** ${meeting.attendees.join(", ")}` : null,
    "",
    "## Transcript",
    "",
    meeting.transcript || "_No transcript provided._",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const filePath = join(MEETINGS_DIR, filename);
  await writeFile(filePath, md, "utf-8");

  console.log(`[GodMode] Meeting webhook: saved "${meeting.title}" → ${filePath}`);

  // Broadcast event so the post-meeting skill can fire
  if (broadcastFn) {
    broadcastFn("meeting:received", {
      title: meeting.title,
      source: meeting.source,
      file: filePath,
      attendees: meeting.attendees ?? [],
    });
  }
}
