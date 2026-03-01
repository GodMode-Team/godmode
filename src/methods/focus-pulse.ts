/**
 * focus-pulse.ts — Gateway methods for Focus Pulse daily priority tracking.
 *
 * Source of truth: Win The Day section in the Obsidian daily note.
 * Runtime state: ~/godmode/data/focus-pulse.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR, MEMORY_DIR, resolveVaultPath, DAILY_FOLDER } from "../data-paths.js";
import { scorePulseCheck, calculateDailyScore, type FocusItem, type PulseCheckResult } from "./focus-pulse-scorer.js";
import type { AgentLogState, CompletedItem, ActivityEntry } from "../lib/agent-log.js";
import { getUserTimezone } from "../lib/user-config.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const STATE_FILE = join(DATA_DIR, "focus-pulse.json");

// --- Types ---

type FocusPulseState = {
  date: string;
  active: boolean;
  morningSetDone: boolean;
  currentFocus: FocusItem | null;
  items: FocusItem[];
  pulseChecks: PulseCheckResult[];
  score: number;
  streak: number;
};

// --- Helpers ---

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: getUserTimezone() });
}

function emptyState(date: string): FocusPulseState {
  return {
    date,
    active: false,
    morningSetDone: false,
    currentFocus: null,
    items: [],
    pulseChecks: [],
    score: 0,
    streak: 0,
  };
}

async function readState(): Promise<FocusPulseState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as FocusPulseState;
    // Reset if stale (different day)
    const today = getTodayDate();
    if (parsed.date !== today) {
      return { ...emptyState(today), streak: parsed.streak };
    }
    return parsed;
  } catch {
    return emptyState(getTodayDate());
  }
}

async function writeState(state: FocusPulseState): Promise<void> {
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

function getVaultPath(): string | null {
  return resolveVaultPath();
}

function getDailyFolder(): string {
  return DAILY_FOLDER;
}

/**
 * Parse Win The Day items from a daily note's markdown content.
 *
 * Supports two formats:
 *   1. `1. [ ] **Title** — Context`     (numbered + checkbox + bold)
 *   2. `- [ ] **Title** — Context`      (bullet + checkbox + bold)
 */
function parseWinTheDay(content: string): FocusItem[] {
  // Extract the Win The Day / Today's Mission section
  const sectionMatch = content.match(
    /##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)([\s\S]*?)(?=^##\s|$)/mu,
  );
  if (!sectionMatch) return [];

  const sectionContent = sectionMatch[1];
  const items: FocusItem[] = [];
  // Match numbered items: `1. [ ] **Title** — Context` or `1. [x] **Title** — Context`
  const numberedRegex = /^(\d+)\.\s*\[([ x])\]\s*\*\*(.+?)\*\*(?:\s*[—–-]\s*(.+))?$/gm;
  let match;
  while ((match = numberedRegex.exec(sectionContent)) !== null) {
    items.push({
      index: parseInt(match[1], 10),
      title: match[3].trim(),
      context: match[4]?.trim() ?? "",
      completed: match[2] === "x",
    });
  }

  // If no numbered items, try bullet items: `- [ ] **Title** — Context`
  if (items.length === 0) {
    const bulletRegex = /^[-*]\s*\[([ x])\]\s*\*\*(.+?)\*\*(?:\s*[—–-]\s*(.+))?$/gm;
    let idx = 1;
    while ((match = bulletRegex.exec(sectionContent)) !== null) {
      items.push({
        index: idx++,
        title: match[2].trim(),
        context: match[3]?.trim() ?? "",
        completed: match[1] === "x",
      });
    }
  }

  return items;
}

/**
 * Read today's daily note content from Obsidian vault.
 */
async function readDailyNote(date: string): Promise<string | null> {
  const vaultPath = getVaultPath();
  if (!vaultPath) return null;
  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Update a checkbox in the daily note ([ ] → [x] for an item by title).
 */
async function markItemCompleteInNote(date: string, title: string): Promise<boolean> {
  const vaultPath = getVaultPath();
  if (!vaultPath) return false;
  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  try {
    let content = await readFile(filePath, "utf-8");
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `^(\\d+\\.\\s*)\\[ \\](\\s*\\*\\*${escaped}\\*\\*)`,
      "m",
    );
    const updated = content.replace(pattern, "$1[x]$2");
    if (updated === content) {
      // Try bullet format
      const bulletPattern = new RegExp(
        `^([-*]\\s*)\\[ \\](\\s*\\*\\*${escaped}\\*\\*)`,
        "m",
      );
      content = content.replace(bulletPattern, "$1[x]$2");
      if (content === updated) return false;
      await writeFile(filePath, content, "utf-8");
      return true;
    }
    await writeFile(filePath, updated, "utf-8");
    return true;
  } catch {
    return false;
  }
}

