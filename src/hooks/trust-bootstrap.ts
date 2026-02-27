/**
 * trust-bootstrap.ts — RETIRED prompt hook.
 *
 * Previously injected Trust Tracker context into every agent system prompt.
 * This was noisy and amounted to prompt injection on every message.
 *
 * Trust feedback is now baked into the skill/workflow lifecycle:
 * - After each skill execution, the agent asks for a 1-10 rating via `trust_rate`
 * - The `trust.postSkillPrompt` RPC method provides the feedback prompt
 * - No global prompt injection needed
 *
 * This file is kept as a no-op stub so existing imports don't break.
 */

/**
 * No-op. Trust context is no longer injected into every prompt.
 * Feedback happens at skill completion boundaries instead.
 */
export async function loadTrustContext(): Promise<void> {
  return;
}
