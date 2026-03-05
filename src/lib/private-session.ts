/**
 * private-session.ts — Private session management.
 *
 * Private sessions prevent memory capture: no vault writes, no awareness
 * snapshot inclusion, no session archiving, no brief inclusion.
 * Private session data auto-expires after 24 hours.
 *
 * Safety gates and tools still work normally in private mode.
 */

import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile, mkdir, rm, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────────

type PrivateSessionEntry = {
  sessionKey: string;
  enabledAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (24h from enabledAt)
};

type PrivateSessionState = {
  version: 1;
  sessions: PrivateSessionEntry[];
};

// ── Constants ──────────────────────────────────────────────────────────

const STATE_FILE = join(DATA_DIR, "private-sessions.json");
const PRIVATE_DATA_DIR = join(DATA_DIR, "private-sessions");
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── In-memory cache (avoid disk reads on every turn) ───────────────────

let cachedState: PrivateSessionState | null = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 10_000; // refresh from disk every 10s

// ── State management ───────────────────────────────────────────────────

async function loadState(): Promise<PrivateSessionState> {
  const now = Date.now();
  if (cachedState && now - cacheLoadedAt < CACHE_TTL_MS) {
    return cachedState;
  }
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    cachedState = JSON.parse(raw) as PrivateSessionState;
  } catch {
    cachedState = { version: 1, sessions: [] };
  }
  cacheLoadedAt = now;
  return cachedState;
}

async function saveState(state: PrivateSessionState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });
  cachedState = state;
  cacheLoadedAt = Date.now();
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Check if a session is currently in private mode.
 * Fast path: in-memory cache avoids disk reads on hot paths.
 */
export async function isPrivateSession(sessionKey: string): Promise<boolean> {
  const state = await loadState();
  const now = new Date().toISOString();
  return state.sessions.some(
    (s) => s.sessionKey === sessionKey && s.expiresAt > now,
  );
}

/**
 * Toggle private mode for a session.
 * Returns the new state (true = private, false = normal).
 */
export async function setSessionPrivate(
  sessionKey: string,
  enabled: boolean,
): Promise<{ private: boolean; expiresAt: string | null }> {
  const state = await loadState();

  // Remove existing entry for this session
  state.sessions = state.sessions.filter((s) => s.sessionKey !== sessionKey);

  if (enabled) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + TTL_MS).toISOString();
    state.sessions.push({
      sessionKey,
      enabledAt: now.toISOString(),
      expiresAt,
    });
    // Create private data directory
    await mkdir(PRIVATE_DATA_DIR, { recursive: true, mode: 0o700 });
    await saveState(state);
    return { private: true, expiresAt };
  }

  await saveState(state);
  return { private: false, expiresAt: null };
}

/**
 * Get private session status for a session key.
 */
export async function getPrivateStatus(
  sessionKey: string,
): Promise<{ private: boolean; expiresAt: string | null }> {
  const state = await loadState();
  const now = new Date().toISOString();
  const entry = state.sessions.find(
    (s) => s.sessionKey === sessionKey && s.expiresAt > now,
  );
  return entry
    ? { private: true, expiresAt: entry.expiresAt }
    : { private: false, expiresAt: null };
}

/**
 * Clean up expired private session data.
 * Called during consciousness heartbeat tick.
 * Removes entries older than 24h and deletes their data directories.
 */
export async function cleanupExpiredPrivateSessions(): Promise<number> {
  const state = await loadState();
  const now = new Date().toISOString();

  const expired = state.sessions.filter((s) => s.expiresAt <= now);
  if (expired.length === 0) return 0;

  state.sessions = state.sessions.filter((s) => s.expiresAt > now);
  await saveState(state);

  // Clean up private data directory if empty
  if (existsSync(PRIVATE_DATA_DIR)) {
    try {
      const entries = await readdir(PRIVATE_DATA_DIR);
      // Remove files older than TTL
      for (const entry of entries) {
        const fullPath = join(PRIVATE_DATA_DIR, entry);
        try {
          const s = await stat(fullPath);
          if (Date.now() - s.mtimeMs > TTL_MS) {
            await rm(fullPath, { recursive: true, force: true });
          }
        } catch {
          // skip unreadable
        }
      }
    } catch {
      // directory doesn't exist or is unreadable
    }
  }

  return expired.length;
}
