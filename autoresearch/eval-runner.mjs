/**
 * Autoresearch Evaluation Runner — Full GodMode Brain Evaluation
 * DO NOT MODIFY — this is the ground truth metric (like Karpathy's prepare.py).
 *
 * Tests 7 dimensions:
 *   1. Skill routing precision (deterministic, keyword regex)
 *   2. Context relevance accuracy (TIME_WORDS / OPS_WORDS gates)
 *   3. Context efficiency (no unnecessary injection)
 *   4. Context pressure degradation (tiers drop correctly)
 *   5. Memory recall quality (if Mem0 available, else synthetic scoring)
 *   6. Goal alignment (structural check — does context system surface the right info?)
 *   7. Ambiguity (informational, not scored)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { loadMem0Oss } from "../scripts/load-mem0-oss.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, "..");

// ── Load test suite ────────────────────────────────────────────────
const testSuite = JSON.parse(readFileSync(join(__dirname, "test-suite.json"), "utf-8"));

// ── Skill Card Loading (mirrors src/lib/skill-cards.ts) ────────────

function resolveSkillCardsDir() {
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH || join(homedir(), "Documents", "VAULT");
  const vaultCards = join(vaultPath, "99-System", "skill-cards");
  if (existsSync(vaultCards)) return vaultCards;
  const localCards = join(homedir(), "godmode", "memory", "skill-cards");
  if (existsSync(localCards)) return localCards;
  const shipped = join(REPO_DIR, "skill-cards");
  if (existsSync(shipped)) return shipped;
  return null;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (key && val) meta[key] = val;
  }
  return { meta, body: match[2] };
}

function loadSkillCards() {
  const dir = resolveSkillCardsDir();
  if (!dir) { console.error("ERROR: No skill cards directory found"); process.exit(1); }
  console.log(`Loading skill cards from: ${dir}\n`);
  const cards = [];
  for (const f of readdirSync(dir).filter(f => f.endsWith(".md"))) {
    try {
      const raw = readFileSync(join(dir, f), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      const slug = basename(f, ".md");
      const triggers = meta.triggers ? meta.triggers.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];
      const tools = meta.tools ? meta.tools.split(",").map(t => t.trim()).filter(Boolean) : [];
      cards.push({ slug, domain: meta.domain || slug, triggers, tools, body: body.trim() });
    } catch { /* skip */ }
  }
  return cards;
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function matchSkillCard(cards, userMessage) {
  const msg = userMessage.toLowerCase();
  let bestCard = null, bestScore = 0;
  for (const card of cards) {
    let score = 0;
    for (const trigger of card.triggers) {
      if (new RegExp(`\\b${escapeRegex(trigger)}\\b`, "i").test(msg)) score++;
    }
    if (score > bestScore) { bestScore = score; bestCard = card; }
  }
  return bestScore >= 1 ? bestCard : null;
}

// ── Relevance Words (from context-budget.ts source) ────────────────

