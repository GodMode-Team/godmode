/**
 * skill-cards.ts — Domain-specific routing knowledge for the ally.
 *
 * Skill cards are markdown files with YAML frontmatter that teach the ally
 * HOW to use each domain's tools, including gotchas, tips, and failure patterns.
 *
 * Three-level routing:
 *   Level 1 (always): Decision tree in context-budget.ts (~15 lines)
 *   Level 2 (on-demand): Skill card loaded when domain detected (this file)
 *   Level 3 (accumulated): Routing lessons from past corrections (agent-lessons.ts)
 *
 * Skill card locations (vault-first):
 *   VAULT/99-System/skill-cards/   ← vault path
 *   ~/godmode/memory/skill-cards/  ← local fallback
 *   <plugin>/skill-cards/          ← shipped defaults (copied on first boot)
 *
 * Frontmatter (all values must be comma-separated on ONE line, not YAML arrays):
 *   domain: calendar
 *   triggers: meeting, schedule, calendar, event, availability
 *   tools: calendar.events.today, calendar.events.range
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";

// ── Types ────────────────────────────────────────────────────────

export type SkillCard = {
  slug: string;
  domain: string;
  triggers: string[];
  tools: string[];
  body: string;
};

// ── Cache ────────────────────────────────────────────────────────

const _cache: Map<string, SkillCard> = new Map();
let _cacheTs = 0;
const CACHE_TTL_MS = 60_000; // 1 min — skill cards rarely change

// ── Path Resolution ──────────────────────────────────────────────

export function resolveSkillCardsDir(): string | null {
  const vault = getVaultPath();
  if (vault) {
    const vaultCards = join(vault, VAULT_FOLDERS.system, "skill-cards");
    if (existsSync(vaultCards)) return vaultCards;
  }
  const localCards = join(MEMORY_DIR, "skill-cards");
  if (existsSync(localCards)) return localCards;
  return null;
}

// ── Frontmatter Parser ──────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (key && val) meta[key] = val;
  }
  return { meta, body: match[2] };
}

// ── File Parsing ─────────────────────────────────────────────────

function parseSkillCard(filePath: string): SkillCard | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = basename(filePath, ".md");
    const triggers = meta.triggers
      ? meta.triggers.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];
    const tools = meta.tools
      ? meta.tools.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    return {
      slug,
      domain: meta.domain || slug,
      triggers,
      tools,
      body: body.trim(),
    };
  } catch {
    return null;
  }
}

// ── Load All Cards ───────────────────────────────────────────────

export function loadSkillCards(): SkillCard[] {
  if (_cache.size > 0 && Date.now() - _cacheTs < CACHE_TTL_MS) {
    return Array.from(_cache.values());
  }
  _cache.clear();
  const dir = resolveSkillCardsDir();
  if (!dir) return [];

  try {
    const entries = readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const f of entries) {
      const card = parseSkillCard(join(dir, f));
      if (card) _cache.set(card.slug, card);
    }
  } catch {
    // Dir unreadable — return empty
  }

  _cacheTs = Date.now();
  return Array.from(_cache.values());
}

// ── Trigger Matching ─────────────────────────────────────────────
// Fast keyword match against user message. No LLM call needed.
// Returns the best-matching card, or null if no strong match.

export function matchSkillCard(userMessage: string): SkillCard | null {
  const cards = loadSkillCards();
  if (cards.length === 0) return null;

  const msg = userMessage.toLowerCase();
  let bestCard: SkillCard | null = null;
  let bestScore = 0;

  for (const card of cards) {
    let score = 0;
    for (const trigger of card.triggers) {
      // Word boundary match — "calendar" matches "check my calendar" but not "calendarify"
      const regex = new RegExp(`\\b${escapeRegex(trigger)}\\b`, "i");
      if (regex.test(msg)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCard = card;
    }
  }

  // Require at least 1 trigger match
  return bestScore >= 1 ? bestCard : null;
}

// ── Format for Context ──────────────────────────────────────────

const MAX_CARD_LINES = 40;

/**
 * Format a skill card for context injection.
 * Truncates to MAX_CARD_LINES to respect budget.
 */
export function formatSkillCard(card: SkillCard): string {
  const lines = card.body.split("\n");
  const truncated = lines.length > MAX_CARD_LINES
    ? lines.slice(0, MAX_CARD_LINES).join("\n") + `\n(+${lines.length - MAX_CARD_LINES} more lines — search vault for full card)`
    : card.body;

  return `## Skill Card: ${card.domain}\n${truncated}`;
}

// ── First-Boot Seeding ──────────────────────────────────────────
// Copy shipped skill cards to user's directory if none exist yet.

export function ensureSkillCards(pluginRoot: string): void {
  // Check if user already has cards
  if (resolveSkillCardsDir()) return;

  // Source: <plugin>/skill-cards/
  const shipped = join(pluginRoot, "skill-cards");
  if (!existsSync(shipped)) return;

  // Destination: ~/godmode/memory/skill-cards/
  const dest = join(MEMORY_DIR, "skill-cards");
  try {
    mkdirSync(dest, { recursive: true });
    const files = readdirSync(shipped).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      copyFileSync(join(shipped, f), join(dest, f));
    }
  } catch {
    // Non-fatal — user just won't have skill cards yet
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
