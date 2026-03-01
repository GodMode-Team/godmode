/**
 * consciousness-heartbeat.ts — Hourly consciousness sync service.
 *
 * Runs consciousness-sync.sh on a regular interval so that
 * CONSCIOUSNESS.md stays fresh across all sessions without manual
 * intervention.  Also syncs Claude Code sessions into the agent-log
 * on each tick (same fire-and-forget as the manual flush path).
 *
 * Singleton pattern matches focus-pulse-heartbeat.ts.
 */

import { exec as nodeExec } from "node:child_process";
import { accessSync, constants as fsConstants, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import { syncClaudeCodeSessions } from "./claude-code-sync.js";

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

const CONSCIOUSNESS_SCRIPT = join(GODMODE_ROOT, "scripts", "consciousness-sync.sh");
const CONSCIOUSNESS_FILE = join(MEMORY_DIR, "CONSCIOUSNESS.md");

const DEFAULT_INTERVAL_MS = 60 * 60 * 1000; // 60 minutes
const EXEC_TIMEOUT_MS = 90_000;

// ── Singleton ─────────────────────────────────────────────────────

let instance: ConsciousnessHeartbeat | null = null;

class ConsciousnessHeartbeat {
  private timer: ReturnType<typeof setInterval> | null = null;
  private broadcastFn: BroadcastFn | null = null;
  private logger: Logger;
  private intervalMs: number;
  private lastSyncAt: number | null = null;
  private tickInFlight = false;

  constructor(logger: Logger, intervalMs?: number) {
    this.logger = logger;
    this.intervalMs = intervalMs ?? DEFAULT_INTERVAL_MS;
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  start(): void {
    if (this.timer) return; // already running
    this.logger.info(
      `[Consciousness] Heartbeat started (${Math.round(this.intervalMs / 60_000)}-min interval)`,
    );
    // Run first tick after a short delay so gateway_start completes first
    setTimeout(() => void this.tick(), 15_000);
    this.timer = setInterval(() => void this.tick(), this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.logger.info("[Consciousness] Heartbeat stopped");
    }
  }

  get running(): boolean {
    return this.timer !== null;
  }

  get lastSync(): number | null {
    return this.lastSyncAt;
  }

  // ── Tick ─────────────────────────────────────────────────────────

  private async tick(): Promise<void> {
    if (this.tickInFlight) {
      this.logger.info("[Consciousness] Skipping tick — previous still running");
      return;
    }
    this.tickInFlight = true;

    try {
      // Check script availability
      if (!existsSync(CONSCIOUSNESS_SCRIPT)) {
        this.logger.warn("[Consciousness] Heartbeat tick skipped — consciousness-sync.sh not found");
        return;
      }
      try {
        accessSync(CONSCIOUSNESS_SCRIPT, fsConstants.R_OK | fsConstants.X_OK);
      } catch {
        this.logger.warn("[Consciousness] Heartbeat tick skipped — script not readable/executable");
        return;
      }

      // Broadcast syncing status
      this.broadcast("consciousness:status", { status: "syncing", source: "heartbeat" });

      const { stdout, stderr } = await this.runScript();

      // Parse step statuses (same as manual flush handler)
      const harvestOk = stdout.includes("Session harvest complete");
      const harvestFailed =
        stdout.includes("Session harvest failed") || stderr.includes("Session harvest failed");
      const steps = {
        harvest: harvestOk ? "ok" : harvestFailed ? "failed" : "skipped",
        clawvault: stdout.includes("ClawVault reflect complete") ? "ok" : "skipped",
        sessionReflect: stdout.includes("ClawVault session reflect complete") ? "ok" : "skipped",
        heartbeat: stdout.includes("CONSCIOUSNESS.md updated") ? "ok" : "failed",
      };

      // Read the regenerated file
      let lineCount = 0;
      try {
        const content = readFileSync(CONSCIOUSNESS_FILE, "utf8");
        lineCount = content.split("\n").length;
      } catch {
        // File may not exist yet
      }

      this.lastSyncAt = Date.now();
      const updatedAt = new Date().toISOString();

      // Broadcast success
      this.broadcast("consciousness:status", {
        status: "ok",
        source: "heartbeat",
        lineCount,
        updatedAt,
        steps,
      });

      this.logger.info(
        `[Consciousness] Heartbeat tick complete — ${lineCount} lines ` +
          `(harvest: ${steps.harvest}, vault: ${steps.clawvault}, heartbeat: ${steps.heartbeat})`,
      );

      // Fire-and-forget: sync Claude Code sessions into agent-log
      syncClaudeCodeSessions().catch(() => {});
    } catch (err) {
      this.logger.error(`[Consciousness] Heartbeat tick error: ${String(err)}`);
      this.broadcast("consciousness:status", {
        status: "error",
        source: "heartbeat",
        message: String(err),
      });
    } finally {
      this.tickInFlight = false;
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────

  private runScript(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const childEnv = { ...process.env, HOME: process.env.HOME } as Record<
        string,
        string | undefined
      >;
      delete childEnv.CLAUDECODE;

      nodeExec(
        `bash "${CONSCIOUSNESS_SCRIPT}"`,
        { timeout: EXEC_TIMEOUT_MS, env: childEnv },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(`Script failed: ${stderr || err.message}`));
            return;
          }
          resolve({ stdout, stderr });
        },
      );
    });
  }

  private broadcast(event: string, payload: unknown): void {
    if (!this.broadcastFn) return;
    try {
      this.broadcastFn(event, payload, { dropIfSlow: true });
    } catch {
      // Broadcast is best-effort
    }
  }
}

// ── Public API ────────────────────────────────────────────────────

export function initConsciousnessHeartbeat(logger: Logger, intervalMs?: number): void {
  if (!instance) {
    instance = new ConsciousnessHeartbeat(logger, intervalMs);
  }
}

export function getConsciousnessHeartbeat(): ConsciousnessHeartbeat | null {
  return instance;
}

export function startConsciousnessHeartbeat(): void {
  instance?.start();
}

export function stopConsciousnessHeartbeat(): void {
  instance?.stop();
}

export function setConsciousnessHeartbeatBroadcast(fn: BroadcastFn): void {
  instance?.setBroadcast(fn);
}
