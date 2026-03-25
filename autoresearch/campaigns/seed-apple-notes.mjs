/**
 * Apple Notes Archive Seeding Script
 *
 * Indexes 5,000+ Apple Notes into the identity graph using keyword extraction.
 * No LLM calls needed — uses filename patterns and content regex for 80%+ coverage.
 *
 * What it does:
 *   1. Classifies each note by type (call log, todo, day note, business, idea, personal)
 *   2. Extracts people, companies, and financial mentions via regex
 *   3. Upserts entities and relationships into identity-graph.db
 *   4. Builds a searchable index at ~/godmode/data/apple-notes-index.json
 *
 * Usage: node autoresearch/campaigns/seed-apple-notes.mjs [--dry-run]
 *
 * Gated by sentinel: ~/godmode/data/.apple-notes-indexed
 * Delete sentinel to re-run.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";
import { execSync } from "node:child_process";

const GODMODE_DATA = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "data");
const VAULT = process.env.OBSIDIAN_VAULT_PATH || join(homedir(), "Documents", "VAULT");
const APPLE_NOTES_DIR = join(VAULT, "99-System", "Apple Notes Archive");
const INDEX_PATH = join(GODMODE_DATA, "apple-notes-index.json");
const SENTINEL_PATH = join(GODMODE_DATA, ".apple-notes-indexed");
const GRAPH_DB = join(GODMODE_DATA, "identity-graph.db");

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

// ── Classification Patterns ─────────────────────────────────────────

const CLASSIFICATIONS = {
  call_log: {
    filename: /^(Dr\.?|Call\s+w|Call\s+-|CALL\s+Agenda|Meeting\s+w|Mtg|Call\s+Notes)/i,
    content: /\b(call\s+with|spoke\s+(with|to)|meeting\s+notes|follow\s*up)\b/i,
    value: "high",
  },
  todo: {
    filename: /^(TODAY|TODAYS|GOALS|MUSTS|CHECKLIST|PRIORITIES|TO\s*DO|ACTION\s+ITEMS)/i,
    content: null,
    value: "low",
  },
  day_note: {
    filename: /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Today\s+\d|Tomorrow\s+\d|Thurs\s+\d|Mon\s+\d|Week\s+\d)/i,
    content: null,
    value: "low",
  },
  business: {
    filename: /^(\$|revenue|funnel|marketing|campaign|ROI|lead|pricing|proposal|contract)/i,
    content: /\b(revenue|funnel|marketing|lead[s]?|pricing|ROI|ad\s+budget|conversion|close\s+rate)\b/gi,
    value: "medium",
    contentThreshold: 3, // need 3+ keyword matches
  },
  idea: {
    filename: /^(idea|THE\s+PLAN|strategy|brainstorm|vision|blueprint|concept)/i,
    content: null,
    value: "medium",
  },
  personal: {
    filename: /^(prayer|journal|meditation|workout|sobriety|recovery|gratitude|reflection)/i,
    content: null,
    value: "low",
  },
  numbered_dupe: {
    filename: /\s+\d{2,}\.(md|txt)$/i, // "Voucher Follow Up 222.md"
    content: null,
    value: "skip",
  },
};

// ── Entity Extraction Patterns ──────────────────────────────────────

const PERSON_PATTERNS = [
  /\bDr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,       // Dr. FirstName LastName
  /\bCall\s+(?:w|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi, // Call w FirstName
  /\bMeeting\s+(?:w|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
  /\b([A-Z][a-z]+)'s\s+(?:call|meeting|proposal|project)/gi, // Morgan's call
];

const COMPANY_PATTERNS = [
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc|LLC|Corp|AI|Health|Labs|App|Media|Digital|Group|Agency|Tech|Studio|Co)\b/g,
  /\b(100%\s+Chiropractic|Project\s+Alpha|OpenClaw|GodMode|ClickFunnels|GoHighLevel|Keap|HubSpot)\b/gi,
];

const MONEY_PATTERN = /\$[\d,]+(?:\.\d{2})?(?:k|K|mo|\/mo)?/g;

// ── Main ────────────────────────────────────────────────────────────

function findAllNotes(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findAllNotes(fullPath));
      } else if (entry.name.endsWith(".md")) {
        results.push(fullPath);
      }
    }
  } catch { /* skip unreadable dirs */ }
  return results;
}

function classifyNote(filename, content) {
  for (const [type, rules] of Object.entries(CLASSIFICATIONS)) {
    if (rules.filename && rules.filename.test(filename)) return type;
    if (rules.content && rules.contentThreshold) {
      const matches = content.match(rules.content);
      if (matches && matches.length >= rules.contentThreshold) return type;
    }
  }
  return "uncategorized";
}

function extractPeople(content) {
  const people = new Set();
  for (const pattern of PERSON_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1].trim();
      if (name.length > 2 && name.length < 50 && !/^(The|This|That|And|But|For|With|From)$/.test(name)) {
        people.add(name);
      }
    }
  }
  return [...people];
}

function extractCompanies(content) {
  const companies = new Set();
  for (const pattern of COMPANY_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      companies.add(match[1] || match[0]);
    }
  }
  return [...companies];
}

