import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "../types/plugin-api.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const GOALS_FILE = join(DATA_DIR, "goals.json");

type Goal = {
  id: string;
  title: string;
  area?: string;
  target?: string;
  progress?: number;
  status: "active" | "completed" | "paused";
};

type GoalsData = {
  goals: Goal[];
  updatedAt: string | null;
};

async function readGoals(): Promise<GoalsData> {
  try {
    const raw = await readFile(GOALS_FILE, "utf-8");
    return JSON.parse(raw) as GoalsData;
  } catch {
    return { goals: [], updatedAt: null };
  }
}

const getGoals: GatewayRequestHandler = async ({ respond }) => {
  const data = await readGoals();
  respond(true, data);
};

const updateGoals: GatewayRequestHandler = async ({ params, respond }) => {
  const { goals } = params as { goals?: Goal[] };
  if (!goals || !Array.isArray(goals)) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing goals array" });
    return;
  }
  const data: GoalsData = { goals, updatedAt: new Date().toISOString() };
  await writeFile(GOALS_FILE, JSON.stringify(data, null, 2), "utf-8");
  respond(true, data);
};

export const goalsHandlers: GatewayRequestHandlers = {
  "goals.get": getGoals,
  "goals.update": updateGoals,
};
