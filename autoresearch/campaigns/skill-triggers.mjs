/**
 * Autoresearch Campaign: Optimize Skill Card Triggers
 *
 * Phase 1: Generate 30 hard routing test cases (multi-domain, slang, negation, compound, edge)
 * Phase 2: Evaluate against current triggers, report failures
 * Phase 3: Iteratively add triggers to fix failures without breaking existing tests
 *
 * Usage: node autoresearch/campaigns/skill-triggers.mjs [--iterations N]
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, "..", "..");
const EVAL_CMD = `node ${join(REPO_DIR, "autoresearch", "eval-runner.mjs")}`;
const LOG_PATH = join(__dirname, "skill-triggers-log.tsv");
const EXTENDED_TESTS_PATH = join(__dirname, "extended-routing-tests.json");
const REPO_CARDS_DIR = join(REPO_DIR, "skill-cards");
const VAULT_CARDS_DIR = join(homedir(), "godmode", "memory", "skill-cards");

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

// ── Matching algorithm (mirrors eval-runner.mjs exactly) ───────────

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

// ── Skill card loading (mirrors eval-runner.mjs) ───────────────────

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

function resolveSkillCardsDir() {
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH || join(homedir(), "Documents", "VAULT");
  const vaultCards = join(vaultPath, "99-System", "skill-cards");
  if (existsSync(vaultCards)) return vaultCards;
  const localCards = VAULT_CARDS_DIR;
  if (existsSync(localCards)) return localCards;
  const shipped = REPO_CARDS_DIR;
  if (existsSync(shipped)) return shipped;
  return null;
}

function loadSkillCards(dir) {
  if (!dir) { console.error("ERROR: No skill cards directory found"); process.exit(1); }
  const cards = [];
  for (const f of readdirSync(dir).filter(f => f.endsWith(".md"))) {
    try {
      const raw = readFileSync(join(dir, f), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      const slug = basename(f, ".md");
      const triggers = meta.triggers ? meta.triggers.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];
      const tools = meta.tools ? meta.tools.split(",").map(t => t.trim()).filter(Boolean) : [];
      cards.push({ slug, domain: meta.domain || slug, triggers, tools, body: body.trim(), file: f });
    } catch { /* skip */ }
  }
  return cards;
}

// ── Extended test cases ────────────────────────────────────────────

const EXTENDED_TESTS = [
  // Multi-domain ambiguity (8 cases)
  { message: "Save my meeting notes as a task", expected: "tasks", note: "task intent > file/calendar content" },
  { message: "Write up the research and save it to drive", expected: "files", note: "save to drive = files, even though research could be queue" },
  { message: "Remind me to check twitter tomorrow", expected: "tasks", note: "remind = tasks intent, twitter is content" },
  { message: "Schedule a call with the person I met at the conference", expected: "calendar", note: "schedule = calendar, person is context" },
  { message: "Add a note about the meeting with Sarah", expected: "second-brain", note: "note = second-brain, meeting/person is context" },
  { message: "Find what Jake tweeted about our integration", expected: "x-twitter", note: "tweeted = x-twitter, person/integration is context" },
  { message: "Queue up a draft tweet about the product launch", expected: "queue", note: "queue = queue intent, draft tweet is the task content" },
  { message: "Look up the file I saved about the team contact list", expected: "files", note: "file = files, team/contact is content" },

  // Colloquial/slang (6 cases)
  { message: "yo drop that in my notes", expected: "second-brain", note: "colloquial for saving to vault/notes" },
  { message: "nah skip the meeting", expected: "calendar", note: "skip the meeting = calendar action" },
  { message: "lemme see what's poppin on the timeline", expected: "x-twitter", note: "timeline = x-twitter" },
  { message: "bruh who even is this guy", expected: "people", note: "who is = people lookup" },
  { message: "aight throw that on my list", expected: "tasks", note: "my list = todo/task list" },
  { message: "can you just bang out that report real quick", expected: "queue", note: "bang out a report = delegate to queue" },

  // Negation (4 cases)
  { message: "Don't add this to my calendar, just note it", expected: "second-brain", note: "negation of calendar + note intent = second-brain" },
  { message: "I don't need a reminder, just look it up", expected: "second-brain", note: "negation of reminder + look up = second-brain" },
  { message: "Not a task, more of a research question", expected: "queue", note: "negation of task + research = queue" },
  { message: "This isn't for twitter, save it as a document", expected: "files", note: "negation of twitter + document = files" },

  // Compound requests (6 cases)
  { message: "Check twitter and add a task about what you find", expected: "x-twitter", note: "twitter check is primary, task is secondary" },
  { message: "Search my vault and then draft a summary for the team", expected: "second-brain", note: "vault search is primary action" },
  { message: "Look at my schedule and tell me when I can do deep work", expected: "calendar", note: "schedule is the primary lookup" },
  { message: "Find my notes on the topic and queue a research deep dive", expected: "second-brain", note: "notes lookup first, then queue — notes has more triggers" },
  { message: "Who was at the meeting and what did we discuss?", expected: "people", note: "who = people intent, meeting is context" },
  { message: "Check if the API integration is working and file a task if not", expected: "integrations", note: "integration check is primary" },

  // Edge cases (6 cases)
  { message: "bookmark this", expected: "x-twitter", note: "bookmark = x-twitter bookmarks feature" },
  { message: "what's the word on the street", expected: "x-twitter", note: "social sentiment = x-twitter discussions" },
  { message: "jot this down for me", expected: "second-brain", note: "jot down = note-taking" },
  { message: "ping Jake about the deliverable", expected: "people", note: "person-directed action" },
  { message: "offload this to someone", expected: "queue", note: "offload = delegate to queue" },
  { message: "is everything hooked up properly", expected: "integrations", note: "hooked up = integration status check" },
];

