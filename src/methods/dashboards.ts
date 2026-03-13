/**
 * GodMode — Dashboards
 *
 * Custom data views built by AI allies — conversation-driven, regenerable on demand.
 * Dashboards are stored as HTML files in ~/godmode/data/dashboards/{id}/index.html.
 *
 * RPC methods:
 *   dashboards.list       — list all dashboards, filter by scope
 *   dashboards.get        — get manifest + HTML for a dashboard
 *   dashboards.save       — create or update a dashboard
 *   dashboards.remove     — delete a dashboard
 *   dashboards.setActive  — set which dashboard shows by default
 *   dashboards.widgetData — fetch live data for widget types
 */

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { DATA_DIR, GODMODE_ROOT, MEMORY_DIR, localDateString } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const DASHBOARDS_DIR = path.join(DATA_DIR, "dashboards");
const DASHBOARDS_INDEX = path.join(DASHBOARDS_DIR, "index.json");

// ── Types ────────────────────────────────────────────────────────────

type DashboardManifest = {
  id: string;
  title: string;
  description?: string;
  scope: "global" | string;
  createdAt: string;
  updatedAt: string;
  createdBy: "agent" | "user";
  widgets?: string[];
  pinned?: boolean;
  sessionId?: string | null;
  archived?: boolean;
  archivedAt?: string;
};

type DashboardIndex = {
  version: 1;
  dashboards: DashboardManifest[];
  activeDashboard?: string;
};

// ── Helpers ──────────────────────────────────────────────────────────

async function readIndex(): Promise<DashboardIndex> {
  try {
    const raw = await fs.readFile(DASHBOARDS_INDEX, "utf-8");
    return JSON.parse(raw) as DashboardIndex;
  } catch {
    return { version: 1, dashboards: [] };
  }
}

async function writeIndex(index: DashboardIndex): Promise<void> {
  await secureMkdir(DASHBOARDS_DIR);
  await secureWriteFile(DASHBOARDS_INDEX, JSON.stringify(index, null, 2) + "\n");
}

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function safeReadJson(filePath: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// ── List ─────────────────────────────────────────────────────────────

const list: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as { scope?: string; includeArchived?: boolean };
  const index = await readIndex();
  let dashboards = index.dashboards;

  // Hide archived dashboards unless explicitly requested
  if (!p.includeArchived) {
    dashboards = dashboards.filter((d) => !d.archived);
  }

  if (typeof p.scope === "string" && p.scope.trim()) {
    dashboards = dashboards.filter(
      (d) => d.scope === p.scope || d.scope === "global",
    );
  }

  respond(true, {
    dashboards,
    activeDashboard: index.activeDashboard ?? null,
    count: dashboards.length,
  });
};

// ── Get ──────────────────────────────────────────────────────────────

