import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { updateQueueState, newQueueItemId, type QueueItemType } from "../lib/queue-state.js";
import { resolvePersona } from "../lib/agent-roster.js";
import { getQueueProcessor } from "../services/queue-processor.js";
import { createProofDocument } from "../lib/proof-bridge.js";
import { isProofRunning } from "../services/proof-server.js";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

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
      const type = (params.type as QueueItemType) || "task";
      const title = String(params.title || "").trim();
      if (!title) return jsonResult({ error: true, message: "title is required" });

      const personaSlug = params.persona ? String(params.persona) : undefined;
      const persona = resolvePersona(type, personaSlug);
      const personaName = persona?.name ?? personaSlug ?? "(auto-resolved)";
      const description = params.description ? String(params.description) : undefined;
      const successCriteria = params.success_criteria ? String(params.success_criteria) : undefined;
      const priority = (params.priority as "high" | "normal" | "low") || "normal";
      const engine = params.engine ? String(params.engine) : persona?.engine ?? "claude";

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
            priority,
            description: description ?? "(none)",
            successCriteria: successCriteria ?? "(not specified — consider adding one)",
          },
          message:
            "Present this scoped brief to the user and ask for their approval before queuing:\n\n" +
            `**Task:** ${title}\n` +
            `**Type:** ${type} | **Persona:** ${personaName} | **Engine:** ${engine}\n` +
            `**Priority:** ${priority}\n` +
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

      let proofDocSlug: string | undefined;
      let proofDocFilePath: string | undefined;
      if (isProofRunning()) {
        try {
          const proofDoc = await createProofDocument(
            title,
            `# ${title}\n\n## Working Draft\n\n`,
            "ally",
          );
          proofDocSlug = proofDoc.slug;
          proofDocFilePath = proofDoc.filePath;
        } catch {
          // Proof is best-effort; queue item can still run without it.
        }
      }

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
          engine: params.engine ? (String(params.engine) as "claude" | "codex" | "gemini") : undefined,
          proofDocSlug,
          proofDocFilePath,
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
        message: `Queued: "${item.title}" (${item.type}) — ID: ${item.id}. Processing will start shortly.`,
      });
    },
  } as AnyAgentTool;
}
