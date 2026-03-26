import fsp from "node:fs/promises";
import path from "node:path";
import JSON5 from "json5";
import { resolveConfigPath, resolveStateDir } from "./openclaw-state.js";

export type SessionStoreEntry = {
  sessionId?: string;
  updatedAt?: number;
  displayName?: string;
  label?: string;
  subject?: string;
  workspaceId?: string;
  workspaceSubfolder?: string | null;
  [key: string]: unknown;
};

export type OpenClawConfigLite = {
  session?: {
    store?: string;
    mainKey?: string;
    scope?: "per-sender" | "global";
  };
};

function normalizeSessionKey(key: string): string {
  return key.trim().toLowerCase();
}

function expandHome(input: string): string {
  const trimmed = input.trim();
  if (trimmed === "~") {
    return process.env.HOME || "";
  }
  if (trimmed.startsWith("~/")) {
    return path.join(process.env.HOME || "", trimmed.slice(2));
  }
  return trimmed;
}

async function safeReadText(pathname: string): Promise<string | null> {
  try {
    return await fsp.readFile(pathname, "utf-8");
  } catch {
    return null;
  }
}

async function readJson5Object(pathname: string): Promise<Record<string, unknown> | null> {
  const raw = await safeReadText(pathname);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON5.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function resolveStorePath(store?: string): string {
  if (typeof store === "string" && store.trim()) {
    const template = expandHome(store.trim());
    if (!template.includes("{agentId}")) {
      return path.resolve(template);
    }
  }
  return path.join(resolveStateDir(), "sessions", "sessions.json");
}

/**
 * Resolve the correct session store path for a given session key.
 * Agent sessions (key starts with "agent:<agentId>:") write to the
 * agent-specific store; all others write to the default store.
 */
export function resolveAgentStorePath(sessionKey: string, cfg: OpenClawConfigLite): string {
  const match = sessionKey.match(/^agent:([^:]+):/);
  if (match) {
    const agentId = match[1];
    return path.join(resolveStateDir(), "agents", agentId, "sessions", "sessions.json");
  }
  return resolveStorePath(cfg.session?.store);
}

export async function loadConfig(): Promise<OpenClawConfigLite> {
  const cfgPath = resolveConfigPath();
  const parsed = await readJson5Object(cfgPath);
  if (!parsed) {
    return {};
  }
  return parsed as OpenClawConfigLite;
}

export async function loadSessionStore(storePath: string): Promise<Record<string, SessionStoreEntry>> {
  const parsed = await readJson5Object(storePath);
  if (!parsed) {
    return {};
  }
  const out: Record<string, SessionStoreEntry> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }
    out[key] = value as SessionStoreEntry;
  }
  return out;
}

async function listAgentStorePaths(): Promise<string[]> {
  const stateDir = resolveStateDir();
  const agentsDir = path.join(stateDir, "agents");
  try {
    const entries = await fsp.readdir(agentsDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(agentsDir, entry.name, "sessions", "sessions.json"));
  } catch {
    return [];
  }
}

export async function listSessionStorePaths(cfg: OpenClawConfigLite): Promise<string[]> {
  const paths = new Set<string>();
  const configured = cfg.session?.store;

  if (typeof configured === "string" && configured.trim()) {
    const normalized = expandHome(configured.trim());
    if (normalized.includes("{agentId}")) {
      for (const pathname of await listAgentStorePaths()) {
        paths.add(pathname);
      }
    } else {
      paths.add(path.resolve(normalized));
    }
  } else {
    paths.add(resolveStorePath());
    for (const pathname of await listAgentStorePaths()) {
      paths.add(pathname);
    }
  }

  return Array.from(paths);
}

export async function updateSessionStore(
  storePath: string,
  updater: (store: Record<string, SessionStoreEntry>) => void,
): Promise<void> {
  const current = await loadSessionStore(storePath);
  updater(current);
  await fsp.mkdir(path.dirname(storePath), { recursive: true });
  await fsp.writeFile(storePath, `${JSON.stringify(current, null, 2)}\n`, "utf-8");
}

export function isCronSessionKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes(":cron:") || lower.startsWith("cron:") || lower.includes("[cron:");
}

const DERIVED_TITLE_MAX_LEN = 60;

function truncateTitle(text: string, maxLen: number): string {
  if (text.length <= maxLen) {
    return text;
  }
  const cut = text.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) {
    return cut.slice(0, lastSpace) + "…";
  }
  return cut + "…";
}

