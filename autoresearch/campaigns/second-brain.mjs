/**
 * Autoresearch Campaign: Second Brain SYSTEM Audit
 *
 * Audits the ENTIRE second brain system end-to-end:
 *   1. CAPTURE — Are all data sources flowing in automatically?
 *   2. PROCESSING — Is data being classified, extracted, indexed?
 *   3. RECALL — Can the system find what it knows when asked?
 *   4. DECAY — Is stale data pruned? Is fresh data prioritized?
 *   5. GRAPH — Are entities/relationships mapped and growing?
 *   6. COHERENCE — Do Mem0, identity graph, and vault agree?
 *   7. ARCHIVE INTELLIGENCE — Is the Apple Notes archive indexed?
 *   8. LLM SYSTEM JUDGE — Sonnet 4.6 evaluates overall system quality
 *
 * Usage: node autoresearch/campaigns/second-brain.mjs [--iterations N] [--fix]
 *
 * This is a SYSTEM audit, not a file audit. It checks pipelines, not folders.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync, statSync, mkdirSync, renameSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execSync } from "node:child_process";
import { resolveAnthropicKey, createAnthropicCaller, loadGodModeEnv } from "../lib/resolve-anthropic.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dirname, "second-brain-log.tsv");

const GODMODE_DATA = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "data");
const GODMODE_MEMORY = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "memory");

// ── Vault Resolution ────────────────────────────────────────────────

function resolveVaultPath() {
  if (process.env.OBSIDIAN_VAULT_PATH) return process.env.OBSIDIAN_VAULT_PATH;
  const defaultVault = join(homedir(), "Documents", "VAULT");
  if (existsSync(defaultVault) && statSync(defaultVault).isDirectory()) return defaultVault;
  return null;
}

// ── CLI ─────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let iterations = 1;
  let fix = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--iterations" && args[i + 1]) iterations = parseInt(args[i + 1], 10) || 1;
    if (args[i] === "--fix") fix = true;
  }
  return { iterations, fix };
}

// ── Auth — delegated to shared resolver ─────────────────────────────
// loadGodModeEnv() loads .env files, resolveAnthropicKey() finds the best token
// createAnthropicCaller() wraps fetch with auto-refresh on 401

// ── Utility ─────────────────────────────────────────────────────────

function countMdFiles(dir) {
  if (!existsSync(dir)) return 0;
  try { return readdirSync(dir).filter(f => f.endsWith(".md")).length; } catch { return 0; }
}

function countFilesRecursive(dir) {
  if (!existsSync(dir)) return 0;
  try {
    return parseInt(execSync(`find "${dir}" -name "*.md" -type f | wc -l`, { encoding: "utf-8" }).trim()) || 0;
  } catch { return 0; }
}

function fileAge(filePath) {
  try { return Date.now() - statSync(filePath).mtimeMs; } catch { return Infinity; }
}

function hoursAgo(ms) { return ms / (1000 * 60 * 60); }
function daysAgo(ms) { return ms / (1000 * 60 * 60 * 24); }

function sqliteQuery(dbPath, query) {
  try {
    return execSync(`sqlite3 "${dbPath}" "${query}"`, { encoding: "utf-8" }).trim();
  } catch { return ""; }
}

// ═════════════════════════════════════════════════════════════════════
// SCORING DIMENSIONS — SYSTEM HEALTH
// ═════════════════════════════════════════════════════════════════════

// ── 1. CAPTURE PIPELINE ─────────────────────────────────────────────
// Is data flowing in from ALL sources automatically?

function scoreCaptureSystem(vault) {
  const scores = {};
  const issues = [];

  // 1a. Vault capture service — is it running?
  const captureStatePath = join(GODMODE_DATA, "vault-capture-state.json");
  if (existsSync(captureStatePath)) {
    try {
      const state = JSON.parse(readFileSync(captureStatePath, "utf-8"));
      const lastRunMs = new Date(state.lastRun).getTime();
      const hrs = hoursAgo(Date.now() - lastRunMs);
      scores.capture_pipeline_alive = hrs < 1 ? 1 : hrs < 4 ? 0.7 : hrs < 24 ? 0.3 : 0;
      if (hrs > 4) issues.push(`Capture pipeline last ran ${hrs.toFixed(1)}h ago`);
    } catch { scores.capture_pipeline_alive = 0; issues.push("Capture state file corrupt"); }
  } else {
    scores.capture_pipeline_alive = 0;
    issues.push("Capture pipeline has NEVER run (no state file)");
  }

  // 1b. Session capture — are Claude Code sessions being captured to daily notes?
  const agentLogDir = join(vault, "07-Agent-Log");
  let recentCaptures = 0;
  for (let i = 0; i < 3; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (existsSync(join(agentLogDir, `${date}.md`))) recentCaptures++;
  }
  scores.session_capture = recentCaptures / 3;
  if (recentCaptures === 0) issues.push("No session captures in last 3 days");

  // 1c. Queue output capture — are agent outputs reaching the vault?
  const localInboxCount = countMdFiles(join(GODMODE_MEMORY, "inbox"));
  let vaultCapturedCount = countMdFiles(join(vault, "00-Inbox"));
  // Count routed items too
  for (const sub of ["agent-outputs", "clawhub-discoveries", "x-intel", "godmode-updates", "workspace-notes", "research"]) {
    vaultCapturedCount += countMdFiles(join(vault, "04-Resources", sub));
  }
  for (const sub of ["antifragile", "trp", "audiencelab"]) {
    vaultCapturedCount += countMdFiles(join(vault, "02-Projects", sub));
  }
  vaultCapturedCount += countMdFiles(join(vault, "05-Archive", "inbox"));
  scores.queue_capture = localInboxCount > 0 ? Math.min(1, vaultCapturedCount / localInboxCount) : 1;

  // 1d. Mem0 ingestion — is it capturing conversation facts?
  const mem0Db = join(GODMODE_DATA, "mem0-vectors.db");
  if (existsSync(mem0Db)) {
    const memCount = parseInt(sqliteQuery(mem0Db, "SELECT COUNT(*) FROM vectors;")) || 0;
    scores.mem0_ingestion = memCount > 50 ? 1 : memCount > 10 ? 0.7 : memCount > 0 ? 0.3 : 0;
    if (memCount === 0) issues.push("Mem0 has 0 memories — ingestion may be broken");
  } else {
    scores.mem0_ingestion = 0;
    issues.push("Mem0 database does not exist");
  }

  // 1e. Identity graph extraction — is it capturing entities from conversations?
  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  if (existsSync(graphDb)) {
    const recentEntities = parseInt(sqliteQuery(graphDb,
      `SELECT COUNT(*) FROM entities WHERE updated_at > datetime('now', '-7 days');`)) || 0;
    scores.graph_capture = recentEntities > 5 ? 1 : recentEntities > 0 ? 0.5 : 0;
    if (recentEntities === 0) issues.push("No graph entities updated in last 7 days");
  } else {
    scores.graph_capture = 0;
    issues.push("Identity graph database does not exist");
  }

  // 1f. Daily brief generation — is the heartbeat generating briefs?
  const today = new Date().toISOString().slice(0, 10);
  const todayBrief = existsSync(join(vault, "01-Daily", `${today}.md`));
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterdayBrief = existsSync(join(vault, "01-Daily", `${yesterday}.md`));
  scores.brief_generation = (todayBrief ? 0.6 : 0) + (yesterdayBrief ? 0.4 : 0);

  // 1g. Awareness snapshot — is it being generated?
  const snapshotPath = join(GODMODE_DATA, "awareness-snapshot.md");
  if (existsSync(snapshotPath)) {
    const age = fileAge(snapshotPath);
    scores.snapshot_freshness = hoursAgo(age) < 1 ? 1 : hoursAgo(age) < 4 ? 0.5 : 0;
    if (hoursAgo(age) > 4) issues.push(`Awareness snapshot is ${hoursAgo(age).toFixed(1)}h stale`);
  } else {
    scores.snapshot_freshness = 0;
    issues.push("No awareness snapshot file exists");
  }

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues };
}

// ── 2. PROCESSING & ROUTING ─────────────────────────────────────────
// Is captured data being classified, routed, and structured?

function scoreProcessing(vault) {
  const scores = {};
  const issues = [];

  // 2a. Inbox triage — what % of inbox items are unprocessed vs routed?
  const inboxCount = countMdFiles(join(vault, "00-Inbox"));
  scores.inbox_health = inboxCount <= 10 ? 1 : inboxCount <= 30 ? 0.7 : inboxCount <= 100 ? 0.3 : 0;
  if (inboxCount > 30) issues.push(`${inboxCount} unprocessed inbox items (should be <10)`);

  // 2b. Brain coverage — are entities being filed, not just captured?
  const peopleCount = countMdFiles(join(vault, "06-Brain", "People")) - 1; // minus INDEX.md
  const companiesCount = countMdFiles(join(vault, "06-Brain", "Companies"));
  const knowledgeCount = countMdFiles(join(vault, "06-Brain", "Knowledge"));
  scores.brain_coverage = Math.min(1, (
    Math.min(peopleCount, 20) / 20 * 0.4 +
    Math.min(companiesCount, 10) / 10 * 0.3 +
    Math.min(knowledgeCount, 10) / 10 * 0.3
  ));

  // 2c. Identity files — is the user's identity defined?
  const identityFiles = ["USER.md", "SOUL.md", "VISION.md", "PRINCIPLES.md", "IDENTITY.md"];
  const identityPresent = identityFiles.filter(f => existsSync(join(vault, "08-Identity", f))).length;
  scores.identity_completeness = Math.min(1, identityPresent / 3); // only need 3 core files
  if (identityPresent < 3) issues.push(`Missing identity files (${identityPresent}/${identityFiles.length})`);

  // 2d. PARA structure health — are all folders in use?
  const paraFolders = ["00-Inbox", "01-Daily", "02-Projects", "03-Areas", "04-Resources", "05-Archive", "06-Brain"];
  const paraActive = paraFolders.filter(f => {
    const dir = join(vault, f);
    return existsSync(dir) && countMdFiles(dir) > 0;
  }).length;
  scores.para_health = paraActive / paraFolders.length;

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { inboxCount, peopleCount, companiesCount, knowledgeCount } };
}

// ── 3. RECALL QUALITY ───────────────────────────────────────────────
// Can the system find what it knows when asked?

function scoreRecall() {
  const scores = {};
  const issues = [];

  // 3a. Mem0 database health + fact count
  const mem0Db = join(GODMODE_DATA, "mem0-vectors.db");
  let memCount = 0;
  if (existsSync(mem0Db)) {
    memCount = parseInt(sqliteQuery(mem0Db, "SELECT COUNT(*) FROM vectors;")) || 0;
    scores.mem0_recall_capacity = memCount > 100 ? 1 : memCount > 30 ? 0.7 : memCount > 0 ? 0.3 : 0;
  } else {
    scores.mem0_recall_capacity = 0;
    issues.push("Mem0 DB missing — zero recall capacity");
  }

  // 3b. Identity graph queryability
  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  let entityCount = 0, edgeCount = 0;
  if (existsSync(graphDb)) {
    entityCount = parseInt(sqliteQuery(graphDb, "SELECT COUNT(*) FROM entities;")) || 0;
    edgeCount = parseInt(sqliteQuery(graphDb, "SELECT COUNT(*) FROM edges;")) || 0;
    scores.graph_queryable = entityCount > 50 ? 1 : entityCount > 10 ? 0.7 : entityCount > 0 ? 0.3 : 0;
    // Edge density — relationships per entity
    const density = entityCount > 0 ? edgeCount / entityCount : 0;
    scores.graph_density = density > 1.5 ? 1 : density > 0.5 ? 0.7 : density > 0 ? 0.3 : 0;
  } else {
    scores.graph_queryable = 0;
    scores.graph_density = 0;
    issues.push("Identity graph DB missing — zero graph recall");
  }

  // 3c. Mem0 retry queue — are failed ingestions piling up?
  const retryPath = join(GODMODE_DATA, "mem0-retry-queue.json");
  if (existsSync(retryPath)) {
    try {
      const queue = JSON.parse(readFileSync(retryPath, "utf-8"));
      const pending = Array.isArray(queue) ? queue.length : 0;
      scores.retry_queue_health = pending === 0 ? 1 : pending < 5 ? 0.7 : pending < 20 ? 0.3 : 0;
      if (pending > 5) issues.push(`${pending} items in Mem0 retry queue — ingestion struggling`);
    } catch { scores.retry_queue_health = 1; }
  } else {
    scores.retry_queue_health = 1; // no queue = no failures
  }

  // 3d. Seed sentinel — was initial vault→memory seeding done?
  const mem0Seeded = existsSync(join(GODMODE_DATA, ".mem0-seeded"));
  const graphSeeded = existsSync(join(GODMODE_DATA, ".identity-graph-seeded"));
  scores.initial_seeding = ((mem0Seeded ? 0.5 : 0) + (graphSeeded ? 0.5 : 0));
  if (!mem0Seeded) issues.push("Mem0 has not been seeded from vault");
  if (!graphSeeded) issues.push("Identity graph has not been seeded from vault");

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { memCount, entityCount, edgeCount } };
}

// ── 4. DECAY & HYGIENE ──────────────────────────────────────────────
// Is stale data being pruned? Is the system getting cleaner over time?

function scoreDecay(vault) {
  const scores = {};
  const issues = [];

  // 4a. Inbox freshness — what % of inbox items are stale?
  const inboxDir = join(vault, "00-Inbox");
  const sevenDays = 7 * 86400000;
  const thirtyDays = 30 * 86400000;
  let inboxTotal = 0, stale7d = 0, stale30d = 0;
  if (existsSync(inboxDir)) {
    const now = Date.now();
    for (const f of readdirSync(inboxDir).filter(f => f.endsWith(".md"))) {
      try {
        const age = now - statSync(join(inboxDir, f)).mtimeMs;
        inboxTotal++;
        if (age > sevenDays) stale7d++;
        if (age > thirtyDays) stale30d++;
      } catch { /* */ }
    }
  }
  scores.inbox_freshness = inboxTotal === 0 ? 1 : 1 - (stale7d / inboxTotal);

  // 4b. Graph pruning — are orphan entities being cleaned?
  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  if (existsSync(graphDb)) {
    const orphans = parseInt(sqliteQuery(graphDb,
      `SELECT COUNT(*) FROM entities e WHERE NOT EXISTS (SELECT 1 FROM edges WHERE src=e.id OR dst=e.id);`)) || 0;
    const total = parseInt(sqliteQuery(graphDb, "SELECT COUNT(*) FROM entities;")) || 1;
    scores.graph_hygiene = orphans / total < 0.1 ? 1 : orphans / total < 0.3 ? 0.7 : 0.3;
    if (orphans > total * 0.3) issues.push(`${orphans} orphan entities (${(orphans/total*100).toFixed(0)}%) — pruning may be failing`);
  } else {
    scores.graph_hygiene = 0.5;
  }

  // 4c. Archive utilization — is the archive being used for cleanup?
  const archiveTotal = countFilesRecursive(join(vault, "05-Archive"));
  scores.archive_utilization = archiveTotal > 20 ? 1 : archiveTotal > 5 ? 0.7 : archiveTotal > 0 ? 0.3 : 0;
  if (archiveTotal === 0) issues.push("Archive is empty — nothing being cleaned up");

  // 4d. Agent log rotation — are old logs being rotated?
  const logDir = join(vault, "07-Agent-Log");
  const logCount = countMdFiles(logDir);
  scores.log_rotation = logCount <= 14 ? 1 : logCount <= 30 ? 0.7 : logCount <= 60 ? 0.3 : 0;
  if (logCount > 30) issues.push(`${logCount} agent logs — rotation needed`);

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { inboxTotal, stale7d, stale30d, archiveTotal, logCount } };
}

