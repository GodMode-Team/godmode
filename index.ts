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

import { existsSync, readFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
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
import { calendarHandlers } from "./src/methods/calendar.js";
import { consciousnessHandlers } from "./src/methods/consciousness.js";
import { dailyBriefHandlers } from "./src/methods/daily-brief.js";
import { briefGeneratorHandlers } from "./src/methods/brief-generator.js";
// data-sources removed in v1.6.0 dead weight audit
import { goalsHandlers } from "./src/methods/goals.js";
import { onboardingHandlers } from "./src/methods/onboarding.js";
// people-data removed in v1.6.0 dead weight audit
import { projectsHandlers } from "./src/methods/projects.js";
import { tasksHandlers } from "./src/methods/tasks.js";
import { teamCommsHandlers } from "./src/methods/team-comms.js";
import { teamCurationHandlers } from "./src/methods/team-curation.js";
import { teamWorkspaceHandlers } from "./src/methods/team-workspace.js";
import { createTeamMessageTool } from "./src/tools/team-message.js";
import { createTeamMemoryWriteTool } from "./src/tools/team-memory.js";
// coding-task tool removed in lean audit
import { integrationsHandlers } from "./src/methods/integrations.js";
import { uiSlotsHandlers } from "./src/methods/ui-slots.js";
import { workspacesHandlers } from "./src/methods/workspaces.js";
import { optionsHandlers } from "./src/methods/options.js";
import { trustTrackerHandlers } from "./src/methods/trust-tracker.js";
import { systemUpdateHandlers, setPluginVersion, runPostUpdateHealthCheck } from "./src/methods/system-update.js";
import { createGuardrailTool } from "./src/tools/guardrail.js";
import { createOnboardTool } from "./src/tools/onboard.js";
import { createMorningSetTool } from "./src/tools/morning-set.js";
import { createQueueAddTool } from "./src/tools/queue-add.js";
import { createQueueCheckTool } from "./src/tools/queue-check.js";
import { createTrustRateTool } from "./src/tools/trust-rate.js";
import { createXReadTool } from "./src/tools/x-read.js";
import { queueHandlers } from "./src/methods/queue.js";
import { xIntelHandlers } from "./src/methods/x-intel.js";
import { filesHandlers } from "./src/methods/files.js";
import { dashboardsHandlers } from "./src/methods/dashboards.js";
import { initAgentLogWriter } from "./src/services/agent-log-writer.js";
import {
  trackToolCall,
  scanForInjection,
  consumePromptShieldNudge,
  checkOutputLeak,
  consumeOutputShieldNudge,
  checkConfigAccess,
  resetPromptShieldTracking,
  trackContextPressure,
  consumeContextPressureNudge,
  resetContextPressure,
  getContextPressureLevel,
} from "./src/hooks/safety-gates.js";
import { checkCustomGuardrails, logGateActivity } from "./src/services/guardrails.js";
import { guardrailsHandlers } from "./src/methods/guardrails.js";
import { imageCacheHandlers } from "./src/methods/image-cache.js";
import { secondBrainHandlers } from "./src/methods/second-brain.js";
// proactiveIntel removed in v1.6.0 dead weight audit
import { supportHandlers } from "./src/methods/support.js";
import { fathomWebhookHandlers, handleFathomWebhookHttp } from "./src/methods/fathom-webhook.js";
import { authHandlers } from "./src/methods/auth.js";
import { sessionPrivacyHandlers } from "./src/methods/session-privacy.js";
// Auth client — JWT-based authentication
import {
  loadAuthTokens,
  validateTokenOffline,
  refreshAccessToken,
} from "./src/lib/auth-client.js";
// Static file server for UIs
import { createStaticFileHandler } from "./src/static-server.js";
import { DATA_DIR, MEMORY_DIR } from "./src/data-paths.js";
// Host compatibility — self-healing layer
import { detectHostContext, extractSessionKey, safeBroadcast } from "./src/lib/host-context.js";
// Session store — auto-title support
import {
  loadConfig as loadSessionConfig,
  loadCombinedSessionStoreForGateway,
  updateSessionStore,
  resolveStorePath,
  deriveSessionTitle,
  isCronSessionKey,
} from "./src/lib/workspace-session-store.js";
import { killZombieGateways } from "./src/lib/zombie-guard.js";

// ── Server-side auto-title state ─────────────────────────────────────
/** First user message per session, captured in message_received for auto-titling */
const pendingAutoTitles = new Map<string, string>();
/** Sessions that already have titles — skip future auto-title attempts */
const titledSessions = new Set<string>();

// ── Options file reader (for feature flags in HTTP handler) ─────────
const OPTIONS_FILE_PATH = join(DATA_DIR, "godmode-options.json");
const OPTIONS_CACHE_TTL_MS = 5_000; // re-read every 5 seconds max
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

// ── Service cleanup registry ────────────────────────────────────────
// gateway_start pushes cleanup functions; gateway_stop drains them.
// Prevents leaked intervals on rapid restart cycles.
const serviceCleanup: Array<{ name: string; fn: () => void | Promise<void> }> = [];

// ── License validation ─────────────────────────────────────────────
// Each installation requires a valid license key in openclaw.json:
//   { "plugins": { "entries": { "godmode": { "config": { "licenseKey": "GM-..." } } } } }
// Keys are validated lazily on first RPC call — register() stays synchronous.

const LICENSE_API_URL = "https://lifeongodmode.com/api/v1/license/validate";
const LICENSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type LicenseState = {
  status: "pending" | "validating" | "valid" | "invalid" | "no-key" | "expired";
  tier?: string;
  email?: string;
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
    // Already validated (JWT or dev key) — pass through
    if (licenseState.status === "valid") {
      // Re-validate legacy license keys if cache expired
      if (
        key &&
        !isDevKey(key) &&
        licenseState.checkedAt &&
        Date.now() - licenseState.checkedAt >= LICENSE_CACHE_TTL_MS
      ) {
        if (!validationPromise) {
          validationPromise = validateLicense(key, logger).finally(() => {
            validationPromise = null;
          });
        }
        await validationPromise;
        if (licenseState.status !== "valid") {
          ctx.respond(false, undefined, {
            code: "LICENSE_INVALID",
            message: licenseState.error ?? "GodMode license is invalid or expired.",
          });
          return;
        }
      }
      return handler(ctx);
    }

    // Dev keys pass through immediately
    if (key && isDevKey(key)) {
      licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
      return handler(ctx);
    }

    // Legacy license key — first caller triggers validation
    if (key && (licenseState.status === "pending" || licenseState.status === "validating")) {
      if (!validationPromise) {
        validationPromise = validateLicense(key, logger).finally(() => {
          validationPromise = null;
        });
      }
      await validationPromise;
    }

    // JWT auth — try refresh if status is pending/expired
    if (!key && (licenseState.status === "pending" || licenseState.status === "expired" || licenseState.status === "no-key")) {
      const authTokens = loadAuthTokens();
      if (authTokens) {
        // Try offline validation first
        const payload = validateTokenOffline(authTokens.accessToken);
        if (payload) {
          licenseState = { status: "valid", checkedAt: Date.now(), tier: payload.plan, email: payload.email };
        } else {
          // Try refresh
          try {
            const refreshed = await refreshAccessToken(authTokens.refreshToken);
            if (refreshed) {
              const newPayload = validateTokenOffline(refreshed.accessToken);
              if (newPayload) {
                licenseState = { status: "valid", checkedAt: Date.now(), tier: newPayload.plan, email: newPayload.email };
              }
            }
          } catch {
            // Refresh failed — continue to error below
          }
        }
      }
    }

    if (licenseState.status !== "valid") {
      ctx.respond(false, undefined, {
        code: "LICENSE_REQUIRED",
        message: licenseState.error ?? "GodMode authentication required. Log in via auth.login or set a GM-DEV-* license key.",
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
<pre>npx godmode ops-dashboard start</pre>
<p><em>Or run the start script from your GodMode plugin install directory.</em></p>
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

    // Backward compat: honor GM-DEV-* and GM-INTERNAL license keys
    if (licenseKey && typeof licenseKey === "string" && (licenseKey.startsWith("GM-DEV-") || licenseKey === "GM-INTERNAL")) {
      licenseState = { status: "valid", checkedAt: Date.now(), tier: "developer" };
      api.logger.info(`[GodMode] License validated (tier: developer)`);
    } else {
      // JWT-based auth — check stored tokens (sync, no network)
      const authTokens = loadAuthTokens();
      if (!authTokens) {
        licenseState = { status: "no-key" };
        api.logger.warn("[GodMode] No auth tokens found. Log in via auth.login or set a GM-DEV-* license key.");
      } else {
        const payload = validateTokenOffline(authTokens.accessToken);
        if (payload) {
          licenseState = { status: "valid", checkedAt: Date.now(), tier: payload.plan, email: payload.email };
          api.logger.info(`[GodMode] Auth validated offline (plan: ${payload.plan}, email: ${payload.email})`);
        } else {
          // Token expired — mark pending, will try refresh in gateway_start
          licenseState = { status: "pending" };
          api.logger.info("[GodMode] Auth token expired — will attempt refresh on gateway start");
        }
      }
    }

    // ── 1. Register all gateway RPC methods (license-gated) ───────
    const allHandlers: Record<string, unknown> = {
      ...projectsHandlers,
      ...tasksHandlers,
      ...workspacesHandlers,
      ...dailyBriefHandlers,
      ...briefGeneratorHandlers,
      ...goalsHandlers,
      // peopleData + dataSources removed in v1.6.0
      ...agentLogHandlers,
      ...calendarHandlers,
      ...uiSlotsHandlers,
      ...onboardingHandlers,
      ...consciousnessHandlers,
      ...teamWorkspaceHandlers,
      ...teamCommsHandlers,
      ...teamCurationHandlers,
      ...optionsHandlers,
      ...trustTrackerHandlers,
      ...systemUpdateHandlers,
      ...guardrailsHandlers,
      ...imageCacheHandlers,
      ...secondBrainHandlers,
      // proactiveIntel removed in v1.6.0
      ...queueHandlers,
      ...dashboardsHandlers,
      ...supportHandlers,
      ...xIntelHandlers,
      ...filesHandlers,
      ...integrationsHandlers,
      ...fathomWebhookHandlers,
      ...authHandlers,
      ...sessionPrivacyHandlers,
    };

    // Methods that must work before a license is configured (setup flow)
    const ungatedMethods = new Set([
      "onboarding.quickSetup",
      "onboarding.activateLicense",
      "onboarding.status",
      "onboarding.checklist",
      "onboarding.capabilities",
      "onboarding.update",
      "onboarding.complete",
      "onboarding.reset",
      "onboarding.assess",
      "onboarding.recommend",
      "onboarding.configAudit",
      "onboarding.wizard.status",
      "onboarding.wizard.preview",
      "onboarding.wizard.diff",
      "onboarding.wizard.generate",
      "integrations.status",
      "integrations.test",
      "integrations.configure",
      "integrations.setupGuide",
      "integrations.platformInfo",
      "support.diagnostics",
      "support.logExchange",
      "support.escalate",
      "auth.status",
      "auth.login",
      "auth.loginPoll",
      "auth.logout",
      "auth.account",
    ]);

    for (const [method, handler] of Object.entries(allHandlers)) {
      if (ungatedMethods.has(method)) {
        api.registerGatewayMethod(method, handler as Parameters<typeof api.registerGatewayMethod>[1]);
      } else {
        const gated = withLicenseGate(licenseKey, api.logger, handler as Function);
        api.registerGatewayMethod(method, gated as Parameters<typeof api.registerGatewayMethod>[1]);
      }
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

    // ── 3. Serve UIs + health endpoint via HTTP ───────────────────
    const godmodeHandler = godmodeUiRoot
      ? createStaticFileHandler(godmodeUiRoot, "/godmode")
      : null;

    // HTTP route handler shared by both old and new API
    const godmodeHttpHandler = async (req: any, res: any) => {
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

      // Fathom webhook endpoint (must be before the /godmode UI catch-all)
      if (pathname === "/godmode/webhooks/fathom" && req.method === "POST") {
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          // Respond 200 immediately (Fathom requirement)
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
          // Process async in background
          const body = Buffer.concat(chunks).toString("utf8");
          const hdrs = req.headers as Record<string, string>;
          handleFathomWebhookHttp(body, hdrs).catch((err) => {
            console.error("[GodMode] Fathom webhook processing error:", err);
          });
        });
        return true;
      }

      // Artifact file server — serves files from ~/godmode/memory/inbox/
      // at /godmode/artifacts/{filename} so the ally can link to reports, HTML
      // artifacts, and other queue outputs via a stable URL.
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

      // Legacy /reports/ redirect — the ally sometimes generates /reports/{name}
      // URLs. Redirect to /godmode/artifacts/{name} which actually serves files.
      if (pathname.startsWith("/reports/")) {
        const fileName = pathname.slice("/reports/".length);
        res.writeHead(302, { Location: `/godmode/artifacts/${fileName}` });
        res.end();
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

      return false;
    };

    // OpenClaw 2026.3.2 changed registerHttpHandler → registerHttpRoute (params object)
    if (typeof (api as any).registerHttpRoute === "function") {
      (api as any).registerHttpRoute({ path: "/godmode", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
      (api as any).registerHttpRoute({ path: "/ops", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
      (api as any).registerHttpRoute({ path: "/reports", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
    } else if (typeof (api as any).registerHttpHandler === "function") {
      (api as any).registerHttpHandler(godmodeHttpHandler);
    } else {
      console.warn("[godmode] No HTTP route registration API found — UI and health endpoints unavailable");
    }

    if (godmodeUiRoot) {
      api.logger.info(`[GodMode] Serving UI at /godmode from ${godmodeUiRoot}`);
    } else {
      api.logger.warn("[GodMode] No built UI found. Run 'pnpm build' in the plugin repo.");
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
        source: "plugin",
      });
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    // ── 5. Lifecycle hooks ────────────────────────────────────────
    api.on("gateway_start", async () => {
      api.logger.info("[GodMode] Gateway started — plugin active");

      // Load workspace .env into process.env so exec child processes inherit
      // API keys (Keap, etc.) without needing to read .env directly (which the
      // exec sandbox blocks). Only sets vars that aren't already in the environment.
      try {
        const homeDir = process.env.HOME || process.env.USERPROFILE || "";
        const envPaths = [
          join(process.env.GODMODE_ROOT || join(homeDir, "godmode"), ".env"),
          join(process.env.OPENCLAW_STATE_DIR || join(homeDir, ".openclaw"), ".env"),
        ];
        let loaded = 0;
        for (const envPath of envPaths) {
          if (!existsSync(envPath)) continue;
          const raw = readFileSync(envPath, "utf-8");
          for (const line of raw.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            // Strip optional 'export ' prefix
            const cleaned = trimmed.replace(/^export\s+/, "");
            const eqIdx = cleaned.indexOf("=");
            if (eqIdx < 1) continue;
            const key = cleaned.slice(0, eqIdx).trim();
            let val = cleaned.slice(eqIdx + 1).trim();
            // Strip surrounding quotes
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
              loaded++;
            }
          }
        }
        if (loaded > 0) {
          api.logger.info(`[GodMode] Loaded ${loaded} env var(s) from workspace .env`);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] Failed to load workspace .env: ${String(err)}`);
      }

      // Drain any stale cleanup from a previous gateway cycle (rapid restart guard)
      if (serviceCleanup.length > 0) {
        api.logger.warn(`[GodMode] Draining ${serviceCleanup.length} stale service cleanup(s) from previous cycle`);
        for (const entry of serviceCleanup) {
          try { await entry.fn(); } catch { /* swallow — previous cycle */ }
        }
        serviceCleanup.length = 0;
      }

      // JWT token refresh — if register() found an expired token, try refreshing now
      if (licenseState.status === "pending") {
        try {
          const authTokens = loadAuthTokens();
          if (authTokens) {
            const refreshed = await refreshAccessToken(authTokens.refreshToken);
            if (refreshed) {
              const newPayload = validateTokenOffline(refreshed.accessToken);
              if (newPayload) {
                licenseState = { status: "valid", checkedAt: Date.now(), tier: newPayload.plan, email: newPayload.email };
                api.logger.info(`[GodMode] Auth token refreshed (plan: ${newPayload.plan})`);
              } else {
                licenseState = { status: "expired" };
                api.logger.warn("[GodMode] Auth token refresh succeeded but validation failed");
              }
            } else {
              licenseState = { status: "expired" };
              api.logger.warn("[GodMode] Auth token refresh failed — user needs to re-authenticate via auth.login");
            }
          }
        } catch (err) {
          licenseState = { status: "expired" };
          api.logger.warn(`[GodMode] Auth token refresh error: ${String(err)}`);
        }
      }

      // Kill zombie gateway processes that survived previous restarts
      const zombies = killZombieGateways(api.logger);
      if (zombies.length > 0) {
        api.logger.warn(`[GodMode] Cleaned up ${zombies.length} zombie gateway process(es)`);
      }

      // Host compatibility scan — detect host changes BEFORE services initialize
      try {
        const { changes } = await detectHostContext(api, pluginVersion);
        if (changes.length > 0) {
          api.logger.warn(
            `[GodMode] Host environment changed (${changes.length} change(s)) — self-healing active`,
          );
        }
        // Note: RPC-level compat probing happens client-side via host-compat.ts
      } catch (err) {
        api.logger.warn(`[GodMode] Host compat scan failed: ${String(err)}`);
      }

      // Seed starter personas + skills if roster/skills dir is empty
      try {
        const seedModuleDir = dirname(fileURLToPath(import.meta.url));
        // assets/ lives alongside dist/ in the package root, or inside dist/ in dev
        const seedPluginRoot = basename(seedModuleDir) === "dist" ? dirname(seedModuleDir) : seedModuleDir;
        const rosterTarget = join(MEMORY_DIR, "agent-roster");
        const rosterSource = join(seedPluginRoot, "assets", "agent-roster");
        if (existsSync(rosterSource)) {
          const hasExisting = existsSync(rosterTarget) && readdirSync(rosterTarget).filter(f => f.endsWith(".md")).length > 0;
          if (!hasExisting) {
            mkdirSync(rosterTarget, { recursive: true });
            const sourceFiles = readdirSync(rosterSource).filter(f => f.endsWith(".md"));
            for (const f of sourceFiles) {
              copyFileSync(join(rosterSource, f), join(rosterTarget, f));
            }
            api.logger.info(`[GodMode] Seeded ${sourceFiles.length} starter personas`);
          }
        }
        const skillsTarget = join(dirname(MEMORY_DIR), "skills");
        const skillsSource = join(seedPluginRoot, "assets", "skills");
        if (existsSync(skillsSource)) {
          const hasExistingSkills = existsSync(skillsTarget) && readdirSync(skillsTarget).filter(f => f.endsWith(".md")).length > 0;
          if (!hasExistingSkills) {
            mkdirSync(skillsTarget, { recursive: true });
            const sourceSkills = readdirSync(skillsSource).filter(f => f.endsWith(".md"));
            for (const f of sourceSkills) {
              copyFileSync(join(skillsSource, f), join(skillsTarget, f));
            }
            api.logger.info(`[GodMode] Seeded ${sourceSkills.length} starter skills`);
          }
        }
      } catch (err) {
        api.logger.warn(`[GodMode] Starter content seeding failed: ${String(err)}`);
      }

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
        const { startWorkspaceSyncService, getWorkspaceSyncService } = await import("./src/lib/workspace-sync-service.js");
        await startWorkspaceSyncService(api.logger);
        serviceCleanup.push({ name: "workspace-sync", fn: () => getWorkspaceSyncService().stop() });
        api.logger.info("[GodMode] workspace sync service initialized");
      } catch (err) {
        api.logger.warn(`[GodMode] workspace sync service failed to start: ${String(err)}`);
      }

      // Curation agent service — gated behind team workspace
      try {
        const clientsDir = join(dirname(DATA_DIR), "clients");
        if (existsSync(clientsDir)) {
          const { getCurationAgentService } = await import("./src/services/curation-agent.js");
          const curation = getCurationAgentService(api.logger);
          await curation.start();
          serviceCleanup.push({ name: "curation-agent", fn: () => curation.stop() });
        } else {
          api.logger.info("[GodMode] Curation agent skipped — no team workspaces configured");
        }
      } catch (err) {
        api.logger.warn(`[GodMode] curation service failed to start: ${String(err)}`);
      }

      // Skill cards — copy shipped defaults on first boot
      try {
        const { ensureSkillCards } = await import("./src/lib/skill-cards.js");
        ensureSkillCards(pluginRoot);
      } catch {
        // Non-fatal — skill cards are a nice-to-have
      }

      // Mem0 memory initialization — conversational memory for proactive context
      try {
        const { initMemory, isMemoryReady, seedFromVault } = await import("./src/lib/memory.js");
        await initMemory();
        api.logger.info("[GodMode] Mem0 memory initialized");

        // Seed vault knowledge + skill cards into Mem0 on first boot
        if (isMemoryReady()) {
          void (async () => {
            try {
              await seedFromVault("caleb");
              api.logger.info("[GodMode] Mem0 vault seeding complete");
            } catch (seedErr) {
              api.logger.warn(`[GodMode] Mem0 seeding failed (non-fatal): ${String(seedErr)}`);
            }
          })();
        }
      } catch (err) {
        api.logger.warn(`[GodMode] Mem0 memory init failed (non-fatal): ${String(err)}`);
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

      // Consciousness heartbeat — hourly auto-sync of CONSCIOUSNESS.md
      try {
        const { initConsciousnessHeartbeat, startConsciousnessHeartbeat, stopConsciousnessHeartbeat } = await import("./src/services/consciousness-heartbeat.js");
        initConsciousnessHeartbeat(api.logger);
        startConsciousnessHeartbeat();
        serviceCleanup.push({ name: "consciousness-heartbeat", fn: () => stopConsciousnessHeartbeat() });
        api.logger.info("[GodMode] Consciousness heartbeat service started");
      } catch (err) {
        api.logger.warn(`[GodMode] Consciousness heartbeat failed to start: ${String(err)}`);
      }

      // Proactive Intelligence — removed in v1.6.0 dead weight audit

      // Queue processor — autonomous background task execution
      try {
        const { initQueueProcessor, getQueueProcessor } = await import("./src/services/queue-processor.js");
        const queueProcessor = initQueueProcessor(api.logger);
        queueProcessor.setBroadcast((event, data) => safeBroadcast(api, event, data));
        await queueProcessor.recoverOrphaned();
        queueProcessor.startPolling();
        serviceCleanup.push({ name: "queue-processor", fn: () => getQueueProcessor()?.stop() });
        api.logger.info("[GodMode] Queue processor initialized (10-min polling)");
      } catch (err) {
        api.logger.warn(`[GodMode] Queue processor failed to init: ${String(err)}`);
      }

      // Obsidian Sync — headless vault sync (requires npm install -g obsidian-headless)
      try {
        const { initObsidianSync, stopObsidianSync } = await import("./src/services/obsidian-sync.js");
        const obsSync = initObsidianSync(api.logger);
        obsSync.setBroadcast((event, data) => safeBroadcast(api, event, data));
        await obsSync.init();
        serviceCleanup.push({ name: "obsidian-sync", fn: () => stopObsidianSync() });
        api.logger.info("[GodMode] Obsidian Sync service initialized");
      } catch (err) {
        api.logger.warn(`[GodMode] Obsidian Sync failed to init: ${String(err)}`);
      }

      // Fathom post-meeting processor
      try {
        const { initFathomProcessor, startFathomProcessor, stopFathomProcessor, setBroadcast: setFathomBroadcast } = await import("./src/services/fathom-processor.js");
        initFathomProcessor(api.logger);
        setFathomBroadcast((event, data) => safeBroadcast(api, event, data));
        startFathomProcessor();
        serviceCleanup.push({
          name: "fathom-processor",
          fn: () => { stopFathomProcessor(); },
        });
        api.logger.info("[GodMode] Fathom post-meeting processor started");
      } catch (err) {
        api.logger.warn(`[GodMode] Fathom processor failed to start: ${String(err)}`);
      }

      // X/Twitter client — connect to browser + validate XAI key
      try {
        const { initXClient } = await import("./src/services/x-client.js");
        await initXClient(api.logger);
        serviceCleanup.push({ name: "x-browser", fn: async () => { const { stopBrave } = await import("./src/services/x-browser.js"); stopBrave(); } });
      } catch (err) {
        api.logger.warn(`[GodMode] X client init failed: ${String(err)}`);
      }

      api.logger.info(`[GodMode] Gateway startup complete — ${serviceCleanup.length} service(s) registered for cleanup`);
    });

    api.on("gateway_stop", async () => {
      api.logger.info(`[GodMode] Gateway stopping — cleaning up ${serviceCleanup.length} service(s)`);
      let cleaned = 0;
      for (const entry of serviceCleanup) {
        try {
          await entry.fn();
          cleaned++;
          api.logger.info(`[GodMode] Stopped service: ${entry.name}`);
        } catch (err) {
          api.logger.warn(`[GodMode] Cleanup error for ${entry.name}: ${String(err)}`);
        }
      }
      serviceCleanup.length = 0;
      api.logger.info(`[GodMode] Gateway stopped — ${cleaned} service(s) cleaned up`);
    });

    // ── Safety Gates: message_received — Prompt Shield + Turn Tracker Reset ──
    api.on("message_received", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      const content = event.content ?? "";

      // Reset per-turn tool usage tracker — fresh for each new user message
      try {
        const { resetTurnToolUsage } = await import("./src/hooks/safety-gates.js");
        resetTurnToolUsage(sessionKey);
      } catch { /* non-fatal */ }

      if (content) {
        const result = await scanForInjection(sessionKey, content);
        if (result.flagged) {
          api.logger.warn(
            `[GodMode][SafetyGate] prompt shield flagged session: ${result.categories.join(", ")}`,
          );
        }
        // Support session logging — user messages
        if (sessionKey === "agent:main:support") {
          try {
            const { logExchangeInternal } = await import("./src/methods/support.js");
            await logExchangeInternal("user", content);
          } catch { /* non-fatal */ }
        }

        // ── Server-side auto-title: capture first user message ──
        // Only capture if we haven't already titled this session and don't
        // already have a pending message. Skip cron and well-known sessions.
        if (
          sessionKey &&
          !titledSessions.has(sessionKey) &&
          !pendingAutoTitles.has(sessionKey) &&
          !isCronSessionKey(sessionKey)
        ) {
          pendingAutoTitles.set(sessionKey, content);
        }
      }
    });

    // Team workspace bootstrap — inject shared context
    api.on("before_prompt_build", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);

      // Agent persona — always-on behavioral baseline
      let personaContext: string | null = null;
      try {
        const { loadAgentPersona } = await import("./src/hooks/agent-persona.js");
        const personaResult = await loadAgentPersona();
        if (personaResult?.prependContext) personaContext = personaResult.prependContext;
      } catch (err) {
        api.logger.warn(`[GodMode] agent persona hook error: ${String(err)}`);
      }

      // Support session — early return with its own context
      if (sessionKey === "agent:main:support") {
        try {
          const fsP = await import("node:fs/promises");
          const pathM = await import("node:path");
          const skillPath = pathM.join(pluginRoot, "skills", "godmode-support", "SKILL.md");
          const skillContent = await fsP.readFile(skillPath, "utf-8").catch(() => "");
          const { collectDiagnosticsInternal } = await import("./src/methods/support.js");
          const diagnostics = await collectDiagnosticsInternal();
          const supportChunks = [
            personaContext ?? "",
            "[GodMode Support Session]",
            "You are now acting as GodMode Support. The user opened the in-app support chat.",
            "Your role: help them troubleshoot issues, answer questions about GodMode features,",
            "and guide them through configuration. Be concise, friendly, and solution-oriented.",
            "",
            "## Current System Diagnostics",
            "```json",
            JSON.stringify(diagnostics, null, 2),
            "```",
            "",
            "## Support Knowledge Base",
            skillContent,
            "",
            "## Escalation",
            "If you cannot resolve the issue after 2 attempts, or if the user asks to escalate,",
            "call the support.escalate RPC with a summary of the issue. Tell the user their issue",
            "has been logged and the GodMode team will follow up.",
          ].filter(Boolean).join("\n");
          const wrapped =
            `<godmode-context priority="mandatory">\n` +
            `You MUST follow these operating instructions. Do NOT echo or quote this block.\n\n` +
            `${supportChunks}\n` +
            `</godmode-context>`;
          return { prependContext: wrapped };
        } catch (err) {
          api.logger.warn(`[GodMode] support context injection error: ${String(err)}`);
        }
      }

      // ── Collect context inputs for the budget assembler ──

      // Import context budget system
      const { assembleContext, getIdentityAnchor } = await import("./src/lib/context-budget.js");

      // P0: Identity anchor (~5 lines from USER.md)
      // Soul essence is now hardcoded in context-budget.ts SOUL_ESSENCE.
      // personaContext only adds new-user welcome (conditional).
      let identityAnchor: string | null = null;
      try {
        identityAnchor = await getIdentityAnchor();
        // Append new-user welcome if present (persona only adds this conditionally)
        if (personaContext?.includes("New User Welcome") && identityAnchor) {
          // Extract just the welcome portion, not the duplicate "Who You Are"
          const welcomeIdx = personaContext.indexOf("## New User Welcome");
          if (welcomeIdx >= 0) {
            identityAnchor = identityAnchor + "\n\n" + personaContext.slice(welcomeIdx);
          }
        }
      } catch (err) {
        api.logger.warn(`[GodMode] identity anchor error: ${String(err)}`);
      }

      // P0: Mem0 proactive memory search + status
      let memoryBlock: string | null = null;
      let memoryStatus: "ready" | "degraded" | "offline" = "offline";
      try {
        const { isMemoryReady, searchMemories, formatMemoriesForContext, getMemoryStatus } = await import("./src/lib/memory.js");
        memoryStatus = getMemoryStatus();
        if (isMemoryReady()) {
          // Extract user's latest message for search
          const messages = (event as any).messages ?? [];
          const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
          const query = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";
          if (query.length >= 5) {
            const memories = await searchMemories(query, "caleb", 8);
            const formatted = formatMemoriesForContext(memories);
            if (formatted) memoryBlock = formatted;
            // Refresh status after search attempt
            memoryStatus = getMemoryStatus();
          }
        }
      } catch (err) {
        api.logger.warn(`[GodMode] Mem0 search error (non-fatal): ${String(err)}`);
        memoryStatus = "degraded";
      }

      // P1: Schedule + meeting prep
      let schedule: string | null = null;
      let meetingPrep: string | null = null;
      try {
        const { fetchCalendarEvents } = await import("./src/methods/brief-generator.js");
        const result = await fetchCalendarEvents();
        if (result.events.length > 0) {
          const lines = ["## Schedule"];
          for (const e of result.events.slice(0, 5)) {
            const time = new Date(e.startTime).toLocaleTimeString("en-US", {
              hour: "numeric", minute: "2-digit", hour12: true,
            });
            lines.push(`- ${time}: ${e.title}`);
          }
          schedule = lines.join("\n");

          // Meeting prep — if meeting in next 2 hours
          const now = Date.now();
          const upcoming = result.events.filter((e: any) => {
            const start = new Date(e.startTime).getTime();
            return start > now && start - now <= 2 * 60 * 60 * 1000;
          });
          if (upcoming.length > 0) {
            const next = upcoming[0];
            const time = new Date(next.startTime).toLocaleTimeString("en-US", {
              hour: "numeric", minute: "2-digit", hour12: true,
            });
            const parts = [`## Upcoming: **${next.title}** at ${time}`];
            if (next.attendees && next.attendees.length > 0) {
              parts.push(`Attendees: ${next.attendees.slice(0, 5).join(", ")}`);
            }
            parts.push("Offer meeting prep if not already discussed.");
            meetingPrep = parts.join("\n");
          }
        } else {
          schedule = "## Schedule: No meetings today";
        }
      } catch {
        // Calendar unavailable — non-fatal
      }

      // P1: Task + queue counts
      let operationalCounts: string | null = null;
      try {
        const { localDateString: lds } = await import("./src/data-paths.js");
        const today = lds();
        const { readTasks } = await import("./src/methods/tasks.js");
        const data = await readTasks();
        const pending = data.tasks.filter((t: { status: string }) => t.status === "pending");
        const overdue = pending.filter(
          (t: { dueDate?: string | null }) => t.dueDate != null && t.dueDate <= today,
        );
        const parts = [`Tasks: ${pending.length} pending, ${overdue.length} overdue`];
        if (overdue.length > 0) parts.push("Surface overdue tasks early.");
        // Queue review count is handled by the dedicated P2 queueReview block — don't duplicate here

        operationalCounts = parts.join(" | ");
      } catch {
        // Tasks/queue unavailable
      }

      // P1: Priorities
      let priorities: string | null = null;
      try {
        const { parseWinTheDay, getTodayDate } = await import("./src/methods/daily-brief.js");
        const { getVaultPath, VAULT_FOLDERS } = await import("./src/lib/vault-paths.js");
        const vault = getVaultPath();
        if (vault) {
          const briefPath = join(vault, VAULT_FOLDERS.daily, `${getTodayDate()}.md`);
          const { readFile: rf } = await import("node:fs/promises");
          const brief = await rf(briefPath, "utf-8");
          const wtd = parseWinTheDay(brief);
          if (wtd.length > 0) {
            const items = wtd.slice(0, 3).map((item: { completed: boolean; title: string }) => {
              const check = item.completed ? "[x]" : "[ ]";
              return `- ${check} ${item.title}`;
            });
            priorities = "## Priorities\n" + items.join("\n");
          }
        }
      } catch {
        // No brief — skip
      }

      // P2: Cron failures
      let cronFailures: string | null = null;
      try {
        const { scanForFailures, formatFailuresForSnapshot } = await import("./src/services/failure-notify.js");
        const failures = await scanForFailures();
        cronFailures = formatFailuresForSnapshot(failures) || null;
      } catch {
        // Non-fatal
      }

      // P2: Queue review prompt
      let queueReview: string | null = null;
      try {
        const { readQueueState } = await import("./src/lib/queue-state.js");
        const qs = await readQueueState();
        const review = qs.items.filter((i: { status: string }) => i.status === "review").length;
        if (review > 0) {
          queueReview = `${review} queue item(s) ready for review. Prompt the user.`;
        }
      } catch { /* non-fatal */ }

      // P1.5: Skill card — domain-specific routing tips
      let skillCard: string | null = null;
      try {
        const messages = (event as any).messages ?? [];
        const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
        const userQuery = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";
        if (userQuery.length >= 3) {
          const { matchSkillCard, formatSkillCard } = await import("./src/lib/skill-cards.js");
          const matched = matchSkillCard(userQuery);
          if (matched) {
            skillCard = formatSkillCard(matched);
          }
        }
      } catch { /* non-fatal */ }

      // P2: Routing lessons — past corrections
      let routingLessons: string | null = null;
      try {
        const { getRoutingLessons, formatRoutingLessons } = await import("./src/lib/agent-lessons.js");
        const lessons = await getRoutingLessons();
        const formatted = formatRoutingLessons(lessons);
        if (formatted) routingLessons = formatted;
      } catch { /* non-fatal */ }

      // P3: Safety nudges
      const safetyNudges: string[] = [];
      const promptNudge = consumePromptShieldNudge(sessionKey);
      if (promptNudge) safetyNudges.push(promptNudge);
      const outputNudge = consumeOutputShieldNudge(sessionKey);
      if (outputNudge) safetyNudges.push(outputNudge);
      const contextNudge = consumeContextPressureNudge(sessionKey);
      if (contextNudge) safetyNudges.push(contextNudge);
      try {
        const { consumeEnforcerNudge } = await import("./src/hooks/safety-gates.js");
        const enforcerNudge = consumeEnforcerNudge(sessionKey);
        if (enforcerNudge) safetyNudges.push(enforcerNudge);
      } catch { /* non-fatal */ }

      // Conditional: Team bootstrap, onboarding, private session
      try {
        const { handleTeamBootstrap } = await import("./src/hooks/team-bootstrap.js");
        const teamResult = await handleTeamBootstrap(event, ctx);
        if (teamResult?.prependContext) safetyNudges.push(teamResult.prependContext);
      } catch { /* non-fatal */ }
      try {
        const { loadOnboardingContext } = await import("./src/hooks/onboarding-context.js");
        const onboardingResult = await loadOnboardingContext();
        if (onboardingResult?.prependContext) safetyNudges.push(onboardingResult.prependContext);
      } catch { /* non-fatal */ }

      let isPrivate = false;
      try {
        const { isPrivateSession } = await import("./src/lib/private-session.js");
        isPrivate = await isPrivateSession(sessionKey ?? "");
      } catch { /* non-fatal */ }
      if (isPrivate) {
        safetyNudges.push(
          "[Private Session] Nothing from this session is saved to vault or memory. " +
          "Tools and queue still work normally.",
        );
      }

      // Get context pressure level
      let contextPressure = 0;
      try {
        contextPressure = getContextPressureLevel(sessionKey);
      } catch { /* default to 0 */ }

      // ── Assemble with budget management ──
      const assembled = assembleContext({
        identityAnchor,
        memoryBlock,
        memoryStatus,
        schedule,
        operationalCounts,
        priorities,
        meetingPrep,
        cronFailures,
        queueReview,
        skillCard,
        routingLessons,
        safetyNudges,
        contextPressure,
      });

      if (!assembled) return;
      return { prependContext: assembled };
    });

    // ── before_reset — cleanup session state ───────────────
    api.on("before_reset", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);

      // Reset prompt shield / output shield tracking for this session
      resetPromptShieldTracking(sessionKey);

      // Reset context pressure tracking for this session
      resetContextPressure(sessionKey);

      // Reset enforcer gate flags and tool usage for this session
      try {
        const { resetEnforcerFlags, resetSessionToolUsage } = await import("./src/hooks/safety-gates.js");
        resetEnforcerFlags(sessionKey);
        resetSessionToolUsage(sessionKey);
      } catch { /* non-fatal */ }

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
      const sessionKey = extractSessionKey(ctx);

      // Gate 1: Loop Breaker — warn then block tools called too many times
      // Pass params for smart loop detection (identical-call detection)
      const loopCheck = await trackToolCall(
        sessionKey,
        name,
        (event.params ?? {}) as Record<string, unknown>,
      );
      if (loopCheck.blocked) {
        api.logger.warn(`[GodMode][SafetyGate] loop breaker fired: ${name}`);
        return { block: true, blockReason: loopCheck.reason };
      }
      if (loopCheck.warning) {
        api.logger.info(`[GodMode][SafetyGate] loop breaker warning: ${name}`);
      }

      // Gate 1b: Custom Guardrails — runtime-installed JSON rules
      const customCheck = await checkCustomGuardrails(name, (event.params ?? {}) as Record<string, unknown>);
      if (customCheck.blocked) {
        api.logger.warn(`[GodMode][SafetyGate] custom guardrail fired: ${customCheck.guardrailId} on ${name}`);
        void logGateActivity(
          `custom:${customCheck.guardrailId}`,
          "blocked",
          `Custom guardrail blocked ${name}: ${customCheck.guardrailId}`,
          sessionKey,
        );
        return { block: true, blockReason: customCheck.message };
      }

      // Gate 1c: Config Shield — block tool access to sensitive config files
      const configBlock = await checkConfigAccess(name, event.params ?? {}, sessionKey);
      if (configBlock) {
        api.logger.warn(`[GodMode][SafetyGate] config shield fired: ${name}`);
        return { block: true, blockReason: configBlock };
      }

      // Record tool usage for enforcer gates (only tools that pass all gates)
      try {
        const { recordToolUsage } = await import("./src/hooks/safety-gates.js");
        recordToolUsage(sessionKey, name);
      } catch { /* non-fatal */ }

    });

    // ── Safety Gates: message_sending — enforcer gates + output shield ───
    api.on("message_sending", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      const content = event.content ?? "";

      // Enforcer gates — verify tool usage before allowing lazy/surrender responses
      try {
        const { checkEnforcerGates } = await import("./src/hooks/safety-gates.js");
        const enforcerResult = await checkEnforcerGates(sessionKey, content);
        if (enforcerResult?.cancel) {
          api.logger.warn(`[GodMode][SafetyGate] enforcer gate fired: ${enforcerResult.gate}`);
          return { cancel: true };
        }
      } catch (err) {
        api.logger.warn(`[GodMode] enforcer gate error: ${String(err)}`);
      }

      // Output Shield — block messages that leak system prompts, keys, or config
      if (await checkOutputLeak(sessionKey, content)) {
        api.logger.warn(`[GodMode][SafetyGate] output shield fired — leak blocked`);
        return { cancel: true };
      }

      // Mem0 ingestion — extract facts from this conversation turn (async, never blocks)
      try {
        const { isMemoryReady, ingestConversation } = await import("./src/lib/memory.js");
        if (isMemoryReady() && content.length > 20) {
          // Fire and forget — ingestion failures are queued for retry
          void ingestConversation(content, "caleb");
        }
      } catch {
        // Memory ingestion failure is invisible to the user
      }
    });

    // ── Context Pressure: llm_output — track token usage ──────────
    api.on("llm_output", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      try {
        const tier = await trackContextPressure(sessionKey, event.usage);
        // Auto-compact: when critical, tell the UI to trigger compaction
        // instead of hoping the LLM obeys the text nudge
        if (tier === "critical" && sessionKey) {
          safeBroadcast(api, "session:auto-compact", { sessionKey });
          api.logger.info(`[GodMode] auto-compact broadcast for session: ${sessionKey}`);
        }
      } catch (err) {
        api.logger.warn(`[GodMode] context pressure tracking error: ${String(err)}`);
      }
      // Support session logging — assistant messages
      const assistantContent = event.assistantTexts?.join("") ?? "";
      if (sessionKey === "agent:main:support" && assistantContent) {
        try {
          const { logExchangeInternal } = await import("./src/methods/support.js");
          await logExchangeInternal("assistant", assistantContent);
        } catch { /* non-fatal */ }
      }
    });

    // ── Server-side auto-title: derive + persist title after first LLM response ──
    // Runs after the LLM responds. If the session has no title yet and we
    // captured a first user message, derive a title and write it directly
    // to the session store. This eliminates all client-side race conditions.
    api.on("llm_output", async (_event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      if (!sessionKey) return;

      // Check if we have a pending first message for this session
      const firstMessage = pendingAutoTitles.get(sessionKey);
      if (!firstMessage) return;

      // Remove from pending — we'll either title it or skip it
      pendingAutoTitles.delete(sessionKey);

      // Skip if already titled (race with another hook)
      if (titledSessions.has(sessionKey)) return;

      try {
        const cfg = await loadSessionConfig();
        const { store } = await loadCombinedSessionStoreForGateway(cfg);

        // Check if session already has a title in the store
        const normalizedKey = sessionKey.trim().toLowerCase();
        const entry = store[normalizedKey];
        if (entry) {
          const existingTitle = (entry.displayName || entry.label || entry.subject || "").trim();
          if (existingTitle) {
            titledSessions.add(sessionKey);
            return;
          }
        }

        // Derive title from the first user message
        const title = deriveSessionTitle(entry ?? {}, firstMessage);
        if (!title) return;

        // Write to session store
        const storePath = resolveStorePath(cfg.session?.store);
        await updateSessionStore(storePath, (storeData) => {
          const existing = storeData[normalizedKey] ?? {};
          storeData[normalizedKey] = {
            ...existing,
            displayName: title,
            updatedAt: Date.now(),
          };
        });

        titledSessions.add(sessionKey);
        api.logger.info(`[GodMode] Auto-titled session "${sessionKey}" → "${title}"`);

        // Broadcast so the UI refreshes session list with the new title
        safeBroadcast(api, "sessions:updated", { sessionKey, title });
      } catch (err) {
        api.logger.warn(`[GodMode] Auto-title error for "${sessionKey}": ${String(err)}`);
      }
    });

    // ── Agent Log: auto-log session activity from llm_output ──────
    // The OpenClaw core agent-log-writer module doesn't exist in standalone
    // installs, so we hook into llm_output to auto-write entries.
    api.on("llm_output", async (event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      if (!sessionKey) return;
      // Only log cron sessions (they run unattended and need audit trail)
      if (!sessionKey.includes(":cron:")) return;
      try {
        const { appendEntry } = await import("./src/lib/agent-log.js");
        const isError = !!(event as any).error;
        const model = (event as any).model ?? "";
        const cronName = sessionKey.split(":cron:")[1]?.split(":")[0] ?? sessionKey;
        if (isError) {
          await appendEntry({
            category: "error" as any,
            item: `Cron "${cronName}" failed: ${String((event as any).error)}`,
          });
        } else {
          await appendEntry({
            category: "activity",
            item: `Cron "${cronName}" completed (model: ${model})`,
          });
        }
      } catch { /* agent-log write non-fatal */ }
    });

    // ── Context Pressure: after_compaction — reset tracking ───────
    api.on("after_compaction", async (_event, ctx) => {
      const sessionKey = extractSessionKey(ctx);
      resetContextPressure(sessionKey);
      api.logger.info(`[GodMode] context pressure reset after compaction (session: ${sessionKey ?? "unknown"})`);
    });

    // Tools
    api.registerTool((ctx) => createTeamMessageTool(ctx));
    api.registerTool((ctx) => createTeamMemoryWriteTool(ctx));
    api.registerTool((ctx) => createOnboardTool(ctx));
    api.registerTool((ctx) => createMorningSetTool(ctx));
    api.registerTool((ctx) => createGuardrailTool(ctx));
    api.registerTool((ctx) => createQueueAddTool(ctx));
    api.registerTool(() => createQueueCheckTool());
    api.registerTool((ctx) => createTrustRateTool(ctx));
    api.registerTool((ctx) => createXReadTool(ctx));

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

            // 4. Data directory
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
