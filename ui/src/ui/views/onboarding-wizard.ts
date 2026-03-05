/**
 * onboarding-wizard.ts -- Memory Onboarding Wizard (8-step form)
 *
 * Takes a new user from zero to a working GodMode memory system in 5 minutes.
 * 8 questions, one per step, with smart defaults and back/next navigation.
 * Final review screen shows what will be generated, then calls onboarding.wizard.generate.
 */

import { html, nothing, type TemplateResult } from "lit";

// ── Types ────────────────────────────────────────────────────────

export type WizardAnswers = {
  name: string;
  timezone: string;
  focus: string;
  projects: string[];
  commStyle: string;
  hardRules: string[];
  keyPeople: string[];
  defaultModel: string;
};

export type WizardFilePreview = {
  path: string;
  exists: boolean;
  wouldCreate: boolean;
};

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// 0-7 = questions, 8 = review, 9 = success

export type ConfigDiffEntry = {
  path: string;
  current: unknown;
  recommended: unknown;
};

export type ConfigDiff = {
  additions: ConfigDiffEntry[];
  changes: ConfigDiffEntry[];
  matching: string[];
};

export type WizardState = {
  step: WizardStep;
  answers: WizardAnswers;
  preview: WizardFilePreview[] | null;
  diff: ConfigDiff | null;
  fileSelections: Record<string, boolean>;
  configSelections: Record<string, boolean>;
  generating: boolean;
  result: {
    filesCreated: number;
    filesSkipped: number;
    configPatched: boolean;
    workspacePath: string;
  } | null;
  error: string | null;
};

export type WizardCallbacks = {
  onStepChange: (step: WizardStep) => void;
  onAnswerChange: (key: keyof WizardAnswers, value: unknown) => void;
  onPreview: () => void;
  onGenerate: () => void;
  onClose: () => void;
  onFileToggle: (path: string, checked: boolean) => void;
  onConfigToggle: (path: string, checked: boolean) => void;
};

// ── Defaults ────────────────────────────────────────────────────

const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const COMM_STYLES = [
  "Direct and concise -- no fluff, just answers",
  "Detailed explanations -- walk me through the reasoning",
  "Casual and conversational -- like talking to a friend",
  "Structured with bullet points -- organized and scannable",
  "Technical and precise -- specifics matter",
];

const MODEL_OPTIONS = [
  { value: "sonnet", label: "Sonnet (fast, balanced)" },
  { value: "opus", label: "Opus (deep reasoning)" },
  { value: "haiku", label: "Haiku (quick, lightweight)" },
];

const DEFAULT_RULES = [
  "Never send emails without explicit approval",
  "Never delete or overwrite files without backup",
  "Always search memory before guessing",
  "Never share private information externally",
];

// ── Step Definitions ────────────────────────────────────────────

const STEP_CONFIG = [
  { label: "Name", question: "What should I call you?" },
  { label: "Timezone", question: "What timezone are you in?" },
  { label: "Focus", question: "What are you building or focused on?" },
  { label: "Projects", question: "What are your top projects? (1-3)" },
  { label: "Style", question: "How do you like to communicate?" },
  { label: "Rules", question: "What rules must the AI always follow?" },
  { label: "People", question: "Who are the key people in your work/life?" },
  { label: "Model", question: "What AI model do you prefer?" },
];

// ── Render Helpers ──────────────────────────────────────────────