function extractWordList(source, varName) {
  const match = source.match(new RegExp(`const ${varName}\\s*=\\s*\\[([\\s\\S]*?)\\];`));
  if (!match) return [];
  return match[1].split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

function loadRelevanceWords() {
  const ctxPath = join(REPO_DIR, "src", "lib", "context-budget.ts");
  if (!existsSync(ctxPath)) return null;
  const source = readFileSync(ctxPath, "utf-8");
  return { timeWords: extractWordList(source, "TIME_WORDS"), opsWords: extractWordList(source, "OPS_WORDS") };
}

function isTimeRelevant(msg, timeWords) { return timeWords.some(w => msg.includes(w)); }
function isOpsRelevant(msg, opsWords) { return opsWords.some(w => msg.includes(w)); }

// ════════════════════════════════════════════════════════════════════
// RUN ALL EVALUATIONS
// ════════════════════════════════════════════════════════════════════

const cards = loadSkillCards();
console.log(`Loaded ${cards.length} skill cards: ${cards.map(c => c.domain).join(", ")}\n`);
const words = loadRelevanceWords();
const scores = {};

// ── 1. SKILL ROUTING ───────────────────────────────────────────────

console.log("=== 1. Skill Routing ===\n");
let rPass = 0, rFail = 0;
const rFailures = [];
for (const test of testSuite.skill_routing.tests) {
  const got = matchSkillCard(cards, test.message)?.domain ?? null;
  if (got === test.expected) { rPass++; } else {
    rFail++;
    rFailures.push({ message: test.message, expected: test.expected, got, note: test.note });
  }
}
scores.skill_precision = (rPass + rFail) > 0 ? rPass / (rPass + rFail) : 0;
console.log(`Passed: ${rPass}/${rPass + rFail} (${(scores.skill_precision * 100).toFixed(1)}%)`);
if (rFailures.length > 0) {
  console.log("Failures:");
  for (const f of rFailures) console.log(`  "${f.message}" → ${f.got ?? "null"} (expected: ${f.expected ?? "null"})`);
}
console.log();

// ── 2. CONTEXT RELEVANCE ──────────────────────────────────────────

console.log("=== 2. Context Relevance ===\n");
let cPass = 0, cFail = 0;
if (words) {
  for (const test of testSuite.context_relevance.tests) {
    const msg = test.message.toLowerCase();
    const isFirst = test.is_first ?? false;
    const wantsSchedule = isFirst || isTimeRelevant(msg, words.timeWords);
    const wantsOps = isFirst || isOpsRelevant(msg, words.opsWords);
    const ok = test.expect_schedule === wantsSchedule && test.expect_ops === wantsOps;
    if (ok) { cPass++; } else {
      cFail++;
      console.log(`  FAIL: "${test.message}"`);
    }
  }
}
scores.context_relevance = (cPass + cFail) > 0 ? cPass / (cPass + cFail) : 0;
console.log(`Passed: ${cPass}/${cPass + cFail} (${(scores.context_relevance * 100).toFixed(1)}%)\n`);

// ── 3. CONTEXT EFFICIENCY ─────────────────────────────────────────

console.log("=== 3. Context Efficiency ===\n");
let ePass = 0, eFail = 0;
const eFailures = [];
if (words && testSuite.context_efficiency) {
  for (const test of testSuite.context_efficiency.tests) {
    const msg = test.message.toLowerCase();
    const wantsSchedule = isTimeRelevant(msg, words.timeWords);
    const wantsOps = isOpsRelevant(msg, words.opsWords);
    const skillCard = matchSkillCard(cards, test.message);
    const issues = [];

    if (test.should_not_inject) {
      if (test.should_not_inject.includes("schedule") && wantsSchedule) issues.push("schedule leaked");
      if (test.should_not_inject.includes("ops") && wantsOps) issues.push("ops leaked");
      if (test.should_not_inject.includes("skill_card") && skillCard) issues.push(`skill '${skillCard.domain}' leaked`);
    }
    if (test.should_inject) {
      if (test.should_inject.includes("schedule") && !wantsSchedule) issues.push("schedule missing");
      if (test.should_inject.includes("ops") && !wantsOps) issues.push("ops missing");
      if (test.should_inject.includes("skill_card") && !skillCard) issues.push("skill card missing");
    }
    if (issues.length === 0) { ePass++; } else {
      eFail++;
      eFailures.push({ message: test.message, issues, note: test.note });
    }
  }
}
scores.context_efficiency = (ePass + eFail) > 0 ? ePass / (ePass + eFail) : 0;
console.log(`Passed: ${ePass}/${ePass + eFail} (${(scores.context_efficiency * 100).toFixed(1)}%)`);
if (eFailures.length > 0) {
  console.log("Failures:");
  for (const f of eFailures) console.log(`  "${f.message}" → ${f.issues.join("; ")}`);
}
console.log();

// ── 4. CONTEXT PRESSURE DEGRADATION ──────────────────────────────

console.log("=== 4. Pressure Degradation ===\n");
let pPass = 0, pFail = 0;
const ctxSource = readFileSync(join(REPO_DIR, "src", "lib", "context-budget.ts"), "utf-8");

const checks = [
  { test: ctxSource.includes("pressure >= 0.7"), label: "P2 drops at >= 0.7" },
  { test: ctxSource.includes("pressure >= 0.9"), label: "P3 drops at >= 0.9" },
  { test: ctxSource.includes("chunks.push(SOUL_ESSENCE)"), label: "Soul essence always injected (P0)" },
  { test: ctxSource.includes("isAgentMessage"), label: "Agent messages get minimal context" },
];
for (const c of checks) {
  if (c.test) { pPass++; console.log(`  [OK] ${c.label}`); }
  else { pFail++; console.log(`  [FAIL] ${c.label}`); }
}
scores.pressure_degradation = (pPass + pFail) > 0 ? pPass / (pPass + pFail) : 0;
console.log(`\nPassed: ${pPass}/${pPass + pFail} (${(scores.pressure_degradation * 100).toFixed(1)}%)\n`);

// ── 5. MEMORY RECALL ─────────────────────────────────────────────

console.log("=== 5. Memory Recall ===\n");
let mPass = 0, mFail = 0;
let mem0Available = false;
let memoryInstance = null;
const memRecallTests = testSuite.memory_recall;

try {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  if (hasOpenAI && hasAnthropic) {
    const { Memory } = await loadMem0Oss();
    const testDbPath = join(homedir(), "godmode", "data", "mem0-eval-vectors.db");
    const testHistoryPath = join(homedir(), "godmode", "data", "mem0-eval-history.db");
    memoryInstance = new Memory({
      version: "v1.1",
      llm: { provider: "anthropic", config: { apiKey: process.env.ANTHROPIC_API_KEY, model: "claude-haiku-4-5-20251001" } },
      embedder: { provider: "openai", config: { apiKey: process.env.OPENAI_API_KEY, model: "text-embedding-3-small" } },
      vectorStore: { provider: "memory", config: { collectionName: "eval_memories", dimension: 1536, dbPath: testDbPath } },
      historyStore: { provider: "sqlite", config: { historyDbPath: testHistoryPath } },
      enableGraph: false,
    });
    console.log("Seeding test memories...");
    for (const fact of memRecallTests.seed_facts) {
      await memoryInstance.add(fact, { userId: "eval_user", agentId: "eval" });
    }
    console.log(`Seeded ${memRecallTests.seed_facts.length} facts.\n`);
    mem0Available = true;
  } else {
    console.log("Mem0 not available (missing API keys). Running synthetic mode.\n");
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.log(`Mem0 init failed: ${message}\nRunning synthetic mode.\n`);
}

if (mem0Available && memoryInstance) {
  for (const test of memRecallTests.tests) {
    try {
      const result = await memoryInstance.search(test.query, { userId: "eval_user", limit: 5 });
      const allText = (result?.results ?? []).filter(r => r.score == null || r.score > 0.5).map(r => r.memory).join(" ").toLowerCase();
      const matched = test.expected_facts.filter(f => allText.includes(f.toLowerCase()));
      const recall = matched.length / test.expected_facts.length;
      if (recall >= 0.5) { mPass++; console.log(`  [OK] "${test.query}" → ${matched.length}/${test.expected_facts.length}`); }
      else {
        mFail++;
        const missed = test.expected_facts.filter(f => !allText.includes(f.toLowerCase()));
        console.log(`  [FAIL] "${test.query}" → missed: ${missed.join(", ")}`);
      }
    } catch (err) {
      mFail++;
      console.log(`  [ERROR] "${test.query}" → ${err.message}`);
    }
  }
} else {
  // Synthetic: validate seed facts contain expected keywords
  const allFacts = memRecallTests.seed_facts.join(" ").toLowerCase();
  for (const test of memRecallTests.tests) {
    const matched = test.expected_facts.filter(f => allFacts.includes(f.toLowerCase()));
    const recall = matched.length / test.expected_facts.length;
    if (recall >= 0.5) { mPass++; console.log(`  [OK] "${test.query}" → ${matched.length}/${test.expected_facts.length} in seed`); }
    else {
      mFail++;
      const missed = test.expected_facts.filter(f => !allFacts.includes(f.toLowerCase()));
      console.log(`  [FAIL] "${test.query}" → missing from seed: ${missed.join(", ")}`);
    }
  }
}
scores.memory_recall = (mPass + mFail) > 0 ? mPass / (mPass + mFail) : 0;
console.log(`\nPassed: ${mPass}/${mPass + mFail} (${(scores.memory_recall * 100).toFixed(1)}%) [${mem0Available ? "LIVE" : "SYNTHETIC"}]\n`);

// ── 6. GOAL ALIGNMENT ────────────────────────────────────────────

console.log("=== 6. Goal Alignment ===\n");
let gPass = 0, gFail = 0;
const goalTests = testSuite.goal_alignment;

for (const scenario of goalTests.scenarios) {
  const msg = scenario.user_message.toLowerCase();
  const skillCard = matchSkillCard(cards, scenario.user_message);
  const wantsSchedule = words ? isTimeRelevant(msg, words.timeWords) : false;
  const wantsOps = words ? isOpsRelevant(msg, words.opsWords) : false;
  const issues = [];

  for (const should of scenario.context_should_include) {
    const s = should.toLowerCase();
    if ((s === "priorities" || s === "overdue tasks" || s === "goals") && !wantsOps)
      issues.push(`${s} not triggered (no ops words)`);
    if (s === "schedule" && !wantsSchedule)
      issues.push("schedule not triggered");
    if ((s === "queue" || s === "delegate") && skillCard?.domain !== "queue")
      issues.push("queue skill card not triggered");
    if (s === "calendar" && !skillCard?.domain?.includes("calendar") && !wantsSchedule)
      issues.push("calendar context not triggered");
  }

  if (issues.length === 0) { gPass++; console.log(`  [OK] "${scenario.user_message}"`); }
  else {
    gFail++;
    console.log(`  [FAIL] "${scenario.user_message}"`);
    for (const i of issues) console.log(`    → ${i}`);
  }
}
scores.goal_alignment = (gPass + gFail) > 0 ? gPass / (gPass + gFail) : 0;
console.log(`\nPassed: ${gPass}/${gPass + gFail} (${(scores.goal_alignment * 100).toFixed(1)}%)\n`);

// ── 7. AMBIGUITY (informational) ─────────────────────────────────

console.log("=== 7. Ambiguity (informational) ===\n");
let aOk = 0;
for (const test of testSuite.ambiguity_tests.tests) {
  const got = matchSkillCard(cards, test.message)?.domain ?? null;
  const ok = got === test.expected;
  if (ok) aOk++;
  console.log(`  [${ok ? "OK" : "MISMATCH"}] "${test.message}" → ${got ?? "null"}`);
}
console.log();

// ── COMBINED SCORE ────────────────────────────────────────────────

const combined =
  (scores.skill_precision * 0.25) +
  (scores.context_relevance * 0.15) +
  (scores.context_efficiency * 0.15) +
  (scores.pressure_degradation * 0.10) +
  (scores.memory_recall * 0.20) +
  (scores.goal_alignment * 0.15);

console.log("═══════════════════════════════════════════════");
console.log("                  SUMMARY                      ");
console.log("═══════════════════════════════════════════════");
console.log(`SCORE:skill_precision:${scores.skill_precision.toFixed(4)}`);
console.log(`SCORE:context_relevance:${scores.context_relevance.toFixed(4)}`);
console.log(`SCORE:context_efficiency:${scores.context_efficiency.toFixed(4)}`);
console.log(`SCORE:pressure_degradation:${scores.pressure_degradation.toFixed(4)}`);
console.log(`SCORE:memory_recall:${scores.memory_recall.toFixed(4)}`);
console.log(`SCORE:goal_alignment:${scores.goal_alignment.toFixed(4)}`);
console.log(`SCORE:combined:${combined.toFixed(4)}`);
console.log(`SCORE:memory_mode:${mem0Available ? "live" : "synthetic"}`);
console.log(`SCORE:ambiguity_correct:${aOk}/${testSuite.ambiguity_tests.tests.length}`);
