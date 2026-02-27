/**
 * Trust Tracker controller — RPC helpers for the Trust Tracker feature.
 */
import type { GodModeApp } from "../app.js";

export type TrustRating = {
  id: string;
  workflow: string;
  rating: 1 | 2 | 3 | 4 | 5;
  note?: string;
  sessionId?: string;
  timestamp: string;
};

export type WorkflowSummary = {
  workflow: string;
  avgRating: number;
  count: number;
  trend: "improving" | "declining" | "stable" | "new";
  recentNotes: string[];
};

export type TrustTrackerData = {
  workflows: string[];
  summaries: WorkflowSummary[];
  ratings: TrustRating[];
  total: number;
};

export async function loadTrustTracker(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  host.trustTrackerLoading = true;
  try {
    const [summaryResult, historyResult] = await Promise.all([
      host.client.request<{ summaries: WorkflowSummary[]; workflows: string[] }>(
        "trust.summary",
        {},
      ),
      host.client.request<{ ratings: TrustRating[]; total: number }>(
        "trust.history",
        { limit: 50 },
      ),
    ]);
    host.trustTrackerData = {
      workflows: summaryResult.workflows,
      summaries: summaryResult.summaries,
      ratings: historyResult.ratings,
      total: historyResult.total,
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
    host.showToast(`Rated ${workflow}: ${rating}/5`, "success", 2000);
    await loadTrustTracker(host);
  } catch (err) {
    host.showToast("Failed to submit rating", "error");
    console.error("[TrustTracker] rate error:", err);
  }
}
