/**
 * memory.ts — Mem0-powered conversational memory for GodMode.
 *
 * Uses Mem0 OSS (local pipeline) for:
 * - Automatic fact extraction from conversations
 * - Semantic search for proactive context injection
 * - Deduplication and contradiction handling
 *
 * Storage: SQLite files in ~/godmode/data/ (zero infrastructure)
 * LLM: Anthropic Claude (same API key GodMode already uses)
 * Embeddings: OpenAI text-embedding-3-small or Google gemini-embedding-001
 *
 * All Mem0 operations are wrapped in timeouts and try/catch.
 * Memory failures are invisible to the user — the conversation never breaks.
 */

import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { health, turnErrors } from "./health-ledger.js";

// Disable Mem0 telemetry before any import
process.env.MEM0_TELEMETRY = "false";

/** Mem0 Memory instance — lazily initialized */
let memoryInstance: InstanceType<any> | null = null;
let initPromise: Promise<void> | null = null;
let initFailed = false;

/** Retry queue for failed ingestions */
const retryQueue: Array<{ messages: string; userId: string; attempts: number }> = [];
const MAX_RETRY_ATTEMPTS = 3;
const SEARCH_TIMEOUT_MS = 5_000;
const INGEST_TIMEOUT_MS = 15_000;

/** Circuit breaker for memory search — backs off after consecutive failures */
let consecutiveSearchFailures = 0;
let circuitOpenUntil = 0;
const CIRCUIT_MAX_FAILURES = 3;
const CIRCUIT_COOLDOWN_MS = 60_000; // 1 minute backoff when circuit opens

/**
 * Initialize Mem0. Called once during gateway_start.
 * Fails silently — GodMode works without memory, just less well.
 */
export async function initMemory(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = _doInit();
  return initPromise;
}

