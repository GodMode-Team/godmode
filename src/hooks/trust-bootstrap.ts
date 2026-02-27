/**
 * trust-bootstrap.ts — Prompt hook that injects Trust Tracker context.
 *
 * When the user has tracked workflows with ratings, this hook injects a
 * compact summary into the system prompt so the agent knows what it has
 * learned about the user's preferences.
 */

import { readTrustState, computeTrustSummary } from "../methods/trust-tracker.js";
import type { WorkflowSummary } from "../methods/trust-tracker.js";

function trendEmoji(trend: WorkflowSummary["trend"]): string {
  switch (trend) {
    case "improving":
      return "↑";
    case "declining":
      return "↓";
    case "stable":
      return "→";
    case "new":
      return "★";
  }
}

/**
 * Loads trust tracker context for injection into the agent system prompt.
 * Returns null if there's nothing useful to inject (no workflows or no ratings).
 */
export async function loadTrustContext(): Promise<{ prependContext?: string } | void> {
  const state = await readTrustState();

  // Nothing to inject if no workflows configured
  if (state.workflows.length === 0) return;

  const summaries = computeTrustSummary(state, 30);

  // Nothing useful if no ratings at all
  const hasRatings = summaries.some((s) => s.count > 0);
  if (!hasRatings) return;

  const lines: string[] = [
    "## Trust Tracker — What You've Learned",
    "",
    "The user tracks these workflow categories. Use their feedback to improve future tasks.",
    "",
  ];

  for (const s of summaries) {
    if (s.count === 0) {
      lines.push(`- **${s.workflow}**: no ratings yet`);
      continue;
    }

    const parts = [
      `avg ${s.avgRating}/5`,
      `${s.count} rating${s.count === 1 ? "" : "s"}`,
      `${trendEmoji(s.trend)} ${s.trend}`,
    ];

    let line = `- **${s.workflow}**: ${parts.join(", ")}`;

    if (s.recentNotes.length > 0) {
      const noteStr = s.recentNotes.map((n) => `"${n}"`).join(", ");
      line += `. Recent: ${noteStr}`;
    }

    lines.push(line);
  }

  lines.push("");
  lines.push(
    "When completing tasks in these categories, apply lessons from past feedback. " +
      "After completing a tracked workflow, use the `trust_rate` tool to log a rating.",
  );

  return { prependContext: lines.join("\n") };
}
