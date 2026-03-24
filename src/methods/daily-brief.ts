import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import { DATA_DIR, MEMORY_DIR, resolveVaultPath, DAILY_FOLDER, localDateString } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

function getVaultPath(): string | null {
  return resolveVaultPath();
}

function getDailyFolder(): string {
  return DAILY_FOLDER;
}

type DailyBriefSummary = {
  readiness: number | null;
  readinessMode: string | null;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  } | null;
  tasks: {
    total: number;
    completed: number;
  };
};

type DailyBriefData = {
  date: string;
  content: string;
  summary: DailyBriefSummary;
  sections: string[];
  updatedAt: string;
};

type EveningCaptureParams = {
  date?: string;
  response?: string;
  reflection?: string;
  tomorrowHandoff?: string;
};

class EveningCaptureError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export type EveningCaptureResult = {
  date: string;
  updatedAt: string;
  capturedAt: string;
  sectionsUpdated: string[];
  reflection?: string;
  tomorrowHandoff?: string;
};

function parseReadiness(content: string): { readiness: number | null; mode: string | null } {
  const tableMatch = content.match(/\|\s*\*\*(\d+)\*\*\s*\u{1F7E1}?\s*\|/u);
  if (tableMatch) {
    const readiness = parseInt(tableMatch[1], 10);
    const modeMatch = content.match(
      /Mode\s*\|\s*\n\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\s*[\u26A1\u{1F7E2}\u{1F7E1}\u{1F534}]?\s*(\w+)/iu,
    );
    return { readiness, mode: modeMatch ? modeMatch[1] : null };
  }
  const readinessMatch = content.match(/readiness[:\s]+(\d+)/i);
  return {
    readiness: readinessMatch ? parseInt(readinessMatch[1], 10) : null,
    mode: null,
  };
}

function parseWeather(content: string): DailyBriefSummary["weather"] {
  const weatherMatch = content.match(/\*\*Weather:\*\*\s*(\S+)\s+([^,]+),\s*(\d+)\u00B0F/);
  if (weatherMatch) {
    return {
      icon: weatherMatch[1],
      condition: weatherMatch[2].trim(),
      temp: parseInt(weatherMatch[3], 10),
    };
  }
  const altMatch = content.match(/Weather[:\s]+(\S+)[^,]*,?\s*(\d+)\u00B0/i);
  if (altMatch) {
    return { icon: altMatch[1], condition: "Unknown", temp: parseInt(altMatch[2], 10) };
  }
  return null;
}

function parseTasks(content: string): DailyBriefSummary["tasks"] {
  // Count ALL checkboxes in the entire document
  const unchecked = (content.match(/(?:^|\n)\s*(?:\d+\.|-|\*)\s*\[ \]/g) || []).length;
  const checked = (content.match(/(?:^|\n)\s*(?:\d+\.|-|\*)\s*\[[xX]\]/g) || []).length;
  return { total: unchecked + checked, completed: checked };
}

function parseSections(content: string): string[] {
  const sections: string[] = [];
  const headerRegex = /^##\s+(.+)$/gm;
  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const title = match[1]
      .replace(
        /[\u{1F4CA}\u{1F3AF}\u26A1\u{1F4C5}\u{1F4F1}\u{1F4CB}\u{1F9ED}\u{1F3C3}\u{1F4DD}\u{1F3C1}]+/gu,
        "",
      )
      .trim();
    if (title) {
      sections.push(title);
    }
  }
  return sections;
}

export function getTodayDate(): string {
  return localDateString();
}

/**
 * Detect and fix literal `\n` text (hex 5c 6e) in brief content.
 * This occurs when the Claude CLI returns escaped newlines instead of real ones.
 * Heuristic: if the content has literal `\n` sequences AND fewer than 5 real lines,
 * it's corrupted and needs fixing.
 */
function sanitizeBriefContent(raw: string): string {
  const realLineCount = raw.split("\n").length;
  if (raw.includes("\\n") && realLineCount < 5) {
    console.log("[DailyBrief] Sanitizing literal \\n in brief content");
    return raw.replace(/\\n/g, "\n");
  }
  return raw;
}

/**
 * Try reading a daily brief from ~/godmode/memory/daily/ as fallback
 * when the VAULT file is missing. If found, also copy to VAULT so
 * subsequent reads (and the UI) get it from the canonical location.
 */
async function tryMemoryDailyFallback(
  briefDate: string,
  vaultFilePath: string,
): Promise<{ content: string; mtime: Date } | null> {
  const memoryPath = join(MEMORY_DIR, "daily", `${briefDate}.md`);
  try {
    const memStats = await stat(memoryPath);
    let content = await readFile(memoryPath, "utf-8");
    content = sanitizeBriefContent(content);

    // Auto-sync to VAULT (gateway process has FDA, unlike cron)
    try {
      await writeFile(vaultFilePath, content, "utf-8");
      console.log(`[DailyBrief] Synced memory/daily/${briefDate}.md → VAULT`);
    } catch (syncErr) {
      console.warn("[DailyBrief] Failed to sync fallback to VAULT:", syncErr);
    }

    return { content, mtime: memStats.mtime };
  } catch {
    return null;
  }
}

