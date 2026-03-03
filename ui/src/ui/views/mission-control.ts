import { html, nothing } from "lit";
import type {
  MissionControlData,
  AgentRunView,
  ActivityFeedItem,
  MissionControlStats,
} from "../controllers/mission-control.js";
import { formatDuration } from "../controllers/mission-control.js";

// ===== Types =====

type QueueItemRpc = {
  id: string;
  type: string;
  title: string;
  status: string;
  priority: string;
  source: string;
  createdAt: number;
};

const AGENT_ROLE_NAMES: Record<string, string> = {
  coding: "Builder", research: "Researcher", analysis: "Analyst",
  creative: "Creative", review: "Reviewer", ops: "Ops",
  task: "Agent", url: "Reader", idea: "Explorer",
};

export type MissionControlProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  data: MissionControlData | null;
  fullControl: boolean;
  onToggleFullControl: () => void;
  onRefresh: () => void;
  onCancelTask: (taskId: string) => void;
  onApproveItem: (id: string) => void;
  onRetryItem: (id: string) => void;
  onViewDetail: (agent: AgentRunView) => void;
  onAddToQueue: (type: string, title: string) => void;
  onOpenSession?: (sessionKey: string) => void;
  onOpenTaskSession?: (taskId: string) => void;
  onStartQueueItem?: (itemId: string) => void;
  onAskProsper?: () => void;
};

// ===== Helpers =====

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function feedIcon(type: ActivityFeedItem["type"]): string {
  switch (type) {
    case "started":
      return "\u{25B6}\uFE0F";
    case "completed":
      return "\u2705";
    case "failed":
      return "\u274C";
    case "queued":
      return "\u23F3";
    case "stage":
      return "\u{1F504}";
    default:
      return "\u{1F4CB}";
  }
}

function typeBadgeClass(type: AgentRunView["type"]): string {
  switch (type) {
    case "coding":
      return "mc-type-badge mc-type-badge--coding";
    case "subagent":
      return "mc-type-badge mc-type-badge--subagent";
    case "swarm":
      return "mc-type-badge mc-type-badge--swarm";
    case "queue":
      return "mc-type-badge mc-type-badge--queue";
    default:
      return "mc-type-badge";
  }
}

function statusCardClass(status: AgentRunView["status"]): string {
  return `mc-agent-card mc-agent-card--${status}`;
}

// ===== Sub-renders =====

function renderStatsBanner(stats: MissionControlStats) {
  return html`
    <div class="mc-stats-banner">
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${stats.activeNow}
          ${stats.activeNow > 0 ? html`<span class="mc-active-dot"></span>` : nothing}
        </div>
        <div class="mc-stat-label">Active Now</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">${stats.completedToday}</div>
        <div class="mc-stat-label">Completed Today</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">${stats.failed}</div>
        <div class="mc-stat-label">Failed</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${stats.queueDepth + stats.queueReview}
          ${stats.queueReview > 0 ? html`<span class="mc-active-dot" style="background:#14b8a6"></span>` : nothing}
        </div>
        <div class="mc-stat-label">Queue${stats.queueReview > 0 ? ` (${stats.queueReview} review)` : ""}</div>
      </div>
    </div>
  `;
}

function renderSwarmPipeline(agent: AgentRunView) {
  if (!agent.swarmStages) return nothing;
  const stages = ["design", "build", "qc"] as const;
  return html`
    <div class="mc-pipeline">
      ${stages.map((stage, i) => {
        const s = agent.swarmStages?.[stage];
        const status = s?.status ?? "pending";
        return html`
          ${i > 0 ? html`<span class="mc-pipeline-arrow">\u2192</span>` : nothing}
          <span class="mc-pipeline-stage mc-pipeline-stage--${status}">
            ${stage}
          </span>
        `;
      })}
    </div>
  `;
}

type AgentCardCallbacks = {
  onCancel: (id: string) => void;
  onViewDetail: (agent: AgentRunView) => void;
  onRetry: (id: string) => void;
  onOpenSession?: (sessionKey: string) => void;
  onOpenTaskSession?: (taskId: string) => void;
};

