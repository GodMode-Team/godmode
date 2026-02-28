/**
 * GodMode Plugin — Personal AI Operating System
 *
 * Registers all GodMode gateway methods, UI routes, and services
 * into the OpenClaw plugin system.
 *
 * IMPORTANT: register() is intentionally SYNCHRONOUS so the plugin loader
 * can't silently drop it. License validation is deferred to first RPC call
 * via a license gate wrapper.
 */

import { existsSync, readFileSync } from "node:fs";
import {
  request as httpRequest,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type OutgoingHttpHeaders,
  type ServerResponse,
} from "node:http";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
// Method handler imports
import { agentLogHandlers } from "./src/methods/agent-log.js";
import { briefNotesHandlers } from "./src/methods/brief-notes.js";
import { calendarHandlers } from "./src/methods/calendar.js";
// clickup removed — stub, not shipping
import { consciousnessHandlers } from "./src/methods/consciousness.js";
import { dailyBriefHandlers } from "./src/methods/daily-brief.js";
import { briefGeneratorHandlers } from "./src/methods/brief-generator.js";
import { dataSourcesHandlers } from "./src/methods/data-sources.js";
import { goalsHandlers } from "./src/methods/goals.js";
// inner-work removed — stub, not shipping
import { lifeDashboardsHandlers } from "./src/methods/life-dashboards.js";
// lifetracks hidden — deferred, keeping code for future
import { onboardingHandlers } from "./src/methods/onboarding.js";
import { peopleDataHandlers } from "./src/methods/people-data.js";
import { projectsHandlers } from "./src/methods/projects.js";
import { subagentRunsHandlers } from "./src/methods/subagent-runs.js";
import { createCodingTaskHandlers } from "./src/methods/coding-tasks.js";
import { tasksHandlers } from "./src/methods/tasks.js";
import { teamCommsHandlers } from "./src/methods/team-comms.js";
import { teamCurationHandlers } from "./src/methods/team-curation.js";
import { teamWorkspaceHandlers } from "./src/methods/team-workspace.js";
import { createTeamMessageTool } from "./src/tools/team-message.js";
import { createTeamMemoryWriteTool } from "./src/tools/team-memory.js";
import { createCodingTaskTool } from "./src/tools/coding-task.js";
// therapy handlers deprecated — old code, not shipping in plugin
import { uiSlotsHandlers } from "./src/methods/ui-slots.js";
import { workspacesHandlers } from "./src/methods/workspaces.js";
import { focusPulseHandlers } from "./src/methods/focus-pulse.js";
import { optionsHandlers } from "./src/methods/options.js";
import { trustTrackerHandlers } from "./src/methods/trust-tracker.js";
import { sessionArchiveHandlers } from "./src/methods/session-archive.js";
import { systemUpdateHandlers, setPluginVersion, runPostUpdateHealthCheck } from "./src/methods/system-update.js";
import { createTrustRateTool } from "./src/tools/trust-rate.js";
import { createOnboardTool } from "./src/tools/onboard.js";
import { initAgentLogWriter } from "./src/services/agent-log-writer.js";
import { CodingOrchestrator } from "./src/services/coding-orchestrator.js";
import { CodingNotificationService } from "./src/services/coding-notification.js";
import {
  trackToolCall,
  checkGrepOnMemory,
  cleanWorkingMd,
  trackSearchUsage,
  checkLazyRefusal,
  consumeSearchGateNudge,
  resetSearchTracking,
} from "./src/hooks/safety-gates.js";
import { isGateEnabled } from "./src/services/guardrails.js";
import { guardrailsHandlers } from "./src/methods/guardrails.js";
import { imageCacheHandlers } from "./src/methods/image-cache.js";
import { coretexHandlers } from "./src/methods/coretex.js";
// Static file server for UIs
import { createStaticFileHandler } from "./src/static-server.js";
import { DATA_DIR } from "./src/data-paths.js";

// ── Options file reader (for feature flags in HTTP handler) ─────────
const OPTIONS_FILE_PATH = join(DATA_DIR, "godmode-options.json");
const OPTIONS_CACHE_TTL_MS = 5_000; // re-read every 5 seconds max
let cachedOptions: Record<string, unknown> = {};
let optionsCachedAt = 0;

const OPTIONS_DEFAULTS: Record<string, unknown> = {
  "focusPulse.enabled": true,
  "deck.enabled": false,
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

// ── Version ───────────────────────────────────────────────────────────
// Read from package.json at load time so it can't drift
let pluginVersion = "1.0.0";
try {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const packageJsonCandidates = [join(moduleDir, "package.json"), join(moduleDir, "..", "package.json")];
  for (const candidate of packageJsonCandidates) {
    if (!existsSync(candidate)) {
      continue;
    }
    const pkg = JSON.parse(readFileSync(candidate, "utf8"));
    pluginVersion = pkg.version ?? pluginVersion;
    break;
  }
} catch {
  // Bundled installs may not have package.json alongside index.js
}
setPluginVersion(pluginVersion);

// ── License validation ─────────────────────────────────────────────
// Each installation requires a valid license key in openclaw.json:
//   { "plugins": { "entries": { "godmode": { "config": { "licenseKey": "GM-..." } } } } }
// Keys are validated lazily on first RPC call — register() stays synchronous.

const LICENSE_API_URL = "https://lifeongodmode.com/api/v1/license/validate";
const LICENSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type LicenseState = {
  status: "pending" | "validating" | "valid" | "invalid" | "no-key";
  tier?: string;
  checkedAt?: number;
  error?: string;
};

let licenseState: LicenseState = { status: "pending" };
let validationPromise: Promise<boolean> | null = null;

function isDevKey(key: string): boolean {
  return key.startsWith("GM-DEV-") || key === "GM-INTERNAL";
}

async function validateLicense(
  key: string,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
): Promise<boolean> {
  // Dev/internal keys bypass remote validation
  if (isDevKey(key)) {
    licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
    return true;
  }

  // Check cache
  if (
    licenseState.status === "valid" &&
    licenseState.checkedAt &&
    Date.now() - licenseState.checkedAt < LICENSE_CACHE_TTL_MS
  ) {
    return true;
  }

  licenseState = { ...licenseState, status: "validating" };

  try {
    const res = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const body = (await res.json()) as { valid: boolean; tier?: string };
      if (body.valid) {
        licenseState = { status: "valid", checkedAt: Date.now(), tier: body.tier };
        logger.info(`[GodMode] License validated (tier: ${body.tier ?? "standard"})`);
        return true;
      }
      licenseState = {
        status: "invalid",
        checkedAt: Date.now(),
        error: "License key rejected by server",
      };
      return false;
    }
    // Non-OK response
    licenseState = {
      status: "invalid",
      checkedAt: Date.now(),
      error: `License server returned ${res.status}`,
    };
    return false;
  } catch (err) {
    // Network error — allow grace period if previously validated
    if (licenseState.checkedAt && licenseState.tier) {
      logger.warn("[GodMode] License server unreachable — using cached validation");
      licenseState = {
        status: "valid",
        checkedAt: licenseState.checkedAt,
        tier: licenseState.tier,
      };
      return true;
    }
    licenseState = {
      status: "invalid",
      checkedAt: Date.now(),
      error: `Network error: ${err instanceof Error ? err.message : "unknown"}`,
    };
    return false;
  }
}