// ── 5. ARCHIVE INTELLIGENCE ─────────────────────────────────────────
// Is the Apple Notes archive (5k+ notes) indexed and contributing?

function scoreArchiveIntelligence(vault) {
  const scores = {};
  const issues = [];

  const appleNotesDir = join(vault, "99-System", "Apple Notes Archive");
  const appleNotesCount = existsSync(appleNotesDir) ? countFilesRecursive(appleNotesDir) : 0;

  // 5a. Does the archive exist and have content?
  scores.archive_exists = appleNotesCount > 100 ? 1 : appleNotesCount > 0 ? 0.5 : 0;

  // 5b. Is the archive indexed? (check for index manifest)
  const indexPath = join(GODMODE_DATA, "apple-notes-index.json");
  let indexedCount = 0;
  if (existsSync(indexPath)) {
    try {
      const index = JSON.parse(readFileSync(indexPath, "utf-8"));
      indexedCount = Array.isArray(index.entries) ? index.entries.length : Object.keys(index).length;
    } catch { /* */ }
  }
  scores.archive_indexed = appleNotesCount > 0
    ? Math.min(1, indexedCount / (appleNotesCount * 0.5)) // 50% coverage = perfect
    : 1;
  if (appleNotesCount > 100 && indexedCount === 0) {
    issues.push(`${appleNotesCount} Apple Notes exist but NONE are indexed — massive knowledge gap`);
  }

  // 5c. Are Apple Notes entities in the identity graph?
  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  if (existsSync(graphDb) && appleNotesCount > 0) {
    const graphFromArchive = parseInt(sqliteQuery(graphDb,
      `SELECT COUNT(*) FROM entities WHERE meta LIKE '%apple-notes%';`)) || 0;
    scores.archive_in_graph = graphFromArchive > 20 ? 1 : graphFromArchive > 0 ? 0.5 : 0;
    if (graphFromArchive === 0 && appleNotesCount > 100) {
      issues.push("Zero Apple Notes entities in identity graph — archive is invisible to recall");
    }
  } else {
    scores.archive_in_graph = appleNotesCount === 0 ? 1 : 0;
  }

  // 5d. X-Bookmarks integration
  const xBookmarksCount = countMdFiles(join(vault, "04-Resources", "X-Bookmarks"));
  scores.xbookmarks_coverage = xBookmarksCount > 50 ? 1 : xBookmarksCount > 10 ? 0.5 : xBookmarksCount > 0 ? 0.3 : 0;

  // 5e. Total vault utilization — what % of vault is accessible to the system?
  const totalVaultFiles = countFilesRecursive(vault);
  const accessibleFiles = totalVaultFiles - appleNotesCount; // Files the system can actually use
  const systemCanSee = accessibleFiles + indexedCount; // Plus indexed archive items
  scores.vault_utilization = totalVaultFiles > 0 ? Math.min(1, systemCanSee / totalVaultFiles) : 1;
  if (appleNotesCount > totalVaultFiles * 0.5 && indexedCount === 0) {
    issues.push(`${(appleNotesCount/totalVaultFiles*100).toFixed(0)}% of vault is in an unindexed archive`);
  }

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { appleNotesCount, indexedCount, xBookmarksCount, totalVaultFiles } };
}

