/**
 * agent-lessons.ts — Structured lesson storage for the rejection feedback loop.
 *
 * When queue results are rejected or approved-with-edits, the reason gets
 * stored as a "lesson" keyed by persona (or global). These lessons are
 * injected into future agent prompts via buildPromptForItem() so agents
 * learn from past corrections.
 *
 * Source of truth: ~/godmode/data/agent-lessons.json
 */

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { DATA_DIR } from "../data-paths.js";

const LESSONS_FILE = join(DATA_DIR, "agent-lessons.json");
const MAX_LESSONS_PER_KEY = 20;

// ── Types ─────────────────────────────────────────────────────────

export type LessonCategory =
  | "tone"
  | "format"
  | "accuracy"
  | "scope"
  | "style"
  | "process"
  | "routing"
  | "other";

export type Lesson = {
  id: string;
  /** Actionable rule, e.g. "Always use bullet points, not paragraphs" */
  rule: string;
  category: LessonCategory;
  sourceTaskId: string;
  sourceTaskTitle: string;
  createdAt: string;
  /** How many times this lesson has been injected into a prompt */
  appliedCount: number;
};

export type AgentLessonsState = {
  global: Lesson[];
  perPersona: Record<string, Lesson[]>;
  updatedAt: string;
};

// ── State I/O (same pattern as trust-tracker.ts) ──────────────────

function emptyState(): AgentLessonsState {
  return { global: [], perPersona: {}, updatedAt: new Date().toISOString() };
}

export async function readLessonsState(): Promise<AgentLessonsState> {
  try {
    const raw = await readFile(LESSONS_FILE, "utf-8");
    return JSON.parse(raw) as AgentLessonsState;
  } catch {
    return emptyState();
  }
}

async function writeLessonsState(state: AgentLessonsState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  await mkdir(dirname(LESSONS_FILE), { recursive: true });
  // Atomic write: temp file + rename to prevent corruption on crash
  const tmpPath = LESSONS_FILE + ".tmp";
  await writeFile(tmpPath, JSON.stringify(state, null, 2), "utf-8");
  await rename(tmpPath, LESSONS_FILE);
}

// ── Core API ──────────────────────────────────────────────────────

/**
 * Add a lesson to the store. If personaSlug is provided, the lesson is
 * scoped to that persona; otherwise it's global.
 */
export async function addLesson(
  lesson: Omit<Lesson, "id" | "createdAt" | "appliedCount">,
  personaSlug?: string,
): Promise<Lesson> {
  const state = await readLessonsState();
  const entry: Lesson = {
    ...lesson,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    appliedCount: 0,
  };

  if (personaSlug) {
    if (!state.perPersona[personaSlug]) state.perPersona[personaSlug] = [];
    state.perPersona[personaSlug].push(entry);
    if (state.perPersona[personaSlug].length > MAX_LESSONS_PER_KEY) {
      state.perPersona[personaSlug] = state.perPersona[personaSlug].slice(-MAX_LESSONS_PER_KEY);
    }
  } else {
    state.global.push(entry);
    if (state.global.length > MAX_LESSONS_PER_KEY) {
      state.global = state.global.slice(-MAX_LESSONS_PER_KEY);
    }
  }

  await writeLessonsState(state);
  return entry;
}

/**
 * Remove a lesson by ID. Searches both global and all persona buckets.
 */
export async function removeLesson(lessonId: string): Promise<boolean> {
  const state = await readLessonsState();
  let found = false;

  const gIdx = state.global.findIndex((l) => l.id === lessonId);
  if (gIdx !== -1) {
    state.global.splice(gIdx, 1);
    found = true;
  }

  for (const slug of Object.keys(state.perPersona)) {
    const pIdx = state.perPersona[slug].findIndex((l) => l.id === lessonId);
    if (pIdx !== -1) {
      state.perPersona[slug].splice(pIdx, 1);
      found = true;
    }
  }

  if (found) await writeLessonsState(state);
  return found;
}

