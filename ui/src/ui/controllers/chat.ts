import { extractText } from "../chat/message-extract";
import type { GatewayBrowserClient } from "../gateway";
import { resetStreamingCache } from "../markdown-streaming";
import type { ChatAttachment } from "../ui-types";
import { generateUUID } from "../uuid";

// Module-level storage for pending message (for retry on context overflow)
let pendingSendMessage: { message: string; attachments?: ChatAttachment[] } | null = null;

/** Pending image cache promise — image resolution should wait for this before resolving. */
let _pendingImageCache: Promise<unknown> | null = null;

/** Returns the pending image cache promise (if any), so resolve can wait for it. */
export function getPendingImageCache(): Promise<unknown> | null {
  return _pendingImageCache;
}

/** Turn count cache: session key → number of user messages. */
export const sessionTurnCounts = new Map<string, number>();

/** Cached message histories for parallel lane sessions. */
export const laneMessageCache = new Map<string, unknown[]>();

function cacheTurnCount(sessionKey: string, messages: unknown[]): void {
  const turns = messages.filter(
    (m) => (m as Record<string, unknown>)?.role === "user",
  ).length;
  sessionTurnCounts.set(sessionKey, turns);
}

/** Load chat history for a lane session (cached, doesn't affect main chat state). */
export async function loadLaneHistory(
  client: GatewayBrowserClient,
  sessionKey: string,
): Promise<unknown[]> {
  try {
    const res = await client.request("chat.history", {
      sessionKey,
      limit: 200,
    });
    const messages = Array.isArray(res.messages) ? res.messages : [];
    laneMessageCache.set(sessionKey, messages);
    cacheTurnCount(sessionKey, messages);
    return messages;
  } catch {
    return laneMessageCache.get(sessionKey) ?? [];
  }
}

// Generation counter for loadChatHistory staleness detection.
// Incremented on every call; responses are only applied if the generation
// at response-time matches the generation at call-time.
let _chatLoadGeneration = 0;

/**
 * Represents a message that failed to send (e.g., due to context overflow).
 * Used for retry functionality.
 */
export type FailedMessage = {
  message: string;
  attachments?: ChatAttachment[];
  timestamp: number;
};

export type ChatState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  sessionKey: string;
  chatLoading: boolean;
  chatMessages: unknown[];
  chatThinkingLevel: string | null;
  chatSending: boolean;
  chatSendingSessionKey: string | null; // Track which session initiated the send
  chatMessage: string;
  chatAttachments: ChatAttachment[];
  chatRunId: string | null;
  chatStream: string | null;
  chatStreamStartedAt: number | null;
  lastError: string | null;
  /** Message pending retry after context overflow */
  pendingRetry?: FailedMessage | null;
};

export type ChatEventPayload = {
  runId: string;
  sessionKey: string;
  state: "delta" | "final" | "aborted" | "error";
  message?: unknown;
  errorMessage?: string;
};

export async function loadChatHistory(state: ChatState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }

  const targetSessionKey = state.sessionKey;
  const generation = ++_chatLoadGeneration;

  state.chatLoading = true;
  state.lastError = null;

  try {
    const res = await state.client.request("chat.history", {
      sessionKey: targetSessionKey,
      limit: 200,
    });

    // Discard stale response if a newer load was initiated or session changed
    if (generation !== _chatLoadGeneration) {
      return;
    }
    if (state.sessionKey !== targetSessionKey) {
      return;
    }

    state.chatMessages = Array.isArray(res.messages) ? res.messages : [];
    state.chatThinkingLevel = res.thinkingLevel ?? null;
    cacheTurnCount(targetSessionKey, state.chatMessages);
    laneMessageCache.set(targetSessionKey, state.chatMessages);
  } catch {
    if (generation !== _chatLoadGeneration) {
      return;
    }
    if (state.sessionKey !== targetSessionKey) {
      return;
    }

    // Retry once for transient errors (e.g. network blip during reconnect)
    try {
      const retryRes = await state.client.request("chat.history", {
        sessionKey: targetSessionKey,
        limit: 200,
      });

      if (generation !== _chatLoadGeneration) {
        return;
      }
      if (state.sessionKey !== targetSessionKey) {
        return;
      }

      state.chatMessages = Array.isArray(retryRes.messages) ? retryRes.messages : [];
      state.chatThinkingLevel = retryRes.thinkingLevel ?? null;
      cacheTurnCount(targetSessionKey, state.chatMessages);
      laneMessageCache.set(targetSessionKey, state.chatMessages);
    } catch (retryErr) {
      if (generation !== _chatLoadGeneration) {
        return;
      }
      if (state.sessionKey !== targetSessionKey) {
        return;
      }
      state.lastError = String(retryErr);
    }
  } finally {
    if (generation === _chatLoadGeneration) {
      state.chatLoading = false;
    }
  }
}

