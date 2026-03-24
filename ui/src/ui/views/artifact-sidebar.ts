/**
 * Artifact Sidebar — Enhanced slide-out panel for viewing generated files.
 *
 * Features:
 * - Slide-in from right (like Claude's Artifacts)
 * - Resizable via drag handle (uses existing resizable-divider)
 * - Header: filename, file type badge, close (X), pop-out to new tab, download, copy
 * - All file type renderers from file-viewer.ts
 * - Keyboard shortcuts: Esc to close, ← → to navigate files, F to fullscreen
 * - Smooth open/close animation (300ms ease)
 * - Mobile: full-screen overlay
 * - "View Source" toggle for HTML
 * - Fullscreen mode
 *
 * This is a Lit-compatible render function (no shadow DOM).
 * Integrates with existing sidebar-panel CSS + file-viewer.css.
 */

import { html, nothing, type TemplateResult } from "lit";
import { icons } from "../icons.js";
import {
  renderFileViewerBody,
  detectContentType,
  getTypeLabel,
  getFileTypeIcon,
  type FileViewerProps,
} from "./file-viewer.js";
import type { ResourceItem } from "./resource-strip.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ArtifactSidebarProps = {
  /** Whether the sidebar is open. */
  open: boolean;
  /** The file content (text, base64, etc.) */
  content: string | null;
  /** Any error loading the file. */
  error: string | null;
  /** MIME type hint. */
  mimeType: string | null;
  /** Local file path (for title, type detection, download). */
  filePath: string | null;
  /** Display title. */
  title: string | null;

  /** All resources in the current session (for prev/next navigation). */
  resources?: ResourceItem[];
  /** Currently active resource id (for navigation). */
  activeResourceId?: string | null;

  /** Whether we're showing the HTML source instead of the rendered preview. */
  showHtmlSource?: boolean;
  /** Whether we're in fullscreen mode. */
  fullscreen?: boolean;

  // ── Proof doc mode ───────────────────────────────────────────────────────
  mode?: "resource" | "proof";
  proofSlug?: string | null;
  proofUrl?: string | null;

  // ── Handlers ─────────────────────────────────────────────────────────────
  onClose: () => void;
  /** Navigate to a different resource. */
  onNavigate?: (resource: ResourceItem) => void;
  /** Open content in new browser tab. */
  onPopOut?: () => void;
  /** Download the current file. */
  onDownload?: () => void;
  /** Copy file content to clipboard. */
  onCopy?: () => void;
  /** Copy the file path. */
  onCopyPath?: () => void;
  /** Toggle HTML source view. */
  onToggleHtmlSource?: () => void;
  /** Toggle fullscreen. */
  onToggleFullscreen?: () => void;
  /** Open a file link clicked inside the rendered content. */
  onOpenFile?: (filePath: string) => void;
  /** Push to Google Drive. */
  onPushToDrive?: (filePath: string, account?: string) => void;
  /** Drive accounts for picker. */
  driveAccounts?: Array<{ email: string; client: string; label: string }>;
  showDrivePicker?: boolean;
  driveUploading?: boolean;
  onToggleDrivePicker?: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractFilename(filePath: string | null, title: string | null): string {
  if (filePath) {
    const normalized = filePath.replace(/\\/g, "/").trim();
    const parts = normalized.split("/");
    return parts[parts.length - 1] || filePath;
  }
  return title?.trim() || "Document";
}

function isHtmlContent(mimeType: string | null, filePath: string | null, content: string | null): boolean {
  const ct = detectContentType(filePath, mimeType, content);
  return ct === "html";
}

