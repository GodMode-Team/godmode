/**
 * optimizer.mjs — Phase 2 Mutation Engine for Synthetic User Campaign.
 *
 * Picks highest-impact bugs, diagnoses root causes via LLM, applies
 * minimal fixes, re-tests affected surfaces, and keeps or reverts
 * based on score comparison.
 *
 * Mutation targets (what CAN be changed):
 *   UI components, error messages, RPC handlers, context injection,
 *   prompt templates, config defaults, onboarding flow, CSS/responsive.
 *
 * Never touch:
 *   6-tab baseline, ally identity, data model, plugin API contract,
 *   meta-architecture, no new features.
 */

import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";
import { createAnthropicCaller, loadGodModeEnv } from "../../lib/resolve-anthropic.mjs";
import { DIMENSIONS } from "./judge.mjs";

loadGodModeEnv();

// ── Paths ──────────────────────────────────────────────────────────

const CAMPAIGN_DIR = dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = join(CAMPAIGN_DIR, "..", "..");
const RESULTS_DIR = join(PROJECT_ROOT, "results", "synthetic-users");
const OPT_LOG_PATH = join(RESULTS_DIR, "optimization-log.tsv");

// ── Forbidden Zones ────────────────────────────────────────────────

const NEVER_TOUCH_PATTERNS = [
  /ally.*identity/i,
  /GODMODE-META-ARCHITECTURE/i,
  /plugin-sdk/i,
  /openclaw\.plugin\.json/i,
  /data.*model/i,
];

const ALLOWED_MUTATION_DIRS = [
  "ui/src/",
  "src/methods/",
  "src/lib/",
  "src/services/",
  "ui/src/components/",
  "ui/src/styles/",
  "src/personas/",
  "src/skills/",
];

// ── Severity Ordering ──────────────────────────────────────────────

const SEVERITY_ORDER = { P0: 0, P1: 1, P2: 2, P3: 3 };

function severityRank(sev) {
  return SEVERITY_ORDER[sev] ?? 4;
}

// ── Bug Prioritization ─────────────────────────────────────────────

function prioritizeBugs(bugs) {
  // Count occurrences of each bug description
  const freq = new Map();
  for (const bug of bugs) {
    const key = `${bug.severity}:${bug.description}`;
    if (!freq.has(key)) {
      freq.set(key, { ...bug, count: 0 });
    }
    freq.get(key).count += 1;
  }

  // Sort by severity first, then frequency
  return [...freq.values()].sort((a, b) => {
    const sevDiff = severityRank(a.severity) - severityRank(b.severity);
    if (sevDiff !== 0) return sevDiff;
    return b.count - a.count;
  });
}

// ── Friction Pattern Extraction ────────────────────────────────────

function extractFrictionPatterns(feedback) {
  // Group feedback by theme keywords
  const patterns = new Map();

  for (const entry of feedback) {
    const text = typeof entry === "string" ? entry : entry.feedback || "";
    const lower = text.toLowerCase();

    // Identify theme
    let theme = "general";
    if (lower.includes("confus") || lower.includes("unclear")) theme = "clarity";
    else if (lower.includes("slow") || lower.includes("wait") || lower.includes("loading")) theme = "performance";
    else if (lower.includes("error") || lower.includes("fail") || lower.includes("crash")) theme = "reliability";
    else if (lower.includes("find") || lower.includes("discover") || lower.includes("hidden")) theme = "discoverability";
    else if (lower.includes("memory") || lower.includes("forget") || lower.includes("context")) theme = "memory";
    else if (lower.includes("trust") || lower.includes("permission") || lower.includes("autonom")) theme = "trust";

    if (!patterns.has(theme)) patterns.set(theme, []);
    patterns.get(theme).push(text);
  }

  return patterns;
}

// ── LLM Diagnosis ──────────────────────────────────────────────────

