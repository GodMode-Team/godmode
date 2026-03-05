/**
 * options.ts — Gateway methods for GodMode feature options.
 *
 * Stores feature flags and settings in ~/godmode/data/godmode-options.json.
 * The UI reads/writes this file via RPC to toggle features on/off.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const OPTIONS_FILE = join(DATA_DIR, "godmode-options.json");

type GodModeOptions = Record<string, unknown>;

const DEFAULTS: GodModeOptions = {
  "agentPersona.enabled": true,
  // proactiveIntel removed in v1.6.0 dead weight audit
};

async function readOptions(): Promise<GodModeOptions> {
  try {
    const raw = await readFile(OPTIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as GodModeOptions;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

async function writeOptions(options: GodModeOptions): Promise<void> {
  await secureMkdir(DATA_DIR);
  await secureWriteFile(OPTIONS_FILE, JSON.stringify(options, null, 2));
}

const getOptions: GatewayRequestHandler = async ({ respond }) => {
  const options = await readOptions();
  respond(true, options);
};

const setOption: GatewayRequestHandler = async ({ params, respond, context }) => {
  const { key, value } = params as { key?: string; value?: unknown };

  if (!key || typeof key !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "key is required (string)" });
    return;
  }

  const options = await readOptions();
  options[key] = value;
  await writeOptions(options);

  context?.broadcast?.("godmode.options:update", options, { dropIfSlow: true });
  respond(true, { key, value, options });
};

export const optionsHandlers: GatewayRequestHandlers = {
  "godmode.options.get": getOptions,
  "godmode.options.set": setOption,
};
