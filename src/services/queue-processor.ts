/**
 * Queue Processor — Singleton service that spawns Claude agents for queue items.
 *
 * Picks pending items from ~/godmode/data/queue.json, builds type-specific prompts,
 * spawns detached Claude agents, and manages lifecycle (completion, retry, failure).
 * Coding tasks are excluded — they delegate to the coding orchestrator.
 */

import { spawn } from "node:child_process";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { GODMODE_ROOT, MEMORY_DIR, localDateString } from "../data-paths.js";
import { formatGuardrailsForPrompt } from "./guardrails.js";
import { resolveClaudeBin, buildSpawnArgs, isEngineAvailable } from "../lib/resolve-claude-bin.js";
import {
  readQueueState,
  updateQueueState,
  AGENT_ROLE_NAMES,
  type QueueItem,
  type QueueItemType,
} from "../lib/queue-state.js";
import { resolvePersona, formatHandoff } from "../lib/agent-roster.js";

// ── Prompt Templates ───────────────────────────────────────────────

const PROMPT_TEMPLATES: Record<QueueItemType, string> = {
  coding:
    "Implement this: {title}\n{description}\n\nCreate a branch, write the code, ensure it builds.",
  research:
    "Research this topic: {title}\n{description}\n\nWrite a structured report: Summary, Key Findings, Sources, Recommendations.",
  analysis:
    "Analyze this: {title}\n{description}\n\nProvide: Data Summary, Key Insights, Comparisons, Actionable Conclusions.",
  creative:
    "Create this content: {title}\n{description}\n\nWrite polished, publication-ready output. Include variations if appropriate.",
  review:
    "Review this: {title}\n{description}\n\nProvide: Summary, Issues Found, Recommendations, Severity Ratings.",
  ops:
    "Handle this operational task: {title}\n{description}\n\nExecute the task, document what was done and any follow-ups needed.",
  task:
    "Complete this task: {title}\n{description}\n\nDo whatever it takes to get this done. Show your work.",
  url:
    "Analyze this URL: {url}\n{title}\n{description}\n\nFetch the content, analyze it. Write: Source, Key Points, Relevance, Action Items.",
  idea:
    "Explore this idea: {title}\n{description}\n\nAnalyze feasibility, implementation approach, potential issues.",
};

// ── Singleton ──────────────────────────────────────────────────────

type Logger = {
  info(m: string): void;
  warn(m: string): void;
  error(m: string): void;
};
type BroadcastFn = (event: string, data: unknown) => void;

let instance: QueueProcessor | null = null;

export function getQueueProcessor(): QueueProcessor | null {
  return instance;
}

export function initQueueProcessor(logger: Logger): QueueProcessor {
  instance = new QueueProcessor(logger);
  return instance;
}

// ── Helpers ────────────────────────────────────────────────────────

const INBOX_DIR = path.join(MEMORY_DIR, "inbox");
const LEARNINGS_DIR = path.join(MEMORY_DIR, "learnings");
const CONSCIOUSNESS_FILE = path.join(MEMORY_DIR, "CONSCIOUSNESS.md");

function outputPathForItem(itemId: string): string {
  return path.join(INBOX_DIR, `${itemId}.md`);
}

function buildChildEnv(): Record<string, string> {
  const parentPath = process.env.PATH ?? "";
  const childEnv: Record<string, string> = {
    PATH: parentPath.includes("/opt/homebrew/bin")
      ? parentPath
      : `/opt/homebrew/bin:${parentPath}`,
    HOME: process.env.HOME ?? "",
    USER: process.env.USER ?? "",
    SHELL: process.env.SHELL ?? "/bin/zsh",
    LANG: process.env.LANG ?? "en_US.UTF-8",
    TERM: process.env.TERM ?? "xterm-256color",
  };
  if (process.env.ANTHROPIC_API_KEY) {
    childEnv.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  }
  return childEnv;
}

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// ── Queue Processor Class ──────────────────────────────────────────

const QUEUE_POLL_MS = 10 * 60 * 1000; // 10 minutes — faster than hourly heartbeat