async function diagnoseBug(caller, bug, frictionPatterns) {
  const frictionContext = [...frictionPatterns.entries()]
    .map(([theme, items]) => `${theme}: ${items.slice(0, 3).join("; ")}`)
    .join("\n");

  const systemPrompt = `You are a senior full-stack engineer diagnosing bugs in GodMode, a Personal AI OS for Entrepreneurs built with Lit web components and TypeScript.

ARCHITECTURE:
- UI: Lit web components in ui/src/components/, built with Vite
- Backend: TypeScript RPC handlers in src/methods/
- Services: src/services/
- Shared lib: src/lib/
- Personas/prompts: src/personas/, src/skills/
- Config: src/lib/ config files

MUTATION BOUNDARIES — you may ONLY change:
- UI components (ui/src/)
- Error messages
- RPC handlers (src/methods/)
- Context injection (src/lib/)
- Prompt templates (src/personas/, src/skills/)
- Config defaults
- Onboarding flow
- CSS/responsive styles

NEVER touch: 6-tab baseline structure, ally identity, data model schema, plugin API contract, meta-architecture, don't add new features.

Return JSON only.`;

  const userPrompt = `Bug to diagnose:
Severity: ${bug.severity}
Description: ${bug.description}
Surface: ${bug.surface || "unknown"}
Occurrences: ${bug.count || 1}

Related friction patterns:
${frictionContext || "None identified"}

Diagnose the root cause and propose a MINIMAL fix.

Return JSON:
{
  "rootCause": "...",
  "affectedFile": "path/relative/to/project/root",
  "fix": {
    "description": "...",
    "search": "exact string to find in the file",
    "replace": "exact replacement string"
  },
  "affectedSurfaces": ["surface1", "surface2"],
  "affectedArchetypes": ["archetype1"],
  "confidence": 0.0-1.0,
  "risk": "low|medium|high"
}`;

  const raw = await caller(systemPrompt, userPrompt, 2048);
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn("[optimizer] Could not parse diagnosis response");
    return null;
  }
}

// ── Mutation Application ───────────────────────────────────────────

function validateMutation(diagnosis) {
  if (!diagnosis || !diagnosis.affectedFile || !diagnosis.fix) {
    return { valid: false, reason: "Missing diagnosis fields" };
  }

  const file = diagnosis.affectedFile;

  // Check forbidden zones
  for (const pattern of NEVER_TOUCH_PATTERNS) {
    if (pattern.test(file)) {
      return { valid: false, reason: `File matches forbidden pattern: ${pattern}` };
    }
  }

  // Check allowed directories
  const inAllowed = ALLOWED_MUTATION_DIRS.some((dir) => file.startsWith(dir));
  if (!inAllowed) {
    return { valid: false, reason: `File ${file} not in allowed mutation directories` };
  }

  // Check confidence threshold
  if ((diagnosis.confidence || 0) < 0.4) {
    return { valid: false, reason: `Confidence too low: ${diagnosis.confidence}` };
  }

  // Check risk
  if (diagnosis.risk === "high") {
    return { valid: false, reason: "Risk rated as high — skipping" };
  }

  return { valid: true };
}

function applyMutation(diagnosis) {
  const filePath = join(PROJECT_ROOT, diagnosis.affectedFile);

  if (!existsSync(filePath)) {
    console.warn(`[optimizer] File not found: ${filePath}`);
    return false;
  }

  const content = readFileSync(filePath, "utf-8");
  const { search, replace } = diagnosis.fix;

  if (!search || !replace) {
    console.warn("[optimizer] Fix missing search or replace string");
    return false;
  }

  if (!content.includes(search)) {
    console.warn(`[optimizer] Search string not found in ${diagnosis.affectedFile}`);
    return false;
  }

  const newContent = content.replace(search, replace);
  if (newContent === content) {
    console.warn("[optimizer] Replacement produced no change");
    return false;
  }

  writeFileSync(filePath, newContent, "utf-8");
  console.log(`[optimizer] Applied mutation to ${diagnosis.affectedFile}`);
  return true;
}

// ── Build Verification ─────────────────────────────────────────────

function verifyBuild() {
  try {
    console.log("[optimizer] Running build verification...");
    execSync("pnpm build && pnpm typecheck", {
      cwd: PROJECT_ROOT,
      stdio: "pipe",
      timeout: 120000,
    });
    console.log("[optimizer] Build + typecheck passed");
    return true;
  } catch (err) {
    console.error(`[optimizer] Build/typecheck failed: ${err.message}`);
    return false;
  }
}

// ── Git Operations ─────────────────────────────────────────────────

function gitCommit(message) {
  try {
    execSync("git add -A", { cwd: PROJECT_ROOT, stdio: "pipe" });
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      cwd: PROJECT_ROOT,
      stdio: "pipe",
    });
    console.log(`[optimizer] Committed: ${message}`);
    return true;
  } catch (err) {
    console.warn(`[optimizer] Git commit failed: ${err.message}`);
    return false;
  }
}

