// lib/launch.mjs — start gateway, open browser, wait for ready
import { spawn, execSync } from "node:child_process";
import { request } from "node:http";
import { getPlatform } from "./detect.mjs";

const GATEWAY_URL = "http://127.0.0.1:18789";
const GODMODE_URL = `${GATEWAY_URL}/godmode/`;

/**
 * Start the OpenClaw gateway as a child process.
 * Returns the child process handle. The gateway runs in the foreground
 * so the user can Ctrl+C to stop it.
 *
 * @param {{ standalone?: boolean }} opts
 * @returns {import('node:child_process').ChildProcess}
 */
export function startGateway({ standalone = false } = {}) {
  const cmd = standalone ? "godmode" : "openclaw";
  const args = standalone ? ["serve"] : ["gateway", "start"];

  const child = spawn(cmd, args, {
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });

  // Forward gateway output to our stderr so it doesn't clutter the install UI
  if (child.stdout) child.stdout.pipe(process.stderr);
  if (child.stderr) child.stderr.pipe(process.stderr);

  return child;
}

/**
 * Open a URL in the user's default browser. Platform-aware.
 * @param {string} url
 */
export function openBrowser(url) {
  const { os } = getPlatform();
  try {
    switch (os) {
      case "macos":
        execSync(`open "${url}"`, { stdio: "ignore" });
        break;
      case "linux":
        execSync(`xdg-open "${url}"`, { stdio: "ignore" });
        break;
      case "windows":
        execSync(`start "" "${url}"`, { stdio: "ignore", shell: true });
        break;
      default:
        // Silently fail — user can open URL manually
        break;
    }
  } catch {
    // Non-fatal: user can open the URL manually
  }
}

/**
 * Poll the gateway URL until it responds with HTTP 200 (or any response).
 * @param {string} [url] — URL to poll (defaults to gateway root)
 * @param {number} [timeout] — max wait in ms (default 15000)
 * @returns {Promise<boolean>} true if ready, false if timed out
 */
export function waitForReady(url = GATEWAY_URL, timeout = 15_000) {
  const start = Date.now();
  const interval = 500;

  return new Promise((resolve) => {
    function check() {
      if (Date.now() - start > timeout) {
        return resolve(false);
      }

      const req = request(url, { method: "GET", timeout: 2000 }, (res) => {
        // Any response means the server is up
        resolve(true);
        res.resume(); // drain
      });

      req.on("error", () => {
        setTimeout(check, interval);
      });

      req.on("timeout", () => {
        req.destroy();
        setTimeout(check, interval);
      });

      req.end();
    }

    check();
  });
}

/**
 * Get the GodMode UI URL.
 * @returns {string}
 */
export function getGodModeUrl() {
  return GODMODE_URL;
}
