/**
 * Google Drive connector using the `gog` CLI (already installed and configured).
 *
 * Config: { folderId: string, account: string }
 * Secret: not needed — gog uses OAuth stored in its own config
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { WorkspaceConnector } from "./types.js";

const exec = promisify(execFile);

export const googleDriveConnector: WorkspaceConnector = {
  type: "google-drive",

  async testConnection(config) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "ls",
        "--folder-id", config.folderId || "",
        "--account", config.account || "",
        "--client", "godmode",
        "--limit", "1",
      ], { maxBuffer: 1024 * 1024, timeout: 15_000 });
      return { ok: true, meta: { response: stdout.trim().slice(0, 100) } };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async search(query, config) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "search",
        "--query", query,
        "--folder-id", config.folderId || "",
        "--account", config.account || "",
        "--client", "godmode",
        "--limit", "10",
      ], { maxBuffer: 5 * 1024 * 1024, timeout: 30_000 });
      const files = JSON.parse(stdout);
      return {
        results: (Array.isArray(files) ? files : []).map((f: Record<string, unknown>) => ({
          title: String(f.name ?? ""),
          excerpt: String(f.mimeType ?? ""),
          url: f.webViewLink ? String(f.webViewLink) : undefined,
          type: "file",
          updatedAt: f.modifiedTime ? String(f.modifiedTime) : undefined,
        })),
      };
    } catch {
      return { results: [] };
    }
  },

  async recentActivity(config, _secret, limit = 10) {
    try {
      const { stdout } = await exec("gog", [
        "drive", "ls",
        "--folder-id", config.folderId || "",
        "--account", config.account || "",
        "--client", "godmode",
        "--limit", String(limit),
        "--order-by", "modifiedTime desc",
      ], { maxBuffer: 5 * 1024 * 1024, timeout: 30_000 });
      const files = JSON.parse(stdout);
      return {
        items: (Array.isArray(files) ? files : []).map((f: Record<string, unknown>) => ({
          title: String(f.name ?? ""),
          detail: `Modified by ${(f.lastModifyingUser as Record<string, unknown>)?.displayName ?? "unknown"}`,
          timestamp: String(f.modifiedTime ?? new Date().toISOString()),
          type: "file",
          url: f.webViewLink ? String(f.webViewLink) : undefined,
        })),
      };
    } catch {
      return { items: [] };
    }
  },
};
