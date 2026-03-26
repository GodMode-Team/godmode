/**
 * action-items.ts — Extract action items from user brain dumps.
 *
 * Parses user messages for task-like intent ("I need to", "must", "should",
 * "don't forget", etc.), extracts metadata (title, urgency, deadline hints),
 * and classifies intent (task | exploration | concern).
 *
 * The ally sees extracted items in context and asks clarifying questions
 * before creating tasks — "when is this due?" "who owns this?"
 *
 * This is the CAPTURE phase of the brain dump pipeline:
 *   USER SPEAKS → EXTRACT → CLARIFY → CREATE → ORGANIZE
 */

import { MAX_ACTION_ITEMS_PER_SESSION, ACTION_ITEM_TTL_MS } from "./constants.js";

// ── Types ────────────────────────────────────────────────────────────

export interface ActionItem {
  /** Extracted action title (cleaned up) */
  title: string;
  /** How confident we are this is a real action item */
  confidence: "high" | "medium" | "low";
  /** What kind of intent this represents */
  intent: "task" | "exploration" | "concern";
  /** Urgency signal from language */
  urgency: "urgent" | "normal" | "low";
  /** Raw deadline hint if detected (e.g., "by Friday", "this week") */
  deadlineHint: string | null;
  /** The original text segment that triggered extraction */
  source: string;
}

// ── Extraction Patterns ──────────────────────────────────────────────

