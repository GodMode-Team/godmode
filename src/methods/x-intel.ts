/**
 * x-intel.ts — RPC handlers for X/Twitter operations.
 *
 * RPC methods:
 *   x.search       — Search X via XAI x_search
 *   x.readTweet    — Read a specific tweet by URL or ID
 *   x.readThread   — Read a full tweet thread
 *   x.userTimeline — Get a user's recent tweets
 *   x.readArticle  — Read an article linked from a tweet
 *   x.bookmarks    — Get the user's X bookmarks
 *   x.health       — Check X integration health
 *   x.setup        — Launch Brave for X login
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  searchX,
  getBookmarks,
  getTweet,
  getThread,
  getUserTimeline,
  readArticle,
  health,
  setup,
} from "../services/x-client.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Handlers ───────────────────────────────────────────────────────────

const searchHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { query, fromDate, toDate, handles, excludeHandles, limit } = params as {
    query?: string;
    fromDate?: string;
    toDate?: string;
    handles?: string[];
    excludeHandles?: string[];
    limit?: number;
  };
  if (!query) {
    respond(false, null, { code: "MISSING_PARAM", message: "query is required" });
    return;
  }
  try {
    const result = await searchX(query, { fromDate, toDate, handles, excludeHandles, limit });
    respond(true, result);
  } catch (err) {
    respond(false, null, {
      code: "SEARCH_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const readTweetHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { urlOrId } = params as { urlOrId?: string };
  if (!urlOrId) {
    respond(false, null, { code: "MISSING_PARAM", message: "urlOrId is required" });
    return;
  }
  try {
    const result = await getTweet(urlOrId);
    if (result.error) {
      respond(false, null, { code: "TWEET_READ_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "TWEET_READ_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const readThreadHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { urlOrId } = params as { urlOrId?: string };
  if (!urlOrId) {
    respond(false, null, { code: "MISSING_PARAM", message: "urlOrId is required" });
    return;
  }
  try {
    const result = await getThread(urlOrId);
    if (result.error && result.tweets.length === 0) {
      respond(false, null, { code: "THREAD_READ_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "THREAD_READ_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const userTimelineHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { handle, count } = params as { handle?: string; count?: number };
  if (!handle) {
    respond(false, null, { code: "MISSING_PARAM", message: "handle is required" });
    return;
  }
  try {
    const result = await getUserTimeline(handle, count);
    if (result.error && result.tweets.length === 0) {
      respond(false, null, { code: "TIMELINE_READ_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "TIMELINE_READ_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const readArticleHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { urlOrId } = params as { urlOrId?: string };
  if (!urlOrId) {
    respond(false, null, { code: "MISSING_PARAM", message: "urlOrId is required" });
    return;
  }
  try {
    const result = await readArticle(urlOrId);
    if ("error" in result) {
      respond(false, null, { code: "ARTICLE_READ_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "ARTICLE_READ_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const bookmarksHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { count } = params as { count?: number };
  try {
    const result = await getBookmarks(count);
    if (result.error && result.tweets.length === 0) {
      respond(false, null, { code: "BOOKMARKS_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "BOOKMARKS_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const healthHandler: GatewayRequestHandler = async ({ respond }) => {
  try {
    const status = await health();
    respond(true, status);
  } catch (err) {
    respond(false, null, {
      code: "HEALTH_CHECK_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

const setupHandler: GatewayRequestHandler = async ({ respond }) => {
  try {
    const result = await setup();
    if ("error" in result) {
      respond(false, null, { code: "SETUP_FAILED", message: result.error });
    } else {
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "SETUP_FAILED",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

// ── Export ──────────────────────────────────────────────────────────────

export const xIntelHandlers: GatewayRequestHandlers = {
  "x.search": searchHandler,
  "x.readTweet": readTweetHandler,
  "x.readThread": readThreadHandler,
  "x.userTimeline": userTimelineHandler,
  "x.readArticle": readArticleHandler,
  "x.bookmarks": bookmarksHandler,
  "x.health": healthHandler,
  "x.setup": setupHandler,
};
