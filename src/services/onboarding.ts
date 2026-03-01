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

// ── Types ────────────────────────────────────────────────────────

export interface OnboardingAnswers {
  name: string;              // Q1: user's name
  timezone: string;          // Q2: timezone (e.g. "America/Chicago")
  focus: string;             // Q3: main focus / what they're building
  projects: string[];        // Q4: top 1-3 projects/companies
  commStyle: string;         // Q5: communication preferences
  hardRules: string[];       // Q6: immutable rules for the AI
  keyPeople: string[];       // Q7: important people
  defaultModel: string;      // Q8: preferred model
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
const MAX_KEY_PEOPLE = 20;

/** Maximum number of hard rules to include in AGENTS.md. */
const MAX_HARD_RULES = 15;

/** Maximum character length for free-text answer fields. */
const MAX_FIELD_LEN = 500;

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

  return { name, timezone, focus, projects, commStyle, hardRules, keyPeople, defaultModel };
}

// ── File Generators ─────────────────────────────────────────────

/** Generate a starter AGENTS.md (kept under ~150 lines). */
function generateAgentsMd(answers: OnboardingAnswers): string {
  const allRules = [
    ...answers.hardRules.slice(0, MAX_HARD_RULES),
    "Never destructive git without checkpoint first",
    "Never guess -- search memory first, ask second",
    "Never persist transient errors as durable memory",
  ];
  // Deduplicate (case-insensitive)
  const seen = new Set<string>();
  const uniqueRules = allRules.filter((r) => {
    const key = r.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const hardRulesBlock = uniqueRules
    .map((rule, i) => `${i + 1}. **${rule}**`)
    .join("\n");

  return `# AGENTS.md - Starter Template
# Expand as you go. Full reference: docs/AGENTS-FULL.md (if available)

---

## Identity

**Atlas** -- Main agent for ${answers.name}.

Core traits: Direct, resourceful, action-oriented. Earn trust through competence and verified execution. Speaks concisely. Matches energy to user state.

---

## Owner

**${answers.name}** -- Full access. Timezone: ${answers.timezone}.

---

## Prime Directive

**Prefer retrieval-led reasoning over pre-training-led reasoning.**
QMD indexes files in ~/godmode/. Search before answering.
Never use grep/exec to search notes/memory. Use \`qmd search\`, \`qmd vsearch\`, \`memory_search\`.

---

## Memory Capture Directive (Zero-Friction)

**Write first, ask never.** Any time the user shares facts, decisions, preferences,
tasks, context, brain dumps, or outcomes -- write to \`memory/daily/YYYY-MM-DD.md\`
IMMEDIATELY under \`## Captured\`. No special format. No confirmation. Just capture.

**High-signal facts** also write to:
- Person facts -> \`memory/bank/people/{name}.md\`
- Company facts -> \`memory/bank/companies/{name}.md\`
- User preferences -> \`memory/bank/opinions.md\`
- Durable reference -> \`memory/curated.md\`

**Breadcrumb format** (append to daily note for significant actions):
\`HH:MM - [action] - [outcome]\`

---

## File Index

| Need | Location |
|------|----------|
| Current task state | \`memory/WORKING.md\` |
| Errors-turned-rules | \`memory/MISTAKES.md\` |
| User patterns | \`memory/tacit.md\` |
| Long-term memory | \`memory/curated.md\` |
| Daily context | \`memory/daily/YYYY-MM-DD.md\` |
| People | \`memory/bank/people/\` |
| Companies | \`memory/bank/companies/\` |
| Projects | \`memory/bank/projects/\` |

---

## Immutable Rules

${hardRulesBlock}

---

## Session Startup Protocol

**On every session start, read in order:**

1. \`memory/WORKING.md\` -- What am I currently working on?
2. \`memory/MISTAKES.md\` -- What errors must I never repeat?
3. \`memory/daily/YYYY-MM-DD.md\` (today + yesterday) -- What happened recently?
4. \`memory/tacit.md\` -- How does ${answers.name} operate?
5. \`memory/curated.md\` -- Long-term identity facts

**Before ending a session:**
1. Update WORKING.md with current state, next steps, open questions
2. Mark completed tasks \`[DONE]\`, clear resolved questions
3. If mistakes were made, add one-liner to \`memory/MISTAKES.md\`
`;
}

function generateUserMd(answers: OnboardingAnswers): string {
  return `# USER.md -- Owner Profile

## ${answers.name}

**Timezone:** ${answers.timezone}
**Focus:** ${answers.focus}
**Communication style:** ${answers.commStyle}

---

## Key Projects

${answers.projects.map((p) => `- ${p}`).join("\n")}

## Key People

${answers.keyPeople.map((p) => `- ${p}`).join("\n")}

## Preferred Model

${answers.defaultModel || "Default (Sonnet)"}
`;
}

function generateSoulMd(answers: OnboardingAnswers): string {
  return `# SOUL.md -- Agent Mission & Values

## Mission

Help ${answers.name} ${answers.focus.toLowerCase().startsWith("build") ? answers.focus.toLowerCase() : "with: " + answers.focus}.

## Values

1. **Action over deliberation** -- Do the work, don't just discuss it
2. **Memory is sacred** -- Capture everything, forget nothing important
3. **Earn trust daily** -- Every interaction is a chance to prove reliability
4. **Respect the owner's time** -- Don't ask what you can look up yourself
5. **Write-first** -- A rough note now is better than a perfect note never

## Personality

Direct, resourceful, opinionated when asked. Challenges weak thinking.
Matches energy to user state -- high-energy for brainstorming,
focused for deep work, brief for quick questions.
`;
}

function generateHeartbeatMd(answers: OnboardingAnswers): string {
  return `# HEARTBEAT.md -- System Pulse

## Active Agent: Atlas
## Owner: ${answers.name}
## Timezone: ${answers.timezone}

---

## Morning Routine

1. Read WORKING.md for context
2. Check today's daily note
3. Review priorities
4. Surface any overnight captures or scheduled items

## Evening Routine

1. Review what was accomplished today
2. Update WORKING.md with end-of-day state
3. Capture any loose threads to daily note
4. Flag anything that needs attention tomorrow

## Health Checks

- Memory search functional
- Daily notes being written
- WORKING.md under 100 lines
- No stale items (> 7 days without update)
`;
}

function generateWorkingMd(): string {
  return `# WORKING.md -- Current State

*Last updated: ${nowTimestamp()}*

---

## Active Right Now
<!-- ONE task. What is Atlas doing this instant? -->

## Today's Priorities
<!-- Ordered list. Max 5 items. -->
- [ ] Set up and customize memory system
- [ ] Explore GodMode features

## Decisions Pending
<!-- Waiting on owner/external. Include who and what. -->

## Open Questions
<!-- Unresolved questions that affect active work -->

## Context (Expires End of Week)
<!-- Temporary context that matters now but won't matter in 7 days -->

---

<!-- RULES:
  1. Only ONE section can have items marked "active" at a time
  2. Completed items get [DONE] then REMOVED on next cleanup
  3. Max 100 lines. If longer, prune immediately.
  4. "Last updated" timestamp MUST be refreshed on every edit
-->
`;
}

function generateMistakesMd(): string {
  return `# MISTAKES.md -- Errors Turned Into Rules

*Rules learned from past mistakes. Read on every session start.*

---

<!-- Add one-liner rules here when mistakes happen. Format:
  - YYYY-MM-DD: [what went wrong] -> [rule to follow]
-->
`;
}

function generateTacitMd(answers: OnboardingAnswers): string {
  return `# tacit.md -- Communication Preferences & Patterns

## Communication Style

${answers.commStyle}

## Working Patterns

- Timezone: ${answers.timezone}
- Focus area: ${answers.focus}

## Preferences

<!-- Add observed preferences here over time -->
<!-- Format: - [preference]: [context/example] -->

## Anti-Patterns

<!-- Things to avoid based on observed reactions -->
`;
}

function generateCuratedMd(answers: OnboardingAnswers): string {
  const projectLines = answers.projects.map((p) => `- Project: ${p}`).join("\n");
  const peopleLines = answers.keyPeople.map((p) => `- Key person: ${p}`).join("\n");

  return `# curated.md -- Long-Term Identity Facts

*Durable facts about the owner. Updated as new facts emerge.*

---

## Owner

- Name: ${answers.name}
- Timezone: ${answers.timezone}
- Focus: ${answers.focus}
- Preferred model: ${answers.defaultModel || "Default"}

## Projects

${projectLines}

## People

${peopleLines}

## Preferences

- Communication: ${answers.commStyle}

## Durable Facts

<!-- Add long-lived facts here as they are learned -->
`;
}

function generatePersonMd(personName: string): string {
  return `# ${personName}

## Relationship
<!-- How does the owner know this person? -->

## Key Facts
<!-- Important things to remember about ${personName} -->

## Communication Notes
<!-- How to interact with/about this person -->

## History
<!-- Notable interactions or events -->
`;
}

function generateProjectMd(projectName: string, ownerName: string): string {
  return `# ${projectName}

## Overview
<!-- What is ${projectName}? -->

## ${ownerName}'s Role
<!-- What does ${ownerName} do in this project? -->

## Key Links
<!-- URLs, repos, docs -->

## Current Status
<!-- Active / paused / completed -->

## Notes
<!-- Ongoing notes about this project -->
`;
}

function generateDailyNoteMd(answers: OnboardingAnswers): string {
  return `# ${today()} -- Daily Note

## Morning Context
- GodMode memory system initialized
- Workspace set up for ${answers.name}

## Priorities
- [ ] Explore the memory system
- [ ] Start a conversation with Atlas

## Captured
<!-- Auto-captured facts, decisions, and context go here -->
- ${nowTimestamp()} -- GodMode onboarding completed. Memory system ready.

## Breadcrumbs
<!-- HH:MM - [action] - [outcome] -->
`;
}

// ── OC Config Patch ─────────────────────────────────────────────

function buildConfigPatch(answers: OnboardingAnswers): Record<string, unknown> {
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
        thinkingDefault: "low",
        models: {
          "anthropic/claude-sonnet-4-6": {
            alias: "sonnet",
            params: { cacheRetention: "long" },
          },
          "anthropic/claude-opus-4-6": {
            alias: "opus",
            params: { cacheRetention: "long" },
          },
        },
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
  opts?: { force?: boolean },
): Promise<OnboardingFileResult[]> {
  const answers = sanitizeAnswers(rawAnswers);
  const force = opts?.force ?? false;
  const results: OnboardingFileResult[] = [];

  // 1. AGENTS.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "AGENTS.md"),
      generateAgentsMd(answers),
      force,
    ),
  );

  // 2. USER.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "USER.md"),
      generateUserMd(answers),
      force,
    ),
  );

  // 3. SOUL.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "SOUL.md"),
      generateSoulMd(answers),
      force,
    ),
  );

  // 4. HEARTBEAT.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "HEARTBEAT.md"),
      generateHeartbeatMd(answers),
      force,
    ),
  );

  // 5. memory/WORKING.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "memory", "WORKING.md"),
      generateWorkingMd(),
      force,
    ),
  );

  // 6. memory/MISTAKES.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "memory", "MISTAKES.md"),
      generateMistakesMd(),
      force,
    ),
  );

  // 7. memory/tacit.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "memory", "tacit.md"),
      generateTacitMd(answers),
      force,
    ),
  );

  // 8. memory/curated.md
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "memory", "curated.md"),
      generateCuratedMd(answers),
      force,
    ),
  );

  // 9. Person stubs
  for (const person of answers.keyPeople) {
    const slug = slugify(person);
    if (!slug) continue;
    results.push(
      await safeWriteIfNew(
        join(workspacePath, "memory", "bank", "people", `${slug}.md`),
        generatePersonMd(person),
        force,
      ),
    );
  }

  // 10. Project stubs
  for (const project of answers.projects) {
    const slug = slugify(project);
    if (!slug) continue;
    results.push(
      await safeWriteIfNew(
        join(workspacePath, "memory", "bank", "projects", `${slug}.md`),
        generateProjectMd(project, answers.name),
        force,
      ),
    );
  }

  // 11. Today's daily note
  results.push(
    await safeWriteIfNew(
      join(workspacePath, "memory", "daily", `${today()}.md`),
      generateDailyNoteMd(answers),
      force,
    ),
  );

  return results;
}

/**
 * Patch ~/.openclaw/openclaw.json with optimal memory/agent defaults.
 * Merges non-destructively (existing keys are preserved, new keys added).
 *
 * @param answers - Onboarding answers (sanitized internally).
 * @param configPath - Override config path (default: ~/.openclaw/openclaw.json). Useful for testing.
 */
export async function patchOCConfig(
  answers: OnboardingAnswers,
  configPath?: string,
): Promise<{ patched: boolean; error?: string }> {
  const clean = sanitizeAnswers(answers);
  const patch = buildConfigPatch(clean);
  const targetPath = configPath ?? OC_CONFIG_PATH;

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
    "memory/WORKING.md",
    "memory/MISTAKES.md",
    "memory/curated.md",
    "memory/tacit.md",
  ];

  const allFiles = [
    "AGENTS.md",
    "USER.md",
    "SOUL.md",
    "HEARTBEAT.md",
    "memory/WORKING.md",
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

  return {
    workspaceExists: wsExists,
    files: fileStatus,
    missingCritical,
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
    "memory/WORKING.md",
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
