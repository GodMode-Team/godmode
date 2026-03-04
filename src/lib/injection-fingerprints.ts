/**
 * Injection Fingerprints — captures the actual text injected by
 * before_prompt_build so that the output shield can detect leaks
 * without hardcoded marker arrays.
 *
 * Module-level state, shared across safety-gates.ts and index.ts
 * within the same Node process.
 */

/** The full injected text from the most recent before_prompt_build, per session. */
const injectedContextMap = new Map<string, string>();

/** Pre-computed n-grams for fast substring matching, per session. */
const ngramCacheMap = new Map<string, Set<string>>();

const NGRAM_LENGTH = 40; // characters per chunk
const NGRAM_STRIDE = 20; // overlap by half for robustness

/**
 * Called from before_prompt_build after assembling the full system context.
 * Captures the raw joined text (before XML wrapping) and pre-computes
 * n-grams for efficient matching.
 */
export function captureInjectedContext(sessionKey: string | undefined, rawText: string): void {
  const key = sessionKey ?? "__default__";
  injectedContextMap.set(key, rawText);

  // Pre-compute sliding-window n-grams (lowercased, whitespace-normalized)
  const normalized = rawText.toLowerCase().replace(/\s+/g, " ");
  const ngrams = new Set<string>();
  for (let i = 0; i <= normalized.length - NGRAM_LENGTH; i += NGRAM_STRIDE) {
    ngrams.add(normalized.slice(i, i + NGRAM_LENGTH));
  }
  ngramCacheMap.set(key, ngrams);
}

/**
 * Check if an output string contains substantial overlap with the
 * injected system context. Returns the number of matching n-gram hits.
 *
 * Threshold guidance: 3+ hits = strong signal of a leak.
 * 1-2 hits = possible coincidence (short common phrases).
 */
export function countContextOverlap(sessionKey: string | undefined, output: string): number {
  const key = sessionKey ?? "__default__";
  const ngrams = ngramCacheMap.get(key);
  if (!ngrams || ngrams.size === 0) return 0;

  const normalized = output.toLowerCase().replace(/\s+/g, " ");
  if (normalized.length < NGRAM_LENGTH) return 0;

  let hits = 0;
  for (const ngram of ngrams) {
    if (normalized.includes(ngram)) hits++;
  }
  return hits;
}

/**
 * Extract a set of representative fingerprint strings from the captured
 * context. Suitable for sending to the UI via RPC.
 * Picks lines >= 30 chars (distinctive enough to avoid false positives).
 */
export function extractFingerprints(sessionKey: string | undefined, count = 20): string[] {
  const raw = injectedContextMap.get(sessionKey ?? "__default__");
  if (!raw) return [];

  const fingerprints: string[] = [];
  const lines = raw.split("\n").filter((l) => l.trim().length >= 30);
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase().replace(/\s+/g, " ");
    if (trimmed.length >= 30) {
      fingerprints.push(trimmed.slice(0, 50));
    }
    if (fingerprints.length >= count) break;
  }
  return fingerprints;
}

/** Cleanup on session end */
export function clearInjectedContext(sessionKey: string | undefined): void {
  const key = sessionKey ?? "__default__";
  injectedContextMap.delete(key);
  ngramCacheMap.delete(key);
}
