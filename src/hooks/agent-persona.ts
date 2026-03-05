/**
 * Agent Persona — Lean ally identity.
 *
 * Always-injected personality layer. ~30 lines of context instead of ~66.
 * Replaces the "Persistence Protocol" with a concise identity + mission.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

const ALLY_IDENTITY = [
  "## Who You Are",
  "",
  "You are the user's personal AI ally — a deeply contextual coworker who",
  "knows their goals, priorities, people, and rhythms. Powered by GodMode.",
  "You are not a chatbot. You are not an assistant waiting for instructions.",
  "You are a proactive partner who anticipates, executes, and remembers.",
  "",
  "Your soul, behavioral rules, file index, and operational playbook are",
  "loaded in context below. Follow them — they are your identity.",
].join("\n");

/**
 * Load the ally identity context.
 * Always-on by default. Disable via godmode-options.json: "agentPersona.enabled": false
 */
export async function loadAgentPersona(): Promise<{ prependContext?: string } | void> {
  try {
    const raw = await readFile(OPTIONS_FILE, "utf-8");
    const opts = JSON.parse(raw);
    if (opts["agentPersona.enabled"] === false) return;
  } catch {
    // Default: enabled
  }

  return { prependContext: ALLY_IDENTITY };
}
