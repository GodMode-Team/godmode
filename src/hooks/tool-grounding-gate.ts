/**
 * Tool-Grounding Gate — Deterministic enforcement for tool-backed responses.
 *
 * Problem: The ally generates plausible answers from context/memory without
 * verifying against actual data sources. This is the #1 trust killer.
 *
 * Solution: Classify each incoming user message and inject a per-turn system
 * instruction requiring specific tool calls before responding.
 *
 * Pattern: classify query → generate grounding instruction → inject into
 * prependContext via safetyNudges → model follows instruction → log.
 *
 * Classification is regex/keyword-based — no LLM calls, <50ms latency.
 *
 * Architecture: P1 (context is king), P4 (autonomy earned), P6 (compound).
 * Reads Layer 6 Interaction Ledger concept from META-ARCHITECTURE §3.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { DATA_DIR, GODMODE_ROOT } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export type GroundingCategory =
  | "person-lookup"
  | "status-check"
  | "codebase-question"
  | "factual-claim"
  | "external-lookup"
  | "conversation";

export interface GroundingRequirement {
  category: GroundingCategory;
  requiredTools: string[];
  instruction: string;
}

export interface ToolGroundingConfig {
  enabled: boolean;
  enforcement: "soft" | "hard";
  categories: Record<string, boolean>;
  tokenBudgetWarning: boolean;
  logViolations: boolean;
}

export interface GroundingLogEntry {
  timestamp: string;
  sessionKey: string;
  userMessage: string;
  classification: GroundingCategory;
  requiredTools: string[];
  injectedInstruction: boolean;
}

// ── Config Defaults ────────────────────────────────────────────────

export const TOOL_GROUNDING_DEFAULTS: ToolGroundingConfig = {
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

// ── Classification Patterns ────────────────────────────────────────
//
// Each pattern set is an array of RegExp tested against the lowercased
// user message. First match wins (categories are ordered by specificity).
// "conversation" is the fallback — no enforcement.

/** Known person names — populated from identity graph at runtime. */
let KNOWN_NAMES: string[] = [];
let namesLoadedAt = 0;

function refreshKnownNames(): void {
  // Refresh every 10 minutes
  if (KNOWN_NAMES.length > 0 && Date.now() - namesLoadedAt < 10 * 60 * 1000) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getOwnerName } = require("../lib/ally-identity.js") as { getOwnerName: () => string };
    const ownerName = getOwnerName().toLowerCase();
    const names = new Set<string>();
    if (ownerName !== "friend") names.add(ownerName);
    // Try loading from identity graph entity cache
    try {
      const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
      const { join } = require("node:path") as typeof import("node:path");
      const dbPath = join(GODMODE_ROOT, "data", "identity-graph.db");
      if (existsSync(dbPath)) {
        const Database = require("better-sqlite3");
        const db = new Database(dbPath, { readonly: true });
        const rows = db.prepare("SELECT name FROM entities WHERE kind = 'person' LIMIT 50").all() as { name: string }[];
        for (const r of rows) {
          const n = r.name.toLowerCase().split(/\s+/)[0]; // first name
          if (n.length >= 2) names.add(n);
        }
        db.close();
      }
    } catch { /* identity graph not available yet */ }
    KNOWN_NAMES = [...names];
    namesLoadedAt = Date.now();
  } catch {
    KNOWN_NAMES = [];
  }
}

/** Pattern: mentions a person by name */
function getPersonPatterns(): RegExp[] {
  refreshKnownNames();
  return [
    // Known names — word-boundary match to avoid false positives
    ...KNOWN_NAMES.map((name) => new RegExp(`\\b${name}\\b`, "i")),
    // Generic person-reference phrases
    /\bwho is\b/i,
  /\bwho was\b/i,
  /\btell me about\s+[A-Z][a-z]+/,
  /\bwhat did\s+[A-Z][a-z]+\s+(say|do|mention|want|ask|think)/,
  /\bwhat does\s+[A-Z][a-z]+\s+(do|want|need|think)/,
  /\bhave (?:you |we )?(heard|spoken|talked)\b.*\bfrom\s+[A-Z][a-z]+/,
  ];
}

