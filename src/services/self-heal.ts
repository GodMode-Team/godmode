/**
 * self-heal.ts — Auto-repair pipeline for GodMode subsystems.
 *
 * Runs inside the consciousness heartbeat tick. Each subsystem gets:
 *   1. A health check (fast, no side effects)
 *   2. An auto-repair attempt if unhealthy
 *   3. A status entry in the registry (queryable via RPC)
 *
 * Philosophy: detect → repair → log. Never crash. Never block.
 * If repair fails twice, surface it to the user via broadcast.
 */

import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { DATA_DIR } from "../data-paths.js";
import { health } from "../lib/health-ledger.js";

// ── Types ────────────────────────────────────────────────────────────

export type SubsystemId =
  | "memory"
  | "identity-graph"
  | "identity-cache"
  | "queue-processor"
  | "heartbeat"
  | "api-keys"
  | "oauth-token";

export type HealthState = "healthy" | "degraded" | "offline" | "repaired";

export interface SubsystemStatus {
  id: SubsystemId;
  state: HealthState;
  message: string;
  lastCheck: number;
  lastRepair: number | null;
  repairCount: number;
  /** Number of consecutive failures (resets on healthy check) */
  consecutiveFailures: number;
}

// ── Status Registry (in-memory, queryable via RPC) ───────────────────

const registry = new Map<SubsystemId, SubsystemStatus>();

function getOrCreate(id: SubsystemId): SubsystemStatus {
  let entry = registry.get(id);
  if (!entry) {
    entry = {
      id,
      state: "offline",
      message: "Not yet checked",
      lastCheck: 0,
      lastRepair: null,
      repairCount: 0,
      consecutiveFailures: 0,
    };
    registry.set(id, entry);
  }
  return entry;
}

function markHealthy(id: SubsystemId, message: string): void {
  const s = getOrCreate(id);
  s.state = "healthy";
  s.message = message;
  s.lastCheck = Date.now();
  s.consecutiveFailures = 0;
}

function markDegraded(id: SubsystemId, message: string): void {
  const s = getOrCreate(id);
  s.state = "degraded";
  s.message = message;
  s.lastCheck = Date.now();
  s.consecutiveFailures++;
}

function markOffline(id: SubsystemId, message: string): void {
  const s = getOrCreate(id);
  s.state = "offline";
  s.message = message;
  s.lastCheck = Date.now();
  s.consecutiveFailures++;
}

function markRepaired(id: SubsystemId, message: string): void {
  const s = getOrCreate(id);
  s.state = "repaired";
  s.message = message;
  s.lastCheck = Date.now();
  s.lastRepair = Date.now();
  s.repairCount++;
  s.consecutiveFailures = 0;
}

// ── Public API ───────────────────────────────────────────────────────

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};
type BroadcastFn = (event: string, payload: unknown) => void;

/**
 * Run all health checks and auto-repairs. Called from heartbeat tick.
 * Returns a summary of what was checked and what was repaired.
 */
