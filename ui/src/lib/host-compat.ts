/**
 * Host Compatibility — UI-side capability detection and version-aware helpers.
 *
 * On WebSocket connect, probes the host for available methods and field conventions.
 * Provides version-aware helpers that automatically use the right RPC calls and
 * field names for the detected host version.
 *
 * Combined with safe-request.ts, this ensures GodMode UI works across host versions
 * without manual intervention.
 */

import { safeRequest, clearHealingCache, type SafeRequestClient } from "./safe-request.js";

// ── Types ──────────────────────────────────────────────────────────

export type MethodCapability = {
  available: boolean;
  /** Valid field names discovered from probe errors */
  fields?: string[];
  /** Error from probe (if method unavailable) */
  error?: string;
  testedAt: number;
};

export type HostCompatState = {
  /** Host version from hello handshake */
  hostVersion: string;
  /** Protocol version from hello */
  protocolVersion?: number;
  /** Method capabilities discovered via probing */
  methods: Record<string, MethodCapability>;
  /** When this compat state was initialized */
  initializedAt: number;
  /** Whether probing is still in progress */
  probing: boolean;
};

// ── State ──────────────────────────────────────────────────────────

let _compat: HostCompatState | null = null;

// ── Initialization ─────────────────────────────────────────────────

/**
 * Initialize host compatibility from the hello handshake payload.
 * Called once in onHello after WebSocket connect.
 *
 * Extracts version info and starts a background capability probe.
 */
export function initHostCompat(
  hello: Record<string, unknown>,
  client: SafeRequestClient,
): HostCompatState {
  // Clear stale healing cache on new connection
  clearHealingCache();

  // Extract version info from hello
  const hostVersion = String(hello.version ?? hello.serverVersion ?? hello.gatewayVersion ?? "unknown");
  const protocolVersion = typeof hello.protocol === "number" ? hello.protocol : undefined;

  _compat = {
    hostVersion,
    protocolVersion,
    methods: {},
    initializedAt: Date.now(),
    probing: true,
  };

  // Load cached state from sessionStorage
  try {
    const cached = sessionStorage.getItem("godmode:host-compat");
    if (cached) {
      const prev = JSON.parse(cached) as HostCompatState;
      // If same host version, reuse cached method capabilities
      if (prev.hostVersion === hostVersion && prev.methods) {
        _compat.methods = prev.methods;
        _compat.probing = false;
        return _compat;
      }
    }
  } catch {
    // sessionStorage may not be available
  }

  // Run background probe (non-blocking)
  runCapabilityProbe(client).catch(() => {});

  return _compat;
}

// ── Capability Probing ─────────────────────────────────────────────

/**
 * Probe critical RPC methods to discover what's available.
 * Uses intentionally invalid params to get schema info from errors
 * without side effects.
 */
