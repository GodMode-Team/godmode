#!/usr/bin/env node
/**
 * standalone.ts — Hermes standalone entry point for GodMode.
 *
 * Starts a standalone HTTP + WebSocket server that serves the GodMode UI
 * and proxies chat to Hermes Agent. All GodMode methods, tools, and services
 * are registered — full feature parity with the OpenClaw plugin path.
 *
 * Usage:
 *   node dist/standalone.js [--port 3333] [--hermes-url http://localhost:8642]
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { HermesAdapter } from "./src/adapter/hermes/adapter.js";
import { registerGodMode } from "./src/adapter/register-all.js";
import type { StandaloneRequestHandler } from "./src/adapter/types.js";

// ── CLI Args ───────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
GodMode Standalone — Hermes Agent Runtime

Usage: godmode [options]

Options:
  --port <number>         Server port (default: 3333, env: GODMODE_PORT)
  --hermes-url <url>      Hermes API URL (default: http://localhost:8642, env: HERMES_URL)
  --hermes-api-key <key>  Hermes API key (env: HERMES_API_KEY)
  -h, --help              Show this help

Setup:
  1. Start Hermes:  hermes gateway start
  2. Start GodMode: node dist/standalone.js
  3. Open UI:       http://localhost:3333/godmode

MCP (for Hermes tool access):
  Add to ~/.hermes/config.yaml:
    mcp_servers:
      godmode:
        command: "node"
        args: ["${resolve("dist/mcp-entry.js")}"]
`);
    process.exit(0);
  }

  const flag = (name: string): string | undefined => {
    const idx = args.indexOf(name);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  return {
    port: Number(flag("--port") ?? process.env.GODMODE_PORT ?? "3333"),
    hermesUrl: flag("--hermes-url") ?? process.env.HERMES_URL ?? "http://localhost:8642",
    hermesApiKey: flag("--hermes-api-key") ?? process.env.HERMES_API_KEY,
  };
}

// ── Version ────────────────────────────────────────────────────

const moduleDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = moduleDir.endsWith("dist") ? dirname(moduleDir) : moduleDir;
let pluginVersion = "1.0.0";
try {
  const pkgPath = join(pluginRoot, "package.json");
  if (existsSync(pkgPath)) {
    pluginVersion = JSON.parse(readFileSync(pkgPath, "utf8")).version ?? pluginVersion;
  }
} catch { /* bundled installs may not have package.json */ }

// ── UI Stubs (OpenClaw-core methods the UI expects) ────────────

function registerOcStubs(adapter: { registerMethod: (name: string, handler: StandaloneRequestHandler) => void }) {
  // Sessions — sessions.list is a real handler in register-all.ts.
  // Only stub patch/delete/archived which don't have real implementations yet.
  adapter.registerMethod("sessions.patch", async ({ respond }) => {
    respond(true, { ok: true });
  });
  adapter.registerMethod("sessions.delete", async ({ respond }) => {
    respond(true, { ok: true });
  });
  adapter.registerMethod("sessions.archived", async ({ respond }) => {
    respond(true, { sessions: [] });
  });

  // Config
  adapter.registerMethod("config.get", async ({ respond }) => {
    respond(true, { config: {} });
  });
  adapter.registerMethod("config.set", async ({ respond }) => {
    respond(true, { ok: true });
  });
  adapter.registerMethod("config.schema", async ({ respond }) => {
    respond(true, { schema: null, uiHints: {}, version: null });
  });

  // System
  adapter.registerMethod("system.checkUpdates", async ({ respond }) => {
    respond(true, { updateAvailable: false, currentVersion: pluginVersion, runtime: "hermes" });
  });

  // Agents
  adapter.registerMethod("agents.list", async ({ respond }) => {
    respond(true, { agents: [{ id: "main", name: "Hermes", status: "active" }] });
  });
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  const { port, hermesUrl, hermesApiKey } = parseArgs();

  // ── API Key Pre-flight ────────────────────────────────────────
  // Check for any AI provider key early so users get a clear, actionable
  // message instead of mysterious failures later. Skip if a key will be
  // available after .env hydration (which hasn't run yet at this point).
  try {
    const hasEnvKey = !!(process.env.ANTHROPIC_API_KEY?.trim() || process.env.VENICE_API_KEY?.trim());
    if (!hasEnvKey) {
      const envPaths = [join(homedir(), "godmode", ".env"), join(pluginRoot, ".env")];
      let willHaveKey = false;
      for (const p of envPaths) {
        try {
          const content = readFileSync(p, "utf-8");
          if (/^(ANTHROPIC_API_KEY|VENICE_API_KEY)=\S+/m.test(content)) {
            willHaveKey = true;
            break;
          }
        } catch { /* missing or unreadable */ }
      }
      if (!willHaveKey) {
        console.warn(
          "\n" +
          "  ┌─────────────────────────────────────────────────────────────┐\n" +
          "  │  GodMode requires an AI provider key.                      │\n" +
          "  │                                                            │\n" +
          "  │  Set one in your environment:                              │\n" +
          "  │    export VENICE_API_KEY=...                               │\n" +
          "  │    export ANTHROPIC_API_KEY=sk-ant-...                     │\n" +
          "  │                                                            │\n" +
          "  │  Or add it to ~/godmode/.env                               │\n" +
          "  └─────────────────────────────────────────────────────────────┘\n" +
          "\n" +
          "  Continuing startup — agent delegation and background\n" +
          "  features will be unavailable until a key is configured.\n",
        );
      }
    }
  } catch {
    // non-fatal at this stage
  }

  const adapter = new HermesAdapter({ port, hermesUrl, hermesApiKey });

  // Register everything — methods, tools, services, hooks
  const { methodCount, cleanup } = await registerGodMode(adapter, {
    pluginRoot,
    pluginVersion,
  });

  // UI stubs for OpenClaw-core methods
  registerOcStubs(adapter);

  // Resolve UI root
  const uiCandidates = [
    join(pluginRoot, "dist", "godmode-ui"),
    join(pluginRoot, "ui", "dist"),
    join(pluginRoot, "assets", "godmode-ui"),
  ];
  const uiRoot = uiCandidates.find((p) => existsSync(join(p, "index.html")));
  if (uiRoot) {
    adapter.serveStaticFiles(uiRoot, "/godmode");
  }

  await adapter.start({ pluginRoot, pluginVersion });
  console.log(
    `[GodMode] Standalone ready — ${methodCount} methods, ` +
    `port ${port}, runtime: hermes, v${pluginVersion}`,
  );

  // Graceful shutdown
  for (const sig of ["SIGINT", "SIGTERM"] as const) {
    process.on(sig, async () => {
      console.log(`\n[GodMode] Received ${sig}, shutting down...`);
      for (const entry of cleanup) {
        try { await entry.fn(); } catch { /* swallow */ }
      }
      await adapter.stop();
      process.exit(0);
    });
  }
}

main().catch((err) => {
  console.error("[GodMode] Fatal startup error:", err);
  process.exit(1);
});
