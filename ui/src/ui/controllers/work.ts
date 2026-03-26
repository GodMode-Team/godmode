/**
 * Work Controller
 * Loads projects and resources via gateway RPC
 */

import type { GatewayBrowserClient } from "../gateway";
import type { Project, Resource, ResourceFilter } from "../views/work";

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
  // Resources
  workResources?: Resource[];
  workResourcesLoading?: boolean;
  workResourceFilter?: ResourceFilter;
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

export async function loadResources(state: WorkState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  state.workResourcesLoading = true;

  try {
    const result = await state.client.request<{ resources: Resource[] }>("resources.list", { limit: 100 });
    state.workResources = result.resources ?? [];
  } catch (err) {
    console.warn("[Work] Failed to load resources:", err);
    state.workResources = [];
  } finally {
    state.workResourcesLoading = false;
  }
}

export async function pinResource(state: WorkState, id: string, pinned: boolean): Promise<void> {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("resources.pin", { id, pinned });
    // Optimistic update
    if (state.workResources) {
      state.workResources = state.workResources.map((r) =>
        r.id === id ? { ...r, pinned } : r,
      );
    }
  } catch (err) {
    console.warn("[Work] Failed to pin resource:", err);
  }
}

export async function deleteResource(state: WorkState, id: string): Promise<void> {
  if (!state.client || !state.connected) return;
  try {
    await state.client.request("resources.delete", { id });
    if (state.workResources) {
      state.workResources = state.workResources.filter((r) => r.id !== id);
    }
  } catch (err) {
    console.warn("[Work] Failed to delete resource:", err);
  }
}
