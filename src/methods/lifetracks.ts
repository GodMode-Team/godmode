import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GODMODE_ROOT, localDateString } from "../data-paths.js";
import { STATE_DIR } from "../lib/openclaw-state.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

export type LifetrackEntry = {
  date: string;
  url: string;
  pathname: string;
  contentType?: string;
  size?: number;
  title?: string;
  generatedAt?: string;
};

type WheelOfLifeData = {
  scores: Record<string, { current: number; target: number }>;
};

type VisionBoardData = {
  chiefDefiniteAim?: { statement: string };
  values?: string[];
  identityStatements?: string[];
  annualThemes?: Array<{ theme: string; description: string }>;
};

type DailyLogContext = {
  weather?: string;
  calendarHighlights?: string[];
  todayPriorities?: string[];
  yesterdayWins?: string[];
  energyReadiness?: string;
};

type MeditationTheme = string;

type CustomThemeRequest = {
  durationMinutes: number;
  topic: string;
};

type LifeTrackContext = {
  chiefDefiniteAim?: string;
  identityStatements?: string[];
  values?: string[];
  annualThemes?: Array<{ theme: string; description: string }>;
  wheelScores?: Record<string, { current: number; target: number }>;
  lowestSpokes?: string[];
  dayOfWeek?: string;
  weather?: string;
  calendarHighlights?: string[];
  todayPriorities?: string[];
  yesterdayWins?: string[];
  energyReadiness?: string;
};

type LifeTrackConfig = {
  enabled?: boolean;
  schedule?: Record<string, unknown>;
  voice?: Record<string, unknown>;
  generation?: {
    defaultTheme?: MeditationTheme;
    [key: string]: unknown;
  };
  retention?: {
    days?: number;
    [key: string]: unknown;
  };
  stats?: {
    totalGenerated?: number;
    lastGenerated?: string;
    estimatedCost?: number;
    [key: string]: unknown;
  };
};

type ThemeEntry = {
  id: string;
  label: string;
  description: string;
  durationMinutes: number;
  defaultBackingTrack?: string;
};

type LifeTrackGenerationResult = {
  success: boolean;
  error?: string;
  trackEntry?: LifetrackEntry;
  audioPath?: string;
  scriptPath?: string;
  duration?: number;
  cost?: number;
  chunkCount?: number;
  theme?: MeditationTheme;
  warnings?: string[];
};

type LifetrackModule = {
  generateLifeTrack: (args: {
    date: string;
    context: LifeTrackContext;
    theme: MeditationTheme;
    customTheme?: CustomThemeRequest;
  }) => Promise<LifeTrackGenerationResult>;
  getAllTracks: () => Promise<LifetrackEntry[]>;
  getTodayTrack: () => Promise<LifetrackEntry | null>;
  hasTrackForDate: (date: string) => Promise<boolean>;
  readConfig: () => Promise<LifeTrackConfig>;
  writeConfig: (config: LifeTrackConfig) => Promise<void>;
  checkFfmpegAvailable: () => Promise<boolean>;
  THEME_REGISTRY: Record<string, ThemeEntry>;
};

const DASHBOARDS_DIR = path.join(STATE_DIR, "dashboards", "data");
const WHEEL_OF_LIFE_PATH = path.join(DASHBOARDS_DIR, "wheel-of-life.json");
const VISION_BOARD_PATH = path.join(DASHBOARDS_DIR, "vision-board.json");
const DAILY_LOG_DIR = path.join(GODMODE_ROOT, "memory", "daily");

let modulePromise: Promise<LifetrackModule | null> | null = null;

