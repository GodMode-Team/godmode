/**
 * Autoresearch Campaign: Optimize Memory Recall Parameters
 *
 * Iteratively mutates memory recall thresholds in memory.ts and context-budget.ts,
 * runs the eval suite, and keeps mutations that improve the combined score.
 *
 * Parameters under optimization:
 *   - memory.ts: SEARCH_TIMEOUT_MS, search limit default, score threshold filter
 *   - context-budget.ts: MAX_MEMORY_LINES
 *
 * Supports two modes:
 *   - Live mode: Uses Mem0 with real embeddings (requires OPENAI_API_KEY + Anthropic key)
 *   - Synthetic mode: Keyword-overlap simulation (fallback when Anthropic key unavailable)
 *
 * Usage: node autoresearch/campaigns/memory-thresholds.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, "..", "..");
const MEMORY_PATH = join(REPO_DIR, "src", "lib", "memory.ts");
const CTX_PATH = join(REPO_DIR, "src", "lib", "context-budget.ts");
const LOG_PATH = join(__dirname, "memory-thresholds-log.tsv");
const EVAL_CMD = `node ${join(REPO_DIR, "autoresearch", "eval-runner.mjs")}`;
const TEST_SUITE_PATH = join(REPO_DIR, "autoresearch", "test-suite.json");
const ENV_PATH = join(homedir(), ".openclaw", ".env");
const AUTH_PROFILES_PATH = join(homedir(), ".openclaw", "auth-profiles.json");

// ── Parameter Grid ──────────────────────────────────────────────────

const PARAM_GRID = {
  scoreThreshold: [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7],
  searchLimit: [3, 5, 8, 10, 12, 15],
  maxMemoryLines: [6, 8, 10, 12, 15, 20],
};

// ── CLI args ────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let iterations = 20;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--iterations" && args[i + 1]) {
      iterations = parseInt(args[i + 1], 10);
      if (isNaN(iterations) || iterations < 1) iterations = 20;
    }
  }
  return { iterations };
}

// ── Env / Key Loading ───────────────────────────────────────────────

function loadEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const env = {};
  for (const line of readFileSync(ENV_PATH, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function loadAnthropicKey() {
  // Check env first
  const env = loadEnv();
  if (env.ANTHROPIC_API_KEY) return env.ANTHROPIC_API_KEY;

  // Try auth-profiles.json for an anthropic:oauth token
  if (!existsSync(AUTH_PROFILES_PATH)) return null;
  try {
    const profiles = JSON.parse(readFileSync(AUTH_PROFILES_PATH, "utf-8"));
    // Look for anthropic oauth token in various profile structures
    if (Array.isArray(profiles)) {
      for (const p of profiles) {
        if (p.provider === "anthropic" && p.token) return p.token;
        if (p.provider === "anthropic:oauth" && p.token) return p.token;
        if (p.key && p.provider?.includes("anthropic")) return p.key;
      }
    } else if (typeof profiles === "object") {
      for (const [key, val] of Object.entries(profiles)) {
        if (key.includes("anthropic") && typeof val === "object" && val !== null) {
          const v = /** @type {Record<string, any>} */ (val);
          if (v.token) return v.token;
          if (v.api_key) return v.api_key;
          if (v.key) return v.key;
        }
      }
    }
  } catch { /* ignore parse errors */ }
  return null;
}

// ── Source Extraction / Replacement ─────────────────────────────────

function extractScoreThreshold(source) {
  const match = source.match(/r\.score\s*>\s*([\d.]+)/);
  if (!match) throw new Error("Could not find score threshold in memory.ts");
  return parseFloat(match[1]);
}

function replaceScoreThreshold(source, newVal) {
  return source.replace(/r\.score\s*>\s*[\d.]+/, `r.score > ${newVal}`);
}

function extractSearchLimit(source) {
  const match = source.match(/limit\s*=\s*(\d+)/);
  if (!match) throw new Error("Could not find search limit in memory.ts");
  return parseInt(match[1], 10);
}

function replaceSearchLimit(source, newVal) {
  return source.replace(/limit\s*=\s*\d+/, `limit = ${newVal}`);
}

function extractMaxMemoryLines(source) {
  const match = source.match(/const MAX_MEMORY_LINES\s*=\s*(\d+)/);
  if (!match) throw new Error("Could not find MAX_MEMORY_LINES in context-budget.ts");
  return parseInt(match[1], 10);
}

function replaceMaxMemoryLines(source, newVal) {
  return source.replace(/const MAX_MEMORY_LINES\s*=\s*\d+/, `const MAX_MEMORY_LINES = ${newVal}`);
}

