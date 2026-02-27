/**
 * My Day Controller
 * Loads the daily brief for the Today tab
 */

import type { GatewayBrowserClient } from "../gateway";
import type { AgentLogData, DailyBriefData } from "../views/my-day";

export type MyDayState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  myDayLoading?: boolean;
  myDayError?: string | null;
  // Daily Brief state
  dailyBrief?: DailyBriefData | null;
  dailyBriefLoading?: boolean;
  dailyBriefError?: string | null;
  // Agent Log state
  agentLog?: AgentLogData | null;
  agentLogLoading?: boolean;
  agentLogError?: string | null;
  briefNotes?: Record<string, string>;
  // Date navigation
  todaySelectedDate?: string;
  // View mode
  todayViewMode?: "my-day" | "agent-log";
  // Methods
  loadBriefNotes?: () => Promise<void>;
};

const AGENT_LOG_PATH_CANDIDATES = ["~/godmode/memory/AGENT-DAY.md", "~/godmode/AGENT-DAY.md"];

function isTodayDate(date: string): boolean {
  return date === new Date().toISOString().split("T")[0];
}

function resolveAgentLogPaths(date: string): string[] {
  const datedPaths = [
    `~/godmode/memory/agent-day/${date}.md`,
    `~/godmode/memory/agent-log/${date}.md`,
    `~/godmode/memory/daily/${date}-agent-log.md`,
  ];

  // Always try dated paths first so a stale legacy AGENT-DAY.md never shadows
  // a date-specific log. Legacy paths are last-resort only.
  return [...datedPaths, ...AGENT_LOG_PATH_CANDIDATES];
}

function looksLikeAgentLog(content: string): boolean {
  const markers = [
    "Needs Review",
    "Active Sub-Agents",
    "Completed Today",
    "Queue",
    "Feedback Log",
    "AGENT-DAY",
  ];
  const hits = markers.filter((marker) => content.includes(marker)).length;
  return hits >= 2;
}

/**
 * Load daily brief from the gateway
 * The gateway reads the brief from Obsidian and returns structured data
 */
async function loadDailyBrief(
  client: GatewayBrowserClient,
  date?: string,
): Promise<DailyBriefData | null> {
  try {
    const params = date ? { date } : {};
    const result = await client.request<{
      date: string;
      content: string;
      summary: {
        readiness: number | null;
        readinessMode: string | null;
        weather: { temp: number; condition: string; icon: string } | null;
        tasks: { total: number; completed: number };
      };
      sections: string[];
      updatedAt: string;
    }>("dailyBrief.get", params);

    // Validate response has expected shape (backend may return { configured: false } or null)
    if (!result || !result.content || !result.date) {
      return null;
    }
    return result;
  } catch (err) {
    console.error("[MyDay] Failed to load daily brief:", err);
    return null;
  }
}

/**
 * Load human-readable agent day markdown
 */
async function loadAgentLog(
  client: GatewayBrowserClient,
  date?: string,
  opts?: { refresh?: boolean },
): Promise<AgentLogData | null> {
  const targetDate = date || new Date().toISOString().split("T")[0];
  // agentLog.refresh does not exist — always use agentLog.get.
  // Cache-busting happens server-side on every request.
  const method = "agentLog.get";

  // Prefer the gateway-native method. It merges AGENT-DAY with task/project context.
  try {
    const result = await client.request<{
      date: string;
      content: string;
      updatedAt: string;
      sourcePath: string;
    }>(method, { date: targetDate });

    if (result?.content?.trim() && result?.sourcePath) {
      return {
        date: result.date || targetDate,
        content: result.content,
        updatedAt: result.updatedAt || new Date().toISOString(),
        sourcePath: result.sourcePath,
      };
    }
  } catch (err) {
    // Gateway may be older; fall back to direct file reads.
    console.warn(`[MyDay] ${method} unavailable, falling back to files.read:`, err);
  }

  return loadAgentLogFromFiles(client, targetDate);
}

/**
 * Backward-compat fallback when gateway does not expose agentLog.get
 */
async function loadAgentLogFromFiles(
  client: GatewayBrowserClient,
  targetDate: string,
): Promise<AgentLogData | null> {
  const candidatePaths = resolveAgentLogPaths(targetDate);

  // Legacy AGENT-DAY.md files (non-dated filenames) are only valid if they
  // were modified on the target date. Detect them by path pattern.
  const isLegacyPath = (p: string) => p.includes("AGENT-DAY.md");

  for (const path of candidatePaths) {
    try {
      const result = await client.request<{
        content: string;
        size: number;
        truncated: boolean;
        modifiedAt?: number;
      }>("files.read", { path, maxSize: 1_000_000 });

      if (!result?.content?.trim()) {
        continue;
      }

      if (!looksLikeAgentLog(result.content)) {
        continue;
      }

      // Skip stale legacy files — don't serve AGENT-DAY.md if it wasn't
      // modified on the date we're requesting.
      if (isLegacyPath(path) && typeof result.modifiedAt === "number") {
        const fileDate = new Date(result.modifiedAt).toISOString().split("T")[0];
        if (fileDate !== targetDate) {
          continue;
        }
      }

      return {
        date: targetDate,
        content: result.content,
        updatedAt:
          typeof result.modifiedAt === "number"
            ? new Date(result.modifiedAt).toISOString()
            : new Date().toISOString(),
        sourcePath: path,
      };
    } catch {
      // Try next candidate path
    }
  }

  return null;
}