/**
 * Wraps an RPC handler with a license gate. On first call, triggers async
 * license validation. Subsequent calls use cached result. If license is
 * invalid, responds with LICENSE_REQUIRED error.
 */
function withLicenseGate(
  key: string | undefined,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
  handler: Function,
): Function {
  return async (ctx: { respond: Function; [k: string]: unknown }) => {
    // No key configured
    if (!key) {
      ctx.respond(false, undefined, {
        code: "LICENSE_REQUIRED",
        message:
          "GodMode license key not configured. Add licenseKey to your plugin config in openclaw.json.",
      });
      return;
    }

    // Dev keys pass through immediately
    if (isDevKey(key)) {
      if (licenseState.status === "pending") {
        licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
      }
      return handler(ctx);
    }

    // First caller triggers validation; concurrent callers wait on same promise
    if (licenseState.status === "pending" || licenseState.status === "validating") {
      if (!validationPromise) {
        validationPromise = validateLicense(key, logger).finally(() => {
          validationPromise = null;
        });
      }
      await validationPromise;
    }

    // Re-validate if cache expired
    if (
      licenseState.status === "valid" &&
      licenseState.checkedAt &&
      Date.now() - licenseState.checkedAt >= LICENSE_CACHE_TTL_MS
    ) {
      if (!validationPromise) {
        validationPromise = validateLicense(key, logger).finally(() => {
          validationPromise = null;
        });
      }
      await validationPromise;
    }

    if (licenseState.status !== "valid") {
      ctx.respond(false, undefined, {
        code: "LICENSE_INVALID",
        message: licenseState.error ?? "GodMode license is invalid or expired.",
      });
      return;
    }

    return handler(ctx);
  };
}

const OPS_PROXY_PREFIX = "/ops";
const OPS_PROXY_HOST = "127.0.0.1";
const OPS_PROXY_PORT = 3456;
const OPS_PROXY_ORIGIN = `http://${OPS_PROXY_HOST}:${OPS_PROXY_PORT}`;

function isOpsPath(pathname: string): boolean {
  return pathname === OPS_PROXY_PREFIX || pathname.startsWith(`${OPS_PROXY_PREFIX}/`);
}

function requestPathname(url: string): string {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    const [pathname] = url.split("?", 1);
    return pathname || "/";
  }
}

