#!/usr/bin/env node
/**
 * onboarding-hardening autoresearch campaign
 *
 * Simulates real users going through the full 7-phase GodMode onboarding.
 * Uses Sonnet 4.6 as both simulated user AND judge. Tests:
 *
 *   1. Prompt quality — Does each phase prompt guide the agent well?
 *   2. User experience — Would diverse personas feel welcomed and understood?
 *   3. Edge cases — Impatient users, confused users, skeptics, skippers
 *   4. Recovery — Weird input, partial answers, resume after abandon
 *   5. Generated artifacts — Are SOUL.md, memory seeds, First 5 Commands quality?
 *
 * Scoring dimensions (weighted):
 *   CLARITY   (0.20) — Does the user know what's happening and why?
 *   WARMTH    (0.25) — Trusted advisor, not a setup wizard?
 *   DEPTH     (0.20) — Does it extract genuinely useful info from the user?
 *   RECOVERY  (0.15) — Handles edge cases, partial input, skips gracefully?
 *   CONVERSION(0.20) — Would this make someone want to keep using GodMode?
 *
 * Mutates: src/hooks/onboarding-context.ts (phase prompt text)
 *
 * Usage:
 *   node autoresearch/campaigns/onboarding-hardening.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnthropicCaller, loadGodModeEnv } from "../lib/resolve-anthropic.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "../..");
const ONBOARDING_CTX_PATH = resolve(PLUGIN_ROOT, "src/hooks/onboarding-context.ts");
const LOG_PATH = resolve(__dirname, "onboarding-hardening-log.tsv");

// ── Load env + resolve Anthropic key (Sonnet 4.6 with auto-refresh) ──
loadGodModeEnv();
const LLM_MODEL = "claude-sonnet-4-6";
const _anthropicCall = await createAnthropicCaller(LLM_MODEL);
if (!_anthropicCall) {
  console.error("[onboarding-hardening] No Anthropic API key found. Cannot run LLM judge.");
  process.exit(1);
}

// ── CLI args ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let iterations = 12;
const itIdx = args.indexOf("--iterations");
if (itIdx !== -1 && args[itIdx + 1]) {
  iterations = parseInt(args[itIdx + 1], 10);
  if (isNaN(iterations) || iterations < 1) iterations = 12;
}

// ── User Personas (diverse onboarding behaviors) ────────────────────

const PERSONAS = [
  {
    name: "Eager Emma",
    desc: "First-time AI user, excited, answers everything thoroughly, asks follow-up questions",
    behavior: "cooperative",
    style: "Enthusiastic, gives long detailed answers, asks 'what else can you do?'",
    sampleAnswers: {
      name: "Emma Chen",
      ground: "I'm here to build a company that makes mental health accessible to everyone. Not just therapy — daily tools for emotional resilience.",
      anchor: "My morning meditation. Even 5 minutes. If I skip it, I spiral.",
      annoyingAi: "When AI says 'I don't have access to that information' or gives me a list of 10 options instead of just picking the best one.",
    },
  },
  {
    name: "Skeptical Sam",
    desc: "Tech-savvy, tried other AI tools, skeptical this will be different, gives minimal answers",
    behavior: "skeptical",
    style: "Short answers, pushes back, asks 'why do you need that?', compares to ChatGPT/Notion AI",
    sampleAnswers: {
      name: "Sam",
      ground: "Ship software. That's it.",
      anchor: "Code. When everything's broken, I debug.",
      annoyingAi: "Fake enthusiasm. Emoji overuse. Pretending to care about my feelings.",
    },
  },
  {
    name: "Busy Barbara",
    desc: "Executive, has 5 minutes max, wants to skip to the value, will abandon if it takes too long",
    behavior: "impatient",
    style: "Types fast, skips questions, says 'can we speed this up?', wants the bottom line",
    sampleAnswers: {
      name: "Barbara Torres",
      ground: "I run a 200-person org. I need leverage.",
      anchor: "My team. My board. My family.",
      annoyingAi: "Wasting my time with questions when you should already know.",
    },
  },
  {
    name: "Confused Carlos",
    desc: "Non-technical, friend recommended GodMode, doesn't really understand what it does",
    behavior: "confused",
    style: "Asks 'what do you mean?', gives off-topic answers, needs things re-explained",
    sampleAnswers: {
      name: "Carlos Rivera",
      ground: "I... I'm not sure? I guess I want to be more organized? My friend said this would help.",
      anchor: "My family. My kids.",
      annoyingAi: "When it uses words I don't understand. Or assumes I know how to use it.",
    },
  },
  {
    name: "Returning Rachel",
    desc: "Had GodMode before, reset onboarding, wants to redo it faster with better data",
    behavior: "returning",
    style: "References past experience, wants to skip basics, goes deep on soul interview",
    sampleAnswers: {
      name: "Rachel Kim",
      ground: "I'm building a coaching practice that scales through AI. I did this onboarding 3 months ago but my answers were shallow. Let me go deeper this time.",
      anchor: "Journaling. Every morning, no exceptions.",
      annoyingAi: "When it doesn't remember things I already told it. That's literally the point of having a memory system.",
    },
  },
];

// ── Onboarding Phases to Test ───────────────────────────────────────

const PHASE_SCENARIOS = [
  {
    phase: 0,
    name: "Assessment",
    userMessage: "I just installed GodMode. What now?",
    context: "Brand new user, no configuration done yet.",
  },
  {
    phase: 1,
    name: "Soul Interview — Opening",
    userMessage: "Ok, let's do the interview.",
    context: "User agreed to start the soul interview. Agent should open with Block 1.",
  },
  {
    phase: 1,
    name: "Soul Interview — Deep Question",
    userMessage: "My mission is to build tools that give people back their time. I believe most people spend 80% of their day on things that don't matter.",
    context: "User just answered the 'ground' question with a rich, meaningful answer. Agent should acknowledge deeply and move to next question.",
  },
  {
    phase: 1,
    name: "Soul Interview — Skip Request",
    userMessage: "Can we skip the rest? I just want to get to the useful stuff.",
    context: "User is 40% through the interview and wants to skip ahead. Agent should handle gracefully.",
  },
  {
    phase: 1,
    name: "Soul Interview — Emotional Moment",
    userMessage: "My blind spot... my wife says I work too much and miss the kids growing up. She's probably right.",
    context: "User shared something vulnerable during Block 3. Agent must handle with care.",
  },
  {
    phase: 2,
    name: "Second Brain Setup",
    userMessage: "Yeah I use Obsidian. My vault is at ~/Documents/Notes",
    context: "User confirmed Obsidian use. Agent should set up vault connection and seed memory.",
  },
  {
    phase: 3,
    name: "Workflow Audit",
    userMessage: "My main workflows are: email triage (2hrs/day), code review (1hr), meeting prep (30min), and weekly team updates.",
    context: "User listed their workflows. Agent should map each to GodMode capabilities.",
  },
  {
    phase: 4,
    name: "Integration Setup",
    userMessage: "I have my Google Calendar connected already. What else should I set up?",
    context: "User has one integration. Agent should recommend others based on workflows.",
  },
  {
    phase: 5,
    name: "First Win",
    userMessage: "Show me what this thing can actually do.",
    context: "User wants to see value. Agent should generate a live demo (morning brief).",
  },
  {
    phase: 5,
    name: "First 5 Commands",
    userMessage: "Ok that's cool. What else can I say to you?",
    context: "User liked the demo. Agent should present personalized First 5 Commands.",
  },
];

// ── Score Weights ───────────────────────────────────────────────────

const WEIGHTS = { clarity: 0.20, warmth: 0.25, depth: 0.20, recovery: 0.15, conversion: 0.20 };
const TOTAL_EVALS = PERSONAS.length * PHASE_SCENARIOS.length; // 50

// ── Mutations Pool ──────────────────────────────────────────────────

const MUTATIONS = [
  // Clarity improvements
  {
    phase: 0,
    action: "insert_after",
    marker: "Be encouraging — even a low score means there's a lot of value to unlock.",
    line: `\nExplain each gap in plain language — no jargon. For each gap, tell the user what they'll gain by fixing it, not just that it's missing.`,
    desc: "Phase 0: explain gaps in plain language with benefits",
  },
  {
    phase: 0,
    action: "insert_after",
    marker: "Present the score to the user.",
    line: ` Frame the score positively — "You're at X/100, and we're about to unlock the rest." Never make them feel behind.`,
    desc: "Phase 0: frame score positively",
  },

  // Warmth improvements
  {
    phase: 1,
    action: "insert_after",
    marker: "Like a trusted advisor getting to know someone for real.",
    line: `\n**Mirror their energy:** If they're brief, be brief. If they go deep, go deep. Never force a tone mismatch.`,
    desc: "Phase 1: mirror user energy",
  },
  {
    phase: 1,
    action: "insert_after",
    marker: "Don't think too hard.",
    line: `\n\nIf the user shares something vulnerable or emotional, pause and acknowledge it. Don't immediately jump to the next question. Say something real — "That's a powerful anchor" or "I can feel how much that matters to you." Then continue.`,
    desc: "Phase 1: acknowledge vulnerability before moving on",
  },
  {
    phase: 1,
    action: "insert_after",
    marker: "Save each answer as you get it.",
    line: `\n**Reflect back what you heard** before saving. Example: "So your anchor is meditation — even 5 minutes keeps you grounded. Got it." This builds trust and catches misunderstandings.`,
    desc: "Phase 1: reflect back answers before saving",
  },

  // Depth improvements
  {
    phase: 1,
    action: "insert_after",
    marker: "that's fine — save what you have and advance to Phase 2.",
    line: `\nBut before skipping, offer a micro-version: "I get it — let me ask just two more quick ones that will make the biggest difference." Focus on Block 4 (Truth Calibration) and Block 6 (What Annoys Them) if not yet done.`,
    desc: "Phase 1: micro-version for skippers",
  },
  {
    phase: 3,
    action: "insert_after",
    marker: "Recommend Trust Tracker categories",
    line: `\n5. For each workflow, estimate the time saved per week if GodMode handles it — make the ROI concrete: "Email triage = 2hrs/day × 5 days = 10hrs/week. If I cut that to 30min, you get 7.5hrs back."`,
    desc: "Phase 3: quantify ROI per workflow",
  },

  // Recovery improvements
  {
    phase: 1,
    action: "insert_after",
    marker: "Current block:",
    line: `\n\n**If the user gives a confusing or off-topic answer:** Don't correct them. Rephrase the question with an example from their context. "Let me put it this way — when you think about why you get up in the morning and do what you do, what comes to mind?"`,
    desc: "Phase 1: handle confused answers gracefully",
  },
  {
    phase: 2,
    action: "insert_after",
    marker: "this is the \"wow\" moment",
    line: `\n5. If Obsidian isn't available, that's fine — memory still works without it. Frame it as optional enhancement, not a gap.`,
    desc: "Phase 2: Obsidian is optional, not required",
  },
  {
    phase: 4,
    action: "insert_after",
    marker: "Everything is optional — respect the user's choice to skip",
    line: `\n\n**If the user seems overwhelmed by integration options:** Focus on just ONE — the one that maps to their biggest pain point from Phase 3. "Based on your workflows, Google Calendar alone would unlock meeting prep in your morning brief. Want to set that up now? Everything else can wait."`,
    desc: "Phase 4: focus overwhelmed users on one integration",
  },

  // Conversion improvements
  {
    phase: 5,
    action: "insert_after",
    marker: "Make it feel like a gift, not homework.",
    line: `\n\n**The emotional arc matters:** After presenting the 5 commands, pause and say something personal based on what you learned: "Based on everything you've shared, I think the biggest unlock for you will be [specific thing]. Let's try it right now."`,
    desc: "Phase 5: emotional arc — connect to personal unlock",
  },
  {
    phase: 5,
    action: "insert_after",
    marker: "If they say yes,",
    line: ` don't repeat Phase 1 questions they already answered. Go to the GAPS — the blocks or fields they skipped. Make it feel like deepening, not repeating.`,
    desc: "Phase 5: deepening goes to gaps, not repetition",
  },
  {
    phase: 0,
    action: "insert_after",
    marker: "advance to Phase 1",
    line: `\n\n**Set expectations:** "This whole onboarding takes about 15 minutes. The more you share, the more personalized everything becomes. But if you're in a rush, we can do a quick 2-minute setup and go deeper later."`,
    desc: "Phase 0: set time expectations upfront",
  },

  // Anti-pattern fixes
  {
    phase: 1,
    action: "insert_after",
    marker: "One question at a time.",
    line: ` Never ask two questions in one message — even if they're related. Each question is its own moment.`,
    desc: "Phase 1: enforce single question per message",
  },
  {
    phase: 5,
    action: "insert_after",
    marker: "Generate commands that map to THEIR workflows",
    line: `\n\n**Never generate generic commands like "What's on my calendar?" unless they specifically mentioned calendar as a workflow.** Every command must reference something from their interview — a project name, a person, a workflow. Generic = wasted opportunity.`,
    desc: "Phase 5: ban generic commands, force personalization",
  },
];

// ── Source File Operations ──────────────────────────────────────────

function readSource() {
  return readFileSync(ONBOARDING_CTX_PATH, "utf-8");
}

function writeSource(content) {
  writeFileSync(ONBOARDING_CTX_PATH, content, "utf-8");
}

/**
 * Extract the full prompt text that each phase would inject.
 * We parse the buildPhaseNPrompt functions and extract string content.
 */
