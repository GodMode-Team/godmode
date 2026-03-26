import { html, nothing } from "lit";
import { clampText } from "../format";

// ── Types ────────────────────────────────────────────────────────

export type RosterAgent = {
  slug: string;
  category: string;
  name: string;
  taskTypes: string[];
  engine?: string;
  mission?: string;
  body?: string;
};

export type AgentsProps = {
  loading: boolean;
  error: string | null;
  roster: RosterAgent[];
  filter: string;
  expandedAgents: Set<string>;
  onFilterChange: (next: string) => void;
  onRefresh: () => void;
  onToggleExpand: (slug: string) => void;
};

// ── Engine label + color ─────────────────────────────────────────

function engineChipClass(engine?: string): string {
  switch (engine) {
    case "claude":
      return "chip-ok";
    case "codex":
      return "chip-warn";
    case "gemini":
      return "chip-info";
    default:
      return "";
  }
}

// ── Render ────────────────────────────────────────────────────────

export function renderAgents(props: AgentsProps) {
  const filter = props.filter.trim().toLowerCase();
  const filtered = filter
    ? props.roster.filter((a) =>
        [a.slug, a.name, a.category, a.mission ?? "", ...a.taskTypes]
          .join(" ")
          .toLowerCase()
          .includes(filter),
      )
    : props.roster;

  // Group by category
  const groups = new Map<string, RosterAgent[]>();
  for (const agent of filtered) {
    const cat = agent.category || "_default";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(agent);
  }

  // Sort categories alphabetically, _default last
  const sortedCategories = [...groups.keys()].sort((a, b) => {
    if (a === "_default") return 1;
    if (b === "_default") return -1;
    return a.localeCompare(b);
  });

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="muted">${filtered.length} agent${filtered.length !== 1 ? "s" : ""}</div>
        <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
          ${props.loading ? "Loading\u2026" : "Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${props.filter}
            @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
            placeholder="Search agents by name, category, or task type"
          />
        </label>
      </div>

      ${props.error
        ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
        : nothing}

      ${props.loading && props.roster.length === 0
        ? html`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`
        : nothing}

      ${!props.loading && filtered.length === 0
        ? html`<div class="muted" style="margin-top: 16px;">
            ${props.roster.length === 0
              ? "No agents found. Add persona files to your agent-roster directory."
              : "No matches."}
          </div>`
        : nothing}

      ${sortedCategories.map((cat) => {
        const agents = groups.get(cat)!;
        const label = cat === "_default" ? "General" : formatCategory(cat);
        return html`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${label}
            </div>
            <div class="list">
              ${agents.map((agent) =>
                renderAgentCard(agent, props.expandedAgents.has(agent.slug), props.onToggleExpand),
              )}
            </div>
          </div>
        `;
      })}
    </section>
  `;
}

function formatCategory(cat: string): string {
  return cat
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderAgentCard(
  agent: RosterAgent,
  expanded: boolean,
  onToggle: (slug: string) => void,
) {
  return html`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${() => onToggle(agent.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${expanded ? "90deg" : "0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${agent.name}</div>
          ${agent.engine
            ? html`<span class="chip ${engineChipClass(agent.engine)}" style="font-size: 11px;">${agent.engine}</span>`
            : nothing}
        </div>
        ${agent.mission
          ? html`<div class="list-sub" style="margin-left: 18px;">${clampText(agent.mission, 120)}</div>`
          : nothing}
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          ${agent.taskTypes.map(
            (t) => html`<span class="chip">${t}</span>`,
          )}
        </div>
        ${expanded
          ? html`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px;">
                  <span class="muted">Slug:</span>
                  <span style="font-family: monospace;">${agent.slug}</span>
                  <span class="muted">Category:</span>
                  <span>${formatCategory(agent.category || "_default")}</span>
                  ${agent.engine
                    ? html`
                        <span class="muted">Engine:</span>
                        <span>${agent.engine}</span>
                      `
                    : nothing}
                  <span class="muted">Task types:</span>
                  <span>${agent.taskTypes.join(", ") || "auto"}</span>
                </div>
                ${agent.body
                  ? html`
                      <div
                        style="font-size: 13px; line-height: 1.6;
                               white-space: pre-wrap; color: var(--text-color, #333);
                               max-height: 400px; overflow-y: auto;
                               padding-top: 10px; border-top: 1px solid var(--border-color, #eee);"
                      >
                        ${agent.body}
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    </div>
  `;
}