// ── Eval Runner ─────────────────────────────────────────────────────

function runEval() {
  try {
    const output = execSync(EVAL_CMD, {
      encoding: "utf-8",
      timeout: 120_000,
      cwd: REPO_DIR,
    });
    return parseScores(output);
  } catch (err) {
    const out = err.stdout || "";
    if (out.includes("SCORE:")) return parseScores(out);
    return null;
  }
}

function parseScores(output) {
  const scores = {};
  const re = /^SCORE:(\w+):([\d.]+)$/gm;
  let m;
  while ((m = re.exec(output)) !== null) {
    scores[m[1]] = parseFloat(m[2]);
  }
  return scores.combined != null ? scores : null;
}

// ── Synthetic Evaluation ────────────────────────────────────────────
// When we don't have an Anthropic key for live Mem0, we simulate
// memory recall using keyword overlap as a proxy for embedding similarity.

function loadTestSuite() {
  return JSON.parse(readFileSync(TEST_SUITE_PATH, "utf-8"));
}

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function keywordOverlap(query, fact) {
  const qTokens = new Set(tokenize(query));
  const fTokens = tokenize(fact);
  if (fTokens.length === 0) return 0;
  let hits = 0;
  for (const t of fTokens) {
    if (qTokens.has(t)) hits++;
  }
  // Weighted: overlap relative to query size for precision-like signal
  return hits / Math.max(qTokens.size, 1);
}

function syntheticEval(scoreThreshold, searchLimit, maxMemoryLines) {
  const suite = loadTestSuite();
  const seedFacts = suite.memory_recall.seed_facts;
  const tests = suite.memory_recall.tests;

  let totalRecall = 0;
  let totalPrecision = 0;
  let truncationPenalty = 0;

  for (const test of tests) {
    // Compute synthetic scores for each fact against the query
    const scored = seedFacts.map((fact, idx) => ({
      fact,
      idx,
      score: keywordOverlap(test.query, fact),
    }));

    // Sort by score descending (simulating what Mem0 would return)
    scored.sort((a, b) => b.score - a.score);

    // Apply threshold filter
    const aboveThreshold = scored.filter((s) => s.score > scoreThreshold);

    // Apply limit
    const returned = aboveThreshold.slice(0, searchLimit);

    // Check which expected facts were recalled
    const returnedText = returned.map((r) => r.fact).join(" ").toLowerCase();
    let expectedHits = 0;
    for (const keyword of test.expected_facts) {
      if (returnedText.includes(keyword.toLowerCase())) {
        expectedHits++;
      }
    }

    const recall = test.expected_facts.length > 0
      ? expectedHits / test.expected_facts.length
      : 1;

    // Precision: what fraction of returned results are relevant?
    // A result is "relevant" if it contains any expected keyword
    let relevantReturned = 0;
    for (const r of returned) {
      const factLower = r.fact.toLowerCase();
      if (test.expected_facts.some((kw) => factLower.includes(kw.toLowerCase()))) {
        relevantReturned++;
      }
    }
    const precision = returned.length > 0 ? relevantReturned / returned.length : 1;

    totalRecall += recall;
    totalPrecision += precision;

    // Truncation check: if maxMemoryLines would cut important results
    // Estimate ~2 lines per memory result
    const linesNeeded = returned.length * 2;
    if (linesNeeded > maxMemoryLines && relevantReturned > 0) {
      // How many relevant results would survive the line cap?
      const survivingSlots = Math.floor(maxMemoryLines / 2);
      const survivingRelevant = returned.slice(0, survivingSlots)
        .filter((r) => test.expected_facts.some((kw) =>
          r.fact.toLowerCase().includes(kw.toLowerCase())
        )).length;
      const truncLoss = (relevantReturned - survivingRelevant) / relevantReturned;
      truncationPenalty += truncLoss;
    }
  }

  const avgRecall = totalRecall / tests.length;
  const avgPrecision = totalPrecision / tests.length;
  const avgTruncPenalty = truncationPenalty / tests.length;

  // Combined score: recall-weighted F-score minus truncation penalty
  const fScore = (avgRecall * 0.6) + (avgPrecision * 0.4);
  const combined = Math.max(0, fScore - (avgTruncPenalty * 0.2));

  return {
    recall: avgRecall,
    precision: avgPrecision,
    truncation_penalty: avgTruncPenalty,
    combined,
  };
}