async function _doInit(): Promise<void> {
  try {
    // Dynamic import — mem0ai is an optional peer dependency.
    // If not installed, GodMode runs without enhanced memory.
    const { Memory } = await import("mem0ai/oss");

    // Determine embedding provider based on available API keys
    // Prefer Gemini (free tier, reliable) over OpenAI (paid, may hit quota)
    const hasGemini = !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    let embedder: { provider: string; config: Record<string, unknown> };
    let dimension: number;

    if (hasGemini) {
      // Mem0's GoogleEmbedder also checks process.env.GOOGLE_API_KEY internally
      if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
        process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
      }
      embedder = {
        provider: "google",
        config: {
          apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
          model: "gemini-embedding-001",
          embeddingDims: 768,
        },
      };
      dimension = 768;
      console.log("[GodMode Memory] Using Gemini embeddings (gemini-embedding-001)");
    } else if (hasOpenAI) {
      embedder = {
        provider: "openai",
        config: {
          apiKey: process.env.OPENAI_API_KEY,
          model: "text-embedding-3-small",
        },
      };
      dimension = 1536;
    } else {
      // No embedding key available — skip memory initialization
      console.warn("[GodMode Memory] No OPENAI_API_KEY or GEMINI_API_KEY found. Memory disabled.");
      initFailed = true;
      return;
    }

    // Resolve Anthropic API key — check env, Claude Code OAuth, then OpenClaw profiles
    let anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      // Claude Code OAuth credentials (fresh tokens with refresh support)
      try {
        const { readFile: rf } = await import("node:fs/promises");
        const { join: pjoin } = await import("node:path");
        const { homedir } = await import("node:os");
        const credsPath = pjoin(homedir(), ".claude", ".credentials.json");
        const creds = JSON.parse(await rf(credsPath, "utf-8"));
        const oauth = creds?.claudeAiOauth;
        if (oauth?.accessToken) {
          anthropicKey = oauth.accessToken;
          console.log("[GodMode Memory] Resolved Anthropic key from Claude Code OAuth");
        }
      } catch { /* not found */ }
    }
    if (!anthropicKey) {
      // Fallback: OpenClaw auth-profiles (may be stale)
      try {
        const { readFile: rf } = await import("node:fs/promises");
        const { join: pjoin } = await import("node:path");
        const { homedir } = await import("node:os");
        const profilesPath = pjoin(homedir(), ".openclaw", "auth-profiles.json");
        const profiles = JSON.parse(await rf(profilesPath, "utf-8"));
        const entry = profiles?.profiles?.["anthropic:oauth"]
          ?? Object.values(profiles?.profiles ?? {}).find(
            (p: any) => p?.provider === "anthropic" && p?.token,
          );
        if (entry && typeof (entry as any).token === "string") {
          anthropicKey = (entry as any).token;
          console.log("[GodMode Memory] Resolved Anthropic key from OpenClaw auth profile");
        }
      } catch {
        // Auth profiles not readable — non-fatal
      }
    }
    if (!anthropicKey) {
      console.warn("[GodMode Memory] No Anthropic API key available (env or OAuth). Memory disabled.");
      initFailed = true;
      return;
    }

    const vectorDbPath = join(DATA_DIR, "mem0-vectors.db");
    const historyDbPath = join(DATA_DIR, "mem0-history.db");

    memoryInstance = new Memory({
      version: "v1.1",
      llm: {
        provider: "anthropic",
        config: {
          apiKey: anthropicKey,
          model: "claude-haiku-4-5-20251001",
        },
      },
      embedder,
      vectorStore: {
        provider: "memory",
        config: {
          collectionName: "godmode_memories",
          dimension,
          dbPath: vectorDbPath,
        },
      },
      historyStore: {
        provider: "sqlite",
        config: { historyDbPath },
      },
      enableGraph: false,
    });

    // Patch Mem0's Anthropic LLM to force JSON output via assistant prefill.
    // Mem0 ignores the responseFormat param for Anthropic — it never sets
    // response_format or uses a prefill. Without this, the model often returns
    // conversational text instead of JSON, causing "Failed to parse facts" errors
    // that silently break all memory ingestion.
    patchMem0AnthropicLlm(memoryInstance);

    console.log("[GodMode Memory] Mem0 initialized (Anthropic + SQLite, JSON-patched)");
  } catch (err) {
    console.warn(`[GodMode Memory] Init failed (non-fatal): ${String(err)}`);
    initFailed = true;
    // Allow retry on next call — transient failures shouldn't be permanent
    initPromise = null;
  }
}

/** Check if memory is available */
export function isMemoryReady(): boolean {
  return memoryInstance !== null && !initFailed;
}

/** Memory health for context injection visibility */
export type MemoryStatus = "ready" | "degraded" | "offline";

/** Track whether the last search succeeded */
let lastSearchFailed = false;

/**
 * Get memory system status for failure visibility.
 * - "ready": Mem0 initialized and last search worked
 * - "degraded": Mem0 initialized but last search failed
 * - "offline": Mem0 never initialized (missing keys, install, etc.)
 */
export function getMemoryStatus(): MemoryStatus {
  if (!memoryInstance || initFailed) return "offline";
  if (lastSearchFailed) return "degraded";
  if (consecutiveSearchFailures >= CIRCUIT_MAX_FAILURES && Date.now() < circuitOpenUntil) return "degraded";
  return "ready";
}

/** Reset circuit breaker — called by self-heal after successful repair */
export function resetSearchCircuitBreaker(): void {
  consecutiveSearchFailures = 0;
  circuitOpenUntil = 0;
}

// ── Proactive Search ─────────────────────────────────────────────────

export interface MemoryResult {
  memory: string;
  score?: number;
}

/**
 * Search for memories relevant to the user's message.
 * Called in before_prompt_build to proactively inject context.
 *
 * Returns formatted memory lines, or empty array on failure.
 * NEVER throws — failure is invisible.
 */
