import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

function getVaultPath(): string | null {
  return process.env.OBSIDIAN_VAULT_PATH || null;
}

function getDailyFolder(): string {
  return process.env.DAILY_BRIEF_FOLDER || "01-Daily";
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
  const missionMatch = content.match(
    /##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)([\s\S]*?)(?=^##\s|$)/mu,
  );
  const missionContent = missionMatch ? missionMatch[1] : content;
  const unchecked = (missionContent.match(/- \[ \]/g) || []).length;
  const checked = (missionContent.match(/- \[x\]/gi) || []).length;
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

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
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
      aliases: ["Reflection", "Caleb Reflection"],
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

  try {
    const stats = await stat(filePath);
    const content = await readFile(filePath, "utf-8");
    const { readiness, mode } = parseReadiness(content);
    const weather = parseWeather(content);
    const tasks = parseTasks(content);
    const sections = parseSections(content);

    const briefData: DailyBriefData = {
      date: briefDate,
      content,
      summary: { readiness, readinessMode: mode, weather, tasks },
      sections,
      updatedAt: stats.mtime.toISOString(),
    };

    respond(true, briefData);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
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
  } catch (err) {
    console.error("[DailyBrief] Error writing brief:", err);
    respond(false, null, {
      code: "UNAVAILABLE",
      message: err instanceof Error ? err.message : "Failed to write daily brief",
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
      message: err instanceof Error ? err.message : "Failed to capture evening review",
    });
  }
};

// ── Brief item parsing helpers ─────────────────────────────────────

type BriefItem = { title: string; completed: boolean };

/**
 * Parse Win The Day / Today's Mission checkbox items from a daily note.
 * Returns the raw section content and parsed items.
 */
function parseWinTheDayItems(content: string): { sectionContent: string; items: BriefItem[] } | null {
  const missionMatch = content.match(
    /##\s*(?:\u{1F3AF}\s*)?(?:Win The Day|Today's Mission)([\s\S]*?)(?=^##\s|$)/mu,
  );
  if (!missionMatch) {
    return null;
  }

  const sectionContent = missionMatch[1];
  const items: BriefItem[] = [];

  // Parse numbered items: 1. [x] **Title**
  const numberedRegex = /^\d+\.\s*\[([ x])\]\s*\*\*(.+?)\*\*/gm;
  let match;
  while ((match = numberedRegex.exec(sectionContent)) !== null) {
    items.push({ title: match[2].trim(), completed: match[1] === "x" });
  }

  // Fall back to bullet items: - [x] **Title**
  if (items.length === 0) {
    const bulletRegex = /^[-*]\s*\[([ x])\]\s*\*\*(.+?)\*\*/gm;
    while ((match = bulletRegex.exec(sectionContent)) !== null) {
      items.push({ title: match[2].trim(), completed: match[1] === "x" });
    }
  }

  return { sectionContent, items };
}

/**
 * Case-insensitive substring match for deduplicating tasks against brief items.
 */
function titlesMatch(taskTitle: string, briefTitle: string): boolean {
  const a = taskTitle.toLowerCase().trim();
  const b = briefTitle.toLowerCase().trim();
  return a === b || a.includes(b) || b.includes(a);
}

// ── Exported sync functions (called from tasks.ts and RPC) ────────

/**
 * syncTasksFromBrief — Reads Win The Day items and creates/updates tasks.
 *
 * - New items from the note are added as tasks (source: "import")
 * - Tasks already in the task list are NOT overwritten if user-edited
 * - Completed status syncs from brief to tasks
 */