function renderProgressDots(step: WizardStep): TemplateResult {
  const total = 8;
  const current = Math.min(Number(step), total);
  return html`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({ length: total }, (_, i) => html`
          <div class="wizard-progress-dot ${i < current ? "completed" : ""} ${i === current ? "active" : ""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${current < total
          ? `Step ${current + 1} of ${total}`
          : "Review"}
      </div>
    </div>
  `;
}

function renderStepHeader(step: number): TemplateResult {
  if (step >= STEP_CONFIG.length) return html`${nothing}`;
  const config = STEP_CONFIG[step];
  return html`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${config.question}</h2>
    </div>
  `;
}

function renderNavButtons(
  step: WizardStep,
  callbacks: WizardCallbacks,
  canContinue: boolean,
  isLast: boolean,
): TemplateResult {
  return html`
    <div class="wizard-nav">
      ${step > 0
        ? html`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${() => callbacks.onStepChange((step - 1) as WizardStep)}
            >Back</button>
          `
        : html`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${!canContinue ? "wizard-btn--disabled" : ""}"
        ?disabled=${!canContinue}
        @click=${() => {
          if (isLast) {
            callbacks.onStepChange(8 as WizardStep);
            callbacks.onPreview();
          } else {
            callbacks.onStepChange((step + 1) as WizardStep);
          }
        }}
      >${isLast ? "Review" : "Continue"}</button>
    </div>
  `;
}

function renderSkipHint(): TemplateResult {
  return html`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`;
}

// ── Individual Step Renderers ───────────────────────────────────

function renderStep0Name(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  function handleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    callbacks.onAnswerChange("name", val);
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      callbacks.onStepChange(1 as WizardStep);
    }
  }
  return html`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${answers.name}
        placeholder="Your name"
        @input=${handleInput}
        @keydown=${handleKeydown}
        autofocus
      />
    </div>
  `;
}

function renderStep1Timezone(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return html`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${detected}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${answers.timezone || detected}
        @change=${(e: Event) => {
          callbacks.onAnswerChange("timezone", (e.target as HTMLSelectElement).value);
        }}
      >
        ${!TIMEZONE_OPTIONS.includes(detected)
          ? html`<option value="${detected}">${detected} (detected)</option>`
          : nothing}
        ${TIMEZONE_OPTIONS.map(
          (tz) => html`
            <option value="${tz}" ?selected=${(answers.timezone || detected) === tz}>
              ${tz}${tz === detected ? " (detected)" : ""}
            </option>
          `,
        )}
      </select>
      ${renderSkipHint()}
    </div>
  `;
}

function renderStep2Focus(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  function handleInput(e: Event) {
    callbacks.onAnswerChange("focus", (e.target as HTMLInputElement).value);
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      callbacks.onStepChange(3 as WizardStep);
    }
  }
  return html`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${answers.focus}
        placeholder="e.g. Building a SaaS product, Running my consulting business"
        @input=${handleInput}
        @keydown=${handleKeydown}
        autofocus
      />
    </div>
  `;
}

function renderStep3Projects(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  function addProject() {
    const input = document.querySelector(".wizard-project-input") as HTMLInputElement;
    if (!input) return;
    const val = input.value.trim();
    if (val && answers.projects.length < 5) {
      callbacks.onAnswerChange("projects", [...answers.projects, val]);
      input.value = "";
      input.focus();
    }
  }
  function removeProject(idx: number) {
    const next = answers.projects.filter((_, i) => i !== idx);
    callbacks.onAnswerChange("projects", next);
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      if (input.value.trim()) {
        addProject();
      } else if (answers.projects.length > 0) {
        callbacks.onStepChange(4 as WizardStep);
      }
    }
  }
  return html`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${answers.projects.map(
          (p, i) => html`
            <span class="wizard-tag">
              ${p}
              <button class="wizard-tag-remove" @click=${() => removeProject(i)}>x</button>
            </span>
          `,
        )}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-project-input"
          placeholder="Project name, then press Enter to add"
          @keydown=${handleKeydown}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${addProject}>Add</button>
      </div>
      ${answers.projects.length === 0
        ? html`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`
        : nothing}
    </div>
  `;
}

function renderStep4CommStyle(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  return html`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${COMM_STYLES.map(
          (style) => html`
            <label class="wizard-radio ${answers.commStyle === style ? "wizard-radio--selected" : ""}">
              <input
                type="radio"
                name="commStyle"
                .value=${style}
                ?checked=${answers.commStyle === style}
                @change=${() => {
                  callbacks.onAnswerChange("commStyle", style);
                }}
              />
              <span class="wizard-radio-label">${style}</span>
            </label>
          `,
        )}
      </div>
      <div class="wizard-or-custom">
        <span class="wizard-or">or type your own:</span>
        <input
          type="text"
          class="wizard-input wizard-input--small"
          placeholder="Custom preference..."
          @input=${(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            if (val.trim()) {
              callbacks.onAnswerChange("commStyle", val);
            }
          }}
        />
      </div>
    </div>
  `;
}

