import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { updateQueueState, newQueueItemId, type QueueItemType } from "../lib/queue-state.js";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

export function createQueueAddTool(_ctx: ToolContext): AnyAgentTool {
  return {
    label: "Queue",
    name: "queue_add",
    description:
      "Drop a task, URL, research topic, or idea into the GodMode queue for background processing. " +
      "Items will be processed by sub-agents and results placed in your inbox for review.",
    parameters: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["coding", "research", "analysis", "creative", "review", "ops", "task", "url", "idea"],
          description: "Agent role type",
        },
        title: {
          type: "string",
          description: "Short descriptive title",
        },
        description: {
          type: "string",
          description: "Details, context, instructions",
        },
        url: {
          type: "string",
          description: "URL to process (for type 'url')",
        },
        priority: {
          type: "string",
          enum: ["high", "normal", "low"],
          description: "Priority level",
        },
        persona: {
          type: "string",
          description:
            "Slug of an agent-roster persona to handle this task (e.g. 'frontend-developer'). " +
            "If omitted, the best matching persona is auto-resolved from the type.",
        },
        handoff_summary: {
          type: "string",
          description: "Summary of what you did — context for the next agent picking this up",
        },
        handoff_deliverable: {
          type: "string",
          description: "What the next agent should produce / deliver",
        },
        engine: {
          type: "string",
          enum: ["claude", "codex", "gemini"],
          description:
            "Which AI engine to use. Defaults to persona's engine or 'claude'. " +
            "Use 'codex' for complex backend/multi-file work, 'claude' for speed/frontend.",
        },
      },
      required: ["type", "title"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const type = (params.type as QueueItemType) || "task";
      const title = String(params.title || "").trim();
      if (!title) return jsonResult({ error: true, message: "title is required" });

      // Build handoff context if the spawning agent provided one
      const handoffSummary = params.handoff_summary ? String(params.handoff_summary) : undefined;
      const handoffDeliverable = params.handoff_deliverable ? String(params.handoff_deliverable) : undefined;
      const handoff =
        handoffSummary || handoffDeliverable
          ? {
              fromAgent: _ctx.agentId ?? "unknown",
              fromTaskId: _ctx.sessionKey ?? "unknown",
              summary: handoffSummary ?? "",
              deliverable: handoffDeliverable ?? "",
            }
          : undefined;

      const { result: item } = await updateQueueState((state) => {
        const newItem = {
          id: newQueueItemId(title),
          type,
          title,
          description: params.description ? String(params.description) : undefined,
          url: params.url ? String(params.url) : undefined,
          priority: (params.priority as "high" | "normal" | "low") || "normal",
          status: "pending" as const,
          source: "chat" as const,
          createdAt: Date.now(),
          personaHint: params.persona ? String(params.persona) : undefined,
          engine: params.engine ? (String(params.engine) as "claude" | "codex" | "gemini") : undefined,
          handoff,
        };
        state.items.push(newItem);
        return newItem;
      });

      return jsonResult({
        queued: true,
        item: {
          id: item.id,
          type: item.type,
          title: item.title,
          priority: item.priority,
          status: item.status,
        },
        message: `Queued: "${item.title}" (${item.type}) — ID: ${item.id}. Will be processed by a background agent.`,
      });
    },
  } as AnyAgentTool;
}
