import { toNumber } from "../format";
import type { GatewayBrowserClient } from "../gateway";
import type { ArchivedSessionEntry, SessionsListResult } from "../types";

/**
 * Persistent cache of auto-generated titles.
 * Backed by localStorage so titles survive page refreshes.
 * Both app-gateway (writer) and this module (reader) use this shared cache.
 */
const TITLE_CACHE_KEY = "godmode:autoTitleCache";

function loadTitleCache(): Map<string, string> {
  try {
    const raw = localStorage.getItem(TITLE_CACHE_KEY);
    if (raw) {
      const entries: [string, string][] = JSON.parse(raw);
      return new Map(entries);
    }
  } catch { /* ignore corrupt data */ }
  return new Map();
}

function saveTitleCache(map: Map<string, string>) {
  try {
    // Cap at 200 entries to avoid unbounded localStorage growth
    const entries = [...map.entries()];
    const trimmed = entries.length > 200 ? entries.slice(-200) : entries;
    localStorage.setItem(TITLE_CACHE_KEY, JSON.stringify(trimmed));
  } catch { /* localStorage full or unavailable */ }
}

/** Map wrapper that auto-persists to localStorage on writes. */
class PersistentTitleCache extends Map<string, string> {
  set(key: string, value: string): this {
    super.set(key, value);
    saveTitleCache(this);
    return this;
  }
  delete(key: string): boolean {
    const result = super.delete(key);
    if (result) saveTitleCache(this);
    return result;
  }
  clear(): void {
    super.clear();
    saveTitleCache(this);
  }
}

export const autoTitleCache: Map<string, string> = new PersistentTitleCache(loadTitleCache());

export type SessionsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  sessionsLoading: boolean;
  sessionsResult: SessionsListResult | null;
  sessionsError: string | null;
  sessionsFilterActive: string;
  sessionsFilterLimit: string;
  sessionsIncludeGlobal: boolean;
  sessionsIncludeUnknown: boolean;
  archivedSessions: ArchivedSessionEntry[];
  archivedSessionsLoading: boolean;
  archivedSessionsExpanded: boolean;
};

export async function loadSessions(
  state: SessionsState,
  overrides?: {
    activeMinutes?: number;
    limit?: number;
    includeGlobal?: boolean;
    includeUnknown?: boolean;
  },
) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.sessionsLoading) {
    return;
  }
  state.sessionsLoading = true;
  state.sessionsError = null;
  try {
    const includeGlobal = overrides?.includeGlobal ?? state.sessionsIncludeGlobal;
    const includeUnknown = overrides?.includeUnknown ?? state.sessionsIncludeUnknown;
    const activeMinutes = overrides?.activeMinutes ?? toNumber(state.sessionsFilterActive, 0);
    const limit = overrides?.limit ?? toNumber(state.sessionsFilterLimit, 50);
    const params: Record<string, unknown> = {
      includeGlobal,
      includeUnknown,
    };
    if (activeMinutes > 0) {
      params.activeMinutes = activeMinutes;
    }
    if (limit > 0) {
      params.limit = limit;
    }
    const res = await state.client.request("sessions.list", params);
    if (res) {
      // Preserve displayName values from auto-title cache and local state.
      // The autoTitleCache is the authoritative source for auto-generated titles
      // and survives any sessionsResult overwrites.
      if (res.sessions) {
        const existingDisplayNames = new Map<string, string>();
        if (state.sessionsResult?.sessions) {
          for (const s of state.sessionsResult.sessions) {
            if (s.displayName) {
              existingDisplayNames.set(s.key, s.displayName);
            }
          }
        }

        res.sessions = res.sessions.map((s) => {
          // If API returned a label or displayName, use it
          if (s.label || s.displayName) {
            return s;
          }
          // Check auto-title cache first (most reliable source).
          // Try exact match, then fuzzy suffix match (gateway keys may differ
          // from server keys, e.g. "agent:main:webchat-X" vs "webchat-X").
          let cachedTitle = autoTitleCache.get(s.key);
          if (!cachedTitle) {
            const suffix = s.key.split(":").pop();
            if (suffix && suffix.length >= 4) {
              for (const [k, v] of autoTitleCache) {
                if (k === s.key || k.endsWith(`:${suffix}`) || s.key.endsWith(`:${k.split(":").pop()}`)) {
                  cachedTitle = v;
                  break;
                }
              }
            }
          }
          if (cachedTitle) {
            return { ...s, displayName: cachedTitle };
          }
          // Fall back to existing local value
          const localName = existingDisplayNames.get(s.key);
          if (localName) {
            return { ...s, displayName: localName };
          }
          return s;
        });
      }

      state.sessionsResult = res;
    }
  } catch (err) {
    state.sessionsError = String(err);
  } finally {
    state.sessionsLoading = false;
  }
}