function resolveModuleCandidates(): string[] {
  const thisFile = fileURLToPath(import.meta.url);
  const methodsDir = path.dirname(thisFile);
  const pluginRoot = path.resolve(methodsDir, "..", "..");
  const monorepoRoot = path.resolve(pluginRoot, "..", "..");

  const explicit = (process.env.GODMODE_LIFETRACK_MODULE || "").trim();

  const candidates = [
    explicit,
    path.join(pluginRoot, "src", "lifetrack", "index.js"),
    path.join(pluginRoot, "dist", "lifetrack", "index.js"),
    path.join(monorepoRoot, "src", "lifetrack", "index.js"),
    path.join(monorepoRoot, "dist", "lifetrack", "index.js"),
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

async function loadLifetrackModule(): Promise<LifetrackModule | null> {
  if (modulePromise) {
    return modulePromise;
  }

  modulePromise = (async () => {
    for (const candidate of resolveModuleCandidates()) {
      try {
        const url =
          candidate.startsWith("file://") || candidate.startsWith("node:")
            ? candidate
            : pathToFileURL(candidate).href;
        const mod = (await import(url)) as Partial<LifetrackModule>;
        if (
          typeof mod.generateLifeTrack === "function" &&
          typeof mod.getAllTracks === "function" &&
          typeof mod.getTodayTrack === "function" &&
          typeof mod.hasTrackForDate === "function" &&
          typeof mod.readConfig === "function" &&
          typeof mod.writeConfig === "function" &&
          typeof mod.checkFfmpegAvailable === "function" &&
          mod.THEME_REGISTRY &&
          typeof mod.THEME_REGISTRY === "object"
        ) {
          return mod as LifetrackModule;
        }
      } catch {
        continue;
      }
    }
    return null;
  })();

  return modulePromise;
}

async function withLifetrackModule<T>(
  run: (mod: LifetrackModule) => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  const mod = await loadLifetrackModule();
  if (!mod) {
    return fallback();
  }
  return run(mod);
}

function unavailablePayload() {
  return {
    code: "UNAVAILABLE",
    message:
      "LifeTracks generation library is unavailable. Set GODMODE_LIFETRACK_MODULE or install with OpenClaw core sources.",
  };
}

async function readJsonFile<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return defaultData;
  }
}

function extractSection(content: string, ...keywords: string[]): string | null {
  for (const keyword of keywords) {
    const pattern = new RegExp(
      `^##\\s+[^\\n]*${keyword.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}[^\\n]*$`,
      "mi",
    );
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      const start = match.index + match[0].length;
      const nextHeading = content.indexOf("\n## ", start);
      const sectionText =
        nextHeading !== -1 ? content.slice(start, nextHeading) : content.slice(start);
      return sectionText.trim();
    }
  }
  return null;
}

