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

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
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
import { clickupHandlers } from "./src/methods/clickup.js";
import { consciousnessHandlers } from "./src/methods/consciousness.js";
import { dailyBriefHandlers } from "./src/methods/daily-brief.js";
import { dataSourcesHandlers } from "./src/methods/data-sources.js";
import { goalsHandlers } from "./src/methods/goals.js";
import { innerWorkHandlers } from "./src/methods/inner-work.js";
import { lifeDashboardsHandlers } from "./src/methods/life-dashboards.js";
import { lifetracksHandlers } from "./src/methods/lifetracks.js";
import { onboardingHandlers } from "./src/methods/onboarding.js";
import { peopleDataHandlers } from "./src/methods/people-data.js";
import { projectsHandlers } from "./src/methods/projects.js";
import { subagentRunsHandlers } from "./src/methods/subagent-runs.js";
import { tasksHandlers } from "./src/methods/tasks.js";
// therapy handlers deprecated — old code, not shipping in plugin
import { uiSlotsHandlers } from "./src/methods/ui-slots.js";
import { workspacesHandlers } from "./src/methods/workspaces.js";
import { initAgentLogWriter } from "./src/services/agent-log-writer.js";
// Static file server for UIs
import { createStaticFileHandler } from "./src/static-server.js";

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
<pre>~/Projects/GodMode/scripts/start-ops-dashboard.sh</pre>
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
  const targetPath = `${stripOpsPrefix(requestUrl.pathname)}${requestUrl.search}`;
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

    const allHandlers: Record<string, unknown> = {
      ...projectsHandlers,
      ...tasksHandlers,
      ...workspacesHandlers,
      ...dailyBriefHandlers,
      ...lifeDashboardsHandlers,
      ...lifetracksHandlers,
      ...innerWorkHandlers,
      ...goalsHandlers,
      ...peopleDataHandlers,
      ...dataSourcesHandlers,
      ...agentLogHandlers,
      ...briefNotesHandlers,
      ...clickupHandlers,
      ...calendarHandlers,
      ...subagentRunsHandlers,
      ...uiSlotsHandlers,
      ...onboardingHandlers,
      ...consciousnessHandlers,
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
    const monorepoRoot = resolve(pluginRoot, "../..");

    const godmodeUiCandidates = [
      join(pluginRoot, "dist", "godmode-ui"),
      join(pluginRoot, "assets", "godmode-ui"),
      join(pluginRoot, "dist", "control-ui"),
      join(monorepoRoot, "dist", "control-ui"),
    ];
    const godmodeUiRoot =
      godmodeUiCandidates.find((p) => {
        const index = join(p, "index.html");
        if (!existsSync(index)) return false;
        try {
          const html = readFileSync(index, "utf8");
          return /<godmode-app\b/i.test(html);
        } catch {
          return existsSync(index);
        }
      }) ?? godmodeUiCandidates.find((p) => existsSync(join(p, "index.html")));

    const deckUiCandidates = [
      join(pluginRoot, "dist", "deck"),
      join(monorepoRoot, "dist", "deck"),
      join(monorepoRoot, "deck", "dist"),
    ];
    const deckUiRoot = deckUiCandidates.find((p) => existsSync(join(p, "index.html")));

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
      if (deckHandler && (pathname === "/deck" || pathname.startsWith("/deck/"))) {
        deckHandler(req, res);
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
    });

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
      },
      { commands: ["godmode"] },
    );
  },
};

export default godmodePlugin;
