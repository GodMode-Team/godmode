/**
 * Safe Request — Self-healing RPC wrapper for GodMode UI.
 *
 * Wraps every gateway RPC call with:
 * - Timeout protection (default 30s)
 * - Automatic field alias resolution (e.g. displayName → label)
 * - METHOD_NOT_FOUND fallback to alternative methods
 * - Schema error detection and param rewriting
 * - Result caching so healing only happens once per session
 *
 * All callers get self-healing for free — no error handling changes needed.
 */

// ── Types ──────────────────────────────────────────────────────────

export type SafeRequestClient = {
  request: <T = unknown>(method: string, params?: unknown) => Promise<T>;
};

export type SafeRequestResult<T> = {
  ok: true;
  data: T;
  method: string;
  healed?: boolean;
} | {
  ok: false;
  error: string;
  method: string;
  healed?: boolean;
};

export type SafeRequestOptions = {
  /** Timeout in ms (default 30000) */
  timeout?: number;
  /** Skip self-healing (use raw call) */
  raw?: boolean;
  /** Alternative methods to try on METHOD_NOT_FOUND */
  fallbacks?: string[];
};

// ── Field Aliases ──────────────────────────────────────────────────

/**
 * Known field renames across OpenClaw versions.
 * Maps old field name → new field name.
 * When an RPC fails with "unexpected property", we check this map
 * and rewrite the params automatically.
 */
const FIELD_ALIASES: Record<string, string> = {
  displayName: "label",
  sessionKey: "conversationId",
  // Add new aliases as host changes are discovered
};

/** Reverse map: new → old, for backward compat probing */
const REVERSE_ALIASES: Record<string, string> = {};
for (const [oldName, newName] of Object.entries(FIELD_ALIASES)) {
  REVERSE_ALIASES[newName] = oldName;
}

// ── Method Fallbacks ───────────────────────────────────────────────

/**
 * Known method fallbacks. When a method is removed, try these alternatives.
 */
const METHOD_FALLBACKS: Record<string, string[]> = {
  "sessions.autoTitle": ["sessions.patch"],
  "sessions.rename": ["sessions.patch"],
};

// ── Healing Cache ──────────────────────────────────────────────────

type HealingEntry = {
  /** The method that actually works */
  resolvedMethod: string;
  /** Field renames that were applied */
  fieldRenames: Record<string, string>;
  /** Timestamp */
  ts: number;
};

const healingCache = new Map<string, HealingEntry>();

/**
 * Load any previously-cached healing entries from sessionStorage.
 */
function loadHealingCache(): void {
  try {
    const raw = sessionStorage.getItem("godmode:healing-cache");
    if (raw) {
      const entries = JSON.parse(raw) as Record<string, HealingEntry>;
      for (const [key, entry] of Object.entries(entries)) {
        healingCache.set(key, entry);
      }
    }
  } catch {
    // sessionStorage may not be available
  }
}

function persistHealingCache(): void {
  try {
    const obj: Record<string, HealingEntry> = {};
    for (const [key, entry] of healingCache) {
      obj[key] = entry;
    }
    sessionStorage.setItem("godmode:healing-cache", JSON.stringify(obj));
  } catch {
    // Non-fatal
  }
}

// Initialize cache from storage
loadHealingCache();

// ── Core ───────────────────────────────────────────────────────────

/**
 * Apply cached healing to params before sending.
 */
function applyHealedParams(
  method: string,
  params: unknown,
): { method: string; params: unknown } {
  const cached = healingCache.get(method);
  if (!cached) return { method, params };

  // Apply method substitution
  const resolvedMethod = cached.resolvedMethod;

  // Apply field renames
  if (params && typeof params === "object" && !Array.isArray(params) && Object.keys(cached.fieldRenames).length > 0) {
    const p = { ...(params as Record<string, unknown>) };
    for (const [oldField, newField] of Object.entries(cached.fieldRenames)) {
      if (oldField in p && !(newField in p)) {
        p[newField] = p[oldField];
        delete p[oldField];
      }
    }
    return { method: resolvedMethod, params: p };
  }

  return { method: resolvedMethod, params };
}

/**
 * Try to self-heal from an error by detecting field or method issues.
 * Returns a healed { method, params } if possible, or null.
 */