async function parseDailyLog(dateStr: string): Promise<DailyLogContext> {
  const result: DailyLogContext = {};
  const logPath = path.join(DAILY_LOG_DIR, `${dateStr}.md`);

  let content: string;
  try {
    content = await fs.readFile(logPath, "utf-8");
  } catch {
    return result;
  }

  const headerMatch = content.match(/\*\*Day\s+\d+\*\*\s*·\s*([^·\n]+)/);
  if (headerMatch) {
    const rawWeather = headerMatch[1].replace(/\([^)]+\)/g, "").trim();
    if (rawWeather) {
      result.weather = rawWeather;
    }
  }

  const calendarSection = extractSection(content, "Today's Calendar", "Calendar");
  if (calendarSection) {
    const events = calendarSection
      .split("\n")
      .filter((line) => line.match(/^\s*[-*]\s+\*\*/))
      .map((line) =>
        line
          .replace(/^\s*[-*]\s+/, "")
          .replace(/\*\*/g, "")
          .trim(),
      )
      .filter((e) => e.length > 0)
      .slice(0, 5);
    if (events.length > 0) {
      result.calendarHighlights = events;
    }
  }

  const prioritiesSection = extractSection(content, "Win The Day");
  if (prioritiesSection) {
    const priorities = prioritiesSection
      .split("\n")
      .filter((line) => line.match(/^\s*-\s*\[/))
      .map((line) =>
        line
          .replace(/^\s*-\s*\[.\]\s*/, "")
          .replace(/\*\*/g, "")
          .trim(),
      )
      .filter((p) => p.length > 0)
      .slice(0, 6);
    if (priorities.length > 0) {
      result.todayPriorities = priorities;
    }
  }

  const yesterdaySection = extractSection(content, "Yesterday's Impact");
  if (yesterdaySection) {
    const highlightsStart = yesterdaySection.indexOf("Highlights:");
    if (highlightsStart !== -1) {
      const highlightsText = yesterdaySection.slice(highlightsStart);
      const wins = highlightsText
        .split("\n")
        .filter((line) => line.match(/^\s*-\s/))
        .map((line) => line.replace(/^\s*-\s+/, "").trim())
        .filter((w) => w.length > 0)
        .slice(0, 4);
      if (wins.length > 0) {
        result.yesterdayWins = wins;
      }
    }
  }

  const statusSection = extractSection(content, "Body Check", "Status", "LifeTracker");
  if (statusSection) {
    const compactMatch = statusSection.match(
      /Readiness:\s*(\d+)\s*[\u{1F7E1}\u{1F7E2}\u{1F534}\u{1F7E0}\u26AA]\s*(\w[\w\s]*?)\*?\*/u,
    );
    if (compactMatch) {
      const parts: string[] = [`Readiness: ${compactMatch[1]}`];
      const sleepMatch = statusSection.match(/Sleep\s+(\d+)/);
      if (sleepMatch) {
        parts.push(`Sleep: ${sleepMatch[1]}`);
      }
      if (compactMatch[2]?.trim()) {
        parts.push(compactMatch[2].trim());
      }
      result.energyReadiness = parts.join(", ");
    } else {
      const tableRows = statusSection
        .split("\n")
        .filter((line) => line.includes("|") && !line.includes("---"));
      const dataRow = tableRows.length >= 2 ? tableRows[1] : undefined;
      if (dataRow) {
        const cells = dataRow
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        if (cells.length >= 6) {
          const mode = cells[5]?.replace(/[\u{1F7E1}\u{1F7E2}\u{1F534}\u26AA]/gu, "").trim();
          const parts: string[] = [];
          if (cells[0] && cells[0] !== "N/A") {
            parts.push(`Readiness: ${cells[0]}`);
          }
          if (cells[1] && cells[1] !== "N/A") {
            parts.push(`Sleep: ${cells[1]}`);
          }
          if (mode) {
            parts.push(mode);
          }
          if (parts.length > 0) {
            result.energyReadiness = parts.join(", ");
          }
        }
      }
    }
  }

  return result;
}

async function buildGenerationContext(): Promise<LifeTrackContext> {
  const today = localDateString();
  const [wheelData, visionData, dailyLog] = await Promise.all([
    readJsonFile<WheelOfLifeData>(WHEEL_OF_LIFE_PATH, { scores: {} }),
    readJsonFile<VisionBoardData>(VISION_BOARD_PATH, {}),
    parseDailyLog(today),
  ]);

  const spokeScores = Object.entries(wheelData.scores || {}).map(([key, val]) => ({
    key,
    current: val.current,
    target: val.target,
  }));
  spokeScores.sort((a, b) => a.current - b.current);
  const lowestSpokes = spokeScores.slice(0, 3).map((s) => s.key);

  const wheelScores: Record<string, { current: number; target: number }> = {};
  for (const [key, val] of Object.entries(wheelData.scores || {})) {
    wheelScores[key] = { current: val.current, target: val.target };
  }

  return {
    chiefDefiniteAim: visionData.chiefDefiniteAim?.statement,
    identityStatements: visionData.identityStatements,
    values: visionData.values,
    annualThemes: visionData.annualThemes,
    wheelScores,
    lowestSpokes,
    dayOfWeek: new Date().toLocaleDateString("en-US", { weekday: "long" }),
    weather: dailyLog.weather,
    calendarHighlights: dailyLog.calendarHighlights,
    todayPriorities: dailyLog.todayPriorities,
    yesterdayWins: dailyLog.yesterdayWins,
    energyReadiness: dailyLog.energyReadiness,
  };
}