type MarkdownSection = { heading: string; start: number; end: number };

function normalizeHeading(value: string): string {
  return value.replace(/[^a-zA-Z0-9 ]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function listH2Sections(content: string): MarkdownSection[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = Array.from(content.matchAll(headingRegex));
  const sections: MarkdownSection[] = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const start = match.index ?? 0;
    const nextStart =
      i + 1 < matches.length ? (matches[i + 1].index ?? content.length) : content.length;
    sections.push({ heading: (match[1] ?? "").trim(), start, end: nextStart });
  }
  return sections;
}

function findSectionByAliases(
  sections: MarkdownSection[],
  aliases: readonly string[],
): MarkdownSection | null {
  const normalizedAliases = aliases.map((alias) => normalizeHeading(alias));
  for (const section of sections) {
    const normalizedHeading = normalizeHeading(section.heading);
    if (normalizedAliases.some((alias) => normalizedHeading.includes(alias))) {
      return section;
    }
  }
  return null;
}

function upsertH2Section(
  content: string,
  opts: { heading: string; aliases: readonly string[]; body: string },
): string {
  const sectionText = `## ${opts.heading}\n${opts.body.trim()}\n`;
  const sections = listH2Sections(content);
  const existing = findSectionByAliases(sections, [opts.heading, ...opts.aliases]);
  if (existing) {
    return `${content.slice(0, existing.start)}${sectionText}${content.slice(existing.end)}`;
  }
  if (content.trim().length === 0) {
    return sectionText;
  }
  const separator = content.endsWith("\n") ? "\n" : "\n\n";
  return `${content}${separator}${sectionText}`;
}

function parseEveningResponse(response: string): { reflection: string; tomorrowHandoff: string } {
  const trimmed = response.trim();
  if (!trimmed) {
    return { reflection: "", tomorrowHandoff: "" };
  }
  const lines = trimmed.split("\n");
  const tomorrowLineRegex =
    /^\s*[-*]?\s*(tomorrow(?:\s+(?:handoff|plan|priorities))?|roll(?:\s|-)?over)\b[:-]?\s*/i;
  const lineIndex = lines.findIndex((line) => tomorrowLineRegex.test(line));
  if (lineIndex !== -1) {
    const reflection = lines.slice(0, lineIndex).join("\n").trim();
    const tomorrow = lines.slice(lineIndex).join("\n").replace(tomorrowLineRegex, "").trim();
    return { reflection, tomorrowHandoff: tomorrow };
  }
  const inlineTomorrowRegex =
    /\b(tomorrow(?:\s+(?:handoff|plan|priorities))?|roll(?:\s|-)?over)\b[:-]\s*/i;
  const inlineMatch = inlineTomorrowRegex.exec(trimmed);
  if (inlineMatch && inlineMatch.index !== undefined) {
    const reflection = trimmed.slice(0, inlineMatch.index).trim();
    const tomorrow = trimmed.slice(inlineMatch.index + inlineMatch[0].length).trim();
    return { reflection, tomorrowHandoff: tomorrow };
  }
  return { reflection: trimmed, tomorrowHandoff: "" };
}

function preferNonEmpty(primary: unknown, fallback: string): string {
  if (typeof primary === "string" && primary.trim().length > 0) {
    return primary.trim();
  }
  return fallback.trim();
}

function buildCapturedBody(text: string, capturedAtIso: string): string {
  return `Captured at: ${capturedAtIso}\n\n${text.trim()}`;
}

function ensureCaptureInput(params: EveningCaptureParams): {
  response?: string;
  reflection?: string;
  tomorrowHandoff?: string;
} {
  const hasResponse = typeof params.response === "string" && params.response.trim().length > 0;
  const hasReflection =
    typeof params.reflection === "string" && params.reflection.trim().length > 0;
  const hasTomorrow =
    typeof params.tomorrowHandoff === "string" && params.tomorrowHandoff.trim().length > 0;
  if (!hasResponse && !hasReflection && !hasTomorrow) {
    throw new EveningCaptureError(
      "INVALID_REQUEST",
      "Provide response, reflection, or tomorrowHandoff",
    );
  }
  return {
    response: hasResponse ? params.response?.trim() : undefined,
    reflection: hasReflection ? params.reflection?.trim() : undefined,
    tomorrowHandoff: hasTomorrow ? params.tomorrowHandoff?.trim() : undefined,
  };
}

async function readDailyBriefForCapture(filePath: string, date: string): Promise<string> {
  try {
    return await readFile(filePath, "utf-8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return `# Daily Brief - ${date}\n`;
    }
    throw new EveningCaptureError(
      "UNAVAILABLE",
      err instanceof Error ? err.message : "Failed to read daily brief",
    );
  }
}

export async function captureEveningReviewToDailyBrief(
  params: EveningCaptureParams,
): Promise<EveningCaptureResult> {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    throw new EveningCaptureError("INVALID_REQUEST", "OBSIDIAN_VAULT_PATH not configured");
  }
  const briefDate = params.date || getTodayDate();
  const input = ensureCaptureInput(params);
  const filePath = join(vaultPath, getDailyFolder(), `${briefDate}.md`);
  const content = await readDailyBriefForCapture(filePath, briefDate);

  const parsed =
    typeof input.response === "string"
      ? parseEveningResponse(input.response)
      : { reflection: "", tomorrowHandoff: "" };
  const finalReflection = preferNonEmpty(input.reflection, parsed.reflection);
  const finalTomorrowHandoff = preferNonEmpty(input.tomorrowHandoff, parsed.tomorrowHandoff);
  if (!finalReflection && !finalTomorrowHandoff) {
    throw new EveningCaptureError(
      "INVALID_REQUEST",
      "Could not parse any reflection or tomorrow handoff content",
    );
  }

  const capturedAt = new Date().toISOString();
  let updated = content;
  const sectionsUpdated: string[] = [];

  if (finalReflection) {
    updated = upsertH2Section(updated, {
      heading: "Evening Reflection",
      aliases: ["Reflection", "User Reflection"],
      body: buildCapturedBody(finalReflection, capturedAt),
    });
    sectionsUpdated.push("Evening Reflection");
  }

  if (finalTomorrowHandoff) {
    updated = upsertH2Section(updated, {
      heading: "Tomorrow Handoff",
      aliases: ["Tomorrow Plan", "Tomorrow Priorities", "Rollover"],
      body: buildCapturedBody(finalTomorrowHandoff, capturedAt),
    });
    sectionsUpdated.push("Tomorrow Handoff");
  }

  try {
    await writeFile(filePath, updated, "utf-8");
  } catch (err) {
    throw new EveningCaptureError(
      "UNAVAILABLE",
      err instanceof Error ? err.message : "Failed to write daily brief",
    );
  }

  return {
    date: briefDate,
    updatedAt: new Date().toISOString(),
    capturedAt,
    sectionsUpdated,
    reflection: finalReflection || undefined,
    tomorrowHandoff: finalTomorrowHandoff || undefined,
  };
}

