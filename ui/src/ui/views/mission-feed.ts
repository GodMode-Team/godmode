import { html } from "lit";
import type { FeedItem } from "./mission-types";

export type { FeedItem };

export type MissionFeedProps = {
  items: FeedItem[];
};

export function renderMissionFeed(props: MissionFeedProps) {
  const items = props.items;

  return html`
    <div class="mission-feed-panel">
      <div class="mission-panel-header">
        <div class="mission-panel-title">LIVE FEED</div>
        <div class="mission-live-indicator">
          <span class="status-indicator status-working"></span>
          <span class="live-label">LIVE</span>
        </div>
      </div>
      <div class="mission-feed-list">
        ${
          items.length === 0
            ? html`
                <div class="mission-empty-state">No activity yet. Events appear as agents work.</div>
              `
            : items.map((item) => renderFeedItem(item))
        }
      </div>
    </div>
  `;
}

function renderFeedItem(item: FeedItem) {
  return html`
    <div class="mission-feed-item">
      <div class="mission-feed-time">${item.timestamp}</div>
      <div class="mission-feed-content">
        <span class="mission-feed-agent">${item.agent}</span>
        <span class="mission-feed-action">${item.action}</span>
        ${item.details ? html`<div class="mission-feed-details">${item.details}</div>` : ""}
      </div>
    </div>
  `;
}
