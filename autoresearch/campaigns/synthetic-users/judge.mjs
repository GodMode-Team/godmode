/**
 * judge.mjs — LLM Judge for the Synthetic User Testing Campaign.
 *
 * Scores each interaction on 7 weighted North Star dimensions using Sonnet 4.6.
 * Provides bug classification and rate-limited concurrent evaluation.
 */

import { createAnthropicCaller, loadGodModeEnv } from "../../lib/resolve-anthropic.mjs";

loadGodModeEnv();

// ── 7 North Star Dimensions ────────────────────────────────────────

export const DIMENSIONS = [
  {
    key: "flow_state",
    weight: 0.20,
    prompt: "Score 0-10: Did this user achieve their goal with minimal friction? Did the interface feel like it disappeared? Did the AI anticipate what the user needed?",
  },
  {
    key: "memory_continuity",
    weight: 0.20,
    prompt: "Score 0-10: Did the AI demonstrate awareness of the user's context, history, and preferences? Did it connect dots the user didn't explicitly make? Would this feel like an ally or a stranger?",
  },
  {
    key: "control",
    weight: 0.15,
    prompt: "Score 0-10: Does this user feel like they OWN their AI OS? Can they bend it to their workflow? Is configuration discoverable and intuitive? Would a control-conscious entrepreneur feel comfortable?",
  },
  {
    key: "integration_depth",
    weight: 0.15,
    prompt: "Score 0-10: Do the user's tools feel unified through GodMode? Does data flow between systems without manual bridging? Would this replace their current duct-tape stack?",
  },
  {
    key: "trust_progression",
    weight: 0.10,
    prompt: "Score 0-10: Does the trust system make the user feel safe delegating more? Is autonomy earned, not assumed? Would an entrepreneur who's been burned by AI before feel comfortable increasing delegation?",
  },
  {
    key: "resilience",
    weight: 0.10,
    prompt: "Score 0-10: When something went wrong, did the system handle it gracefully? Did the user understand what happened and what to do? Would a non-technical user feel supported or abandoned?",
  },
  {
    key: "comprehension",
    weight: 0.10,
    prompt: "Score 0-10: Does the user always know what's happening, what they can do, and what the AI is doing on their behalf? Is the experience transparent without being verbose?",
  },
];

// ── Bug Classification ─────────────────────────────────────────────

const P0_KEYWORDS = ["crash", "data loss", "data-loss", "corruption", "unrecoverable", "blank screen", "white screen", "infinite loop", "hang", "freeze"];
const P1_KEYWORDS = ["broken", "not working", "fails", "error", "cannot", "unable", "missing feature", "404", "500", "timeout", "unresponsive"];
const P2_KEYWORDS = ["friction", "confusing", "unintuitive", "slow", "awkward", "unclear", "hard to find", "unexpected", "misleading", "inconsistent"];

/**
 * Classify a bug description into P0-P3 severity.
 * @param {string} description - Bug description text
 * @param {string} [surface] - UI surface where the bug occurred
 * @returns {"P0"|"P1"|"P2"|"P3"}
 */
export function classifyBug(description, surface) {
  const lower = (description || "").toLowerCase() + " " + (surface || "").toLowerCase();

  if (P0_KEYWORDS.some((kw) => lower.includes(kw))) return "P0";
  if (P1_KEYWORDS.some((kw) => lower.includes(kw))) return "P1";
  if (P2_KEYWORDS.some((kw) => lower.includes(kw))) return "P2";
  return "P3";
}

// ── Rate-Limiting Semaphore ────────────────────────────────────────

class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    await new Promise((resolve) => this.queue.push(resolve));
    this.current++;
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    }
  }
}

const judgeSemaphore = new Semaphore(3);
const DELAY_BETWEEN_CALLS_MS = 500;
let lastCallTimestamp = 0;

// ── System & User Prompts ──────────────────────────────────────────

const SYSTEM_PROMPT = `You are the QA judge for GodMode, the Personal AI OS for Entrepreneurs. You evaluate user interactions across 7 dimensions. Score each dimension 0-10 based on what actually happened. Be specific and honest — scores of 10 are rare. Also identify any bugs (P0=crash/data-loss, P1=feature broken, P2=UX friction, P3=cosmetic). Return JSON only.`;

