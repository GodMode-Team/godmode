/**
 * morning-set.ts — Agent-callable tool: morning_set
 *
 * Finalizes the Morning Set conversation by updating the daily note's
 * Win The Day section and scoping today's tasks.
 *
 * Called by the agent after discussing priorities with the user.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import {
  rewriteWinTheDay,
  scopeTasksToWinTheDay,
  getTodayDate,
  type FocusItem,
} from "../methods/daily-brief.js";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

export function createMorningSetTool(_ctx: ToolContext): AnyAgentTool {
  return {
    name: "morning_set",
    label: "Morning Set",
    description:
      "Finalize the Morning Set by locking in today's priorities. " +
      "This updates the Win The Day section in the daily note and scopes today's tasks " +
      "to only the selected priorities (other tasks get un-dated). " +
      "IMPORTANT: Do NOT call this tool until the user has explicitly approved the proposed plan. " +
      "First, present a plan: which tasks you'll handle as agents, which the user should do, " +
      "and in what order. Ask clarifying questions (e.g. 'which Zach?', 'draft or send?'). " +
      "Only call this tool after the user says to go ahead. " +
      "Provide the final ordered list of 3-5 priority items.",
    parameters: {
      type: "object" as const,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Short priority title (e.g. 'Ship onboarding flow')",
              },
              context: {
                type: "string",
                description: "Optional one-line context (e.g. 'Deadline Friday, blocks beta launch')",
              },
            },
            required: ["title"],
          },
          description:
            "Ordered list of Win The Day priorities. First item is #1. Recommend 3-5 items.",
        },
      },
      required: ["items"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      try {
        const rawItems = params.items as Array<{ title: string; context?: string }>;

        if (!rawItems || rawItems.length === 0) {
          return jsonResult({ error: true, message: "Provide at least one priority item." });
        }
        if (rawItems.length > 7) {
          return jsonResult({ error: true, message: "Too many items. Keep it to 7 or fewer." });
        }

        const today = getTodayDate();

        const items: FocusItem[] = rawItems.map((item, idx) => ({
          index: idx + 1,
          title: item.title.trim(),
          context: (item.context ?? "").trim(),
          completed: false,
        }));

        // 1. Rewrite Win The Day section in daily note
        const rewriteResult = await rewriteWinTheDay(today, items);

        // 2. Sync tasks from the freshly written brief
        let syncResult = { added: 0, updated: 0, total: 0 };
        try {
          const { syncTasksFromBrief } = await import("../methods/daily-brief.js");
          syncResult = await syncTasksFromBrief(today, { force: true });
        } catch {
          // Task sync is best-effort
        }

        // 3. Scope today's tasks to only WTD items
        let scopeResult = { deferred: 0 };
        try {
          scopeResult = await scopeTasksToWinTheDay(today, items);
        } catch {
          // Scoping is best-effort
        }

        // 4. Pre-create session keys for all today's tasks so links work immediately
        let taskSessions: Array<{ id: string; title: string; sessionId: string }> = [];
        try {
          const { ensureTaskSessions } = await import("../methods/tasks.js");
          taskSessions = await ensureTaskSessions(today);
        } catch {
          // Non-fatal
        }

        return jsonResult({
          finalized: true,
          focusTitle: items[0].title,
          itemCount: items.length,
          noteRewritten: rewriteResult.rewritten,
          tasksSynced: syncResult,
          tasksDeferred: scopeResult.deferred,
          taskSessions,
          message:
            `Morning set locked in. Top priority: "${items[0].title}" ` +
            `(${items.length} priorities).` +
            (scopeResult.deferred > 0
              ? ` ${scopeResult.deferred} non-priority task(s) un-dated.`
              : "") +
            (rewriteResult.rewritten
              ? " Daily note updated."
              : rewriteResult.error
                ? ` Note: ${rewriteResult.error}.`
                : "") +
            (taskSessions.length > 0
              ? ` Present the user with clickable links for each task session. ` +
                `Format each as: [Task Title](openclaw://session/{sessionId}) so they can jump directly into any task.`
              : ""),
        });
      } catch (err) {
        return jsonResult({
          error: true,
          message: `Morning set failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    },
  };
}
