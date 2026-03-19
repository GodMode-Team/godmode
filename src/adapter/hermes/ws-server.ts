/**
 * hermes/ws-server.ts — WebSocket server matching the GodMode UI protocol.
 *
 * The GodMode browser UI (GatewayBrowserClient) speaks a simple frame protocol
 * over WebSocket. This server implements that protocol so the existing UI
 * works unchanged with the Hermes adapter.
 *
 * Frame types:
 *   Browser → Server:  { type: "req", id: string, method: string, params: any }
 *   Server → Browser:  { type: "res", id: string, ok: boolean, payload?: any, error?: any }
 *   Server → Browser:  { type: "event", event: string, payload: any, seq?: number }
 */

import { WebSocketServer, type WebSocket } from "ws";
import type { Server as HttpServer } from "node:http";
import type { StandaloneRequestHandler, AdapterLogger } from "../types.js";

// ── Types ────────────────────────────────────────────────────────

interface InboundFrame {
  type: "req";
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

interface OutboundResFrame {
  type: "res";
  id: string;
  ok: boolean;
  payload?: unknown;
  error?: { code: string; message: string };
}

interface OutboundEventFrame {
  type: "event";
  event: string;
  payload: unknown;
  seq: number;
}

// ── WS Server ────────────────────────────────────────────────────

export class GodModeWsServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private methods: Map<string, StandaloneRequestHandler> = new Map();
  private eventSeq = 0;
  private logger: AdapterLogger;

  constructor(logger: AdapterLogger) {
    this.logger = logger;
  }

  /** Register an RPC method handler. */
  registerMethod(name: string, handler: StandaloneRequestHandler): void {
    this.methods.set(name, handler);
  }

  /** Attach to an existing HTTP server. */
  attach(server: HttpServer): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      this.logger.info(`[Hermes WS] Client connected (${this.clients.size} total)`);

      ws.on("message", (raw) => {
        this.handleMessage(ws, raw.toString());
      });

      ws.on("close", () => {
        this.clients.delete(ws);
        this.logger.info(`[Hermes WS] Client disconnected (${this.clients.size} total)`);
      });

      ws.on("error", (err) => {
        this.logger.error(`[Hermes WS] Client error: ${err.message}`);
        this.clients.delete(ws);
      });
    });
  }

  /** Broadcast an event to all connected clients. */
  broadcast(event: string, data: unknown): void {
    const frame: OutboundEventFrame = {
      type: "event",
      event,
      payload: data,
      seq: ++this.eventSeq,
    };
    const msg = JSON.stringify(frame);
    for (const ws of this.clients) {
      if (ws.readyState === ws.OPEN) {
        ws.send(msg);
      }
    }
  }

  /** Number of connected clients. */
  get clientCount(): number {
    return this.clients.size;
  }

  /** Shut down the WS server. */
  close(): void {
    for (const ws of this.clients) {
      ws.close(1001, "Server shutting down");
    }
    this.clients.clear();
    this.wss?.close();
    this.wss = null;
  }

  // ── Internal ─────────────────────────────────────────────────

  private async handleMessage(ws: WebSocket, raw: string): Promise<void> {
    let frame: InboundFrame;
    try {
      frame = JSON.parse(raw);
    } catch {
      this.logger.warn("[Hermes WS] Received non-JSON message");
      return;
    }

    if (frame.type !== "req") return;

    const { id, method, params } = frame;

    // Handle the `connect` handshake the UI sends on open
    if (method === "connect") {
      this.sendRes(ws, id, true, {
        type: "hello-ok",
        features: { hermes: true, godmode: true },
        version: "hermes-adapter/1.0.0",
      });
      return;
    }

    // Look up the registered RPC method
    const handler = this.methods.get(method);
    if (!handler) {
      this.sendRes(ws, id, false, undefined, {
        code: "METHOD_NOT_FOUND",
        message: `Unknown method: ${method}`,
      });
      return;
    }

    // Build the context object matching what GodMode handlers expect
    const context = {
      broadcast: (event: string, data: unknown) => this.broadcast(event, data),
      sessionKey: (params as Record<string, unknown>)?.sessionKey as string | undefined,
    };

    // Execute the handler
    try {
      await handler({
        params: (params ?? {}) as Record<string, unknown>,
        respond: (ok, payload, error) => {
          this.sendRes(ws, id, ok, payload, error);
        },
        context,
      });
    } catch (err) {
      this.logger.error(`[Hermes WS] Handler error for ${method}: ${err}`);
      this.sendRes(ws, id, false, undefined, {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private sendRes(
    ws: WebSocket,
    id: string,
    ok: boolean,
    payload?: unknown,
    error?: { code: string; message: string },
  ): void {
    if (ws.readyState !== ws.OPEN) return;
    const frame: OutboundResFrame = { type: "res", id, ok };
    if (ok) frame.payload = payload;
    else frame.error = error;
    ws.send(JSON.stringify(frame));
  }
}
