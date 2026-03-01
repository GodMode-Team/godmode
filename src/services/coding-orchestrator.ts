import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { GODMODE_ROOT } from "../data-paths.js";
import { formatGuardrailsForPrompt } from "./guardrails.js";
import { resolveClaudeBin, resolveAgentBin, isEngineAvailable } from "../lib/resolve-claude-bin.js";
import type { AgentEngine } from "../lib/agent-roster.js";
import {
  classifyTaskMode,
  newTaskId,
  readCodingTaskState,
  updateCodingTaskState,
  type CodingTask,
  type CodingTaskMode,
  type CodingTaskState,
  type CodingTaskStatus,
  type ReviewResult,
  type SwarmStage,
} from "../lib/coding-task-state.js";

// ── Config ──────────────────────────────────────────────────────

type CodingConfig = {
  enabled?: boolean;
  maxParallelWriters?: number;
  autoMerge?: boolean;
  defaultRepoVisibility?: "private" | "public";
  validation?: {
    lint?: boolean;
    typecheck?: boolean;
    test?: boolean;
  };
};

// ── Scope inference ─────────────────────────────────────────────

type ScopeInference = {
  scopeGlobs: string[];
  parallelSafe: boolean;
  rationale: string;
};

type KeywordScopeRule = {
  keywords: string[];
  scopes: string[];
  rationale: string;
};

const KEYWORD_SCOPE_RULES: KeywordScopeRule[] = [
  { keywords: ["ui", "frontend", "ux", "css", "component", "dashboard", "web ui"], scopes: ["src/ui/**", "ui/**"], rationale: "UI/frontend" },
  { keywords: ["agent", "session", "tool", "prompt", "model"], scopes: ["src/agents/**"], rationale: "agents" },
  { keywords: ["gateway", "rpc", "websocket", "server"], scopes: ["src/gateway/**"], rationale: "gateway" },
  { keywords: ["plugin", "extension", "hook"], scopes: ["src/plugins/**", "extensions/**"], rationale: "plugins" },
  { keywords: ["docs", "documentation", "readme"], scopes: ["docs/**", "README.md"], rationale: "docs" },
  { keywords: ["ios", "swift", "xcode"], scopes: ["apps/ios/**"], rationale: "iOS" },
  { keywords: ["android", "kotlin", "gradle"], scopes: ["apps/android/**"], rationale: "Android" },
  { keywords: ["mac app", "macos", "menubar"], scopes: ["apps/macos/**"], rationale: "macOS" },
  { keywords: ["test", "tests", "vitest", "e2e"], scopes: ["src/**", "ui/**"], rationale: "testing" },
];

const BROAD_SCOPES = new Set(["**", "src/**", "ui/**"]);

