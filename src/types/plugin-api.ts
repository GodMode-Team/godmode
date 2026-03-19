/**
 * plugin-api.ts — Core type definitions for the GodMode plugin system.
 *
 * Provides typed interfaces for the event, context, and API objects passed
 * to lifecycle hooks (before_prompt_build, message_received, message_sending,
 * llm_output, before_tool_call, before_reset, after_tool_call, after_compaction).
 *
 * These replace `any` in hook signatures and event handler parameters.
 */

// ── Message Types ──────────────────────────────────────────────────

export interface MessageContentBlock {
  type: string;
  text?: string;
  [key: string]: unknown;
}

export type MessageContent = string | MessageContentBlock[];

export interface ChatMessage {
  role: string;
  content: MessageContent;
  provenance?: {
    kind?: string;
    sourceSessionKey?: string;
    sourceChannel?: string;
    sourceTool?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ── Hook Event Types ───────────────────────────────────────────────

/** Event object for `before_prompt_build` hooks. */
export interface PromptBuildEvent {
  prompt?: string;
  messages?: unknown[];
  [key: string]: unknown;
}

/** Event object for `message_received` hooks. */
export interface MessageReceivedEvent {
  content?: string;
  [key: string]: unknown;
}

/** Event object for `message_sending` hooks. */
export interface MessageSendingEvent {
  content?: string;
  [key: string]: unknown;
}

/** Event object for `before_tool_call` hooks. */
export interface BeforeToolCallEvent {
  toolName?: string;
  params?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Event object for `llm_output` hooks. */
export interface LlmOutputEvent {
  usage?: unknown;
  assistantTexts?: string[];
  error?: unknown;
  model?: string;
  [key: string]: unknown;
}

/** Event object for `after_tool_call` hooks. */
export interface AfterToolCallEvent {
  toolName?: string;
  params?: Record<string, unknown>;
  error?: unknown;
  [key: string]: unknown;
}

/** Event object for `before_reset` hooks. */
export interface BeforeResetEvent {
  [key: string]: unknown;
}

/** Event object for `after_compaction` hooks. */
export interface AfterCompactionEvent {
  [key: string]: unknown;
}

// ── Hook Context ───────────────────────────────────────────────────

/**
 * The context object passed to lifecycle hooks.
 * Contains session identification fields; `extractSessionKey()` reads from this.
 */
export interface HookContext {
  sessionKey?: string;
  conversationId?: string;
  [key: string]: unknown;
}

// ── Plugin API ─────────────────────────────────────────────────────

/** Logger interface available on the plugin API object. */
export interface PluginLogger {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
}

/**
 * Minimal API shape for contexts that don't have access to the full
 * OpenClawPluginApi (e.g., Hermes standalone, adapter shims, gateway-start).
 *
 * For OpenClaw hook handlers, use `OpenClawPluginApi` from `openclaw/plugin-sdk` directly.
 */
export interface PluginApiShim {
  logger: PluginLogger;
  source: string;
  broadcast?: (event: string, data: unknown) => void;
  pluginConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Calendar Event (used in before-prompt-build) ───────────────────

export interface CalendarEvent {
  startTime: string | number;
  title: string;
  attendees?: string[];
  [key: string]: unknown;
}

// ── Task (used in register-all and before-prompt-build) ────────────

export interface TaskItem {
  status: string;
  title?: string;
  dueDate?: string | null;
  [key: string]: unknown;
}

// ── Queue Item (used in register-all) ──────────────────────────────

export interface QueueItem {
  status: string;
  title?: string;
  type?: string;
  [key: string]: unknown;
}

// ── Resource Registry (used in lifecycle-hooks) ────────────────────

export interface ResourceEntry {
  id: string;
  title: string;
  type: string;
  path: string;
  sessionKey: string;
  createdAt: string;
  pinned: boolean;
}

export interface ResourceRegistry {
  version: number;
  resources: ResourceEntry[];
}

// ── HTTP Handler Types ─────────────────────────────────────────────

import type { IncomingMessage, ServerResponse } from "node:http";

export type StaticFileHandler = (req: IncomingMessage, res: ServerResponse) => void;
