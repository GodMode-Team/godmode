#!/usr/bin/env node
/**
 * runner.mjs — Main Campaign Entry Point for Synthetic User Testing.
 *
 * Orchestrates the full testing campaign: loads archetypes, drives flows
 * via Stagehand, collects judge scores, generates reports, handles
 * crash recovery, and coordinates parallel archetype groups.
 *
 * Usage:
 *   node runner.mjs --phase discovery --loops 20
 *   node runner.mjs --phase optimization --loops 20
 *   node runner.mjs --phase discovery --loops 20 --resume
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { Stagehand } from "@browserbasehq/stagehand";
import { resolveAnthropicKey, loadGodModeEnv } from "../../lib/resolve-anthropic.mjs";
import { createJudge } from "./judge.mjs";
import { getFlowsForLoop, getFlowModule } from "./coverage-matrix.mjs";
import { generateLoopSummary, appendToScoreboard, generateConsolidatedReport } from "./reporter.mjs";
import { runOptimizationLoop } from "./optimizer.mjs";

// ── Archetype Imports ──────────────────────────────────────────────

import marcus from "./archetypes/marcus.mjs";
import diana from "./archetypes/diana.mjs";
import drMike from "./archetypes/dr-mike.mjs";
import sarah from "./archetypes/sarah.mjs";
import raj from "./archetypes/raj.mjs";
import alex from "./archetypes/alex.mjs";
import frankie from "./archetypes/frankie.mjs";

const ALL_ARCHETYPES = { marcus, diana, "dr-mike": drMike, sarah, raj, alex, frankie };

// ── Paths ──────────────────────────────────────────────────────────

const CAMPAIGN_DIR = dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = join(CAMPAIGN_DIR, "..", "..");
const RESULTS_DIR = join(PROJECT_ROOT, "results", "synthetic-users");
const STATE_PATH = join(RESULTS_DIR, "synthetic-state.json");
const LOG_PATH = join(CAMPAIGN_DIR, "..", "synthetic-users-log.tsv");
const STOP_FILE = join(homedir(), "godmode", "data", "stop-synthetic");
const SCREENSHOTS_DIR = join(RESULTS_DIR, "screenshots");
const BUGS_PATH = join(RESULTS_DIR, "bugs.jsonl");
const FEEDBACK_PATH = join(RESULTS_DIR, "feedback.jsonl");

const UI_BASE_URL = "http://localhost:5175";
const GATEWAY_HEALTH_URL = "http://localhost:3333/health";

// ── Parallel Groups ────────────────────────────────────────────────

const GROUPS = {
  A: ["marcus", "dr-mike", "frankie"],   // parallel
  B: ["diana", "sarah"],                  // parallel
  C: ["raj", "alex"],                     // sequential
};

// ── CLI Arg Parsing ────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { phase: "discovery", loops: 20, resume: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--phase" && args[i + 1]) {
      opts.phase = args[++i];
    } else if (args[i] === "--loops" && args[i + 1]) {
      opts.loops = parseInt(args[++i], 10);
    } else if (args[i] === "--resume") {
      opts.resume = true;
    }
  }

  if (!["discovery", "optimization"].includes(opts.phase)) {
    console.error(`[runner] Invalid phase: ${opts.phase}. Must be "discovery" or "optimization".`);
    process.exit(1);
  }

  return opts;
}

// ── Depth Level ────────────────────────────────────────────────────

function getDepthLevel(loopNum) {
  if (loopNum <= 5) return "happy_path";
  if (loopNum <= 10) return "edge_cases";
  if (loopNum <= 15) return "power_user";
  return "adversarial";
}

// ── Health Checks ──────────────────────────────────────────────────

async function checkHealth(url, label, timeoutMs = 5000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      console.log(`[runner] ${label} is healthy (${res.status})`);
      return true;
    }
    console.warn(`[runner] ${label} returned ${res.status}`);
    return false;
  } catch (err) {
    console.warn(`[runner] ${label} unreachable: ${err.message}`);
    return false;
  }
}

async function ensureServicesReady() {
  const gatewayOk = await checkHealth(GATEWAY_HEALTH_URL, "Gateway");
  const uiOk = await checkHealth(UI_BASE_URL, "UI dev server");

  if (!gatewayOk) {
    console.error("[runner] Gateway is not running. Start it with: pnpm dev (in the gateway repo)");
    console.error(`[runner] Expected health endpoint: ${GATEWAY_HEALTH_URL}`);
  }
  if (!uiOk) {
    console.error("[runner] UI dev server is not running. Start it with: pnpm dev:ui");
    console.error(`[runner] Expected at: ${UI_BASE_URL}`);
  }
  if (!gatewayOk || !uiOk) {
    process.exit(1);
  }
}

// ── Stop File Check ────────────────────────────────────────────────

function shouldStop() {
  if (existsSync(STOP_FILE)) {
    console.log(`[runner] Stop file detected: ${STOP_FILE}`);
    return true;
  }
  return false;
}

// ── State Persistence ──────────────────────────────────────────────

function loadState() {
  if (existsSync(STATE_PATH)) {
    try {
      return JSON.parse(readFileSync(STATE_PATH, "utf-8"));
    } catch {
      console.warn("[runner] Could not parse state file, starting fresh.");
    }
  }
  return { completedLoops: 0, allResults: [], phase: null };
}

function saveState(state) {
  ensureDir(RESULTS_DIR);
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

// ── TSV Logging ────────────────────────────────────────────────────

function initLog() {
  if (!existsSync(LOG_PATH)) {
    ensureDir(dirname(LOG_PATH));
    writeFileSync(
      LOG_PATH,
      "timestamp\tloop\tarchetype\tsurface\taction\tweighted\tbugs\terror\n",
      "utf-8",
    );
  }
}

function logEntry(entry) {
  const row = [
    new Date().toISOString(),
    entry.loop || "",
    entry.archetype || "",
    entry.surface || "",
    entry.action || "",
    entry.weighted ?? "",
    entry.bugs ?? 0,
    entry.error || "",
  ].join("\t");
  appendFileSync(LOG_PATH, row + "\n", "utf-8");
}

// ── Bug & Feedback Persistence ─────────────────────────────────────

function appendBug(bug, loopNum) {
  ensureDir(RESULTS_DIR);
  const entry = { ...bug, loop: loopNum, timestamp: new Date().toISOString() };
  appendFileSync(BUGS_PATH, JSON.stringify(entry) + "\n", "utf-8");
}

function appendFeedback(feedback, archetype, loopNum) {
  ensureDir(RESULTS_DIR);
  const entry = { feedback, archetype, loop: loopNum, timestamp: new Date().toISOString() };
  appendFileSync(FEEDBACK_PATH, JSON.stringify(entry) + "\n", "utf-8");
}

// ── Stagehand Factory ──────────────────────────────────────────────

// Resolve Playwright-installed Chrome (chrome-launcher may not find it)
function findChromePath() {
  const candidates = [
    // macOS standard
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // Playwright-installed Chrome for Testing
    join(homedir(), "Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  // Try to find any Playwright chromium
  const pwBase = join(homedir(), "Library/Caches/ms-playwright");
  if (existsSync(pwBase)) {
    try {
      for (const dir of readdirSync(pwBase).filter(d => d.startsWith("chromium-"))) {
        const macApp = join(pwBase, dir, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
        if (existsSync(macApp)) return macApp;
      }
    } catch {}
  }
  return undefined; // let chrome-launcher find it
}

const CHROME_PATH = findChromePath();

async function createStagehandInstance() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    model: "anthropic/claude-sonnet-4-6",
    localBrowserLaunchOptions: {
      headless: true,
      ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
    },
    verbose: 0, // suppress noisy logs
  });
  await stagehand.init();
  return stagehand;
}

// ── Stagehand Compat Wrapper ───────────────────────────────────────
// Stagehand v3 extract() signature: extract(instruction, zodSchema?, options?)
// Flow scripts use: stagehand.extract({ instruction, schema }) — bridge the gap.

function wrapStagehand(stagehand) {
  const origExtract = stagehand.extract.bind(stagehand);
  stagehand.extract = async function (a, b, c) {
    // If called with { instruction: string, schema?: object }, convert to v3 positional args
    if (a && typeof a === "object" && typeof a.instruction === "string") {
      return origExtract(a.instruction);
    }
    return origExtract(a, b, c);
  };
  return stagehand;
}

// ── Screenshot Helper ──────────────────────────────────────────────

function makeScreenshotter(page, loopNum, archetypeName) {
  const dir = join(SCREENSHOTS_DIR, `loop-${loopNum}`, archetypeName);
  ensureDir(dir);
  let idx = 0;

  return async function screenshot(label) {
    idx++;
    const filename = `${String(idx).padStart(3, "0")}-${label}.png`;
    const filepath = join(dir, filename);
    try {
      await page.screenshot({ path: filepath, fullPage: true });
    } catch (err) {
      console.warn(`[runner] Screenshot failed (${label}): ${err.message}`);
    }
    return filepath;
  };
}

// ── Flow Loading ───────────────────────────────────────────────────

const flowCache = new Map();

async function loadFlow(surfaceName) {
  if (flowCache.has(surfaceName)) return flowCache.get(surfaceName);

  const moduleFile = getFlowModule(surfaceName);
  if (!moduleFile) {
    console.warn(`[runner] No flow module for surface: ${surfaceName}`);
    return null;
  }

  const flowPath = join(CAMPAIGN_DIR, "flows", moduleFile);
  if (!existsSync(flowPath)) {
    console.warn(`[runner] Flow file not found: ${flowPath}`);
    return null;
  }

  try {
    const mod = await import(flowPath);
    const flow = mod.default || mod;
    flowCache.set(surfaceName, flow);
    return flow;
  } catch (err) {
    console.error(`[runner] Failed to load flow ${moduleFile}: ${err.message}`);
    return null;
  }
}

// ── Run Single Archetype ───────────────────────────────────────────

async function runArchetype(archetypeName, loopNum, judge) {
  const archetype = ALL_ARCHETYPES[archetypeName];
  if (!archetype) {
    console.error(`[runner] Unknown archetype: ${archetypeName}`);
    return { scores: [], bugs: [], feedback: [] };
  }

  const depthLevel = getDepthLevel(loopNum);
  const surfaces = getFlowsForLoop(archetypeName, loopNum);

  console.log(`[runner] ${archetypeName} loop ${loopNum} (${depthLevel}): surfaces = [${surfaces.join(", ")}]`);

  const result = { scores: [], bugs: [], feedback: [] };
  let stagehand;

  try {
    stagehand = wrapStagehand(await createStagehandInstance());
    const page = stagehand.context.pages()[0];

    // Set viewport
    if (archetype.viewport) {
      await page.setViewportSize(archetype.viewport);
    }

    const screenshot = makeScreenshotter(page, loopNum, archetypeName);

    // Navigate to UI base
    await page.goto(UI_BASE_URL, { waitUntil: "networkidle", timeout: 30000 });

    for (const surface of surfaces) {
      const flow = await loadFlow(surface);
      if (!flow) {
        console.warn(`[runner] Skipping surface ${surface} — no flow loaded`);
        continue;
      }

      console.log(`[runner]   ${archetypeName} -> ${surface}`);

      try {
        // Build a judge wrapper that injects archetype context
        const judgeForArchetype = async (action, pageState, screenshotPath) => {
          return judge(action, pageState, screenshotPath, archetype, depthLevel);
        };

        const flowResult = await flow({
          stagehand,
          page,
          archetype,
          depthLevel,
          loop: loopNum,
          judge: judgeForArchetype,
          screenshot,
          log: (entry) => {
            logEntry({
              loop: loopNum,
              archetype: archetypeName,
              surface,
              action: entry.action || "",
              weighted: entry.weighted || "",
              bugs: entry.bugs || 0,
              error: entry.error || "",
            });
          },
        });

        // Tag scores with surface for reporting
        if (flowResult.scores) {
          for (const s of flowResult.scores) {
            s.surface = surface;
          }
          result.scores.push(...flowResult.scores);
        }
        if (flowResult.bugs) {
          for (const b of flowResult.bugs) {
            b.surface = surface;
            b.archetype = archetypeName;
            appendBug(b, loopNum);
          }
          result.bugs.push(...flowResult.bugs);
        }
        if (flowResult.feedback) {
          for (const fb of flowResult.feedback) {
            appendFeedback(fb, archetypeName, loopNum);
          }
          result.feedback.push(...flowResult.feedback);
        }
      } catch (err) {
        console.error(`[runner]   ${archetypeName}/${surface} failed: ${err.message}`);
        const bug = {
          severity: "P1",
          description: `Flow ${surface} crashed: ${err.message}`,
          surface,
          archetype: archetypeName,
        };
        result.bugs.push(bug);
        appendBug(bug, loopNum);
        logEntry({
          loop: loopNum,
          archetype: archetypeName,
          surface,
          action: "flow-crash",
          error: err.message,
        });
      }
    }
  } catch (err) {
    console.error(`[runner] Stagehand init failed for ${archetypeName}: ${err.message}`);
    result.bugs.push({
      severity: "P0",
      description: `Stagehand initialization failed: ${err.message}`,
      archetype: archetypeName,
    });
  } finally {
    try {
      if (stagehand) await stagehand.close();
    } catch {}
  }

  return result;
}

// ── Run Group (parallel or sequential) ─────────────────────────────

async function runGroup(groupName, archetypeNames, loopNum, judge, sequential = false) {
  console.log(`[runner] Group ${groupName}: [${archetypeNames.join(", ")}] (${sequential ? "sequential" : "parallel"})`);

  if (sequential) {
    const results = {};
    for (const name of archetypeNames) {
      results[name] = await runArchetype(name, loopNum, judge);
    }
    return results;
  }

  // Parallel execution
  const entries = await Promise.allSettled(
    archetypeNames.map(async (name) => {
      const result = await runArchetype(name, loopNum, judge);
      return { name, result };
    }),
  );

  const results = {};
  for (const entry of entries) {
    if (entry.status === "fulfilled") {
      results[entry.value.name] = entry.value.result;
    } else {
      const name = "unknown";
      console.error(`[runner] Group ${groupName} archetype failed:`, entry.reason?.message);
      results[name] = { scores: [], bugs: [{ severity: "P0", description: entry.reason?.message || "Unknown error" }], feedback: [] };
    }
  }
  return results;
}

// ── Discovery Phase ────────────────────────────────────────────────

async function runDiscoveryPhase(totalLoops, startLoop, state, judge) {
  const allResults = state.allResults || [];

  for (let loop = startLoop; loop <= totalLoops; loop++) {
    if (shouldStop()) {
      console.log("[runner] Stop requested. Saving state and exiting.");
      break;
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`[runner] DISCOVERY LOOP ${loop}/${totalLoops} (depth: ${getDepthLevel(loop)})`);
    console.log(`${"=".repeat(60)}\n`);

    const loopResults = { archetypes: {} };

    // Run all 3 groups in parallel
    const [groupA, groupB, groupC] = await Promise.all([
      runGroup("A", GROUPS.A, loop, judge, false),
      runGroup("B", GROUPS.B, loop, judge, false),
      runGroup("C", GROUPS.C, loop, judge, true), // sequential
    ]);

    // Merge results
    Object.assign(loopResults.archetypes, groupA, groupB, groupC);

    // Aggregate scores for scoreboard
    const scoresByArchetype = {};
    for (const [name, data] of Object.entries(loopResults.archetypes)) {
      if (data.scores && data.scores.length > 0) {
        const avg = {};
        for (const s of data.scores) {
          if (s.scores) {
            for (const [k, v] of Object.entries(s.scores)) {
              if (!avg[k]) avg[k] = { sum: 0, count: 0 };
              avg[k].sum += v;
              avg[k].count += 1;
            }
          }
        }
        scoresByArchetype[name] = {};
        for (const [k, v] of Object.entries(avg)) {
          scoresByArchetype[name][k] = Math.round((v.sum / v.count) * 10) / 10;
        }
      }
    }

    // Write reports
    try {
      generateLoopSummary(loop, loopResults);
      appendToScoreboard(loop, scoresByArchetype);
    } catch (err) {
      console.error(`[runner] Report generation failed for loop ${loop}: ${err.message}`);
    }

    // Update state
    allResults.push(loopResults);
    state.completedLoops = loop;
    state.allResults = allResults;
    state.phase = "discovery";
    saveState(state);

    console.log(`[runner] Loop ${loop} complete. Bugs: ${Object.values(loopResults.archetypes).reduce((s, a) => s + (a.bugs?.length || 0), 0)}`);
  }

  return allResults;
}

// ── Optimization Phase ─────────────────────────────────────────────

async function runOptimizationPhase(totalLoops, startLoop, state, judge) {
  for (let loop = startLoop; loop <= totalLoops; loop++) {
    if (shouldStop()) {
      console.log("[runner] Stop requested. Saving state and exiting.");
      break;
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`[runner] OPTIMIZATION LOOP ${loop}/${totalLoops}`);
    console.log(`${"=".repeat(60)}\n`);

    // Load accumulated bugs and feedback
    const bugs = loadJsonl(BUGS_PATH);
    const feedback = loadJsonl(FEEDBACK_PATH);

    // Create a test runner function the optimizer can use
    const runTest = async (archetypeName, surfaceName) => {
      const flow = await loadFlow(surfaceName);
      if (!flow) return null;

      let stagehand;
      try {
        stagehand = wrapStagehand(await createStagehandInstance());
        const page = stagehand.context.pages()[0];
        const archetype = ALL_ARCHETYPES[archetypeName];
        if (!archetype) return null;

        if (archetype.viewport) await page.setViewportSize(archetype.viewport);
        await page.goto(UI_BASE_URL, { waitUntil: "networkidle", timeout: 30000 });

        const screenshot = makeScreenshotter(page, `opt-${loop}`, archetypeName);
        const depthLevel = "happy_path"; // optimization always re-tests on happy path

        const judgeForArchetype = async (action, pageState, screenshotPath) => {
          return judge(action, pageState, screenshotPath, archetype, depthLevel);
        };

        return await flow({
          stagehand,
          page,
          archetype,
          depthLevel,
          loop,
          judge: judgeForArchetype,
          screenshot,
          log: (entry) => logEntry({ loop: `opt-${loop}`, archetype: archetypeName, surface: surfaceName, ...entry }),
        });
      } catch (err) {
        console.error(`[runner] Optimization re-test failed (${archetypeName}/${surfaceName}): ${err.message}`);
        return null;
      } finally {
        try { if (stagehand) await stagehand.close(); } catch {}
      }
    };

    try {
      await runOptimizationLoop(loop, bugs, feedback, runTest);
    } catch (err) {
      console.error(`[runner] Optimization loop ${loop} failed: ${err.message}`);
    }

    state.completedLoops = loop;
    state.phase = "optimization";
    saveState(state);
  }
}

// ── Helpers ────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadJsonl(path) {
  if (!existsSync(path)) return [];
  try {
    return readFileSync(path, "utf-8")
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        try { return JSON.parse(l); } catch { return null; }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  loadGodModeEnv();
  const opts = parseArgs();

  console.log(`[runner] Synthetic User Campaign`);
  console.log(`[runner] Phase: ${opts.phase}, Loops: ${opts.loops}, Resume: ${opts.resume}`);

  // Resolve API key
  const resolved = resolveAnthropicKey();
  if (!resolved) {
    console.error("[runner] No Anthropic API key found. Cannot proceed.");
    process.exit(1);
  }
  console.log(`[runner] API key source: ${resolved.source}`);

  // Ensure output directories
  ensureDir(RESULTS_DIR);
  ensureDir(SCREENSHOTS_DIR);
  ensureDir(join(RESULTS_DIR, "loop-summaries"));
  ensureDir(join(RESULTS_DIR, "scores"));
  initLog();

  // Check stop file
  if (shouldStop()) {
    console.log("[runner] Stop file exists. Remove it to continue:");
    console.log(`  rm "${STOP_FILE}"`);
    process.exit(0);
  }

  // Health checks
  await ensureServicesReady();

  // Load state
  let state = opts.resume ? loadState() : { completedLoops: 0, allResults: [], phase: null };
  const startLoop = state.completedLoops + 1;

  if (startLoop > opts.loops) {
    console.log(`[runner] All ${opts.loops} loops already completed.`);
    if (state.allResults?.length > 0) {
      generateConsolidatedReport(state.allResults);
    }
    return;
  }

  console.log(`[runner] Starting from loop ${startLoop}`);

  // Initialize judge
  const judge = await createJudge();
  if (!judge) {
    console.error("[runner] Could not create judge. Exiting.");
    process.exit(1);
  }

  // Run phase
  if (opts.phase === "discovery") {
    const allResults = await runDiscoveryPhase(opts.loops, startLoop, state, judge);
    if (allResults.length > 0) {
      console.log("\n[runner] Generating final consolidated report...");
      generateConsolidatedReport(allResults);
    }
  } else {
    await runOptimizationPhase(opts.loops, startLoop, state, judge);
  }

  console.log("\n[runner] Campaign complete.");
}

main().catch((err) => {
  console.error("[runner] Fatal error:", err);
  process.exit(1);
});
