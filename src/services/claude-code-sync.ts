/**
 * Claude Code → Agent Log sync service.
 *
 * Scans ~/.claude/projects/ for Claude Code session JSONL files,
 * parses them, and appends summary entries to the GodMode agent-log.
 * Tracks already-synced sessions to avoid duplicates.
 */

import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { createReadStream } from "node:fs";
import { appendEntry } from "../lib/agent-log.js";
import { DATA_DIR } from "../data-paths.js";

const CLAUDE_PROJECTS_DIR = path.join(os.homedir(), ".claude", "projects");
const SYNC_STATE_PATH = path.join(DATA_DIR, "claude-code-sync.json");

/** Minimum session duration (ms) to bother logging — skip sub-minute sessions */
const MIN_SESSION_DURATION_MS = 60_000;
/** Minimum tool uses to consider a session meaningful */
const MIN_TOOL_USES = 3;

type SyncState = {
  /** Map of session file path → { lastSize, lastSyncedAt } */
  synced: Record<string, { lastSize: number; lastSyncedAt: string }>;
};

type SessionSummary = {
  sessionId: string;
  projectDir: string;
  projectName: string;
  cwd: string;
  gitBranch: string;
  firstTimestamp: string;
  lastTimestamp: string;
  durationMs: number;
  userMessages: number;
  toolUses: number;
  filesRead: string[];
  filesWritten: string[];
  model: string;
  version: string;
};

async function loadSyncState(): Promise<SyncState> {
  try {
    const raw = await fsp.readFile(SYNC_STATE_PATH, "utf-8");
    return JSON.parse(raw) as SyncState;
  } catch {
    return { synced: {} };
  }
}