function extractPathScopes(task: string): string[] {
  const matches = Array.from(
    task.matchAll(/(?:^|[\s("'`])((?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._*?-]+)(?=$|[\s)"'`,.:;!?])/g),
  );
  const scopes: string[] = [];
  for (const match of matches) {
    const raw = match[1]?.trim().replace(/^\.\//, "");
    if (!raw) continue;
    if (raw.includes("*")) {
      scopes.push(raw);
    } else if (path.extname(raw)) {
      const dir = path.dirname(raw);
      scopes.push(dir === "." ? raw : `${dir}/**`);
    } else {
      scopes.push(raw.endsWith("/") ? `${raw}**` : `${raw}/**`);
    }
  }
  return [...new Set(scopes)];
}

export function inferScope(task: string, explicitScopes?: string[]): ScopeInference {
  if (explicitScopes && explicitScopes.length > 0) {
    return { scopeGlobs: explicitScopes, parallelSafe: true, rationale: "explicit" };
  }

  const pathScopes = extractPathScopes(task);
  if (pathScopes.length > 0) {
    return { scopeGlobs: pathScopes, parallelSafe: true, rationale: "path mentions" };
  }

  const lower = task.toLowerCase();
  const scopes: string[] = [];
  const reasons: string[] = [];
  let matchCount = 0;
  for (const rule of KEYWORD_SCOPE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      matchCount++;
      scopes.push(...rule.scopes);
      reasons.push(rule.rationale);
    }
  }
  if (scopes.length === 0) {
    return { scopeGlobs: ["**"], parallelSafe: false, rationale: "no subsystem detected" };
  }
  const deduped = [...new Set(scopes)];
  const parallelSafe = matchCount === 1 && deduped.every((g) => !BROAD_SCOPES.has(g));
  return { scopeGlobs: deduped, parallelSafe, rationale: reasons.join(", ") };
}

// ── Plan gate — complexity classification ───────────────────────

export type ComplexityLevel = "simple" | "complex";

export type ComplexityAssessment = {
  level: ComplexityLevel;
  reason: string;
};

const SIMPLE_KEYWORDS =
  /\b(fix|bug|typo|tweak|rename|update|change|toggle|config|patch|hotfix|bump|revert|rollback)\b/i;

const COMPLEX_KEYWORDS =
  /\b(build|create|implement|add|new|feature|redesign|refactor|migrate|replace|rewrite|overhaul|integrate|architect)\b/i;

const MULTI_SYSTEM_KEYWORDS =
  /\b(and|with|plus|also|across|end.to.end|full.stack|frontend.+backend|ui.+api|client.+server)\b/i;

export function classifyComplexity(task: string): ComplexityAssessment {
  const text = task.trim().toLowerCase();
  if (!text) return { level: "simple", reason: "empty task" };

  // Explicit plan request always complex
  if (/\b(plan this|bmad|bmad this)\b/i.test(text)) {
    return { level: "complex", reason: "explicit plan request" };
  }

  // Strong simple signals — bug fix, typo, config tweak
  if (SIMPLE_KEYWORDS.test(text) && !COMPLEX_KEYWORDS.test(text)) {
    return { level: "simple", reason: "bug fix / minor change" };
  }

  // Multi-system signals
  if (MULTI_SYSTEM_KEYWORDS.test(text) && COMPLEX_KEYWORDS.test(text)) {
    return { level: "complex", reason: "multi-system feature" };
  }

  // Strong complex signals — new feature, greenfield
  if (COMPLEX_KEYWORDS.test(text)) {
    // Check if it's a trivial "add" (e.g., "add a comment") vs real feature
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 10) {
      return { level: "complex", reason: "new feature / substantial scope" };
    }
    // Short "add" requests are probably simple
    return { level: "simple", reason: "small addition" };
  }

  return { level: "simple", reason: "no complexity signals detected" };
}

// ── Plan gate — plan doc validation ─────────────────────────────

const PLANS_DIR = path.join(GODMODE_ROOT, "docs", "plans");

export async function validatePlanDoc(planDocPath: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const resolved = planDocPath.replace(/^~/, process.env.HOME ?? "");
    const content = await fs.readFile(resolved, "utf-8");

    // Check that the file has a status field and it's "approved" or "in-progress"
    const statusMatch = content.match(/^Status:\s*(.+)$/m);
    if (!statusMatch) {
      return { valid: false, error: "Plan doc has no Status field" };
    }
    const status = statusMatch[1]!.trim().toLowerCase();
    if (status === "approved" || status === "in-progress" || status === "complete") {
      return { valid: true };
    }
    if (status === "draft") {
      return { valid: false, error: "Plan doc is still in draft — needs the user's approval before dispatching" };
    }
    return { valid: false, error: `Plan doc status is "${status}" — must be "approved" to dispatch` };
  } catch {
    return { valid: false, error: `Plan doc not found at ${planDocPath}` };
  }
}

export function getPlansDir(): string {
  return PLANS_DIR;
}

// ── Scope overlap ───────────────────────────────────────────────

function stablePrefix(glob: string): string {
  let prefix = "";
  for (const ch of glob) {
    if ("*?{".includes(ch)) break;
    prefix += ch;
  }
  return prefix.replace(/\/+$/, "");
}

function scopesMayOverlap(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return true;
  for (const pa of a.map(stablePrefix)) {
    for (const pb of b.map(stablePrefix)) {
      if (!pa || !pb) return true;
      if (pa.startsWith(pb) || pb.startsWith(pa)) return true;
    }
  }
  return false;
}

// ── Dispatch policy ─────────────────────────────────────────────

type DispatchDecision = {
  start: boolean;
  reason: string;
  queuePosition?: number;
};

function decideDispatch(
  mode: CodingTaskMode,
  scopeGlobs: string[],
  parallelSafe: boolean,
  activeTasks: CodingTask[],
  maxWriters: number,
): DispatchDecision {
  if (mode === "read") return { start: true, reason: "read tasks always start" };

  const activeWrites = activeTasks.filter(
    (t) => t.mode === "write" && (t.status === "running" || t.status === "validating"),
  );
  if (activeWrites.length === 0) return { start: true, reason: "no active writes" };

  if (activeWrites.length >= maxWriters) {
    return { start: false, reason: `writer limit reached (${activeWrites.length}/${maxWriters})` };
  }

  if (!parallelSafe) {
    return { start: false, reason: "scope not parallel-safe" };
  }

  const conflicting = activeWrites.filter((t) => scopesMayOverlap(scopeGlobs, t.scopeGlobs));
  if (conflicting.length > 0) {
    return { start: false, reason: `scope overlaps with task ${conflicting[0]!.id}` };
  }

  return { start: true, reason: "non-overlapping scope" };
}

// ── Git helpers ─────────────────────────────────────────────────

type RunCmd = (argv: string[], opts: { timeoutMs: number; cwd?: string }) => Promise<{ stdout: string; exitCode: number }>;

async function gitCurrentBranch(run: RunCmd, cwd: string): Promise<string> {
  const { stdout } = await run(["git", "rev-parse", "--abbrev-ref", "HEAD"], { timeoutMs: 5_000, cwd });
  return stdout.trim() || "main";
}

async function createWorktree(run: RunCmd, repoRoot: string, worktreePath: string, branch: string, baseBranch: string): Promise<void> {
  await run(["git", "worktree", "add", "-b", branch, worktreePath, baseBranch], {
    timeoutMs: 30_000,
    cwd: repoRoot,
  });
}

async function removeWorktree(run: RunCmd, repoRoot: string, worktreePath: string): Promise<void> {
  try {
    await run(["git", "worktree", "remove", "--force", worktreePath], { timeoutMs: 15_000, cwd: repoRoot });
  } catch {
    // worktree may already be gone
  }
}

async function createPullRequest(run: RunCmd, worktreePath: string, branch: string, description: string): Promise<{ prNumber: number; prUrl: string } | undefined> {
  try {
    const { stdout, exitCode } = await run(
      ["gh", "pr", "create", "--base", "main", "--head", branch, "--title", description.slice(0, 72), "--body", `Automated coding task: ${description}\n\nCreated by GodMode coding orchestrator.`],
      { timeoutMs: 30_000, cwd: worktreePath },
    );
    if (exitCode !== 0) return undefined;
    const url = stdout.trim();
    const match = url.match(/\/pull\/(\d+)/);
    return match ? { prNumber: Number(match[1]), prUrl: url } : undefined;
  } catch {
    return undefined;
  }
}

async function mergePullRequest(run: RunCmd, worktreePath: string, prNumber: number): Promise<boolean> {
  try {
    const { exitCode } = await run(
      ["gh", "pr", "merge", String(prNumber), "--squash", "--delete-branch"],
      { timeoutMs: 30_000, cwd: worktreePath },
    );
    return exitCode === 0;
  } catch {
    return false;
  }
}

async function isWorkingTreeClean(run: RunCmd, repoRoot: string): Promise<boolean> {
  try {
    const { stdout } = await run(["git", "status", "--porcelain"], { timeoutMs: 10_000, cwd: repoRoot });
    return stdout.trim().length === 0;
  } catch {
    return false; // If we can't check, assume dirty to be safe
  }
}

async function isGitRepo(run: RunCmd, dir: string): Promise<boolean> {
  try {
    const { exitCode } = await run(["git", "rev-parse", "--git-dir"], { timeoutMs: 5_000, cwd: dir });
    return exitCode === 0;
  } catch {
    return false;
  }
}

async function bootstrapRepo(
  run: RunCmd,
  repoRoot: string,
  repoName: string,
  visibility: "private" | "public",
): Promise<{ created: boolean; error?: string }> {
  try {
    // Create directory if needed
    await run(["mkdir", "-p", repoRoot], { timeoutMs: 5_000 });

    // git init
    await run(["git", "init"], { timeoutMs: 10_000, cwd: repoRoot });

    // Initial commit so worktrees have a base
    await run(["git", "commit", "--allow-empty", "-m", "Initial commit"], {
      timeoutMs: 10_000,
      cwd: repoRoot,
    });

    // Create GitHub repo and set as remote
    const { exitCode, stdout } = await run(
      ["gh", "repo", "create", repoName, `--${visibility}`, "--source", ".", "--remote", "origin", "--push"],
      { timeoutMs: 30_000, cwd: repoRoot },
    );
    if (exitCode !== 0) {
      return { created: false, error: `gh repo create failed: ${stdout.slice(0, 200)}` };
    }

    return { created: true };
  } catch (err) {
    return { created: false, error: String(err).slice(0, 200) };
  }
}

// ── Process liveness ────────────────────────────────────────────

function isProcessAlive(pid: number | undefined): boolean {
  if (!pid) return false;
  try {
    process.kill(pid, 0); // signal 0 = existence check, no actual signal sent
    return true;
  } catch {
    return false;
  }
}

/** Max age (ms) for a "running" task with no live process before auto-reaping. */
const STALE_TASK_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

// ── Validation gates ────────────────────────────────────────────

type GateResult = { passed: boolean; details: string };

/** Read package.json scripts from a directory, returning an empty object if none exists. */
async function readPkgScripts(dir: string): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(path.join(dir, "package.json"), "utf-8");
    const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
    return pkg.scripts ?? {};
  } catch {
    return {};
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function runValidationGates(
  run: RunCmd,
  worktreePath: string,
  config: CodingConfig["validation"],
): Promise<GateResult> {
  const failures: string[] = [];
  const scripts = await readPkgScripts(worktreePath);
  const hasScript = (name: string) => name in scripts;

  // If the worktree has a package.json but no node_modules, install deps first
  if (Object.keys(scripts).length > 0 && !(await fileExists(path.join(worktreePath, "node_modules")))) {
    try {
      const { exitCode } = await run(["pnpm", "install", "--frozen-lockfile"], { timeoutMs: 120_000, cwd: worktreePath });
      if (exitCode !== 0) {
        // Try without frozen-lockfile (worktree may not have exact lockfile)
        await run(["pnpm", "install"], { timeoutMs: 120_000, cwd: worktreePath });
      }
    } catch {
      // If install fails, skip gates gracefully — no deps means no tooling
      return { passed: true, details: "skipped — dependency install failed" };
    }
  }

  if (config?.lint !== false && hasScript("lint")) {
    try {
      const { exitCode, stdout } = await run(["pnpm", "lint"], { timeoutMs: 60_000, cwd: worktreePath });
      if (exitCode !== 0) failures.push(`lint failed: ${stdout.slice(0, 200)}`);
    } catch (err) {
      failures.push(`lint error: ${String(err).slice(0, 200)}`);
    }
  }

  if (config?.typecheck !== false && (hasScript("typecheck") || hasScript("tsc"))) {
    try {
      const { exitCode, stdout } = await run(["pnpm", "tsc", "--noEmit"], { timeoutMs: 120_000, cwd: worktreePath });
      if (exitCode !== 0) failures.push(`typecheck failed: ${stdout.slice(0, 200)}`);
    } catch (err) {
      failures.push(`typecheck error: ${String(err).slice(0, 200)}`);
    }
  }

  if (config?.test !== false && hasScript("test")) {
    try {
      const { exitCode, stdout } = await run(["pnpm", "test", "--run"], { timeoutMs: 300_000, cwd: worktreePath });
      if (exitCode !== 0) failures.push(`tests failed: ${stdout.slice(0, 200)}`);
    } catch (err) {
      failures.push(`test error: ${String(err).slice(0, 200)}`);
    }
  }

  if (failures.length > 0) {
    return { passed: false, details: failures.join("\n") };
  }
  return { passed: true, details: "all gates passed" };
}

// ── Multi-Model Code Review ──────────────────────────────────────

/**
 * Run adversarial code reviews on a PR using multiple AI engines in parallel.
 * Each available engine reviews the diff and posts a comment on the PR.
 * Returns results from all reviewers — failures are informational, not blocking.
 */
async function runAdversarialReviews(
  run: RunCmd,
  worktreePath: string,
  prNumber: number,
  description: string,
  logger: { info(m: string): void; warn(m: string): void; error(m: string): void },
): Promise<ReviewResult[]> {
  const engines: AgentEngine[] = ["codex", "claude", "gemini"];
  const available = engines.filter((e) => isEngineAvailable(e));

  if (available.length === 0) {
    logger.warn("[GodMode][Coding] No AI reviewers available for adversarial review");
    return [];
  }

  // Fetch the PR diff once for all reviewers
  let diff = "";
  try {
    const { stdout, exitCode } = await run(
      ["gh", "pr", "diff", String(prNumber)],
      { timeoutMs: 30_000, cwd: worktreePath },
    );
    if (exitCode === 0) diff = stdout;
  } catch {
    logger.warn("[GodMode][Coding] Could not fetch PR diff for review");
    return [];
  }

  if (!diff || diff.trim().length < 10) {
    return [{ engine: "claude", status: "skipped", comment: "Empty diff" }];
  }

  // Truncate diff to avoid blowing context windows (keep first ~8000 lines)
  const diffLines = diff.split("\n");
  const truncatedDiff = diffLines.length > 8000
    ? diffLines.slice(0, 8000).join("\n") + "\n\n[... diff truncated ...]"
    : diff;

  const reviewPrompt = [
    `Review this pull request (#${prNumber}): ${description}`,
    "",
    "Focus on:",
    "- Logic errors, bugs, race conditions",
    "- Security issues (injection, auth bypass, data leaks)",
    "- Missing error handling for edge cases",
    "- Performance problems (N+1 queries, unnecessary re-renders, memory leaks)",
    "",
    "DO NOT comment on style, formatting, naming, or minor suggestions.",
    "Only flag issues that would cause bugs or security problems in production.",
    "",
    "If you find critical issues, start your response with CRITICAL: followed by the issue.",
    "If you find no significant issues, respond with: LGTM - No critical issues found.",
    "",
    "Be concise. Max 500 words.",
    "",
    "```diff",
    truncatedDiff,
    "```",
  ].join("\n");

  // Run all available reviewers in parallel
  const reviewPromises = available.map(async (engine): Promise<ReviewResult> => {
    try {
      const bin = resolveAgentBin(engine);
      let args: string[];

      switch (engine) {
        case "codex":
          // Codex has a dedicated review command
          args = ["exec", "review", "--", `--pr=${prNumber}`];
          try {
            const { exitCode } = await run(
              [bin, ...args],
              { timeoutMs: 180_000, cwd: worktreePath },
            );
            // Codex review posts directly to the PR
            return {
              engine,
              status: exitCode === 0 ? "passed" : "failed",
              comment: exitCode === 0 ? "Codex review posted to PR" : "Codex review failed",
            };
          } catch {
            // Fall back to prompt-based review
            args = ["exec", reviewPrompt];
          }
          break;
        case "claude":
          args = ["-p", reviewPrompt, "--dangerously-skip-permissions"];
          break;
        case "gemini":
          args = ["-p", reviewPrompt];
          break;
      }

      // Run the review agent and capture output
      const reviewOutput = await new Promise<string>((resolve) => {
        let output = "";
        const child = spawn(bin, args, {
          cwd: worktreePath,
          stdio: ["ignore", "pipe", "pipe"],
          env: {
            ...buildReviewEnv(),
            ...(engine === "codex" && process.env.OPENAI_API_KEY
              ? { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
              : {}),
            ...(engine === "gemini" && process.env.GEMINI_API_KEY
              ? { GEMINI_API_KEY: process.env.GEMINI_API_KEY }
              : {}),
          },
        });

        child.stdout?.on("data", (d: Buffer) => { output += d.toString(); });
        child.stderr?.on("data", (d: Buffer) => { output += d.toString(); });

        const timeout = setTimeout(() => {
          try { child.kill(); } catch { /* */ }
          resolve(output || "Review timed out");
        }, 180_000);

        child.on("exit", () => {
          clearTimeout(timeout);
          resolve(output);
        });

        child.on("error", () => {
          clearTimeout(timeout);
          resolve("Review spawn failed");
        });
      });

      // Post the review as a comment on the PR
      const commentBody = `## ${engine.charAt(0).toUpperCase() + engine.slice(1)} Code Review\n\n${reviewOutput.slice(0, 4000)}`;
      try {
        await run(
          ["gh", "pr", "comment", String(prNumber), "--body", commentBody],
          { timeoutMs: 15_000, cwd: worktreePath },
        );
      } catch {
        // Comment posting failed — log but don't fail
        logger.warn(`[GodMode][Coding] Failed to post ${engine} review comment on PR #${prNumber}`);
      }

      const hasCritical = reviewOutput.toLowerCase().includes("critical:");
      return {
        engine,
        status: hasCritical ? "failed" : "passed",
        comment: reviewOutput.slice(0, 500),
      };
    } catch (err) {
      return { engine, status: "skipped", comment: String(err).slice(0, 200) };
    }
  });

  const results = await Promise.allSettled(reviewPromises);
  return results.map((r) =>
    r.status === "fulfilled" ? r.value : { engine: "claude" as AgentEngine, status: "skipped" as const },
  );
}

function buildReviewEnv(): Record<string, string> {
  const parentPath = process.env.PATH ?? "";
  const env: Record<string, string> = {
    PATH: parentPath.includes("/opt/homebrew/bin")
      ? parentPath
      : `/opt/homebrew/bin:${parentPath}`,
    HOME: process.env.HOME ?? "",
    USER: process.env.USER ?? "",
    SHELL: process.env.SHELL ?? "/bin/zsh",
    LANG: process.env.LANG ?? "en_US.UTF-8",
    TERM: process.env.TERM ?? "xterm-256color",
  };
  if (process.env.ANTHROPIC_API_KEY) env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  return env;
}

// ── Orchestrator ────────────────────────────────────────────────

export type LaunchTaskParams = {
  task: string;
  repoRoot: string;
  model?: string;
  thinking?: string;
  scopeGlobs?: string[];
  mode?: CodingTaskMode;
};

export type LaunchTaskResult = {
  taskId: string;
  status: "started" | "queued" | "setup_required";
  reason: string;
  branch: string;
  worktreePath: string;
  scopeGlobs: string[];
  parallelSafe: boolean;
  scopeRationale: string;
  queuePosition?: number;
  setupInstructions?: string;
  message?: string;
};

export type TaskCompletionCallback = (task: CodingTask) => void | Promise<void>;

export class CodingOrchestrator {
  private api: OpenClawPluginApi;
  private logger: { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };
  private onTaskCompletedCallbacks: TaskCompletionCallback[] = [];

  constructor(api: OpenClawPluginApi) {
    this.api = api;
    this.logger = api.logger;
  }

  /**
   * Register a callback that fires whenever a task completes (done or failed).
   * Used to wire up notifications for detached agent processes.
   */
  onTaskCompleted(cb: TaskCompletionCallback): void {
    this.onTaskCompletedCallbacks.push(cb);
  }

  private async fireTaskCompleted(task: CodingTask): Promise<void> {
    for (const cb of this.onTaskCompletedCallbacks) {
      try {
        await cb(task);
      } catch (err) {
        this.logger.warn(`[GodMode][Coding] onTaskCompleted callback error: ${String(err)}`);
      }
    }
  }

  /**
   * Check if the GitHub CLI is installed and authenticated.
   * Returns a friendly setup message if not, or undefined if all good.
   */
  async checkGitHubReady(): Promise<string | undefined> {
    // Check if gh is installed
    try {
      const { exitCode } = await this.run(["which", "gh"], { timeoutMs: 5_000 });
      if (exitCode !== 0) {
        return [
          "GitHub isn't set up on this machine yet. No worries — here's how to get it going:",
          "",
          "Step 1: Install the GitHub CLI",
          "  Open Terminal and paste this:",
          "  brew install gh",
          "",
          "  (If you don't have Homebrew, install it first: https://brew.sh)",
          "",
          "Step 2: Log into GitHub",
          "  gh auth login",
          "",
          "  It'll ask you a few questions:",
          "  • Where do you use GitHub? → GitHub.com",
          "  • How do you want to log in? → Login with a web browser",
          "  • It'll give you a code — copy it, press Enter, and paste it in the browser",
          "",
          "Step 3: Come back and try again!",
          "  Once you're logged in, just ask me to build your project again.",
          "",
          "That's it — takes about 2 minutes. I'll handle everything else from there.",
        ].join("\n");
      }
    } catch {
      return [
        "GitHub isn't set up on this machine yet. No worries — here's how to get it going:",
        "",
        "Step 1: Install the GitHub CLI",
        "  Open Terminal and paste this:",
        "  brew install gh",
        "",
        "  (If you don't have Homebrew, install it first: https://brew.sh)",
        "",
        "Step 2: Log into GitHub",
        "  gh auth login",
        "",
        "  Follow the prompts — it'll open your browser to confirm.",
        "",
        "Step 3: Come back and try again!",
        "",
        "Takes about 2 minutes. I'll handle everything else from there.",
      ].join("\n");
    }

    // gh is installed — check if authenticated
    try {
      const { exitCode, stdout } = await this.run(["gh", "auth", "status"], { timeoutMs: 10_000 });
      if (exitCode !== 0) {
        return [
          "GitHub CLI is installed but you're not logged in yet. Quick fix:",
          "",
          "Open Terminal and run:",
          "  gh auth login",
          "",
          "It'll ask you a few questions:",
          "  • Where do you use GitHub? → GitHub.com",
          "  • How do you want to log in? → Login with a web browser",
          "  • It'll give you a code — copy it, press Enter, and paste it in the browser",
          "",
          "Once you're logged in, come back and ask me again. I'll take it from there!",
        ].join("\n");
      }
      // Check stdout for the account name (nice to have for logging)
      const acctMatch = stdout.match(/Logged in to [^ ]+ account (\S+)/i) ?? stdout.match(/Logged in to [^ ]+ as (\S+)/i);
      if (acctMatch) {
        this.logger.info(`[GodMode][Coding] GitHub authenticated as ${acctMatch[1]}`);
      }
    } catch {
      return [
        "I couldn't verify your GitHub login. Try running this in Terminal:",
        "",
        "  gh auth login",
        "",
        "Follow the prompts, then come back and try again.",
      ].join("\n");
    }

    return undefined; // all good
  }

  private config(): CodingConfig {
    return (this.api.pluginConfig as Record<string, unknown>)?.coding as CodingConfig ?? {};
  }

  private maxWriters(): number {
    const raw = this.config().maxParallelWriters;
    return typeof raw === "number" && raw >= 1 ? Math.floor(raw) : 1;
  }

  isEnabled(): boolean {
    return this.config().enabled !== false;
  }

  private run: RunCmd = async (argv, opts) => {
    const result = await this.api.runtime.system.runCommandWithTimeout(argv, {
      timeoutMs: opts.timeoutMs,
      cwd: opts.cwd,
    });
    return { stdout: result.stdout ?? "", exitCode: result.code ?? 1 };
  };

  /** Expose run helper for SwarmPipeline to reuse. */
  async runCommand(argv: string[], opts: { timeoutMs: number; cwd?: string }): Promise<{ stdout: string; exitCode: number }> {
    return this.run(argv, opts);
  }

  async launchTask(params: LaunchTaskParams): Promise<LaunchTaskResult> {
    const { task, repoRoot } = params;
    const mode = params.mode ?? classifyTaskMode(task);
    const scope = inferScope(task, params.scopeGlobs);
    const taskId = newTaskId(task);
    const branch = `task/${taskId}`;
    const worktreePath = path.join(repoRoot, ".worktrees", taskId);

    // Pre-flight: check GitHub CLI is installed and authenticated
    const ghIssue = await this.checkGitHubReady();
    if (ghIssue) {
      this.logger.warn("[GodMode][Coding] GitHub not ready, returning setup instructions");
      return {
        taskId,
        status: "setup_required",
        reason: "GitHub CLI not set up",
        branch,
        worktreePath,
        scopeGlobs: scope.scopeGlobs,
        parallelSafe: scope.parallelSafe,
        scopeRationale: scope.rationale,
        setupInstructions: ghIssue,
      };
    }

    // Bootstrap repo if directory doesn't exist or isn't a git repo
    if (!(await isGitRepo(this.run, repoRoot))) {
      const repoName = path.basename(repoRoot);
      const visibility = this.config().defaultRepoVisibility ?? "private";
      this.logger.info(`[GodMode][Coding] No git repo at ${repoRoot}, bootstrapping ${repoName} (${visibility})`);
      const bootstrap = await bootstrapRepo(this.run, repoRoot, repoName, visibility);
      if (!bootstrap.created) {
        this.logger.error(`[GodMode][Coding] Repo bootstrap failed: ${bootstrap.error}`);
        return {
          taskId,
          status: "started",
          reason: `repo bootstrap failed: ${bootstrap.error}`,
          branch,
          worktreePath,
          scopeGlobs: scope.scopeGlobs,
          parallelSafe: scope.parallelSafe,
          scopeRationale: scope.rationale,
        };
      }
      this.logger.info(`[GodMode][Coding] Bootstrapped repo ${repoName} at ${repoRoot}`);
    }

    const { result } = await updateCodingTaskState((state) => {
      // Reap stale tasks: "running" with no live process and older than threshold
      const now = Date.now();
      for (const t of state.tasks) {
        if (
          (t.status === "running" || t.status === "validating") &&
          !isProcessAlive(t.pid) &&
          t.startedAt &&
          now - t.startedAt > STALE_TASK_MAX_AGE_MS
        ) {
          this.logger.warn(`[GodMode][Coding] Reaping stale task ${t.id} (started ${Math.round((now - t.startedAt) / 60000)}min ago, no live process)`);
          t.status = "failed";
          t.error = "stale — process not found, auto-reaped";
          t.completedAt = now;
        }
      }

      const activeTasks = state.tasks.filter(
        (t) => t.status === "running" || t.status === "validating",
      );
      const decision = decideDispatch(mode, scope.scopeGlobs, scope.parallelSafe, activeTasks, this.maxWriters());

      const newTask: CodingTask = {
        id: taskId,
        description: task,
        status: decision.start ? "running" : "queued",
        mode,
        repoRoot,
        branch,
        worktreePath,
        scopeGlobs: scope.scopeGlobs,
        parallelSafe: scope.parallelSafe,
        model: params.model,
        thinking: params.thinking,
        createdAt: Date.now(),
        startedAt: decision.start ? Date.now() : undefined,
      };
      state.tasks.push(newTask);

      const queuePosition = decision.start
        ? undefined
        : state.tasks.filter((t) => t.status === "queued").length;

      return { decision, queuePosition };
    });

    if (result.decision.start) {
      // Create worktree and branch
      try {
        const baseBranch = await gitCurrentBranch(this.run, repoRoot);
        await createWorktree(this.run, repoRoot, worktreePath, branch, baseBranch);
        this.logger.info(`[GodMode][Coding] Created worktree ${worktreePath} on branch ${branch}`);
      } catch (err) {
        this.logger.error(`[GodMode][Coding] Worktree creation failed: ${String(err)}`);
        await this.markTaskFailed(taskId, `worktree creation failed: ${String(err)}`);
        return {
          taskId,
          status: "started",
          reason: `worktree creation failed: ${String(err)}`,
          branch,
          worktreePath,
          scopeGlobs: scope.scopeGlobs,
          parallelSafe: scope.parallelSafe,
          scopeRationale: scope.rationale,
        };
      }
    }

    return {
      taskId,
      status: result.decision.start ? "started" : "queued",
      reason: result.decision.reason,
      branch,
      worktreePath,
      scopeGlobs: scope.scopeGlobs,
      parallelSafe: scope.parallelSafe,
      scopeRationale: scope.rationale,
      queuePosition: result.queuePosition,
    };
  }

  /**
   * Spawn a Claude Code agent in the worktree as a detached child process.
   * On process exit, handleTaskCompleted runs validation gates, creates PR,
   * and sends notifications automatically.
   */
  async spawnCodingAgent(params: {
    taskId: string;
    task: string;
    worktreePath: string;
    branch: string;
    scopeGlobs: string[];
    model?: string;
  }): Promise<{ spawned: boolean; error?: string; pid?: number }> {
    const { taskId, task, worktreePath, branch, scopeGlobs, model } = params;

    // Fetch active guardrails to inject into the agent prompt
    let guardrailsBlock = "";
    try {
      guardrailsBlock = await formatGuardrailsForPrompt();
    } catch {
      // Non-fatal — agent runs without guardrail awareness
    }

    const prompt = [
      "You are a coding agent working in an isolated git worktree.",
      "",
      "## Task",
      task,
      "",
      "## Environment",
      `- Working directory: ${worktreePath}`,
      `- Branch: ${branch}`,
      `- Scope: ${scopeGlobs.join(", ")}`,
      "",
      "## Safety Rules",
      "- NEVER merge your branch into main. Only push your branch.",
      "- NEVER run `git merge`, `git checkout main`, or `git switch main`.",
      "- NEVER modify files outside the specified scope.",
      "- If you encounter merge conflicts, stop and report — do not force-resolve.",
      "- Do not run destructive commands (rm -rf, git reset --hard) on the main worktree.",
      "",
      ...(guardrailsBlock ? [guardrailsBlock, ""] : []),
      "## Instructions",
      "1. Complete the task above.",
      "2. Keep changes within the specified scope.",
      "3. Commit all changes with a clear, descriptive message.",
      `4. Push the branch: \`git push -u origin ${branch}\``,
      "5. When done, output a brief summary of what you built/changed.",
    ].join("\n");

    try {
      // Resolve full claude binary path so detached processes find it
      // regardless of PATH inheritance (brew installs to /opt/homebrew/bin)
      const claudeBin = resolveClaudeBin();

      const args = ["-p", prompt, "--verbose", "--dangerously-skip-permissions"];
      if (model) args.push("--model", model);

      // Whitelist env vars for the child process — avoid leaking all parent secrets
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

      const child = spawn(claudeBin, args, {
        cwd: worktreePath,
        detached: true,
        stdio: "ignore",
        env: childEnv,
      });

      const pid = child.pid;

      // Store PID in task state for liveness checks
      if (pid) {
        updateCodingTaskState((state) => {
          const t = state.tasks.find((t) => t.id === taskId);
          if (t) t.pid = pid;
        }).catch(() => {});
      }

      child.on("exit", (code) => {
        this.logger.info(`[GodMode][Coding] Agent for task ${taskId} exited (code=${code})`);
        this.handleTaskCompleted({
          label: taskId,
          outcome: code === 0 ? "ok" : "error",
          error: code !== 0 ? `Agent exited with code ${code}` : undefined,
        }).catch((err) => {
          this.logger.error(`[GodMode][Coding] handleTaskCompleted error for ${taskId}: ${String(err)}`);
        });
      });

      child.on("error", (err) => {
        this.logger.error(`[GodMode][Coding] Agent spawn error for task ${taskId}: ${String(err)}`);
        this.markTaskFailed(taskId, `spawn error: ${String(err)}`).catch(() => {});
      });

      child.unref();
      this.logger.info(`[GodMode][Coding] Spawned coding agent for task ${taskId} (pid=${pid})`);
      return { spawned: true, pid: pid ?? undefined };
    } catch (err) {
      return { spawned: false, error: String(err) };
    }
  }

  async handleTaskCompleted(params: {
    childSessionKey?: string;
    label?: string;
    outcome?: string;
    error?: string;
  }): Promise<{ task?: CodingTask; nextReady?: CodingTask }> {
    const { result } = await updateCodingTaskState(async (state) => {
      // Find the task by label (which is the taskId) or childSessionKey
      const task = state.tasks.find(
        (t) =>
          (t.status === "running" || t.status === "validating") &&
          (t.id === params.label || t.childSessionKey === params.childSessionKey),
      );
      if (!task) return { task: undefined, nextReady: undefined };

      if (params.outcome === "ok" || params.outcome === "error" || params.outcome === "timeout") {
        task.status = "validating";
        task.completedAt = Date.now();

        // Run validation gates
        const gateResult = await runValidationGates(this.run, task.worktreePath, this.config().validation);

        if (gateResult.passed) {
          // Create PR
          const pr = await createPullRequest(this.run, task.worktreePath, task.branch, task.description);
          if (pr) {
            task.prNumber = pr.prNumber;
            task.prUrl = pr.prUrl;

            // Run adversarial reviews — BLOCKING. Results gate merge.
            const reviews = await runAdversarialReviews(
              this.run, task.worktreePath, pr.prNumber, task.description, this.logger,
            );
            task.reviews = reviews;

            const reviewPassed = reviews.filter((r) => r.status === "passed").length;
            const reviewFailed = reviews.filter((r) => r.status === "failed").length;
            const reviewSkipped = reviews.filter((r) => r.status === "skipped").length;
            this.logger.info(
              `[GodMode][Coding] Adversarial reviews for PR #${pr.prNumber}: ${reviewPassed} passed, ${reviewFailed} critical, ${reviewSkipped} skipped`,
            );

            if (reviewFailed > 0) {
              // CRITICAL issues found — do NOT merge, task fails
              task.status = "failed";
              task.error = `PR #${pr.prNumber} blocked: ${reviewFailed} reviewer(s) found CRITICAL issues`;
              this.logger.warn(`[GodMode][Coding] Task ${task.id} blocked by reviews: ${reviewFailed} critical`);
            } else {
              // Reviews passed — approve and merge
              try {
                await this.run(
                  ["gh", "pr", "review", String(pr.prNumber), "--approve", "--body", "All automated reviews passed. Approved by GodMode."],
                  { timeoutMs: 15_000, cwd: task.worktreePath },
                );
              } catch {
                this.logger.warn(`[GodMode][Coding] gh pr review --approve failed for PR #${pr.prNumber}, continuing to merge`);
              }

              // Merge — only if main is clean to avoid losing uncommitted work
              const mainClean = await isWorkingTreeClean(this.run, task.repoRoot);
              if (!mainClean) {
                this.logger.warn(
                  `[GodMode][Coding] Skipping merge for PR #${pr.prNumber} — main has uncommitted changes. PR remains open.`,
                );
              } else {
                const merged = await mergePullRequest(this.run, task.worktreePath, pr.prNumber);
                if (merged) {
                  this.logger.info(`[GodMode][Coding] Merged PR #${pr.prNumber} for task ${task.id}`);
                } else {
                  this.logger.warn(`[GodMode][Coding] Merge failed for PR #${pr.prNumber}, PR remains open`);
                }
              }

              // Task enters "review" — human must verify and click Done
              task.status = "review";
              this.logger.info(`[GodMode][Coding] Task ${task.id} awaiting human review. PR: ${pr.prUrl}`);
            }
          } else {
            // No PR created — still mark as review for human to check
            task.status = "review";
            this.logger.info(`[GodMode][Coding] Task ${task.id} completed (no PR). Awaiting human review.`);
          }
        } else {
          task.status = "failed";
          task.error = gateResult.details;
          this.logger.warn(`[GodMode][Coding] Task ${task.id} failed gates: ${gateResult.details.slice(0, 200)}`);
        }
      } else {
        task.status = "failed";
        task.error = params.error ?? params.outcome ?? "unknown";
        task.completedAt = Date.now();
      }

      // Drain queue: find next task that can start
      const nextReady = this.findNextStartable(state);

      return { task, nextReady };
    });

    // Fire completion callbacks (notifications, etc.)
    if (result.task && (result.task.status === "done" || result.task.status === "failed" || result.task.status === "review")) {
      this.fireTaskCompleted(result.task).catch(() => {});
    }

    // If a queued task is now ready, prepare its worktree
    if (result.nextReady) {
      try {
        const baseBranch = await gitCurrentBranch(this.run, result.nextReady.repoRoot);
        await createWorktree(this.run, result.nextReady.repoRoot, result.nextReady.worktreePath, result.nextReady.branch, baseBranch);
        await updateCodingTaskState((state) => {
          const t = state.tasks.find((t) => t.id === result.nextReady!.id);
          if (t) {
            t.status = "running";
            t.startedAt = Date.now();
          }
        });
        this.logger.info(`[GodMode][Coding] Auto-started queued task ${result.nextReady.id}`);
      } catch (err) {
        this.logger.error(`[GodMode][Coding] Failed to auto-start task ${result.nextReady.id}: ${String(err)}`);
      }
    }

    return result;
  }

  private findNextStartable(state: CodingTaskState): CodingTask | undefined {
    const queued = state.tasks
      .filter((t) => t.status === "queued")
      .sort((a, b) => a.createdAt - b.createdAt);
    const active = state.tasks.filter(
      (t) => t.status === "running" || t.status === "validating",
    );

    for (const task of queued) {
      const decision = decideDispatch(
        task.mode,
        task.scopeGlobs,
        task.parallelSafe,
        active,
        this.maxWriters(),
      );
      if (decision.start) return task;
    }
    return undefined;
  }

  async markTaskFailed(taskId: string, error: string): Promise<void> {
    await updateCodingTaskState((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = "failed";
        task.error = error;
        task.completedAt = Date.now();
      }
    });
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const { result } = await updateCodingTaskState((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task || task.status === "done" || task.status === "failed") return false;

      const wasQueued = task.status === "queued";
      task.status = "failed";
      task.error = "cancelled by user";
      task.completedAt = Date.now();

      // Clean up worktree if it was running
      if (!wasQueued && task.worktreePath) {
        // Fire-and-forget cleanup
        removeWorktree(this.run, task.repoRoot, task.worktreePath).catch(() => {});
      }
      return true;
    });
    return result;
  }

  async approveTask(taskId: string): Promise<{ approved: boolean; error?: string }> {
    const { result } = await updateCodingTaskState((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return { approved: false, error: "Task not found" };
      if (task.status !== "review") {
        return { approved: false, error: `Cannot approve task with status "${task.status}". Only "review" tasks can be approved.` };
      }
      task.status = "done";
      task.completedAt = Date.now();
      return { approved: true };
    });
    return result;
  }

  async listTasks(status?: CodingTaskStatus): Promise<CodingTask[]> {
    const state = await readCodingTaskState();
    if (status) return state.tasks.filter((t) => t.status === status);
    return state.tasks;
  }

  async statusSummary(): Promise<{
    enabled: boolean;
    maxWriters: number;
    activeTasks: number;
    queuedTasks: number;
    doneTasks: number;
    reviewTasks: number;
    failedTasks: number;
    swarmTasks: number;
    swarmStages: Array<{ taskId: string; currentStage: string; stages: unknown }>;
  }> {
    const state = await readCodingTaskState();
    const active = state.tasks.filter((t) => t.status === "running" || t.status === "validating");
    const swarmActive = active.filter((t) => t.swarm?.enabled);
    return {
      enabled: this.isEnabled(),
      maxWriters: this.maxWriters(),
      activeTasks: active.length,
      queuedTasks: state.tasks.filter((t) => t.status === "queued").length,
      doneTasks: state.tasks.filter((t) => t.status === "done").length,
      reviewTasks: state.tasks.filter((t) => t.status === "review").length,
      failedTasks: state.tasks.filter((t) => t.status === "failed").length,
      swarmTasks: swarmActive.length,
      swarmStages: swarmActive.map((t) => ({
        taskId: t.id,
        currentStage: t.swarm!.currentStage,
        stages: t.swarm!.stages,
      })),
    };
  }

  /**
   * Register a child session key against a known task so `subagent_ended`
   * can correlate back to it.
   */
  async registerTaskSpawn(taskId: string, childSessionKey: string): Promise<void> {
    await updateCodingTaskState((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) task.childSessionKey = childSessionKey;
    });
  }

  /**
   * Check whether a sessions_spawn call has a matching orchestrated task.
   * Returns the task if found, or undefined if this spawn was NOT set up
   * through the coding_task tool.
   */
  async findTaskForSpawn(label?: string): Promise<CodingTask | undefined> {
    if (!label) return undefined;
    const state = await readCodingTaskState();
    return state.tasks.find(
      (t) => t.id === label && (t.status === "running" || t.status === "queued"),
    );
  }

  /**
   * Recover orphaned tasks after a gateway restart.
   * For each task in "running"/"validating" status:
   * - Dead process → run handleTaskCompleted (validation gates + PR)
   * - Live process → poll until exit, then run handleTaskCompleted
   */
  async recoverOrphanedTasks(): Promise<{ recovered: number; reattached: number }> {
    // Lazy import to avoid circular dependency
    const { SwarmPipeline } = await import("./swarm-pipeline.js");
    const pipeline = new SwarmPipeline(this, this.logger);

    const state = await readCodingTaskState();
    const active = state.tasks.filter(
      (t) => t.status === "running" || t.status === "validating",
    );

    if (active.length === 0) return { recovered: 0, reattached: 0 };

    let recovered = 0;
    let reattached = 0;

    for (const task of active) {
      // For swarm tasks, check the current stage's PID
      const pid = task.swarm?.enabled
        ? task.swarm.stages[task.swarm.currentStage]?.pid ?? task.pid
        : task.pid;
      const alive = isProcessAlive(pid);

      if (!alive) {
        this.logger.info(
          `[GodMode][Coding] Recovering orphaned task ${task.id} (pid ${pid ?? "unknown"} is dead)${task.swarm?.enabled ? ` [swarm stage: ${task.swarm.currentStage}]` : ""}`,
        );
        try {
          if (task.swarm?.enabled) {
            // Swarm task — advance the pipeline stage
            await pipeline.handleStageCompleted({
              taskId: task.id,
              stage: task.swarm.currentStage,
              exitCode: 0,
            });
          } else {
            // Single-agent task — run completion flow
            await this.handleTaskCompleted({
              label: task.id,
              outcome: "ok",
            });
          }
          recovered++;
        } catch (err) {
          this.logger.error(
            `[GodMode][Coding] Recovery failed for task ${task.id}: ${String(err)}`,
          );
        }
      } else if (pid) {
        // Process is still alive — poll until it exits, then complete
        this.logger.info(
          `[GodMode][Coding] Re-attaching to live task ${task.id} (pid ${pid})${task.swarm?.enabled ? ` [swarm stage: ${task.swarm.currentStage}]` : ""}`,
        );
        if (task.swarm?.enabled) {
          this.pollSwarmStageUntilExit(pipeline, task.id, task.swarm.currentStage, pid);
        } else {
          this.pollUntilExit(task.id, pid);
        }
        reattached++;
      }
    }

    return { recovered, reattached };
  }

  /** Poll a PID every 5s until it exits, then run handleTaskCompleted. */
  private pollUntilExit(taskId: string, pid: number): void {
    const interval = setInterval(() => {
      if (!isProcessAlive(pid)) {
        clearInterval(interval);
        this.logger.info(`[GodMode][Coding] Polled task ${taskId} — pid ${pid} exited`);
        this.handleTaskCompleted({
          label: taskId,
          outcome: "ok",
        }).catch((err) => {
          this.logger.error(
            `[GodMode][Coding] handleTaskCompleted error for polled task ${taskId}: ${String(err)}`,
          );
        });
      }
    }, 5_000);

    if (interval.unref) interval.unref();
  }

  /** Poll a swarm stage PID every 5s until it exits, then advance the pipeline. */
  private pollSwarmStageUntilExit(
    pipeline: { handleStageCompleted: (p: { taskId: string; stage: SwarmStage; exitCode: number }) => Promise<void> },
    taskId: string,
    stage: SwarmStage,
    pid: number,
  ): void {
    const interval = setInterval(() => {
      if (!isProcessAlive(pid)) {
        clearInterval(interval);
        this.logger.info(`[GodMode][Coding] Polled swarm task ${taskId} stage "${stage}" — pid ${pid} exited`);
        pipeline.handleStageCompleted({
          taskId,
          stage,
          exitCode: 0,
        }).catch((err) => {
          this.logger.error(
            `[GodMode][Coding] Swarm stage completion error for ${taskId}: ${String(err)}`,
          );
        });
      }
    }, 5_000);

    if (interval.unref) interval.unref();
  }
}
