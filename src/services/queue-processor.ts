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
import { GODMODE_ROOT, MEMORY_DIR, DATA_DIR, localDateString } from "../data-paths.js";
import { resolveAnthropicKey } from "../lib/anthropic-auth.js";
import { resolveProviderConfig } from "../lib/provider-config.js";
import {
  QUEUE_POLL_MS as QUEUE_POLL_MS_CONST,
  AGENT_TIMEOUT_MS as AGENT_TIMEOUT_MS_CONST,
  CIRCUIT_BREAKER_THRESHOLD as CB_THRESHOLD,
  CIRCUIT_BREAKER_COOLDOWN_MS as CB_COOLDOWN,
  RETRY_BASE_DELAY_MS, RETRY_MAX_DELAY_MS,
  QUEUE_MAX_RETRIES,
} from "../lib/constants.js";
import { formatGuardrailsForPrompt } from "./guardrails.js";
import { resolveClaudeBin, buildSpawnArgs, isEngineAvailable } from "../lib/resolve-claude-bin.js";
import crypto from "node:crypto";
import {
  readQueueState,
  updateQueueState,
  AGENT_ROLE_NAMES,
  type QueueItem,
  type QueueItemType,
  type HitlCheckpoint,
  type HitlAction,
} from "../lib/queue-state.js";
import { audit } from "../lib/audit-log.js";
import { sanitizeForPrompt } from "../lib/prompt-sanitizer.js";
import { resolvePersona, formatHandoff } from "../lib/agent-roster.js";
import { resolveIdentityDir, getVaultPath, VAULT_FOLDERS } from "../lib/vault-paths.js";
import {
  checkEvidence as checkEvidenceShared,
  extractArtifacts as extractArtifactsShared,
  type EvidenceResult as SharedEvidenceResult,
} from "../lib/evidence.js";
import { reportConnected, reportDegraded } from "../lib/service-health.js";
import { notifySession } from "../lib/session-notifier.js";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ── Prompt Templates ───────────────────────────────────────────────

const PROMPT_TEMPLATES: Record<QueueItemType, string> = {
  coding:
    "Implement this: {title}\n\n{description}\n\nFollow the Coding Methodology above. End with: ## Results — what changed, what was verified, what the user should know.",
  research:
    "Research this: {title}\n\n{description}\n\nFollow the Research Methodology above. End with: ## Sources — all URLs referenced.",
  analysis:
    "Analyze this: {title}\n\n{description}\n\nFollow the Research Methodology above. Focus on: Data Summary, Key Insights, Comparisons, Actionable Conclusions.",
  creative:
    "Create this content: {title}\n\n{description}\n\nFollow the Creative Methodology above. Include variations if appropriate.",
  review:
    "Review this: {title}\n\n{description}\n\nFollow the Review Methodology above. Lead with verdict, then issues by severity.",
  ops:
    "Handle this operational task: {title}\n\n{description}\n\nFollow the base methodology. Document what was done and any follow-ups needed.",
  task:
    "Complete this: {title}\n\n{description}\n\nFollow the base methodology. Show your work. Include confidence levels for each finding.",
  url:
    "Analyze this URL: {url}\n\n{title}\n\n{description}\n\nFollow the Research Methodology above. Write: Source, Key Points, Relevance, Action Items.",
  idea:
    "Explore this idea: {title}\n\n{description}\n\nFollow the Planning Methodology above. Explore 2-3 approaches before recommending one.",
  optimize:
    "Optimize this skill/persona: {title}\n{description}\n\nFollow the AutoResearch protocol:\n1. Read the current skill/persona markdown file\n2. Generate 3-6 yes/no eval criteria from the stored trust feedback\n3. Run baseline evaluation against the criteria\n4. Make ONE targeted mutation to the markdown (clarity, examples, constraints)\n5. Test the mutation against eval criteria\n6. If improved, keep. If worse or equal, revert.\n7. Repeat up to 4 rounds.\n\nNEVER modify: name, role, core traits, communication style.\nONLY modify: instructions, examples, constraints, workflow steps.\n\nWrite results as: ## Optimization Results\n- Baseline score: X%\n- Final score: Y%\n- Rounds: N\n- Changes made: (list each kept mutation)\n- Evaluation log: (per-round scores)",
};

// ── Methodology Mapping ──────────────────────────────────────────
// Maps queue item types to methodology files in assets/methodologies/
const METHODOLOGY_MAP: Record<QueueItemType, string> = {
  coding: "coding.md",
  research: "research.md",
  analysis: "research.md",
  creative: "creative.md",
  review: "review.md",
  ops: "base.md",
  task: "base.md",
  url: "research.md",
  idea: "planning.md",
  optimize: "review.md",
};

/** Load methodology markdown from assets/methodologies/ */
async function loadMethodology(itemType: QueueItemType): Promise<string> {
  const fileName = METHODOLOGY_MAP[itemType] ?? "base.md";
  try {
    const { fileURLToPath } = await import("node:url");
    const thisFile = fileURLToPath(import.meta.url);
    const assetsDir = path.resolve(path.dirname(thisFile), "..", "..", "assets", "methodologies");
    const base = await fs.readFile(path.join(assetsDir, "base.md"), "utf-8");
    if (fileName === "base.md") return base;
    const specific = await fs.readFile(path.join(assetsDir, fileName), "utf-8");
    return base + "\n\n" + specific;
  } catch {
    return ""; // methodology files missing — non-fatal
  }
}

// ── Singleton ──────────────────────────────────────────────────────

import type { Logger } from "../types/plugin-api.js";
type BroadcastFn = (event: string, data: unknown) => void;

let instance: QueueProcessor | null = null;

export function getQueueProcessor(): QueueProcessor | null {
  return instance;
}

export function initQueueProcessor(logger: Logger): QueueProcessor {
  instance = new QueueProcessor(logger);
  if (!resolveProviderConfig().apiKey) {
    logger.warn(
      "[QueueProcessor] No AI provider key found — agent tasks will fail until a key is configured. " +
      "Set ANTHROPIC_API_KEY or VENICE_API_KEY in your environment or add it to ~/godmode/.env",
    );
  }
  return instance;
}

// ── Helpers ────────────────────────────────────────────────────────

const INBOX_DIR = path.join(MEMORY_DIR, "inbox");
const LEARNINGS_DIR = path.join(MEMORY_DIR, "learnings");
const AGENT_LOGS_DIR = path.join(DATA_DIR, "agent-logs");

/** Cache for pre-flight binary checks — avoids re-running on every spawn */
const _preflightCache: Map<string, boolean> = new Map();
function outputPathForItem(itemId: string): string {
  return path.join(INBOX_DIR, `${itemId}.md`);
}

/**
 * Resolve Anthropic API key for spawned agents.
 * Resolution order: env var → godmode .env → OpenClaw .env → OpenClaw auth-profiles (OAuth token).
 * Mirrors the resolution chain in brief-generator.ts so agents authenticate consistently.
 */
