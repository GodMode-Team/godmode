import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const BRIEF_NOTES_FILE = join(DATA_DIR, "brief-notes.json");

type BriefNotesData = {
  notes: Record<string, Record<string, string>>;
};

async function ensureDataDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists or creation failed
  }
}

async function readBriefNotes(): Promise<BriefNotesData> {
  try {
    const raw = await readFile(BRIEF_NOTES_FILE, "utf-8");
    return JSON.parse(raw) as BriefNotesData;
  } catch {
    return { notes: {} };
  }
}

async function writeBriefNotes(data: BriefNotesData): Promise<void> {
  await ensureDataDir();
  await writeFile(BRIEF_NOTES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const getBriefNotes: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  if (!date || typeof date !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or invalid date parameter" });
    return;
  }

  const data = await readBriefNotes();
  const notesForDate = data.notes[date] ?? {};
  respond(true, { notes: notesForDate });
};

const updateBriefNotes: GatewayRequestHandler = async ({ params, respond }) => {
  const { date, section, text } = params as { date?: string; section?: string; text?: string };

  if (!date || typeof date !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or invalid date parameter" });
    return;
  }

  if (!section || typeof section !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or invalid section parameter" });
    return;
  }

  if (typeof text !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or invalid text parameter" });
    return;
  }

  const data = await readBriefNotes();

  if (!data.notes[date]) {
    data.notes[date] = {};
  }

  if (text.trim() === "") {
    delete data.notes[date][section];
  } else {
    data.notes[date][section] = text;
  }

  await writeBriefNotes(data);

  const notesForDate = data.notes[date] ?? {};
  respond(true, { notes: notesForDate });
};

export const briefNotesHandlers: GatewayRequestHandlers = {
  "briefNotes.get": getBriefNotes,
  "briefNotes.update": updateBriefNotes,
};
