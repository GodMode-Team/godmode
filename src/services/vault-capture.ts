/**
 * vault-capture.ts — Zero-discipline auto-capture pipelines for the Second Brain.
 *
 * Two pipelines run automatically on each consciousness heartbeat tick:
 *
 *   1. Sessions → Daily: Appends Claude Code session summaries to VAULT/01-Daily/
 *   2. Queue Outputs → Inbox: Copies agent outputs to vault inbox
 *
 * All pipelines are idempotent, non-destructive, and fail silently.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { mkdir, writeFile, readFile, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR, DATA_DIR } from "../data-paths.js";
import {
  getVaultPath,
  VAULT_FOLDERS,
  ensureVaultStructure,
} from "../lib/vault-paths.js";
import { localDateString } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

type CaptureResult = {
  captured: number;
  skipped: number;
  errors: string[];
};

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

// ── State Tracking ─────────────────────────────────────────────────────

type CaptureState = {
  /** Session file paths already written to daily notes */
  capturedSessionPaths: string[];
  lastRun: string;
};

const CAPTURE_STATE_FILE = join(DATA_DIR, "vault-capture-state.json");

async function loadCaptureState(): Promise<CaptureState> {
  try {
    const raw = await readFile(CAPTURE_STATE_FILE, "utf-8");
    return JSON.parse(raw) as CaptureState;
  } catch {
    return {
      capturedSessionPaths: [],
      lastRun: "",
    };
  }
}

