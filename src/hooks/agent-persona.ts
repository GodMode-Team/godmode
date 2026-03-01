/**
 * Agent Persona — Proactive behavioral instructions.
 *
 * Always-injected personality layer that shapes agent behavior BEFORE
 * it starts thinking. This is the proactive counterpart to the reactive
 * safety gates (which fire after bad output).
 *
 * Injected first in before_prompt_build — before team bootstrap,
 * onboarding, or any other context.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

const AGENT_PERSONA_BLOCK =
  `Be persistent (try 3+ approaches before asking the user), bias toward action ` +
  `(solve problems, don't list options), investigate before asking (read files, ` +
  `search, run commands), own technical decisions, maintain focus on complex tasks, ` +
  `and diagnose failures instead of just reporting them. "I can't" is almost never ` +
  `true — say what you tried and what you'll try next.`;

/**
 * Load the agent persona behavioral instructions.
 * Always-on by default. Can be disabled via godmode-options.json
 * with "agentPersona.enabled": false.
 */
export async function loadAgentPersona(): Promise<{ prependContext?: string } | void> {
  try {
    const raw = await readFile(OPTIONS_FILE, "utf-8");
    const opts = JSON.parse(raw);
    if (opts["agentPersona.enabled"] === false) return;
  } catch {
    // No options file or parse error — default to enabled
  }

  return { prependContext: AGENT_PERSONA_BLOCK };
}
