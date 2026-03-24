/**
 * project-registry.ts — Domain-to-deploy mapping registry.
 *
 * Prevents accidental duplicate Vercel/Netlify projects by tracking
 * which domains are managed by which repos. Used by deploy-guard.ts
 * and exposed via RPC in methods/project-registry.ts.
 *
 * Storage: ~/godmode/data/project-registry.json
 */

import { readFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { secureWriteFile } from "./secure-fs.js";

// ── Types ────────────────────────────────────────────────────────────

export interface ProjectEntry {
  domain: string;
  repo: string;
  localDir: string;
  platform: "vercel" | "netlify" | "cloudflare" | string;
  projectName: string;
  branch: string;
  updatedAt: string;
}

interface RegistryData {
  version: 1;
  entries: ProjectEntry[];
}

// ── File path ────────────────────────────────────────────────────────

const REGISTRY_FILE = join(DATA_DIR, "project-registry.json");

// ── Helpers ──────────────────────────────────────────────────────────

function sanitize(data: unknown): RegistryData {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { version: 1, entries: [] };
  }
  const d = data as Partial<RegistryData>;
  return {
    version: 1,
    entries: Array.isArray(d.entries) ? d.entries : [],
  };
}

// ── Public API ───────────────────────────────────────────────────────

export async function loadRegistry(): Promise<ProjectEntry[]> {
  try {
    const raw = await readFile(REGISTRY_FILE, "utf-8");
    return sanitize(JSON.parse(raw)).entries;
  } catch {
    return [];
  }
}

export async function saveRegistry(entries: ProjectEntry[]): Promise<void> {
  await mkdir(dirname(REGISTRY_FILE), { recursive: true });
  const data: RegistryData = { version: 1, entries };
  await secureWriteFile(REGISTRY_FILE, JSON.stringify(data, null, 2));
}

export async function lookupByDomain(domain: string): Promise<ProjectEntry | null> {
  const entries = await loadRegistry();
  const normalized = domain.toLowerCase().trim();
  return entries.find((e) => e.domain.toLowerCase() === normalized) ?? null;
}

export async function lookupByRepo(repo: string): Promise<ProjectEntry | null> {
  const entries = await loadRegistry();
  const normalized = repo.toLowerCase().trim();
  return entries.find((e) => e.repo.toLowerCase() === normalized) ?? null;
}

export async function registerProject(entry: ProjectEntry): Promise<void> {
  const entries = await loadRegistry();
  const normalized = entry.domain.toLowerCase().trim();
  const idx = entries.findIndex((e) => e.domain.toLowerCase() === normalized);
  const stamped = { ...entry, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    entries[idx] = stamped;
  } else {
    entries.push(stamped);
  }
  await saveRegistry(entries);
}

export async function removeProject(domain: string): Promise<boolean> {
  const entries = await loadRegistry();
  const normalized = domain.toLowerCase().trim();
  const idx = entries.findIndex((e) => e.domain.toLowerCase() === normalized);
  if (idx < 0) return false;
  entries.splice(idx, 1);
  await saveRegistry(entries);
  return true;
}
