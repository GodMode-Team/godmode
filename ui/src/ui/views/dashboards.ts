/**
 * Dashboards view — gallery of custom data views + active dashboard renderer.
 *
 * Two modes:
 *   1. Gallery: grid of dashboard cards with create/delete/pin actions,
 *      category filter, template suggestions, and staleness indicators.
 *   2. Active: renders a single dashboard's HTML with back/refresh controls
 *      and an "Open in Chat" button.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { sanitizeDashboardHtml } from "../markdown.js";
import { formatAgo } from "../format.js";
import type { DashboardManifest } from "../controllers/dashboards.js";

// ── Types ────────────────────────────────────────────────────────────

export type DashboardTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
};

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
  onCreateViaChat: (prompt?: string) => void;
  onBack: () => void;
  onRefresh: () => void;
  onOpenSession: (dashboardId: string) => void;
  onTogglePin?: (id: string) => void;
  // Category filter
  categoryFilter?: string;
  onCategoryFilter?: (category: string) => void;
  // Templates
  templates?: DashboardTemplate[];
};

// ── Constants ────────────────────────────────────────────────────────

const CATEGORIES: Record<string, { icon: string; label: string }> = {
  all: { icon: "\uD83D\uDCCA", label: "All" },
  productivity: { icon: "\u{1F4CB}", label: "Productivity" },
  personal: { icon: "\u{1F9D1}", label: "Personal" },
  business: { icon: "\u{1F4BC}", label: "Business" },
  system: { icon: "\u{2699}\uFE0F", label: "System" },
  custom: { icon: "\u{2728}", label: "Custom" },
};

// Built-in template suggestions — only reference widget types with real data
const DEFAULT_TEMPLATE_IDEAS: DashboardTemplate[] = [
  {
    id: "weekly-impact",
    name: "Weekly Impact",
    category: "productivity",
    description: "Tasks completed, agent outcomes, and trust trends this week",
    prompt: "Create a weekly impact dashboard. Use these widgets: tasks-summary, queue-status, trust-scores, streak-stats, brief-summary. Show tasks completed vs created, agent queue throughput, trust score trends, and daily streak. Use clean CSS grid with bar charts.",
  },
  {
    id: "agent-activity",
    name: "Agent Activity",
    category: "system",
    description: "Queue pipeline, active personas, and trust scores",
    prompt: "Create an agent activity dashboard. Use these widgets: queue-status, trust-scores, agent-activity. Show queue stats (pending, processing, completed, failed), most active personas, and trust scores by workflow. Use CSS grid layout.",
  },
  {
    id: "morning-overview",
    name: "Morning Overview",
    category: "productivity",
    description: "Today's tasks, brief highlights, and queue status",
    prompt: "Create a morning overview dashboard. Use these widgets: tasks-summary, brief-summary, queue-status, streak-stats. Show today's priorities, daily brief highlights, pending queue items, and your current streak. Use clean CSS grid layout.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

function renderScopeBadge(scope: string) {
  if (scope === "global") {
    return html`<span class="dashboard-card-scope">Global</span>`;
  }
  return html`<span class="dashboard-card-scope">${scope}</span>`;
}

function isStale(updatedAt: string): boolean {
  const elapsed = Date.now() - new Date(updatedAt).getTime();
  return elapsed > 24 * 60 * 60 * 1000; // 24 hours
}

function inferCategory(dashboard: DashboardManifest): string {
  const title = (dashboard.title + " " + (dashboard.description ?? "")).toLowerCase();
  if (title.includes("health") || title.includes("sleep") || title.includes("oura") || title.includes("energy") || title.includes("goal")) return "personal";
  if (title.includes("agent") || title.includes("queue") || title.includes("trust") || title.includes("skill")) return "system";
  if (title.includes("revenue") || title.includes("business") || title.includes("content") || title.includes("metric")) return "business";
  if (title.includes("task") || title.includes("calendar") || title.includes("morning") || title.includes("impact") || title.includes("weekly")) return "productivity";
  return "custom";
}

// ── Template Card ────────────────────────────────────────────────────

function renderTemplateCard(
  template: DashboardTemplate,
  onCreateViaChat: (prompt?: string) => void,
) {
  const catInfo = CATEGORIES[template.category] ?? CATEGORIES.custom;
  return html`
    <div class="dashboard-card dashboard-card--template">
      <button
        class="dashboard-card-main"
        @click=${() => onCreateViaChat(template.prompt)}
      >
        <div class="dashboard-card-title">${template.name}</div>
        <div class="dashboard-card-desc">${template.description}</div>
        <div class="dashboard-card-meta">
          <span class="dashboard-card-scope">${catInfo.icon} ${catInfo.label}</span>
          <span class="dashboard-card-template-label">Template</span>
        </div>
      </button>
    </div>
  `;
}

// ── Dashboard Card ───────────────────────────────────────────────────

function renderDashboardCard(
  dashboard: DashboardManifest,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void,
  onTogglePin?: (id: string) => void,
) {
  const stale = isStale(dashboard.updatedAt);

  return html`
    <div class="dashboard-card ${dashboard.pinned ? "dashboard-card--pinned" : ""}">
      <button
        class="dashboard-card-main"
        @click=${() => onSelect(dashboard.id)}
      >
        <div class="dashboard-card-title">
          ${dashboard.pinned ? html`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>` : nothing}
          ${dashboard.title}
        </div>
        ${dashboard.description
          ? html`<div class="dashboard-card-desc">${dashboard.description}</div>`
          : nothing}
        <div class="dashboard-card-meta">
          ${renderScopeBadge(dashboard.scope)}
          <span>${formatAgo(new Date(dashboard.updatedAt).getTime())}</span>
          ${stale ? html`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>` : nothing}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${onTogglePin
          ? html`<button
              class="dashboard-card-pin"
              title="${dashboard.pinned ? "Unpin" : "Pin"}"
              @click=${(e: Event) => { e.stopPropagation(); onTogglePin(dashboard.id); }}
            >${dashboard.pinned ? "\u{1F4CC}" : "\u{1F4C5}"}</button>`
          : nothing}
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
    </div>
  `;
}

// ── Active Dashboard View ────────────────────────────────────────────

function renderActiveDashboard(props: DashboardsProps) {
  const { activeDashboardHtml, activeDashboardManifest, isWorking } = props;
  if (!activeDashboardHtml || !activeDashboardManifest) return nothing;

  const stale = isStale(activeDashboardManifest.updatedAt);

  return html`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${() => props.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${activeDashboardManifest.title}</span>
          <span class="dashboards-active-meta">
            ${formatAgo(new Date(activeDashboardManifest.updatedAt).getTime())}
            ${stale ? html` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>` : nothing}
          </span>
        </div>
        <button
          class="dashboards-session-btn"
          @click=${() => props.onOpenSession(activeDashboardManifest.id)}
        >${isWorking ? "Working..." : "Edit in Chat"}</button>
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

// ── Category Filter Bar ──────────────────────────────────────────────

function renderCategoryFilter(
  activeCategory: string,
  dashboards: DashboardManifest[],
  onCategoryFilter: (category: string) => void,
) {
  // Count dashboards per category
  const counts: Record<string, number> = { all: dashboards.length };
  for (const d of dashboards) {
    const cat = inferCategory(d);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  return html`
    <div class="dashboards-category-bar">
      ${Object.entries(CATEGORIES).map(([key, info]) => html`
        <button
          class="dashboards-category-btn ${activeCategory === key ? "active" : ""}"
          @click=${() => onCategoryFilter(key)}
        >
          ${info.icon} ${info.label}
          ${counts[key] ? html`<span class="category-count">${counts[key]}</span>` : nothing}
        </button>
      `)}
    </div>
  `;
}

// ── Gallery View ─────────────────────────────────────────────────────

function renderGallery(props: DashboardsProps) {
  const { loading, dashboards } = props;
  const categoryFilter = props.categoryFilter ?? "all";
  const templates = props.templates ?? DEFAULT_TEMPLATE_IDEAS;

  // Filter dashboards by category
  const filteredDashboards = categoryFilter === "all"
    ? (dashboards ?? [])
    : (dashboards ?? []).filter(d => inferCategory(d) === categoryFilter);

  // Sort: pinned first, then by updatedAt desc
  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Filter templates by category
  const filteredTemplates = categoryFilter === "all"
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  const hasDashboards = (dashboards ?? []).length > 0;

  return html`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(dashboards ?? []).length} dashboard${(dashboards ?? []).length === 1 ? "" : "s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${() => props.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${hasDashboards && props.onCategoryFilter
        ? renderCategoryFilter(categoryFilter, dashboards ?? [], props.onCategoryFilter)
        : nothing}

      ${loading
        ? html`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`
        : sortedDashboards.length === 0 && !hasDashboards
          ? html`
              <div class="dashboards-empty">
                <div class="dashboards-empty-icon">&#128202;</div>
                <div class="dashboards-empty-title">No dashboards yet</div>
                <div class="dashboards-empty-hint">
                  Dashboards are AI-generated views your ally builds for you.
                  Pick a template below or describe what you want to see.
                </div>
              </div>
              <div class="dashboards-templates-section">
                <h3 class="dashboards-section-title">Start from a template</h3>
                <div class="dashboards-grid">
                  ${templates.map(t => renderTemplateCard(t, props.onCreateViaChat))}
                </div>
              </div>
            `
          : html`
              <div class="dashboards-grid">
                ${sortedDashboards.map((d) =>
                  renderDashboardCard(
                    d,
                    props.onSelectDashboard,
                    props.onDeleteDashboard,
                    props.onTogglePin,
                  ),
                )}
              </div>
              ${filteredTemplates.length > 0 ? html`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${filteredTemplates.map(t => renderTemplateCard(t, props.onCreateViaChat))}
                  </div>
                </div>
              ` : nothing}
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
          <span class="error-icon">\u26A0</span>
          <p>${props.error}</p>
          <button class="retry-button" @click=${() => props.onRefresh()}>Retry</button>
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
