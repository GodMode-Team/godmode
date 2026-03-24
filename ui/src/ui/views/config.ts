import { html, nothing } from "lit";
import type { ConfigUiHints } from "../types";
import { analyzeConfigSchema, renderConfigForm, SECTION_META } from "./config-form";
import { hintForPath, humanize, schemaType, type JsonSchema } from "./config-form.shared";
import { renderUserSettings } from "./config-user";

export type ConfigProps = {
  raw: string;
  originalRaw: string;
  valid: boolean | null;
  issues: unknown[];
  loading: boolean;
  saving: boolean;
  applying: boolean;
  updating: boolean;
  connected: boolean;
  schema: unknown;
  schemaLoading: boolean;
  uiHints: ConfigUiHints;
  formMode: "form" | "raw";
  formValue: Record<string, unknown> | null;
  originalValue: Record<string, unknown> | null;
  searchQuery: string;
  activeSection: string | null;
  activeSubsection: string | null;
  onRawChange: (next: string) => void;
  onFormModeChange: (mode: "form" | "raw") => void;
  onFormPatch: (path: Array<string | number>, value: unknown) => void;
  onSearchChange: (query: string) => void;
  onSectionChange: (section: string | null) => void;
  onSubsectionChange: (section: string | null) => void;
  onReload: () => void;
  onSave: () => void;
  onApply: () => void;
  onUpdate: () => void;
  // User profile settings (UI-only, stored in localStorage)
  userName: string;
  userAvatar: string | null;
  onUserProfileUpdate: (name: string, avatar: string) => void;
  // Model switcher
  onModelSwitch?: (primary: string, fallbacks: string[]) => void;
  // Secrets
  secrets: string[];
  secretsLoading: boolean;
  onSecretsRefresh: () => void;
  // Web Fetch provider
  webFetchProvider: string;
  webFetchLoading: boolean;
  onWebFetchChange: (provider: string) => void;
  // Search providers
  searchProvider: string;
  searchExaConfigured: boolean;
  searchTavilyConfigured: boolean;
  searchLoading: boolean;
  onSearchProviderChange: (provider: string) => void;
};

// SVG Icons for sidebar (Lucide-style)
const sidebarIcons = {
  all: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,
  env: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,
  update: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,
  agents: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,
  auth: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,
  channels: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,
  messages: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,
  commands: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,
  hooks: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,
  skills: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,
  tools: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,
  gateway: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,
  wizard: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,
  // Additional sections
  meta: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,
  logging: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,
  browser: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,
  ui: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,
  models: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,
  bindings: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,
  broadcast: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,
  audio: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,
  session: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
  cron: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,
  web: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,
  discovery: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,
  canvasHost: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,
  talk: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,
  plugins: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,
  user: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,
  default: html`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `,
};

// Section definitions
const SECTIONS: Array<{ key: string; label: string }> = [
  { key: "model", label: "AI Model" },
  { key: "env", label: "Environment" },
  { key: "update", label: "Updates" },
  { key: "agents", label: "Agents" },
  { key: "auth", label: "Authentication" },
  { key: "channels", label: "Channels" },
  { key: "messages", label: "Messages" },
  { key: "commands", label: "Commands" },
  { key: "hooks", label: "Hooks" },
  { key: "skills", label: "Skills" },
  { key: "tools", label: "Tools" },
  { key: "gateway", label: "Gateway" },
  { key: "wizard", label: "Setup Wizard" },
  { key: "secrets", label: "Secrets" },
  { key: "webfetch", label: "Web Fetch" },
  { key: "search", label: "Search" },
  { key: "user", label: "User" },
];

// Sections that always appear (not schema-dependent)
const FIXED_SECTIONS = new Set(["user", "model", "secrets", "webfetch", "search"]);

type SubsectionEntry = {
  key: string;
  label: string;
  description?: string;
  order: number;
};

const ALL_SUBSECTION = "__all__";

function getSectionIcon(key: string) {
  return sidebarIcons[key as keyof typeof sidebarIcons] ?? sidebarIcons.default;
}

function resolveSectionMeta(
  key: string,
  schema?: JsonSchema,
): {
  label: string;
  description?: string;
} {
  const meta = SECTION_META[key];
  if (meta) {
    return meta;
  }
  return {
    label: schema?.title ?? humanize(key),
    description: schema?.description ?? "",
  };
}

