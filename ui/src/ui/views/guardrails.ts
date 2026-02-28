import { html, nothing } from "lit";
import type {
  GuardrailGateView,
  GuardrailActivityView,
  GuardrailsViewData,
} from "../controllers/guardrails";

// ===== Types =====

export type GuardrailsProps = {
  connected: boolean;
  loading?: boolean;
  data: GuardrailsViewData | null;
  onToggle: (gateId: string, enabled: boolean) => void;
  onThresholdChange: (gateId: string, key: string, value: number) => void;
  onRefresh: () => void;
};

// ===== Helpers =====

function relativeTime(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function actionBadgeClass(action: GuardrailActivityView["action"]): string {
  const map: Record<string, string> = {
    fired: "guardrails-badge--fired",
    blocked: "guardrails-badge--blocked",
    cleaned: "guardrails-badge--cleaned",
  };
  return map[action] ?? "";
}

// ===== Sub-renders =====

function renderToggle(checked: boolean, onChange: () => void) {
  return html`
    <button
      class="options-toggle ${checked ? "options-toggle--on" : ""}"
      role="switch"
      aria-checked="${checked}"
      @click=${onChange}
    >
      <span class="options-toggle-track">
        <span class="options-toggle-thumb"></span>
      </span>
    </button>
  `;
}

function renderThresholdInput(
  gate: GuardrailGateView,
  key: string,
  label: string,
  onThresholdChange: (gateId: string, key: string, value: number) => void,
) {
  const currentValue = gate.thresholds?.[key] ?? 0;
  return html`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${label}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(currentValue)}
        ?disabled=${!gate.enabled}
        @change=${(e: Event) => {
          const val = Number((e.target as HTMLInputElement).value);
          if (!Number.isNaN(val) && val > 0) {
            onThresholdChange(gate.id, key, val);
          }
        }}
      />
    </div>
  `;
}

function renderGateCard(
  gate: GuardrailGateView,
  onToggle: (gateId: string, enabled: boolean) => void,
  onThresholdChange: (gateId: string, key: string, value: number) => void,
) {
  const thresholdKeys = gate.thresholdLabels ? Object.keys(gate.thresholdLabels) : [];

  return html`
    <div class="guardrails-card card ${gate.enabled ? "" : "guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${gate.icon}</span>
          <span class="guardrails-card-name">${gate.name}</span>
          <span class="guardrails-card-hook">${gate.hook}</span>
        </div>
        ${renderToggle(gate.enabled, () => onToggle(gate.id, !gate.enabled))}
      </div>
      <div class="guardrails-card-description">${gate.description}</div>
      ${thresholdKeys.length > 0
        ? html`
            <div class="guardrails-thresholds">
              ${thresholdKeys.map((key) =>
                renderThresholdInput(gate, key, gate.thresholdLabels![key], onThresholdChange),
              )}
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderActivityRow(entry: GuardrailActivityView) {
  return html`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${actionBadgeClass(entry.action)}">${entry.action}</span>
      <span class="guardrails-activity-gate">${entry.gateId}</span>
      <span class="guardrails-activity-detail">${entry.detail}</span>
      <span class="guardrails-activity-time">${relativeTime(entry.timestamp)}</span>
    </div>
  `;
}

// ===== Main Render =====

export function renderGuardrails(props: GuardrailsProps) {
  const { connected, loading, data, onToggle, onThresholdChange, onRefresh } = props;

  if (!connected) {
    return html`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;
  }

  if (loading && !data) {
    return html`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;
  }

  const gates = data?.gates ?? [];
  const activity = data?.activity ?? [];
  const enabledCount = gates.filter((g) => g.enabled).length;

  return html`
    <section class="tab-body guardrails-section">
      <div class="guardrails-summary">
        <span class="guardrails-summary-count">${enabledCount}/${gates.length}</span>
        <span class="guardrails-summary-label">gates active</span>
      </div>

      <div class="guardrails-grid">
        ${gates.map((gate) => renderGateCard(gate, onToggle, onThresholdChange))}
      </div>

      ${activity.length > 0
        ? html`
            <div class="guardrails-history">
              <h3 class="guardrails-history-title">Recent Activity</h3>
              <div class="guardrails-history-list">
                ${activity.slice(0, 30).map(renderActivityRow)}
              </div>
            </div>
          `
        : html`
            <div class="guardrails-history">
              <div class="guardrails-no-activity">No gate activity recorded yet.</div>
            </div>
          `}
    </section>
  `;
}
