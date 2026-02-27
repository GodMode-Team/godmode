import { html, nothing } from "lit";
import type {
  TrustTrackerData,
  WorkflowSummary,
  TrustRating,
} from "../controllers/trust-tracker";

// ===== Types =====

export type TrustTrackerProps = {
  connected: boolean;
  loading?: boolean;
  data: TrustTrackerData | null;
  onAddWorkflow: (workflow: string) => void;
  onRemoveWorkflow: (workflow: string) => void;
  onRefresh: () => void;
};

// ===== Helpers =====

function trendBadge(trend: WorkflowSummary["trend"]) {
  const map: Record<string, { label: string; cls: string }> = {
    improving: { label: "\u2191 improving", cls: "trust-trend--up" },
    declining: { label: "\u2193 declining", cls: "trust-trend--down" },
    stable: { label: "\u2192 stable", cls: "trust-trend--stable" },
    new: { label: "\u2605 new", cls: "trust-trend--new" },
  };
  const t = map[trend] ?? map.new!;
  return html`<span class="trust-trend ${t.cls}">${t.label}</span>`;
}

function stars(rating: number) {
  const filled = Math.round(rating);
  return html`<span class="trust-stars">${
    Array.from({ length: 5 }, (_, i) =>
      html`<span class="trust-star ${i < filled ? "trust-star--filled" : ""}">\u2605</span>`,
    )
  }</span>`;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ===== Render =====

function renderWorkflowChip(
  summary: WorkflowSummary,
  onRemove: (w: string) => void,
) {
  return html`
    <div class="trust-chip">
      <div class="trust-chip-header">
        <span class="trust-chip-name">${summary.workflow}</span>
        <button
          class="trust-chip-remove"
          title="Remove workflow"
          @click=${() => onRemove(summary.workflow)}
        >\u00D7</button>
      </div>
      <div class="trust-chip-stats">
        ${summary.count > 0
          ? html`
              ${stars(summary.avgRating)}
              <span class="trust-chip-avg">${summary.avgRating}/5</span>
              <span class="trust-chip-count">(${summary.count})</span>
              ${trendBadge(summary.trend)}
            `
          : html`<span class="trust-chip-empty">No ratings yet</span>`
        }
      </div>
      ${summary.recentNotes.length > 0
        ? html`
            <div class="trust-chip-notes">
              ${summary.recentNotes.map(
                (n) => html`<span class="trust-chip-note">"${n}"</span>`,
              )}
            </div>
          `
        : nothing
      }
    </div>
  `;
}

function renderAddWorkflow(onAdd: (w: string) => void, atLimit: boolean) {
  if (atLimit) return nothing;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      onAdd(value);
      input.value = "";
    }
  };

  return html`
    <form class="trust-add-form" @submit=${handleSubmit}>
      <input
        type="text"
        class="trust-add-input"
        placeholder="Add workflow (e.g. email drafts, code reviews)"
        maxlength="60"
      />
      <button type="submit" class="trust-add-btn">Add</button>
    </form>
  `;
}

function renderRatingRow(r: TrustRating) {
  return html`
    <div class="trust-rating-row">
      <span class="trust-rating-workflow">${r.workflow}</span>
      ${stars(r.rating)}
      ${r.note ? html`<span class="trust-rating-note">${r.note}</span>` : nothing}
      <span class="trust-rating-time">${relativeTime(r.timestamp)}</span>
    </div>
  `;
}

export function renderTrustTracker(props: TrustTrackerProps) {
  const { connected, loading, data, onAddWorkflow, onRemoveWorkflow, onRefresh } = props;

  if (!connected) {
    return html`
      <section class="tab-body trust-section">
        <div class="trust-empty">Not connected to gateway.</div>
      </section>
    `;
  }

  if (loading && !data) {
    return html`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;
  }

  const summaries = data?.summaries ?? [];
  const ratings = data?.ratings ?? [];
  const workflows = data?.workflows ?? [];
  const atLimit = workflows.length >= 5;

  return html`
    <section class="tab-body trust-section">
      <div class="trust-header">
        <h2 class="trust-title">Trust Tracker</h2>
        <button class="trust-refresh" @click=${onRefresh} title="Refresh">\u21BB</button>
      </div>

      <p class="trust-subtitle">
        Track how well your AI handles specific workflows. Rate tasks 1-5 and the agent learns your preferences over time.
      </p>

      <div class="trust-workflows">
        ${summaries.map((s) => renderWorkflowChip(s, onRemoveWorkflow))}
        ${workflows.length === 0
          ? html`<div class="trust-empty-workflows">No workflows tracked yet. Add up to 5 categories below.</div>`
          : nothing
        }
      </div>

      ${renderAddWorkflow(onAddWorkflow, atLimit)}

      ${ratings.length > 0
        ? html`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              ${ratings.map(renderRatingRow)}
            </div>
          `
        : nothing
      }
    </section>
  `;
}
