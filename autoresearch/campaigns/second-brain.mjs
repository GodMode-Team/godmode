/**
 * Autoresearch Campaign: Second Brain Vault Optimization
 *
 * Audits and improves the Obsidian vault system's integration with
 * Mem0 and the identity graph. Measures capture quality, organization,
 * noise ratio, and cross-system coherence.
 *
 * Unlike parameter-tuning campaigns, this one:
 *   1. Scores vault health (inbox bloat, stale files, coverage gaps)
 *   2. Scores memory integration (Mem0 ↔ vault ↔ identity graph coherence)
 *   3. Uses LLM-as-judge (Sonnet 4.6) to evaluate organization quality
 *   4. Applies fixes (archival, cleanup, restructuring) and re-scores
 *
 * Usage: node autoresearch/campaigns/second-brain.mjs [--iterations N] [--fix]
 *
 * --fix: Actually apply fixes (archive stale inbox, clean old daily notes).
 *        Without --fix, it's audit-only.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync, statSync, mkdirSync, renameSync, copyFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, "..", "..");
const LOG_PATH = join(__dirname, "second-brain-log.tsv");
const ENV_PATH = join(homedir(), ".openclaw", ".env");
const AUTH_PROFILES_PATH = join(homedir(), ".openclaw", "auth-profiles.json");

// ── Vault Resolution ────────────────────────────────────────────────

function resolveVaultPath() {
  if (process.env.OBSIDIAN_VAULT_PATH) return process.env.OBSIDIAN_VAULT_PATH;
  const defaultVault = join(homedir(), "Documents", "VAULT");
  if (existsSync(defaultVault) && statSync(defaultVault).isDirectory()) return defaultVault;
  return null;
}

const GODMODE_DATA = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "data");
const GODMODE_MEMORY = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "memory");

// ── CLI ─────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let iterations = 1;
  let fix = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--iterations" && args[i + 1]) {
      iterations = parseInt(args[i + 1], 10) || 1;
    }
    if (args[i] === "--fix") fix = true;
  }
  return { iterations, fix };
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
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function loadAnthropicKey() {
  const env = loadEnv();
  if (env.ANTHROPIC_API_KEY) return env.ANTHROPIC_API_KEY;
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const profiles = JSON.parse(readFileSync(AUTH_PROFILES_PATH, "utf-8"));
    if (profiles?.profiles?.["anthropic:oauth"]?.token) return profiles.profiles["anthropic:oauth"].token;
  } catch { /* */ }
  return null;
}

// ── Utility ─────────────────────────────────────────────────────────

function countMdFiles(dir) {
  if (!existsSync(dir)) return 0;
  try {
    return readdirSync(dir).filter(f => f.endsWith(".md")).length;
  } catch { return 0; }
}

function getFilesWithAge(dir, maxAge = Infinity) {
  if (!existsSync(dir)) return [];
  const now = Date.now();
  const cutoff = now - maxAge;
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith(".md"))
      .map(f => {
        const path = join(dir, f);
        const stat = statSync(path);
        return { name: f, path, mtime: stat.mtimeMs, age: now - stat.mtimeMs };
      })
      .filter(f => f.mtime >= cutoff);
  } catch { return []; }
}

