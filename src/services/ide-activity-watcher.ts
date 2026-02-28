/**
 * IDE Activity Watcher — near-real-time sync of IDE activity into GodMode agent-log.
 *
 * Two watch channels:
 * 1. Claude Code sessions — watches ~/.claude/projects/ JSONL files,
 *    debounces 30s, then calls syncClaudeCodeSessions().
 * 2. Workspace git commits — watches .git/refs/heads/ per workspace,
 *    debounces 10s, then logs new commits as agent-log "activity" entries.
 */

import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import chokidar, { type FSWatcher } from "chokidar";
import { appendEntry } from "../lib/agent-log.js";
import { syncClaudeCodeSessions } from "./claude-code-sync.js";
import { DATA_DIR, localDateString } from "../data-paths.js";
import { readWorkspaceConfig, type WorkspaceConfigEntry } from "../lib/workspaces-config.js";

const execFile = promisify(execFileCb);

const CLAUDE_PROJECTS_DIR = path.join(os.homedir(), ".claude", "projects");
const STATE_PATH = path.join(DATA_DIR, "ide-activity-state.json");

/** Wait 30s after last JSONL change before syncing Claude Code sessions */
const CLAUDE_SYNC_DEBOUNCE_MS = 30_000;
/** Wait 10s after last git ref change before checking for new commits */
const GIT_COMMIT_DEBOUNCE_MS = 10_000;
/** Save state to disk every 5 minutes */
const STATE_SAVE_INTERVAL_MS = 5 * 60 * 1000;

type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

type BroadcastFn = (
  event: string,
  payload: unknown,
  opts?: { dropIfSlow?: boolean },
) => void;

type IDEActivityState = {
  /** Per-workspace last-known git commit SHA */
  lastCommitSHA: Record<string, string>;
  /** Timestamp of last successful Claude Code sync trigger */
  lastClaudeSyncAt: number;
};

function createDefaultLogger(): Logger {
  return {
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg),
  };
}

export class IDEActivityWatcher {
  private readonly log: Logger;
  private broadcastFn?: BroadcastFn;
  private started = false;
  private state: IDEActivityState = { lastCommitSHA: {}, lastClaudeSyncAt: 0 };

  // Channel 1: Claude Code session watcher
  private claudeWatcher: FSWatcher | null = null;
  private claudeSyncTimer: ReturnType<typeof setTimeout> | null = null;
  private claudeSyncRunning = false;

  // Channel 2: git commit watchers (per workspace)
  private gitWatchers = new Map<string, FSWatcher>();
  private gitDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private workspaceById = new Map<string, WorkspaceConfigEntry>();

  // Periodic state save
  private stateSaveTimer: ReturnType<typeof setInterval> | null = null;

  constructor(opts: { logger: Logger; broadcastFn?: BroadcastFn }) {
    this.log = opts.logger;
    this.broadcastFn = opts.broadcastFn;
  }