async function runCapabilityProbe(client: SafeRequestClient): Promise<void> {
  if (!_compat) return;

  const probes: Array<{
    method: string;
    params: unknown;
  }> = [
    { method: "sessions.list", params: { limit: 1 } },
    { method: "sessions.patch", params: { key: "__compat_probe__" } },
    { method: "sessions.autoTitle", params: { sessionKey: "__compat_probe__" } },
    { method: "config.get", params: {} },
  ];

  for (const probe of probes) {
    const capability: MethodCapability = {
      available: false,
      testedAt: Date.now(),
    };

    try {
      await client.request(probe.method, probe.params);
      capability.available = true;
    } catch (err) {
      const errMsg = String(err instanceof Error ? err.message : err);
      const errLower = errMsg.toLowerCase();

      // "unknown method" = method doesn't exist
      // Other errors (bad params, not found, etc.) = method exists
      const isMethodMissing =
        errLower.includes("unknown method") ||
        (errLower.includes("not found") && errLower.includes("method"));

      capability.available = !isMethodMissing;

      if (isMethodMissing) {
        capability.error = "method not available";
      }

      // Extract valid fields from error messages
      const fieldsMatch = errMsg.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);
      if (fieldsMatch) {
        capability.fields = fieldsMatch[1].split(",").map((f) => f.trim().replace(/['"]/g, ""));
      }
    }

    _compat.methods[probe.method] = capability;
  }

  _compat.probing = false;

  // Persist to sessionStorage
  try {
    sessionStorage.setItem("godmode:host-compat", JSON.stringify(_compat));
  } catch {
    // Non-fatal
  }
}

// ── Capability Queries ─────────────────────────────────────────────

/**
 * Check if a specific RPC method is available on the host.
 * Returns undefined if not yet probed.
 */
export function hasMethod(method: string): boolean | undefined {
  if (!_compat) return undefined;
  const cap = _compat.methods[method];
  if (!cap) return undefined;
  return cap.available;
}

/**
 * Get the host version string.
 */
export function getHostVersion(): string {
  return _compat?.hostVersion ?? "unknown";
}

/**
 * Get the full compat state (for diagnostics).
 */
export function getHostCompat(): HostCompatState | null {
  return _compat;
}

/**
 * Whether capability probing is still in progress.
 */
export function isProbing(): boolean {
  return _compat?.probing ?? false;
}

// ── Version-Aware Session Helpers ──────────────────────────────────

/**
 * Patch a session's display name, auto-adapting to the host's field convention.
 *
 * - On 2026.3.1+: uses `label`
 * - On older hosts: uses `displayName`
 * - On unknown: tries `label` first, falls back to `displayName` via self-heal
 */
export async function hostPatchSession(
  client: SafeRequestClient,
  key: string,
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await safeRequest(client, "sessions.patch", {
    key,
    label: name,
  });

  if (result.ok) return { ok: true };

  // If label failed, try displayName explicitly (pre-2026.3.1 hosts)
  const fallback = await safeRequest(client, "sessions.patch", {
    key,
    displayName: name,
  }, { raw: true });

  if (fallback.ok) return { ok: true };

  return { ok: false, error: result.error };
}

/**
 * Auto-title a session, handling the case where sessions.autoTitle was removed.
 *
 * Strategy:
 * 1. If sessions.autoTitle is available, use it
 * 2. Otherwise, derive a title from the first message and patch it
 */
export async function hostAutoTitle(
  client: SafeRequestClient,
  sessionKey: string,
  messages: Array<{ role: string; content: string }>,
): Promise<{ ok: boolean; title?: string; error?: string }> {
  // Check if autoTitle is known to be available
  const autoTitleAvailable = hasMethod("sessions.autoTitle");

  if (autoTitleAvailable !== false) {
    // Try autoTitle first (available or unknown)
    const result = await safeRequest(client, "sessions.autoTitle", {
      sessionKey,
    });
    if (result.ok) {
      return { ok: true, title: (result.data as Record<string, unknown>)?.title as string };
    }
    // If we got here and autoTitle was unknown, now we know it's gone
  }

  // Derive title from first user message
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return { ok: false, error: "No user message to derive title from" };

  const title = deriveTitle(firstUserMsg.content);
  const patchResult = await hostPatchSession(client, sessionKey, title);

  if (patchResult.ok) return { ok: true, title };
  return { ok: false, error: patchResult.error };
}

/**
 * Derive a short session title from message content.
 * Extracts meaningful text, strips markdown, truncates to ~60 chars.
 */
function deriveTitle(content: string): string {
  // Strip markdown, code blocks, URLs
  let text = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#*_~>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

  // Take first meaningful line
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  text = lines[0] ?? "New conversation";

  // Truncate intelligently
  if (text.length > 60) {
    // Try to break at a word boundary
    const truncated = text.slice(0, 57);
    const lastSpace = truncated.lastIndexOf(" ");
    text = (lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }

  return text;
}

/**
 * Read the display name from a session object, handling field name differences.
 */
export function readSessionName(session: Record<string, unknown>): string {
  return String(session.label ?? session.displayName ?? session.key ?? "Untitled");
}