const get: GatewayRequestHandler = async ({ params, respond }) => {
  const rawId = typeof params.id === "string" ? params.id.trim() : "";
  if (!rawId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  // SECURITY: Sanitize id to prevent path traversal (e.g., ../../etc)
  const id = sanitizeSlug(rawId);

  const index = await readIndex();
  const manifest = index.dashboards.find((d) => d.id === id);
  if (!manifest) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Dashboard not found: ${id}` });
    return;
  }

  // Try subdirectory layout first ({id}/index.html), then flat file ({id}.html)
  const htmlPath = path.join(DASHBOARDS_DIR, id, "index.html");
  const flatPath = path.join(DASHBOARDS_DIR, `${id}.html`);
  let html = "";
  try {
    html = await fs.readFile(htmlPath, "utf-8");
  } catch {
    try {
      html = await fs.readFile(flatPath, "utf-8");
    } catch {
      html = `<div style="padding: 2rem; text-align: center; color: var(--muted);">Dashboard "${manifest.title}" has no content yet.</div>`;
    }
  }

  respond(true, { manifest, html });
};

// ── Save (Create / Update) ───────────────────────────────────────────

const save: GatewayRequestHandler = async ({ params, respond }) => {
  const p = params as {
    id?: string;
    title?: string;
    description?: string;
    html?: string;
    scope?: string;
    widgets?: string[];
    pinned?: boolean;
  };

  const title = typeof p.title === "string" ? p.title.trim() : "";
  if (!title) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "title is required" });
    return;
  }

  const index = await readIndex();
  // Always sanitize the ID to prevent path traversal (e.g., `../../etc`)
  const rawId = typeof p.id === "string" && p.id.trim() ? p.id.trim() : title;
  const id = sanitizeSlug(rawId);

  const now = new Date().toISOString();
  const existingIdx = index.dashboards.findIndex((d) => d.id === id);

  const manifest: DashboardManifest = {
    id,
    title,
    description: typeof p.description === "string" ? p.description : undefined,
    scope: typeof p.scope === "string" ? p.scope : "global",
    createdAt:
      existingIdx >= 0 ? index.dashboards[existingIdx].createdAt : now,
    updatedAt: now,
    createdBy: "agent",
    widgets: Array.isArray(p.widgets) ? p.widgets : undefined,
    pinned: typeof p.pinned === "boolean" ? p.pinned : undefined,
  };

  if (existingIdx >= 0) {
    index.dashboards[existingIdx] = manifest;
  } else {
    index.dashboards.push(manifest);
  }

  // Write HTML file
  const dashDir = path.join(DASHBOARDS_DIR, id);
  await secureMkdir(dashDir);

  if (typeof p.html === "string") {
    await secureWriteFile(path.join(dashDir, "index.html"), p.html);
  }

  // Write individual manifest
  await secureWriteFile(
    path.join(dashDir, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  await writeIndex(index);
  respond(true, { ok: true, id, manifest });
};

/**
 * Standalone save — callable from hooks (no RPC plumbing needed).
 * Returns { ok: true, id } on success, { ok: false } on failure.
 */
export async function saveDashboardDirect(opts: {
  title: string;
  html: string;
  scope?: string;
  description?: string;
}): Promise<{ ok: boolean; id?: string }> {
  try {
    const title = opts.title.trim();
    if (!title || !opts.html) return { ok: false };

    const id = sanitizeSlug(title);
    const now = new Date().toISOString();
    const index = await readIndex();
    const existingIdx = index.dashboards.findIndex((d) => d.id === id);

    const manifest: DashboardManifest = {
      id,
      title,
      description: opts.description,
      scope: opts.scope ?? "global",
      createdAt: existingIdx >= 0 ? index.dashboards[existingIdx].createdAt : now,
      updatedAt: now,
      createdBy: "agent",
    };

    if (existingIdx >= 0) {
      index.dashboards[existingIdx] = manifest;
    } else {
      index.dashboards.push(manifest);
    }

    const dashDir = path.join(DASHBOARDS_DIR, id);
    await secureMkdir(dashDir);
    await secureWriteFile(path.join(dashDir, "index.html"), opts.html);
    await secureWriteFile(
      path.join(dashDir, "manifest.json"),
      JSON.stringify(manifest, null, 2) + "\n",
    );
    await writeIndex(index);
    return { ok: true, id };
  } catch {
    return { ok: false };
  }
}

// ── Remove ───────────────────────────────────────────────────────────

const remove: GatewayRequestHandler = async ({ params, respond }) => {
  const rawId = typeof params.id === "string" ? params.id.trim() : "";
  if (!rawId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }
  // SECURITY: Sanitize id to prevent path traversal
  const id = sanitizeSlug(rawId);

  const index = await readIndex();
  const dashboard = index.dashboards.find((d) => d.id === id);

  if (!dashboard) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Dashboard not found: ${id}` });
    return;
  }

  if (index.activeDashboard === id) {
    index.activeDashboard = undefined;
  }

  // Soft-archive: flag it instead of deleting files
  dashboard.archived = true;
  dashboard.archivedAt = new Date().toISOString();

  await writeIndex(index);
  respond(true, { ok: true, archived: id });
};

// ── Set Active ───────────────────────────────────────────────────────