// ── 6. CROSS-SYSTEM COHERENCE ───────────────────────────────────────
// Do Mem0, identity graph, and vault Brain agree on who/what matters?

function scoreCoherence(vault) {
  const scores = {};
  const issues = [];

  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  const vaultPeople = existsSync(join(vault, "06-Brain", "People"))
    ? readdirSync(join(vault, "06-Brain", "People")).filter(f => f.endsWith(".md") && f !== "INDEX.md").map(f => basename(f, ".md").toLowerCase())
    : [];

  // 6a. Vault people ↔ graph people overlap
  if (existsSync(graphDb) && vaultPeople.length > 0) {
    try {
      const graphNames = sqliteQuery(graphDb,
        "SELECT LOWER(name) FROM entities WHERE kind='person' LIMIT 200;")
        .split("\n").filter(Boolean);

      let overlap = 0;
      for (const vp of vaultPeople) {
        const normalized = vp.replace(/-/g, " ");
        if (graphNames.some(gn => gn.includes(normalized) || normalized.includes(gn))) overlap++;
      }
      scores.people_coherence = vaultPeople.length > 0 ? overlap / vaultPeople.length : 0;
      const missing = vaultPeople.length - overlap;
      if (missing > 3) issues.push(`${missing} vault people not in identity graph`);
    } catch { scores.people_coherence = 0.5; }
  } else {
    scores.people_coherence = 0;
    if (vaultPeople.length > 0) issues.push("Can't check coherence — graph DB missing");
  }

  // 6b. Graph entities → vault coverage (do graph people have vault files?)
  if (existsSync(graphDb)) {
    const graphPeopleCount = parseInt(sqliteQuery(graphDb,
      "SELECT COUNT(*) FROM entities WHERE kind='person';")) || 0;
    // How many graph people have vault files?
    if (graphPeopleCount > 0 && vaultPeople.length > 0) {
      scores.graph_to_vault = Math.min(1, vaultPeople.length / Math.min(graphPeopleCount, 30));
    } else {
      scores.graph_to_vault = 0;
    }
    if (graphPeopleCount > vaultPeople.length * 2) {
      issues.push(`Graph has ${graphPeopleCount} people but vault only has ${vaultPeople.length} — auto-stub creation needed`);
    }
  } else {
    scores.graph_to_vault = 0;
  }

  // 6c. Cross-links in Brain entries
  let totalLinks = 0, totalEntries = 0;
  for (const sub of ["People", "Companies", "Knowledge"]) {
    const dir = join(vault, "06-Brain", sub);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter(f => f.endsWith(".md") && f !== "INDEX.md")) {
      totalEntries++;
      try {
        const content = readFileSync(join(dir, f), "utf-8");
        const links = (content.match(/\[\[/g) || []).length;
        totalLinks += links;
      } catch { /* */ }
    }
  }
  scores.cross_linking = totalEntries > 0
    ? Math.min(1, (totalLinks / totalEntries) / 3) // avg 3 links per entry = perfect
    : 0;
  if (totalEntries > 5 && totalLinks / totalEntries < 1) {
    issues.push(`Low cross-linking: ${(totalLinks/totalEntries).toFixed(1)} links/entry (target: 3+)`);
  }

  // 6d. Re-sync freshness — has vault→memory re-seeding happened recently?
  // (Currently one-time only — this measures the gap)
  const mem0Seeded = existsSync(join(GODMODE_DATA, ".mem0-seeded"));
  const graphSeeded = existsSync(join(GODMODE_DATA, ".identity-graph-seeded"));
  // Check age of seed sentinels — old seeds mean no re-sync
  if (mem0Seeded) {
    const seedAge = daysAgo(fileAge(join(GODMODE_DATA, ".mem0-seeded")));
    scores.resync_freshness = seedAge < 7 ? 1 : seedAge < 30 ? 0.5 : 0;
    if (seedAge > 30) issues.push(`Mem0 vault seed is ${seedAge.toFixed(0)}d old — vault changes since then are invisible to memory`);
  } else {
    scores.resync_freshness = 0;
    issues.push("Mem0 never seeded from vault");
  }

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { vaultPeople: vaultPeople.length, totalEntries, totalLinks } };
}

