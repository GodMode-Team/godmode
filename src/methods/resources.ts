/**
 * GodMode — Resources Registry
 *
 * Persistent index of ally-created outputs (reports, plans, docs, code, etc.).
 * Flat JSON file at ~/godmode/data/resources.json — no database.
 *
 * RPC methods:
 *   resources.list   — list/filter resources
 *   resources.pin    — toggle pinned state
 *   resources.delete — remove a resource (optionally delete the file)
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const RESOURCES_PATH = path.join(DATA_DIR, "resources.json");

// ── Types ────────────────────────────────────────────────────────────

type ResourceType =
  | "html_report"
  | "plan"
  | "analysis"
  | "code"
  | "doc"
  | "data"
  | "image"
  | "script";

type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  path?: string;
  url?: string;
  sessionKey: string;
  createdAt: string;
  pinned: boolean;
  summary?: string;
  tags?: string[];
};

type ResourcesFile = {
  version: 1;
  resources: Resource[];
};

// ── Helpers ──────────────────────────────────────────────────────────

async function readRegistry(): Promise<ResourcesFile> {
  try {
    const raw = await fs.readFile(RESOURCES_PATH, "utf-8");
    return JSON.parse(raw) as ResourcesFile;
  } catch {
    return { version: 1, resources: [] };
  }
}

async function writeRegistry(registry: ResourcesFile): Promise<void> {
  await secureMkdir(path.dirname(RESOURCES_PATH));
  await secureWriteFile(RESOURCES_PATH, JSON.stringify(registry, null, 2) + "\n");
}

// ── List ─────────────────────────────────────────────────────────────

const list: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as {
    pinned?: boolean;
    type?: ResourceType;
    sessionKey?: string;
    since?: string;
    limit?: number;
  };

  const registry = await readRegistry();
  let resources = registry.resources;

  if (typeof p.pinned === "boolean") {
    resources = resources.filter((r) => r.pinned === p.pinned);
  }
  if (typeof p.type === "string" && p.type.trim()) {
    resources = resources.filter((r) => r.type === p.type);
  }
  if (typeof p.sessionKey === "string" && p.sessionKey.trim()) {
    resources = resources.filter((r) => r.sessionKey === p.sessionKey);
  }
  if (typeof p.since === "string" && p.since.trim()) {
    resources = resources.filter((r) => r.createdAt >= p.since!);
  }

  // Sort newest first
  resources.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const limit = typeof p.limit === "number" ? Math.min(p.limit, 200) : 50;
  resources = resources.slice(0, limit);

  respond(true, { resources, total: registry.resources.length });
};

// ── Pin ──────────────────────────────────────────────────────────────

const pin: GatewayRequestHandler = async ({ params, respond }) => {
  const id = typeof params.id === "string" ? params.id.trim() : "";
  const pinned = typeof params.pinned === "boolean" ? params.pinned : true;

  if (!id) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }

  const registry = await readRegistry();
  const resource = registry.resources.find((r) => r.id === id);
  if (!resource) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Resource not found: ${id}` });
    return;
  }

  resource.pinned = pinned;
  await writeRegistry(registry);
  respond(true, { success: true });
};

// ── Delete ───────────────────────────────────────────────────────────

const remove: GatewayRequestHandler = async ({ params, respond }) => {
  const id = typeof params.id === "string" ? params.id.trim() : "";
  const deleteFile = params.deleteFile === true;

  if (!id) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }

  const registry = await readRegistry();
  const idx = registry.resources.findIndex((r) => r.id === id);
  if (idx < 0) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Resource not found: ${id}` });
    return;
  }

  const resource = registry.resources[idx];

  if (deleteFile && resource.path) {
    try {
      if (existsSync(resource.path)) {
        await fs.unlink(resource.path);
      }
    } catch {
      // Non-fatal — remove from registry even if file delete fails
    }
  }

  registry.resources.splice(idx, 1);
  await writeRegistry(registry);
  respond(true, { success: true });
};

// ── Export ────────────────────────────────────────────────────────────

export const resourcesHandlers: GatewayRequestHandlers = {
  "resources.list": list,
  "resources.pin": pin,
  "resources.delete": remove,
};
