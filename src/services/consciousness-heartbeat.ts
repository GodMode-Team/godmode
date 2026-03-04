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
import { accessSync, constants as fsConstants, existsSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR, DATA_DIR, localDateString, DAILY_FOLDER, resolveVaultPath } from "../data-paths.js";
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
      // Broadcast syncing status
      this.broadcast("consciousness:status", { status: "syncing", source: "heartbeat" });

      // Try the external script first for backward compat; fall back to native regeneration
      let steps: Record<string, string> = {};
      let scriptWorked = false;

      if (existsSync(CONSCIOUSNESS_SCRIPT)) {
        try {
          accessSync(CONSCIOUSNESS_SCRIPT, fsConstants.R_OK | fsConstants.X_OK);
          const { stdout, stderr } = await this.runScript();
          const harvestOk = stdout.includes("Session harvest complete");
          const harvestFailed =
            stdout.includes("Session harvest failed") || stderr.includes("Session harvest failed");
          steps = {
            harvest: harvestOk ? "ok" : harvestFailed ? "failed" : "skipped",
            clawvault: stdout.includes("ClawVault reflect complete") ? "ok" : "skipped",
            sessionReflect: stdout.includes("ClawVault session reflect complete") ? "ok" : "skipped",
            heartbeat: stdout.includes("CONSCIOUSNESS.md updated") ? "ok" : "failed",
          };
          scriptWorked = true;
        } catch {
          this.logger.warn("[Consciousness] External script failed — falling back to native regeneration");
        }
      }

      if (!scriptWorked) {
        // Native regeneration — no external script dependency
        await this.regenerateConsciousness();
        await this.regenerateWorking();
        steps = { heartbeat: "ok", working: "ok" };
      }

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
          `(heartbeat: ${steps.heartbeat})`,
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

      // Auto-generate daily brief if it doesn't exist yet for today.
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

  // ── Native Consciousness Regeneration ────────────────────────────

  /**
   * Regenerate CONSCIOUSNESS.md directly (no external script dependency).
   * Assembles current schedule, tasks, daily brief status, and session harvest
   * into a fresh consciousness snapshot.
   */
  private async regenerateConsciousness(): Promise<void> {
    const now = new Date();
    const lines: string[] = [];
    const today = localDateString();

    lines.push(`# Consciousness — ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`);
    lines.push("");

    // Schedule today
    try {
      const { fetchCalendarEvents } = await import("../methods/brief-generator.js");
      const cal = await fetchCalendarEvents();
      if (cal.events.length > 0) {
        lines.push("## Schedule Today");
        lines.push("");
        for (const ev of cal.events) {
          const start = new Date(ev.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          const end = ev.endTime ? new Date(ev.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
          lines.push(`- ${start}${end ? "–" + end : ""}: ${ev.title}`);
        }
      } else {
        lines.push("## Schedule Today");
        lines.push("");
        lines.push("_No meetings scheduled._");
      }
    } catch {
      lines.push("## Schedule Today");
      lines.push("");
      lines.push("_Calendar unavailable._");
    }
    lines.push("");

    // Tasks summary
    try {
      const { readTasks } = await import("../methods/tasks.js");
      const data = await readTasks();
      const pending = data.tasks.filter((t: { status: string }) => t.status === "pending");
      const overdue = pending.filter((t: { dueDate: string | null }) => t.dueDate != null && t.dueDate <= today);
      const completed = data.tasks.filter((t: { status: string }) => t.status === "complete");
      lines.push("## Tasks");
      lines.push("");
      lines.push(`- ${overdue.length} overdue, ${pending.length} pending, ${completed.length} completed`);
      if (overdue.length > 0) {
        lines.push(`- Overdue: ${overdue.map((t: { title: string }) => t.title).join(", ")}`);
      }
      if (pending.length > 0) {
        const topPending = pending.slice(0, 5);
        lines.push(`- Next up: ${topPending.map((t: { title: string }) => t.title).join(", ")}`);
      }
    } catch {
      lines.push("## Tasks");
      lines.push("");
      lines.push("_Tasks unavailable._");
    }
    lines.push("");

    // Daily brief status
    lines.push("## Daily Brief");
    lines.push("");
    try {
      const vault = resolveVaultPath();
      if (vault) {
        const dailyPath = join(vault, DAILY_FOLDER, `${today}.md`);
        if (existsSync(dailyPath)) {
          const stat = statSync(dailyPath);
          const modTime = stat.mtime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          lines.push(`- Today's brief exists (last modified: ${modTime})`);
          // Extract Win The Day section for quick context
          try {
            const briefContent = readFileSync(dailyPath, "utf-8");
            const wtdMatch = briefContent.match(/## Win The Day\s*\n([\s\S]*?)(?=\n---|\n## )/);
            if (wtdMatch?.[1]) {
              const priorities = wtdMatch[1].trim().split("\n").filter((l: string) => l.match(/^\d+\.\s/)).slice(0, 3);
              if (priorities.length > 0) {
                lines.push("- Top priorities:");
                for (const p of priorities) lines.push(`  ${p}`);
              }
            }
          } catch { /* non-fatal */ }
        } else {
          lines.push("- Today's brief has not been generated yet.");
        }
      } else {
        lines.push("- Vault not configured.");
      }
    } catch {
      lines.push("- Status check failed.");
    }
    lines.push("");

    // What's in progress (from WORKING.md)
    lines.push("## What's In Progress");
    lines.push("");
    try {
      const workingPath = join(MEMORY_DIR, "WORKING.md");
      if (existsSync(workingPath)) {
        const working = readFileSync(workingPath, "utf-8");
        // Extract current focus items (lines starting with - or * under first heading)
        const focusLines = working.split("\n")
          .filter((l: string) => l.match(/^[-*]\s/) || l.match(/^#+\s/))
          .slice(0, 10);
        if (focusLines.length > 0) {
          for (const l of focusLines) lines.push(l);
        } else {
          lines.push("_No active focus items._");
        }
      } else {
        lines.push("_WORKING.md not found._");
      }
    } catch {
      lines.push("_Could not read WORKING.md._");
    }
    lines.push("");

    // Recent session harvest
    lines.push("## Recent Session Harvest");
    lines.push("");
    try {
      const agentLogDir = join(MEMORY_DIR, "agent-log");
      if (existsSync(agentLogDir)) {
        // Read the most recent agent-log entries
        const { readdirSync } = await import("node:fs");
        const files = readdirSync(agentLogDir)
          .filter((f: string) => f.endsWith(".md"))
          .sort()
          .reverse()
          .slice(0, 3);
        if (files.length > 0) {
          for (const f of files) {
            try {
              const content = readFileSync(join(agentLogDir, f), "utf-8");
              const firstLine = content.split("\n").find((l: string) => l.trim().length > 0) || f;
              lines.push(`- ${firstLine.replace(/^#+\s*/, "")}`);
            } catch { /* skip unreadable */ }
          }
        } else {
          lines.push("_No recent agent sessions logged._");
        }
      } else {
        lines.push("_Agent log directory not found._");
      }
    } catch {
      lines.push("_Session harvest unavailable._");
    }
    lines.push("");

    // Timestamp
    lines.push("---");
    lines.push(`_Updated at ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} by GodMode consciousness heartbeat_`);

    // Write to CONSCIOUSNESS.md
    const content = lines.join("\n");
    try {
      mkdirSync(join(MEMORY_DIR), { recursive: true });
      writeFileSync(CONSCIOUSNESS_FILE, content, "utf-8");
    } catch (err) {
      this.logger.error(`[Consciousness] Failed to write CONSCIOUSNESS.md: ${String(err)}`);
    }
  }

  /**
   * Regenerate WORKING.md from the daily brief's Win The Day section
   * and in-progress tasks. Keeps it concise and current.
   */
  private async regenerateWorking(): Promise<void> {
    const now = new Date();
    const today = localDateString();
    const workingPath = join(MEMORY_DIR, "WORKING.md");
    const lines: string[] = [];

    lines.push(`# WORKING.md — ${now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`);
    lines.push("");
    lines.push("## Current Focus");
    lines.push("");

    // Pull from daily brief's Win The Day
    try {
      const vault = resolveVaultPath();
      if (vault) {
        const dailyPath = join(vault, DAILY_FOLDER, `${today}.md`);
        if (existsSync(dailyPath)) {
          const brief = readFileSync(dailyPath, "utf-8");
          const wtdMatch = brief.match(/## Win The Day\s*\n([\s\S]*?)(?=\n---|\n## )/);
          if (wtdMatch?.[1]) {
            const priorities = wtdMatch[1].trim().split("\n").filter((l: string) => l.trim().length > 0);
            for (const p of priorities.slice(0, 10)) lines.push(p);
            lines.push("");
          }
        }
      }
    } catch { /* non-fatal */ }

    // In-progress tasks
    try {
      const { readTasks } = await import("../methods/tasks.js");
      const data = await readTasks();
      const pending = data.tasks.filter((t: { status: string }) => t.status === "pending");
      if (pending.length > 0) {
        lines.push("## Pending Tasks");
        lines.push("");
        for (const t of pending.slice(0, 15)) {
          const due = (t as { dueDate?: string | null }).dueDate ? ` (due: ${(t as { dueDate: string }).dueDate})` : "";
          lines.push(`- ${t.title}${due}`);
        }
        lines.push("");
      }
    } catch { /* non-fatal */ }

    // Preserve any user-authored sections from existing WORKING.md
    try {
      if (existsSync(workingPath)) {
        const existing = readFileSync(workingPath, "utf-8");
        // Look for user sections: ## Decisions, ## Open Questions, ## Blockers
        const userSections = ["## Decisions", "## Open Questions", "## Blockers", "## Notes"];
        for (const header of userSections) {
          const idx = existing.indexOf(header);
          if (idx >= 0) {
            const afterHeader = existing.slice(idx);
            const nextHeader = afterHeader.indexOf("\n## ", 1);
            const sectionContent = nextHeader > 0
              ? afterHeader.slice(0, nextHeader)
              : afterHeader;
            if (sectionContent.trim().split("\n").length > 1) {
              lines.push(sectionContent.trimEnd());
              lines.push("");
            }
          }
        }
      }
    } catch { /* non-fatal */ }

    lines.push("---");
    lines.push(`_Auto-updated at ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} by consciousness heartbeat_`);

    try {
      mkdirSync(join(MEMORY_DIR), { recursive: true });
      writeFileSync(workingPath, lines.join("\n"), "utf-8");
    } catch (err) {
      this.logger.error(`[Consciousness] Failed to write WORKING.md: ${String(err)}`);
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