async function saveSyncState(state: SyncState): Promise<void> {
  await fsp.mkdir(path.dirname(SYNC_STATE_PATH), { recursive: true });
  await fsp.writeFile(SYNC_STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Parse a Claude Code JSONL session file and extract a summary.
 * Uses streaming readline to handle large files efficiently.
 */
async function parseSession(filePath: string): Promise<SessionSummary | null> {
  let firstTimestamp: string | null = null;
  let lastTimestamp: string | null = null;
  let userMessages = 0;
  let toolUses = 0;
  let cwd = "";
  let gitBranch = "";
  let sessionId = "";
  let model = "";
  let version = "";
  const filesRead = new Set<string>();
  const filesWritten = new Set<string>();

  const rl = readline.createInterface({
    input: createReadStream(filePath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line) as Record<string, unknown>;
      const ts = entry.timestamp as string | undefined;
      if (ts) {
        if (!firstTimestamp || ts < firstTimestamp) firstTimestamp = ts;
        if (!lastTimestamp || ts > lastTimestamp) lastTimestamp = ts;
      }

      const type = entry.type as string;

      if (type === "user") {
        userMessages++;
        if (!cwd && entry.cwd) cwd = entry.cwd as string;
        if (!gitBranch && entry.gitBranch) gitBranch = entry.gitBranch as string;
        if (!sessionId && entry.sessionId) sessionId = entry.sessionId as string;
        if (!version && entry.version) version = entry.version as string;
      }

      if (type === "assistant") {
        const msg = entry.message as Record<string, unknown> | undefined;
        if (!model && msg?.model) model = msg.model as string;
        const content = msg?.content as unknown[];
        if (Array.isArray(content)) {
          for (const block of content) {
            if (typeof block === "object" && block !== null) {
              const b = block as Record<string, unknown>;
              if (b.type === "tool_use") {
                toolUses++;
                const name = b.name as string;
                const input = (b.input ?? {}) as Record<string, string>;
                if (name === "Write" || name === "Edit" || name === "NotebookEdit") {
                  const fp = input.file_path;
                  if (fp) filesWritten.add(fp);
                } else if (name === "Read") {
                  const fp = input.file_path;
                  if (fp) filesRead.add(fp);
                }
              }
            }
          }
        }
      }
    } catch {
      // Skip malformed lines
    }
  }

  if (!firstTimestamp || !lastTimestamp) return null;

  const durationMs = new Date(lastTimestamp).getTime() - new Date(firstTimestamp).getTime();
  const dir = path.basename(path.dirname(filePath));
  const projectName = dir
    .replace(/^-/, "")
    .split("-")
    .filter(Boolean)
    .slice(-2)
    .join("/");

  return {
    sessionId: sessionId || path.basename(filePath, ".jsonl"),
    projectDir: dir,
    projectName,
    cwd: cwd || "unknown",
    gitBranch: gitBranch || "unknown",
    firstTimestamp,
    lastTimestamp,
    durationMs,
    userMessages,
    toolUses,
    filesRead: [...filesRead].map((fp) => path.basename(fp)),
    filesWritten: [...filesWritten].map((fp) => path.basename(fp)),
    model: model || "unknown",
    version: version || "unknown",
  };
}

function formatDuration(ms: number): string {
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Scan all Claude Code projects and sync new/updated sessions to agent-log.
 * Returns count of sessions synced.
 */
export async function syncClaudeCodeSessions(): Promise<{
  synced: number;
  skipped: number;
  errors: string[];
}> {
  const state = await loadSyncState();
  let synced = 0;
  let skipped = 0;
  const errors: string[] = [];

  let projectDirs: string[];
  try {
    projectDirs = await fsp.readdir(CLAUDE_PROJECTS_DIR);
  } catch {
    return { synced: 0, skipped: 0, errors: ["~/.claude/projects/ not found"] };
  }

  for (const projectDir of projectDirs) {
    const projectPath = path.join(CLAUDE_PROJECTS_DIR, projectDir);
    let stat;
    try {
      stat = await fsp.stat(projectPath);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;

    let files: string[];
    try {
      files = await fsp.readdir(projectPath);
    } catch {
      continue;
    }

    const jsonlFiles = files.filter((f) => f.endsWith(".jsonl"));

    for (const jsonlFile of jsonlFiles) {
      const filePath = path.join(projectPath, jsonlFile);

      let fileStat;
      try {
        fileStat = await fsp.stat(filePath);
      } catch {
        continue;
      }

      const fileSize = fileStat.size;
      const existing = state.synced[filePath];

      // Skip if already synced at the same size
      if (existing && existing.lastSize === fileSize) {
        skipped++;
        continue;
      }

      try {
        const summary = await parseSession(filePath);

        if (!summary) {
          skipped++;
          continue;
        }

        // Skip trivial sessions
        if (summary.durationMs < MIN_SESSION_DURATION_MS || summary.toolUses < MIN_TOOL_USES) {
          // Still mark as synced so we don't re-parse
          state.synced[filePath] = {
            lastSize: fileSize,
            lastSyncedAt: new Date().toISOString(),
          };
          skipped++;
          continue;
        }

        const duration = formatDuration(summary.durationMs);
        const filesWrittenStr =
          summary.filesWritten.length > 0
            ? summary.filesWritten.slice(0, 8).join(", ") +
              (summary.filesWritten.length > 8
                ? ` +${summary.filesWritten.length - 8} more`
                : "")
            : "none";

        const item = `Claude Code session: ${summary.projectName} (${summary.gitBranch})`;
        const output = [
          `${summary.userMessages} messages, ${summary.toolUses} tool uses, ${duration}`,
          `Files modified: ${filesWrittenStr}`,
          `Model: ${summary.model}`,
        ].join(" | ");

        await appendEntry({
          category: "completed",
          item,
          output,
        });

        state.synced[filePath] = {
          lastSize: fileSize,
          lastSyncedAt: new Date().toISOString(),
        };
        synced++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${jsonlFile}: ${msg}`);
      }
    }
  }

  await saveSyncState(state);
  return { synced, skipped, errors };
}
