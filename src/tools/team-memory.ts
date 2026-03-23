/**
 * team-memory.ts — Agent tool for writing to shared team workspace memory.
 *
 * Persists knowledge entries (discoveries, decisions, learnings) as
 * markdown files in the team's shared memory directory, synced via git.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";
// REMOVED (v2 slim): curation-agent import
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import {
  loadCombinedSessionStoreForGateway,
  loadConfig,
} from "../lib/workspace-session-store.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

/**
 * Creates the `team_memory_write` agent tool.
 * Writes knowledge entries to the team workspace memory directory.
 */
export function createTeamMemoryWriteTool(ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "team_memory_write",
    label: "Team Memory Write",
    description:
      "Write a knowledge entry to the team workspace memory. " +
      "Use this to persist important discoveries, decisions, or learnings " +
      "that should be shared with the entire team. " +
      "Content is written to the team's shared memory directory and synced via git.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "Topic slug for the memory file (e.g. 'api-conventions', 'deployment-process')",
        },
        content: {
          type: "string",
          description: "The memory content to write (markdown format)",
        },
        append: {
          type: "boolean",
          description: "If true, append to existing file instead of overwriting. Default: false",
        },
      },
      required: ["topic", "content"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const topic = typeof params.topic === "string" ? params.topic.trim() : "";
      const content = typeof params.content === "string" ? params.content.trim() : "";
      const append = Boolean(params.append);

      if (!topic || !content) {
        return jsonResult({ error: "topic and content are required" });
      }

      // Sanitize topic to safe filename
      const safeTopic = topic
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
      if (!safeTopic) {
        return jsonResult({ error: "Invalid topic name" });
      }

      const sessionKey = ctx.sessionKey;
      if (!sessionKey) {
        return jsonResult({ error: "No active session" });
      }

      const cfg = await loadConfig();
      const { store } = await loadCombinedSessionStoreForGateway(cfg);
      const sessionEntry = store[sessionKey];
      const workspaceId = sessionEntry?.workspaceId;
      if (!workspaceId) {
        return jsonResult({ error: "Current session is not associated with a team workspace" });
      }

      const config = await readWorkspaceConfig({ initializeIfMissing: false });
      const workspace = findWorkspaceById(config, workspaceId);
      if (!workspace || workspace.type !== "team") {
        return jsonResult({ error: "Current workspace is not a team workspace" });
      }

      const memoryDir = path.join(workspace.path, "memory");
      const filePath = path.join(memoryDir, `${safeTopic}.md`);

      try {
        await fs.mkdir(memoryDir, { recursive: true });

        if (append) {
          // Atomic append — no read-then-write race
          const separator = "\n\n---\n\n";
          await fs.appendFile(filePath, separator + content + "\n", "utf-8");
        } else {
          await fs.writeFile(filePath, content + "\n", "utf-8");
        }
      } catch (err) {
        return jsonResult({ error: `Failed to write: ${err instanceof Error ? err.message : String(err)}` });
      }

      // Push to git
      try {
        const syncService = getWorkspaceSyncService();
        await syncService.pushNow(workspace.id);
      } catch {
        // Non-fatal
      }

      // REMOVED (v2 slim): curation agent notification
      try {
        // no-op
      } catch {
        // Non-fatal
      }

      return jsonResult({
        written: true,
        file: `memory/${safeTopic}.md`,
        mode: append ? "append" : "overwrite",
      });
    },
  } as AnyAgentTool;
}