/**
 * Load chat history after a "final" stream event, with floor preservation.
 *
 * When the gateway exits before flushing the session JSONL, the server
 * returns empty/partial history. This wrapper preserves the locally-held
 * messages (including the temporary assistant message from the stream) if
 * the server response would erase them, then retries once after a short
 * delay in case the file was still being flushed.
 */
export async function loadChatHistoryAfterFinal(
  state: ChatState,
  opts?: { allowShrink?: boolean },
): Promise<void> {
  const snapshot = [...state.chatMessages];
  const snapshotLen = snapshot.length;

  await loadChatHistory(state);

  if (
    !opts?.allowShrink &&
    snapshotLen > 0 &&
    state.chatMessages.length < snapshotLen
  ) {
    state.chatMessages = snapshot;
    // Retry once after a short delay — the file may still be flushing
    setTimeout(() => {
      void loadChatHistory(state);
    }, 2000);
  }
}

function dataUrlToBase64(dataUrl: string): { content: string; mimeType: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    return null;
  }
  return { mimeType: match[1], content: match[2] };
}

export async function sendChatMessage(
  state: ChatState,
  message: string,
  attachments?: ChatAttachment[],
  opts?: { skipOptimisticUpdate?: boolean },
): Promise<boolean> {
  if (!state.client || !state.connected) {
    return false;
  }
  let msg = message.trim();
  const hasAttachments = attachments && attachments.length > 0;
  if (!msg && !hasAttachments) {
    return false;
  }

  // When sending attachments without text, provide a default prompt so the
  // gateway's empty-body guard doesn't short-circuit the agent run.
  if (!msg && hasAttachments) {
    const hasImages = attachments.some((a) => a.mimeType.startsWith("image/"));
    msg = hasImages ? "What's in this image?" : "See attached file.";
  }

  const now = Date.now();

  // Add optimistic user message (unless already added by queue)
  if (!opts?.skipOptimisticUpdate) {
    // Build user message content blocks
    const contentBlocks: Array<{ type: string; text?: string; source?: unknown }> = [];
    if (msg) {
      contentBlocks.push({ type: "text", text: msg });
    }
    // Add attachment previews to the message for display
    if (hasAttachments) {
      for (const att of attachments) {
        const isImage = att.mimeType.startsWith("image/");
        if (isImage) {
          contentBlocks.push({
            type: "image",
            source: { type: "base64", media_type: att.mimeType, data: att.dataUrl },
          });
        } else {
          // For non-image files, add as attachment block
          contentBlocks.push({
            type: "attachment",
            mimeType: att.mimeType,
            fileName: att.fileName,
            content: att.dataUrl,
          });
        }
      }
    }

    state.chatMessages = [
      ...state.chatMessages,
      {
        role: "user",
        content: contentBlocks,
        timestamp: now,
      },
    ];
  }

  state.chatSending = true;
  state.chatSendingSessionKey = state.sessionKey; // Track which session is sending
  state.lastError = null;
  const runId = generateUUID();
  state.chatRunId = runId;
  state.chatStream = "";
  state.chatStreamStartedAt = now;

  // Save message for potential retry on context overflow
  pendingSendMessage = { message: msg, attachments: hasAttachments ? attachments : undefined };

  // Convert attachments to API format.
  // The gateway only supports image attachments — non-image files (PDFs, etc.)
  // are dropped by the gateway's parseMessageWithAttachments(). To work around
  // this, we inline non-image file content into the message text as base64.
  let imageAttachments: Array<{
    type: string;
    mimeType: string;
    content: string;
    fileName?: string;
  }> | undefined;
  if (hasAttachments) {
    const images: typeof imageAttachments = [];
    const fileParts: string[] = [];
    for (const att of attachments) {
      const parsed = dataUrlToBase64(att.dataUrl);
      if (!parsed) continue;
      if (parsed.mimeType.startsWith("image/")) {
        images.push({
          type: "image",
          mimeType: parsed.mimeType,
          content: parsed.content,
          fileName: att.fileName,
        });
      } else {
        // Inline non-image files as base64 document blocks in the message
        const label = att.fileName || "file";
        fileParts.push(
          `<document>\n<source>${label}</source>\n<mime_type>${parsed.mimeType}</mime_type>\n<content encoding="base64">\n${parsed.content}\n</content>\n</document>`,
        );
      }
    }
    if (images.length > 0) imageAttachments = images;
    if (fileParts.length > 0) {
      msg = `${fileParts.join("\n\n")}\n\n${msg}`;
    }

    // Cache images server-side before gateway strips them.
    // Capture msgIdx NOW (before any async work) so the index is correct
    // even if loadChatHistory replaces chatMessages before the callback runs.
    if (images.length > 0) {
      const cachedMsgIdx = state.chatMessages.length - 1;
      const cachedSessionKey = state.sessionKey;
      const cachePromise = state.client
        .request("images.cache", {
          images: images.map((img) => ({
            data: img.content,
            mimeType: img.mimeType,
            fileName: img.fileName,
          })),
          sessionKey: cachedSessionKey,
        })
        .then((result: { cached?: Array<{ hash: string; mimeType: string; bytes: number }> }) => {
          if (result?.cached && result.cached.length > 0) {
            const entries = result.cached.map(
              (c: { hash: string; mimeType: string; bytes: number }, i: number) => ({
                messageIndex: cachedMsgIdx,
                imageIndex: i,
                hash: c.hash,
                mimeType: c.mimeType,
                bytes: c.bytes,
                role: "user",
                timestamp: now,
              }),
            );
            return state.client!
              .request("images.updateIndex", {
                sessionKey: cachedSessionKey,
                images: entries,
              })
              .catch(() => {});
          }
        })
        .catch(() => {}); // Non-blocking best-effort
      // Track pending cache so image resolution can wait for it
      _pendingImageCache = cachePromise;
      cachePromise.finally(() => {
        if (_pendingImageCache === cachePromise) _pendingImageCache = null;
      });
    }
  }

  try {
    await state.client.request("chat.send", {
      sessionKey: state.sessionKey,
      message: msg,
      deliver: false,
      idempotencyKey: runId,
      attachments: imageAttachments,
      // privateMode is handled client-side only — do NOT send to gateway
    });
    return true;
  } catch (err) {
    const error = String(err);
    state.chatRunId = null;
    state.chatStream = null;
    state.chatStreamStartedAt = null;
    state.lastError = error;
    state.chatMessages = [
      ...state.chatMessages,
      {
        role: "assistant",
        content: [{ type: "text", text: "Error: " + error }],
        timestamp: Date.now(),
      },
    ];
    return false;
  } finally {
    state.chatSending = false;
    state.chatSendingSessionKey = null;
  }
}

