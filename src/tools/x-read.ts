/**
 * x-read.ts — Agent tool for reading X/Twitter content.
 *
 * One tool for all X operations: search, tweet, thread, timeline, article, bookmarks.
 * Routes to XAI x_search for search and Brave CDP for everything else.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

export function createXReadTool(_ctx: ToolContext): AnyAgentTool {
  return {
    label: "X Reader",
    name: "x_read",
    description:
      "Read tweets, threads, articles, bookmarks, and search X/Twitter. " +
      "Use this instead of web_fetch or browser for any X/Twitter content.",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["search", "tweet", "thread", "timeline", "article", "bookmarks"],
          description:
            "What to do: " +
            "'search' to search X for topics, " +
            "'tweet' to read a specific tweet by URL or ID, " +
            "'thread' to read a full tweet thread, " +
            "'timeline' to get a user's recent tweets, " +
            "'article' to read an article linked from a tweet, " +
            "'bookmarks' to get your X bookmarks.",
        },
        query: {
          type: "string",
          description:
            "For 'search': the search query. " +
            "For 'tweet'/'thread'/'article': tweet URL or ID. " +
            "For 'timeline': the @handle or profile URL. " +
            "For 'bookmarks': omit or leave empty.",
        },
        count: {
          type: "number",
          description: "Max results to return (default: 10).",
        },
      },
      required: ["action"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const action = String(params.action ?? "").trim();
      const query = String(params.query ?? "").trim();
      const count = typeof params.count === "number" ? params.count : 10;

      try {
        const {
          searchX,
          getTweet,
          getThread,
          getUserTimeline,
          readArticle,
          getBookmarks,
        } = await import("../services/x-client.js");

        switch (action) {
          case "search": {
            if (!query) return jsonResult({ error: "query is required for search" });
            const result = await searchX(query, { limit: count });
            return jsonResult(result);
          }
          case "tweet": {
            if (!query) return jsonResult({ error: "tweet URL or ID is required" });
            const result = await getTweet(query);
            return jsonResult(result);
          }
          case "thread": {
            if (!query) return jsonResult({ error: "tweet URL or ID is required" });
            const result = await getThread(query);
            return jsonResult(result);
          }
          case "timeline": {
            if (!query) return jsonResult({ error: "handle or profile URL is required" });
            const result = await getUserTimeline(query, count);
            return jsonResult(result);
          }
          case "article": {
            if (!query) return jsonResult({ error: "article or tweet URL is required" });
            const result = await readArticle(query);
            return jsonResult(result);
          }
          case "bookmarks": {
            const result = await getBookmarks(count);
            return jsonResult(result);
          }
          default:
            return jsonResult({
              error: `Unknown action '${action}'. Use: search, tweet, thread, timeline, article, bookmarks.`,
            });
        }
      } catch (err) {
        return jsonResult({
          error: `x_read failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    },
  };
}