const getLifetracksConfig: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const config = await mod.readConfig();
      const ffmpegAvailable = await mod.checkFfmpegAvailable();
      respond(true, { ...config, ffmpegAvailable });
    },
    async () => {
      respond(true, {
        enabled: false,
        ffmpegAvailable: false,
        unavailable: true,
        message: unavailablePayload().message,
      });
    },
  );
};

const updateLifetracksConfig: GatewayRequestHandler = async ({ params, respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const updates = params as Partial<LifeTrackConfig>;
      const config = await mod.readConfig();

      if (typeof updates.enabled === "boolean") {
        config.enabled = updates.enabled;
      }
      if (updates.schedule) {
        config.schedule = { ...config.schedule, ...updates.schedule };
      }
      if (updates.voice) {
        config.voice = { ...config.voice, ...updates.voice };
      }
      if (updates.generation) {
        config.generation = { ...config.generation, ...updates.generation };
      }
      if (updates.retention) {
        config.retention = { ...config.retention, ...updates.retention };
      }

      await mod.writeConfig(config);
      respond(true, { updated: true, config });
    },
    async () => {
      respond(false, null, unavailablePayload());
    },
  );
};

const getLifetracks: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const config = await mod.readConfig();
      if (!config.enabled) {
        respond(true, {
          lifetracks: [],
          total: 0,
          enabled: false,
          message:
            "LifeTracks is not enabled. Enable it in Settings > Life > LifeTracks to generate personalized daily affirmations (~$0.16/track).",
        });
        return;
      }

      const tracks = await mod.getAllTracks();
      if (tracks.length === 0) {
        respond(true, {
          lifetracks: [],
          total: 0,
          enabled: true,
          needsGeneration: true,
          message:
            "LifeTracks is enabled but no tracks generated yet. Click 'Generate Today's Track' to create your first personalized affirmation.",
        });
        return;
      }

      respond(true, { lifetracks: tracks, total: tracks.length, enabled: true });
    },
    async () => {
      respond(true, {
        lifetracks: [],
        total: 0,
        enabled: false,
        unavailable: true,
        message: unavailablePayload().message,
      });
    },
  );
};

const getLifetrackToday: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const config = await mod.readConfig();
      if (!config.enabled) {
        respond(true, { lifetrack: null, enabled: false });
        return;
      }

      const todayTrack = await mod.getTodayTrack();
      const allTracks = await mod.getAllTracks();
      const mostRecent = allTracks[0] ?? null;

      respond(true, {
        lifetrack: todayTrack || mostRecent,
        isToday: !!todayTrack,
        enabled: true,
        hasAnyTracks: allTracks.length > 0,
      });
    },
    async () => {
      respond(true, { lifetrack: null, enabled: false, unavailable: true });
    },
  );
};

const generateLifetrack: GatewayRequestHandler = async ({ params, respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const { date, force, theme, customTopic, customDuration } = params as {
        date?: string;
        force?: boolean;
        theme?: MeditationTheme;
        customTopic?: string;
        customDuration?: number;
      };
      const targetDate = date || localDateString();

      const config = await mod.readConfig();
      if (!config.enabled) {
        respond(false, null, {
          code: "NOT_ENABLED",
          message: "LifeTracks is not enabled. Enable it first in settings.",
        });
        return;
      }

      if (!force && (await mod.hasTrackForDate(targetDate))) {
        const existingTrack = await mod.getTodayTrack();
        respond(true, {
          generated: false,
          alreadyExists: true,
          track: existingTrack,
          message: `Track for ${targetDate} already exists. Use force=true to regenerate.`,
        });
        return;
      }

      const context = await buildGenerationContext();

      let customTheme: CustomThemeRequest | undefined;
      if (customTopic) {
        customTheme = {
          durationMinutes: customDuration || 5,
          topic: customTopic,
        };
      }

      const result = await mod.generateLifeTrack({
        date: targetDate,
        context,
        theme: customTheme ? "custom" : theme || config.generation?.defaultTheme || "morning",
        customTheme,
      });

      if (!result.success) {
        respond(false, null, {
          code: "GENERATION_FAILED",
          message: result.error || "Failed to generate LifeTrack",
        });
        return;
      }

      respond(true, {
        generated: true,
        track: result.trackEntry,
        audioPath: result.audioPath,
        scriptPath: result.scriptPath,
        duration: result.duration,
        cost: result.cost,
        chunkCount: result.chunkCount,
        theme: result.theme,
        warnings: result.warnings,
      });
    },
    async () => {
      respond(false, null, unavailablePayload());
    },
  );
};

