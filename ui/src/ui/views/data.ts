import { html, nothing } from "lit";

// ===== Types =====

export type DataSource = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "pending" | "disconnected";
  skill: string | null;
  lastSync?: string;
};

export type DataTabProps = {
  connected: boolean;
  sources: DataSource[];
  loading?: boolean;
  error?: string | null;
  subtab: "dashboard" | "sources";
  onRefresh?: () => void;
  onSubtabChange?: (subtab: "dashboard" | "sources") => void;
  onConnectSource?: (sourceId: string) => void;
  onQuerySubmit?: (query: string) => void;
};

// ===== Constants =====

const TYPE_ICONS: Record<string, string> = {
  health: "\u2764\uFE0F",
  calendar: "\uD83D\uDCC5",
  tasks: "\u2705",
  email: "\uD83D\uDCE7",
  meetings: "\uD83C\uDFA4",
  environment: "\uD83C\uDF24\uFE0F",
};

const STATUS_COLORS: Record<DataSource["status"], string> = {
  connected: "#10b981",
  pending: "#f59e0b",
  disconnected: "#ef4444",
};

const STATUS_LABELS: Record<DataSource["status"], string> = {
  connected: "Connected",
  pending: "Pending",
  disconnected: "Disconnected",
};

// ===== Helper Functions =====

function getTypeIcon(type: string): string {
  return TYPE_ICONS[type.toLowerCase()] ?? "\uD83D\uDD17";
}

function formatLastSync(dateStr?: string): string {
  if (!dateStr) {
    return "Never";
  }
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ===== Render Functions =====

function renderSourceCard(source: DataSource, onConnect?: (sourceId: string) => void) {
  const statusColor = STATUS_COLORS[source.status];

  return html`
    <div class="my-day-card data-source-card">
      <div class="data-source-header">
        <span class="data-source-icon">${getTypeIcon(source.type)}</span>
        <div class="data-source-info">
          <div class="data-source-name">${source.name}</div>
          <span class="data-source-type-badge">${source.type}</span>
        </div>
        <div class="data-source-status" title="${STATUS_LABELS[source.status]}">
          <span
            class="data-source-status-dot"
            style="background: ${statusColor};"
          ></span>
          <span class="data-source-status-label">${STATUS_LABELS[source.status]}</span>
        </div>
      </div>
      <div class="data-source-body">
        ${
          source.skill
            ? html`<div class="data-source-skill">
              <span class="data-source-detail-label">Skill:</span>
              <span class="data-source-detail-value">${source.skill}</span>
            </div>`
            : nothing
        }
        <div class="data-source-sync">
          <span class="data-source-detail-label">Last sync:</span>
          <span class="data-source-detail-value">${formatLastSync(source.lastSync)}</span>
        </div>
      </div>
      ${
        source.status === "pending" && onConnect
          ? html`
            <div class="data-source-actions">
              <button
                class="data-source-connect-btn"
                @click=${() => onConnect(source.id)}
              >
                Connect
              </button>
            </div>
          `
          : nothing
      }
    </div>
  `;
}

function renderSources(sources: DataSource[], onConnect?: (sourceId: string) => void) {
  if (sources.length === 0) {
    return html`
      <div class="my-day-card">
        <div class="my-day-card-content">
          <div class="my-day-empty">
            No data sources configured. Chat to connect your first integration.
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <div class="data-sources-grid">
      ${sources.map((source) => renderSourceCard(source, onConnect))}
    </div>
  `;
}

function renderDashboard(onQuerySubmit?: (query: string) => void) {
  return html`
    <div class="data-dashboard-section">
      <div class="data-dashboard-prompt">What do you want to know?</div>
      <div class="data-dashboard-hint">
        Ask questions about your connected data in chat.
        Dashboards and visualizations are generated on demand.
      </div>
      ${
        onQuerySubmit
          ? html`
            <button
              class="data-dashboard-btn"
              @click=${() => onQuerySubmit("Query my connected data")}
            >
              Open Data Chat
            </button>
          `
          : nothing
      }
    </div>
  `;
}

// ===== Main Render Function =====

export function renderDataTab(props: DataTabProps) {
  if (props.loading) {
    return html`
      <div class="my-day-container" style="overflow-y: auto">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading data sources...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="my-day-container" style="overflow-y: auto;">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${props.error}</span>
          ${
            props.onRefresh
              ? html`<button class="retry-button" @click=${props.onRefresh}>Retry</button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  const connectedCount = props.sources.filter((s) => s.status === "connected").length;

  return html`
    <div class="my-day-container" style="overflow-y: auto;">
      <!-- Header -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Data</h1>
          <p class="my-day-subtitle">Explore your data and manage integrations.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${connectedCount}</span>
            <span class="summary-label">Connected</span>
          </div>
          <div class="my-day-summary-divider"></div>
          <div class="my-day-summary-stat">
            <span class="summary-value">${props.sources.length}</span>
            <span class="summary-label">Total</span>
          </div>
          ${
            props.onRefresh
              ? html`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh">↻</button>
              `
              : nothing
          }
        </div>
      </div>

      <!-- Subtab navigation: Dashboard first, Sources second -->
      <div class="config-subnav">
        <button
          class="config-subnav__item ${props.subtab === "dashboard" ? "active" : ""}"
          @click=${() => props.onSubtabChange?.("dashboard")}
        >
          Dashboard
        </button>
        <button
          class="config-subnav__item ${props.subtab === "sources" ? "active" : ""}"
          @click=${() => props.onSubtabChange?.("sources")}
        >
          Sources
        </button>
      </div>

      <!-- Content -->
      <div style="padding: 0 24px 24px;">
        ${
          props.subtab === "dashboard"
            ? renderDashboard(props.onQuerySubmit)
            : renderSources(props.sources, props.onConnectSource)
        }
      </div>
    </div>
  `;
}
