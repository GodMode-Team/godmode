#!/usr/bin/env node
/**
 * soul-essence autoresearch campaign
 *
 * Optimizes SOUL_ESSENCE and CAPABILITY_MAP prompts in context-budget.ts
 * using LLM-as-judge (Grok via XAI API, OpenAI-compatible).
 *
 * Usage:
 *   node autoresearch/campaigns/soul-essence.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnthropicCaller, loadGodModeEnv } from "../lib/resolve-anthropic.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "../..");
const CONTEXT_BUDGET_PATH = resolve(PLUGIN_ROOT, "src/lib/context-budget.ts");
const LOG_PATH = resolve(__dirname, "soul-essence-log.tsv");

// ── Load env + resolve Anthropic key (Sonnet 4.6 with auto-refresh) ──
loadGodModeEnv();
const LLM_MODEL = "claude-sonnet-4-6";
const _anthropicCall = await createAnthropicCaller(LLM_MODEL);
if (!_anthropicCall) {
  console.error("[soul-essence] No Anthropic API key found. Cannot run LLM judge.");
  process.exit(1);
}

// ── CLI args ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let iterations = 15;
const itIdx = args.indexOf("--iterations");
if (itIdx !== -1 && args[itIdx + 1]) {
  iterations = parseInt(args[itIdx + 1], 10);
  if (isNaN(iterations) || iterations < 1) iterations = 15;
}

// ── Test Scenarios ──────────────────────────────────────────────────

const SCENARIOS = [
  { user: "Good morning!", ideal: "Proactively briefs on today's schedule, priorities, and anything urgent. Doesn't just say 'Good morning back!'", weight: 2 },
  { user: "What's going on with the Q2 launch?", ideal: "Searches memory + vault before responding. Never asks 'which project?' if it can look it up.", weight: 1.5 },
  { user: "Can you help me with something?", ideal: "Says 'Of course, what do you need?' — doesn't list capabilities or give a menu.", weight: 1 },
  { user: "I need to follow up with Alex", ideal: "Looks up Alex in memory/vault, creates a task, suggests next action. Doesn't ask 'Who is Alex?'", weight: 1.5 },
  { user: "Draft a competitive analysis for Project Beta", ideal: "Immediately queues this as a research task, doesn't ask clarifying questions if enough context exists.", weight: 1 },
  { user: "What did we discuss yesterday about the pricing?", ideal: "Searches memory for yesterday's conversation. Never says 'I don't have access to past conversations'.", weight: 2 },
  { user: "I'm stressed about the deadline", ideal: "Acknowledges emotion, then proactively helps — shows deadline status, suggests delegation, offers to triage.", weight: 1.5 },
  { user: "Set up a meeting with Morgan about the redesign", ideal: "Looks up Morgan, checks calendar availability, proposes time. Doesn't ask 'Morgan who?'", weight: 1.5 },
  { user: "What should I delegate this week?", ideal: "Reviews task list, identifies delegatable items, suggests queue additions. Proactive, not reactive.", weight: 1.5 },
  { user: "Update me on everything", ideal: "Gives structured brief: schedule, tasks, queue status, anything urgent. Doesn't ask 'what specifically?'", weight: 2 },
];

const TOTAL_WEIGHT = SCENARIOS.reduce((s, sc) => s + sc.weight, 0);

// ── Mutations ───────────────────────────────────────────────────────

const MUTATIONS = [
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Never say 'I don't have access to' — you DO have access, via memory and vault.",`,
    desc: "Add: never say 'I don't have access to'",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"When the user mentions a person by name, ALWAYS search memory + vault for context on them first.",`,
    desc: "Add: always search for people by name",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Morning greetings = full brief. Don't just greet back.",`,
    desc: "Add: morning greetings trigger full brief",
  },
  {
    target: "SOUL_ESSENCE",
    action: "replace",
    old: `"You also have QMD (memory_search tool) for vault/file search. Use both.",`,
    new: `"You also have vault search (secondBrain.search) for files and notes. Use both memory and vault.",`,
    desc: "Remove QMD jargon, clarify vault search",
  },
  {
    target: "SOUL_ESSENCE",
    action: "replace",
    old: `"You are not a chatbot. You are a proactive partner who anticipates, executes, and remembers.",`,
    new: `"You are NOT a chatbot or assistant. You are a proactive strategic partner who anticipates needs, takes action, and builds on shared history.",`,
    desc: "Strengthen 'not a chatbot' line",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"If the user seems stressed or frustrated, acknowledge the emotion first, then help with concrete actions.",`,
    desc: "Add: acknowledge stress before helping",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"NEVER present a menu of options or list your capabilities. Make a recommendation and execute it.",`,
    desc: "Add: never present menus, just act",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"Structure briefings: Schedule → Tasks → Urgent → Queue status.",`,
    desc: "Add: structured briefing format",
  },
  {
    target: "SOUL_ESSENCE",
    action: "replace",
    old: `"Meta goal: Earn trust through competence. Search before asking. Act, don't list options.",`,
    new: `"Your prime directive: Earn trust through competence. Search before asking. Act decisively — never list options when you can recommend and execute.",`,
    desc: "Swap 'Meta goal' to 'prime directive', strengthen wording",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"You have persistent memory across sessions. Yesterday's conversations are in your memory system.",`,
    desc: "Add: explicit persistent memory across sessions",
  },
  {
    target: "SOUL_ESSENCE",
    action: "replace",
    old: `"You also have QMD (memory_search tool) for vault/file search. Use both.",`,
    new: `"You also have vault/file search via secondBrain.search. Use both memory and vault.",`,
    desc: "Remove QMD implementation detail",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"When delegating via queue_add, explain what the agent will do and set expectations for delivery time.",`,
    desc: "Add: set delegation expectations",
  },
];

// ── Source File Parsing ─────────────────────────────────────────────

function readSource() {
  return readFileSync(CONTEXT_BUDGET_PATH, "utf-8");
}

function writeSource(content) {
  writeFileSync(CONTEXT_BUDGET_PATH, content, "utf-8");
}

/**
 * Extract the array body lines from a const XYZ = [...].join("\\n") block.
 */