/**
 * Read today's agent log state from disk.
 */
async function readAgentLog(date: string): Promise<AgentLogState> {
  const logPath = join(MEMORY_DIR, "agent-log", `${date}.json`);
  try {
    const raw = await readFile(logPath, "utf-8");
    return JSON.parse(raw) as AgentLogState;
  } catch {
    return { date, needsReview: [], completed: [], errors: [], queue: [], activity: [], notes: [] };
  }
}

type RescueTimeRow = [string, number, number, string, string, number];

/**
 * Read today's RescueTime data.
 */
async function readRescueTimeData(date: string): Promise<RescueTimeRow[]> {
  const rtPath = join(DATA_DIR, "rescuetime", `${date}.json`);
  try {
    const raw = await readFile(rtPath, "utf-8");
    const parsed = JSON.parse(raw) as { rows?: RescueTimeRow[] };
    return parsed.rows ?? [];
  } catch {
    return [];
  }
}

// --- Broadcast helper ---

function broadcastState(
  context: Parameters<GatewayRequestHandler>[0]["context"],
  state: FocusPulseState,
): void {
  // Build a slim payload for the UI
  const currentFocus = state.currentFocus;
  const lastCheck = state.pulseChecks[state.pulseChecks.length - 1];
  context?.broadcast?.(
    "focusPulse:update",
    {
      active: state.active,
      morningSetDone: state.morningSetDone,
      currentFocus: currentFocus
        ? { index: currentFocus.index, title: currentFocus.title, context: currentFocus.context }
        : null,
      items: state.items,
      score: state.score,
      streak: state.streak,
      aligned: lastCheck?.aligned ?? true,
      lastCheckReason: lastCheck?.reason ?? "",
    },
    { dropIfSlow: true },
  );
}

// --- Gateway Methods ---

// --- Heartbeat broadcast ref helper ---

function refreshHeartbeatBroadcast(context: Parameters<GatewayRequestHandler>[0]["context"]): void {
  if (!context?.broadcast) return;
  import("../services/focus-pulse-heartbeat.js")
    .then(({ setHeartbeatBroadcast }) => setHeartbeatBroadcast(context.broadcast!))
    .catch(() => {});
}

const getState: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const state = await readState();
  const currentFocus = state.currentFocus;
  const lastCheck = state.pulseChecks[state.pulseChecks.length - 1];
  respond(true, {
    active: state.active,
    morningSetDone: state.morningSetDone,
    currentFocus: currentFocus
      ? { index: currentFocus.index, title: currentFocus.title, context: currentFocus.context }
      : null,
    items: state.items,
    score: state.score,
    streak: state.streak,
    aligned: lastCheck?.aligned ?? true,
    lastCheckReason: lastCheck?.reason ?? "",
  });
};

const startMorningSet: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const today = getTodayDate();
  const noteContent = await readDailyNote(today);

  let items: FocusItem[] = [];
  if (noteContent) {
    items = parseWinTheDay(noteContent);
  }

  // Delegate task sync to the canonical syncTasksFromBrief (dedup, normalize, etc.)
  let syncResult = { added: 0, updated: 0, total: 0 };
  try {
    const { syncTasksFromBrief } = await import("./daily-brief.js");
    syncResult = await syncTasksFromBrief(today);
  } catch {
    // Task sync is best-effort — don't block morning set
  }

  // Morning set workflow: kick overdue items to tomorrow
  let overdueKicked = 0;
  try {
    const { readTasks, writeTasks } = await import("./tasks.js");
    const tasksData = await readTasks();
    const tomorrow = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("en-CA", { timeZone: getUserTimezone() });
    })();

    // Items from the Win The Day section are "today's confirmed priorities"
    const winTheDayTitles = new Set(items.map((i) => i.title.toLowerCase()));

    for (const task of tasksData.tasks) {
      if (task.status !== "pending" || !task.dueDate) continue;
      // Skip tasks that are part of today's Win The Day set
      if (task.dueDate === today && winTheDayTitles.has(task.title.toLowerCase())) continue;
      // Kick overdue tasks (dueDate < today) to tomorrow
      if (task.dueDate < today) {
        task.dueDate = tomorrow;
        task.carryOver = true;
        overdueKicked++;
      }
    }

    if (overdueKicked > 0) {
      await writeTasks(tasksData);
    }
  } catch {
    // Overdue kick is best-effort
  }

  // Update state: morning set started, items loaded
  const state = await readState();
  state.date = today;
  state.active = true;
  state.items = items.length > 0 ? items : state.items;
  await writeState(state);

  // Tell the UI to open a new session for the morning ritual
  context?.broadcast?.("focusPulse:morningSet", {
    action: "new-session",
    title: `Morning Set — ${today}`,
    items,
  }, { dropIfSlow: true });

  broadcastState(context, state);

  respond(true, {
    items,
    noteFound: noteContent !== null,
    newSession: true,
    sessionTitle: `Morning Set — ${today}`,
    syncResult,
    overdueKicked,
    message: items.length > 0
      ? `Found ${items.length} Win The Day items. ${overdueKicked > 0 ? `${overdueKicked} overdue items moved to tomorrow. ` : ""}Review and pick your #1 focus.`
      : "No Win The Day items found in today's daily note. You can set priorities manually.",
  });
};

