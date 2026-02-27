import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { loadMyDay, type MyDayState } from "./my-day";

/**
 * Create a mock GatewayBrowserClient with configurable request behavior.
 */
function mockClient(handlers: Record<string, () => Promise<unknown>>) {
  return {
    request: vi.fn(async (method: string) => {
      const handler = handlers[method];
      if (!handler) {
        throw new Error(`Unexpected RPC call: ${method}`);
      }
      return handler();
    }),
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as import("../gateway").GatewayBrowserClient;
}

function makeState(client: ReturnType<typeof mockClient>): MyDayState {
  return {
    client,
    connected: true,
    myDayLoading: false,
    myDayError: null,
    dailyBrief: null,
    dailyBriefLoading: false,
    dailyBriefError: null,
  };
}

/** Mock localStorage for collapsed sections */
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
};

beforeEach(() => {
  vi.stubGlobal("localStorage", localStorageMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadMyDay", () => {
  it("loads daily brief successfully", async () => {
    const client = mockClient({
      "dailyBrief.get": async () => ({
        date: "2026-02-09",
        content: "# Brief",
        summary: { readiness: 80 },
        sections: [],
        updatedAt: new Date().toISOString(),
      }),
    });

    const state = makeState(client);
    await loadMyDay(state);

    expect(state.myDayLoading).toBe(false);
    expect(state.myDayError).toBeNull();
    expect(state.dailyBrief).toBeTruthy();
    expect(state.dailyBrief?.content).toBe("# Brief");
  });

  it("sets null brief when RPC fails", async () => {
    const client = mockClient({
      "dailyBrief.get": async () => {
        throw new Error("brief not found");
      },
    });

    const state = makeState(client);
    await loadMyDay(state);

    // Brief loader has its own try/catch, returns null
    expect(state.dailyBrief).toBeNull();
    // No global error because the individual loader caught the error
    expect(state.myDayError).toBeNull();
  });

  it("handles timeout on slow brief load", async () => {
    const client = mockClient({
      "dailyBrief.get": async () => {
        // Simulate slow response — longer than the 10s timeout
        await new Promise((resolve) => setTimeout(resolve, 15_000));
        return {
          date: "2026-02-09",
          content: "# Brief",
          summary: { readiness: 80 },
          sections: [],
          updatedAt: new Date().toISOString(),
        };
      },
    });

    const state = makeState(client);

    // Use fake timers so we don't actually wait 15 seconds
    vi.useFakeTimers();
    const promise = loadMyDay(state);
    // Advance past the 10s timeout
    await vi.advanceTimersByTimeAsync(11_000);
    await promise;
    vi.useRealTimers();

    // Brief timed out
    expect(state.dailyBrief).toBeNull();
  });

  it("returns early when not connected", async () => {
    const client = mockClient({});
    const state: MyDayState = {
      client,
      connected: false,
    };

    await loadMyDay(state);

    expect(state.myDayLoading).toBeUndefined();
    expect(client.request).not.toHaveBeenCalled();
  });

  it("returns early when client is null", async () => {
    const state: MyDayState = {
      client: null,
      connected: true,
    };

    await loadMyDay(state);

    expect(state.myDayLoading).toBeUndefined();
  });

  it("calls loadBriefNotes when provided", async () => {
    const loadBriefNotes = vi.fn().mockResolvedValue(undefined);
    const client = mockClient({
      "dailyBrief.get": async () => ({
        date: "2026-02-09",
        content: "# Brief",
        summary: { readiness: 80 },
        sections: [],
        updatedAt: new Date().toISOString(),
      }),
    });

    const state = makeState(client);
    state.loadBriefNotes = loadBriefNotes;
    await loadMyDay(state);

    expect(loadBriefNotes).toHaveBeenCalled();
    expect(state.dailyBrief).toBeTruthy();
  });
});
