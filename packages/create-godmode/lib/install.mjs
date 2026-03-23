// lib/install.mjs — OpenClaw + GodMode installation
import { execSync } from "node:child_process";

/**
 * Run a shell command, streaming output to stderr so the user sees progress.
 * Throws on non-zero exit.
 */
function run(cmd, { label, silent = false } = {}) {
  try {
    const result = execSync(cmd, {
      encoding: "utf8",
      stdio: silent ? ["pipe", "pipe", "pipe"] : ["pipe", "inherit", "inherit"],
      timeout: 120_000, // 2 min max per command
    });
    return result;
  } catch (err) {
    const msg = label ? `${label} failed` : `Command failed: ${cmd}`;
    const detail = err.stderr || err.stdout || err.message || "";
    throw new Error(`${msg}\n${detail}`.trim());
  }
}

/**
 * Install the OpenClaw CLI globally via npm.
 */
export function installOpenClaw() {
  run("npm install -g openclaw", { label: "OpenClaw CLI install" });
}

/**
 * Install the GodMode plugin via OpenClaw's plugin system.
 */
export function installGodMode() {
  run("openclaw plugins install @godmode-team/godmode", {
    label: "GodMode plugin install",
  });
}

/**
 * Update an already-installed GodMode plugin to the latest version.
 */
export function updateGodMode() {
  run("openclaw plugins update @godmode-team/godmode", {
    label: "GodMode plugin update",
  });
}

/**
 * Install @godmode-team/godmode globally for standalone mode (no OpenClaw).
 */
export function installGodModeStandalone() {
  run("npm install -g @godmode-team/godmode", {
    label: "GodMode standalone install",
  });
}
