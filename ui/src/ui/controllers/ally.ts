import { titleForTab } from "../navigation.js";
import type { Tab } from "../navigation.js";

/**
 * The fixed session key used for the ally side-chat.
 * All ally conversations share this single session.
 */
export const ALLY_SESSION_KEY = "ally-main";

// ── P2: Tab Context Awareness ──────────────────────────────────────

/**
 * Build a short context string that tells the ally what the user is
 * currently looking at in the GodMode UI. Injected as a system-level
 * context prefix so the ally can give situationally-relevant answers.
 */
export function buildAllyContext(state: {
  tab: string;
  activeDashboard?: { title: string } | null;
  selectedWorkspace?: { name: string } | null;
  sidebarOpen?: boolean;
  sidebarFilePath?: string | null;
}): string {
  const parts: string[] = [`viewing ${titleForTab(state.tab as Tab)} tab`];

  if (state.tab === "dashboards" && state.activeDashboard) {
    parts.push(`dashboard: ${state.activeDashboard.title}`);
  }

  if (state.tab === "workspaces" && state.selectedWorkspace) {
    parts.push(`workspace: ${state.selectedWorkspace.name}`);
  }

  if (state.sidebarOpen && state.sidebarFilePath) {
    parts.push(`viewing file: ${state.sidebarFilePath}`);
  }

  return `[GodMode Context: ${parts.join(", ")}]`;
}