class QueueProcessor {
  private logger: Logger;
  private broadcastFn: BroadcastFn | null = null;
  private maxParallel = 5;
  private activeCount = 0;
  private stopped = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  /** Start the fast queue polling loop (10-min cadence). */
  startPolling(): void {
    if (this.pollTimer) return;
    // Delay first poll by 30s to let gateway finish starting
    setTimeout(() => void this.pollTick(), 30_000);
    this.pollTimer = setInterval(() => void this.pollTick(), QUEUE_POLL_MS);
    this.logger.info("[GodMode][Queue] Fast polling started (10-min cadence)");
  }

  stop(): void {
    this.stopped = true;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async pollTick(): Promise<void> {
    if (this.stopped) return;
    try {
      // 1. Recover any orphaned processing items
      const { recovered } = await this.recoverOrphaned();
      // 2. Process any pending items
      const { spawned } = await this.processAllPending();
      if (recovered > 0 || spawned > 0) {
        this.logger.info(
          `[GodMode][Queue] Poll tick: recovered ${recovered}, spawned ${spawned}`,
        );
      }
    } catch (err) {
      this.logger.error(`[GodMode][Queue] Poll tick error: ${String(err)}`);
    }
  }

  // ── Process a single item ──────────────────────────────────────

  async processItem(
    item: QueueItem,
  ): Promise<{ spawned: boolean; error?: string; pid?: number }> {
    if (this.activeCount >= this.maxParallel || this.stopped) {
      return { spawned: false };
    }

    // Coding tasks are now processed as regular agent tasks
    // (Previously delegated to the coding orchestrator)

    // Autonomy gating — check trust level before spawning
    try {
      const { getAutonomyLevel } = await import("../lib/trust-tracker.js");
      const autonomy = await getAutonomyLevel(item.personaHint ?? item.type);
      if (autonomy === "supervised") {
        this.logger.info(
          `[GodMode][Queue] Skipping "${item.title}" — persona "${item.personaHint ?? item.type}" requires supervision`,
        );
        return { spawned: false, error: "Requires supervision — autonomy level too low" };
      }
    } catch {
      // Trust tracker not available — proceed (default: allow)
    }

    // Link a session to the source task so opening the task always hits the
    // same session — even before the agent finishes.
    if (item.sourceTaskId) {
      try {
        const { ensureTaskSession } = await import("../methods/tasks.js");
        await ensureTaskSession(item.sourceTaskId);
      } catch {
        // Non-fatal — session will be created on first open instead
      }
    }

    const prompt = await this.buildPromptForItem(item);

    // Resolve which engine to use: explicit on item > persona > default claude
    const persona = resolvePersona(item.type, item.personaHint);
    const engine = item.engine ?? persona?.engine ?? "claude";

    // Validate engine is available — fall back to claude if not
    const effectiveEngine = isEngineAvailable(engine) ? engine : "claude";
    if (effectiveEngine !== engine) {
      this.logger.warn(
        `[GodMode][Queue] Engine "${engine}" not available for "${item.title}", falling back to claude`,
      );
    }

    // Mark item as processing and store the prompt for later session context
    await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === item.id);
      if (qi) {
        qi.status = "processing";
        qi.startedAt = Date.now();
        qi.agentPrompt = prompt;
        qi.engine = effectiveEngine;
      }
    });

    const { bin: agentBin, args: agentArgs } = buildSpawnArgs(effectiveEngine, prompt);
    const env = buildChildEnv();

    // Codex needs OPENAI_API_KEY; Gemini needs GEMINI_API_KEY
    if (effectiveEngine === "codex" && process.env.OPENAI_API_KEY) {
      env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    }
    if (effectiveEngine === "gemini" && process.env.GEMINI_API_KEY) {
      env.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    }

    try {
      const child = spawn(agentBin, agentArgs, {
        cwd: os.homedir(),
        detached: true,
        stdio: "ignore",
        env,
      });

      const pid = child.pid;

      // Store PID in queue state for liveness checks
      if (pid) {
        updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) qi.pid = pid;
        }).catch(() => {});
      }

      child.on("exit", (code) => {
        this.logger.info(
          `[GodMode][Queue] Agent for item ${item.id} exited (code=${code})`,
        );
        this.handleItemCompleted(item.id, code).catch((err) => {
          this.logger.error(
            `[GodMode][Queue] handleItemCompleted error for ${item.id}: ${String(err)}`,
          );
        });
      });

      child.on("error", (err) => {
        this.logger.error(
          `[GodMode][Queue] Agent spawn error for item ${item.id}: ${String(err)}`,
        );
        this.handleItemFailed(item.id, `spawn error: ${String(err)}`).catch(
          () => {},
        );
      });

      child.unref();
      this.activeCount++;

      const roleName = persona?.name ?? AGENT_ROLE_NAMES[item.type] ?? "Agent";
      this.logger.info(
        `[GodMode][Queue] Spawned ${roleName} agent [${effectiveEngine}] for "${item.title}" (pid=${pid})`,
      );

      this.broadcast("queue:update", {
        itemId: item.id,
        status: "processing",
        engine: effectiveEngine,
      });

      return { spawned: true, pid: pid ?? undefined };
    } catch (err) {
      return { spawned: false, error: String(err) };
    }
  }

  // ── Completion handler ─────────────────────────────────────────

  async handleItemCompleted(
    itemId: string,
    exitCode: number | null,
  ): Promise<void> {
    this.activeCount = Math.max(0, this.activeCount - 1);

    if (exitCode !== 0) {
      await this.handleItemFailed(
        itemId,
        "Agent exited with code " + exitCode,
      );
      return;
    }

    const outPath = outputPathForItem(itemId);
    let summary = "";

    try {
      const content = await fs.readFile(outPath, "utf-8");
      // Extract first 3 non-empty lines for summary
      const lines = content
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .slice(0, 3);
      summary = lines.join(" ").slice(0, 500);
    } catch {
      summary = "Output file not found — agent may have completed without writing results.";
    }

    // Resolve persona name for the trust rating prompt
    const { state: queueState } = await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === itemId);
      if (qi) {
        qi.status = "review";
        qi.completedAt = Date.now();
        qi.result = { summary, outputPath: outPath };
      }
      return state;
    });

    const completedItem = queueState.items.find((i) => i.id === itemId);
    const personaSlug = completedItem?.personaHint;

    // Auto-approve for full-autonomy personas (skip manual review)
    if (personaSlug) {
      try {
        const { getAutonomyLevel } = await import("../lib/trust-tracker.js");
        const autonomy = await getAutonomyLevel(personaSlug);
        if (autonomy === "full") {
          await updateQueueState((state) => {
            const qi = state.items.find((i) => i.id === itemId);
            if (qi) qi.status = "done";
          });
          this.logger.info(
            `[GodMode][Queue] Item ${itemId} auto-approved (full autonomy for "${personaSlug}")`,
          );
          this.broadcast("queue:update", { itemId, status: "done" });
          return;
        }
      } catch {
        // Trust tracker not available — fall through to manual review
      }
    }

    this.logger.info(
      `[GodMode][Queue] Item ${itemId} completed — status set to review`,
    );
    this.broadcast("queue:update", {
      itemId,
      status: "review",
      personaHint: personaSlug,
      askTrustRating: !!personaSlug,
    });
  }

  // ── Failure + retry handler ────────────────────────────────────

  async handleItemFailed(itemId: string, errorMsg: string): Promise<void> {
    // Decrement only if we haven't already (e.g. from handleItemCompleted path)
    // We guard via max(0) so double-decrement is safe.
    this.activeCount = Math.max(0, this.activeCount - 1);

    const { state } = await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === itemId);
      if (qi) {
        qi.lastError = errorMsg;
        qi.retryCount = (qi.retryCount ?? 0) + 1;
      }
      return state;
    });

    const item = state.items.find((i) => i.id === itemId);
    if (!item) {
      this.logger.warn(
        `[GodMode][Queue] handleItemFailed: item ${itemId} not found in state`,
      );
      return;
    }

    if ((item.retryCount ?? 0) < 2) {
      // Spawn diagnostic agent to analyze failure and write improved prompt
      this.logger.info(
        `[GodMode][Queue] Item ${itemId} failed (attempt ${item.retryCount}) — spawning diagnostic agent`,
      );
      await this.spawnDiagnosticAgent(item, errorMsg);
    } else {
      // Max retries exceeded — mark as failed
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === itemId);
        if (qi) {
          qi.status = "failed";
          qi.error = errorMsg;
          qi.completedAt = Date.now();
        }
      });

      // Auto-rate the persona in trust tracker (permanent failure = poor performance)
      if (item.personaHint) {
        try {
          const { submitTrustRating } = await import("../methods/trust-tracker.js");
          await submitTrustRating(
            item.personaHint,
            3,
            `Failed after ${item.retryCount} retries: "${item.title}"`,
          );
        } catch {
          // Trust rating is best-effort
        }
      }

      this.logger.warn(
        `[GodMode][Queue] Item ${itemId} permanently failed after ${item.retryCount} retries: ${errorMsg}`,
      );
      this.broadcast("queue:update", { itemId, status: "failed" });
    }
  }

  // ── Diagnostic / retry agent ───────────────────────────────────

  private async spawnDiagnosticAgent(
    item: QueueItem,
    errorMsg: string,
  ): Promise<void> {
    const retryPromptPath = path.join(
      INBOX_DIR,
      `${item.id}-retry-prompt.md`,
    );
    const learningsIndex = path.join(LEARNINGS_DIR, "INDEX.md");

    const diagPrompt = [
      "A GodMode sub-agent failed. Analyze the error and write an improved prompt.",
      "",
      `Task: ${item.title}`,
      item.description ? `Description: ${item.description}` : "",
      `Type: ${item.type}`,
      `Error: ${errorMsg}`,
      "",
      `Write a one-line learning to ${learningsIndex} (append, create if needed).`,
      `Write an improved retry prompt to ${retryPromptPath}`,
      "The improved prompt should address the error and be more specific.",
    ]
      .filter(Boolean)
      .join("\n");

    // Diagnostic agents always use claude (meta-reasoning task)
    const { bin: diagBin, args: diagArgs } = buildSpawnArgs("claude", diagPrompt);
    const env = buildChildEnv();

    try {
      await fs.mkdir(INBOX_DIR, { recursive: true });
      await fs.mkdir(LEARNINGS_DIR, { recursive: true });

      const child = spawn(diagBin, diagArgs, {
        cwd: os.homedir(),
        detached: true,
        stdio: "ignore",
        env,
      });

      child.unref();

      child.on("exit", async (code) => {
        this.logger.info(
          `[GodMode][Queue] Diagnostic agent for ${item.id} exited (code=${code})`,
        );

        // Try to read improved prompt; fall back to original + error context
        let improvedContext = "";
        try {
          improvedContext = await fs.readFile(retryPromptPath, "utf-8");
        } catch {
          // Diagnostic agent failed to write prompt — append error context to description
          improvedContext = "";
        }

        // Reset item to pending for retry
        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) {
            qi.status = "pending";
            if (improvedContext.trim()) {
              qi.description =
                (qi.description ?? "") +
                "\n\n---\n[Retry context from diagnostic agent]:\n" +
                improvedContext.trim();
            } else {
              qi.description =
                (qi.description ?? "") +
                "\n\n---\n[Previous attempt failed]: " +
                errorMsg;
            }
          }
        });

        this.logger.info(
          `[GodMode][Queue] Item ${item.id} reset to pending for retry`,
        );
        this.broadcast("queue:update", { itemId: item.id, status: "pending" });
      });

      child.on("error", async (err) => {
        this.logger.error(
          `[GodMode][Queue] Diagnostic agent spawn error for ${item.id}: ${String(err)}`,
        );

        // Fall back: just reset to pending with error context
        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) {
            qi.status = "pending";
            qi.description =
              (qi.description ?? "") +
              "\n\n---\n[Previous attempt failed]: " +
              errorMsg;
          }
        });

        this.broadcast("queue:update", { itemId: item.id, status: "pending" });
      });
    } catch (err) {
      this.logger.error(
        `[GodMode][Queue] Failed to spawn diagnostic agent for ${item.id}: ${String(err)}`,
      );

      // Fall back: reset to pending
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === item.id);
        if (qi) {
          qi.status = "pending";
          qi.description =
            (qi.description ?? "") +
            "\n\n---\n[Previous attempt failed]: " +
            errorMsg;
        }
      });
    }
  }

  // ── Batch process all pending ──────────────────────────────────

  async processAllPending(): Promise<{ spawned: number; skipped: number }> {
    const state = await readQueueState();

    // Sort by priority (high first), then by createdAt (oldest first)
    const priorityOrder: Record<string, number> = {
      high: 0,
      normal: 1,
      low: 2,
    };

    const pending = state.items
      .filter((i) => i.status === "pending")
      .sort((a, b) => {
        const pa = priorityOrder[a.priority] ?? 1;
        const pb = priorityOrder[b.priority] ?? 1;
        if (pa !== pb) return pa - pb;
        return a.createdAt - b.createdAt;
      });

    const slotsAvailable = this.maxParallel - this.activeCount;
    let spawned = 0;
    let skipped = 0;

    for (const item of pending) {
      if (spawned >= slotsAvailable) {
        skipped++;
        continue;
      }

      const result = await this.processItem(item);
      if (result.spawned) {
        spawned++;
      } else {
        skipped++;
      }
    }

    return { spawned, skipped };
  }

  // ── Recover orphaned processing items ──────────────────────────

  async recoverOrphaned(): Promise<{ recovered: number }> {
    let recovered = 0;

    await updateQueueState(async (state) => {
      for (const item of state.items) {
        if (item.status !== "processing") continue;

        // If PID is alive, skip — agent is still running
        if (item.pid && isPidAlive(item.pid)) continue;

        // PID is dead — check if output file exists (agent may have completed)
        const outPath = outputPathForItem(item.id);
        let outputExists = false;
        let summary = "";
        try {
          const content = await fs.readFile(outPath, "utf-8");
          if (content.trim().length > 0) {
            outputExists = true;
            const lines = content
              .split("\n")
              .filter((l) => l.trim().length > 0)
              .slice(0, 3);
            summary = lines.join(" ").slice(0, 500);
          }
        } catch {
          // Output file doesn't exist
        }

        if (outputExists) {
          // Agent completed but exit handler missed — mark as review
          item.status = "review";
          item.completedAt = Date.now();
          item.result = { summary, outputPath: outPath };
          item.pid = undefined;
          this.logger.info(
            `[GodMode][Queue] Recovered orphaned item ${item.id} — output found, set to review`,
          );
        } else {
          // No output — reset to pending for retry
          item.status = "pending";
          item.pid = undefined;
          item.startedAt = undefined;
          this.logger.info(
            `[GodMode][Queue] Recovered orphaned item ${item.id} — no output, reset to pending`,
          );
        }
        recovered++;
      }
    });

    if (recovered > 0) {
      this.logger.info(
        `[GodMode][Queue] Recovered ${recovered} orphaned processing items`,
      );
      this.broadcast("queue:update", { recovered });
    }

    return { recovered };
  }

  // ── Prompt builder ─────────────────────────────────────────────

  async buildPromptForItem(item: QueueItem): Promise<string> {
    const outPath = outputPathForItem(item.id);
    const persona = resolvePersona(item.type, item.personaHint);
    const roleName = persona?.name ?? AGENT_ROLE_NAMES[item.type] ?? "Agent";

    // Type-specific body
    let body = PROMPT_TEMPLATES[item.type] ?? PROMPT_TEMPLATES.task;
    body = body.replace("{title}", item.title);
    body = body.replace("{description}", item.description ?? "");
    body = body.replace("{url}", item.url ?? "");

    // Consciousness context (first 200 lines)
    let consciousnessContext = "";
    try {
      const raw = await fs.readFile(CONSCIOUSNESS_FILE, "utf-8");
      const lines = raw.split("\n").slice(0, 200);
      consciousnessContext = lines.join("\n");
    } catch {
      // CONSCIOUSNESS.md may not exist yet — non-fatal
    }

    // Guardrails context
    let guardrailsBlock = "";
    try {
      guardrailsBlock = await formatGuardrailsForPrompt();
    } catch {
      // Non-fatal — agent runs without guardrail awareness
    }

    // Build full prompt
    const sections: string[] = [
      `You are a GodMode ${roleName} agent. Complete the task below and write your full output to:`,
      outPath,
    ];

    // Inject roster persona instructions if available
    if (persona) {
      sections.push("", "## Your Role", "", persona.body);
    }

    sections.push(
      "",
      "## Safety Rules",
      "- Do NOT modify files outside ~/godmode/memory/inbox/.",
      "- Do NOT run destructive commands (rm -rf, git reset --hard).",
      "- Do NOT access sensitive config files (.env, openclaw.json, SSH keys).",
      "- Write your complete output to the path above as markdown.",
      "",
      "## Task",
      body,
    );

    // Inject handoff context from predecessor agent
    if (item.handoff) {
      sections.push("", formatHandoff(item.handoff));
    }

    if (consciousnessContext) {
      sections.push(
        "",
        "## Context (from CONSCIOUSNESS.md)",
        consciousnessContext,
      );
    }

    if (guardrailsBlock) {
      sections.push("", guardrailsBlock);
    }

    // Include previous error context for retries
    if (item.lastError) {
      sections.push(
        "",
        "## Previous Attempt Error",
        `The previous attempt failed with: ${item.lastError}`,
        "Please address this error in your approach.",
      );
    }

    sections.push(
      "",
      "## Output Instructions",
      `Write your complete results to: ${outPath}`,
      "",
      "Use this structure:",
      "```",
      "# [Task Title]",
      "",
      "## Summary",
      "[2-3 sentence overview of what was done and key findings]",
      "",
      "## What I Did",
      "[Step-by-step description of actions taken, tools used, research performed]",
      "",
      "## Key Findings / Results",
      "[The actual deliverable — findings, analysis, content, recommendations]",
      "",
      "## Open Questions",
      "[Anything unresolved, assumptions made, areas needing human input]",
      "",
      "## Suggested Next Steps",
      "[Actionable follow-ups for the human or next agent]",
      "```",
      "",
      "Be thorough but concise. The human reviewing this will continue the work in a chat session with this output as context.",
    );

    return sections.join("\n");
  }

  // ── Broadcast helper ───────────────────────────────────────────

  private broadcast(event: string, data: unknown): void {
    if (this.broadcastFn) {
      try {
        this.broadcastFn(event, data);
      } catch {
        // Best-effort broadcast
      }
    }
  }
}