function extractArrayBlock(source, varName) {
  const startMarker = `const ${varName} = [`;
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) throw new Error(`Cannot find ${varName} in source`);

  const endMarker = '].join("\\n");';
  const endIdx = source.indexOf(endMarker, startIdx);
  if (endIdx === -1) throw new Error(`Cannot find end of ${varName} array`);

  const blockStart = startIdx + startMarker.length;
  const block = source.slice(blockStart, endIdx);
  return { block, blockStart, blockEnd: endIdx };
}

/**
 * Get the combined prompt text for scoring.
 */
function getPromptText(source) {
  const seBlock = extractArrayBlock(source, "SOUL_ESSENCE");
  const cmBlock = extractArrayBlock(source, "CAPABILITY_MAP");

  // Parse array lines into text
  const parseLines = (block) =>
    block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith('"'))
      .map((l) => {
        // Remove trailing comma
        let s = l.replace(/,\s*$/, "");
        // Remove surrounding quotes
        if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
        return s;
      })
      .join("\n");

  return parseLines(seBlock.block) + "\n\n" + parseLines(cmBlock.block);
}

/**
 * Apply a mutation to the source.
 */
function applyMutation(source, mutation) {
  const { block, blockStart, blockEnd } = extractArrayBlock(source, mutation.target);

  if (mutation.action === "add") {
    // Insert before the closing bracket — add as second-to-last line
    const lines = block.split("\n");
    // Find the last non-empty content line
    let insertIdx = lines.length - 1;
    while (insertIdx >= 0 && !lines[insertIdx].trim().startsWith('"')) insertIdx--;
    if (insertIdx < 0) insertIdx = lines.length - 1;

    // Check if this line already exists
    const newLineClean = mutation.line.replace(/,\s*$/, "").trim();
    const alreadyExists = lines.some((l) => {
      const clean = l.trim().replace(/,\s*$/, "").trim();
      return clean === newLineClean;
    });
    if (alreadyExists) return null; // Skip — already applied

    // Detect indentation from existing lines
    const refLine = lines.find((l) => l.trim().startsWith('"'));
    const indent = refLine ? refLine.match(/^(\s*)/)[1] : "  ";

    lines.splice(insertIdx + 1, 0, `${indent}${mutation.line}`);
    const newBlock = lines.join("\n");
    return source.slice(0, blockStart) + newBlock + source.slice(blockEnd);
  }

  if (mutation.action === "replace") {
    if (!block.includes(mutation.old)) return null; // Target line not found
    const newBlock = block.replace(mutation.old, mutation.new);
    return source.slice(0, blockStart) + newBlock + source.slice(blockEnd);
  }

  if (mutation.action === "remove") {
    if (!block.includes(mutation.old)) return null;
    const newBlock = block
      .split("\n")
      .filter((l) => !l.includes(mutation.old))
      .join("\n");
    return source.slice(0, blockStart) + newBlock + source.slice(blockEnd);
  }

  return null;
}

// ── LLM Judge (Sonnet 4.6 via shared resolver with auto-refresh) ──

