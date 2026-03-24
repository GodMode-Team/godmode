/**
 * HubSpot connector using REST API v3.
 *
 * Config: { portalId: string }
 * Secret: Private app access token (pat-xxx)
 */

import type { WorkspaceConnector } from "./types.js";

export const hubspotConnector: WorkspaceConnector = {
  type: "hubspot",

  async testConnection(_config, secret) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async search(query, _config, secret) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 10,
          properties: ["firstname", "lastname", "email", "company", "jobtitle"],
        }),
      });
      if (!res.ok) return { results: [] };
      const data = (await res.json()) as { results?: Array<{ properties: Record<string, string>; updatedAt?: string }> };
      return {
        results: (data.results ?? []).map((c) => ({
          title: `${c.properties.firstname ?? ""} ${c.properties.lastname ?? ""}`.trim() || c.properties.email || "Unknown",
          excerpt: [c.properties.jobtitle, c.properties.company].filter(Boolean).join(" at "),
          type: "contact",
          updatedAt: c.updatedAt,
        })),
      };
    } catch {
      return { results: [] };
    }
  },

  async recentActivity(_config, secret, limit = 10) {
    try {
      const res = await fetch(
        `https://api.hubapi.com/crm/v3/objects/deals?limit=${limit}&sorts=-hs_lastmodifieddate&properties=dealname,dealstage,amount,closedate`,
        { headers: { Authorization: `Bearer ${secret}` } },
      );
      if (!res.ok) return { items: [] };
      const data = (await res.json()) as { results?: Array<{ properties: Record<string, string>; updatedAt?: string }> };
      return {
        items: (data.results ?? []).map((d) => ({
          title: d.properties.dealname ?? "Untitled Deal",
          detail: `${d.properties.dealstage ?? ""} — $${d.properties.amount ?? "0"}`,
          timestamp: d.updatedAt ?? new Date().toISOString(),
          type: "deal",
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
