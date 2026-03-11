/**
 * Autoresearch Campaign: Optimize TIME_WORDS and OPS_WORDS
 *
 * Iteratively mutates the TIME_WORDS and OPS_WORDS arrays in context-budget.ts,
 * runs the eval suite, and keeps mutations that improve the combined score.
 *
 * Usage: node autoresearch/campaigns/context-words.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, "..", "..");
const CTX_PATH = join(REPO_DIR, "src", "lib", "context-budget.ts");
const LOG_PATH = join(__dirname, "context-words-log.tsv");
const EVAL_CMD = `node ${join(REPO_DIR, "autoresearch", "eval-runner.mjs")}`;

// ── CLI args ───────────────────────────────────────────────────────

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

// ── Source parsing ─────────────────────────────────────────────────

function extractArray(source, varName) {
  const re = new RegExp(`const ${varName}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
  const match = source.match(re);
  if (!match) throw new Error(`Could not find ${varName} in context-budget.ts`);
  return match[1]
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function buildArrayLiteral(words, varName) {
  // Format as multi-line array, ~4 items per line, matching existing style
  const lines = [];
  for (let i = 0; i < words.length; i += 4) {
    const chunk = words.slice(i, i + 4).map((w) => `"${w}"`);
    lines.push("  " + chunk.join(", ") + ",");
  }
  // Remove trailing comma from last line
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,\s*$/, ",");
  }
  return `const ${varName} = [\n${lines.join("\n")}\n]`;
}

function replaceArray(source, varName, newWords) {
  const re = new RegExp(`const ${varName}\\s*=\\s*\\[[\\s\\S]*?\\]`);
  return source.replace(re, buildArrayLiteral(newWords, varName));
}

// ── Eval runner ────────────────────────────────────────────────────

function runEval() {
  try {
    const output = execSync(EVAL_CMD, {
      encoding: "utf-8",
      timeout: 120_000,
      cwd: REPO_DIR,
    });
    return parseScores(output);
  } catch (err) {
    // execSync throws on non-zero exit, but stdout may still have scores
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

// ── Candidate pools ────────────────────────────────────────────────

const TIME_CANDIDATES = [
  "appointment", "standup", "noon", "lunch", "midday", "hang out",
  "1:1", "one on one", "sync", "huddle", "check-in", "eta",
  "by when", "weekly", "daily", "kickoff", "review",
  "end of day", "eod", "wrap up",
];

const OPS_CANDIDATES = [
  "sprint", "milestone", "backlog", "blockers", "blocked",
  "ship", "deploy", "release", "ship it", "what needs",
  "anything urgent", "how's it going", "recap", "debrief",
  "retrospective", "retro",
];

// ── Mutation logic ─────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMutation(timeWords, opsWords) {
  // Possible mutations:
  //   1. Add a candidate to TIME_WORDS
  //   2. Add a candidate to OPS_WORDS
  //   3. Remove an existing word from TIME_WORDS
  //   4. Remove an existing word from OPS_WORDS
  const actions = [];

  // Add candidates not already present
  const timeAddable = TIME_CANDIDATES.filter((w) => !timeWords.includes(w));
  const opsAddable = OPS_CANDIDATES.filter((w) => !opsWords.includes(w));

  if (timeAddable.length > 0) actions.push({ type: "add_time", pool: timeAddable });
  if (opsAddable.length > 0) actions.push({ type: "add_ops", pool: opsAddable });
  if (timeWords.length > 3) actions.push({ type: "remove_time", pool: timeWords });
  if (opsWords.length > 3) actions.push({ type: "remove_ops", pool: opsWords });

  if (actions.length === 0) return null;

  const action = pickRandom(actions);
  const word = pickRandom(action.pool);

  switch (action.type) {
    case "add_time":
      return { desc: `add "${word}" to TIME_WORDS`, apply: () => [...timeWords, word], target: "TIME_WORDS", newTime: [...timeWords, word], newOps: opsWords };
    case "add_ops":
      return { desc: `add "${word}" to OPS_WORDS`, apply: null, target: "OPS_WORDS", newTime: timeWords, newOps: [...opsWords, word] };
    case "remove_time":
      return { desc: `remove "${word}" from TIME_WORDS`, apply: null, target: "TIME_WORDS", newTime: timeWords.filter((w) => w !== word), newOps: opsWords };
    case "remove_ops":
      return { desc: `remove "${word}" from OPS_WORDS`, apply: null, target: "OPS_WORDS", newTime: timeWords, newOps: opsWords.filter((w) => w !== word) };
  }
}

// ── Main loop ──────────────────────────────────────────────────────

async function main() {
  const { iterations } = parseArgs();

  console.log(`Context-Words Campaign: ${iterations} iterations`);
  console.log(`Target: ${CTX_PATH}`);
  console.log(`Log: ${LOG_PATH}\n`);

  // Initialize log file
  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tscore_before\tscore_after\tmutation\tstatus\n");
  }

  // Save original source for safety
  const originalSource = readFileSync(CTX_PATH, "utf-8");

  // Run baseline eval
  console.log("Running baseline eval...");
  const baselineScores = runEval();
  if (!baselineScores) {
    console.error("ERROR: Baseline eval failed. Aborting.");
    process.exit(1);
  }

  let bestScore = baselineScores.combined;
  console.log(`Baseline combined score: ${bestScore.toFixed(4)}\n`);

  let currentSource = originalSource;
  let kept = 0;
  let discarded = 0;

  for (let i = 1; i <= iterations; i++) {
    console.log(`\n── Iteration ${i}/${iterations} ──────────────────────`);

    // Read current state of the file (may have been modified by previous kept mutations)
    currentSource = readFileSync(CTX_PATH, "utf-8");
    const timeWords = extractArray(currentSource, "TIME_WORDS");
    const opsWords = extractArray(currentSource, "OPS_WORDS");

    // Generate a mutation
    const mutation = generateMutation(timeWords, opsWords);
    if (!mutation) {
      console.log("No more mutations available. Stopping.");
      break;
    }

    console.log(`Trying: ${mutation.desc}`);

    // Apply mutation to source
    let mutatedSource = currentSource;
    mutatedSource = replaceArray(mutatedSource, "TIME_WORDS", mutation.newTime);
    mutatedSource = replaceArray(mutatedSource, "OPS_WORDS", mutation.newOps);

    // Write mutated source
    writeFileSync(CTX_PATH, mutatedSource);

    // Run eval
    const scores = runEval();

    if (!scores) {
      console.log("  Eval failed. Reverting.");
      writeFileSync(CTX_PATH, currentSource);
      appendFileSync(LOG_PATH, `${i}\t${bestScore.toFixed(4)}\tERROR\t${mutation.desc}\terror\n`);
      discarded++;
      continue;
    }

    const newScore = scores.combined;
    console.log(`  Score: ${bestScore.toFixed(4)} -> ${newScore.toFixed(4)}`);

    if (newScore >= bestScore) {
      console.log("  KEPT");
      appendFileSync(LOG_PATH, `${i}\t${bestScore.toFixed(4)}\t${newScore.toFixed(4)}\t${mutation.desc}\tkept\n`);
      bestScore = newScore;
      kept++;
    } else {
      console.log("  REVERTED (score dropped)");
      writeFileSync(CTX_PATH, currentSource);
      appendFileSync(LOG_PATH, `${i}\t${bestScore.toFixed(4)}\t${newScore.toFixed(4)}\t${mutation.desc}\tdiscarded\n`);
      discarded++;
    }
  }

  // Final summary
  console.log("\n══════════════════════════════════════════════");
  console.log("              CAMPAIGN COMPLETE               ");
  console.log("══════════════════════════════════════════════");
  console.log(`Iterations: ${iterations}`);
  console.log(`Kept: ${kept}`);
  console.log(`Discarded: ${discarded}`);
  console.log(`Final combined score: ${bestScore.toFixed(4)}`);
  console.log(`Baseline combined score: ${baselineScores.combined.toFixed(4)}`);
  console.log(`Net change: ${(bestScore - baselineScores.combined >= 0 ? "+" : "")}${(bestScore - baselineScores.combined).toFixed(4)}`);

  // Verify final state matches what we expect
  const finalSource = readFileSync(CTX_PATH, "utf-8");
  const finalTime = extractArray(finalSource, "TIME_WORDS");
  const finalOps = extractArray(finalSource, "OPS_WORDS");
  console.log(`\nFinal TIME_WORDS (${finalTime.length}): ${finalTime.join(", ")}`);
  console.log(`Final OPS_WORDS (${finalOps.length}): ${finalOps.join(", ")}`);
  console.log(`\nLog: ${LOG_PATH}`);
}

main().catch((err) => {
  console.error("Campaign crashed:", err);
  // Attempt to restore original file on crash
  try {
    const backup = readFileSync(CTX_PATH, "utf-8");
    // Only restore if we can detect corruption
    if (!backup.includes("TIME_WORDS") || !backup.includes("OPS_WORDS")) {
      console.error("Source file appears corrupted. Check git for recovery.");
    }
  } catch { /* nothing we can do */ }
  process.exit(1);
});
