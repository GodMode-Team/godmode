import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { TemplateResult } from "lit";
import { icons } from "../icons.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { toStreamingMarkdownHtml } from "../markdown-streaming.js";
import type { ChatAttachment } from "../ui-types.js";

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
  /** Image/file attachments pending send */
  attachments: ChatAttachment[];
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
  /** Update attachments */
  onAttachmentsChange: (attachments: ChatAttachment[]) => void;
  /** Handle notification action button clicks */
  onAction?: (action: string, target?: string, method?: string, params?: Record<string, unknown>) => void;
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

/** Check if a scroll container is near the bottom (within threshold). */
function isNearBottom(el: HTMLElement, threshold = 80): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

/** Scroll the messages container to the bottom. */
function scrollToBottom(panel: HTMLElement) {
  const container = panel.querySelector(".ally-panel__messages");
  if (container) container.scrollTop = container.scrollHeight;
}

/**
 * Auto-scroll to bottom when new messages arrive, but only if the user
 * was already near the bottom (don't hijack scroll while reading history).
 */
const scrollState = new WeakMap<Element, { lastMsgCount: number; lastStreamLen: number }>();

function autoScrollIfNeeded(props: AllyChatProps) {
  requestAnimationFrame(() => {
    const panel = document.querySelector(".ally-panel, .ally-inline");
    if (!panel) return;
    const container = panel.querySelector(".ally-panel__messages");
    if (!container) return;

    const state = scrollState.get(container) ?? { lastMsgCount: 0, lastStreamLen: 0 };
    const msgCount = props.messages.length;
    const streamLen = props.stream?.length ?? 0;
    const isNew = msgCount !== state.lastMsgCount || streamLen > state.lastStreamLen;
    scrollState.set(container, { lastMsgCount: msgCount, lastStreamLen: streamLen });

    if (!isNew) return;
    if (isNearBottom(container as HTMLElement, 120)) {
      scrollToBottom(panel as HTMLElement);
    }
  });
}

/** Show/hide the jump-to-bottom button based on scroll position. */
function handleMessagesScroll(e: Event) {
  const el = e.currentTarget as HTMLElement;
  const btn = el.querySelector(".ally-jump-bottom") as HTMLElement | null;
  if (!btn) return;
  btn.classList.toggle("ally-jump-bottom--visible", !isNearBottom(el));
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
  if (msg.role === "assistant" && msg.content) {
    const rendered = toSanitizedMarkdownHtml(msg.content);
    return html`<div class="ally-msg__content chat-text">${unsafeHTML(rendered)}</div>`;
  }
  return html`<span class="ally-msg__content">${msg.content}</span>`;
}

function renderActions(msg: AllyChatMessage, onAction?: AllyChatProps["onAction"]) {
  if (!msg.actions || msg.actions.length === 0) return nothing;
  return html`
    <div class="ally-msg__actions">
      ${msg.actions.map(
        (a) => html`
          <button
            type="button"
            class="ally-msg__action-btn"
            @click=${() => onAction?.(a.action, a.target, a.method, a.params)}
          >
            ${a.label}
          </button>
        `,
      )}
    </div>
  `;
}

function renderMessage(msg: AllyChatMessage, index: number, onAction?: AllyChatProps["onAction"]) {
  if (msg.isNotification) {
    return html`
      <div class="ally-msg ally-msg--notification" data-idx=${index}>
        ${renderMessageContent(msg)}
        ${renderActions(msg, onAction)}
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
  const rendered = toStreamingMarkdownHtml(stream);
  return html`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${unsafeHTML(rendered)}</div>
    </div>
  `;
}

function renderStatus(props: AllyChatProps) {
  if (!props.connected) {
    return html`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`;
  }
  return nothing;
}

function renderReadingIndicator() {
  return html`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `;
}

function handlePaste(e: ClipboardEvent, props: AllyChatProps) {
  const items = e.clipboardData?.items;
  if (!items) return;
  const newAttachments: ChatAttachment[] = [];
  for (const item of Array.from(items)) {
    if (!item.type.startsWith("image/")) continue;
    const file = item.getAsFile();
    if (!file) continue;
    e.preventDefault();
    const reader = new FileReader();
    const id = `paste-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      props.onAttachmentsChange([
        ...props.attachments,
        { id, dataUrl, mimeType: file.type, fileName: file.name || "screenshot.png", status: "ready" },
      ]);
    };
    reader.readAsDataURL(file);
    newAttachments.push({ id, dataUrl: "", mimeType: file.type, fileName: file.name, status: "reading" });
  }
  if (newAttachments.length > 0) {
    props.onAttachmentsChange([...props.attachments, ...newAttachments]);
  }
}

function renderAttachmentPreviews(props: AllyChatProps) {
  if (props.attachments.length === 0) return nothing;
  return html`
    <div class="ally-panel__attachments">
      ${props.attachments.map(
        (att) => html`
          <div class="ally-panel__attachment">
            ${att.dataUrl
              ? html`<img src=${att.dataUrl} alt=${att.fileName ?? "attachment"} class="ally-panel__attachment-img" />`
              : html`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${() => props.onAttachmentsChange(props.attachments.filter((a) => a.id !== att.id))}
            >${icons.x}</button>
          </div>
        `,
      )}
    </div>
  `;
}

function renderInput(props: AllyChatProps) {
  const placeholder = props.connected
    ? `Message ${props.allyName}...`
    : "Reconnecting...";
  const hasContent = props.draft.trim() || props.attachments.length > 0;

  return html`
    ${renderAttachmentPreviews(props)}
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
        @paste=${(e: ClipboardEvent) => handlePaste(e, props)}
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
        ?disabled=${!props.connected || (!hasContent && !props.sending)}
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
  autoScrollIfNeeded(props);
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
          title="Minimize"
          aria-label="Minimize ${props.allyName} chat"
          @click=${() => props.onToggle()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>

    ${renderStatus(props)}

    <div class="ally-panel__messages" @scroll=${handleMessagesScroll}>
      ${props.messages.length === 0 && !props.stream
        ? html`<div class="ally-panel__empty">
            Start a conversation with ${props.allyName}
          </div>`
        : nothing}
      ${props.messages.map((msg, i) => renderMessage(msg, i, props.onAction))}
      ${props.stream ? renderStream(props.stream) : nothing}
      ${(props.isWorking || props.sending) && !props.stream ? renderReadingIndicator() : nothing}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${(e: Event) => {
          const panel = (e.currentTarget as HTMLElement).closest(".ally-panel, .ally-inline");
          if (panel) scrollToBottom(panel as HTMLElement);
        }}
      >${icons.chevronDown}</button>
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
