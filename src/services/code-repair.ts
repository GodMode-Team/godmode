/**
 * code-repair.ts — Spawn Claude Code CLI to fix code-level issues.
 *
 * When self-heal detects a subsystem that keeps failing after runtime repairs,
 * this service escalates to an actual code fix by spawning Claude Code in the
 * plugin directory with the godmode-builder persona.
 *
 * This solves the "self-surgery" problem: the running GodMode process never
 * modifies its own code. Instead, an external Claude Code process creates a
 * branch, fixes the issue, builds, typechecks, merges, and writes
 * pending-deploy.json. The fix goes live on next gateway restart.
 *
 * Guards:
 *   - Only one code repair at a time
 *   - 30-min cooldown between attempts
 *   - Max 3 attempts per day
 *   - Claude Code must be installed
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DATA_DIR } from "../data-paths.js";
import { health, repairLog } from "../lib/health-ledger.js";
import { buildChildEnv } from "../lib/child-env.js";
import { resolveClaudeBin, isEngineAvailable } from "../lib/resolve-claude-bin.js";

// ── Types ────────────────────────────────────────────────────────────

export interface CodeRepairRequest {
  /** Which subsystem is broken */
  subsystem: string;
  /** Human-readable description of the failure */
  failure: string;
  /** Error messages / stack traces to give the builder */
  errorContext: string;
  /** Who triggered it: "self-heal" | "ally" | "manual" */
  trigger: "self-heal" | "ally" | "manual";
}

export interface CodeRepairResult {
  started: boolean;
  pid?: number;
  error?: string;
  /** If already running, the existing repair's subsystem */
  existingRepair?: string;
}

interface CodeRepairState {
  /** Currently running repair */
  active: { pid: number; subsystem: string; startedAt: number } | null;
  /** Timestamps of today's attempts */
  todayAttempts: number[];
  /** Timestamp of last completed repair */
  lastCompletedAt: number;
}

// ── Constants ────────────────────────────────────────────────────────

const COOLDOWN_MS = 30 * 60 * 1000;       // 30 min between attempts
const MAX_DAILY_ATTEMPTS = 3;
const REPAIR_TIMEOUT_MS = 15 * 60 * 1000;  // 15 min max per repair
const STATE_FILE = join(DATA_DIR, "code-repair-state.json");

// ── State ────────────────────────────────────────────────────────────

const state: CodeRepairState = {
  active: null,
  todayAttempts: [],
  lastCompletedAt: 0,
};

type Logger = {
  info(m: string): void;
  warn(m: string): void;
  error(m: string): void;
};

// ── Plugin root resolver ─────────────────────────────────────────────

function resolvePluginRoot(): string | null {
  try {
    const thisFile = fileURLToPath(import.meta.url);
    // src/services/code-repair.ts → plugin root is ../../
    const root = resolve(dirname(thisFile), "..", "..");
    // Verify it looks right
    if (existsSync(join(root, "package.json")) || existsSync(join(root, "CLAUDE.md"))) {
      return root;
    }
    // Dist mode: dist/services/code-repair.js → ../../
    if (existsSync(join(root, "src"))) {
      return root;
    }
  } catch { /* noop */ }
  return null;
}

// ── Builder prompt ───────────────────────────────────────────────────

function buildRepairPrompt(req: CodeRepairRequest, pluginRoot: string): string {
  return [
    "You are the GodMode Builder — a specialized repair agent for the godmode-plugin codebase.",
    "",
    "## Your Mission",
    `Fix a recurring failure in the **${req.subsystem}** subsystem.`,
    `Trigger: ${req.trigger}`,
    "",
    "## Failure Details",
    req.failure,
    "",
    "## Error Context",
    req.errorContext,
    "",
    "## Codebase Location",
    `The plugin source is at: ${pluginRoot}`,
    "",
    "## Workflow — follow this EXACTLY",
    "1. Read CLAUDE.md for project rules",
    "2. Read the relevant source files (start with the subsystem that's failing)",
    "3. Note the current git branch",
    `4. Create a fix branch: git checkout -b fix/auto-repair-${req.subsystem}-${Date.now()}`,
    "5. Make the MINIMAL fix — don't refactor, don't over-engineer",
    "6. Run: pnpm build — must pass with zero errors",
    "7. Run: pnpm typecheck — must pass",
    "8. Commit with a clear message",
    "9. Merge back to the original branch",
    "10. Run: pnpm build (final production build)",
    "11. Write ~/godmode/data/pending-deploy.json with:",
    '    { "ts": <now>, "branch": "<fix-branch>", "summary": "<what you fixed>",',
    '      "files": [<changed files>], "buildPassed": true, "typecheckPassed": true,',
    '      "autoRepair": true }',
    "12. DO NOT restart the gateway. The fix goes live on next natural restart.",
    "",
    "## Rules",
    "- TypeScript ESM only",
    "- Never commit to main directly",
    "- Keep changes minimal",
    "- If build/typecheck fails after merge, revert and report what blocked you",
    "- If you can't fix it, explain exactly what's blocking you",
  ].join("\n");
}

