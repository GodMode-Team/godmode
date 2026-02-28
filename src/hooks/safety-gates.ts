/**
 * Safety Gates — Deterministic enforcement hooks.
 *
 * Each gate enforces a rule that was previously a prompt instruction
 * and got violated repeatedly. Moving it here makes it unforgettable.
 *
 * Pattern: check config → check condition → log activity → block with reason → agent adapts.
 *
 * All gates read from ~/godmode/data/guardrails.json via an in-memory cache.
 * If the config file is missing, all gates default to enabled (fail-open).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import {
  readGuardrailsStateCached,
  logGateActivity,
  GATE_DEFAULTS,
} from "../services/guardrails.js";

// ── Loop Breaker ────────────────────────────────────────────────
//
// Problem: Ralph ran 94 executions in 5 hours. $50-150 wasted.
// Rule: No tool should be called > maxCalls times in windowMinutes per session.

type CallRecord = { tool: string; ts: number };
const callHistory = new Map<string, CallRecord[]>();

/**
 * Track a tool call. Returns a block object if the tool has been
 * called too many times in the window. Reads thresholds from config.
 */
export async function trackToolCall(
  sessionKey: string | undefined,
  toolName: string,
): Promise<{ blocked: boolean; reason?: string }> {
  const config = await readGuardrailsStateCached();
  if (!config.gates.loopBreaker?.enabled) return { blocked: false };

  const maxCalls =
    config.gates.loopBreaker?.thresholds?.maxCalls ??
    GATE_DEFAULTS.loopBreaker.thresholds!.maxCalls;
  const windowMs =
    (config.gates.loopBreaker?.thresholds?.windowMinutes ??
      GATE_DEFAULTS.loopBreaker.thresholds!.windowMinutes) *
    60 *
    1000;

  const key = sessionKey ?? "__default__";
  const now = Date.now();
  const cutoff = now - windowMs;

  let records = callHistory.get(key) ?? [];
  records = records.filter((r) => r.ts > cutoff);
  const toolCount = records.filter((r) => r.tool === toolName).length;

  if (toolCount >= maxCalls) {
    const windowMin = Math.round(windowMs / 60000);
    void logGateActivity(
      "loopBreaker",
      "fired",
      `Blocked ${toolName} (${toolCount} calls in ${windowMin}min)`,
      sessionKey,
    );
    return {
      blocked: true,
      reason: [
        `Loop detected: \`${toolName}\` has been called ${toolCount} times in the last ${windowMin} minutes.`,
        "",
        "This looks like an infinite loop. Stopping to prevent cost bleed.",
        "Review what's happening and try a different approach.",
      ].join("\n"),
    };
  }

  records.push({ tool: toolName, ts: now });
  callHistory.set(key, records);
  return { blocked: false };
}

// ── Grep Blocker ────────────────────────────────────────────────
//
// Problem: Atlas uses grep/find on ~/godmode/memory/ instead of qmd search.
// Stated in MISTAKES.md, FEEDBACK-LOG.md, AND Immutable Rules. Still violated.
// Rule: Block grep/find/rg targeting memory paths.

const MEMORY_PATH_PATTERNS = [
  "~/godmode/memory",
  "$HOME/godmode/memory",
  "godmode/memory",
  MEMORY_DIR,
  GODMODE_ROOT + "/memory",
];

const GREP_COMMANDS = /\b(grep|rg|find|ag|ack)\b/;

/**
 * Check if a bash/exec command is grepping memory files.
 * Returns a block reason if so, undefined if allowed.
 */
export async function checkGrepOnMemory(
  command: string,
  sessionKey?: string,
): Promise<string | undefined> {
  const config = await readGuardrailsStateCached();
  if (!config.gates.grepBlocker?.enabled) return undefined;

  if (!GREP_COMMANDS.test(command)) return undefined;

  const lower = command.toLowerCase();
  const hitsMemory = MEMORY_PATH_PATTERNS.some((p) =>
    lower.includes(p.toLowerCase()),
  );

  if (!hitsMemory) return undefined;

  void logGateActivity(
    "grepBlocker",
    "blocked",
    `Blocked grep/find on memory: ${command.slice(0, 80)}`,
    sessionKey,
  );

  return [
    "Blocked: grep/find on ~/godmode/memory/ is not allowed.",
    "",
    "Use `qmd search` or `memory_search` instead.",
    "grep on memory files returns 100KB+ and crashes the UI.",
    "",
    "This rule is in MISTAKES.md, FEEDBACK-LOG.md, and Immutable Rules.",
  ].join("\n");
}

// ── Session Hygiene ─────────────────────────────────────────────
//
// Problem: WORKING.md doesn't get cleaned at session end.
// Stale [DONE] items carry over. File exceeds 100 lines.
// Rule: Auto-prune on session reset.

const WORKING_PATH = path.join(MEMORY_DIR, "WORKING.md");

/**
 * Clean up WORKING.md before session reset.
 * Removes [DONE] items and trims to maxWorkingLines from config.
 */
