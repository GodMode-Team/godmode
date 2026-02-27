/**
 * Work Controller
 * Loads projects via gateway RPC
 */

import type { GatewayBrowserClient } from "../gateway";
import type { Project } from "../views/work";

export type WorkState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  workProjects?: Project[];
  workLoading?: boolean;
  workError?: string | null;
  workExpandedProjects?: Set<string>;
  workProjectFiles?: Record<string, unknown[]>;
  workProjectPeople?: Record<string, unknown[]>;
  workDetailLoading?: Set<string>;
};

export async function loadWork(state: WorkState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  state.workLoading = true;
  state.workError = null;

  try {
    const result = await state.client.request<{ projects: Project[] }>("projects.list", {});
    state.workProjects = result.projects ?? [];
  } catch (err) {
    console.error("[Work] Failed to load:", err);
    state.workError = err instanceof Error ? err.message : "Failed to load";
  } finally {
    state.workLoading = false;
  }
}

export async function loadProjectDetails(state: WorkState, projectId: string): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }

  const loading = new Set(state.workDetailLoading ?? []);
  loading.add(projectId);
  state.workDetailLoading = loading;

  try {
    const projectResult = await state.client.request<Record<string, unknown>>("projects.get", {
      id: projectId,
      includeFiles: true,
      depth: 2,
    });

    if (projectResult) {
      const files = (projectResult as { files?: unknown[] }).files ?? [];
      state.workProjectFiles = { ...state.workProjectFiles, [projectId]: files };
    }
  } catch (err) {
    console.warn("[Work] Failed to load project details:", err);
  } finally {
    const done = new Set(state.workDetailLoading ?? []);
    done.delete(projectId);
    state.workDetailLoading = done;
  }
}
