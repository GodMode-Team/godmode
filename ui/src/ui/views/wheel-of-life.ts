import { html, svg } from "lit";

// ===== Types =====

export type SpokeTrend = "up" | "down" | "stable";

export type SpokeData = {
  current: number;
  target: number;
  trend: SpokeTrend;
  lastUpdated: string;
};

export type WheelOfLifeData = {
  asOf: string;
  scores: Record<string, SpokeData>;
  history: Array<{ date: string; scores: Record<string, number> }>;
  overallBalance: number;
  lowestSpoke: string;
  biggestGap: string;
};

export type WheelOfLifeProps = {
  connected: boolean;
  data: WheelOfLifeData | null;
  loading?: boolean;
  error?: string | null;
  editMode?: boolean;
  onRefresh?: () => void;
  onEdit?: () => void;
  onSave?: (updates: Record<string, { current?: number; target?: number }>) => void;
  onCancel?: () => void;
  onUpdateViaChat?: () => void;
};

// ===== Constants =====

const SPOKE_ORDER = [
  "health",
  "wealth",
  "career",
  "relationships",
  "fun",
  "environment",
  "growth",
  "contribution",
];

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

const SPOKE_ICONS: Record<string, string> = {
  health: "💪",
  wealth: "💰",
  career: "🚀",
  relationships: "❤️",
  fun: "🎉",
  environment: "🏠",
  growth: "📚",
  contribution: "🤝",
};

// ===== Helper Functions =====

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTrendIcon(trend: SpokeTrend): string {
  switch (trend) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "stable":
      return "→";
  }
}

function getTrendClass(trend: SpokeTrend): string {
  switch (trend) {
    case "up":
      return "trend-up";
    case "down":
      return "trend-down";
    case "stable":
      return "trend-stable";
  }
}

function getScoreClass(score: number): string {
  if (score <= 4) {
    return "score-low";
  }
  if (score <= 6) {
    return "score-medium";
  }
  return "score-high";
}

// ===== Radar Chart Component =====

function renderRadarChart(scores: Record<string, SpokeData>) {
  const cx = 150;
  const cy = 150;
  const radius = 120;
  const angleStep = (2 * Math.PI) / SPOKE_ORDER.length;

  // Generate points for current scores
  const currentPoints = SPOKE_ORDER.map((spoke, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start at top
    const value = (scores[spoke]?.current ?? 5) / 10;
    const x = cx + Math.cos(angle) * radius * value;
    const y = cy + Math.sin(angle) * radius * value;
    return `${x},${y}`;
  }).join(" ");

  // Generate points for target scores
  const targetPoints = SPOKE_ORDER.map((spoke, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = (scores[spoke]?.target ?? 8) / 10;
    const x = cx + Math.cos(angle) * radius * value;
    const y = cy + Math.sin(angle) * radius * value;
    return `${x},${y}`;
  }).join(" ");

  return html`
    <div class="wheel-chart-container">
      <svg viewBox="0 0 300 300" class="wheel-chart">
        <!-- Grid circles -->
        ${[2, 4, 6, 8, 10].map(
          (level) => svg`
            <circle
              cx="${cx}"
              cy="${cy}"
              r="${(radius * level) / 10}"
              fill="none"
              stroke="var(--border)"
              stroke-opacity="0.3"
              stroke-dasharray="${level === 10 ? "none" : "2,2"}"
            />
          `,
        )}

        <!-- Spoke lines -->
        ${SPOKE_ORDER.map((spoke, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = cx + Math.cos(angle) * radius;
          const y2 = cy + Math.sin(angle) * radius;
          return svg`
            <line
              x1="${cx}"
              y1="${cy}"
              x2="${x2}"
              y2="${y2}"
              stroke="var(--border)"
              stroke-opacity="0.5"
            />
          `;
        })}

        <!-- Target polygon (dashed) -->
        <polygon
          points="${targetPoints}"
          fill="none"
          stroke="var(--text-muted)"
          stroke-width="1.5"
          stroke-dasharray="4,4"
          stroke-opacity="0.5"
        />

        <!-- Current scores polygon -->
        <polygon
          points="${currentPoints}"
          fill="var(--accent)"
          fill-opacity="0.25"
          stroke="var(--accent)"
          stroke-width="2.5"
        />

        <!-- Score dots -->
        ${SPOKE_ORDER.map((spoke, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = (scores[spoke]?.current ?? 5) / 10;
          const x = cx + Math.cos(angle) * radius * value;
          const y = cy + Math.sin(angle) * radius * value;
          return svg`
            <circle
              cx="${x}"
              cy="${y}"
              r="5"
              fill="var(--accent)"
              stroke="var(--bg)"
              stroke-width="2"
            />
          `;
        })}

        <!-- Spoke labels -->
        ${SPOKE_ORDER.map((spoke, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = cx + Math.cos(angle) * labelRadius;
          const y = cy + Math.sin(angle) * labelRadius;
          const score = scores[spoke]?.current ?? 5;
          return svg`
            <text
              x="${x}"
              y="${y}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="var(--text)"
              font-size="11"
              font-weight="500"
            >
              ${SPOKE_ICONS[spoke]} ${score}
            </text>
          `;
        })}
      </svg>
    </div>
  `;
}