const setFocus: GatewayRequestHandler = async ({ params, respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const { index, title } = params as { index?: number; title?: string };
  const state = await readState();

  if (!state.active) {
    respond(false, null, { code: "NOT_ACTIVE", message: "Focus Pulse is not active. Start morning set first." });
    return;
  }

  let focus: FocusItem | null = null;

  if (index != null) {
    focus = state.items.find((i) => i.index === index) ?? null;
  } else if (title) {
    focus = state.items.find((i) => i.title.toLowerCase().includes(title.toLowerCase())) ?? null;
    // Allow setting a custom focus not in the items list
    if (!focus) {
      focus = { index: state.items.length + 1, title, context: "", completed: false };
      state.items.push(focus);
    }
  }

  if (!focus) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Could not find item. Provide index or title." });
    return;
  }

  state.currentFocus = focus;
  state.morningSetDone = true;
  state.score = calculateDailyScore(
    state.pulseChecks,
    state.items.filter((i) => i.completed).length,
    state.items.length,
    true,
    state.streak,
  );
  await writeState(state);
  broadcastState(context, state);

  // Start heartbeat timer for periodic pulse checks
  try {
    const { startHeartbeat } = await import("../services/focus-pulse-heartbeat.js");
    startHeartbeat();
  } catch {
    // Heartbeat is best-effort
  }

  respond(true, {
    currentFocus: focus,
    message: `Focus set: ${focus.title}`,
  });
};

const pulseCheck: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const state = await readState();

  if (!state.active || !state.currentFocus) {
    respond(true, { skipped: true, reason: "No active focus set" });
    return;
  }

  const today = getTodayDate();
  const agentLog = await readAgentLog(today);
  const rtRows = await readRescueTimeData(today);

  const check = scorePulseCheck(
    state.currentFocus,
    agentLog.completed,
    agentLog.activity,
    rtRows,
  );

  state.pulseChecks.push(check);
  state.score = calculateDailyScore(
    state.pulseChecks,
    state.items.filter((i) => i.completed).length,
    state.items.length,
    state.morningSetDone,
    state.streak,
  );
  await writeState(state);
  broadcastState(context, state);

  respond(true, check);
};

const completeFocus: GatewayRequestHandler = async ({ params, respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const state = await readState();

  if (!state.currentFocus) {
    respond(false, null, { code: "NO_FOCUS", message: "No current focus to complete" });
    return;
  }

  // Mark completed in state
  const focusIndex = state.currentFocus.index;
  const item = state.items.find((i) => i.index === focusIndex);
  if (item) item.completed = true;
  state.currentFocus.completed = true;

  // Update checkbox in daily note
  const today = getTodayDate();
  await markItemCompleteInNote(today, state.currentFocus.title);

  // Promote next incomplete item
  const next = state.items.find((i) => !i.completed && i.index !== focusIndex);
  state.currentFocus = next ?? null;

  state.score = calculateDailyScore(
    state.pulseChecks,
    state.items.filter((i) => i.completed).length,
    state.items.length,
    state.morningSetDone,
    state.streak,
  );
  await writeState(state);
  broadcastState(context, state);

  respond(true, {
    completed: item?.title ?? "Unknown",
    nextFocus: next ? next.title : null,
    message: next
      ? `Completed! Next focus: ${next.title}`
      : "All items completed! Great work today.",
  });
};

const endDay: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const state = await readState();

  const completedCount = state.items.filter((i) => i.completed).length;
  const totalItems = state.items.length;
  const finalScore = calculateDailyScore(
    state.pulseChecks,
    completedCount,
    totalItems,
    state.morningSetDone,
    state.streak,
  );

  // Update streak: increment if #1 item was completed, otherwise reset
  const firstItem = state.items.find((i) => i.index === 1);
  const primaryCompleted = firstItem?.completed ?? false;
  const newStreak = primaryCompleted ? state.streak + 1 : 0;

  state.score = finalScore;
  state.streak = newStreak;
  state.active = false;
  await writeState(state);

  // Stop heartbeat timer
  try {
    const { stopHeartbeat } = await import("../services/focus-pulse-heartbeat.js");
    stopHeartbeat();
  } catch {
    // Non-fatal
  }

  // Log summary to agent log
  try {
    const { appendEntry } = await import("../lib/agent-log.js");
    await appendEntry({
      category: "activity",
      item: `Focus Pulse: ${finalScore}/100 · ${completedCount}/${totalItems} done · Streak: ${newStreak}d`,
    });
  } catch {
    // Agent log write is best-effort
  }

  broadcastState(context, state);

  respond(true, {
    score: finalScore,
    streak: newStreak,
    completed: completedCount,
    total: totalItems,
    primaryCompleted,
    message: primaryCompleted
      ? `Day complete! Score: ${finalScore}/100, Streak: ${newStreak} days`
      : `Day done. Score: ${finalScore}/100. Streak reset (primary task incomplete).`,
  });
};

