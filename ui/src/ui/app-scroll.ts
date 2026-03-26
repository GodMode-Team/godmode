/** Threshold (px) for re-engaging auto-scroll when user scrolls back to bottom. */
const RE_ENGAGE_THRESHOLD = 80;

type ScrollHost = {
  updateComplete: Promise<unknown>;
  querySelector: (selectors: string) => Element | null;
  style: CSSStyleDeclaration;
  chatScrollFrame: number | null;
  chatScrollTimeout: number | null;
  chatHasAutoScrolled: boolean;
  chatUserNearBottom: boolean;
  chatIsAutoScrolling: boolean;
  chatNewMessagesBelow: boolean;
  logsScrollFrame: number | null;
  logsAtBottom: boolean;
  topbarObserver: ResizeObserver | null;
};

/** Find the .chat-thread scroll container, returning null if not found or not scrollable. */
function pickChatScrollTarget(host: ScrollHost): HTMLElement | null {
  const container = host.querySelector(".chat-thread") as HTMLElement | null;
  if (container) {
    const overflowY = getComputedStyle(container).overflowY;
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      container.scrollHeight - container.clientHeight > 1
    ) {
      return container;
    }
  }
  return null;
}

/** Programmatically scroll a container to its bottom, suppressing the scroll handler. */
function autoScrollToBottom(host: ScrollHost, target: HTMLElement): void {
  host.chatIsAutoScrolling = true;
  target.scrollTop = target.scrollHeight;
  host.chatNewMessagesBelow = false;
  requestAnimationFrame(() => {
    host.chatIsAutoScrolling = false;
  });
}

/**
 * Generation counter for force-scroll safety net.
 * Each force=true call increments this; the safety-net timeout checks staleness
 * so only the latest tab switch drives the final scroll.
 */
let _forceScrollGen = 0;

export function scheduleChatScroll(host: ScrollHost, force = false) {
  if (host.chatScrollFrame) {
    cancelAnimationFrame(host.chatScrollFrame);
  }
  if (host.chatScrollTimeout != null) {
    clearTimeout(host.chatScrollTimeout);
    host.chatScrollTimeout = null;
  }

  // Safety-net generation: when multiple scheduleChatScroll(force=true) calls
  // race (e.g. updated() lifecycle + .then() callback), the tracked rAF/timeout
  // from an earlier call can be cancelled by a later one. The safety-net timeout
  // below is intentionally NOT tracked, so it survives cancellation. The
  // generation counter ensures only the latest call's safety net fires.
  const safetyGen = force ? ++_forceScrollGen : 0;

  void host.updateComplete.then(() => {
    host.chatScrollFrame = requestAnimationFrame(() => {
      host.chatScrollFrame = null;
      const target = pickChatScrollTarget(host);
      if (!target) {
        // Container not rendered yet — retry with increasing delays when forced
        if (force) {
          let attempt = 0;
          const tryLater = () => {
            const t = pickChatScrollTarget(host);
            if (t) {
              autoScrollToBottom(host, t);
            } else if (++attempt < 4) {
              setTimeout(tryLater, 80 * attempt);
            }
          };
          requestAnimationFrame(tryLater);
        } else {
          requestAnimationFrame(() => {
            const t = pickChatScrollTarget(host);
            if (t) {
              t.scrollTop = t.scrollHeight;
            }
          });
        }
        return;
      }
      // When force=true (tab switch, load complete, user message), always scroll.
      // Otherwise respect the user's current scroll position.
      const shouldStick = force || host.chatUserNearBottom;

      if (!shouldStick) {
        // User is scrolled up — flag that new content arrived below.
        host.chatNewMessagesBelow = true;
        return;
      }
      if (force) {
        host.chatHasAutoScrolled = true;
      }
      autoScrollToBottom(host, target);
      const retryDelay = force ? 150 : 120;
      host.chatScrollTimeout = window.setTimeout(() => {
        host.chatScrollTimeout = null;
        const latest = pickChatScrollTarget(host);
        if (!latest) {
          return;
        }
        const shouldStickRetry = force || host.chatUserNearBottom;
        if (!shouldStickRetry) {
          return;
        }
        autoScrollToBottom(host, latest);
      }, retryDelay);
    });
  });

  // Safety net for force scrolls (tab switches, history loads).
  // This timeout is NOT tracked by host.chatScrollTimeout, so it survives
  // cancellation when a concurrent scheduleChatScroll call races with us.
  // The generation counter ensures only the latest force call's safety net fires.
  if (force) {
    setTimeout(() => {
      if (safetyGen !== _forceScrollGen) return; // stale — a newer call owns the scroll
      const t = pickChatScrollTarget(host);
      if (t) {
        autoScrollToBottom(host, t);
      }
    }, 400);
  }
}

export function scheduleLogsScroll(host: ScrollHost, force = false) {
  if (host.logsScrollFrame) cancelAnimationFrame(host.logsScrollFrame);
  void host.updateComplete.then(() => {
    host.logsScrollFrame = requestAnimationFrame(() => {
      host.logsScrollFrame = null;
      const container = host.querySelector(".log-stream") as HTMLElement | null;
      if (!container) return;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const shouldStick = force || distanceFromBottom < 80;
      if (!shouldStick) return;
      container.scrollTop = container.scrollHeight;
    });
  });
}

export function handleChatScroll(host: ScrollHost, event: Event) {
  const container = event.currentTarget as HTMLElement | null;
  if (!container) {
    return;
  }
  // Ignore scroll events caused by programmatic auto-scroll.
  // Only user-initiated scrolls should change the nearBottom state.
  if (host.chatIsAutoScrolling) {
    return;
  }
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
  // Use a tight threshold so user must genuinely reach the bottom to re-engage auto-scroll.
  if (distanceFromBottom < 2) {
    // Hard bottom — definitely clear everything
    host.chatUserNearBottom = true;
    host.chatNewMessagesBelow = false;
  } else if (distanceFromBottom < RE_ENGAGE_THRESHOLD) {
    host.chatUserNearBottom = true;
    // Don't clear badge until hard bottom
  } else {
    host.chatUserNearBottom = false;
  }
}

export function handleLogsScroll(host: ScrollHost, event: Event) {
  const container = event.currentTarget as HTMLElement | null;
  if (!container) return;
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
  host.logsAtBottom = distanceFromBottom < 80;
}

export function resetChatScroll(host: ScrollHost) {
  host.chatHasAutoScrolled = false;
  host.chatUserNearBottom = true;
  host.chatNewMessagesBelow = false;
}

export function exportLogs(lines: string[], label: string) {
  if (lines.length === 0) return;
  const blob = new Blob([`${lines.join("\n")}\n`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  anchor.href = url;
  anchor.download = `godmode-logs-${label}-${stamp}.log`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function observeTopbar(host: ScrollHost) {
  if (typeof ResizeObserver === "undefined") return;
  const topbar = host.querySelector(".topbar");
  if (!topbar) return;
  const update = () => {
    const { height } = topbar.getBoundingClientRect();
    host.style.setProperty("--topbar-height", `${height}px`);
  };
  update();
  host.topbarObserver = new ResizeObserver(() => update());
  host.topbarObserver.observe(topbar);
}
