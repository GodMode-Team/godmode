/**
 * consciousness-heartbeat.ts — Consciousness sync service (every 15 min).
 *
 * Runs consciousness-sync.sh on a regular interval so that
 * CONSCIOUSNESS.md stays fresh across all sessions without manual
 * intervention.  Also syncs Claude Code sessions into the agent-log
 * on each tick (same fire-and-forget as the manual flush path).
 *
 * Singleton pattern matches focus-pulse-heartbeat.ts.
 */

import { exec as nodeExec } from "node:child_process";
import { accessSync, constants as fsConstants, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS, ensureVaultStructure } from "../lib/vault-paths.js";
import { syncClaudeCodeSessions } from "./claude-code-sync.js";
import { listRoster, setTrustScores } from "../lib/agent-roster.js";
import { readTrustState, computeTrustSummary } from "../methods/trust-tracker.js";

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

const DEFAULT_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
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

      // Append agent roster summary to CONSCIOUSNESS.md so Prosper sees the team
      await this.appendRosterContext().catch(() => {});

      // Fire-and-forget: mirror consciousness files to Obsidian vault
      this.mirrorToVault().catch(() => {});

      // Fire-and-forget: sync Claude Code sessions into agent-log
      syncClaudeCodeSessions().catch(() => {});

      // Fire-and-forget: auto-queue overdue tasks from tasks.json
      try {
        const { autoQueueOverdueTasks } = await import("./queue-processor.js");
        const queueResult = await autoQueueOverdueTasks();
        if (queueResult.queued > 0) {
          this.logger.info(`[Consciousness] Auto-queued ${queueResult.queued} overdue tasks`);
          try {
            this.broadcast("ally:notification", {
              type: "cron-result",
              summary: `Auto-queued ${queueResult.queued} overdue task${queueResult.queued === 1 ? "" : "s"} for processing.`,
            });
          } catch { /* broadcast non-fatal */ }
        }
      } catch { /* non-fatal */ }

      // Fire-and-forget: task maintenance (dedup + archival)
      try {
        const { runTaskMaintenance } = await import("../methods/tasks.js");
        runTaskMaintenance().catch(() => {});
      } catch { /* non-fatal */ }

      // Expire stale queue items
      try {
        const { expireStaleQueueItems } = await import("./queue-processor.js");
        await expireStaleQueueItems();
      } catch { /* Queue expiration non-fatal */ }

      // Fire-and-forget: process pending queue items
      try {
        const { getQueueProcessor } = await import("./queue-processor.js");
        const processor = getQueueProcessor();
        if (processor) {
          const result = await processor.processAllPending();
          if (result.spawned > 0) {
            this.logger.info(`[Consciousness] Queue processing: spawned ${result.spawned} agents`);
          }
        }
      } catch { /* non-fatal */ }

      // Fire-and-forget: organizational health sweep
      try {
        const { runOrganizationalSweep } = await import("./org-sweep.js");
        const sweepResult = await runOrganizationalSweep();
        if (sweepResult.actions > 0) {
          this.logger.info(
            `[Consciousness] Org sweep: ${sweepResult.actions} findings — ${sweepResult.warnings.slice(0, 3).join("; ")}`,
          );
          try {
            this.broadcast("ally:notification", {
              type: "cron-result",
              summary: `Org sweep: ${sweepResult.actions} finding${sweepResult.actions === 1 ? "" : "s"} — ${sweepResult.warnings.slice(0, 2).join("; ")}`,
            });
          } catch { /* broadcast non-fatal */ }
        }
      } catch { /* non-fatal */ }

      // Fire-and-forget: vault auto-capture pipelines (zero-discipline Second Brain)
      try {
        const { runAllCapturePipelines } = await import("./vault-capture.js");
        const captureResult = await runAllCapturePipelines(this.logger);
        if (captureResult.totalCaptured > 0 || captureResult.totalProcessed > 0) {
          this.logger.info(
            `[Consciousness] Vault capture: ${captureResult.totalCaptured} captured, ${captureResult.totalProcessed} processed`,
          );
          this.broadcast("secondBrain:capture", {
            captured: captureResult.totalCaptured,
            processed: captureResult.totalProcessed,
            scout: captureResult.scout.captured,
            sessions: captureResult.sessions.captured,
            inbox: captureResult.inbox.processed,
            summarized: captureResult.summarization.summarized,
          });
          try {
            this.broadcast("ally:notification", {
              type: "cron-result",
              summary: `Vault capture: ${captureResult.totalCaptured} captured, ${captureResult.totalProcessed} processed into Second Brain.`,
            });
          } catch { /* broadcast non-fatal */ }
        }
      } catch { /* non-fatal */ }

      // Auto-generate daily brief if it doesn't exist yet for today
      try {
        const { existsSync } = await import("node:fs");
        const { join } = await import("node:path");
        const { resolveVaultPath, DAILY_FOLDER, localDateString } = await import("../data-paths.js");
        const vault = resolveVaultPath();
        const today = localDateString();
        if (vault) {
          const dailyPath = join(vault, DAILY_FOLDER, `${today}.md`);
          const fileExists = existsSync(dailyPath);
          // Generate if file doesn't exist, or if it only has Agent Sessions (minimal stub)
          let needsGeneration = !fileExists;
          if (fileExists && !needsGeneration) {
            const { readFile } = await import("node:fs/promises");
            const content = await readFile(dailyPath, "utf-8");
            // If the file has no ## Win The Day or ## Chief Aim, it's a stub
            needsGeneration = !content.includes("## Win The Day") && !content.includes("## Chief Aim");
          }
          if (needsGeneration) {
            const { resolveAnthropicAuth } = await import("../methods/brief-generator.js");
            // Only auto-generate if we have LLM auth (avoid creating a template-only brief)
            if (resolveAnthropicAuth()) {
              const { generateDailyBrief } = await import("../methods/brief-generator.js");
              this.logger.info("[Consciousness] Auto-generating daily brief (not yet created today)");
              const result = await generateDailyBrief();
              this.logger.info(`[Consciousness] Daily brief generated: ${result.sections.length} sections`);
              try {
                this.broadcast("ally:notification", {
                  type: "cron-result",
                  summary: `Daily brief generated — ${result.sections.length} sections. Check your vault.`,
                });
              } catch { /* broadcast non-fatal */ }
            }
          }
        }
      } catch (briefErr) {
        this.logger.error(`[Consciousness] Brief auto-gen failed: ${String(briefErr)}`);
      }
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

  /**
   * Append a "Your Team" section to CONSCIOUSNESS.md so Prosper (and all agents)
   * know which roster personas are available and can route tasks accordingly.
   * Replaces any existing "## Your Team" section to avoid duplication.
   */
  private async appendRosterContext(): Promise<void> {
    if (!existsSync(CONSCIOUSNESS_FILE)) return;

    const roster = listRoster();
    if (roster.length === 0) return;

    // Load trust scores for each persona and update the in-memory cache
    const trustSummaries: Map<string, { score: number | null; trend: string; count: number }> = new Map();
    try {
      const trustState = await readTrustState();
      const summaries = computeTrustSummary(trustState);
      const scoreCache = new Map<string, number>();
      for (const s of summaries) {
        trustSummaries.set(s.workflow, { score: s.trustScore, trend: s.trend, count: s.count });
        if (s.trustScore !== null) {
          scoreCache.set(s.workflow, s.trustScore);
        }
      }
      // Populate the agent-roster trust cache so resolvePersona can prefer higher-trust agents
      setTrustScores(scoreCache);
    } catch {
      // Trust data unavailable — show roster without scores
    }

    // Build the team summary block
    const lines = [
      "",
      "## Your Team (Agent Roster)",
      "",
      "You have the following specialized agents available. When creating or queuing tasks,",
      "assign them to the right persona using the `persona` parameter on `queue_add`.",
      "Each persona runs on a specific engine (claude/codex/gemini). Use the `engine` param to override.",
      "Prefer agents with higher trust scores for important work.",
      "",
    ];

    // Group by category
    const byCategory = new Map<string, typeof roster>();
    for (const p of roster) {
      const cat = p.category === "_default" || p.category === "_defaults" ? "General" : p.category;
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(p);
    }

    for (const [cat, personas] of byCategory) {
      lines.push(`### ${cat.replace(/^./, (c) => c.toUpperCase())}`);
      for (const p of personas) {
        const types = p.taskTypes.length > 0 ? ` (${p.taskTypes.join(", ")})` : "";
        const trust = trustSummaries.get(p.slug);
        let trustLabel = "";
        if (trust?.score !== null && trust?.score !== undefined) {
          const trendIcon = trust.trend === "improving" ? " ^" : trust.trend === "declining" ? " v" : "";
          trustLabel = ` — trust: ${trust.score}/10${trendIcon}`;
        } else if (trust && trust.count > 0) {
          trustLabel = ` — ${trust.count} ratings (building trust)`;
        }
        const engineLabel = p.engine ? ` [${p.engine}]` : "";
        lines.push(`- **${p.name}** (\`${p.slug}\`)${engineLabel}${types}${trustLabel}`);
      }
      lines.push("");
    }

    const rosterBlock = lines.join("\n");

    // Read current consciousness, strip any existing roster section, append fresh one
    try {
      let content = readFileSync(CONSCIOUSNESS_FILE, "utf-8");
      // Remove existing "## Your Team" section (everything from that header to next ## or EOF)
      content = content.replace(/\n## Your Team \(Agent Roster\)\n[\s\S]*?(?=\n## |\n$|$)/, "");
      // Append fresh roster block
      content = content.trimEnd() + "\n" + rosterBlock;
      // Write back (sync — this runs in the heartbeat tick, not hot path)
      writeFileSync(CONSCIOUSNESS_FILE, content, "utf-8");
    } catch {
      // Non-fatal — consciousness file may be temporarily locked
    }
  }

  /** Copy CONSCIOUSNESS.md and WORKING.md into the vault's 99-System/ folder. */
  private async mirrorToVault(): Promise<void> {
    const vault = getVaultPath();
    if (!vault) return;

    const systemDir = join(vault, VAULT_FOLDERS.system);
    if (!existsSync(systemDir)) {
      ensureVaultStructure();
    }

    const pairs = [
      { src: CONSCIOUSNESS_FILE, dest: join(systemDir, "CONSCIOUSNESS.md") },
      { src: join(MEMORY_DIR, "WORKING.md"), dest: join(systemDir, "WORKING.md") },
    ];

    for (const { src, dest } of pairs) {
      if (existsSync(src)) {
        try {
          await copyFile(src, dest);
        } catch {
          // Non-fatal — vault might be read-only temporarily
        }
      }
    }
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