function gitRevert() {
  try {
    execSync("git revert HEAD --no-edit", { cwd: PROJECT_ROOT, stdio: "pipe" });
    console.log("[optimizer] Reverted last commit");
    return true;
  } catch (err) {
    console.error(`[optimizer] Git revert failed: ${err.message}`);
    return false;
  }
}

// ── Score Comparison ───────────────────────────────────────────────

function compareScores(baseline, retest) {
  if (!baseline || !retest) return { improved: false, regressed: false, delta: {} };

  const delta = {};
  let improved = false;
  let regressed = false;

  for (const dim of DIMENSIONS) {
    const before = baseline[dim.key] || 0;
    const after = retest[dim.key] || 0;
    delta[dim.key] = Math.round((after - before) * 10) / 10;

    if (delta[dim.key] > 0.3) improved = true;
    if (delta[dim.key] < -0.5) regressed = true;
  }

  return { improved, regressed, delta };
}

function extractAvgScores(flowResult) {
  if (!flowResult || !flowResult.scores || flowResult.scores.length === 0) return null;

  const avg = {};
  const counts = {};

  for (const entry of flowResult.scores) {
    const scores = entry.scores || entry;
    for (const dim of DIMENSIONS) {
      if (typeof scores[dim.key] === "number") {
        avg[dim.key] = (avg[dim.key] || 0) + scores[dim.key];
        counts[dim.key] = (counts[dim.key] || 0) + 1;
      }
    }
  }

  for (const key of Object.keys(avg)) {
    avg[key] = Math.round((avg[key] / counts[key]) * 10) / 10;
  }

  return avg;
}

// ── Optimization Log ───────────────────────────────────────────────

