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

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const CONSCIOUSNESS_SCRIPT = join(GODMODE_ROOT, "scripts", "consciousness-sync.sh");
const CONSCIOUSNESS_FILE = join(MEMORY_DIR, "CONSCIOUSNESS.md");
const EXEC_TIMEOUT_MS = 90_000; // full sync: harvest + ClawVault + heartbeat
let flushInFlight: Promise<{ stdout: string; stderr: string }> | null = null;

function runScript(): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    nodeExec(
      `bash "${CONSCIOUSNESS_SCRIPT}"`,
      { timeout: EXEC_TIMEOUT_MS, env: { ...process.env, HOME: process.env.HOME } },
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

const flush: GatewayRequestHandler = async ({ respond }) => {
  const scriptReady = assertScriptReady();
  if (!scriptReady.ok) {
    respond(false, undefined, {
      code: "NOT_FOUND",
      message: scriptReady.message,
    });
    return;
  }
  try {
    const { stdout } = await runScriptWithLock();
    const content = readConsciousness();
    const lineCount = content ? content.split("\n").length : 0;
    respond(true, {
      ok: true,
      message: stdout.trim() || `Consciousness updated (${lineCount} lines)`,
      content,
      lineCount,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    respond(false, undefined, {
      code: "UNAVAILABLE",
      message: String(err),
    });
  }
};

const read: GatewayRequestHandler = async ({ respond }) => {
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
