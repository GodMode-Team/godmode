import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export type FeedMessageType = "handoff" | "question" | "alert" | "blocked" | "fyi";

export const FEED_MESSAGE_TYPES: readonly FeedMessageType[] = [
  "handoff",
  "question",
  "alert",
  "blocked",
  "fyi",
] as const;

export type FeedMessage = {
  ts: string;
  id: string;
  from: string;
  type: FeedMessageType;
  to?: string;
  re?: string;
  msg: string;
  context?: Record<string, unknown>;
};

export type FeedCursor = {
  lastReadId?: string;
  lastReadTs?: string;
  updatedAt: string;
};

function generateId(): string {
  return crypto.randomUUID().slice(0, 12);
}

export function createFeedMessage(params: {
  from: string;
  type: FeedMessageType;
  msg: string;
  to?: string;
  re?: string;
  context?: Record<string, unknown>;
}): FeedMessage {
  return {
    ts: new Date().toISOString(),
    id: generateId(),
    from: params.from,
    type: params.type,
    msg: params.msg,
    to: params.to,
    re: params.re,
    context: params.context,
  };
}

export async function appendFeedMessage(feedPath: string, message: FeedMessage): Promise<void> {
  await fs.mkdir(path.dirname(feedPath), { recursive: true });
  const line = JSON.stringify(message) + "\n";
  await fs.appendFile(feedPath, line, "utf-8");
}

export async function readFeed(
  feedPath: string,
  opts?: { since?: string; limit?: number },
): Promise<FeedMessage[]> {
  let raw: string;
  try {
    raw = await fs.readFile(feedPath, "utf-8");
  } catch {
    return [];
  }

  const lines = raw.split("\n").filter(Boolean);
  let messages: FeedMessage[] = [];

  for (const line of lines) {
    try {
      messages.push(JSON.parse(line) as FeedMessage);
    } catch {
      // Skip malformed lines
    }
  }

  if (opts?.since) {
    const sinceTs = opts.since;
    messages = messages.filter((m) => m.ts > sinceTs);
  }

  if (opts?.limit && opts.limit > 0) {
    messages = messages.slice(-opts.limit);
  }

  return messages;
}

export function resolveFeedPath(workspacePath: string): string {
  return path.join(workspacePath, "comms", "feed.jsonl");
}

export function resolveCursorPath(workspacePath: string, memberId: string): string {
  return path.join(workspacePath, ".godmode", "local", `${memberId}-feed-cursor.json`);
}

export async function readFeedCursor(
  workspacePath: string,
  memberId: string,
): Promise<FeedCursor | null> {
  const cursorPath = resolveCursorPath(workspacePath, memberId);
  try {
    const raw = await fs.readFile(cursorPath, "utf-8");
    return JSON.parse(raw) as FeedCursor;
  } catch {
    return null;
  }
}

export async function writeFeedCursor(
  workspacePath: string,
  memberId: string,
  cursor: FeedCursor,
): Promise<void> {
  const cursorPath = resolveCursorPath(workspacePath, memberId);
  await fs.mkdir(path.dirname(cursorPath), { recursive: true });
  await fs.writeFile(cursorPath, JSON.stringify(cursor, null, 2) + "\n", "utf-8");
}

export async function getUnreadMessages(
  workspacePath: string,
  memberId: string,
): Promise<FeedMessage[]> {
  const feedPath = resolveFeedPath(workspacePath);
  const cursor = await readFeedCursor(workspacePath, memberId);

  const all = await readFeed(feedPath);
  if (!cursor?.lastReadTs) {
    return all;
  }

  return all.filter((m) => m.ts > cursor.lastReadTs!);
}

export async function markFeedRead(
  workspacePath: string,
  memberId: string,
  messages: FeedMessage[],
): Promise<void> {
  if (messages.length === 0) return;
  const last = messages[messages.length - 1];
  await writeFeedCursor(workspacePath, memberId, {
    lastReadId: last.id,
    lastReadTs: last.ts,
    updatedAt: new Date().toISOString(),
  });
}