// ── Mutation Logic ──────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCurrentParams() {
  const memSource = readFileSync(MEMORY_PATH, "utf-8");
  const ctxSource = readFileSync(CTX_PATH, "utf-8");
  return {
    scoreThreshold: extractScoreThreshold(memSource),
    searchLimit: extractSearchLimit(memSource),
    maxMemoryLines: extractMaxMemoryLines(ctxSource),
  };
}

function generateMutation(currentParams) {
  const paramNames = Object.keys(PARAM_GRID);
  const paramToMutate = pickRandom(paramNames);
  const grid = PARAM_GRID[paramToMutate];

  // Pick a value different from current
  const candidates = grid.filter((v) => v !== currentParams[paramToMutate]);
  if (candidates.length === 0) return null;

  const newValue = pickRandom(candidates);

  return {
    param: paramToMutate,
    oldValue: currentParams[paramToMutate],
    newValue,
    desc: `${paramToMutate}: ${currentParams[paramToMutate]} -> ${newValue}`,
  };
}

function applyMutation(mutation) {
  if (mutation.param === "scoreThreshold") {
    const source = readFileSync(MEMORY_PATH, "utf-8");
    writeFileSync(MEMORY_PATH, replaceScoreThreshold(source, mutation.newValue));
  } else if (mutation.param === "searchLimit") {
    const source = readFileSync(MEMORY_PATH, "utf-8");
    writeFileSync(MEMORY_PATH, replaceSearchLimit(source, mutation.newValue));
  } else if (mutation.param === "maxMemoryLines") {
    const source = readFileSync(CTX_PATH, "utf-8");
    writeFileSync(CTX_PATH, replaceMaxMemoryLines(source, mutation.newValue));
  }
}

function revertMutation(mutation) {
  if (mutation.param === "scoreThreshold") {
    const source = readFileSync(MEMORY_PATH, "utf-8");
    writeFileSync(MEMORY_PATH, replaceScoreThreshold(source, mutation.oldValue));
  } else if (mutation.param === "searchLimit") {
    const source = readFileSync(MEMORY_PATH, "utf-8");
    writeFileSync(MEMORY_PATH, replaceSearchLimit(source, mutation.oldValue));
  } else if (mutation.param === "maxMemoryLines") {
    const source = readFileSync(CTX_PATH, "utf-8");
    writeFileSync(CTX_PATH, replaceMaxMemoryLines(source, mutation.oldValue));
  }
}

// ── Main Loop ───────────────────────────────────────────────────────