export async function runSelfHeal(
  logger: Logger,
  broadcast?: BroadcastFn,
): Promise<{ checked: number; repaired: number; failures: string[] }> {
  const repairs: string[] = [];
  const failures: string[] = [];
  let checked = 0;

  // 1. OAuth token freshness
  checked++;
  try {
    await checkAndRepairOAuth(logger);
    if (getOrCreate("oauth-token").state === "repaired") {
      repairs.push("Refreshed stale OAuth token");
    }
  } catch (err) {
    logger.warn(`[SelfHeal] OAuth check error: ${String(err)}`);
  }

  // 2. API keys availability
  checked++;
  try {
    checkApiKeys(logger);
  } catch (err) {
    logger.warn(`[SelfHeal] API key check error: ${String(err)}`);
  }

  // 3. Memory (Mem0)
  checked++;
  try {
    await checkAndRepairMemory(logger);
    if (getOrCreate("memory").state === "repaired") {
      repairs.push("Re-initialized Mem0 memory");
    }
  } catch (err) {
    logger.warn(`[SelfHeal] Memory check error: ${String(err)}`);
  }

  // 4. Identity graph
  checked++;
  try {
    checkAndRepairIdentityGraph(logger);
    if (getOrCreate("identity-graph").state === "repaired") {
      repairs.push("Re-initialized identity graph");
    }
  } catch (err) {
    logger.warn(`[SelfHeal] Identity graph check error: ${String(err)}`);
  }

  // 5. Identity cache staleness
  checked++;
  try {
    await checkIdentityCache(logger);
    if (getOrCreate("identity-cache").state === "repaired") {
      repairs.push("Invalidated stale identity cache");
    }
  } catch (err) {
    logger.warn(`[SelfHeal] Identity cache check error: ${String(err)}`);
  }

  // 6. Queue processor
  checked++;
  try {
    await checkAndRepairQueueProcessor(logger);
    if (getOrCreate("queue-processor").state === "repaired") {
      repairs.push("Restarted queue processor");
    }
  } catch (err) {
    logger.warn(`[SelfHeal] Queue processor check error: ${String(err)}`);
  }

  // Collect failures for surfacing
  for (const [, status] of registry) {
    if (status.consecutiveFailures >= 2 && status.state !== "healthy" && status.state !== "repaired") {
      failures.push(`${status.id}: ${status.message}`);
    }
  }

  // Surface persistent failures to user via broadcast
  if (failures.length > 0 && broadcast) {
    broadcast("ally:notification", {
      type: "health-alert",
      summary: `GodMode self-heal: ${failures.length} subsystem(s) need attention`,
      details: failures,
      repairs: repairs.length > 0 ? repairs : undefined,
    });
  }

  if (repairs.length > 0) {
    logger.info(`[SelfHeal] Auto-repaired ${repairs.length} subsystem(s): ${repairs.join(", ")}`);
  }

  return { checked, repaired: repairs.length, failures };
}

/**
 * Get the full health report. Called by RPC handler.
 */
export function getHealthReport(): HealthReport {
  const subsystems = Array.from(registry.values());
  const overall: HealthState = subsystems.every((s) => s.state === "healthy" || s.state === "repaired")
    ? "healthy"
    : subsystems.some((s) => s.state === "offline")
      ? "offline"
      : "degraded";

  const lastRepair = subsystems
    .filter((s) => s.lastRepair)
    .sort((a, b) => (b.lastRepair ?? 0) - (a.lastRepair ?? 0))[0];

  // Include the signal ledger for operation-level visibility
  const ledger = health.snapshot();

  return {
    ts: Date.now(),
    overall,
    subsystems,
    lastRepairSummary: lastRepair ? `${lastRepair.id}: ${lastRepair.message}` : null,
    ledger,
  };
}

/** Extended HealthReport with signal ledger */
export interface HealthReport {
  ts: number;
  overall: HealthState;
  subsystems: SubsystemStatus[];
  lastRepairSummary: string | null;
  ledger?: import("../lib/health-ledger.js").LedgerSnapshot;
}

// ── Individual Checks ────────────────────────────────────────────────

/**
 * Check OAuth token freshness. If the token is expired or expiring soon,
 * attempt to refresh it from Claude Code credentials.
 */
async function checkAndRepairOAuth(logger: Logger): Promise<void> {
  const id: SubsystemId = "oauth-token";
  try {
    const credsPath = join(homedir(), ".claude", ".credentials.json");
    if (!existsSync(credsPath)) {
      markDegraded(id, "No Claude Code credentials file found");
      return;
    }

    const creds = JSON.parse(await readFile(credsPath, "utf-8"));
    const oauth = creds?.claudeAiOauth;
    if (!oauth?.accessToken) {
      markDegraded(id, "No OAuth access token in credentials");
      return;
    }

    // Check if token has an expiry we can read
    if (oauth.expiresAt) {
      const expiresAt = typeof oauth.expiresAt === "number" ? oauth.expiresAt : Date.parse(oauth.expiresAt);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (expiresAt < now) {
        // Token expired — try refresh
        if (oauth.refreshToken) {
          logger.info("[SelfHeal] OAuth token expired, attempting refresh...");
          const refreshed = await refreshOAuthToken(oauth.refreshToken, credsPath, logger);
          if (refreshed) {
            // Update process.env so Mem0 and other services pick it up
            process.env.ANTHROPIC_API_KEY = refreshed;
            markRepaired(id, "Refreshed expired OAuth token");
            return;
          }
        }
        markOffline(id, "OAuth token expired and refresh failed");
        return;
      }

      if (expiresAt - now < fiveMinutes) {
        // Expiring soon — proactive refresh
        if (oauth.refreshToken) {
          logger.info("[SelfHeal] OAuth token expiring soon, proactive refresh...");
          const refreshed = await refreshOAuthToken(oauth.refreshToken, credsPath, logger);
          if (refreshed) {
            process.env.ANTHROPIC_API_KEY = refreshed;
            markRepaired(id, "Proactively refreshed OAuth token");
            return;
          }
        }
        markDegraded(id, "OAuth token expiring soon, refresh failed");
        return;
      }
    }

    markHealthy(id, "OAuth token valid");
  } catch (err) {
    markDegraded(id, `OAuth check failed: ${String(err).slice(0, 80)}`);
  }
}

