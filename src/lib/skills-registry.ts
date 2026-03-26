/**
 * skills-registry.ts — Loads skill files from vault or local fallback.
 *
 * Users define repeatable skills as markdown files with YAML frontmatter.
 * The heartbeat checks cron-triggered skills on each tick and creates
 * queue items when a skill's schedule fires.
 *
 * Skill file locations (vault-first):
 *   VAULT/99-System/skills/   ← vault path
 *   ~/godmode/skills/          ← local fallback
 *
 * Frontmatter fields:
 *   name: Human-readable name
 *   trigger: manual | cron | event
 *   schedule: "daily 9am" | "weekly monday 9am" | "weekdays 9am" | "every 4h"
 *   persona: slug of agent-roster persona
 *   taskType: coding | research | analysis | creative | review | ops | task
 *   priority: high | normal | low
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { MEMORY_DIR, DATA_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import { getAllyName } from "./ally-identity.js";
import type { QueueItemType } from "./queue-state.js";

// ── Types ────────────────────────────────────────────────────────

export type SkillTrigger = "manual" | "cron" | "event";

export type SkillProfile = {
  slug: string;
  name: string;
  trigger: SkillTrigger;
  schedule?: string;
  persona?: string;
  taskType: QueueItemType;
  priority: "high" | "normal" | "low";
  body: string;
};

export type SkillRunState = {
  lastRuns: Record<string, number>; // slug → epoch ms
};

// ── Cache ────────────────────────────────────────────────────────

const _cache: Map<string, SkillProfile> = new Map();
let _cacheTs = 0;
const CACHE_TTL_MS = 30_000;

// ── Path Resolution ──────────────────────────────────────────────

export function resolveSkillsDir(): string | null {
  const vault = getVaultPath();
  if (vault) {
    const vaultSkills = join(vault, VAULT_FOLDERS.system, "skills");
    if (existsSync(vaultSkills)) return vaultSkills;
  }
  const homeSkills = join(dirname(MEMORY_DIR), "skills");
  if (existsSync(homeSkills)) return homeSkills;
  return null;
}

// ── Frontmatter Parser (minimal, no deps) ────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Strip surrounding quotes (standard YAML practice)
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (key && val) meta[key] = val;
  }
  return { meta, body: match[2] };
}

// ── File Parsing ─────────────────────────────────────────────────

function parseSkillFile(filePath: string): SkillProfile | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = basename(filePath, ".md");
    const trigger = (["manual", "cron", "event"] as const).includes(
      meta.trigger?.toLowerCase() as SkillTrigger,
    )
      ? (meta.trigger.toLowerCase() as SkillTrigger)
      : "manual";
    const taskType = (meta.taskType as QueueItemType) || "task";
    const priority = (["high", "normal", "low"] as const).includes(
      meta.priority?.toLowerCase() as "high" | "normal" | "low",
    )
      ? (meta.priority.toLowerCase() as "high" | "normal" | "low")
      : "normal";

    return {
      slug,
      name: meta.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      trigger,
      schedule: meta.schedule || undefined,
      persona: meta.persona || undefined,
      taskType,
      priority,
      body: body.trim().replaceAll("{{ALLY_NAME}}", getAllyName()),
    };
  } catch {
    return null;
  }
}

// ── Load All Skills ──────────────────────────────────────────────

export function loadSkills(): SkillProfile[] {
  if (_cache.size > 0 && Date.now() - _cacheTs < CACHE_TTL_MS) {
    return Array.from(_cache.values());
  }
  _cache.clear();
  const dir = resolveSkillsDir();
  if (!dir) return [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const skill = parseSkillFile(join(dir, entry.name));
        if (skill) _cache.set(skill.slug, skill);
      } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
        // Support subdirectories
        try {
          const files = readdirSync(join(dir, entry.name)).filter((f) => f.endsWith(".md"));
          for (const f of files) {
            const skill = parseSkillFile(join(dir, entry.name, f));
            if (skill) _cache.set(skill.slug, skill);
          }
        } catch {
          // Skip unreadable dirs
        }
      }
    }
  } catch {
    // Skills dir unreadable — return empty
  }

  _cacheTs = Date.now();
  return Array.from(_cache.values());
}

// ── Accessors ────────────────────────────────────────────────────

export function getSkill(slug: string): SkillProfile | null {
  const skills = loadSkills();
  return skills.find((s) => s.slug === slug) ?? null;
}

export function getCronSkills(): SkillProfile[] {
  return loadSkills().filter((s) => s.trigger === "cron" && s.schedule);
}

// ── Schedule Parser ──────────────────────────────────────────────

/**
 * Parse a human-readable schedule into a check function.
 * Supported formats:
 *   "daily <time>"        → every day at <time>
 *   "weekly <day> <time>" → every <day> at <time>
 *   "weekdays <time>"     → Mon-Fri at <time>
 *   "every <N>h"          → every N hours
 */