// ── Frontmatter modification ───────────────────────────────────────

function addTriggerToCard(cardDir, filename, newTrigger) {
  const filePath = join(cardDir, filename);
  if (!existsSync(filePath)) return false;
  const raw = readFileSync(filePath, "utf-8");
  const match = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) return false;

  const frontmatter = match[2];
  const lines = frontmatter.split(/\r?\n/);
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("triggers:")) {
      const existing = lines[i].slice("triggers:".length).trim();
      const triggers = existing.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      if (triggers.includes(newTrigger.toLowerCase())) return false; // already present
      lines[i] = lines[i].trimEnd() + `, ${newTrigger}`;
      modified = true;
      break;
    }
  }

  if (!modified) return false;
  const newContent = match[1] + lines.join("\n") + match[3] + match[4];
  writeFileSync(filePath, newContent);
  return true;
}

function removeTriggerFromCard(cardDir, filename, trigger) {
  const filePath = join(cardDir, filename);
  if (!existsSync(filePath)) return false;
  const raw = readFileSync(filePath, "utf-8");
  const match = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) return false;

  const frontmatter = match[2];
  const lines = frontmatter.split(/\r?\n/);
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("triggers:")) {
      const existing = lines[i].slice("triggers:".length).trim();
      const triggers = existing.split(",").map(t => t.trim()).filter(Boolean);
      const filtered = triggers.filter(t => t.toLowerCase() !== trigger.toLowerCase());
      if (filtered.length === triggers.length) return false; // wasn't there
      lines[i] = "triggers: " + filtered.join(", ");
      modified = true;
      break;
    }
  }

  if (!modified) return false;
  const newContent = match[1] + lines.join("\n") + match[3] + match[4];
  writeFileSync(filePath, newContent);
  return true;
}

// ── Run eval-runner and extract skill_precision ────────────────────

