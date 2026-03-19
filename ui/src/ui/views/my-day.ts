import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { localDateString } from "../format.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { extractOpenablePathFromEventTarget } from "../openable-file-path.js";
import type { DailyBriefData, DailyBriefProps } from "./daily-brief.js";
import { renderDailyBrief } from "./daily-brief.js";
import { renderInboxSection, type InboxViewItem } from "./inbox.js";
import type { WorkspaceTask } from "./workspaces.js";
import { renderAllTaskRow, sortTasks } from "./workspaces.js";

// Re-export for convenience
export type { DailyBriefData } from "./daily-brief.js";

// ===== Decision Cards (Overnight Agent Results) =====

export type DecisionCardItem = {
  id: string;
  title: string;
  summary: string;
  status: "review" | "done";
  completedAt?: number;
  outputPath?: string;
  prUrl?: string;
  sourceTaskId?: string;
  /** Persona/workflow name for trust rating (e.g. "daily brief", "ops-runner") */
  persona?: string;
  /** Source of this item — "cron" items show Rate instead of Approve/Reject */
  source?: "chat" | "brief" | "cron" | "proactive" | "manual";
  /** User's trust rating (1-10), set after rating */
  userRating?: number;
  /** True when rating < 7 and we're waiting for improvement feedback */
  feedbackPending?: boolean;
};

export type DecisionCardsProps = {
  items: DecisionCardItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDismiss: (id: string) => void;
  onViewOutput: (id: string, outputPath: string) => void;
  onOpenChat: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onRate?: (id: string, workflow: string, rating: number) => void;
  onFeedback?: (id: string, workflow: string, feedback: string) => void;
};

export type AgentLogData = {
  date: string;
  content: string;
  updatedAt: string;
  sourcePath: string;
};

// ===== Types =====

export type MyDayProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  // Daily Brief props
  dailyBrief?: DailyBriefData | null;
  dailyBriefLoading?: boolean;
  dailyBriefError?: string | null;
  onBriefRefresh?: () => void;
  onBriefGenerate?: () => void;
  onBriefOpenInObsidian?: () => void;
  onBriefSave?: (content: string) => void;
  onBriefToggleCheckbox?: (index: number, checked: boolean) => void;
  onOpenFile?: (path: string) => void;
  // Date navigation props
  selectedDate?: string; // YYYY-MM-DD, defaults to today
  onDatePrev?: () => void;
  onDateNext?: () => void;
  onDateToday?: () => void;
  // View mode: "brief" (default), "tasks", or "inbox"
  viewMode?: "brief" | "tasks" | "inbox";
  onViewModeChange?: (mode: "brief" | "tasks" | "inbox") => void;
  // Agent log props (legacy, kept for type compat)
  agentLog?: AgentLogData | null;
  agentLogLoading?: boolean;
  agentLogError?: string | null;
  onAgentLogRefresh?: () => void;
  // Focus Pulse
  focusPulseActive?: boolean;
  onStartMorningSet?: () => void;
  // Today's tasks
  todayTasks?: WorkspaceTask[];
  todayTasksLoading?: boolean;
  onToggleTaskComplete?: (taskId: string, currentStatus: string) => void;
  onStartTask?: (taskId: string) => void;
  onViewTaskOutput?: (taskId: string) => void;
  // Task panel additions
  onCreateTask?: (title: string) => void;
  onEditTask?: (taskId: string | null) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; dueDate?: string | null }) => void;
  editingTaskId?: string | null;
  showCompletedTasks?: boolean;
  onToggleCompletedTasks?: () => void;
  // Decision cards (overnight agent results)
  decisionCards?: DecisionCardsProps;
  // Evening capture
  onEveningCapture?: () => void;
  // Universal inbox
  inboxItems?: InboxViewItem[];
  inboxLoading?: boolean;
  inboxCount?: number;
  inboxScoringId?: string | null;
  inboxScoringValue?: number;
  inboxFeedbackText?: string;
  onInboxViewOutput?: (itemId: string) => void;
  onInboxViewProof?: (itemId: string) => void;
  onInboxOpenChat?: (itemId: string) => void;
  onInboxDismiss?: (itemId: string) => void;
  onInboxScore?: (itemId: string, score: number, feedback?: string) => void;
  onInboxSetScoring?: (itemId: string | null, score?: number) => void;
  onInboxFeedbackChange?: (text: string) => void;
  onInboxSortToggle?: () => void;
  inboxSortOrder?: "newest" | "oldest";
  onInboxMarkAll?: () => void;
  // Trust summary
  trustSummary?: {
    overallScore: number | null;
    dailyStreak: number;
    todayRated: boolean;
    workflowCount: number;
    highPerformers: number;
    needsAttention: number;
  } | null;
  onTrustDailyRate?: (rating: number, note?: string) => void;
  onNavigateToTrust?: () => void;
};

