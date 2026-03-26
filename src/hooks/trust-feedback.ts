/**
 * trust-feedback.ts — Post-skill trust feedback injection.
 *
 * Uses the after_tool_call lifecycle hook to detect when a tool/skill
 * completes, then queues a feedback prompt for injection into the next
 * agent turn via before_prompt_build.
 *
 * This replaces the old global system-prompt injection with a targeted
 * ask that only fires at skill completion boundaries.
 */

import {
  generatePostSkillFeedbackPrompt,
  readTrustState,
} from "../methods/trust-tracker.js";

// --- In-memory queue of pending feedback prompts per session ---

type PendingFeedback = {
  skillName: string;
  prompt: string;
  storedFeedback: string[];
  timestamp: number;
};

/**
 * Keyed by sessionKey. Each session can accumulate multiple pending
 * feedback prompts if several tools fire before the next prompt build.
 * We only keep the most recent one per session to avoid prompt spam.
 */
const pendingFeedback = new Map<string, PendingFeedback>();

/** TTL for pending feedback entries (5 minutes). */
const PENDING_TTL_MS = 5 * 60 * 1000;

/**
 * Tools that are internal plumbing and should NOT trigger trust feedback.
 * The trust_rate tool itself is excluded to avoid infinite loops.
 */
const EXCLUDED_TOOLS = new Set([
  "trust_rate",
  "sessions_spawn",
  "task",
  "team_message",
  "team_memory_write",
]);

/**
 * Called from the after_tool_call lifecycle hook.
 * Fires after every non-excluded tool/skill completes and queues a
 * feedback prompt for the next before_prompt_build cycle.
 *
 * If the tool name matches a tracked workflow, the feedback prompt
 * references the workflow name and includes stored improvement
 * feedback. Otherwise the raw tool name is used as the skill label.
 */
export async function handlePostToolFeedback(
  toolName: string,
  sessionKey: string | undefined,
  error: string | undefined,
): Promise<void> {
  // Skip excluded/internal tools
  if (EXCLUDED_TOOLS.has(toolName)) return;

  // Skip errored tool calls — no point asking for a rating on a failure
  if (error) return;

  // Need a session key to correlate with prompt build
  if (!sessionKey) return;

  // Try to match the tool name to a tracked workflow (case-insensitive,
  // partial match: a tool named "daily_brief" matches workflow "daily brief")
  const state = await readTrustState();
  let matchedWorkflow: string | undefined;
  let storedFeedback: string[] = [];

  if (state.workflows && state.workflows.length > 0) {
    const normalizedTool = toolName.toLowerCase().replace(/[_-]/g, " ");
    matchedWorkflow = state.workflows.find((w) => {
      const normalizedWorkflow = w.toLowerCase().replace(/[_-]/g, " ");
      return (
        normalizedTool.includes(normalizedWorkflow) ||
        normalizedWorkflow.includes(normalizedTool)
      );
    });

    if (matchedWorkflow) {
      storedFeedback = (state.workflowFeedback[matchedWorkflow] ?? []).slice(-3);
    }
  }

  // Use the matched workflow name if available, otherwise humanize the tool name
  const skillLabel = matchedWorkflow ?? toolName.replace(/[_-]/g, " ");

  pendingFeedback.set(sessionKey, {
    skillName: skillLabel,
    prompt: generatePostSkillFeedbackPrompt(skillLabel),
    storedFeedback,
    timestamp: Date.now(),
  });
}

/**
 * Called from before_prompt_build to inject any pending trust feedback
 * prompt into the agent's next turn. Returns the prepend context string
 * or null if nothing is pending.
 *
 * Consumes the pending entry so it only fires once.
 */
export function consumePendingTrustFeedback(
  sessionKey: string | undefined,
): string | null {
  if (!sessionKey) return null;

  const entry = pendingFeedback.get(sessionKey);
  if (!entry) return null;

  // Check TTL — discard stale entries
  if (Date.now() - entry.timestamp > PENDING_TTL_MS) {
    pendingFeedback.delete(sessionKey);
    return null;
  }

  // Consume the entry
  pendingFeedback.delete(sessionKey);

  // Build the prepend context
  const lines = [
    `## Trust Feedback — "${entry.skillName}"`,
    "",
    entry.prompt,
  ];

  if (entry.storedFeedback.length > 0) {
    lines.push(
      "",
      "Previous feedback for this workflow (apply these lessons):",
      ...entry.storedFeedback.map((f) => `- ${f}`),
    );
  }

  return lines.join("\n");
}

/**
 * Periodic cleanup of stale entries. Called opportunistically.
 */
export function cleanupStaleFeedback(): void {
  const now = Date.now();
  for (const [key, entry] of pendingFeedback) {
    if (now - entry.timestamp > PENDING_TTL_MS) {
      pendingFeedback.delete(key);
    }
  }
}