  setBroadcastFn(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  async start(workspaces: WorkspaceConfigEntry[]): Promise<void> {
    if (this.started) return;
    this.started = true;

    await this.loadState();
    this.startClaudeWatcher();

    for (const ws of workspaces) {
      await this.startGitWatcher(ws);
    }

    this.stateSaveTimer = setInterval(() => {
      void this.saveState();
    }, STATE_SAVE_INTERVAL_MS);
  }

  async stop(): Promise<void> {
    if (!this.started) return;
    this.started = false;

    // Stop Claude Code watcher
    if (this.claudeSyncTimer) {
      clearTimeout(this.claudeSyncTimer);
      this.claudeSyncTimer = null;
    }
    if (this.claudeWatcher) {
      await this.claudeWatcher.close();
      this.claudeWatcher = null;
    }

    // Stop all git watchers
    for (const [id] of this.gitWatchers) {
      await this.teardownGitWatcher(id);
    }

    // Stop state save timer
    if (this.stateSaveTimer) {
      clearInterval(this.stateSaveTimer);
      this.stateSaveTimer = null;
    }

    // Final state save
    await this.saveState();
  }

  async refresh(workspaces: WorkspaceConfigEntry[]): Promise<void> {
    if (!this.started) return;

    const newIds = new Set(workspaces.map((ws) => ws.id));
    const currentIds = new Set(this.workspaceById.keys());

    // Remove watchers for workspaces that are no longer configured
    for (const id of currentIds) {
      if (!newIds.has(id)) {
        await this.teardownGitWatcher(id);
        this.workspaceById.delete(id);
      }
    }

    // Add/update watchers
    for (const ws of workspaces) {
      const existing = this.workspaceById.get(ws.id);
      if (existing && existing.path === ws.path) {
        // Same workspace, same path — no change needed
        this.workspaceById.set(ws.id, ws);
        continue;
      }
      if (existing) {
        // Path changed — teardown old, start new
        await this.teardownGitWatcher(ws.id);
      }
      this.workspaceById.set(ws.id, ws);
      await this.startGitWatcher(ws);
    }
  }

  // ── State persistence ────────────────────────────────────────────

  private async loadState(): Promise<void> {
    try {
      const raw = await fsp.readFile(STATE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as IDEActivityState;
      if (parsed && typeof parsed === "object") {
        this.state = {
          lastCommitSHA: parsed.lastCommitSHA ?? {},
          lastClaudeSyncAt: parsed.lastClaudeSyncAt ?? 0,
        };
      }
    } catch {
      // Missing or corrupt — start fresh
      this.state = { lastCommitSHA: {}, lastClaudeSyncAt: 0 };
    }
  }

  private async saveState(): Promise<void> {
    try {
      await fsp.mkdir(path.dirname(STATE_PATH), { recursive: true });
      await fsp.writeFile(STATE_PATH, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      this.log.warn(`[IDEWatch] Failed to save state: ${String(err)}`);
    }
  }

  // ── Channel 1: Claude Code session watcher ───────────────────────

  private startClaudeWatcher(): void {
    try {
      // Check directory exists before starting watcher
      fsp.access(CLAUDE_PROJECTS_DIR).then(() => {
        if (!this.started) return;

        this.claudeWatcher = chokidar.watch(CLAUDE_PROJECTS_DIR, {
          ignoreInitial: true,
          depth: 3,
          ignored: [
            /(^|[\\/])\.git([\\/]|$)/,
            /\.lock$/,
            /node_modules/,
          ],
        });

        this.claudeWatcher.on("change", (changedPath) => {
          if (changedPath.endsWith(".jsonl")) {
            this.scheduleClaudeSync();
          }
        });

        this.claudeWatcher.on("add", (changedPath) => {
          if (changedPath.endsWith(".jsonl")) {
            this.scheduleClaudeSync();
          }
        });

        this.claudeWatcher.on("error", (err) => {
          this.log.warn(`[IDEWatch] Claude watcher error: ${String(err)}`);
        });

        this.log.info("[IDEWatch] Claude Code session watcher started");
      }).catch(() => {
        this.log.warn("[IDEWatch] ~/.claude/projects/ not found — Claude Code watcher skipped");
      });
    } catch (err) {
      this.log.warn(`[IDEWatch] Failed to start Claude watcher: ${String(err)}`);
    }
  }

  private scheduleClaudeSync(): void {
    if (this.claudeSyncTimer) {
      clearTimeout(this.claudeSyncTimer);
    }
    this.claudeSyncTimer = setTimeout(() => {
      this.claudeSyncTimer = null;
      void this.runClaudeSync();
    }, CLAUDE_SYNC_DEBOUNCE_MS);
  }

  private async runClaudeSync(): Promise<void> {
    if (this.claudeSyncRunning || !this.started) return;
    this.claudeSyncRunning = true;
    try {
      const result = await syncClaudeCodeSessions();
      if (result.synced > 0) {
        this.log.info(`[IDEWatch] Claude Code: ${result.synced} sessions synced`);
        this.broadcastAgentLogUpdate();
      }
      this.state.lastClaudeSyncAt = Date.now();
    } catch (err) {
      this.log.warn(`[IDEWatch] Claude Code sync failed: ${String(err)}`);
    } finally {
      this.claudeSyncRunning = false;
    }
  }

  // ── Channel 2: workspace git commit watcher ──────────────────────

  private async startGitWatcher(workspace: WorkspaceConfigEntry): Promise<void> {
    this.workspaceById.set(workspace.id, workspace);

    // Resolve actual git dir (handles worktrees where .git is a file)
    let gitRefsDir: string;
    try {
      const { stdout } = await execFile("git", ["rev-parse", "--git-dir"], {
        cwd: workspace.path,
        timeout: 5000,
      });
      const gitDir = stdout.trim();
      const absGitDir = path.isAbsolute(gitDir) ? gitDir : path.resolve(workspace.path, gitDir);
      gitRefsDir = path.join(absGitDir, "refs", "heads");
    } catch {
      // Not a git repo or git not available — skip
      return;
    }

    try {
      await fsp.access(gitRefsDir);
    } catch {
      // refs/heads doesn't exist yet — skip
      return;
    }

    // Seed last-known SHA if we don't have one
    if (!this.state.lastCommitSHA[workspace.id]) {
      try {
        const { stdout } = await execFile("git", ["rev-parse", "HEAD"], {
          cwd: workspace.path,
          timeout: 5000,
        });
        this.state.lastCommitSHA[workspace.id] = stdout.trim();
      } catch {
        // No commits yet — that's fine
      }
    }

    const watcher = chokidar.watch(gitRefsDir, {
      ignoreInitial: true,
      depth: 1,
    });

    watcher.on("change", () => {
      this.scheduleGitCheck(workspace.id);
    });

    watcher.on("add", () => {
      this.scheduleGitCheck(workspace.id);
    });

    watcher.on("error", (err) => {
      this.log.warn(`[IDEWatch] Git watcher error for ${workspace.name}: ${String(err)}`);
    });

    this.gitWatchers.set(workspace.id, watcher);
  }

  private scheduleGitCheck(workspaceId: string): void {
    const existing = this.gitDebounceTimers.get(workspaceId);
    if (existing) {
      clearTimeout(existing);
    }
    const timer = setTimeout(() => {
      this.gitDebounceTimers.delete(workspaceId);
      void this.checkGitCommits(workspaceId);
    }, GIT_COMMIT_DEBOUNCE_MS);
    this.gitDebounceTimers.set(workspaceId, timer);
  }

  private async checkGitCommits(workspaceId: string): Promise<void> {
    if (!this.started) return;

    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace) return;

    try {
      const { stdout: currentSHARaw } = await execFile("git", ["rev-parse", "HEAD"], {
        cwd: workspace.path,
        timeout: 5000,
      });
      const sha = currentSHARaw.trim();
      const lastSHA = this.state.lastCommitSHA[workspaceId];

      if (lastSHA === sha) return; // no new commits

      let logOutput: string;
      if (lastSHA) {
        try {
          const result = await execFile(
            "git",
            ["log", "--oneline", "--no-decorate", `${lastSHA}..${sha}`],
            { cwd: workspace.path, timeout: 5000 },
          );
          logOutput = result.stdout.trim();
        } catch {
          // lastSHA may have been rebased away — fall back to latest commit
          const result = await execFile(
            "git",
            ["log", "--oneline", "--no-decorate", "-1"],
            { cwd: workspace.path, timeout: 5000 },
          );
          logOutput = result.stdout.trim();
        }
      } else {
        const result = await execFile(
          "git",
          ["log", "--oneline", "--no-decorate", "-1"],
          { cwd: workspace.path, timeout: 5000 },
        );
        logOutput = result.stdout.trim();
      }

      if (!logOutput) {
        this.state.lastCommitSHA[workspaceId] = sha;
        return;
      }

      const lines = logOutput.split("\n").filter(Boolean);

      if (lines.length === 1) {
        const msg = lines[0].replace(/^[a-f0-9]+ /, "");
        await appendEntry({
          category: "activity",
          item: `Commit in ${workspace.name}: ${msg}`,
        });
      } else {
        const latest = lines[0].replace(/^[a-f0-9]+ /, "");
        await appendEntry({
          category: "activity",
          item: `${lines.length} commits in ${workspace.name} (latest: ${latest})`,
        });
      }

      this.state.lastCommitSHA[workspaceId] = sha;
      this.broadcastAgentLogUpdate();
      this.log.info(
        `[IDEWatch] Logged ${lines.length} commit(s) in ${workspace.name}`,
      );
    } catch (err) {
      this.log.warn(
        `[IDEWatch] Git check failed for ${workspace.name}: ${String(err)}`,
      );
    }
  }

  private async teardownGitWatcher(workspaceId: string): Promise<void> {
    const timer = this.gitDebounceTimers.get(workspaceId);
    if (timer) {
      clearTimeout(timer);
      this.gitDebounceTimers.delete(workspaceId);
    }
    const watcher = this.gitWatchers.get(workspaceId);
    if (watcher) {
      await watcher.close();
      this.gitWatchers.delete(workspaceId);
    }
  }

  // ── Broadcast helper ─────────────────────────────────────────────

  private broadcastAgentLogUpdate(): void {
    if (!this.broadcastFn) return;
    try {
      const date = localDateString();
      this.broadcastFn("agent-log:update", { date }, { dropIfSlow: true });
    } catch {
      // Non-fatal — UI will pick up changes on next poll
    }
  }
}

// ── Singleton ────────────────────────────────────────────────────────

let singleton: IDEActivityWatcher | null = null;

export function getIDEActivityWatcher(logger?: Partial<Logger>): IDEActivityWatcher {
  if (!singleton) {
    const log: Logger = {
      info: logger?.info ?? createDefaultLogger().info,
      warn: logger?.warn ?? createDefaultLogger().warn,
      error: logger?.error ?? createDefaultLogger().error,
    };
    singleton = new IDEActivityWatcher({ logger: log });
  }
  return singleton;
}

export async function startIDEActivityWatcher(
  logger?: Partial<Logger>,
): Promise<IDEActivityWatcher> {
  const watcher = getIDEActivityWatcher(logger);
  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  await watcher.start(config.workspaces);
  return watcher;
}
