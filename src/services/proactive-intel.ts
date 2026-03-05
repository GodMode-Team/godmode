/**
 * proactive-intel.ts — Proactive Intelligence service (lean stub).
 *
 * Scout, Observer, and Advisor subsystems removed in lean audit.
 * Phase 2 will rewrite this as a single lean service.
 * For now: maintains the public API so the gateway compiles.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

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

export type ProactiveIntelStatus = {
  running: boolean;
  lastScoutRun: number;
  lastObserverRun: number;
  lastAdvisorRun: number;
  scoutSourcesChecked: string[];
  totalFindings: number;
  totalInsights: number;
  totalChallenges: number;
};

// ── Constants ──────────────────────────────────────────────────────────

const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

// ── Singleton ──────────────────────────────────────────────────────────

let instance: ProactiveIntelService | null = null;

class ProactiveIntelService {
  private broadcastFn: BroadcastFn | null = null;
  private logger: Logger;
  private status: ProactiveIntelStatus;

  constructor(logger: Logger) {
    this.logger = logger;
    this.status = {
      running: false,
      lastScoutRun: 0,
      lastObserverRun: 0,
      lastAdvisorRun: 0,
      scoutSourcesChecked: [],
      totalFindings: 0,
      totalInsights: 0,
      totalChallenges: 0,
    };
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  get running(): boolean {
    return this.status.running;
  }

  getStatus(): ProactiveIntelStatus {
    return { ...this.status };
  }

  async start(): Promise<void> {
    if (this.status.running) return;
    const enabled = await this.isEnabled();
    if (!enabled) {
      this.logger.info("[ProactiveIntel] Disabled in options — not starting");
      return;
    }
    this.status.running = true;
    this.logger.info("[ProactiveIntel] Service started (lean stub — Phase 2 rewrite pending)");
  }

  stop(): void {
    this.status.running = false;
    this.logger.info("[ProactiveIntel] Service stopped");
  }

  async resume(): Promise<void> {
    if (this.status.running) return;
    const enabled = await this.isEnabled();
    if (enabled) await this.start();
  }

  async forceRefresh(): Promise<{ newFindings: number; newInsights: number }> {
    this.logger.info("[ProactiveIntel] Force refresh — subsystems removed in lean audit");
    return { newFindings: 0, newInsights: 0 };
  }

  private async isEnabled(): Promise<boolean> {
    try {
      const raw = await readFile(OPTIONS_FILE, "utf-8");
      const opts = JSON.parse(raw) as Record<string, unknown>;
      return opts["proactiveIntel.enabled"] !== false;
    } catch {
      return true;
    }
  }
}

// ── Public API ─────────────────────────────────────────────────────────

export function getProactiveIntelService(logger?: Logger): ProactiveIntelService {
  if (!instance) {
    if (!logger) throw new Error("ProactiveIntelService not initialized — logger required");
    instance = new ProactiveIntelService(logger);
  }
  return instance;
}

export function stopProactiveIntelService(): void {
  instance?.stop();
}