export async function searchMemories(
  query: string,
  userId: string,
  limit = 10,
): Promise<MemoryResult[]> {
  if (!memoryInstance || !query || query.length < 5) return [];

  // Circuit breaker: skip search if we've failed too many times recently
  if (consecutiveSearchFailures >= CIRCUIT_MAX_FAILURES && Date.now() < circuitOpenUntil) {
    health.signal("memory.search", false, { error: "circuit-open", cooldownMs: circuitOpenUntil - Date.now() });
    return [];
  }

  const start = Date.now();
  try {
    const result: any = await withTimeout(
      memoryInstance.search(query, { userId, limit }),
      SEARCH_TIMEOUT_MS,
    );
    if (!result?.results) {
      lastSearchFailed = true;
      consecutiveSearchFailures++;
      if (consecutiveSearchFailures >= CIRCUIT_MAX_FAILURES) {
        circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
        console.warn(`[GodMode Memory] Circuit breaker open — backing off for ${CIRCUIT_COOLDOWN_MS / 1000}s`);
      }
      health.signal("memory.search", false, { error: "no results object", elapsed: Date.now() - start });
      return [];
    }

    lastSearchFailed = false;
    consecutiveSearchFailures = 0; // Reset circuit breaker on success

    // Score threshold 0.4 — proper nouns (names, places) produce lower
    // embedding similarity than semantic phrases. Previous 0.55 silently
    // dropped valid contact matches like "Ashley Robertson".
    const filtered = (result.results as any[])
      .filter((r) => r.memory && (r.score == null || r.score > 0.4))
      .map((r) => ({ memory: r.memory as string, score: r.score as number | undefined }));

    // Log dropped results so we can tune threshold
    if (process.env.GODMODE_DEBUG) {
      const dropped = (result.results as any[]).filter((r) => r.memory && r.score != null && r.score <= 0.4);
      if (dropped.length) console.log(`[GodMode Memory] Dropped ${dropped.length} low-score results (≤0.4):`, dropped.map((r: any) => ({ score: r.score, snippet: String(r.memory).slice(0, 60) })));
    }

    health.signal("memory.search", true, { results: filtered.length, topScore: filtered[0]?.score, elapsed: Date.now() - start });
    return filtered;
  } catch (err) {
    lastSearchFailed = true;
    consecutiveSearchFailures++;
    if (consecutiveSearchFailures >= CIRCUIT_MAX_FAILURES) {
      circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
      console.warn(`[GodMode Memory] Circuit breaker open — backing off for ${CIRCUIT_COOLDOWN_MS / 1000}s`);
    }
    const errMsg = String(err).slice(0, 100);
    health.signal("memory.search", false, { error: errMsg, elapsed: Date.now() - start });
    turnErrors.capture("memory.search", errMsg);
    console.warn(`[GodMode Memory] Search failed (non-fatal): ${errMsg}`);
    return [];
  }
}

/**
 * Format search results for context injection.
 * Returns a string block ready to prepend, or empty string if no results.
 */
export function formatMemoriesForContext(memories: MemoryResult[]): string {
  if (memories.length === 0) return "";

  const lines = memories
    .slice(0, 10)
    .map((m) => `- ${m.memory}`);

  return [
    "## What You Already Know",
    "These facts are from your memory. DO NOT ask the user for any of this.",
    ...lines,
  ].join("\n");
}

// ── Conversation Ingestion ───────────────────────────────────────────

/**
 * Ingest a conversation turn into Mem0 for fact extraction.
 * Runs async — NEVER blocks the response.
 * Failed ingestions are queued for retry on next heartbeat tick.
 */
export async function ingestConversation(
  content: string,
  userId: string,
): Promise<void> {
  if (!memoryInstance || !content || content.length < 10) return;

  const start = Date.now();
  try {
    await withTimeout(
      memoryInstance.add(content, { userId, agentId: "prosper" }),
      INGEST_TIMEOUT_MS,
    );
    health.signal("memory.ingest", true, { elapsed: Date.now() - start, contentLen: content.length });
  } catch (err) {
    const errMsg = String(err).slice(0, 100);
    health.signal("memory.ingest", false, { error: errMsg, elapsed: Date.now() - start });
    turnErrors.capture("memory.ingest", errMsg);
    console.warn(`[GodMode Memory] Ingestion failed, queued for retry: ${errMsg}`);
    retryQueue.push({ messages: content, userId, attempts: 1 });
    // Trim retry queue to prevent unbounded growth
    while (retryQueue.length > 50) retryQueue.shift();
  }
}

