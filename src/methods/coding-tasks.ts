import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import type { CodingOrchestrator } from "../services/coding-orchestrator.js";

export function createCodingTaskHandlers(
  orchestrator: CodingOrchestrator,
): Record<string, GatewayRequestHandler> {
  return {
    "coding.launch": async ({ params, respond }) => {
      const p = params as Record<string, unknown>;
      const task = typeof p.task === "string" ? p.task.trim() : "";
      if (!task) {
        respond(false, undefined, { code: "INVALID_REQUEST", message: "task is required" });
        return;
      }

      const repoRoot =
        typeof p.repoRoot === "string" && p.repoRoot.trim()
          ? p.repoRoot.trim()
          : undefined;

      if (!repoRoot) {
        respond(false, undefined, { code: "INVALID_REQUEST", message: "repoRoot is required" });
        return;
      }

      const result = await orchestrator.launchTask({
        task,
        repoRoot,
        model: typeof p.model === "string" ? p.model : undefined,
        thinking: typeof p.thinking === "string" ? p.thinking : undefined,
        scopeGlobs: Array.isArray(p.scopeGlobs)
          ? (p.scopeGlobs as string[]).filter((g) => typeof g === "string")
          : undefined,
      });

      respond(true, result);
    },

    "coding.list": async ({ params, respond }) => {
      const p = params as Record<string, unknown>;
      const status = typeof p.status === "string" ? p.status.trim() : undefined;
      const validStatuses = ["queued", "running", "validating", "done", "failed"];
      const tasks = await orchestrator.listTasks(
        status && validStatuses.includes(status) ? (status as "queued") : undefined,
      );
      respond(true, { tasks });
    },

    "coding.status": async ({ respond }) => {
      const summary = await orchestrator.statusSummary();
      respond(true, summary);
    },

    "coding.cancel": async ({ params, respond }) => {
      const p = params as Record<string, unknown>;
      const taskId = typeof p.taskId === "string" ? p.taskId.trim() : "";
      if (!taskId) {
        respond(false, undefined, { code: "INVALID_REQUEST", message: "taskId is required" });
        return;
      }
      const cancelled = await orchestrator.cancelTask(taskId);
      respond(true, { cancelled, taskId });
    },
  };
}
