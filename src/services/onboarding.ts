/**
 * onboarding.ts — Memory Onboarding Wizard Service
 *
 * Takes a new user from zero to a working GodMode memory system in 5 minutes.
 * Generates workspace files (AGENTS.md, USER.md, SOUL.md, etc.) and patches
 * the OC config with optimal memory/agent defaults.
 *
 * All file generation is idempotent: existing files are skipped unless force=true.
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { localDateString } from "../data-paths.js";
import { getAllyName } from "../lib/ally-identity.js";
import {
  ONBOARDING_MAX_FIELD_LENGTH, ONBOARDING_MAX_KEY_PEOPLE,
  ONBOARDING_MAX_HARD_RULES, MODEL_ADAPTER_DEFAULT,
} from "../lib/constants.js";
import { resolveProviderConfig } from "../lib/provider-config.js";
import {
  generateAgentsMd,
  generateUserMd,
  generateSoulMd,
  generateHeartbeatMd,
  generateWorkingMd,
  generateMistakesMd,
  generateTacitMd,
  generateCuratedMd,
  generatePersonMd,
  generateProjectMd,
  generateDailyNoteMd,
} from "./onboarding-templates.js";

// ── Types ────────────────────────────────────────────────────────

/**
 * Soul profile — deep identity data collected during conversational onboarding.
 * Organized in 6 blocks mirroring the onboarding interview structure.
 */
export interface SoulProfile {
  // Block 1: The Ground
  ground?: string;              // What they believe they're here to build/become/give
  anchor?: string;              // What they return to when everything falls apart
  atMyBest?: string;            // "At my best, I'm someone who ___"

  // Block 2: Their Modes
  flowState?: string;           // What they're like in flow + what they need
  depletedState?: string;       // What they're like depleted + what they need
  shadowState?: string;         // Under-pressure version they're not proud of

  // Block 3: Pattern Tendencies
  recurringPattern?: string;    // Thing they keep doing that they wish they didn't
  disguisedDistraction?: string; // Distraction dressed as opportunity
  blindSpot?: string;           // What their people say is their blind spot

  // Block 4: Truth + Love Calibration
  challengeLevel?: string;     // push-me-hard to give-me-space scale
  offLimits?: string;          // Things to never bring up
  correctionStyle?: string;    // Best way to tell them they're wrong

  // Block 5: What's Sacred
  nonNegotiables?: string[];   // Things that don't get sacrificed for work
  importantPeople?: Array<{ name: string; context: string }>;
  goodDay?: string;            // What a good day looks like (not productive — good)

  // Block 6: What Annoys Them
  annoyingAiBehavior?: string;     // Most annoying thing an AI has done
  trustBreakingPhrases?: string[]; // Phrases that make them trust less
  justGetItDone?: string;         // What "just get it done" means to them

  // Block 7: What Should Be Running
  desiredWorkflows?: string[];       // 3-5 things they want automated
  confirmBeforeActions?: string[];   // Actions that always need confirmation
}

export interface OnboardingAnswers {
  name: string;              // Q1: user's name
  timezone: string;          // Q2: timezone (e.g. "America/Chicago")
  focus: string;             // Q3: main focus / what they're building
  projects: string[];        // Q4: top 1-3 projects/companies
  commStyle: string;         // Q5: communication preferences
  hardRules: string[];       // Q6: immutable rules for the AI
  keyPeople: string[];       // Q7: important people
  defaultModel: string;      // Q8: preferred model
  soulProfile?: SoulProfile; // Deep identity data (optional, from conversational onboarding)
}

export interface OnboardingFileResult {
  path: string;
  created: boolean;
  skipped: boolean;
  reason?: string;
}

export interface OnboardingGenerateResult {
  files: OnboardingFileResult[];
  configPatched: boolean;
  configPatchError?: string;
}

export interface OnboardingStatusResult {
  workspaceExists: boolean;
  files: Record<string, boolean>;
  missingCritical: string[];
  /** Files that exist but are missing key universal sections from the latest template. */
  outdated?: string[];
  ready: boolean;
}