const getDailyBrief: GatewayRequestHandler = async ({ params, respond }) => {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    respond(true, null);
    return;
  }

  const { date } = params as { date?: string };
  const briefDate = date || getTodayDate();
  const filePath = join(vaultPath, getDailyFolder(), `${briefDate}.md`);

  /**
   * Build and return the DailyBriefData response from content + mtime.
   * Applies literal-\n sanitization before parsing.
   */
  function buildBriefResponse(rawContent: string, mtime: Date): DailyBriefData {
    const content = sanitizeBriefContent(rawContent);
    const { readiness, mode } = parseReadiness(content);
    const weather = parseWeather(content);
    const tasks = parseTasks(content);
    const sections = parseSections(content);

    return {
      date: briefDate,
      content,
      summary: { readiness, readinessMode: mode, weather, tasks },
      sections,
      updatedAt: mtime.toISOString(),
    };
  }

  try {
    const stats = await stat(filePath);
    const content = await readFile(filePath, "utf-8");

    // If the VAULT file looks incomplete (< 3 sections), check memory/daily for a richer version
    const vaultSections = parseSections(sanitizeBriefContent(content));
    if (vaultSections.length < 3) {
      const fallback = await tryMemoryDailyFallback(briefDate, filePath);
      if (fallback && parseSections(fallback.content).length > vaultSections.length) {
        console.log(
          `[DailyBrief] VAULT brief has ${vaultSections.length} sections, memory/daily has more — using fallback`,
        );
        respond(true, buildBriefResponse(fallback.content, fallback.mtime));
        return;
      }
    }

    respond(true, buildBriefResponse(content, stats.mtime));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // VAULT file missing — try memory/daily fallback
      const fallback = await tryMemoryDailyFallback(briefDate, filePath);
      if (fallback) {
        console.log(`[DailyBrief] No VAULT file, using memory/daily fallback for ${briefDate}`);
        respond(true, buildBriefResponse(fallback.content, fallback.mtime));
        return;
      }
      respond(true, null);
    } else {
      console.error("[DailyBrief] Error reading brief:", err);
      respond(true, {
        date: briefDate,
        error: err instanceof Error ? err.message : "Failed to read daily brief",
      });
    }
  }
};

const updateDailyBrief: GatewayRequestHandler = async ({ params, respond }) => {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    respond(false, null, { code: "INVALID_REQUEST", message: "OBSIDIAN_VAULT_PATH not configured" });
    return;
  }

  const { date, content } = params as { date?: string; content?: string };
  const briefDate = date || getTodayDate();

  if (typeof content !== "string") {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "Missing or invalid content parameter",
    });
    return;
  }

  const filePath = join(vaultPath, getDailyFolder(), `${briefDate}.md`);

  try {
    await writeFile(filePath, content, "utf-8");
    console.log(`[DailyBrief] Updated brief for ${briefDate}`);
    respond(true, { date: briefDate, updatedAt: new Date().toISOString() });

    // Brief saves no longer trigger syncTasksFromBrief (F3 decoupling).
  } catch (err) {
    console.error("[DailyBrief] Error writing brief:", err);
    respond(false, null, {
      code: "UNAVAILABLE",
      message: `Failed to write daily brief (${err instanceof Error ? err.message : "unknown error"})`,
    });
  }
};