// ── Task type classifier ──────────────────────────────────────────

function classifyTaskType(title: string): QueueItemType {
  const t = title.toLowerCase();

  // Order matters — more specific patterns first
  if (/\b(hook|webhook|setup|configure|install|automate|clean|organize|migrate|ops|infra|pipeline|cron|deploy)\b/i.test(t)) return "ops";
  if (/\b(build|implement|code|develop|create|fix|bug|refactor|ship|PR|pull request|merge|plugin)\b/i.test(t)) return "coding";
  if (/\b(research|investigate|look into|find out|compare|evaluate|benchmark|try)\b/i.test(t)) return "research";
  if (/\b(analy[sz]e|data|metrics|report|dashboard|numbers|statistics)\b/i.test(t)) return "analysis";
  if (/\b(write|copy|content|blog|email|draft|marketing|creative|design|brand)\b/i.test(t)) return "creative";
  if (/\b(review|audit|inspect|QA|validate)\b/i.test(t)) return "review";
  if (/\b(idea|brainstorm|explore|feasibility|prototype|concept|experiment)\b/i.test(t)) return "idea";
  if (/\bhttps?:\/\//i.test(t)) return "url";

  return "task";
}

// ── Auto-queue overdue tasks ───────────────────────────────────────

export async function autoQueueOverdueTasks(): Promise<{ queued: number }> {
  const { readTasks } = await import("../methods/tasks.js");

  const tasksData = await readTasks();
  const today = localDateString();
  let queued = 0;

  // Find pending tasks that are overdue or carry-over
  const overdue = tasksData.tasks.filter(
    (t) =>
      t.status === "pending" &&
      (t.carryOver === true || (t.dueDate != null && t.dueDate <= today)),
  );

  if (overdue.length === 0) return { queued: 0 };

  // Read current queue state and check for existing items (dedup by sourceTaskId)
  await updateQueueState((state) => {
    const existingSourceIds = new Set(
      state.items
        .filter((i) => i.sourceTaskId)
        .map((i) => i.sourceTaskId),
    );

    for (const task of overdue) {
      // Skip if already queued
      if (existingSourceIds.has(task.id)) continue;

      const id = `auto-${task.id}-${Date.now()}`;
      const taskType = classifyTaskType(task.title);
      const persona = resolvePersona(taskType);

      state.items.push({
        id,
        type: taskType,
        title: task.title,
        description: task.briefSection
          ? `From daily brief section: ${task.briefSection}`
          : undefined,
        priority:
          task.priority === "high"
            ? "high"
            : task.priority === "low"
              ? "low"
              : "normal",
        status: "pending",
        source: "proactive",
        sourceTaskId: task.id,
        personaHint: persona?.slug,
        createdAt: Date.now(),
      });

      queued++;
    }
  });

  return { queued };
}
