import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { STATE_DIR } from "../lib/openclaw-state.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

type SessionMeta = {
  sessionId: string;
  sessionFile?: string;
  displayName?: string;
  label?: string;
  updatedAt?: string;
};

type MatchEntry = { role: string; text: string; timestamp?: number };

type SearchResult = {
  key: string;
  label?: string;
  displayName?: string;
  matches: MatchEntry[];
};

/**
 * Extract searchable text from a message content block.
 */
function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((block: Record<string, unknown>) => {
      if (block.type === "text" && typeof block.text === "string") return block.text;
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Search a single session JSONL file for a query string.
 * Returns up to maxMatches matching excerpts.
 */
async function searchSessionFile(
  filePath: string,
  queryLower: string,
  maxMatches: number,
): Promise<MatchEntry[]> {
  const matches: MatchEntry[] = [];

  // Skip files larger than 5MB to avoid blocking
  try {
    const s = await stat(filePath);
    if (s.size > 5 * 1024 * 1024) return matches;
  } catch {
    return matches;
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: createReadStream(filePath, { encoding: "utf-8" }),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      if (matches.length >= maxMatches) {
        rl.close();
        return;
      }

      try {
        const obj = JSON.parse(line);
        if (obj.type !== "message") return;

        const msg = obj.message;
        if (!msg) return;

        const role = msg.role;
        if (role !== "user" && role !== "assistant") return;

        const text = extractText(msg.content);
        const textLower = text.toLowerCase();
        const idx = textLower.indexOf(queryLower);
        if (idx === -1) return;

        // Extract context around match (80 chars before, 120 after)
        const start = Math.max(0, idx - 80);
        const end = Math.min(text.length, idx + queryLower.length + 120);
        let excerpt = text.slice(start, end).replace(/\s+/g, " ").trim();
        if (start > 0) excerpt = "..." + excerpt;
        if (end < text.length) excerpt = excerpt + "...";

        matches.push({
          role,
          text: excerpt,
          timestamp: msg.timestamp ? Number(msg.timestamp) : undefined,
        });
      } catch {
        // Skip malformed lines
      }
    });

    rl.on("close", () => resolve(matches));
    rl.on("error", () => resolve(matches));
  });
}

/**
 * sessions.searchContent — Full-text search across session message history.
 *
 * Params: { query: string, limit?: number }
 * Returns: { ts: number, results: SearchResult[] }
 */
const searchContent: GatewayRequestHandler = async ({ params, respond }) => {
  const query = typeof params.query === "string" ? params.query.trim() : "";
  if (!query) {
    respond(true, { ts: Date.now(), results: [] });
    return;
  }

  const limit = Math.min(
    Math.max(1, typeof params.limit === "number" ? params.limit : 20),
    50,
  );

  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];

  // Load the sessions index from all agents
  const agentsDir = path.join(STATE_DIR, "agents");
  const agentDirs: string[] = [];

  try {
    const { readdir } = await import("node:fs/promises");
    const entries = await readdir(agentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        agentDirs.push(path.join(agentsDir, entry.name));
      }
    }
  } catch {
    // No agents directory
    respond(true, { ts: Date.now(), results: [] });
    return;
  }

  // Collect all sessions across agents, sorted by updatedAt (most recent first)
  type SessionWithKey = { key: string; meta: SessionMeta };
  const allSessions: SessionWithKey[] = [];

  for (const agentDir of agentDirs) {
    const indexPath = path.join(agentDir, "sessions", "sessions.json");
    try {
      const raw = await readFile(indexPath, "utf-8");
      const index: Record<string, SessionMeta> = JSON.parse(raw);
      for (const [key, meta] of Object.entries(index)) {
        if (meta.sessionFile) {
          allSessions.push({ key, meta });
        }
      }
    } catch {
      // Skip agents without sessions index
    }
  }

  // Sort by updatedAt descending so recent sessions are searched first
  allSessions.sort((a, b) => {
    const aTime = Number(a.meta.updatedAt) || 0;
    const bTime = Number(b.meta.updatedAt) || 0;
    return bTime - aTime;
  });

  // Search sessions — stop once we have enough results
  // Process in batches to avoid blocking too long
  const MAX_SESSIONS_TO_SCAN = 200;
  const sessionsToScan = allSessions.slice(0, MAX_SESSIONS_TO_SCAN);

  for (const { key, meta } of sessionsToScan) {
    if (results.length >= limit) break;

    // Quick check: does session metadata match?
    const metaMatch =
      (meta.displayName && meta.displayName.toLowerCase().includes(queryLower)) ||
      (meta.label && meta.label.toLowerCase().includes(queryLower));

    const filePath = meta.sessionFile;
    if (!filePath) continue;

    const matches = await searchSessionFile(filePath, queryLower, 3);

    // If metadata matches but no content matches, still include it
    if (matches.length === 0 && metaMatch) {
      matches.push({
        role: "system",
        text: `Session: ${meta.displayName || meta.label || key}`,
      });
    }

    if (matches.length > 0) {
      results.push({
        key,
        label: meta.label,
        displayName: meta.displayName,
        matches,
      });
    }
  }

  respond(true, { ts: Date.now(), results });
};

export const sessionSearchHandlers: GatewayRequestHandlers = {
  "sessions.searchContent": searchContent,
};
