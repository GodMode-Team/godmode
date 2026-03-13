import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import chokidar, { type FSWatcher } from "chokidar";
import type { WorkspaceConfigEntry, WorkspaceConfigFile } from "./workspaces-config.js";
import { readWorkspaceConfig } from "./workspaces-config.js";

const execFile = promisify(execFileCb);

type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

export type WorkspaceSyncState =
  | "synced"
  | "syncing"
  | "conflict"
  | "error"
  | "paused"
  | "unpushed";

export type WorkspaceSyncStatus = {
  status: WorkspaceSyncState;
  lastSyncAt?: number;
  lastActivityAt?: number;
  lastError?: string;
  paused?: boolean;
  dirty?: boolean;
};

function createDefaultLogger(): Logger {
  return {
    info: (message) => console.log(message),
    warn: (message) => console.warn(message),
    error: (message) => console.error(message),
  };
}

function normalizeIntervalMs(raw: string | undefined): number {
  const input = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!input) {
    return 5 * 60 * 1000;
  }
  const match = input.match(/^(\d+)(ms|s|m|h)?$/);
  if (!match) {
    return 5 * 60 * 1000;
  }
  const value = Number(match[1]);
  const unit = match[2] ?? "ms";
  if (!Number.isFinite(value) || value <= 0) {
    return 5 * 60 * 1000;
  }
  if (unit === "h") {
    return value * 60 * 60 * 1000;
  }
  if (unit === "m") {
    return value * 60 * 1000;
  }
  if (unit === "s") {
    return value * 1000;
  }
  return value;
}

function normalizeGitError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

function looksLikeConflict(message: string): boolean {
  const value = message.toLowerCase();
  return (
    value.includes("conflict") ||
    value.includes("non-fast-forward") ||
    value.includes("rebase") ||
    value.includes("merge")
  );
}

export class WorkspaceSyncService {
  private readonly log: Logger;
  private readonly status = new Map<string, WorkspaceSyncStatus>();
  private readonly pullTimers = new Map<string, ReturnType<typeof setInterval>>();
  private readonly pushTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly watchers = new Map<string, FSWatcher>();
  private readonly workspaceById = new Map<string, WorkspaceConfigEntry>();
  private readonly logFilePath = path.join(os.homedir(), "godmode", "data", "workspace-sync.log");
  private started = false;

  constructor(logger?: Partial<Logger>) {
    const fallback = createDefaultLogger();
    this.log = {
      info: logger?.info ?? fallback.info,
      warn: logger?.warn ?? fallback.warn,
      error: logger?.error ?? fallback.error,
    };
  }

