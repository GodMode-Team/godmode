import { html } from "lit";

// ===== Types =====

export type KeyResult = {
  kr: string;
  current: number | null;
  target: number;
};

export type AnnualTheme = {
  id: string;
  theme: string;
  description: string;
  progress: number;
  wheelSpokes: string[];
  keyResults: KeyResult[];
};

export type ChiefDefiniteAim = {
  statement: string;
  deadline: string;
  progress: number;
  lastUpdated: string;
};

export type VisionBoardData = {
  chiefDefiniteAim: ChiefDefiniteAim;
  annualThemes: AnnualTheme[];
  values: string[];
  identityStatements: string[];
  antiGoals: string[];
};

export type VisionBoardProps = {
  connected: boolean;
  data: VisionBoardData | null;
  identityToday?: string | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onUpdateViaChat?: () => void;
};

// ===== Constants =====

const THEME_ICONS: Record<string, string> = {
  "godmode-launch": "🚀",
  "edison-year": "👶",
  "health-foundation": "💪",
  "pa-systematization": "⚙️",
  default: "🎯",
};

const SPOKE_LABELS: Record<string, string> = {
  health: "Health",
  wealth: "Wealth",
  career: "Career",
  relationships: "Relationships",
  fun: "Fun",
  environment: "Environment",
  growth: "Growth",
  contribution: "Contribution",
};

// ===== Helper Functions =====

function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const years = date.getFullYear() - now.getFullYear();

  if (years <= 0) {
    return "This year";
  }
  if (years === 1) {
    return "Next year";
  }
  return `${years} years`;
}

function formatProgress(progress: number): string {
  return `${Math.round(progress * 100)}%`;
}

function getThemeIcon(id: string): string {
  return THEME_ICONS[id] || THEME_ICONS.default;
}

// ===== Render Functions =====

function renderCDASection(cda: ChiefDefiniteAim) {
  const progressPercent = cda.progress * 100;

  return html`
    <div class="vision-cda-section">
      <div class="vision-cda-label">CHIEF DEFINITE AIM</div>
      <blockquote class="vision-cda-statement">"${cda.statement}"</blockquote>
      <div class="vision-cda-meta">
        <div class="vision-cda-deadline">
          <span class="meta-icon">📅</span>
          <span class="meta-value">${cda.deadline}</span>
          <span class="meta-label">(${formatDeadline(cda.deadline)})</span>
        </div>
        <div class="vision-cda-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
          </div>
          <span class="progress-label">${formatProgress(cda.progress)} progress</span>
        </div>
      </div>
    </div>
  `;
}

function renderIdentitySection(identity: string | null | undefined) {
  if (!identity) {
    return null;
  }

  return html`
    <div class="vision-identity-section">
      <div class="vision-section-label">TODAY'S IDENTITY</div>
      <div class="vision-identity-card">
        <span class="identity-icon">💎</span>
        <blockquote class="identity-statement">"${identity}"</blockquote>
      </div>
    </div>
  `;
}

