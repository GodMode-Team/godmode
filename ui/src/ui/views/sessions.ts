import { html, nothing } from "lit";
import { formatAgo } from "../format";
import { pathForTab } from "../navigation";
import { formatSessionTokens } from "../presenter";
import type { ArchivedSessionEntry, GatewaySessionRow, SessionsListResult } from "../types";

export type SessionsProps = {
  loading: boolean;
  result: SessionsListResult | null;
  error: string | null;
  activeMinutes: string;
  limit: string;
  includeGlobal: boolean;
  includeUnknown: boolean;
  basePath: string;
  archivedSessions: ArchivedSessionEntry[];
  archivedSessionsLoading: boolean;
  archivedSessionsExpanded: boolean;
  onFiltersChange: (next: {
    activeMinutes: string;
    limit: string;
    includeGlobal: boolean;
    includeUnknown: boolean;
  }) => void;
  onRefresh: () => void;
  onPatch: (
    key: string,
    patch: {
      label?: string | null;
      thinkingLevel?: string | null;
      verboseLevel?: string | null;
      reasoningLevel?: string | null;
    },
  ) => void;
  onDelete: (key: string) => void;
  onArchive: (key: string) => void;
  onUnarchive: (key: string) => void;
  onToggleArchived: () => void;
  onAutoArchive: () => void;
};

const THINK_LEVELS = ["", "off", "minimal", "low", "medium", "high"] as const;
const BINARY_THINK_LEVELS = ["", "off", "on"] as const;
const VERBOSE_LEVELS = [
  { value: "", label: "inherit" },
  { value: "off", label: "off (explicit)" },
  { value: "on", label: "on" },
] as const;
const REASONING_LEVELS = ["", "off", "on", "stream"] as const;

function normalizeProviderId(provider?: string | null): string {
  if (!provider) {
    return "";
  }
  const normalized = provider.trim().toLowerCase();
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  return normalized;
}

function isBinaryThinkingProvider(provider?: string | null): boolean {
  return normalizeProviderId(provider) === "zai";
}

function resolveThinkLevelOptions(provider?: string | null): readonly string[] {
  return isBinaryThinkingProvider(provider) ? BINARY_THINK_LEVELS : THINK_LEVELS;
}

function resolveThinkLevelDisplay(value: string, isBinary: boolean): string {
  if (!isBinary) {
    return value;
  }
  if (!value || value === "off") {
    return value;
  }
  return "on";
}

function resolveThinkLevelPatchValue(value: string, isBinary: boolean): string | null {
  if (!value) {
    return null;
  }
  if (!isBinary) {
    return value;
  }
  if (value === "on") {
    return "low";
  }
  return value;
}

function formatArchiveReason(reason: string): string {
  switch (reason) {
    case "idle-7d":
      return "Idle > 7 days";
    case "task-complete":
      return "Task completed";
    case "manual":
      return "Manual";
    default:
      return reason;
  }
}

/** Inline SVG: archive box-arrow-down icon (16x16). */
function archiveIcon() {
  return html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`;
}

/** Inline SVG: restore / unarchive icon (16x16). */
function restoreIcon() {
  return html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`;
}

/** Inline SVG: chevron right / down for collapse toggle. */
function chevronIcon(expanded: boolean) {
  return html`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${expanded ? "90deg" : "0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`;
}

