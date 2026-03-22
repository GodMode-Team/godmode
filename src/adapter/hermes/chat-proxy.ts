/**
 * hermes/chat-proxy.ts — Proxies chat messages to Hermes Agent HTTP API.
 *
 * Sends user messages to Hermes at /v1/chat/completions with:
 *   - Workspace context as a system message (tasks, queue, schedule)
 *   - Conversation history (multi-turn)
 *   - SSE streaming back to the caller
 *
 * Hermes runs the full agent loop (tools, memory, skills) on its side.
 * GodMode only injects workspace state that Hermes doesn't have.
 */

import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { DATA_DIR } from "../../data-paths.js";
import type { AdapterLogger } from "../types.js";

// ── Types ────────────────────────────────────────────────────────

/** A content block in an OpenAI-compatible multimodal message. */
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | ContentBlock[];
}

/** Image attachment from the GodMode UI. */
export interface ChatImageAttachment {
  type: "image";
  mimeType: string;
  content: string; // base64 data (no data: prefix)
  fileName?: string;
}

export interface ChatProxyOptions {
  hermesUrl: string;
  hermesApiKey?: string;
  logger: AdapterLogger;
  /** Called with workspace context to inject as system message. */
  getWorkspaceContext?: () => Promise<string | null>;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

// ── Session Store ────────────────────────────────────────────────

const SESSIONS_DIR = join(DATA_DIR, "hermes-sessions");

interface SessionHistory {
  id: string;
  createdAt: number;
  messages: ChatMessage[];
  /** Cumulative input tokens (from Hermes API usage responses). */
  inputTokens?: number;
  /** Cumulative output tokens (from Hermes API usage responses). */
  outputTokens?: number;
  /** Last turn's prompt_tokens — actual current context window size. */
  lastInputTokens?: number;
}

async function ensureSessionsDir(): Promise<void> {
  if (!existsSync(SESSIONS_DIR)) {
    await mkdir(SESSIONS_DIR, { recursive: true });
  }
}

function sanitizeSessionId(id: string): string {
  // Strip path separators and dots to prevent traversal
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function loadSession(sessionId: string): Promise<SessionHistory> {
  const safeId = sanitizeSessionId(sessionId);
  const filePath = join(SESSIONS_DIR, `${safeId}.json`);
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { id: sessionId, createdAt: Date.now(), messages: [] };
  }
}

async function saveSession(session: SessionHistory): Promise<void> {
  await ensureSessionsDir();
  const safeId = sanitizeSessionId(session.id);
  const filePath = join(SESSIONS_DIR, `${safeId}.json`);
  await writeFile(filePath, JSON.stringify(session, null, 2));
}

// ── Chat Proxy ───────────────────────────────────────────────────

export class HermesChatProxy {
  private hermesUrl: string;
  private hermesApiKey?: string;
  private logger: AdapterLogger;
  private getWorkspaceContext: () => Promise<string | null>;

  constructor(opts: ChatProxyOptions) {
    this.hermesUrl = opts.hermesUrl.replace(/\/$/, "");
    this.hermesApiKey = opts.hermesApiKey;
    this.logger = opts.logger;
    this.getWorkspaceContext = opts.getWorkspaceContext ?? (async () => null);
  }

  /**
   * Set workspace context to inject into the next chat message.
   * Called by the adapter's beforeChat hook with assembled workspace state.
   */
  setWorkspaceContext(context: string): void {
    this.getWorkspaceContext = async () => context;
  }

