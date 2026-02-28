import { html, nothing } from "lit";
import type {
  TrustTrackerData,
  DailyRating,
  WorkflowSummary,
  TrustRating,
} from "../controllers/trust-tracker";
import type {
  GuardrailGateView,
  GuardrailActivityView,
  GuardrailsViewData,
} from "../controllers/guardrails";
import { formatDurationMs } from "../format";

// ===== Types =====

export type UpdateStatusSummary = {
  openclawUpdateAvailable: boolean;
  pluginUpdateAvailable: boolean;
  openclawVersion: string;
  pluginVersion: string;
  openclawLatest: string | null;
  pluginLatest: string | null;
} | null;

export type TrustTrackerProps = {
  connected: boolean;
  loading?: boolean;
  data: TrustTrackerData | null;
  onAddWorkflow?: (workflow: string) => void;
  onRemoveWorkflow: (workflow: string) => void;
  onRefresh: () => void;
  guardrailsData?: GuardrailsViewData | null;
  consciousnessStatus?: "idle" | "loading" | "ok" | "error";
  sessionsCount?: number | null;
  gatewayUptimeMs?: number | null;
  onDailyRate?: (rating: number, note?: string) => void;
  updateStatus?: UpdateStatusSummary;
};

// ===== Helpers =====

type ScoreLevel = "high" | "medium" | "low" | "none";

