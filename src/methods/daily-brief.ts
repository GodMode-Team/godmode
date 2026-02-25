import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

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

export const dailyBriefHandlers: GatewayRequestHandlers = {
  "dailyBrief.get": getDailyBrief,
  "dailyBrief.update": updateDailyBrief,
  "dailyBrief.eveningCapture": captureEveningReview,
  "eveningReview.capture": captureEveningReview,
};
