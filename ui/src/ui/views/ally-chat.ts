import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { icons } from "../icons.js";

// ── Types ──────────────────────────────────────────────────────────

export type AllyChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  isNotification?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    target?: string;
    method?: string;
    params?: Record<string, unknown>;
  }>;
};

export type AllyChatProps = {
  /** Display name of the ally — NEVER hardcoded, comes from state.assistantName */
  allyName: string;
  /** Avatar URL or null for initial-letter fallback */
  allyAvatar: string | null;
  /** Whether the panel is open */
  open: boolean;
  /** Chat messages */
  messages: AllyChatMessage[];
  /** Live streaming text (partial assistant reply) */
  stream: string | null;
  /** Current compose draft */
  draft: string;
  /** Whether a message is being sent */
  sending: boolean;
  /** Whether the ally is actively processing */
  isWorking: boolean;
  /** Number of unread messages */
  unreadCount: number;
  /** Whether the gateway connection is alive */
  connected: boolean;
  /** Compact layout mode (less padding) */
  compact: boolean;
  /** Toggle panel open/closed */
  onToggle: () => void;
  /** Update the draft text */
  onDraftChange: (text: string) => void;
  /** Send the current draft */
  onSend: () => void;
  /** Abort current generation */
  onAbort?: () => void;
  /** Navigate to the full chat tab with this session */
  onOpenFullChat: () => void;
};

// ── Helpers ────────────────────────────────────────────────────────

function allyInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "A";
}

function formatTimestamp(ts: number | undefined): string {
  if (!ts) return "";
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function adjustTextareaHeight(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
}

// ── Sub-renderers ──────────────────────────────────────────────────

function renderAvatar(props: AllyChatProps, size: "bubble" | "header") {
  if (props.allyAvatar) {
    const cls = size === "bubble" ? "ally-bubble__avatar" : "ally-panel__header-avatar";
    return html`<img class=${cls} src=${props.allyAvatar} alt=${props.allyName} />`;
  }
  if (size === "header") {
    return html`<span class="ally-panel__header-initial">${allyInitial(props.allyName)}</span>`;
  }
  // Bubble: the letter is rendered by the button itself
  return html`${allyInitial(props.allyName)}`;
}

function renderMessageContent(msg: AllyChatMessage) {
  // Simple text rendering — future phases can add markdown
  return html`<span class="ally-msg__content">${msg.content}</span>`;
}

function renderActions(msg: AllyChatMessage) {
  if (!msg.actions || msg.actions.length === 0) return nothing;
  return html`
    <div class="ally-msg__actions">
      ${msg.actions.map(
        (a) => html`
          <button
            type="button"
            class="ally-msg__action-btn"
            data-action=${a.action}
            data-target=${a.target ?? ""}
            data-method=${a.method ?? ""}
          >
            ${a.label}
          </button>
        `,
      )}
    </div>
  `;
}

function renderMessage(msg: AllyChatMessage, index: number) {
  if (msg.isNotification) {
    return html`
      <div class="ally-msg ally-msg--notification" data-idx=${index}>
        ${renderMessageContent(msg)}
        ${renderActions(msg)}
        ${msg.timestamp ? html`<div class="ally-msg__time">${formatTimestamp(msg.timestamp)}</div>` : nothing}
      </div>
    `;
  }

  const roleClass = msg.role === "user" ? "ally-msg--user" : "ally-msg--assistant";
  return html`
    <div class="ally-msg ${roleClass}" data-idx=${index}>
      ${renderMessageContent(msg)}
      ${msg.timestamp ? html`<div class="ally-msg__time">${formatTimestamp(msg.timestamp)}</div>` : nothing}
    </div>
  `;
}

function renderStream(stream: string) {
  if (!stream) return nothing;
  return html`
    <div class="ally-msg ally-msg--streaming">
      <span class="ally-msg__content">${stream}</span>
    </div>
  `;
}

function renderStatus(props: AllyChatProps) {
  if (!props.connected) {
    return html`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`;
  }
  if (props.isWorking || props.sending) {
    return html`<div class="ally-panel__status ally-panel__status--working">Working...</div>`;
  }
  return nothing;
}

function renderInput(props: AllyChatProps) {
  const placeholder = props.connected
    ? `Message ${props.allyName}...`
    : "Reconnecting...";

  return html`
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${props.draft}
        ?disabled=${!props.connected || props.sending}
        placeholder=${placeholder}
        rows="1"
        @input=${(e: Event) => {
          const target = e.target as HTMLTextAreaElement;
          adjustTextareaHeight(target);
          props.onDraftChange(target.value);
        }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key !== "Enter") return;
          if (e.isComposing || e.keyCode === 229) return;
          if (e.shiftKey) return;
          if (!props.connected) return;
          e.preventDefault();
          props.onSend();
        }}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!props.connected || (!props.draft.trim() && !props.sending)}
        title="Send"
        @click=${() => props.onSend()}
      >
        ${icons.arrowUp}
      </button>
    </div>
  `;
}

// ── Bubble Mode ────────────────────────────────────────────────────

function renderBubble(props: AllyChatProps): TemplateResult {
  return html`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${props.allyName}"
        aria-label="Open ${props.allyName} chat"
        @click=${() => props.onToggle()}
      >
        ${renderAvatar(props, "bubble")}
        ${props.isWorking ? html`<span class="ally-bubble__working"></span>` : nothing}
      </button>
      ${props.unreadCount > 0
        ? html`<span class="ally-bubble__badge">${props.unreadCount > 99 ? "99+" : props.unreadCount}</span>`
        : nothing}
    </div>
  `;
}

// ── Panel Mode ─────────────────────────────────────────────────────

function renderPanelContent(props: AllyChatProps): TemplateResult {
  return html`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${renderAvatar(props, "header")}
        <span class="ally-panel__header-name">${props.allyName}</span>
      </div>
      <div class="ally-panel__header-actions">
        <button
          type="button"
          class="ally-panel__header-btn"
          title="Open full chat"
          @click=${() => props.onOpenFullChat()}
        >
          Full Chat
        </button>
        <button
          type="button"
          class="ally-panel__close-btn"
          title="Close"
          aria-label="Close ${props.allyName} chat"
          @click=${() => props.onToggle()}
        >
          ${icons.x}
        </button>
      </div>
    </div>

    ${renderStatus(props)}

    <div class="ally-panel__messages">
      ${props.messages.length === 0 && !props.stream
        ? html`<div class="ally-panel__empty">
            Start a conversation with ${props.allyName}
          </div>`
        : nothing}
      ${props.messages.map((msg, i) => renderMessage(msg, i))}
      ${props.stream ? renderStream(props.stream) : nothing}
    </div>

    ${renderInput(props)}
  `;
}

// ── Public API ─────────────────────────────────────────────────────

/**
 * Render the ally chat as either a floating bubble or an overlay panel.
 * Uses fixed positioning — suitable for the main app layout.
 */
export function renderAllyChat(props: AllyChatProps): TemplateResult | typeof nothing {
  if (!props.open) {
    return renderBubble(props);
  }

  return html`
    <div class="ally-panel">
      ${renderPanelContent(props)}
    </div>
  `;
}

/**
 * Render the ally chat inline — same content as the panel but without fixed
 * positioning. Designed for embedding in flex containers (Canvas phase).
 * Uses relative positioning, 100% width/height.
 */
export function renderAllyInline(props: AllyChatProps): TemplateResult | typeof nothing {
  if (!props.open) return nothing;

  return html`
    <div class="ally-inline">
      ${renderPanelContent(props)}
    </div>
  `;
}
