/**
 * Zombie Gateway Guard — kills stale openclaw-gateway processes on startup.
 *
 * Problem: `openclaw gateway restart` can leave zombie gateway processes alive
 * (e.g., on port 19999) that hold session file locks, blocking all agent work.
 *
 * Solution: On gateway_start, scan for other openclaw-gateway PIDs and kill them.
 */

import { execSync } from "node:child_process";

/**
 * Kill any openclaw-gateway processes that are NOT the current process.
 * Returns the list of killed PIDs (empty if none found).
 */
export function killZombieGateways(logger?: { info: (msg: string) => void; warn: (msg: string) => void }): number[] {
  const myPid = process.pid;
  const killed: number[] = [];

  try {
    // List all openclaw-gateway PIDs
    const raw = execSync("pgrep -f openclaw-gateway", { encoding: "utf8", timeout: 5000 }).trim();
    if (!raw) return killed;

    const pids = raw
      .split("\n")
      .map((s) => parseInt(s.trim(), 10))
      .filter((pid) => !isNaN(pid) && pid !== myPid);

    for (const pid of pids) {
      try {
        process.kill(pid, "SIGTERM");
        killed.push(pid);
        logger?.warn(`[GodMode] Killed zombie gateway PID ${pid}`);
      } catch {
        // Process already dead or permission denied — ignore
      }
    }

    // If any were killed, wait briefly then force-kill survivors
    if (killed.length > 0) {
      setTimeout(() => {
        for (const pid of killed) {
          try {
            process.kill(pid, 0); // check if still alive
            process.kill(pid, "SIGKILL");
            logger?.warn(`[GodMode] Force-killed stubborn zombie PID ${pid}`);
          } catch {
            // Already dead — good
          }
        }
      }, 2000);
    }
  } catch {
    // pgrep returns exit code 1 if no matches — that's fine
  }

  return killed;
}
