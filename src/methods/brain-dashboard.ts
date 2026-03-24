/**
 * brain-dashboard.ts — Backend for Second Brain dashboard extensions.
 *
 * Adds people, timeline, and ingestion overview to the existing secondBrain.* methods.
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, basename } from "node:path";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import { MEMORY_DIR, localDateString } from "../data-paths.js";
import { getIngestionStatus } from "../services/ingestion/runner.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── brain.people — List all people files ──────────────────────────────

const people: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const peopleDir = join(MEMORY_DIR, "people");
    if (!existsSync(peopleDir)) {
      respond(true, { people: [], total: 0 });
      return;
    }

    const files = readdirSync(peopleDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const fullPath = join(peopleDir, f);
        const stat = statSync(fullPath);
        const content = readFileSync(fullPath, "utf8");
        const name = extractTitle(content) || basename(f, ".md");
        const email = extractField(content, "Email");
        const firstSeen = extractField(content, "First seen");
        const snippet = content.slice(0, 200);

        return {
          name,
          file: f,
          path: `people/${f}`,
          email,
          firstSeen,
          lastModified: stat.mtime.toISOString(),
          snippet,
        };
      })
      .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

    const query = String(params.query ?? "").toLowerCase();
    const filtered = query
      ? files.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.email && p.email.toLowerCase().includes(query)),
        )
      : files;

    respond(true, { people: filtered, total: filtered.length });
  } catch (err) {
    respond(false, undefined, {
      code: "BRAIN_PEOPLE_ERROR",
      message: String(err),
    });
  }
};

// ── brain.person — Get single person detail ───────────────────────────

const person: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const file = String(params.file ?? "");
    if (!file) {
      respond(false, undefined, { code: "MISSING_FILE", message: "file param required" });
      return;
    }

    const peopleDir = join(MEMORY_DIR, "people");
    const fullPath = join(peopleDir, file);
    if (!fullPath.startsWith(peopleDir)) {
      respond(false, undefined, { code: "INVALID_PATH", message: "Path traversal blocked" });
      return;
    }
    if (!existsSync(fullPath)) {
      respond(false, undefined, { code: "NOT_FOUND", message: `People file not found: ${file}` });
      return;
    }

    const content = readFileSync(fullPath, "utf8");
    const name = extractTitle(content) || basename(file, ".md");

    // Query Honcho for what it knows about this person
    let honchoSays: string | null = null;
    try {
      const { queryPeer, isHonchoReady } = await import("../services/honcho-client.js");
      if (isHonchoReady()) {
        honchoSays = await queryPeer(
          `What do you know about ${name}? Include any context from past conversations.`,
          "system:brain-dashboard",
        );
      }
    } catch { /* non-fatal */ }

    respond(true, { name, content, honchoSays, file });
  } catch (err) {
    respond(false, undefined, {
      code: "BRAIN_PERSON_ERROR",
      message: String(err),
    });
  }
};

// ── brain.timeline — Daily notes timeline ─────────────────────────────

const timeline: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const days = Math.min(Number(params.days) || 14, 90);
    const dailyDir = join(MEMORY_DIR, "daily");

    if (!existsSync(dailyDir)) {
      respond(true, { entries: [], total: 0 });
      return;
    }

    const files = readdirSync(dailyDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .slice(0, days);

    const entries = files.map((f) => {
      const fullPath = join(dailyDir, f);
      const content = readFileSync(fullPath, "utf8");
      const date = basename(f, ".md");
      const lines = content.split("\n").filter((l) => l.trim());
      const entryCount = lines.filter((l) => l.startsWith("- ")).length;

      return {
        date,
        file: `daily/${f}`,
        preview: content.slice(0, 300),
        entryCount,
      };
    });

    respond(true, { entries, total: entries.length });
  } catch (err) {
    respond(false, undefined, {
      code: "BRAIN_TIMELINE_ERROR",
      message: String(err),
    });
  }
};

// ── brain.overview — Dashboard overview ───────────────────────────────

const overview: GatewayRequestHandler = async ({ respond }) => {
  try {
    const peopleDir = join(MEMORY_DIR, "people");
    const dailyDir = join(MEMORY_DIR, "daily");
    const companiesDir = join(MEMORY_DIR, "bank", "companies");

    const peopleCount = existsSync(peopleDir)
      ? readdirSync(peopleDir).filter((f) => f.endsWith(".md")).length
      : 0;
    const dailyNoteCount = existsSync(dailyDir)
      ? readdirSync(dailyDir).filter((f) => f.endsWith(".md")).length
      : 0;
    const companyCount = existsSync(companiesDir)
      ? readdirSync(companiesDir).filter((f) => f.endsWith(".md")).length
      : 0;

    // Honcho status
    let honchoStatus: string = "offline";
    try {
      const { getHonchoStatus } = await import("../services/honcho-client.js");
      honchoStatus = getHonchoStatus();
    } catch { /* non-fatal */ }

    const ingestion = getIngestionStatus();
    const today = localDateString();

    respond(true, {
      health: {
        peopleCount,
        dailyNoteCount,
        companyCount,
        honchoStatus,
        today,
      },
      ingestion,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "BRAIN_OVERVIEW_ERROR",
      message: String(err),
    });
  }
};

// ── brain.savePerson — Write/update a person file ─────────────────────

const savePerson: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const file = String(params.file ?? "");
    const content = String(params.content ?? "");
    if (!file || !content) {
      respond(false, undefined, { code: "MISSING_PARAMS", message: "file and content required" });
      return;
    }

    const { writeFileSync, mkdirSync } = await import("node:fs");
    const peopleDir = join(MEMORY_DIR, "people");
    if (!existsSync(peopleDir)) mkdirSync(peopleDir, { recursive: true });

    const fullPath = join(peopleDir, file);
    // Security: ensure we're writing within people dir
    if (!fullPath.startsWith(peopleDir)) {
      respond(false, undefined, { code: "INVALID_PATH", message: "Path traversal blocked" });
      return;
    }

    writeFileSync(fullPath, content, "utf8");
    respond(true, { saved: true, file });
  } catch (err) {
    respond(false, undefined, {
      code: "BRAIN_SAVE_ERROR",
      message: String(err),
    });
  }
};

// ── Helpers ───────────────────────────────────────────────────────────

function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

function extractField(content: string, field: string): string | null {
  const pattern = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`, "m");
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

// ── Export ─────────────────────────────────────────────────────────────

export const brainDashboardHandlers: GatewayRequestHandlers = {
  "brain.overview": overview,
  "brain.people": people,
  "brain.person": person,
  "brain.timeline": timeline,
  "brain.savePerson": savePerson,
};