export function deriveSessionTitle(entry: SessionStoreEntry | undefined, firstUserMessage?: string | null): string | undefined {
  if (!entry) {
    return undefined;
  }
  if (typeof entry.displayName === "string" && entry.displayName.trim()) {
    return entry.displayName.trim();
  }
  if (typeof entry.subject === "string" && entry.subject.trim()) {
    return entry.subject.trim();
  }
  if (firstUserMessage?.trim()) {
    const normalized = firstUserMessage
      // Strip XML system-context / system-reminder blocks injected by GodMode
      .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
      .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
      .replace(/<system>[\s\S]*?<\/system>/g, "")
      .replace(/<context>[\s\S]*?<\/context>/g, "")
      // Strip any remaining XML-style system tags (catch-all)
      .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "")
      // Strip leading timestamp prefixes (e.g. "Mon 2026-03-09 13:15 CDT", "2026-03-09T13:15:00Z")
      .replace(/^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*\s+)?\d{4}-\d{2}-\d{2}[\sT]\d{1,2}:\d{2}(?::\d{2})?(?:\s*[A-Z]{2,5})?\s*/g, "")
      .replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[^\s]*\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (normalized) {
      return truncateTitle(normalized, DERIVED_TITLE_MAX_LEN);
    }
  }
  if (typeof entry.sessionId === "string" && entry.sessionId) {
    return entry.sessionId.slice(0, 8);
  }
  return undefined;
}

export function findStoreKeysIgnoreCase(store: Record<string, unknown>, targetKey: string): string[] {
  const lowered = targetKey.toLowerCase();
  const out: string[] = [];
  for (const key of Object.keys(store)) {
    if (key.toLowerCase() === lowered) {
      out.push(key);
    }
  }
  return out;
}

export function pruneLegacyStoreKeys(params: {
  store: Record<string, unknown>;
  canonicalKey: string;
  candidates: Iterable<string>;
}): void {
  const keysToDelete = new Set<string>();
  for (const candidateRaw of params.candidates) {
    const candidate = String(candidateRaw || "").trim();
    if (!candidate) {
      continue;
    }
    if (candidate !== params.canonicalKey) {
      keysToDelete.add(candidate);
    }
    for (const match of findStoreKeysIgnoreCase(params.store, candidate)) {
      if (match !== params.canonicalKey) {
        keysToDelete.add(match);
      }
    }
  }
  for (const key of keysToDelete) {
    delete params.store[key];
  }
}

export async function resolveGatewaySessionStoreTarget(params: {
  cfg: OpenClawConfigLite;
  key: string;
  scanLegacyKeys?: boolean;
  store?: Record<string, SessionStoreEntry>;
}): Promise<{
  storePath: string;
  canonicalKey: string;
  storeKeys: string[];
}> {
  const key = String(params.key || "").trim();
  const canonicalKey = normalizeSessionKey(key);
  const storePath = resolveStorePath(params.cfg.session?.store);

  const storeKeys = new Set<string>([canonicalKey]);
  if (key && key !== canonicalKey) {
    storeKeys.add(key);
  }

  if (params.scanLegacyKeys !== false) {
    const store = params.store || (await loadSessionStore(storePath));
    for (const legacyKey of findStoreKeysIgnoreCase(store, canonicalKey)) {
      storeKeys.add(legacyKey);
    }
  }

  return {
    storePath,
    canonicalKey,
    storeKeys: Array.from(storeKeys),
  };
}

function mergeSessionEntry(
  current: SessionStoreEntry | undefined,
  incoming: SessionStoreEntry,
): SessionStoreEntry {
  const currentUpdatedAt = typeof current?.updatedAt === "number" ? current.updatedAt : 0;
  const incomingUpdatedAt = typeof incoming?.updatedAt === "number" ? incoming.updatedAt : 0;
  if (!current || incomingUpdatedAt >= currentUpdatedAt) {
    return { ...current, ...incoming };
  }
  return { ...incoming, ...current };
}

export async function loadCombinedSessionStoreForGateway(cfg: OpenClawConfigLite): Promise<{
  storePath: string;
  store: Record<string, SessionStoreEntry>;
}> {
  const paths = await listSessionStorePaths(cfg);
  const combined: Record<string, SessionStoreEntry> = {};

  await Promise.all(
    paths.map(async (storePath) => {
      const store = await loadSessionStore(storePath);
      for (const [key, entry] of Object.entries(store)) {
        const canonicalKey = normalizeSessionKey(key);
        combined[canonicalKey] = mergeSessionEntry(combined[canonicalKey], entry);
      }
    }),
  );

  return {
    storePath:
      typeof cfg.session?.store === "string" && cfg.session.store.trim()
        ? cfg.session.store.trim()
        : "(multiple)",
    store: combined,
  };
}
