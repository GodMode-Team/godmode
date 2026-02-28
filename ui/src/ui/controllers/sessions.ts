import { toNumber } from "../format";
import type { GatewayBrowserClient } from "../gateway";
import type { ArchivedSessionEntry, SessionsListResult } from "../types";

/**
 * Persistent cache of auto-generated titles.
 * Survives sessionsResult overwrites from loadSessions race conditions.
 * Both app-gateway (writer) and this module (reader) use this shared cache.
 */
export const autoTitleCache = new Map<string, string>();

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
          // If API returned a displayName, use it
          if (s.displayName) {
            return s;
          }
          // Check auto-title cache first (most reliable source)
          const cachedTitle = autoTitleCache.get(s.key);
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
    const result = await state.client.request("sessions.patch", params);
    // Return the canonical key from the server response immediately
    // Don't reload all sessions yet to avoid race condition overwriting the change
    const canonicalKey = result?.key ?? key;
    return { ok: true, canonicalKey };
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
