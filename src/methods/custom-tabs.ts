/**
 * custom-tabs.ts — RPC handlers for custom tab CRUD.
 *
 * Methods:
 *   customTabs.list   — list all loaded custom tab manifests
 *   customTabs.get    — get a specific tab manifest by slug
 *   customTabs.save   — create or update a tab manifest (writes JSON file)
 *   customTabs.delete — remove a tab manifest (deletes JSON file)
 */

import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import {
  CUSTOM_TABS_DIR,
  listCustomTabs,
  getCustomTab,
  loadCustomTabs,
  registerCustomTab,
  unregisterCustomTab,
  type CustomTabManifest,
} from "../lib/custom-tabs.js";
import type { GatewayRequestHandler } from "../types/plugin-api.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Slug sanitization ────────────────────────────────────────────────

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Built-in tab slugs that custom tabs must not collide with. */
const BUILT_IN_SLUGS = new Set([
  "chat", "today", "team", "workspaces", "brain", "dashboards",
  "overview", "config", "connections", "skills", "agents", "trust",
  "guardrails", "channels", "sessions", "cron", "debug", "logs",
  "onboarding", "second-brain", "nodes", "instances",
  "setup", "work", "my-day", "mission-control",
]);

// ── List ─────────────────────────────────────────────────────────────

const list: GatewayRequestHandler = async ({ respond }) => {
  const tabs = listCustomTabs();
  respond(true, { tabs, count: tabs.length });
};

// ── Get ──────────────────────────────────────────────────────────────

const get: GatewayRequestHandler = async ({ params, respond }) => {
  const slug = typeof params.slug === "string" ? sanitizeSlug(params.slug) : "";
  if (!slug) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "slug is required" });
    return;
  }

  const tab = getCustomTab(slug);
  if (!tab) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Custom tab not found: ${slug}` });
    return;
  }

  respond(true, { tab });
};

// ── Save ─────────────────────────────────────────────────────────────

const save: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as Partial<CustomTabManifest> & Record<string, unknown>;

  const title = typeof p.title === "string" ? p.title.trim() : "";
  if (!title) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "title is required" });
    return;
  }

  const slug = typeof p.slug === "string" ? sanitizeSlug(p.slug) : sanitizeSlug(title);
  if (!slug) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "Could not derive a valid slug" });
    return;
  }

  if (BUILT_IN_SLUGS.has(slug)) {
    respond(false, undefined, {
      code: "SLUG_COLLISION",
      message: `Slug "${slug}" collides with a built-in tab`,
    });
    return;
  }

  if (!p.layout || typeof p.layout !== "object") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "layout is required" });
    return;
  }

  // Build manifest
  const manifest: CustomTabManifest = {
    slug,
    title,
    icon: typeof p.icon === "string" ? p.icon : undefined,
    subtitle: typeof p.subtitle === "string" ? p.subtitle : undefined,
    group: p.group === "settings" ? "settings" : "main",
    layout: p.layout as CustomTabManifest["layout"],
    dataSources: Array.isArray(p.dataSources) ? p.dataSources : [],
    refresh: typeof p.refresh === "number" ? p.refresh : 0,
    version: typeof p.version === "number" ? p.version : 1,
  };

  // Write to disk
  await secureMkdir(CUSTOM_TABS_DIR);
  const filePath = join(CUSTOM_TABS_DIR, `${slug}.json`);
  await secureWriteFile(filePath, JSON.stringify(manifest, null, 2) + "\n");

  // Update in-memory registry
  registerCustomTab(manifest);

  respond(true, { ok: true, slug, manifest });
};

// ── Delete ───────────────────────────────────────────────────────────

const del: GatewayRequestHandler = async ({ params, respond }) => {
  const slug = typeof params.slug === "string" ? sanitizeSlug(params.slug) : "";
  if (!slug) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "slug is required" });
    return;
  }

  const tab = getCustomTab(slug);
  if (!tab) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Custom tab not found: ${slug}` });
    return;
  }

  // Delete the JSON file
  const filePath = join(CUSTOM_TABS_DIR, `${slug}.json`);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }

  // Remove from in-memory registry
  unregisterCustomTab(slug);

  respond(true, { ok: true, deleted: slug });
};

// ── Export ────────────────────────────────────────────────────────────

export const customTabsHandlers: GatewayRequestHandlers = {
  "customTabs.list": list,
  "customTabs.get": get,
  "customTabs.save": save,
  "customTabs.delete": del,
};
