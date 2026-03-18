/**
 * memory.ts — LEGACY stub. Mem0 has been replaced by Honcho (src/services/honcho-client.ts).
 *
 * This file exports stub functions so that dynamic-import callers
 * (self-heal, agent-toolkit-server, before-prompt-build, lifecycle-hooks,
 * consciousness-heartbeat, system-update) don't crash.
 *
 * All real memory operations now go through honcho-client.ts.
 * This file can be fully removed once all callers are migrated.
 */

// ── Stub exports — always return "offline" / empty / no-op ──────────

export async function initMemory(): Promise<void> {
  // no-op — Honcho is initialized in gateway-start via honcho-client.ts
}

export function isMemoryReady(): boolean {
  return false;
}

export type MemoryStatus = "ready" | "degraded" | "offline";

export function getMemoryStatus(): MemoryStatus {
  return "offline";
}

export function resetSearchCircuitBreaker(): void {
  // no-op
}

export interface MemoryResult {
  memory: string;
  score?: number;
}

export async function searchMemories(
  _query: string,
  _userId: string,
  _limit = 10,
): Promise<MemoryResult[]> {
  return [];
}

export function formatMemoriesForContext(_memories: MemoryResult[]): string {
  return "";
}

export async function ingestConversation(
  _content: string,
  _userId: string,
): Promise<void> {
  // no-op — ingestion handled by Honcho
}

export async function processRetryQueue(): Promise<number> {
  return 0;
}

export async function getMemoryStats(_userId: string): Promise<{ count: number } | null> {
  return null;
}

export async function seedFromVault(_userId: string): Promise<void> {
  // no-op — Honcho handles its own seeding
}
