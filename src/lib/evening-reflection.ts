/**
 * evening-reflection.ts — Evening reflection capture and retrieval.
 *
 * Closes the daily loop: ally asks 3 reflective questions at ~6pm,
 * answers are captured to ~/godmode/memory/reflections/YYYY-MM-DD.md,
 * and the morning brief references yesterday's reflection.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../data-paths.js";

// ── Constants ────────────────────────────────────────────────────────

const REFLECTIONS_DIR = join(MEMORY_DIR, "reflections");

export interface ReflectionAnswers {
  movedNeedle: string;
  busywork: string;
  avoiding: string;
  date: string;
}

// ── Build reflection prompt ──────────────────────────────────────────

/**
 * Generate the reflection prompt injected into ally context around 6pm.
 * Instructs the ally to ask three questions one at a time, conversationally.
 */
export function buildReflectionPrompt(): string {
  return [
    "## Evening Reflection",
    "",
    "It's evening — time for a quick reflection before wrapping up.",
    "Ask the user these three questions **one at a time**, conversationally.",
    "Wait for each answer before asking the next. Keep it warm and brief.",
    "",
    '1. "What moved the needle today?"',
    '2. "What felt like busywork?"',
    '3. "Is there anything you\'ve been avoiding?"',
    "",
    "After all three answers, call `godmode.saveReflection` with the responses.",
    "Thank the user and wish them a good evening.",
  ].join("\n");
}

// ── Save reflection ──────────────────────────────────────────────────

/**
 * Save a reflection to ~/godmode/memory/reflections/YYYY-MM-DD.md.
 * Returns the written file path.
 */
export async function saveReflection(answers: ReflectionAnswers): Promise<string> {
  await mkdir(REFLECTIONS_DIR, { recursive: true });

  const date = answers.date || localDateString();
  const filePath = join(REFLECTIONS_DIR, `${date}.md`);

  const content = [
    "---",
    `date: ${date}`,
    "type: reflection",
    "---",
    "",
    "## What moved the needle",
    "",
    answers.movedNeedle,
    "",
    "## What felt like busywork",
    "",
    answers.busywork,
    "",
    "## What I've been avoiding",
    "",
    answers.avoiding,
    "",
  ].join("\n");

  await writeFile(filePath, content, "utf-8");
  return filePath;
}

// ── Load latest reflection ───────────────────────────────────────────

/**
 * Load the most recent reflection file (typically yesterday's).
 * Scans ~/godmode/memory/reflections/ for the latest YYYY-MM-DD.md file.
 * Returns null if no reflections exist.
 */
export async function loadLatestReflection(): Promise<ReflectionAnswers | null> {
  let files: string[];
  try {
    files = await readdir(REFLECTIONS_DIR);
  } catch {
    return null;
  }

  // Filter to YYYY-MM-DD.md files and sort descending
  const dated = files
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse();

  if (dated.length === 0) return null;

  const latest = dated[0];
  const date = latest.replace(/\.md$/, "");

  try {
    const raw = await readFile(join(REFLECTIONS_DIR, latest), "utf-8");
    return parseReflection(raw, date);
  } catch {
    return null;
  }
}

/**
 * Load a reflection for a specific date.
 */
export async function loadReflection(date: string): Promise<ReflectionAnswers | null> {
  const filePath = join(REFLECTIONS_DIR, `${date}.md`);
  try {
    const raw = await readFile(filePath, "utf-8");
    return parseReflection(raw, date);
  } catch {
    return null;
  }
}

// ── Internal parser ──────────────────────────────────────────────────

function parseReflection(raw: string, date: string): ReflectionAnswers {
  const extractSection = (heading: string): string => {
    const pattern = new RegExp(
      `##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
      "m",
    );
    return pattern.exec(raw)?.[1]?.trim() || "";
  };

  return {
    date,
    movedNeedle: extractSection("What moved the needle"),
    busywork: extractSection("What felt like busywork"),
    avoiding: extractSection("What I've been avoiding"),
  };
}
