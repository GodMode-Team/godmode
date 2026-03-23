/**
 * queue-check.ts — Agent tool for inspecting queue status.
 *
 * Lets the ally check pending, processing, completed, or failed
 * queue items. Includes output content when results are few enough.
 */

import { readFile } from "node:fs/promises";
import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import { readQueueState } from "../lib/queue-state.js";

/** Create the queue_check tool for reading queue item status and output. */
export function createQueueCheckTool(): AnyAgentTool {
  return {
    label: "Queue",
    name: "queue_check",
    description:
      "Check the status of queued background tasks and read their output. " +
      "Use this to see what's pending, processing, completed, or needs review. " +
      "When you search for a specific task (by ID or title), the output content is included automatically.",
    parameters: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["pending", "processing", "review", "done", "failed"],
          description: "Filter by status. Omit to see all.",
        },
        query: {
          type: "string",
          description: "Search by task ID or title substring. When results are 3 or fewer, output content is included.",
        },
        limit: {
          type: "number",
          description: "Max items to return (default 10).",
        },
      },
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const state = await readQueueState();
      let items = state.items;

      const status = params.status ? String(params.status) : undefined;
      if (status) {
        items = items.filter((i) => i.status === status);
      }

      const query = params.query ? String(params.query).toLowerCase() : undefined;
      if (query) {
        items = items.filter(
          (i) => i.id.toLowerCase().includes(query) || i.title.toLowerCase().includes(query),
        );
      }

      // Sort newest first
      items = items.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      const limit = typeof params.limit === "number" ? params.limit : 10;
      const total = items.length;
      items = items.slice(0, limit);

      const counts: Record<string, number> = {};
      for (const i of state.items) {
        counts[i.status] = (counts[i.status] ?? 0) + 1;
      }

      // Auto-include output when results are narrow (specific query)
      const includeOutput = items.length <= 3;

      const mappedItems = await Promise.all(
        items.map(async (i) => {
          const base: Record<string, unknown> = {
            id: i.id,
            title: i.title,
            type: i.type,
            status: i.status,
            priority: i.priority,
            createdAt: i.createdAt,
            startedAt: i.startedAt,
            completedAt: i.completedAt,
            error: i.error,
            personaHint: i.personaHint,
          };

          const outPath = i.result?.outputPath;
          if (includeOutput && outPath) {
            try {
              base.output = await readFile(outPath, "utf-8");
            } catch {
              base.output = "(output file not found)";
            }
          } else if (outPath) {
            base.hasOutput = true;
          }

          return base;
        }),
      );

      return jsonResult({
        counts,
        total,
        showing: mappedItems.length,
        items: mappedItems,
      });
    },
  } as AnyAgentTool;
}