/**
 * Process the retry queue. Called by consciousness heartbeat.
 * Processes up to 5 items per tick to avoid API storms.
 */
export async function processRetryQueue(): Promise<number> {
  if (!memoryInstance || retryQueue.length === 0) return 0;

  // Skip retry processing if circuit breaker is open (API is struggling)
  if (consecutiveSearchFailures >= CIRCUIT_MAX_FAILURES && Date.now() < circuitOpenUntil) {
    return 0;
  }

  let processed = 0;
  // Process fewer items when we've had recent failures
  const batchSize = consecutiveSearchFailures > 0 ? 2 : 5;
  const batch = retryQueue.splice(0, batchSize);

  for (const item of batch) {
    try {
      await withTimeout(
        memoryInstance.add(item.messages, { userId: item.userId, agentId: "prosper" }),
        INGEST_TIMEOUT_MS,
      );
      processed++;
    } catch {
      if (item.attempts < MAX_RETRY_ATTEMPTS) {
        item.attempts++;
        retryQueue.push(item);
      }
      // else: drop after max retries — the fact is lost, not the conversation
    }
  }

  return processed;
}

// ── Memory Stats ─────────────────────────────────────────────────────

/**
 * Get memory stats for diagnostics / snapshot.
 */
export async function getMemoryStats(userId: string): Promise<{ count: number } | null> {
  if (!memoryInstance) return null;

  try {
    const all: any = await withTimeout(
      memoryInstance.getAll({ userId }),
      3_000,
    );
    return { count: (all?.results as any[])?.length ?? 0 };
  } catch {
    return null;
  }
}

// ── Seed Existing Knowledge ──────────────────────────────────────────

/**
 * Seed Mem0 with existing GodMode knowledge on first init.
 * Feeds USER.md, SOUL.md, AGENTS.md content so the ally "remembers"
 * everything from day one. Idempotent — Mem0 deduplicates.
 */
