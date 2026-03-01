import { jsonResult, type AnyAgentTool } from "openclaw/plugin-sdk";
import {
  classifyComplexity,
  getPlansDir,
  validatePlanDoc,
  type CodingOrchestrator,
} from "../services/coding-orchestrator.js";
import { SwarmPipeline } from "../services/swarm-pipeline.js";

type ToolContext = {
  sessionKey?: string;
};

export function createCodingTaskTool(
  _ctx: ToolContext,
  opts: { orchestrator: CodingOrchestrator; workspaceDir?: string; logger?: { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void } },
): AnyAgentTool {
  return {
    label: "Coding",
    name: "coding_task",
    description: [
      "Launch an isolated coding task with its own git worktree and branch.",
      "Use when the user asks to build, fix, refactor, or ship code.",
      "Each task gets a separate worktree so multiple tasks cannot overwrite each other.",
      "IMPORTANT: After dispatching, you MUST follow up. Poll codingTask.status every 30-60 seconds",
      "until the task completes. Then review the PR, verify the output matches the ask, and report results",
      "to the user. NEVER merge branches into main yourself — let the orchestrator handle merges via GitHub PRs.",
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
        planDoc: {
          type: "string",
          description: "Path to an approved plan doc in ~/godmode/docs/plans/. Required for complex tasks (new features, multi-system work). The plan gate skill produces this.",
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

      // ── Plan gate enforcement ──────────────────────────────────
      const planDoc = typeof params.planDoc === "string" ? params.planDoc.trim() : "";
      const complexity = classifyComplexity(task);

      if (complexity.level === "complex" && !planDoc) {
        return jsonResult({
          status: "plan_required",
          complexity: complexity.level,
          reason: complexity.reason,
          message: [
            `This looks like a complex task (${complexity.reason}).`,
            "",
            "Before I can dispatch a builder, we need a plan.",
            "",
            "Run the plan gate skill (skills/plan-gate/SKILL.md):",
            "1. PM phase: problem, success criteria, scope, assumptions",
            "2. Architect phase: approach, files, interfaces, risks, tests",
            `3. Write plan doc to: ${getPlansDir()}/YYYY-MM-DD-slug.md`,
            "4. Present summary to the user and wait for approval",
            "5. Once approved, call coding_task again with planDoc set to the plan path",
          ].join("\n"),
        });
      }

      if (planDoc) {
        const planCheck = await validatePlanDoc(planDoc);
        if (!planCheck.valid) {
          return jsonResult({
            status: "plan_required",
            error: planCheck.error,
            message: `Plan doc issue: ${planCheck.error}. Fix the plan and try again.`,
          });
        }
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

      // Auto-spawn for started tasks — swarm or single-agent
      if (result.status === "started") {
        const useSwarm = complexity.level === "complex" && !!planDoc;

        if (useSwarm && opts.logger) {
          // Swarm pipeline: design → build → QC
          const pipeline = new SwarmPipeline(opts.orchestrator, opts.logger);
          const pipelineResult = await pipeline.startPipeline({
            taskId: result.taskId,
            task,
            worktreePath: result.worktreePath,
            branch: result.branch,
            scopeGlobs: result.scopeGlobs,
            model: typeof params.model === "string" ? params.model : undefined,
            planDoc,
          });

          if (!pipelineResult.started) {
            return jsonResult({
              ...result,
              status: "started",
              message: `Worktree created but swarm pipeline failed to start: ${pipelineResult.error}.`,
            });
          }

          return jsonResult({
            ...result,
            swarmMode: true,
            message: [
              "Swarm pipeline started (design → build → QC).",
              `Worktree: ${result.worktreePath}`,
              `Branch: ${result.branch}`,
              `Scope: ${result.scopeGlobs.join(", ")}`,
              "",
              "Stage 1: Design agent is analyzing the codebase and writing a design brief.",
              "The pipeline will auto-advance through build and QC stages.",
              "",
              "ACTION REQUIRED: You must follow up on this task:",
              "1. Poll `codingTask.status` every 30-60 seconds until the task is done or failed.",
              "2. When done, review the PR and verify the output matches what was asked.",
              "3. Report results to the user — what was built, PR link, any issues.",
              "4. Do NOT merge branches yourself. The orchestrator handles merges via GitHub PRs.",
            ].join("\n"),
          });
        }

        // Single-agent mode
        const spawnResult = await opts.orchestrator.spawnCodingAgent({
          taskId: result.taskId,
          task,
          worktreePath: result.worktreePath,
          branch: result.branch,
          scopeGlobs: result.scopeGlobs,
          model: typeof params.model === "string" ? params.model : undefined,
        });

        if (!spawnResult.spawned) {
          return jsonResult({
            ...result,
            status: "started",
            message: `Worktree created but agent spawn failed: ${spawnResult.error}. You can manually run a coding agent in ${result.worktreePath} on branch ${result.branch}.`,
          });
        }

        return jsonResult({
          ...result,
          message: [
            `Coding agent launched (pid ${spawnResult.pid ?? "unknown"}).`,
            `Worktree: ${result.worktreePath}`,
            `Branch: ${result.branch}`,
            `Scope: ${result.scopeGlobs.join(", ")}`,
            "",
            "Validation gates (lint, typecheck, test) and PR creation run on completion.",
            "",
            "ACTION REQUIRED: You must follow up on this task:",
            "1. Poll `codingTask.status` every 30-60 seconds until the task is done or failed.",
            "2. When done, review the PR and verify the output matches what was asked.",
            "3. Report results to the user — what was built, PR link, any issues.",
            "4. Do NOT merge branches yourself. The orchestrator handles merges via GitHub PRs.",
          ].join("\n"),
        });
      }

      return jsonResult(result);
    },
  };
}
