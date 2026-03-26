/**
 * Trust Tracker controller -- RPC helpers for the Trust Tracker dashboard.
 *
 * Ratings are on a 1-10 scale. After 10 ratings a workflow gets a trust score.
 * Below 7 the agent proactively asks for improvement feedback.
 */
import type { GodModeApp } from "../app.js";

export type TrustRating = {
  id: string;
  workflow: string;
  rating: number; // 1-10
  note?: string;
  feedback?: string;
  sessionId?: string;
  timestamp: string;
};

export type WorkflowSummary = {
  workflow: string;
  avgRating: number;
  count: number;
  trustScore: number | null;
  needsFeedback: boolean;
  trend: "improving" | "declining" | "stable" | "new";
  recentNotes: string[];
  recentFeedback: string[];
};

export type DailyRating = {
  id: string;
  date: string; // YYYY-MM-DD
  rating: number; // 1-10
  note?: string;
  timestamp: string;
};

export type TrustTrackerData = {
  workflows: string[];
  summaries: WorkflowSummary[];
  ratings: TrustRating[];
  total: number;
  overallScore: number | null;
  totalRatings: number;
  totalUses: number;
  todayRating: DailyRating | null;
  dailyAverage: number | null;
  dailyStreak: number;
  recentDaily: DailyRating[];
};

export async function loadTrustTracker(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  host.trustTrackerLoading = true;
  try {
    const [dashboardResult, historyResult] = await Promise.all([
      host.client.request<{
        summaries: WorkflowSummary[];
        workflows: string[];
        overallScore: number | null;
        totalRatings: number;
        totalUses: number;
        todayRating: DailyRating | null;
        dailyAverage: number | null;
        dailyStreak: number;
        recentDaily: DailyRating[];
      }>("trust.dashboard", {}),
      host.client.request<{ ratings: TrustRating[]; total: number }>(
        "trust.history",
        { limit: 50 },
      ),
    ]);
    host.trustTrackerData = {
      workflows: dashboardResult.workflows,
      summaries: dashboardResult.summaries,
      ratings: historyResult.ratings,
      total: historyResult.total,
      overallScore: dashboardResult.overallScore,
      totalRatings: dashboardResult.totalRatings,
      totalUses: dashboardResult.totalUses,
      todayRating: dashboardResult.todayRating ?? null,
      dailyAverage: dashboardResult.dailyAverage ?? null,
      dailyStreak: dashboardResult.dailyStreak ?? 0,
      recentDaily: dashboardResult.recentDaily ?? [],
    };
  } catch {
    host.trustTrackerData = null;
  } finally {
    host.trustTrackerLoading = false;
  }
}

export async function setTrustWorkflows(
  host: GodModeApp,
  workflows: string[],
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("trust.workflows.set", { workflows });
    host.showToast("Workflows updated", "success", 2000);
    await loadTrustTracker(host);
  } catch (err) {
    host.showToast("Failed to update workflows", "error");
    console.error("[TrustTracker] setWorkflows error:", err);
  }
}

export async function addTrustWorkflow(
  host: GodModeApp,
  workflow: string,
): Promise<void> {
  const current = host.trustTrackerData?.workflows ?? [];
  if (current.length >= 5) {
    host.showToast("Maximum 5 workflows allowed", "error");
    return;
  }
  if (current.includes(workflow.trim())) {
    host.showToast("Workflow already tracked", "error");
    return;
  }
  await setTrustWorkflows(host, [...current, workflow.trim()]);
}

export async function removeTrustWorkflow(
  host: GodModeApp,
  workflow: string,
): Promise<void> {
  const current = host.trustTrackerData?.workflows ?? [];
  await setTrustWorkflows(
    host,
    current.filter((w) => w !== workflow),
  );
}

export async function rateTrustWorkflow(
  host: GodModeApp,
  workflow: string,
  rating: number,
  note?: string,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("trust.rate", {
      workflow,
      rating,
      ...(note ? { note } : {}),
    });
    host.showToast(`Rated ${workflow}: ${rating}/10`, "success", 2000);
    await loadTrustTracker(host);
  } catch (err) {
    host.showToast("Failed to submit rating", "error");
    console.error("[TrustTracker] rate error:", err);
  }
}

export async function submitDailyRating(
  host: GodModeApp,
  rating: number,
  note?: string,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("trust.dailyRate", {
      rating,
      ...(note ? { note } : {}),
    });
    host.showToast(`Rated ${rating}/10 today`, "success", 2000);
    await loadTrustTracker(host);
  } catch (err) {
    host.showToast("Failed to submit daily rating", "error");
    console.error("[TrustTracker] dailyRate error:", err);
  }
}