function renderAgentCard(agent: AgentRunView, callbacks: AgentCardCallbacks) {
  const duration =
    agent.startedAt
      ? formatDuration(agent.startedAt, agent.endedAt ?? undefined)
      : null;

  // Determine the "Open" button variant
  const openBtn = agent.childSessionKey && callbacks.onOpenSession
    ? html`<button class="mc-open-session-btn" @click=${() => callbacks.onOpenSession!(agent.childSessionKey!)}>Open</button>`
    : agent.sourceTaskId && callbacks.onOpenTaskSession
      ? html`<button class="mc-open-session-btn" @click=${() => callbacks.onOpenTaskSession!(agent.sourceTaskId!)}>Open Task</button>`
      : nothing;

  return html`
    <div class="${statusCardClass(agent.status)}">
      <div class="mc-agent-card-header">
        <div class="mc-agent-card-info">
          <span class="${typeBadgeClass(agent.type)}">${agent.roleName}</span>
          <span class="mc-agent-card-task">${agent.task}</span>
        </div>
        ${openBtn}
        ${agent.canCancel
          ? html`<button class="mc-cancel-btn" @click=${() => callbacks.onCancel(agent.id)}>Cancel</button>`
          : nothing}
        ${agent.prUrl
          ? html`<button class="mc-pr-btn" @click=${() => callbacks.onViewDetail(agent)}>View PR</button>`
          : nothing}
      </div>
      <div class="mc-agent-card-meta">
        ${duration ? html`<span class="mc-agent-card-duration">${duration}</span>` : nothing}
        ${agent.model ? html`<span class="mc-agent-card-model">${agent.model}</span>` : nothing}
        ${agent.branch ? html`<span class="mc-agent-card-model">${agent.branch}</span>` : nothing}
        ${agent.error && agent.status !== "failed"
          ? html`<span style="color: var(--danger, #ef4444)">${agent.error}</span>`
          : nothing}
      </div>
      ${agent.type === "swarm" ? renderSwarmPipeline(agent) : nothing}
      ${agent.status === "failed" ? html`
        <div class="mc-agent-card-actions">
          <button class="mc-detail-btn" @click=${() => callbacks.onViewDetail(agent)}>View Error</button>
          <button class="mc-retry-btn" @click=${() => callbacks.onRetry(agent.id)}>Retry</button>
        </div>
      ` : nothing}
    </div>
  `;
}

function renderActiveAgents(agents: AgentRunView[], callbacks: AgentCardCallbacks) {
  const active = agents.filter((a) => a.status === "active" || a.status === "queued");
  if (active.length === 0) {
    return html`
      <div class="mc-empty">
        No active agents
        <div class="mc-empty-hint">Your agents will appear here. Drop tasks into the queue or ask your ally to spawn agents.</div>
      </div>
    `;
  }
  return html`
    <div class="mc-agents-grid">
      ${active.map((a) => renderAgentCard(a, callbacks))}
    </div>
  `;
}