/** High-confidence patterns — these are almost always real tasks */
const HIGH_CONFIDENCE_PATTERNS: Array<{ pattern: RegExp; intent: ActionItem["intent"] }> = [
  // Direct commitments
  { pattern: /\bi need to\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bi have to\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bi must\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bi've got to\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bgotta\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },

  // Reminders
  { pattern: /\bremind me to\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "task" },
  { pattern: /\bdon'?t (?:let me )?forget (?:to\s+)?(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "task" },

  // Explicit asks
  { pattern: /\bcan you (?:please\s+)?(?:help me\s+)?(.{10,120}?)(?:\?|\.|!|$)/gi, intent: "task" },
  { pattern: /\bplease\s+(.{10,80}?)(?:\.|,|;|!|$)/gi, intent: "task" },
];

/** Medium-confidence patterns — likely tasks but could be musing */
const MEDIUM_CONFIDENCE_PATTERNS: Array<{ pattern: RegExp; intent: ActionItem["intent"] }> = [
  // Soft commitments
  { pattern: /\bi should\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bi want to\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bwe need to\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\bwe should\s+(.{10,120}?)(?:\.|,|;|!|\band\b|$)/gi, intent: "task" },
  { pattern: /\blet'?s\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "task" },

  // Explorations
  { pattern: /\bi'?m thinking about\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "exploration" },
  { pattern: /\bmaybe (?:i|we) should\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "exploration" },
  { pattern: /\bwhat if (?:i|we)\s+(.{10,120}?)(?:\?|$)/gi, intent: "exploration" },

  // Concerns
  { pattern: /\bi'?m worried about\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "concern" },
  { pattern: /\bi'?m concerned about\s+(.{10,120}?)(?:\.|,|;|!|$)/gi, intent: "concern" },
];

/** Urgency markers */
const URGENT_MARKERS = /\b(asap|urgent|immediately|right now|today|this morning|this afternoon|critical|blocking|blocker|fire|emergency)\b/i;
const DEADLINE_PATTERNS = /\b(by (?:eod|eow|end of (?:day|week|month)|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|tonight|next week|next month|march|april|may|june|july|august|september|october|november|december|\d{1,2}(?:\/\d{1,2})?)|this (?:week|month|quarter|sprint)|before (?:the meeting|lunch|eod|friday))\b/i;

// ── Extraction Engine ────────────────────────────────────────────────

/**
 * Extract action items from a user message.
 * Returns empty array if no actionable intent detected.
 */
export function extractActionItems(message: string): ActionItem[] {
  if (!message || message.length < 15) return [];

  // Skip messages that are clearly questions about GodMode/system
  if (/^(how|what|where|when|why|can|does|is|are|do)\b/i.test(message.trim()) && message.length < 80) {
    return [];
  }

  const items: ActionItem[] = [];
  const seen = new Set<string>();

  // Run high-confidence patterns
  for (const { pattern, intent } of HIGH_CONFIDENCE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(message)) !== null) {
      const title = cleanTitle(match[1]);
      const key = title.toLowerCase().slice(0, 40);
      if (title.length >= 8 && !seen.has(key)) {
        seen.add(key);
        items.push({
          title,
          confidence: "high",
          intent,
          urgency: detectUrgency(match[0]),
          deadlineHint: extractDeadline(match[0]) ?? extractDeadline(message),
          source: match[0].trim(),
        });
      }
    }
  }

  // Run medium-confidence patterns
  for (const { pattern, intent } of MEDIUM_CONFIDENCE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(message)) !== null) {
      const title = cleanTitle(match[1]);
      const key = title.toLowerCase().slice(0, 40);
      if (title.length >= 8 && !seen.has(key)) {
        seen.add(key);
        items.push({
          title,
          confidence: "medium",
          intent,
          urgency: detectUrgency(match[0]),
          deadlineHint: extractDeadline(match[0]) ?? extractDeadline(message),
          source: match[0].trim(),
        });
      }
    }
  }

  // Cap at 8 items per message — a brain dump shouldn't create 20 tasks
  return items.slice(0, 8);
}

// ── Helpers ──────────────────────────────────────────────────────────

function cleanTitle(raw: string): string {
  return raw
    .trim()
    .replace(/^(to|that|about)\s+/i, "")  // Remove leading connectives
    .replace(/\s+/g, " ")                  // Normalize whitespace
    .replace(/[.!;,]+$/, "")               // Remove trailing punctuation
    .trim();
}

function detectUrgency(text: string): ActionItem["urgency"] {
  if (URGENT_MARKERS.test(text)) return "urgent";
  return "normal";
}

function extractDeadline(text: string): string | null {
  const match = text.match(DEADLINE_PATTERNS);
  return match ? match[0].trim() : null;
}

// ── Session Buffer ───────────────────────────────────────────────────

/**
 * Per-session buffer for extracted action items.
 * Accumulated across messages in a session, drained when ally sees them.
 */
const sessionActionItems = new Map<string, ActionItem[]>();
const MAX_SESSION_ITEMS = MAX_ACTION_ITEMS_PER_SESSION;
const ITEM_TTL_MS = ACTION_ITEM_TTL_MS;
const sessionTimestamps = new Map<string, number>();

export const actionItemBuffer = {
  /**
   * Add extracted action items for a session.
   * Called from message_received hook.
   */
  add(sessionKey: string, items: ActionItem[]): void {
    if (items.length === 0) return;
    const existing = sessionActionItems.get(sessionKey) ?? [];
    const combined = [...existing, ...items].slice(-MAX_SESSION_ITEMS);
    sessionActionItems.set(sessionKey, combined);
    sessionTimestamps.set(sessionKey, Date.now());
  },

  /**
   * Drain action items for context injection.
   * Returns items and clears the buffer. Called from before_prompt_build.
   */
  drain(sessionKey: string): ActionItem[] {
    const items = sessionActionItems.get(sessionKey) ?? [];
    sessionActionItems.delete(sessionKey);
    sessionTimestamps.delete(sessionKey);
    return items;
  },

  /**
   * Peek at current items without draining (for diagnostics).
   */
  peek(sessionKey: string): ActionItem[] {
    const ts = sessionTimestamps.get(sessionKey);
    if (ts && Date.now() - ts > ITEM_TTL_MS) {
      sessionActionItems.delete(sessionKey);
      sessionTimestamps.delete(sessionKey);
      return [];
    }
    return sessionActionItems.get(sessionKey) ?? [];
  },

  /** Prune stale sessions. */
  prune(): void {
    const cutoff = Date.now() - ITEM_TTL_MS;
    for (const [key, ts] of sessionTimestamps) {
      if (ts < cutoff) {
        sessionActionItems.delete(key);
        sessionTimestamps.delete(key);
      }
    }
  },
};

// ── Context Formatting ───────────────────────────────────────────────

/**
 * Format extracted action items for injection into the ally's context.
 * Returns null if no items to surface.
 */
export function formatActionItemsForContext(items: ActionItem[]): string | null {
  if (items.length === 0) return null;

  const tasks = items.filter((i) => i.intent === "task");
  const explorations = items.filter((i) => i.intent === "exploration");
  const concerns = items.filter((i) => i.intent === "concern");

  const lines: string[] = [
    "## Action Items Detected",
    "The user mentioned things that sound like action items. Before creating tasks,",
    "ask clarifying questions: **When is this due? What does 'done' look like? Who owns it?**",
    "Don't auto-create tasks silently — confirm with the user first.",
    "",
  ];

  if (tasks.length > 0) {
    lines.push("**Tasks:**");
    for (const t of tasks) {
      const urgencyTag = t.urgency === "urgent" ? " 🔴" : "";
      const deadline = t.deadlineHint ? ` (${t.deadlineHint})` : "";
      const conf = t.confidence === "high" ? "✓" : "?";
      lines.push(`- [${conf}] ${t.title}${deadline}${urgencyTag}`);
    }
    lines.push("");
  }

  if (explorations.length > 0) {
    lines.push("**Explorations** (not tasks yet — discuss before capturing):");
    for (const e of explorations) {
      lines.push(`- ${e.title}`);
    }
    lines.push("");
  }

  if (concerns.length > 0) {
    lines.push("**Concerns** (acknowledge, don't task-ify unless user wants):");
    for (const c of concerns) {
      lines.push(`- ${c.title}`);
    }
    lines.push("");
  }

  lines.push(
    "If you create tasks, use `tasks.create` with title, dueDate, and priority.",
    "For items needing agent work, offer to queue them: \"Want me to research this in the background?\"",
  );

  return lines.join("\n");
}
