/**
 * screenpipe-funnel.ts — Screenpipe OCR → Memory summarization pipeline.
 *
 * Tiers: Raw OCR → Hourly Summary → Daily Digest → Weekly → Monthly
 * Each tier compresses the previous one via LLM, then retention cleanup
 * purges expired files. Entities (people, decisions, URLs) are extracted
 * at the hourly level and promoted to memory.
 *
 * All functions are fire-and-forget safe — errors are caught and logged,
 * never thrown. This runs in the background heartbeat.
 */

import {
  mkdir,
  readdir,
  readFile,
  writeFile,
  appendFile,
  unlink,
  stat,
} from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../../data-paths.js";
import { health } from "../../lib/health-ledger.js";
import { forwardMessage, isHonchoReady } from "../honcho-client.js";
import { loadConfig, type ScreenpipeConfig } from "./screenpipe-config.js";

// ── Constants ────────────────────────────────────────────────────────

const HOURLY_DIR = join(MEMORY_DIR, "screenpipe", "hourly");
const WEEKLY_DIR = join(MEMORY_DIR, "screenpipe", "weekly");
const MONTHLY_DIR = join(MEMORY_DIR, "screenpipe", "monthly");
const DAILY_DIR = join(MEMORY_DIR, "daily");

const NOISE_PATTERNS: RegExp[] = [
  /password|credential|secret|api.?key|token/i,
  /cookie.?consent|accept.?cookies|gdpr/i,
  /subscribe.?to.?newsletter|email.?signup/i,
  /loading\.\.\.|please wait|buffering/i,
  /captcha|verify.?you.?are.?human/i,
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// ── Types ────────────────────────────────────────────────────────────

interface ScreenpipeFrame {
  app_name?: string;
  window_name?: string;
  text?: string;
  timestamp?: string;
}

interface ScreenpipeSearchResponse {
  data?: ScreenpipeFrame[];
}

interface ExtractedEntities {
  people: string[];
  decisions: string[];
  urls: string[];
}

// ── Health Check ─────────────────────────────────────────────────────

/**
 * Check if the local Screenpipe daemon is running.
 */
export async function isScreenpipeAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("http://localhost:3030/health", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

// ── LLM Summarization ───────────────────────────────────────────────

/**
 * Summarize a chunk of text via Anthropic API.
 * Falls back to simple truncation if no API key is available.
 */
async function summarizeChunk(
  text: string,
  systemPrompt: string,
  model = "claude-haiku-4-5-20251001",
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback: truncate to ~2000 chars
    return text.length > 2000 ? text.slice(0, 2000) + "\n\n[truncated — no API key]" : text;
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[Screenpipe] LLM summarize failed (${res.status}): ${errBody.slice(0, 200)}`);
      return text.length > 2000 ? text.slice(0, 2000) + "\n\n[truncated — LLM error]" : text;
    }

    const body = (await res.json()) as { content?: Array<{ text?: string }> };
    return body.content?.[0]?.text ?? text;
  } catch (err) {
    console.warn(`[Screenpipe] LLM summarize error: ${String(err)}`);
    return text.length > 2000 ? text.slice(0, 2000) + "\n\n[truncated — LLM error]" : text;
  }
}

// ── Entity Extraction ────────────────────────────────────────────────

function extractEntities(text: string): ExtractedEntities {
  const people = new Set<string>();
  const decisions = new Set<string>();
  const urls = new Set<string>();

  // Capitalized names (two+ capitalized words in sequence)
  const nameMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g);
  if (nameMatches) {
    for (const name of nameMatches) {
      // Filter out common non-name phrases
      if (!/^(The |This |That |When |Where |What |How |Why |Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)/i.test(name)) {
        people.add(name);
      }
    }
  }

  // @mentions
  const mentions = text.match(/@[a-zA-Z0-9_]+/g);
  if (mentions) {
    for (const m of mentions) people.add(m);
  }

  // URLs
  const urlMatches = text.match(/https?:\/\/[^\s)>\]]+/g);
  if (urlMatches) {
    for (const u of urlMatches) urls.add(u);
  }

  // Decision language
  const decisionPatterns = [
    /(?:decided to|going with|locked in|committed to|chose to|settled on)\s+(.{10,80})/gi,
  ];
  for (const pat of decisionPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pat.exec(text)) !== null) {
      decisions.add(match[1].trim().replace(/[.\n].*/, ""));
    }
  }

  return {
    people: [...people].slice(0, 20),
    decisions: [...decisions].slice(0, 10),
    urls: [...urls].slice(0, 20),
  };
}

// ── Filtering & Deduplication ────────────────────────────────────────

function isNoise(text: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(text));
}

function isBlockedApp(appName: string, blockedApps: string[]): boolean {
  const lower = appName.toLowerCase();
  return blockedApps.some((b) => lower === b.toLowerCase());
}

function stripPrivacy(text: string, config: ScreenpipeConfig): string {
  let cleaned = text;

  // Strip emails if configured
  if (config.privacy.stripEmails) {
    cleaned = cleaned.replace(EMAIL_REGEX, "[email]");
  }

  // Strip content from blocked domains
  for (const domain of config.privacy.neverCaptureDomains) {
    if (cleaned.toLowerCase().includes(domain.toLowerCase())) {
      return ""; // discard entire frame
    }
  }

  return cleaned;
}

/**
 * Deduplicate consecutive frames: collapse if same app+window and text is >90% similar.
 */
function deduplicateFrames(frames: ScreenpipeFrame[]): ScreenpipeFrame[] {
  if (frames.length === 0) return [];

  const result: ScreenpipeFrame[] = [frames[0]];

  for (let i = 1; i < frames.length; i++) {
    const prev = result[result.length - 1];
    const curr = frames[i];

    const sameContext =
      prev.app_name === curr.app_name && prev.window_name === curr.window_name;

    const textSimilar =
      sameContext &&
      prev.text &&
      curr.text &&
      prev.text.slice(0, 100) === curr.text.slice(0, 100);

    if (!textSimilar) {
      result.push(curr);
    }
  }

  return result;
}

// ── Ensure Directory ─────────────────────────────────────────────────

async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // already exists
  }
}

// ── Hourly Summary ───────────────────────────────────────────────────

/**
 * Query Screenpipe for the last hour's OCR data, filter, deduplicate,
 * summarize via LLM, extract entities, write hourly markdown file.
 */
export async function runHourlySummary(): Promise<{
  captured: number;
  filtered: number;
  promoted: number;
}> {
  const result = { captured: 0, filtered: 0, promoted: 0 };

  try {
    const config = await loadConfig();
    if (!config.enabled) return result;

    const available = await isScreenpipeAvailable();
    if (!available) {
      health.signal("screenpipe.hourly", false, { error: "screenpipe not available" });
      return result;
    }

    // Query last hour
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const startTime = oneHourAgo.toISOString();
    const url = `${config.apiUrl}/search?content_type=ocr&start_time=${encodeURIComponent(startTime)}&limit=500`;

    const res = await fetch(url);
    if (!res.ok) {
      health.signal("screenpipe.hourly", false, { error: `API ${res.status}` });
      return result;
    }

    const body = (await res.json()) as ScreenpipeSearchResponse;
    const rawFrames: ScreenpipeFrame[] = body.data ?? [];
    result.captured = rawFrames.length;

    if (rawFrames.length === 0) {
      health.signal("screenpipe.hourly", true, { captured: 0, filtered: 0, promoted: 0 });
      return result;
    }

    // Filter blocked apps
    let frames = rawFrames.filter(
      (f) => !f.app_name || !isBlockedApp(f.app_name, config.blockedApps),
    );

    // Filter noise
    frames = frames.filter((f) => !f.text || !isNoise(f.text));

    // Apply privacy
    frames = frames
      .map((f) => ({
        ...f,
        text: f.text ? stripPrivacy(f.text, config) : "",
      }))
      .filter((f) => f.text !== "");

    // Deduplicate
    frames = deduplicateFrames(frames);

    result.filtered = result.captured - frames.length;

    if (frames.length === 0) {
      health.signal("screenpipe.hourly", true, { captured: result.captured, filtered: result.filtered, promoted: 0 });
      return result;
    }

    // Build text for summarization
    const textBlocks = frames.map((f) => {
      const header = [f.app_name, f.window_name].filter(Boolean).join(" — ");
      return `[${header}]\n${f.text}`;
    });
    const rawText = textBlocks.join("\n\n---\n\n");

    // Summarize
    const summary = await summarizeChunk(
      rawText,
      "You are summarizing screen activity captured by Screenpipe OCR. " +
        "Produce a concise markdown summary of what the user was doing, key content they viewed, " +
        "and any notable interactions. Group by app/context. Skip UI chrome and boilerplate. " +
        "Be factual and brief. Use bullet points.",
    );

    // Extract entities
    const entities = extractEntities(rawText);
    result.promoted = entities.people.length + entities.decisions.length;

    // Write hourly file
    const hour = String(now.getHours()).padStart(2, "0");
    const dateStr = localDateString(now);
    await ensureDir(HOURLY_DIR);

    const filename = `${dateStr}-${hour}.md`;
    const filepath = join(HOURLY_DIR, filename);

    const entitiesSection = [
      entities.people.length > 0 ? `**People:** ${entities.people.join(", ")}` : "",
      entities.decisions.length > 0 ? `**Decisions:** ${entities.decisions.join("; ")}` : "",
      entities.urls.length > 0 ? `**URLs:** ${entities.urls.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const content = [
      `# Screen Activity — ${dateStr} ${hour}:00`,
      "",
      `> ${frames.length} frames captured, ${result.filtered} filtered`,
      "",
      summary,
      "",
      entitiesSection ? `## Entities\n${entitiesSection}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await writeFile(filepath, content, "utf-8");

    // Promote entities to people files (lightweight — just append mentions)
    if (entities.people.length > 0) {
      await promotePeople(entities.people, dateStr);
    }

    health.signal("screenpipe.hourly", true, {
      captured: result.captured,
      filtered: result.filtered,
      promoted: result.promoted,
    });

    return result;
  } catch (err) {
    console.warn(`[Screenpipe] Hourly summary error: ${String(err)}`);
    health.signal("screenpipe.hourly", false, { error: String(err) });
    return result;
  }
}

// ── People Promotion ─────────────────────────────────────────────────

async function promotePeople(names: string[], dateStr: string): Promise<void> {
  try {
    const peopleDir = join(MEMORY_DIR, "people");
    await ensureDir(peopleDir);

    for (const name of names) {
      // Skip @mentions and very short names
      if (name.startsWith("@") || name.length < 3) continue;

      const safeName = name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      if (!safeName) continue;

      const filepath = join(peopleDir, `${safeName}.md`);

      try {
        await stat(filepath);
        // File exists — append interaction
        await appendFile(
          filepath,
          `\n- ${dateStr}: Seen on screen (Screenpipe)\n`,
          "utf-8",
        );
      } catch {
        // File doesn't exist — create
        await writeFile(
          filepath,
          `# ${safeName}\n\n## Screen Interactions\n- ${dateStr}: First seen on screen (Screenpipe)\n`,
          "utf-8",
        );
      }
    }
  } catch (err) {
    console.warn(`[Screenpipe] People promotion error: ${String(err)}`);
  }
}

