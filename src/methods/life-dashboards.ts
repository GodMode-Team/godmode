import fs from "node:fs/promises";
import path from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

/**
 * Life Dashboards - Wheel of Life + Vision Board handlers
 *
 * Data stored in ~/.openclaw/dashboards/data/
 * STATE_DIR is resolved dynamically to avoid hard dependency on core config/paths.
 */

function getStateDir(): string {
  // Use STATE_DIR from env, or default to ~/.openclaw
  return process.env.OPENCLAW_STATE_DIR || path.join(process.env.HOME || "", ".openclaw");
}

// Types

type SpokeTrend = "up" | "down" | "stable";

type SpokeData = {
  current: number;
  target: number;
  trend: SpokeTrend;
  lastUpdated: string;
};

type WheelOfLifeData = {
  asOf: string;
  scores: Record<string, SpokeData>;
  history: Array<{ date: string; scores: Record<string, number> }>;
};

type KeyResult = { kr: string; current: number | null; target: number };

type AnnualTheme = {
  id: string;
  theme: string;
  description: string;
  progress: number;
  wheelSpokes: string[];
  keyResults: KeyResult[];
};

type ChiefDefiniteAim = {
  statement: string;
  deadline: string;
  progress: number;
  lastUpdated: string;
};

type VisionBoardData = {
  chiefDefiniteAim: ChiefDefiniteAim;
  annualThemes: AnnualTheme[];
  values: string[];
  identityStatements: string[];
  antiGoals: string[];
};

// Paths — lazily resolved
function getDashboardsDir(): string {
  return path.join(getStateDir(), "dashboards", "data");
}

function getWheelPath(): string {
  return path.join(getDashboardsDir(), "wheel-of-life.json");
}

function getVisionPath(): string {
  return path.join(getDashboardsDir(), "vision-board.json");
}

const DEFAULT_WHEEL_OF_LIFE: WheelOfLifeData = {
  asOf: new Date().toISOString().split("T")[0],
  scores: Object.fromEntries(
    ["health", "wealth", "career", "relationships", "fun", "environment", "growth", "contribution"].map(
      (key) => [
        key,
        {
          current: 5,
          target: 8,
          trend: "stable" as SpokeTrend,
          lastUpdated: new Date().toISOString().split("T")[0],
        },
      ],
    ),
  ),
  history: [],
};

const DEFAULT_VISION_BOARD: VisionBoardData = {
  chiefDefiniteAim: {
    statement: "Define your Chief Definite Aim here.",
    deadline: "2030-12-31",
    progress: 0,
    lastUpdated: new Date().toISOString().split("T")[0],
  },
  annualThemes: [],
  values: ["Value 1", "Value 2", "Value 3"],
  identityStatements: ["I am becoming who I want to be."],
  antiGoals: [],
};

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {
    // exists
  }
}

async function readJsonFile<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return defaultData;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

const getWheelOfLife: GatewayRequestHandler = async ({ respond }) => {
  const data = await readJsonFile(getWheelPath(), DEFAULT_WHEEL_OF_LIFE);
  const scores = Object.values(data.scores);
  const currentSum = scores.reduce((sum, s) => sum + s.current, 0);
  const overallBalance = currentSum / scores.length;
  const lowestSpoke = Object.entries(data.scores).reduce(
    (min, [key, val]) => (val.current < min.value ? { key, value: val.current } : min),
    { key: "", value: 11 },
  );
  const biggestGap = Object.entries(data.scores).reduce(
    (max, [key, val]) => {
      const gap = val.target - val.current;
      return gap > max.gap ? { key, gap } : max;
    },
    { key: "", gap: -1 },
  );
  respond(true, {
    ...data,
    overallBalance: Math.round(overallBalance * 100) / 100,
    lowestSpoke: lowestSpoke.key,
    biggestGap: biggestGap.key,
  });
};