function resolveSubsections(params: {
  key: string;
  schema: JsonSchema | undefined;
  uiHints: ConfigUiHints;
}): SubsectionEntry[] {
  const { key, schema, uiHints } = params;
  if (!schema || schemaType(schema) !== "object" || !schema.properties) {
    return [];
  }
  const entries = Object.entries(schema.properties).map(([subKey, node]) => {
    const hint = hintForPath([key, subKey], uiHints);
    const label = hint?.label ?? node.title ?? humanize(subKey);
    const description = hint?.help ?? node.description ?? "";
    const order = hint?.order ?? 50;
    return { key: subKey, label, description, order };
  });
  entries.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.key.localeCompare(b.key)));
  return entries;
}

function computeDiff(
  original: Record<string, unknown> | null,
  current: Record<string, unknown> | null,
): Array<{ path: string; from: unknown; to: unknown }> {
  if (!original || !current) {
    return [];
  }
  const changes: Array<{ path: string; from: unknown; to: unknown }> = [];

  function compare(orig: unknown, curr: unknown, path: string) {
    if (orig === curr) {
      return;
    }
    if (typeof orig !== typeof curr) {
      changes.push({ path, from: orig, to: curr });
      return;
    }
    if (typeof orig !== "object" || orig === null || curr === null) {
      if (orig !== curr) {
        changes.push({ path, from: orig, to: curr });
      }
      return;
    }
    if (Array.isArray(orig) && Array.isArray(curr)) {
      if (JSON.stringify(orig) !== JSON.stringify(curr)) {
        changes.push({ path, from: orig, to: curr });
      }
      return;
    }
    const origObj = orig as Record<string, unknown>;
    const currObj = curr as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(origObj), ...Object.keys(currObj)]);
    for (const key of allKeys) {
      compare(origObj[key], currObj[key], path ? `${path}.${key}` : key);
    }
  }

  compare(original, current, "");
  return changes;
}

function truncateValue(value: unknown, maxLen = 40): string {
  let str: string;
  try {
    const json = JSON.stringify(value);
    str = json ?? String(value);
  } catch {
    str = String(value);
  }
  if (str.length <= maxLen) {
    return str;
  }
  return str.slice(0, maxLen - 3) + "...";
}

// ── Model Picker ──────────────────────────────────────────────────────

type ModelOption = {
  id: string;
  name: string;
  provider: string;
  providerLabel: string;
  reasoning: boolean;
  contextWindow: number;
};

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: "#d97706",
  openai: "#10b981",
  "openai-codex": "#10b981",
  xai: "#6366f1",
};

function buildModelOptions(formValue: Record<string, unknown>): ModelOption[] {
  const available: ModelOption[] = [];
  const models = formValue.models as Record<string, unknown> | undefined;
  const agents = formValue.agents as Record<string, unknown> | undefined;

  // From models.providers
  const providers = (models as any)?.providers;
  if (providers && typeof providers === "object") {
    for (const [provKey, prov] of Object.entries(providers)) {
      const provObj = prov as Record<string, unknown>;
      for (const m of (provObj.models as any[]) ?? []) {
        available.push({
          id: `${provKey}/${m.id}`,
          name: m.name ?? m.id,
          provider: provKey,
          providerLabel: provKey.charAt(0).toUpperCase() + provKey.slice(1),
          reasoning: m.reasoning ?? false,
          contextWindow: m.contextWindow ?? 0,
        });
      }
    }
  }

  // From agents.defaults.models (entries not already in providers)
  const defaults = (agents as any)?.defaults?.models;
  if (defaults && typeof defaults === "object") {
    for (const modelId of Object.keys(defaults)) {
      if (available.some((m) => m.id === modelId)) continue;
      const parts = modelId.split("/");
      available.push({
        id: modelId,
        name: parts.slice(1).join("/"),
        provider: parts[0] ?? "unknown",
        providerLabel: (parts[0] ?? "unknown")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        reasoning: false,
        contextWindow: 0,
      });
    }
  }

  return available;
}

function getDefaultFallback(primary: string): string[] {
  if (primary.startsWith("anthropic/")) return ["openai-codex/gpt-5.3-codex"];
  return ["anthropic/claude-sonnet-4-6"];
}

