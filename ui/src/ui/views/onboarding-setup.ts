/**
 * onboarding-setup.ts — Persistent onboarding view with integration setup.
 *
 * Two sections:
 *   1. Core Setup — 6 essential integrations for the 80/20 experience
 *   2. Deep Setup — optional extras (health, weather, sync, training data)
 *
 * Each integration is a card with status, setup instructions, and test button.
 * Everything is skippable.
 */

import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { Tab } from "../navigation.js";

// ── Types ──────────────────────────────────────────────────────────────

type IntegrationStatus = {
  configured: boolean;
  cliInstalled: boolean;
  authenticated: boolean;
  working: boolean;
  error?: string;
  details?: string;
};

type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  briefSection: string | null;
  tier: "core" | "deep";
  status: IntegrationStatus;
  hasEnvVars: boolean;
  cliDeps: string[];
};

type SetupGuide = {
  integrationId: string;
  name: string;
  description: string;
  platform: string;
  steps: string;
  envVars: Array<{
    key: string;
    label: string;
    description: string;
    secret: boolean;
  }>;
  cliDeps: string[];
};

type TestResult = {
  success: boolean;
  message: string;
};

export type OnboardingSetupProps = {
  connected: boolean;
  integrations: IntegrationItem[] | null;
  coreProgress: { connected: number; total: number } | null;
  expandedCard: string | null;
  loadingGuide: string | null;
  activeGuide: SetupGuide | null;
  testingId: string | null;
  testResult: { id: string; result: TestResult } | null;
  configValues: Record<string, string>;
  onLoadIntegrations: () => void;
  onExpandCard: (id: string | null) => void;
  onLoadGuide: (id: string) => void;
  onTestIntegration: (id: string) => void;
  onConfigureIntegration: (id: string, values: Record<string, string>) => void;
  onUpdateConfigValue: (key: string, value: string) => void;
  onSkipIntegration: (id: string) => void;
  onNavigate: (tab: Tab) => void;
  onMarkComplete?: () => void;
  onOpenSupportChat?: () => void;
};

// ── Render ─────────────────────────────────────────────────────────────

export function renderOnboardingSetup(props: OnboardingSetupProps): TemplateResult {
  const {
    connected,
    integrations,
    coreProgress,
    expandedCard,
    activeGuide,
    loadingGuide,
    testingId,
    testResult,
    configValues,
  } = props;

  if (!connected) {
    return html`
      <div class="view-container onboarding-setup">
        <div class="empty-state">
          <p>Connecting to gateway...</p>
        </div>
      </div>
    `;
  }

  // Auto-load integrations on first render
  if (!integrations) {
    setTimeout(() => props.onLoadIntegrations(), 0);
    return html`
      <div class="view-container onboarding-setup">
        <div class="empty-state">
          <p>Loading integrations...</p>
        </div>
      </div>
    `;
  }

  const core = integrations.filter(i => i.tier === "core");
  const deep = integrations.filter(i => i.tier === "deep");
  const allCoreDone = coreProgress != null && coreProgress.connected >= coreProgress.total;

  return html`
    <div class="view-container onboarding-setup">
      <div class="onboarding-header">
        <div class="onboarding-header__text">
          <h2>Connect Your World</h2>
          <p class="section-subtitle">Set up the integrations that power your daily brief and agent features. Everything is skippable.</p>
        </div>
        ${props.onOpenSupportChat
          ? html`<button class="btn btn--ghost onboarding-help-btn" @click=${() => props.onOpenSupportChat!()}>Need help? Chat with support</button>`
          : nothing}
      </div>

      ${allCoreDone
        ? html`
            <div class="onboarding-complete">
              <div class="onboarding-complete__icon">&#x2705;</div>
              <div class="onboarding-complete__text">
                <h3>Core integrations connected</h3>
                <p>Your daily brief, remote access, and coding tools are ready. Set up the optional extras below, or start using GodMode.</p>
              </div>
              ${props.onMarkComplete
                ? html`<button class="btn btn--primary onboarding-complete__cta" @click=${() => props.onMarkComplete!()}>Start Using GodMode</button>`
                : nothing}
            </div>
          `
        : nothing}

      <div class="onboarding-columns">
        <div class="onboarding-column onboarding-column--core">
          <div class="onboarding-section">
            <h3>Core Setup</h3>
            <p class="section-subtitle">These power your daily brief, remote access, and coding tools.</p>
            ${coreProgress
              ? html`
                  <div class="onboarding-progress">
                    <div class="progress-bar">
                      <div class="progress-bar__fill" style="width: ${Math.round((coreProgress.connected / coreProgress.total) * 100)}%"></div>
                    </div>
                    <span class="progress-label">${coreProgress.connected} of ${coreProgress.total} core integrations set up</span>
                  </div>
                `
              : nothing}
            <div class="integration-cards">
              ${core.map(i => renderIntegrationCard(i, props))}
            </div>
          </div>
        </div>

        ${deep.length > 0
          ? html`
              <div class="onboarding-column onboarding-column--deep">
                <div class="onboarding-section">
                  <h3>Deep Setup</h3>
                  <p class="section-subtitle">Optional extras — health tracking, weather, cloud sync.</p>
                  <div class="integration-cards">
                    ${deep.map(i => renderIntegrationCard(i, props))}
                  </div>
                </div>
              </div>
            `
          : nothing}
      </div>
    </div>
  `;
}

