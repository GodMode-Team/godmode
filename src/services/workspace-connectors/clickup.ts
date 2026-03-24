/**
 * ClickUp connector using REST API.
 *
 * Config: { teamId: string }
 * Secret: Personal API token (pk_xxx)
 */

import type { WorkspaceConnector } from "./types.js";

export const clickupConnector: WorkspaceConnector = {
  type: "clickup",

  async testConnection(config, secret) {
    try {
      const res = await fetch(`https://api.clickup.com/api/v2/team/${config.teamId}`, {
        headers: { Authorization: secret },
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const data = (await res.json()) as Record<string, unknown>;
      const team = data.team as Record<string, unknown> | undefined;
      return { ok: true, meta: { teamName: team?.name } };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async search(query, config, secret) {
    try {
      const res = await fetch(
        `https://api.clickup.com/api/v2/team/${config.teamId}/task?` +
        new URLSearchParams({ custom_task_ids: "false", include_closed: "false" }),
        { headers: { Authorization: secret } },
      );
      if (!res.ok) return { results: [] };
      const data = (await res.json()) as { tasks?: Array<Record<string, unknown>> };
      return {
        results: (data.tasks ?? [])
          .filter((t) => String(t.name ?? "").toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10)
          .map((t) => ({
            title: String(t.name ?? ""),
            excerpt: `${(t.status as Record<string, unknown>)?.status ?? ""} — ${(t.list as Record<string, unknown>)?.name ?? ""}`,
            url: t.url ? String(t.url) : undefined,
            type: "task",
            updatedAt: t.date_updated
              ? new Date(Number(t.date_updated)).toISOString()
              : undefined,
          })),
      };
    } catch {
      return { results: [] };
    }
  },

  async recentActivity(config, secret, limit = 10) {
    try {
      const res = await fetch(
        `https://api.clickup.com/api/v2/team/${config.teamId}/task?` +
        new URLSearchParams({
          order_by: "updated",
          reverse: "true",
          subtasks: "true",
          include_closed: "false",
          page: "0",
        }),
        { headers: { Authorization: secret } },
      );
      if (!res.ok) return { items: [] };
      const data = (await res.json()) as { tasks?: Array<Record<string, unknown>> };
      return {
        items: (data.tasks ?? []).slice(0, limit).map((t) => ({
          title: String(t.name ?? ""),
          detail: `${(t.status as Record<string, unknown>)?.status ?? "unknown"} in ${(t.list as Record<string, unknown>)?.name ?? "unknown list"}`,
          timestamp: t.date_updated
            ? new Date(Number(t.date_updated)).toISOString()
            : new Date().toISOString(),
          type: "task",
          url: t.url ? String(t.url) : undefined,
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
