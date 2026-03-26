/**
 * Dashboards controller — state management + RPC calls for the Dashboards tab.
 */

import type { GatewayBrowserClient } from "../gateway.js";

// ── Types ────────────────────────────────────────────────────────────

export type DashboardManifest = {
  id: string;
  title: string;
  description?: string;
  scope: "global" | string;
  createdAt: string;
  updatedAt: string;
  createdBy: "agent" | "user";
  widgets?: string[];
  pinned?: boolean;
  sessionId?: string | null;
};

export type DashboardsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  dashboardsList?: DashboardManifest[];
  dashboardsLoading?: boolean;
  dashboardsError?: string | null;
  activeDashboardId?: string | null;
  activeDashboardHtml?: string | null;
  activeDashboardManifest?: DashboardManifest | null;
};

// ── Load dashboard list ──────────────────────────────────────────────

export async function loadDashboards(
  state: DashboardsState,
  scope?: string,
): Promise<void> {
  if (!state.client || !state.connected) {
    state.dashboardsError = "Not connected to gateway";
    return;
  }

  state.dashboardsLoading = true;
  state.dashboardsError = null;

  try {
    const result = await state.client.request<{
      dashboards: DashboardManifest[];
      activeDashboard: string | null;
      count: number;
    }>("dashboards.list", scope ? { scope } : {});

    state.dashboardsList = result.dashboards;
    state.activeDashboardId = result.activeDashboard;
  } catch (err) {
    state.dashboardsError =
      err instanceof Error ? err.message : "Failed to load dashboards";
  } finally {
    state.dashboardsLoading = false;
  }
}

// ── Load single dashboard ────────────────────────────────────────────

export async function loadDashboard(
  state: DashboardsState,
  id: string,
): Promise<void> {
  if (!state.client || !state.connected) {
    state.dashboardsError = "Not connected to gateway";
    return;
  }

  state.dashboardsLoading = true;
  state.dashboardsError = null;

  try {
    const result = await state.client.request<{
      manifest: DashboardManifest;
      html: string;
    }>("dashboards.get", { id });

    state.activeDashboardId = id;
    state.activeDashboardManifest = result.manifest;
    state.activeDashboardHtml = result.html;
  } catch (err) {
    state.dashboardsError =
      err instanceof Error ? err.message : "Failed to load dashboard";
  } finally {
    state.dashboardsLoading = false;
  }
}

// ── Toggle pin ──────────────────────────────────────────────────

export async function toggleDashboardPin(
  state: DashboardsState,
  id: string,
): Promise<void> {
  if (!state.client || !state.connected) return;

  const dash = (state.dashboardsList ?? []).find((d) => d.id === id);
  if (!dash) return;

  const newPinned = !dash.pinned;
  try {
    await state.client.request("dashboards.save", {
      id: dash.id,
      title: dash.title,
      description: dash.description,
      scope: dash.scope,
      pinned: newPinned,
    });
    dash.pinned = newPinned;
    // Trigger re-render by replacing the array reference
    state.dashboardsList = [...(state.dashboardsList ?? [])];
  } catch (err) {
    state.dashboardsError =
      err instanceof Error ? err.message : "Failed to toggle pin";
  }
}

// ── Delete dashboard ─────────────────────────────────────────────────

export async function deleteDashboard(
  state: DashboardsState,
  id: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;

  try {
    await state.client.request("dashboards.remove", { id });
    state.dashboardsList = (state.dashboardsList ?? []).filter(
      (d) => d.id !== id,
    );
    if (state.activeDashboardId === id) {
      state.activeDashboardId = null;
      state.activeDashboardHtml = null;
      state.activeDashboardManifest = null;
    }
    return true;
  } catch (err) {
    state.dashboardsError =
      err instanceof Error ? err.message : "Failed to delete dashboard";
    return false;
  }
}