export interface OnboardingPreviewResult {
  files: Array<{ path: string; exists: boolean; wouldCreate: boolean }>;
  configChanges: Record<string, unknown>;
}

// ── Limits ───────────────────────────────────────────────────────

/** Maximum number of projects the wizard will generate stubs for. */
const MAX_PROJECTS = 10;

/** Maximum number of key people the wizard will generate stubs for. */
const MAX_KEY_PEOPLE = ONBOARDING_MAX_KEY_PEOPLE;

/** Maximum number of hard rules to include in AGENTS.md. */
const MAX_HARD_RULES = ONBOARDING_MAX_HARD_RULES;

/** Maximum character length for free-text answer fields. */
const MAX_FIELD_LEN = ONBOARDING_MAX_FIELD_LENGTH;

// ── Helpers ──────────────────────────────────────────────────────

const OC_CONFIG_PATH = join(homedir(), ".openclaw", "openclaw.json");

async function fileExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isFile();
  } catch {
    return false;
  }
}

async function dirExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function writeIfNew(
  filePath: string,
  content: string,
  force: boolean,
): Promise<OnboardingFileResult> {
  const exists = await fileExists(filePath);
  if (exists && !force) {
    return { path: filePath, created: false, skipped: true, reason: "already exists" };
  }
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
  return { path: filePath, created: true, skipped: false };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function today(): string {
  return localDateString();
}

function nowTimestamp(): string {
  return new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, "");
}

/** Clamp a free-text field to MAX_FIELD_LEN, trimmed. */
function clampText(s: string, max = MAX_FIELD_LEN): string {
  const trimmed = s.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

/**
 * Validate and normalize OnboardingAnswers. Applies sensible defaults,
 * enforces length limits, and strips empty entries from arrays.
 * Returns a clean copy -- never mutates the input.
 */
export function sanitizeAnswers(raw: Partial<OnboardingAnswers>): OnboardingAnswers {
  const name = clampText(raw.name?.trim() || "User");
  const timezone = clampText(
    raw.timezone?.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const focus = clampText(raw.focus?.trim() || "Building with AI");
  const commStyle = clampText(raw.commStyle?.trim() || "Direct and concise");
  const defaultModel = clampText(raw.defaultModel?.trim() || "sonnet", 30);

  const projects = (raw.projects ?? [])
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => clampText(p, 120))
    .slice(0, MAX_PROJECTS);

  const hardRules = (raw.hardRules ?? [])
    .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    .map((r) => clampText(r, 200))
    .slice(0, MAX_HARD_RULES);

  const keyPeople = (raw.keyPeople ?? [])
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => clampText(p, 80))
    .slice(0, MAX_KEY_PEOPLE);

  // Sanitize soul profile if present
  let soulProfile: SoulProfile | undefined;
  if (raw.soulProfile && typeof raw.soulProfile === "object") {
    const sp = raw.soulProfile;
    soulProfile = {
      ...(sp.ground ? { ground: clampText(sp.ground, 1000) } : {}),
      ...(sp.anchor ? { anchor: clampText(sp.anchor, 500) } : {}),
      ...(sp.atMyBest ? { atMyBest: clampText(sp.atMyBest, 500) } : {}),
      ...(sp.flowState ? { flowState: clampText(sp.flowState, 1000) } : {}),
      ...(sp.depletedState ? { depletedState: clampText(sp.depletedState, 1000) } : {}),
      ...(sp.shadowState ? { shadowState: clampText(sp.shadowState, 1000) } : {}),
      ...(sp.recurringPattern ? { recurringPattern: clampText(sp.recurringPattern, 500) } : {}),
      ...(sp.disguisedDistraction ? { disguisedDistraction: clampText(sp.disguisedDistraction, 500) } : {}),
      ...(sp.blindSpot ? { blindSpot: clampText(sp.blindSpot, 500) } : {}),
      ...(sp.challengeLevel ? { challengeLevel: clampText(sp.challengeLevel, 500) } : {}),
      ...(sp.offLimits ? { offLimits: clampText(sp.offLimits, 500) } : {}),
      ...(sp.correctionStyle ? { correctionStyle: clampText(sp.correctionStyle, 500) } : {}),
      ...(sp.nonNegotiables && Array.isArray(sp.nonNegotiables)
        ? { nonNegotiables: sp.nonNegotiables.filter((n): n is string => typeof n === "string" && n.trim().length > 0).map((n) => clampText(n, 200)).slice(0, 10) }
        : {}),
      ...(sp.importantPeople && Array.isArray(sp.importantPeople)
        ? { importantPeople: sp.importantPeople.filter((p): p is { name: string; context: string } => typeof p === "object" && p !== null && typeof p.name === "string").map((p) => ({ name: clampText(p.name, 80), context: clampText(p.context || "", 200) })).slice(0, MAX_KEY_PEOPLE) }
        : {}),
      ...(sp.goodDay ? { goodDay: clampText(sp.goodDay, 1000) } : {}),
      ...(sp.annoyingAiBehavior ? { annoyingAiBehavior: clampText(sp.annoyingAiBehavior, 500) } : {}),
      ...(sp.trustBreakingPhrases && Array.isArray(sp.trustBreakingPhrases)
        ? { trustBreakingPhrases: sp.trustBreakingPhrases.filter((p): p is string => typeof p === "string" && p.trim().length > 0).map((p) => clampText(p, 200)).slice(0, 10) }
        : {}),
      ...(sp.justGetItDone ? { justGetItDone: clampText(sp.justGetItDone, 500) } : {}),
      ...(sp.desiredWorkflows && Array.isArray(sp.desiredWorkflows)
        ? { desiredWorkflows: sp.desiredWorkflows.filter((w): w is string => typeof w === "string" && w.trim().length > 0).map((w) => clampText(w, 300)).slice(0, 10) }
        : {}),
      ...(sp.confirmBeforeActions && Array.isArray(sp.confirmBeforeActions)
        ? { confirmBeforeActions: sp.confirmBeforeActions.filter((a): a is string => typeof a === "string" && a.trim().length > 0).map((a) => clampText(a, 200)).slice(0, 10) }
        : {}),
    };
    // Only keep if at least one field was populated
    if (Object.keys(soulProfile).length === 0) soulProfile = undefined;
  }

  return { name, timezone, focus, projects, commStyle, hardRules, keyPeople, defaultModel, ...(soulProfile ? { soulProfile } : {}) };
}

