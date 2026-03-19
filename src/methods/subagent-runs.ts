/**
 * Subagent runs handlers backed by on-disk session stores.
 */

import fsp from "node:fs/promises";
import path from "node:path";
import { STATE_DIR } from "../lib/openclaw-state.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

type SessionEntry = {
  sessionId?: string;
  updatedAt?: number;
  spawnedBy?: string;
  displayName?: string;
  label?: string;
  subject?: string;
  model?: string;
  modelOverride?: string;
  abortedLastRun?: boolean;
  spawnDepth?: number;
};

type SessionStore = Record<string, SessionEntry>;

type SerializedRun = {
  runId: string;
  childSessionKey: string;
  requesterSessionKey: string;
  task: string;
  label: string | null;
  model: string | null;
  spawnMode: "run" | "session";
  cleanup: "delete" | "keep";
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  endedReason: string | null;
  outcome: { status: "ok" | "error" | "timeout"; error: string | null } | null;
};

const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

function deriveRequesterSessionKey(childSessionKey: string, entry: SessionEntry): string {
  const explicit = typeof entry.spawnedBy === "string" ? entry.spawnedBy.trim() : "";
  if (explicit) {
    return explicit;
  }

  const marker = ":subagent:";
  const idx = childSessionKey.lastIndexOf(marker);
  if (idx > 0) {
    return childSessionKey.slice(0, idx);
  }
  return childSessionKey;
}

function deriveTaskName(key: string, entry: SessionEntry): string {
  const title =
    (typeof entry.displayName === "string" && entry.displayName.trim()) ||
    (typeof entry.label === "string" && entry.label.trim()) ||
    (typeof entry.subject === "string" && entry.subject.trim()) ||
    "";
  if (title) {
    return title;
  }

  const tail = key.split(":subagent:").pop();
  return tail && tail.trim() ? tail.trim() : "Subagent task";
}

function normalizeUpdatedAt(entry: SessionEntry): number {
  return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)
    ? entry.updatedAt
    : Date.now();
}

function toRun(key: string, entry: SessionEntry): SerializedRun {
  const updatedAt = normalizeUpdatedAt(entry);
  const active = Date.now() - updatedAt < ACTIVE_WINDOW_MS;
  const endedAt = active ? null : updatedAt;
  const isError = !!entry.abortedLastRun;

  return {
    runId: entry.sessionId || `subagent:${key}`,
    childSessionKey: key,
    requesterSessionKey: deriveRequesterSessionKey(key, entry),
    task: deriveTaskName(key, entry),
    label: typeof entry.label === "string" ? entry.label : null,
    model:
      (typeof entry.model === "string" && entry.model) ||
      (typeof entry.modelOverride === "string" && entry.modelOverride) ||
      null,
    spawnMode: "run",
    cleanup: "keep",
    createdAt: updatedAt,
    startedAt: updatedAt,
    endedAt,
    endedReason: endedAt ? (isError ? "error" : "complete") : null,
    outcome: endedAt
      ? {
          status: isError ? "error" : "ok",
          error: isError ? "Session ended with abortedLastRun=true" : null,
        }
      : null,
  };
}

async function safeReadJson(pathname: string): Promise<SessionStore | null> {
  try {
    const raw = await fsp.readFile(pathname, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as SessionStore;
  } catch {
    return null;
  }
}

async function listSessionStores(): Promise<string[]> {
  const stores = new Set<string>();
  stores.add(path.join(STATE_DIR, "sessions", "sessions.json"));

  try {
    const agentsDir = path.join(STATE_DIR, "agents");
    const entries = await fsp.readdir(agentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      stores.add(path.join(agentsDir, entry.name, "sessions", "sessions.json"));
    }
  } catch {
    // Ignore missing agents directory.
  }

  return Array.from(stores);
}

async function loadSubagentRunsFromSessions(): Promise<SerializedRun[]> {
  const merged = new Map<string, SessionEntry>();

  const stores = await listSessionStores();
  await Promise.all(
    stores.map(async (pathname) => {
      const store = await safeReadJson(pathname);
      if (!store) {
        return;
      }
      for (const [key, entry] of Object.entries(store)) {
        const isSubagentKey = key.includes(":subagent:");
        const isSpawned = (entry.spawnDepth ?? 0) > 0;
        if (!isSubagentKey && !isSpawned) {
          continue;
        }
        const previous = merged.get(key);
        const prevUpdatedAt = previous?.updatedAt ?? 0;
        const nextUpdatedAt = entry?.updatedAt ?? 0;
        if (!previous || nextUpdatedAt >= prevUpdatedAt) {
          merged.set(key, entry || {});
        }
      }
    }),
  );

  return Array.from(merged.entries()).map(([key, entry]) => toRun(key, entry));
}

function sortRuns(runs: SerializedRun[]): SerializedRun[] {
  const out = [...runs];
  out.sort((a, b) => {
    if (!a.endedAt && b.endedAt) {
      return -1;
    }
    if (a.endedAt && !b.endedAt) {
      return 1;
    }
    if (!a.endedAt && !b.endedAt) {
      return (b.startedAt ?? b.createdAt) - (a.startedAt ?? a.createdAt);
    }
    return (b.endedAt ?? 0) - (a.endedAt ?? 0);
  });
  return out;
}

function isDescendantRun(rootSessionKey: string, run: SerializedRun): boolean {
  if (!rootSessionKey) {
    return false;
  }
  if (run.childSessionKey.startsWith(`${rootSessionKey}:subagent:`)) {
    return true;
  }
  if (run.requesterSessionKey === rootSessionKey) {
    return true;
  }
  return run.requesterSessionKey.startsWith(`${rootSessionKey}:subagent:`);
}

export const subagentRunsHandlers: GatewayRequestHandlers = {
  "subagents.list": async ({ params, respond }) => {
    const p = params as {
      requesterSessionKey?: string;
      activeOnly?: boolean;
      limit?: number;
    };

    const limit = typeof p.limit === "number" ? Math.min(p.limit, 500) : 100;
    let runs = await loadSubagentRunsFromSessions();

    if (typeof p.requesterSessionKey === "string" && p.requesterSessionKey.trim()) {
      const requester = p.requesterSessionKey.trim();
      runs = runs.filter((run) => run.requesterSessionKey === requester);
    }

    if (p.activeOnly) {
      runs = runs.filter((run) => !run.endedAt);
    }

    const sorted = sortRuns(runs);
    const limited = sorted.slice(0, limit);
    const activeCount = sorted.filter((run) => !run.endedAt).length;

    respond(
      true,
      {
        runs: limited,
        activeCount,
        totalCount: sorted.length,
      },
      undefined,
    );
  },

  "subagents.countDescendants": async ({ params, respond }) => {
    const p = params as { rootSessionKey?: string };
    const rootSessionKey = typeof p.rootSessionKey === "string" ? p.rootSessionKey.trim() : "";
    if (!rootSessionKey) {
      respond(true, { count: 0 }, undefined);
      return;
    }

    const runs = await loadSubagentRunsFromSessions();
    const count = runs.filter((run) => !run.endedAt && isDescendantRun(rootSessionKey, run)).length;
    respond(true, { count }, undefined);
  },
};