// ── Daily Digest ─────────────────────────────────────────────────────

/**
 * Read today's hourly files, compress into a structured daily digest,
 * append to the daily note, and forward to Honcho.
 */
export async function runDailyDigest(): Promise<{ hourlyFilesProcessed: number }> {
  const result = { hourlyFilesProcessed: 0 };

  try {
    const config = await loadConfig();
    if (!config.enabled) return result;

    const dateStr = localDateString();
    await ensureDir(HOURLY_DIR);

    // Read today's hourly files
    let files: string[];
    try {
      files = await readdir(HOURLY_DIR);
    } catch {
      return result;
    }

    const todayFiles = files
      .filter((f) => f.startsWith(dateStr) && f.endsWith(".md"))
      .sort();

    if (todayFiles.length === 0) {
      health.signal("screenpipe.daily", true, { hourlyFilesProcessed: 0 });
      return result;
    }

    // Concatenate hourly summaries
    const chunks: string[] = [];
    for (const file of todayFiles) {
      try {
        const content = await readFile(join(HOURLY_DIR, file), "utf-8");
        chunks.push(content);
      } catch {
        // skip unreadable files
      }
    }

    result.hourlyFilesProcessed = chunks.length;

    if (chunks.length === 0) {
      health.signal("screenpipe.daily", true, { hourlyFilesProcessed: 0 });
      return result;
    }

    const combined = chunks.join("\n\n---\n\n");

    // LLM compress to structured digest
    const digest = await summarizeChunk(
      combined,
      "You are compressing hourly screen activity summaries into a structured daily digest. " +
        "Output these sections in markdown:\n" +
        "## What You Worked On\n(bullet points by project/app)\n" +
        "## Key Interactions\n(people seen, conversations, meetings)\n" +
        "## Decisions\n(any decisions captured)\n" +
        "## Notable Content\n(interesting articles, code, documents viewed)\n\n" +
        "Be concise. Skip redundancy across hours. Focus on what matters.",
    );

    // Append to daily note
    await ensureDir(DAILY_DIR);
    const dailyPath = join(DAILY_DIR, `${dateStr}.md`);

    const section = [
      "",
      "## Screen Activity (Screenpipe)",
      "",
      digest,
      "",
    ].join("\n");

    try {
      await stat(dailyPath);
      await appendFile(dailyPath, section, "utf-8");
    } catch {
      await writeFile(
        dailyPath,
        `# ${dateStr}\n${section}`,
        "utf-8",
      );
    }

    // Forward to Honcho for memory processing
    if (isHonchoReady()) {
      await forwardMessage(
        "user",
        `[Screenpipe Daily Digest — ${dateStr}]\n\n${digest}`,
        "system:screenpipe-daily",
      );
    }

    health.signal("screenpipe.daily", true, {
      hourlyFilesProcessed: result.hourlyFilesProcessed,
    });

    return result;
  } catch (err) {
    console.warn(`[Screenpipe] Daily digest error: ${String(err)}`);
    health.signal("screenpipe.daily", false, { error: String(err) });
    return result;
  }
}

