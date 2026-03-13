/**
 * inbox.ts — Universal Inbox UI component.
 *
 * Renders inbox cards with scoring, feedback, and quick actions.
 * Integrates into the Today tab as a section.
 */

import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state";

type InboxItemView = NonNullable<AppViewState["inboxItems"]>[number];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function personaLabel(item: InboxItemView): string {
  if (item.source.persona) {
    return item.source.persona.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (item.source.skill) return item.source.skill;
  return item.type === "agent-execution" ? "Agent" : "Skill";
}

function renderScoreWidget(state: AppViewState, item: InboxItemView) {
  if (state.inboxScoringId !== item.id) return nothing;

  const score = state.inboxScoringValue ?? 7;
  const needsFeedback = score <= 4;
  const optionalFeedback = score >= 9;

  return html`
    <div class="inbox-scoring">
      <div class="inbox-score-row">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
          (n) => html`
            <button
              class="inbox-score-btn${n === score ? " active" : ""}${n <= 4 ? " low" : n >= 9 ? " high" : ""}"
              @click=${() => state.handleInboxSetScoring(item.id, n)}
            >${n}</button>
          `,
        )}
      </div>
      ${needsFeedback
        ? html`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                placeholder="What went wrong? (required)"
                .value=${state.inboxFeedbackText ?? ""}
                @input=${(e: Event) => state.handleInboxFeedbackChange((e.target as HTMLTextAreaElement).value)}
              ></textarea>
            </div>
          `
        : optionalFeedback
          ? html`
              <div class="inbox-feedback">
                <textarea
                  class="inbox-feedback-input"
                  placeholder="What was great? (optional)"
                  .value=${state.inboxFeedbackText ?? ""}
                  @input=${(e: Event) => state.handleInboxFeedbackChange((e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </div>
            `
          : nothing}
      <div class="inbox-score-actions">
        <button
          class="btn inbox-score-submit"
          ?disabled=${needsFeedback && !(state.inboxFeedbackText?.trim())}
          @click=${() => state.handleInboxScore(item.id, score, state.inboxFeedbackText?.trim() || undefined)}
        >Complete (${score}/10)</button>
        <button
          class="btn inbox-score-cancel"
          @click=${() => state.handleInboxSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `;
}

function renderInboxCard(state: AppViewState, item: InboxItemView) {
  return html`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${personaLabel(item)}</span>
        <span class="inbox-card-time">${timeAgo(item.createdAt)}</span>
      </div>
      <div class="inbox-card-title">${item.title}</div>
      <div class="inbox-card-summary">${item.summary.slice(0, 200)}${item.summary.length > 200 ? "..." : ""}</div>
      <div class="inbox-card-actions">
        ${item.outputPath
          ? html`<button class="btn btn-sm" @click=${() => state.handleInboxViewOutput(item.id)}>View Output</button>`
          : nothing}
        ${item.source.queueItemId
          ? html`<button class="btn btn-sm" @click=${() => state.handleInboxOpenChat(item.id)}>Open Chat</button>`
          : nothing}
        <button class="btn btn-sm btn-primary" @click=${() => state.handleInboxSetScoring(item.id, 7)}>Complete</button>
        <button class="btn btn-sm btn-ghost" @click=${() => state.handleInboxDismiss(item.id)}>Dismiss</button>
      </div>
      ${renderScoreWidget(state, item)}
    </div>
  `;
}

/**
 * Render the inbox section for the Today tab.
 */
export function renderInboxSection(state: AppViewState) {
  const items = state.inboxItems ?? [];
  const pendingItems = items.filter((i) => i.status === "pending");
  const count = state.inboxCount ?? pendingItems.length;

  if (count === 0 && !state.inboxLoading) {
    return html`
      <div class="inbox-empty">
        <div class="inbox-empty-text">No pending items</div>
      </div>
    `;
  }

  return html`
    <div class="inbox-section">
      ${state.inboxLoading
        ? html`<div class="inbox-loading">Loading inbox...</div>`
        : nothing}
      ${pendingItems.length > 0
        ? html`
            <div class="inbox-bulk-actions">
              <span class="inbox-count">${count} item${count !== 1 ? "s" : ""} to review</span>
              <button class="btn btn-sm" @click=${() => state.handleInboxMarkAll()}>Mark All Complete</button>
            </div>
            <div class="inbox-list">
              ${pendingItems.map((item) => renderInboxCard(state, item))}
            </div>
          `
        : nothing}
    </div>
  `;
}

/**
 * Render inbox badge count for the Today tab label.
 */
export function renderInboxBadge(count: number) {
  if (count <= 0) return nothing;
  return html`<span class="inbox-badge">${count > 99 ? "99+" : count}</span>`;
}