function attemptHealing(
  method: string,
  params: unknown,
  error: string,
): { method: string; params: unknown; renames: Record<string, string> } | null {
  const errLower = error.toLowerCase();

  // Case 1: Unexpected property — field was renamed
  const unexpectedMatch = error.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);
  if (unexpectedMatch) {
    const offendingField = unexpectedMatch[1];
    const alias = FIELD_ALIASES[offendingField];
    if (alias && params && typeof params === "object") {
      const p = { ...(params as Record<string, unknown>) };
      if (offendingField in p) {
        p[alias] = p[offendingField];
        delete p[offendingField];
        console.log(`[safe-request] Self-heal: ${method} — rewrote "${offendingField}" → "${alias}"`);
        return { method, params: p, renames: { [offendingField]: alias } };
      }
    }
  }

  // Case 2: Unknown method — try fallbacks
  if (errLower.includes("unknown method") || errLower.includes("method not found")) {
    const fallbacks = METHOD_FALLBACKS[method];
    if (fallbacks && fallbacks.length > 0) {
      // Return first fallback — caller will retry
      const fallback = fallbacks[0];
      console.log(`[safe-request] Self-heal: ${method} not found — falling back to ${fallback}`);
      return { method: fallback, params, renames: {} };
    }
  }

  // Case 3: Try reverse alias (maybe the host reverted to old field names)
  if (errLower.includes("unexpected property") || errLower.includes("unknown field")) {
    if (params && typeof params === "object") {
      const p = { ...(params as Record<string, unknown>) };
      let healed = false;
      const renames: Record<string, string> = {};
      for (const [newField, oldField] of Object.entries(REVERSE_ALIASES)) {
        if (newField in p) {
          p[oldField] = p[newField];
          delete p[newField];
          renames[newField] = oldField;
          healed = true;
          console.log(`[safe-request] Self-heal: ${method} — reverse alias "${newField}" → "${oldField}"`);
        }
      }
      if (healed) {
        return { method, params: p, renames };
      }
    }
  }

  return null;
}

/**
 * Make a self-healing RPC call.
 *
 * - Never throws — always returns `{ ok, data/error, method }`
 * - On METHOD_NOT_FOUND: auto-tries fallback methods
 * - On schema rejection: rewrites params with field aliases and retries
 * - Caches successful adaptations in sessionStorage
 *
 * @example
 * const result = await safeRequest(client, "sessions.patch", { key, displayName: title });
 * if (result.ok) { ... }
 */
export async function safeRequest<T = unknown>(
  client: SafeRequestClient,
  method: string,
  params?: unknown,
  opts?: SafeRequestOptions,
): Promise<SafeRequestResult<T>> {
  const timeout = opts?.timeout ?? 30_000;

  // Apply any cached healing first
  let { method: resolvedMethod, params: resolvedParams } = opts?.raw
    ? { method, params }
    : applyHealedParams(method, params);

  // Attempt the call with timeout
  const makeCall = async (m: string, p: unknown): Promise<T> => {
    return Promise.race([
      client.request<T>(m, p),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout (${timeout}ms): ${m}`)), timeout),
      ),
    ]);
  };

  try {
    const data = await makeCall(resolvedMethod, resolvedParams);
    return {
      ok: true,
      data,
      method: resolvedMethod,
      healed: resolvedMethod !== method,
    };
  } catch (err) {
    const errorMsg = String(err instanceof Error ? err.message : err);

    // If raw mode, no self-healing
    if (opts?.raw) {
      return { ok: false, error: errorMsg, method };
    }

    // Try self-healing
    const healed = attemptHealing(resolvedMethod, resolvedParams, errorMsg);
    if (healed) {
      try {
        const data = await makeCall(healed.method, healed.params);

        // Cache the successful healing
        healingCache.set(method, {
          resolvedMethod: healed.method,
          fieldRenames: healed.renames,
          ts: Date.now(),
        });
        persistHealingCache();

        return { ok: true, data, method: healed.method, healed: true };
      } catch (retryErr) {
        const retryMsg = String(retryErr instanceof Error ? retryErr.message : retryErr);
        return { ok: false, error: retryMsg, method: healed.method, healed: true };
      }
    }

    // Try explicit fallbacks from options
    if (opts?.fallbacks) {
      for (const fb of opts.fallbacks) {
        try {
          const data = await makeCall(fb, resolvedParams);
          healingCache.set(method, {
            resolvedMethod: fb,
            fieldRenames: {},
            ts: Date.now(),
          });
          persistHealingCache();
          return { ok: true, data, method: fb, healed: true };
        } catch {
          continue;
        }
      }
    }

    return { ok: false, error: errorMsg, method: resolvedMethod };
  }
}

/**
 * Clear the healing cache (useful on reconnect or version change).
 */
export function clearHealingCache(): void {
  healingCache.clear();
  try {
    sessionStorage.removeItem("godmode:healing-cache");
  } catch {
    // Non-fatal
  }
}

/**
 * Get current healing cache entries (for diagnostics).
 */
export function getHealingEntries(): Record<string, HealingEntry> {
  const obj: Record<string, HealingEntry> = {};
  for (const [key, entry] of healingCache) {
    obj[key] = entry;
  }
  return obj;
}
