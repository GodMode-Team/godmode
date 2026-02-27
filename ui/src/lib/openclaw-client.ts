// OpenClaw (Clawdbot) API Client
// Connects to the gateway via WebSocket for RPC and events

export interface Session {
  key: string;
  displayName?: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  toolCalls?: unknown[];
}

export interface GatewayEvent {
  type: string;
  sessionKey?: string;
  data?: unknown;
}

type EventHandler = (event: GatewayEvent) => void;

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private rpcId = 0;
  private pendingRequests = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: unknown) => void }
  >();
  private eventHandlers: EventHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private url: string;

  constructor(url: string = "ws://localhost:18789/ws") {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener("open", () => {
          console.log("[OpenClaw] Connected");
          this.reconnectAttempts = 0;
          resolve();
        });

        this.ws.addEventListener("close", () => {
          console.log("[OpenClaw] Disconnected");
          this.handleReconnect();
        });

        this.ws.addEventListener("error", (error) => {
          console.error("[OpenClaw] WebSocket error:", error);
          reject(error);
        });

        this.ws.addEventListener("message", (event) => {
          this.handleMessage(event.data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);

      // RPC response
      if (message.id !== undefined && this.pendingRequests.has(message.id)) {
        const { resolve, reject } = this.pendingRequests.get(message.id)!;
        this.pendingRequests.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }
        return;
      }

      // Event
      if (message.type || message.event) {
        const event: GatewayEvent = {
          type: message.type || message.event,
          sessionKey: message.sessionKey,
          data: message.data || message,
        };
        this.eventHandlers.forEach((handler) => handler(event));
      }
    } catch (error) {
      console.error("[OpenClaw] Failed to parse message:", error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[OpenClaw] Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`[OpenClaw] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(() => {});
    }, delay);
  }

  private async call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    const id = ++this.rpcId;
    const request = {
      jsonrpc: "2.0",
      method,
      params,
      id,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.ws!.send(JSON.stringify(request));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error("RPC timeout"));
        }
      }, 30000);
    });
  }

  // Session methods
  async listSessions(): Promise<Session[]> {
    const result = await this.call<{ sessions: Session[] }>("sessions.list", {});
    return result.sessions || [];
  }

  async createSession(opts: { label?: string } = {}): Promise<Session> {
    return this.call<Session>("sessions.create", opts);
  }

  async patchSession(key: string, patch: { displayName?: string; label?: string }): Promise<void> {
    await this.call("sessions.patch", { key, ...patch });
  }

  async deleteSession(key: string): Promise<void> {
    await this.call("sessions.delete", { key });
  }

  // Chat methods
  async getHistory(sessionKey: string): Promise<ChatMessage[]> {
    const result = await this.call<{ messages: ChatMessage[] }>("chat.history", { sessionKey });
    return result.messages || [];
  }

  async sendMessage(sessionKey: string, message: string): Promise<void> {
    await this.call("chat.send", { sessionKey, message });
  }

  // Event subscription
  onEvent(handler: EventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      const index = this.eventHandlers.indexOf(handler);
      if (index > -1) {
        this.eventHandlers.splice(index, 1);
      }
    };
  }

  // Connection state
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const openClawClient = new OpenClawClient();