// --- Exported helpers for morning-set tool ---

export { readState, writeState, getTodayDate, parseWinTheDay, readDailyNote };
export type { FocusPulseState };

/**
 * Rewrite the Win The Day section in the daily note with refined items.
 * Preserves [x] state for items whose titles match existing completed items.
 */
export async function rewriteWinTheDay(
  date: string,
  items: FocusItem[],
): Promise<{ rewritten: boolean; error?: string }> {
  const vaultPath = getVaultPath();
  if (!vaultPath) return { rewritten: false, error: "No vault path configured" };

  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return { rewritten: false, error: "Daily note not found" };
  }

  // Parse existing items to detect already-completed titles
  const existing = parseWinTheDay(content);
  const completedTitles = new Set(
    existing.filter((i) => i.completed).map((i) => i.title.toLowerCase()),
  );

  // Build replacement section body (not including the heading)
  const lines = items.map((item, idx) => {
    const checked = completedTitles.has(item.title.toLowerCase()) ? "x" : " ";
    const ctx = item.context ? ` — ${item.context}` : "";
    return `${idx + 1}. [${checked}] **${item.title}**${ctx}`;
  });
  const newBody = "\n" + lines.join("\n") + "\n";

  // Find the section boundaries
  const sectionRegex = /^(##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)[^\n]*)\n([\s\S]*?)(?=^##\s|$)/mu;
  const sectionMatch = content.match(sectionRegex);

  let updated: string;
  if (sectionMatch) {
    // Replace section body, keep the heading
    const heading = sectionMatch[1];
    const fullMatch = sectionMatch[0];
    updated = content.replace(fullMatch, heading + newBody);
  } else {
    // No existing section — append after the first ## section
    const firstH2 = content.match(/^##\s/m);
    if (firstH2 && firstH2.index != null) {
      // Find end of first section
      const afterFirst = content.slice(firstH2.index);
      const nextH2 = afterFirst.slice(1).search(/^##\s/m);
      const insertPos = nextH2 >= 0 ? firstH2.index + 1 + nextH2 : content.length;
      const newSection = "\n## Win The Day\n" + lines.join("\n") + "\n\n";
      updated = content.slice(0, insertPos) + newSection + content.slice(insertPos);
    } else {
      // No sections at all — append
      updated = content + "\n\n## Win The Day\n" + lines.join("\n") + "\n";
    }
  }

  await writeFile(filePath, updated, "utf-8");
  return { rewritten: true };
}

/**
 * Scope today's tasks to only Win The Day items.
 * Un-dates pending tasks for today that aren't in the WTD set (doesn't push to tomorrow).
 */
export async function scopeTasksToWinTheDay(
  date: string,
  winTheDayItems: FocusItem[],
): Promise<{ deferred: number }> {
  const { readTasks, writeTasks } = await import("./tasks.js");
  const tasksData = await readTasks();

  const wtdTitles = new Set(winTheDayItems.map((i) => i.title.toLowerCase()));
  let deferred = 0;

  for (const task of tasksData.tasks) {
    if (task.status !== "pending" || task.dueDate !== date) continue;
    if (wtdTitles.has(task.title.toLowerCase())) continue;
    // Un-date: remove from today without pushing to tomorrow
    task.dueDate = null;
    deferred++;
  }

  if (deferred > 0) {
    await writeTasks(tasksData);
  }

  return { deferred };
}

// --- Export ---

export const focusPulseHandlers: GatewayRequestHandlers = {
  "focusPulse.getState": getState,
  "focusPulse.startMorningSet": startMorningSet,
  "focusPulse.setFocus": setFocus,
  "focusPulse.pulseCheck": pulseCheck,
  "focusPulse.complete": completeFocus,
  "focusPulse.endDay": endDay,
};