const getCostEstimate: GatewayRequestHandler = async ({ respond }) => {
  respond(true, {
    estimatedCost: 0.16,
    breakdown: {
      scriptGeneration: 0.01,
      voiceSynthesis: 0.15,
    },
    monthly: {
      daily: 4.8,
      weekly: 1.12,
    },
  });
};

const getGenerationStats: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const config = await mod.readConfig();
      const tracks = await mod.getAllTracks();
      respond(true, {
        totalGenerated: config.stats?.totalGenerated || 0,
        lastGenerated: config.stats?.lastGenerated || null,
        estimatedTotalCost: config.stats?.estimatedCost || 0,
        currentTrackCount: tracks.length,
        retentionDays: config.retention?.days || 7,
      });
    },
    async () => {
      respond(true, {
        totalGenerated: 0,
        lastGenerated: null,
        estimatedTotalCost: 0,
        currentTrackCount: 0,
        retentionDays: 7,
        unavailable: true,
      });
    },
  );
};

const checkPrerequisites: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const ffmpegAvailable = await mod.checkFfmpegAvailable();
      const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
      const hasElevenLabsKey = !!(process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY);

      respond(true, {
        ready: ffmpegAvailable && hasAnthropicKey && hasElevenLabsKey,
        ffmpeg: ffmpegAvailable,
        anthropicKey: hasAnthropicKey,
        elevenLabsKey: hasElevenLabsKey,
        missingItems: [
          !ffmpegAvailable && "ffmpeg (brew install ffmpeg)",
          !hasAnthropicKey && "ANTHROPIC_API_KEY",
          !hasElevenLabsKey && "ELEVENLABS_API_KEY",
        ].filter(Boolean),
      });
    },
    async () => {
      respond(true, {
        ready: false,
        ffmpeg: false,
        anthropicKey: !!process.env.ANTHROPIC_API_KEY,
        elevenLabsKey: !!(process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY),
        missingItems: ["LifeTracks module unavailable"],
      });
    },
  );
};

const serveAudio: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date: string };
  if (!date) {
    respond(false, null, { code: "MISSING_DATE", message: "date parameter required" });
    return;
  }

  const audioPath = path.join(STATE_DIR, "lifetracks", "audio", `${date}.mp3`);
  if (!existsSync(audioPath)) {
    respond(false, null, { code: "NOT_FOUND", message: `No audio for date: ${date}` });
    return;
  }

  respond(true, {
    audioPath,
    url: `file://${audioPath}`,
    date,
  });
};

const getThemes: GatewayRequestHandler = async ({ respond }) => {
  await withLifetrackModule(
    async (mod) => {
      const themes = Object.values(mod.THEME_REGISTRY).map((theme) => ({
        id: theme.id,
        label: theme.label,
        description: theme.description,
        durationMinutes: theme.durationMinutes,
        defaultBackingTrack: theme.defaultBackingTrack,
      }));
      respond(true, { themes, supportsCustom: true });
    },
    async () => {
      respond(true, { themes: [], supportsCustom: true, unavailable: true });
    },
  );
};

export const lifetracksHandlers: GatewayRequestHandlers = {
  "lifetracks.list": getLifetracks,
  "lifetracks.today": getLifetrackToday,
  "lifetracks.config.get": getLifetracksConfig,
  "lifetracks.config.update": updateLifetracksConfig,
  "lifetracks.generate": generateLifetrack,
  "lifetracks.themes": getThemes,
  "lifetracks.cost.estimate": getCostEstimate,
  "lifetracks.stats": getGenerationStats,
  "lifetracks.prerequisites": checkPrerequisites,
  "lifetracks.audio": serveAudio,
};
