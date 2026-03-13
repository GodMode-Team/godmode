/**
 * agent-roster.ts — Loads agent persona files from vault or local fallback.
 *
 * Users define team roles as markdown files with YAML frontmatter.
 * The queue processor and swarm pipeline resolve the right persona
 * for each task and inject the persona body into the agent prompt.
 *
 * Persona file locations (vault-first):
 *   VAULT/99-System/agent-roster/   ← vault path
 *   ~/godmode/memory/agent-roster/   ← local fallback
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import type { QueueItemType } from "./queue-state.js";

// ── Types ────────────────────────────────────────────────────────

/** Which CLI engine to use when spawning an agent for this persona. */
export type AgentEngine = "claude" | "codex" | "gemini";

export type PersonaProfile = {
  slug: string;
  category: string;
  name: string;
  taskTypes: QueueItemType[];
  swarmStages?: string[];
  engine?: AgentEngine;
  mission?: string;
  body: string;
};

export type HandoffContext = {
  fromAgent: string;
  fromTaskId: string;
  summary: string;
  deliverable: string;
};

// ── Cache ────────────────────────────────────────────────────────

const _cache: Map<string, PersonaProfile> = new Map();
let _cacheTs = 0;
const CACHE_TTL_MS = 30_000;

/** Trust score cache — populated by consciousness heartbeat, read by resolvePersona. */
const _trustScores: Map<string, number> = new Map();

/** Update trust score cache (called from consciousness heartbeat). */
export function setTrustScores(scores: Map<string, number>): void {
  _trustScores.clear();
  for (const [slug, score] of scores) {
    _trustScores.set(slug, score);
  }
}

// ── Path Resolution ──────────────────────────────────────────────

function resolveRosterDir(): string | null {
  const vault = getVaultPath();
  if (vault) {
    const vaultRoster = join(vault, VAULT_FOLDERS.system, "agent-roster");
    if (existsSync(vaultRoster)) return vaultRoster;
  }
  const localRoster = join(MEMORY_DIR, "agent-roster");
  if (existsSync(localRoster)) return localRoster;
  return null;
}

// ── Frontmatter Parser (minimal, no deps) ────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val) meta[key] = val;
  }
  return { meta, body: match[2] };
}

// ── File Parsing ─────────────────────────────────────────────────

function parsePersonaFile(filePath: string, category: string): PersonaProfile | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = basename(filePath, ".md");
    const taskTypes = meta.taskTypes
      ? (meta.taskTypes.split(",").map((t) => t.trim()) as QueueItemType[])
      : [];
    const swarmStages = meta.swarmStages
      ? meta.swarmStages.split(",").map((s) => s.trim())
      : undefined;
    const engine = (["claude", "codex", "gemini"] as const).includes(
      meta.engine?.toLowerCase() as AgentEngine,
    )
      ? (meta.engine.toLowerCase() as AgentEngine)
      : undefined;
    const mission = meta.mission || undefined;
    return {
      slug,
      category,
      name: meta.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      taskTypes,
      swarmStages,
      engine,
      mission,
      body: body.trim(),
    };
  } catch {
    return null;
  }
}

// ── Load All Personas ────────────────────────────────────────────

export function loadRoster(): PersonaProfile[] {
  if (_cache.size > 0 && Date.now() - _cacheTs < CACHE_TTL_MS) {
    return Array.from(_cache.values());
  }
  _cache.clear();
  const dir = resolveRosterDir();
  if (!dir) return [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const catDir = join(dir, entry.name);
        try {
          const files = readdirSync(catDir).filter((f) => f.endsWith(".md"));
          for (const f of files) {
            const profile = parsePersonaFile(join(catDir, f), entry.name);
            if (profile) _cache.set(profile.slug, profile);
          }
        } catch {
          // Skip unreadable category dirs
        }
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const profile = parsePersonaFile(join(dir, entry.name), "_default");
        if (profile) _cache.set(profile.slug, profile);
      }
    }
  } catch {
    // Roster dir unreadable — return empty
  }

  _cacheTs = Date.now();
  return Array.from(_cache.values());
}

// ── Matching ─────────────────────────────────────────────────────

/** Find the best persona for a queue item type. Returns null if no match. */
export function resolvePersona(
  taskType: QueueItemType,
  hint?: string,
): PersonaProfile | null {
  const roster = loadRoster();
  if (roster.length === 0) return null;

  // 1. Exact slug match from hint
  if (hint) {
    const exact = roster.find((p) => p.slug === hint);
    if (exact) return exact;
  }

  // 2. Match by taskTypes field
  const byType = roster.filter((p) => p.taskTypes.includes(taskType));
  if (byType.length === 1) return byType[0];
  if (byType.length > 1) {
    // Prefer persona with highest trust score
    const scored = byType
      .map((p) => ({ p, trust: _trustScores.get(p.slug) ?? 0 }))
      .sort((a, b) => b.trust - a.trust);
    return scored[0].p;
  }

  return null;
}

/** Find persona for a swarm stage (design / build / qc). */
export function resolveSwarmPersona(stage: string): PersonaProfile | null {
  const roster = loadRoster();
  return roster.find((p) => p.swarmStages?.includes(stage)) ?? null;
}

// ── Handoff Formatting ───────────────────────────────────────────

export function formatHandoff(ctx: HandoffContext): string {
  return [
    "## Handoff from Previous Agent",
    `**From:** ${ctx.fromAgent}`,
    `**Task ID:** ${ctx.fromTaskId}`,
    "",
    "### Summary",
    ctx.summary,
    "",
    "### Deliverable Expected",
    ctx.deliverable,
  ].join("\n");
}

// ── Roster Listing (for UI / RPC) ────────────────────────────────

export function listRoster(): Array<{
  slug: string;
  category: string;
  name: string;
  taskTypes: string[];
  engine?: AgentEngine;
  mission?: string;
  body: string;
}> {
  return loadRoster().map((p) => ({
    slug: p.slug,
    category: p.category,
    name: p.name,
    taskTypes: p.taskTypes,
    engine: p.engine,
    mission: p.mission,
    body: p.body,
  }));
}