// ── Guard checks ─────────────────────────────────────────────────────

function pruneOldAttempts(): void {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  state.todayAttempts = state.todayAttempts.filter((ts) => ts >= startOfDay.getTime());
}

function checkGuards(logger: Logger): string | null {
  // 1. Already running?
  if (state.active) {
    if (isPidAlive(state.active.pid)) {
      // Check timeout
      if (Date.now() - state.active.startedAt > REPAIR_TIMEOUT_MS) {
        logger.warn(`[CodeRepair] Active repair timed out (pid=${state.active.pid}) — killing`);
        try { process.kill(state.active.pid, "SIGTERM"); } catch { /* already dead */ }
        state.active = null;
      } else {
        return `Code repair already in progress for ${state.active.subsystem} (pid=${state.active.pid})`;
      }
    } else {
      // Process died — clear state
      state.active = null;
    }
  }

  // 2. Cooldown
  if (state.lastCompletedAt > 0 && Date.now() - state.lastCompletedAt < COOLDOWN_MS) {
    const mins = Math.ceil((COOLDOWN_MS - (Date.now() - state.lastCompletedAt)) / 60000);
    return `Cooldown active — ${mins} min remaining before next code repair`;
  }

  // 3. Daily limit
  pruneOldAttempts();
  if (state.todayAttempts.length >= MAX_DAILY_ATTEMPTS) {
    return `Daily limit reached (${MAX_DAILY_ATTEMPTS} code repairs/day)`;
  }

  // 4. Claude Code available?
  if (!isEngineAvailable("claude")) {
    return "Claude Code CLI not installed — cannot perform code repair";
  }

  return null; // All clear
}

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// ── Core: spawn Claude Code ──────────────────────────────────────────

export async function spawnCodeRepair(
  req: CodeRepairRequest,
  logger: Logger,
): Promise<CodeRepairResult> {
  const guardError = checkGuards(logger);
  if (guardError) {
    logger.info(`[CodeRepair] Blocked: ${guardError}`);
    return {
      started: false,
      error: guardError,
      existingRepair: state.active?.subsystem,
    };
  }

  const pluginRoot = resolvePluginRoot();
  if (!pluginRoot) {
    return { started: false, error: "Cannot resolve plugin root directory" };
  }

  const prompt = buildRepairPrompt(req, pluginRoot);
  const claudeBin = resolveClaudeBin();
  const env = buildChildEnv();

  logger.info(`[CodeRepair] Spawning Claude Code to fix ${req.subsystem} (trigger: ${req.trigger})`);

  try {
    const child = spawn(claudeBin, ["-p", prompt, "--verbose", "--dangerously-skip-permissions"], {
      cwd: pluginRoot,
      detached: true,
      stdio: "ignore",
      env,
    });

    const pid = child.pid;
    if (!pid) {
      return { started: false, error: "Failed to get PID from spawned process" };
    }

    // Track state
    const startedAt = Date.now();
    state.active = { pid, subsystem: req.subsystem, startedAt };
    state.todayAttempts.push(startedAt);
    health.signal("code-repair.spawn", true, { subsystem: req.subsystem, pid });

    // File GitHub issue (non-blocking)
    let issueNumber: number | null = null;
    void fileCodeRepairIssue(req, pid).then((n) => { issueNumber = n; });

    child.on("exit", (code) => {
      logger.info(`[CodeRepair] Claude Code exited (code=${code}) for ${req.subsystem}`);
      state.active = null;
      state.lastCompletedAt = Date.now();

      const ok = code === 0;
      health.signal("code-repair.complete", ok, { subsystem: req.subsystem, code });

      repairLog.record({
        ts: Date.now(),
        subsystem: req.subsystem,
        failure: req.failure,
        repairAction: `code-repair via Claude Code CLI (exit=${code})`,
        verified: ok,
        elapsed: Date.now() - startedAt,
      });

      // Check pending-deploy.json and comment on the GitHub issue
      if (ok) {
        void checkPendingDeploy(logger).then(async (deployInfo) => {
          if (issueNumber) {
            void commentOnRepairIssue(issueNumber, req.subsystem, code, deployInfo ?? undefined);
          }
        });
      } else if (issueNumber) {
        void commentOnRepairIssue(issueNumber, req.subsystem, code);
      }
    });

    child.on("error", (err) => {
      logger.error(`[CodeRepair] Spawn error: ${String(err)}`);
      state.active = null;
      health.signal("code-repair.spawn", false, { error: String(err) });
    });

    // Timeout guard
    setTimeout(() => {
      if (state.active?.pid === pid && isPidAlive(pid)) {
        logger.warn(`[CodeRepair] Timeout — killing pid ${pid}`);
        try { process.kill(-pid, "SIGTERM"); } catch {
          try { process.kill(pid, "SIGKILL"); } catch { /* already dead */ }
        }
        state.active = null;
        health.signal("code-repair.timeout", false, { subsystem: req.subsystem });
      }
    }, REPAIR_TIMEOUT_MS);

    child.unref();

    return { started: true, pid };
  } catch (err) {
    health.signal("code-repair.spawn", false, { error: String(err) });
    return { started: false, error: `Spawn failed: ${String(err)}` };
  }
}

