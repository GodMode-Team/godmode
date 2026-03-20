/**
 * Resource Strip — Horizontal scrollable strip of artifacts below/above chat input.
 *
 * Features:
 * - Horizontal scroll with fade edges
 * - Thumbnail previews for images
 * - File type icons for other types
 * - First-line preview for markdown
 * - Filter tabs: All | Images | Code | Docs | HTML | Video
 * - Right-click context menu: Open, Download, Copy Path, Delete
 * - Drag to reorder / pin favorites
 * - Empty state: "Your resources will appear here"
 * - Gold accent theme matching GodMode dark UI
 * - Keyboard navigation
 */

import { html, nothing, type TemplateResult } from "lit";
import { FILE_TYPE_ICONS, type FileViewerContentType } from "./file-viewer.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ResourceItem = {
  id: string;
  title: string;
  type: string; // "image" | "video" | "html" | "markdown" | "code" | "doc" | "audio" | "pdf" | "data" | ...
  path?: string;
  url?: string;
  mimeType?: string;
  /** Timestamp (ms) when the resource was created. */
  createdAt?: number;
  /** Whether this resource is pinned. */
  pinned?: boolean;
  /** Session key the resource belongs to. */
  sessionKey?: string;
  /** Optional proof slug for proof documents. */
  proofSlug?: string;
};

export type ResourceFilter = "all" | "images" | "code" | "docs" | "html" | "video";