const captureEveningReview: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const result = await captureEveningReviewToDailyBrief(params as EveningCaptureParams);
    respond(true, result);
  } catch (err) {
    if (err instanceof EveningCaptureError) {
      respond(false, null, { code: err.code, message: err.message });
      return;
    }
    respond(false, null, {
      code: "UNAVAILABLE",
      message: `Failed to capture evening review (${err instanceof Error ? err.message : "unknown error"})`,
    });
  }
};

// ── Brief item parsing helpers ─────────────────────────────────────

type BriefItem = { title: string; completed: boolean; section: string };

/** Emoji-removal pattern for cleaning section headings. */
const EMOJI_RE =
  /[\u{1F3AF}\u{1F4CA}\u26A1\u{1F4C5}\u{1F4F1}\u{1F4CB}\u{1F9ED}\u{1F3C3}\u{1F4DD}\u{1F3C1}\u{1F4DA}\u{1F6E0}\u{2705}\u{1F525}\u{1F680}\u{2B50}\u{1F31F}\u{1F4A1}\u{1F389}\u{1F4AC}\u{1F4E7}\u{1F4C8}\u{1F3AE}\u{1F30D}\u{1F4AA}\u{2764}\u{FE0F}?\u{1F49A}\u{1F499}\u{1F49B}\u{1F49C}\u200D?]+/gu;

function cleanSectionName(heading: string): string {
  return heading.replace(EMOJI_RE, "").trim() || heading.trim();
}

/** High-priority section names (case-insensitive check). */
const HIGH_PRIORITY_SECTIONS = /win the day|today's mission|priority|urgent/i;

/**
 * Normalize a task title extracted from the daily brief:
 * - Strip bold markers
 * - Strip context after em dash / en dash (— – -)
 * - Strip trailing comma / period
 * - Collapse whitespace
 */
export function normalizeTitle(raw: string): string {
  let t = raw
    // Remove bold markers
    .replace(/\*\*(.+?)\*\*/g, "$1")
    // Strip context after em dash / en dash (keep the core title)
    .replace(/\s*[—–]\s+.+$/, "")
    .trim();
  // Remove trailing comma or period
  t = t.replace(/[,.]$/, "").trim();
  // Collapse multiple spaces
  t = t.replace(/\s{2,}/g, " ");
  return t;
}

/**
 * Parse ALL checkbox items from the entire daily brief, tagged by section.
 * Every `- [ ]`, `- [x]`, `1. [ ]`, etc. becomes a BriefItem.
 *
 * Titles are normalized (bold stripped, context after em dash stripped)
 * to prevent duplicates.
 */
function parseAllBriefCheckboxes(content: string): BriefItem[] {
  // Normalize NBSP → regular space so checkbox regexes match cleanly
  content = content.replace(/\u00a0/g, " ");
  const h2Sections = listH2Sections(content);
  const items: BriefItem[] = [];

  // Build section ranges including pre-heading content
  type SectionRange = { name: string; text: string };
  const ranges: SectionRange[] = [];

  const firstStart = h2Sections.length > 0 ? h2Sections[0].start : content.length;
  if (firstStart > 0) {
    ranges.push({ name: "General", text: content.slice(0, firstStart) });
  }
  for (const sec of h2Sections) {
    ranges.push({ name: cleanSectionName(sec.heading), text: content.slice(sec.start, sec.end) });
  }

  // Global dedup across all sections by normalized title
  const globalSeen = new Set<string>();

  for (const range of ranges) {
    const sectionText = range.text;
    let match;

    // Single-pass regex: matches all checkbox items (numbered, bullet, bold or plain)
    const checkboxRegex = /^(?:\d+\.|-|\*)\s*\[([ xX])\]\s+(.+)$/gm;
    while ((match = checkboxRegex.exec(sectionText)) !== null) {
      const title = normalizeTitle(match[2]);
      if (!title) continue;
      const key = title.toLowerCase();
      if (!globalSeen.has(key)) {
        items.push({ title, completed: match[1].trim() !== "", section: range.name });
        globalSeen.add(key);
      }
    }
  }

  return items;
}

/**
 * Case-insensitive substring match for deduplicating tasks against brief items.
 * Used by syncBriefFromTasks where fuzzy matching is needed.
 */
export function titlesMatch(taskTitle: string, briefTitle: string): boolean {
  const a = taskTitle.toLowerCase().trim();
  const b = briefTitle.toLowerCase().trim();
  return a === b || a.includes(b) || b.includes(a);
}

/** Exact case-insensitive title match for dedup in syncTasksFromBrief.
 *  Both sides are normalized to handle bold markers, em-dash context, etc. */
function exactTitleMatch(a: string, b: string): boolean {
  return normalizeTitle(a).toLowerCase() === normalizeTitle(b).toLowerCase();
}

// ── Exported sync functions (called from tasks.ts and RPC) ────────

/** Module-level guard: only run syncTasksFromBrief once per date per session unless forced. */
const syncedDates = new Set<string>();

