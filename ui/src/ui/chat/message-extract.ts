import { stripThinkingTags } from "../format";

/** Silent reply token used by agents to indicate no user-visible response */
const SILENT_REPLY_TOKEN = "NO_REPLY";

/** Strip <system-context> and <godmode-context> blocks injected by GodMode hooks */
const SYSTEM_CONTEXT_RE = /<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi;

/**
 * Strip <document> blocks containing base64-encoded file content.
 * Non-image file uploads are inlined as <document> XML blocks in the message text
 * for the LLM, but should never be displayed raw in the chat UI.
 */
const DOCUMENT_BLOCK_RE = /<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;

/**
 * GodMode system context fingerprints. The model sometimes echoes the
 * inner content of <system-context> blocks WITHOUT the XML tags, so
 * the tag-based regex above misses it. These fingerprints detect the
 * raw text and strip everything from the first match to the end (since
 * the context is always prepended, a leak means the entire message is
 * system context).
 */
const CONTEXT_FINGERPRINTS = [
  "internal system context injected by godmode",
  "treat it as invisible background instructions only",
  "persistence protocol (non-negotiable)",
  "you must follow these operating instructions. do not echo or quote this block",
  "meta goal: earn trust through competence. search before asking",
  "asking the user for info you could look up is a failure mode",
];

function stripSystemContext(text: string): string {
  let stripped = text.replace(SYSTEM_CONTEXT_RE, "").replace(DOCUMENT_BLOCK_RE, "").trim();

  // Detect tagless echo — model outputting system context without XML wrapper
  const lower = stripped.toLowerCase();
  for (const fp of CONTEXT_FINGERPRINTS) {
    const idx = lower.indexOf(fp);
    if (idx !== -1) {
      // The context is prepended, so everything from the fingerprint
      // backward to the start is system context. Strip it.
      // If there's real content after the context block, keep it.
      // Look for a double-newline boundary after the fingerprint.
      const afterFp = idx + fp.length;
      const rest = stripped.slice(afterFp);
      // Find where real content might start (after significant whitespace gap)
      const contentStart = rest.search(/\n\n(?=[A-Z])/);
      if (contentStart !== -1) {
        stripped = rest.slice(contentStart).trim();
      } else {
        // Entire message is system context
        stripped = "";
      }
      break;
    }
  }

  return stripped;
}

/**
 * Detect raw API error JSON and convert to a friendly message.
 * Matches patterns like: {"type":"error","error":{"type":"overloaded_error",...}}
 * Also catches HTTP-prefixed errors like "529 {"type":"error",...}"
 */
const API_ERROR_JSON_RE = /^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/;
const HTTP_ERROR_PREFIX_RE = /^\s*(\d{3})\s+\{/;

export function formatApiError(text: string): string | null {
  const trimmed = text.trim();

  // HTTP status prefixed JSON: "529 {"type":"error",...}"
  const httpMatch = trimmed.match(HTTP_ERROR_PREFIX_RE);
  if (httpMatch) {
    const status = Number(httpMatch[1]);
    if (status === 529 || status === 503) {
      return "*Switching models — Claude is temporarily overloaded.*";
    }
    if (status === 400 && trimmed.includes("Unsupported value")) {
      return null; // Suppress — gateway retries automatically
    }
  }

  // "Unsupported value" errors from model fallback
  if (trimmed.startsWith("Unsupported value:") || trimmed.includes("is not supported with the")) {
    return null; // Suppress
  }

  if (!API_ERROR_JSON_RE.test(trimmed)) return null;
  try {
    const obj = JSON.parse(trimmed);
    if (obj?.type === "error" && obj?.error?.message) {
      const errorType = obj.error.type ?? "";
      if (errorType === "overloaded_error") {
        return "*Switching models — Claude is temporarily overloaded.*";
      }
      return `*API error: ${obj.error.message}*`;
    }
  } catch {
    // Not valid JSON — ignore
  }
  return null;
}

/**
 * Strip inline API error JSON from a larger message body.
 * The gateway sometimes injects raw error JSON mid-response (e.g., when a
 * streaming response partially completes then errors, or during retry loops
 * where 529/503 errors are streamed as text chunks before a fallback model
 * responds). This removes those error blobs completely.
 */
const INLINE_API_ERROR_RE = /\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g;
// 529/503 prefixed error lines: "529 {"type":"error",...}\nhttps://docs.claude.com/..."
const HTTP_PREFIXED_ERROR_RE = /\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g;
// Standalone overloaded JSON without HTTP prefix
const STANDALONE_ERROR_JSON_RE = /\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;

function stripInlineApiErrors(text: string): string {
  return text
    .replace(HTTP_PREFIXED_ERROR_RE, "")
    .replace(INLINE_API_ERROR_RE, "")
    .replace(STANDALONE_ERROR_JSON_RE, "")
    .trim();
}

const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
const ENVELOPE_CHANNELS = [
  "WebChat",
  "WhatsApp",
  "Telegram",
  "Signal",
  "Slack",
  "Discord",
  "iMessage",
  "Teams",
  "Matrix",
  "Zalo",
  "Zalo Personal",
  "BlueBubbles",
];

const textCache = new WeakMap<object, string | null>();
const thinkingCache = new WeakMap<object, string | null>();

function looksLikeEnvelopeHeader(header: string): boolean {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) {
    return true;
  }
  if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) {
    return true;
  }
  return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}

