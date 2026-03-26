/**
 * workspace-feed.ts — Append-only activity feed for workspaces.
 *
 * Humans and agents post updates to a workspace's feed.jsonl file.
 * This replaces complex shared memory with a simple chronological log.
 */

import { existsSync, readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export type FeedEntry = {
  ts: string;           // ISO timestamp
  author: string;       // "user:agent", "teammate", "user", "system"
  type: string;         // "decision", "request", "response", "artifact", "update", "sop"
  text: string;         // The message/update
  ref?: string | null;  // Optional reference: "gdrive:file-xyz", "clickup:task-abc"
  workspace: string;    // Workspace ID this entry belongs to
};

const FEED_FILENAME = "feed.jsonl";

function feedPath(workspacePath: string): string {
  return join(workspacePath, FEED_FILENAME);
}

export function appendFeedEntry(workspacePath: string, entry: Omit<FeedEntry, "ts">): FeedEntry {
  const full: FeedEntry = { ts: new Date().toISOString(), ...entry };
  const fp = feedPath(workspacePath);
  if (!existsSync(workspacePath)) mkdirSync(workspacePath, { recursive: true });
  appendFileSync(fp, JSON.stringify(full) + "\n");
  return full;
}

export function readFeed(workspacePath: string, limit = 50, before?: string): FeedEntry[] {
  const fp = feedPath(workspacePath);
  if (!existsSync(fp)) return [];

  const lines = readFileSync(fp, "utf8").split("\n").filter(Boolean);
  let entries: FeedEntry[] = [];

  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch { /* skip malformed */ }
  }

  // Sort newest first
  entries.sort((a, b) => b.ts.localeCompare(a.ts));

  // Filter by before timestamp if provided
  if (before) {
    entries = entries.filter(e => e.ts < before);
  }

  return entries.slice(0, limit);
}

export function searchFeed(workspacePath: string, query: string, limit = 20): FeedEntry[] {
  const fp = feedPath(workspacePath);
  if (!existsSync(fp)) return [];

  const lines = readFileSync(fp, "utf8").split("\n").filter(Boolean);
  const q = query.toLowerCase();
  const results: FeedEntry[] = [];

  for (const line of lines) {
    try {
      const entry: FeedEntry = JSON.parse(line);
      if (entry.text.toLowerCase().includes(q) || entry.author.toLowerCase().includes(q)) {
        results.push(entry);
      }
    } catch { /* skip */ }
  }

  return results.sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, limit);
}

export function feedEntryCount(workspacePath: string): number {
  const fp = feedPath(workspacePath);
  if (!existsSync(fp)) return 0;
  const content = readFileSync(fp, "utf8");
  return content.split("\n").filter(Boolean).length;
}