// ── 7. KNOWLEDGE VELOCITY ───────────────────────────────────────────
// Is the brain getting smarter over time?

function scoreVelocity(vault) {
  const scores = {};
  const issues = [];

  const graphDb = join(GODMODE_DATA, "identity-graph.db");

  // 7a. Graph growth — new entities in last 7 days
  if (existsSync(graphDb)) {
    const recentEntities = parseInt(sqliteQuery(graphDb,
      `SELECT COUNT(*) FROM entities WHERE updated_at > datetime('now', '-7 days');`)) || 0;
    const recentEdges = parseInt(sqliteQuery(graphDb,
      `SELECT COUNT(*) FROM edges WHERE updated_at > datetime('now', '-7 days');`)) || 0;
    scores.graph_growth = recentEntities > 10 ? 1 : recentEntities > 3 ? 0.7 : recentEntities > 0 ? 0.3 : 0;
    scores.edge_growth = recentEdges > 10 ? 1 : recentEdges > 3 ? 0.7 : recentEdges > 0 ? 0.3 : 0;
    if (recentEntities === 0) issues.push("No new graph entities in 7 days — system may not be learning");
  } else {
    scores.graph_growth = 0;
    scores.edge_growth = 0;
  }

  // 7b. Brain file growth — new files in 06-Brain in last 7 days
  const brainDir = join(vault, "06-Brain");
  let recentBrainFiles = 0;
  if (existsSync(brainDir)) {
    const sevenDays = 7 * 86400000;
    const now = Date.now();
    for (const sub of ["People", "Companies", "Knowledge"]) {
      const dir = join(brainDir, sub);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter(f => f.endsWith(".md"))) {
        try {
          if (now - statSync(join(dir, f)).mtimeMs < sevenDays) recentBrainFiles++;
        } catch { /* */ }
      }
    }
  }
  scores.brain_growth = recentBrainFiles > 5 ? 1 : recentBrainFiles > 1 ? 0.5 : 0;

  // 7c. Daily note streak
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (existsSync(join(vault, "01-Daily", `${date}.md`))) streak++;
    else break;
  }
  scores.daily_streak = streak >= 7 ? 1 : streak >= 3 ? 0.7 : streak > 0 ? 0.3 : 0;

  const vals = Object.values(scores);
  scores.combined = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { scores, issues, details: { recentBrainFiles, streak } };
}

