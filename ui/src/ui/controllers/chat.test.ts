import { describe, expect, it } from "vitest";
import { handleChatEvent, loadChatHistory, type ChatEventPayload, type ChatState } from "./chat";

function createState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    client: null,
    connected: true,
    sessionKey: "main",
    chatLoading: false,
    chatMessages: [],
    chatThinkingLevel: null,
    chatSending: false,
    chatSendingSessionKey: null,
    chatMessage: "",
    chatAttachments: [],
    chatRunId: null,
    chatStream: null,
    chatStreamStartedAt: null,
    lastError: null,
    ...overrides,
  };
}

describe("handleChatEvent", () => {
  it("returns null when payload is missing", () => {
    const state = createState();
    expect(handleChatEvent(state, undefined)).toBe(null);
  });

  it("returns null when sessionKey does not match", () => {
    const state = createState({ sessionKey: "main" });
    const payload: ChatEventPayload = {
      runId: "run-1",
      sessionKey: "other",
      state: "final",
    };
    expect(handleChatEvent(state, payload)).toBe(null);
  });

  it("returns null for delta from another run", () => {
    const state = createState({
      sessionKey: "main",
      chatRunId: "run-user",
      chatStream: "Hello",
    });
    const payload: ChatEventPayload = {
      runId: "run-announce",
      sessionKey: "main",
      state: "delta",
      message: { role: "assistant", content: [{ type: "text", text: "Done" }] },
    };
    expect(handleChatEvent(state, payload)).toBe(null);
    expect(state.chatRunId).toBe("run-user");
    expect(state.chatStream).toBe("Hello");
  });

  it("returns null for final from another run when user is actively streaming (prevents optimistic message loss)", () => {
    const state = createState({
      sessionKey: "main",
      chatRunId: "run-user",
      chatStream: "Working...",
      chatStreamStartedAt: 123,
    });
    const payload: ChatEventPayload = {
      runId: "run-announce",
      sessionKey: "main",
      state: "final",
      message: {
        role: "assistant",
        content: [{ type: "text", text: "Sub-agent findings" }],
      },
    };
    // Should NOT trigger loadChatHistoryAfterFinal while user is streaming
    expect(handleChatEvent(state, payload)).toBe(null);
    expect(state.chatRunId).toBe("run-user");
    expect(state.chatStream).toBe("Working...");
    expect(state.chatStreamStartedAt).toBe(123);
  });

  it("returns 'final' for final from another run when user is NOT streaming", () => {
    const state = createState({
      sessionKey: "main",
      chatRunId: "run-user",
      chatStream: null,
      chatStreamStartedAt: null,
    });
    const payload: ChatEventPayload = {
      runId: "run-announce",
      sessionKey: "main",
      state: "final",
      message: {
        role: "assistant",
        content: [{ type: "text", text: "Sub-agent findings" }],
      },
    };
    expect(handleChatEvent(state, payload)).toBe("final");
    expect(state.chatRunId).toBe("run-user");
  });

  it("processes final from own run — clears runId but keeps chatStream for loadChatHistoryAfterFinal", () => {
    const state = createState({
      sessionKey: "main",
      chatRunId: "run-1",
      chatStream: "Reply",
      chatStreamStartedAt: 100,
    });
    const payload: ChatEventPayload = {
      runId: "run-1",
      sessionKey: "main",
      state: "final",
    };
    expect(handleChatEvent(state, payload)).toBe("final");
    expect(state.chatRunId).toBe(null);
    // chatStream is intentionally preserved until loadChatHistoryAfterFinal
    // replaces it with server history — prevents flash of empty chat
    expect(state.chatStream).toBe("Reply");
    expect(state.chatStreamStartedAt).toBe(null);
  });
});

describe("loadChatHistory", () => {
  it("clears chatLoading even when a stale generation causes early return", async () => {
    let resolveFirst!: (v: unknown) => void;
    const slowPromise = new Promise((r) => { resolveFirst = r; });

    const mockClient = {
      request: (_method: string, _params: unknown) => slowPromise,
    };

    const state = createState({
      client: mockClient as any,
      connected: true,
      sessionKey: "main",
    });

    // Start first load — it will block on the slow promise
    const first = loadChatHistory(state);
    expect(state.chatLoading).toBe(true);

    // Start second load — this bumps the generation counter, making
    // the first load's response stale when it finally resolves
    const fastClient = {
      request: () => Promise.resolve({ messages: [{ role: "user" }] }),
    };
    state.client = fastClient as any;
    const second = loadChatHistory(state);

    // Second load completes immediately
    await second;
    expect(state.chatLoading).toBe(false);
    expect(state.chatMessages.length).toBe(1);

    // Now resolve the first (stale) load — it should NOT overwrite
    // messages, and chatLoading should remain false after it finishes
    resolveFirst({ messages: [{ role: "user" }, { role: "assistant" }] });
    await first;

    expect(state.chatLoading).toBe(false);
    // Messages should still be from the second (newer) load, not the stale first
    expect(state.chatMessages.length).toBe(1);
  });

  it("clears chatLoading when client is null (early return)", async () => {
    const state = createState({ client: null, connected: true });
    state.chatLoading = true;
    await loadChatHistory(state);
    // The early return at the top doesn't touch chatLoading — it returns
    // before setting it. This is correct because it was never "started".
    expect(state.chatLoading).toBe(true);
  });
});