function buildPopOutContent(content: string, mimeType: string | null): void {
  const type = mimeType?.includes("html") ? "text/html" : "text/plain";
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ── Header ────────────────────────────────────────────────────────────────────

function renderHeader(props: ArtifactSidebarProps): TemplateResult {
  const filename = extractFilename(props.filePath, props.title);
  const ct = detectContentType(props.filePath, props.mimeType, props.content);
  const typeLabel = getTypeLabel(props.filePath, props.mimeType, props.content);
  const typeIcon = getFileTypeIcon(ct);
  const isHtml = isHtmlContent(props.mimeType, props.filePath, props.content);

  // Nav: find prev/next resources
  const resources = props.resources ?? [];
  const currentIdx = resources.findIndex((r) => r.id === props.activeResourceId);
  const prevResource = currentIdx > 0 ? resources[currentIdx - 1] : null;
  const nextResource = currentIdx >= 0 && currentIdx < resources.length - 1 ? resources[currentIdx + 1] : null;

  return html`
    <div class="sidebar-header artifact-sidebar-header">
      <!-- Left: nav + file info -->
      <div class="artifact-sidebar-header__left">
        ${prevResource
          ? html`<button
              class="artifact-nav-btn"
              @click=${() => props.onNavigate?.(prevResource)}
              title="Previous: ${prevResource.title}"
            >←</button>`
          : html`<button class="artifact-nav-btn" disabled title="No previous file">←</button>`
        }
        ${nextResource
          ? html`<button
              class="artifact-nav-btn"
              @click=${() => props.onNavigate?.(nextResource)}
              title="Next: ${nextResource.title}"
            >→</button>`
          : html`<button class="artifact-nav-btn" disabled title="No next file">→</button>`
        }
        <div class="sidebar-title-wrap artifact-title-wrap">
          <div class="artifact-sidebar-header__file">
            <span class="sidebar-type-badge">
              ${typeIcon}
              ${typeLabel}
            </span>
            <span class="sidebar-title">${filename}</span>
          </div>
          ${props.filePath
            ? html`<div class="sidebar-path" title=${props.filePath}>${props.filePath}</div>`
            : nothing}
        </div>
      </div>

      <!-- Right: actions -->
      <div class="sidebar-header-actions artifact-sidebar-header__actions">
        ${isHtml && props.onToggleHtmlSource
          ? html`<button
              class="sidebar-copy-btn ${props.showHtmlSource ? "sidebar-copy-btn--copied" : ""}"
              @click=${props.onToggleHtmlSource}
              title=${props.showHtmlSource ? "Show preview" : "View source"}
            >${props.showHtmlSource ? "Preview" : "Source"}</button>`
          : nothing}

        ${props.content && props.onCopy
          ? html`<button
              class="sidebar-copy-btn"
              @click=${async () => {
                if (!props.content) return;
                const ok = await copyToClipboard(props.content);
                if (ok) props.onCopy?.();
              }}
              title="Copy content"
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg> Copy</button>`
          : nothing}

        ${props.filePath && props.onCopyPath
          ? html`<button
              class="sidebar-copy-btn"
              @click=${() => {
                if (props.filePath) {
                  copyToClipboard(props.filePath).then(() => props.onCopyPath?.());
                }
              }}
              title="Copy file path"
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="m18 13-6 6-6-6M12 7v12M7 4h10"/>
            </svg></button>`
          : nothing}

        ${props.content && props.onPopOut
          ? html`<button
              class="sidebar-copy-btn"
              @click=${() => {
                if (props.content) buildPopOutContent(props.content, props.mimeType);
                props.onPopOut?.();
              }}
              title="Open in new tab"
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
            </svg></button>`
          : nothing}

        ${props.onToggleFullscreen
          ? html`<button
              class="sidebar-copy-btn ${props.fullscreen ? "sidebar-copy-btn--copied" : ""}"
              @click=${props.onToggleFullscreen}
              title=${props.fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              ${props.fullscreen
                ? html`<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>`
                : html`<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`}
            </svg></button>`
          : nothing}

        ${props.onPushToDrive && props.filePath
          ? html`<div class="sidebar-drive-wrap">
              <button
                class="sidebar-open-browser-btn ${props.driveUploading ? "sidebar-drive-uploading" : ""}"
                title="Push to Google Drive"
                ?disabled=${props.driveUploading}
                @click=${() => props.driveUploading
                  ? undefined
                  : props.onToggleDrivePicker
                    ? props.onToggleDrivePicker()
                    : props.onPushToDrive!(props.filePath!)}
              >${props.driveUploading ? "Uploading…" : "⬆ Drive"}</button>
              ${props.showDrivePicker && props.driveAccounts && !props.driveUploading
                ? html`<div class="sidebar-drive-picker">
                    ${props.driveAccounts.length === 0
                      ? html`<div class="sidebar-drive-item sidebar-drive-empty">No Google accounts configured</div>`
                      : props.driveAccounts.map(
                          (acct) => html`
                            <button class="sidebar-drive-item" @click=${() => {
                              props.onPushToDrive!(props.filePath!, acct.email);
                              props.onToggleDrivePicker?.();
                            }}>
                              <span class="sidebar-drive-label">${acct.email.split("@")[0]}</span>
                              <span class="sidebar-drive-domain">@${acct.email.split("@")[1]}</span>
                            </button>
                          `,
                        )}
                  </div>`
                : nothing}
            </div>`
          : nothing}

        <button
          class="btn artifact-close-btn"
          @click=${props.onClose}
          title="Close (Esc)"
          aria-label="Close sidebar"
        >${icons.x}</button>
      </div>
    </div>
  `;
}

// ── Proof doc mode ────────────────────────────────────────────────────────────

function renderProofMode(props: ArtifactSidebarProps): TemplateResult {
  if (!props.proofUrl && !props.content) {
    return html`<div class="fv-empty">Proof document not available.</div>`;
  }
  if (props.proofUrl) {
    return html`<iframe class="fv-html-frame" src=${props.proofUrl} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" title="Proof Document"></iframe>`;
  }
  // Fall through to file viewer
  return renderFileViewerBody({
    content: props.content,
    error: props.error,
    filePath: props.filePath,
    mimeType: props.mimeType,
    title: props.title,
    onOpenFile: props.onOpenFile,
  } satisfies FileViewerProps);
}

// ── Main render ───────────────────────────────────────────────────────────────

export function renderArtifactSidebar(props: ArtifactSidebarProps): TemplateResult {
  if (!props.open) {
    return html`<div class="artifact-sidebar artifact-sidebar--closed" aria-hidden="true"></div>`;
  }

  const fullscreen = props.fullscreen ?? false;
  const mode = props.mode ?? "resource";

  // Determine the content to show (source override for HTML)
  let viewerContent = props.content;
  let viewerMime = props.mimeType;
  if (props.showHtmlSource && props.content) {
    viewerContent = props.content;
    viewerMime = "text/plain";
  }

  const viewerProps: FileViewerProps = {
    content: viewerContent,
    error: props.error,
    filePath: props.filePath,
    mimeType: viewerMime,
    title: props.title,
    onOpenFile: props.onOpenFile,
  };

  return html`
    <div
      class="artifact-sidebar ${fullscreen ? "artifact-sidebar--fullscreen" : ""}"
      role="complementary"
      aria-label="File viewer"
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") { e.preventDefault(); props.onClose(); }
        if (e.key === "f" || e.key === "F") { e.preventDefault(); props.onToggleFullscreen?.(); }
        const resources = props.resources ?? [];
        const idx = resources.findIndex((r) => r.id === props.activeResourceId);
        if (e.key === "ArrowLeft" && idx > 0) {
          e.preventDefault();
          props.onNavigate?.(resources[idx - 1]);
        }
        if (e.key === "ArrowRight" && idx >= 0 && idx < resources.length - 1) {
          e.preventDefault();
          props.onNavigate?.(resources[idx + 1]);
        }
      }}
    >
      ${renderHeader(props)}
      <div class="sidebar-content artifact-sidebar__body">
        ${mode === "proof" ? renderProofMode(props) : renderFileViewerBody(viewerProps)}
      </div>
    </div>
  `;
}