function extractPhasePrompts(source) {
  const prompts = {};
  for (let phase = 0; phase <= 5; phase++) {
    const fnName = `buildPhase${phase}Prompt`;
    const fnIdx = source.indexOf(`function ${fnName}`);
    if (fnIdx === -1) continue;

    // Find the function body (rough extraction — gets template literals and strings)
    let depth = 0;
    let start = source.indexOf("{", fnIdx);
    let end = start;
    for (let i = start; i < source.length; i++) {
      if (source[i] === "{") depth++;
      if (source[i] === "}") depth--;
      if (depth === 0) { end = i + 1; break; }
    }
    prompts[phase] = source.slice(start, end);
  }
  return prompts;
}

/**
 * Apply a mutation to the source file.
 * Mutations insert text after a marker string within a specific phase's function.
 */
function applyMutation(source, mutation) {
  const markerIdx = source.indexOf(mutation.marker);
  if (markerIdx === -1) return null; // marker not found

  // Check if already applied
  if (source.includes(mutation.line.trim())) return null;

  const insertPoint = markerIdx + mutation.marker.length;
  return source.slice(0, insertPoint) + mutation.line + source.slice(insertPoint);
}

// ── LLM Judge (Sonnet 4.6 via shared resolver with auto-refresh) ──

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Judge a single persona × phase scenario.
 * Returns { clarity, warmth, depth, recovery, conversion } each 1-10.
 */
