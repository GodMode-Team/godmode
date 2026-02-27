/**
 * focus-pulse.ts — Gateway methods for Focus Pulse daily priority tracking.
 *
 * Source of truth: Win The Day section in the Obsidian daily note.
 * Runtime state: ~/godmode/data/focus-pulse.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";
import { scorePulseCheck, calculateDailyScore, type FocusItem, type PulseCheckResult } from "./focus-pulse-scorer.js";
import type { AgentLogState, CompletedItem, ActivityEntry } from "../lib/agent-log.js";

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
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
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
  return process.env.OBSIDIAN_VAULT_PATH || null;
}

function getDailyFolder(): string {
  return process.env.DAILY_BRIEF_FOLDER || "01-Daily";
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
  context.broadcast(
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

const getState: GatewayRequestHandler = async ({ respond, context }) => {
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
  const today = getTodayDate();
  const noteContent = await readDailyNote(today);

  let items: FocusItem[] = [];
  if (noteContent) {
    items = parseWinTheDay(noteContent);
  }

  // Update state: morning set started, items loaded
  const state = await readState();
  state.date = today;
  state.active = true;
  state.items = items.length > 0 ? items : state.items;
  await writeState(state);

  respond(true, {
    items,
    noteFound: noteContent !== null,
    message: items.length > 0
      ? `Found ${items.length} Win The Day items. Review and pick your #1 focus.`
      : "No Win The Day items found in today's daily note. You can set priorities manually.",
  });
};

const setFocus: GatewayRequestHandler = async ({ params, respond, context }) => {
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

  respond(true, {
    currentFocus: focus,
    message: `Focus set: ${focus.title}`,
  });
};

const pulseCheck: GatewayRequestHandler = async ({ respond, context }) => {
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

// --- Export ---

export const focusPulseHandlers: GatewayRequestHandlers = {
  "focusPulse.getState": getState,
  "focusPulse.startMorningSet": startMorningSet,
  "focusPulse.setFocus": setFocus,
  "focusPulse.pulseCheck": pulseCheck,
  "focusPulse.complete": completeFocus,
  "focusPulse.endDay": endDay,
};
