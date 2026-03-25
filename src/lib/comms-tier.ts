/**
 * comms-tier.ts — Tiered permission classifier for outbound actions.
 *
 * Three tiers:
 *   free     — read-only, internal, safe. No gate.
 *   draft    — externally-touching but reversible. Force draft mode.
 *   approval — irreversible / high-stakes. Require explicit user approval.
 *
 * Default is always the safer tier. Ambiguous → draft.
 */

export type CommsTier = "free" | "draft" | "approval";

// ── Service definitions ──────────────────────────────────────────────

interface ServiceRule {
  /** Regex to match domain or tool name */
  pattern: RegExp;
  /** Default tier when no user intent signal is detected */
  defaultTier: CommsTier;
  /** Does this service support draft mode? */
  supportsDraft: boolean;
}

const SERVICE_RULES: ServiceRule[] = [
  // Front — always draft (hard gate enforced separately)
  { pattern: /api2\.frontapp\.com/i, defaultTier: "draft", supportsDraft: true },
  // Gmail API
  { pattern: /gmail\.googleapis\.com/i, defaultTier: "draft", supportsDraft: true },
  // Circle community
  { pattern: /circle\.so/i, defaultTier: "draft", supportsDraft: true },
  // Google read-only APIs (POST is semantically a query, not a mutation)
  { pattern: /analyticsdata\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  { pattern: /analyticsreporting\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  { pattern: /bigquery\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  { pattern: /monitoring\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  { pattern: /logging\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  { pattern: /searchconsole\.googleapis\.com/i, defaultTier: "free", supportsDraft: false },
  // Slack external channels — approval (can't draft a Slack message)
  { pattern: /slack\.com\/api/i, defaultTier: "approval", supportsDraft: false },
  // Twitter/X
  { pattern: /api\.(twitter|x)\.com/i, defaultTier: "approval", supportsDraft: false },
  // Generic SaaS POST — approval by default
  { pattern: /api\.\S+\.\S+/i, defaultTier: "approval", supportsDraft: false },
];

// ── Intent signals ───────────────────────────────────────────────────

/** Keywords that signal "create a draft, don't send yet" */
const DRAFT_SIGNALS = [
  /\bdraft\b/i,
  /\bwrite up\b/i,
  /\bprepare\b/i,
  /\bcreate\b/i,
  /\bcompose\b/i,
  /\bput together\b/i,
  /\bdon'?t send/i,
  /\bdon'?t publish/i,
];

/** Keywords that signal "send it live" */
const SEND_SIGNALS = [
  /\bsend it\b/i,
  /\bsend the\b/i,
  /\bfire away\b/i,
  /\bship it\b/i,
  /\bgo ahead\b/i,
  /\bpublish\b/i,
  /\bpost it\b/i,
  /\bdeliver\b/i,
  /\bhit send\b/i,
];

/**
 * Parse recent user messages for draft vs send intent.
 * Returns "draft" | "send" | "ambiguous".
 */
export function parseIntent(recentMessages: string[]): "draft" | "send" | "ambiguous" {
  // Check last 3 messages, most recent first
  const msgs = recentMessages.slice(-3);

  let draftScore = 0;
  let sendScore = 0;

  for (const msg of msgs) {
    for (const pat of DRAFT_SIGNALS) {
      if (pat.test(msg)) draftScore++;
    }
    for (const pat of SEND_SIGNALS) {
      if (pat.test(msg)) sendScore++;
    }
  }

  if (draftScore > 0 && sendScore === 0) return "draft";
  if (sendScore > 0 && draftScore === 0) return "send";
  if (sendScore > draftScore) return "send";
  if (draftScore > sendScore) return "draft";
  return "ambiguous";
}

/**
 * Classify an outbound action into a comms tier.
 *
 * @param target - URL or tool name being called
 * @param method - HTTP method (GET, POST, etc.) or empty for tools
 * @param recentUserMessages - last few user messages for intent parsing
 * @returns The tier that should govern this action
 */
export function classifyAction(
  target: string,
  method: string,
  recentUserMessages: string[] = [],
): CommsTier {
  const m = method.toUpperCase();

  // Read-only methods are always free
  if (m === "GET" || m === "HEAD" || m === "OPTIONS" || m === "") {
    return "free";
  }

  // Find matching service rule
  const rule = SERVICE_RULES.find((r) => r.pattern.test(target));
  if (!rule) {
    // Unknown external service — default to approval
    return "approval";
  }

  // If service supports drafts and no explicit "send" intent, force draft
  if (rule.supportsDraft) {
    const intent = parseIntent(recentUserMessages);
    if (intent === "send") return "approval"; // user explicitly wants to send → gate it
    return "draft"; // draft or ambiguous → safe default
  }

  // Service doesn't support drafts — use its default tier
  // But if user said "draft", warn (can't draft a Slack msg)
  return rule.defaultTier;
}

/**
 * Get a human-readable explanation for why this tier was chosen.
 * Useful for logging and ally transparency.
 */
export function tierExplanation(tier: CommsTier, target: string): string {
  switch (tier) {
    case "free":
      return `Read-only action to ${target} — no gate needed.`;
    case "draft":
      return `Creating as draft for ${target}. Review and send manually when ready.`;
    case "approval":
      return `Live action to ${target} requires explicit approval before proceeding.`;
  }
}