/**
 * syncTasksFromBrief — Reads ALL checkbox items from the daily brief
 * and creates/updates tasks.
 *
 * - New items are added as tasks (source: "import") with briefSection tag
 * - Existing tasks are NOT overwritten if user-edited
 * - Completion AND un-completion syncs from brief to tasks
 * - Only runs once per date per session unless force=true
 */
export async function syncTasksFromBrief(date: string, opts?: { force?: boolean }): Promise<{
  added: number;
  updated: number;
  total: number;
}> {
  // Once-per-date guard: skip if already synced today unless force=true
  if (syncedDates.has(date) && !opts?.force) {
    return { added: 0, updated: 0, total: 0 };
  }

  const vaultPath = getVaultPath();
  if (!vaultPath) {
    return { added: 0, updated: 0, total: 0 };
  }

  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return { added: 0, updated: 0, total: 0 };
  }

  const items = parseAllBriefCheckboxes(content);
  if (items.length === 0) {
    return { added: 0, updated: 0, total: 0 };
  }

  // Use shared locked task updater from tasks.ts
  let updateTasks: Awaited<typeof import("./tasks.js")>["updateTasks"];
  let readWorkspaceConfig: Awaited<typeof import("../lib/workspaces-config.js")>["readWorkspaceConfig"];
  let detectWorkspaceFromText: Awaited<typeof import("../lib/workspaces-config.js")>["detectWorkspaceFromText"];
  let randomUUID: Awaited<typeof import("node:crypto")>["randomUUID"];
  try {
    ({ updateTasks } = await import("./tasks.js"));
    ({ readWorkspaceConfig, detectWorkspaceFromText } = await import("../lib/workspaces-config.js"));
    ({ randomUUID } = await import("node:crypto"));
  } catch (err) {
    console.error("[DailyBrief] Failed to load task sync dependencies:", err);
    return { added: 0, updated: 0, total: 0 };
  }

  // Pre-load workspace config for task→workspace detection
  let wsConfig: Awaited<ReturnType<typeof readWorkspaceConfig>> | null = null;
  try {
    wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
  } catch {
    // No workspace config — tasks won't be linked to workspaces
  }

  const { result: counts } = await updateTasks((tasksData) => {
    let added = 0;
    let updated = 0;

    for (const item of items) {
      // Dedup: normalized title + same due date, ignoring section differences.
      // This prevents the same task from appearing as a duplicate when it moves
      // between sections (e.g. "Win The Day" vs "Win The Day 2").
      const existing = tasksData.tasks.find(
        (t) => exactTitleMatch(t.title, item.title) && t.dueDate === date,
      );

      if (existing) {
        // Stamp section if missing (migration path for old tasks)
        if (!(existing as Record<string, unknown>).briefSection) {
          (existing as Record<string, unknown>).briefSection = item.section;
        }
        // Brief is authoritative for checkbox/completion state.
        if (item.completed && existing.status !== "complete") {
          existing.status = "complete";
          existing.completedAt = new Date().toISOString();
          updated++;
        }
        if (!item.completed && existing.status === "complete") {
          existing.status = "pending";
          existing.completedAt = null;
          updated++;
        }
      } else {
        // Add new task from daily brief
        const priority = HIGH_PRIORITY_SECTIONS.test(item.section) ? "high" : "medium";

        // Detect workspace from task title (e.g. "TRP: Build quiz funnel" → TRP workspace)
        let project: string | null = null;
        let projectId: string | null = null;
        if (wsConfig) {
          const detection = detectWorkspaceFromText(wsConfig, item.title);
          if (detection.workspaceId && detection.score >= 2) {
            const ws = wsConfig.workspaces.find((w) => w.id === detection.workspaceId);
            project = ws?.name ?? null;
            projectId = detection.workspaceId;
          }
        }

        tasksData.tasks.push({
          id: randomUUID(),
          title: item.title,
          status: item.completed ? "complete" : "pending",
          project,
          projectId,
          dueDate: date,
          priority,
          createdAt: new Date().toISOString(),
          completedAt: item.completed ? new Date().toISOString() : null,
          source: "import",
          sessionId: null,
          briefSection: item.section,
        });
        added++;
      }
    }

    return { added, updated };
  });

  // Mark this date as synced
  syncedDates.add(date);

  return { added: counts.added, updated: counts.updated, total: items.length };
}

/**
 * syncBriefFromTasks — Updates a SINGLE checkbox in the daily note when a
 * task is explicitly toggled via the task UI.
 *
 * IMPORTANT: A `taskTitle` MUST be provided. Without it the function is a
 * no-op. This prevents accidental bulk-rewrites of brief checkbox state —
 * the brief markdown is the source of truth for checkboxes.
 */