// ═════════════════════════════════════════════════════════════════════
// FIX ACTIONS
// ═════════════════════════════════════════════════════════════════════

function archiveStaleInbox(vault, maxAgeDays = 30) {
  const inboxDir = join(vault, "00-Inbox");
  const archiveDir = join(vault, "05-Archive", "inbox");
  if (!existsSync(inboxDir)) return 0;
  mkdirSync(archiveDir, { recursive: true });
  const cutoff = maxAgeDays * 86400000;
  const now = Date.now();
  let moved = 0;
  for (const f of readdirSync(inboxDir).filter(f => f.endsWith(".md"))) {
    try {
      if (now - statSync(join(inboxDir, f)).mtimeMs > cutoff) {
        renameSync(join(inboxDir, f), join(archiveDir, f));
        moved++;
      }
    } catch { /* */ }
  }
  return moved;
}

function triageInboxByType(vault) {
  const inboxDir = join(vault, "00-Inbox");
  if (!existsSync(inboxDir)) return { routed: 0, details: {} };
  const routeMap = {
    "clawhub": join(vault, "04-Resources", "clawhub-discoveries"),
    "x-": join(vault, "04-Resources", "x-intel"),
    "antifragile": join(vault, "02-Projects", "antifragile"),
    "auto-": join(vault, "04-Resources", "agent-outputs"),
    "godmode": join(vault, "04-Resources", "godmode-updates"),
    "trp": join(vault, "02-Projects", "trp"),
    "workspace": join(vault, "04-Resources", "workspace-notes"),
    "audiencelab": join(vault, "02-Projects", "audiencelab"),
    "research": join(vault, "04-Resources", "research"),
  };
  let routed = 0;
  const details = {};
  for (const f of readdirSync(inboxDir).filter(f => f.endsWith(".md"))) {
    const nameWithoutDate = f.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    for (const [prefix, destDir] of Object.entries(routeMap)) {
      if (nameWithoutDate.startsWith(prefix)) {
        mkdirSync(destDir, { recursive: true });
        try { renameSync(join(inboxDir, f), join(destDir, f)); routed++; details[prefix] = (details[prefix] || 0) + 1; } catch { /* */ }
        break;
      }
    }
  }
  return { routed, details };
}