function daysBetween(ms) {
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// ═════════════════════════════════════════════════════════════════════
// SCORING DIMENSIONS
// ═════════════════════════════════════════════════════════════════════

// ── 1. Vault Health Score ───────────────────────────────────────────
// Measures: inbox bloat, daily note coverage, brain coverage,
//           archive usage, stale file ratio

function scoreVaultHealth(vault) {
  const scores = {};
  let total = 0;
  let count = 0;

  // 1a. Inbox bloat — fewer unprocessed items = better
  const inboxCount = countMdFiles(join(vault, "00-Inbox"));
  // Score: 1.0 at 0 items, 0.0 at 200+ items
  scores.inbox_bloat = Math.max(0, 1 - (inboxCount / 200));
  total += scores.inbox_bloat;
  count++;

  // 1b. Daily note freshness — recent notes should exist
  const dailyDir = join(vault, "01-Daily");
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const hasTodayNote = existsSync(join(dailyDir, `${today}.md`));
  const hasYesterdayNote = existsSync(join(dailyDir, `${yesterday}.md`));
  scores.daily_freshness = (hasTodayNote ? 0.6 : 0) + (hasYesterdayNote ? 0.4 : 0);
  total += scores.daily_freshness;
  count++;

  // 1c. Brain coverage — people, companies, knowledge should have content
  const peopleCount = countMdFiles(join(vault, "06-Brain", "People"));
  const companiesCount = countMdFiles(join(vault, "06-Brain", "Companies"));
  const knowledgeCount = countMdFiles(join(vault, "06-Brain", "Knowledge"));
  // Score: 1.0 if each has 5+ entries, pro-rated
  scores.brain_coverage = Math.min(1, (
    Math.min(peopleCount, 10) / 10 * 0.4 +
    Math.min(companiesCount, 5) / 5 * 0.3 +
    Math.min(knowledgeCount, 5) / 5 * 0.3
  ));
  total += scores.brain_coverage;
  count++;

  // 1d. Identity completeness — key files should exist
  const identityFiles = ["USER.md", "SOUL.md", "VISION.md"];
  const identityPresent = identityFiles.filter(f => existsSync(join(vault, "08-Identity", f))).length;
  scores.identity_completeness = identityPresent / identityFiles.length;
  total += scores.identity_completeness;
  count++;

  // 1e. Archive usage — are old items being moved?
  const archiveCount = countMdFiles(join(vault, "05-Archive"));
  // Score: higher if archive is being used (sign of active maintenance)
  scores.archive_usage = Math.min(1, archiveCount / 10);
  total += scores.archive_usage * 0.5; // lower weight
  count += 0.5;

  scores.combined = total / count;
  return { scores, details: { inboxCount, peopleCount, companiesCount, knowledgeCount, archiveCount } };
}

// ── 2. Capture Completeness ─────────────────────────────────────────
// Measures: are agent sessions being captured? Are queue outputs flowing?

function scoreCaptureCompleteness(vault) {
  const scores = {};
  let total = 0;
  let count = 0;

  // 2a. Session capture — agent-log mirrors should exist for recent days
  const agentLogDir = join(vault, "07-Agent-Log");
  const recentDays = 3;
  let recentCaptures = 0;
  for (let i = 0; i < recentDays; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (existsSync(join(agentLogDir, `${date}.md`))) recentCaptures++;
  }
  scores.session_capture = recentCaptures / recentDays;
  total += scores.session_capture;
  count++;

  // 2b. Queue output flow — local inbox → vault inbox
  const localInbox = join(GODMODE_MEMORY, "inbox");
  const vaultInbox = join(vault, "00-Inbox");
  const localCount = countMdFiles(localInbox);
  const vaultCount = countMdFiles(vaultInbox);
  // Score: what fraction of local items made it to vault?
  scores.queue_capture = localCount > 0 ? Math.min(1, vaultCount / localCount) : 1;
  total += scores.queue_capture;
  count++;

  // 2c. Capture state freshness
  const statePath = join(GODMODE_DATA, "vault-capture-state.json");
  if (existsSync(statePath)) {
    try {
      const state = JSON.parse(readFileSync(statePath, "utf-8"));
      const lastRun = new Date(state.lastRun).getTime();
      const hoursSinceLastRun = (Date.now() - lastRun) / (1000 * 60 * 60);
      scores.capture_recency = hoursSinceLastRun < 1 ? 1 : hoursSinceLastRun < 4 ? 0.7 : hoursSinceLastRun < 24 ? 0.3 : 0;
    } catch {
      scores.capture_recency = 0;
    }
  } else {
    scores.capture_recency = 0;
  }
  total += scores.capture_recency;
  count++;

  scores.combined = total / count;
  return { scores, details: { recentCaptures, localCount, vaultCount } };
}

// ── 3. Memory Integration Score ─────────────────────────────────────
// Measures: do Mem0 facts, identity graph entities, and vault files agree?

function scoreMemoryIntegration(vault) {
  const scores = {};
  let total = 0;
  let count = 0;

  // 3a. Identity graph ↔ vault people alignment
  const graphDbPath = join(GODMODE_DATA, "identity-graph.db");
  let graphEntities = 0;
  let graphEdges = 0;
  if (existsSync(graphDbPath)) {
    try {
      // Use dynamic import for better-sqlite3 to check graph stats
      const entityCount = execSync(`sqlite3 "${graphDbPath}" "SELECT COUNT(*) FROM entities;"`, { encoding: "utf-8" }).trim();
      const edgeCount = execSync(`sqlite3 "${graphDbPath}" "SELECT COUNT(*) FROM edges;"`, { encoding: "utf-8" }).trim();
      graphEntities = parseInt(entityCount) || 0;
      graphEdges = parseInt(edgeCount) || 0;
    } catch { /* sqlite3 may not be available */ }
  }

  // Score: graph should have entities — more = better understanding
  scores.graph_density = Math.min(1, graphEntities / 50);
  total += scores.graph_density;
  count++;

  // Score: graph should have relationships — ratio of edges to entities
  scores.graph_connectedness = graphEntities > 0 ? Math.min(1, graphEdges / (graphEntities * 1.5)) : 0;
  total += scores.graph_connectedness;
  count++;

  // 3b. Vault people ↔ graph people overlap
  const vaultPeople = existsSync(join(vault, "06-Brain", "People"))
    ? readdirSync(join(vault, "06-Brain", "People")).filter(f => f.endsWith(".md")).map(f => basename(f, ".md").toLowerCase())
    : [];

  if (graphEntities > 0 && vaultPeople.length > 0) {
    try {
      const graphNames = execSync(`sqlite3 "${graphDbPath}" "SELECT LOWER(name) FROM entities WHERE kind='person' LIMIT 100;"`, { encoding: "utf-8" })
        .trim().split("\n").filter(Boolean);

      let overlap = 0;
      for (const vp of vaultPeople) {
        const normalized = vp.replace(/-/g, " ");
        if (graphNames.some(gn => gn.includes(normalized) || normalized.includes(gn))) overlap++;
      }
      scores.people_coherence = vaultPeople.length > 0 ? overlap / vaultPeople.length : 0;
    } catch {
      scores.people_coherence = 0.5; // can't measure, assume moderate
    }
  } else {
    scores.people_coherence = vaultPeople.length > 0 || graphEntities > 0 ? 0.3 : 0;
  }
  total += scores.people_coherence;
  count++;

  // 3c. Mem0 health
  const mem0DbPath = join(GODMODE_DATA, "mem0-vectors.db");
  scores.mem0_available = existsSync(mem0DbPath) ? 1 : 0;
  total += scores.mem0_available;
  count++;

  scores.combined = total / count;
  return { scores, details: { graphEntities, graphEdges, vaultPeople: vaultPeople.length } };
}

// ── 4. Noise Ratio Score ────────────────────────────────────────────
// Measures: what fraction of inbox items are stale (>7 days old)?

function scoreNoiseRatio(vault) {
  const inboxDir = join(vault, "00-Inbox");
  if (!existsSync(inboxDir)) return { scores: { noise_ratio: 1 }, details: {} };

  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  let total = 0;
  let stale7d = 0;
  let stale30d = 0;

  try {
    for (const f of readdirSync(inboxDir).filter(f => f.endsWith(".md"))) {
      const stat = statSync(join(inboxDir, f));
      const age = now - stat.mtimeMs;
      total++;
      if (age > sevenDays) stale7d++;
      if (age > thirtyDays) stale30d++;
    }
  } catch { /* */ }

  // Score: lower noise = better. 0 stale items = 1.0
  const freshRatio = total > 0 ? 1 - (stale7d / total) : 1;

  return {
    scores: { noise_ratio: freshRatio, combined: freshRatio },
    details: { total, stale7d, stale30d },
  };
}

// ═════════════════════════════════════════════════════════════════════
// FIX ACTIONS
// ═════════════════════════════════════════════════════════════════════

function archiveStaleInbox(vault, maxAgeDays = 30) {
  const inboxDir = join(vault, "00-Inbox");
  const archiveDir = join(vault, "05-Archive", "inbox");
  if (!existsSync(inboxDir)) return 0;

  mkdirSync(archiveDir, { recursive: true });

  const now = Date.now();
  const cutoff = maxAgeDays * 24 * 60 * 60 * 1000;
  let moved = 0;

  for (const f of readdirSync(inboxDir).filter(f => f.endsWith(".md"))) {
    try {
      const stat = statSync(join(inboxDir, f));
      if (now - stat.mtimeMs > cutoff) {
        renameSync(join(inboxDir, f), join(archiveDir, f));
        moved++;
      }
    } catch { /* skip */ }
  }

  return moved;
}

function archiveOldDailyNotes(vault, keepDays = 60) {
  const dailyDir = join(vault, "01-Daily");
  const archiveDir = join(vault, "05-Archive", "daily");
  if (!existsSync(dailyDir)) return 0;

  mkdirSync(archiveDir, { recursive: true });

  const now = Date.now();
  const cutoff = keepDays * 24 * 60 * 60 * 1000;
  let moved = 0;

  for (const f of readdirSync(dailyDir).filter(f => f.endsWith(".md"))) {
    try {
      const stat = statSync(join(dailyDir, f));
      if (now - stat.mtimeMs > cutoff) {
        renameSync(join(dailyDir, f), join(archiveDir, f));
        moved++;
      }
    } catch { /* skip */ }
  }

  return moved;
}

function cleanAgentLogMirrors(vault, keepDays = 30) {
  const logDir = join(vault, "07-Agent-Log");
  if (!existsSync(logDir)) return 0;

  const now = Date.now();
  const cutoff = keepDays * 24 * 60 * 60 * 1000;
  let removed = 0;

  for (const f of readdirSync(logDir).filter(f => f.endsWith(".md"))) {
    try {
      const stat = statSync(join(logDir, f));
      if (now - stat.mtimeMs > cutoff) {
        // Move to archive instead of deleting
        const archiveDir = join(vault, "05-Archive", "agent-log");
        mkdirSync(archiveDir, { recursive: true });
        renameSync(join(logDir, f), join(archiveDir, f));
        removed++;
      }
    } catch { /* skip */ }
  }

  return removed;
}

// ═════════════════════════════════════════════════════════════════════
// LLM-AS-JUDGE
// ═════════════════════════════════════════════════════════════════════

async function llmJudgeVaultQuality(vault, apiKey) {
  if (!apiKey) return null;

  // Sample vault content for quality assessment
  const samples = [];

  // Sample inbox items
  const inboxDir = join(vault, "00-Inbox");
  if (existsSync(inboxDir)) {
    const files = readdirSync(inboxDir).filter(f => f.endsWith(".md")).slice(0, 3);
    for (const f of files) {
      try {
        const content = readFileSync(join(inboxDir, f), "utf-8").slice(0, 500);
        samples.push(`[INBOX] ${f}:\n${content}`);
      } catch { /* */ }
    }
  }

  // Sample brain entries
  const brainDir = join(vault, "06-Brain", "People");
  if (existsSync(brainDir)) {
    const files = readdirSync(brainDir).filter(f => f.endsWith(".md")).slice(0, 2);
    for (const f of files) {
      try {
        const content = readFileSync(join(brainDir, f), "utf-8").slice(0, 500);
        samples.push(`[PEOPLE] ${f}:\n${content}`);
      } catch { /* */ }
    }
  }

  // Sample today's daily note
  const today = new Date().toISOString().slice(0, 10);
  const dailyPath = join(vault, "01-Daily", `${today}.md`);
  if (existsSync(dailyPath)) {
    try {
      const content = readFileSync(dailyPath, "utf-8").slice(0, 1000);
      samples.push(`[DAILY] ${today}.md:\n${content}`);
    } catch { /* */ }
  }

  if (samples.length === 0) return null;

  const prompt = `You are evaluating the quality of a personal knowledge vault (Obsidian-based second brain) for an AI assistant. Score each dimension 0-10.

VAULT SAMPLES:
${samples.join("\n\n---\n\n")}

Score these dimensions (0-10 each):
1. ORGANIZATION: Are files well-structured, properly named, with clear content hierarchy?
2. INFORMATION_DENSITY: Is the content meaningful and actionable, not boilerplate or noise?
3. CROSS_LINKING: Are there references/connections between entities (people, projects, companies)?
4. ACTIONABILITY: Can an AI assistant use this content to give informed, contextual responses?
5. FRESHNESS: Does the content appear current and maintained?

Return ONLY a JSON object:
{"organization": N, "information_density": N, "cross_linking": N, "actionability": N, "freshness": N}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6-20250514",
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.log(`  LLM judge HTTP ${response.status}: ${await response.text().catch(() => "?")}`);
      return null;
    }
    const json = await response.json();
    const text = json?.content?.[0]?.text;
    if (!text) {
      console.log("  LLM judge: no text in response", JSON.stringify(json).slice(0, 200));
      return null;
    }

    const cleaned = text.replace(/```json?\s*|\s*```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.log(`  LLM judge error: ${err.message}`);
    return null;
  }
}

// ═════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════

async function main() {
  const { iterations, fix } = parseArgs();
  const vault = resolveVaultPath();

  if (!vault) {
    console.error("ERROR: No Obsidian vault found. Set OBSIDIAN_VAULT_PATH or create ~/Documents/VAULT/");
    process.exit(1);
  }

  const anthropicKey = loadAnthropicKey();

  console.log("Second Brain Vault Campaign");
  console.log("══════════════════════════════════════════════");
  console.log(`Vault: ${vault}`);
  console.log(`Mode: ${fix ? "AUDIT + FIX" : "AUDIT ONLY (use --fix to apply changes)"}`);
  console.log(`LLM Judge: ${anthropicKey ? "Sonnet 4.6" : "UNAVAILABLE (no API key)"}`);
  console.log(`Iterations: ${iterations}`);
  console.log("");

  // Initialize log
  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tvault_health\tcapture\tintegration\tnoise\tllm_quality\tcombined\taction\n");
  }

  for (let i = 1; i <= iterations; i++) {
    console.log(`\n── Iteration ${i}/${iterations} ──────────────────────\n`);

    // ── Score all dimensions ──

    console.log("=== 1. Vault Health ===");
    const health = scoreVaultHealth(vault);
    console.log(`  Inbox bloat: ${health.scores.inbox_bloat.toFixed(2)} (${health.details.inboxCount} items)`);
    console.log(`  Daily freshness: ${health.scores.daily_freshness.toFixed(2)}`);
    console.log(`  Brain coverage: ${health.scores.brain_coverage.toFixed(2)} (${health.details.peopleCount}p/${health.details.companiesCount}c/${health.details.knowledgeCount}k)`);
    console.log(`  Identity completeness: ${health.scores.identity_completeness.toFixed(2)}`);
    console.log(`  Archive usage: ${health.scores.archive_usage.toFixed(2)} (${health.details.archiveCount} items)`);
    console.log(`  Combined: ${health.scores.combined.toFixed(4)}`);
    console.log("");

    console.log("=== 2. Capture Completeness ===");
    const capture = scoreCaptureCompleteness(vault);
    console.log(`  Session capture: ${capture.scores.session_capture.toFixed(2)} (${capture.details.recentCaptures}/3 recent days)`);
    console.log(`  Queue capture: ${capture.scores.queue_capture.toFixed(2)} (${capture.details.localCount} local → ${capture.details.vaultCount} vault)`);
    console.log(`  Capture recency: ${capture.scores.capture_recency.toFixed(2)}`);
    console.log(`  Combined: ${capture.scores.combined.toFixed(4)}`);
    console.log("");

    console.log("=== 3. Memory Integration ===");
    const integration = await scoreMemoryIntegration(vault);
    console.log(`  Graph density: ${integration.scores.graph_density.toFixed(2)} (${integration.details.graphEntities} entities)`);
    console.log(`  Graph connectedness: ${integration.scores.graph_connectedness.toFixed(2)} (${integration.details.graphEdges} edges)`);
    console.log(`  People coherence: ${integration.scores.people_coherence.toFixed(2)} (vault: ${integration.details.vaultPeople})`);
    console.log(`  Mem0 available: ${integration.scores.mem0_available.toFixed(2)}`);
    console.log(`  Combined: ${integration.scores.combined.toFixed(4)}`);
    console.log("");

    console.log("=== 4. Noise Ratio ===");
    const noise = scoreNoiseRatio(vault);
    console.log(`  Fresh ratio: ${noise.scores.noise_ratio.toFixed(2)} (${noise.details.stale7d ?? 0} stale >7d, ${noise.details.stale30d ?? 0} stale >30d)`);
    console.log("");

    // LLM-as-judge
    let llmScore = null;
    let llmCombined = 0;
    console.log("=== 5. LLM Quality Judge ===");
    if (anthropicKey) {
      llmScore = await llmJudgeVaultQuality(vault, anthropicKey);
      if (llmScore) {
        const dims = ["organization", "information_density", "cross_linking", "actionability", "freshness"];
        for (const d of dims) {
          console.log(`  ${d}: ${llmScore[d] ?? "?"}/10`);
        }
        llmCombined = dims.reduce((sum, d) => sum + (llmScore[d] ?? 0), 0) / (dims.length * 10);
        console.log(`  Combined: ${llmCombined.toFixed(4)}`);
      } else {
        console.log("  LLM judge returned no results");
      }
    } else {
      console.log("  Skipped (no API key)");
    }
    console.log("");

    // ── Combined Score ──
    const combined =
      (health.scores.combined * 0.25) +
      (capture.scores.combined * 0.20) +
      (integration.scores.combined * 0.25) +
      (noise.scores.combined * 0.15) +
      (llmCombined * 0.15);

    console.log("═══════════════════════════════════════════════");
    console.log(`SCORE:vault_health:${health.scores.combined.toFixed(4)}`);
    console.log(`SCORE:capture:${capture.scores.combined.toFixed(4)}`);
    console.log(`SCORE:integration:${integration.scores.combined.toFixed(4)}`);
    console.log(`SCORE:noise:${noise.scores.combined.toFixed(4)}`);
    console.log(`SCORE:llm_quality:${llmCombined.toFixed(4)}`);
    console.log(`SCORE:combined:${combined.toFixed(4)}`);
    console.log("═══════════════════════════════════════════════");

    // ── Apply Fixes ──
    let action = "audit-only";
    if (fix) {
      console.log("\n=== Applying Fixes ===\n");

      const inboxArchived = archiveStaleInbox(vault, 30);
      console.log(`  Archived ${inboxArchived} stale inbox items (>30 days)`);

      const dailyArchived = archiveOldDailyNotes(vault, 60);
      console.log(`  Archived ${dailyArchived} old daily notes (>60 days)`);

      const logsArchived = cleanAgentLogMirrors(vault, 30);
      console.log(`  Archived ${logsArchived} old agent-log mirrors (>30 days)`);

      action = `fix: inbox=${inboxArchived} daily=${dailyArchived} logs=${logsArchived}`;

      // Re-score after fixes
      console.log("\n=== Post-Fix Scores ===\n");
      const postHealth = scoreVaultHealth(vault);
      const postNoise = scoreNoiseRatio(vault);
      const postCombined =
        (postHealth.scores.combined * 0.25) +
        (capture.scores.combined * 0.20) +
        (integration.scores.combined * 0.25) +
        (postNoise.scores.combined * 0.15) +
        (llmCombined * 0.15);
      console.log(`SCORE:post_fix_combined:${postCombined.toFixed(4)}`);
      console.log(`SCORE:improvement:${(postCombined - combined).toFixed(4)}`);
    }

    // Log
    appendFileSync(LOG_PATH, [
      i,
      health.scores.combined.toFixed(4),
      capture.scores.combined.toFixed(4),
      integration.scores.combined.toFixed(4),
      noise.scores.combined.toFixed(4),
      llmCombined.toFixed(4),
      combined.toFixed(4),
      action,
    ].join("\t") + "\n");
  }

  console.log(`\nLog: ${LOG_PATH}`);
}

main().catch(err => {
  console.error("Campaign crashed:", err);
  process.exit(1);
});
