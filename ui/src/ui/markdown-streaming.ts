/**
 * Block-level memoized markdown rendering for streaming messages.
 *
 * During streaming, the message grows monotonically. Instead of re-parsing
 * the full message through marked + DOMPurify every ~150ms delta, we:
 * 1. Split at a safe `\n\n` boundary outside code fences
 * 2. Cache the rendered HTML for the stable prefix
 * 3. Only re-parse the growing tail on each delta
 *
 * Call `resetStreamingCache()` when the stream ends or the session changes.
 */

import { toSanitizedMarkdownHtml } from "./markdown";

/** Minimum text length to benefit from block-level caching. */
const MIN_CACHE_LENGTH = 500;

// Single-entry cache (only one message streams at a time).
let cachedPrefixText = "";
let cachedPrefixHtml = "";

/**
 * Render markdown with block-level memoization for streaming.
 * For short text (<500 chars) or text without safe split points,
 * falls through to `toSanitizedMarkdownHtml()`.
 */
export function toStreamingMarkdownHtml(markdown: string): string {
  const input = markdown.trim();
  if (!input) {
    return "";
  }

  // Short text: caching overhead not worthwhile
  if (input.length < MIN_CACHE_LENGTH) {
    return toSanitizedMarkdownHtml(input);
  }

  // Find a safe split point (second-to-last \n\n outside code fences)
  const splitIdx = findSafeSplitPoint(input);
  if (splitIdx < 0) {
    return toSanitizedMarkdownHtml(input);
  }

  const prefixText = input.slice(0, splitIdx);
  const tailText = input.slice(splitIdx);

  // Exact cache hit: same prefix text
  if (prefixText === cachedPrefixText) {
    return cachedPrefixHtml + toSanitizedMarkdownHtml(tailText);
  }

  // Incremental hit: new prefix extends the cached prefix
  // (common during streaming since text grows monotonically)
  if (prefixText.startsWith(cachedPrefixText) && cachedPrefixText.length > 0) {
    const newBlocksText = prefixText.slice(cachedPrefixText.length);
    cachedPrefixHtml = cachedPrefixHtml + toSanitizedMarkdownHtml(newBlocksText);
    cachedPrefixText = prefixText;
    return cachedPrefixHtml + toSanitizedMarkdownHtml(tailText);
  }

  // Full cache miss: re-render entire prefix
  cachedPrefixHtml = toSanitizedMarkdownHtml(prefixText);
  cachedPrefixText = prefixText;
  return cachedPrefixHtml + toSanitizedMarkdownHtml(tailText);
}

/** Clear the streaming cache. Call on stream end or session change. */
export function resetStreamingCache(): void {
  cachedPrefixText = "";
  cachedPrefixHtml = "";
}

/**
 * Find the second-to-last `\n\n` boundary that is NOT inside a code fence.
 * Returns the character index where the tail starts (first non-blank char
 * after the boundary), or -1 if no safe split point exists.
 *
 * Why second-to-last? The tail should contain at least one complete block
 * so that partial/in-progress blocks at the very end render correctly.
 *
 * Exported for testing only.
 */
export function findSafeSplitPoint(text: string): number {
  let inFence = false;
  let fenceMarker = "";
  const boundaries: number[] = [];
  let pos = 0;

  while (pos < text.length) {
    const eol = text.indexOf("\n", pos);
    const lineEnd = eol === -1 ? text.length : eol;
    const line = text.slice(pos, lineEnd);
    const trimmed = line.trimStart();

    // Code fence detection (``` or ~~~ with 3+ chars)
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (
        marker.charAt(0) === fenceMarker.charAt(0) &&
        marker.length >= fenceMarker.length
      ) {
        // Closing fence: same char type, at least as many chars, no info string
        const afterMarker = trimmed.slice(marker.length).trim();
        if (afterMarker === "") {
          inFence = false;
          fenceMarker = "";
        }
      }
    }

    // Record \n\n boundaries outside fences (blank line = paragraph break)
    if (!inFence && line.trim() === "") {
      let nextContent = lineEnd + 1;
      // Skip additional blank lines
      while (nextContent < text.length && text[nextContent] === "\n") {
        nextContent++;
      }
      if (nextContent < text.length) {
        // Deduplicate: consecutive blank lines map to same boundary
        if (boundaries.length === 0 || boundaries[boundaries.length - 1] !== nextContent) {
          boundaries.push(nextContent);
        }
      }
    }

    pos = eol === -1 ? text.length : eol + 1;
  }

  if (boundaries.length < 2) {
    return -1;
  }
  return boundaries[boundaries.length - 2];
}