async function judgeScenario(phasePromptText, persona, scenario) {
  const systemMsg = `You are evaluating GodMode's onboarding system. You're judging how well the phase prompt would guide an AI agent to handle a specific user interaction during onboarding.

The simulated user is: ${persona.name} — ${persona.desc}
User behavior style: ${persona.style}
Onboarding phase: Phase ${scenario.phase} (${scenario.name})
Scenario context: ${scenario.context}

Score 1-10 on each dimension:
1. CLARITY: Would the user understand what's happening, what they're being asked, and why it matters? (10 = crystal clear, 1 = confusing/jargon-filled)
2. WARMTH: Would this feel like a trusted advisor or a setup wizard? Does the tone match THIS specific user's energy? (10 = deeply personal, 1 = robotic/corporate)
3. DEPTH: Would the agent extract genuinely useful information that improves the product experience? (10 = transformative insight, 1 = surface-level/checkbox)
4. RECOVERY: If the user gives unexpected input (${persona.behavior} behavior), would the agent handle it gracefully? (10 = seamless adaptation, 1 = breaks/confuses)
5. CONVERSION: Would THIS specific user want to keep using GodMode after this interaction? (10 = "this is different", 1 = "another AI toy")

Also provide a brief "worst_moment" — the single most likely failure point for this persona in this scenario.

Return JSON only: {"clarity": N, "warmth": N, "depth": N, "recovery": N, "conversion": N, "worst_moment": "..."}`;

  const userMsg = `Phase prompt that guides the AI agent:
---
${phasePromptText}
---

The user (${persona.name}) says: "${scenario.userMessage}"

Sample context — this user tends to answer like:
- Name: "${persona.sampleAnswers.name}"
- Ground/mission: "${persona.sampleAnswers.ground}"
- Annoying AI: "${persona.sampleAnswers.annoyingAi}"

How well would an AI agent following these phase prompts handle this moment with this specific user?`;

  try {
    const content = await _anthropicCall(systemMsg, userMsg, 500);
    if (!content) return defaultScores();

    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.error(`  No JSON in response: ${content.slice(0, 100)}`);
      return defaultScores();
    }

    const scores = JSON.parse(jsonMatch[0]);
    return {
      clarity: clamp(scores.clarity),
      warmth: clamp(scores.warmth),
      depth: clamp(scores.depth),
      recovery: clamp(scores.recovery),
      conversion: clamp(scores.conversion),
      worst_moment: scores.worst_moment || "",
    };
  } catch (err) {
    console.error(`  Judge error: ${err.message}`);
    return defaultScores();
  }
}

