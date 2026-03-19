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
import { MEMORY_DIR, DATA_DIR } from "../data-paths.js";
import { secureMkdir, secureWriteFile } from "./secure-fs.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import type { QueueItemType } from "./queue-state.js";
import type { OnboardingState } from "../methods/onboarding-types.js";
import { loadSkillCards, type SkillCard } from "./skill-cards.js";
import { sanitizeForPrompt } from "./prompt-sanitizer.js";

// ── Types ────────────────────────────────────────────────────────

/** Which CLI engine to use when spawning an agent for this persona. */
export type AgentEngine = "claude" | "codex" | "gemini";

export type PersonaProfile = {
  slug: string;
  category: string;
  name: string;
  taskTypes: QueueItemType[];
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

// ── Roster Config (onboarding-driven activation) ────────────────

export type RosterConfig = {
  activePersonas: string[];
  dormantPersonas: string[];
  relevantSkillCards: string[];
  generatedAt: string;
  roleHint: string;
};

const ROSTER_CONFIG_FILE = join(DATA_DIR, "roster-config.json");

/** Cached roster config — loaded once per process, invalidated by generateRosterConfig. */
let _rosterConfig: RosterConfig | null | undefined;

/** Load the roster config from disk. Returns null if no config exists. */
export function loadRosterConfig(): RosterConfig | null {
  if (_rosterConfig !== undefined) return _rosterConfig;
  try {
    const raw = readFileSync(ROSTER_CONFIG_FILE, "utf-8");
    _rosterConfig = JSON.parse(raw) as RosterConfig;
    return _rosterConfig;
  } catch {
    _rosterConfig = null;
    return null;
  }
}

/** Check whether a persona slug is dormant per the roster config. */
export function isPersonaDormant(slug: string): boolean {
  const config = loadRosterConfig();
  if (!config) return false; // no config = all active (default)
  return config.dormantPersonas.includes(slug);
}

// ── Role Detection ──────────────────────────────────────────────

type RoleProfile = {
  roleHint: string;
  activePersonas: string[];
  dormantPersonas: string[];
  skillKeywords: string[];
};

const ROLE_PROFILES: RoleProfile[] = [
  {
    roleHint: "healthcare",
    activePersonas: ["researcher", "content-writer", "personal-assistant", "icp-simulator"],
    dormantPersonas: ["ops-runner", "finance-admin"],
    skillKeywords: ["calendar", "tasks", "people", "content-generation", "second-brain", "meetings", "queue"],
  },
  {
    roleHint: "saas-founder",
    activePersonas: ["researcher", "content-writer", "ops-runner", "godmode-builder"],
    dormantPersonas: ["travel-planner", "life-admin"],
    skillKeywords: ["calendar", "tasks", "queue", "code-quality", "competitor-scan", "standup-prep", "dashboards", "second-brain"],
  },
  {
    roleHint: "agency-owner",
    activePersonas: ["content-writer", "researcher", "executive-briefer", "icp-simulator"],
    dormantPersonas: ["godmode-builder"],
    skillKeywords: ["calendar", "tasks", "people", "content-generation", "project-pipeline", "competitor-scan", "queue", "second-brain"],
  },
];

/**
 * Detect the user's role profile from their onboarding answers.
 * Checks interview.role, workflows, tools, and pain points for keyword matches.
 */
function detectRoleProfile(state: OnboardingState): RoleProfile | null {
  const signals: string[] = [];

  // Gather text signals from onboarding answers
  if (state.interview?.role) signals.push(state.interview.role.toLowerCase());
  if (state.interview?.mission) signals.push(state.interview.mission.toLowerCase());
  if (state.interview?.workflows) {
    for (const w of state.interview.workflows) signals.push(w.toLowerCase());
  }
  if (state.interview?.tools) {
    for (const t of state.interview.tools) signals.push(t.toLowerCase());
  }
  if (state.interview?.painPoints) {
    for (const p of state.interview.painPoints) signals.push(p.toLowerCase());
  }

  const blob = signals.join(" ");

  // Healthcare / chiropractor
  if (
    /\b(chiro|chiropract|health\s*care|medical|clinic|patient|doctor|dentist|physio|therapist|wellness|practitioner)\b/.test(blob)
  ) {
    return ROLE_PROFILES.find((r) => r.roleHint === "healthcare") ?? null;
  }

  // SaaS founder
  if (
    /\b(saas|startup|founder|cto|software\s*company|dev\s*team|product\s*manager|engineering\s*lead|tech\s*lead)\b/.test(blob)
  ) {
    return ROLE_PROFILES.find((r) => r.roleHint === "saas-founder") ?? null;
  }

  // Agency owner
  if (
    /\b(agency|marketing\s*agency|creative\s*agency|media\s*buyer|client\s*work|freelanc|consultant|account\s*manag)\b/.test(blob)
  ) {
    return ROLE_PROFILES.find((r) => r.roleHint === "agency-owner") ?? null;
  }

  return null; // default — all active
}

/**
 * Generate a roster config based on onboarding answers.
 * Determines which agent personas to activate vs. keep dormant
 * and which skill cards are most relevant.
 * Writes result to ~/godmode/data/roster-config.json.
 */
export async function generateRosterConfig(
  onboardingAnswers: OnboardingState,
): Promise<RosterConfig> {
  const allPersonaSlugs = [
    "researcher", "content-writer", "personal-assistant", "icp-simulator",
    "ops-runner", "finance-admin", "godmode-builder", "travel-planner",
    "life-admin", "executive-briefer", "meeting-prep", "weekly-reviewer",
    "qa-reviewer", "qa-fact-checker", "qa-copy-reviewer", "evidence-collector",
  ];

  const profile = detectRoleProfile(onboardingAnswers);

  let activePersonas: string[];
  let dormantPersonas: string[];
  let roleHint: string;

  if (profile) {
    // Named personas are explicitly active; named dormant are dormant;
    // everything else stays active (not penalized for being unlisted).
    dormantPersonas = profile.dormantPersonas;
    activePersonas = allPersonaSlugs.filter((s) => !dormantPersonas.includes(s));
    roleHint = profile.roleHint;
  } else {
    // Default: all active
    activePersonas = [...allPersonaSlugs];
    dormantPersonas = [];
    roleHint = "default";
  }

  // Determine relevant skill cards
  const allCards = loadSkillCards();
  let relevantSkillCards: string[];

  if (profile) {
    // Match by profile keywords + any card whose domain appears in user workflows
    const workflowText = (onboardingAnswers.interview?.workflows ?? []).join(" ").toLowerCase();
    relevantSkillCards = allCards
      .filter((card: SkillCard) => {
        if (profile.skillKeywords.includes(card.slug)) return true;
        // Also include cards whose triggers match the user's workflows
        if (workflowText && card.triggers.some((t: string) => workflowText.includes(t))) return true;
        return false;
      })
      .map((c: SkillCard) => c.slug);
    // De-duplicate
    relevantSkillCards = [...new Set(relevantSkillCards)];
  } else {
    // Default: all skill cards relevant
    relevantSkillCards = allCards.map((c: SkillCard) => c.slug);
  }

  const config: RosterConfig = {
    activePersonas,
    dormantPersonas,
    relevantSkillCards,
    generatedAt: new Date().toISOString(),
    roleHint,
  };

  // Write to disk
  await secureMkdir(DATA_DIR);
  await secureWriteFile(ROSTER_CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");

  // Invalidate cached config so next read picks up new file
  _rosterConfig = config;

  return config;
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

/** Find the best persona for a queue item type. Returns null if no match.
 *  Skips personas marked dormant in roster-config.json (from onboarding). */
export function resolvePersona(
  taskType: QueueItemType,
  hint?: string,
): PersonaProfile | null {
  const roster = loadRoster();
  if (roster.length === 0) return null;

  // 1. Exact slug match from hint (bypass dormant check — explicit hint = user override)
  if (hint) {
    const exact = roster.find((p) => p.slug === hint);
    if (exact) return exact;
  }

  // 2. Match by taskTypes field, filtering out dormant personas
  const byType = roster.filter((p) => p.taskTypes.includes(taskType) && !isPersonaDormant(p.slug));
  if (byType.length === 1) return byType[0];
  if (byType.length > 1) {
    // Prefer persona with highest trust score
    const scored = byType
      .map((p) => ({ p, trust: _trustScores.get(p.slug) ?? 0 }))
      .sort((a, b) => b.trust - a.trust);
    return scored[0].p;
  }

  // 3. Fallback: if all matches were dormant, try without dormant filter
  //    (better to use a dormant persona than return nothing)
  const byTypeFallback = roster.filter((p) => p.taskTypes.includes(taskType));
  if (byTypeFallback.length > 0) {
    const scored = byTypeFallback
      .map((p) => ({ p, trust: _trustScores.get(p.slug) ?? 0 }))
      .sort((a, b) => b.trust - a.trust);
    return scored[0].p;
  }

  return null;
}

// ── Handoff Formatting ───────────────────────────────────────────

export function formatHandoff(ctx: HandoffContext): string {
  return [
    "## Handoff from Previous Agent",
    `**From:** ${sanitizeForPrompt(ctx.fromAgent, "handoff.fromAgent")}`,
    `**Task ID:** ${ctx.fromTaskId}`,
    "",
    "### Summary",
    sanitizeForPrompt(ctx.summary, "handoff.summary"),
    "",
    "### Deliverable Expected",
    sanitizeForPrompt(ctx.deliverable, "handoff.deliverable"),
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