/**
 * Wrap a promise with an individual timeout.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/**
 * Load daily brief only (for refresh or date navigation)
 */
export async function loadBriefOnly(state: MyDayState) {
  if (!state.client || !state.connected) {
    return;
  }

  state.dailyBriefLoading = true;
  state.dailyBriefError = null;

  try {
    state.dailyBrief = await loadDailyBrief(state.client, state.todaySelectedDate);
    // Also load brief notes for the selected date
    if (state.loadBriefNotes) {
      await state.loadBriefNotes();
    }
  } catch (err) {
    state.dailyBriefError = err instanceof Error ? err.message : "Failed to load daily brief";
    console.error("[MyDay] Brief load error:", err);
  } finally {
    state.dailyBriefLoading = false;
  }
}

/**
 * Load agent log only (for refresh/date nav while Agent Log tab is active)
 */
export async function loadAgentLogOnly(state: MyDayState, opts?: { refresh?: boolean }) {
  if (!state.client || !state.connected) {
    return;
  }

  state.agentLogLoading = true;
  state.agentLogError = null;

  try {
    state.agentLog = await loadAgentLog(state.client, state.todaySelectedDate, opts);
  } catch (err) {
    state.agentLogError = err instanceof Error ? err.message : "Failed to load agent log";
    console.error("[MyDay] Agent log load error:", err);
  } finally {
    state.agentLogLoading = false;
  }
}

/**
 * Open the daily brief in Obsidian
 */
export function openBriefInObsidian(date?: string) {
  const briefDate = date || new Date().toISOString().split("T")[0];
  const vault = "VAULT"; // Could be made configurable
  const file = `01-Daily/${briefDate}`;
  const url = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(file)}`;

  window.open(url, "_blank");
}

/**
 * Load all My Day data (just the brief now).
 */
export async function loadMyDay(state: MyDayState) {
  if (!state.client || !state.connected) {
    return;
  }

  state.myDayLoading = true;
  state.myDayError = null;
  state.dailyBriefLoading = true;
  state.agentLogLoading = true;

  const date = state.todaySelectedDate;

  // Load brief notes alongside brief
  const loadBriefNotesPromise = state.loadBriefNotes
    ? withTimeout(state.loadBriefNotes(), 5_000, "Brief Notes")
    : Promise.resolve();

  const results = await Promise.allSettled([
    withTimeout(loadDailyBrief(state.client, date), 10_000, "Daily Brief"),
    loadBriefNotesPromise,
    withTimeout(loadAgentLog(state.client, date, { refresh: false }), 10_000, "Agent Log"),
  ]);

  state.dailyBrief = results[0].status === "fulfilled" ? results[0].value : null;
  state.agentLog = results[2].status === "fulfilled" ? results[2].value : null;

  // Log failures but don't block the page
  const labels = ["Brief", "Brief Notes", "Agent Log"];
  const failures = results
    .map((r, i) => (r.status === "rejected" ? { section: labels[i], reason: r.reason } : null))
    .filter(Boolean);

  if (failures.length > 0) {
    for (const f of failures) {
      console.warn(`[MyDay] ${f!.section} failed:`, f!.reason);
    }
    if (failures.length === results.length) {
      state.myDayError = "Failed to load daily brief";
    }
  }

  state.myDayLoading = false;
  state.dailyBriefLoading = false;
  state.agentLogLoading = false;
}

/**
 * Subscribe to WebSocket events for daily brief updates
 */
export function subscribeToBriefUpdates(
  client: GatewayBrowserClient,
  onUpdate: (brief: DailyBriefData) => void,
) {
  // Listen for daily-brief:update events from the gateway
  const handler = (data: DailyBriefData) => {
    console.log("[MyDay] Received daily brief update:", data.date);
    onUpdate(data);
  };

  client.on("daily-brief:update", handler);

  // Return unsubscribe function
  return () => {
    client.off("daily-brief:update", handler);
  };
}

/**
 * Subscribe to WebSocket events for agent log updates
 */
export function subscribeToAgentLogUpdates(client: GatewayBrowserClient, onUpdate: () => void) {
  const handler = () => {
    console.log("[MyDay] Received agent log update");
    onUpdate();
  };

  client.on("agent-log:update", handler);

  return () => {
    client.off("agent-log:update", handler);
  };
}
