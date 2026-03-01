import { html, nothing } from "lit";
import type {
  IntelInsight,
  ScoutFinding,
  UserPatterns,
  IntelStatus,
} from "../controllers/proactive-intel";

export type ProactiveIntelProps = {
  insights: IntelInsight[];
  discoveries: ScoutFinding[];
  patterns: UserPatterns | null;
  status: IntelStatus | null;
  loading: boolean;
  error: string | null;
  onDismiss: (id: string) => void;
  onAct: (id: string) => void;
  onRefresh: () => void;
};

const PRIORITY_BADGE: Record<string, string> = {
  urgent: "badge-danger",
  high: "badge-warning",
  medium: "badge-info",
  low: "badge-muted",
};

const CATEGORY_LABEL: Record<string, string> = {
  "new-feature": "New Feature",
  "skill-recommendation": "Skill",
  "config-optimization": "Config",
  "workflow-suggestion": "Workflow",
  "trend-alert": "Trend",
  "goal-nudge": "Goal",
  "health-warning": "Health",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function renderProactiveIntel(props: ProactiveIntelProps) {
  return html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${renderHeader(props)}
      ${props.error
        ? props.error.includes("unknown method")
          ? html`<div class="callout info">Insights service not yet active. Restart the gateway to enable: <code>openclaw gateway restart</code></div>`
          : html`<div class="callout danger">${props.error}</div>`
        : nothing}
      ${props.loading ? html`<div class="callout info">Scanning sources...</div>` : nothing}
      ${renderInsights(props)}
      ${renderPatternsSummary(props)}
      ${renderDiscoveries(props)}
      ${renderServiceStatus(props)}
    </div>
  `;
}

function renderHeader(props: ProactiveIntelProps) {
  return html`
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <h3 style="margin: 0;">\u{1F441}\uFE0F Insights</h3>
        <p style="margin: 4px 0 0; opacity: 0.6; font-size: 0.85em;">
          GodMode watches external sources and your patterns to help you improve.
        </p>
      </div>
      <button
        class="btn btn-sm"
        ?disabled=${props.loading}
        @click=${() => props.onRefresh()}
      >
        ${props.loading ? "Scanning..." : "Refresh All"}
      </button>
    </div>
  `;
}

function renderInsights(props: ProactiveIntelProps) {
  const active = props.insights.filter((i) => !i.dismissed && !i.actedOn);
  if (active.length === 0) {
    return html`
      <div class="card" style="padding: 16px; text-align: center; opacity: 0.6;">
        No active insights. GodMode is watching for opportunities.
      </div>
    `;
  }

  return html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <h4 style="margin: 0;">Active Insights (${active.length})</h4>
      ${active.map(
        (insight) => html`
          <div class="card" style="padding: 12px;">
            <div style="display: flex; align-items: start; gap: 8px;">
              <span class="badge ${PRIORITY_BADGE[insight.priority] ?? "badge-muted"}" style="flex-shrink: 0; font-size: 0.75em;">
                ${CATEGORY_LABEL[insight.category] ?? insight.category}
              </span>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.9em;">${insight.title}</div>
                <div style="font-size: 0.8em; opacity: 0.7; margin-top: 4px;">${insight.body}</div>
                <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                  ${insight.action
                    ? html`<button class="btn btn-xs btn-primary" @click=${() => props.onAct(insight.id)}>
                        ${insight.action.label}
                      </button>`
                    : nothing}
                  <button class="btn btn-xs" @click=${() => props.onDismiss(insight.id)}>Dismiss</button>
                  <span style="font-size: 0.7em; opacity: 0.5; margin-left: auto;">${timeAgo(insight.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        `,
      )}
    </div>
  `;
}

function renderPatternsSummary(props: ProactiveIntelProps) {
  if (!props.patterns) return nothing;
  const p = props.patterns;

  const stats = [
    { label: "Completion Rate (7d)", value: `${Math.round(p.taskPatterns.completionRate7d * 100)}%` },
    { label: "Tasks/Day", value: p.taskPatterns.avgTasksPerDay.toFixed(1) },
    { label: "Stuck Tasks", value: String(p.taskPatterns.stuckTasks.length) },
    { label: "Active Days (7d)", value: String(p.activityPatterns.activeDaysLast7d) },
    { label: "Coding Sessions (7d)", value: String(p.codingPatterns.totalSessionsLast7d) },
    { label: "Stalled Goals", value: String(p.goalStatus.stalledGoals.length) },
  ];

  return html`
    <div>
      <h4 style="margin: 0 0 8px;">Your Patterns</h4>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        ${stats.map(
          (s) => html`
            <div class="card" style="padding: 10px; text-align: center;">
              <div style="font-size: 1.2em; font-weight: 700;">${s.value}</div>
              <div style="font-size: 0.7em; opacity: 0.6;">${s.label}</div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

function renderDiscoveries(props: ProactiveIntelProps) {
  if (props.discoveries.length === 0) return nothing;

  const recent = props.discoveries.slice(0, 10);

  return html`
    <div>
      <h4 style="margin: 0 0 8px;">Recent Discoveries (${props.discoveries.length})</h4>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        ${recent.map(
          (f) => html`
            <div style="padding: 8px 12px; border-radius: 6px; background: var(--surface-1, #1e1e2e); display: flex; align-items: start; gap: 8px;">
              <span style="font-size: 0.7em; opacity: 0.5; flex-shrink: 0; padding-top: 2px;">
                ${f.source}
              </span>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.85em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${f.url
                    ? html`<a href=${f.url} target="_blank" rel="noopener" style="color: var(--link-color, #4ecdc4);">${f.title}</a>`
                    : f.title}
                </div>
              </div>
              <span style="font-size: 0.7em; opacity: 0.4; flex-shrink: 0;">${timeAgo(f.discoveredAt)}</span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

function renderServiceStatus(props: ProactiveIntelProps) {
  if (!props.status) return nothing;
  const s = props.status;

  return html`
    <div style="font-size: 0.75em; opacity: 0.5; display: flex; gap: 12px; flex-wrap: wrap;">
      <span>Status: ${s.running ? "Running" : "Stopped"}</span>
      ${s.lastScoutRun ? html`<span>Scout: ${timeAgo(s.lastScoutRun)}</span>` : nothing}
      ${s.lastObserverRun ? html`<span>Observer: ${timeAgo(s.lastObserverRun)}</span>` : nothing}
      ${s.lastAdvisorRun ? html`<span>Advisor: ${timeAgo(s.lastAdvisorRun)}</span>` : nothing}
      <span>Findings: ${s.totalFindings}</span>
      <span>Insights: ${s.totalInsights}</span>
    </div>
  `;
}