export function parseSchedule(
  schedule: string,
): { shouldRun: (now: Date, lastRun: number) => boolean } | null {
  const s = schedule.toLowerCase().trim();

  // "every <N>h"
  const everyMatch = s.match(/^every\s+(\d+)\s*h$/);
  if (everyMatch) {
    const hours = parseInt(everyMatch[1], 10);
    if (hours <= 0) return null;
    const intervalMs = hours * 60 * 60 * 1000;
    return {
      shouldRun: (now, lastRun) => now.getTime() - lastRun >= intervalMs,
    };
  }

  // Parse time from end of string (e.g. "9am", "9:30am", "14:00", "2pm")
  const parseTime = (timeStr: string): { hour: number; minute: number } | null => {
    const t = timeStr.trim().toLowerCase();
    // "9am", "9pm", "9:30am"
    const ampm = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
    if (ampm) {
      let hour = parseInt(ampm[1], 10);
      const minute = ampm[2] ? parseInt(ampm[2], 10) : 0;
      if (ampm[3] === "pm" && hour !== 12) hour += 12;
      if (ampm[3] === "am" && hour === 12) hour = 0;
      return { hour, minute };
    }
    // "14:00", "9:30"
    const mil = t.match(/^(\d{1,2}):(\d{2})$/);
    if (mil) {
      return { hour: parseInt(mil[1], 10), minute: parseInt(mil[2], 10) };
    }
    return null;
  };

  // "daily <time>"
  const dailyMatch = s.match(/^daily\s+(.+)$/);
  if (dailyMatch) {
    const time = parseTime(dailyMatch[1]);
    if (!time) return null;
    return {
      shouldRun: (now, lastRun) => {
        if (now.getHours() < time.hour) return false;
        if (now.getHours() === time.hour && now.getMinutes() < time.minute) return false;
        // Already ran today?
        const lastRunDate = new Date(lastRun);
        return lastRunDate.toDateString() !== now.toDateString();
      },
    };
  }

  // "weekdays <time>"
  const weekdaysMatch = s.match(/^weekdays\s+(.+)$/);
  if (weekdaysMatch) {
    const time = parseTime(weekdaysMatch[1]);
    if (!time) return null;
    return {
      shouldRun: (now, lastRun) => {
        const day = now.getDay();
        if (day === 0 || day === 6) return false; // weekend
        if (now.getHours() < time.hour) return false;
        if (now.getHours() === time.hour && now.getMinutes() < time.minute) return false;
        const lastRunDate = new Date(lastRun);
        return lastRunDate.toDateString() !== now.toDateString();
      },
    };
  }

  // "weekly <day> <time>"
  const weeklyMatch = s.match(/^weekly\s+(\w+)\s+(.+)$/);
  if (weeklyMatch) {
    const dayNames: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
      sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
    };
    const targetDay = dayNames[weeklyMatch[1].toLowerCase()];
    if (targetDay === undefined) return null;
    const time = parseTime(weeklyMatch[2]);
    if (!time) return null;
    return {
      shouldRun: (now, lastRun) => {
        if (now.getDay() !== targetDay) return false;
        if (now.getHours() < time.hour) return false;
        if (now.getHours() === time.hour && now.getMinutes() < time.minute) return false;
        const lastRunDate = new Date(lastRun);
        return lastRunDate.toDateString() !== now.toDateString();
      },
    };
  }

  return null;
}

// ── Skill Run State Persistence ──────────────────────────────────

const SKILL_RUNS_FILE = join(DATA_DIR, "skill-runs.json");

export async function readSkillRuns(): Promise<SkillRunState> {
  try {
    const raw = await readFile(SKILL_RUNS_FILE, "utf-8");
    return JSON.parse(raw) as SkillRunState;
  } catch {
    return { lastRuns: {} };
  }
}

export async function saveSkillRuns(state: SkillRunState): Promise<void> {
  await mkdir(dirname(SKILL_RUNS_FILE), { recursive: true });
  // Atomic write: temp file + rename to prevent corruption on crash
  const tmpPath = SKILL_RUNS_FILE + ".tmp";
  await writeFile(tmpPath, JSON.stringify(state, null, 2), "utf-8");
  await rename(tmpPath, SKILL_RUNS_FILE);
}
