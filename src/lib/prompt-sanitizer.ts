/**
 * prompt-sanitizer.ts — Sanitizes user-provided text before interpolation into agent prompts.
 *
 * Strips prompt injection patterns (fake system tags, authority headers, override phrases)
 * while preserving legitimate content. Applied at prompt-build time, NOT at ingestion —
 * stored queue items retain their original text.
 */

import { audit } from "./audit-log.js";

// ── Injection Patterns ─────────────────────────────────────────────

/** XML-style injection tags that mimic system/admin authority */
const XML_INJECTION_TAGS = /<\/?(system|instructions|override|admin|root|emergency|prompt|context|assistant|user|tool_result)[^>]*>/gi;

/** Markdown headers that create fake authoritative sections */
const FAKE_SECTION_HEADERS = /^#{1,3}\s*(system|admin|override|instructions|root|emergency|important override|new instructions)\b/gim;

/** Classic prompt injection phrases */
const INJECTION_PHRASES: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /disregard\s+(all\s+)?(your|prior|previous|above)\s+(instructions|rules|guidelines)/gi,
  /you\s+are\s+now\s+(an?\s+)?(unrestricted|unfiltered|uncensored|jailbroken)/gi,
  /forget\s+(all\s+)?(your|prior|previous)\s+(instructions|rules|training)/gi,
  /override\s+(your|all|previous|prior)\s+(instructions|rules|safety|guidelines)/gi,
  /\[SYSTEM\]/gi,
  /<<\s*SYSTEM\s*>>/gi,
  /^SYSTEM\s*:/gim,
  /^ADMIN\s*:/gim,
  /new\s+instructions?\s*:/gi,
  /entering\s+(admin|root|god|override)\s+mode/gi,
  /do\s+not\s+follow\s+(your|any|the)\s+(previous|original|initial)\s+(instructions|rules)/gi,
];

// ── Sanitizer ──────────────────────────────────────────────────────

/**
 * Sanitize user-provided text for safe interpolation into agent prompts.
 * Strips injection patterns while preserving legitimate content.
 */
export function sanitizeForPrompt(text: string, field?: string): string {
  if (!text) return text;

  let result = text;
  let stripped = false;

  // 1. Strip XML injection tags
  const xmlCleaned = result.replace(XML_INJECTION_TAGS, "");
  if (xmlCleaned !== result) { stripped = true; result = xmlCleaned; }

  // 2. Defang fake section headers (remove # markers, keep text)
  const headerCleaned = result.replace(FAKE_SECTION_HEADERS, (match) => {
    return match.replace(/^#{1,3}\s*/, "");
  });
  if (headerCleaned !== result) { stripped = true; result = headerCleaned; }

  // 3. Strip injection phrases
  for (const pattern of INJECTION_PHRASES) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    const cleaned = result.replace(pattern, "");
    if (cleaned !== result) { stripped = true; result = cleaned; }
  }

  // 4. Collapse excessive newlines (>3 consecutive → 2)
  result = result.replace(/\n{4,}/g, "\n\n");

  // 5. Trim
  result = result.trim();

  // 6. If everything was stripped, return placeholder
  if (!result && text.trim()) {
    result = "(content removed by security filter)";
  }

  // 7. Audit if any stripping occurred
  if (stripped) {
    audit("prompt.sanitized", {
      field: field ?? "unknown",
      originalPreview: text.slice(0, 120),
      cleanedPreview: result.slice(0, 120),
    });
  }

  return result;
}
