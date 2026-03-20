/**
 * <gm-connections> — Connections tab component.
 *
 * Shows all data sources and third-party integrations in one place.
 * Pulls from secondBrain.sources (GodMode built-in + data-sources.json +
 * integration registry) and composio.status (Composio managed OAuth).
 * Provides quick actions: connect via Composio, configure via chat, or
 * open Composio dashboard.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import { formatAgo } from "../format.js";

// ── Types ────────────────────────────────────────────────────────────

interface SourceEntry {
  id: string;
  name: string;
  type: string;
  status: "connected" | "available";
  icon: string;
  description: string;
  stats?: string;
  lastSync?: string | null;
}

interface ComposioConnection {
  id: string;
  appName: string;
  status: string;
  authScheme: string;
}

type ConnectionFilter = "all" | "connected" | "available";

// ── Component ────────────────────────────────────────────────────────

@customElement("gm-connections")
export class GmConnections extends LitElement {
  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  @state() private _sources: SourceEntry[] = [];
  @state() private _composioConnections: ComposioConnection[] = [];
  @state() private _composioConfigured = false;
  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _filter: ConnectionFilter = "all";
  @state() private _connectingApp: string | null = null;

  private _unsubs: Array<() => void> = [];

  override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "connections") {
          void this._load();
        }
      }),
    );
    void this._load();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // ── Data Loading ──────────────────────────────────────────────────

  private async _load(): Promise<void> {
    this._loading = true;
    this._error = null;

    const client = this.ctx?.gateway;
    if (!client || !this.ctx.connected) {
      this._loading = false;
      this._error = "Not connected to gateway.";
      return;
    }

    try {
      const [sourcesResult, composioResult] = await Promise.allSettled([
        client.request<{ sources: SourceEntry[]; connectedCount: number; totalCount: number }>(
          "secondBrain.sources",
          {},
        ),
        client.request<{ configured: boolean; connections?: ComposioConnection[]; error?: string }>(
          "composio.status",
          {},
        ),
      ]);

      if (sourcesResult.status === "fulfilled") {
        this._sources = sourcesResult.value.sources ?? [];
      }
      if (composioResult.status === "fulfilled") {
        const c = composioResult.value;
        this._composioConfigured = c.configured ?? false;
        this._composioConnections = c.connections ?? [];
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._loading = false;
    }
  }

  // ── Composio Connect ──────────────────────────────────────────────

  private async _connectViaComposio(appName: string): Promise<void> {
    const client = this.ctx?.gateway;
    if (!client) return;

    this._connectingApp = appName;
    try {
      const result = await client.request<{ redirectUrl?: string; error?: string }>(
        "composio.connect",
        { appName },
      );
      if (result.redirectUrl) {
        window.open(result.redirectUrl, "_blank");
      } else if (result.error) {
        this.ctx.addToast(`Connection failed: ${result.error}`, "error");
      } else {
        this.ctx.addToast(`Connection initiated for ${appName}`, "info");
      }
    } catch (err) {
      this.ctx.addToast(`Error: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      this._connectingApp = null;
      // Refresh after a brief delay to pick up new connection
      setTimeout(() => void this._load(), 2000);
    }
  }

  // ── Ask Ally ──────────────────────────────────────────────────────

  private _askAllyToConnect(name: string): void {
    appEventBus.emit("chat-navigate", {
      tab: "chat" as import("../navigation.js").Tab,
      draft: `Help me set up the ${name} integration`,
    });
  }

  // ── Render ────────────────────────────────────────────────────────

  override render() {
    if (this._loading) {
      return html`
        <div class="connections-tab">
          <div class="connections-loading">
            <div class="spinner"></div>
            <span>Loading connections...</span>
          </div>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="connections-tab">
          <div class="connections-error">
            <span>${this._error}</span>
            <button class="btn btn--sm" @click=${() => void this._load()}>Retry</button>
          </div>
        </div>
      `;
    }

    // Merge Composio connections into source list — mark Composio ones
    const composioIds = new Set(this._composioConnections.map((c) => c.appName.toLowerCase()));
    const allSources = [...this._sources];

    // Add Composio connections that aren't already in sources
    for (const conn of this._composioConnections) {
      const normalized = conn.appName.toLowerCase();
      if (!allSources.some((s) => s.id.toLowerCase() === normalized || s.name.toLowerCase() === normalized)) {
        allSources.push({
          id: conn.appName,
          name: conn.appName.charAt(0).toUpperCase() + conn.appName.slice(1),
          type: "composio",
          status: conn.status === "active" ? "connected" : "available",
          icon: "\uD83D\uDD17",
          description: `Connected via Composio (${conn.authScheme})`,
        });
      }
    }

    const filtered =
      this._filter === "all"
        ? allSources
        : allSources.filter((s) => s.status === this._filter);

    const connectedCount = allSources.filter((s) => s.status === "connected").length;
    const totalCount = allSources.length;

    return html`
      <div class="connections-tab">
        <div class="connections-header">
          <div class="connections-header__left">
            <div class="connections-summary">
              <span class="connections-summary__count">${connectedCount}/${totalCount}</span>
              <span class="connections-summary__label">connected</span>
            </div>
          </div>
          <div class="connections-header__right">
            <div class="connections-filters">
              ${(["all", "connected", "available"] as ConnectionFilter[]).map(
                (f) => html`
                  <button
                    class="connections-filter-btn ${this._filter === f ? "active" : ""}"
                    @click=${() => (this._filter = f)}
                  >${f === "all" ? "All" : f === "connected" ? "Connected" : "Available"}</button>
                `,
              )}
            </div>
            <button class="btn btn--sm" @click=${() => void this._load()}>Refresh</button>
          </div>
        </div>

        ${this._composioConfigured
          ? html`<div class="connections-composio-badge">
              <span>\uD83D\uDD0C Composio active</span>
              <span class="connections-composio-badge__detail">${this._composioConnections.length} managed connections</span>
            </div>`
          : nothing}

        <div class="connections-grid">
          ${filtered.length === 0
            ? html`<div class="connections-empty">No ${this._filter === "all" ? "" : this._filter} connections found.</div>`
            : filtered.map((source) => this._renderSourceCard(source, composioIds))}
        </div>

        <div class="connections-footer">
          <button class="btn btn--ghost btn--sm" @click=${() => this._askAllyToConnect("a new service")}>
            Ask ally to connect a service...
          </button>
        </div>
      </div>
    `;
  }

  private _renderSourceCard(source: SourceEntry, composioIds: Set<string>) {
    const isConnected = source.status === "connected";
    const isComposio = composioIds.has(source.id.toLowerCase()) || source.type === "composio";
    const isConnecting = this._connectingApp === source.id;

    return html`
      <div class="connection-card ${isConnected ? "connection-card--connected" : "connection-card--available"}">
        <div class="connection-card__header">
          <span class="connection-card__icon">${source.icon}</span>
          <div class="connection-card__title">
            <span class="connection-card__name">${source.name}</span>
            <span class="connection-card__type">${source.type}</span>
          </div>
          <span class="connection-card__status ${isConnected ? "connected" : "available"}">
            ${isConnected ? "Connected" : "Available"}
          </span>
        </div>
        <div class="connection-card__body">
          <span class="connection-card__desc">${source.description}</span>
          ${source.stats ? html`<span class="connection-card__stats">${source.stats}</span>` : nothing}
          ${source.lastSync
            ? html`<span class="connection-card__sync">Last sync: ${formatAgo(new Date(source.lastSync))}</span>`
            : nothing}
        </div>
        ${!isConnected
          ? html`
              <div class="connection-card__actions">
                ${this._composioConfigured
                  ? html`<button
                      class="btn btn--sm btn--primary"
                      ?disabled=${isConnecting}
                      @click=${() => void this._connectViaComposio(source.id)}
                    >${isConnecting ? "Connecting..." : "Connect via Composio"}</button>`
                  : nothing}
                <button
                  class="btn btn--sm btn--ghost"
                  @click=${() => this._askAllyToConnect(source.name)}
                >Set up in chat</button>
              </div>
            `
          : isComposio
            ? html`<div class="connection-card__actions">
                <span class="connection-card__managed">Managed by Composio</span>
              </div>`
            : nothing}
      </div>
    `;
  }
}

// ── Tag Declaration ─────────────────────────────────────────────────

declare global {
  interface HTMLElementTagNameMap {
    "gm-connections": GmConnections;
  }
}
