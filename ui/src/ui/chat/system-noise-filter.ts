/**
 * Detects system-injected noise messages that should be hidden from the main
 * chat view.  These include persona injections, consciousness dumps,
 * heartbeat prompts, cron triggers, and other before_prompt_build artefacts.
 *
 * Shared by both the ally bubble (cleanForAlly) and the main chat renderer.
 */

/** Extract the plain-text content from a raw message record. */
function extractText(msg: Record<string, unknown>): string {
  if (typeof msg.content === "string") return msg.content;
  if (typeof msg.text === "string") return msg.text;
  if (Array.isArray(msg.content)) {
    return (msg.content as Array<Record<string, unknown>>)
      .map((c) => (typeof c.text === "string" ? c.text : ""))
      .join("\n");
  }
  return "";
}

/** Fingerprints that, when 2+ appear in the same message, indicate a system dump. */
const MULTI_SIGNAL_PATTERNS = [
  "persistence protocol",
  "core principles:",
  "core behaviors",
  "your role as ",
  "be diligent first time",
  "exhaust reasonable options",
  "assume capability exists",
  "elite executive assistant",
  "consciousness context",
  "working context",
  "enforcement:",
  "internal system context injected by godmode",
];

/**
 * Returns `true` when a message is system prompt noise that should be hidden
 * from user-facing chat views (both the ally bubble and the main chat).
 *
 * We intentionally keep assistant responses that may echo some of these
 * phrases — only user-role messages and system-role messages are filtered.
 */
export function isSystemPromptNoise(msg: Record<string, unknown>): boolean {
  const role = typeof msg.role === "string" ? msg.role.toLowerCase() : "";

  // Only filter user-role injections (before_prompt_build) and system-role messages.
  // Assistant replies should always be shown even if they quote system phrases.
  if (role !== "user" && role !== "system") return false;

  const t = extractText(msg).trim();
  if (!t) return false;

  // ── System-context tag stripping ────────────────────────────────
  // before_prompt_build wraps injected context in <system-context> tags and
  // the gateway prepends it to the user message. Strip the tags so that
  // subsequent checks operate on the real user text. If nothing remains
  // after stripping, the message is pure system injection — hide it.
  let check = t;
  if (t.startsWith("<system-context") || t.startsWith("<godmode-context")) {
    check = t
      .replace(/<system-context[\s\S]*?<\/system-context>/gi, "")
      .replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi, "")
      .trim();
    if (!check) return true; // Pure system injection — hide it
  }

  // ── Exact prefixes (using `check` which has system-context tags stripped) ──

  // Heartbeat prompts
  if (check.startsWith("Read HEARTBEAT.md") || check.startsWith("Read CONSCIOUSNESS.md")) return true;

  // Server-side compaction memory flush instructions
  if (check.startsWith("Pre-compaction memory flush") || check.startsWith("pre-compaction memory flush")) return true;

  // Cron triggers
  if (/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(check)) return true;

  // NO_REPLY tokens
  if (check === "NO_REPLY" || check.startsWith("NO_REPLY\n")) return true;

  // Consciousness / system file dumps
  if (/^#\s*(?:🧠|\w+ Consciousness)/i.test(check)) return true;
  if (check.startsWith("# WORKING.md") || check.startsWith("# MISTAKES.md")) return true;

  // Verification checklists / consciousness dump mid-stream
  if (/(?:VERIFIED|FIXED|NEW):\s/.test(check) && /✅|🟡|☑/.test(check) && check.length > 300) return true;

  // Onboarding philosophy / system architecture blocks
  if (/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(check)) return true;

  // Pure GodMode Context prefix with no user text
  if (/^\[GodMode Context:[^\]]*\]\s*$/.test(check)) return true;

  // Agent persona echoed
  if (/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(check)) return true;

  // Persistence protocol / persona blocks
  if (/^##?\s*Persistence Protocol/i.test(check)) return true;
  if (/^##?\s*Core (?:Behaviors|Principles)/i.test(check)) return true;
  if (/^##?\s*Your Role as \w+/i.test(check)) return true;

  // Agent roster dump (entire message is roster)
  if (/^##\s*Your Team\s*\(Agent Roster\)/i.test(check) && check.indexOf("\n\n## ") === -1) return true;

  // Raw calendar data
  if (/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(check) && check.length > 200) return true;

  // Schedule table headers
  if (/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(check)) return true;

  // ── Multi-signal heuristic ────────────────────────────────────────
  const lower = check.toLowerCase();
  if (MULTI_SIGNAL_PATTERNS.filter((s) => lower.includes(s)).length >= 2) return true;

  return false;
}