/**
 * Attempt to refresh an OAuth token using the refresh token.
 * Returns the new access token on success, null on failure.
 */
async function refreshOAuthToken(
  refreshToken: string,
  credsPath: string,
  logger: Logger,
): Promise<string | null> {
  try {
    // Claude Code OAuth uses Anthropic's token endpoint
    const resp = await fetch("https://console.anthropic.com/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        // Client ID for Claude Code
        client_id: "9d1c250a-e61b-44e4-8ed0-2de2c8e0ed33",
      }),
    });

    if (!resp.ok) {
      logger.warn(`[SelfHeal] OAuth refresh failed: ${resp.status} ${resp.statusText}`);
      return null;
    }

    const data = (await resp.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!data.access_token) {
      logger.warn("[SelfHeal] OAuth refresh returned no access token");
      return null;
    }

    // Update credentials file
    const { writeFile } = await import("node:fs/promises");
    const creds = JSON.parse(await readFile(credsPath, "utf-8"));
    creds.claudeAiOauth = {
      ...creds.claudeAiOauth,
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
      ...(data.refresh_token ? { refreshToken: data.refresh_token } : {}),
    };
    await writeFile(credsPath, JSON.stringify(creds, null, 2), "utf-8");

    logger.info("[SelfHeal] OAuth token refreshed successfully");
    return data.access_token;
  } catch (err) {
    logger.warn(`[SelfHeal] OAuth refresh error: ${String(err)}`);
    return null;
  }
}

/**
 * Check that required API keys are present in process.env.
 */
