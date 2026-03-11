#!/usr/bin/env node
/**
 * ally-experience autoresearch campaign
 *
 * Simulates real user sessions across 5 personas and scores GodMode's
 * SOUL_ESSENCE + CAPABILITY_MAP on 4 transformative-ally dimensions:
 *   LEVERAGE · FLOW · AWAKENING · PURPOSE
 *
 * Usage:
 *   node autoresearch/campaigns/ally-experience.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnthropicCaller, loadGodModeEnv } from "../lib/resolve-anthropic.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "../..");
const CONTEXT_BUDGET_PATH = resolve(PLUGIN_ROOT, "src/lib/context-budget.ts");
const LOG_PATH = resolve(__dirname, "ally-experience-log.tsv");

// ── Load env + resolve Anthropic key (Sonnet 4.6 with auto-refresh) ──
loadGodModeEnv();
const LLM_MODEL = "claude-sonnet-4-6";
const _anthropicCall = await createAnthropicCaller(LLM_MODEL);
if (!_anthropicCall) {
  console.error("[ally-experience] No Anthropic API key found. Cannot run LLM judge.");
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

// ── User Personas ───────────────────────────────────────────────────

const PERSONAS = [
  {
    name: "Caleb (founder)",
    goals: ["Ship GodMode v2.0", "Grow Patient Autopilot to $50k MRR", "Maintain health routine"],
    style: "Direct, fast, hates menus and options. Wants recommendations and execution.",
    morning: "Good morning, what should I focus on today?",
    midday: "I'm behind on the Q2 launch. What can I delegate?",
    stress: "Everything is piling up and I don't know what to prioritize",
    evening: "How did today go? What did I actually accomplish?",
    deep_work: "I need to write the investor update but I keep getting distracted",
  },
  {
    name: "Maya (creative director)",
    goals: ["Launch brand refresh by March", "Hire 2 designers", "Start personal blog"],
    style: "Visual thinker, prefers structured briefs, values aesthetic polish.",
    morning: "What's on my plate today?",
    midday: "I need to give feedback on the homepage mockups before 3pm",
    stress: "The client changed the brief again and I'm losing motivation",
    evening: "Can you help me plan tomorrow so I don't feel so scattered?",
    deep_work: "Help me outline the brand guidelines document",
  },
  {
    name: "Marcus (engineer)",
    goals: ["Ship queue processor refactor", "Learn Rust", "Run a half marathon"],
    style: "Precise, wants technical depth, hates vague instructions.",
    morning: "What PRs need review? Any blockers?",
    midday: "The auth token refresh is failing in production. Help me debug.",
    stress: "I've been in meetings all day and haven't written a single line of code",
    evening: "What should I read tonight to level up on distributed systems?",
    deep_work: "I need to architect the new event system. Walk me through the trade-offs.",
  },
  {
    name: "Sarah (therapist/coach)",
    goals: ["Grow practice to 30 clients", "Write self-help book", "Better work-life balance"],
    style: "Empathetic, values emotional intelligence, wants the ally to understand context.",
    morning: "Who am I seeing today? Anything I should prep for?",
    midday: "I just had a really intense session. I need to process before the next one.",
    stress: "I'm giving so much to my clients I have nothing left for the book",
    evening: "Help me set boundaries for tomorrow. No more than 5 sessions.",
    deep_work: "Let's outline chapter 3 of the book. It's about setting boundaries.",
  },
  {
    name: "Alex (student/aspiring founder)",
    goals: ["Graduate with honors", "Validate startup idea", "Build network"],
    style: "Curious, exploratory, needs structure. Tends to overthink.",
    morning: "What's due this week? Am I behind on anything?",
    midday: "I just had a great idea for the startup. Can you help me think it through?",
    stress: "I'm overwhelmed with coursework and the startup feels impossible",
    evening: "Did I make progress on my actual goals today or just busywork?",
    deep_work: "Research the competitive landscape for my startup idea",
  },
];

const INTERACTION_TYPES = ["morning", "midday", "stress", "evening", "deep_work"];
const TOTAL_INTERACTIONS = PERSONAS.length * INTERACTION_TYPES.length; // 25

// ── Score Weights ───────────────────────────────────────────────────

const WEIGHTS = { leverage: 0.3, flow: 0.25, awakening: 0.25, purpose: 0.2 };

// ── Mutations ───────────────────────────────────────────────────────

const MUTATIONS = [
  // Leverage
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"When the user mentions a project, proactively surface related tasks, people, and deadlines.",`,
    desc: "Add: proactively surface project context",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Always think 3 steps ahead. Don't just answer — anticipate what the user will need next.",`,
    desc: "Add: think 3 steps ahead",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"Before responding, ask yourself: 'What would a world-class chief of staff do here?'",`,
    desc: "Add: chief of staff mental model",
  },

  // Flow
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"NEVER break flow. If you need info, search silently. If you need to clarify, make your best guess and note the assumption.",`,
    desc: "Add: never break flow",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Match the user's energy. Brief messages get brief replies. Deep work gets deep engagement.",`,
    desc: "Add: match user energy",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"Default to action. Do the thing first, explain second.",`,
    desc: "Add: default to action",
  },

  // Awakening
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Surface patterns the user can't see. If they're avoiding something, gently name it.",`,
    desc: "Add: surface patterns and avoidance",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Connect daily actions to long-term goals. Help the user see how today's work builds toward their vision.",`,
    desc: "Add: connect daily actions to goals",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"At the end of each day, offer a reflection: what moved the needle, what was busywork, what's being avoided.",`,
    desc: "Add: daily reflection offer",
  },

  // Purpose
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"You are not just a productivity tool. You are an ally in the user's life purpose. Every interaction should move them toward what matters most.",`,
    desc: "Add: ally in life purpose",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"When the user is stressed, zoom out to purpose. Why are they doing this? What's the bigger picture?",`,
    desc: "Add: zoom out under stress",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"Periodically remind the user of their stated goals. Ask: 'Is this aligned with what matters most to you?'",`,
    desc: "Add: periodic goal alignment check",
  },

  // Anti-patterns
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Never be sycophantic. Challenge the user when they're off-track. A real ally tells hard truths.",`,
    desc: "Add: no sycophancy, hard truths",
  },
  {
    target: "SOUL_ESSENCE",
    action: "add",
    line: `"Don't over-optimize for productivity. Rest, reflection, and relationships matter.",`,
    desc: "Add: rest and reflection matter",
  },
  {
    target: "CAPABILITY_MAP",
    action: "add",
    line: `"If the user hasn't mentioned their health goals in a while, gently check in.",`,
    desc: "Add: health goal check-in",
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

  const parseLines = (block) =>
    block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith('"'))
      .map((l) => {
        let s = l.replace(/,\s*$/, "");
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
    const lines = block.split("\n");
    let insertIdx = lines.length - 1;
    while (insertIdx >= 0 && !lines[insertIdx].trim().startsWith('"')) insertIdx--;
    if (insertIdx < 0) insertIdx = lines.length - 1;

    // Check if already exists
    const newLineClean = mutation.line.replace(/,\s*$/, "").trim();
    const alreadyExists = lines.some((l) => {
      const clean = l.trim().replace(/,\s*$/, "").trim();
      return clean === newLineClean;
    });
    if (alreadyExists) return null;

    const refLine = lines.find((l) => l.trim().startsWith('"'));
    const indent = refLine ? refLine.match(/^(\s*)/)[1] : "  ";

    lines.splice(insertIdx + 1, 0, `${indent}${mutation.line}`);
    const newBlock = lines.join("\n");
    return source.slice(0, blockStart) + newBlock + source.slice(blockEnd);
  }

  if (mutation.action === "replace") {
    if (!block.includes(mutation.old)) return null;
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

async function callJudge(promptText, persona, interactionType) {
  const message = persona[interactionType];

  const systemMsg = `You are evaluating a personal AI ally system called GodMode. You're scoring how well its configuration would serve a real user.

The user is ${persona.name}: ${persona.style}
Their goals: ${persona.goals.join(", ")}

Score 1-10 on each dimension:
1. LEVERAGE: Does the ally create massive leverage? (10x thinking, delegation, anticipation, connecting dots)
2. FLOW: Does the ally maintain flow state? (no friction, no unnecessary questions, instant action)
3. AWAKENING: Does the ally surface insights? (patterns, blind spots, goal alignment, growth)
4. PURPOSE: Does the ally align with life purpose? (not just tasks — meaningful progress, values, fulfillment)

Return JSON only: {"leverage": N, "flow": N, "awakening": N, "purpose": N}`;

  const userMsg = `GodMode system prompts:
---
${promptText}
---

The user says: "${message}"
How well would an AI configured with these prompts handle this moment?`;

  const content = await _anthropicCall(systemMsg, userMsg, 200);
  if (!content) return { leverage: 5, flow: 5, awakening: 5, purpose: 5 };

  try {
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error(`No JSON in response: ${content}`);
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error(`  Judge parse error: ${err.message}`);
    return { leverage: 5, flow: 5, awakening: 5, purpose: 5 };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Compute weighted score from the 4 dimensions.
 */
