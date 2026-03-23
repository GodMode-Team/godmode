// lib/detect.mjs — platform detection, Node check, dependency discovery
import { execSync } from "node:child_process";
import { platform, arch } from "node:os";

/**
 * Check if the running Node.js version meets the minimum requirement (22+).
 * @returns {{ ok: boolean, version: string, message?: string }}
 */
export function checkNodeVersion() {
  const version = process.version; // e.g. "v22.3.0"
  const major = parseInt(version.slice(1).split(".")[0], 10);
  if (major >= 22) {
    return { ok: true, version };
  }
  return {
    ok: false,
    version,
    message: [
      `Node.js ${version} detected (v22+ required)`,
      "",
      "Install Node.js 22:",
      "  macOS:   brew install node@22",
      "  Linux:   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs",
      "  Windows: Download from https://nodejs.org/",
      "",
      "Then run: npx create-godmode",
    ].join("\n"),
  };
}

/**
 * Check whether the OpenClaw CLI is installed and reachable.
 * @returns {{ installed: boolean, version?: string }}
 */
export function checkOpenClaw() {
  try {
    const out = execSync("openclaw --version", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 10_000,
    }).trim();
    // Output may be just a version string or "openclaw vX.Y.Z"
    const version = out.replace(/^openclaw\s*/i, "").trim();
    return { installed: true, version };
  } catch {
    return { installed: false };
  }
}

/**
 * Check whether the GodMode plugin is already installed in OpenClaw.
 * @returns {{ installed: boolean, version?: string }}
 */
export function checkGodMode() {
  try {
    const out = execSync("openclaw plugins list", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 15_000,
    });
    // Look for godmode in the list
    const line = out
      .split("\n")
      .find((l) => l.toLowerCase().includes("godmode"));
    if (line) {
      // Try to extract version from the line
      const vMatch = line.match(/(\d+\.\d+\.\d+)/);
      return { installed: true, version: vMatch ? vMatch[1] : undefined };
    }
    return { installed: false };
  } catch {
    return { installed: false };
  }
}

/**
 * Check whether the standalone godmode binary is available.
 * @returns {{ installed: boolean }}
 */
export function checkGodModeStandalone() {
  try {
    execSync("godmode --version", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 10_000,
    });
    return { installed: true };
  } catch {
    return { installed: false };
  }
}

/**
 * Return current platform info.
 * @returns {{ os: 'macos'|'linux'|'windows', arch: string }}
 */
export function getPlatform() {
  const p = platform();
  const a = arch();
  const osMap = { darwin: "macos", linux: "linux", win32: "windows" };
  return { os: osMap[p] || p, arch: a };
}
