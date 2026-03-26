/**
 * Static file server for serving built UI assets.
 * Handles SPA routing (fallback to index.html) and correct MIME types.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".wasm": "application/wasm",
  ".map": "application/json",
};

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

/**
 * Create an HTTP handler that serves static files from a directory
 * with SPA fallback to index.html.
 */
export function createStaticFileHandler(
  root: string,
  basePath: string,
): (req: IncomingMessage, res: ServerResponse) => void {
  const normalizedBase = basePath.endsWith("/") ? basePath : basePath + "/";

  return (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = url.pathname;

    // Redirect /basePath to /basePath/
    if (pathname === basePath || pathname === basePath.replace(/\/$/, "")) {
      res.writeHead(302, { Location: `${normalizedBase}${url.search}` });
      res.end();
      return;
    }

    // Strip base path
    if (pathname.startsWith(normalizedBase)) {
      pathname = pathname.slice(normalizedBase.length - 1);
    }
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }

    // Resolve file path — prevent directory traversal
    const filePath = join(root, pathname);
    if (!filePath.startsWith(root)) {
      res.writeHead(403, SECURITY_HEADERS);
      res.end("Forbidden");
      return;
    }

    // Try exact file, then SPA fallback to index.html
    const target = existsSync(filePath) && !filePath.endsWith("/")
      ? filePath
      : join(root, "index.html");

    if (!existsSync(target)) {
      res.writeHead(404, { ...SECURITY_HEADERS, "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = extname(target).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";

    // Cache hashed assets (vite fingerprints) aggressively; HTML never cached
    const isHtml = ext === ".html";
    const cacheControl = isHtml
      ? "no-cache, must-revalidate"
      : "public, max-age=31536000, immutable";

    try {
      const content = readFileSync(target);
      res.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": content.length,
        "Cache-Control": cacheControl,
        ...SECURITY_HEADERS,
      });
      if (req.method === "HEAD") {
        res.end();
      } else {
        res.end(content);
      }
    } catch {
      res.writeHead(500, { ...SECURITY_HEADERS, "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  };
}
