import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import type { CodingOrchestrator } from "../services/coding-orchestrator.js";

export function createCodingTaskHandlers(
  orchestrator: CodingOrchestrator,
): Record<string, GatewayRequestHandler> {
  return {
    "coding.launch": async (_params, respond) => {
      const params = _params as Record<string, unknown>;
      const task = typeof params.task === "string" ? params.task.trim() : "";
      if (!task) {
        respond({ error: "task is required" });
        return;
      }

      const repoRoot =
        typeof params.repoRoot === "string" && params.repoRoot.trim()
          ? params.repoRoot.trim()
          : undefined;

      if (!repoRoot) {
        respond({ error: "repoRoot is required" });
        return;
      }

      const result = await orchestrator.launchTask({
        task,
        repoRoot,
        model: typeof params.model === "string" ? params.model : undefined,
        thinking: typeof params.thinking === "string" ? params.thinking : undefined,
        scopeGlobs: Array.isArray(params.scopeGlobs)
          ? (params.scopeGlobs as string[]).filter((g) => typeof g === "string")
          : undefined,
      });

      respond(result);
    },

    "coding.list": async (_params, respond) => {
      const params = _params as Record<string, unknown>;
      const status = typeof params.status === "string" ? params.status.trim() : undefined;
      const validStatuses = ["queued", "running", "validating", "done", "failed"];
      const tasks = await orchestrator.listTasks(
        status && validStatuses.includes(status) ? (status as "queued") : undefined,
      );
      respond({ tasks });
    },

    "coding.status": async (_params, respond) => {
      const summary = await orchestrator.statusSummary();
      respond(summary);
    },

    "coding.cancel": async (_params, respond) => {
      const params = _params as Record<string, unknown>;
      const taskId = typeof params.taskId === "string" ? params.taskId.trim() : "";
      if (!taskId) {
        respond({ error: "taskId is required" });
        return;
      }
      const cancelled = await orchestrator.cancelTask(taskId);
      respond({ cancelled, taskId });
    },
  };
}
