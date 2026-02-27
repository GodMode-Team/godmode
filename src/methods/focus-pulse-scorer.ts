/**
 * focus-pulse-scorer.ts — Pure scoring functions for Focus Pulse.
 * No I/O; all inputs passed as arguments.
 */

import type { CompletedItem, ActivityEntry } from "../lib/agent-log.js";

export type FocusItem = {
  index: number;
  title: string;
  context: string;
  completed: boolean;
};

export type PulseCheckResult = {
  time: string;
  score: number;
  topActivity: string;
  aligned: boolean;
  reason: string;
};

type RescueTimeRow = [string, number, number, string, string, number];

/**
 * Score a single pulse check by comparing recent activity against the current focus.
 *
 * Heuristic: look for keyword overlap between the focus title/context and
 * agent-log completed items + RescueTime top activities.
 */
export function scorePulseCheck(
  focus: FocusItem,
  completedItems: CompletedItem[],
  activityEntries: ActivityEntry[],
  rescueTimeRows: RescueTimeRow[],
): PulseCheckResult {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Build focus keywords from title + context
  const focusWords = extractKeywords(`${focus.title} ${focus.context}`);

  // Find top RescueTime activity by time spent
  const topRT = findTopActivity(rescueTimeRows);

  // Score agent log alignment (recent 30min of completions + activity)
  const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
  const recentCompleted = completedItems.filter((c) => c.completedAt > thirtyMinAgo);
  const recentActivity = activityEntries.filter((a) => a.time > thirtyMinAgo);

  let agentScore = 0;
  let agentReason = "";

  if (recentCompleted.length > 0 || recentActivity.length > 0) {
    const agentText = [
      ...recentCompleted.map((c) => `${c.item} ${c.output ?? ""}`),
      ...recentActivity.map((a) => a.text),
    ].join(" ");
    const agentWords = extractKeywords(agentText);
    const overlap = countOverlap(focusWords, agentWords);
    agentScore = Math.min(overlap * 25, 100); // 25 points per keyword match, cap 100
    agentReason = recentCompleted.length > 0
      ? `${recentCompleted.length} task(s) completed recently`
      : `${recentActivity.length} activity entries`;
  }

  // Score RescueTime alignment
  let rtScore = 50; // neutral if no data
  let rtReason = "No RescueTime data";

  if (topRT) {
    const rtWords = extractKeywords(`${topRT.activity} ${topRT.category}`);
    const rtOverlap = countOverlap(focusWords, rtWords);
    // Productivity score from RescueTime: -2 to 2
    // 2 = very productive, 1 = productive, 0 = neutral, -1 = distracting, -2 = very distracting
    const productivityBonus = topRT.productivity >= 1 ? 20 : topRT.productivity <= -1 ? -20 : 0;
    rtScore = Math.min(rtOverlap * 20 + 40 + productivityBonus, 100);
    rtReason = `Top: ${topRT.activity} (${Math.round(topRT.seconds / 60)}min)`;
  }

  // Weighted average: 60% agent log, 40% RescueTime
  const score = Math.round(agentScore * 0.6 + rtScore * 0.4);
  const aligned = score >= 50;
  const reason = agentReason
    ? `${agentReason}. ${rtReason}`
    : rtReason;

  return { time, score, topActivity: topRT?.activity ?? "Unknown", aligned, reason };
}

/**
 * Calculate the overall daily score.
 * Weights: 40% alignment (avg pulse checks), 40% completion, 20% consistency.
 */
export function calculateDailyScore(
  pulseChecks: PulseCheckResult[],
  completedCount: number,
  totalItems: number,
  morningSetDone: boolean,
  currentStreak: number,
): number {
  // Alignment: average of pulse check scores
  const alignmentScore = pulseChecks.length > 0
    ? pulseChecks.reduce((sum, p) => sum + p.score, 0) / pulseChecks.length
    : 50;

  // Completion: items done / total
  const completionScore = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  // Consistency: morning set done + streak bonus
  const morningSetBonus = morningSetDone ? 50 : 0;
  const streakBonus = Math.min(currentStreak * 10, 50); // up to 50 for 5-day streak
  const consistencyScore = morningSetBonus + streakBonus;

  return Math.round(alignmentScore * 0.4 + completionScore * 0.4 + consistencyScore * 0.2);
}

// --- Helpers ---

function extractKeywords(text: string): Set<string> {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "it", "this", "that", "was", "are",
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w)),
  );
}

function countOverlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const word of a) {
    if (b.has(word)) count++;
  }
  return count;
}

function findTopActivity(
  rows: RescueTimeRow[],
): { activity: string; category: string; seconds: number; productivity: number } | null {
  if (rows.length === 0) return null;
  let top = rows[0];
  for (const row of rows) {
    if (row[1] > top[1]) top = row;
  }
  return { activity: top[3], category: top[4], seconds: top[1], productivity: top[5] };
}