export type ResourceStripProps = {
  resources: ResourceItem[];
  /** Currently active filter. */
  filter?: ResourceFilter;
  /** Whether the strip is collapsed (header only). */
  collapsed?: boolean;
  /** Currently selected / open resource id. */
  activeId?: string | null;
  /** Called when a resource is clicked to open. */
  onOpen: (resource: ResourceItem) => void;
  /** Called when a resource should be downloaded. */
  onDownload?: (resource: ResourceItem) => void;
  /** Called when resource path should be copied. */
  onCopyPath?: (resource: ResourceItem) => void;
  /** Called when a resource should be deleted. */
  onDelete?: (resource: ResourceItem) => void;
  /** Called when filter changes. */
  onFilterChange?: (filter: ResourceFilter) => void;
  /** Called to toggle collapsed state. */
  onToggleCollapse?: () => void;
  /** Called to navigate to work tab for all resources. */
  onViewAll?: () => void;
  /** Called when a resource is pinned/unpinned. */
  onTogglePin?: (resource: ResourceItem) => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map from resource.type to the FileViewerContentType for icon resolution. */
function typeToContentType(type: string, mimeType?: string): FileViewerContentType {
  const t = type.toLowerCase();
  const m = (mimeType ?? "").toLowerCase();

  if (t === "image" || m.startsWith("image/")) return "image";
  if (t === "video" || m.startsWith("video/")) return "video";
  if (t === "audio" || m.startsWith("audio/")) return "audio";
  if (t === "html" || m === "text/html") return "html";
  if (t === "markdown" || t === "md" || m === "text/markdown") return "markdown";
  if (t === "pdf" || m === "application/pdf") return "pdf";
  if (t === "csv" || t === "data" || m === "text/csv") return "csv";
  if (t === "json" || m === "application/json") return "json";
  if (t === "code" || t === "script" || t === "source") return "code";
  if (t === "doc" || t === "document" || t === "text") return "text";
  return "unknown";
}

/** Pick the filter category for a resource. */
function getResourceFilterCategory(r: ResourceItem): ResourceFilter {
  const ct = typeToContentType(r.type, r.mimeType);
  if (ct === "image" || ct === "svg") return "images";
  if (ct === "video") return "video";
  if (ct === "html") return "html";
  if (ct === "code" || ct === "json" || ct === "csv") return "code";
  return "docs";
}

/** Apply filter to resource list. */
function filterResources(resources: ResourceItem[], filter: ResourceFilter): ResourceItem[] {
  if (filter === "all") return resources;
  return resources.filter((r) => getResourceFilterCategory(r) === filter);
}

/** Format a timestamp relative to now. */
function formatRelativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

/** Truncate a filename to a reasonable display length. */
function truncateTitle(title: string, maxLen = 20): string {
  if (title.length <= maxLen) return title;
  const ext = title.lastIndexOf(".");
  if (ext > 0 && title.length - ext < 8) {
    // Keep extension visible
    const stem = title.slice(0, ext);
    const extension = title.slice(ext);
    const budget = maxLen - extension.length - 2;
    return stem.slice(0, budget) + "…" + extension;
  }
  return title.slice(0, maxLen - 1) + "…";
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

const FILTER_LABELS: Record<ResourceFilter, string> = {
  all: "All",
  images: "Images",
  code: "Code",
  docs: "Docs",
  html: "HTML",
  video: "Video",
};

function renderFilterTabs(props: ResourceStripProps, counts: Record<ResourceFilter, number>): TemplateResult {
  const filters: ResourceFilter[] = ["all", "images", "code", "docs", "html", "video"];
  const active = props.filter ?? "all";

  return html`
    <div class="rs-filter-tabs" role="tablist" aria-label="Resource filter">
      ${filters.map((f) => {
        const count = counts[f] ?? 0;
        // Hide empty filter tabs (except "all")
        if (f !== "all" && count === 0) return nothing;
        return html`
          <button
            class="rs-filter-tab ${active === f ? "rs-filter-tab--active" : ""}"
            role="tab"
            aria-selected=${active === f}
            @click=${() => props.onFilterChange?.(f)}
          >${FILTER_LABELS[f]}${f !== "all" && count > 0 ? html`<span class="rs-filter-count">${count}</span>` : nothing}</button>
        `;
      })}
    </div>
  `;
}

// ── Resource chip renderers ───────────────────────────────────────────────────

function renderResourceChip(resource: ResourceItem, isActive: boolean, props: ResourceStripProps): TemplateResult {
  const ct = typeToContentType(resource.type, resource.mimeType);
  const icon = FILE_TYPE_ICONS[ct] ?? FILE_TYPE_ICONS.unknown;
  const title = truncateTitle(resource.title);
  const time = resource.createdAt ? formatRelativeTime(resource.createdAt) : null;
  const isImage = ct === "image" || ct === "svg";

  // Determine preview content
  let previewEl: TemplateResult | typeof nothing = nothing;
  if (isImage && resource.url) {
    previewEl = html`<img class="rs-chip__thumb" src=${resource.url} alt=${resource.title} loading="lazy" />`;
  } else if (isImage && resource.path) {
    // Path-based images (not URL) — show icon, thumbnail would need server fetch
    previewEl = html`<div class="rs-chip__icon rs-chip__icon--image">${icon}</div>`;
  } else {
    previewEl = html`<div class="rs-chip__icon rs-chip__icon--${ct}">${icon}</div>`;
  }

  // Type badge
  const typeLabels: Record<string, string> = {
    image: "IMG", video: "VID", html: "HTML", markdown: "MD", code: "CODE",
    doc: "DOC", data: "CSV", json: "JSON", pdf: "PDF", audio: "AUD",
  };
  const typeLabel = typeLabels[resource.type?.toLowerCase()] ?? resource.type?.toUpperCase()?.slice(0, 4) ?? "FILE";

  return html`
    <div
      class="rs-chip ${isActive ? "rs-chip--active" : ""} ${resource.pinned ? "rs-chip--pinned" : ""}"
      role="button"
      tabindex="0"
      aria-label="Open ${resource.title}"
      title="${resource.title}${time ? ` (${time})` : ""}"
      draggable="true"
      @click=${() => props.onOpen(resource)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onOpen(resource); }
      }}
      @contextmenu=${(e: MouseEvent) => {
        e.preventDefault();
        showContextMenu(e, resource, props);
      }}
    >
      <div class="rs-chip__preview">
        ${previewEl}
        ${resource.pinned ? html`<div class="rs-chip__pin-indicator" title="Pinned">★</div>` : nothing}
      </div>
      <div class="rs-chip__meta">
        <span class="rs-chip__title">${title}</span>
        <span class="rs-chip__type-row">
          <span class="rs-chip__type-badge">${typeLabel}</span>
          ${time ? html`<span class="rs-chip__time">${time}</span>` : nothing}
        </span>
      </div>
    </div>
  `;
}

// ── Context menu ─────────────────────────────────────────────────────────────

let activeContextMenu: HTMLElement | null = null;

function showContextMenu(e: MouseEvent, resource: ResourceItem, props: ResourceStripProps) {
  // Remove existing menu
  activeContextMenu?.remove();
  activeContextMenu = null;

  const menu = document.createElement("div");
  menu.className = "rs-context-menu";
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;

  const items: Array<{ label: string; icon: string; action: () => void; danger?: boolean }> = [
    { label: "Open", icon: "↗", action: () => props.onOpen(resource) },
    ...(props.onTogglePin ? [{
      label: resource.pinned ? "Unpin" : "Pin",
      icon: resource.pinned ? "☆" : "★",
      action: () => props.onTogglePin!(resource),
    }] : []),
    ...(props.onDownload ? [{
      label: "Download",
      icon: "↓",
      action: () => props.onDownload!(resource),
    }] : []),
    ...(resource.path && props.onCopyPath ? [{
      label: "Copy Path",
      icon: "⎘",
      action: () => props.onCopyPath!(resource),
    }] : []),
    ...(props.onDelete ? [{
      label: "Delete",
      icon: "✕",
      danger: true,
      action: () => props.onDelete!(resource),
    }] : []),
  ];

  for (const item of items) {
    const btn = document.createElement("button");
    btn.className = `rs-context-menu__item${item.danger ? " rs-context-menu__item--danger" : ""}`;
    btn.innerHTML = `<span class="rs-context-menu__icon">${item.icon}</span><span>${item.label}</span>`;
    btn.addEventListener("click", () => {
      item.action();
      menu.remove();
      activeContextMenu = null;
    });
    menu.appendChild(btn);
  }

  document.body.appendChild(menu);
  activeContextMenu = menu;

  // Position correction if off-screen
  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${e.clientX - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${e.clientY - rect.height}px`;
    }
  });

  // Close on click outside
  const closeHandler = (ev: MouseEvent) => {
    if (!menu.contains(ev.target as Node)) {
      menu.remove();
      activeContextMenu = null;
      document.removeEventListener("click", closeHandler);
    }
  };
  // Defer to avoid immediately triggering on the same click
  setTimeout(() => document.addEventListener("click", closeHandler), 0);
}

// ── Empty state ───────────────────────────────────────────────────────────────

function renderEmptyState(): TemplateResult {
  return html`
    <div class="rs-empty">
      <div class="rs-empty__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <path d="M13 2v7h7"/>
          <path d="M9 14h6M9 18h4"/>
        </svg>
      </div>
      <span class="rs-empty__text">Your resources will appear here</span>
    </div>
  `;
}

// ── Main render ───────────────────────────────────────────────────────────────

export function renderResourceStrip(props: ResourceStripProps): TemplateResult {
  const { resources = [], collapsed = false, activeId } = props;
  const filter = props.filter ?? "all";

  // Compute counts per filter tab
  const counts: Record<ResourceFilter, number> = { all: resources.length, images: 0, code: 0, docs: 0, html: 0, video: 0 };
  for (const r of resources) {
    const cat = getResourceFilterCategory(r);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  const filtered = filterResources(resources, filter);

  // Sort: pinned first, then by creation time (most recent first)
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });

  return html`
    <div class="resource-strip ${collapsed ? "resource-strip--collapsed" : ""}">
      <div
        class="resource-strip__header"
        role="button"
        tabindex="0"
        @click=${(e: MouseEvent) => {
          // Don't toggle if clicking "View all" button
          if ((e.target as HTMLElement).closest(".resource-strip__view-all")) return;
          props.onToggleCollapse?.();
        }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onToggleCollapse?.(); }
        }}
        title=${collapsed ? "Show resources" : "Hide resources"}
        style="cursor: pointer;"
      >
        <div class="resource-strip__title-area">
          <span class="resource-strip__label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <path d="M13 2v7h7"/>
            </svg>
            Resources
          </span>
          ${resources.length > 0
            ? html`<span class="resource-strip__count">${resources.length}</span>`
            : nothing}
        </div>
        <div class="resource-strip__controls">
          ${!collapsed && resources.length > 0 && props.onViewAll
            ? html`<button class="resource-strip__view-all" @click=${props.onViewAll} title="View all in Work tab">View all →</button>`
            : nothing}
          <span
            class="resource-strip__collapse-btn"
            aria-expanded=${!collapsed}
          >${collapsed ? "▲" : "▼"}</span>
        </div>
      </div>

      ${!collapsed ? html`
        ${resources.length > 0 ? renderFilterTabs(props, counts) : nothing}
        <div class="resource-strip__scroll" role="list">
          ${sorted.length > 0
            ? sorted.map((r) => renderResourceChip(r, r.id === activeId, props))
            : renderEmptyState()
          }
        </div>
      ` : nothing}
    </div>
  `;
}
