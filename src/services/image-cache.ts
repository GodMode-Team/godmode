import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

// ── Constants ───────────────────────────────────────────────────────

const CACHE_DIR = join(DATA_DIR, "image-cache");
const INDEX_DIR = join(CACHE_DIR, "_index");
const MAX_CACHE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── Types ───────────────────────────────────────────────────────────

export type CachedImageMeta = {
  hash: string;
  mimeType: string;
  bytes: number;
  cachedAt: string;
  fileName?: string;
};

export type SessionImageEntry = {
  messageIndex: number;
  imageIndex: number;
  hash: string;
  mimeType: string;
  bytes: number;
  role: string;
  timestamp?: number;
  fileName?: string;
};

export type SessionImageIndex = {
  sessionKey: string;
  updatedAt: string;
  images: SessionImageEntry[];
};

// ── Helpers ─────────────────────────────────────────────────────────

function hashData(base64: string): string {
  return createHash("sha256").update(base64).digest("hex").slice(0, 24);
}

function safeSessionFileName(sessionKey: string): string {
  return sessionKey.replace(/[/:\\]/g, "__").replace(/[^a-zA-Z0-9_\-\.]/g, "_");
}

async function ensureDirs() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(INDEX_DIR, { recursive: true });
}

// ── Cache Operations ────────────────────────────────────────────────

/**
 * Store image data and return metadata including the content hash.
 */
export async function cacheImage(
  base64Data: string,
  opts: { mimeType: string; fileName?: string },
): Promise<CachedImageMeta> {
  await ensureDirs();
  const hash = hashData(base64Data);
  const metaPath = join(CACHE_DIR, `${hash}.json`);
  const dataPath = join(CACHE_DIR, `${hash}.bin`);

  const meta: CachedImageMeta = {
    hash,
    mimeType: opts.mimeType,
    bytes: Math.ceil((base64Data.length * 3) / 4), // approximate decoded size
    cachedAt: new Date().toISOString(),
    fileName: opts.fileName,
  };

  await Promise.all([
    writeFile(metaPath, JSON.stringify(meta), "utf-8"),
    writeFile(dataPath, base64Data, "utf-8"),
  ]);

  return meta;
}

/**
 * Retrieve cached image data by hash.
 */
export async function getCachedImage(
  hash: string,
): Promise<{ dataUrl: string; meta: CachedImageMeta } | null> {
  try {
    const [metaRaw, data] = await Promise.all([
      readFile(join(CACHE_DIR, `${hash}.json`), "utf-8"),
      readFile(join(CACHE_DIR, `${hash}.bin`), "utf-8"),
    ]);
    const meta = JSON.parse(metaRaw) as CachedImageMeta;
    const dataUrl = data.startsWith("data:")
      ? data
      : `data:${meta.mimeType};base64,${data}`;
    return { dataUrl, meta };
  } catch {
    return null;
  }
}

// ── Session Index ───────────────────────────────────────────────────

/**
 * Read the session image index.
 */
export async function getSessionIndex(
  sessionKey: string,
): Promise<SessionImageIndex | null> {
  try {
    const path = join(INDEX_DIR, `${safeSessionFileName(sessionKey)}.json`);
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as SessionImageIndex;
  } catch {
    return null;
  }
}

/**
 * Update or create the session image index. Merges with existing entries.
 */
export async function updateSessionIndex(
  sessionKey: string,
  entries: SessionImageEntry[],
): Promise<void> {
  await ensureDirs();
  const existing = await getSessionIndex(sessionKey);
  const map = new Map<string, SessionImageEntry>();

  // Seed with existing entries
  if (existing) {
    for (const e of existing.images) {
      map.set(`${e.messageIndex}:${e.imageIndex}`, e);
    }
  }

  // Overwrite/add new entries
  for (const e of entries) {
    map.set(`${e.messageIndex}:${e.imageIndex}`, e);
  }

  const index: SessionImageIndex = {
    sessionKey,
    updatedAt: new Date().toISOString(),
    images: Array.from(map.values()),
  };

  const path = join(INDEX_DIR, `${safeSessionFileName(sessionKey)}.json`);
  await writeFile(path, JSON.stringify(index), "utf-8");
}

/**
 * Resolve all cached images for a session.
 * Returns a map of "messageIndex:imageIndex" → data URL.
 */
export async function resolveSessionImages(
  sessionKey: string,
): Promise<Record<string, string>> {
  const index = await getSessionIndex(sessionKey);
  if (!index || index.images.length === 0) return {};

  const result: Record<string, string> = {};

  await Promise.all(
    index.images.map(async (entry) => {
      const cached = await getCachedImage(entry.hash);
      if (cached) {
        result[`${entry.messageIndex}:${entry.imageIndex}`] = cached.dataUrl;
      }
    }),
  );

  return result;
}

// ── Cleanup ─────────────────────────────────────────────────────────

/**
 * Evict images older than MAX_AGE_MS and enforce MAX_CACHE_SIZE_BYTES.
 * Returns count of files removed.
 */
export async function cleanupCache(): Promise<{ removed: number; freedBytes: number }> {
  try {
    await ensureDirs();
  } catch {
    return { removed: 0, freedBytes: 0 };
  }

  const files = await readdir(CACHE_DIR);
  const now = Date.now();
  let removed = 0;
  let freedBytes = 0;

  type CacheEntry = { path: string; metaPath: string; mtime: number; size: number };
  const entries: CacheEntry[] = [];

  // Collect .bin files and their metadata
  for (const file of files) {
    if (!file.endsWith(".bin")) continue;
    const binPath = join(CACHE_DIR, file);
    const metaPath = join(CACHE_DIR, file.replace(".bin", ".json"));
    try {
      const s = await stat(binPath);
      entries.push({ path: binPath, metaPath, mtime: s.mtimeMs, size: s.size });
    } catch {
      // skip
    }
  }

  // Phase 1: Remove entries older than MAX_AGE_MS
  for (const entry of entries) {
    if (now - entry.mtime > MAX_AGE_MS) {
      try {
        await unlink(entry.path);
        await unlink(entry.metaPath).catch(() => {});
        removed++;
        freedBytes += entry.size;
      } catch {
        // skip
      }
    }
  }

  // Phase 2: If still over budget, remove oldest first
  const remaining = entries
    .filter((e) => now - e.mtime <= MAX_AGE_MS)
    .sort((a, b) => a.mtime - b.mtime);

  let totalSize = remaining.reduce((sum, e) => sum + e.size, 0);
  for (const entry of remaining) {
    if (totalSize <= MAX_CACHE_SIZE_BYTES) break;
    try {
      await unlink(entry.path);
      await unlink(entry.metaPath).catch(() => {});
      removed++;
      freedBytes += entry.size;
      totalSize -= entry.size;
    } catch {
      // skip
    }
  }

  return { removed, freedBytes };
}
