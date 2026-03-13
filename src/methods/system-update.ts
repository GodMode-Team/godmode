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

    // Check for pending builder deploys that need a restart
    let pendingDeploy: { summary: string; ts: number; files?: string[] } | null = null;
    try {
      const pendingPath = join(DATA_DIR, "pending-deploy.json");
      const raw = readFileSync(pendingPath, "utf-8");
      if (raw) pendingDeploy = JSON.parse(raw);
    } catch { /* no pending deploy */ }

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
      pendingDeploy,
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
      updateType: "openclaw" as const,
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

// ── Post-update health audit (called from gateway_start) ─────────────────

type SmokeResult = { name: string; status: "pass" | "warn" | "fail"; detail: string };
type BroadcastFn = (event: string, payload: unknown) => void;

/**
 * Full post-update audit: version validation, method count, smoke tests,
 * user notification, and rollback on critical failure.
 *
 * Phase 1 (sync): version check + method count — runs inline in gateway_start.
 * Phase 2 (async, 5s delay): subsystem smoke tests.
 * Phase 3 (async): broadcast results to UI.
 * Phase 4 (conditional): rollback if critical failures.
 */
export function runPostUpdateHealthAudit(
  currentOpenclawVersion: string,
  methodCount: number,
  currentPluginVersion: string,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
  broadcast: BroadcastFn,
): void {
  try {
    if (!existsSync(CHECKPOINT_FILE)) return;

    const checkpoint = JSON.parse(readFileSync(CHECKPOINT_FILE, "utf8"));
    const updateType: string = checkpoint.updateType ?? "openclaw";

    // ── Phase 1: Inline validation ──
    const phase1: SmokeResult[] = [];

    // Version change check
    if (updateType === "openclaw") {
      const changed = currentOpenclawVersion !== checkpoint.openclawVersion;
      phase1.push({
        name: "openclaw-version",
        status: changed ? "pass" : "warn",
        detail: changed
          ? `${checkpoint.openclawVersion} → ${currentOpenclawVersion}`
          : `Version unchanged: ${currentOpenclawVersion} (update may not have applied)`,
      });
    }
    if (updateType === "plugin") {
      const changed = currentPluginVersion !== checkpoint.pluginVersion;
      phase1.push({
        name: "plugin-version",
        status: changed ? "pass" : "warn",
        detail: changed
          ? `${checkpoint.pluginVersion} → ${currentPluginVersion}`
          : `Version unchanged: ${currentPluginVersion} (update may not have applied)`,
      });
    }

    // Method count sanity
    phase1.push({
      name: "method-count",
      status: methodCount > 10 ? "pass" : methodCount > 0 ? "warn" : "fail",
      detail: `${methodCount} RPC methods registered`,
    });

    // Plugin loaded
    phase1.push({
      name: "plugin-loaded",
      status: "pass",
      detail: `GodMode plugin v${currentPluginVersion} loaded successfully`,
    });

    // Write initial status
    const status: Record<string, unknown> = {
      updateType,
      previousOpenclawVersion: checkpoint.openclawVersion,
      previousPluginVersion: checkpoint.pluginVersion,
      currentOpenclawVersion,
      currentPluginVersion,
      methodCount,
      phase1Results: phase1,
      phase: "inline-complete",
      timestamp: Date.now(),
      checkedAt: new Date().toISOString(),
    };

    if (!existsSync(DATA_DIR)) secureMkdirSync(DATA_DIR);
    secureWriteFileSync(POST_UPDATE_STATUS_FILE, JSON.stringify(status, null, 2));

    // Clean up checkpoint
    try { unlinkSync(CHECKPOINT_FILE); } catch { /* ignore */ }

    // Log health signals (fire and forget)
    void import("../lib/health-ledger.js").then(({ health: h }) => {
      for (const r of phase1) {
        h.signal(`update.${r.name}`, r.status === "pass", { detail: r.detail });
      }
    }).catch(() => { /* health ledger not available yet */ });

    const phase1Fails = phase1.filter(r => r.status === "fail").length;
    const phase1Warns = phase1.filter(r => r.status === "warn").length;
    logger.info(
      `[GodMode] Post-update Phase 1: ${phase1.length} checks, ${phase1Fails} fail, ${phase1Warns} warn`,
    );

    // ── Phase 2: Async smoke tests (5s delay to let services initialize) ──
    setTimeout(async () => {
      try {
        const smokeResults = await runPostUpdateSmokeTests(logger);
        const allResults = [...phase1, ...smokeResults];
        const fails = allResults.filter(r => r.status === "fail");
        const warns = allResults.filter(r => r.status === "warn");

        // Update status file with full results
        status.phase2Results = smokeResults;
        status.phase = "complete";
        status.allResults = allResults;
        status.summary = fails.length > 0
          ? `Update complete — ${fails.length} issue(s) detected`
          : warns.length > 0
            ? `Update complete — ${warns.length} warning(s)`
            : "Update complete — all systems healthy";
        status.overallStatus = fails.length > 0 ? "degraded" : warns.length > 0 ? "warning" : "healthy";
        status.completedAt = new Date().toISOString();

        secureWriteFileSync(POST_UPDATE_STATUS_FILE, JSON.stringify(status, null, 2));

        logger.info(
          `[GodMode] Post-update Phase 2: ${smokeResults.length} smoke tests, ` +
          `${fails.length} fail, ${warns.length} warn → ${status.overallStatus}`,
        );

        // ── Phase 3: Broadcast results to UI ──
        const versionLine = updateType === "plugin"
          ? `${checkpoint.pluginVersion} → ${currentPluginVersion}`
          : `${checkpoint.openclawVersion} → ${currentOpenclawVersion}`;

        broadcast("ally:notification", {
          type: "update-complete",
          summary: `${status.summary} (${versionLine})`,
          overallStatus: status.overallStatus,
          results: allResults,
          actions: fails.length > 0
            ? [{ label: "Run Diagnostics", action: "rpc", method: "godmode.health.repair" }]
            : undefined,
        });

        // ── Phase 4: Rollback on critical failure (plugin only) ──
        if (fails.length >= 3 && updateType === "plugin" && checkpoint.pluginVersion) {
          logger.warn(
            `[GodMode] ${fails.length} critical failures post-update — attempting plugin rollback to ${checkpoint.pluginVersion}`,
          );
          try {
            const rollbackCmd = isPluginInstall()
              ? `rm -rf ~/.openclaw/extensions/godmode && openclaw plugins install @godmode-team/godmode@${checkpoint.pluginVersion} 2>&1`
              : `npm install -g @godmode-team/godmode@${checkpoint.pluginVersion} 2>&1`;
            const { code: rc } = await runCommand(rollbackCmd, 120_000);
            if (rc === 0) {
              status.rollback = { attempted: true, success: true, version: checkpoint.pluginVersion };
              broadcast("ally:notification", {
                type: "update-rollback",
                summary: `Rolled back to v${checkpoint.pluginVersion} due to ${fails.length} failures. Gateway restart needed.`,
              });
              logger.info(`[GodMode] Rollback to ${checkpoint.pluginVersion} succeeded — restart gateway to apply`);
            } else {
              status.rollback = { attempted: true, success: false };
              logger.warn("[GodMode] Rollback failed — manual intervention needed");
            }
            secureWriteFileSync(POST_UPDATE_STATUS_FILE, JSON.stringify(status, null, 2));
          } catch (err) {
            logger.warn(`[GodMode] Rollback error: ${String(err)}`);
          }
        }

        // Record to repair log
        try {
          const { repairLog } = await import("../lib/health-ledger.js");
          repairLog.record({
            ts: Date.now(),
            subsystem: "update-audit",
            failure: fails.length > 0 ? fails.map(f => f.name).join(", ") : "none",
            repairAction: `${updateType} update: ${versionLine}`,
            verified: fails.length === 0,
            elapsed: Date.now() - (status.timestamp as number),
          });
        } catch { /* non-fatal */ }

      } catch (err) {
        logger.warn(`[GodMode] Post-update Phase 2 error: ${String(err)}`);
      }
    }, 5_000);

  } catch (err) {
    logger.warn(`[GodMode] Post-update audit error: ${String(err)}`);
  }
}

