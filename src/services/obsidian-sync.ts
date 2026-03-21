/**
 * obsidian-sync.ts — Obsidian Sync headless integration.
 *
 * Uses the `obsidian-headless` CLI (`ob`) to sync the vault without
 * the desktop app running. This enables:
 *   - Multi-device vault access (phone, tablet see changes instantly)
 *   - Server-side GodMode (vault synced on a VPS)
 *   - Background sync when Obsidian desktop is closed
 *
 * Requirements:
 *   - Node.js 22+ (for obsidian-headless)
 *   - `npm install -g obsidian-headless`
 *   - `ob login` or OBSIDIAN_AUTH_TOKEN env var
 *   - Vault linked via `ob sync-setup`
 *
 * Lifecycle: init → start continuous sync → stop on gateway shutdown.
 * Falls back gracefully if obsidian-headless is not installed.
 */

import { exec as nodeExec, type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { getVaultPath } from "../lib/vault-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

type BroadcastFn = (
  event: string,
  payload: unknown,
  opts?: { dropIfSlow?: boolean },
) => void;

export type ObsidianSyncStatus = {
  available: boolean;
  running: boolean;
  linked: boolean;
  lastSync: string | null;
  lastError: string | null;
  vaultPath: string | null;
  mode: "continuous" | "manual" | "disabled";
};

type SyncConfig = {
  enabled: boolean;
  mode: "continuous" | "manual";
  lastSync: string | null;
  lastError: string | null;
};

// ── Constants ──────────────────────────────────────────────────────────

const CONFIG_FILE = join(DATA_DIR, "obsidian-sync-config.json");
const EXEC_TIMEOUT_MS = 30_000;

// ── Singleton ──────────────────────────────────────────────────────────

let instance: ObsidianSyncService | null = null;

class ObsidianSyncService {
  private logger: Logger;
  private broadcastFn: BroadcastFn | null = null;
  private continuousProcess: ChildProcess | null = null;
  private obAvailable: boolean | null = null;
  private linked: boolean | null = null;
  private config: SyncConfig = {
    enabled: false,
    mode: "continuous",
    lastSync: null,
    lastError: null,
  };

  constructor(logger: Logger) {
    this.logger = logger;
  }

  setBroadcast(fn: BroadcastFn): void {
    this.broadcastFn = fn;
  }

  // ── Availability Detection ───────────────────────────────────────────

  /** Check if the `ob` CLI is installed and accessible. */
  async isAvailable(): Promise<boolean> {
    if (this.obAvailable !== null) return this.obAvailable;

    try {
      await this.exec("ob --version");
      this.obAvailable = true;
      this.logger.info("[ObsidianSync] ob CLI detected");
    } catch {
      this.obAvailable = false;
    }
    return this.obAvailable;
  }

  /** Check if the vault is linked to Obsidian Sync. */
  async isLinked(): Promise<boolean> {
    if (this.linked !== null) return this.linked;

    const vault = getVaultPath();
    if (!vault) {
      this.linked = false;
      return false;
    }

    try {
      const result = await this.exec(`ob sync-status`, vault);
      this.linked = !result.stdout.includes("not linked") && !result.stderr.includes("not linked");
    } catch {
      this.linked = false;
    }
    return this.linked;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────

  /** Initialize the sync service. Checks availability and loads config. */
  async init(): Promise<void> {
    await this.loadConfig();

    const available = await this.isAvailable();
    if (!available) {
      this.logger.info("[ObsidianSync] ob CLI not found — headless sync disabled. Install with: npm install -g obsidian-headless");
      return;
    }

    const linked = await this.isLinked();
    if (!linked) {
      this.logger.info("[ObsidianSync] Vault not linked to Obsidian Sync. Run: ob sync-setup");
      return;
    }

    if (this.config.enabled && this.config.mode === "continuous") {
      await this.startContinuousSync();
    }

    this.logger.info(`[ObsidianSync] Initialized — mode: ${this.config.mode}, enabled: ${this.config.enabled}`);
  }

  /** Start continuous sync (watches for changes, syncs automatically). */
  async startContinuousSync(): Promise<boolean> {
    if (this.continuousProcess) {
      this.logger.info("[ObsidianSync] Continuous sync already running");
      return true;
    }

    const available = await this.isAvailable();
    if (!available) return false;

    const vault = getVaultPath();
    if (!vault) return false;

    try {
      this.continuousProcess = spawn("ob", ["sync", "--continuous"], {
        cwd: vault,
        stdio: ["ignore", "pipe", "pipe"],
        detached: false,
        env: { ...process.env },
      });

      this.continuousProcess.stdout?.on("data", (data: Buffer) => {
        const msg = data.toString().trim();
        if (msg) {
          this.logger.info(`[ObsidianSync] ${msg}`);
          // Detect successful sync events
          if (msg.includes("synced") || msg.includes("up to date")) {
            this.config.lastSync = new Date().toISOString();
            this.config.lastError = null;
            this.saveConfig().catch((err) => this.logger.warn(`[ObsidianSync] config save failed: ${err.message}`));
            this.broadcast("obsidianSync:synced", {
              lastSync: this.config.lastSync,
            });
          }
        }
      });

      this.continuousProcess.stderr?.on("data", (data: Buffer) => {
        const msg = data.toString().trim();
        if (msg) {
          this.logger.warn(`[ObsidianSync] stderr: ${msg}`);
          this.config.lastError = msg;
        }
      });

      this.continuousProcess.on("error", (err) => {
        this.logger.warn(`[ObsidianSync] Spawn error: ${String(err)}`);
        this.config.lastError = String(err);
        this.continuousProcess = null;
      });

      this.continuousProcess.on("exit", (code) => {
        this.logger.info(`[ObsidianSync] Continuous sync exited with code ${code}`);
        this.continuousProcess = null;

        // Auto-restart after 60s if it crashed unexpectedly
        if (code !== 0 && this.config.enabled) {
          this.logger.info("[ObsidianSync] Will restart continuous sync in 60s");
          setTimeout(() => {
            if (this.config.enabled) {
              void this.startContinuousSync();
            }
          }, 60_000);
        }
      });

      this.config.enabled = true;
      this.config.mode = "continuous";
      await this.saveConfig();

      this.logger.info("[ObsidianSync] Continuous sync started");
      this.broadcast("obsidianSync:status", await this.getStatus());
      return true;
    } catch (err) {
      this.logger.error(`[ObsidianSync] Failed to start continuous sync: ${String(err)}`);
      this.config.lastError = String(err);
      return false;
    }
  }

  /** Stop continuous sync. */
  stopContinuousSync(): void {
    if (this.continuousProcess) {
      this.continuousProcess.kill("SIGTERM");
      this.continuousProcess = null;
      this.logger.info("[ObsidianSync] Continuous sync stopped");
    }
  }

  /** Run a one-time sync. */
  async syncOnce(): Promise<{ ok: boolean; message: string }> {
    const available = await this.isAvailable();
    if (!available) return { ok: false, message: "ob CLI not installed" };

    const vault = getVaultPath();
    if (!vault) return { ok: false, message: "Vault not configured" };

    try {
      this.broadcast("obsidianSync:status", { ...await this.getStatus(), syncing: true });
      const result = await this.exec("ob sync", vault);
      this.config.lastSync = new Date().toISOString();
      this.config.lastError = null;
      await this.saveConfig();
      this.broadcast("obsidianSync:synced", { lastSync: this.config.lastSync });
      return { ok: true, message: result.stdout.trim() || "Sync complete" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.config.lastError = msg;
      await this.saveConfig();
      return { ok: false, message: msg };
    }
  }

  /** Full shutdown — stop sync and clean up. */
  shutdown(): void {
    this.stopContinuousSync();
    this.logger.info("[ObsidianSync] Service shut down");
  }

  // ── Status & Config ──────────────────────────────────────────────────

  async getStatus(): Promise<ObsidianSyncStatus> {
    return {
      available: this.obAvailable ?? false,
      running: this.continuousProcess !== null,
      linked: this.linked ?? false,
      lastSync: this.config.lastSync,
      lastError: this.config.lastError,
      vaultPath: getVaultPath(),
      mode: this.config.enabled ? this.config.mode : "disabled",
    };
  }

  async setMode(mode: "continuous" | "manual" | "disabled"): Promise<void> {
    if (mode === "disabled") {
      this.config.enabled = false;
      this.stopContinuousSync();
    } else if (mode === "continuous") {
      this.config.enabled = true;
      this.config.mode = "continuous";
      await this.startContinuousSync();
    } else {
      this.config.enabled = true;
      this.config.mode = "manual";
      this.stopContinuousSync();
    }
    await this.saveConfig();
    this.broadcast("obsidianSync:status", await this.getStatus());
  }

  // ── Setup Helpers ────────────────────────────────────────────────────

  /** List remote vaults available for sync. */
  async listRemoteVaults(): Promise<string[]> {
    const available = await this.isAvailable();
    if (!available) return [];

    try {
      const result = await this.exec("ob sync-list-remote");
      return result.stdout
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  /** Link the local vault to Obsidian Sync. */
  async setupSync(remoteVaultId?: string): Promise<{ ok: boolean; message: string }> {
    const available = await this.isAvailable();
    if (!available) return { ok: false, message: "ob CLI not installed" };

    const vault = getVaultPath();
    if (!vault) return { ok: false, message: "Vault not configured" };

    try {
      const cmd = remoteVaultId
        ? `ob sync-setup --vault "${remoteVaultId}"`
        : "ob sync-setup";
      const result = await this.exec(cmd, vault);
      this.linked = true;
      return { ok: true, message: result.stdout.trim() || "Vault linked" };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Private Helpers ──────────────────────────────────────────────────

  private exec(cmd: string, cwd?: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      nodeExec(
        cmd,
        {
          timeout: EXEC_TIMEOUT_MS,
          cwd: cwd ?? undefined,
          env: { ...process.env },
        },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(stderr || err.message));
            return;
          }
          resolve({ stdout, stderr });
        },
      );
    });
  }

  private broadcast(event: string, payload: unknown): void {
    if (!this.broadcastFn) return;
    try {
      this.broadcastFn(event, payload, { dropIfSlow: true });
    } catch { /* best-effort */ }
  }

  private async loadConfig(): Promise<void> {
    try {
      const raw = await readFile(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<SyncConfig>;
      this.config = {
        enabled: parsed.enabled ?? false,
        mode: parsed.mode ?? "continuous",
        lastSync: parsed.lastSync ?? null,
        lastError: parsed.lastError ?? null,
      };
    } catch {
      // First run — defaults are fine
    }
  }

  private async saveConfig(): Promise<void> {
    try {
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(CONFIG_FILE, JSON.stringify(this.config, null, 2), "utf-8");
    } catch { /* non-fatal */ }
  }
}

// ── Public API ─────────────────────────────────────────────────────────

export function initObsidianSync(logger: Logger): ObsidianSyncService {
  if (!instance) {
    instance = new ObsidianSyncService(logger);
  }
  return instance;
}

export function getObsidianSync(): ObsidianSyncService | null {
  return instance;
}

export function stopObsidianSync(): void {
  instance?.shutdown();
  instance = null;
}
