/**
 * rescuetime-fetcher.ts — RescueTime daily data pull service.
 *
 * Fetches activity, summary, and productivity data from the RescueTime API
 * and stores it in ~/godmode/data/rescuetime/ for Focus Pulse scoring.
 *
 * Singleton pattern matches consciousness-heartbeat.ts.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, localDateString } from "../data-paths.js";
import { getEnvVar } from "../lib/env-writer.js";

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

const TAG = "[RescueTime]";
const RESCUETIME_DIR = join(DATA_DIR, "rescuetime");
const STATE_FILE = join(DATA_DIR, "rescuetime-state.json");
const INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const REQUEST_TIMEOUT_MS = 15_000;
const BASE_URL = "https://www.rescuetime.com/anapi/data";

interface FetchState {
  lastFetchByDate: Record<string, number>;
}

// ── Singleton ─────────────────────────────────────────────────────

let instance: RescueTimeFetcher | null = null;

class RescueTimeFetcher {
  private timer: ReturnType<typeof setInterval> | null = null;
  private logger: Logger;
  private tickInFlight = false;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  start(): void {
    if (this.timer) return;
    this.logger.info(`${TAG} Service started (${INTERVAL_MS / 3_600_000}h interval)`);
    // First tick after short delay so gateway_start completes
    setTimeout(() => void this.tick(), 20_000);
    this.timer = setInterval(() => void this.tick(), INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.logger.info(`${TAG} Service stopped`);
    }
  }

  get running(): boolean {
    return this.timer !== null;
  }

  /** Trigger an immediate fetch for a specific date. */
  async fetchDate(date: string): Promise<{ ok: boolean; files: string[] }> {
    const apiKey = getEnvVar("RESCUETIME_API_KEY");
    if (!apiKey) {
      return { ok: false, files: [] };
    }
    return this.pullForDate(apiKey, date);
  }

  /** Return most recent day's data if available. */
  async latestData(): Promise<{ date: string; activity: unknown; summary: unknown; productivity: unknown } | null> {
    const today = localDateString();
    const yesterday = localDateString(new Date(Date.now() - 86_400_000));

    for (const date of [today, yesterday]) {
      const activityFile = join(RESCUETIME_DIR, `${date}.json`);
      if (existsSync(activityFile)) {
        try {
          const [activity, summary, productivity] = await Promise.all([
            readJsonSafe(activityFile),
            readJsonSafe(join(RESCUETIME_DIR, `${date}-summary.json`)),
            readJsonSafe(join(RESCUETIME_DIR, `${date}-productivity.json`)),
          ]);
          return { date, activity, summary, productivity };
        } catch {
          continue;
        }
      }
    }
    return null;
  }

  private async tick(): Promise<void> {
    if (this.tickInFlight) {
      this.logger.info(`${TAG} Skipping tick — previous still running`);
      return;
    }
    this.tickInFlight = true;
    try {
      const apiKey = getEnvVar("RESCUETIME_API_KEY");
      if (!apiKey) {
        this.logger.info(`${TAG} No RESCUETIME_API_KEY configured — skipping`);
        return;
      }

      await mkdir(RESCUETIME_DIR, { recursive: true });

      const today = localDateString();
      const yesterday = localDateString(new Date(Date.now() - 86_400_000));
      const state = await readState();

      // Always fetch today (data updates throughout the day)
      const todayResult = await this.pullForDate(apiKey, today);
      if (todayResult.ok) {
        state.lastFetchByDate[today] = Date.now();
      }

      // Backfill yesterday if never fetched
      if (!state.lastFetchByDate[yesterday]) {
        const yesterdayResult = await this.pullForDate(apiKey, yesterday);
        if (yesterdayResult.ok) {
          state.lastFetchByDate[yesterday] = Date.now();
        }
      }

      // Prune state entries older than 7 days
      const cutoff = Date.now() - 7 * 86_400_000;
      for (const [d, ts] of Object.entries(state.lastFetchByDate)) {
        if (ts < cutoff) delete state.lastFetchByDate[d];
      }

      await writeState(state);
      this.logger.info(`${TAG} Tick complete — fetched ${today}`);
    } catch (err) {
      this.logger.warn(`${TAG} Tick error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      this.tickInFlight = false;
    }
  }

  private async pullForDate(
    apiKey: string,
    date: string,
  ): Promise<{ ok: boolean; files: string[] }> {
    const files: string[] = [];
    const queries = [
      { suffix: "", params: "perspective=interval&restrict_kind=activity&interval=hour" },
      { suffix: "-summary", params: "perspective=rank&restrict_kind=overview" },
      { suffix: "-productivity", params: "perspective=rank&restrict_kind=productivity" },
    ];

    for (const q of queries) {
      try {
        const url = `${BASE_URL}?key=${apiKey}&format=json&${q.params}&restrict_begin=${date}&restrict_end=${date}`;
        const resp = await fetch(url, {
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          headers: { "User-Agent": "GodMode-RescueTime/1.0" },
        });

        if (!resp.ok) {
          this.logger.warn(`${TAG} API ${resp.status} for ${date}${q.suffix}`);
          continue;
        }

        const data = await resp.json();
        const outPath = join(RESCUETIME_DIR, `${date}${q.suffix}.json`);
        await writeFile(outPath, JSON.stringify(data, null, 2), "utf-8");
        files.push(outPath);
      } catch (err) {
        this.logger.warn(
          `${TAG} Fetch failed for ${date}${q.suffix}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    return { ok: files.length > 0, files };
  }
}

// ── State helpers ─────────────────────────────────────────────────

async function readState(): Promise<FetchState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as FetchState;
  } catch {
    return { lastFetchByDate: {} };
  }
}

async function writeState(state: FetchState): Promise<void> {
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

async function readJsonSafe(path: string): Promise<unknown> {
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw);
}

// ── Exports ───────────────────────────────────────────────────────

export function initRescueTimeFetcher(logger: Logger): void {
  instance = new RescueTimeFetcher(logger);
}

export function startRescueTimeFetcher(): void {
  instance?.start();
}

export function stopRescueTimeFetcher(): void {
  instance?.stop();
}

export function getRescueTimeFetcher(): RescueTimeFetcher | null {
  return instance;
}
