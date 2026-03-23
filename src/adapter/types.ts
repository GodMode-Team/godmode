/**
 * adapter/types.ts — Standalone type definitions for the HostAdapter pattern.
 *
 * These mirror the openclaw/plugin-sdk types so that GodMode core code
 * can work with either OpenClaw or Hermes (or future runtimes) without
 * importing the SDK directly.
 *
 * Phase 1 (current): New adapter code imports from here.
 * Phase 2 (future):  All 48 existing files migrate to these types.
 */

// ── Logger ──────────────────────────────────────────────────────

export interface AdapterLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

// ── RPC Method Types ────────────────────────────────────────────

export type RespondFn = (
  ok: boolean,
  payload?: unknown,
  error?: { code: string; message: string },
) => void;

export interface GatewayContext {
  broadcast?: (event: string, data: unknown, opts?: { dropIfSlow?: boolean }) => void;
  sessionKey?: string;
  agentId?: string;
}

export type StandaloneRequestHandler = (opts: {
  params: Record<string, unknown>;
  respond: RespondFn;
  context: GatewayContext;
}) => void | Promise<void>;

// ── Tool Types ──────────────────────────────────────────────────

export interface AgentToolResult {
  type: "text";
  text: string;
}

export interface StandaloneAgentTool {
  name: string;
  label?: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (
    toolCallId: string,
    params: Record<string, unknown>,
  ) => Promise<AgentToolResult>;
  ownerOnly?: boolean;
}

export interface ToolContext {
  sessionKey?: string;
  agentId?: string;
}

// ── Host Capabilities ───────────────────────────────────────────

export interface HostCapabilities {
  /** Host manages conversational memory (Hermes: MEMORY.md + USER.md) */
  memory: boolean;
  /** Host manages personality/identity (Hermes: SOUL.md) */
  personality: boolean;
  /** Host manages skills (Hermes: 94 bundled skills) */
  skills: boolean;
  /** Host manages context compression */
  compression: boolean;
  /** Host manages tool execution (Hermes: 40+ built-in tools) */
  toolExecution: boolean;
}

// ── HostAdapter Interface ───────────────────────────────────────

export interface HostAdapter {
  readonly runtime: "openclaw" | "hermes";

  /** What the host already handles — GodMode skips these layers. */
  readonly capabilities: HostCapabilities;

  // ── Registration ────────────────────────────────────────────

  /** Register an RPC method handler (120+ GodMode methods). */
  registerMethod(name: string, handler: StandaloneRequestHandler): void;

  /** Register an LLM tool (15 GodMode tools — queue, tasks, delegate, etc.). */
  registerTool(factory: (ctx: ToolContext) => StandaloneAgentTool): void;

  /** Serve static files at a URL path (GodMode UI). */
  serveStaticFiles(root: string, basePath: string): void;

  // ── Communication ───────────────────────────────────────────

  /** Broadcast an event to all connected UI clients. */
  broadcast(event: string, data: unknown): void;

  /** Logger instance. */
  readonly logger: AdapterLogger;

  // ── Hooks ──────────────────────────────────────────────────

  /** Called before each chat message is sent to the host LLM.
   *  Returns context to inject, or null to skip. */
  onBeforeChat?(handler: (sessionKey: string, userMessage: string) => Promise<string | null>): void;

  /** Called after the host LLM responds — for memory ingest, identity graph, etc. */
  onAfterChat?(handler: (sessionKey: string, userMsg: string, assistantMsg: string) => Promise<void>): void;

  /** Called when a new user message arrives — for action item extraction, session tracking. */
  onMessageReceived?(handler: (sessionKey: string, message: string) => Promise<void>): void;

  // ── Lifecycle ───────────────────────────────────────────────

  /** Start the adapter (bind ports, connect to host, etc.). */
  start(opts: {
    pluginRoot: string;
    pluginVersion: string;
  }): Promise<void>;

  /** Stop the adapter gracefully. */
  stop(): Promise<void>;
}
