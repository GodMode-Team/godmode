import { html, nothing } from "lit";

// ===== Feature Descriptors =====

type FeatureDescriptor = {
  key: string;
  icon: string;
  name: string;
  description: string;
  default: boolean;
};

const FEATURES: FeatureDescriptor[] = [
  {
    key: "focusPulse.enabled",
    icon: "\u2600\uFE0F",
    name: "Focus Pulse",
    description:
      "Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",
    default: true,
  },
];

// ===== Types =====

export type OptionsProps = {
  connected: boolean;
  loading?: boolean;
  options: Record<string, unknown> | null;
  onToggle: (key: string, value: unknown) => void;
  onRefresh: () => void;
  onOpenWizard?: () => void;
  setupHidden?: boolean;
  onRestoreSetup?: () => void;
};

// ===== Render =====

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

function renderFeatureCard(
  feature: FeatureDescriptor,
  options: Record<string, unknown> | null,
  onToggle: (key: string, value: unknown) => void,
) {
  const currentValue = options?.[feature.key] ?? feature.default;
  const isEnabled = Boolean(currentValue);

  return html`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${feature.icon}</span>
          <span class="options-card-name">${feature.name}</span>
        </div>
        ${renderToggle(isEnabled, () => onToggle(feature.key, !isEnabled))}
      </div>
      <div class="options-card-description">${feature.description}</div>
    </div>
  `;
}

export function renderOptions(props: OptionsProps) {
  const { connected, loading, options, onToggle, onOpenWizard, setupHidden, onRestoreSetup } = props;

  if (!connected) {
    return html`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `;
  }

  if (loading && !options) {
    return html`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `;
  }

  return html`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${FEATURES.map((feature) =>
          renderFeatureCard(feature, options, onToggle),
        )}
      </div>
      ${FEATURES.length === 0
        ? html`<div class="options-empty">
            No configurable features yet.
          </div>`
        : nothing}
      ${onOpenWizard
        ? html`
            <div class="options-wizard-section">
              <div class="options-card card">
                <div class="options-card-header">
                  <div class="options-card-info">
                    <span class="options-card-icon">Setup</span>
                    <span class="options-card-name">Memory Setup Wizard</span>
                  </div>
                  <button
                    class="options-wizard-btn"
                    @click=${onOpenWizard}
                  >Run Wizard</button>
                </div>
                <div class="options-card-description">
                  Set up your GodMode workspace from scratch. Generates AGENTS.md, memory files,
                  and patches your OC config with optimal settings. Takes about 5 minutes.
                </div>
              </div>
            </div>
          `
        : nothing}
      ${setupHidden && onRestoreSetup
        ? html`
            <div class="options-wizard-section">
              <div class="options-card card">
                <div class="options-card-header">
                  <div class="options-card-info">
                    <span class="options-card-icon">Setup</span>
                    <span class="options-card-name">Setup Tab</span>
                  </div>
                  <button
                    class="options-wizard-btn"
                    @click=${onRestoreSetup}
                  >Restore</button>
                </div>
                <div class="options-card-description">
                  Bring back the setup tab to continue onboarding.
                </div>
              </div>
            </div>
          `
        : nothing}
    </section>
  `;
}
