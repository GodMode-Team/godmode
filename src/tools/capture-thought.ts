/**
 * capture-thought.ts — MCP tool for persisting thoughts/facts to memory.
 *
 * The ally uses this to save important information discovered during
 * conversations. Supports scoping to personal memory or a workspace.
 *
 * Personal thoughts go to ~/godmode/memory/thoughts/.
 * Workspace-scoped thoughts go to workspaces/{id}/memory/.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";

export function createCaptureThoughtTool(ctx: {
  sessionKey?: string;
}): AnyAgentTool {
  return {
    name: "capture_thought",
    label: "Capture Thought",
    description:
      "Save a thought, fact, or decision to memory. " +
      "By default saves to personal memory. Use scope to save to a workspace " +
      "(only for information appropriate to share with that team). " +
      "Topics create or append to named files for easy browsing.",
    parameters: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description:
            "Topic slug for the memory file (e.g. 'meeting-notes', 'project-decisions', 'client-feedback')",
        },
        content: {
          type: "string",
          description: "The thought or fact to capture (markdown format)",
        },
        scope: {
          type: "string",
          description:
            "Where to save: 'personal' (default) or a workspace ID to publish to that workspace's shared memory.",
        },
      },
      required: ["topic", "content"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const topic = typeof params.topic === "string" ? params.topic.trim() : "";
      const content = typeof params.content === "string" ? params.content.trim() : "";
      const scope = typeof params.scope === "string" ? params.scope.trim() : "personal";

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

      let memoryDir: string;

      if (scope === "personal") {
        // Personal memory → ~/godmode/memory/thoughts/
        const godmodeRoot = process.env.GODMODE_ROOT || path.join(process.env.HOME || "~", "godmode");
        memoryDir = path.join(godmodeRoot, "memory", "thoughts");
      } else {
        // Workspace-scoped → resolve workspace path
        try {
          const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
          const config = await readWorkspaceConfig({ initializeIfMissing: false });
          const workspace = findWorkspaceById(config, scope);
          if (!workspace) {
            return jsonResult({ error: `Workspace not found: ${scope}` });
          }
          memoryDir = path.join(workspace.path, "memory");
        } catch (err) {
          return jsonResult({ error: `Failed to resolve workspace: ${err instanceof Error ? err.message : String(err)}` });
        }
      }

      const filePath = path.join(memoryDir, `${safeTopic}.md`);
      const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");

      try {
        await fs.mkdir(memoryDir, { recursive: true });

        // Always append with timestamp — thoughts accumulate
        const entry = `\n## ${timestamp}\n\n${content}\n`;

        let existing = "";
        try {
          existing = await fs.readFile(filePath, "utf-8");
        } catch {
          // File doesn't exist yet — create with header
          existing = `# ${topic}\n`;
        }

        await fs.writeFile(filePath, existing + entry, "utf-8");
      } catch (err) {
        return jsonResult({ error: `Failed to write: ${err instanceof Error ? err.message : String(err)}` });
      }

      // If workspace-scoped, try to sync
      if (scope !== "personal") {
        try {
          const { getWorkspaceSyncService } = await import("../lib/workspace-sync-service.js");
          const syncService = getWorkspaceSyncService();
          await syncService.pushNow(scope);
        } catch {
          // Non-fatal — sync happens on next push cycle
        }
      }

      // Signal health
      try {
        const { health } = await import("../lib/health-ledger.js");
        health.signal("memory.capture", true, { topic: safeTopic, scope });
      } catch { /* non-fatal */ }

      return jsonResult({
        captured: true,
        file: `${safeTopic}.md`,
        scope,
      });
    },
  } as AnyAgentTool;
}
