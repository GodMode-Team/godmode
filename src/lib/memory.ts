/**
 * memory.ts — Provider-routing facade for GodMode memory.
 *
 * This is the ONLY import for memory operations across the codebase.
 * Routes to the active provider (honcho or none) based on env config.
 *
 * Adding a future provider: add a new service file + new case here.
 * No other files need to change.
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Provider Detection ──────────────────────────────────────────────

export type MemoryProvider = "honcho" | "none";

/**
 * Auto-detect the active memory provider.
 * - If GODMODE_MEMORY_PROVIDER is set, use that.
 * - If HONCHO_API_KEY exists → "honcho".
 * - Otherwise → "none".
 */
export function getMemoryProvider(): MemoryProvider {
  const override = process.env.GODMODE_MEMORY_PROVIDER;
  if (override === "none") return "none";
  if (override === "honcho") return "honcho";
  if (process.env.HONCHO_API_KEY) return "honcho";
  return "none";
}

// ── Status ──────────────────────────────────────────────────────────

export type MemoryStatus = "ready" | "degraded" | "offline";

const MEMORY_SEED_SENTINEL = join(DATA_DIR, ".mem0-seeded");

export function getMemorySeedSentinelPath(): string {
  return MEMORY_SEED_SENTINEL;
}

export function isMemorySeeded(): boolean {
  return existsSync(MEMORY_SEED_SENTINEL);
}

async function writeMemorySeedSentinel(provider: MemoryProvider): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    MEMORY_SEED_SENTINEL,
    JSON.stringify({
      seededAt: new Date().toISOString(),
      provider,
    }, null, 2) + "\n",
    "utf-8",
  );
}

export function isMemoryReady(): boolean {
  if (getMemoryProvider() === "none") return false;
  // Lazy check — avoid top-level import of honcho-client
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = _honchoModule;
    return mod ? mod.isHonchoReady() : false;
  } catch {
    return false;
  }
}

export function getMemoryStatus(): MemoryStatus {
  if (getMemoryProvider() === "none") return "offline";
  try {
    const mod = _honchoModule;
    return mod ? mod.getHonchoStatus() : "offline";
  } catch {
    return "offline";
  }
}

export function getMemoryStats(): { ready: boolean; sessionCount: number } {
  if (getMemoryProvider() === "none") return { ready: false, sessionCount: 0 };
  try {
    const mod = _honchoModule;
    return mod ? mod.getStatus() : { ready: false, sessionCount: 0 };
  } catch {
    return { ready: false, sessionCount: 0 };
  }
}

// ── Init ────────────────────────────────────────────────────────────

/**
 * Initialize the memory provider. Returns true if ready.
 * Safe to call at startup — never throws.
 */
export async function initMemory(): Promise<boolean> {
  const provider = getMemoryProvider();
  if (provider === "none") return false;

  if (provider === "honcho") {
    try {
      const mod = await import("../services/honcho-client.js");
      _honchoModule = mod;
      const ready = await mod.initHoncho();
      if (ready) {
        await writeMemorySeedSentinel(provider);
      }
      return ready;
    } catch (err) {
      console.warn(`[GodMode] Memory init failed (non-fatal): ${String(err)}`);
      return false;
    }
  }

  return false;
}

// ── Message Forwarding ──────────────────────────────────────────────

/**
 * Forward a user or assistant message to the memory provider.
 * Fire-and-forget — never blocks the conversation.
 */
export async function forwardMessage(
  role: "user" | "assistant",
  content: string,
  sessionKey: string,
): Promise<void> {
  const provider = getMemoryProvider();
  if (provider === "none") return;

  if (provider === "honcho") {
    try {
      const mod = _honchoModule ?? await import("../services/honcho-client.js");
      _honchoModule = mod;
      await mod.forwardMessage(role, content, sessionKey);
    } catch {
      // Fire-and-forget — never crash
    }
  }
}

// ── Context Retrieval ───────────────────────────────────────────────

/**
 * Get the memory provider's context for the current session.
 * Returns a formatted string for context injection, or null if unavailable.
 */
export async function getContext(sessionKey: string): Promise<string | null> {
  const provider = getMemoryProvider();
  if (provider === "none") return null;

  if (provider === "honcho") {
    try {
      const mod = _honchoModule ?? await import("../services/honcho-client.js");
      _honchoModule = mod;
      return await mod.getContext(sessionKey);
    } catch {
      return null;
    }
  }

  return null;
}

// ── Peer Query ──────────────────────────────────────────────────────

/**
 * Query the memory provider's user model with a specific question.
 * Used by vault sync and skills that need deep memory recall.
 */
export async function queryPeer(
  question: string,
  sessionKey: string,
): Promise<string | null> {
  const provider = getMemoryProvider();
  if (provider === "none") return null;

  if (provider === "honcho") {
    try {
      const mod = _honchoModule ?? await import("../services/honcho-client.js");
      _honchoModule = mod;
      return await mod.queryPeer(question, sessionKey);
    } catch {
      return null;
    }
  }

  return null;
}

// ── Cached module reference (avoid repeated dynamic imports) ────────

let _honchoModule: typeof import("../services/honcho-client.js") | null = null;
