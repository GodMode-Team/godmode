/**
 * x-client.ts — Unified X/Twitter client.
 *
 * Routes requests to the best backend:
 *   - XAI x_search: semantic search, topic monitoring
 *   - twitter-cli: bookmarks, specific tweets, timelines
 *
 * Graceful degradation: if twitter-cli is down, search still works via XAI.
 * If XAI key is missing, twitter-cli operations still work.
 */

import {
  checkHealth as checkCliHealth,
  getBookmarks as cliGetBookmarks,
  getTweet as cliGetTweet,
  getThread as cliGetThread,
  getUserTimeline as cliGetTimeline,
  readArticle as cliReadArticle,
  setupLogin as cliSetup,
  initTwitterCli,
  type XBrowserHealth,
  type ExtractedTweet,
} from "./x-browser.js";
import { getEnvVar } from "../lib/env-writer.js";

// ── XAI key loading (shared with brief-generator) ──────────────────────

export function getXaiApiKey(): string {
  return getEnvVar("XAI_API_KEY");
}

// ── Types ──────────────────────────────────────────────────────────────

export type XSearchResult = {
  items: Array<{ author: string; text: string; url?: string }>;
  source: "xai" | "cli";
  error?: string;
};

export type XHealthStatus = {
  xai: { available: boolean; error?: string };
  browser: XBrowserHealth;
};

// ── XAI x_search ──────────────────────────────────────────────────────

export async function searchX(
  query: string,
  opts?: {
    fromDate?: string;
    toDate?: string;
    handles?: string[];
    excludeHandles?: string[];
    limit?: number;
  },
): Promise<XSearchResult> {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    // Fall back to twitter-cli search
    // twitter-cli doesn't have a search command that maps cleanly, but we can try
    return { items: [], source: "xai", error: "XAI_API_KEY not configured" };
  }

  try {
    // Build tools array with x_search config
    const xSearchTool: Record<string, unknown> = { type: "x_search" };
    if (opts?.handles?.length) {
      xSearchTool.allowed_x_handles = opts.handles.slice(0, 10);
    }
    if (opts?.excludeHandles?.length) {
      xSearchTool.excluded_x_handles = opts.excludeHandles.slice(0, 10);
    }
    if (opts?.fromDate) xSearchTool.from_date = opts.fromDate;
    if (opts?.toDate) xSearchTool.to_date = opts.toDate;

    const resp = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-non-reasoning",
        tools: [xSearchTool],
        input: query,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return { items: [], source: "xai", error: `XAI API ${resp.status}: ${body.slice(0, 200)}` };
    }

    const data = (await resp.json()) as {
      output?: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>;
      error?: { message?: string };
    };

    if (data.error?.message) {
      return { items: [], source: "xai", error: data.error.message };
    }

    // Extract text from response
    const textOutput = data.output
      ?.filter((o) => o.type === "message")
      ?.flatMap((o) => o.content ?? [])
      ?.filter((c) => c.type === "output_text")
      ?.map((c) => c.text ?? "")
      ?.join("\n") ?? "";

    // Parse citation URLs
    const urlRegex = /\[(?:\[\d+\])?\]\((https:\/\/x\.com\/[^)]+)\)/g;
    const citations: string[] = [];
    let urlMatch;
    while ((urlMatch = urlRegex.exec(textOutput)) !== null) {
      if (urlMatch[1] && !citations.includes(urlMatch[1])) {
        citations.push(urlMatch[1]);
      }
    }

    // Parse into structured items
    const items: Array<{ author: string; text: string; url?: string }> = [];
    const lines = textOutput.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      const bulletMatch = line.match(/^[-*•]\s+(.+)/);
      const numberedMatch = line.match(/^\d+\.\s+(.+)/);
      const content = bulletMatch?.[1] ?? numberedMatch?.[1];
      if (content && content.length > 20) {
        const handleMatch = content.match(/@(\w+)/);
        items.push({
          author: handleMatch ? `@${handleMatch[1]}` : "X",
          text: content.replace(/@\w+\s*/, "").trim(),
          url: citations.shift(),
        });
      }
    }

    // If no structured items, use full text
    if (items.length === 0 && textOutput.length > 20) {
      items.push({ author: "XAI", text: textOutput.slice(0, 500) });
    }

    const limit = opts?.limit ?? 10;
    return { items: items.slice(0, limit), source: "xai" };
  } catch (err) {
    return {
      items: [],
      source: "xai",
      error: `XAI search failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ── Passthrough to twitter-cli operations ──────────────────────────────

export { cliGetBookmarks as getBookmarks };
export { cliGetTweet as getTweet };
export { cliGetThread as getThread };
export { cliGetTimeline as getUserTimeline };
export { cliReadArticle as readArticle };
export { cliSetup as setup };

// ── Health ──────────────────────────────────────────────────────────────

export async function health(): Promise<XHealthStatus> {
  const apiKey = getXaiApiKey();
  const cliHealth = await checkCliHealth();

  return {
    xai: {
      available: !!apiKey,
      error: apiKey ? undefined : "XAI_API_KEY not configured",
    },
    browser: cliHealth,
  };
}

// ── Init (called from gateway_start) ──────────────────────────────────

export async function initXClient(logger?: { info: (msg: string) => void; warn: (msg: string) => void }): Promise<void> {
  const log = logger ?? console;

  // Check XAI
  const apiKey = getXaiApiKey();
  if (apiKey) {
    log.info("[GodMode] X client: XAI x_search available");
  } else {
    log.warn("[GodMode] X client: XAI_API_KEY not configured — search unavailable");
  }

  // Check twitter-cli
  await initTwitterCli(log);
}