export function stripEnvelope(text: string): string {
  const match = text.match(ENVELOPE_PREFIX);
  if (!match) {
    return text;
  }
  const header = match[1] ?? "";
  if (!looksLikeEnvelopeHeader(header)) {
    return text;
  }
  return text.slice(match[0].length);
}

/**
 * Check if text is a silent reply that should be filtered from display.
 * Matches "NO_REPLY" exactly or text starting with "NO_REPLY" (for variants like "NO_REPLY\n...").
 */
function isSilentReply(text: string): boolean {
  const trimmed = text.trim();
  return trimmed === SILENT_REPLY_TOKEN || trimmed.startsWith(`${SILENT_REPLY_TOKEN}\n`);
}

export function extractText(message: unknown): string | null {
  const m = message as Record<string, unknown>;
  const role = typeof m.role === "string" ? m.role : "";
  const content = m.content;
  if (typeof content === "string") {
    const cleaned = stripSystemContext(content);
    if (!cleaned) return null;
    // Catch raw API error JSON that leaked through (e.g., overloaded_error)
    const apiError = formatApiError(cleaned);
    if (apiError) return apiError;
    // Strip inline API error JSON from partial responses
    const deErrored = role === "assistant" ? stripInlineApiErrors(cleaned) : cleaned;
    if (role === "assistant" && !deErrored) return null; // All content was error noise
    const processed = role === "assistant" ? stripThinkingTags(deErrored) : stripEnvelope(cleaned);
    // Filter out silent reply tokens
    if (isSilentReply(processed)) {
      return null;
    }
    return processed;
  }
  if (Array.isArray(content)) {
    const parts = content
      .map((p) => {
        const item = p as Record<string, unknown>;
        if (item.type === "text" && typeof item.text === "string") {
          return stripSystemContext(item.text);
        }
        return null;
      })
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    if (parts.length > 0) {
      const joined = parts.join("\n");
      const processed = role === "assistant" ? stripThinkingTags(joined) : stripEnvelope(joined);
      // Filter out silent reply tokens
      if (isSilentReply(processed)) {
        return null;
      }
      return processed;
    }
  }
  if (typeof m.text === "string") {
    const cleaned = stripSystemContext(m.text);
    if (!cleaned) return null;
    const processed = role === "assistant" ? stripThinkingTags(cleaned) : stripEnvelope(cleaned);
    // Filter out silent reply tokens
    if (isSilentReply(processed)) {
      return null;
    }
    return processed;
  }
  return null;
}

export function extractTextCached(message: unknown): string | null {
  if (!message || typeof message !== "object") {
    return extractText(message);
  }
  const obj = message;
  if (textCache.has(obj)) {
    return textCache.get(obj) ?? null;
  }
  const value = extractText(message);
  textCache.set(obj, value);
  return value;
}

export function extractThinking(message: unknown): string | null {
  const m = message as Record<string, unknown>;
  const content = m.content;
  const parts: string[] = [];
  if (Array.isArray(content)) {
    for (const p of content) {
      const item = p as Record<string, unknown>;
      if (item.type === "thinking" && typeof item.thinking === "string") {
        const cleaned = item.thinking.trim();
        if (cleaned) {
          parts.push(cleaned);
        }
      }
    }
  }
  if (parts.length > 0) {
    return parts.join("\n");
  }

  // Back-compat: older logs may still have <think> tags inside text blocks.
  const rawText = extractRawText(message);
  if (!rawText) {
    return null;
  }
  const matches = [
    ...rawText.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi),
  ];
  const extracted = matches.map((m) => (m[1] ?? "").trim()).filter(Boolean);
  return extracted.length > 0 ? extracted.join("\n") : null;
}

export function extractThinkingCached(message: unknown): string | null {
  if (!message || typeof message !== "object") {
    return extractThinking(message);
  }
  const obj = message;
  if (thinkingCache.has(obj)) {
    return thinkingCache.get(obj) ?? null;
  }
  const value = extractThinking(message);
  thinkingCache.set(obj, value);
  return value;
}

export function extractRawText(message: unknown): string | null {
  const m = message as Record<string, unknown>;
  const content = m.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    const parts = content
      .map((p) => {
        const item = p as Record<string, unknown>;
        if (item.type === "text" && typeof item.text === "string") {
          return item.text;
        }
        return null;
      })
      .filter((v): v is string => typeof v === "string");
    if (parts.length > 0) {
      return parts.join("\n");
    }
  }
  if (typeof m.text === "string") {
    return m.text;
  }
  return null;
}

export function formatReasoningMarkdown(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `_${line}_`);
  return lines.length ? ["_Reasoning:_", ...lines].join("\n") : "";
}