  /** Check if Hermes API is reachable. */
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.hermesUrl}/health`, { signal: AbortSignal.timeout(5000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Send a user message and stream the response.
   * Returns the full response text when streaming completes.
   */
  async sendMessage(
    sessionId: string,
    userMessage: string,
    callbacks: StreamCallbacks,
    attachments?: ChatImageAttachment[],
  ): Promise<void> {
    const session = await loadSession(sessionId);

    // Build message array: workspace context + history + new user message
    const messages: ChatMessage[] = [];

    // 1. Inject workspace context as system message
    const wsContext = await this.getWorkspaceContext();
    if (wsContext) {
      messages.push({ role: "system", content: wsContext });
    }

    // 2. Include conversation history (trim to last 50 messages for context window)
    const historySlice = session.messages.slice(-50);
    messages.push(...historySlice);

    // 3. Add the new user message — with image attachments as content blocks
    const hasImages = attachments && attachments.length > 0;
    if (hasImages) {
      const contentBlocks: ContentBlock[] = [];
      // Add text first
      if (userMessage) {
        contentBlocks.push({ type: "text", text: userMessage });
      }
      // Add each image as an image_url block with data URI
      for (const att of attachments) {
        const dataUrl = att.content.startsWith("data:")
          ? att.content
          : `data:${att.mimeType};base64,${att.content}`;
        contentBlocks.push({ type: "image_url", image_url: { url: dataUrl } });
      }
      messages.push({ role: "user", content: contentBlocks });
    } else {
      messages.push({ role: "user", content: userMessage });
    }

    // Save user message to session (text-only for history serialization)
    const historyLabel = hasImages
      ? `${userMessage}\n\n[${attachments.length} image(s) attached]`
      : userMessage;
    session.messages.push({ role: "user", content: historyLabel });

    // 4. Call Hermes API with streaming
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.hermesApiKey) {
      headers["Authorization"] = `Bearer ${this.hermesApiKey}`;
    }

    let fullResponse = "";
    let lastUsage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null = null;

    // Abort controller with 2-minute timeout to prevent zombie streams (BUG-007).
    // If Hermes hangs or becomes unreachable, the fetch aborts cleanly.
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch(`${this.hermesUrl}/v1/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "hermes-agent",
          messages,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Hermes API error ${res.status}: ${body}`);
      }

      if (!res.body) {
        throw new Error("Hermes API returned no body");
      }

      // Parse SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      // Track tool call boundaries to insert paragraph breaks
      let sawToolCall = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep incomplete line in buffer

        for (const line of lines) {
          // Handle both "data: " and "data:" (some APIs omit the space)
          const trimmedLine = line.replace(/\r$/, "");
          if (!trimmedLine.startsWith("data:")) continue;
          const data = trimmedLine.startsWith("data: ")
            ? trimmedLine.slice(6).trim()
            : trimmedLine.slice(5).trim();

          if (data === "[DONE]") {
            // Stream complete — save response and token usage
            clearTimeout(abortTimeout);
            session.messages.push({ role: "assistant", content: fullResponse });
            if (lastUsage) {
              session.inputTokens = (session.inputTokens ?? 0) + (lastUsage.prompt_tokens ?? 0);
              session.outputTokens = (session.outputTokens ?? 0) + (lastUsage.completion_tokens ?? 0);
              // Track the last turn's prompt tokens — this is the actual current
              // context window size, not the cumulative sum across all turns.
              session.lastInputTokens = lastUsage.prompt_tokens ?? 0;
            }
            await saveSession(session);
            callbacks.onDone(fullResponse);
            return;
          }

          try {
            const chunk = JSON.parse(data);
            // Capture usage from the final chunk (Hermes sends it with finish_reason)
            if (chunk.usage) {
              lastUsage = chunk.usage;
            }
            const choice = chunk.choices?.[0];

            // Detect tool execution boundaries — Hermes sends tool_calls
            // deltas between text sections. When text resumes after a tool
            // call, inject a paragraph break so sentences don't run together.
            if (choice?.delta?.tool_calls || choice?.finish_reason === "tool_calls") {
              sawToolCall = true;
              continue;
            }

            const delta = choice?.delta?.content;
            if (delta) {
              // After a tool call boundary, insert a paragraph break so
              // text from different tool-call sections doesn't run together.
              // NOTE: We no longer insert breaks based on sentence punctuation
              // heuristics — the model produces its own paragraph breaks and
              // the heuristic caused spurious whitespace depending on chunk
              // boundaries (BUG-002).
              let separator = "";
              if (sawToolCall && fullResponse.length > 0) {
                separator = "\n\n";
                sawToolCall = false;
              }
              fullResponse += separator + delta;
              callbacks.onToken(separator + delta);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // Flush any remaining data in the buffer after the stream reader is done.
      // A chunk boundary may have split a "data: [DONE]" or final JSON chunk.
      if (buffer.trim()) {
        const trimmedLine = buffer.replace(/\r$/, "");
        if (trimmedLine.startsWith("data:")) {
          const data = trimmedLine.startsWith("data: ")
            ? trimmedLine.slice(6).trim()
            : trimmedLine.slice(5).trim();
          if (data === "[DONE]") {
            clearTimeout(abortTimeout);
            session.messages.push({ role: "assistant", content: fullResponse });
            if (lastUsage) {
              session.inputTokens = (session.inputTokens ?? 0) + (lastUsage.prompt_tokens ?? 0);
              session.outputTokens = (session.outputTokens ?? 0) + (lastUsage.completion_tokens ?? 0);
              session.lastInputTokens = lastUsage.prompt_tokens ?? 0;
            }
            await saveSession(session);
            callbacks.onDone(fullResponse);
            return;
          }
          try {
            const chunk = JSON.parse(data);
            if (chunk.usage) lastUsage = chunk.usage;
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              callbacks.onToken(delta);
            }
          } catch {
            // Skip malformed trailing chunk
          }
        }
      }

      // Stream ended without [DONE] — still save what we got
      if (fullResponse) {
        session.messages.push({ role: "assistant", content: fullResponse });
        await saveSession(session);
        callbacks.onDone(fullResponse);
      }
    } catch (err) {
      clearTimeout(abortTimeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        this.logger.error("[Hermes Chat] Request timed out after 120s");
        callbacks.onError(new Error("Request timed out — Hermes may be unreachable"));
      } else {
        this.logger.error(`[Hermes Chat] Error: ${err}`);
        callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      }
      return;
    }
    clearTimeout(abortTimeout);
  }

  /**
   * Send a message without streaming (simpler, for internal use).
   */
  async sendMessageSync(
    sessionId: string,
    userMessage: string,
  ): Promise<string> {
    const session = await loadSession(sessionId);

    const messages: ChatMessage[] = [];
    const wsContext = await this.getWorkspaceContext();
    if (wsContext) {
      messages.push({ role: "system", content: wsContext });
    }
    messages.push(...session.messages.slice(-50));
    messages.push({ role: "user", content: userMessage });

    session.messages.push({ role: "user", content: userMessage });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.hermesApiKey) {
      headers["Authorization"] = `Bearer ${this.hermesApiKey}`;
    }

    const res = await fetch(`${this.hermesUrl}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "hermes-agent",
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Hermes API error ${res.status}: ${await res.text()}`);
    }

    const json = await res.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    session.messages.push({ role: "assistant", content });
    await saveSession(session);

    return content;
  }

  /** Create a new session ID. */
  createSession(): string {
    return randomUUID();
  }

  /** List existing sessions. */
  async listSessions(): Promise<Array<{ id: string; createdAt: number; messageCount: number }>> {
    await ensureSessionsDir();
    const { readdirSync } = await import("node:fs");
    const files = readdirSync(SESSIONS_DIR).filter((f) => f.endsWith(".json"));
    const sessions = [];
    for (const f of files) {
      try {
        const raw = await readFile(join(SESSIONS_DIR, f), "utf-8");
        const s = JSON.parse(raw) as SessionHistory;
        sessions.push({ id: s.id, createdAt: s.createdAt, messageCount: s.messages.length });
      } catch {
        // Skip corrupt files
      }
    }
    return sessions.sort((a, b) => b.createdAt - a.createdAt);
  }

  /** Get chat history for a session, formatted for the UI. */
  async getHistory(sessionId: string): Promise<Array<{ role: string; content: string; timestamp?: number }>> {
    const session = await loadSession(sessionId);
    return session.messages.map((m) => ({
      role: m.role,
      content: typeof m.content === "string" ? m.content : m.content.map((b) => ("text" in b ? b.text : "")).join(""),
    }));
  }
}
