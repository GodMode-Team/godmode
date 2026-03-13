/**
 * http-handler.ts — HTTP route handler for GodMode endpoints.
 *
 * Serves the GodMode UI, health endpoint, artifact files, Fathom webhook,
 * Mission Control proxy, and legacy /reports/ redirect.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";
import { handleFathomWebhookHttp } from "../methods/fathom-webhook.js";
import {
  isOpsPath,
  requestPathname,
  shouldProxyOpsApiRequest,
  proxyOpsRequest,
} from "../lib/ops-proxy.js";
import type { LicenseState } from "../lib/license.js";

// ── Options file reader (for feature flags) ─────────────────────────
const OPTIONS_FILE_PATH = join(DATA_DIR, "godmode-options.json");
const OPTIONS_CACHE_TTL_MS = 5_000;
let cachedOptions: Record<string, unknown> = {};
let optionsCachedAt = 0;

const OPTIONS_DEFAULTS: Record<string, unknown> = {
  "missionControl.enabled": false,
};

function readOptionsSync(): Record<string, unknown> {
  const now = Date.now();
  if (now - optionsCachedAt < OPTIONS_CACHE_TTL_MS) {
    return cachedOptions;
  }
  try {
    const raw = readFileSync(OPTIONS_FILE_PATH, "utf-8");
    cachedOptions = { ...OPTIONS_DEFAULTS, ...JSON.parse(raw) };
  } catch {
    cachedOptions = { ...OPTIONS_DEFAULTS };
  }
  optionsCachedAt = now;
  return cachedOptions;
}

export interface HttpHandlerDeps {
  pluginVersion: string;
  getLicenseState: () => LicenseState;
  godmodeUiRoot: string | undefined;
  godmodeHandler: ((req: any, res: any) => void) | null;
  methodCount: number;
}

export function createGodmodeHttpHandler(deps: HttpHandlerDeps) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const url = req.url ?? "/";
    const pathname = requestPathname(url);

    // Health endpoint
    if (pathname === "/godmode/health" || pathname === "/godmode/health/") {
      const licenseState = deps.getLicenseState();
      const health = {
        plugin: "godmode",
        version: deps.pluginVersion,
        license: {
          status: licenseState.status,
          tier: licenseState.tier ?? null,
          ...(licenseState.error ? { error: licenseState.error } : {}),
        },
        ui: deps.godmodeUiRoot ? "available" : "not-built",
        methods: deps.methodCount,
      };
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
      res.end(JSON.stringify(health, null, 2));
      return true;
    }

    // Mission Control sidecar proxy
    if (isOpsPath(pathname)) {
      const opts = readOptionsSync();
      if (!opts["missionControl.enabled"]) {
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
        res.end(JSON.stringify({ disabled: true, message: "Mission Control is not enabled. Enable it in GodMode Options." }));
        return true;
      }
      await proxyOpsRequest(req, res);
      return true;
    }

    // Mission Control API fallback
    if (shouldProxyOpsApiRequest(req, pathname)) {
      const opts = readOptionsSync();
      if (!opts["missionControl.enabled"]) {
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
        res.end(JSON.stringify({ disabled: true, message: "Mission Control is not enabled. Enable it in GodMode Options." }));
        return true;
      }
      await proxyOpsRequest(req, res);
      return true;
    }

    // Fathom webhook endpoint
    if (pathname === "/godmode/webhooks/fathom" && req.method === "POST") {
      const chunks: Buffer[] = [];
      req.on("data", (c: Buffer) => chunks.push(c));
      req.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        const body = Buffer.concat(chunks).toString("utf8");
        const hdrs: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.headers)) {
          hdrs[k] = Array.isArray(v) ? v[0] : v ?? "";
        }
        handleFathomWebhookHttp(body, hdrs).catch((err) => {
          console.error("[GodMode] Fathom webhook processing error:", err);
        });
      });
      return true;
    }

    // NOTE: Proof documents are served via RPC (proof.get returns HTML for
    // srcdoc embedding) rather than HTTP proxy, since the gateway's static
    // file handler intercepts all /godmode/* routes before this handler runs.

    // Artifact file server
    if (pathname.startsWith("/godmode/artifacts/")) {
      const fileName = pathname.slice("/godmode/artifacts/".length);
      if (!fileName || fileName.includes("..") || fileName.includes("/")) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
        return true;
      }
      const inboxDir = join(MEMORY_DIR, "inbox");
      const filePath = join(inboxDir, decodeURIComponent(fileName));
      if (!filePath.startsWith(inboxDir) || !existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return true;
      }
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
        const mimeMap: Record<string, string> = {
          html: "text/html; charset=utf-8",
          json: "application/json; charset=utf-8",
          md: "text/plain; charset=utf-8",
          txt: "text/plain; charset=utf-8",
          csv: "text/csv; charset=utf-8",
          pdf: "application/pdf",
        };
        res.writeHead(200, {
          "Content-Type": mimeMap[ext] || "application/octet-stream",
          "Content-Length": content.length,
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff",
        });
        res.end(content);
      } catch {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
      return true;
    }

    // Legacy /reports/ redirect
    if (pathname.startsWith("/reports/")) {
      const fileName = pathname.slice("/reports/".length);
      res.writeHead(302, { Location: `/godmode/artifacts/${fileName}` });
      res.end();
      return true;
    }

    // GodMode UI
    if (pathname === "/godmode" || pathname.startsWith("/godmode/")) {
      if (deps.godmodeHandler) {
        deps.godmodeHandler(req, res);
      } else {
        res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<!DOCTYPE html>
<html><head><title>GodMode — UI Not Built</title>
<style>body{font-family:system-ui;max-width:600px;margin:80px auto;padding:0 20px;color:#e0e0e0;background:#1a1a2e}
h1{color:#ff6b6b}code{background:#16213e;padding:2px 8px;border-radius:4px}a{color:#4ecdc4}</style></head>
<body><h1>GodMode UI Not Available</h1>
<p>The GodMode plugin is loaded but the UI assets haven't been built yet.</p>
<p>Run: <code>pnpm build</code> in the plugin repo, then restart gateway.</p>
<p>Then restart the gateway.</p>
<p><a href="/godmode/health">Check plugin health →</a></p>
</body></html>`);
      }
      return true;
    }

    return false;
  };
}
