import { html, nothing } from "lit";

// ===== Types =====

export type Goal = {
  id: string;
  title: string;
  area?: string;
  target?: string;
  progress?: number;
  status: "active" | "completed" | "paused";
};

export type GoalsProps = {
  connected: boolean;
  goals: Goal[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onUpdateViaChat?: () => void; // Opens chat with pre-written prompt
};

// ===== Constants =====

const AREA_COLORS: Record<string, string> = {
  professional: "#3b82f6", // blue
  personal: "#10b981", // green
  health: "#ef4444", // red
  financial: "#f59e0b", // amber
  creative: "#a855f7", // purple
  relationship: "#ec4899", // pink
};

const STATUS_LABELS: Record<Goal["status"], string> = {
  active: "Active",
  completed: "Completed",
  paused: "Paused",
};

const STATUS_ICONS: Record<Goal["status"], string> = {
  active: "●",
  completed: "✓",
  paused: "⏸",
};

// ===== Helper Functions =====

function getAreaColor(area?: string): string {
  if (!area) {
    return "var(--mc-text-muted)";
  }
  return AREA_COLORS[area.toLowerCase()] ?? "var(--mc-text-muted)";
}

function groupByStatus(goals: Goal[]): Record<Goal["status"], Goal[]> {
  const groups: Record<Goal["status"], Goal[]> = {
    active: [],
    completed: [],
    paused: [],
  };
  for (const goal of goals) {
    groups[goal.status].push(goal);
  }
  return groups;
}

// ===== Render Functions =====

function renderProgressBar(progress: number) {
  const clamped = Math.max(0, Math.min(100, progress));
  return html`
    <div class="goals-progress-bar">
      <div
        class="goals-progress-fill"
        style="width: ${clamped}%; background: ${clamped >= 100 ? "#10b981" : "var(--mc-accent)"}"
      ></div>
    </div>
    <span class="goals-progress-label">${clamped}%</span>
  `;
}

function renderGoalCard(goal: Goal) {
  const areaColor = getAreaColor(goal.area);

  return html`
    <div class="my-day-card goals-card goals-status-${goal.status}">
      <div class="goals-card-header">
        <div class="goals-card-title">${goal.title}</div>
        <span class="goals-status-indicator goals-status-${goal.status}" title="${STATUS_LABELS[goal.status]}">
          ${STATUS_ICONS[goal.status]}
        </span>
      </div>
      <div class="goals-card-body">
        ${
          goal.area
            ? html`
              <span
                class="goals-area-badge"
                style="background: ${areaColor}22; color: ${areaColor}; border: 1px solid ${areaColor}44;"
              >
                ${goal.area}
              </span>
            `
            : nothing
        }
        ${goal.target ? html`<div class="goals-target-text">${goal.target}</div>` : nothing}
        ${
          goal.progress != null
            ? html`<div class="goals-progress-row">${renderProgressBar(goal.progress)}</div>`
            : nothing
        }
      </div>
    </div>
  `;
}

function renderStatusGroup(label: string, goals: Goal[]) {
  if (goals.length === 0) {
    return nothing;
  }

  return html`
    <div class="goals-group">
      <div class="goals-group-label">
        <span>${label}</span>
        <span class="goals-group-count">${goals.length}</span>
      </div>
      <div class="goals-group-cards">
        ${goals.map((goal) => renderGoalCard(goal))}
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderGoals(props: GoalsProps) {
  if (props.loading) {
    return html`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading goals...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${props.error}</span>
          ${
            props.onRefresh
              ? html`<button class="retry-button" @click=${props.onRefresh}>Retry</button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  const groups = groupByStatus(props.goals);
  const totalActive = groups.active.length;
  const totalCompleted = groups.completed.length;

  return html`
    <div class="my-day-container">
      <!-- Header -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Goals</h1>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${totalActive}</span>
            <span class="summary-label">Active</span>
          </div>
          <div class="my-day-summary-divider"></div>
          <div class="my-day-summary-stat">
            <span class="summary-value">${totalCompleted}</span>
            <span class="summary-label">Done</span>
          </div>
          ${
            props.onUpdateViaChat
              ? html`
                <div class="my-day-summary-divider"></div>
                <button class="goals-chat-btn" @click=${props.onUpdateViaChat} title="Update via Chat">
                  Update via Chat
                </button>
              `
              : nothing
          }
          ${
            props.onRefresh
              ? html`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh">↻</button>
              `
              : nothing
          }
        </div>
      </div>

      <!-- Content -->
      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${
          props.goals.length === 0
            ? html`
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <div class="my-day-empty">No goals yet. Chat to set up your goals.</div>
                  </div>
                </div>
              `
            : html`
              ${renderStatusGroup("ACTIVE", groups.active)}
              ${renderStatusGroup("COMPLETED", groups.completed)}
              ${renderStatusGroup("PAUSED", groups.paused)}
            `
        }
      </div>
    </div>
  `;
}