function checkApiKeys(logger: Logger): void {
  const id: SubsystemId = "api-keys";
  const keys: Array<{ name: string; envVars: string[]; required: boolean }> = [
    { name: "Anthropic", envVars: ["ANTHROPIC_API_KEY"], required: true },
    { name: "Embeddings", envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY"], required: true },
  ];

  const missing: string[] = [];
  for (const key of keys) {
    const hasKey = key.envVars.some((v) => !!process.env[v]);
    if (!hasKey && key.required) {
      missing.push(key.name);
    }
  }

  if (missing.length > 0) {
    markDegraded(id, `Missing API keys: ${missing.join(", ")}`);
  } else {
    markHealthy(id, "All required API keys present");
  }
}

/**
 * Check Mem0 memory status. If offline and keys are now available, re-init.
 */
async function checkAndRepairMemory(logger: Logger): Promise<void> {
  const id: SubsystemId = "memory";
  try {
    const { isMemoryReady, getMemoryStatus, initMemory } = await import("../lib/memory.js");
    const status = getMemoryStatus();

    if (status === "ready") {
      // Don't just trust the flag — run a lightweight canary on every Nth check
      const memStats = health.stats("memory.search");
      const shouldVerify = !memStats || memStats.totalCalls % 20 === 0 || memStats.consecutiveFailures > 0;
      if (shouldVerify) {
        const verified = await verifyMemory(logger);
        if (verified) {
          markHealthy(id, "Mem0 operational (canary passed)");
        } else {
          markDegraded(id, "Mem0 reports ready but canary test failed");
          health.signal("memory.canary", false, { error: "search returned empty for known fact" });
        }
      } else {
        markHealthy(id, "Mem0 operational");
      }
      return;
    }

    if (status === "degraded") {
      // Last search failed but Mem0 is initialized — might recover on its own
      markDegraded(id, "Mem0 initialized but last search failed");
      return;
    }

    // Status is "offline" — attempt re-init if we have keys now
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const hasEmbeddingKey = !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_API_KEY || !!process.env.OPENAI_API_KEY;

    if (hasAnthropicKey && hasEmbeddingKey) {
      logger.info("[SelfHeal] Mem0 offline but keys available — attempting re-init...");
      // Reset the init promise so initMemory() actually retries
      // (memory.ts sets initPromise = null on failure, so this should work)
      await initMemory();

      if (isMemoryReady()) {
        // VERIFY: Run canary test — ingest a fact and search for it
        const verified = await verifyMemory(logger);
        if (verified) {
          markRepaired(id, "Re-initialized and verified Mem0 (canary passed)");
          health.signal("memory.repair", true);
        } else {
          markDegraded(id, "Re-initialized but canary test failed — ingestion may be broken");
          health.signal("memory.repair", false, { error: "canary failed" });
        }
        // Trigger vault seeding if needed
        try {
          const { seedFromVault } = await import("../lib/memory.js");
          void seedFromVault("caleb");
        } catch { /* non-fatal */ }
      } else {
        markOffline(id, "Re-init attempted but Mem0 still not ready");
      }
    } else {
      markOffline(id, `Mem0 offline — missing: ${!hasAnthropicKey ? "Anthropic key" : ""}${!hasEmbeddingKey ? " Embedding key" : ""}`.trim());
    }
  } catch (err) {
    markOffline(id, `Memory check failed: ${String(err).slice(0, 80)}`);
  }
}

/**
 * Check identity graph. If DB is missing or not initialized, re-init.
 */
async function checkAndRepairIdentityGraph(logger: Logger): Promise<void> {
  const id: SubsystemId = "identity-graph";
  try {
    const { isGraphReady, initIdentityGraph } = await import("../lib/identity-graph.js");

    if (isGraphReady()) {
      markHealthy(id, "Identity graph operational");
      return;
    }

    // Try re-init
    logger.info("[SelfHeal] Identity graph not ready — attempting re-init...");
    initIdentityGraph();

    if (isGraphReady()) {
      markRepaired(id, "Re-initialized identity graph");
    } else {
      markOffline(id, "Identity graph init failed");
    }
  } catch (err) {
    // Dynamic import may fail if better-sqlite3 isn't available
    markOffline(id, `Identity graph unavailable: ${String(err).slice(0, 80)}`);
  }
}

/**
 * Check if the identity cache (USER.md) is stale. If the file changed
 * since last cache, invalidate it so the next turn gets fresh data.
 */
let lastUserMdMtime = 0;

async function checkIdentityCache(logger: Logger): Promise<void> {
  const id: SubsystemId = "identity-cache";
  try {
    // Check if USER.md has been modified
    const userMdPath = join(DATA_DIR, "..", "USER.md");
    if (!existsSync(userMdPath)) {
      markDegraded(id, "USER.md not found");
      return;
    }

    const stat = statSync(userMdPath);
    const mtime = stat.mtimeMs;

    if (lastUserMdMtime > 0 && mtime > lastUserMdMtime) {
      // File changed — invalidate the cache
      logger.info("[SelfHeal] USER.md changed — invalidating identity cache");
      try {
        const { invalidateIdentityCache } = await import("../lib/context-budget.js");
        invalidateIdentityCache();
        markRepaired(id, "Invalidated stale identity cache after USER.md change");
      } catch {
        markDegraded(id, "USER.md changed but cache invalidation failed");
      }
    } else {
      markHealthy(id, "Identity cache in sync");
    }

    lastUserMdMtime = mtime;
  } catch (err) {
    markDegraded(id, `Identity cache check failed: ${String(err).slice(0, 80)}`);
  }
}

/**
 * Check queue processor is alive. If it stopped, restart polling.
 */
async function checkAndRepairQueueProcessor(logger: Logger): Promise<void> {
  const id: SubsystemId = "queue-processor";
  try {
    const { getQueueProcessor } = await import("./queue-processor.js");
    const processor = getQueueProcessor();

    if (!processor) {
      markOffline(id, "Queue processor not initialized");
      return;
    }

    // Check if polling is active
    if (processor.isPolling?.()) {
      markHealthy(id, "Queue processor polling");
      return;
    }

    // Not polling — try to restart
    logger.info("[SelfHeal] Queue processor not polling — restarting...");
    processor.startPolling();

    if (processor.isPolling?.()) {
      markRepaired(id, "Restarted queue processor polling");
    } else {
      markDegraded(id, "Queue processor restart failed");
    }
  } catch (err) {
    markDegraded(id, `Queue processor check failed: ${String(err).slice(0, 80)}`);
  }
}

// ── VERIFY Phase — Canary Tests ──────────────────────────────────────

/**
 * Memory canary: ingest a known fact, search for it, verify retrieval.
 * This is the only way to know memory actually works end-to-end.
 * Returns true if the round-trip succeeds.
 */
async function verifyMemory(logger: Logger): Promise<boolean> {
  try {
    const { searchMemories, ingestConversation, isMemoryReady } = await import("../lib/memory.js");
    if (!isMemoryReady()) return false;

    const canaryFact = `GodMode canary test fact: system verification at ${new Date().toISOString().slice(0, 13)}`;
    const canaryQuery = "GodMode canary test fact";

    // Ingest
    await ingestConversation(canaryFact, "caleb");

    // Wait briefly for async processing
    await new Promise((r) => setTimeout(r, 2000));

    // Search
    const results = await searchMemories(canaryQuery, "caleb", 3);
    const found = results.some((r) =>
      r.memory.toLowerCase().includes("canary") || r.memory.toLowerCase().includes("verification"),
    );

    if (found) {
      health.signal("memory.canary", true, { results: results.length });
      return true;
    }

    // Canary not found — but check if search works at all
    // (the canary might not have been ingested yet due to async processing)
    const anyResults = results.length > 0;
    if (anyResults) {
      // Search works, just didn't find canary — likely async delay, not broken
      health.signal("memory.canary", true, { results: results.length, note: "canary not found but search functional" });
      return true;
    }

    health.signal("memory.canary", false, { error: "no results returned" });
    logger.warn("[SelfHeal] Memory canary failed — search returned 0 results");
    return false;
  } catch (err) {
    health.signal("memory.canary", false, { error: String(err).slice(0, 100) });
    logger.warn(`[SelfHeal] Memory canary error: ${String(err)}`);
    return false;
  }
}

// ── Escalation Chain ─────────────────────────────────────────────────

/**
 * Build an escalation context string for the ally to inject when
 * subsystems are degraded. This goes into before_prompt_build so
 * the ally knows to warn the user instead of pretending everything works.
 *
 * Returns null if everything is healthy.
 */
export function getEscalationContext(): string | null {
  const alerts: string[] = [];

  for (const [, status] of registry) {
    if (status.state === "offline" && status.consecutiveFailures >= 3) {
      alerts.push(`[OFFLINE] ${status.id}: ${status.message}`);
    } else if (status.state === "degraded" && status.consecutiveFailures >= 2) {
      alerts.push(`[DEGRADED] ${status.id}: ${status.message}`);
    }
  }

  // Also check the signal ledger for operation-level alerts
  const ledger = health.snapshot();
  for (const alert of ledger.alerts) {
    if (!alerts.some((a) => a.includes(alert.split(":")[0]))) {
      alerts.push(`[ALERT] ${alert}`);
    }
  }

  if (alerts.length === 0) return null;

  return [
    "## System Health Warnings",
    "The following subsystems have issues. Be transparent with the user about what's working and what isn't.",
    "Do NOT pretend capabilities work when they're degraded.",
    ...alerts.map((a) => `- ${a}`),
  ].join("\n");
}

/**
 * Check for and kill orphaned agent processes (zombie PIDs from before restart).
 * Returns count of killed processes.
 */
export async function cleanOrphanedAgents(logger: Logger): Promise<number> {
  try {
    const { readQueueState, updateQueueState } = await import("../lib/queue-state.js");
    const state = await readQueueState();
    let cleaned = 0;

    const processing = state.items.filter((i) => i.status === "processing" && (i as any).pid);

    for (const item of processing) {
      const pid = (item as any).pid as number;
      try {
        // Check if process is alive (signal 0 = check only)
        process.kill(pid, 0);
        // Process is alive — leave it
      } catch {
        // Process is dead — mark item as failed for retry
        logger.warn(`[SelfHeal] Orphaned agent PID ${pid} for "${item.title}" — marking for retry`);
        await updateQueueState((s) => {
          const qi = s.items.find((i) => i.id === item.id);
          if (qi && qi.status === "processing") {
            qi.status = "pending";
            (qi as any).pid = undefined;
            (qi as any).retryCount = ((qi as any).retryCount ?? 0) + 1;
          }
        });
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info(`[SelfHeal] Cleaned ${cleaned} orphaned agent(s) — re-queued for processing`);
    }

    return cleaned;
  } catch {
    return 0;
  }
}