// ===== Spoke Cards =====

function renderSpokeCards(
  scores: Record<string, SpokeData>,
  editMode: boolean,
  pendingUpdates: Record<string, { current?: number; target?: number }>,
) {
  return html`
    <div class="wheel-spokes-grid">
      ${SPOKE_ORDER.map((spoke) => {
        const data = scores[spoke];
        if (!data) {
          return null;
        }

        const pendingCurrent = pendingUpdates[spoke]?.current;
        const displayCurrent = pendingCurrent ?? data.current;
        const gap = data.target - displayCurrent;

        return html`
          <div class="wheel-spoke-card ${getScoreClass(displayCurrent)}">
            <div class="spoke-card-header">
              <span class="spoke-icon">${SPOKE_ICONS[spoke]}</span>
              <span class="spoke-name">${SPOKE_LABELS[spoke]}</span>
              <span class="spoke-trend ${getTrendClass(data.trend)}">
                ${getTrendIcon(data.trend)}
              </span>
            </div>
            <div class="spoke-card-body">
              ${
                editMode
                  ? html`
                    <div class="spoke-edit-row">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        .value="${String(displayCurrent)}"
                        class="spoke-slider"
                        data-spoke="${spoke}"
                      />
                      <span class="spoke-value-display">${displayCurrent}</span>
                    </div>
                  `
                  : html`
                    <div class="spoke-scores">
                      <div class="spoke-current">
                        <span class="spoke-score-value">${data.current}</span>
                        <span class="spoke-score-label">current</span>
                      </div>
                      <div class="spoke-target">
                        <span class="spoke-score-value">${data.target}</span>
                        <span class="spoke-score-label">target</span>
                      </div>
                      ${
                        gap > 0
                          ? html`
                            <div class="spoke-gap">
                              <span class="spoke-gap-value">-${gap}</span>
                              <span class="spoke-score-label">gap</span>
                            </div>
                          `
                          : null
                      }
                    </div>
                  `
              }
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

// ===== Main Render Function =====

export function renderWheelOfLife(props: WheelOfLifeProps) {
  if (props.loading) {
    return html`
      <div class="wheel-container">
        <div class="wheel-loading">
          <div class="spinner"></div>
          <span>Loading Wheel of Life...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="wheel-container">
        <div class="wheel-error">
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
      <div class="wheel-container">
        <div class="wheel-empty">
          <span class="empty-icon">🎯</span>
          <span>No wheel data yet. Start tracking your life balance!</span>
          ${
            props.onRefresh
              ? html`<button class="primary-button" @click=${props.onRefresh}>Load Data</button>`
              : null
          }
        </div>
      </div>
    `;
  }

  const { data, editMode = false } = props;
  const pendingUpdates: Record<string, { current?: number; target?: number }> = {};

  // Calculate alerts
  const lowSpokes = SPOKE_ORDER.filter((spoke) => (data.scores[spoke]?.current ?? 5) <= 4);

  return html`
    <div class="wheel-container">
      <!-- Header -->
      <div class="wheel-header">
        <div class="wheel-header-left">
          <h1 class="wheel-title">Wheel of Life</h1>
          <p class="wheel-subtitle">
            Track balance across 8 life dimensions with scores, targets, and trends.
          </p>
        </div>
        <div class="wheel-header-right">
          <div class="wheel-summary-stat">
            <span class="summary-value">${data.overallBalance.toFixed(1)}</span>
            <span class="summary-label">Balance</span>
          </div>
          <div class="wheel-summary-divider"></div>
          <div class="wheel-summary-stat">
            <span class="summary-value">${lowSpokes.length}</span>
            <span class="summary-label">Alerts</span>
          </div>
          <div class="wheel-summary-divider"></div>
          <div class="wheel-status ${props.connected ? "online" : "offline"}">
            <span class="status-indicator status-${props.connected ? "working" : "idle"}"></span>
            <span class="status-label">${props.connected ? "ONLINE" : "OFFLINE"}</span>
          </div>
          ${
            props.onUpdateViaChat && !editMode
              ? html`<button class="goals-chat-btn" @click=${props.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`
              : null
          }
          ${
            props.onRefresh && !editMode
              ? html`<button class="wheel-refresh-btn" @click=${props.onRefresh} title="Refresh">
                🔄
              </button>`
              : null
          }
          ${
            props.onEdit && !editMode
              ? html`<button class="wheel-edit-btn" @click=${props.onEdit} title="Edit scores">
                ✏️ Update
              </button>`
              : null
          }
          ${
            editMode && props.onSave && props.onCancel
              ? html`
                <button class="wheel-save-btn" @click=${() => props.onSave!(pendingUpdates)}>
                  💾 Save
                </button>
                <button class="wheel-cancel-btn" @click=${props.onCancel}>Cancel</button>
              `
              : null
          }
        </div>
      </div>

      <!-- Date badge -->
      <div class="wheel-date-badge">As of ${formatDate(data.asOf)}</div>

      <!-- Alerts -->
      ${
        lowSpokes.length > 0
          ? html`
            <div class="wheel-alerts">
              <div class="wheel-alert warning">
                <span class="alert-icon">⚠️</span>
                <span class="alert-text">
                  <strong>Attention needed:</strong>
                  ${lowSpokes.map((s) => SPOKE_LABELS[s]).join(", ")}
                  ${lowSpokes.length === 1 ? "is" : "are"} below 5
                </span>
              </div>
            </div>
          `
          : null
      }

      <!-- Main content grid -->
      <div class="wheel-content">
        <!-- Radar chart -->
        <div class="wheel-chart-section">${renderRadarChart(data.scores)}</div>

        <!-- Spoke cards -->
        <div class="wheel-spokes-section">
          ${renderSpokeCards(data.scores, editMode, pendingUpdates)}
        </div>
      </div>

      <!-- Insights -->
      <div class="wheel-insights">
        <div class="wheel-insight">
          <span class="insight-icon">📉</span>
          <span class="insight-label">Lowest</span>
          <span class="insight-value">${SPOKE_LABELS[data.lowestSpoke] ?? "—"}</span>
        </div>
        <div class="wheel-insight">
          <span class="insight-icon">🎯</span>
          <span class="insight-label">Biggest Gap</span>
          <span class="insight-value">${SPOKE_LABELS[data.biggestGap] ?? "—"}</span>
        </div>
      </div>
    </div>
  `;
}
