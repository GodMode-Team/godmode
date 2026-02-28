/**
 * Guardrails Service — Configurable safety gate state.
 *
 * Reads/writes ~/godmode/data/guardrails.json with an in-memory cache.
 * Each gate has: enabled flag, optional thresholds, and static metadata.
 * Activity log tracks when gates fire (capped at 200 entries).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join, dirname } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export type GuardrailGateId =
  | "loopBreaker"
  | "grepBlocker"
  | "sessionHygiene"
  | "exhaustiveSearch"
  | "planGate"
  | "spawnGate"
  | "validationGate";

export type GateConfig = {
  enabled: boolean;
  thresholds?: Record<string, number>;
};

export type GuardrailActivityEntry = {
  id: string;
  gateId: GuardrailGateId;
  action: "fired" | "blocked" | "cleaned";
  detail: string;
  sessionKey?: string;
  timestamp: string;
};

export type GuardrailsState = {
  gates: Record<GuardrailGateId, GateConfig>;
  activity: GuardrailActivityEntry[];
  updatedAt: string;
};

export type GateDescriptor = {
  name: string;
  description: string;
  icon: string;
  hook: string;
  thresholdLabels?: Record<string, string>;
};

// ── Defaults ───────────────────────────────────────────────────────

export const GATE_DEFAULTS: Record<GuardrailGateId, GateConfig> = {
  loopBreaker: { enabled: true, thresholds: { maxCalls: 15, windowMinutes: 30 } },
  grepBlocker: { enabled: true },
  sessionHygiene: { enabled: true, thresholds: { maxWorkingLines: 100 } },
  exhaustiveSearch: { enabled: true },
  planGate: { enabled: true },
  spawnGate: { enabled: true },
  validationGate: { enabled: true },
};

export const GATE_DESCRIPTORS: Record<GuardrailGateId, GateDescriptor> = {
  loopBreaker: {
    name: "Loop Breaker",
    description:
      "Blocks any tool called more than N times in a time window. Prevents runaway loops from burning credits.",
    icon: "\u{1F504}",
    hook: "before_tool_call",
    thresholdLabels: { maxCalls: "Max calls per tool", windowMinutes: "Window (minutes)" },
  },
  grepBlocker: {
    name: "Grep Blocker",
    description: "Blocks grep/find/rg on ~/godmode/memory/. Use qmd search instead.",
    icon: "\u{1F6AB}",
    hook: "before_tool_call",
  },
  sessionHygiene: {
    name: "Session Hygiene",
    description:
      "Auto-prunes WORKING.md on session reset. Removes [DONE] items and trims to max lines.",
    icon: "\u{1F9F9}",
    hook: "before_reset",
    thresholdLabels: { maxWorkingLines: "Max WORKING.md lines" },
  },
  exhaustiveSearch: {
    name: "Exhaustive Search",
    description:
      "Blocks lazy refusal responses if no search tools were used first. Forces resource exhaustion before giving up.",
    icon: "\u{1F50D}",
    hook: "message_sending",
  },
  planGate: {
    name: "Plan Gate",
    description:
      "Requires an approved plan doc before dispatching complex coding tasks via coding_task.",
    icon: "\u{1F4CB}",
    hook: "coding_task",
  },
  spawnGate: {
    name: "Spawn Gate",
    description:
      "Blocks sessions_spawn without a prior coding_task call. Ensures worktree isolation.",
    icon: "\u{1F6A7}",
    hook: "before_tool_call",
  },
  validationGate: {
    name: "Validation Gate",
    description:
      "Runs lint/typecheck/test after subagent coding tasks complete. Catches regressions before merge.",
    icon: "\u2705",
    hook: "subagent_ended",
  },
};

// ── State file ─────────────────────────────────────────────────────

const STATE_FILE = join(DATA_DIR, "guardrails.json");
const MAX_ACTIVITY = 200;
const CACHE_TTL_MS = 5_000;

let _cache: { state: GuardrailsState; ts: number } | null = null;

function emptyState(): GuardrailsState {
  return {
    gates: { ...GATE_DEFAULTS },
    activity: [],
    updatedAt: new Date().toISOString(),
  };
}

export async function readGuardrailsState(): Promise<GuardrailsState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GuardrailsState>;
    return {
      gates: { ...GATE_DEFAULTS, ...(parsed.gates ?? {}) },
      activity: parsed.activity ?? [],
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return emptyState();
  }
}

export async function readGuardrailsStateCached(): Promise<GuardrailsState> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL_MS) return _cache.state;
  const state = await readGuardrailsState();
  _cache = { state, ts: Date.now() };
  return state;
}

export async function writeGuardrailsState(state: GuardrailsState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  _cache = null;
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── Helpers ────────────────────────────────────────────────────────

export async function isGateEnabled(gateId: GuardrailGateId): Promise<boolean> {
  const state = await readGuardrailsStateCached();
  return state.gates[gateId]?.enabled ?? GATE_DEFAULTS[gateId]?.enabled ?? true;
}

export async function getGateThreshold(
  gateId: GuardrailGateId,
  key: string,
): Promise<number> {
  const state = await readGuardrailsStateCached();
  return (
    state.gates[gateId]?.thresholds?.[key] ??
    GATE_DEFAULTS[gateId]?.thresholds?.[key] ??
    0
  );
}

export async function logGateActivity(
  gateId: GuardrailGateId,
  action: "fired" | "blocked" | "cleaned",
  detail: string,
  sessionKey?: string,
): Promise<void> {
  try {
    const state = await readGuardrailsState();
    state.activity.push({
      id: randomUUID(),
      gateId,
      action,
      detail,
      sessionKey,
      timestamp: new Date().toISOString(),
    });
    if (state.activity.length > MAX_ACTIVITY) {
      state.activity = state.activity.slice(-MAX_ACTIVITY);
    }
    await writeGuardrailsState(state);
  } catch {
    // Activity logging is best-effort — never block the gate itself
  }
}
