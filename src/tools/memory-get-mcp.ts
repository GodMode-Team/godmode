/**
 * memory-get-mcp.ts — MCP-compatible memory_get tool.
 *
 * Reads specific memory files by path. Scoped to GODMODE_ROOT/memory/
 * and vault paths only (never arbitrary filesystem).
 */
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { jsonResult } from "../lib/sdk-helpers.js";
import { isAllowedPath } from "../lib/vault-paths.js";

export function createMemoryGetMcpTool(): AnyAgentTool {
  return {
    label: "Memory Get",
    name: "memory_get",
    description:
      "Read a specific memory file by path. Supports memory/*.md and vault files. " +
      "Use memory_search first to discover what files exist.",
    parameters: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "Relative path within memory/ or vault (e.g. 'daily/2026-03-23.md', 'people/thomas.md')",
        },
        from: { type: "number", description: "Start line (1-indexed)" },
        lines: { type: "number", description: "Max lines to return" },
      },
      required: ["path"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const relPath = String(params.path ?? "");
      if (!relPath) return jsonResult({ error: "path is required" });

      const fullPath = resolve(MEMORY_DIR, relPath);

      // Security: must be within allowed paths
      if (!isAllowedPath(fullPath)) {
        return jsonResult({ error: "Path outside allowed roots" });
      }
      if (!existsSync(fullPath)) {
        return jsonResult({ text: "", path: relPath, exists: false });
      }

      let text = readFileSync(fullPath, "utf8");
      const fromLine = Number(params.from) || 1;
      const maxLines = Number(params.lines) || 0;

      if (fromLine > 1 || maxLines > 0) {
        const lines = text.split("\n");
        const start = Math.max(0, fromLine - 1);
        const end = maxLines > 0 ? start + maxLines : lines.length;
        text = lines.slice(start, end).join("\n");
      }

      return jsonResult({ text, path: relPath, exists: true });
    },
  };
}
