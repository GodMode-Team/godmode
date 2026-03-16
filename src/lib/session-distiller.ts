/**
 * session-distiller.ts — Auto-extract reusable patterns from idle sessions.
 *
 * Absorbs the "session → skill distillation" pattern from MetaClaw:
 * when a session goes idle (15+ min no messages), the distiller analyzes
 * the transcript and extracts:
 *   1. Skill drafts — reusable patterns that worked well
 *   2. Preference signals — user corrections → agent lessons
 *   3. Routing feedback — persona/tool routing quality
 *   4. Entity updates — people, companies, projects mentioned
 *
 * Runs as Pipeline 3 in vault-capture, called by the consciousness heartbeat.
 * Uses Claude Haiku for cheap, fast extraction (~$0.01/session).
 *
 * Pattern Absorption (P10): This module exists because GodMode absorbs
 * patterns from new tools, not the tools themselves.
 */

import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";
import { resolveAnthropicKey, fetchWithTimeout } from "./anthropic-auth.js";
import { health } from "./health-ledger.js";
import { getOwnerName } from "./ally-identity.js";

// ── Types ──────────────────────────────────────────────────────────────

interface SkillDraft {
  name: string;
  domain: string;
  triggers: string[];
  description: string;
  steps: string[];
}

interface PreferenceSignal {
  rule: string;
  category: string;
  context: string;
}

interface DistillerExtraction {
  skillDrafts: SkillDraft[];
  preferences: PreferenceSignal[];
  entities: Array<{ name: string; kind: string; relationships?: Array<{ rel: string; target: string }> }>;
}

interface DistillerState {
  distilledSessions: Record<string, { distilledAt: string; draftsCreated: number }>;
}

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

type ApiRequestFn = (method: string, params: Record<string, unknown>) => Promise<unknown>;

// ── Constants ──────────────────────────────────────────────────────────

const STATE_FILE = join(DATA_DIR, "distiller-state.json");
const SKILL_DRAFTS_DIR = join(MEMORY_DIR, "skill-drafts");
const IDLE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SESSIONS_PER_TICK = 3; // Limit API calls per heartbeat
const MIN_MESSAGES = 4; // Skip tiny sessions
const MAX_TRANSCRIPT_CHARS = 4000; // Keep Haiku costs low
const MAX_STATE_ENTRIES = 500;

// ── State I/O ──────────────────────────────────────────────────────────

async function loadState(): Promise<DistillerState> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw) as DistillerState;
  } catch {
    return { distilledSessions: {} };
  }
}

async function saveState(state: DistillerState): Promise<void> {
  // Prune to last N entries
  const entries = Object.entries(state.distilledSessions);
  if (entries.length > MAX_STATE_ENTRIES) {
    const sorted = entries.sort(
      (a, b) => new Date(a[1].distilledAt).getTime() - new Date(b[1].distilledAt).getTime(),
    );
    state.distilledSessions = Object.fromEntries(sorted.slice(-MAX_STATE_ENTRIES));
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── LLM Extraction ────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `Analyze this conversation between a user and their AI ally. Extract reusable patterns.

Return ONLY valid JSON with this schema:
{
  "skillDrafts": [{ "name": "short-slug", "domain": "general|calendar|tasks|queue|second-brain|people|files|integrations", "triggers": ["keyword1", "keyword2"], "description": "What this pattern does", "steps": ["Step 1", "Step 2"] }],
  "preferences": [{ "rule": "Actionable rule, e.g. 'Always use bullet points'", "category": "tone|format|accuracy|scope|style|process|routing|other", "context": "What triggered this correction" }],
  "entities": [{ "name": "Full Name", "kind": "person|company|project|place|concept", "relationships": [{ "rel": "works_at|knows|manages|client_of|involved_in", "target": "Entity Name" }] }]
}

Rules:
- Skill drafts: Only extract patterns the user would want to REPEAT. Not one-off tasks.
- Preferences: Only extract explicit corrections or style preferences the user stated.
- Entities: Only clearly named entities with proper names. The user is "${getOwnerName()}".
- If a category has nothing worth extracting, return an empty array.
- Max 3 skill drafts, 5 preferences, 10 entities per session.

Conversation:
`;

async function extractFromTranscript(transcript: string): Promise<DistillerExtraction | null> {
  const apiKey = resolveAnthropicKey();
  if (!apiKey) return null;

  const truncated = transcript.slice(0, MAX_TRANSCRIPT_CHARS);

  try {
    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        { role: "user", content: EXTRACTION_PROMPT + truncated },
      ],
    });

    const response = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body,
      },
      15_000,
    );

    if (!response.ok) return null;
    const json = await response.json() as any;
    const content = json?.content?.[0]?.text;
    if (!content) return null;

    // Parse JSON — handle markdown code fences
    const cleaned = content.replace(/```json?\s*|\s*```/g, "").trim();
    return JSON.parse(cleaned) as DistillerExtraction;
  } catch {
    return null;
  }
}

