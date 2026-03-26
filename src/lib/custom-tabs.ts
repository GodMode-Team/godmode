/**
 * custom-tabs.ts — Custom tab manifest loader and registry.
 *
 * Reads JSON manifests from ~/godmode/custom-tabs/*.json,
 * validates them, and exposes a registry for RPC handlers.
 *
 * Custom tabs are declarative JSON configs that define a layout + data sources.
 * The UI renders them via a generic renderer — no per-tab code needed.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { GODMODE_ROOT } from "../data-paths.js";
import { secureMkdirSync } from "./secure-fs.js";

// ── Types ────────────────────────────────────────────────────────────

export interface CustomTabDataSource {
  id: string;
  type: "rpc" | "static";
  method?: string;
  params?: Record<string, unknown>;
  data?: unknown;
}

export interface CustomTabLayout {
  type: "cards" | "table" | "list" | "stat-grid" | "markdown" | "iframe";
  columns?: number;
  items?: unknown;
  itemTemplate?: Record<string, unknown>;
}

export interface CustomTabManifest {
  slug: string;
  title: string;
  icon?: string;
  subtitle?: string;
  group?: "main" | "settings";
  layout: CustomTabLayout;
  dataSources: CustomTabDataSource[];
  refresh?: number;
  version: number;
}

// ── Constants ────────────────────────────────────────────────────────

export const CUSTOM_TABS_DIR = join(GODMODE_ROOT, "custom-tabs");

/** Built-in tab slugs that custom tabs must not collide with. */
const BUILT_IN_SLUGS = new Set([
  "chat", "today", "team", "workspaces", "memory", "brain", "dashboards",
  "overview", "config", "connections", "skills", "agents", "trust",
  "guardrails", "channels", "sessions", "cron", "debug", "logs",
  "onboarding", "second-brain", "nodes", "instances",
  "setup", "work", "my-day", "mission-control",
]);

// ── In-memory registry ───────────────────────────────────────────────

const registry = new Map<string, CustomTabManifest>();

// ── Validation ───────────────────────────────────────────────────────

const VALID_LAYOUT_TYPES = new Set(["cards", "table", "list", "stat-grid", "markdown", "iframe"]);
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

function validateManifest(raw: unknown, fileName: string): CustomTabManifest | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  // Required fields
  if (typeof obj.slug !== "string" || !SLUG_RE.test(obj.slug)) {
    console.warn(`[custom-tabs] Invalid slug in ${fileName}`);
    return null;
  }
  if (typeof obj.title !== "string" || !obj.title.trim()) {
    console.warn(`[custom-tabs] Missing title in ${fileName}`);
    return null;
  }
  if (typeof obj.version !== "number" || obj.version < 1) {
    console.warn(`[custom-tabs] Invalid version in ${fileName}`);
    return null;
  }
  if (!obj.layout || typeof obj.layout !== "object") {
    console.warn(`[custom-tabs] Missing layout in ${fileName}`);
    return null;
  }

  const layout = obj.layout as Record<string, unknown>;
  if (typeof layout.type !== "string" || !VALID_LAYOUT_TYPES.has(layout.type)) {
    console.warn(`[custom-tabs] Unsupported layout type "${layout.type}" in ${fileName}`);
    return null;
  }

  // Collision check
  if (BUILT_IN_SLUGS.has(obj.slug)) {
    console.warn(`[custom-tabs] Slug "${obj.slug}" collides with built-in tab — skipping ${fileName}`);
    return null;
  }

  // Parse dataSources — accept both array and object formats
  let dataSources: CustomTabDataSource[] = [];
  if (Array.isArray(obj.dataSources)) {
    dataSources = obj.dataSources.filter(
      (ds: unknown) => ds && typeof ds === "object" && typeof (ds as Record<string, unknown>).id === "string",
    ) as CustomTabDataSource[];
  } else if (obj.dataSources && typeof obj.dataSources === "object") {
    // Convert object format { "name": { type, ... } } to array format
    for (const [id, config] of Object.entries(obj.dataSources as Record<string, unknown>)) {
      if (config && typeof config === "object") {
        dataSources.push({ id, ...(config as Record<string, unknown>) } as CustomTabDataSource);
      }
    }
  }

  // Validate each data source
  for (const ds of dataSources) {
    if (ds.type !== "rpc" && ds.type !== "static") {
      console.warn(`[custom-tabs] Unsupported data source type "${ds.type}" in ${fileName} — only "rpc" and "static" are supported`);
      return null;
    }
    if (ds.type === "rpc" && typeof ds.method !== "string") {
      console.warn(`[custom-tabs] RPC data source "${ds.id}" missing method in ${fileName}`);
      return null;
    }
  }

  return {
    slug: obj.slug,
    title: (obj.title as string).trim(),
    icon: typeof obj.icon === "string" ? obj.icon : undefined,
    subtitle: typeof obj.subtitle === "string" ? obj.subtitle : undefined,
    group: obj.group === "settings" ? "settings" : "main",
    layout: {
      type: layout.type as CustomTabLayout["type"],
      columns: typeof layout.columns === "number" ? layout.columns : undefined,
      items: layout.items,
      itemTemplate: layout.itemTemplate && typeof layout.itemTemplate === "object"
        ? layout.itemTemplate as Record<string, unknown>
        : undefined,
    },
    dataSources,
    refresh: typeof obj.refresh === "number" ? obj.refresh : 0,
    version: obj.version as number,
  };
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Load (or reload) all custom tab manifests from ~/godmode/custom-tabs/.
 * Creates the directory if it does not exist.
 */
export function loadCustomTabs(): CustomTabManifest[] {
  registry.clear();

  // Ensure directory exists
  if (!existsSync(CUSTOM_TABS_DIR)) {
    secureMkdirSync(CUSTOM_TABS_DIR);
    return [];
  }

  const files = readdirSync(CUSTOM_TABS_DIR).filter((f) => f.endsWith(".json"));
  const loaded: CustomTabManifest[] = [];

  for (const file of files) {
    try {
      const raw = JSON.parse(readFileSync(join(CUSTOM_TABS_DIR, file), "utf-8"));
      const manifest = validateManifest(raw, file);
      if (manifest) {
        // Deduplicate: last file wins if slugs collide
        registry.set(manifest.slug, manifest);
        loaded.push(manifest);
      }
    } catch (err) {
      console.warn(`[custom-tabs] Failed to parse ${file}: ${String(err)}`);
    }
  }

  return loaded;
}

/**
 * Get a custom tab manifest by slug.
 */
export function getCustomTab(slug: string): CustomTabManifest | null {
  return registry.get(slug) ?? null;
}

/**
 * List all loaded custom tab manifests.
 */
export function listCustomTabs(): CustomTabManifest[] {
  return Array.from(registry.values());
}

/**
 * Register a manifest into the in-memory registry (for immediate availability after save).
 */
export function registerCustomTab(manifest: CustomTabManifest): void {
  registry.set(manifest.slug, manifest);
}

/**
 * Remove a manifest from the in-memory registry.
 */
export function unregisterCustomTab(slug: string): void {
  registry.delete(slug);
}
