import { html, nothing } from "lit";
import type { SkillMessageMap } from "../controllers/skills";
import { clampText } from "../format";
import type { SkillStatusEntry, SkillStatusReport } from "../types";

export type SkillsSubTab = "godmode" | "my-skills";

// ── GodMode skill types (from godmode.skills.list RPC) ──

export type GodModeSkillCard = {
  slug: string;
  name: string;
  type: "card";
  triggers: string[];
  tools: string[];
  body: string;
};

export type GodModeExecSkill = {
  slug: string;
  name: string;
  type: "skill";
  trigger: string;
  schedule: string | null;
  persona: string | null;
  taskType: string;
  priority: string;
  body: string;
};

export type GodModeSkillsData = {
  cards: GodModeSkillCard[];
  skills: GodModeExecSkill[];
  total: number;
};

export type SkillsProps = {
  loading: boolean;
  report: SkillStatusReport | null;
  error: string | null;
  filter: string;
  edits: Record<string, string>;
  busyKey: string | null;
  messages: SkillMessageMap;
  subTab: SkillsSubTab;
  godmodeSkills: GodModeSkillsData | null;
  godmodeSkillsLoading: boolean;
  expandedSkills: Set<string>;
  onFilterChange: (next: string) => void;
  onRefresh: () => void;
  onToggle: (skillKey: string, enabled: boolean) => void;
  onEdit: (skillKey: string, value: string) => void;
  onSaveKey: (skillKey: string) => void;
  onInstall: (skillKey: string, name: string, installId: string) => void;
  onSubTabChange: (tab: SkillsSubTab) => void;
  onToggleExpand: (slug: string) => void;
};

