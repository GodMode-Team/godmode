import { html, nothing } from "lit";
import type {
  GuardrailGateView,
  GuardrailActivityView,
  GuardrailsViewData,
  CustomGuardrailView,
  AddCustomGuardrailInput,
} from "../controllers/guardrails";

// ===== Types =====

export type GuardrailsProps = {
  connected: boolean;
  loading?: boolean;
  data: GuardrailsViewData | null;
  showAddForm: boolean;
  onToggle: (gateId: string, enabled: boolean) => void;
  onThresholdChange: (gateId: string, key: string, value: number) => void;
  onRefresh: () => void;
  onCustomToggle: (id: string, enabled: boolean) => void;
  onCustomDelete: (id: string) => void;
  onCustomAdd: (input: AddCustomGuardrailInput) => void;
  onToggleAddForm: () => void;
  onOpenAllyChat?: (prefill?: string) => void;
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

function renderCustomCard(
  rule: CustomGuardrailView,
  onToggle: (id: string, enabled: boolean) => void,
  onDelete: (id: string) => void,
) {
  const actionIcon = rule.action === "redirect" ? "\u{21AA}" : "\u{1F6AB}";
  const actionLabel = rule.action === "redirect" ? "redirect" : "block";

  return html`
    <div class="guardrails-card card guardrails-custom-card ${rule.enabled ? "" : "guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${actionIcon}</span>
          <span class="guardrails-card-name">${rule.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${actionLabel}">${actionLabel}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${renderToggle(rule.enabled, () => onToggle(rule.id, !rule.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${() => onDelete(rule.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${rule.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${rule.trigger.tool}</span>
        ${rule.trigger.patterns.map(
          (p) => html`<span class="guardrails-pattern-tag">${p}</span>`,
        )}
      </div>
    </div>
  `;
}

function renderAddForm(
  onSubmit: (input: AddCustomGuardrailInput) => void,
  onCancel: () => void,
) {
  return html`
    <div class="guardrails-add-form card">
      <h4 class="guardrails-add-form-title">New Custom Rule</h4>
      <div class="guardrails-add-form-fields">
        <div class="guardrails-add-form-row">
          <label>Name</label>
          <input type="text" class="guardrails-add-input" id="gr-add-name" placeholder="e.g. Block npm audit" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Tool to match</label>
          <input type="text" class="guardrails-add-input" id="gr-add-tool" placeholder="e.g. Bash, web_fetch" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Patterns (comma-separated)</label>
          <input type="text" class="guardrails-add-input" id="gr-add-patterns" placeholder="e.g. npm audit, npx audit" />
        </div>
        <div class="guardrails-add-form-row">
          <label>Action</label>
          <select class="guardrails-add-input" id="gr-add-action">
            <option value="block">Block</option>
            <option value="redirect">Redirect</option>
          </select>
        </div>
        <div class="guardrails-add-form-row">
          <label>Message / instruction</label>
          <textarea class="guardrails-add-input guardrails-add-textarea" id="gr-add-message" placeholder="What should the agent do instead?" rows="2"></textarea>
        </div>
      </div>
      <div class="guardrails-add-form-actions">
        <button class="guardrails-add-cancel" @click=${onCancel}>Cancel</button>
        <button class="guardrails-add-submit" @click=${() => {
          const root = document.querySelector("godmode-app")?.shadowRoot;
          if (!root) return;
          const name = (root.querySelector("#gr-add-name") as HTMLInputElement)?.value.trim();
          const tool = (root.querySelector("#gr-add-tool") as HTMLInputElement)?.value.trim();
          const patternsRaw = (root.querySelector("#gr-add-patterns") as HTMLInputElement)?.value.trim();
          const action = (root.querySelector("#gr-add-action") as HTMLSelectElement)?.value as "block" | "redirect";
          const message = (root.querySelector("#gr-add-message") as HTMLTextAreaElement)?.value.trim();
          if (!name || !tool || !patternsRaw || !message) return;
          const patterns = patternsRaw.split(",").map((s) => s.trim()).filter(Boolean);
          if (patterns.length === 0) return;
          onSubmit({ name, tool, patterns, action, message });
        }}>Create Rule</button>
      </div>
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
  const { connected, loading, data, showAddForm, onToggle, onThresholdChange, onCustomToggle, onCustomDelete, onCustomAdd, onToggleAddForm, onOpenAllyChat } = props;

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
  const custom = data?.custom ?? [];
  const enabledCount = gates.filter((g) => g.enabled).length;
  const customEnabledCount = custom.filter((c) => c.enabled).length;

  const summaryParts = [`${enabledCount}/${gates.length} gates active`];
  if (custom.length > 0) {
    summaryParts.push(`${customEnabledCount} custom rule${custom.length === 1 ? "" : "s"}`);
  }

  return html`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${enabledCount}/${gates.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${gates.map((gate) => renderGateCard(gate, onToggle, onThresholdChange))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${custom.length > 0 ? ` (${customEnabledCount} active)` : ""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${() => {
                if (onOpenAllyChat) {
                  onOpenAllyChat("Create a new guardrail rule: ");
                } else {
                  onToggleAddForm();
                }
              }}>+ Add Rule</button>
            </div>

            ${custom.length > 0
              ? html`
                  <div class="guardrails-custom-grid">
                    ${custom.map((rule) => renderCustomCard(rule, onCustomToggle, onCustomDelete))}
                  </div>
                `
              : html`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${activity.length > 0
              ? html`
                  <div class="guardrails-history-list">
                    ${activity.slice(0, 30).map(renderActivityRow)}
                  </div>
                `
              : html`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `;
}