// ── Weekly Compression ───────────────────────────────────────────────

/**
 * Read last 7 daily notes, extract screen activity sections,
 * compress to weekly bullets, update people interaction frequency.
 */
export async function runWeeklyCompression(): Promise<void> {
  try {
    const config = await loadConfig();
    if (!config.enabled) return;

    await ensureDir(DAILY_DIR);

    // Read last 7 daily files
    let files: string[];
    try {
      files = await readdir(DAILY_DIR);
    } catch {
      return;
    }

    const dailyFiles = files.filter((f) => f.endsWith(".md")).sort().slice(-7);

    if (dailyFiles.length === 0) {
      health.signal("screenpipe.weekly", true, { dailyFiles: 0 });
      return;
    }

    // Extract screen activity sections from daily notes
    const sections: string[] = [];
    for (const file of dailyFiles) {
      try {
        const content = await readFile(join(DAILY_DIR, file), "utf-8");
        const screenSection = extractSection(content, "Screen Activity");
        if (screenSection) {
          sections.push(`### ${file.replace(".md", "")}\n${screenSection}`);
        }
      } catch {
        // skip
      }
    }

    if (sections.length === 0) {
      health.signal("screenpipe.weekly", true, { dailyFiles: dailyFiles.length, sections: 0 });
      return;
    }

    const combined = sections.join("\n\n");

    // LLM compress to weekly summary
    const weeklySummary = await summarizeChunk(
      combined,
      "Compress these daily screen activity summaries into a weekly overview. " +
        "Highlight patterns: what apps/projects dominated, key people interacted with, " +
        "major decisions made, time allocation trends. " +
        "Use concise bullet points. This is for personal reflection.",
      "claude-sonnet-4-6",
    );

    // Write weekly file
    const now = new Date();
    const weekNum = getISOWeekNumber(now);
    const year = now.getFullYear();
    const weekStr = `${year}-W${String(weekNum).padStart(2, "0")}`;

    await ensureDir(WEEKLY_DIR);
    const filepath = join(WEEKLY_DIR, `${weekStr}.md`);

    const content = [
      `# Weekly Screen Summary — ${weekStr}`,
      "",
      `> ${dailyFiles.length} daily notes, ${sections.length} with screen activity`,
      "",
      weeklySummary,
    ].join("\n");

    await writeFile(filepath, content, "utf-8");

    // Update people files with weekly interaction counts
    const entities = extractEntities(combined);
    if (entities.people.length > 0) {
      await promotePeople(entities.people, `${weekStr} (weekly)`);
    }

    health.signal("screenpipe.weekly", true, {
      dailyFiles: dailyFiles.length,
      sections: sections.length,
    });
  } catch (err) {
    console.warn(`[Screenpipe] Weekly compression error: ${String(err)}`);
    health.signal("screenpipe.weekly", false, { error: String(err) });
  }
}