function combinedScore(scores) {
  return (
    scores.leverage * WEIGHTS.leverage +
    scores.flow * WEIGHTS.flow +
    scores.awakening * WEIGHTS.awakening +
    scores.purpose * WEIGHTS.purpose
  );
}

/**
 * Score a prompt across all 25 interactions (5 personas x 5 types).
 * Returns { combined, leverage, flow, awakening, purpose } averages.
 */
async function scorePrompt(promptText) {
  const totals = { leverage: 0, flow: 0, awakening: 0, purpose: 0 };

  // Run in batches of 3 to stay under rate limits
  const allInteractions = [];
  for (const persona of PERSONAS) {
    for (const type of INTERACTION_TYPES) {
      allInteractions.push({ persona, type });
    }
  }

  const batchSize = 3;
  for (let i = 0; i < allInteractions.length; i += batchSize) {
    const batch = allInteractions.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async ({ persona, type }) => {
        const scores = await callJudge(promptText, persona, type);
        return scores;
      })
    );

    for (const scores of results) {
      totals.leverage += scores.leverage;
      totals.flow += scores.flow;
      totals.awakening += scores.awakening;
      totals.purpose += scores.purpose;
    }

    // Delay between batches
    if (i + batchSize < allInteractions.length) await sleep(500);
  }

  const avg = {
    leverage: totals.leverage / TOTAL_INTERACTIONS,
    flow: totals.flow / TOTAL_INTERACTIONS,
    awakening: totals.awakening / TOTAL_INTERACTIONS,
    purpose: totals.purpose / TOTAL_INTERACTIONS,
  };
  avg.combined = combinedScore(avg);

  return avg;
}

