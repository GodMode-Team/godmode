import { parseAgentSessionKey } from "../lib/session-key-utils.js";
import type { GodModeApp } from "./app";
import { scheduleChatScroll } from "./app-scroll";
import { setLastActiveSessionKey } from "./app-settings";
import { resetToolStream } from "./app-tool-stream";
import { abortChatRun, loadChatHistory, sendChatMessage } from "./controllers/chat";
import { loadSessions } from "./controllers/sessions";
import type { GatewayHelloOk } from "./gateway";
import { normalizeBasePath } from "./navigation";
import type { ChatAttachment, ChatQueueItem } from "./ui-types";
import { generateUUID } from "./uuid";

type ChatHost = {
  connected: boolean;
  chatMessage: string;
  chatDrafts: Record<string, string>;
  chatMessages: unknown[];
  chatAttachments: ChatAttachment[];
  chatQueue: ChatQueueItem[];
  chatRunId: string | null;
  chatSending: boolean;
  chatSendingSessionKey: string | null;
  sessionKey: string;
  basePath: string;
  hello: GatewayHelloOk | null;
  chatAvatarUrl: string | null;
  refreshSessionsAfterChat: boolean;
};

export function isChatBusy(host: ChatHost) {
  return host.chatSending || Boolean(host.chatRunId);
}

export function saveDraft(host: ChatHost, sessionKey?: string) {
  const key = sessionKey ?? host.sessionKey;
  const draft = host.chatMessage.trim();
  if (draft) {
    host.chatDrafts = { ...host.chatDrafts, [key]: draft };
  } else {
    const { [key]: _, ...rest } = host.chatDrafts;
    host.chatDrafts = rest;
  }
}

export function restoreDraft(host: ChatHost, sessionKey?: string) {
  const key = sessionKey ?? host.sessionKey;
  host.chatMessage = host.chatDrafts[key] ?? "";
}

export function clearDraft(host: ChatHost, sessionKey?: string) {
  const key = sessionKey ?? host.sessionKey;
  const { [key]: _, ...rest } = host.chatDrafts;
  host.chatDrafts = rest;
  if (key === host.sessionKey) {
    host.chatMessage = "";
  }
}

export function isChatStopCommand(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === "/stop") {
    return true;
  }
  return (
    normalized === "stop" ||
    normalized === "esc" ||
    normalized === "abort" ||
    normalized === "wait" ||
    normalized === "exit"
  );
}

function isChatResetCommand(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === "/new" || normalized === "/reset") {
    return true;
  }
  return normalized.startsWith("/new ") || normalized.startsWith("/reset ");
}

export async function handleAbortChat(host: ChatHost) {
  if (!host.connected) {
    return;
  }
  host.chatMessage = "";
  await abortChatRun(host as unknown as GodModeApp);
}

function enqueueChatMessage(host: ChatHost, text: string, attachments?: ChatAttachment[]) {
  const trimmed = text.trim();
  const hasAttachments = Boolean(attachments && attachments.length > 0);
  if (!trimmed && !hasAttachments) {
    return;
  }

  const now = Date.now();

  // Add to queue for processing later
  host.chatQueue = [
    ...host.chatQueue,
    {
      id: generateUUID(),
      text: trimmed,
      createdAt: now,
      attachments: hasAttachments ? attachments?.map((att) => ({ ...att })) : undefined,
    },
  ];

  // Also show as optimistic message in chat (so user sees their message immediately)
  const contentBlocks: Array<{ type: string; text?: string; source?: unknown }> = [];
  if (trimmed) {
    contentBlocks.push({ type: "text", text: trimmed });
  }
  if (hasAttachments && attachments) {
    for (const att of attachments) {
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: att.mimeType, data: att.dataUrl },
      });
    }
  }

  host.chatMessages = [
    ...host.chatMessages,
    {
      role: "user",
      content: contentBlocks,
      timestamp: now,
    },
  ];

  // Scroll to show the new message
  scheduleChatScroll(host as unknown as Parameters<typeof scheduleChatScroll>[0], true);
}

async function sendChatMessageNow(
  host: ChatHost,
  message: string,
  opts?: {
    previousDraft?: string;
    restoreDraft?: boolean;
    attachments?: ChatAttachment[];
    previousAttachments?: ChatAttachment[];
    restoreAttachments?: boolean;
    skipOptimisticUpdate?: boolean;
    refreshSessions?: boolean;
  },
) {
  resetToolStream(host as unknown as Parameters<typeof resetToolStream>[0]);

  // Optimistic working indicator - show immediately when user sends message
  const appHost = host as unknown as { sessionKey?: string; workingSessions?: Set<string> };
  if (appHost.sessionKey && appHost.workingSessions) {
    appHost.workingSessions = new Set([...appHost.workingSessions, appHost.sessionKey]);
  }

  // Scroll immediately when user sends a message (optimistic update adds message first)
  if (!opts?.skipOptimisticUpdate) {
    // Schedule scroll before awaiting - the optimistic message will be added by sendChatMessage
    // We use a microtask to ensure it runs after the sync part of sendChatMessage adds the message
    queueMicrotask(() => {
      scheduleChatScroll(host as unknown as Parameters<typeof scheduleChatScroll>[0], true);
    });
  }

  const ok = await sendChatMessage(host as unknown as GodModeApp, message, opts?.attachments, {
    skipOptimisticUpdate: opts?.skipOptimisticUpdate,
  });
  if (!ok && opts?.previousDraft != null) {
    host.chatMessage = opts.previousDraft;
  }
  if (!ok && opts?.previousAttachments) {
    host.chatAttachments = opts.previousAttachments;
  }
  if (ok) {
    setLastActiveSessionKey(
      host as unknown as Parameters<typeof setLastActiveSessionKey>[0],
      host.sessionKey,
    );
    // Clear attachments now that the message has been sent successfully
    // This keeps them visible during the send for better UX feedback
    host.chatAttachments = [];
  }
  if (ok && opts?.restoreDraft && opts.previousDraft?.trim()) {
    host.chatMessage = opts.previousDraft;
  }
  if (ok && opts?.restoreAttachments && opts.previousAttachments?.length) {
    host.chatAttachments = opts.previousAttachments;
  }
  // Also scroll after the response comes in to catch any new content
  scheduleChatScroll(host as unknown as Parameters<typeof scheduleChatScroll>[0], true);
  if (ok && !host.chatRunId) {
    void flushChatQueue(host);
  }
  if (ok && opts?.refreshSessions) {
    host.refreshSessionsAfterChat = true;
  }
  return ok;
}