function stripOpsPrefix(pathname: string): string {
  if (pathname === OPS_PROXY_PREFIX || pathname === `${OPS_PROXY_PREFIX}/`) {
    return "/";
  }
  const stripped = pathname.slice(OPS_PROXY_PREFIX.length);
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function appendForwardedFor(
  existing: string | string[] | undefined,
  remoteAddress?: string | null,
): string | undefined {
  const prior = Array.isArray(existing) ? existing.join(", ") : existing;
  if (remoteAddress && prior) {
    return `${prior}, ${remoteAddress}`;
  }
  return remoteAddress ?? prior;
}

function isApiPath(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function isOpsReferer(referer: string): boolean {
  try {
    return isOpsPath(new URL(referer, "http://localhost").pathname);
  } catch {
    return referer === OPS_PROXY_PREFIX || referer.startsWith(`${OPS_PROXY_PREFIX}/`);
  }
}

function shouldProxyOpsApiRequest(req: IncomingMessage, pathname: string): boolean {
  if (!isApiPath(pathname)) {
    return false;
  }
  const referer = firstHeaderValue(req.headers.referer);
  if (!referer) {
    return false;
  }
  return isOpsReferer(referer);
}

function rewriteOpsLocationHeader(location: string): string {
  if (location.startsWith(`${OPS_PROXY_PREFIX}/`) || location === OPS_PROXY_PREFIX) {
    return location;
  }

  if (location.startsWith("/")) {
    return `${OPS_PROXY_PREFIX}${location}`;
  }

  try {
    const parsed = new URL(location);
    if (parsed.origin === OPS_PROXY_ORIGIN) {
      return `${OPS_PROXY_PREFIX}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Non-URL location header; forward as-is.
  }

  return location;
}

function buildOpsProxyHeaders(req: IncomingMessage): OutgoingHttpHeaders {
  const headers: OutgoingHttpHeaders = { ...req.headers };
  headers.host = `${OPS_PROXY_HOST}:${OPS_PROXY_PORT}`;
  headers["x-forwarded-prefix"] = OPS_PROXY_PREFIX;

  const forwardedHost = firstHeaderValue(req.headers.host);
  if (forwardedHost) {
    headers["x-forwarded-host"] = forwardedHost;
  }
  headers["x-forwarded-proto"] = firstHeaderValue(req.headers["x-forwarded-proto"]) ?? "http";

  const forwardedFor = appendForwardedFor(req.headers["x-forwarded-for"], req.socket.remoteAddress);
  if (forwardedFor) {
    headers["x-forwarded-for"] = forwardedFor;
  }

  return headers;
}

function rewriteOpsResponseHeaders(proxyHeaders: IncomingHttpHeaders): OutgoingHttpHeaders {
  const headers: OutgoingHttpHeaders = { ...proxyHeaders };
  const location = proxyHeaders.location;
  if (typeof location === "string") {
    headers.location = rewriteOpsLocationHeader(location);
  }
  return headers;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderOpsUnavailablePage(errorDetail?: string): string {
  const detail = errorDetail
    ? `<p><strong>Connection error:</strong> <code>${escapeHtml(errorDetail)}</code></p>`
    : "";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Mission Control sidecar unavailable</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:760px;margin:56px auto;padding:0 24px;color:#e5e7eb;background:#0b1220}
h1{font-size:28px;margin:0 0 16px}
p{line-height:1.5;color:#cbd5e1}
code{background:#16213e;color:#a5f3fc;padding:2px 6px;border-radius:6px}
pre{background:#111827;color:#d1fae5;padding:12px;border-radius:10px;overflow:auto}
a{color:#67e8f9}
</style>
</head>
<body>
<h1>Mission Control sidecar is not running</h1>
<p>The Mission tab proxies <code>/ops</code> to <code>${OPS_PROXY_ORIGIN}</code>. Start the dashboard sidecar, then reload this page.</p>
${detail}
<p>Start command:</p>
<pre>~/Projects/godmode-plugin/scripts/start-ops-dashboard.sh</pre>
<p>If the dashboard is already running, verify it is reachable at <a href="${OPS_PROXY_ORIGIN}" target="_blank" rel="noreferrer">${OPS_PROXY_ORIGIN}</a>.</p>
</body>
</html>`;
}

async function proxyOpsRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const rawUrl = req.url ?? OPS_PROXY_PREFIX;
  const requestUrl = (() => {
    try {
      return new URL(rawUrl, "http://localhost");
    } catch {
      return new URL(OPS_PROXY_PREFIX, "http://localhost");
    }
  })();
  const targetPath = isOpsPath(requestUrl.pathname)
    ? `${stripOpsPrefix(requestUrl.pathname)}${requestUrl.search}`
    : `${requestUrl.pathname}${requestUrl.search}`;
  const headers = buildOpsProxyHeaders(req);
  const method = req.method ?? "GET";

  await new Promise<void>((resolvePromise) => {
    let settled = false;
    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      resolvePromise();
    };

    const proxyReq = httpRequest(
      {
        protocol: "http:",
        hostname: OPS_PROXY_HOST,
        port: OPS_PROXY_PORT,
        method,
        path: targetPath,
        headers,
      },
      (proxyRes) => {
        const responseHeaders = rewriteOpsResponseHeaders(proxyRes.headers);
        res.writeHead(proxyRes.statusCode ?? 502, responseHeaders);
        proxyRes.pipe(res);
        proxyRes.on("end", settle);
        proxyRes.on("error", settle);
      },
    );

    proxyReq.setTimeout(15_000, () => {
      proxyReq.destroy(new Error("Timed out connecting to Mission Control sidecar"));
    });

    proxyReq.on("error", (err) => {
      if (!res.headersSent) {
        const code = (err as NodeJS.ErrnoException).code;
        const unavailable =
          code === "ECONNREFUSED" ||
          code === "ECONNRESET" ||
          code === "ENOTFOUND" ||
          code === "EHOSTUNREACH";
        if (unavailable) {
          res.writeHead(503, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          });
          res.end(renderOpsUnavailablePage(err.message));
        } else {
          res.writeHead(502, {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          });
          res.end(`Mission Control proxy error: ${err.message}`);
        }
      }
      settle();
    });

    req.on("aborted", () => {
      proxyReq.destroy();
      settle();
    });

    req.pipe(proxyReq);
  });
}

// ── Plugin definition ──────────────────────────────────────────────

const godmodePlugin = {
  id: "godmode",
  name: "GodMode",
  description: "Personal AI Operating System for entrepreneurs",

  // SYNCHRONOUS register — no async, no race condition
  register(api: OpenClawPluginApi) {
    const licenseKey = (api.pluginConfig as { licenseKey?: string } | undefined)?.licenseKey;

    if (!licenseKey) {
      licenseState = { status: "no-key" };
      api.logger.warn("[GodMode] No license key configured.");
      api.logger.warn("[GodMode] Add to openclaw.json: plugins.entries.godmode.config.licenseKey");
      // Continue registering — methods will return LICENSE_REQUIRED errors
    } else if (isDevKey(licenseKey)) {
      licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
      api.logger.info(`[GodMode] License validated (tier: developer)`);
    } else {
      // Kick off background validation — don't await
      licenseState = { status: "pending" };
      validateLicense(licenseKey, api.logger).catch(() => {});
      api.logger.info("[GodMode] License validation started (will complete on first RPC call)");
    }

    // ── 1. Register all gateway RPC methods (license-gated) ───────
    const codingOrchestrator = new CodingOrchestrator(api);
    const codingNotification = new CodingNotificationService(api);
    const codingHandlers = createCodingTaskHandlers(codingOrchestrator);

    const allHandlers: Record<string, unknown> = {
      ...projectsHandlers,
      ...tasksHandlers,
      ...workspacesHandlers,
      ...dailyBriefHandlers,
      ...briefGeneratorHandlers,
      ...lifeDashboardsHandlers,
      // lifetracks + inner-work removed from registration
      ...goalsHandlers,
      ...peopleDataHandlers,
      ...dataSourcesHandlers,
      ...agentLogHandlers,
      ...briefNotesHandlers,
      // clickup removed from registration
      ...calendarHandlers,
      ...subagentRunsHandlers,
      ...uiSlotsHandlers,
      ...onboardingHandlers,
      ...consciousnessHandlers,
      ...teamWorkspaceHandlers,
      ...teamCommsHandlers,
      ...teamCurationHandlers,
      ...focusPulseHandlers,
      ...optionsHandlers,
      ...trustTrackerHandlers,
      ...sessionArchiveHandlers,
      ...codingHandlers,
      ...systemUpdateHandlers,
      ...guardrailsHandlers,
      ...imageCacheHandlers,
      ...coretexHandlers,
    };

    for (const [method, handler] of Object.entries(allHandlers)) {
      const gated = withLicenseGate(licenseKey, api.logger, handler as Function);
      api.registerGatewayMethod(method, gated as Parameters<typeof api.registerGatewayMethod>[1]);
    }

    api.logger.info(
      `[GodMode] Registered ${Object.keys(allHandlers).length} gateway methods (plugin v${pluginVersion})`,
    );

    // ── 2. Resolve UI asset paths ─────────────────────────────────
    const sourceDir = dirname(api.source);
    const pluginRoot = basename(sourceDir) === "dist" ? resolve(sourceDir, "..") : sourceDir;

    const godmodeUiCandidates = [
      join(pluginRoot, "dist", "godmode-ui"),
      join(pluginRoot, "ui", "dist"),
      join(pluginRoot, "assets", "godmode-ui"),
    ];
    const godmodeUiRoot = godmodeUiCandidates.find((p) => {
      const index = join(p, "index.html");
      if (!existsSync(index)) {
        return false;
      }
      try {
        const html = readFileSync(index, "utf8");
        return /<godmode-app\b/i.test(html);
      } catch {
        return false;
      }
    });

    const deckUiCandidates = [
      join(pluginRoot, "dist", "deck"),
      join(pluginRoot, "assets", "deck"),
      join(pluginRoot, "deck", "dist"),
      join(pluginRoot, "..", "openclaw-deck", "dist"),
    ];
    const deckUiRoot = deckUiCandidates.find((p) => {
      const index = join(p, "index.html");
      if (!existsSync(index)) {
        return false;
      }
      try {
        const html = readFileSync(index, "utf8");
        // Reject dev-source HTML (e.g. <script src="/src/main.tsx">)
        return !/\/src\/main\.[jt]sx?/.test(html);
      } catch {
        return false;
      }
    });

    // ── 3. Serve UIs + health endpoint via HTTP ───────────────────
    const godmodeHandler = godmodeUiRoot
      ? createStaticFileHandler(godmodeUiRoot, "/godmode")
      : null;
    const deckHandler = deckUiRoot ? createStaticFileHandler(deckUiRoot, "/deck") : null;

    api.registerHttpHandler(async (req, res) => {
      const url = req.url ?? "/";
      const pathname = requestPathname(url);

      // Health endpoint — always available, even without UI
      if (pathname === "/godmode/health" || pathname === "/godmode/health/") {
        const health = {
          plugin: "godmode",
          version: pluginVersion,
          license: {
            status: licenseState.status,
            tier: licenseState.tier ?? null,
            ...(licenseState.error ? { error: licenseState.error } : {}),
          },
          ui: godmodeUiRoot ? "available" : "not-built",
          deck: deckUiRoot ? "available" : "not-built",
          methods: Object.keys(allHandlers).length,
        };
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
        res.end(JSON.stringify(health, null, 2));
        return true;
      }

      // Mission Control sidecar proxy (/ops/* -> http://127.0.0.1:3456/*)
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

      // Mission Control API fallback: some dashboard actions still call
      // absolute /api/* paths. Proxy those only when the request originated
      // from /ops so core gateway APIs remain untouched.
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

      // GodMode UI
      if (pathname === "/godmode" || pathname.startsWith("/godmode/")) {
        if (godmodeHandler) {
          godmodeHandler(req, res);
        } else {
          // Serve a helpful error page instead of silent 404
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

      // Deck UI
      if (pathname === "/deck" || pathname.startsWith("/deck/")) {
        const opts = readOptionsSync();
        if (!opts["deck.enabled"]) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<!DOCTYPE html>
<html><head><title>Deck — Disabled</title>
<style>body{font-family:system-ui;max-width:600px;margin:80px auto;padding:0 20px;color:#e0e0e0;background:#1a1a2e}
h1{color:#a0a0a0}code{background:#16213e;padding:2px 8px;border-radius:4px}a{color:#4ecdc4}</style></head>
<body><h1>Deck is disabled</h1>
<p>Deck is disabled. Enable it in GodMode Settings &gt; Options.</p>
<p><a href="/godmode">Back to GodMode</a></p>
</body></html>`);
          return true;
        }
        if (deckHandler) {
          deckHandler(req, res);
        } else {
          res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<!DOCTYPE html>
<html><head><title>Deck — UI Not Built</title>
<style>body{font-family:system-ui;max-width:600px;margin:80px auto;padding:0 20px;color:#e0e0e0;background:#1a1a2e}
h1{color:#ff6b6b}code{background:#16213e;padding:2px 8px;border-radius:4px}a{color:#4ecdc4}</style></head>
<body><h1>Deck UI Not Available</h1>
<p>The GodMode plugin is loaded but Deck assets haven't been bundled yet.</p>
<p>Run: <code>pnpm build</code> in <code>~/Projects/godmode-plugin</code>, then restart gateway.</p>
<p><a href="/godmode/health">Check plugin health →</a></p>
</body></html>`);
        }
        return true;
      }

      return false;
    });

    if (godmodeUiRoot) {
      api.logger.info(`[GodMode] Serving UI at /godmode from ${godmodeUiRoot}`);
    } else {
      api.logger.warn("[GodMode] No built UI found. Run 'pnpm build' in the plugin repo.");
    }

    if (deckUiRoot) {
      api.logger.info(`[GodMode] Serving Deck at /deck from ${deckUiRoot}`);
    } else {
      api.logger.warn("[GodMode] No built Deck found. Run 'pnpm deck:build' first.");
    }

    // ── 4. Plugin status RPC (not license-gated — for diagnostics) ─
    const methodCount = Object.keys(allHandlers).length;
    api.registerGatewayMethod("godmode.status", (async ({ respond }: { respond: Function }) => {
      respond(true, {
        plugin: true,
        version: pluginVersion,
        license: {
          status: licenseState.status,
          tier: licenseState.tier ?? null,
          configured: !!licenseKey,
        },
        methods: methodCount + 1,
        ui: godmodeUiRoot ? "available" : "not built",
        deck: deckUiRoot ? "available" : "not built",
        source: "plugin",
      });
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    // ── 5. Lifecycle hooks ────────────────────────────────────────
    api.on("gateway_start", async () => {
      api.logger.info("[GodMode] Gateway started — plugin active");

      // Agent log writer
      try {
        const started = await initAgentLogWriter();
        if (started) {
          api.logger.info("[GodMode] agent-log writer initialized");
        } else {
          api.logger.warn("[GodMode] agent-log writer unavailable in this runtime");
        }
      } catch (err) {
        api.logger.warn(`[GodMode] agent-log writer failed to initialize: ${String(err)}`);
      }

      // Workspace sync service
      try {
        const { startWorkspaceSyncService } = await import("./src/lib/workspace-sync-service.js");
        await startWorkspaceSyncService(api.logger);
        api.logger.info("[GodMode] workspace sync service initialized");
      } catch (err) {
        api.logger.warn(`[GodMode] workspace sync service failed to start: ${String(err)}`);
      }

      // Curation agent service
      try {
        const { getCurationAgentService } = await import("./src/services/curation-agent.js");
        const curation = getCurationAgentService(api.logger);
        await curation.start();
      } catch (err) {
        api.logger.warn(`[GodMode] curation service failed to start: ${String(err)}`);
      }

      // Session auto-archive service
      try {
        const { startAutoArchiveService } = await import("./src/services/session-archiver.js");
        await startAutoArchiveService(api.logger);
        api.logger.info("[GodMode] session auto-archive service initialized");
      } catch (err) {
        api.logger.warn(`[GodMode] session auto-archive service failed to start: ${String(err)}`);
      }

      // Image cache cleanup
      try {
        const { cleanupCache } = await import("./src/services/image-cache.js");
        const cacheResult = await cleanupCache();
        if (cacheResult.removed > 0) {
          api.logger.info(`[GodMode] image cache cleanup: removed ${cacheResult.removed} entries`);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] image cache cleanup failed: ${String(err)}`);
      }

      // Claude Code session sync (populate agent log)
      try {
        const { syncClaudeCodeSessions } = await import("./src/services/claude-code-sync.js");
        syncClaudeCodeSessions().then((result) => {
          if (result.synced > 0) {
            api.logger.info(`[GodMode] Claude Code sync: ${result.synced} sessions synced`);
          }
        }).catch((err) => {
          api.logger.warn(`[GodMode] Claude Code sync failed: ${String(err)}`);
        });
      } catch (err) {
        api.logger.warn(`[GodMode] Claude Code sync import failed: ${String(err)}`);
      }

      // IDE Activity Watcher — real-time Claude Code + git commit tracking
      try {
        const { startIDEActivityWatcher } = await import("./src/services/ide-activity-watcher.js");
        await startIDEActivityWatcher(api.logger);
        api.logger.info("[GodMode] IDE activity watcher initialized");
      } catch (err) {
        api.logger.warn(`[GodMode] IDE activity watcher failed to start: ${String(err)}`);
      }

      // Post-update compatibility check
      try {
        const { execSync } = await import("node:child_process");
        let currentOcVersion = "unknown";
        try {
          currentOcVersion = execSync("openclaw --version 2>/dev/null", { timeout: 5000 }).toString().trim();
        } catch {
          // openclaw not on PATH in this context
        }
        runPostUpdateHealthCheck(currentOcVersion, Object.keys(allHandlers).length, api.logger);
      } catch (err) {
        api.logger.warn(`[GodMode] Post-update health check error: ${String(err)}`);
      }

      // Recover orphaned coding tasks from previous gateway instance
      if (codingOrchestrator.isEnabled()) {
        codingOrchestrator.recoverOrphanedTasks().then((result) => {
          if (result.recovered > 0 || result.reattached > 0) {
            api.logger.info(
              `[GodMode] Coding task recovery: ${result.recovered} recovered, ${result.reattached} re-attached`,
            );
          }
        }).catch((err) => {
          api.logger.warn(`[GodMode] Coding task recovery failed: ${String(err)}`);
        });
      }
    });

    api.on("gateway_stop", async () => {
      try {
        const { getCurationAgentService } = await import("./src/services/curation-agent.js");
        getCurationAgentService().stop();
      } catch {
        // Non-fatal
      }
      try {
        const { getWorkspaceSyncService } = await import("./src/lib/workspace-sync-service.js");
        await getWorkspaceSyncService().stop();
      } catch {
        // Non-fatal
      }
      try {
        const { stopAutoArchiveService } = await import("./src/services/session-archiver.js");
        stopAutoArchiveService();
      } catch {
        // Non-fatal
      }
      try {
        const { getIDEActivityWatcher } = await import("./src/services/ide-activity-watcher.js");
        await getIDEActivityWatcher().stop();
      } catch {
        // Non-fatal
      }
    });

    // Team workspace bootstrap — inject shared context
    api.on("before_prompt_build", async (event, ctx) => {
      const prependChunks: string[] = [];
      try {
        const { handleTeamBootstrap } = await import("./src/hooks/team-bootstrap.js");
        const teamResult = await handleTeamBootstrap(event, ctx);
        if (teamResult?.prependContext) {
          prependChunks.push(teamResult.prependContext);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] team bootstrap hook error: ${String(err)}`);
      }
      // Trust feedback injection — append pending post-skill feedback prompt
      try {
        const { consumePendingTrustFeedback } = await import("./src/hooks/trust-feedback.js");
        const trustPrompt = consumePendingTrustFeedback(ctx?.sessionKey);
        if (trustPrompt) {
          prependChunks.push(trustPrompt);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] trust feedback hook error: ${String(err)}`);
      }
      try {
        const { loadOnboardingContext } = await import("./src/hooks/onboarding-context.js");
        const onboardingResult = await loadOnboardingContext();
        if (onboardingResult?.prependContext) {
          prependChunks.push(onboardingResult.prependContext);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] onboarding context hook error: ${String(err)}`);
      }
      // Exhaustive search gate nudge — injected after a lazy refusal was blocked
      const searchNudge = consumeSearchGateNudge(ctx?.sessionKey);
      if (searchNudge) {
        prependChunks.push(searchNudge);
      }
      if (prependChunks.length === 0) {
        return;
      }
      return { prependContext: prependChunks.join("\n\n---\n\n") };
    });

    // ── Safety Gates: before_reset — session hygiene ───────────────
    api.on("before_reset", async (event, ctx) => {
      // Clean WORKING.md on session end
      try {
        const result = await cleanWorkingMd();
        if (result.cleaned) {
          api.logger.info(
            `[GodMode][SafetyGate] session hygiene: removed ${result.removedDone} [DONE] items, trimmed ${result.trimmedLines} lines`,
          );
        }
      } catch (err) {
        api.logger.warn(`[GodMode] session hygiene error: ${String(err)}`);
      }

      // Reset search tracking for this session
      resetSearchTracking(ctx?.sessionKey);

      // Team memory routing — write session memory to team workspace on reset
      try {
        const { handleTeamMemoryRoute } = await import("./src/hooks/team-memory-route.js");
        await handleTeamMemoryRoute(event, ctx);
      } catch (err) {
        api.logger.warn(`[GodMode] team memory route hook error: ${String(err)}`);
      }
    });

    // ── Safety Gates: before_tool_call ──────────────────────────────
    api.on("before_tool_call", async (event, ctx) => {
      const name = event.toolName?.trim().toLowerCase() ?? "";
      const sessionKey = ctx?.sessionKey;

      // Gate 1: Loop Breaker — block any tool called too many times
      const loopCheck = await trackToolCall(sessionKey, name);
      if (loopCheck.blocked) {
        api.logger.warn(`[GodMode][SafetyGate] loop breaker fired: ${name}`);
        return { block: true, blockReason: loopCheck.reason };
      }

      // Gate 2: Grep Blocker + Coding Bypass Blocker — exec/bash/shell commands
      if (name === "exec" || name === "bash" || name === "shell") {
        const command =
          typeof event.params?.command === "string"
            ? event.params.command
            : typeof event.params?.cmd === "string"
              ? event.params.cmd
              : "";
        if (command) {
          const grepBlock = await checkGrepOnMemory(command, sessionKey);
          if (grepBlock) {
            api.logger.warn(`[GodMode][SafetyGate] grep blocker fired`);
            return { block: true, blockReason: grepBlock };
          }

          // Gate 2b: Block exec-based coding agent bypass (claude -p, claude --dangerously-skip-permissions)
          if (codingOrchestrator.isEnabled() && await isGateEnabled("spawnGate")) {
            const lowerCmd = command.toLowerCase();
            const isCodingBypass =
              /\bclaude\b/.test(lowerCmd) &&
              (/\s-p\s|\s-p$|\s--print\b|\s--dangerously-skip-permissions\b/.test(lowerCmd));
            if (isCodingBypass) {
              api.logger.warn(`[GodMode][SafetyGate] coding bypass blocked: ${command.slice(0, 100)}`);
              return {
                block: true,
                blockReason: [
                  "Running `claude -p` or `claude --dangerously-skip-permissions` via exec bypasses the coding orchestration layer.",
                  "",
                  "Use the `coding_task` tool instead. It handles everything:",
                  "- Isolated git worktree and branch",
                  "- Spawns the coding agent automatically",
                  "- Validation gates (lint, typecheck, test) on completion",
                  "- PR creation and notifications",
                  "",
                  "Example: coding_task({ task: \"Build the signup form\", repoRoot: \"/path/to/repo\" })",
                ].join("\n"),
              };
            }
          }
        }
      }

      // Gate 3: Coding spawn isolation
      const isSpawn = name === "sessions_spawn" || name === "task" || name.endsWith(".sessions_spawn");
      if (!isSpawn || !codingOrchestrator.isEnabled()) return;
      if (!(await isGateEnabled("spawnGate"))) return;

      const params = event.params ?? {};
      const label = typeof params.label === "string" ? params.label : undefined;

      const task = await codingOrchestrator.findTaskForSpawn(label);
      if (task) {
        api.logger.info(`[GodMode][Coding] spawn allowed for task ${task.id}`);
        return;
      }

      api.logger.info(`[GodMode][Coding] spawn blocked — no matching coding_task (label=${label ?? "none"})`);
      return {
        block: true,
        blockReason: [
          "Coding tasks require worktree isolation to prevent overwrites between sessions.",
          "",
          "Call the `coding_task` tool first with your task description.",
          "It will create an isolated worktree and branch, then give you",
          "the exact spawn instructions (including the label) to use.",
          "",
          "Example: coding_task({ task: \"Build signup form\" })",
          "Then use the returned spawn instructions to call sessions_spawn.",
        ].join("\n"),
      };
    });

    // ── Safety Gates: after_tool_call — search tracking ────────────
    api.on("after_tool_call", async (event, ctx) => {
      // Track search tool usage for the exhaustive search gate
      trackSearchUsage(ctx?.sessionKey, event.toolName ?? "");

      // Trust feedback — detect skill completion and queue feedback prompt
      try {
        const { handlePostToolFeedback } = await import("./src/hooks/trust-feedback.js");
        await handlePostToolFeedback(event.toolName, ctx?.sessionKey, event.error);
      } catch (err) {
        api.logger.warn(`[GodMode] trust after_tool_call hook error: ${String(err)}`);
      }
    });

    // ── Safety Gates: message_sending — exhaustive search gate ───
    api.on("message_sending", async (event, ctx) => {
      const sessionKey = (ctx as Record<string, unknown>)?.sessionKey as string | undefined;
      const content = event.content ?? "";
      if (await checkLazyRefusal(sessionKey, content)) {
        api.logger.warn(`[GodMode][SafetyGate] exhaustive search gate fired — lazy refusal blocked`);
        return { cancel: true };
      }
    });

    api.on("subagent_spawning", async (event) => {
      api.logger.info(`[GodMode][Coding] subagent spawning: ${event.childSessionKey} (${event.label ?? "unlabeled"})`);
      // Link child session to the orchestrated task so subagent_ended can correlate
      if (event.label) {
        try {
          await codingOrchestrator.registerTaskSpawn(event.label, event.childSessionKey);
        } catch (err) {
          api.logger.warn(`[GodMode][Coding] failed to register spawn: ${String(err)}`);
        }
      }
      return { status: "ok" as const };
    });

    api.on("subagent_ended", async (event) => {
      try {
        const { task } = await codingOrchestrator.handleTaskCompleted({
          childSessionKey: event.targetSessionKey,
          label: (event as Record<string, unknown>).label as string | undefined,
          outcome: event.outcome,
          error: event.error,
        });
        if (task) {
          await codingNotification.sendCompletionNotification({
            taskId: task.id,
            description: task.description,
            outcome: task.status === "done" ? "completed" : "failed",
            prUrl: task.prUrl,
            error: task.error,
          });
        }
      } catch (err) {
        api.logger.warn(`[GodMode] coding subagent_ended hook error: ${String(err)}`);
      }
    });

    // Team + coding tools
    api.registerTool((ctx) => createTeamMessageTool(ctx));
    api.registerTool((ctx) => createTeamMemoryWriteTool(ctx));
    api.registerTool((ctx) => createCodingTaskTool(ctx, { orchestrator: codingOrchestrator }));
    api.registerTool((ctx) => createTrustRateTool(ctx));
    api.registerTool((ctx) => createOnboardTool(ctx));

    // ── 6. Register CLI commands ──────────────────────────────────
    api.registerCli(
      ({ program }) => {
        const godmode = program.command("godmode").description("GodMode commands");

        godmode
          .command("status")
          .description("Show GodMode plugin status")
          .option("--json", "Output as JSON")
          .action((opts: { json?: boolean }) => {
            const status = {
              plugin: "godmode",
              version: pluginVersion,
              license: {
                status: licenseState.status,
                tier: licenseState.tier ?? "none",
                configured: !!licenseKey,
              },
              methods: methodCount,
              ui: godmodeUiRoot ? "available" : "not built",
              deck: deckUiRoot ? "available" : "not built",
            };

            if (opts.json) {
              console.log(JSON.stringify(status, null, 2));
              return;
            }

            console.log("GodMode Plugin Status");
            console.log("─".repeat(40));
            console.log(`  Version:  ${status.version}`);
            console.log(`  License:  ${status.license.status} (${status.license.tier})`);
            console.log(`  Methods:  ${status.methods}`);
            console.log(`  UI:       ${status.ui}`);
            console.log(`  Deck:     ${status.deck}`);
          });

        godmode
          .command("activate <key>")
          .description("Activate GodMode with your license key")
          .action(async (key: string) => {
            if (!key || (!key.startsWith("GM-") && key !== "GM-INTERNAL")) {
              console.error(
                "\x1b[31mInvalid license key.\x1b[0m Keys start with GM-PROD-, GM-DEV-, or GM-INTERNAL.",
              );
              process.exit(1);
            }

            // Resolve config path
            const homeDir = process.env.HOME || process.env.USERPROFILE || "";
            const stateDir = process.env.OPENCLAW_STATE_DIR || join(homeDir, ".openclaw");
            const configPath = process.env.OPENCLAW_CONFIG_PATH || join(stateDir, "openclaw.json");

            let config: Record<string, unknown> = {};
            try {
              if (existsSync(configPath)) {
                config = JSON.parse(readFileSync(configPath, "utf8"));
              }
            } catch {
              console.warn(`Could not parse ${configPath} — will create a fresh config.`);
            }

            // Deep-merge into plugins.entries.godmode
            const plugins = (config.plugins ?? {}) as Record<string, unknown>;
            const entries = (plugins.entries ?? {}) as Record<string, unknown>;
            const godmodeEntry = (entries.godmode ?? {}) as Record<string, unknown>;
            const godmodeConfig = (godmodeEntry.config ?? {}) as Record<string, unknown>;

            godmodeConfig.licenseKey = key;
            godmodeEntry.enabled = true;
            godmodeEntry.config = godmodeConfig;
            entries.godmode = godmodeEntry;
            plugins.entries = entries;
            config.plugins = plugins;

            const { writeFileSync, mkdirSync } = await import("node:fs");
            mkdirSync(dirname(configPath), { recursive: true });
            writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

            console.log(`\n\x1b[32m✓\x1b[0m License key saved to ${configPath}`);
            console.log(`\x1b[32m✓\x1b[0m GodMode plugin enabled\n`);
            console.log("Next steps:");
            console.log("  1. Start the gateway:  \x1b[36mopenclaw gateway run\x1b[0m");
            console.log("  2. Open GodMode:       \x1b[36mhttp://localhost:18789/godmode\x1b[0m");
            console.log("  3. Check health:       \x1b[36mopenclaw godmode doctor\x1b[0m\n");
          });

        godmode
          .command("doctor")
          .description("Diagnose GodMode plugin health")
          .action(async () => {
            const checks: { name: string; ok: boolean; detail: string }[] = [];

            // 1. License key configured
            checks.push({
              name: "License key configured",
              ok: !!licenseKey,
              detail: licenseKey
                ? `Key: ${licenseKey.slice(0, 6)}...`
                : "Missing — add licenseKey to plugin config in openclaw.json",
            });

            // 2. License validation
            if (licenseKey) {
              if (licenseState.status === "pending" || licenseState.status === "validating") {
                const valid = await validateLicense(licenseKey, api.logger);
                checks.push({
                  name: "License valid",
                  ok: valid,
                  detail: valid
                    ? `Tier: ${licenseState.tier}`
                    : (licenseState.error ?? "Validation failed"),
                });
              } else {
                checks.push({
                  name: "License valid",
                  ok: licenseState.status === "valid",
                  detail:
                    licenseState.status === "valid"
                      ? `Tier: ${licenseState.tier}`
                      : (licenseState.error ?? `Status: ${licenseState.status}`),
                });
              }
            }

            // 3. UI assets
            checks.push({
              name: "GodMode UI built",
              ok: !!godmodeUiRoot,
              detail: godmodeUiRoot ?? "Not found — run: pnpm build (plugin repo)",
            });

            // 4. Deck assets
            checks.push({
              name: "Deck UI built",
              ok: !!deckUiRoot,
              detail: deckUiRoot ?? "Not found — run: pnpm deck:build",
            });

            // 5. Data directory
            const workspaceRoot =
              (api.pluginConfig as { workspaceRoot?: string } | undefined)?.workspaceRoot ??
              "~/godmode";
            const expandedRoot = workspaceRoot.replace(/^~/, process.env.HOME ?? "");
            checks.push({
              name: "Workspace directory exists",
              ok: existsSync(expandedRoot),
              detail: existsSync(expandedRoot) ? expandedRoot : `Missing: ${expandedRoot}`,
            });

            const dataDir = join(expandedRoot, "data");
            checks.push({
              name: "Data directory exists",
              ok: existsSync(dataDir),
              detail: existsSync(dataDir) ? dataDir : `Missing: ${dataDir}`,
            });

            // 6. Health endpoint reachable
            checks.push({
              name: "Health endpoint registered",
              ok: true,
              detail: "GET /godmode/health",
            });

            // 7. Gateway methods
            checks.push({
              name: "Gateway methods registered",
              ok: methodCount > 0,
              detail: `${methodCount} methods`,
            });

            // Print results
            console.log("\nGodMode Doctor");
            console.log("═".repeat(50));
            let failures = 0;
            for (const check of checks) {
              const icon = check.ok ? "✓" : "✗";
              const color = check.ok ? "\x1b[32m" : "\x1b[31m";
              console.log(`  ${color}${icon}\x1b[0m ${check.name}`);
              if (!check.ok) {
                console.log(`    → ${check.detail}`);
                failures++;
              }
            }
            console.log("═".repeat(50));
            if (failures === 0) {
              console.log("  \x1b[32mAll checks passed.\x1b[0m\n");
            } else {
              console.log(`  \x1b[31m${failures} issue(s) found.\x1b[0m\n`);
            }
          });
        // ── Team workspace commands ─────────────────────────────────
        const workspace = godmode.command("workspace").description("Team workspace management");

        workspace
          .command("create")
          .description("Create a new team workspace")
          .requiredOption("--name <name>", "Workspace name")
          .option("--github <org/repo>", "GitHub repository (org/repo or full URL)")
          .option("--branch <branch>", "Git branch", "main")
          .action(async (opts: { name: string; github?: string; branch: string }) => {
            const { createWorkspaceId, readWorkspaceConfig, resolveGodModeRoot, writeWorkspaceConfig, ensureWorkspaceFolders } = await import("./src/lib/workspaces-config.js");
            const { scaffoldTeamWorkspace, resolveGitMemberId } = await import("./src/lib/team-workspace-scaffold.js");

            const config = await readWorkspaceConfig();
            const existingIds = new Set(config.workspaces.map((w) => w.id));
            const id = createWorkspaceId(opts.name, existingIds);
            const workspacePath = join(resolveGodModeRoot(), "clients", id);

            const memberId = await resolveGitMemberId(workspacePath).catch(() => "local");
            await ensureWorkspaceFolders(workspacePath, "team");
            await scaffoldTeamWorkspace({
              workspacePath,
              name: opts.name,
              id,
              github: opts.github,
              creatorName: memberId,
              creatorId: memberId,
            });

            config.workspaces.push({
              id,
              name: opts.name,
              emoji: "👥",
              type: "team",
              path: workspacePath,
              keywords: [id, opts.name.toLowerCase()],
              pinned: [],
              pinnedSessions: [],
              artifactDirs: ["outputs", "artifacts"],
              sync: {
                type: "git",
                remote: opts.github ? "origin" : undefined,
                branch: opts.branch,
                autoPull: { enabled: true, interval: "30s" },
                autoPush: { enabled: true, debounceMs: 5000 },
              },
              team: { github: opts.github, role: "admin", memberId },
              curation: { enabled: true },
            });
            await writeWorkspaceConfig(config);

            console.log(`\x1b[32m✓\x1b[0m Created team workspace: ${opts.name} (${id})`);
            console.log(`  Path: ${workspacePath}`);
            if (opts.github) {
              console.log(`  GitHub: ${opts.github}`);
            }
          });

        workspace
          .command("join <url>")
          .description("Join an existing team workspace via GitHub URL")
          .option("--branch <branch>", "Git branch", "main")
          .action(async (url: string, opts: { branch: string }) => {
            console.log(`Joining team workspace from: ${url}`);
            console.log(`Use the gateway RPC method 'workspace.joinTeam' for full clone + setup.`);
            console.log(`  openclaw rpc workspace.joinTeam '{"github":"${url}","branch":"${opts.branch}"}'`);
          });

        workspace
          .command("sync [id]")
          .description("Trigger immediate sync for a workspace")
          .action(async (id?: string) => {
            if (!id) {
              console.error("Usage: openclaw godmode workspace sync <workspace-id>");
              return;
            }
            console.log(`Triggering sync for workspace: ${id}`);
            console.log(`Use gateway RPC: openclaw rpc workspace.syncNow '{"workspaceId":"${id}"}'`);
          });

        workspace
          .command("list")
          .description("List all team workspaces")
          .action(async () => {
            const { readWorkspaceConfig, toDisplayPath } = await import("./src/lib/workspaces-config.js");
            const config = await readWorkspaceConfig({ initializeIfMissing: false });
            const teams = config.workspaces.filter((w) => w.type === "team");
            if (teams.length === 0) {
              console.log("No team workspaces configured.");
              return;
            }
            console.log(`\nTeam Workspaces (${teams.length}):`);
            console.log("─".repeat(50));
            for (const w of teams) {
              const sync = w.sync ? "git-synced" : "local";
              const github = w.team?.github ? ` (${w.team.github})` : "";
              console.log(`  ${w.emoji} ${w.name} [${w.id}] — ${sync}${github}`);
              console.log(`    ${toDisplayPath(w.path)}`);
            }
          });

        // ── Comms commands ───────────────────────────────────────────
        const comms = godmode.command("comms").description("Team communication");

        comms
          .command("send")
          .description("Send a message to the team feed")
          .requiredOption("--workspace <id>", "Workspace ID")
          .requiredOption("--type <type>", "Message type (handoff/question/alert/blocked/fyi)")
          .requiredOption("--msg <message>", "Message body")
          .option("--to <recipient>", "Optional recipient")
          .action(async (opts: { workspace: string; type: string; msg: string; to?: string }) => {
            const { createFeedMessage, appendFeedMessage, resolveFeedPath } = await import("./src/lib/team-feed.js");
            const { findWorkspaceById, readWorkspaceConfig } = await import("./src/lib/workspaces-config.js");
            const { resolveGitMemberId } = await import("./src/lib/team-workspace-scaffold.js");

            const config = await readWorkspaceConfig({ initializeIfMissing: false });
            const workspace = findWorkspaceById(config, opts.workspace);
            if (!workspace) {
              console.error(`Workspace not found: ${opts.workspace}`);
              process.exit(1);
            }

            const memberId = workspace.team?.memberId || await resolveGitMemberId(workspace.path);
            const feedPath = resolveFeedPath(workspace.path);
            const message = createFeedMessage({
              from: memberId,
              type: opts.type as "fyi",
              msg: opts.msg,
              to: opts.to,
            });

            await appendFeedMessage(feedPath, message);
            console.log(`\x1b[32m✓\x1b[0m Message sent (${message.id}): [${opts.type}] ${opts.msg}`);
          });

        comms
          .command("feed")
          .description("Read recent messages from the team feed")
          .requiredOption("--workspace <id>", "Workspace ID")
          .option("--since <date>", "Show messages since ISO date")
          .option("--limit <n>", "Max messages to show", "20")
          .action(async (opts: { workspace: string; since?: string; limit: string }) => {
            const { readFeed, resolveFeedPath } = await import("./src/lib/team-feed.js");
            const { findWorkspaceById, readWorkspaceConfig } = await import("./src/lib/workspaces-config.js");

            const config = await readWorkspaceConfig({ initializeIfMissing: false });
            const workspace = findWorkspaceById(config, opts.workspace);
            if (!workspace) {
              console.error(`Workspace not found: ${opts.workspace}`);
              process.exit(1);
            }

            const feedPath = resolveFeedPath(workspace.path);
            const messages = await readFeed(feedPath, {
              since: opts.since,
              limit: Number(opts.limit) || 20,
            });

            if (messages.length === 0) {
              console.log("No messages.");
              return;
            }

            console.log(`\nFeed (${messages.length} messages):`);
            console.log("─".repeat(60));
            for (const m of messages) {
              const to = m.to ? ` → ${m.to}` : "";
              console.log(`  [${m.type}] ${m.from}${to}: ${m.msg}`);
              console.log(`    ${m.ts} (${m.id})`);
            }
          });

        // ── Curation commands ────────────────────────────────────────
        const curation = godmode.command("curation").description("Workspace memory curation");

        curation
          .command("run")
          .description("Manually trigger curation for a workspace")
          .requiredOption("--workspace <id>", "Workspace ID")
          .action(async (opts: { workspace: string }) => {
            const { getCurationAgentService } = await import("./src/services/curation-agent.js");
            const service = getCurationAgentService();
            const result = await service.runCuration(opts.workspace);
            if (result.ok) {
              console.log(`\x1b[32m✓\x1b[0m Curation completed for ${opts.workspace}`);
            } else {
              console.error(`\x1b[31m✗\x1b[0m Curation failed: ${result.error}`);
            }
          });

        curation
          .command("candidates")
          .description("Show SOP candidates for a workspace")
          .requiredOption("--workspace <id>", "Workspace ID")
          .action(async (opts: { workspace: string }) => {
            const { findWorkspaceById, readWorkspaceConfig } = await import("./src/lib/workspaces-config.js");
            const fsp = await import("node:fs/promises");
            const pathMod = await import("node:path");

            const config = await readWorkspaceConfig({ initializeIfMissing: false });
            const workspace = findWorkspaceById(config, opts.workspace);
            if (!workspace) {
              console.error(`Workspace not found: ${opts.workspace}`);
              process.exit(1);
            }

            try {
              const content = await fsp.readFile(
                pathMod.join(workspace.path, "memory", "sop-candidates.md"),
                "utf-8",
              );
              console.log(content);
            } catch {
              console.log("No SOP candidates yet.");
            }
          });
      },
      { commands: ["godmode"] },
    );
  },
};

export default godmodePlugin;
