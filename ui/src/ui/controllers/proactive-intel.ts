import type { GatewayBrowserClient } from "../gateway";

export type IntelInsight = {
  id: string;
  category: string;
  title: string;
  body: string;
  priority: "low" | "medium" | "high" | "urgent";
  action?: {
    type: string;
    label: string;
    payload: Record<string, unknown>;
  };
  createdAt: number;
  dismissed: boolean;
  actedOn: boolean;
};

export type ScoutFinding = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url?: string;
  discoveredAt: number;
  acknowledged: boolean;
};

export type UserPatterns = {
  updatedAt: number;
  taskPatterns: {
    completionRate7d: number;
    avgTasksPerDay: number;
    stuckTasks: Array<{ title: string; daysPending: number }>;
    commonProjects: string[];
  };
  codingPatterns: {
    avgSessionDuration: number;
    topRepos: string[];
    avgToolUsesPerSession: number;
    totalSessionsLast7d: number;
  };
  activityPatterns: {
    activeDaysLast7d: number;
    totalEntriesLast7d: number;
    frequentSkills: Array<{ skill: string; count: number }>;
    errorCount7d: number;
  };
  goalStatus: {
    totalGoals: number;
    stalledGoals: Array<{ title: string; daysSinceProgress: number }>;
  };
  challenges: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
};

export type IntelStatus = {
  running: boolean;
  lastScoutRun: number;
  lastObserverRun: number;
  lastAdvisorRun: number;
  totalFindings: number;
  totalInsights: number;
  totalChallenges: number;
};

export type ProactiveIntelState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  insights: IntelInsight[];
  discoveries: ScoutFinding[];
  patterns: UserPatterns | null;
  status: IntelStatus | null;
  loading: boolean;
  error: string | null;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function loadInsights(state: ProactiveIntelState) {
  if (!state.client || !state.connected) return;
  state.loading = true;
  state.error = null;
  try {
    const res = await state.client.request("proactiveIntel.getInsights", { limit: 20 });
    if (res?.insights) {
      state.insights = res.insights;
    }
  } catch (err) {
    state.error = getErrorMessage(err);
  } finally {
    state.loading = false;
  }
}

export async function loadDiscoveries(state: ProactiveIntelState) {
  if (!state.client || !state.connected) return;
  try {
    const res = await state.client.request("proactiveIntel.getDiscoveries", { limit: 30 });
    if (res?.findings) {
      state.discoveries = res.findings;
    }
  } catch (err) {
    state.error = getErrorMessage(err);
  }
}

export async function loadUserPatterns(state: ProactiveIntelState) {
  if (!state.client || !state.connected) return;
  try {
    const res = await state.client.request("proactiveIntel.getUserPatterns", {});
    if (res?.patterns) {
      state.patterns = res.patterns;
    }
  } catch (err) {
    state.error = getErrorMessage(err);
  }
}

export async function loadStatus(state: ProactiveIntelState) {
  if (!state.client || !state.connected) return;
  try {
    const res = await state.client.request("proactiveIntel.getStatus", {});
    if (res) {
      state.status = res as IntelStatus;
    }
  } catch (err) {
    state.error = getErrorMessage(err);
  }
}

export async function dismissInsight(state: ProactiveIntelState, id: string) {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("proactiveIntel.dismissInsight", { id });
    state.insights = state.insights.filter((i) => i.id !== id);
  } catch (err) {
    state.error = getErrorMessage(err);
  }
}

export async function actOnInsight(state: ProactiveIntelState, id: string) {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("proactiveIntel.actOnInsight", { id });
    const insight = state.insights.find((i) => i.id === id);
    if (insight) insight.actedOn = true;
  } catch (err) {
    state.error = getErrorMessage(err);
  }
}

export async function forceRefresh(state: ProactiveIntelState) {
  if (!state.client || !state.connected) return;
  state.loading = true;
  state.error = null;
  try {
    await state.client.request("proactiveIntel.forceRefresh", {});
    // Reload everything after refresh
    await loadInsights(state);
    await loadDiscoveries(state);
    await loadUserPatterns(state);
    await loadStatus(state);
  } catch (err) {
    state.error = getErrorMessage(err);
  } finally {
    state.loading = false;
  }
}