// ===== Helper Functions =====

function isToday(dateStr: string): boolean {
  return dateStr === localDateString();
}

function formatDateFromString(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return formatDate(date);
}

function formatDate(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  return `${dayName}, ${monthName} ${dayNum}`;
}

function formatUpdatedAt(isoStr?: string): string {
  if (!isoStr) {
    return "";
  }
  const date = new Date(isoStr);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return date.toLocaleString();
}

function sourcePathLabel(sourcePath?: string): string {
  if (!sourcePath) {
    return "";
  }
  const parts = sourcePath.split("/");
  return parts[parts.length - 1] || sourcePath;
}

// ===== Agent Log Renderer =====

function renderAgentLog(
  props: MyDayProps,
  agentLog: AgentLogData | null,
  displayDate: string,
) {
  const handleAgentLogClick = (event: Event) => {
    if (!props.onOpenFile) return;
    const localPath = extractOpenablePathFromEventTarget(event.target);
    if (!localPath) return;
    event.preventDefault();
    props.onOpenFile(localPath);
  };

  return html`
    <div class="my-day-card agent-log-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x26A1;</span>
          <span>AGENT LOG</span>
        </div>
        <div class="agent-log-header-actions">
          ${agentLog?.updatedAt
            ? html`<span class="brief-updated">${formatUpdatedAt(agentLog.updatedAt)}</span>`
            : nothing}
          ${agentLog?.sourcePath
            ? html`<span class="agent-log-file" title=${agentLog.sourcePath}>
                ${sourcePathLabel(agentLog.sourcePath)}
              </span>`
            : nothing}
          ${props.onAgentLogRefresh
            ? html`<button class="brief-refresh-btn agent-log-refresh-btn"
                @click=${props.onAgentLogRefresh} title="Refresh agent log">&#x21BB;</button>`
            : nothing}
        </div>
      </div>
      <div class="my-day-card-content agent-log-content">
        ${props.agentLogLoading
          ? html`<div class="brief-loading"><div class="spinner"></div><span>Loading agent day...</span></div>`
          : props.agentLogError
            ? html`<div class="brief-error"><span class="error-icon">&#x26A0;&#xFE0F;</span><span>${props.agentLogError}</span></div>`
            : !agentLog?.content?.trim()
              ? html`<div class="my-day-empty">No agent day entry found for ${displayDate}. Create/update <code>AGENT-DAY.md</code> and refresh.</div>`
              : html`<div class="brief-content brief-content--read agent-log-readonly" @click=${handleAgentLogClick}>
                  <div class="brief-rendered agent-log-rendered">${unsafeHTML(toSanitizedMarkdownHtml(agentLog.content))}</div>
                </div>`}
      </div>
    </div>
  `;
}

// ===== Add Task Form =====

function renderAddTaskForm(onCreateTask: (title: string) => void) {
  return html`
    <form class="ws-task-create-form" @submit=${(e: Event) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const input = form.querySelector("input") as HTMLInputElement;
      const title = input.value.trim();
      if (!title) return;
      onCreateTask(title);
      input.value = "";
    }}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `;
}

// ===== Task Panel =====

function renderTaskPanel(props: MyDayProps) {
  const tasks = sortTasks(props.todayTasks ?? [], "due");
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "complete");

  return html`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${pendingTasks.length} open${completedTasks.length > 0 ? html`, ${completedTasks.length} done` : nothing}
        </span>
      </div>
      <div class="my-day-card-content">
        ${props.todayTasksLoading
          ? html`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`
          : html`
              ${props.onCreateTask ? renderAddTaskForm(props.onCreateTask) : nothing}
              <div class="today-tasks-list">
                ${pendingTasks.length === 0 && completedTasks.length === 0
                  ? html`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`
                  : pendingTasks.map((task) =>
                      renderAllTaskRow(
                        task,
                        props.onToggleTaskComplete,
                        props.onStartTask,
                        props.editingTaskId,
                        props.onEditTask,
                        props.onUpdateTask,
                        props.onViewTaskOutput,
                      ),
                    )}
              </div>
              ${completedTasks.length > 0
                ? html`
                    <button class="today-completed-toggle" @click=${() => props.onToggleCompletedTasks?.()}>
                      ${props.showCompletedTasks ? "Hide" : "Show"} ${completedTasks.length} completed
                    </button>
                    ${props.showCompletedTasks
                      ? html`<div class="today-tasks-list today-tasks-list--completed">
                          ${completedTasks.map((task) =>
                            renderAllTaskRow(
                              task,
                              props.onToggleTaskComplete,
                              props.onStartTask,
                              props.editingTaskId,
                              props.onEditTask,
                              props.onUpdateTask,
                            ),
                          )}
                        </div>`
                      : nothing}
                  `
                : nothing}
            `}
      </div>
    </div>
  `;
}

// ===== Decision Cards (Overnight Agent Results) =====

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderRatingBar(
  item: DecisionCardItem,
  onRate?: (id: string, workflow: string, rating: number) => void,
  onFeedback?: (id: string, workflow: string, feedback: string) => void,
) {
  if (!onRate || !item.persona) return nothing;

  const handleFeedbackSubmit = (e: Event) => {
    e.preventDefault();
    if (!onFeedback || !item.persona) return;
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector("textarea") as HTMLTextAreaElement;
    const text = input.value.trim();
    if (!text) return;
    onFeedback(item.id, item.persona, text);
  };

  return html`
    <div class="decision-card-rating">
      <span class="decision-card-rating-label">Rate:</span>
      <div class="decision-card-rating-bar">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
          (n) => html`
            <button
              class="rating-btn ${item.userRating === n ? "rating-btn--active" : ""}"
              @click=${() => onRate(item.id, item.persona!, n)}
              title="${n}/10"
            >${n}</button>
          `,
        )}
      </div>
      ${item.userRating
        ? html`<span class="decision-card-rating-value">${item.userRating}/10</span>`
        : nothing}
    </div>
    ${item.feedbackPending
      ? html`
        <form class="decision-card-feedback" @submit=${handleFeedbackSubmit}>
          <label class="decision-card-feedback-label">What would make this better?</label>
          <textarea
            class="decision-card-feedback-input"
            rows="2"
            placeholder="e.g. Include more actionable items, less filler..."
          ></textarea>
          <div class="decision-card-feedback-actions">
            <button type="submit" class="decision-card-btn decision-card-btn--approve">Submit Feedback</button>
            <button type="button" class="decision-card-btn decision-card-btn--dismiss"
              @click=${() => onFeedback?.(item.id, item.persona!, "")}>Skip</button>
          </div>
        </form>
      `
      : nothing}
  `;
}

function renderDecisionCard(item: DecisionCardItem, props: DecisionCardsProps) {
  const isReview = item.status === "review";
  const isCron = item.source === "cron";
  const statusClass = isReview ? "decision-card-status--review" : "decision-card-status--done";
  const statusLabel = isCron ? "Skill Result" : isReview ? "Needs Review" : "Complete";
  const timeLabel = item.completedAt ? formatTimeAgo(item.completedAt) : "";

  return html`
    <div class="decision-card">
      <div class="decision-card-header">
        <span class="decision-card-status ${isCron ? "decision-card-status--cron" : statusClass}">${statusLabel}</span>
        ${timeLabel ? html`<span class="decision-card-time">${timeLabel}</span>` : nothing}
      </div>
      <h4 class="decision-card-title">${item.title}</h4>
      <p class="decision-card-summary">${item.summary}</p>
      ${renderRatingBar(item, props.onRate, props.onFeedback)}
      <div class="decision-card-actions">
        ${isCron
          ? html`
              ${item.outputPath
                ? html`<button class="decision-card-btn decision-card-btn--view"
                    @click=${() => props.onViewOutput(item.id, item.outputPath!)}>View Output</button>`
                : nothing}
              <button class="decision-card-btn decision-card-btn--dismiss"
                @click=${() => props.onDismiss(item.id)}>Dismiss</button>
            `
          : isReview
            ? html`
                <button class="decision-card-btn decision-card-btn--approve"
                  @click=${() => props.onApprove(item.id)}>Approve</button>
                ${item.outputPath
                  ? html`<button class="decision-card-btn decision-card-btn--view"
                      @click=${() => props.onViewOutput(item.id, item.outputPath!)}>View Output</button>`
                  : nothing}
                <button class="decision-card-btn decision-card-btn--chat"
                  @click=${() => props.onOpenChat(item.id)}>Open Chat</button>
                <button class="decision-card-btn decision-card-btn--reject"
                  @click=${() => props.onReject(item.id)}>Reject</button>
                <button class="decision-card-btn decision-card-btn--dismiss"
                  @click=${() => props.onDismiss(item.id)}>Dismiss</button>
              `
            : html`
                ${item.outputPath
                  ? html`<button class="decision-card-btn decision-card-btn--view"
                      @click=${() => props.onViewOutput(item.id, item.outputPath!)}>View Output</button>`
                  : nothing}
                <button class="decision-card-btn decision-card-btn--chat"
                  @click=${() => props.onOpenChat(item.id)}>Open Chat</button>
                ${props.onMarkComplete && item.sourceTaskId
                  ? html`<button class="decision-card-btn decision-card-btn--complete"
                      @click=${() => props.onMarkComplete!(item.id)}>Mark Complete</button>`
                  : nothing}
                <button class="decision-card-btn decision-card-btn--dismiss"
                  @click=${() => props.onDismiss(item.id)}>Dismiss</button>
              `}
        ${item.prUrl
          ? html`<a class="decision-card-btn decision-card-btn--view" href="${item.prUrl}" target="_blank" rel="noopener">View PR</a>`
          : nothing}
      </div>
    </div>
  `;
}

function renderDecisionCards(props: DecisionCardsProps) {
  if (!props.items.length) return nothing;

  const useScroll = props.items.length > 3;

  return html`
    <div class="decision-cards">
      <div class="decision-cards-header">
        <h3>Agent Results</h3>
        <span class="count-badge">${props.items.length}</span>
      </div>
      <div class="decision-cards-list ${useScroll ? "decision-cards-list--scroll" : ""}">
        ${props.items.map((item) => renderDecisionCard(item, props))}
      </div>
    </div>
  `;
}

// ===== Toolbar (rendered in page header) =====

export function renderMyDayToolbar(props: MyDayProps) {
  const todayStr = localDateString();
  const selectedDate = props.selectedDate ?? todayStr;
  const viewingToday = isToday(selectedDate);
  const displayDate = formatDateFromString(selectedDate);
  const viewMode = props.viewMode ?? "brief";

  return html`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${props.onDatePrev
          ? html`<button class="today-date-btn" @click=${props.onDatePrev} title="Previous day">&#x2039;</button>`
          : nothing}
        <span class="today-date-label ${viewingToday ? "" : "past-date"}">${displayDate}</span>
        ${props.onDateNext
          ? html`<button class="today-date-btn" @click=${props.onDateNext} title="Next day">&#x203A;</button>`
          : nothing}
        ${!viewingToday && props.onDateToday
          ? html`<button class="today-date-today-btn" @click=${props.onDateToday}>Today</button>`
          : nothing}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${viewMode === "brief" ? "active" : ""}"
          @click=${() => props.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${viewMode === "tasks" ? "active" : ""}"
          @click=${() => props.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${viewMode === "inbox" ? "active" : ""}"
          @click=${() => props.onViewModeChange?.("inbox")}>Inbox${(props.inboxCount ?? props.inboxItems?.filter((item) => item.status === "pending").length ?? props.decisionCards?.items.length ?? 0) > 0
            ? html`<span class="tab-badge">${props.inboxCount ?? props.inboxItems?.filter((item) => item.status === "pending").length ?? props.decisionCards?.items.length}</span>`
            : nothing}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours() < 15
          ? (!props.focusPulseActive && props.onStartMorningSet
              ? html`<button class="today-morning-set-btn" @click=${props.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`
              : nothing)
          : (props.onEveningCapture
              ? html`<button class="today-evening-btn" @click=${props.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`
              : nothing)}
        ${props.onRefresh
          ? html`<button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`
          : null}
      </div>
    </div>
  `;
}

// ===== Inbox View (Agent Results Stream) =====

function renderInbox(props: MyDayProps) {
  return html`
    <div class="my-day-brief-full">
      ${renderInboxSection({
        items: props.inboxItems ?? [],
        loading: props.inboxLoading,
        count: props.inboxCount,
        sortOrder: props.inboxSortOrder ?? "newest",
        scoringId: props.inboxScoringId,
        scoringValue: props.inboxScoringValue,
        feedbackText: props.inboxFeedbackText,
        onViewOutput: (itemId: string) => props.onInboxViewOutput?.(itemId),
        onViewProof: (itemId: string) => props.onInboxViewProof?.(itemId),
        onOpenChat: (itemId: string) => props.onInboxOpenChat?.(itemId),
        onDismiss: (itemId: string) => props.onInboxDismiss?.(itemId),
        onScore: (itemId: string, score: number, feedback?: string) => props.onInboxScore?.(itemId, score, feedback),
        onSetScoring: (itemId: string | null, score?: number) => props.onInboxSetScoring?.(itemId, score),
        onFeedbackChange: (text: string) => props.onInboxFeedbackChange?.(text),
        onSortToggle: () => props.onInboxSortToggle?.(),
        onMarkAll: () => props.onInboxMarkAll?.(),
      })}
    </div>
  `;
}

// ===== Trust Summary Card =====

function renderTrustSummaryCard(props: MyDayProps) {
  const trust = props.trustSummary;
  if (!trust || trust.workflowCount === 0) return nothing;

  const scoreColor =
    trust.overallScore === null
      ? "var(--text-secondary)"
      : trust.overallScore >= 8
        ? "var(--ok, #22c55e)"
        : trust.overallScore >= 5
          ? "var(--warn, #eab308)"
          : "var(--danger, #ef4444)";

  const scoreDisplay = trust.overallScore !== null ? trust.overallScore.toFixed(1) : "--";

  return html`
    <div class="my-day-card trust-summary-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F3AF;</span>
          <span>TRUST</span>
        </div>
        ${props.onNavigateToTrust
          ? html`<button class="brief-refresh-btn" @click=${props.onNavigateToTrust}
              title="View full trust dashboard">Details &#x2192;</button>`
          : nothing}
      </div>
      <div class="my-day-card-content" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;min-width:60px;">
          <div style="font-size:28px;font-weight:700;color:${scoreColor};line-height:1;">${scoreDisplay}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">/ 10</div>
        </div>
        <div style="flex:1;min-width:120px;font-size:13px;color:var(--text-secondary);line-height:1.6;">
          <div>${trust.workflowCount} workflow${trust.workflowCount !== 1 ? "s" : ""} tracked</div>
          ${trust.highPerformers > 0
            ? html`<div style="color:var(--ok, #22c55e);">${trust.highPerformers} above 8.0</div>`
            : nothing}
          ${trust.needsAttention > 0
            ? html`<div style="color:var(--warn, #eab308);">${trust.needsAttention} need${trust.needsAttention !== 1 ? "" : "s"} attention</div>`
            : nothing}
          ${trust.dailyStreak > 0
            ? html`<div>${trust.dailyStreak}-day streak</div>`
            : nothing}
        </div>
        ${!trust.todayRated && props.onTrustDailyRate
          ? html`
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
              <div style="font-size:11px;color:var(--text-secondary);">Rate today</div>
              <div style="display:flex;gap:2px;">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (n) => html`<button
                    class="rating-btn"
                    style="width:24px;height:24px;font-size:11px;border:1px solid var(--border);border-radius:4px;background:var(--surface-2);color:var(--text-secondary);cursor:pointer;"
                    @click=${() => props.onTrustDailyRate!(n)}
                    title="${n}/10"
                  >${n}</button>`,
                )}
              </div>
            </div>`
          : trust.todayRated
            ? html`<div style="font-size:12px;color:var(--ok, #22c55e);">Rated today &#x2713;</div>`
            : nothing}
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderMyDay(props: MyDayProps) {
  const todayStr = localDateString();
  const selectedDate = props.selectedDate ?? todayStr;
  const viewMode = props.viewMode ?? "brief";

  if (props.loading) {
    return html`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${props.error}</span>
          ${props.onRefresh
            ? html`<button class="retry-button" @click=${props.onRefresh}>Retry</button>`
            : null}
        </div>
      </div>
    `;
  }

  // Build daily brief props
  const briefProps: DailyBriefProps = {
    connected: props.connected,
    data: props.dailyBrief ?? null,
    loading: props.dailyBriefLoading,
    error: props.dailyBriefError,
    onRefresh: props.onBriefRefresh,
    onGenerate: props.onBriefGenerate,
    onOpenInObsidian: props.onBriefOpenInObsidian,
    onSaveBrief: props.onBriefSave,
    onToggleCheckbox: props.onBriefToggleCheckbox,
    onOpenFile: props.onOpenFile,
  };

  return html`
    <div class="my-day-container">
      ${viewMode === "brief"
        ? html`<div class="my-day-brief-full">
            ${renderDailyBrief(briefProps)}
          </div>`
        : viewMode === "tasks"
          ? html`<div class="my-day-brief-full">${renderTaskPanel(props)}</div>`
          : renderInbox(props)}
    </div>
  `;
}