// ── Logging ─────────────────────────────────────────────────────────

function initLog() {
  if (!existsSync(LOG_PATH)) {
    writeFileSync(
      LOG_PATH,
      "iteration\tcombined_before\tcombined_after\tleverage\tflow\tawakening\tpurpose\tmutation\tstatus\n",
      "utf-8",
    );
  }
}

function logResult(iteration, scoreBefore, scoreAfter, mutation, status) {
  const line = [
    iteration,
    scoreBefore.combined.toFixed(3),
    scoreAfter.combined.toFixed(3),
    scoreAfter.leverage.toFixed(2),
    scoreAfter.flow.toFixed(2),
    scoreAfter.awakening.toFixed(2),
    scoreAfter.purpose.toFixed(2),
    mutation,
    status,
  ].join("\t") + "\n";
  appendFileSync(LOG_PATH, line, "utf-8");
}

// ── Main Loop ───────────────────────────────────────────────────────

async function main() {
  console.log("=== Ally Experience Autoresearch Campaign ===");
  console.log(`Source: ${CONTEXT_BUDGET_PATH}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Personas: ${PERSONAS.length}, Interaction types: ${INTERACTION_TYPES.length}`);
  console.log(`Total interactions per scoring round: ${TOTAL_INTERACTIONS}`);
  console.log(`Mutations pool: ${MUTATIONS.length}`);
  console.log(`Score weights: leverage=${WEIGHTS.leverage} flow=${WEIGHTS.flow} awakening=${WEIGHTS.awakening} purpose=${WEIGHTS.purpose}`);
  console.log();

  initLog();

  // Backup original
  const originalSource = readSource();
  writeFileSync(CONTEXT_BUDGET_PATH + ".ally-exp.bak", originalSource, "utf-8");
  console.log("Backed up original to context-budget.ts.ally-exp.bak");

  // Baseline score
  console.log("\nScoring baseline (25 interactions)...");
  const baselineText = getPromptText(readSource());
  let bestScores = await scorePrompt(baselineText);
  console.log(`Baseline combined: ${bestScores.combined.toFixed(3)}/10`);
  console.log(`  leverage=${bestScores.leverage.toFixed(2)} flow=${bestScores.flow.toFixed(2)} awakening=${bestScores.awakening.toFixed(2)} purpose=${bestScores.purpose.toFixed(2)}`);
  console.log();

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
      logResult(i, bestScores, bestScores, mutation.desc, "skipped");
      continue;
    }

    // Write mutated source
    writeSource(mutated);

    // Score
    const mutatedText = getPromptText(mutated);
    const newScores = await scorePrompt(mutatedText);

    console.log(`  Combined: ${bestScores.combined.toFixed(3)} -> ${newScores.combined.toFixed(3)}`);
    console.log(`    leverage=${newScores.leverage.toFixed(2)} flow=${newScores.flow.toFixed(2)} awakening=${newScores.awakening.toFixed(2)} purpose=${newScores.purpose.toFixed(2)}`);

    if (newScores.combined >= bestScores.combined) {
      console.log("  KEEP");
      logResult(i, bestScores, newScores, mutation.desc, "keep");
      bestScores = newScores;
      currentSource = mutated;
      appliedMutations.add(mutIdx);
    } else {
      console.log("  DISCARD");
      logResult(i, bestScores, newScores, mutation.desc, "discard");
      writeSource(currentSource);
    }

    console.log();
  }

  console.log("=== Campaign Complete ===");
  console.log(`Final combined score: ${bestScores.combined.toFixed(3)}/10`);
  console.log(`  leverage=${bestScores.leverage.toFixed(2)} flow=${bestScores.flow.toFixed(2)} awakening=${bestScores.awakening.toFixed(2)} purpose=${bestScores.purpose.toFixed(2)}`);
  console.log(`Log: ${LOG_PATH}`);
  console.log(`Backup: ${CONTEXT_BUDGET_PATH}.ally-exp.bak`);

  const finalSource = readSource();
  if (finalSource !== originalSource) {
    console.log("\nPrompts were modified. Review changes with:");
    console.log(`  diff ${CONTEXT_BUDGET_PATH}.ally-exp.bak ${CONTEXT_BUDGET_PATH}`);
  } else {
    console.log("\nNo mutations improved the score. Prompts unchanged.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