  async start(): Promise<void> {
    if (this.started) {
      return;
    }
    this.started = true;
    await this.appendLog("Workspace sync service started");

    try {
      const config = await readWorkspaceConfig();
      await this.refreshFromConfig(config);
    } catch (err) {
      const message = `Workspace sync start failed: ${normalizeGitError(err)}`;
      this.log.warn(message);
      await this.appendLog(message);
    }
  }

  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }
    this.started = false;

    for (const timer of this.pullTimers.values()) {
      clearInterval(timer);
    }
    this.pullTimers.clear();

    for (const timer of this.pushTimers.values()) {
      clearTimeout(timer);
    }
    this.pushTimers.clear();

    const closeTasks: Promise<void>[] = [];
    for (const watcher of this.watchers.values()) {
      closeTasks.push(watcher.close());
    }
    this.watchers.clear();
    await Promise.allSettled(closeTasks);

    await this.appendLog("Workspace sync service stopped");
  }

  getStatus(workspaceId: string): WorkspaceSyncStatus | null {
    return this.status.get(workspaceId) ?? null;
  }

  listStatuses(): Record<string, WorkspaceSyncStatus> {
    const result: Record<string, WorkspaceSyncStatus> = {};
    for (const [id, value] of this.status.entries()) {
      result[id] = { ...value };
    }
    return result;
  }

  async refreshFromConfig(config: WorkspaceConfigFile): Promise<void> {
    if (!this.started) {
      return;
    }

    const syncable = new Map<string, WorkspaceConfigEntry>();
    for (const workspace of config.workspaces) {
      if (!workspace.sync || workspace.sync.type !== "git") {
        continue;
      }
      syncable.set(workspace.id, workspace);
    }

    for (const existingId of this.workspaceById.keys()) {
      if (syncable.has(existingId)) {
        continue;
      }
      await this.teardownWorkspace(existingId);
      this.workspaceById.delete(existingId);
      this.status.delete(existingId);
    }

    for (const [workspaceId, workspace] of syncable.entries()) {
      this.workspaceById.set(workspaceId, workspace);
      if (!this.status.has(workspaceId)) {
        this.status.set(workspaceId, {
          status: "synced",
          lastActivityAt: Date.now(),
          paused: false,
        });
      }

      if (workspace.sync?.autoPull.enabled) {
        this.ensureAutoPull(workspace);
      } else {
        const timer = this.pullTimers.get(workspaceId);
        if (timer) {
          clearInterval(timer);
          this.pullTimers.delete(workspaceId);
        }
      }

      if (workspace.sync?.autoPush.enabled) {
        await this.ensureAutoPushWatcher(workspace);
      } else {
        const watcher = this.watchers.get(workspaceId);
        if (watcher) {
          await watcher.close();
          this.watchers.delete(workspaceId);
        }
      }
    }
  }

  async manualSync(workspaceId: string): Promise<WorkspaceSyncStatus> {
    await this.ensureStarted();
    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace || !workspace.sync) {
      const status: WorkspaceSyncStatus = {
        status: "error",
        lastActivityAt: Date.now(),
        lastError: "Workspace has no git sync configuration",
      };
      this.status.set(workspaceId, status);
      return status;
    }

    await this.runPull(workspaceId, "manual");
    await this.runPush(workspaceId, "manual");

    return (
      this.status.get(workspaceId) ?? {
        status: "error",
        lastActivityAt: Date.now(),
        lastError: "Sync status unavailable",
      }
    );
  }

  /**
   * Resume sync for a workspace after conflict resolution.
   * Clears the conflict/paused state and restarts the pull interval.
   */
  async resume(workspaceId: string): Promise<void> {
    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace) return;

    this.status.set(workspaceId, {
      status: "synced",
      paused: false,
      dirty: false,
      lastActivityAt: Date.now(),
    });

    // Restart the pull timer if auto-pull is enabled
    const existingTimer = this.pullTimers.get(workspaceId);
    if (existingTimer) {
      clearInterval(existingTimer);
      this.pullTimers.delete(workspaceId);
    }
    if (workspace.sync?.autoPull.enabled) {
      this.ensureAutoPull(workspace);
    }

    await this.appendLog(`[${workspaceId}] sync resumed after conflict resolution`);
  }

  /** Cancel any pending debounce timer and push immediately. */
  async pushNow(workspaceId: string): Promise<WorkspaceSyncStatus> {
    await this.ensureStarted();
    const existing = this.pushTimers.get(workspaceId);
    if (existing) {
      clearTimeout(existing);
      this.pushTimers.delete(workspaceId);
    }
    await this.runPush(workspaceId, "manual");
    return (
      this.status.get(workspaceId) ?? {
        status: "error",
        lastActivityAt: Date.now(),
        lastError: "Push status unavailable",
      }
    );
  }

  /** Run a git pull immediately (bypasses interval timer). */
  async pullNow(workspaceId: string): Promise<WorkspaceSyncStatus> {
    await this.ensureStarted();
    await this.runPull(workspaceId, "manual");
    return (
      this.status.get(workspaceId) ?? {
        status: "error",
        lastActivityAt: Date.now(),
        lastError: "Pull status unavailable",
      }
    );
  }

  private async teardownWorkspace(workspaceId: string): Promise<void> {
    const pull = this.pullTimers.get(workspaceId);
    if (pull) {
      clearInterval(pull);
      this.pullTimers.delete(workspaceId);
    }

    const push = this.pushTimers.get(workspaceId);
    if (push) {
      clearTimeout(push);
      this.pushTimers.delete(workspaceId);
    }

    const watcher = this.watchers.get(workspaceId);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(workspaceId);
    }
  }

  private async ensureStarted(): Promise<void> {
    if (this.started) {
      return;
    }
    await this.start();
  }

  private ensureAutoPull(workspace: WorkspaceConfigEntry): void {
    if (this.pullTimers.has(workspace.id)) {
      return;
    }
    const intervalMs = normalizeIntervalMs(workspace.sync?.autoPull.interval);
    const timer = setInterval(() => {
      void this.runPull(workspace.id, "auto");
    }, intervalMs);
    this.pullTimers.set(workspace.id, timer);
  }

  private async ensureAutoPushWatcher(workspace: WorkspaceConfigEntry): Promise<void> {
    if (this.watchers.has(workspace.id)) {
      return;
    }
    const watcher = chokidar.watch(workspace.path, {
      ignoreInitial: true,
      ignored: [
        /(^|[\\/])\.git([\\/]|$)/,
        /(^|[\\/])node_modules([\\/]|$)/,
        /(^|[\\/])dist([\\/]|$)/,
        /(^|[\\/])build([\\/]|$)/,
      ],
    });

    watcher.on("all", (_event: string, changedPath: string) => {
      if (changedPath.includes(`${path.sep}.git${path.sep}`)) {
        return;
      }
      this.schedulePush(workspace.id);
    });

    this.watchers.set(workspace.id, watcher);
  }

  private schedulePush(workspaceId: string): void {
    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace?.sync?.autoPush.enabled) {
      return;
    }

    const existing = this.pushTimers.get(workspaceId);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(
      () => {
        this.pushTimers.delete(workspaceId);
        void this.runPush(workspaceId, "auto");
      },
      Math.max(1000, workspace.sync.autoPush.debounceMs),
    );

    this.pushTimers.set(workspaceId, timeout);
    this.status.set(workspaceId, {
      ...(this.status.get(workspaceId) ?? { status: "synced" }),
      status: "unpushed",
      dirty: true,
      lastActivityAt: Date.now(),
    });
  }

  private async runGit(workspace: WorkspaceConfigEntry, args: string[]): Promise<string> {
    const result = await execFile("git", args, {
      cwd: workspace.path,
      maxBuffer: 5 * 1024 * 1024,
    });
    return `${result.stdout ?? ""}${result.stderr ?? ""}`;
  }

  private async ensureRepo(workspace: WorkspaceConfigEntry): Promise<boolean> {
    try {
      await this.runGit(workspace, ["rev-parse", "--is-inside-work-tree"]);
      return true;
    } catch {
      const status: WorkspaceSyncStatus = {
        status: "error",
        lastActivityAt: Date.now(),
        lastError: "Workspace is not a git repository",
      };
      this.status.set(workspace.id, status);
      return false;
    }
  }

  /** Ensure the workspace has a .gitignore that excludes common sensitive patterns. */
  private async ensureGitignore(workspace: WorkspaceConfigEntry): Promise<void> {
    const gitignorePath = path.join(workspace.path, ".gitignore");
    try {
      await fs.access(gitignorePath);
      // .gitignore already exists, don't overwrite
    } catch {
      const defaultGitignore = [
        "# Auto-generated by workspace sync — prevent accidental secret commits",
        ".env",
        ".env.*",
        "*.pem",
        "*.key",
        "*.p12",
        "*.pfx",
        "credentials.json",
        "auth.json",
        "secrets.json",
        "*.secret",
        ".DS_Store",
        "node_modules/",
        "",
      ].join("\n");
      try {
        await fs.writeFile(gitignorePath, defaultGitignore, "utf-8");
        await this.appendLog(`[${workspace.id}] created default .gitignore`);
      } catch (err) {
        this.log.warn(
          `Failed to create .gitignore in ${workspace.path}: ${normalizeGitError(err)}`,
        );
      }
    }
  }

  private async isDirty(workspace: WorkspaceConfigEntry): Promise<boolean> {
    try {
      const output = await this.runGit(workspace, ["status", "--porcelain"]);
      return output.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async runPull(workspaceId: string, reason: "auto" | "manual"): Promise<void> {
    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace?.sync) {
      return;
    }
    if (!(await this.ensureRepo(workspace))) {
      return;
    }

    this.status.set(workspaceId, {
      ...(this.status.get(workspaceId) ?? { status: "synced" }),
      status: "syncing",
      paused: false,
      lastActivityAt: Date.now(),
      lastError: undefined,
    });

    try {
      const args = workspace.sync.remote
        ? ["pull", "--rebase", workspace.sync.remote, workspace.sync.branch]
        : ["pull", "--rebase"];
      await this.runGit(workspace, args);
      const dirty = await this.isDirty(workspace);
      this.status.set(workspaceId, {
        status: dirty ? "unpushed" : "synced",
        lastSyncAt: Date.now(),
        lastActivityAt: Date.now(),
        paused: false,
        dirty,
      });
      await this.appendLog(
        `[${workspaceId}] pull (${reason}) ok ${workspace.sync.remote || "origin"}/${workspace.sync.branch}`,
      );
    } catch (err) {
      const message = normalizeGitError(err);
      if (looksLikeConflict(message)) {
        this.status.set(workspaceId, {
          status: "conflict",
          paused: true,
          dirty: true,
          lastActivityAt: Date.now(),
          lastError: message,
        });
      } else {
        this.status.set(workspaceId, {
          status: "error",
          paused: false,
          lastActivityAt: Date.now(),
          lastError: message,
        });
      }
      this.log.warn(`[WorkspaceSync] pull failed for ${workspaceId}: ${message}`);
      await this.appendLog(`[${workspaceId}] pull (${reason}) failed: ${message}`);
    }
  }

  private async runPush(workspaceId: string, reason: "auto" | "manual"): Promise<void> {
    const workspace = this.workspaceById.get(workspaceId);
    if (!workspace?.sync) {
      return;
    }
    if (!(await this.ensureRepo(workspace))) {
      return;
    }

    const current = this.status.get(workspaceId);
    if (current?.paused && current.status === "conflict" && reason === "auto") {
      return;
    }

    const dirty = await this.isDirty(workspace);
    if (!dirty) {
      this.status.set(workspaceId, {
        status: "synced",
        paused: false,
        dirty: false,
        lastSyncAt: current?.lastSyncAt ?? Date.now(),
        lastActivityAt: Date.now(),
      });
      return;
    }

    this.status.set(workspaceId, {
      ...(current ?? { status: "synced" }),
      status: "syncing",
      paused: false,
      dirty: true,
      lastActivityAt: Date.now(),
      lastError: undefined,
    });

    try {
      await this.ensureGitignore(workspace);
      await this.runGit(workspace, ["add", "-A"]);

      try {
        await this.runGit(workspace, ["commit", "-m", `Auto-sync: ${new Date().toISOString()}`]);
      } catch (err) {
        const commitMessage = normalizeGitError(err);
        if (!commitMessage.toLowerCase().includes("nothing to commit")) {
          throw err;
        }
      }

      const pushArgs = workspace.sync.remote
        ? ["push", workspace.sync.remote, workspace.sync.branch]
        : ["push"];
      await this.runGit(workspace, pushArgs);

      this.status.set(workspaceId, {
        status: "synced",
        paused: false,
        dirty: false,
        lastSyncAt: Date.now(),
        lastActivityAt: Date.now(),
      });
      await this.appendLog(`[${workspaceId}] push (${reason}) ok`);
    } catch (err) {
      const message = normalizeGitError(err);
      if (looksLikeConflict(message)) {
        this.status.set(workspaceId, {
          status: "conflict",
          paused: true,
          dirty: true,
          lastActivityAt: Date.now(),
          lastError: message,
        });
      } else {
        this.status.set(workspaceId, {
          status: "error",
          paused: false,
          dirty: true,
          lastActivityAt: Date.now(),
          lastError: message,
        });
      }
      this.log.warn(`[WorkspaceSync] push failed for ${workspaceId}: ${message}`);
      await this.appendLog(`[${workspaceId}] push (${reason}) failed: ${message}`);
    }
  }

  private async appendLog(message: string): Promise<void> {
    const line = `${new Date().toISOString()} ${message}\n`;
    try {
      await fs.mkdir(path.dirname(this.logFilePath), { recursive: true });
      await fs.appendFile(this.logFilePath, line, "utf-8");
    } catch {
      // Keep sync loop resilient even when file logging fails.
    }
  }
}

let singleton: WorkspaceSyncService | null = null;

export function getWorkspaceSyncService(logger?: Partial<Logger>): WorkspaceSyncService {
  if (!singleton) {
    singleton = new WorkspaceSyncService(logger);
  }
  return singleton;
}

export async function startWorkspaceSyncService(
  logger?: Partial<Logger>,
): Promise<WorkspaceSyncService> {
  const service = getWorkspaceSyncService(logger);
  await service.start();
  return service;
}