// ── File Generators (extracted to onboarding-templates.ts) ──────
// Template functions: generateAgentsMd, generateUserMd, generateSoulMd,
// generateHeartbeatMd, generateWorkingMd, generateMistakesMd, generateTacitMd,
// generateCuratedMd, generatePersonMd, generateProjectMd, generateDailyNoteMd
// All imported from ./onboarding-templates.js above.

// The rest of this marker is here to preserve git blame for the config section below.
// ── OC Config Patch ─────────────────────────────────────────────

// ── Config Diff Helpers ─────────────────────────────────────────

export type ConfigDiffEntry = {
  path: string;
  current: unknown;
  recommended: unknown;
};

export type ConfigDiff = {
  additions: ConfigDiffEntry[];
  changes: ConfigDiffEntry[];
  matching: string[];
};

/**
 * Flatten two nested objects into dot-path comparisons.
 * Walks the `recommended` tree and looks up each leaf in `current`.
 */
export function flattenPaths(
  current: Record<string, unknown>,
  recommended: Record<string, unknown>,
  prefix = "",
): ConfigDiff {
  const additions: ConfigDiffEntry[] = [];
  const changes: ConfigDiffEntry[] = [];
  const matching: string[] = [];

  function walk(cur: Record<string, unknown>, rec: Record<string, unknown>, pfx: string) {
    for (const key of Object.keys(rec)) {
      const path = pfx ? `${pfx}.${key}` : key;
      const rVal = rec[key];
      const cVal = cur?.[key];

      // If recommended value is a plain object and current is too, recurse
      if (
        rVal !== null && rVal !== undefined && typeof rVal === "object" && !Array.isArray(rVal) &&
        cVal !== null && cVal !== undefined && typeof cVal === "object" && !Array.isArray(cVal)
      ) {
        walk(cVal as Record<string, unknown>, rVal as Record<string, unknown>, path);
      } else if (cVal === undefined || cVal === null) {
        additions.push({ path, current: cVal ?? null, recommended: rVal });
      } else if (JSON.stringify(cVal) !== JSON.stringify(rVal)) {
        changes.push({ path, current: cVal, recommended: rVal });
      } else {
        matching.push(path);
      }
    }
  }

  walk(current, recommended, prefix);
  return { additions, changes, matching };
}

