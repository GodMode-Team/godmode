import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { updateQueueState, type QueueItem } from "../lib/queue-state.js";

export function createQueueActionTool(): AnyAgentTool {
  return {
    label: "Queue",
    name: "queue_action",
    description:
      "Take action on a queue item: approve (mark done), reject, retry, or remove. " +
      "Use queue_check first to find the item ID, then use this tool to act on it.",
    parameters: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The queue item ID to act on.",
        },
        action: {
          type: "string",
          enum: ["approve", "reject", "retry", "remove"],
          description:
            "approve = mark as done (only for 'review' items). " +
            "reject = mark as failed with a reason. " +
            "retry = reset to pending for reprocessing. " +
            "remove = delete the item entirely.",
        },
        reason: {
          type: "string",
          description: "Reason for rejection (required for 'reject' action).",
        },
      },
      required: ["id", "action"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const id = String(params.id || "").trim();
      const action = String(params.action || "").trim();
      if (!id) return jsonResult({ error: true, message: "id is required" });
      if (!action) return jsonResult({ error: true, message: "action is required" });

      switch (action) {
        case "approve": {
          const { result } = await updateQueueState((state) => {
            const idx = state.items.findIndex((i) => i.id === id);
            if (idx === -1) return { item: null, error: "Queue item not found" };
            const item = state.items[idx];
            if (item.status !== "review") {
              return { item: null, error: `Cannot approve item with status "${item.status}". Only "review" items can be approved.` };
            }
            item.status = "done";
            item.completedAt = Date.now();
            state.items[idx] = item;
            return { item, error: null };
          });

          if (result.error || !result.item) {
            return jsonResult({ error: true, message: result.error ?? "Queue item not found" });
          }

          // Auto-rate persona trust (approval = good)
          if (result.item.personaHint) {
            try {
              const { autoRate } = await import("../methods/trust-tracker.js");
              await autoRate(result.item.personaHint, 7, `Approved: "${result.item.title}"`, "auto-approve");
            } catch { /* best-effort */ }
          }

          // If linked to a task, mark it complete
          if (result.item.sourceTaskId) {
            try {
              const { updateTasks } = await import("../methods/tasks.js");
              await updateTasks((data) => {
                const taskIdx = data.tasks.findIndex((t) => t.id === result.item!.sourceTaskId);
                if (taskIdx !== -1) {
                  data.tasks[taskIdx].status = "complete";
                  data.tasks[taskIdx].completedAt = new Date().toISOString();
                }
              });
            } catch { /* best-effort */ }
          }

          return jsonResult({
            success: true,
            action: "approved",
            item: { id: result.item.id, title: result.item.title, status: result.item.status },
            message: `Approved and marked done: "${result.item.title}"`,
          });
        }

        case "reject": {
          const reason = params.reason ? String(params.reason) : "Rejected by user";
          const { result } = await updateQueueState((state) => {
            const idx = state.items.findIndex((i) => i.id === id);
            if (idx === -1) return { item: null, error: "Queue item not found" };
            const item = state.items[idx];
            if (item.status !== "review") {
              return { item: null, error: `Cannot reject item with status "${item.status}"` };
            }
            item.status = "failed";
            item.completedAt = Date.now();
            item.error = reason;
            state.items[idx] = item;
            return { item, error: null };
          });

          if (result.error || !result.item) {
            return jsonResult({ error: true, message: result.error ?? "Queue item not found" });
          }

          // Auto-rate persona trust (rejection = poor)
          if (result.item.personaHint) {
            try {
              const { autoRate } = await import("../methods/trust-tracker.js");
              await autoRate(result.item.personaHint, 3, `Rejected: "${result.item.title}" — ${reason}`, "auto-reject");
            } catch { /* best-effort */ }
          }

          return jsonResult({
            success: true,
            action: "rejected",
            item: { id: result.item.id, title: result.item.title, status: result.item.status },
            message: `Rejected: "${result.item.title}" — ${reason}`,
          });
        }

        case "retry": {
          const { result } = await updateQueueState((state) => {
            const idx = state.items.findIndex((i) => i.id === id);
            if (idx === -1) return { item: null, error: "Queue item not found" };
            const item = state.items[idx];
            if (item.status !== "failed" && item.status !== "review") {
              return { item: null, error: `Cannot retry item with status "${item.status}". Only "failed" or "review" items can be retried.` };
            }
            item.status = "pending";
            item.error = undefined;
            item.lastError = undefined;
            item.completedAt = undefined;
            item.startedAt = undefined;
            item.pid = undefined;
            state.items[idx] = item;
            return { item, error: null };
          });

          if (result.error || !result.item) {
            return jsonResult({ error: true, message: result.error ?? "Queue item not found" });
          }

          return jsonResult({
            success: true,
            action: "retried",
            item: { id: result.item.id, title: result.item.title, status: result.item.status },
            message: `Reset to pending for retry: "${result.item.title}"`,
          });
        }

        case "remove": {
          const { result: removed } = await updateQueueState((state) => {
            const idx = state.items.findIndex((i) => i.id === id);
            if (idx === -1) return null;
            return state.items.splice(idx, 1)[0];
          });

          if (!removed) {
            return jsonResult({ error: true, message: "Queue item not found" });
          }

          return jsonResult({
            success: true,
            action: "removed",
            item: { id: removed.id, title: removed.title },
            message: `Removed from queue: "${removed.title}"`,
          });
        }

        default:
          return jsonResult({ error: true, message: `Unknown action: "${action}". Use approve, reject, retry, or remove.` });
      }
    },
  } as AnyAgentTool;
}