// ── Skill Draft Writer ─────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function writeSkillDraft(draft: SkillDraft): Promise<boolean> {
  const slug = slugify(draft.name);
  if (!slug) return false;

  await mkdir(SKILL_DRAFTS_DIR, { recursive: true });

  const filePath = join(SKILL_DRAFTS_DIR, `${slug}.md`);

  // Idempotent — skip if already exists
  if (existsSync(filePath)) return false;

  const triggers = draft.triggers.join(", ");
  const steps = draft.steps.map((s) => `- ${s}`).join("\n");

  const content = [
    "---",
    `name: ${draft.name}`,
    `domain: ${draft.domain}`,
    `triggers: ${triggers}`,
    `status: draft`,
    `extractedAt: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${draft.name}`,
    "",
    draft.description,
    "",
    "## Steps",
    "",
    steps,
    "",
  ].join("\n");

  await writeFile(filePath, content, "utf-8");
  return true;
}

// ── Transcript Builder ─────────────────────────────────────────────────

function buildTranscript(
  messages: Array<{ role: string; content: string | unknown }>,
): string {
  const lines: string[] = [];
  for (const msg of messages) {
    const text = typeof msg.content === "string"
      ? msg.content
      : JSON.stringify(msg.content);

    // Strip system context tags
    const clean = text
      .replace(/<system-context[\s\S]*?<\/system-context>/g, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
      .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "")
      .trim();

    if (!clean) continue;

    const role = msg.role === "user" ? "User" : "Ally";
    lines.push(`${role}: ${clean}`);
  }
  return lines.join("\n\n");
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Distill idle sessions — called by vault-capture Pipeline 3.
 *
 * 1. Gets idle session keys from health-ledger
 * 2. Filters out already-distilled and cron sessions
 * 3. Fetches transcripts via chat.history RPC
 * 4. Sends to Haiku for structured extraction
 * 5. Writes skill drafts, feeds preferences into agent lessons
 * 6. Marks sessions as distilled in state
 */
export async function distillIdleSessions(
  logger: Logger,
  apiRequest: ApiRequestFn,
): Promise<{ distilled: number; draftsCreated: number; errors: string[] }> {
  const result = { distilled: 0, draftsCreated: 0, errors: [] as string[] };

  try {
    // Get idle sessions from health ledger
    const { sessions } = await import("./health-ledger.js");
    const idleKeys = sessions.idleKeys(IDLE_THRESHOLD_MS);
    if (idleKeys.length === 0) return result;

    // Load state to skip already-distilled sessions
    const state = await loadState();

    // Filter: not already distilled, not cron sessions
    const { isCronSessionKey } = await import("./workspace-session-store.js");
    const candidates = idleKeys.filter((key) => {
      if (state.distilledSessions[key]) return false;
      if (isCronSessionKey(key)) return false;
      // Skip support sessions
      if (key.includes("support")) return false;
      return true;
    });

    if (candidates.length === 0) return result;

    // Process up to MAX_SESSIONS_PER_TICK
    for (const sessionKey of candidates.slice(0, MAX_SESSIONS_PER_TICK)) {
      try {
        // Fetch transcript via chat.history
        const histRes = await apiRequest("chat.history", {
          sessionKey,
          limit: 50,
        }) as { messages?: Array<{ role: string; content: string }> } | null;

        const messages = histRes?.messages ?? [];
        if (messages.length < MIN_MESSAGES) {
          // Too short — mark as distilled to avoid re-checking
          state.distilledSessions[sessionKey] = {
            distilledAt: new Date().toISOString(),
            draftsCreated: 0,
          };
          continue;
        }

        // Build transcript
        const transcript = buildTranscript(messages);
        if (transcript.length < 100) continue;

        // Extract via Haiku
        const extraction = await extractFromTranscript(transcript);
        if (!extraction) {
          health.signal("distiller.extract", false, { sessionKey, error: "extraction-failed" });
          continue;
        }

        health.signal("distiller.extract", true, { sessionKey });

        let drafts = 0;

        // Write skill drafts
        if (extraction.skillDrafts && Array.isArray(extraction.skillDrafts)) {
          for (const draft of extraction.skillDrafts.slice(0, 3)) {
            if (draft.name && draft.description) {
              const written = await writeSkillDraft(draft);
              if (written) drafts++;
            }
          }
        }

        // Feed preferences into agent lessons
        if (extraction.preferences && Array.isArray(extraction.preferences)) {
          try {
            const { addLesson } = await import("./agent-lessons.js");
            for (const pref of extraction.preferences.slice(0, 5)) {
              if (pref.rule) {
                await addLesson({
                  rule: pref.rule,
                  category: (pref.category as any) || "other",
                  sourceTaskId: `distiller:${sessionKey}`,
                  sourceTaskTitle: pref.context || "session distillation",
                });
              }
            }
          } catch { /* agent lessons non-fatal */ }
        }

        // Feed entities into identity graph
        if (extraction.entities && Array.isArray(extraction.entities)) {
          try {
            const { isGraphReady, upsertEntity, upsertEdge } = await import("./identity-graph.js");
            if (isGraphReady()) {
              for (const entity of extraction.entities.slice(0, 10)) {
                if (entity.name && entity.kind) {
                  upsertEntity(entity.name, entity.kind);
                  if (entity.relationships) {
                    for (const rel of entity.relationships.slice(0, 5)) {
                      if (rel.rel && rel.target) {
                        upsertEdge(entity.name, rel.rel, rel.target);
                      }
                    }
                  }
                }
              }
            }
          } catch { /* identity graph non-fatal */ }
        }

        // Mark as distilled
        state.distilledSessions[sessionKey] = {
          distilledAt: new Date().toISOString(),
          draftsCreated: drafts,
        };
        result.distilled++;
        result.draftsCreated += drafts;

        if (drafts > 0) {
          logger.info(`[Distiller] Session "${sessionKey}": ${drafts} skill draft(s) created`);
        }
      } catch (err) {
        result.errors.push(`${sessionKey}: ${String(err)}`);
        health.signal("distiller.extract", false, { sessionKey, error: String(err) });
      }
    }

    await saveState(state);
  } catch (err) {
    result.errors.push(`distiller-init: ${String(err)}`);
  }

  return result;
}

/**
 * Count pending skill drafts for awareness snapshot surfacing.
 * Returns 0 if the directory doesn't exist or is empty.
 */
export function countPendingDrafts(): number {
  try {
    if (!existsSync(SKILL_DRAFTS_DIR)) return 0;
    return readdirSync(SKILL_DRAFTS_DIR).filter(
      (f) => f.endsWith(".md") && !f.startsWith("."),
    ).length;
  } catch {
    return 0;
  }
}