/**
 * Get lessons relevant to a persona. Returns persona-specific + global lessons.
 * Increments appliedCount on each returned lesson (best-effort).
 */
export async function getLessonsForPrompt(personaSlug?: string): Promise<Lesson[]> {
  const state = await readLessonsState();
  const lessons: Lesson[] = [...state.global];

  if (personaSlug && state.perPersona[personaSlug]) {
    lessons.push(...state.perPersona[personaSlug]);
  }

  // Increment appliedCount (best-effort write-back)
  for (const l of lessons) {
    l.appliedCount++;
  }
  await writeLessonsState(state).catch((err: unknown) => console.warn("[agent-lessons] write-back failed:", err instanceof Error ? err.message : String(err)));

  return lessons;
}

/**
 * Format lessons into a prompt section for injection into agent prompts.
 */
export function formatLessonsForPrompt(lessons: Lesson[]): string {
  if (lessons.length === 0) return "";

  const lines: string[] = [
    "## Past Lessons",
    "These are rules learned from previous corrections. Follow them:",
  ];

  for (const l of lessons) {
    lines.push(`- **[${l.category}]** ${l.rule}`);
  }

  return lines.join("\n");
}

// ── Routing Lessons (ally-specific) ──────────────────────────────

const ROUTING_PERSONA = "__ally_routing__";

/**
 * Get routing lessons for the ally itself (not queue agents).
 * These accumulate when the ally makes routing mistakes
 * (asks user for info it could have looked up, uses wrong tool, etc.)
 */
export async function getRoutingLessons(): Promise<Lesson[]> {
  const state = await readLessonsState();
  const routing = state.perPersona[ROUTING_PERSONA] ?? [];
  // Also include global routing-category lessons
  const globalRouting = state.global.filter((l) => l.category === "routing");
  return [...globalRouting, ...routing];
}

/**
 * Add a routing lesson for the ally.
 */
export async function addRoutingLesson(rule: string, sourceContext: string): Promise<Lesson> {
  return addLesson(
    {
      rule,
      category: "routing",
      sourceTaskId: "ally-correction",
      sourceTaskTitle: sourceContext,
    },
    ROUTING_PERSONA,
  );
}

/**
 * Format routing lessons for context injection.
 * Only includes lessons RELEVANT to the current message (keyword match).
 * Returns empty string if no relevant lessons.
 */
export function formatRoutingLessons(lessons: Lesson[], userMessage?: string): string {
  if (lessons.length === 0) return "";

  // If no user message, skip injection entirely (don't waste tokens)
  if (!userMessage || userMessage.length < 3) return "";

  const query = userMessage.toLowerCase();

  // Only inject lessons whose rules or source context match the current topic
  const relevant = lessons.filter((l) => {
    const ruleWords = extractKeywords(l.rule);
    const contextWords = extractKeywords(l.sourceTaskTitle);
    return ruleWords.some((w) => query.includes(w)) || contextWords.some((w) => query.includes(w));
  });

  if (relevant.length === 0) return "";

  const lines: string[] = [
    "## Routing Corrections",
    "You have been corrected on these in the past. Do NOT repeat these mistakes:",
  ];

  for (const l of relevant.slice(0, 5)) {
    lines.push(`- ${l.rule}`);
  }

  return lines.join("\n");
}

/** Extract meaningful keywords from a lesson rule for relevance matching */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "shall", "can", "to", "of", "in", "for", "on", "with", "at",
    "by", "from", "as", "into", "about", "not", "no", "or", "and", "but", "if",
    "then", "than", "that", "this", "it", "its", "you", "your", "i", "my", "me",
    "we", "our", "they", "them", "their", "what", "when", "where", "who", "how",
    "all", "any", "each", "every", "before", "after", "up", "down", "out",
    "don't", "always", "never", "use", "using", "first", "without"]);
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w))
    .slice(0, 15);
}
