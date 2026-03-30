/**
 * queue-add.ts — Agent tool for adding items to the background queue.
 *
 * The ally uses this to delegate work to specialist agents. Supports
 * a two-phase flow: first call previews a scoped brief, second call
 * (with confirmed=true) actually enqueues the item.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import { updateQueueState, newQueueItemId, type QueueItemType } from "../lib/queue-state.js";
import { resolvePersona } from "../lib/agent-roster.js";
import { getQueueProcessor } from "../services/queue-processor.js";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

/** Create the queue_add tool for enqueueing background agent tasks. */
export function createQueueAddTool(_ctx: ToolContext): AnyAgentTool {
  return {
    label: "Queue",
    name: "queue_add",
    description:
      "Queue a task for background agent processing. " +
      "IMPORTANT: You MUST first present a scoped brief to the user and get their approval. " +
      "Call once WITHOUT confirmed=true to preview the scoped brief. " +
      "Call again WITH confirmed=true only after the user approves.",
    parameters: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["coding", "research", "analysis", "creative", "review", "ops", "task", "url", "idea", "optimize"],
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
        success_criteria: {
          type: "string",
          description: "What does 'done' look like? Specific deliverable the agent must produce.",
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
        model: {
          type: "string",
          description:
            "Which model to use (e.g. 'opus', 'sonnet', 'claude-opus-4-6'). " +
            "Defaults to 'opus'. Only applies to claude engine.",
        },
        scheduled_at: {
          type: "string",
          description:
            "ISO 8601 date/time to defer processing until (e.g. '2026-03-20T09:00'). " +
            "If omitted, the task runs immediately. Use for 'do this Thursday' type requests.",
        },
        confirmed: {
          type: "boolean",
          description:
            "Set to true ONLY after the user has reviewed and approved the scoped brief. " +
            "First call without this to get the preview, then call with confirmed=true.",
        },
      },
      required: ["type", "title"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const VALID_TYPES: readonly string[] = ["coding", "research", "analysis", "creative", "review", "ops", "task", "url", "idea", "optimize"];
      const type = (params.type as QueueItemType) || "task";
      if (!VALID_TYPES.includes(type)) {
        return jsonResult({ error: true, message: `Invalid type "${type}". Must be one of: ${VALID_TYPES.join(", ")}` });
      }
      const title = String(params.title || "").trim();
      if (!title) return jsonResult({ error: true, message: "title is required" });
      if (type === "url" && !params.url) {
        return jsonResult({ error: true, message: "url is required when type is 'url'" });
      }

      // Guard: reject titles that look like auto-generated IDs instead of real topics
      const ID_PATTERN = /^(concurrent|batch|item|task)-\d{10,}-\d+$/;
      if (ID_PATTERN.test(title) || /^\d{10,}$/.test(title)) {
        return jsonResult({
          error: true,
          message:
            `Title "${title}" looks like an auto-generated ID, not a real topic. ` +
            "Please provide a descriptive title for the task.",
        });
      }

      const personaSlug = params.persona ? String(params.persona) : undefined;
      const persona = resolvePersona(type, personaSlug);
      const personaName = persona?.name ?? personaSlug ?? "(auto-resolved)";
      const description = params.description ? String(params.description) : undefined;
      const successCriteria = params.success_criteria ? String(params.success_criteria) : undefined;
      const priority = (params.priority as "high" | "normal" | "low") || "normal";
      const engine = params.engine ? String(params.engine) : persona?.engine ?? "claude";
      const model = params.model ? String(params.model) : undefined;
      const scheduledAt = params.scheduled_at
        ? new Date(String(params.scheduled_at)).getTime() || undefined
        : undefined;

      // If not confirmed, return a scoped brief for the user to review
      if (!params.confirmed) {
        return jsonResult({
          queued: false,
          preview: true,
          scopedBrief: {
            title,
            type,
            persona: personaName,
            engine,
            model: model ?? "(default: opus)",
            priority,
            description: description ?? "(none)",
            successCriteria: successCriteria ?? "(not specified — consider adding one)",
          },
          message:
            "Present this scoped brief to the user and ask for their approval before queuing:\n\n" +
            `**Task:** ${title}\n` +
            `**Type:** ${type} | **Persona:** ${personaName} | **Engine:** ${engine}\n` +
            `**Priority:** ${priority}\n` +
            (scheduledAt ? `**Scheduled:** ${new Date(scheduledAt).toLocaleString()}\n` : "") +
            (description ? `**Details:** ${description}\n` : "") +
            `**Success Criteria:** ${successCriteria ?? "Not specified"}\n\n` +
            "Ask: 'Should I queue this for background processing?' " +
            "If approved, call queue_add again with confirmed=true.",
        });
      }

      // Confirmed — actually queue the item
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

      // Proof doc creation is handled by ensureProofDocument in queue-processor
      // when the item starts processing. No need to create here.

      const { result: item } = await updateQueueState((state) => {
        const newItem = {
          id: newQueueItemId(title),
          type,
          title,
          description: successCriteria
            ? `${description ?? ""}\n\n**Success Criteria:** ${successCriteria}`.trim()
            : description,
          url: params.url ? String(params.url) : undefined,
          priority,
          status: "pending" as const,
          source: "chat" as const,
          createdAt: Date.now(),
          sessionId: _ctx.sessionKey ?? undefined,
          personaHint: personaSlug ?? persona?.slug,
          engine: params.engine ? (String(params.engine) as import("../lib/agent-roster.js").AgentEngine) : undefined,
          model,
          scheduledAt,
          handoff,
        };
        state.items.push(newItem);
        return newItem;
      });

      // Kick the queue processor immediately so the item starts within seconds
      const qp = getQueueProcessor();
      if (qp) {
        void qp.processAllPending();
      }

      return jsonResult({
        queued: true,
        item: {
          id: item.id,
          type: item.type,
          title: item.title,
          priority: item.priority,
          status: item.status,
        },
        message: scheduledAt
          ? `Scheduled: "${item.title}" (${item.type}) — ID: ${item.id}. Will run at ${new Date(scheduledAt).toLocaleString()}.`
          : `Queued: "${item.title}" (${item.type}) — ID: ${item.id}. Processing will start shortly.`,
      });
    },
  } as AnyAgentTool;
}
