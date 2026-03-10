/**
 * consciousness-heartbeat.ts — Background heartbeat service (every 15 min).
 *
 * Generates the lean awareness snapshot, auto-generates the daily brief,
 * processes queued work, and runs vault-capture pipelines.
 *
 * Singleton pattern.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR, localDateString, DAILY_FOLDER, resolveVaultPath } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS, ensureVaultStructure, resolveConsciousnessPath } from "../lib/vault-paths.js";

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

const DEFAULT_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

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
      // Broadcast syncing status
      this.broadcast("consciousness:status", { status: "syncing", source: "heartbeat" });

      // 1. Generate awareness snapshot (replaces CONSCIOUSNESS.md + WORKING.md)
      try {
        const { generateSnapshot } = await import("../lib/awareness-snapshot.js");
        await generateSnapshot();
        this.logger.info("[Consciousness] Awareness snapshot regenerated");
      } catch (err) {
        this.logger.warn(`[Consciousness] Snapshot generation failed: ${String(err)}`);
      }

      // Mirror awareness snapshot to vault 99-System/
      this.mirrorToVault().catch(() => {});

      // Process Mem0 memory retry queue (failed ingestions from conversation turns)
      try {
        const { processRetryQueue } = await import("../lib/memory.js");
        const retried = await processRetryQueue();
        if (retried > 0) {
          this.logger.info(`[Consciousness] Mem0 retry queue: processed ${retried} item(s)`);
        }
      } catch { /* Memory retry non-fatal */ }

      // Identity graph maintenance — prune stale orphan entities
      try {
        const { isGraphReady, pruneStaleEntities } = await import("../lib/identity-graph.js");
        if (isGraphReady()) {
          const pruned = pruneStaleEntities();
          if (pruned > 0) {
            this.logger.info(`[Consciousness] Identity graph: pruned ${pruned} stale entities`);
          }
        }
      } catch { /* non-fatal */ }

      this.lastSyncAt = Date.now();
      this.broadcast("consciousness:status", {
        status: "ok",
        source: "heartbeat",
        updatedAt: new Date().toISOString(),
      });

      // 2. Auto-generate daily brief if it doesn't exist yet for today.
      // Once-per-day guard: write a flag file after generation to prevent repeated regeneration
      // that risks overwriting user-edited notes. The `dailyBrief.generate` RPC bypasses this guard.
      try {
        const vault = resolveVaultPath();
        const today = localDateString();
        const briefFlagFile = join(DATA_DIR, `brief-generated-${today}.flag`);
        const briefAlreadyGenerated = existsSync(briefFlagFile);

        if (vault && !briefAlreadyGenerated) {
          const dailyPath = join(vault, DAILY_FOLDER, `${today}.md`);
          const fileExists = existsSync(dailyPath);
          // Generate if file doesn't exist, or if it only has Agent Sessions (minimal stub)
          let needsGeneration = !fileExists;
          if (fileExists && !needsGeneration) {
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
              // Write the flag file to prevent re-generation on subsequent ticks
              try {
                mkdirSync(DATA_DIR, { recursive: true });
                writeFileSync(briefFlagFile, new Date().toISOString(), "utf-8");
              } catch { /* flag write non-fatal */ }
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

      // 2b. Check for cron/exec failures and broadcast notifications
      try {
        const { scanForFailures, formatFailureNotification } = await import("./failure-notify.js");
        const failures = await scanForFailures();
        if (failures.hasNewFailures) {
          const notification = formatFailureNotification(failures);
          if (notification) {
            this.logger.warn(`[Consciousness] ${notification}`);
            this.broadcast("ally:notification", {
              type: "failure-alert",
              summary: notification,
              cronErrors: failures.cronErrors,
            });
          }
        }
      } catch (err) {
        this.logger.warn(`[Consciousness] Failure detection failed: ${String(err)}`);
      }

      // 3. Process cron skills
      try {
        await this.processCronSkills();
      } catch (err) {
        this.logger.warn(`[Consciousness] Cron skills processing failed: ${String(err)}`);
      }

      // 3b. Append task dashboard to CONSCIOUSNESS.md
      await this.appendTaskDashboard().catch(() => {});

      // 4. Auto-queue overdue tasks from tasks.json
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

      // 5. Task maintenance (dedup + archival)
      try {
        const { runTaskMaintenance } = await import("../methods/tasks.js");
        runTaskMaintenance().catch(() => {});
      } catch { /* non-fatal */ }

      // 6. Expire stale queue items
      try {
        const { expireStaleQueueItems } = await import("./queue-processor.js");
        await expireStaleQueueItems();
      } catch { /* Queue expiration non-fatal */ }

      // 7. Process pending queue items
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

      // 7. Clean up expired private sessions
      try {
        const { cleanupExpiredPrivateSessions } = await import("../lib/private-session.js");
        const cleaned = await cleanupExpiredPrivateSessions();
        if (cleaned > 0) {
          this.logger.info(`[Consciousness] Cleaned up ${cleaned} expired private session(s)`);
        }
      } catch { /* non-fatal */ }

      // 8. Vault auto-capture pipelines (Sessions→Daily, Queue→Inbox)
      try {
        const { runAllCapturePipelines } = await import("./vault-capture.js");
        const captureResult = await runAllCapturePipelines(this.logger);
        if (captureResult.totalCaptured > 0) {
          this.logger.info(
            `[Consciousness] Vault capture: ${captureResult.totalCaptured} captured`,
          );
          this.broadcast("secondBrain:capture", {
            captured: captureResult.totalCaptured,
            sessions: captureResult.sessions.captured,
          });
        }
      } catch { /* non-fatal */ }

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

  /** Process cron-triggered skills — create queue items for skills whose schedule fires. */
  private async processCronSkills(): Promise<void> {
    const { getCronSkills, parseSchedule, readSkillRuns, saveSkillRuns } = await import(
      "../lib/skills-registry.js"
    );
    const cronSkills = getCronSkills();
    if (cronSkills.length === 0) return;

    const runState = await readSkillRuns();
    const now = new Date();
    let queued = 0;

    for (const skill of cronSkills) {
      if (!skill.schedule) continue;
      const parsed = parseSchedule(skill.schedule);
      if (!parsed) {
        this.logger.warn(`[Consciousness] Invalid schedule for skill "${skill.slug}": ${skill.schedule}`);
        continue;
      }

      const lastRun = runState.lastRuns[skill.slug] ?? 0;
      if (!parsed.shouldRun(now, lastRun)) continue;

      // Create a queue item for this skill
      try {
        const { updateQueueState, newQueueItemId } = await import("../lib/queue-state.js");
        const { result: wasQueued } = await updateQueueState((state) => {
          // Dedup: don't re-queue if a pending/processing item already exists for this skill
          const existing = state.items.find(
            (i) =>
              (i.status === "pending" || i.status === "processing") &&
              i.title === `[Cron] ${skill.name}`,
          );
          if (existing) return false;

          state.items.push({
            id: newQueueItemId(skill.name),
            type: skill.taskType,
            title: `[Cron] ${skill.name}`,
            description: skill.body || undefined,
            priority: skill.priority,
            status: "pending",
            source: "cron",
            personaHint: skill.persona || undefined,
            createdAt: Date.now(),
          });
          return true;
        });

        if (wasQueued) {
          runState.lastRuns[skill.slug] = Date.now();
          queued++;
          this.logger.info(`[Consciousness] Cron skill fired: ${skill.name}`);
        }
      } catch (err) {
        this.logger.warn(`[Consciousness] Failed to queue cron skill "${skill.slug}": ${String(err)}`);
      }
    }

    if (queued > 0) {
      await saveSkillRuns(runState);
      this.broadcast("ally:notification", {
        type: "cron-result",
        summary: `${queued} cron skill${queued === 1 ? "" : "s"} fired and queued for processing.`,
      });
    }
  }

  /**
   * Append a "Task Pulse" section to CONSCIOUSNESS.md showing pending/completed
   * task counts and top-priority items. Replaces any existing section.
   */
  private async appendTaskDashboard(): Promise<void> {
    const consciousnessFile = resolveConsciousnessPath().path;
    if (!existsSync(consciousnessFile)) return;

    const { readTasks } = await import("../methods/tasks.js");
    const { localDateString } = await import("../data-paths.js");
    const data = await readTasks();
    const today = localDateString();

    const allTasks = data.tasks;
    const archived = data.archived ?? [];

    const pending = allTasks.filter((t) => t.status === "pending");
    const completedToday = allTasks.filter(
      (t) => t.status === "complete" && t.completedAt && t.completedAt.slice(0, 10) === today,
    );
    const total = allTasks.length;

    // Top 3 pending by priority then due date
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    const topPending = [...pending]
      .sort((a, b) => {
        const pa = priorityOrder[a.priority] ?? 1;
        const pb = priorityOrder[b.priority] ?? 1;
        if (pa !== pb) return pa - pb;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return a.createdAt.localeCompare(b.createdAt);
      })
      .slice(0, 3);

    // Recently completed (from active + archived), sorted by completedAt desc, top 3
    const allCompleted = [
      ...allTasks.filter((t) => t.status === "complete" && t.completedAt),
      ...archived.filter((t) => t.status === "complete" && t.completedAt),
    ]
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
      .slice(0, 3);

    // Build section
    const lines = [
      "",
      "## Task Pulse",
      "",
      `**${pending.length} pending** · ${completedToday.length} completed today · ${total} total`,
      "",
    ];

    if (topPending.length > 0) {
      lines.push("### Top Priority");
      for (const t of topPending) {
        const due = t.dueDate ? `due: ${t.dueDate}, ` : "";
        lines.push(`- [ ] ${t.title} (${due}${t.priority})`);
      }
      lines.push("");
    }

    if (allCompleted.length > 0) {
      lines.push("### Recently Completed");
      for (const t of allCompleted) {
        const date = t.completedAt ? t.completedAt.slice(0, 10) : "unknown";
        lines.push(`- [x] ${t.title} (completed: ${date})`);
      }
      lines.push("");
    }

    const dashboardBlock = lines.join("\n");

    try {
      let content = readFileSync(consciousnessFile, "utf-8");
      // Remove existing Task Pulse section
      content = content.replace(/\n## Task Pulse\n[\s\S]*?(?=\n## |\n$|$)/, "");
      content = content.trimEnd() + "\n" + dashboardBlock;
      writeFileSync(consciousnessFile, content, "utf-8");
    } catch {
      // Non-fatal
    }
  }

  /** Copy awareness snapshot into the vault's 99-System/ folder. */
  private async mirrorToVault(): Promise<void> {
    const vault = getVaultPath();
    if (!vault) return;

    const systemDir = join(vault, VAULT_FOLDERS.system);
    if (!existsSync(systemDir)) {
      ensureVaultStructure();
    }

    const snapshotSrc = join(DATA_DIR, "awareness-snapshot.md");
    if (existsSync(snapshotSrc)) {
      try {
        await copyFile(snapshotSrc, join(systemDir, "awareness-snapshot.md"));
      } catch {
        // Non-fatal — vault might be read-only temporarily
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