/** Resolve Anthropic key — delegates to canonical resolver in anthropic-auth.ts */
function resolveAnthropicKeyForAgents(): string | null {
  return resolveAnthropicKey();
}

function buildQueueChildEnv(): Record<string, string> {
  // Use the shared child-env builder (handles PATH, API key forwarding, Venice env)
  const { buildChildEnv } = require("../lib/child-env.js") as typeof import("../lib/child-env.js");
  const childEnv = buildChildEnv();

  // Also resolve Anthropic key from all sources (OAuth, .env files)
  const anthropicKey = resolveAnthropicKeyForAgents();
  if (anthropicKey && !childEnv.ANTHROPIC_API_KEY) {
    childEnv.ANTHROPIC_API_KEY = anthropicKey;
  }

  // Forward XDG dirs so Claude CLI can find its config in non-interactive contexts
  if (process.env.XDG_CONFIG_HOME) {
    childEnv.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME;
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

// ── Evidence Verification Gates ─────────────────────────────────────
// Delegates to shared evidence module (src/lib/evidence.ts).
// Local wrappers preserve the string[] artifact format used downstream.

type EvidenceResult = {
  passed: boolean;
  reason: string;
  hint: string;
};

function checkEvidence(taskType: QueueItemType, output: string): EvidenceResult {
  const result = checkEvidenceShared(taskType as import("../lib/evidence.js").TaskType, output);
  return { passed: result.passed, reason: result.reason, hint: result.hint };
}

function extractArtifacts(content: string): string[] {
  return extractArtifactsShared(content).map((a) => a.value);
}

// ── Queue Processor Class ──────────────────────────────────────────

const QUEUE_POLL_MS = QUEUE_POLL_MS_CONST;
const AGENT_TIMEOUT_MS = AGENT_TIMEOUT_MS_CONST;

// ── Circuit Breaker ─────────────────────────────────────────────
//
// If an engine fails CIRCUIT_BREAKER_THRESHOLD times consecutively,
// pause it for CIRCUIT_BREAKER_COOLDOWN_MS. Prevents burning credits
// when an engine is down or misconfigured.

const CIRCUIT_BREAKER_THRESHOLD = CB_THRESHOLD;
const CIRCUIT_BREAKER_COOLDOWN_MS = CB_COOLDOWN;

interface CircuitState {
  consecutiveFailures: number;
  pausedUntil: number; // epoch ms, 0 = not paused
}

class QueueProcessor {
  private logger: Logger;
  private broadcastFn: BroadcastFn | null = null;
  private pluginApi: OpenClawPluginApi | null = null;
  private maxParallel = 5;
  private activeCount = 0;
  private stopped = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  /** Toolkit tokens issued to agents — keyed by item ID for revocation on completion */
  private toolkitTokens = new Map<string, string>();
  /** Circuit breaker state per engine */
  private circuitBreakers = new Map<string, CircuitState>();
  /** Active HITL checkpoints awaiting user response — keyed by checkpoint ID */
  private hitlCheckpoints = new Map<string, HitlCheckpoint>();

  constructor(logger: Logger) {
    this.logger = logger;
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  setApi(api: OpenClawPluginApi): void {
    this.pluginApi = api;
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

  /** Check if the polling loop is active. Used by self-heal. */
  isPolling(): boolean {
    return this.pollTimer !== null && !this.stopped;
  }

  // ── HITL checkpoint response handler ────────────────────────────

  /** Handle a user's response to a HITL checkpoint. */
  async respondToHitlCheckpoint(
    checkpointId: string,
    action: HitlAction,
    modifiedInstructions?: string,
  ): Promise<{ ok: boolean; error?: string }> {
    const checkpoint = this.hitlCheckpoints.get(checkpointId);
    if (!checkpoint) {
      return { ok: false, error: `Checkpoint "${checkpointId}" not found or already resolved` };
    }

    this.hitlCheckpoints.delete(checkpointId);
    const { queueItemId } = checkpoint;

    if (action === "abort") {
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === queueItemId);
        if (qi) {
          qi.status = "failed";
          qi.error = "Aborted by user at HITL checkpoint";
          qi.completedAt = Date.now();
        }
      });
      this.broadcast("queue:update", { itemId: queueItemId, status: "failed" });
      this.broadcast("ally:notification", {
        type: "hitl-aborted",
        title: checkpoint.agentName,
        summary: `"${checkpoint.agentName}" task aborted at checkpoint.`,
      });
      this.logger.info(`[GodMode][Queue] HITL checkpoint "${checkpointId}" — user aborted`);
      return { ok: true };
    }

    if (action === "modify" && modifiedInstructions) {
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === queueItemId);
        if (qi) {
          qi.description = (qi.description ?? "") + `\n\n---\n[User modification]: ${modifiedInstructions}`;
          qi.status = "pending";
          qi.needsApproval = false; // Don't re-gate after modification
        }
      });
      this.broadcast("queue:update", { itemId: queueItemId, status: "pending" });
      this.logger.info(`[GodMode][Queue] HITL checkpoint "${checkpointId}" — user modified instructions, re-queued`);
      // Trigger immediate processing
      void this.processAllPending();
      return { ok: true };
    }

    // action === "continue"
    await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === queueItemId);
      if (qi) {
        qi.status = "pending";
        qi.needsApproval = false; // Clear the gate so it proceeds
      }
    });
    this.broadcast("queue:update", { itemId: queueItemId, status: "pending" });
    this.logger.info(`[GodMode][Queue] HITL checkpoint "${checkpointId}" — user approved, resuming`);
    // Trigger immediate processing
    void this.processAllPending();
    return { ok: true };
  }

  /** Get all active HITL checkpoints (for UI polling). */
  getActiveHitlCheckpoints(): HitlCheckpoint[] {
    return Array.from(this.hitlCheckpoints.values());
  }

  /** Check if an engine's circuit breaker is open (paused). */
  private isEngineCircuitOpen(engine: string): boolean {
    const state = this.circuitBreakers.get(engine);
    if (!state) return false;
    if (state.pausedUntil > Date.now()) return true;
    // Cooldown expired — reset
    if (state.pausedUntil > 0) {
      state.pausedUntil = 0;
      state.consecutiveFailures = 0;
      this.logger.info(`[GodMode][Queue] Circuit breaker reset for engine "${engine}"`);
    }
    return false;
  }

  /** Record a failure for an engine. Trips the breaker after N consecutive failures. */
  private recordEngineFailure(engine: string): void {
    const state = this.circuitBreakers.get(engine) ?? { consecutiveFailures: 0, pausedUntil: 0 };
    state.consecutiveFailures++;
    if (state.consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
      state.pausedUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
      this.logger.warn(
        `[GodMode][Queue] Circuit breaker OPEN for engine "${engine}" — ${state.consecutiveFailures} consecutive failures. Paused for ${CIRCUIT_BREAKER_COOLDOWN_MS / 60000}min.`,
      );
      this.broadcast("ally:notification", {
        type: "circuit-breaker",
        title: `Engine "${engine}" paused`,
        summary: `Engine "${engine}" failed ${state.consecutiveFailures} times in a row. Paused for ${CIRCUIT_BREAKER_COOLDOWN_MS / 60000} minutes.`,
      });
    }
    this.circuitBreakers.set(engine, state);
  }

  /** Record a success for an engine. Resets its circuit breaker. */
  private recordEngineSuccess(engine: string): void {
    const state = this.circuitBreakers.get(engine);
    if (state && state.consecutiveFailures > 0) {
      state.consecutiveFailures = 0;
      state.pausedUntil = 0;
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
      const { getAutonomyLevel } = await import("../methods/trust-tracker.js");
      const autonomy = await getAutonomyLevel(item.personaHint ?? item.type);
      if (autonomy === "disabled") {
        this.logger.info(
          `[GodMode][Queue] Blocking "${item.title}" — persona "${item.personaHint ?? item.type}" trust score too low (disabled)`,
        );
        return { spawned: false, error: "Blocked — trust score too low (disabled)" };
      }
      // "approval" and "full" both allow spawning; the difference is in
      // post-completion handling (auto-approve vs manual review)
    } catch {
      reportDegraded("queue", "Trust tracker unavailable during queue dispatch");
    }

    // HITL gate — if item requires approval, broadcast a checkpoint and pause
    if (item.needsApproval) {
      const persona = resolvePersona(item.type, item.personaHint);
      const agentName = persona?.name ?? AGENT_ROLE_NAMES[item.type] ?? "Agent";
      const checkpoint: HitlCheckpoint = {
        id: crypto.randomUUID(),
        queueItemId: item.id,
        agentName,
        stage: "pre-execution",
        summary: `${agentName} is ready to start "${item.title}". Approve to proceed.`,
        options: [
          { label: "Continue", action: "continue" },
          { label: "Modify Instructions", action: "modify" },
          { label: "Abort", action: "abort" },
        ],
        timestamp: Date.now(),
      };
      this.hitlCheckpoints.set(checkpoint.id, checkpoint);

      // Set item to hitl-pending so it won't be re-picked by the poll loop
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === item.id);
        if (qi) qi.status = "hitl-pending";
      });

      this.broadcast("hitl:checkpoint", checkpoint);
      this.logger.info(
        `[GodMode][Queue] HITL checkpoint "${checkpoint.id}" created for "${item.title}" — awaiting user response`,
      );
      return { spawned: false };
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

    // Resolve which engine to use: explicit on item > persona > provider default
    const persona = resolvePersona(item.type, item.personaHint);
    const { isVeniceProvider } = await import("../lib/provider-config.js");
    const defaultEngine = isVeniceProvider() ? "hermes" : "claude";
    const engine = item.engine ?? persona?.engine ?? defaultEngine;

    // Validate engine is available — fall back to claude if not
    const effectiveEngine = isEngineAvailable(engine) ? engine : "claude";
    if (effectiveEngine !== engine) {
      this.logger.warn(
        `[GodMode][Queue] Engine "${engine}" not available for "${item.title}", falling back to claude`,
      );
    }

    // Mark item as processing and store the prompt for later session context.
    // Re-check status is still "pending" to prevent TOCTOU race when multiple
    // callers (heartbeat + poll) invoke processAllPending concurrently.
    let claimed = false;
    await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === item.id);
      if (qi && qi.status === "pending") {
        qi.status = "processing";
        qi.startedAt = Date.now();
        qi.agentPrompt = prompt;
        qi.engine = effectiveEngine;
        claimed = true;
      }
    });

    if (!claimed) {
      this.logger.info(`[GodMode][Queue] Item "${item.title}" already claimed, skipping`);
      return { spawned: false };
    }

    const { bin: agentBin, args: agentArgs } = buildSpawnArgs(effectiveEngine, prompt, {
      model: item.model,
      maxBudgetUsd: item.type === "coding" ? 10 : 5,
    });
    const env = buildQueueChildEnv();

    // Codex needs OPENAI_API_KEY; Gemini needs GEMINI_API_KEY
    if (effectiveEngine === "codex" && process.env.OPENAI_API_KEY) {
      env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    }
    if (effectiveEngine === "gemini" && process.env.GEMINI_API_KEY) {
      env.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    }

    // Issue a toolkit token so the spawned agent can access GodMode knowledge systems
    try {
      const { createAgentToken } = await import("./agent-toolkit-server.js");
      const tokenResult = createAgentToken({
        agentId: item.personaHint ?? item.id,
        workspaceId: item.workspaceId,
        permissions: ["read"],
      });
      if (tokenResult) {
        this.toolkitTokens.set(item.id, tokenResult.token);
        env.GODMODE_TOOLKIT_TOKEN = tokenResult.token;
        env.GODMODE_TOOLKIT_URL = tokenResult.baseUrl;
      }
    } catch (e) { this.logger.warn(`[GodMode][Queue] Toolkit token creation failed: ${(e as Error).message}`); }

    // Ensure agent logs directory exists
    try { await fs.mkdir(AGENT_LOGS_DIR, { recursive: true }); } catch { /* ok */ }

    // Create log file for agent stdout/stderr — critical for debugging failures
    const logPath = path.join(AGENT_LOGS_DIR, `${item.id}.log`);
    let logFd: import("node:fs/promises").FileHandle | null = null;
    try { logFd = await fs.open(logPath, "a"); } catch { /* fallback to ignore */ }

    try {
      const child = spawn(agentBin, agentArgs, {
        cwd: os.homedir(),
        detached: true,
        stdio: logFd ? ["ignore", logFd.fd, logFd.fd] : "ignore",
        env,
      });

      const pid = child.pid;
      audit("agent.spawn", {
        itemId: item.id,
        title: item.title,
        type: item.type,
        engine: item.engine ?? "claude",
        pid,
        persona: item.personaHint ?? "default",
      });

      // Store PID in queue state for liveness checks
      if (pid) {
        updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) qi.pid = pid;
        }).catch(() => {
          // Retry once after 500ms — PID is critical for orphan detection
          setTimeout(() => {
            updateQueueState((state) => {
              const qi = state.items.find((i) => i.id === item.id);
              if (qi) qi.pid = pid;
            }).catch((err) => {
              this.logger.warn(`[GodMode][Queue] PID write failed for ${item.id}: ${String(err)}`);
            });
          }, 500);
        });
      }

      // Set a timeout to kill long-running agents
      let exited = false;

      // Intermediate liveness check — verify process is still alive at 10min and 20min
      const livenessChecks = [10, 20].map((min) =>
        setTimeout(() => {
          if (exited || !pid) return;
          try {
            process.kill(pid, 0); // Signal 0 = check if alive without killing
            this.logger.info(`[GodMode][Queue] Agent for ${item.id} still alive at ${min}min (pid=${pid})`);
          } catch {
            this.logger.warn(`[GodMode][Queue] Agent for ${item.id} appears dead at ${min}min — pid ${pid} unreachable`);
            this.broadcast("ally:notification", {
              type: "agent-stall",
              title: item.title,
              summary: `Agent working on "${item.title}" may be stuck (${min}min, process unreachable).`,
            });
          }
        }, min * 60_000),
      );

      const killTimer = setTimeout(() => {
        if (!exited && pid) {
          this.logger.warn(
            `[GodMode][Queue] Agent for item ${item.id} timed out after ${AGENT_TIMEOUT_MS / 60000}min — killing pid ${pid}`,
          );
          try {
            process.kill(-pid, "SIGTERM"); // Kill process group (detached)
          } catch {
            try {
              process.kill(pid, "SIGKILL"); // Fallback: kill individual process
            } catch {
              // Process already dead
            }
          }
        }
      }, AGENT_TIMEOUT_MS);

      child.on("exit", (code) => {
        exited = true;
        clearTimeout(killTimer);
        livenessChecks.forEach(clearTimeout);
        // Close the log file handle
        if (logFd) logFd.close().catch(() => {});
        audit(code === 0 ? "agent.complete" : "agent.fail", {
          itemId: item.id,
          title: item.title,
          exitCode: code,
          pid,
        });
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
        exited = true;
        clearTimeout(killTimer);
        livenessChecks.forEach(clearTimeout);
        if (logFd) logFd.close().catch(() => {});
        this.logger.error(
          `[GodMode][Queue] Agent spawn error for item ${item.id}: ${String(err)}`,
        );
        this.handleItemFailed(item.id, `spawn error: ${String(err)}`).catch(
          (failErr) => {
            this.logger.error(`[GodMode][Queue] handleItemFailed also failed for ${item.id}: ${String(failErr)}`);
          },
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

  // Evidence verification now handled by standalone checkEvidence() function above

  // ── Completion handler ─────────────────────────────────────────

  /** Revoke any toolkit token issued for this agent */
  private revokeToolkitTokenForItem(itemId: string): void {
    const token = this.toolkitTokens.get(itemId);
    if (!token) return;
    this.toolkitTokens.delete(itemId);
    import("./agent-toolkit-server.js")
      .then(({ revokeAgentToken }) => revokeAgentToken(token))
      .catch((err) => {
        this.logger.warn(`[GodMode][Queue] Token revocation failed for ${itemId}: ${String(err)}`);
      });
  }

  async handleItemCompleted(
    itemId: string,
    exitCode: number | null,
  ): Promise<void> {
    this.activeCount = Math.max(0, this.activeCount - 1);
    this.revokeToolkitTokenForItem(itemId);

    if (exitCode !== 0) {
      // Pass skipDecrement=true since we already decremented above
      await this.handleItemFailed(
        itemId,
        "Agent exited with code " + exitCode,
        true, // activeCount already decremented above
      );
      return;
    }

    // Record success for circuit breaker (only on exitCode 0)
    const successState = await readQueueState();
    const successItem = successState.items.find((i) => i.id === itemId);
    if (successItem) {
      this.recordEngineSuccess(successItem.engine ?? "claude");
    }

    const outPath = outputPathForItem(itemId);
    let summary = "";
    let outputContent = "";
    let artifacts: string[] = [];

    const currentState = successState;
    const currentItem = successItem;

    try {
      outputContent = await fs.readFile(outPath, "utf-8");
      // Extract first 3 non-empty lines for summary
      const lines = outputContent
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .slice(0, 3);
      summary = lines.join(" ").slice(0, 500);
      artifacts = extractArtifacts(outputContent);
    } catch {
      reportDegraded("queue", "Agent output file missing after completion");
      summary = "Output file not found — agent may have completed without writing results.";
    }

    // Retrieve the item's type for evidence checking
    const itemType = currentItem?.type ?? "task";

    // Evidence check: verify output contains expected artifacts for this task type
    const evidenceResult = checkEvidence(itemType, outputContent);
    if (!evidenceResult.passed && outputContent.length > 0) {
      const retryCount = currentItem?.retryCount ?? 0;
      if (retryCount === 0) {
        // First failure: re-queue with evidence instruction appended
        this.logger.info(
          `[GodMode][Queue] Item ${itemId} evidence check failed (${evidenceResult.reason}) — retrying with guidance`,
        );
        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === itemId);
          if (qi) {
            qi.status = "pending";
            qi.retryCount = 1;
            qi.lastError = `Evidence check failed: ${evidenceResult.reason}`;
            qi.description =
              (qi.description ?? "") +
              `\n\n---\n[Evidence check failed]: ${evidenceResult.reason}\n` +
              `Please ensure your output includes: ${evidenceResult.hint}`;
          }
        });
        this.broadcast("queue:update", { itemId, status: "pending" });
        return;
      }
      // Already retried — proceed to review with a warning
      summary = `[Evidence warning: ${evidenceResult.reason}] ${summary}`;
    }

    // Resolve persona name for the trust rating prompt
    const { state: queueState } = await updateQueueState((state) => {
      const qi = state.items.find((i) => i.id === itemId);
      if (qi) {
        qi.status = "review";
        qi.completedAt = Date.now();
        qi.result = {
          summary,
          outputPath: outPath,
        };
        qi.artifacts = artifacts;
      }
      return state;
    });

    const completedItem = queueState.items.find((i) => i.id === itemId);
    const personaSlug = completedItem?.personaHint;

    // Push to universal inbox BEFORE any early returns (coding gate, auto-approve)
    const projectId = completedItem?.meta?.projectId ?? completedItem?.meta?.paperclipProjectId;
    try {
      const { addInboxItem, shouldInbox } = await import("./inbox.js");
      let trustScore: number | null = null;
      if (personaSlug) {
        try {
          const { getTrustScore } = await import("../methods/trust-tracker.js");
          trustScore = await getTrustScore(personaSlug);
        } catch { /* trust tracker unavailable — conservative: null → will inbox */ }
      }

      const shouldAdd = shouldInbox({
        type: "agent-execution",
        queueItemType: completedItem?.type,
        personaSlug,
        trustScore,
      });

      if (shouldAdd) {
        await addInboxItem({
          type: "agent-execution",
          title: completedItem?.title ?? itemId,
          summary: summary.slice(0, 300),
          source: {
            persona: personaSlug,
            queueItemId: itemId,
            taskId: completedItem?.sourceTaskId,
            projectId,
          },
          outputPath: outPath,
          sessionId: completedItem?.sessionId,
        });
      } else {
        this.logger.info(
          `[GodMode][Queue] Skipped inbox for ${itemId} (${personaSlug} trust=${trustScore}, type=${completedItem?.type})`,
        );
      }
    } catch (err) {
      this.logger.warn(`[GodMode][Queue] Inbox push failed for ${itemId}: ${String(err)}`);
    }

    // Artifact-required gate: ALL task types must produce evidence of work.
    // Coding tasks need a PR link or file path. Content/research/review tasks
    // need either artifacts OR substantial output (> 200 chars). An agent that
    // claims "done" with no artifact and no meaningful output gets flagged.
    if (completedItem) {
      let needsArtifactReview = false;

      if (completedItem.type === "coding") {
        const hasPrLink = artifacts.some((a) => a.includes("/pull/"));
        const hasFilePath = artifacts.some((a) => a.startsWith("/"));
        needsArtifactReview = !hasPrLink && !hasFilePath;
      } else {
        // Content, research, review, ops — need artifacts or meaningful output
        const hasArtifacts = artifacts.length > 0;
        const hasSubstantialOutput = outputContent.length > 200;
        needsArtifactReview = !hasArtifacts && !hasSubstantialOutput;
      }

      if (needsArtifactReview) {
        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === itemId);
          if (qi) {
            qi.status = "needs-review";
            qi.result = {
              ...qi.result!,
              summary: summary + "\n\n\u26A0\uFE0F No artifact provided \u2014 verify manually",
            };
          }
        });
        this.logger.info(
          `[GodMode][Queue] Item ${itemId} (${completedItem.type}) has no artifacts — set to needs-review`,
        );
        this.broadcast("queue:update", {
          itemId,
          status: "needs-review",
          personaHint: personaSlug,
        });

        // Notify Ally chat about the needs-review status
        try {
          this.broadcast("ally:notification", {
            type: "queue-needs-review",
            title: completedItem.title,
            summary: `Agent finished "${completedItem.title}" but provided no artifact — manual verification needed.`,
            outputPath: outPath,
            sessionKey: completedItem.sessionId ?? undefined,
            actions: [
              { label: "Review", action: "navigate", target: "today" },
            ],
          });
        } catch { /* broadcast non-fatal */ }
        return;
      }
    }

    // Auto-approve for full-autonomy personas (skip manual review)
    if (personaSlug) {
      try {
        const { getAutonomyLevel } = await import("../methods/trust-tracker.js");
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
        reportDegraded("queue", "Trust tracker unavailable for auto-approve check");
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

    // REMOVED (v2 slim): impact-ledger logging

    // Check for project-level completion (all sibling items in same project are terminal)
    if (projectId && await this.isMultiIssueProject(projectId)) {
      void this.checkProjectCompletion(projectId);
    }

    // Notify Ally chat so the user sees a notification in real-time
    try {
      const outputPreview = summary.length > 500 ? summary.slice(0, 500) + "…" : summary;
      this.broadcast("ally:notification", {
        type: "queue-complete",
        title: completedItem?.title ?? itemId,
        summary: `Agent finished "${completedItem?.title ?? itemId}" — ready for review.`,
        outputPreview,
        outputPath: outPath,
        sessionKey: completedItem?.sessionId ?? undefined,
        actions: [
          { label: "Review", action: "navigate", target: "today" },
          { label: "Approve", action: "rpc", method: "queue.approve", params: { id: itemId } },
        ],
      });
    } catch { /* broadcast non-fatal */ }

    // Push system event into the originating session so the agent proactively presents the deliverable
    if (this.pluginApi) {
      const sessionKey = completedItem?.sessionId;
      notifySession(
        this.pluginApi,
        sessionKey,
        `[Agent completed] "${completedItem?.title ?? itemId}" is ready for review. Output: ${outPath}`,
      );
    }
  }

  // ── Failure + retry handler ────────────────────────────────────

  /**
   * Calculate exponential backoff delay for retries.
   * Retry 1: 30s, Retry 2: 120s (2min), capped at 5min.
   */
  private retryDelayMs(retryCount: number): number {
    const BASE_DELAY = RETRY_BASE_DELAY_MS;
    const MAX_DELAY = RETRY_MAX_DELAY_MS;
    return Math.min(BASE_DELAY * Math.pow(2, retryCount), MAX_DELAY);
  }

  async handleItemFailed(itemId: string, errorMsg: string, skipDecrement = false): Promise<void> {
    if (!skipDecrement) {
      this.activeCount = Math.max(0, this.activeCount - 1);
    }
    this.revokeToolkitTokenForItem(itemId);

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

    // Record failure for circuit breaker
    this.recordEngineFailure(item.engine ?? "claude");

    // Engine fallback: if item used a non-claude engine, retry with claude
    if (item.engine && item.engine !== "claude" && (item.retryCount ?? 0) === 1) {
      this.logger.info(
        `[GodMode][Queue] Item ${itemId} failed on "${item.engine}" — falling back to claude`,
      );
      await updateQueueState((state) => {
        const qi = state.items.find((i) => i.id === itemId);
        if (qi) {
          qi.status = "pending";
          qi.engine = "claude";
        }
      });
      this.broadcast("queue:update", { itemId, status: "pending" });
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
          const { autoRate } = await import("../methods/trust-tracker.js");
          await autoRate(
            item.personaHint,
            3,
            `Failed after ${item.retryCount} retries: "${item.title}"`,
            "auto-failure",
          );
        } catch {
          // Trust rating is best-effort
        }
      }

      this.logger.warn(
        `[GodMode][Queue] Item ${itemId} permanently failed after ${item.retryCount} retries: ${errorMsg}`,
      );
      this.broadcast("queue:update", { itemId, status: "failed" });

      // Notify Ally chat about the failure
      try {
        this.broadcast("ally:notification", {
          type: "queue-failed",
          title: item.title,
          summary: `Agent failed on "${item.title}" after ${item.retryCount} retries.`,
          actions: [
            { label: "View", action: "navigate", target: "today" },
          ],
        });
      } catch { /* broadcast non-fatal */ }
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
    const env = buildQueueChildEnv();

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

        // Reset item to pending for retry with exponential backoff
        const retryCount = item.retryCount ?? 0;
        const delayMs = this.retryDelayMs(retryCount);
        const scheduledAt = Date.now() + delayMs;

        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) {
            qi.status = "pending";
            qi.scheduledAt = scheduledAt;
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
          `[GodMode][Queue] Item ${item.id} reset to pending for retry (backoff: ${Math.round(delayMs / 1000)}s)`,
        );
        this.broadcast("queue:update", { itemId: item.id, status: "pending" });
      });

      child.on("error", async (err) => {
        this.logger.error(
          `[GodMode][Queue] Diagnostic agent spawn error for ${item.id}: ${String(err)}`,
        );

        // Fall back: just reset to pending with error context + backoff
        const fbRetryCount = item.retryCount ?? 0;
        const fbDelayMs = this.retryDelayMs(fbRetryCount);
        await updateQueueState((state) => {
          const qi = state.items.find((i) => i.id === item.id);
          if (qi) {
            qi.status = "pending";
            qi.scheduledAt = Date.now() + fbDelayMs;
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

  // ── Helpers ──────────────────────────────────────────────────────

  /** Check if a project has more than one queue item */
  private async isMultiIssueProject(projectId: string): Promise<boolean> {
    const state = await readQueueState();
    const count = state.items.filter(
      (i) => (i.meta?.projectId ?? i.meta?.paperclipProjectId) === projectId,
    ).length;
    return count > 1;
  }

  /** Check if all items in a project are terminal — if so, fire project completion */
  private async checkProjectCompletion(projectId: string): Promise<void> {
    const state = await readQueueState();
    const projectItems = state.items.filter(
      (i) => (i.meta?.projectId ?? i.meta?.paperclipProjectId) === projectId,
    );
    if (projectItems.length === 0) return;

    const allTerminal = projectItems.every(
      (qi) => qi.status === "done" || qi.status === "review" || qi.status === "needs-review" || qi.status === "failed",
    );
    if (!allTerminal) return;

    // Mark project as completed in projects-state (idempotent — only fires once)
    let didTransition = false;
    let hasProjectRecord = false;
    try {
      const { updateProjects } = await import("../lib/projects-state.js");
      const { result } = await updateProjects((ps) => {
        const project = ps.projects.find(p => p.projectId === projectId);
        if (!project) return "no-record" as const;
        if (project.status === "active") {
          project.status = "completed";
          project.completedAt = Date.now();
          return "transitioned" as const;
        }
        return "already-done" as const;
      });
      hasProjectRecord = result !== "no-record";
      didTransition = result === "transitioned";
    } catch { /* projects-state not available */ }

    // Per-item inbox entries are already created in handleItemCompleted.
    // Here we only add the project-level completion summary.
    if (!hasProjectRecord) return;
    if (!didTransition) return;

    // Get project metadata for notifications
    let projectTitle = "";
    try {
      const { getProject } = await import("../lib/projects-state.js");
      const project = await getProject(projectId);
      if (project) {
        projectTitle = project.title;
      }
    } catch { /* best effort */ }

    if (!projectTitle) {
      projectTitle = projectItems[0]?.title ?? "Untitled Project";
    }

    this.logger.info(`[GodMode][Queue] Project "${projectTitle}" fully complete (${projectItems.length} tasks)`);

    // Build deliverables list
    const deliverables: Array<{ title: string; persona: string; summary?: string }> = [];
    for (const qi of projectItems) {
      deliverables.push({
        title: qi.title,
        persona: qi.personaHint ?? "unassigned",
        summary: qi.result?.summary?.slice(0, 200) ?? `Completed by ${qi.personaHint ?? "agent"}`,
      });
    }

    // Create cowork session seeded with project context
    let coworkSessionId: string | undefined;
    try {
      const { randomUUID } = await import("node:crypto");
      const { readFile: _, writeFile, mkdir } = await import("node:fs/promises");
      const { join } = await import("node:path");
      coworkSessionId = randomUUID();
      const sessionsDir = join(DATA_DIR, "sessions");
      await mkdir(sessionsDir, { recursive: true });

      const deliverablesList = deliverables
        .map((d, i) => `${i + 1}. **${d.title}** (${d.persona}): ${d.summary}`)
        .join("\n");

      const seedMessage = [
        `Project "${projectTitle}" is complete — all ${projectItems.length} deliverables are ready for review.`,
        "",
        "## Deliverables",
        deliverablesList,
        "",
        "Walk me through each deliverable. Highlight what's strong, flag anything that needs iteration, and let me score the overall project.",
      ].filter(Boolean).join("\n");

      const session = {
        id: coworkSessionId,
        title: `Review: ${projectTitle}`,
        messages: [{ role: "user", content: seedMessage, ts: Date.now() }],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        projectId,
      };
      await writeFile(
        join(sessionsDir, `${coworkSessionId}.json`),
        JSON.stringify(session, null, 2) + "\n",
      );
    } catch (err) {
      this.logger.warn(`[GodMode][Queue] Failed to create cowork session: ${String(err)}`);
    }

    // Create ONE project-level inbox item
    try {
      const { addInboxItem } = await import("./inbox.js");
      await addInboxItem({
        type: "project-completion",
        title: `Project Complete: ${projectTitle}`,
        summary: `All ${projectItems.length} tasks finished. Deliverables ready for review.`,
        source: { queueItemId: projectId },
        projectId,
        deliverables,
        coworkSessionId,
      });
    } catch (err) {
      this.logger.warn(`[GodMode][Queue] Project inbox push failed: ${String(err)}`);
    }

    // Broadcast notifications
    this.broadcast("ally:notification", {
      type: "project-complete",
      title: projectTitle,
      summary: `Project "${projectTitle}" is complete — ${projectItems.length} deliverables ready for review.`,
      projectId,
      coworkSessionId,
      actions: [
        { label: "Review in Chat", action: "cowork", target: coworkSessionId },
        { label: "View Deliverables", action: "navigate", target: "today" },
      ],
    });
    this.broadcast("inbox:update", {});
    this.broadcast("queue:update", { type: "project-complete", projectId });

    // Push system event into the originating session for proactive notification
    if (this.pluginApi) {
      // Resolve sessionKey from the project record
      let sessionKey: string | undefined;
      try {
        const { getProject } = await import("../lib/projects-state.js");
        const project = await getProject(projectId);
        sessionKey = project?.sessionKey;
      } catch { /* best effort */ }
      // Fall back to sessionId from any queue item in the project
      if (!sessionKey) {
        sessionKey = projectItems.find(qi => qi.sessionId)?.sessionId;
      }
      notifySession(
        this.pluginApi,
        sessionKey,
        `[Project complete] "${projectTitle}" — all ${projectItems.length} deliverables ready for review.`,
      );
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

    const now = Date.now();

    // Cap retries: mark items with too many retries as failed (prevents infinite loops)
    const MAX_RETRIES = QUEUE_MAX_RETRIES;
    for (const item of state.items) {
      if (item.status === "pending" && (item.retryCount ?? 0) >= MAX_RETRIES) {
        this.logger.warn(
          `[GodMode][Queue] Item "${item.title}" (${item.id}) exceeded max retries (${item.retryCount}) — marking as failed`,
        );
        item.status = "failed";
        item.error = `Exceeded maximum retry count (${MAX_RETRIES})`;
        item.completedAt = Date.now();
        this.broadcast("queue:update", { itemId: item.id, status: "failed" });
      }
    }

    const pending = state.items
      .filter((i) => i.status === "pending" && (!i.scheduledAt || i.scheduledAt <= now) && i.source !== "test")
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

      // QA stages are gated — don't start until all other project items are terminal
      const qaProjectId = item.meta?.projectId ?? item.meta?.paperclipProjectId;
      if (item.meta?.isQAStage && qaProjectId) {
        const projectItems = state.items.filter(
          (qi) =>
            (qi.meta?.projectId ?? qi.meta?.paperclipProjectId) === qaProjectId &&
            !qi.meta?.isQAStage,
        );
        const allTerminal = projectItems.length > 0 && projectItems.every(
          (qi) => qi.status === "done" || qi.status === "review" || qi.status === "needs-review" || qi.status === "failed",
        );
        if (!allTerminal) {
          skipped++;
          continue;
        }
      }

      // Circuit breaker: skip items whose engine is paused
      const itemEngine = item.engine ?? resolvePersona(item.type, item.personaHint)?.engine ?? "claude";
      if (this.isEngineCircuitOpen(itemEngine)) {
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
    body = body.replace("{title}", sanitizeForPrompt(item.title, "title"));
    body = body.replace("{description}", sanitizeForPrompt(item.description ?? "", "description"));
    body = body.replace("{url}", sanitizeForPrompt(item.url ?? "", "url"));

    // Guardrails context
    let guardrailsBlock = "";
    try {
      guardrailsBlock = await formatGuardrailsForPrompt();
    } catch (e) { this.logger.warn(`[GodMode][Queue] Guardrails format failed: ${(e as Error).message}`); }

    // Build full prompt
    const sections: string[] = [
      `You are a GodMode ${roleName} agent. Complete the task below and write your full output to:`,
      outPath,
    ];

    // Inject roster persona instructions if available
    if (persona) {
      sections.push("", "## Your Role", "", persona.body);
    }

    // Inject hardcoded agent rules from AGENTS.md — non-negotiable behavioral anchors
    try {
      const { fileURLToPath } = await import("node:url");
      const thisFile = fileURLToPath(import.meta.url);
      const agentsRulesPath = path.resolve(path.dirname(thisFile), "..", "..", "assets", "AGENTS.md");
      const agentsRules = await fs.readFile(agentsRulesPath, "utf-8");
      sections.push("", agentsRules);
    } catch {
      // AGENTS.md not available — continue without hardcoded rules
    }

    // Inject methodology for this task type
    const methodology = await loadMethodology(item.type);
    if (methodology) {
      sections.push("", "## Methodology — FOLLOW THIS PROCESS", "", methodology);
    }

    // Inject toolkit access instructions if token was issued
    try {
      const { isToolkitRunning, getToolkitBaseUrl } = await import("./agent-toolkit-server.js");
      if (isToolkitRunning()) {
        const tkUrl = getToolkitBaseUrl();
        sections.push(
          "",
          "## GodMode Toolkit API",
          `You have access to the owner's knowledge systems via: ${tkUrl}`,
          `Auth: Pass the GODMODE_TOOLKIT_TOKEN env var as a Bearer token.`,
          "Available endpoints:",
          "- GET /search?q=... — search vault, memory, and files",
          "- GET /memory?q=... — search conversational memory (Honcho)",
          "- GET /skills — list available skill cards",
          "- GET /awareness — current system state snapshot",
          "- GET /identity — owner identity (USER.md + SOUL.md)",
          "- POST /checkpoint — save progress (body: { summary, artifacts })",
          "Use these to ground your work in the owner's actual context and preferences.",
        );
      }
    } catch { /* toolkit not available */ }

    // Detect godmode-builder persona for codebase-level access
    const isGodmodeBuilder = item.personaHint === "godmode-builder" ||
      persona?.name === "GodMode Builder";

    sections.push(
      "",
      "## Persistence Protocol",
      "- If something fails, try a different approach. You have multiple tools available.",
      "- If a tool is unavailable, work around it with another tool.",
      "- If you get stuck, write what you learned so far and what you'd try next.",
      "- NEVER give up without writing output. Partial results are better than nothing.",
    );

    if (isGodmodeBuilder) {
      // Builder agents need codebase access — relaxed safety with specific boundaries
      sections.push(
        "",
        "## Safety Rules (Builder Agent)",
        "- You have full access to the godmode-plugin codebase.",
        "- Create a feature branch — NEVER commit to main.",
        "- Do NOT run destructive commands (rm -rf, git reset --hard, git push --force).",
        "- Do NOT modify .env files or credentials.",
        "- Run `pnpm build && pnpm typecheck` before committing — both must pass.",
        "- Write your output summary to the path above AND commit your code changes.",
      );

      // Tell the builder where the plugin source lives
      try {
        const { fileURLToPath } = await import("node:url");
        const thisFile = fileURLToPath(import.meta.url);
        const pluginRoot = path.resolve(path.dirname(thisFile), "..", "..");
        sections.push(
          "",
          "## Codebase Location",
          `The godmode-plugin source lives at: ${pluginRoot}`,
          `cd there before doing anything. Read CLAUDE.md first.`,
        );
      } catch {
        // Can't resolve plugin root — the builder can find it from GODMODE_ROOT
      }

      // Inject health ledger and repair context so the builder knows what's broken
      try {
        const { health, repairLog } = await import("../lib/health-ledger.js");
        const snapshot = health.snapshot();
        const recentRepairs = repairLog.recent(10);

        if (snapshot.alerts.length > 0 || recentRepairs.length > 0) {
          const healthLines = ["", "## System Health Context"];
          if (snapshot.alerts.length > 0) {
            healthLines.push("### Current Alerts");
            for (const alert of snapshot.alerts) {
              healthLines.push(`- ${alert}`);
            }
          }
          if (recentRepairs.length > 0) {
            healthLines.push("### Recent Repair History");
            for (const r of recentRepairs.slice(-5)) {
              healthLines.push(
                `- ${r.subsystem}: ${r.failure} → ${r.repairAction} (${r.verified ? "verified" : "unverified"})`,
              );
            }
          }
          sections.push(...healthLines);
        }
      } catch { /* health context non-fatal */ }
    } else {
      sections.push(
        "",
        "## Safety Rules",
        "- Do NOT modify files outside ~/godmode/memory/inbox/.",
        "- Do NOT run destructive commands (rm -rf, git reset --hard).",
        "- Do NOT access sensitive config files (.env, openclaw.json, SSH keys).",
        "- Write your complete output to the path above as markdown.",
      );
    }

    sections.push(
      "",
      "## Task",
      body,
    );

    // Inject handoff context from predecessor agent
    if (item.handoff) {
      sections.push("", formatHandoff(item.handoff));
    }

    // ── Owner identity context ──────────────────────────────────────
    try {
      const { path: identityDir } = resolveIdentityDir();

      // USER.md — who the owner is
      try {
        const userMd = await fs.readFile(path.join(identityDir, "USER.md"), "utf-8");
        const userLines = userMd.split("\n").slice(0, 100).join("\n");
        if (userLines.trim()) {
          sections.push("", "## Owner Context", userLines);
        }
      } catch { /* USER.md not found — that's fine */ }

      // SOUL.md — communication style and personality
      try {
        const soulMd = await fs.readFile(path.join(identityDir, "SOUL.md"), "utf-8");
        const soulLines = soulMd.split("\n").slice(0, 50).join("\n");
        if (soulLines.trim()) {
          sections.push("", "## Communication Style", soulLines);
        }
      } catch { /* SOUL.md not found — that's fine */ }

      // Today's daily brief — current priorities and context
      try {
        const today = localDateString();
        const vault = getVaultPath();
        if (vault) {
          const dailyDir = path.join(vault, VAULT_FOLDERS.daily);
          const briefPath = path.join(dailyDir, `${today}.md`);
          const briefMd = await fs.readFile(briefPath, "utf-8");
          const briefLines = briefMd.split("\n").slice(0, 50).join("\n");
          if (briefLines.trim()) {
            sections.push("", "## Today's Context", briefLines);
          }
        }
      } catch { /* Daily brief not found — that's fine */ }
    } catch (e) { this.logger.warn(`[GodMode][Queue] Identity dir resolution failed: ${(e as Error).message}`); }

    if (guardrailsBlock) {
      sections.push("", guardrailsBlock);
    }

    // Inject lessons learned from previous agent runs
    try {
      const { getLessonsForPrompt, formatLessonsForPrompt } = await import("../lib/agent-lessons.js");
      const lessons = await getLessonsForPrompt(item.type);
      if (lessons.length > 0) {
        sections.push(
          "",
          "## Lessons from Previous Runs",
          formatLessonsForPrompt(lessons),
        );
      }
    } catch {
      // agent-lessons module may not exist yet — non-fatal
    }

    // Trust feedback is now baked directly into persona/skill markdown files
    // by trust-refinement.ts — no runtime injection needed here.

    // ── Toolkit API + Workspace context ───────────────────────────────
    try {
      const { isToolkitRunning, createAgentToken, revokeAgentToken } = await import("./agent-toolkit-server.js");
      if (isToolkitRunning()) {
        // Resolve workspace
        let workspaceId = item.workspaceId;
        if (!workspaceId) {
          try {
            const { readWorkspaceConfig, detectWorkspaceFromText } = await import("../lib/workspaces-config.js");
            const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
            const detected = detectWorkspaceFromText(wsConfig, `${item.title} ${item.description ?? ""}`);
            if (detected.workspaceId) workspaceId = detected.workspaceId;
          } catch { /* workspace detection non-fatal */ }
        }

        const toolkit = createAgentToken({
          agentId: item.id,
          workspaceId,
        });

        if (toolkit) {
          // Store token on item so we can revoke on completion
          this.toolkitTokens.set(item.id, toolkit.token);

          sections.push(
            "",
            "## Your Toolkit API",
            `You have runtime access to GodMode's knowledge systems at: ${toolkit.baseUrl}`,
            `Auth: Bearer ${toolkit.token}`,
            "",
            "Available endpoints:",
            "- GET /search?query=...&scope=all&limit=20 — Search the vault, projects, research",
            "- GET /memory?query=...&limit=10 — Search conversational memory (Honcho)",
            "- GET /skills — List available skill cards",
            "- GET /awareness — Current system awareness snapshot",
            "- GET /identity — Owner identity context (USER.md + SOUL.md)",
            "- GET /guardrails — Active safety guardrails",
            "- GET /agents/active — Currently running agents (prevent duplicate work)",
            "- GET /agents/history?limit=10 — Recent completed agent work",
            "- POST /checkpoint — Write advisory checkpoint before risky actions",
            workspaceId ? "- GET /workspace — Your assigned workspace config" : "",
            workspaceId ? "- GET /workspace/guidelines — Project-specific guidelines" : "",
            workspaceId ? "- GET /workspace/history?limit=10 — Recent work in this workspace" : "",
            workspaceId ? "- GET /workspace/artifacts — Existing artifacts (don't duplicate)" : "",
            "",
            "Example:",
            "```bash",
            `curl -s -H "Authorization: Bearer ${toolkit.token}" ${toolkit.baseUrl}/search?query=your+topic`,
            "```",
            "",
            "**IMPORTANT:** Search before building. Check existing artifacts. Never overwrite without backup.",
          );

          // Workspace context
          if (workspaceId) {
            try {
              const { readWorkspaceConfig, findWorkspaceById } = await import("../lib/workspaces-config.js");
              const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
              const ws = findWorkspaceById(wsConfig, workspaceId);
              if (ws) {
                sections.push(
                  "",
                  "## Your Workspace",
                  `Project: ${ws.name} (${ws.type})`,
                  `Path: ${ws.path}`,
                );

                // Load guidelines if they exist
                try {
                  const guidelinesPath = path.join(ws.path, ".godmode", "guidelines.md");
                  const guidelines = await fs.readFile(guidelinesPath, "utf-8");
                  if (guidelines.trim()) {
                    sections.push("", "### Project Guidelines", guidelines.slice(0, 2000));
                  }
                } catch { /* no guidelines file — that's fine */ }
              }
            } catch { /* workspace resolution non-fatal */ }
          }
        }
      }
    } catch (e) { this.logger.warn(`[GodMode][Queue] Toolkit server context failed: ${(e as Error).message}`); }

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
    );

    sections.push(
      "",
      "Do your best work. Be thorough.",
      "If you get stuck, write what you tried and what you'd do differently.",
      "The human reviewing this will continue the work in a chat session with this output as context.",
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

// ── Expiration — prune stale review/failed items ──────────────────

export async function expireStaleQueueItems(): Promise<void> {
  const { updateQueueState } = await import("../lib/queue-state.js");
  await updateQueueState((state) => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

    state.items = state.items.filter((item) => {
      // Done items older than 30 days → remove
      if (item.status === "done" && item.completedAt && now - item.completedAt > THIRTY_DAYS) {
        return false;
      }
      // Review items older than 7 days → remove
      if ((item.status === "review" || item.status === "needs-review") && item.completedAt && now - item.completedAt > SEVEN_DAYS) {
        return false;
      }
      // Failed items older than 3 days → remove
      if (item.status === "failed" && item.completedAt && now - item.completedAt > THREE_DAYS) {
        return false;
      }
      // Stale processing items (no PID, older than 2 hours) → reset to pending
      if (item.status === "processing" && item.startedAt && now - item.startedAt > 2 * 60 * 60 * 1000) {
        if (!item.pid || !isPidAlive(item.pid)) {
          item.status = "pending";
          item.pid = undefined;
          item.startedAt = undefined;
        }
      }
      return true;
    });
  });
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

  // Find pending tasks that are overdue
  const overdue = tasksData.tasks.filter(
    (t) =>
      t.status === "pending" &&
      t.dueDate != null &&
      t.dueDate <= today,
  );

  if (overdue.length === 0) return { queued: 0 };

  // Read current queue state and check for existing items (dedup by sourceTaskId)
  await updateQueueState((state) => {
    // Safety check: if queue is empty but >3 overdue tasks exist, skip auto-queuing
    // to prevent duplicate flood (likely a state reset or first-run scenario)
    if (state.items.length === 0 && overdue.length > 3) {
      return;
    }

    const existingSourceIds = new Set(
      state.items
        .filter((i) => i.sourceTaskId)
        .map((i) => i.sourceTaskId),
    );

    // Title dedup set — prevents queueing duplicate titles even without matching sourceTaskId
    const existingTitles = new Set(
      state.items.map((i) => i.title.trim().toLowerCase()),
    );

    for (const task of overdue) {
      // Skip if already queued (by sourceTaskId or normalized title)
      if (existingSourceIds.has(task.id)) continue;
      if (existingTitles.has(task.title.trim().toLowerCase())) continue;

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

      // Add to dedup sets so subsequent iterations in this loop don't duplicate
      existingSourceIds.add(task.id);
      existingTitles.add(task.title.trim().toLowerCase());

      queued++;
    }
  });

  return { queued };
}