export type PatchSessionResult = { ok: true; canonicalKey: string } | { ok: false };

export async function patchSession(
  state: SessionsState,
  key: string,
  patch: {
    label?: string | null;
    displayName?: string | null;
    thinkingLevel?: string | null;
    verboseLevel?: string | null;
    reasoningLevel?: string | null;
  },
): Promise<PatchSessionResult> {
  if (!state.client || !state.connected) {
    return { ok: false };
  }
  const params: Record<string, unknown> = { key };
  if ("label" in patch) {
    params.label = patch.label;
  }
  if ("displayName" in patch) {
    params.displayName = patch.displayName;
  }
  if ("thinkingLevel" in patch) {
    params.thinkingLevel = patch.thinkingLevel;
  }
  if ("verboseLevel" in patch) {
    params.verboseLevel = patch.verboseLevel;
  }
  if ("reasoningLevel" in patch) {
    params.reasoningLevel = patch.reasoningLevel;
  }
  try {
    const { safeRequest } = await import("../../lib/safe-request.js");
    const res = await safeRequest<Record<string, unknown>>(state.client, "sessions.patch", params);
    if (res.ok) {
      const canonicalKey = (res.data?.key as string) ?? key;
      return { ok: true, canonicalKey };
    }
    state.sessionsError = res.error;
    return { ok: false };
  } catch (err) {
    state.sessionsError = String(err);
    return { ok: false };
  }
}

export async function deleteSession(state: SessionsState, key: string) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.sessionsLoading) {
    return;
  }
  const confirmed = window.confirm(
    `Delete session "${key}"?\n\nDeletes the session entry and archives its transcript.`,
  );
  if (!confirmed) {
    return;
  }
  state.sessionsLoading = true;
  state.sessionsError = null;
  try {
    await state.client.request("sessions.delete", { key, deleteTranscript: true });
    await loadSessions(state);
  } catch (err) {
    state.sessionsError = String(err);
  } finally {
    state.sessionsLoading = false;
  }
}

// ── Archive operations ──────────────────────────────────────────────

export async function loadArchivedSessions(state: SessionsState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  state.archivedSessionsLoading = true;
  try {
    const res = await state.client.request("sessions.archived", {});
    if (res?.archived) {
      state.archivedSessions = res.archived as ArchivedSessionEntry[];
    }
  } catch {
    // Non-fatal; archived list is supplementary
  } finally {
    state.archivedSessionsLoading = false;
  }
}

export async function archiveSession(state: SessionsState, sessionKey: string): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    await state.client.request("sessions.archive", { sessionKey });
    // Refresh both lists so UI updates
    await loadArchivedSessions(state);
    await loadSessions(state);
  } catch (err) {
    state.sessionsError = `Archive failed: ${String(err)}`;
  }
}

export async function unarchiveSession(state: SessionsState, sessionKey: string): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    await state.client.request("sessions.unarchive", { sessionKey });
    // Refresh both lists so UI updates
    await loadArchivedSessions(state);
    await loadSessions(state);
  } catch (err) {
    state.sessionsError = `Unarchive failed: ${String(err)}`;
  }
}

export async function triggerAutoArchive(state: SessionsState): Promise<number> {
  if (!state.client || !state.connected) {
    return 0;
  }
  try {
    const res = await state.client.request("sessions.autoArchive", {});
    const count = (res?.archivedCount as number) ?? 0;
    // Refresh lists after auto-archive
    await loadArchivedSessions(state);
    await loadSessions(state);
    return count;
  } catch (err) {
    state.sessionsError = `Auto-archive failed: ${String(err)}`;
    return 0;
  }
}
