import { titleForTab } from "../navigation.js";
import type { Tab } from "../navigation.js";

/**
 * The ally side-chat uses the real main session — same conversation
 * thread as iMessage, the Chat tab, and all other entry points.
 *
 * This is the living nerve center: direct chat with Prosper, notifications,
 * agent results, morning brief flags, schedule alerts. System plumbing
 * (heartbeat prompts, consciousness dumps) is filtered at the UI layer
 * via isAutomatedMessage() in app.ts.
 */
export const ALLY_SESSION_KEY = "main";

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
