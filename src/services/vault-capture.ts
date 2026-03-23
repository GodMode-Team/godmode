/**
 * vault-capture.ts — Zero-discipline auto-capture pipelines for the Second Brain.
 *
 * Five pipelines that run automatically on each consciousness heartbeat tick:
 *
 *   1. Scout → Vault (Smart Routing): Routes findings directly to the right PARA
 *      folder — X intel as daily digests in Discoveries, releases in Discoveries,
 *      ClawHub skills in Resources/Skills. No inbox dumping.
 *   2. Sessions → Daily: Appends Claude Code session summaries to VAULT/01-Daily/
 *   3. Queue Outputs → Inbox: Copies agent outputs to vault inbox for triage
 *   4. Inbox → PARA: Auto-categorizes mature inbox items (24h+ old) into PARA folders
 *   5. Progressive Summarization: Enhances substantial human-authored notes (7d+)
 *
 * All pipelines are idempotent, non-destructive, and fail silently.
 * The vault grows automatically — zero discipline required.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile, readFile, rename, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR, DATA_DIR } from "../data-paths.js";
import {
  getVaultPath,
  VAULT_FOLDERS,
  BRAIN_SUBFOLDERS,
  ensureVaultStructure,
} from "../lib/vault-paths.js";
import { localDateString, DATA_DIR as GM_DATA_DIR } from "../data-paths.js";

// ── Scout types (inlined from deleted scout.ts) ─────────────────────

type ScoutSourceId = "openclaw-docs" | "godmode-docs" | "x-intel" | "clawhub";

type ScoutFinding = {
  id: string;
  source: ScoutSourceId;
  title: string;
  summary: string;
  url?: string;
  keywords: string[];
  discoveredAt: number;
  acknowledged: boolean;
};

type ScoutState = {
  lastCheckAt: Record<string, number>;
  lastContentHash: Record<string, string>;
  findings: ScoutFinding[];
};

async function readScoutState(): Promise<ScoutState> {
  try {
    const raw = await readFile(join(GM_DATA_DIR, "scout-state.json"), "utf-8");
    return JSON.parse(raw) as ScoutState;
  } catch {
    return { lastCheckAt: {}, lastContentHash: {}, findings: [] };
  }
}

// ── Types ──────────────────────────────────────────────────────────────

type CaptureResult = {
  captured: number;
  skipped: number;
  errors: string[];
};

type InboxProcessResult = {
  processed: number;
  skipped: number;
  errors: string[];
  moves: Array<{ from: string; to: string; reason: string }>;
};

type SummarizationResult = {
  summarized: number;
  skipped: number;
};

import type { Logger } from "../types/plugin-api.js";

// ── State Tracking ─────────────────────────────────────────────────────

type CaptureState = {
  /** Scout finding IDs already written to vault inbox */
  capturedScoutIds: string[];
  /** Session file paths already written to daily notes */
  capturedSessionPaths: string[];
  /** Inbox files already processed (moved to PARA) */
  processedInboxFiles: string[];
  /** Note paths already summarized (progressive summarization) */
  summarizedNotes: Record<string, number>; // path → layer reached (1-3)
  lastRun: string;
};

const CAPTURE_STATE_FILE = join(DATA_DIR, "vault-capture-state.json");

async function loadCaptureState(): Promise<CaptureState> {
  try {
    const raw = await readFile(CAPTURE_STATE_FILE, "utf-8");
    return JSON.parse(raw) as CaptureState;
  } catch {
    return {
      capturedScoutIds: [],
      capturedSessionPaths: [],
      processedInboxFiles: [],
      summarizedNotes: {},
      lastRun: "",
    };
  }
}

