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
  | "selfServiceGate"
  | "planGate"
  | "spawnGate"
  | "validationGate"
  | "promptShield"
  | "outputShield"
  | "configShield";

export type GateConfig = {
  enabled: boolean;
  thresholds?: Record<string, number>;
};

export type CustomGuardrail = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    tool: string;
    patterns: string[];
  };
  action: "block" | "redirect";
  message: string;
  redirectTo?: string;
  createdAt: string;
};

export type GuardrailActivityEntry = {
  id: string;
  gateId: GuardrailGateId | `custom:${string}`;
  action: "fired" | "blocked" | "cleaned";
  detail: string;
  sessionKey?: string;
  timestamp: string;
};

export type GuardrailsState = {
  gates: Record<GuardrailGateId, GateConfig>;
  activity: GuardrailActivityEntry[];
  custom?: CustomGuardrail[];
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
  selfServiceGate: { enabled: true },
  planGate: { enabled: true },
  spawnGate: { enabled: true },
  validationGate: { enabled: true },
  promptShield: { enabled: true },
  outputShield: { enabled: true },
  configShield: { enabled: true },
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
  selfServiceGate: {
    name: "Self-Service Gate",
    description:
      "Blocks messages that ask the user about code, implementation, or architecture when the agent hasn't used read/search tools first. Forces agents to look things up themselves.",
    icon: "\u{1F9E0}",
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
  promptShield: {
    name: "Prompt Shield",
    description:
      "Detects prompt injection attempts in user messages and injects counter-instructions. Catches jailbreaks, role overrides, fake system messages, encoded payloads, and social engineering.",
    icon: "\u{1F6E1}",
    hook: "message_received + before_prompt_build",
  },
  outputShield: {
    name: "Output Shield",
    description:
      "Prevents outbound messages from leaking system prompts, config files, API keys, tool listings, or internal instructions. Defense-in-depth layer.",
    icon: "\u{1F512}",
    hook: "message_sending",
  },
  configShield: {
    name: "Config Shield",
    description:
      "Blocks tool calls (bash, read) that would access sensitive config files like openclaw.json, .env, AGENTS.md, SOUL.md, or SSH keys.",
    icon: "\u{1F5C4}",
    hook: "before_tool_call",
  },
};

// ── Custom guardrail defaults ────────────────────────────────────────

export const CUSTOM_DEFAULTS: CustomGuardrail[] = [
  {
    id: "redirect-x-research",
    name: "Redirect X/Twitter research",
    description: "web_fetch returns garbage on x.com — use XAI API with x_search instead",
    enabled: true,
    trigger: {
      tool: "web_fetch",
      patterns: ["x.com", "twitter.com", "t.co"],
    },
    action: "redirect",
    message: "Do NOT use web_fetch for X/Twitter. Instead use the XAI Responses API (x_search tool) to search X. The endpoint is https://api.x.ai/v1/responses with model grok-4-1-fast-non-reasoning and tool x_search.",
    redirectTo: "x_search",
    createdAt: "2026-02-28T00:00:00.000Z",
  },
];

// ── State file ─────────────────────────────────────────────────────

const STATE_FILE = join(DATA_DIR, "guardrails.json");
const MAX_ACTIVITY = 200;
const CACHE_TTL_MS = 5_000;

let _cache: { state: GuardrailsState; ts: number } | null = null;

function emptyState(): GuardrailsState {
  return {
    gates: { ...GATE_DEFAULTS },
    activity: [],
    custom: [...CUSTOM_DEFAULTS],
    updatedAt: new Date().toISOString(),
  };
}

export async function readGuardrailsState(): Promise<GuardrailsState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GuardrailsState>;
    let custom = parsed.custom === undefined ? [...CUSTOM_DEFAULTS] : parsed.custom;

    // Migrate: replace old "block-x-webfetch" with new "redirect-x-research"
    if (custom.some((g) => g.id === "block-x-webfetch")) {
      custom = custom.filter((g) => g.id !== "block-x-webfetch");
      if (!custom.some((g) => g.id === "redirect-x-research")) {
        custom.push(CUSTOM_DEFAULTS[0]);
      }
    }

    return {
      gates: { ...GATE_DEFAULTS, ...(parsed.gates ?? {}) },
      activity: parsed.activity ?? [],
      custom,
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
  gateId: GuardrailGateId | `custom:${string}`,
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

// ── Custom Guardrails ────────────────────────────────────────────

type CustomCheckResult =
  | { blocked: false }
  | { blocked: true; guardrailId: string; message: string; action: "block" | "redirect"; redirectTo?: string };

/**
 * Check all enabled custom guardrails against a tool call.
 * Returns blocked + message on first match, or { blocked: false }.
 */
export async function checkCustomGuardrails(
  tool: string,
  params: Record<string, unknown>,
): Promise<CustomCheckResult> {
  const state = await readGuardrailsStateCached();
  const customs = state.custom;
  if (!customs || customs.length === 0) return { blocked: false };

  const toolLower = tool.toLowerCase();
  const paramsStr = JSON.stringify(params).toLowerCase();

  for (const g of customs) {
    if (!g.enabled) continue;
    if (g.trigger.tool.toLowerCase() !== toolLower) continue;

    const matched = g.trigger.patterns.some((p) =>
      paramsStr.includes(p.toLowerCase()),
    );
    if (matched) {
      return { blocked: true, guardrailId: g.id, message: g.message, action: g.action, redirectTo: g.redirectTo };
    }
  }

  return { blocked: false };
}

/**
 * Add a custom guardrail. Rejects if an id already exists.
 * Returns the created guardrail with createdAt filled.
 */
export async function addCustomGuardrail(
  input: Omit<CustomGuardrail, "createdAt" | "id"> & { id?: string },
): Promise<CustomGuardrail> {
  const state = await readGuardrailsState();
  if (!state.custom) state.custom = [];

  const id = input.id || randomUUID();

  if (state.custom.some((g) => g.id === id)) {
    throw Object.assign(new Error(`Custom guardrail with id "${id}" already exists`), {
      code: "DUPLICATE_ID",
    });
  }

  const guardrail: CustomGuardrail = {
    id,
    name: input.name,
    description: input.description,
    enabled: input.enabled,
    trigger: input.trigger,
    action: input.action,
    message: input.message,
    ...(input.redirectTo ? { redirectTo: input.redirectTo } : {}),
    createdAt: new Date().toISOString(),
  };

  state.custom.push(guardrail);
  await writeGuardrailsState(state);
  return guardrail;
}

/**
 * Format all active guardrails (built-in + custom) into a plain-text block
 * suitable for injecting into a spawned agent's prompt.
 * This lets coding agents know what rules to follow.
 */
export async function formatGuardrailsForPrompt(): Promise<string> {
  const state = await readGuardrailsStateCached();
  const lines: string[] = ["## Active Guardrails"];

  // Built-in gates
  for (const [id, config] of Object.entries(state.gates)) {
    if (!config.enabled) continue;
    const descriptor = GATE_DESCRIPTORS[id as GuardrailGateId];
    if (descriptor) {
      lines.push(`- **${descriptor.name}**: ${descriptor.description}`);
    }
  }

  // Custom guardrails
  const customs = state.custom?.filter((g) => g.enabled) ?? [];
  if (customs.length > 0) {
    lines.push("");
    lines.push("### Custom Rules");
    for (const g of customs) {
      const tag = g.action === "redirect" ? "REDIRECT" : "BLOCK";
      lines.push(`- **${g.name}** [${tag}] (${g.trigger.tool} → ${g.trigger.patterns.join(", ")}): ${g.message}`);
    }
  }

  return lines.join("\n");
}

/**
 * Remove a custom guardrail by id.
 * Returns { removed: true } if found and removed, { removed: false } otherwise.
 */
export async function removeCustomGuardrail(
  id: string,
): Promise<{ removed: boolean }> {
  const state = await readGuardrailsState();
  if (!state.custom) return { removed: false };

  const before = state.custom.length;
  state.custom = state.custom.filter((g) => g.id !== id);

  if (state.custom.length === before) return { removed: false };

  await writeGuardrailsState(state);
  return { removed: true };
}