export async function syncTasksFromBrief(date: string): Promise<{
  added: number;
  updated: number;
  total: number;
}> {
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

  const parsed = parseWinTheDayItems(content);
  if (!parsed || parsed.items.length === 0) {
    return { added: 0, updated: 0, total: 0 };
  }

  // Use shared task reader from tasks.ts
  const { readTasks, writeTasks } = await import("./tasks.js");
  const tasksData = await readTasks();

  let added = 0;
  let updated = 0;

  for (const item of parsed.items) {
    // Dedup by title similarity + same due date
    const existing = tasksData.tasks.find(
      (t) => titlesMatch(t.title, item.title) && t.dueDate === date,
    );

    if (existing) {
      // Only update completion status if user hasn't manually edited
      const userEdited = (existing as Record<string, unknown>).userEdited;
      if (!userEdited && item.completed && existing.status !== "complete") {
        existing.status = "complete";
        existing.completedAt = new Date().toISOString();
        updated++;
      }
    } else {
      // Add new task from daily brief
      const { randomUUID } = await import("node:crypto");
      tasksData.tasks.push({
        id: randomUUID(),
        title: item.title,
        status: item.completed ? "complete" : "pending",
        project: null,
        dueDate: date,
        priority: "high",
        createdAt: new Date().toISOString(),
        completedAt: item.completed ? new Date().toISOString() : null,
        carryOver: false,
        source: "import",
        sessionId: null,
      });
      added++;
    }
  }

  if (added > 0 || updated > 0) {
    await writeTasks(tasksData);
  }

  return { added, updated, total: parsed.items.length };
}

/**
 * syncBriefFromTasks — Updates the Win The Day section in the daily note
 * to reflect current task completion state.
 *
 * Preserves all non-task content in the section. Only updates checkbox
 * state for items that match existing tasks.
 */
export async function syncBriefFromTasks(date: string): Promise<{
  updated: number;
}> {
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

  // Get today's tasks
  const { readTasks } = await import("./tasks.js");
  const tasksData = await readTasks();
  const todayTasks = tasksData.tasks.filter(
    (t) => t.dueDate === date || (t.dueDate != null && t.dueDate <= date && t.status === "pending"),
  );

  if (todayTasks.length === 0) {
    return { updated: 0 };
  }

  let updatedCount = 0;
  let updatedContent = content;

  // Update checkbox state for matching items in the markdown
  // Match both numbered and bullet checkbox items
  const checkboxRegex = /^(\s*(?:\d+\.|-|\*)\s*)\[([ x])\](\s*\*\*(.+?)\*\*)/gm;
  updatedContent = updatedContent.replace(checkboxRegex, (fullMatch, prefix, currentCheck, rest, title) => {
    const matchingTask = todayTasks.find((t) => titlesMatch(t.title, title.trim()));
    if (!matchingTask) {
      return fullMatch;
    }

    const shouldBeChecked = matchingTask.status === "complete";
    const isChecked = currentCheck === "x";

    if (shouldBeChecked !== isChecked) {
      updatedCount++;
      return `${prefix}[${shouldBeChecked ? "x" : " "}]${rest}`;
    }
    return fullMatch;
  });

  if (updatedCount > 0) {
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
  const result = await syncTasksFromBrief(briefDate);

  if (result.total === 0) {
    const vaultPath = getVaultPath();
    if (!vaultPath) {
      respond(true, { synced: 0, message: "No Obsidian vault configured" });
      return;
    }
    respond(true, { synced: 0, message: "No task items found in Win The Day section" });
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
 * dailyBrief.syncTasks — Bidirectional sync between tasks and daily brief.
 *
 * Calls syncTasksFromBrief (brief -> tasks) then syncBriefFromTasks
 * (tasks -> brief) for the given date.
 */
const syncTasksBidirectional: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  const briefDate = date || getTodayDate();

  // Phase 1: Brief -> Tasks (import new items, update completion)
  const fromBrief = await syncTasksFromBrief(briefDate);

  // Phase 2: Tasks -> Brief (write task completion back to markdown)
  const toBrief = await syncBriefFromTasks(briefDate);

  respond(true, {
    fromBrief: {
      added: fromBrief.added,
      updated: fromBrief.updated,
      total: fromBrief.total,
    },
    toBrief: {
      updated: toBrief.updated,
    },
    message: `Brief->Tasks: ${fromBrief.added} added, ${fromBrief.updated} updated. Tasks->Brief: ${toBrief.updated} checkboxes updated.`,
  });
};

export const dailyBriefHandlers: GatewayRequestHandlers = {
  "dailyBrief.get": getDailyBrief,
  "dailyBrief.update": updateDailyBrief,
  "dailyBrief.eveningCapture": captureEveningReview,
  "dailyBrief.tasks": syncBriefTasks,
  "dailyBrief.syncTasks": syncTasksBidirectional,
  "eveningReview.capture": captureEveningReview,
};