function renderModelPicker(props: ConfigProps) {
  const formValue = props.formValue;
  if (!formValue) {
    return html`<div class="config-loading"><span>Loading config...</span></div>`;
  }

  const agents = formValue.agents as any;
  const currentPrimary: string = agents?.defaults?.model?.primary ?? "";
  const currentFallbacks: string[] = agents?.defaults?.model?.fallbacks ?? [];
  const available = buildModelOptions(formValue);

  // Group by provider
  const byProvider = new Map<string, ModelOption[]>();
  for (const m of available) {
    const list = byProvider.get(m.provider) ?? [];
    list.push(m);
    byProvider.set(m.provider, list);
  }

  const isSwitching = props.saving || props.applying;

  return html`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${currentPrimary || "Not set"}</div>
        ${currentFallbacks.length > 0
          ? html`<div class="model-picker__fallback">Fallback: ${currentFallbacks.join(", ")}</div>`
          : nothing}
      </div>

      ${isSwitching ? html`<div class="model-picker__status">Switching model...</div>` : nothing}

      ${Array.from(byProvider.entries()).map(
        ([provKey, models]) => html`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${PROVIDER_COLORS[provKey] ?? "var(--accent)"}"></span>
              ${models[0]?.providerLabel ?? provKey}
            </div>
            <div class="model-picker__cards">
              ${models.map((model) => {
                const isActive = model.id === currentPrimary;
                const color = PROVIDER_COLORS[model.provider] ?? "var(--accent)";
                return html`
                  <button
                    class="model-card ${isActive ? "model-card--active" : ""}"
                    style="--model-accent: ${color}"
                    ?disabled=${isSwitching}
                    @click=${() => {
                      if (isActive || !props.onModelSwitch) return;
                      props.onModelSwitch(model.id, getDefaultFallback(model.id));
                    }}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${model.name || model.id}</div>
                      ${model.reasoning ? html`<span class="model-card__tag">reasoning</span>` : nothing}
                      ${model.contextWindow > 0
                        ? html`<span class="model-card__ctx">${Math.round(model.contextWindow / 1000)}k ctx</span>`
                        : nothing}
                    </div>
                    ${isActive ? html`<span class="model-card__check">Active</span>` : nothing}
                  </button>
                `;
              })}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}

// ── Secrets Section ──────────────────────────────────────────────────

function renderSecrets(props: ConfigProps) {
  return html`
    <div class="config-secrets">
      <div class="config-secrets__header">
        <h3 class="config-secrets__title">Stored Secrets</h3>
        <button class="btn btn--sm" ?disabled=${props.secretsLoading} @click=${props.onSecretsRefresh}>
          ${props.secretsLoading ? "Loading..." : "Refresh"}
        </button>
      </div>
      <p class="config-secrets__hint muted">
        Encrypted secrets stored in the OpenClaw state directory. Manage via <code>/secrets set KEY</code> in chat.
      </p>
      ${props.secrets.length === 0 && !props.secretsLoading
        ? html`<div class="config-secrets__empty muted">No secrets stored yet.</div>`
        : html`
          <div class="config-secrets__list">
            ${props.secrets.map(
              (key) => html`
                <div class="config-secrets__item">
                  <span class="config-secrets__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <span class="config-secrets__key">${key}</span>
                  <span class="config-secrets__badge">encrypted</span>
                </div>
              `,
            )}
          </div>
        `
      }
    </div>
  `;
}

// ── Web Fetch Provider Section ──────────────────────────────────────

function renderWebFetch(props: ConfigProps) {
  return html`
    <div class="config-webfetch">
      <h3 class="config-webfetch__title">Web Fetch Provider</h3>
      <p class="config-webfetch__hint muted">
        Controls how web pages are fetched. Firecrawl renders JavaScript for dynamic sites.
      </p>
      <div class="config-webfetch__select">
        <select
          class="config-select"
          .value=${props.webFetchProvider}
          ?disabled=${props.webFetchLoading}
          @change=${(e: Event) => props.onWebFetchChange((e.target as HTMLSelectElement).value)}
        >
          <option value="default" ?selected=${props.webFetchProvider === "default"}>Default (curl)</option>
          <option value="firecrawl" ?selected=${props.webFetchProvider === "firecrawl"}>Firecrawl (JS rendering)</option>
        </select>
      </div>
    </div>
  `;
}

// ── Search Provider Section ─────────────────────────────────────────

