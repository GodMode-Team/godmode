#!/usr/bin/env node
/**
 * AutoResearch Campaign: Queue Prompt Optimization
 *
 * Uses LLM-as-judge (gpt-4o-mini) to iteratively improve the PROMPT_TEMPLATES
 * in src/services/queue-processor.ts via random mutation + hill climbing.
 *
 * Usage:
 *   node autoresearch/campaigns/queue-prompts.mjs [--iterations N]
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const QUEUE_PROCESSOR_PATH = path.join(REPO_ROOT, "src/services/queue-processor.ts");
const LOG_PATH = path.join(__dirname, "queue-prompts-log.tsv");
const ENV_PATH = path.join(process.env.HOME, ".openclaw/.env");

// ── Load env ─────────────────────────────────────────────────────────

async function loadEnv() {
  const raw = await fs.readFile(ENV_PATH, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Test cases ───────────────────────────────────────────────────────

const TEST_TASKS = {
  coding: [
    { title: "Add dark mode toggle", description: "Add a dark/light mode toggle to the settings page using CSS variables" },
    { title: "Fix auth token refresh", description: "The JWT refresh is failing silently when the token expires during a long session" },
    { title: "Add rate limiting to API", description: "Implement rate limiting on the public API endpoints. 100 req/min per user." },
  ],
  research: [
    { title: "Competitor analysis: Linear vs Notion", description: "Compare project management features, pricing, and target market" },
    { title: "Best practices for AI agent orchestration", description: "Research patterns for managing multiple AI agents in production" },
    { title: "State of chiropractic marketing 2026", description: "Market size, trends, digital adoption, key players" },
  ],
  analysis: [
    { title: "Q1 revenue breakdown", description: "Analyze revenue by product line, identify trends and anomalies" },
    { title: "User churn analysis", description: "Why are users leaving? Segment by plan, usage, and onboarding completion" },
    { title: "Agent task completion rates", description: "Analyze which task types succeed most/least and why" },
  ],
  creative: [
    { title: "Blog post about personal AI", description: "Write a compelling post about why personal AI allies > generic chatbots" },
    { title: "Product launch tweet thread", description: "Create a 5-tweet thread announcing GodMode v2.0 features" },
    { title: "Cold email for PA partnerships", description: "Write outreach email for chiropractic clinic partnerships" },
  ],
  review: [
    { title: "Review the auth PR", description: "PR #142 adds OAuth device flow. Check security, error handling, edge cases." },
    { title: "Review onboarding flow", description: "Check the new user onboarding for UX issues, missing steps, confusion points" },
    { title: "Code review: queue processor refactor", description: "Review the queue processor changes for performance, error handling, and maintainability" },
  ],
  ops: [
    { title: "Deploy v1.6 to production", description: "Run the deployment pipeline, verify health checks, monitor for 30 min" },
    { title: "Rotate API keys", description: "Rotate all external API keys (OpenAI, HubSpot, Google) and update .env files" },
    { title: "Clean up stale branches", description: "Delete merged branches older than 30 days from the repo" },
  ],
  task: [
    { title: "Send Jake the API docs", description: "Jake needs the latest API documentation for the integration" },
    { title: "Update the README with new setup steps", description: "The onboarding flow changed, README is outdated" },
    { title: "Organize vault inbox", description: "Move processed notes from inbox to appropriate PARA folders" },
  ],
  url: [
    { title: "Analyze this article", description: "What are the key takeaways?", url: "https://example.com/ai-agents-2026" },
    { title: "Check competitor pricing", description: "What's their current pricing structure?", url: "https://example.com/pricing" },
    { title: "Review this thread", description: "Summarize the discussion", url: "https://twitter.com/example/status/123" },
  ],
  idea: [
    { title: "Voice mode for GodMode", description: "What if the ally could speak and listen? Hands-free ally interaction." },
    { title: "Marketplace for skill cards", description: "Let users share and install community-built skill cards" },
    { title: "Proactive daily email digest", description: "GodMode sends a morning email with your brief, no need to open the app" },
  ],
};

// ── Mutations ────────────────────────────────────────────────────────

const MUTATIONS = [
  'Be thorough but concise. Quality over quantity.',
  'Include confidence levels for each finding.',
  'End with: ## Next Steps — what the user should do with this.',
  'IMPORTANT: Show your sources. Link to evidence.',
  'Format output in markdown with clear headers.',
  "If you can't fully complete this, document what's blocking you and what you tried.",
  'Think step by step before acting.',
  'Prioritize actionable insights over comprehensive coverage.',
  'Target output: 500-1000 words unless the task warrants more.',
  'Start with a one-sentence executive summary.',
];

// ── Resolve Anthropic key (Sonnet 4.6 preferred judge) ───────────────
let _ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!_ANTHROPIC_KEY) {
  try {
    const { readFileSync: rfs } = await import("node:fs");
    const { join: pj } = await import("node:path");
    const { homedir: hd } = await import("node:os");
    const profiles = JSON.parse(rfs(pj(hd(), ".openclaw", "auth-profiles.json"), "utf-8"));
    const entry = profiles?.profiles?.["anthropic:oauth"]
      ?? Object.values(profiles?.profiles ?? {}).find(p => p?.provider === "anthropic" && p?.token);
    if (entry?.token) _ANTHROPIC_KEY = entry.token;
  } catch {}
}

let _LLM_KEY, _LLM_URL, _LLM_MODEL, _IS_ANTHROPIC;
if (_ANTHROPIC_KEY) {
  _LLM_KEY = _ANTHROPIC_KEY;
  _LLM_URL = "https://api.anthropic.com/v1/messages";
  _LLM_MODEL = "claude-sonnet-4-20250514";
  _IS_ANTHROPIC = true;
  console.log(`[queue-prompts] Using LLM judge: Sonnet 4.6 via Anthropic`);
} else {
  const xai = process.env.XAI_API_KEY;
  const oai = process.env.OPENAI_API_KEY;
  _LLM_KEY = xai || oai;
  _LLM_URL = xai ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
  _LLM_MODEL = xai ? "grok-3-mini-fast" : "gpt-4o-mini";
  _IS_ANTHROPIC = false;
  console.log(`[queue-prompts] Using LLM judge: ${_LLM_MODEL} (Anthropic key not found, falling back)`);
}

const JUDGE_SYSTEM = `You are evaluating a prompt template for an AI agent task system. The template will be filled with {title} and {description} to create instructions for a background AI agent.

Score the prompt on 1-10 for each dimension:
1. CLARITY: Does the agent know exactly what to do?
2. STRUCTURE: Does the prompt specify output format/structure?
3. QUALITY_BAR: Does it set expectations for thoroughness and quality?
4. ACTIONABILITY: Will the output be directly usable by the user?
5. EVIDENCE: Does it require the agent to show sources/reasoning?

Return JSON only: {"clarity": N, "structure": N, "quality_bar": N, "actionability": N, "evidence": N}`;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function judgePrompt(filledTemplate, taskType, title, description) {
  if (!_LLM_KEY) throw new Error("No API key found for LLM judge");

  const userMsg = `Template being evaluated:\n---\n${filledTemplate}\n---\n\nThis is a "${taskType}" task. The title is "${title}" and description is "${description}".`;

  let res, content;

  if (_IS_ANTHROPIC) {
    res = await fetch(_LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": _LLM_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: _LLM_MODEL,
        system: JUDGE_SYSTEM,
        messages: [{ role: "user", content: userMsg }],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429 || res.status === 529) {
        await sleep(3000);
        return judgePrompt(filledTemplate, taskType, title, description); // retry
      }
      throw new Error(`Anthropic API error ${res.status}: ${body}`);
    }

    const data = await res.json();
    content = data.content?.[0]?.text;
  } else {
    res = await fetch(_LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_LLM_KEY}`,
      },
      body: JSON.stringify({
        model: _LLM_MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: JUDGE_SYSTEM },
          { role: "user", content: userMsg },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LLM API error ${res.status}: ${body}`);
    }

    const data = await res.json();
    content = data.choices?.[0]?.message?.content;
  }

  if (!content) throw new Error("Empty response from judge");

  // Extract JSON (may be wrapped in markdown code blocks)
  const jsonMatch = content.match(/\{[^}]+\}/);
  if (!jsonMatch) throw new Error(`No JSON in response: ${content}`);

  const scores = JSON.parse(jsonMatch[0]);
  return scores;
}

function totalScore(scores) {
  return (scores.clarity ?? 0) + (scores.structure ?? 0) + (scores.quality_bar ?? 0) +
    (scores.actionability ?? 0) + (scores.evidence ?? 0);
}

// ── Template extraction / replacement ────────────────────────────────

const TASK_TYPES = ["coding", "research", "analysis", "creative", "review", "ops", "task", "url", "idea"];

/**
 * Parse the PROMPT_TEMPLATES block from queue-processor.ts and return a map of
 * task type -> template string.
 */