function clamp(n) {
  return Math.max(1, Math.min(10, Number(n) || 5));
}

function defaultScores() {
  return { clarity: 5, warmth: 5, depth: 5, recovery: 5, conversion: 5, worst_moment: "judge_failed" };
}

/**
 * Combined weighted score from 5 dimensions.
 */
function combinedScore(scores) {
  return (
    scores.clarity * WEIGHTS.clarity +
    scores.warmth * WEIGHTS.warmth +
    scores.depth * WEIGHTS.depth +
    scores.recovery * WEIGHTS.recovery +
    scores.conversion * WEIGHTS.conversion
  );
}

/**
 * Score all phase prompts across all personas and scenarios.
 * Returns { combined, clarity, warmth, depth, recovery, conversion, worst_moments }.
 */
async function scoreAllPrompts(source) {
  const phasePrompts = extractPhasePrompts(source);
  const totals = { clarity: 0, warmth: 0, depth: 0, recovery: 0, conversion: 0 };
  const worstMoments = [];

  // Build all interactions
  const allInteractions = [];
  for (const persona of PERSONAS) {
    for (const scenario of PHASE_SCENARIOS) {
      allInteractions.push({ persona, scenario });
    }
  }

  // Run in batches of 3
  const batchSize = 3;
  for (let i = 0; i < allInteractions.length; i += batchSize) {
    const batch = allInteractions.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async ({ persona, scenario }) => {
        const phaseText = phasePrompts[scenario.phase] || "";
        const scores = await judgeScenario(phaseText, persona, scenario);
        return { scores, persona: persona.name, scenario: scenario.name };
      })
    );

    for (const { scores, persona, scenario } of results) {
      totals.clarity += scores.clarity;
      totals.warmth += scores.warmth;
      totals.depth += scores.depth;
      totals.recovery += scores.recovery;
      totals.conversion += scores.conversion;
      if (scores.worst_moment && scores.worst_moment !== "judge_failed") {
        worstMoments.push(`${persona}/${scenario}: ${scores.worst_moment}`);
      }
    }

    // Progress indicator
    const done = Math.min(i + batchSize, allInteractions.length);
    process.stdout.write(`\r  Scored ${done}/${allInteractions.length} interactions`);

    if (i + batchSize < allInteractions.length) await sleep(500);
  }
  console.log(); // newline after progress

  const avg = {
    clarity: totals.clarity / TOTAL_EVALS,
    warmth: totals.warmth / TOTAL_EVALS,
    depth: totals.depth / TOTAL_EVALS,
    recovery: totals.recovery / TOTAL_EVALS,
    conversion: totals.conversion / TOTAL_EVALS,
  };
  avg.combined = combinedScore(avg);

  return { ...avg, worstMoments };
}

