/**
 * Dashboards view — gallery of custom data views + active dashboard renderer.
 *
 * Two modes:
 *   1. Gallery: grid of dashboard cards with create/delete actions.
 *   2. Active: renders a single dashboard's HTML with back/refresh controls
 *      and an "Open in Chat" button. Chat is handled by the side-panel Ally.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { sanitizeDashboardHtml } from "../markdown.js";
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
