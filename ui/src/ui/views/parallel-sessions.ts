/**
 * Parallel Sessions View — 4 fixed lanes, drag-drop from session tabs.
 *
 * Each lane shows: header (name, model, turns, status) + scrollable messages + compose.
 * Empty lanes show a drop zone. Sessions are dragged from the tab bar.
 * Lane assignments persist in settings.parallelLanes.
 */
import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state.js";
import type { GatewaySessionRow } from "../types.js";
import { autoTitleCache } from "../controllers/sessions.js";
import { sessionTurnCounts, laneMessageCache } from "../controllers/chat.js";
import { findSessionByKey } from "../app-lifecycle.js";

const MAX_RENDERED_LANE_MESSAGES = 120;

function getDisplayName(
  session: GatewaySessionRow | undefined,
  key: string,
): string {
  if (session?.label) return session.label;
  if (session?.displayName) return session.displayName;
  const cached = autoTitleCache.get(key);
  if (cached) return cached;
  if (key.includes("webchat")) {
    const match = key.match(/webchat[:-](\d+)/);
    return match ? `Chat ${match[1]}` : "Chat";
  }
  if (key.includes("main")) return "MAIN";
  const parts = key.split(/[:-]/);
  return parts[parts.length - 1] || key;
}

function formatTokens(n: number | undefined): string {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export type ParallelSessionsProps = {
  state: AppViewState;
  onAssignLane: (laneIndex: number, sessionKey: string | null) => void;
  onReorderLanes: (fromIndex: number, toIndex: number) => void;
  onLaneViewed: (sessionKey: string) => void;
  onSendInLane: (sessionKey: string, message: string) => void;
};

function renderMessage(msg: unknown) {
  const m = msg as Record<string, unknown>;
  const role = String(m.role ?? "");
  if (role !== "user" && role !== "assistant") return nothing;
  const text =
    typeof m.content === "string"
      ? m.content
      : Array.isArray(m.content)
        ? (m.content as Array<Record<string, unknown>>)
            .filter((p) => p.type === "text")
            .map((p) => String(p.text ?? ""))
            .join(" ")
        : "";
  if (!text.trim()) return nothing;
  const truncated = text.slice(0, 300);
  return html`
    <div class="parallel-col__msg parallel-col__msg--${role}">
      <span class="parallel-col__msg-role">${role === "user" ? "You" : "AI"}</span>
      <span class="parallel-col__msg-text">${truncated}${text.length > 300 ? "..." : ""}</span>
    </div>
  `;
}

function renderEmptyLane(laneIndex: number) {
  return html`
    <div
      class="parallel-col parallel-col--empty"
      @dragover=${(e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        (e.currentTarget as HTMLElement).classList.add("parallel-col--dragover");
      }}
      @dragleave=${(e: DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove("parallel-col--dragover");
      }}
      @drop=${(e: DragEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).classList.remove("parallel-col--dragover");
        const fromLaneRaw = e.dataTransfer?.getData("text/lane-index");
        if (fromLaneRaw != null && fromLaneRaw !== "") {
          const fromLane = Number.parseInt(fromLaneRaw, 10);
          if (!Number.isNaN(fromLane)) {
            (e.currentTarget as HTMLElement).dispatchEvent(
              new CustomEvent("lane-reorder", {
                detail: { fromIndex: fromLane, toIndex: laneIndex },
                bubbles: true,
                composed: true,
              }),
            );
            return;
          }
        }
        const key = e.dataTransfer?.getData("text/session-key");
        if (key) {
          (e.currentTarget as HTMLElement).dispatchEvent(
            new CustomEvent("lane-drop", { detail: { laneIndex, sessionKey: key }, bubbles: true, composed: true }),
          );
        }
      }}
      data-lane-index="${laneIndex}"
    >
      <div class="parallel-col__drop-zone">
        <div class="parallel-col__drop-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
        </div>
        <span class="parallel-col__drop-text">Drag a session here</span>
      </div>
    </div>
  `;
}

function renderFilledLane(
  laneIndex: number,
  sessionKey: string,
  props: ParallelSessionsProps,
) {
  const { state, onAssignLane, onSendInLane } = props;
  const sessions = state.sessionsResult?.sessions ?? [];
  const session = findSessionByKey(sessions, sessionKey);
  const canonicalSessionKey = session?.key ?? sessionKey;
  const isWorking =
    state.workingSessions.has(sessionKey) || state.workingSessions.has(canonicalSessionKey);
  const name = getDisplayName(session, sessionKey);
  const turns = sessionTurnCounts.get(sessionKey) ?? sessionTurnCounts.get(canonicalSessionKey);
  const model = session?.model ?? "";
  const tokens = session?.totalTokens ?? 0;
  const lastViewed =
    state.settings.tabLastViewed[canonicalSessionKey] ??
    state.settings.tabLastViewed[sessionKey] ??
    0;
  const updatedAt = session?.updatedAt ?? 0;
  const isReady = !isWorking && updatedAt > lastViewed;

  // Get messages: use main chatMessages for active session, lane cache for others
  const isActiveSession = sessionKey === state.sessionKey;
  const messages = isActiveSession
    ? state.chatMessages
    : laneMessageCache.get(sessionKey) ??
      laneMessageCache.get(canonicalSessionKey) ??
      [];
  const emitLaneViewed = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    target.dispatchEvent(
      new CustomEvent("lane-viewed", {
        detail: { sessionKey: canonicalSessionKey },
        bubbles: true,
        composed: true,
      }),
    );
  };

  return html`
    <div
      class="parallel-col parallel-col--filled ${isWorking ? "parallel-col--working" : ""} ${isReady ? "parallel-col--ready" : ""}"
      @pointerdown=${(e: PointerEvent) => emitLaneViewed(e.currentTarget)}
      @focusin=${(e: FocusEvent) => emitLaneViewed(e.currentTarget)}
      @dragover=${(e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        (e.currentTarget as HTMLElement).classList.add("parallel-col--dragover");
      }}
      @dragleave=${(e: DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove("parallel-col--dragover");
      }}
      @drop=${(e: DragEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).classList.remove("parallel-col--dragover");
        const fromLaneRaw = e.dataTransfer?.getData("text/lane-index");
        if (fromLaneRaw != null && fromLaneRaw !== "") {
          const fromLane = Number.parseInt(fromLaneRaw, 10);
          if (!Number.isNaN(fromLane)) {
            (e.currentTarget as HTMLElement).dispatchEvent(
              new CustomEvent("lane-reorder", {
                detail: { fromIndex: fromLane, toIndex: laneIndex },
                bubbles: true,
                composed: true,
              }),
            );
            return;
          }
        }
        const key = e.dataTransfer?.getData("text/session-key");
        if (key) {
          (e.currentTarget as HTMLElement).dispatchEvent(
            new CustomEvent("lane-drop", { detail: { laneIndex, sessionKey: key }, bubbles: true, composed: true }),
          );
        }
      }}
      data-lane-index="${laneIndex}"
    >
      <!-- Header -->
      <div
        class="parallel-col__header"
        draggable="true"
        @dragstart=${(e: DragEvent) => {
          if (!e.dataTransfer) {
            return;
          }
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/lane-index", String(laneIndex));
          (e.currentTarget as HTMLElement).classList.add("parallel-col__header--dragging");
        }}
        @dragend=${(e: DragEvent) => {
          (e.currentTarget as HTMLElement).classList.remove("parallel-col__header--dragging");
        }}
      >
        <div class="parallel-col__title-row">
          <span class="parallel-col__drag-handle" title="Drag to reorder lanes" aria-hidden="true"
            >⋮⋮</span
          >
          <span class="parallel-col__name">${name}</span>
          <div class="parallel-col__header-actions">
            <span
              class="parallel-col__status-dot ${isWorking
                ? "parallel-col__status-dot--working"
                : isReady
                  ? "parallel-col__status-dot--ready"
                  : "parallel-col__status-dot--idle"}"
              title=${isWorking ? "Working" : isReady ? "Ready" : "Idle"}
            ></span>
            <span
              class="parallel-col__status ${isWorking
                ? "parallel-col__status--working"
                : isReady
                  ? "parallel-col__status--ready"
                  : ""}"
              >${isWorking ? "WORKING" : isReady ? "READY" : "IDLE"}</span
            >
            <button
              class="parallel-col__close"
              draggable="false"
              @click=${() => onAssignLane(laneIndex, null)}
              title="Remove from lane"
            >&times;</button>
          </div>
        </div>
        <div class="parallel-col__meta">
          ${model ? html`<span class="parallel-col__model">${model}</span>` : nothing}
          <span class="parallel-col__turns">${turns != null ? `${turns} turns` : "--"}</span>
          <span class="parallel-col__tokens">${formatTokens(tokens)} tokens</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="parallel-col__messages">
        ${messages.length > 0
          ? messages.slice(-MAX_RENDERED_LANE_MESSAGES).map(renderMessage)
          : html`<div class="parallel-col__empty">No messages yet</div>`}
      </div>

      <!-- Compose -->
      <div class="parallel-col__compose">
        <input
          type="text"
          class="parallel-col__input"
          draggable="false"
          placeholder="Message..."
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              const msg = input.value.trim();
              if (msg) {
                onSendInLane(sessionKey, msg);
                input.value = "";
              }
            }
          }}
        />
      </div>
    </div>
  `;
}

export function renderParallelSessions(props: ParallelSessionsProps) {
  const lanes = props.state.settings.parallelLanes;

  return html`
    <div
      class="parallel-columns"
      @lane-drop=${(e: CustomEvent<{ laneIndex: number; sessionKey: string }>) => {
        props.onAssignLane(e.detail.laneIndex, e.detail.sessionKey);
      }}
      @lane-reorder=${(e: CustomEvent<{ fromIndex: number; toIndex: number }>) => {
        props.onReorderLanes(e.detail.fromIndex, e.detail.toIndex);
      }}
      @lane-viewed=${(e: CustomEvent<{ sessionKey: string }>) => {
        props.onLaneViewed(e.detail.sessionKey);
      }}
    >
      ${lanes.map((sessionKey, i) =>
        sessionKey
          ? renderFilledLane(i, sessionKey, props)
          : renderEmptyLane(i),
      )}
    </div>
  `;
}
