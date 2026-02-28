/**
 * focus-pulse-heartbeat.ts — Singleton 30-minute timer service for Focus Pulse.
 *
 * Runs periodic pulse checks to compare current activity against the locked-in
 * focus item, broadcasting alignment updates to the UI.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";
import {
  scorePulseCheck,
  calculateDailyScore,
  type FocusItem,
  type PulseCheckResult,
} from "../methods/focus-pulse-scorer.js";
import type { AgentLogState } from "../lib/agent-log.js";

type BroadcastFn = (
  event: string,
  payload: unknown,
  opts?: { dropIfSlow?: boolean },
) => void;

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

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

const STATE_FILE = join(DATA_DIR, "focus-pulse.json");
const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

// --- Singleton ---

let instance: FocusPulseHeartbeat | null = null;

class FocusPulseHeartbeat {
  private timer: ReturnType<typeof setInterval> | null = null;
  private broadcastFn: BroadcastFn | null = null;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  start(): void {
    if (this.timer) return; // already running
    this.logger.info("[FocusPulse] Heartbeat started (30-min interval)");
    this.timer = setInterval(() => void this.tick(), INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.logger.info("[FocusPulse] Heartbeat stopped");
    }
  }

  get running(): boolean {
    return this.timer !== null;
  }

  private async tick(): Promise<void> {
    try {
      const state = await this.readState();
      const today = getTodayDate();

      // Auto-stop if no longer active or date changed
      if (!state.active || !state.currentFocus || state.date !== today) {
        this.stop();
        return;
      }

      const agentLog = await this.readAgentLog(today);
      const rtRows = await this.readRescueTimeData(today);

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
      await this.writeState(state);

      // Broadcast state update to UI
      this.broadcast(state, check);

      this.logger.info(
        `[FocusPulse] Pulse check: ${check.score}/100 ${check.aligned ? "aligned" : "misaligned"} — ${check.reason}`,
      );
    } catch (err) {
      this.logger.error(`[FocusPulse] Heartbeat tick error: ${String(err)}`);
    }
  }

  private broadcast(state: FocusPulseState, check: PulseCheckResult): void {
    if (!this.broadcastFn) return;
    try {
      const currentFocus = state.currentFocus;
      const lastCheck = state.pulseChecks[state.pulseChecks.length - 1];
      this.broadcastFn(
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
    } catch {
      // Broadcast is best-effort — ref may be stale
    }
  }

  private async readState(): Promise<FocusPulseState> {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as FocusPulseState;
  }

  private async writeState(state: FocusPulseState): Promise<void> {
    await mkdir(dirname(STATE_FILE), { recursive: true });
    await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  }

  private async readAgentLog(date: string): Promise<AgentLogState> {
    const logPath = join(MEMORY_DIR, "agent-log", `${date}.json`);
    try {
      const raw = await readFile(logPath, "utf-8");
      return JSON.parse(raw) as AgentLogState;
    } catch {
      return { date, needsReview: [], completed: [], errors: [], queue: [], activity: [], notes: [] };
    }
  }

  private async readRescueTimeData(date: string): Promise<[string, number, number, string, string, number][]> {
    const rtPath = join(DATA_DIR, "rescuetime", `${date}.json`);
    try {
      const raw = await readFile(rtPath, "utf-8");
      const parsed = JSON.parse(raw) as { rows?: [string, number, number, string, string, number][] };
      return parsed.rows ?? [];
    } catch {
      return [];
    }
  }
}

// --- Public API ---

export function initHeartbeat(logger: Logger): void {
  if (!instance) {
    instance = new FocusPulseHeartbeat(logger);
  }
}

export function getHeartbeat(): FocusPulseHeartbeat | null {
  return instance;
}

export function startHeartbeat(): void {
  instance?.start();
}

export function stopHeartbeat(): void {
  instance?.stop();
}

export function setHeartbeatBroadcast(fn: BroadcastFn): void {
  instance?.setBroadcast(fn);
}

/**
 * Check if focus pulse is active for today and auto-start heartbeat if so.
 * Used during gateway restart recovery.
 */
export async function resumeHeartbeatIfActive(): Promise<void> {
  if (!instance || instance.running) return;
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const state = JSON.parse(raw) as FocusPulseState;
    const today = getTodayDate();
    if (state.date === today && state.active && state.currentFocus && state.morningSetDone) {
      instance.start();
    }
  } catch {
    // State file missing or invalid — no resume needed
  }
}