function scoreLevel(score: number | null): ScoreLevel {
  if (score === null) return "none";
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function scoreLevelClass(level: ScoreLevel): string {
  const map: Record<ScoreLevel, string> = {
    high: "trust-score--high",
    medium: "trust-score--medium",
    low: "trust-score--low",
    none: "trust-score--none",
  };
  return map[level];
}

function trendLabel(trend: WorkflowSummary["trend"]): string {
  const map: Record<string, string> = {
    improving: "Improving",
    declining: "Declining",
    stable: "Stable",
    new: "New",
  };
  return map[trend] ?? "New";
}

function trendClass(trend: WorkflowSummary["trend"]): string {
  const map: Record<string, string> = {
    improving: "trust-trend--up",
    declining: "trust-trend--down",
    stable: "trust-trend--stable",
    new: "trust-trend--new",
  };
  return map[trend] ?? "trust-trend--new";
}

function trendArrow(trend: WorkflowSummary["trend"]): string {
  const map: Record<string, string> = {
    improving: "\u2191",
    declining: "\u2193",
    stable: "\u2192",
    new: "\u2022",
  };
  return map[trend] ?? "\u2022";
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

// ===== Sub-renders =====

function renderOverallScore(data: TrustTrackerData) {
  const score = data.overallScore;
  const level = scoreLevel(score);

  return html`
    <div class="trust-overall">
      <div class="trust-overall-score ${scoreLevelClass(level)}">
        <span class="trust-overall-number">${score !== null ? score.toFixed(1) : "--"}</span>
        <span class="trust-overall-max">/10</span>
      </div>
      <div class="trust-overall-meta">
        <span class="trust-overall-label">Overall Trust Score</span>
        <span class="trust-overall-stats">
          ${data.totalRatings} rating${data.totalRatings !== 1 ? "s" : ""}
          across ${data.workflows.length} workflow${data.workflows.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  `;
}

function renderProgressBar(score: number | null, avg: number) {
  // Use trustScore if available, otherwise avgRating for in-progress display
  const value = score ?? avg;
  const pct = Math.min(100, Math.max(0, (value / 10) * 100));
  const level = scoreLevel(score ?? (avg > 0 ? avg : null));

  return html`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${scoreLevelClass(level)}"
        style="width: ${pct}%"
      ></div>
    </div>
  `;
}

function renderWorkflowCard(
  summary: WorkflowSummary,
  onRemove: ((w: string) => void) | null,
) {
  const hasScore = summary.trustScore !== null;
  const displayScore = hasScore ? summary.trustScore!.toFixed(1) : summary.avgRating > 0 ? summary.avgRating.toFixed(1) : "--";
  const level = scoreLevel(summary.trustScore ?? (summary.avgRating > 0 ? summary.avgRating : null));
  const ratingsNeeded = summary.count < 10 ? 10 - summary.count : 0;

  return html`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${summary.workflow}</span>
        ${onRemove
          ? html`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${() => onRemove(summary.workflow)}
            >&times;</button>`
          : nothing
        }
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${scoreLevelClass(level)}">${displayScore}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${trendClass(summary.trend)}">
          ${trendArrow(summary.trend)} ${trendLabel(summary.trend)}
        </span>
      </div>

      ${renderProgressBar(summary.trustScore, summary.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${summary.count} rating${summary.count !== 1 ? "s" : ""}</span>
        ${ratingsNeeded > 0
          ? html`<span class="trust-card-pending">${ratingsNeeded} more until trust score</span>`
          : nothing
        }
        ${summary.needsFeedback
          ? html`<span class="trust-card-needs-feedback">Needs improvement</span>`
          : nothing
        }
      </div>

      ${summary.recentFeedback.length > 0
        ? html`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${summary.recentFeedback.map(
                (f) => html`<span class="trust-card-feedback-item">${f}</span>`,
              )}
            </div>
          `
        : nothing
      }
    </div>
  `;
}

// Sample data shown before any real ratings come in
function sampleSummaries(): WorkflowSummary[] {
  return [
    {
      workflow: "Code Reviews",
      avgRating: 8.2,
      count: 14,
      trustScore: 8.2,
      needsFeedback: false,
      trend: "improving",
      recentNotes: [],
      recentFeedback: [],
    },
    {
      workflow: "Email Drafts",
      avgRating: 6.5,
      count: 11,
      trustScore: 6.5,
      needsFeedback: true,
      trend: "stable",
      recentNotes: [],
      recentFeedback: ["Be more concise", "Match my tone"],
    },
    {
      workflow: "Research",
      avgRating: 7.8,
      count: 3,
      trustScore: null,
      needsFeedback: false,
      trend: "new",
      recentNotes: [],
      recentFeedback: [],
    },
  ];
}

function sampleData(): TrustTrackerData {
  const summaries = sampleSummaries();
  return {
    workflows: summaries.map((s) => s.workflow),
    summaries,
    ratings: [],
    total: 0,
    overallScore: 7.6,
    totalRatings: 28,
    totalUses: 28,
  };
}

function renderRatingRow(r: TrustRating) {
  const level = scoreLevel(r.rating);
  return html`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${scoreLevelClass(level)}">${r.rating}</span>
      <span class="trust-rating-workflow">${r.workflow}</span>
      ${r.note ? html`<span class="trust-rating-note">${r.note}</span>` : nothing}
      <span class="trust-rating-time">${relativeTime(r.timestamp)}</span>
    </div>
  `;
}

function renderSampleBanner() {
  return html`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `;
}

// ===== Hero Banner =====

type HeroLevel = "ok" | "warn" | "alert";

function updateDetailSuffix(update: UpdateStatusSummary): string {
  if (!update) return "";
  if (update.openclawUpdateAvailable || update.pluginUpdateAvailable) {
    const parts: string[] = [];
    if (update.openclawUpdateAvailable && update.openclawLatest) {
      parts.push(`OpenClaw ${update.openclawVersion} \u2192 ${update.openclawLatest}`);
    }
    if (update.pluginUpdateAvailable && update.pluginLatest) {
      parts.push(`GodMode ${update.pluginVersion} \u2192 ${update.pluginLatest}`);
    }
    return parts.length > 0 ? ` Update available: ${parts.join(", ")}.` : "";
  }
  return "";
}

function computeHeroStatus(props: TrustTrackerProps): {
  level: HeroLevel;
  icon: string;
  text: string;
  detail: string;
} {
  const connected = props.connected;
  const guardrails = props.guardrailsData;
  const consciousness = props.consciousnessStatus;
  const todayRating = props.data?.todayRating ?? null;
  const update = props.updateStatus ?? null;
  const hasUpdate = update?.openclawUpdateAvailable || update?.pluginUpdateAvailable;

  // Critical: not connected
  if (!connected) {
    return {
      level: "alert",
      icon: "\u{26A0}\u{FE0F}",
      text: "Gateway disconnected",
      detail: "Reconnect to restore full functionality.",
    };
  }

  // Updates available — show prominently
  if (hasUpdate) {
    const parts: string[] = [];
    if (update!.openclawUpdateAvailable && update!.openclawLatest) {
      parts.push(`OpenClaw ${update!.openclawVersion} \u2192 ${update!.openclawLatest}`);
    }
    if (update!.pluginUpdateAvailable && update!.pluginLatest) {
      parts.push(`GodMode ${update!.pluginVersion} \u2192 ${update!.pluginLatest}`);
    }
    return {
      level: "warn",
      icon: "\u{1F504}",
      text: "Update available",
      detail: parts.join(", ") + ". Visit Overview to update.",
    };
  }

  // Consciousness error
  if (consciousness === "error") {
    return {
      level: "warn",
      icon: "\u{1F9E0}",
      text: "Consciousness sync needs attention",
      detail: "Your system is running but the last sync encountered an error.",
    };
  }

  // Guardrails: some disabled
  if (guardrails) {
    const enabled = guardrails.gates.filter((g) => g.enabled).length;
    const total = guardrails.gates.length;
    if (enabled < total) {
      return {
        level: "warn",
        icon: "\u{1F6E1}",
        text: `${total - enabled} security gate${total - enabled !== 1 ? "s" : ""} disabled`,
        detail: "Your system is running with reduced safety coverage.",
      };
    }
  }

  // Build the "up to date" suffix for healthy states
  const upToDate = update && !hasUpdate ? " Up to date." : "";

  // All good — personalize with today's rating
  if (todayRating) {
    if (todayRating.rating >= 8) {
      return {
        level: "ok",
        icon: "\u2728",
        text: `Rated ${todayRating.rating}/10 today \u2014 GodMode is running great.`,
        detail: `All systems secure and building trust daily.${upToDate}`,
      };
    }
    if (todayRating.rating >= 5) {
      return {
        level: "ok",
        icon: "\u{1F4AA}",
        text: `Rated ${todayRating.rating}/10 today \u2014 working to improve.`,
        detail: `Your feedback is being applied. All systems secure.${upToDate}`,
      };
    }
    return {
      level: "warn",
      icon: "\u{1F4AC}",
      text: `Rated ${todayRating.rating}/10 today \u2014 your feedback matters.`,
      detail: `We're using your input to get better. All systems secure.${upToDate}`,
    };
  }

  return {
    level: "ok",
    icon: "\u2705",
    text: "Your GodMode is safe, secure, and building trust daily.",
    detail: `All systems healthy.${upToDate} Rate your day below to help improve.`,
  };
}

function renderTrustHero(props: TrustTrackerProps) {
  const { level, icon, text, detail } = computeHeroStatus(props);

  return html`
    <div class="trust-hero trust-hero--${level}">
      <span class="trust-hero-icon">${icon}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${text}</div>
        <div class="trust-hero-detail">${detail}</div>
      </div>
    </div>
  `;
}

// ===== Daily Rating =====

function dailyButtonClass(n: number): string {
  if (n <= 4) return "trust-daily-button--low";
  if (n <= 7) return "trust-daily-button--med";
  return "trust-daily-button--high";
}

function renderDailyTrend(recentDaily: DailyRating[]) {
  // Show 7 slots (pad with empties if fewer)
  const slots: (DailyRating | null)[] = [];
  for (let i = 0; i < 7; i++) {
    slots.push(recentDaily[i] ?? null);
  }

  return html`
    <div class="trust-daily-trend">
      ${slots.map((d) => {
        if (!d) {
          return html`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;
        }
        const h = Math.max(4, (d.rating / 10) * 28);
        const level = scoreLevel(d.rating);
        const levelName = level === "none" ? "medium" : level;
        return html`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${levelName}"
            style="height: ${h}px"
            title="${d.date}: ${d.rating}/10"
          ></div>
        `;
      })}
    </div>
  `;
}

function renderDailyRating(props: TrustTrackerProps) {
  const data = props.data;
  const todayRating = data?.todayRating ?? null;
  const recentDaily = data?.recentDaily ?? [];
  const streak = data?.dailyStreak ?? 0;
  const dailyAvg = data?.dailyAverage ?? null;

  if (!props.onDailyRate) return nothing;

  // Already rated today — show result
  if (todayRating) {
    const level = scoreLevel(todayRating.rating);
    const needsFeedback = todayRating.rating < 7 && !todayRating.note;

    return html`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${streak > 1
            ? html`<span class="trust-daily-streak">${streak} day streak</span>`
            : nothing}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${scoreLevelClass(level)}">
            ${todayRating.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${todayRating.rating >= 8
                ? "Great day!"
                : todayRating.rating >= 5
                  ? "Good, working to improve"
                  : "Thanks for the honesty"}
            </span>
            ${todayRating.note
              ? html`<span class="trust-daily-result-note">"${todayRating.note}"</span>`
              : nothing}
            ${dailyAvg !== null
              ? html`<span class="trust-daily-result-note">7-day avg: ${dailyAvg}/10</span>`
              : nothing}
          </div>
          ${recentDaily.length > 1 ? renderDailyTrend(recentDaily) : nothing}
        </div>
        ${needsFeedback
          ? html`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement;
                      const note = input.value.trim();
                      if (note && props.onDailyRate) {
                        props.onDailyRate(todayRating.rating, note);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${(e: Event) => {
                    const btn = e.target as HTMLElement;
                    const input = btn.previousElementSibling as HTMLInputElement;
                    const note = input?.value?.trim();
                    if (note && props.onDailyRate) {
                      props.onDailyRate(todayRating.rating, note);
                      input.value = "";
                    }
                  }}
                >Send</button>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  // Not yet rated — show rating buttons
  return html`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${streak > 0
          ? html`<span class="trust-daily-streak">${streak} day streak</span>`
          : nothing}
      </div>
      <div class="trust-daily-buttons">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
          (n) => html`
            <button
              class="trust-daily-button ${dailyButtonClass(n)}"
              type="button"
              title="${n}/10"
              @click=${() => props.onDailyRate!(n)}
            >${n}</button>
          `,
        )}
      </div>
      ${recentDaily.length > 0
        ? html`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${renderDailyTrend(recentDaily)}
              ${dailyAvg !== null
                ? html`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${dailyAvg}/10</span>`
                : nothing}
            </div>
          `
        : nothing}
    </div>
  `;
}

// ===== System Health =====

function renderSecurityStatus(data: GuardrailsViewData | null | undefined) {
  if (!data) {
    return html`
      <div class="trust-health-card">
        <div class="trust-health-card-header">
          <span class="trust-health-card-icon">\u{1F6E1}</span>
          Security
        </div>
        <div class="trust-health-row">
          <span class="trust-health-dot trust-health-dot--idle"></span>
          <span class="trust-health-label">Loading...</span>
        </div>
      </div>
    `;
  }

  const gates = data.gates;
  const enabledCount = gates.filter((g) => g.enabled).length;
  const totalCount = gates.length;
  const allEnabled = enabledCount === totalCount;

  // Count recent activity (last 24h)
  const oneDayAgo = Date.now() - 86_400_000;
  const recentActivity = data.activity.filter(
    (a) => Date.parse(a.timestamp) > oneDayAgo,
  );
  const blockedCount = recentActivity.filter((a) => a.action === "blocked").length;
  const firedCount = recentActivity.filter((a) => a.action === "fired").length;

  const badgeClass = allEnabled
    ? "trust-health-card-badge--ok"
    : enabledCount > 0
      ? "trust-health-card-badge--warn"
      : "trust-health-card-badge--error";

  return html`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${badgeClass}">
          ${enabledCount}/${totalCount} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${gates.map(
          (g) => html`
            <div class="trust-health-gate ${g.enabled ? "" : "trust-health-gate--disabled"}">
              <span class="trust-health-dot ${g.enabled ? "trust-health-dot--ok" : "trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${g.icon}</span>
              <span class="trust-health-gate-name">${g.name}</span>
            </div>
          `,
        )}
      </div>

      ${recentActivity.length > 0
        ? html`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${recentActivity.length}</span>
              event${recentActivity.length !== 1 ? "s" : ""} in last 24h
              ${blockedCount > 0
                ? html` &middot; <span class="trust-health-activity-count">${blockedCount}</span> blocked`
                : nothing}
              ${firedCount > 0
                ? html` &middot; <span class="trust-health-activity-count">${firedCount}</span> fired`
                : nothing}
            </div>
          `
        : html`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `;
}

