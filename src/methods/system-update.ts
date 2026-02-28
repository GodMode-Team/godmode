/**
 * GodMode — System Update Handlers
 *
 * `godmode.update.check` — checks for OpenClaw and GodMode plugin updates.
 * `godmode.update.run` — runs `openclaw update --yes` with pre-update checkpoint.
 * `godmode.update.pluginCheck` — checks for GodMode plugin updates on npm.
 */

import { exec as nodeExec } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const CHECKPOINT_FILE = join(DATA_DIR, "update-checkpoint.json");
const POST_UPDATE_STATUS_FILE = join(DATA_DIR, "post-update-status.json");

// Read the running plugin version (set by index.ts at module load time)
let _pluginVersion = "1.0.0";
export function setPluginVersion(v: string): void {
  _pluginVersion = v;
}

// ── Helpers ──────────────────────────────────────────────────────────────

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
    if (!openclawUpdateAvailable && openclawLatest && openclawLatest !== openclawVersion) {
      openclawUpdateAvailable = true;
    }

    // Check GodMode plugin version
    const pluginLatest = await getNpmLatestVersion("@godmode-team/godmode");
    const pluginUpdateAvailable =
      pluginLatest !== null && pluginLatest !== _pluginVersion;

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
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const checkpoint = {
      openclawVersion,
      pluginVersion: _pluginVersion,
      timestamp: Date.now(),
      initiatedAt: new Date().toISOString(),
    };
    writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));

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
    const updateAvailable = latest !== null && latest !== _pluginVersion;

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
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(POST_UPDATE_STATUS_FILE, JSON.stringify(status, null, 2));
    unlinkSync(CHECKPOINT_FILE);

    logger.info(
      `[GodMode] Post-update OK: ${status.previousVersion} → ${status.currentVersion} (${methodCount} methods)`,
    );
  } catch (err) {
    logger.warn(`[GodMode] Post-update check error: ${String(err)}`);
  }
}

// ── Export ────────────────────────────────────────────────────────────────

export const systemUpdateHandlers: GatewayRequestHandlers = {
  "godmode.update.check": check,
  "godmode.update.run": run,
  "godmode.update.pluginCheck": pluginCheck,
};