function extractMoney(content) {
  const matches = content.match(MONEY_PATTERN) || [];
  return matches.slice(0, 5); // max 5 financial mentions
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function upsertToGraph(entities, edges) {
  if (dryRun || !existsSync(GRAPH_DB)) return;

  try {
    // Batch inserts via sqlite3 CLI with proper escaping
    const esc = (s) => s.replace(/'/g, "''").replace(/"/g, '""');

    // Build batch SQL for entities
    const entityStmts = entities.map(e => {
      const id = slugify(e.name);
      const meta = JSON.stringify({ source: "apple-notes", ...e.meta });
      return `INSERT OR REPLACE INTO entities (id, name, kind, meta, updated_at) VALUES ('${esc(id)}', '${esc(e.name)}', '${esc(e.kind)}', '${esc(meta)}', datetime('now'));`;
    });

    // Build batch SQL for edges
    const edgeStmts = edges.map(edge => {
      const srcId = slugify(edge.src);
      const dstId = slugify(edge.dst);
      const meta = JSON.stringify({ source: "apple-notes", ...edge.meta });
      return `INSERT OR REPLACE INTO edges (src, rel, dst, meta, updated_at) VALUES ('${esc(srcId)}', '${esc(edge.rel)}', '${esc(dstId)}', '${esc(meta)}', datetime('now'));`;
    });

    // Execute in batches of 100 to avoid command line limits
    const allStmts = [...entityStmts, ...edgeStmts];
    for (let i = 0; i < allStmts.length; i += 100) {
      const batch = allStmts.slice(i, i + 100).join("\n");
      try {
        execSync(`sqlite3 "${GRAPH_DB}" "${batch}"`, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
      } catch {
        // Try one at a time for this batch
        for (const stmt of allStmts.slice(i, i + 100)) {
          try { execSync(`sqlite3 "${GRAPH_DB}" "${stmt}"`, { encoding: "utf-8" }); } catch { /* skip bad entries */ }
        }
      }
    }
  } catch (err) {
    // Non-fatal
  }
}

function main() {
  if (!force && existsSync(SENTINEL_PATH)) {
    console.log("Apple Notes already indexed. Use --force to re-index.");
    return;
  }

  console.log("Apple Notes Archive Seeding");
  console.log("══════════════════════════════════════════════");
  console.log(`Archive: ${APPLE_NOTES_DIR}`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("");

  const notes = findAllNotes(APPLE_NOTES_DIR);
  console.log(`Found ${notes.length} notes`);

  if (notes.length === 0) {
    console.log("No notes found. Nothing to index.");
    return;
  }

  const stats = { total: 0, skipped: 0, tooSmall: 0, classified: {}, peopleFound: 0, companiesFound: 0, graphEntities: 0, graphEdges: 0 };
  const index = { createdAt: new Date().toISOString(), entries: [] };
  const allEntities = [];
  const allEdges = [];
  const knownPeople = new Set();
  const knownCompanies = new Set();

  for (const notePath of notes) {
    stats.total++;

    let content;
    try {
      content = readFileSync(notePath, "utf-8");
    } catch { continue; }

    // Skip tiny files (<50 bytes)
    if (content.length < 50) {
      stats.tooSmall++;
      continue;
    }

    const filename = basename(notePath, ".md");
    const classification = classifyNote(filename, content);

    stats.classified[classification] = (stats.classified[classification] || 0) + 1;

    if (classification === "numbered_dupe") {
      stats.skipped++;
      continue;
    }

    // Extract entities from all valuable notes
    const people = extractPeople(content);
    const companies = extractCompanies(content);
    const money = extractMoney(content);

    // Build index entry
    const entry = {
      path: notePath.replace(VAULT + "/", ""),
      filename,
      classification,
      people,
      companies,
      moneyMentions: money.length,
      contentLength: content.length,
    };
    index.entries.push(entry);

    // Build graph entities + edges
    for (const person of people) {
      if (!knownPeople.has(person.toLowerCase())) {
        allEntities.push({ name: person, kind: "person", meta: { firstSeen: filename } });
        knownPeople.add(person.toLowerCase());
      }
      // Edge: TestUser → knows → Person
      allEdges.push({ src: "testuser", rel: "knows", dst: person, meta: { context: filename } });
      stats.peopleFound++;
    }

    for (const company of companies) {
      if (!knownCompanies.has(company.toLowerCase())) {
        allEntities.push({ name: company, kind: "company", meta: { firstSeen: filename } });
        knownCompanies.add(company.toLowerCase());
      }
      stats.companiesFound++;
    }
  }

  stats.graphEntities = allEntities.length;
  stats.graphEdges = allEdges.length;

  console.log("");
  console.log("=== Classification ===");
  for (const [type, count] of Object.entries(stats.classified).sort(([, a], [, b]) => b - a)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log("");
  console.log("=== Extraction ===");
  console.log(`  Total notes: ${stats.total}`);
  console.log(`  Too small (<50b): ${stats.tooSmall}`);
  console.log(`  Skipped (dupes): ${stats.skipped}`);
  console.log(`  Indexed: ${index.entries.length}`);
  console.log(`  Unique people found: ${knownPeople.size}`);
  console.log(`  Unique companies found: ${knownCompanies.size}`);
  console.log(`  Graph entities to create: ${allEntities.length}`);
  console.log(`  Graph edges to create: ${allEdges.length}`);

  if (!dryRun) {
    // Write index
    writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
    console.log(`\n  Index written: ${INDEX_PATH}`);

    // Upsert to identity graph
    if (existsSync(GRAPH_DB)) {
      console.log("  Writing to identity graph...");
      upsertToGraph(allEntities, allEdges);
      console.log("  Graph updated.");
    } else {
      console.log("  Identity graph DB not found — skipping graph writes.");
    }

    // Write sentinel
    writeFileSync(SENTINEL_PATH, new Date().toISOString());
    console.log(`  Sentinel written: ${SENTINEL_PATH}`);
  } else {
    console.log("\n  [DRY RUN] No changes written.");
  }

  console.log("");
  console.log("Done.");
}

main();
