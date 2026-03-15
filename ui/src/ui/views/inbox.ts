import { html, nothing } from "lit";

export type InboxViewItem = {
  id: string;
  type: string;
  title: string;
  summary: string;
  source: { persona?: string; skill?: string; taskId?: string; queueItemId?: string };
  proofDocSlug?: string;
  outputPath?: string;
  sessionId?: string;
  createdAt: string;
  status: string;
  score?: number;
  feedback?: string;
  /** Project-completion fields */
  projectId?: string;
  deliverables?: Array<{ title: string; persona: string; proofDocSlug?: string; summary?: string }>;
  coworkSessionId?: string;
};

export type InboxSortOrder = "newest" | "oldest";

export type InboxSectionProps = {
  items: InboxViewItem[];
  loading?: boolean;
  count?: number;
  sortOrder?: InboxSortOrder;
  scoringId?: string | null;
  scoringValue?: number;
  feedbackText?: string;
  onViewOutput: (itemId: string) => void;
  onViewProof: (itemId: string) => void;
  onOpenChat: (itemId: string) => void;
  onDismiss: (itemId: string) => void;
  onScore: (itemId: string, score: number, feedback?: string) => void;
  onSetScoring: (itemId: string | null, score?: number) => void;
  onFeedbackChange: (text: string) => void;
  onSortToggle?: () => void;
  onMarkAll: () => void;
};

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

function personaLabel(item: InboxViewItem): string {
  if (item.source.persona) {
    return item.source.persona.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (item.source.skill) return item.source.skill;
  return item.type === "agent-execution" ? "Agent" : "Skill";
}

function scoreLabel(score: number): string {
  if (score <= 2) return "Poor";
  if (score <= 4) return "Below expectations";
  if (score <= 6) return "Okay";
  if (score <= 8) return "Good";
  return "Excellent";
}

function renderScoreWidget(props: InboxSectionProps, item: InboxViewItem) {
  if (props.scoringId !== item.id) return nothing;

  const score = props.scoringValue ?? 7;
  const feedbackText = props.feedbackText ?? "";
  const needsFeedback = score <= 4;
  const showFeedback = score <= 4 || score >= 9;

  return html`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${score <= 4 ? "low" : score >= 9 ? "high" : ""}">${score}/10 — ${scoreLabel(score)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
          (n) => html`
            <button
              class="inbox-score-btn${n === score ? " active" : ""}${n <= 4 ? " low" : n >= 9 ? " high" : ""}"
              @click=${() => props.onSetScoring(item.id, n)}
            >${n}</button>
          `,
        )}
      </div>
      ${showFeedback
        ? html`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${needsFeedback
                  ? "What went wrong? This feedback improves the agent. (required)"
                  : "What made this great? (optional)"}
                .value=${feedbackText}
                @input=${(e: Event) => props.onFeedbackChange((e.target as HTMLTextAreaElement).value)}
              ></textarea>
            </div>
          `
        : nothing}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${needsFeedback && !feedbackText.trim()}
          @click=${() => props.onScore(item.id, score, feedbackText.trim() || undefined)}
        >Submit ${score}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${() => props.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `;
}

function renderProjectCompletionCard(props: InboxSectionProps, item: InboxViewItem) {
  const deliverables = item.deliverables ?? [];
  return html`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${timeAgo(item.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${item.title}</div>
        <div class="inbox-card-summary">${item.summary}</div>
        ${deliverables.length > 0
          ? html`
              <div class="inbox-deliverables">
                ${deliverables.map(
                  (d) => html`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${d.persona.replace(/-/g, " ")}</span>
                      <span class="inbox-deliverable-title">${d.title}</span>
                      ${d.proofDocSlug
                        ? html`<button class="btn btn--sm" @click=${() => props.onViewOutput(item.id)}>View</button>`
                        : nothing}
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${() => props.onOpenChat(item.id)}>Review with Prosper</button>
        ${item.proofDocSlug
          ? html`<button class="btn btn--sm" @click=${() => props.onViewOutput(item.id)}>View Deliverables</button>`
          : nothing}
        <button class="btn btn--sm" @click=${() => props.onSetScoring(item.id, 7)}>Score</button>
        <button class="btn btn--sm" @click=${() => props.onDismiss(item.id)}>Dismiss</button>
      </div>
      ${renderScoreWidget(props, item)}
    </div>
  `;
}

function renderInboxCard(props: InboxSectionProps, item: InboxViewItem) {
  if (item.type === "project-completion") {
    return renderProjectCompletionCard(props, item);
  }

  const hasChat = Boolean(item.sessionId || item.source.taskId || item.source.queueItemId);
  return html`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${personaLabel(item)}</span>
        <span class="inbox-card-time">${timeAgo(item.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${item.title}</div>
        <div class="inbox-card-summary">${item.summary.slice(0, 220)}${item.summary.length > 220 ? "…" : ""}</div>
      </div>
      <div class="inbox-card-actions">
        ${item.outputPath
          ? html`<button class="btn btn--sm" @click=${() => props.onViewOutput(item.id)}>View Output</button>`
          : nothing}
        ${item.proofDocSlug
          ? html`<button class="btn btn--sm" @click=${() => props.onViewProof(item.id)}>Proof</button>`
          : nothing}
        ${hasChat
          ? html`<button class="btn btn--sm" @click=${() => props.onOpenChat(item.id)}>Open Chat</button>`
          : nothing}
        <button class="btn btn--sm primary" @click=${() => props.onSetScoring(item.id, 7)}>Complete</button>
        <button class="btn btn--sm" @click=${() => props.onDismiss(item.id)}>Dismiss</button>
      </div>
      ${renderScoreWidget(props, item)}
    </div>
  `;
}

export function renderInboxSection(props: InboxSectionProps) {
  const sortOrder = props.sortOrder ?? "newest";
  const pendingItems = props.items
    .filter((item) => item.status === "pending")
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "oldest" ? -diff : diff;
    });
  const count = props.count ?? pendingItems.length;

  if (props.loading) {
    return html`<div class="inbox-loading">Loading inbox…</div>`;
  }

  if (count === 0) {
    return html`
      <div class="my-day-card">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">&#x1F4E5;</span>
            <span>INBOX</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="my-day-empty">Nothing pending. Background agent work will appear here when it lands.</div>
        </div>
      </div>
    `;
  }

  return html`
    <div class="my-day-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F4E5;</span>
          <span>INBOX</span>
          <span class="tab-badge" style="margin-left: 8px;">${count}</span>
        </div>
        <div class="inbox-header-actions">
          <button class="btn btn--sm" @click=${() => props.onSortToggle?.()}>${sortOrder === "newest" ? "Newest first" : "Oldest first"}</button>
          <button class="btn btn--sm" @click=${() => props.onMarkAll()}>Mark All Complete</button>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${pendingItems.map((item) => renderInboxCard(props, item))}
        </div>
      </div>
    </div>
  `;
}