function renderSearchProviders(props: ConfigProps) {
  return html`
    <div class="config-search-providers">
      <h3 class="config-search-providers__title">Search Providers</h3>
      <p class="config-search-providers__hint muted">
        Default provider for web search tools. Both Tavily and Exa require API keys.
      </p>
      <div class="config-search-providers__select">
        <label class="config-search-providers__label">Default Provider</label>
        <select
          class="config-select"
          .value=${props.searchProvider}
          ?disabled=${props.searchLoading}
          @change=${(e: Event) => props.onSearchProviderChange((e.target as HTMLSelectElement).value)}
        >
          <option value="tavily" ?selected=${props.searchProvider === "tavily"}>Tavily</option>
          <option value="exa" ?selected=${props.searchProvider === "exa"}>Exa</option>
        </select>
      </div>
      <div class="config-search-providers__status">
        <div class="config-search-providers__row">
          <span class="config-search-providers__dot ${props.searchTavilyConfigured ? "config-search-providers__dot--ok" : "config-search-providers__dot--missing"}"></span>
          <span>Tavily API Key</span>
          <span class="config-search-providers__state">${props.searchTavilyConfigured ? "Configured" : "Not set"}</span>
        </div>
        <div class="config-search-providers__row">
          <span class="config-search-providers__dot ${props.searchExaConfigured ? "config-search-providers__dot--ok" : "config-search-providers__dot--missing"}"></span>
          <span>Exa API Key</span>
          <span class="config-search-providers__state">${props.searchExaConfigured ? "Configured" : "Not set"}</span>
        </div>
      </div>
      <p class="config-search-providers__keyhint muted">
        Set API keys via <code>/secrets set EXA_API_KEY</code> or <code>/secrets set TAVILY_API_KEY</code>
      </p>
    </div>
  `;
}