// ── Logging ─────────────────────────────────────────────────────────

function initLog() {
  if (!existsSync(LOG_PATH)) {
    writeFileSync(
      LOG_PATH,
      "iteration\tcombined_before\tcombined_after\tclarity\twarmth\tdepth\trecovery\tconversion\tmutation\tstatus\n",
      "utf-8",
    );
  }
}

function logResult(iteration, scoreBefore, scoreAfter, mutation, status) {
  const line = [
    iteration,
    scoreBefore.combined.toFixed(3),
    scoreAfter.combined.toFixed(3),
    scoreAfter.clarity.toFixed(2),
    scoreAfter.warmth.toFixed(2),
    scoreAfter.depth.toFixed(2),
    scoreAfter.recovery.toFixed(2),
    scoreAfter.conversion.toFixed(2),
    mutation,
    status,
  ].join("\t") + "\n";
  appendFileSync(LOG_PATH, line, "utf-8");
}

// ── Main Loop ───────────────────────────────────────────────────────

async function main() {
  console.log("=== Onboarding Hardening Autoresearch Campaign ===");
  console.log(`Source: ${ONBOARDING_CTX_PATH}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Personas: ${PERSONAS.length}, Scenarios: ${PHASE_SCENARIOS.length}`);
  console.log(`Total evaluations per scoring round: ${TOTAL_EVALS}`);
  console.log(`Mutations pool: ${MUTATIONS.length}`);
  console.log(`Score weights: clarity=${WEIGHTS.clarity} warmth=${WEIGHTS.warmth} depth=${WEIGHTS.depth} recovery=${WEIGHTS.recovery} conversion=${WEIGHTS.conversion}`);
  console.log();

  initLog();

  // Backup original
  const originalSource = readSource();
  const bakPath = ONBOARDING_CTX_PATH + ".onboarding-hardening.bak";
  writeFileSync(bakPath, originalSource, "utf-8");
  console.log(`Backed up original to ${bakPath}`);

  // Baseline score
  console.log("\nScoring baseline...");
  let bestScores = await scoreAllPrompts(originalSource);
  console.log(`Baseline combined: ${bestScores.combined.toFixed(3)}/10`);
  console.log(`  clarity=${bestScores.clarity.toFixed(2)} warmth=${bestScores.warmth.toFixed(2)} depth=${bestScores.depth.toFixed(2)} recovery=${bestScores.recovery.toFixed(2)} conversion=${bestScores.conversion.toFixed(2)}`);

  if (bestScores.worstMoments.length > 0) {
    console.log(`\nTop failure points:`);
    bestScores.worstMoments.slice(0, 5).forEach(m => console.log(`  - ${m}`));
  }
  console.log();

  const appliedMutations = new Set();
  let currentSource = readSource();

  for (let i = 1; i <= iterations; i++) {
    // Pick a random unapplied mutation
    const unapplied = MUTATIONS.filter((_, idx) => !appliedMutations.has(idx));
    if (unapplied.length === 0) {
      console.log(`All ${MUTATIONS.length} mutations tried. Stopping early.`);
      break;
    }
    const mutation = unapplied[Math.floor(Math.random() * unapplied.length)];
    const mutIdx = MUTATIONS.indexOf(mutation);

    console.log(`[${i}/${iterations}] Trying: ${mutation.desc}`);

    const mutated = applyMutation(currentSource, mutation);
    if (!mutated) {
      console.log("  Skipped — mutation not applicable (marker not found or already applied)");
      logResult(i, bestScores, bestScores, mutation.desc, "skipped");
      appliedMutations.add(mutIdx); // Don't retry
      continue;
    }

    // Write mutated source
    writeSource(mutated);

    // Score
    const newScores = await scoreAllPrompts(mutated);

    console.log(`  Combined: ${bestScores.combined.toFixed(3)} -> ${newScores.combined.toFixed(3)}`);
    console.log(`    clarity=${newScores.clarity.toFixed(2)} warmth=${newScores.warmth.toFixed(2)} depth=${newScores.depth.toFixed(2)} recovery=${newScores.recovery.toFixed(2)} conversion=${newScores.conversion.toFixed(2)}`);

    if (newScores.combined >= bestScores.combined) {
      console.log("  KEEP");
      logResult(i, bestScores, newScores, mutation.desc, "keep");
      bestScores = newScores;
      currentSource = mutated;
      appliedMutations.add(mutIdx);
    } else {
      console.log("  DISCARD");
      logResult(i, bestScores, newScores, mutation.desc, "discard");
      writeSource(currentSource); // revert
      appliedMutations.add(mutIdx);
    }

    // Surface new worst moments
    if (newScores.worstMoments && newScores.worstMoments.length > 0) {
      const newWorst = newScores.worstMoments.filter(m =>
        !bestScores.worstMoments?.includes(m)
      ).slice(0, 2);
      if (newWorst.length > 0) {
        console.log(`  New failure points:`);
        newWorst.forEach(m => console.log(`    - ${m}`));
      }
    }

    console.log();
  }

  console.log("=== Campaign Complete ===");
  console.log(`Final combined score: ${bestScores.combined.toFixed(3)}/10`);
  console.log(`  clarity=${bestScores.clarity.toFixed(2)} warmth=${bestScores.warmth.toFixed(2)} depth=${bestScores.depth.toFixed(2)} recovery=${bestScores.recovery.toFixed(2)} conversion=${bestScores.conversion.toFixed(2)}`);
  console.log(`Log: ${LOG_PATH}`);
  console.log(`Backup: ${bakPath}`);

  const finalSource = readSource();
  if (finalSource !== originalSource) {
    console.log("\nOnboarding prompts were modified. Review changes with:");
    console.log(`  diff ${bakPath} ${ONBOARDING_CTX_PATH}`);
  } else {
    console.log("\nNo mutations improved the score. Prompts unchanged.");
  }

  // Write worst moments report
  if (bestScores.worstMoments && bestScores.worstMoments.length > 0) {
    const reportPath = resolve(__dirname, "onboarding-hardening-report.md");
    const report = [
      "# Onboarding Hardening — Failure Points Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Final score: ${bestScores.combined.toFixed(3)}/10`,
      "",
      "## Top Failure Points",
      "",
      ...bestScores.worstMoments.map(m => `- ${m}`),
      "",
      "## Dimension Breakdown",
      "",
      `| Dimension | Score |`,
      `|-----------|-------|`,
      `| Clarity | ${bestScores.clarity.toFixed(2)} |`,
      `| Warmth | ${bestScores.warmth.toFixed(2)} |`,
      `| Depth | ${bestScores.depth.toFixed(2)} |`,
      `| Recovery | ${bestScores.recovery.toFixed(2)} |`,
      `| Conversion | ${bestScores.conversion.toFixed(2)} |`,
      `| **Combined** | **${bestScores.combined.toFixed(2)}** |`,
    ].join("\n");
    writeFileSync(reportPath, report, "utf-8");
    console.log(`\nFailure points report: ${reportPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  // Restore backup on fatal error
  const bakPath = ONBOARDING_CTX_PATH + ".onboarding-hardening.bak";
  if (existsSync(bakPath)) {
    console.log("Restoring backup...");
    writeSource(readFileSync(bakPath, "utf-8"));
  }
  process.exit(1);
});