export async function seedFromVault(userId: string): Promise<void> {
  if (!memoryInstance) return;

  const { readFile, writeFile: wf } = await import("node:fs/promises");
  const { existsSync, readdirSync } = await import("node:fs");

  // Skip if already seeded — saves ~10 API calls per restart
  const sentinelPath = join(DATA_DIR, ".mem0-seeded");
  if (existsSync(sentinelPath)) return;

  let seedSuccesses = 0;

  // Seed identity files — convert markdown to conversational facts for Mem0.
  // Mem0's fact extraction works best with short, declarative sentences,
  // not raw markdown with headers and formatting.
  const filesToSeed = [
    join(DATA_DIR, "..", "USER.md"),
    join(DATA_DIR, "..", "SOUL.md"),
  ];

  for (const filePath of filesToSeed) {
    try {
      const content = await readFile(filePath, "utf-8");
      if (content.length < 50) continue;
      // Extract meaningful lines: skip headers, blank lines, and formatting-only lines
      const lines = content.split("\n")
        .map((l: string) => l.replace(/^#+\s*/, "").replace(/^\*+\s*|\*+$/g, "").replace(/^-\s*/, "").trim())
        .filter((l: string) => l.length > 20 && !l.startsWith("---") && !l.startsWith("```"));
      // Batch lines into chunks of ~3 for better fact extraction
      for (let i = 0; i < lines.length; i += 3) {
        const batch = lines.slice(i, i + 3).join(". ");
        if (batch.length > 30) {
          try {
            await memoryInstance.add(batch, { userId, agentId: "prosper" });
            seedSuccesses++;
          } catch {
            // Individual batch failure — non-fatal
          }
        }
      }
    } catch (err) {
      console.warn(`[GodMode Memory] Seed failed for ${filePath}: ${String(err).slice(0, 100)}`);
    }
  }

  // Seed skill cards as short summaries (not raw markdown)
  try {
    const { resolveSkillCardsDir } = await import("./skill-cards.js");
    const cardsDir = resolveSkillCardsDir();
    if (cardsDir) {
      const files = readdirSync(cardsDir).filter((f: string) => f.endsWith(".md"));
      for (const f of files) {
        try {
          const content = await readFile(join(cardsDir, f), "utf-8");
          if (content.length < 50) continue;
          // Extract just the first meaningful paragraph as a summary
          const lines = content.split("\n")
            .map((l: string) => l.replace(/^#+\s*/, "").replace(/^-\s*/, "").trim())
            .filter((l: string) => l.length > 15 && !l.startsWith("---") && !l.startsWith("```") && !l.startsWith("trigger"));
          const summary = lines.slice(0, 2).join(". ");
          if (summary.length > 30) {
            await memoryInstance.add(
              `Skill: ${f.replace(".md", "")}. ${summary}`,
              { userId, agentId: "prosper" },
            );
            seedSuccesses++;
          }
        } catch {
          // Skip individual card files
        }
      }
    }
  } catch {
    // Skill cards not available — non-fatal
  }

  // Only mark as seeded if at least one fact was actually stored
  if (seedSuccesses > 0) {
    await wf(sentinelPath, new Date().toISOString()).catch(() => {});
    console.log(`[GodMode Memory] Vault seeding complete: ${seedSuccesses} items ingested`);
  } else {
    console.warn("[GodMode Memory] Vault seeding failed — 0 items ingested. Will retry next restart.");
  }
}

// ── Mem0 Anthropic JSON Patch ────────────────────────────────────────

/**
 * Monkey-patch Mem0's internal Anthropic LLM to force JSON responses.
 *
 * Problem: Mem0's AnthropicLLM.generateResponse ignores the responseFormat
 * parameter. It calls messages.create without any JSON constraint.
 * The model frequently returns conversational text instead of JSON,
 * silently breaking fact extraction and memory updates.
 *
 * Fix: Wrap the LLM's generateResponse to add an assistant prefill of "{"
 * when JSON is requested. This is Anthropic's documented technique for
 * forcing JSON output without response_format support.
 */
function patchMem0AnthropicLlm(mem: InstanceType<any>): void {
  try {
    // Mem0 stores the LLM instance at mem.llm
    const llm = mem.llm;
    if (!llm || typeof llm.generateResponse !== "function") {
      console.warn("[GodMode Memory] Cannot patch LLM — no generateResponse method found");
      return;
    }

    // Access the underlying Anthropic client
    const client = llm.client;
    if (!client || typeof client.messages?.create !== "function") {
      console.warn("[GodMode Memory] Cannot patch LLM — no Anthropic client found");
      return;
    }

    const originalCreate = client.messages.create.bind(client.messages);
    const model = llm.model || "claude-haiku-4-5-20251001";

    // Replace the Anthropic client's messages.create to inject prefill
    client.messages.create = async (params: any) => {
      const messages = params.messages || [];

      // Detect if this is a JSON-expecting call by checking the system prompt
      const systemContent = typeof params.system === "string" ? params.system : "";
      const expectsJson = systemContent.includes('"facts"') ||
        systemContent.includes("JSON") ||
        systemContent.includes("json") ||
        messages.some((m: any) => typeof m.content === "string" &&
          (m.content.includes('"memory"') || m.content.includes("JSON format")));

      if (expectsJson) {
        // Add assistant prefill to force JSON output
        const patchedMessages = [
          ...messages,
          { role: "assistant", content: "{" },
        ];
        const result = await originalCreate({
          ...params,
          messages: patchedMessages,
        });

        // Prepend the "{" back to the response since the model continues from it
        if (result.content?.[0]?.type === "text") {
          result.content[0].text = "{" + result.content[0].text;
        }
        return result;
      }

      // Non-JSON calls pass through unmodified
      return originalCreate(params);
    };

    console.log("[GodMode Memory] Patched Anthropic LLM for reliable JSON output");
  } catch (err) {
    console.warn(`[GodMode Memory] LLM patch failed (non-fatal): ${String(err)}`);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}
