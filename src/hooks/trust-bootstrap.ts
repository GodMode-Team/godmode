/**
 * trust-bootstrap.ts — Prompt hook that injects Trust Tracker context.
 *
 * Injects trust scores, improvement feedback, and conversational workflow
 * management guidance into the system prompt. When a workflow's trust score
 * is below 7, the agent is instructed to ask for feedback and route it
 * back via trust.feedback.
 */

import {
  readTrustState, computeTrustSummary,
  MAX_WORKFLOWS, SCORE_THRESHOLD, FEEDBACK_THRESHOLD,
} from "../methods/trust-tracker.js";
import type { WorkflowSummary } from "../methods/trust-tracker.js";

function trendEmoji(trend: WorkflowSummary["trend"]): string {
  switch (trend) {
    case "improving":
      return "\u2191";
    case "declining":
      return "\u2193";
    case "stable":
      return "\u2192";
    case "new":
      return "\u2605";
  }
}

/**
 * Loads trust tracker context for injection into the agent system prompt.
 * Always injects guidance so the agent can handle "track my X" requests.
 * When trust scores exist, injects per-workflow summaries and feedback.
 */
export async function loadTrustContext(): Promise<{ prependContext?: string } | void> {
  const state = await readTrustState();

  const lines: string[] = [];

  // --- Conversational workflow management guidance (always injected) ---
  lines.push("## Trust Tracker");
  lines.push("");
  lines.push("You can manage the user's tracked workflows conversationally:");
  lines.push('- When the user says "track my X", "add X to trust tracker", or similar, call `trust.workflows.add` with the workflow name.');
  lines.push('- When the user says "stop tracking X" or "remove X from trust tracker", call `trust.workflows.remove`.');
  lines.push(`- After completing a task that matches a tracked workflow, use the \`trust_rate\` tool to log a 1-10 rating.`);
  lines.push(`- After ${SCORE_THRESHOLD} ratings, the running average becomes the trust score.`);
  lines.push(`- If a trust score is below ${FEEDBACK_THRESHOLD}/10, ask the user "What would make this better?" and store their answer via \`trust.feedback\`.`);
  lines.push(`- The user can track up to ${MAX_WORKFLOWS} workflows. Currently tracking: ${state.workflows.length === 0 ? "none yet" : state.workflows.join(", ")}.`);
  lines.push("");

  // --- Per-workflow summary (only when there are ratings) ---
  if (state.workflows.length > 0) {
    const summaries = computeTrustSummary(state, 30);
    const hasRatings = summaries.some((s) => s.count > 0);

    if (hasRatings) {
      lines.push("### Trust Scores & Learnings");
      lines.push("");

      for (const s of summaries) {
        if (s.count === 0) {
          lines.push(`- **${s.workflow}**: no ratings yet`);
          continue;
        }

        const parts: string[] = [];
        if (s.trustScore !== null) {
          parts.push(`trust score: ${s.trustScore}/10`);
        } else {
          parts.push(`avg ${s.avgRating}/10 (${s.count}/${SCORE_THRESHOLD} until scored)`);
        }
        parts.push(`${s.count} rating${s.count === 1 ? "" : "s"}`);
        parts.push(`${trendEmoji(s.trend)} ${s.trend}`);

        let line = `- **${s.workflow}**: ${parts.join(", ")}`;

        if (s.recentNotes.length > 0) {
          line += `. Notes: ${s.recentNotes.map((n) => `"${n}"`).join(", ")}`;
        }

        lines.push(line);

        // Inject stored feedback so the agent applies it
        if (s.recentFeedback.length > 0) {
          lines.push(`  - **Improvement feedback (apply this!):** ${s.recentFeedback.map((f) => `"${f}"`).join("; ")}`);
        }

        if (s.needsFeedback) {
          lines.push(`  - **ACTION: Score is below ${FEEDBACK_THRESHOLD}.** After the next ${s.workflow} task, ask: "What would make this better?" and call trust.feedback.`);
        }
      }

      lines.push("");
      lines.push(
        "Apply stored feedback when completing tasks in these categories. " +
        "Rate with `trust_rate` after each tracked task.",
      );
    }
  }

  return { prependContext: lines.join("\n") };
}
