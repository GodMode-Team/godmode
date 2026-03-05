import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { secureWriteFile } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const DATA_SOURCES_FILE = join(DATA_DIR, "data-sources.json");

type DataSource = {
  id: string;
  name: string;
  type: string;
  status: string;
  skill: string;
  lastSync?: string;
};

type DataSourcesData = {
  sources: DataSource[];
};

async function readDataSources(): Promise<DataSourcesData> {
  try {
    const raw = await readFile(DATA_SOURCES_FILE, "utf-8");
    return JSON.parse(raw) as DataSourcesData;
  } catch {
    return { sources: [] };
  }
}

const listDataSources: GatewayRequestHandler = async ({ respond }) => {
  const data = await readDataSources();
  respond(true, { sources: data.sources });
};

const getDataSource: GatewayRequestHandler = async ({ params, respond }) => {
  const { id } = params as { id?: string };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing data source id" });
    return;
  }
  const data = await readDataSources();
  const source = data.sources.find((s) => s.id === id);
  if (!source) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Data source not found" });
    return;
  }
  respond(true, source);
};

const updateDataSource: GatewayRequestHandler = async ({ params, respond }) => {
  const { id, name, type, status, skill, lastSync } = params as {
    id?: string;
    name?: string;
    type?: string;
    status?: string;
    skill?: string;
    lastSync?: string;
  };

  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing data source id" });
    return;
  }

  const data = await readDataSources();
  const sourceIndex = data.sources.findIndex((s) => s.id === id);

  if (sourceIndex === -1) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Data source not found" });
    return;
  }

  const source = data.sources[sourceIndex];
  if (name !== undefined) {
    source.name = name;
  }
  if (type !== undefined) {
    source.type = type;
  }
  if (status !== undefined) {
    source.status = status;
  }
  if (skill !== undefined) {
    source.skill = skill;
  }
  if (lastSync !== undefined) {
    source.lastSync = lastSync;
  }

  await secureWriteFile(DATA_SOURCES_FILE, JSON.stringify(data, null, 2));
  respond(true, source);
};

export const dataSourcesHandlers: GatewayRequestHandlers = {
  "dataSources.list": listDataSources,
  "dataSources.get": getDataSource,
  "dataSources.update": updateDataSource,
};