/**
 * Compute a config diff between user's current OC config and GodMode's recommendations.
 */
export async function computeConfigDiff(
  answers: OnboardingAnswers,
  configPath?: string,
): Promise<ConfigDiff> {
  const clean = sanitizeAnswers(answers);
  const patch = buildConfigPatch(clean);
  const targetPath = configPath ?? OC_CONFIG_PATH;

  let existing: Record<string, unknown> = {};
  try {
    const raw = await readFile(targetPath, "utf-8");
    existing = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // Config doesn't exist — everything is an addition
  }

  return flattenPaths(existing, patch);
}

export function buildConfigPatch(answers: OnboardingAnswers): Record<string, unknown> {
  return {
    agents: {
      defaults: {
        workspace: "~/godmode",
        userTimezone: answers.timezone,
        memorySearch: {
          sources: ["memory", "sessions"],
          experimental: { sessionMemory: true },
          query: {
            hybrid: {
              enabled: true,
              vectorWeight: 0.7,
              textWeight: 0.3,
              candidateMultiplier: 4,
              mmr: { enabled: true, lambda: 0.7 },
              temporalDecay: { enabled: true, halfLifeDays: 30 },
            },
          },
          cache: { enabled: true, maxEntries: 50000 },
        },
        compaction: {
          mode: "safeguard",
          memoryFlush: { enabled: true, softThresholdTokens: 20000 },
        },
        contextPruning: {
          mode: "cache-ttl",
          ttl: "5m",
          keepLastAssistants: 3,
          softTrimRatio: 0.3,
          hardClearRatio: 0.5,
          minPrunableToolChars: 4000,
          softTrim: { maxChars: 4000, headChars: 1500, tailChars: 1500 },
          hardClear: { enabled: true, placeholder: "[tool result expired]" },
          tools: {
            allow: ["exec", "shell", "bash", "read", "grep", "glob",
                    "find", "cat", "ls", "search", "web_search", "browser"],
            deny: ["*image*"],
          },
        },
        thinkingDefault: "low",
        models: (() => {
          const cfg = resolveProviderConfig();
          if (cfg.provider === "venice") {
            return {
              [`venice/${cfg.models.primary}`]: {
                alias: "primary",
                params: { cacheRetention: "long" },
              },
              [`venice/${cfg.models.standard}`]: {
                alias: "standard",
                params: { cacheRetention: "long" },
              },
            };
          }
          return {
            [MODEL_ADAPTER_DEFAULT]: {
              alias: "sonnet",
              params: { cacheRetention: "long" },
            },
            "anthropic/claude-opus-4-6": {
              alias: "opus",
              params: { cacheRetention: "long" },
            },
          };
        })(),
      },
    },
    memory: {
      backend: "qmd",
      citations: "auto",
      qmd: {
        includeDefaultMemory: true,
        update: { interval: "5m", debounceMs: 15000 },
        limits: { maxResults: 6, timeoutMs: 6000 },
        sessions: { enabled: true, retentionDays: 90 },
        scope: { default: "allow" },
      },
    },
  };
}

/** Deep-merge source into target. Arrays are replaced, not merged. */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (
      val !== null &&
      val !== undefined &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      );
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ── Public API ──────────────────────────────────────────────────

/**
 * Safely attempt a single file write, catching errors so one failure
 * doesn't abort the entire batch.
 */