function renderStep5Rules(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  // Pre-populate defaults if empty
  const rules = answers.hardRules.length > 0 ? answers.hardRules : [];

  function toggleDefault(rule: string) {
    if (rules.includes(rule)) {
      callbacks.onAnswerChange("hardRules", rules.filter((r) => r !== rule));
    } else {
      callbacks.onAnswerChange("hardRules", [...rules, rule]);
    }
  }

  function addCustomRule() {
    const input = document.querySelector(".wizard-rule-input") as HTMLInputElement;
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      callbacks.onAnswerChange("hardRules", [...rules, val]);
      input.value = "";
      input.focus();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      if (input.value.trim()) {
        addCustomRule();
      }
    }
  }

  return html`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${DEFAULT_RULES.map(
          (rule) => html`
            <label class="wizard-checkbox ${rules.includes(rule) ? "wizard-checkbox--selected" : ""}">
              <input
                type="checkbox"
                ?checked=${rules.includes(rule)}
                @change=${() => toggleDefault(rule)}
              />
              <span class="wizard-checkbox-label">${rule}</span>
            </label>
          `,
        )}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-rule-input"
          placeholder="Add a custom rule..."
          @keydown=${handleKeydown}
        />
        <button class="wizard-btn wizard-btn--small" @click=${addCustomRule}>Add</button>
      </div>
      ${rules.filter((r) => !DEFAULT_RULES.includes(r)).length > 0
        ? html`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${rules
                .filter((r) => !DEFAULT_RULES.includes(r))
                .map(
                  (r) => html`
                    <span class="wizard-tag">
                      ${r}
                      <button class="wizard-tag-remove" @click=${() => {
                        callbacks.onAnswerChange("hardRules", rules.filter((x) => x !== r));
                      }}>x</button>
                    </span>
                  `,
                )}
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderStep6People(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  function addPerson() {
    const input = document.querySelector(".wizard-person-input") as HTMLInputElement;
    if (!input) return;
    const val = input.value.trim();
    if (val && answers.keyPeople.length < 10) {
      callbacks.onAnswerChange("keyPeople", [...answers.keyPeople, val]);
      input.value = "";
      input.focus();
    }
  }
  function removePerson(idx: number) {
    callbacks.onAnswerChange("keyPeople", answers.keyPeople.filter((_, i) => i !== idx));
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      if (input.value.trim()) {
        addPerson();
      } else if (answers.keyPeople.length > 0) {
        callbacks.onStepChange(7 as WizardStep);
      }
    }
  }
  return html`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${answers.keyPeople.map(
          (p, i) => html`
            <span class="wizard-tag">
              ${p}
              <button class="wizard-tag-remove" @click=${() => removePerson(i)}>x</button>
            </span>
          `,
        )}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-person-input"
          placeholder="Person's name, then press Enter"
          @keydown=${handleKeydown}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${addPerson}>Add</button>
      </div>
      <p class="wizard-hint">Co-founders, family, key collaborators. You can add more later.</p>
    </div>
  `;
}

function renderStep7Model(
  answers: WizardAnswers,
  callbacks: WizardCallbacks,
): TemplateResult {
  return html`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${MODEL_OPTIONS.map(
          (opt) => html`
            <label class="wizard-radio ${answers.defaultModel === opt.value ? "wizard-radio--selected" : ""}">
              <input
                type="radio"
                name="defaultModel"
                .value=${opt.value}
                ?checked=${answers.defaultModel === opt.value}
                @change=${() => callbacks.onAnswerChange("defaultModel", opt.value)}
              />
              <span class="wizard-radio-label">${opt.label}</span>
            </label>
          `,
        )}
      </div>
      ${renderSkipHint()}
    </div>
  `;
}