// ── GitHub Notifications ─────────────────────────────────────────────

const GITHUB_REPO = "godmode-team/godmode";

/**
 * File a GitHub issue when code repair is triggered.
 * Returns the issue number so we can comment on it when the repair finishes.
 */
async function fileCodeRepairIssue(req: CodeRepairRequest, pid: number): Promise<number | null> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const exec = promisify(execFile);

    const title = `[code-repair] Auto-repair triggered: ${req.subsystem} — ${req.failure.slice(0, 60)}`;
    const body = [
      "## Code Repair Triggered",
      "",
      `**Subsystem:** ${req.subsystem}`,
      `**Failure:** ${req.failure}`,
      `**Trigger:** ${req.trigger}`,
      `**PID:** ${pid}`,
      `**Time:** ${new Date().toISOString()}`,
      "",
      "## Error Context",
      "```",
      req.errorContext.slice(0, 2000),
      "```",
      "",
      "## What's Happening",
      "GodMode's self-heal pipeline detected a persistent failure that runtime repairs couldn't fix.",
      "Claude Code CLI has been spawned to diagnose and fix the issue in the plugin codebase.",
      "The fix will be staged in `pending-deploy.json` and go live on next gateway restart.",
      "",
      "---",
      "*Auto-filed by GodMode code-repair pipeline*",
    ].join("\n");

    const { stdout } = await exec("gh", [
      "issue", "create",
      "--repo", GITHUB_REPO,
      "--title", title,
      "--body", body,
      "--label", "auto-heal,code-repair",
    ], { timeout: 15_000 });

    // gh issue create returns the issue URL, extract the number
    const match = stdout.trim().match(/\/issues\/(\d+)/);
    const issueNumber = match ? parseInt(match[1], 10) : null;

    console.log(`[CodeRepair] Filed GitHub issue${issueNumber ? ` #${issueNumber}` : ""}: ${req.subsystem}`);
    return issueNumber;
  } catch (err) {
    console.warn(`[CodeRepair] Failed to file GitHub issue: ${String(err)}`);
    return null;
  }
}

/**
 * Comment on the code repair issue with the outcome.
 */
async function commentOnRepairIssue(
  issueNumber: number,
  subsystem: string,
  exitCode: number | null,
  deployInfo?: { summary?: string; files?: string[] },
): Promise<void> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const exec = promisify(execFile);

    const ok = exitCode === 0;
    const lines = [
      ok ? "## Repair Completed" : "## Repair Failed",
      "",
      `**Exit code:** ${exitCode}`,
      `**Time:** ${new Date().toISOString()}`,
    ];

    if (ok && deployInfo) {
      lines.push(
        "",
        "### Fix Staged",
        `**Summary:** ${deployInfo.summary ?? "unknown"}`,
        `**Files:** ${deployInfo.files?.join(", ") ?? "unknown"}`,
        "",
        "Fix is staged in `pending-deploy.json` — will go live on next gateway restart.",
      );
    } else if (!ok) {
      lines.push(
        "",
        "Claude Code was unable to fix the issue automatically.",
        "Manual intervention may be needed.",
      );
    }

    lines.push("", "---", "*Auto-commented by GodMode code-repair pipeline*");

    await exec("gh", [
      "issue", "comment",
      String(issueNumber),
      "--repo", GITHUB_REPO,
      "--body", lines.join("\n"),
    ], { timeout: 15_000 });

    // Auto-close on success
    if (ok) {
      await exec("gh", [
        "issue", "close",
        String(issueNumber),
        "--repo", GITHUB_REPO,
        "--reason", "completed",
      ], { timeout: 10_000 });
    }
  } catch (err) {
    console.warn(`[CodeRepair] Failed to comment on issue #${issueNumber}: ${String(err)}`);
  }
}