async function saveCaptureState(state: CaptureState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CAPTURE_STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 1: Claude Code Sessions → Vault Daily Notes
// ═══════════════════════════════════════════════════════════════════════

/**
 * Append Claude Code session summaries to the vault's daily note.
 * Reads from the agent-log JSON and writes a ## Agent Sessions section
 * to VAULT/01-Daily/{date}.md (creates if doesn't exist, appends if it does).
 */
export async function captureSessionsToDailyNotes(logger: Logger): Promise<CaptureResult> {
  const vault = getVaultPath();
  if (!vault) return { captured: 0, skipped: 0, errors: [] };

  const state = await loadCaptureState();
  const capturedSet = new Set(state.capturedSessionPaths);

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  const dailyDir = join(vault, VAULT_FOLDERS.daily);
  await mkdir(dailyDir, { recursive: true });

  // Also mirror agent-log markdown to VAULT/07-Agent-Log/
  const agentLogVaultDir = join(vault, VAULT_FOLDERS.agentLog);
  await mkdir(agentLogVaultDir, { recursive: true });

  // Read today's agent-log JSON
  const today = localDateString();
  const agentLogJsonPath = join(MEMORY_DIR, "agent-log", `${today}.json`);
  const agentLogMdPath = join(MEMORY_DIR, "agent-log", `${today}.md`);

  // Mirror agent-log markdown to vault
  if (existsSync(agentLogMdPath)) {
    try {
      await copyFile(agentLogMdPath, join(agentLogVaultDir, `${today}.md`));
    } catch { /* non-fatal */ }
  }

  if (!existsSync(agentLogJsonPath)) {
    return { captured: 0, skipped: 0, errors: [] };
  }

  try {
    const raw = await readFile(agentLogJsonPath, "utf-8");
    const log = JSON.parse(raw) as {
      completed?: Array<{
        item: string;
        output?: string;
        completedAt: number;
        duration?: string;
      }>;
    };

    if (!log.completed || log.completed.length === 0) {
      return { captured: 0, skipped: 0, errors: [] };
    }

    // Filter to Claude Code sessions we haven't captured yet
    const newSessions = log.completed.filter((entry) => {
      if (!entry.item.startsWith("Claude Code session:")) return false;
      const sessionKey = `${today}:${entry.completedAt}`;
      if (capturedSet.has(sessionKey)) return false;
      return true;
    });

    if (newSessions.length === 0) {
      return { captured: 0, skipped: 0, errors: [] };
    }

    // Build the agent sessions section
    const sessionLines: string[] = [];
    for (const session of newSessions) {
      const time = new Date(session.completedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      sessionLines.push(`- **${time}** — ${session.item}`);
      if (session.output) {
        sessionLines.push(`  - ${session.output}`);
      }

      state.capturedSessionPaths.push(`${today}:${session.completedAt}`);
      captured++;
    }

    // Read existing daily note — never create a minimal stub.
    // If the brief generator hasn't run yet, we skip writing and DON'T mark
    // sessions as captured so they get appended on the next tick after the
    // real brief is generated.
    const dailyNotePath = join(dailyDir, `${today}.md`);

    if (!existsSync(dailyNotePath)) {
      // No daily note yet — brief generator hasn't run. Defer.
      logger.info(
        `[VaultCapture] Sessions→Daily: skipping ${captured} sessions — daily note not yet generated`,
      );
      // Undo the captured tracking so these get picked up next time
      state.capturedSessionPaths = state.capturedSessionPaths.filter(
        (p) => !p.startsWith(`${today}:`),
      );
      captured = 0;
      await saveCaptureState(state);
      return { captured: 0, skipped: newSessions.length, errors };
    }

    let existingContent = await readFile(dailyNotePath, "utf-8");

    // Check if ## Agent Sessions section already exists
    if (existingContent.includes("## Agent Sessions")) {
      // Append to existing section (before the next ## heading or end of file)
      const sectionStart = existingContent.indexOf("## Agent Sessions");
      const afterSection = existingContent.slice(sectionStart);
      const nextHeading = afterSection.indexOf("\n## ", 1);

      const before = existingContent.slice(0, sectionStart + "## Agent Sessions\n\n".length);
      const existingSessionContent = nextHeading > 0
        ? afterSection.slice("## Agent Sessions\n\n".length, nextHeading)
        : afterSection.slice("## Agent Sessions\n\n".length);
      const after = nextHeading > 0 ? afterSection.slice(nextHeading) : "";

      existingContent = before + existingSessionContent + sessionLines.join("\n") + "\n" + after;
    } else {
      // Append new section at the end
      existingContent += `\n## Agent Sessions\n\n${sessionLines.join("\n")}\n`;
    }

    await writeFile(dailyNotePath, existingContent, "utf-8");

    if (captured > 0) {
      logger.info(`[VaultCapture] Sessions→Daily: ${captured} sessions written to ${today}.md`);
    }
  } catch (err) {
    errors.push(`daily-note: ${String(err)}`);
  }

  // Prune old session IDs (keep last 200)
  if (state.capturedSessionPaths.length > 200) {
    state.capturedSessionPaths = state.capturedSessionPaths.slice(-200);
  }

  await saveCaptureState(state);
  return { captured, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 2: Agent Queue Output → Vault Inbox
// ═══════════════════════════════════════════════════════════════════════

/**
 * Copy agent queue outputs from ~/godmode/memory/inbox/ to VAULT/00-Inbox/.
 * Adds frontmatter tagging the source as queue-agent for later triage.
 */
export async function captureQueueOutputsToVault(logger: Logger): Promise<CaptureResult> {
  const vault = getVaultPath();
  if (!vault) return { captured: 0, skipped: 0, errors: [] };

  const localInbox = join(MEMORY_DIR, "inbox");
  if (!existsSync(localInbox)) return { captured: 0, skipped: 0, errors: [] };

  const vaultInbox = join(vault, VAULT_FOLDERS.inbox);
  await mkdir(vaultInbox, { recursive: true });

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  let files: string[];
  try {
    files = readdirSync(localInbox).filter(
      (f) => f.endsWith(".md") && !f.startsWith("."),
    );
  } catch {
    return { captured: 0, skipped: 0, errors: [] };
  }

  for (const file of files) {
    const destPath = join(vaultInbox, file);
    if (existsSync(destPath)) {
      skipped++;
      continue;
    }

    try {
      const content = readFileSync(join(localInbox, file), "utf-8");

      // Add frontmatter if not present
      let enriched = content;
      if (!content.startsWith("---")) {
        const fm = [
          "---",
          `type: agent-output`,
          `source: queue-agent`,
          `capturedAt: ${new Date().toISOString()}`,
          `status: inbox`,
          "---",
          "",
        ].join("\n");
        enriched = fm + content;
      }

      await writeFile(destPath, enriched, "utf-8");
      captured++;
    } catch (err) {
      errors.push(`${file}: ${String(err)}`);
    }
  }

  if (captured > 0) {
    logger.info(`[VaultCapture] Queue outputs→Inbox: ${captured} agent outputs captured`);
  }

  return { captured, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════
// MASTER PIPELINE RUNNER
// ═══════════════════════════════════════════════════════════════════════

export type VaultCaptureResult = {
  sessions: CaptureResult;
  queueOutputs: CaptureResult;
  totalCaptured: number;
};

/**
 * Run all vault capture pipelines. Called during consciousness heartbeat tick.
 * Each pipeline runs independently — failures in one don't block others.
 */
export async function runAllCapturePipelines(logger: Logger): Promise<VaultCaptureResult> {
  const vault = getVaultPath();
  if (!vault) {
    const empty: CaptureResult = { captured: 0, skipped: 0, errors: [] };
    return {
      sessions: empty,
      queueOutputs: empty,
      totalCaptured: 0,
    };
  }

  // Ensure vault structure exists
  ensureVaultStructure();

  let sessions: CaptureResult = { captured: 0, skipped: 0, errors: [] };
  let queueOutputs: CaptureResult = { captured: 0, skipped: 0, errors: [] };

  try {
    sessions = await captureSessionsToDailyNotes(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Sessions pipeline error: ${String(err)}`);
  }

  try {
    queueOutputs = await captureQueueOutputsToVault(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Queue outputs pipeline error: ${String(err)}`);
  }

  const totalCaptured = sessions.captured + queueOutputs.captured;

  return {
    sessions,
    queueOutputs,
    totalCaptured,
  };
}
