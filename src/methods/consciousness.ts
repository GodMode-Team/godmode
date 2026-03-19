/**
 * GodMode — Consciousness Heartbeat
 *
 * `godmode.consciousness.flush` — runs consciousness-sync.sh and returns
 * the generated CONSCIOUSNESS.md so the UI can show a confirmation.
 *
 * `godmode.consciousness.read` — fetches the current CONSCIOUSNESS.md
 * without regenerating it.
 */

import { exec as nodeExec } from "node:child_process";
import { accessSync, constants as fsConstants, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import { syncClaudeCodeSessions } from "../services/claude-code-sync.js";
import { setConsciousnessHeartbeatBroadcast } from "../services/consciousness-heartbeat.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const CONSCIOUSNESS_SCRIPT = join(GODMODE_ROOT, "scripts", "consciousness-sync.sh");
const CONSCIOUSNESS_FILE = join(MEMORY_DIR, "CONSCIOUSNESS.md");
const EXEC_TIMEOUT_MS = 90_000; // full sync: harvest + ClawVault + heartbeat
let flushInFlight: Promise<{ stdout: string; stderr: string }> | null = null;

function runScript(): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    // Unset CLAUDECODE in the child env so nested `claude` CLI calls work.
    const childEnv = { ...process.env, HOME: process.env.HOME } as Record<string, string | undefined>;
    delete childEnv.CLAUDECODE;

    nodeExec(
      `bash "${CONSCIOUSNESS_SCRIPT}"`,
      { timeout: EXEC_TIMEOUT_MS, env: childEnv },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Script failed: ${stderr || err.message}`));
          return;
        }
        resolve({ stdout, stderr });
      },
    );
  });
}

function readConsciousness(): string | null {
  try {
    return readFileSync(CONSCIOUSNESS_FILE, "utf8");
  } catch {
    return null;
  }
}

function assertScriptReady(): { ok: true } | { ok: false; message: string } {
  if (!existsSync(CONSCIOUSNESS_SCRIPT)) {
    return { ok: false, message: "consciousness-sync.sh not found" };
  }
  try {
    accessSync(CONSCIOUSNESS_SCRIPT, fsConstants.R_OK | fsConstants.X_OK);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "consciousness-sync.sh is not readable/executable",
    };
  }
}

async function runScriptWithLock(): Promise<{ stdout: string; stderr: string }> {
  if (flushInFlight) {
    return flushInFlight;
  }
  flushInFlight = runScript();
  try {
    return await flushInFlight;
  } finally {
    flushInFlight = null;
  }
}

/** Wire the heartbeat's broadcast ref lazily on first RPC call. */
function refreshHeartbeatBroadcast(context: Parameters<GatewayRequestHandler>[0]["context"]): void {
  if (!context?.broadcast) return;
  try {
    setConsciousnessHeartbeatBroadcast(context.broadcast);
  } catch {
    // Heartbeat may not be initialized yet — non-fatal
  }
}

const flush: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const scriptReady = assertScriptReady();
  if (!scriptReady.ok) {
    // Graceful fallback: if script doesn't exist, just read existing file
    const existing = readConsciousness();
    if (existing) {
      respond(true, {
        ok: true,
        message: "Consciousness file loaded (sync script not available)",
        content: existing,
        lineCount: existing.split("\n").length,
        updatedAt: new Date().toISOString(),
        scriptMissing: true,
      });
      return;
    }
    respond(false, undefined, {
      code: "NOT_FOUND",
      message: scriptReady.message,
    });
    return;
  }
  try {
    // Broadcast "syncing" status so the UI shows loading state
    context?.broadcast?.("consciousness:status", { status: "syncing" }, { dropIfSlow: true });

    const { stdout, stderr } = await runScriptWithLock();
    const content = readConsciousness();
    const lineCount = content ? content.split("\n").length : 0;

    // Parse step statuses from stdout
    const harvestOk = stdout.includes("Session harvest complete");
    const harvestFailed = stdout.includes("Session harvest failed") || stderr.includes("Session harvest failed");
    const steps = {
      harvest: harvestOk ? "ok" : harvestFailed ? "failed" : "skipped",
      clawvault: stdout.includes("ClawVault reflect complete") ? "ok" : "skipped",
      sessionReflect: stdout.includes("ClawVault session reflect complete") ? "ok" : "skipped",
      heartbeat: stdout.includes("CONSCIOUSNESS.md updated") ? "ok" : "failed",
    };

    const result = {
      ok: true,
      message: stdout.trim() || `Consciousness updated (${lineCount} lines)`,
      content,
      lineCount,
      updatedAt: new Date().toISOString(),
      steps,
    };

    // Broadcast success so the golden icon shows confirmation
    context?.broadcast?.("consciousness:status", {
      status: "ok",
      lineCount,
      updatedAt: result.updatedAt,
      steps,
    }, { dropIfSlow: true });

    // Fire-and-forget: sync Claude Code sessions into agent-log
    syncClaudeCodeSessions().catch(() => {});

    respond(true, result);
  } catch (err) {
    // Broadcast error status
    context?.broadcast?.("consciousness:status", {
      status: "error",
      message: String(err),
    }, { dropIfSlow: true });

    respond(false, undefined, {
      code: "UNAVAILABLE",
      message: String(err),
    });
  }
};

const read: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);
  const content = readConsciousness();
  if (!content) {
    respond(false, undefined, {
      code: "NOT_FOUND",
      message: "CONSCIOUSNESS.md not found — run a flush first",
    });
    return;
  }
  const lineCount = content.split("\n").length;
  let updatedAt = new Date().toISOString();
  try {
    updatedAt = statSync(CONSCIOUSNESS_FILE).mtime.toISOString();
  } catch {
    // Fall back to now when stat lookup races with file rotation.
  }
  respond(true, {
    content,
    lineCount,
    updatedAt,
  });
};

export const consciousnessHandlers: GatewayRequestHandlers = {
  "godmode.consciousness.flush": flush,
  "godmode.consciousness.read": read,
};
