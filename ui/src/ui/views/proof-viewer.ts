/**
 * proof-viewer.ts — Proof document viewer for the sidebar.
 *
 * Embeds the Proof editor via iframe src URL pointing to the configured
 * Proof API (hosted proofeditor.ai or self-hosted proof-sdk).
 * Falls back to rendering the local markdown mirror when Proof is unavailable.
 */

import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { icons } from "../icons";
import { toSanitizedMarkdownHtml } from "../markdown";

export type ProofViewerProps = {
  slug: string;
  title?: string | null;
  viewUrl?: string | null;
  filePath?: string | null;
  /** Local markdown content for fallback rendering when Proof API is down. */
  fallbackMarkdown?: string | null;
  onClose: () => void;
  onPushToDrive?: (filePath: string, account?: string) => void;
};

/**
 * Render the Proof document viewer in the sidebar.
 * Uses the viewUrl from the Proof API (hosted or self-hosted).
 * Falls back to local markdown rendering when Proof is unavailable.
 */
export function renderProofViewer(props: ProofViewerProps) {
  const title = props.title?.trim() || props.slug;
  const viewUrl = props.viewUrl || "";
  const isFallback = !!props.fallbackMarkdown;

  const fallbackHtml = isFallback
    ? toSanitizedMarkdownHtml(props.fallbackMarkdown!)
    : "";

  return html`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${title}</div>
          <div class="sidebar-path" title=${viewUrl}>
            ${isFallback ? "Local copy — Proof is temporarily unavailable" : "Live co-editing via Proof"}
          </div>
        </div>
        <div class="sidebar-header-actions">
          ${!isFallback && viewUrl
            ? html`<button
                class="btn sidebar-open-browser-btn"
                title="Copy shareable link"
                @click=${async () => {
                  try {
                    await navigator.clipboard.writeText(viewUrl);
                  } catch {
                    window.prompt("Copy Proof link", viewUrl);
                  }
                }}
              >Share</button>`
            : nothing}
          ${props.filePath && props.onPushToDrive
            ? html`<button
                class="btn sidebar-open-browser-btn"
                title="Upload the Proof markdown mirror to Google Drive"
                @click=${() => props.onPushToDrive?.(props.filePath!)}
              >Drive</button>`
            : nothing}
          ${!isFallback
            ? html`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser"
                @click=${() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
              >Open</button>`
            : nothing}
          <button @click=${props.onClose} class="btn" title="Close sidebar">
            ${icons.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        ${isFallback
          ? html`
              <div style="padding: 4px 16px; background: #fff3cd; color: #856404; font-size: 12px; border-bottom: 1px solid #ffc107;">
                Proof is temporarily unavailable. Showing your last-synced local copy.
              </div>
              <div class="markdown-body" style="padding: 16px; overflow-y: auto; flex: 1;">
                ${unsafeHTML(fallbackHtml)}
              </div>`
          : viewUrl
            ? html`<iframe
                src=${viewUrl}
                class="proof-iframe"
                style="width: 100%; height: 100%; border: none; flex: 1;"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              ></iframe>`
            : html`<div style="padding: 24px; color: #888;">No Proof URL available. Is the Proof API reachable?</div>`
        }
      </div>
    </div>
  `;
}
