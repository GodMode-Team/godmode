import fs from "node:fs/promises";
import path from "node:path";
import {
  loadCombinedSessionStoreForGateway,
  loadConfig,
} from "../lib/workspace-session-store.js";
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

/**
 * Hook for `before_reset` — when a session ends or resets, write a memory
 * entry to the team workspace if the session belongs to one.
 *
 * Instead of building a naive text summary, we write a lightweight index
 * entry referencing the full session file. Curation can later read the
 * session logs if it needs the full content.
 */
export async function handleTeamMemoryRoute(
  event: { sessionFile?: string; messages?: unknown[]; reason?: string },
  ctx: { sessionKey?: string; agentId?: string },
): Promise<void> {
  const sessionKey = ctx.sessionKey;
  if (!sessionKey) return;

  const cfg = await loadConfig();
  const { store } = await loadCombinedSessionStoreForGateway(cfg);
  const sessionEntry = store[sessionKey];
  const workspaceId = sessionEntry?.workspaceId;
  if (!workspaceId) return;

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace || workspace.type !== "team") return;

  const entry = buildSessionEntry(event, ctx, sessionEntry.displayName);
  if (!entry) return;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toISOString().slice(11, 19).replace(/:/g, "");
  const fileName = `${dateStr}-${timeStr}-session.md`;
  const memoryDir = path.join(workspace.path, "memory");

  try {
    await fs.mkdir(memoryDir, { recursive: true });
    await fs.writeFile(path.join(memoryDir, fileName), entry, "utf-8");
  } catch {
    // Non-fatal — don't break session reset
    return;
  }

  // Push immediately so other team members see the memory
  try {
    const syncService = getWorkspaceSyncService();
    await syncService.pushNow(workspace.id);
  } catch {
    // Non-fatal
  }
}

function buildSessionEntry(
  event: { sessionFile?: string; messages?: unknown[]; reason?: string },
  ctx: { sessionKey?: string; agentId?: string },
  sessionTitle?: string,
): string | null {
  const title = sessionTitle || "Session";
  const now = new Date().toISOString();
  const lines: string[] = [`# ${title}`, "", `_Captured: ${now}_`];

  if (ctx.agentId) {
    lines.push(`_Agent: ${ctx.agentId}_`);
  }
  if (event.reason) {
    lines.push(`_Reason: ${event.reason}_`);
  }

  // Reference the session file for full context (avoids duplicating large content)
  if (event.sessionFile) {
    lines.push("", `**Session log**: \`${event.sessionFile}\``);
  }

  // Extract a concise topic line from the first user message (if available)
  const topic = extractFirstUserTopic(event.messages);
  if (topic) {
    lines.push("", `**Topic**: ${topic}`);
  }

  // Only produce an entry if there's meaningful content
  if (!event.sessionFile && !topic) return null;

  lines.push("");
  return lines.join("\n");
}

function extractFirstUserTopic(messages: unknown[] | undefined): string | null {
  if (!messages || messages.length === 0) return null;

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") continue;
    const m = msg as Record<string, unknown>;
    if (m.role !== "user") continue;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!content) continue;
    // Take just the first line, capped at 200 chars
    const firstLine = content.split("\n")[0].slice(0, 200);
    return firstLine;
  }

  return null;
}
