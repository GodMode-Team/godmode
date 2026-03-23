/**
 * hermes/adapter.ts — HermesAdapter: HostAdapter for Hermes Agent runtime.
 *
 * Runs a standalone HTTP + WebSocket server that:
 *   - Serves the GodMode UI (static files from dist/godmode-ui/)
 *   - Handles RPC methods over WebSocket (same protocol the UI expects)
 *   - Proxies chat messages to Hermes Agent HTTP API
 *   - Exposes GodMode tools via MCP for Hermes to use
 *
 * Usage:
 *   const adapter = new HermesAdapter({ port: 3333, hermesUrl: "http://localhost:8642" });
 *   adapter.registerMethod("tasks.list", handler);
 *   adapter.registerTool(createQueueAddTool);
 *   await adapter.start({ pluginRoot: "/path/to/plugin", pluginVersion: "1.7.2" });
 */

import { createServer, type Server as HttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, createReadStream, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { homedir } from "node:os";
import type {
  HostAdapter,
  HostCapabilities,
  StandaloneRequestHandler,
  StandaloneAgentTool,
  ToolContext,
  AdapterLogger,
} from "../types.js";
import { GodModeWsServer } from "./ws-server.js";
import { HermesChatProxy } from "./chat-proxy.js";
import { GodModeMcpServer } from "./mcp-server.js";

// ── MIME types ───────────────────────────────────────────────────

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// ── Options ──────────────────────────────────────────────────────

export interface HermesAdapterOptions {
  /** Port for the GodMode server (default: 3333). */
  port?: number;
  /** Hermes Agent API URL (default: http://localhost:8642). */
  hermesUrl?: string;
  /** Hermes API key (optional, for authenticated access). */
  hermesApiKey?: string;
  /** Custom logger (default: console). */
  logger?: AdapterLogger;
}

// ── Adapter ──────────────────────────────────────────────────────

export class HermesAdapter implements HostAdapter {
  readonly runtime = "hermes" as const;

  readonly capabilities: HostCapabilities = {
    memory: true,
    personality: true,
    skills: true,
    compression: true,
    toolExecution: true,
  };

  readonly logger: AdapterLogger;

  private port: number;
  private hermesUrl: string;
  private server: HttpServer | null = null;
  private wsServer: GodModeWsServer;
  private chatProxy: HermesChatProxy;
  private mcpServer: GodModeMcpServer;
  private toolFactories: Array<(ctx: ToolContext) => StandaloneAgentTool> = [];
  private uiRoot: string | null = null;
  private uiBasePath = "/godmode";

  // Hook handlers — wired by register-all.ts
  private beforeChatHandler: ((sessionKey: string, userMessage: string) => Promise<string | null>) | null = null;
  private afterChatHandler: ((sessionKey: string, userMsg: string, assistantMsg: string) => Promise<void>) | null = null;
  private messageReceivedHandler: ((sessionKey: string, message: string) => Promise<void>) | null = null;

  constructor(opts: HermesAdapterOptions = {}) {
    this.port = opts.port ?? 3333;
    this.hermesUrl = opts.hermesUrl ?? "http://localhost:8642";
    this.logger = opts.logger ?? {
      info: (m) => console.log(m),
      warn: (m) => console.warn(m),
      error: (m) => console.error(m),
    };

    this.wsServer = new GodModeWsServer(this.logger);
    this.mcpServer = new GodModeMcpServer();
    this.chatProxy = new HermesChatProxy({
      hermesUrl: this.hermesUrl,
      hermesApiKey: opts.hermesApiKey,
      logger: this.logger,
    });

    // Register built-in chat methods that the UI calls
    this.registerChatMethods();
  }

  // ── HostAdapter: Registration ──────────────────────────────

  registerMethod(name: string, handler: StandaloneRequestHandler): void {
    this.wsServer.registerMethod(name, handler);
  }

  registerTool(factory: (ctx: ToolContext) => StandaloneAgentTool): void {
    this.toolFactories.push(factory);
    this.mcpServer.registerTool(factory);
  }

  serveStaticFiles(root: string, basePath: string): void {
    this.uiRoot = root;
    this.uiBasePath = basePath;
  }

  // ── HostAdapter: Communication ─────────────────────────────

  broadcast(event: string, data: unknown): void {
    this.wsServer.broadcast(event, data);
  }

  // ── HostAdapter: Hooks ───────────────────────────────────

  onBeforeChat(handler: (sessionKey: string, userMessage: string) => Promise<string | null>): void {
    this.beforeChatHandler = handler;
  }

  onAfterChat(handler: (sessionKey: string, userMsg: string, assistantMsg: string) => Promise<void>): void {
    this.afterChatHandler = handler;
  }

  onMessageReceived(handler: (sessionKey: string, message: string) => Promise<void>): void {
    this.messageReceivedHandler = handler;
  }

  // ── HostAdapter: Lifecycle ─────────────────────────────────

  async start(opts: { pluginRoot: string; pluginVersion: string }): Promise<void> {
    // Resolve UI root if not explicitly set
    if (!this.uiRoot) {
      const distUi = join(opts.pluginRoot, "dist", "godmode-ui");
      const assetsUi = join(opts.pluginRoot, "assets", "godmode-ui");
      this.uiRoot = existsSync(distUi) ? distUi : assetsUi;
    }

    // Create HTTP server
    this.server = createServer((req, res) => this.handleHttp(req, res));

    // Attach WebSocket server
    this.wsServer.attach(this.server);

    // Check Hermes connectivity
    const hermesOk = await this.chatProxy.healthCheck();
    if (hermesOk) {
      this.logger.info(`[Hermes Adapter] Connected to Hermes at ${this.hermesUrl}`);
    } else {
      this.logger.warn(
        `[Hermes Adapter] Cannot reach Hermes at ${this.hermesUrl}. ` +
        `Start it with: hermes gateway start`,
      );
    }

    // Bind and listen
    await new Promise<void>((resolve) => {
      this.server!.listen(this.port, () => {
        this.logger.info(`[Hermes Adapter] GodMode server listening on http://localhost:${this.port}`);
        this.logger.info(`[Hermes Adapter] UI: http://localhost:${this.port}${this.uiBasePath}`);
        this.logger.info(`[Hermes Adapter] WebSocket: ws://localhost:${this.port}`);
        this.logger.info(`[Hermes Adapter] ${this.toolFactories.length} GodMode tools registered for MCP`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    this.wsServer.close();
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
      this.server = null;
    }
    this.logger.info("[Hermes Adapter] Stopped");
  }

  /** Get the MCP server instance (for standalone MCP entry point). */
  getMcpServer(): GodModeMcpServer {
    return this.mcpServer;
  }

  // ── HTTP Handler ───────────────────────────────────────────

  private handleHttp(req: IncomingMessage, res: ServerResponse): void {
    const url = req.url ?? "/";

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Health endpoint
    if (url === "/health" || url === "/godmode/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "ok",
        runtime: "hermes",
        clients: this.wsServer.clientCount,
      }));
      return;
    }

    // Redirect root and bare base path to UI with trailing slash
    // (trailing slash is required so relative asset paths like ./assets/... resolve correctly)
    if (url === "/" || url === "" || url === this.uiBasePath) {
      res.writeHead(302, { Location: `${this.uiBasePath}/` });
      res.end();
      return;
    }

    // Static file serving for UI
    if (url.startsWith(`${this.uiBasePath}/`) && this.uiRoot) {
      this.serveFile(req, res, url);
      return;
    }

    // 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }

  private serveFile(_req: IncomingMessage, res: ServerResponse, url: string): void {
    // Strip query string and base path
    const [cleanUrl] = url.split("?");
    let filePath = cleanUrl.slice(this.uiBasePath.length) || "/";
    if (filePath === "/" || filePath === "") filePath = "/index.html";

    const fullPath = join(this.uiRoot!, filePath);

    // Security: prevent path traversal
    if (!fullPath.startsWith(this.uiRoot!)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
        // SPA fallback — serve index.html for unknown routes
        const indexPath = join(this.uiRoot!, "index.html");
        if (existsSync(indexPath)) {
          res.writeHead(200, { "Content-Type": "text/html" });
          createReadStream(indexPath).pipe(res);
          return;
        }
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = extname(fullPath);
      const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      createReadStream(fullPath).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("Internal server error");
    }
  }

  // ── Chat Method Registration ───────────────────────────────

  private registerChatMethods(): void {
    // The UI sends chat messages via RPC. Register handlers that proxy to Hermes.
    // The UI expects events with: { event: "chat", payload: { runId, sessionKey, state, message } }
    // where message = { role: "assistant", content: "cumulative text" } for deltas.
    this.wsServer.registerMethod("chat.send", async ({ params, respond }) => {
      const message = params.message as string;
      const sessionKey = (params.sessionKey as string) ?? "default";
      const runId = (params.idempotencyKey as string) ?? `hermes-${Date.now()}`;

      // Extract image attachments sent by the UI
      const rawAttachments = params.attachments as
        | Array<{ type?: string; mimeType?: string; content?: string; fileName?: string }>
        | undefined;
      const imageAttachments = rawAttachments
        ?.filter((a) => a.type === "image" && a.mimeType && a.content)
        .map((a) => ({
          type: "image" as const,
          mimeType: a.mimeType!,
          content: a.content!,
          fileName: a.fileName,
        }));

      if (!message && (!imageAttachments || imageAttachments.length === 0)) {
        respond(false, null, { code: "INVALID_REQUEST", message: "No message provided" });
        return;
      }

      // Hook: message_received — action item extraction, session tracking
      if (this.messageReceivedHandler) {
        try { await this.messageReceivedHandler(sessionKey, message); } catch { /* non-fatal */ }
      }

      // Hook: before_prompt_build — inject workspace context into chat proxy
      if (this.beforeChatHandler) {
        try {
          const ctx = await this.beforeChatHandler(sessionKey, message ?? "");
          if (ctx) {
            this.chatProxy.setWorkspaceContext(ctx);
          }
        } catch { /* non-fatal */ }
      }

      // Acknowledge receipt immediately
      respond(true, { status: "ok" });

      // Track cumulative text for delta events
      let cumulative = "";

      // Stream response via broadcast events matching the UI's expected protocol
      await this.chatProxy.sendMessage(sessionKey, message ?? "", {
        onToken: (token) => {
          cumulative += token;
          this.broadcast("chat", {
            runId,
            sessionKey,
            state: "delta",
            message: { role: "assistant", content: cumulative },
          });
        },
        onDone: (_fullResponse) => {
          this.broadcast("chat", {
            runId,
            sessionKey,
            state: "final",
            message: { role: "assistant", content: cumulative },
          });

          // Hook: message_sending — Honcho ingest, identity graph update
          if (this.afterChatHandler) {
            this.afterChatHandler(sessionKey, message, cumulative).catch((err: unknown) => this.logger.warn(`[afterChat] hook failed: ${err instanceof Error ? err.message : String(err)}`));
          }
        },
        onError: (error) => {
          this.broadcast("chat", {
            runId,
            sessionKey,
            state: "error",
            errorMessage: error.message,
          });
        },
      }, imageAttachments && imageAttachments.length > 0 ? imageAttachments : undefined);
    });

    // Chat history — return stored messages so UI persists after stream ends
    this.wsServer.registerMethod("chat.history", async ({ params, respond }) => {
      const sessionKey = (params.sessionKey as string) ?? "default";
      const messages = await this.chatProxy.getHistory(sessionKey);
      respond(true, { messages });
    });

    // Chat abort — stub (Hermes doesn't support mid-stream abort yet)
    this.wsServer.registerMethod("chat.abort", async ({ respond }) => {
      respond(true, {});
    });

    // Session management
    this.wsServer.registerMethod("chat.newSession", async ({ respond }) => {
      const sessionId = this.chatProxy.createSession();
      respond(true, { sessionId });
    });

    this.wsServer.registerMethod("chat.listSessions", async ({ respond }) => {
      const sessions = await this.chatProxy.listSessions();
      respond(true, { sessions });
    });

    // Hermes status
    this.wsServer.registerMethod("hermes.status", async ({ respond }) => {
      const healthy = await this.chatProxy.healthCheck();
      respond(true, {
        connected: healthy,
        url: this.hermesUrl,
        runtime: "hermes",
        tools: this.mcpServer.getToolDefinitions().length,
      });
    });

    // Active model — UI model pill reads this
    this.wsServer.registerMethod("godmode.config.model", async ({ respond }) => {
      try {
        const cfgPath = join(homedir(), ".openclaw", "openclaw.json");
        if (existsSync(cfgPath)) {
          const raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
          const primary = raw?.agents?.defaults?.model?.primary ?? raw?.defaults?.model?.primary ?? null;
          const available: { id: string; name: string; provider: string }[] = [];
          const providers = raw?.models?.providers;
          if (providers && typeof providers === "object") {
            for (const [provKey, prov] of Object.entries(providers)) {
              for (const m of ((prov as Record<string, unknown>).models as any[]) ?? []) {
                available.push({ id: `${provKey}/${m.id}`, name: m.name ?? m.id, provider: provKey });
              }
            }
          }
          respond(true, { primary, available });
        } else {
          respond(true, { primary: null, available: [] });
        }
      } catch {
        respond(true, { primary: null, available: [] });
      }
    });

    // Set active model — quick model switching from chat
    this.wsServer.registerMethod("godmode.config.model.set", async ({ params, respond }) => {
      try {
        const cfgPath = join(homedir(), ".openclaw", "openclaw.json");
        const primary = (params as Record<string, unknown>)?.primary as string;
        if (!primary) { respond(false, { error: "primary is required" }); return; }
        let raw: Record<string, unknown> = {};
        if (existsSync(cfgPath)) {
          raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
        }
        if (!raw.agents) raw.agents = {};
        const agents = raw.agents as Record<string, unknown>;
        if (!agents.defaults) agents.defaults = {};
        const defaults = agents.defaults as Record<string, unknown>;
        if (!defaults.model) defaults.model = {};
        const model = defaults.model as Record<string, unknown>;
        model.primary = primary;
        if (primary.startsWith("anthropic/")) {
          model.fallbacks = ["openai-codex/gpt-5.3-codex"];
        } else {
          model.fallbacks = ["anthropic/claude-sonnet-4-6"];
        }
        writeFileSync(cfgPath, JSON.stringify(raw, null, 2), "utf-8");
        respond(true, { primary, fallbacks: model.fallbacks });
      } catch (err) {
        respond(false, { error: String(err) });
      }
    });
  }
}
