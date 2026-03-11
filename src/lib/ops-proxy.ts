/**
 * ops-proxy.ts — Mission Control sidecar reverse proxy.
 *
 * Proxies /ops/* requests to the local ops-dashboard at 127.0.0.1:3456.
 */

import {
  request as httpRequest,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type OutgoingHttpHeaders,
  type ServerResponse,
} from "node:http";

export const OPS_PROXY_PREFIX = "/ops";
const OPS_PROXY_HOST = "127.0.0.1";
const OPS_PROXY_PORT = 3456;
const OPS_PROXY_ORIGIN = `http://${OPS_PROXY_HOST}:${OPS_PROXY_PORT}`;

export function isOpsPath(pathname: string): boolean {
  return pathname === OPS_PROXY_PREFIX || pathname.startsWith(`${OPS_PROXY_PREFIX}/`);
}

export function requestPathname(url: string): string {
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

export function shouldProxyOpsApiRequest(req: IncomingMessage, pathname: string): boolean {
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

export async function proxyOpsRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
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
