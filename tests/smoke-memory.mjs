#!/usr/bin/env node
/**
 * smoke-memory.mjs — The boring test that actually matters.
 *
 * Boots the memory system, ingests known facts, searches for them,
 * prints pass/fail. Run this every morning. When it passes 5 days
 * straight, your memory system works.
 *
 * Usage: node tests/smoke-memory.mjs
 *
 * No LLM judge. No eval scores. Just: did the thing I stored come back?
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// ── Setup: resolve API keys the same way memory.ts does ─────────────

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
const WARN = "\x1b[33m⚠\x1b[0m";
let passed = 0;
let failed = 0;
let skipped = 0;

function check(name, ok, detail) {
  if (ok) {
    console.log(`  ${PASS} ${name}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function skip(name, reason) {
  console.log(`  ${WARN} ${name} — SKIPPED: ${reason}`);
  skipped++;
}

// Load env vars the same way gateway-start.ts does
function loadEnv() {
  const home = homedir();
  const envPaths = [
    join(process.env.GODMODE_ROOT || join(home, "godmode"), ".env"),
    join(process.env.OPENCLAW_STATE_DIR || join(home, ".openclaw"), ".env"),
  ];
  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue;
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const cleaned = trimmed.replace(/^export\s+/, "");
      const eqIdx = cleaned.indexOf("=");
      if (eqIdx < 1) continue;
      const key = cleaned.slice(0, eqIdx).trim();
      let val = cleaned.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

// Resolve Anthropic key using same chain as memory.ts
async function resolveAnthropicKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;

  // Claude Code OAuth
  try {
    const credsPath = join(homedir(), ".claude", ".credentials.json");
    const creds = JSON.parse(readFileSync(credsPath, "utf-8"));
    const oauth = creds?.claudeAiOauth;
    if (oauth?.accessToken) return oauth.accessToken;
  } catch { /* not found */ }

  // OpenClaw auth profiles
  try {
    const profilesPath = join(homedir(), ".openclaw", "auth-profiles.json");
    const profiles = JSON.parse(readFileSync(profilesPath, "utf-8"));
    const entry = profiles?.profiles?.["anthropic:oauth"]
      ?? Object.values(profiles?.profiles ?? {}).find((p) => p?.provider === "anthropic" && p?.token);
    if (entry?.token) return entry.token;
  } catch { /* not found */ }

  return null;
}

