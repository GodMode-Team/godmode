/**
 * http-handler.ts — HTTP route handler for GodMode endpoints.
 *
 * Serves the GodMode UI, health endpoint, artifact files, meeting webhook,
 * Paperclip webhook, and legacy /reports/ redirect.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { MEMORY_DIR, ARTIFACTS_DIR } from "../data-paths.js";
import { handleMeetingWebhookHttp } from "../methods/meeting-webhook.js";
import { handlePaperclipWebhookHttp } from "../methods/paperclip-webhook.js";
import type { LicenseState } from "../lib/license.js";
import { audit } from "../lib/audit-log.js";

/**
 * Verify webhook request using HMAC-SHA256 shared secret + timestamp replay protection.
 *
 * Required headers:
 *   X-Webhook-Signature: sha256=<hex digest of HMAC(secret, timestamp + "." + body)>
 *   X-Webhook-Timestamp: <unix seconds>
 *
 * If GODMODE_WEBHOOK_SECRET is not set, webhooks are rejected entirely.
 * Requests older than 5 minutes are rejected (replay protection).
 */
const WEBHOOK_TIMESTAMP_TOLERANCE_SEC = 300; // 5 minutes
const recentNonces = new Set<string>();
setInterval(() => recentNonces.clear(), 10 * 60_000); // clear nonces every 10 min

function verifyWebhookSignature(body: string, req: IncomingMessage): boolean {
  const secret = process.env.GODMODE_WEBHOOK_SECRET;
  if (!secret) return false; // No secret configured = reject all webhooks

  // Timestamp validation — reject stale or missing
  const tsHeader = req.headers["x-webhook-timestamp"];
  const timestamp = typeof tsHeader === "string" ? tsHeader : "";
  const tsNum = Number(timestamp);
  if (!timestamp || !Number.isFinite(tsNum)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - tsNum) > WEBHOOK_TIMESTAMP_TOLERANCE_SEC) return false;

  // Signature validation — HMAC binds timestamp + body
  const sigHeader = req.headers["x-webhook-signature"];
  const provided = typeof sigHeader === "string" ? sigHeader : "";
  if (!provided.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret)
    .update(timestamp + "." + body).digest("hex");
  if (provided.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return false;

  // Replay protection — reject duplicate signatures
  const sig = provided.slice(7);
  if (recentNonces.has(sig)) return false;
  recentNonces.add(sig);
  return true;
}

// ── Simple rate limiter (per-IP, sliding window) ────────────────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

function isRateLimited(req: IncomingMessage): boolean {
  const ip = req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  // Prune old entries
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Periodically clean stale entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, recent);
  }
}, 5 * 60_000);

function requestPathname(url: string): string {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    const [pathname] = url.split("?", 1);
    return pathname || "/";
  }
}

export interface HttpHandlerDeps {
  pluginVersion: string;
  getLicenseState: () => LicenseState;
  godmodeUiRoot: string | undefined;
  godmodeHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null;
  methodCount: number;
}

export function createGodmodeHttpHandler(deps: HttpHandlerDeps) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const url = req.url ?? "/";
    const pathname = requestPathname(url);

    // Rate limiting — reject if too many requests from this IP
    if (isRateLimited(req)) {
      audit("ratelimit.hit", { ip: req.socket.remoteAddress, pathname });
      res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "60" });
      res.end(JSON.stringify({ error: "Too many requests" }));
      return true;
    }

    // Health endpoint
    if (pathname === "/godmode/health" || pathname === "/godmode/health/") {
      const licenseState = deps.getLicenseState();
      let memoryStatus: string = "unknown";
      try {
        const { getMemoryStatus } = await import("../lib/memory.js");
        memoryStatus = getMemoryStatus();
      } catch { /* non-fatal */ }
      const health = {
        plugin: "godmode",
        version: deps.pluginVersion,
        license: {
          status: licenseState.status,
          tier: licenseState.tier ?? null,
          ...(licenseState.error ? { error: licenseState.error } : {}),
        },
        memoryStatus,
        ui: deps.godmodeUiRoot ? "available" : "not-built",
        methods: deps.methodCount,
      };
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
      res.end(JSON.stringify(health, null, 2));
      return true;
    }

    // Generic meeting webhook endpoint (works with Fathom, Otter, etc.)
    if (pathname === "/godmode/webhooks/meeting" && req.method === "POST") {
      const chunks: Buffer[] = [];
      req.on("data", (c: Buffer) => chunks.push(c));
      req.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        if (!verifyWebhookSignature(body, req)) {
          audit("webhook.rejected", { endpoint: "meeting", ip: req.socket.remoteAddress });
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid or missing webhook signature" }));
          return;
        }
        audit("webhook.received", { endpoint: "meeting", ip: req.socket.remoteAddress });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        const hdrs: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.headers)) {
          hdrs[k] = Array.isArray(v) ? v[0] : v ?? "";
        }
        handleMeetingWebhookHttp(body, hdrs).catch((err) => {
          console.error("[GodMode] Meeting webhook processing error:", err);
        });
      });
      return true;
    }

    // Paperclip webhook endpoint
    if (pathname === "/godmode/webhooks/paperclip" && req.method === "POST") {
      const chunks: Buffer[] = [];
      req.on("data", (c: Buffer) => chunks.push(c));
      req.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        if (!verifyWebhookSignature(body, req)) {
          audit("webhook.rejected", { endpoint: "paperclip", ip: req.socket.remoteAddress });
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid or missing webhook signature" }));
          return;
        }
        audit("webhook.received", { endpoint: "paperclip", ip: req.socket.remoteAddress });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        handlePaperclipWebhookHttp(body).catch((err) => {
          console.error("[GodMode] Paperclip webhook processing error:", err);
        });
      });
      return true;
    }

    // Artifact file server — serves from ~/godmode/artifacts/ (primary)
    // and ~/godmode/memory/inbox/ (fallback for queue agent output).
    if (pathname.startsWith("/godmode/artifacts/")) {
      const relativePath = pathname.slice("/godmode/artifacts/".length);
      if (!relativePath || relativePath.includes("..")) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
        return true;
      }
      const decoded = decodeURIComponent(relativePath);
      const searchDirs = [ARTIFACTS_DIR, join(MEMORY_DIR, "inbox")];
      let resolvedPath: string | null = null;
      for (const dir of searchDirs) {
        const candidate = join(dir, decoded);
        if (candidate.startsWith(dir) && existsSync(candidate)) {
          resolvedPath = candidate;
          break;
        }
      }
      if (!resolvedPath) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return true;
      }
      try {
        const content = readFileSync(resolvedPath);
        const ext = resolvedPath.split(".").pop()?.toLowerCase() ?? "";
        const mimeMap: Record<string, string> = {
          html: "text/html; charset=utf-8",
          htm: "text/html; charset=utf-8",
          json: "application/json; charset=utf-8",
          md: "text/plain; charset=utf-8",
          txt: "text/plain; charset=utf-8",
          csv: "text/csv; charset=utf-8",
          pdf: "application/pdf",
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          svg: "image/svg+xml",
          webp: "image/webp",
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
