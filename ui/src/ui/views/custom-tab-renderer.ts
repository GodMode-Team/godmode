/**
 * custom-tab-renderer.ts — Generic renderer for custom tab manifests.
 *
 * Takes a CustomTabManifest + fetched data and renders based on layout.type.
 * Uses {{dataSourceId.fieldPath}} template binding for dynamic values.
 */

import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// ── Types (mirrored from backend — keep in sync) ────────────────────

export interface CustomTabDataSource {
  id: string;
  type: "rpc" | "static";
  method?: string;
  params?: Record<string, unknown>;
  data?: unknown;
}

export interface CustomTabLayout {
  type: "cards" | "table" | "list" | "stat-grid" | "markdown" | "iframe";
  columns?: number;
  items?: unknown;
  itemTemplate?: Record<string, unknown>;
}

export interface CustomTabManifest {
  slug: string;
  title: string;
  icon?: string;
  subtitle?: string;
  group?: "main" | "settings";
  layout: CustomTabLayout;
  dataSources: CustomTabDataSource[];
  refresh?: number;
  version: number;
}

export interface CustomTabRenderState {
  manifest: CustomTabManifest;
  data: Record<string, unknown>;
  loading: boolean;
  errors: Record<string, string>;
}

// ── Template Engine ──────────────────────────────────────────────────

/**
 * Resolve a dot-path like "stripe.charges.total" against a data context.
 */
function resolvePath(context: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = context;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Resolve template bindings in a string: {{dataSourceId.field.path}}
 * Returns the resolved string, or the raw value if the entire string is one binding.
 */
function resolveTemplate(template: unknown, context: Record<string, unknown>): unknown {
  if (typeof template !== "string") return template;

  // If the entire string is a single binding, return the raw value (preserves arrays/objects)
  const singleMatch = /^\{\{([^}]+)\}\}$/.exec(template);
  if (singleMatch) {
    return resolvePath(context, singleMatch[1].trim());
  }

  // Otherwise, do string interpolation
  return template.replace(/\{\{([^}]+)\}\}/g, (_match, path: string) => {
    const value = resolvePath(context, path.trim());
    if (value == null) return "";
    return String(value);
  });
}

/**
 * Resolve all template bindings in an object recursively.
 */
