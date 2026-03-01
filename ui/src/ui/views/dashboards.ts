/**
 * Dashboards view — gallery of custom data views + active dashboard renderer.
 *
 * Two modes:
 *   1. Gallery: grid of dashboard cards with create/delete actions.
 *   2. Active: renders a single dashboard's HTML with back/refresh controls,
 *      an "Open in Chat" button, and an inline chat panel at the bottom
 *      powered by the dashboard's persistent session.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { sanitizeDashboardHtml } from "../markdown.js";
import { sanitizeHtmlFragment } from "../markdown.js";
import { formatAgo } from "../format.js";
import type { DashboardManifest } from "../controllers/dashboards.js";

// ── Types ────────────────────────────────────────────────────────────

export type DashboardsProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  dashboards?: DashboardManifest[];
  activeDashboardId?: string | null;
  activeDashboardHtml?: string | null;
  activeDashboardManifest?: DashboardManifest | null;
  isWorking?: boolean;
  onSelectDashboard: (id: string) => void;
  onDeleteDashboard: (id: string) => void;
  onCreateViaChat: () => void;
  onBack: () => void;
  onRefresh: () => void;
  onOpenSession: (dashboardId: string) => void;
  // Inline chat props
  chatOpen?: boolean;
  chatMessages?: unknown[];
  chatStream?: string | null;
  chatMessage?: string;
  chatSending?: boolean;
  assistantName?: string;
  assistantAvatar?: string | null;
  onToggleChat?: () => void;
  onChatMessageChange?: (value: string) => void;
  onChatSend?: () => void;
};

// ── Helpers ──────────────────────────────────────────────────────────

function renderScopeBadge(scope: string) {
  if (scope === "global") {
    return html`<span class="dashboard-card-scope">Global</span>`;
  }
  return html`<span class="dashboard-card-scope">${scope}</span>`;
}

// ── Dashboard Card ───────────────────────────────────────────────────

function renderDashboardCard(
  dashboard: DashboardManifest,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void,
) {
  return html`
    <div class="dashboard-card">
      <button
        class="dashboard-card-main"
        @click=${() => onSelect(dashboard.id)}
      >
        <div class="dashboard-card-title">${dashboard.title}</div>
        ${dashboard.description
          ? html`<div class="dashboard-card-desc">${dashboard.description}</div>`
          : nothing}
        <div class="dashboard-card-meta">
          ${renderScopeBadge(dashboard.scope)}
          <span>${formatAgo(new Date(dashboard.updatedAt).getTime())}</span>
        </div>
      </button>
      <button
        class="dashboard-card-delete"
        title="Delete dashboard"
        @click=${(e: Event) => {
          e.stopPropagation();
          if (confirm(`Delete "${dashboard.title}"?`)) {
            onDelete(dashboard.id);
          }
        }}
      >&times;</button>
    </div>
  `;
}

// ── Inline Chat Message ─────────────────────────────────────────────

function renderChatMessage(msg: Record<string, unknown>, assistantName: string) {
  const role = (msg.role as string) || "unknown";
  const isAssistant = role === "assistant";
  const label = isAssistant ? assistantName : "You";

  // Extract text content
  let text = "";
  if (typeof msg.text === "string") {
    text = msg.text;
  } else if (typeof msg.content === "string") {
    text = msg.content;
  } else if (Array.isArray(msg.content)) {
    text = (msg.content as Array<Record<string, unknown>>)
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n");
  }

  if (!text.trim()) return nothing;

  return html`
    <div class="db-chat-msg ${isAssistant ? "db-chat-msg--assistant" : "db-chat-msg--user"}">
      <div class="db-chat-msg-label">${label}</div>
      <div class="db-chat-msg-body">${isAssistant ? unsafeHTML(sanitizeHtmlFragment(text)) : text}</div>
    </div>
  `;
}

// ── Inline Chat Panel ───────────────────────────────────────────────

function renderInlineChat(props: DashboardsProps) {
  const {
    chatOpen,
    chatMessages,
    chatStream,
    chatMessage,
    chatSending,
    isWorking,
    assistantName,
    onToggleChat,
    onChatMessageChange,
    onChatSend,
  } = props;

  const name = assistantName || "Assistant";
  const messages = (chatMessages ?? []) as Array<Record<string, unknown>>;
  const hasMessages = messages.length > 0;

  return html`
    <div class="db-chat-panel ${chatOpen ? "db-chat-panel--open" : ""}">
      <button
        class="db-chat-toggle"
        @click=${() => onToggleChat?.()}
      >
        <span class="db-chat-toggle-label">
          Session ${hasMessages ? `(${messages.length})` : ""}
          ${isWorking ? html`<span class="db-chat-working">working...</span>` : nothing}
        </span>
        <span class="db-chat-toggle-arrow">${chatOpen ? "\u25BC" : "\u25B2"}</span>
      </button>

      ${chatOpen
        ? html`
            <div class="db-chat-messages" id="db-chat-messages">
              ${!hasMessages && !chatStream
                ? html`<div class="db-chat-empty">Send a message to refine this dashboard.</div>`
                : nothing}
              ${messages.map((m) => renderChatMessage(m, name))}
              ${chatStream
                ? html`
                    <div class="db-chat-msg db-chat-msg--assistant">
                      <div class="db-chat-msg-label">${name}</div>
                      <div class="db-chat-msg-body">${unsafeHTML(sanitizeHtmlFragment(chatStream))}</div>
                    </div>
                  `
                : nothing}
              ${isWorking && !chatStream
                ? html`<div class="db-chat-typing">${name} is thinking...</div>`
                : nothing}
            </div>
            <div class="db-chat-input-row">
              <input
                class="db-chat-input"
                type="text"
                placeholder="Ask to refine this dashboard..."
                .value=${chatMessage ?? ""}
                ?disabled=${chatSending || isWorking}
                @input=${(e: Event) => onChatMessageChange?.((e.target as HTMLInputElement).value)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onChatSend?.();
                  }
                }}
              />
              <button
                class="db-chat-send-btn"
                ?disabled=${chatSending || isWorking || !(chatMessage ?? "").trim()}
                @click=${() => onChatSend?.()}
              >${chatSending ? "..." : "Send"}</button>
            </div>
          `
        : nothing}
    </div>
  `;
}

// ── Active Dashboard View ────────────────────────────────────────────

function renderActiveDashboard(props: DashboardsProps) {
  const { activeDashboardHtml, activeDashboardManifest, isWorking } = props;
  if (!activeDashboardHtml || !activeDashboardManifest) return nothing;

  return html`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${() => props.onBack()}
        >&larr; All Dashboards</button>
        <span class="dashboards-active-title">${activeDashboardManifest.title}</span>
        <button
          class="dashboards-session-btn"
          @click=${() => props.onOpenSession(activeDashboardManifest.id)}
        >${isWorking ? "Working..." : "Open in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${() => props.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${unsafeHTML(sanitizeDashboardHtml(activeDashboardHtml))}
        </div>
      </div>
      ${renderInlineChat(props)}
    </section>
  `;
}

// ── Gallery View ─────────────────────────────────────────────────────

function renderGallery(props: DashboardsProps) {
  const { loading, dashboards } = props;

  return html`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <button
          class="dashboards-create-btn"
          @click=${() => props.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${loading
        ? html`<div class="dashboards-loading">Loading...</div>`
        : !dashboards || dashboards.length === 0
          ? html`
              <div class="dashboards-empty">
                <div class="dashboards-empty-icon">&#128202;</div>
                <div class="dashboards-empty-title">No dashboards yet</div>
                <div class="dashboards-empty-hint">
                  Tell your ally what you want to see and they'll build it for you.<br>
                  <em>"Create a morning overview dashboard with my tasks, calendar, and focus score."</em>
                </div>
              </div>
            `
          : html`
              <div class="dashboards-grid">
                ${dashboards.map((d) =>
                  renderDashboardCard(
                    d,
                    props.onSelectDashboard,
                    props.onDeleteDashboard,
                  ),
                )}
              </div>
            `}
    </section>
  `;
}

// ── Main Export ───────────────────────────────────────────────────────

export function renderDashboards(props: DashboardsProps) {
  if (props.error) {
    return html`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <p>${props.error}</p>
          <button @click=${() => props.onRefresh()}>Retry</button>
        </div>
      </section>
    `;
  }

  // Show active dashboard if one is selected
  if (props.activeDashboardHtml && props.activeDashboardManifest) {
    return renderActiveDashboard(props);
  }

  // Otherwise show gallery
  return renderGallery(props);
}