/**
 * Retry a message that failed due to context overflow.
 * Call this after compacting the conversation.
 */
export async function retryPendingMessage(state: ChatState): Promise<boolean> {
  const pending = state.pendingRetry;
  if (!pending) {
    return false;
  }

  // Clear the pending retry before sending
  state.pendingRetry = null;

  // The user message is already in the chat from the original send attempt
  // Just resend without adding another optimistic message
  return sendChatMessage(state, pending.message, pending.attachments, {
    skipOptimisticUpdate: true,
  });
}

/**
 * Clear pending retry without sending
 */
export function clearPendingRetry(state: ChatState): void {
  state.pendingRetry = null;
}

export async function abortChatRun(state: ChatState): Promise<boolean> {
  if (!state.client || !state.connected) {
    return false;
  }
  const runId = state.chatRunId;
  try {
    await state.client.request(
      "chat.abort",
      runId ? { sessionKey: state.sessionKey, runId } : { sessionKey: state.sessionKey },
    );
    return true;
  } catch (err) {
    state.lastError = String(err);
    return false;
  }
}

export function handleChatEvent(state: ChatState, payload?: ChatEventPayload) {
  if (!payload) {
    return null;
  }
  if (payload.sessionKey !== state.sessionKey) {
    return null;
  }

  // Final from another run (e.g. sub-agent announce): refresh history to show new message.
  // See https://github.com/openclaw/openclaw/issues/1909
  if (payload.runId && state.chatRunId && payload.runId !== state.chatRunId) {
    if (payload.state === "final") {
      return "final";
    }
    return null;
  }

  // Reset streaming markdown cache when stream ends (final/aborted/error)
  if (payload.state !== "delta") {
    resetStreamingCache();
  }

  if (payload.state === "delta") {
    const next = extractText(payload.message);
    if (typeof next === "string") {
      const current = state.chatStream ?? "";
      if (!current || next.length >= current.length) {
        state.chatStream = next;
      }
    }
  } else if (payload.state === "final") {
    // Preserve stream content as a temporary assistant message.
    // Without this, the response vanishes between chatStream=null
    // and loadChatHistory() completing (async HTTP fetch).
    if (state.chatStream && state.chatStream.trim()) {
      state.chatMessages = [
        ...state.chatMessages,
        {
          role: "assistant",
          content: [{ type: "text", text: state.chatStream }],
          timestamp: Date.now(),
        },
      ];
    }
    state.chatStream = null;
    state.chatRunId = null;
    state.chatStreamStartedAt = null;
    pendingSendMessage = null; // Clear on successful completion
  } else if (payload.state === "aborted") {
    state.chatStream = null;
    state.chatRunId = null;
    state.chatStreamStartedAt = null;
    pendingSendMessage = null; // Clear on abort
  } else if (payload.state === "error") {
    state.chatStream = null;
    state.chatRunId = null;
    state.chatStreamStartedAt = null;
    const errorMsg = payload.errorMessage ?? "chat error";
    state.lastError = errorMsg;

    // Check for context overflow and save pending message for retry
    const isOverflow = errorMsg.includes("prompt is too long") || errorMsg.includes("tokens >");
    if (isOverflow && pendingSendMessage) {
      state.pendingRetry = {
        message: pendingSendMessage.message,
        attachments: pendingSendMessage.attachments,
        timestamp: Date.now(),
      };
    }
    pendingSendMessage = null;

    // Add error message to chat thread so it persists visibly
    // Parse context overflow errors for friendly message
    let friendlyError = errorMsg;
    if (isOverflow) {
      const match = errorMsg.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);
      if (match) {
        const used = parseInt(match[1]).toLocaleString();
        const max = parseInt(match[2]).toLocaleString();
        friendlyError = `⚠️ Context overflow: ${used} tokens exceeds ${max} limit. Compact the conversation, then click "Retry" to resend your message.`;
      } else {
        friendlyError =
          '⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.';
      }
    }

    state.chatMessages = [
      ...state.chatMessages,
      {
        role: "assistant",
        content: [{ type: "text", text: friendlyError }],
        timestamp: Date.now(),
        isError: true,
      },
    ];
  }
  return payload.state;
}
