export type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};

export function parseAgentSessionKey(
  sessionKey: string | undefined | null,
): ParsedAgentSessionKey | null {
  const raw = (sessionKey ?? "").trim();
  if (!raw) return null;
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3) return null;
  if (parts[0] !== "agent") return null;
  const agentId = parts[1]?.trim();
  const rest = parts.slice(2).join(":");
  if (!agentId || !rest) return null;
  return { agentId, rest };
}

export function isSubagentSessionKey(sessionKey: string | undefined | null): boolean {
  const raw = (sessionKey ?? "").trim();
  if (!raw) return false;
  if (raw.toLowerCase().startsWith("subagent:")) return true;
  const parsed = parseAgentSessionKey(raw);
  return Boolean((parsed?.rest ?? "").toLowerCase().startsWith("subagent:"));
}

export function isAcpSessionKey(sessionKey: string | undefined | null): boolean {
  const raw = (sessionKey ?? "").trim();
  if (!raw) return false;
  const normalized = raw.toLowerCase();
  if (normalized.startsWith("acp:")) return true;
  const parsed = parseAgentSessionKey(raw);
  return Boolean((parsed?.rest ?? "").toLowerCase().startsWith("acp:"));
}

/**
 * Returns true when `key` is a literal "main" alias — the default/pinned
 * ally session, NOT a named channel like webchat-* or imessage-*.
 * Used for tab deduplication: these aliases are handled by the pinned tab.
 */
export function isMainSessionKey(key: string | undefined | null): boolean {
  const raw = (key ?? "").trim();
  if (!raw) return false;
  if (raw === "main") return true;
  const lower = raw.toLowerCase();
  if (lower === "agent:main:main" || lower.endsWith(":main")) return true;
  return false;
}

/**
 * Returns true when `key` belongs to the ally (agent:main) — including
 * all channels: webchat-*, imessage-*, main, etc.
 * Used for ally overlay routing (show ally panel activity).
 */
export function isAllySessionKey(key: string | undefined | null): boolean {
  const raw = (key ?? "").trim();
  if (!raw) return false;
  if (isMainSessionKey(raw)) return true;
  const lower = raw.toLowerCase();
  if (lower.startsWith("agent:main:")) return true;
  return false;
}

/**
 * Returns true when `a` and `b` refer to the same session.  Handles the
 * special case where the gateway may respond on "agent:main:main" even when
 * the UI is on "agent:main:webchat-xxx" — both are the ally's conversation.
 *
 * IMPORTANT: Two different named ally channels (e.g. webchat-abc vs webchat-xyz)
 * are NOT the same session. Only the canonical "main" form matches any ally channel
 * (because the gateway may canonicalize any webchat-* to agent:main:main in responses).
 */
export function sessionKeysMatch(a: string, b: string): boolean {
  if (a === b) return true;
  // Gateway canonicalization: "agent:main:main" / "main" matches any ally channel.
  // But two specific channels (webchat-abc vs webchat-xyz) do NOT match.
  if (isAllySessionKey(a) && isAllySessionKey(b)) {
    // At least one must be the canonical "main" form for them to match
    if (isMainSessionKey(a) || isMainSessionKey(b)) return true;
  }
  return false;
}

const THREAD_SESSION_MARKERS = [":thread:", ":topic:"];

export function resolveThreadParentSessionKey(
  sessionKey: string | undefined | null,
): string | null {
  const raw = (sessionKey ?? "").trim();
  if (!raw) return null;
  const normalized = raw.toLowerCase();
  let idx = -1;
  for (const marker of THREAD_SESSION_MARKERS) {
    const candidate = normalized.lastIndexOf(marker);
    if (candidate > idx) idx = candidate;
  }
  if (idx <= 0) return null;
  const parent = raw.slice(0, idx).trim();
  return parent ? parent : null;
}