function renderThemesSection(themes: AnnualTheme[]) {
  if (!themes || themes.length === 0) {
    return html`
      <div class="vision-themes-section">
        <div class="vision-section-label">2026 THEMES</div>
        <div class="vision-empty-state">No themes defined yet.</div>
      </div>
    `;
  }

  return html`
    <div class="vision-themes-section">
      <div class="vision-section-label">2026 THEMES</div>
      <div class="vision-themes-grid">
        ${themes.map((theme) => {
          const progressPercent = theme.progress * 100;
          return html`
            <div class="vision-theme-card">
              <div class="theme-card-header">
                <span class="theme-icon">${getThemeIcon(theme.id)}</span>
                <span class="theme-title">${theme.theme}</span>
              </div>
              <p class="theme-description">${theme.description}</p>
              <div class="theme-progress">
                <div class="progress-bar-container small">
                  <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-label">${formatProgress(theme.progress)}</span>
              </div>
              ${
                theme.wheelSpokes && theme.wheelSpokes.length > 0
                  ? html`
                    <div class="theme-spokes">
                      ${theme.wheelSpokes.map(
                        (spoke) => html`
                          <span class="theme-spoke-badge">${SPOKE_LABELS[spoke] || spoke}</span>
                        `,
                      )}
                    </div>
                  `
                  : null
              }
              ${
                theme.keyResults && theme.keyResults.length > 0
                  ? html`
                    <div class="theme-key-results">
                      ${theme.keyResults.map((kr) => {
                        const krProgress = kr.current !== null ? (kr.current / kr.target) * 100 : 0;
                        return html`
                          <div class="key-result-item">
                            <span class="kr-text">${kr.kr}</span>
                            <span class="kr-progress">
                              ${kr.current !== null ? kr.current : "—"} / ${kr.target}
                            </span>
                          </div>
                        `;
                      })}
                    </div>
                  `
                  : null
              }
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

function renderValuesSection(values: string[]) {
  if (!values || values.length === 0) {
    return null;
  }

  return html`
    <div class="vision-values-section">
      <div class="vision-section-label">VALUES HIERARCHY</div>
      <div class="vision-values-list">
        ${values.map(
          (value, index) => html`
            <div class="vision-value-item">
              <span class="value-rank">${index + 1}</span>
              <span class="value-text">${value}</span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

function renderAntiGoalsSection(antiGoals: string[]) {
  if (!antiGoals || antiGoals.length === 0) {
    return null;
  }

  return html`
    <div class="vision-antigoals-section">
      <div class="vision-section-label">WHAT I'M NOT CHASING</div>
      <div class="vision-antigoals-list">
        ${antiGoals.map(
          (goal) => html`
            <div class="vision-antigoal-item">
              <span class="antigoal-icon">🚫</span>
              <span class="antigoal-text">${goal}</span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderVisionBoard(props: VisionBoardProps) {
  if (props.loading) {
    return html`
      <div class="vision-container">
        <div class="vision-loading">
          <div class="spinner"></div>
          <span>Loading Vision Board...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="vision-container">
        <div class="vision-error">
          <span class="error-icon">⚠️</span>
          <span>${props.error}</span>
          ${
            props.onRefresh
              ? html`<button class="retry-button" @click=${props.onRefresh}>Retry</button>`
              : null
          }
        </div>
      </div>
    `;
  }

  if (!props.data) {
    return html`
      <div class="vision-container">
        <div class="vision-empty">
          <span class="empty-icon">⭐</span>
          <span>No vision board yet. Define your Chief Definite Aim!</span>
          ${
            props.onRefresh
              ? html`<button class="primary-button" @click=${props.onRefresh}>Load Data</button>`
              : null
          }
        </div>
      </div>
    `;
  }

  const { data, identityToday } = props;

  return html`
    <div class="vision-container">
      <!-- Header -->
      <div class="vision-header">
        <div class="vision-header-left">
          <h1 class="vision-title">Vision Board</h1>
          <p class="vision-subtitle">
            Your Chief Definite Aim, annual themes, values, and identity statements.
          </p>
        </div>
        <div class="vision-header-right">
          <div class="vision-status ${props.connected ? "online" : "offline"}">
            <span class="status-indicator status-${props.connected ? "working" : "idle"}"></span>
            <span class="status-label">${props.connected ? "ONLINE" : "OFFLINE"}</span>
          </div>
          ${
            props.onUpdateViaChat
              ? html`<button class="goals-chat-btn" @click=${props.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`
              : null
          }
          ${
            props.onRefresh
              ? html`<button class="vision-refresh-btn" @click=${props.onRefresh} title="Refresh">
                🔄
              </button>`
              : null
          }
        </div>
      </div>

      <!-- Chief Definite Aim -->
      ${renderCDASection(data.chiefDefiniteAim)}

      <!-- Today's Identity (rotated daily) -->
      ${renderIdentitySection(identityToday)}

      <!-- Annual Themes -->
      ${renderThemesSection(data.annualThemes)}

      <!-- Two-column layout for Values and Anti-Goals -->
      <div class="vision-bottom-grid">
        ${renderValuesSection(data.values)} ${renderAntiGoalsSection(data.antiGoals)}
      </div>
    </div>
  `;
}
