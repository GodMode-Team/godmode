/**
 * proactive-intel.ts — Singleton daemon for the Proactive Intelligence system.
 *
 * Orchestrates three subsystems on staggered cadences:
 *   - Scout (external monitoring):  every 2h (fastest source)
 *   - Observer (user patterns):     every 15 min
 *   - Advisor (synthesis):          debounced, max 1x per 30 min
 *
 * Lifecycle: start() / stop() / resume()
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { runScoutCycle, runScoutForceRefresh, readScoutState, type ScoutSourceId } from "./scout.js";
import { runObserverCycle, readUserPatterns } from "./observer.js";
import { runAdvisorCycle, type Insight } from "./advisor.js";

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

type ProactiveIntelStatus = {
  running: boolean;
  lastScoutRun: number;
  lastObserverRun: number;
  lastAdvisorRun: number;
  scoutSourcesChecked: ScoutSourceId[];
  totalFindings: number;
  totalInsights: number;
  totalChallenges: number;
};

// ── Constants ──────────────────────────────────────────────────────────

const SCOUT_INTERVAL_MS = 30 * 60_000;     // Check scout every 30 min (individual sources have own cadences)
const OBSERVER_INTERVAL_MS = 15 * 60_000;  // 15 minutes
const ADVISOR_DEBOUNCE_MS = 30 * 60_000;   // Max 1x per 30 min
const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

// ── Singleton ──────────────────────────────────────────────────────────

let instance: ProactiveIntelService | null = null;

class ProactiveIntelService {
  private scoutTimer: ReturnType<typeof setInterval> | null = null;
  private observerTimer: ReturnType<typeof setInterval> | null = null;
  private advisorPending = false;
  private lastAdvisorRun = 0;
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

    // Check if enabled in options
    const enabled = await this.isEnabled();
    if (!enabled) {
      this.logger.info("[ProactiveIntel] Disabled in options — not starting");
      return;
    }

    this.status.running = true;
    this.logger.info("[ProactiveIntel] Service started");

    // Run initial observer cycle after a short delay (let gateway finish starting)
    setTimeout(() => void this.runObserver(), 10_000);

    // Run initial scout cycle after 60s (give APIs time, don't spike on startup)
    setTimeout(() => void this.runScout(), 60_000);

    // Set up recurring timers
    this.scoutTimer = setInterval(() => void this.runScout(), SCOUT_INTERVAL_MS);
    this.observerTimer = setInterval(() => void this.runObserver(), OBSERVER_INTERVAL_MS);
  }

  stop(): void {
    if (this.scoutTimer) {
      clearInterval(this.scoutTimer);
      this.scoutTimer = null;
    }
    if (this.observerTimer) {
      clearInterval(this.observerTimer);
      this.observerTimer = null;
    }
    this.status.running = false;
    this.logger.info("[ProactiveIntel] Service stopped");
  }

  async resume(): Promise<void> {
    if (this.status.running) return;
    const enabled = await this.isEnabled();
    if (enabled) {
      await this.start();
    }
  }

  async forceRefresh(): Promise<{ newFindings: number; newInsights: number }> {
    this.logger.info("[ProactiveIntel] Force refresh triggered");

    // Run all in sequence: scout → observer → advisor
    const scoutResult = await runScoutForceRefresh(this.logger);
    this.status.lastScoutRun = Date.now();

    const observerResult = await runObserverCycle(this.logger);
    this.status.lastObserverRun = Date.now();
    this.status.totalChallenges = observerResult.newChallenges;

    const scoutState = await readScoutState();
    this.status.totalFindings = scoutState.findings.length;

    const advisorResult = await runAdvisorCycle(scoutState, observerResult.patterns, this.logger);
    this.status.lastAdvisorRun = Date.now();
    this.lastAdvisorRun = Date.now();
    this.status.totalInsights = advisorResult.totalActive;

    // Broadcast if we have new insights
    if (advisorResult.newInsights > 0) {
      this.broadcast("proactiveIntel:insight", {
        newInsights: advisorResult.newInsights,
        totalActive: advisorResult.totalActive,
      });
    }

    this.broadcast("proactiveIntel:update", this.status);

    return {
      newFindings: scoutResult.newFindings,
      newInsights: advisorResult.newInsights,
    };
  }

  // ── Private tick methods ───────────────────────────────────────────

  private async runScout(): Promise<void> {
    try {
      const cadenceMultiplier = await this.getCadenceMultiplier();
      const result = await runScoutCycle(this.logger, cadenceMultiplier);
      this.status.lastScoutRun = Date.now();
      this.status.scoutSourcesChecked = result.sources;

      const scoutState = await readScoutState();
      this.status.totalFindings = scoutState.findings.length;

      if (result.newFindings > 0) {
        await this.maybeRunAdvisor();
      }
    } catch (err) {
      this.logger.error(`[ProactiveIntel] Scout tick error: ${String(err)}`);
    }
  }

  private async runObserver(): Promise<void> {
    try {
      const result = await runObserverCycle(this.logger);
      this.status.lastObserverRun = Date.now();
      this.status.totalChallenges = result.newChallenges;

      if (result.newChallenges > 0) {
        await this.maybeRunAdvisor();
      }
    } catch (err) {
      this.logger.error(`[ProactiveIntel] Observer tick error: ${String(err)}`);
    }
  }

  private async maybeRunAdvisor(): Promise<void> {
    // Debounce: don't run advisor more than once per 30 min
    if (Date.now() - this.lastAdvisorRun < ADVISOR_DEBOUNCE_MS) {
      this.advisorPending = true;
      // Schedule for when debounce expires
      const delay = ADVISOR_DEBOUNCE_MS - (Date.now() - this.lastAdvisorRun) + 1000;
      setTimeout(() => {
        if (this.advisorPending && this.status.running) {
          this.advisorPending = false;
          void this.runAdvisor();
        }
      }, delay);
      return;
    }

    await this.runAdvisor();
  }

  private async runAdvisor(): Promise<void> {
    try {
      const scoutState = await readScoutState();
      const patterns = await readUserPatterns();

      const result = await runAdvisorCycle(scoutState, patterns, this.logger);
      this.lastAdvisorRun = Date.now();
      this.status.lastAdvisorRun = Date.now();
      this.status.totalInsights = result.totalActive;

      if (result.newInsights > 0) {
        this.broadcast("proactiveIntel:insight", {
          newInsights: result.newInsights,
          totalActive: result.totalActive,
        });
      }

      this.broadcast("proactiveIntel:update", this.status);
    } catch (err) {
      this.logger.error(`[ProactiveIntel] Advisor tick error: ${String(err)}`);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────

  private broadcast(event: string, payload: unknown): void {
    if (!this.broadcastFn) return;
    try {
      this.broadcastFn(event, payload, { dropIfSlow: true });
    } catch {
      // Best-effort
    }
  }

  private async isEnabled(): Promise<boolean> {
    try {
      const raw = await readFile(OPTIONS_FILE, "utf-8");
      const opts = JSON.parse(raw) as Record<string, unknown>;
      return opts["proactiveIntel.enabled"] !== false; // Enabled by default
    } catch {
      return true; // Default: enabled
    }
  }

  private async getCadenceMultiplier(): Promise<number> {
    try {
      const raw = await readFile(OPTIONS_FILE, "utf-8");
      const opts = JSON.parse(raw) as Record<string, unknown>;
      const val = opts["proactiveIntel.cadenceMultiplier"];
      if (typeof val === "number" && val > 0 && val <= 10) return val;
      return 1.0;
    } catch {
      return 1.0;
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
