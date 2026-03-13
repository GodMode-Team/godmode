import { html, nothing } from "lit";
import type {
  MissionControlData,
  AgentRunView,
  ActivityFeedItem,
  MissionControlStats,
  SwarmData,
  SwarmProjectDetail,
  SwarmAgentState,
  SwarmIssueNode,
  SwarmFeedEvent,
  SwarmProject,
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
  onAskAlly?: () => void;
  allyName?: string;
  onViewTaskFiles?: (itemId: string) => void;
  onSelectSwarmProject?: (projectId: string) => void;
  onSteerSwarmAgent?: (projectId: string, issueTitle: string, instructions: string) => void;
  onViewProofDoc?: (docSlug: string) => void;
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

function renderStatusLine(stats: MissionControlStats) {
  const parts: string[] = [];
  if (stats.activeNow > 0) parts.push(`${stats.activeNow} agent${stats.activeNow > 1 ? "s" : ""} working`);
  if (stats.queueReview > 0) parts.push(`${stats.queueReview} need${stats.queueReview > 1 ? "" : "s"} your attention`);
  if (stats.completedToday > 0) parts.push(`${stats.completedToday} done today`);
  if (parts.length === 0) {
    parts.push("Nothing running");
    if (stats.completedToday > 0) parts.push(`${stats.completedToday} completed today`);
  }
  return html`
    <div class="mc-status-line">
      ${stats.activeNow > 0 ? html`<span class="mc-active-dot"></span>` : nothing}
      <span>${parts.join(" \u00B7 ")}</span>
    </div>
  `;
}

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

// Track which compact cards are expanded inline
const expandedAgentIds = new Set<string>();

function renderAgentCard(agent: AgentRunView, callbacks: AgentCardCallbacks, compact = false) {
  const duration =
    agent.startedAt
      ? formatDuration(agent.startedAt, agent.endedAt ?? undefined)
      : null;

  // Determine the "Open" button variant
  const openBtn = agent.childSessionKey && callbacks.onOpenSession
    ? html`<button class="mc-open-session-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onOpenSession!(agent.childSessionKey!); }}>Open</button>`
    : agent.sourceTaskId && callbacks.onOpenTaskSession
      ? html`<button class="mc-open-session-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onOpenTaskSession!(agent.sourceTaskId!); }}>Open Task</button>`
      : nothing;

  // Compact mode: show minimal card, click to expand
  if (compact && !expandedAgentIds.has(agent.id)) {
    return html`
      <div class="${statusCardClass(agent.status)} mc-agent-card--compact"
           @click=${() => { expandedAgentIds.add(agent.id); /* triggers re-render via parent */ }}>
        <div class="mc-agent-card-header">
          <div class="mc-agent-card-info">
            <span class="${typeBadgeClass(agent.type)}">${agent.roleName}</span>
            <span class="mc-agent-card-task">${agent.task}</span>
          </div>
          ${duration ? html`<span class="mc-agent-card-duration">${duration}</span>` : nothing}
          ${openBtn}
        </div>
      </div>
    `;
  }

  return html`
    <div class="${statusCardClass(agent.status)}"
         ${compact ? html`` : nothing}
         @click=${compact ? () => { expandedAgentIds.delete(agent.id); } : nothing}>
      <div class="mc-agent-card-header">
        <div class="mc-agent-card-info">
          <span class="${typeBadgeClass(agent.type)}">${agent.roleName}</span>
          <span class="mc-agent-card-task">${agent.task}</span>
        </div>
        ${openBtn}
        ${agent.canCancel
          ? html`<button class="mc-cancel-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onCancel(agent.id); }}>Cancel</button>`
          : nothing}
        ${agent.prUrl
          ? html`<button class="mc-pr-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onViewDetail(agent); }}>View PR</button>`
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
          <button class="mc-detail-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onViewDetail(agent); }}>View Error</button>
          <button class="mc-retry-btn" @click=${(e: Event) => { e.stopPropagation(); callbacks.onRetry(agent.id); }}>Retry</button>
        </div>
      ` : nothing}
    </div>
  `;
}

function renderActiveAgents(agents: AgentRunView[], callbacks: AgentCardCallbacks, compact = false) {
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
      ${active.map((a) => renderAgentCard(a, callbacks, compact))}
    </div>
  `;
}

function renderReviewItems(
  agents: AgentRunView[],
  onApprove: (id: string) => void,
  onViewDetail: (agent: AgentRunView) => void,
  onOpenTaskSession?: (taskId: string) => void,
  onViewTaskFiles?: (itemId: string) => void,
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
              ${onViewTaskFiles
                ? html`<button class="mc-detail-btn" @click=${() => onViewTaskFiles(item.id)}>Files</button>`
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

function renderAttentionItems(
  agents: AgentRunView[],
  callbacks: AgentCardCallbacks,
  onApprove: (id: string) => void,
) {
  const attention = agents.filter(a => a.isReview === true || a.status === "failed");
  if (attention.length === 0) {
    return html`
      <div class="mc-attention-section">
        <div class="mc-attention-empty">
          Nothing needs you right now.
        </div>
      </div>
    `;
  }
  return html`
    <div class="mc-attention-section">
      <h3 class="mc-section-title">Needs Your Attention</h3>
      <div class="mc-agents-grid">
        ${attention.map(item => html`
          <div class="mc-attention-card mc-agent-card--${item.isReview ? "review" : "failed"}">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-agent-card-task">${item.task}</span>
              </div>
              ${item.isReview ? html`
                <button class="mc-approve-btn" @click=${() => onApprove(item.id)}>Done</button>
                <button class="mc-detail-btn" @click=${() => callbacks.onViewDetail(item)}>View</button>
              ` : html`
                <button class="mc-detail-btn" @click=${() => callbacks.onViewDetail(item)}>View Error</button>
                <button class="mc-retry-btn" @click=${() => callbacks.onRetry(item.id)}>Retry</button>
              `}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderQueueDepthHint(items: QueueItemRpc[]) {
  const pending = items.filter(i => i.status === "pending");
  if (pending.length === 0) return nothing;
  return html`<div class="mc-queue-depth-text">${pending.length} more queued</div>`;
}

function renderIdleCta(onAskAlly?: () => void, allyName = "Ally") {
  if (!onAskAlly) return nothing;
  return html`
    <div class="mc-idle-cta">
      <p>${allyName} is idle.</p>
      <button class="mc-open-session-btn" @click=${onAskAlly}>Ask ${allyName} what to work on</button>
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

// Module-level state for feed collapse toggle (survives re-renders within same session)
let feedCollapsed = true;

function renderActivityFeed(
  feed: ActivityFeedItem[],
  expanded: boolean,
  onViewDetail?: (agent: AgentRunView) => void,
  initiallyCollapsed = false,
) {
  if (feed.length === 0) return nothing;

  // In collapsed mode, show only a toggle header
  if (initiallyCollapsed && feedCollapsed) {
    return html`
      <div class="mc-feed">
        <div class="mc-collapsible-header" @click=${() => { feedCollapsed = false; }}>
          <span class="mc-collapsible-chevron">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${feed.length})</h3>
        </div>
      </div>
    `;
  }

  const visible = expanded ? feed : feed.slice(0, 20);
  const hasMore = !expanded && feed.length > 20;

  return html`
    <div class="mc-feed">
      ${initiallyCollapsed ? html`
        <div class="mc-collapsible-header" @click=${() => { feedCollapsed = true; }}>
          <span class="mc-collapsible-chevron mc-collapsible-chevron--open">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${feed.length})</h3>
        </div>
      ` : html`
        <h3 class="mc-section-title">Activity Feed</h3>
      `}
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

// ===== Swarm Renders =====

function swarmAgentAvatar(name: string): string {
  // First letter of each word for avatar initials
  return name.split(" ").map(w => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

function swarmIssueStatusClass(status: string): string {
  switch (status) {
    case "done": case "in_review": return "mc-swarm-node--done";
    case "in_progress": return "mc-swarm-node--active";
    case "failed": case "cancelled": return "mc-swarm-node--failed";
    default: return "mc-swarm-node--pending";
  }
}

function renderSwarmProjectSwitcher(
  projects: SwarmProject[],
  selectedId: string | null,
  onSelect?: (projectId: string) => void,
) {
  if (projects.length <= 1) return nothing;
  return html`
    <div class="mc-swarm-switcher">
      ${projects.map(p => html`
        <button
          class="mc-swarm-switcher-btn ${p.projectId === selectedId ? "mc-swarm-switcher-btn--active" : ""}"
          @click=${() => onSelect?.(p.projectId)}>
          <span class="mc-swarm-switcher-title">${p.title}</span>
          <span class="mc-swarm-switcher-meta">${p.completedCount}/${p.issueCount}</span>
        </button>
      `)}
    </div>
  `;
}

function renderSwarmOrgChart(
  detail: SwarmProjectDetail,
  onSteer?: (projectId: string, issueTitle: string, instructions: string) => void,
  onViewProofDoc?: (docSlug: string) => void,
) {
  if (!detail.issues || detail.issues.length === 0) return nothing;

  return html`
    <div class="mc-swarm-org">
      <h3 class="mc-section-title">Pipeline</h3>
      <div class="mc-swarm-graph">
        ${detail.issues.map((issue, i) => html`
          ${i > 0 ? html`<div class="mc-swarm-connector"></div>` : nothing}
          <div class="mc-swarm-node ${swarmIssueStatusClass(issue.status)}"
               @click=${() => {
                 if (steeringTarget === issue.title) {
                   steeringTarget = null;
                 } else {
                   steeringTarget = issue.title;
                   steeringProjectId = detail.projectId;
                 }
               }}>
            <div class="mc-swarm-node-avatar">${swarmAgentAvatar(issue.personaName)}</div>
            <div class="mc-swarm-node-info">
              <div class="mc-swarm-node-persona">${issue.personaName}</div>
              <div class="mc-swarm-node-task">${issue.title}</div>
              <div class="mc-swarm-node-status">${issue.status.replace(/_/g, " ")}</div>
            </div>
            <div class="mc-swarm-node-actions">
              ${issue.proofDocSlug && onViewProofDoc ? html`
                <button class="mc-detail-btn" @click=${(e: Event) => { e.stopPropagation(); onViewProofDoc(issue.proofDocSlug!); }}>Doc</button>
              ` : nothing}
            </div>
          </div>
          ${steeringTarget === issue.title ? renderSteeringInline(detail.projectId, issue.title, onSteer) : nothing}
        `)}
      </div>
    </div>
  `;
}

// Module-level steering state
let steeringTarget: string | null = null;
let steeringProjectId: string | null = null;
let steeringText = "";

function renderSteeringInline(
  projectId: string,
  issueTitle: string,
  onSteer?: (projectId: string, issueTitle: string, instructions: string) => void,
) {
  return html`
    <div class="mc-steer-panel">
      <div class="mc-steer-label">Steer: ${issueTitle}</div>
      <div class="mc-steer-row">
        <input
          class="mc-steer-input"
          type="text"
          placeholder="Give feedback or instructions..."
          .value=${steeringText}
          @input=${(e: Event) => { steeringText = (e.target as HTMLInputElement).value; }}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" && steeringText.trim()) {
              onSteer?.(projectId, issueTitle, steeringText.trim());
              steeringText = "";
              steeringTarget = null;
            }
          }}
        />
        <button class="mc-steer-send" @click=${() => {
          if (steeringText.trim()) {
            onSteer?.(projectId, issueTitle, steeringText.trim());
            steeringText = "";
            steeringTarget = null;
          }
        }}>Send</button>
      </div>
    </div>
  `;
}

function renderSwarmAgentCards(agents: SwarmAgentState[]) {
  if (agents.length === 0) return nothing;

  return html`
    <div class="mc-swarm-agents">
      <h3 class="mc-section-title">Team</h3>
      <div class="mc-swarm-agents-grid">
        ${agents.map(agent => {
          const elapsed = agent.startedAt ? formatDuration(agent.startedAt, agent.endedAt ?? undefined) : null;
          const heartbeatAge = agent.lastHeartbeat
            ? Math.floor((Date.now() - agent.lastHeartbeat) / 1000)
            : null;
          return html`
            <div class="mc-swarm-agent-card mc-swarm-agent-card--${agent.status}">
              <div class="mc-swarm-agent-header">
                <div class="mc-swarm-node-avatar">${swarmAgentAvatar(agent.personaName)}</div>
                <div class="mc-swarm-agent-name">${agent.personaName}</div>
                ${agent.status === "working" ? html`<span class="mc-active-dot"></span>` : nothing}
              </div>
              ${agent.currentTask ? html`
                <div class="mc-swarm-agent-task">${agent.currentTask}</div>
              ` : html`
                <div class="mc-swarm-agent-task mc-swarm-agent-task--idle">${agent.status}</div>
              `}
              <div class="mc-swarm-agent-meta">
                ${elapsed ? html`<span>${elapsed}</span>` : nothing}
                ${agent.progress != null ? html`
                  <div class="mc-swarm-progress">
                    <div class="mc-swarm-progress-bar" style="width:${agent.progress}%"></div>
                  </div>
                  <span>${agent.progress}%</span>
                ` : nothing}
                ${agent.tokenSpend != null ? html`<span>${(agent.tokenSpend / 1000).toFixed(1)}k tok</span>` : nothing}
                ${heartbeatAge != null ? html`<span class="mc-swarm-heartbeat">${heartbeatAge}s ago</span>` : nothing}
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

function renderSwarmBudget(detail: SwarmProjectDetail) {
  if (!detail.tokenSpend && !detail.agents.some(a => a.tokenSpend != null)) return nothing;
  const totalTokens = detail.agents.reduce((sum, a) => sum + (a.tokenSpend ?? 0), 0) || detail.tokenSpend || 0;
  if (totalTokens === 0) return nothing;

  return html`
    <div class="mc-swarm-budget">
      <h3 class="mc-section-title">Budget</h3>
      <div class="mc-swarm-budget-total">${(totalTokens / 1000).toFixed(1)}k tokens</div>
      ${detail.agents.filter(a => a.tokenSpend).map(a => html`
        <div class="mc-swarm-budget-row">
          <span>${a.personaName}</span>
          <span>${((a.tokenSpend ?? 0) / 1000).toFixed(1)}k</span>
        </div>
      `)}
    </div>
  `;
}

function swarmFeedIcon(type: SwarmFeedEvent["type"]): string {
  switch (type) {
    case "agent_started": return "\u{25B6}\uFE0F";
    case "agent_completed": return "\u2705";
    case "agent_failed": return "\u274C";
    case "handoff": return "\u{1F91D}";
    case "steering": return "\u{1F3AF}";
    case "project_completed": return "\u{1F389}";
    case "project_failed": return "\u{1F6A8}";
    default: return "\u{1F4CB}";
  }
}

function renderSwarmFeed(events: SwarmFeedEvent[]) {
  if (events.length === 0) return nothing;
  return html`
    <div class="mc-feed">
      <h3 class="mc-section-title">Team Activity</h3>
      <div class="mc-feed-list">
        ${events.slice(0, 30).map(ev => html`
          <div class="mc-feed-item">
            <span class="mc-feed-time">${relativeTime(ev.timestamp)}</span>
            <span class="mc-feed-icon">${swarmFeedIcon(ev.type)}</span>
            <span class="mc-feed-text">${ev.summary}</span>
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderSwarmDeliverables(
  detail: SwarmProjectDetail,
  onViewProofDoc?: (docSlug: string) => void,
) {
  const completedWithDocs = detail.issues.filter(i =>
    (i.status === "done" || i.status === "in_review") && i.proofDocSlug,
  );
  if (completedWithDocs.length === 0) return nothing;

  return html`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Deliverables (${completedWithDocs.length})</h3>
      <div class="mc-swarm-deliverables">
        ${completedWithDocs.map(issue => html`
          <div class="mc-swarm-deliverable">
            <div class="mc-swarm-deliverable-info">
              <span class="mc-swarm-deliverable-persona">${issue.personaName}</span>
              <span class="mc-swarm-deliverable-title">${issue.title}</span>
            </div>
            ${onViewProofDoc ? html`
              <button class="mc-detail-btn" @click=${() => onViewProofDoc(issue.proofDocSlug!)}>Review</button>
            ` : nothing}
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderSwarmSection(
  swarm: SwarmData,
  props: MissionControlProps,
) {
  if (!swarm.running || swarm.projects.length === 0) return nothing;

  return html`
    <div class="mc-swarm-section">
      <div class="mc-swarm-header">
        <h2 class="mc-section-title" style="font-size:0.9375rem; margin:0">Team Projects</h2>
        ${swarm.running ? html`<span class="mc-active-dot"></span>` : nothing}
      </div>

      ${renderSwarmProjectSwitcher(swarm.projects, swarm.selectedProjectId, props.onSelectSwarmProject)}

      ${swarm.detail ? html`
        ${renderSwarmOrgChart(swarm.detail, props.onSteerSwarmAgent, props.onViewProofDoc)}
        ${renderSwarmAgentCards(swarm.detail.agents)}
        ${renderSwarmBudget(swarm.detail)}
        ${renderSwarmDeliverables(swarm.detail, props.onViewProofDoc)}
      ` : nothing}

      ${renderSwarmFeed(swarm.feed)}
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

      ${props.fullControl ? renderStatsBanner(data.stats) : renderStatusLine(data.stats)}

      ${props.fullControl ? html`
        ${data.swarm ? renderSwarmSection(data.swarm, props) : nothing}
        <div class="mc-two-col">
          <div class="mc-col-main">
            <h3 class="mc-section-title">Active Agents</h3>
            ${renderActiveAgents(data.agents, cardCallbacks)}

            ${renderReviewItems(data.agents, props.onApproveItem, props.onViewDetail, props.onOpenTaskSession, props.onViewTaskFiles)}

            ${renderPendingQueue(data.queueItems, props.onStartQueueItem)}

            ${renderActivityFeed(data.activityFeed, false, props.onViewDetail)}
          </div>

          <div class="mc-col-side">
            ${renderRecentCompleted(data.agents, cardCallbacks)}
          </div>
        </div>
      ` : html`
        <div>
          ${data.swarm ? renderSwarmSection(data.swarm, props) : nothing}

          ${renderAttentionItems(data.agents, cardCallbacks, props.onApproveItem)}

          ${data.stats.activeNow > 0 || data.agents.some(a => a.status === "active" || a.status === "queued") ? html`
            <h3 class="mc-section-title">Active</h3>
            ${renderActiveAgents(data.agents, cardCallbacks, true)}
          ` : nothing}

          ${renderQueueDepthHint(data.queueItems)}

          ${data.stats.activeNow === 0 && data.stats.queueDepth === 0
            ? renderIdleCta(props.onAskAlly, props.allyName)
            : nothing}

          ${renderActivityFeed(data.activityFeed, false, props.onViewDetail, true)}
        </div>
      `}
    </div>
  `;
}
