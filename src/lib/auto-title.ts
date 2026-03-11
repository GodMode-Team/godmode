/**
 * auto-title.ts — LLM-powered session auto-titling.
 *
 * Uses Haiku to generate a short topic label from the first user
 * message + assistant response. Falls back to string derivation.
 */

// ── State ─────────────────────────────────────────────────────────────
/** First user message per session, captured in message_received for auto-titling */
export const pendingAutoTitles = new Map<string, string>();
/** Sessions that already have titles — skip future auto-title attempts */
export const titledSessions = new Set<string>();
const TITLED_SESSIONS_MAX = 5_000;

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
  assistantResponse: string,
): Promise<string | null> {
  try {
    const { resolveAnthropicAuth } = await import("../methods/brief-generator.js");
    const apiKey = resolveAnthropicAuth();
    if (!apiKey) return null;

    // Strip system content from user message before sending to title generator
    const cleanMessage = userMessage
      .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
      .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Truncate inputs to keep the call tiny
    const userSnippet = cleanMessage.slice(0, 300);
    const assistantSnippet = assistantResponse.slice(0, 300);

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 20,
        system: [
          "You are a conversation title generator. Given a user question and an AI response, output a short TOPIC LABEL for what this conversation is about.",
          "Rules:",
          "- 2-5 words max",
          "- Describe the TOPIC, not the answer (e.g. 'Memory System Health' not 'Pretty solid overall')",
          "- No quotes, no punctuation, no prefixes",
          "- Title case",
          "- Output ONLY the label, nothing else",
          "",
          "Examples:",
          "User: 'hows our memory working?' → Memory System Status",
          "User: 'can you research community platforms for TRP?' → TRP Community Platforms",
          "User: 'what tips could I give Scott about his ads?' → Scott Ad Strategy Tips",
          "User: 'read HEARTBEAT.md if it exists' → Heartbeat Config Review",
        ].join("\n"),
        messages: [{
          role: "user",
          content: `User message: ${userSnippet}\n\nAssistant response (first 300 chars): ${assistantSnippet}`,
        }],
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!resp.ok) return null;

    const data = (await resp.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const raw = data.content?.find((c) => c.type === "text")?.text?.trim();
    if (!raw || raw.length < 3 || raw.length > 60) return null;

    // Strip any quotes or "Title:" prefix the model might add despite instructions
    const title = raw
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^title:\s*/i, "")
      .replace(/[.!?]+$/, "")
      .trim();

    // Reject if it looks like it echoed the assistant response
    if (assistantResponse.toLowerCase().startsWith(title.toLowerCase())) return null;

    return title || null;
  } catch {
    return null;
  }
}