export function renderSkills(props: SkillsProps) {
  const isGodMode = props.subTab === "godmode";
  const showRefresh = isGodMode || props.subTab === "my-skills";

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="chip-row" style="gap: 0;">
          <button
            class="chip ${isGodMode ? "chip-ok" : ""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${isGodMode ? "--chip-ok-bg, #e6f4ea" : "--chip-bg, #f3f3f3"});"
            @click=${() => props.onSubTabChange("godmode")}
          >
            GodMode Skills
          </button>
          <button
            class="chip ${props.subTab === "my-skills" ? "chip-ok" : ""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${props.subTab === "my-skills" ? "--chip-ok-bg, #e6f4ea" : "--chip-bg, #f3f3f3"});"
            @click=${() => props.onSubTabChange("my-skills")}
          >
            Integrations
          </button>
        </div>
        ${showRefresh
          ? html`<button class="btn" ?disabled=${props.loading || props.godmodeSkillsLoading} @click=${props.onRefresh}>
              ${props.loading || props.godmodeSkillsLoading ? "Loading\u2026" : "Refresh"}
            </button>`
          : nothing}
      </div>

      ${isGodMode ? renderGodModeSkills(props) : nothing}
      ${props.subTab === "my-skills" ? renderMySkills(props) : nothing}
    </section>
  `;
}

// ── GodMode Skills Tab ──────────────────────────────────────────

function renderGodModeSkills(props: SkillsProps) {
  const data = props.godmodeSkills;
  const loading = props.godmodeSkillsLoading;
  const filter = props.filter.trim().toLowerCase();

  if (loading && !data) {
    return html`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;
  }

  if (!data || data.total === 0) {
    return html`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;
  }

  const allItems = [
    ...data.skills.map((s) => ({ ...s, _kind: "skill" as const })),
    ...data.cards.map((c) => ({ ...c, _kind: "card" as const })),
  ];

  const filtered = filter
    ? allItems.filter((item) =>
        [item.slug, item.name, item.body.slice(0, 200)].join(" ").toLowerCase().includes(filter),
      )
    : allItems;

  return html`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${props.filter}
          @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
          placeholder="Search skills and cards"
        />
      </label>
      <div class="muted">${filtered.length} of ${allItems.length}</div>
    </div>

    ${filtered.length === 0
      ? html`<div class="muted" style="margin-top: 16px;">No matches.</div>`
      : html`<div class="list" style="margin-top: 16px;">
          ${filtered.map((item) =>
            item._kind === "skill"
              ? renderExecSkill(item, props.expandedSkills.has(item.slug), props.onToggleExpand)
              : renderSkillCard(item, props.expandedSkills.has(item.slug), props.onToggleExpand),
          )}
        </div>`}
  `;
}

function renderExecSkill(
  skill: GodModeExecSkill & { _kind: "skill" },
  expanded: boolean,
  onToggle: (slug: string) => void,
) {
  const firstLine = skill.body.split("\n").find((l) => l.trim().length > 0) ?? "";
  const hasSchedule = !!skill.schedule;

  return html`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${() => onToggle(skill.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${expanded ? "90deg" : "0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${skill.name}</div>
          ${hasSchedule
            ? html`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`
            : html`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${clampText(firstLine, 120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${skill.trigger}</span>
          ${skill.schedule ? html`<span class="chip">${skill.schedule}</span>` : nothing}
          ${skill.persona ? html`<span class="chip">${skill.persona}</span>` : nothing}
          <span class="chip">${skill.taskType}</span>
        </div>
        ${expanded
          ? html`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Trigger:</span>
                  <span>${skill.trigger}</span>
                  <span class="muted">Task type:</span>
                  <span>${skill.taskType}</span>
                  <span class="muted">Priority:</span>
                  <span>${skill.priority}</span>
                  ${skill.persona
                    ? html`
                        <span class="muted">Persona:</span>
                        <span>${skill.persona}</span>
                      `
                    : nothing}
                  ${skill.schedule
                    ? html`
                        <span class="muted">Schedule:</span>
                        <span>${skill.schedule}</span>
                      `
                    : nothing}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${skill.body}
                </div>
              </div>
            `
          : nothing}
      </div>
    </div>
  `;
}

function renderSkillCard(
  card: GodModeSkillCard & { _kind: "card" },
  expanded: boolean,
  onToggle: (slug: string) => void,
) {
  return html`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${() => onToggle(card.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${expanded ? "90deg" : "0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${card.name}</div>
          <span class="chip" style="font-size: 11px;">passive</span>
        </div>
        <div class="list-sub" style="margin-left: 18px;">
          Triggers: ${card.triggers.join(", ")}
        </div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip">card</span>
          ${card.tools.length > 0
            ? html`<span class="chip">${card.tools.length} tools</span>`
            : nothing}
        </div>
        ${expanded
          ? html`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Keywords:</span>
                  <span>${card.triggers.join(", ")}</span>
                  ${card.tools.length > 0
                    ? html`
                        <span class="muted">Tools:</span>
                        <span>${card.tools.join(", ")}</span>
                      `
                    : nothing}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${card.body}
                </div>
              </div>
            `
          : nothing}
      </div>
    </div>
  `;
}

// ── OpenClaw Integrations Tab (existing) ────────────────────────

function renderMySkills(props: SkillsProps) {
  const skills = props.report?.skills ?? [];
  const filter = props.filter.trim().toLowerCase();
  const filtered = filter
    ? skills.filter((skill) =>
        [skill.name, skill.description, skill.source].join(" ").toLowerCase().includes(filter),
      )
    : skills;

  return html`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${props.filter}
          @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
          placeholder="Search integrations"
        />
      </label>
      <div class="muted">${filtered.length} shown</div>
    </div>

    ${
      props.error
        ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
        : nothing
    }

    ${
      filtered.length === 0
        ? html`<div class="muted" style="margin-top: 16px">No integrations found.</div>`
        : html`<div class="list" style="margin-top: 16px;">
            ${filtered.map((skill) => renderSkill(skill, props))}
          </div>`
    }
  `;
}

function renderSkill(skill: SkillStatusEntry, props: SkillsProps) {
  const busy = props.busyKey === skill.skillKey;
  const apiKey = props.edits[skill.skillKey] ?? "";
  const message = props.messages[skill.skillKey] ?? null;
  const canInstall = skill.install.length > 0 && skill.missing.bins.length > 0;
  const missing = [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
  const reasons: string[] = [];
  if (skill.disabled) {
    reasons.push("disabled");
  }
  if (skill.blockedByAllowlist) {
    reasons.push("blocked by allowlist");
  }
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${skill.emoji ? `${skill.emoji} ` : ""}${skill.name}
        </div>
        <div class="list-sub">${clampText(skill.description, 140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${skill.source}</span>
          <span class="chip ${skill.eligible ? "chip-ok" : "chip-warn"}">
            ${skill.eligible ? "eligible" : "blocked"}
          </span>
          ${
            skill.disabled
              ? html`
                  <span class="chip chip-warn">disabled</span>
                `
              : nothing
          }
        </div>
        ${
          missing.length > 0
            ? html`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${missing.join(", ")}
              </div>
            `
            : nothing
        }
        ${
          reasons.length > 0
            ? html`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${reasons.join(", ")}
              </div>
            `
            : nothing
        }
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${busy}
            @click=${() => props.onToggle(skill.skillKey, skill.disabled)}
          >
            ${skill.disabled ? "Enable" : "Disable"}
          </button>
          ${
            canInstall
              ? html`<button
                class="btn"
                ?disabled=${busy}
                @click=${() => props.onInstall(skill.skillKey, skill.name, skill.install[0].id)}
              >
                ${busy ? "Installing\u2026" : skill.install[0].label}
              </button>`
              : nothing
          }
        </div>
        ${
          message
            ? html`<div
              class="muted"
              style="margin-top: 8px; color: ${
                message.kind === "error"
                  ? "var(--danger-color, #d14343)"
                  : "var(--success-color, #0a7f5a)"
              };"
            >
              ${message.message}
            </div>`
            : nothing
        }
        ${
          skill.primaryEnv
            ? html`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${apiKey}
                  @input=${(e: Event) =>
                    props.onEdit(skill.skillKey, (e.target as HTMLInputElement).value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${busy}
                @click=${() => props.onSaveKey(skill.skillKey)}
              >
                Save key
              </button>
            `
            : nothing
        }
      </div>
    </div>
  `;
}