function buildUserPrompt(action, pageState, archetype, depthLevel) {
  const profileSummary = archetype?.profile
    ? `${archetype.profile.role}, ${archetype.profile.revenue}, ${archetype.profile.aiUsage}. Pain: ${archetype.profile.painPoint}`
    : "Unknown archetype";

  const name = archetype?.displayName || archetype?.name || "Unknown";

  return `Archetype: ${name} (${profileSummary})
Action taken: ${action}
Page state after action: ${typeof pageState === "string" ? pageState : JSON.stringify(pageState, null, 2)}
Depth level: ${depthLevel || "happy_path"}

Score each dimension and list any bugs found.

Return JSON: { "scores": { "flow_state": N, "memory_continuity": N, "control": N, "integration_depth": N, "trust_progression": N, "resilience": N, "comprehension": N }, "bugs": [{ "severity": "P0"|"P1"|"P2"|"P3", "description": "..." }], "feedback": "..." }`;
}

// ── Judge Factory ──────────────────────────────────────────────────

/**
 * Create a judge function backed by Sonnet 4.6.
 *
 * @returns {Promise<{judge: Function}>}
 *   judge(action, pageState, screenshotPath, archetype, depthLevel) => { scores, bugs, feedback, weighted }
 */
export async function createJudge() {
  const caller = await createAnthropicCaller("claude-sonnet-4-6", { temperature: 0.2 });
  if (!caller) {
    throw new Error("[judge] Could not initialize Anthropic caller — no API key found.");
  }
  console.log(`[judge] Initialized with model: ${caller.model}, source: ${caller.source}`);

  /**
   * Judge a single interaction.
   *
   * @param {string} action - Description of the action taken
   * @param {string|object} pageState - Page state after action (extracted or raw)
   * @param {string} [screenshotPath] - Path to screenshot (for reference, not sent to API)
   * @param {object} [archetype] - Archetype definition
   * @param {string} [depthLevel] - "happy_path"|"edge_cases"|"power_user"|"adversarial"
   * @returns {Promise<{scores: object, bugs: object[], feedback: string, weighted: number}>}
   */
  async function judge(action, pageState, screenshotPath, archetype, depthLevel) {
    await judgeSemaphore.acquire();
    try {
      // Enforce minimum delay between calls
      const now = Date.now();
      const elapsed = now - lastCallTimestamp;
      if (elapsed < DELAY_BETWEEN_CALLS_MS) {
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_CALLS_MS - elapsed));
      }
      lastCallTimestamp = Date.now();

      const userPrompt = buildUserPrompt(action, pageState, archetype, depthLevel);
      const raw = await caller(SYSTEM_PROMPT, userPrompt, 1024);

      if (!raw) {
        console.warn("[judge] Empty response from LLM — returning default scores");
        return buildDefaultResult(action, screenshotPath);
      }

      // Parse JSON from response (handle markdown fences)
      let parsed;
      try {
        const jsonStr = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        parsed = JSON.parse(jsonStr);
      } catch (parseErr) {
        console.warn(`[judge] Failed to parse LLM response as JSON: ${parseErr.message}`);
        console.warn(`[judge] Raw response: ${raw.slice(0, 300)}`);
        return buildDefaultResult(action, screenshotPath);
      }

      // Validate and normalize scores
      const scores = {};
      for (const dim of DIMENSIONS) {
        const val = parsed.scores?.[dim.key];
        scores[dim.key] = typeof val === "number" ? Math.max(0, Math.min(10, val)) : 5;
      }

      // Validate bugs
      const bugs = (parsed.bugs || []).map((b) => ({
        severity: ["P0", "P1", "P2", "P3"].includes(b.severity)
          ? b.severity
          : classifyBug(b.description || ""),
        description: b.description || "Unknown bug",
        action,
        screenshotPath: screenshotPath || null,
      }));

      // Calculate weighted score
      const weighted = DIMENSIONS.reduce(
        (sum, dim) => sum + scores[dim.key] * dim.weight,
        0,
      );

      return {
        scores,
        bugs,
        feedback: parsed.feedback || "",
        weighted: Math.round(weighted * 100) / 100,
        screenshotPath: screenshotPath || null,
      };
    } finally {
      judgeSemaphore.release();
    }
  }

  return judge;
}

// ── Helpers ────────────────────────────────────────────────────────

function buildDefaultResult(action, screenshotPath) {
  const scores = {};
  for (const dim of DIMENSIONS) {
    scores[dim.key] = 5; // neutral default
  }
  return {
    scores,
    bugs: [],
    feedback: `[judge] Could not evaluate action: ${action}`,
    weighted: 5.0,
    screenshotPath: screenshotPath || null,
  };
}
