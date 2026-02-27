import { jsonResult, type AnyAgentTool } from "openclaw/plugin-sdk";
import type { CodingOrchestrator } from "../services/coding-orchestrator.js";

type ToolContext = {
  sessionKey?: string;
};

export function createCodingTaskTool(
  _ctx: ToolContext,
  opts: { orchestrator: CodingOrchestrator; workspaceDir?: string },
): AnyAgentTool {
  return {
    label: "Coding",
    name: "coding_task",
    description: [
      "Launch an isolated coding task with its own git worktree and branch.",
      "Use when the user asks to build, fix, refactor, or ship code.",
      "Each task gets a separate worktree so multiple tasks cannot overwrite each other.",
      "After launching, follow the spawnInstructions to start the coding agent.",
    ].join(" "),
    parameters: {
      type: "object" as const,
      properties: {
        task: { type: "string", description: "What to build, fix, or change." },
        repoRoot: { type: "string", description: "Repository root path. Defaults to workspace root." },
        model: { type: "string", description: "Optional model override for the coding agent." },
        thinking: { type: "string", description: "Optional thinking level (low, medium, high)." },
        scopeGlobs: {
          type: "array",
          items: { type: "string" },
          description: "Optional file scope globs. Auto-inferred from task if omitted.",
        },
      },
      required: ["task"],
    },
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const task = typeof params.task === "string" ? params.task.trim() : "";
      if (!task) {
        return jsonResult({ error: "task is required" });
      }

      if (!opts.orchestrator.isEnabled()) {
        return jsonResult({ error: "coding orchestration is disabled in plugin config" });
      }

      const repoRoot =
        typeof params.repoRoot === "string" && params.repoRoot.trim()
          ? params.repoRoot.trim()
          : opts.workspaceDir ?? process.cwd();

      const result = await opts.orchestrator.launchTask({
        task,
        repoRoot,
        model: typeof params.model === "string" ? params.model : undefined,
        thinking: typeof params.thinking === "string" ? params.thinking : undefined,
        scopeGlobs: Array.isArray(params.scopeGlobs)
          ? (params.scopeGlobs as string[]).filter((g) => typeof g === "string")
          : undefined,
      });

      // If GitHub isn't set up, return the friendly walkthrough instead of an error
      if (result.status === "setup_required") {
        return jsonResult({
          status: "setup_required",
          message: "I'd love to build that for you, but we need to connect GitHub first.",
          instructions: result.setupInstructions,
        });
      }

      return jsonResult(result);
    },
  };
}
