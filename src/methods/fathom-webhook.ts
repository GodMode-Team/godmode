/**
 * Fathom Webhook Handler — Meeting recording queue for post-meeting flow.
 *
 * Receives Fathom webhook POSTs (or manual ingest via RPC), queues meetings
 * in ~/godmode/data/meeting-queue.json, and exposes RPC methods for agents
 * to list, retrieve, and mark meetings as processed.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createHmac, timingSafeEqual } from "node:crypto";
import { join, dirname } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR, GODMODE_ROOT } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Types ────────────────────────────────────────────────────────────

type MeetingAttendee = {
  name: string | null;
  email: string | null;
  isExternal: boolean;
};

type MeetingActionItem = {
  description: string;
  assigneeName: string | null;
  assigneeEmail: string | null;
  completed: boolean;
};

type MeetingQueueItem = {
  id: number;
  receivedAt: string;
  status: "pending" | "processing" | "processed" | "failed";
  title: string;
  date: string;
  durationMin: number;
  attendees: MeetingAttendee[];
  summary: string | null;
  transcript: string | null;
  actionItems: MeetingActionItem[];
  fathomUrl: string;
  shareUrl: string;
  processedAt: string | null;
  processedNotes: string | null;
  error: string | null;
};

type MeetingQueue = {
  version: 1;
  webhookConfigured: boolean;
  webhookSecret: string | null;
  meetings: MeetingQueueItem[];
};

// ── Constants ────────────────────────────────────────────────────────

const QUEUE_FILE = join(DATA_DIR, "meeting-queue.json");
const FATHOM_API_BASE = "https://api.fathom.ai/external/v1";

// ── Env helpers ──────────────────────────────────────────────────────

function loadEnv(): Record<string, string> {
  const envPath = join(GODMODE_ROOT, ".env");
  const vars: Record<string, string> = {};
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("#") || !line.includes("=")) continue;
      const eqIdx = line.indexOf("=");
      const key = line.slice(0, eqIdx).trim();
      const value = line.slice(eqIdx + 1).trim();
      if (key) vars[key] = value;
    }
  } catch {
    // .env not found
  }
  return vars;
}

function getEnv(key: string): string {
  return process.env[key] || loadEnv()[key] || "";
}

// ── Data helpers ─────────────────────────────────────────────────────

async function readMeetingQueue(): Promise<MeetingQueue> {
  try {
    const raw = await readFile(QUEUE_FILE, "utf-8");
    return JSON.parse(raw) as MeetingQueue;
  } catch {
    return {
      version: 1,
      webhookConfigured: false,
      webhookSecret: null,
      meetings: [],
    };
  }
}

async function writeMeetingQueue(queue: MeetingQueue): Promise<void> {
  await mkdir(dirname(QUEUE_FILE), { recursive: true });
  await writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

// ── Fathom API helpers ───────────────────────────────────────────────

async function fathomApiFetch(
  path: string,
  apiKey: string,
  options?: { method?: string; body?: unknown },
): Promise<Response> {
  const url = `${FATHOM_API_BASE}${path}`;
  const init: RequestInit = {
    method: options?.method ?? "GET",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
  };
  if (options?.body) {
    init.body = JSON.stringify(options.body);
  }
  return fetch(url, init);
}

function parseFathomMeeting(meeting: unknown): MeetingQueueItem {
  const m = meeting as Record<string, unknown>;

  const recordingId = typeof m.recording_id === "number" ? m.recording_id : 0;
  const title = typeof m.title === "string" ? m.title : "Untitled Meeting";

  // Duration from timestamps
  const startTime = typeof m.recording_start_time === "string" ? m.recording_start_time : "";
  const endTime = typeof m.recording_end_time === "string" ? m.recording_end_time : "";
  let durationMin = 0;
  if (startTime && endTime) {
    const ms = new Date(endTime).getTime() - new Date(startTime).getTime();
    durationMin = Math.round(ms / 60_000);
  }

  // Transcript: array of TranscriptItem → formatted string
  let transcript: string | null = null;
  if (Array.isArray(m.transcript)) {
    const lines = (m.transcript as Array<Record<string, unknown>>).map((item) => {
      const speaker = typeof item.speaker_name === "string" ? item.speaker_name : "Unknown";
      const ts = typeof item.timestamp === "string" ? item.timestamp : "00:00:00";
      const text = typeof item.text === "string" ? item.text : "";
      return `${speaker} (${ts}): ${text}`;
    });
    transcript = lines.length > 0 ? lines.join("\n") : null;
  }

  // Summary from default_summary
  let summary: string | null = null;
  if (m.default_summary && typeof m.default_summary === "object") {
    const ds = m.default_summary as Record<string, unknown>;
    if (typeof ds.markdown_formatted === "string") {
      summary = ds.markdown_formatted;
    }
  }

  // Attendees from calendar_invitees
  const attendees: MeetingAttendee[] = [];
  if (Array.isArray(m.calendar_invitees)) {
    for (const inv of m.calendar_invitees as Array<Record<string, unknown>>) {
      attendees.push({
        name: typeof inv.name === "string" ? inv.name : null,
        email: typeof inv.email === "string" ? inv.email : null,
        isExternal: typeof inv.is_external === "boolean" ? inv.is_external : false,
      });
    }
  }

  // Action items
  const actionItems: MeetingActionItem[] = [];
  if (Array.isArray(m.action_items)) {
    for (const ai of m.action_items as Array<Record<string, unknown>>) {
      actionItems.push({
        description: typeof ai.description === "string" ? ai.description : "",
        assigneeName: typeof ai.assignee_name === "string" ? ai.assignee_name : null,
        assigneeEmail: typeof ai.assignee_email === "string" ? ai.assignee_email : null,
        completed: typeof ai.completed === "boolean" ? ai.completed : false,
      });
    }
  }

  // URLs
  const fathomUrl = typeof m.fathom_url === "string" ? m.fathom_url : "";
  const shareUrl = typeof m.share_url === "string" ? m.share_url : "";

  return {
    id: recordingId,
    receivedAt: new Date().toISOString(),
    status: "pending",
    title,
    date: startTime || new Date().toISOString(),
    durationMin,
    attendees,
    summary,
    transcript,
    actionItems,
    fathomUrl,
    shareUrl,
    processedAt: null,
    processedNotes: null,
    error: null,
  };
}

function verifyWebhookSignatureFromHeaders(
  secret: string,
  headers: Record<string, string>,
  body: string,
): boolean {
  const webhookId = headers["webhook-id"] || "";
  const timestamp = headers["webhook-timestamp"] || "";
  const signatureHeader = headers["webhook-signature"] || "";

  if (!webhookId || !timestamp || !signatureHeader) return false;

  try {
    const secretBytes = Buffer.from(
      secret.startsWith("whsec_") ? secret.slice(6) : secret,
      "base64",
    );
    const signaturePayload = `${webhookId}.${timestamp}.${body}`;
    const expected = createHmac("sha256", secretBytes)
      .update(signaturePayload)
      .digest("base64");

    // signatureHeader can contain multiple signatures: "v1,<sig1> v1,<sig2>"
    const signatures = signatureHeader.split(" ");
    const expectedBuf = Buffer.from(expected, "utf-8");

    for (const sig of signatures) {
      const parts = sig.split(",");
      if (parts.length !== 2 || parts[0] !== "v1") continue;
      const actualBuf = Buffer.from(parts[1], "utf-8");
      if (expectedBuf.length === actualBuf.length && timingSafeEqual(expectedBuf, actualBuf)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

// ── Webhook HTTP handler (exported for index.ts) ─────────────────────

export async function handleFathomWebhookHttp(
  body: string,
  headers: Record<string, string>,
): Promise<void> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    console.error("[GodMode] Fathom: webhook body is not valid JSON");
    return;
  }

  const queue = await readMeetingQueue();

  // Signature verification (warn-only for v1)
  if (queue.webhookSecret) {
    const valid = verifyWebhookSignatureFromHeaders(queue.webhookSecret, headers, body);
    if (!valid) {
      console.warn(
        "[GodMode] Fathom: webhook signature verification failed — processing anyway (v1 permissive mode)",
      );
    }
  }

  // Parse the meeting object
  let item: MeetingQueueItem;
  try {
    item = parseFathomMeeting(parsed);
  } catch (err) {
    console.error(
      `[GodMode] Fathom: could not parse webhook payload — ${err instanceof Error ? err.message : String(err)}`,
    );
    return;
  }

  // Deduplicate
  if (item.id && queue.meetings.some((m) => m.id === item.id)) {
    console.log(`[GodMode] Fathom: skipped duplicate recording ${item.id}`);
    return;
  }

  queue.meetings.push(item);
  await writeMeetingQueue(queue);

  console.log(
    `[GodMode] Fathom: queued "${item.title}" (${item.durationMin}min, ${item.attendees.length} attendees)`,
  );
}

// ── RPC Handlers ─────────────────────────────────────────────────────

const listMeetings: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { status, limit } = params as { status?: string; limit?: number };
    const queue = await readMeetingQueue();

    let meetings = queue.meetings;
    if (status) {
      meetings = meetings.filter((m) => m.status === status);
    }

    // Sort newest-first by receivedAt
    meetings.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

    const cap = typeof limit === "number" && limit > 0 ? limit : 50;
    meetings = meetings.slice(0, cap);

    respond(true, { meetings, count: meetings.length });
  } catch (err) {
    respond(false, null, {
      code: "QUEUE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const getMeeting: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { id } = params as { id?: number };
    const queue = await readMeetingQueue();

    let meeting: MeetingQueueItem | null = null;

    if (typeof id === "number") {
      meeting = queue.meetings.find((m) => m.id === id) ?? null;
    } else {
      // Return oldest pending meeting (FIFO)
      const pending = queue.meetings
        .filter((m) => m.status === "pending")
        .sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
      meeting = pending[0] ?? null;
    }

    respond(true, { meeting });
  } catch (err) {
    respond(false, null, {
      code: "QUEUE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const markProcessed: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { id, notes } = params as { id?: number; notes?: string };

    if (typeof id !== "number") {
      respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
      return;
    }

    const queue = await readMeetingQueue();
    const meeting = queue.meetings.find((m) => m.id === id);

    if (!meeting) {
      respond(false, null, { code: "NOT_FOUND", message: `Meeting ${id} not found in queue` });
      return;
    }

    meeting.status = "processed";
    meeting.processedAt = new Date().toISOString();
    meeting.processedNotes = notes ?? null;

    await writeMeetingQueue(queue);
    respond(true, { meeting });
  } catch (err) {
    respond(false, null, {
      code: "QUEUE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const ingest: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { recordingId } = params as { recordingId?: number };

    if (typeof recordingId !== "number") {
      respond(false, null, { code: "INVALID_REQUEST", message: "recordingId is required" });
      return;
    }

    const apiKey = getEnv("FATHOM_API_KEY");
    if (!apiKey) {
      respond(false, null, {
        code: "API_KEY_MISSING",
        message: "FATHOM_API_KEY is not configured. Add it to ~/godmode/.env",
      });
      return;
    }

    const queue = await readMeetingQueue();

    // Deduplicate
    const existing = queue.meetings.find((m) => m.id === recordingId);
    if (existing) {
      respond(false, null, {
        code: "ALREADY_EXISTS",
        message: `Recording ${recordingId} is already queued (status: ${existing.status})`,
      });
      return;
    }

    // Fetch recording details from Fathom API
    const recordingRes = await fathomApiFetch(`/recordings/${recordingId}`, apiKey);
    if (!recordingRes.ok) {
      const errorBody = await recordingRes.text();
      respond(false, null, {
        code: "FATHOM_API_ERROR",
        message: `Fathom API returned ${recordingRes.status}: ${errorBody}`,
      });
      return;
    }

    const recordingData = await recordingRes.json();
    const item = parseFathomMeeting(recordingData);

    queue.meetings.push(item);
    await writeMeetingQueue(queue);

    console.log(`[GodMode] Fathom: manually ingested recording ${recordingId} — "${item.title}"`);
    respond(true, { meeting: item });
  } catch (err) {
    respond(false, null, {
      code: "FATHOM_API_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const webhookReceive: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { payload, headers } = params as {
      payload?: unknown;
      headers?: Record<string, string>;
    };

    if (!payload) {
      respond(false, null, { code: "INVALID_REQUEST", message: "payload is required" });
      return;
    }

    const queue = await readMeetingQueue();

    // Signature verification (warn-only)
    if (queue.webhookSecret && headers) {
      const bodyStr = typeof payload === "string" ? payload : JSON.stringify(payload);
      const valid = verifyWebhookSignatureFromHeaders(queue.webhookSecret, headers, bodyStr);
      if (!valid) {
        console.warn(
          "[GodMode] Fathom: webhook signature verification failed — processing anyway (v1 permissive mode)",
        );
      }
    }

    let item: MeetingQueueItem;
    try {
      item = parseFathomMeeting(payload);
    } catch (err) {
      respond(false, null, {
        code: "PARSE_ERROR",
        message: `Could not parse Fathom meeting data: ${err instanceof Error ? err.message : String(err)}`,
      });
      return;
    }

    // Deduplicate
    if (item.id && queue.meetings.some((m) => m.id === item.id)) {
      console.log(`[GodMode] Fathom: skipped duplicate recording ${item.id}`);
      respond(true, { queued: false, recordingId: item.id });
      return;
    }

    queue.meetings.push(item);
    await writeMeetingQueue(queue);

    console.log(
      `[GodMode] Fathom: queued "${item.title}" (${item.durationMin}min, ${item.attendees.length} attendees)`,
    );
    respond(true, { queued: true, recordingId: item.id });
  } catch (err) {
    respond(false, null, {
      code: "QUEUE_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const setupWebhook: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const { destinationUrl } = params as { destinationUrl?: string };

    if (!destinationUrl) {
      respond(false, null, { code: "INVALID_REQUEST", message: "destinationUrl is required" });
      return;
    }

    const apiKey = getEnv("FATHOM_API_KEY");
    if (!apiKey) {
      respond(false, null, {
        code: "API_KEY_MISSING",
        message: "FATHOM_API_KEY is not configured. Add it to ~/godmode/.env",
      });
      return;
    }

    const res = await fathomApiFetch("/webhooks", apiKey, {
      method: "POST",
      body: {
        destination_url: destinationUrl,
        triggered_for: ["my_recordings"],
        include_transcript: true,
        include_summary: true,
        include_action_items: true,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      respond(false, null, {
        code: "FATHOM_API_ERROR",
        message: `Fathom API returned ${res.status}: ${errorBody}`,
      });
      return;
    }

    const data = (await res.json()) as Record<string, unknown>;
    const webhookId = typeof data.id === "string" ? data.id : String(data.id ?? "");
    const secret = typeof data.secret === "string" ? data.secret : "";

    // Store secret in queue file
    const queue = await readMeetingQueue();
    queue.webhookConfigured = true;
    queue.webhookSecret = secret || null;
    await writeMeetingQueue(queue);

    console.log(`[GodMode] Fathom: webhook registered → ${destinationUrl}`);
    respond(true, { webhookId, secret });
  } catch (err) {
    respond(false, null, {
      code: "FATHOM_API_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Export ────────────────────────────────────────────────────────────

export const fathomWebhookHandlers: GatewayRequestHandlers = {
  "fathom.listMeetings": listMeetings,
  "fathom.getMeeting": getMeeting,
  "fathom.markProcessed": markProcessed,
  "fathom.ingest": ingest,
  "fathom.webhookReceive": webhookReceive,
  "fathom.setupWebhook": setupWebhook,
};