// ── Monthly Compression ──────────────────────────────────────────────

/**
 * Read weekly summaries for the past month, compress to a single paragraph,
 * promote durable facts to memory.
 */
export async function runMonthlyCompression(): Promise<void> {
  try {
    const config = await loadConfig();
    if (!config.enabled) return;

    await ensureDir(WEEKLY_DIR);

    let files: string[];
    try {
      files = await readdir(WEEKLY_DIR);
    } catch {
      return;
    }

    // Take last 4-5 weekly files
    const weeklyFiles = files.filter((f) => f.endsWith(".md")).sort().slice(-5);

    if (weeklyFiles.length === 0) {
      health.signal("screenpipe.monthly", true, { weeklyFiles: 0 });
      return;
    }

    const chunks: string[] = [];
    for (const file of weeklyFiles) {
      try {
        const content = await readFile(join(WEEKLY_DIR, file), "utf-8");
        chunks.push(content);
      } catch {
        // skip
      }
    }

    if (chunks.length === 0) {
      health.signal("screenpipe.monthly", true, { weeklyFiles: weeklyFiles.length, readable: 0 });
      return;
    }

    const combined = chunks.join("\n\n---\n\n");

    // LLM compress to monthly overview
    const monthlySummary = await summarizeChunk(
      combined,
      "Compress these weekly screen activity summaries into a single concise monthly overview. " +
        "One paragraph capturing: dominant projects, key relationships, behavioral patterns, " +
        "and any shifts in focus. This is a high-level reflection for long-term memory.",
      "claude-sonnet-4-6",
    );

    // Write monthly file
    const now = new Date();
    const monthStr = localDateString(now).slice(0, 7); // YYYY-MM

    await ensureDir(MONTHLY_DIR);
    const filepath = join(MONTHLY_DIR, `${monthStr}.md`);

    const content = [
      `# Monthly Screen Summary — ${monthStr}`,
      "",
      `> ${weeklyFiles.length} weekly summaries compressed`,
      "",
      monthlySummary,
    ].join("\n");

    await writeFile(filepath, content, "utf-8");

    // Forward durable facts to Honcho
    if (isHonchoReady()) {
      await forwardMessage(
        "user",
        `[Screenpipe Monthly Summary — ${monthStr}]\n\n${monthlySummary}`,
        "system:screenpipe-monthly",
      );
    }

    health.signal("screenpipe.monthly", true, { weeklyFiles: weeklyFiles.length });
  } catch (err) {
    console.warn(`[Screenpipe] Monthly compression error: ${String(err)}`);
    health.signal("screenpipe.monthly", false, { error: String(err) });
  }
}