function initOptLog() {
  if (!existsSync(OPT_LOG_PATH)) {
    const dir = dirname(OPT_LOG_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(
      OPT_LOG_PATH,
      "timestamp\tloop\tbug_severity\tbug_description\tfile\tconfidence\taction\tresult\tdelta\n",
      "utf-8",
    );
  }
}

function logOptimization(entry) {
  initOptLog();
  const row = [
    new Date().toISOString(),
    entry.loop || "",
    entry.severity || "",
    (entry.description || "").replace(/\t/g, " "),
    entry.file || "",
    entry.confidence || "",
    entry.action || "",
    entry.result || "",
    entry.delta || "",
  ].join("\t");
  appendFileSync(OPT_LOG_PATH, row + "\n", "utf-8");
}

// ── Main Optimization Loop ─────────────────────────────────────────

/**
 * Run a single optimization iteration.
 *
 * @param {number} loopNum - Optimization loop number
 * @param {object[]} bugs - All accumulated bugs from bugs.jsonl
 * @param {object[]} feedback - All accumulated feedback from feedback.jsonl
 * @param {Function} runTest - async (archetypeName, surfaceName) => flowResult
 */
export async function runOptimizationLoop(loopNum, bugs, feedback, runTest) {
  console.log(`[optimizer] Optimization loop ${loopNum}`);

  // 1. Prioritize bugs
  const ranked = prioritizeBugs(bugs);
  if (ranked.length === 0) {
    console.log("[optimizer] No bugs to optimize. Skipping.");
    logOptimization({ loop: loopNum, action: "skip", result: "no-bugs" });
    return;
  }

  const target = ranked[0];
  console.log(`[optimizer] Target: [${target.severity}] ${target.description} (x${target.count})`);

  // 2. Extract friction patterns
  const frictionPatterns = extractFrictionPatterns(feedback);

  // 3. LLM diagnosis
  const caller = await createAnthropicCaller("claude-sonnet-4-6", { temperature: 0.2 });
  if (!caller) {
    console.error("[optimizer] Could not create Anthropic caller");
    logOptimization({ loop: loopNum, severity: target.severity, description: target.description, action: "diagnose", result: "no-api-key" });
    return;
  }

  const diagnosis = await diagnoseBug(caller, target, frictionPatterns);
  if (!diagnosis) {
    console.warn("[optimizer] Diagnosis returned null — skipping this bug");
    logOptimization({ loop: loopNum, severity: target.severity, description: target.description, action: "diagnose", result: "null-diagnosis" });
    return;
  }

  console.log(`[optimizer] Root cause: ${diagnosis.rootCause}`);
  console.log(`[optimizer] Affected file: ${diagnosis.affectedFile}`);
  console.log(`[optimizer] Confidence: ${diagnosis.confidence}, Risk: ${diagnosis.risk}`);

  // 4. Validate mutation
  const validation = validateMutation(diagnosis);
  if (!validation.valid) {
    console.warn(`[optimizer] Mutation rejected: ${validation.reason}`);
    logOptimization({
      loop: loopNum,
      severity: target.severity,
      description: target.description,
      file: diagnosis.affectedFile,
      confidence: diagnosis.confidence,
      action: "validate",
      result: `rejected: ${validation.reason}`,
    });
    return;
  }

  // 5. Get baseline scores on affected surfaces before mutation
  const affectedSurfaces = diagnosis.affectedSurfaces || [];
  const affectedArchetypes = diagnosis.affectedArchetypes || [];
  const baselineScores = {};

  for (const arch of affectedArchetypes) {
    for (const surface of affectedSurfaces) {
      const key = `${arch}/${surface}`;
      console.log(`[optimizer] Getting baseline for ${key}...`);
      const result = await runTest(arch, surface);
      baselineScores[key] = extractAvgScores(result);
    }
  }

  // 6. Apply fix
  const applied = applyMutation(diagnosis);
  if (!applied) {
    console.warn("[optimizer] Mutation could not be applied");
    logOptimization({
      loop: loopNum,
      severity: target.severity,
      description: target.description,
      file: diagnosis.affectedFile,
      confidence: diagnosis.confidence,
      action: "apply",
      result: "failed",
    });
    return;
  }

  // 7. Build verification
  const buildOk = verifyBuild();
  if (!buildOk) {
    console.error("[optimizer] Build failed after mutation — reverting file");
    // Restore file from git
    try {
      execSync(`git checkout -- "${diagnosis.affectedFile}"`, { cwd: PROJECT_ROOT, stdio: "pipe" });
    } catch {}
    logOptimization({
      loop: loopNum,
      severity: target.severity,
      description: target.description,
      file: diagnosis.affectedFile,
      confidence: diagnosis.confidence,
      action: "build",
      result: "failed-reverted",
    });
    return;
  }

  // 8. Re-test affected surfaces
  const retestScores = {};
  for (const arch of affectedArchetypes) {
    for (const surface of affectedSurfaces) {
      const key = `${arch}/${surface}`;
      console.log(`[optimizer] Re-testing ${key}...`);
      const result = await runTest(arch, surface);
      retestScores[key] = extractAvgScores(result);
    }
  }

  // 9. Compare scores
  let anyRegressed = false;
  let anyImproved = false;
  const deltas = {};

  for (const key of Object.keys(baselineScores)) {
    const comparison = compareScores(baselineScores[key], retestScores[key]);
    deltas[key] = comparison.delta;
    if (comparison.regressed) anyRegressed = true;
    if (comparison.improved) anyImproved = true;
  }

  const deltaStr = JSON.stringify(deltas);

  // 10. Keep or revert
  if (anyRegressed) {
    console.warn("[optimizer] Regression detected (> 0.5 drop on a dimension) — reverting");
    // Commit then revert so we have history
    gitCommit(`[optimizer] mutation loop-${loopNum}: ${diagnosis.fix.description} [WILL REVERT]`);
    gitRevert();
    logOptimization({
      loop: loopNum,
      severity: target.severity,
      description: target.description,
      file: diagnosis.affectedFile,
      confidence: diagnosis.confidence,
      action: "revert",
      result: "regressed",
      delta: deltaStr,
    });
  } else {
    // Keep the change
    const msg = anyImproved
      ? `[optimizer] fix(loop-${loopNum}): ${diagnosis.fix.description}`
      : `[optimizer] neutral(loop-${loopNum}): ${diagnosis.fix.description}`;
    gitCommit(msg);
    console.log(`[optimizer] Mutation kept: ${anyImproved ? "improved" : "neutral"}`);
    logOptimization({
      loop: loopNum,
      severity: target.severity,
      description: target.description,
      file: diagnosis.affectedFile,
      confidence: diagnosis.confidence,
      action: "keep",
      result: anyImproved ? "improved" : "neutral",
      delta: deltaStr,
    });
  }

  console.log(`[optimizer] Loop ${loopNum} complete`);
}
