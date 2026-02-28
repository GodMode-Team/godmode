import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { localDateString } from "../format.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
import { extractOpenablePathFromEventTarget } from "../openable-file-path.js";
import type { DailyBriefData, DailyBriefProps } from "./daily-brief.js";
import { renderDailyBrief } from "./daily-brief.js";
import type { WorkspaceTask } from "./workspaces.js";

// Re-export for convenience
export type { DailyBriefData } from "./daily-brief.js";

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
  // View mode: "my-day" (brief) or "agent-log"
  viewMode?: "my-day" | "agent-log";
  onViewModeChange?: (mode: "my-day" | "agent-log") => void;
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

// ===== Main Render Function =====

export function renderMyDay(props: MyDayProps) {
  const todayStr = localDateString();
  const selectedDate = props.selectedDate ?? todayStr;
  const viewingToday = isToday(selectedDate);
  const displayDate = formatDateFromString(selectedDate);
  const viewMode = props.viewMode ?? "my-day";
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
          <span class="error-icon">⚠</span>
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

  const handleAgentLogClick = (event: Event) => {
    if (!props.onOpenFile) {
      return;
    }

    const localPath = extractOpenablePathFromEventTarget(event.target);
    if (!localPath) {
      return;
    }

    event.preventDefault();
    props.onOpenFile(localPath);
  };

  return html`
    <div class="my-day-container">
      <!-- Header: Title + Date Nav + View Toggle -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Today</h1>
          <div class="my-day-header-nav-row">
            <div class="today-date-nav">
              ${
                props.onDatePrev
                  ? html`<button class="today-date-btn" @click=${props.onDatePrev} title="Previous day">‹</button>`
                  : nothing
              }
              <span class="today-date-label ${viewingToday ? "" : "past-date"}">${displayDate}</span>
              ${
                props.onDateNext
                  ? html`<button class="today-date-btn" @click=${props.onDateNext} title="Next day">›</button>`
                  : nothing
              }
              ${
                !viewingToday && props.onDateToday
                  ? html`<button class="today-date-today-btn" @click=${props.onDateToday}>Today</button>`
                  : nothing
              }
            </div>
            <div class="today-view-toggle">
              <button
                class="${viewMode === "my-day" ? "active" : ""}"
                @click=${() => props.onViewModeChange?.("my-day")}
              >My Day</button>
              <button
                class="${viewMode === "agent-log" ? "active" : ""}"
                @click=${() => props.onViewModeChange?.("agent-log")}
              >Agent Log</button>
            </div>
            ${!props.focusPulseActive && props.onStartMorningSet
              ? html`<button class="today-morning-set-btn" @click=${props.onStartMorningSet} title="Start your morning focus ritual">\u2600\uFE0F Start Morning Set</button>`
              : nothing}
          </div>
        </div>
        <div class="my-day-header-right">
          ${
            props.onRefresh
              ? html`<button class="my-day-refresh-btn" @click=${props.onRefresh} title="Refresh">
                ↻
              </button>`
              : null
          }
        </div>
      </div>

      <!-- Content: Brief or Agent Log -->
      <div class="today-content">
        ${
          viewMode === "my-day"
            ? renderDailyBrief(briefProps)
            : html`
                <div class="my-day-card agent-log-section brief-editor">
                  <div class="my-day-card-header">
                    <div class="my-day-card-title">
                      <span class="my-day-card-icon">⚡</span>
                      <span>AGENT LOG</span>
                    </div>
                    <div class="agent-log-header-actions">
                      ${
                        agentLog?.updatedAt
                          ? html`<span class="brief-updated">${formatUpdatedAt(agentLog.updatedAt)}</span>`
                          : nothing
                      }
                      ${
                        agentLog?.sourcePath
                          ? html`<span class="agent-log-file" title=${agentLog.sourcePath}>
                              ${sourcePathLabel(agentLog.sourcePath)}
                            </span>`
                          : nothing
                      }
                      ${
                        props.onAgentLogRefresh
                          ? html`<button
                              class="brief-refresh-btn agent-log-refresh-btn"
                              @click=${props.onAgentLogRefresh}
                              title="Refresh agent log"
                            >
                              ↻
                            </button>`
                          : nothing
                      }
                    </div>
                  </div>
                  <div class="my-day-card-content agent-log-content">
                    ${
                      props.agentLogLoading
                        ? html`
                            <div class="brief-loading">
                              <div class="spinner"></div>
                              <span>Loading agent day...</span>
                            </div>
                          `
                        : props.agentLogError
                          ? html`
                              <div class="brief-error">
                                <span class="error-icon">⚠️</span>
                                <span>${props.agentLogError}</span>
                              </div>
                            `
                          : !agentLog?.content?.trim()
                            ? html`
                                <div class="my-day-empty">
                                  No agent day entry found for ${displayDate}. Create/update
                                  <code>AGENT-DAY.md</code> and refresh.
                                </div>
                              `
                            : html`
                                <div
                                  class="brief-content brief-content--read agent-log-readonly"
                                  @click=${handleAgentLogClick}
                                >
                                  <div class="brief-rendered agent-log-rendered">
                                    ${unsafeHTML(toSanitizedMarkdownHtml(agentLog.content))}
                                  </div>
                                </div>
                              `
                    }
                  </div>
                </div>
              `
        }
      </div>
    </div>
  `;
}