// ── Retention Cleanup ────────────────────────────────────────────────

/**
 * Purge expired files per retention config.
 */
export async function runRetentionCleanup(): Promise<{ deleted: number }> {
  const result = { deleted: 0 };

  try {
    const config = await loadConfig();
    if (!config.enabled) return result;

    const now = Date.now();

    // Hourly: purge files older than retention.hourlyHours
    result.deleted += await purgeDir(
      HOURLY_DIR,
      now - config.retention.hourlyHours * 60 * 60 * 1000,
    );

    // Daily: purge files older than retention.dailyDays
    // (only purge screen sections — but since dailies contain more than screen data,
    //  we only purge from the screenpipe hourly dir, not the daily dir itself)

    // Weekly: purge files older than retention.weeklyDays
    result.deleted += await purgeDir(
      WEEKLY_DIR,
      now - config.retention.weeklyDays * 24 * 60 * 60 * 1000,
    );

    // Monthly: only purge if monthlyDays > 0 (0 = forever)
    if (config.retention.monthlyDays > 0) {
      result.deleted += await purgeDir(
        MONTHLY_DIR,
        now - config.retention.monthlyDays * 24 * 60 * 60 * 1000,
      );
    }

    health.signal("screenpipe.retention", true, { deleted: result.deleted });
    return result;
  } catch (err) {
    console.warn(`[Screenpipe] Retention cleanup error: ${String(err)}`);
    health.signal("screenpipe.retention", false, { error: String(err) });
    return result;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Delete all .md files in a directory older than the given timestamp.
 */
async function purgeDir(dir: string, olderThanMs: number): Promise<number> {
  let deleted = 0;
  try {
    const files = await readdir(dir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      try {
        const filepath = join(dir, file);
        const info = await stat(filepath);
        if (info.mtimeMs < olderThanMs) {
          await unlink(filepath);
          deleted++;
        }
      } catch {
        // skip individual file errors
      }
    }
  } catch {
    // directory doesn't exist — nothing to purge
  }
  return deleted;
}

/**
 * Extract a markdown section by heading name (returns content until next ## heading).
 */
function extractSection(markdown: string, headingName: string): string | null {
  const regex = new RegExp(
    `^##\\s+.*${headingName}.*$([\\s\\S]*?)(?=^##\\s|$(?!\\n))`,
    "m",
  );
  const match = regex.exec(markdown);
  return match?.[1]?.trim() || null;
}

/**
 * Get ISO week number for a date.
 */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