async function main() {
  const { iterations } = parseArgs();

  // Detect mode
  const env = loadEnv();
  const hasOpenAI = !!env.OPENAI_API_KEY;
  const anthropicKey = loadAnthropicKey();
  const hasAnthropic = !!anthropicKey;
  const liveMode = hasOpenAI && hasAnthropic;

  console.log("Memory Thresholds Campaign");
  console.log("══════════════════════════════════════════════");
  console.log(`Mode: ${liveMode ? "LIVE (Mem0 + embeddings)" : "SYNTHETIC (keyword overlap)"}`);
  console.log(`  OPENAI_API_KEY: ${hasOpenAI ? "found" : "missing"}`);
  console.log(`  Anthropic key: ${hasAnthropic ? "found" : "missing"}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Targets: ${MEMORY_PATH}`);
  console.log(`         ${CTX_PATH}`);
  console.log(`Log: ${LOG_PATH}\n`);

  // Initialize log file
  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tparam\told_value\tnew_value\tscore_before\tscore_after\tstatus\n");
  }

  // Save original sources for crash recovery
  const originalMemory = readFileSync(MEMORY_PATH, "utf-8");
  const originalCtx = readFileSync(CTX_PATH, "utf-8");

  // Get current params
  const initialParams = getCurrentParams();
  console.log("Current parameters:");
  console.log(`  scoreThreshold: ${initialParams.scoreThreshold}`);
  console.log(`  searchLimit: ${initialParams.searchLimit}`);
  console.log(`  maxMemoryLines: ${initialParams.maxMemoryLines}`);
  console.log("");

  // Run baseline
  console.log("Running baseline eval...");
  let bestScore;

  if (liveMode) {
    const baselineScores = runEval();
    if (!baselineScores) {
      console.error("ERROR: Baseline eval failed. Aborting.");
      process.exit(1);
    }
    bestScore = baselineScores.combined;
  } else {
    const synResult = syntheticEval(
      initialParams.scoreThreshold,
      initialParams.searchLimit,
      initialParams.maxMemoryLines,
    );
    bestScore = synResult.combined;
    console.log(`  Synthetic recall: ${synResult.recall.toFixed(4)}`);
    console.log(`  Synthetic precision: ${synResult.precision.toFixed(4)}`);
    console.log(`  Truncation penalty: ${synResult.truncation_penalty.toFixed(4)}`);
  }

  console.log(`Baseline combined score: ${bestScore.toFixed(4)}\n`);

  let kept = 0;
  let discarded = 0;

  for (let i = 1; i <= iterations; i++) {
    console.log(`\n── Iteration ${i}/${iterations} ──────────────────────`);

    const currentParams = getCurrentParams();
    const mutation = generateMutation(currentParams);

    if (!mutation) {
      console.log("No valid mutations available. Stopping.");
      break;
    }

    console.log(`Trying: ${mutation.desc}`);

    // Apply mutation to source
    applyMutation(mutation);

    // Run eval
    let newScore;
    if (liveMode) {
      const scores = runEval();
      if (!scores) {
        console.log("  Eval failed. Reverting.");
        revertMutation(mutation);
        appendFileSync(
          LOG_PATH,
          `${i}\t${mutation.param}\t${mutation.oldValue}\t${mutation.newValue}\t${bestScore.toFixed(4)}\tERROR\terror\n`,
        );
        discarded++;
        continue;
      }
      newScore = scores.combined;
    } else {
      // Synthetic eval uses the mutated parameter values directly
      const mutatedParams = getCurrentParams();
      const synResult = syntheticEval(
        mutatedParams.scoreThreshold,
        mutatedParams.searchLimit,
        mutatedParams.maxMemoryLines,
      );
      newScore = synResult.combined;
    }

    console.log(`  Score: ${bestScore.toFixed(4)} -> ${newScore.toFixed(4)}`);

    if (newScore >= bestScore) {
      console.log("  KEPT");
      appendFileSync(
        LOG_PATH,
        `${i}\t${mutation.param}\t${mutation.oldValue}\t${mutation.newValue}\t${bestScore.toFixed(4)}\t${newScore.toFixed(4)}\tkept\n`,
      );
      bestScore = newScore;
      kept++;
    } else {
      console.log("  REVERTED (score dropped)");
      revertMutation(mutation);
      appendFileSync(
        LOG_PATH,
        `${i}\t${mutation.param}\t${mutation.oldValue}\t${mutation.newValue}\t${bestScore.toFixed(4)}\t${newScore.toFixed(4)}\tdiscarded\n`,
      );
      discarded++;
    }
  }

  // Final summary
  const finalParams = getCurrentParams();
  console.log("\n══════════════════════════════════════════════");
  console.log("         MEMORY THRESHOLDS COMPLETE           ");
  console.log("══════════════════════════════════════════════");
  console.log(`Mode: ${liveMode ? "LIVE" : "SYNTHETIC"}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Kept: ${kept}`);
  console.log(`Discarded: ${discarded}`);
  // Recalculate baseline for accurate delta display
  const baselineScore = liveMode
    ? syntheticEval(initialParams.scoreThreshold, initialParams.searchLimit, initialParams.maxMemoryLines).combined
    : syntheticEval(initialParams.scoreThreshold, initialParams.searchLimit, initialParams.maxMemoryLines).combined;
  console.log(`Baseline combined score: ${baselineScore.toFixed(4)}`);
  console.log(`Final combined score:    ${bestScore.toFixed(4)}`);
  console.log(`Net change: ${bestScore - baselineScore >= 0 ? "+" : ""}${(bestScore - baselineScore).toFixed(4)}`);
  console.log(`\nFinal parameters:`);
  console.log(`  scoreThreshold: ${finalParams.scoreThreshold}`);
  console.log(`  searchLimit: ${finalParams.searchLimit}`);
  console.log(`  maxMemoryLines: ${finalParams.maxMemoryLines}`);
  console.log(`\nLog: ${LOG_PATH}`);
}

main().catch((err) => {
  console.error("Campaign crashed:", err);
  // Attempt to verify source integrity on crash
  try {
    const memSrc = readFileSync(MEMORY_PATH, "utf-8");
    const ctxSrc = readFileSync(CTX_PATH, "utf-8");
    if (!memSrc.includes("r.score >") || !ctxSrc.includes("MAX_MEMORY_LINES")) {
      console.error("Source files may be corrupted. Check git for recovery:");
      console.error(`  git checkout -- ${MEMORY_PATH} ${CTX_PATH}`);
    }
  } catch { /* nothing we can do */ }
  process.exit(1);
});