// ── Post-repair: check pending-deploy.json ───────────────────────────

async function checkPendingDeploy(
  logger: Logger,
): Promise<{ summary?: string; files?: string[] } | null> {
  const deployPath = join(DATA_DIR, "pending-deploy.json");
  try {
    if (existsSync(deployPath)) {
      const raw = await readFile(deployPath, "utf-8");
      const deploy = JSON.parse(raw);
      if (deploy.autoRepair) {
        logger.info(
          `[CodeRepair] Fix staged: ${deploy.summary ?? "unknown"} — will go live on next restart`,
        );
        return { summary: deploy.summary, files: deploy.files };
      }
    }
  } catch { /* non-fatal */ }
  return null;
}

// ── Escalation: called by self-heal ──────────────────────────────────

/**
 * Check if any subsystem has failed enough times to warrant a code repair.
 * Called from runSelfHeal() after runtime repairs have been exhausted.
 *
 * Threshold: 5+ consecutive failures on the same subsystem, AND the runtime
 * repair for it has already been attempted 2+ times without fixing it.
 */
export async function maybeEscalateToCodeRepair(
  logger: Logger,
  subsystemFailures: Array<{ id: string; message: string; consecutiveFailures: number; repairCount: number }>,
): Promise<CodeRepairResult | null> {
  // Find subsystems that are beyond runtime repair
  const candidates = subsystemFailures.filter(
    (s) => s.consecutiveFailures >= 5 && s.repairCount >= 2,
  );

  if (candidates.length === 0) return null;

  // Pick the worst one
  const worst = candidates.sort((a, b) => b.consecutiveFailures - a.consecutiveFailures)[0];

  // Build error context from the health ledger
  const ledger = health.snapshot();
  const relevantAlerts = ledger.alerts
    .filter((a) => a.toLowerCase().includes(worst.id.toLowerCase()))
    .join("\n");

  const relevantOps = ledger.operations
    .filter((op) => op.operation.toLowerCase().includes(worst.id.replace("-", ".").toLowerCase()))
    .map((op) => `${op.operation}: ${op.consecutiveFailures} failures, last error: ${op.lastError ?? "unknown"}`)
    .join("\n");

  const errorContext = [
    `Subsystem: ${worst.id}`,
    `Status: ${worst.message}`,
    `Consecutive failures: ${worst.consecutiveFailures}`,
    `Runtime repair attempts: ${worst.repairCount}`,
    "",
    "Ledger alerts:",
    relevantAlerts || "(none)",
    "",
    "Operation stats:",
    relevantOps || "(none)",
  ].join("\n");

  logger.warn(
    `[CodeRepair] Escalating ${worst.id} to code repair — ${worst.consecutiveFailures} consecutive failures, ${worst.repairCount} failed runtime repairs`,
  );

  return spawnCodeRepair(
    {
      subsystem: worst.id,
      failure: worst.message,
      errorContext,
      trigger: "self-heal",
    },
    logger,
  );
}

// ── Status query ─────────────────────────────────────────────────────

export function getCodeRepairStatus(): {
  active: boolean;
  subsystem: string | null;
  pid: number | null;
  todayAttempts: number;
  cooldownRemaining: number;
} {
  pruneOldAttempts();

  // Clean up stale active state
  if (state.active && !isPidAlive(state.active.pid)) {
    state.active = null;
  }

  const cooldownRemaining = state.lastCompletedAt > 0
    ? Math.max(0, COOLDOWN_MS - (Date.now() - state.lastCompletedAt))
    : 0;

  return {
    active: state.active !== null,
    subsystem: state.active?.subsystem ?? null,
    pid: state.active?.pid ?? null,
    todayAttempts: state.todayAttempts.length,
    cooldownRemaining,
  };
}