/** Phase 2 smoke tests — checks critical subsystems after startup. */
async function runPostUpdateSmokeTests(
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<SmokeResult[]> {
  const results: SmokeResult[] = [];

  // 1. Self-heal subsystem health report
  try {
    const { getHealthReport } = await import("../services/self-heal.js");
    const report = getHealthReport();
    const offline = report.subsystems.filter(s => s.state === "offline");
    const degraded = report.subsystems.filter(s => s.state === "degraded");
    results.push({
      name: "subsystem-health",
      status: offline.length > 0 ? "fail" : degraded.length > 0 ? "warn" : "pass",
      detail: offline.length > 0
        ? `${offline.length} subsystem(s) offline: ${offline.map(s => s.id).join(", ")}`
        : degraded.length > 0
          ? `${degraded.length} subsystem(s) degraded: ${degraded.map(s => s.id).join(", ")}`
          : `All ${report.subsystems.length} subsystems healthy`,
    });
  } catch (err) {
    results.push({ name: "subsystem-health", status: "warn", detail: `Could not check: ${String(err).slice(0, 100)}` });
  }

  // 2. Memory system
  try {
    const { isMemoryReady } = await import("../lib/memory.js");
    const ready = isMemoryReady();
    results.push({
      name: "memory",
      status: ready ? "pass" : "warn",
      detail: ready ? "Mem0 memory system ready" : "Memory not initialized (may still be starting)",
    });
  } catch (err) {
    results.push({ name: "memory", status: "warn", detail: `Could not check memory: ${String(err).slice(0, 100)}` });
  }

  // 3. Data directory accessible
  try {
    const dataExists = existsSync(DATA_DIR);
    results.push({
      name: "data-dir",
      status: dataExists ? "pass" : "fail",
      detail: dataExists ? `Data directory OK: ${DATA_DIR}` : `Data directory missing: ${DATA_DIR}`,
    });
  } catch {
    results.push({ name: "data-dir", status: "fail", detail: "Could not check data directory" });
  }

  // 4. Key data files intact
  try {
    const criticalFiles = ["resources.json", "trust-tracker.json"];
    const missing = criticalFiles.filter(f => !existsSync(join(DATA_DIR, f)));
    results.push({
      name: "data-integrity",
      status: missing.length === 0 ? "pass" : "warn",
      detail: missing.length === 0
        ? "All critical data files present"
        : `Missing data files (will be recreated): ${missing.join(", ")}`,
    });
  } catch {
    results.push({ name: "data-integrity", status: "warn", detail: "Could not check data files" });
  }

  // 5. Heartbeat running
  try {
    const { getConsciousnessHeartbeat } = await import("../services/consciousness-heartbeat.js");
    const running = getConsciousnessHeartbeat()?.running ?? false;
    results.push({
      name: "heartbeat",
      status: running ? "pass" : "warn",
      detail: running ? "Consciousness heartbeat active" : "Heartbeat not yet running",
    });
  } catch (err) {
    results.push({ name: "heartbeat", status: "warn", detail: `Could not check heartbeat: ${String(err).slice(0, 100)}` });
  }

  logger.info(`[GodMode] Smoke tests complete: ${results.length} checks`);
  return results;
}

// ── godmode.update.pluginRun ─────────────────────────────────────────────

const pluginRun: GatewayRequestHandler = async ({ respond }) => {
  try {
    const previousVersion = _pluginVersion;

    // Write pre-update checkpoint so post-update audit knows what changed
    if (!existsSync(DATA_DIR)) secureMkdirSync(DATA_DIR);
    const checkpoint = {
      openclawVersion: await getOpenclawVersion(),
      pluginVersion: _pluginVersion,
      updateType: "plugin" as const,
      timestamp: Date.now(),
      initiatedAt: new Date().toISOString(),
    };
    secureWriteFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));

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

// ── godmode.update.postStatus ─────────────────────────────────────────────

const postStatus: GatewayRequestHandler = async ({ respond }) => {
  try {
    if (!existsSync(POST_UPDATE_STATUS_FILE)) {
      respond(true, null);
      return;
    }
    const raw = readFileSync(POST_UPDATE_STATUS_FILE, "utf8");
    const status = JSON.parse(raw);

    // Only return recent statuses (< 1 hour old) to avoid stale notifications
    if (status.timestamp && Date.now() - status.timestamp > 60 * 60 * 1000) {
      respond(true, null);
      return;
    }

    respond(true, status);
  } catch {
    respond(true, null);
  }
};

// ── Export ────────────────────────────────────────────────────────────────

export const systemUpdateHandlers: GatewayRequestHandlers = {
  "godmode.update.check": check,
  "godmode.update.run": run,
  "godmode.update.pluginCheck": pluginCheck,
  "godmode.update.pluginRun": pluginRun,
  "godmode.update.postStatus": postStatus,
  "godmode.gateway.restart": gatewayRestart,
};