export function renderSessions(props: SessionsProps) {
  const allRows = props.result?.sessions ?? [];
  const archivedKeys = new Set(props.archivedSessions.map((a) => a.sessionKey));

  // Filter out archived sessions from the active list
  const rows = allRows.filter((row) => !archivedKeys.has(row.key));
  const archivedCount = props.archivedSessions.length;

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn"
            ?disabled=${props.loading}
            @click=${props.onAutoArchive}
            title="Run auto-archive: archive idle sessions and completed-task sessions"
          >
            Auto-archive
          </button>
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${props.activeMinutes}
            @input=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: (e.target as HTMLInputElement).value,
                limit: props.limit,
                includeGlobal: props.includeGlobal,
                includeUnknown: props.includeUnknown,
              })}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${props.limit}
            @input=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: (e.target as HTMLInputElement).value,
                includeGlobal: props.includeGlobal,
                includeUnknown: props.includeUnknown,
              })}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${props.includeGlobal}
            @change=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: props.limit,
                includeGlobal: (e.target as HTMLInputElement).checked,
                includeUnknown: props.includeUnknown,
              })}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${props.includeUnknown}
            @change=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: props.limit,
                includeGlobal: props.includeGlobal,
                includeUnknown: (e.target as HTMLInputElement).checked,
              })}
          />
        </label>
      </div>

      ${
        props.error
          ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
          : nothing
      }

      <div class="muted" style="margin-top: 12px;">
        ${props.result ? `Store: ${props.result.path}` : ""}
      </div>

      <div class="table" style="margin-top: 16px;">
        <div class="table-head">
          <div>Key</div>
          <div>Label</div>
          <div>Kind</div>
          <div>Updated</div>
          <div>Tokens</div>
          <div>Thinking</div>
          <div>Verbose</div>
          <div>Reasoning</div>
          <div>Actions</div>
        </div>
        ${
          rows.length === 0
            ? html`
                <div class="muted">No active sessions found.</div>
              `
            : rows.map((row) =>
                renderRow(row, props.basePath, props.onPatch, props.onDelete, props.onArchive, props.loading),
              )
        }
      </div>
    </section>

    ${renderArchivedSection(props, archivedCount)}
  `;
}

/** Collapsible archived sessions section. */
function renderArchivedSection(props: SessionsProps, archivedCount: number) {
  if (archivedCount === 0 && !props.archivedSessionsLoading) {
    return nothing;
  }

  return html`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${props.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${chevronIcon(props.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${archivedCount > 0
            ? html`<span class="archived-badge">${archivedCount}</span>`
            : nothing}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${
        props.archivedSessionsExpanded
          ? html`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${
                  props.archivedSessionsLoading
                    ? html`<div class="muted" style="padding: 12px;">Loading...</div>`
                    : props.archivedSessions.length === 0
                      ? html`<div class="muted" style="padding: 12px;">No archived sessions.</div>`
                      : props.archivedSessions.map((entry) => renderArchivedRow(entry, props.onUnarchive, props.loading))
                }
              </div>
            `
          : nothing
      }
    </section>
  `;
}

function renderRow(
  row: GatewaySessionRow,
  basePath: string,
  onPatch: SessionsProps["onPatch"],
  onDelete: SessionsProps["onDelete"],
  onArchive: SessionsProps["onArchive"],
  disabled: boolean,
) {
  const updated = row.updatedAt ? formatAgo(row.updatedAt) : "n/a";
  const rawThinking = row.thinkingLevel ?? "";
  const isBinaryThinking = isBinaryThinkingProvider(row.modelProvider);
  const thinking = resolveThinkLevelDisplay(rawThinking, isBinaryThinking);
  const thinkLevels = resolveThinkLevelOptions(row.modelProvider);
  const verbose = row.verboseLevel ?? "";
  const reasoning = row.reasoningLevel ?? "";
  const displayName = row.displayName ?? row.key;
  const canLink = row.kind !== "global";
  const chatUrl = canLink
    ? `${pathForTab("chat", basePath)}?session=${encodeURIComponent(row.key)}`
    : null;

  return html`
    <div class="table-row">
      <div class="mono">${
        canLink ? html`<a href=${chatUrl} class="session-link">${displayName}</a>` : displayName
      }</div>
      <div>
        <input
          .value=${row.label ?? ""}
          ?disabled=${disabled}
          placeholder="(optional)"
          @change=${(e: Event) => {
            const value = (e.target as HTMLInputElement).value.trim();
            onPatch(row.key, { label: value || null });
          }}
        />
      </div>
      <div>${row.kind}</div>
      <div>${updated}</div>
      <div>${formatSessionTokens(row)}</div>
      <div>
        <select
          .value=${thinking}
          ?disabled=${disabled}
          @change=${(e: Event) => {
            const value = (e.target as HTMLSelectElement).value;
            onPatch(row.key, {
              thinkingLevel: resolveThinkLevelPatchValue(value, isBinaryThinking),
            });
          }}
        >
          ${thinkLevels.map((level) => html`<option value=${level}>${level || "inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${verbose}
          ?disabled=${disabled}
          @change=${(e: Event) => {
            const value = (e.target as HTMLSelectElement).value;
            onPatch(row.key, { verboseLevel: value || null });
          }}
        >
          ${VERBOSE_LEVELS.map(
            (level) => html`<option value=${level.value}>${level.label}</option>`,
          )}
        </select>
      </div>
      <div>
        <select
          .value=${reasoning}
          ?disabled=${disabled}
          @change=${(e: Event) => {
            const value = (e.target as HTMLSelectElement).value;
            onPatch(row.key, { reasoningLevel: value || null });
          }}
        >
          ${REASONING_LEVELS.map(
            (level) => html`<option value=${level}>${level || "inherit"}</option>`,
          )}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${disabled}
          @click=${() => onArchive(row.key)}
          title="Archive this session"
        >
          ${archiveIcon()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${disabled} @click=${() => onDelete(row.key)}>
          Delete
        </button>
      </div>
    </div>
  `;
}

function renderArchivedRow(
  entry: ArchivedSessionEntry,
  onUnarchive: SessionsProps["onUnarchive"],
  disabled: boolean,
) {
  const archivedAgo = formatAgo(Date.parse(entry.archivedAt));
  return html`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${entry.sessionKey}</div>
      <div>${archivedAgo}</div>
      <div>${formatArchiveReason(entry.reason)}</div>
      <div class="mono" style="font-size: 11px; opacity: 0.6;">
        ${entry.linkedTaskId ? entry.linkedTaskId.slice(0, 8) : "--"}
      </div>
      <div>
        <button
          class="btn btn-icon"
          ?disabled=${disabled}
          @click=${() => onUnarchive(entry.sessionKey)}
          title="Restore this session"
        >
          ${restoreIcon()}
        </button>
      </div>
    </div>
  `;
}
