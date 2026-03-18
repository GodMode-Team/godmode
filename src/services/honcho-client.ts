/**
 * honcho-client.ts — Honcho-powered persistent user modeling for GodMode.
 *
 * Singleton client that wraps the Honcho SDK (@honcho-ai/sdk).
 * Provides: message forwarding, context retrieval, peer queries, and vault sync.
 *
 * All methods are wrapped in try/catch — Honcho being unavailable never crashes the plugin.
 */

import { Honcho, type Peer, type Session } from "@honcho-ai/sdk";

// ── Singleton State ──────────────────────────────────────────────────

let honcho: InstanceType<typeof Honcho> | null = null;
let peer: Peer | null = null;
let ready = false;

/** Map of GodMode sessionKey -> Honcho Session instance */
const sessionCache = new Map<string, Session>();
const SESSION_CACHE_MAX = 100;

// ── Init ─────────────────────────────────────────────────────────────

/**
 * Initialize the Honcho client. Non-blocking, safe to call at startup.
 * Returns true if Honcho is ready, false otherwise.
 */
export async function initHoncho(apiKey?: string): Promise<boolean> {
  const key = apiKey ?? process.env.HONCHO_API_KEY;
  if (!key) {
    console.log("[GodMode] Honcho not configured -- memory disabled");
    return false;
  }

  try {
    honcho = new Honcho({ apiKey: key });

    // Get or create a peer for the GodMode owner
    const ownerKey = process.env.GODMODE_OWNER ?? "owner";
    peer = await honcho.peer(ownerKey);

    ready = true;
    console.log("[GodMode] Honcho memory initialized");
    return true;
  } catch (err) {
    console.warn(`[GodMode] Honcho init failed (non-fatal): ${String(err)}`);
    ready = false;
    return false;
  }
}

// ── Session Management ───────────────────────────────────────────────

async function getOrCreateSession(sessionKey: string): Promise<Session | null> {
  if (!honcho) return null;

  const cached = sessionCache.get(sessionKey);
  if (cached) return cached;

  try {
    const session = await honcho.session(sessionKey);
    // Evict oldest if cache is full
    if (sessionCache.size >= SESSION_CACHE_MAX) {
      const oldest = sessionCache.keys().next().value;
      if (oldest) sessionCache.delete(oldest);
    }
    sessionCache.set(sessionKey, session);
    return session;
  } catch (err) {
    console.warn(`[GodMode] Honcho session error: ${String(err)}`);
    return null;
  }
}

// ── Message Forwarding ───────────────────────────────────────────────

/**
 * Forward a user or assistant message to Honcho for memory processing.
 * Fire-and-forget — never blocks the conversation.
 */
export async function forwardMessage(
  role: "user" | "assistant",
  content: string,
  sessionKey: string,
): Promise<void> {
  if (!ready || !honcho || !peer) return;
  if (!content || content.length < 5) return;

  try {
    const session = await getOrCreateSession(sessionKey);
    if (!session) return;

    await session.addMessages([
      {
        peerId: peer.id,
        content,
      },
    ]);
  } catch (err) {
    console.warn(`[GodMode] Honcho forwardMessage error: ${String(err)}`);
  }
}

// ── Context Retrieval ────────────────────────────────────────────────

/**
 * Get Honcho's user context for the current session.
 * Returns a formatted string for context injection, or null if unavailable.
 */
export async function getContext(sessionKey: string): Promise<string | null> {
  if (!ready || !honcho || !peer) return null;

  try {
    const session = await getOrCreateSession(sessionKey);
    if (!session) return null;

    const ctx = await session.context({ peerTarget: peer });
    const content = typeof ctx === "string" ? ctx : (ctx as any)?.content ?? String(ctx);
    if (!content || content.trim().length < 10) return null;

    return `## Memory (Honcho)\n${content}`;
  } catch (err) {
    console.warn(`[GodMode] Honcho getContext error: ${String(err)}`);
    return null;
  }
}

// ── Peer Query ───────────────────────────────────────────────────────

/**
 * Query Honcho's user model with a specific question.
 * Used by vault sync and skills that need deep memory recall.
 */
export async function queryPeer(question: string, sessionKey: string): Promise<string | null> {
  if (!ready || !honcho || !peer) return null;

  try {
    const session = await getOrCreateSession(sessionKey);
    const response = await peer.chat(question, {
      session: session ?? undefined,
    });

    return typeof response === "string" ? response : (response as any)?.content ?? String(response);
  } catch (err) {
    console.warn(`[GodMode] Honcho queryPeer error: ${String(err)}`);
    return null;
  }
}

// ── Status ───────────────────────────────────────────────────────────

export function isHonchoReady(): boolean {
  return ready;
}

export function getHonchoStatus(): "ready" | "degraded" | "offline" {
  if (ready) return "ready";
  if (honcho) return "degraded";
  return "offline";
}

export function getStatus(): { ready: boolean; sessionCount: number } {
  return {
    ready,
    sessionCount: sessionCache.size,
  };
}
