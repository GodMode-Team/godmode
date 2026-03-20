/**
 * <gm-team> — Team tab component.
 *
 * Embeds the Paperclip dashboard in a full-height iframe.
 * Uses the browser's hostname (Tailscale) + Paperclip port so the
 * iframe URL works from any device on the tailnet.
 */

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";

@customElement("gm-team")
export class GmTeam extends LitElement {
  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  @property({ attribute: false }) host!: any;

  @state() private _ready = false;
  @state() private _url = "";
  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _iframeError = false;

  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    this._loading = true;
    this._error = null;
    this._iframeError = false;
    const client = this.host?.client ?? this.ctx?.client;
    if (!client) {
      this._loading = false;
      this._error = "Not connected to gateway.";
      return;
    }

    try {
      const res = await client.request<{
        ready: boolean;
        url: string | null;
      }>("paperclip.dashboardUrl", {});

      this._ready = res?.ready ?? false;
      this._url = res?.url ?? "";
    } catch {
      this._error = "Could not reach Paperclip.";
    } finally {
      this._loading = false;
    }
  }

  /** Build dashboard URL using browser hostname (Tailscale) + Paperclip port. */
  private _dashboardUrl(): string {
    let port = "3100";
    if (this._url) {
      try {
        const parsed = new URL(this._url);
        if (parsed.port) port = parsed.port;
      } catch { /* use default */ }
    }
    const proto = window.location.protocol;
    const host = window.location.hostname;
    return `${proto}//${host}:${port}`;
  }

  override render() {
    if (this._loading) {
      return html`<div class="my-day-container">
        <div class="my-day-card"><div class="my-day-card-content"><p>Loading team status...</p></div></div>
      </div>`;
    }

    if (!this._ready) {
      return html`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content">
            <h3 style="margin: 0 0 8px;">Agent Team</h3>
            <p style="color: var(--muted); margin: 0 0 16px;">
              Paperclip orchestrates your AI agent team — multiple specialists working together on complex tasks.
            </p>
            ${this._error
              ? html`<p style="color: var(--danger, #ef4444); margin: 0 0 12px;">${this._error}</p>`
              : html`<p style="color: var(--muted); margin: 0 0 12px;">
                  Paperclip is not connected. Set <code>PAPERCLIP_URL</code> in your <code>.env</code> to enable multi-agent orchestration.
                </p>`
            }
            <button class="retry-button" @click=${() => void this._load()}>Retry</button>
          </div>
        </div>
      </div>`;
    }

    const dashUrl = this._dashboardUrl();

    // If iframe failed to load, show fallback with external link
    if (this._iframeError) {
      return html`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="text-align: center; padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">Paperclip Dashboard</h3>
            <p style="color: var(--muted); margin: 0 0 20px; font-size: 13px;">
              The dashboard couldn't be embedded. Open it in a new tab instead.
            </p>
            <a
              href="${dashUrl}"
              target="_blank"
              rel="noopener"
              style="
                display: inline-block;
                padding: 14px 40px;
                background: var(--accent, #f59e0b);
                color: var(--on-accent, #000);
                font-size: 16px;
                font-weight: 600;
                border-radius: 10px;
                text-decoration: none;
              "
            >Open Paperclip Dashboard</a>
          </div>
        </div>
      </div>`;
    }

    return html`<div style="
      display: flex;
      flex-direction: column;
      height: calc(100vh - 16px);
      padding: 0;
      margin: -16px -24px 0;
    ">
      <!-- Full-height iframe -->
      <iframe
        src="${dashUrl}"
        style="
          flex: 1;
          width: 100%;
          border: none;
          background: var(--surface, #1a1a1a);
        "
        allow="clipboard-read; clipboard-write"
        @error=${() => { this._iframeError = true; }}
        @load=${(e: Event) => {
          // Detect load failures (blocked by X-Frame-Options results in about:blank)
          try {
            const iframe = e.target as HTMLIFrameElement;
            if (iframe.contentDocument?.title === "" && iframe.contentDocument?.body?.children.length === 0) {
              // Might be blocked — but give it a moment since some SPAs load async
            }
          } catch {
            // Cross-origin access blocked = iframe loaded successfully (content is there)
          }
        }}
      ></iframe>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gm-team": GmTeam;
  }
}