// ── Review Screen ───────────────────────────────────────────────

/** Format a config value for display. */
function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "not set";
  if (typeof val === "string") return val;
  if (typeof val === "boolean" || typeof val === "number") return String(val);
  if (Array.isArray(val)) return JSON.stringify(val);
  return JSON.stringify(val);
}

function renderReview(
  state: WizardState,
  callbacks: WizardCallbacks,
): TemplateResult {
  const { answers, preview, diff, fileSelections, configSelections, generating } = state;
  const hasExistingFiles = preview?.some((f) => f.exists) ?? false;
  const hasConfigChanges = diff && (diff.changes.length > 0 || diff.additions.length > 0);

  return html`
    <div class="wizard-review">
      <h2 class="wizard-review-title">Ready to generate your workspace</h2>

      <div class="wizard-review-summary">
        <div class="wizard-review-section">
          <h3>Your Profile</h3>
          <div class="wizard-review-item"><span class="wizard-review-label">Name:</span> ${answers.name}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Timezone:</span> ${answers.timezone}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Focus:</span> ${answers.focus}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Model:</span> ${answers.defaultModel}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Style:</span> ${answers.commStyle}</div>
        </div>

        ${answers.projects.length > 0
          ? html`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${answers.projects.map((p) => html`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `
          : nothing}

        ${answers.keyPeople.length > 0
          ? html`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${answers.keyPeople.map((p) => html`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `
          : nothing}

        ${answers.hardRules.length > 0
          ? html`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${answers.hardRules.map((r) => html`<div class="wizard-review-item">${r}</div>`)}
              </div>
            `
          : nothing}
      </div>

      ${preview && preview.length > 0
        ? html`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${hasExistingFiles
                ? html`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`
                : nothing}
              <div class="wizard-file-list">
                ${preview.map((f) => {
                  const checked = fileSelections[f.path] ?? f.wouldCreate;
                  return html`
                    <label class="wizard-file-item ${f.wouldCreate ? "wizard-file--new" : "wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${checked}
                        @change=${(e: Event) => callbacks.onFileToggle(f.path, (e.target as HTMLInputElement).checked)}
                      />
                      <span class="wizard-file-path">${f.path}</span>
                      <span class="wizard-file-status">${
                        f.exists
                          ? checked ? "overwrite" : "keep existing"
                          : "new"
                      }</span>
                    </label>
                  `;
                })}
              </div>
            </div>
          `
        : nothing}

      ${hasConfigChanges
        ? html`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${diff.additions.length > 0
                ? html`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${diff.additions.map((entry) => {
                        const checked = configSelections[entry.path] ?? true;
                        return html`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${checked}
                              @change=${(e: Event) => callbacks.onConfigToggle(entry.path, (e.target as HTMLInputElement).checked)}
                            />
                            <span class="wizard-config-path">${entry.path}</span>
                            <span class="wizard-config-value">${formatValue(entry.recommended)}</span>
                          </label>
                        `;
                      })}
                    </div>
                  `
                : nothing}

              ${diff.changes.length > 0
                ? html`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${diff.changes.map((entry) => {
                        const checked = configSelections[entry.path] ?? false;
                        return html`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${checked}
                              @change=${(e: Event) => callbacks.onConfigToggle(entry.path, (e.target as HTMLInputElement).checked)}
                            />
                            <span class="wizard-config-path">${entry.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${formatValue(entry.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${formatValue(entry.recommended)}</span>
                            </span>
                          </label>
                        `;
                      })}
                    </div>
                  `
                : nothing}

              ${diff.matching.length > 0
                ? html`<p class="wizard-hint">${diff.matching.length} settings already match GodMode's recommendations.</p>`
                : nothing}
            </div>
          `
        : html`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

      <div class="wizard-nav">
        <button
          class="wizard-btn wizard-btn--back"
          @click=${() => callbacks.onStepChange(7 as WizardStep)}
          ?disabled=${generating}
        >Back</button>
        <button
          class="wizard-btn wizard-btn--generate ${generating ? "wizard-btn--loading" : ""}"
          @click=${() => callbacks.onGenerate()}
          ?disabled=${generating}
        >${generating ? "Generating..." : "Generate Workspace"}</button>
      </div>

      ${state.error
        ? html`<div class="wizard-error">${state.error}</div>`
        : nothing}
    </div>
  `;
}

// ── Success Screen ──────────────────────────────────────────────

function renderSuccess(
  state: WizardState,
  callbacks: WizardCallbacks,
): TemplateResult {
  const result = state.result;
  if (!result) return html`${nothing}`;

  return html`
    <div class="wizard-success">
      <div class="wizard-success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ok, #22c55e)" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="wizard-success-title">Your memory system is ready</h2>
      <div class="wizard-success-stats">
        <div class="wizard-stat">
          <span class="wizard-stat-number">${result.filesCreated}</span>
          <span class="wizard-stat-label">files created</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${result.filesSkipped}</span>
          <span class="wizard-stat-label">files skipped</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${result.configPatched ? "Yes" : "No"}</span>
          <span class="wizard-stat-label">config patched</span>
        </div>
      </div>
      <p class="wizard-success-path">Workspace: <code>${result.workspacePath}</code></p>
      <p class="wizard-success-hint">
        Start a new chat session and the agent will automatically read your memory files.
        The system gets smarter with every conversation.
      </p>
      <button class="wizard-btn wizard-btn--next" @click=${() => callbacks.onClose()}>
        Start Using GodMode
      </button>
    </div>
  `;
}

// ── Main Render ─────────────────────────────────────────────────

export function emptyWizardAnswers(): WizardAnswers {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    name: "",
    timezone: tz,
    focus: "",
    projects: [],
    commStyle: "Direct and concise -- no fluff, just answers",
    hardRules: [],
    keyPeople: [],
    defaultModel: "sonnet",
  };
}

export function emptyWizardState(): WizardState {
  return {
    step: 0 as WizardStep,
    answers: emptyWizardAnswers(),
    preview: null,
    diff: null,
    fileSelections: {},
    configSelections: {},
    generating: false,
    result: null,
    error: null,
  };
}

export function renderOnboardingWizard(
  state: WizardState,
  callbacks: WizardCallbacks,
): TemplateResult {
  const { step, answers } = state;

  // Success screen
  if (step === 9) {
    return html`
      <div class="wizard-fullscreen">
        ${renderSuccess(state, callbacks)}
      </div>
    `;
  }

  // Review screen
  if (step === 8) {
    return html`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${renderProgressDots(step)}
          ${renderReview(state, callbacks)}
        </div>
      </div>
    `;
  }

  // Determine if current step has a valid answer for "Continue"
  const canContinue = (() => {
    switch (step) {
      case 0: return answers.name.trim().length > 0;
      case 1: return true; // timezone always has default
      case 2: return true; // focus can be skipped
      case 3: return true; // projects can be empty
      case 4: return answers.commStyle.trim().length > 0;
      case 5: return true; // rules can be empty
      case 6: return true; // people can be empty
      case 7: return true; // model always has default
      default: return false;
    }
  })();

  const isLastStep = step === 7;

  // Step renderers
  const stepContent = (() => {
    switch (step) {
      case 0: return renderStep0Name(answers, callbacks);
      case 1: return renderStep1Timezone(answers, callbacks);
      case 2: return renderStep2Focus(answers, callbacks);
      case 3: return renderStep3Projects(answers, callbacks);
      case 4: return renderStep4CommStyle(answers, callbacks);
      case 5: return renderStep5Rules(answers, callbacks);
      case 6: return renderStep6People(answers, callbacks);
      case 7: return renderStep7Model(answers, callbacks);
      default: return html`${nothing}`;
    }
  })();

  return html`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${renderProgressDots(step)}
        ${renderStepHeader(step)}
        ${stepContent}
        ${renderNavButtons(step, callbacks, canContinue, isLastStep)}
      </div>
    </div>
  `;
}
