/**
 * auto-title.ts — LLM-powered session auto-titling.
 *
 * Uses Haiku to generate a short topic label from the first user
 * message + assistant response. Falls back to string derivation.
 */

// ── State ─────────────────────────────────────────────────────────────
/** First user message per session + metadata for retry/expiry */
export const pendingAutoTitles = new Map<string, { message: string; attempts: number; capturedAt: number }>();
/** Sessions that already have titles — skip future auto-title attempts */
export const titledSessions = new Set<string>();
const TITLED_SESSIONS_MAX = 5_000;
/** Max llm_output fires to wait for assistant text before giving up and using string derivation */
export const MAX_TITLE_ATTEMPTS = 8;
/** Expire pending entries after 5 minutes (handles sessions that never get a response) */
import { PENDING_TITLE_TTL_MS } from "./constants.js";
import { callLLM } from "./llm-provider.js";

export const PENDING_TTL_MS = PENDING_TITLE_TTL_MS;

/**
 * Internal system terms that should never be used as session titles.
 * If the LLM generates one of these, fall back to string derivation.
 */
const TITLE_BLOCKLIST = new Set([
  "heartbeat",
  "heartbeat config",
  "heartbeat config review",
  "heartbeat status",
]);

/** Evict oldest entries when titledSessions grows too large */
export function evictTitledSessions(): void {
  if (titledSessions.size <= TITLED_SESSIONS_MAX) return;
  const excess = titledSessions.size - TITLED_SESSIONS_MAX;
  let removed = 0;
  for (const key of titledSessions) {
    if (removed >= excess) break;
    titledSessions.delete(key);
    removed++;
  }
}

/**
 * Generate a short session title using a fast LLM call.
 * Uses Haiku for speed and cost (~0.001¢ per title).
 * Returns null on any failure (caller falls back to string derivation).
 */
export async function generateSessionTitle(
  userMessage: string,
  assistantResponse?: string,
): Promise<string | null> {
  try {
    // Strip system content from user message before sending to title generator
    const cleanMessage = userMessage
      .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
      .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Strip system content from assistant response too (if provided)
    const cleanResponse = (assistantResponse ?? "")
      .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
      .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Truncate inputs to keep the call tiny
    const userSnippet = cleanMessage.slice(0, 300);
    const assistantSnippet = cleanResponse.slice(0, 300);

    const raw = (await callLLM({
      tier: "fast",
      maxTokens: 20,
      timeoutMs: 8_000,
      system: [
        "You are a conversation title generator. Given a user's first message, output a short label for what this chat is about.",
        "Rules:",
        "- 2-5 words max",
        "- Capture the SUBJECT the user is talking about, not a meta-description of the message type",
        "- Use the user's own words/nouns when possible",
        "- No quotes, no punctuation, no prefixes like 'Topic:' or 'Re:'",
        "- Title case",
        "- Output ONLY the label, nothing else",
        "",
        "Examples:",
        "User: 'hows our memory working?' → Memory System Status",
        "User: 'can you research community platforms for my project?' → Community Platform Research",
        "User: 'what tips could I give Scott about his ads?' → Scott Ad Strategy Tips",
        "User: 'build me a front intelligence dashboard' → Front Email Intelligence",
        "User: 'pink elephants running wild in the fields' → Pink Elephants",
        "User: 'write me an entrepreneur joke' → Entrepreneur Joke",
        "User: 'hey whats up' → Quick Chat",
      ].join("\n"),
      messages: [{
        role: "user",
        content: assistantSnippet
          ? `User message: ${userSnippet}\n\nAssistant response (first 300 chars): ${assistantSnippet}`
          : `User message: ${userSnippet}`,
      }],
    }))?.trim();
    if (!raw || raw.length < 3 || raw.length > 60) {
      console.warn(`[GodMode][AutoTitle] LLM returned invalid title: "${raw ?? "(empty)}"} (len=${raw?.length ?? 0})`);
      return null;
    }

    // Strip any quotes or "Title:" prefix the model might add despite instructions
    const title = raw
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^title:\s*/i, "")
      .replace(/[.!?]+$/, "")
      .trim();

    // Reject if it looks like it echoed the assistant response
    if (assistantResponse && assistantResponse.toLowerCase().startsWith(title.toLowerCase())) return null;

    // Reject internal system terms that shouldn't be session titles
    if (TITLE_BLOCKLIST.has(title.toLowerCase())) return null;

    return title || null;
  } catch (err) {
    console.warn(`[GodMode][AutoTitle] Title generation failed: ${String(err)}`);
    return null;
  }
}
