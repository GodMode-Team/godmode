/**
 * Lightweight typed event bus for cross-tab communication.
 *
 * Any tab can emit events; any other tab (or the root app) can subscribe.
 * Subscriptions return an unsubscribe function for easy cleanup in
 * disconnectedCallback / controller teardown.
 */

import type { Tab } from "../navigation.js";

// ---------------------------------------------------------------------------
// Event map — add new cross-tab events here
// ---------------------------------------------------------------------------

export type AppEvents = {
  /** Active session changed (e.g. user switched sessions). */
  "session-changed": { sessionKey: string };

  /** Request navigation to a chat session + optional tab switch + optional auto-send message. */
  "chat-navigate": { sessionKey: string; tab?: Tab; message?: string };

  /** Toast notification. */
  "toast": { message: string; variant?: string };

  /** Open the resource sidebar. */
  "sidebar-open": { content: string; title?: string; mimeType?: string; filePath?: string };

  /** Close the resource sidebar. */
  "sidebar-close": void;

  /** Ask a specific subsystem to refresh its data. */
  "refresh-requested": { target: string };

  /** Settings were saved (broadcast so listeners can re-read). */
  "settings-changed": void;
};

// ---------------------------------------------------------------------------
// Bus implementation
// ---------------------------------------------------------------------------

type Handler<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<K extends keyof AppEvents>(event: K, handler: Handler<AppEvents[K]>): () => void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }
    const set = this.listeners.get(event as string)!;
    set.add(handler as Handler<unknown>);
    return () => {
      set.delete(handler as Handler<unknown>);
    };
  }

  /** Emit an event to all subscribers. */
  emit<K extends keyof AppEvents>(
    event: K,
    ...args: AppEvents[K] extends void ? [] : [AppEvents[K]]
  ): void {
    const set = this.listeners.get(event as string);
    if (!set) return;
    const payload = args[0];
    for (const handler of set) {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[event-bus] Error in handler for "${event as string}":`, err);
      }
    }
  }

  /** Remove all listeners (useful for tests). */
  clear(): void {
    this.listeners.clear();
  }
}

/** Singleton event bus shared across the UI. */
export const appEventBus = new EventBus();