function resolveTemplateObject(
  obj: Record<string, unknown>,
  context: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = resolveTemplate(value, context);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = resolveTemplateObject(value as Record<string, unknown>, context);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ── Format Helpers ───────────────────────────────────────────────────

function formatValue(value: unknown, format?: string): string {
  if (value == null) return "—";
  if (format === "currency") {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (format === "number") {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return num.toLocaleString();
  }
  if (format === "percent") {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return `${(num * 100).toFixed(1)}%`;
  }
  return String(value);
}

// ── Layout Renderers ─────────────────────────────────────────────────

function renderCards(layout: CustomTabLayout, context: Record<string, unknown>): TemplateResult {
  const columns = layout.columns ?? 3;
  const rawItems = resolveTemplate(layout.items, context);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const template = layout.itemTemplate;

  if (items.length === 0) {
    return html`<div class="custom-tab__empty">No data to display.</div>`;
  }

  return html`
    <div class="custom-tab__cards" style="grid-template-columns: repeat(${columns}, 1fr);">
      ${items.map((item: unknown) => {
        const itemCtx = { ...context, item: item as Record<string, unknown> };
        const resolved = template ? resolveTemplateObject(template, itemCtx) : (item as Record<string, unknown>);
        return html`
          <div class="custom-tab__card">
            ${resolved.title ? html`<div class="custom-tab__card-title">${resolved.title}</div>` : nothing}
            ${resolved.subtitle ? html`<div class="custom-tab__card-subtitle">${resolved.subtitle}</div>` : nothing}
            ${resolved.badge ? html`<span class="custom-tab__card-badge">${resolved.badge}</span>` : nothing}
            ${resolved.value != null ? html`<div class="custom-tab__card-value">${resolved.value}</div>` : nothing}
          </div>
        `;
      })}
    </div>
  `;
}

function renderTable(layout: CustomTabLayout, context: Record<string, unknown>): TemplateResult {
  const rawItems = resolveTemplate(layout.items, context);
  const items = Array.isArray(rawItems) ? rawItems : [];

  if (items.length === 0) {
    return html`<div class="custom-tab__empty">No data to display.</div>`;
  }

  // Derive columns from first item's keys
  const firstItem = items[0] as Record<string, unknown>;
  const columns = Object.keys(firstItem);

  return html`
    <div class="custom-tab__table-wrapper">
      <table class="custom-tab__table">
        <thead>
          <tr>
            ${columns.map((col) => html`<th>${col}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${items.map((item: unknown) => {
            const row = item as Record<string, unknown>;
            return html`
              <tr>
                ${columns.map((col) => html`<td>${row[col] != null ? String(row[col]) : ""}</td>`)}
              </tr>
            `;
          })}
        </tbody>
      </table>
    </div>
  `;
}

function renderList(layout: CustomTabLayout, context: Record<string, unknown>): TemplateResult {
  const rawItems = resolveTemplate(layout.items, context);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const template = layout.itemTemplate;

  if (items.length === 0) {
    return html`<div class="custom-tab__empty">No data to display.</div>`;
  }

  return html`
    <div class="custom-tab__list">
      ${items.map((item: unknown) => {
        const itemCtx = { ...context, item: item as Record<string, unknown> };
        const resolved = template ? resolveTemplateObject(template, itemCtx) : (item as Record<string, unknown>);
        return html`
          <div class="custom-tab__list-item">
            ${resolved.title ? html`<div class="custom-tab__list-title">${resolved.title}</div>` : nothing}
            ${resolved.subtitle ? html`<div class="custom-tab__list-subtitle">${resolved.subtitle}</div>` : nothing}
          </div>
        `;
      })}
    </div>
  `;
}

function renderStatGrid(layout: CustomTabLayout, context: Record<string, unknown>): TemplateResult {
  const columns = layout.columns ?? 3;
  const rawItems = layout.items;
  // stat-grid items are typically defined inline in the manifest
  const items = Array.isArray(rawItems) ? rawItems : [];

  if (items.length === 0) {
    return html`<div class="custom-tab__empty">No stats to display.</div>`;
  }

  return html`
    <div class="custom-tab__stat-grid" style="grid-template-columns: repeat(${columns}, 1fr);">
      ${items.map((item: unknown) => {
        const stat = item as Record<string, unknown>;
        const label = resolveTemplate(stat.label, context);
        const value = resolveTemplate(stat.value, context);
        const format = typeof stat.format === "string" ? stat.format : undefined;
        return html`
          <div class="custom-tab__stat">
            <div class="custom-tab__stat-value">${formatValue(value, format)}</div>
            <div class="custom-tab__stat-label">${label ?? ""}</div>
          </div>
        `;
      })}
    </div>
  `;
}

function renderMarkdown(layout: CustomTabLayout, context: Record<string, unknown>): TemplateResult {
  const rawContent = resolveTemplate(layout.items, context);
  const content = typeof rawContent === "string" ? rawContent : "";

  if (!content) {
    return html`<div class="custom-tab__empty">No content to display.</div>`;
  }

  // Basic markdown-like rendering (no dependency on marked here — keep it simple)
  // Convert newlines to <br>, backticks to <code>
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");

  return html`
    <div class="custom-tab__markdown">
      ${unsafeHTML(escaped)}
    </div>
  `;
}

function renderIframe(): TemplateResult {
  return html`
    <div class="custom-tab__empty">
      <p>Iframe layout support coming soon.</p>
      <p style="opacity: 0.6; font-size: 13px;">Sandboxed iframe rendering will be available in a future update.</p>
    </div>
  `;
}

// ── Error Banner ─────────────────────────────────────────────────────

function renderErrors(errors: Record<string, string>): TemplateResult {
  const entries = Object.entries(errors);
  if (entries.length === 0) return html``;

  return html`
    <div class="custom-tab__errors">
      ${entries.map(
        ([sourceId, message]) => html`
          <div class="custom-tab__error">
            Failed to load <strong>${sourceId}</strong>: ${message}
          </div>
        `,
      )}
    </div>
  `;
}

// ── Main Render Function ─────────────────────────────────────────────

export function renderCustomTab(state: CustomTabRenderState): TemplateResult {
  const { manifest, data, loading, errors } = state;

  if (loading) {
    return html`
      <div class="tab-view custom-tab">
        <header class="tab-header">
          <h2>${manifest.title}</h2>
          ${manifest.subtitle ? html`<p class="tab-subtitle">${manifest.subtitle}</p>` : nothing}
        </header>
        <div class="custom-tab__loading">Loading data...</div>
      </div>
    `;
  }

  // Build context from all data sources
  const context: Record<string, unknown> = { ...data };

  let layoutContent: TemplateResult;
  switch (manifest.layout.type) {
    case "cards":
      layoutContent = renderCards(manifest.layout, context);
      break;
    case "table":
      layoutContent = renderTable(manifest.layout, context);
      break;
    case "list":
      layoutContent = renderList(manifest.layout, context);
      break;
    case "stat-grid":
      layoutContent = renderStatGrid(manifest.layout, context);
      break;
    case "markdown":
      layoutContent = renderMarkdown(manifest.layout, context);
      break;
    case "iframe":
      layoutContent = renderIframe();
      break;
    default:
      layoutContent = html`
        <div class="custom-tab__empty">
          Unsupported layout type: "${manifest.layout.type}". This tab may require a newer version of GodMode.
        </div>
      `;
  }

  return html`
    <div class="tab-view custom-tab">
      <header class="tab-header">
        <h2>${manifest.title}</h2>
        ${manifest.subtitle ? html`<p class="tab-subtitle">${manifest.subtitle}</p>` : nothing}
      </header>
      ${renderErrors(errors)}
      ${layoutContent}
    </div>
  `;
}
