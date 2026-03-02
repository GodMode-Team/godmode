/**
 * Setup tab view — 80/20 fast onboarding.
 *
 * Section 1: Quick Start form (name + license key + daily intel topics)
 * Section 2: Progressive checklist for deeper setup tasks
 */
import { html, nothing } from "lit";
import type { Tab } from "../navigation.js";

// ── Types ───────────────────────────────────────────────────────

type ChecklistStep = {
  id: string;
  label: string;
  completed: boolean;
  detail?: string;
};

type ChecklistMilestone = {
  id: string;
  phase: number;
  title: string;
  description: string;
  emoji: string;
  status: "complete" | "in-progress" | "locked";
  steps: ChecklistStep[];
};

type SetupChecklist = {
  milestones: ChecklistMilestone[];
  percentComplete: number;
  currentPhase: number;
  completedAt: string | null;
};

export type SetupViewProps = {
  connected: boolean;
  quickSetupDone: boolean;
  checklist: SetupChecklist | null;
  checklistLoading: boolean;
  onQuickSetup: (name: string, licenseKey: string) => void;
  onHideSetup: () => void;
  onOpenWizard: () => void;
  onNavigate: (tab: Tab) => void;
  onRunAssessment: () => void;
  onOpenSupportChat: () => void;
};

// ── Quick Start Form ────────────────────────────────────────────

function renderQuickStart(props: SetupViewProps) {
  let nameValue = "";
  let keyValue = "";
  let submitting = false;

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? "";
    const key = (form.querySelector('[name="licenseKey"]') as HTMLInputElement)?.value?.trim() ?? "";

    if (!name) {
      const nameInput = form.querySelector('[name="name"]') as HTMLInputElement;
      nameInput?.focus();
      return;
    }

    submitting = true;
    props.onQuickSetup(name, key);
  }

  return html`
    <div class="setup-quick">
      <div class="setup-quick__header">
        <span class="setup-quick__icon">⚡</span>
        <h2 class="setup-quick__title">Welcome to GodMode</h2>
        <p class="setup-quick__subtitle">Let's get you set up in under 2 minutes.</p>
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
            .value=${nameValue}
          />
        </div>

        <div class="setup-field">
          <label class="setup-label" for="setup-key">License key</label>
          <input
            class="setup-input"
            type="text"
            id="setup-key"
            name="licenseKey"
            placeholder="GM-DEV-... or GM-PROD-..."
            .value=${keyValue}
          />
          <span class="setup-hint">Starts with GM-. Don't have one? Ask your admin.</span>
        </div>

        <button class="setup-submit" type="submit">
          Get Started
        </button>
      </form>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Stuck? Our AI support agent can walk you through it.</span>
        <button class="setup-help-banner__btn" @click=${() => props.onOpenSupportChat()}>
          Open Support Chat
        </button>
      </div>
    </div>
  `;
}

// ── Checklist ───────────────────────────────────────────────────

function renderMilestone(milestone: ChecklistMilestone) {
  const completedSteps = milestone.steps.filter((s) => s.completed).length;
  const totalSteps = milestone.steps.length;
  const allDone = completedSteps === totalSteps;

  return html`
    <details class="setup-milestone ${allDone ? "setup-milestone--done" : ""}" ?open=${milestone.status === "in-progress"}>
      <summary class="setup-milestone__header">
        <span class="setup-milestone__emoji">${milestone.emoji}</span>
        <div class="setup-milestone__info">
          <span class="setup-milestone__title">${milestone.title}</span>
          <span class="setup-milestone__meta">${completedSteps}/${totalSteps}</span>
        </div>
        <span class="setup-milestone__status">
          ${allDone ? "\u2705" : milestone.status === "in-progress" ? "\u{1F504}" : "\u{1F512}"}
        </span>
      </summary>
      <div class="setup-milestone__body">
        <p class="setup-milestone__desc">${milestone.description}</p>
        <ul class="setup-steps">
          ${milestone.steps.map(
            (step) => html`
              <li class="setup-step ${step.completed ? "setup-step--done" : ""}">
                <span class="setup-step__check">${step.completed ? "\u2713" : "\u25CB"}</span>
                <span class="setup-step__label">${step.label}</span>
                ${step.detail
                  ? html`<span class="setup-step__detail">${step.detail}</span>`
                  : nothing}
              </li>
            `,
          )}
        </ul>
      </div>
    </details>
  `;
}

function renderChecklist(props: SetupViewProps) {
  const { checklist, checklistLoading, onHideSetup, onOpenWizard } = props;

  if (checklistLoading && !checklist) {
    return html`<div class="setup-loading">Loading setup progress...</div>`;
  }

  if (!checklist) {
    return html`<div class="setup-loading">Couldn't load setup progress. Is the gateway running?</div>`;
  }

  const { milestones, percentComplete } = checklist;

  return html`
    <div class="setup-checklist">
      <div class="setup-checklist__header">
        <h3 class="setup-checklist__title">Setup Progress</h3>
        <span class="setup-checklist__pct">${percentComplete}%</span>
      </div>

      <div class="setup-progress">
        <div class="setup-progress__bar" style="width: ${percentComplete}%"></div>
      </div>

      <div class="setup-milestones">
        ${milestones.map((m) => renderMilestone(m))}
      </div>

      <div class="setup-actions">
        <button class="setup-action-btn" @click=${onOpenWizard}>
          Run Memory Wizard
        </button>
        <button class="setup-action-btn setup-action-btn--text" @click=${onHideSetup}>
          Hide Setup
        </button>
      </div>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Need help with setup? Chat with our AI support agent.</span>
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
      ${renderChecklist(props)}
    </section>
  `;
}