async function safeWriteIfNew(
  filePath: string,
  content: string,
  force: boolean,
): Promise<OnboardingFileResult> {
  try {
    return await writeIfNew(filePath, content, force);
  } catch (err) {
    return {
      path: filePath,
      created: false,
      skipped: true,
      reason: `write error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Generate all workspace files for a new GodMode user.
 * Idempotent: existing files are skipped unless force=true.
 *
 * Answers are sanitized internally -- callers may pass partial/unvalidated
 * input and reasonable defaults will be applied.
 *
 * Individual file write failures are captured in the result array rather
 * than throwing, so callers always get a complete picture.
 */
export async function generateWorkspaceFiles(
  rawAnswers: OnboardingAnswers,
  workspacePath: string,
  opts?: { force?: boolean; skipFiles?: string[]; mergeMode?: "skip" | "overwrite" | "merge" },
): Promise<OnboardingFileResult[]> {
  const answers = sanitizeAnswers(rawAnswers);
  const force = opts?.force ?? false;
  const mergeMode = opts?.mergeMode ?? (force ? "overwrite" : "skip");
  const skipFiles = new Set(opts?.skipFiles ?? []);
  const results: OnboardingFileResult[] = [];

  /** Write a file unless its relative path is in skipFiles. */
  async function maybeWrite(relPath: string, content: string): Promise<void> {
    if (skipFiles.has(relPath)) {
      results.push({ path: join(workspacePath, relPath), created: false, skipped: true, reason: "user skipped" });
      return;
    }

    // Merge mode: parse existing file, append missing sections
    if (mergeMode === "merge") {
      const fullPath = join(workspacePath, relPath);
      try {
        const existing = await readFile(fullPath, "utf-8");
        // Parse both into sections by ## headings
        const parseHeadings = (text: string): Set<string> => {
          return new Set(
            [...text.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim().toLowerCase()),
          );
        };
        const existingHeadings = parseHeadings(existing);

        // Extract new sections that are missing from existing file
        const sectionRegex = /^(##\s+[^\n]+)\n([\s\S]*?)(?=\n##\s|\n---\s*$|$)/gm;
        const missingSections: string[] = [];
        let match: RegExpExecArray | null;
        while ((match = sectionRegex.exec(content)) !== null) {
          const headingText = match[1].replace(/^##\s+/, "").trim().toLowerCase();
          if (!existingHeadings.has(headingText)) {
            missingSections.push(`${match[1]}\n${match[2].trim()}`);
          }
        }

        if (missingSections.length === 0) {
          results.push({ path: fullPath, created: false, skipped: true, reason: "all sections already present" });
          return;
        }

        // Append missing sections
        const appendBlock = "\n\n---\n\n" + missingSections.join("\n\n---\n\n");
        const merged = existing.trimEnd() + appendBlock + "\n";
        await mkdir(dirname(fullPath), { recursive: true });
        await writeFile(fullPath, merged, "utf-8");
        results.push({ path: fullPath, created: true, skipped: false, reason: `merged ${missingSections.length} new section(s)` });
        return;
      } catch {
        // File doesn't exist or read error — fall through to normal write
      }
    }

    results.push(await safeWriteIfNew(join(workspacePath, relPath), content, force));
  }

  const allyName = getAllyName();

  // 1. AGENTS.md
  await maybeWrite("AGENTS.md", generateAgentsMd(answers, allyName));

  // 2. USER.md
  await maybeWrite("USER.md", generateUserMd(answers));

  // 3. SOUL.md
  await maybeWrite("SOUL.md", generateSoulMd(answers));

  // 4. HEARTBEAT.md
  await maybeWrite("HEARTBEAT.md", generateHeartbeatMd(answers, allyName));

  // 5. memory/WORKING.md — DEPRECATED: replaced by awareness-snapshot (auto-generated)

  // 6. memory/MISTAKES.md
  await maybeWrite("memory/MISTAKES.md", generateMistakesMd());

  // 7. memory/tacit.md
  await maybeWrite("memory/tacit.md", generateTacitMd(answers));

  // 8. memory/curated.md
  await maybeWrite("memory/curated.md", generateCuratedMd(answers));

  // 9. Person stubs
  for (const person of answers.keyPeople) {
    const slug = slugify(person);
    if (!slug) continue;
    await maybeWrite(`memory/bank/people/${slug}.md`, generatePersonMd(person));
  }

  // 10. Project stubs
  for (const project of answers.projects) {
    const slug = slugify(project);
    if (!slug) continue;
    await maybeWrite(`memory/bank/projects/${slug}.md`, generateProjectMd(project, answers.name));
  }

  // 11. Today's daily note
  await maybeWrite(`memory/daily/${today()}.md`, generateDailyNoteMd(answers, allyName));

  // 12. Desired workflows → data/workflows.json (if soul profile has them)
  if (answers.soulProfile?.desiredWorkflows && answers.soulProfile.desiredWorkflows.length > 0) {
    const relPath = "data/workflows.json";
    if (!skipFiles.has(relPath)) {
      const workflowData = {
        createdAt: new Date().toISOString(),
        source: "onboarding",
        workflows: answers.soulProfile.desiredWorkflows.map((w, i) => ({
          id: `onboard-${i + 1}`,
          description: w,
          status: "pending",
          createdAt: new Date().toISOString(),
        })),
      };
      results.push(await safeWriteIfNew(join(workspacePath, relPath), JSON.stringify(workflowData, null, 2) + "\n", force));
    } else {
      results.push({ path: join(workspacePath, relPath), created: false, skipped: true, reason: "user skipped" });
    }
  }

  // 13. Merge confirmBeforeActions into hardRules for AGENTS.md (non-destructive)
  // The AGENTS.md was already generated with existing hardRules. If confirmBeforeActions
  // were provided but NOT in hardRules, we add them as confirmation rules.
  // This happens via the soul profile → SOUL.md Safety Gates section, so no
  // AGENTS.md re-generation needed here.

  return results;
}

/**
 * Patch ~/.openclaw/openclaw.json with optimal memory/agent defaults.
 * Merges non-destructively (existing keys are preserved, new keys added).
 *
 * @param answers - Onboarding answers (sanitized internally).
 * @param configPath - Override config path (default: ~/.openclaw/openclaw.json). Useful for testing.
 * @param opts.skipKeys - Dot-notation paths to exclude from the merge (e.g. ["memory.backend"]).
 */
export async function patchOCConfig(
  answers: OnboardingAnswers,
  configPath?: string,
  opts?: { skipKeys?: string[] },
): Promise<{ patched: boolean; error?: string }> {
  const clean = sanitizeAnswers(answers);
  let patch = buildConfigPatch(clean);
  const targetPath = configPath ?? OC_CONFIG_PATH;
  const skipKeys = opts?.skipKeys ?? [];

  // Remove skipped keys from the patch before merging
  if (skipKeys.length > 0) {
    patch = removePaths(patch, skipKeys);
  }

  try {
    let existing: Record<string, unknown> = {};
    try {
      const raw = await readFile(targetPath, "utf-8");
      existing = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // Config doesn't exist yet -- start fresh
    }

    const merged = deepMerge(existing, patch);

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");

    return { patched: true };
  } catch (err) {
    return {
      patched: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Remove dot-notation paths from a nested object.
 * Returns a shallow clone with the specified paths deleted.
 */
function removePaths(
  obj: Record<string, unknown>,
  paths: string[],
): Record<string, unknown> {
  const result = structuredClone(obj);
  for (const dotPath of paths) {
    const parts = dotPath.split(".");
    let cur: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = cur[parts[i]];
      if (next === null || next === undefined || typeof next !== "object" || Array.isArray(next)) break;
      cur = next as Record<string, unknown>;
    }
    delete cur[parts[parts.length - 1]];
  }
  return result;
}

/**
 * Check which workspace files exist/are missing.
 * Returns a status object indicating readiness.
 *
 * Critical files are those needed for the agent's session-start protocol.
 * Non-critical files (USER.md, SOUL.md, HEARTBEAT.md, daily notes) are
 * tracked but their absence does not block readiness.
 */
export async function checkOnboardingStatus(
  workspacePath: string,
): Promise<OnboardingStatusResult> {
  const wsExists = await dirExists(workspacePath);

  const criticalFiles = [
    "AGENTS.md",
    "memory/MISTAKES.md",
    "memory/curated.md",
    "memory/tacit.md",
  ];

  const allFiles = [
    "AGENTS.md",
    "USER.md",
    "SOUL.md",
    "HEARTBEAT.md",
    "memory/MISTAKES.md",
    "memory/tacit.md",
    "memory/curated.md",
  ];

  // Also check that key directories exist
  const keyDirs = [
    "memory/daily",
    "memory/bank/people",
    "memory/bank/projects",
  ];

  const fileStatus: Record<string, boolean> = {};
  const missingCritical: string[] = [];

  for (const file of allFiles) {
    const exists = await fileExists(join(workspacePath, file));
    fileStatus[file] = exists;
  }

  // Track directory existence as well (prefixed with "dir:" to distinguish)
  for (const dir of keyDirs) {
    const exists = await dirExists(join(workspacePath, dir));
    fileStatus[`dir:${dir}`] = exists;
  }

  // Check today's daily note
  const todayNote = `memory/daily/${today()}.md`;
  fileStatus[todayNote] = await fileExists(join(workspacePath, todayNote));

  for (const file of criticalFiles) {
    if (!fileStatus[file]) {
      missingCritical.push(file);
    }
  }

  // Check for outdated files — existing files missing key universal sections
  const outdated: string[] = [];
  const REQUIRED_SOUL_SECTIONS = ["How You Listen", "Reading the Room", "Boundaries"];
  const REQUIRED_AGENTS_SECTIONS = ["Prime Directive", "File Index"];

  if (fileStatus["SOUL.md"]) {
    try {
      const soulContent = await readFile(join(workspacePath, "SOUL.md"), "utf-8");
      const soulHeadings = new Set(
        [...soulContent.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim()),
      );
      const missingSoul = REQUIRED_SOUL_SECTIONS.filter(s => !soulHeadings.has(s));
      if (missingSoul.length > 0) outdated.push("SOUL.md");
    } catch { /* non-fatal */ }
  }

  if (fileStatus["AGENTS.md"]) {
    try {
      const agentsContent = await readFile(join(workspacePath, "AGENTS.md"), "utf-8");
      const agentsHeadings = new Set(
        [...agentsContent.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim()),
      );
      const missingAgents = REQUIRED_AGENTS_SECTIONS.filter(s => !agentsHeadings.has(s));
      if (missingAgents.length > 0) outdated.push("AGENTS.md");
    } catch { /* non-fatal */ }
  }

  return {
    workspaceExists: wsExists,
    files: fileStatus,
    missingCritical,
    outdated: outdated.length > 0 ? outdated : undefined,
    ready: wsExists && missingCritical.length === 0,
  };
}

/**
 * Preview what would be generated (without writing anything).
 * Answers are sanitized, so the preview reflects exactly what
 * `generateWorkspaceFiles` would produce.
 */
export async function previewOnboarding(
  rawAnswers: OnboardingAnswers,
  workspacePath: string,
): Promise<OnboardingPreviewResult> {
  const answers = sanitizeAnswers(rawAnswers);
  const files: OnboardingPreviewResult["files"] = [];

  const basePaths = [
    "AGENTS.md",
    "USER.md",
    "SOUL.md",
    "HEARTBEAT.md",
    "memory/MISTAKES.md",
    "memory/tacit.md",
    "memory/curated.md",
  ];

  for (const person of answers.keyPeople) {
    const slug = slugify(person);
    if (slug) basePaths.push(`memory/bank/people/${slug}.md`);
  }

  for (const project of answers.projects) {
    const slug = slugify(project);
    if (slug) basePaths.push(`memory/bank/projects/${slug}.md`);
  }

  basePaths.push(`memory/daily/${today()}.md`);

  for (const relPath of basePaths) {
    const fullPath = join(workspacePath, relPath);
    const exists = await fileExists(fullPath);
    files.push({
      path: relPath,
      exists,
      wouldCreate: !exists,
    });
  }

  return {
    files,
    configChanges: buildConfigPatch(answers),
  };
}