function consciousnessLabel(
  status: "idle" | "loading" | "ok" | "error" | undefined,
): string {
  if (!status || status === "idle") return "Idle";
  if (status === "loading") return "Syncing...";
  if (status === "ok") return "Synced";
  return "Error";
}

function consciousnessDotClass(
  status: "idle" | "loading" | "ok" | "error" | undefined,
): string {
  if (!status || status === "idle") return "trust-health-dot--idle";
  if (status === "loading") return "trust-health-dot--warn";
  if (status === "ok") return "trust-health-dot--ok";
  return "trust-health-dot--error";
}

function renderSentinelHealth(props: TrustTrackerProps) {
  const connected = props.connected;
  const consciousness = props.consciousnessStatus;
  const sessions = props.sessionsCount;
  const uptimeMs = props.gatewayUptimeMs;

  const healthyCount =
    (connected ? 1 : 0) +
    (consciousness === "ok" || consciousness === "idle" ? 1 : 0);
  const totalChecks = 2;
  const allHealthy = healthyCount === totalChecks && connected;

  const badgeClass = allHealthy
    ? "trust-health-card-badge--ok"
    : connected
      ? "trust-health-card-badge--warn"
      : "trust-health-card-badge--error";
  const badgeLabel = allHealthy ? "Healthy" : connected ? "Degraded" : "Offline";

  return html`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F4E1}</span>
        Sentinel
        <span class="trust-health-card-badge ${badgeClass}">${badgeLabel}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${connected ? "trust-health-dot--ok" : "trust-health-dot--error"}"></span>
        <span class="trust-health-label">Gateway</span>
        <span class="trust-health-value">${connected ? "Connected" : "Disconnected"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${consciousnessDotClass(consciousness)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${consciousnessLabel(consciousness)}</span>
      </div>

      ${sessions != null
        ? html`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${sessions} active</span>
            </div>
          `
        : nothing}

      ${uptimeMs != null
        ? html`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${formatDurationMs(uptimeMs)}</span>
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderSystemHealth(props: TrustTrackerProps) {
  return html`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${renderSecurityStatus(props.guardrailsData)}
        ${renderSentinelHealth(props)}
      </div>
    </div>
  `;
}

// ===== Main Render =====

export function renderTrustTracker(props: TrustTrackerProps) {
  const { connected, loading, data, onRemoveWorkflow, onRefresh } = props;

  if (!connected) {
    return html`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
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

  const hasRealData = (data?.summaries ?? []).some((s) => s.count > 0);
  const useSample = !hasRealData;
  const displayData = useSample ? sampleData() : data!;
  const summaries = displayData.summaries;
  const ratings = useSample ? [] : (data?.ratings ?? []);

  return html`
    <section class="tab-body trust-section">
      ${renderTrustHero(props)}

      ${useSample ? renderSampleBanner() : nothing}

      ${renderDailyRating(props)}

      ${renderOverallScore(displayData)}

      <div class="trust-workflows-grid">
        ${summaries.map((s) => renderWorkflowCard(s, useSample ? null : onRemoveWorkflow))}
      </div>

      ${renderSystemHealth(props)}

      ${ratings.length > 0
        ? html`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${ratings.slice(0, 20).map(renderRatingRow)}
              </div>
            </div>
          `
        : nothing
      }
    </section>
  `;
}