function parseTemplates(source) {
  // Match the entire PROMPT_TEMPLATES block
  const blockRe = /const PROMPT_TEMPLATES:\s*Record<QueueItemType,\s*string>\s*=\s*\{([\s\S]*?)\n\};/;
  const blockMatch = source.match(blockRe);
  if (!blockMatch) throw new Error("Could not find PROMPT_TEMPLATES block in source");

  const block = blockMatch[1];
  const templates = {};

  for (const type of TASK_TYPES) {
    // Match:  type:\n    "...",  or  type:\n    "...",
    // The value can be a single string or template literal spanning lines with \n
    const re = new RegExp(`${type}:\\s*\\n\\s*"((?:[^"\\\\]|\\\\.)*)"`);
    const m = block.match(re);
    if (m) {
      // Unescape the string literal
      templates[type] = m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else {
      // Try single-line:  type: "...",
      const re2 = new RegExp(`${type}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const m2 = block.match(re2);
      if (!m2) throw new Error(`Could not parse template for ${type}`);
      templates[type] = m2[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
  }

  return templates;
}

function escapeForTsString(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

/**
 * Replace a single template in the source file. Finds the existing template string
 * for the given type and swaps it with newTemplate.
 */
function replaceTemplate(source, type, newTemplate) {
  const escaped = escapeForTsString(newTemplate);
  // Match the template value for this type (multiline-aware)
  const re = new RegExp(`(${type}:\\s*\\n\\s*)"(?:[^"\\\\]|\\\\.)*"`, "s");
  let result = source.replace(re, `$1"${escaped}"`);
  if (result === source) {
    // Try single-line variant
    const re2 = new RegExp(`(${type}:\\s*)"(?:[^"\\\\]|\\\\.)*"`, "s");
    result = source.replace(re2, `$1"${escaped}"`);
  }
  if (result === source) throw new Error(`Failed to replace template for ${type}`);
  return result;
}

// ── Fill template ────────────────────────────────────────────────────

function fillTemplate(template, task) {
  return template
    .replace(/\{title\}/g, task.title)
    .replace(/\{description\}/g, task.description)
    .replace(/\{url\}/g, task.url || "");
}

// ── Score a task type ────────────────────────────────────────────────

async function scoreTaskType(templates, taskType) {
  const tasks = TEST_TASKS[taskType];
  const template = templates[taskType];
  let totalSum = 0;

  for (const task of tasks) {
    const filled = fillTemplate(template, task);
    await sleep(500); // rate limit
    const scores = await judgePrompt(filled, taskType, task.title, task.description);
    totalSum += totalScore(scores);
  }

  return totalSum / tasks.length; // average total score across 3 tasks
}

// ── Logging ──────────────────────────────────────────────────────────

async function initLog() {
  try {
    await fs.access(LOG_PATH);
  } catch {
    await fs.writeFile(LOG_PATH, "iteration\ttask_type\tscore_before\tscore_after\tmutation\tstatus\n");
  }
}

async function appendLog(iteration, taskType, scoreBefore, scoreAfter, mutation, status) {
  const line = `${iteration}\t${taskType}\t${scoreBefore.toFixed(2)}\t${scoreAfter.toFixed(2)}\t${mutation}\t${status}\n`;
  await fs.appendFile(LOG_PATH, line);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  await loadEnv();

  // Parse --iterations
  const args = process.argv.slice(2);
  let iterations = 15;
  const itIdx = args.indexOf("--iterations");
  if (itIdx !== -1 && args[itIdx + 1]) {
    iterations = parseInt(args[itIdx + 1], 10);
    if (isNaN(iterations) || iterations < 1) iterations = 15;
  }

  console.log(`\n=== Queue Prompt Optimization Campaign ===`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Source: ${QUEUE_PROCESSOR_PATH}`);
  console.log(`Log: ${LOG_PATH}\n`);

  await initLog();

  // Read source and parse current templates
  let source = await fs.readFile(QUEUE_PROCESSOR_PATH, "utf-8");
  let templates = parseTemplates(source);

  // ── Phase 1: Baseline scoring ──────────────────────────────────────
  console.log("── Phase 1: Baseline scoring ──");
  const baselineScores = {};
  for (const type of TASK_TYPES) {
    const score = await scoreTaskType(templates, type);
    baselineScores[type] = score;
    console.log(`  ${type}: ${score.toFixed(2)} / 50`);
    await appendLog(0, type, score, score, "(baseline)", "baseline");
  }

  const baselineAvg = Object.values(baselineScores).reduce((a, b) => a + b, 0) / TASK_TYPES.length;
  console.log(`\n  Overall baseline: ${baselineAvg.toFixed(2)} / 50\n`);

  // Track current best scores per type
  const currentScores = { ...baselineScores };

  // ── Phase 2: Mutation loop ─────────────────────────────────────────
  console.log("── Phase 2: Mutation loop ──");
  let improvements = 0;
  let regressions = 0;

  for (let i = 1; i <= iterations; i++) {
    // Pick random task type and mutation
    const taskType = TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)];
    const mutation = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];

    console.log(`\n[Iteration ${i}/${iterations}] ${taskType} + "${mutation}"`);

    // Apply mutation: append to existing template
    const originalTemplate = templates[taskType];
    const mutatedTemplate = originalTemplate + "\n\n" + mutation;

    // Temporarily apply
    templates[taskType] = mutatedTemplate;

    // Score
    const scoreBefore = currentScores[taskType];
    let scoreAfter;
    try {
      scoreAfter = await scoreTaskType(templates, taskType);
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      templates[taskType] = originalTemplate; // revert
      await appendLog(i, taskType, scoreBefore, scoreBefore, mutation, "error");
      continue;
    }

    const delta = scoreAfter - scoreBefore;
    const improved = delta > 0;

    if (improved) {
      // Keep the mutation — write to file
      source = await fs.readFile(QUEUE_PROCESSOR_PATH, "utf-8");
      source = replaceTemplate(source, taskType, mutatedTemplate);
      await fs.writeFile(QUEUE_PROCESSOR_PATH, source);
      currentScores[taskType] = scoreAfter;
      improvements++;
      console.log(`  KEPT: ${scoreBefore.toFixed(2)} -> ${scoreAfter.toFixed(2)} (+${delta.toFixed(2)})`);
      await appendLog(i, taskType, scoreBefore, scoreAfter, mutation, "kept");
    } else {
      // Revert
      templates[taskType] = originalTemplate;
      regressions++;
      console.log(`  REVERTED: ${scoreBefore.toFixed(2)} -> ${scoreAfter.toFixed(2)} (${delta.toFixed(2)})`);
      await appendLog(i, taskType, scoreBefore, scoreAfter, mutation, "reverted");
    }
  }

  // ── Summary ────────────────────────────────────────────────────────
  console.log("\n\n=== Campaign Summary ===");
  console.log(`Iterations: ${iterations}`);
  console.log(`Improvements kept: ${improvements}`);
  console.log(`Regressions reverted: ${regressions}`);
  console.log(`Errors: ${iterations - improvements - regressions}`);

  console.log("\n  Type            Before   After    Delta");
  console.log("  ──────────────  ───────  ───────  ──────");
  let finalAvg = 0;
  for (const type of TASK_TYPES) {
    const before = baselineScores[type];
    const after = currentScores[type];
    const delta = after - before;
    finalAvg += after;
    const sign = delta >= 0 ? "+" : "";
    console.log(`  ${type.padEnd(16)}${before.toFixed(2).padStart(7)}  ${after.toFixed(2).padStart(7)}  ${sign}${delta.toFixed(2)}`);
  }
  finalAvg /= TASK_TYPES.length;
  console.log(`\n  Overall: ${baselineAvg.toFixed(2)} -> ${finalAvg.toFixed(2)} (${finalAvg >= baselineAvg ? "+" : ""}${(finalAvg - baselineAvg).toFixed(2)})`);
  console.log(`\nLog written to: ${LOG_PATH}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