function deduplicatePeopleFacts(vault) {
  const peopleDir = join(vault, "06-Brain", "People");
  if (!existsSync(peopleDir)) return 0;
  let totalDeduped = 0;
  for (const f of readdirSync(peopleDir).filter(f => f.endsWith(".md") && f !== "INDEX.md")) {
    try {
      const filePath = join(peopleDir, f);
      const content = readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      const seen = new Set();
      const deduped = [];
      let removed = 0;
      for (const line of lines) {
        const normalized = line.trim().replace(/^\d{4}-\d{2}-\d{2}\s*/, "").replace(/\s+/g, " ");
        if (normalized.length > 20 && seen.has(normalized)) { removed++; continue; }
        if (normalized.length > 20) seen.add(normalized);
        deduped.push(line);
      }
      if (removed > 0) { writeFileSync(filePath, deduped.join("\n")); totalDeduped += removed; }
    } catch { /* */ }
  }
  return totalDeduped;
}

function addCrossLinks(vault) {
  const peopleDir = join(vault, "06-Brain", "People");
  const companiesDir = join(vault, "06-Brain", "Companies");
  if (!existsSync(peopleDir)) return 0;
  const entities = new Map();
  for (const dir of [peopleDir, companiesDir]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter(f => f.endsWith(".md") && f !== "INDEX.md")) {
      const slug = basename(f, ".md");
      const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      entities.set(slug, { displayName });
    }
  }
  let linksAdded = 0;
  for (const dir of [peopleDir, companiesDir]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter(f => f.endsWith(".md") && f !== "INDEX.md")) {
      try {
        const filePath = join(dir, f);
        const mySlug = basename(f, ".md");
        let content = readFileSync(filePath, "utf-8");
        let modified = false;
        const addedSlugs = new Set();
        const existingLinks = content.match(/\[\[([^\]|]+)/g) || [];
        for (const l of existingLinks) addedSlugs.add(l.replace("[[", ""));
        for (const [slug, info] of entities) {
          if (slug === mySlug || addedSlugs.has(slug)) continue;
          const namePattern = new RegExp(`(?<!\\[\\[)\\b${info.displayName}\\b(?!\\]\\])`, "gi");
          if (namePattern.test(content)) {
            if (!content.includes("## Related")) content = content.trimEnd() + "\n\n## Related\n";
            content += `- [[${slug}|${info.displayName}]]\n`;
            addedSlugs.add(slug);
            modified = true;
            linksAdded++;
          }
        }
        if (modified) writeFileSync(filePath, content);
      } catch { /* */ }
    }
  }
  return linksAdded;
}

function archiveOldDailyNotes(vault, keepDays = 60) {
  const dailyDir = join(vault, "01-Daily");
  const archiveDir = join(vault, "05-Archive", "daily");
  if (!existsSync(dailyDir)) return 0;
  mkdirSync(archiveDir, { recursive: true });
  const cutoff = keepDays * 86400000;
  const now = Date.now();
  let moved = 0;
  for (const f of readdirSync(dailyDir).filter(f => f.endsWith(".md"))) {
    try {
      if (now - statSync(join(dailyDir, f)).mtimeMs > cutoff) {
        renameSync(join(dailyDir, f), join(archiveDir, f));
        moved++;
      }
    } catch { /* */ }
  }
  return moved;
}

function cleanAgentLogMirrors(vault, keepDays = 30) {
  const logDir = join(vault, "07-Agent-Log");
  if (!existsSync(logDir)) return 0;
  const cutoff = keepDays * 86400000;
  const now = Date.now();
  let removed = 0;
  for (const f of readdirSync(logDir).filter(f => f.endsWith(".md"))) {
    try {
      if (now - statSync(join(logDir, f)).mtimeMs > cutoff) {
        const archiveDir = join(vault, "05-Archive", "agent-log");
        mkdirSync(archiveDir, { recursive: true });
        renameSync(join(logDir, f), join(archiveDir, f));
        removed++;
      }
    } catch { /* */ }
  }
  return removed;
}

// ═════════════════════════════════════════════════════════════════════
// LLM-AS-JUDGE — SYSTEM EVALUATION
// ═════════════════════════════════════════════════════════════════════