export async function syncBriefFromTasks(
  date: string,
  opts?: { taskTitle?: string },
): Promise<{
  updated: number;
}> {
  // Safety: only update the brief for a specific, explicitly-changed task.
  // Without a taskTitle the function does nothing — brief is authoritative.
  if (!opts?.taskTitle) {
    return { updated: 0 };
  }

  const vaultPath = getVaultPath();
  if (!vaultPath) {
    return { updated: 0 };
  }

  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return { updated: 0 };
  }

  // Normalize NBSP → regular space to prevent checkbox rendering bugs
  const hadNbsp = content.includes("\u00a0");
  if (hadNbsp) {
    content = content.replace(/\u00a0/g, " ");
  }

  // Get the specific task that was just changed
  let readTasks: Awaited<typeof import("./tasks.js")>["readTasks"];
  try {
    ({ readTasks } = await import("./tasks.js"));
  } catch (err) {
    console.error("[DailyBrief] Failed to load tasks module for brief sync:", err);
    return { updated: 0 };
  }
  const tasksData = await readTasks();
  const targetTask = tasksData.tasks.find(
    (t) =>
      titlesMatch(t.title, opts.taskTitle!) &&
      (t.dueDate === date || (t.dueDate != null && t.dueDate <= date)),
  );

  if (!targetTask) {
    return { updated: 0 };
  }

  let updatedCount = 0;
  let updatedContent = content;

  // Update ONLY the checkbox matching the target task
  const checkboxRegex = /^(\s*(?:\d+\.|-|\*)\s*)\[([ xX])\](\s*(?:\*\*(.+?)\*\*|(.+)))/gm;
  updatedContent = updatedContent.replace(
    checkboxRegex,
    (fullMatch, prefix, currentCheck, rest, boldTitle, plainTitle) => {
      const title = (boldTitle || plainTitle || "").trim();
      if (!title) return fullMatch;

      // Only update the specific task that was toggled
      if (!titlesMatch(opts.taskTitle!, title)) {
        return fullMatch;
      }

      const shouldBeChecked = targetTask.status === "complete";
      const isChecked = currentCheck.trim() !== "";

      if (shouldBeChecked !== isChecked) {
        updatedCount++;
        return `${prefix}[${shouldBeChecked ? "x" : " "}]${rest}`;
      }
      return fullMatch;
    },
  );

  if (updatedCount > 0 || hadNbsp) {
    await writeFile(filePath, updatedContent, "utf-8");
  }

  return { updated: updatedCount };
}

/**
 * dailyBrief.tasks — Syncs Win The Day items with the native task list.
 * (Legacy handler, delegates to syncTasksFromBrief.)
 */
const syncBriefTasks: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  const briefDate = date || getTodayDate();
  const result = await syncTasksFromBrief(briefDate, { force: true });

  if (result.total === 0) {
    const vaultPath = getVaultPath();
    if (!vaultPath) {
      respond(true, { synced: 0, message: "No Obsidian vault configured" });
      return;
    }
    respond(true, { synced: 0, message: "No checkbox items found in daily brief" });
    return;
  }

  respond(true, {
    synced: result.added + result.updated,
    added: result.added,
    updated: result.updated,
    total: result.total,
    message: `Synced ${result.added + result.updated} tasks (${result.added} new, ${result.updated} updated)`,
  });
};

/**
 * dailyBrief.syncTasks — Sync brief checkbox state to the task system.
 *
 * Reads checkboxes from the daily brief and creates/updates tasks in
 * tasks.json. The brief is the source of truth for checkbox state.
 * The reverse direction (task -> brief) only runs when a task is
 * explicitly toggled via the task UI (see tasks.ts updateTask handler).
 */
const syncTasksBidirectional: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  const briefDate = date || getTodayDate();

  // Brief -> Tasks only. The brief markdown is the source of truth for
  // checkbox state. syncBriefFromTasks is only triggered explicitly when a
  // task is toggled via the task UI (see tasks.ts updateTask handler).
  const fromBrief = await syncTasksFromBrief(briefDate, { force: true });

  respond(true, {
    fromBrief: {
      added: fromBrief.added,
      updated: fromBrief.updated,
      total: fromBrief.total,
    },
    message: `Brief->Tasks: ${fromBrief.added} added, ${fromBrief.updated} updated.`,
  });
};

/**
 * dailyBrief.toggleCheckbox — Surgical read-modify-write for a single checkbox.
 *
 * Instead of overwriting the entire file from the UI's in-memory HTML, this
 * reads the CURRENT file from disk, finds the Nth checkbox (`[ ]` or `[x]`),
 * toggles it, and writes back. This avoids clobbering Obsidian's state and
 * keeps file diffs minimal so Obsidian's file-watcher stays happy.
 */
