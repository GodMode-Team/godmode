/**
 * Setup Bar — persistent sidebar element showing onboarding progress.
 * Pure render function (not a Lit component), returns TemplateResult.
 *
 * Reads SetupProgress from the `onboarding.setupProgress` RPC endpoint
 * which checks actual system state (API keys, Honcho, Composio, Obsidian).
 */
import { html, nothing, type TemplateResult } from "lit";

// ── Types ──────────────────────────────────────────────────────

/** Mirrors the server-side SetupProgress from onboarding-types.ts */
export interface SetupProgress {
  currentStep: string;
  completedSteps: string[];
  name?: string;
  timezone?: string;
  allyName?: string;
  apiKeyConfigured: boolean;
  honchoConfigured: boolean;
  composioConfigured: boolean;
  composioIntegrations: Record<string, { id: string; name: string; connected: boolean; icon?: string }>;
  obsidianConfigured: boolean;
  obsidianPath?: string;
  startedAt?: string;
  completedAt?: string;
  dismissed?: boolean;
}

export interface SetupBarState {
  /** Setup progress from onboarding.setupProgress RPC */
  setupProgress: SetupProgress | null;
  /** Whether the user explicitly dismissed the setup bar this session */
  setupBarDismissed: boolean;
}

export interface SetupBarActions {
  onContinueSetup: () => void;
  onDismissSetup: () => void;
  onStepClick: (stepId: string) => void;
}

// ── Step Definitions ───────────────────────────────────────────

const STEPS = [
  { id: "welcome", title: "Welcome", icon: "\u{1F44B}" },
  { id: "api-key", title: "AI Connection", icon: "\u{1F511}" },
  { id: "memory", title: "Memory", icon: "\u{1F9E0}" },
  { id: "integrations", title: "Integrations", icon: "\u{1F50C}" },
  { id: "screenpipe", title: "Screen Recall", icon: "\u{1F4FA}" },
  { id: "second-brain", title: "Memory Vault", icon: "\u{1F9E0}" },
] as const;

// ── Render ─────────────────────────────────────────────────────

export function renderSetupBar(
  state: SetupBarState,
  actions: SetupBarActions,
): TemplateResult | typeof nothing {
  if (state.setupBarDismissed) return nothing;

  const progress = state.setupProgress;
  if (!progress) return nothing;
  if (progress.completedAt || progress.dismissed) return nothing;

  const completed = new Set(progress.completedSteps);
  const completedCount = completed.size;
  const totalSteps = STEPS.length;
  const progressPercent = (completedCount / totalSteps) * 100;

  // All done — hide
  if (completedCount >= totalSteps) return nothing;

  const steps = STEPS.map((def) => ({
    ...def,
    status: completed.has(def.id)
      ? ("completed" as const)
      : def.id === progress.currentStep
        ? ("current" as const)
        : ("upcoming" as const),
  }));

  return html`
    <div class="setup-bar">
      <div class="setup-bar__header">
        <span class="setup-bar__header-icon">\u{1F680}</span>
        <span class="setup-bar__header-title">Get Started</span>
      </div>

      <div class="setup-bar__progress">
        <div class="setup-bar__progress-track">
          <div
            class="setup-bar__progress-fill"
            style="width: ${progressPercent}%"
          ></div>
        </div>
        <span class="setup-bar__progress-label">${completedCount}/${totalSteps}</span>
      </div>

      <div class="setup-bar__steps">
        ${steps.map(
          (step) => html`
            <button
              class="setup-bar__step setup-bar__step--${step.status}"
              @click=${() => {
                if (step.status !== "completed") {
                  actions.onStepClick(step.id);
                }
              }}
              ?disabled=${step.status === "completed"}
              title=${step.status === "completed"
                ? `${step.title} — done`
                : step.status === "current"
                  ? `Continue: ${step.title}`
                  : step.title}
            >
              <span class="setup-bar__step-icon">
                ${step.status === "completed" ? "\u2705" : step.icon}
              </span>
              <span class="setup-bar__step-title">${step.title}</span>
              ${step.status === "current"
                ? html`<span class="setup-bar__step-arrow">\u2192</span>`
                : nothing}
            </button>
          `,
        )}
      </div>

      <div class="setup-bar__actions">
        <button
          class="setup-bar__continue"
          @click=${() => actions.onContinueSetup()}
        >
          Continue Setup
        </button>
        <button
          class="setup-bar__dismiss"
          @click=${() => actions.onDismissSetup()}
        >
          Skip for now
        </button>
      </div>
    </div>
  `;
}