async function flushChatQueue(host: ChatHost) {
  if (!host.connected || isChatBusy(host)) {
    return;
  }
  const [next, ...rest] = host.chatQueue;
  if (!next) {
    return;
  }
  host.chatQueue = rest;
  // Skip optimistic update - message was already shown when enqueued
  const ok = await sendChatMessageNow(host, next.text, {
    attachments: next.attachments,
    skipOptimisticUpdate: true,
  });
  if (!ok) {
    host.chatQueue = [next, ...host.chatQueue];
  }
}

export function removeQueuedMessage(host: ChatHost, id: string) {
  host.chatQueue = host.chatQueue.filter((item) => item.id !== id);
}

export async function handleSendChat(
  host: ChatHost,
  messageOverride?: string,
  opts?: { restoreDraft?: boolean; queue?: boolean },
) {
  if (!host.connected) {
    return;
  }
  const previousDraft = host.chatMessage;
  const message = (messageOverride ?? host.chatMessage).trim();
  const attachments = host.chatAttachments ?? [];
  const attachmentsToSend = messageOverride == null ? attachments : [];
  const hasAttachments = attachmentsToSend.length > 0;

  // Allow sending with just attachments (no message text required)
  if (!message && !hasAttachments) {
    return;
  }

  if (isChatStopCommand(message)) {
    await handleAbortChat(host);
    return;
  }

  const refreshSessions = isChatResetCommand(message);
  if (messageOverride == null) {
    host.chatMessage = "";
    // Clear draft for this session after sending
    clearDraft(host);
    // NOTE: Don't clear attachments here - they stay visible until send succeeds
    // This provides visual feedback that files are being sent
  }

  // Queue mode: explicitly requested via cmd+enter or Queue button
  if (opts?.queue) {
    enqueueChatMessage(host, message, attachmentsToSend);
    // If not busy, immediately flush the queue
    if (!isChatBusy(host)) {
      await flushChatQueue(host);
    }
    return;
  }

  // Send mode: if busy, interrupt current run and send new message immediately
  if (isChatBusy(host)) {
    // Abort the current run (partial response preserved in chat history)
    await abortChatRun(host as unknown as GodModeApp);
    // Small delay to let abort propagate through gateway
    await new Promise((r) => setTimeout(r, 50));
    // Now send the new message
    await sendChatMessageNow(host, message, {
      attachments: hasAttachments ? attachmentsToSend : undefined,
      refreshSessions,
    });
    return;
  }

  // Not busy: send immediately
  await sendChatMessageNow(host, message, {
    previousDraft: messageOverride == null ? previousDraft : undefined,
    restoreDraft: Boolean(messageOverride && opts?.restoreDraft),
    attachments: hasAttachments ? attachmentsToSend : undefined,
    previousAttachments: messageOverride == null ? attachments : undefined,
    restoreAttachments: Boolean(messageOverride && opts?.restoreDraft),
    refreshSessions,
  });
}

export async function refreshChat(host: ChatHost) {
  await Promise.all([
    loadChatHistory(host as unknown as GodModeApp),
    loadSessions(host as unknown as GodModeApp, { activeMinutes: 0 }),
    refreshChatAvatar(host),
  ]);
  scheduleChatScroll(host as unknown as Parameters<typeof scheduleChatScroll>[0], true);
}

export const flushChatQueueForEvent = flushChatQueue;

type SessionDefaultsSnapshot = {
  defaultAgentId?: string;
};

function resolveAgentIdForSession(host: ChatHost): string | null {
  const parsed = parseAgentSessionKey(host.sessionKey);
  if (parsed?.agentId) {
    return parsed.agentId;
  }
  const snapshot = host.hello?.snapshot as
    | { sessionDefaults?: SessionDefaultsSnapshot }
    | undefined;
  const fallback = snapshot?.sessionDefaults?.defaultAgentId?.trim();
  return fallback || "main";
}

function buildAvatarMetaUrl(basePath: string, agentId: string): string {
  const base = normalizeBasePath(basePath);
  const encoded = encodeURIComponent(agentId);
  return base ? `${base}/avatar/${encoded}?meta=1` : `/avatar/${encoded}?meta=1`;
}

export async function refreshChatAvatar(host: ChatHost) {
  if (!host.connected) {
    host.chatAvatarUrl = null;
    return;
  }
  const agentId = resolveAgentIdForSession(host);
  if (!agentId) {
    host.chatAvatarUrl = null;
    return;
  }
  host.chatAvatarUrl = null;
  const url = buildAvatarMetaUrl(host.basePath, agentId);
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      host.chatAvatarUrl = null;
      return;
    }
    const data = (await res.json()) as { avatarUrl?: unknown };
    const avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl.trim() : "";
    host.chatAvatarUrl = avatarUrl || null;
  } catch {
    host.chatAvatarUrl = null;
  }
}
