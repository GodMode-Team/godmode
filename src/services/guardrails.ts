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
  | "persistenceGate"
  | "searchRetryGate"
  | "planGate"
  | "spawnGate"
  | "validationGate"
  | "promptShield"
  | "outputShield"
  | "configShield"
  | "ephemeralPathShield"
  | "contextPressure"
  | "unverifiedClaimGate"
  | "proactiveLookupGate"
  | "restartGate"
  | "veiledAskGate"
  | "evidenceTokenGate"
  | "architectureGate"
  | "deploymentGate"
  | "destructiveWriteGate"
  | "clientFacingGate"
  | "frontDraftGate";

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
  action: "fired" | "blocked" | "cleaned" | "approved";
  detail: string;
  sessionKey?: string;
  timestamp: string;
};

export type ToolGroundingConfig = {
  enabled: boolean;
  enforcement: "soft" | "hard";
  categories: Record<string, boolean>;
  tokenBudgetWarning: boolean;
  logViolations: boolean;
};

export type GuardrailsState = {
  gates: Record<GuardrailGateId, GateConfig>;
  activity: GuardrailActivityEntry[];
  custom?: CustomGuardrail[];
  toolGrounding?: ToolGroundingConfig;
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
  loopBreaker: { enabled: true, thresholds: { maxCalls: 500, windowMinutes: 30, warnAt: 450 } },
  grepBlocker: { enabled: true },
  sessionHygiene: { enabled: true, thresholds: { maxWorkingLines: 100 } },
  exhaustiveSearch: { enabled: true },
  selfServiceGate: { enabled: true, thresholds: { minSearchSources: 2 } },
  persistenceGate: { enabled: true, thresholds: { minInvestigationTools: 3 } },
  searchRetryGate: { enabled: true, thresholds: { minSearchAttempts: 3 } },
  planGate: { enabled: true },
  spawnGate: { enabled: true },
  validationGate: { enabled: true },
  promptShield: { enabled: true },
  outputShield: { enabled: true },
  configShield: { enabled: true },
  ephemeralPathShield: { enabled: true },
  contextPressure: { enabled: true, thresholds: { warningPercent: 70, criticalPercent: 90, maxContextTokens: 200000 } },
  unverifiedClaimGate: { enabled: true },
  proactiveLookupGate: { enabled: true, thresholds: { minSearchSources: 2 } },
  restartGate: { enabled: true },
  veiledAskGate: { enabled: true },
  evidenceTokenGate: { enabled: true, thresholds: { minSearchSources: 2, tokenTtlSeconds: 60 } },
  architectureGate: { enabled: true },
  deploymentGate: { enabled: true },
  destructiveWriteGate: { enabled: true },
  clientFacingGate: { enabled: true },
  frontDraftGate: { enabled: true },
};

/** Default config for the tool-grounding gate (top-level, not a gate). */
export const TOOL_GROUNDING_STATE_DEFAULTS: ToolGroundingConfig = {
  enabled: true,
  enforcement: "soft",
  categories: {
    "person-lookup": true,
    "status-check": true,
    "codebase-question": true,
    "factual-claim": true,
    "external-lookup": true,
  },
  tokenBudgetWarning: false,
  logViolations: true,
};