export function renderConfig(props: ConfigProps) {
  const validity = props.valid == null ? "unknown" : props.valid ? "valid" : "invalid";
  const analysis = analyzeConfigSchema(props.schema);
  const formUnsafe = analysis.schema ? analysis.unsupportedPaths.length > 0 : false;

  // Get available sections from schema
  const schemaProps = analysis.schema?.properties ?? {};
  // Include schema-based sections (excluding fixed sections which we'll add separately)
  const availableSections = SECTIONS.filter(
    (s) => s.key in schemaProps && !FIXED_SECTIONS.has(s.key),
  );

  // Add any sections in schema but not in our list
  const knownKeys = new Set(SECTIONS.map((s) => s.key));
  const extraSections = Object.keys(schemaProps)
    .filter((k) => !knownKeys.has(k))
    .map((k) => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1) }));

  // Fixed sections always appear at the end (User profile, etc.)
  const fixedSectionsList = SECTIONS.filter((s) => FIXED_SECTIONS.has(s.key));

  const allSections = [...availableSections, ...extraSections, ...fixedSectionsList];

  const activeSectionSchema =
    props.activeSection && analysis.schema && schemaType(analysis.schema) === "object"
      ? analysis.schema.properties?.[props.activeSection]
      : undefined;
  const activeSectionMeta = props.activeSection
    ? resolveSectionMeta(props.activeSection, activeSectionSchema)
    : null;
  const subsections = props.activeSection
    ? resolveSubsections({
        key: props.activeSection,
        schema: activeSectionSchema,
        uiHints: props.uiHints,
      })
    : [];
  const allowSubnav =
    props.formMode === "form" && Boolean(props.activeSection) && subsections.length > 0;
  const isAllSubsection = props.activeSubsection === ALL_SUBSECTION;
  const effectiveSubsection = props.searchQuery
    ? null
    : isAllSubsection
      ? null
      : (props.activeSubsection ?? subsections[0]?.key ?? null);

  // Compute diff for showing changes (works for both form and raw modes)
  const diff = props.formMode === "form" ? computeDiff(props.originalValue, props.formValue) : [];
  const hasRawChanges = props.formMode === "raw" && props.raw !== props.originalRaw;
  const hasChanges = props.formMode === "form" ? diff.length > 0 : hasRawChanges;

  // Save/apply buttons require actual changes to be enabled.
  // Note: formUnsafe warns about unsupported schema paths but shouldn't block saving.
  const canSaveForm = Boolean(props.formValue) && !props.loading && Boolean(analysis.schema);
  const canSave =
    props.connected &&
    !props.saving &&
    hasChanges &&
    (props.formMode === "raw" ? true : canSaveForm);
  const canApply =
    props.connected &&
    !props.applying &&
    !props.updating &&
    hasChanges &&
    (props.formMode === "raw" ? true : canSaveForm);
  const canUpdate = props.connected && !props.applying && !props.updating;

  return html`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span class="pill pill--sm ${validity === "valid" ? "pill--ok" : validity === "invalid" ? "pill--danger" : ""}">${validity}</span>
        </div>

        <!-- Search -->
        <div class="config-search">
          <svg class="config-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="config-search__input"
            placeholder="Search settings..."
            .value=${props.searchQuery}
            @input=${(e: Event) => props.onSearchChange((e.target as HTMLInputElement).value)}
          />
          ${
            props.searchQuery
              ? html`
            <button
              class="config-search__clear"
              @click=${() => props.onSearchChange("")}
            >×</button>
          `
              : nothing
          }
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${props.activeSection === null ? "active" : ""}"
            @click=${() => props.onSectionChange(null)}
          >
            <span class="config-nav__icon">${sidebarIcons.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${allSections.map(
            (section) => html`
            <button
              class="config-nav__item ${props.activeSection === section.key ? "active" : ""}"
              @click=${() => props.onSectionChange(section.key)}
            >
              <span class="config-nav__icon">${getSectionIcon(section.key)}</span>
              <span class="config-nav__label">${section.label}</span>
            </button>
          `,
          )}
        </nav>

        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle">
            <button
              class="config-mode-toggle__btn ${props.formMode === "form" ? "active" : ""}"
              ?disabled=${props.schemaLoading || !props.schema}
              @click=${() => props.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${props.formMode === "raw" ? "active" : ""}"
              @click=${() => props.onFormModeChange("raw")}
            >
              Raw
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="config-main">
        <!-- Action bar -->
        <div class="config-actions">
          <div class="config-actions__left">
            ${
              hasChanges
                ? html`
              <span class="config-changes-badge">${props.formMode === "raw" ? "Unsaved changes" : `${diff.length} unsaved change${diff.length !== 1 ? "s" : ""}`}</span>
            `
                : html`
                    <span class="config-status muted">No changes</span>
                  `
            }
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${props.loading} @click=${props.onReload}>
              ${props.loading ? "Loading…" : "Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!canSave}
              @click=${props.onSave}
            >
              ${props.saving ? "Saving…" : "Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!canApply}
              @click=${props.onApply}
            >
              ${props.applying ? "Applying…" : "Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!canUpdate}
              @click=${props.onUpdate}
            >
              ${props.updating ? "Updating…" : "Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${
          hasChanges && props.formMode === "form"
            ? html`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${diff.length} pending change${diff.length !== 1 ? "s" : ""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${diff.map(
                (change) => html`
                <div class="config-diff__item">
                  <div class="config-diff__path">${change.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${truncateValue(change.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${truncateValue(change.to)}</span>
                  </div>
                </div>
              `,
              )}
            </div>
          </details>
        `
            : nothing
        }

        ${
          activeSectionMeta && props.formMode === "form"
            ? html`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${getSectionIcon(props.activeSection ?? "")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${activeSectionMeta.label}</div>
                  ${
                    activeSectionMeta.description
                      ? html`<div class="config-section-hero__desc">${activeSectionMeta.description}</div>`
                      : nothing
                  }
                </div>
              </div>
            `
            : nothing
        }

        ${
          allowSubnav
            ? html`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${effectiveSubsection === null ? "active" : ""}"
                  @click=${() => props.onSubsectionChange(ALL_SUBSECTION)}
                >
                  All
                </button>
                ${subsections.map(
                  (entry) => html`
                    <button
                      class="config-subnav__item ${
                        effectiveSubsection === entry.key ? "active" : ""
                      }"
                      title=${entry.description || entry.label}
                      @click=${() => props.onSubsectionChange(entry.key)}
                    >
                      ${entry.label}
                    </button>
                  `,
                )}
              </div>
            `
            : nothing
        }

        <!-- Form content -->
        <div class="config-content">
          ${
            props.activeSection === "model"
              ? renderModelPicker(props)
              : props.activeSection === "user"
              ? renderUserSettings({
                  userName: props.userName,
                  userAvatar: props.userAvatar,
                  onUpdate: props.onUserProfileUpdate,
                })
              : props.activeSection === "secrets"
              ? renderSecrets(props)
              : props.activeSection === "webfetch"
              ? renderWebFetch(props)
              : props.activeSection === "search"
              ? renderSearchProviders(props)
              : props.formMode === "form"
                ? html`
                  ${
                    props.schemaLoading
                      ? html`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `
                      : renderConfigForm({
                          schema: analysis.schema,
                          uiHints: props.uiHints,
                          value: props.formValue,
                          disabled: props.loading || !props.formValue,
                          unsupportedPaths: analysis.unsupportedPaths,
                          onPatch: props.onFormPatch,
                          searchQuery: props.searchQuery,
                          activeSection: props.activeSection,
                          activeSubsection: effectiveSubsection,
                        })
                  }
                  ${
                    formUnsafe
                      ? html`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `
                      : nothing
                  }
                `
                : html`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${props.raw}
                      @input=${(e: Event) =>
                        props.onRawChange((e.target as HTMLTextAreaElement).value)}
                    ></textarea>
                  </label>
                `
          }
        </div>

        ${
          props.issues.length > 0
            ? html`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(props.issues, null, 2)}</pre>
            </div>`
            : nothing
        }
      </main>
    </div>
  `;
}