const toggleCheckbox: GatewayRequestHandler = async ({ params, respond }) => {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    respond(false, null, { code: "INVALID_REQUEST", message: "OBSIDIAN_VAULT_PATH not configured" });
    return;
  }

  const { date, index, checked } = params as {
    date?: string;
    index?: number;
    checked?: boolean;
  };

  if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || typeof checked !== "boolean") {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "Missing or invalid index (non-negative integer) or checked (boolean) parameter",
    });
    return;
  }

  const briefDate = date || getTodayDate();
  const filePath = join(vaultPath, getDailyFolder(), `${briefDate}.md`);

  try {
    const content = await readFile(filePath, "utf-8");

    // Find all checkboxes in order: `[ ]` or `[x]` (case-insensitive x)
    const checkboxPattern = /\[[xX ]\]/g;
    let match: RegExpExecArray | null;
    let currentIndex = 0;
    let newContent = content;

    while ((match = checkboxPattern.exec(content)) !== null) {
      if (currentIndex === index) {
        const replacement = checked ? "[x]" : "[ ]";
        newContent =
          content.substring(0, match.index) +
          replacement +
          content.substring(match.index + match[0].length);
        break;
      }
      currentIndex++;
    }

    if (newContent === content) {
      // No matching checkbox found at that index — still respond OK
      respond(true, { date: briefDate, toggled: false, message: `No checkbox at index ${index}` });
      return;
    }

    await writeFile(filePath, newContent, "utf-8");
    console.log(`[DailyBrief] Toggled checkbox #${index} → ${checked ? "checked" : "unchecked"} for ${briefDate}`);
    respond(true, { date: briefDate, toggled: true, checked });

    // Targeted single-task sync: find which checkbox title was toggled and
    // update only that task in tasks.json (fire-and-forget)
    void (async () => {
      try {
        // Re-parse the updated content to find the checkbox at the given index
        const updatedContent = newContent.replace(/\u00a0/g, " ");
        const checkboxItemRegex = /^(?:\d+\.|-|\*)\s*\[[ xX]\]\s+(.+)$/gm;
        let itemMatch: RegExpExecArray | null;
        let cbIndex = 0;
        let toggledTitle: string | null = null;
        // Walk all checkbox lines to find which one matches the Nth global checkbox
        const allCheckboxPositions: { title: string; globalIndex: number }[] = [];
        while ((itemMatch = checkboxItemRegex.exec(updatedContent)) !== null) {
          // Count how many global checkboxes appear before this line
          const lineStart = updatedContent.lastIndexOf("\n", itemMatch.index) + 1;
          const lineText = updatedContent.slice(lineStart, itemMatch.index + itemMatch[0].length);
          const cbMatch = lineText.match(/\[[ xX]\]/);
          if (cbMatch) {
            allCheckboxPositions.push({
              title: itemMatch[1].replace(/\*\*(.+?)\*\*/g, "$1").replace(/\s*[—–]\s+.+$/, "").trim(),
              globalIndex: cbIndex,
            });
          }
          cbIndex++;
        }
        // The global index approach above won't work reliably, so let's just
        // count all [x]/[ ] matches to find the title at the given index
        const allCbs = [...newContent.matchAll(/\[[ xX]\]/g)];
        if (index < allCbs.length) {
          const cbPos = allCbs[index].index!;
          // Find the line containing this checkbox
          const lineStart = newContent.lastIndexOf("\n", cbPos) + 1;
          const lineEnd = newContent.indexOf("\n", cbPos);
          const line = newContent.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
          const titleMatch = line.match(/\[[ xX]\]\s+(?:\*\*(.+?)\*\*|(.+))$/);
          if (titleMatch) {
            toggledTitle = (titleMatch[1] || titleMatch[2] || "").replace(/\s*[—–]\s+.+$/, "").trim();
          }
        }

        if (toggledTitle) {
          const { updateTasks } = await import("./tasks.js");
          await updateTasks((data) => {
            const normalizedToggled = toggledTitle!.toLowerCase();
            const task = data.tasks.find(
              (t) =>
                t.title.toLowerCase() === normalizedToggled &&
                (t.dueDate === briefDate || (t.dueDate != null && t.dueDate <= briefDate)),
            );
            if (task) {
              if (checked && task.status !== "complete") {
                task.status = "complete";
                task.completedAt = new Date().toISOString();
              } else if (!checked && task.status === "complete") {
                task.status = "pending";
                task.completedAt = null;
              }
            }
          });
        }
      } catch (err) {
        console.error("[DailyBrief] Post-toggle targeted task sync failed:", err);
      }
    })();
  } catch (err) {
    console.error("[DailyBrief] Error toggling checkbox:", err);
    respond(false, null, {
      code: "UNAVAILABLE",
      message: `Failed to toggle brief checkbox (${err instanceof Error ? err.message : "unknown error"})`,
    });
  }
};

// --- Win The Day helpers ---

export type FocusItem = {
  index: number;
  title: string;
  context: string;
  completed: boolean;
};

/**
 * Parse Win The Day items from a daily note's markdown content.
 */
