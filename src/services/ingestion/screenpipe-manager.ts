/**
 * screenpipe-manager.ts — Lifecycle management for the Screenpipe daemon.
 *
 * GodMode owns the full Screenpipe experience: detection, installation,
 * daemon start/stop, and health monitoring. Users never touch the CLI
 * directly or see the screenpipe.com paywall.
 *
 * Install: `brew install screenpipe` (macOS) — CLI is MIT-licensed and free.
 * The $400 desktop app is NOT used; we manage via CLI + REST API.
 */

import { execFile, spawn, type ChildProcess } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";
import { writeFile, readFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../../data-paths.js";
import { SCREENPIPE_API_URL } from "../../lib/constants.js";
import { health } from "../../lib/health-ledger.js";

const execFileAsync = promisify(execFile);
const PID_FILE = join(DATA_DIR, "screenpipe.pid");

// ── Types ────────────────────────────────────────────────────────────

export type ScreenpipeInstallStatus = {
  installed: boolean;
  version: string | null;
  installMethod: "brew" | "npx" | "binary" | "unknown" | null;
};

export type ScreenpipeDaemonStatus = {
  installed: boolean;
  running: boolean;
  version: string | null;
  apiUrl: string;
  pid: number | null;
  managedByUs: boolean;
};

export type InstallProgress = {
  stage: "checking" | "installing" | "verifying" | "done" | "error";
  message: string;
  error?: string;
};

// ── API URL Resolution ──────────────────────────────────────────────

/**
 * Resolve the Screenpipe API URL. Prefers user config, falls back to constant.
 * Cached per-call — callers should store the result if calling isApiHealthy in a loop.
 */
async function resolveApiUrl(): Promise<string> {
  try {
    const { loadConfig } = await import("./screenpipe-config.js");
    const cfg = await loadConfig();
    return cfg.apiUrl || SCREENPIPE_API_URL;
  } catch {
    return SCREENPIPE_API_URL;
  }
}

// ── Detection ────────────────────────────────────────────────────────

/**
 * Check if the screenpipe CLI is installed and get its version.
 */
export async function detectInstall(): Promise<ScreenpipeInstallStatus> {
  // Try direct CLI
  try {
    const { stdout } = await execFileAsync("screenpipe", ["--version"], {
      timeout: 5_000,
    });
    const version = stdout.trim().replace(/^screenpipe\s*/i, "") || null;
    // Detect install method
    let installMethod: ScreenpipeInstallStatus["installMethod"] = "unknown";
    if (platform() === "darwin") {
      try {
        await execFileAsync("brew", ["list", "screenpipe"], { timeout: 5_000 });
        installMethod = "brew";
      } catch {
        // Not a brew install
      }
    }
    return { installed: true, version, installMethod };
  } catch {
    return { installed: false, version: null, installMethod: null };
  }
}

/**
 * Check if the Screenpipe REST API is responding.
 * Accepts an optional pre-resolved URL to avoid repeated config reads in loops.
 */
export async function isApiHealthy(apiUrl?: string): Promise<boolean> {
  try {
    const url = apiUrl ?? await resolveApiUrl();
    const res = await fetch(`${url}/health`, {
      signal: AbortSignal.timeout(2_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Get full daemon status: installed, running, version, pid.
 * Fast path: if API is healthy, skip the slower `screenpipe --version` check.
 */
export async function getDaemonStatus(): Promise<ScreenpipeDaemonStatus> {
  const apiUrl = await resolveApiUrl();
  const running = await isApiHealthy(apiUrl);
  const pid = await readPid();

  if (running) {
    // Fast path — if API is up, we know it's installed. Get version in background.
    let version: string | null = null;
    try {
      const { stdout } = await execFileAsync("screenpipe", ["--version"], { timeout: 3_000 });
      version = stdout.trim().replace(/^screenpipe\s*/i, "") || null;
    } catch { /* version is nice-to-have, not essential */ }

    return {
      installed: true,
      running: true,
      version,
      apiUrl,
      pid,
      managedByUs: pid !== null,
    };
  }

  // Slow path — check if CLI is installed at all
  const install = await detectInstall();
  return {
    installed: install.installed,
    running: false,
    version: install.version,
    apiUrl,
    pid,
    managedByUs: pid !== null,
  };
}

// ── Installation ─────────────────────────────────────────────────────

/**
 * Install screenpipe CLI. Currently supports macOS (Homebrew).
 * Returns a progress callback pattern for UI updates.
 */
export async function installScreenpipe(
  onProgress?: (p: InstallProgress) => void,
): Promise<{ success: boolean; error?: string }> {
  const report = (p: InstallProgress) => onProgress?.(p);
  const os = platform();

  report({ stage: "checking", message: "Checking current installation..." });

  const existing = await detectInstall();
  if (existing.installed) {
    report({ stage: "done", message: `Already installed (${existing.version})` });
    return { success: true };
  }

  if (os === "darwin") {
    return installViaBrew(report);
  } else if (os === "linux") {
    return installViaScript(report);
  } else {
    const msg = `Automatic installation not supported on ${os}. Install manually: https://github.com/screenpipe/screenpipe`;
    report({ stage: "error", message: msg, error: msg });
    return { success: false, error: msg };
  }
}

async function installViaBrew(
  report: (p: InstallProgress) => void,
): Promise<{ success: boolean; error?: string }> {
  // Check if brew is available
  try {
    await execFileAsync("brew", ["--version"], { timeout: 5_000 });
  } catch {
    const msg = "Homebrew not found. Install Homebrew first: https://brew.sh";
    report({ stage: "error", message: msg, error: msg });
    return { success: false, error: msg };
  }

  report({ stage: "installing", message: "Adding Screenpipe tap..." });

  try {
    await execFileAsync("brew", ["tap", "louis030195/screen-pipe"], {
      timeout: 60_000,
    });
  } catch (err) {
    // Tap may already exist — continue
    const errMsg = String(err);
    if (!errMsg.includes("already tapped")) {
      console.warn(`[Screenpipe] Tap warning (continuing): ${errMsg}`);
    }
  }

  report({ stage: "installing", message: "Installing Screenpipe CLI via Homebrew... (this may take a minute)" });

  try {
    await execFileAsync("brew", ["install", "screenpipe"], {
      timeout: 300_000, // 5 min for compilation
    });
  } catch (err) {
    const msg = `Homebrew install failed: ${String(err).slice(0, 200)}`;
    report({ stage: "error", message: msg, error: msg });
    return { success: false, error: msg };
  }

  report({ stage: "verifying", message: "Verifying installation..." });

  const verify = await detectInstall();
  if (verify.installed) {
    report({ stage: "done", message: `Installed successfully (${verify.version})` });
    health.signal("screenpipe.install", true, { version: verify.version });
    return { success: true };
  }

  const msg = "Install completed but screenpipe CLI not found in PATH";
  report({ stage: "error", message: msg, error: msg });
  return { success: false, error: msg };
}

async function installViaScript(
  report: (p: InstallProgress) => void,
): Promise<{ success: boolean; error?: string }> {
  report({ stage: "installing", message: "Installing Screenpipe via install script..." });

  try {
    // Use the official install script
    const { stdout, stderr } = await execFileAsync(
      "bash",
      ["-c", "curl -fsSL https://raw.githubusercontent.com/screenpipe/screenpipe/main/install.sh | bash"],
      { timeout: 300_000 },
    );
    console.log(`[Screenpipe] Install output: ${stdout.slice(0, 500)}`);
    if (stderr) console.warn(`[Screenpipe] Install stderr: ${stderr.slice(0, 500)}`);
  } catch (err) {
    const msg = `Install script failed: ${String(err).slice(0, 200)}`;
    report({ stage: "error", message: msg, error: msg });
    return { success: false, error: msg };
  }

  report({ stage: "verifying", message: "Verifying installation..." });

  const verify = await detectInstall();
  if (verify.installed) {
    report({ stage: "done", message: `Installed successfully (${verify.version})` });
    health.signal("screenpipe.install", true, { version: verify.version });
    return { success: true };
  }

  const msg = "Install script completed but screenpipe CLI not found in PATH";
  report({ stage: "error", message: msg, error: msg });
  return { success: false, error: msg };
}

// ── Daemon Lifecycle ─────────────────────────────────────────────────

/**
 * Start the screenpipe daemon. Returns PID on success.
 * No-ops if already running.
 */
export async function startDaemon(): Promise<{
  success: boolean;
  pid?: number;
  alreadyRunning?: boolean;
  error?: string;
}> {
  const apiUrl = await resolveApiUrl();

  // Already running?
  if (await isApiHealthy(apiUrl)) {
    const pid = await readPid();
    return { success: true, pid: pid ?? undefined, alreadyRunning: true };
  }

  // Is it installed?
  const install = await detectInstall();
  if (!install.installed) {
    return { success: false, error: "Screenpipe not installed. Install it first." };
  }

  try {
    await mkdir(join(DATA_DIR), { recursive: true });

    const child: ChildProcess = spawn("screenpipe", [], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env },
    });

    child.unref();

    if (child.pid) {
      await writePid(child.pid);
    }

    // Wait for API to come up (up to 10s)
    let healthy = false;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (await isApiHealthy(apiUrl)) {
        healthy = true;
        break;
      }
    }

    if (healthy) {
      health.signal("screenpipe.daemon", true, { pid: child.pid });
      return { success: true, pid: child.pid ?? undefined };
    }

    // Started but not healthy yet — might still be initializing
    health.signal("screenpipe.daemon", false, { error: "started but health check failed" });
    return {
      success: true,
      pid: child.pid ?? undefined,
      error: "Daemon started but health check not yet passing — may still be initializing",
    };
  } catch (err) {
    const msg = `Failed to start daemon: ${String(err)}`;
    health.signal("screenpipe.daemon", false, { error: msg });
    return { success: false, error: msg };
  }
}

/**
 * Stop the screenpipe daemon. Kills the process we started (by PID file),
 * or falls back to pkill if we didn't start it.
 */
export async function stopDaemon(): Promise<{ success: boolean; error?: string }> {
  const pid = await readPid();

  if (pid) {
    try {
      process.kill(pid, "SIGTERM");
      await clearPid();
      // Give it a moment to shut down
      await new Promise((r) => setTimeout(r, 1_000));
      health.signal("screenpipe.daemon", true, { stopped: true });
      return { success: true };
    } catch (err) {
      // Process might already be dead
      await clearPid();
      if ((err as NodeJS.ErrnoException).code === "ESRCH") {
        return { success: true }; // Already dead
      }
      return { success: false, error: `Failed to kill PID ${pid}: ${String(err)}` };
    }
  }

  // No PID file — try pkill as fallback
  try {
    await execFileAsync("pkill", ["-f", "screenpipe"], { timeout: 5_000 });
    await new Promise((r) => setTimeout(r, 1_000));
    return { success: true };
  } catch {
    // pkill returns non-zero if no process found — that's fine
    const running = await isApiHealthy();
    if (!running) return { success: true }; // It's stopped
    return { success: false, error: "Could not stop screenpipe daemon" };
  }
}

/**
 * Ensure screenpipe is installed and running. One-call setup.
 * Used by onboarding and gateway auto-start.
 */
export async function ensureRunning(
  onProgress?: (p: InstallProgress) => void,
): Promise<{ success: boolean; error?: string }> {
  // Already running? Done.
  if (await isApiHealthy()) {
    onProgress?.({ stage: "done", message: "Screenpipe is already running" });
    return { success: true };
  }


  // Check install
  const install = await detectInstall();
  if (!install.installed) {
    const installResult = await installScreenpipe(onProgress);
    if (!installResult.success) return installResult;
  }

  // Start daemon
  onProgress?.({ stage: "installing", message: "Starting Screenpipe daemon..." });
  const startResult = await startDaemon();
  if (startResult.success) {
    onProgress?.({ stage: "done", message: "Screenpipe is running" });
    return { success: true };
  }

  return { success: false, error: startResult.error };
}

// ── PID File Management ──────────────────────────────────────────────

async function writePid(pid: number): Promise<void> {
  try {
    await mkdir(join(DATA_DIR), { recursive: true });
    await writeFile(PID_FILE, String(pid), "utf-8");
  } catch {
    // Best effort
  }
}

async function readPid(): Promise<number | null> {
  try {
    const raw = await readFile(PID_FILE, "utf-8");
    const pid = parseInt(raw.trim(), 10);
    if (isNaN(pid)) return null;
    // Check if process is still alive
    try {
      process.kill(pid, 0); // Signal 0 = just check existence
      return pid;
    } catch {
      // Process is dead — clean up stale PID file
      await clearPid();
      return null;
    }
  } catch {
    return null;
  }
}

async function clearPid(): Promise<void> {
  try {
    await unlink(PID_FILE);
  } catch {
    // File doesn't exist — fine
  }
}