function runEval() {
  try {
    const output = execSync(EVAL_CMD, { encoding: "utf-8", timeout: 60_000 });
    const match = output.match(/SCORE:skill_precision:([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
  } catch (err) {
    console.error("  Eval runner failed:", err.message?.split("\n")[0]);
    return null;
  }
}

// ── Determine best trigger word to add ─────────────────────────────

function suggestTrigger(message, expectedDomain) {
  // Extract candidate words/phrases from the message that might be good triggers
  const msg = message.toLowerCase();
  const words = msg.split(/\s+/).filter(w => w.length > 2);

  // Also try common 2-word phrases
  const phrases = [];
  const tokens = msg.split(/\s+/);
  for (let i = 0; i < tokens.length - 1; i++) {
    phrases.push(`${tokens[i]} ${tokens[i + 1]}`);
  }

  // Domain-specific heuristic candidates
  const domainHints = {
    "calendar": ["schedule", "meeting", "calendar", "event", "reschedule", "skip the meeting", "call"],
    "tasks": ["task", "todo", "remind", "reminder", "list", "to-do", "need to"],
    "queue": ["queue", "delegate", "research", "draft", "offload", "bang out", "report"],
    "second-brain": ["note", "notes", "vault", "jot", "look up", "knowledge", "brain", "jot this down"],
    "x-twitter": ["tweet", "twitter", "timeline", "bookmark", "bookmarks", "trending", "tweeted", "poppin"],
    "files": ["file", "save", "document", "drive", "export", "artifact"],
    "people": ["who", "person", "contact", "team", "met with", "who is", "who even"],
    "integrations": ["integration", "connect", "hooked up", "broken", "working", "setup", "configure"],
  };

  const hints = domainHints[expectedDomain] || [];

  // Find words from the message that would uniquely help route to expected domain
  // Prefer words that are in the message and in the domain hints
  const candidates = [];

  for (const hint of hints) {
    if (msg.includes(hint)) {
      candidates.push(hint);
    }
  }

  // Also consider standalone words from the message
  for (const word of words) {
    if (!candidates.includes(word) && word.length > 3) {
      candidates.push(word);
    }
  }

  // Also consider 2-word phrases
  for (const phrase of phrases) {
    if (!candidates.includes(phrase) && phrase.length > 5) {
      candidates.push(phrase);
    }
  }

  return candidates;
}

// ── Main campaign ──────────────────────────────────────────────────

async function main() {
  const { iterations } = parseArgs();
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║   Skill Triggers Optimization Campaign       ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);

  // ── Phase 1: Write extended test cases ─────────────────────────
  console.log("── Phase 1: Generate extended test cases ──\n");

  writeFileSync(EXTENDED_TESTS_PATH, JSON.stringify({
    description: "Extended routing tests — hard cases for skill card trigger optimization",
    generated: new Date().toISOString(),
    categories: {
      "multi_domain_ambiguity": "Messages that reference multiple domains — tests which signal wins",
      "colloquial_slang": "Informal language that should still route correctly",
      "negation": "Messages that negate one domain — should route to the intended one",
      "compound_requests": "Multi-step requests — tests which action is primary",
      "edge_cases": "Unusual phrasing or ambiguous intent"
    },
    tests: EXTENDED_TESTS
  }, null, 2));

  console.log(`Wrote ${EXTENDED_TESTS.length} extended test cases to:`);
  console.log(`  ${EXTENDED_TESTS_PATH}\n`);

  // ── Phase 2: Evaluate new cases against current triggers ───────
  console.log("── Phase 2: Evaluate extended cases against current triggers ──\n");

  const activeDir = resolveSkillCardsDir();
  console.log(`Active skill cards directory: ${activeDir}\n`);

  let cards = loadSkillCards(activeDir);
  console.log(`Loaded ${cards.length} skill cards: ${cards.map(c => c.domain).join(", ")}\n`);

  const failures = [];
  const passes = [];

  for (const test of EXTENDED_TESTS) {
    const got = matchSkillCard(cards, test.message)?.domain ?? null;
    if (got === test.expected) {
      passes.push(test);
      console.log(`  [OK]   "${test.message}" → ${got}`);
    } else {
      failures.push({ ...test, got });
      console.log(`  [FAIL] "${test.message}" → ${got ?? "null"} (expected: ${test.expected})`);
    }
  }

  console.log(`\nPhase 2 results: ${passes.length} passed, ${failures.length} failed out of ${EXTENDED_TESTS.length}\n`);

  if (failures.length === 0) {
    console.log("All extended tests already pass. Nothing to optimize.\n");
    return;
  }

  // ── Phase 3: Iteratively optimize ──────────────────────────────
  console.log("── Phase 3: Iterative optimization ──\n");

  // Initialize log file
  if (!existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, "iteration\tmessage\texpected\tgot\ttrigger_added\tcard_modified\tstatus\n");
  }

  // Get baseline score (original 88 tests)
  console.log("Running baseline eval...");
  const baselineScore = runEval();
  console.log(`Baseline skill_precision: ${baselineScore}\n`);

  if (baselineScore === null) {
    console.error("Could not get baseline score. Aborting.\n");
    return;
  }

  let iteration = 0;
  let fixed = 0;
  let skipped = 0;
  const maxIterations = Math.min(iterations, failures.length);

  // Determine which card dirs to modify (repo + vault if both exist)
  const cardDirs = [REPO_CARDS_DIR];
  if (existsSync(VAULT_CARDS_DIR) && VAULT_CARDS_DIR !== activeDir) {
    cardDirs.push(VAULT_CARDS_DIR);
  } else if (existsSync(VAULT_CARDS_DIR)) {
    // activeDir IS vault, still need to sync to repo
    if (!cardDirs.includes(VAULT_CARDS_DIR)) cardDirs.unshift(VAULT_CARDS_DIR);
  }
  // Ensure both dirs are in the list
  if (existsSync(VAULT_CARDS_DIR) && !cardDirs.includes(VAULT_CARDS_DIR)) {
    cardDirs.push(VAULT_CARDS_DIR);
  }

  console.log(`Will modify cards in: ${cardDirs.join(", ")}\n`);

  for (const failure of failures) {
    if (iteration >= maxIterations) break;
    iteration++;

    console.log(`\n── Iteration ${iteration}/${maxIterations} ──`);
    console.log(`  Message:  "${failure.message}"`);
    console.log(`  Expected: ${failure.expected}`);
    console.log(`  Got:      ${failure.got ?? "null"}`);

    // Find the target card file
    const targetCard = cards.find(c => c.domain === failure.expected);
    if (!targetCard) {
      console.log(`  SKIP: No card found for domain "${failure.expected}"`);
      appendFileSync(LOG_PATH, `${iteration}\t${failure.message}\t${failure.expected}\t${failure.got ?? "null"}\t-\t-\tskip_no_card\n`);
      skipped++;
      continue;
    }

    // Get candidate triggers
    const candidates = suggestTrigger(failure.message, failure.expected);
    if (candidates.length === 0) {
      console.log(`  SKIP: No candidate triggers found`);
      appendFileSync(LOG_PATH, `${iteration}\t${failure.message}\t${failure.expected}\t${failure.got ?? "null"}\t-\t${targetCard.file}\tskip_no_candidates\n`);
      skipped++;
      continue;
    }

    let foundFix = false;

    for (const candidate of candidates) {
      // Check: would adding this trigger fix the failing case?
      const testCards = loadSkillCards(activeDir);
      const testCard = testCards.find(c => c.domain === failure.expected);
      if (!testCard) continue;

      // Simulate adding the trigger
      testCard.triggers.push(candidate.toLowerCase());
      const simResult = matchSkillCard(testCards, failure.message)?.domain ?? null;

      if (simResult !== failure.expected) {
        // This trigger wouldn't fix it
        continue;
      }

      // Check: would this trigger break any existing tests?
      // Load original test suite and check all routing tests
      const testSuite = JSON.parse(readFileSync(join(REPO_DIR, "autoresearch", "test-suite.json"), "utf-8"));
      let wouldBreak = false;

      for (const existingTest of testSuite.skill_routing.tests) {
        const got = matchSkillCard(testCards, existingTest.message)?.domain ?? null;
        if (got !== existingTest.expected) {
          console.log(`  Candidate "${candidate}" would break: "${existingTest.message}" (${existingTest.expected} → ${got})`);
          wouldBreak = true;
          break;
        }
      }

      // Also check other extended tests that already pass
      if (!wouldBreak) {
        for (const passedTest of passes) {
          const got = matchSkillCard(testCards, passedTest.message)?.domain ?? null;
          if (got !== passedTest.expected) {
            console.log(`  Candidate "${candidate}" would break extended: "${passedTest.message}" (${passedTest.expected} → ${got})`);
            wouldBreak = true;
            break;
          }
        }
      }

      // Also check other already-fixed failures
      if (!wouldBreak) {
        for (const otherFailure of failures) {
          if (otherFailure === failure) continue;
          if (otherFailure._fixed) {
            const got = matchSkillCard(testCards, otherFailure.message)?.domain ?? null;
            if (got !== otherFailure.expected) {
              console.log(`  Candidate "${candidate}" would break fixed: "${otherFailure.message}" (${otherFailure.expected} → ${got})`);
              wouldBreak = true;
              break;
            }
          }
        }
      }

      if (wouldBreak) continue;

      // Apply the trigger to all card directories
      console.log(`  Adding trigger "${candidate}" to ${targetCard.file}`);
      for (const dir of cardDirs) {
        addTriggerToCard(dir, targetCard.file, candidate);
      }

      // Verify with full eval runner (original tests)
      const newScore = runEval();
      console.log(`  Eval score after: ${newScore} (baseline: ${baselineScore})`);

      if (newScore !== null && newScore >= baselineScore) {
        // Keep the change
        console.log(`  KEPT — no regression`);
        appendFileSync(LOG_PATH, `${iteration}\t${failure.message}\t${failure.expected}\t${failure.got ?? "null"}\t${candidate}\t${targetCard.file}\tkept\n`);
        failure._fixed = true;
        fixed++;
        foundFix = true;

        // Reload cards for future iterations
        cards = loadSkillCards(activeDir);
        break;
      } else {
        // Revert
        console.log(`  REVERTED — regression detected`);
        for (const dir of cardDirs) {
          removeTriggerFromCard(dir, targetCard.file, candidate);
        }
        appendFileSync(LOG_PATH, `${iteration}\t${failure.message}\t${failure.expected}\t${failure.got ?? "null"}\t${candidate}\t${targetCard.file}\treverted\n`);
      }
    }

    if (!foundFix) {
      console.log(`  SKIP: No safe trigger found for this case`);
      appendFileSync(LOG_PATH, `${iteration}\t${failure.message}\t${failure.expected}\t${failure.got ?? "null"}\t-\t${targetCard.file}\tskip_no_safe_trigger\n`);
      skipped++;
    }
  }

  // ── Final report ─────────────────────────────────────────────────
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║   Campaign Complete                           ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);

  // Re-run all tests (original + extended) for final tally
  const finalCards = loadSkillCards(activeDir);
  const testSuite = JSON.parse(readFileSync(join(REPO_DIR, "autoresearch", "test-suite.json"), "utf-8"));

  let origPass = 0, origFail = 0;
  for (const test of testSuite.skill_routing.tests) {
    const got = matchSkillCard(finalCards, test.message)?.domain ?? null;
    if (got === test.expected) origPass++;
    else origFail++;
  }

  let extPass = 0, extFail = 0;
  const remainingFailures = [];
  for (const test of EXTENDED_TESTS) {
    const got = matchSkillCard(finalCards, test.message)?.domain ?? null;
    if (got === test.expected) extPass++;
    else {
      extFail++;
      remainingFailures.push({ message: test.message, expected: test.expected, got: got ?? "null" });
    }
  }

  console.log(`Original tests: ${origPass}/${origPass + origFail} (${((origPass / (origPass + origFail)) * 100).toFixed(1)}%)`);
  console.log(`Extended tests: ${extPass}/${extPass + extFail} (${((extPass / (extPass + extFail)) * 100).toFixed(1)}%)`);
  console.log(`Combined:       ${origPass + extPass}/${origPass + origFail + extPass + extFail} (${(((origPass + extPass) / (origPass + origFail + extPass + extFail)) * 100).toFixed(1)}%)`);
  console.log(`\nTriggers added: ${fixed}`);
  console.log(`Cases skipped:  ${skipped}`);
  console.log(`Log: ${LOG_PATH}\n`);

  if (remainingFailures.length > 0) {
    console.log("Remaining extended test failures:");
    for (const f of remainingFailures) {
      console.log(`  "${f.message}" → ${f.got} (expected: ${f.expected})`);
    }
    console.log();
  }

  // Final eval runner score
  const finalScore = runEval();
  console.log(`Final eval skill_precision: ${finalScore}`);
}

main().catch(err => {
  console.error("Campaign failed:", err);
  process.exit(1);
});