export async function cleanWorkingMd(): Promise<{
  cleaned: boolean;
  removedDone: number;
  trimmedLines: number;
}> {
  const config = await readGuardrailsStateCached();
  if (!config.gates.sessionHygiene?.enabled) {
    return { cleaned: false, removedDone: 0, trimmedLines: 0 };
  }

  const maxLines =
    config.gates.sessionHygiene?.thresholds?.maxWorkingLines ??
    GATE_DEFAULTS.sessionHygiene.thresholds!.maxWorkingLines;

  let removedDone = 0;
  let trimmedLines = 0;

  try {
    const content = await fs.readFile(WORKING_PATH, "utf-8");
    let lines = content.split("\n");

    lines = lines.filter((line) => {
      if (/\[DONE\]/i.test(line)) {
        removedDone++;
        return false;
      }
      return true;
    });

    if (lines.length > maxLines) {
      trimmedLines = lines.length - maxLines;
      lines = lines.slice(0, maxLines);
      lines.push(
        "",
        `<!-- Trimmed ${trimmedLines} lines at session end to stay under ${maxLines} line limit -->`,
      );
    }

    if (removedDone > 0 || trimmedLines > 0) {
      await fs.writeFile(WORKING_PATH, lines.join("\n"), "utf-8");
      void logGateActivity(
        "sessionHygiene",
        "cleaned",
        `Removed ${removedDone} [DONE] items, trimmed ${trimmedLines} lines`,
      );
      return { cleaned: true, removedDone, trimmedLines };
    }

    return { cleaned: false, removedDone: 0, trimmedLines: 0 };
  } catch {
    return { cleaned: false, removedDone: 0, trimmedLines: 0 };
  }
}

// ── Exhaustive Search Gate ─────────────────────────────────────
//
// Problem: Atlas says "I don't know" or "I can't" without trying.
// Immutable Rule #11: Never return a dead-end without full resource exhaustion.
// Rule: Block refusal messages if no search tools were called first.
//
// Flow: after_tool_call tracks searches → message_sending cancels lazy refusals
//       → before_prompt_build injects "you got blocked, search first" nudge.

const SEARCH_TOOLS = new Set([
  "qmd_search",
  "qmd_vsearch",
  "memory_search",
  "web_search",
  "mcp__qmd__search",
  "mcp__qmd__vsearch",
]);

/** Per-session: has a search tool been called? */
const searchUsage = new Map<string, boolean>();

/** Per-session: was the last response blocked by the search gate? */
const searchGateBlocked = new Map<string, boolean>();

/**
 * Record that a search tool was used in this session.
 * Call from after_tool_call for every tool invocation.
 */
export function trackSearchUsage(
  sessionKey: string | undefined,
  toolName: string,
): void {
  const key = sessionKey ?? "__default__";
  const normalized = toolName.trim().toLowerCase();
  if (SEARCH_TOOLS.has(normalized)) {
    searchUsage.set(key, true);
  }
}

const REFUSAL_PATTERNS =
  /\b(I don'?t know|I'?m not sure|I can'?t|I'?m unable|I don'?t have|no results?|not found|I couldn'?t find|I don'?t see|I have no|unfortunately.{0,20}(can'?t|unable|don'?t))\b/i;

/**
 * Check if an outbound message is a lazy refusal.
 * Returns true (cancel) if refusal detected AND no search tools were used.
 */
export async function checkLazyRefusal(
  sessionKey: string | undefined,
  content: string,
): Promise<boolean> {
  const config = await readGuardrailsStateCached();
  if (!config.gates.exhaustiveSearch?.enabled) return false;

  const key = sessionKey ?? "__default__";

  if (searchUsage.get(key)) return false;
  if (content.length > 500) return false;
  if (!REFUSAL_PATTERNS.test(content)) return false;

  searchGateBlocked.set(key, true);
  void logGateActivity(
    "exhaustiveSearch",
    "fired",
    `Blocked lazy refusal: "${content.slice(0, 80)}..."`,
    sessionKey,
  );
  return true;
}

/**
 * If the search gate blocked the last response, return a nudge
 * to inject via before_prompt_build. Clears the flag after consumption.
 */
export function consumeSearchGateNudge(
  sessionKey: string | undefined,
): string | undefined {
  const key = sessionKey ?? "__default__";
  if (!searchGateBlocked.get(key)) return undefined;

  searchGateBlocked.delete(key);
  return [
    "[ENFORCEMENT: Exhaustive Search Gate]",
    "",
    "Your previous response was blocked because it contained a refusal",
    "or expression of uncertainty, but you haven't used any search tools yet.",
    "",
    "Immutable Rule #11: Never return a dead-end without full resource exhaustion.",
    "",
    "Before responding with uncertainty, you MUST try:",
    "1. `qmd search` or `qmd vsearch` for memory/notes",
    "2. `memory_search` for indexed facts",
    "3. `web_search` for external information",
    "",
    "Search first, then respond honestly with what you found.",
  ].join("\n");
}

/**
 * Reset search tracking for a session (call on session reset).
 */
export function resetSearchTracking(sessionKey: string | undefined): void {
  const key = sessionKey ?? "__default__";
  searchUsage.delete(key);
  searchGateBlocked.delete(key);
}
