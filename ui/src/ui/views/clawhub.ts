import { html, nothing } from "lit";
import { clampText } from "../format";
import type {
  ClawHubSearchResult,
  ClawHubSkillDetail,
  ClawHubSkillItem,
  ClawHubSkillStats,
} from "../types";

export type ClawHubProps = {
  loading: boolean;
  error: string | null;
  query: string;
  results: ClawHubSearchResult[] | null;
  exploreItems: ClawHubSkillItem[] | null;
  exploreSort: string;
  detailSlug: string | null;
  detail: ClawHubSkillDetail | null;
  importing: string | null;
  message: { kind: "success" | "error"; message: string } | null;
  onSearch: (query: string) => void;
  onExplore: (sort: string) => void;
  onDetail: (slug: string) => void;
  onCloseDetail: () => void;
  onImport: (slug: string) => void;
  onImportAndPersonalize: (slug: string) => void;
};

const SORT_OPTIONS = [
  { key: "trending", label: "Trending" },
  { key: "updated", label: "Newest" },
  { key: "stars", label: "Top Rated" },
  { key: "downloads", label: "Popular" },
];

export function renderClawHub(props: ClawHubProps) {
  return html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div class="muted" style="line-height: 1.5;">
        Browse 3,000+ community skills from the
        <a href="https://clawhub.ai" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">ClawHub</a>
        registry. When you import a skill, GodMode reviews it against your current
        setup — checking for overlaps, missing tools, and integration opportunities — then
        walks you through personalizing it for your specific workflow in a dedicated chat session.
      </div>
      ${renderSearchBar(props)}
      ${props.error
        ? html`<div class="callout danger">${props.error}</div>`
        : nothing}
      ${props.message
        ? html`<div class="callout ${props.message.kind === "error" ? "danger" : "success"}">
            ${props.message.message}
          </div>`
        : nothing}
      ${props.detailSlug ? renderDetailPanel(props) : nothing}
      ${!props.detailSlug ? renderBrowse(props) : nothing}
    </div>
  `;
}

function renderSearchBar(props: ClawHubProps) {
  let debounceTimer: ReturnType<typeof setTimeout>;
  return html`
    <div class="filters">
      <label class="field" style="flex: 1;">
        <span>Search ClawHub</span>
        <input
          .value=${props.query}
          @input=${(e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => props.onSearch(value), 400);
          }}
          placeholder="Search 3,000+ skills..."
        />
      </label>
    </div>
  `;
}

function renderBrowse(props: ClawHubProps) {
  // Show search results if we have them
  if (props.results && props.query.trim()) {
    return html`
      <div>
        <div class="muted" style="margin-bottom: 8px;">
          ${props.results.length} results for "${props.query}"
        </div>
        ${props.results.length === 0
          ? html`<div class="muted">No skills found. Try a different search.</div>`
          : html`<div class="list">
              ${props.results.map((r) => renderSearchResult(r, props))}
            </div>`}
      </div>
    `;
  }

  // Otherwise show explore view
  return html`
    <div>
      <div class="chip-row" style="margin-bottom: 12px;">
        ${SORT_OPTIONS.map(
          (opt) => html`
            <button
              class="chip ${props.exploreSort === opt.key ? "chip-ok" : ""}"
              style="cursor: pointer; border: none; background: var(${
                props.exploreSort === opt.key
                  ? "--chip-ok-bg, #e6f4ea"
                  : "--chip-bg, #f3f3f3"
              });"
              @click=${() => props.onExplore(opt.key)}
            >
              ${opt.label}
            </button>
          `,
        )}
      </div>
      ${props.loading
        ? html`<div class="muted">Loading skills...</div>`
        : nothing}
      ${props.exploreItems && props.exploreItems.length > 0
        ? html`<div class="list">
            ${props.exploreItems.map((item) => renderExploreItem(item, props))}
          </div>`
        : !props.loading
          ? html`<div class="muted">No skills found.</div>`
          : nothing}
    </div>
  `;
}

function renderSearchResult(result: ClawHubSearchResult, props: ClawHubProps) {
  const slug = result.slug ?? "unknown";
  const name = result.displayName ?? slug;
  const busy = props.importing === slug;
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${name}</div>
        <div class="list-sub">${clampText(result.summary ?? "", 120)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${slug}</span>
          ${result.version
            ? html`<span class="chip">v${result.version}</span>`
            : nothing}
          ${renderStats(result.stats)}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn" @click=${() => props.onDetail(slug)}>
            Preview
          </button>
          <button class="btn primary" ?disabled=${busy} @click=${() => props.onImportAndPersonalize(slug)}>
            ${busy ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderExploreItem(item: ClawHubSkillItem, props: ClawHubProps) {
  const busy = props.importing === item.slug;
  const age = formatRelativeTime(item.updatedAt);
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${item.displayName}</div>
        <div class="list-sub">${clampText(item.summary ?? "", 120)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${item.slug}</span>
          ${item.latestVersion
            ? html`<span class="chip">v${item.latestVersion.version}</span>`
            : nothing}
          ${renderStats(item.stats)}
          <span class="chip">${age}</span>
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn" @click=${() => props.onDetail(item.slug)}>
            Preview
          </button>
          <button class="btn primary" ?disabled=${busy} @click=${() => props.onImportAndPersonalize(item.slug)}>
            ${busy ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDetailPanel(props: ClawHubProps) {
  const d = props.detail;
  const slug = props.detailSlug ?? "";
  const busy = props.importing === slug;

  if (props.loading && !d) {
    return html`<div class="muted">Loading skill details...</div>`;
  }
  if (!d || !d.skill) {
    return html`
      <div>
        <button class="btn" @click=${props.onCloseDetail}>Back</button>
        <div class="muted" style="margin-top: 12px;">Skill not found.</div>
      </div>
    `;
  }

  const isMalware = d.moderation?.isMalwareBlocked ?? false;
  const isSuspicious = d.moderation?.isSuspicious ?? false;

  return html`
    <div>
      <button class="btn" @click=${props.onCloseDetail}>&larr; Back to browse</button>

      <div style="margin-top: 16px;">
        <div class="card-title">${d.skill.displayName}</div>
        <div class="card-sub" style="margin-top: 4px;">${slug}</div>

        ${d.skill.summary
          ? html`<div style="margin-top: 12px;">${d.skill.summary}</div>`
          : nothing}

        <div class="chip-row" style="margin-top: 12px;">
          ${d.latestVersion
            ? html`<span class="chip">v${d.latestVersion.version}</span>`
            : nothing}
          ${d.owner?.handle
            ? html`<span class="chip">by @${d.owner.handle}</span>`
            : d.owner?.displayName
              ? html`<span class="chip">by ${d.owner.displayName}</span>`
              : nothing}
          ${renderStats(d.skill.stats)}
          ${isMalware
            ? html`<span class="chip chip-warn" style="background: var(--danger-bg, #fde8e8); color: var(--danger-color, #d14343);">
                Blocked — malware
              </span>`
            : nothing}
          ${isSuspicious && !isMalware
            ? html`<span class="chip chip-warn">Suspicious — review before use</span>`
            : nothing}
        </div>

        ${d.latestVersion?.changelog
          ? html`
            <div style="margin-top: 16px;">
              <div class="muted" style="font-weight: 600; margin-bottom: 4px;">Changelog</div>
              <div class="list-sub">${d.latestVersion.changelog}</div>
            </div>`
          : nothing}

        <div class="row" style="gap: 8px; margin-top: 20px;">
          ${isMalware
            ? html`<div class="callout danger">This skill is blocked and cannot be imported.</div>`
            : html`
                <button class="btn primary" ?disabled=${busy} @click=${() => props.onImportAndPersonalize(slug)}>
                  ${busy ? "Importing..." : "Import + Personalize"}
                </button>
                <button class="btn" ?disabled=${busy} @click=${() => props.onImport(slug)}>
                  ${busy ? "Importing..." : "Import Only"}
                </button>
              `}
        </div>
      </div>
    </div>
  `;
}

function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function renderStats(stats: ClawHubSkillStats | null | undefined) {
  if (!stats) return nothing;
  const parts = [];
  if (typeof stats.stars === "number" && stats.stars > 0) {
    parts.push(html`<span class="chip" title="Stars">\u2605 ${formatCompactNumber(stats.stars)}</span>`);
  }
  if (typeof stats.downloads === "number" && stats.downloads > 0) {
    parts.push(html`<span class="chip" title="Downloads">\u2193 ${formatCompactNumber(stats.downloads)}</span>`);
  }
  if (typeof stats.installsCurrent === "number" && stats.installsCurrent > 0) {
    parts.push(html`<span class="chip" title="Active installs">\u2713 ${formatCompactNumber(stats.installsCurrent)}</span>`);
  }
  return parts;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
