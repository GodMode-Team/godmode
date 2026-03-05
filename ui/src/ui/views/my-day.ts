import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { localDateString } from "../format.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { extractOpenablePathFromEventTarget } from "../openable-file-path.js";
import type { DailyBriefData, DailyBriefProps } from "./daily-brief.js";
import { renderDailyBrief } from "./daily-brief.js";
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
};

export type DecisionCardsProps = {
  items: DecisionCardItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewOutput: (id: string, outputPath: string) => void;
  onOpenChat: (id: string) => void;
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
  onBriefOpenInObsidian?: () => void;
  onBriefSave?: (content: string) => void;
  onBriefToggleCheckbox?: (index: number, checked: boolean) => void;
  onOpenFile?: (path: string) => void;
  // Date navigation props
  selectedDate?: string; // YYYY-MM-DD, defaults to today
  onDatePrev?: () => void;
  onDateNext?: () => void;
  onDateToday?: () => void;
  // View mode: "brief" (default), "command-center", or "agent-log"
  viewMode?: "brief" | "command-center" | "agent-log";
  onViewModeChange?: (mode: "brief" | "command-center" | "agent-log") => void;
  // Agent log props
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
  // Goals
  goals?: Array<{ id: string; title: string; area?: string; progress?: number; status: string }>;
  goalsLoading?: boolean;
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

function renderDecisionCard(item: DecisionCardItem, props: DecisionCardsProps) {
  const isReview = item.status === "review";
  const statusClass = isReview ? "decision-card-status--review" : "decision-card-status--done";
  const statusLabel = isReview ? "Needs Review" : "Complete";

  return html`
    <div class="decision-card">
      <span class="decision-card-status ${statusClass}">${statusLabel}</span>
      <h4 class="decision-card-title">${item.title}</h4>
      <p class="decision-card-summary">${item.summary}</p>
      <div class="decision-card-actions">
        ${isReview
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
            `
          : html`
              ${item.outputPath
                ? html`<button class="decision-card-btn decision-card-btn--view"
                    @click=${() => props.onViewOutput(item.id, item.outputPath!)}>View Output</button>`
                : nothing}
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
        <button class="today-view-tab ${viewMode === "command-center" ? "active" : ""}"
          @click=${() => props.onViewModeChange?.("command-center")}>Command Center${props.decisionCards && props.decisionCards.items.filter(i => i.status === "review").length > 0
            ? html`<span class="tab-badge">${props.decisionCards.items.filter(i => i.status === "review").length}</span>`
            : nothing}</button>
        <button class="today-view-tab ${viewMode === "agent-log" ? "active" : ""}"
          @click=${() => props.onViewModeChange?.("agent-log")}>Agent Log</button>
      </div>
      <div class="today-quick-actions">
        ${!props.focusPulseActive && props.onStartMorningSet
          ? html`<button class="today-morning-set-btn" @click=${props.onStartMorningSet}
              title="Start your morning focus ritual">\u2600\uFE0F Morning Set</button>`
          : nothing}
        ${props.onEveningCapture
          ? html`<button class="today-evening-btn" @click=${props.onEveningCapture}
              title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`
          : nothing}
        ${props.onRefresh
          ? html`<button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`
          : null}
      </div>
    </div>
  `;
}

// ===== Goals Section (compact, for Today tab) =====

function renderGoalsSection(props: MyDayProps) {
  const goals = props.goals?.filter(g => g.status === "active") ?? [];

  if (props.goalsLoading) {
    return html`<div class="my-day-card goals-section">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83C\uDFAF</span>
          <span>GOALS</span>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="brief-loading"><div class="spinner"></div><span>Loading goals...</span></div>
      </div>
    </div>`;
  }

  if (goals.length === 0) {
    return html`<div class="my-day-card goals-section goals-section--empty">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83C\uDFAF</span>
          <span>GOALS</span>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="goals-empty-hint">No goals set yet. Tell your ally what you're working toward.</div>
      </div>
    </div>`;
  }

  return html`<div class="my-day-card goals-section">
    <div class="my-day-card-header">
      <div class="my-day-card-title">
        <span class="my-day-card-icon">\uD83C\uDFAF</span>
        <span>GOALS</span>
      </div>
      <span class="today-tasks-count">${goals.length} active</span>
    </div>
    <div class="my-day-card-content goals-list">
      ${goals.slice(0, 6).map(g => html`
        <div class="goal-item">
          <div class="goal-item-header">
            <span class="goal-item-title">${g.title}</span>
            ${g.area ? html`<span class="goal-item-area">${g.area}</span>` : nothing}
          </div>
          ${g.progress != null ? html`
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: ${Math.min(100, Math.max(0, g.progress))}%"></div>
            </div>
          ` : nothing}
        </div>
      `)}
    </div>
  </div>`;
}

// ===== Command Center View =====

function renderCommandCenter(props: MyDayProps) {
  return html`
    <div class="command-center">
      ${props.decisionCards && props.decisionCards.items.length > 0
        ? renderDecisionCards(props.decisionCards)
        : html`<div class="command-center-empty">
            <div class="my-day-empty">Your overnight agent results will appear here. Queue tasks for your agents and check back in the morning.</div>
          </div>`}
      <div class="command-center-tasks">
        ${renderTaskPanel(props)}
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderMyDay(props: MyDayProps) {
  const todayStr = localDateString();
  const selectedDate = props.selectedDate ?? todayStr;
  const viewMode = props.viewMode ?? "brief";
  const agentLog = props.agentLog ?? null;

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
    onOpenInObsidian: props.onBriefOpenInObsidian,
    onSaveBrief: props.onBriefSave,
    onToggleCheckbox: props.onBriefToggleCheckbox,
    onOpenFile: props.onOpenFile,
  };

  return html`
    <div class="my-day-container">
      ${viewMode === "brief"
        ? html`<div class="my-day-brief-full">
            ${renderGoalsSection(props)}
            ${renderDailyBrief(briefProps)}
          </div>`
        : viewMode === "command-center"
          ? renderCommandCenter(props)
          : html`<div class="my-day-brief-full">${renderAgentLog(props, agentLog, formatDateFromString(selectedDate))}</div>`}
    </div>
  `;
}
