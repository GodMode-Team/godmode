/**
 * Setup tab view — 80/20 fast onboarding.
 *
 * Section 1: Quick Start form (name + license key + daily intel topics)
 * Section 2: Progressive checklist for deeper setup tasks
 */
import { html, nothing } from "lit";
import type { Tab } from "../navigation.js";

// ── Types ───────────────────────────────────────────────────────

/** Capability card for the progress tracker */
type CapabilityCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "active" | "available" | "coming-soon";
  detail?: string;
  action?: string; // button label
};

type CapabilitiesData = {
  capabilities: CapabilityCard[];
  percentComplete: number;
};

export type SetupViewProps = {
  connected: boolean;
  quickSetupDone: boolean;
  capabilities: CapabilitiesData | null;
  capabilitiesLoading: boolean;
  onQuickSetup: (name: string) => void;
  onHideSetup: () => void;
  onOpenWizard: () => void;
  onNavigate: (tab: Tab) => void;
  onRunAssessment: () => void;
  onOpenSupportChat: () => void;
  onCapabilityAction: (id: string) => void;
};

// ── Quick Start Form ────────────────────────────────────────────

function renderQuickStart(props: SetupViewProps) {
  let submitting = false;

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? "";

    if (!name) {
      const nameInput = form.querySelector('[name="name"]') as HTMLInputElement;
      nameInput?.focus();
      return;
    }

    submitting = true;
    props.onQuickSetup(name);
  }

  return html`
    <div class="setup-quick">
      <div class="setup-quick__header">
        <span class="setup-quick__icon">\u26A1</span>
        <h2 class="setup-quick__title">Welcome to GodMode</h2>
        <p class="setup-quick__subtitle">Tell us your name and start chatting with your AI ally.</p>
      </div>

      <form class="setup-quick__form" @submit=${handleSubmit}>
        <div class="setup-field">
          <label class="setup-label" for="setup-name">Your name</label>
          <input
            class="setup-input"
            type="text"
            id="setup-name"
            name="name"
            placeholder="What should your AI call you?"
            required
            autocomplete="name"
          />
        </div>

        <button class="setup-submit" type="submit">
          Start Using GodMode
        </button>
      </form>
    </div>
  `;
}

// ── Progress Ring ────────────────────────────────────────────────

function progressLabel(pct: number): string {
  if (pct >= 100) return "GodMode fully loaded";
  if (pct >= 75) return "Your ally is learning...";
  if (pct >= 50) return "Building momentum...";
  if (pct >= 25) return "Getting started...";
  return "Power up your ally";
}

function renderProgressRing(pct: number) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return html`
    <div class="setup-ring">
      <svg class="setup-ring__svg" viewBox="0 0 120 120" width="120" height="120">
        <circle class="setup-ring__bg" cx="60" cy="60" r="${radius}" fill="none" stroke="var(--gm-border, #333)" stroke-width="8" />
        <circle
          class="setup-ring__fill"
          cx="60" cy="60" r="${radius}" fill="none"
          stroke="var(--gm-accent, #7c3aed)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="64" text-anchor="middle" fill="var(--gm-text, #fff)" font-size="22" font-weight="bold">${pct}%</text>
      </svg>
      <span class="setup-ring__label">${progressLabel(pct)}</span>
    </div>
  `;
}

// ── Capability Cards ────────────────────────────────────────────

function renderCapabilityCard(card: CapabilityCard, onAction: (id: string) => void) {
  const statusClass = `setup-card--${card.status}`;
  return html`
    <div class="setup-card ${statusClass}">
      <div class="setup-card__header">
        <span class="setup-card__icon">${card.icon}</span>
        <span class="setup-card__title">${card.title}</span>
        <span class="setup-card__badge setup-card__badge--${card.status}">
          ${card.status === "active" ? "\u2713 Active" : card.status === "available" ? "Available" : "Coming Soon"}
        </span>
      </div>
      <p class="setup-card__desc">${card.description}</p>
      ${card.detail ? html`<span class="setup-card__detail">${card.detail}</span>` : nothing}
      ${card.status === "available" && card.action
        ? html`<button class="setup-card__btn" @click=${() => onAction(card.id)}>${card.action}</button>`
        : nothing}
      ${card.status === "active"
        ? html`<span class="setup-card__active-check">\u2705</span>`
        : nothing}
    </div>
  `;
}

function renderCapabilities(props: SetupViewProps) {
  const { capabilities, capabilitiesLoading, onHideSetup, onOpenWizard, onCapabilityAction } = props;

  if (capabilitiesLoading && !capabilities) {
    return html`<div class="setup-loading">Loading capabilities...</div>`;
  }

  if (!capabilities) {
    return html`<div class="setup-loading">Couldn't load capabilities. Is the gateway running?</div>`;
  }

  const { capabilities: cards, percentComplete } = capabilities;

  return html`
    <div class="setup-capabilities">
      ${renderProgressRing(percentComplete)}

      <div class="setup-cards">
        ${cards.map((card) => renderCapabilityCard(card, onCapabilityAction))}
      </div>

      <div class="setup-actions">
        <button class="setup-action-btn" @click=${onOpenWizard}>
          Deep Setup Wizard
        </button>
        <button class="setup-action-btn setup-action-btn--text" @click=${onHideSetup}>
          Hide Setup
        </button>
      </div>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Need help? Chat with our AI support agent.</span>
        <button class="setup-help-banner__btn" @click=${() => props.onOpenSupportChat()}>
          Open Support Chat
        </button>
      </div>
    </div>
  `;
}

// ── Main Render ─────────────────────────────────────────────────

export function renderSetup(props: SetupViewProps) {
  if (!props.connected) {
    return html`
      <section class="tab-body setup-section">
        <div class="setup-loading">
          Waiting for gateway connection...
        </div>
      </section>
    `;
  }

  return html`
    <section class="tab-body setup-section">
      ${!props.quickSetupDone ? renderQuickStart(props) : nothing}
      ${renderCapabilities(props)}
    </section>
  `;
}