const setActive: GatewayRequestHandler = async ({ params, respond }) => {
  const id = typeof params.id === "string" ? params.id.trim() : null;

  const index = await readIndex();
  if (id && !index.dashboards.some((d) => d.id === id)) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Dashboard not found: ${id}` });
    return;
  }

  index.activeDashboard = id ?? undefined;
  await writeIndex(index);
  respond(true, { ok: true, activeDashboard: index.activeDashboard ?? null });
};

// ── Widget Data ──────────────────────────────────────────────────────

const widgetData: GatewayRequestHandler = async ({ params, respond }) => {
  const widgets = Array.isArray(params.widgets)
    ? (params.widgets as string[])
    : [];

  const data: Record<string, unknown> = {};
  const today = localDateString();

  for (const widgetId of widgets) {
    try {
      switch (widgetId) {
        case "tasks-summary": {
          const raw = safeReadJson(path.join(DATA_DIR, "tasks.json")) as {
            tasks?: Array<{ status: string; dueDate?: string; priority?: string }>;
          } | null;
          const tasks = raw?.tasks ?? [];
          const pending = tasks.filter((t) => t.status === "pending");
          const completed = tasks.filter((t) => t.status === "complete");
          const overdue = pending.filter(
            (t) => t.dueDate && t.dueDate < today,
          );
          const high = pending.filter((t) => t.priority === "high");
          data[widgetId] = {
            total: tasks.length,
            pending: pending.length,
            completed: completed.length,
            overdue: overdue.length,
            highPriority: high.length,
          };
          break;
        }

        case "tasks-today": {
          const raw = safeReadJson(path.join(DATA_DIR, "tasks.json")) as {
            tasks?: Array<{
              title: string;
              status: string;
              dueDate?: string;
              priority?: string;
            }>;
          } | null;
          const tasks = raw?.tasks ?? [];
          const todayTasks = tasks.filter(
            (t) =>
              (t.dueDate === today || (!t.dueDate && t.status === "pending")) &&
              t.status !== "complete",
          );
          const completedToday = tasks.filter(
            (t) => t.status === "complete" && t.dueDate === today,
          );
          data[widgetId] = {
            pending: todayTasks.map((t) => ({
              title: t.title,
              priority: t.priority,
            })),
            completed: completedToday.map((t) => ({ title: t.title })),
          };
          break;
        }


        case "goals-progress": {
          const raw = safeReadJson(path.join(DATA_DIR, "goals.json")) as {
            goals?: Array<{
              title: string;
              area?: string;
              progress?: number;
              status?: string;
            }>;
          } | null;
          const goals = raw?.goals ?? [];
          data[widgetId] = {
            goals: goals.map((g) => ({
              title: g.title,
              area: g.area,
              progress: g.progress ?? 0,
              status: g.status ?? "active",
            })),
            total: goals.length,
            avgProgress:
              goals.length > 0
                ? Math.round(
                    goals.reduce((s, g) => s + (g.progress ?? 0), 0) /
                      goals.length,
                  )
                : 0,
          };
          break;
        }

        case "agent-activity": {
          const logPath = path.join(
            MEMORY_DIR,
            "agent-log",
            `${today}.json`,
          );
          const raw = safeReadJson(logPath) as {
            completed?: Array<{ item: string }>;
            errors?: Array<{ error: string }>;
            queue?: Array<{ item: string }>;
            needsReview?: Array<{ item: string }>;
          } | null;
          data[widgetId] = raw
            ? {
                completed: raw.completed?.length ?? 0,
                errors: raw.errors?.length ?? 0,
                queue: raw.queue?.length ?? 0,
                needsReview: raw.needsReview?.length ?? 0,
                recentCompleted: (raw.completed ?? [])
                  .slice(-5)
                  .map((c) => c.item),
              }
            : { completed: 0, errors: 0, queue: 0, needsReview: 0, recentCompleted: [] };
          break;
        }

        case "queue-status": {
          const raw = safeReadJson(
            path.join(DATA_DIR, "queue.json"),
          ) as {
            items?: Array<{ status: string; type?: string }>;
          } | null;
          const items = raw?.items ?? [];
          data[widgetId] = {
            pending: items.filter((i) => i.status === "pending").length,
            processing: items.filter((i) => i.status === "processing").length,
            review: items.filter((i) => i.status === "review").length,
            done: items.filter((i) => i.status === "done").length,
            failed: items.filter((i) => i.status === "failed").length,
            total: items.length,
          };
          break;
        }


        case "trust-scores": {
          const raw = safeReadJson(
            path.join(DATA_DIR, "trust-tracker.json"),
          ) as {
            workflows?: string[];
            ratings?: Array<{
              workflow: string;
              rating: number;
              timestamp: number;
            }>;
            dailyRatings?: Array<{
              rating: number;
              date: string;
            }>;
          } | null;
          if (raw) {
            const ratings = raw.ratings ?? [];
            const workflows = raw.workflows ?? [];
            const summaries: Record<
              string,
              { avg: number; count: number }
            > = {};
            for (const w of workflows) {
              const wRatings = ratings.filter((r) => r.workflow === w);
              const avg =
                wRatings.length > 0
                  ? Math.round(
                      (wRatings.reduce((s, r) => s + r.rating, 0) /
                        wRatings.length) *
                        10,
                    ) / 10
                  : 0;
              summaries[w] = { avg, count: wRatings.length };
            }
            const daily = raw.dailyRatings ?? [];
            const recentDaily = daily.slice(-7);
            data[widgetId] = {
              workflows: summaries,
              totalRatings: ratings.length,
              recentDailyRatings: recentDaily,
            };
          } else {
            data[widgetId] = null;
          }
          break;
        }

        case "wheel-of-life": {
          const wheelPath = path.join(
            process.env.OPENCLAW_STATE_DIR ||
              path.join(homedir(), ".openclaw"),
            "dashboards",
            "data",
            "wheel-of-life.json",
          );
          const raw = safeReadJson(wheelPath) as {
            scores?: Record<
              string,
              { current?: number; target?: number; trend?: string }
            >;
          } | null;
          data[widgetId] = raw?.scores ?? null;
          break;
        }


        case "recent-files": {
          // List most recently modified files across ~/godmode/memory/
          const recentFiles: Array<{
            name: string;
            path: string;
            modified: string;
          }> = [];
          const scanRecent = (dir: string, depth: number) => {
            if (depth > 3 || recentFiles.length >= 10) return;
            try {
              const entries = readdirSync(dir, { withFileTypes: true });
              for (const e of entries) {
                if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
                const fp = path.join(dir, e.name);
                if (e.isDirectory()) {
                  if (
                    !["node_modules", ".git", "dist", "build"].includes(
                      e.name,
                    )
                  ) {
                    scanRecent(fp, depth + 1);
                  }
                } else {
                  const ext = path.extname(e.name).toLowerCase();
                  if ([".md", ".txt", ".json", ".html"].includes(ext)) {
                    try {
                      const st = statSync(fp);
                      recentFiles.push({
                        name: e.name,
                        path: path.relative(GODMODE_ROOT, fp),
                        modified: st.mtime.toISOString(),
                      });
                    } catch {
                      /* skip */
                    }
                  }
                }
              }
            } catch {
              /* skip */
            }
          };
          scanRecent(MEMORY_DIR, 0);
          recentFiles.sort((a, b) => b.modified.localeCompare(a.modified));
          data[widgetId] = recentFiles.slice(0, 10);
          break;
        }

        case "brief-summary": {
          // Read today's daily brief summary data from vault
          const vaultPath =
            process.env.OBSIDIAN_VAULT_PATH ||
            path.join(homedir(), "Documents", "VAULT");
          const briefFolder = process.env.DAILY_BRIEF_FOLDER || "01-Daily";
          const briefPath = path.join(vaultPath, briefFolder, `${today}.md`);
          try {
            const content = readFileSync(briefPath, "utf-8");
            const checkboxes = content.match(/- \[[ x]\]/g) ?? [];
            const checked = checkboxes.filter((c) => c.includes("[x]")).length;
            data[widgetId] = {
              exists: true,
              totalCheckboxes: checkboxes.length,
              completedCheckboxes: checked,
              lineCount: content.split("\n").length,
            };
          } catch {
            data[widgetId] = { exists: false };
          }
          break;
        }

        case "weather": {
          // Read weather from cached data or return null
          // (actual weather fetching happens via cron/intel, we just read cached)
          data[widgetId] = null; // placeholder — will be populated by agents when building HTML
          break;
        }

        case "streak-stats": {
          const ttRaw = safeReadJson(
            path.join(DATA_DIR, "trust-tracker.json"),
          ) as { dailyRatings?: Array<{ date: string; rating: number }> } | null;
          const dailyRatings = ttRaw?.dailyRatings ?? [];
          // Calculate daily rating streak (consecutive days rated)
          let dailyStreak = 0;
          const sortedDays = dailyRatings
            .map((r) => r.date)
            .sort()
            .reverse();
          if (sortedDays.length > 0) {
            const d = new Date();
            for (let i = 0; i < sortedDays.length; i++) {
              const expected = localDateString(
                new Date(d.getTime() - i * 86400000),
              );
              if (sortedDays[i] === expected) {
                dailyStreak++;
              } else {
                break;
              }
            }
          }
          data[widgetId] = {
            dailyRatingStreak: dailyStreak,
          };
          break;
        }

        case "workspace-stats": {
          // Read workspace config and count basic stats
          const configPath = path.join(DATA_DIR, "workspaces.json5");
          try {
            const JSON5 = (await import("json5")).default;
            const raw = JSON5.parse(readFileSync(configPath, "utf-8")) as {
              workspaces?: Array<{
                id: string;
                name: string;
                type: string;
                emoji?: string;
              }>;
            };
            const workspaces = raw.workspaces ?? [];
            data[widgetId] = {
              total: workspaces.length,
              byType: {
                personal: workspaces.filter((w) => w.type === "personal")
                  .length,
                project: workspaces.filter((w) => w.type === "project").length,
                team: workspaces.filter((w) => w.type === "team").length,
              },
              list: workspaces.map((w) => ({
                id: w.id,
                name: w.name,
                emoji: w.emoji,
                type: w.type,
              })),
            };
          } catch {
            data[widgetId] = null;
          }
          break;
        }

        case "calendar-today": {
          // Calendar data fetched by the agent at render time, not by us
          data[widgetId] = null; // placeholder
          break;
        }

        default: {
          data[widgetId] = null;
        }
      }
    } catch {
      data[widgetId] = null;
    }
  }

  respond(true, { data, timestamp: new Date().toISOString() });
};

// ── Open Session ─────────────────────────────────────────────────────

/**
 * dashboards.openSession — Opens (or creates) a linked chat session for a dashboard.
 *
 * If the dashboard already has a sessionId, returns it.
 * Otherwise, generates a new session key (webchat format), stores it on
 * the dashboard manifest, and returns it. The UI navigates to the returned session.
 */
const openSession: GatewayRequestHandler = async ({ params, respond }) => {
  const dashboardId = typeof params.dashboardId === "string" ? params.dashboardId.trim() : "";
  if (!dashboardId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "dashboardId is required" });
    return;
  }

  const index = await readIndex();
  const dashboard = index.dashboards.find((d) => d.id === dashboardId);
  if (!dashboard) {
    respond(false, undefined, { code: "NOT_FOUND", message: `Dashboard not found: ${dashboardId}` });
    return;
  }

  let created = false;
  let sessionId = dashboard.sessionId;

  if (!sessionId) {
    const uuid = randomUUID();
    sessionId = `agent:main:webchat-${uuid.slice(0, 8)}`;
    dashboard.sessionId = sessionId;
    await writeIndex(index);

    // Also update the individual manifest file
    const dashDir = path.join(DASHBOARDS_DIR, dashboardId);
    try {
      await secureWriteFile(
        path.join(dashDir, "manifest.json"),
        JSON.stringify(dashboard, null, 2) + "\n",
      );
    } catch { /* non-critical */ }

    created = true;
  }

  respond(true, { sessionId, created, manifest: dashboard });
};

// ── Export ────────────────────────────────────────────────────────────

export const dashboardsHandlers: GatewayRequestHandlers = {
  "dashboards.list": list,
  "dashboards.get": get,
  "dashboards.save": save,
  "dashboards.remove": remove,
  "dashboards.setActive": setActive,
  "dashboards.widgetData": widgetData,
  "dashboards.openSession": openSession,
};
