import { html, nothing } from "lit";
import type { LifetrackEntry } from "../controllers/lifetracks.js";
import { localDateString } from "../format.js";

// ===== Types =====

export type LifetracksConfig = {
  enabled: boolean;
  ffmpegAvailable?: boolean;
  stats?: {
    totalGenerated: number;
    lastGenerated: string | null;
    estimatedCost: number;
  };
};

export type LifetracksProps = {
  connected: boolean;
  data: LifetrackEntry[] | null;
  currentTrack: LifetrackEntry | null;
  loading?: boolean;
  error?: string | null;
  config?: LifetracksConfig | null;
  generating?: boolean;
  generationError?: string | null;
  onRefresh?: () => void;
  onSelectTrack?: (track: LifetrackEntry) => void;
  onEnable?: () => void;
  onGenerate?: () => void;
  onUpdateViaChat?: () => void;
};

// ===== Helper Functions =====

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isToday(dateStr: string): boolean {
  return dateStr === localDateString();
}

function getRelativeDate(dateStr: string): string {
  const today = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  return formatDateShort(dateStr);
}

function hasTodayTrack(tracks: LifetrackEntry[] | null): boolean {
  if (!tracks || tracks.length === 0) {
    return false;
  }
  const today = localDateString();
  return tracks.some((t) => t.date === today);
}

// ===== Render Functions =====

function renderEnableCta(onEnable?: () => void) {
  return html`
    <div class="lifetracks-container">
      <div class="lifetracks-enable-cta">
        <div class="cta-icon">🎧</div>
        <h2 class="cta-title">Enable LifeTracks</h2>
        <p class="cta-description">
          Generate personalized 5-minute daily affirmation audio based on your Vision Board and
          Wheel of Life. Each track is tailored to your goals and current focus areas.
        </p>
        <div class="cta-cost-info">
          <span class="cost-label">Cost:</span>
          <span class="cost-value">~$0.16 per track</span>
          <span class="cost-breakdown">(Claude + ElevenLabs)</span>
        </div>
        <div class="cta-monthly">
          <span>Daily: ~$5/month</span>
          <span class="separator">•</span>
          <span>Weekly: ~$1.12/month</span>
        </div>
        ${
          onEnable
            ? html`<button class="cta-button primary-button" @click=${onEnable}>
              Enable LifeTracks
            </button>`
            : nothing
        }
        <p class="cta-note">You can pause or disable anytime in settings.</p>
      </div>
    </div>
  `;
}

function renderGenerateCta(
  generating: boolean,
  generationError: string | null,
  onGenerate?: () => void,
) {
  return html`
    <div class="lifetracks-generate-cta">
      <div class="generate-header">
        <h3>No tracks yet</h3>
        <p>Generate your first personalized LifeTrack based on your Vision Board and goals.</p>
      </div>

      ${
        generationError
          ? html`<div class="generate-error">
            <span class="error-icon">⚠️</span>
            <span>${generationError}</span>
          </div>`
          : nothing
      }

      <button
        class="generate-button primary-button ${generating ? "generating" : ""}"
        @click=${onGenerate}
        ?disabled=${generating}
      >
        ${
          generating
            ? html`
                <span class="spinner-small"></span> Generating (~2 min)...
              `
            : html`
                Generate Today's Track
              `
        }
      </button>

      <p class="generate-cost">Cost: ~$0.16</p>
    </div>
  `;
}

function renderPlayer(
  track: LifetrackEntry | null,
  hasTodayTrackValue: boolean,
  generating: boolean,
  onGenerate?: () => void,
) {
  if (!track) {
    return html`
      <div class="lifetracks-player-empty">
        <span class="player-empty-icon">🎧</span>
        <span class="player-empty-text">Select a track to play</span>
      </div>
    `;
  }

  return html`
    <div class="lifetracks-player">
      <div class="player-header">
        <div class="player-info">
          <span class="player-date">${formatDate(track.date)}</span>
          ${
            isToday(track.date)
              ? html`
                  <span class="player-badge today">Today's Track</span>
                `
              : nothing
          }
        </div>
      </div>
      <div class="player-audio-container">
        <audio class="player-audio" controls autoplay src=${track.url} preload="metadata">
          Your browser does not support the audio element.
        </audio>
      </div>
      <div class="player-actions">
        <a
          class="player-link"
          href=${track.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Download audio"
        >
          Download MP3
        </a>
        ${
          !hasTodayTrackValue && onGenerate
            ? html`<button
              class="player-generate-btn ${generating ? "generating" : ""}"
              @click=${onGenerate}
              ?disabled=${generating}
            >
              ${generating ? "Generating..." : "Generate Today's"}
            </button>`
            : nothing
        }
      </div>
    </div>
  `;
}