// ── Tests ────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔬 GodMode Memory Smoke Test\n");
  console.log("─".repeat(50));

  // Phase 0: Environment
  console.log("\n📋 Phase 0: Environment\n");
  loadEnv();

  const anthropicKey = await resolveAnthropicKey();
  check("Anthropic key resolvable", !!anthropicKey,
    !anthropicKey ? "No key in env, OAuth, or auth-profiles" : undefined);

  const hasGemini = !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  check("Embedding key available", hasGemini || hasOpenAI,
    !(hasGemini || hasOpenAI) ? "No GEMINI_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY" : undefined);

  if (!anthropicKey || !(hasGemini || hasOpenAI)) {
    console.log("\n❌ Cannot proceed without API keys. Fix the above and re-run.\n");
    process.exit(1);
  }

  // Set the key for Mem0
  process.env.ANTHROPIC_API_KEY = anthropicKey;
  if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
  }

  // Phase 1: Mem0 Init
  console.log("\n📋 Phase 1: Mem0 Initialization\n");

  let Memory;
  try {
    const mod = await import("mem0ai/oss");
    Memory = mod.Memory;
    check("mem0ai/oss importable", true);
  } catch (err) {
    check("mem0ai/oss importable", false, String(err).slice(0, 80));
    console.log("\n❌ mem0ai not installed. Run: pnpm install\n");
    process.exit(1);
  }

  const dataDir = join(process.env.GODMODE_ROOT || join(homedir(), "godmode"), "data");
  const testDbPath = join(dataDir, "mem0-smoke-test.db");
  const testHistoryPath = join(dataDir, "mem0-smoke-history.db");

  const embedder = hasGemini
    ? { provider: "google", config: { apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY, model: "gemini-embedding-001", embeddingDims: 768 } }
    : { provider: "openai", config: { apiKey: process.env.OPENAI_API_KEY, model: "text-embedding-3-small" } };
  const dimension = hasGemini ? 768 : 1536;

  let mem;
  try {
    mem = new Memory({
      version: "v1.1",
      llm: { provider: "anthropic", config: { apiKey: anthropicKey, model: "claude-haiku-4-5-20251001" } },
      embedder,
      vectorStore: { provider: "memory", config: { collectionName: "smoke_test", dimension, dbPath: testDbPath } },
      historyStore: { provider: "sqlite", config: { historyDbPath: testHistoryPath } },
      enableGraph: false,
    });
    check("Mem0 Memory instance created", true);
  } catch (err) {
    check("Mem0 Memory instance created", false, String(err).slice(0, 100));
    console.log("\n❌ Cannot create Mem0 instance. Check API keys.\n");
    process.exit(1);
  }

  // Apply the same JSON prefill patch we use in production
  try {
    const client = mem.llm?.client;
    if (client?.messages?.create) {
      const originalCreate = client.messages.create.bind(client.messages);
      client.messages.create = async (params) => {
        const systemContent = typeof params.system === "string" ? params.system : "";
        const messages = params.messages || [];
        const expectsJson = systemContent.includes('"facts"') ||
          systemContent.includes("JSON") || systemContent.includes("json") ||
          messages.some((m) => typeof m.content === "string" &&
            (m.content.includes('"memory"') || m.content.includes("JSON format")));

        if (expectsJson) {
          const patchedMessages = [...messages, { role: "assistant", content: "{" }];
          const result = await originalCreate({ ...params, messages: patchedMessages });
          if (result.content?.[0]?.type === "text") {
            result.content[0].text = "{" + result.content[0].text;
          }
          return result;
        }
        return originalCreate(params);
      };
      check("JSON prefill patch applied", true);
    } else {
      check("JSON prefill patch applied", false, "No Anthropic client found on mem.llm");
    }
  } catch (err) {
    check("JSON prefill patch applied", false, String(err).slice(0, 80));
  }

  // Phase 2: Ingest known facts
  console.log("\n📋 Phase 2: Ingest Known Facts\n");

  const KNOWN_FACTS = [
    { input: "My dog's name is Edison and he's a golden retriever.", key: "edison", searchQuery: "what's my dog's name" },
    { input: "I have a meeting with Rich every Tuesday at 10am about product strategy.", key: "rich-meeting", searchQuery: "when do I meet with Rich" },
    { input: "My company GodMode is building a personal AI operating system. We charge $297/month.", key: "godmode-price", searchQuery: "how much does GodMode cost" },
    { input: "Jake is my co-founder. He handles engineering and I handle product and sales.", key: "jake-cofounder", searchQuery: "who is Jake" },
    { input: "I use Obsidian for note-taking and my vault is at ~/Documents/VAULT.", key: "obsidian-vault", searchQuery: "where are my notes stored" },
  ];

  const userId = "smoke-test";

  for (const fact of KNOWN_FACTS) {
    try {
      const start = Date.now();
      await mem.add(fact.input, { userId, agentId: "smoke-test" });
      const elapsed = Date.now() - start;
      check(`Ingested "${fact.key}" (${elapsed}ms)`, true);
    } catch (err) {
      check(`Ingested "${fact.key}"`, false, String(err).slice(0, 100));
    }
  }

  // Phase 3: Search and verify retrieval
  console.log("\n📋 Phase 3: Search & Retrieval\n");

  for (const fact of KNOWN_FACTS) {
    try {
      const start = Date.now();
      const result = await mem.search(fact.searchQuery, { userId, limit: 5 });
      const elapsed = Date.now() - start;

      const results = result?.results ?? [];
      const found = results.length > 0;
      const topResult = results[0];
      const topScore = topResult?.score ?? 0;

      if (found && topScore > 0.5) {
        check(`Search "${fact.key}": found (score=${topScore.toFixed(3)}, ${elapsed}ms)`, true);
        // Show what was returned
        console.log(`         → "${(topResult.memory ?? "").slice(0, 80)}"`);
      } else if (found) {
        check(`Search "${fact.key}": found but low score (${topScore.toFixed(3)}, ${elapsed}ms)`, false,
          `Top result: "${(topResult.memory ?? "").slice(0, 60)}"`);
      } else {
        check(`Search "${fact.key}": no results (${elapsed}ms)`, false, "Empty result set");
      }
    } catch (err) {
      check(`Search "${fact.key}"`, false, String(err).slice(0, 100));
    }
  }

  // Phase 4: Cross-query (search for something related but not verbatim)
  console.log("\n📋 Phase 4: Semantic Retrieval (non-verbatim)\n");

  const CROSS_QUERIES = [
    { query: "tell me about my pets", expectKey: "edison" },
    { query: "what's our pricing model", expectKey: "godmode-price" },
    { query: "who works with me on the business", expectKey: "jake-cofounder" },
  ];

  for (const cq of CROSS_QUERIES) {
    try {
      const result = await mem.search(cq.query, { userId, limit: 5 });
      const results = result?.results ?? [];
      const topMemory = results[0]?.memory ?? "";
      const topScore = results[0]?.score ?? 0;

      // Check if the expected concept appears in any result
      const found = results.some((r) => {
        const m = (r.memory ?? "").toLowerCase();
        switch (cq.expectKey) {
          case "edison": return m.includes("edison") || m.includes("dog") || m.includes("golden");
          case "godmode-price": return m.includes("297") || m.includes("pricing") || m.includes("charge");
          case "jake-cofounder": return m.includes("jake") || m.includes("co-founder") || m.includes("cofounder");
          default: return false;
        }
      });

      check(`Semantic "${cq.query}" → expects ${cq.expectKey}`, found,
        !found ? `Got: "${topMemory.slice(0, 60)}" (score=${topScore.toFixed(3)})` : undefined);
      if (found) {
        console.log(`         → "${topMemory.slice(0, 80)}" (score=${topScore.toFixed(3)})`);
      }
    } catch (err) {
      check(`Semantic "${cq.query}"`, false, String(err).slice(0, 100));
    }
  }

  // Phase 5: Stats
  console.log("\n📋 Phase 5: Memory Stats\n");

  try {
    const all = await mem.getAll({ userId });
    const count = all?.results?.length ?? 0;
    check(`Total memories stored: ${count}`, count >= KNOWN_FACTS.length,
      count < KNOWN_FACTS.length ? `Expected >= ${KNOWN_FACTS.length}, got ${count}` : undefined);
  } catch (err) {
    check("Get all memories", false, String(err).slice(0, 100));
  }

  // Cleanup test DB
  try {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(testDbPath);
    unlinkSync(testHistoryPath);
  } catch { /* cleanup non-fatal */ }

  // ── Summary ────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${skipped} skipped\n`);

  if (failed === 0) {
    console.log("✅ Memory system is working. Run this again tomorrow.\n");
  } else if (failed <= 2) {
    console.log("⚠️  Mostly working but has gaps. Check the failures above.\n");
  } else {
    console.log("❌ Memory system has serious issues. Fix before shipping.\n");
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`\n❌ Smoke test crashed: ${err}\n`);
  process.exit(2);
});
