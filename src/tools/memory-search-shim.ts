/**
 * memory-search-shim.ts — Backward-compatible shim for the dead `memory_search` tool.
 *
 * The OC host still exposes `memory_search` (from the old Mem0 era) and agent
 * personas still list it in their allowed tools. This shim intercepts those
 * calls and fans out to the real search backends:
 *
 *   1. Honcho (queryPeer) — conversational memory / user model
 *   2. QMD (runQmdSearch) — vault full-text search
 *   3. FTS5 (session-search) — local SQLite session search (episodic recall)
 *
 * Results are merged and returned in a shape the ally can consume.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";

type ToolContext = {
  sessionKey?: string;
};

export function createMemorySearchShimTool(ctx: ToolContext): AnyAgentTool {
  return {
    label: "Memory Search",
    name: "memory_search",
    description:
      "Search your memory and knowledge base. Queries conversational memory (Honcho) " +
      "and the vault/second brain (QMD full-text search). Returns combined results.",
    parameters: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "What to search for — a question, topic, name, or keyword.",
        },
      },
      required: ["query"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const query = String(params.query ?? "").trim();
      if (!query) {
        return jsonResult({ error: "query is required" });
      }

      const results: Array<{ source: string; content: string }> = [];
      const warnings: string[] = [];

      // Run all three backends concurrently
      const [honchoResult, qmdResult, ftsResult] = await Promise.allSettled([
        searchHoncho(query, ctx.sessionKey),
        searchQmd(query),
        searchFts5(query),
      ]);

      // Collect Honcho results
      if (honchoResult.status === "fulfilled" && honchoResult.value) {
        results.push({ source: "honcho", content: honchoResult.value });
      } else if (honchoResult.status === "rejected") {
        warnings.push(`honcho: ${String(honchoResult.reason)}`);
      }

      // Collect QMD results
      if (qmdResult.status === "fulfilled") {
        for (const hit of qmdResult.value) {
          results.push(hit);
        }
      } else if (qmdResult.status === "rejected") {
        warnings.push(`vault: ${String(qmdResult.reason)}`);
      }

      // Collect FTS5 session search results
      if (ftsResult.status === "fulfilled") {
        for (const hit of ftsResult.value) {
          results.push(hit);
        }
      } else if (ftsResult.status === "rejected") {
        warnings.push(`sessions: ${String(ftsResult.reason)}`);
      }

      // Signal health
      try {
        const { health } = await import("../lib/health-ledger.js");
        health.signal("memory.search", results.length > 0, {
          total: results.length,
          backends: { honcho: honchoResult.status === "fulfilled", qmd: qmdResult.status === "fulfilled", fts5: ftsResult.status === "fulfilled" },
        });
      } catch { /* non-fatal */ }

      return jsonResult({
        results,
        total: results.length,
        ...(warnings.length > 0 ? { warnings } : {}),
      });
    },
  };
}

/** Query Honcho for conversational memory. Returns answer text or null. */
async function searchHoncho(query: string, sessionKey?: string): Promise<string | null> {
  const { queryPeer, isMemoryReady } = await import("../lib/memory.js");
  if (!isMemoryReady()) return null;

  const answer = await queryPeer(query, sessionKey ?? "system:memory-search");
  return answer && answer.trim().length >= 5 ? answer.trim() : null;
}

/** Query QMD for vault full-text search. Returns formatted hits. */
async function searchQmd(query: string): Promise<Array<{ source: string; content: string }>> {
  const { runQmdSearch } = await import("../methods/second-brain.js");
  const hits = await runQmdSearch(query, null, 5);

  return hits
    .filter((h) => h.snippet)
    .map((h) => ({
      source: "vault",
      content: h.file ? `[${h.file}] ${h.snippet}` : h.snippet,
    }));
}

/** Query FTS5 SQLite for session history. Returns formatted hits. */
async function searchFts5(query: string): Promise<Array<{ source: string; content: string }>> {
  const { isSessionSearchReady, searchMessages } = await import("../lib/session-search.js");
  if (!isSessionSearchReady()) return [];

  const hits = searchMessages(query, 5);
  return hits.map((h) => ({
    source: "session",
    content: `[${h.sessionKey} / ${h.role}] ${h.content.length > 300 ? h.content.slice(0, 300) + "..." : h.content}`,
  }));
}
