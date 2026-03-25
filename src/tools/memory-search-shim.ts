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
import { jsonResult } from "../lib/sdk-helpers.js";
import { SCREENPIPE_API_URL } from "../lib/constants.js";

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

      // Run all four backends concurrently
      const [honchoResult, qmdResult, ftsResult, screenpipeResult] = await Promise.allSettled([
        searchHoncho(query, ctx.sessionKey),
        searchQmd(query),
        searchFts5(query),
        searchScreenpipe(query),
      ]);

      // Collect Honcho results
      if (honchoResult.status === "fulfilled" && honchoResult.value) {
        results.push({ source: "honcho", content: honchoResult.value });
      } else if (honchoResult.status === "rejected") {
        warnings.push(`honcho: ${formatReason(honchoResult.reason)}`);
      }

      // Collect QMD results
      if (qmdResult.status === "fulfilled") {
        for (const hit of qmdResult.value) {
          results.push(hit);
        }
      } else if (qmdResult.status === "rejected") {
        warnings.push(`vault: ${formatReason(qmdResult.reason)}`);
      }

      // Collect FTS5 session search results
      if (ftsResult.status === "fulfilled") {
        for (const hit of ftsResult.value) {
          results.push(hit);
        }
      } else if (ftsResult.status === "rejected") {
        warnings.push(`sessions: ${formatReason(ftsResult.reason)}`);
      }

      // Collect Screenpipe results
      if (screenpipeResult.status === "fulfilled") {
        for (const hit of screenpipeResult.value) {
          results.push(hit);
        }
      } else if (screenpipeResult.status === "rejected") {
        warnings.push(`screenpipe: ${String(screenpipeResult.reason)}`);
      }

      // Signal health
      try {
        const { health } = await import("../lib/health-ledger.js");
        health.signal("memory.search", results.length > 0, {
          total: results.length,
          backends: {
            honcho: honchoResult.status === "fulfilled",
            qmd: qmdResult.status === "fulfilled",
            fts5: ftsResult.status === "fulfilled",
            screenpipe: screenpipeResult.status === "fulfilled",
          },
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

function formatReason(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
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

/** Query Screenpipe REST API for screen/audio context. Returns formatted hits. */
async function searchScreenpipe(query: string): Promise<Array<{ source: string; content: string }>> {
  try {
    const resp = await fetch(`${SCREENPIPE_API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, limit: 5, content_type: "all" }),
      signal: AbortSignal.timeout(3_000),
    });
    if (!resp.ok) return [];
    const data = (await resp.json()) as {
      data?: Array<{
        type: string;
        content: { text?: string; transcription?: string; timestamp?: string; app_name?: string };
      }>;
    };
    if (!data.data?.length) return [];

    return data.data
      .filter((d) => d.content?.text || d.content?.transcription)
      .slice(0, 5)
      .map((d) => {
        const text = d.content.text || d.content.transcription || "";
        const app = d.content.app_name ? `[${d.content.app_name}] ` : "";
        const ts = d.content.timestamp ? `(${d.content.timestamp}) ` : "";
        return {
          source: "screenpipe",
          content: `${ts}${app}${text.length > 300 ? text.slice(0, 300) + "..." : text}`,
        };
      });
  } catch {
    // Screenpipe not running — silently skip
    return [];
  }
}
