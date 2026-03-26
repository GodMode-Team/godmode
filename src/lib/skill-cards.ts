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

import { existsSync, readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join, basename } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import { SKILL_CARD_CACHE_TTL_MS, MAX_SKILL_CARD_LINES } from "./constants.js";

// ── Types ────────────────────────────────────────────────────────

export type SkillCard = {
  slug: string;
  domain: string;
  triggers: string[];
  tools: string[];
  body: string;
  isDraft?: boolean;
};

// ── Cache ────────────────────────────────────────────────────────

const _cache: Map<string, SkillCard> = new Map();
let _cacheTs = 0;
const CACHE_TTL_MS = SKILL_CARD_CACHE_TTL_MS;

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

// ── Skill Drafts Path ────────────────────────────────────────────

function resolveSkillDraftsDir(): string | null {
  const vault = getVaultPath();
  if (vault) {
    const vaultDrafts = join(vault, VAULT_FOLDERS.system, "skill-drafts");
    if (existsSync(vaultDrafts)) return vaultDrafts;
  }
  const localDrafts = join(MEMORY_DIR, "skill-drafts");
  if (existsSync(localDrafts)) return localDrafts;
  return null;
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

  // Also scan skill-drafts/ — drafts don't overwrite canonical cards
  const draftsDir = resolveSkillDraftsDir();
  if (draftsDir) {
    try {
      const draftEntries = readdirSync(draftsDir).filter((f) => f.endsWith(".md"));
      for (const f of draftEntries) {
        const card = parseSkillCard(join(draftsDir, f));
        if (card && !_cache.has(card.slug)) {
          card.isDraft = true;
          _cache.set(card.slug, card);
        }
      }
    } catch {
      // Dir unreadable — skip drafts
    }
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

const MAX_CARD_LINES = MAX_SKILL_CARD_LINES;

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

// ── Skill Promotion ──────────────────────────────────────────────
// Promotes a draft skill card to the canonical skill-cards/ directory.

export function promoteSkillCard(slug: string): { ok: boolean; error?: string } {
  const draftsDir = resolveSkillDraftsDir();
  if (!draftsDir) return { ok: false, error: "No skill-drafts directory found" };

  const draftPath = join(draftsDir, `${slug}.md`);
  if (!existsSync(draftPath)) return { ok: false, error: `Draft "${slug}" not found` };

  // Resolve canonical destination
  let destDir = resolveSkillCardsDir();
  if (!destDir) {
    // Create default location
    destDir = join(MEMORY_DIR, "skill-cards");
    mkdirSync(destDir, { recursive: true });
  }

  const destPath = join(destDir, `${slug}.md`);
  if (existsSync(destPath)) return { ok: false, error: `Canonical card "${slug}" already exists` };

  try {
    // Read draft, strip "status: draft" from frontmatter
    let content = readFileSync(draftPath, "utf-8");
    content = content.replace(/^status:\s*draft\s*\r?\n/m, "");

    // Write to canonical dir and delete original
    writeFileSync(destPath, content, "utf-8");
    unlinkSync(draftPath);

    // Invalidate cache so next load picks up the promoted card
    _cache.clear();
    _cacheTs = 0;

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
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