function renderReviewItems(
  agents: AgentRunView[],
  onApprove: (id: string) => void,
  onViewDetail: (agent: AgentRunView) => void,
  onOpenTaskSession?: (taskId: string) => void,
) {
  const reviewItems = agents.filter(a => a.isReview === true);
  if (reviewItems.length === 0) return nothing;
  return html`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Ready for Review</h3>
      <div class="mc-agents-grid">
        ${reviewItems.map(item => html`
          <div class="mc-agent-card mc-agent-card--review">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${item.roleName}</span>
                <span class="mc-agent-card-task">${item.task}</span>
              </div>
              ${item.sourceTaskId && onOpenTaskSession
                ? html`<button class="mc-open-session-btn" @click=${() => onOpenTaskSession(item.sourceTaskId!)}>Open Session</button>`
                : nothing}
              <button class="mc-approve-btn" @click=${() => onApprove(item.id)}>Done</button>
              <button class="mc-detail-btn" @click=${() => onViewDetail(item)}>View Output</button>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderPendingQueue(
  items: QueueItemRpc[],
  onStartItem?: (itemId: string) => void,
) {
  const pending = items.filter(i => i.status === "pending");
  if (pending.length === 0) return nothing;
  return html`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Queued (${pending.length})</h3>
      <div class="mc-agents-grid">
        ${pending.map(item => html`
          <div class="mc-agent-card mc-agent-card--queued">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${AGENT_ROLE_NAMES[item.type] ?? item.type}</span>
                <span class="mc-agent-card-task">${item.title}</span>
              </div>
              ${onStartItem
                ? html`<button class="mc-open-session-btn" @click=${() => onStartItem(item.id)}>Start</button>`
                : nothing}
              <span class="mc-priority-badge mc-priority-badge--${item.priority}">${item.priority}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderFeedItem(item: ActivityFeedItem, onViewDetail?: (agent: AgentRunView) => void) {
  const clickable = (item.type === "failed" || item.type === "completed") && item.agentRef;
  return html`
    <div class="mc-feed-item ${clickable ? "mc-feed-item--clickable" : ""}"
         @click=${clickable ? () => onViewDetail?.(item.agentRef!) : nothing}>
      <span class="mc-feed-time">${relativeTime(item.timestamp)}</span>
      <span class="mc-feed-icon">${feedIcon(item.type)}</span>
      <span class="mc-feed-text">${item.summary}</span>
      ${item.prUrl && !clickable
        ? html`<a class="mc-feed-link" href="${item.prUrl}" target="_blank">View PR</a>`
        : nothing}
    </div>
  `;
}

function renderActivityFeed(
  feed: ActivityFeedItem[],
  expanded: boolean,
  onViewDetail?: (agent: AgentRunView) => void,
) {
  if (feed.length === 0) return nothing;

  const visible = expanded ? feed : feed.slice(0, 20);
  const hasMore = !expanded && feed.length > 20;

  return html`
    <div class="mc-feed">
      <h3 class="mc-section-title">Activity Feed</h3>
      <div class="mc-feed-list">
        ${visible.map(item => renderFeedItem(item, onViewDetail))}
      </div>
      ${hasMore
        ? html`<button class="mc-show-more-btn" @click=${() => {
            /* handled via state in parent */
          }}>Show all ${feed.length} events</button>`
        : nothing}
    </div>
  `;
}

function renderRecentCompleted(agents: AgentRunView[], callbacks: AgentCardCallbacks) {
  const completed = agents.filter((a) => a.status === "done" || a.status === "failed");
  // Exclude queue review items — they have their own section
  const nonReview = completed.filter(a => !a.isReview);
  if (nonReview.length === 0) return nothing;

  const recent = nonReview.slice(0, 10);
  return html`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Recent Completed</h3>
      <div class="mc-agents-grid">
        ${recent.map((a) => renderAgentCard(a, callbacks))}
      </div>
    </div>
  `;
}

// ===== Main Render =====

export function renderMissionControl(props: MissionControlProps) {
  if (!props.connected) {
    return html`<div class="mc-section"><div class="mc-empty">Not connected to gateway.</div></div>`;
  }

  if (props.loading && !props.data) {
    return html`<div class="mc-section"><div class="mc-loading">Loading agent data...</div></div>`;
  }

  if (props.error && !props.data) {
    return html`
      <div class="mc-section">
        <div class="mc-empty" style="color: var(--danger, #ef4444)">
          ${props.error}
          <div class="mc-empty-hint">
            <button class="mc-show-more-btn" @click=${props.onRefresh}>Retry</button>
          </div>
        </div>
      </div>
    `;
  }

  const data = props.data;
  if (!data) {
    return html`<div class="mc-section"><div class="mc-empty">No data available.</div></div>`;
  }

  const cardCallbacks: AgentCardCallbacks = {
    onCancel: props.onCancelTask,
    onViewDetail: props.onViewDetail,
    onRetry: props.onRetryItem,
    onOpenSession: props.onOpenSession,
    onOpenTaskSession: props.onOpenTaskSession,
  };

  return html`
    <div class="mc-section">
      <div class="mc-header-row">
        <button class="mc-full-control-toggle" @click=${props.onToggleFullControl}>
          ${props.fullControl ? "Simplified" : "Full Control"}
        </button>
      </div>

      ${renderStatsBanner(data.stats)}

      <div class="mc-two-col">
        <div class="mc-col-main">
          <h3 class="mc-section-title">Active Agents</h3>
          ${renderActiveAgents(data.agents, cardCallbacks)}

          ${renderReviewItems(data.agents, props.onApproveItem, props.onViewDetail, props.onOpenTaskSession)}

          ${renderPendingQueue(data.queueItems, props.onStartQueueItem)}

          ${renderActivityFeed(data.activityFeed, false, props.onViewDetail)}
        </div>

        <div class="mc-col-side">
          ${renderRecentCompleted(data.agents, cardCallbacks)}
        </div>
      </div>
    </div>
  `;
}