async function saveCaptureState(state: CaptureState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CAPTURE_STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── Helpers ────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Parse YAML frontmatter from a markdown file. Returns key-value pairs. */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
      result[key] = value;
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 1: Scout Findings → Vault (Smart Routing)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Route scout findings to the RIGHT place — not a blanket inbox dump.
 *
 * Routing:
 *   - X Intelligence: Batched into a single daily digest at
 *     VAULT/10-Discoveries/{date}-x-intelligence.md (appended, not one-note-per-tweet)
 *   - OpenClaw/GodMode releases: Individual notes in VAULT/10-Discoveries/
 *   - ClawHub skills: Individual notes in VAULT/04-Resources/Skills/
 *
 * Inbox is reserved for user-created captures and agent outputs — things
 * that actually need human triage. Scout findings are pre-categorized.
 */
export async function captureScoutToVault(logger: Logger): Promise<CaptureResult> {
  const vault = getVaultPath();
  if (!vault) return { captured: 0, skipped: 0, errors: [] };

  const state = await loadCaptureState();
  const scoutState = await readScoutState();
  const capturedSet = new Set(state.capturedScoutIds);

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  const discoveriesDir = join(vault, VAULT_FOLDERS.discoveries);
  const skillsDir = join(vault, VAULT_FOLDERS.resources, "Skills");
  await mkdir(discoveriesDir, { recursive: true });
  await mkdir(skillsDir, { recursive: true });

  // Batch X intel findings by date for daily digest
  const xIntelByDate = new Map<string, ScoutFinding[]>();

  for (const finding of scoutState.findings) {
    if (capturedSet.has(finding.id)) {
      skipped++;
      continue;
    }

    try {
      if (finding.source === "x-intel") {
        // Batch X intel for daily digest
        const date = localDateString(new Date(finding.discoveredAt));
        if (!xIntelByDate.has(date)) xIntelByDate.set(date, []);
        xIntelByDate.get(date)!.push(finding);
        state.capturedScoutIds.push(finding.id);
        continue;
      }

      const date = localDateString(new Date(finding.discoveredAt));
      const slug = slugify(finding.title);
      const filename = `${date}-${slug}.md`;

      // Route: releases → Discoveries, skills → Resources/Skills
      const destDir = finding.source === "clawhub" ? skillsDir : discoveriesDir;
      const destPath = join(destDir, filename);

      if (existsSync(destPath)) {
        skipped++;
        state.capturedScoutIds.push(finding.id);
        continue;
      }

      const frontmatter = [
        "---",
        `type: ${finding.source === "clawhub" ? "skill" : "release"}`,
        `source: scout/${finding.source}`,
        `title: "${finding.title.replace(/"/g, '\\"')}"`,
        finding.url ? `url: "${finding.url}"` : null,
        `discoveredAt: ${new Date(finding.discoveredAt).toISOString()}`,
        `tags: [${finding.source}]`,
        "---",
      ]
        .filter(Boolean)
        .join("\n");

      const body = [
        `# ${finding.title}`,
        "",
        finding.summary,
        "",
        finding.url ? `[View source](${finding.url})` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await writeFile(destPath, `${frontmatter}\n\n${body}\n`, "utf-8");
      captured++;
      state.capturedScoutIds.push(finding.id);
    } catch (err) {
      errors.push(`${finding.id}: ${String(err)}`);
      state.capturedScoutIds.push(finding.id); // Don't retry on error
    }
  }

  // Write X intelligence daily digests (one note per day, appended)
  for (const [date, findings] of xIntelByDate) {
    try {
      const digestPath = join(discoveriesDir, `${date}-x-intelligence.md`);
      let existing = "";

      if (existsSync(digestPath)) {
        existing = readFileSync(digestPath, "utf-8");
      } else {
        // Create new digest with frontmatter
        existing = [
          "---",
          `type: x-intelligence-digest`,
          `source: scout/x-intel`,
          `date: ${date}`,
          `tags: [x-intel, digest]`,
          "---",
          "",
          `# X Intelligence — ${date}`,
          "",
        ].join("\n");
      }

      // Append new findings
      const newEntries: string[] = [];
      for (const f of findings) {
        const time = new Date(f.discoveredAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        const urlLine = f.url ? ` ([link](${f.url}))` : "";
        newEntries.push(`### ${time}${urlLine}`);
        newEntries.push("");
        newEntries.push(f.summary);
        newEntries.push("");
      }

      await writeFile(digestPath, existing + newEntries.join("\n"), "utf-8");
      captured += findings.length;
    } catch (err) {
      errors.push(`x-intel-digest-${date}: ${String(err)}`);
    }
  }

  // Prune old captured IDs (keep last 500)
  if (state.capturedScoutIds.length > 500) {
    state.capturedScoutIds = state.capturedScoutIds.slice(-500);
  }

  state.lastRun = new Date().toISOString();
  await saveCaptureState(state);

  if (captured > 0) {
    logger.info(`[VaultCapture] Scout→Vault: ${captured} findings routed`);
  }

  return { captured, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 2: Claude Code Sessions → Vault Daily Notes
// ═══════════════════════════════════════════════════════════════════════

/**
 * Append Claude Code session summaries to the vault's daily note.
 * Reads from the agent-log JSON and writes a ## Agent Sessions section
 * to VAULT/01-Daily/{date}.md (creates if doesn't exist, appends if it does).
 */
export async function captureSessionsToDailyNotes(logger: Logger): Promise<CaptureResult> {
  const vault = getVaultPath();
  if (!vault) return { captured: 0, skipped: 0, errors: [] };

  const state = await loadCaptureState();
  const capturedSet = new Set(state.capturedSessionPaths);

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  const dailyDir = join(vault, VAULT_FOLDERS.daily);
  await mkdir(dailyDir, { recursive: true });

  // Also mirror agent-log markdown to VAULT/07-Agent-Log/
  const agentLogVaultDir = join(vault, VAULT_FOLDERS.agentLog);
  await mkdir(agentLogVaultDir, { recursive: true });

  // Read today's agent-log JSON
  const today = localDateString();
  const agentLogJsonPath = join(MEMORY_DIR, "agent-log", `${today}.json`);
  const agentLogMdPath = join(MEMORY_DIR, "agent-log", `${today}.md`);

  // Mirror agent-log markdown to vault
  if (existsSync(agentLogMdPath)) {
    try {
      await copyFile(agentLogMdPath, join(agentLogVaultDir, `${today}.md`));
    } catch { /* non-fatal */ }
  }

  if (!existsSync(agentLogJsonPath)) {
    return { captured: 0, skipped: 0, errors: [] };
  }

  try {
    const raw = await readFile(agentLogJsonPath, "utf-8");
    const log = JSON.parse(raw) as {
      completed?: Array<{
        item: string;
        output?: string;
        completedAt: number;
        duration?: string;
      }>;
    };

    if (!log.completed || log.completed.length === 0) {
      return { captured: 0, skipped: 0, errors: [] };
    }

    // Filter to Claude Code sessions we haven't captured yet
    const newSessions = log.completed.filter((entry) => {
      if (!entry.item.startsWith("Claude Code session:")) return false;
      const sessionKey = `${today}:${entry.completedAt}`;
      if (capturedSet.has(sessionKey)) return false;
      return true;
    });

    if (newSessions.length === 0) {
      return { captured: 0, skipped: 0, errors: [] };
    }

    // Build the agent sessions section
    const sessionLines: string[] = [];
    for (const session of newSessions) {
      const time = new Date(session.completedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      sessionLines.push(`- **${time}** — ${session.item}`);
      if (session.output) {
        sessionLines.push(`  - ${session.output}`);
      }

      state.capturedSessionPaths.push(`${today}:${session.completedAt}`);
      captured++;
    }

    // Read existing daily note — never create a minimal stub.
    // If the brief generator hasn't run yet, we skip writing and DON'T mark
    // sessions as captured so they get appended on the next tick after the
    // real brief is generated.
    const dailyNotePath = join(dailyDir, `${today}.md`);

    if (!existsSync(dailyNotePath)) {
      // No daily note yet — brief generator hasn't run. Defer.
      logger.info(
        `[VaultCapture] Sessions→Daily: skipping ${captured} sessions — daily note not yet generated`,
      );
      // Undo the captured tracking so these get picked up next time
      state.capturedSessionPaths = state.capturedSessionPaths.filter(
        (p) => !p.startsWith(`${today}:`),
      );
      captured = 0;
      await saveCaptureState(state);
      return { captured: 0, skipped: newSessions.length, errors };
    }

    let existingContent = await readFile(dailyNotePath, "utf-8");

    // Check if ## Agent Sessions section already exists
    if (existingContent.includes("## Agent Sessions")) {
      // Append to existing section (before the next ## heading or end of file)
      const sectionStart = existingContent.indexOf("## Agent Sessions");
      const afterSection = existingContent.slice(sectionStart);
      const nextHeading = afterSection.indexOf("\n## ", 1);

      const before = existingContent.slice(0, sectionStart + "## Agent Sessions\n\n".length);
      const existingSessionContent = nextHeading > 0
        ? afterSection.slice("## Agent Sessions\n\n".length, nextHeading)
        : afterSection.slice("## Agent Sessions\n\n".length);
      const after = nextHeading > 0 ? afterSection.slice(nextHeading) : "";

      existingContent = before + existingSessionContent + sessionLines.join("\n") + "\n" + after;
    } else {
      // Append new section at the end
      existingContent += `\n## Agent Sessions\n\n${sessionLines.join("\n")}\n`;
    }

    await writeFile(dailyNotePath, existingContent, "utf-8");

    if (captured > 0) {
      logger.info(`[VaultCapture] Sessions→Daily: ${captured} sessions written to ${today}.md`);
    }
  } catch (err) {
    errors.push(`daily-note: ${String(err)}`);
  }

  // Prune old session IDs (keep last 200)
  if (state.capturedSessionPaths.length > 200) {
    state.capturedSessionPaths = state.capturedSessionPaths.slice(-200);
  }

  await saveCaptureState(state);
  return { captured, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 3: Inbox Auto-Processing (PARA Categorization)
// ═══════════════════════════════════════════════════════════════════════

/** Classification rules for auto-routing inbox items.
 * Scout findings are routed directly by Pipeline 1 — they never land in inbox.
 * These rules handle user captures, agent outputs, and other ad-hoc inbox items. */
const CLASSIFICATION_RULES: Array<{
  match: (fm: Record<string, string>, content: string, filename: string) => boolean;
  dest: string;
  reason: string;
}> = [
  // Research-tagged items → Resources/Research
  {
    match: (fm, content) =>
      fm.type === "research" ||
      fm.tags?.includes("research") ||
      content.toLowerCase().includes("## research") ||
      content.toLowerCase().includes("## findings"),
    dest: join(VAULT_FOLDERS.resources, "Research"),
    reason: "Research content detected",
  },
  // People mentions → Brain/People
  {
    match: (fm) =>
      fm.type === "person" || fm.type === "people" || fm.tags?.includes("person"),
    dest: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.people),
    reason: "Person profile detected",
  },
  // Company mentions → Brain/Companies
  {
    match: (fm) =>
      fm.type === "company" || fm.tags?.includes("company"),
    dest: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.companies),
    reason: "Company profile detected",
  },
  // Project-related → Projects
  {
    match: (fm) =>
      fm.type === "project" || fm.tags?.includes("project"),
    dest: VAULT_FOLDERS.projects,
    reason: "Project content detected",
  },
  // Knowledge/learning → Brain/Knowledge
  {
    match: (fm, content) =>
      fm.type === "knowledge" ||
      fm.type === "learning" ||
      fm.type === "insight" ||
      fm.tags?.includes("knowledge") ||
      content.toLowerCase().includes("## key takeaways") ||
      content.toLowerCase().includes("## lessons learned"),
    dest: join(VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge),
    reason: "Knowledge content detected",
  },
  // Agent outputs → Agent Log
  {
    match: (fm, _content, filename) =>
      fm.source === "queue-agent" ||
      fm.type === "agent-output" ||
      /^[a-z]+-[a-f0-9]{6}\.md$/.test(filename),
    dest: VAULT_FOLDERS.agentLog,
    reason: "Agent output detected",
  },
];

/** Minimum age (ms) before inbox items are auto-processed. Gives user time to review. */
const INBOX_MIN_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Process mature inbox items and route them to proper PARA folders.
 * Items must be at least 24 hours old to give the user time to review.
 * Uses frontmatter tags and content heuristics for classification.
 * Items that can't be classified stay in inbox (never deleted).
 */
export async function processVaultInbox(logger: Logger): Promise<InboxProcessResult> {
  const vault = getVaultPath();
  if (!vault) return { processed: 0, skipped: 0, errors: [], moves: [] };

  const state = await loadCaptureState();
  const processedSet = new Set(state.processedInboxFiles);

  let processed = 0;
  let skipped = 0;
  const errors: string[] = [];
  const moves: Array<{ from: string; to: string; reason: string }> = [];

  const inboxDir = join(vault, VAULT_FOLDERS.inbox);
  if (!existsSync(inboxDir)) return { processed: 0, skipped: 0, errors: [], moves: [] };

  const now = Date.now();

  let files: string[];
  try {
    files = readdirSync(inboxDir).filter(
      (f) => !f.startsWith(".") && !f.startsWith("_") && (f.endsWith(".md") || f.endsWith(".txt")),
    );
  } catch {
    return { processed: 0, skipped: 0, errors: [], moves: [] };
  }

  for (const file of files) {
    if (processedSet.has(file)) {
      skipped++;
      continue;
    }

    const filePath = join(inboxDir, file);

    // Check age — skip if too new
    try {
      const st = statSync(filePath);
      if (now - st.mtimeMs < INBOX_MIN_AGE_MS) {
        skipped++;
        continue;
      }
    } catch {
      continue;
    }

    try {
      const content = readFileSync(filePath, "utf-8");
      const fm = parseFrontmatter(content);

      // Try each classification rule
      let matched = false;
      for (const rule of CLASSIFICATION_RULES) {
        if (rule.match(fm, content, file)) {
          const destDir = join(vault, rule.dest);
          await mkdir(destDir, { recursive: true });

          const destPath = join(destDir, file);
          if (!existsSync(destPath)) {
            // Move the file (rename within vault)
            await rename(filePath, destPath);
            moves.push({ from: `00-Inbox/${file}`, to: `${rule.dest}/${file}`, reason: rule.reason });
            processed++;
          } else {
            // File already exists at destination — just remove from inbox tracking
            skipped++;
          }

          state.processedInboxFiles.push(file);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Unclassifiable — leave in inbox, mark as checked so we don't re-scan
        // But only mark after 24 hours so we retry classification as more context arrives
        try {
          const st = statSync(filePath);
          if (now - st.mtimeMs > 24 * 60 * 60 * 1000) {
            state.processedInboxFiles.push(file);
          }
        } catch { /* skip */ }
        skipped++;
      }
    } catch (err) {
      errors.push(`${file}: ${String(err)}`);
    }
  }

  // Prune old processed files list (keep last 500)
  if (state.processedInboxFiles.length > 500) {
    state.processedInboxFiles = state.processedInboxFiles.slice(-500);
  }

  await saveCaptureState(state);

  if (processed > 0) {
    logger.info(
      `[VaultCapture] Inbox→PARA: ${processed} items auto-categorized — ` +
        moves.map((m) => `${m.from} → ${m.to}`).join(", "),
    );
  }

  return { processed, skipped, errors, moves };
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 4: Progressive Summarization
// ═══════════════════════════════════════════════════════════════════════

/**
 * Progressive summarization for substantial, human-authored notes only.
 *
 * Layer 1 (7+ days):  TL;DR callout from first real paragraph
 * Layer 2 (30+ days): Key Insights extracted from bold text
 * Layer 3 (60+ days): Connections to related vault notes
 *
 * SKIPS: Scout-generated notes, daily digests, agent outputs, short notes (<500 chars).
 * Only enhances research, knowledge, people, and company profiles that have
 * real substance worth distilling.
 *
 * Heuristic-based (fast, offline, deterministic). AI summarization can be
 * layered on via queue agents later.
 */
const LAYER_1_AGE_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days
const LAYER_2_AGE_MS = 30 * 24 * 60 * 60 * 1000;  // 30 days
const LAYER_3_AGE_MS = 60 * 24 * 60 * 60 * 1000;  // 60 days
const MAX_NOTES_PER_RUN = 5; // Conservative — don't over-process
const MIN_CONTENT_LENGTH = 500; // Skip short notes

export async function runProgressiveSummarization(logger: Logger): Promise<SummarizationResult> {
  const vault = getVaultPath();
  if (!vault) return { summarized: 0, skipped: 0 };

  const state = await loadCaptureState();
  const now = Date.now();
  let summarized = 0;
  let skipped = 0;

  // Only scan folders with substantial, human-authored content.
  // Skip Discoveries (mostly auto-generated scout digests) and Agent Log.
  const foldersToScan = [
    join(vault, VAULT_FOLDERS.resources, "Research"),
    join(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge),
    join(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.people),
    join(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.companies),
  ];

  for (const folder of foldersToScan) {
    if (!existsSync(folder)) continue;
    if (summarized >= MAX_NOTES_PER_RUN) break;

    let files: string[];
    try {
      files = readdirSync(folder).filter(
        (f) => f.endsWith(".md") && !f.startsWith(".") && !f.startsWith("_"),
      );
    } catch {
      continue;
    }

    for (const file of files) {
      if (summarized >= MAX_NOTES_PER_RUN) break;

      const filePath = join(folder, file);
      const relPath = filePath.replace(vault + "/", "");
      const currentLayer = state.summarizedNotes[relPath] ?? 0;

      try {
        const st = statSync(filePath);
        const age = now - st.mtimeMs;

        // Determine target layer based on age
        let targetLayer = 0;
        if (age >= LAYER_3_AGE_MS) targetLayer = 3;
        else if (age >= LAYER_2_AGE_MS) targetLayer = 2;
        else if (age >= LAYER_1_AGE_MS) targetLayer = 1;

        if (targetLayer <= currentLayer) {
          skipped++;
          continue;
        }

        const content = readFileSync(filePath, "utf-8");
        const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, "");

        // Skip short notes — only summarize substantial content
        if (contentWithoutFrontmatter.trim().length < MIN_CONTENT_LENGTH) {
          state.summarizedNotes[relPath] = targetLayer; // Don't re-check
          skipped++;
          continue;
        }

        // Skip auto-generated notes (scout digests, agent outputs)
        // These are already structured and don't benefit from summarization
        if (
          content.includes("source: scout/") ||
          content.includes("source: queue-agent") ||
          content.includes("type: x-intelligence-digest") ||
          content.includes("type: agent-output") ||
          content.includes("type: release") ||
          content.includes("type: skill")
        ) {
          state.summarizedNotes[relPath] = targetLayer;
          skipped++;
          continue;
        }

        // Skip notes that already have manual summaries
        if (content.includes("## Summary") || content.includes("## TL;DR")) {
          state.summarizedNotes[relPath] = Math.max(currentLayer, 1);
          skipped++;
          continue;
        }

        let updatedContent = content;

        if (targetLayer >= 1 && currentLayer < 1) {
          updatedContent = addLayer1Summary(updatedContent);
        }

        if (targetLayer >= 2 && currentLayer < 2) {
          updatedContent = addLayer2KeyInsights(updatedContent);
        }

        if (targetLayer >= 3 && currentLayer < 3) {
          updatedContent = addLayer3Connections(updatedContent, vault, relPath);
        }

        if (updatedContent !== content) {
          await writeFile(filePath, updatedContent, "utf-8");
          state.summarizedNotes[relPath] = targetLayer;
          summarized++;
        } else {
          state.summarizedNotes[relPath] = targetLayer;
          skipped++;
        }
      } catch {
        skipped++;
      }
    }
  }

  // Prune stale entries from summarizedNotes (keep last 1000)
  const entries = Object.entries(state.summarizedNotes);
  if (entries.length > 1000) {
    state.summarizedNotes = Object.fromEntries(entries.slice(-1000));
  }

  await saveCaptureState(state);

  if (summarized > 0) {
    logger.info(`[VaultCapture] Progressive summarization: ${summarized} notes enhanced`);
  }

  return { summarized, skipped };
}

/** Layer 1: Extract first meaningful paragraph as a TL;DR callout. */
function addLayer1Summary(content: string): string {
  // Find the first substantial paragraph (> 50 chars, not a heading)
  const contentBody = content.replace(/^---[\s\S]*?---\n*/, "");
  const paragraphs = contentBody.split(/\n\n+/);

  let summaryText = "";
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (
      trimmed.length > 50 &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*Auto-captured") &&
      !trimmed.startsWith("**Source:**") &&
      !trimmed.startsWith("**Keywords:**") &&
      !trimmed.startsWith("---")
    ) {
      // Truncate to first 200 chars
      summaryText = trimmed.length > 200 ? trimmed.slice(0, 200) + "..." : trimmed;
      break;
    }
  }

  if (!summaryText) return content;

  // Insert TL;DR callout after frontmatter (or at top)
  const fmMatch = content.match(/^(---[\s\S]*?---\n*)/);
  if (fmMatch) {
    const afterFm = content.slice(fmMatch[0].length);
    return `${fmMatch[0]}> [!summary] TL;DR\n> ${summaryText}\n\n${afterFm}`;
  }

  return `> [!summary] TL;DR\n> ${summaryText}\n\n${content}`;
}

/** Layer 2: Extract bullet points and key headings as "Key Insights". */
function addLayer2KeyInsights(content: string): string {
  const lines = content.split("\n");
  const insights: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Collect bold text as insights
    const boldMatches = trimmed.match(/\*\*(.+?)\*\*/g);
    if (boldMatches) {
      for (const match of boldMatches.slice(0, 3)) {
        const text = match.replace(/\*\*/g, "");
        if (text.length > 10 && text.length < 200) {
          insights.push(text);
        }
      }
    }
  }

  // Deduplicate
  const unique = [...new Set(insights)].slice(0, 5);
  if (unique.length < 2) return content;

  const section = [
    "",
    "## Key Insights",
    "",
    ...unique.map((i) => `- ${i}`),
    "",
    `*Auto-extracted by GodMode Progressive Summarization*`,
    "",
  ].join("\n");

  // Append before any trailing auto-captured lines
  const autoCaptureLine = content.lastIndexOf("*Auto-captured by GodMode");
  if (autoCaptureLine > 0) {
    return content.slice(0, autoCaptureLine) + section + content.slice(autoCaptureLine);
  }

  return content + section;
}

/** Layer 3: Find related notes by keyword overlap and add "Connections" section. */
function addLayer3Connections(content: string, vault: string, currentPath: string): string {
  // Already has connections section
  if (content.includes("## Connections")) return content;

  // Extract keywords from current note
  const words = new Set(
    content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4),
  );

  if (words.size < 5) return content;

  // Scan nearby notes for keyword overlap
  const connections: Array<{ path: string; name: string; score: number }> = [];

  const foldersToCheck = [
    join(vault, VAULT_FOLDERS.discoveries),
    join(vault, VAULT_FOLDERS.brain, BRAIN_SUBFOLDERS.knowledge),
    join(vault, VAULT_FOLDERS.resources, "Research"),
  ];

  for (const folder of foldersToCheck) {
    if (!existsSync(folder)) continue;

    let files: string[];
    try {
      files = readdirSync(folder).filter((f) => f.endsWith(".md") && !f.startsWith("."));
    } catch {
      continue;
    }

    for (const file of files.slice(0, 50)) {
      const relPath = join(folder, file).replace(vault + "/", "");
      if (relPath === currentPath) continue;

      try {
        const otherContent = readFileSync(join(folder, file), "utf-8");
        const otherWords = new Set(
          otherContent
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 4),
        );

        // Jaccard similarity
        let intersection = 0;
        for (const w of words) {
          if (otherWords.has(w)) intersection++;
        }
        const score = intersection / (words.size + otherWords.size - intersection);

        if (score > 0.15) {
          const name = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
          connections.push({ path: relPath, name, score });
        }
      } catch { /* skip */ }
    }
  }

  if (connections.length < 1) return content;

  // Sort by score, take top 5
  connections.sort((a, b) => b.score - a.score);
  const top = connections.slice(0, 5);

  const section = [
    "",
    "## Connections",
    "",
    ...top.map((c) => `- [[${c.name}]] *(${Math.round(c.score * 100)}% related)*`),
    "",
    `*Auto-linked by GodMode Progressive Summarization*`,
    "",
  ].join("\n");

  return content + section;
}

// ═══════════════════════════════════════════════════════════════════════
// PIPELINE 5: Agent Queue Output → Vault Inbox
// ═══════════════════════════════════════════════════════════════════════

/**
 * Copy agent queue outputs from ~/godmode/memory/inbox/ to VAULT/00-Inbox/.
 * Adds frontmatter tagging the source as queue-agent for later PARA routing.
 */
export async function captureQueueOutputsToVault(logger: Logger): Promise<CaptureResult> {
  const vault = getVaultPath();
  if (!vault) return { captured: 0, skipped: 0, errors: [] };

  const localInbox = join(MEMORY_DIR, "inbox");
  if (!existsSync(localInbox)) return { captured: 0, skipped: 0, errors: [] };

  const vaultInbox = join(vault, VAULT_FOLDERS.inbox);
  await mkdir(vaultInbox, { recursive: true });

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  let files: string[];
  try {
    files = readdirSync(localInbox).filter(
      (f) => f.endsWith(".md") && !f.startsWith("."),
    );
  } catch {
    return { captured: 0, skipped: 0, errors: [] };
  }

  for (const file of files) {
    const destPath = join(vaultInbox, file);
    if (existsSync(destPath)) {
      skipped++;
      continue;
    }

    try {
      const content = readFileSync(join(localInbox, file), "utf-8");

      // Add frontmatter if not present
      let enriched = content;
      if (!content.startsWith("---")) {
        const fm = [
          "---",
          `type: agent-output`,
          `source: queue-agent`,
          `capturedAt: ${new Date().toISOString()}`,
          `status: inbox`,
          "---",
          "",
        ].join("\n");
        enriched = fm + content;
      }

      await writeFile(destPath, enriched, "utf-8");
      captured++;
    } catch (err) {
      errors.push(`${file}: ${String(err)}`);
    }
  }

  if (captured > 0) {
    logger.info(`[VaultCapture] Queue outputs→Inbox: ${captured} agent outputs captured`);
  }

  return { captured, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════
// MASTER PIPELINE RUNNER
// ═══════════════════════════════════════════════════════════════════════

export type VaultCaptureResult = {
  scout: CaptureResult;
  sessions: CaptureResult;
  queueOutputs: CaptureResult;
  inbox: InboxProcessResult;
  summarization: SummarizationResult;
  totalCaptured: number;
  totalProcessed: number;
};

/**
 * Run all vault capture pipelines. Called during consciousness heartbeat tick.
 * Each pipeline runs independently — failures in one don't block others.
 */
export async function runAllCapturePipelines(logger: Logger): Promise<VaultCaptureResult> {
  const vault = getVaultPath();
  if (!vault) {
    const empty: CaptureResult = { captured: 0, skipped: 0, errors: [] };
    return {
      scout: empty,
      sessions: empty,
      queueOutputs: empty,
      inbox: { processed: 0, skipped: 0, errors: [], moves: [] },
      summarization: { summarized: 0, skipped: 0 },
      totalCaptured: 0,
      totalProcessed: 0,
    };
  }

  // Ensure vault structure exists
  ensureVaultStructure();

  // Run pipelines sequentially (they share state file)
  let scout: CaptureResult = { captured: 0, skipped: 0, errors: [] };
  let sessions: CaptureResult = { captured: 0, skipped: 0, errors: [] };
  let queueOutputs: CaptureResult = { captured: 0, skipped: 0, errors: [] };
  let inbox: InboxProcessResult = { processed: 0, skipped: 0, errors: [], moves: [] };
  let summarization: SummarizationResult = { summarized: 0, skipped: 0 };

  try {
    scout = await captureScoutToVault(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Scout pipeline error: ${String(err)}`);
  }

  try {
    sessions = await captureSessionsToDailyNotes(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Sessions pipeline error: ${String(err)}`);
  }

  try {
    queueOutputs = await captureQueueOutputsToVault(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Queue outputs pipeline error: ${String(err)}`);
  }

  try {
    inbox = await processVaultInbox(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Inbox processing error: ${String(err)}`);
  }

  try {
    summarization = await runProgressiveSummarization(logger);
  } catch (err) {
    logger.warn(`[VaultCapture] Summarization error: ${String(err)}`);
  }

  const totalCaptured = scout.captured + sessions.captured + queueOutputs.captured;
  const totalProcessed = inbox.processed + summarization.summarized;

  return {
    scout,
    sessions,
    queueOutputs,
    inbox,
    summarization,
    totalCaptured,
    totalProcessed,
  };
}