function renderTrackList(
  tracks: LifetrackEntry[],
  currentTrack: LifetrackEntry | null,
  onSelectTrack?: (track: LifetrackEntry) => void,
) {
  if (!tracks || tracks.length === 0) {
    return html`
      <div class="lifetracks-empty-list">
        <span>No tracks available yet.</span>
      </div>
    `;
  }

  return html`
    <div class="lifetracks-list">
      ${tracks.map((track) => {
        const isActive = currentTrack?.date === track.date;
        const today = isToday(track.date);

        return html`
          <button
            class="lifetracks-list-item ${isActive ? "active" : ""} ${today ? "today" : ""}"
            @click=${() => onSelectTrack?.(track)}
          >
            <span class="list-item-date">${getRelativeDate(track.date)}</span>
            ${
              today
                ? html`
                    <span class="list-item-badge">NEW</span>
                  `
                : nothing
            }
            ${
              isActive
                ? html`
                    <span class="list-item-playing">▶</span>
                  `
                : nothing
            }
          </button>
        `;
      })}
    </div>
  `;
}

function renderStats(config: LifetracksConfig | null) {
  if (!config?.stats) {
    return nothing;
  }

  const { totalGenerated, estimatedCost } = config.stats;
  if (totalGenerated === 0) {
    return nothing;
  }

  return html`
    <div class="lifetracks-stats">
      <div class="stat">
        <span class="stat-value">${totalGenerated}</span>
        <span class="stat-label">Tracks Generated</span>
      </div>
      <div class="stat">
        <span class="stat-value">$${estimatedCost.toFixed(2)}</span>
        <span class="stat-label">Total Cost</span>
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderLifetracks(props: LifetracksProps) {
  // Check if LifeTracks is enabled
  if (!props.config?.enabled && !props.loading) {
    return renderEnableCta(props.onEnable);
  }

  if (props.loading) {
    return html`
      <div class="lifetracks-container">
        <div class="lifetracks-loading">
          <div class="spinner"></div>
          <span>Loading Lifetracks...</span>
        </div>
      </div>
    `;
  }

  if (props.error) {
    return html`
      <div class="lifetracks-container">
        <div class="lifetracks-error">
          <span class="error-icon">⚠️</span>
          <span>${props.error}</span>
          ${
            props.onRefresh
              ? html`<button class="retry-button" @click=${props.onRefresh}>Retry</button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  // Enabled but no tracks - show generate CTA
  if (!props.data || props.data.length === 0) {
    return html`
      <div class="lifetracks-container">
        <div class="lifetracks-header">
          <div class="lifetracks-header-left">
            <h1 class="lifetracks-title">LifeTracks</h1>
            <p class="lifetracks-subtitle">
              Daily personalized meditation audio with affirmations and vision alignment.
            </p>
          </div>
          <div class="lifetracks-header-right">
            <div class="lifetracks-status ${props.connected ? "online" : "offline"}">
              <span class="status-indicator status-${props.connected ? "working" : "idle"}"></span>
              <span class="status-label">${props.connected ? "ONLINE" : "OFFLINE"}</span>
            </div>
          </div>
        </div>

        ${renderGenerateCta(props.generating ?? false, props.generationError ?? null, props.onGenerate)}
      </div>
    `;
  }

  const hasTodayTrackValue = hasTodayTrack(props.data);

  return html`
    <div class="lifetracks-container">
      <!-- Header -->
      <div class="lifetracks-header">
        <div class="lifetracks-header-left">
          <h1 class="lifetracks-title">LifeTracks</h1>
          <p class="lifetracks-subtitle">
            Daily personalized meditation audio with affirmations and vision alignment.
          </p>
        </div>
        <div class="lifetracks-header-right">
          <div class="lifetracks-status ${props.connected ? "online" : "offline"}">
            <span class="status-indicator status-${props.connected ? "working" : "idle"}"></span>
            <span class="status-label">${props.connected ? "ONLINE" : "OFFLINE"}</span>
          </div>
          ${
            props.onUpdateViaChat
              ? html`<button class="goals-chat-btn" @click=${props.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`
              : nothing
          }
          ${
            props.onRefresh
              ? html`<button class="lifetracks-refresh-btn" @click=${props.onRefresh} title="Refresh">
                🔄
              </button>`
              : nothing
          }
        </div>
      </div>

      <!-- Main content -->
      <div class="lifetracks-content">
        <!-- Player section -->
        <div class="lifetracks-player-section">
          <div class="lifetracks-section-label">NOW PLAYING</div>
          ${renderPlayer(
            props.currentTrack,
            hasTodayTrackValue,
            props.generating ?? false,
            props.onGenerate,
          )}
        </div>

        <!-- Track list section -->
        <div class="lifetracks-list-section">
          <div class="lifetracks-section-label">ALL TRACKS (${props.data.length})</div>
          ${renderTrackList(props.data, props.currentTrack, props.onSelectTrack)}
        </div>
      </div>

      <!-- Stats -->
      ${renderStats(props.config ?? null)}

      <!-- Info card -->
      <div class="lifetracks-info-card">
        <span class="info-icon">💡</span>
        <div class="info-content">
          <strong>About LifeTracks</strong>
          <p>
            Each track is generated based on your Chief Definite Aim, identity statements, and
            lowest Wheel of Life areas. Mixed with calming Starseed background music for a
            5-minute morning ritual.
          </p>
        </div>
      </div>
    </div>
  `;
}
