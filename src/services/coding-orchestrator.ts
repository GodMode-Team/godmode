import fs from "node:fs/promises";
import path from "node:path";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { GODMODE_ROOT } from "../data-paths.js";
import {
  classifyTaskMode,
  newTaskId,
  readCodingTaskState,
  updateCodingTaskState,
  type CodingTask,
  type CodingTaskMode,
  type CodingTaskState,
  type CodingTaskStatus,
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
      return { valid: false, error: "Plan doc is still in draft — needs Caleb's approval before dispatching" };
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

// ── Validation gates ────────────────────────────────────────────

type GateResult = { passed: boolean; details: string };

async function runValidationGates(
  run: RunCmd,
  worktreePath: string,
  config: CodingConfig["validation"],
): Promise<GateResult> {
  const failures: string[] = [];

  if (config?.lint !== false) {
    try {
      const { exitCode, stdout } = await run(["pnpm", "lint"], { timeoutMs: 60_000, cwd: worktreePath });
      if (exitCode !== 0) failures.push(`lint failed: ${stdout.slice(0, 200)}`);
    } catch (err) {
      failures.push(`lint error: ${String(err).slice(0, 200)}`);
    }
  }

  if (config?.typecheck !== false) {
    try {
      const { exitCode, stdout } = await run(["pnpm", "tsc", "--noEmit"], { timeoutMs: 120_000, cwd: worktreePath });
      if (exitCode !== 0) failures.push(`typecheck failed: ${stdout.slice(0, 200)}`);
    } catch (err) {
      failures.push(`typecheck error: ${String(err).slice(0, 200)}`);
    }
  }

  if (config?.test !== false) {
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
  spawnInstructions?: string;
  setupInstructions?: string;
};

export class CodingOrchestrator {
  private api: OpenClawPluginApi;
  private logger: { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };

  constructor(api: OpenClawPluginApi) {
    this.api = api;
    this.logger = api.logger;
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

    const spawnInstructions = result.decision.start
      ? [
          `Worktree ready at: ${worktreePath}`,
          `Branch: ${branch}`,
          `Scope: ${scope.scopeGlobs.join(", ")}`,
          "",
          `Now call sessions_spawn with:`,
          `  task: "${task}"`,
          `  label: "${taskId}"`,
          params.model ? `  model: "${params.model}"` : undefined,
          params.thinking ? `  thinking: "${params.thinking}"` : undefined,
          "",
          `The spawned agent should work exclusively in ${worktreePath}.`,
          `When done, it should commit changes and push the branch.`,
        ]
          .filter(Boolean)
          .join("\n")
      : undefined;

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
      spawnInstructions,
    };
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

            // Auto-merge if configured
            if (this.config().autoMerge) {
              const merged = await mergePullRequest(this.run, task.worktreePath, pr.prNumber);
              if (merged) {
                this.logger.info(`[GodMode][Coding] Auto-merged PR #${pr.prNumber} for task ${task.id}`);
              } else {
                this.logger.warn(`[GodMode][Coding] Auto-merge failed for PR #${pr.prNumber}, PR remains open`);
              }
            }
          }
          task.status = "done";
          this.logger.info(`[GodMode][Coding] Task ${task.id} completed. PR: ${pr?.prUrl ?? "none"}`);
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
    failedTasks: number;
  }> {
    const state = await readCodingTaskState();
    return {
      enabled: this.isEnabled(),
      maxWriters: this.maxWriters(),
      activeTasks: state.tasks.filter((t) => t.status === "running" || t.status === "validating").length,
      queuedTasks: state.tasks.filter((t) => t.status === "queued").length,
      doneTasks: state.tasks.filter((t) => t.status === "done").length,
      failedTasks: state.tasks.filter((t) => t.status === "failed").length,
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
}
