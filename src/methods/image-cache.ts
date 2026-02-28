import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  cacheImage,
  getCachedImage,
  resolveSessionImages,
  updateSessionIndex,
  cleanupCache,
  type SessionImageEntry,
} from "../services/image-cache.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

/**
 * images.cache — Store one or more images in the local cache.
 *
 * Params: { images: Array<{ data: string, mimeType: string, fileName?: string }>, sessionKey?: string }
 * Returns: { cached: Array<{ hash: string, mimeType: string, bytes: number }> }
 */
const cache: GatewayRequestHandler = async ({ params, respond }) => {
  const images = Array.isArray(params.images) ? params.images : [];
  if (images.length === 0) {
    respond(false, null, { code: "INVALID_REQUEST", message: "No images provided" });
    return;
  }

  const cached = [];
  for (const img of images) {
    if (typeof img.data !== "string" || typeof img.mimeType !== "string") continue;
    try {
      const meta = await cacheImage(img.data, {
        mimeType: img.mimeType,
        fileName: typeof img.fileName === "string" ? img.fileName : undefined,
      });
      cached.push({ hash: meta.hash, mimeType: meta.mimeType, bytes: meta.bytes });
    } catch (err) {
      // Best effort — skip individual failures
      console.error("[image-cache] Failed to cache image:", err);
    }
  }

  respond(true, { cached });
};

/**
 * images.get — Retrieve a single cached image by hash.
 *
 * Params: { hash: string }
 * Returns: { dataUrl: string, mimeType: string, bytes: number }
 */
const get: GatewayRequestHandler = async ({ params, respond }) => {
  const hash = typeof params.hash === "string" ? params.hash.trim() : "";
  if (!hash) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing hash" });
    return;
  }

  const result = await getCachedImage(hash);
  if (!result) {
    respond(false, null, { code: "NOT_FOUND", message: "Image not found in cache" });
    return;
  }

  respond(true, {
    dataUrl: result.dataUrl,
    mimeType: result.meta.mimeType,
    bytes: result.meta.bytes,
  });
};

/**
 * images.resolve — Resolve all omitted images for a session from the cache.
 *
 * Params: { sessionKey: string }
 * Returns: { images: Record<string, string> } where key is "msgIdx:imgIdx" and value is a data URL
 */
const resolve: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey =
    typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing sessionKey" });
    return;
  }

  const images = await resolveSessionImages(sessionKey);
  respond(true, { images });
};

/**
 * images.updateIndex — Update the session image index with new entries.
 *
 * Params: { sessionKey: string, images: SessionImageEntry[] }
 */
const updateIndex: GatewayRequestHandler = async ({ params, respond }) => {
  const sessionKey =
    typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
  if (!sessionKey) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing sessionKey" });
    return;
  }

  const entries = Array.isArray(params.images) ? params.images : [];
  const validated: SessionImageEntry[] = [];
  for (const e of entries) {
    if (
      typeof e.messageIndex === "number" &&
      typeof e.imageIndex === "number" &&
      typeof e.hash === "string" &&
      typeof e.mimeType === "string"
    ) {
      validated.push({
        messageIndex: e.messageIndex,
        imageIndex: e.imageIndex,
        hash: e.hash,
        mimeType: e.mimeType,
        bytes: typeof e.bytes === "number" ? e.bytes : 0,
        role: typeof e.role === "string" ? e.role : "unknown",
        timestamp: typeof e.timestamp === "number" ? e.timestamp : undefined,
        fileName: typeof e.fileName === "string" ? e.fileName : undefined,
      });
    }
  }

  await updateSessionIndex(sessionKey, validated);
  respond(true, { updated: validated.length });
};

/**
 * images.cleanup — Run cache cleanup (evict old/oversized entries).
 */
const cleanup: GatewayRequestHandler = async ({ respond }) => {
  const result = await cleanupCache();
  respond(true, result);
};

export const imageCacheHandlers: GatewayRequestHandlers = {
  "images.cache": cache,
  "images.get": get,
  "images.resolve": resolve,
  "images.updateIndex": updateIndex,
  "images.cleanup": cleanup,
};
