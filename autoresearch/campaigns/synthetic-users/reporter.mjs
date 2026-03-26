/**
 * reporter.mjs — Consolidated Report Generator for Synthetic User Campaign.
 *
 * Generates per-loop summaries, cumulative scoreboards, and final reports
 * from collected judge scores, bugs, and feedback.
 */

import { writeFileSync, appendFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { DIMENSIONS } from "./judge.mjs";

// ── Paths ──────────────────────────────────────────────────────────

const PROJECT_ROOT = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const RESULTS_DIR = join(PROJECT_ROOT, "results", "synthetic-users");
const LOOP_SUMMARIES_DIR = join(RESULTS_DIR, "loop-summaries");
const SCORES_DIR = join(RESULTS_DIR, "scores");
const SCOREBOARD_PATH = join(SCORES_DIR, "cumulative-scoreboard.tsv");
const FINAL_REPORT_PATH = join(RESULTS_DIR, "final-report.md");

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ── Loop Summary ───────────────────────────────────────────────────

/**
 * Generate a markdown summary for a single loop.
 *
 * @param {number} loopNum - 1-based loop number
 * @param {object} results - { archetypes: { [name]: { scores: [], bugs: [], feedback: [] } } }
 * @returns {string} - Path to written summary file
 */
export function generateLoopSummary(loopNum, results) {
  ensureDir(LOOP_SUMMARIES_DIR);
  const ts = new Date().toISOString();
  const depthLevel = getDepthForLoop(loopNum);

  const lines = [];
  lines.push(`# Loop ${loopNum} Summary`);
  lines.push(`Generated: ${ts}`);
  lines.push(`Depth: ${depthLevel}`);
  lines.push("");

  // Per-archetype scores
  lines.push("## Per-Archetype Scores");
  lines.push("");
  lines.push(`| Archetype | ${DIMENSIONS.map((d) => d.key).join(" | ")} | Weighted |`);
  lines.push(`| --- | ${DIMENSIONS.map(() => "---").join(" | ")} | --- |`);

  const archetypeNames = Object.keys(results.archetypes || {});
  for (const name of archetypeNames) {
    const data = results.archetypes[name];
    const avgScores = averageScores(data.scores || []);
    const weighted = calculateWeighted(avgScores);
    const cells = DIMENSIONS.map((d) => (avgScores[d.key] ?? "-").toString());
    lines.push(`| ${name} | ${cells.join(" | ")} | ${weighted} |`);
  }
  lines.push("");

  // Per-surface scores
  lines.push("## Per-Surface Scores");
  lines.push("");
  const surfaceScores = aggregateBySurface(results);
  if (Object.keys(surfaceScores).length > 0) {
    lines.push(`| Surface | Avg Weighted | Interactions |`);
    lines.push(`| --- | --- | --- |`);
    for (const [surface, data] of Object.entries(surfaceScores)) {
      lines.push(`| ${surface} | ${data.avgWeighted} | ${data.count} |`);
    }
  } else {
    lines.push("No per-surface data available.");
  }
  lines.push("");

  // Bugs
  lines.push("## Bugs Found");
  lines.push("");
  const allBugs = collectAllBugs(results);
  const bugsByLevel = { P0: [], P1: [], P2: [], P3: [] };
  for (const bug of allBugs) {
    const sev = bug.severity || "P3";
    (bugsByLevel[sev] || bugsByLevel.P3).push(bug);
  }

  lines.push(`| Severity | Count |`);
  lines.push(`| --- | --- |`);
  for (const sev of ["P0", "P1", "P2", "P3"]) {
    lines.push(`| ${sev} | ${bugsByLevel[sev].length} |`);
  }
  lines.push("");

  if (allBugs.length > 0) {
    lines.push("### Bug Details");
    lines.push("");
    for (const bug of allBugs) {
      lines.push(`- **[${bug.severity}]** ${bug.description}${bug.action ? ` (during: ${bug.action})` : ""}`);
    }
    lines.push("");
  }

  // Top friction points
  lines.push("## Top Friction Points");
  lines.push("");
  const frictionPoints = identifyFrictionPoints(results);
  if (frictionPoints.length > 0) {
    for (const fp of frictionPoints.slice(0, 5)) {
      lines.push(`1. **${fp.dimension}** (avg ${fp.score}/10): ${fp.note}`);
    }
  } else {
    lines.push("No significant friction points identified.");
  }
  lines.push("");

  // Feedback
  lines.push("## Feedback");
  lines.push("");
  const allFeedback = collectAllFeedback(results);
  for (const fb of allFeedback.slice(0, 10)) {
    lines.push(`> ${fb}`);
    lines.push("");
  }

  // Screenshot references
  lines.push("## Screenshots");
  lines.push("");
  lines.push(`Screenshots stored in: \`${join(RESULTS_DIR, "screenshots", `loop-${loopNum}`)}\``);
  lines.push("");

  const content = lines.join("\n");
  const outPath = join(LOOP_SUMMARIES_DIR, `loop-${String(loopNum).padStart(3, "0")}.md`);
  writeFileSync(outPath, content, "utf-8");
  console.log(`[reporter] Loop ${loopNum} summary written to ${outPath}`);
  return outPath;
}

// ── Cumulative Scoreboard ──────────────────────────────────────────

/**
 * Append loop scores to the cumulative TSV scoreboard.
 *
 * @param {number} loopNum
 * @param {Record<string, object>} scores - { archetypeName: { flow_state: N, ... } }
 */
export function appendToScoreboard(loopNum, scores) {
  ensureDir(SCORES_DIR);

  const headerNeeded = !existsSync(SCOREBOARD_PATH);
  const dimKeys = DIMENSIONS.map((d) => d.key);

  if (headerNeeded) {
    const header = ["loop", "archetype", ...dimKeys, "weighted", "timestamp"].join("\t");
    writeFileSync(SCOREBOARD_PATH, header + "\n", "utf-8");
  }

  const ts = new Date().toISOString();
  for (const [archetype, dimScores] of Object.entries(scores)) {
    const weighted = calculateWeighted(dimScores);
    const row = [
      loopNum,
      archetype,
      ...dimKeys.map((k) => dimScores[k] ?? ""),
      weighted,
      ts,
    ].join("\t");
    appendFileSync(SCOREBOARD_PATH, row + "\n", "utf-8");
  }

  console.log(`[reporter] Scoreboard updated for loop ${loopNum}`);
}

// ── Consolidated Final Report ──────────────────────────────────────

/**
 * Generate the final consolidated report across all loops.
 *
 * @param {object[]} allResults - Array of per-loop result objects
 * @returns {string} - Path to final-report.md
 */
export function generateConsolidatedReport(allResults) {
  ensureDir(RESULTS_DIR);
  const ts = new Date().toISOString();

  const lines = [];
  lines.push("# Synthetic User Testing — Final Report");
  lines.push(`Generated: ${ts}`);
  lines.push(`Total loops: ${allResults.length}`);
  lines.push("");

  // Executive summary
  lines.push("## Executive Summary");
  lines.push("");
  const globalAvg = computeGlobalAverages(allResults);
  const totalBugs = allResults.reduce((sum, r) => sum + collectAllBugs(r).length, 0);
  const p0Bugs = allResults.reduce(
    (sum, r) => sum + collectAllBugs(r).filter((b) => b.severity === "P0").length,
    0,
  );
  const p1Bugs = allResults.reduce(
    (sum, r) => sum + collectAllBugs(r).filter((b) => b.severity === "P1").length,
    0,
  );

  lines.push(`- **Overall Weighted Score:** ${globalAvg.weighted}/10`);
  lines.push(`- **Total Bugs Found:** ${totalBugs} (P0: ${p0Bugs}, P1: ${p1Bugs})`);
  lines.push(`- **Strongest Dimension:** ${globalAvg.strongest.key} (${globalAvg.strongest.score}/10)`);
  lines.push(`- **Weakest Dimension:** ${globalAvg.weakest.key} (${globalAvg.weakest.score}/10)`);
  lines.push("");

  // Dimension breakdown
  lines.push("## Dimension Breakdown");
  lines.push("");
  lines.push(`| Dimension | Weight | Avg Score | Trend |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const dim of DIMENSIONS) {
    const avg = globalAvg.dimensions[dim.key] ?? 0;
    const trend = computeTrend(allResults, dim.key);
    lines.push(`| ${dim.key} | ${(dim.weight * 100).toFixed(0)}% | ${avg}/10 | ${trend} |`);
  }
  lines.push("");

  // Per-archetype summary
  lines.push("## Per-Archetype Performance");
  lines.push("");
  const archetypeAverages = computePerArchetypeAverages(allResults);
  lines.push(`| Archetype | Weighted Avg | Loops | Bugs |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const [name, data] of Object.entries(archetypeAverages)) {
    lines.push(`| ${name} | ${data.weighted}/10 | ${data.loops} | ${data.bugs} |`);
  }
  lines.push("");

  // Per-surface summary
  lines.push("## Per-Surface Performance");
  lines.push("");
  const surfaceAverages = computePerSurfaceAverages(allResults);
  lines.push(`| Surface | Avg Weighted | Interactions |`);
  lines.push(`| --- | --- | --- |`);
  for (const [surface, data] of Object.entries(surfaceAverages)) {
    lines.push(`| ${surface} | ${data.avgWeighted}/10 | ${data.count} |`);
  }
  lines.push("");

  // Bug catalog
  lines.push("## Bug Catalog");
  lines.push("");
  const dedupedBugs = deduplicateBugs(allResults);
  for (const sev of ["P0", "P1", "P2", "P3"]) {
    const bugs = dedupedBugs.filter((b) => b.severity === sev);
    if (bugs.length > 0) {
      lines.push(`### ${sev} Bugs (${bugs.length})`);
      lines.push("");
      for (const bug of bugs) {
        lines.push(`- ${bug.description}${bug.occurrences > 1 ? ` (x${bug.occurrences})` : ""}`);
      }
      lines.push("");
    }
  }

  // Trend data
  lines.push("## Score Trends Over Loops");
  lines.push("");
  lines.push(`| Loop | ${DIMENSIONS.map((d) => d.key).join(" | ")} | Weighted |`);
  lines.push(`| --- | ${DIMENSIONS.map(() => "---").join(" | ")} | --- |`);
  for (let i = 0; i < allResults.length; i++) {
    const avg = computeLoopAverage(allResults[i]);
    const cells = DIMENSIONS.map((d) => (avg[d.key] ?? "-").toString());
    const weighted = calculateWeighted(avg);
    lines.push(`| ${i + 1} | ${cells.join(" | ")} | ${weighted} |`);
  }
  lines.push("");

  // Screenshot gallery references
  lines.push("## Screenshot Gallery");
  lines.push("");
  lines.push(`All screenshots stored in: \`${join(RESULTS_DIR, "screenshots")}\``);
  lines.push("");
  for (let i = 0; i < allResults.length; i++) {
    lines.push(`- Loop ${i + 1}: \`screenshots/loop-${i + 1}/\``);
  }
  lines.push("");

  const content = lines.join("\n");
  writeFileSync(FINAL_REPORT_PATH, content, "utf-8");
  console.log(`[reporter] Final report written to ${FINAL_REPORT_PATH}`);
  return FINAL_REPORT_PATH;
}

// ── Internal Helpers ───────────────────────────────────────────────

function getDepthForLoop(loopNum) {
  if (loopNum <= 5) return "happy_path";
  if (loopNum <= 10) return "edge_cases";
  if (loopNum <= 15) return "power_user";
  return "adversarial";
}

function averageScores(scoresList) {
  if (!scoresList || scoresList.length === 0) return {};
  const sums = {};
  const counts = {};

  for (const entry of scoresList) {
    const scores = entry.scores || entry;
    for (const dim of DIMENSIONS) {
      const val = scores[dim.key];
      if (typeof val === "number") {
        sums[dim.key] = (sums[dim.key] || 0) + val;
        counts[dim.key] = (counts[dim.key] || 0) + 1;
      }
    }
  }

  const avg = {};
  for (const dim of DIMENSIONS) {
    avg[dim.key] = counts[dim.key]
      ? Math.round((sums[dim.key] / counts[dim.key]) * 10) / 10
      : 0;
  }
  return avg;
}

function calculateWeighted(scores) {
  if (!scores) return 0;
  const w = DIMENSIONS.reduce((sum, dim) => {
    const val = scores[dim.key];
    return sum + (typeof val === "number" ? val : 0) * dim.weight;
  }, 0);
  return Math.round(w * 100) / 100;
}

function collectAllBugs(results) {
  const bugs = [];
  for (const arch of Object.values(results.archetypes || {})) {
    if (Array.isArray(arch.bugs)) {
      bugs.push(...arch.bugs);
    }
  }
  return bugs;
}

function collectAllFeedback(results) {
  const feedback = [];
  for (const arch of Object.values(results.archetypes || {})) {
    if (Array.isArray(arch.feedback)) {
      feedback.push(...arch.feedback);
    }
    // Also collect feedback from individual judge results
    if (Array.isArray(arch.scores)) {
      for (const s of arch.scores) {
        if (s.feedback) feedback.push(s.feedback);
      }
    }
  }
  return feedback;
}

function aggregateBySurface(results) {
  const surfaces = {};
  for (const arch of Object.values(results.archetypes || {})) {
    if (Array.isArray(arch.scores)) {
      for (const s of arch.scores) {
        const surface = s.surface || "unknown";
        if (!surfaces[surface]) surfaces[surface] = { totalWeighted: 0, count: 0 };
        surfaces[surface].totalWeighted += s.weighted || 0;
        surfaces[surface].count += 1;
      }
    }
  }
  const out = {};
  for (const [name, data] of Object.entries(surfaces)) {
    out[name] = {
      avgWeighted: Math.round((data.totalWeighted / data.count) * 100) / 100,
      count: data.count,
    };
  }
  return out;
}

function identifyFrictionPoints(results) {
  const allScores = [];
  for (const arch of Object.values(results.archetypes || {})) {
    if (Array.isArray(arch.scores)) allScores.push(...arch.scores);
  }

  const avg = averageScores(allScores);
  const points = DIMENSIONS.map((dim) => ({
    dimension: dim.key,
    score: avg[dim.key] || 0,
    note: avg[dim.key] < 5 ? "Significantly below baseline" : avg[dim.key] < 7 ? "Below target" : "Acceptable",
  }));

  return points.sort((a, b) => a.score - b.score);
}

function computeGlobalAverages(allResults) {
  const allScores = [];
  for (const result of allResults) {
    for (const arch of Object.values(result.archetypes || {})) {
      if (Array.isArray(arch.scores)) allScores.push(...arch.scores);
    }
  }

  const avg = averageScores(allScores);
  const weighted = calculateWeighted(avg);

  let strongest = { key: "unknown", score: 0 };
  let weakest = { key: "unknown", score: 10 };
  for (const dim of DIMENSIONS) {
    const val = avg[dim.key] || 0;
    if (val > strongest.score) strongest = { key: dim.key, score: val };
    if (val < weakest.score) weakest = { key: dim.key, score: val };
  }

  return { dimensions: avg, weighted, strongest, weakest };
}

function computeTrend(allResults, dimKey) {
  if (allResults.length < 2) return "—";
  const first = computeLoopAverage(allResults[0]);
  const last = computeLoopAverage(allResults[allResults.length - 1]);
  const delta = (last[dimKey] || 0) - (first[dimKey] || 0);
  if (delta > 0.5) return `+${delta.toFixed(1)}`;
  if (delta < -0.5) return delta.toFixed(1);
  return "flat";
}

function computeLoopAverage(result) {
  const allScores = [];
  for (const arch of Object.values(result.archetypes || {})) {
    if (Array.isArray(arch.scores)) allScores.push(...arch.scores);
  }
  return averageScores(allScores);
}

function computePerArchetypeAverages(allResults) {
  const out = {};
  for (const result of allResults) {
    for (const [name, arch] of Object.entries(result.archetypes || {})) {
      if (!out[name]) out[name] = { allScores: [], bugs: 0, loops: 0 };
      if (Array.isArray(arch.scores)) out[name].allScores.push(...arch.scores);
      if (Array.isArray(arch.bugs)) out[name].bugs += arch.bugs.length;
      out[name].loops += 1;
    }
  }

  const summary = {};
  for (const [name, data] of Object.entries(out)) {
    const avg = averageScores(data.allScores);
    summary[name] = {
      weighted: calculateWeighted(avg),
      loops: data.loops,
      bugs: data.bugs,
    };
  }
  return summary;
}

function computePerSurfaceAverages(allResults) {
  const surfaces = {};
  for (const result of allResults) {
    const byS = aggregateBySurface(result);
    for (const [name, data] of Object.entries(byS)) {
      if (!surfaces[name]) surfaces[name] = { totalWeighted: 0, count: 0 };
      surfaces[name].totalWeighted += data.avgWeighted * data.count;
      surfaces[name].count += data.count;
    }
  }
  const out = {};
  for (const [name, data] of Object.entries(surfaces)) {
    out[name] = {
      avgWeighted: data.count > 0 ? Math.round((data.totalWeighted / data.count) * 100) / 100 : 0,
      count: data.count,
    };
  }
  return out;
}

function deduplicateBugs(allResults) {
  const bugMap = new Map();
  for (const result of allResults) {
    const bugs = collectAllBugs(result);
    for (const bug of bugs) {
      const key = `${bug.severity}:${bug.description}`;
      if (bugMap.has(key)) {
        bugMap.get(key).occurrences += 1;
      } else {
        bugMap.set(key, { ...bug, occurrences: 1 });
      }
    }
  }
  return [...bugMap.values()].sort((a, b) => {
    const sevOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4) || b.occurrences - a.occurrences;
  });
}
