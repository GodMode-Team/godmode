import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { addCustomGuardrail } from "../services/guardrails.js";

/**
 * Creates the `create_guardrail` agent tool.
 * Lets the agent create a custom guardrail rule on the fly when the user
 * says things like "stop doing X", "never use Y for Z", "block npm audit", etc.
 */
export function createGuardrailTool(_ctx: {
  sessionKey?: string;
  agentId?: string;
}): AnyAgentTool {
  return {
    name: "create_guardrail",
    label: "Create Guardrail",
    description:
      "Create a custom guardrail rule that blocks or redirects a specific tool call pattern. " +
      "Use this when the user says things like 'stop doing X', 'never use Y for Z', " +
      "'block npm audit', 'don't use web_fetch for twitter', etc. " +
      "The guardrail will persist and automatically enforce the rule on all future tool calls.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Short human-readable name for the rule (e.g. 'Block npm audit')",
        },
        tool: {
          type: "string",
          description: "The tool name to match against (e.g. 'Bash', 'web_fetch', 'coding_task')",
        },
        patterns: {
          type: "array",
          items: { type: "string" },
          description: "Substrings to match in the tool call params (e.g. ['npm audit', 'npx audit'])",
        },
        action: {
          type: "string",
          enum: ["block", "redirect"],
          description: "Whether to block the call entirely or redirect with instructions. Default: block.",
        },
        message: {
          type: "string",
          description: "The message shown when the guardrail fires. For redirects, include what to do instead.",
        },
        redirectTo: {
          type: "string",
          description: "For redirect action: the alternative tool or approach name (e.g. 'x_search')",
        },
      },
      required: ["name", "tool", "patterns", "message"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const name = typeof params.name === "string" ? params.name.trim() : "";
      const tool = typeof params.tool === "string" ? params.tool.trim() : "";
      const patterns = Array.isArray(params.patterns)
        ? (params.patterns as string[]).filter((p) => typeof p === "string" && p.trim()).map((p) => p.trim())
        : [];
      const action = params.action === "redirect" ? "redirect" : "block";
      const message = typeof params.message === "string" ? params.message.trim() : "";
      const redirectTo = typeof params.redirectTo === "string" ? params.redirectTo.trim() : undefined;

      if (!name) return jsonResult({ error: "name is required" });
      if (!tool) return jsonResult({ error: "tool is required" });
      if (patterns.length === 0) return jsonResult({ error: "at least one pattern is required" });
      if (!message) return jsonResult({ error: "message is required" });
      if (action === "redirect" && !redirectTo) {
        return jsonResult({ error: "redirectTo is required for redirect action" });
      }

      try {
        const guardrail = await addCustomGuardrail({
          name,
          description: "",
          enabled: true,
          trigger: { tool, patterns },
          action,
          message,
          ...(redirectTo ? { redirectTo } : {}),
        });

        return jsonResult({
          created: true,
          guardrail: {
            id: guardrail.id,
            name: guardrail.name,
            tool: guardrail.trigger.tool,
            patterns: guardrail.trigger.patterns,
            action: guardrail.action,
            message: guardrail.message,
          },
          message: `Guardrail "${name}" created. It will now ${action === "redirect" ? "redirect" : "block"} ${tool} calls matching [${patterns.join(", ")}].`,
        });
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code ?? "INTERNAL_ERROR";
        const errMsg = err instanceof Error ? err.message : String(err);
        return jsonResult({ error: errMsg, code });
      }
    },
  } as AnyAgentTool;
}
