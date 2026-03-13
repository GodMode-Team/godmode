/**
 * feedback-writer.ts — Self-evolution feedback loop.
 *
 * When a user scores an inbox item, the feedback gets written back into
 * the source persona and/or skill card files. Low scores add corrections,
 * high scores add reinforcements. This is the engine that makes agents
 * and skills get better every day.
 *
 * Feedback targets:
 *   1. agent-lessons.json (for routing intelligence)
 *   2. Persona markdown file (for execution intelligence)
 *   3. Skill card markdown file (for skill quality)
 */

import { readFile, appendFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { addLesson, type LessonCategory } from "./agent-lessons.js";
import { MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import type { InboxItem } from "../services/inbox.js";

// ── Public API ───────────────────────────────────────────────────

/**
 * Write feedback from inbox scoring back into the source files.
 * Called after the user scores an inbox item.
 */
export async function writeFeedbackToSource(
  item: InboxItem,
  score: number,
  feedback: string,
): Promise<void> {
  const dateStr = new Date().toISOString().slice(0, 10);

  // 1. Write to agent-lessons (for routing intelligence)
  if (item.source.persona && feedback) {
    const category = inferCategory(feedback);
    await addLesson(
      {
        rule: feedback,
        category,
        sourceTaskId: item.source.queueItemId ?? item.id,
        sourceTaskTitle: item.title,
      },
      item.source.persona,
    );
  }

  // 2. Write to persona markdown file (for execution intelligence)
  if (item.source.persona && feedback) {
    const personaPath = resolvePersonaPath(item.source.persona);
    if (personaPath) {
      await appendFeedbackToFile(personaPath, score, feedback, dateStr);
    }
  }

  // 3. Write to skill card file (same pattern)
  if (item.source.skill && feedback) {
    const skillPath = resolveSkillPath(item.source.skill);
    if (skillPath) {
      await appendFeedbackToFile(skillPath, score, feedback, dateStr);
    }
  }
}

// ── File Feedback Appender ───────────────────────────────────────

async function appendFeedbackToFile(
  filePath: string,
  score: number,
  feedback: string,
  dateStr: string,
): Promise<void> {
  if (!existsSync(filePath)) return;

  try {
    const existing = await readFile(filePath, "utf-8");

    if (score <= 4) {
      const entry = `\n- [${dateStr}] Score ${score}/10: ${feedback}`;
      if (existing.includes("## Corrections")) {
        await appendToSection(filePath, existing, "## Corrections", entry);
      } else {
        await appendFile(filePath, `\n\n## Corrections${entry}`);
      }
    } else if (score >= 9) {
      const entry = `\n- [${dateStr}] Score ${score}/10: ${feedback}`;
      if (existing.includes("## What Works Well")) {
        await appendToSection(filePath, existing, "## What Works Well", entry);
      } else {
        await appendFile(filePath, `\n\n## What Works Well${entry}`);
      }
    }
  } catch {
    // Non-fatal — don't break inbox scoring if file write fails
  }
}

/**
 * Append text after a markdown section header, before the next section.
 */
async function appendToSection(
  filePath: string,
  content: string,
  sectionHeader: string,
  text: string,
): Promise<void> {
  const headerIdx = content.indexOf(sectionHeader);
  if (headerIdx === -1) return;

  // Find the end of this section (next ## or end of file)
  const afterHeader = headerIdx + sectionHeader.length;
  const nextSectionMatch = content.slice(afterHeader).match(/\n## /);
  const insertAt = nextSectionMatch
    ? afterHeader + nextSectionMatch.index!
    : content.length;

  const updated = content.slice(0, insertAt) + text + content.slice(insertAt);
  await writeFile(filePath, updated, "utf-8");
}

// ── Path Resolution ──────────────────────────────────────────────

function resolvePersonaPath(personaSlug: string): string | null {
  // Check vault first
  const vault = getVaultPath();
  if (vault) {
    const vaultRoster = join(vault, VAULT_FOLDERS.system, "agent-roster");
    // Personas can be in subdirs (category/slug.md) or flat (slug.md)
    const flat = join(vaultRoster, `${personaSlug}.md`);
    if (existsSync(flat)) return flat;

    // Check subdirs
    try {
      const { readdirSync } = require("node:fs");
      const entries = readdirSync(vaultRoster, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const nested = join(vaultRoster, entry.name, `${personaSlug}.md`);
          if (existsSync(nested)) return nested;
        }
      }
    } catch { /* fall through */ }
  }

  // Local fallback
  const localRoster = join(MEMORY_DIR, "agent-roster");
  const localFlat = join(localRoster, `${personaSlug}.md`);
  if (existsSync(localFlat)) return localFlat;

  try {
    const { readdirSync } = require("node:fs");
    const entries = readdirSync(localRoster, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const nested = join(localRoster, entry.name, `${personaSlug}.md`);
        if (existsSync(nested)) return nested;
      }
    }
  } catch { /* not found */ }

  return null;
}

function resolveSkillPath(skillSlug: string): string | null {
  // Check vault first
  const vault = getVaultPath();
  if (vault) {
    const vaultSkills = join(vault, VAULT_FOLDERS.system, "skill-cards");
    const path = join(vaultSkills, `${skillSlug}.md`);
    if (existsSync(path)) return path;
  }

  // Local fallback
  const localSkills = join(MEMORY_DIR, "skill-cards");
  const path = join(localSkills, `${skillSlug}.md`);
  if (existsSync(path)) return path;

  return null;
}

// ── Helpers ──────────────────────────────────────────────────────

function inferCategory(feedback: string): LessonCategory {
  const lower = feedback.toLowerCase();
  if (lower.includes("tone") || lower.includes("voice") || lower.includes("too formal") || lower.includes("too casual")) return "tone";
  if (lower.includes("format") || lower.includes("structure") || lower.includes("layout")) return "format";
  if (lower.includes("wrong") || lower.includes("incorrect") || lower.includes("inaccurate")) return "accuracy";
  if (lower.includes("scope") || lower.includes("too much") || lower.includes("too little") || lower.includes("missing")) return "scope";
  if (lower.includes("style") || lower.includes("writing")) return "style";
  if (lower.includes("process") || lower.includes("workflow") || lower.includes("steps")) return "process";
  return "other";
}