const updateWheelOfLife: GatewayRequestHandler = async ({ params, respond }) => {
  const { updates } = params as { updates?: Record<string, { current?: number; target?: number }> };
  if (!updates || Object.keys(updates).length === 0) {
    respond(false, null, { code: "INVALID_REQUEST", message: "updates is required" });
    return;
  }
  const data = await readJsonFile(getWheelPath(), DEFAULT_WHEEL_OF_LIFE);
  const today = new Date().toISOString().split("T")[0];
  const oldScores: Record<string, number> = {};
  for (const [key, val] of Object.entries(data.scores)) {
    oldScores[key] = val.current;
  }
  for (const [spoke, update] of Object.entries(updates)) {
    if (!data.scores[spoke]) continue;
    const oldValue = data.scores[spoke].current;
    let newValue = oldValue;
    if (typeof update.current === "number" && update.current >= 1 && update.current <= 10) {
      newValue = update.current;
      data.scores[spoke].current = newValue;
    }
    if (typeof update.target === "number" && update.target >= 1 && update.target <= 10) {
      data.scores[spoke].target = update.target;
    }
    if (newValue > oldValue) data.scores[spoke].trend = "up";
    else if (newValue < oldValue) data.scores[spoke].trend = "down";
    data.scores[spoke].lastUpdated = today;
  }
  data.asOf = today;
  data.history = [{ date: today, scores: oldScores }, ...data.history].slice(0, 52);
  await writeJsonFile(getWheelPath(), data);
  respond(true, { updated: true, asOf: today });
};

const getWheelHistory: GatewayRequestHandler = async ({ params, respond }) => {
  const { limit } = params as { limit?: number };
  const maxEntries = Math.min(52, Math.max(1, limit ?? 12));
  const data = await readJsonFile(getWheelPath(), DEFAULT_WHEEL_OF_LIFE);
  respond(true, { history: data.history.slice(0, maxEntries), totalEntries: data.history.length });
};

const getVisionBoard: GatewayRequestHandler = async ({ respond }) => {
  const data = await readJsonFile(getVisionPath(), DEFAULT_VISION_BOARD);
  respond(true, data);
};

const updateVisionBoard: GatewayRequestHandler = async ({ params, respond }) => {
  const data = await readJsonFile(getVisionPath(), DEFAULT_VISION_BOARD);
  const today = new Date().toISOString().split("T")[0];
  const { chiefDefiniteAim, annualThemes, values, identityStatements, antiGoals } =
    params as Partial<VisionBoardData>;
  if (chiefDefiniteAim) {
    if (typeof chiefDefiniteAim.statement === "string") data.chiefDefiniteAim.statement = chiefDefiniteAim.statement;
    if (typeof chiefDefiniteAim.deadline === "string") data.chiefDefiniteAim.deadline = chiefDefiniteAim.deadline;
    if (typeof chiefDefiniteAim.progress === "number") data.chiefDefiniteAim.progress = Math.max(0, Math.min(1, chiefDefiniteAim.progress));
    data.chiefDefiniteAim.lastUpdated = today;
  }
  if (Array.isArray(annualThemes)) data.annualThemes = annualThemes;
  if (Array.isArray(values)) data.values = values;
  if (Array.isArray(identityStatements)) data.identityStatements = identityStatements;
  if (Array.isArray(antiGoals)) data.antiGoals = antiGoals;
  await writeJsonFile(getVisionPath(), data);
  respond(true, { updated: true });
};

const getIdentityToday: GatewayRequestHandler = async ({ respond }) => {
  const data = await readJsonFile(getVisionPath(), DEFAULT_VISION_BOARD);
  if (data.identityStatements.length === 0) {
    respond(true, { identity: null, index: -1, total: 0 });
    return;
  }
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % data.identityStatements.length;
  respond(true, { identity: data.identityStatements[index], index, total: data.identityStatements.length });
};

export const lifeDashboardsHandlers: GatewayRequestHandlers = {
  "wheelOfLife.get": getWheelOfLife,
  "wheelOfLife.update": updateWheelOfLife,
  "wheelOfLife.history": getWheelHistory,
  "visionBoard.get": getVisionBoard,
  "visionBoard.update": updateVisionBoard,
  "visionBoard.identityToday": getIdentityToday,
};
