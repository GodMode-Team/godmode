/**
 * Mission Center Panel — Active Runs + Task Queue
 *
 * Top section: Currently running agent work (from agentLog activeRuns + subagent runs)
 * Bottom section: Pending native tasks (from tasks.list)
 */

import { html, nothing } from "lit";
import type { ActiveRun, NativeTask, SubagentRun } from "./mission-types";

export type MissionCenterProps = {
  activeRuns: ActiveRun[];
  subagentRuns: SubagentRun[];
  tasks: NativeTask[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onTaskComplete?: (taskId: string) => void;
  onOpenDeck?: () => void;
};

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ${seconds % 60}s`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) {
    return "just now";
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`;
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`;
  }
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function priorityBadge(p: string) {
  const colors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#6b7280",
  };
  return html`<span class="mc-priority-badge" style="background: ${colors[p] ?? "#6b7280"}">${p}</span>`;
}

export function renderMissionCenter(props: MissionCenterProps) {
  if (props.loading) {
    return html`
      <div class="mc-center-loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="mc-center-error">
        <p>${props.error}</p>
        ${props.onRefresh ? html`<button @click=${props.onRefresh} class="mc-btn mc-btn-secondary">Retry</button>` : nothing}
      </div>
    `;
  }

  const activeSubagents = props.subagentRuns.filter((r) => !r.endedAt);
  const recentSubagents = props.subagentRuns.filter((r) => r.endedAt).slice(0, 5);
  const hasActiveWork = props.activeRuns.length > 0 || activeSubagents.length > 0;

  return html`
    <div class="mc-center">
      <!-- Active Runs Section -->
      <div class="mc-section">
        <div class="mc-section-header">
          <div class="mc-section-title">
            ${
              hasActiveWork
                ? html`
                    <span class="mc-pulse-dot"></span>
                  `
                : nothing
            }
            Active Work
          </div>
          <div class="mc-section-actions">
            ${
              props.onOpenDeck
                ? html`<button class="mc-btn mc-btn-accent" @click=${props.onOpenDeck}>Open Deck</button>`
                : nothing
            }
          </div>
        </div>
        <div class="mc-runs-list">
          ${
            props.activeRuns.length === 0 && activeSubagents.length === 0
              ? html`
                  <div class="mission-empty-state">No active runs. Agents are idle.</div>
                `
              : html`
                ${props.activeRuns.map(
                  (run) => html`
                  <div class="mc-run-card mc-run-active">
                    <div class="mc-run-avatar">${run.agentEmoji}</div>
                    <div class="mc-run-info">
                      <div class="mc-run-agent">${run.agentName}</div>
                      <div class="mc-run-session">${
                        run.sessionKey
                          .split(":")
                          .slice(-1)[0]
                          ?.replace(/-[a-f0-9]{6,}$/i, "") ?? ""
                      }</div>
                    </div>
                    <div class="mc-run-duration">${formatDuration(run.durationMs)}</div>
                  </div>
                `,
                )}
                ${activeSubagents.map(
                  (run) => html`
                  <div class="mc-run-card mc-run-subagent">
                    <div class="mc-run-avatar">&#x1F916;</div>
                    <div class="mc-run-info">
                      <div class="mc-run-agent">Subagent</div>
                      <div class="mc-run-task">${run.task.length > 60 ? run.task.slice(0, 57) + "..." : run.task}</div>
                    </div>
                    <div class="mc-run-duration">${formatDuration(Date.now() - (run.startedAt ?? run.createdAt))}</div>
                  </div>
                `,
                )}
              `
          }
          ${
            recentSubagents.length > 0
              ? html`
                <div class="mc-recent-label">Recent</div>
                ${recentSubagents.map((run) => {
                  const statusClass =
                    run.outcome?.status === "ok"
                      ? "success"
                      : run.outcome?.status === "error"
                        ? "error"
                        : "neutral";
                  return html`
                    <div class="mc-run-card mc-run-completed mc-run-${statusClass}">
                      <div class="mc-run-avatar">&#x1F916;</div>
                      <div class="mc-run-info">
                        <div class="mc-run-agent">Subagent <span class="mc-run-status-badge mc-badge-${statusClass}">${run.outcome?.status ?? "done"}</span></div>
                        <div class="mc-run-task">${run.task.length > 50 ? run.task.slice(0, 47) + "..." : run.task}</div>
                      </div>
                      <div class="mc-run-time">${formatTimeAgo(run.endedAt ?? run.createdAt)}</div>
                    </div>
                  `;
                })}
              `
              : nothing
          }
        </div>
      </div>

      <!-- Task Queue Section -->
      <div class="mc-section">
        <div class="mc-section-header">
          <div class="mc-section-title">Task Queue</div>
          <div class="mc-section-count">${props.tasks.length}</div>
        </div>
        <div class="mc-tasks-list">
          ${
            props.tasks.length === 0
              ? html`
                  <div class="mission-empty-state">No pending tasks. Create tasks in chat or via cron.</div>
                `
              : props.tasks.map(
                  (task) => html`
                <div class="mc-task-card">
                  <div class="mc-task-main">
                    <div class="mc-task-title">${task.title}</div>
                    <div class="mc-task-meta">
                      ${priorityBadge(task.priority)}
                      ${task.project ? html`<span class="mc-task-project">${task.project}</span>` : nothing}
                      ${task.dueDate ? html`<span class="mc-task-due">${task.dueDate}</span>` : nothing}
                    </div>
                  </div>
                  ${
                    props.onTaskComplete
                      ? html`
                        <button
                          class="mc-task-complete-btn"
                          title="Mark complete"
                          @click=${() => props.onTaskComplete?.(task.id)}
                        >&#x2713;</button>
                      `
                      : nothing
                  }
                </div>
              `,
                )
          }
        </div>
      </div>
    </div>
  `;
}