function renderIntegrationCard(item: IntegrationItem, props: OnboardingSetupProps): TemplateResult {
  const { expandedCard, activeGuide, loadingGuide, testingId, testResult, configValues } = props;
  const isExpanded = expandedCard === item.id;
  const isConnected = item.status.working || item.status.configured;
  const isTesting = testingId === item.id;
  const hasTestResult = testResult?.id === item.id;
  const isMessaging = item.id === "messaging-channel";

  return html`
    <div class="integration-card ${isConnected ? "integration-card--connected" : ""} ${isExpanded ? "integration-card--expanded" : ""}">
      <div class="integration-card__header" @click=${() => props.onExpandCard(isExpanded ? null : item.id)}>
        <span class="integration-card__chevron ${isExpanded ? "integration-card__chevron--open" : ""}">&#x25B8;</span>
        <div class="integration-card__info">
          <span class="integration-card__name">${item.name}</span>
          <span class="integration-card__desc">${item.description}</span>
          ${item.briefSection ? html`<span class="integration-card__powers">Powers: ${item.briefSection}</span>` : nothing}
        </div>
        <div class="integration-card__status">
          ${isConnected
            ? html`<span class="status-badge status-badge--connected">Connected</span>`
            : html`<span class="status-badge status-badge--available">Not Set Up</span>`}
        </div>
      </div>

      ${isExpanded
        ? html`
            <div class="integration-card__body">
              ${isMessaging
                ? html`
                    <div class="integration-guide">
                      <p>GodMode uses OpenClaw's built-in messaging channels.</p>
                      <button class="btn btn--secondary" @click=${() => props.onNavigate("channels" as Tab)}>
                        Go to Channels
                      </button>
                    </div>
                  `
                : html`
                    ${!activeGuide || activeGuide.integrationId !== item.id
                      ? html`
                          <button class="btn btn--secondary" @click=${() => props.onLoadGuide(item.id)}
                            ?disabled=${loadingGuide === item.id}>
                            ${loadingGuide === item.id ? "Loading..." : "Show Setup Instructions"}
                          </button>
                        `
                      : html`
                          <div class="integration-guide">
                            <div class="guide-steps">${renderMarkdownish(activeGuide.steps)}</div>

                            ${activeGuide.envVars.length > 0
                              ? html`
                                  <div class="guide-inputs">
                                    ${activeGuide.envVars.map(
                                      (v) => html`
                                        <label class="input-group">
                                          <span class="input-label">${v.label}</span>
                                          <span class="input-desc">${v.description}</span>
                                          <input
                                            class="input-field"
                                            type="${v.secret ? "password" : "text"}"
                                            placeholder="${v.label}"
                                            .value=${configValues[v.key] ?? ""}
                                            @input=${(e: Event) => {
                                              const val = (e.target as HTMLInputElement).value;
                                              props.onUpdateConfigValue(v.key, val);
                                            }}
                                          />
                                        </label>
                                      `,
                                    )}
                                    <div class="guide-actions">
                                      <button
                                        class="btn btn--primary"
                                        @click=${() => {
                                          const values: Record<string, string> = {};
                                          for (const v of activeGuide!.envVars) {
                                            const val = configValues[v.key];
                                            if (val) values[v.key] = val;
                                          }
                                          props.onConfigureIntegration(item.id, values);
                                        }}
                                      >
                                        Save & Test
                                      </button>
                                      <button class="btn btn--ghost" @click=${() => props.onSkipIntegration(item.id)}>
                                        Skip
                                      </button>
                                    </div>
                                  </div>
                                `
                              : html`
                                  <div class="guide-actions">
                                    <button
                                      class="btn btn--primary"
                                      @click=${() => props.onTestIntegration(item.id)}
                                      ?disabled=${isTesting}
                                    >
                                      ${isTesting ? "Testing..." : "Test Connection"}
                                    </button>
                                    <button class="btn btn--ghost" @click=${() => props.onSkipIntegration(item.id)}>
                                      Skip
                                    </button>
                                  </div>
                                `}
                          </div>
                        `}
                  `}

              ${hasTestResult
                ? html`
                    <div class="test-result ${testResult!.result.success ? "test-result--success" : "test-result--error"}">
                      ${testResult!.result.success ? "\u2705" : "\u274C"} ${testResult!.result.message}
                    </div>
                  `
                : nothing}

              ${item.status.details
                ? html`<div class="integration-details">${item.status.details}</div>`
                : nothing}
            </div>
          `
        : nothing}
    </div>
  `;
}

/** Minimal markdown-to-HTML for setup instructions. */
function renderMarkdownish(text: string): TemplateResult {
  const lines = text.split("\n");
  const parts: TemplateResult[] = [];
  for (const line of lines) {
    if (line.startsWith("```")) continue; // skip code fences
    if (line.match(/^\d+\./)) {
      parts.push(html`<p class="guide-step">${renderInlineMarkdown(line)}</p>`);
    } else if (line.trim()) {
      parts.push(html`<p>${renderInlineMarkdown(line)}</p>`);
    }
  }
  return html`${parts}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderInlineMarkdown(text: string): TemplateResult | string {
  // Escape user input first to prevent XSS, then apply markdown transforms
  let result = escapeHtml(text);
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    // Block dangerous URL schemes
    const scheme = url.trim().toLowerCase();
    if (scheme.startsWith("javascript:") || scheme.startsWith("data:") || scheme.startsWith("vbscript:")) {
      return text; // Render as plain text, discard the link
    }
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  });
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html`<span>${unsafeHTML(result)}</span>`;
}
