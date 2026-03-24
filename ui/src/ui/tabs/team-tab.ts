/**
 * <gm-team> — Team tab component.
 *
 * When Paperclip is configured and running, embeds the dashboard in a full-height iframe.
 * When not configured, shows a setup wizard with one-click install + agent seeding.
 */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";

type SetupStep = { step: string; status: "ok" | "error" | "skipped"; detail?: string };
type SetupPhase = "loading" | "not-configured" | "installing" | "seeding" | "ready" | "error";

@customElement("gm-team")
export class GmTeam extends LitElement {
  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  @property({ attribute: false }) host!: any;

  @state() private _phase: SetupPhase = "loading";
  @state() private _url = "";
  @state() private _serverUp = false;
  @state() private _configured = false;
  @state() private _steps: SetupStep[] = [];
  @state() private _error: string | null = null;
  @state() private _iframeError = false;
  @state() private _customUrl = "";
  @state() private _showAdvanced = false;
  @state() private _agentCount = 0;

  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    void this._checkStatus();
  }

  private get _client() {
    return this.host?.client ?? this.ctx?.client;
  }

  /** Check current Paperclip status via the setup RPC. */
  private async _checkStatus() {
    this._phase = "loading";
    this._error = null;
    this._steps = [];
    const client = this._client;
    if (!client) {
      this._phase = "error";
      this._error = "Not connected to gateway.";
      return;
    }

    try {
      // First check via dashboardUrl (existing RPC)
      const dashRes = await client.request<{
        ready: boolean;
        url: string | null;
        agents?: unknown[];
      }>("paperclip.dashboardUrl", {});

      if (dashRes?.ready) {
        this._url = dashRes.url ?? "";
        this._agentCount = dashRes.agents?.length ?? 0;
        this._phase = "ready";
        return;
      }

      // Not ready — run setup check
      const res = await client.request<{
        serverUp: boolean;
        configured: boolean;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "check" });

      this._serverUp = res?.serverUp ?? false;
      this._configured = res?.configured ?? false;
      this._steps = res?.steps ?? [];
      this._phase = "not-configured";
    } catch (err) {
      this._phase = "not-configured";
      this._serverUp = false;
      this._configured = false;
    }
  }

  /** One-click setup: install server + seed agents. */
  private async _quickSetup() {
    const client = this._client;
    if (!client) return;

    this._phase = "installing";
    this._steps = [];
    this._error = null;

    try {
      // Step 1: Install/start the server
      const installRes = await client.request<{
        success: boolean;
        url?: string;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "install" });

      this._steps = [...(installRes?.steps ?? [])];
      if (!installRes?.success) {
        this._phase = "error";
        this._error = "Could not start Paperclip server. See details below.";
        return;
      }
      this._url = installRes.url ?? "http://localhost:3100";

      // Step 2: Seed agents
      this._phase = "seeding";
      const seedRes = await client.request<{
        success: boolean;
        companyId: string;
        agentsSeeded: number;
        totalAgents: number;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "seed" });

      this._steps = [...this._steps, ...(seedRes?.steps ?? [])];
      this._agentCount = seedRes?.totalAgents ?? 0;

      if (!seedRes?.success) {
        this._phase = "error";
        this._error = "Server is running but agent seeding failed.";
        return;
      }

      this._phase = "ready";
    } catch (err) {
      this._phase = "error";
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  /** Connect to existing server + seed agents. */
  private async _connectExisting() {
    const client = this._client;
    if (!client) return;
    const url = this._customUrl.trim();
    if (!url) return;

    this._phase = "installing";
    this._steps = [];
    this._error = null;

    try {
      const connectRes = await client.request<{
        success: boolean;
        url?: string;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "connect", url });

      this._steps = [...(connectRes?.steps ?? [])];
      if (!connectRes?.success) {
        this._phase = "error";
        this._error = "Could not connect to that server.";
        return;
      }

      // Seed agents
      this._phase = "seeding";
      const seedRes = await client.request<{
        success: boolean;
        totalAgents: number;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "seed" });

      this._steps = [...this._steps, ...(seedRes?.steps ?? [])];
      this._agentCount = seedRes?.totalAgents ?? 0;
      this._phase = seedRes?.success ? "ready" : "error";
      if (!seedRes?.success) this._error = "Connected but agent seeding failed.";
    } catch (err) {
      this._phase = "error";
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  /** Seed agents into an already-running server. */
  private async _seedOnly() {
    const client = this._client;
    if (!client) return;

    this._phase = "seeding";
    this._steps = [];
    this._error = null;

    try {
      const seedRes = await client.request<{
        success: boolean;
        totalAgents: number;
        steps: SetupStep[];
      }>("paperclip.setup", { action: "seed" });

      this._steps = seedRes?.steps ?? [];
      this._agentCount = seedRes?.totalAgents ?? 0;

      if (seedRes?.success) {
        this._phase = "ready";
      } else {
        this._phase = "error";
        this._error = "Agent seeding failed.";
      }
    } catch (err) {
      this._phase = "error";
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  /** Build dashboard URL using browser hostname + Paperclip port. */
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

  private _renderSteps() {
    if (this._steps.length === 0) return nothing;
    return html`
      <div style="margin-top: 16px; font-size: 13px;">
        ${this._steps.map(s => html`
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
            color: ${s.status === "error" ? "var(--danger, #ef4444)" : s.status === "ok" ? "var(--success, #22c55e)" : "var(--muted)"};
          ">
            <span>${s.status === "ok" ? "\u2713" : s.status === "error" ? "\u2717" : "\u2022"}</span>
            <span>${s.step}</span>
            ${s.detail ? html`<span style="color: var(--muted); font-size: 12px; margin-left: auto; max-width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.detail}">${s.detail}</span>` : nothing}
          </div>
        `)}
      </div>
    `;
  }

  override render() {
    // ── Loading ──
    if (this._phase === "loading") {
      return html`<div class="my-day-container">
        <div class="my-day-card"><div class="my-day-card-content"><p>Checking agent team status...</p></div></div>
      </div>`;
    }

    // ── Ready: show dashboard ──
    if (this._phase === "ready") {
      const dashUrl = this._dashboardUrl();

      if (this._iframeError) {
        return html`<div class="my-day-container">
          <div class="my-day-card">
            <div class="my-day-card-content" style="text-align: center; padding: 32px 24px;">
              <h3 style="margin: 0 0 12px;">Agent Team Ready</h3>
              <p style="color: var(--muted); margin: 0 0 8px; font-size: 13px;">
                ${this._agentCount} agents configured. Dashboard couldn't be embedded.
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
                  margin-top: 12px;
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
            try {
              const iframe = e.target as HTMLIFrameElement;
              if (iframe.contentDocument?.title === "" && iframe.contentDocument?.body?.children.length === 0) {
                // Might be blocked
              }
            } catch {
              // Cross-origin = loaded successfully
            }
          }}
        ></iframe>
      </div>`;
    }

    // ── Installing / Seeding progress ──
    if (this._phase === "installing" || this._phase === "seeding") {
      return html`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">${this._phase === "installing" ? "Starting Paperclip Server..." : "Seeding Agent Team..."}</h3>
            <p style="color: var(--muted); margin: 0 0 16px; font-size: 13px;">
              ${this._phase === "installing"
                ? "Installing and starting the Paperclip orchestration server. This may take a minute on first run."
                : "Creating agents from your GodMode persona roster."}
            </p>
            <div style="
              width: 100%;
              height: 4px;
              background: var(--surface-2, #2a2a2a);
              border-radius: 2px;
              overflow: hidden;
            ">
              <div style="
                height: 100%;
                background: var(--accent, #f59e0b);
                border-radius: 2px;
                animation: pulse-width 2s ease-in-out infinite;
                width: ${this._phase === "seeding" ? "70%" : "40%"};
              "></div>
            </div>
            ${this._renderSteps()}
          </div>
        </div>
      </div>
      <style>
        @keyframes pulse-width {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      </style>`;
    }

    // ── Error state ──
    if (this._phase === "error") {
      return html`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">Setup Issue</h3>
            ${this._error
              ? html`<p style="color: var(--danger, #ef4444); margin: 0 0 16px; font-size: 13px;">${this._error}</p>`
              : nothing}
            ${this._renderSteps()}
            <div style="display: flex; gap: 12px; margin-top: 20px;">
              <button
                style="
                  padding: 10px 24px;
                  background: var(--accent, #f59e0b);
                  color: var(--on-accent, #000);
                  border: none;
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                  font-size: 14px;
                "
                @click=${() => void this._quickSetup()}
              >Try Again</button>
              <button
                style="
                  padding: 10px 24px;
                  background: transparent;
                  color: var(--muted);
                  border: 1px solid var(--border, #333);
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 14px;
                "
                @click=${() => void this._checkStatus()}
              >Back</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    // ── Not configured: Setup Wizard ──
    return html`<div class="my-day-container">
      <div class="my-day-card">
        <div class="my-day-card-content" style="padding: 32px 24px;">
          <!-- Header -->
          <h3 style="margin: 0 0 8px; font-size: 20px;">Agent Team</h3>
          <p style="color: var(--muted); margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
            Paperclip orchestrates your AI agent team — multiple specialists working on complex tasks in parallel.
            Delegate work and get results delivered to your inbox.
          </p>

          <!-- Primary CTA: One-click setup -->
          ${this._serverUp && this._configured
            ? html`
              <!-- Server running + configured but not ready — just seed -->
              <button
                style="
                  width: 100%;
                  padding: 16px 24px;
                  background: var(--accent, #f59e0b);
                  color: var(--on-accent, #000);
                  border: none;
                  border-radius: 10px;
                  font-weight: 600;
                  font-size: 16px;
                  cursor: pointer;
                  margin-bottom: 12px;
                "
                @click=${() => void this._seedOnly()}
              >Seed Agent Team</button>
              <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                Server is running — this will create agents from your persona roster.
              </p>
            `
            : this._serverUp
              ? html`
                <!-- Server running but not configured — seed will also write env vars -->
                <button
                  style="
                    width: 100%;
                    padding: 16px 24px;
                    background: var(--accent, #f59e0b);
                    color: var(--on-accent, #000);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 12px;
                  "
                  @click=${() => void this._seedOnly()}
                >Connect & Seed Agents</button>
                <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                  Paperclip server detected on localhost:3100. Click to configure and seed agents.
                </p>
              `
              : html`
                <!-- No server — full setup -->
                <button
                  style="
                    width: 100%;
                    padding: 16px 24px;
                    background: var(--accent, #f59e0b);
                    color: var(--on-accent, #000);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 12px;
                  "
                  @click=${() => void this._quickSetup()}
                >Set Up Agent Team</button>
                <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                  Installs Paperclip locally, starts the server, and creates agents from your persona roster.
                </p>
              `
          }

          <!-- What you get -->
          <div style="
            background: var(--surface-2, rgba(255,255,255,0.03));
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 16px;
          ">
            <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; color: var(--text);">What you get:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--muted);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f465;</span>
                <span>Your persona roster becomes a team of AI agents</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4cb;</span>
                <span>Delegate complex tasks — agents work in parallel</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4e5;</span>
                <span>Results delivered to your inbox when complete</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4ca;</span>
                <span>Full dashboard to monitor agent activity</span>
              </div>
            </div>
          </div>

          <!-- Advanced: Connect to existing server -->
          <div style="border-top: 1px solid var(--border, #333); padding-top: 16px;">
            <button
              style="
                background: none;
                border: none;
                color: var(--muted);
                cursor: pointer;
                font-size: 13px;
                padding: 0;
                display: flex;
                align-items: center;
                gap: 6px;
              "
              @click=${() => { this._showAdvanced = !this._showAdvanced; }}
            >
              <span style="transform: rotate(${this._showAdvanced ? "90deg" : "0deg"}); transition: transform 0.15s; display: inline-block;">\u25B6</span>
              Connect to existing Paperclip server
            </button>

            ${this._showAdvanced ? html`
              <div style="margin-top: 12px; display: flex; gap: 8px;">
                <input
                  type="text"
                  placeholder="http://your-server:3100"
                  .value=${this._customUrl}
                  @input=${(e: Event) => { this._customUrl = (e.target as HTMLInputElement).value; }}
                  style="
                    flex: 1;
                    padding: 10px 14px;
                    background: var(--surface-2, #1a1a1a);
                    color: var(--text, #fff);
                    border: 1px solid var(--border, #333);
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                  "
                />
                <button
                  style="
                    padding: 10px 20px;
                    background: var(--surface-2, #2a2a2a);
                    color: var(--text);
                    border: 1px solid var(--border, #333);
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                  "
                  @click=${() => void this._connectExisting()}
                  ?disabled=${!this._customUrl.trim()}
                >Connect</button>
              </div>
            ` : nothing}
          </div>

          <!-- Previous check results -->
          ${this._steps.length > 0 ? html`
            <div style="margin-top: 16px; border-top: 1px solid var(--border, #333); padding-top: 12px;">
              <p style="margin: 0 0 8px; font-size: 12px; color: var(--muted);">Current status:</p>
              ${this._renderSteps()}
            </div>
          ` : nothing}
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gm-team": GmTeam;
  }
}
