/**
 * capture-thought.ts — Write a thought/fact to memory.
 *
 * Writes to today's daily note AND forwards to Honcho for reasoning.
 * Used by external MCP clients to capture information into the brain.
 */
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../data-paths.js";
import { jsonResult } from "../lib/sdk-helpers.js";

export function createCaptureThoughtTool(): AnyAgentTool {
  return {
    label: "Capture Thought",
    name: "capture_thought",
    description:
      "Write a thought, fact, or note to memory. Saved to today's daily note " +
      "and processed by the reasoning engine. Optionally tags a person or company.",
    parameters: {
      type: "object" as const,
      properties: {
        thought: {
          type: "string",
          description: "The thought, fact, or note to capture",
        },
        category: {
          type: "string",
          description:
            "Optional: 'person', 'company', 'decision', 'idea', 'meeting'. Defaults to general.",
        },
        entity: {
          type: "string",
          description:
            "Optional: person or company name if category is 'person' or 'company'",
        },
      },
      required: ["thought"],
    },
    execute: async (_id: string, params: Record<string, unknown>) => {
      const thought = String(params.thought ?? "").trim();
      if (!thought) return jsonResult({ error: "thought is required" });

      const category = String(params.category ?? "general");
      const entity = String(params.entity ?? "").trim();
      const today = localDateString();
      const timestamp = new Date().toLocaleTimeString("en-US", {
        timeZone: process.env.TZ || "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
      });

      // 1. Append to daily note
      const dailyDir = join(MEMORY_DIR, "daily");
      if (!existsSync(dailyDir)) mkdirSync(dailyDir, { recursive: true });
      const dailyPath = join(dailyDir, `${today}.md`);

      if (!existsSync(dailyPath)) {
        writeFileSync(dailyPath, `# Memory — ${today}\n\n`);
      }

      const entry = `- [${timestamp}] [${category}] ${thought}\n`;
      appendFileSync(dailyPath, entry);

      // 2. If person/company, also update their file
      let entityFile: string | undefined;
      if (entity && (category === "person" || category === "company")) {
        const subdir = category === "person" ? "people" : "bank/companies";
        const entityDir = join(MEMORY_DIR, subdir);
        if (!existsSync(entityDir)) mkdirSync(entityDir, { recursive: true });
        const safeName = entity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const entityPath = join(entityDir, `${safeName}.md`);

        if (!existsSync(entityPath)) {
          writeFileSync(
            entityPath,
            `# ${entity}\n\n## Notes\n\n- [${today}] ${thought}\n`,
          );
        } else {
          appendFileSync(entityPath, `\n- [${today}] ${thought}\n`);
        }
        entityFile = `${subdir}/${safeName}.md`;
      }

      // 3. Forward to Honcho for reasoning (best-effort)
      try {
        const { forwardToHoncho } = await import(
          "../services/honcho-client.js"
        );
        await forwardToHoncho(
          `[Captured thought - ${category}] ${thought}`,
          `mcp:capture`,
        );
      } catch {
        /* non-fatal */
      }

      return jsonResult({
        status: "captured",
        dailyNote: `daily/${today}.md`,
        ...(entityFile ? { entityFile } : {}),
      });
    },
  };
}