async function llmSystemJudge(vault, apiKey, allIssues, allScores) {
  if (!apiKey) return null;

  // Build a comprehensive system snapshot for the judge
  const graphDb = join(GODMODE_DATA, "identity-graph.db");
  const entityCount = existsSync(graphDb) ? sqliteQuery(graphDb, "SELECT COUNT(*) FROM entities;") : "0";
  const edgeCount = existsSync(graphDb) ? sqliteQuery(graphDb, "SELECT COUNT(*) FROM edges;") : "0";

  const mem0Db = join(GODMODE_DATA, "mem0-vectors.db");
  const memCount = existsSync(mem0Db) ? sqliteQuery(mem0Db, "SELECT COUNT(*) FROM vectors;") : "0";

  // Sample a Brain entry
  let brainSample = "";
  const peopleDir = join(vault, "06-Brain", "People");
  if (existsSync(peopleDir)) {
    const files = readdirSync(peopleDir).filter(f => f.endsWith(".md") && f !== "INDEX.md");
    if (files.length > 0) {
      try { brainSample = readFileSync(join(peopleDir, files[0]), "utf-8").slice(0, 600); } catch { /* */ }
    }
  }

  // Sample today's daily note
  let dailySample = "";
  const today = new Date().toISOString().slice(0, 10);
  const dailyPath = join(vault, "01-Daily", `${today}.md`);
  if (existsSync(dailyPath)) {
    try { dailySample = readFileSync(dailyPath, "utf-8").slice(0, 800); } catch { /* */ }
  }

  const prompt = `You are auditing a personal AI second brain SYSTEM. This is not about the content quality — it's about whether the SYSTEM works as an automatic, compounding intelligence layer.

SYSTEM STATE:
- Mem0 memories: ${memCount} facts stored
- Identity graph: ${entityCount} entities, ${edgeCount} edges
- Vault: ${countFilesRecursive(vault)} total files
- Apple Notes archive: ${countFilesRecursive(join(vault, "99-System", "Apple Notes Archive"))} files (imported history)
- X-Bookmarks: ${countMdFiles(join(vault, "04-Resources", "X-Bookmarks"))} bookmarks

CURRENT ISSUES:
${allIssues.length > 0 ? allIssues.map(i => `• ${i}`).join("\n") : "• No issues detected"}

DIMENSION SCORES:
${Object.entries(allScores).map(([k, v]) => `• ${k}: ${v.toFixed(2)}`).join("\n")}

SAMPLE BRAIN ENTRY:
${brainSample || "(none)"}

SAMPLE DAILY NOTE:
${dailySample || "(none)"}

Score these system dimensions (0-10 each):
1. CAPTURE_COMPLETENESS: Are ALL data sources being automatically captured? (conversations, queue outputs, sessions, calendar, external data)
2. PROCESSING_QUALITY: Is captured data being classified, extracted, and structured without user effort?
3. RECALL_RELIABILITY: Can the system find relevant context when the user asks about something it should know?
4. DECAY_INTELLIGENCE: Is stale/noisy data being pruned while important data persists?
5. COMPOUNDING_POTENTIAL: Is this system set up to get smarter over time without user discipline?

Also provide a 1-sentence CRITICAL_GAP assessment — what is the #1 thing preventing this from being a superintelligent second brain?

Return ONLY JSON:
{"capture_completeness": N, "processing_quality": N, "recall_reliability": N, "decay_intelligence": N, "compounding_potential": N, "critical_gap": "..."}`;

  try {
    const caller = await createAnthropicCaller("claude-sonnet-4-6");
    if (!caller) {
      console.log("  LLM judge: no Anthropic caller available");
      return null;
    }
    const text = await caller("You are a second brain system auditor. Return ONLY valid JSON.", prompt, 512);
    if (!text) return null;

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

  loadGodModeEnv();
  const resolved = resolveAnthropicKey();
  const anthropicKey = resolved?.key ?? null;

  console.log("Second Brain SYSTEM Audit");
  console.log("══════════════════════════════════════════════");
  console.log(`Vault: ${vault} (${countFilesRecursive(vault)} files)`);
  console.log(`Mode: ${fix ? "AUDIT + FIX" : "AUDIT ONLY (use --fix to apply changes)"}`);
  console.log(`LLM Judge: ${anthropicKey ? "Sonnet 4.6" : "UNAVAILABLE"}`);
  console.log(`Iterations: ${iterations}`);
  console.log("");

  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tcapture\tprocessing\trecall\tdecay\tarchive_intel\tcoherence\tvelocity\tllm_avg\tcombined\tissues\taction\n");
  }

  for (let i = 1; i <= iterations; i++) {
    console.log(`\n── Iteration ${i}/${iterations} ──────────────────────\n`);

    const allIssues = [];

    // ── Score all system dimensions ──

    console.log("=== 1. CAPTURE PIPELINE ===");
    const capture = scoreCaptureSystem(vault);
    for (const [k, v] of Object.entries(capture.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${capture.scores.combined.toFixed(3)}`);
    for (const issue of capture.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...capture.issues);
    console.log("");

    console.log("=== 2. PROCESSING & ROUTING ===");
    const processing = scoreProcessing(vault);
    for (const [k, v] of Object.entries(processing.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${processing.scores.combined.toFixed(3)}`);
    for (const issue of processing.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...processing.issues);
    console.log("");

    console.log("=== 3. RECALL QUALITY ===");
    const recall = scoreRecall();
    for (const [k, v] of Object.entries(recall.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${recall.scores.combined.toFixed(3)} (${recall.details.memCount} mem0 facts, ${recall.details.entityCount} entities, ${recall.details.edgeCount} edges)`);
    for (const issue of recall.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...recall.issues);
    console.log("");

    console.log("=== 4. DECAY & HYGIENE ===");
    const decay = scoreDecay(vault);
    for (const [k, v] of Object.entries(decay.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${decay.scores.combined.toFixed(3)}`);
    for (const issue of decay.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...decay.issues);
    console.log("");

    console.log("=== 5. ARCHIVE INTELLIGENCE ===");
    const archive = scoreArchiveIntelligence(vault);
    for (const [k, v] of Object.entries(archive.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${archive.scores.combined.toFixed(3)} (${archive.details.appleNotesCount} Apple Notes, ${archive.details.indexedCount} indexed)`);
    for (const issue of archive.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...archive.issues);
    console.log("");

    console.log("=== 6. CROSS-SYSTEM COHERENCE ===");
    const coherence = scoreCoherence(vault);
    for (const [k, v] of Object.entries(coherence.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${coherence.scores.combined.toFixed(3)}`);
    for (const issue of coherence.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...coherence.issues);
    console.log("");

    console.log("=== 7. KNOWLEDGE VELOCITY ===");
    const velocity = scoreVelocity(vault);
    for (const [k, v] of Object.entries(velocity.scores)) {
      if (k !== "combined") console.log(`  ${k}: ${v.toFixed(2)}`);
    }
    console.log(`  COMBINED: ${velocity.scores.combined.toFixed(3)} (streak: ${velocity.details.streak}d, new brain files: ${velocity.details.recentBrainFiles})`);
    for (const issue of velocity.issues) console.log(`  ⚠ ${issue}`);
    allIssues.push(...velocity.issues);
    console.log("");

    // ── LLM System Judge ──
    let llmScore = null;
    let llmAvg = 0;
    console.log("=== 8. LLM SYSTEM JUDGE ===");
    const allScores = {
      capture: capture.scores.combined,
      processing: processing.scores.combined,
      recall: recall.scores.combined,
      decay: decay.scores.combined,
      archive_intel: archive.scores.combined,
      coherence: coherence.scores.combined,
      velocity: velocity.scores.combined,
    };
    if (anthropicKey) {
      llmScore = await llmSystemJudge(vault, anthropicKey, allIssues, allScores);
      if (llmScore) {
        const dims = ["capture_completeness", "processing_quality", "recall_reliability", "decay_intelligence", "compounding_potential"];
        for (const d of dims) console.log(`  ${d}: ${llmScore[d] ?? "?"}/10`);
        llmAvg = dims.reduce((sum, d) => sum + (llmScore[d] ?? 0), 0) / (dims.length * 10);
        console.log(`  COMBINED: ${llmAvg.toFixed(3)}`);
        if (llmScore.critical_gap) console.log(`  CRITICAL GAP: ${llmScore.critical_gap}`);
      } else {
        console.log("  LLM judge returned no results");
      }
    } else {
      console.log("  Skipped (no API key)");
    }
    console.log("");

    // ── Combined Score ──
    const combined =
      capture.scores.combined * 0.20 +
      processing.scores.combined * 0.10 +
      recall.scores.combined * 0.15 +
      decay.scores.combined * 0.10 +
      archive.scores.combined * 0.10 +
      coherence.scores.combined * 0.10 +
      velocity.scores.combined * 0.10 +
      llmAvg * 0.15;

    console.log("═══════════════════════════════════════════════");
    for (const [k, v] of Object.entries(allScores)) {
      console.log(`SCORE:${k}:${v.toFixed(4)}`);
    }
    console.log(`SCORE:llm_avg:${llmAvg.toFixed(4)}`);
    console.log(`SCORE:combined:${combined.toFixed(4)}`);
    console.log(`ISSUES:${allIssues.length}`);
    console.log("═══════════════════════════════════════════════");

    // ── Apply Fixes ──
    let action = "audit-only";
    if (fix) {
      console.log("\n=== Applying Fixes ===\n");

      const inboxArchived = archiveStaleInbox(vault, 30);
      if (inboxArchived) console.log(`  Archived ${inboxArchived} stale inbox items (>30d)`);

      const triage = triageInboxByType(vault);
      if (triage.routed) {
        console.log(`  Triaged ${triage.routed} inbox items`);
        for (const [p, c] of Object.entries(triage.details)) console.log(`    → ${p}: ${c}`);
      }

      const deduped = deduplicatePeopleFacts(vault);
      if (deduped) console.log(`  Deduplicated ${deduped} facts`);

      const crossLinks = addCrossLinks(vault);
      if (crossLinks) console.log(`  Added ${crossLinks} cross-links`);

      const dailyArchived = archiveOldDailyNotes(vault, 60);
      if (dailyArchived) console.log(`  Archived ${dailyArchived} old daily notes`);

      const logsArchived = cleanAgentLogMirrors(vault, 30);
      if (logsArchived) console.log(`  Archived ${logsArchived} old agent logs`);

      const totalFixes = inboxArchived + triage.routed + deduped + crossLinks + dailyArchived + logsArchived;
      if (totalFixes === 0) console.log("  No fixes needed this iteration");

      action = `fix:${totalFixes}`;
    }

    // ── Log ──
    appendFileSync(LOG_PATH, [
      i,
      capture.scores.combined.toFixed(4),
      processing.scores.combined.toFixed(4),
      recall.scores.combined.toFixed(4),
      decay.scores.combined.toFixed(4),
      archive.scores.combined.toFixed(4),
      coherence.scores.combined.toFixed(4),
      velocity.scores.combined.toFixed(4),
      llmAvg.toFixed(4),
      combined.toFixed(4),
      allIssues.length,
      action,
    ].join("\t") + "\n");
  }

  console.log(`\nLog: ${LOG_PATH}`);
}

main().catch(err => {
  console.error("Campaign crashed:", err);
  process.exit(1);
});