export function parseWinTheDay(content: string): FocusItem[] {
  // Note: `$` in a multiline regex matches end-of-line, not end-of-string,
  // which caused the lazy `[\s\S]*?` to capture nothing. Use `\n##\s` as the
  // section boundary and fall back to end-of-string via alternation with `$`
  // only when the `m` flag is OFF (i.e. match the very end of the string).
  const sectionMatch = content.match(
    /##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)\n([\s\S]*?)(?=\n##\s)/u,
  ) ?? content.match(
    /##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)\n([\s\S]*)$/u,
  );
  if (!sectionMatch) return [];

  const sectionContent = sectionMatch[1];
  const items: FocusItem[] = [];
  const numberedRegex = /^(\d+)\.\s*\[([ x])\]\s*\*\*(.+?)\*\*(?:\s*[—–-]\s*(.+))?$/gm;
  let match;
  while ((match = numberedRegex.exec(sectionContent)) !== null) {
    items.push({
      index: parseInt(match[1], 10),
      title: match[3].trim(),
      context: match[4]?.trim() ?? "",
      completed: match[2] === "x",
    });
  }

  if (items.length === 0) {
    const bulletRegex = /^[-*]\s*\[([ x])\]\s*\*\*(.+?)\*\*(?:\s*[—–-]\s*(.+))?$/gm;
    let idx = 1;
    while ((match = bulletRegex.exec(sectionContent)) !== null) {
      items.push({
        index: idx++,
        title: match[2].trim(),
        context: match[3]?.trim() ?? "",
        completed: match[1] === "x",
      });
    }
  }

  return items;
}

/**
 * Rewrite the Win The Day section in the daily note with refined items.
 * Preserves [x] state for items whose titles match existing completed items.
 */
export async function rewriteWinTheDay(
  date: string,
  items: FocusItem[],
): Promise<{ rewritten: boolean; error?: string }> {
  const vaultPath = getVaultPath();
  if (!vaultPath) return { rewritten: false, error: "No vault path configured" };

  const filePath = join(vaultPath, getDailyFolder(), `${date}.md`);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return { rewritten: false, error: "Daily note not found" };
  }

  const existing = parseWinTheDay(content);
  const completedTitles = new Set(
    existing.filter((i) => i.completed).map((i) => i.title.toLowerCase()),
  );

  const lines = items.map((item, idx) => {
    const checked = completedTitles.has(item.title.toLowerCase()) ? "x" : " ";
    const ctx = item.context ? ` — ${item.context}` : "";
    return `${idx + 1}. [${checked}] **${item.title}**${ctx}`;
  });
  const newBody = "\n" + lines.join("\n") + "\n";

  // Match the Win The Day section: heading + body until next ## or end of file.
  // Two-pass: first try with a next-section boundary, then fall back to end-of-string.
  const sectionMatch = content.match(
    /^(##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)[^\n]*)\n([\s\S]*?)(?=\n##\s)/mu,
  ) ?? content.match(
    /^(##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)[^\n]*)\n([\s\S]*)$/mu,
  );

  let updated: string;
  if (sectionMatch) {
    const heading = sectionMatch[1];
    const fullMatch = sectionMatch[0];
    updated = content.replace(fullMatch, heading + newBody);
  } else {
    const firstH2 = content.match(/^##\s/m);
    if (firstH2 && firstH2.index != null) {
      const afterFirst = content.slice(firstH2.index);
      const nextH2 = afterFirst.slice(1).search(/^##\s/m);
      const insertPos = nextH2 >= 0 ? firstH2.index + 1 + nextH2 : content.length;
      const newSection = "\n## Win The Day\n" + lines.join("\n") + "\n\n";
      updated = content.slice(0, insertPos) + newSection + content.slice(insertPos);
    } else {
      updated = content + "\n\n## Win The Day\n" + lines.join("\n") + "\n";
    }
  }

  await writeFile(filePath, updated, "utf-8");
  return { rewritten: true };
}

/**
 * Scope today's tasks to only Win The Day items.
 * Un-dates pending tasks for today that aren't in the WTD set.
 */
export async function scopeTasksToWinTheDay(
  date: string,
  winTheDayItems: FocusItem[],
): Promise<{ deferred: number }> {
  let updateTasks: Awaited<typeof import("./tasks.js")>["updateTasks"];
  try {
    ({ updateTasks } = await import("./tasks.js"));
  } catch (err) {
    console.error("[DailyBrief] Failed to load tasks module for WTD scoping:", err);
    return { deferred: 0 };
  }

  const wtdTitles = new Set(winTheDayItems.map((i) => i.title.toLowerCase()));

  let activeQueueTaskIds = new Set<string>();
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const queueState = await readQueueState();
    activeQueueTaskIds = new Set(
      queueState.items
        .filter((qi) => qi.sourceTaskId && qi.status !== "done")
        .map((qi) => qi.sourceTaskId!),
    );
  } catch {
    // Queue state unavailable
  }

  const { result: deferred } = await updateTasks((tasksData) => {
    let count = 0;
    for (const task of tasksData.tasks) {
      if (task.status !== "pending" || task.dueDate !== date) continue;
      if (wtdTitles.has(task.title.toLowerCase())) continue;
      if (activeQueueTaskIds.has(task.id)) continue;
      task.dueDate = null;
      count++;
    }
    return count;
  });

  return { deferred };
}

export const dailyBriefHandlers: GatewayRequestHandlers = {
  "dailyBrief.get": getDailyBrief,
  "dailyBrief.update": updateDailyBrief,
  "dailyBrief.toggleCheckbox": toggleCheckbox,
  "dailyBrief.eveningCapture": captureEveningReview,
  "dailyBrief.tasks": syncBriefTasks,
  "dailyBrief.syncTasks": syncTasksBidirectional,
  "eveningReview.capture": captureEveningReview,
};
