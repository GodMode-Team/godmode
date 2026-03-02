/**
 * morning-set.ts — Agent-callable tool: morning_set
 *
 * Finalizes the Morning Set conversation by updating the daily note's
 * Win The Day section, scoping today's tasks, and locking in focus.
 *
 * Called by the agent after discussing priorities with the user.
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import {
  rewriteWinTheDay,
  scopeTasksToWinTheDay,
  readState,
  writeState,
  getTodayDate,
} from "../methods/focus-pulse.js";
import {
  calculateDailyScore,
  type FocusItem,
} from "../methods/focus-pulse-scorer.js";

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
      "This updates the Win The Day section in the daily note, scopes today's tasks " +
      "to only the selected priorities (other tasks get un-dated), and sets the #1 focus " +
      "so the Focus Pulse widget appears in the topbar. " +
      "Call this after discussing and refining the user's daily priorities. " +
      "Provide the final ordered list of 3-5 priority items. The first item (or focusIndex) " +
      "becomes the locked-in focus.",
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
        focusIndex: {
          type: "number",
          description:
            "1-based index of the item to lock in as current focus. Defaults to 1 (top priority).",
        },
      },
      required: ["items"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      try {
        const rawItems = params.items as Array<{ title: string; context?: string }>;
        const focusIdx = (params.focusIndex as number | undefined) ?? 1;

        // Validate
        if (!rawItems || rawItems.length === 0) {
          return jsonResult({ error: true, message: "Provide at least one priority item." });
        }
        if (rawItems.length > 7) {
          return jsonResult({ error: true, message: "Too many items. Keep it to 7 or fewer." });
        }

        const today = getTodayDate();

        // Build FocusItem[] from input
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

        // 4. Update focus pulse state
        const focusItem = items.find((i) => i.index === focusIdx) ?? items[0];
        const state = await readState();
        state.date = today;
        state.active = true;
        state.morningSetDone = true;
        state.items = items;
        state.currentFocus = focusItem;
        state.score = calculateDailyScore(
          state.pulseChecks,
          0,
          items.length,
          true,
          state.streak,
        );
        await writeState(state);

        // 5. Start heartbeat timer
        try {
          const { startHeartbeat } = await import("../services/focus-pulse-heartbeat.js");
          startHeartbeat();
        } catch {
          // Heartbeat is best-effort
        }

        return jsonResult({
          finalized: true,
          focusTitle: focusItem.title,
          itemCount: items.length,
          noteRewritten: rewriteResult.rewritten,
          tasksSynced: syncResult,
          tasksDeferred: scopeResult.deferred,
          message:
            `Morning set locked in. Focus: "${focusItem.title}" ` +
            `(${items.length} priorities).` +
            (scopeResult.deferred > 0
              ? ` ${scopeResult.deferred} non-priority task(s) un-dated.`
              : "") +
            (rewriteResult.rewritten
              ? " Daily note updated."
              : rewriteResult.error
                ? ` Note: ${rewriteResult.error}.`
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
