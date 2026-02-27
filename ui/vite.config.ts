import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));

function normalizeBase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "/";
  if (trimmed === "./") return "./";
  if (trimmed.endsWith("/")) return trimmed;
  return `${trimmed}/`;
}

export default defineConfig(({ command }) => {
  const envBase = process.env.CLAWDBOT_CONTROL_UI_BASE_PATH?.trim();
  const base = envBase ? normalizeBase(envBase) : "./";
  const isDev = command === "serve";
  const gwPort = process.env.GODMODE_DEV_GATEWAY_PORT || "18789";
  return {
    root: here,
    base,
    publicDir: path.resolve(here, "public"),
    plugins: [
      // Add [DEV] prefix to page title and inject dev mode flag
      isDev && {
        name: "dev-mode-setup",
        transformIndexHtml(html: string) {
          // Inject dev mode flag so storage.ts uses the Vite proxy for WebSocket
          const devScript = `<script>window.__GODMODE_DEV__ = true;</script>`;
          return html
            .replace(/<title>([^<]+)<\/title>/, "<title>DEV — $1</title>")
            .replace("</head>", `${devScript}</head>`);
        },
      },
    ].filter(Boolean),
    optimizeDeps: {
      include: ["lit/directives/repeat.js"],
    },
    build: {
      outDir: path.resolve(here, "dist"),
      emptyOutDir: true,
      // Only enable source maps in development to avoid exposing source code in production
      sourcemap: command === "serve",
    },
    server: {
      host: true,
      port: 5175,
      strictPort: false,
      allowedHosts: true, // Allow all hosts in dev mode
      // Proxy gateway requests so websocket is same-origin
      proxy: {
        "/ws": {
          target: `ws://127.0.0.1:${gwPort}`,
          ws: true,
          changeOrigin: true,
        },
        "/api": {
          target: `http://127.0.0.1:${gwPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