export const GATE_DESCRIPTORS: Record<GuardrailGateId, GateDescriptor> = {
  loopBreaker: {
    name: "Loop Breaker",
    description:
      "Warns then blocks any tool called too many times in a window. Burst detection catches rapid-fire loops (<2min). Prevents runaway loops from burning credits.",
    icon: "\u{1F504}",
    hook: "before_tool_call",
    thresholdLabels: { maxCalls: "Max calls per tool", warnAt: "Warn at (calls)", windowMinutes: "Window (minutes)" },
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
      "DEPRECATED — WORKING.md replaced by awareness-snapshot (auto-generated every 15 min).",
    icon: "\u{1F9F9}",
    hook: "before_reset",
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
      "Blocks ALL forms of delegation to the user — questions, verification requests, \"confirm this\", \"let me know\", investigation asks — when the agent hasn't used its own tools first. Never punt to the human.",
    icon: "\u{1F9E0}",
    hook: "message_sending",
  },
  persistenceGate: {
    name: "Persistence Gate",
    description:
      "Blocks premature surrender responses when the agent hasn't used enough investigation tools. Forces the agent to try multiple approaches before giving up.",
    icon: "\u{1F4AA}",
    hook: "message_sending",
    thresholdLabels: { minInvestigationTools: "Min tools before surrender allowed" },
  },
  searchRetryGate: {
    name: "Search Retry Gate",
    description:
      "Blocks 'not found' responses when the agent hasn't tried enough search variations. One bad query isn't enough — try different terms, endpoints, and approaches before declaring something unfindable.",
    icon: "\u{1F504}\u{1F50D}",
    hook: "message_sending",
    thresholdLabels: { minSearchAttempts: "Min search attempts before 'not found' allowed" },
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
  ephemeralPathShield: {
    name: "Ephemeral Path Shield",
    description:
      "Warns when exec commands write to /tmp or /var/tmp. Injects persistence reminder so generated artifacts are saved permanently (GitHub, vault, ~/godmode/artifacts/).",
    icon: "\u{1F4BE}",
    hook: "before_tool_call",
  },
  contextPressure: {
    name: "Context Pressure",
    description:
      "Monitors session context window usage and warns the agent to compact before overflow. Prevents lost responses on long Slack/channel sessions.",
    icon: "\u{1F4CA}",
    hook: "llm_output + before_prompt_build",
    thresholdLabels: {
      warningPercent: "Warning threshold (%)",
      criticalPercent: "Critical threshold (%)",
      maxContextTokens: "Max context tokens",
    },
  },
  unverifiedClaimGate: {
    name: "Unverified Claim Gate",
    description:
      "Blocks confident factual claims about external systems (deployments, APIs, configs, live URLs) when no investigation tools were used this turn. Forces verification before assertion.",
    icon: "\u{26A0}\u{FE0F}",
    hook: "message_sending",
  },
  proactiveLookupGate: {
    name: "Proactive Lookup Gate",
    description:
      "LLM-judged gate that catches the ally silently skipping the lookup chain. Fires when the ally asks the user for information (email, link, contact) without having searched at least 2 sources first. Prevents 'lazy lookup' where the ally checks memory once and punts to the user.",
    icon: "\u{1F9E0}\u{1F50D}",
    hook: "message_sending",
    thresholdLabels: { minSearchSources: "Min search sources before asking user" },
  },
  restartGate: {
    name: "Restart Gate",
    description:
      "Hard-blocks any agent or subagent attempt to restart the gateway via exec/bash. The user has live sessions — restarts must be manual via the UI Restart button.",
    icon: "\u{1F6D1}",
    hook: "before_tool_call",
  },
  veiledAskGate: {
    name: "Veiled Ask Gate",
    description:
      "Catches passive delegation disguised as politeness — 'if you want', 'feel free to', 'let me know if' — that pushes work back to the user without a question mark. Enforces proactive behavior.",
    icon: "\u{1F3AD}",
    hook: "message_sending",
  },
  evidenceTokenGate: {
    name: "Evidence Token Gate",
    description:
      "Requires a search tool call (evidence token) before the ally can ask ANY factual question. No search = no question. Turns the Iron Rule from policy into physics.",
    icon: "\u{1F3AB}",
    hook: "message_sending",
    thresholdLabels: { minSearchSources: "Min search sources before asking", tokenTtlSeconds: "Evidence token TTL (seconds)" },
  },
  architectureGate: {
    name: "Architecture Gate",
    description:
      "HARD BLOCK on creating new infrastructure (scripts, cron jobs, services, daemons, watchers) " +
      "without consulting the architecture first. Nothing gets built without checking what already exists. " +
      "Prevents redundant systems, scope creep, and brute-force solutions.",
    icon: "\u{1F3D7}",
    hook: "before_tool_call",
  },
  deploymentGate: {
    name: "Deployment Gate",
    description:
      "Approval gate for production deploys, pushes to main/master, and PR merges. " +
      "Force pushes are always hard-blocked. Other deploy actions require user approval " +
      "('go ahead', 'approved', etc.) before retries pass through.",
    icon: "\u{1F6A8}",
    hook: "before_tool_call",
  },
  destructiveWriteGate: {
    name: "Destructive Write Gate",
    description:
      "HARD BLOCK on destructive operations: rm -rf on project dirs, git reset --hard, " +
      "force pushes, DROP TABLE, and bulk deletes. Forces backup-first workflow.",
    icon: "\u{1F4A3}",
    hook: "before_tool_call",
  },
  clientFacingGate: {
    name: "Client-Facing Gate",
    description:
      "Approval gate for public/outbound actions: API mutations, email sends, invites, " +
      "social media posts. First attempt blocks and asks ally to get user approval. " +
      "After user says 'approved'/'go ahead'/etc., retries pass through for 10 minutes.",
    icon: "\u{1F6A6}",
    hook: "before_tool_call",
  },
  frontDraftGate: {
    name: "Front Draft Gate",
    description:
      "Hard gate: all Front API email mutations must include draft_mode: \"shared\". " +
      "Cannot be bypassed by approval. Emails are always created as shared drafts.",
    icon: "\u{1F4DD}",
    hook: "before_tool_call",
  },
};

// ── Custom guardrail defaults ────────────────────────────────────────

// Deprecated X guardrail IDs — removed in v1.4.0.
// The browser profile is now logged into X via CDP; these guardrails were blocking valid access.
const DEPRECATED_X_GUARDRAILS = new Set([
  "redirect-x-research",
  "redirect-x-browser",
  "block-x-webfetch",
]);

export const CUSTOM_DEFAULTS: CustomGuardrail[] = [
  {
    id: "prefer-x-read-tool",
    name: "Use x_read for X/Twitter",
    description:
      "Redirects browser tool calls targeting X/Twitter to the dedicated x_read tool, " +
      "which connects directly via CDP without requiring the extension relay.",
    enabled: true,
    trigger: {
      tool: "browser",
      patterns: ["x.com", "twitter.com"],
    },
    action: "redirect",
    message:
      "Use the x_read tool instead of browser for X/Twitter content. " +
      "x_read connects directly to the browser via CDP — no extension needed. " +
      "Actions: search, tweet, thread, timeline, article, bookmarks. " +
      'Example: x_read({ action: "bookmarks" }) or x_read({ action: "tweet", query: "https://x.com/..." })',
    redirectTo: "x_read",
    createdAt: "2026-03-02T00:00:00.000Z",
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
    toolGrounding: { ...TOOL_GROUNDING_STATE_DEFAULTS },
    updatedAt: new Date().toISOString(),
  };
}

export async function readGuardrailsState(): Promise<GuardrailsState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GuardrailsState>;
    let custom = parsed.custom === undefined ? [...CUSTOM_DEFAULTS] : parsed.custom;

    // Migrate: remove deprecated X guardrails (v1.4.0 — browser profile is now logged into X)
    custom = custom.filter((g) => !DEPRECATED_X_GUARDRAILS.has(g.id));

    // Ensure built-in defaults are always present (merge missing ones)
    const existingIds = new Set(custom.map((g) => g.id));
    for (const def of CUSTOM_DEFAULTS) {
      if (!existingIds.has(def.id)) {
        custom.push(def);
      }
    }

    return {
      gates: { ...GATE_DEFAULTS, ...(parsed.gates ?? {}) },
      activity: parsed.activity ?? [],
      custom,
      toolGrounding: { ...TOOL_GROUNDING_STATE_DEFAULTS, ...((parsed as Record<string, unknown>).toolGrounding as Record<string, unknown> ?? {}) },
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
  action: "fired" | "blocked" | "cleaned" | "approved",
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