async function callJudge(promptText, scenario) {
  const systemMsg = `You are evaluating an AI system prompt for a personal AI ally inside GodMode.
Score how well this system prompt would guide the AI to handle the user message.
Score 1-10 on: (1) Proactivity - would the AI take action vs just respond? (2) Context-awareness - would it search before asking? (3) Tone - ally not assistant? (4) Efficiency - no wasted tokens or menus?
Return JSON only: {"proactivity": N, "context": N, "tone": N, "efficiency": N}`;

  const userMsg = `Given this system prompt:
---
${promptText}
---

How would an AI with this prompt handle: "${scenario.user}"
The ideal behavior is: "${scenario.ideal}"`;

  const content = await _anthropicCall(systemMsg, userMsg, 200);
  if (!content) return { proactivity: 5, context: 5, tone: 5, efficiency: 5 };

  try {
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error(`No JSON in response: ${content}`);
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error(`  Judge parse error: ${err.message}`);
    return { proactivity: 5, context: 5, tone: 5, efficiency: 5 };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Score a prompt across all scenarios. Returns weighted average (0-10).
 */
async function scorePrompt(promptText) {
  let weightedSum = 0;

  // Run scenarios in parallel batches of 3 to stay under rate limits
  const batchSize = 3;
  for (let i = 0; i < SCENARIOS.length; i += batchSize) {
    const batch = SCENARIOS.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (sc) => {
        const scores = await callJudge(promptText, sc);
        const avg = (scores.proactivity + scores.context + scores.tone + scores.efficiency) / 4;
        return avg * sc.weight;
      })
    );
    for (const r of results) weightedSum += r;

    // Small delay between batches
    if (i + batchSize < SCENARIOS.length) await sleep(500);
  }

  return weightedSum / TOTAL_WEIGHT;
}

// ── Logging ─────────────────────────────────────────────────────────

function initLog() {
  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tscore_before\tscore_after\tmutation\tstatus\n", "utf-8");
  }
}

function log(iteration, scoreBefore, scoreAfter, mutationDesc, status) {
  const line = `${iteration}\t${scoreBefore.toFixed(3)}\t${scoreAfter.toFixed(3)}\t${mutationDesc}\t${status}\n`;
  appendFileSync(LOG_PATH, line, "utf-8");
}

// ── Main Loop ───────────────────────────────────────────────────────

async function main() {
  console.log("=== Soul Essence Autoresearch Campaign ===");
  console.log(`Source: ${CONTEXT_BUDGET_PATH}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Scenarios: ${SCENARIOS.length} (total weight: ${TOTAL_WEIGHT})`);
  console.log(`Mutations pool: ${MUTATIONS.length}`);
  console.log();

  initLog();

  // Backup original
  const originalSource = readSource();
  writeFileSync(CONTEXT_BUDGET_PATH + ".bak", originalSource, "utf-8");
  console.log("Backed up original to context-budget.ts.bak");

  // Baseline score
  console.log("\nScoring baseline...");
  const baselineText = getPromptText(readSource());
  let bestScore = await scorePrompt(baselineText);
  console.log(`Baseline score: ${bestScore.toFixed(3)}/10\n`);

  const appliedMutations = new Set();
  let currentSource = readSource();

  for (let i = 1; i <= iterations; i++) {
    // Pick a random unapplied mutation, or random from all if all tried
    const unapplied = MUTATIONS.filter((_, idx) => !appliedMutations.has(idx));
    const pool = unapplied.length > 0 ? unapplied : MUTATIONS;
    const mutation = pool[Math.floor(Math.random() * pool.length)];
    const mutIdx = MUTATIONS.indexOf(mutation);

    console.log(`[${i}/${iterations}] Trying: ${mutation.desc}`);

    const mutated = applyMutation(currentSource, mutation);
    if (!mutated) {
      console.log("  Skipped — mutation not applicable (already applied or target not found)");
      log(i, bestScore, bestScore, mutation.desc, "skipped");
      continue;
    }

    // Write mutated source
    writeSource(mutated);

    // Score
    const mutatedText = getPromptText(mutated);
    const newScore = await scorePrompt(mutatedText);

    console.log(`  Score: ${bestScore.toFixed(3)} → ${newScore.toFixed(3)}`);

    if (newScore >= bestScore) {
      console.log("  ✓ KEEP");
      log(i, bestScore, newScore, mutation.desc, "keep");
      bestScore = newScore;
      currentSource = mutated;
      appliedMutations.add(mutIdx);
    } else {
      console.log("  ✗ DISCARD");
      log(i, bestScore, newScore, mutation.desc, "discard");
      // Revert
      writeSource(currentSource);
    }

    console.log();
  }

  console.log("=== Campaign Complete ===");
  console.log(`Final score: ${bestScore.toFixed(3)}/10`);
  console.log(`Log: ${LOG_PATH}`);
  console.log(`Backup: ${CONTEXT_BUDGET_PATH}.bak`);

  // Show diff summary
  const finalSource = readSource();
  if (finalSource !== originalSource) {
    console.log("\nPrompts were modified. Review changes with:");
    console.log(`  diff ${CONTEXT_BUDGET_PATH}.bak ${CONTEXT_BUDGET_PATH}`);
  } else {
    console.log("\nNo mutations improved the score. Prompts unchanged.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
