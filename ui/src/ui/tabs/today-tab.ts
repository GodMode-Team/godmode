/**
 * <gm-today> — Self-contained Today/My-Day tab component.
 *
 * Extracted from the God Component (app.ts) as part of the decomposition.
 * Owns all Today-related @state properties and includes render functions
 * (previously in views/my-day.ts) for the Today tab UI.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { localDateString } from "../format.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { extractOpenablePathFromEventTarget } from "../openable-file-path.js";
import { appEventBus } from "../context/event-bus.js";
import type { Tab } from "../navigation.js";
import type { DailyBriefData, DailyBriefProps } from "../views/daily-brief.js";
import { renderDailyBrief } from "../views/daily-brief.js";
import { renderInboxSection, type InboxViewItem } from "../views/inbox.js";
import type { WorkspaceTask } from "../views/workspaces.js";
import { renderAllTaskRow, sortTasks } from "../views/workspaces.js";
import type { TrustSummaryData, MyDayState } from "../controllers/my-day.js";

// Re-export types so external consumers can import from this module
export type { DailyBriefData } from "../views/daily-brief.js";

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
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." aria-label="New task title" />
      <button type="submit" class="ws-task-create-btn" aria-label="Add task">Add</button>
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
                  ? html`<div class="today-tasks-empty">No tasks for today. Type above to add one, or ask your ally to create tasks from your daily brief.</div>`
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

function renderMyDayToolbar(props: MyDayProps) {
  const todayStr = localDateString();
  const selectedDate = props.selectedDate ?? todayStr;
  const viewingToday = isToday(selectedDate);
  const displayDate = formatDateFromString(selectedDate);
  const viewMode = props.viewMode ?? "brief";

  return html`
    <div class="my-day-toolbar">
      <div class="today-date-nav" role="navigation" aria-label="Date navigation">
        ${props.onDatePrev
          ? html`<button class="today-date-btn" @click=${props.onDatePrev} title="Previous day" aria-label="Go to previous day">&#x2039;</button>`
          : nothing}
        <span class="today-date-label ${viewingToday ? "" : "past-date"}" aria-live="polite">${displayDate}</span>
        ${props.onDateNext
          ? html`<button class="today-date-btn" @click=${props.onDateNext} title="Next day" aria-label="Go to next day">&#x203A;</button>`
          : nothing}
        ${!viewingToday && props.onDateToday
          ? html`<button class="today-date-today-btn" @click=${props.onDateToday} aria-label="Return to today">Today</button>`
          : nothing}
      </div>
      <div class="today-view-tabs" role="tablist" aria-label="Today view">
        <button class="today-view-tab ${viewMode === "brief" ? "active" : ""}"
          role="tab" aria-selected=${viewMode === "brief" ? "true" : "false"}
          @click=${() => props.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${viewMode === "tasks" ? "active" : ""}"
          role="tab" aria-selected=${viewMode === "tasks" ? "true" : "false"}
          @click=${() => props.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${viewMode === "inbox" ? "active" : ""}"
          role="tab" aria-selected=${viewMode === "inbox" ? "true" : "false"}
          @click=${() => props.onViewModeChange?.("inbox")}>Inbox${(props.inboxCount ?? props.inboxItems?.filter((item) => item.status === "pending").length ?? props.decisionCards?.items.length ?? 0) > 0
            ? html`<span class="tab-badge" aria-label="pending items">${props.inboxCount ?? props.inboxItems?.filter((item) => item.status === "pending").length ?? props.decisionCards?.items.length}</span>`
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
          ? html`<button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh / Generate Brief" aria-label="Refresh or generate today's brief">&#x21BB;</button>`
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

function renderMyDay(props: MyDayProps) {
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
import {
  loadMyDay,
  loadBriefOnly,
  loadAgentLogOnly,
  loadTodayTasksWithQueueStatus,
  loadTodayQueueResults,
  loadInboxItems,
  loadTrustSummary,
  openBriefInObsidian,
  syncTodayTasks,
} from "../controllers/my-day.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-today")
export class GmToday extends LitElement {
  // ── Shared context (read-only from parent) ─────────────────────────
  @consume({ context: appContext, subscribe: true })
  accessor ctx!: AppContext;

  // ── My Day state (owned by this component) ─────────────────────────

  @state() myDayLoading = false;
  @state() myDayError: string | null = null;

  // Date navigation
  @state() todaySelectedDate: string = localDateString();
  @state() todayViewMode: "brief" | "tasks" | "inbox" = "brief";

  // Daily Brief
  @state() dailyBrief: DailyBriefData | null = null;
  @state() dailyBriefLoading = false;
  @state() dailyBriefError: string | null = null;

  // Agent Log
  @state() agentLog: AgentLogData | null = null;
  @state() agentLogLoading = false;
  @state() agentLogError: string | null = null;

  // Brief notes
  @state() briefNotes: Record<string, string> = {};

  // Today tasks
  @state() todayTasks: WorkspaceTask[] = [];
  @state() todayTasksLoading = false;
  @state() todayEditingTaskId: string | null = null;
  @state() todayShowCompleted = false;

  // Decision cards (overnight agent results)
  @state() todayQueueResults: DecisionCardItem[] = [];

  // Universal inbox
  @state() inboxItems: InboxViewItem[] = [];
  @state() inboxLoading = false;
  @state() inboxCount = 0;
  @state() inboxScoringId: string | null = null;
  @state() inboxScoringValue: number | undefined = undefined;
  @state() inboxFeedbackText: string | undefined = undefined;
  @state() inboxSortOrder: "newest" | "oldest" = "newest";

  // Trust summary
  @state() trustSummary: TrustSummaryData | null = null;

  // ── Light DOM (existing CSS classes work) ──────────────────────────

  override createRenderRoot() {
    return this;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  private _unsubs: Array<() => void> = [];

  private _dataLoaded = false;

  override connectedCallback() {
    super.connectedCallback();

    // Listen for external refresh requests
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "today" || payload.target === "my-day") {
          void this.refresh();
        }
      }),
    );
  }

  override willUpdate(changed: Map<string, unknown>) {
    // Load data when connection becomes available (handles late-connecting gateway)
    if (this.ctx?.connected && !this._dataLoaded && !this.myDayLoading) {
      this._dataLoaded = true;
      void this._loadAll();
    }
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // ── MyDayState bridge ──────────────────────────────────────────────
  // The controller functions from my-day.ts mutate a MyDayState object.
  // We create a thin proxy that maps mutations back to @state properties.

  private get _state(): MyDayState {
    return {
      client: this.ctx?.gateway ?? null,
      connected: this.ctx?.connected ?? false,

      // My Day
      myDayLoading: this.myDayLoading,
      myDayError: this.myDayError,

      // Daily Brief
      dailyBrief: this.dailyBrief,
      dailyBriefLoading: this.dailyBriefLoading,
      dailyBriefError: this.dailyBriefError,

      // Agent Log
      agentLog: this.agentLog,
      agentLogLoading: this.agentLogLoading,
      agentLogError: this.agentLogError,

      // Brief notes
      briefNotes: this.briefNotes,

      // Date
      todaySelectedDate: this.todaySelectedDate,

      // View mode
      todayViewMode: this.todayViewMode,

      // Tasks
      todayTasks: this.todayTasks,
      todayTasksLoading: this.todayTasksLoading,

      // Trust
      trustSummary: this.trustSummary,

      // Inbox
      inboxItems: this.inboxItems,
      inboxLoading: this.inboxLoading,
      inboxCount: this.inboxCount,

      // Methods
      loadBriefNotes: () => this._loadBriefNotes(),
    };
  }

  /** Sync mutated controller state back into reactive @state properties. */
  private _syncFromState(s: MyDayState) {
    this.myDayLoading = s.myDayLoading ?? false;
    this.myDayError = s.myDayError ?? null;
    this.dailyBrief = s.dailyBrief ?? null;
    this.dailyBriefLoading = s.dailyBriefLoading ?? false;
    this.dailyBriefError = s.dailyBriefError ?? null;
    this.agentLog = s.agentLog ?? null;
    this.agentLogLoading = s.agentLogLoading ?? false;
    this.agentLogError = s.agentLogError ?? null;
    this.briefNotes = s.briefNotes ?? {};
    this.todayTasks = s.todayTasks ?? [];
    this.todayTasksLoading = s.todayTasksLoading ?? false;
    this.trustSummary = s.trustSummary ?? null;
    this.inboxItems = s.inboxItems ?? [];
    this.inboxLoading = s.inboxLoading ?? false;
    this.inboxCount = s.inboxCount ?? 0;
  }

  // ── Data loading ───────────────────────────────────────────────────

  private async _loadAll() {
    const s = this._state;
    await loadMyDay(s);
    this._syncFromState(s);
    // Also load decision cards
    void this._loadDecisionCards();
  }

  private async _loadBriefOnly() {
    const s = this._state;
    await loadBriefOnly(s);
    this._syncFromState(s);
  }

  private async _loadBriefNotes() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.todaySelectedDate;
    try {
      const result = await gateway.request<{ notes: Record<string, string> }>(
        "briefNotes.get",
        { date },
      );
      this.briefNotes = result.notes ?? {};
    } catch (err) {
      console.error("[GmToday] Brief notes load error:", err);
      this.briefNotes = {};
    }
  }

  private async _loadDecisionCards() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const s = this._state;
      this.todayQueueResults = await loadTodayQueueResults(s);
    } catch {
      // Non-fatal
    }
  }

  /** Reload everything (used by refresh button). */
  async refresh() {
    await this._loadAll();
  }

  // ── Date navigation handlers ───────────────────────────────────────

  private _handleDatePrev() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    this.todaySelectedDate = localDateString(d);
    void this._loadBriefOnly();
  }

  private _handleDateNext() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const today = localDateString();
    const next = localDateString(d);
    if (next > today) return;
    this.todaySelectedDate = next;
    void this._loadBriefOnly();
  }

  private _handleDateToday() {
    this.todaySelectedDate = localDateString();
    void this._loadAll();
  }

  // ── Daily Brief handlers ───────────────────────────────────────────

  private async _handleDailyBriefRefresh() {
    await this._loadBriefOnly();
  }

  private async _handleDailyBriefGenerate() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    this.dailyBriefLoading = true;
    try {
      await gateway.request("dailyBrief.generate", {});
      await this._loadBriefOnly();
    } catch (err) {
      this.dailyBriefError = err instanceof Error ? err.message : "Failed to generate brief";
    } finally {
      this.dailyBriefLoading = false;
    }
  }

  private _handleDailyBriefOpenInObsidian() {
    const date = this.dailyBrief?.date;
    openBriefInObsidian(date);
  }

  private async _handleBriefSave(content: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await gateway.request("dailyBrief.update", { date, content });
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[GmToday] Brief save failed:", err);
      this.ctx?.addToast?.("Failed to save brief", "error");
    }
  }

  private async _handleBriefToggleCheckbox(index: number, checked: boolean) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await gateway.request("dailyBrief.toggleCheckbox", { date, index, checked });
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[GmToday] Checkbox toggle failed:", err);
    }
  }

  // ── View mode ──────────────────────────────────────────────────────

  private _handleViewModeChange(mode: "brief" | "tasks" | "inbox") {
    this.todayViewMode = mode;
    // Trigger data load if switching to a tab that needs fresh data
    if (mode === "inbox" && this.inboxItems.length === 0 && !this.inboxLoading) {
      void this._handleInboxRefresh();
    }
    if (mode === "tasks" && this.todayTasks.length === 0 && !this.todayTasksLoading) {
      const s = this._state;
      void loadTodayTasksWithQueueStatus(s).then(() => {
        this.todayTasks = s.todayTasks ?? [];
        this.todayTasksLoading = s.todayTasksLoading ?? false;
      });
    }
  }

  // ── Morning Set / Evening Capture ──────────────────────────────────

  private _handleStartMorningSet() {
    // Delegate to parent app via context — this needs chat tab + new session
    this.ctx?.setTab?.("chat" as any);
    const prompt =
      "Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.";
    void this.ctx?.send?.("chat.send", { message: prompt });
  }

  private _handleEveningCapture() {
    this.ctx?.setTab?.("chat" as any);
    const prompt =
      "Let's do my evening capture. Walk me through these:\n1. What went well today?\n2. What didn't get done?\n3. What should tomorrow's brief prioritize?\n4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.";
    void this.ctx?.send?.("chat.send", { message: prompt });
  }

  // ── Task handlers ──────────────────────────────────────────────────

  private async _handleTaskStatusChange(taskId: string, currentStatus: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const newStatus = currentStatus === "complete" ? "pending" : "complete";
    try {
      await gateway.request("tasks.update", {
        id: taskId,
        status: newStatus,
        completedAt: newStatus === "complete" ? new Date().toISOString() : null,
      });
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Task status change failed:", err);
    }
  }

  private async _handleCreateTask(title: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("tasks.create", {
        title,
        dueDate: localDateString(),
        priority: "medium",
        source: "chat",
      });
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Create task failed:", err);
      this.ctx?.addToast?.("Failed to create task", "error");
    }
  }

  private _handleEditTask(taskId: string | null) {
    this.todayEditingTaskId = taskId;
  }

  private async _handleUpdateTask(taskId: string, updates: { title?: string; dueDate?: string | null }) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("tasks.update", { id: taskId, ...updates });
      this.todayEditingTaskId = null;
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Update task failed:", err);
      this.ctx?.addToast?.("Failed to update task", "error");
    }
  }

  private _handleToggleCompleted() {
    this.todayShowCompleted = !this.todayShowCompleted;
  }

  private async _handleViewTaskOutput(taskId: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const queueResult = await gateway.request<{
        items: Array<{ id: string; sourceTaskId?: string; result?: { outputPath?: string; summary?: string } }>;
      }>("queue.list", { limit: 100 });
      const qi = queueResult?.items?.find((i) => i.sourceTaskId === taskId);
      if (!qi?.result?.outputPath) {
        this.ctx?.addToast?.("No output available for this task", "info");
        return;
      }
      const result = await gateway.request<{ content: string }>(
        "queue.readOutput",
        { path: qi.result.outputPath },
      );
      const title = qi.result.outputPath.split("/").pop() ?? "Agent Output";
      this.ctx?.openSidebar?.({
        content: result.content,
        mimeType: "text/markdown",
        filePath: qi.result.outputPath,
        title,
      });
    } catch (err) {
      console.error("[GmToday] View task output failed:", err);
      this.ctx?.addToast?.("Failed to load agent output", "error");
    }
  }

  private async _handleStartTask(taskId: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;

    try {
      const result = await gateway.request<{
        sessionId: string;
        created: boolean;
        task?: { title?: string; project?: string };
        queueOutput?: string | null;
      }>("tasks.openSession", { taskId });

      if (!result?.sessionId) {
        this.ctx?.addToast?.("Failed to open session for task", "error");
        return;
      }

      // Build a starter message only for brand-new sessions with no agent output
      let message = "";
      if (result.created && !result.queueOutput) {
        const task = this.todayTasks?.find((t) => t.id === taskId);
        const projectCtx = task?.project ? ` (project: ${task.project})` : "";
        message = "Let's work on: " + (task?.title ?? "this task") + projectCtx;
      }

      // Navigate to the task-linked chat session
      appEventBus.emit("chat-navigate", {
        sessionKey: result.sessionId,
        tab: "chat" as Tab,
        message,
      });
    } catch (err) {
      console.error("[GmToday] Start task failed:", err);
      this.ctx?.addToast?.("Failed to start task session", "error");
    }
  }

  // ── Decision card handlers ─────────────────────────────────────────

  private async _handleDecisionApprove(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.approve", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Approve failed:", e);
      this.ctx?.addToast?.("Failed to approve", "error");
    }
  }

  private async _handleDecisionReject(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.reject", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Reject failed:", e);
      this.ctx?.addToast?.("Failed to reject", "error");
    }
  }

  private async _handleDecisionDismiss(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Dismiss failed:", e);
      this.ctx?.addToast?.("Failed to dismiss", "error");
    }
  }

  private async _handleDecisionMarkComplete(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.sourceTaskId) {
        await gateway.request("tasks.update", { id: item.sourceTaskId, status: "complete" });
      }
      await gateway.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
      this.ctx?.addToast?.("Task marked complete", "success");
    } catch (e) {
      console.error("[GmToday] Mark complete failed:", e);
      this.ctx?.addToast?.("Failed to mark complete", "error");
    }
  }

  private async _handleDecisionRate(id: string, workflow: string, rating: number) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("trust.rate", { workflow, rating });
      const needsFeedback = rating < 7;
      this.todayQueueResults = this.todayQueueResults.map((r) =>
        r.id === id ? { ...r, userRating: rating, feedbackPending: needsFeedback } : r,
      );
      if (!needsFeedback) {
        const item = this.todayQueueResults?.find((r) => r.id === id);
        if (item?.source === "cron") {
          await gateway.request("queue.remove", { id });
          this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
        }
        this.ctx?.addToast?.(`Rated ${workflow} ${rating}/10`, "success");
      } else {
        this.ctx?.addToast?.(`Rated ${workflow} ${rating}/10 — what could be better?`, "info");
      }
    } catch (e) {
      console.error("[GmToday] Rate failed:", e);
      this.ctx?.addToast?.("Failed to submit rating", "error");
    }
  }

  private async _handleDecisionFeedback(id: string, workflow: string, feedback: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      if (feedback) {
        await gateway.request("trust.feedback", { workflow, feedback });
        this.ctx?.addToast?.(`Feedback saved for ${workflow} — will apply next time`, "success");
      }
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.source === "cron") {
        await gateway.request("queue.remove", { id });
      }
      this.todayQueueResults = this.todayQueueResults
        .map((r) => (r.id === id ? { ...r, feedbackPending: false } : r))
        .filter((r) => !(r.id === id && r.source === "cron"));
    } catch (e) {
      console.error("[GmToday] Feedback failed:", e);
      this.ctx?.addToast?.("Failed to save feedback", "error");
    }
  }

  private _handleDecisionViewOutput(id: string, outputPath: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) {
      this.ctx?.addToast?.("Not connected to gateway", "error");
      return;
    }
    gateway
      .request<{ content: string }>("queue.readOutput", { path: outputPath })
      .then((result) => {
        const title = outputPath.split("/").pop() ?? "Agent Output";
        this.ctx?.openSidebar?.({
          content: result.content,
          mimeType: "text/markdown",
          filePath: outputPath,
          title,
        });
      })
      .catch((err) => {
        console.error("[GmToday] View output failed:", err);
        // Dispatch event for parent to handle file opening
        this.dispatchEvent(new CustomEvent("today-open-file", {
          detail: { path: outputPath },
          bubbles: true,
          composed: true,
        }));
      });
  }

  private _handleDecisionOpenChat(id: string) {
    // Opening chat for a decision card requires complex session management.
    // Dispatch an event for the parent to handle.
    this.dispatchEvent(new CustomEvent("today-decision-open-chat", {
      detail: { id, item: this.todayQueueResults?.find((r) => r.id === id) },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Inbox handlers ─────────────────────────────────────────────────

  private async _handleInboxRefresh() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    this.inboxLoading = true;
    try {
      const result = await gateway.request<{
        items: InboxViewItem[];
        total: number;
        pendingCount: number;
      }>("inbox.list", { status: "pending", limit: 50 });
      this.inboxItems = result.items;
      this.inboxCount = result.pendingCount;
    } catch (err) {
      console.error("[GmToday] Inbox load failed:", err);
    } finally {
      this.inboxLoading = false;
    }
  }

  private async _handleInboxScore(itemId: string, score: number, feedback?: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.score", { itemId, score, feedback });
      this.inboxScoringId = null;
      this.inboxScoringValue = undefined;
      this.inboxFeedbackText = undefined;
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox score failed:", err);
    }
  }

  private async _handleInboxDismiss(itemId: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.dismiss", { itemId });
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox dismiss failed:", err);
    }
  }

  private async _handleInboxMarkAll() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.markAllComplete", {});
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox mark all failed:", err);
    }
  }

  private async _handleInboxViewOutput(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item) return;
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) {
      this.ctx?.addToast?.("Not connected to gateway", "error");
      return;
    }

    // Strategy 1: If we have an outputPath, read it via queue.readOutput (canonical reader)
    if (item.outputPath) {
      try {
        const result = await gateway.request<{ content: string }>(
          "queue.readOutput",
          { path: item.outputPath },
        );
        if (result?.content) {
          this.ctx?.openSidebar?.({
            content: result.content,
            mimeType: "text/markdown",
            filePath: item.outputPath,
            title: item.title,
          });
          return;
        }
      } catch {
        // queue.readOutput failed — try fallback strategies below
      }
    }

    // Strategy 2: Look up the queue item by queueItemId and read its result outputPath
    if (item.source?.queueItemId) {
      try {
        const queueResult = await gateway.request<{
          items: Array<{ id: string; result?: { outputPath?: string; summary?: string } }>;
        }>("queue.list", { limit: 200 });
        const qi = queueResult?.items?.find((i) => i.id === item.source.queueItemId);
        const qiOutputPath = qi?.result?.outputPath;
        if (qiOutputPath) {
          const result = await gateway.request<{ content: string }>(
            "queue.readOutput",
            { path: qiOutputPath },
          );
          if (result?.content) {
            this.ctx?.openSidebar?.({
              content: result.content,
              mimeType: "text/markdown",
              filePath: qiOutputPath,
              title: item.title,
            });
            return;
          }
        }
        // If we have a summary from the queue item but no readable file, show the summary
        if (qi?.result?.summary) {
          this.ctx?.openSidebar?.({
            content: `# ${item.title}\n\n${qi.result.summary}`,
            mimeType: "text/markdown",
            title: item.title,
          });
          return;
        }
      } catch (err) {
        console.error("[GmToday] Inbox queue lookup failed:", err);
      }
    }

    // Strategy 3: Fall back to proof doc via event
    if (item.proofDocSlug) {
      this.dispatchEvent(new CustomEvent("today-open-proof", {
        detail: { slug: item.proofDocSlug },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    // Nothing worked — show what we have (the summary)
    if (item.summary) {
      this.ctx?.openSidebar?.({
        content: `# ${item.title}\n\n${item.summary}`,
        mimeType: "text/markdown",
        title: item.title,
      });
    } else {
      this.ctx?.addToast?.("No output available for this item", "info");
    }
  }

  private _handleInboxViewProof(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item?.proofDocSlug) return;
    this.dispatchEvent(new CustomEvent("today-open-proof", {
      detail: { slug: item.proofDocSlug },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleInboxOpenChat(itemId: string) {
    // Complex session management — dispatch event for parent
    this.dispatchEvent(new CustomEvent("today-inbox-open-chat", {
      detail: { itemId, item: this.inboxItems?.find((i) => i.id === itemId) },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleInboxSetScoring(itemId: string | null, score?: number) {
    if (itemId !== this.inboxScoringId) {
      this.inboxFeedbackText = "";
    }
    this.inboxScoringId = itemId;
    this.inboxScoringValue = score ?? 7;
  }

  private _handleInboxFeedbackChange(text: string) {
    this.inboxFeedbackText = text;
  }

  private _handleInboxSortToggle() {
    this.inboxSortOrder = this.inboxSortOrder === "newest" ? "oldest" : "newest";
  }

  // ── Trust handlers ─────────────────────────────────────────────────

  private async _handleTrustDailyRate(rating: number) {
    const gateway = this.ctx?.gateway;
    if (!gateway) return;
    try {
      await gateway.request("trust.dailyRate", { rating });
      if (this.trustSummary) {
        this.trustSummary = { ...this.trustSummary, todayRated: true };
      }
    } catch (err) {
      console.error("[GmToday] Daily rate failed:", err);
      this.ctx?.addToast?.("Failed to submit daily rating", "error");
    }
  }

  private _handleNavigateToTrust() {
    this.ctx?.setTab?.("trust" as any);
  }

  // ── File open handler ──────────────────────────────────────────────

  private _handleOpenFile(path: string) {
    this.dispatchEvent(new CustomEvent("today-open-file", {
      detail: { path },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Render ─────────────────────────────────────────────────────────

  /**
   * Render the toolbar (date nav, view mode tabs, quick actions).
   * Called separately by the parent to place in the page header area.
   */
  renderToolbar() {
    return renderMyDayToolbar({
      connected: this.ctx?.connected ?? false,
      onRefresh: () => void this.refresh(),
      selectedDate: this.todaySelectedDate,
      onDatePrev: () => this._handleDatePrev(),
      onDateNext: () => this._handleDateNext(),
      onDateToday: () => this._handleDateToday(),
      viewMode: this.todayViewMode,
      onViewModeChange: (mode) => this._handleViewModeChange(mode),
      focusPulseActive: false,
      onStartMorningSet: () => this._handleStartMorningSet(),
      inboxItems: this.inboxItems,
      inboxCount: this.inboxCount,
      onEveningCapture: () => this._handleEveningCapture(),
    });
  }

  override render() {
    const props: MyDayProps = {
      connected: this.ctx?.connected ?? false,
      loading: this.myDayLoading,
      error: this.myDayError,
      onRefresh: () => void this.refresh(),

      // Daily Brief
      dailyBrief: this.dailyBrief,
      dailyBriefLoading: this.dailyBriefLoading,
      dailyBriefError: this.dailyBriefError,
      onBriefRefresh: () => void this._handleDailyBriefRefresh(),
      onBriefGenerate: () => void this._handleDailyBriefGenerate(),
      onBriefOpenInObsidian: () => this._handleDailyBriefOpenInObsidian(),
      onBriefSave: (content: string) => void this._handleBriefSave(content),
      onBriefToggleCheckbox: (index: number, checked: boolean) =>
        void this._handleBriefToggleCheckbox(index, checked),
      onOpenFile: (path: string) => this._handleOpenFile(path),

      // Date navigation
      selectedDate: this.todaySelectedDate,
      onDatePrev: () => this._handleDatePrev(),
      onDateNext: () => this._handleDateNext(),
      onDateToday: () => this._handleDateToday(),

      // View mode
      viewMode: this.todayViewMode,
      onViewModeChange: (mode) => this._handleViewModeChange(mode),

      // Agent log
      agentLog: this.agentLog,
      agentLogLoading: this.agentLogLoading,
      agentLogError: this.agentLogError,
      onAgentLogRefresh: () => void this.refresh(),

      // Focus Pulse / Morning Set
      focusPulseActive: false,
      onStartMorningSet: () => this._handleStartMorningSet(),

      // Today tasks
      todayTasks: this.todayTasks,
      todayTasksLoading: this.todayTasksLoading,
      onToggleTaskComplete: (taskId: string, currentStatus: string) =>
        void this._handleTaskStatusChange(taskId, currentStatus),
      onStartTask: (taskId: string) => this._handleStartTask(taskId),
      onViewTaskOutput: (taskId: string) => void this._handleViewTaskOutput(taskId),

      // Task panel additions
      onCreateTask: (title: string) => void this._handleCreateTask(title),
      onEditTask: (taskId: string | null) => this._handleEditTask(taskId),
      onUpdateTask: (taskId: string, updates: { title?: string; dueDate?: string | null }) =>
        void this._handleUpdateTask(taskId, updates),
      editingTaskId: this.todayEditingTaskId,
      showCompletedTasks: this.todayShowCompleted,
      onToggleCompletedTasks: () => this._handleToggleCompleted(),

      // Decision cards
      decisionCards:
        (this.todayQueueResults ?? []).length > 0
          ? {
              items: this.todayQueueResults,
              onApprove: (id: string) => void this._handleDecisionApprove(id),
              onReject: (id: string) => void this._handleDecisionReject(id),
              onDismiss: (id: string) => void this._handleDecisionDismiss(id),
              onViewOutput: (id: string, path: string) => this._handleDecisionViewOutput(id, path),
              onOpenChat: (id: string) => this._handleDecisionOpenChat(id),
              onMarkComplete: (id: string) => void this._handleDecisionMarkComplete(id),
              onRate: (id: string, workflow: string, rating: number) =>
                void this._handleDecisionRate(id, workflow, rating),
              onFeedback: (id: string, workflow: string, feedback: string) =>
                void this._handleDecisionFeedback(id, workflow, feedback),
            }
          : undefined,

      // Inbox
      inboxItems: this.inboxItems,
      inboxLoading: this.inboxLoading,
      inboxCount: this.inboxCount,
      inboxScoringId: this.inboxScoringId,
      inboxScoringValue: this.inboxScoringValue,
      inboxFeedbackText: this.inboxFeedbackText,
      onInboxViewOutput: (itemId: string) => this._handleInboxViewOutput(itemId),
      onInboxViewProof: (itemId: string) => this._handleInboxViewProof(itemId),
      onInboxOpenChat: (itemId: string) => this._handleInboxOpenChat(itemId),
      onInboxDismiss: (itemId: string) => void this._handleInboxDismiss(itemId),
      onInboxScore: (itemId: string, score: number, feedback?: string) =>
        void this._handleInboxScore(itemId, score, feedback),
      onInboxSetScoring: (itemId: string | null, score?: number) =>
        this._handleInboxSetScoring(itemId, score),
      onInboxFeedbackChange: (text: string) => this._handleInboxFeedbackChange(text),
      onInboxSortToggle: () => this._handleInboxSortToggle(),
      inboxSortOrder: this.inboxSortOrder,
      onInboxMarkAll: () => void this._handleInboxMarkAll(),

      // Trust summary
      trustSummary: this.trustSummary,
      onTrustDailyRate: (rating: number) => void this._handleTrustDailyRate(rating),
      onNavigateToTrust: () => this._handleNavigateToTrust(),

      // Evening capture
      onEveningCapture: () => this._handleEveningCapture(),
    };

    return html`${this.renderToolbar()}${renderMyDay(props)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gm-today": GmToday;
  }
}