/** Pattern: status/progress check */
const STATUS_PATTERNS: RegExp[] = [
  /\bstatus\s+of\b/i,
  /\bwhere are we\b/i,
  /\bwhere do we stand\b/i,
  /\bhow(?:'s| is)\s+\w+\s+going\b/i,
  /\bwhat(?:'s| is)\s+happening\b/i,
  /\bany updates?\b/i,
  /\bprogress\s+on\b/i,
  /\bhow far along\b/i,
  /\bwhat(?:'s| is)\s+the state of\b/i,
  /\bwhat(?:'s| is)\s+left\b.*\b(to do|on|for)\b/i,
  /\btask(?:s)?\s+(list|board|status|count)\b/i,
  /\boverdue\b/i,
  /\bqueue\b/i,
];

/** Pattern: codebase/file/architecture question */
const CODEBASE_PATTERNS: RegExp[] = [
  /\bhook[s]?\b/i,
  /\bplugin\b/i,
  /\bsrc\//i,
  /\b\.ts\b/i,
  /\b\.tsx?\b/i,
  /\barchitecture\b/i,
  /\bcodebase\b/i,
  /\bsource\s*code\b/i,
  /\bfunction\s+\w+/i,
  /\bimport\b.*\bfrom\b/i,
  /\bfile\b.*\b(read|check|look|open|show)\b/i,
  /\b(read|check|look at|open|show)\b.*\bfile\b/i,
  /\bscript[s]?\b/i,
  /\bguardrail[s]?\b/i,
  /\bgateway\b/i,
  /\bconfig\b.*\b(file|json|yaml)\b/i,
];

/** Pattern: factual claim verification */
const FACTUAL_PATTERNS: RegExp[] = [
  /\bis\s+(it|that)\s+true\b/i,
  /\bwhen did\s+(we|I|you)\b/i,
  /\bwhat did\s+(we|I|you)\s+(decide|agree|say)\b/i,
  /\bdo we\s+(have|know)\b/i,
  /\bdid\s+(we|I|you)\b.*\b(ever|already)\b/i,
  /\bwhat(?:'s| is| was)\s+the\s+(decision|agreement|plan|consensus)\b/i,
  /\blast time\s+(we|I)\b/i,
  /\bhow many\b/i,
  /\bwhat(?:'s| is)\s+\w+(?:'s)?\s+(email|phone|number|address)\b/i,
];

/** Pattern: external lookup (URL, company, product) */
const EXTERNAL_PATTERNS: RegExp[] = [
  /https?:\/\//i,
  /\btweet\b/i,
  /\bx\.com\b/i,
  /\btwitter\b/i,
  /\blinkedin\b/i,
  /\bwebsite\b.*\b(check|look|visit|read)\b/i,
  /\b(check|look at|visit|read)\b.*\bwebsite\b/i,
  /\blook up\b.*\b(company|product|tool|service)\b/i,
  /\b(company|product|tool|service)\b.*\blook up\b/i,
  /\bwhat is\b.*\b(company|product|tool|startup)\b/i,
];

/** Pattern: conversation/brainstorming (positive match — no enforcement) */
const CONVERSATION_PATTERNS: RegExp[] = [
  /\bbrainstorm/i,
  /\bwhat do you think\b/i,
  /\bstrateg(y|ize|ic)\b/i,
  /\blet(?:'s| us)\s+(think|brainstorm|discuss|talk|explore)\b/i,
  /\bideas?\s+(for|about|on)\b/i,
  /\bhow should\s+(we|I)\s+(approach|think|handle)\b/i,
  /\bpros?\s+and\s+cons?\b/i,
  /\badvice\b/i,
  /\bopinion\b/i,
  /\bhow do you feel\b/i,
  /\bthank/i,
  /\bgood (morning|afternoon|evening|night)\b/i,
  /\bhey\b/i,
  /\bhello\b/i,
  /\bhi\b/i,
];

// ── Classification ─────────────────────────────────────────────────

/**
 * Classify a user message into a grounding category.
 * Returns a GroundingRequirement with required tools and injection instruction,
 * or null for "conversation" (no enforcement).
 *
 * Order matters: conversation is checked first (override), then categories
 * are checked from most specific to least specific.
 *
 * Performance target: <50ms (regex only, no LLM calls).
 */
export function classifyQuery(userMessage: string): GroundingRequirement | null {
  const msg = userMessage.trim();
  if (msg.length < 3) return null; // Too short to classify

  const lower = msg.toLowerCase();

  // Conversation/brainstorming — check first as an escape hatch.
  // Short greetings and brainstorming get no enforcement.
  if (matchesAny(lower, CONVERSATION_PATTERNS) && msg.length < 200) {
    return null;
  }

  // Person lookup — highest priority after conversation escape
  if (matchesAny(lower, getPersonPatterns())) {
    return {
      category: "person-lookup",
      requiredTools: ["secondbrain.search"],
      instruction: buildInstruction(
        "person-lookup",
        ["secondBrain.search (search for the person mentioned)"],
        "A person was mentioned. You MUST search memory for context about them before responding.",
      ),
    };
  }

  // Status check
  if (matchesAny(lower, STATUS_PATTERNS)) {
    return {
      category: "status-check",
      requiredTools: ["tasks_list", "queue_check"],
      instruction: buildInstruction(
        "status-check",
        ["tasks_list or queue_check or awareness snapshot"],
        "This is a status inquiry. You MUST check tasks, queue, or awareness data before responding.",
      ),
    };
  }

  // Codebase question
  if (matchesAny(lower, CODEBASE_PATTERNS)) {
    return {
      category: "codebase-question",
      requiredTools: ["Read"],
      instruction: buildInstruction(
        "codebase-question",
        ["Read (read the relevant source file)"],
        "This references code or architecture. You MUST read the relevant file(s) before responding.",
      ),
    };
  }

  // Factual claim
  if (matchesAny(lower, FACTUAL_PATTERNS)) {
    return {
      category: "factual-claim",
      requiredTools: ["secondbrain.search"],
      instruction: buildInstruction(
        "factual-claim",
        ["secondBrain.search + verify against source"],
        "This requires factual verification. You MUST search memory and verify against a source before responding.",
      ),
    };
  }

  // External lookup
  if (matchesAny(lower, EXTERNAL_PATTERNS)) {
    return {
      category: "external-lookup",
      requiredTools: ["web_search", "x_read", "web_fetch"],
      instruction: buildInstruction(
        "external-lookup",
        ["web_search, x_read, or web_fetch"],
        "This references external content. You MUST fetch/search the external source before responding.",
      ),
    };
  }

  // No pattern matched — treat as conversation (no enforcement)
  return null;
}

// ── Instruction Generation ─────────────────────────────────────────

function buildInstruction(
  category: string,
  tools: string[],
  context: string,
): string {
  return [
    `## GROUNDING REQUIRED [${category}]`,
    context,
    `Required tool(s): ${tools.join(", ")}`,
    "Do NOT generate a response from memory or context alone.",
    "Accuracy > speed. Tokens are free on Max.",
  ].join("\n");
}

/**
 * Generate the grounding instruction for injection into prependContext.
 * Reads the toolGrounding config from guardrails.json (via passed config)
 * and returns the instruction string, or null if disabled/skipped.
 */
export function generateGroundingInstruction(
  userMessage: string,
  config: ToolGroundingConfig,
): { instruction: string; classification: GroundingRequirement } | null {
  if (!config.enabled) return null;

  const classification = classifyQuery(userMessage);
  if (!classification) return null;

  // Check if this category is enabled
  if (!config.categories[classification.category]) return null;

  return {
    instruction: classification.instruction,
    classification,
  };
}

// ── Logging ────────────────────────────────────────────────────────

const GROUNDING_LOG_PATH = join(DATA_DIR, "grounding-log.json");
const MAX_LOG_ENTRIES = 1000;

/**
 * Append a grounding event to the log file.
 * Append-only, max 1000 entries (rotates oldest).
 * Best-effort — never blocks the gate.
 */
export async function logGroundingEvent(entry: GroundingLogEntry): Promise<void> {
  try {
    await mkdir(dirname(GROUNDING_LOG_PATH), { recursive: true });

    let entries: GroundingLogEntry[] = [];
    try {
      const raw = await readFile(GROUNDING_LOG_PATH, "utf-8");
      entries = JSON.parse(raw);
      if (!Array.isArray(entries)) entries = [];
    } catch {
      // File doesn't exist or is invalid — start fresh
    }

    entries.push(entry);

    // Rotate: keep only the most recent MAX_LOG_ENTRIES
    if (entries.length > MAX_LOG_ENTRIES) {
      entries = entries.slice(-MAX_LOG_ENTRIES);
    }

    await writeFile(GROUNDING_LOG_PATH, JSON.stringify(entries, null, 2), "utf-8");
  } catch {
    // Logging is best-effort — never block the gate
  }
}

// ── Helpers ────────────────────────────────────────────────────────

function matchesAny(text: string, patterns: RegExp[]): boolean {
  for (const p of patterns) {
    if (p.test(text)) return true;
  }
  return false;
}
