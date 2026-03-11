/**
 * GodMode — System Update Handlers
 *
 * `godmode.update.check` — checks for OpenClaw and GodMode plugin updates.
 * `godmode.update.run` — runs `openclaw update --yes` with pre-update checkpoint.
 * `godmode.update.pluginCheck` — checks for GodMode plugin updates on npm.
 */

import { exec as nodeExec } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";
import { secureWriteFileSync, secureMkdirSync } from "../lib/secure-fs.js";

/** Detect if the plugin was installed via `openclaw plugins install` (extensions dir). */
function isPluginInstall(): boolean {
  try {
    const thisDir = dirname(fileURLToPath(import.meta.url));
    return thisDir.includes("/extensions/godmode/") || thisDir.includes("\\extensions\\godmode\\");
  } catch {
    return false;
  }
}

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const CHECKPOINT_FILE = join(DATA_DIR, "update-checkpoint.json");
const POST_UPDATE_STATUS_FILE = join(DATA_DIR, "post-update-status.json");

// Read the running plugin version (set by index.ts at module load time)
let _pluginVersion = "1.0.0";
export function setPluginVersion(v: string): void {
  _pluginVersion = v;
}

// ── Helpers ──────────────────────────────────────────────────────────────

/** Returns true if versionA is strictly greater than versionB (semver). */
function isNewerVersion(versionA: string, versionB: string): boolean {
  const partsA = versionA.split(".").map(Number);
  const partsB = versionB.split(".").map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] ?? 0;
    const b = partsB[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

function runCommand(
  command: string,
  timeoutMs: number,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    nodeExec(
      command,
      {
        timeout: timeoutMs,
        env: { ...process.env, HOME: process.env.HOME },
        maxBuffer: 1024 * 1024,
      },
      (err, stdout, stderr) => {
        const code = err && "code" in err ? (err.code as number) ?? 1 : err ? 1 : 0;
        resolve({ code, stdout: String(stdout), stderr: String(stderr) });
      },
    );
  });
}

async function getOpenclawVersion(): Promise<string> {
  const { stdout } = await runCommand("openclaw --version 2>/dev/null", 5_000);
  return stdout.trim() || "unknown";
}

async function getNpmLatestVersion(pkg: string): Promise<string | null> {
  const { code, stdout } = await runCommand(
    `npm view ${pkg} version --userconfig "$(mktemp)" 2>/dev/null`,
    10_000,
  );
  if (code !== 0 || !stdout.trim()) return null;
  return stdout.trim();
}

// ── godmode.update.check ─────────────────────────────────────────────────

const check: GatewayRequestHandler = async ({ respond }) => {
  try {
    // Run openclaw update status --json
    const { code, stdout, stderr } = await runCommand(
      "openclaw update status --json 2>/dev/null",
      15_000,
    );

    let openclawVersion = "unknown";
    let openclawLatest: string | null = null;
    let openclawUpdateAvailable = false;
    let openclawInstallKind = "unknown";
    let openclawChannel = "stable";

    if (code === 0 && stdout.trim()) {
      try {
        const status = JSON.parse(stdout.trim());
        openclawInstallKind = status.update?.installKind ?? "unknown";
        openclawLatest = status.update?.registry?.latestVersion ?? null;
        openclawChannel = status.channel?.value ?? "stable";
        openclawUpdateAvailable =
          status.availability?.available === true ||
          status.availability?.hasRegistryUpdate === true ||
          status.availability?.hasGitUpdate === true;
      } catch {
        // JSON parse failed — fall back to simpler checks
      }
    }

    // Get the actual running version
    openclawVersion = await getOpenclawVersion();

    // If openclaw status didn't give us latest, try npm directly
    if (!openclawLatest) {
      openclawLatest = await getNpmLatestVersion("openclaw");
    }

    // Fallback update detection via version comparison
    if (!openclawUpdateAvailable && openclawLatest && isNewerVersion(openclawLatest, openclawVersion)) {
      openclawUpdateAvailable = true;
    }

    // Check GodMode plugin version
    const pluginLatest = await getNpmLatestVersion("@godmode-team/godmode");
    const pluginUpdateAvailable =
      pluginLatest !== null && isNewerVersion(pluginLatest, _pluginVersion);

    respond(true, {
      openclaw: {
        version: openclawVersion,
        latest: openclawLatest,
        updateAvailable: openclawUpdateAvailable,
        installKind: openclawInstallKind,
        channel: openclawChannel,
      },
      plugin: {
        version: _pluginVersion,
        latest: pluginLatest,
        updateAvailable: pluginUpdateAvailable,
      },
      fetchOk: true,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "UPDATE_CHECK_FAILED",
      message: String(err),
    });
  }
};

// ── godmode.update.run ───────────────────────────────────────────────────

const run: GatewayRequestHandler = async ({ respond }) => {
  try {
    const openclawVersion = await getOpenclawVersion();

    // Write pre-update checkpoint
    if (!existsSync(DATA_DIR)) {
      secureMkdirSync(DATA_DIR);
    }
    const checkpoint = {
      openclawVersion,
      pluginVersion: _pluginVersion,
      timestamp: Date.now(),
      initiatedAt: new Date().toISOString(),
    };
    secureWriteFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));

    // Run openclaw update --yes
    // The gateway will restart as part of the update process.
    // The UI should expect a disconnect and auto-reconnect.
    const { code, stdout, stderr } = await runCommand(
      "openclaw update --yes 2>&1",
      120_000,
    );

    if (code !== 0) {
      // Update failed — clean up checkpoint
      try {
        unlinkSync(CHECKPOINT_FILE);
      } catch {
        // ignore
      }
      respond(false, undefined, {
        code: "UPDATE_FAILED",
        message: stderr.trim() || stdout.trim() || "openclaw update failed",
      });
      return;
    }

    // If we get here, the update succeeded but the gateway hasn't restarted yet
    // (or it restarted and this is a stale response — either way, respond with success)
    respond(true, {
      success: true,
      previousVersion: openclawVersion,
      output: stdout.trim().slice(-500), // Last 500 chars of output
    });
  } catch (err) {
    respond(false, undefined, {
      code: "UPDATE_ERROR",
      message: String(err),
    });
  }
};

// ── godmode.update.pluginCheck ───────────────────────────────────────────

const pluginCheck: GatewayRequestHandler = async ({ respond }) => {
  try {
    const latest = await getNpmLatestVersion("@godmode-team/godmode");
    const updateAvailable = latest !== null && isNewerVersion(latest, _pluginVersion);

    respond(true, {
      current: _pluginVersion,
      latest,
      updateAvailable,
    });
  } catch (err) {
    respond(false, undefined, {
      code: "PLUGIN_CHECK_FAILED",
      message: String(err),
    });
  }
};

// ── Post-update health check (called from gateway_start in index.ts) ─────

export function runPostUpdateHealthCheck(
  currentOpenclawVersion: string,
  methodCount: number,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): void {
  try {
    if (!existsSync(CHECKPOINT_FILE)) return;

    const checkpoint = JSON.parse(readFileSync(CHECKPOINT_FILE, "utf8"));
    const status = {
      previousVersion: checkpoint.openclawVersion,
      currentVersion: currentOpenclawVersion,
      pluginLoaded: true,
      methodCount,
      timestamp: Date.now(),
      checkedAt: new Date().toISOString(),
    };

    if (!existsSync(DATA_DIR)) {
      secureMkdirSync(DATA_DIR);
    }
    secureWriteFileSync(POST_UPDATE_STATUS_FILE, JSON.stringify(status, null, 2));
    unlinkSync(CHECKPOINT_FILE);

    logger.info(
      `[GodMode] Post-update OK: ${status.previousVersion} → ${status.currentVersion} (${methodCount} methods)`,
    );
  } catch (err) {
    logger.warn(`[GodMode] Post-update check error: ${String(err)}`);
  }
}

// ── godmode.update.pluginRun ─────────────────────────────────────────────

const pluginRun: GatewayRequestHandler = async ({ respond }) => {
  try {
    const previousVersion = _pluginVersion;

    // Use the correct update command based on install method
    // Plugin installs (via `openclaw plugins install`) live in ~/.openclaw/extensions/
    // Global npm installs use `npm update -g`
    // Prefer re-running the install script as it handles both + config
    const updateCmd = isPluginInstall()
      ? "rm -rf ~/.openclaw/extensions/godmode && openclaw plugins install @godmode-team/godmode 2>&1"
      : 'bash -c "curl -fsSL https://lifeongodmode.com/install.sh | sh" 2>&1';

    const { code, stdout, stderr } = await runCommand(updateCmd, 120_000);

    if (code !== 0) {
      respond(false, undefined, {
        code: "PLUGIN_UPDATE_FAILED",
        message: stderr.trim() || stdout.trim() || "npm update failed",
      });
      return;
    }

    // Restart the gateway so it loads the new plugin version
    void runCommand(
      'pkill -f "openclaw gateway" 2>/dev/null; sleep 1; nohup openclaw gateway run >/dev/null 2>&1 &',
      10_000,
    );

    respond(true, {
      success: true,
      previousVersion,
      output: stdout.trim().slice(-500),
      message: "Plugin updated. Gateway is restarting — the UI will reconnect automatically.",
    });
  } catch (err) {
    respond(false, undefined, {
      code: "PLUGIN_UPDATE_ERROR",
      message: String(err),
    });
  }
};

// ── godmode.gateway.restart ───────────────────────────────────────────────

const gatewayRestart: GatewayRequestHandler = ({ respond }) => {
  // Respond before killing the process — client won't receive the reply otherwise
  respond(true, {
    success: true,
    message: "Gateway is restarting — the UI will reconnect automatically.",
  });

  // Async restart: kill current gateway, then relaunch
  void runCommand(
    'pkill -f "openclaw gateway" 2>/dev/null; sleep 1; nohup openclaw gateway run >/dev/null 2>&1 &',
    10_000,
  );
};

// ── Export ────────────────────────────────────────────────────────────────

export const systemUpdateHandlers: GatewayRequestHandlers = {
  "godmode.update.check": check,
  "godmode.update.run": run,
  "godmode.update.pluginCheck": pluginCheck,
  "godmode.update.pluginRun": pluginRun,
  "godmode.gateway.restart": gatewayRestart,
};
